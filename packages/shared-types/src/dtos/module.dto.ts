import { ModuleType } from '../enums/module-type.enum';

export interface ModuleDto {
  id: string;
  topicId: string;
  title: string;
  content: string;
  difficulty: number;
  type: ModuleType;
  prerequisites: string[];
}
