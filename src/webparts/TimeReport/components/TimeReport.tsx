import * as React from 'react';
import { Web } from "sp-pnp-js";
import { arraysEqual, Modal, Panel, PanelType } from 'office-ui-fabric-react';
// import { useExpanded, useFilters, usePagination, useSortBy, useTable } from 'react-table'
import "bootstrap/dist/css/bootstrap.min.css";
import FroalaCommentBox from '../../../globalComponents/FlorarComponents/FroalaCommentBoxComponent';
import "@pnp/sp/sputilities";
import * as globalCommon from "../../../globalComponents/globalCommon";
import { IEmailProperties } from "@pnp/sp/sputilities";

import { SPFI, spfi, SPFx as spSPFx } from "@pnp/sp";
import Tooltip from '../../../globalComponents/Tooltip';
import { FaAngleDown, FaAngleUp, FaPrint, FaFileExcel, FaPaintBrush, FaEdit, FaSearch, FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import GlobalCommanTable from '../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable';
import {
    ColumnDef,
} from "@tanstack/react-table";
import ShowClintCatogory from "../../../globalComponents/ShowClintCatogory";
//import { Button, Table, Row, Col, Pagination, PaginationLink, PaginationItem, Input } from "reactstrap";

// import * as Moment from 'moment';
import * as Moment from 'moment-timezone';
import { MdEmail } from "react-icons/Md";
 import PageLoader from '../../../globalComponents/pageLoader';
import ReactPopperTooltipSingleLevel from '../../../globalComponents/Hierarchy-Popper-tooltipSilgleLevel/Hierarchy-Popper-tooltipSingleLevel';
import EditPage from '../../../globalComponents/EditPanelPage/EditPage';
let AllUsers: any = []
let smartmetaDetails: any = [];
let AllTasks: any = []
let TaskItemRank: any = []
let AllTime: any = []
let AllTrainee: any = []
let DevloperTime: any = 0.00;
let QATime: any = 0.00;
let QAMembers: any = 0;
let DesignMembers: any = 0;
let QAleaveHours:any = 0;
let DevelopmentleaveHours:any = 0;
let DesignMemberleaveHours:any = 0;
let DevelopmentMembers: any = 0;
let TotalQAMember: any = 0;
let TotalDesignMember: any = 0;
let TotalDevelopmentMember: any = 0;
let DesignTime: any = 0.00;
let TotleTaskTime:any=0.00
let leaveUsers:any  = 0.00
let checkDate: any = ''
//var DevloperTime: any = 0
let isColumnDefultSortingAsc: any = false;
//var QATime: any = 0
var FeedBackItemArray: any = [];
var todayLeaveUsers:any=[]
var  finalData:any=[]
//var DesignTime: any = 0
var TotalTime: any = 0
var CurrentUserId=''
var StartDatesss:any=''
var selectDatess:any=''
let QAhalfdayleave:any = [];
let developmenthalfdayleave:any = [];
let designhalfdayleave:any = [];
let QAfulldayleave:any = [];
let developmentfulldayleave:any = [];
let AllMetadata:any=[]
let componentDetails:any = [];
let designfulldayleave:any = [];
const TimeReport = (props:any) => {
   
    CurrentUserId = props.ContextData.Context.pageContext._legacyPageContext?.userId
    const web = new Web(props.ContextData.Context._pageContext._web.absoluteUrl);
    let GenderSitee = '&$filter=';
    let SharewebSitee = '&$filter=';
    let EISitee = '&$filter=';
    let HealthSitee = '&$filter=';
    let EPSSitee = '&$filter=';
    let EducationSitee = '&$filter=';
    let DESitee = '&$filter=';
    let QASitee = '&$filter=';
    let GrueneSitee = '&$filter=';
    let HHHHSitee = '&$filter=';
    let KathaBeckSitee = '&$filter=';
    let MigrationSitee = '&$filter=';
    let ALAKDigitalSitee = '&$filter=';
    let OffshoreSitee = '&$filter=';
    const [data, setData] = React.useState([])
    // const [checkDate, setcheckDate] = React.useState('')
    const [update, setUpdate] = React.useState(0)
    const [loaded, setLoaded] = React.useState(true);
    const [checkedCustom,setcheckedCustom] = React.useState(false )
    const [Editpopup, setEditpopup] = React.useState(false)
    
    var [selectdate, setSelectDate] = React.useState(undefined)
    const [checkedWS, setcheckedWS] = React.useState(false);
    const [headerChange, setHeaderChange]: any = React.useState('');
    const [checkedTask, setcheckedTask] = React.useState(true);
    const [defaultDate,setDefaultDate] = React.useState()
    const [post, setPost] = React.useState({ Title: '', ItemRank: '', Body: '' })
    
    React.useEffect(() => {
    var datteee:any = new Date()
    // var MyYesterdayDate:any = Moment(datteee).add(-1, 'days').format()
    setDefaultDate(datteee)
    GetComponents();
    GetSmartmetadata();
        showProgressBar();
        GetTaskUsers();
      


    }, [])

    const GetTaskUsers = async () => {
        let taskUsers = [];
        taskUsers = await web.lists
            .getByTitle('Task Users')
            .items
            .select('Id,UserGroup/Id,UserGroup/Title,TimeCategory,Suffix,Title,Email,SortOrder,Role,Company,ParentID1,Status,Item_x0020_Cover,AssingedToUserId,isDeleted,AssingedToUser/Title,AssingedToUser/Id,AssingedToUser/EMail,ItemType,Approver/Id,Approver/Title,Approver/Name')
            .expand('AssingedToUser,Approver,UserGroup')
            .filter("Company eq 'Smalsus'")
            .top(4999)
            .get();
        AllUsers = taskUsers;
        AllUsers?.forEach((val:any)=>{
            if(val?.Email?.indexOf('trainee') > -1){
                AllTrainee.push(val)
            }
        })


    }
    const GetSmartmetadata = async () => {
        var metadatItem: any = []
        // let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
        metadatItem = await web.lists
            .getById(props?.ContextData?.SmartMetadataListID)
            .items
            .select('Id', 'Title', 'IsVisible', 'ParentID', 'SmartSuggestions','Color_x0020_Tag', 'TaxType', 'Description1', 'Item_x005F_x0020_Cover', 'listId', 'siteName', 'siteUrl', 'SortOrder', 'SmartFilters', 'Selectable', 'Parent/Id', 'Parent/Title')
            .top(4999)
            .expand('Parent')
            .get()

        console.log(metadatItem);
        metadatItem?.forEach((config: any) => {
            if (config.Title != 'Health' && config.Title != 'Gender' && config.Title != 'Foundation' && config.Title != 'Small Projects' && config.Title != 'Master Tasks' && config.Title != 'SDC Sites' && config.TaxType == 'Sites') {
                smartmetaDetails.push(config)
            }
            if (config.TaxType == 'Client Category') {
                AllMetadata.push(config)
            }
        })
        await LoadAllSiteTasks();

    }
    TaskItemRank.push([{ rankTitle: 'Select Item Rank', rank: null }, { rankTitle: '(8) Top Highlights', rank: 8 }, { rankTitle: '(7) Featured Item', rank: 7 }, { rankTitle: '(6) Key Item', rank: 6 }, { rankTitle: '(5) Relevant Item', rank: 5 }, { rankTitle: '(4) Background Item', rank: 4 }, { rankTitle: '(2) to be verified', rank: 2 }, { rankTitle: '(1) Archive', rank: 1 }, { rankTitle: '(0) No Show', rank: 0 }]);



    const GetComponents = async () => {
       
        let web = new Web(props?.ContextData?.siteUrl);
       
        componentDetails = await web.lists
            .getById(props?.ContextData?.MasterTaskListID)
            .items
            .select("ID", "Id", "Title", "PortfolioLevel", "PortfolioStructureID", "Comments", "ItemRank", "Portfolio_x0020_Type", "Parent/Id", "Parent/Title",
                "DueDate", "Body", "Item_x0020_Type", "Categories", "Short_x0020_Description_x0020_On", "PriorityRank", "Priority",
                "TeamMembers/Id", "TeamMembers/Title", "ClientCategory/Id", "ClientCategory/Title", "PercentComplete",
                "ResponsibleTeam/Id", "ResponsibleTeam/Title", "PortfolioType/Id", "PortfolioType/Color", "PortfolioType/IdRange", "PortfolioType/Title", "AssignedTo/Id", "AssignedTo/Title", "AssignedToId", "Author/Id", "Author/Title", "Editor/Id", "Editor/Title",
                "Created", "Modified", "Deliverables", "TechnicalExplanations", "Help_x0020_Information", "AdminNotes", "Background", "Idea", "ValueAdded", "Sitestagging"
            )
            .expand(
                "Parent", "PortfolioType", "AssignedTo", "ClientCategory", "TeamMembers", "ResponsibleTeam", "Editor", "Author"
            )
            .top(4999)
            .get();

        console.log(componentDetails);
        componentDetails.forEach((result: any) => {
            result["siteType"] = "Master Tasks";
            result.AllTeamName = "";
            result.descriptionsSearch = '';
            result.commentsSearch = '';
            result.TaskTypeValue = '';
            result.portfolioItemsSearch = result.Item_x0020_Type;
            result.TeamLeaderUser = [];
            if (result.Item_x0020_Type === 'Component') {
                result.boldRow = 'boldClable'
                result.lableColor = 'f-bg';
            }
            if (result.Item_x0020_Type === 'SubComponent') {
                result.lableColor = 'a-bg';
            }
            if (result.Item_x0020_Type === 'Feature') {
                result.lableColor = 'w-bg';
            }
            if (result?.Item_x0020_Type != undefined) {
                result.SiteIconTitle = result?.Item_x0020_Type?.charAt(0);
            }
            result["TaskID"] = result?.PortfolioStructureID;

          
        });
        
       
    };



    const LoadAllSiteTasks =  () => {
        var Counter = 0;
        if (smartmetaDetails != undefined && smartmetaDetails.length > 0) {
        smartmetaDetails.forEach(async (config: any) => {
                let web = new Web(props?.ContextData.siteUrl);
                let AllTasksMatches: any = [];
                AllTasksMatches = await web.lists
                    .getById(config.listId)
                    .items.select("ParentTask/Title", "ParentTask/Id", "ItemRank", "TaskLevel", "OffshoreComments", "TeamMembers/Id", "ClientCategory/Id", "ClientCategory/Title",
                        "TaskID", "ResponsibleTeam/Id", "ResponsibleTeam/Title", "ParentTask/TaskID", "TaskType/Level", "PriorityRank", "TeamMembers/Title", "FeedBack", "Title", "Id", "ID", "DueDate", "Comments", "Categories", "Status", "Body",
                        "PercentComplete", "ClientCategory", "Priority", "TaskType/Id", "TaskType/Title", "Portfolio/Id", "Portfolio/ItemType", "Portfolio/PortfolioStructureID", "Portfolio/Title",
                        "TaskCategories/Id", "TaskCategories/Title", "TeamMembers/Name", "Project/Id", "Project/PortfolioStructureID", "Project/Title", "AssignedTo/Id", "AssignedTo/Title", "AssignedToId", "Author/Id", "Author/Title", "Editor/Id", "Editor/Title",
                        "Created", "Modified", "IsTodaysTask", "workingThisWeek"
                    )
                    .expand(
                        "ParentTask", "Portfolio", "TaskType", "ClientCategory", "TeamMembers", "ResponsibleTeam", "AssignedTo", "Editor", "Author",
                        "TaskCategories", "Project",
                    )
                    .orderBy("orderby", false)
                    .getAll(4000);

                console.log(AllTasksMatches);
                Counter++;
                console.log(AllTasksMatches.length);
                if (AllTasksMatches != undefined && AllTasksMatches.length > 0) {
                    $.each(AllTasksMatches, function (index: any, item: any) {
                        item["SiteIcon"] = config?.Item_x005F_x0020_Cover?.Url;
                        item.listId = config?.listId;
                        item.fontColorTask = "#000"
                        item.isDrafted = false;
                        item.flag = true;
                        item.TaskTime = []
                        item.TimeSpent = 0 
                        item.Components = ''
                        item.SubComponents = ''
                        item.Features = ''
                        item.userName = ''
                        item.TeamLeaderUser = []
                        item.AllTeamName = item.AllTeamName === undefined ? '' : item.AllTeamName;
                        item.PercentComplete = (item.PercentComplete * 100).toFixed(0);
                        item.chekbox = false;
                        item.DueDate = Moment(item.DueDate).format('DD/MM/YYYY')
        
                        if (item?.TaskCategories?.some((category: any) => category.Title.toLowerCase() === "draft")) { item.isDrafted = true; }
                    });
                    AllTasks = AllTasks.concat(AllTasksMatches);
                    if (Counter == smartmetaDetails.length) {
                        AllTasks.forEach((result: any) => {
                            if (result.DueDate == 'Invalid date' || '') {
                                result.DueDate = result.DueDate.replaceAll("Invalid date", "")
                            }
                            if(result?.Id == '12590'){
                                console.log('My  Data')
                            }
                            result.TaskId =  globalCommon.GetTaskId(result);
                        })
                        selectType('Today')
                    }
                }
            });
            
           
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
        leaveUsers = 0
         DevloperTime = 0.00;
QATime = 0.00;
 QAMembers = 0;
 DesignMembers = 0;
 DevelopmentMembers = 0;
 TotalQAMember = 0;
 TotalDesignMember = 0;
 TotalDevelopmentMember = 0;
 StartDatesss=''
 
 DesignTime = 0.00;
         QATime = 0.00;
         DesignTime = 0.00;
         TotleTaskTime = 0.00
         if(selectDatess == ''){
            selectDatess = 'Custom'
         }
        
        if (selectDatess == "Yesterday") {
            var datteee = new Date()
            var MyYesterdayDate:any = Moment(datteee).add(-1, 'days').format()
            setDefaultDate(MyYesterdayDate);
            setcheckedCustom(false)
            setcheckedWS(true)
            setcheckedTask(false)
            var Datenew = Moment(MyYesterdayDate).format("DD/MM/YYYY")
            var myDate = new Date()
            // var final: any = (Moment(myDate).add(-2, 'days').format())
            var final: any = (Moment(myDate).add(-2, 'days').format())
        }
        if(selectDatess == 'Today'){
            selectdate=undefined
            var dat:any = new Date()
            setcheckedCustom(false)
            setcheckedWS(false)
            setcheckedTask(true)
            setDefaultDate(dat)
            var myDate = new Date()
            var Datenew = Moment(myDate).format("DD/MM/YYYY")          
            setSelectDate(myDate)
            var final: any = (Moment(myDate).add(-1, 'days').format())
            //var final: any = (Moment(myDate).format())
        }
        if(selectDatess == 'Custom') {
            setcheckedWS(false)
            setcheckedTask(false)
            setcheckedCustom(true)
            var myDate = new Date(selectdate)
            var Datenew = Moment(selectdate).format("DD/MM/YYYY")         
            // var final: any = (Moment(myDate).add(-1, 'days').format())
            var final: any = (Moment(myDate).format())
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
    var TotalMembersss = 0.00
    var TotalleaveMembersss = 0.00
    var TotalleaveHours = 0;
    const GetleaveUser=async(selectDate:any)=>{
        var myData:any=[]
        var leaveData:any=[]
        var leaveUser:any=[]        
        todayLeaveUsers=[]
        // let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");

        myData = await web.lists
            .getById(props?.ContextData?.LeaveCalenderListID)
            .items
            .select("RecurrenceData,Duration,Author/Title,Editor/Title,Category,HalfDay,Description,ID,EndDate,EventDate,Location,Title,fAllDayEvent,EventType,UID,fRecurrence,Event_x002d_Type,Employee/Id")
            .top(499)
            .expand("Author,Editor,Employee")
            .getAll()
            console.log(myData);
           
            myData?.forEach((val:any)=>{
                val.EndDate = new Date(val?.EndDate);
                val?.EndDate.setHours(val?.EndDate.getHours() - 9);
                    // var TodayDate:any = new Date()
                    // TodayDate =  Moment(TodayDate).format("DD/MM/YYYY")
                   //var TodayDate =  selectDate.split("/")  
                   var itemDate = Moment(val.EventDate)                                    
                    var TodayDate =  selectDate[2] + selectDate[1] + selectDate[0]
                    var endDate = Moment(val?.EndDate).format("DD/MM/YYYY")
                    var eventDate = Moment(val.EventDate).format("DD/MM/YYYY")
                    const date = val.EndDate
                    var NewEndDate = endDate.split("/")
                    var NewEventDate = eventDate.split("/")

                    

                    var End = NewEndDate[2] + NewEndDate[1] + NewEndDate[0]
                    var start = NewEventDate[2] + NewEventDate[1] + NewEventDate[0]
                    // if(start === End)ss
                    //  totaltime = stattime - endtime;
 
                    if (TodayDate >= start && TodayDate <= End){
                        var stattime = Moment.tz(itemDate,'Europe/Berlin').format('DD/MM/YYYY HH:MM:SS Z').split(' ')[1].split(':');
                        var endtime = Moment.tz(val.EndDate,'Europe/Berlin').format('DD/MM/YYYY HH:MM:SS Z').split(' ')[1].split(':'); 
                        if(val?.fAllDayEvent == true) {
                            val.totaltime = 8
                        }
                        else{
                            val.totaltime = 8
                        }
                        if(val?.HalfDay == true) {
                            val.totaltime = 4
                        }
                       
                                    
                        console.log(val)
                        leaveData.push(val)                       
                    }
                                                 
            })
            console.log(leaveData)
            leaveData?.forEach((val:any)=>{
                var users:any={}
                AllUsers?.forEach((item:any)=>{
                    if(item?.AssingedToUserId != null && val?.Employee?.Id == item?.AssingedToUserId){
                        users['userName'] = item.Title
                        users['Components'] = ''
                        users['SubComponents'] = ''
                        users['Features'] = ''
                        users['Department'] = item.TimeCategory
                        users['Effort'] = val.totaltime !== undefined && val.totaltime <= 4 ? val.totaltime : 8
                        users['Task'] = 'Leave'
                        users['Comments'] = 'Leave'
                        users['ClientCategoryy'] = 'Leave'
                        users['siteType'] = ''
                        users['Date'] = ''
                        users['Status'] = ''
                        todayLeaveUsers.push(users)
                    }
                })
            })
              finalData = todayLeaveUsers.filter((val: any, TaskId: any, array: any) => {
                 return array.indexOf(val) == TaskId;
          })
          var D=[]
          var De=[]
          var QAteam=[]
          AllUsers?.forEach((item:any)=>{
            if((item?.TimeCategory == 'Development' && item?.Company == 'Smalsus') && (item?.UserGroup?.Title == 'Senior Developer Team' || item?.UserGroup?.Title == 'Mobile Team' || item?.UserGroup?.Title == 'Smalsus Lead Team' ||  item?.UserGroup?.Title == 'Junior Developer Team')){
                D.push(item)
            }
            if((item?.TimeCategory == 'Design'  && item.Company == 'Smalsus') ||  item?.UserGroup?.Title == 'Design Team'){
                De.push(item)
            }
            if(item?.TimeCategory == 'QA'  && item.Company == 'Smalsus' &&  item?.UserGroup?.Title != 'Ex Staff'){
                QAteam.push(item)
            }
          })
            console.log(finalData)
            var QA:any =[]
            var Design:any = []
            var Development:any =[]
            finalData?.forEach((val:any)=>{
                if(val?.Department == 'QA'){
                    QA.push(val)  
                }
                if(val?.Department == 'Design'){
                    Design.push(val)  
                }
                if(val?.Department == 'Development'){
                    Development.push(val)  
                }
            })
            QAMembers = QA.length
            DesignMembers = Design.length
            DevelopmentMembers = Development.length

            QAhalfdayleave = QA.filter((x:any)=>x.Effort === 4);
            developmenthalfdayleave = Development.filter((x:any)=>x.Effort === 4);
            designhalfdayleave = Design.filter((x:any)=>x.Effort === 4);

            QAfulldayleave = QA.filter((x:any)=>x.Effort === 8);
            developmentfulldayleave = Development.filter((x:any)=>x.Effort === 8);
            designfulldayleave = Design.filter((x:any)=>x.Effort === 8);

            if(QAhalfdayleave.length > 0 || developmenthalfdayleave.length>0 || designhalfdayleave.length>0){
                QAleaveHours = ((QAhalfdayleave.length) * 4) + ((QAfulldayleave.length) * 8);
                DevelopmentleaveHours = ((developmenthalfdayleave.length) * 4) + ((developmentfulldayleave.length) * 8);
                DesignMemberleaveHours = ((designhalfdayleave.length) * 4)+((designfulldayleave.length) * 8);
            }
            else{
                QAleaveHours = (QA.length) * 8;
                DevelopmentleaveHours = (Development.length) * 8;
                DesignMemberleaveHours = (Design.length) * 8;
            }
            
            TotalDevelopmentMember = D.length 
            TotalDesignMember = De.length      
            TotalQAMember = QAteam.length 

            TotalMembersss = TotalDevelopmentMember + TotalDesignMember + TotalQAMember
            TotalleaveMembersss = DesignMembers + DevelopmentMembers + QAMembers
            TotalleaveHours = QAleaveHours+DevelopmentleaveHours+DesignMemberleaveHours

            if(finalData != undefined && finalData.length>0){
                //  leaveUsers = TotalleaveMembersss * 8
                leaveUsers = TotalleaveMembersss 
                
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
            var Datenew = Moment(myDate).format("DD/MM/YYYY")
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
                            sheetDetails.TaskId = task.TaskDE.Id
                            sheetDetails.Id = task.TaskDE.Id
                            DESitee += '(Id eq ' + task.TaskDE.Id + ') or';
                            sheetDetails.siteType = 'DE'
                        }
                        if (task.TaskEI != undefined && task.TaskEI.Id != undefined) {
                            sheetDetails.Task = task.TaskEI.Title; // == undefined ? (task.Title == undefined ? '' : task.Title)  : task.TaskEI.Title;
                            sheetDetails.TaskId = task.TaskEI.Id;
                            sheetDetails.Id = task.TaskEI.Id
                            EISitee += '(Id eq ' + task.TaskEI.Id + ') or';
                            sheetDetails.siteType = 'EI'
                        }
                        if (task.TaskEPS != undefined && task.TaskEPS.Id != undefined) {
                            sheetDetails.Task = task.TaskEPS.Title; // == undefined ? (task.Title == undefined ? '' : task.Title)  : task.TaskEP.Title;
                            sheetDetails.TaskId = task.TaskEPS.Id
                            sheetDetails.Id = task.TaskEPS.Id
                            EPSSitee += '(Id eq ' + task.TaskEPS.Id + ') or';
                            sheetDetails.siteType = 'EPS'
                        }
                        if (task.TaskEducation != undefined && task.TaskEducation.Id != undefined) {
                            sheetDetails.Task = task.TaskEducation.Title; // =   sheetDetails.TaskId = task.TaskEducation.Id;
                            EducationSitee += '(Id eq ' + task.TaskEducation.Id + ') or';
                            sheetDetails.TaskId = task.TaskEducation.Id
                            sheetDetails.Id = task.TaskEducation.Id
                            sheetDetails.siteType = 'Education'
                        }
                        if (task.TaskHHHH != undefined && task.TaskHHHH.Id != undefined) {
                            sheetDetails.Task = task.TaskHHHH.Title; // == undefined ? (task.Title == undefined ? '' : task.Title) : task.TaskHHHH.Title;
                            sheetDetails.TaskId = task.TaskHHHH.Id
                            sheetDetails.Id = task.TaskHHHH.Id
                            HHHHSitee += '(Id eq ' + task.TaskHHHH.Id + ') or';
                            sheetDetails.siteType = 'HHHH'
                        }
                        if (task.TaskQA != undefined && task.TaskQA.Id != undefined) {
                            sheetDetails.Task = task.TaskQA.Title; // == undefined ? (task.Title == undefined ? '' : task.Title)  : task.TaskQA.Title;
                            sheetDetails.TaskId = task.TaskQA.Id
                            sheetDetails.Id = task.TaskQA.Id
                            QASitee += '(Id eq ' + task.TaskQA.Id + ') or';
                            sheetDetails.siteType = 'QA'
                        }
                        if (task.TaskGender != undefined && task.TaskGender.Id != undefined) {
                            sheetDetails.Task = task.TaskGender.Title; // == undefined ? (task.Title == undefined ? '' : task.Title)  : task.TaskGender.Title;
                            sheetDetails.TaskId = task.TaskGender.Id
                            sheetDetails.Id = task.TaskGender.Id
                            GenderSitee += '(Id eq ' + task.TaskGender.Id + ') or';
                            sheetDetails.siteType = 'Gender'
                        }
                        if (task.TaskShareweb != undefined && task.TaskShareweb.Id != undefined) {
                            sheetDetails.Task = task.TaskShareweb.Title; // == undefined ? (task.Title == undefined ? '' : task.Title)  : task.TaskShareweb.Title;
                            sheetDetails.TaskId = task.TaskShareweb.Id
                            sheetDetails.Id = task.TaskShareweb.Id
                            SharewebSitee += '(Id eq ' + task.TaskShareweb.Id + ') or';
                            sheetDetails.siteType = 'Shareweb'
                        }
                        if (task.TaskGruene != undefined && task.TaskGruene.Id != undefined) {
                            sheetDetails.Task = task.TaskGruene.Title; // == undefined ? (task.Title == undefined ? '' : task.Title)  : task.TaskGruene.Title;
                            sheetDetails.TaskId = task.TaskGruene.Id
                            sheetDetails.Id = task.TaskGruene.Id
                            GrueneSitee += '(Id eq ' + task.TaskGruene.Id + ') or';
                            sheetDetails.siteType = 'Gruene'
                        }
                        if (task.TaskOffshoreTasks != undefined && task.TaskOffshoreTasks.Id != undefined) {
                            sheetDetails.Task = task.TaskOffshoreTasks.Title; // == undefined ? (task.Title == undefined ? '' : task.Title)  : task.TaskOffshoreTasks.Title;
                            sheetDetails.TaskId = task.TaskOffshoreTasks.Id
                            sheetDetails.Id = task.TaskOffshoreTasks.Id
                            OffshoreSitee += '(Id eq ' + task.TaskOffshoreTasks.Id + ') or';
                            sheetDetails.siteType = 'Offshore Tasks'
                        }
                        if (task.TaskHealth != undefined && task.TaskHealth.Id != undefined) {
                            sheetDetails.Task = task.TaskHealth.Title;
                            sheetDetails.TaskId = task.TaskHealth.Id
                            sheetDetails.Id = task.TaskHealth.Id
                            HealthSitee += '(Id eq ' + task.TaskHealth.Id + ') or';
                            sheetDetails.siteType = 'Health'
                        }
                        if (task.TaskKathaBeck != undefined && task.TaskKathaBeck.Id != undefined) {
                            sheetDetails.Task = task.TaskKathaBeck.Title;
                            sheetDetails.TaskId = task.TaskKathaBeck.Id
                            sheetDetails.Id = task.TaskKathaBeck.Id
                            KathaBeckSitee += '(Id eq ' + task.TaskKathaBeck.Id + ') or';
                            sheetDetails.siteType = 'KathaBeck'
                        }
                        if (task.TaskMigration != undefined && task.TaskMigration.Id != undefined) {
                            sheetDetails.Task = task.TaskMigration.Title;
                            sheetDetails.TaskId = task.TaskMigration.Id
                            sheetDetails.Id = task.TaskMigration.Id
                            MigrationSitee += '(Id eq ' + task.TaskMigration.Id + ') or';
                            sheetDetails.siteType = 'Migration'
                        }
                        if (task.TaskALAKDigital != undefined && task.TaskALAKDigital.Id != undefined) {
                            sheetDetails.Task = task.TaskALAKDigital.Title;
                            sheetDetails.TaskId = task.TaskALAKDigital.Id
                            sheetDetails.Id = task.TaskALAKDigital.Id
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
            SelectedTime?.map((item: any) => {
               
                if (item?.AuthorId == val?.AssingedToUserId ) {
                    // item.Department = val.TimeCategory
                    // item.Company = val.Company

                    if (val?.UserGroup?.Title == 'Senior Developer Team' || val?.UserGroup?.Title == 'Smalsus Lead Team' || val?.UserGroup?.Title == 'External Staff' )

                    item.Department = 'Developer';

                if (val?.UserGroup?.Title == 'Junior Developer Team')

                item.Department = 'Junior Developer';

                if (val?.UserGroup?.Title == 'Design Team')

                item.Department = 'Design';

                if (val?.UserGroup?.Title == 'QA Team')

                item.Department = 'QA';

                }
            })

        })
       
        AllTasks?.forEach((task: any) => {
            SelectedTime?.forEach((item: any) => {
                if (item.TaskId === task.Id && item.Task === task.Title && item?.userName != 'Kristina Kovach') {
                    if (task?.Portfolio?.ItemType == 'Component' || task?.Portfolio?.ItemType == 'Service') {
                        item.Components = task.Portfolio?.Title
                        item.siteUrl = task.siteUrl
                        item.NewTaskId = task.TaskId
                        item.siteType = item.siteType
                        item.TaskID = task.TaskId
                        item.SiteIcon = task?.SiteIcon
                        item.SiteIconTitle = item?.siteType;
                        item.PercentComplete = task.PercentComplete
                        item.Status = task.Status
                        item.TaskType = task.TaskType
                        item.Component = task.Component
                        item.Title = task.Title
                        item.PriorityRank = task.PriorityRank
                        item.ClientCategory = task?.ClientCategory
                        task?.ClientCategory?.forEach((cat:any)=>{
                          item.ClientCategoryy = cat.Title;
                        })
                    }
                    if (task?.Portfolio == undefined) {
                        item.siteUrl = task.siteUrl
                        item.siteType = item.siteType
                        item.PercentComplete = task.PercentComplete
                        item.TaskType = task.TaskType
                        item.NewTaskId = task.TaskId
                        item.TaskID = task.TaskId
                        item.Status = task.Status
                        item.SiteIcon = task?.SiteIcon
                        item.SiteIconTitle = item?.siteType;
                        item.Title = task.Title
                        item.PriorityRank = task.PriorityRank
                        item.ClientCategory = task?.ClientCategory
                        task?.ClientCategory?.forEach((cat:any)=>{
                            item.ClientCategoryy = cat.Title;
                        })
                    }
                    if (task?.Portfolio?.ItemType == 'SubComponent') {
                        item.SubComponents = task.Portfolio.Title
                        item.siteUrl = task.siteUrl
                        item.siteType = item.siteType
                        item.TaskType = task.TaskType
                        item.TaskID = task.TaskId
                        item.NewTaskId = task.TaskId
                        item.PercentComplete = task.PercentComplete
                        item.Status = task.Status
                        item.SiteIcon = task?.SiteIcon
                        item.SiteIconTitle = item?.siteType;
                        item.Title = task.Title
                        item.PriorityRank = task.PriorityRank
                        item.ClientCategory = task?.ClientCategory
                        task?.ClientCategory?.forEach((cat:any)=>{
                            item.ClientCategoryy = cat.Title;
                        })
                    }
                    if (task?.Portfolio?.ItemType == 'Feature') {
                        item.Features = task.Portfolio.Title
                        item.siteUrl = task.siteUrl
                        item.siteType = item.siteType
                        item.TaskID = task.TaskId
                        item.PercentComplete = task.PercentComplete
                        item.NewTaskId = task.TaskId
                        item.TaskType = task.TaskType
                        item.SiteIcon = task?.SiteIcon
                        item.SiteIconTitle = item?.siteType;
                        item.Status = task.Status
                        item.Title = task.Title
                        item.PriorityRank = task.PriorityRank
                        item.ClientCategory = task?.ClientCategory
                        task?.ClientCategory?.forEach((cat:any)=>{
                            item.ClientCategoryy = cat.Title;
                        })
                    }
                    MyData.push(item)

                }


            })
           
        })
        // const finalData = MyData.filter((val: any, TaskId: any, array: any) => {
        //         return array.indexOf(val) == TaskId;
        //      })
        if (MyData != undefined) {
            MyData.forEach((time: any) => {
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
        finalData?.forEach((items:any)=>{
            MyData.push(items)
        })
        setData(MyData)
        showProgressHide();
    }

    const selectType = (Dates: any) => {
        selectDatess = Dates;
        if (Dates == 'Today') {
            setcheckedWS(false)
            setcheckedCustom(false)            
            setcheckedTask(true)
            var Todaydate: any = new window.Date();
            setSelectDate(Todaydate)
            // var a = Yesterday.getDate() - 1;
            // var Datene = Moment(Yesterday).subtract(1, 'day')
            var Datenew = Moment(Todaydate).format("DD/MM/YYYY")
            checkDate = Datenew;
            GeneratedTask();
        }
        if (Dates == 'Yesterday') {
            setcheckedWS(true)
            setcheckedTask(false)
            setcheckedCustom(false)
            // selectdate = undefined
            var Yesterday: any = new window.Date();
            var Yesterdaydate = Yesterday.getDate() - 1;

            var Datene = Moment(Yesterday).subtract(1, 'day')
            var Datenew = Moment(Datene).format("DD-MM-YYYY")
            var Daten = Moment(Datene);
            setSelectDate(Daten);
            checkDate = Datenew;            
        }
       
        if (Dates == 'Custom') {
            setcheckedWS(false);
            selectdate = undefined;
            setcheckedTask(false)
            setcheckedCustom(true)
            setSelectDate(undefined);
        }




    }
    const changeHeader=(items:any)=>{
        setHeaderChange(items)
      }
    const column:any = React.useMemo<ColumnDef<any, unknown>[]>(
        () => [
            {
                accessorKey: "",
                placeholder: "",
                hasCheckbox: false,
                hasCustomExpanded: false,
                hasExpanded: false,
                isHeaderNotAvlable: true,
                size: 10,
                id: 'Id',
            },
            {
                cell: ({ row, getValue }) => (
                    <div className="alignCenter">
                       
                            <div className="alignCenter">
                                <img title={row?.original?.TaskType?.Title}
                                 src={row?.original?.SiteIcon}
                                className="workmember">     
                                  </img>
                            </div>
                       
                        {getValue()}
                    </div>
                ),
                accessorKey:'',
                id: "SiteIcon",
                placeholder: "Sites",
                header: "",
                canSort: false,
                size: 40,
            },
            {
                accessorFn: (row) => row?.NewTaskId,
                cell: ({ row, getValue }) => (
                    <>
                        <ReactPopperTooltipSingleLevel ShareWebId={getValue()} row={row?.original} AllListId={props.ContextData} singleLevel={true} masterTaskData={componentDetails} AllSitesTaskData={AllTasks} />
                    </>
                ),
                id: "TaskID",
                placeholder: "ID",
                header: "",
                resetColumnFilters: false,
                isColumnDefultSortingAsc: isColumnDefultSortingAsc,
                // isColumnDefultSortingAsc:true,
                size: 140,
            },
        

            {
                accessorFn: (row) => row?.Task,
                cell: ({ row, getValue }) => (
                    <>
                        <a data-interception="off" target="_blank" className="hreflink serviceColor_Active"
                            href={"https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Task-Profile.aspx?taskId="+ row?.original?.TaskId + '&Site=' + row?.original?.siteType}
                        >
                            {getValue()}
                        </a>

                    </>
                ),
                id: 'Task',
                header: '',
                placeholder: "Task",
                //size: 125,
               
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
                size: 100,

            },
            {
                id: 'SubComponents',
                header: '',
                accessorFn: (row) => row?.SubComponents,
                placeholder: "SubComponents",
                size: 100,
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
                size: 100,

            },
            {
                header: '',
                accessorKey: 'Effort',
                placeholder: "Effort",
                size: 45,


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
                accessorFn: (row) => row?.ClientCategory,
                cell: ({ row }) => (
                    <>
                        <ShowClintCatogory clintData={row?.original} AllMetadata={AllMetadata}/>
                    </>
                ),
                id: "ClientCategory",
                placeholder: "Client Category",
                header: "",
                resetColumnFilters: false,
                size: 95,
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
        var TotalMembers = TotalDevelopmentMember + TotalDesignMember + TotalQAMember
        var TotalleaveMembers = DesignMembers + DevelopmentMembers + QAMembers
        var TotalleaveHours = DesignMemberleaveHours + DevelopmentleaveHours+QAleaveHours;
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
            if (item.PriorityRank == undefined || item.PriorityRank == '') {
                item.PriorityRank = '';
            }
            if (item.ClientCategoryy == undefined || item.ClientCategoryy == '') {
                item.ClientCategoryy = '';
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
            + '<td style="border: 1px solid #aeabab;padding: 4px">' + `<a href='https://hhhhteams.sharepoint.com/sites/HHHH/sp/SitePages/Task-Profile.aspx?taskId=${item.TaskId}&Site=${item.siteType}'>` + '<span style="font-size:11px; font-weight:600">' + item.Task + '</span>' + '</a >' + '</td>'
            + '<td align="left" style="border: 1px solid #aeabab;padding: 4px">' + item?.Comments + '</td>'
            + '<td style="border: 1px solid #aeabab;padding: 4px">' + item?.PriorityRank + '</td>'
            + '<td style="border: 1px solid #aeabab;padding: 4px">' + item?.Effort + '</td>'
            + '<td style="border: 1px solid #aeabab;padding: 4px">' + item?.PercentComplete + '%' + '</td>'
            + '<td width="7%" style="border: 1px solid #aeabab;padding: 4px">' + item?.Status + '</td>'
            + '<td width="10%" style="border: 1px solid #aeabab;padding: 4px">' + item.userName + '</td>'
            + '<td style="border: 1px solid #aeabab;padding: 4px">' + item?.Department + '</td>'
            + '<td style="border: 1px solid #aeabab;padding: 4px">' + item?.ClientCategoryy + '</td>'
            + '</tr>'
        body1.push(text);
        })
        var text2 =
        '<tr>'
        + '<td style="border: 1px solid #aeabab;padding: 5px;width: 50%;" bgcolor="#f5f5f5">' + '<strong>' + 'Team' + '</strong>' + '</td>'        
        + '<td style="border: 1px solid #aeabab;padding: 4px">' + '<strong>' + 'Total Employees' + '</strong>' + '</td>'
        + '<td style="border: 1px solid #aeabab;padding: 4px">' + '<strong>' + 'Employees on leave' + '</strong>' + '</td>'
        + '<td style="border: 1px solid #aeabab;padding: 4px">' + '<strong>' + 'Hours' + '</strong>' + '</td>'
        + '<td style="border: 1px solid #aeabab;padding: 4px">' + '<strong>' + 'Leave Hours' + '</strong>' + '</td>'
        + '</tr>'
        + '<tr>'
        + '<td style="border: 1px solid #aeabab;padding: 5px;width: 50%;" bgcolor="#f5f5f5">' + 'Design' + '</td>'        
        + '<td style="border: 1px solid #aeabab;padding: 4px">' + TotalDesignMember + '</td>'
        + '<td style="border: 1px solid #aeabab;padding: 4px">' + DesignMembers + '</td>'
        + '<td style="border: 1px solid #aeabab;padding: 4px">' + DesignTime.toFixed(2) + '</td>'
        + '<td style="border: 1px solid #aeabab;padding: 4px">' + DesignMemberleaveHours + '</td>'
        + '</tr>'
        + '<tr>'
        + '<td style="border: 1px solid #aeabab;padding: 5px;width: 50%;" bgcolor="#f5f5f5">' + 'Development' + '</td>'        
        + '<td style="border: 1px solid #aeabab;padding: 4px">' + TotalDevelopmentMember + '</td>'
        + '<td style="border: 1px solid #aeabab;padding: 4px">' + DevelopmentMembers + '</td>'
        + '<td style="border: 1px solid #aeabab;padding: 4px">' + DevloperTime.toFixed(2) + '</td>'
        + '<td style="border: 1px solid #aeabab;padding: 4px">' + DevelopmentleaveHours + '</td>'
        + '</tr>'
        + '<tr>'
        + '<td style="border: 1px solid #aeabab;padding: 5px;width: 50%;" bgcolor="#f5f5f5">' + 'QA' + '</td>'        
        + '<td style="border: 1px solid #aeabab;padding: 4px">' + TotalQAMember + '</td>'
        + '<td style="border: 1px solid #aeabab;padding: 4px">' + QAMembers + '</td>'
        + '<td style="border: 1px solid #aeabab;padding: 4px">' + QATime.toFixed(2) + '</td>'
        + '<td style="border: 1px solid #aeabab;padding: 4px">' + QAleaveHours + '</td>'
        + '</tr>'
        + '<tr>'
        + '<td style="border: 1px solid #aeabab;padding: 5px;width: 50%;" bgcolor="#f5f5f5">' + '<strong>' + 'Total' + '</strong>' + '</td>'        
        + '<td style="border: 1px solid #aeabab;padding: 4px">' + '<strong>' + TotalMembers.toFixed(2) + '</strong>' + '</td>'
        + '<td style="border: 1px solid #aeabab;padding: 4px">' + '<strong>' + TotalleaveMembers.toFixed(2)  + '</strong>' + '</td>'
        + '<td style="border: 1px solid #aeabab;padding: 4px">' + '<strong>' + TotlaTime.toFixed(2) + '</strong>' + '</td>'
        + '<td style="border: 1px solid #aeabab;padding: 4px">' + '<strong>' + TotalleaveHours + '</strong>' + '</td>'
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
            <div className="alignCenter">
          <h2 className="heading">{headerChange != undefined && headerChange != null && headerChange != '' ? headerChange : 'Permission-Management'} </h2>
          <EditPage context={props?.ContextData} changeHeader={changeHeader} />
        </div>
                <div className='col-sm-9 pe-0'>
                    <h6 className='pull-right'><b><a  data-interception="off"
                    target="_blank" href="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/TimeReport-old.aspx">Old Time Report</a></b>
                    </h6>
                </div>
            </div>
            <div className='row' style={{padding: "0px 2px"}}>
                <div className='col-6 showDate ps-0'>
                    <input type='date' value={Moment(selectdate!= undefined?selectdate:defaultDate).format("YYYY-MM-DD")} max="9999-12-31" className='me-2' onChange={(e) => setSelectDate(e.target.value)} />
                    <label className='SpfxCheckRadio'>
                        <input type="radio" name="Custom" checked={checkedCustom} onClick={() => selectType('Custom')} className="radio" />Custom
                    </label>
                    <label className='SpfxCheckRadio'>
                        <input type="radio"  name="Yesterday" checked={checkedWS} onClick={() => selectType('Yesterday')} className="radio" />Yesterday
                    </label>
                    <label className='SpfxCheckRadio'>
                        <input type="radio" name="Today" checked={checkedTask} onClick={() => selectType('Today')} className="radio" />Today
                    </label>
                    <button className='btnCol btn btn-primary' type="submit" onClick={() => GeneratedTask()}>Generate TimeSheet</button>


                </div>
                <div className='col-sm-6 pe-0'>
                    <table className='table table-hover showTime'>
                        <thead>
                            <tr>
                                <th className='border bg-light fw-bold align-middle'>Team</th>
                                <th className='border fw-bold align-middle'>Total Employees</th>
                                <th className='border fw-bold align-middle'>Employees on leave</th>
                                <th className='border fw-bold align-middle'>Hours</th>                                
                                <th className='border fw-bold align-middle'>Leave Hours</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className='border bg-light fw-bold'>Design</td>                                
                                <td className='border'>{TotalDesignMember}</td>
                                <td className='border'>{DesignMembers}</td>
                                <td className='border'>{DesignTime.toFixed(2)}</td>
                                <td className='border'>{DesignMemberleaveHours}</td>
                            </tr>
                            <tr>
                                <td className='border bg-light fw-bold'>Development</td>                                
                                <td className='border'>{TotalDevelopmentMember}<span  title='Trainee'>({AllTrainee.length}) </span></td>
                                <td className='border'>{DevelopmentMembers}</td>
                                <td className='border'>{DevloperTime.toFixed(2)} (0)</td>
                                <td className='border'>{DevelopmentleaveHours}</td>
                            </tr>
                            <tr>
                                <td className='border bg-light fw-bold'> QA</td>                                
                                <td className='border'>{TotalQAMember}</td>
                                <td className='border'>{QAMembers}</td>
                                <td className='border'>{QATime.toFixed(2)}</td>
                                <td className='border'>{QAleaveHours}</td>
                            </tr>
                           
                            <tr>
                                <td className='border bg-light fw-bold'>Total</td>                                
                                <td className='border fw-bold'>{TotalDevelopmentMember + TotalDesignMember + TotalQAMember}</td>
                                <td className='border fw-bold'>{leaveUsers}</td>
                                <td className='border fw-bold'>{TotleTaskTime?.toFixed(2)}</td>
                                <td className='border fw-bold'>{DesignMemberleaveHours + DevelopmentleaveHours + QAleaveHours}</td>
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
               <GlobalCommanTable columns={column} data={data} callBackData={callBackData} showHeader={true} expandIcon={true} mailSend={sendEmail} showEmailIcon={true}/> </>:
                <div className="bg-f5f5 mb-2 mt-2">Oops! Time Entries not available (Might be Weekend or Holiday or No data available In this Selected Date).</div>
             }
          
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

            {!loaded ?<PageLoader/>:""}

        </>
    )
}
export default TimeReport;

function generateSortingIndicator(column: any): string | number | boolean | {} | React.ReactNodeArray | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactPortal {
    throw new Error('Function not implemented.');
}