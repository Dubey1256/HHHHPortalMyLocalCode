import * as React from 'react';
import { Web } from "sp-pnp-js";
import { arraysEqual, Modal, Panel, PanelType } from 'office-ui-fabric-react';
// import { useExpanded, useFilters, usePagination, useSortBy, useTable } from 'react-table'
import "bootstrap/dist/css/bootstrap.min.css";
import FroalaCommentBox from '../../../globalComponents/FlorarComponents/FroalaCommentBoxComponent';

import Tooltip from '../../../globalComponents/Tooltip';
import { FaAngleDown, FaAngleUp, FaPrint, FaFileExcel, FaPaintBrush, FaEdit, FaSearch, FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';

//import { Button, Table, Row, Col, Pagination, PaginationLink, PaginationItem, Input } from "reactstrap";
import {
    Column,
    Table,
    useReactTable,
    ColumnFiltersState,
    getCoreRowModel,
    getFilteredRowModel,
    getFacetedRowModel,
    //getFacetedUniqueValues,
    //getFacetedMinMaxValues,
    // getPaginationRowModel,
    sortingFns,
    getSortedRowModel,
    FilterFn,
    SortingFn,
    ColumnDef,
    flexRender,
    FilterFns,
} from '@tanstack/react-table'
import * as Moment from 'moment';
var AllUsers: any = []
let smartmetaDetails: any = [];
var AllTasks: any = []
var TaskItemRank: any = []
var AllTime: any = []
var AllTimeMigration: any = []
var checkDate: any = ''
var DevloperTime: any = 0
var QATime: any = 0
var FeedBackItemArray: any = [];
var DesignTime: any = 0
var TotalTime: any = 0
const TimeReport = () => {
    const [data, setData] = React.useState([])
    // const [checkDate, setcheckDate] = React.useState('')
    const [update, setUpdate] = React.useState(0)
    const [Editpopup, setEditpopup] = React.useState(false)
    var [selectdate, setSelectDate] = React.useState(undefined)
    const [checkedWS, setcheckedWS] = React.useState(true);
    const [checkedTask, setcheckedTask] = React.useState(false);
    const [post, setPost] = React.useState({ Title: '', ItemRank: '', Body: '' })
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [globalFilter, setGlobalFilter] = React.useState('')
    React.useEffect(() => {
        GetTaskUsers();
        GetMigrationTime();
        GetSmartmetadata();
        GetAllTimeEntry();

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
        smartmetaDetails = await web.lists
            .getById('01a34938-8c7e-4ea6-a003-cee649e8c67a')
            .items
            .select('Id', 'Title', 'IsVisible', 'ParentID', 'SmartSuggestions', 'TaxType', 'Description1', 'Item_x005F_x0020_Cover', 'listId', 'siteName', 'siteUrl', 'SortOrder', 'SmartFilters', 'Selectable', 'Parent/Id', 'Parent/Title')
            .top(4999)
            .filter("TaxType eq 'Sites'")
            .expand('Parent')
            .get()

        console.log(smartmetaDetails);
        LoadAllSiteTasks();

    }
    TaskItemRank.push([{ rankTitle: 'Select Item Rank', rank: null }, { rankTitle: '(8) Top Highlights', rank: 8 }, { rankTitle: '(7) Featured Item', rank: 7 }, { rankTitle: '(6) Key Item', rank: 6 }, { rankTitle: '(5) Relevant Item', rank: 5 }, { rankTitle: '(4) Background Item', rank: 4 }, { rankTitle: '(2) to be verified', rank: 2 }, { rankTitle: '(1) Archive', rank: 1 }, { rankTitle: '(0) No Show', rank: 0 }]);

    const LoadAllSiteTasks = () => {
        var Counter = 0;
        smartmetaDetails?.forEach(async (config: any) => {
            if (config.listId != undefined && config.listId != null && config.Parent != undefined) {
                let web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/SP');
                let AllTasksMatches = [];
                AllTasksMatches = await web.lists
                    .getById(config.listId)
                    .items
                    .select('ParentTask/Title', 'ParentTask/Id', 'Services/Title', 'ClientTime', 'Services/Id', 'Events/Id', 'Events/Title', 'ItemRank', 'Portfolio_x0020_Type', 'SiteCompositionSettings', 'SharewebTaskLevel1No',
                        'SharewebTaskLevel2No', 'TimeSpent', 'BasicImageInfo', 'OffshoreComments', 'OffshoreImageUrl', 'CompletedDate', 'Shareweb_x0020_ID',
                        'Responsible_x0020_Team/Id', 'Responsible_x0020_Team/Title', 'SharewebCategories/Id', 'SharewebCategories/Title', 'ParentTask/Shareweb_x0020_ID', 'SharewebTaskType/Id', 'SharewebTaskType/Title',
                        'SharewebTaskType/Level', 'Priority_x0020_Rank', 'Team_x0020_Members/Title', 'Team_x0020_Members/Name', 'Component/Id', 'Component/Title', 'Component/ItemType',
                        'Team_x0020_Members/Id', 'Item_x002d_Image', 'component_x0020_link', 'IsTodaysTask', 'AssignedTo/Title', 'AssignedTo/Name', 'AssignedTo/Id',
                        'ClientCategory/Id', 'ClientCategory/Title', 'FileLeafRef', 'FeedBack', 'Title', 'Id', 'PercentComplete', 'StartDate', 'DueDate', 'Comments', 'Categories', 'Status', 'Body',
                        'Mileage', 'PercentComplete', 'ClientCategory', 'Priority', 'Created', 'Modified', 'Author/Id', 'Author/Title', 'Editor/Id', 'Editor/Title'
                    )
                    .expand('ParentTask', 'Events', 'Services', 'SharewebTaskType', 'AssignedTo', 'Component', 'ClientCategory', 'Author', 'Editor', 'Team_x0020_Members', 'Responsible_x0020_Team', 'SharewebCategories')
                    .getAll(4000);

                console.log(AllTasksMatches);
                Counter++;
                console.log(AllTasksMatches.length);
                if (AllTasksMatches != undefined && AllTasksMatches.length > 0) {
                    AllTasksMatches.forEach((item: any) => {
                        item.isDrafted = false;
                        item.flag = true;
                        item.TitleNew = item.Title;
                        item.siteType = config.Title;
                        item.childs = [];
                        item.listId = config.listId;
                        item.siteUrl = 'https://hhhhteams.sharepoint.com/sites/HHHH/SP';
                        if (item.SharewebCategories.results != undefined) {
                            if (item.SharewebCategories.results.length > 0) {
                                item.SharewebCategories.results?.forEach((ind: any, value: any) => {
                                    if (value.Title.toLowerCase() == 'draft') {
                                        item.isDrafted = true;
                                    }
                                });
                            }
                        }
                    })
                    AllTasks = AllTasks.concat(AllTasksMatches);
                    if (Counter == smartmetaDetails.length) {
                        AllTasks.forEach((result: any) => {
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

                            result.chekbox = false;
                            if (result.Short_x0020_Description_x0020_On != undefined) {
                                result.Short_x0020_Description_x0020_On = result.Short_x0020_Description_x0020_On.replace(/(<([^>]+)>)/ig, '');
                            }

                            if (result.AssignedTo != undefined && result.AssignedTo.length > 0) {
                                result.AssignedTo?.forEach((Assig: any) => {
                                    if (Assig.Id != undefined) {
                                        AllUsers?.forEach((users: any) => {

                                            if (Assig.Id != undefined && users.AssingedToUser != undefined && Assig.Id == users.AssingedToUser.Id) {
                                                users.ItemCover = users.Item_x0020_Cover;
                                                result.TeamLeaderUser.push(users);
                                                result.AllTeamName += users.Title + ';';
                                            }

                                        })
                                    }
                                })
                            }
                            if (result.Responsible_x0020_Team != undefined && result.Responsible_x0020_Team.length > 0) {
                                result.Responsible_x0020_Team.forEach((Assig: any) => {
                                    if (Assig.Id != undefined) {
                                        AllUsers?.forEach((users: any) => {

                                            if (Assig.Id != undefined && users.AssingedToUser != undefined && Assig.Id == users.AssingedToUser.Id) {
                                                users.ItemCover = users.Item_x0020_Cover;
                                                result.TeamLeaderUser.push(users);
                                                result.AllTeamName += users.Title + ';';
                                            }

                                        })
                                    }
                                })
                            }


                        })

                        selectType('Yesterday')
                    }
                }
            }

            else Counter++;

        })

    }
    const GetMigrationTime = async () => {

        var AllTimeEntry: any = []
        let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
        AllTimeEntry = await web.lists
            .getById('9ed5c649-3b4e-42db-a186-778ba43c5c93')
            .items
            .select("Id,Title,TaskDate,AdditionalTimeEntry,Created,Modified,TaskTime,SortOrder,AdditionalTimeEntry,Category/Id,Category/Title,TimesheetTitle/Id,TimesheetTitle/Title,TaskALAKDigital/Id,TaskALAKDigital/Title,TaskMigration/Id,TaskMigration/Title")
            .expand("Category,TimesheetTitle,TaskMigration,TaskALAKDigital")
            .top(4999)
            .orderBy("Id", false)
            .get()

        console.log(AllTimeEntry);
        AllTimeEntry?.forEach((time: any) => {
            if (time.AdditionalTimeEntry != null && time.AdditionalTimeEntry != undefined) {
                time.AdditionalTime = JSON.parse(time.AdditionalTimeEntry)
                AllTimeMigration.push(time)
            }
        })
        console.log(AllTimeMigration)


    }
    const GetAllTimeEntry = async () => {

        var AllTimeEntry: any = []
        let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
        AllTimeEntry = await web.lists
            .getById('464fb776-e4b3-404c-8261-7d3c50ff343f')
            .items
            .select("Id,Title,TaskDate,AdditionalTimeEntry,Created,Modified,TaskTime,SortOrder,AdditionalTimeEntry,Category/Id,Category/Title,TimesheetTitle/Id,TimesheetTitle/Title,TaskHHHH/Id,TaskHHHH/Title,TaskShareweb/Id,TaskShareweb/Title,TaskEPS/Id,TaskEPS/Title,TaskQA/Id,TaskQA/Title,TaskEI/Id,TaskEI/Title,TaskOffshoreTasks/Id,TaskOffshoreTasks/Title,TaskSmallProjects/Id,TaskSmallProjects/Title")
            .expand("Category,TimesheetTitle,TaskHHHH,TaskShareweb,TaskEPS,TaskQA,TaskShareweb,TaskEI,TaskOffshoreTasks,TaskSmallProjects")
            .top(4999)
            .orderBy("Id", false)
            .get()

        console.log(AllTimeEntry);
        AllTimeEntry?.forEach((time: any) => {
            if (time.AdditionalTimeEntry != null && time.AdditionalTimeEntry != undefined) {
                time.AdditionalTime = JSON.parse(time.AdditionalTimeEntry)
                AllTime.push(time)
            }
        })
        if (AllTimeMigration != undefined && AllTimeMigration.length > 0) {
            const finalData = AllTimeMigration.filter((val: any, id: any, array: any) => {
                return array.indexOf(val) == id;
            })
            finalData.forEach((item: any) => {
                AllTime.push(item)
            })
        }
        console.log(AllTime)


    }
    const GenerateTime = () => {
        var data: any = []

        QATime = 0
        DesignTime = 0
        DevloperTime = 0
        TotalTime = 0
        var FinalSelectDate: any = []
        if (selectdate != undefined) {
            var Datenew = Moment(selectdate).format("DDMMYYYY")
            checkDate = Datenew
            setcheckedWS(false)
            setcheckedTask(false)
        }
        const finalData = AllTime.filter((val: any, id: any, array: any) => {
            return array.indexOf(val) == id;
        })
        finalData.forEach((item: any) => {
            if (item.AdditionalTime != undefined && item.AdditionalTime.length > 0) {
                item.AdditionalTime.forEach((val: any) => {
                    var dateValue = val.TaskDate?.split("/");
                    var dp = dateValue[0] + dateValue[1] + dateValue[2];
                    //var changeDate = Moment(Dateet).format("DDMMYYYY")
                    if (dp == checkDate) {

                        FinalSelectDate.push(item)
                    }
                })
            }

        })
        if (FinalSelectDate != undefined) {
            FinalSelectDate.forEach((val: any) => {
                AllTasks?.forEach((task: any) => {

                    if (val.TaskQA != undefined || val.TaskHHHH != undefined || val.TaskEPS != undefined || val.TaskEI != undefined || val.TaskShareweb != undefined || val.TaskMigration != undefined || val.TaskALAKDigital != undefined || val.TaskOffshoreTasks != undefined) {
                        if (val.TaskQA != undefined && val.TaskQA.Id == task.Id || val.TaskHHHH != undefined && val.TaskHHHH.Id == task.Id || val.TaskEPS != undefined && val.TaskEPS.Id == task.Id || val.TaskMigration != undefined && val.TaskMigration.Id == task.Id || val.TaskALAKDigital != undefined && val.TaskALAKDigital.Id == task.Id || val.TaskOffshoreTasks != undefined && val.TaskOffshoreTasks.Id == task.Id) {
                            if (val.AdditionalTime != undefined) {
                                const RemoveDuplicateTime = val.AdditionalTime.filter((val: any, id: any, array: any) => {
                                    return array.indexOf(val) == id;
                                })
                                RemoveDuplicateTime.forEach((type: any) => {
                                    var dateValue = type.TaskDate?.split("/");
                                    var dps = dateValue[0] + dateValue[1] + dateValue[2];
                                    if (dps == checkDate) {
                                        AllUsers?.forEach((user: any) => {
                                            if (user.AssingedToUserId == type.AuthorId) {
                                                task.AllTeamName = user.TimeCategory;
                                                task.userName = user.Title
                                            }
                                        })
                                        if (task.Component != undefined) {
                                            if (task.Component[0]?.ItemType == 'Component') {
                                                task.Components = task.Component[0].Title
                                            }
                                            if (task.Component[0]?.ItemType == 'SubComponent') {
                                                task.SubComponents = task.Component[0].Title
                                            }
                                            if (task.Component[0]?.ItemType == 'Feature') {
                                                task.Features = task.Component[0].Title
                                            }
                                        }
                                        task.TimeSpent = parseFloat(type.TaskTime);

                                    }
                                })
                            }
                            data.push(task)
                        }
                    }
                })
            })
            if (data != undefined) {
                data.forEach((time: any) => {
                    if (time.AllTeamName == 'Development') {
                        DevloperTime = DevloperTime + parseInt(time.TimeSpent)
                    }
                    if (time.AllTeamName == 'Design') {
                        DesignTime = DesignTime + parseInt(time.TimeSpent)
                    }
                    if (time.AllTeamName == 'QA') {
                        QATime = QATime + parseInt(time.TimeSpent)
                    }

                })
            }
        }
        selectdate = undefined;
        console.log(data)


        setData(data)
        if (checkDate == 'Today') {
            setUpdate(update + 1)
        }
    }
    const selectType = (Dates: any) => {

        if (Dates == 'Today') {
            setcheckedWS(false)
            selectdate = undefined
            setSelectDate(undefined)
            setcheckedTask(true)
            var Datenew = Moment().format("DDMMYYYY")
            checkDate = Datenew;
        }
        if (Dates == 'Yesterday') {
            setcheckedWS(true)
            setcheckedTask(false)
            selectdate = undefined
            var Yesterday: any = new window.Date();
            Yesterday.getDate() - 1;
            var Datene = Moment(Yesterday).subtract(1, 'day')
            var Datenew = Moment(Datene).format("DDMMYYYY")
            checkDate = Datenew;
        }

        if (Dates == 'Yesterday') {
            GenerateTime();
        }


    }

    const columns = React.useMemo<ColumnDef<any, unknown>[]>(
        () => [
            {
               
                accessorFn: (row) => row?.Title,
                cell: ({ row, getValue }) => (
                    <>
                        <a data-interception="off" target="_blank" className="hreflink serviceColor_Active"
                            href={"https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Task-Profile.aspx?taskId=" + row?.original?.Id + '&Site=' +  row?.original?.siteType}
                        >
                             {getValue()}
                        </a>
                       
                    </>
                ),
                id:'Title',
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
                          color: `${
                            row?.original?.Component?.length > 0
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
                accessorKey: 'TimeSpent',
                placeholder: "Effort",
                size: 50

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
                placeholder: "TimeEntryUser",

            },
            {
                header: '',
                accessorKey: 'AllTeamName',
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
    const table = useReactTable({
        data,
        columns,
        
        state: {
            columnFilters,
            globalFilter,
        },
        onColumnFiltersChange: setColumnFilters,
        // onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
       
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        // getPaginationRowModel: getPaginationRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        // getFacetedUniqueValues: getFacetedUniqueValues(),
        //getFacetedMinMaxValues: getFacetedMinMaxValues(),
        debugTable: true,
        debugHeaders: true,
        debugColumns: false,
    })
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
    function DebouncedInput({
        value: initialValue,
        onChange,
        debounce = 1000,
        ...props
    }: {
        value: string | number
        onChange: (value: string | number) => void
        debounce?: number
    } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
        const [value, setValue] = React.useState(initialValue)

        React.useEffect(() => {
            setValue(initialValue)
        }, [initialValue])

        React.useEffect(() => {
            const timeout = setTimeout(() => {
                onChange(value)
            }, debounce)

            return () => clearTimeout(timeout)
        }, [value])

        return (
            <input {...props} value={value} onChange={e => setValue(e.target.value)} />
        )
    }
    function Filter({
        column,
        table,
        placeholder
    }: {
        column: Column<any, any>;
        table: Table<any>;
        placeholder: any

    }): any {
        const columnFilterValue = column.getFilterValue();

        return (
            <input
                // type="text"
                type="search"
                value={(columnFilterValue ?? "") as string}
                onChange={(e) => column.setFilterValue(e.target.value)}
                placeholder={`${placeholder?.placeholder}`}
            // className="w-36 border shadow rounded"
            />
        );
    }
    const EditComponentPopup = () => {
        setEditpopup(true)
    }
    const closeEditPopup = () => {
        setEditpopup(false)
    }
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
                    <button className='btn btn-primary' type="submit" onClick={GenerateTime}>Generate TimeSheet</button>


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

            <DebouncedInput
                value={globalFilter ?? ''}
                onChange={(value: any) => setGlobalFilter(String(value))}
                className="p-2 font-lg shadow border border-block"
                placeholder="Search all columns..."
            />
            <div className="h-2" />
            <table className='table table-striped table-hover'>
            <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => {
                                return (
                                    <th key={header.id} colSpan={header.colSpan}>
                                        {header.isPlaceholder ? null : (
                                            <div style={{ display: "flex" }}>
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                                {header.column.getCanFilter() ? (
                                                    <div>
                                                        <Filter column={header.column} table={table} placeholder={header.column.columnDef} />
                                                    </div>
                                                ) : null}
                                                <div
                                                    {...{
                                                        className: header.column.getCanSort()
                                                            ? "cursor-pointer select-none"
                                                            : "",
                                                        onClick: header.column.getToggleSortingHandler(),
                                                    }}
                                                >
                                                    {header.column.getIsSorted()
                                                        ? { asc: <FaSortDown />, desc: <FaSortUp /> }[
                                                        header.column.getIsSorted() as string
                                                        ] ?? null
                                                        : <FaSort />}
                                                </div>
                                            </div>
                                        )}
                                    </th>
                                )
                            })}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => {
                        return (
                            <tr key={row.id}>
                                {row.getVisibleCells().map(cell => {
                                    return (
                                        <td key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    )
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <Panel
                onRenderHeader={onRenderCustomHeaderMain}
                type={PanelType.custom}
                customWidth="600px"
                isOpen={Editpopup}
                onDismiss={closeEditPopup}
                isBlocking={false}
            >
                <div className='modal-body'>
                    <div className='row mt-4'>
                        <div className='col-sm-4'>
                            <div className='form-group'>
                                <label>Name</label><br />
                                <input type="text" className="form-control" disabled={true} value={`Time Report`}></input>
                            </div>
                        </div>
                        <div className='col-sm-4'>
                            <div className='form-group'>
                                <label>Title</label><br />
                                <input type="text" className="form-control" defaultValue={`Time Report`} onChange={(e) => setPost({ ...post, Title: e.target.value })} ></input>
                            </div>
                        </div>
                        <div className='col-sm-4'>
                            <div className="input-group">
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
