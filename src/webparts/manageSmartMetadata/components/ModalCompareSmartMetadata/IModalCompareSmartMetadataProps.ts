import { ISmartMetadataItem } from "../ISmartMetadataItem";
//import ITaskItem from "../ITaskItem";

export default interface IModalCompareSmartMetadataProps {
    showCompareSmartMetadata: boolean;
    sMetadataItemOne: ISmartMetadataItem;
    sMetadataItemOneTasks: any[];
    sMetadataItemTwo: ISmartMetadataItem;
    sMetadataItemTwoTasks: any[];
    hideModalCompareSmartMetadata: ()=>void;
    compareAndUpdateSmartMetadata: (updateType: string, itemOneId: number, itemTwoId: number, itemOne: ISmartMetadataItem, itemTwo: ISmartMetadataItem, itemOneChildItems: ISmartMetadataItem[], itemTwoChildItems: ISmartMetadataItem[], itemOneTasks: any[], itemTwoTasks: any[])=>void;
}