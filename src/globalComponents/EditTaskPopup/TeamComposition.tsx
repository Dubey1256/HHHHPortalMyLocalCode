import * as React from 'react';
import * as $ from 'jquery';
import "bootstrap/dist/css/bootstrap.min.css";
import axios, { AxiosResponse } from 'axios';
import { arraysEqual, Modal } from 'office-ui-fabric-react';
//import { BiTime, BiCalendar } from 'react-icons/Bi';
//import './foundation.scss';
import { Web } from "sp-pnp-js"
//import './foundationmin.scss';
import { Moment } from 'moment';
import * as moment from 'moment';
import TimeEntryPopup from './TimeEntryComponent';
import { FaSolarPanel } from 'react-icons/fa';


const BaseUrl = "SP"

const TeamComposition = (props: any) => {

    
    const dragItem: any = React.useRef();
    const dragOverItem = React.useRef();
    const [Task, setTask] = React.useState([])
    const [ResponsibleTeams, setResponsibleTeams] = React.useState([])
    const [TeamMemberUser, setTeamMemberUser] = React.useState([])
    const [AssignedToUser, setAssignedToUser] = React.useState([])
    const [TaskStatuspopup, setTaskStatuspopup] = React.useState(false);
    const [TimeSheet, setTimeSheet] = React.useState([])
    const [changeDates, setchangeDates] = React.useState(moment().format('MMMM Do YYYY'))
    const [changeTime, setchangeTime] = React.useState(0)
    const [count, setCount] = React.useState(1)
    const [month, setMonth] = React.useState(1)
    const [year, setYear] = React.useState(1)
    const [TimeInHours,setTimeInHours] = React.useState(0)

    const dragStart = (e: any, position: any) => {
        dragItem.current = position;
        console.log(e.target.innerHTML);
    };
   // var count =0
    const changeDate=(item:any)=>{
      
       
        if(item == 'Date'){
           setCount(count+1)
          setchangeDates(moment().add(count,'days').format("MMMM Do YYYY"))
        }
        if(item == 'month'){
            setMonth(month+1)
             setchangeDates(moment().add(month, 'months').format("MMMM Do YYYY"))
          }
          if(item == 'Year'){
            setYear(year+1)
            setchangeDates(moment().add(year, 'years').format("MMMM Do YYYY"))
          }
    }
    const changeDateDec=(item:any)=>{
      
       
        if(item == 'Date'){
           setCount(count-1)
          setchangeDates(moment().add(count,'days').format("MMMM Do YYYY"))
        }
        if(item == 'month'){
            setMonth(month-1)
             setchangeDates(moment().add(month, 'months').format("MMMM Do YYYY"))
          }
          if(item == 'Year'){
            setYear(year-1)
            setchangeDates(moment().add(year, 'years').format("MMMM Do YYYY"))
          }
    }
const changeTimes=(items:any)=>{
    if(items == '15'){
        setchangeTime(changeTime+15)

        if (changeTime != undefined) {
            var TimeInHour:any = changeTime / 60;
           setTimeInHours(TimeInHour.toFixed(2))
           
        }

    }
    if(items == '60'){
        setchangeTime(changeTime+60)
        if (changeTime != undefined) {
            var TimeInHour:any = changeTime / 60;
            setTimeInHours(TimeInHour.toFixed(2))
        }

    }

}
const changeTimesDec=(items:any)=>{
    if(items == '15'){
        setchangeTime(changeTime-15)
        if (changeTime != undefined) {
            var TimeInHour:any = changeTime / 60;
            setTimeInHours(TimeInHour.toFixed(2))
        }

    }
    if(items == '60'){
        setchangeTime(changeTime-60)
        if (changeTime != undefined) {
            var TimeInHour:any = changeTime / 60;
            setTimeInHours(TimeInHour.toFixed(2))
        }

    }

}


    const GetTimeSheet = async () => { 
        var TimeSheets:any =[]

         const web =new Web('https://hhhhteams.sharepoint.com/sites/HHHH/SP'); 
        
         const res = await web.lists.getById('01A34938-8C7E-4EA6-A003-CEE649E8C67A').items
        .select("Id,Title,TaxType").top(4999).get();
        res.map((item:any)=>{
              if(item.TaxType == "TimesheetCategories"){
                TimeSheets.push(item)

              }
        })
        setTimeSheet(TimeSheets)
        
  }
        React.useEffect(()=>{
            GetTimeSheet();
        },[])
        
    const dragEnter = (e: any, position: any) => {
        dragOverItem.current = position;
        console.log(e.target.innerHTML);
    };

    const drop = (e: any) => {
        const copyListItems: any = [...Task];
        const dragItemContent = copyListItems[dragItem.current];
        copyListItems.splice(dragItem.current, 1);
        copyListItems.splice(dragOverItem.current, 0, dragItemContent);
        dragItem.current = null;
        dragOverItem.current = null;
        setTask(copyListItems);
    };
    const openTaskStatusUpdatePoup = () => {
        setTaskStatuspopup(true)
    }
    const closeTaskStatusUpdatePoup = () => {
        setTaskStatuspopup(false)
    }
    const getUsersWithImage = (items: any) => {
        var users: any = [];
        for (var i = 0; i < institute.length; i++) {
            if (institute[i]) {
                $.each(items, function (index: any, item: any) {
                    if (institute[i] != undefined && institute[i].AssingedToUserId != undefined && institute[i].AssingedToUserId == item.Id) {
                        if (institute[i].Item_x0020_Cover == undefined) {
                            institute[i].Item_x0020_Cover = {}
                            institute[i].Item_x0020_Cover.Url = null
                        }
                        item.userImage = institute[i].Item_x0020_Cover.Url
                        item.Title = institute[i].Title;
                        item.Suffix = institute[i].Suffix;
                        item.UserGroupId = institute[i].UserGroupId;
                        item.ID = institute[i].ID;
                        item.Company = institute[i].Company;
                        item.AssingedToUserId = institute[i].AssingedToUserId;
                        item.Role = institute[i].Role;

                        if (institute[i].Item_x0020_Cover != undefined) {
                            // item.userImage = categoryUser.childs[i].Item_x0020_Cover
                            item.Item_x0020_Cover = institute[i].Item_x0020_Cover
                        }
                        if (!isItemExists(users, item.Id)) {
                            users.push(item);
                        }

                        // categoryUser.childs.splice(i, 1);
                    }
                });
            }
        }
        // });

        return users;
    }


    var institute: any = []
    var ResponsibleTeam: any = []
    var TeamMemberUsers: any = []
    React.useEffect(() => {
       
        InstitutionData();
    }, []);
    function InstitutionData() {
        var AllUsers: any = []
        var taskUsers: any = []
        var url = "https://hhhhteams.sharepoint.com/sites/HHHH/sp/_api/web/lists/getbyid('b318ba84-e21d-4876-8851-88b94b9dc300')/items?$select=Id,IsActive,UserGroupId,Suffix,Title,Email,SortOrder,Role,Company,ParentID1,TaskStatusNotification,Status,Item_x0020_Cover,AssingedToUserId,isDeleted,AssingedToUser/Title,AssingedToUser/Id,AssingedToUser/EMail,ItemType&$expand=AssingedToUser&$filter=IsActive eq 1&$orderby=SortOrder asc,Title asc"
        $.ajax({
            url: url,
            method: "GET",
            headers: {
                "Accept": "application/json; odata=verbose"
            },
            success: function (data) {
                institute = data.d.results;
                $.each(institute, function (item: any, items: any) {
                    if (items.ItemType != 'Group') {
                        AllUsers.push(items);
                    }
                })
                $.each(data.d.results, function (index: any, item: any) {
                    if (item.UserGroupId == undefined) {
                        if (BaseUrl.toLowerCase() == 'sp' || window.location.href.toLowerCase().indexOf('gmbh/sitepages/teamcalendar') > -1)
                            getChilds(item, data.d.results);
                        else
                            getChildsWithoutRoleBased(item, data.d.results);
                        taskUsers.push(item);
                    }
                })
                $.each(institute, function (index: any, item: any) {
                    if (props.props.Items?.AssignedTo?.results.length > 0) {
                        ResponsibleTeam = getUsersWithImage(props.props.Items.AssignedTo.results
                        );
                    }
                    if (props.props.Items != undefined) {
                        showComposition();
                    }
                })
                // setTeamMemberUser(TeamMemberUser)
                // $.each(institute, function (index:any,item:any) {
                //     if (props.props.Items.Team_x0020_Members.results.length>0) {
                //         TeamMemberUsers = getUsersWithImage(props.props.Items.Team_x0020_Members.results);
                //     }
                //     if (props.props.Items != undefined) {
                //         showComposition();
                //     }
                // })
                setTask(taskUsers)
            },
            error: function (error) {
            }
        });
    }
       
    const getChildsWithoutRoleBased = (item: any, items: any) => {
        item.childs = [];
        $.each(items, function (index: any, childItem: any) {
            if (props.props.Items != undefined) {
                if (props.props.Items.Item_x0020_Type === undefined) {
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
    const getChilds = (item: any, items: any) => {
        item.childs = [];
        $.each(items, function (index: any, childItem: any) {
            if (props.props.Items != undefined) {
                if (props.props.Items.Item_x0020_Type == undefined) {
                    if (props.props.Items.Services == undefined || props.props.Items.Services.results == '') {
                        if (childItem.UserGroupId != undefined && parseInt(childItem.UserGroupId) == item.ID) {
                            if (childItem.Role != undefined && childItem.Role.results != undefined && childItem.Role.results.length > 0) {
                                $.each(childItem.Role.results, function (task: any) {
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
                                    $.each(childItem.Role.results, function (index: any, task: any) {
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
                                    $.each(childItem.Role.results, function (task: any) {
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
    const isItemExists = function (arr: any, Id: any) {
        var isExists = false;
        $.each(arr, function (item: any) {
            if (item.Id == Id) {
                isExists = true;
                return false;
            }
        });
        return isExists;
    }
    var ResponsibleTeam: any = []
    var TeamLeaderData: any = []
    var TeamMemberUsers: any = []
    var AssignedToUsers: any = []
    const showComposition = () => {
        if (props.props.Items.Responsible_x0020_Team != undefined) {

            if (ResponsibleTeam != undefined && ResponsibleTeam.length > 0) {
                TeamLeaderData = getUsersWithImage(props.props.Items.Responsible_x0020_Team.results);
                $.each(TeamLeaderData, function (index: any, item: any) {
                    if (!isItemExists(ResponsibleTeam, item.Id)) {
                        ResponsibleTeam.push(item);
                    }
                });
            }
            else {
                ResponsibleTeam = getUsersWithImage(props.props.Items.Responsible_x0020_Team.results);
            }


            //  NewTeamConfigurations.push({ Title: 'Task Leader', childs: ResponsibleTeam });
        }
        setResponsibleTeams(ResponsibleTeam)


        if (props.props.Items.Team_x0020_Members != undefined) {
            if (TeamMemberUsers != undefined && TeamMemberUsers.length > 0) {
                var TeamMemberUsersData = getUsersWithImage(props.props.Items.Team_x0020_Members.results);
                $.each(TeamMemberUsersData, function (index: any, item: any) {
                    if (!isItemExists(TeamMemberUsers, item.Id)) {
                        TeamMemberUsers.push(item);
                    }
                });
            }
            else {
                TeamMemberUsers = getUsersWithImage(props.props.Items.Team_x0020_Members.results);
            }

            TeamMemberUsers = getUsersWithImage(props.props.Items.Team_x0020_Members.results);
            // $scope.NewTeamConfigurations.push({ Title: 'Team Members', childs: $scope.TeamMemberUsers });
        }
        setTeamMemberUser(TeamMemberUsers)
        // if (($rootScope.modalInstance != undefined && $rootScope.modalInstance.isPortfolioTagged == undefined) || ($rootScope.modalInstance1 != undefined && $rootScope.modalInstance1.isPortfolioTagged == undefined) || ($scope.QuickUpdateTemplate)) {
        if (props.props.Items.AssignedTo != undefined) {
            if (AssignedToUsers != undefined && AssignedToUsers.length > 0) {
                var AssignedToUsersData = getUsersWithImage(props.props.Items.AssignedTo.results);
                $.each(AssignedToUsersData, function (item: any) {
                    if (!isItemExists(AssignedToUsers, item.Id)) {
                        AssignedToUsers.push(item);
                    }
                });
            }
            else {
                AssignedToUsers = getUsersWithImage(props.props.Items.AssignedTo.results);
            }
            AssignedToUsers = getUsersWithImage(props.props.Items.AssignedTo.results);
            //  AssignedToUsersDetail = AssignedToUsers;
        }
        setAssignedToUser(AssignedToUsers)
        // }
        // else {
        //     if ($scope.Item.AssignedTo != undefined) {
        //         if ($scope.AssignedToUsers != undefined && $scope.AssignedToUsers.length > 0) {
        //             var AssignedToUsersData = $scope.getUsersWithImage($scope.Item.AssignedTo.results);
        //             angular.forEach(AssignedToUsersData, function (item) {
        //                 if (!$scope.isItemExists($scope.ResponsibleTeam, item.Id)) {
        //                     $scope.ResponsibleTeam.push(item);
        //                 }
        //             });
        //         }
        //         else {
        //             $scope.ResponsibleTeam = $scope.getUsersWithImage($scope.Item.AssignedTo.results);
        //         }
        //         $scope.ResponsibleTeam = $scope.getUsersWithImage($scope.Item.AssignedTo.results);
        //         $scope.NewTeamConfigurations.push({ Title: 'Task Leader', childs: $scope.ResponsibleTeam });
        //     }
        // }
        // angular.forEach($scope.taskUsers, function (categoryUser) {
        //     for (var i = 0; i < categoryUser.childs.length; i++) {
        //         if (categoryUser.childs[i].Item_x0020_Cover != undefined) {
        //             angular.forEach($scope.TeamMemberUsers, function (item) {
        //                 if (categoryUser.childs[i] != undefined && categoryUser.childs[i].AssingedToUserId != undefined && categoryUser.childs[i].AssingedToUserId == item.Id) {
        //                     categoryUser.childs.splice(i, 1);
        //                 }
        //             });
        //         }
        //     }
        // });
        // angular.forEach($scope.taskUsers, function (categoryUser) {
        //     for (var i = 0; i < categoryUser.childs.length; i++) {
        //         if (categoryUser.childs[i].Item_x0020_Cover != undefined) {
        //             angular.forEach($scope.AssignedToUsers, function (item) {
        //                 if (categoryUser.childs[i] != undefined && categoryUser.childs[i].AssingedToUserId != undefined && categoryUser.childs[i].AssingedToUserId == item.Id) {
        //                     categoryUser.childs.splice(i, 1);
        //                 }
        //             });
        //         }
        //     }
        // });
        // angular.forEach($scope.taskUsers, function (categoryUser) {
        //     for (var i = 0; i < categoryUser.childs.length; i++) {
        //         if (categoryUser.childs[i].Item_x0020_Cover != undefined) {
        //             angular.forEach($scope.ResponsibleTeam, function (item) {
        //                 if (categoryUser.childs[i] != undefined && categoryUser.childs[i].AssingedToUserId != undefined && categoryUser.childs[i].AssingedToUserId == item.Id) {
        //                     categoryUser.childs.splice(i, 1);
        //                 }
        //             });
        //         }
        //     }
        // });
        // var AllTeamDetails = {
        //     Item1: { Title: 'Team Member', Childs: $scope.TeamMemberUsers }, Item2: { Title: 'Working Member', Childs: $scope.AssignedToUsers }, Item3: { Title: 'Team Leader', Childs: $scope.ResponsibleTeam }
        // };

        // $scope.$emit('updatedTeamComposition', AllTeamDetails);
    }
    return (
        <>
            <div className='col'>
                <div className="col-sm-7">
                            <div className="row bg-ee p-1" ng-if="teamUserExpanded"  ng-click="forCollapse()">
                                <img style={{ width: "10px" }} src="https://hhhhteams.sharepoint.com/sites/HHHH/SP//SiteCollectionImages/ICONS/32/list-iconwhite.png" />
                                <span className="txtSizeClr">Select Team Members</span>
                            </div>
           
                    <div className="border row" ng-show="teamUserExpanded">
                        <div className="col-sm-12">

                            {Task.map(function (index: any, user: any) {
                                return (



                                    <div ui-on-drop="onDropRemoveTeam($event,$data,taskUsers)" className="top-assign" ng-repeat="user in taskUsers">
                                        <div ng-if="user.childs.length >0" className="team">
                                            <label className="BdrBtm" >
                                                {index.Title}
                                            </label>

                                      <div className='d-flex'>
                                      {index.childs.map(function (item: any, index: any) {
                                                return (
                                                    <>
                                                        <div>
                                                            {(item.Item_x0020_Cover != undefined && item.Item_x0020_Cover.Url != undefined) &&
                                                                <span>
                                                                    <img className="AssignUserPhoto" ui-draggable="true"

                                                                        title={item.Title}
                                                                        src={item.Item_x0020_Cover.Url}
                                                                        ng-click="openTeamPage(item)" />

                                                                </span>
                                                            }
                                                        </div>
                                                        {/* <div onDragStart={(e: any) => dragStart(e, index)}
                                                     
                                                    
                                                     key={index}
                                                      draggable> 
                                                     </div> */}
                                                    </>
                                                )
                                            })}
                                      </div>
                                         
                                        </div>
                                    </div>
                                )
                            })}

                        </div>
                        <div className="row">
                            <div className="col-sm-7 ">
                                <h6>Team Members</h6>
                                <div className="d-flex UserTimeTabGray  p-1">

                                    <div className="border-end col-sm-5 p-0">
                                        {props.props.Items.Item_x0020_Type == undefined &&
                                         
                                                <div className='col' ng-show="" onDragEnd={drop} >
                                                    <div>
                                                        <div>
                                                            {ResponsibleTeams.map((image: any, index) => {
                                                                return (
                                                                    <>
                                                                        {image.userImage != undefined &&
                                                                            <img ui-draggable="true" onDragEnter={(e) => dragEnter(e, index)} data-toggle="popover" data-trigger="hover" className="ProirityAssignedUserPhoto" ng-repeat="image in ResponsibleTeam"
                                                                                title={image.Title} src={image.userImage} ng-click="openTeamPage(image)" />
                                                                        }
                                                                    </>
                                                                )
                                                            })}
                                                        </div>
                                                        <div>
                                                            {ResponsibleTeams.map((image: any) => {
                                                                return (
                                                                    <>
                                                                        {(image.userImage == undefined && image.Item_x0020_Cover != undefined && image.Item_x0020_Cover.Url != undefined) &&
                                                                            <img ui-draggable="true" on-drop-success="dropSuccessHandler($event, $index, ResponsibleTeam,'Team Leaders')" data-toggle="popover" data-trigger="hover" className="ProirityAssignedUserPhoto" title="{{image.Title}}"
                                                                                src={image.Item_x0020_Cover.Url} ng-click="openTeamPage(image)" />
                                                                        }
                                                                    </>
                                                                )
                                                            })}
                                                        </div>
                                                        {ResponsibleTeams.map((image: any, index) => {
                                                            return (
                                                                <>
                                                                    {(image.userImage == undefined && image.Item_x0020_Cover == undefined || image.Item_x0020_Cover.Url == undefined) &&
                                                                        <div ui-draggable="true" onDragEnter={(e) => dragEnter(e, index)} data-toggle="popover" data-trigger="hover" ng-repeat="image in ResponsibleTeam"
                                                                            title={image.Title} ng-src="{{image.userImage}}" ng-click="openTeamPage(image)"
                                                                            className="text-center create title2  ng-binding ProirityAssignedUserPhoto">
                                                                            {image.Suffix}
                                                                        </div>
                                                                    }
                                                                </>
                                                            )
                                                        })}
                                                    </div>
                                                    {ResponsibleTeams.length == 0 &&
                                                        <span style={{ color: "#b1b0b0", paddingLeft: "8px" }}>
                                                            Task
                                                            Leaders
                                                        </span>
                                                    }

                                                </div>
                                         
                                        }

                                        {props.props.Items.Item_x0020_Type != undefined &&
                                            <div ng-show="Item_x0020_Type != undefined" className="row" onDragEnd={drop}>
                                                <div className="">
                                                    <div style={{ width: "100%", display: "Flex" }}>
                                                        {AssignedToUser.map((image: any, index) => {
                                                            return (
                                                                <>

                                                                    <div>
                                                                        {image.userImage != undefined &&
                                                                            <img ui-draggable="true" onDragEnter={(e) => dragEnter(e, index)} data-toggle="popover" data-trigger="hover" className="ProirityAssignedUserPhoto" ng-repeat="image in AssignedToUsers"
                                                                                title={image.Title} src={image.userImage} ng-click="openTeamPage(image)" />
                                                                        }

                                                                    </div>
                                                                </>
                                                            )
                                                        })}
                                                        {AssignedToUser.map((image: any, index) => {
                                                            return (
                                                                <>
                                                                    <div>
                                                                        {(image.userImage != undefined && image.Item_x0020_Cover != undefined && image.Item_x0020_Cover.Url != undefined) &&
                                                                            <img ui-draggable="true" onDragEnter={(e) => dragEnter(e, index)} data-toggle="popover" data-trigger="hover" className="ProirityAssignedUserPhoto" title="{{image.Title}}"
                                                                                src={image.Item_x0020_Cover.Url} ng-click="openTeamPage(image)" />
                                                                        }
                                                                    </div>
                                                                </>
                                                            )
                                                        })}
                                                        {AssignedToUser.map((image: any, index) => {
                                                            return (
                                                                <>
                                                                    {(image.userImage == undefined && image.Item_x0020_Cover == undefined || image.Item_x0020_Cover.Url == undefined) &&
                                                                        <div title={image.Title} ui-draggable="true" onDragEnter={(e) => dragEnter(e, index)} data-toggle="popover" data-trigger="hover" ng-repeat="image in AssignedToUsers"
                                                                            ng-click="openTeamPage(image)"
                                                                            className="text-center create title2  ng-binding ProirityAssignedUserPhoto">
                                                                            {image.Suffix}
                                                                        </div>
                                                                    }
                                                                </>
                                                            )
                                                        })}

                                                    </div>
                                                    {AssignedToUser.length == 0 &&
                                                        <span style={{ color: "#b1b0b0", paddingLeft: "8px" }}>
                                                            Task
                                                            Leaders
                                                        </span>
                                                    }
                                                </div>
                                            </div>
                                        }
                                    </div>
                                    <div className="col-sm-7 ps-2 pe-0">
                                        {props.props.Items.Item_x0020_Type == undefined &&
                                            <div ng-show="Item_x0020_Type == undefined" className="col" onDragEnd={drop}>
                                                <div>
                                                    <div className='d-flex'>
                                                        {TeamMemberUser.map((image: any) => {
                                                            return (
                                                                <>

                                                                    <FaSolarPanel>
                                                                        {image.userImage != undefined &&
                                                                            <img ui-draggable="true" on-drop-success="dropSuccessHandler($event, $index, TeamMemberUsers,'Team Members',$data)" data-toggle="popover" data-trigger="hover" className="ProirityAssignedUserPhoto" ng-repeat="image in TeamMemberUsers"
                                                                                title={image.Title} src={image.userImage} ng-click="openTeamPage(image)" />
                                                                        }
                                                                    </FaSolarPanel>
                                                                </>
                                                            )
                                                        })}
                                                        {TeamMemberUser.map((image: any) => {
                                                            return (
                                                                <>

                                                                    <span>
                                                                        {(image.userImage == undefined && image.Item_x0020_Cover != undefined && image.Item_x0020_Cover.Url != undefined) &&
                                                                            <img ui-draggable="true" on-drop-success="dropSuccessHandler($event, $index, TeamMemberUsers,'Team Members',$data)" data-toggle="popover" data-trigger="hover" className="ProirityAssignedUserPhoto" ng-repeat="image in TeamMemberUsers"
                                                                                title={image.Title} src={image.userImage} ng-click="openTeamPage(image)" />
                                                                        }
                                                                    </span>
                                                                </>
                                                            )
                                                        })}
                                                        {TeamMemberUser.map((image: any) => {
                                                            return (
                                                                <>
                                                                    {(image.userImage == undefined) && (image.Item_x0020_Cover == undefined || image.Item_x0020_Cover.Url == undefined) &&
                                                                        <span title={image.Title} ui-draggable="true" on-drop-success="dropSuccessHandler($event, $index, TeamMemberUsers,'Team Members',$data)" data-toggle="popover" data-trigger="hover" ng-repeat="image in TeamMemberUsers"
                                                                            ng-src={image.Suffix} ng-click="openTeamPage(image)" className="text-center create title2  ng-binding ProirityAssignedUserPhoto">
                                                                            {image.Suffix}
                                                                        </span>
                                                                    }
                                                                </>
                                                            )
                                                        })}
                                                    </div>
                                                    {TeamMemberUser.length == 0 &&
                                                        <span ng-show="" style={{ color: "#b1b0b0", paddingLeft: "8px" }}>
                                                            Responsible Team
                                                        </span>
                                                    }
                                                </div>
                                            </div>
                                        }
                                        {props.props.Items.Item_x0020_Type != undefined &&
                                            <div ng-show="Item_x0020_Type != undefined" className="row" ui-on-drop="onDropTeam($event,$data,TeamMemberUsers,'Team Members',taskUsers)">
                                                <div className="">
                                                    <div className='d-flex'>
                                                        {TeamMemberUser.map((image: any) => {
                                                            return (
                                                                <>

                                                                    <span>
                                                                        {image.userImage != undefined &&
                                                                            <img ui-draggable="true" ng-if="" on-drop-success="dropSuccessHandler($event, $index, TeamMemberUsers,'Team Members',$data)" data-toggle="popover" data-trigger="hover" className="ProirityAssignedUserPhoto" ng-repeat="image in TeamMemberUsers"
                                                                                title={image.Title} src={image.userImage} ng-click="openTeamPage(image)" />
                                                                        }
                                                                    </span>
                                                                </>
                                                            )
                                                        })}

                                                        {TeamMemberUser.map((image: any) => {
                                                            return (<>

                                                                <span>
                                                                    {(image.userImage == undefined && image.Item_x0020_Cover != undefined && image.Item_x0020_Cover.Url != undefined) &&
                                                                        <img ui-draggable="true" ng-if="" on-drop-success="dropSuccessHandler($event, $index, TeamMemberUsers,'Team Members',$data)" data-toggle="popover" data-trigger="hover" className="ProirityAssignedUserPhoto" ng-repeat="image in TeamMemberUsers"
                                                                            src={image.Item_x0020_Cover.Url} ng-click="openTeamPage(image)" />
                                                                    }
                                                                </span>
                                                            </>)
                                                        })}
                                                        {TeamMemberUser.map((image: any) => {
                                                            return (
                                                                <>
                                                                    {
                                                                        (image.userImage == undefined && image.Item_x0020_Cover == undefined || image.Item_x0020_Cover.Url == undefined) &&
                                                                        <span ui-draggable="true" on-drop-success="dropSuccessHandler($event, $index, TeamMemberUsers,'Team Members',$data)" data-toggle="popover" data-trigger="hover" ng-repeat="image in TeamMemberUsers"
                                                                            title={image.Title} ng-click="openTeamPage(image)"
                                                                            className="text-center create title2  ng-binding ProirityAssignedUserPhoto">
                                                                            {image.Suffix}
                                                                        </span>
                                                                    }
                                                                </>
                                                            )
                                                        })}
                                                    </div>
                                                    {TeamMemberUser.length == 0 &&
                                                        <span ng-show="" style={{ color: "#b1b0b0", paddingLeft: "8px" }}>
                                                            Responsible Team
                                                        </span>
                                                    }
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-3" ng-show="Item_x0020_Type == undefined">
                                <h6>Working Members</h6>
                                <div className="col" ui-on-drop="onDropTeam1($event,$data,AssignedToUsers,'Assigned User',taskUsers)">
                                    <div className="working-box p-1" >
                                        <div>

                                            {AssignedToUser.map((image: any) => {
                                                return (
                                                    <>

                                                        <div>
                                                            {image.userImage != undefined &&
                                                                <img ui-draggable="true" on-drop-success="dropSuccessHandler($event, $index, AssignedToUsers,'Assigned User',$data)" data-toggle="popover" data-trigger="hover" className="ProirityAssignedUserPhoto" ng-repeat="image in AssignedToUsers"
                                                                    title={image.Title} src={image.userImage} ng-click="openTeamPage(image)" />
                                                            }
                                                        </div>
                                                    </>
                                                )
                                            })}
                                            {AssignedToUser.map((image: any) => {
                                                return (
                                                    <>


                                                        <div>
                                                            {((image.userImage == undefined && image.Item_x0020_Cover != undefined && image.Item_x0020_Cover.Url != undefined)) &&
                                                                <img ui-draggable="true" on-drop-success="dropSuccessHandler($event, $index, AssignedToUsers,'Assigned User')" data-toggle="popover" data-trigger="hover" className="ProirityAssignedUserPhoto" title="{{image.Title}}"
                                                                    src={image.Item_x0020_Cover.Url} ng-click="openTeamPage(image)" />
                                                            }
                                                        </div>
                                                    </>
                                                )
                                            })}
                                            {AssignedToUser.map((image: any) => {
                                                return (
                                                    <>

                                                        {
                                                            ((image.userImage == undefined && image.Item_x0020_Cover == undefined || image.Item_x0020_Cover.Url == undefined)) &&

                                                            <div ui-draggable="true" title="{{image.Title}}" ng-repeat="image in AssignedToUsers"
                                                                className="text-center create title2  ng-binding ProirityAssignedUserPhoto" on-drop-success="dropSuccessHandler($event, $index, AssignedToUsers,'Assigned User',$data)" data-toggle="popover" data-trigger="hover"
                                                                ng-click="openTeamPage(image)">
                                                                {image.Suffix}
                                                            </div>
                                                        }
                                                    </>
                                                )
                                            })}

                                        </div>
                                        {AssignedToUser.length == 0 &&
                                            <span style={{ color: "#b1b0b0", paddingLeft: "8px" }}>
                                                Working
                                                Members
                                            </span>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-2 ">
                           
                                    <div ui-on-drop="onDropRemoveTeam($event,$data, taskUsers)">
                                        <img className='full_width'  ng-show="Item.Portfolio_x0020_Type=='Component'"  src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/icon_Dustbin.png" />
                                        {/* <img ng-show="Item.Portfolio_x0020_Type=='Service'" title="Drag user here to  remove user from team for this Network Activity." className="height80" ng-src="{{site_Url}}/SiteCollectionImages/ICONS/Service_Icons/icon_Dustbin-green.png" />
                            <img ng-show="Item.Portfolio_x0020_Type=='Events'" title="Drag user here to  remove user from team for this Network Activity." className="height80" ng-src="{{site_Url}}/SiteCollectionImages/ICONS/Event_Icons/icon_Dustbin-orange.png" /> */}
                                    </div>
                            
                            </div>

                            <div className='col'>
                            <TimeEntryPopup props={props.props.Items} />
                            </div>
                        </div>

                    </div >
                </div>
                <div className="col-sm-5"></div>
            </div>

            {/* ---------------------------------------------------TimeSheet --------------------------------------------------------------------------------------------------------------------------- */}

          
            
        </>

    )
}


export default TeamComposition;