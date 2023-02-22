import { ColumnActionsMode, ContextualMenu, DetailsList, DirectionalHint, IColumn, Icon, IContextualMenuItem, Image, ImageFit, IPersonaProps, IStackTokens, ITooltipProps, Label, Link, Panel, Persona, PersonaSize, ProgressIndicator, SearchBox, SelectionMode, Stack, Text, TooltipHost } from "@fluentui/react";
import * as _ from "lodash";
import * as moment from "moment-timezone";
import * as React from "react";
import spservices from "../../../spservices/spservices";
import { Utils } from "../common/Utils";
import { ITasksViewAppProps } from "./ITasksViewAppProps";
import { ITasksViewAppState } from "./ITasksViewAppState";
import styles from "./TasksViewApp.module.scss";

const controlStyles = {
    root: {
        margin: '10px 5px 20px 0',
        maxWidth: '300px'
    }
};

const iconStyles = {root:{
    fontSize: 35,
    margin: '0 15px',
    color: 'deepskyblue'
}};

class TasksViewApp extends React.Component<ITasksViewAppProps, ITasksViewAppState> {

    private spService: spservices = null;
    
    constructor(props: ITasksViewAppProps) {
        super(props);
        this.spService = new spservices();
        
        this._onRenderCreated = this._onRenderCreated.bind(this);
        this._onRenderModified = this._onRenderModified.bind(this);
        this._onRenderTeamMembers = this._onRenderTeamMembers.bind(this);
        this._onRenderEdit = this._onRenderEdit.bind(this);
        this._onRenderDelete = this._onRenderDelete.bind(this);
        this._onSearchTasks = this._onSearchTasks.bind(this);
        this._onResetFiltersClicked = this._onResetFiltersClicked.bind(this);
        this._onColumnClick = this._onColumnClick.bind(this);
        this._onSortColumn = this._onSortColumn.bind(this);
        this.ClickFilter = this.ClickFilter.bind(this);
        this._onContextualMenuDismissed = this._onContextualMenuDismissed.bind(this);
        this._onDismissSearchPanel = this._onDismissSearchPanel.bind(this);
        
        this.state = {
            isLoading: true,
            siteItems: [],
            taskUsers: [],
            allTaskItems: [],
            displayedTaskItems: [],
            columns: this._setupColumns(),
            searchText: "",
            showResetFilter: false,
            contextualMenuProps: null,
            showSearchPanel: true,
            searchField: "ALL"
        };
    }

    componentDidMount(): void {
        this.loadConfigurations();
    }

    private async loadConfigurations() {

        const resLMIConfig = await this.spService.getLastModifiedItemsConfiguration();
        const _taskUsers = await this.getTaskUsers();

        const allSiteItems = resLMIConfig.length>0 ? JSON.parse(resLMIConfig[0].Configuration) : [];
        const excludedSiteItems = ["Master Tasks", "DOCUMENTS", "FOLDERS", "ALL"];

        const _siteItems = allSiteItems.filter((siteItem: { Title: string; }) => excludedSiteItems.indexOf(siteItem.Title)==-1);
        

        this.setState({
            siteItems: _siteItems,
            taskUsers: _taskUsers
        }, ()=>this.loadTasks());
    }

    private async loadTasks() {

        const resAllTasks = await this.getTaskItems();
        let allTasks: any[] = [];
        let taskItem: any;
        let listId: string = "";
        let siteItem: any;

        resAllTasks.forEach((resTaskItem: any, indx: number) => {
            listId = resTaskItem['odata.editLink'].split("'")[1].toUpperCase();
            siteItem = this.getSiteInfo(listId);
            taskItem = {
                Index: indx,
                TaskItemId: resTaskItem.Id,
                ListId: listId,
                SiteIcon: siteItem.SiteIcon,
                SiteType: siteItem.Site,
                TaskId: this.getTaskId(resTaskItem),
                TaskTitle: resTaskItem.Title || "",
                PortfolioType: resTaskItem.Portfolio_x0020_Type || this.getPortfolioType(resTaskItem.ComponentId, resTaskItem.ServicesId, resTaskItem.EventsId),
                Categories: this.getCategories(resTaskItem.SharewebCategories),
                Percentage: resTaskItem.PercentComplete || 0,
                Priority: resTaskItem.Priority,
                DueDate: this.formatDate(resTaskItem.DueDate),                
                Component: this.getComponent(resTaskItem.Component),                
                Modified: {
                    Date: this.formatDate(resTaskItem.Modified),
                    ...this.getUserInfo(resTaskItem.Editor.Id)
                },
                Created: {
                    Date: this.formatDate(resTaskItem.Created),
                    ...this.getUserInfo(resTaskItem.Author.Id)
                },
                TeamUsers: this.getTeamUsers(resTaskItem.Responsible_x0020_Team, resTaskItem.AssignedTo, resTaskItem.Team_x0020_Members)
            };
            allTasks.push(taskItem)
        });
               
        this.setState({
            allTaskItems: allTasks,
            displayedTaskItems: allTasks,
            isLoading: false
        })

    }

