import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface ICalendarProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  siteUrl : string;
  SmalsusLeaveCalendar:string;
  context: WebPartContext;
}
