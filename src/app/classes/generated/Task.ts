export class Task {
    id: string;
    title: string;
    description: string;
    date: Date;
    priorityId: number;
    projectId: string;
    taskGroupId: string;
    parentTaskId: string;
    sortOrder: number;
    completedAt: Date;
    createdAt: Date;
    modifiedAt: Date;
    deletedAt: Date;
    childTasks: Task[];
}