import * as React from 'react';
import { Modal } from 'office-ui-fabric-react';
import { Web } from "sp-pnp-js";
import TeamConfigurationCard from '../TeamConfiguration/TeamConfiguration';
import { arraysEqual, Panel, PanelType } from 'office-ui-fabric-react';

export interface IStructureCreationProps {
    CreatOpen:(item:any)=>void;
    Close:()=>void;
    SelectedItem:any;
}
  
export interface IStructureCreationState {  
    isModalOpen : boolean;
    AllFilteredAvailableComoponent : any;
    //Portfolio_x0020_Type : string;
    textTitle : string;
    IsComponentPopup : boolean;
    Item_x0020_Type : string;
    SelectedItem : any;
    TeamConfig : any;
    OpenModal: string;
    ChildItemTitle : any;
}

const dragItem:any = {}
export class PortfolioStructureCreationCard extends React.Component<IStructureCreationProps, IStructureCreationState> {
    constructor(props:IStructureCreationProps){
        super(props);
        this.state ={
            isModalOpen : false,
            AllFilteredAvailableComoponent : [],
            //Portfolio_x0020_Type : 'Component',
            textTitle : '',
            IsComponentPopup : false,
            Item_x0020_Type : 'SubComponent',
            SelectedItem : this.props.SelectedItem,
            TeamConfig : [],
            OpenModal : '',
            ChildItemTitle : []
        }
        
        this.Load()
    }

    private setItemType(){
        let item = this.props.SelectedItem;
        if (item != undefined){
            item.siteUrl = 'https://hhhhteams.sharepoint.com/sites/HHHH/SP';
            item.listName = 'Master Tasks';
        }
        
        this.setState({
            SelectedItem : item,
            OpenModal : item != undefined ? 'SubComponent' : 'Component'
        })
    }
    private async Load(){
        //this.setItemType();
        console.log(this.props.SelectedItem);
        await this.LoadPortfolioitemParentId(undefined,undefined, undefined);
        this.setItemType();
    }

    private closeModal(e: any) {
        e.preventDefault();
        this.setState({
            isModalOpen: false
        })
        this.props.Close();
      }

    private OpenModal(e: any) {
        e.preventDefault();
        this.setState({
            isModalOpen: true
        })
      }

    handleInputChange = (e:any) =>{
        this.setState({ textTitle: e.target.value });
    }

    private async GetOrCreateFolder(foldername:any){
        let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
        let isFolderExists = false;
        try {
            let folder = await web.getFolderByServerRelativeUrl("/sites/hhhh/sp/documents/COMPONENT-PORTFOLIO/"+ foldername).get();
            console.log(folder);
            isFolderExists = folder.Exists;
           
        } catch (error) {
            isFolderExists = false;
            // creates a new folder for web with specified url
            let folderAddResult = await web.folders.add("/sites/hhhh/sp/documents/COMPONENT-PORTFOLIO/"+ foldername);
            console.log(folderAddResult);
            isFolderExists = folderAddResult.data.Exists;
        }        
        console.log("folder exists : " + isFolderExists); 
        
        return isFolderExists;              
    }

    private async GetFolderID(folderName:any){        
        let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
        let folderDeatils = [];
        folderDeatils = await web.lists
            .getByTitle("Documents")
            .items
            .select("ID", "Title", "FileDirRef", "FileLeafRef","ServerUrl","FSObjType", "EncodedAbsUrl")
            .filter("FileLeafRef eq '" + folderName + "'")
            .get()

        console.log(folderDeatils[0].Id);
        this.Folders =  folderDeatils[0].Id;
    }

    private folderName:any;
    private Folders:string;
    private AdminStatusItem = 'Not Started';
    private GetportfolioIdCount = 0;
    private PortfolioStructureIDs = '';
    private NextLevel = 0;
    private MasterItemsType = '';
    private CountFor = 0;
    private TotalCount = 0;
    private Count = 0;
    private CreatedItem:any = [];
    private AssignedIds:any = [];
    private TeamMembersIds:any = [];
    private ChildItemTitle:any = [];
    private Portfolio_x0020_Type = 'Component';

