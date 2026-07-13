import type { ModuleType } from '../enums/module-type.enum.js';
export interface ModuleDto {
    id: string;
    title: string;
    description: string;
    type: ModuleType;
    orderIndex: number;
    learningPathId: string;
    estimatedMinutes: number;
    completed: boolean;
}
export interface CreateModuleDto {
    title: string;
    description: string;
    type: ModuleType;
    orderIndex: number;
    estimatedMinutes: number;
}
//# sourceMappingURL=module.dto.d.ts.map