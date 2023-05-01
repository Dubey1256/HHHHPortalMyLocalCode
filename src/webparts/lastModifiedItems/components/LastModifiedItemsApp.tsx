import { Checkbox, css, DefaultButton, Dialog, DialogFooter, DialogType, Icon, Label, PivotItem, PrimaryButton, SearchBox } from "@fluentui/react";
import * as React from "react";
import spservices from "../../../spservices/spservices";

import styles from "./CommonControl.module.scss";
import { ILastModifiedItemsAppProps } from "./ILastModifiedItemsAppProps";
import { ILastModifiedItemsAppState } from "./ILastModifiedItemsAppState";
import ListLastModifiedItems from "./ListLastModifiedItems";
import PivotNavItems from "./PivotNavItems";
//import SectionFilter from "./SectionFilter";
import SectionTitle from "./SectionTitle";
import * as moment from "moment-timezone";
var AllListId:any;
const controlStyles = {
    root: {
        margin: '10px 5px 20px 0px',
        maxWidth: '300px'
    }
};

const deleteDialogContentProps = {
    type: DialogType.close,
    title: 'Delete Record',
    closeButtonAriaLabel: 'Close',
    subText: 'Are you sure, you want to delete this?',
};

const iconStyles = {root:{
    fontSize: 50,
    height: 50,
    width: 50,
    margin: '0 25px',
    color: 'deepskyblue'
}};
let resSmartMetadata :any ;
export default class LastModifiedItemsApp extends React.Component<ILastModifiedItemsAppProps, ILastModifiedItemsAppState> {
   
    private spService: spservices = null;
    
    constructor(props: ILastModifiedItemsAppProps) {
        super(props);        
        this.spService = new spservices();

        this.state = {
            configItems: [],
            listLastModifiedItems: [],
            filteredItems: [],
            selNavItem: {
                tabName: "HHHH"
            },
            searchText: "",
            componentsChecked: false,
            serviceChecked: false,
            taskUsers: [],
            hideDeleteDialog: true,
            showResetFilters: false,
            resetRecords: false
        };

        this.getListItems = this.getListItems.bind(this);
        this.formatDate = this.formatDate.bind(this);
        this.getUserInfo = this.getUserInfo.bind(this);
        this.deleteTask = this.deleteTask.bind(this);

        this.onNavItemMenuClick = this.onNavItemMenuClick.bind(this);
        this.onSearchTextChange = this.onSearchTextChange.bind(this);
        this.onComponentsChecked = this.onComponentsChecked.bind(this);
        this.onServiceChecked = this.onServiceChecked.bind(this);
        this.onCancelDeleteDialog = this.onCancelDeleteDialog.bind(this);
        this.onConfirmDeleteDialog = this.onConfirmDeleteDialog.bind(this);
        this.onDeleteIconClick = this.onDeleteIconClick.bind(this);
        this.onDeleteTask = this.onDeleteTask.bind(this);
        this._onResetFiltersClicked = this._onResetFiltersClicked.bind(this);
        this._onFilterItems = this._onFilterItems.bind(this);

    }
   
    async componentDidMount(): Promise<void> {
         resSmartMetadata = await this.spService.getSmartMetadata(this.props.SmartMetadataListID, ['Sites']);
        console.log(resSmartMetadata);
        this.loadConfigurations();
    }

