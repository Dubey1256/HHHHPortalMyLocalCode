import * as React from "react";

import styles from "./MyPendingTasks.module.scss";

import { IMyPendingTasksAppProps } from "./IMyPendingTasksAppProps";
import { IMyPendingTasksAppState } from "./IMyPendingTasksAppState";

import spservices from "../../../spservices/spservices";
import * as moment from "moment-timezone";
import { ColumnActionsMode, ContextualMenu, DefaultButton, DetailsList, Dialog, DialogFooter, DialogType, DirectionalHint, IColumn, Icon, IContextualMenuItem, IPersonaProps, IStackTokens, ITooltipProps, Label, Link, Persona, PersonaSize, PrimaryButton, SearchBox, SelectionMode, Stack, TextField, TooltipHost } from "@fluentui/react";
import { Utils } from "../common/Utils";
import * as _ from "lodash";

const buttonStyles = { root: { marginRight: 8 } };

const controlStyles = {
    root: {
        margin: '10px 5px 20px 0',
        maxWidth: '300px'
    }
};

const iconStyles = {root:{
    fontSize: 35,
    //height: 50,
    //width: 50,
    margin: '0 15px',
    color: 'deepskyblue'
}};

const SiteURL: string = "https://hhhhteams.sharepoint.com/sites/HHHH/SP";

class MyPendingTasksApp extends React.Component<IMyPendingTasksAppProps, IMyPendingTasksAppState> {
    
    private spService: spservices = null;

    constructor(props: IMyPendingTasksAppProps) {
        super(props);
        this.spService = new spservices();

        this._onRenderCreated = this._onRenderCreated.bind(this);
        this._onRenderTeamMembers = this._onRenderTeamMembers.bind(this);
        this._onRenderApprove = this._onRenderApprove.bind(this);
        this._onRenderReject = this._onRenderReject.bind(this);
        this._onRenderEdit = this._onRenderEdit.bind(this);
        this._onRenderDelete = this._onRenderDelete.bind(this);
        this._onCloseActionDialog = this._onCloseActionDialog.bind(this);
        this._onApproveClick = this._onApproveClick.bind(this);
        this._onRejectClick = this._onRejectClick.bind(this);
        this._onSearchTasks = this._onSearchTasks.bind(this);
        this._onColumnClick = this._onColumnClick.bind(this);
        this._onContextualMenuDismissed = this._onContextualMenuDismissed.bind(this);
        this._onSortColumn = this._onSortColumn.bind(this);
        this._onResetFiltersClicked = this._onResetFiltersClicked.bind(this);
        this.getFilterValues = this.getFilterValues.bind(this);
        this.ClickFilter = this.ClickFilter.bind(this);

        this.actionTask = this.actionTask.bind(this);

        this.state = {
            currentUserId: 0,
            currentUserInfo: {
                Title: ""
            },
            taskUsers: [],
            sMetadataItems: [],
            searchText: "",
            allPendingTasks: [],
            displayedPendingTasks: [],
            isLoading: false,
            columns: this._setupColumns(),
            hideActionDialog: true,
            actionDialogHeaderText: "",
            actionDialogPrimaryButtonText: "",
            comments: "",
            allTaskComments: [],
            selTaskItem: undefined,
            contextualMenuProps: null,
            showResetFilter: false
        };
        
    }

    componentDidMount(): void {
        this.loadConfigurations();
    }

    private async loadConfigurations() {
       const _currentUserInfo = await this.spService.getUserInfo(this.props.userEMail);
       const _currentUserId = _currentUserInfo.Id;
       const _taskUsers: any[] = await this.getTaskUsers();
       const _sMetadataItems = await this.getSmartMetadataItems();
       const currentTaskUser = _taskUsers.filter(taskUser=>taskUser.UserId==_currentUserId)[0];
       

       this.setState({
        currentUserId: _currentUserId,
        currentUserInfo: currentTaskUser,
        taskUsers: _taskUsers,
        sMetadataItems: _sMetadataItems,    
       }, ()=>this.loadList());       
    }

    private async loadList() {
        const _pendingTaskItems = await this.getPendingTasks(this.state.sMetadataItems, this.state.currentUserId);
        this.loadPendingTasks(_pendingTaskItems)
    }

