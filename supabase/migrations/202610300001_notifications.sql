-- Server-only application data. The browser's anon/authenticated roles have no access.
begin;
create table public.silent_challenges (
  token_hash text primary key,
  wallet text not null check (wallet ~ '^0x[0-9a-f]{40}$'),
  message text not null,
  expires_at timestamptz not null
);
create index silent_challenges_expiry on public.silent_challenges(expires_at);
create table public.silent_sessions (
  token_hash text primary key,
  wallet text not null check (wallet ~ '^0x[0-9a-f]{40}$'),
  expires_at timestamptz not null
);
create index silent_sessions_expiry on public.silent_sessions(expires_at);
create table public.silent_limits (
  bucket text primary key,
  hits integer not null,
  expires_at timestamptz not null
);
create table public.silent_subscriptions (
  id uuid primary key default gen_random_uuid(),
  chain_id integer not null,
  vault text not null check (vault ~ '^0x[0-9a-f]{40}$'),
  wallet text not null check (wallet ~ '^0x[0-9a-f]{40}$'),
  email_ciphertext text not null,
  email_hash text not null,
  role text not null check (role in ('owner','guardian','beneficiary')),
  verification_hash text unique,
  verification_expires timestamptz,
  verified_at timestamptz,
  consent_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique(chain_id, vault, wallet)
);
create index silent_subscriptions_vault on public.silent_subscriptions(chain_id, vault) where verified_at is not null;
create table public.silent_deliveries (
  id uuid primary key default gen_random_uuid(),
  subscription_id uuid not null references public.silent_subscriptions(id) on delete cascade,
  idempotency_key text unique not null,
  kind text not null,
  status text not null default 'processing' check (status in ('processing','accepted','delivered','failed','bounced','complained','manual_review')),
  provider_id text unique,
  attempts integer not null default 1,
  lease_until timestamptz not null default now() + interval '2 minutes',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index silent_deliveries_subscription on public.silent_deliveries(subscription_id, created_at desc);
create table public.silent_webhook_events (
  event_id text primary key,
  created_at timestamptz not null default now()
);
create function public.silent_consume_challenge(p_hash text)
returns setof public.silent_challenges language sql security invoker set search_path = '' as $$
  delete from public.silent_challenges where token_hash = p_hash and expires_at > now() returning *;
$$;
create function public.silent_rate_limit(p_bucket text, p_max integer, p_seconds integer)
returns boolean language plpgsql security invoker set search_path = '' as $$
declare current_hits integer;
begin
  if p_max < 1 or p_seconds < 1 then raise exception 'Invalid rate limit'; end if;
  insert into public.silent_limits(bucket,hits,expires_at)
  values(p_bucket,1,now() + make_interval(secs => p_seconds))
  on conflict(bucket) do update set
    hits = case when silent_limits.expires_at <= now() then 1 else silent_limits.hits + 1 end,
    expires_at = case when silent_limits.expires_at <= now() then excluded.expires_at else silent_limits.expires_at end
  returning hits into current_hits;
  return current_hits <= p_max;
end;
$$;
create function public.silent_acquire_delivery(p_key text, p_subscription uuid, p_kind text)
returns setof public.silent_deliveries language plpgsql security invoker set search_path = '' as $$
begin
  update public.silent_deliveries set status='manual_review',updated_at=now()
  where idempotency_key=p_key and status in ('failed','processing') and created_at <= now() - interval '23 hours';
  return query insert into public.silent_deliveries(subscription_id,idempotency_key,kind)
  values(p_subscription,p_key,p_kind)
  on conflict(idempotency_key) do update set
    status = 'processing', attempts = silent_deliveries.attempts + 1,
    lease_until = now() + interval '2 minutes', updated_at = now()
  where silent_deliveries.status in ('failed','processing')
    and silent_deliveries.lease_until < now()
    -- Provider idempotency expires after 24h: never automatically retry uncertain older sends.
    and silent_deliveries.created_at > now() - interval '23 hours'
  returning *;
end;
$$;
create function public.silent_apply_webhook(p_event text, p_provider text, p_status text)
returns boolean language plpgsql security invoker set search_path = '' as $$
declare delivery uuid; inserted integer;
begin
  if p_status not in ('delivered','bounced','complained','failed') then raise exception 'Invalid delivery status'; end if;
  select id into delivery from public.silent_deliveries where provider_id=p_provider for update;
  if delivery is null then return false; end if;
  insert into public.silent_webhook_events(event_id) values(p_event) on conflict do nothing;
  get diagnostics inserted = row_count;
  if inserted = 0 then return true; end if;
  update public.silent_deliveries set status=p_status,updated_at=now() where id=delivery
    and (status in ('processing','accepted','failed') or (p_status in ('bounced','complained') and status='delivered'));
  return true;
end;
$$;
create function public.silent_verify_email(p_hash text)
returns boolean language plpgsql security invoker set search_path = '' as $$
declare changed integer;
begin
  update public.silent_subscriptions set verified_at=now(),verification_hash=null,verification_expires=null
    where verification_hash=p_hash and verification_expires > now() and verified_at is null;
  get diagnostics changed = row_count;
  return changed = 1;
end;
$$;
do $$ declare t text; begin
  foreach t in array array['silent_challenges','silent_sessions','silent_limits','silent_subscriptions','silent_deliveries','silent_webhook_events'] loop
    execute format('alter table public.%I enable row level security',t);
    execute format('revoke all on public.%I from public, anon, authenticated',t);
    execute format('grant select, insert, update, delete on public.%I to service_role',t);
  end loop;
end $$;
revoke all on function public.silent_consume_challenge(text) from public,anon,authenticated;
revoke all on function public.silent_rate_limit(text,integer,integer) from public,anon,authenticated;
revoke all on function public.silent_acquire_delivery(text,uuid,text) from public,anon,authenticated;
revoke all on function public.silent_verify_email(text) from public,anon,authenticated;
revoke all on function public.silent_apply_webhook(text,text,text) from public,anon,authenticated;
grant execute on function public.silent_consume_challenge(text), public.silent_rate_limit(text,integer,integer), public.silent_acquire_delivery(text,uuid,text), public.silent_verify_email(text) to service_role;
grant execute on function public.silent_apply_webhook(text,text,text) to service_role;
commit;
