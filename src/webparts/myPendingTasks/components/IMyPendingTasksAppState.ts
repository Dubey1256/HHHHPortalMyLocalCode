import { IColumn, IContextualMenuProps } from "@fluentui/react";

export interface IMyPendingTasksAppState {
    currentUserId: number;
    currentUserInfo: any;
    taskUsers: any[];
    sMetadataItems: any[];
    searchText: string;
    allPendingTasks: any[];
    displayedPendingTasks: any[];
    isLoading: boolean;
    columns: IColumn[];
    hideActionDialog: boolean;
    actionDialogHeaderText: string;
    actionDialogPrimaryButtonText: string;
    comments: string;
    allTaskComments: any[];
    selTaskItem: any;
    filterFields?: any[];
    contextualMenuProps: IContextualMenuProps;
    showResetFilter: boolean;
};