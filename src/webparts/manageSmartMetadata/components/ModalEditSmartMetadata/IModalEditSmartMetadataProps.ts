import { ISmartMetadataItem } from "../ISmartMetadataItem";
import ITask from "../TableTasks/ITask";
import { IUploadedImage } from "./IModalEditSmartMetadataState";

export default interface IModalEditSmartMetadataProps {
    showEditSmartMetadata: boolean;
    sMetadataItem: ISmartMetadataItem;
    sMetadataItemParents: ISmartMetadataItem[];
    sMetadataItemTasks: ISmartMetadataItem[];
    sMetadataRootLevelItems: ISmartMetadataItem[];
    hideModalEditSmartMetadata: ()=>void;
    updateSmartMetadata: (sMetadataItemEdit: ISmartMetadataItem, itemId: number) => void;
    uploadImage: (fileName: string, uploadedImage: IUploadedImage) => Promise<string>;
    removeTaskCategories: (selTaskItems: ITask[])=>void;
}