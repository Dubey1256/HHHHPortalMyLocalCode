import * as React from 'react';
import { 
  Container, 
  Row, 
  Tab, Tabs 
} from "react-bootstrap";
import { IManageSmartMetadataProps } from './IManageSmartMetadataProps';

import App from "./Dev/main";
import { IManageSmartMetadataState } from './IManageSmartMetadataState';
import spservices from '../../../spservices/spservices';
import TableSmartmetadata from './TableSmartMetadata/TableSmartMetadata';
import ModalAddSmartMetadata from './ModalAddSmartMetadata/ModalAddSmartMetadata';
import ModalEditSmartMetadata from './ModalEditSmartMetadata/ModalEditSmartMetadata';
import { ISmartMetadataItem } from './ISmartMetadataItem';
import ModalCompareSmartMetadata from './ModalCompareSmartMetadata/ModalCompareSmartMetadata';
import ModalRestructureSmartMetadata from './ModalRestructureSmartMetadata/ModalRestructureSmartMetadata';
import ModalDeleteSmartMetadata from './ModalDeleteSmartMetadata/ModalDeleteSmartMetadata';
import { INewSmartMetadataItem } from './ModalAddSmartMetadata/IModalAddSmartMetadataState';
import { IUploadedImage } from './ModalEditSmartMetadata/IModalEditSmartMetadataState';
import ITask from './TableTasks/ITask';
//import ITaskItem from './ITaskItem';

const SITE_CONFIGURATION = [{ "Title": "EI", "Item_x005F_x0020_Cover": "/SiteCollectionImages/ICONS/Shareweb/site_ei.png", "listId": "0AA078EB-663D-47B5-8CD9-C0B331D16144", "siteName": "EI", "siteUrl": "/sp", "metaData": "EIListItem" }, { "Title": "EPS", "Item_x005F_x0020_Cover": "/SiteCollectionImages/ICONS/Shareweb/site_eps.png", "listId": "10FF1F9E-69A1-4EF3-ABB2-F5756C619040", "siteName": "EPS", "siteUrl": "/sp", "metaData": "EPSListItem" }, { "Title": "Education", "Item_x005F_x0020_Cover": "/SiteCollectionImages/ICONS/Shareweb/site_education.png", "listId": "DE2A8925-D935-4121-AF8E-F84F5B904BCA", "siteName": "Education", "siteUrl": "/sp", "metaData": "EducationListItem" }, { "Title": "DRR", "Item_x005F_x0020_Cover": "/SiteCollectionImages/ICONS/Shareweb/site_drr.png", "listId": "1E789EA9-C8FD-42F6-BB0C-F51BA9FBA231", "siteName": "DRR", "siteUrl": "/sp", "metaData": "DRRListItem" }, { "Title": "Gender", "Item_x005F_x0020_Cover": "/SiteCollectionImages/ICONS/Shareweb/site_gender.png", "listId": "E1AB29D6-A791-4F4A-860D-BB7D40CD1D20", "siteName": "Gender", "siteUrl": "/sp", "metaData": "GenderListItem" }, { "Title": "Health", "Item_x005F_x0020_Cover": "/SiteCollectionImages/ICONS/Shareweb/site_health.png", "listId": "01447258-D442-4517-9303-5D66F5C424DB", "siteName": "Health", "siteUrl": "/sp", "metaData": "HealthListItem" }, { "Title": "QA", "Item_x005F_x0020_Cover": "/SiteCollectionImages/ICONS/Shareweb/site_qa.png", "listId": "5D62DFE2-85D5-43C4-8149-FDEE11414182", "siteName": "QA", "siteUrl": "/sp", "metaData": "QAListItem" }, { "Title": "Shareweb", "Item_x005F_x0020_Cover": "/SiteCollectionImages/ICONS/Shareweb/site_shareweb.png", "listId": "534D83CD-A976-4A38-A1C7-5475427F9A5D", "siteName": "Shareweb", "siteUrl": "/sp", "metaData": "SharewebListItem" }, { "Title": "HHHH", "Item_x005F_x0020_Cover": "/SiteCollectionImages/ICONS/Foundation/icon_hhhh.png", "listId": "5383242E-6E6D-4B8F-93BE-251B106FD52D", "siteName": "HHHH", "siteUrl": "/sp", "metaData": "HHHHListItem" }, { "Title": "DE", "Item_x005F_x0020_Cover": "/SiteCollectionImages/ICONS/Shareweb/site_de.png", "listId": "AD274EA8-C159-449B-A1F9-3C524A7F3395", "siteName": "DE", "siteUrl": "/sp", "metaData": "DEListItem" }, { "Title": "Small Projects", "Item_x005F_x0020_Cover": "/SiteCollectionImages/ICONS/Shareweb/small_project.png", "listId": "2CE075BA-D1A7-4B5C-920C-A43A8295E748", "siteName": "Small Projects", "siteUrl": "/sp", "metaData": "Small_x0020_ProjectsListItem" }];
console.log(SITE_CONFIGURATION);

