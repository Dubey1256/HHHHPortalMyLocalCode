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

import * as strings from 'ComponentProfileWebPartStrings';
import ComponentProfile from './components/ComponentProfile';
import { IComponentProfileProps } from './components/IComponentProfileProps';

export interface IComponentProfileWebPartProps {
  description: string;
  MasterTaskListID: 'ec34b38f-0669-480a-910c-f84e92e58adf';
  TaskUsertListID: 'b318ba84-e21d-4876-8851-88b94b9dc300';
  DocumentsListID:'d0f88b8f-d96d-4e12-b612-2706ba40fb08';
  SmartMetadataListID: '01a34938-8c7e-4ea6-a003-cee649e8c67a',
  SmartHelptListID:'9cf872fc-afcd-42a5-87c0-aab0c80c5457',
  dropdownvalue:string,
}

export default class ComponentProfileWebPart extends BaseClientSideWebPart<IComponentProfileWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  public render(): void {
    const element: React.ReactElement<IComponentProfileProps> = React.createElement(
      ComponentProfile,
      {
        description: this.properties.description,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,
        siteUrl: this.context.pageContext.web.absoluteUrl,
        MasterTaskListID: this.properties.MasterTaskListID,
        TaskUsertListID: this.properties.TaskUsertListID,
        DocumentsListID:this.properties.DocumentsListID,
        SmartHelptListID:this.properties.SmartHelptListID,
        SmartMetadataListID: this.properties.SmartMetadataListID,
        Context: this.context,
        dropdownvalue:this.properties.dropdownvalue,
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
                // PropertyPaneTextField('description', {
                //   label: strings.DescriptionFieldLabel
                // }),
            
                PropertyPaneTextField('TaskUsertListID', {
                  label: 'Task User List'
                }),
                PropertyPaneTextField('SmartHelptListID', {
                  label: 'SmartHelp List'
                }),
                PropertyPaneTextField('SmartMetadataListID', {
                  label: 'Smart Metadata List'
                }),
                PropertyPaneTextField('DocumentsListID', {
                  label: 'Documents List'
                }),
                PropertyPaneTextField('MasterTaskListID', {
                  label: 'Master Task List',
                }),
              ]
            }
          ]
        }
      ]
    };
  }
}
