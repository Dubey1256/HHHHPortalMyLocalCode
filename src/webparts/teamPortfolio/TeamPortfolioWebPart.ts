import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneDropdown,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'TeamPortfolioWebPartStrings';
import TeamPortfolio from './components/TeamPortfolio';
import { ITeamPortfolioProps } from './components/ITeamPortfolioProps';
import pnp from 'sp-pnp-js';

export interface ITeamPortfolioWebPartProps {
  description: string;
  MasterTaskListID: "ec34b38f-0669-480a-910c-f84e92e58adf";
  TaskUsertListID: "b318ba84-e21d-4876-8851-88b94b9dc300";
  TaskTypeID: "21b55c7b-5748-483a-905a-62ef663972dc";
  SmartMetadataListID: "01a34938-8c7e-4ea6-a003-cee649e8c67a";
  // dropdownvalue: string;
  TimeEntry: any;
  SiteCompostion: any;
}

export default class TeamPortfolioWebPart extends BaseClientSideWebPart<ITeamPortfolioWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  public render(): void {
    const element: React.ReactElement<ITeamPortfolioProps> = React.createElement(
      TeamPortfolio,
      {
        description: this.properties.description,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,
        siteUrl: this.context.pageContext.web.absoluteUrl,
        MasterTaskListID: this.properties.MasterTaskListID,
        TaskTypeID: this.properties.TaskTypeID,
        TaskUsertListID: this.properties.TaskUsertListID,
        SmartMetadataListID: this.properties.SmartMetadataListID,
        Context: this.context,
        // dropdownvalue: this.properties.dropdownvalue,
        TimeEntry: this.properties.TimeEntry,
        SiteCompostion: this.properties.SiteCompostion,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {
    //this._environmentMessage = this._getEnvironmentMessage();
    return super.onInit().then((_) => {
      pnp.setup({
        spfxContext: this.context,
      });
    });
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
            description: strings.PropertyPaneDescription,
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                // PropertyPaneTextField('description', {
                //   label: strings.DescriptionFieldLabel
                // }),
                // PropertyPaneDropdown("dropdownvalue", {
                //   label: "Portfolio type",
                //   // selectedKey:'Service Portfolio',
                //   options: [
                //     { key: "Service Portfolio", text: "Service Portfolio" },
                //     { key: "Events Portfolio", text: "Events Portfolio" },
                //     { key: "Component Portfolio", text: "Component Portfolio" },
                //   ],
                // }),
                PropertyPaneTextField("TaskUsertListID", {
                  label: "Task User List",
                }),
                PropertyPaneTextField("SmartMetadataListID", {
                  label: "Smart Metadata List",
                }),
                PropertyPaneTextField("MasterTaskListID", {
                  label: "Master Task List",
                }),
                PropertyPaneTextField("TaskTypeID", {
                  label: "Task Type List",
                }),
                PropertyPaneTextField("TimeEntry", {
                  label: "TimeEntry",
                }),

                PropertyPaneTextField("SiteCompostion", {
                  label: "SiteCompostion",
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
