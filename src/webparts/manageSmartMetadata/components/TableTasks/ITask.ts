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
    TaskType?: {Title?:string,Level?:number,Id?:number};
    TaskLevel?: string;
    ComponentId?: {results: number[]} | undefined;
    EventsId?: {results: number[]} | undefined;
    ServicesId?: {results: number[]} | undefined;
}