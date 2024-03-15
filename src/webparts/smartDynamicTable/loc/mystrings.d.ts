declare interface ISmartDynamicTableWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  AppLocalEnvironmentSharePoint: string;
  AppLocalEnvironmentTeams: string;
  AppSharePointEnvironment: string;
  AppTeamsTabEnvironment: string;
}

declare module 'SmartDynamicTableWebPartStrings' {
  const strings: ISmartDynamicTableWebPartStrings;
  export = strings;
}
