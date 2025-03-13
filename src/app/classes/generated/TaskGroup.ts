import { Task } from "./Task";

export class TaskGroup {
    id: string;
    title: string;
    projectId: string;
    catchAll: boolean;
    sortOrder: number;
    createdAt: Date;
    modifiedAt: Date;
    deletedAt: Date;
    tasks: Task[];
}