    private async loadConfigurations() {
      
     AllListId={
        TaskUsertListID:this.props.taskUsersListId,
        SmartMetadataListID: this.props.SmartMetadataListID,
        SmartInformationListID:this.props.SmartInformationListID,
        DocumentsListID:this.props.DocumentsListID,
        MasterTaskListID:this.props.MasterTaskListID,
        TaskTimeSheetListID:this.props.TaskTimeSheetListID,
        isShowTimeEntry:this.props.TimeEntry == "true"?true:false,
        isShowSiteCompostion:this.props.SiteCompostion == "true"?true:false,
        siteUrl:this.props.siteUrl,
     }
       // const configItemsRes = await this.spService.getLastModifiedItemsConfiguration(this.props.listConfigurationListId);
        
        const taskUsersRes = await this.spService.getTasks(this.props.taskUsersListId);
        const taskUsers = taskUsersRes.filter(taskUser=>taskUser.AssingedToUser&&taskUser.Item_x0020_Cover).map(taskUser=>({
            UserId: taskUser.AssingedToUser.Id,
            ImageUrl: taskUser.Item_x0020_Cover.Url
        }));
        let configItems: {
            SortOrder: string;
            siteUrl: any;
            ImageUrl: string;
            listId: string;Configurations: any; Title: string; 
}[] = [];
        let navItems: any[] = [];
        let selNavItem = {...this.state.selNavItem};
        if(resSmartMetadata.length) {
         resSmartMetadata.map((items:any)=>{
            if(items.Title!=='DRR' && items.Title!=="Foundation" && items.Title!=='Small Projects' && items.Title!=='Offshore Tasks' && items.Title!=='Master Tasks' && items.Title!=='SDC Sites')
            configItems.push(...JSON.parse(items.Configurations));
            });
            configItems.push(
                {
                Title: 'DOCUMENTS',
                SortOrder: "",
                siteUrl:  {Url:this.props.siteUrl},
                ImageUrl: "",
                listId: this.props.DocumentsListID,
                Configurations: undefined
            },
            {
                Title: 'FOLDERS',
                SortOrder: "",
                siteUrl: {Url:this.props.siteUrl},
                ImageUrl: "",
                listId: this.props.DocumentsListID,
                Configurations: undefined
            },
            {
                Title: 'COMPONENTS',
                SortOrder: "",
                siteUrl: {Url:this.props.siteUrl},
                ImageUrl: "",
                listId: this.props.MasterTaskListID,
                Configurations: undefined
            },
            {
                Title: 'SERVICES',
                SortOrder: "",
                siteUrl:  {Url:this.props.siteUrl},
                ImageUrl: "",
                listId: this.props.MasterTaskListID,
                Configurations: undefined
            },
            {
                Title: 'ALL',
                SortOrder: "",
                siteUrl: {Url:this.props.siteUrl},
                ImageUrl: "",
                listId: this.props.MasterTaskListID,
                Configurations: undefined
            },)
            navItems = configItems.map( (configItem: { Title: string; }) => ({
                    text: configItem.Title,
                    key: configItem.Title
            }));
            let defaultSelNavItem = configItems[0];
            selNavItem.columns = "ParentTask/Title,ParentTask/Id,Services/Title,ClientTime,Services/Id,Events/Id,Events/Title,ItemRank,Portfolio_x0020_Type,SiteCompositionSettings,SharewebTaskLevel1No,SharewebTaskLevel2No,TimeSpent,BasicImageInfo,OffshoreComments,OffshoreImageUrl,CompletedDate,Shareweb_x0020_ID,Responsible_x0020_Team/Id,Responsible_x0020_Team/Title,SharewebCategories/Id,SharewebCategories/Title,ParentTask/Shareweb_x0020_ID,SharewebTaskType/Id,SharewebTaskType/Title,SharewebTaskType/Level,SharewebTaskType/Prefix,Priority_x0020_Rank,Reference_x0020_Item_x0020_Json,Team_x0020_Members/Title,Team_x0020_Members/Name,Component/Id,Component/Title,Component/ItemType,Team_x0020_Members/Id,Item_x002d_Image,component_x0020_link,IsTodaysTask,AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,AttachmentFiles/FileName,FileLeafRef,FeedBack,Title,Id,PercentComplete,Company,StartDate,DueDate,Comments,Categories,Status,WebpartId,Body,Mileage,PercentComplete,Attachments,Priority,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title,RelevantTasks/Id,RelevantTasks/Title&$expand=RelevantTasks,ParentTask,Events,Services,SharewebTaskType,AssignedTo,Component,AttachmentFiles,Author,Editor,Team_x0020_Members,Responsible_x0020_Team,SharewebCategories&$orderby=Modified desc&$top=200";
            selNavItem.displaySiteName = defaultSelNavItem.Title;
            selNavItem.listId = defaultSelNavItem.listId;
            selNavItem.site = defaultSelNavItem.Title;
            selNavItem.siteIcon = defaultSelNavItem.Title == "Migration" ?   "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_migration.png"    : defaultSelNavItem.ImageUrl;
            selNavItem.siteUrl = defaultSelNavItem.siteUrl.Url;
            selNavItem.sortOrder = defaultSelNavItem.SortOrder;
            selNavItem.tabName = defaultSelNavItem.Title;
            selNavItem.title = defaultSelNavItem.Title;
        }
        this.setState({
            configItems: configItems,
            navItems: navItems,
            selNavItem: selNavItem,
            taskUsers: taskUsers
        }, this.getLastModifiedItems);
    }

