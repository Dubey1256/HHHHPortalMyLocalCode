import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'SmartMetaSearchWebPartStrings';
import SmartMetaSearch from './components/SmartMetaSearch';
import { ISmartMetaSearchProps } from './components/ISmartMetaSearchProps';

export interface ISmartMetaSearchWebPartProps {  
  description: string;
  SmartMetadataListID:'01a34938-8c7e-4ea6-a003-cee649e8c67a';
  ContextValue:any;
  TaskUsertListID:'b318ba84-e21d-4876-8851-88b94b9dc300';
  PortFolioTypeID:'c21ab0e4-4984-4ef7-81b5-805efaa3752e';
  MasterTaskListID:'ec34b38f-0669-480a-910c-f84e92e58adf';
  TaskTimeSheetListID:'464fb776-e4b3-404c-8261-7d3c50ff343f';
  DocumentsListID:'d0f88b8f-d96d-4e12-b612-2706ba40fb08'; 
  TaskTypeID:'21b55c7b-5748-483a-905a-62ef663972dc';
  TimeEntry:any;
  SiteCompostion:any
}

export default class SmartMetaSearchWebPart extends BaseClientSideWebPart<ISmartMetaSearchWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  public render(): void {
    const element: React.ReactElement<ISmartMetaSearchProps> = React.createElement(
      SmartMetaSearch,
      {
        description: this.properties.description,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,
        SmartMetadataListID:this.properties.SmartMetadataListID,
        ContextValue:this.context,
        siteUrl: this.context.pageContext.web.absoluteUrl,
        TaskUsertListID: this.properties.TaskUsertListID, 
        PortFolioTypeID:this.properties.PortFolioTypeID, 
        MasterTaskListID: this.properties.MasterTaskListID,                                  
        TaskTimeSheetListID:this.properties.TaskTimeSheetListID,
        DocumentsListID:this.properties.DocumentsListID,        
        TaskTypeID:this.properties.TaskTypeID,
        TimeEntry:this.properties.TimeEntry,
        SiteCompostion:this.properties.SiteCompostion     
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {
    return this._getEnvironmentMessage().then(message => {
      this._environmentMessage = message;
    });
  }



  private _getEnvironmentMessage(): Promise<string> {
    if (!!this.context.sdks.microsoftTeams) { // running in Teams, office.com or Outlook
      return this.context.sdks.microsoftTeams.teamsJs.app.getContext()
        .then(context => {
          let environmentMessage: string = '';
          switch (context.app.host.name) {
            case 'Office': // running in Office
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOffice : strings.AppOfficeEnvironment;
              break;
            case 'Outlook': // running in Outlook
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOutlook : strings.AppOutlookEnvironment;
              break;
            case 'Teams': // running in Teams
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
              break;
            default:
              throw new Error('Unknown host');
          }

          return environmentMessage;
        });
    }

    return Promise.resolve(this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment);
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const {
      semanticColors
    } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }

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
                }),
                PropertyPaneTextField('SmartMetadataListID', {
                  label:"SmartMetadataListID"
                }),
                PropertyPaneTextField('TaskUsertListID', {
                  label:"TaskUsertListID"
                }),                              
                PropertyPaneTextField("PortFolioTypeID", {
                  label: "Portfolio Type List",
                }),
                PropertyPaneTextField("MasterTaskListID", {
                  label: "Master Task List",
                }),
                PropertyPaneTextField("TaskTypeID", {
                  label: "Task Type List",
                }),
                PropertyPaneTextField("DocumentsListID", {
                  label: "DocumentsListID",
                }),
                PropertyPaneTextField("TaskTimeSheetListID", {
                  label: "TaskTimeSheetListID",
                }),
                PropertyPaneTextField("TimeEntry", {
                  label: "TimeEntry",
                }),
                PropertyPaneTextField("SiteCompostion", {
                  label: "SiteCompostion",
                }),
              ]
            }
          ]
        }
      ]
    };
  }
}
