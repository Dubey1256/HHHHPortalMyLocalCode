import { WebPartContext } from "@microsoft/sp-webpart-base";
export interface  IEventRecurrenceInfoMonthlyProps {
  display:boolean;
  recurrenceData: string;
  startDate:Date;
  context: WebPartContext;
  siteUrl:string;
  DueDate:any;
  returnRecurrenceData: (startDate:Date,endDate:Date,recurrenceData:string) => void;
}