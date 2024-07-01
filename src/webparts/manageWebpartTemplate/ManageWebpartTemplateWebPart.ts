import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'ManageWebpartTemplateWebPartStrings';
import ManageWebpartTemplate from './components/ManageWebpartTemplate';
import { IManageWebpartTemplateProps } from './components/IManageWebpartTemplateProps';

export interface IManageWebpartTemplateWebPartProps {
  description: string;
  AdminConfigurationListId: string;
  TaskUserListID: string;
  Context: string;
  SmartMetadataListID: any
}

export default class ManageWebpartTemplateWebPart extends BaseClientSideWebPart<IManageWebpartTemplateWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  public render(): void {
    const element: React.ReactElement<IManageWebpartTemplateProps> = React.createElement(
      ManageWebpartTemplate,
      {
        description: this.properties.description,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,
        Context: this.context,
        AdminConfigurationListId: this.properties.AdminConfigurationListId,
        SmartMetadataListID: this.properties.SmartMetadataListID,
        TaskUserListID: this.properties.TaskUserListID,
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
                PropertyPaneTextField("AdminConfigurationListId", {
                  label: "AdminConfigurationListId"
                }),
                PropertyPaneTextField("TaskUserListID", {
                  label: "TaskUserListID"
                }),
                PropertyPaneTextField('SmartMetadataListID', {
                  label: "SmartMetadataListID"
                }),
              ]
            }
          ]
        }
      ]
    };
  }
}
