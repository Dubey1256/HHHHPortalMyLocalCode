export interface ILastModifiedItemsAppState {
    navItems?: INavItem[];
    selNavItem?: INavItem;
    configItems?: any[];
    listLastModifiedItems?: any[];
    filteredItems?: any[];
    searchText: string;
    componentsChecked: boolean;
    serviceChecked: boolean;
    taskUsers: any[];
    hideDeleteDialog: boolean;
    showResetFilters: boolean;
    resetRecords: boolean;
}

export interface INavItem {
    columns?: string;
    displaySiteName?: string;
    listId?: string;
    site?: string;
    siteIcon?: string;
    siteUrl?: string;
    sortOrder?: string;
    tabName?: string;
    title?: string;
}