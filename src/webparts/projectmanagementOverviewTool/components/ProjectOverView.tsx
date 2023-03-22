import * as React from 'react';
import "bootstrap/dist/css/bootstrap.min.css"; import { Button, Table, Row, Col, Pagination, PaginationLink, PaginationItem, Input } from "reactstrap";
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaAngleLeft, FaAngleRight, FaCaretDown, FaCaretRight, FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import {
    useTable,
    useSortBy,
    useFilters,
    useExpanded,
    usePagination,
    HeaderGroup,

} from 'react-table';
import { Filter, DefaultColumnFilter } from './filters';
import ShowTaskTeamMembers from '../../../globalComponents/ShowTaskTeamMembers';
import { Web } from "sp-pnp-js";
import * as Moment from 'moment';
import { Modal } from 'office-ui-fabric-react';
import AddProject from './AddProject'
import EditProjectPopup from './EditProjectPopup';
import InlineEditingcolumns from './inlineEditingcolumns';
var siteConfig: any = []
var AllTaskUsers: any = []
var Idd: number;
export default function ProjectOverview() {
    const [listIsVisible, setListIsVisible] = React.useState(false);
    const [IsComponent, setIsComponent] = React.useState(false);
    const [AllTaskUser, setAllTaskUser] = React.useState([]);
    const [AssignedTaskUser, SetAssignedTaskUser] = React.useState({ Title: '' });
    const [SharewebComponent, setSharewebComponent] = React.useState('');
    const [searchedNameData, setSearchedDataName] = React.useState([]);
    const [data, setData] = React.useState([]);
    const [AllTasks, setAllTasks]: any = React.useState([]);
    const [inputStatus, setInputStatus] = React.useState(false);
    const [EditmodalIsOpen, setEditmodalIsOpen] = React.useState(false);
    const [AddmodalIsOpen, setAddmodalIsOpen] = React.useState(false);
    // const [Masterdata,setMasterdata] = React.useState([])
    //const [QueryId, setQueryId] = React.useState()
    React.useEffect(() => {
        TaskUser()
        GetMasterData();
    }, [])
    const Call = React.useCallback((item1) => {
        GetMasterData();
        setIsComponent(false);
        showProgressHide();
    }, []);
    var showProgressBar = () => {
        $(' #SpfxProgressbar').show();
    }

    var showProgressHide = () => {
        $(' #SpfxProgressbar').hide();
    }
    const TaskUser = async () => {
        let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
        let taskUser = [];
        taskUser = await web.lists
            .getById('b318ba84-e21d-4876-8851-88b94b9dc300')
            .items
            .select("Id,UserGroupId,Suffix,Title,Email,SortOrder,Role,IsShowTeamLeader,Company,ParentID1,Status,Item_x0020_Cover,AssingedToUserId,isDeleted,AssingedToUser/Title,AssingedToUser/Id,AssingedToUser/EMail,ItemType,Approver/Id,Approver/Title,Approver/Name")
            .top(5000)
            .expand("AssingedToUser,Approver")
            .get();
        setAllTaskUser(taskUser);
        AllTaskUsers = taskUser;
        // console.log("all task user =====", taskUser)
        setSearchedDataName(taskUser)
    }
    const columns = React.useMemo(
        () => [
            {
                internalHeader: 'Title',
                accessor: 'Title',
                showSortIcon: true,
                size: 200,
                Cell: ({ row }: any) => (
                    <span>
                        <a style={{ textDecoration: "none", color: "#000066" }} href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Project-Management.aspx?ProjectId=${row?.original?.Id}`} data-interception="off" target="_blank">{row?.values?.Title}</a>
                    </span>
                )
            },
            {
                internalHeader: 'Percent Complete',
                accessor: 'PercentComplete',
                showSortIcon: true,
                width: "75px",
                Cell: ({ row }: any) => (
                    <span>
                      <InlineEditingcolumns columnName='PercentComplete' item={row.original}/>
                    </span>
                ),
            },
            {
                internalHeader: 'Priority',
                accessor: 'Priority_x0020_Rank',
                showSortIcon: true,
                width: "75px",
                Cell: ({ row }: any) => (
                    <span>
                      <InlineEditingcolumns columnName='Priority' item={row.original}/>
                    </span>
                ),
            },
            {
                internalHeader: 'Team Members',
                accessor: 'TeamMembersSearch',
                showSortIcon: true,
                width: "180px",
                Cell: ({ row }: any) => (
                    <span>
                        <ShowTaskTeamMembers props={row?.original} TaskUsers={AllTaskUser}></ShowTaskTeamMembers>
                    </span>
                )
            },
            {
                internalHeader: 'Due Date',
                showSortIcon: true,
                accessor: 'DisplayDueDate',
                width: "150px",
            },
            {
                internalHeader: '',
                id: 'Id', // 'id' is required
                isSorted: false,
                showSortIcon: false,

                Cell: ({ row }: any) => (
                    <span>
                      <img src={require('../../../Assets/ICON/edit_page.svg')}  width="25"  onClick={(e) => EditComponentPopup(row?.original)}></img>
                    </span>
                ),
            },
        ],
        [data]
    );



    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        gotoPage,
        setPageSize,
        state: { pageIndex, pageSize },
    }: any = useTable(
        {
            columns,
            data,
            defaultColumn: { Filter: DefaultColumnFilter },
            initialState: { pageIndex: 0, pageSize: 150000 },
        },
        useFilters,
        useSortBy,
        useExpanded,
        usePagination
    );
    const generateSortingIndicator = (column: any) => {
        return column.isSorted ? (column.isSortedDesc ? <FaSortDown /> : <FaSortUp />) : (column.showSortIcon ? <FaSort /> : '');
    };

    const EditComponentPopup = (item: any) => {
        item['siteUrl'] = 'https://hhhhteams.sharepoint.com/sites/HHHH/SP';
        item['listName'] = 'Master Tasks';
        // <ComponentPortPolioPopup ></ComponentPortPolioPopup>
        setIsComponent(true);
        setSharewebComponent(item);
        // <ComponentPortPolioPopup props={item}></ComponentPortPolioPopup>
    }
    const GetMasterData = async () => {
        let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
        let taskUsers: any = [];
        let Alltask: any = [];
        // var AllUsers: any = []
        Alltask = await web.lists.getById('EC34B38F-0669-480A-910C-F84E92E58ADF').items
            .select("Deliverables,TechnicalExplanations,ValueAdded,Categories,Idea,Short_x0020_Description_x0020_On,Background,Help_x0020_Information,Short_x0020_Description_x0020__x,ComponentCategory/Id,ComponentCategory/Title,Comments,HelpDescription,FeedBack,Body,Services/Title,Services/Id,Events/Id,Events/Title,SiteCompositionSettings,ShortDescriptionVerified,Portfolio_x0020_Type,BackgroundVerified,descriptionVerified,Synonyms,BasicImageInfo,OffshoreComments,OffshoreImageUrl,HelpInformationVerified,IdeaVerified,TechnicalExplanationsVerified,Deliverables,DeliverablesVerified,ValueAddedVerified,CompletedDate,Idea,ValueAdded,TechnicalExplanations,Item_x0020_Type,Sitestagging,Package,Parent/Id,Parent/Title,Short_x0020_Description_x0020_On,Short_x0020_Description_x0020__x,Short_x0020_description_x0020__x0,Admin_x0020_Notes,AdminStatus,Background,Help_x0020_Information,SharewebCategories/Id,SharewebCategories/Title,Priority_x0020_Rank,Reference_x0020_Item_x0020_Json,Team_x0020_Members/Title,Team_x0020_Members/Name,Component/Id,Component/Title,Component/ItemType,Team_x0020_Members/Id,Item_x002d_Image,component_x0020_link,IsTodaysTask,AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,AttachmentFiles/FileName,FileLeafRef,FeedBack,Title,Id,PercentComplete,Company,StartDate,DueDate,Comments,Categories,Status,WebpartId,Body,Mileage,PercentComplete,Attachments,Priority,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title, Approver/Id, Approver/Title").expand("Approver,ComponentCategory,AssignedTo,Component,Events,Services,AttachmentFiles,Author,Editor,Team_x0020_Members,SharewebCategories,Parent").top(4999).filter("Item_x0020_Type eq 'Project'").getAll();

        // if(taskUsers.ItemType=="Project"){
        // taskUsers.map((item: any) => {
        //     if (item.Item_x0020_Type != null && item.Item_x0020_Type == "Project") {
        //         Alltask.push(item)
        //     }
        Alltask.map((items: any) => {
            items.PercentComplete = (items.PercentComplete * 100).toFixed(0);

            items.AssignedUser = []
            items.TeamMembersSearch = '';
            if (items.AssignedTo != undefined) {
                items.AssignedTo.map((taskUser: any) => {
                    AllTaskUsers.map((user: any) => {
                        if (user.AssingedToUserId == taskUser.Id) {
                            if (user?.Title != undefined) {
                                items.TeamMembersSearch = items.TeamMembersSearch + ' ' + user?.Title
                            }
                        }
                    })
                })
            }
            items.DisplayDueDate = items.DueDate != null ? Moment(items.DueDate).format('DD/MM/YYYY') : ""
        })
        // })
        setAllTasks(Alltask);
        setData(Alltask);
    }
    //    Save data in master task list
    const [title, settitle] = React.useState('')
    const tableStyle = {
        display: "block",
        height: "600px",
        overflow: "auto"
    };
    //Just Check 
    // AssignedUser: '',

    // const page = React.useMemo(() => data, [data]);

    const CallBack = React.useCallback(() => {
        GetMasterData()
    }, [])
    console.log(AllTasks);
    return (
        <div>
            <div className="col-sm-12 pad0 smart">
                <div className="section-event">
                    <div >
                        <div className='header-section justify-content-between'>
                            <h2 style={{ color: "#000066", fontWeight: "600" }}>Project Management Overview</h2>
                            <div className="text-end">
                                <AddProject CallBack={CallBack} />
                            </div>
                        </div>
                        <div>
                            <Table className="SortingTable" bordered hover {...getTableProps()}>
                                <thead>
                                    {headerGroups.map((headerGroup: any) => (
                                        <tr  {...headerGroup.getHeaderGroupProps()}>
                                            {headerGroup.headers.map((column: any) => (
                                                <th  {...column.getHeaderProps()}
                                                >
                                                    <span class="Table-SortingIcon" style={{ marginTop: '-6px' }} {...column.getSortByToggleProps()} >
                                                        {column.render('Header')}
                                                        {generateSortingIndicator(column)}
                                                    </span>
                                                    <Filter column={column} />
                                                </th>
                                            ))}
                                        </tr>
                                    ))}
                                </thead>

                                <tbody {...getTableBodyProps()}>
                                    {page?.map((row: any) => {
                                        prepareRow(row)
                                        return (
                                            <tr {...row.getRowProps()}  >
                                                {row.cells.map((cell: { getCellProps: () => JSX.IntrinsicAttributes & React.ClassAttributes<HTMLTableDataCellElement> & React.TdHTMLAttributes<HTMLTableDataCellElement>; render: (arg0: string) => boolean | React.ReactChild | React.ReactFragment | React.ReactPortal; }) => {
                                                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                                })}
                                            </tr>
                                        )

                                    })}
                                </tbody>
                            </Table>
                            {/* <nav>
                    <Pagination>
                        <PaginationItem>
                            <PaginationLink onClick={() => previousPage()} disabled={!canPreviousPage}>
                                <span aria-hidden={true}>
                                    <FaAngleLeft aria-hidden={true} />
                                </span>
                            </PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink>
                                {pageIndex + 1}

                            </PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink onClick={() => nextPage()} disabled={!canNextPage}>
                                <span aria-hidden={true}>
                                    <FaAngleRight
                                        aria-hidden={true}

                                    />
                                </span>
                            </PaginationLink>
                        </PaginationItem>
                        <Col md={2}>
                            <Input
                                type='select'
                                value={pageSize}
                                onChange={onChangeInSelect}
                            >

                                {[10, 20, 30, 40, 50].map((pageSize) => (
                                    <option key={pageSize} value={pageSize}>
                                        Show {pageSize}
                                    </option>
                                ))}
                            </Input>
                        </Col>
                    </Pagination>
                </nav> */}
                        </div>
                    </div>
                </div>
            </div>
            {IsComponent && <EditProjectPopup props={SharewebComponent} Call={Call} showProgressBar={showProgressBar}> </EditProjectPopup>}

        </div>
    )
}