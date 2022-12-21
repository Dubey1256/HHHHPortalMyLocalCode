import * as React from 'react';
import { IDashboardProps } from './IDashboardProps';
import { escape } from '@microsoft/sp-lodash-subset';
import TaskDashboard from './TaskBoard';
import DragDrop from './Drag&Drop';
//import { CurrentUser } from 'sp-pnp-js/lib/sharepoint/siteusers';
// import { sp } from '@pnp/sp';
//import { escape } from '@microsoft/sp-lodash-subset';


export default class Dashboard extends React.Component<IDashboardProps, {}> {

  public render(): React.ReactElement<IDashboardProps> {
    const {
      userDisplayName
    } = this.props;
   
   
    return (
      <section>
       
       
         <h5>Welcome {escape(userDisplayName)}</h5>
       <TaskDashboard props={userDisplayName}/>
      </section>
    );
  }
}
