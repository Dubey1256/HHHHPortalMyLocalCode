import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'TasksViewWebPartStrings';

export interface ITasksViewWebPartProps {
  TaskUsertListID: string;
  ListConfigurationListID: string;
}

import { ITasksViewAppProps } from './components/ITasksViewAppProps';
import { getSP } from '../../spservices/pnpjsConfig';
import TasksViewApp from './components/TasksViewApp';

export default class TasksViewWebPart extends BaseClientSideWebPart<ITasksViewWebPartProps> {
  
  public render(): void {
    const element: React.ReactElement<ITasksViewAppProps> = React.createElement(
      TasksViewApp,
      {
        taskUsersListId: this.properties.TaskUsertListID,
        listConfigurationListId: this.properties.ListConfigurationListID
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
                PropertyPaneTextField('TaskUsertListID', {
                  label: "Task User List'"
                }),
                PropertyPaneTextField("ListConfigurationListID", {
                  label: "List Configuration List"
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