    private loadMoreTasks(_index: number) {
        debugger;
        console.log("LOAD MORE");
        console.log(_index);
    }

    private async getTaskItems() {

        const listConfigItems = [...this.state.siteItems];

        const taskListsInfo: any[] = [];
        let queryConfig: any[];
        let querySplit: any[]
        let qSelect: string; 
        let qExpand: string;
        const qFilter: string = [0.8, 0.99, 1].map(i=>`(PercentComplete ne '${i}')`).join(" and ");
        const qTop: number = 5000;
        let qOrderBy: string = "Modified DESC";

        listConfigItems.forEach(listConfigItem => {

            queryConfig = listConfigItem.Columns.split("&$");

            queryConfig.forEach(query => {
                if(query.indexOf("=")==-1) {
                    qSelect = query
                }
                else {
                    querySplit = query.split("=");
                    if(querySplit[0]=="expand") {
                        qExpand = querySplit[1];
                    }
                    else if(querySplit[0]=="orderby") {
                        qOrderBy = querySplit[1];
                    }
                }
            });

            let qStrings = {
                Select: qSelect,
                Expand: qExpand,
                Filter: qFilter,
                OrderBy: qOrderBy,
                Top: qTop
            };

            taskListsInfo.push({
                ListId: listConfigItem.ListId,
                QueryStrings: qStrings
            });
        });

        const resTasks = await this.spService.getListItemsInBatch(taskListsInfo);

        return resTasks;
        
    }

    private async getTaskUsers() {
        const taskUsersRes = await this.spService.getTasks();
        const taskUsers = taskUsersRes.filter((taskUser:any)=>taskUser.AssingedToUser!=null).map((taskUser:any)=>({
            UserId: taskUser.AssingedToUser.Id,
            Title: taskUser.Title,
            ImageUrl: taskUser.Item_x0020_Cover ? taskUser.Item_x0020_Cover.Url : "",
            Company: taskUser.Company,
            Mail: taskUser.Email
        }));
        return taskUsers;
    }

    private getTaskId(_taskItem: any) {

        let _taskId: string = "";
        const _taskItemId: number = _taskItem.Id;
        const _taskLevel1Num: number = _taskItem.SharewebTaskLevel1No;
        const _taskLevel2Num: number = _taskItem.SharewebTaskLevel2No;
        let _taskType: string = _taskItem.SharewebTaskType ? _taskItem.SharewebTaskType.Title : "";

        let _components = _taskItem.Component;
        let _events = _taskItem.Events;
        let _services = _taskItem.Services;

        if(_taskType == "") {
            _taskId = `T${_taskItemId}`;
        }
        else if((_taskType=="Task" || _taskType=="MileStone") && _taskLevel1Num==null && _taskLevel2Num==null) {
            if(_taskType=="Task") {
                _taskId = `T${_taskItemId}`;
            }
            else if(_taskType=="MileStone") {
                _taskId = `M${_taskItemId}`;
            }
        }
        else if((_taskType == 'Activities' || _taskType == 'Project') && _taskLevel1Num != null) {
            if(_taskType=="Project") {
                _taskId = `P${_taskLevel1Num}`;
            }
            else if((_components==null || _components.length==0) && (_events==null || _events.length==0) && (_services==null || _services.length==0)) {
                _taskId = `A${_taskLevel1Num}`;
            }
            else if(_components!=null || _components.length>0) {
                _taskId = `CA${_taskLevel1Num}`;
            }
            else if(_events!=null || _events.length>0) {
                _taskId = `EA${_taskLevel1Num}`;
            }
            else if(_services!=null || _services.length>0) {
                _taskId = `SA${_taskLevel1Num}`;
            }
        }
        else if((_taskType == 'Workstream' || _taskType == 'Step') && _taskLevel1Num != null && _taskLevel2Num != null) {
            if(_taskType=="Step") {
                _taskId = `P${_taskLevel1Num}-S${_taskLevel2Num}`;
            }
            else if((_components==null || _components.length==0) && (_events==null || _events.length==0) && (_services==null || _services.length==0)) {
                _taskId = `A${_taskLevel1Num}-W${_taskLevel2Num}`;
            }
            else if(_components!=null || _components.length>0) {
                _taskId = `CA${_taskLevel1Num}-W${_taskLevel2Num}`;
            }
            else if(_events!=null || _events.length>0) {
                _taskId = `EA${_taskLevel1Num}-W${_taskLevel2Num}`;
            }
            else if(_services!=null || _services.length>0) {
                _taskId = `SA${_taskLevel1Num}-W${_taskLevel2Num}`;
            }
        }
        else if((_taskType=="Task" || _taskType=="MileStone") && _taskLevel1Num!=null && _taskLevel2Num!=null) {
            if(_taskType=="MileStone") {
                _taskId = `P${_taskLevel1Num}-S${_taskLevel2Num}-M${_taskItemId}`;
            }
            else if((_components==null || _components.length==0) && (_events==null || _events.length==0) && (_services==null || _services.length==0)) {
                _taskId = `A${_taskLevel1Num}-W${_taskLevel2Num}-T${_taskItemId}`;
            }
            else if(_components!=null || _components.length>0) {
                _taskId = `CA${_taskLevel1Num}-W${_taskLevel2Num}-T${_taskItemId}`;
            }
            else if(_events!=null || _events.length>0) {
                _taskId = `EA${_taskLevel1Num}-W${_taskLevel2Num}-T${_taskItemId}`;
            }
            else if(_services!=null || _services.length>0) {
                _taskId = `SA${_taskLevel1Num}-W${_taskLevel2Num}-T${_taskItemId}`;
            }
        }
        else if((_taskType=="Task" || _taskType=="MileStone") && _taskLevel1Num!=null && _taskLevel2Num==null) {
            if(_taskType=="MileStone") {
                _taskId = `P${_taskLevel1Num}-M${_taskItemId}`;
            }
            else if((_components==null || _components.length==0) && (_events==null || _events.length==0) && (_services==null || _services.length==0)) {
                _taskId = `A${_taskLevel1Num}-T${_taskItemId}`;
            }
            else if(_components!=null || _components.length>0) {
                _taskId = `CA${_taskLevel1Num}-T${_taskItemId}`;
            }
            else if(_events!=null || _events.length>0) {
                _taskId = `EA${_taskLevel1Num}-T${_taskItemId}`;
            }
            else if(_services!=null || _services.length>0) {
                _taskId = `SA${_taskLevel1Num}-T${_taskItemId}`;
            }
        }

        return _taskId;
    }