    private loadPendingTasks(taskItems: any[]) {
        let _taskItems: any[] = [];
        let _taskItem: any;
        const _sMetadataItems = [...this.state.sMetadataItems];
        
        let companyType: string = "AllTask";
        let listId: string = "";
        let siteType: string = "";
        let categories: string[] = [];
        taskItems.forEach(taskItem => {
            companyType = "AllTask";
            listId = taskItem['odata.editLink'].split("'")[1].toUpperCase();
            siteType = _sMetadataItems.filter(sMetadataItem=>sMetadataItem.ListId.toUpperCase()==listId)[0].SiteType;
            if(siteType=="Offshore Tasks") {
                companyType = "OffshoreTask";
            }
            categories = this.getCategories(taskItem.SharewebCategories);
            if(categories.indexOf("Draft")>-1) {
                companyType = "DraftTask";
            }
            _taskItem = {
                ListId: listId,
                SiteType: siteType,
                TaskId: taskItem.Id,
                TaskTitle: taskItem.Title,
                Percentage: taskItem.PercentComplete || 0,
                DueDate: this.formatDate(taskItem.DueDate),
                PortfolioType: taskItem.Portfolio_x0020_Type || this.getPortfolioType(taskItem.ComponentId, taskItem.ServicesId, taskItem.EventsId),
                Component: this.getComponent(taskItem.Component),
                Priority: taskItem.Priority,
                StartDate: this.formatDate(taskItem.StartDate),
                CompletedDate: this.formatDate(taskItem.CompletedDate),
                Categories: categories,
                Status: taskItem.Status,
                ComponentLink: taskItem.component_x0020_link ? taskItem.component_x0020_link.Url : "",
                SharedWebCategories: taskItem.SharewebCategories,
                ShareWebId: this.getShareWebId(),
                Created: {
                    Date: this.formatDate(taskItem.Created),
                    ...this.getUserInfo(taskItem.Author.Id)
                },
                TeamUsers: this.getTeamUsers(taskItem.Responsible_x0020_Team, taskItem.AssignedTo, taskItem.Team_x0020_Members),
                Comments: taskItem.Comments
            };
            if(companyType != "DraftTask") {
                _taskItems.push(_taskItem);
            }            
        });
        this.setState({
            allPendingTasks: _taskItems,
            displayedPendingTasks: _taskItems
        });
    }

    private getComponent(components: any[]) {
        let _components = "";
        _components = components.map((i: { Title: string; })=>i.Title).join(";")
        return _components;
    }

    private formatDate(_date: string, _dateFormat?: string) {
        if(!_date) return "";
        let dateFormat = _dateFormat || "DD/MM/YYYY";
        let mDateTime = moment(_date).tz("Europe/Berlin").format(dateFormat);
        return mDateTime;
    }

    private getPortfolioType(collComponentsId: { results: number[] | any; }, collServicesId: { results: number[] | any; }, collEventsId: { results: number[] | any; }) {
        let _portfolioType: string = "Component";
        if(collComponentsId && collComponentsId.results.length>0) {
            _portfolioType = "Component";
        }
        else if(collServicesId && collServicesId.results.length>0) {
            _portfolioType = "Service";
        }
        else if(collEventsId && collEventsId.results.length>0) {
            _portfolioType = "Event";
        }
        return _portfolioType;
    }

    private getCategories(categories: (any[] | undefined)) {
        return (categories || []).map((item: { Title: string; })=>item.Title);
    }

    private getShareWebId() {
        return;
    }

    private getTeamUsers(respTeam: any[], assignedUsers: any[], teamMembers: any[]) {
        
        let respTeamInfo: any[] = [];
        let assignedUserInfo: any[] = [];
        let teamMemberInfo: any[] = [];

        if(respTeam) {
            respTeam.forEach((respTeamItem) => respTeamInfo.push({
                ...this.getUserInfo(respTeamItem.Id)
            }))
        }
        if(assignedUsers) {
            assignedUsers.forEach((assignedToItem) => assignedUserInfo.push({
                ...this.getUserInfo(assignedToItem.Id)
            }))
        }
        if(teamMembers) {
            teamMembers.forEach((teamMemberItem) => teamMemberInfo.push({
                ...this.getUserInfo(teamMemberItem.Id)
            }))
        }
        
        let teamUsers = {
            ResponsibleTeam: respTeamInfo,
            AssignedUsers: assignedUserInfo,
            TeamMembers: teamMemberInfo
        };

        return teamUsers;
    }

    private getUserInfo(userId: number) {
        let userInfo: any = {
            UserName: "",
            ImageUrl: "",
            UserId: undefined,
            UserEMail: ""
        };
        let taskUser = this.state.taskUsers.filter(taskUser=>taskUser.UserId==userId);
        let _taskUser;
        if(taskUser.length>0) {
            _taskUser = taskUser[0];
            userInfo.UserName = _taskUser.Title;
            userInfo.ImageUrl = _taskUser.ImageUrl;
            userInfo.UserId = _taskUser.UserId;
            userInfo.UserEMail = _taskUser.Mail;
        }
        return userInfo;
    }

    private async getTaskUsers() {
        const taskUsersRes = await this.spService.getTasks(this.props.taskUsersListId);
        const taskUsers = taskUsersRes.filter(taskUser=>taskUser.AssingedToUser!=null).map(taskUser=>({
            UserId: taskUser.AssingedToUser.Id,
            Title: taskUser.Title,
            ImageUrl: taskUser.Item_x0020_Cover ? taskUser.Item_x0020_Cover.Url : "",
            Company: taskUser.Company,
            Mail: taskUser.Email
        }));
        return taskUsers;
    }
    
    private async getSmartMetadataItems() {
        const taxTypes: string[] = ["Sites"];
        const excludedSites: string[] = ["Master Tasks", "DRR"];
        let _sMetadatItem = undefined;
        const sMetadataRes = await this.spService.getSmartMetadata(this.props.smartMetadataListId, taxTypes);
        const sMetadataItems = sMetadataRes.filter(sMetadateItem => {
            return (sMetadateItem.listId != undefined && excludedSites.indexOf(sMetadateItem.Title)==-1);
        }).map(sMetadateItem => {
            _sMetadatItem = {
                "Id": sMetadateItem.Id,
                "ListId": sMetadateItem.listId,
                "SiteType": sMetadateItem.Title,
                "Title": sMetadateItem.Title,                
                "TaxType": sMetadateItem.TaxType
            };
            return _sMetadatItem;
        });
        return sMetadataItems;
    }

