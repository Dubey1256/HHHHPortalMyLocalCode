declare interface ITaskDashboardWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  AppLocalEnvironmentSharePoint: string;
  AppLocalEnvironmentTeams: string;
  AppSharePointEnvironment: string;
  AppTeamsTabEnvironment: string;
}

declare module 'TaskDashboardWebPartStrings' {
  const strings: ITaskDashboardWebPartStrings;
  export = strings;
}
