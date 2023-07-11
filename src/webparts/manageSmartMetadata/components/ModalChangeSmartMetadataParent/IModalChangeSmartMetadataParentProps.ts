import { ISmartMetadataItem } from "../ISmartMetadataItem";

export default interface IModalChangeSmartMetadataParentProps {
    showModalChangeParent: boolean;
    sMetadataItem: ISmartMetadataItem;
    rootLevelSMetadataItems: ISmartMetadataItem[];
    hideModalChangeParent: ()=>void;
    saveModalChangeParent: (parentItemId: number | string)=>void;
}