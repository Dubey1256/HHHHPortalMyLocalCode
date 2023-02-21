import { IContextualMenuItem, IDropdownOption } from "office-ui-fabric-react";

export interface ITeamMembersState {
    tasks: any[];
    sortedItems: any[];
    columns: any[];
    searchText: string;
    showCreatePanel: boolean;
    showEditPanel: boolean;
    enableSave: boolean;
    hideDeleteDialog: boolean;
    selTaskId: number;
    taskItem: ITaskItem;
    timesheetCategories: IDropdownOption[];
    teamGroups: IDropdownOption[];
    smartMetadataItems: IContextualMenuItem[];
    hideSmartMetadataMenu: boolean;
    selImageFolder: string;
    allImages: any[];
    filteredImages: any[];
    uploadedImage?: IFile;
    selImageId?: number;
    onImageHover: boolean;
}

interface ITaskItem {
    userId?: number;
    userMail?: string[];
    approverId?: any;
    approverMail?: string[];
    userTitle?: string;
    userSuffix?: string;
    sortOrder?: string;
    groupId?: string;    
    status?: boolean;
    isDeleted?: boolean;
    itemType?: string;    
    timeCategory?: string;
    approvalType?: string;
    selSmartMetadataItems?: any[];
    company?: any;
    roles?: string[];
    isActive?: boolean;
    isTaskNotifications?: boolean;
    itemCover?: string;
    createdOn?: string;
    createdBy?: string;
    modifiedOn?: string;
    modifiedBy?: string;
}

interface IFile {
    fileURL: string;
    fileName: string;
}