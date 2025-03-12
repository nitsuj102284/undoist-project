import { Project } from "./Project";

export class User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    profileImage: string;
    test: string;
    projects: Project[];
}