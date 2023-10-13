import { Pivot, PivotLinkFormat, PivotLinkSize, PivotItem } from "office-ui-fabric-react";
import * as React from "react";

import { ITaskUserProps } from "./ITaskUserProps";
import ITaskUserState from "./ITaskUserState";

import TaskTeamMembers from "./TaskTeamMembers";
import TaskTeamGroups from "./TaskTeamGroups";
import spservices from "../../../spservices/spservices";
import PageLoader from "../../../globalComponents/pageLoader";

export default class AllTaskUserApp extends React.Component<ITaskUserProps, ITaskUserState> {

  private spService: spservices = null;
  constructor(props: ITaskUserProps, state: ITaskUserState) {
    super(props);
    this.spService = new spservices();
   
    this.state = {
      teamMembersTasks: [],
      teamGroupsTasks: [],
    };

    this.loadTasks = this.loadTasks.bind(this);
  }

  componentDidMount(): void {
    this.loadTabData('TEAM MEMBERS');
  }

  public async loadTasks() {
    const allTasks = await this.spService.getTasks(this.props.taskUsersListId);
    const teamMembersTasks = allTasks.filter(taskItem => taskItem.ItemType == "User").map(taskItem => ({
        Title: taskItem.Title,
        Group: taskItem.UserGroup ? taskItem.UserGroup.Title : "",
        Category: taskItem.TimeCategory,
        Role: taskItem.Role ? (taskItem.Role.map((i: string) => {
            if (i == 'Deliverable Teams') { return "Component Teams" }
            else { return i }
        }).join(",")) : "",
        Company: taskItem.Company,
        Approver: taskItem.Approver ? taskItem.Approver.map((i: { Title: any; }) => i.Title).join(", ") : "",
        TaskId: taskItem.Id,
        Suffix: taskItem.Suffix,
        Team: taskItem.Team,
        GroupId: taskItem.UserGroup ? taskItem.UserGroup.Id.toString() : "",
        AssignedToUserMail: taskItem.AssingedToUser ? [taskItem.AssingedToUser.Name.split("|")[2]] : [],
        ApproverMail: taskItem.Approver ? taskItem.Approver.map((i: { Name: string; }) => i.Name.split("|")[2]) : [],
        ApprovalType: taskItem.IsApprovalMail,
        CategoriesItemsJson: taskItem.CategoriesItemsJson ? JSON.parse(taskItem.CategoriesItemsJson) : [],
        TimeCategory: taskItem.TimeCategory,
        IsActive: taskItem.IsActive,
        IsTaskNotifications: taskItem.IsTaskNotifications,
        ItemCover: taskItem.Item_x0020_Cover,
        CreatedOn: taskItem.Created.split("T")[0],
        CreatedBy: taskItem.Author.Title,
        ModifiedOn: taskItem.Modified.split("T")[0],
        ModifiedBy: taskItem.Editor.Title
    }));
    const teamGroupsTasks = allTasks.filter(taskItem => taskItem.ItemType == "Group").map(taskItem => ({
        Title: taskItem.Title,
        Suffix: taskItem.Suffix,
        SortOrder: taskItem.SortOrder,
        AssignedToUserMail: taskItem.AssingedToUser ? [taskItem.AssingedToUser.Name.split("|")[2]] : [],
        CreatedOn: taskItem.Created.split("T")[0],
        CreatedBy: taskItem.Author.Title,
        ModifiedOn: taskItem.Modified.split("T")[0],
        ModifiedBy: taskItem.Editor.Title,
        TaskId: taskItem.Id.toString()
    }));
    if (allTasks.length) {
        this.setState({
            teamMembersTasks: teamMembersTasks,
            teamGroupsTasks: teamGroupsTasks
        });
    }
}

  private tabContent: any = {
    'TEAM MEMBERS': null,
    'TEAM GROUPS': null,
  };
  
  private activeTab = 'TEAM MEMBERS';
  
  private handleTabChange(tab: string) {
    this.activeTab = tab;
    if (!this.tabContent[tab]) {
      this.loadTabData(tab);
    }
    this.forceUpdate(); // Force a re-render of the component
  }

  private loadTabData(tab: string) {
    if (tab === 'TEAM MEMBERS') {
      this.tabContent[tab] = <TaskTeamMembers tasks={this.state.teamMembersTasks} spService={this.spService} context={this.props.context} loadTasks={this.loadTasks} teamGroups={this.state.teamGroupsTasks} taskUsersListId={this.props.taskUsersListId} smartMetadataListId={this.props.smartMetadataListId} imagesLibraryId={this.props.imagesLibraryId} defaultApproverEMail={"deepak@hochhuth-consulting.de"} />;
    } else if (tab === 'TEAM GROUPS') {
      this.tabContent[tab] = <TaskTeamGroups tasks={this.state.teamGroupsTasks} spService={this.spService} context={this.props.context} loadTasks={this.loadTasks} taskUsersListId={this.props.taskUsersListId} />;
    }
    this.forceUpdate();
  }
  
  render() {
    const elemPivot = (
      <>
        <div className='header-section full-width justify-content-between'>
          <h2 style={{ color: "#000066", fontWeight: "600" }}>TaskUser Management
            <a data-interception="off" className=' text-end pull-right' target='_blank' href="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/TaskUser-Management.aspx" style={{ cursor: "pointer", fontSize: "14px" }}>Old TaskUser Management</a>
          </h2>
        </div>
        <ul className="nav nav-tabs" id="myTab" role="tablist">
          <li className="nav-item" role="presentation">
            <button onClick={() => this.handleTabChange('TEAM MEMBERS')} className={`nav-link ${this.activeTab === 'TEAM MEMBERS' ? 'active' : ''}`} id="home-tab" type="button" role="tab" aria-controls="home" aria-selected="true">TEAM MEMBERS</button>
          </li>
          <li className="nav-item" role="presentation">
            <button onClick={() => this.handleTabChange('TEAM GROUPS')} className={`nav-link ${this.activeTab === 'TEAM GROUPS' ? 'active' : ''}`} id="profile-tab" type="button" role="tab" aria-controls="profile" aria-selected="false">TEAM GROUPS</button>
          </li>
        </ul>  
        <div className="tab-content border border-top-0 clearfix " id="nav-tabContent">
          <div className={`tab-pane fade px-1 ${this.activeTab === 'TEAM MEMBERS' ? 'show active' : ''}`} id="Contact" role="tabpanel" aria-labelledby="home-tab">
            {this.tabContent['TEAM MEMBERS']}
          </div>
          <div className={`tab-pane fade px-1 ${this.activeTab === 'TEAM GROUPS' ? 'show active' : ''}`} id="Institution" role="tabpanel" aria-labelledby="profile-tab">
            {this.tabContent['TEAM GROUPS']}
          </div>
        </div>        
      </>
    );
  
    return (
      <div className="ms-Grid">
        <div className="ms-Grid-row">{elemPivot}</div>
      </div>
    );
  }       
}
