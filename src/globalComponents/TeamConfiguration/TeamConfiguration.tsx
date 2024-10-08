import React from 'react';
import { TbTruckDelivery } from 'react-icons/tb';
import { Web } from "sp-pnp-js";
import Tooltip from '../Tooltip';
import { SlArrowRight, SlArrowLeft, SlArrowUp, SlArrowDown } from "react-icons/sl";
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import "react-datepicker/dist/react-datepicker-cssmodules.css";
export interface ITeamConfigurationProps {
    parentCallback: (dt: any) => void;
    ItemInfo: any;
    AllListId: any;
}

export interface ITeamConfigurationState {
    taskUsers: any;
    taskDetails: any;
    ResponsibleTeam: any;
    AssignedToUsers: any;
    TeamMemberUsers: any;
    updateDragState: boolean;
    datesInfo: any;
    UserAccordingDates: any;
    oldWorkingDaysInfo: any;
    TeamConfiguration: any;
    TeamUserExpended: boolean;
    pickerDate: any;
    startDate: any;
}

const dragItem: any = {};
let web: any;

export class TeamConfigurationCard extends React.Component<ITeamConfigurationProps, ITeamConfigurationState> {
    constructor(props: ITeamConfigurationProps) {
        super(props);
        this.state = {
            taskUsers: [],
            taskDetails: [],
            ResponsibleTeam: [],
            AssignedToUsers: [],
            TeamMemberUsers: [],
            updateDragState: false,
            datesInfo: [],
            UserAccordingDates: [],
            oldWorkingDaysInfo: [],
            TeamConfiguration: {},
            TeamUserExpended: true,
            pickerDate: null,
            startDate: null
        }
        this.loadData();

    }

    private async loadData() {
        await this.loadTaskUsers();
        try {
            if (Object.keys(this?.props?.ItemInfo)?.length > 0) {
                await this.GetTaskDetails();
            }
        } catch (error) {
            console.log()
        }
        await this.getDatesInfo()
        this.showComposition();
    }

    private AllUsers: any = [];
    private getDatesInfo() {
        let datesInfo: any = [];
        let currentDate:any = moment();
        let workingActionTest: any = [];
        let startdate: any;
        try {
            workingActionTest = JSON.parse(this?.state?.taskDetails?.WorkingAction)
        } catch (error) {
            console.log(error)
        }
        let workingAction: any
        if (workingActionTest?.length > 0) {
            workingActionTest?.map((info: any) => {
                if (info?.Title == 'WorkingDetails') {
                    workingAction = info?.InformationData;
                }
            })
        }
   
        let oldJson: any = []
        try {
            oldJson = JSON.parse(JSON.stringify(workingAction));
        } catch (error) {

        }
        let count = 0;

        while (datesInfo.length < 5) {
            let dateFullInfo: any = {};
            if (currentDate.day() !== 0 && currentDate.day() !== 6) {
                count++;
                if (count == 1) {
                    dateFullInfo.originalDate = currentDate.format('DD/MM/YYYY')
                    dateFullInfo.serverDate = moment(dateFullInfo?.originalDate, 'DD/MM/YYYY');
                    dateFullInfo.serverDate._d.setHours(0, 0, 0, 0)
                    dateFullInfo.displayDate = "Today"
                }
                else if (count == 2) {
                    dateFullInfo.originalDate = currentDate.format('DD/MM/YYYY')
                    dateFullInfo.serverDate = moment(dateFullInfo?.originalDate, 'DD/MM/YYYY');
                    dateFullInfo.serverDate._d.setHours(0, 0, 0, 0)
                    dateFullInfo.displayDate = "Tomorrow"

                }
                else {
                    dateFullInfo.originalDate = currentDate.format('DD/MM/YYYY')
                    dateFullInfo.serverDate = moment(dateFullInfo?.originalDate, 'DD/MM/YYYY');
                    dateFullInfo.serverDate._d.setHours(0, 0, 0, 0)
                    dateFullInfo.displayDate = currentDate.format('DD/MM/YYYY')
                }
                datesInfo.push(dateFullInfo);

                currentDate = currentDate.add(1, 'day');
            }
            else {
                currentDate = currentDate.add(1, 'day');
                count++;
            }

        }

        let pickupLastDate: any = new Date(datesInfo[datesInfo?.length - 1].serverDate);
        let customDateStore: any = []
        let CustomUserDate: any = []
        if (workingAction !== undefined) {
            customDateStore = workingAction.filter((pickupCustomDate: any) => {
                let useDate:any = moment(pickupCustomDate.WorkingDate, 'DD/MM/YYYY')
                let workingActionDate = new Date(useDate);
                return workingActionDate > pickupLastDate;
            });
        }
        if (customDateStore != undefined && customDateStore.length > 0) {
            customDateStore.map((custom: any) => {
                let dateFullInfo: any = {};

                dateFullInfo.serverDate = moment(custom?.WorkingDate, 'DD/MM/YYYY');
                dateFullInfo.serverDate._d.setHours(0, 0, 0, 0)
                dateFullInfo.originalDate = dateFullInfo?.serverDate?.format('DD/MM/YYYY')
                dateFullInfo.displayDate = dateFullInfo?.serverDate?.format('DD/MM/YYYY')
                CustomUserDate.push(dateFullInfo)
            })
        }
        datesInfo = datesInfo.concat(CustomUserDate)
        startdate = moment(currentDate).format('YYYY-MM-DD');
        if (oldJson != undefined || oldJson != null) {
            oldJson = oldJson.filter((oldDate: any) => {
                return !datesInfo.some((newDate: any) => oldDate.WorkingDate == newDate.originalDate);
            });
        }

        datesInfo?.map((dates: any) => {
            dates.userInformation = [];
            workingAction?.map((workActionData: any) => {
                workActionData.WorkingDate = moment(workActionData?.WorkingDate, 'DD/MM/YYYY');
                workActionData.WorkingDate._d.setHours(0, 0, 0, 0)
                if (workActionData?.WorkingDate?._d.getTime() == dates?.serverDate?._d.getTime()) {
                    this?.state?.taskUsers?.map((users: any) => {
                        users?.childs.map((userValue: any, index: any) => {
                            workActionData?.WorkingMember?.map((workingMember: any) => {
                                if (userValue?.AssingedToUser?.Id == workingMember.Id) {
                                    userValue.workingDateUser = dates?.originalDate;
                                    dates.userInformation.push({ ...userValue });
                                    //  users?.childs.splice(index,1)
                                }
                            })

                        })
                    })

                }
            })
        })
        datesInfo?.map((datesUser: any) => {
            this?.state?.taskUsers?.map((userRemove: any) => {
                userRemove?.childs?.map((childUser: any, index: any) => {
                    datesUser.userInformation.map((userDate: any) => {
                        if (userDate?.AssingedToUser?.Id == childUser?.AssingedToUser?.Id) {
                            userRemove?.childs.splice(index, 1);
                        }
                    })
                })
            })
        })

        this.setState({
            datesInfo: datesInfo,
            oldWorkingDaysInfo: oldJson,
            startDate: startdate,
            pickerDate: startdate
        })
    }



