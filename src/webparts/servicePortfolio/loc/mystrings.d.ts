declare interface IServicePortfolioWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  AppLocalEnvironmentSharePoint: string;
  AppLocalEnvironmentTeams: string;
  AppSharePointEnvironment: string;
  AppTeamsTabEnvironment: string;
}

declare module 'ServicePortfolioWebPartStrings' {
  const strings: IServicePortfolioWebPartStrings;
  export = strings;
}
