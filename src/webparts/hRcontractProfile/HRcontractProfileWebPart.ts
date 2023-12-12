import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'HrContractProfileWebPartStrings';

import pnp from 'sp-pnp-js';
import HrContractProfile from './components/HRcontractProfile';
import { IHrContractProfileProps } from './components/IHrContractProfileProps';


export interface IHrContractProfileWebPartProps {
  description: string;
  ContractListID:'c0106d10-a71c-4153-b204-7cf7b45a68b8',
  HR_EMPLOYEE_DETAILS_LIST_ID:'a7b80424-e5e1-47c6-80a1-0ee44a70f92c',
  MAIN_SMARTMETADATA_LISTID:'D1C6D7C3-F36E-4F95-8715-8DA9F33622E7',
  MAIN_HR_LISTID:'6DD8038B-40D2-4412-B28D-1C86528C7842',
}

export default class HrContractProfileWebPart extends BaseClientSideWebPart<IHrContractProfileWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  public render(): void {
    const element: React.ReactElement<IHrContractProfileProps> = React.createElement(
      HrContractProfile,
      {
        description: this.properties.description,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,
        siteUrl: this.context.pageContext.web.absoluteUrl,
        ContractListID : this.properties.ContractListID,
        MAIN_SMARTMETADATA_LISTID:'D1C6D7C3-F36E-4F95-8715-8DA9F33622E7',
        MAIN_HR_LISTID:'6DD8038B-40D2-4412-B28D-1C86528C7842',
        HR_EMPLOYEE_DETAILS_LIST_ID:'a7b80424-e5e1-47c6-80a1-0ee44a70f92c',
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
                PropertyPaneTextField('MAIN_SMARTMETADATA_LISTID', {
                  label: "Main SmartMetadata ListId"
                }),
                PropertyPaneTextField('MAIN_HR_LISTID', {
                  label: "Main Hr ListId"
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
