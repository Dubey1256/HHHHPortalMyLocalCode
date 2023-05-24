import { Pivot, PivotLinkFormat, PivotLinkSize, PivotItem } from "office-ui-fabric-react";
import * as React from "react";

import { ITaskUserProps } from "./ITaskUserProps";
import ITaskUserState from "./ITaskUserState";

import TaskTeamMembers from "./TaskTeamMembers";
import TaskTeamGroups from "./TaskTeamGroups";
import spservices from "../../../spservices/spservices";

export default class AllTaskUserApp extends React.Component<ITaskUserProps, ITaskUserState> {

    private spService: spservices = null;

    constructor(props: ITaskUserProps, state: ITaskUserState) {
        super(props);
        this.spService = new spservices();

        this.state = {
            teamMembersTasks: [],
            teamGroupsTasks: []
        };

        this.loadTasks = this.loadTasks.bind(this);
    } 
    
    public async loadTasks() {

        const allTasks = await this.spService.getTasks(this.props.taskUsersListId);
        
        const teamMembersTasks = allTasks.filter(taskItem=>taskItem.ItemType=="User").map(taskItem => ({
            Title: taskItem.Title,
            Group: taskItem.UserGroup ? taskItem.UserGroup.Title : "",
            Category: taskItem.TimeCategory,
            Role: taskItem.Role ? (taskItem.Role.map((i: string)=> {
                if(i=='Deliverable Teams') {return "Component Teams"}
                else {return i}
            }).join(",")) : "",
            Company: taskItem.Company,            
            Approver: taskItem.Approver ? taskItem.Approver.map((i: { Title: any; })=>i.Title).join(", ") : "",
            TaskId: taskItem.Id,
            Suffix: taskItem.Suffix,
            GroupId: taskItem.UserGroup ? taskItem.UserGroup.Id.toString() : "",            
            AssignedToUserMail: taskItem.AssingedToUser ? [taskItem.AssingedToUser.Name.split("|")[2]] : [],
            ApproverMail: taskItem.Approver ? taskItem.Approver.map((i: { Name: string; })=>i.Name.split("|")[2]) : [],
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

        const teamGroupsTasks = allTasks.filter(taskItem=>taskItem.ItemType=="Group").map(taskItem => ({
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
        
        if( allTasks.length ) {
            this.setState({
                teamMembersTasks: teamMembersTasks,
                teamGroupsTasks: teamGroupsTasks
            });
        }        
    }

    componentDidMount(): void {
        this.loadTasks();
    }

    render() {
        
        const elemTaskTeamMembers = <TaskTeamMembers tasks={this.state.teamMembersTasks} spService={this.spService} context={this.props.context} loadTasks={this.loadTasks} teamGroups={this.state.teamGroupsTasks} taskUsersListId={this.props.taskUsersListId} smartMetadataListId={this.props.smartMetadataListId} imagesLibraryId={this.props.imagesLibraryId} defaultApproverEMail={"deepak@hochhuth-consulting.de"} />;
        const elemTaskTeamGroups = <TaskTeamGroups tasks={this.state.teamGroupsTasks} spService={this.spService} context={this.props.context} loadTasks={this.loadTasks}  taskUsersListId={this.props.taskUsersListId} />;

        const elemPivot = (<Pivot linkFormat={ PivotLinkFormat.tabs } linkSize={ PivotLinkSize.normal }>
            <PivotItem headerText="TEAM MEMBERS">{elemTaskTeamMembers}</PivotItem>
            <PivotItem headerText="TEAM GROUPS">{elemTaskTeamGroups}</PivotItem>

        </Pivot>);

        return (<div className="ms-Grid"><div className="ms-Grid-row">{elemPivot}</div></div>);
    }
    
}