    private pickupCustomDate = (date: any) => {
        let previousMonth=new Date(this.state.pickerDate)
        let pickUpMonth=new Date(date);

  if(date!=""&& previousMonth.getMonth()== pickUpMonth.getMonth()){
    let pickupDateValue:any = moment(date);
        pickupDateValue._d.setHours(0, 0, 0, 0)
        let dateValue: any = {}
        let workingDaysValue = this.state.datesInfo
        let checkDuplicateDate = this.state.datesInfo.some((checkDate: any) => {
            return checkDate.serverDate?._d.getTime() == pickupDateValue?._d.getTime()
        })
        dateValue.originalDate = pickupDateValue.format('DD/MM/YYYY')
        dateValue.serverDate = moment(dateValue?.originalDate, 'DD/MM/YYYY');
        dateValue.serverDate._d.setHours(0, 0, 0, 0)
        dateValue.displayDate = pickupDateValue?.format('DD/MM/YYYY')
        dateValue.userInformation = []
        if (checkDuplicateDate != true) {
            workingDaysValue.push(dateValue)
            workingDaysValue.sort(function (a: any, b: any) {
                return new Date(a.serverDate).getTime() - new Date(b.serverDate).getTime();
            });
        }
        this.setState({
            pickerDate: date,
            datesInfo: workingDaysValue
        });
  } 
  else if(date!=""&& previousMonth.getMonth()!= pickUpMonth.getMonth()){
    this.setState({
        pickerDate: date, 
    })
  }
  else{
    this.setState({
        pickerDate: null,
      
    });
  }
        
    };