    private async getPendingTasks(_sMetadataItems: any, _userId: number) {
        const qSelect: string = "Id,Title,Categories,SharewebTaskLevel1No,Comments,SharewebTaskLevel2No,SharewebTaskType/Id,SharewebTaskType/Title,Priority_x0020_Rank,Component/Id,Component/Title,Services/Id,Services/Title,Events/Id,Events/Title,PercentComplete,ComponentId,ServicesId,EventsId,Portfolio_x0020_Type,Priority,StartDate,CompletedDate,DueDate,Created,Modified,Status,component_x0020_link,Author/Id,Author/Title,Editor/Id,Editor/Title,ParentTask/Id,ParentTask/Title,ParentTask/Shareweb_x0020_ID,SharewebCategories/Id,SharewebCategories/Title,AssignedTo/Id,AssignedTo/Title,Team_x0020_Members/Id,Team_x0020_Members/Title,Responsible_x0020_Team/Id,Responsible_x0020_Team/Title,Approver/Title,Approver/Id,Approver/Name";
        const qExpand: string = "AssignedTo,Author,Editor,Component,Services,Events,Team_x0020_Members,ParentTask,SharewebCategories,Responsible_x0020_Team,SharewebTaskType,Approver";
        const qFilter: string = `(Approver/Id eq ${_userId}) and (PercentComplete eq .01)`; 
        //const qFilter: string = `(PercentComplete eq .01)`;        
        const qOrderBy: string = "Modified DESC";
        const qTop: number = 4999;

        const qStrings = {
            Select: qSelect,
            Expand: qExpand,
            Filter: qFilter,
            OrderBy: qOrderBy,
            Top: qTop
        };

        const pendingTasksReqInfo: any[] = [];
        _sMetadataItems.forEach((sMetadataItem: any) => {
            pendingTasksReqInfo.push({
                ListId: sMetadataItem.ListId,
                QueryStrings: qStrings
            });
        });
        const resPendingTasks = await this.spService.getListItemsInBatch(pendingTasksReqInfo);
        return resPendingTasks;
    }

    private _setupColumns(): IColumn[] {
        const columns: IColumn[] = [
            {
                key: "TaskId",
                name: "Task ID",
                fieldName: "TaskId",
                minWidth: 75,
                maxWidth: 75,
                data: Number,
                isResizable: true,
                columnActionsMode: ColumnActionsMode.hasDropdown,
                onRender(item, index, column) {
                    return `T${item.TaskId}`
                },
                onColumnClick: this._onColumnClick
            },
            {
                key: "TaskTitle",
                name: "Task Title",
                fieldName: "TaskTitle",
                minWidth: 150,
                maxWidth: 150,
                data: String,
                isResizable: true,
                columnActionsMode: ColumnActionsMode.hasDropdown,
                onRender(item, index, column) {
                    return item.TaskTitle
                },
                onColumnClick: this._onColumnClick
            },
            {
                key: "Percentage",
                name: "%",
                fieldName: "Percentage",
                minWidth: 30,
                maxWidth: 30,
                data: Number,
                isResizable: true,
                columnActionsMode: ColumnActionsMode.disabled,
                onRender(item, index, column) {
                    return `${item.Percentage*100}%`
                }
            },
            {
                key: "DueDate",
                name: "Due Date",
                fieldName: "DueDate",
                minWidth: 80,
                maxWidth: 80,
                data: Date,
                isResizable: true,
                columnActionsMode: ColumnActionsMode.hasDropdown,
                onColumnClick: this._onColumnClick
            },
            {
                key: "Categories",
                name: "Categories",
                fieldName: "Categories",
                minWidth: 100,
                maxWidth: 100,
                data: Array,
                isResizable: true,
                columnActionsMode: ColumnActionsMode.hasDropdown,
                onRender(item, index, column) {
                    return item.Categories.join(";")
                },
                onColumnClick: this._onColumnClick
            },
            {
                key: "Created",
                name: "Created Date",
                fieldName: "Created",
                minWidth: 100,
                maxWidth: 100,
                data: Object,
                isResizable: true,
                columnActionsMode: ColumnActionsMode.hasDropdown,
                onRender: this._onRenderCreated,
                onColumnClick: this._onColumnClick
            },
            {
                key: "TeamUsers",
                name: "Team Members",
                fieldName: "TeamMembers",
                minWidth: 120,
                data: Object,
                isResizable: true,
                columnActionsMode: ColumnActionsMode.hasDropdown,
                onRender: this._onRenderTeamMembers,
                onColumnClick: this._onColumnClick
            },
            {
                key: "Approve",
                name: "",
                minWidth: 100,
                onRender: this._onRenderApprove
            },
            {
                key: "Reject",
                name: "",
                minWidth: 100,
                onRender: this._onRenderReject
            },
            {
                key: "Edit",
                name: "",
                minWidth: 25,
                onRender: this._onRenderEdit
            },
            {
                key: "Delete",
                name: "",
                minWidth: 25,
                onRender: this._onRenderDelete
            }
        ];
        return columns;
    }

