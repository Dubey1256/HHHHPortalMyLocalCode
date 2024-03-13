import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'SmartmetadataportfolioWebPartStrings';
import Smartmetadataportfolio from './components/Smartmetadataportfolio';
import { ISmartmetadataportfolioProps } from './components/ISmartmetadataportfolioProps';

export interface ISmartmetadataportfolioWebPartProps {
  SPSiteConfigListID: string;
  SPSitesListUrl: string;
  SPSmartMetadataListID: string;
  SPTopNavigationListID: string;
  TaskUsertListID: string
  description: string;
  PageUrl: any
  siteUrl: any
  Context: any
}

export default class SmartmetadataportfolioWebPart extends BaseClientSideWebPart<ISmartmetadataportfolioWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  public render(): void {
    const element: React.ReactElement<ISmartmetadataportfolioProps> = React.createElement(
      Smartmetadataportfolio,
      {
        description: this.properties.description,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,
        SPSitesListUrl: this.context.pageContext.web.absoluteUrl,
        SPSiteConfigListID: this.properties.SPSiteConfigListID,
        SPSmartMetadataListID: this.properties.SPSmartMetadataListID,
        SPTopNavigationListID: this.properties.SPTopNavigationListID,
        TaskUsertListID: this.properties.TaskUsertListID,
        PageUrl: this.context?.pageContext?.site?.serverRequestPath,
        siteUrl: this.context.pageContext.web.absoluteUrl,
        Context: this.context
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
                PropertyPaneTextField('SPSiteConfigListID', {
                  label: 'SPSiteConfigListID'
                }),
                PropertyPaneTextField('SPSmartMetadataListID', {
                  label: 'SPSmartMetadataListID'
                }),
                PropertyPaneTextField('SPTopNavigationListID', {
                  label: 'SPTopNavigationListID'
                }),
                PropertyPaneTextField('TaskUsertListID', {
                  label: 'TaskUsertListID'
                }),
              ]
            }
          ]
        }
      ]
    };
  }
}