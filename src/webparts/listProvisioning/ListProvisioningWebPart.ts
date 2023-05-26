import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'ListProvisioningWebPartStrings';
import ListProvisioning from './components/ListProvisioning';
import { IListProvisioningProps } from './components/IListProvisioningProps';

import { getSP } from './pnpjsConfig';

export interface IListProvisioningWebPartProps {
  description: string;
  MasterTaskListID: 'MasterTaskListID';
  TaskTypesListID: 'TaskTypesListID';
  SmartMetadataListID: 'SmartMetadataListID';  
  SmartInfoListID: 'SmartInfoListID';
  TaskTimeSheetListID : 'TaskTimeSheetListID';
  ProvisioningListID : 'ProvisioningListID'
}

export default class ListProvisioningWebPart extends BaseClientSideWebPart<IListProvisioningWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  protected async onInit(): Promise<void> {
    this._environmentMessage = this._getEnvironmentMessage();

    await super.onInit();

    //Initialize our _sp object that we can then use in other packages without having to pass around the context.
    // Check out pnpjsConfig.ts for an example of a project setup file.
    getSP(this.context);
  }

  public render(): void {
    const element: React.ReactElement<IListProvisioningProps> = React.createElement(
      ListProvisioning,
      {
        description: this.properties.description,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,
        pageContext: this.context.pageContext,
        MasterTaskListID: this.properties.MasterTaskListID,
        TaskTypesListID: this.properties.TaskTypesListID,
        SmartMetadataListID: this.properties.SmartMetadataListID,
        SmartInfoListID: this.properties.SmartInfoListID,
        TaskTimeSheetListID :  this.properties.TaskTimeSheetListID,
        ProvisioningListID : this.properties.ProvisioningListID
      }
    );

    ReactDom.render(element, this.domElement);
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
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyPaneTextField('ProvisioningListID', {
                  label: 'List Provisioing ListID'
                }),
                PropertyPaneTextField('SmartMetadataListID', {
                  label: 'Smart Metadata ListID'
                }),
                PropertyPaneTextField('SmartInfoListID', {
                  label: 'Smart Information ListID'
                }),
                PropertyPaneTextField('MasterTaskListID', {
                  label: 'Master Task ListID',
                }),
                PropertyPaneTextField('TaskTypesListID', {
                  label: 'Task Types ListID'
                }),
                PropertyPaneTextField('TaskTimeSheetListID', {
                  label: 'TaskTimesheet ListID'
                })               
                
              ]
            }
          ]
        }
      ]
    };
  }
}
