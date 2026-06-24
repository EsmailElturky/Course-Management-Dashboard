import { ToastSeverity } from '../enums';

export interface ToastMessage {
  id: number;
  severity: ToastSeverity;
  summary: string;
  detail?: string;
}
