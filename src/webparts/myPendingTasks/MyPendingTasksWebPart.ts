import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'MyPendingTasksWebPartStrings';
import MyPendingTasksApp from './components/MyPendingTasksApp';
import { IMyPendingTasksAppProps } from './components/IMyPendingTasksAppProps';

import {getSP} from "../../spservices/pnpjsConfig"

export interface IMyPendingTasksWebPartProps {
  description: string;
}

export default class MyPendingTasksWebPart extends BaseClientSideWebPart<IMyPendingTasksWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IMyPendingTasksAppProps> = React.createElement(
      MyPendingTasksApp,
      {
        userEMail: this.context.pageContext.user.loginName
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected async onInit(): Promise<void> {
    await super.onInit();
    getSP(this.context);   
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
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
