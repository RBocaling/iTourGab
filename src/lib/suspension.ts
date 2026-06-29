export function isSuspendedEntity(
  entity?: { is_suspended?: boolean | null } | null,
): boolean {
  return Boolean(entity?.is_suspended);
}