    private _onRenderCreated(item: any, index: number, column: IColumn) {
        const createdInfo = item.Created;
        const createdDate = createdInfo.Date;
        
        const stackTokens: IStackTokens = {
            childrenGap: 5
        };

        const personaUserCreated = this.getUserPersona(createdInfo);
        return (
            <Stack horizontal tokens={stackTokens}>
                <Stack.Item><div style={{fontSize: "12px", fontWeight: 400}}>{createdDate}</div></Stack.Item>
                <Stack.Item>{personaUserCreated}</Stack.Item>
            </Stack>
        );
    }

    private _onRenderTeamMembers(item: any, index: number, column: IColumn) {
        let respTeam = item.TeamUsers.ResponsibleTeam;
        let teamMembers: any[] = [];
        let combinedTeamMembers = [...item.TeamUsers.AssignedUsers, ...item.TeamUsers.TeamMembers];

        combinedTeamMembers.forEach(cTeamMember => {
            let collUniqueTeamMemberId = teamMembers.map((tMember: { UserId: number; })=>tMember.UserId);
            if(collUniqueTeamMemberId.indexOf(cTeamMember.UserId)==-1) {
                teamMembers.push(cTeamMember); 
            }
        });

        if(respTeam.length==0 && teamMembers.length==0) return;

        const stackTokens: IStackTokens = {
            childrenGap: 5
        };
        const divStyle = {
            fontSize: "24px",
            margin: "0 2px",
            lineHeight: "24px",
            color: "#858586"
        }

        let elemRespTeam = null;
        let elemDivider = null;
        elemDivider = (respTeam.length>0 && teamMembers.length>0) && (<Stack.Item><div style={divStyle}>|</div></Stack.Item>);
        
        if(respTeam.length>0) {
            respTeam = respTeam[0];
            let personaRespTeamUser = this.getUserPersona(respTeam);
            elemRespTeam = (<Stack.Item>{personaRespTeamUser}</Stack.Item>);
        }

        let elemMemberOne = null;
        let elemMemberTwo = null;
        if(teamMembers.length>0) {            
            const firstMember = teamMembers[0];
            elemMemberOne = (<Stack.Item>{this.getUserPersona(firstMember)}</Stack.Item>);
            if(teamMembers.length==2) {
                let secondMember = teamMembers[1];
                elemMemberTwo = (<Stack.Item>{this.getUserPersona(secondMember)}</Stack.Item>);
            }
            else if(teamMembers.length>2) {
                let restOfMembers = teamMembers.slice(1);                
                elemMemberTwo = (<Stack.Item>{this.getAdditionalMembers(restOfMembers)}</Stack.Item>);
            }
        }      
               
        return (
            <Stack horizontal tokens={stackTokens}>
                { elemRespTeam }
                { elemDivider }
                { elemMemberOne }
                { elemMemberTwo }
            </Stack>
        );
    }

    private getUserPersona(userInfo: any) {
        const personaProps: IPersonaProps = {
            size: PersonaSize.size24,
        }
        const userImage = userInfo.ImageUrl;
        const userName = userInfo.UserName;
        if(userImage) {
            personaProps.imageUrl = userImage;
        }
        else {
            personaProps.imageInitials = userName.split(" ").map((i: string)=>i.indexOf("+")>-1?i:i.charAt(0)).join("");
        }
        const elemPersona = <Persona {...personaProps} styles={{details:{padding:"0px"}}} />
        return (            
            <TooltipHost content={userName}>
                <Link href={this.getUserRedirectUrl(userInfo)} target="_blank">
                    { elemPersona }
                </Link>
            </TooltipHost>            
        );
    }

    private getAdditionalMembers(memberItems:any[]) {

        const personaProps: IPersonaProps = {
            size: PersonaSize.size24,
            imageInitials: `+${memberItems.length}`
        }
        const stackTokens: IStackTokens = {
            childrenGap: 5
        };
        let userName; let memberPersonaProps: IPersonaProps; let userImage;
        const tooltipProps: ITooltipProps = {
            onRenderContent: () => (
                <Stack tokens={stackTokens}>
                    {                         
                        memberItems.map( memberItem => {
                            userName =  memberItem.UserName;
                            userImage = memberItem.UserImage;
                            memberPersonaProps = {
                                size: PersonaSize.size24,
                                text: userName
                            };
                            if(userImage) {
                                memberPersonaProps.imageUrl = userImage;
                            }
                            else {
                                memberPersonaProps.imageInitials = userName.split(" ").map((i: string)=>i.charAt(0)).join("");
                            }
                            return (
                                <Stack.Item>
                                    <Link href={this.getUserRedirectUrl(memberItem)} target="_blank">
                                        <Persona {...memberPersonaProps} />
                                    </Link>
                                </Stack.Item>
                            ); 
                        })
                    }
                </Stack>                
            )
        };
        
        const elemPersona = <Persona {...personaProps} styles={{details:{padding:"0px"}}} />
        return (
            <TooltipHost tooltipProps={tooltipProps} directionalHint={DirectionalHint.rightCenter}>
                <Link href="#">
                    {elemPersona}
                </Link>
            </TooltipHost>
        );
    }

