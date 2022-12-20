import * as React from 'react';
import * as $ from 'jquery';
import "bootstrap/dist/css/bootstrap.min.css";
import axios, { AxiosResponse } from 'axios';
import { BiTime, BiCalendar } from 'react-icons/bi';
import '../../cssFolder/foundation.scss'
import '../../cssFolder/foundationmin.scss'


const ComponentMail=()=>{
    return(
        <>
         <div className="panel panel-default {{AutoID=='taskprofile'?'':'mt-25'}}">
            <div className="panel-heading">
            <h3 className="panel-title">Comments
                {/* <span className="panel-title-right">
                    <page-settings-info webpartid="'CommentBox'"></page-settings-info>
                </span> */}
            </h3>
        </div>

        <div className="panel-body" ng-cloak>
            <div className="TopRecipients">
                <span className="mt-2 mr-5"> <strong>To:</strong>  </span>

                <span className="Recipients" ng-repeat="item in UserForQuickComment">
                    <a className="hreflink" target="_blank">
                        <img ng-show="item.Item_x0020_Cover!=undefined || item.Item_x0020_Cover!= null"
                            className="ProirityAssignedUserPhoto"
                             data-toggle="popover" data-trigger="hover" ng-click="topCommentrs(item)"
                             src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/PublishingImages/Portraits/portrait_Deepak.jpg"/>

                        <span ng-show="item.Item_x0020_Cover==undefined || item.Item_x0020_Cover== null">
                            <img className="ProirityAssignedUserPhoto" title="{{item.AuthorName}}" ng-click="topCommentrs(item)"
                                 src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/PublishingImages/Portraits/portrait_Stefan.jpg"/>
                        </span>
                        <span ng-show="item.Item_x0020_Cover==undefined || item.Item_x0020_Cover== null">
                            <img className="ProirityAssignedUserPhoto" title="{{item.AuthorName}}" ng-click="topCommentrs(item)"
                                 src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/PublishingImages/Portraits/portrait_Mattis_Hahn.jpg"/>
                        </span>
                        <span ng-show="item.Item_x0020_Cover==undefined || item.Item_x0020_Cover== null">
                            <img className="ProirityAssignedUserPhoto" title="{{item.AuthorName}}" ng-click="topCommentrs(item)"
                                 src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/PublishingImages/NewUsersImages/Robert%20Ungethuem.png"/>
                        </span>
                    </a>
                </span>

                <span className="RecipientsNameField mt-0  mb-5">
                    <textarea autoComplete="off" ng-model="ReplyBody" placeholder="Recipients Name" 
                              ng-change="ClearValues()" className="form-control" id="{{AutoID}}"></textarea>
                </span>
            </div>
          
           
          
            <div className="RecipientsCommentsField {{(ReplyTextBody==undefined || ReplyTextBody=='') && checkComment?'commentError':''}}">
               
                <textarea className="form-control ui-autocomplete-input"
                          placeholder="Enter your comments here" ng-model="ReplyTextBody" autoComplete="off"></textarea>

                
                <button ng-click="createComment()" title="Post comment" type="button"
                        className="btn btn-primary pull-right mt-5 mb-5">
                    Post
                </button>

            </div>
           


            {/* <div className="commentMedia">
                <div className="card"
                     ng-show="AutoID=='createwebpartarchitecture' ||AutoID=='webpartprofile' || AutoID=='portfolioprofile' || AutoID=='taskprofile'">
                    <ul className="list-unstyled">
                     
                        <li className="media"
                            ng-repeat="item in AllCommentDetails.OtherComments|limitTo: -3 |orderBy:'NewestCreatedDate':true">
                            <span className="round pt-2">

                                <img className="align-self-start mr-3"
                                     ng-show="item.AuthorImage!=undefined && item.AuthorImage!=''"
                                     ng-click="topCommentrs(item,'CreatedComment')" title="{{item.AuthorName}}"
                                     data-toggle="popover" data-trigger="hover" ng-src="{{item.AuthorImage}}"/>

                            </span>
                            <div className="media-bodyy">
                                <div className="col-sm-12 pad0 d-flex">
                                    <span className="comment-date pt-2">12/22/2022</span>
                                    <div className="ml-auto media-icons pt-2">
                                        <a className="mr-5" ng-click="editcomment(item);">
                                            <img ng-src="{{newURL}}/SiteCollectionImages/ICONS/32/edititem.gif"/>
                                        </a>
                                        <a title="Delete" ng-click="saveComment(item,'delete')">
                                            <img ng-src="{{newURL}}/SiteCollectionImages/ICONS/32/delete.gif"/>
                                        </a>
                                    </div>
                                </div>
                                <div className="col-sm-12 pad0 d-flex">
                                    <h6 className="userid pt-2"><a>Comment box</a></h6>
                                  
                                </div>
                                <p className="media-text" ng-show="item.editable==undefined || item.editable==false"
                                   ng-bind-html="item.Description | trustedHTML">
                                </p>
                            </div>

                        </li>

                    </ul>
                    <div ng-show="AllCommentDetails.Comments.length>3" className="MoreComments">
                        <a className="MoreComments" title="Click to Reply" ng-show="AllCommentDetails.Comments.length>3"
                           ng-click="EditDiscussion(AllCommentDetails)">
                            All
                            Comments(2)
                        </a>
                    </div>
                </div>
            </div> */}

            {/* <div className="commentMedia">
                <div className="card" ng-show="AutoID=='portfoliopopup' || AutoID=='taskpopup'">
                    <ul className="list-unstyled">
                       
                        <li className="media"
                            ng-repeat="item in AllCommentDetails.Comments|limitTo: -1 |orderBy:'ID':true ">
                            <span className="round pt-2">

                                <img className="align-self-start mr-3"
                                     ng-show="item.AuthorImage!=undefined && item.AuthorImage!=''"
                                     ng-click="topCommentrs(item,'CreatedComment')" title="{{item.AuthorName}}"
                                     data-toggle="popover" data-trigger="hover" ng-src="{{item.AuthorImage}}"/>

                            </span>
                            <div className="media-bodyy">
                                <div className="col-sm-12 pad0 d-flex">
                                    <span className="comment-date pt-2">stefan</span>
                                    <div className="ml-auto media-icons pt-2">
                                        <a className="mr-5" ng-click="editcomment(item);">
                                            <img ng-src="{{newURL}}/SiteCollectionImages/ICONS/32/edititem.gif"/>
                                        </a>
                                        <a title="Delete" ng-click="saveComment(item,'delete')">
                                            <img ng-src="{{newURL}}/SiteCollectionImages/ICONS/32/delete.gif"/>
                                        </a>
                                    </div>
                                </div>
                                <div className="col-sm-12 pad0 d-flex">
                                    <h6 className="userid pt-2"><a></a></h6>
                                </div>
                                <p className="media-text" ng-show="item.editable==undefined || item.editable==false"
                                   ng-bind-html="item.Description | trustedHTML">
                                </p>
                            </div>
                        </li>
                    </ul>
                </div>
                <div ng-show="AllCommentDetails.Comments.length>1 &&(AutoID=='portfoliopopup' || AutoID=='taskpopup')" className="MoreComments">
                    <a className="MoreComments" title="Click to Reply"
                       ng-click="EditDiscussion(AllCommentDetails)">
                        All
                        Commentss
                    </a>
                </div>
            </div> */}

        </div>
    </div>
    
   
      </>
    )
}
export default ComponentMail;