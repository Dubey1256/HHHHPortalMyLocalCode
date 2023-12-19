import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'EmployeProfileWebPartStrings';
import EmployeProfile from './components/EmployeProfile';
import { IEmployeProfileProps } from './components/IEmployeProfileProps';

export interface IEmployeProfileWebPartProps {
  description: string;
  HHHHContactListId:'edc879b9-50d2-4144-8950-5110cacc267a',
  HHHHInstitutionListId:'9f13fd36-456a-42bc-a5e0-cd954d97fc5f',
  MAIN_SMARTMETADATA_LISTID:'D1C6D7C3-F36E-4F95-8715-8DA9F33622E7',
  MAIN_HR_LISTID:'6DD8038B-40D2-4412-B28D-1C86528C7842',
  GMBH_CONTACT_SEARCH_LISTID:'6CE99A82-F577-4467-9CDA-613FADA2296F',
  HR_EMPLOYEE_DETAILS_LIST_ID:'a7b80424-e5e1-47c6-80a1-0ee44a70f92c',
  ContractListID:'c0106d10-a71c-4153-b204-7cf7b45a68b8',
  HR_SMARTMETADATA_LISTID:'63CAE346-409E-4457-B996-85A788074BCE'
}

export default class EmployeProfileWebPart extends BaseClientSideWebPart<IEmployeProfileWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  public render(): void {
    const element: React.ReactElement<IEmployeProfileProps> = React.createElement(
      EmployeProfile,
      {
        description: this.properties.description,
        isDarkTheme: this._isDarkTheme,
        Context: this.context,
        HHHHContactListId:'edc879b9-50d2-4144-8950-5110cacc267a',
        HHHHInstitutionListId:'9f13fd36-456a-42bc-a5e0-cd954d97fc5f',
        MAIN_SMARTMETADATA_LISTID:'D1C6D7C3-F36E-4F95-8715-8DA9F33622E7',
        MAIN_HR_LISTID:'6DD8038B-40D2-4412-B28D-1C86528C7842',
        GMBH_CONTACT_SEARCH_LISTID:'6CE99A82-F577-4467-9CDA-613FADA2296F',
        HR_EMPLOYEE_DETAILS_LIST_ID:'a7b80424-e5e1-47c6-80a1-0ee44a70f92c',
        ContractListID:'c0106d10-a71c-4153-b204-7cf7b45a68b8',
        HR_SMARTMETADATA_LISTID:'63CAE346-409E-4457-B996-85A788074BCE',
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.loginName
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
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
              break;
            default:
              throw new Error('Unknown host');
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
                PropertyPaneTextField('HHHHContactListId', {
                  label: "HHHH Contact ListId"
                }),
                PropertyPaneTextField('HHHHInstitutionListId', {
                  label: "HHHH Institution ListId"
                }),
                PropertyPaneTextField('MAIN_SMARTMETADATA_LISTID', {
                  label: "Main SmartMetadata ListId"
                }),
                PropertyPaneTextField('MAIN_HR_LISTID', {
                  label: "Main Hr ListId"
                }),
                PropertyPaneTextField('GMBH_CONTACT_SEARCH_LISTID', {
                  label: "Gmbh Contact Search ListId"
                }),
                PropertyPaneTextField('HR_EMPLOYEE_DETAILS_LIST_ID', {
                  label: "Hr Employee Details ListId"
                }),
                PropertyPaneTextField('ContractListID', {
                  label: 'ContractListID'
                }),
                PropertyPaneTextField('HR_SMARTMETADATA_LISTID', {
                  label: 'HR_SMARTMETADATA_LISTID'
                }),
              ]
            }
          ]
        }
      ]
    };
  }
}
