import { IItemCover, ISmartMetadataItem } from "../ISmartMetadataItem";

export default interface IModalCompareSmartMetadataState {
    itemOneTitle?: string;
    itemTwoTitle?: string;
    itemOneTaxType?: string;
    itemTwoTaxType?: string;
    itemOneSortOrder?: string;
    itemTwoSortOrder?: string;
    itemOneSmartSuggestions?: boolean;
    itemTwoSmartSuggestions?: boolean;
    itemOneIsVisible?: boolean;
    itemTwoIsVisible?: boolean;
    itemOneStatus?: string | number;
    itemTwoStatus?: string | number;
    itemOneHelpDescription?: string;
    itemTwoHelpDescription?: string;
    itemOneImage?: IItemCover;
    itemTwoImage?: IItemCover;
    itemOneChildItems?: ISmartMetadataItem[];
    itemTwoChildItems?: ISmartMetadataItem[];
    itemOneChildItemsSelected?: ISmartMetadataItem[];
    itemTwoChildItemsSelected?: ISmartMetadataItem[];
    itemOneTasks?: any[];
    itemTwoTasks?: any[];
    itemOneTasksSelected?: any[];
    itemTwoTasksSelected?: any[];
}