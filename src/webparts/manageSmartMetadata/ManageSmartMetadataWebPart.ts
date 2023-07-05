import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { getSP } from '../../spservices/pnpjsConfig';

import * as strings from 'ManageSmartMetadataWebPartStrings';
import ManageSmartMetadataApp from './components/ManageSmartMetadataApp';
import { IManageSmartMetadataAppProps } from './components/IManageSmartMetadataAppProps';

export interface IManageSmartMetadataWebPartProps {
  description: string;
}

export default class ManageSmartMetadataWebPart extends BaseClientSideWebPart<IManageSmartMetadataWebPartProps> {

  
  public render(): void {
    const element: React.ReactElement<IManageSmartMetadataAppProps> = React.createElement(
      ManageSmartMetadataApp
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
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
