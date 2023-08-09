import * as React from 'react';
import { Modal } from 'office-ui-fabric-react';
import { Web } from "sp-pnp-js";
import TeamConfigurationCard from '../../webparts/EditPopupFiles/TeamConfigurationPortfolio';
import { arraysEqual, Panel, PanelType } from 'office-ui-fabric-react';
import { GlobalConstants } from '../LocalCommon';
import * as globalCommon from '../globalCommon';
import ListGroup from 'react-bootstrap/ListGroup';
export interface IStructureCreationProps {
    CreatOpen: (item: any) => void;
    Close: (item: any) => void;
    SelectedItem: any;
    PortfolioType: any;
    PropsValue: any;
}

export interface IStructureCreationState {
    isModalOpen: boolean;
    AllFilteredAvailableComoponent: any;
    Portfolio_x0020_Type: string;
    textTitle: string;
    IsComponentPopup: boolean;
    Item_x0020_Type: string;
    SelectedItem: any;
    PortfolioType: any;
    TeamConfig: any;
    OpenModal: string;
    ChildItemTitle: any;
    AllComponents: any;
    tempr: any;
    value: any;
    filterArray: any;
    search: false;
    Isflag: any;
    PropValue: any,
    webServerRelativeUrl: any,
    PortfolioTypeArray: any,
    PortfolioTypeId: any,
    defaultPortfolioType: any,



}

const dragItem: any = {}
export class PortfolioStructureCreationCard extends React.Component<IStructureCreationProps, IStructureCreationState> {
    constructor(props: IStructureCreationProps) {
        super(props);
        this.state = {
            isModalOpen: false,
            AllFilteredAvailableComoponent: [],
            Portfolio_x0020_Type: 'Component',
            textTitle: '',
            IsComponentPopup: false,
            Item_x0020_Type: 'SubComponent',
            SelectedItem: this.props.SelectedItem,
            PortfolioType: this.props.PortfolioType, // (this.props.PortfolioType ===undefined || this.props.PortfolioType ==='') ?'Component Portfolio':this.props.PortfolioType,
            TeamConfig: [],
            OpenModal: '',
            ChildItemTitle: [],
            AllComponents: [],
            tempr: [],
            value: '',
            filterArray: [],
            search: false,
            Isflag: false,
            PropValue: this.props.PropsValue,
            webServerRelativeUrl: this.props.PropsValue.siteUrl.toLowerCase().split('.com')[1],
            PortfolioTypeArray: [],
            PortfolioTypeId: 1,
            defaultPortfolioType: (this.props.PortfolioType === undefined || this.props.PortfolioType === '') ? 'Component' : this.props.PortfolioType,
        }
        this.getPortfolioType();
        this.LoadSPComponents();
        this.Load();

    }

    private async LoadSPComponents() {
        let SPDetails: any = [];
        let filtertitle = this.state.PortfolioType.split(' ')[0];
        this.Portfolio_x0020_Type = filtertitle;
        var select: any = "Title,Id,PortfolioType&$filter=Portfolio_x0020_Type eq '" + filtertitle + "'"
        SPDetails = await globalCommon.getData(this.state.PropValue.siteUrl, this.state.PropValue.MasterTaskListID, select);
        console.log(SPDetails);
        var tets: any = [];
        SPDetails.forEach((obj: any) => {
            tets.push(obj.Title);
        })

        this.setState({
            tempr: tets,
            AllComponents: SPDetails,

        }, () => console.log(this.state.AllComponents))
    }
    // private.CheckPortfolioType () =>{

