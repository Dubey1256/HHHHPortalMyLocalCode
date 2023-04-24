import { Checkbox, css, DefaultButton, Dialog, DialogFooter, DialogType, Icon, Label, PivotItem, PrimaryButton, SearchBox } from "@fluentui/react";
import * as React from "react";
import spservices from "../../../spservices/spservices";

import { ILastModifiedItemsAppProps } from "./ILastModifiedItemsAppProps";
import { ILastModifiedItemsAppState } from "./ILastModifiedItemsAppState";
import ListLastModifiedItems from "./ListLastModifiedItems";
import PivotNavItems from "./PivotNavItems";
//import SectionFilter from "./SectionFilter";
import SectionTitle from "./SectionTitle";
import * as moment from "moment-timezone";

const controlStyles = {
    root: {
        // margin: '10px 5px 20px 0px',
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

    componentDidMount(): void {
        this.loadConfigurations();
    }

    private async loadConfigurations() {
        const configItemsRes = await this.spService.getLastModifiedItemsConfiguration();
        const taskUsersRes = await this.spService.getTasks();
        const taskUsers = taskUsersRes.filter((taskUser:any)=>taskUser.AssingedToUser&&taskUser.Item_x0020_Cover).map((taskUser:any)=>({
            UserId: taskUser.AssingedToUser.Id,
            ImageUrl: taskUser.Item_x0020_Cover.Url
        }));
        let configItems = [];
        let navItems: any[] = [];
        let selNavItem = {...this.state.selNavItem};
        if(configItemsRes.length) {
            configItems = JSON.parse(configItemsRes[0].Configuration);
            navItems = configItems.map( (configItem: { TabName: string; }) => ({
                text: configItem.TabName,
                key: configItem.TabName
            }));
            let defaultSelNavItem = configItems[0];
            selNavItem.columns = defaultSelNavItem.Columns;
            selNavItem.displaySiteName = defaultSelNavItem.DisplaySiteName;
            selNavItem.listId = defaultSelNavItem.ListId;
            selNavItem.site = defaultSelNavItem.Site;
            selNavItem.siteIcon = defaultSelNavItem.SiteIcon;
            selNavItem.siteUrl = defaultSelNavItem.SiteUrl;
            selNavItem.sortOrder = defaultSelNavItem.SortOrder;
            selNavItem.tabName = defaultSelNavItem.TabName;
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
        let queryStrings = (curNavItem.columns && curNavItem.columns.split("&$")) || [];

        let qStrings = this.getQueryStrings(queryStrings);
        
        let selTabName: string = this.state.selNavItem.tabName;
        let resListItems: any[] = [];
        let listLastModifiedItems: any[] = [];

        if(selTabName=="DOCUMENTS") {
            resListItems = await this.getListItems(curListId, qStrings);
            listLastModifiedItems = resListItems.map( resListItem => ({
                FolderName: resListItem.FileLeafRef,
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
                
            }));
        }
        else if(selTabName=="FOLDERS") {
            resListItems = await this.getListItems(curListId, qStrings);
            listLastModifiedItems = resListItems.map( resListItem => ({
                FolderName: resListItem.FileLeafRef,
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
                siteType: curSiteType,
                siteUrl: curSiteURL
            }));
        }
        else if(selTabName=="SERVICES") {
            resListItems = await this.getListItems(curListId, qStrings);
            listLastModifiedItems = resListItems.map( resListItem => ({
                ServiceId: resListItem.PortfolioStructureID,
                Title: resListItem.Title,
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
                curListId = tabItem.ListId;
                curSiteType = tabItem.Site;
                curSiteURL = tabItem.SiteUrl
                queryStrings = (tabItem.Columns && tabItem.Columns.split("&$")) || [];
                let qStrings = this.getQueryStrings(queryStrings);
                qStrings.Top = 100;
                _resListItems = await this.getListItems(curListId, qStrings);
                if(_resListItems.length) {
                    resListItems = _resListItems.map((resListItem:any )=> ({
                        TaskId: `T${resListItem.Id}`,
                        TaskName: resListItem.Title,
                        PortfolioType: (resListItem.Component && resListItem.Component.length>0 ? "Component" :
                            (resListItem.Services && resListItem.Services.length>0 ? "Service" :
                            (resListItem.Events && resListItem.Events.length>0 ? "Event" :
                            (resListItem.Portfolio_x0020_Type ? resListItem.Portfolio_x0020_Type: "")))),
                        Components: resListItem.Component,
                        Services: resListItem.Services,
                        Events: resListItem.Events,
                        SiteType: resListItem.siteType,
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
                        ListId: curListId,
                        siteType: curSiteType,
                        siteUrl: curSiteURL
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
                TaskName: resListItem.Title,
                PortfolioType: (resListItem.Component && resListItem.Component.length>0 ? "Component" :
                    (resListItem.Services && resListItem.Services.length>0 ? "Service" :
                    (resListItem.Events && resListItem.Events.length>0 ? "Event" :
                    (resListItem.Portfolio_x0020_Type ? resListItem.Portfolio_x0020_Type: "")))),
                Components: resListItem.Component,
                Services: resListItem.Services,
                Events: resListItem.Events,
                SiteType: resListItem.siteType,
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
                siteUrl: curSiteURL
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
        let currentNavItem = this.state.configItems.filter(configItem=>configItem.TabName==selTabName)[0];
        
        selNavItem.columns = currentNavItem.Columns;
        selNavItem.displaySiteName = currentNavItem.DisplaySiteName;
        selNavItem.listId = currentNavItem.ListId;
        selNavItem.site = currentNavItem.Site;
        selNavItem.siteIcon = currentNavItem.SiteIcon;
        selNavItem.siteUrl = currentNavItem.SiteUrl;
        selNavItem.sortOrder = currentNavItem.SortOrder;
        selNavItem.tabName = currentNavItem.TabName;
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

    private onDeleteIconClick(delItemId:number) {
        const curListId: string = this.state.selNavItem.listId;
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
        
        const elemPivotNav = (<div className="p-0">
           
                <PivotNavItems Items={this.state.navItems} SelectedKey={this.state.selNavItem.tabName} OnMenuClick={this.onNavItemMenuClick} />
          
        </div>);

        //const elemFilter = (<SectionFilter SearchText={this.state.searchText} FilterByComponents={false} FilterByService={false} OnSearchTextChange={this.onSearchTextChange} OnComponentsCheck={this.onComponentsChecked} OnServiceCheck={this.onServiceChecked} />);

        //const elemClearFilter = this.state.showResetFilters && <div className={styles.topBarFilters}><span className={styles.resetFilter}><Icon iconName="ClearFilter" role="button" onClick={this._onResetFiltersClicked} /></span></div>

        const elemClearFilter = this.state.showResetFilters && <Icon iconName="ClearFilter" role="button" onClick={this._onResetFiltersClicked} styles={iconStyles} />
        
        const elemFilter = (
            <div className="tbl-headings">

                <span className="leftsec">
                <span> <Label styles={controlStyles}>Showing {this.state.filteredItems.length} items</Label></span> <span className="ms-1"> <SearchBox value={this.state.searchText} onChange={this.onSearchTextChange} styles={controlStyles} /></span>
                </span>
                <span className="toolbox mx-auto">
                    <Checkbox checked={this.state.componentsChecked} onChange={this.onComponentsChecked} label="Components" className="me-2" styles={controlStyles} />
                    <Checkbox checked={this.state.serviceChecked} onChange={this.onServiceChecked} label="Service" styles={controlStyles} />
                    {elemClearFilter}
                </span>
            </div>
        );

        const elemListLMI = (this.state.filteredItems.length>0 && <ListLastModifiedItems Items={this.state.filteredItems} TabName={this.state.selNavItem.tabName} Site={this.state.selNavItem.site} ResetItems={this.state.resetRecords} OnDelete={this.onDeleteIconClick} OnFilter={this._onFilterItems} />);
        
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
        
        return (<div>
            <div className="col">
                <SectionTitle Title="Last Modified Views" />
            </div>
            <div className="col">
                { elemPivotNav }
            </div>
            <div className="Alltable border border-top-0 full-width p-2 px-0 pt-0 mt-2">
            <div className="col">
                { elemFilter }
            </div>
            <div className="col">
                { elemListLMI }
            </div>
            </div>
            { elemDeleteRecord }            
        </div>);
     
       
    }
}