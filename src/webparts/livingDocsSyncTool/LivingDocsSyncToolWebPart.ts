import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'LivingDocsSyncToolWebPartStrings';
import LivingDocsSyncTool from './components/LivingDocsSyncTool';
import { ILivingDocsSyncToolProps } from './components/ILivingDocsSyncToolProps';

export interface ILivingDocsSyncToolWebPartProps {
  description: string;
  SharewebNews:"bfc52560-8b7f-418c-a41d-0ba0a58ff053",
  SharewebEvent:"e2e2fa00-a3a4-4c17-b2b5-3ea15b2e9cf7",
  SharewebDocument:"484969de-3748-4142-8c88-15e5c566192d",
  LivingNews:"1cdbbed8-bf7a-4c82-a81b-553f0283336e",
  LivingEvent:"1816004b-f27d-4001-acc8-fe46bf3ce56a",
 LivingDocument:"c42b2967-bc9b-4cc6-9e2e-5239cf4dd614",
 TaskUserListID: 'b318ba84-e21d-4876-8851-88b94b9dc300';
}

export default class LivingDocsSyncToolWebPart extends BaseClientSideWebPart<ILivingDocsSyncToolWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  public render(): void {
    const element: React.ReactElement<ILivingDocsSyncToolProps> = React.createElement(
      LivingDocsSyncTool,
      {
        description: this.properties.description,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,
         Context: this.context,
        siteUrl: this.context.pageContext.web.absoluteUrl,
        SharewebNews :this.properties.SharewebNews,
        SharewebEvent  :this.properties.SharewebEvent ,
        SharewebDocument :this.properties.SharewebDocument,
        LivingNews :this.properties.LivingNews,
        TaskUserListID: this.properties.TaskUserListID,
        LivingEvent  :this.properties.LivingEvent ,
        LivingDocument :this.properties.LivingDocument,
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
        .then(context => {
          let environmentMessage: string = '';
          switch (context.app.host.name) {
            case 'Office': // running in Office
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOffice : strings.AppOfficeEnvironment;
              break;
            case 'Outlook': // running in Outlook
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOutlook : strings.AppOutlookEnvironment;
              break;
            case 'Teams': // running in Teams
        
            default:
              environmentMessage = strings.UnknownEnvironment;
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
                PropertyPaneTextField('SharewebNews', {
                  label: "SharewebNews"
                }),
                PropertyPaneTextField('SharewebEvent', {
                  label: "SharewebEvent"
                }),
                PropertyPaneTextField('SharewebDocument', {
                  label: "SharewebDocument"
                }),
                PropertyPaneTextField('LivingNews', {
                  label: "LivingNews"
                }),
                PropertyPaneTextField('LivingEvent', {
                  label: "LivingEvent"
                }),
                PropertyPaneTextField('LivingDocument', {
                  label: "LivingDocument"
                }),
                PropertyPaneTextField('TaskUserListID', {
                  label: "TaskUserListID"
                }),
              ]
            }
          ]
        }
      ]
    };
  }
}
