import * as React from "react";
import * as $ from 'jquery';
import { Modal } from 'office-ui-fabric-react';
import * as Moment from 'moment';
import '../TaskDashboard.scss'
import { HiPencil } from 'react-icons/Hi';
import { Web } from "sp-pnp-js";
import TeamComposition from './TeamComposition';
import Picker from "./SmartMetaDataPicker";
import FloraEditor from "./TextEditor";
import Example from "./FroalaCommnetBoxes";
import ImageUploading, { ImageListType } from "react-images-uploading";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/js/dist/modal.js";
import "bootstrap/js/dist/tab.js";
import CommentCard from "../Commnet/CommentCard";
import "../../../cssFolder/Style.scss";


var IsShowFullViewImage = false;
const EditTaskPopup = (Items: any) => {
    // Id:any


    const [images, setImages] = React.useState([]);
    const maxNumber = 69;

    const [Editdata, setEditdata] = React.useState([]);
    const [state, setState] = React.useState([]);
    const [ImageSection, setImageSection] = React.useState([]);

    const [Description, setDescription] = React.useState([]);
    const [EditData, setEditData] = React.useState([]);
    const [modalIsOpen, setModalIsOpen] = React.useState(true);
    const [TaskStatuspopup, setTaskStatuspopup] = React.useState(false);
    const [composition, setComposition] = React.useState(false);
    const [PopupSmartTaxanomy, setPopupSmartTaxanomy] = React.useState(false);
    const [ComentBox, setComentBox] = React.useState(false);

    const setModalIsOpenToTrue = () => {
        setModalIsOpen(true)
    }
    React.useEffect(() => {
        GetEditdata();
        Descriptions();
    }, [])

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
    function Descriptions() {

        var institute: any = []
        var DescriptionFields: any = []
        var DescriptionItem: any = []
        var DataDescription: any = []
        var FeedbackColumncount: any = []
        var selectedAdminImageUrl: any = []
        var url = ("https://hhhhteams.sharepoint.com/sites/HHHH/SP/_api/web/lists/getbyid('091889BD-5339-4D11-960E-A8FF38DF414B')/items?$select=Id,Title,OffshoreImageUrl,FeedBack,Categories,PercentComplete");


        $.ajax({

            url: url,

            method: "GET",

            headers: {

                "Accept": "application/json; odata=verbose"

            },

            success: function (data) {

                institute = data.d.results;

                $.each(institute, function (index: any, item: any) {

                    var FeedBackParse = JSON.parse(item.FeedBack)
                    if (FeedBackParse != undefined && FeedBackParse[0].FeedBackDescriptions != undefined) {
                        DescriptionFields = FeedBackParse[0].FeedBackDescriptions
                    }
                    var addcounter = 0;
                    if (item.OffshoreImageUrl != undefined && item.OffshoreImageUrl != null && item.OffshoreImageUrl != "[]") {
                        selectedAdminImageUrl = JSON.parse(item.OffshoreImageUrl);
                        $.each(selectedAdminImageUrl, function (val: any) {
                            addcounter = val.counter;
                        })
                        setImageSection(selectedAdminImageUrl)
                    }
                    if (FeedBackParse != undefined && FeedBackParse.length > 0) {

                        // var SubDescriptionFields = { text: '', Completed: false };
                        if (FeedBackParse[0].FeedBackDescriptions != undefined) {
                            var FeedbackColumncount = 0;
                            // var FeedBackParse = JSON.parse(item.FeedBack)
                            $.each(FeedBackParse[0].FeedBackDescriptions, function (index: any, item: any) {
                                item.isAddComment = false;
                                item.isShowComment = true;
                                item.isPageType = 'taskpopup'
                                // if (item.Title.includes("<br>")) {
                                //     var newItem = item.Title.split("<br>\n");
                                //     item.Title = newItem[0];
                                // }
                                // else {
                                //     item.Title = item.Title.split(/(.{80})/).filter(O => O).join("\n");
                                // }
                                DescriptionFields.push(item);
                                FeedbackColumncount = index;
                            })
                            var commentItem: any = [];
                            $.each(DescriptionFields, function (inddex: any, comments: any) {
                                if ((comments.Comments === undefined) || (comments.Comments != undefined && comments.Comments.length === 0)) {
                                    comments.isShowComment = false;
                                }
                                $.each(comments.Comments, function (index: any, item: any) {
                                    item.isShowComment = true;
                                    item.Title = item.Title.replace(/\n/g, '<br/>');
                                    //item.Created = new Date(item.Created).format('dd MMM yyyy HH:mm');
                                    if (item.AuthorImage != undefined && item.AuthorImage != '')
                                        item.AuthorImage = item.AuthorImage.replace("https://www.hochhuth-consulting.de/sp", "https://hhhhteams.sharepoint.com/sites/HHHH");
                                    if (item.NewestCreated === undefined) {
                                        item.NewestCreated = Number(new Date(item.Created));
                                    }
                                    commentItem.push(item);
                                    if (comments.Subtext != undefined && comments.Subtext.length > 0) {
                                        $.each(comments.Subtext, function (sub: any) {
                                            sub.isShowComment = true;

                                        })
                                    }
                                });
                                // if (comments != undefined && comments.Comments != undefined && comments.Comments.length > 0)
                                // SharewebCommonFactoryService.DynamicSortitems(comments.Comments, 'NewestCreated', 'Number', 'Descending');
                                if (comments.Subtext != undefined && comments.Subtext.length > 0) {
                                    $.each(comments.Subtext, function (sub: any) {
                                        if (sub.Comments === undefined || (sub.Comments != undefined && sub.Comments.length === 0)) {
                                            sub.isShowComment = false;
                                        }
                                        else
                                            sub.isShowComment = true;
                                    })
                                }
                                DescriptionFields.Comments = commentItem;

                            });
                            var Descriptiondata = ''

                            //        if(DescriptionFields != undefined && DescriptionFields.length>0){
                            //  DataDescription = DescriptionFields[0];
                            //    //var DescriptionItem = $.parseHTML(DataDescription.Title);
                            //     DescriptionItem = DataDescription.Title.replace(/(<([^>]+)>)/ig, '');
                            //     $.each(DescriptionItem, function (indx:any,description:any) {
                            //         Descriptiondata = Descriptiondata != '' ? Descriptiondata + '; ' + description.innerText : description.innerText;

                            //     });
                            //        }


                            //var CountId = DescriptionFields[DescriptionFields.length - 1];
                            // $.each(DescriptionFields, function (item:any, index) {
                            //     if (item.Title != "" && item.Title != undefined) {
                            //         if (index === 0) {
                            //             setTimeout(function () {
                            //                 SharewebCommonFactoryService.bindBasicFroalaEditor('editDescriptionbody', item.Title, $scope.Item.Title, $scope.DescriptionFields[0]);
                            //             }, 10);
                            //         } else
                            //             item.Title = $scope.DescriptionItem(item.Title);
                            //     } else {
                            //         setTimeout(function () {
                            //             SharewebCommonFactoryService.bindBasicFroalaEditor('editDescriptionbody', null, $scope.Item.Title, $scope.DescriptionFields[0]);
                            //         }, 10);
                            //     }
                            // });
                        }
                        setDescription(DescriptionFields)
                    }
                })

                setDescription(DescriptionFields)
            },

            error: function (error) {


            }
        });
    }


    var count = 0;
    const addsubColumn = (item: any, index: any) => {

        var subIndex = index;
        var SubField = { Subtext: '', Completed: false };
        if (item.Subtext === undefined)
            item.Subtext = [];
        item.Subtext.push(SubField);
        if (!IsShowFullViewImage) {
            $(".addsubbox").click(function () {
                var x = $(window).scrollTop();
                $(window).scrollTop(x + 800);
            });
        }
        else if (IsShowFullViewImage) {
            $(".addsubbox").click(function () {
                var x = $('.editsectionscroll').scrollTop();
                $('.editsectionscroll').scrollTop(x + 600);
            });
        }

    }


    const DeletesubColumn = () => {
        setComentBox(false)
    }
    const GetEditdata = async () => {
        var DataEdit:any =[]
        const web = new Web(Items.Items.SiteUrl);
        const res = await web.lists.getById(Items.Items.listId).items
            .select("Id,Title,Priority_x0020_Rank,EstimatedTime,EstimatedTimeDescription,FeedBack,IsTodaysTask,Component/Id,component_x0020_link,Component/Title,Services/Id,Services/Title,Events/Id,PercentComplete,ComponentId,Categories,SharewebTaskLevel1No,SharewebTaskLevel2No,ServicesId,ClientActivity,ClientActivityJson,EventsId,Priority_x0020_Rank,DueDate,SharewebTaskType/Id,SharewebTaskType/Title,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title,SharewebCategories/Id,SharewebCategories/Title,AssignedTo/Id,AssignedTo/Title,Team_x0020_Members/Id,Team_x0020_Members/Title,Responsible_x0020_Team/Id,Responsible_x0020_Team/Title,ClientCategory/Id,ClientCategory/Title,Approver/Title,Approver/Id,Approver/Name&$expand=AssignedTo,Author,Editor,Component,Services,Events,SharewebTaskType,Team_x0020_Members,Responsible_x0020_Team,SharewebCategories,ClientCategory,Approver").getById(Items.Items.ID).get();
         DataEdit.push(res)
        setEditData(DataEdit)

    }
    const setModalIsOpenToFalse = () => {
        setModalIsOpen(false)
    }
    let currentUsers = [
        {
            "Id": 1,
            "ItemRank": 1,
        },
        {
            "Id": 2,
            "ItemRank": 2,
        },
        {
            "Id": 3,
            "ItemRank": 3,
        },
        {
            "Id": 4,
            "ItemRank": 4,
        },
        {
            "Id": 5,
            "ItemRank": 5,
        },
        {
            "Id": 5,
            "ItemRank": 5,
        },
        {
            "Id": 6,
            "ItemRank": 6,
        },
        {
            "Id": 7,
            "ItemRank": 7,
        },
        {
            "Id": 8,
           "ItemRank": 8,
        },
    ]
    return (
        <>
            {/* <img title="Edit Details" className="wid22" onClick={(e) => setModalIsOpenToTrue()}
                src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif" /> */}


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
                               
                                {/* <button type="button" style={{ minWidth: "10px" }} className="close" data-dismiss="modal"
                                    onClick={closeTaskStatusUpdatePoup}>
                                    &times;
                                </button> */}
                            </div>
                            <div className="modal-body clearfix bg-f5f5">

                                <div ng-show="Completed==='For Approval'" className="radio">
                                    <label className="l-radio">
                                        <input className="form-check-input mt-4" name="radioCompleted"
                                            type="radio" value="For Approval"
                                            ng-click="PercentCompleted()" ng-model="Completed" />
                                        01% For Approval
                                    </label>

                                </div>
                                <div ng-show="Completed==='Follow up'" className="radio">
                                    <label className="l-radio">
                                        <input className="form-check-input mt-4" name="radioCompleted"
                                            type="radio" value="Follow up"
                                            ng-click="PercentCompleted()" ng-model="Completed"
                                            disabled />
                                        02% Follow up
                                    </label>

                                </div>
                                <div ng-show="Completed==='Approved'" className="radio">
                                    <label className="l-radio">
                                        <input className="form-check-input mt-4" name="radioCompleted"
                                            type="radio" value="Approved"
                                            ng-click="PercentCompleted()" ng-model="Completed" />
                                        03% Approved
                                    </label>

                                </div>
                                <div ng-show="Completed==='Acknowledged'" className="radio">
                                    <label className="l-radio">
                                        <input className="form-check-input mt-4" name="radioCompleted"
                                            type="radio" value="Acknowledged"
                                            ng-click="PercentCompleted()" ng-model="Completed" />
                                        05% Acknowledged
                                    </label>

                                </div>
                                <div ng-show="Completed==='working on it'" className="radio">
                                    <label className="l-radio">
                                        <input className="form-check-input mt-4" name="radioCompleted"
                                            type="radio" value="working on it"
                                            ng-click="PercentCompleted()" ng-model="Completed" />
                                        10% working on it
                                    </label>

                                </div>
                                <div ng-show="Completed==='Re-Open'" className="radio">
                                    <label className="l-radio">
                                        <input className="form-check-input mt-4" name="radioCompleted"
                                            type="radio" value="Re-Open"
                                            ng-click="PercentCompleted()" ng-model="Completed" />
                                        70% Re-Open <span className="project-tool"
                                        >
                                            <img
                                                ng-src="{{baseUrl}}/SiteCollectionImages/ICONS/24/infoIcon.png" />
                                            <span className="tooltipte">
                                                <span className="tooltiptext"
                                                >
                                                    <div className="tooltip_Desc">
                                                        Tasks to be re-considered
                                                    </div>
                                                </span>
                                            </span>
                                        </span>
                                    </label>

                                </div>
                                <div ng-show="Completed==='In QA review'" className="radio">
                                    <label className="l-radio">
                                        <input className="form-check-input mt-4" name="radioCompleted"
                                            type="radio" value="In QA review"
                                            ng-click="PercentCompleted()" ng-model="Completed" />
                                        80% In QA Review
                                    </label>

                                </div>
                                <div ng-show="Completed==='Task completed'" className="radio">
                                    <label className="l-radio">
                                        <input className="form-check-input mt-4" name="radioCompleted"
                                            type="radio" value="Task completed"
                                            ng-click="PercentCompleted()" ng-model="Completed" />
                                        90% Task completed
                                    </label>

                                </div>
                                <div ng-show="Completed==='For Review'" className="radio">
                                    <label className="l-radio">
                                        <input className="form-check-input mt-4" name="radioCompleted"
                                            type="radio" value="For Review"
                                            ng-click="PercentCompleted()" ng-model="Completed" />
                                        93% For Review
                                    </label>

                                </div>
                                <div ng-show="Completed==='For Follow-up later'" className="radio">
                                    <label className="l-radio">
                                        <input className="form-check-input mt-4" name="radioCompleted"
                                            type="radio" value="For Follow-up later"
                                            ng-click="PercentCompleted()" ng-model="Completed" />
                                        96% Follow-up later
                                    </label>

                                </div>
                                <div ng-show="Completed==='Completed'" className="radio">
                                    <label className="l-radio">
                                        <input className="form-check-input mt-4" name="radioCompleted"
                                            type="radio" value="Completed"
                                            ng-click="PercentCompleted()" ng-model="Completed" />
                                        99% Completed
                                    </label>

                                </div>
                                <div ng-show="Completed==='Closed'" className="radio">
                                    <label className="l-radio">
                                        <input ng-disabled="!isComplete"
                                            className="form-check-input mt-4" name="radioCompleted"
                                            type="radio" value="Closed"
                                            ng-click="PercentCompleted()" ng-model="Completed" />
                                        100% Closed
                                    </label>

                                </div>

                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" ng-click="saveTaskStatusUpdatePoup()">
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
                        <h5 className="modal-title">Modal title</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"  onClick={Items.Call}></button>

       
      </div>
                          
                            <div className="modal-body ">

                                <ul className="nav nav-tabs" id="myTab" role="tablist">
                                    <button className="nav-link active" id="BASIC-INFORMATION" data-bs-toggle="tab" data-bs-target="#BASICINFORMATION" type="button" role="tab" aria-controls="BASICINFORMATION" aria-selected="true">BASICINFORMATION</button>

                                    <button className="nav-link" id="TIME-SHEET" data-bs-toggle="tab" data-bs-target="#TIMESHEET" type="button" role="tab" aria-controls="TIMESHEET" aria-selected="false">TIMESHEET</button>



                                </ul>
                               {EditData.map((items:any)=>{
                                return(
                                    <>
                                    
                                <div className="border border-top-0 clearfix p-3 tab-content " id="myTabContent">
                                    <div className="tab-pane  show active" id="BASICINFORMATION" role="tabpanel" aria-labelledby="BASICINFORMATION">

                                        
                                        <div className="row">

                                            <div className="col-md-5">

                                                <div className="col-12 mb-10" title="Task Name">

                                                    <label className="d-flex justify-content-between align-items-center mb-0">Title
                                                        <span className="form-check">
                                                            <input className="form-check-input" type="checkbox" id="isChecked" defaultChecked={items.IsTodaysTask}/>
                                                            <label className="form-check-label">workingToday</label>
                                                        </span>
                                                    </label>
                                                    <input type="text" className="form-control" placeholder="Task Name"
                                                        ng-required="true" defaultValue={items.Title}/>
                                                </div>

                                                <div className="mx-0 row  mb-10">
                                                    <div className="col ps-0">

                                                        <label className="form-label" >Start Date</label>
                                                        <input type="text" autoComplete="off" id="start
                                                        Datepicker"
                                                            placeholder="DD/MM/YYYY" className="form-control" />

                                                    </div>
                                                    <div className="col">

                                                        <label className="form-label">Due Date</label>
                                                        <span title="Re-occurring Due Date">
                                                            <input type="checkbox" className="form-check-input ms-2"
                                                                ng-model="dueDatePopUp"
                                                                ng-click="OpenDueDatePopup()" />
                                                        </span>
                                                        <input type="text" autoComplete="off" id="dueDatePicker"
                                                            placeholder="DD/MM/YYYY" className="form-control"
                                                        />

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
                                                        <select className="form-select" aria-label="Select Item Rank" >
                                                            <option value="Select" defaultValue={items.Priority_x0020_Rank}>Select Item Rank</option>
                                                            {currentUsers.map(function (item: any) {
                                                                return (
                                                                    <option value={item.Title}>{item.ItemRank}</option>
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
                                                                            name="Portfolios" value="Component"
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
                                                                       <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none"><Picker/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M33.5163 8.21948C33.058 8.34241 32.4072 8.6071 32.0702 8.80767C31.7334 9.00808 26.7046 13.9214 20.8952 19.7259L10.3328 30.2796L9.12891 35.1C8.46677 37.7511 7.95988 39.9549 8.0025 39.9975C8.04497 40.0399 10.2575 39.5397 12.919 38.8857L17.7581 37.6967L28.08 27.4328C33.7569 21.7875 38.6276 16.861 38.9036 16.4849C40.072 14.8925 40.3332 12.7695 39.5586 11.1613C38.8124 9.61207 37.6316 8.62457 36.0303 8.21052C34.9371 7.92775 34.5992 7.92896 33.5163 8.21948ZM35.7021 10.1369C36.5226 10.3802 37.6953 11.5403 37.9134 12.3245C38.2719 13.6133 38.0201 14.521 36.9929 15.6428C36.569 16.1059 36.1442 16.4849 36.0489 16.4849C35.8228 16.4849 31.5338 12.2111 31.5338 11.9858C31.5338 11.706 32.8689 10.5601 33.5598 10.2469C34.3066 9.90852 34.8392 9.88117 35.7021 10.1369ZM32.3317 15.8379L34.5795 18.0779L26.1004 26.543L17.6213 35.008L17.1757 34.0815C16.5838 32.8503 15.1532 31.437 13.9056 30.8508L12.9503 30.4019L21.3663 21.9999C25.9951 17.3788 29.8501 13.5979 29.9332 13.5979C30.0162 13.5979 31.0956 14.6059 32.3317 15.8379ZM12.9633 32.6026C13.8443 32.9996 14.8681 33.9926 15.3354 34.9033C15.9683 36.1368 16.0094 36.0999 13.2656 36.7607C11.9248 37.0836 10.786 37.3059 10.7347 37.2547C10.6535 37.1739 11.6822 32.7077 11.8524 32.4013C11.9525 32.221 12.227 32.2709 12.9633 32.6026Z" fill="#333333"/>
</svg>
                                                                    </span>
                                                                

                                                            </div>                                                  
                                                                <div className="input-group mb-10">
                                                                    <label className="form-label" ng-hide="item==='TimesheetCategories'"
                                                                        ng-repeat="item in filterGroups">
                                                                        Categories
                                                                    </label>
                                                                    <input type="text" className="form-control"
                                                                        id="txtCategories" />
                                                                    <span className="input-group-text"
                                                                        ng-show="(ServicesmartComponent.length>0 || smartComponent.length>0)">

<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none"><Picker/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M33.5163 8.21948C33.058 8.34241 32.4072 8.6071 32.0702 8.80767C31.7334 9.00808 26.7046 13.9214 20.8952 19.7259L10.3328 30.2796L9.12891 35.1C8.46677 37.7511 7.95988 39.9549 8.0025 39.9975C8.04497 40.0399 10.2575 39.5397 12.919 38.8857L17.7581 37.6967L28.08 27.4328C33.7569 21.7875 38.6276 16.861 38.9036 16.4849C40.072 14.8925 40.3332 12.7695 39.5586 11.1613C38.8124 9.61207 37.6316 8.62457 36.0303 8.21052C34.9371 7.92775 34.5992 7.92896 33.5163 8.21948ZM35.7021 10.1369C36.5226 10.3802 37.6953 11.5403 37.9134 12.3245C38.2719 13.6133 38.0201 14.521 36.9929 15.6428C36.569 16.1059 36.1442 16.4849 36.0489 16.4849C35.8228 16.4849 31.5338 12.2111 31.5338 11.9858C31.5338 11.706 32.8689 10.5601 33.5598 10.2469C34.3066 9.90852 34.8392 9.88117 35.7021 10.1369ZM32.3317 15.8379L34.5795 18.0779L26.1004 26.543L17.6213 35.008L17.1757 34.0815C16.5838 32.8503 15.1532 31.437 13.9056 30.8508L12.9503 30.4019L21.3663 21.9999C25.9951 17.3788 29.8501 13.5979 29.9332 13.5979C30.0162 13.5979 31.0956 14.6059 32.3317 15.8379ZM12.9633 32.6026C13.8443 32.9996 14.8681 33.9926 15.3354 34.9033C15.9683 36.1368 16.0094 36.0999 13.2656 36.7607C11.9248 37.0836 10.786 37.3059 10.7347 37.2547C10.6535 37.1739 11.6822 32.7077 11.8524 32.4013C11.9525 32.221 12.227 32.2709 12.9633 32.6026Z" fill="#333333"/>
</svg>

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
                                                                placeholder="Priority" defaultValue={items.Priority}
                                                               />
                                                            <ul>
                                                                <li className="form-check">

                                                                    <input className="form-check-input"
                                                                        name="radioPriority" type="radio"
                                                                        value="(1) High" ng-click="SelectPriority()"
                                                                        ng-model="Item.Priority" />High

                                                                </li>
                                                                <li className="form-check">

                                                                    <input className="form-check-input"
                                                                        name="radioPriority" type="radio"
                                                                        value="(2) Normal" ng-click="SelectPriority()"
                                                                        ng-model="Item.Priority" />Normal

                                                                </li>
                                                                <li className="form-check">

                                                                    <input className="form-check-input "
                                                                        name="radioPriority" type="radio"
                                                                        value="(3) Low" ng-click="SelectPriority()"
                                                                        ng-model="Item.Priority" />Low

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
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
<path fill-rule="evenodd" clip-rule="evenodd" d="M33.5163 8.21948C33.058 8.34241 32.4072 8.6071 32.0702 8.80767C31.7334 9.00808 26.7046 13.9214 20.8952 19.7259L10.3328 30.2796L9.12891 35.1C8.46677 37.7511 7.95988 39.9549 8.0025 39.9975C8.04497 40.0399 10.2575 39.5397 12.919 38.8857L17.7581 37.6967L28.08 27.4328C33.7569 21.7875 38.6276 16.861 38.9036 16.4849C40.072 14.8925 40.3332 12.7695 39.5586 11.1613C38.8124 9.61207 37.6316 8.62457 36.0303 8.21052C34.9371 7.92775 34.5992 7.92896 33.5163 8.21948ZM35.7021 10.1369C36.5226 10.3802 37.6953 11.5403 37.9134 12.3245C38.2719 13.6133 38.0201 14.521 36.9929 15.6428C36.569 16.1059 36.1442 16.4849 36.0489 16.4849C35.8228 16.4849 31.5338 12.2111 31.5338 11.9858C31.5338 11.706 32.8689 10.5601 33.5598 10.2469C34.3066 9.90852 34.8392 9.88117 35.7021 10.1369ZM32.3317 15.8379L34.5795 18.0779L26.1004 26.543L17.6213 35.008L17.1757 34.0815C16.5838 32.8503 15.1532 31.437 13.9056 30.8508L12.9503 30.4019L21.3663 21.9999C25.9951 17.3788 29.8501 13.5979 29.9332 13.5979C30.0162 13.5979 31.0956 14.6059 32.3317 15.8379ZM12.9633 32.6026C13.8443 32.9996 14.8681 33.9926 15.3354 34.9033C15.9683 36.1368 16.0094 36.0999 13.2656 36.7607C11.9248 37.0836 10.786 37.3059 10.7347 37.2547C10.6535 37.1739 11.6822 32.7077 11.8524 32.4013C11.9525 32.221 12.227 32.2709 12.9633 32.6026Z" fill="#333333"/>
</svg>
                                                                </span>
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
<path fill-rule="evenodd" clip-rule="evenodd" d="M33.5163 8.21948C33.058 8.34241 32.4072 8.6071 32.0702 8.80767C31.7334 9.00808 26.7046 13.9214 20.8952 19.7259L10.3328 30.2796L9.12891 35.1C8.46677 37.7511 7.95988 39.9549 8.0025 39.9975C8.04497 40.0399 10.2575 39.5397 12.919 38.8857L17.7581 37.6967L28.08 27.4328C33.7569 21.7875 38.6276 16.861 38.9036 16.4849C40.072 14.8925 40.3332 12.7695 39.5586 11.1613C38.8124 9.61207 37.6316 8.62457 36.0303 8.21052C34.9371 7.92775 34.5992 7.92896 33.5163 8.21948ZM35.7021 10.1369C36.5226 10.3802 37.6953 11.5403 37.9134 12.3245C38.2719 13.6133 38.0201 14.521 36.9929 15.6428C36.569 16.1059 36.1442 16.4849 36.0489 16.4849C35.8228 16.4849 31.5338 12.2111 31.5338 11.9858C31.5338 11.706 32.8689 10.5601 33.5598 10.2469C34.3066 9.90852 34.8392 9.88117 35.7021 10.1369ZM32.3317 15.8379L34.5795 18.0779L26.1004 26.543L17.6213 35.008L17.1757 34.0815C16.5838 32.8503 15.1532 31.437 13.9056 30.8508L12.9503 30.4019L21.3663 21.9999C25.9951 17.3788 29.8501 13.5979 29.9332 13.5979C30.0162 13.5979 31.0956 14.6059 32.3317 15.8379ZM12.9633 32.6026C13.8443 32.9996 14.8681 33.9926 15.3354 34.9033C15.9683 36.1368 16.0094 36.0999 13.2656 36.7607C11.9248 37.0836 10.786 37.3059 10.7347 37.2547C10.6535 37.1739 11.6822 32.7077 11.8524 32.4013C11.9525 32.221 12.227 32.2709 12.9633 32.6026Z" fill="#333333"/>
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
                                                                {/* <div className="hhProcesscat">
                                                                            <div
                                                                                className="col-sm-11 {{viewMoreFlag?'boxscrollbar':''}} pad0">
                                                                                <div className="block"
                                                                                    ng-repeat="item in ServiceSmartTask | limitTo: -3 track by $index "
                                                                                    ng-show="!viewMoreFlag">
                                                                                    <a className="hreflink" target="_blank"
                                                                                        ng-href="{{pageContext}}/SitePages/Task-Profile.aspx?taskId={{item.Id}}&Site={{item.siteType}}">item.Title </a>
                                                                                    <a className="hreflink"
                                                                                        ng-click="removeServiceTaskItem(item.Id)">
                                                                                        <img
                                                                                            ng-src="/_layouts/images/delete.gif" />
                                                                                    </a>
                                                                                </div>
                                                                                <div className="block"
                                                                                    ng-repeat="item in ServiceSmartTask track by $index "
                                                                                    ng-show="viewMoreFlag">
                                                                                    <a className="hreflink" target="_blank"
                                                                                        ng-href="{{pageContext}}/SitePages/Task-Profile.aspx?taskId={{item.Id}}&Site={{item.siteType}}"></a>
                                                                                    <a className="hreflink"
                                                                                        ng-click="removeServiceTaskItem(item.Id)">
                                                                                        <img
                                                                                            ng-src="/_layouts/images/delete.gif" />
                                                                                    </a>
                                                                                </div>

                                                                            </div>
                                                                            <div className="col-sm-12 text-center  mt-5"
                                                                                ng-show="!viewMoreFlag && ServiceSmartTask.length>3">
                                                                                <button className="btn btn-primary"
                                                                                    ng-click="viewAllItems();">
                                                                                    Show More..
                                                                                </button>
                                                                            </div>
                                                                            <div className="col-sm-12 text-center mt-5"
                                                                                ng-show="viewMoreFlag && ServiceSmartTask.length>3">
                                                                                <button className="btn btn-primary"
                                                                                    ng-click="hideAllItems();">
                                                                                    Show Less..
                                                                                </button>
                                                                            </div>
                                                                        </div> */}
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
                                                        ng-bind-html="GetColumnDetails('open') | trustedHTML"><svg xmlns="http://www.w3.org/2000/svg" width="20"  viewBox="0 0 48 48" fill="none">
                                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M12.3677 13.2672C11.023 13.7134 9.87201 14.4471 8.99831 15.4154C6.25928 18.4508 6.34631 23.1488 9.19578 26.0801C10.6475 27.5735 12.4385 28.3466 14.4466 28.3466H15.4749V27.2499V26.1532H14.8471C12.6381 26.1532 10.4448 24.914 9.60203 23.1898C8.93003 21.8151 8.9251 19.6793 9.5906 18.3208C10.4149 16.6384 11.9076 15.488 13.646 15.1955C14.7953 15.0022 22.5955 14.9933 23.7189 15.184C26.5649 15.6671 28.5593 18.3872 28.258 21.3748C27.9869 24.0644 26.0094 25.839 22.9861 26.1059L21.9635 26.1961V27.2913V28.3866L23.2682 28.3075C27.0127 28.0805 29.7128 25.512 30.295 21.6234C30.8413 17.9725 28.3779 14.1694 24.8492 13.2166C24.1713 13.0335 23.0284 12.9942 18.5838 13.0006C13.785 13.0075 13.0561 13.0388 12.3677 13.2672ZM23.3224 19.8049C18.7512 20.9519 16.3624 26.253 18.4395 30.6405C19.3933 32.6554 20.9948 34.0425 23.1625 34.7311C23.9208 34.9721 24.5664 35 29.3689 35C34.1715 35 34.8171 34.9721 35.5754 34.7311C38.1439 33.9151 39.9013 32.1306 40.6772 29.5502C41 28.4774 41.035 28.1574 40.977 26.806C40.9152 25.3658 40.8763 25.203 40.3137 24.0261C39.0067 21.2919 36.834 19.8097 33.8475 19.6151L32.5427 19.53V20.6267V21.7236L33.5653 21.8132C35.9159 22.0195 37.6393 23.0705 38.4041 24.7641C39.8789 28.0293 38.2035 31.7542 34.8532 32.6588C33.8456 32.9309 25.4951 32.9788 24.1462 32.7205C22.4243 32.3904 21.0539 31.276 20.2416 29.5453C19.8211 28.6492 19.7822 28.448 19.783 27.1768C19.7837 26.0703 19.8454 25.6485 20.0853 25.1039C20.4635 24.2463 21.3756 23.2103 22.1868 22.7175C22.8985 22.2851 24.7121 21.7664 25.5124 21.7664H26.0541V20.6697V19.573L25.102 19.5851C24.5782 19.5919 23.7775 19.6909 23.3224 19.8049Z" fill="#333333"/>
                                                        </svg></a>
                                                </span>
                                                </div>
                                            </div>

                                            </div>
                                            <div className="col-md-3">
                                                <div className="">
                                                    <div ng-show="SiteComposition.length > 0"className="">
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
                                                            {composition === true ?
                                                                <div
                                                                    id="testDiv1">
                                                                    <ul className="table table-hover">
                                                                        <li ng-repeat="item in SiteComposition | orderBy:orderBy1:revers"
                                                                            className="for-lis project_active">
                                                                            <div style={{ width: "1px" }}>
                                                                            </div>
                                                                            <div style={{ width: "20px" }} className="padLR">
                                                                                <img style={{ width: "22px" }}
                                                                                />
                                                                            </div>
                                                                            <div style={{ width: "79px" }} className="padLR">
                                                                                <span
                                                                                    ng-show="item.ClienTimeDescription!=undefined">
                                                                                    item.ClienTimeDescription%
                                                                                </span>
                                                                            </div>
                                                                            <div ng-show="item.SiteName==='EPS'"
                                                                                className="padLR">
                                                                                <ul className="clint-Members-icons">
                                                                                    <li ng-show="client.siteName==='EPS'"
                                                                                        className="user-Member-img"
                                                                                        ng-repeat="client in Task.ClientCategory.results">
                                                                                        client.Title
                                                                                    </li>
                                                                                </ul>
                                                                            </div>
                                                                            <div ng-show="item.SiteName==='EI'"
                                                                                className="padLR">
                                                                                <ul className="clint-Members-icons">
                                                                                    <li ng-show="client.siteName==='EI'"
                                                                                        className="user-Member-img"
                                                                                        ng-repeat="client in Task.ClientCategory.results">
                                                                                        client.Title
                                                                                    </li>
                                                                                </ul>
                                                                            </div>
                                                                        </li>
                                                                    </ul>
                                                                    <div className="pad-5">
                                                                        <label>Total Time</label>
                                                                        <span
                                                                            className="pull-right pr-5">totletimeparentcount
                                                                            h
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                : ""}
                                                        </div>
                                                    </div>
                                                </div>


                                                <div className="col mb-10">
                                                    <div className="input-group">
                                                        <label className="form-label">status</label>
                                                        <input type="text" className="form-control" placeholder="% Complete" />
                                                        <span className="input-group-text">
                                                     <a onClick={() => openTaskStatusUpdatePoup()}>   <svg  xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
<path fill-rule="evenodd" clip-rule="evenodd" d="M33.5163 8.21948C33.058 8.34241 32.4072 8.6071 32.0702 8.80767C31.7334 9.00808 26.7046 13.9214 20.8952 19.7259L10.3328 30.2796L9.12891 35.1C8.46677 37.7511 7.95988 39.9549 8.0025 39.9975C8.04497 40.0399 10.2575 39.5397 12.919 38.8857L17.7581 37.6967L28.08 27.4328C33.7569 21.7875 38.6276 16.861 38.9036 16.4849C40.072 14.8925 40.3332 12.7695 39.5586 11.1613C38.8124 9.61207 37.6316 8.62457 36.0303 8.21052C34.9371 7.92775 34.5992 7.92896 33.5163 8.21948ZM35.7021 10.1369C36.5226 10.3802 37.6953 11.5403 37.9134 12.3245C38.2719 13.6133 38.0201 14.521 36.9929 15.6428C36.569 16.1059 36.1442 16.4849 36.0489 16.4849C35.8228 16.4849 31.5338 12.2111 31.5338 11.9858C31.5338 11.706 32.8689 10.5601 33.5598 10.2469C34.3066 9.90852 34.8392 9.88117 35.7021 10.1369ZM32.3317 15.8379L34.5795 18.0779L26.1004 26.543L17.6213 35.008L17.1757 34.0815C16.5838 32.8503 15.1532 31.437 13.9056 30.8508L12.9503 30.4019L21.3663 21.9999C25.9951 17.3788 29.8501 13.5979 29.9332 13.5979C30.0162 13.5979 31.0956 14.6059 32.3317 15.8379ZM12.9633 32.6026C13.8443 32.9996 14.8681 33.9926 15.3354 34.9033C15.9683 36.1368 16.0094 36.0999 13.2656 36.7607C11.9248 37.0836 10.786 37.3059 10.7347 37.2547C10.6535 37.1739 11.6822 32.7077 11.8524 32.4013C11.9525 32.221 12.227 32.2709 12.9633 32.6026Z" fill="#333333"/>
</svg></a></span>
                                                          
                                                    </div>



                                                </div>

                                                <div className="row">
                                                    <div className="col">
                                                        <div>
                                                            <label className="form-label" ng-bind-html="GetColumnDetails('time') | trustedHTML">Time</label>
                                                            <input type="text" className="form-control  mb-2" placeholder="Time"
                                                                ng-model="Item.Mileage" />

                                                            <ul>
                                                                <li className="form-check">
                                                                    <input name="radioTime" className="form-check-input"
                                                                        ng-checked="Item.Mileage==='15'" type="radio"
                                                                        ng-click="SelectTime('15')" />Very
                                                                    Quick

                                                                </li>
                                                                <li className="form-check">

                                                                    <input name="radioTime" className="form-check-input"
                                                                        ng-checked="Item.Mileage==='60'" type="radio"
                                                                        ng-click="SelectTime('60')" />Quick

                                                                </li>
                                                                <li className="form-check">

                                                                    <input name="radioTime" className="form-check-input"
                                                                        ng-checked="Item.Mileage==='240'" type="radio"
                                                                        ng-click="SelectTime('240')" />Medium

                                                                </li>
                                                                <li className="form-check">

                                                                    <input name="radioTime" className="form-check-input"
                                                                        ng-checked="Item.Mileage==='480'" type="radio"
                                                                        ng-click="SelectTime('480')" />Long

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
                                                                            data-toggle="popover" data-trigger="hover" style={{width:"25px"}}
                                                                           

                                                                            src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/PublishingImages/NewUsersImages/Santosh%20Kumar.png" />
                                                                    </a>
                                                           
                                                                {/* <div className="responsibility_tile">
                                                                            <a ng-if="image.userImage === undefined && image.Item_x0020_Cover!=undefined &&image.Item_x0020_Cover.Url!=undefined"
                                                                                ng-repeat="image in AssignedToUsers"
                                                                                target="_blank"
                                                                                ng-href="{{pageContext}}/SitePages/TeamLeader-Dashboard.aspx?UserId={{image.AssingedToUserId}}&Name={{image.Title}} ">
                                                                                <img ui-draggable="true"
                                                                                    on-drop-success="dropSuccessHandler($event, $index, AssignedToUsers)"
                                                                                    data-toggle="popover" data-trigger="hover"
                                                                                    className="ProirityAssignedUserPhoto"
                                                                                    title="{{image.Title}}"
                                                                                    ng-src="{{image.Item_x0020_Cover.Url}}" />
                                                                            </a>
                                                                        </div>
                                                                        <div className="responsibility_tile">
                                                                            <a ng-if="(image.userImage===undefined) &&(image.Item_x0020_Cover===undefined || image.Item_x0020_Cover.Url===undefined)"
                                                                                ng-repeat="image in AssignedToUsers"
                                                                                target="_blank"
                                                                                ng-href="{{pageContext}}/SitePages/TeamLeader-Dashboard.aspx?UserId={{image.AssingedToUserId}}&Name={{image.Title}} ">
                                                                                <div ui-draggable="true"
                                                                                    on-drop-success="dropSuccessHandler($event, $index, AssignedToUsers)"
                                                                                    data-toggle="popover" data-trigger="hover"
                                                                                    className="text-center create title2  ng-binding ProirityAssignedUserPhoto ng-scope"
                                                                                    title="{{image.Title}}"
                                                                                    ng-src="{{image.Item_x0020_Cover.Url}}">
                                                                                    image.Suffix
                                                                                </div>
                                                                            </a>
                                                                        </div> */}
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
<path fill-rule="evenodd" clip-rule="evenodd" d="M19.3584 5.28375C18.4262 5.83254 18.1984 6.45859 18.1891 8.49582L18.1837 9.66172H13.5918H9V10.8591V12.0565H10.1612H11.3225L11.3551 26.3309L11.3878 40.6052L11.6525 41.1094C11.9859 41.7441 12.5764 42.3203 13.2857 42.7028L13.8367 43H23.9388C33.9989 43 34.0431 42.9989 34.6068 42.7306C35.478 42.316 36.1367 41.6314 36.4233 40.8428C36.6697 40.1649 36.6735 39.944 36.6735 26.1055V12.0565H37.8367H39V10.8591V9.66172H34.4082H29.8163L29.8134 8.49582C29.8118 7.85452 29.7618 7.11427 29.7024 6.85084C29.5542 6.19302 29.1114 5.56596 28.5773 5.2569C28.1503 5.00999 27.9409 4.99826 23.9833 5.00015C19.9184 5.0023 19.8273 5.00784 19.3584 5.28375ZM27.4898 8.46431V9.66172H24H20.5102V8.46431V7.26691H24H27.4898V8.46431ZM34.4409 25.9527C34.4055 40.9816 34.4409 40.2167 33.7662 40.5332C33.3348 40.7355 14.6335 40.7206 14.2007 40.5176C13.4996 40.1889 13.5306 40.8675 13.5306 25.8645V12.0565H24.0021H34.4736L34.4409 25.9527ZM18.1837 26.3624V35.8786H19.3469H20.5102V26.3624V16.8461H19.3469H18.1837V26.3624ZM22.8367 26.3624V35.8786H24H25.1633V26.3624V16.8461H24H22.8367V26.3624ZM27.4898 26.3624V35.8786H28.6531H29.8163V26.3624V16.8461H28.6531H27.4898V26.3624Z" fill="#333333"/>
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
                                                                                    <a onClick={() => onImageUpdate(index)}><svg xmlns="http://www.w3.org/2000/svg" width="20"  viewBox="0 0 48 48" fill="none">
<path fill-rule="evenodd" clip-rule="evenodd" d="M6.18178 9.10429C6.0131 9.21501 5.97742 11.8728 6.01191 21.808L6.05556 34.3718L17.2248 34.4167L28.3941 34.4615V33.629V32.7963L25.3363 29.6562C23.6546 27.9291 22.2786 26.435 22.2786 26.3356C22.2786 26.1056 24.8625 23.4561 25.0871 23.4561C25.1794 23.4561 26.6292 24.8708 28.3091 26.5998L31.3633 29.7435H32.1721H32.9807V28.9999C32.9807 28.2629 32.946 28.2206 29.1147 24.2843C26.9884 22.0998 25.1739 20.3124 25.0825 20.3124C24.9911 20.3124 23.9403 21.3137 22.7474 22.5373L20.5787 24.7622L16.0787 20.1383L11.5787 15.5143L10.0031 17.1274C9.13641 18.0148 8.36994 18.7406 8.29978 18.7406C8.22962 18.7406 8.19276 17.1097 8.21807 15.1166L8.26393 11.4926L21.7265 11.4479L35.1891 11.4032V18.3029V25.2026H36.2949H37.4008L37.3567 17.1251L37.3125 9.04753L21.8539 9.00596C13.3517 8.98325 6.29916 9.02744 6.18178 9.10429ZM31.1121 14.0251C30.9252 14.2172 30.7723 14.5708 30.7723 14.811C30.7723 15.3389 31.3217 15.9462 31.7992 15.9462C32.2112 15.9462 32.9807 15.2067 32.9807 14.811C32.9807 14.4152 32.2112 13.6758 31.7992 13.6758C31.6081 13.6758 31.2989 13.8329 31.1121 14.0251ZM24.487 32.0585C24.487 32.1319 20.8367 32.1717 16.3754 32.1467L8.26393 32.1013L8.21875 27.2169L8.17356 22.3326L9.91545 20.5355L11.6575 18.7383L18.0723 25.3317C21.6003 28.958 24.487 31.985 24.487 32.0585ZM35.3024 27.5896C35.24 27.6535 35.1891 28.7145 35.1891 29.9474V32.1887H32.9807H30.7723V33.3239V34.4591H32.9807H35.1891V36.7295V39H36.2932H37.3974V36.7346V34.4692L39.6483 34.4205L41.8991 34.3718L41.9496 33.2853L42 32.199L39.7412 32.1501L37.4824 32.1013L37.435 29.7872L37.3876 27.4731H36.4016C35.8592 27.4731 35.3645 27.5255 35.3024 27.5896Z" fill="#333333"/>
</svg></a>
                                                                                    <a style={{ margin: "3px" }} onClick={() => onImageRemove(index)}><svg xmlns="http://www.w3.org/2000/svg" width="20"  viewBox="0 0 48 48" fill="none">
<path fill-rule="evenodd" clip-rule="evenodd" d="M19.3584 5.28375C18.4262 5.83254 18.1984 6.45859 18.1891 8.49582L18.1837 9.66172H13.5918H9V10.8591V12.0565H10.1612H11.3225L11.3551 26.3309L11.3878 40.6052L11.6525 41.1094C11.9859 41.7441 12.5764 42.3203 13.2857 42.7028L13.8367 43H23.9388C33.9989 43 34.0431 42.9989 34.6068 42.7306C35.478 42.316 36.1367 41.6314 36.4233 40.8428C36.6697 40.1649 36.6735 39.944 36.6735 26.1055V12.0565H37.8367H39V10.8591V9.66172H34.4082H29.8163L29.8134 8.49582C29.8118 7.85452 29.7618 7.11427 29.7024 6.85084C29.5542 6.19302 29.1114 5.56596 28.5773 5.2569C28.1503 5.00999 27.9409 4.99826 23.9833 5.00015C19.9184 5.0023 19.8273 5.00784 19.3584 5.28375ZM27.4898 8.46431V9.66172H24H20.5102V8.46431V7.26691H24H27.4898V8.46431ZM34.4409 25.9527C34.4055 40.9816 34.4409 40.2167 33.7662 40.5332C33.3348 40.7355 14.6335 40.7206 14.2007 40.5176C13.4996 40.1889 13.5306 40.8675 13.5306 25.8645V12.0565H24.0021H34.4736L34.4409 25.9527ZM18.1837 26.3624V35.8786H19.3469H20.5102V26.3624V16.8461H19.3469H18.1837V26.3624ZM22.8367 26.3624V35.8786H24H25.1633V26.3624V16.8461H24H22.8367V26.3624ZM27.4898 26.3624V35.8786H28.6531H29.8163V26.3624V16.8461H28.6531H27.4898V26.3624Z" fill="#333333"/>
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
                                
                                </>
                                )
                               })}
                            </div>

                            <div className="modal-footer">
                                <div className="col-sm-12 p-0">
                                    <div className="col-md-4 text-left ps-0">
                                        <div className="d-flex   align-content-center">
                                            Created <span>{Items.Items.Created}</span> by <span
                                                className="siteColor">{Items.Items.Author.Title}</span>
                                        </div>
                                        <div>
                                            Last modified <span>{Items.Items.Modified}</span> by <span
                                                className="siteColor">{Items.Items.Editor.Title}</span>
                                        </div>
                                        <div>
                                            <a ng-if="isOwner===true" className="hreflink">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20"  viewBox="0 0 48 48" fill="none">
<path fill-rule="evenodd" clip-rule="evenodd" d="M19.3584 5.28375C18.4262 5.83254 18.1984 6.45859 18.1891 8.49582L18.1837 9.66172H13.5918H9V10.8591V12.0565H10.1612H11.3225L11.3551 26.3309L11.3878 40.6052L11.6525 41.1094C11.9859 41.7441 12.5764 42.3203 13.2857 42.7028L13.8367 43H23.9388C33.9989 43 34.0431 42.9989 34.6068 42.7306C35.478 42.316 36.1367 41.6314 36.4233 40.8428C36.6697 40.1649 36.6735 39.944 36.6735 26.1055V12.0565H37.8367H39V10.8591V9.66172H34.4082H29.8163L29.8134 8.49582C29.8118 7.85452 29.7618 7.11427 29.7024 6.85084C29.5542 6.19302 29.1114 5.56596 28.5773 5.2569C28.1503 5.00999 27.9409 4.99826 23.9833 5.00015C19.9184 5.0023 19.8273 5.00784 19.3584 5.28375ZM27.4898 8.46431V9.66172H24H20.5102V8.46431V7.26691H24H27.4898V8.46431ZM34.4409 25.9527C34.4055 40.9816 34.4409 40.2167 33.7662 40.5332C33.3348 40.7355 14.6335 40.7206 14.2007 40.5176C13.4996 40.1889 13.5306 40.8675 13.5306 25.8645V12.0565H24.0021H34.4736L34.4409 25.9527ZM18.1837 26.3624V35.8786H19.3469H20.5102V26.3624V16.8461H19.3469H18.1837V26.3624ZM22.8367 26.3624V35.8786H24H25.1633V26.3624V16.8461H24H22.8367V26.3624ZM27.4898 26.3624V35.8786H28.6531H29.8163V26.3624V16.8461H28.6531H27.4898V26.3624Z" fill="#333333"/>
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
                                                ng-click="IsShowFullViewImage!=true? updateTaskRecords('UpdateTask',Item):CancelShowInFullView()">
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


                </div>
            </Modal>

        </>
    )
}
export default React.memo(EditTaskPopup)