export default class ManageSmartMetadata extends React.Component<IManageSmartMetadataProps, IManageSmartMetadataState> {

  private spservice: spservices = new spservices();
  private smartMetadadaListId: string;
  private siteConfigurationsListId: string;

  constructor(props: IManageSmartMetadataProps) {

    super(props);  

    this.smartMetadadaListId = this.props.smartMetadadaListId || "01A34938-8C7E-4EA6-A003-CEE649E8C67A";
    this.siteConfigurationsListId = this.props.siteConfigurationsListId || "25BCD32B-D222-488D-BF32-6D7C0CA72237";

    this.state = {
      tabs: [],
      selTabKey: "",
      sMetadataItems: [],
      sMetadataItemsDisplay: [],
      showAddSmartMetadata: false,
      showEditSmartMetadata: false,
      showCompareSmartMetadata: false,
      showRestructureSmartMetadata: false,
      showDeleteSmartMetadata: false,
      selectedRows: [],
      sMetadataItemOneTasks: [],
      sMetadataItemTwoTasks: [],
      sMetadataItemEditParents: [],
      sMetadataItemEditTasks: []
    };    
    
    this._onTabSelected = this._onTabSelected.bind(this);
    this.getChildItems = this.getChildItems.bind(this);
    this.getTasks = this.getTasks.bind(this);
    this.getSharedWebId = this.getSharedWebId.bind(this);
    this.getRootLevelItems = this.getRootLevelItems.bind(this);

    this.showModalAddSmartMetadata = this.showModalAddSmartMetadata.bind(this);
    this.hideModalAddSmartMetadata = this.hideModalAddSmartMetadata.bind(this);

    this.showModalEditSmartMetadata = this.showModalEditSmartMetadata.bind(this);
    this.hideModalEditSmartMetadata = this.hideModalEditSmartMetadata.bind(this);

    this.showModalCompareSmartMetadata = this.showModalCompareSmartMetadata.bind(this);
    this.hideModalCompareSmartMetadata = this.hideModalCompareSmartMetadata.bind(this);

    this.showModalRestructureSmartMetadata = this.showModalRestructureSmartMetadata.bind(this);
    this.hideModalRestructureSmartMetadata = this.hideModalRestructureSmartMetadata.bind(this);

    this.showModalDeleteSmartMetadata = this.showModalDeleteSmartMetadata.bind(this);
    this.hideModalDeleteSmartMetadata = this.hideModalDeleteSmartMetadata.bind(this);

    this.deleteSmartMetadataItem = this.deleteSmartMetadataItem.bind(this);
    this.createSmartMetadataItem = this.createSmartMetadataItem.bind(this);
    this.updateSmartMetadataItem = this.updateSmartMetadataItem.bind(this);
    this.compareAndUpdateSmartMetadata = this.compareAndUpdateSmartMetadata.bind(this);
    this.restructureAndUpdateSmartMetadata = this.restructureAndUpdateSmartMetadata.bind(this);
    this.deleteSmartMetadata = this.deleteSmartMetadata.bind(this);
    this.removeTaskCategories = this.removeTaskCategories.bind(this);

    this.uploadImage = this.uploadImage.bind(this);

  }

  componentDidMount(): void {
    this.loadConfigurations();
  }

  private async loadConfigurations() {
    let _tabs = await this.getTabs();
    const _sMetadataItems = await this.getSmartMetadata();
    _tabs = _tabs.map(tab=>({
        ...tab,
        ...{ Items: _sMetadataItems.filter(sMetadataItem=>sMetadataItem.TaxType==tab.Title) }
    }));
    const selTabName: string = this.state.selTabKey || "Categories";

    this.setState({
        selTabKey: selTabName,
        tabs: _tabs,
        sMetadataItems: _sMetadataItems
    }, ()=>this._onTabSelected(selTabName));
    
  }

