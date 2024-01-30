import { WebPartContext } from "@microsoft/sp-webpart-base";
export interface IEventRecurrenceInfoProps {
  display: boolean;
  recurrenceData: string;
  startDate: Date;
  context: WebPartContext;
  siteUrl: string;
  selectedKey: any;
  selectedRecurrenceRule: any;
  returnRecurrenceData: (startDate: Date, endDate: Date, recurrenceData: string) => void;
}