    CreateFolder = async(Type:any) =>{        
        let folderURL = '';
        if (this.Portfolio_x0020_Type == 'Component') {
            folderURL = ('/sites/hhhh/sp/Documents/COMPONENT-PORTFOLIO').toLowerCase();
        } else if (this.Portfolio_x0020_Type == 'Service') {
            folderURL = ('/sites/hhhh/sp/Documents/SERVICE-PORTFOLIO').toLowerCase();
        } else if (this.Portfolio_x0020_Type == 'Events') {
            folderURL = ('/sites/hhhh/sp/Documents/EVENT-PORTFOLIO').toLowerCase();
        }
        let DOcListID = "d0f88b8f-d96d-4e12-b612-2706ba40fb08"
        if(this.state.textTitle == ''){
            alert('Please Enter the Title!')
        }
        else{
            this.folderName = this.state.textTitle.substring(0, 40);        
            let isFolderExists = await this.GetOrCreateFolder(this.folderName);
                if (isFolderExists){
                    await this.GetFolderID(this.folderName);
                    this.createComponent(Type);
                } 
        }
               
    };

    createComponent = async(Type:any) =>{    
        let postdata = {
            "Item_x0020_Type": 'Component',
            "Title": this.state.textTitle,
            "FolderID": String(this.Folders),
            "Portfolio_x0020_Type": this.Portfolio_x0020_Type,
            "AdminStatus": this.AdminStatusItem,
            "PortfolioLevel": this.NextLevel,
            "PortfolioStructureID": this.PortfolioStructureIDs
        }
        let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
        const i = await web.lists
        .getById("ec34b38f-0669-480a-910c-f84e92e58adf")
        .items
        .add(postdata);

        console.log(i);
        if (Type == 'CreatePopup') {
            this.setState({
                isModalOpen: false
            })
           //self.OpenEditPopup(self.CreatedItem[0]);
           this.props.CreatOpen(i);
        }else{
            this.setState({isModalOpen: false });
        }
       this.props.Close();
    }

    LoadPortfolioitemParentId = async(ItemType:any, isloadEssentialDeatils:any, item:any) => {
        if (ItemType == undefined)
            this.GetportfolioIdCount = 0;

        let ItemTypes = 'Component';
        if (ItemType == undefined) {
            if (this.state.SelectedItem != null && this.state.SelectedItem != undefined && this.state.SelectedItem.Item_x0020_Type == 'Root Component') {
                ItemTypes = 'Component';
            } else if (this.state.SelectedItem != null && this.state.SelectedItem != undefined && this.state.SelectedItem.Item_x0020_Type == 'Component') {
                 ItemTypes = 'SubComponent';
            }
            else if (this.state.SelectedItem != null && this.state.SelectedItem != undefined && this.state.SelectedItem.Item_x0020_Type == 'SubComponent') {
                 ItemTypes = 'Feature';
            }
            else if (this.state.SelectedItem != null || this.state.SelectedItem == undefined) {
                 ItemTypes = 'Component';
            }
        }
        let filter = ''
        if (ItemTypes == 'Component') {
            filter = "Item_x0020_Type eq '" + ItemTypes + "'"
        }
        else {
            filter = "Parent/Id eq '" + this.state.SelectedItem.Id + "' and Item_x0020_Type eq '" + ItemTypes + "'"
        }
        

        let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
        let results = await web.lists
            .getById("ec34b38f-0669-480a-910c-f84e92e58adf")
            .items
            .select("Id","Title","PortfolioLevel","PortfolioStructureID","Parent/Id")
            .expand("Parent")
            .filter(filter)
            .orderBy("PortfolioLevel", false)
            .top(1)
            .get()
        
            this.GetportfolioIdCount++;
            this.PortfolioStructureIDs = '';
            if (results.length == 0) {
                this.NextLevel = 1;
                if (item != undefined && this.GetportfolioIdCount <= 1)
                    item.NextLevel = this.NextLevel;
                else if (item != undefined && this.GetportfolioIdCount > 1)
                    item.NextLevel = this.GetportfolioIdCount;
                
            }
            else {
                this.NextLevel = results[0].PortfolioLevel + 1;
                if (item != undefined && this.GetportfolioIdCount <= 1)
                    item.NextLevel = this.NextLevel;
                else if (item != undefined && this.GetportfolioIdCount > 1)
                    item.NextLevel = this.NextLevel + (this.GetportfolioIdCount - 1);
            }
            
            if (this.state.SelectedItem != undefined && this.state.SelectedItem.PortfolioStructureID != undefined && ItemTypes != undefined) {
                this.PortfolioStructureIDs = this.state.SelectedItem.PortfolioStructureID + '-' + ItemTypes.slice(0, 1) + this.NextLevel;
                if (item != undefined)
                    item.PortfolioStructureIDs = this.state.SelectedItem.PortfolioStructureID + '-' + ItemTypes.slice(0, 1) + item.NextLevel;
            }
            if (this.props.SelectedItem == undefined) {
                this.PortfolioStructureIDs = 'C' + this.NextLevel;
            }

            if (isloadEssentialDeatils == undefined || isloadEssentialDeatils == true)
                this.LoadEssentialsDetail();
        
    }