    private async loadTaskUsers() {
        if (this.props.ItemInfo.siteUrl != undefined) {
            web = new Web(this.props.ItemInfo.siteUrl);
        } else {
            web = new Web(this.props.AllListId?.siteUrl);
        }
        let results: any = [];

        let taskUsers: any = [];
        let dupAllUser: any;
        results = await web.lists
            .getById(this.props.AllListId?.TaskUserListID)
            .items
            .select('Id', 'IsActive', 'UserGroupId', 'Suffix', 'Title', 'Email', 'SortOrder', 'Role', 'Company', 'ParentID1', 'TaskStatusNotification', 'Status', 'Item_x0020_Cover', 'AssingedToUserId', 'isDeleted', 'AssingedToUser/Title', 'AssingedToUser/Id', 'AssingedToUser/EMail', 'ItemType')
            .filter('IsActive eq 1')
            .expand('AssingedToUser')
            .orderBy('SortOrder', true)
            .orderBy("Title", true)
            .get();

        let self = this;

        results.forEach(function (item: any) {
            if (item.ItemType != 'Group') {
                if (self.props.ItemInfo.Services != undefined && self.props.ItemInfo.Services.length > 0) {
                    if (item.Role != null && item.Role.length > 0) {
                        let FindServiceUser = item.Role.join(';').indexOf('Service Teams');
                        if (FindServiceUser > -1) {
                            self.AllUsers.push(item);
                        }
                    }
                } else {
                    self.AllUsers.push(item);
                }
            }
        })
        results.forEach(function (item: any) {
            if (item.UserGroupId == undefined) {
                self.getChilds(item, results);
                taskUsers.push(item);
            }
        });
        if (taskUsers != undefined && taskUsers.length > 0) {
            taskUsers?.map((Alluser: any) => {
                if (Alluser.childs != undefined && Alluser.childs.length > 0) {
                    Alluser.childs.map((ChildUser: any) => {
                        if (ChildUser.Item_x0020_Cover == null || ChildUser?.Item_x0020_Cover == undefined) {
                            // let tempObject: any = {
                            //     Description: 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg',
                            //     Url: 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg'
                            // }
                            // ChildUser.Item_x0020_Cover = tempObject;
                        }
                    })
                }
            })
        }

        console.log(taskUsers);
        this.setState({
            taskUsers
        })
    }
    private async GetTaskDetails() {
        try {
        if (this.props.ItemInfo.siteUrl != undefined) {
            web = new Web(this.props.ItemInfo.siteUrl);
        } else {
            web = new Web(this.props.AllListId?.siteUrl);
        }
        let taskDetails = [];
        if (this.props.ItemInfo.listId != undefined) {
            taskDetails = await web.lists
                .getById(this.props.ItemInfo.listId)
                .items
                .getById(this.props.ItemInfo.Id)
                .select("ID", "Title", "WorkingAction", "AssignedTo/Title", "AssignedTo/Id", "TeamMembers/Title", "TeamMembers/Id", "ResponsibleTeam/Title", "ResponsibleTeam/Id")
                .expand("TeamMembers", "AssignedTo", "ResponsibleTeam")
                .get()
        } else {
            taskDetails = await web.lists
                .getByTitle('Master Tasks')
                .items
                .getById(this.props.ItemInfo.Id)
                .select("ID", "Title", "AssignedTo/Title", "AssignedTo/Id", "TeamMembers/Title", "TeamMembers/Id", "ResponsibleTeam/Title", "ResponsibleTeam/Id")
                .expand("TeamMembers", "AssignedTo", "ResponsibleTeam")
                .get()
        }
        console.log('Task Details---');
        console.log(taskDetails);
        this.setState({ taskDetails })
        } catch (error) {
            console.log(error)
        }
    }
    private getChilds(item: any, items: any) {
        item.childs = [];
        for (let index = 0; index < items.length; index++) {
            let childItem = items[index];
            if (childItem.UserGroupId != undefined && parseInt(childItem.UserGroupId) == item.ID) {
                // if (this.props.ItemInfo?.Services != undefined && (this.props.ItemInfo?.Services.length > 0 || this.props?.ItemInfo?.Portfolio_x0020_Type == 'Service')) {
                //     if (childItem.Role != null && childItem.Role.length > 0 && childItem.Role.join(';').indexOf('Service Teams') > -1) {
                //         item.childs.push(childItem);
                //     }
                // } else {
                //     item.childs.push(childItem);
                // }
                item.childs.push(childItem);
                this.getChilds(childItem, items);
            }
        }
    }
    private ResponsibleTeam: any = [];
    private AssignedToUsers: any = [];
    private TeamMemberUsers: any = [];
    private NewTeamConfigurations: any = [];
    private showComposition() {
        let Item = this.state.taskDetails;
        let taskUsers = this.state.taskUsers;
        let self = this;

        if (Item.ResponsibleTeam != undefined) {
            if (self.ResponsibleTeam != undefined && self.ResponsibleTeam.length > 0) {
                let TeamLeaderData = self.getUsersWithImage(Item.ResponsibleTeam);
                TeamLeaderData.forEach(function (item: any) {
                    if (!self.isItemExists(self.ResponsibleTeam, item.Id)) {
                        self.ResponsibleTeam.push(item);
                    }
                });
            }
            else {
                self.ResponsibleTeam = self.getUsersWithImage(Item.ResponsibleTeam);
            }
            self.NewTeamConfigurations.push({ Title: 'Task Leader', childs: self.ResponsibleTeam });
        }
        console.log('Task Leader');
        console.log(this.NewTeamConfigurations);

        if (Item.TeamMembers != undefined) {
            if (self.TeamMemberUsers != undefined && self.TeamMemberUsers.length > 0) {
                let TeamMemberUsersData = self.getUsersWithImage(Item.TeamMembers);
                TeamMemberUsersData.forEach(function (item: any) {
                    if (!self.isItemExists(self.TeamMemberUsers, item.Id)) {
                        self.TeamMemberUsers.push(item);
                    }
                });
            }
            else {
                self.TeamMemberUsers = self.getUsersWithImage(Item.TeamMembers);
            }
            self.NewTeamConfigurations.push({ Title: 'Team Members', childs: self.TeamMemberUsers });
        }
        console.log('Task Leader,Team Members');
        console.log(this.NewTeamConfigurations);

        if (Item.AssignedTo != undefined) {
            if (self.AssignedToUsers != undefined && self.AssignedToUsers.length > 0) {
                let AssignedToUsersData = self.getUsersWithImage(Item.AssignedTo);
                AssignedToUsersData.forEach(function (item: any) {
                    if (!self.isItemExists(self.AssignedToUsers, item.Id)) {
                        self.AssignedToUsers.push(item);
                    }
                });
            }
            else {
                self.AssignedToUsers = self.getUsersWithImage(Item.AssignedTo);
            }
            self.AssignedToUsers = self.getUsersWithImage(Item.AssignedTo);
            //AssignedToUsersDetail = self.AssignedToUsers;
        }
        taskUsers.forEach(function (categoryUser: any) {
            for (var i = 0; i < categoryUser.childs.length; i++) {
                if (categoryUser.childs[i]?.Item_x0020_Cover != undefined) {
                    self.TeamMemberUsers.forEach(function (item: any) {
                        if (categoryUser.childs[i] != undefined && categoryUser.childs[i].AssingedToUserId != undefined && categoryUser.childs[i].AssingedToUserId == item.Id) {
                            categoryUser.childs.splice(i, 1);
                        }
                    });
                }
            }
        });
        taskUsers.forEach(function (categoryUser: any) {
            for (var i = 0; i < categoryUser.childs.length; i++) {
                if (categoryUser.childs[i]?.Item_x0020_Cover != undefined) {
                    self.AssignedToUsers.forEach(function (item: any) {
                        if (categoryUser.childs[i] != undefined && categoryUser.childs[i].AssingedToUserId != undefined && categoryUser.childs[i].AssingedToUserId == item.Id) {
                            categoryUser.childs.splice(i, 1);
                        }
                    });
                }
            }
        });
        taskUsers.forEach(function (categoryUser: any) {
            for (var i = 0; i < categoryUser.childs.length; i++) {
                if (categoryUser.childs[i]?.Item_x0020_Cover != undefined) {
                    self.ResponsibleTeam.forEach(function (item: any) {
                        if (categoryUser.childs[i] != undefined && categoryUser.childs[i].AssingedToUserId != undefined && categoryUser.childs[i].AssingedToUserId == item.Id) {
                            categoryUser.childs.splice(i, 1);
                        }
                    });
                }
            }
        });
        let AllTeamDetails = {
            Item1: { Title: 'Team Member', Childs: self.TeamMemberUsers },
            Item2: { Title: 'Working Member', Childs: self.AssignedToUsers },
            Item3: { Title: 'Team Leader', Childs: self.ResponsibleTeam }
        };

        console.log('Task Leader,Team Members', 'Task Leader', 'AllTeamDetails');
        console.log(AllTeamDetails);
        this.setState({
            taskUsers,
            TeamMemberUsers: self.TeamMemberUsers,
            AssignedToUsers: self.AssignedToUsers,
            ResponsibleTeam: self.ResponsibleTeam
        })
    }

