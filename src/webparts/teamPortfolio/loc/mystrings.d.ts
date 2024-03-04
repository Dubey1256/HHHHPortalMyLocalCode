declare interface ITeamPortfolioWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  AppLocalEnvironmentSharePoint: string;
  AppLocalEnvironmentTeams: string;
  AppSharePointEnvironment: string;
  AppTeamsTabEnvironment: string;
}

declare module 'TeamPortfolioWebPartStrings' {
  const strings: ITeamPortfolioWebPartStrings;
  export = strings;
}