    LoadEssentialsDetail = async() => {
        
            if (this.state.SelectedItem == undefined) {
               this.AdminStatusItem = 'Not Started';
                //this.orderBy = 'Title';
                //this.reverse = false;
                
            }
            else {
                if (this.state.SelectedItem.Item_x0020_Type == 'Feature') {
                    this.state.SelectedItem.SelectedItem.select = false;
                    alert('Child Item of Feature can not be created');
                    //$scope.cancelopenCreateItem();
                } else {
                    this.MasterItemsType = 'SubComponent';
                    this.ChildItemTitle = [];
                    this.CountFor = 0;
                    if (this.state.SelectedItem.Item_x0020_Type == 'SubComponent') {
                        this.MasterItemsType = 'Feature';
                    }

                    this.ChildItemTitle.push({ 
                        Title: '', 
                        MasterItemsType: this.MasterItemsType, 
                        AdminStatus: 'Not Started', 
                        Child: [{ Short_x0020_Description_x0020_On: '' }], 
                        Id: 0, 
                        TeamMemberUsers: [], 
                        AssignedToUsers: [], 
                        ResponsibleTeam: [], 
                        TeamMembersIds: [], 
                        AssignedToIds: [], 
                        ResponsibleTeamIds: [] 
                    });
                    this.Portfolio_x0020_Type = this.state.SelectedItem.Portfolio_x0020_Type;

                    this.setState({ChildItemTitle :  this.ChildItemTitle})
                }
            }
    }

   
    createChildItems = async(Type:any) =>{
        let isloadEssentialDeatils = false
        //$('#CreateChildpoup1').hide();
        //SharewebCommonFactoryService.showProgressBar();
       
       
        let self = this;
        this.GetportfolioIdCount = 0;
        for (let index = 0; index < self.ChildItemTitle.length; index++) {
            let item = self.ChildItemTitle[index];
            await self.LoadPortfolioitemParentId(item.MasterItemsType, isloadEssentialDeatils, item)
            
        }
        //self.ChildItemTitle.forEach(async function (item:any, index:any) {
            
        //});
      
        
            if (self.ChildItemTitle.length == self.GetportfolioIdCount) {
                let AddedCount = 0;
                self.ChildItemTitle.forEach(async function (item:any) {
                    //item.Title = self.state.textTitle
                    if (item.Title != undefined && item.Title != '') {
                       self.TotalCount++;
                       self.state.TeamConfig.ResponsibleTeam.forEach(function (assignto:any) {
                           self.AssignedIds.push(assignto.AssingedToUserId);
                        })
                        if (self.state.TeamConfig.TeamMemberUsers != undefined) {
                            self.state.TeamConfig.TeamMemberUsers.forEach(function (TeamMember:any) {
                               self.TeamMembersIds.push(TeamMember.AssingedToUserId);
                            })
                        }
                        let ClientCategoryIds:any = []
                        if (self.state.SelectedItem != undefined && self.state.SelectedItem.ClientCategory != undefined && self.state.SelectedItem.ClientCategory != undefined && self.state.SelectedItem.ClientCategory.length > 0) {
                            self.state.SelectedItem.ClientCategory.forEach(function (clientCategory:any) {
                                ClientCategoryIds.push(clientCategory.Id);
                            })
                        }
                        let AssignedToIds:any=[]
                        let TeamMembersIds:any=[]
                        
                        item.AssignedToUsers.forEach(function (user:any) {
                            AssignedToIds.push(user.AssingedToUserId);
                        });
                        /*
                        item.TeamMemberUsers.forEach(item.TeamMemberUsers, function (user:any) {
                            TeamMembersIds.push(user.AssingedToUserId);
                        });
                        */
                        let postdata:any = {                           
                            "Item_x0020_Type": item.MasterItemsType,
                            "ParentId": self.state.SelectedItem.Id,
                            "Title": item.Title,
                            "Portfolio_x0020_Type":self.Portfolio_x0020_Type,
                            "AdminStatus": item.AdminStatus,
                            AssignedToId: { "results": self.AssignedIds },
                            Team_x0020_MembersId: { "results":  self.TeamMembersIds },
                            "PortfolioLevel": item.NextLevel,
                            "PortfolioStructureID": item.PortfolioStructureIDs,
                            ClientCategoryId: { "results": ClientCategoryIds },
                            
                        }
                        if (self.state.SelectedItem.Sitestagging != undefined) {
                            let siteComposition = JSON.parse(self.state.SelectedItem.Sitestagging);
                            siteComposition.forEach(function (item:any) {
                                if (item.Date != undefined) {
                                    item.Date = '';
                                }
                            })
                            //postdata.Sitestagging = angular.toJson(siteComposition);
                            postdata.Sitestagging = JSON.stringify(siteComposition);
                        }
                        if (self.state.SelectedItem.SiteCompositionSettings != undefined) {
                            postdata.SiteCompositionSettings = self.state.SelectedItem.SiteCompositionSettings;
                        }
                        if (self.state.SelectedItem.TaskListId != undefined) {
                            postdata.TaskListId = self.state.SelectedItem.TaskListId;
                        }
                        if (self.state.SelectedItem.TaskListName != undefined) {
                            postdata.TaskListName = self.state.SelectedItem.TaskListName;
                        }
                        if (self.state.SelectedItem.WorkspaceType != undefined) {
                            postdata.WorkspaceType = self.state.SelectedItem.WorkspaceType;
                        }
                        if (self.state.SelectedItem.PermissionGroup != undefined && self.state.SelectedItem.PermissionGroup != undefined && self.state.SelectedItem.PermissionGroup.length > 0) {
                            let PermissionId:any = [];
                            self.state.SelectedItem.PermissionGroup.forEach(function (item:any) {
                                PermissionId.push(item.Id);
                            });
                            postdata.PermissionGroupId = { results: PermissionId };
                        }
                        if (item.Child.length > 0) {
                            postdata.Short_x0020_Description_x0020_On = item.Child[0].Short_x0020_Description_x0020_On;
                        }
                        if (self.state.SelectedItem.FolderId != undefined) {
                            postdata.FolderId = self.state.SelectedItem.FolderId;
                        }
                        if (self.state.SelectedItem.Component != undefined && self.state.SelectedItem.Component != undefined && self.state.SelectedItem.Component.length > 0) {
                            let ComponentId:any = [];
                            self.state.SelectedItem.Component.forEach(function (item:any) {
                                ComponentId.push(item.Id);
                            });
                            postdata.ComponentId = { 'results': ComponentId };
                        }
                        if (self.state.SelectedItem.Services != undefined && self.state.SelectedItem.Services != undefined && self.state.SelectedItem.Services.length > 0) {
                            let ServiceId:any = [];
                            self.state.SelectedItem.Services.forEach(function (item:any) {
                                ServiceId.push(item.Id);
                            });
                            postdata.ServicesId = { 'results': ServiceId };
                        }
                        if (self.state.SelectedItem.Events != undefined && self.state.SelectedItem.Events != undefined && self.state.SelectedItem.Events.length > 0) {
                            let EventId:any = [];
                            self.state.SelectedItem.Events.forEach(function (item:any) {
                                EventId.push(item.Id);
                            });
                            postdata.EventsId = { 'results': EventId };
                        }
                        
                        /*self.taskUser.forEach(function (Catdraft:any) {
                            if (_spPageContextInfo.userId == Catdraft.AssingedToUser.Id && Catdraft.DraftCategory != undefined && Catdraft.DraftCategory[0] != undefined && Catdraft.DraftCategory[0].IsDraft != undefined && Catdraft.DraftCategory[0].IsDraft == true) {
                                postdata.Categories = 'Draft';
                            }
                        })*/

                        let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
                        const i = await web.lists
                        .getById("ec34b38f-0669-480a-910c-f84e92e58adf")
                        .items
                        .add(postdata);                                    
                        console.log(i);
                        i.data['siteType'] = 'Master Tasks';
                        self.Count++;
                               self.CreatedItem.push(i);
                               /*
                                if (self.Count ==self.TotalCount) {
                                    if (Type == 'Create') {
                                        CallBackFunction(self.CreatedItem);
                                    } else if (Type == 'CreatePopup') {
                                       self.OpenEditPopup(self.CreatedItem[0]);
                                    }
                                }*/

                               
                        

                        
                    }
                    AddedCount += 1;
                    if (AddedCount == self.ChildItemTitle.length){
                        self.setState({isModalOpen: false });
                        self.props.Close();
                    }
                    
                });
            }

            
            
       
    }

