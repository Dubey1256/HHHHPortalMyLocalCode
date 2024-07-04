import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'TaskNotificationManagementWebPartStrings';
import TaskNotificationManagement from './components/TaskNotificationManagement';
import { ITaskNotificationManagementProps } from './components/ITaskNotificationManagementProps';

export interface ITaskNotificationManagementWebPartProps {
  description: string;
  Context:any;
  siteUrl:any;
  PortFolioTypeID:any;
  SmartMetadataListID: '01a34938-8c7e-4ea6-a003-cee649e8c67a';
  TaskUserListID: "b318ba84-e21d-4876-8851-88b94b9dc300";
  NotificationsConfigrationListID:"B1F337D3-161F-43F1-BA43-FD3CF440CDE4"
}

export default class TaskNotificationManagementWebPart extends BaseClientSideWebPart<ITaskNotificationManagementWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  public render(): void {
    const element: React.ReactElement<ITaskNotificationManagementProps> = React.createElement(
      TaskNotificationManagement,
      {
        description: this.properties.description,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,
        Context: this.context,
        siteUrl: this.context.pageContext.web.absoluteUrl,
        PortFolioTypeID: this.properties.PortFolioTypeID,
        SmartMetadataListID: this.properties.SmartMetadataListID,
        TaskUserListID: this.properties.TaskUserListID,
        NotificationsConfigrationListID: this.properties.NotificationsConfigrationListID
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
        .then((context: { app: { host: { name: any; }; }; }) => {
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
                PropertyPaneTextField('PortFolioTypeID', {
                  label: "PortFolioTypeID"
                }),
                PropertyPaneTextField('SmartMetadataListID', {
                  label: "SmartMetadataListID"
                }),
                PropertyPaneTextField('TaskUserListID', {
                  label: "TaskUserListID"
                }),
                PropertyPaneTextField('NotificationsConfigrationListID', {
                  label: "NotificationsConfigrationListID"
                })
              
              ]
            }
          ]
        }
      ]
    };
  }
}
