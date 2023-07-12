import { IItemCover, IParent } from "../ISmartMetadataItem";

export default interface IModalEditSmartMetadataState {
    selTabKey: string;
    itemId: number;
    title: string;
    longTitle: string;
    altTitle: string;
    sortOrder: string;
    status: string | number;
    itemRank: string | number;
    helpDescription: string;
    isVisible: boolean;
    selectable: boolean;
    smartSuggestions: boolean; 
    itemCover: IItemCover;
    parent: IParent;
    parentItemId?: number;
    selTabKeyUploadImage: string;
    showChangeParent: boolean;
    selImageFolder?: string;
    uploadedImage?: IUploadedImage;
}

export interface IUploadedImage {
    fileName?: string;
    fileURL?: string;
}