  private async getTabs() {

    let tabItems: any[] = [];

    const QueryTabs = {
        Select: "ID,Title,OrderBy,WebpartId,DisplayColumns,Columns,QueryType,FilterItems",
        Expand: "",
        Filter: "WebpartId eq 'AllManageSmartMetadataPortfolioTabs'",
        Top: 4999,
        OrderBy: ""
    };

    const resTabs = await this.spservice.getListItems(this.siteConfigurationsListId,QueryTabs.Select,QueryTabs.Expand,QueryTabs.Filter,QueryTabs.OrderBy,QueryTabs.Top);
    
    if(resTabs.length>0) {
        const jsonDisplayColumns = resTabs[0].DisplayColumns;
        tabItems = JSON.parse(jsonDisplayColumns);
    }
    
    return tabItems;
  }

  private getChildItems: any = (items: any[], ParentID = 0) =>
    items.filter(item => item.ParentID == ParentID).map(child => {            
      return { 
        ...child,
        subRows: this.getChildItems(items, child.ID) 
      }
  }); 

  private async getSmartMetadata() {

    let _sMetadataItemsTree: any[] = [];

    const QuerySmartMetadata = {
        Select: "*,Author/Title,Editor/Title,Parent/Id,Parent/Title",
        Expand: "Parent,Author,Editor",
        Filter: "isDeleted ne 1",
        OrderBy: "SortOrder",
        Top: 4999           
    };

    const resSmartMetadataItems = await this.spservice.getListItems(this.smartMetadadaListId, QuerySmartMetadata.Select, QuerySmartMetadata.Expand, QuerySmartMetadata.Filter, QuerySmartMetadata.OrderBy, QuerySmartMetadata.Top);
    if(resSmartMetadataItems.length>0) {        
        let _sMetadataItems = resSmartMetadataItems.map(({Title,AlternativeTitle,LongTitle,Parent,ParentID,Description1,SmartFilters,TaxType,SortOrder,Status,ID,IsVisible,SmartSuggestions,Selectable,ItemRank,siteName,Item_x005F_x0020_Cover})=>({Title,AlternativeTitle,LongTitle,Parent,ParentID,Description1,SmartFilters,TaxType,SortOrder,Status,ID,IsVisible,SmartSuggestions,Selectable,ItemRank,siteName,Item_x005F_x0020_Cover,subRows: []}));        
        _sMetadataItems = _sMetadataItems.map(_sMetadataItem => {
          return {..._sMetadataItem}
        });
        _sMetadataItemsTree = this.getChildItems(_sMetadataItems,0);          
    }
    return _sMetadataItemsTree;
  }
 
  private _onTabSelected(key: string) {
    const selTab = [...this.state.tabs].filter(tab=>tab.Title==key)[0];
    this.setState({
        selTabKey: key,
        sMetadataItemsDisplay: selTab.Items
    });
  }

