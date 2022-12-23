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
import "bootstrap/js/dist/tab.js";
import CommentCard from "../../webparts/taskDashboard/components/Commnet/CommentCard";


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

         DataEdit.map(function (item: any) {
            item.currentsiteType = Items.Items.Site;
            item.siteType = Items.Items.site.Title;
            item.listId = Items.Items.listId;
            item.SiteIcon = Items.Items.SiteIcon;
            item.SiteUrl = Items.Items.SiteUrl;
            item.DisplaySiteName = Items.Items.DisplaySiteName;
            item.Responsible_x0020_TeamID = "";
            //SiteIcon  SiteUrl                   
            item.Select = false;
            if (item.Item_x0020_Type) {
                item.isPortfolio = true;
            } else {
                item.isPortfolio = false;
            }
            if (item.__metadata != undefined && item.__metadata.type != undefined) {
                item.Metadatainfo = item.__metadata.type;
            }
            if (item.SharewebTaskType != undefined && item.SharewebTaskType.Id != undefined) {
                item.SharewebTaskTypeTitle = item.SharewebTaskType.Title;
            } else {
                item.SharewebTaskTypeTitle = "Task"
            }
            try {
                item.Responsible_x0020_TeamTitle = item.Responsible_x0020_Team.results[0].Title.replace('  ', ' ');
                item.Responsible_x0020_TeamID = item.Responsible_x0020_Team.results[0].Id;
            } catch (e) {
                item.Responsible_x0020_TeamTitle = "";
                item.Responsible_x0020_TeamID = "";
            }
            if (item.EstimatedTime === undefined || item.EstimatedTime === '')
                item.EstimatedTime = 0;

            if (item.EstimatedTimeDescription != undefined && item.EstimatedTimeDescription != '') {
                item['DescriptionaAndCategory'] = JSON.parse(item.EstimatedTimeDescription)
                item['shortDescription'] = item.DescriptionaAndCategory[0].shortDescription;
            }

            if (item.Priority_x0020_Rank === undefined || item.Priority_x0020_Rank === '')
                item.Priority_x0020_Rank = 4;

            if (item.SharewebCategories.results != undefined) {
                item.Categories = "";
                $.each(item.SharewebCategories.results, function (index: any, categories: any) {
                    if (categories.Title != "Normal Approval" && categories.Title != "Complex Approval" && categories.Title != "Quick Approval") {
                        item.Categories += categories.Title + ';';
                    }
                    if (categories.Title === "Normal Approval" || categories.Title === "Complex Approval" || categories.Title === "Quick Approval") {
                        item["Is" + categories.Title.replace(" ", "")] = true;
                    }
                });
                if (item.Categories != '')
                    item.Categories = item.Categories.slice(0, -1);
            }
            item.AuthorTitle = item.Author.Title.replace('  ', ' ');
            item.DueDate = Moment(item.Created).format('DD/MM/YYYY HH mm')
            item.Modified = Moment(item.Modified).format('DD/MM/YYYY ')
            item.EditorTitle = item.Editor.Title.replace('  ', ' ');
            item.Team_x0020_MembersTitle = "";
            item.Team_x0020_MembersId = "";
            $.each(item.Team_x0020_Members, function (member: any) {
                item.Team_x0020_MembersTitle = item.Team_x0020_MembersTitle + "" + member.Title + ", ";
                item.Team_x0020_MembersId = item.Team_x0020_MembersId + " " + member.Id;
            })
            item.AuthorId = item.Author.Id;
            item.EditorId = item.Editor.Id;
            item.AssigntoTitle = "";
            item.AssigntoId = "";
            if (item.AssignedTo) {
                $.each(item.AssignedTo.results, function (assign: any) {
                    item.AssigntoTitle = item.AssigntoTitle + " " + assign.Title;
                    item.AssigntoId = item.AssigntoId + " " + assign.Id;
                })
            }
            item.Team_x0020_MembersTitle = item.Team_x0020_MembersTitle.replace('  ', ' ');
            item.Alluserimages = [];
            item.AllCreatedimages = [];
            item.AllModifiedimages = [];
            item.TeamAlluserimages = [];
            if (item.AssignedTo != undefined && item.AssignedTo.length > 0) {
                $.each(item.AssignedTo, function (index: any, newitem: any) {
                    var newuserdata: any = {};
                    $.each(Items.loadTaskUsers, function (index: any, user: any) {
                        if (newitem.Id === user.AssingedToUserId && user.Item_x0020_Cover != undefined) {
                            newuserdata['useimageurl'] = user.Item_x0020_Cover.Url;
                            newuserdata['Suffix'] = user.Suffix;
                            newuserdata['Title'] = user.Title;
                            newuserdata['UserId'] = user.AssingedToUserId;
                            item['Usertitlename'] = user.Title;
                        }
                    })
                    item.Alluserimages.push(newuserdata);
                })
            }
            if (item.Author.Title != undefined && item.Author.Title.length > 0) {
                let newuserdata: any = {};
                $.each(Items.taskUsers, function (index: any, user: any) {
                    if (item.Author.Id === user.AssingedToUserId && user.Item_x0020_Cover != undefined) {
                        newuserdata['useimageurl'] = user.Item_x0020_Cover.Url;
                        newuserdata['Suffix'] = user.Suffix;
                        newuserdata['Title'] = user.Title;
                        newuserdata['UserId'] = user.AssingedToUserId;
                        item['Usertitlename'] = user.Title;
                    }
                })
                item.AllCreatedimages.push(newuserdata);
            }
            if (item.Editor.Title != undefined && item.Editor.Title.length > 0) {
                let newuserdata: any = {};
                $.each(Items.taskUsers, function (index: any, user: any) {
                    if (item.Editor.Id === user.AssingedToUserId && user.Item_x0020_Cover != undefined) {
                        newuserdata['useimageurl'] = user.Item_x0020_Cover.Url;
                        newuserdata['Suffix'] = user.Suffix;
                        newuserdata['Title'] = user.Title;
                        newuserdata['UserId'] = user.AssingedToUserId;
                        item['Usertitlename'] = user.Title;
                    }
                })
                item.AllModifiedimages.push(newuserdata);
            }
            if (item.Team_x0020_Members != undefined) {
                $.each(item.Team_x0020_Members, function (index: any, teamnewitem: any) {
                    var teamnewuserdata: any = {};
                    $.each(Items.taskUsers, function (index: any, teamuser: any) {
                        if (teamnewitem.Id === teamuser.AssingedToUserId && teamuser.Item_x0020_Cover != undefined) {
                            teamnewuserdata['useimageurl'] = teamuser.Item_x0020_Cover.Url;
                            teamnewuserdata['Suffix'] = teamuser.Suffix;
                            teamnewuserdata['Title'] = teamuser.Title;
                            item['TeamUsertitlename'] = teamuser.Title;
                        }

                    })
                    item.TeamAlluserimages.push(teamnewuserdata);
                })
            }
            if (item.Alluserimages != undefined) {
                item.allusername = '';
                $.each(item.Alluserimages, function (index: any, items: any) {
                    if (items.Title != undefined) {
                        item.allusername += items.Title + ' ';
                    }
                })
            }
            if (item.TeamAlluserimages != undefined) {
                item.allteammembername = '';
                $.each(item.TeamAlluserimages, function (items: any) {
                    if (items.Title != undefined) {
                        item.allteammembername += items.Title + ' ';
                    }
                })
            }
            item['Companytype'] = 'Alltask';
            if (item.siteType != undefined && item.siteType === 'Offshore Tasks') {
                item['Companytype'] = 'Offshoretask';
            }
            // if (item.Author != undefined) {
            //     $.each(taskUsers, function (index:any,newuser:any) {

            //         if (item.Author.Title === newuser.AssingedToUser.Title) {
            //             if (newuser.Item_x0020_Cover != undefined)
            //                 item['autherimage'] = newuser.Item_x0020_Cover.Url;
            //         }
            //         if (item.Editor.Title === newuser.AssingedToUser.Title) {
            //             if (newuser.Item_x0020_Cover != undefined)
            //                 item['editoreimage'] = newuser.Item_x0020_Cover.Url;
            //         }
            //     })
            // }
            item.ModifiedDateTime = item.Modified;
            // if (item.Modified != undefined)
            //     item.Modifiednew = SharewebCommonFactoryService.ConvertLocalTOServerDate(item.Modified, 'DD/MM/YYYY HH:mm');
            // if (item.Created != undefined)
            //     item.CreatedNew = SharewebCommonFactoryService.ConvertLocalTOServerDate(item.Created, 'DD/MM/YYYY');
            // if (item.Modified != undefined) {
            //     item.ModifiedNew2 = SharewebCommonFactoryService.ConvertLocalTOServerDate(item.Modified, 'DD/MM/YYYY');
            // }
            // if (item.Created != undefined) {
            //     item.CreatedNew2 = SharewebCommonFactoryService.ConvertLocalTOServerDate(item.Created, 'DD/MM/YYYY');
            // }
            // if (item.DueDate != undefined) {
            //     item.DueDateNew2 = SharewebCommonFactoryService.ConvertLocalTOServerDate(item.DueDate, 'DD/MM/YYYY');
            // }
            if (item.Component != undefined && item.Component.results != undefined && item.Component.results.length > 0) {
                item['Portfoliotype'] = 'Component';
            } else if (item.Services != undefined && item.Services.results && item.Services.results.length > 0) {
                item['Portfoliotype'] = 'Service';
            } else if (item.Events != undefined && item.Events.results != undefined && item.Events.results.length > 0) {
                item['Portfoliotype'] = 'Event';
            }
            item['Portfolio_x0020_Type'] = item['Portfoliotype'];
            if (item.PercentComplete != undefined && item.PercentComplete > 2) {
                item.PercentComplete = parseInt((item.PercentComplete / 100).toFixed(0));
            } else if (item.PercentComplete != undefined)
                item.PercentComplete = parseInt((item.PercentComplete * 100).toFixed(0));
            else
                item.PercentComplete = 0;

            item.ClientCategoryItem = "";
            if (item.ClientCategory != undefined && item.ClientCategory.results != undefined && item.ClientCategory.results.length > 0) {
                $.each(item.ClientCategory.results, function (category: any, index) {
                    if (index === 0)
                        item.ClientCategoryItem = item.ClientCategoryItem != undefined ? item.ClientCategoryItem + category.Title : category.Title;
                    else
                        item.ClientCategoryItem = item.ClientCategoryItem != undefined ? item.ClientCategoryItem + ';' + category.Title : category.Title;
                })
            }

            if (item.CategoryItem != undefined && item.CategoryItem.indexOf('Draft') > -1) {
                item['Companytype'] = 'Drafttask';
            }
            if (item.component_x0020_link != undefined && item.component_x0020_link.Url != undefined) {
                item.componentlink = item.component_x0020_link.Url;
            }
            else {
                item.componentlink = undefined;
            }

           
        });

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


                    <div className="modal-dialog modal-lg">
                        <div className="modal-content" ng-cloak>
                            <div className="modal-heade">
                                <h3 className="modal-title">
                                    Update Task Status
                                </h3>
                                <button type="button" style={{ minWidth: "10px" }} className="close" data-dismiss="modal"
                                    onClick={closeTaskStatusUpdatePoup}>
                                    &times;
                                </button>
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
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={Items.Call}>
                                    &times;
                                </button>
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

                                                <div className="col-12" title="Task Name">

                                                    <label className="d-flex justify-content-between align-items-center">Title
                                                        <span className="form-check">
                                                            <input className="form-check-input" type="checkbox" id="isChecked" defaultChecked={items.IsTodaysTask}/>

                                                            <label className="form-check-label">workingToday</label>
                                                        </span>
                                                    </label>


                                                    <input type="text" className="form-control" placeholder="Task Name"
                                                        ng-required="true" defaultValue={items.Title}/>

                                                </div>

                                                <div className="col-12">
                                                    <div className="col-sm-3">

                                                        <label className="form-label" >Start Date</label>
                                                        <input type="text" autoComplete="off" id="startDatepicker"
                                                            placeholder="DD/MM/YYYY" className="form-control" />

                                                    </div>
                                                    <div className="col-sm-3">

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
                                                    <div className="col-sm-3">

                                                        <label className="form-label"
                                                        >CompletedDate</label>
                                                        <input type="text" autoComplete="off"
                                                            id="CompletedDatePicker" placeholder="DD/MM/YYYY"
                                                            className="form-control" />

                                                    </div>
                                                    <div className="col-sm-3">
                                                        <select className='searchbox_height' >
                                                            <option value="Select" defaultValue={items.Priority_x0020_Rank}>Select Item Rank</option>
                                                            {currentUsers.map(function (item: any) {
                                                                return (
                                                                    <option value={item.Title}>{item.ItemRank}</option>
                                                                )
                                                            })}
                                                        </select>
                                                    </div>

                                                </div>

                                                <div className="col-12">
                                                    <div className="col-md-6">
                                                        <div className="row">
                                                            <div className="hhProcesscat">
                                                                <div ng-show="Item.SharewebTaskType.Title!='Project' && Item.SharewebTaskType.Title!='Step' && Item.SharewebTaskType.Title!='MileStone'">

                                                                    <div className="form-check form-check-inline">
                                                                        <input type="radio" id="Components"
                                                                            name="Portfolios" value="Component"
                                                                            title="Component"
                                                                            ng-model="PortfolioTypes"
                                                                            ng-click="getPortfoliosData()"
                                                                            className="form-check-input" />
                                                                        <label className="form-check-label">Component</label>
                                                                    </div>
                                                                    <div className="form-check form-check-inline">
                                                                        <input type="radio" id="Services"
                                                                            name="Portfolios" value="Services"
                                                                            title="Services"
                                                                            ng-model="PortfolioTypes"
                                                                            ng-click="getPortfoliosData()"
                                                                            className="form-check-input" />
                                                                        <label className="form-check-label">Services</label>
                                                                    </div>


                                                                </div>
                                                                <div className="input-group">
                                                                    <label className="form-label">&nbsp;</label>
                                                                    <input type="text" ng-model="SearchService"
                                                                        ng-hide="ServicesmartComponent.length>0 || smartComponent.length>0"
                                                                        className="form-control"
                                                                        id="{{PortfoliosID}}" autoComplete="off" />
                                                                    <span className="input-group-text"
                                                                        ng-hide="(ServicesmartComponent.length>0 || smartComponent.length>0)">
                                                                        <Picker />
                                                                    </span>
                                                                </div>



                                                            </div>

                                                        </div>
                                                        <div className="full_width mb-12">
                                                            <div className="col-12">

                                                                <div className="input-group">
                                                                    <label className="form-label" ng-hide="item==='TimesheetCategories'"
                                                                        ng-repeat="item in filterGroups">
                                                                        Categories
                                                                    </label>
                                                                    <input type="text" className="form-control"
                                                                        id="txtCategories" />
                                                                    <span className="input-group-text"
                                                                        ng-show="(ServicesmartComponent.length>0 || smartComponent.length>0)">

                                                                        <Picker />

                                                                    </span>
                                                                </div>

                                                            </div>

                                                            <div className="col-sm-12 mt-2 pad0">
                                                                <div className="col-12" ng-if="item.SmartSuggestions" ng-repeat="item in AllCategories">
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

                                                                <div
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
                                                                </div>



                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="col-12">
                                                            <label ng-bind-html="GetColumnDetails('priority') | trustedHTML"></label>
                                                            <input type="text" className="form-control"
                                                                placeholder="Priority" defaultValue={items.Priority}
                                                               />
                                                            <ul className="ps-4">
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
                                                        <div className="col-12">
                                                            <label className="form-label">Client Activity</label>
                                                            <input type="text" className="form-control" ng-required="true"
                                                                ng-model="Item.ClientActivity" />
                                                        </div>
                                                        <div className="col-12">
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
                                                                    <Picker />
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
                                                                    <Picker />
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


                                                <div className="full_width mb-10 pull-left">
                                                    <div className="input-group">
                                                        <label className="form-label">status</label>
                                                        <input type="text" className="form-control" placeholder="% Complete" />
                                                        <span className="input-group-text">
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
                                                                        ng-checked="Item.Mileage==='15'" type="radio"
                                                                        ng-click="SelectTime('15')" />Very
                                                                    Quick

                                                                </li>
                                                                <li className="radio l-radio">

                                                                    <input name="radioTime" className="mt-4"
                                                                        ng-checked="Item.Mileage==='60'" type="radio"
                                                                        ng-click="SelectTime('60')" />Quick

                                                                </li>
                                                                <li className="radio l-radio">

                                                                    <input name="radioTime" className="mt-4"
                                                                        ng-checked="Item.Mileage==='240'" type="radio"
                                                                        ng-click="SelectTime('240')" />Medium

                                                                </li>
                                                                <li className="radio l-radio">

                                                                    <input name="radioTime" className="mt-4"
                                                                        ng-checked="Item.Mileage==='480'" type="radio"
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

                                            <div className="col-12 mb-10">
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
                                                                        style={isDragging ? { color: "red" } : { color: "darkblue" }}
                                                                        onClick={onImageUpload}
                                                                        {...dragProps}
                                                                    >
                                                                        Upload Image
                                                                    </a>
                                                                    &nbsp;
                                                                    <a style={{ color: "darkblue", margin: "3px" }} onClick={onImageRemoveAll}>Remove all images</a>
                                                                    <span className="ImageBox">
                                                                        {imageList.map((image: any, index: any) => (
                                                                            <div key={index} className="image-item">
                                                                                <img src={image.dataURL} alt="" width="100%" className="ImageBox" />
                                                                                <div className="image-item__btn-wrapper">
                                                                                    <a onClick={() => onImageUpdate(index)}><img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif" /></a>
                                                                                    <a style={{ margin: "3px" }} onClick={() => onImageRemove(index)}><img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/_layouts/images/delete.gif" /></a>

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
                                            <a ng-if="isOwner===true" className="hreflink">
                                                <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/_layouts/images/delete.gif" /> Delete this item
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
                                        <a target="_blank" ng-if="Item.siteType==='Offshore Tasks'"
                                            href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/Lists/SharewebQA/EditForm.aspx?ID=${Items.Items.Id}`}>
                                            Open out-of-the-box
                                            form
                                        </a>

                                        <div>
                                            <button ng-show="!IsShowFullViewImage" type="button" className="btn btn-primary"
                                                ng-click="IsShowFullViewImage!=true? updateTaskRecords('UpdateTask',Item):CancelShowInFullView()">
                                                Save
                                            </button>
                                            <button ng-show="IsShowFullViewImage" type="button" className="btn btn-default"
                                                ng-click="IsShowFullViewImage!=true? updateTaskRecords('UpdateTask',Item):CancelShowInFullView()">
                                                Close
                                            </button>
                                        </div>
                                        {/* <button ng-show="!IsShowFullViewImage" type="button" className="btn btn-default" data-dismiss="modal"
                                                ng-click="IsShowFullViewImage!=true? cancelEditItem():CancelShowInFullView()">
                                                Cancel
                                            </button> */}
                                    </div>

                                </div>
                                </>
                                )
                               })}
                            </div>





                        </div>
                    </div >


                </div>
            </Modal>

        </>
    )
}
export default React.memo(EditTaskPopup)