declare interface IUserTimeEntryWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  AppLocalEnvironmentSharePoint: string;
  AppLocalEnvironmentTeams: string;
  AppSharePointEnvironment: string;
  AppTeamsTabEnvironment: string;
}

declare module 'UserTimeEntryWebPartStrings' {
  const strings: IUserTimeEntryWebPartStrings;
  export = strings;
}
