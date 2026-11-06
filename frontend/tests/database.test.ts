import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";

test("actual Postgres schema enforces private access, single-use consent and delivery leases", async () => {
  const db = new PGlite();
  try {
    await db.exec(
      "create role anon; create role authenticated; create role service_role bypassrls; grant usage on schema public to service_role;",
    );
    await db.exec(
      await readFile(
        new URL(
          "../../supabase/migrations/202610300001_notifications.sql",
          import.meta.url,
        ),
        "utf8",
      ),
    );
    const wallet = `0x${"11".repeat(20)}`;
    await db.query(
      "insert into silent_challenges values ('nonce',$1,'message',now()+interval '1 minute'),('expired',$1,'old',now()-interval '1 second')",
      [wallet],
    );
    const used = await Promise.all([
      db.query("select * from silent_consume_challenge('nonce')"),
      db.query("select * from silent_consume_challenge('nonce')"),
    ]);
    assert.equal(
      used.reduce((sum, r) => sum + r.rows.length, 0),
      1,
    );
    assert.equal(
      (await db.query("select * from silent_consume_challenge('expired')")).rows
        .length,
      0,
    );
    const sub = await db.query<{ id: string }>(
      "insert into silent_subscriptions(chain_id,vault,wallet,email_ciphertext,email_hash,role,verification_hash,verification_expires) values(11155111,$1,$1,'encrypted','hash','owner','verify',now()+interval '1 minute') returning id",
      [wallet],
    );
    const id = sub.rows[0].id;
    assert.equal(
      (
        await db.query<{ ok: boolean }>(
          "select silent_verify_email('verify') as ok",
        )
      ).rows[0].ok,
      true,
    );
    assert.equal(
      (
        await db.query<{ ok: boolean }>(
          "select silent_verify_email('verify') as ok",
        )
      ).rows[0].ok,
      false,
    );
    const acquired = await Promise.all([
      db.query(
        "select * from silent_acquire_delivery('same',$1,'recovery_started')",
        [id],
      ),
      db.query(
        "select * from silent_acquire_delivery('same',$1,'recovery_started')",
        [id],
      ),
    ]);
    assert.equal(
      acquired.reduce((sum, r) => sum + r.rows.length, 0),
      1,
    );
    await db.exec(
      "update silent_deliveries set status='failed',lease_until=now()-interval '1 second'",
    );
    assert.equal(
      (
        await db.query(
          "select * from silent_acquire_delivery('same',$1,'recovery_started')",
          [id],
        )
      ).rows.length,
      1,
    );
    await db.exec(
      "update silent_deliveries set status='accepted',lease_until=now()-interval '1 second'",
    );
    assert.equal(
      (
        await db.query(
          "select * from silent_acquire_delivery('same',$1,'recovery_started')",
          [id],
        )
      ).rows.length,
      0,
    );
    assert.equal(
      (
        await db.query<{ ok: boolean }>(
          "select silent_apply_webhook('early','provider-123','delivered') as ok",
        )
      ).rows[0].ok,
      false,
    );
    await db.exec("update silent_deliveries set provider_id='provider-123'");
    assert.equal(
      (
        await db.query<{ ok: boolean }>(
          "select silent_apply_webhook('event-1','provider-123','delivered') as ok",
        )
      ).rows[0].ok,
      true,
    );
    assert.equal(
      (
        await db.query<{ ok: boolean }>(
          "select silent_apply_webhook('event-1','provider-123','delivered') as ok",
        )
      ).rows[0].ok,
      true,
    );
    await db.exec(
      "select silent_apply_webhook('late-failure','provider-123','failed')",
    );
    assert.equal(
      (
        await db.query<{ status: string }>(
          "select status from silent_deliveries",
        )
      ).rows[0].status,
      "delivered",
    );
    await db.exec(
      "update silent_deliveries set status='failed',lease_until=now()-interval '1 second',created_at=now()-interval '25 hours'",
    );
    assert.equal(
      (
        await db.query(
          "select * from silent_acquire_delivery('same',$1,'recovery_started')",
          [id],
        )
      ).rows.length,
      0,
    );
    assert.equal(
      (
        await db.query<{ ok: boolean }>(
          "select silent_rate_limit('test',1,60) as ok",
        )
      ).rows[0].ok,
      true,
    );
    assert.equal(
      (
        await db.query<{ ok: boolean }>(
          "select silent_rate_limit('test',1,60) as ok",
        )
      ).rows[0].ok,
      false,
    );
    await db.exec("set role anon");
    await assert.rejects(
      db.query("select * from silent_subscriptions"),
      /permission denied/,
    );
    await assert.rejects(
      db.query("select silent_verify_email('verify')"),
      /permission denied/,
    );
    await db.exec("reset role; set role authenticated");
    await assert.rejects(
      db.query("select * from silent_sessions"),
      /permission denied/,
    );
    await db.exec("reset role; set role service_role");
    assert.equal(
      (await db.query("select * from silent_subscriptions")).rows.length,
      1,
    );
    await db.query("delete from silent_subscriptions where id=$1", [id]);
    assert.equal(
      (await db.query("select * from silent_deliveries")).rows.length,
      0,
    );
  } finally {
    await db.close();
  }
});
