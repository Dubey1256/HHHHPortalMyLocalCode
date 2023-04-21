import { WebPartContext } from "@microsoft/sp-webpart-base";
import spservices from "../../../spservices/spservices";

export interface ITeamGroupsProps {
    tasks: any[];
    spService: spservices;
    context: WebPartContext;
    loadTasks: any;
    taskUsersListId: string;
}