import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'UserTimeEntryWebPartStrings';
import UserTimeEntry from './components/UserTimeEntry';
import { IUserTimeEntryProps } from './components/IUserTimeEntryProps';

export interface IUserTimeEntryWebPartProps {
  description: string;
  TaskUsertListID: any,
  SmartMetadataListID: any,
  MasterTaskListID: any,
  TaskTypeID: any,
  PortFolioTypeID: any,
  TimeEntry: any;
  SiteCompostion: any;
}

export default class UserTimeEntryWebPart extends BaseClientSideWebPart<IUserTimeEntryWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  protected onInit(): Promise<void> {
    this._environmentMessage = this._getEnvironmentMessage();

    return super.onInit();
  }

  public render(): void {
    const element: React.ReactElement<IUserTimeEntryProps> = React.createElement(
      UserTimeEntry,
      {
        description: this.properties.description,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,
        Context: this.context,
        MasterTaskListID: this.properties.MasterTaskListID,
        TaskTypeID: this.properties.TaskTypeID,
        PortFolioTypeID: this.properties.PortFolioTypeID,
        siteUrl: this.context.pageContext.web.absoluteUrl,
        TaskUsertListID: this.properties.TaskUsertListID,
        SmartMetadataListID: this.properties.SmartMetadataListID,   
        TimeEntry: this.properties.TimeEntry,
        SiteCompostion: this.properties.SiteCompostion     
      }
    );

    ReactDom.render(element, this.domElement);
  }

  private _getEnvironmentMessage(): string {
    if (!!this.context.sdks.microsoftTeams) { // running in Teams
      return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
    }

    return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment;
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const {
      semanticColors
    } = currentTheme;
    this.domElement.style.setProperty('--bodyText', semanticColors.bodyText);
    this.domElement.style.setProperty('--link', semanticColors.link);
    this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered);

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
                  label: 'Smart Metadata ListID'
                }),
                PropertyPaneTextField('TaskUsertListID', {
                  label: 'Task users ListID'
                }),                
                PropertyPaneTextField("MasterTaskListID", {
                  label: "Master Task List",
                }), PropertyPaneTextField('TimeEntry', {
                  label: "TimeEntry"
                }),
                PropertyPaneTextField('SiteCompostion', {
                  label: "SiteCompostion"
                }),
                PropertyPaneTextField('TaskTypeID', {
                  label: "TaskTypeID"
                }),
                PropertyPaneTextField('PortFolioTypeID', {
                  label: "PortFolioTypeID"
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
