import * as React from "react";
import * as $ from 'jquery';
import { Modal } from 'office-ui-fabric-react';
import * as Moment from 'moment';
import '../../webparts/taskDashboard/components/TaskDashboard.scss'
import { HiPencil } from 'react-icons/Hi';
import { Web } from "sp-pnp-js";
import TeamComposition from './TeamComposition';
import Picker from "./SmartMetaDataPicker";
import FloraEditor from "./TextEditor";
import Example from "./FroalaCommnetBoxes";
import ImageUploading, { ImageListType } from "react-images-uploading";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/js/dist/modal.js";
import ComponentPortPolioPopup from "../../webparts/EditPopupFiles/ComponentPortfolioSelection";
import axios, { AxiosResponse } from 'axios';
import "bootstrap/js/dist/tab.js";
import CommentCard from "../../globalComponents/Comments/CommentCard";
import LinkedComponent from './LinkedComponent';
import '../../../src/webparts/cssFolder/Style.scss';
var AllMetaData: any = []
var taskUsers: any = []
var myarray: any = [];
var myarray1: any = [];
var myarray2: any = [];
var FolderID: any = '';
//var DataEdit: any = 
var CurrentSiteUrl = 'https://hhhhteams.sharepoint.com/sites/HHHH/SP';

var IsShowFullViewImage = false;
const EditTaskPopup = (Items: any) => {

    const [CompoenetItem, setComponent] = React.useState([]);
    const [images, setImages] = React.useState([]);
    const [status, setstatus] = React.useState<any>('');
    const [IsComponent, setIsComponent] = React.useState(false);
    const [IsServices, setIsServices] = React.useState(false);
    const [IsComponentPicker, setIsComponentPicker] = React.useState(false);
    const [taskUser, settaskUser] = React.useState([]);
    const maxNumber = 69;
    const [data, setTaskData] = React.useState([]);
    const [ImageSection, setImageSection] = React.useState([]);
    const [saveData, setSaveData] = React.useState<any>({ Title: '', Created: Number, PercentComplete: '',Rank:Number})
    const [Description, setDescription] = React.useState([]);
    const [EditData, setEditData] = React.useState<any>({});
    const [SharewebComponent, setSharewebComponent] = React.useState('');
    const [modalIsOpen, setModalIsOpen] = React.useState(true);
    const [TaskStatuspopup, setTaskStatuspopup] = React.useState(false);
    const [composition, setComposition] = React.useState(false);
    const [FolderData, SetFolderData] = React.useState([]);
    const [ComentBox, setComentBox] = React.useState(false);
    const [PercentComplete, setPercentComplete] = React.useState('')
    const [PercentCompletecheck, setPercentCompletecheck] = React.useState(false)
    const [itemRank, setitemRank] = React.useState()
    const [Prriority, setPrriority] = React.useState()

    const setModalIsOpenToTrue = () => {
        setModalIsOpen(true)
    }
    const Call = React.useCallback((item1) => {
        if (item1.smartComponent != undefined && item1.smartComponent.length>0 && item1 != undefined) {
            Items.Items.smartComponent = item1.smartComponent;

        }
        if (item1 != undefined && item1.categories != "" && item1.categories != undefined) {
            Items.Items.Categories = item1.categories; 

        }
        if (item1 != undefined && item1.linkedComponent != "" && item1.linkedComponent != undefined) {
            Items.Items.linkedComponent = item1.linkedComponent;

        }
        setIsComponent(false);
        setIsComponentPicker(false);
    }, []);
    function EditComponentCallback() {

        Items.Items.Call();

    }
    const EditComponent = (item: any, title: any) => {
        // <ComponentPortPolioPopup ></ComponentPortPolioPopup>
        setIsComponent(true);
        setSharewebComponent(item);
        // <ComponentPortPolioPopup props={item}></ComponentPortPolioPopup>
    }
    const EditComponentPicker = (item: any, title: any) => {
        // <ComponentPortPolioPopup ></ComponentPortPolioPopup>
        setIsComponentPicker(true);
        setSharewebComponent(item);
        // <ComponentPortPolioPopup props={item}></ComponentPortPolioPopup>
    }
    const EditLinkedServies = (item: any, title: any) => {
        // <ComponentPortPolioPopup ></ComponentPortPolioPopup>
        setIsServices(true);
        setSharewebComponent(item);
        // <ComponentPortPolioPopup props={item}></ComponentPortPolioPopup>
    }
    React.useEffect(() => {
        loadTaskUsers();
        GetEditdata();
        // Descriptions();
    }, [])
    const setPriority = function (val: any) {
        setPrriority(val)

        
    }
   

    const onChange = (
        imageList: ImageListType,
        addUpdateIndex: number[] | undefined
    ) => {
        // data for submit
        console.log(imageList, addUpdateIndex);
        setImages(imageList as never[]);
    };



    const openTaskStatusUpdatePoup = () => {
        setTaskStatuspopup(true)
    }
    const ExpandSiteComposition = () => {
        setComposition(!composition)
    }
    const closeTaskStatusUpdatePoup = () => {
        setTaskStatuspopup(false)
    }


    var count = 0;
    const loadTaskUsers = () => {
        var AllTaskusers: any = []

        axios.get("https://hhhhteams.sharepoint.com/sites/HHHH/sp/_api/web/lists/getbyid('b318ba84-e21d-4876-8851-88b94b9dc300')/items?$select=Id,UserGroupId,Suffix,Title,Email,SortOrder,Role,IsShowTeamLeader,Company,ParentID1,Status,Item_x0020_Cover,AssingedToUserId,isDeleted,AssingedToUser/Title,AssingedToUser/Id,AssingedToUser/EMail,ItemType,Approver/Id,Approver/Title,Approver/Name&$expand=AssingedToUser,Approver&$orderby=SortOrder asc,Title asc")
            .then((response: AxiosResponse) => {
                taskUsers = response.data.value;
                settaskUser(taskUsers)
                $.each(taskUsers, function (index: any, user: any) {
                    var ApproverUserItem = '';
                    var UserApproverMail: any = []
                    if (user.Title != undefined && user.IsShowTeamLeader === true) {
                        if (user.Approver != undefined) {
                            $.each(user.Approver.results, function (ApproverUser: any, index) {
                                ApproverUserItem += ApproverUser.Title + (index === user.Approver.results.length - 1 ? '' : ',');
                                UserApproverMail.push(ApproverUser.Name.split('|')[2]);
                            })
                            user['UserManagerName'] = ApproverUserItem;
                            user['UserManagerMail'] = UserApproverMail;
                        }
                        AllTaskusers.push(user);
                    }
                });
                if (AllMetaData != undefined && AllMetaData.length > 0) {
                    GetEditdata();
                }
            },
                function (data) {

                });

    }


    const DeletesubColumn = () => {
        setComentBox(false)
    }

    const GetEditdata = async () => {

        let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");

        let smartmeta = await web.lists
            .getById(Items.Items.listId)
            .items
            .select("Id,Title,Priority_x0020_Rank,BasicImageInfo,Priority,EstimatedTime,EstimatedTimeDescription,FeedBack,IsTodaysTask,Component/Id,component_x0020_link,RelevantPortfolio/Title,RelevantPortfolio/Id,Component/Title,Services/Id,Services/Title,Events/Id,PercentComplete,ComponentId,Categories,SharewebTaskLevel1No,SharewebTaskLevel2No,ServicesId,ClientActivity,ClientActivityJson,EventsId,Priority_x0020_Rank,DueDate,SharewebTaskType/Id,SharewebTaskType/Title,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title,SharewebCategories/Id,SharewebCategories/Title,AssignedTo/Id,AssignedTo/Title,Team_x0020_Members/Id,Team_x0020_Members/Title,Responsible_x0020_Team/Id,Responsible_x0020_Team/Title,ClientCategory/Id,ClientCategory/Title")
            .top(5000)
            .filter(`Id eq ${Items.Items.ID}`)
            .expand('AssignedTo,Author,Editor,Component,Services,Events,SharewebTaskType,Team_x0020_Members,Responsible_x0020_Team,SharewebCategories,ClientCategory,RelevantPortfolio')
            .get();
        smartmeta.map((item: any) => {
            item.saveImage = []
            if (item.PercentComplete != undefined) {
                item.PercentComplete = parseInt((item.PercentComplete).toFixed(0));
            }
           
            if (item.Body != undefined) {
                item.Body = item.Body.replace(/(<([^>]+)>)/ig, '');
            }
            if (item.BasicImageInfo != undefined) {
                item.saveImage.push(JSON.parse(item.BasicImageInfo))
            }
            if(item.Priority_x0020_Rank != undefined){
                currentUsers.map((rank:any)=>{
                 if(rank.rank == item.Priority_x0020_Rank){
                    item.Priority_x0020_Rank=rank.rankTitle;
                 }
                })
            }
            setEditData(item)
        })

    }
    const PercentCompleted = (PercentComplete: any, status: any, index: any) => {
        if (TaskStatus != undefined) {
            TaskStatus.map((val: any) => {
                if (val.ID == index) {
                    setPercentCompletecheck(true)

                    if (val.status != undefined) {
                        val.status = parseInt((val.status).toFixed(0));
                    }
                    EditData.PercentComplete=val.status 
                    setPercentComplete(val.Title);

                }
            })
        }
       
        
    }
    const setTime = function (item: any, val: any) {
        item.Mileage = val;
        //setEditData((EditData: any) => ([...EditData]));
    }
    const setModalIsOpenToFalse = () => {
        setModalIsOpen(false)
    }
    let currentUsers = [
        { rankTitle: 'Select Item Rank', rank: null }, { rankTitle: '(8) Top Highlights', rank: 8 }, { rankTitle: '(7) Featured Item', rank: 7 }, { rankTitle: '(6) Key Item', rank: 6 }, { rankTitle: '(5) Relevant Item', rank: 5 }, { rankTitle: '(4) Background Item', rank: 4 }, { rankTitle: '(2) to be verified', rank: 2 }, { rankTitle: '(1) Archive', rank: 1 }, { rankTitle: '(0) No Show', rank: 0 }
    ]
    
    var component = ''
    var smartComponentsIds: any = [];
    const SaveData = async (child: any) => {

        var UploadImage: any = []
        var item: any = {}
        images.map((items: any) => {
            if (items.dataURL != undefined) {
                var imgUrl = CurrentSiteUrl + '/Lists/' + EditData.siteType + '/Attachments/' + EditData.Id + '/' + items.file.name;
            } else {
                imgUrl = EditData.Item_x002d_Image != undefined ? EditData.Item_x002d_Image.Url : null;
            }
            if (items.file != undefined) {
                item['imageName'] = items.file.name;
                item['Created'] = EditData.Created;
                item['Author'] = Items.Items.Author.Title
                item['imageUrl'] = imgUrl;
            }
            UploadImage.push(item)

        })
        if(Items.Items.smartComponent != undefined){
        Items.Items.smartComponent.map((com: any) => {
            if (Items.Items.smartComponent != undefined && Items.Items.smartComponent.length >= 0) {
                $.each(Items.Items.smartComponent, function (index: any, smart: any) {
                    smartComponentsIds.push(smart.Id);
                })
            }
        })
        if(EditData.Component == undefined && EditData.Component.length>0){
            EditData.Component.map((com: any) => {
    
                if (EditData.Component.smartComponent != undefined && EditData.Component.length >= 0) {
                    $.each(EditData.Component, function (index: any, smart: any) {
                        smartComponentsIds.push(smart.Id);
                    })
                }
            })
        }
        }
        var RelevantPortfolioIds:any=[]
        if(Items.Items.linkedComponent != undefined){
            Items.Items.linkedComponent.map((com: any) => {
                if (Items.Items.linkedComponent != undefined && Items.Items.linkedComponent.length >= 0) {
                    $.each(Items.Items.linkedComponent, function (index: any, smart: any) {
                        RelevantPortfolioIds.push(smart.Id);
                    })
                }
            })
        }
            if(EditData.RelevantPortfolio != undefined && EditData.RelevantPortfolio.length>0){
                EditData.Component.map((com: any) => {
        
                    if (EditData.RelevantPortfolio.smartComponent != undefined && EditData.RelevantPortfolio.length >= 0) {
                        $.each(EditData.RelevantPortfolio, function (index: any, smart: any) {
                            RelevantPortfolioIds.push(smart.Id);
                        })
                    }
                })
            }
            
   //let Rank = parseInt(saveData.Rank)
let PercentComplete= saveData.PercentComplete/10
      //var CreatedDate = Moment(saveData.Created, Moment.defaultFormatUtc)

        let web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/SP');

        await web.lists.getById(Items.Items.listId).items.filter("FileDirRef eq '/sites/HHHH/SP/Lists/TaskTimeSheetListNew/Smalsus/Santosh Kumar").getById(Items.Items.ID).update({
            IsTodaysTask:saveData.IsTodaysTask == "" ? EditData.IsTodaysTask : saveData.IsTodaysTask,
            Priority_x0020_Rank:itemRank == undefined ? EditData.Priority_x0020_Rank : itemRank,
            Title: saveData.Title == "" ? EditData.Title : saveData.Title,
            Priority:Prriority == "" ? EditData.Priority : Prriority,
            //StartDate: saveData.Created == undefined ? new Date(EditData.StartDate).toDateString(): new Date(saveData.Created).toDateString(),
            PercentComplete: status == undefined ? EditData.PercentComplete :status,
            ComponentId: { "results": (smartComponentsIds != undefined && smartComponentsIds.length>0)?smartComponentsIds:''},
            Categories:Items.Items.Categories==""?EditData.Categories:Items.Items.Categories,
           RelevantPortfolioId: { "results": (RelevantPortfolioIds != undefined && RelevantPortfolioIds.length>0)?RelevantPortfolioIds:'' },
            //DueDate:saveData.DueDate == undefined ? new Date(EditData.DueDate).toDateString() : new Date(saveData.DueDate).toDateString()
            // BasicImageInfo: JSON.stringify(UploadImage)
        }).then((res: any) => {

            console.log(res);
            Items.Call();


        })

    }
    const saveItemrank=(e:any)=>{
        var Rank =e.target.value;
        currentUsers.map((item:any)=>{
            if(item.rankTitle==Rank){
                setitemRank(item.rank)
            }
        })
    }
    let TaskStatus = [
        {
            "Title": "01% For Approval",
            "ID": 0,
            "status": 1,
        },
        {
            "Title": "  02% Follow up",
            "ID": 1,
            status: 2,
        },
        {
            "Title": "03% Approved",
            "ID": 2,
            "status": 4,
        },
        {
            "Title": "05% Acknowledged",
            "ID": 3,
            "status": 5,
        },
        {
            "Title": "10% working on it",
            "ID": 4,
            "status": 10,
        },
        {
            "Title": " 70% Re-Open",
            "ID": 5,
            "status": 70,
        },
        {
            "Title": "80% In QA Review",
            "ID": 6,
            "status": 70,
        },
        {
            "Title": "90% Task completed",
            "ID": 7,
            "status": 90,
        },
        {
            "Title": "93% For Review",
            "ID": 8,
            "status": 93,
        },
        {
            "Title": " 96% Follow-up later",
            "ID": 9,
            "status": 96,
        },
        {
            "Title": "99% Completed",
            "ID": 10,
            "status": 99,
        },
        {
            "Title": "100% Closed",
            "ID": 11,
            "status": 100,
        }
    ]
    return (
        <>



            <Modal
                isOpen={TaskStatuspopup}
                onDismiss={closeTaskStatusUpdatePoup}
                isBlocking={false}

            >

                <div id="EditGrueneContactSearch">
                    <div className="modal-dialog modal-sm">
                        <div className="modal-content" ng-cloak>
                            <div className="modal-header">
                                <h5 className="modal-title"> Update Task Status</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={closeTaskStatusUpdatePoup}></button>


                            </div>
                            <div className="modal-body clearfix bg-f5f5">
                                {TaskStatus.map((item: any, index) => {
                                    return (
                                        <>
                                            <div ng-show="Completed==='For Approval'" className="radio">
                                                <label className="l-radio">
                                                    <input className="form-check-input mt-4" name="radioCompleted"
                                                        type="radio" value="For Approval" defaultChecked={item.PercentComplete }
                                                        onClick={() => PercentCompleted(item.Title, item.status, index)} />
                                                    {item.Title}
                                                </label>

                                            </div>
                                        </>
                                    )
                                })}


                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" onClick={closeTaskStatusUpdatePoup}>
                                    OK
                                </button>

                            </div>




                        </div>
                    </div>
                </div>
            </Modal>
            {/* <Modal
                isOpen={modalIsOpen}
                onDismiss={setModalIsOpenToFalse}
                isBlocking={false}
            > */}
            <Modal
                isOpen={modalIsOpen}
                onDismiss={setModalIsOpenToFalse}
                isBlocking={false}>

                <div id="EditGrueneContactSearch">

                    <div className="modal-dailog modal-lg">
                        <div className="modal-content" ng-cloak>
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Task Popup</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={Items.Call}></button>


                            </div>

                            <div className="modal-body ">

                                <ul className="nav nav-tabs" id="myTab" role="tablist">
                                    <button className="nav-link active" id="BASIC-INFORMATION" data-bs-toggle="tab" data-bs-target="#BASICINFORMATION" type="button" role="tab" aria-controls="BASICINFORMATION" aria-selected="true">BASICINFORMATION</button>

                                    <button className="nav-link" id="TIME-SHEET" data-bs-toggle="tab" data-bs-target="#TIMESHEET" type="button" role="tab" aria-controls="TIMESHEET" aria-selected="false">TIMESHEET</button>



                                </ul>
                                {/* {EditData.map((items: any) => {
                                    return (
                                        <> */}

                                <div className="border border-top-0 clearfix p-3 tab-content " id="myTabContent">
                                    <div className="tab-pane  show active" id="BASICINFORMATION" role="tabpanel" aria-labelledby="BASICINFORMATION">


                                        <div className="row">

                                            <div className="col-md-5">

                                                <div className="col-12 mb-10" title="Task Name">

                                                    <label className="d-flex justify-content-between align-items-center mb-0">Title
                                                        <span className="form-check">
                                                            <input className="form-check-input" type="checkbox" id="isChecked" defaultChecked={EditData.IsTodaysTask} onChange={(e) => setSaveData({ ...saveData, IsTodaysTask: e.target.value })}/>
                                                            <label className="form-check-label">workingToday</label>
                                                        </span>
                                                    </label>
                                                    <input type="text" className="form-control" placeholder="Task Name"
                                                        ng-required="true" defaultValue={EditData.Title} onChange={(e) => setSaveData({ ...saveData, Title: e.target.value })} />
                                                </div>

                                                <div className="mx-0 row  mb-10">
                                                    <div className="col ps-0">

                                                        <label className="form-label" >Start Date</label>
                                                        <input type="text" autoComplete="off" id="start
                                                                 Datepicker"
                                                            placeholder="DD/MM/YYYY" className="form-control" onChange={(e) => setSaveData({ ...saveData, Created: e.target.value })} defaultValue={EditData.Created != null ? Moment(EditData.Created).format('DD/MM/YYYY') : ""} />

                                                    </div>
                                                    <div className="col">

                                                        <label className="form-label">Due Date</label>
                                                        <span title="Re-occurring Due Date">
                                                            <input type="checkbox" className="form-check-input ms-2"
                                                                ng-model="dueDatePopUp"
                                                                ng-click="OpenDueDatePopup()"/>
                                                        </span>
                                                        <input type="text" autoComplete="off" id="dueDatePicker"
                                                            placeholder="DD/MM/YYYY" className="form-control"
                                                            defaultValue={EditData.DueDate != null ? Moment(EditData.DueDate).format('DD/MM/YYYY') : ""} onChange={(e) => setSaveData({ ...saveData, DueDate: e.target.value })}  />

                                                    </div>
                                                    <div className="col">

                                                        <label className="form-label"
                                                        >CompletedDate</label>
                                                        <input type="text" autoComplete="off"
                                                            id="CompletedDatePicker" placeholder="DD/MM/YYYY"
                                                            className="form-control" />

                                                    </div>
                                                    <div className="col pe-0">
                                                        <label className="form-label"></label>
                                                        <select className="full_width searchbox_height"  style={{marginTop:"24px"}} defaultValue={EditData.Priority_x0020_Rank} onClick={(e)=>saveItemrank(e)}>
                                                            <option>{EditData.Priority_x0020_Rank==undefined?'select Item Rank':EditData.Priority_x0020_Rank}</option>
                                                            {currentUsers.map(function (h: any, i: any) {
                                                                return (
                                                                    <option key={i} defaultValue={EditData.Priority_x0020_Rank} >{EditData.Priority_x0020_Rank == h.rankTitle ? EditData.Priority_x0020_Rank : h.rankTitle}</option>
                                                                )
                                                            })}
                                                        </select>
                                                    </div>

                                                </div>

                                                <div className="mx-0 row  mb-10">
                                                    <div className="col ps-0">

                                                        <div className="input-group mb-10">
                                                            <label ng-show="Item.SharewebTaskType.Title!='Project' && Item.SharewebTaskType.Title!='Step' && Item.SharewebTaskType.Title!='MileStone'">

                                                                <span className="form-check form-check-inline mb-0">
                                                                    <input type="radio" id="Components"
                                                                        name="Portfolios" defaultChecked={true}
                                                                        title="Component"
                                                                        ng-model="PortfolioTypes"
                                                                        ng-click="getPortfoliosData()"
                                                                        className="form-check-input" />
                                                                    <label className="form-check-label mb-0">Component</label>
                                                                </span>
                                                                <span className="form-check form-check-inline mb-0">
                                                                    <input type="radio" id="Services"
                                                                        name="Portfolios" value="Services"
                                                                        title="Services"
                                                                        ng-model="PortfolioTypes"
                                                                        ng-click="getPortfoliosData()"
                                                                        className="form-check-input" />
                                                                    <label className="form-check-label mb-0">Services</label>
                                                                </span>


                                                            </label>
                                                            <input type="text" ng-model="SearchService"
                                                                    ng-hide="ServicesmartComponent.length>0 || smartComponent.length>0"
                                                                    className="form-control"
                                                                    id="{{PortfoliosID}}" autoComplete="off" />
                                                                    <span className="input-group-text"
                                                                        ng-hide="(ServicesmartComponent.length>0 || smartComponent.length>0)">
                                                                        <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif"
                                                                            onClick={(e) => EditComponent(EditData, 'Componet')} />
                                                                    </span>
                                                            {(Items.Items.smartComponent != undefined) ?
                                                                <>
                                                                    {Items.Items.smartComponent.map((com: any) => {
                                                                        return (
                                                                            <>

                                                                                <div className="block ng-scope">
                                                                                    <a className="hreflink ng-binding" target="_blank" href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=${com.ID}`}>{com.Title}</a>
                                                                                    <a className="hreflink" ng-click="removeSmartComponent(item.Id)"></a>
                                                                                    <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/_layouts/images/delete.gif" data-themekey="#" />
                                                                                    <span className="input-group-text"
                                                                                        ng-hide="(ServicesmartComponent.length>0 || smartComponent.length>0)">

                                                                                        <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif"
                                                                                            onClick={(e) => EditComponent(EditData, 'Componet')} />

                                                                                    </span>

                                                                                </div>
                                                                            </>
                                                                        )
                                                                    })}
                                                                </> :

                                                              
                                                                <>
                                                                    { EditData.Component ? EditData.Component.map((com: any) => {
                                                                        return (
                                                                            <>

                                                                                <div className="block ng-scope">
                                                                                    <a className="hreflink ng-binding" target="_blank" href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=${com.ID}`}>{com.Title}</a>
                                                                                    <a className="hreflink" ng-click="removeSmartComponent(item.Id)"></a>
                                                                                    <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/_layouts/images/delete.gif" data-themekey="#" />
                                                                                    <span className="input-group-text"
                                                                                        ng-hide="(ServicesmartComponent.length>0 || smartComponent.length>0)">

                                                                                        <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif"
                                                                                            onClick={(e) => EditComponent(EditData, 'Componet')} />

                                                                                    </span>

                                                                                </div>
                                                                            </>
                                                                        )
                                                                    }):''}
                                                                </>
                                                            }
                                                           

                                                        </div>

                                                        <div className="input-group mb-10">
                                                            <label className="form-label" ng-hide="item==='TimesheetCategories'"
                                                                ng-repeat="item in filterGroups">
                                                                Categories
                                                            </label>
                                                            <input type="text" className="form-control"
                                                                id="txtCategories" />
                                                            
                                                            <span className="input-group-text">

                                                                <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif"
                                                                    onClick={(e) => EditComponentPicker(EditData, 'Categories')} />

                                                            </span>
                                                        </div>
                                                        <div className="col">
                                                            <div className="col" ng-if="item.SmartSuggestions" ng-repeat="item in AllCategories">
                                                                <div ng-show="item.Title!='Approval'&&item.Title!='Email Notification'"
                                                                    className="form-check">
                                                                    <input className="form-check-input" ng-checked="isMainTermSelected(item)"

                                                                        type="checkbox"
                                                                        ng-click="selectRootLevelTerm(item,type)" />
                                                                    <label className="form-check-label">Phone</label>
                                                                </div>

                                                                <div ng-show="item.Title==='Email Notification'"
                                                                    className="form-check">
                                                                    <input className="form-check-input" ng-checked="isMainTermSelected(item)"

                                                                        type="checkbox"
                                                                        ng-click="selectRootLevelTerm(item)" />
                                                                    <label>Email Notification</label>
                                                                    <span><i ng-show="showEmailSubCategory && CurrentSubSiteName !='ksl'"
                                                                        ng-click="openCategoryUpdatePoup(item.Title)"
                                                                        className="fa fa-pencil ml-10"
                                                                        aria-hidden="true"></i>
                                                                    </span>

                                                                </div>
                                                                <div ng-show="item.Title==='Email Notification'"
                                                                    className="form-check">
                                                                    <input className="form-check-input" ng-checked="isMainTermSelected(item)" type="checkbox" ng-click="selectRootLevelTerm(item)" />
                                                                    <label>Immmediate</label>
                                                                    <span><i ng-show="showEmailSubCategory && CurrentSubSiteName !='ksl'"
                                                                        ng-click="openCategoryUpdatePoup(item.Title)"
                                                                        className="fa fa-pencil ml-10"
                                                                        aria-hidden="true"></i>
                                                                    </span>

                                                                </div>
                                                                
                                                         {Items.Items.Categories != "" ?
                                                                 <>   
                                                                <div className="block">
                                                                <a className="hreflink ng-binding" target="_blank" href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=123`}>{Items.Items.Categories}</a>
                                                                   <a className="hreflink" ng-click="removeSmartComponent(item.Id)"></a>
                                                                 <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/_layouts/images/delete.gif" data-themekey="#" />
                                                                <span className="input-group-text">

                                                               

                                                            </span>
                                                            </div>
                                                            </>:
                                                             <>   
                                                             {(EditData.Categories != undefined) &&  
                                                             <div className="block">
                                                                <a className="hreflink ng-binding" target="_blank" href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=123`}>{EditData.Categories}</a>
                                                                   <a className="hreflink" ng-click="removeSmartComponent(item.Id)"></a>
                                                                 <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/_layouts/images/delete.gif" data-themekey="#" />
                                                                <span className="input-group-text">

                                                              
                                                            </span>
                                                            </div>
                                                            }
                                                            
                                                         
                                                         </>}
                                                            </div>

                                                            <div
                                                                className="form-check">
                                                                <label>Approval</label>
                                                                <input ng-checked="isMainTermSelected(item)"
                                                                    type="checkbox"
                                                                    className="form-check-input" />
                                                            </div>
                                                            <div className="col ps-4">   <div
                                                                className="form-check">
                                                                <label>Normal Approval</label>
                                                                <input ng-checked="isMainTermSelected(item)"
                                                                    type="radio"
                                                                    className="form-check-input" />
                                                            </div>
                                                                <div
                                                                    className="form-check">
                                                                    <label> Complex Approval</label>
                                                                    <input ng-checked="isMainTermSelected(item)"
                                                                        type="radio"
                                                                        className="form-check-input" />
                                                                </div>
                                                                <div
                                                                    className="form-check">
                                                                    <label> Quick Approval</label>
                                                                    <input ng-checked="isMainTermSelected(item)"
                                                                        type="radio"
                                                                        className="form-check-input" />
                                                                </div>  </div>




                                                        </div>

                                                    </div>
                                                    <div className="col">
                                                        <div className="col-12 mb-10">
                                                            <label ng-bind-html="GetColumnDetails('priority') | trustedHTML"></label>
                                                            <input type="text" className="form-control"
                                                                placeholder="Priority" 
                                                            />
                                                            <ul>
                                                                <li className="form-check">

                                                                    <input className="form-check-input"
                                                                        name="radioPriority" type="radio"
                                                                        value="(1) High" checked={EditData.Priority === "(1) High"?true:''}
                                                                        onChange={(e:any) => setPriority("(1) High")} />High

                                                                </li>
                                                                <li className="form-check">

                                                                    <input className="form-check-input" name="radioPriority"
                                                                        type="radio" value="(2) Normal" onChange={(e) => setPriority("(4) Normal")}
                                                                        checked={EditData.Priority === "(4) Normal"?true:''}/>Normal

                                                                </li>
                                                                <li className="form-check">

                                                                    <input className="form-check-input" name="radioPriority"
                                                                        type="radio" value="(3) Low" onChange={(e) => setPriority("(1) Low")}
                                                                        checked={EditData.Priority === "(1) Low"?true:''}></input>Low
                                                                </li>
                                                            </ul>
                                                        </div>
                                                        <div className="col-12 mb-10">
                                                            <label className="form-label">Client Activity</label>
                                                            <input type="text" className="form-control" ng-required="true"
                                                                ng-model="Item.ClientActivity" />
                                                        </div>
                                                        <div className="col-12 mb-10">
                                                            <div className="input-group">
                                                                <label className="form-label">
                                                                    Linked Service
                                                                </label>
                                                                <input type="text" readOnly
                                                                    className="form-control"
                                                                    id="txtEventComponent" autoComplete="off" /><span
                                                                        role="status" aria-live="polite"
                                                                        className="ui-helper-hidden-accessible"></span>
                                                                <span className="input-group-text">
                                                                    <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif"
                                                                        onClick={(e) => EditLinkedServies(EditData, 'Componet')} />
                                                                </span>
                                                            </div>
                                                            <div>
                                                             
                                                                {((Items.Items.linkedComponent != undefined) && (Items.Items.linkedComponent.length>0)) ?
                                                                <>
                                                                    {Items.Items.linkedComponent.map((com: any) => {
                                                                        return (
                                                                            <>

                                                                                <div className="block ng-scope">
                                                                                    <a className="hreflink ng-binding" target="_blank" href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=${com.ID}`}>{com.Title}</a>
                                                                                    <a className="hreflink" ng-click="removeSmartComponent(item.Id)"></a>
                                                                                    <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/_layouts/images/delete.gif" data-themekey="#" />
                                                                                    <span className="input-group-text"
                                                                                        ng-hide="(ServicesmartComponent.length>0 || smartComponent.length>0)">

                                                                                        <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif"
                                                                                            onClick={(e) => EditLinkedServies(EditData, 'Componet')} />

                                                                                    </span>

                                                                                </div>
                                                                            </>
                                                                        )
                                                                    })}
                                                                </> :
                                                                <>
                                                                {((EditData.RelevantPortfolio != undefined) && (EditData.RelevantPortfolio.length>0)) &&
                                                                <>
                                                                 {EditData.RelevantPortfolio.map((com: any) => {
                                                                    return (
                                                                        <>

                                                                            <div className="block ng-scope">
                                                                                <a className="hreflink ng-binding" target="_blank" href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=${com.ID}`}>{com.Title}</a>
                                                                                <a className="hreflink" ng-click="removeSmartComponent(item.Id)"></a>
                                                                                <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/_layouts/images/delete.gif" data-themekey="#" />
                                                                                <span className="input-group-text"
                                                                                    ng-hide="(ServicesmartComponent.length>0 || smartComponent.length>0)">

                                                                                    <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif"
                                                                                        onClick={(e) => EditLinkedServies(EditData, 'Componet')} />

                                                                                </span>

                                                                            </div>
                                                                        </>
                                                                    )
                                                                })}
                                                                </>
                                                            }
                                                            </>
                                                              }
                                                            </div>
                                                        </div>
                                                        {/* <div className="col-12"
                                                            ng-repeat="item in AllRelevantTasks track by $index">
                                                            <div className="hhProcesscat">
                                                                <a className="hreflink" target="_blank"
                                                                    ng-href="{{pageContext}}/SitePages/Task-Profile.aspx?taskId={{item.Id}}&Site={{item.siteType}}"> item.Title </a>
                                                                <a className="hreflink"
                                                                    ng-click="removeAllRelevantTasks(item.Id)">
                                                                    <img ng-src="/_layouts/images/delete.gif" />
                                                                </a>
                                                            </div>
                                                        </div> */}
                                                        <div className="col-12" title="Relevant Portfolio Items">
                                                            <div className="input-group">
                                                                <label className="form-label"> Linked Component Task </label>
                                                                <input type="text" ng-model="SearchComponent"
                                                                    className="form-control "
                                                                    id="{{RelevantPortfolioName==='Linked Service'?'txtRelevantServiceSharewebComponent':'txtRelevantSharewebComponent'}}"
                                                                    autoComplete="off" />

                                                                <span className="input-group-text">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                                                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M33.5163 8.21948C33.058 8.34241 32.4072 8.6071 32.0702 8.80767C31.7334 9.00808 26.7046 13.9214 20.8952 19.7259L10.3328 30.2796L9.12891 35.1C8.46677 37.7511 7.95988 39.9549 8.0025 39.9975C8.04497 40.0399 10.2575 39.5397 12.919 38.8857L17.7581 37.6967L28.08 27.4328C33.7569 21.7875 38.6276 16.861 38.9036 16.4849C40.072 14.8925 40.3332 12.7695 39.5586 11.1613C38.8124 9.61207 37.6316 8.62457 36.0303 8.21052C34.9371 7.92775 34.5992 7.92896 33.5163 8.21948ZM35.7021 10.1369C36.5226 10.3802 37.6953 11.5403 37.9134 12.3245C38.2719 13.6133 38.0201 14.521 36.9929 15.6428C36.569 16.1059 36.1442 16.4849 36.0489 16.4849C35.8228 16.4849 31.5338 12.2111 31.5338 11.9858C31.5338 11.706 32.8689 10.5601 33.5598 10.2469C34.3066 9.90852 34.8392 9.88117 35.7021 10.1369ZM32.3317 15.8379L34.5795 18.0779L26.1004 26.543L17.6213 35.008L17.1757 34.0815C16.5838 32.8503 15.1532 31.437 13.9056 30.8508L12.9503 30.4019L21.3663 21.9999C25.9951 17.3788 29.8501 13.5979 29.9332 13.5979C30.0162 13.5979 31.0956 14.6059 32.3317 15.8379ZM12.9633 32.6026C13.8443 32.9996 14.8681 33.9926 15.3354 34.9033C15.9683 36.1368 16.0094 36.0999 13.2656 36.7607C11.9248 37.0836 10.786 37.3059 10.7347 37.2547C10.6535 37.1739 11.6822 32.7077 11.8524 32.4013C11.9525 32.221 12.227 32.2709 12.9633 32.6026Z" fill="#333333" />
                                                                    </svg>
                                                                </span>

                                                            </div>
                                                        </div>
                                                        <div className="col-12" title="Connect Service Tasks">

                                                            <div className="col-sm-11 pad0 taskprofilepagegreen text-right">
                                                                <a ng-click="openRelevantServiceTaskPopup('Services');">
                                                                </a>
                                                            </div>
                                                            <div className="row taskprofilepagegreen">

                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>

                                                <div className="col-12 mb-10">
                                                    <div className="input-group">
                                                        <label className="form-label">Relevant URL</label>
                                                        <input type="text" className="form-control" placeholder="Url"
                                                            ng-model="Item.component_x0020_link.Url" />

                                                        <span className="input-group-text">
                                                            <a target="_blank" ng-show="Item.component_x0020_link!=undefined"
                                                                ng-href="{{Item.component_x0020_link.Url}}"
                                                                ng-bind-html="GetColumnDetails('open') | trustedHTML"><svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 48 48" fill="none">
                                                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M12.3677 13.2672C11.023 13.7134 9.87201 14.4471 8.99831 15.4154C6.25928 18.4508 6.34631 23.1488 9.19578 26.0801C10.6475 27.5735 12.4385 28.3466 14.4466 28.3466H15.4749V27.2499V26.1532H14.8471C12.6381 26.1532 10.4448 24.914 9.60203 23.1898C8.93003 21.8151 8.9251 19.6793 9.5906 18.3208C10.4149 16.6384 11.9076 15.488 13.646 15.1955C14.7953 15.0022 22.5955 14.9933 23.7189 15.184C26.5649 15.6671 28.5593 18.3872 28.258 21.3748C27.9869 24.0644 26.0094 25.839 22.9861 26.1059L21.9635 26.1961V27.2913V28.3866L23.2682 28.3075C27.0127 28.0805 29.7128 25.512 30.295 21.6234C30.8413 17.9725 28.3779 14.1694 24.8492 13.2166C24.1713 13.0335 23.0284 12.9942 18.5838 13.0006C13.785 13.0075 13.0561 13.0388 12.3677 13.2672ZM23.3224 19.8049C18.7512 20.9519 16.3624 26.253 18.4395 30.6405C19.3933 32.6554 20.9948 34.0425 23.1625 34.7311C23.9208 34.9721 24.5664 35 29.3689 35C34.1715 35 34.8171 34.9721 35.5754 34.7311C38.1439 33.9151 39.9013 32.1306 40.6772 29.5502C41 28.4774 41.035 28.1574 40.977 26.806C40.9152 25.3658 40.8763 25.203 40.3137 24.0261C39.0067 21.2919 36.834 19.8097 33.8475 19.6151L32.5427 19.53V20.6267V21.7236L33.5653 21.8132C35.9159 22.0195 37.6393 23.0705 38.4041 24.7641C39.8789 28.0293 38.2035 31.7542 34.8532 32.6588C33.8456 32.9309 25.4951 32.9788 24.1462 32.7205C22.4243 32.3904 21.0539 31.276 20.2416 29.5453C19.8211 28.6492 19.7822 28.448 19.783 27.1768C19.7837 26.0703 19.8454 25.6485 20.0853 25.1039C20.4635 24.2463 21.3756 23.2103 22.1868 22.7175C22.8985 22.2851 24.7121 21.7664 25.5124 21.7664H26.0541V20.6697V19.573L25.102 19.5851C24.5782 19.5919 23.7775 19.6909 23.3224 19.8049Z" fill="#333333" />
                                                                </svg></a>
                                                        </span>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className="col-md-3">
                                                <div className="">
                                                    <div ng-show="SiteComposition.length > 0" className="">
                                                        <div className="panel panel-primary-head blocks"

                                                            id="t_draggable1">
                                                            <div className="panel-heading profileboxclr"
                                                            >
                                                                <h3 className="panel-title" style={{ textAlign: "inherit" }}>
                                                                    <span className="lbltitleclr">Site
                                                                        Composition</span>

                                                                    <span className="pull-left">
                                                                        <span
                                                                            ng-if="!expand_collapseSiteComosition  &&Item.Portfolio_x0020_Type==='Component'"
                                                                            style={{ backgroundColor: "#f5f5f5" }}
                                                                            onClick={() => ExpandSiteComposition()}>
                                                                            <img style={{ width: "10px" }}
                                                                                src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png" />
                                                                        </span>

                                                                    </span>
                                                                </h3>
                                                            </div>
                                                            {/* {composition === true ?
                                                                            <div className='spxdropdown-menu'>
                                                    
                                                                            <ul>
                                                                                {  myarray1.map((item: any) =>
                    
                                                                                    <li className="dropdown-item">
                                                                                        <span>
                                                                                            <img style={{ width: "22px" }} src={item.SiteImages} data-themekey="#" />
                                                                                        </span>
                                                                                        <span >
                                                                                           
                                                                                            {(item.ClienTimeDescription != undefined) &&
                                                                                                <span className="ng-binding">
                                                                                                 
                    
                                                                                                    {parseInt(item.ClienTimeDescription)}%
                    
                                                                                                </span>
                                                                                            }
                                                                                        </span>
                                                                                        {item.Title == 'EPS' &&
                                                                                            <span>
                                                                                                {myarray2.length != 0 ? myarray2.map((client: any) => {
                                                                                                    return (
                                                                                                        <div className="Members-Item">
                    
                                                                                                            <div ng-show="client.siteName=='EPS'" className="user-Member-img"   ng-repeat="client in Task.ClientCategory.results">
                                                                                                                {(client.Title == "Kontakt Verwaltung" || client.Title == " Steuerungsbericht der Direktion" || client.Title == "Shareweb Maintenance" || client.Title == "Newsletter Einbindung" || client.Title == "PSE-Partnerschaften") &&
                                                                                                                    <span>
                    
                                                                                                                        {client.Title}
                    
                                                                                                                    </span>
                                                                                                                }
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    )
                                                                                                }) : ""}
                                                                                            </span>
                                                                                        }
                                                                                        {item.Title == 'Education' &&
                                                                                            <span>
                                                                                                {myarray2.length != 0 ? myarray2.map((client: any) => {
                                                                                                    return (
                                                                                                        <div className="Members-Item">
                    
                                                                                                            <div className="user-Member-img" ng-repeat="client in Task.ClientCategory.results">
                                                                                                                {(client.Title == "Contact Management") &&
                                                                                                                    <span>
                    
                                                                                                                        {client.Title}
                    
                                                                                                                    </span>
                                                                                                                }
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    )
                                                                                                }) : ""}
                                                                                            </span>
                                                                                        }
                                                                                        {item.Title == 'EI' &&
                                                                                            <span  ng-show="item.Title=='EI'" >
                                                                                                {myarray2.length != 0 ? myarray2.map((client: any) => {
                                                                                                    return (
                                                                                                        <div className="Members-Item">
                                                                                                            <div ng-show="client.siteName=='EI'" className="user-Member-img"
                                                                                                                ng-repeat="client in Task.ClientCategory.results">
                                                                                                                {(client.Title == "Nutzer Verwaltung" || client.Title == "Shareweb Maintenance" || client.Title == "EI fachspezifische Aufgaben" || client.Title == "EI Projekt-Übersicht" || client.Title == "Mithilfe Zugriffsrechte-Konzepts") &&
                                                                                                                    <span>
                    
                                                                                                                        {client.Title}
                                                                                                                    </span>
                                                                                                                }
                                                                                                            </div>
                    
                                                                                                        </div>
                                                                                                    )
                                                                                                }) : ""}
                                                                                            </span>
                                                                                        }
                                                                                    </li>
                                                                                ) }
                                                                            </ul>
                                                                        
                                                                            </div>
                                                                            : ""}  */}
                                                        </div>
                                                    </div>
                                                </div>


                                                <div className="col mb-10">
                                                    <div className="input-group">
                                                        <label className="form-label">status</label>
                                                        <input type="text" className="form-control" placeholder="% Complete" defaultValue={EditData.PercentComplete != undefined ?EditData.PercentComplete  : status} onChange={(e) => setSaveData({ ...saveData, PercentComplete: e.target.value })} />
                                                        <span className="input-group-text">
                                                            <a onClick={() => openTaskStatusUpdatePoup()}>   <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M33.5163 8.21948C33.058 8.34241 32.4072 8.6071 32.0702 8.80767C31.7334 9.00808 26.7046 13.9214 20.8952 19.7259L10.3328 30.2796L9.12891 35.1C8.46677 37.7511 7.95988 39.9549 8.0025 39.9975C8.04497 40.0399 10.2575 39.5397 12.919 38.8857L17.7581 37.6967L28.08 27.4328C33.7569 21.7875 38.6276 16.861 38.9036 16.4849C40.072 14.8925 40.3332 12.7695 39.5586 11.1613C38.8124 9.61207 37.6316 8.62457 36.0303 8.21052C34.9371 7.92775 34.5992 7.92896 33.5163 8.21948ZM35.7021 10.1369C36.5226 10.3802 37.6953 11.5403 37.9134 12.3245C38.2719 13.6133 38.0201 14.521 36.9929 15.6428C36.569 16.1059 36.1442 16.4849 36.0489 16.4849C35.8228 16.4849 31.5338 12.2111 31.5338 11.9858C31.5338 11.706 32.8689 10.5601 33.5598 10.2469C34.3066 9.90852 34.8392 9.88117 35.7021 10.1369ZM32.3317 15.8379L34.5795 18.0779L26.1004 26.543L17.6213 35.008L17.1757 34.0815C16.5838 32.8503 15.1532 31.437 13.9056 30.8508L12.9503 30.4019L21.3663 21.9999C25.9951 17.3788 29.8501 13.5979 29.9332 13.5979C30.0162 13.5979 31.0956 14.6059 32.3317 15.8379ZM12.9633 32.6026C13.8443 32.9996 14.8681 33.9926 15.3354 34.9033C15.9683 36.1368 16.0094 36.0999 13.2656 36.7607C11.9248 37.0836 10.786 37.3059 10.7347 37.2547C10.6535 37.1739 11.6822 32.7077 11.8524 32.4013C11.9525 32.221 12.227 32.2709 12.9633 32.6026Z" fill="#333333" />
                                                            </svg></a></span>

                                                    </div>
                                                    {/* {(EditData.PercentComplete != undefined) ?
                                                    <>
                                                    <input className="form-check-input mt-4" name="radioCompleted"
                                                        type="radio" value="For Follow-up later"
                                                        defaultChecked={true} />{EditData.PercentComplete}
                                                        </>:
                                                        <>
                                                        <input className="form-check-input mt-4" name="radioCompleted"
                                                        type="radio" value="For Follow-up later"
                                                        defaultChecked={true}/> {PercentComplete}</>} */}
                                                        



                                                </div>

                                                <div className="row">
                                                    <div className="col">
                                                        <div>
                                                            <label className="form-label" ng-bind-html="GetColumnDetails('time') | trustedHTML">Time</label>
                                                            <input type="text" className="form-control  mb-2" placeholder="Time"
                                                                defaultValue={EditData.Mileage != null ? EditData.Mileage : ""} />

                                                            <ul>
                                                                <li className="form-check">
                                                                    <input name="radioTime" className="form-check-input"
                                                                        ng-checked="Item.Mileage==='15'" type="radio"
                                                                        ng-click="SelectTime('15')" onChange={(e) => setTime(EditData, '05')} defaultChecked={EditData.Mileage == "05" ? true : false}/>Very
                                                                    Quick

                                                                </li>
                                                                <li className="form-check">

                                                                    <input name="radioTime" className="form-check-input"
                                                                        ng-checked="Item.Mileage==='60'" type="radio"
                                                                        onChange={(e) => setTime(EditData, '15')} defaultChecked={EditData.Mileage == "15"}/>Quick

                                                                </li>
                                                                <li className="form-check">

                                                                    <input name="radioTime" className="form-check-input"
                                                                        ng-checked="Item.Mileage==='240'" type="radio"
                                                                        onChange={(e) => setTime(EditData, '60')} defaultChecked={EditData.Mileage == "60"} />Medium

                                                                </li>
                                                                <li className="form-check">

                                                                    <input name="radioTime" className="form-check-input"
                                                                        ng-checked="Item.Mileage==='480'" type="radio"
                                                                        ng-click="SelectTime('480')" onChange={(e) => setTime(EditData, "240")} defaultChecked={EditData.Mileage == "240"}/>Long

                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                    <div className="col">
                                                        <div className="input-group" ng-if="AssignedToUsers.length>0">
                                                            <label className="form-label">Task Users</label>
                                                            <div className="TaskUsers">

                                                                <a ng-if="image.userImage!=undefined"
                                                                    ng-repeat="image in AssignedToUsers"
                                                                    target="_blank"
                                                                    href="https://hhhhteams.sharepoint.com/sites/HHHH/SP/PublishingImages/NewUsersImages/Santosh%20Kumar.png">
                                                                    <img ui-draggable="true" className="rounded"
                                                                        on-drop-success="dropSuccessHandler($event, $index, AssignedToUsers)"
                                                                        data-toggle="popover" data-trigger="hover" style={{ width: "25px" }}


                                                                        src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/PublishingImages/NewUsersImages/Santosh%20Kumar.png" />
                                                                </a>

                                                                
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="full_width mb-10">
                                                    <CommentCard siteUrl={Items.Items.siteUrl} userDisplayName={Items.Items.userDisplayName} listName={Items.Items.siteType} itemID={Items.Items.Id}></CommentCard>
                                                </div>
                                                <div className="pull-right">

                                                </div>
                                            </div>




                                            <div className="col-md-12">
                                                {ImageSection.map(function (Image: any) {
                                                    return (


                                                        <div ng-show="selectedAdminImageUrl != undefined && selectedAdminImageUrl != ''"
                                                        >
                                                            <div ng-show="BasicImageUrl.AdminTab==='Basic'" className="col-sm-12  mt-5">
                                                                <span className="">
                                                                    {Image.ImageName}
                                                                    <a title="Delete" data-toggle="modal"
                                                                        ng-click="deleteCurrentImage('Basic',BasicImageUrl.ImageName)">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                                                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M19.3584 5.28375C18.4262 5.83254 18.1984 6.45859 18.1891 8.49582L18.1837 9.66172H13.5918H9V10.8591V12.0565H10.1612H11.3225L11.3551 26.3309L11.3878 40.6052L11.6525 41.1094C11.9859 41.7441 12.5764 42.3203 13.2857 42.7028L13.8367 43H23.9388C33.9989 43 34.0431 42.9989 34.6068 42.7306C35.478 42.316 36.1367 41.6314 36.4233 40.8428C36.6697 40.1649 36.6735 39.944 36.6735 26.1055V12.0565H37.8367H39V10.8591V9.66172H34.4082H29.8163L29.8134 8.49582C29.8118 7.85452 29.7618 7.11427 29.7024 6.85084C29.5542 6.19302 29.1114 5.56596 28.5773 5.2569C28.1503 5.00999 27.9409 4.99826 23.9833 5.00015C19.9184 5.0023 19.8273 5.00784 19.3584 5.28375ZM27.4898 8.46431V9.66172H24H20.5102V8.46431V7.26691H24H27.4898V8.46431ZM34.4409 25.9527C34.4055 40.9816 34.4409 40.2167 33.7662 40.5332C33.3348 40.7355 14.6335 40.7206 14.2007 40.5176C13.4996 40.1889 13.5306 40.8675 13.5306 25.8645V12.0565H24.0021H34.4736L34.4409 25.9527ZM18.1837 26.3624V35.8786H19.3469H20.5102V26.3624V16.8461H19.3469H18.1837V26.3624ZM22.8367 26.3624V35.8786H24H25.1633V26.3624V16.8461H24H22.8367V26.3624ZM27.4898 26.3624V35.8786H28.6531H29.8163V26.3624V16.8461H28.6531H27.4898V26.3624Z" fill="#333333" />
                                                                        </svg>
                                                                    </a>

                                                                </span>

                                                                <div className="img">
                                                                    <a className="sit-preview hreflink preview" target="_blank"
                                                                        rel="{{BasicImageUrl.Url}}" href="{{BasicImageUrl.Url}}">
                                                                        <img id="sit-sharewebImagePopup-demo"
                                                                            ng-src="{{BasicImageUrl.Url}}?RenditionID=12"
                                                                            data-toggle="popover" data-trigger="hover"
                                                                            data-content="{{attachedFile.FileLeafRef}}"
                                                                        />
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                                }
                                                <div
                                                    className={IsShowFullViewImage != true ? 'col-sm-3 padL-0 DashboardTaskPopup-Editor above' : 'col-sm-6  padL-0 DashboardTaskPopup-Editor above'}>



                                                    <div className="image-uplod">
                                                        <ImageUploading
                                                            multiple
                                                            value={images}
                                                            onChange={onChange}
                                                            maxNumber={maxNumber}
                                                        >
                                                            {({
                                                                imageList,
                                                                onImageUpload,
                                                                onImageRemoveAll,
                                                                onImageUpdate,
                                                                onImageRemove,
                                                                isDragging,
                                                                dragProps
                                                            }: any) => (
                                                                // write your building UI
                                                                <div className="upload__image-wrapper">
                                                                    <a
                                                                        style={isDragging ? { color: "red" } : { color: "darkblue" }}
                                                                        onClick={onImageUpload}
                                                                        {...dragProps}
                                                                    >
                                                                        Upload Image
                                                                    </a>
                                                                    &nbsp;
                                                                    <a style={{ color: "darkblue", margin: "3px" }} onClick={onImageRemoveAll}>Remove all images</a>
                                                                    <span className="taskimage border mb-3">
                                                                        {imageList.map((image: any, index: any) => (
                                                                            <div key={index} className="image-item">
                                                                                <img src={image.dataURL} alt="" width="100%" className="ImageBox" />
                                                                                <div className="Footerimg d-flex align-items-center bg-fxdark  p-1 mb-10">
                                                                                    <a onClick={() => onImageUpdate(index)}><svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 48 48" fill="none">
                                                                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M6.18178 9.10429C6.0131 9.21501 5.97742 11.8728 6.01191 21.808L6.05556 34.3718L17.2248 34.4167L28.3941 34.4615V33.629V32.7963L25.3363 29.6562C23.6546 27.9291 22.2786 26.435 22.2786 26.3356C22.2786 26.1056 24.8625 23.4561 25.0871 23.4561C25.1794 23.4561 26.6292 24.8708 28.3091 26.5998L31.3633 29.7435H32.1721H32.9807V28.9999C32.9807 28.2629 32.946 28.2206 29.1147 24.2843C26.9884 22.0998 25.1739 20.3124 25.0825 20.3124C24.9911 20.3124 23.9403 21.3137 22.7474 22.5373L20.5787 24.7622L16.0787 20.1383L11.5787 15.5143L10.0031 17.1274C9.13641 18.0148 8.36994 18.7406 8.29978 18.7406C8.22962 18.7406 8.19276 17.1097 8.21807 15.1166L8.26393 11.4926L21.7265 11.4479L35.1891 11.4032V18.3029V25.2026H36.2949H37.4008L37.3567 17.1251L37.3125 9.04753L21.8539 9.00596C13.3517 8.98325 6.29916 9.02744 6.18178 9.10429ZM31.1121 14.0251C30.9252 14.2172 30.7723 14.5708 30.7723 14.811C30.7723 15.3389 31.3217 15.9462 31.7992 15.9462C32.2112 15.9462 32.9807 15.2067 32.9807 14.811C32.9807 14.4152 32.2112 13.6758 31.7992 13.6758C31.6081 13.6758 31.2989 13.8329 31.1121 14.0251ZM24.487 32.0585C24.487 32.1319 20.8367 32.1717 16.3754 32.1467L8.26393 32.1013L8.21875 27.2169L8.17356 22.3326L9.91545 20.5355L11.6575 18.7383L18.0723 25.3317C21.6003 28.958 24.487 31.985 24.487 32.0585ZM35.3024 27.5896C35.24 27.6535 35.1891 28.7145 35.1891 29.9474V32.1887H32.9807H30.7723V33.3239V34.4591H32.9807H35.1891V36.7295V39H36.2932H37.3974V36.7346V34.4692L39.6483 34.4205L41.8991 34.3718L41.9496 33.2853L42 32.199L39.7412 32.1501L37.4824 32.1013L37.435 29.7872L37.3876 27.4731H36.4016C35.8592 27.4731 35.3645 27.5255 35.3024 27.5896Z" fill="#333333" />
                                                                                    </svg></a>
                                                                                    <a style={{ margin: "3px" }} onClick={() => onImageRemove(index)}><svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 48 48" fill="none">
                                                                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M19.3584 5.28375C18.4262 5.83254 18.1984 6.45859 18.1891 8.49582L18.1837 9.66172H13.5918H9V10.8591V12.0565H10.1612H11.3225L11.3551 26.3309L11.3878 40.6052L11.6525 41.1094C11.9859 41.7441 12.5764 42.3203 13.2857 42.7028L13.8367 43H23.9388C33.9989 43 34.0431 42.9989 34.6068 42.7306C35.478 42.316 36.1367 41.6314 36.4233 40.8428C36.6697 40.1649 36.6735 39.944 36.6735 26.1055V12.0565H37.8367H39V10.8591V9.66172H34.4082H29.8163L29.8134 8.49582C29.8118 7.85452 29.7618 7.11427 29.7024 6.85084C29.5542 6.19302 29.1114 5.56596 28.5773 5.2569C28.1503 5.00999 27.9409 4.99826 23.9833 5.00015C19.9184 5.0023 19.8273 5.00784 19.3584 5.28375ZM27.4898 8.46431V9.66172H24H20.5102V8.46431V7.26691H24H27.4898V8.46431ZM34.4409 25.9527C34.4055 40.9816 34.4409 40.2167 33.7662 40.5332C33.3348 40.7355 14.6335 40.7206 14.2007 40.5176C13.4996 40.1889 13.5306 40.8675 13.5306 25.8645V12.0565H24.0021H34.4736L34.4409 25.9527ZM18.1837 26.3624V35.8786H19.3469H20.5102V26.3624V16.8461H19.3469H18.1837V26.3624ZM22.8367 26.3624V35.8786H24H25.1633V26.3624V16.8461H24H22.8367V26.3624ZM27.4898 26.3624V35.8786H28.6531H29.8163V26.3624V16.8461H28.6531H27.4898V26.3624Z" fill="#333333" />
                                                                                    </svg></a>

                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </ImageUploading>
                                                    </div>



                                                </div>

                                                <div
                                                    className={IsShowFullViewImage != true ? 'col-sm-9 toggle-task' : 'col-sm-6 editsectionscroll toggle-task'}>
                                                    <FloraEditor />
                                                    <Example />



                                                </div>
                                                {/* <div className="form-group">
                                                    <div className="col-sm-6">
                                                        <div ng-if="attachments.length > 0"
                                                            ng-repeat="attachedFiles in attachments">
                                                            <div ng-show="ImageName != attachedFiles.FileName">
                                                                <div
                                                                    ng-if="attachedFiles.FileName.toLowerCase().indexOf('.txt'.toLowerCase())> -1 || attachedFiles.FileName.toLowerCase().indexOf('.docx'.toLowerCase())> -1  || attachedFiles.FileName.toLowerCase().indexOf('.pdf'.toLowerCase())> -1  || attachedFiles.FileName.toLowerCase().indexOf('.doc'.toLowerCase())> -1 || attachedFiles.FileName.toLowerCase().indexOf('.msg'.toLowerCase())> -1 || attachedFiles.FileName.toLowerCase().indexOf('.pptx'.toLowerCase())> -1 || attachedFiles.FileName.toLowerCase().indexOf('.xls'.toLowerCase())> -1 || attachedFiles.FileName.toLowerCase().indexOf('.xlsx'.toLowerCase())> -1">
                                                                    <a
                                                                        ng-href="{{CurrentSiteUrl}}/Lists/{{Item.siteType}}/Attachments/{{attachedItemId}}/{{attachedFiles.FileName}}?web=1">attachedFiles.FileName </a>
                                                                    <a style={{ cursor: "pointer" }} title="Delete" data-toggle="modal"
                                                                        ng-click="deleteFile(attachedFiles)">
                                                                        <img ng-src="/_layouts/images/delete.gif" />
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="clearfix"></div>
                                                </div> */}
                                                {/* </div>
                                     </div> */}
                                            </div>
                                        </div>



                                    </div>
                                    <div className="tab-pane " id="TIMESHEET" role="tabpanel" aria-labelledby="TIMESHEET">
                                        <div>
                                            <TeamComposition props={Items} />


                                        </div>


                                    </div>

                                </div>

                                {/* </>
                                    )
                                })} */}
                            </div>

                            <div className="modal-footer">
                                <div className="col-sm-12 p-0">
                                    <div className="col-md-4 text-left ps-0">
                                        <div className="d-flex   align-content-center">
                                            Created <span>{Items.Items.Created != undefined && Items.Items.Created}</span> by <span
                                                className="siteColor">{Items.Items.Author.Title}</span>
                                        </div>
                                        <div>
                                            Last modified <span>{Items.Items.Modified != undefined && Items.Items.Modified}</span> by <span
                                                className="siteColor">{ Items.Items.Editor != undefined && Items.Items.Editor.Title}</span>
                                        </div>
                                        <div>
                                            <a ng-if="isOwner===true" className="hreflink">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 48 48" fill="none">
                                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M19.3584 5.28375C18.4262 5.83254 18.1984 6.45859 18.1891 8.49582L18.1837 9.66172H13.5918H9V10.8591V12.0565H10.1612H11.3225L11.3551 26.3309L11.3878 40.6052L11.6525 41.1094C11.9859 41.7441 12.5764 42.3203 13.2857 42.7028L13.8367 43H23.9388C33.9989 43 34.0431 42.9989 34.6068 42.7306C35.478 42.316 36.1367 41.6314 36.4233 40.8428C36.6697 40.1649 36.6735 39.944 36.6735 26.1055V12.0565H37.8367H39V10.8591V9.66172H34.4082H29.8163L29.8134 8.49582C29.8118 7.85452 29.7618 7.11427 29.7024 6.85084C29.5542 6.19302 29.1114 5.56596 28.5773 5.2569C28.1503 5.00999 27.9409 4.99826 23.9833 5.00015C19.9184 5.0023 19.8273 5.00784 19.3584 5.28375ZM27.4898 8.46431V9.66172H24H20.5102V8.46431V7.26691H24H27.4898V8.46431ZM34.4409 25.9527C34.4055 40.9816 34.4409 40.2167 33.7662 40.5332C33.3348 40.7355 14.6335 40.7206 14.2007 40.5176C13.4996 40.1889 13.5306 40.8675 13.5306 25.8645V12.0565H24.0021H34.4736L34.4409 25.9527ZM18.1837 26.3624V35.8786H19.3469H20.5102V26.3624V16.8461H19.3469H18.1837V26.3624ZM22.8367 26.3624V35.8786H24H25.1633V26.3624V16.8461H24H22.8367V26.3624ZM27.4898 26.3624V35.8786H28.6531H29.8163V26.3624V16.8461H28.6531H27.4898V26.3624Z" fill="#333333" />
                                                </svg> Delete this item
                                            </a>
                                            <span ng-show="CurrentSubSiteName.toLowerCase()==='sp'"> |</span>
                                            <a ng-show="CurrentSubSiteName.toLowerCase()==='sp'" className="hreflink" ng-click="OpenCopyItem();">
                                                Copy
                                                Task
                                            </a>
                                            <span ng-show="CurrentSubSiteName.toLowerCase()==='sp'"> |</span>
                                            <a ng-show="CurrentSubSiteName.toLowerCase()==='sp'" className="hreflink"
                                                ng-click="OpenCopyItem('Move Task');"> Move Task</a> |
                                            <span>
                                                <img className="hreflink" title="Version History"
                                                    ng-click="GetitemsVersionhistory(Item,Item.Id)"
                                                    src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Version_HG.png" />
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-md-8 pe-0">
                                        <div>
                                            <span>
                                                <a className="ForAll hreflink" target="_blank" ng-if="Item.siteType!='Master Tasks'"
                                                    href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Task-Profile.aspx?taskId=${Items.Items.Id}&Site=${Items.Items.siteType}`}>
                                                    Go
                                                    to
                                                    profile
                                                    page
                                                </a>

                                            </span>||
                                            <span>
                                                <a className="hreflink" ng-click="EditTimeSheet(Item)">
                                                    Save & Add Timesheet
                                                </a>
                                            </span>||
                                            <a
                                                ng-href="mailto:?subject=[{{Item.siteType}}-Tasks] {{Item.Title}}&body={{Descriptiondata}}%0A{{pageContext}}/SitePages/Task-Profile.aspx?taskId={{backupItem.Id}}%26Site={{Allsitetype}}">
                                                <img className="mail-width"
                                                    src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/32/icon_maill.png" />Share
                                                this
                                                task
                                            </a> ||<a target="_blank" ng-if="Item.siteType!='Offshore Tasks'"
                                                ng-href="{{CurrentSiteUrl}}/Lists/{{Item.siteType}}/EditForm.aspx?ID={{backupItem.Id}}">
                                                Open out-of-the-box
                                                form
                                            </a>
                                            <a target="_blank" ng-if="Item.siteType==='Offshore Tasks'"
                                                href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/Lists/SharewebQA/EditForm.aspx?ID=${Items.Items.Id}`}>
                                                Open out-of-the-box
                                                form
                                            </a>

                                            <span className="ms-2">
                                                <button ng-show="!IsShowFullViewImage" type="button" className="btn btn-primary"
                                                    ng-click="IsShowFullViewImage!=true? updateTaskRecords('UpdateTask',Item):CancelShowInFullView()" onClick={SaveData}>
                                                    Save
                                                </button>
                                                <button ng-show="IsShowFullViewImage" type="button" className="btn btn-default"
                                                    ng-click="IsShowFullViewImage!=true? updateTaskRecords('UpdateTask',Item):CancelShowInFullView()">
                                                    Close
                                                </button>
                                            </span>
                                        </div>
                                        {/* <button ng-show="!IsShowFullViewImage" type="button" className="btn btn-default" data-dismiss="modal"
                                                ng-click="IsShowFullViewImage!=true? cancelEditItem():CancelShowInFullView()">
                                                Cancel
                                            </button> */}
                                    </div>
                                </div>
                            </div>



                        </div>
                    </div >

                    {IsComponent && <ComponentPortPolioPopup props={SharewebComponent} Call={Call}></ComponentPortPolioPopup>}
                    {IsComponentPicker && <Picker props={SharewebComponent} Call={Call}></Picker>}
                    {IsServices && <LinkedComponent props={SharewebComponent} Call={Call}></LinkedComponent>}
                </div>
            </Modal>

        </>
    )
}
export default React.memo(EditTaskPopup)