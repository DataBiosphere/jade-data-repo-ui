// from https://github.com/broadinstitute/sam/blob/1b67d8b60fb3fb15ecc70a1eccb3408f2ee43bec/src/main/resources/swagger/api-docs.yaml#L2241
// specification of a managed group with an access policy and the email associated with the managed group
// Note: we should proxy this call through TDR rather than call Sam directly
export interface ManagedGroupMembershipEntry {
  groupEmail: string;
  groupName: string;
  role: string;
}
