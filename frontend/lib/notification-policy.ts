export type NotificationKind =
  | "deadline_reminder"
  | "recovery_started"
  | "guardian_action"
  | "inheritance_available";
export type NotificationRole = "owner" | "guardian" | "beneficiary";
export type NotificationState = {
  state: number;
  deadline: bigint;
  nonce: bigint;
  now: bigint;
  approvals: bigint | number;
  threshold: number;
};
export function notificationKinds(
  s: NotificationState,
  role: NotificationRole,
): NotificationKind[] {
  if (
    role === "owner" &&
    s.state === 0 &&
    s.deadline > s.now &&
    s.deadline - s.now <= 86400n
  )
    return ["deadline_reminder"];
  if (role === "owner" && s.state === 1) return ["recovery_started"];
  if (role === "guardian" && s.state === 1 && s.approvals < s.threshold)
    return ["guardian_action"];
  if (role === "beneficiary" && (s.state === 2 || s.state === 3))
    return ["inheritance_available"];
  return [];
}
export function notificationKey(
  chainId: number,
  vault: string,
  subscription: string,
  kind: NotificationKind,
  s: Pick<NotificationState, "nonce" | "deadline">,
) {
  return [
    "silent-v1",
    chainId,
    vault.toLowerCase(),
    subscription,
    kind,
    s.nonce,
    s.deadline,
  ].join(":");
}
export const notificationText: Record<
  NotificationKind,
  { subject: string; text: string }
> = {
  deadline_reminder: {
    subject: "Your vault check-in is approaching",
    text: "Your check-in deadline is within 24 hours. Open SilentSovereign to review the deadline and check in using your wallet.",
  },
  recovery_started: {
    subject: "Review a recovery request",
    text: "Your vault has a pending recovery request. Review it now. If appropriate, use the owner wallet to cancel before authorization. Email cannot cancel recovery.",
  },
  guardian_action: {
    subject: "A vault needs guardian review",
    text: "A recovery request is pending and guardian quorum has not been reached. Open SilentSovereign and review the request before deciding whether to approve with your guardian wallet.",
  },
  inheritance_available: {
    subject: "Review your inheritance allocation",
    text: "Recovery has been authorized. Open SilentSovereign to check your currently claimable allocation. Release schedules and additional emergency conditions still apply.",
  },
};