    private isItemExists = function (arr: any, Id: any) {
        var isExists = false;
        arr?.forEach(function (item: any) {
            if (item.ID == Id) {
                isExists = true;
                return false;
            }
        });
        return isExists;
    }

    private getUsersWithImage(items: any) {
        let users: any = [];
        let self = this;
        for (let i = 0; i < self.AllUsers.length; i++) {
            //  angular.forEach(categoryUser.childs, function (child, ) {
            if (self.AllUsers[i]) {
                items.forEach(function (item: any) {
                    if (self.AllUsers[i] != undefined && self.AllUsers[i].AssingedToUserId != undefined && self.AllUsers[i].AssingedToUserId == item.Id) {
                        if (self.AllUsers[i]?.Item_x0020_Cover == undefined || self.AllUsers[i]?.Item_x0020_Cover == null) {
                            // self.AllUsers[i].Item_x0020_Cover = {}
                            // self.AllUsers[i].Item_x0020_Cover.Url = 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg'
                        }
                        item.userImage = self.AllUsers[i]?.Item_x0020_Cover?.Url
                        item.Title = self.AllUsers[i].Title;
                        item.Suffix = self.AllUsers[i].Suffix;
                        item.UserGroupId = self.AllUsers[i].UserGroupId;
                        item.ID = self.AllUsers[i].ID;
                        item.Company = self.AllUsers[i].Company;
                        item.AssingedToUserId = self.AllUsers[i].AssingedToUserId;
                        item.Role = self.AllUsers[i].Role;
                        item.AssingedToUser = self.AllUsers[i].AssingedToUser;

                        if (self.AllUsers[i]?.Item_x0020_Cover != undefined) {
                            item.Item_x0020_Cover = self.AllUsers[i]?.Item_x0020_Cover;
                        }
                        if (!self.isItemExists(users, item.Id)) {
                            users.push(item);
                        }
                    }
                });
            }
        }
        return users;
    }

    

    private dragStart = (e: any, position: any, user: any, team: any) => {
        dragItem.current = position;
        dragItem.user = user;
        dragItem.userType = team;
        console.log(dragItem);
    };