    private getUserRedirectUrl(userItem: any) {
        return `${SiteURL}/SitePages/TeamLeader-Dashboard.aspx?UserId=${userItem.UserId}&Name=${userItem.UserName}`;
    }

    private _onRenderApprove(item: any, index: number, column: IColumn) {
        let elemButtonAprove = <PrimaryButton text="Approve" styles={buttonStyles} className={styles.buttonApprove} onClick={()=>this._onApproveClick(item)} />;
        return elemButtonAprove;
    }

    private _onRenderReject(item: any, index: number, column: IColumn) {
        let elemButtonAprove = <PrimaryButton text="Reject" styles={buttonStyles} className={styles.butonReject} onClick={()=>this._onRejectClick(item)} />;
        return elemButtonAprove;
    }

    private _onRenderEdit() {
        let elemIconEdit = <Link href="#"><Icon iconName="Edit" style={{color:"blue", paddingLeft:"10px", fontSize:"20px",fontWeight:600}} /></Link>
        return elemIconEdit;
    }

    private _onRenderDelete() {
        let elemIconDelete = <Link href="#"><Icon iconName="Delete" style={{color:"red", paddingLeft:"10px", fontSize:"20px",fontWeight:600}} /></Link>
        return elemIconDelete;
    }

    private _onCloseActionDialog() {
        this.setState({
            hideActionDialog: true
        });
    }

    private _onApproveClick(selItem: any) {
        this.setState({
            hideActionDialog: false,
            actionDialogHeaderText: "Task Approval",
            actionDialogPrimaryButtonText: "Approve",
            selTaskItem: selItem
        });
    }

    private _onRejectClick(selItem: any) {
        this.setState({
            hideActionDialog: false,
            actionDialogHeaderText: "Task Rejection",
            actionDialogPrimaryButtonText: "Reject",
            selTaskItem: selItem
        });
    }

    private _onSearchTasks(ev: any, newText: string) {
        let utility = new Utils();
        let filteredTasks = utility.filterListItems(newText, this.state.allPendingTasks, this.state.displayedPendingTasks);
        this.setState({
            searchText: newText,
            displayedPendingTasks: filteredTasks
        });
    }

    private _onColumnClick(event: React.MouseEvent<HTMLElement>, column: IColumn) {
        if (column.columnActionsMode !== ColumnActionsMode.disabled) {
            this.setState({
              contextualMenuProps: this._getContextualMenuProps(event, column)
            });
        }
    }

    private _getContextualMenuProps(ev: React.MouseEvent<HTMLElement>, column: IColumn) {
        debugger;
        let utility = new Utils();
        
        let items: IContextualMenuItem[] = utility.GetSortingMenuItems(column, this._onSortColumn);
        if(true) {
            items.push({
                key: "filterBy",
                text: "Filter By",
                subMenuProps: {
                    items: this.getFilterValues(column)
                }
            });
        }
        return {
            items: items,
            target: ev.currentTarget as HTMLElement,
            directionalHint: DirectionalHint.bottomLeftEdge,
            gapSpace: 10,
            isBeakVisible: true,
            onDismiss: this._onContextualMenuDismissed
        };
    }

    private _onContextualMenuDismissed() {
        this.setState({
            contextualMenuProps: null
        });
    }

    private getFilterValues(column: IColumn): IContextualMenuItem[] {        
        debugger;
        let utility = new Utils();
        let filters = utility.GetFilterValues(column, this.state.displayedPendingTasks, this.ClickFilter);
        return filters;
    }

    public ClickFilter(ev?: React.MouseEvent<HTMLElement>, item?: IContextualMenuItem): void {
        debugger;
        if (item) {
            let columns = this.state.columns;
    
            columns.filter(matchColumn => matchColumn.key === item.data)
            .forEach((filteredColumn: IColumn) => {
              filteredColumn.isFiltered = true;
            });
    
            let pendingTasks = this.state.displayedPendingTasks;
            let newPendingTasks = [];
            if(item.data == "Modified" || item.data == "Created") {
                newPendingTasks = pendingTasks.filter(pendingTask => pendingTask[item.data]["Date"] === item.key);
            }
            else if(item.data == "Categories") {
                newPendingTasks = pendingTasks.filter(pendingTask => pendingTask[item.data].indexOf(item.key)>-1);
            }
            else if(item.data == "TeamUsers") {
                newPendingTasks = pendingTasks.filter(pendingTask => {
                    return    (
                        pendingTask[item.data]["AssignedUsers"].map((i: { UserName: string; })=>i.UserName).indexOf(item.key)>-1 
                        || pendingTask[item.data]["ResponsibleTeam"].map((i: { UserName: string; })=>i.UserName).indexOf(item.key)>-1 
                        || pendingTask[item.data]["TeamMembers"].map((i: { UserName: string; })=>i.UserName).indexOf(item.key)>-1
                    )
            });
            }
            else if (item.data != "Tags") {
                newPendingTasks = pendingTasks.filter(pendingTask => pendingTask[item.data] === item.key);
            }
            else {
                for (let i = 0; i < pendingTasks.length; i++) {
                    let itemValue: string = pendingTasks[i][item.data];
                    if (itemValue.indexOf(item.key) > -1) {
                        newPendingTasks.push(pendingTasks[i]);
                    }
                }    
            }
            this.setState({
                displayedPendingTasks: newPendingTasks,
                showResetFilter: true
            });
        }
    }

