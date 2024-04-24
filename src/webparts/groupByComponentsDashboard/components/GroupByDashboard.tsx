import * as React from "react";
import { Panel, PanelType } from "office-ui-fabric-react";
import { FaCompressArrowsAlt, FaFilter, } from "react-icons/fa";
import pnp, { Web } from "sp-pnp-js";
import * as globalCommon from "../../../globalComponents/globalCommon";
import ShowTaskTeamMembers from "../../../globalComponents/ShowTaskTeamMembers";
import  CreateAllStructureComponent  from "../../../globalComponents/CreateAllStructure";
import "bootstrap/dist/css/bootstrap.min.css";
import Tooltip from "../../../globalComponents/Tooltip";
import EditInstituton from "../../EditPopupFiles/EditComponent";
import { ColumnDef } from "@tanstack/react-table";
import "bootstrap/dist/css/bootstrap.min.css";
import HighlightableCell from "../../../globalComponents/GroupByReactTableComponents/highlight";
import GlobalCommanTable, { IndeterminateCheckbox } from "../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable";
import ReactPopperTooltipSingleLevel from "../../../globalComponents/Hierarchy-Popper-tooltipSilgleLevel/Hierarchy-Popper-tooltipSingleLevel";
import PageLoader from "../../../globalComponents/pageLoader";
import CompareTool from "../../../globalComponents/CompareTool/CompareTool";
import InlineEditingcolumns from "../../../globalComponents/inlineEditingcolumns";
import InfoIconsToolTip from "../../../globalComponents/InfoIconsToolTip/InfoIconsToolTip";
import TrafficLightComponent from "../../../globalComponents/TrafficLightVerification/TrafficLightComponent";
var filt: any = "";
var ContextValue: any = {};
let backupAllMaster: any = [];
let childRefdata: any;
let copyDtaArray: any = [];
let portfolioColor: any = '';
let isUpdated: any = "";
let allMasterTaskDataFlatLoadeViewBackup: any = [];
let renderData: any = [];
const GroupByDashboard = (SelectedProp: any) => {
    const childRef = React.useRef<any>();
    if (childRef != null) {
        childRefdata = { ...childRef };

    }
    try {
        if (SelectedProp?.SelectedProp != undefined) {
            SelectedProp.SelectedProp.isShowTimeEntry = JSON.parse(
                SelectedProp?.SelectedProp?.TimeEntry
            );

            SelectedProp.SelectedProp.isShowSiteCompostion = JSON.parse(
                SelectedProp?.SelectedProp?.SiteCompostion
            );
        }
    } catch (e) {
        console.log(e);
    }
    ContextValue = SelectedProp?.SelectedProp;
    const refreshData = () => setData(() => renderData);
    const [data, setData] = React.useState([]);
    copyDtaArray = data;
    const [AllUsers, setTaskUser] = React.useState([]);
    const [AllMetadata, setMetadata] = React.useState([])
    const [loaded, setLoaded] = React.useState(false);
    const [AllClientCategory, setAllClientCategory] = React.useState([])
    const [IsUpdated, setIsUpdated] = React.useState("");
    const [checkedList, setCheckedList] = React.useState<any>({});
    const [AllMasterTasksData, setAllMasterTasks] = React.useState([]);
    const [portfolioTypeData, setPortfolioTypeData] = React.useState([])
    const [taskTypeData, setTaskTypeData] = React.useState([])
    const [portfolioTypeDataItem, setPortFolioTypeIcon] = React.useState([]);
    const [taskTypeDataItem, setTaskTypeDataItem] = React.useState([]);
    const [OpenAddStructurePopup, setOpenAddStructurePopup] = React.useState(false);
    const [IsComponent, setIsComponent] = React.useState(false);
    const [CMSToolComponent, setCMSToolComponent] = React.useState("");
    const [CMSTask, setCMSTask] = React.useState("");
    const [checkedList1, setCheckedList1] = React.useState([]);
    const [topCompoIcon, setTopCompoIcon]: any = React.useState(false);
    const [precentComplete, setPrecentComplete] = React.useState([])
    const [openCompareToolPopup, setOpenCompareToolPopup] = React.useState(false);
    const rerender = React.useReducer(() => ({}), {})[1];
    const [portfolioTypeConfrigration, setPortfolioTypeConfrigration] = React.useState<any>([{ Title: 'Component', Suffix: 'C', Level: 1 }, { Title: 'SubComponent', Suffix: 'S', Level: 2 }, { Title: 'Feature', Suffix: 'F', Level: 3 }]);
    let Response: any = [];
    let TaskUsers: any = [];
    let props = undefined;


    const getTaskUsers = async () => {
        let web = new Web(ContextValue.siteUrl);
        let taskUsers = [];
        taskUsers = await web.lists
            .getById(ContextValue.TaskUsertListID)
            .items.select(
                "Id",
                "Email",
                "Suffix",
                "Title",
                "Item_x0020_Cover",
                "AssingedToUser/Title",
                "AssingedToUser/EMail",
                "AssingedToUser/Id",
                "AssingedToUser/Name",
                "UserGroup/Id",
                "ItemType"
            )
            .expand("AssingedToUser", "UserGroup")
            .get();
        Response = taskUsers;
        TaskUsers = Response;
        setTaskUser(Response);
        console.log(Response);
    };

    const getPortFolioType = async () => {
        let web = new Web(ContextValue.siteUrl);
        let PortFolioType = [];
        PortFolioType = await web.lists
            .getById(ContextValue.PortFolioTypeID)
            .items.select(
                "Id",
                "Title",
                "Color",
                "IdRange"
            )
            .get();
        setPortfolioTypeData(PortFolioType);
    };
    const getTaskType = async () => {
        let web = new Web(ContextValue.siteUrl);
        let taskTypeData = [];
        let typeData: any = [];
        taskTypeData = await web.lists
            .getById(ContextValue.TaskTypeID)
            .items.select(
                'Id',
                'Level',
                'Title',
                'SortOrder',
            )
            .get();
        setTaskTypeData(taskTypeData);
        if (taskTypeData?.length > 0 && taskTypeData != undefined) {
            taskTypeData?.forEach((obj: any) => {
                if (obj != undefined) {
                    let Item: any = {};
                    Item.Title = obj.Title;
                    Item.SortOrder = obj.SortOrder;
                    Item[obj.Title + 'number'] = 0;
                    Item[obj.Title + 'filterNumber'] = 0;
                    Item[obj.Title + 'numberCopy'] = 0;
                    typeData.push(Item);
                }
            })
            console.log("Task Type retrieved:", typeData);
            typeData = typeData.sort((elem1: any, elem2: any) => elem1.SortOrder - elem2.SortOrder);
            setTaskTypeDataItem(typeData);
        }
    };

    const GetSmartmetadata = async () => {
        let siteConfigSites: any = []
        var Priority: any = []
        let PrecentComplete: any = [];
        let Categories: any = [];
        let web = new Web(ContextValue.siteUrl);
        let smartmetaDetails: any = [];
        smartmetaDetails = await web.lists
            .getById(ContextValue.SmartMetadataListID)
            .items.select("Id", "Title", "IsVisible", "ParentID", "SmartSuggestions", "TaxType", "Configurations", "Item_x005F_x0020_Cover", "listId", "siteName", "siteUrl", "SortOrder", "SmartFilters", "Selectable", 'Color_x0020_Tag', "Parent/Id", "Parent/Title")
            .top(4999).expand("Parent").get();
        setAllClientCategory(smartmetaDetails?.filter((metadata: any) => metadata?.TaxType == 'Client Category'));
        smartmetaDetails?.map((newtest: any) => {
            // if (newtest.Title == "SDC Sites" || newtest.Title == "DRR" || newtest.Title == "Small Projects" || newtest.Title == "Shareweb Old" || newtest.Title == "Master Tasks")
            if (newtest.Title == "SDC Sites" || newtest.Title == "Shareweb Old" || newtest.Title == "Master Tasks")
                newtest.DataLoadNew = false;
            else if (newtest.TaxType == 'Sites') {
                siteConfigSites.push(newtest)
            }
            if (newtest?.TaxType == 'Priority Rank') {
                Priority?.push(newtest)
            }
            if (newtest?.TaxType === 'Percent Complete' && newtest?.Title != 'In Preparation (0-9)' && newtest?.Title != 'Ongoing (10-89)' && newtest?.Title != 'Completed (90-100)') {
                PrecentComplete.push(newtest);
            }
            if (newtest.TaxType == 'Categories') {
                Categories.push(newtest);
            }
        })
        setMetadata(smartmetaDetails);
    };
    const findPortFolioIconsAndPortfolio = async () => {
        try {
            let newarray: any = [];
            const ItemTypeColumn = "Item Type";
            console.log("Fetching portfolio icons...");
            const field = await new Web(ContextValue.siteUrl)
                .lists.getById(ContextValue?.MasterTaskListID)
                .fields.getByTitle(ItemTypeColumn)
                .get();
            console.log("Data fetched successfully:", field?.Choices);

            if (field?.Choices?.length > 0 && field?.Choices != undefined) {
                field?.Choices?.forEach((obj: any) => {
                    if (obj != undefined) {
                        let Item: any = {};
                        Item.Title = obj;
                        Item[obj + 'number'] = 0;
                        Item[obj + 'filterNumber'] = 0;
                        Item[obj + 'numberCopy'] = 0;
                        newarray.push(Item);
                    }
                })
                if (newarray.length > 0) {
                    newarray = newarray.filter((findShowPort: any) => {
                        let match = portfolioTypeConfrigration.find((config: any) => findShowPort.Title === config.Title);
                        if (match) {
                            findShowPort.Level = match?.Level;
                            findShowPort.Suffix = match?.Suffix;
                            return true
                        }
                        return false
                    });
                }
                console.log("Portfolio icons retrieved:", newarray);
                setPortFolioTypeIcon(newarray);
            }
        } catch (error) {
            console.error("Error fetching portfolio icons:", error);
        }
    };
    const GetComponents = async () => {
        if (portfolioTypeData?.length > 0) {
            portfolioTypeData?.map((elem: any) => {
                if (isUpdated === "") {
                    filt = "";
                } else if (isUpdated === elem.Title || isUpdated?.toLowerCase() === elem?.Title?.toLowerCase()) { filt = "(PortfolioType/Title eq '" + elem.Title + "')" }
            })
        }
        let componentDetails: any = [];

        componentDetails = await globalCommon.GetServiceAndComponentAllData(SelectedProp?.SelectedProp);
        console.log(componentDetails);
        componentDetails?.AllData?.forEach((result: any) => {
            if(result.HelpInformationVerified == null || result.HelpInformationVerified == undefined)
                result.HelpInformationVerified = false;
            portfolioTypeDataItem?.map((type: any) => {
                if (result?.Item_x0020_Type === type.Title && result.PortfolioType != undefined) {
                    type[type.Title + 'number'] += 1;
                    type[type.Title + 'filterNumber'] += 1;
                }
            })
        });
        try {
            allMasterTaskDataFlatLoadeViewBackup = JSON.parse(JSON.stringify(componentDetails?.AllData));
        } catch (error) {
            console.log("backup Json parse error Page Loade master task Data");
        }
        setAllMasterTasks(componentDetails?.AllData)
        backupAllMaster = componentDetails?.AllData;
        setData(componentDetails?.GroupByData)
        setLoaded(true);
    };
    React.useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        let query = params.get("PortfolioType");
        if (query) {
            setIsUpdated(query);
            isUpdated = query;
        }
    }, [])
    React.useEffect(() => {
        setLoaded(false);
        findPortFolioIconsAndPortfolio();
        GetSmartmetadata();
        getTaskUsers();
        getPortFolioType();
        getTaskType();
    }, [])
    React.useEffect(() => {
        if (AllMetadata.length > 0 && portfolioTypeData.length > 0) {
            GetComponents();
        }
    }, [AllMetadata.length > 0 && portfolioTypeData.length > 0])

    const findUserByName = (name: any) => {
        const user = AllUsers.filter(
            (user: any) => user?.AssingedToUser?.Id === name
        );
        let Image: any;
        if (user[0]?.Item_x0020_Cover != undefined) {
            Image = user[0].Item_x0020_Cover.Url;
        } else { Image = "https://hhhhteams.sharepoint.com/sites/HHHH/PublishingImages/Portraits/icon_user.jpg"; }
        return user ? Image : null;
    };
    const inlineCallBack = React.useCallback((item: any) => {
        let ComponentsData: any = [];
        let AllMasterItem = backupAllMaster;
        backupAllMaster = AllMasterItem = AllMasterItem?.map((result: any) => {
            if (result?.Id == item?.Id) {
                return { ...result, ...item };
            }
            return result;
        })

        AllMasterItem?.map((result: any) => {
            if (result?.Item_x0020_Type == 'Component') {
                const groupedResult = globalCommon?.componentGrouping(result, AllMasterItem)
                ComponentsData.push(groupedResult?.comp);
            }
        })
        setAllMasterTasks(AllMasterItem)

        setData(ComponentsData)


    }, []);

    const columns: any = React.useMemo<ColumnDef<any, unknown>[]>(
        () => [
            {
                accessorKey: "",
                placeholder: "",
                hasCheckbox: true,
                hasCustomExpanded: true,
                hasExpanded: true,
                isHeaderNotAvlable: false,
                size: 55,
                id: 'Id',
            },
            {
                accessorFn: (row) => row?.portfolioItemsSearch,
                cell: ({ row, getValue }) => (
                    <div className="alignCenter">
                        {row?.original?.SiteIcon != undefined ? (
                            <div className="alignCenter" title="Show All Child">
                                <img title={row?.original?.TaskType?.Title} className={row?.original?.Item_x0020_Type == "SubComponent" ? "ml-12 workmember ml20 me-1" : row?.original?.Item_x0020_Type == "Feature" ? "ml-24 workmember ml20 me-1" : row?.original?.TaskType?.Title == "Activities" ? "ml-36 workmember ml20 me-1" :
                                    row?.original?.TaskType?.Title == "Workstream" ? "ml-48 workmember ml20 me-1" : row?.original?.TaskType?.Title == "Task" || row?.original?.Item_x0020_Type === "Task" && row?.original?.TaskType == undefined ? "ml-60 workmember ml20 me-1" : "workmember me-1"
                                }
                                    src={row?.original?.SiteIcon}>
                                </img>
                            </div>
                        ) : (
                            <>
                                {row?.original?.Title != "Others" ? (
                                    <div title={row?.original?.Item_x0020_Type} style={{ backgroundColor: `${row?.original?.PortfolioType?.Color}` }} className={row?.original?.Item_x0020_Type == "SubComponent" ? "ml-12 Dyicons" : row?.original?.Item_x0020_Type == "Feature" ? "ml-24 Dyicons" : row?.original?.TaskType?.Title == "Activities" ? "ml-36 Dyicons" :
                                        row?.original?.TaskType?.Title == "Workstream" ? "ml-48 Dyicons" : row?.original?.TaskType?.Title == "Task" ? "ml-60 Dyicons" : "Dyicons"
                                    }>
                                        {row?.original?.SiteIconTitle}
                                    </div>
                                ) : (
                                    ""
                                )}
                            </>
                        )}
                    </div>
                ),
                id: "portfolioItemsSearch",
                placeholder: "Type",
                header: "",
                resetColumnFilters: false,
                size: 70,
                isColumnVisible: true
            },
            {
                accessorFn: (row) => row?.TaskID,
                cell: ({ row, getValue }) => (
                    <>
                        <ReactPopperTooltipSingleLevel CMSToolId={getValue()} row={row?.original} AllListId={ContextValue} singleLevel={true} masterTaskData={allMasterTaskDataFlatLoadeViewBackup} AllSitesTaskData={[]} />
                    </>
                ),
                id: "TaskID",
                placeholder: "ID",
                header: "",
                resetColumnFilters: false,
                // isColumnDefultSortingAsc:true,
                size: 95,
                isColumnVisible: true
            },
            {
                accessorFn: (row) => row?.Title,
                cell: ({ row, column, getValue }) => (
                    <div className="alignCenter">
                        <span className="columnFixedTitle">
                            {row?.original?.siteType == "Master Tasks" && row?.original?.Title !== "Others" && (
                                <a className="text-content hreflink" title={row?.original?.Title} data-interception="off" target="_blank" style={row?.original?.fontColorTask != undefined ? { color: `${row?.original?.fontColorTask}` } : { color: `${row?.original?.PortfolioType?.Color}` }}
                                    href={ContextValue.siteUrl + "/SitePages/Portfolio-Profile.aspx?taskId=" + row?.original?.ID} >
                                    <HighlightableCell value={getValue()} searchTerm={column.getFilterValue() != undefined ? column.getFilterValue() : childRef?.current?.globalFilter} />
                                </a>
                            )}
                            {row?.original?.siteType != "Master Tasks" && row?.original?.Title !== "Others" && (
                                <a className="text-content hreflink" title={row?.original?.Title} data-interception="off" target="_blank" style={row?.original?.fontColorTask != undefined ? { color: `${row?.original?.fontColorTask}` } : { color: `${row?.original?.PortfolioType?.Color}` }}
                                    href={ContextValue.siteUrl + "/SitePages/Task-Profile.aspx?taskId=" + row?.original?.ID + "&Site=" + row?.original?.siteType} >
                                    <HighlightableCell value={getValue()} searchTerm={column.getFilterValue() != undefined ? column.getFilterValue() : childRef?.current?.globalFilter} />
                                </a>
                            )}
                            {row?.original.Title === "Others" ? (
                                <span className="text-content" title={row?.original?.Title} style={row?.original?.fontColorTask != undefined ? { color: `${row?.original?.fontColorTask}` } : { color: `${row?.original?.PortfolioType?.Color}` }}>{row?.original?.Title}</span>
                            ) : (
                                ""
                            )}
                        </span>
                        {row?.original?.Categories == 'Draft' ?
                            <FaCompressArrowsAlt style={{ height: '11px', width: '20px', color: `${row?.original?.PortfolioType?.Color}` }} /> : ''}
                        {row?.original?.subRows?.length > 0 ?
                            <span className='ms-1'>{row?.original?.subRows?.length ? '(' + row?.original?.subRows?.length + ')' : ""}</span> : ''}
                        {/* {row?.original?.descriptionsSearch != null && row?.original?.descriptionsSearch != '' && (
                            <InfoIconsToolTip Discription={row?.original?.descriptionsSearch} row={row?.original} />
                        )} */}
                    </div>
                ),
                id: "Title",
                placeholder: "Title",
                resetColumnFilters: false,
                header: "",
                size: 300,
                isColumnVisible: true
            },
            {
                accessorFn: (row) => row?.FeatureTypeTitle,
                cell: ({ row }) => (
                   <div className="alignCenter">
                        <InlineEditingcolumns
                            AllListId={ContextValue}
                            TaskUsers={AllUsers}
                            callBack={inlineCallBack}
                            columnName='FeatureType'
                            item={row?.original}
                        />
                    </div>
                ),
                id: "FeatureTypeTitle",
                placeholder: "FeatureTypeTitle",
                header: "",
                resetColumnFilters: false,
                size: 200,
                isColumnVisible: true
            },
            {
                accessorFn: (row) => row?.HelpInformationVerified,
                cell: ({ row }) => (
                    <div className="alignCenter">
                        <span> <TrafficLightComponent callBack={inlineCallBack} columnName={"HelpInformationVerified"} columnData={row?.original} usedFor="GroupByComponents" /></span>
                   </div>
                ),
                id: "HelpInformationVerified",
                placeholder: "Verified",
                header: "",
                resetColumnFilters: false,
                size: 140,
                isColumnVisible: true
            },
   
            {
                accessorFn: (row) => row?.descriptionsDeliverablesSearch,
                cell: ({ row }) => (
                    <div className="alignCenter">
                        <span>{row?.original?.descriptionsDeliverablesSearch ? row?.original?.descriptionsDeliverablesSearch?.length : ""}</span>
                        {row?.original?.descriptionsDeliverablesSearch && <InfoIconsToolTip row={row?.original} SingleColumnData={"descriptionsDeliverablesSearch"} />}
                    </div>
                ),
                id: "descriptionsDeliverablesSearch",
                placeholder: "Deliverables",
                header: "",
                resetColumnFilters: false,
                size: 60,
                isColumnVisible: true
            },
            {
                accessorFn: (row) => row?.descriptionsHelpInformationSarch,
                cell: ({ row }) => (
                    <div className="alignCenter">
                        <span>{row?.original?.descriptionsHelpInformationSarch ? row?.original?.descriptionsHelpInformationSarch?.length : ""}</span>
                        {row?.original?.descriptionsHelpInformationSarch && <InfoIconsToolTip row={row?.original} SingleColumnData={"Help_x0020_Information"} />}
                    </div>
                ),
                id: "descriptionsHelpInformationSarch",
                placeholder: "Help Information",
                header: "",
                resetColumnFilters: false,
                size: 60,
                isColumnVisible: true
            },
            {
                accessorFn: (row) => row?.descriptionsShortDescriptionSearch,
                cell: ({ row }) => (
                     <div className="alignCenter">
                        <span>{row?.original?.descriptionsShortDescriptionSearch ? row?.original?.descriptionsShortDescriptionSearch?.trim()?.length : ""}</span>
                        {row?.original?.descriptionsShortDescriptionSearch && <InfoIconsToolTip row={row?.original} SingleColumnData={"Short_x0020_Description_x0020_On"} />}
                    </div>
                ),
                id: "descriptionsShortDescriptionSearch",
                placeholder: "Short Description",
                header: "",
                resetColumnFilters: false,
                size: 60,
                isColumnVisible: true
            },
            {
                accessorFn: (row) => row?.descriptionsTechnicalExplanationsSearch,
                cell: ({ row }) => (
                     <div className="alignCenter">
                        <span>{row?.original?.descriptionsTechnicalExplanationsSearch ? row?.original?.descriptionsTechnicalExplanationsSearch?.length : ""}</span>
                        {row?.original?.descriptionsTechnicalExplanationsSearch && <InfoIconsToolTip row={row?.original} SingleColumnData={"TechnicalExplanations"} />}
                    </div>
                ),
                id: "descriptionsTechnicalExplanationsSearch",
                placeholder: "Technical Explanations",
                header: "",
                resetColumnFilters: false,
                size: 60,
                isColumnVisible: true
            },
            {
                accessorFn: (row) => row?.descriptionsBodySearch,
                cell: ({ row }) => (
                    <div className="alignCenter">
                        <span>{row?.original?.descriptionsBodySearch ? row?.original?.descriptionsBodySearch?.length : ""}</span>
                        {row?.original?.descriptionsBodySearch && <InfoIconsToolTip row={row?.original} SingleColumnData={"Body"} />}
                   </div>
                ),
                id: "descriptionsBodySearch",
                placeholder: "Body",
                header: "",
                resetColumnFilters: false,
                size: 60,
                isColumnVisible: true
            },
            {
                accessorFn: (row) => row?.descriptionsAdminNotesSearch,
                cell: ({ row }) => (
                     <div className="alignCenter">
                        <span>{row?.original?.descriptionsAdminNotesSearch ? row?.original?.descriptionsAdminNotesSearch?.length : ""}</span>
                        {row?.original?.descriptionsAdminNotesSearch && <InfoIconsToolTip row={row?.original} SingleColumnData={"AdminNotes"} />}
                    </div>
                ),
                id: "descriptionsAdminNotesSearch",
                placeholder: "AdminNotes",
                header: "",
                resetColumnFilters: false,
                size: 60,
                isColumnVisible: true
            },
            {
                accessorFn: (row) => row?.descriptionsValueAddedSearch,
                cell: ({ row }) => (
                    <div className="alignCenter">
                        <span>{row?.original?.descriptionsValueAddedSearch ? row?.original?.descriptionsValueAddedSearch?.length : ""}</span>
                        {row?.original?.descriptionsValueAddedSearch && <InfoIconsToolTip row={row?.original} SingleColumnData={"ValueAdded"} />}
                    </div>
                ),
                id: "descriptionsValueAddedSearch",
                placeholder: "ValueAdded",
                header: "",
                resetColumnFilters: false,
                size: 60,
                isColumnVisible: true
            },
            {
                accessorFn: (row) => row?.descriptionsIdeaSearch,
                cell: ({ row }) => (
                    <div className="alignCenter">
                        <span>{row?.original?.descriptionsIdeaSearch ? row?.original?.descriptionsIdeaSearch?.length : ""}</span>
                        {row?.original?.descriptionsIdeaSearch && <InfoIconsToolTip row={row?.original} SingleColumnData={"Idea"} />}
                    </div>
                ),
                id: "descriptionsIdeaSearch",
                placeholder: "Idea",
                header: "",
                resetColumnFilters: false,
                size: 60,
                isColumnVisible: true
            },
            {
                accessorFn: (row) => row?.descriptionsBackgroundSearch,
                cell: ({ row }) => (
                     <div className="alignCenter">
                        <span>{row?.original?.descriptionsBackgroundSearch ? row?.original?.descriptionsBackgroundSearch?.length : ""}</span>
                        {row?.original?.descriptionsBackgroundSearch && <InfoIconsToolTip row={row?.original} SingleColumnData={"Background"} />}
                   </div>
                ),
                id: "descriptionsBackgroundSearch",
                placeholder: "Background",
                header: "",
                resetColumnFilters: false,
                size: 60,
                isColumnVisible: true
            },
          
            {
                accessorFn: (row) => row?.Created,
                cell: ({ row, column }) => (
                    <div className="alignCenter">
                        {row?.original?.Created == null ? ("") : (
                            <>
                                <div style={{ width: "75px" }} className="me-1"><HighlightableCell value={row?.original?.DisplayCreateDate} searchTerm={column.getFilterValue() != undefined ? column.getFilterValue() : childRef?.current?.globalFilter} /></div>
                                {row?.original?.Author != undefined &&
                                    <>
                                        <a className="alignCenter" href={`${ContextValue?.siteUrl}/SitePages/TaskDashboard.aspx?UserId=${row?.original?.Author?.Id}&Name=${row?.original?.Author?.Title}`}
                                            target="_blank" data-interception="off">
                                            <img title={row?.original?.Author?.Title} className="workmember ms-1" src={findUserByName(row?.original?.Author?.Id)} />
                                        </a>
                                    </>
                                }
                            </>
                        )}
                    </div>
                ),
                id: 'Created',
                resetColumnFilters: false,
                resetSorting: false,
                placeholder: "Created",
                isColumnVisible: true,
                filterFn: (row: any, columnName: any, filterValue: any) => {
                    if (row?.original?.Author?.Title?.toLowerCase()?.includes(filterValue?.toLowerCase()) || row?.original?.DisplayCreateDate?.includes(filterValue)) {
                        return true
                    } else {
                        return false
                    }
                },
                header: "",
                size: 125
            },
            {
                accessorKey: "descriptionsSearch",
                placeholder: "descriptionsSearch",
                header: "",
                resetColumnFilters: false,
                id: "descriptionsSearch",
                isColumnVisible: false
            },
            {
                accessorKey: "commentsSearch",
                placeholder: "commentsSearch",
                header: "",
                resetColumnFilters: false,
                id: "commentsSearch",
                isColumnVisible: false
            },
            {
                accessorKey: "timeSheetsDescriptionSearch",
                placeholder: "timeSheetsDescriptionSearch",
                header: "",
                resetColumnFilters: false,
                id: "timeSheetsDescriptionSearch",
                isColumnVisible: false
            },
            {
                header: ({ table }: any) => (
                    <>
                    {
                        topCompoIcon ?
                            <span style={{ backgroundColor: `${portfolioColor}` }} title="Restructure" className="Dyicons mb-1 mx-1 p-1" onClick={() => trueTopIcon(true)}>
                                <span className="svg__iconbox svg__icon--re-structure"></span>
                            </span>
                            : ''
                    }
                    </>
                ),
                cell: ({ row, getValue }) => (
                    <>
                        {row?.original?.isRestructureActive && row?.original?.Title != "Others" && (
                            <span className="Dyicons p-1" title="Restructure" style={{ backgroundColor: `${row?.original?.PortfolioType?.Color}` }} onClick={() => callChildFunction(row?.original)}>
                                <span className="svg__iconbox svg__icon--re-structure"> </span>
                            </span>
                        )}
                        {/* {getValue()} */}
                    </>
                ),
                id: "Restructure",
                canSort: false,
                placeholder: "",
                size: 1,
                isColumnVisible: true
            },
            {
                cell: ({ row }) => (
                    <>
                        {row?.original?.siteType === "Master Tasks" &&
                            row?.original?.Title !== "Others" && (
                                <a
                                    href="#"
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="auto"
                                    title={'Edit ' + `${row.original.Title}`}
                                >
                                    {" "}
                                    <span
                                        className="alignIcon svg__iconbox svg__icon--edit"
                                        onClick={(e) => EditComponentPopup(row?.original)}
                                    ></span>
                                </a>
                            )}
                    </>
                ),
                id: "editIcon",
                canSort: false,
                placeholder: "",
                header: "",
                size: 30,
                isColumnVisible: true
            },
        ],
        [data]
    );

    function deletedDataFromPortfolios(dataArray: any, idToDelete: any, siteName: any) {
        let updatedArray = [];
        let itemDeleted = false;
        for (let item of dataArray) {
            if (item.Id === idToDelete && item.siteType === siteName) {
                itemDeleted = true;
                continue;
            }
            let newItem = { ...item };
            if (newItem.subRows && newItem.subRows.length > 0) {
                newItem.subRows = deletedDataFromPortfolios(newItem.subRows, idToDelete, siteName);
            }
            updatedArray.push(newItem);
            if (itemDeleted) {
                return updatedArray;
            }
        }
        return updatedArray;
    }
    const updatedDataDataFromPortfolios = (copyDtaArray: any, dataToUpdate: any) => {
        for (let i = 0; i < copyDtaArray.length; i++) {
            if ((dataToUpdate?.Portfolio?.Id === copyDtaArray[i]?.Portfolio?.Id && dataToUpdate?.Id === copyDtaArray[i]?.Id && copyDtaArray[i]?.siteType === dataToUpdate?.siteType) || (dataToUpdate?.Id === copyDtaArray[i]?.Id && copyDtaArray[i]?.siteType === dataToUpdate?.siteType)) {
                copyDtaArray[i] = { ...copyDtaArray[i], ...dataToUpdate };
                return true;
            } else if (copyDtaArray[i].subRows) {
                if (updatedDataDataFromPortfolios(copyDtaArray[i].subRows, dataToUpdate)) {
                    return true;
                }
            }
        }
        return false;
    };
    const addedCreatedDataFromAWT = (arr: any, dataToPush: any) => {
        for (let val of arr) {
            if (dataToPush?.PortfolioId === val.Id && dataToPush?.ParentTask?.Id === undefined) {
                val.subRows = val.subRows || [];
                val?.subRows?.push(dataToPush);
                return true;
            } else if (dataToPush?.ParentTask?.Id === val.Id && dataToPush?.siteType === val?.siteType) {
                val.subRows = val.subRows || [];
                val?.subRows?.push(dataToPush);
                return true;
            } else if (val?.subRows) {
                if (addedCreatedDataFromAWT(val.subRows, dataToPush)) {
                    return true;
                }
            }
        }
        return false;
    };
    const Call = (res: any, UpdatedData: any) => {
        if (res === "Close") {
            setIsComponent(false);
        } else if (res?.data && res?.data?.ItmesDelete != true && !UpdatedData) {
            childRef?.current?.setRowSelection({});
            setIsComponent(false);
            if (addedCreatedDataFromAWT(copyDtaArray, res.data)) {
                renderData = [];
                renderData = renderData.concat(copyDtaArray)
                refreshData();
            }
        } else if (res?.data?.ItmesDelete === true && res?.data?.Id && (res?.data?.siteName || res?.data?.siteType) && !UpdatedData) {
            setIsComponent(false);
            if (res?.data?.siteName) {
                copyDtaArray = deletedDataFromPortfolios(copyDtaArray, res.data.Id, res.data.siteName);
            } else {
                copyDtaArray = deletedDataFromPortfolios(copyDtaArray, res.data.Id, res.data.siteType);
            }
            renderData = [];
            renderData = renderData.concat(copyDtaArray)
            refreshData();
        } else if (res?.data?.ItmesDelete != true && res?.data?.Id && res?.data?.siteType && UpdatedData) {
            setIsComponent(false);
            const updated = updatedDataDataFromPortfolios(copyDtaArray, res?.data);
            if (updated) {
                renderData = [];
                renderData = renderData.concat(copyDtaArray)
                refreshData();
            } else {
                console.log("Data with the specified PortfolioId was not found.");
            }

        }
    }

    const callBackData = React.useCallback((checkData: any) => {
        let array: any = [];
        if (checkData != undefined) {
            setCheckedList(checkData);
            array.push(checkData);
        } else {
            setCheckedList({});
            array = [];
        }
        setCheckedList1(array);
    }, []);


    const callBackData1 = React.useCallback((getData: any, topCompoIcon: any) => {
        renderData = [];
        renderData = renderData.concat(getData);
        refreshData();
        setTopCompoIcon(topCompoIcon);
    }, []);


    //  Function to call the child component's function
    const callChildFunction = (items: any) => {
        if (childRef.current) {
            childRef.current.callChildFunction(items);
        }
    };

    const trueTopIcon = (items: any) => {
        if (childRef.current) {
            childRef.current.trueTopIcon(items);
        }
    };
    //-------------------------------------------------- restructuring function end---------------------------------------------------------------
    //// popup Edit Task And Component///
    const EditComponentPopup = (item: any) => {
        item["siteUrl"] = ContextValue.siteUrl;
        item["listName"] = "Master Tasks";
        setIsComponent(true);
        setCMSToolComponent(item);
    };
    ///////////////////////////////////

    // Code Write by RanuSir ////
    const OpenAddStructureModal = () => {
        setOpenAddStructurePopup(true);
    };
    const openCompareTool = () => {
        setOpenCompareToolPopup(true);
    }
    const compareToolCallBack = React.useCallback((compareData) => {
        if (compareData != "close") {
            setOpenCompareToolPopup(false);
        } else {
            setOpenCompareToolPopup(false);
        }
    }, []);
    const CreateOpenCall = React.useCallback((item) => { }, []);
    let isOpenPopup = false;
    const AddStructureCallBackCall = React.useCallback((item) => {
        childRef?.current?.setRowSelection({});
      
        if (!isOpenPopup && item.CreatedItem != undefined) {
            item.CreatedItem.forEach((obj: any) => {
                obj.data.childs = [];
                obj.data.subRows = [];
                obj.data.flag = true;
                obj.data.TitleNew = obj.data.Title;
                obj.data.siteType = "Master Tasks";
                obj.data.SiteIconTitle = obj?.data?.Item_x0020_Type?.charAt(0);
                obj.data["TaskID"] = obj.data.PortfolioStructureID;
                obj.data.Author = { Id: obj.data.AuthorId }
                obj.data.Parent={Id:obj?.data?.ParentId} 
                if (
                    item.props != undefined &&
                    item.props.SelectedItem != undefined &&
                    item.props.SelectedItem.subRows != undefined
                ) {
                    item.props.SelectedItem.subRows =
                        item.props.SelectedItem.subRows == undefined
                            ? []
                            : item.props.SelectedItem.subRows;
                    item.props.SelectedItem.subRows.unshift(obj.data);
                }
            });
            if (copyDtaArray != undefined && copyDtaArray.length > 0) {
                copyDtaArray.forEach((compnew: any, index: any) => {
                    if (compnew.subRows != undefined && compnew.subRows.length > 0) {
                        item.props.SelectedItem.downArrowIcon = compnew.downArrowIcon;
                        item.props.SelectedItem.RightArrowIcon = compnew.RightArrowIcon;
                        return false;
                    }
                });
                copyDtaArray.forEach((comp: any, index: any) => {
                    if (
                        comp.Id != undefined &&
                        item.props.SelectedItem != undefined &&
                        comp.Id === item.props.SelectedItem.Id
                    ) {
                        comp.childsLength = item.props.SelectedItem.subRows.length;
                        comp.show = comp.show == undefined ? false : comp.show;
                        comp.downArrowIcon = item.props.SelectedItem.downArrowIcon;
                        comp.RightArrowIcon = item.props.SelectedItem.RightArrowIcon;

                        //comp.childs = item.props.SelectedItem.subRows;
                        comp.subRows = item.props.SelectedItem.subRows;
                    }
                    if (comp.subRows != undefined && comp.subRows.length > 0) {
                        comp.subRows.forEach((subcomp: any, index: any) => {
                            if (
                                subcomp.Id != undefined &&
                                item.props.SelectedItem != undefined &&
                                subcomp.Id === item.props.SelectedItem.Id
                            ) {
                                subcomp.childsLength = item.props.SelectedItem.subRows.length;
                                subcomp.show = subcomp.show == undefined ? false : subcomp.show;
                                subcomp.childs = item.props.SelectedItem.childs;
                                subcomp.subRows = item.props.SelectedItem.subRows;
                                comp.downArrowIcon = item.props.SelectedItem.downArrowIcon;
                                comp.RightArrowIcon = item.props.SelectedItem.RightArrowIcon;
                            }
                        });
                    }
                });
                // }
            }
            if (item?.CreateOpenType === 'CreatePopup') {
                const openEditItem = (item?.CreatedItem != undefined ? item.CreatedItem[0]?.data : item.data);
                setCMSToolComponent(openEditItem);
                setIsComponent(true);
            }
            renderData = [];
            renderData = renderData.concat(copyDtaArray)
            refreshData();
            // rerender();
        }
        if (!isOpenPopup && item.data != undefined) {
            item.data.subRows = [];
            item.data.flag = true;
            item.data.TitleNew = item.data.Title;
            item.data.Author = { Id: item.data.AuthorId }
            item.data.siteType = "Master Tasks";
            if (portfolioTypeData != undefined && portfolioTypeData.length > 0) {
                portfolioTypeData.forEach((obj: any) => {
                    if (item.data?.PortfolioTypeId != undefined)
                        item.data.PortfolioType = obj;
                })
            }
            item.data.SiteIconTitle = item?.data?.Item_x0020_Type?.charAt(0);
            item.data["TaskID"] = item.data.PortfolioStructureID;
            
            copyDtaArray.unshift(item.data);
            renderData = [];
            renderData = renderData.concat(copyDtaArray)
            if (item?.CreateOpenType === 'CreatePopup') {
                const openEditItem = (item?.CreatedItem != undefined ? item.CreatedItem[0]?.data : item.data);
                setCMSToolComponent(openEditItem);
                setIsComponent(true);
            }
            refreshData();
        }
       
        setOpenAddStructurePopup(false);
    }, []);
    const onRenderCustomHeaderMain1 = () => {
        return (
            <>
                <div className="subheading alignCenter">
                    <>
                        {checkedList != null && checkedList != undefined && checkedList?.SiteIconTitle != undefined && checkedList?.SiteIconTitle != null ? <span className="Dyicons me-2" >{checkedList?.SiteIconTitle}</span> : ''} {`${checkedList != null && checkedList != undefined && checkedList?.Title != undefined && checkedList?.Title != null ? checkedList?.Title
                            + '- Create Child Component' : 'Create Component'}`}</>
                </div>
                <Tooltip ComponentId={checkedList?.Id} />
            </>
        );
    };

    return (
        <>
            <div>
                <section className="row p-0">
                    <div className="col-sm-12 clearfix p-0">
                        <h2 className="d-flex justify-content-between align-items-center siteColor  serviceColor_Active heading ">
                            <div>GroupByComponents - Dashboard</div>
                        </h2>
                    </div>
                </section>
                <section className="Tabl1eContentSection row taskprofilepagegreen">
                    <div className="container-fluid p-0">
                        <section className="TableSection">
                            <div className="container p-0">
                                <div className="Alltable mt-2 ">
                                    <div className="col-sm-12 p-0 smart">
                                        <div>
                                            <div>
                                                <GlobalCommanTable hideAddActivityBtn={true} hideShowingTaskCountToolTip={true} showRestructureButton={true} showCompareButton={true} openCompareTool={openCompareTool}
                                                    masterTaskData={allMasterTaskDataFlatLoadeViewBackup} precentComplete={precentComplete} AllMasterTasksData={AllMasterTasksData}
                                                    ref={childRef} callChildFunction={callChildFunction} columns={columns} restructureCallBack={callBackData1}
                                                    data={data} callBackData={callBackData} TaskUsers={AllUsers} showHeader={true} portfolioColor={portfolioColor} portfolioTypeData={portfolioTypeDataItem}
                                                    taskTypeDataItem={taskTypeDataItem} fixedWidth={true} portfolioTypeConfrigration={portfolioTypeConfrigration} showingAllPortFolioCount={true}
                                                    showCreationAllButton={true} OpenAddStructureModal={OpenAddStructureModal}
                                                    bulkEditIcon={true} setData={setData} setLoaded={setLoaded} AllListId={ContextValue} columnSettingIcon={true} tableId="groupByDashBoard"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </section>
            </div>
            <Panel onRenderHeader={onRenderCustomHeaderMain1} type={PanelType.custom} customWidth="600px" isOpen={OpenAddStructurePopup} isBlocking={false} onDismiss={AddStructureCallBackCall} >
                {/* <CreateAllStructureComponent
                    CreatOpen={CreateOpenCall}
                    Close={AddStructureCallBackCall}
                    PortfolioType={IsUpdated}
                    PropsValue={ContextValue}
                    SelectedItem={
                        checkedList != null && checkedList?.Id != undefined
                            ? checkedList
                            : props
                    }
                /> */}
                   <CreateAllStructureComponent
                    Close={AddStructureCallBackCall}
                    taskUser={AllUsers}
                    portfolioTypeData={portfolioTypeData}
                    PropsValue={ContextValue}
                    SelectedItem={
                        checkedList != null && checkedList?.Id != undefined
                            ? checkedList
                            : SelectedProp?.SelectedItem
                    }
                />
            </Panel>

            {openCompareToolPopup && <CompareTool isOpen={openCompareToolPopup} compareToolCallBack={compareToolCallBack} compareData={childRef?.current?.table?.getSelectedRowModel()?.flatRows} contextValue={SelectedProp?.SelectedProp} />}
            {IsComponent && (
                <EditInstituton
                    item={CMSToolComponent}
                    Calls={Call}
                    SelectD={SelectedProp?.SelectedProp}
                    portfolioTypeData={portfolioTypeData}
                >
                </EditInstituton>
            )}
            {!loaded && <PageLoader />}
        </>
    )
}
export default GroupByDashboard;