    private getSiteInfo(listId: string) {
        let siteItems = [...this.state.siteItems];
        let _siteItem = siteItems.filter(siteItem => siteItem.ListId.toUpperCase()==listId)[0];
        return _siteItem;
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
        let filters = utility.GetFilterValues(column, this.state.displayedTaskItems, this.ClickFilter);
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
    
            let pendingTasks = this.state.displayedTaskItems;
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
            else {
                newPendingTasks = pendingTasks.filter(pendingTask => pendingTask[item.data] === item.key);
            }
            this.setState({
                displayedTaskItems: newPendingTasks,
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
    
        let modifiedItems: any = this.state.displayedTaskItems;
    
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
          displayedTaskItems: modifiedItems,
          columns: modifeidColumns
        });
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

    private _onRenderModified(item: any, index: number, column: IColumn) {
        const createdInfo = item.Modified;
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
        return `/SitePages/TeamLeader-Dashboard.aspx?UserId=${userItem.UserId}&Name=${userItem.UserName}`;
    }

    private _onRenderEdit() {
        let elemIconEdit = <Link href="#"><Icon iconName="Edit" style={{color:"blue", paddingLeft:"10px", fontSize:"20px",fontWeight:600}} /></Link>
        return elemIconEdit;
    }

    private _onRenderDelete() {
        let elemIconDelete = <Link href="#"><Icon iconName="Delete" style={{color:"red", paddingLeft:"10px", fontSize:"20px",fontWeight:600}} /></Link>
        return elemIconDelete;
    }

    private _setupColumns(): IColumn[] {
        const columns: IColumn[] = [
            {
                key: "TaskId",
                name: "Task ID",
                fieldName: "TaskId",
                minWidth: 100,
                maxWidth: 100,
                data: Number,
                isResizable: true,
                columnActionsMode: ColumnActionsMode.hasDropdown,
                onRender(item, index, column) {

                    const _imgURL: string = `https://hhhhteams.sharepoint.com/sites/HHHH/${item.SiteIcon}`;
                    const _taskId: string = `${item.TaskId}`;
                    
                    return (<div style={{display: "flex"}}>
                        <Image src={_imgURL} height={25} width={25} imageFit={ImageFit.cover} styles={{root:{display: "inline"}}} />
                        <Text styles={{root: {paddingLeft:"5px"}}}>{_taskId}</Text>
                    </div>);
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
                    const _taskLink = `https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Task-Profile.aspx?taskId=${item.TaskItemId}&Site=${item.SiteType}`;
                    return <Link href={_taskLink} target="_blank">{item.TaskTitle}</Link>
                },
                onColumnClick: this._onColumnClick
            },
            {
                key: "PortfolioType",
                name: "Portfolio Type",
                fieldName: "PortfolioType",
                minWidth: 100,
                maxWidth: 100,
                data: String,
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
                key: "Percentage",
                name: "%",
                fieldName: "Percentage",
                minWidth: 30,
                maxWidth: 30,
                data: Number,
                isResizable: true,
                columnActionsMode: ColumnActionsMode.hasDropdown,
                onRender(item, index, column) {
                    return `${item.Percentage*100}%`
                },
                onColumnClick: this._onColumnClick
            },
            {
                key: "Priority",
                name: "Priority",
                fieldName: "Priority",
                minWidth: 80,
                maxWidth: 80,
                data: Number,
                isResizable: true,
                columnActionsMode: ColumnActionsMode.hasDropdown,
                onColumnClick: this._onColumnClick
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
                key: "Modified",
                name: "Modified Date",
                fieldName: "Modified",
                minWidth: 100,
                maxWidth: 100,
                data: Object,
                isResizable: true,
                columnActionsMode: ColumnActionsMode.hasDropdown,
                onRender: this._onRenderModified,
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

    private _onSearchTasks(ev: any, newText: string) {
        let utility = new Utils();
        let filteredTasks = utility.filterListItems(newText, this.state.allTaskItems, this.state.displayedTaskItems, this.state.searchField);
        this.setState({
            searchText: newText,
            displayedTaskItems: filteredTasks
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
          displayedTaskItems: this.state.allTaskItems,          
          columns: columns,
          searchText: "",
          showResetFilter: false
        });
    
    }

    private _onDismissSearchPanel() {
        this.setState({
            showSearchPanel: false
        })
    }

    render() {

        const elemProgressIndicator: JSX.Element = <ProgressIndicator label="Please wait..." description="Loading the Tasks list..." />;

        const elemSectionTitle: JSX.Element = <Label styles={{root:{color:"#0000BC",fontSize:"25px"}}}>Tasks View</Label>;
        
        const elemListPendingTasks: JSX.Element = (
            <DetailsList 
                items = { this.state.displayedTaskItems } 
                columns = { this.state.columns } 
                selectionMode = { SelectionMode.none }
                isHeaderVisible = {true}
                onShouldVirtualize={ () => false }
                className = {styles.dataList}
                onRenderMissingItem = {(index: number, rowData: any) => {
                    this.loadMoreTasks(index);
                    return null;
                }}
            />
        );

        const elemContextualMenu = (
            this.state.contextualMenuProps && 
            <ContextualMenu {...this.state.contextualMenuProps} />
        );

        const elemFilteredTasksInfo: JSX.Element = <Label styles={controlStyles}>Showing {this.state.displayedTaskItems.length} of {this.state.allTaskItems.length} Tasks</Label>;

        const elemSearchBox: JSX.Element = <SearchBox styles={controlStyles} value={this.state.searchText} onChange={this._onSearchTasks} />

        const elemClearFilter = (
            this.state.showResetFilter && 
            <Icon iconName="ClearFilter" role="button" onClick={this._onResetFiltersClicked} styles={iconStyles} />
        );
        const elemExportToExcel: JSX.Element = <div>Excel</div>
        const elemPrint: JSX.Element = <div>Print</div>

        const elemFilterBySearchPanel: JSX.Element = (null && <Panel
            headerText={`Filter by 'Title'`}
            isOpen={this.state.showSearchPanel}
            onDismiss={this._onDismissSearchPanel}
        >
            {elemSearchBox}        
        </Panel>);

        if(this.state.isLoading) {
            return elemProgressIndicator;
        }

        return (
            <div className="ms-Grid">
                <div className="ms-Grid-row">
                    { elemSectionTitle }
                </div>
                <div className="ms-Grid-row">
                    <div className="ms-Grid-col ms-sm3 ms-md3 ms-lg3">{elemFilteredTasksInfo}</div>
                    <div className="ms-Grid-col ms-sm6 ms-md6 ms-lg6">{elemSearchBox}</div>
                    <div className="ms-Grid-col ms-sm1 ms-md1 ms-lg1">{elemClearFilter}</div>
                    <div className="ms-Grid-col ms-sm1 ms-md1 ms-lg1">{false && elemExportToExcel}</div>
                    <div className="ms-Grid-col ms-sm1 ms-md1 ms-lg1">{false && elemPrint}</div>
                </div>
                <div className="ms-Grid-row">
                    { elemListPendingTasks }
                </div>
                { elemContextualMenu }
                { elemFilterBySearchPanel }                
            </div>
        );
    }
}

export default TasksViewApp;