import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import { IHrContractSearchProps } from './components/IHrContractSearchProps';
import pnp from 'sp-pnp-js';
import * as strings from 'HrContractSearchWebPartStrings';
import HrContractSearch from './components/ContractSearch';

export interface IHrContractSearchWebPartProps {
  description: string;
  ContractListID:'c0106d10-a71c-4153-b204-7cf7b45a68b8'
 HHHHContactListId:'edc879b9-50d2-4144-8950-5110cacc267a',
  HHHHInstitutionListId:'9f13fd36-456a-42bc-a5e0-cd954d97fc5f',
  HR_SMARTMETADATA_LISTID:'63CAE346-409E-4457-B996-85A788074BCE',
  MAIN_HR_LISTID:'6DD8038B-40D2-4412-B28D-1C86528C7842',
  GMBH_CONTACT_SEARCH_LISTID:'6CE99A82-F577-4467-9CDA-613FADA2296F',
  HR_EMPLOYEE_DETAILS_LIST_ID:'a7b80424-e5e1-47c6-80a1-0ee44a70f92c',

  
}

export default class HrContractSearchWebPart extends BaseClientSideWebPart<IHrContractSearchWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  public render(): void {
    const element: React.ReactElement<IHrContractSearchProps> = React.createElement(
      HrContractSearch,
      {

        description: this.properties.description,
        isDarkTheme: this._isDarkTheme,
        Context: this.context,
        HHHHContactListId:'edc879b9-50d2-4144-8950-5110cacc267a',
        HHHHInstitutionListId:'9f13fd36-456a-42bc-a5e0-cd954d97fc5f',
        HR_SMARTMETADATA_LISTID:'63CAE346-409E-4457-B996-85A788074BCE',
        MAIN_HR_LISTID:'6DD8038B-40D2-4412-B28D-1C86528C7842',
        GMBH_CONTACT_SEARCH_LISTID:'6CE99A82-F577-4467-9CDA-613FADA2296F',
        HR_EMPLOYEE_DETAILS_LIST_ID:'a7b80424-e5e1-47c6-80a1-0ee44a70f92c',
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.loginName,
         siteUrl: this.context.pageContext.web.absoluteUrl,
        ContractListID : this.properties.ContractListID,
       

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
                PropertyPaneTextField('ContractListID', {
                  label: 'ContractListID'
                }),
                PropertyPaneTextField('HHHHContactListId', {
                  label: "HHHH Contact ListId"
                }),
                PropertyPaneTextField('HHHHInstitutionListId', {
                  label: "HHHH Institution ListId"
                }),
                PropertyPaneTextField('HR_SMARTMETADATA_LISTID', {
                  label: "HR SmartMetadata ListId"
                }),
                PropertyPaneTextField('MAIN_HR_LISTID', {
                  label: "Main Hr ListId"
                }),
                PropertyPaneTextField('GMBH_CONTACT_SEARCH_LISTID', {
                  label: "Gmbh Contact Search ListId"
                }),
                PropertyPaneTextField('HR_EMPLOYEE_DETAILS_LIST_ID', {
                  label: "Hr Employee Details ListId"
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