    DDComponentCallBack = (dt:any) =>{
        this.setState({
          TeamConfig : dt
        },()=> console.log(this.state.TeamConfig))
      }

    addNewTextField = () =>{
        let ChildItem = this.state.ChildItemTitle;
        ChildItem.push({ 
            Title: '', 
            MasterItemsType: this.MasterItemsType, 
            AdminStatus: 'Not Started', 
            Child: [{ Short_x0020_Description_x0020_On: '' }], 
            Id: 0, 
            TeamMemberUsers: [], 
            AssignedToUsers: [], 
            ResponsibleTeam: [], 
            TeamMembersIds: [], 
            AssignedToIds: [], 
            ResponsibleTeamIds: [] 
        });

        this.setState({ChildItemTitle : ChildItem})

    }

    handleChildItemInput =(e:any, index:any)=>{    
        let ChildItemTitle = this.state.ChildItemTitle;
        ChildItemTitle[index].Title =  e.target.value;
        this.setState({ChildItemTitle})
       
    }
    handleTypeChange = (e:any, index:any)=>{
        let ChildItemTitle = this.state.ChildItemTitle;       
        ChildItemTitle[index].MasterItemsType = e.target.value;
        this.setState({ChildItemTitle})
        console.log(this.state.ChildItemTitle);
    }

