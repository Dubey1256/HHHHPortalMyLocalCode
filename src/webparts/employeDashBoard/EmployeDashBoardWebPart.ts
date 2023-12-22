import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'EmployeDashBoardWebPartStrings';
import EmployeDashBoard from './components/EmployeDashBoard';
import { IEmployeDashBoardProps } from './components/IEmployeDashBoardProps';

export interface IEmployeDashBoardWebPartProps {
  Announcements: 'F3CAD36C-EEF6-492D-B81F-9B441FDF218E';
  description: string;
  siteUrl : any;
  Context:any;
  TaskUsertListID: 'b318ba84-e21d-4876-8851-88b94b9dc300';
  SmartMetadataListID: '01a34938-8c7e-4ea6-a003-cee649e8c67a';
  MasterTaskListID:'EC34B38F-0669-480A-910C-F84E92E58ADF';
  TaskTimeSheetListID:'11D52F95-4231-4852-AFDE-884D548C7F1B';
}

export default class EmployeDashBoardWebPart extends BaseClientSideWebPart<IEmployeDashBoardWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  public render(): void {
    const element: React.ReactElement<IEmployeDashBoardProps> = React.createElement(
      EmployeDashBoard,
      {
        description: this.properties.description,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,
        pageContext: this.context.pageContext,
        Context: this.context,
        siteUrl: this.context.pageContext.web.absoluteUrl,
        TaskUsertListID: this.properties.TaskUsertListID,
        SmartMetadataListID: this.properties.SmartMetadataListID,
        MasterTaskListID: this.properties.MasterTaskListID,
        TaskTimeSheetListID: this.properties.TaskTimeSheetListID,
        Announcements: this.properties.Announcements
       }
    );

    ReactDom.render(element, this.domElement);
  } protected onInit(): Promise<void> {
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
                PropertyPaneTextField('SmartMetadataListID', {
                  label: "SmartMetadataListID"
                }),
                PropertyPaneTextField("TaskUsertListID", {
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
