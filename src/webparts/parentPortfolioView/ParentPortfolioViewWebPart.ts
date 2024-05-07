import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'ParentPortfolioViewWebPartStrings';
import ParentPortfolioView from './components/ParentPortfolioView';
import { IParentPortfolioViewProps } from './components/IParentPortfolioViewProps';

export interface IParentPortfolioViewWebPartProps {
  description: string;
  TaskUserListID:string;
  SmartMetadataListID:string;
  MasterTaskListID :string;
  TaskTimeSheetListID:string;
  DocumentsListID:string;
  SmartHelptListID:string;
  PortFolioTypeID:string;
  SmartInformationListID:string;
  TaskTypeID:string;
  isShowTimeEntry:string;
  isShowSiteCompostion:string;
  context:any;
}

export default class ParentPortfolioViewWebPart extends BaseClientSideWebPart<IParentPortfolioViewWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  public render(): void {
    const element: React.ReactElement<IParentPortfolioViewProps> = React.createElement(
      ParentPortfolioView,
      {
        description: this.properties.description,
        isDarkTheme: this._isDarkTheme,
        siteUrl: this.context.pageContext.web.absoluteUrl,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,
        TaskUserListID: this.properties.TaskUserListID,
        SmartMetadataListID: this.properties.SmartMetadataListID,
        SmartHelptListID: this.properties.SmartHelptListID,
        PortFolioTypeID:this.properties.PortFolioTypeID,
        MasterTaskListID:this.properties.MasterTaskListID,
        TaskTimeSheetListID:this.properties.TaskTimeSheetListID,
        DocumentsListID:this.properties.DocumentsListID,
        SmartInformationListID:this.properties.SmartInformationListID,
        TaskTypeID:this.properties.TaskTypeID,
        isShowTimeEntry:this.properties.isShowTimeEntry,
        isShowSiteCompostion:this.properties.isShowSiteCompostion,
        context:this.context,
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
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyPaneTextField('TaskUserListID',{
                  label:'TaskUserListID'
                }),
                PropertyPaneTextField('SmartMetadataListID',{
                  label:'SmartMetadataListID'
                }),
                PropertyPaneTextField('MasterTaskListID',{
                  label:'MasterTaskListID'
                }),
                PropertyPaneTextField('TaskTimeSheetListID',{
                  label:'TaskTimeSheetListID'
                }),
                PropertyPaneTextField('DocumentsListID',{
                  label:'DocumentsListID'
                }),
                PropertyPaneTextField('SmartInformationListID',{
                  label:'SmartInformationListID'
                }),
                PropertyPaneTextField('TaskTypeID',{
                  label:'TaskTypeID'
                }),
                PropertyPaneTextField('SmartHelptListID',{
                  label:'SmartHelptListID'
                }),
                PropertyPaneTextField('PortFolioTypeID',{
                  label:'PortFolioTypeID'
                }),
                PropertyPaneTextField('isShowTimeEntry',{
                  label:'isShowTimeEntry'
                }),
                PropertyPaneTextField('isShowSiteCompostion',{
                  label:'isShowSiteCompostion'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
