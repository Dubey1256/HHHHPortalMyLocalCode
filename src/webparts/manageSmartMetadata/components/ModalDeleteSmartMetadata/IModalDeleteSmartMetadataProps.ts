import { ISmartMetadataItem } from "../ISmartMetadataItem";

export default interface IModalDeleteSmartMetadataProps {
    showDeleteSmartMetadata: boolean;
    deleteSMetaDataItem: ISmartMetadataItem;
    deleteSMetaDataParentItems: ISmartMetadataItem[];
    hideModalDeleteSmartMetadata: ()=>void;
    showModalEditSmartMetadata: (sMetadataItemEdit: ISmartMetadataItem, sMetadataParentItems: ISmartMetadataItem[])=>void;
    showModalDeleteSmartMetadata: (sMetadataItem: ISmartMetadataItem, sMetadataParentItems: ISmartMetadataItem[])=>void;
    deleteSmartMetadata: (sMetadataItemDelete: ISmartMetadataItem)=>void;
    deleteAndArchiveSmartMetadata: (sMetadataItemDelete: ISmartMetadataItem)=>void;
}