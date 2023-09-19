import { WebPartContext } from "@microsoft/sp-webpart-base";
import spservices from "../../../spservices/spservices";

export interface ITeamMembersProps {
    tasks: any[];
    spService: spservices;
    context: WebPartContext;
    loadTasks: any;
    teamGroups: any[];
    taskUsersListId: string;
    smartMetadataListId: string;
    imagesLibraryId: string;
    defaultApproverEMail: string;
}