    private async getLastModifiedItems() {
        const curNavItem = this.state.selNavItem;
        let curListId = curNavItem.listId;
        let curSiteURL = curNavItem.siteUrl;
        let curSiteType = curNavItem.site;
        let curSiteIcon = curNavItem.siteIcon;
        let queryStrings = (curNavItem.columns && curNavItem.columns.split("&$")) || [];

        let qStrings = this.getQueryStrings(queryStrings);
        
        let selTabName: string = this.state.selNavItem.tabName;
        let resListItems: any[] = [];
        let listLastModifiedItems: any[] = [];

        if(selTabName=="DOCUMENTS") {
            resListItems = await this.getListItems(curListId, qStrings);
            listLastModifiedItems = resListItems.map( resListItem => ({
                DocumentName: resListItem.FileLeafRef,
                ID: resListItem.Id,
                DocumentLink: resListItem.EncodedAbsUrl,
                Modified: {
                    Date: this.formatDate(resListItem.Modified),
                    UserName: resListItem.Editor.Title,
                    ...this.getUserInfo(resListItem.Editor.Id)
                },
                Created: {
                    Date: this.formatDate(resListItem.Created),
                    UserName: resListItem.Author.Title,
                    ...this.getUserInfo(resListItem.Author.Id)
                },
                Id: resListItem.Id,
                listId: curListId,
                siteType: curSiteType,
                siteUrl: curSiteURL
            }));
        }
        else if(selTabName=="FOLDERS") {
            resListItems = await this.getListItems(curListId, qStrings);
            listLastModifiedItems = resListItems.map( resListItem => ({
                FolderName: resListItem.FileLeafRef,
                ID: resListItem.Id,
                FolderLink: resListItem.EncodedAbsUrl,
                Modified: {
                    Date: this.formatDate(resListItem.Modified),
                    UserName: resListItem.Editor.Title,
                    ...this.getUserInfo(resListItem.Editor.Id)
                },
                Created: {
                    Date: this.formatDate(resListItem.Created),
                    UserName: resListItem.Author.Title,
                    ...this.getUserInfo(resListItem.Author.Id)
                },
                Id: resListItem.Id,
                listId: curListId,
                siteType: curSiteType,
                siteUrl: curSiteURL
            }));
        }
        else if(selTabName=="COMPONENTS") {
            resListItems = await this.getListItems(curListId, qStrings);
            listLastModifiedItems = resListItems.map( resListItem => ({
                ComponentId: resListItem.PortfolioStructureID,
                Title: resListItem.Title,
                TaskId: `T${resListItem.Id}`,
                ID: resListItem.Id,
                DueDate: resListItem.DueDate,
                PercentComplete: resListItem.PercentComplete ? parseFloat(resListItem.PercentComplete)*100 : 0,
                Priority: resListItem.Priority_x0020_Rank ? parseInt(resListItem.Priority_x0020_Rank) : 0,
                Modified: {
                    Date: this.formatDate(resListItem.Modified),
                    UserName: resListItem.Editor.Title,
                    ...this.getUserInfo(resListItem.Editor.Id)
                },
                Created: {
                    Date: this.formatDate(resListItem.Created),
                    UserName: resListItem.Author.Title,
                    ...this.getUserInfo(resListItem.Author.Id)
                },
                Id: resListItem.Id,
                listId: curListId,
                SiteType: curSiteType,
                siteUrl: curSiteURL
            }));
        }
        else if(selTabName=="SERVICES") {
            resListItems = await this.getListItems(curListId, qStrings);
            listLastModifiedItems = resListItems.map( resListItem => ({
                ServiceId: resListItem.PortfolioStructureID,
                Title: resListItem.Title,
                TaskId: `T${resListItem.Id}`,
                ID: resListItem.Id,
                DueDate: resListItem.DueDate,
                PercentComplete: resListItem.PercentComplete ? parseFloat(resListItem.PercentComplete)*100 : 0,
                Priority: resListItem.Priority_x0020_Rank ? parseInt(resListItem.Priority_x0020_Rank) : 0,
                Modified: {
                    Date: this.formatDate(resListItem.Modified),
                    UserName: resListItem.Editor.Title,
                    ...this.getUserInfo(resListItem.Editor.Id)
                },
                Created: {
                    Date: this.formatDate(resListItem.Created),
                    UserName: resListItem.Author.Title,
                    ...this.getUserInfo(resListItem.Author.Id)
                },
                Id: resListItem.Id,
                ListId: curListId,
                siteType: curSiteType,
                siteUrl: curSiteURL
            }));
        }
        else if(selTabName=="ALL") {
            console.log(this.state.navItems);
            let navItems = [...this.state.configItems];
            const excludedTabItems = ["Master Tasks", "DOCUMENTS", "FOLDERS", "ALL"];
            let _resListItems = [];
            let allTabItems = navItems.filter(navItem=>(excludedTabItems.indexOf(navItem.Title)==-1));
            allTabItems.forEach(async (tabItem, tabIndex) =>{
                curListId = tabItem.listId;
                curSiteType = tabItem.siteName;
                curSiteURL = tabItem.siteUrl
                if(tabItem.Title==='SERVICES'){
                    curNavItem.columns = "PortfolioStructureID,ComponentCategory/Id,ComponentCategory/Title,Services/Title,Services/Id,Events/Id,Events/Title,SiteCompositionSettings,ShortDescriptionVerified,Portfolio_x0020_Type,BackgroundVerified,descriptionVerified,Synonyms,BasicImageInfo,OffshoreComments,OffshoreImageUrl,HelpInformationVerified,IdeaVerified,TechnicalExplanationsVerified,Deliverables,DeliverablesVerified,ValueAddedVerified,CompletedDate,SharewebTaskType/Id,SharewebTaskType/Title,SharewebTaskType/Level,SharewebTaskType/Prefix,Idea,ValueAdded,TechnicalExplanations,Item_x0020_Type,Sitestagging,Package,Parent/Id,Parent/Title,Short_x0020_Description_x0020_On,Short_x0020_Description_x0020__x,Short_x0020_description_x0020__x0,Admin_x0020_Notes,AdminStatus,Background,Help_x0020_Information,SharewebComponent/Id,SharewebCategories/Id,SharewebCategories/Title,Priority_x0020_Rank,Reference_x0020_Item_x0020_Json,Team_x0020_Members/Title,Team_x0020_Members/Name,Component/Id,Component/Title,Component/ItemType,Team_x0020_Members/Id,Item_x002d_Image,component_x0020_link,IsTodaysTask,AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,AttachmentFiles/FileName,FileLeafRef,FeedBack,Title,Id,PercentComplete,Company,StartDate,DueDate,Comments,Categories,Status,WebpartId,Body,Mileage,PercentComplete,Attachments,Priority,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title&$expand=SharewebTaskType,ComponentCategory,AssignedTo,Component,Events,Services,AttachmentFiles,Author,Editor,Team_x0020_Members,SharewebComponent,SharewebCategories,Parent&$filter=Portfolio_x0020_Type eq 'Service'&$orderby=Modified desc&$top=200"
                }
                else if(tabItem.Title==='COMPONENTS'){
                    curNavItem.columns = "PortfolioStructureID,ComponentCategory/Id,ComponentCategory/Title,Services/Title,Services/Id,Events/Id,Events/Title,SiteCompositionSettings,ShortDescriptionVerified,Portfolio_x0020_Type,BackgroundVerified,descriptionVerified,Synonyms,BasicImageInfo,OffshoreComments,OffshoreImageUrl,HelpInformationVerified,IdeaVerified,TechnicalExplanationsVerified,Deliverables,DeliverablesVerified,ValueAddedVerified,CompletedDate,SharewebTaskType/Id,SharewebTaskType/Title,SharewebTaskType/Level,SharewebTaskType/Prefix,Idea,ValueAdded,TechnicalExplanations,Item_x0020_Type,Sitestagging,Package,Parent/Id,Parent/Title,Short_x0020_Description_x0020_On,Short_x0020_Description_x0020__x,Short_x0020_description_x0020__x0,Admin_x0020_Notes,AdminStatus,Background,Help_x0020_Information,SharewebComponent/Id,SharewebCategories/Id,SharewebCategories/Title,Priority_x0020_Rank,Reference_x0020_Item_x0020_Json,Team_x0020_Members/Title,Team_x0020_Members/Name,Component/Id,Component/Title,Component/ItemType,Team_x0020_Members/Id,Item_x002d_Image,component_x0020_link,IsTodaysTask,AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,AttachmentFiles/FileName,FileLeafRef,FeedBack,Title,Id,PercentComplete,Company,StartDate,DueDate,Comments,Categories,Status,WebpartId,Body,Mileage,PercentComplete,Attachments,Priority,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title&$expand=SharewebTaskType,ComponentCategory,AssignedTo,Component,Events,Services,AttachmentFiles,Author,Editor,Team_x0020_Members,SharewebComponent,SharewebCategories,Parent&$filter=Portfolio_x0020_Type eq 'Component'&$orderby=Modified desc&$top=200"
                }
                else{
                    curNavItem.columns = "ParentTask/Title,ParentTask/Id,Services/Title,ClientTime,Services/Id,Events/Id,Events/Title,ItemRank,Portfolio_x0020_Type,SiteCompositionSettings,SharewebTaskLevel1No,SharewebTaskLevel2No,TimeSpent,BasicImageInfo,OffshoreComments,OffshoreImageUrl,CompletedDate,Shareweb_x0020_ID,Responsible_x0020_Team/Id,Responsible_x0020_Team/Title,SharewebCategories/Id,SharewebCategories/Title,ParentTask/Shareweb_x0020_ID,SharewebTaskType/Id,SharewebTaskType/Title,SharewebTaskType/Level,SharewebTaskType/Prefix,Priority_x0020_Rank,Reference_x0020_Item_x0020_Json,Team_x0020_Members/Title,Team_x0020_Members/Name,Component/Id,Component/Title,Component/ItemType,Team_x0020_Members/Id,Item_x002d_Image,component_x0020_link,IsTodaysTask,AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,AttachmentFiles/FileName,FileLeafRef,FeedBack,Title,Id,PercentComplete,Company,StartDate,DueDate,Comments,Categories,Status,WebpartId,Body,Mileage,PercentComplete,Attachments,Priority,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title,RelevantTasks/Id,RelevantTasks/Title&$expand=RelevantTasks,ParentTask,Events,Services,SharewebTaskType,AssignedTo,Component,AttachmentFiles,Author,Editor,Team_x0020_Members,Responsible_x0020_Team,SharewebCategories&$orderby=Modified desc&$top=200"
                }
                queryStrings = (curNavItem.columns && curNavItem.columns.split("&$")) || [];
                let qStrings = this.getQueryStrings(queryStrings);
                qStrings.Top = 100;
                _resListItems = await this.getListItems(curListId, qStrings);
                if(_resListItems.length) {
                    resListItems = _resListItems.map(resListItem => ({
                        TaskId: `T${resListItem.Id}`,
                        ID: resListItem.Id,
                        TaskName: resListItem.Title,
                        PortfolioType: (resListItem.Component && resListItem.Component.length>0 ? "Component" :
                            (resListItem.Services && resListItem.Services.length>0 ? "Service" :
                            (resListItem.Events && resListItem.Events.length>0 ? "Event" :
                            (resListItem.Portfolio_x0020_Type ? resListItem.Portfolio_x0020_Type: "")))),
                        Components: resListItem.Component,
                        Services: resListItem.Services,
                        Events: resListItem.Events,
                        ComponentLink: resListItem.component_x0020_link ? resListItem.component_x0020_link.Url : "#",
                        DueDate: this.formatDate(resListItem.DueDate),
                        PercentComplete: resListItem.PercentComplete ? parseFloat(resListItem.PercentComplete)*100 : 0,
                        Priority: resListItem.Priority_x0020_Rank ? parseInt(resListItem.Priority_x0020_Rank) : 0,
                        TeamUsers: this.getTeamUsers(resListItem.Responsible_x0020_Team, resListItem.AssignedTo, resListItem.Team_x0020_Members),
                        Modified: {
                            Date: this.formatDate(resListItem.Modified),
                            UserName: resListItem.Editor.Title,
                            ...this.getUserInfo(resListItem.Editor.Id)
                        },
                        Created: {
                            Date: this.formatDate(resListItem.Created),
                            UserName: resListItem.Author.Title,
                            ...this.getUserInfo(resListItem.Author.Id)
                        },
                        
                        Id: resListItem.Id,
                        listId: curListId,
                        SiteType: curSiteType,
                        siteUrl: curSiteURL,
                        SiteIcon : tabItem.ImageUrl
                    }));
                    listLastModifiedItems.push(...resListItems);                    
                }
                if(allTabItems.length-1 == tabIndex) {
                    this.setState({
                        listLastModifiedItems: listLastModifiedItems,
                        filteredItems: listLastModifiedItems
                    });
                }               
            });            
        }
        else {
            resListItems = await this.getListItems(curListId, qStrings);
            listLastModifiedItems = resListItems.map( resListItem => ({
                TaskId: `T${resListItem.Id}`,
                ID: resListItem.Id,
                TaskName: resListItem.Title,
                PortfolioType: (resListItem.Component && resListItem.Component.length>0 ? "Component" :
                    (resListItem.Services && resListItem.Services.length>0 ? "Service" :
                    (resListItem.Events && resListItem.Events.length>0 ? "Event" :
                    (resListItem.Portfolio_x0020_Type ? resListItem.Portfolio_x0020_Type: "")))),
                Components: resListItem.Component,
                Services: resListItem.Services,
                Events: resListItem.Events,
                ComponentLink: resListItem.component_x0020_link ? resListItem.component_x0020_link.Url : "#",
                DueDate: this.formatDate(resListItem.DueDate),
                PercentComplete: resListItem.PercentComplete ? parseFloat(resListItem.PercentComplete)*100 : 0,
                Priority: resListItem.Priority_x0020_Rank ? parseInt(resListItem.Priority_x0020_Rank) : 0,
                TeamUsers: this.getTeamUsers(resListItem.Responsible_x0020_Team, resListItem.AssignedTo, resListItem.Team_x0020_Members),
                Modified: {
                    Date: this.formatDate(resListItem.Modified),
                    UserName: resListItem.Editor.Title,
                    ...this.getUserInfo(resListItem.Editor.Id)
                },
                Created: {
                    Date: this.formatDate(resListItem.Created),
                    UserName: resListItem.Author.Title,
                    ...this.getUserInfo(resListItem.Author.Id)
                },
                Id: resListItem.Id,
                listId: curListId,
                siteType: curSiteType,
                siteUrl: curSiteURL,
                SiteIcon : curSiteIcon
            }));
        }        

        this.setState({
            listLastModifiedItems: listLastModifiedItems,
            filteredItems: listLastModifiedItems
        });
    }   
    
