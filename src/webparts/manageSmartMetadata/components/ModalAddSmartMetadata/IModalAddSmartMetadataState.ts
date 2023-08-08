export default interface IModalAddSmartMetadataState {
    createSMItem: INewSmartMetadataItem;
    createSMChildItems: INewSmartMetadataItem[];
}

export interface INewSmartMetadataItem {
    Title?: string;
    Description?: string;
    Key?: number;
}