  private async getTasks(sMetadataItem: ISmartMetadataItem) {
    const sMetadataTitle: string = sMetadataItem.Title;
    const taskListsInfo: any[] = [];
    let _TaskItems: any[] = [];
    const qFilterTask: string = `TaskCategories/Title eq '${sMetadataTitle}'`;
    SITE_CONFIGURATION.forEach(siteInfo=>{
      const siteTitle: string = siteInfo.Title;
      let qSelectTask: string = "ParentTask/Title,ParentTask/Id,Services/Title,ClientTime,Services/Id,Events/Id,Events/Title,ItemRank,Portfolio_x0020_Type,SiteCompositionSettings,TaskLevel,TaskLevel,TimeSpent,BasicImageInfo,OffshoreComments,OffshoreImageUrl,CompletedDate,TaskID,ResponsibleTeam/Id,ResponsibleTeam/Title,TaskCategories/Id,TaskCategories/Title,ParentTask/TaskID,TaskType/Id,TaskType/Title,TaskType/Level,PriorityRank,Reference_x0020_Item_x0020_Json,TeamMembers/Title,TeamMembers/Name,Component/Id,Component/Title,Component/ItemType,TeamMembers/Id,Item_x002d_Image,ComponentLink,IsTodaysTask,AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,ClientCategory/Id,ClientCategory/Title,FileLeafRef,FeedBack,Title,Id,PercentComplete,Company,StartDate,DueDate,Comments,Categories,Status,WebpartId,Body,Mileage,PercentComplete,ClientCategory,Priority,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title";
      let qExpandTask: string = "ParentTask,Events,Services,TaskType,AssignedTo,Component,ClientCategory,Author,Editor,TeamMembers,ResponsibleTeam,TaskCategories";
      if(siteTitle=="Master Tasks") {
        qSelectTask = "ComponentCategory/Id,ComponentCategory/Title,Services/Title,Services/Id,Events/Id,Events/Title,SiteCompositionSettings,ShortDescriptionVerified,Portfolio_x0020_Type,BackgroundVerified,descriptionVerified,Synonyms,BasicImageInfo,OffshoreComments,OffshoreImageUrl,HelpInformationVerified,IdeaVerified,TechnicalExplanationsVerified,Deliverables,DeliverablesVerified,ValueAddedVerified,CompletedDate,TaskType/Id,TaskType/Title,TaskType/Level,Idea,ValueAdded,TechnicalExplanations,Item_x0020_Type,Sitestagging,Package,Parent/Id,Parent/Title,Short_x0020_Description_x0020_On,Short_x0020_Description_x0020__x,Short_x0020_description_x0020__x0,AdminNotes,AdminStatus,Background,Help_x0020_Information,SharewebComponent/Id,TaskCategories/Id,TaskCategories/Title,PriorityRank,Reference_x0020_Item_x0020_Json,TeamMembers/Title,TeamMembers/Name,Component/Id,Component/Title,Component/ItemType,TeamMembers/Id,Item_x002d_Image,ComponentLink,IsTodaysTask,AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,AttachmentFiles/FileName,FileLeafRef,FeedBack,Title,Id,PercentComplete,Company,StartDate,DueDate,Comments,Categories,Status,WebpartId,Body,Mileage,PercentComplete,Attachments,Priority,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title";
        qExpandTask = "TaskType,ComponentCategory,AssignedTo,Component,Events,Services,AttachmentFiles,Author,Editor,TeamMembers,SharewebComponent,TaskCategories,Parent";
      }
      const qStrings = {
        Select: qSelectTask,
        Expand: qExpandTask,
        Filter: qFilterTask,
        Top: 4999
      };
      taskListsInfo.push({
        ListTitle: siteTitle,
        QueryStrings: qStrings
      })

    });
    _TaskItems = await this.spservice.getListItemsInBatch(taskListsInfo);
    _TaskItems = _TaskItems.map(taskItem => {
      return {...taskItem, Site: this.getSharedWebId(taskItem)}
    });

    return _TaskItems;
  }

