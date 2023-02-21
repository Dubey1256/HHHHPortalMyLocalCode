export interface ITeamGroupsState {
    tasks: any[];
    sortedItems: any[];
    columns: any[];
    searchText: string;
    showCreatePanel: boolean;
    showEditPanel: boolean;
    hideDeleteDialog: boolean;
    selTaskId: number;
    enableSave: boolean;
    showDelete: boolean;
    taskItem: ITaskItem;
}

interface ITaskItem {
    userId?: number;
    userMail?: string[];
    approverId?: any;
    userTitle?: string;
    userSuffix?: string;
    groupTitle?: string;
    groupSuffix?: string;
    sortOrder?: any;
    status?: boolean;
    isDeleted?: boolean;
    itemType?: string;
    isActive?: boolean;
    company?: any;
    isTaskNotifications?: boolean;
    isShowTeamLeader?: boolean;
    isApprovalMail?: string;
    isShowCommentUser?: boolean;
    isShowReportPage?: boolean;
    createdOn?: string;
    createdBy?: string;
    modifiedOn?: string;
    modifiedBy?: string;
}