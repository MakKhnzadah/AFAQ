import { get } from './apiClient';

export interface ClassroomOption {
  id: string;
  name: string;
  description?: string | null;
  active: boolean;
  displayOrder: number;
}

export async function fetchClassrooms(): Promise<ClassroomOption[]> {
  return get<ClassroomOption[]>('/api/public/classrooms');
}
