import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IManageSmartMetadataProps {
  smartMetadadaListId: string;
  siteConfigurationsListId: string;
  context: WebPartContext;
}