  private getSharedWebId(taskItem: ITask) {

    let _sharedWebId: string;
    
    const taskItemId: number = taskItem.ID;
    const taskType: string = taskItem.TaskType ? taskItem.TaskType.Title : null;
    const taskLevelOneNum: string = taskItem.TaskLevel;
    const taskLevelTwoNum: string = taskItem.TaskLevel;
    const isComponent: boolean = taskItem.ComponentId && taskItem.ComponentId.results.length>0;
    const isEvent: boolean = taskItem.EventsId && taskItem.EventsId.results.length>0;
    const isService: boolean = taskItem.ServicesId && taskItem.ServicesId.results.length>0;

    if(!taskType) {
      _sharedWebId = `T${taskItemId}`;
    }
    else {
      if(taskLevelOneNum != undefined && taskLevelTwoNum != undefined) {
        if(taskType=="Workstream") {
          if(isComponent==false && isEvent==false && isService==false) {
            _sharedWebId = `A${taskLevelOneNum}-W${taskLevelTwoNum}`;
          }
          else if(isComponent) {
            _sharedWebId = `CA${taskLevelOneNum}-CW${taskLevelTwoNum}`;
          }
          else if(isService) {
            _sharedWebId = `SA${taskLevelOneNum}-SW${taskLevelTwoNum}`;
          }
          else if(isEvent) {
            _sharedWebId = `EA${taskLevelOneNum}-EW${taskLevelTwoNum}`;
          }
        }
        else if(taskType=="Task") {
          if(isComponent==false && isEvent==false && isService==false) {
            _sharedWebId = `A${taskLevelOneNum}-W${taskLevelTwoNum}-T${taskItemId}`;
          }
          else if(isComponent) {
            _sharedWebId = `CA${taskLevelOneNum}-CW${taskLevelTwoNum}-T${taskItemId}`;
          }
          else if(isService) {
            _sharedWebId = `SA${taskLevelOneNum}-SW${taskLevelTwoNum}-T${taskItemId}`;
          }
          else if(isEvent) {
            _sharedWebId = `EA${taskLevelOneNum}-EW${taskLevelTwoNum}-T${taskItemId}`;
          }
        }
        else if(taskType=="Step") {
          _sharedWebId = `P${taskLevelOneNum}-S${taskLevelTwoNum}`;
        }
        else if(taskType=="MileStone") {
          _sharedWebId = `P${taskLevelOneNum}-S${taskLevelTwoNum}-M${taskItemId}`;
        }
      }
      else if(taskLevelOneNum != undefined) {
        if(taskType=="Activities") {
          if(isComponent==false && isEvent==false && isService==false) {
            _sharedWebId = `A${taskLevelOneNum}`;
          }
          else if(isComponent) {
            _sharedWebId = `CA${taskLevelOneNum}`;
          }
          else if(isService) {
            _sharedWebId = `SA${taskLevelOneNum}`;
          }
          else if(isEvent) {
            _sharedWebId = `EA${taskLevelOneNum}`;
          }
        }
        else if(taskType=="Task") {
          if(isComponent==false && isEvent==false && isService==false) {
            _sharedWebId = `A${taskLevelOneNum}-T${taskItemId}`;
          }
          else if(isComponent) {
            _sharedWebId = `CA${taskLevelOneNum}-T${taskItemId}`;
          }
          else if(isService) {
            _sharedWebId = `SA${taskLevelOneNum}-T${taskItemId}`;
          }
          else if(isEvent) {
            _sharedWebId = `EA${taskLevelOneNum}-T${taskItemId}`;
          }
        }
        else if(taskType=="Project") {
          _sharedWebId = `P${taskLevelOneNum}`;
        }
        else if(taskType=="MileStone") {
          _sharedWebId = `P${taskLevelOneNum}-M${taskItemId}`;
        }
      }
      else {
        if(taskType=="Task") {
          _sharedWebId = `T${taskItemId}`;
        }
        else if(taskType=="MileStone") {
          _sharedWebId = `M${taskItemId}`;
        }
      }
    }

    return _sharedWebId;

  }

  private getRootLevelItems() {

  }

