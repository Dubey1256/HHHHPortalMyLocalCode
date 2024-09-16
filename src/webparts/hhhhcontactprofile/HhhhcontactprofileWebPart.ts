import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'HhhhcontactprofileWebPartStrings';
import Hhhhcontactprofile from './components/Hhhhcontactprofile';
import { IHhhhcontactprofileProps } from './components/IHhhhcontactprofileProps';

export interface IHhhhcontactprofileWebPartProps {
  description: string;
  TeamContactSearchlistIds:"ee0d83a2-d7ae-4629-989d-b8bbf18e2311"
  TeamSmartMetadatalistIds:"c8ce47a9-3159-44f2-aeae-5f56501d8e9d"
  TilesManagementListID: "1af9de61-c150-44de-a73d-4c92852f53c5"
}

export default class HhhhcontactprofileWebPart extends BaseClientSideWebPart<IHhhhcontactprofileWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  public render(): void {
    const element: React.ReactElement<IHhhhcontactprofileProps> = React.createElement(
      Hhhhcontactprofile,
      {
        description: this.properties.description,
        isDarkTheme: this._isDarkTheme,
        Context: this.context,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,
        TeamContactSearchlistIds:this.properties.TeamContactSearchlistIds,
        TeamSmartMetadatalistIds:this?.properties?.TeamSmartMetadatalistIds,
        TilesManagementListID:this?.properties?.TilesManagementListID
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
                PropertyPaneTextField('TeamContactSearchlistIds', {
                  label: "TeamContactSearchlistIds" 
                }),
                PropertyPaneTextField('TeamSmartMetadatalistIds', {
                  label: "TeamSmartMetadatalistIds" 
                }),
                PropertyPaneTextField('TilesManagementListID', {
                  label: "TilesManagementListID" 
                }),
              ]
            }
          ]
        }
      ]
    };
  }
}
