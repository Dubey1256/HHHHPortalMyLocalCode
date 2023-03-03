import { buildColumns, ConstrainMode, DetailsList, DetailsListLayoutMode, IColumn, Selection, SelectionMode } from "@fluentui/react/lib/DetailsList";
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { CommandBar, DefaultButton, Dialog, DialogFooter, DialogType, FontIcon, ICommandBarItemProps, Icon, Label, Link, mergeStyles, Panel, PrimaryButton, SearchBox, Text, TextField  } from "office-ui-fabric-react";
import * as React from "react";
import { Component } from "react";

import { ITeamGroupsProps } from "./ITeamGroupsProps";
import { ITeamGroupsState } from "./ITeamGroupsState";

const controlStyles = {
    root: {
        margin: '10px 5px 20px 0px',
        maxWidth: '300px'
    }
};

const iconClass = mergeStyles({
    fontSize: 25,
    height: 25,
    width: 25,
    margin: '0 5px',
});

const deleteDialogContentProps = {
    type: DialogType.close,
    title: 'Delete Team Group',
    closeButtonAriaLabel: 'Close',
    subText: 'Are you sure, you want to delete this?',
};

export default class TaskTeamGroups extends Component<ITeamGroupsProps, ITeamGroupsState> {
    private _selection: Selection;
    private commandBarItems: ICommandBarItemProps[] = null;
    constructor(props: ITeamGroupsProps) {
        super(props);
        this.state = {
            tasks: [],
            searchText: "",
            showCreatePanel: false,
            showEditPanel: false,
            hideDeleteDialog: true,
            selTaskId: undefined,
            sortedItems: [],
            columns: [],
            enableSave: false,
            showDelete: false,
            taskItem: {
                userId: undefined,
                userMail: [],
                groupTitle: "",
                groupSuffix: "",
                sortOrder: undefined,
                approverId: [36],
                itemType: "Group"
            }
        };

        this._selection = new Selection({
            onSelectionChanged: this._onItemsSelectionChanged,
        });

        this.onAddGroupMemberClick = this.onAddGroupMemberClick.bind(this);
        this.onSearchTextChange = this.onSearchTextChange.bind(this);
        this.getUserDetails = this.getUserDetails.bind(this);
        this.onSaveTask = this.onSaveTask.bind(this);        
        this.onCancelTask = this.onCancelTask.bind(this);
        this.onEditTask = this.onEditTask.bind(this);
        this.onEditIconClick = this.onEditIconClick.bind(this);
        this.onDeleteTask = this.onDeleteTask.bind(this);
        this.onDeleteIconClick = this.onDeleteIconClick.bind(this);
        this.onCancelDeleteDialog = this.onCancelDeleteDialog.bind(this);
        this.onConfirmDeleteDialog = this.onConfirmDeleteDialog.bind(this);
        this.createTask = this.createTask.bind(this);
        this.updateTask = this.updateTask.bind(this);
        this.deleteTask = this.deleteTask.bind(this);
        this.updateGallery = this.updateGallery.bind(this);

        this.onTitleChange = this.onTitleChange.bind(this);
        this.onSuffixChange = this.onSuffixChange.bind(this);
        this.onSortOrderChange = this.onSortOrderChange.bind(this);

        this.commandBarItems = [
            {
                key: "editTask",
                text: "Edit Group",
                iconProps: { iconName: "Edit" },
                onClick: ()=>{this.onEditTask()}
            },
            {
                key: "deleteTask",
                text: "Delete Group",
                iconProps: { iconName: "Delete" },
                onClick: () => {this.onDeleteTask()}
            }
        ];
    }

    private async getUserDetails(users: any[]) {
        let userId: number = undefined;

        if(users.length>0) {
            let userMail = users[0].id.split("|")[2];
            let userInfo = await this.props.spService.getUserInfo(userMail);
            userId = userInfo.Id;
        }
        let taskItem = {...this.state.taskItem};
        taskItem.userId = userId;
        this.setState({
            taskItem: taskItem
        }); 
    }

    componentDidMount(): void {

        const listTasks: any[] = [...this.props.tasks].map(({Title, SortOrder, TaskId})=>({Title, SortOrder, TaskId}));
        
        this.setState({
            tasks: this.props.tasks,
            sortedItems: listTasks,
            columns: this._buildColumns(listTasks)
        });
    }
   