    private _onSortColumn(column: IColumn, isSortedDescending: boolean) {

        column = _.find(this.state.columns, c => c.fieldName === column.fieldName);
        column.isSortedDescending = isSortedDescending;
        column.isSorted = true;
    
        //reset the other columns
        let modifeidColumns: IColumn[] = this.state.columns;
        _.map(modifeidColumns, (c: IColumn) => {
          if (c.fieldName != column.fieldName) {
            c.isSorted = false;
            c.isSortedDescending = false;
          }
        });
    
        let modifiedItems: any = this.state.displayedPendingTasks;
    
        modifiedItems = _.orderBy(
            modifiedItems,
          [(modifiedItem) => {
            console.log(modifiedItem[column.fieldName]);
            console.log(typeof (modifiedItem[column.fieldName]));
    
            if (column.data == Number) {
              if (modifiedItem[column.fieldName]) {
                return parseInt(modifiedItem[column.fieldName]);
              }
              return 0;
            }
            if (column.data == Date) {
              if (modifiedItem[column.fieldName]) {
    
                return new Date(modifiedItem[column.fieldName]);
              }
              return new Date(0);
            }
    
            return modifiedItem[column.fieldName];
          }],
          [column.isSortedDescending ? "desc" : "asc"]);
    
        this.setState({
          displayedPendingTasks: modifiedItems,
          columns: modifeidColumns
        });
      }

    private _onResetFiltersClicked() {

        let columns = this.state.columns;
        //reset the columns
        _.map(columns, (c: IColumn) => {
    
          c.isSorted = false;
          c.isSortedDescending = false;
          c.isFiltered = false;
    
        });
        //update the state, this will force the control to refresh
        this.setState({
          displayedPendingTasks: this.state.allPendingTasks,          
          columns: columns,
          searchText: "",
          showResetFilter: false
        });
    
      }

      public _onFilterItems(showFilter: boolean) {
        this.setState({
            showResetFilter: showFilter
        })
    }

    private async actionTask() {
        let actionItem = {};
        let taskAction = this.state.actionDialogPrimaryButtonText;
        const selTaskItem = this.state.selTaskItem;
        const currentTaskUser = this.state.currentUserInfo;

        let _comment = {
            ID: 0,
            AuthorId: this.state.currentUserId,
            editable: false,
            Created: this.formatDate((new Date()).toISOString(), "DD MMM YYYY HH:mm"),
            Description: this.state.comments,
            Title: this.state.comments,
            AuthorImage: currentTaskUser.ImageUrl,
            AuthorName: currentTaskUser.Title
        };       
        const _comments = JSON.parse(selTaskItem.Comments) || [];
        if (!(_comments == '' || _comments == '[]' || _comments == undefined || _comments == 0)) {
            _comment.ID = _comments[_comments.length-1].ID+1;
        }
        _comments.push(_comment);
                
        if(taskAction=="Approve") {
            actionItem = {
                PercentComplete: 0.03,
                Status: "Approved",
                AssignedToId: [],
                Team_x0020_MembersId: [],
                Comments: JSON.stringify(_comments)
            };
        }
        else if(taskAction=="Reject") {
            const _authorId = this.state.selTaskItem.Created.UserId;
            const collTeamMembersId = selTaskItem.TeamUsers.TeamMembers.map((tMemberUser: { UserId: number; })=>tMemberUser.UserId);
            const collRespTeamId = selTaskItem.TeamUsers.ResponsibleTeam.map((rTeamUser: { UserId: number; })=>rTeamUser.UserId);
            if(collRespTeamId.indexOf(_authorId)==-1) {                
                collTeamMembersId.push(_authorId);
            }
            actionItem = {
                PercentComplete: 0.02,
                Status: "Follow up",
                AssignedToId: [],
                Team_x0020_MembersId: collTeamMembersId,               
                Comments: JSON.stringify(_comments)
            };
        }
        
        await this.spService.updateListItem(selTaskItem.ListId, selTaskItem.TaskId, actionItem);
        this.setState({
            allTaskComments: _comments
        }, ()=>this.sendEMail(selTaskItem));
       
        this.setState({
            hideActionDialog: true,
            comments: ""
        });
        this.loadList();
    }
    
