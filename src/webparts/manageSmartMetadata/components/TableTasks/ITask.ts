export default interface ITask {
    ID?: number;
    Site?: string;
    Title?: string;
    Percent?: number;
    Created?: Date;
    Modified?: Date;
    DueDate?: Date;
    "odata.editlink"?: string;
    SharewebCategoriesId?: number[];
    SharewebTaskType?: {Title?:string,Level?:number,Id?:number};
    SharewebTaskLevel1No?: string;
    SharewebTaskLevel2No?: string;
    ComponentId?: {results: number[]} | undefined;
    EventsId?: {results: number[]} | undefined;
    ServicesId?: {results: number[]} | undefined;
}