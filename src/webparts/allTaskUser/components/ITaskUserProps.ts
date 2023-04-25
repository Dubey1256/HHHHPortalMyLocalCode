import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface ITaskUserProps {
    userDisplayName: string;
    context: WebPartContext;
    taskUsersListId: string;
    smartMetadataListId: string;
    imagesLibraryId: string;
}