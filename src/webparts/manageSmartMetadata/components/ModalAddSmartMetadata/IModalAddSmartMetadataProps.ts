import { INewSmartMetadataItem } from "./IModalAddSmartMetadataState";

export default interface IModalAddSmartMetadataProps {
    showAddSmartMetadata: boolean;
    hideModalAddSmartMetadata: ()=>void;
    parentItem: any;
    createSmartMetadata: (newSmartMetadataItem: INewSmartMetadataItem | INewSmartMetadataItem[], parentItemId: number, showEditPopup: boolean)=>void;
}