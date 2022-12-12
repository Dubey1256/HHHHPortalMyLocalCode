import * as React from "react";
import * as $ from 'jquery';
import '../../cssFolder/foundation.scss';
import { arraysEqual, Modal } from 'office-ui-fabric-react';
//import "bootstrap/dist/css/bootstrap.min.css";
import Tabs from "../Tabs/Tabs";
import Tab from "../Tabs/Tab";
import * as Moment from 'moment';
import '../Tabs/styles.css';
import '../../taskDashboard/components/TaskDashboard.scss'
import '../../cssFolder/foundation.scss';
import ComponentMail from './Componentmail';
import { HiPencil } from 'react-icons/Hi';
import axios, { AxiosResponse } from 'axios';
import TeamComposition from './TeamComposition';
// import Picker from "../../taskDashboard/components/SmartMetaDataPicker";
import Picker from "./SmartMetaDataPicker";
import { useRef, forwardRef, useImperativeHandle } from 'react'
//import FloraEditor from "./TextEditor";
import FloaraEditor from "./FloaraEditor";
import FloraEditor from "./TextEditor";
import Example from "./MY";
//import ImageTask from "./ImageTask";
import ImageUploading, { ImageListType } from "react-images-uploading";


// import { Editor } from "react-draft-wysiwyg";
//import { Editor, EditorState, ContentState } from "react-draft-wysiwyg";
//import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
//import Tooltip from "./Tooltip/popup";



