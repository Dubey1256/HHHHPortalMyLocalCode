import { IColumn, IContextualMenuProps } from "@fluentui/react";

export interface ITasksViewAppState {
    isLoading: boolean;    
    siteItems: any[];
    taskUsers: any[];
    allTaskItems: any[];
    displayedTaskItems: any[];
    columns: IColumn[];
    searchText: string;
    contextualMenuProps: IContextualMenuProps
    showResetFilter: boolean;
    showSearchPanel: boolean;
    searchField: string;
}