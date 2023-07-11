import { ISmartMetadataItem } from "./ISmartMetadataItem";
import ITask from "./TableTasks/ITask";

export interface IManageSmartMetadataState {
    tabs: any[];
    selTabKey: string;
    sMetadataItems: any[];
    sMetadataItemsDisplay: any[];
    showAddSmartMetadata: boolean;
    showEditSmartMetadata: boolean;
    showCompareSmartMetadata: boolean;
    showRestructureSmartMetadata: boolean;
    showDeleteSmartMetadata: boolean;
    selectedRows?: any[];
    sMetadataItemEdit?: ISmartMetadataItem;
    sMetadataItemEditParents?: ISmartMetadataItem[];
    sMetadataItemEditTasks?: ITask[];
    sMetadataItemRestructure?: ISmartMetadataItem;
    sMetadataItemDelete?: ISmartMetadataItem;
    sMetadataItemDeleteParents?: ISmartMetadataItem[];
    sMetadataItemOneTasks?: any[];
    sMetadataItemTwoTasks?: any[];
}