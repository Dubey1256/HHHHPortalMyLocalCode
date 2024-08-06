import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'RootUpdateTopNavigationWebPartStrings';
import RootUpdateTopNavigation from './components/RootUpdateTopNavigation';
import { IRootUpdateTopNavigationProps } from './components/IRootUpdateTopNavigationProps';

export interface IRootUpdateTopNavigationWebPartProps {
  description: string;
  TopNavigationListID:"7ee58156-c976-46b6-9b08-b700bf8e724b",
  TaskUserListID: 'b318ba84-e21d-4876-8851-88b94b9dc300';
  siteUrl:any
}

export default class RootUpdateTopNavigationWebPart extends BaseClientSideWebPart<IRootUpdateTopNavigationWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  public render(): void {
    const element: React.ReactElement<IRootUpdateTopNavigationProps> = React.createElement(
      RootUpdateTopNavigation,
      {
        description: this.properties.description,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        siteUrl: this.context.pageContext.web.absoluteUrl,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,
        TopNavigationListID: this.properties.TopNavigationListID,
        TaskUserListID: this.properties.TaskUserListID

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
                PropertyPaneTextField('TopNavigationListID', {
                  label: 'TopNavigation List'
                }),
                PropertyPaneTextField('TaskUserListID', {
                  label: 'TaskUserListID'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