  public render(): React.ReactElement<IManageSmartMetadataProps> {

    const elemTableSmartMetadata = (
      this.state.sMetadataItemsDisplay.length>0 && 
      <TableSmartmetadata 
        Items = {this.state.sMetadataItemsDisplay} 
        ShowModalAddSmartMetadata = {this.showModalAddSmartMetadata}
        ShowModalEditSmartMetadata = {this.showModalEditSmartMetadata}
        ShowModalCompareSmartMetadata = {this.showModalCompareSmartMetadata}
        ShowModalRestructureSmartMetadata = {this.showModalRestructureSmartMetadata}
        ShowModalDeleteSmartMetadata = {this.showModalDeleteSmartMetadata}
      />
    );

    const elemTabsSmartMetadata: JSX.Element = (
      <Tabs activeKey={this.state.selTabKey} onSelect={this._onTabSelected}>
      { 
          this.state.tabs.map(tab => <Tab title={tab.Title} eventKey={tab.Title}></Tab>)
      }
      </Tabs>
    );

    const elemModalAddSmartMetadata: JSX.Element = (
      <ModalAddSmartMetadata
        showAddSmartMetadata = {this.state.showAddSmartMetadata}
        parentItem = {this.state.selectedRows.length>0?this.state.selectedRows[0]:undefined} 
        hideModalAddSmartMetadata = {this.hideModalAddSmartMetadata}
        createSmartMetadata={this.createSmartMetadataItem} 
      />
    );

    const elemModalEditSmartMetadata: JSX.Element = (
      this.state.sMetadataItemEdit && 
      <ModalEditSmartMetadata 
        showEditSmartMetadata = {this.state.showEditSmartMetadata}
        sMetadataItem = {this.state.sMetadataItemEdit}
        sMetadataItemParents = {this.state.sMetadataItemEditParents}
        sMetadataItemTasks={this.state.sMetadataItemEditTasks}
        sMetadataRootLevelItems = {this.state.sMetadataItemsDisplay}
        hideModalEditSmartMetadata = {this.hideModalEditSmartMetadata}
        updateSmartMetadata = {this.updateSmartMetadataItem}
        uploadImage = {this.uploadImage}
        removeTaskCategories = {this.removeTaskCategories}                
      />
    );

    const elemModalManageSmartMetadata: JSX.Element = (
      this.state.showCompareSmartMetadata &&
      <ModalCompareSmartMetadata 
        showCompareSmartMetadata = {this.state.showCompareSmartMetadata}
        sMetadataItemOne = {this.state.selectedRows[1]}
        sMetadataItemOneTasks = { this.state.sMetadataItemOneTasks }
        sMetadataItemTwo = {this.state.selectedRows[0]}
        sMetadataItemTwoTasks = {this.state.sMetadataItemTwoTasks} 
        hideModalCompareSmartMetadata = {this.hideModalCompareSmartMetadata}
        compareAndUpdateSmartMetadata = {this.compareAndUpdateSmartMetadata}     
      />
    );

    const elemModalRestructureSmartMetadata: JSX.Element = (
      this.state.showRestructureSmartMetadata &&
      <ModalRestructureSmartMetadata
        showRestructureSmartMetadata = {this.state.showRestructureSmartMetadata} 
        restructureItem = {this.state.sMetadataItemRestructure} 
        selSMetadataItems = {this.state.selectedRows}
        hideModalRestructureSmartMetadata = {this.hideModalRestructureSmartMetadata}
        restructureAndUpdateSmartMetadata = {this.restructureAndUpdateSmartMetadata} 
      />
    );

    const elemModalDeleteSmartMetadata: JSX.Element = (
      this.state.showDeleteSmartMetadata &&
      <ModalDeleteSmartMetadata 
        showDeleteSmartMetadata = {this.state.showDeleteSmartMetadata}
        deleteSMetaDataItem = {this.state.sMetadataItemDelete}
        deleteSMetaDataParentItems = {this.state.sMetadataItemDeleteParents}
        hideModalDeleteSmartMetadata = {this.hideModalDeleteSmartMetadata}
        showModalEditSmartMetadata = {this.showModalEditSmartMetadata}
        showModalDeleteSmartMetadata = {this.showModalDeleteSmartMetadata}
        deleteSmartMetadata = {this.deleteSmartMetadata}
        deleteAndArchiveSmartMetadata = {this.deleteAndArchiveSmartMetadata}
      />
    );

    return (
      <div>
        <Container>
          <Row className='matadatatab'>{elemTabsSmartMetadata}</Row>
          <div>{elemTableSmartMetadata}</div>
        </Container>
        {
          elemModalAddSmartMetadata
        }
        {
          elemModalEditSmartMetadata
        }
        {
          elemModalManageSmartMetadata
        }
        {
          elemModalRestructureSmartMetadata
        }
        {
          elemModalDeleteSmartMetadata
        }
      </div>      
    );

    return <App />;

  }

  public showModalAddSmartMetadata(selectedRows: ISmartMetadataItem[]) {
    this.setState({
      showAddSmartMetadata: true,
      selectedRows: selectedRows
    });
  }

  public hideModalAddSmartMetadata() {
    this.setState({
      showAddSmartMetadata: false
    });
  }

  public async showModalEditSmartMetadata(editItem: ISmartMetadataItem, parentItems: ISmartMetadataItem[]) {
    const sMetadataItemTasks: ITask[] = await this.getTasks(editItem);

    this.setState({
      showEditSmartMetadata: true,
      sMetadataItemEdit: editItem,
      sMetadataItemEditParents: parentItems,
      sMetadataItemEditTasks: sMetadataItemTasks
    });
  }
  
  public hideModalEditSmartMetadata() {
    
    this.setState({
      showEditSmartMetadata: false,
      sMetadataItemEdit: null
    });
  }

  public async showModalCompareSmartMetadata(selectedRows: ISmartMetadataItem[]) {
    const sMetadataItemOneTasks: any[] = await this.getTasks(selectedRows[0]);
    const sMetadataItemTwoTasks: any[] = await this.getTasks(selectedRows[1]);
    this.setState({
      showCompareSmartMetadata: true,
      selectedRows: selectedRows,
      sMetadataItemOneTasks: sMetadataItemOneTasks,
      sMetadataItemTwoTasks: sMetadataItemTwoTasks
    });
  }

  public hideModalCompareSmartMetadata() {
    this.setState({
      showCompareSmartMetadata: false
    });
  }