    private onSearchTextChange(ev: any, filterText: string) {
        filterText = filterText.toLowerCase();
        let allTasks = [...this.props.tasks];
        allTasks = allTasks.map(({Title, SortOrder, TaskId})=>({Title, SortOrder, TaskId}))
        let fliteredTasks = [];
        let textExists: boolean;
        let cellValue: string | undefined;
        if (filterText.length >=3 ) {            
            allTasks.forEach((taskItem)=>{
                textExists = false;            
                Object.keys(taskItem).forEach(key=>{
                    cellValue = taskItem[key];
                    if( cellValue && cellValue.toString().toLowerCase().indexOf(filterText)>-1) {
                        textExists = true;
                    }
                });
                if(textExists) {
                    fliteredTasks.push(taskItem);
                }
            });
        }
        else {
            fliteredTasks = allTasks;
        }
        this.setState({
            tasks: fliteredTasks,
            sortedItems: fliteredTasks,
            columns: this._buildColumns(fliteredTasks)
        });
    }

    private async onAddGroupMemberClick() {
        let taskItem = {...this.state.taskItem};
        taskItem.groupTitle = "";
        taskItem.groupSuffix = "";
        taskItem.sortOrder = undefined;
        this.setState({
            taskItem: taskItem,
            showCreatePanel: true
        });
    }

    private onEditIconClick(selTaskId: number) {
        this.setState({
            selTaskId: selTaskId
        }, this.onEditTask);
    }

    private onEditTask() {
        let allTasks = [...this.props.tasks];
        let selTask = allTasks.filter(t=>t.TaskId==this.state.selTaskId)[0];
        console.log(selTask);
        let selTaskItem = {...this.state.taskItem};
        selTaskItem.groupTitle = selTask.Title;
        selTaskItem.groupSuffix = selTask.Suffix;
        selTaskItem.sortOrder = selTask.SortOrder;
        selTaskItem.userMail = selTask.AssignedToUserMail;
        selTaskItem.createdOn = selTask.CreatedOn;
        selTaskItem.createdBy = selTask.CreatedBy;
        selTaskItem.modifiedOn = selTask.ModifiedOn;
        selTaskItem.modifiedBy = selTask.ModifiedBy;

        this.setState({
            showEditPanel: true,
            taskItem: selTaskItem,
            enableSave: true
        });
    }

    private onDeleteIconClick(selTaskId:number) {
        this.setState({
            selTaskId: selTaskId
        }, this.onDeleteTask);
    }

    private onDeleteTask() {
        this.setState({
            hideDeleteDialog: false
        });
    }

    private onCancelTask() {
        this.setState({
            showCreatePanel: false,
            showEditPanel: false
        });
    }

    private onCancelDeleteDialog() {
        this.setState({
            hideDeleteDialog:true
        });
    }

    private onConfirmDeleteDialog() {
        this.setState({
            hideDeleteDialog: true
        });
        this.deleteTask();
    }

    private updateGallery() {
        this.props.loadTasks();
        const listTasks: any[] = [...this.props.tasks].map(({Title, SortOrder, TaskId})=>({Title, SortOrder, TaskId}));
        
        this.setState({
            tasks: this.props.tasks,
            sortedItems: listTasks,
            columns: this._buildColumns(listTasks)
        });
    }

    private onTitleChange(_ev: any, groupTitle: string) {
        let enableSave: boolean = false;
        if(groupTitle.length>0) { enableSave = true; }
        let taskItem = {...this.state.taskItem};
        taskItem.groupTitle = groupTitle;
        this.setState({
            taskItem: taskItem,
            enableSave: enableSave
        });
    }

    private onSuffixChange(_ev: any, groupSuffix: string) {
        let taskItem = {...this.state.taskItem};
        taskItem.groupSuffix = groupSuffix;
        this.setState({
            taskItem: taskItem
        });
    }

    private onSortOrderChange(_ev: any, sortOrder: string) {
        let taskItem = {...this.state.taskItem};
        taskItem.sortOrder = sortOrder;
        this.setState({
            taskItem: taskItem
        });
    }

    private onSaveTask() {
        if (this.state.selTaskId) {
            this.updateTask();
        }
        else {
            this.createTask();
        }
    }

    

    private async createTask() {
        let taskItem = {...this.state.taskItem};
        let newTaskItem = {
            Title: taskItem.groupTitle,
            Suffix: taskItem.groupSuffix ? taskItem.groupSuffix : taskItem.groupTitle.split(" ").map(i=>i.charAt(0)).join(""),
            SortOrder: taskItem.sortOrder,
            ApproverId: taskItem.approverId,
            ItemType: taskItem.itemType
        };

        console.log(newTaskItem);

        const newTask = await this.props.spService.createTask(newTaskItem);
        if(newTask) {
            this.updateGallery();
            let taskItem = {...this.state.taskItem};
            taskItem.groupTitle = newTask.Title;
            taskItem.groupSuffix = newTask.Suffix;
            taskItem.sortOrder = newTask.SortOrder;
            this.setState({
                selTaskId: newTask.Id,
                taskItem: taskItem,
                showCreatePanel: false,
                showEditPanel: true
            });            
        }
    }