    private getQueryStrings(queryStrings: any[]) {        
        let selectQuery=""; let expandQuery=""; let filterQuery=""; let orderByQuery=""; let topCount = 5000;
        queryStrings.forEach(queryString => {
            if(queryString.indexOf("=")==-1) {
                selectQuery = queryString;
            }
            else if(queryString.indexOf("expand=")>-1) {
                expandQuery = queryString.split("=")[1];
            }
            else if(queryString.indexOf("filter=")>-1) {
                filterQuery = queryString.split("=")[1];
            }
            else if(queryString.indexOf("orderby=")>-1) {
                orderByQuery = queryString.split("=")[1];
            }
            else if(queryString.indexOf("top=")>-1) {
                topCount = parseInt(queryString.split("=")[1]);
            }
        });
        let queryString = {
            Select: selectQuery,
            Expand: expandQuery,
            Filter: filterQuery,
            OrderBy: orderByQuery,
            Top: topCount
        };
        return queryString;
    }

    private async getListItems(curListId: string, qStrings: any) {
        let resListItems = await this.spService.getListItems(curListId, qStrings.Select, qStrings.Expand, qStrings.Filter, qStrings.OrderBy, qStrings.Top);
        return resListItems;
    }

    private formatDate(_date: string) {
        if(!_date) return;
        let dateFormat = "DD/MM/YYYY";
        let mDateTime = moment(_date).tz("Europe/Berlin").format(dateFormat);
        return mDateTime;
    }