    private async sendEMail(item: any) {
        const currentUser = this.state.currentUserInfo;
        const currentUserName: string = currentUser.Title;
        //const _authorEMail: string = "mitesh.jha@hochhuth-consulting.de" || item.Created.UserEMail;
        const _authorEMail: string = item.Created.UserEMail;
        const usersTo = [_authorEMail];
        let _taskStatus: string = this.state.actionDialogPrimaryButtonText=="Approve" ? "Approved" : "Rejected";
        let _taskPercent: string = "";
        if(_taskStatus == "Approved") {
            _taskPercent = "3%";
        }
        else if(_taskStatus == "Rejected") {
            _taskPercent = "2%";
        }
        const usersCC: string[] = [];
        const eMailSubject: string = `[${item.SiteType} (${_taskPercent})] - ${item.TaskTitle} - ${_taskStatus}`;
        const bodyGreeting: string = `<div style="margin-top:4px">Hi,</div>`;        
        let bodyTaskDescription: string = "";
        if(_taskStatus=="Approved") {
            bodyTaskDescription = `<div style="margin-top:6px">Your task has been approved by ${currentUserName}, team will process it further. Refer Approval Comments.</div>`;
        }
        else {
            bodyTaskDescription = `<div style="margin-top:6px">Your task has been rejected by ${currentUserName}. Refer Reject Comments.</div>`;
        }
        const bodyTaskLink: string = `<div style="margin-top:15px"><a href="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Task-Profile.aspx?taskId=${item.TaskId}&Site=${item.SiteType}">${item.TaskTitle}</a></div>`;
        const bodyAllTaskComments: string = this.state.allTaskComments.map(taskComment=>{
            return `<div colspan="6" style="padding: 9px;border: 1px solid #ccc;background: #fbfbfb;color: #000;margin-top:5px;">
            <span>
                <div style="margin-bottom:5px;">${taskComment.AuthorName} - ${taskComment.Created}</div>
                ${taskComment.Description}
            </span>
        </div>`;
        }).join("");
        const bodyTaskInfoTable: string = `
            <table style="width:100%">
                <tbody>
                <td style="width:70%;vertical-align: top;">
                    <table style="width:99%;">
                        <tbody>
                            <tr>
                                <td style="border: 1px solid #ccc;background: #f4f4f4;"><b style="font-size: 13px;">Task Id:</b></td>
                                <td colspan="2" style="border: 1px solid #ccc;background: #fafafa;"> <span style="font-size: 13px; margin-left:13px" >${item.TaskId}</span></td>
                                <td style="border: 1px solid #ccc;background: #f4f4f4;"><b style="font-size: 13px;">Component:</b></td>
                                <td colspan="2" style="border: 1px solid #ccc;background: #fafafa;"> <span style="font-size: 13px; margin-left:13px" >${item.Component}</span> </td>
                                <td style="border: 1px solid #ccc;background: #f4f4f4;"><b style="font-size: 13px;">Priority:</b></td>
                                <td colspan="2" style="border: 1px solid #ccc;background: #fafafa;"> <span style="font-size: 13px; margin-left:13px" >${item.Priority}</span> </td>
                            </tr>
                            <tr>
                                <td style="border: 1px solid #ccc;background: #f4f4f4;"><b style="font-size: 13px;">Start Date:</b></td>
                                <td colspan="2" style="border: 1px solid #ccc;background: #fafafa;"> <span style="font-size: 13px; margin-left:13px" >${item.StartDate}</span></td>
                                <td style="border: 1px solid #ccc;background: #f4f4f4;"><b style="font-size: 13px;">Completion Date:</b></td>
                                <td colspan="2" style="border: 1px solid #ccc;background: #fafafa;"> <span style="font-size: 13px; margin-left:13px" >${item.CompletedDate}</span> </td>
                                <td style="border: 1px solid #ccc;background: #f4f4f4;"><b style="font-size: 13px;">Due Date:</b></td>
                                <td colspan="2" style="border: 1px solid #ccc;background: #fafafa;"> <span style="font-size: 13px; margin-left:13px" >${item.DueDate}</span> </td>
                            </tr>
                            <tr>
                                <td style="border: 1px solid #ccc;background: #f4f4f4;"><b style="font-size: 13px;">Team Members:</b></td>
                                <td colspan="2" style="border: 1px solid #ccc;background: #fafafa;"> <span style="font-size: 13px; margin-left:13px" >${item.TeamUsers.TeamMembers.map((i: { UserName: any; })=>i.UserName).join(";")}</span></td>
                                <td style="border: 1px solid #ccc;background: #f4f4f4;"><b style="font-size: 13px;">Created By:</b></td>
                                <td colspan="2" style="border: 1px solid #ccc;background: #fafafa;"> <span style="font-size: 13px; margin-left:13px" >${item.Created.UserName}</span> </td>
                                <td style="border: 1px solid #ccc;background: #f4f4f4;"><b style="font-size: 13px;">Created:</b></td>
                                <td colspan="2" style="border: 1px solid #ccc;background: #fafafa;"> <span style="font-size: 13px; margin-left:13px" >${item.Created.Date}</span> </td>
                            </tr>
                            <tr>
                                <td style="border: 1px solid #ccc;background: #f4f4f4;"><b style="font-size: 13px;">Categories:</b></td>
                                <td colspan="2" style="border: 1px solid #ccc;background: #fafafa;"> <span style="font-size: 13px; margin-left:13px" >${item.Categories.join(";")}</span></td>
                                <td style="border: 1px solid #ccc;background: #f4f4f4;"><b style="font-size: 13px;">Status:</b></td>
                                <td colspan="2" style="border: 1px solid #ccc;background: #fafafa;"> <span style="font-size: 13px; margin-left:13px" >${_taskStatus}</span> </td>
                                <td style="border: 1px solid #ccc;background: #f4f4f4;"><b style="font-size: 13px;">% Complete:</b></td>
                                <td colspan="2" style="border: 1px solid #ccc;background: #fafafa;"> <span style="font-size: 13px; margin-left:13px" >${_taskPercent}</span> </td>
                            </tr>
                            <tr>
                            <td style="border: 1px solid #ccc;background: #f4f4f4;"><b style="font-size: 13px;">URL:</b> </td>
                            <td colspan="7" style="border: 1px solid #ccc;background: #fafafa;"><span style="font-size: 13px; margin-left:13px">${item.ComponentLink}</span> </td>
                            </tr>
                            <tr>
                            <td style="border: 1px solid #ccc;background: #f4f4f4;"><b style="font-size: 13px;">Approval Comments:</b> </td>
                            <td colspan="7" style="border: 1px solid #ccc;background: #fafafa;"><span style="font-size: 13px; margin-left:13px">${this.state.comments}</span> </td>
                            </tr>
                        </tbody>
                    </table>
                    <table style="width:99%;margin-top: 10px;">
                        <tbody>
                            <tr>​</tr>
                        </tbody>
                    </table>
                </td>
                <td style="width:22%">
                    <table style="border:1px solid #ddd;border-radius:4px;margin-bottom:25%;width:100%">
                        <tbody>
                            <tr>
                            <td style="color:#333; background-color:#f5f5f5;border-bottom:1px solid #ddd">Comments:</td>
                            </tr>
                            <tr>
                            <td>                            
                                ${bodyAllTaskComments}
                            </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
                </tr>
                </tbody>
            </table>
        `;
        const eMailBody: string = `
            <div></div>
            ${bodyGreeting}
            ${bodyTaskDescription}
            <div style="margin-top:10px"></div>
            ${bodyTaskLink}
            ${bodyTaskInfoTable}
        `;
        await this.spService.sendEMail(usersTo, usersCC, eMailSubject, eMailBody);
    }
    
