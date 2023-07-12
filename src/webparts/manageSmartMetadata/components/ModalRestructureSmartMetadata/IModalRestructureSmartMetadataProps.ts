import { ISmartMetadataItem } from "../ISmartMetadataItem";

export default interface IModalRestructureSmartMetadataProps {
    showRestructureSmartMetadata: boolean;
    restructureItem: ISmartMetadataItem;
    selSMetadataItems: ISmartMetadataItem[];
    hideModalRestructureSmartMetadata: ()=>void;
    restructureAndUpdateSmartMetadata: (parentItemId: number, sMetadataItems: ISmartMetadataItem[])=>void;
}