    private onDropRemoveTeam = (e: any, taskUsers: any) => {
        e.preventDefault();
        let $data = dragItem.user;
        let self = this;
        let isRemove = false;
        if (dragItem.userType == "UserWorkingDays") {
            // this?.state?.AssignedToUsers.map((assignedUsers:any,index:any)=>{
            //     if(assignedUsers?.AssingedToUser?.Id==dragItem?.user?.AssingedToUser?.Id){
            //         this.state.AssignedToUsers.splice(index,1)
            //     }
            // })
            this?.state?.datesInfo.map((dates: any) => {
                if (dates?.originalDate == dragItem?.user?.workingDateUser) {
                    dates?.userInformation.map((user: any, index: any) => {
                        if (user?.AssingedToUser?.Id == dragItem?.user?.AssingedToUser?.Id) {
                            dates.userInformation.splice(index, 1)
                        }
                    })
                }

            })
            let userExistsWorkingDates = this.state.datesInfo.some((item: any) =>
                item?.userInformation.some((user: any) =>
                    user?.AssingedToUser?.Id == dragItem?.user?.AssingedToUser?.Id
                )
            );
            let userExistsTeamMembers = this.state.TeamMemberUsers.some((user: any) => {
                if (user?.AssingedToUser?.Id == dragItem?.user?.AssingedToUser?.Id) {
                    return true;
                } else {
                    return false;
                }
            })
            let userExistsLeads = this.state.ResponsibleTeam.some((user: any) => {
                if (user?.AssingedToUser?.Id == dragItem?.user?.AssingedToUser?.Id) {
                    return true;
                } else {
                    return false;
                }
            })
            let userExistsAssignedUsers = this?.state?.AssignedToUsers?.some((user: any) => {
                if (user?.AssingedToUser?.Id == dragItem?.user?.AssingedToUser?.Id) {
                    return true;
                } else {
                    return false;
                }
            })
            if (userExistsWorkingDates != true && userExistsLeads != true && userExistsTeamMembers != true && userExistsAssignedUsers != true) {
                this.state.taskUsers.forEach((child: any) => {
                    if (child.ID === $data.UserGroupId) {
                        if (!self.isItemExists(child.childs, $data.Id)) {
                            child.childs.push($data);
                        }
                    }
                });
            }

        }
        else {
            if (dragItem.userType == "Assigned User") {
                this.state.datesInfo.map((item: any) => {
                    item?.userInformation.map((user: any, index: any) => {
                        if (user?.AssingedToUser?.Id == dragItem?.user?.AssingedToUser?.Id) {
                            item?.userInformation.splice(index, 1)
                        }
                    })
                })
            }
            if(dragItem.userType=='TeamMemberUsers'){
                this.state.TeamMemberUsers.some((user: any,index:any) => {
                    if (user?.AssingedToUser?.Id == dragItem?.user?.AssingedToUser?.Id){
                        this.state.TeamMemberUsers.splice(index,1)
                    } })}
     
            if(dragItem.userType=="ResponsibleTeam"){
                        this.state.ResponsibleTeam.some((user: any,index:any) => {
                            if (user?.AssingedToUser?.Id == dragItem?.user?.AssingedToUser?.Id){
                                this.state.ResponsibleTeam.splice(index,1)
                            }
                         })
            }
            let userExistsWorkingDates = this.state.datesInfo.some((item: any) =>
                item?.userInformation.some((user: any) =>
                    user?.AssingedToUser?.Id == dragItem?.user?.AssingedToUser?.Id
                )
            );
            let userExistsTeamMembers = this.state.TeamMemberUsers.some((user: any) => {
                if (user?.AssingedToUser?.Id == dragItem?.user?.AssingedToUser?.Id) {
                    return true;
                } else {
                    return false;
                }
            })
            let userExistsLeads = this.state.ResponsibleTeam.some((user: any) => {
                if (user?.AssingedToUser?.Id == dragItem?.user?.AssingedToUser?.Id) {
                    return true;
                } else {
                    return false;
                }
            })


            if (userExistsWorkingDates != true && userExistsLeads != true && userExistsTeamMembers != true ) {
                this.state.taskUsers.forEach(function (child: any) {
                    if (child.ID == $data.UserGroupId) {
                        if (!self.isItemExists(child.childs, $data.Id))
                            child.childs.push($data);
                    }
                })
            }
        }
        this.dropSuccessHandler(true, '');
    }

    private onDropTeam(e: any, array: any, Team: any, AllUser: any, userType: any) {
        if (dragItem.userType != userType) {
            let $data = dragItem.user;
            let self = this;
            array.forEach(function (user: any, indexParent: any) {
                if (user.Title == $data.Company && !self.isItemExists(array, $data.Id)) {

                    user.childs.push($data);
                }
            })
            if (!self.isItemExists(array, $data.Id)) {
                array.push($data);
            }
            if (Team != undefined) {
                AllUser.forEach(function (Group: any, index: any) {
                    if (Group.childs != undefined && Group.childs.length > 0) {
                        Group.childs.forEach(function (user: any, userindex: any) {
                            if ((user.AssingedToUserId != undefined && user.AssingedToUserId == $data.AssingedToUserId) || (user.Id != undefined && user.Id == $data.Id)) {
                                Group.childs.splice(userindex, 1);
                            }
                        })
                    }
                })
            }
            this.dropSuccessHandler(true, '');
        }
    }

    private onDropTeam1(e: any, array: any, Team: any, AllUser: any, userType: any) {
        if (dragItem.userType != userType) {
            let $data = dragItem.user;
            let self = this;
            array.forEach(function (user: any, indexParent: any) {
                if (user.Title == $data.Company && !self.isItemExists(array, $data.Id)) {
                    user.childs.push($data);
                }
            })
            if (Team != undefined) {
                AllUser.forEach(function (Group: any, index: any) {
                    if (Group.childs != undefined && Group.childs.length > 0) {
                        Group.childs.forEach(function (user: any, userindex: any) {
                            if ((user.AssingedToUserId != undefined && user.AssingedToUserId == $data.AssingedToUserId) || (user.Id != undefined && user.Id == $data.Id)) {
                                Group.childs.splice(userindex, 1);
                            }
                        })
                    }
                })
            }

            if (!self.isItemExists(array, $data.Id)) {
                array.push($data);
            }
            this.dropSuccessHandler(false, '');
        }
    }

