import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'EmployeeDashboardTemplatedWebPartStrings';
import EmployeeDashboardTemplated from './components/EmployeeDashboardTemplated';
import { IEmployeeDashboardTemplatedProps } from './components/IEmployeeDashboardTemplatedProps';

export interface IEmployeeDashboardTemplatedWebPartProps {
  Announcements: 'F3CAD36C-EEF6-492D-B81F-9B441FDF218E';
  description: string;
  siteUrl: any;
  Context: any;
  TaskUserListID: 'b318ba84-e21d-4876-8851-88b94b9dc300';
  SmartMetadataListID: '01a34938-8c7e-4ea6-a003-cee649e8c67a';
  MasterTaskListID: 'EC34B38F-0669-480A-910C-F84E92E58ADF';
  TaskTimeSheetListID: '11D52F95-4231-4852-AFDE-884D548C7F1B';
  UpComingBirthdayId: 'a7b80424-e5e1-47c6-80a1-0ee44a70f92c';
  MyNotesId: '2163fbd9-b6f0-48b8-bc1b-bb48e43f188d',
  UpComingBdaySiteName: 'HR';
  AdminConfigurationListId:'e968902a-3021-4af2-a30a-174ea95cf8fa'
}

export default class EmployeeDashboardTemplatedWebPart extends BaseClientSideWebPart<IEmployeeDashboardTemplatedWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  public render(): void {
    const element: React.ReactElement<IEmployeeDashboardTemplatedProps> = React.createElement(
      EmployeeDashboardTemplated,
      {
        description: this.properties.description,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,
        pageContext: this.context.pageContext,
        Context: this.context,
        siteUrl: this.context.pageContext.web.absoluteUrl,
        TaskUserListID: this.properties.TaskUserListID,
        SmartMetadataListID: this.properties.SmartMetadataListID,
        MasterTaskListID: this.properties.MasterTaskListID,
        TaskTimeSheetListID: this.properties.TaskTimeSheetListID,
        Announcements: this.properties.Announcements,
        UpComingBirthdayId: this.properties.UpComingBirthdayId,
        MyNotesId: this.properties.MyNotesId,
        UpComingBdaySiteName: 'HR',
        AdminConfigurationListId:this.properties.AdminConfigurationListId,
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
         
            default:
              environmentMessage = strings.UnknownEnvironment;
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
                  label: "SmartMetadataListID"
                }),
                PropertyPaneTextField("TaskUserListID", {
                  label: "Task User List"
                }),
                PropertyPaneTextField("Announcements", {
                  label: "Announcements"
                }),
                PropertyPaneTextField("MasterTaskListID", {
                  label: "MasterTaskListID"
                }),
                PropertyPaneTextField("TaskTimeSheetListID", {
                  label: "TaskTimeSheetListID"
                }),
                PropertyPaneTextField("UpComingBirthdayId", {
                  label: "UpComingBirthdayId"
                }),
                PropertyPaneTextField("MyNotesId", {
                  label: "MyNotesId"
                }),
                PropertyPaneTextField("AdminConfigurationListId", {
                  label: "AdminConfigurationListId"
                }),

                // PropertyPaneTextField('MasterTaskListID', {
                //   label: "MasterTaskListID"
                // }),
                // PropertyPaneTextField('SmartInformationListID', {
                //   label: 'SmartInformationListID'
                // }),
                // PropertyPaneTextField('DocumentsListID', {
                //   label: "DocumentsListID"
                // }),
                // PropertyPaneTextField('TaskTimeSheetListID', {
                //   label: "TaskTimeSheetListID"
                // }),
                // PropertyPaneTextField('TimeEntry', {
                //   label: "TimeEntry"
                // }),
                // PropertyPaneTextField('SiteCompostion', {
                //   label: "SiteCompostion"
                // }),
              ]
            }
          ]
        }
      ]
    };
  }
}
