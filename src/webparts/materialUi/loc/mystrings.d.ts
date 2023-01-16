declare interface IMaterialUiWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  AppLocalEnvironmentSharePoint: string;
  AppLocalEnvironmentTeams: string;
  AppSharePointEnvironment: string;
  AppTeamsTabEnvironment: string;
}

declare module 'MaterialUiWebPartStrings' {
  const strings: IMaterialUiWebPartStrings;
  export = strings;
}