    private onDropWorkingDays(e: any, date: any, groupAlluser: any, userType: any) {
        let dataUser = { ...dragItem.user };
        let draguserType = dragItem.userType;
        let dateLocationData = date;
        if (draguserType != userType) {
            groupAlluser?.map((group: any) => {
                group?.childs?.map((user: any, index: any) => {
                    if (user.AssingedToUser?.Id == dataUser?.AssingedToUser?.Id) {
                        user.workingDateUser = dateLocationData.originalDate
                        group.childs.splice(index, 1)
                    }
                })
            })
            this?.state?.datesInfo.map((dataDetail: any) => {
                if (dataDetail?.serverDate._d.getTime() == dateLocationData?.serverDate._d.getTime()) {
                    if (!this.isItemExists(dataDetail.userInformation, dataUser.ID)) {
                        dataUser.workingDateUser = dateLocationData?.originalDate;
                        dataDetail.userInformation.push(dataUser)
                    }
                }
            })
            if (!this.isItemExists(this.state.AssignedToUsers, dataUser.ID)) {
                dataUser.workingDateUser = dateLocationData?.originalDate;
                this.state.AssignedToUsers.push(dataUser)
            }
            this.dropSuccessHandler(true, userType);
        }
        else if (draguserType == userType) {
            this?.state?.datesInfo?.map((dataDetail: any) => {
                if (dataDetail?.serverDate._d.getTime() == dateLocationData?.serverDate._d.getTime()) {
                    if (!this.isItemExists(dataDetail.userInformation, dataUser.ID)) {
                        dataUser.workingDateUser = dataDetail?.originalDate
                        dataDetail.userInformation.push(dataUser)
                    }
                }
            })
            this.dropSuccessHandler(true, userType);
        }
    }
    private dropSuccessHandler(isRemove: any, dropLocation: any) {
        if (isRemove) {
            if (dropLocation != "UserWorkingDays" && dragItem.userType == 'TeamMemberUsers')
                this.state.TeamMemberUsers.splice(dragItem.current, 1);

            if (dropLocation != "UserWorkingDays" && dragItem.userType == 'ResponsibleTeam')
                this.state.ResponsibleTeam.splice(dragItem.current, 1);
        }
        if (dropLocation != "UserWorkingDays" && dragItem.userType == 'Assigned User')
            this.state.AssignedToUsers.splice(dragItem.current, 1);
        let TeamConfiguration = {
            dateInfo: this.state.datesInfo,
            oldWorkingDaysInfo: this.state.oldWorkingDaysInfo,
            TeamMemberUsers: this.state.TeamMemberUsers,
            ResponsibleTeam: this.state.ResponsibleTeam,
            AssignedTo: this.state.AssignedToUsers,
            isDrop: true,
            isDropRes: true
        }
        //set state of array element
        this.setState({
            updateDragState: true,
            TeamConfiguration
        }, () => this.props.parentCallback(this.state.TeamConfiguration))

    }