    render(): JSX.Element {
        const elemSectionTitle = <Label styles={{root:{color:"#0000BC",fontSize:"25px"}}}>My Pending Tasks - {this.state.currentUserInfo.Title}</Label>;
        const elemListPendingTasks: JSX.Element = (<DetailsList 
            items = { this.state.displayedPendingTasks } 
            columns = { this.state.columns }
            selectionMode= { SelectionMode.none } 
        />);
        const elemFilteredTasksInfo: JSX.Element = <Label styles={controlStyles}>Showing {this.state.displayedPendingTasks.length} of {this.state.allPendingTasks.length} Tasks</Label>;
        const elemSearchBox: JSX.Element = <SearchBox styles={controlStyles} value={this.state.searchText} onChange={this._onSearchTasks} />
        const elemClearFilter = this.state.showResetFilter && <Icon iconName="ClearFilter" role="button" onClick={this._onResetFiltersClicked} styles={iconStyles} />
        const elemExportToExcel: JSX.Element = <div>Excel</div>
        const elemPrint: JSX.Element = <div>Print</div>

        const elemDialog: JSX.Element = 
            (<Dialog 
                hidden={this.state.hideActionDialog}
                dialogContentProps={{
                    type: DialogType.normal,
                    title: this.state.actionDialogHeaderText,
                    showCloseButton: true,
                    closeButtonAriaLabel: "Close",
                    onDismiss: this._onCloseActionDialog
                }}
            >
                <TextField multiline rows={5} value={this.state.comments} onChange={(ev, newVal)=>this.setState({comments: newVal})} />
                <DialogFooter>
                    <PrimaryButton onClick={this.actionTask}>{this.state.actionDialogPrimaryButtonText}</PrimaryButton>
                    <DefaultButton onClick={this._onCloseActionDialog}>Cancel</DefaultButton>
                </DialogFooter>
            </Dialog>);
        
        const elemContextualMenu = (this.state.contextualMenuProps && <ContextualMenu {...this.state.contextualMenuProps} />);

        return (<div className="ms-Grid">
            {<div className="ms-Grid-row">{elemSectionTitle}</div>}
            {<div className="ms-Grid-row">
                <div className="ms-Grid-col ms-sm3 ms-md3 ms-lg3">{elemFilteredTasksInfo}</div>
                <div className="ms-Grid-col ms-sm6 ms-md6 ms-lg6">{elemSearchBox}</div>
                <div className="ms-Grid-col ms-sm1 ms-md1 ms-lg1">{elemClearFilter}</div>
                <div className="ms-Grid-col ms-sm1 ms-md1 ms-lg1">{false && elemExportToExcel}</div>
                <div className="ms-Grid-col ms-sm1 ms-md1 ms-lg1">{false && elemPrint}</div>
            </div>}
            <div className="ms-Grid-row">{elemListPendingTasks}</div>
            {elemDialog}
            {elemContextualMenu}
        </div>);
    }
}

export default MyPendingTasksApp;