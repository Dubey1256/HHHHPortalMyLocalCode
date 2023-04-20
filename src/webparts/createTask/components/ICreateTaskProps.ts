export interface ICreateTaskProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  pageContext:any;
  MasterTaskListID: 'MasterTaskListID';
  TaskUsertListID: 'TaskUsertListID';
  SmartMetadataListID: 'SmartMetadataListID'  
}