  public showModalRestructureSmartMetadata(restructureItem: ISmartMetadataItem, selectedRows: ISmartMetadataItem[]) {
    this.setState({
      showRestructureSmartMetadata: true,
      sMetadataItemRestructure: restructureItem,
      selectedRows: selectedRows
    });
  }

  public hideModalRestructureSmartMetadata() {
    this.setState({
      showRestructureSmartMetadata: false,
      sMetadataItemRestructure: null
    });
  }

  public showModalDeleteSmartMetadata(delItem: ISmartMetadataItem, parentItems: ISmartMetadataItem[]) {
    this.setState({
      showDeleteSmartMetadata: true,
      sMetadataItemDelete: delItem,
      sMetadataItemDeleteParents: parentItems
    });
  }

  public hideModalDeleteSmartMetadata() {
    this.setState({
      showDeleteSmartMetadata: false,
      sMetadataItemDelete: null
    });
  }

  public async createSmartMetadataItem(createSMItems: INewSmartMetadataItem | INewSmartMetadataItem[], parentItemId: number, showEditPopup: boolean) {
    let createItem: ISmartMetadataItem = {
      Title: ""
    };
    let createItemRes: ISmartMetadataItem = null;
    if(parentItemId) {
      (createSMItems as INewSmartMetadataItem[]).forEach(async createSMItem => {
        createItem.Title = createSMItem.Title;
        createItem.Description1 = createSMItem.Description;
        createItem.TaxType = this.state.selTabKey;
        createItem.ParentID = parentItemId;

        createItemRes = await this.spservice.createListItem(this.smartMetadadaListId, createItem);
      });
    }
    else {
      const createSMItem = createSMItems as INewSmartMetadataItem;
      createItem.Title = createSMItem.Title;
      createItem.Description1 = createSMItem.Description;
      createItem.TaxType = this.state.selTabKey;
      createItem.ParentID = 0;

      createItemRes = await this.spservice.createListItem(this.smartMetadadaListId, createItem);
    }

    this.hideModalAddSmartMetadata();
    await this.loadConfigurations();
    
    if(showEditPopup) {
      this.setState({
        showEditSmartMetadata: true,
        sMetadataItemEdit: createItemRes,
        sMetadataItemEditTasks: []
      });
    }

  }

  public async updateSmartMetadataItem(updateSMItem: ISmartMetadataItem, updateSMItemId: number) {
      const updateItemRes = await this.spservice.updateListItem(this.smartMetadadaListId, updateSMItemId, updateSMItem);
      console.log(updateItemRes);
      this.hideModalEditSmartMetadata();
      await this.loadConfigurations();
  }

  public async deleteSmartMetadataItem(sMetadataItemId: number) {
    const deleteItemRes = await this.spservice.deleteListItem(this.smartMetadadaListId, sMetadataItemId);
    console.log(deleteItemRes);
    this.hideModalDeleteSmartMetadata();
  }