    private getTeamUsers(respTeam: any[], assignedUsers: any[], teamMembers: any[]) {
        
        let respTeamInfo: any[] = [];
        let assignedUserInfo: any[] = [];
        let teamMemberInfo: any[] = [];

        if(respTeam) {
            respTeam.forEach((respTeamItem) => respTeamInfo.push({
                UserName: respTeamItem.Title,
                ...this.getUserInfo(respTeamItem.Id)
            }))
        }
        if(assignedUsers) {
            assignedUsers.forEach((assignedToItem) => assignedUserInfo.push({
                UserName: assignedToItem.Title,
                ...this.getUserInfo(assignedToItem.Id)
            }))
        }
        if(teamMembers) {
            teamMembers.forEach((teamMemberItem) => teamMemberInfo.push({
                UserName: teamMemberItem.Title,
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
            ImageUrl: "",
            UserId: undefined
        };
        let taskUser = this.state.taskUsers.filter(taskUser=>taskUser.UserId==userId);
        let _taskUser;
        if(taskUser.length>0) {
            _taskUser = taskUser[0];
            userInfo.ImageUrl = _taskUser.ImageUrl;
            userInfo.UserId = _taskUser.UserId;
        }
        return userInfo;
    }

    private getFilteredItems(filterText?: string) {
        if(!filterText) filterText = this.state.searchText;
        let allItems = [...this.state.listLastModifiedItems];
        if(filterText.length<2) {
            return allItems;
        }
        filterText = filterText.toLowerCase();
        let filteredItems: any[] = [];
        
        let textExists: boolean;
        let cellValue: string | undefined;

        allItems.forEach( lmItem => {
            textExists = false;
            Object.keys(lmItem).forEach( key => {
                cellValue = lmItem[key];
                if( cellValue && cellValue.toString().toLowerCase().indexOf(filterText)>-1) {
                    textExists = true;
                }
            } );
            if(textExists) {
                filteredItems.push(lmItem);
            }
        });

        return filteredItems;
    }

    private async deleteTask() {
        
        console.log("DELETE");

        
    }

    private onNavItemMenuClick(navItem: PivotItem) {
        let selTabName: string = navItem.props.itemKey;
        let selNavItem = {...this.state.selNavItem};
        let currentNavItem = this.state.configItems.filter(configItem=>configItem.Title==selTabName)[0];
        
        selNavItem.displaySiteName = currentNavItem.Title;
        selNavItem.columns = currentNavItem.Title === 'DOCUMENTS'  ? 'Id,Title,FileLeafRef,File_x0020_Type,Modified,Created,EncodedAbsUrl,Author/Id,Author/Title,Editor/Id,Editor/Title&$expand=Author,Editor&$filter=FSObjType eq 0&$orderby=Modified desc&$top=200'    : (currentNavItem.Title === 'FOLDERS' ? "Id,Title,FileLeafRef,File_x0020_Type,Modified,Created,EncodedAbsUrl,Author/Id,Author/Title,Editor/Id,Editor/Title&$expand=Author,Editor&$filter=FSObjType eq 1&$orderby=Modified desc&$top=200" : (currentNavItem.Title === 'COMPONENTS' ? "PortfolioStructureID,ComponentCategory/Id,ComponentCategory/Title,Services/Title,Services/Id,Events/Id,Events/Title,SiteCompositionSettings,ShortDescriptionVerified,Portfolio_x0020_Type,BackgroundVerified,descriptionVerified,Synonyms,BasicImageInfo,OffshoreComments,OffshoreImageUrl,HelpInformationVerified,IdeaVerified,TechnicalExplanationsVerified,Deliverables,DeliverablesVerified,ValueAddedVerified,CompletedDate,SharewebTaskType/Id,SharewebTaskType/Title,SharewebTaskType/Level,SharewebTaskType/Prefix,Idea,ValueAdded,TechnicalExplanations,Item_x0020_Type,Sitestagging,Package,Parent/Id,Parent/Title,Short_x0020_Description_x0020_On,Short_x0020_Description_x0020__x,Short_x0020_description_x0020__x0,Admin_x0020_Notes,AdminStatus,Background,Help_x0020_Information,SharewebComponent/Id,SharewebCategories/Id,SharewebCategories/Title,Priority_x0020_Rank,Reference_x0020_Item_x0020_Json,Team_x0020_Members/Title,Team_x0020_Members/Name,Component/Id,Component/Title,Component/ItemType,Team_x0020_Members/Id,Item_x002d_Image,component_x0020_link,IsTodaysTask,AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,AttachmentFiles/FileName,FileLeafRef,FeedBack,Title,Id,PercentComplete,Company,StartDate,DueDate,Comments,Categories,Status,WebpartId,Body,Mileage,PercentComplete,Attachments,Priority,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title&$expand=SharewebTaskType,ComponentCategory,AssignedTo,Component,Events,Services,AttachmentFiles,Author,Editor,Team_x0020_Members,SharewebComponent,SharewebCategories,Parent&$filter=Portfolio_x0020_Type eq 'Component'&$orderby=Modified desc&$top=200"  : (currentNavItem.Title === 'SERVICES' ? "PortfolioStructureID,ComponentCategory/Id,ComponentCategory/Title,Services/Title,Services/Id,Events/Id,Events/Title,SiteCompositionSettings,ShortDescriptionVerified,Portfolio_x0020_Type,BackgroundVerified,descriptionVerified,Synonyms,BasicImageInfo,OffshoreComments,OffshoreImageUrl,HelpInformationVerified,IdeaVerified,TechnicalExplanationsVerified,Deliverables,DeliverablesVerified,ValueAddedVerified,CompletedDate,SharewebTaskType/Id,SharewebTaskType/Title,SharewebTaskType/Level,SharewebTaskType/Prefix,Idea,ValueAdded,TechnicalExplanations,Item_x0020_Type,Sitestagging,Package,Parent/Id,Parent/Title,Short_x0020_Description_x0020_On,Short_x0020_Description_x0020__x,Short_x0020_description_x0020__x0,Admin_x0020_Notes,AdminStatus,Background,Help_x0020_Information,SharewebComponent/Id,SharewebCategories/Id,SharewebCategories/Title,Priority_x0020_Rank,Reference_x0020_Item_x0020_Json,Team_x0020_Members/Title,Team_x0020_Members/Name,Component/Id,Component/Title,Component/ItemType,Team_x0020_Members/Id,Item_x002d_Image,component_x0020_link,IsTodaysTask,AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,AttachmentFiles/FileName,FileLeafRef,FeedBack,Title,Id,PercentComplete,Company,StartDate,DueDate,Comments,Categories,Status,WebpartId,Body,Mileage,PercentComplete,Attachments,Priority,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title&$expand=SharewebTaskType,ComponentCategory,AssignedTo,Component,Events,Services,AttachmentFiles,Author,Editor,Team_x0020_Members,SharewebComponent,SharewebCategories,Parent&$filter=Portfolio_x0020_Type eq 'Service'&$orderby=Modified desc&$top=200" : "ParentTask/Title,ParentTask/Id,Services/Title,ClientTime,Services/Id,Events/Id,Events/Title,ItemRank,Portfolio_x0020_Type,SiteCompositionSettings,SharewebTaskLevel1No,SharewebTaskLevel2No,TimeSpent,BasicImageInfo,OffshoreComments,OffshoreImageUrl,CompletedDate,Shareweb_x0020_ID,Responsible_x0020_Team/Id,Responsible_x0020_Team/Title,SharewebCategories/Id,SharewebCategories/Title,ParentTask/Shareweb_x0020_ID,SharewebTaskType/Id,SharewebTaskType/Title,SharewebTaskType/Level,SharewebTaskType/Prefix,Priority_x0020_Rank,Reference_x0020_Item_x0020_Json,Team_x0020_Members/Title,Team_x0020_Members/Name,Component/Id,Component/Title,Component/ItemType,Team_x0020_Members/Id,Item_x002d_Image,component_x0020_link,IsTodaysTask,AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,AttachmentFiles/FileName,FileLeafRef,FeedBack,Title,Id,PercentComplete,Company,StartDate,DueDate,Comments,Categories,Status,WebpartId,Body,Mileage,PercentComplete,Attachments,Priority,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title,RelevantTasks/Id,RelevantTasks/Title&$expand=RelevantTasks,ParentTask,Events,Services,SharewebTaskType,AssignedTo,Component,AttachmentFiles,Author,Editor,Team_x0020_Members,Responsible_x0020_Team,SharewebCategories&$orderby=Modified desc&$top=200")))
        selNavItem.listId = currentNavItem.listId;
        selNavItem.site = currentNavItem.Title;
        selNavItem.siteIcon = currentNavItem.Title == "Migration" ?   "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_migration.png"    : currentNavItem.ImageUrl;
        selNavItem.siteUrl = currentNavItem.siteUrl.Url;
        selNavItem.sortOrder = currentNavItem.SortOrder;
        selNavItem.tabName = currentNavItem.Title;
        selNavItem.title = currentNavItem.Title;
        this.setState({
            selNavItem: selNavItem
        }, this.getLastModifiedItems);
    }

    private onSearchTextChange(ev: any, newText: string) {
        let filteredItems = [...this.state.listLastModifiedItems];
        if(newText.length>2) {
            filteredItems = this.getFilteredItems(newText);            
        }
        this.setState({
            searchText: newText,
            filteredItems: filteredItems
        });
    }

    private onComponentsChecked(ev: any, compChecked: boolean) {
        let filteredItems = [...this.state.filteredItems];
        if(compChecked && !this.state.serviceChecked) {
            filteredItems = filteredItems.filter(filteredItem => filteredItem.PortfolioType=="Component");
        }
        else {
            filteredItems = this.getFilteredItems();
        }
        this.setState({
            componentsChecked: compChecked,
            filteredItems: filteredItems
        });
    }

    private onServiceChecked(ev: any, serviceChecked: boolean) {
        let filteredItems = [...this.state.filteredItems];
        if(serviceChecked && !this.state.serviceChecked) {
            filteredItems = filteredItems.filter(filteredItem => filteredItem.PortfolioType=="Service");
        }
        else {
            filteredItems = this.getFilteredItems();
        }
        this.setState({
            serviceChecked: serviceChecked,
            filteredItems: filteredItems
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

    private async onDeleteIconClick(delItemId:number) {
        const curListId: string = this.state.selNavItem.listId;
        let confirmation = confirm(
            "Are you sure you want to delete this project ?"
          );
          if(confirmation){
           await this.spService.deleteTask(curListId,delItemId);
           this.loadConfigurations();
          }
        
        console.log(delItemId,curListId);
    }

    private onDeleteTask() {
        this.setState({
            hideDeleteDialog: false
        });
    }

    private _onResetFiltersClicked() {
        this.setState({
            resetRecords: true
        });
    }

    public _onFilterItems(showFilter: boolean) {
        this.setState({
            showResetFilters: showFilter
        })
    }

    render(): JSX.Element {        
        
        const elemPivotNav = (<div style={{ display: 'flex', padding: '5px' }}>
            <div className={styles.centerDiv}>
                <PivotNavItems Items={this.state.navItems} SelectedKey={this.state.selNavItem.tabName} OnMenuClick={this.onNavItemMenuClick} />
            </div>
        </div>);

        //const elemFilter = (<SectionFilter SearchText={this.state.searchText} FilterByComponents={false} FilterByService={false} OnSearchTextChange={this.onSearchTextChange} OnComponentsCheck={this.onComponentsChecked} OnServiceCheck={this.onServiceChecked} />);

        //const elemClearFilter = this.state.showResetFilters && <div className={styles.topBarFilters}><span className={styles.resetFilter}><Icon iconName="ClearFilter" role="button" onClick={this._onResetFiltersClicked} /></span></div>

        const elemClearFilter = this.state.showResetFilters && <Icon iconName="ClearFilter" role="button" onClick={this._onResetFiltersClicked} styles={iconStyles} />
        
        const elemFilter = (
            <div className="mt-3">
                <div className="ms-Grid-col ms-sm2 ms-md2 ms-lg2">
                    <Label styles={controlStyles}>Showing {this.state.filteredItems.length} items</Label>
                </div>
                <div className="ms-Grid-col ms-sm4 ms-md4 ms-lg4">
                    <SearchBox value={this.state.searchText} onChange={this.onSearchTextChange} styles={controlStyles} />
                </div>
                {this.state.selNavItem?.tabName=="DOCUMENTS" ||  this.state.selNavItem?.tabName=="FOLDERS" || this.state.selNavItem?.tabName=="COMPONENTS" || this.state.selNavItem?.tabName=="SERVICES"  ?
                 "":<div className="ms-Grid-col ms-sm2 ms-md2 ms-lg2 mt-2">
                 <Checkbox checked={this.state.componentsChecked} onChange={this.onComponentsChecked} label="Components" styles={controlStyles} />
             </div>         }
                {
                    this.state.selNavItem?.tabName=="DOCUMENTS" ||  this.state.selNavItem?.tabName=="FOLDERS" || this.state.selNavItem?.tabName=="COMPONENTS" || this.state.selNavItem?.tabName=="SERVICES"  ?
                  "":  <div className="ms-Grid-col ms-sm2 ms-md2 ms-lg2 mt-2">
                    <Checkbox checked={this.state.serviceChecked} onChange={this.onServiceChecked} label="Service" styles={controlStyles} />
                </div>                       
                }
                
                <div className="ms-Grid-col ms-sm2 ms-md2 ms-lg2">
                    {elemClearFilter}
                </div>
            </div>
        );

        const elemListLMI = (this.state.filteredItems.length>0 && <ListLastModifiedItems context={this.props.Context} Items={this.state.filteredItems} AllListId={AllListId} TabName={this.state.selNavItem.tabName} Site={this.state.selNavItem.site} ResetItems={this.state.resetRecords} OnDelete={this.onDeleteIconClick} OnFilter={this._onFilterItems} siteUrl={this.props.siteUrl} />);
        
        const elemDeleteRecord = (<Dialog
            hidden = {this.state.hideDeleteDialog}
            onDismiss = {this.onCancelDeleteDialog}
            dialogContentProps = {deleteDialogContentProps}
        >
            <DialogFooter>
                <PrimaryButton text="OK" onClick={this.onConfirmDeleteDialog} />
                <DefaultButton text="Cancel" onClick={this.onCancelDeleteDialog} />
            </DialogFooter>
        </Dialog>)
        
        return (<div className="ms-Grid">
            <div className="ms-Grid-row">
                <SectionTitle Title="Last Modified Views" />
            </div>
            <div className="ms-Grid-row">
                { elemPivotNav }
            </div>
            <div className="ms-Grid-row">
                { elemFilter }
            </div>
            <div className={css("ms-Grid-row", styles.content)}>
                { elemListLMI }
            </div>
            { elemDeleteRecord }            
        </div>);
    }
}
