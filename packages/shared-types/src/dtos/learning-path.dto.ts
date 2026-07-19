import { LearningPathStatus } from '../enums/learning-path-status.enum';

export interface LearningPathDto {
  id: string;
  userId: string;
  created_at: Date;
}

export interface LearningPathModuleDto {
  id: string;
  learningPathId: string;
  moduleId: string;
  order: number;
  status: LearningPathStatus;
  generated_content: string | null;
}
