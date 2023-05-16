import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'ProjectmanagementOverviewToolWebPartStrings';
import ProjectmanagementOverviewTool from './components/ProjectmanagementOverviewTool';
import { IProjectmanagementOverviewToolProps } from './components/IProjectmanagementOverviewToolProps';

export interface IProjectmanagementOverviewToolWebPartProps {
  description: string;
  MasterTaskListID: 'ec34b38f-0669-480a-910c-f84e92e58adf';
  TaskUsertListID: 'b318ba84-e21d-4876-8851-88b94b9dc300';
  SmartMetadataListID: '01a34938-8c7e-4ea6-a003-cee649e8c67a';
  SmartInformationListID: 'edf0a6fb-f80e-4772-ab1e-666af03f7ccd';
  DocumentsListID: 'd0f88b8f-d96d-4e12-b612-2706ba40fb08';
  TaskTimeSheetListID: '464fb776-e4b3-404c-8261-7d3c50ff343f';
  AdminConfigrationListID: 'e968902a-3021-4af2-a30a-174ea95cf8fa';
  TimeEntry: any;
  SiteCompostion: any;
}

export default class ProjectmanagementOverviewToolWebPart extends BaseClientSideWebPart<IProjectmanagementOverviewToolWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  public render(): void {
    const element: React.ReactElement<IProjectmanagementOverviewToolProps> = React.createElement(
      ProjectmanagementOverviewTool,
      {
        description: this.properties.description,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,
        pageContext: this.context.pageContext,
        Context:this.context,
        siteUrl: this.context.pageContext.web.absoluteUrl,
        MasterTaskListID: this.properties.MasterTaskListID,
        TaskUsertListID: this.properties.TaskUsertListID,
        SmartMetadataListID: this.properties.SmartMetadataListID,
        SmartInformationListID: this.properties.SmartInformationListID,
        DocumentsListID: this.properties.DocumentsListID,
        TaskTimeSheetListID: this.properties.TaskTimeSheetListID,
        AdminConfigrationListID: this.properties.AdminConfigrationListID,
        TimeEntry: this.properties.TimeEntry,
        SiteCompostion: this.properties.SiteCompostion
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {
    this._environmentMessage = this._getEnvironmentMessage();

    return super.onInit();
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
                PropertyPaneTextField('TimeEntry', {
                  label: "TimeEntry"
                }),
                PropertyPaneTextField('SiteCompostion', {
                  label: "SiteCompostion"
                }),
                PropertyPaneTextField('AdminConfigrationListID', {
                  label: "AdminConfigrationListID"
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
