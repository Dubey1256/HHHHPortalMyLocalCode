import * as React from 'react';
import { Web } from "sp-pnp-js";
import { arraysEqual, Modal, Panel, PanelType } from 'office-ui-fabric-react';
// import { useExpanded, useFilters, usePagination, useSortBy, useTable } from 'react-table'
import "bootstrap/dist/css/bootstrap.min.css";
import FroalaCommentBox from '../../../globalComponents/FlorarComponents/FroalaCommentBoxComponent';

import Tooltip from '../../../globalComponents/Tooltip';
import { FaAngleDown, FaAngleUp, FaPrint, FaFileExcel, FaPaintBrush, FaEdit, FaSearch, FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import GlobalCommanTable from '../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable';
import {
    ColumnDef,
} from "@tanstack/react-table";
//import { Button, Table, Row, Col, Pagination, PaginationLink, PaginationItem, Input } from "reactstrap";

import * as Moment from 'moment';
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
var checkDate: any = ''
//var DevloperTime: any = 0
//var QATime: any = 0
var FeedBackItemArray: any = [];
//var DesignTime: any = 0
var TotalTime: any = 0
const TimeReport = () => {

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
    const [Editpopup, setEditpopup] = React.useState(false)
    var [selectdate, setSelectDate] = React.useState(undefined)
    const [checkedWS, setcheckedWS] = React.useState(true);
    const [checkedTask, setcheckedTask] = React.useState(false);
    const [post, setPost] = React.useState({ Title: '', ItemRank: '', Body: '' })

    React.useEffect(() => {
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
        var selectedDate: any = []
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

    const GeneratedTask = async (Type: any) => {

        DevloperTime = 0.00;
        QATime = 0.00;
        DesignTime = 0.00;

        if (Type == "Yesterday" || Type == "Today") {
            var myDate = new Date()
            var final: any = (Moment(myDate).add(-1, 'days').format())
        }
        else {
            var myDate = new Date(selectdate)
            var final: any = (Moment(myDate).add(-1, 'days').format())
        }

        datess = new Date(final).toISOString()
        var ccc: any = []
        var selectedDate: any = []
        AllTime = []

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
    const compareDates = (selectedworkingDate: any) => {
        var flag = false;
        if (selectdate != undefined) {
            var myDate = new Date(selectdate)
            var Datenew = Moment(myDate).format("DD/MM/YYYY")
        }
        else {
            var Datenew = Moment(datess).format("DD/MM/YYYY")
        }

        var StartDates = Datenew.split("/");
        var selectedStartDate = StartDates[2] + '/' + StartDates[1] + '/' + StartDates[0];
        if (selectedStartDate == selectedworkingDate)
            flag = true;
        return flag;
    }
    const makefinalTask = (AllTime: any) => {
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
        finalTask(SelectedTime)

    }
    const finalTask = (SelectedTime: any) => {
        var MyData: any = []
        AllUsers?.forEach((val: any) => {
            SelectedTime?.forEach((item: any) => {
                if (item.AuthorId == val.AssingedToUserId) {
                    item.Department = val.TimeCategory
                    item.Company = val.Company
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
                    }
                    if (task?.Component.length == 0) {
                        item.siteUrl = task.siteUrl
                        item.siteType = item.siteType
                        item.PercentComplete = task.PercentComplete
                        item.Status = task.Status
                        item.Title = task.Title
                    }
                    if (task?.Component[0]?.ItemType == 'SubComponent') {
                        item.SubComponents = task.Component[0].Title
                        item.siteUrl = task.siteUrl
                        item.siteType = item.siteType
                        item.PercentComplete = task.PercentComplete
                        item.Status = task.Status
                        item.Title = task.Title
                    }
                    if (task?.Component[0]?.ItemType == 'Feature') {
                        item.Features = task.Component[0].Title
                        item.siteUrl = task.siteUrl
                        item.siteType = item.siteType
                        item.PercentComplete = task.PercentComplete
                        item.Status = task.Status
                        item.Title = task.Title
                    }

                }


            })
        })
        // const finalData = MyData.filter((val: any, TaskId: any, array: any) => {
        //         return array.indexOf(val) == TaskId;
        //      })
        if (SelectedTime != undefined) {
            SelectedTime.forEach((time: any) => {
                if (time?.Department == 'Development') {
                    DevloperTime = DevloperTime + parseFloat(time.Effort)
                }

                if (time?.Department == 'Design') {
                    DesignTime = DesignTime + parseFloat(time.Effort)
                }
                if (time?.Department == 'QA') {
                    QATime = QATime + parseFloat(time.Effort)
                }

            })
        }
        setData(SelectedTime)
        showProgressHide();
    }

    const selectType = (Dates: any) => {

        if (Dates == 'Today') {
            setcheckedWS(false)
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
            selectdate = undefined
            var Yesterday: any = new window.Date();
            var a = Yesterday.getDate() - 1;
            var Datene = Moment(Yesterday).subtract(1, 'day')
            var Datenew = Moment(Datene).format("DDMMYYYY")
            checkDate = Datenew;
            GeneratedTask(Dates);
        }




    }

    const column = React.useMemo<ColumnDef<any, unknown>[]>(
        () => [
            {

                accessorFn: (row) => row?.Title,
                cell: ({ row, getValue }) => (
                    <>
                        <a data-interception="off" target="_blank" className="hreflink serviceColor_Active"
                            href={"https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Task-Profile.aspx?taskId=" + row?.original?.TaskId + '&Site=' + row?.original?.siteType}
                        >
                            {getValue()}
                        </a>

                    </>
                ),
                id: 'Title',
                header: '',
                placeholder: "Title",



            },
            {
                header: '',
                accessorKey: 'Components',
                placeholder: "Components",


            },
            {
                header: '',
                accessorKey: 'SubComponents',
                placeholder: "SubComponents",
                Cell: ({ row }: any) => (
                    <span>
                        <a
                            style={{
                                textDecoration: "none",
                                color: `${row?.original?.Component?.length > 0
                                    ? "#000066"
                                    : "serviepannelgreena"
                                    }`,
                            }}
                            href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Task-Profile.aspx?taskId=${row?.original?.Id}&Site=${row?.original?.siteType}`}
                            data-interception="off"
                            target="_blank"
                        >
                        </a>
                    </span>
                ),

            },
            {
                header: '',
                accessorKey: 'Features',
                placeholder: "Features",

            },
            {
                header: '',
                accessorKey: 'Effort',
                placeholder: "Effort",


            },
            {
                header: '',
                accessorKey: 'siteType',
                placeholder: "Sites",


            },
            {
                header: '',
                accessorKey: 'PercentComplete',
                placeholder: "PercentComplete",

            },
            {
                header: '',
                accessorKey: 'Status',
                placeholder: "Status",

            },
            {
                header: '',
                accessorKey: 'userName',
                placeholder: "userName",

            },
            {
                header: '',
                accessorKey: 'Department',
                placeholder: "Designation",

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
    return (
        <>
            <div className='row'>
                <div className='col-sm-3 text-primary'>
                    <h3><b>Time Report</b>
                        <span>
                            <img src={require('../../../Assets/ICON/edit_page.svg')} width="25" onClick={(e) => EditComponentPopup()} /></span>
                    </h3>
                </div>
                <div className='col-sm-9 text-primary'>
                    <h6 className='pull-right'><b><a href="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/TimeReport.aspx">Old Time Report</a></b>
                    </h6>
                </div>
            </div>
            <div className='row'>
                <div className='col-7 mt-4'>

                    <input type='date' value={Moment(selectdate).format("YYYY-MM-DD")} max="9999-12-31 mx-3" onChange={(e) => setSelectDate(e.target.value)} />
                    <label className='mx-2'>
                        <input type="radio" checked={checkedWS} onClick={() => selectType('Yesterday')} className="me-1" />Yesterday
                    </label>
                    <label className='mx-2'>
                        <input type="radio" checked={checkedTask} onClick={() => selectType('Today')} className="me-1" />Today
                    </label>
                    <button className='btn btn-primary' type="submit" onClick={() => GeneratedTask("Custom")}>Generate TimeSheet</button>


                </div>
                <div className='col-sm-5'>
                    <table className='table table-hover'>
                        <thead>
                            <tr>
                                <th className='border bg-light'><strong>Team</strong></th>
                                <th className='border'><strong>Time In Houres</strong></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className='border bg-light'>Design</td>
                                <td className='border'>{DesignTime}</td>
                            </tr>
                            <tr>
                                <td className='border bg-light'>Development</td>
                                <td className='border'>{DevloperTime}</td>
                            </tr>
                            <tr>
                                <td className='border bg-light'> QA</td>

                                <td className='border'>{QATime}</td>
                            </tr>
                            <tr>
                                <td className='border bg-light'> <strong>Total Time</strong></td>
                                <td className='border'>{QATime + DevloperTime + DesignTime}</td>
                            </tr>

                        </tbody>
                    </table>
                </div>
            </div>

            <div className='Alltable'>

                <GlobalCommanTable columns={column} data={data} callBackData={callBackData} showHeader={true} />
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