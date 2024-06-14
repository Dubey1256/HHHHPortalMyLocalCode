import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'ManageDashboardTemplateWebPartStrings';
import ManageDashboardTemplate from './components/ManageDashboardTemplate';
import { IManageDashboardTemplateProps } from './components/IManageDashboardTemplateProps';

export interface IManageDashboardTemplateWebPartProps {
  description: string;
  AdminConfigurationListID: 'e968902a-3021-4af2-a30a-174ea95cf8fa';
  TaskUserListID: 'b318ba84-e21d-4876-8851-88b94b9dc300';
  SmartMetadataListID: '01a34938-8c7e-4ea6-a003-cee649e8c67a';
}

export default class ManageDashboardTemplateWebPart extends BaseClientSideWebPart<IManageDashboardTemplateWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  public render(): void {
    const element: React.ReactElement<IManageDashboardTemplateProps> = React.createElement(
      ManageDashboardTemplate,
      {
        description: this.properties.description,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,
        Context: this.context,
        siteUrl: this.context.pageContext.web.absoluteUrl,
        AdminConfigurationListID :this.properties.AdminConfigurationListID,
        TaskUserListID: this.properties.TaskUserListID,
        SmartMetadataListID: this.properties.SmartMetadataListID,
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
                PropertyPaneTextField('AdminConfigurationListID', {
                  label: "AdminConfigurationListID"
                }),          
                PropertyPaneTextField('TaskUserListID', {
                  label: "TaskUserListID"
                }),
                PropertyPaneTextField('SmartMetadataListID', {
                  label: "SmartMetadataListID"
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
