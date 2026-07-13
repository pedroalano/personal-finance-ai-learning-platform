import type { LearningPathStatus } from '../enums/learning-path-status.enum.js';
export interface LearningPathDto {
    id: string;
    title: string;
    description: string;
    status: LearningPathStatus;
    progressPercent: number;
    userId: string;
    createdAt: string;
    updatedAt: string;
}
export interface CreateLearningPathDto {
    title: string;
    description: string;
}
//# sourceMappingURL=learning-path.dto.d.ts.map