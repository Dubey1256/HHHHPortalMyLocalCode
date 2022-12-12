import * as React from 'react';
import * as $ from 'jquery';
import "bootstrap/dist/css/bootstrap.min.css";
import axios, { AxiosResponse } from 'axios';
import { BiTime, BiCalendar } from 'react-icons/Bi';
import '../../cssFolder/foundation.scss';
import '../../cssFolder/foundationmin.scss';

const BaseUrl ="SP"

const TeamComposition=(props:any)=>{
    const [Task,setTask] = React.useState([])
      React.useEffect(() => {
        function InstitutionData() {
            var institute: any = []
            var AllUsers:any =[]
            var taskUsers:any =[]
            var url = "https://hhhhteams.sharepoint.com/sites/HHHH/sp/_api/web/lists/getbyid('b318ba84-e21d-4876-8851-88b94b9dc300')/items?$select=Id,IsActive,UserGroupId,Suffix,Title,Email,SortOrder,Role,Company,ParentID1,TaskStatusNotification,Status,Item_x0020_Cover,AssingedToUserId,isDeleted,AssingedToUser/Title,AssingedToUser/Id,AssingedToUser/EMail,ItemType&$expand=AssingedToUser&$filter=IsActive eq 1&$orderby=SortOrder asc,Title asc"


            $.ajax({

                url: url,

                method: "GET",

                headers: {

                    "Accept": "application/json; odata=verbose"

                },

                success: function (data) {

                    institute = data.d.results;
                    $.each(institute, function (item:any,items:any) {
                        if (items.ItemType != 'Group') {
                        AllUsers.push(items);
                        }
                    })
                    $.each(data.d.results, function (index:any,item:any) {
                        if (item.UserGroupId == undefined) {
                            if (BaseUrl.toLowerCase() == 'sp' || window.location.href.toLowerCase().indexOf('gmbh/sitepages/teamcalendar') > -1)
                                getChilds(item, data.d.results);
                            else
                                getChildsWithoutRoleBased(item, data.d.results);
                               taskUsers.push(item);
                        }
                    })

                    setTask(taskUsers)
                },

                error: function (error) {


                }
            });
        }
        InstitutionData();
    },
        []);
        const getChildsWithoutRoleBased =(item:any, items:any)=> {
            item.childs = [];
            $.each(items, function (index:any,childItem:any) {
                if (props.props.Items != undefined) {
                    if (props.props.Items.Item_x0020_Type == undefined) {
                        if (props.props.Items.Services == undefined || props.props.Items.Services.results == '') {
                            if (childItem.UserGroupId != undefined && parseInt(childItem.UserGroupId) == item.ID) {
                                //if (childItem.Role != undefined && childItem.Role.results != undefined && childItem.Role.results.length > 0) {
                                //    angular.forEach(childItem.Role.results, function (task) {
                                //        if (task == 'Deliverable Teams') {
                                if (!isItemExists(item.childs, childItem.Id)) {
                                    item.childs.push(childItem);
                                }
                                getChilds(childItem, items);
                                //        }
                                //    })
                                //}
                            }
                        }
                        else if (props.props.Items.Services != undefined && props.props.Items.Services.results != '') {
                            if (childItem.UserGroupId != undefined && parseInt(childItem.UserGroupId) == item.ID) {
                                //if (childItem.Role != undefined && childItem.Role.results != undefined && childItem.Role.results.length > 0) {
                                //    angular.forEach(childItem.Role.results, function (task) {
                                //        if (task == 'Service Teams') {
                                if (!isItemExists(item.childs, childItem.Id)) {
                                    item.childs.push(childItem);
                                }
                                getChilds(childItem, items);

                                //        }
                                //    })
                                //}
                            }
                        }
                    }
                    if (props.props.Items.Item_x0020_Type != undefined) {
                        if (props.props.Items != undefined) {
                            if (props.props.Items.Portfolio_x0020_Type == 'Component') {
                                if (childItem.UserGroupId != undefined && parseInt(childItem.UserGroupId) == item.ID) {
                                    //if (childItem.Role != undefined && childItem.Role.results != undefined && childItem.Role.results.length > 0) {
                                    //    angular.forEach(childItem.Role.results, function (task) {
                                    //        if (task == 'Deliverable Teams') {
                                    if (!isItemExists(item.childs, childItem.Id)) {
                                        item.childs.push(childItem);
                                    }
                                    getChilds(childItem, items);
                                    //        }
                                    //    })
                                    //}
                                }
                            }
                            else if (props.props.Items.Portfolio_x0020_Type == 'Service') {
                                if (childItem.UserGroupId != undefined && parseInt(childItem.UserGroupId) == item.ID) {
                                    //if (childItem.Role != undefined && childItem.Role.results != undefined && childItem.Role.results.length > 0) {
                                    //    angular.forEach(childItem.Role.results, function (task) {
                                    //        if (task == 'Service Teams') {
                                    if (!isItemExists(item.childs, childItem.Id)) {
                                        item.childs.push(childItem);
                                    }
                                    //            $scope.getChilds(childItem, items);
                                    //        }
                                    //    })
                                    //}
                                }
                            }
                        }
                    }
                }
                // else {
                //     if ($scope.TypePortfolio != undefined && $scope.TypePortfolio == 'Component') {
                //         if (childItem.UserGroupId != undefined && parseInt(childItem.UserGroupId) == item.ID) {
                //             //if (childItem.Role != undefined && childItem.Role.results != undefined && childItem.Role.results.length > 0) {
                //             //    angular.forEach(childItem.Role.results, function (task) {
                //             //        if (task == 'Deliverable Teams') {
                //             if (!$scope.isItemExists(item.childs, childItem.Id)) {
                //                 item.childs.push(childItem);
                //             }
                //             $scope.getChilds(childItem, items);
                //             //        }
                //             //    })
                //             //}
                //         }
                //     }
                //     else if ($scope.TypePortfolio != undefined && $scope.TypePortfolio == 'Service') {
                //         if (childItem.UserGroupId != undefined && parseInt(childItem.UserGroupId) == item.ID) {
                //             //if (childItem.Role != undefined && childItem.Role.results != undefined && childItem.Role.results.length > 0) {
                //             //    angular.forEach(childItem.Role.results, function (task) {
                //             //        if (task == 'Service Teams') {
                //             if (!$scope.isItemExists(item.childs, childItem.Id)) {
                //                 item.childs.push(childItem);
                //             }
                //             $scope.getChilds(childItem, items);

                //             //        }
                //             //    })
                //             //}
                //         }
                //     }
                // }
            })
            // $scope.bindAutoCompletedId('body', $scope.AllUsers, 'Categories');
        }
        const getChilds = (item:any, items:any)=> {
            item.childs = [];
            $.each(items, function (index:any,childItem:any) {
                if (props.props.Items != undefined) {
                    if (props.props.Items.Item_x0020_Type == undefined) {
                        if (props.props.Items.Services == undefined || props.props.Items.Services.results == '') {
                            if (childItem.UserGroupId != undefined && parseInt(childItem.UserGroupId) == item.ID) {
                                if (childItem.Role != undefined && childItem.Role.results != undefined && childItem.Role.results.length > 0) {
                                    $.each(childItem.Role.results, function (task:any) {
                                        if (task == 'Deliverable Teams') {
                                            if (!isItemExists(item.childs, childItem.Id)) {
                                                item.childs.push(childItem);
                                            }
                                            getChilds(childItem, items);
                                        }
                                    })
                                }
                            }
                        }
                        else if (props.props.Items.Services != undefined && props.props.Items.Services.results != '') {
                            if (childItem.UserGroupId != undefined && parseInt(childItem.UserGroupId) == item.ID) {
                                if (childItem.Role != undefined && childItem.Role.results != undefined && childItem.Role.results.length > 0) {
                                    $.each(childItem.Role.results, function (task) {
                                        if (task == 'Service Teams') {
                                            if (!isItemExists(item.childs, childItem.Id)) {
                                                item.childs.push(childItem);
                                            }
                                            getChilds(childItem, items);

                                        }
                                    })
                                }
                            }
                        }
                    }
                    if (props.props.Items.Item_x0020_Type == undefined) {
                        if (props.props.Items != undefined) {
                            if (props.props.Items.Portfolio_x0020_Type == 'Component') {
                                if (childItem.UserGroupId != undefined && parseInt(childItem.UserGroupId) == item.ID) {
                                    if (childItem.Role != undefined && childItem.Role.results != undefined && childItem.Role.results.length > 0) {
                                        $.each(childItem.Role.results, function (index:any,task:any) {
                                            if (task == 'Deliverable Teams') {
                                                if (!isItemExists(item.childs, childItem.Id)) {
                                                    item.childs.push(childItem);
                                                }
                                                getChilds(childItem, items);
                                            }
                                        })
                                    }
                                }
                            }
                            else if (props.props.Items.Portfolio_x0020_Type == 'Service') {
                                if (childItem.UserGroupId != undefined && parseInt(childItem.UserGroupId) == item.ID) {
                                    if (childItem.Role != undefined && childItem.Role.results != undefined && childItem.Role.results.length > 0) {
                                        $.each(childItem.Role.results, function (task:any) {
                                            if (task == 'Service Teams') {
                                                if (!isItemExists(item.childs, childItem.Id)) {
                                                    item.childs.push(childItem);
                                                }
                                                getChilds(childItem, items);
                                            }
                                        })
                                    }
                                }
                            }
                        }
                    }
                }
                // else {
                //     if ($scope.TypePortfolio != undefined && $scope.TypePortfolio == 'Component') {
                //         if (childItem.UserGroupId != undefined && parseInt(childItem.UserGroupId) == item.ID) {
                //             if (childItem.Role != undefined && childItem.Role.results != undefined && childItem.Role.results.length > 0) {
                //                 angular.forEach(childItem.Role.results, function (task) {
                //                     if (task == 'Deliverable Teams') {
                //                         if (!$scope.isItemExists(item.childs, childItem.Id)) {
                //                             item.childs.push(childItem);
                //                         }
                //                         $scope.getChilds(childItem, items);
                //                     }
                //                 })
                //             }
                //         }
                //     }
                //     else if ($scope.TypePortfolio != undefined && $scope.TypePortfolio == 'Service') {
                //         if (childItem.UserGroupId != undefined && parseInt(childItem.UserGroupId) == item.ID) {
                //             if (childItem.Role != undefined && childItem.Role.results != undefined && childItem.Role.results.length > 0) {
                //                 angular.forEach(childItem.Role.results, function (task) {
                //                     if (task == 'Service Teams') {
                //                         if (!$scope.isItemExists(item.childs, childItem.Id)) {
                //                             item.childs.push(childItem);
                //                         }
                //                         $scope.getChilds(childItem, items);

                //                     }
                //                 })
                //             }
                //         }
                //     }
                // }
            })
            // $scope.bindAutoCompletedId('body', $scope.AllUsers, 'Categories');
        }
        const isItemExists = function (arr:any, Id:any) {
            var isExists = false;
            $.each(arr, function (item:any) {
                if (item.Id == Id) {
                    isExists = true;
                    return false;
                }
            });
            return isExists;
        }
    return(
        <>
<div className="col-sm-12 padL-0 PadR0 mb-15" ng-cloak>
    <div className="col-sm-12 pull-left HedaBackclr">
        <div ng-if="teamUserExpanded" className="col-sm-11 padL-0 hreflink" ng-click="forCollapse()">
            <img style={{width:"10px"}} src="https://hhhhteams.sharepoint.com/sites/HHHH/SP//SiteCollectionImages/ICONS/32/list-iconwhite.png"/>
            <span className="txtSizeClr">Select Team Members</span>
        </div>
</div>
       
    </div>
    <div className="col-sm-12 mb-10 padL-0 BdrBoxBlue" ng-show="teamUserExpanded">
        <div className="taskTeamBox pl-10">
            {Task.map(function(index:any,user:any){
                return(

               
            <div ui-on-drop="onDropRemoveTeam($event,$data,taskUsers)" className="top-assign" ng-repeat="user in taskUsers">
                <fieldset ng-if="user.childs.length >0" className="team">
                    <legend className="ng-binding BdrBtm">
                        {index.Title}
                    </legend>
                    
                    {index.childs.map(function(item:any){
                return(

                    <div className="marginR41">
                        {(item.Item_x0020_Cover!=undefined && item.Item_x0020_Cover.Url!=undefined) &&
                        <span>
                            <img className="AssignUserPhoto" ui-draggable="true"
                                
                                title={item.Title}
                                 src={item.Item_x0020_Cover.Url}
                                 ng-click="openTeamPage(item)" />
                        </span>
                    }
                        {(item.Item_x0020_Cover==undefined||item.Item_x0020_Cover=='' ||item.Item_x0020_Cover.Url==undefined || item.Item_x0020_Cover== null || item.Item_x0020_Cover.Url== null) &&
                        <span>
                            <div
                                 className="text-center"
                                 ng-click="openTeamPage(item)"                            
                                title={item.Title}
                                 on-drop-success="dropSuccessHandler($event, $index,  user.childs)">
                                {item.Suffix}
                            </div>
                        </span>
                    }
                    </div>
                        )
                    })}
                
                </fieldset>
            </div>
             )
            })}
        </div>
        {/* <div class="col-sm-12 padL-0 PadR0 mb-10 mt-10" style={{marginLeft: "9px!important"}}>
            <div className="col-sm-7 padL-0 PadR0">
                <h3 className="md2 mb2 fontSize15 bold mt-0">Team Members</h3>
                <div className="col-sm-12 padL-0 PadR0 UserTimeTabGray">

                    <div class="col-sm-5 padL-0 PadR0" style="border-right: 1px solid #666363;padding-bottom: 10px;">

                        <div ng-show="Item_x0020_Type == undefined" className="col-sm-12 PadR0 padL-0" ui-on-drop="onDropTeam($event,$data,ResponsibleTeam,'Team Leaders',taskUsers)">
                            <div className=" PtL-5">
                                <div style="width: 100%;display: inline-flex;">
                                    <div>
                                        <img ui-draggable="true" drag="image" ng-if="image.userImage!=undefined" on-drop-success="dropSuccessHandler($event, $index, ResponsibleTeam,'Team Leaders')" data-toggle="popover" data-trigger="hover" class="ProirityAssignedUserPhoto" ng-repeat="image in ResponsibleTeam"
                                             title="{{image.Title}}" ng-src="{{image.userImage}}" ng-click="openTeamPage(image)" />
                                    </div>
                                    <div>
                                        <img ng-if="image.userImage == undefined && image.Item_x0020_Cover!=undefined &&image.Item_x0020_Cover.Url!=undefined" ui-draggable="true" drag="image" on-drop-success="dropSuccessHandler($event, $index, ResponsibleTeam,'Team Leaders')" data-toggle="popover" data-trigger="hover" class="ProirityAssignedUserPhoto" title="{{image.Title}}"
                                             ng-repeat="image in ResponsibleTeam" ng-src="{{image.Item_x0020_Cover.Url}}" ng-click="openTeamPage(image)" />
                                    </div>
                                    <div ng-if="(image.userImage==undefined) &&(image.Item_x0020_Cover==undefined || image.Item_x0020_Cover.Url==undefined)" title="{{image.Title}}" ui-draggable="true" drag="image" on-drop-success="dropSuccessHandler($event, $index, ResponsibleTeam,'Team Leaders')" data-toggle="popover" data-trigger="hover" ng-repeat="image in ResponsibleTeam"
                                         title="{{image.Title}}" ng-src="{{image.userImage}}" ng-click="openTeamPage(image)"
                                         class="text-center create title2  ng-binding ProirityAssignedUserPhoto">
                                        {Image.Suffix}
                                    </div>
                                </div>
                                <span ng-show="ResponsibleTeam.length==0" style="color: #b1b0b0;padding-left:8px">
                                    Task
                                    Leaders
                                </span>
                            </div>
                        </div>


                        <div ng-show="Item_x0020_Type != undefined" className="col-sm-12 PadR0 padL-0" ui-on-drop="onDropTeam($event,$data,AssignedToUsers,'Assigned User',taskUsers)">
                            <div className=" PtL-5">
                                <div style="width: 100%;display: inline-flex;">
                                    <div>
                                        <img ui-draggable="true" drag="image" ng-if="image.userImage!=undefined" on-drop-success="dropSuccessHandler($event, $index, AssignedToUsers,'Assigned User',$data)" data-toggle="popover" data-trigger="hover" class="ProirityAssignedUserPhoto" ng-repeat="image in AssignedToUsers"
                                             title="{{image.Title}}" ng-src="{{image.userImage}}" ng-click="openTeamPage(image)" />
                                    </div>
                                    <div>
                                        <img ng-if="image.userImage == undefined && image.Item_x0020_Cover!=undefined &&image.Item_x0020_Cover.Url!=undefined" ui-draggable="true" drag="image" on-drop-success="dropSuccessHandler($event, $index, AssignedToUsers,'Assigned User',$data)" data-toggle="popover" data-trigger="hover" class="ProirityAssignedUserPhoto" title="{{image.Title}}"
                                             ng-repeat="image in AssignedToUsers" ng-src="{{image.Item_x0020_Cover.Url}}" ng-click="openTeamPage(image)" />
                                    </div>
                                    <div ng-if="(image.userImage==undefined) &&(image.Item_x0020_Cover==undefined || image.Item_x0020_Cover.Url==undefined)" title="{{image.Title}}" ui-draggable="true" drag="image" on-drop-success="dropSuccessHandler($event, $index, AssignedToUsers,'Assigned User',$data)" data-toggle="popover" data-trigger="hover" ng-repeat="image in AssignedToUsers"
                                         title="{{image.Title}}" ng-src="{{image.Suffix}}" ng-click="openTeamPage(image)"
                                         class="text-center create title2  ng-binding ProirityAssignedUserPhoto">
                                        {{Image.Suffix}}
                                    </div>
                                </div>
                                <span ng-show="AssignedToUsers.length==0" style="color: #b1b0b0;padding-left:8px">
                                    Task
                                    Leaders
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-7 padL-0 PadR0">
                        <!-- <h3 className="md2 mb2 Ml-13 fontSize15">Team Members</h3> -->
                        <div ng-show="Item_x0020_Type == undefined" className="col-sm-12 padL-0 PadR0" ui-on-drop="onDropTeam($event,$data,TeamMemberUsers,'Team Members',taskUsers)">
                            <div className="PtL-5">
                                <div style="width: 100%;display: inline-flex;">
                                    <div>
                                        <img ui-draggable="true" drag="image" ng-if="image.userImage!=undefined" on-drop-success="dropSuccessHandler($event, $index, TeamMemberUsers,'Team Members',$data)" data-toggle="popover" data-trigger="hover" class="ProirityAssignedUserPhoto" ng-repeat="image in TeamMemberUsers"
                                             title="{{image.Title}}" ng-src="{{image.userImage}}" ng-click="openTeamPage(image)" />
                                    </div>
                                    <div>
                                        <img ng-if="image.userImage == undefined && image.Item_x0020_Cover!=undefined &&image.Item_x0020_Cover.Url!=undefined" ui-draggable="true" drag="image" on-drop-success="dropSuccessHandler($event, $index, TeamMemberUsers,'Team Members',$data)" data-toggle="popover" data-trigger="hover" class="ProirityAssignedUserPhoto" title="{{image.Title}}"
                                             ng-repeat="image in TeamMemberUsers" ng-src="{{image.Item_x0020_Cover.Url}}" ng-click="openTeamPage(image)" />
                                    </div>
                                    <div ng-if="(image.userImage==undefined)&&(image.Item_x0020_Cover==undefined || image.Item_x0020_Cover.Url==undefined)" title="{{image.Title}}" ui-draggable="true" drag="image" on-drop-success="dropSuccessHandler($event, $index, TeamMemberUsers,'Team Members',$data)" data-toggle="popover" data-trigger="hover" ng-repeat="image in TeamMemberUsers"
                                         title="{{image.Title}}" ng-src="{{image.Suffix}}" ng-click="openTeamPage(image)" class="text-center create title2  ng-binding ProirityAssignedUserPhoto">
                                        {{Image.Suffix}}
                                    </div>
                                </div>
                                <span ng-show="TeamMemberUsers.length==0" style="color: #b1b0b0;padding-left:8px">
                                    Responsible Team
                                </span>
                            </div>
                        </div>

                        <div ng-show="Item_x0020_Type != undefined" className="col-sm-12 padL-0 PadR0" ui-on-drop="onDropTeam($event,$data,TeamMemberUsers,'Team Members',taskUsers)">
                            <div className="PtL-5">
                                <div style="width: 100%;display: inline-flex;">
                                    <div>
                                        <img ui-draggable="true" drag="image" ng-if="image.userImage!=undefined" on-drop-success="dropSuccessHandler($event, $index, TeamMemberUsers,'Team Members',$data)" data-toggle="popover" data-trigger="hover" class="ProirityAssignedUserPhoto" ng-repeat="image in TeamMemberUsers"
                                             title="{{image.Title}}" ng-src="{{image.userImage}}" ng-click="openTeamPage(image)" />
                                    </div>
                                    <div>
                                        <img ng-if="image.userImage == undefined && image.Item_x0020_Cover!=undefined &&image.Item_x0020_Cover.Url!=undefined" ui-draggable="true" drag="image" on-drop-success="dropSuccessHandler($event, $index, TeamMemberUsers,'Team Members',$data)" data-toggle="popover" data-trigger="hover" class="ProirityAssignedUserPhoto" title="{{image.Title}}"
                                             ng-repeat="image in TeamMemberUsers" ng-src="{{image.Item_x0020_Cover.Url}}" ng-click="openTeamPage(image)" />
                                    </div>
                                    <div ng-if="(image.userImage==undefined)&&(image.Item_x0020_Cover==undefined || image.Item_x0020_Cover.Url==undefined)" title="{{image.Title}}" ui-draggable="true" drag="image" on-drop-success="dropSuccessHandler($event, $index, TeamMemberUsers,'Team Members',$data)" data-toggle="popover" data-trigger="hover" ng-repeat="image in TeamMemberUsers"
                                         title="{{image.Title}}" ng-src="{{image.Suffix}}" ng-click="openTeamPage(image)"
                                         class="text-center create title2  ng-binding ProirityAssignedUserPhoto">
                                        {{Image.Suffix}}
                                    </div>
                                </div>
                                <span ng-show="TeamMemberUsers.length==0" style="color: #b1b0b0;padding-left:8px">
                                    Responsible Team
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-sm-3 padL-0 PadR0" ng-show="Item_x0020_Type == undefined">
                <h3 className="md2 mb2 Ml-13 fontSize15 bold mt-0">Working Members</h3>
                <div className="col-sm-12 PadR0" ui-on-drop="onDropTeam1($event,$data,AssignedToUsers,'Assigned User',taskUsers)">
                    <div class="TimeTabBox PtL-5" style="height: 70px;">
                        <div style="width: 100%;display: inline-flex;">
                            <div>
                                <img ui-draggable="true" drag="image" ng-if="image.userImage!=undefined" on-drop-success="dropSuccessHandler($event, $index, AssignedToUsers,'Assigned User',$data)" data-toggle="popover" data-trigger="hover" class="ProirityAssignedUserPhoto" ng-repeat="image in AssignedToUsers"
                                     title="{{image.Title}}" ng-src="{{image.userImage}}" ng-click="openTeamPage(image)" />
                            </div>
                            <div>
                                <img ng-if="image.userImage == undefined && image.Item_x0020_Cover!=undefined &&image.Item_x0020_Cover.Url!=undefined" ui-draggable="true" drag="image" on-drop-success="dropSuccessHandler($event, $index, AssignedToUsers,'Assigned User')" data-toggle="popover" data-trigger="hover" class="ProirityAssignedUserPhoto" title="{{image.Title}}"
                                     ng-repeat="image in AssignedToUsers" ng-src="{{image.Item_x0020_Cover.Url}}" ng-click="openTeamPage(image)" />
                            </div>
                            <div ng-if="(image.userImage==undefined)&&(image.Item_x0020_Cover==undefined || image.Item_x0020_Cover.Url==undefined)" ui-draggable="true" drag="image" title="{{image.Title}}" ng-repeat="image in AssignedToUsers"
                                 class="text-center create title2  ng-binding ProirityAssignedUserPhoto" on-drop-success="dropSuccessHandler($event, $index, AssignedToUsers,'Assigned User',$data)" data-toggle="popover" data-trigger="hover"
                                 title="{{image.Title}}" ng-src="{{image.Suffix}}" ng-click="openTeamPage(image)">
                                {{Image.Suffix}}
                            </div>
                        </div>
                        <span ng-show="AssignedToUsers.length==0" style="color: #b1b0b0;padding-left:8px">
                            Working
                            Members
                        </span>
                    </div>
                </div>
            </div>
            <div className="col-sm-2 padL-0">
                <div class="mt-10" style="float: right;">
                    <div ui-on-drop="onDropRemoveTeam($event,$data, taskUsers)">
                        <img ng-show="Item.Portfolio_x0020_Type=='Component'" title="Drag user here to  remove user from team for this Network Activity." className="height80" ng-src="{{site_Url}}/SiteCollectionImages/ICONS/Shareweb/icon_Dustbin.png" />
                        <img ng-show="Item.Portfolio_x0020_Type=='Service'" title="Drag user here to  remove user from team for this Network Activity." className="height80" ng-src="{{site_Url}}/SiteCollectionImages/ICONS/Service_Icons/icon_Dustbin-green.png" />
                        <img ng-show="Item.Portfolio_x0020_Type=='Events'" title="Drag user here to  remove user from team for this Network Activity." className="height80" ng-src="{{site_Url}}/SiteCollectionImages/ICONS/Event_Icons/icon_Dustbin-orange.png" />
                    </div>
                </div>
            </div>
        </div> */}
    </div>
        </>
    )
}
export default TeamComposition;