    handleChildItemSD =(e:any, index:any)=>{    
        let ChildItemTitle = this.state.ChildItemTitle;
        ChildItemTitle[index].Child[0].Short_x0020_Description_x0020_On =  e.target.value;
        this.setState({ChildItemTitle});
        console.log(this.state.ChildItemTitle);
       
    }

    RemoveFeedbackColumn = (index:any, type:any) => {
        let ChildItemTitle = this.state.ChildItemTitle;
        if (type == 'Description') {           
            ChildItemTitle[index].Child.splice(0, 1);          
        } else {
            ChildItemTitle.splice(index, 1);
        }
        this.setState({ChildItemTitle});
        console.log(this.state.ChildItemTitle);
    }

    public render(): React.ReactElement<IStructureCreationProps> {
        return (
            <>
            {/*
        <button type="button" className="btn btn-primary" title="Add Structure" onClick={(e) => this.OpenModal(e)}>
        Add Structure
      </button>
        */}

        {this.state.OpenModal == 'Component' &&
        <div className="modal-dialog modal-md">
        <div className="modal-content">
            <div className="modal-header">
                <h3 className="modal-title"> Create Component
                    <span className="pull-right">
                        
                    </span>
                </h3>
                <button type="button" style={{minWidth:"10px"}} className="close" onClick={(e) => this.closeModal(e)}>
                    &times;
                </button>
            </div>
            <div className="modal-body bg-f5f5 clearfix">
                        <div className="form-group padLR">
                            <label className="col-sm-6 mb-5 mt-10 padL-0">Title</label>
                            <input className="form-control full_width" type="text" value={this.state.textTitle} onChange={(e) => this.handleInputChange(e)}
                                placeholder="Enter Component Title..." ng-required="true" />
                            <span className="searchclear" ng-show="ComponentTitle.length>0" style={{top:"39px"}}
                                ng-click="clearControl()">X</span>
                        </div>
                   {this.state.AllFilteredAvailableComoponent.length > 0 &&
                   <div className="divPanelBody fortablee col-sm-12 pad0 filtericonposfix"
                   ng-show="AllFilteredAvailableComoponent.length>0">
                   <div className="container pad0 section-event pt-0 mb-10">
                       <ul className="table">
                           <li className="for-lis">
                               <div style={{width: "1%"}}></div>
                               <div style={{width:"3%"}}>
                                   <div style={{width:"80%"}}></div>
                               </div>
                               <div style={{width:"60%"}}>
                                   <div style={{width:"100%"}} className="search colm-relative">
                                       <input type="search" id="searchTaskName" placeholder="Task Title"
                                           className="full_width searchbox_height"
                                           ng-model="category.searchTaskName" />
                                       <span className="searchclear" ng-show="category.searchTaskName.length>0"
                                           ng-click="clearSearchBox('category','searchTaskName')">X</span>
                                           <span className="sortingfilter">
                                               <span className="ml0">
                                                   <i className="fa fa-angle-up hreflink {{orderBy=='Title'&&!reverse?'siteColor':''}}"
                                                       ng-click="Sortby('Title', false)"></i>
                                               </span><span className="ml0">
                                                   <i className="fa fa-angle-down hreflink {{orderBy=='Title'&&reverse?'siteColor':''}}"
                                                       ng-click="Sortby('Title', true)"></i>
                                               </span>
                                           </span>
                                   </div>
                               </div>
                               <div style={{width:"15%"}}>
                                   <div style={{width:"65px"}} className="search colm-relative">

                                       <input type="search" id="searchPercentComplete" placeholder="%"
                                           className="full_width searchbox_height"
                                           ng-model="category.searchPercentCompletecreatecomponentclear" />
                                       <span className="searchclear"
                                           ng-show="category.searchPercentCompletecreatecomponentclear.length>0"
                                           ng-click="clearSearchBox('category','searchPercentCompletecreatecomponentclear')">X</span>
                                           <span className="sortingfilter">
                                               <span className="ml0">
                                                   <i className="fa fa-angle-up hreflink {{orderBy=='PercentComplete'&&!reverse?'siteColor':''}}"
                                                       ng-click="Sortby('PercentComplete', false)"></i>
                                               </span><span className="ml0">
                                                   <i className="fa fa-angle-down hreflink {{orderBy=='PercentComplete'&&reverse?'siteColor':''}}"
                                                       ng-click="Sortby('PercentComplete', true)"></i>
                                               </span>
                                           </span>
                                       
                                   </div>
                               </div>
                               <div style={{width:"15%"}}>
                                   <div style={{width:"65px"}} className="search colm-relative">

                                       <input type="search" id="searchPriority" placeholder="Priority"
                                           className="full_width searchbox_height"
                                           ng-model="category.searchPriority" />
                                       <span className="searchclear" ng-show="category.searchPriority.length>0"
                                           ng-click="clearSearchBox('category','searchPriority')">X</span>
                                           <span className="sortingfilter">
                                               <span className="ml0">
                                                   <i className="fa fa-angle-up hreflink {{orderBy=='Priority_x0020_Rank'&&!reverse?'siteColor':''}}"
                                                       ng-click="Sortby('Priority_x0020_Rank', false)"></i>
                                               </span><span className="ml0">
                                                   <i className="fa fa-angle-down hreflink {{orderBy=='Priority_x0020_Rank'&&reverse?'siteColor':''}}"
                                                       ng-click="Sortby('Priority_x0020_Rank', true)"></i>
                                               </span>
                                           </span>
                                       

                                   </div>
                               </div>
                               <div style={{width:"4%"}}>
                                   <div style={{width:"81px"}} className="search">
                                   </div>
                               </div>
                           </li>
                           <div className="container-new">
                               <li className="itemRow for-lis tdrows"
                                   ng-repeat="item in filtered = (AllFilteredAvailableComoponent|orderBy:orderBy:reverse | filter:{Title:category.searchTaskName,PercentComplete:category.searchPercentCompletecreatecomponentclear,Priority_x0020_Rank:category.searchPriority})">
                                   <div style={{width: "1%"}}></div>
                                   <div style={{width:"3%"}} className="padLR">
                                       <img 
                                           className="icon-sites-img ml-8"
                                           src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/component_icon.png" />
                                       
                                   </div>

                                   <div style={{width:"65%"}} className="padLR" ng-click="assignTitle(item.newTitle)">
                                       
                                   </div>
                                   <div style={{width:"15%"}} className="padLR" ng-click="assignTitle(item.newTitle)">
                                       
                                   </div>
                                   <div style={{width:"15%"}} className="padLR" ng-click="assignTitle(item.newTitle)">
                                       
                                   </div>
                                   <div className="icontype display_hide" style={{width:"4%"}}>
                                       
                                   </div>
                                   <div className="icontype display_hide" style={{width:"2%"}}
                                       ng-show="item.WebpartItemId!=undefined && isOwner==true">
                                       <a ng-show="item.siteType =='Master Tasks'"
                                           title="{{item.newTitle}} Description" className="hreflink"
                                           target="_blank"
                                           href="https://www.hochhuth-consulting.de/SitePages/PortfolioDescriptionForm.aspx?taskId={{item.WebpartItemId}}">
                                           <img className="wid22"
                                               src="https://www.hochhuth-consulting.de/SiteCollectionImages/ICONS/32/help_Icon.png" />
                                       </a>
                                   </div>
                               </li>
                           </div>
                       </ul>

                   </div>
               </div>
                   }
                    
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-primary"  onClick={()=>this.CreateFolder('CreatePopup')}
                    ng-disabled="ComponentTitle==undefined ">
                    Create & Open Popup
                </button>
                <button type="button" className="btn btn-primary" onClick={()=>this.CreateFolder('Create')}
                    ng-disabled="ComponentTitle==undefined ">
                    Create
                </button>

            </div>

        </div>
    </div>
        }
    
        
        {this.state.OpenModal == 'SubComponent' && this.state.SelectedItem != undefined &&
        
         <div className="modal-dialog modal-lg" style={{width:"900px"}}>
             <div className="modal-content">
                 <div className="modal-header">
                     <h3 className="modal-title">
                         <a className="hreflink" target="_blank">
                            <img className="icon-sites-img ng-scope" 
                            src={this.state.SelectedItem.Item_x0020_Type =='SubComponent' ? 
                            "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/SubComponent_icon.png" :
                            "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/component_icon.png" }/>
                            {this.state.SelectedItem.Title} </a>- Create Child Item
                         <span className="pull-right">
                             
                         </span>
                     </h3>
                     <button type="button" style={{minWidth:"10px"}} className="close" onClick={(e) => this.closeModal(e)}>
                     x
                     </button>
                 </div>
                 <div className="modal-body bg-f5f5 clearfix">
                 {this.state.ChildItemTitle != undefined && this.state.ChildItemTitle.length > 0 &&
                 this.state.ChildItemTitle.map((item: any, index: number) => {
                    return <>
                             <div className="col-sm-12 pad0" ng-repeat-start="item in ChildItemTitle">
                                 <label className="col-sm-5 mb-5 mt-10  titleclrgreen col-sm-offset-1 padL-0">Title</label>

                                 {this.state.SelectedItem.Item_x0020_Type == 'Component' &&
                                    <>
                                         <label> 
                                        <input
                                          type="radio"
                                          value="SubComponent"
                                          checked={item.MasterItemsType === 'SubComponent'}
                                          onChange={(e)=>this.handleTypeChange(e, index)}
                                        />SubComponent
                                      </label>
                                      <label> 
                                        <input
                                          type="radio"
                                          value="Feature"
                                          checked={item.MasterItemsType === 'Feature'}
                                          onChange={(e)=>this.handleTypeChange(e, index)}
                                        />Feature
                                      </label>
                                      </>
                                }
                                 <div className="col-sm-12 padL-0">
                        <div className="col-sm-1 PadR0 mtop5">
                            <img 
                                className="icon-sites-img"
                                src={item.MasterItemsType=='SubComponent' ? 
                                    "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/SubComponent_icon.png" :
                                    "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/feature_icon.png" }/>
                            
                        </div>
                        <div className="col-sm-11 pad0">
                            <input className="form-control full_width mb-10" type="text" value={this.state.ChildItemTitle[index].Title} onChange={(e) => this.handleChildItemInput(e,index)}
                                placeholder="Enter Child Item Title" ng-required="true" />
                        </div>
                        {index != 0 &&
                        <div className="col-sm-1 padL-0">
                            <a ng-show="ChildItemTitle.length>1 && $index!=0 " style={{cursor:"pointer"}}
                                title="Delete" data-toggle="modal"
                                onClick={()=>this.RemoveFeedbackColumn(index,'')}>
                                <img className="" src="/_layouts/images/delete.gif" />
                            </a>
                        </div>
                        }
                        <div className="clearfix">
                        </div>
                                </div>
                                <div className="col-sm-12 mb-20 pad0">
                                    {item.Child.length > 0 && 
                                    <div className="col-sm-12 padL-0" ng-repeat="items in item.Child">
                                    <label className="col-sm-12 mb-5  titleclrgreen padL-0">Short
                                        Description</label>
                                    <div className="col-sm-12  pad0">
                                        <textarea rows={4}
                                            value={this.state.ChildItemTitle[index].Child[0].Short_x0020_Description_x0020_On} onChange={(e) => this.handleChildItemSD(e,index)}></textarea>
                                    </div>
                                    <div className="col-sm-1 padL-0">
                                        <a ng-show="$index==0" style={{cursor:"pointer"}} title="Delete"
                                            data-toggle="modal"
                                            onClick={()=>this.RemoveFeedbackColumn(index,'Description')}>
                                            <img className="" src="/_layouts/images/delete.gif" />
                                        </a>
                                    </div>
                                    <div className="clearfix">
                                    </div>
                                </div>
                                    }
                        
                        {index == 0 &&
                        <div ng-show="$index==0" className="col-sm-12  padL-0 mt-10">
                            <TeamConfigurationCard ItemInfo={this.state.SelectedItem} parentCallback={this.DDComponentCallBack} />
                            <div className="clearfix">
                            </div>
                        </div>
                        }
                    </div>
                             </div>
                             </>
                })}
                             <div ng-repeat-end></div>
                             <div className="clearfix">
                             </div>
                 </div>
                 <div className="modal-footer">
                     <a className="hreflink pull-left" onClick={()=>this.addNewTextField()} ng-click="addNewTextField()">
                         <img className="icon-sites-img" ng-show="Portfolio_x0020_Type=='Component'"
                             src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/Add-New.png" />
                         Add more child items
                     </a>
                     
                     {this.state.ChildItemTitle.length == 1 && 
                        <button type="button" className="btn btn-primary" ng-click="createChildItems('CreatePopup');">
                        Create & Open Popup
                        </button>
                     }
                     
                     <button type="button" className="btn btn-primary" onClick={()=>this.createChildItems('Create')} ng-click="createChildItems('Create');" >
                         Create
                     </button>
                     
                 </div>
             </div>
         </div>
     
        }
     
     

      </>
    );
      }
}

export default PortfolioStructureCreationCard;