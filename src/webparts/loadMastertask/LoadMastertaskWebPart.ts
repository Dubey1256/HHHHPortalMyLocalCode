import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'LoadMastertaskWebPartStrings';
import LoadMastertask from './components/LoadMastertask';
import { ILoadMastertaskProps } from './components/ILoadMastertaskProps';

export interface ILoadMastertaskWebPartProps {
  description: string;
  MasterTaskListID: 'ec34b38f-0669-480a-910c-f84e92e58adf';
  TaskTypeID:'21b55c7b-5748-483a-905a-62ef663972dc';
  TaskUsertListID: 'b318ba84-e21d-4876-8851-88b94b9dc300';
  SmartMetadataListID: '01a34938-8c7e-4ea6-a003-cee649e8c67a';
  SmartInformationListID: 'edf0a6fb-f80e-4772-ab1e-666af03f7ccd';
  DocumentsListID: 'd0f88b8f-d96d-4e12-b612-2706ba40fb08';
  TaskTimeSheetListID: '464fb776-e4b3-404c-8261-7d3c50ff343f';
  PortFolioTypeID:"c21ab0e4-4984-4ef7-81b5-805efaa3752e";
  SmartHelptListID:'9cf872fc-afcd-42a5-87c0-aab0c80c5457';
  TimeEntry: any;
  Context:any;
  SiteCompostion: any;
}

export default class LoadMastertaskWebPart extends BaseClientSideWebPart<ILoadMastertaskWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  public render(): void {
    const element: React.ReactElement<ILoadMastertaskProps> = React.createElement(
      LoadMastertask,
      {
        description: this.properties.description,
        isDarkTheme: this._isDarkTheme,
        Context: this.context,
        environmentMessage: this._environmentMessage,
        siteUrl: this.context.pageContext.web.absoluteUrl,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,
        MasterTaskListID: this.properties.MasterTaskListID,
        TaskTypeID: this.properties.TaskTypeID,     
        TaskUsertListID: this.properties.TaskUsertListID,
        SmartMetadataListID: this.properties.SmartMetadataListID,
        SmartInformationListID: this.properties.SmartInformationListID,
        DocumentsListID: this.properties.DocumentsListID,
        PortFolioTypeID: this.properties.PortFolioTypeID,
        TaskTimeSheetListID: this.properties.TaskTimeSheetListID,
        SmartHelptListID: this.properties.SmartHelptListID,
        TimeEntry: this.properties.TimeEntry,
        SiteCompostion: this.properties.SiteCompostion
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
                PropertyPaneTextField('MasterTaskListID', {
                  label: "MasterTaskListID"
                }),
                PropertyPaneTextField('TaskTypeID', {
                  label: "TaskTypeID"
                }),
                PropertyPaneTextField('TaskUsertListID', {
                  label: "TaskUsertListID"
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
                PropertyPaneTextField('PortFolioTypeID', {
                  label: "PortFolioTypeID"
                }),
                PropertyPaneTextField('SmartHelptListID',{
                  label:'SmartHelptListID'
                }),
                PropertyPaneTextField('TimeEntry', {
                  label: "TimeEntry"
                }),
                PropertyPaneTextField('SiteCompostion', {
                  label: "SiteCompostion"
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
