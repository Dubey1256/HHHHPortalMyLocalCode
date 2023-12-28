import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'LastModidiedItemsWebPartStrings';
import LastModidiedItems from './components/LastModidiedItems';
import { ILastModidiedItemsProps } from './components/ILastModidiedItemsProps';

export interface ILastModidiedItemsWebPartProps {
  description: string;
  ListConfigurationListId: String
  TaskUsertListID: String;
  SmartMetadataListID: String;
  MasterTaskListID: String;
  TaskTimeSheetListID: String;
  DocumentsListID: String;
  SmartInformation: String
  TaskTypeID: String;
  SmartHelptListID: String,
  PortFolioTypeID: String,
  ContractListID:String,
  HHHHContactListId:String,
  HHHHInstitutionListId:String,
  MAIN_SMARTMETADATA_LISTID:String,
  MAIN_HR_LISTID:String,
  GMBH_CONTACT_SEARCH_LISTID:String,
  HR_EMPLOYEE_DETAILS_LIST_ID:String,
  TimeEntry: any;
  SiteCompostion: any;
  context: any
}

export default class LastModidiedItemsWebPart extends BaseClientSideWebPart<ILastModidiedItemsWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  public render(): void {
    const element: React.ReactElement<ILastModidiedItemsProps> = React.createElement(
      LastModidiedItems,
      {
        description: this.properties.description,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,
        ListConfigurationListId: this.properties.ListConfigurationListId,
        SmartMetadataListID: this.properties.SmartMetadataListID,
        TaskUsertListID: this.properties.TaskUsertListID,
        MasterTaskListID: this.properties.MasterTaskListID,
        TaskTimeSheetListID: this.properties.TaskTimeSheetListID,
        DocumentsListID: this.properties.DocumentsListID,
        SmartInformation: this.properties.SmartInformation,
        TaskTypeID: this.properties.TaskTypeID,
        SmartHelptListID: this.properties.SmartHelptListID,
        PortFolioTypeID: this.properties.PortFolioTypeID,
        ContractListID:this.properties.ContractListID,
        HHHHContactListId:this.properties.HHHHContactListId,
        HHHHInstitutionListId:this.properties.HHHHInstitutionListId,
        MAIN_SMARTMETADATA_LISTID:this.properties.MAIN_SMARTMETADATA_LISTID,
        MAIN_HR_LISTID:this.properties.MAIN_HR_LISTID,
        GMBH_CONTACT_SEARCH_LISTID:this.properties.GMBH_CONTACT_SEARCH_LISTID,
        HR_EMPLOYEE_DETAILS_LIST_ID:this.properties.HR_EMPLOYEE_DETAILS_LIST_ID,
        TimeEntry: this.properties.TimeEntry,
        SiteCompostion: this.properties.SiteCompostion,
        context: this.context,

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
              groupFields: [PropertyPaneTextField('ListConfigurationListId', {
                label: 'ListConfigurationListId'
              }),
              PropertyPaneTextField('TaskUsertListID', {
                label: 'TaskUsertListID'
              }),
              PropertyPaneTextField('SmartMetadataListID', {
                label: 'SmartMetadataListID'
              }),
              PropertyPaneTextField('MasterTaskListID', {
                label: 'MasterTaskListID'
              }),
              PropertyPaneTextField('TaskTimeSheetListID', {
                label: 'TaskTimeSheetListID'
              }),
              PropertyPaneTextField('DocumentsListID', {
                label: 'DocumentsListID'
              }),
              PropertyPaneTextField('SmartInformation', {
                label: 'SmartInformation'
              }),
              PropertyPaneTextField('TaskTypeID', {
                label: 'TaskTypeID'
              }),
              PropertyPaneTextField('SmartHelptListID', {
                label: 'SmartHelptListID'
              }),
              PropertyPaneTextField('PortFolioTypeID', {
                label: 'PortFolioTypeID'
              }),
              PropertyPaneTextField('HHHHContactListId', {
                label: "HHHH Contact ListId"
              }),
              PropertyPaneTextField('HHHHInstitutionListId', {
                label: "HHHH Institution ListId"
              }),
              PropertyPaneTextField('MAIN_SMARTMETADATA_LISTID', {
                label: "Main SmartMetadata ListId"
              }),
              PropertyPaneTextField('MAIN_HR_LISTID', {
                label: "Main Hr ListId"
              }),
              PropertyPaneTextField('GMBH_CONTACT_SEARCH_LISTID', {
                label: "Gmbh Contact Search ListId"
              }),
              PropertyPaneTextField('HR_EMPLOYEE_DETAILS_LIST_ID', {
                label: "Hr Employee Details ListId"
              }),
              PropertyPaneTextField('ContractListID', {
                label: "ContractListID"
              }),
              PropertyPaneTextField('TimeEntry', {
                label: 'TimeEntry'
              }),
              PropertyPaneTextField('SiteCompostion', {
                label: ' SiteCompostion'
              })
              ]
            }
          ]
        }
      ]
    };
  }
}