    public render(): React.ReactElement<ITeamConfigurationProps> {
        return (
            <>
                <div className="col">
                    <div className="col bg-ee px-1 border">
                        <div ng-if="teamUserExpanded" className="alignCenter justify-content-between align-items-center commonheader" ng-click="forCollapse()">
                            <span className='alignCenter'>
                                {this.state.TeamUserExpended ?
                                    <SlArrowDown onClick={() => this.setState({ TeamUserExpended: false })}></SlArrowDown>
                                    :
                                    <SlArrowRight onClick={() => this.setState({ TeamUserExpended: true })}></SlArrowRight>
                                }
                                <span className='mx-2'>
                                    Select Team Members
                                </span>
                            </span>
                            <span className='alignCenter'>
                                <a target="_blank " className="me-1 mt-2" href={`${this.props.AllListId?.siteUrl}/SitePages/TaskUser-Management.aspx`} data-interception="off">
                                    Task User Management
                                </a>
                                <Tooltip ComponentId="1745" />
                            </span>
                        </div>
                    </div>
                    {this.state.TeamUserExpended ?
                        <div className="border col p-2 border-top-0" ng-show="teamUserExpanded">
                            <div className="taskTeamBox">
                                {this.state.taskUsers != null && this.state.taskUsers.length > 0 && this.state.taskUsers.map((user: any, index: number) => {
                                    return <div ui-on-drop="onDropRemoveTeam($event,$data,taskUsers)" className="top-assign ng-scope">
                                        {user.childs.length > 0 &&
                                            <div ng-if="user.childs.length >0" className="team ng-scope">
                                                <label className="BdrBtm">
                                                    {user.Title}
                                                </label>
                                                <div className='d-flex'>
                                                    {user.childs.map((item: any, i: number) => {
                                                        return <div className="marginR41 ng-scope">
                                                            {item?.Item_x0020_Cover != undefined && item?.AssingedToUser != undefined ?
                                                                <span>
                                                                    <img
                                                                        className="ProirityAssignedUserPhoto"
                                                                        src={item?.Item_x0020_Cover?.Url}
                                                                        // style={{ backgroundImage: "url('" + item.Item_x0020_Cover.Url + "')", backgroundSize: "24px 24px" }}
                                                                        title={item.AssingedToUser.Title}
                                                                        draggable
                                                                        onDragStart={(e) => this.dragStart(e, i, item, 'All')}
                                                                        onDragOver={(e) => e.preventDefault()} />
                                                                </span>
                                                                : item.AssingedToUser != undefined ?
                                                                    <>
                                                                        <span draggable
                                                                            onDragStart={(e) => this.dragStart(e, i, item, 'All')}
                                                                            onDragOver={(e) => e.preventDefault()}
                                                                            title={item.Title} className='suffix_Usericon showSuffixIcon'>{item.Suffix}</span>
                                                                    </  > : ''
                                                            }
                                                        </div>
                                                    })}
                                                </div>
                                            </div>
                                        }
                                    </div>
                                })
                                }
                            </div>
                            {/* Comment test start */}
                            <div className="row ">
                                <div className="col-sm-7">
                                    <h6 className='mb-1'>Team Members</h6>
                                    <div className="d-flex pb-1 UserTimeTabGray" style={{ paddingTop: "3px" }}>
                                        <div className="col-sm-5 border-end p-0" >
                                            <div className="col"
                                                onDrop={(e) => this.onDropTeam(e, this.state.ResponsibleTeam, 'Team Leaders', this.state.taskUsers, 'ResponsibleTeam')}
                                                onDragOver={(e) => e.preventDefault()}>
                                                <div className="p-1">
                                                    <div data-placeholder="Team Leader" className='flex-wrap selectmember'>
                                                        {this.state.ResponsibleTeam != null && this.state.ResponsibleTeam.length > 0 && this.state.ResponsibleTeam.map((image: any, index: number) => {
                                                            {
                                                                return image?.Item_x0020_Cover != undefined && image?.AssingedToUser != undefined ? (
                                                                    <img
                                                                        className="ProirityAssignedUserPhoto"
                                                                        src={image?.userImage != null ? image.userImage : image?.Item_x0020_Cover?.Url}
                                                                        // style={{ backgroundImage: "url('" + (image.userImage != null ? image.userImage : image.Item_x0020_Cover.Url) + "')", backgroundSize: "24px 24px" }}
                                                                        title={image.Title} draggable
                                                                        onDragStart={(e) => this.dragStart(e, index, image, 'ResponsibleTeam')}
                                                                        onDragOver={(e) => e.preventDefault()}
                                                                    />) : (<span draggable
                                                                        onDragStart={(e) => this.dragStart(e, index, image, 'ResponsibleTeam')}
                                                                        onDragOver={(e) => e.preventDefault()}
                                                                        title={image.Title} className='suffix_Usericon showSuffixIcon'>{image.Suffix}</span>)
                                                            }

                                                            // 
                                                        })
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-7 ">
                                            <div className="col-sm-12"
                                                onDrop={(e) => this.onDropTeam(e, this.state.TeamMemberUsers, 'Team Members', this.state.taskUsers, 'TeamMemberUsers')}
                                                onDragOver={(e) => e.preventDefault()}>
                                                <div className="p-1">
                                                    <div data-placeholder="Responsible Team" className='flex-wrap selectmember'>
                                                        {this.state.TeamMemberUsers != null && this.state.TeamMemberUsers.length > 0 && this.state.TeamMemberUsers.map((image: any, index: number) => {
                                                            {
                                                                return image?.Item_x0020_Cover != undefined && image?.AssingedToUser != undefined ?
                                                                    (<img className="ProirityAssignedUserPhoto ms-1"
                                                                        // style={{ backgroundImage: "url('" + (image.userImage != null ? image.userImage : image.Item_x0020_Cover.Url) + "')", backgroundSize: "24px 24px" }}
                                                                        title={image.Title}
                                                                        src={image.userImage != null ? image?.userImage : image?.Item_x0020_Cover?.Url}
                                                                        draggable
                                                                        onDragStart={(e) => this.dragStart(e, index, image, 'TeamMemberUsers')}
                                                                        onDragOver={(e) => e.preventDefault()} />) :
                                                                    (<span draggable onDragStart={(e) => this.dragStart(e, index, image, 'TeamMemberUsers')}
                                                                        onDragOver={(e) => e.preventDefault()}
                                                                        title={image.Title} className='suffix_Usericon showSuffixIcon'>{image.Suffix}</span>)
                                                            }
                                                        })
                                                        }

                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>

                                <div className='col-sm-3'>
                                    <h6 className='mb-1'>Working Members</h6>
                                    {(this.props?.ItemInfo?.Item_x0020_Type !== "Project" && this.props?.ItemInfo?.Item_x0020_Type !== "Sprint") ?
                                        <div className="col"
                                        >
                                            <div className="d-flex  working-box" style={{ padding: "8px 0px 7px 0px" }} >
                                                <div className='flex-wrap' data-placeholder="Working Members">
                                                    {this.state.AssignedToUsers && this.state.AssignedToUsers.map((image: any, index: number) => {
                                                        {
                                                            return image?.Item_x0020_Cover != undefined && image?.AssingedToUser != undefined ? (<img
                                                                draggable onDragStart={(e) => this.dragStart(e, index, image, 'Assigned User')}
                                                                onDragOver={(e) => e.preventDefault()}
                                                                className="ProirityAssignedUserPhoto"
                                                                src={image.userImage != null ? image.userImage : image?.Item_x0020_Cover?.Url}
                                                                title={image.Title}
                                                            />) : (
                                                                <span
                                                                    draggable onDragStart={(e) => this.dragStart(e, index, image, 'Assigned User')}
                                                                    onDragOver={(e) => e.preventDefault()}
                                                                    title={image.Title} className='suffix_Usericon showSuffixIcon'>{image.Suffix}</span>
                                                            )
                                                        }


                                                    })
                                                    }
                                                </div>

                                            </div>

                                        </div>
                                        :
                                        <div className="col"
                                        onDrop={(e) => this.onDropTeam1(e, this.state.AssignedToUsers, 'Assigned User', this.state.taskUsers, 'Assigned User')}
                                        onDragOver={(e) => e.preventDefault()}
                                        >
                                            <div className="d-flex  working-box" style={{ padding: "8px 0px 7px 0px" }} >
                                                <div className='flex-wrap' data-placeholder="Working Members">
                                                    {this.state.AssignedToUsers && this.state.AssignedToUsers.map((image: any, index: number) => {
                                                        {
                                                            return image?.Item_x0020_Cover != undefined && image?.AssingedToUser != undefined ? (<img
                                                                draggable onDragStart={(e) => this.dragStart(e, index, image, 'Assigned User')}
                                                                onDragOver={(e) => e.preventDefault()}
                                                                className="ProirityAssignedUserPhoto"
                                                                src={image.userImage != null ? image.userImage : image?.Item_x0020_Cover?.Url}
                                                                title={image.Title}
                                                            />) : (
                                                                <span
                                                                    draggable onDragStart={(e) => this.dragStart(e, index, image, 'Assigned User')}
                                                                    onDragOver={(e) => e.preventDefault()}
                                                                    title={image.Title} className='suffix_Usericon showSuffixIcon'>{image.Suffix}</span>
                                                            )
                                                        }


                                                    })
                                                    }
                                                </div>

                                            </div>

                                        </div>

                                    }

                                </div>
                                <div className="col-sm-2">
                                    <div className="dustbin bg-siteColor" onDrop={(e) => this.onDropRemoveTeam(e, this.state.taskUsers)}
                                        onDragOver={(e) => e.preventDefault()}>
                                        <span className="light svg__iconbox svg__icon--palmTree" title="Drag user here to  remove user from team for this Network Activity."></span>
                                    </div>

                                </div>


                            </div>
                            {/* Coment test end */}
                            {/* Working days */}
                            {(this?.props?.ItemInfo?.Item_x0020_Type != "Project" && this?.props?.ItemInfo?.Item_x0020_Type != "Sprint") &&
                                <div className='mt-3'>
                                    <h6> Working Days</h6>
                                    <div className="team w-75">
                                        {
                                            this.state.datesInfo != null && this.state.datesInfo.length > 0 && this.state.datesInfo.map((date: any) => {
                                                return (
                                                    <div className="width20 top-assign pe-1" onDragOver={(e) => e.preventDefault()} onDrop={(e) => this.onDropWorkingDays(e, date, this.state.taskUsers, 'UserWorkingDays')}> <label className="BdrBtm mb-0">{date.displayDate}</label>
                                                        <div className='border p-1 w-100' style={{ minHeight: '34.6px' }}>
                                                            {date?.userInformation?.length > 0 && date?.userInformation?.map((userInfo: any, index: any) =>
                                                                <span className='me-1'>
                                                                    {userInfo?.Item_x0020_Cover != undefined && userInfo?.AssingedToUser != undefined ?
                                                                        <img
                                                                            className="ProirityAssignedUserPhoto"
                                                                            src={userInfo?.Item_x0020_Cover?.Url}
                                                                            // style={{ backgroundImage: "url('" + (image.userImage != null ? image.userImage : image.Item_x0020_Cover.Url) + "')", backgroundSize: "24px 24px" }}
                                                                            title={userInfo?.Title}
                                                                            draggable
                                                                            onDragStart={(e) => this.dragStart(e, index, userInfo, 'UserWorkingDays')}
                                                                            onDragOver={(e) => e.preventDefault()} />
                                                                        : <span draggable onDragStart={(e) => this.dragStart(e, index, userInfo, 'UserWorkingDays')}
                                                                            onDragOver={(e) => e.preventDefault()}
                                                                            title={userInfo.Title} className='suffix_Usericon showSuffixIcon'>{userInfo.Suffix}</span>}
                                                                </span>
                                                            )

                                                            }</div>
                                                    </div>

                                                )
                                            }
                                            )
                                        }

                                        <div className="width20 top-assign pe-1">
                                            <label className="BdrBtm mb-0">Select Date</label>
                                            <div className="input-group" >
                                                <input type="date" id="start" className="form-control" name="trip-start" value={this.state.pickerDate} min={this.state.startDate}
                                                    onChange={(e) => this.pickupCustomDate(e.target.value)}
                                                />
                                            </div>
                                        </div>


                                    </div>
                                </div>
                            }

                        </div>
                        : null}

                </div>
            </>
        );
    }
}
export default TeamConfigurationCard;