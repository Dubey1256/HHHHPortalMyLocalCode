export interface IListProvisioningProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  pageContext:any;
  MasterTaskListID: 'MasterTaskListID';
  TaskTypesListID: 'TaskTypesListID';
  SmartMetadataListID: 'SmartMetadataListID';
  SmartInfoListID: 'SmartInfoListID';
  TaskTimeSheetListID: 'TaskTimeSheetListID';
  ProvisioningListID: 'ProvisioningListID';
}
