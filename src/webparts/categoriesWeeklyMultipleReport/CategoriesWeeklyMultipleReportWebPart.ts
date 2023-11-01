import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'CategoriesWeeklyMultipleReportWebPartStrings';
import CategoriesWeeklyMultipleReport from './components/CategoriesWeeklyMultipleReport';
import { ICategoriesWeeklyMultipleReportProps } from './components/ICategoriesWeeklyMultipleReportProps';
import pnp from 'sp-pnp-js';

export interface ICategoriesWeeklyMultipleReportWebPartProps {
  description: string;
  MasterTaskListID: "ec34b38f-0669-480a-910c-f84e92e58adf";
  TaskUsertListID: "b318ba84-e21d-4876-8851-88b94b9dc300";
  TaskTypeID: "21b55c7b-5748-483a-905a-62ef663972dc";
  SmartMetadataListID: "01a34938-8c7e-4ea6-a003-cee649e8c67a";
  PortFolioTypeID: "c21ab0e4-4984-4ef7-81b5-805efaa3752e";
  // dropdownvalue: string;
  TimeEntry: any;
  SiteCompostion: any;
}

export default class CategoriesWeeklyMultipleReportWebPart extends BaseClientSideWebPart<ICategoriesWeeklyMultipleReportWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';



  public render(): void {
    const element: React.ReactElement<ICategoriesWeeklyMultipleReportProps> = React.createElement(
      CategoriesWeeklyMultipleReport,
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
        PortFolioTypeID:this.properties.PortFolioTypeID,
        Context: this.context,
        // dropdownvalue: this.properties.dropdownvalue,
        TimeEntry: this.properties.TimeEntry,
        SiteCompostion: this.properties.SiteCompostion,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected async onInit(): Promise<void> {
    //this._environmentMessage = this._getEnvironmentMessage();
    const _ = await super.onInit();
    pnp.setup({
      spfxContext: this.context,
    });
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
                PropertyPaneTextField("PortFolioTypeID", {
                  label: "Portfolio Type List",
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
        }
      ]
    };
  }
}
