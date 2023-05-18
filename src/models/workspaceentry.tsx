import { PolicyModel } from 'generated/tdr';

export interface SnapshotWorkspaceEntry {
  title: string;
  link: string | null;
  id: string;
  policyModels: Array<PolicyModel>;
}
