import { Task } from "./Task";
import { TaskGroup } from "./TaskGroup";

export class Project {
    id: string;
    name: string;
    userId: string;
    isDefault: boolean;
    isFavorite: boolean;
    defaultTaskGroupId: boolean;
    taskGroups: TaskGroup[];
    tasks: Task[];
    sortOrder: number;
    createdAt: Date;
    modifiedAt: Date;
    deletedAt: Date;
}