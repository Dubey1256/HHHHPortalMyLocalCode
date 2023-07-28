import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'UserTimeEntryWebPartStrings';
import UserTimeEntry from './components/UserTimeEntry';
import { IUserTimeEntryProps } from './components/IUserTimeEntryProps';

export interface IUserTimeEntryWebPartProps {
  description: string;  
  TaskUserListID : "b318ba84-e21d-4876-8851-88b94b9dc300";
  SmartMetadataListID : "01a34938-8c7e-4ea6-a003-cee649e8c67a";
  TaskTimeSheetListNewListID : "464fb776-e4b3-404c-8261-7d3c50ff343f";
  TaskTimeSheet2ListID : "9ed5c649-3b4e-42db-a186-778ba43c5c93";
  
}

export default class UserTimeEntryWebPart extends BaseClientSideWebPart<IUserTimeEntryWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  protected onInit(): Promise<void> {
    this._environmentMessage = this._getEnvironmentMessage();

    return super.onInit();
  }

  public render(): void {
    const element: React.ReactElement<IUserTimeEntryProps> = React.createElement(
      UserTimeEntry,
      {
        description: this.properties.description,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,
        Context: this.context,
        TaskUserListID: this.properties.TaskUserListID,
        SmartMetadataListID: this.properties.SmartMetadataListID, 
        TaskTimeSheetListNewListID: this.properties.TaskTimeSheetListNewListID,
      TaskTimeSheet2ListID : this.properties.TaskTimeSheet2ListID
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
                PropertyPaneTextField('SmartMetadataListID', {
                  label: 'Smart Metadata ListID'
                }),
                PropertyPaneTextField('TaskUserListID', {
                  label: 'Task users ListID'
                }),
                PropertyPaneTextField('TaskTimeSheet2ListID', {
                  label: 'TasksTimesheet2 ListID'
                }),
                PropertyPaneTextField('TaskTimeSheetListNewListID', {
                  label: 'TaskTimeSheetListNew ListID'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
