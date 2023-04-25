import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'LastModifiedItemsWebPartStrings';
import LastModifiedItemsApp from './components/LastModifiedItemsApp';
import { getSP } from '../../spservices/pnpjsConfig';

export interface ILastModifiedItemsWebPartProps {
  TaskUsertListID: string;
  ListConfigurationListID: string;
  MasterTaskListID: 'ec34b38f-0669-480a-910c-f84e92e58adf';
  SmartMetadataListID: '01a34938-8c7e-4ea6-a003-cee649e8c67a';
  SmartInformationListID:'edf0a6fb-f80e-4772-ab1e-666af03f7ccd';
  DocumentsListID:'d0f88b8f-d96d-4e12-b612-2706ba40fb08';
  TaskTimeSheetListID:'464fb776-e4b3-404c-8261-7d3c50ff343f';
  TimeEntry:boolean;
  SiteCompostion:boolean;
}

export default class LastModifiedItemsWebPart extends BaseClientSideWebPart<ILastModifiedItemsWebPartProps> {

  
  public render(): void {
    
    const element = React.createElement(
      LastModifiedItemsApp,
      {
        taskUsersListId: this.properties.TaskUsertListID,
        listConfigurationListId: this.properties.ListConfigurationListID,
        siteUrl: this.context.pageContext.web.absoluteUrl,
        MasterTaskListID:this.properties.MasterTaskListID,
        SmartMetadataListID:this.properties.SmartMetadataListID,
        SmartInformationListID:this.properties.SmartInformationListID,
        DocumentsListID:this.properties.DocumentsListID,
        TaskTimeSheetListID:this.properties.TaskTimeSheetListID,
        TimeEntry:true,
        SiteCompostion:true,
        Context: this.context,

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
                PropertyPaneTextField("TaskUsertListID", {
                  label: "Task User List"
                }),
                PropertyPaneTextField("ListConfigurationListID", {
                  label: "List Configuration List"
                }), PropertyPaneTextField('MasterTaskListID', {
                  label: "MasterTaskListID"
                }),
  
                PropertyPaneTextField('SmartMetadataListID', {
                  label: "SmartMetadataListID"
                }),
                PropertyPaneTextField('SmartInformationListID', {
                  label: 'SmartInformationListID'
                }),
                PropertyPaneTextField('DocumentsListID', {
                  label: "DocumentsListID"
                }),
                PropertyPaneTextField('TaskTimeSheetListID', {
                  label: "TaskTimeSheetListID"
                }),
                PropertyPaneTextField('TimeEntry', {
                  label: "TimeEntry"
                }),
                PropertyPaneTextField('SiteCompostion', {
                  label: "SiteCompostion"
                }),
              ]
            }
          ]
        }
      ]
    };
  }
}