    private async updateTask() {
        let taskItem = {...this.state.taskItem};
        let updateTakItem = {
            Title: taskItem.groupTitle,
            Suffix: taskItem.groupSuffix ? taskItem.groupSuffix : taskItem.groupTitle.split(" ").map(i=>i.charAt(0)).join(""),
            SortOrder: taskItem.sortOrder,
            AssingedToUserId: taskItem.userId ? taskItem.userId : null
        };
        console.log(updateTakItem);
        await this.props.spService.editTask(this.state.selTaskId, updateTakItem);
        
        this.updateGallery();
        this.setState({
            selTaskId: undefined,
            showEditPanel: false
        });            
       
    }

    private async deleteTask() {
        
        this.props.spService.deleteTask(this.state.selTaskId);

        this.updateGallery();
        
        this.setState({
            selTaskId: undefined,
            showEditPanel: false
        });
    }

   

    render() {

        const elemCommandBar = ( false && <CommandBar 
            items ={this.commandBarItems} 
            styles={controlStyles}
        />);

        const elemGroupTaskList = (<DetailsList 
            items={this.state.sortedItems} 
            columns={this.state.columns} 
            selection = {this._selection} 
            selectionMode={SelectionMode.none}
            layoutMode={DetailsListLayoutMode.justified}
            constrainMode={ConstrainMode.unconstrained}
            isHeaderVisible={true}
        />);

        const elemControls = (<>
         <div className="tbl-headings">
<span className="leftsec">
<span> Showing  items </span> <span className="ms-1"> <SearchBox className="m-0" placeholder="Filter by Name:" styles={controlStyles} onChange={this.onSearchTextChange} /> </span>
</span>
<span className="toolbox mx-auto">
<PrimaryButton className="m-0" text="Add Team Group" styles={controlStyles} onClick={this.onAddGroupMemberClick} />

</span>


              
            </div>




            {/* <div className="ms-Grid-col ms-md8 ms-sm12">
              
            </div>
            <div className="ms-Grid-col ms-md4 ms-sm12">
                <PrimaryButton text="Add Team Group" styles={controlStyles} onClick={this.onAddGroupMemberClick} />
            </div> */}
        </>);

        const elemTaskMetadata = (this.state.showEditPanel &&  <div>
            <Label>Created on {this.state.taskItem.createdOn} by {this.state.taskItem.createdBy}</Label>
            <Label>Updated on {this.state.taskItem.modifiedOn} by {this.state.taskItem.modifiedBy}</Label>
            <Link href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/Lists/Task%20Users/DispForm.aspx?ID=${this.state.selTaskId}`} target="_blank">Open out-of-the-box form</Link>
            <Link href="#" onClick={this.onDeleteTask} style={{display:"block"}}><Icon iconName="Delete"/><Text>Delete this user</Text></Link>
        </div>);

        const elemSaveButton = (<PrimaryButton styles={controlStyles} onClick={this.onSaveTask} disabled={!this.state.enableSave}>Save</PrimaryButton>);
        const elemCancelButton = (<DefaultButton styles={controlStyles} onClick={this.onCancelTask}>Cancel</DefaultButton>);

        const elemActionButons = (<div>
            { elemSaveButton }
            { elemCancelButton }
        </div>);

        const elemDeleteDialog = (<Dialog 
            hidden={this.state.hideDeleteDialog}
            onDismiss={this.onCancelDeleteDialog}
            dialogContentProps={deleteDialogContentProps}
        >
            <DialogFooter>
                <PrimaryButton text="OK" onClick={this.onConfirmDeleteDialog} />
                <DefaultButton text="Cancel" onClick={this.onCancelDeleteDialog} />
            </DialogFooter>
        </Dialog>);

        const elemTaskGroupFooter = () => ( <div style={{"marginLeft": "20px"}}>
            { elemTaskMetadata }
            { elemActionButons }          
        </div>); 

        const elemNewGroupTaskFields = (<div className="ms-LegacyFabricBlock">
            <div className="ms-Grid">
                <div className="ms-Grid-row">
                    <TextField
                        label="Title"
                        styles={controlStyles}
                        required={true}
                        value={this.state.taskItem.groupTitle}
                        defaultValue= {this.state.taskItem.groupTitle}
                        onChange = { this.onTitleChange }
                    />
                </div>
                <div className="ms-Grid-row">
                    <TextField 
                        label="Suffix" 
                        styles={controlStyles}
                        value={this.state.taskItem.groupSuffix}
                        defaultValue= {this.state.taskItem.groupSuffix}
                        onChange = { this.onSuffixChange } 
                    />
                </div>
                <div className="ms-Grid-row">
                    <TextField
                        label="Sort Order" 
                        styles={controlStyles}
                        value={this.state.taskItem.sortOrder}
                        defaultValue= {this.state.taskItem.sortOrder}
                        onChange = { this.onSortOrderChange } 
                    />
                </div>
            </div>
        </div>);

        const elemNewTaskGroup = (<Panel
            headerText="Create New Group"
            isOpen={this.state.showCreatePanel}
            onDismiss={this.onCancelTask}
            isFooterAtBottom={true}
            onRenderFooter={elemTaskGroupFooter}
        >
            {elemNewGroupTaskFields}          
        </Panel>);

        const elemUser = (<PeoplePicker 
            context={this.props.context as any}
            principalTypes={[PrincipalType.User]}
            personSelectionLimit={1}
            titleText="User Name"
            resolveDelay={1000}
            onChange = { this.getUserDetails }
            defaultSelectedUsers={this.state.taskItem.userMail}
        ></PeoplePicker>);

        const elemEditGroupTaskFields = (<div className="ms-LegacyFabricBlock">
            <div className="ms-Grid">
                <div className="ms-Grid-row">
                    <TextField
                        label="Title"
                        styles={controlStyles}
                        required={true}
                        value={this.state.taskItem.groupTitle}
                        defaultValue= {this.state.taskItem.groupTitle}
                        onChange = { this.onTitleChange }
                    />
                </div>
                <div className="ms-Grid-row">
                    <TextField 
                        label="Suffix" 
                        styles={controlStyles}
                        value={this.state.taskItem.groupSuffix}
                        defaultValue= {this.state.taskItem.groupSuffix}
                        onChange = { this.onSuffixChange } 
                    />
                </div>
                <div className="ms-Grid-row">
                    <TextField
                        label="Sort Order" 
                        styles={controlStyles}
                        value={this.state.taskItem.sortOrder}
                        defaultValue= {this.state.taskItem.sortOrder}
                        onChange = { this.onSortOrderChange } 
                    />
                </div>
                <div className="ms-Grid-row">
                    {elemUser}
                </div>
            </div>
        </div>);

        const elemEditTaskGroup = (<Panel
            headerText="Update Group"
            isOpen={this.state.showEditPanel}
            onDismiss={this.onCancelTask}
            isFooterAtBottom={true}
            onRenderFooter={elemTaskGroupFooter}
        >
            {elemEditGroupTaskFields}          
        </Panel>);

        return (<div className="ms-Grid ">
            <div className="ms-Grid Alltable">{elemControls}</div>
            <div className="ms-Grid-row">{elemCommandBar}</div>
            <div className="ms-Grid-row">{elemGroupTaskList}</div>
            {elemNewTaskGroup}
            {elemEditTaskGroup}
            {elemDeleteDialog}
        </div>);
    }

    private _buildColumns(items: any[]): IColumn[] {
        const columns = buildColumns(items, false, this._onColumnClick);  
        
        columns.forEach((column: IColumn) => {
          if (column.name) {
            //column.showSortIconWhenUnsorted = true;
            if (column.name=="Title") {
                column.isSorted = true;
                column.isSortedDescending = false;
            }
            else if (column.name=="TaskId") {
                column.name = "";
                column.onRender = (item)=>(<div>
                    <FontIcon iconName="Edit" className={iconClass} onClick={()=>this.onEditIconClick(item.TaskId)} />
                    <FontIcon iconName="Delete" className={iconClass} onClick={()=>this.onDeleteIconClick(item.TaskId)} />
                </div>);
            }
          }
        });
    
        return columns;
    };

    private _onColumnClick = (event: React.MouseEvent<HTMLElement>, column: IColumn): void => {
        const { columns } = this.state;
        let { sortedItems } = this.state;
        let isSortedDescending = column.isSortedDescending;
    
        // If we've sorted this column, flip it.
        if (column.isSorted) {
          isSortedDescending = !isSortedDescending;
        }
    
        // Sort the items.
        sortedItems = _copyAndSort(sortedItems, column.fieldName!, isSortedDescending);
    
        // Reset the items and columns to match the state.
        this.setState({
          sortedItems: sortedItems,
          columns: columns.map(col => {
            col.isSorted = col.key === column.key;
    
            if (col.isSorted) {
              col.isSortedDescending = isSortedDescending;
            }
    
            return col;
          }),
        });
    };
    private _onItemsSelectionChanged = () => {        
        let selTasks = this._selection.getSelection();
        let selTaskId = undefined;
        if(selTasks.length>0){
            selTaskId = (selTasks[0] as any).TaskId
        } 
        this.setState({
            selTaskId: selTaskId
        });       
    };
}

function _copyAndSort<T>(items: T[], columnKey: string, isSortedDescending?: boolean): T[] {
    const key = columnKey as keyof T;
    return items.slice(0).sort((a: T, b: T) => ((isSortedDescending ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1));
}