import { WebPartContext } from "@microsoft/sp-webpart-base";
export interface  IEventRecurrenceInfoWeeklyProps {
  display:boolean;
  recurrenceData: string;
  startDate:Date;
  context: WebPartContext;
  siteUrl:string;
  DueDate:any;
  returnRecurrenceData: (startDate:Date,endDat:Date,erecurrenceData:string) => void;
}