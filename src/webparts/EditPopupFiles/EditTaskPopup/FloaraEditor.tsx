import * as React from "react";
import FloraEditor from "./TextEditor";


var IsShowFullViewImage =false;

const FloaraEditor = () => {
    const [Description, setDescription] = React.useState([]);
    const [ ImageSection, setImageSection ] = React.useState([]);
    const [OpenBox,setOpenBox] = React.useState(0)
    function Descriptions() {
       
        var institute: any = []
        var DescriptionFields: any = []
        var DescriptionItem: any = []
        var DataDescription: any = []
        var FeedbackColumncount: any = []
        var selectedAdminImageUrl:any=[]
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
                        $.each(selectedAdminImageUrl, function (val:any) {
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
    Descriptions();
    var count = 0
    const addNewBox=(index:any)=>{
        count++
        setOpenBox(count)
       
    }

    const [ state, setState ] = React.useState([]);


  function addRow(e: any) {
    const object = { name: '', age: '', role: '' };
    setState([...state, object]);
  }

      
      
    return (
        <>
            <div className="col-sm-12 pad0">
               
                <div
                    className={IsShowFullViewImage != true ? 'col-sm-3 padL-0 DashboardTaskPopup-Editor above' : 'col-sm-6  padL-0 DashboardTaskPopup-Editor above'}>
                    

                  
                  

                </div>

                <div
                    className={IsShowFullViewImage != true ? 'col-sm-9 toggle-task' : 'col-sm-6 editsectionscroll toggle-task'}>
                               
                               
                    {Description != undefined && Description.map(function (item: any, index: any) {
                        return (


                            <div className="mt-5"
                                >
                              
                                {OpenBox > 0 &&
                               
                                <div className="col-sm-11 mt1 Doc-align" 
                                    >
                                    {index != 0 &&
                                    <>
                                    
                                        <textarea

                                            id="txtdescription" style={{ width: "111%" }}
                                            className="form-control"
                                            ng-model="item.Title"></textarea>
                                            <button type="button" className="btn btn-primary" onClick={()=>addNewBox(index+1)}>Add New Box</button>
                                            </>
                                    }
                                </div>
                               
                                  }

                                {/* <div className="col-sm-12 mt1 padLR0">
                                    <div className="col-sm-6 comnt"></div>
                                    {(item.Comments != undefined && index > 0) &&
                                        <div className="col-sm-6 padLR0" style={{ display: "none" }}
                                        >
                                            <a className="all_cmt_pos  morelink" title="Click to Reply"
                                                style={{ cursor: "pointer" }}
                                                ng-click="ShowAllComments(item)"
                                                ng-bind-html="GetColumnDetails('allComments') | trustedHTML">allComments</a>
                                            <a className="all_pipe_pos morelink">|</a>
                                        </div>
                                    }

                                </div>
                                {item.isShowComment &&

                                    <div className="feedbackcomment col-sm-offset-1 col-sm-11 no-padding"
                                    >
                                        {item.Comments.map(function (index: any, comment: any) {
                                            return (


                                                <div>
                                                    <span className="pull-right">
                                                        <a className="" style={{ cursor: "pointer" }}
                                                            ng-click="clearComment(item.Comments,comment)">
                                                            Delete Comment

                                                        </a>
                                                    </span>
                                                    <div className=" col-sm-12 mb-2 add_cmnt panel-body">
                                                        <div id="" className="pad_top_btm3">
                                                            {comment.AuthorImage != undefined &&
                                                                <div
                                                                    className="col-sm-1">
                                                                    <img className="AssignUserPhoto2"
                                                                        title="{{comment.AuthorName}}"
                                                                        data-toggle="popover" data-trigger="hover"
                                                                        ng-src="{{comment.AuthorImage}}" />
                                                                </div>
                                                            }
                                                            {comment.AuthorImage == undefined &&

                                                                <div
                                                                    className="col-sm-1 padL-0 wid35">
                                                                    <img ng-show="comment.AuthorImage==undefined"
                                                                        className="AssignUserPhoto1 bdrbox"
                                                                        ng-src="{{baseUrl}}/SiteCollectionImages/ICONS/32/icon_user.jpg" />
                                                                </div>
                                                            }

                                                            <div className="toggle-task">
                                                                <div className="comment_header">

                                                                    {comment.Created}

                                                                    <a className="hreflink"
                                                                        ng-click="editsavecomment(item,$index);">
                                                                        <img
                                                                            ng-src="{{baseUrl}}//SiteCollectionImages/ICONS/32/edititem.gif" />
                                                                    </a>
                                                                </div>

                                                            </div>
                                                            <div className="right_comment break_url ng-binding"
                                                                ng-bind-html="comment.Title | trustedHTML">
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                        }

                                        <div className="col-sm-11 ">
                                            <textarea id="searchcomment" style={{ width: "100%" }}
                                                ng-required="true"
                                                className="form-control"></textarea>
                                        </div>

                                        <div className="col-sm-1 no-padding ">
                                            <button type="button"
                                                className="post btn btn-primary pull-right"
                                                ng-disabled="FeedbackForm.$error.required"
                                                ng-click="PostFeedback(item)"
                                                ng-bind-html="GetColumnDetails('post') | trustedHTML"></button>
                                        </div>
                                    </div>
                                }
                                {item.Subtext != undefined && item.Subtext.map(function (index: any, child: any) {
                                    return (

                                        <div className="mt-5"
                                            ng-init="innerIndex=$index">
                                            <div className="col-sm-12 PadR0">
                                                {Items.Categories.indexOf('Approval') > -1 &&
                                                    <span
                                                        className="MR5" ng-disabled="Item.PercentComplete >= 80">
                                                        <span title="Rejected" id={`SmartLightReject${child.Id}`}
                                                            ng-click="UpdateTrafficLight(child,child.Title,'SmartLight','Reject')"
                                                            className={`circlelight br_red pull-left ml5 ${child.isShowLight == 'Reject' ? 'red' : ''}`}
                                                        ></span>
                                                        <span title="Maybe" id="SmartLightMaybe{{child.Id}}"
                                                            ng-click="UpdateTrafficLight(child,child.Title,'SmartLight','Maybe')"
                                                            className="circlelight br_yellow pull-left {{child.isShowLight == 'Maybe'?'yellow':''}}"
                                                        ></span>
                                                        <span title="Approved"
                                                            id="SmartLightApprove{{child.Id}}"
                                                            ng-click="UpdateTrafficLight(child,child.Title,'SmartLight','Approve')"
                                                            className="circlelight br_green pull-left {{child.isShowLight == 'Approve'?'green':''}}"
                                                        ></span>
                                                    </span>
                                                }
                                                <span className="pull-right">
                                                    <span ng-if="$index>0" className="md2">
                                                        <input type="checkbox" id=""
                                                            style={{ marginTop: "-1px" }} name="chkCompleted"
                                                            ng-model="child.SeeAbove"
                                                            ng-click="AddPointToSeeImage(child,child.SeeAbove,outerIndex+1,$index)" />
                                                    </span>
                                                    {index > 0 && <span>
                                                        See Above
                                                    </span>}
                                                    <span ng-if="$index>0">|</span>
                                                    <span className="md2">
                                                        <input type="checkbox" id=""
                                                            style={{ marginTop: "-1px" }} name="chkCompleted"
                                                            ng-model="child.Phone"
                                                            ng-click="checkCompleted(Completed,'Phone',child.Phone)" />
                                                    </span>
                                                    <span>
                                                        Phone
                                                    </span>
                                                    <span>|</span>
                                                    <span className="md2">
                                                        <input type="checkbox" id=""
                                                            style={{ marginTop: "-1px" }} name="chkCompleted"
                                                            ng-model="child.LowImportance"
                                                            ng-click="checkCompleted(Completed)" />
                                                    </span>
                                                    <span>
                                                        Low Importance
                                                    </span>
                                                    <span>|</span>
                                                    <span className="md2">
                                                        <input type="checkbox" id=""
                                                            style={{ marginTop: "-1px" }} name="chkCompleted"
                                                            ng-model="child.HighImportance"
                                                            ng-click="checkCompleted(Completed)" />
                                                    </span>
                                                    <span>
                                                        High Importance
                                                    </span>
                                                    <span>|</span>

                                                    <span className="md2">
                                                        <input type="checkbox" id=""
                                                            style={{ marginTop: "-1px" }} name="chkCompleted"
                                                            ng-model="child.Completed"
                                                            ng-click="checkCompleted(Completed)" />
                                                    </span>
                                                    <span
                                                        ng-bind-html="GetColumnDetails('markAsCompleted') | trustedHTML">markAsCompleted
                                                    </span>
                                                    <span>|</span>
                                                    <span className="">
                                                        <a className=" md2" style={{ cursor: "pointer" }}
                                                            ng-click="showCommentBox(child)"
                                                            ng-bind-html="GetColumnDetails('addComment') | trustedHTML">addComment</a>

                                                    </span>
                                                    <span ng-if="$index>=0">|</span>
                                                    {item.Subtext[index].Title != undefined &&
                                                        <span className=""
                                                            ng-if="item.Subtext[$index].Title!=undefined">

                                                            <a className=" md2"
                                                                ng-if="Item.siteType!='Offshore Tasks'"
                                                                style={{ cursor: "pointer" }} target="_blank"
                                                                ng-href="{{pageContext}}/SitePages/CreateTask.aspx"
                                                                ng-click="opencreatetask($index)"
                                                                ng-bind-html="GetColumnDetails('CreateTask') | trustedHTML"></a>
                                                        </span>
                                                    }
                                                    {Items.siteType == 'Offshore Tasks' &&
                                                        <span>
                                                            <a className="m-2"
                                                                ng-if=""
                                                                style={{ cursor: "pointer" }} target="_blank"
                                                                ng-href="{{pageContext}}/SitePages/CreateOffshoreTask.aspx"
                                                                ng-click="opencreatetask($index)"
                                                                ng-bind-html="GetColumnDetails('CreateTask') | trustedHTML">CreateTask</a>
                                                        </span>
                                                    }
                                                    <span className="">

                                                        <a style={{ cursor: "pointer" }} title="Delete"
                                                            data-toggle="modal"
                                                            ng-click="RemoveFeedbackColumn(item.Subtext,$index)">
                                                            <img className=""
                                                                ng-src="/_layouts/images/delete.gif" />
                                                        </a>
                                                    </span>
                                                </span>
                                            </div>
                                            <div className="mt-1 no-padding" style={{ width: "3%", float: "left" }}>
                                                {`${index + 1}.${index + 1}`}
                                            </div>

                                            <div className="col-sm-11 mt1 Doc-align"
                                                style={{ paddingRight: "0px", width: "97%", paddingLeft: "8px" }}>

                                                <textarea

                                                    id="txtSubdescription" style={{ width: "111%" }}
                                                    className="form-control"
                                                    ng-model="child.Title"></textarea>

                                            </div>
                                            <div className="col-sm-12 mt1 padLR0">
                                                <div className="col-sm-6 comnt"></div>
                                                {child.Comments.length > 2 && index > 0 &&
                                                    <div className="col-sm-6 padLR0" style={{ display: "none" }}
                                                    >
                                                        <a className="all_cmt_pos  morelink" title="Click to Reply"
                                                            style={{ cursor: "pointer" }}
                                                            ng-click="ShowAllComments(child)"
                                                            ng-bind-html="GetColumnDetails('allComments') | trustedHTML">allComments</a>
                                                        <a className="all_pipe_pos morelink">|</a>
                                                    </div>
                                                }

                                            </div>
                                            <div className="feedbackcomment col-sm-offset-1 col-sm-11 no-padding"
                                                ng-if="child.isShowComment">
                                                {child.Comments.map(function (comment: any) {
                                                    return (


                                                        <div>

                                                            <span className="pull-right">
                                                                <a style={{ cursor: "pointer" }}
                                                                    ng-click="clearComment(child.Comments,comment)">
                                                                    Delete Comment

                                                                    <img className=""
                                                                        ng-src="/_layouts/images/delete.gif"
                                                                        src="/_layouts/images/delete.gif" />
                                                                </a>
                                                            </span>
                                                            <div className=" col-sm-12 mb-2 add_cmnt panel-body">
                                                                <div id="" className="pad_top_btm3">
                                                                    {comment.AuthorImage != undefined &&
                                                                        <div
                                                                            className="col-sm-1">
                                                                            <img className="AssignUserPhoto2"
                                                                                title={comment.AuthorName}
                                                                                data-toggle="popover"
                                                                                data-trigger="hover"
                                                                                src={comment.AuthorImage} />
                                                                        </div>
                                                                    }
                                                                    <div ng-show="comment.AuthorImage==undefined"
                                                                        className="col-sm-1 padL-0 wid35">
                                                                        <img ng-show="comment.AuthorImage==undefined"
                                                                            className="AssignUserPhoto1 bdrbox"
                                                                            ng-src="{{baseUrl}}/SiteCollectionImages/ICONS/32/icon_user.jpg" />
                                                                    </div>

                                                                    <div className="toggle-task">
                                                                        <div className="comment_header">

                                                                            <a className="hreflink"
                                                                                ng-click="editsavecomment(child,$index);">
                                                                                <img
                                                                                    ng-src="{{baseUrl}}//SiteCollectionImages/ICONS/32/edititem.gif" />
                                                                            </a>

                                                                        </div>

                                                                    </div>
                                                                    <div className="right_comment"
                                                                        ng-bind-html="comment.Title | trustedHTML">
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                                }
                                            </div>

                                            <div className="col-sm-11 ">
                                                <textarea id="searchcomment" style={{ width: "100%" }}
                                                    ng-required="true"
                                                    className="form-control"
                                                ></textarea>
                                            </div>

                                            <div className="col-sm-1 no-padding ">
                                                <button type="button"
                                                    className="post btn btn-primary pull-right"
                                                    ng-disabled="FeedbackForm.$error.required"
                                                    ng-click="PostFeedback(child)"
                                                    ng-bind-html="GetColumnDetails('post') | trustedHTML">post</button>

                                            </div>

                                        </div>
                                    )
                                })}
                                <span className="pull-right addsubbox" style={{ cursor: "pointer" }}>
                                    <button onClick={() => addsubColumn(item, index + 1)}>
                                        Sub-Text Box
                                    </button>
                                </span>
                                <div className="col-sm-6 comnt ">
                                    <span ng-show="$index+1==DescriptionFields.length"
                                        className="ml-10">
                                        <a className="btn btn-primary btn-sm" ng-click="addColumn(item)"
                                            ng-bind-html="GetColumnDetails('addNewTextBox') | trustedHTML"></a>
                                    </span>

                                </div> */}


                                <div className="clearfix"></div>
                            </div>
                        )
                    })}


                </div>
                <div className="form-group">
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
                </div>
            </div>

        </>
    )
}
export default FloaraEditor;