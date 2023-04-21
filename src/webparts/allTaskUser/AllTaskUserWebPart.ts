import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'AllTaskUserWebPartStrings';
import { ITaskUserProps } from './components/ITaskUserProps';
import { getSP } from '../../spservices/pnpjsConfig';
import AllTaskUserApp from './components/AllTaskUserApp';

export interface IAllTaskUserWebPartProps {
  TaskUsertListID: string;
  SmartMetadataListID: string;
  ImagesLibraryID: string;
}

export default class AllTaskUserWebPart extends BaseClientSideWebPart<IAllTaskUserWebPartProps> {

  public render(): void {
    const element: React.ReactElement<ITaskUserProps> = React.createElement(
      AllTaskUserApp,
      {        
        userDisplayName: this.context.pageContext.user.displayName,
        context: this.context,
        taskUsersListId: this.properties.TaskUsertListID,
        smartMetadataListId: this.properties.SmartMetadataListID,
        imagesLibraryId: this.properties.ImagesLibraryID
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
              groupName: "All Task User Webpart Configuration",
              groupFields: [
                PropertyPaneTextField("TaskUsertListID", {
                  label: "Task User List"
                }),
                PropertyPaneTextField("SmartMetadataListID", {
                  label: "Smart Metadata List"
                }),
                PropertyPaneTextField("ImagesLibraryID", {
                  label: "Images Library"
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