    // }
    private CheckPortfolioType = (item: any) => {
        if (item?.Title === 'Service') {
            this.setState({ PortfolioTypeId: item.Id });
            this.setState({
                PortfolioType: 'Service Portfolio',
                defaultPortfolioType: item.Title
            })
        }
        if (item?.Title === 'Component') {
            this.setState({ PortfolioTypeId: item.Id });
            this.setState({
                PortfolioType: 'Component Portfolio',
                defaultPortfolioType: item.Title
            })
        }
        if (item?.Title === 'Events') {
            this.setState({ PortfolioTypeId: item.Id });
            this.setState({
                PortfolioType: 'Events Portfolio',
                defaultPortfolioType: item.Title
            })
        }
    }
    private setItemType() {
        let item = this.props.SelectedItem;
        if (item != undefined) {
            item.siteUrl = this.state.PropValue.siteUrl;
            item.listName = 'Master Tasks';
        }

        this.setState({
            SelectedItem: item,
            OpenModal: item != undefined ? 'SubComponent' : 'Component'
        })
    }
    private async Load() {
        //this.setItemType();
        console.log(this.props.SelectedItem);
        await this.LoadPortfolioitemParentId(undefined, undefined, undefined);
        this.setItemType();
    }
    private async getPortfolioType() {
        let web = new Web(this.state.PropValue.siteUrl);
        let PortFolioType = [];
        PortFolioType = await web.lists
            .getById('c21ab0e4-4984-4ef7-81b5-805efaa3752e')
            .items.select(
                "Id",
                "Title",
                "Color",
                "IdRange"
            )
            .get();
        if (this?.state?.defaultPortfolioType != undefined) {
            PortFolioType?.forEach((obj: any) => {
                if (this?.state?.defaultPortfolioType?.toLowerCase() === obj?.Title?.toLowerCase())
                    this.setState({ PortfolioTypeId: obj.Id });

            })

        }
        this.setState({ PortfolioTypeArray: PortFolioType });
    };

    // private closeModal(e: any) {
    //     e.preventDefault();
    //     this.setState({
    //         isModalOpen: false
    //     })
    //     this.props.Close();
    // }

    private OpenModal(e: any) {
        e.preventDefault();
        this.setState({
            isModalOpen: true
        })
    }

    handleInputChange = (e: any) => {

        const keyword = e.target.value;
        // setValue(event.target.value);

        if (this.state.value.length == 0) {
            this.setState({ search: false });
        }

        this.setState({ value: e.target.value });
        // if (keyword !== '') {
        //     const results = this.state.AllComponents.filter((user: any) => {
        //         return user.Title.toLowerCase().startsWith(keyword.toLowerCase());
        //         // Use the toLowerCase() method to make it case-insensitive
        //     });
        //     this.setState({
        //         filterArray: results
        //     })
        // } else {
        //     this.setState({
        //         filterArray: this.state.AllComponents
        //     })
        //     // If the text field is empty, show all users
        // }

        this.setState({ textTitle: e.target.value });
    }

    private async GetOrCreateFolder(foldername: any) {
        let web = new Web(this.state.PropValue.siteUrl);
        let isFolderExists = false;
        try {
            let folder = await web.getFolderByServerRelativeUrl(this.state.webServerRelativeUrl + "/documents/COMPONENT-PORTFOLIO/" + foldername).get();
            console.log(folder);
            isFolderExists = folder.Exists;

        } catch (error) {
            isFolderExists = false;
            // creates a new folder for web with specified url
            let folderAddResult = await web.folders.add(this.state.webServerRelativeUrl + "/documents/COMPONENT-PORTFOLIO/" + foldername);
            console.log(folderAddResult);
            isFolderExists = folderAddResult.data.Exists;
        }
        console.log("folder exists : " + isFolderExists);

        return isFolderExists;
    }

    private async GetFolderID(folderName: any) {
        let web = new Web(this.state.PropValue.siteUrl);
        let folderDeatils = [];
        folderDeatils = await web.lists
            .getByTitle("Documents")
            .items
            .select("ID", "Title", "FileDirRef", "FileLeafRef", "ServerUrl", "FSObjType", "EncodedAbsUrl")
            .filter("FileLeafRef eq '" + folderName + "'")
            .get()

        console.log(folderDeatils[0].Id);
        this.Folders = folderDeatils[0].Id;
    }

    private folderName: any;
    private Folders: string;
    private AdminStatusItem = 'Not Started';
    private GetportfolioIdCount = 0;
    private PortfolioStructureIDs = '';
    private NextLevel = 0;
    private MasterItemsType = '';
    private CountFor = 0;
    private TotalCount = 0;
    private Count = 0;
    private CreatedItem: any = [];
    private AssignedIds: any = [];
    private TeamMembersIds: any = [];
    private ChildItemTitle: any = [];
    private Portfolio_x0020_Type = 'Component';
    private CreateOpenType = '';
    private IconUrl = '';

