import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'ManageSmartMetadataWebPartStrings';
import ManageSmartMetadata from './components/ManageSmartMetadata';
import { IManageSmartMetadataProps } from './components/IManageSmartMetadataProps';
import { getSP } from '../../spservices/pnpjsConfig';

export interface IManageSmartMetadataWebPartProps {
  smartMetadadaListId: string;
  siteConfigurationsListId: string;
}

export default class ManageSmartMetadataWebPart extends BaseClientSideWebPart<IManageSmartMetadataWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IManageSmartMetadataProps> = React.createElement(
      ManageSmartMetadata,
      {
        smartMetadadaListId: this.properties.smartMetadadaListId,
        siteConfigurationsListId: this.properties.siteConfigurationsListId,
        context: this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected async onInit(): Promise<void> {
    await super.onInit();
    getSP(this.context);   
  }



  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('smartMetadadaListId', {
                  label: "Smart Metadata List Id"
                }),
                PropertyPaneTextField('siteConfigurationsListId', {
                  label: "Site Configurations List Id"
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