  public async compareAndUpdateSmartMetadata(updateType: string, compareItemOneId: number, compareItemTwoId: number, compareItemOne?: ISmartMetadataItem, compareItemTwo?: ISmartMetadataItem, compareItemOneChildItems?: ISmartMetadataItem[], compareItemTwoChildItems?: ISmartMetadataItem[], itemOneTasks?: any[], itemTwoTasks?: any[]) {
    const compareItemOneChild: ISmartMetadataItem = {
      ParentId: compareItemOneId,
      ParentID: compareItemOneId
    };
    const compareItemTwoChild: ISmartMetadataItem = {
      ParentId: compareItemOneId,
      ParentID: compareItemOneId
    };
    let taskListId: string;
    let taskItemId: number;
    const compareItemOneTask = {
      SharewebCategoriesId: [compareItemOneId]
    };
    const compareItemTwoTask = {
      SharewebCategoriesId: [compareItemTwoId]
    };
    console.log(compareItemOneTask,compareItemTwoTask);
        
    if(updateType=="UpdateAndKeepOne") {
      await this.deleteSmartMetadataItem(compareItemTwoId);
      await this.updateSmartMetadataItem(compareItemOne, compareItemOneId);
      compareItemOneChildItems.forEach(async itemOneChildItem => {
        await this.spservice.updateListItem(this.smartMetadadaListId, itemOneChildItem.ID, compareItemOneChild);
      });
      itemOneTasks.forEach(async taskItem => {
        taskListId = taskItem["odata.editlink"].split("'")[1];
        taskItemId = taskItem.ID;
        await this.spservice.updateListItem(taskListId, taskItemId, compareItemOneTask);
      });
    }
    else if(updateType=="UpdateAndKeepTwo") {
      await this.deleteSmartMetadataItem(compareItemOneId);
      await this.updateSmartMetadataItem(compareItemTwo, compareItemTwoId);
      compareItemTwoChildItems.forEach(async itemTwoChildItem => {
        await this.spservice.updateListItem(this.smartMetadadaListId, itemTwoChildItem.ID, compareItemTwoChild);
      });
      itemTwoTasks.forEach(async taskItem => {
        taskListId = taskItem["odata.editlink"].split("'")[1];
        taskItemId = taskItem.ID;
        await this.spservice.updateListItem(taskListId, taskItemId, compareItemOneTask);
      });
    }
    else if(updateType=="UpdateAndKeepBoth") {
      await this.updateSmartMetadataItem(compareItemOne, compareItemOneId);
      await this.updateSmartMetadataItem(compareItemTwo, compareItemTwoId);
      compareItemOneChildItems.forEach(async itemOneChildItem => {
        await this.spservice.updateListItem(this.smartMetadadaListId, itemOneChildItem.ID, compareItemOneChild);        
      });
      compareItemTwoChildItems.forEach(async itemTwoChildItem => {
        await this.spservice.updateListItem(this.smartMetadadaListId, itemTwoChildItem.ID, compareItemTwoChild);
      });
      itemOneTasks.forEach(async taskItem => {
        taskListId = taskItem["odata.editlink"].split("'")[1];
        taskItemId = taskItem.ID;
        await this.spservice.updateListItem(taskListId, taskItemId, compareItemOneTask);
      });
      itemTwoTasks.forEach(async taskItem => {
        taskListId = taskItem["odata.editlink"].split("'")[1];
        taskItemId = taskItem.ID;
        await this.spservice.updateListItem(taskListId, taskItemId, compareItemOneTask);
      });
    }

    this.hideModalCompareSmartMetadata();
    await this.loadConfigurations();
  }

  public async restructureAndUpdateSmartMetadata(parentItemId: number, sMetadataItems: ISmartMetadataItem[]) {
    const sMetadataItemUpdate: ISmartMetadataItem = {
      ParentId: parentItemId,
      ParentID: parentItemId
    };
    sMetadataItems.forEach(async sMetadataItem=>{
      await this.updateSmartMetadataItem(sMetadataItemUpdate, sMetadataItem.ID);
    });
    this.hideModalRestructureSmartMetadata();
    await this.loadConfigurations();
  }

  public async deleteSmartMetadata(delSMItem: ISmartMetadataItem) {
    await this.deleteSmartMetadataItem(delSMItem.ID);
    this.hideModalDeleteSmartMetadata();
    await this.loadConfigurations();
  }

  public async deleteAndArchiveSmartMetadata(delSMItem: ISmartMetadataItem) {
    const delAndArchiveItem: ISmartMetadataItem = {
      Title: delSMItem.Title.indexOf("Archived")>-1 ? delSMItem.Title : `${delSMItem.Title} (Archived)`,
      isDeleted: true
    };
    this.updateSmartMetadataItem(delAndArchiveItem, delSMItem.ID);
    this.hideModalDeleteSmartMetadata();
    await this.loadConfigurations();
  }

  private async uploadImage(folderName: string, uploadedImage: IUploadedImage) {
    let resImage = await this.spservice.addImage(folderName, uploadedImage);
    let imageURL: string = "";
    if(resImage) {
        let hostWebURL = this.props.context.pageContext.web.absoluteUrl.replace(this.props.context.pageContext.web.serverRelativeUrl,"");
        imageURL = `${hostWebURL}${resImage.data.ServerRelativeUrl}`;        
    }
    return imageURL;
  }

  public async removeTaskCategories(selTaskItems: ITask[]) {
    let taskListId: string;
    let taskItemId: number;
    const taskItem: ITask = {
      SharewebCategoriesId: []
    };
    selTaskItems.forEach(async selTaskItem => {
      taskListId = selTaskItem["odata.editlink"].split("'")[1];
      taskItemId = selTaskItem.ID;
      await this.spservice.updateListItem(taskListId, taskItemId, taskItem);
    });

    this.hideModalEditSmartMetadata();
    await this.loadConfigurations();

  } 

}