    CreateFolder = async (Type: any) => {
        let folderURL = '';
        if (this.Portfolio_x0020_Type == 'Component') {
            folderURL = (this.state.webServerRelativeUrl + '/Documents/COMPONENT-PORTFOLIO').toLowerCase();
        } else if (this.Portfolio_x0020_Type == 'Service') {
            folderURL = (this.state.webServerRelativeUrl + '/Documents/SERVICE-PORTFOLIO').toLowerCase();
        } else if (this.Portfolio_x0020_Type == 'Events') {
            folderURL = (this.state.webServerRelativeUrl + '/Documents/EVENT-PORTFOLIO').toLowerCase();
        }
        let DOcListID = "d0f88b8f-d96d-4e12-b612-2706ba40fb08"
        if (this.state.textTitle == '') {
            alert('Please Enter the Title!')
        }
        else {
            this.folderName = this.state.textTitle.substring(0, 40);
            let isFolderExists = await this.GetOrCreateFolder(this.folderName);
            if (isFolderExists) {
                await this.GetFolderID(this.folderName);
                this.createComponent(Type);
            }
        }

    };

    createComponent = async (Type: any) => {
        let postdata = {
            "Item_x0020_Type": 'Component',
            "Title": this.state.textTitle,
            "FolderID": String(this.Folders),
            "Portfolio_x0020_Type": this.Portfolio_x0020_Type,
            "AdminStatus": this.AdminStatusItem,
            "PortfolioLevel": this.NextLevel,
            "PortfolioStructureID": this.PortfolioStructureIDs,
            "PortfolioTypeId": this.state.PortfolioTypeId
        }
        let web = new Web(this.state.PropValue.siteUrl);
        const i = await web.lists
            .getById(this.state.PropValue.MasterTaskListID)
            .items
            .add(postdata);

        console.log(i);

        if (this.state.PortfolioTypeArray != undefined && this.state.PortfolioTypeArray.length > 0) {
            this.state.PortfolioTypeArray.forEach((type: any) => {
                if (this.state.PortfolioTypeId === type.Id)
                    i.data.PortfolioType = type;
            })
        }
        if (Type == 'CreatePopup') {
            this.setState({
                isModalOpen: false
            })
            //self.OpenEditPopup(self.CreatedItem[0]);
            this.props.CreatOpen(i);
        } else {
            this.setState({ isModalOpen: false });
        }
        //  if(i !=undefined)
        //  Item.
        this.props.Close(i);
    }

    LoadPortfolioitemParentId = async (ItemType: any, isloadEssentialDeatils: any, item: any) => {
        if (ItemType == undefined)
            this.GetportfolioIdCount = 0;

        let ItemTypes = (this.state.ChildItemTitle != undefined && this.state.ChildItemTitle.length > 0) ? this.state.ChildItemTitle[0].MasterItemsType : undefined;
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
        } else ItemTypes = (this.state.ChildItemTitle != undefined && this.state.ChildItemTitle.length > 0) ? this.state.ChildItemTitle[0].MasterItemsType : 'Component';
        let filter = ''

        // if (ItemTypes == 'Component') {
        //     filter = "Item_x0020_Type eq '" + ItemTypes + "'and orderby eq 'Created desc'"
        // }
        if (ItemTypes == 'Component') {
            filter = "Item_x0020_Type eq '" + ItemTypes + "'"
        }
        else {
            filter = "Parent/Id eq '" + this.state.SelectedItem.Id + "' and Item_x0020_Type eq '" + ItemTypes + "'"
        }


