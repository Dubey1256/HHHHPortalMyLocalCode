import * as React from 'react';
import { Web } from "sp-pnp-js";
import { arraysEqual, Modal, Panel, PanelType } from 'office-ui-fabric-react';
// import { useExpanded, useFilters, usePagination, useSortBy, useTable } from 'react-table'
import "bootstrap/dist/css/bootstrap.min.css";
import FroalaCommentBox from '../../../globalComponents/FlorarComponents/FroalaCommentBoxComponent';
import "@pnp/sp/sputilities";

import { IEmailProperties } from "@pnp/sp/sputilities";

import { SPFI, spfi, SPFx as spSPFx } from "@pnp/sp";
import Tooltip from '../../../globalComponents/Tooltip';
import { FaAngleDown, FaAngleUp, FaPrint, FaFileExcel, FaPaintBrush, FaEdit, FaSearch, FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import GlobalCommanTable from '../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable';
import {
    ColumnDef,
} from "@tanstack/react-table";
//import { Button, Table, Row, Col, Pagination, PaginationLink, PaginationItem, Input } from "reactstrap";

import * as Moment from 'moment';
import { MdEmail } from "react-icons/Md";
import Loader from "react-loader";
var AllUsers: any = []
let smartmetaDetails: any = [];
var AllTasks: any = []
var TaskItemRank: any = []
var AllTime: any = []
var AllTimeMigration: any = []
var DevloperTime: any = 0.00;
var QATime: any = 0.00;
var DesignTime: any = 0.00;
var TotleTaskTime:any=0.00
var leaveUsers:any  = 0.00
var checkDate: any = ''
//var DevloperTime: any = 0
//var QATime: any = 0
var FeedBackItemArray: any = [];
var todayLeaveUsers:any=[]
//var DesignTime: any = 0
var TotalTime: any = 0
var CurrentUserId=''
var StartDatesss:any=''
var selectDatess:any=''
const TimeReport = (props:any) => {
   
    CurrentUserId = props.ContextData.Context.pageContext._legacyPageContext?.userId
    var OffshoreSitee = '&$filter=';
    var HealthSitee = '&$filter=';
    var GenderSitee = '&$filter=';
    var SharewebSitee = '&$filter=';
    var EISitee = '&$filter=';
    var EPSSitee = '&$filter=';
    var EducationSitee = '&$filter=';
    var DESitee = '&$filter=';
    var QASitee = '&$filter=';
    var GrueneSitee = '&$filter=';
    var HHHHSitee = '&$filter=';
    var KathaBeckSitee = '&$filter=';
    var MigrationSitee = '&$filter=';
    var ALAKDigitalSitee = '&$filter=';
    const [data, setData] = React.useState([])
    // const [checkDate, setcheckDate] = React.useState('')
    const [update, setUpdate] = React.useState(0)
    const [loaded, setLoaded] = React.useState(true);
    const [checkedCustom,setcheckedCustom] = React.useState(false )
    const [Editpopup, setEditpopup] = React.useState(false)
    var [selectdate, setSelectDate] = React.useState(undefined)
    const [checkedWS, setcheckedWS] = React.useState(true);
    const [checkedTask, setcheckedTask] = React.useState(false);
    const [defaultDate,setDefaultDate] = React.useState()
    const [post, setPost] = React.useState({ Title: '', ItemRank: '', Body: '' })
    
    React.useEffect(() => {
    var datteee = new Date()
    var MyYesterdayDate:any = Moment(datteee).add(-1, 'days').format()
    setDefaultDate(MyYesterdayDate)
    
        showProgressBar();
        GetTaskUsers();
        GetSmartmetadata();


    }, [])

    const GetTaskUsers = async () => {
        let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
        let taskUsers = [];
        taskUsers = await web.lists
            .getByTitle('Task Users')
            .items
            .select('Id,UserGroup/Id,UserGroup/Title,TimeCategory,Suffix,Title,Email,SortOrder,Role,IsShowTeamLeader,Company,ParentID1,Status,Item_x0020_Cover,AssingedToUserId,isDeleted,AssingedToUser/Title,AssingedToUser/Id,AssingedToUser/EMail,ItemType,Approver/Id,Approver/Title,Approver/Name')
            .expand('AssingedToUser,Approver,UserGroup')
            .top(4999)
            .get();
        AllUsers = taskUsers;


    }
    const GetSmartmetadata = async () => {
        var metadatItem: any = []
        let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
        metadatItem = await web.lists
            .getById('01a34938-8c7e-4ea6-a003-cee649e8c67a')
            .items
            .select('Id', 'Title', 'IsVisible', 'ParentID', 'SmartSuggestions', 'TaxType', 'Description1', 'Item_x005F_x0020_Cover', 'listId', 'siteName', 'siteUrl', 'SortOrder', 'SmartFilters', 'Selectable', 'Parent/Id', 'Parent/Title')
            .top(4999)
            .filter("TaxType eq 'Sites'")
            .expand('Parent')
            .get()

        console.log(metadatItem);
        metadatItem?.forEach((config: any) => {
            if (config.Title != 'Health' && config.Title != 'Gender' && config.Title != 'Foundation' && config.Title != 'Small Projects' && config.Title != 'Master Tasks' && config.Title != 'SDC Sites') {
                smartmetaDetails.push(config)
            }
        })
        LoadAllSiteTasks();

    }
    TaskItemRank.push([{ rankTitle: 'Select Item Rank', rank: null }, { rankTitle: '(8) Top Highlights', rank: 8 }, { rankTitle: '(7) Featured Item', rank: 7 }, { rankTitle: '(6) Key Item', rank: 6 }, { rankTitle: '(5) Relevant Item', rank: 5 }, { rankTitle: '(4) Background Item', rank: 4 }, { rankTitle: '(2) to be verified', rank: 2 }, { rankTitle: '(1) Archive', rank: 1 }, { rankTitle: '(0) No Show', rank: 0 }]);

    const LoadAllSiteTasks = async () => {
        var Counter = 0;
        let web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/SP');
     
        const requests = smartmetaDetails.map((listID: any) => web.lists
            .getById(listID?.listId)
            .items
            .select("ParentTask/Title", "ParentTask/Id", "Services/Title", "ClientTime", "Services/Id", "Events/Id", "Events/Title", "ItemRank", "Portfolio_x0020_Type", "SiteCompositionSettings", "SharewebTaskLevel1No", "SharewebTaskLevel2No",
                "TimeSpent", "BasicImageInfo", "OffshoreComments", "OffshoreImageUrl", "CompletedDate", "Shareweb_x0020_ID", "Responsible_x0020_Team/Id", "Responsible_x0020_Team/Title",
                "SharewebCategories/Id", "SharewebCategories/Title", "ParentTask/Shareweb_x0020_ID",
                "SharewebTaskType/Id", "SharewebTaskType/Title", "SharewebTaskType/Level", "Priority_x0020_Rank", "Team_x0020_Members/Title", "Team_x0020_Members/Name", "Component/Id", "Component/Title", "Component/ItemType", "Team_x0020_Members/Id", "component_x0020_link", "IsTodaysTask", "AssignedTo/Title", "AssignedTo/Name", "AssignedTo/Id", "ClientCategory/Id", "ClientCategory/Title", "FileLeafRef", "FeedBack", "Title", "Id", "ID", "PercentComplete", "StartDate", "DueDate", "Comments", "Categories", "Status", "Body", "Mileage", "PercentComplete", "ClientCategory", "Priority", "Created", "Modified", "Author/Id", "Author/Title", "Editor/Id", "Editor/Title")
            .expand("ParentTask", "Events", "Services", "SharewebTaskType", "AssignedTo", "Component", "ClientCategory", "Author", "Editor", "Team_x0020_Members", "Responsible_x0020_Team", "SharewebCategories")
            .getAll()
        );

        try {
            const responses = await Promise.all(requests);
            responses.forEach((item: any) => {
                item?.forEach((val: any) => {
                    AllTasks.push(val)
                })

            })
            AllTasks.forEach((result: any) => {
                result.isDrafted = false;
                result.flag = true;
                result.TitleNew = result.Title;
                result.siteUrl = 'https://hhhhteams.sharepoint.com/sites/HHHH/SP';
                result.TaskTime = []
                result.TimeSpent = 0
                result.Components = ''
                result.SubComponents = ''
                result.Features = ''
                result.userName = ''
                result.TeamLeaderUser = []
                result.AllTeamName = result.AllTeamName === undefined ? '' : result.AllTeamName;
                result.PercentComplete = (result.PercentComplete * 100).toFixed(0);
                result.chekbox = false;
                result.DueDate = Moment(result.DueDate).format('DD/MM/YYYY')

                if (result.DueDate == 'Invalid date' || '') {
                    result.DueDate = result.DueDate.replaceAll("Invalid date", "")
                }




            })
            selectType('Yesterday')
        } catch (error) {
            console.error(error);
        }

    }
    var showProgressBar = () => {
        setLoaded(false);
        $(" #SpfxProgressbar").show();
      };
    
      var showProgressHide = () => {
        setLoaded(true);
        $(" #SpfxProgressbar").hide();
      };
    const GetMigrationTime = async () => {
        var selectedDate:any=[]
        var filteres = `Modified ge '${datess}'`
        var query = "Id,Title,TaskDate,AdditionalTimeEntry,Created,Modified,TaskTime,Modified,SortOrder,AdditionalTimeEntry,Category/Id,Category/Title,TimesheetTitle/Id,TimesheetTitle/Title,TaskALAKDigital/Id,TaskALAKDigital/Title,TaskMigration/Id,TaskMigration/Title&$expand= Category,TimesheetTitle,TaskMigration,TaskALAKDigital&$top=4999&$filter=" + filteres + ""
        await $.ajax({
            url: "https://hhhhteams.sharepoint.com/sites/HHHH/SP/_api/web/lists/getbyTitle('TasksTimesheet2')/items?$select=" + query + "",
            method: "GET",
            async: false,
            headers: {
                "accept": "application/json;odata=verbose",
                "content-Type": "application/json;odata=verbose"
            },
            success: function (data) {

                selectedDate = data.d.results;
                selectedDate?.forEach((time: any) => {
                    if (time.AdditionalTimeEntry != null && time.AdditionalTimeEntry != undefined) {
                        time.AdditionalTime = JSON.parse(time.AdditionalTimeEntry)
                        AllTime.push(time)
                    }
                })


            },
            error: function (data) {

            }
        })


    }

    var datess = ''
    var TodayDate =''
    const GeneratedTask = async () => {
        leaveUsers =0.00
         DevloperTime = 0.00;
         QATime = 0.00;
         DesignTime = 0.00;
         TotleTaskTime = 0.00
         if(selectDatess == ''){
            selectDatess = 'Custom'
         }
        
        if (selectDatess == "Yesterday") {
            var datteee = new Date()
            var MyYesterdayDate:any = Moment(datteee).add(-1, 'days').format()
            setDefaultDate(MyYesterdayDate)
            var Datenew = Moment(MyYesterdayDate).format("DD/MM/YYYY")
            var myDate = new Date()
            var final: any = (Moment(myDate).add(-2, 'days').format())
        }
        if(selectDatess == 'Today'){
            var dat:any = new Date()
            setcheckedCustom(false)
            setDefaultDate(dat)
            var myDate = new Date()
            var Datenew = Moment(myDate).format("DD/MM/YYYY")
          
            setSelectDate(myDate)
            var final: any = (Moment(myDate).add(-1, 'days').format())
           
        }
        if(selectDatess == 'Custom') {
            setcheckedWS(false)
            setcheckedTask(false)
            setcheckedCustom(true)
            var myDate = new Date(selectdate)
            var Datenew = Moment(selectdate).format("DD/MM/YYYY")
         
            var final: any = (Moment(myDate).add(-1, 'days').format())
        }
         
        datess = new Date(final).toISOString()
        var ccc: any = []
        var selectedDate: any = []
        AllTime=[]

        var filteres = `Modified ge '${datess}'`
        var query = "Id,Title,TaskDate,TaskTime,AdditionalTimeEntry,Modified,Description,TaskOffshoreTasks/Id,TaskOffshoreTasks/Title,Author/Id,AuthorId,Author/Title,TaskKathaBeck/Id,TaskKathaBeck/Title,TaskDE/Title,TaskDE/Id,TaskEI/Title,TaskEI/Id,TaskEPS/Title,TaskEPS/Id,TaskEducation/Title,TaskEducation/Id,TaskHHHH/Title,TaskHHHH/Id,TaskQA/Title,TaskQA/Id,TaskGender/Title,TaskGender/Id,TaskShareweb/Title,TaskShareweb/Id,TaskGruene/Title,TaskGruene/Id&$expand=Author,TaskKathaBeck,TaskDE,TaskEI,TaskEPS,TaskEducation,TaskGender,TaskQA,TaskDE,TaskShareweb,TaskHHHH,TaskGruene,TaskOffshoreTasks&$top=4999&$filter=" + filteres + ""
        await $.ajax({
            url: "https://hhhhteams.sharepoint.com/sites/HHHH/SP/_api/web/lists/getbyTitle('TaskTimeSheetListNew')/items?$select=" + query + "",
            method: "GET",
            async: false,
            headers: {
                "accept": "application/json;odata=verbose",
                "content-Type": "application/json;odata=verbose"
            },
            success: async function (data) {
        
               selectedDate = data.d.results;
                await GetMigrationTime()
                selectedDate?.forEach((time: any) => {
                    if (time.AdditionalTimeEntry != null && time.AdditionalTimeEntry != undefined) {
                        time.AdditionalTime = JSON.parse(time.AdditionalTimeEntry)
                        AllTime.push(time)
                    }
                })
                
                makefinalTask(AllTime);


            },
            error: function (data) {

            }
        })




    }
    const GetleaveUser=async(selectDate:any)=>{
        var myData:any=[]
        var leaveUser:any=[]
        todayLeaveUsers=[]
        let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");

        myData = await web.lists
            .getById('72ABA576-5272-4E30-B332-25D7E594AAA4')
            .items
            .select("RecurrenceData,Duration,Author/Title,Editor/Title,Category,Description,ID,EndDate,EventDate,Location,Title,fAllDayEvent,EventType,UID,fRecurrence,Event_x002d_Type,Employee/Id")
            .top(499)
            .expand("Author,Editor,Employee")
            .getAll()
            console.log(myData);
           
            myData?.forEach((val:any)=>{
              
                    // var TodayDate:any = new Date()
                    // TodayDate =  Moment(TodayDate).format("DD/MM/YYYY")
                   //var TodayDate =  selectDate.split("/")
                   var a = val.EndDate.substring(0, 10)
                   var TodayDate =  selectDate[2] + selectDate[1] + selectDate[0]
                    var endDate = Moment(a).format("DD/MM/YYYY")
                    var eventDate = Moment(val.EventDate).format("DD/MM/YYYY")

                    var NewEndDate = endDate.split("/")
                    var NewEventDate = eventDate.split("/")

                     var End = NewEndDate[2]  + NewEndDate[1] + NewEndDate[0]
                     var start = NewEventDate[2] + NewEventDate[1] + NewEventDate[0]


                     if (TodayDate >= start && TodayDate <= End){
                        console.log(val)
                        leaveUser.push(val)
    
                    }
                
               
            })
            console.log(leaveUser)
            leaveUser?.forEach((val:any)=>{
                var users:any={}
                AllUsers?.forEach((item:any)=>{
                    if(val?.Employee?.Id == item?.AssingedToUserId){
                        users['userName'] = item.Title
                        users['Components'] = ''
                        users['SubComponents'] = ''
                        users['Features'] = ''
                        users['Department'] = item.TimeCategory
                        users['Effort'] = 8
                        users['Task'] = 'Leave'
                        users['Comments'] = 'Leave'
                        users['ClientCategory'] = 'Leave'
                        users['siteType'] = ''
                        users['Date'] = ''
                        users['Status'] = ''
                        todayLeaveUsers.push(users)
                    }
                })
            })
            console.log(todayLeaveUsers)
            if(todayLeaveUsers != undefined && todayLeaveUsers.length>0){
                 leaveUsers = todayLeaveUsers.length * 8
            }
           
    }
    const compareDates = (selectedworkingDate: any) => {
        var flag = false;
        if (selectdate != undefined) {
            var myDate = new Date(selectdate)
            var Datenew = Moment(myDate).format("DD/MM/YYYY")
            //setcheckedCustom(true)
        }
        else {
            var myDate = new Date()
            var final: any = (Moment(myDate).add(-1, 'days').format())
            var Datenew = Moment(final).format("DD/MM/YYYY")
        }
      

        StartDatesss = Datenew.split("/");
        var selectedStartDate = StartDatesss[2] + '/' + StartDatesss[1] + '/' + StartDatesss[0];
        if (selectedStartDate == selectedworkingDate)
            flag = true;
        return flag;
    }
    const makefinalTask = async (AllTime: any) => {
        var SelectedTime: any = []
        AllTime?.forEach((task: any) => {
            task.AdditionalTime?.forEach((timeSpent: any) => {

                if (timeSpent.TaskDate != undefined) {

                    var workingDates = timeSpent.TaskDate.split("/");
                    var selectedworkingDate = workingDates[2] + '/' + workingDates[1] + '/' + workingDates[0];
                    var workingDateTime = workingDates[0] + '-' + workingDates[1] + '-' + workingDates[2];
                    var isCompareDateflag = compareDates(selectedworkingDate);
                    if (isCompareDateflag) {
                        var sheetDetails: any = {};
                        sheetDetails.Date = workingDateTime;

                        if (task.TaskDE != undefined && task.TaskDE.Id != undefined) {
                            sheetDetails.Task = task.TaskDE.Title; // == undefined ? (task.Title == undefined ? '' : task.Title)  : task.TaskDE.Title;
                            sheetDetails.TaskId = task.TaskDE.Id;
                            DESitee += '(Id eq ' + task.TaskDE.Id + ') or';
                            sheetDetails.siteType = 'DE'
                        }
                        if (task.TaskEI != undefined && task.TaskEI.Id != undefined) {
                            sheetDetails.Task = task.TaskEI.Title; // == undefined ? (task.Title == undefined ? '' : task.Title)  : task.TaskEI.Title;
                            sheetDetails.TaskId = task.TaskEI.Id;
                            EISitee += '(Id eq ' + task.TaskEI.Id + ') or';
                            sheetDetails.siteType = 'EI'
                        }
                        if (task.TaskEPS != undefined && task.TaskEPS.Id != undefined) {
                            sheetDetails.Task = task.TaskEPS.Title; // == undefined ? (task.Title == undefined ? '' : task.Title)  : task.TaskEP.Title;
                            sheetDetails.TaskId = task.TaskEPS.Id;
                            EPSSitee += '(Id eq ' + task.TaskEPS.Id + ') or';
                            sheetDetails.siteType = 'EPS'
                        }
                        if (task.TaskEducation != undefined && task.TaskEducation.Id != undefined) {
                            sheetDetails.Task = task.TaskEducation.Title; // == undefined ? (task.Title == undefined ? '' : task.Title)  : task.TaskEducation.Title;
                            sheetDetails.TaskId = task.TaskEducation.Id;
                            EducationSitee += '(Id eq ' + task.TaskEducation.Id + ') or';
                            sheetDetails.siteType = 'Education'
                        }
                        if (task.TaskHHHH != undefined && task.TaskHHHH.Id != undefined) {
                            sheetDetails.Task = task.TaskHHHH.Title; // == undefined ? (task.Title == undefined ? '' : task.Title) : task.TaskHHHH.Title;
                            sheetDetails.TaskId = task.TaskHHHH.Id;
                            HHHHSitee += '(Id eq ' + task.TaskHHHH.Id + ') or';
                            sheetDetails.siteType = 'HHHH'
                        }
                        if (task.TaskQA != undefined && task.TaskQA.Id != undefined) {
                            sheetDetails.Task = task.TaskQA.Title; // == undefined ? (task.Title == undefined ? '' : task.Title)  : task.TaskQA.Title;
                            sheetDetails.TaskId = task.TaskQA.Id;
                            QASitee += '(Id eq ' + task.TaskQA.Id + ') or';
                            sheetDetails.siteType = 'QA'
                        }
                        if (task.TaskGender != undefined && task.TaskGender.Id != undefined) {
                            sheetDetails.Task = task.TaskGender.Title; // == undefined ? (task.Title == undefined ? '' : task.Title)  : task.TaskGender.Title;
                            sheetDetails.TaskId = task.TaskGender.Id;
                            GenderSitee += '(Id eq ' + task.TaskGender.Id + ') or';
                            sheetDetails.siteType = 'Gender'
                        }
                        if (task.TaskShareweb != undefined && task.TaskShareweb.Id != undefined) {
                            sheetDetails.Task = task.TaskShareweb.Title; // == undefined ? (task.Title == undefined ? '' : task.Title)  : task.TaskShareweb.Title;
                            sheetDetails.TaskId = task.TaskShareweb.Id;
                            SharewebSitee += '(Id eq ' + task.TaskShareweb.Id + ') or';
                            sheetDetails.siteType = 'Shareweb'
                        }
                        if (task.TaskGruene != undefined && task.TaskGruene.Id != undefined) {
                            sheetDetails.Task = task.TaskGruene.Title; // == undefined ? (task.Title == undefined ? '' : task.Title)  : task.TaskGruene.Title;
                            sheetDetails.TaskId = task.TaskGruene.Id;
                            GrueneSitee += '(Id eq ' + task.TaskGruene.Id + ') or';
                            sheetDetails.siteType = 'Gruene'
                        }
                        if (task.TaskOffshoreTasks != undefined && task.TaskOffshoreTasks.Id != undefined) {
                            sheetDetails.Task = task.TaskOffshoreTasks.Title; // == undefined ? (task.Title == undefined ? '' : task.Title)  : task.TaskOffshoreTasks.Title;
                            sheetDetails.TaskId = task.TaskOffshoreTasks.Id;
                            OffshoreSitee += '(Id eq ' + task.TaskOffshoreTasks.Id + ') or';
                            sheetDetails.siteType = 'Offshore Tasks'
                        }
                        if (task.TaskHealth != undefined && task.TaskHealth.Id != undefined) {
                            sheetDetails.Task = task.TaskHealth.Title;
                            sheetDetails.TaskId = task.TaskHealth.Id;
                            HealthSitee += '(Id eq ' + task.TaskHealth.Id + ') or';
                            sheetDetails.siteType = 'Health'
                        }
                        if (task.TaskKathaBeck != undefined && task.TaskKathaBeck.Id != undefined) {
                            sheetDetails.Task = task.TaskKathaBeck.Title;
                            sheetDetails.TaskId = task.TaskKathaBeck.Id;
                            KathaBeckSitee += '(Id eq ' + task.TaskKathaBeck.Id + ') or';
                            sheetDetails.siteType = 'KathaBeck'
                        }
                        if (task.TaskMigration != undefined && task.TaskMigration.Id != undefined) {
                            sheetDetails.Task = task.TaskMigration.Title;
                            sheetDetails.TaskId = task.TaskMigration.Id;
                            MigrationSitee += '(Id eq ' + task.TaskMigration.Id + ') or';
                            sheetDetails.siteType = 'Migration'
                        }
                        if (task.TaskALAKDigital != undefined && task.TaskALAKDigital.Id != undefined) {
                            sheetDetails.Task = task.TaskALAKDigital.Title;
                            sheetDetails.TaskId = task.TaskALAKDigital.Id;
                            ALAKDigitalSitee += '(Id eq ' + task.TaskALAKDigital.Id + ') or';
                            sheetDetails.siteType = 'ALAKDigital'
                        }
                        var Devsheets = [];
                        sheetDetails.Effort = 0.00;
                        sheetDetails.Effort = parseFloat(timeSpent.TaskTime);
                        sheetDetails.Comments = timeSpent.Description;
                        sheetDetails.userName = timeSpent.AuthorName;
                        sheetDetails.AuthorId = timeSpent.AuthorId;

                    }
                    if (sheetDetails != undefined) {
                        SelectedTime.push(sheetDetails)
                    }

                }
            })

        })
        selectDatess = ''
        await GetleaveUser(StartDatesss)
        finalTask(SelectedTime)

    }
    const finalTask = (SelectedTime: any) => {
        var MyData: any = []
        AllUsers?.forEach((val: any) => {
            SelectedTime?.forEach((item: any) => {
                item.Company = 'Smalsus'
                if (item.AuthorId == val.AssingedToUserId) {
                    // item.Department = val.TimeCategory
                    // item.Company = val.Company

                    if (val.UserGroup.Title == 'Senior Developer Team' || val.UserGroup.Title == 'Smalsus Lead Team' || val.UserGroup.Title == 'External Staff' )

                    item.Department = 'Developer';

                if (val.UserGroup.Title == 'Junior Developer Team')

                item.Department = 'Junior Developer';

                if (val.UserGroup.Title == 'Design Team')

                item.Department = 'Design';

                if (val.UserGroup.Title == 'QA Team')

                item.Department = 'QA';

                }
            })

        })
        AllTasks?.forEach((task: any) => {
            SelectedTime?.forEach((item: any) => {

                if (item.TaskId === task.Id && item.Task === task.Title && item.Company == 'Smalsus') {


                    if (task?.Component[0]?.ItemType == 'Component') {
                        item.Components = task.Component[0].Title
                        item.siteUrl = task.siteUrl
                        item.siteType = item.siteType
                        item.PercentComplete = task.PercentComplete
                        item.Status = task.Status
                        item.Title = task.Title
                        item.Priority_x0020_Rank = task.Priority_x0020_Rank
                        task?.ClientCategory?.forEach((cat:any)=>{
                            item.ClientCategory = cat.Title;
                        })
                    }
                    if (task?.Component.length == 0) {
                        item.siteUrl = task.siteUrl
                        item.siteType = item.siteType
                        item.PercentComplete = task.PercentComplete
                        item.Status = task.Status
                        item.Title = task.Title
                        item.Priority_x0020_Rank = task.Priority_x0020_Rank
                        task?.ClientCategory?.forEach((cat:any)=>{
                            item.ClientCategory = cat.Title;
                        })
                    }
                    if (task?.Component[0]?.ItemType == 'SubComponent') {
                        item.SubComponents = task.Component[0].Title
                        item.siteUrl = task.siteUrl
                        item.siteType = item.siteType
                        item.PercentComplete = task.PercentComplete
                        item.Status = task.Status
                        item.Title = task.Title
                        item.Priority_x0020_Rank = task.Priority_x0020_Rank
                        task?.ClientCategory?.forEach((cat:any)=>{
                            item.ClientCategory = cat.Title;
                        })
                    }
                    if (task?.Component[0]?.ItemType == 'Feature') {
                        item.Features = task.Component[0].Title
                        item.siteUrl = task.siteUrl
                        item.siteType = item.siteType
                        item.PercentComplete = task.PercentComplete
                        item.Status = task.Status
                        item.Title = task.Title
                        item.Priority_x0020_Rank = task.Priority_x0020_Rank
                        task?.ClientCategory?.forEach((cat:any)=>{
                            item.ClientCategory = cat.Title;
                        })
                    }
                   

                }


            })
           
        })
        // const finalData = MyData.filter((val: any, TaskId: any, array: any) => {
        //         return array.indexOf(val) == TaskId;
        //      })
        if (SelectedTime != undefined) {
            SelectedTime.forEach((time: any) => {
                if (time?.Department == 'Developer' || time?.Department == 'Junior Developer') {
                    DevloperTime = DevloperTime + parseFloat(time.Effort)
                }

                if (time?.Department == 'Design') {
                    DesignTime = DesignTime + parseFloat(time.Effort)
                }
                if (time?.Department == 'QA') {
                    QATime = QATime + parseFloat(time.Effort)
                }

            })
            TotleTaskTime = QATime + DevloperTime + DesignTime
        }
        todayLeaveUsers?.forEach((items:any)=>{
            SelectedTime.push(items)
        })
        setData(SelectedTime)
        showProgressHide();
    }

    const selectType = (Dates: any) => {
        selectDatess = Dates;
        if (Dates == 'Today') {
            setcheckedWS(false)
            setcheckedCustom(false)
            selectdate = undefined
            setcheckedTask(true)
            var Yesterday: any = new window.Date();
            setSelectDate(Yesterday)
            var a = Yesterday.getDate() - 1;
            var Datene = Moment(Yesterday).subtract(1, 'day')
            var Datenew = Moment().format("DDMMYYYY")
            checkDate = Datenew;
          
        }
        if (Dates == 'Yesterday') {
            setcheckedWS(true)
            setcheckedTask(false)
            setcheckedCustom(false)
            selectdate = undefined
            var Yesterday: any = new window.Date();
            var a = Yesterday.getDate() - 1;
            var Datene = Moment(Yesterday).subtract(1, 'day')
            var Datenew = Moment(Datene).format("DD-MM-YYYY")
            var Daten = Moment(Datene).format("DD/MM/YYYY")
            checkDate = Datenew;
            GeneratedTask();
        }
       
        if (Dates == 'Custom') {
            setcheckedWS(false)
            setcheckedTask(false)
            setcheckedCustom(true)
           
        }




    }

    const column = React.useMemo<ColumnDef<any, unknown>[]>(
        () => [
            {

                accessorFn: (row) => row?.Task,
                cell: ({ row, getValue }) => (
                    <>
                        <a data-interception="off" target="_blank" className="hreflink serviceColor_Active"
                            href={"https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Task-Profile.aspx?taskId=" + row?.original?.TaskId + '&Site=' + row?.original?.siteType}
                        >
                            {getValue()}
                        </a>

                    </>
                ),
                id: 'Task',
                header: '',
                placeholder: "Task",
               
 

            },
            {
                cell: ({ row, getValue }) => (
                    <>
                        <a data-interception="off" target="_blank" className="hreflink serviceColor_Active"
                            href={"https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=" + row?.original?.TaskId}
                        >
                            {getValue()}
                        </a>

                    </>
                ),
                id: 'Components',
                header: '',
                accessorFn: (row) => row?.Components,
                placeholder: "Components",
                size: 155,


            },
            {
                id: 'SubComponents',
                header: '',
                accessorFn: (row) => row?.SubComponents,
                placeholder: "SubComponents",
                size: 135,
                cell: ({ row, getValue }) => (
                    <>
                        <a data-interception="off" target="_blank" className="hreflink serviceColor_Active"
                            href={"https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=" + row?.original?.TaskId}
                        >
                            {getValue()}
                        </a>

                    </>
                ),

            },
            {
                cell: ({ row, getValue }) => (
                    <>
                        <a data-interception="off" target="_blank" className="hreflink serviceColor_Active"
                            href={"https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=" + row?.original?.TaskId}
                        >
                            {getValue()}
                        </a>

                    </>
                ),
                id: 'Features',
                header: '',
                accessorFn: (row) => row?.Features,
                placeholder: "Features",
                size: 250,

            },
            {
                header: '',
                accessorKey: 'Effort',
                placeholder: "Effort",
                size: 60,


            },
            {
                header: '',
                accessorKey: 'siteType',
                placeholder: "Sites",
                size: 110,


            },
            {
                header: '',
                accessorKey: 'PercentComplete',
                placeholder: "PercentComplete",
                size: 42,

            },
            {
                header: '',
                accessorKey: 'Status',
                placeholder: "Status",
                size: 120,

            },
            {
                header: '',
                accessorKey: 'userName',
                placeholder: "userName",
                size: 130,

            },
            {
                header: '',
                accessorKey: 'Department',
                placeholder: "Designation",
                size: 120,

            },
            {
                header: '',
                accessorKey: 'ClientCategory',
                placeholder: "ClientCategory",
                size: 160,

            },

        ],
        [data]
    );
    // const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    //     // Rank the item
    //     // const itemRank = rankItem(row.getValue(columnId), value)

    //     // Store the itemRank info
    //     addMeta({
    //         itemRank,
    //     })

    //     // Return if the item should be filtered in/out
    //     return itemRank.passed
    // }
    // const table = useReactTable({
    //     data,
    //     columns,

    //     state: {
    //         columnFilters,
    //         globalFilter,
    //     },
    //     onColumnFiltersChange: setColumnFilters,
    //     // onGlobalFilterChange: setGlobalFilter,
    //     getCoreRowModel: getCoreRowModel(),

    //     getFilteredRowModel: getFilteredRowModel(),
    //     getSortedRowModel: getSortedRowModel(),
    //     // getPaginationRowModel: getPaginationRowModel(),
    //     getFacetedRowModel: getFacetedRowModel(),
    //     // getFacetedUniqueValues: getFacetedUniqueValues(),
    //     //getFacetedMinMaxValues: getFacetedMinMaxValues(),
    //     debugTable: true,
    //     debugHeaders: true,
    //     debugColumns: false,
    //     filterFns: undefined
    // })
    const HtmlEditorCallBack = React.useCallback((EditorData: any) => {
        if (EditorData.length > 0) {
            post.Body = EditorData;

            let param: any = Moment(new Date().toLocaleString())
            var FeedBackItem: any = {};
            FeedBackItem['Title'] = "FeedBackPicture" + param;
            FeedBackItem['FeedBackDescriptions'] = [];
            FeedBackItem.FeedBackDescriptions = [{
                'Title': EditorData
            }]
            FeedBackItem['ImageDate'] = "" + param;
            FeedBackItem['Completed'] = '';
        }
        FeedBackItemArray.push(FeedBackItem)

    }, [])
    // function DebouncedInput({
    //     value: initialValue,
    //     onChange,
    //     debounce = 1000,
    //     ...props
    // }: {
    //     value: string | number
    //     onChange: (value: string | number) => void
    //     debounce?: number
    // } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
    //     const [value, setValue] = React.useState(initialValue)

    //     React.useEffect(() => {
    //         setValue(initialValue)
    //     }, [initialValue])

    //     React.useEffect(() => {
    //         const timeout = setTimeout(() => {
    //             onChange(value)
    //         }, debounce)

    //         return () => clearTimeout(timeout)
    //     }, [value])

    //     return (
    //         <input {...props} value={value} onChange={e => setValue(e.target.value)} />
    //     )
    // }
    // function Filter({
    //     column,
    //     table,
    //     placeholder
    // }: {
    //     column: Column<any, any>;
    //     table: Table<any>;
    //     placeholder: any

    // }): any {
    //     const columnFilterValue = column.getFilterValue();

    //     return (
    //         <input
    //             // type="text"
    //             type="search"
    //             value={(columnFilterValue ?? "") as string}
    //             onChange={(e) => column.setFilterValue(e.target.value)}
    //             placeholder={`${placeholder?.placeholder}`}
    //         // className="w-36 border shadow rounded"
    //         />
    //     );
    // }
    const EditComponentPopup = () => {
        setEditpopup(true)
    }
    const closeEditPopup = () => {
        setEditpopup(false)
    }
    const callBackData = React.useCallback((elem: any, ShowingData: any) => {


    }, []);
    const onRenderCustomHeaderMain = () => {
        return (
            <div className="d-flex full-width pb-1" >
                <div style={{ marginRight: "auto", fontSize: "20px", fontWeight: "600", marginLeft: '20px' }}>
                    <span>
                        {`Edit Page`}
                    </span>
                </div>
                <Tooltip ComponentId="756" />
            </div>
        );
    };
    
    const sendEmail=()=>{
        var body1:any=[]
        var body2:any=[]
        var To:any=[]
        var MyDate:any=''
        var ApprovalId:any = []
        var TotlaTime = QATime + DevloperTime + DesignTime

        AllUsers?.forEach((items:any)=>{
            if(CurrentUserId == items.AssingedToUserId){
                items.Approver?.forEach((val:any)=>{
                    ApprovalId.push(val)
                })

            }

        })
        ApprovalId?.forEach((va:any)=>{
            AllUsers?.forEach((ba:any)=>{
                if(ba.AssingedToUserId == va.Id){
                    To.push(ba?.Email)
                }
            })

        })
        data?.forEach((item:any)=>{
            if (item.Components == undefined || item.Components == '') {
                item.Components = '';
            }

            if (item.Designation == undefined || item.Designation == '') {
                item.Designation = '';
            }
            if (item.SubComponents == undefined || item.SubComponents == '') {
                item.SubComponents = '';
            }
            if (item.Features == undefined || item.Features == '') {
                item.Features = '';
            }
            if (item.Priority_x0020_Rank == undefined || item.Priority_x0020_Rank == '') {
                item.Priority_x0020_Rank = '';
            }
            if (item.ClientCategory == undefined || item.ClientCategory == '') {
                item.ClientCategory = '';
            }
            if (item.PercentComplete == undefined || item.PercentComplete == '') {
                item.PercentComplete = '';
            }
           
            if (item.Date != undefined && item.Date != '') {
                MyDate = item.Date;
            }
           var text = '<tr>' +
            '<td width="7%" style="border: 1px solid #aeabab;padding: 4px">' + item.Date + '</td>'
            + '<td width="7%" style="border: 1px solid #aeabab;padding: 4px">' + item.siteType + '</td>'
            + '<td width="10%" style="border: 1px solid #aeabab;padding: 4px">' + item?.Components + '</td>'
            + '<td style="border: 1px solid #aeabab;padding: 4px">' + item?.SubComponents + '</td>'
            + '<td style="border: 1px solid #aeabab;padding: 4px">' + item?.Features + '</td>'
            + '<td style="border: 1px solid #aeabab;padding: 4px">' + '<a href=' + item.siteUrl + '/SitePages/Task-Profile.aspx?taskId='+ item.TaskId +'&Site=' + item.siteType +'>' + '<span style="font-size:11px; font-weight:600">' + item.Task + '</span>' + '</a >' + '</td>'
            + '<td align="left" style="border: 1px solid #aeabab;padding: 4px">' + item?.Comments + '</td>'
            + '<td style="border: 1px solid #aeabab;padding: 4px">' + item?.Priority_x0020_Rank + '</td>'
            + '<td style="border: 1px solid #aeabab;padding: 4px">' + item?.Effort + '</td>'
            + '<td style="border: 1px solid #aeabab;padding: 4px">' + item?.PercentComplete + '%' + '</td>'
            + '<td width="7%" style="border: 1px solid #aeabab;padding: 4px">' + item?.Status + '</td>'
            + '<td width="10%" style="border: 1px solid #aeabab;padding: 4px">' + item.userName + '</td>'
            + '<td style="border: 1px solid #aeabab;padding: 4px">' + item?.Department + '</td>'
            + '<td style="border: 1px solid #aeabab;padding: 4px">' + item?.ClientCategory + '</td>'
            + '</tr>'
        body1.push(text);
        })
        var text2 =
        '<tr>'
        + '<td style="border: 1px solid #aeabab;padding: 5px;width: 50%;" bgcolor="#f5f5f5">' + '<strong>' + 'Team' + '</strong>' + '</td>'
        + '<td style="border: 1px solid #aeabab;padding: 4px">' + '<strong>' + 'Time in Hours' + '</strong>' + '</td>'
        + '</tr>'
        + '<tr>'
        + '<td style="border: 1px solid #aeabab;padding: 5px;width: 50%;" bgcolor="#f5f5f5">' + 'Design' + '</td>'
        + '<td style="border: 1px solid #aeabab;padding: 4px">' + DesignTime.toFixed(2) + '</td>'
        + '</tr>'
        + '<tr>'
        + '<td style="border: 1px solid #aeabab;padding: 5px;width: 50%;" bgcolor="#f5f5f5">' + 'Development' + '</td>'
        + '<td style="border: 1px solid #aeabab;padding: 4px">' + DevloperTime.toFixed(2) + '</td>'
        + '</tr>'
        + '<tr>'
        + '<td style="border: 1px solid #aeabab;padding: 5px;width: 50%;" bgcolor="#f5f5f5">' + 'QA' + '</td>'
        + '<td style="border: 1px solid #aeabab;padding: 4px">' + QATime.toFixed(2) + '</td>'
        + '</tr>'
        + '<tr>'
        + '<td style="border: 1px solid #aeabab;padding: 5px;width: 50%;" bgcolor="#f5f5f5">' + 'Users on leaves' + '</td>'
        + '<td style="border: 1px solid #aeabab;padding: 4px">' + leaveUsers.toFixed(2) + '</td>'
        + '</tr>'
        + '<tr>'
        + '<td style="border: 1px solid #aeabab;padding: 5px;width: 50%;" bgcolor="#f5f5f5">' + '<strong>' + 'Total' + '</strong>' + '</td>'
        + '<td style="border: 1px solid #aeabab;padding: 4px">' + '<strong>' + TotlaTime.toFixed(2) + '</strong>' + '</td>'
        + '</tr>';
    body2.push(text2);

    var bodyA =
    '<table cellspacing="0" cellpadding="1" width="30%" style="margin: 0 auto;border-collapse: collapse;">'
    + '<tbody align="center">' +
    body2 +
    '</tbody>' +
    '</table>'
var pageurl = "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/TimeReport.aspx";
var c = MyDate.split('-');
var a1 = c[2] + '-' + c[1] + '-' + c[0];
var ReportDate = new Date(a1)
 var ReportDatetime =Moment(ReportDate).format('DD/MM/YYYY')
    var body:any =
                '<p style="text-align: center;margin-bottom: 1px;">' + 'TimeSheet of  date' + '&nbsp;' + '<strong>' + ReportDatetime + '</strong>' + '</p>' +
                '<p style="text-align: center;margin: 0 auto;">' + '<a  href=' + pageurl + ' >' + 'Online version of timesheet' + '</a >' + '</p>' +
                '<br>'

                + '</br>' +
                bodyA +
                '<br>' + '</br>'
                + '<table cellspacing="0" cellpadding="1" width="100%" style="border-collapse: collapse;">' +
                '<thead>' +
                '<tr style="font-size: 11px;">' +
                '<th  style="border: 1px solid #aeabab;padding: 5px;" width = "7%" bgcolor="#f5f5f5">' + 'Date' + '</th>'
                + '<th style="border: 1px solid #aeabab;padding: 5px;" width = "7%" bgcolor="#f5f5f5">' + 'Sites' + '</th>'
                + '<th style="border: 1px solid #aeabab;padding: 5px;" width = "8%" bgcolor="#f5f5f5">' + 'Component' + '</th>'
                + '<th style="border: 1px solid #aeabab;padding: 5px;" bgcolor="#f5f5f5">' + 'SubComponent' + '</th>'
                + '<th style="border: 1px solid #aeabab;padding: 5px;" bgcolor="#f5f5f5">' + 'Feature' + '</th>'
                + '<th style="border: 1px solid #aeabab;padding: 5px;" bgcolor="#f5f5f5">' + 'Task' + '</th>'
                + '<th style="border: 1px solid #aeabab;padding: 5px;" bgcolor="#f5f5f5">' + 'FullDescription' + '</th>'
                + '<th style="border: 1px solid #aeabab;padding: 5px;" bgcolor="#f5f5f5">' + 'Priority' + '</th>'
                + '<th style="border: 1px solid #aeabab;padding: 5px;" bgcolor="#f5f5f5">' + 'Effort' + '</th>'
                + '<th style="border: 1px solid #aeabab;padding: 5px;" bgcolor="#f5f5f5">' + 'Complete' + '</th>'
                + '<th style="border: 1px solid #aeabab;padding: 5px;" width = "7%" bgcolor="#f5f5f5">' + 'Status' + '</th>'
                + '<th style="border: 1px solid #aeabab;padding: 5px;" width = "8%" bgcolor="#f5f5f5">' + 'TimeEntryUser' + '</th>'
                + '<th style="border: 1px solid #aeabab;padding: 5px;" bgcolor="#f5f5f5">' + 'Designation' + '</th>'
                + '<th style="border: 1px solid #aeabab;padding: 5px;" bgcolor="#f5f5f5">' + 'ClientCategory' + '</th>'
                + '</thead>' +
                '<tbody align="center">' +
                '<tr>' +
                body1 +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '<p>' + '<strong>' + 'Thank You' + '</strong>' + '</p>'
              var cc:any=[] 
              var ReplyTo:any = "" 
            var from:any= undefined
            var subject = 'TimeSheet :' + ' ' + ReportDatetime;
            body = body.replaceAll(',', '');
           sendEmailToUser(from, To, body, subject, ReplyTo, cc);
            alert('Email sent sucessfully');

    }
    const sendEmailToUser =(from:any, to:any, body:any, subject:any, ReplyTo:any, cc:any) => {
        let sp = spfi().using(spSPFx(props.ContextData.Context));
        sp.utility.sendEmail({
          Body: body,
          Subject: subject,  
          To: to,
          CC:cc,
          AdditionalHeaders: {
            "content-type": "text/html"
          },
        }).then(() => {
          console.log("Email Sent!");
    
        }).catch((err) => {
          console.log(err.message);
        });
        // var siteurl = "https://hhhhteams.sharepoint.com/sites/HHHH/SP"
        // var urlTemplate = siteurl + "/_api/SP.Utilities.Utility.SendEmail";
        // var sendData = JSON.stringify({
        //     'properties': {
        //         '__metadata': {
        //             'type': 'SP.Utilities.EmailProperties'
        //         },
        //         'AdditionalHeaders': {
        //             "__metadata": {
        //                 "type": "Collection(SP.KeyValue)"
        //             },
        //             "results": [{
        //                 "__metadata": {
        //                     "type": 'SP.KeyValue'
        //                 },
        //                 //'Reply- To': ReplyTo,
        //                 'Key': 'Reply-To:',
        //                 'Value': ReplyTo,
        //                 'ValueType': 'Edm.String'
        //             }]
        //         },
        //         'From': from,
        //         'To': {
        //             'results': to
        //         },
        //         'CC': {
        //             'results': cc
        //         },
        //         'Body': body,
        //         'Subject': subject
        //     }
        // })
        // $.ajax({
        //     contentType: 'application/json',
        //     url: urlTemplate,
        //     type: "POST",
        //     data: sendData,
        //     headers: {
        //         "Accept": "application/json;odata=verbose",
        //         "content-type": "application/json;odata=verbose",
        //         "X-RequestDigest": jQuery("#__REQUESTDIGEST").val()
        //     },
        //     success: function (data) {
        //         // alert('Email sent sucessfully');
        //     },
        //     error: function (err) {
        //         alert('Error in sending Email: ' + JSON.stringify(err));
        //     }

        // });
    }
    
    return (
        <>
        <section className='ContentSection'>
            <div className='row'>
                <div className='col-sm-3 text-primary'>
                    <h3 className="heading">Time Report
                        <span>
                            <img src={require('../../../Assets/ICON/edit_page.svg')} width="25" onClick={(e) => EditComponentPopup()} /></span>
                    </h3>
                </div>
                <div className='col-sm-9 text-primary'>
                    <h6 className='pull-right'><b><a  data-interception="off"
                    target="_blank" href="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/TimeReport-old.aspx">Old Time Report</a></b>
                    </h6>
                </div>
            </div>
            <div className='row'>
                <div className='col-7 mt-4 showDate'>

                    <input type='date' value={Moment(selectdate!= undefined?selectdate:defaultDate).format("YYYY-MM-DD")} max="9999-12-31 mx-3" onChange={(e) => setSelectDate(e.target.value)} />
                    <label className='mx-2 SpfxCheckRadio'>
                        <input type="radio" name="Custom" checked={checkedCustom} className="radio" />Custom
                    </label>
                    <label className='mx-2 SpfxCheckRadio'>
                        <input type="radio"  name="Yesterday" checked={checkedWS} onClick={() => selectType('Yesterday')} className="radio" />Yesterday
                    </label>
                    <label className='mx-2 SpfxCheckRadio'>
                        <input type="radio" name="Today" checked={checkedTask} onClick={() => selectType('Today')} className="radio" />Today
                    </label>
                    <button className='btnCol btn btn-primary' type="submit" onClick={() => GeneratedTask()}>Generate TimeSheet</button>


                </div>
                <div className='col-sm-5'>
                    <table className='table table-hover showTime'>
                        <thead>
                            <tr>
                                <th className='border bg-light'><strong>Team</strong></th>
                                <th className='border'><strong>Time In Hours</strong></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className='border bg-light'>Design</td>
                                <td className='border'>{DesignTime.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td className='border bg-light'>Development</td>
                                <td className='border'>{DevloperTime.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td className='border bg-light'> QA</td>

                                <td className='border'>{QATime.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td className='border bg-light'> Users on Leave </td>

                                <td className='border'>{leaveUsers.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td className='border bg-light'> <strong>Total Time</strong></td>
                                <td className='border'>{TotleTaskTime?.toFixed(2)}</td>
                            </tr>

                        </tbody>
                    </table>
                </div>
            </div>
         </section>
             <section className='TableContentSection'>
            <div className='Alltable'>
            
             {
                data?.length >0?
                <>
                 <div className='pull-right mail-info' onClick={()=>sendEmail()}><MdEmail/></div>
               <GlobalCommanTable columns={column} data={data} callBackData={callBackData} showHeader={true} expandIcon={true}/> </>:
                <div className="bg-f5f5 mb-2 mt-2">Oops! Time Entries not available (Might be Weekend or Holiday or No data available In this Selected Date).</div>
             }
            
            <Loader
                  loaded={loaded}
                  lines={13}
                  length={20}
                  width={10}
                  radius={30}
                  corners={1}
                  rotate={0}
                  direction={1}
                  
                  speed={2}
                  trail={60}
                  shadow={false}
                  hwaccel={false}
                  className="spinner"
                  zIndex={2e9}
                  top="28%"
                  left="50%"
                  scale={1.0}
                  loadedClassName="loadedContent"
                />
            </div>
            </section>
            <Panel
                onRenderHeader={onRenderCustomHeaderMain}
                type={PanelType.custom}
                customWidth="1550px"
                isOpen={Editpopup}
                onDismiss={closeEditPopup}
                isBlocking={false}
            >
                <div className='modal-body'>
                    <div className='row mt-4'>
                        <div className='col-sm-4'>
                            <div className='form-group mb-2'>
                                <label>Name</label><br />
                                <input type="text" className="form-control" disabled={true} value={`Time Report`}></input>
                            </div>
                        </div>
                        <div className='col-sm-4'>
                            <div className='form-group mb-2'>
                                <label>Title</label><br />
                                <input type="text" className="form-control" defaultValue={`Time Report`} onChange={(e) => setPost({ ...post, Title: e.target.value })} ></input>
                            </div>
                        </div>
                        <div className='col-sm-4'>
                            <div className="input-group mb-2">
                                <label className="full-width">Item Rank</label>
                                <select
                                    className="full_width searchbox_height"
                                    onChange={(e) =>
                                        (post.ItemRank = e.target.value)
                                    }
                                >
                                    <option>
                                        {post?.ItemRank == undefined
                                            ? "select Item Rank"
                                            : post.ItemRank}
                                    </option>
                                    {TaskItemRank &&
                                        TaskItemRank[0].map(function (h: any, i: any) {
                                            return (
                                                <option
                                                    key={i}
                                                    defaultValue={post?.ItemRank}
                                                >
                                                    {post?.ItemRank == h.rankTitle
                                                        ? post.ItemRank
                                                        : h.rankTitle}
                                                </option>
                                            );
                                        })}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-sm-12'>

                            <FroalaCommentBox
                                EditorValue={post.Body != undefined ? post.Body : ''}
                                callBack={HtmlEditorCallBack}
                            >
                            </FroalaCommentBox>

                        </div>
                    </div>

                </div>
                <footer>
                    <div className='row mt-4'>
                        <div className="col-sm-6 ">
                            <div className="text-left">
                                Created
                                <span>{`02/06/2021`}</span>
                                by <span
                                    className="siteColor">{`Amit Kumar`}</span>
                            </div>
                            <div className="text-left">
                                Last modified
                                <span>{`25/11/2021`}</span>
                                by <span
                                    className="siteColor">{`Guru Charan Das`}</span>
                            </div>
                        </div>
                        <div className="col-sm-6 text-end">
                            {/* <a target="_blank"
                                                                        ng-if="AdditionalTaskTime.siteListName != 'SP.Data.TasksTimesheet2ListItem'"
                                                                        ng-href="https://hhhhteams.sharepoint.com/sites/HHHH/SP/Lists/TaskTimeSheetListNew/EditForm.aspx?ID={{AdditionalTaskTime.ParentID}}">
                                                                        Open out-of-the-box
                                                                        form
                                                                    </a> */}
                            <a target="_blank"
                                ng-if="AdditionalTaskTime.siteListName === 'SP.Data.TasksTimesheet2ListItem'"
                                href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/Lists/TaskTimeSheetListNew/EditForm.aspx?ID=${`18`}`}>
                                Open out-of-the-box
                                form
                            </a>
                            <button type="button" className="btn btn-primary ms-2"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </footer>


            </Panel >



        </>
    )
}
export default TimeReport;

function generateSortingIndicator(column: any): string | number | boolean | {} | React.ReactNodeArray | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactPortal {
    throw new Error('Function not implemented.');
}