var IsShowFullViewImage = false;
const EditTaskPopup = (Items: any) => {
    // Id:any


    const [images, setImages] = React.useState([]);
    const maxNumber = 69;

    const [Editdata, setEditdata] = React.useState([]);
    const [state, setState] = React.useState([]);
    const [ImageSection, setImageSection] = React.useState([]);

    const [Description, setDescription] = React.useState([]);
    const [modalIsOpen, setModalIsOpen] = React.useState(false);
    const [TaskStatuspopup, setTaskStatuspopup] = React.useState(false);
    const [composition, setComposition] = React.useState(false);
    const [PopupSmartTaxanomy, setPopupSmartTaxanomy] = React.useState(false);
    const [ComentBox, setComentBox] = React.useState(false);

    const setModalIsOpenToTrue = () => {
        setModalIsOpen(true)
    }
    React.useEffect(() => {
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

    const setModalIsOpenToFalse = () => {
        setModalIsOpen(false)
    }

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
                                if ((comments.Comments == undefined) || (comments.Comments != undefined && comments.Comments.length == 0)) {
                                    comments.isShowComment = false;
                                }
                                $.each(comments.Comments, function (index: any, item: any) {
                                    item.isShowComment = true;
                                    item.Title = item.Title.replace(/\n/g, '<br/>');
                                    //item.Created = new Date(item.Created).format('dd MMM yyyy HH:mm');
                                    if (item.AuthorImage != undefined && item.AuthorImage != '')
                                        item.AuthorImage = item.AuthorImage.replace("https://www.hochhuth-consulting.de/sp", "https://hhhhteams.sharepoint.com/sites/HHHH");
                                    if (item.NewestCreated == undefined) {
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
                                        if (sub.Comments == undefined || (sub.Comments != undefined && sub.Comments.length == 0)) {
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
                            //         if (index == 0) {
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
        if (item.Subtext == undefined)
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


    return (
        <>
            <img title="Edit Details" className="wid22" onClick={(e) => setModalIsOpenToTrue()}
                src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif" />


            <Modal
                isOpen={TaskStatuspopup}
                onDismiss={closeTaskStatusUpdatePoup}
                isBlocking={false}

            >

                <div id="EditGrueneContactSearch">
                    <div className="modal-dailog modal-sm">
                        <div className="panel panel-default" ng-cloak>
                            <div className="modal-header">
                                <h3 className="modal-title">
                                    Update Task Status
                                </h3>
                                <button type="button" style={{ minWidth: "10px" }} className="close" data-dismiss="modal"
                                    onClick={closeTaskStatusUpdatePoup}>
                                    &times;
                                </button>
                            </div>
                            <div className="modal-body clearfix bg-f5f5">

                                <div ng-show="Completed=='For Approval'" className="radio">
                                    <label className="l-radio">
                                        <input className="form-check-input mt-4" name="radioCompleted"
                                            type="radio" value="For Approval"
                                            ng-click="PercentCompleted()" ng-model="Completed" />
                                        01% For Approval
                                    </label>

                                </div>
                                <div ng-show="Completed=='Follow up'" className="radio">
                                    <label className="l-radio">
                                        <input className="form-check-input mt-4" name="radioCompleted"
                                            type="radio" value="Follow up"
                                            ng-click="PercentCompleted()" ng-model="Completed"
                                            disabled />
                                        02% Follow up
                                    </label>

                                </div>
                                <div ng-show="Completed=='Approved'" className="radio">
                                    <label className="l-radio">
                                        <input className="form-check-input mt-4" name="radioCompleted"
                                            type="radio" value="Approved"
                                            ng-click="PercentCompleted()" ng-model="Completed" />
                                        03% Approved
                                    </label>

                                </div>
                                <div ng-show="Completed=='Acknowledged'" className="radio">
                                    <label className="l-radio">
                                        <input className="form-check-input mt-4" name="radioCompleted"
                                            type="radio" value="Acknowledged"
                                            ng-click="PercentCompleted()" ng-model="Completed" />
                                        05% Acknowledged
                                    </label>

                                </div>
                                <div ng-show="Completed=='working on it'" className="radio">
                                    <label className="l-radio">
                                        <input className="form-check-input mt-4" name="radioCompleted"
                                            type="radio" value="working on it"
                                            ng-click="PercentCompleted()" ng-model="Completed" />
                                        10% working on it
                                    </label>

                                </div>
                                <div ng-show="Completed=='Re-Open'" className="radio">
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
                                <div ng-show="Completed=='In QA review'" className="radio">
                                    <label className="l-radio">
                                        <input className="form-check-input mt-4" name="radioCompleted"
                                            type="radio" value="In QA review"
                                            ng-click="PercentCompleted()" ng-model="Completed" />
                                        80% In QA Review
                                    </label>

                                </div>
                                <div ng-show="Completed=='Task completed'" className="radio">
                                    <label className="l-radio">
                                        <input className="form-check-input mt-4" name="radioCompleted"
                                            type="radio" value="Task completed"
                                            ng-click="PercentCompleted()" ng-model="Completed" />
                                        90% Task completed
                                    </label>

                                </div>
                                <div ng-show="Completed=='For Review'" className="radio">
                                    <label className="l-radio">
                                        <input className="form-check-input mt-4" name="radioCompleted"
                                            type="radio" value="For Review"
                                            ng-click="PercentCompleted()" ng-model="Completed" />
                                        93% For Review
                                    </label>

                                </div>
                                <div ng-show="Completed=='For Follow-up later'" className="radio">
                                    <label className="l-radio">
                                        <input className="form-check-input mt-4" name="radioCompleted"
                                            type="radio" value="For Follow-up later"
                                            ng-click="PercentCompleted()" ng-model="Completed" />
                                        96% Follow-up later
                                    </label>

                                </div>
                                <div ng-show="Completed=='Completed'" className="radio">
                                    <label className="l-radio">
                                        <input className="form-check-input mt-4" name="radioCompleted"
                                            type="radio" value="Completed"
                                            ng-click="PercentCompleted()" ng-model="Completed" />
                                        99% Completed
                                    </label>

                                </div>
                                <div ng-show="Completed=='Closed'" className="radio">
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
            <Modal
                isOpen={modalIsOpen}
                onDismiss={setModalIsOpenToFalse}
                isBlocking={false}

            >

                <div id="EditGrueneContactSearch">
                    <div className="modal-dailog modal-lg" style={{ width: "1250px" }}>
                        <div className="panel panel-default" ng-cloak>
                            <div className="modal-header">
                                <h3 className="modal-title">


                                    <span className="pull-right">
                                        {/* <page-settings-info webpartid="'EditInstitutionPopup'"></page-settings-info> */}
                                        {/* <Tooltip/> */}
                                    </span>
                                </h3>
                                <button type="button" style={{ minWidth: "10px" }} className="close" data-dismiss="modal"
                                    onClick={setModalIsOpenToFalse}>
                                    &times;
                                </button>
                            </div>
                            <div className="modal-body clearfix bg-f5f5">
                                <Tabs>
                                    <Tab title="BASIC INFORMATION">
                                        <div>
                                            <div className="form-horizontal fixed-divPanelBody">

                                                <div>

                                                    <div className="col-md-5 padL-0 border-right">

                                                        <div className="full_width mb-10 " title="Task Name">
                                                            <div className="hhProcesscat">
                                                                <label className="full_width">Title
                                                                    <span className="pull-right">
                                                                        <input type="checkbox" id="isChecked"

                                                                            ng-checked="Item.IsTodaysTask==1"
                                                                            ng-click="checkTodayTask(isChecked)"
                                                                            className="mt-0 mr-5" />

                                                                        <span

                                                                            className="no-padding ">workingToday</span>
                                                                    </span>
                                                                </label>


                                                                <input type="text" className="form-control" placeholder="Task Name"
                                                                    ng-required="true" />
                                                            </div>
                                                        </div>

                                                        <div className="full_width mb-10">
                                                            <div className="col-sm-3 mb-10 padL-0 pr-5">
                                                                <div className="hhProcesscat">
                                                                    <label
                                                                    >StartDate</label>
                                                                    <input type="text" autoComplete="off" id="startDatepicker"
                                                                        placeholder="DD/MM/YYYY" className="form-control"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-sm-3 mb-10 padL-0 pr-5">
                                                                <div className="hhProcesscat">
                                                                    <label
                                                                    >dueDate</label>
                                                                    <span title="Re-occurring Due Date">
                                                                        <input type="checkbox" className="mt-0"
                                                                            ng-model="dueDatePopUp"
                                                                            ng-click="OpenDueDatePopup()" />
                                                                    </span>
                                                                    <input type="text" autoComplete="off" id="dueDatePicker"
                                                                        placeholder="DD/MM/YYYY" className="form-control"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-sm-3 mb-10 pad0">
                                                                <div className="hhProcesscat">
                                                                    <label
                                                                    >CompletedDate</label>
                                                                    <input type="text" autoComplete="off"
                                                                        id="CompletedDatePicker" placeholder="DD/MM/YYYY"
                                                                        className="form-control" />
                                                                </div>
                                                            </div>
                                                            <div className="col-sm-3 PadR0 pl-5 padR-0 ">
                                                                <div className="hhProcesscat">
                                                                    <label className="full_width"
                                                                    >ItemRank</label>
                                                                    <select className="form-control pad0" id="ItemRankType"
                                                                        ng-model="Item.ItemRank">
                                                                        <option value="">Select Item Rank</option>
                                                                        <option ng-repeat="item in SharewebItemRank"
                                                                        >

                                                                        </option>
                                                                    </select>
                                                                </div>
                                                            </div>

                                                        </div>

                                                        <div className="full_width mb-10">
                                                            <div className="col-sm-6 mb-10 padL-0">
                                                                <div className="full_width mb-10">
                                                                    <div className="hhProcesscat">
                                                                        <div
                                                                            ng-show="Item.SharewebTaskType.Title!='Project' && Item.SharewebTaskType.Title!='Step' && Item.SharewebTaskType.Title!='MileStone'">
                                                                            <label className="l-radio">
                                                                                <span>
                                                                                    <input type="radio" id="Components"
                                                                                        name="Portfolios" value="Component"
                                                                                        title="Component"
                                                                                        ng-model="PortfolioTypes"
                                                                                        ng-click="getPortfoliosData()"
                                                                                        className="ng-pristine ng-untouched ng-valid ng-empty mt-0" />
                                                                                    <span>Component</span>
                                                                                </span>
                                                                                <span>
                                                                                    <input type="radio" id="Services"
                                                                                        name="Portfolios" value="Services"
                                                                                        title="Services"
                                                                                        ng-model="PortfolioTypes"
                                                                                        ng-click="getPortfoliosData()"
                                                                                        className="ng-pristine ng-untouched ng-valid ng-empty mt-0" />
                                                                                    <span>Services</span>
                                                                                </span>
                                                                            </label>



                                                                        </div>
                                                                        {/* <div
                                                                            ng-show="Item.SharewebTaskType.Title=='Project' || Item.SharewebTaskType.Title=='Step' || Item.SharewebTaskType.Title=='MileStone'">
                                                                            <label>
                                                                                <span>
                                                                                    <input type="checkBox" className="radio-inline"
                                                                                        name="Task Type"
                                                                                        ng-model="ProjectComponent" />
                                                                                    <span>Component</span>
                                                                                </span>
                                                                                <span>
                                                                                    <input type="checkBox" className="radio-inline"
                                                                                        name="Task Type"
                                                                                        ng-model="ProjectService" />
                                                                                    <span> Service</span>

                                                                                </span>
                                                                            </label>

                                                                        </div> */}
                                                                        <input type="text" ng-model="SearchService"
                                                                            ng-hide="ServicesmartComponent.length>0 || smartComponent.length>0"
                                                                            className="form-control ui-autocomplete-input"
                                                                            id="{{PortfoliosID}}" autoComplete="off" />
                                                                        <span role="status" aria-live="polite"
                                                                            className="ui-helper-hidden-accessible"></span>
                                                                        <span className="toltrip"
                                                                            ng-hide="(ServicesmartComponent.length>0 || smartComponent.length>0)">

                                                                            <Picker />
                                                                        </span>
                                                                    </div>

                                                                    <div className="hhProcesscat">
                                                                        <div className="col-sm-10 padL-0 top-assign">
                                                                            <div className="col-sm-10 pad0 mt-5">
                                                                                {/* <div className="block taskprofilepagegreen"
                                                                                    ng-mouseover="HoverIn(item);"
                                                                                    ng-mouseleave="ComponentTitle.STRING='';"
                                                                                    title="{{ComponentTitle.STRING}}"
                                                                                    ng-repeat="item in ServicesmartComponent track by $index">
                                                                                    <a className="hreflink" target="_blank"
                                                                                        href="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId={{item.Id}}"></a>
                                                                                    <a className="hreflink"
                                                                                        ng-click="removeServiceSmartComponent(item.Id)">
                                                                                        <img
                                                                                            ng-src="/_layouts/images/delete.gif" />
                                                                                    </a>
                                                                                </div> */}
                                                                                {/* <div className="block" ng-mouseover="HoverIn(item);"
                                                                                    ng-mouseleave="ComponentTitle.STRING='';"
                                                                                    title="{{ComponentTitle.STRING}}"
                                                                                    ng-repeat="item in smartComponent track by $index">
                                                                                    <a className="hreflink" target="_blank"
                                                                                        href="{Items.Title}/SitePages/Portfolio-Profile.aspx?taskId={{item.Id}}"></a>
                                                                                    <a className="hreflink"
                                                                                        ng-click="removeSmartComponent(item.Id)">
                                                                                        <img
                                                                                            ng-src="/_layouts/images/delete.gif" />
                                                                                    </a>
                                                                                </div> */}

                                                                            </div>

                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="full_width mb-12">
                                                                    <div className="col-sm-12 pad0">
                                                                        <div className="hhProcesscat  ">
                                                                            <label ng-hide="item=='TimesheetCategories'"
                                                                                ng-repeat="item in filterGroups">
                                                                                <span>Categories</span>
                                                                            </label>
                                                                            <input type="text" className="form-control"
                                                                                id="txtCategories" />
                                                                            <span className="toltrip"
                                                                                ng-show="(ServicesmartComponent.length>0 || smartComponent.length>0)">

                                                                                <Picker />

                                                                            </span>
                                                                        </div>

                                                                    </div>

                                                                    <div className="col-sm-12 mt-2 pad0">
                                                                        <div className="col-sm-12" ng-if="item.SmartSuggestions"
                                                                            ng-repeat="item in AllCategories">
                                                                            <div ng-show="item.Title!='Approval'&&item.Title!='Email Notification'"
                                                                                className="checkbox">
                                                                                <input ng-checked="isMainTermSelected(item)"

                                                                                    type="checkbox"
                                                                                    ng-click="selectRootLevelTerm(item,type)" />
                                                                                Phone
                                                                            </div>

                                                                            <div ng-show="item.Title=='Email Notification'"
                                                                                className="checkbox">
                                                                                <input ng-checked="isMainTermSelected(item)"

                                                                                    type="checkbox"
                                                                                    ng-click="selectRootLevelTerm(item)" />
                                                                                Email Notification
                                                                                <span><i ng-show="showEmailSubCategory && CurrentSubSiteName !='ksl'"
                                                                                    ng-click="openCategoryUpdatePoup(item.Title)"
                                                                                    className="fa fa-pencil ml-10"
                                                                                    aria-hidden="true"></i>
                                                                                </span>

                                                                            </div>
                                                                            <div ng-show="item.Title=='Email Notification'"
                                                                                className="checkbox">
                                                                                <input ng-checked="isMainTermSelected(item)"

                                                                                    type="checkbox"
                                                                                    ng-click="selectRootLevelTerm(item)" />
                                                                                Immmediate
                                                                                <span><i ng-show="showEmailSubCategory && CurrentSubSiteName !='ksl'"
                                                                                    ng-click="openCategoryUpdatePoup(item.Title)"
                                                                                    className="fa fa-pencil ml-10"
                                                                                    aria-hidden="true"></i>
                                                                                </span>

                                                                            </div>
                                                                        </div>

                                                                        {/* <div className="col-sm-12 clearfix block"
                                                                            ng-repeat="item in smartCategories"
                                                                            ng-hide="item.Title =='Phone'||item.Title =='Email Notification'||item.Title =='Immediate'||item.Title =='Approval'||item.Title =='Normal Approval'||item.Title =='Quick Approval'||item.Title =='Complex Approval' || item.Title =='Only Completed'">


                                                                            <a className="hreflink"
                                                                                ng-hide="((item.Id==47) && userId!=10 && userId!=14) ||((Isapproval=='approve all' ||Isapproval == 'approve all but selected items') && item.Id==169)"
                                                                                ng-click="removeCategories(item.Id,item)">
                                                                                <img ng-src="/_layouts/images/delete.gif" />
                                                                            </a>
                                                                        </div> */}
                                                                        <div className="col-sm-12 pad0">
                                                                            <hr className="bdrtop  mb-5 mt-10" />
                                                                        </div>
                                                                        <div className="col-sm-12" ng-if="item.SmartSuggestions"
                                                                            ng-repeat="item in AllCategories">

                                                                            <div ng-show="item.Title=='Approval'"
                                                                                className="checkbox">
                                                                                <input ng-checked="isMainTermSelected(item)"
                                                                                    type="checkbox"
                                                                                    ng-click="selectRootLevelTerm(item)" />Approval


                                                                                <div ng-repeat="child in item.childs"
                                                                                    className="radio">
                                                                                    <label>
                                                                                        <input id='checApproval'
                                                                                            className="form-check-input mt-4"
                                                                                            name="TextApproval" type="radio"
                                                                                            value="{{child.Title}}"
                                                                                            ng-click="selectRootLevelTerm(child)"
                                                                                            ng-model="ApprovalCategoriesType" />
                                                                                        Normal Approval
                                                                                    </label>
                                                                                    <label>
                                                                                        <input id='checApproval'
                                                                                            className="form-check-input mt-4"
                                                                                            name="TextApproval" type="radio"
                                                                                            value="{{child.Title}}"
                                                                                            ng-click="selectRootLevelTerm(child)"
                                                                                            ng-model="ApprovalCategoriesType" />
                                                                                        Complex Approval
                                                                                    </label>
                                                                                    <label>
                                                                                        <input id='checApproval'
                                                                                            className="form-check-input mt-4"
                                                                                            name="TextApproval" type="radio"
                                                                                            value="{{child.Title}}"
                                                                                            ng-click="selectRootLevelTerm(child)"
                                                                                            ng-model="ApprovalCategoriesType" />
                                                                                        Quick Approval
                                                                                    </label>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-sm-6  pad0">
                                                                <div className="full_width mb-10 clearfix">
                                                                    <label
                                                                        ng-bind-html="GetColumnDetails('priority') | trustedHTML"></label>
                                                                    <input type="text" className="form-control"
                                                                        placeholder="Priority" ng-model="PriorityRank"
                                                                        ng-change="getpriority()" />
                                                                    <ul className="pull-left padL-20">
                                                                        <li className="radio l-radio">

                                                                            <input className="form-check-input mt-4"
                                                                                name="radioPriority" type="radio"
                                                                                value="(1) High" ng-click="SelectPriority()"
                                                                                ng-model="Item.Priority" />High

                                                                        </li>
                                                                        <li className="radio l-radio">

                                                                            <input className="form-check-input mt-4"
                                                                                name="radioPriority" type="radio"
                                                                                value="(2) Normal" ng-click="SelectPriority()"
                                                                                ng-model="Item.Priority" />Normal

                                                                        </li>
                                                                        <li className="radio l-radio">

                                                                            <input className="form-check-input mt-4"
                                                                                name="radioPriority" type="radio"
                                                                                value="(3) Low" ng-click="SelectPriority()"
                                                                                ng-model="Item.Priority" />Low

                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                                <div className="full_width mb-10">
                                                                    <label>Client Activity</label>
                                                                    <input type="text" className="form-control" ng-required="true"
                                                                        ng-model="Item.ClientActivity" />
                                                                </div>
                                                                <div className="full_width mb-10">
                                                                    <div className="hhProcesscat">
                                                                        <label>
                                                                            "RelevantTaskType"
                                                                        </label>
                                                                        <input type="text" readOnly
                                                                            className="form-control ui-autocomplete-input"
                                                                            id="txtEventComponent" autoComplete="off" /><span
                                                                                role="status" aria-live="polite"
                                                                                className="ui-helper-hidden-accessible"></span>
                                                                        <span className="toltrip">
                                                                            <img ng-src="{{baseUrl}}/SiteCollectionImages/ICONS/Foundation/EMMCopyTerm.png"
                                                                                ng-click="openRelevantTaskPopup()" />
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="full_width mb-10"
                                                                    ng-repeat="item in AllRelevantTasks track by $index">
                                                                    <div className="hhProcesscat">
                                                                        <a className="hreflink" target="_blank"
                                                                            ng-href="{{pageContext}}/SitePages/Task-Profile.aspx?taskId={{item.Id}}&Site={{item.siteType}}"> item.Title </a>
                                                                        <a className="hreflink"
                                                                            ng-click="removeAllRelevantTasks(item.Id)">
                                                                            <img ng-src="/_layouts/images/delete.gif" />
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                                <div className="full_width mb-10" title="Relevant Portfolio Items">
                                                                    <div className="hhProcesscat">
                                                                        <label> Linked Component Task </label>
                                                                        <input type="text" ng-model="SearchComponent"
                                                                            className="form-control ui-autocomplete-input"
                                                                            id="{{RelevantPortfolioName=='Linked Service'?'txtRelevantServiceSharewebComponent':'txtRelevantSharewebComponent'}}"
                                                                            autoComplete="off" />
                                                                        <span role="status" aria-live="polite"
                                                                            className="ui-helper-hidden-accessible">

                                                                        </span>
                                                                        <span className="toltrip">
                                                                            <Picker />
                                                                        </span>
                                                                    </div>


                                                                    {/* <div className="hhProcesscat">
                                                                        <div className="block" ng-mouseover="HoverIn(item);"
                                                                            ng-mouseleave="ComponentTitle.STRING='';"
                                                                            title="{{ComponentTitle.STRING}}"
                                                                            ng-repeat="item in RelevantPortfolio track by $index">
                                                                            <a className="hreflink" target="_blank"
                                                                                ng-href="{{pageContext}}/SitePages/Portfolio-Profile.aspx?taskId={{item.Id}}">item.Title</a>
                                                                            <a className="hreflink"
                                                                                ng-click="removeRelevantPortfolio(item.Id)">
                                                                                <img ng-src="/_layouts/images/delete.gif" />
                                                                            </a>
                                                                        </div>
                                                                    </div> */}




                                                                </div>
                                                                <div className="full_width mb-10" title="Connect Service Tasks">

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


                                                        <div className="full_width mb-10">

                                                            <div ng-show="ItemType =='Component'" className="col-sm-12 pad0">
                                                                <div className="col-sm-6 pad0">
                                                                    <div className="col-sm-11 pad0 Doc-align">
                                                                        <label
                                                                            ng-bind-html="GetColumnDetails('ComponentCategory') | trustedHTML"></label>
                                                                        <input type="text" readOnly
                                                                            className="form-control ui-autocomplete-input"
                                                                            id="txtSharewebComponentCategory"
                                                                            autoComplete="off" /><span role="status"
                                                                                aria-live="polite"
                                                                                className="ui-helper-hidden-accessible"></span>
                                                                    </div>
                                                                    <div className="col-sm-1 no-padding">
                                                                        <label className="full_width">&nbsp;</label>
                                                                        <img ng-src="{{baseUrl}}/SiteCollectionImages/ICONS/Foundation/EMMCopyTerm.png"
                                                                            ng-click="openSmartComponentCategoryPopup('ComponentCategory', Item.SharewebComponent);" />
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className="col-sm-12">
                                                                            <div className="col-sm-12 pad0">
                                                                                <table>
                                                                                    <tr
                                                                                        ng-repeat="item in FilterCompCat=( CompCategoryItem | orderBy:orderBy:reverse)">
                                                                                        <td>
                                                                                            <input
                                                                                                ng-checked="isTermSelected(item)"
                                                                                                type="radio" className="mb-5"
                                                                                                ng-click="selectSmartCompCatItem(item)" /><span
                                                                                                    className="no-padding">item.Title</span>
                                                                                        </td>
                                                                                    </tr>
                                                                                </table>
                                                                               
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>



                                                            {/* <div ng-show="ItemDetails.siteType== 'Master Tasks'"
                                                                className="col-sm-12 pad0">
                                                                <div ng-show="ItemType!='Component'">

                                                                    <div className="col-sm-6 pad0">
                                                                        <label className="full_width">Parent</label>
                                                                        <div ng-show="SubComponentnameTitle!=undefined"
                                                                            className="col-sm-12 pad0">
                                                                            <span className="col-sm-11 no-padding block">
                                                                                SubComponentnameTitle
                                                                            </span>
                                                                            <span className="col-sm-1 no-padding">
                                                                                <a className="hreflink"
                                                                                    ng-click="selectcomponent()">
                                                                                    <img src="/_layouts/images/edititem.gif" />
                                                                                </a>
                                                                            </span>
                                                                        </div>
                                                                        <div ng-show="SubComponentnameTitle==undefined"
                                                                            className="col-sm-6 pad0">
                                                                            <span className="col-sm-11 no-padding">
                                                                                <a className="hreflink"
                                                                                    ng-click="selectcomponent()">
                                                                                    Select
                                                                                    Parent
                                                                                </a>
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div> */}

                                                        </div>

                                                        {/* <div ng-show="showApprovalSubCategory"
                                                            className="col-sm-12 full_width mb-10 pad0">
                                                            <div className="col-sm-6 pad0 hhProcesscat">
                                                                <label> Approver </label>
                                                                <input ng-show="SelectedApprover.length==0" type="text"
                                                                    className="form-control ui-autocomplete-input"
                                                                    id="txtApprovalUser" autoComplete="off" />
                                                                <span role="status" aria-live="polite"
                                                                    className="ui-helper-hidden-accessible"></span>
                                                                <div className="hhProcesscat">
                                                                    <div className="block" ng-mouseover="HoverIn(item);"
                                                                        ng-mouseleave="ComponentTitle.STRING='';"
                                                                        title="{{ComponentTitle.STRING}}"
                                                                        ng-repeat="item in SelectedApprover track by $index">
                                                                        <a className="hreflink" target="_blank"
                                                                            ng-href="{{pageContext}}/SitePages/Portfolio-Profile.aspx?taskId={{item.Id}}"> item.Title </a>
                                                                        <a className="hreflink"
                                                                            ng-click="removeSelectedApprover(item.Id)">
                                                                            <img ng-src="/_layouts/images/delete.gif" />
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                                <span className="toltrip">
                                                                    <img ng-src="{{baseUrl}}/SiteCollectionImages/ICONS/Foundation/EMMCopyTerm.png"
                                                                        ng-click="openApproverPopup()" />
                                                                </span>

                                                            </div>
                                                        </div> */}
                                                    </div>
                                                    <div className="col-md-3">

                                                        <div className="full_width mb-10">
                                                            <div ng-show="SiteComposition.length > 0"
                                                                className="col-sm-12 pad0 dashboard-sm-12 ">
                                                                <div className="panel panel-primary-head blocks"

                                                                    id="t_draggable1">
                                                                    <div className="panel-heading profileboxclr"
                                                                    >
                                                                        <h3 className="panel-title" style={{ textAlign: "inherit" }}>
                                                                            <span className="lbltitleclr">Site
                                                                                Composition</span>

                                                                            <span className="pull-left">
                                                                                <span
                                                                                    ng-if="!expand_collapseSiteComosition  &&Item.Portfolio_x0020_Type=='Component'"
                                                                                    style={{ backgroundColor: "#f5f5f5" }}
                                                                                    onClick={() => ExpandSiteComposition()}>
                                                                                    <img style={{ width: "10px" }}
                                                                                        src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png" />
                                                                                </span>

                                                                            </span>
                                                                        </h3>
                                                                    </div>
                                                                    {composition == true ?
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
                                                                                    <div ng-show="item.SiteName=='EPS'"
                                                                                        className="padLR">
                                                                                        <ul className="clint-Members-icons">
                                                                                            <li ng-show="client.siteName=='EPS'"
                                                                                                className="user-Member-img"
                                                                                                ng-repeat="client in Task.ClientCategory.results">
                                                                                                client.Title
                                                                                            </li>
                                                                                        </ul>
                                                                                    </div>
                                                                                    <div ng-show="item.SiteName=='EI'"
                                                                                        className="padLR">
                                                                                        <ul className="clint-Members-icons">
                                                                                            <li ng-show="client.siteName=='EI'"
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


                                                        <div className="full_width mb-10 pull-left">
                                                            <div className="hhProcesscat">
                                                                <label>status</label>
                                                                <input type="text" className="form-control" placeholder="% Complete" />
                                                                <span className="toltrip">
                                                                    <i onClick={() => openTaskStatusUpdatePoup()}

                                                                        aria-hidden="true"> <HiPencil /></i></span>
                                                            </div>



                                                        </div>

                                                        <div className="full_width mb-10">
                                                            <div className="col-md-6 pad0">
                                                                <div className="hhProcesscat">
                                                                    <label
                                                                        ng-bind-html="GetColumnDetails('time') | trustedHTML"></label>
                                                                    <input type="text" className="form-control" placeholder="Time"
                                                                        ng-model="Item.Mileage" />

                                                                    <ul className="pull-left padL-20">


                                                                        <li className="radio l-radio">

                                                                            <input name="radioTime" className="mt-4"
                                                                                ng-checked="Item.Mileage=='15'" type="radio"
                                                                                ng-click="SelectTime('15')" />Very
                                                                            Quick

                                                                        </li>
                                                                        <li className="radio l-radio">

                                                                            <input name="radioTime" className="mt-4"
                                                                                ng-checked="Item.Mileage=='60'" type="radio"
                                                                                ng-click="SelectTime('60')" />Quick

                                                                        </li>
                                                                        <li className="radio l-radio">

                                                                            <input name="radioTime" className="mt-4"
                                                                                ng-checked="Item.Mileage=='240'" type="radio"
                                                                                ng-click="SelectTime('240')" />Medium

                                                                        </li>
                                                                        <li className="radio l-radio">

                                                                            <input name="radioTime" className="mt-4"
                                                                                ng-checked="Item.Mileage=='480'" type="radio"
                                                                                ng-click="SelectTime('480')" />Long

                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6 padR-0">
                                                                <div className="hhProcesscat" ng-if="AssignedToUsers.length>0">
                                                                    <label className="full_width ">Task Users</label>
                                                                    <div className="responsibility_tile">
                                                                        <div className="responsibility_tile">
                                                                            <a className="hreflink"
                                                                                ng-if="image.userImage!=undefined"
                                                                                ng-repeat="image in AssignedToUsers"
                                                                                target="_blank"
                                                                                href="https://hhhhteams.sharepoint.com/sites/HHHH/SP/PublishingImages/NewUsersImages/Santosh%20Kumar.png">
                                                                                <img ui-draggable="true"
                                                                                    on-drop-success="dropSuccessHandler($event, $index, AssignedToUsers)"
                                                                                    data-toggle="popover" data-trigger="hover"
                                                                                    className="ProirityAssignedUserPhoto"

                                                                                    src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/PublishingImages/NewUsersImages/Santosh%20Kumar.png" />
                                                                            </a>
                                                                        </div>
                                                                        {/* <div className="responsibility_tile">
                                                                            <a ng-if="image.userImage == undefined && image.Item_x0020_Cover!=undefined &&image.Item_x0020_Cover.Url!=undefined"
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
                                                                            <a ng-if="(image.userImage==undefined) &&(image.Item_x0020_Cover==undefined || image.Item_x0020_Cover.Url==undefined)"
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
                                                            <ComponentMail />
                                                        </div>
                                                        <div className="pull-right">

                                                        </div>
                                                    </div>

                                                    <div className="col-sm-8 mb-10 pad0">
                                                        <div className="col-sm-11 pad0">
                                                            <label>Relevant URL</label>
                                                            <input type="text" className="form-control" placeholder="Url"
                                                                style={{ width: "100%" }} ng-model="Item.component_x0020_link.Url" />
                                                        </div>
                                                        <div className="col-sm-1 no-padding mt-25">
                                                            <a target="_blank" ng-show="Item.component_x0020_link!=undefined"
                                                                ng-href="{{Item.component_x0020_link.Url}}"
                                                                ng-bind-html="GetColumnDetails('open') | trustedHTML"></a>
                                                        </div>
                                                    </div>
                                                </div>





                                                <div className="col-sm-12 pad0">
                                                    {ImageSection.map(function (Image: any) {
                                                        return (


                                                            <div ng-show="selectedAdminImageUrl != undefined && selectedAdminImageUrl != ''"
                                                            >
                                                                <div ng-show="BasicImageUrl.AdminTab=='Basic'" className="col-sm-12  mt-5">
                                                                    <span className="">
                                                                        {Image.ImageName}
                                                                        <a title="Delete" data-toggle="modal"
                                                                            ng-click="deleteCurrentImage('Basic',BasicImageUrl.ImageName)">
                                                                            <img ng-src="/_layouts/images/delete.gif" />
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
                                                                            style={isDragging ? { color: "red" } : {color:"darkblue"}}
                                                                            onClick={onImageUpload}
                                                                            {...dragProps}
                                                                        >
                                                                            Upload Image
                                                                        </a>
                                                                        &nbsp;
                                                                        <a  style={{color:"darkblue",margin:"3px"}} onClick={onImageRemoveAll}>Remove all images</a>
                                                                        <span className="ImageBox">
                                                                        {imageList.map((image: any, index: any) => (
                                                                            <div key={index} className="image-item">
                                                                                <img src={image.dataURL} alt="" width="100%" className="ImageBox"/>
                                                                                <div className="image-item__btn-wrapper">
                                                                                    <a onClick={() => onImageUpdate(index)}><img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif" /></a>
                                                                                    <a style={{margin:"3px"}} onClick={() => onImageRemove(index)}><img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/_layouts/images/delete.gif" /></a>
                                                                                    
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

                                    </Tab>
                                    <Tab title="TIME SHEET">
                                        <TeamComposition props={Items} />

                                        <div className="container mt-0 pad0">
                                            <div className="col-sm-12 pad0" style={{ width: "1000px" }}>
                                                <span ng-if="Item!=undefined">

                                                </span>
                                                <div className="col-sm-12 pad0 mt-10" ng-form
                                                    role="form">
                                                    <div className="col-sm-12 padL-0 pr-5 TimeTabBox">
                                                        <a className="hreflink pull-right mt-5 mr-0" ng-click="AddedTaskTime()">

                                                            + Add Time in New Structure
                                                        </a>
                                                        <div className="right-col pt-0 MtPb" ng-show="IsTimeSheetAvailable">
                                                            <div className="Alltable" style={{ display: "block" }}>
                                                                <div className="col-sm-12 pad0 smart">
                                                                    <div className="section-event">
                                                                        <div className="continer-new">
                                                                            <table className="table table-hover" style={{ width: "100%" }}>
                                                                                <thead>
                                                                                    <tr>
                                                                                        <th style={{ width: "20%" }}>
                                                                                            <div style={{ width: "19%" }} className="smart-relative">
                                                                                                <input type="text" id="searchTaskId"
                                                                                                    placeholder="User Name"
                                                                                                    title="User Name" className="full_width searchbox_height"
                                                                                                    ng-model="getAuthorName" />
                                                                                                <span ng-show="getAuthorName.length>0"
                                                                                                    className="searchclear-bg"
                                                                                                    ng-click="clearTimeControl('getAuthorName')">X</span>
                                                                                                <span className="sorticon">
                                                                                                    <span className="ml0">
                                                                                                        <i className="fa fa-angle-up hreflink {{orderByTime=='AuthorName'&&!reverseTime?'siteColor':''}}"
                                                                                                            ng-click="SortbyTime('AuthorName', false)"></i>
                                                                                                    </span>
                                                                                                    <span className="ml0">
                                                                                                        <i className="fa fa-angle-down hreflink {{orderByTime=='AuthorName'&&reverseTime?'siteColor':''}}"
                                                                                                            ng-click="SortbyTime('AuthorName', true)"></i>
                                                                                                    </span>
                                                                                                </span>
                                                                                            </div>
                                                                                        </th>
                                                                                        <th style={{ width: "15%" }}>
                                                                                            <div style={{ width: "14%" }} className="smart-relative">
                                                                                                <input id="searchsiteType"

                                                                                                    type="search" placeholder="Date"
                                                                                                    title="Date" className="full_width searchbox_height"
                                                                                                    ng-model="searchTaskDate" />
                                                                                                <span ng-show="searchTaskDate.length>0"
                                                                                                    className="searchclear-bg"
                                                                                                    ng-click="clearTimeControl('searchTaskDate')">X</span>
                                                                                                <span className="sorticon">
                                                                                                    <span className="ml0">
                                                                                                        <i className="fa fa-angle-up hreflink {{orderByTime=='ServerTaskDate'&&!reverseTime?'siteColor':''}}"
                                                                                                            ng-click="SortbyTime('ServerTaskDate', false)"></i>
                                                                                                    </span>
                                                                                                    <span className="ml0">
                                                                                                        <i className="fa fa-angle-down hreflink {{orderByTime=='ServerTaskDate'&&reverseTime?'siteColor':''}}"
                                                                                                            ng-click="SortbyTime('ServerTaskDate', true)"></i>
                                                                                                    </span>
                                                                                                </span>

                                                                                            </div>

                                                                                        </th>
                                                                                        <th style={{ width: "10%" }} className="">
                                                                                            <div style={{ width: "9%" }} className="smart-relative">
                                                                                                <input type="text" id="searchSecondlevel"
                                                                                                    placeholder="Time" title="Time"
                                                                                                    className="full_width searchbox_height"
                                                                                                    ng-model="searchTaskTime" />
                                                                                                <span ng-show="searchTaskTime.length>0"
                                                                                                    className="searchclear-bg"
                                                                                                    ng-click="clearTimeControl('searchTaskTime')">X</span>
                                                                                                <span className="sorticon">
                                                                                                    <span className="ml0">
                                                                                                        <i className="fa fa-angle-up hreflink {{orderByTime=='TaskTime'&&!reverseTime?'siteColor':''}}"
                                                                                                            ng-click="SortbyTime('TaskTime', false)"></i>
                                                                                                    </span>
                                                                                                    <span className="ml0">
                                                                                                        <i className="fa fa-angle-down hreflink {{orderByTime=='TaskTime'&&reverseTime?'siteColor':''}}"
                                                                                                            ng-click="SortbyTime('TaskTime', true)"></i>
                                                                                                    </span>
                                                                                                </span>
                                                                                            </div>
                                                                                        </th>
                                                                                        <th style={{ width: "55%" }} className="">
                                                                                            <div style={{ width: "53%" }} className="smart-relative">
                                                                                                <input id="searchTotalValue" type="text"
                                                                                                    placeholder="Description"
                                                                                                    title="Description" className="full_width searchbox_height"
                                                                                                    ng-model="searchDescription" />
                                                                                                <span ng-show="searchDescription.length>0"
                                                                                                    className="searchclear-bg"
                                                                                                    ng-click="clearTimeControl('searchDescription')">X</span>

                                                                                            </div>
                                                                                        </th>
                                                                                        <div style={{ width: "7%" }}>
                                                                                            <div style={{ width: "6%" }} className="smart-relative">

                                                                                            </div>
                                                                                        </div>
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody>
                                                                                    <tr ng-if="item.Childs.length>0"
                                                                                        ng-repeat-start="item in TaskTimeSheetCategoriesGrouping track by $index">

                                                                                    </tr>
                                                                                    <tr ng-show="item.Expanded" className="active"
                                                                                        ng-repeat-end>
                                                                                        <td className="pad0" colSpan={10}>
                                                                                            <table className="table">
                                                                                                <tr className="for-c02 for-lis backcolorsecond  {{item.Expanded?'project_activess tdrows':'tdrows'}}"
                                                                                                    ng-repeat-start="child in item.Childs|orderBy:'SortOrder':false">
                                                                                                    <td style={{ width: "1%" }}>
                                                                                                    </td>
                                                                                                    <td style={{ width: "2%" }}>
                                                                                                        <a className="hreflink"
                                                                                                            ng-show="!child.Expanded && ((Item.Component.results.length>0 && !Item.Services.results.length>0) ||(!Item.Component.results.length>0 && !Item.Services.results.length>0))"
                                                                                                            ng-click="child.Expanded=true"
                                                                                                            title="Tap to expand the {{child.Title}} childs">
                                                                                                            <img
                                                                                                                src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png" />
                                                                                                        </a>
                                                                                                        <a className="hreflink"
                                                                                                            ng-show="child.Expanded && ((Item.Component.results.length>0 && !Item.Services.results.length>0) ||(!Item.Component.results.length>0 && !Item.Services.results.length>0))"
                                                                                                            ng-click="child.Expanded=false"
                                                                                                            title="Tap to Shrink the {{child.Title}} childs">
                                                                                                            <img
                                                                                                                src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png" />
                                                                                                        </a>
                                                                                                        <a className="hreflink"
                                                                                                            ng-show="!child.Expanded && Item.Services.results.length>0"
                                                                                                            ng-click="child.Expanded=true"
                                                                                                            title="Tap to expand the {{child.Title}} childs">
                                                                                                            <img
                                                                                                                ng-src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png" />
                                                                                                        </a>
                                                                                                        <a className="hreflink"
                                                                                                            ng-show="child.Expanded && Item.Services.results.length>0 "
                                                                                                            ng-click="child.Expanded=false"
                                                                                                            title="Tap to Shrink the {{child.Title}} childs">
                                                                                                            <img
                                                                                                                ng-src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png" />
                                                                                                        </a>
                                                                                                    </td>
                                                                                                    <td style={{ width: "90%" }}>
                                                                                                        <span>

                                                                                                        </span>
                                                                                                        <span className="ml5">
                                                                                                            <img className="button-icon hreflink"
                                                                                                                title="Sort Order"
                                                                                                                ng-click="sortitem(child);"
                                                                                                                ng-src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/customsort.png" />
                                                                                                        </span>

                                                                                                        <span className="ml5">
                                                                                                            <img className="button-icon hreflink"
                                                                                                                title="Edit"
                                                                                                                ng-click="openEditTitlepopup(child);"
                                                                                                                ng-src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/32/edititem.gif" />
                                                                                                        </span>
                                                                                                        <span className="ml5">
                                                                                                            <a ng-click="DeleteTitle(child)"
                                                                                                                className="hreflink"
                                                                                                                title="Delete">
                                                                                                                <img
                                                                                                                    ng-src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/32/delete.gif" />
                                                                                                            </a>
                                                                                                        </span>
                                                                                                    </td>

                                                                                                    <td style={{ width: "19%" }}>
                                                                                                        <a className="hreflink pull-right mt-5 mr-0"
                                                                                                            ng-click="openAdditionalTimeEntry(child)">

                                                                                                            + Add Time-Entry
                                                                                                        </a>
                                                                                                    </td>
                                                                                                </tr>
                                                                                                <tr ng-show="child.Expanded" className="active"
                                                                                                    ng-repeat-end>
                                                                                                    <td colSpan={10} className="pad0">
                                                                                                        <table className="table">
                                                                                                            <tr className="for-c03 tdrows"
                                                                                                                ng-repeat="subchild in child.AdditionalTime | orderBy:orderByTime:reverseTime | filter:{AuthorName:getAuthorName,TaskDate:searchTaskDate,TaskTime:searchTaskTime,Description:searchDescription} track by $index">
                                                                                                                <td style={{ width: "1%" }}>
                                                                                                                </td>
                                                                                                                <td style={{ width: "6%" }}>
                                                                                                                    <img className="AssignUserPhoto1 bdrbox"
                                                                                                                        title="{{subchild.AuthorName}}"
                                                                                                                        data-toggle="popover"
                                                                                                                        data-trigger="hover"
                                                                                                                        ng-src="{{subchild.AuthorImage}}" />
                                                                                                                </td>

                                                                                                                <td style={{ width: "19%" }}
                                                                                                                    className="">
                                                                                                                    <span></span>
                                                                                                                </td>
                                                                                                                <td
                                                                                                                    className="">
                                                                                                                    " subchild.TaskDate"
                                                                                                                </td>
                                                                                                                <td style={{ width: "10%" }}
                                                                                                                    className=" ">

                                                                                                                </td>
                                                                                                                <td style={{ width: "49%" }}
                                                                                                                    className="">

                                                                                                                </td>
                                                                                                                <td
                                                                                                                    className=""></td>
                                                                                                                <td style={{ width: "19%" }}
                                                                                                                    className="padLR">
                                                                                                                    <a title="Copy"
                                                                                                                        className="hreflink"
                                                                                                                        ng-click="openAdditionalTimeEntry1(child,subchild.ID);">
                                                                                                                        <img
                                                                                                                            src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/32/icon_copy.png" />
                                                                                                                    </a>

                                                                                                                    <a title="Edit"
                                                                                                                        className="hreflink"
                                                                                                                        ng-click="openEditAdditionalTimeEntry(subchild,$index);">
                                                                                                                        <img className="no-padding"
                                                                                                                            src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/32/edititem.gif" />
                                                                                                                    </a>
                                                                                                                    <a ng-click="DeleteAdditionalTime(subchild)"
                                                                                                                        className="hreflink"
                                                                                                                        title="Delete">
                                                                                                                        <img className="no-padding"
                                                                                                                            src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/32/delete.gif" />
                                                                                                                    </a>

                                                                                                                </td>



                                                                                                            </tr>
                                                                                                            <tr className="active" ng-repeat-end>
                                                                                                                <td colSpan={10} className="pad0">
                                                                                                                    <table className="table">
                                                                                                                        <tr className="for-c03 tdrows"
                                                                                                                            ng-repeat="subchilds in subchild.AdditionalTime ">
                                                                                                                            <td style={{ width: "3%" }}>
                                                                                                                            </td>
                                                                                                                            <td style={{ width: "12%" }}>
                                                                                                                                <img className="AssignUserPhoto1"
                                                                                                                                    title="{{subchilds.AuthorName}}"
                                                                                                                                    data-toggle="popover"
                                                                                                                                    data-trigger="hover"
                                                                                                                                />
                                                                                                                            </td>
                                                                                                                            <td style={{ width: "25%" }}
                                                                                                                                className="">
                                                                                                                                <span></span>
                                                                                                                            </td>
                                                                                                                            <td style={{ width: "25%" }}
                                                                                                                                className="">

                                                                                                                            </td>
                                                                                                                            <td style={{ width: "25%" }}
                                                                                                                                className="">

                                                                                                                            </td>
                                                                                                                            <td style={{ width: "25%" }}
                                                                                                                                className="">

                                                                                                                            </td>
                                                                                                                            <td style={{ width: "5%" }}
                                                                                                                                className="">
                                                                                                                            </td>
                                                                                                                            <td style={{ width: "5%" }}
                                                                                                                                className="">

                                                                                                                                <a title="Copy"
                                                                                                                                    className="hreflink"
                                                                                                                                    ng-click="openAdditionalTimeEntry1(child,subchilds.ID);">
                                                                                                                                    <img
                                                                                                                                        src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/32/icon_copy.png" />
                                                                                                                                </a>
                                                                                                                            </td>
                                                                                                                            <td style={{ width: "5%" }}
                                                                                                                                className="">

                                                                                                                                <a title="Edit"
                                                                                                                                    className="hreflink"
                                                                                                                                    ng-click="openEditAdditionalTimeEntry(subchilds);">
                                                                                                                                    <img className="no-padding"
                                                                                                                                        src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/32/edititem.gif" />
                                                                                                                                </a>
                                                                                                                            </td>

                                                                                                                            <td style={{ width: "5%" }}
                                                                                                                                className="">


                                                                                                                                <a ng-click="DeleteAdditionalTime(subchilds)"
                                                                                                                                    className="hreflink"
                                                                                                                                    title="Delete">
                                                                                                                                    <img className="no-padding"
                                                                                                                                        src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/32/delete.gif" />
                                                                                                                                </a>
                                                                                                                            </td>
                                                                                                                        </tr>
                                                                                                                    </table>
                                                                                                                </td>
                                                                                                            </tr>
                                                                                                        </table>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </table>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="right-col pt-0 MtPb" ng-show="!IsTimeSheetAvailable"
                                                        >
                                                            No Timesheet Available
                                                        </div>
                                                        <div id="AddedTaskTimepopup" className="modal fade in TimeTaskPopup"
                                                            role="dialog" aria-labelledby="myModalLabel"
                                                            aria-hidden="false" style={{ display: "none" }}>
                                                            <div className="modal-dialog" style={{ width: "800px" }}>
                                                                <div className="modal-content">
                                                                    <div className="modal-header">

                                                                        <h3 className="modal-title">
                                                                            Add Task Time
                                                                            <span className="pull-right">

                                                                            </span>
                                                                        </h3>
                                                                        <button type="button" className="close"
                                                                            data-dismiss="modal"
                                                                            ng-click="cancelAddedTaskTime()"
                                                                        >
                                                                            &times;
                                                                        </button>
                                                                    </div>
                                                                    <div className="modal-body bg-f5f5 clearfix">


                                                                        <div className="col-sm-9"
                                                                        >

                                                                            <div className="col-sm-12 pad0 form-group">
                                                                                <label>Selected Category</label>
                                                                                <input type="text" autoComplete="off"
                                                                                    className="form-control"
                                                                                    name="CategoriesTitle"
                                                                                    ng-model="SelectedCategoriesTitle"
                                                                                    readOnly />
                                                                            </div>

                                                                            <div className="col-sm-12 mt-5 pad0 form-group">
                                                                                <label>Title</label>
                                                                                <input type="text" autoComplete="off"
                                                                                    className="form-control" name="TimeTitle"
                                                                                    ng-model="TimeTitle" />
                                                                            </div>
                                                                            <div className="col-sm-12 pad0 form-group">
                                                                                <div className="col-sm-6 padL-0">
                                                                                    <div className="date-div">
                                                                                        <div className="Date-Div-BAR">
                                                                                            <span className="href"

                                                                                                id="selectedYear"

                                                                                                ng-click="changeDatetodayQuickly('firstOfMonth','AdditionalnewDate','AdditionalNewDatePicker','','NewEntry')">1st</span>
                                                                                            | <span className="href"

                                                                                                id="selectedYear"

                                                                                                ng-click="changeDatetodayQuickly('fifteenthOfMonth','AdditionalnewDate','AdditionalNewDatePicker','','NewEntry')">15th</span>
                                                                                            | <span className="href"

                                                                                                id="selectedYear"

                                                                                                ng-click="changeDatetodayQuickly('year','AdditionalnewDate','AdditionalNewDatePicker','','NewEntry')">
                                                                                                1
                                                                                                Jan
                                                                                            </span>
                                                                                            |
                                                                                            <span className="href"

                                                                                                id="selectedToday"

                                                                                                ng-click="changeDatetodayQuickly('today','AdditionalnewDate','AdditionalNewDatePicker','','NewEntry')">Today</span>
                                                                                        </div>
                                                                                        <label className="full_width">
                                                                                            Date

                                                                                        </label>
                                                                                        <input type="text"
                                                                                            autoComplete="off"
                                                                                            id="AdditionalNewDatePicker"
                                                                                            className="form-control"
                                                                                            ng-required="true"
                                                                                            placeholder="DD/MM/YYYY"
                                                                                            ng-model="AdditionalnewDate" />
                                                                                    </div>
                                                                                </div>

                                                                                <div
                                                                                    className="col-sm-6 pad0 session-control-buttons">
                                                                                    <div
                                                                                        className="col-sm-4 padL-0 form-container">
                                                                                        <button id="DayPlus"
                                                                                            className="top-container plus-button plus-minus"
                                                                                            ng-click="changeDateQuickly(AdditionalnewDate,'Increase','AdditionalnewDate','AdditionalNewDatePicker',undefined, 'Day','NewEntry')">
                                                                                            <i className="fa fa-plus"
                                                                                                aria-hidden="true"></i>
                                                                                        </button>
                                                                                        <span className="min-input">Day</span>
                                                                                        <button id="DayMinus"
                                                                                            className="top-container minus-button plus-minus"
                                                                                            ng-click="changeDateQuickly(AdditionalnewDate,'Decrease','AdditionalnewDate','AdditionalNewDatePicker',undefined, 'Day','NewEntry')">
                                                                                            <i className="fa fa-minus"
                                                                                                aria-hidden="true"></i>
                                                                                        </button>
                                                                                    </div>

                                                                                    <div
                                                                                        className="col-sm-4 padL-0 form-container">
                                                                                        <button id="MonthPlus"
                                                                                            className="top-container plus-button plus-minus"
                                                                                            ng-click="changeDateQuickly(AdditionalnewDate,'Increase','AdditionalnewDate','AdditionalNewDatePicker',undefined, 'Month','NewEntry')">
                                                                                            <i className="fa fa-plus"
                                                                                                aria-hidden="true"></i>
                                                                                        </button>
                                                                                        <span className="min-input">Month</span>
                                                                                        <button id="MonthMinus"
                                                                                            className="top-container minus-button plus-minus"
                                                                                            ng-click="changeDateQuickly(AdditionalnewDate,'Decrease','AdditionalnewDate','AdditionalNewDatePicker',undefined, 'Month','NewEntry')">
                                                                                            <i className="fa fa-minus"
                                                                                                aria-hidden="true"></i>
                                                                                        </button>
                                                                                    </div>

                                                                                    <div
                                                                                        className="col-sm-4 padL-0 form-container">
                                                                                        <button id="YearPlus"
                                                                                            className="top-container plus-button plus-minus"
                                                                                            ng-click="changeDateQuickly(AdditionalnewDate,'Increase','AdditionalnewDate','AdditionalNewDatePicker',undefined, 'Year','NewEntry')">
                                                                                            <i className="fa fa-plus"
                                                                                                aria-hidden="true"></i>
                                                                                        </button>
                                                                                        <span className="min-input">Year</span>
                                                                                        <button id="YearMinus"
                                                                                            className="top-container minus-button plus-minus"
                                                                                            ng-click="changeDateQuickly(AdditionalnewDate,'Decrease','AdditionalnewDate','AdditionalNewDatePicker',undefined, 'Year','NewEntry')">
                                                                                            <i className="fa fa-minus"
                                                                                                aria-hidden="true"></i>
                                                                                        </button>
                                                                                    </div>

                                                                                </div>

                                                                                <div className="col-sm-12 pad0 form-group">
                                                                                    <div className="col-sm-6 padL-0">
                                                                                        <label
                                                                                            ng-bind-html="GetColumnDetails('TimeSpent') | trustedHTML"></label>
                                                                                        <input type="text"
                                                                                            autoComplete="off"
                                                                                            className="form-control"
                                                                                            ng-required="true"
                                                                                            ng-pattern="/^[0-9]+(\.[0-9]{1,2})?$/"
                                                                                            name="timeSpent"
                                                                                            ng-model="TimeSpentInMinutes" ng-change="getInHours(TimeSpentInMinutes)" />
                                                                                        <span className="required"
                                                                                            ng-show="ItemForm.timespent.$error.pattern">
                                                                                            Not

                                                                                            a valid number!
                                                                                        </span>
                                                                                    </div>
                                                                                    <div
                                                                                        className="col-sm-6 pad0 Time-control-buttons">
                                                                                        <div className="padR-0 Quaterly-Time">
                                                                                            <label
                                                                                                className="full_width"></label>
                                                                                            <button className="btn btn-primary"
                                                                                                title="Decrease by 15 Min"
                                                                                                ng-click="changeTimeInMinutes(15,'Decrease','TimeSpentInMinutes')">
                                                                                                <img className="wid14 mt--2 hreflink"
                                                                                                    ng-src="{{pageContext}}/SiteCollectionImages/ICONS/Shareweb/Minus_White.png" />
                                                                                            </button>
                                                                                            <span> 15min </span>
                                                                                            <button className="btn btn-primary"
                                                                                                title="Increase by 15 Min"
                                                                                                ng-click="changeTimeInMinutes(15,'Increase','TimeSpentInMinutes')">
                                                                                                <img className="button-icon mt--2 hreflink"
                                                                                                    ng-src="{{pageContext}}/SiteCollectionImages/ICONS/Shareweb/CreateComponentIcon.png" />
                                                                                            </button>
                                                                                        </div>
                                                                                        <div className="padR-0 Full-Time">
                                                                                            <label
                                                                                                className="full_width"></label>
                                                                                            <button className="btn btn-primary"
                                                                                                title="Decrease by 60 Min"
                                                                                                ng-click="changeTimeInMinutes(60,'Decrease','TimeSpentInMinutes')">
                                                                                                <img className="wid14 mt--2 hreflink"
                                                                                                    ng-src="{{pageContext}}/SiteCollectionImages/ICONS/Shareweb/Minus_White.png" />
                                                                                            </button>
                                                                                            <span> 60min </span>
                                                                                            <button className="btn btn-primary"
                                                                                                title="Increase by 60 Min"
                                                                                                ng-click="changeTimeInMinutes(60,'Increase','TimeSpentInMinutes')">
                                                                                                <img className="button-icon mt--2 hreflink"
                                                                                                    ng-src="{{pageContext}}/SiteCollectionImages/ICONS/Shareweb/CreateComponentIcon.png" />
                                                                                            </button>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-sm-12 pad0 form-group">
                                                                                    <div className="col-sm-6 padL-0">
                                                                                        <label>Time Spent (in hours)</label>
                                                                                        <input className="form-control" type="text" ng-model="TimeInHours" readOnly />
                                                                                    </div>
                                                                                </div>

                                                                                <div className="col-sm-12 pad0">
                                                                                    <label>Short Description</label>
                                                                                    <textarea
                                                                                        id="AdditionalshortDescription"
                                                                                        cols={15} rows={4}
                                                                                        ng-model="Description"></textarea>
                                                                                </div>

                                                                            </div>
                                                                        </div>
                                                                        <div className="col-sm-3 pad0">

                                                                            <div className="col-sm-12">

                                                                                <a target="_blank" className="mb-5"
                                                                                    ng-href="{{pageContext}}/SitePages/SmartMetadata.aspx?TabName=Timesheet">
                                                                                    Manage
                                                                                    Categories
                                                                                </a>
                                                                                <span className="col-sm-12 mt-5"
                                                                                    id="subcategorytasksPriority{{item.Id}}"
                                                                                    ng-repeat="item in TaskTimeSheetCategories track by $index">
                                                                                    <input
                                                                                        id="subcategorytasksPriority{{item.Id}}"
                                                                                        ng-click="TasksCategories(item)"
                                                                                        type="radio" className="mt-0"
                                                                                        value='{{item.Id}}'
                                                                                        name="taskcategory" />
                                                                                    <label>Items.Title</label>
                                                                                </span>

                                                                            </div>
                                                                        </div>

                                                                    </div>


                                                                    <div className="modal-footer">
                                                                        <button type="button" id='saveTimespent'

                                                                            ng-disabled="TimeTitle==undefined || TimeTitle=='' || SelectedCategoriesTitle==undefined"
                                                                            className="btn btn-primary pull-right"
                                                                            ng-click="saveTimeSpent()">
                                                                            Submit
                                                                        </button>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div id="AdditionalTimeEntrypopup" className="modal fade in"
                                                            role="dialog" aria-labelledby="myModalLabel"
                                                            aria-hidden="false" style={{ display: "none" }}>
                                                            <div className="modal-dialog">
                                                                <div className="modal-content">
                                                                    <div className="modal-header">
                                                                        <h3 className="modal-title">
                                                                            Add Additional Time -

                                                                        </h3>
                                                                        <button type="button" className="close"
                                                                            data-dismiss="modal"
                                                                            ng-click="cancelAdditionalTimeEntry()"
                                                                        >
                                                                            &times;
                                                                        </button>
                                                                    </div>
                                                                    <div className="modal-body bg-f5f5 clearfix">
                                                                        <div className="col-sm-12 pad0 form-group">
                                                                            <div className="col-sm-8 padL-0">
                                                                                <div className="date-div">
                                                                                    <div className="Date-Div-BAR">
                                                                                        <span className="href"

                                                                                            id="selectedYear"

                                                                                            ng-click="changeDatetodayQuickly('firstOfMonth','AdditionalnewDate','AdditionalNewDatePicker','','NewEntry')">1st</span>
                                                                                        | <span className="href"

                                                                                            id="selectedYear"

                                                                                            ng-click="changeDatetodayQuickly('fifteenthOfMonth','AdditionalnewDate','AdditionalNewDatePicker','','NewEntry')">15th</span>
                                                                                        | <span className="href"

                                                                                            id="selectedYear"
                                                                                            ng-click="changeDatetodayQuickly('year','AdditionalnewDate','AdditionalNewDatePicker','','NewEntry')">
                                                                                            1
                                                                                            Jan
                                                                                        </span>
                                                                                        |
                                                                                        <span className="href"

                                                                                            id="selectedToday"
                                                                                            ng-click="changeDatetodayQuickly('today','AdditionalnewDate','AdditionalNewDatePicker','','NewEntry')">Today</span>
                                                                                    </div>
                                                                                    <label className="full_width">
                                                                                        Date

                                                                                    </label>
                                                                                    <input type="text" autoComplete="off"
                                                                                        id="AdditionalNewDatePicker1"
                                                                                        className="form-control"
                                                                                        ng-required="true"
                                                                                        placeholder="DD/MM/YYYY"
                                                                                        ng-model="AdditionalnewDate" />
                                                                                </div>
                                                                            </div>

                                                                            <div
                                                                                className="col-sm-4 pad0 session-control-buttons">
                                                                                <div className="col-sm-4 padL-0 form-container">
                                                                                    <button id="DayPlus"
                                                                                        className="top-container plus-button plus-minus"
                                                                                        ng-click="changeDateQuickly(AdditionalnewDate,'Increase','AdditionalnewDate','AdditionalNewDatePicker',undefined, 'Day','NewEntry')">
                                                                                        <i className="fa fa-plus"
                                                                                            aria-hidden="true"></i>
                                                                                    </button>
                                                                                    <span className="min-input">Day</span>
                                                                                    <button id="DayMinus"
                                                                                        className="top-container minus-button plus-minus"
                                                                                        ng-click="changeDateQuickly(AdditionalnewDate,'Decrease','AdditionalnewDate','AdditionalNewDatePicker',undefined, 'Day','NewEntry')">
                                                                                        <i className="fa fa-minus"
                                                                                            aria-hidden="true"></i>
                                                                                    </button>
                                                                                </div>

                                                                                <div className="col-sm-4 padL-0 form-container">
                                                                                    <button id="MonthPlus"
                                                                                        className="top-container plus-button plus-minus"
                                                                                        ng-click="changeDateQuickly(AdditionalnewDate,'Increase','AdditionalnewDate','AdditionalNewDatePicker',undefined, 'Month','NewEntry')">
                                                                                        <i className="fa fa-plus"
                                                                                            aria-hidden="true"></i>
                                                                                    </button>
                                                                                    <span className="min-input">Month</span>
                                                                                    <button id="MonthMinus"
                                                                                        className="top-container minus-button plus-minus"
                                                                                        ng-click="changeDateQuickly(AdditionalnewDate,'Decrease','AdditionalnewDate','AdditionalNewDatePicker',undefined, 'Month','NewEntry')">
                                                                                        <i className="fa fa-minus"
                                                                                            aria-hidden="true"></i>
                                                                                    </button>
                                                                                </div>

                                                                                <div className="col-sm-4 padL-0 form-container">
                                                                                    <button id="YearPlus"
                                                                                        className="top-container plus-button plus-minus"
                                                                                        ng-click="changeDateQuickly(AdditionalnewDate,'Increase','AdditionalnewDate','AdditionalNewDatePicker',undefined, 'Year','NewEntry')">
                                                                                        <i className="fa fa-plus"
                                                                                            aria-hidden="true"></i>
                                                                                    </button>
                                                                                    <span className="min-input">Year</span>
                                                                                    <button id="YearMinus"
                                                                                        className="top-container minus-button plus-minus"
                                                                                        ng-click="changeDateQuickly(AdditionalnewDate,'Decrease','AdditionalnewDate','AdditionalNewDatePicker',undefined, 'Year','NewEntry')">
                                                                                        <i className="fa fa-minus"
                                                                                            aria-hidden="true"></i>
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        <div className="col-sm-12 pad0 form-group">
                                                                            <div className="col-sm-6 padL-0">
                                                                                <label
                                                                                    ng-bind-html="GetColumnDetails('TimeSpent') | trustedHTML"></label>
                                                                                <input type="text" autoComplete="off"
                                                                                    className="form-control" ng-required="true"
                                                                                    ng-pattern="/^[0-9]+(\.[0-9]{1,2})?$/"
                                                                                    name="timeSpent"
                                                                                    ng-model="TimeSpentInMinutes" ng-change="getInHours(TimeSpentInMinutes)" />
                                                                                <span className="required"
                                                                                    ng-show="ItemForm.timespent.$error.pattern">
                                                                                    Not

                                                                                    a valid number!
                                                                                </span>
                                                                            </div>
                                                                            <div className="col-sm-6 pad0 Time-control-buttons">
                                                                                <div className="padR-0 Quaterly-Time">
                                                                                    <label className="full_width"></label>
                                                                                    <button className="btn btn-primary"
                                                                                        title="Decrease by 15 Min"
                                                                                        ng-click="changeTimeInMinutes(15,'Decrease','TimeSpentInMinutes')">
                                                                                        <img className="wid14 mt--2 hreflink"
                                                                                            ng-src="{{pageContext}}/SiteCollectionImages/ICONS/Shareweb/Minus_White.png" />
                                                                                    </button>
                                                                                    <span> 15min </span>
                                                                                    <button className="btn btn-primary"
                                                                                        title="Increase by 15 Min"
                                                                                        ng-click="changeTimeInMinutes(15,'Increase','TimeSpentInMinutes')">
                                                                                        <img className="button-icon mt--2 hreflink"
                                                                                            ng-src="{{pageContext}}/SiteCollectionImages/ICONS/Shareweb/CreateComponentIcon.png" />
                                                                                    </button>
                                                                                </div>
                                                                                <div className="padR-0 Full-Time">
                                                                                    <label className="full_width"></label>
                                                                                    <button className="btn btn-primary"
                                                                                        title="Decrease by 60 Min"
                                                                                        ng-click="changeTimeInMinutes(60,'Decrease','TimeSpentInMinutes')">
                                                                                        <img className="wid14 mt--2 hreflink"
                                                                                            ng-src="{{pageContext}}/SiteCollectionImages/ICONS/Shareweb/Minus_White.png" />
                                                                                    </button>
                                                                                    <span> 60min </span>
                                                                                    <button className="btn btn-primary"
                                                                                        title="Increase by 60 Min"
                                                                                        ng-click="changeTimeInMinutes(60,'Increase','TimeSpentInMinutes')">
                                                                                        <img className="button-icon mt--2 hreflink"
                                                                                            ng-src="{{pageContext}}/SiteCollectionImages/ICONS/Shareweb/CreateComponentIcon.png" />
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-sm-12 pad0 form-group">
                                                                            <div className="col-sm-6 padL-0">
                                                                                <label>Time Spent (in hours)</label>
                                                                                <input className="form-control" type="text" ng-model="TimeInHours" readOnly />
                                                                            </div>
                                                                        </div>

                                                                        <div className="col-sm-12 pad0">
                                                                            <label>Short Description</label>
                                                                            <textarea id="AdditionalshortDescription"
                                                                                cols={15} rows={4}
                                                                                ng-model="Description"></textarea>
                                                                        </div>

                                                                    </div>
                                                                    <div className="modal-footer">
                                                                        <button type="button" className="btn btn-primary"
                                                                            ng-click="saveAdditionalTimeSpent()">
                                                                            Submit
                                                                        </button>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div id="AdditionalTimeEntrypopup1" className="modal fade in"
                                                            role="dialog" aria-labelledby="myModalLabel"
                                                            aria-hidden="false" style={{ display: "none" }}>
                                                            <div className="modal-dialog modal-md">
                                                                <div className="modal-content">
                                                                    <div className="modal-header">

                                                                        <h3 className="modal-title">
                                                                            Copy Time Entry -
                                                                        </h3>
                                                                        <button type="button" className="close"
                                                                            data-dismiss="modal"
                                                                            ng-click="cancelAdditionalTimeEntry()"
                                                                        >
                                                                            &times;
                                                                        </button>
                                                                    </div>
                                                                    <div className="modal-body bg-f5f5 clearfix">

                                                                        <div className="col-sm-12 pad0 form-group">
                                                                            <div className="col-sm-8 padL-0">
                                                                                <div className="date-div">
                                                                                    <div className="Date-Div-BAR">
                                                                                        <span className="href"

                                                                                            id="selectedYear"

                                                                                            ng-click="changeDatetodayQuickly('firstOfMonth','AdditionalnewDate','CopyAdditionalNewDatePicker','TaskDate','edit')">1st</span>
                                                                                        | <span className="href"

                                                                                            id="selectedYear"

                                                                                            ng-click="changeDatetodayQuickly('fifteenthOfMonth','AdditionalnewDate','CopyAdditionalNewDatePicker','TaskDate','edit')">15th</span>
                                                                                        | <span className="href"

                                                                                            id="selectedYear"
                                                                                            ng-click="changeDatetodayQuickly('year','AdditionalnewDate','CopyAdditionalNewDatePicker','TaskDate','edit')">
                                                                                            1
                                                                                            Jan
                                                                                        </span> |
                                                                                        <span
                                                                                            id="editselectedToday"

                                                                                            ng-click="changeDatetodayQuickly('today','AdditionalnewDate','CopyAdditionalNewDatePicker','TaskDate','edit')">Today</span>
                                                                                    </div>
                                                                                    <label className="full_width">
                                                                                        Date
                                                                                    </label>
                                                                                    <input type="text" autoComplete="off"
                                                                                        id="CopyAdditionalNewDatePicker"
                                                                                        className="form-control"
                                                                                        ng-required="true"
                                                                                        placeholder="DD/MM/YYYY"
                                                                                        ng-model="AdditionalnewDate" />
                                                                                </div>
                                                                            </div>

                                                                            <div
                                                                                className="col-sm-4 pad0 session-control-buttons">
                                                                                <div>
                                                                                    <button id="DayPlus"
                                                                                        className="top-container plus-button plus-minus"
                                                                                        ng-click="changeDateQuickly(AdditionalnewDate,'Increase','AdditionalnewDate','CopyAdditionalNewDatePicker',undefined, 'Day','edit')">
                                                                                        <i className="fa fa-plus"
                                                                                            aria-hidden="true"></i>
                                                                                    </button>
                                                                                    <span className="min-input">Day</span>
                                                                                    <button id="DayMinus"
                                                                                        className="top-container minus-button plus-minus"
                                                                                        ng-click="changeDateQuickly(AdditionalnewDate,'Decrease','AdditionalnewDate','CopyAdditionalNewDatePicker',undefined, 'Day','edit')">
                                                                                        <i className="fa fa-minus"
                                                                                            aria-hidden="true"></i>
                                                                                    </button>
                                                                                </div>

                                                                                <div>
                                                                                    <button id="MonthPlus"
                                                                                        className="top-container plus-button plus-minus"
                                                                                        ng-click="changeDateQuickly(AdditionalnewDate,'Increase','AdditionalnewDate','CopyAdditionalNewDatePicker',undefined, 'Month','edit')">
                                                                                        <i className="fa fa-plus"
                                                                                            aria-hidden="true"></i>
                                                                                    </button>
                                                                                    <span className="min-input">Month</span>
                                                                                    <button id="MonthMinus"
                                                                                        className="top-container minus-button plus-minus"
                                                                                        ng-click="changeDateQuickly(AdditionalnewDate,'Decrease','AdditionalnewDate','CopyAdditionalNewDatePicker',undefined, 'Month','edit')">
                                                                                        <i className="fa fa-minus"
                                                                                            aria-hidden="true"></i>
                                                                                    </button>
                                                                                </div>

                                                                                <div>
                                                                                    <button id="YearPlus"
                                                                                        className="top-container plus-button plus-minus"
                                                                                        ng-click="changeDateQuickly(AdditionalnewDate,'Increase','AdditionalnewDate','CopyAdditionalNewDatePicker',undefined, 'Year','edit')">
                                                                                        <i className="fa fa-plus"
                                                                                            aria-hidden="true"></i>
                                                                                    </button>
                                                                                    <span className="min-input">Year</span>
                                                                                    <button id="YearMinus"
                                                                                        className="top-container minus-button plus-minus"
                                                                                        ng-click="changeDateQuickly(AdditionalnewDate,'Decrease','AdditionalnewDate','CopyAdditionalNewDatePicker',undefined, 'Year','edit')">
                                                                                        <i className="fa fa-minus"
                                                                                            aria-hidden="true"></i>
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-sm-12 pad0 form-group">
                                                                            <div className="col-sm-6 padL-0">
                                                                                <label
                                                                                    ng-bind-html="GetColumnDetails('TimeSpent') | trustedHTML"></label>
                                                                                <input type="text" autoComplete="off"
                                                                                    className="form-control" ng-required="true"
                                                                                    ng-pattern="/^[0-9]+(\.[0-9]{1,2})?$/"
                                                                                    name="timeSpent"
                                                                                    ng-model="TimeSpentInMinutes" />
                                                                                <span className="required"
                                                                                    ng-show="ItemForm.timespent.$error.pattern">
                                                                                    Not
                                                                                    a valid number!
                                                                                </span>
                                                                            </div>
                                                                            <div className="col-sm-6 pad0 Time-control-buttons">
                                                                                <div className="padR-0 Quaterly-Time">
                                                                                    <label className="full_width"></label>
                                                                                    <button className="btn btn-primary"
                                                                                        title="Decrease by 15 Min"
                                                                                        ng-click="changeTimeInMinutes(15,'Decrease','TimeSpentInMinutes')">
                                                                                        <img className="wid14 mt--2 hreflink"
                                                                                            ng-src="{{pageContext}}/SiteCollectionImages/ICONS/Shareweb/Minus_White.png" />
                                                                                    </button>
                                                                                    <span> 15min </span>
                                                                                    <button className="btn btn-primary"
                                                                                        title="Increase by 15 Min"
                                                                                        ng-click="changeTimeInMinutes(15,'Increase','TimeSpentInMinutes')">
                                                                                        <img className="button-icon mt--2 hreflink"
                                                                                            ng-src="{{pageContext}}/SiteCollectionImages/ICONS/Shareweb/CreateComponentIcon.png" />
                                                                                    </button>
                                                                                </div>
                                                                                <div className="padR-0 Full-Time">
                                                                                    <label className="full_width"></label>
                                                                                    <button className="btn btn-primary"
                                                                                        title="Decrease by 60 Min"
                                                                                        ng-click="changeTimeInMinutes(60,'Decrease','TimeSpentInMinutes')">
                                                                                        <img className="wid14 mt--2 hreflink"
                                                                                            ng-src="{{pageContext}}/SiteCollectionImages/ICONS/Shareweb/Minus_White.png" />
                                                                                    </button>
                                                                                    <span> 60min </span>
                                                                                    <button className="btn btn-primary"
                                                                                        title="Increase by 60 Min"
                                                                                        ng-click="changeTimeInMinutes(60,'Increase','TimeSpentInMinutes')">
                                                                                        <img className="button-icon mt--2 hreflink"
                                                                                            ng-src="{{pageContext}}/SiteCollectionImages/ICONS/Shareweb/CreateComponentIcon.png" />
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        <div className="col-sm-12 pad0">
                                                                            <label>Short Description</label>
                                                                            <textarea id="CopyAdditionalshortDescription"
                                                                                cols={15} rows={3}
                                                                                ng-model="Description"></textarea>
                                                                        </div>

                                                                    </div>
                                                                    <div className="modal-footer">
                                                                        <button type="button"
                                                                            className="btn btn-primary pull-right"
                                                                            ng-click="saveAdditionalTimeSpent()">
                                                                            Submit
                                                                        </button>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div id="CancelAdditionalTimeEntrypopup" className="modal fade in"
                                                            role="dialog" aria-labelledby="myModalLabel"
                                                            aria-hidden="false" style={{ display: "none" }}>
                                                            <div className="modal-dialog">
                                                                <div className="modal-content">
                                                                    <div className="modal-header">
                                                                        <h3 className="modal-title">
                                                                            Edit Task Time
                                                                            <span className="pull-right">

                                                                            </span>
                                                                        </h3>
                                                                        <button type="button" className="close"
                                                                            data-dismiss="modal"
                                                                            ng-click="CancelAdditionalTimeEntrypopup()"
                                                                        >
                                                                            &times;
                                                                        </button>
                                                                    </div>
                                                                    <div className="modal-body bg-f5f5 clearfix">
                                                                        <div className="col-sm-12 pad0 form-group">
                                                                            <label>Title</label>
                                                                            <select className="form-control searchbox_height"
                                                                                id="searchPageName"
                                                                                ng-model="TaskTimeTitle.Title">

                                                                                <option
                                                                                    ng-repeat="siteType in AllAvailableTitle">
                                                                                    "siteType.Title"
                                                                                </option>

                                                                            </select>
                                                                        </div>
                                                                        <div className="col-sm-12 pad0 form-group">
                                                                            <div className="col-sm-8 padL-0">
                                                                                <div className="date-div">
                                                                                    <div className="Date-Div-BAR">
                                                                                        <span className="href"

                                                                                            id="selectedYear"

                                                                                            ng-click="changeDatetodayQuickly('firstOfMonth','AdditionalTaskTime','MoreEntryPicker','TaskDate','copy')">1st</span>
                                                                                        | <span className="href"

                                                                                            id="selectedYear"

                                                                                            ng-click="changeDatetodayQuickly('fifteenthOfMonth','AdditionalTaskTime','MoreEntryPicker','TaskDate','copy')">15th</span>
                                                                                        | <span

                                                                                            id="updateselectedYear"

                                                                                            ng-click="changeDatetodayQuickly('year','AdditionalTaskTime','MoreEntryPicker','TaskDate','copy')">
                                                                                            1
                                                                                            Jan
                                                                                        </span>
                                                                                        | <span

                                                                                            id="updateselectedToday"

                                                                                            ng-click="changeDatetodayQuickly('today','AdditionalTaskTime','MoreEntryPicker','TaskDate','copy')">Today</span>
                                                                                    </div>
                                                                                    <label className="full_width">
                                                                                        Date

                                                                                    </label>
                                                                                    <input type="text" autoComplete="off"
                                                                                        id="MoreEntryPicker"
                                                                                        className="form-control"
                                                                                        placeholder="DD/MM/YYYY"
                                                                                        ng-model="AdditionalTaskTime.TaskDate" />
                                                                                </div>
                                                                            </div>

                                                                            <div
                                                                                className="col-sm-4 pad0 session-control-buttons">
                                                                                <div>
                                                                                    <button id="DayPlus"
                                                                                        className="top-container plus-button plus-minus"
                                                                                        ng-click="changeDateQuickly(AdditionalTaskTime.TaskDate,'Increase','AdditionalTaskTime','MoreEntryPicker','TaskDate','Day','copy')">
                                                                                        <i className="fa fa-plus"
                                                                                            aria-hidden="true"></i>
                                                                                    </button>
                                                                                    <span className="min-input">Day</span>
                                                                                    <button id="DayMinus"
                                                                                        className="top-container minus-button plus-minus"
                                                                                        ng-click="changeDateQuickly(AdditionalTaskTime.TaskDate,'Decrease','AdditionalTaskTime','MoreEntryPicker','TaskDate','Day','copy')">
                                                                                        <i className="fa fa-minus"
                                                                                            aria-hidden="true"></i>
                                                                                    </button>
                                                                                </div>

                                                                                <div>
                                                                                    <button id="MonthPlus"
                                                                                        className="top-container plus-button plus-minus"
                                                                                        ng-click="changeDateQuickly(AdditionalTaskTime.TaskDate,'Increase','AdditionalTaskTime','MoreEntryPicker','TaskDate','Month','copy')">
                                                                                        <i className="fa fa-plus"
                                                                                            aria-hidden="true"></i>
                                                                                    </button>
                                                                                    <span className="min-input">Month</span>
                                                                                    <button id="MonthMinus"
                                                                                        className="top-container minus-button plus-minus"
                                                                                        ng-click="changeDateQuickly(AdditionalTaskTime.TaskDate,'Decrease','AdditionalTaskTime','MoreEntryPicker','TaskDate','Month','copy')">
                                                                                        <i className="fa fa-minus"
                                                                                            aria-hidden="true"></i>
                                                                                    </button>
                                                                                </div>

                                                                                <div>
                                                                                    <button id="YearPlus"
                                                                                        className="top-container plus-button plus-minus"
                                                                                        ng-click="changeDateQuickly(AdditionalTaskTime.TaskDate,'Increase','AdditionalTaskTime','MoreEntryPicker','TaskDate','Year','copy')">
                                                                                        <i className="fa fa-plus"
                                                                                            aria-hidden="true"></i>
                                                                                    </button>
                                                                                    <span className="min-input">Year</span>
                                                                                    <button id="YearMinus"
                                                                                        className="top-container minus-button plus-minus"
                                                                                        ng-click="changeDateQuickly(AdditionalTaskTime.TaskDate,'Decrease','AdditionalTaskTime','MoreEntryPicker','TaskDate','Year','copy')">
                                                                                        <i className="fa fa-minus"
                                                                                            aria-hidden="true"></i>
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        <div className="col-sm-12 pad0 form-group">
                                                                            <div className="col-sm-6 padL-0">
                                                                                <label className="full_width"
                                                                                    ng-bind-html="GetColumnDetails('TimeSpent') | trustedHTML">
                                                                                    <b className="span-error">*</b>
                                                                                </label>
                                                                                <input type="text" ng-required="true"
                                                                                    className="form-control"
                                                                                    ng-model="AdditionalTimeSpentInHours" ng-change="getInHours(AdditionalTimeSpentInHours)" />
                                                                            </div>
                                                                            <div className="col-sm-6 pad0 Time-control-buttons">
                                                                                <div className="padR-0 Quaterly-Time">
                                                                                    <label className="full_width"></label>
                                                                                    <button className="btn btn-primary"
                                                                                        title="Decrease by 15 Min"
                                                                                        ng-click="changeTimeInMinutes(15,'Decrease','AdditionalTimeSpentInHours')">
                                                                                        <img className="wid14 mt--2 hreflink"
                                                                                            ng-src="{{pageContext}}/SiteCollectionImages/ICONS/Shareweb/Minus_White.png" />
                                                                                    </button>
                                                                                    <span> 15min </span>
                                                                                    <button className="btn btn-primary"
                                                                                        title="Increase by 15 Min"
                                                                                        ng-click="changeTimeInMinutes(15,'Increase','AdditionalTimeSpentInHours')">
                                                                                        <img className="button-icon mt--2 hreflink"
                                                                                            ng-src="{{pageContext}}/SiteCollectionImages/ICONS/Shareweb/CreateComponentIcon.png" />
                                                                                    </button>
                                                                                </div>
                                                                                <div className="padR-0 Full-Time">
                                                                                    <label className="full_width"></label>
                                                                                    <button className="btn btn-primary"
                                                                                        title="Decrease by 60 Min"
                                                                                        ng-click="changeTimeInMinutes(60,'Decrease','AdditionalTimeSpentInHours')">
                                                                                        <img className="wid14 mt--2 hreflink"
                                                                                            ng-src="{{pageContext}}/SiteCollectionImages/ICONS/Shareweb/Minus_White.png" />
                                                                                    </button>
                                                                                    <span> 60min </span>
                                                                                    <button className="btn btn-primary"
                                                                                        title="Increase by 60 Min"
                                                                                        ng-click="changeTimeInMinutes(60,'Increase','AdditionalTimeSpentInHours')">
                                                                                        <img className="button-icon mt--2 hreflink"
                                                                                            ng-src="{{pageContext}}/SiteCollectionImages/ICONS/Shareweb/CreateComponentIcon.png" />
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-sm-12 pad0 form-group">
                                                                            <div className="col-sm-6 padL-0">
                                                                                <label>Time Spent (in hours)</label>
                                                                                <input className="form-control" type="text" ng-model="TimeInHours" readOnly />
                                                                            </div>
                                                                        </div>

                                                                        <div className="col-sm-12 pad0">
                                                                            <label>Short Description</label>
                                                                            <textarea id="MoreEntryshortDescription"
                                                                                cols={15} rows={3}
                                                                                ng-model="AdditionalTaskTime.Description"></textarea>
                                                                        </div>

                                                                    </div>

                                                                    <div className="modal-footer">
                                                                        <div className="col-sm-6 pad0">
                                                                            <div className="text-left">
                                                                                Created

                                                                                by <span
                                                                                    className="siteColor"></span>
                                                                            </div>
                                                                            <div className="text-left">
                                                                                Last modified

                                                                                by <span
                                                                                    className="siteColor"></span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-sm-6 padR0">
                                                                            <a target="_blank"
                                                                                ng-if="AdditionalTaskTime.siteListName != 'SP.Data.TasksTimesheet2ListItem'"
                                                                                ng-href="{{CurrentSiteUrl}}/Lists/TaskTimeSheetListNew/EditForm.aspx?ID={{AdditionalTaskTime.ParentID}}">
                                                                                Open out-of-the-box
                                                                                form
                                                                            </a>
                                                                            <a target="_blank"
                                                                                ng-if="AdditionalTaskTime.siteListName == 'SP.Data.TasksTimesheet2ListItem'"
                                                                                ng-href="{{CurrentSiteUrl}}/Lists/TasksTimesheet2/EditForm.aspx?ID={{AdditionalTaskTime.ParentID}}">
                                                                                Open out-of-the-box
                                                                                form
                                                                            </a>
                                                                            <button type="button" className="btn btn-primary"
                                                                                ng-click="UpdateAdditionaltime()">
                                                                                Save
                                                                            </button>
                                                                        </div>
                                                                    </div>

                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>

                                                </div>
                                            </div>

                                        </div>
                                    </Tab>
                                </Tabs>

                                <div className="modal-footer">
                                    <div className="text-left col-sm-4 pad0">
                                        <div>
                                            Created <span>{Items.Items.Created}</span> by <span
                                                className="siteColor">{Items.Items.Author.Title}</span>
                                        </div>
                                        <div>
                                            Last modified <span>{Items.Items.Modified}</span> by <span
                                                className="siteColor">{Items.Items.Editor.Title}</span>
                                        </div>
                                        <div>
                                            <a ng-if="isOwner==true" className="hreflink">
                                                <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/_layouts/images/delete.gif" /> Delete this item
                                            </a>
                                            <span ng-show="CurrentSubSiteName.toLowerCase()=='sp'"> |</span>
                                            <a ng-show="CurrentSubSiteName.toLowerCase()=='sp'" className="hreflink" ng-click="OpenCopyItem();">
                                                Copy
                                                Task
                                            </a>
                                            <span ng-show="CurrentSubSiteName.toLowerCase()=='sp'"> |</span>
                                            <a ng-show="CurrentSubSiteName.toLowerCase()=='sp'" className="hreflink"
                                                ng-click="OpenCopyItem('Move Task');"> Move Task</a> |
                                            <span>
                                                <img ng-show="Item.Portfolio_x0020_Type!='Service'" className="hreflink" title="Version History"
                                                    ng-click="GetitemsVersionhistory(Item,Item.Id)"
                                                    ng-src="{{baseUrl}}/SiteCollectionImages/ICONS/Shareweb/Version_H.png" />
                                                <img ng-show="Item.Portfolio_x0020_Type=='Service'" className="hreflink" title="Version History"
                                                    ng-click="GetitemsVersionhistory(Item,Item.Id)"
                                                    src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Version_HG.png" />
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-md-8">
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
                                        <a target="_blank" ng-if="Item.siteType=='Offshore Tasks'"
                                            href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/Lists/SharewebQA/EditForm.aspx?ID=${Items.Items.Id}`}>
                                            Open out-of-the-box
                                            form
                                        </a>

                                        <button ng-show="!IsShowFullViewImage" type="button" className="btn btn-primary"
                                            ng-click="IsShowFullViewImage!=true? updateTaskRecords('UpdateTask',Item):CancelShowInFullView()">
                                            Save
                                        </button>
                                        <button ng-show="IsShowFullViewImage" type="button" className="btn btn-default"
                                            ng-click="IsShowFullViewImage!=true? updateTaskRecords('UpdateTask',Item):CancelShowInFullView()">
                                            Close
                                        </button>
                                        {/* <button ng-show="!IsShowFullViewImage" type="button" className="btn btn-default" data-dismiss="modal"
                                                ng-click="IsShowFullViewImage!=true? cancelEditItem():CancelShowInFullView()">
                                                Cancel
                                            </button> */}
                                    </div>

                                </div>
                            </div>





                        </div>
                    </div >
                </div >
            </Modal >


        </>
    )
}
export default React.memo(EditTaskPopup)