        let web = new Web(this.state.PropValue.siteUrl);
        let results = await web.lists
            .getById(this.state.PropValue.MasterTaskListID)
            .items
            .select("Id", "Title", "PortfolioLevel", "PortfolioStructureID", "Parent/Id")
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
            // const tempItem = this.state.PortfolioTypeArray.filter((port: any) =>  (port.Title === this.state?.PortfolioType) ||(port.Title === this.state?.defaultPortfolioType) );
            // //const tempNumber =tempItem[0]?.IdRange?.split('-')[0];
            // const tempNumber = tempItem[0]?.Title?.charAt(0) +tempItem[0]?.IdRange?.split('-')[0];
            // this.PortfolioStructureIDs= tempNumber?.substring(0, tempNumber?.length - (this.NextLevel.toString().length)) + this.NextLevel;
            this.PortfolioStructureIDs = 'C' + this.NextLevel;
        }
 


        if (isloadEssentialDeatils == undefined || isloadEssentialDeatils == true)
            this.LoadEssentialsDetail();

    }

    LoadEssentialsDetail = async () => {

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
                this.IconUrl = this.state.SelectedItem.Portfolio_x0020_Type === 'Component' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/SubComponent_icon.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/SubComponent_icon.png';
                this.CountFor = 0;
                if (this.state.SelectedItem.Item_x0020_Type == 'SubComponent') {
                    this.MasterItemsType = 'Feature';
                    this.IconUrl = this.state.SelectedItem.Portfolio_x0020_Type === 'Component' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/feature_icon.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/feature_icon.png';
                }

                this.ChildItemTitle.push({
                    Title: '',
                    MasterItemsType: this.MasterItemsType,
                    AdminStatus: 'Not Started',
                    IconUrl: this.IconUrl,
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

                this.setState({ ChildItemTitle: this.ChildItemTitle })
            }
        }
    }


    private createChildItems = async (Type: any) => {
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
            self.ChildItemTitle.forEach(async function (item: any) {
                //item.Title = self.state.textTitle
                if (item.Title != undefined && item.Title != '') {
                    self.TotalCount++;
                    if (self.state.TeamConfig != undefined) {
                        if (self.state.TeamConfig.ResponsibleTeam != undefined && self.state.TeamConfig.ResponsibleTeam.length > 0) {
                            self.state.TeamConfig.ResponsibleTeam.forEach(function (assignto: any) {
                                self.AssignedIds.push(assignto.AssingedToUserId);
                                // self.AssignedTo.push(assignto.AssingedToUserId);
                            })
                        }
                        if (self.state.TeamConfig.TeamMemberUsers != undefined && self.state.TeamConfig.TeamMemberUsers.length > 0) {

                            self.state.TeamConfig.TeamMemberUsers.forEach(function (TeamMember: any) {
                                self.TeamMembersIds.push(TeamMember.AssingedToUserId);
                            })
                        }
                    }
                    let ClientCategoryIds: any = []
                    if (self.state.SelectedItem != undefined && self.state.SelectedItem.ClientCategory != undefined && self.state.SelectedItem.ClientCategory != undefined && self.state.SelectedItem.ClientCategory.length > 0) {
                        self.state.SelectedItem.ClientCategory.forEach(function (clientCategory: any) {
                            ClientCategoryIds.push(clientCategory.Id);
                        })
                    }
                    let AssignedToIds: any = []
                    let TeamMembersIds: any = []
                    if (item.AssignedToUsers != undefined && item.AssignedToUsers.length > 0) {
                        item.AssignedToUsers.forEach(function (user: any) {
                            AssignedToIds.push(user.AssingedToUserId);
                        });
                    }
                    /*
                    item.TeamMemberUsers.forEach(item.TeamMemberUsers, function (user:any) {
                        TeamMembersIds.push(user.AssingedToUserId);
                    });
                    */
                    let postdata: any = {
                        "Item_x0020_Type": item.MasterItemsType,
                        "ParentId": self.state.SelectedItem.Id,
                        "Title": item.Title,
                        "Portfolio_x0020_Type": self.Portfolio_x0020_Type,
                        "AdminStatus": item.AdminStatus,
                        AssignedToId: { "results": self.AssignedIds },
                        Team_x0020_MembersId: { "results": self.TeamMembersIds },
                        "PortfolioLevel": item.NextLevel,
                        "PortfolioStructureID": item.PortfolioStructureIDs,
                        ClientCategoryId: { "results": ClientCategoryIds },
                    }
                    if (self?.state?.SelectedItem?.PortfolioType != undefined) {
                        postdata.PortfolioTypeId = self?.state?.SelectedItem?.PortfolioType?.Id;

                    }
                    if (self.state.SelectedItem.Sitestagging != undefined) {
                        let siteComposition = JSON.parse(self.state.SelectedItem.Sitestagging);
                        siteComposition.forEach(function (item: any) {
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
                        let PermissionId: any = [];
                        self.state.SelectedItem.PermissionGroup.forEach(function (item: any) {
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
                        let ComponentId: any = [];
                        self.state.SelectedItem.Component.forEach(function (item: any) {
                            ComponentId.push(item.Id);
                        });
                        postdata.ComponentId = { 'results': ComponentId };
                    }
                    if (self.state.SelectedItem.Services != undefined && self.state.SelectedItem.Services != undefined && self.state.SelectedItem.Services.length > 0) {
                        let ServiceId: any = [];
                        self.state.SelectedItem.Services.forEach(function (item: any) {
                            ServiceId.push(item.Id);
                        });
                        postdata.ServicesId = { 'results': ServiceId };
                    }
                    if (self.state.SelectedItem.Events != undefined && self.state.SelectedItem.Events != undefined && self.state.SelectedItem.Events.length > 0) {
                        let EventId: any = [];
                        self.state.SelectedItem.Events.forEach(function (item: any) {
                            EventId.push(item.Id);
                        });
                        postdata.EventsId = { 'results': EventId };
                    }

                    /*self.taskUser.forEach(function (Catdraft:any) {
                        if (_spPageContextInfo.userId == Catdraft.AssingedToUser.Id && Catdraft.DraftCategory != undefined && Catdraft.DraftCategory[0] != undefined && Catdraft.DraftCategory[0].IsDraft != undefined && Catdraft.DraftCategory[0].IsDraft == true) {
                            postdata.Categories = 'Draft';
                        }
                    })*/

                    let web = new Web(self.state.PropValue.siteUrl);
                    const i = await web.lists
                        .getById(self.state.PropValue.MasterTaskListID)
                        .items
                        .add(postdata);
                    console.log(i);
                    i.data['siteType'] = 'Master Tasks';
                    if (self.state.PortfolioTypeArray != undefined && self.state.PortfolioTypeArray.length > 0) {
                        self.state.PortfolioTypeArray.forEach((type: any) => {
                            if (self.state.PortfolioTypeId === type.Id)
                                i.data.PortfolioType = type;
                        })
                    }
                    self.Count++;
                    self.CreatedItem.push(i);
                    let Type: any = '';
                    if (self.state.Isflag) {
                        self.setState({
                            Isflag: false,
                        })
                        self.CreateOpenType = 'CreatePopup';
                    }

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
                if (AddedCount == self.ChildItemTitle.length) {
                    self.setState({ isModalOpen: false });
                    //self['SelectedItem'] =SelectedItem;
                    self.props.Close(self);
                }

            });
        }




    }
    createChildItemsnew = async (Type: any) => {
        this.setState({
            Isflag: true,
        })
        this.createChildItems('CreatePopup');
    }
    DDComponentCallBack = (dt: any) => {
        this.setState({
            TeamConfig: dt
        }, () => console.log(this.state.TeamConfig))
    }

    addNewTextField = () => {
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

        this.setState({ ChildItemTitle: ChildItem })

    }

    handleChildItemInput = (e: any, index: any) => {
        let ChildItemTitle = this.state.ChildItemTitle;
        ChildItemTitle[index].Title = e.target.value;
        this.setState({ ChildItemTitle })

    }
    handleTypeChange = (e: any, index: any) => {
        let ChildItemTitle = this.state.ChildItemTitle;
        ChildItemTitle[index].MasterItemsType = e.target.value;
        this.setState({ ChildItemTitle })
        console.log(this.state.ChildItemTitle);
    }

    handleChildItemSD = (e: any, index: any) => {
        let ChildItemTitle = this.state.ChildItemTitle;
        ChildItemTitle[index].Child[0].Short_x0020_Description_x0020_On = e.target.value;
        this.setState({ ChildItemTitle });
        console.log(this.state.ChildItemTitle);

    }

    RemoveFeedbackColumn = (index: any, type: any) => {
        let ChildItemTitle = this.state.ChildItemTitle;
        if (type == 'Description') {
            ChildItemTitle[index].Child.splice(0, 1);
        } else {
            ChildItemTitle.splice(index, 1);
        }
        this.setState({ ChildItemTitle });
        console.log(this.state.ChildItemTitle);
    }
    private onSearch = (searchTerm: any) => {
        this.setState({
            value: searchTerm,
            search: false,
            textTitle: searchTerm
        })


        // $.each(this.state.AllComponents, function (index: any, d: any) {

        //     if (searchTerm == d?.Title)
        //         this.Status.filterArray.push(d.Title);

        //     this.setState({
        //         searh: false
        //     })
        // })
        // this.setState({ textTitle: searchTerm });
        // console.log(DGroups);
        //  setdGroups(DGroups);
        console.log("search ", searchTerm);
    };

    public render(): React.ReactElement<IStructureCreationProps> {
        return (
            <>
                <div id="ExandTableIds" className={this.state.PortfolioType == 'Events' ? 'eventpannelorange' : ((this.state.PortfolioType == 'Service' || this.state.PortfolioType == 'Service Portfolio') ? 'serviepannelgreena' : 'component Portfolio clearfix')}>

                    {this.state.OpenModal == 'Component' &&
                        <div >
                            <div className='row'>
                                <div className="col form-group">
                                    <div className="d-flex">
                                        <label className='full-width'>Title</label>
                                        {(this.props.PortfolioType === "" || this.props.PortfolioType === undefined) && <div className="mx-auto SpfxCheckRadio col-auto">{this.state.PortfolioTypeArray != undefined && this.state.PortfolioTypeArray?.length > 0 && this.state.PortfolioTypeArray?.map((item: any) => {
                                            return (
                                                <label className='label--radio'><input className='radio' defaultChecked={this.state.defaultPortfolioType.toLowerCase() === item.Title.toLowerCase()} name='PortfolioType' type='radio' onClick={() => this.CheckPortfolioType(item)} ></input>{item.Title}</label>
                                            )
                                        }
                                        )}

                                        </div>}
                                    </div>
                                    <div className="col-sm-12 p-0">
                                        <input className="form-control full_width" type="text" value={this.state.textTitle} onChange={(e) => this.handleInputChange(e)}
                                            placeholder="Enter Component Title..." ng-required="true" />
                                        <div className="dropdown">
                                            {this.state != undefined && this.state.tempr?.filter((item: any) => {
                                                // item?.toLowerCase().includes(item);


                                                const searchTerm = this?.state?.value?.toLowerCase();
                                                const fullName = item?.toLowerCase();

                                                return (
                                                    searchTerm &&
                                                    fullName?.startsWith(searchTerm) &&
                                                    fullName !== searchTerm
                                                );

                                            })
                                                .slice(0, 10)
                                                .map((item: any) => (
                                                    <div
                                                        onClick={() => this.onSearch(item)}
                                                        className="dropdown-row"
                                                        key={item}
                                                    >
                                                        {item}
                                                    </div>
                                                ))}
                                        </div>
                                    </div>

                                    {/* <div className="user-list">
                                    {this.state.filterArray && this.state.filterArray.length > 0 ? (
                                        this.state.filterArray.map((item:any) => (
                                            <li key={item.id} className="user">
                                                <span className="user-id">{item.Title}</span>
                                              
                                            </li>
                                        ))
                                    ) : (
                                        <h1>No results found!</h1>
                                    )}
                                </div> */}

                                    <div className='grp'>

                                        {this?.state?.search && <div >

                                            {this?.state?.filterArray?.map((op: any, i: any) => {
                                                return (
                                                    <ListGroup>
                                                        <ListGroup.Item>{op}</ListGroup.Item>
                                                    </ListGroup>
                                                    // <tr>
                                                    //     <td><span>{op}</span></td>
                                                    // </tr>
                                                )
                                            })}


                                        </div>}
                                    </div>
                                </div>
                                {/* {this.state.AllFilteredAvailableComoponent.length > 0 &&
                                <div className="divPanelBody fortablee col-sm-12 pad0 filtericonposfix">
                                    <div className="container pad0 section-event pt-0 mb-10">
                                        <ul className="table">
                                            <li className="for-lis">
                                                <div style={{ width: "1%" }}></div>
                                                <div style={{ width: "3%" }}>
                                                    <div style={{ width: "80%" }}></div>
                                                </div>
                                                <div style={{ width: "60%" }}>
                                                    <div style={{ width: "100%" }} className="search colm-relative">
                                                        <input type="search" id="searchTaskName" placeholder="Task Title"
                                                            className="full_width searchbox_height"
                                                            ng-model="category.searchTaskName" />
                                                        <span className="searchclear"
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
                                                <div style={{ width: "15%" }}>
                                                    <div style={{ width: "65px" }} className="search colm-relative">

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
                                                <div style={{ width: "15%" }}>
                                                    <div style={{ width: "65px" }} className="search colm-relative">

                                                        <input type="search" id="searchPriority" placeholder="Priority"
                                                            className="full_width searchbox_height"
                                                            ng-model="category.searchPriority" />
                                                        <span className="searchclear"
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
                                                <div style={{ width: "4%" }}>
                                                    <div style={{ width: "81px" }} className="search">
                                                    </div>
                                                </div>
                                            </li>
                                            <div className="container-new">
                                                <li className="itemRow for-lis tdrows"
                                                    ng-repeat="item in filtered = (AllFilteredAvailableComoponent|orderBy:orderBy:reverse | filter:{Title:category.searchTaskName,PercentComplete:category.searchPercentCompletecreatecomponentclear,Priority_x0020_Rank:category.searchPriority})">
                                                    <div style={{ width: "1%" }}></div>
                                                    <div style={{ width: "3%" }} className="padLR">
                                                        <img
                                                            className="icon-sites-img ml-8"
                                                            src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/component_icon.png" />

                                                    </div>

                                                    <div style={{ width: "65%" }} className="padLR" ng-click="assignTitle(item.newTitle)">

                                                    </div>
                                                    <div style={{ width: "15%" }} className="padLR" ng-click="assignTitle(item.newTitle)">

                                                    </div>
                                                    <div style={{ width: "15%" }} className="padLR" ng-click="assignTitle(item.newTitle)">

                                                    </div>
                                                    <div className="icontype display_hide" style={{ width: "4%" }}>

                                                    </div>
                                                    <div className="icontype display_hide" style={{ width: "2%" }}
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
                            } */}

                            </div>
                            <footer className={(this.state.PortfolioType == 'Service' || this.state.PortfolioType == 'Service Portfolio') ? "serviepannelgreena text-end  mt-2" : "text-end  mt-2"}>
                                <button type="button" className="btn btn-primary me-1" onClick={() => this.CreateFolder('CreatePopup')}
                                >
                                    Create & Open Popup
                                </button>
                                <button type="button" className="btn btn-primary" onClick={() => this.CreateFolder('Create')}
                                >
                                    Create
                                </button>

                            </footer>


                        </div>
                    }

                    {this.state.OpenModal == 'SubComponent' && this.state.SelectedItem != undefined &&

                        <div>
                            <div>

                                <div className='row'>
                                    {this.state.ChildItemTitle != undefined && this.state.ChildItemTitle.length > 0 &&
                                        this.state.ChildItemTitle.map((item: any, index: number) => {
                                            return <>

                                                <div>
                                                    <div className='card mb-2 mt-2 p-0 rounded-0'>
                                                        <div className='card-header p-1'>
                                                            <h6 className='my-0 fw-normal'>
                                                                {
                                                                    this.state.ChildItemTitle.length > 1 ?

                                                                        <span onClick={() => this.RemoveFeedbackColumn(index, '')} className='float-end'><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48" fill="none">
                                                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M19.3584 5.28375C18.4262 5.83254 18.1984 6.45859 18.1891 8.49582L18.1837 9.66172H13.5918H9V10.8591V12.0565H10.1612H11.3225L11.3551 26.3309L11.3878 40.6052L11.6525 41.1094C11.9859 41.7441 12.5764 42.3203 13.2857 42.7028L13.8367 43H23.9388C33.9989 43 34.0431 42.9989 34.6068 42.7306C35.478 42.316 36.1367 41.6314 36.4233 40.8428C36.6697 40.1649 36.6735 39.944 36.6735 26.1055V12.0565H37.8367H39V10.8591V9.66172H34.4082H29.8163L29.8134 8.49582C29.8118 7.85452 29.7618 7.11427 29.7024 6.85084C29.5542 6.19302 29.1114 5.56596 28.5773 5.2569C28.1503 5.00999 27.9409 4.99826 23.9833 5.00015C19.9184 5.0023 19.8273 5.00784 19.3584 5.28375ZM27.4898 8.46431V9.66172H24H20.5102V8.46431V7.26691H24H27.4898V8.46431ZM34.4409 25.9527C34.4055 40.9816 34.4409 40.2167 33.7662 40.5332C33.3348 40.7355 14.6335 40.7206 14.2007 40.5176C13.4996 40.1889 13.5306 40.8675 13.5306 25.8645V12.0565H24.0021H34.4736L34.4409 25.9527ZM18.1837 26.3624V35.8786H19.3469H20.5102V26.3624V16.8461H19.3469H18.1837V26.3624ZM22.8367 26.3624V35.8786H24H25.1633V26.3624V16.8461H24H22.8367V26.3624ZM27.4898 26.3624V35.8786H28.6531H29.8163V26.3624V16.8461H28.6531H27.4898V26.3624Z" fill="#333333" />
                                                                        </svg>
                                                                        </span>
                                                                        : ''}
                                                            </h6>
                                                        </div>
                                                        <div className="card-body">
                                                            <div className='d-flex justify-content-between align-items-center mb-0'>
                                                                <label className='mb-1'>
                                                                    {
                                                                        (item.MasterItemsType == 'SubComponent') ?
                                                                            <span className="Dyicons ">S</span>
                                                                            :
                                                                            <span className="Dyicons ">F</span>


                                                                    }
                                                                    <span className='ms-1'><strong>Title</strong> </span> </label>

                                                                {this.state.SelectedItem.Item_x0020_Type == 'Component' &&
                                                                    <>
                                                                        <div>
                                                                            <span className='me-2'>
                                                                                <input
                                                                                    type="radio"
                                                                                    value="SubComponent"
                                                                                    checked={item.MasterItemsType === 'SubComponent'}
                                                                                    onChange={(e) => this.handleTypeChange(e, index)}
                                                                                />
                                                                                <label className='ms-1'>SubComponent</label>
                                                                            </span>
                                                                            <span>
                                                                                <input
                                                                                    type="radio"
                                                                                    value="Feature"
                                                                                    checked={item.MasterItemsType === 'Feature'}
                                                                                    onChange={(e) => this.handleTypeChange(e, index)}
                                                                                />

                                                                                <label className='ms-1'>  Feature</label>

                                                                            </span>
                                                                        </div>
                                                                    </>
                                                                }
                                                            </div>
                                                            <div className="d-flex">

                                                                <div className="col ">
                                                                    <input className="form-control full_width mb-10" type="text" value={this.state.ChildItemTitle[index].Title} onChange={(e) => this.handleChildItemInput(e, index)}
                                                                        placeholder="Enter Child Item Title" ng-required="true" />
                                                                </div>

                                                            </div>
                                                            <div className="row mt-3">
                                                                {item.Child.length > 0 &&
                                                                    <div ng-repeat="items in item.Child">
                                                                        <label className="  titleclrgreen "><strong>Short
                                                                            Description</strong> </label>
                                                                        <div className="col">
                                                                            <textarea className='full-width' rows={4}
                                                                                value={this.state.ChildItemTitle[index].Child[0].Short_x0020_Description_x0020_On} onChange={(e) => this.handleChildItemSD(e, index)}></textarea>
                                                                        </div>
                                                                    </div>
                                                                }


                                                            </div>
                                                        </div>
                                                    </div>
                                                    {index == 0 &&
                                                        <div ng-show="$index==0" className="col-sm-12  ">
                                                            {/* <TeamConfigurationCard ItemInfo={this.state.SelectedItem} Sitel={this.state.PropValue} parentCallback={this.DDComponentCallBack}  />
                                                            <div className="clearfix">
                                                            </div> */}
                                                        </div>
                                                    }
                                                </div>
                                            </>
                                        })}
                                    <div ng-repeat-end></div>

                                </div>
                                <footer className={(this.state.PortfolioType == 'Service' || this.state.PortfolioType == 'Service Portfolio') ? "serviepannelgreena text-end  mt-2" : "text-end  mt-2"}>
                                    <a className="me-1" onClick={() => this.addNewTextField()} ng-click="addNewTextField()">
                                        <img className="icon-sites-img" ng-show="Portfolio_x0020_Type=='Component'"
                                            src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/Add-New.png" />
                                        Add more child items
                                    </a>

                                    {this.state.ChildItemTitle.length == 1 &&
                                        <button type="button" className="btn btn-primary me-1" onClick={() => this.createChildItemsnew('CreatePopup')}>
                                            Create & Open Popup
                                        </button>
                                    }

                                    <button type="button" className="btn btn-primary" onClick={() => this.createChildItems('Create')} >
                                        Create
                                    </button>

                                </footer>
                            </div>
                        </div>

                    }
                </div>

            </>
        );
    }
}

export default PortfolioStructureCreationCard;