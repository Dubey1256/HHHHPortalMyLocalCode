import * as React from "react";
import { Panel, PanelType } from 'office-ui-fabric-react';
import Tooltip from "../Tooltip";
import ShowClintCatogory from '../ShowClintCatogory';
import "bootstrap/dist/css/bootstrap.min.css";
import * as globalCommon from "../globalCommon";
import {
    ColumnDef,
} from "@tanstack/react-table";
import GlobalCommanTable, { IndeterminateCheckbox } from "../GroupByReactTableComponents/GlobalCommanTable";
import HighlightableCell from "../GroupByReactTableComponents/highlight";
import ShowTaskTeamMembers from "../ShowTaskTeamMembers";
import { Web } from "sp-pnp-js";
import EditInstitution from "../../webparts/EditPopupFiles/EditComponent";
import InfoIconsToolTip from "../InfoIconsToolTip/InfoIconsToolTip";
import PortfolioStructureCreationCard from "../tableControls/PortfolioStructureCreation";
import CompareTool from "../CompareTool/CompareTool";
import AddProject from "../../webparts/projectmanagementOverviewTool/components/AddProject";
import EditProjectPopup from "../EditProjectPopup";
var LinkedServicesBackupArray: any = [];
var MultiSelectedData: any = [];
let AllMetadata: any = [];
let childRefdata: any;
let copyDtaArray: any = [];
let renderData: any = [];
const ServiceComponentPortfolioPopup = ({ props, Dynamic, Call, ComponentType, selectionType, groupedData, showProject }: any) => {
    const childRef = React.useRef<any>();
    if (childRef != null) {
        childRefdata = { ...childRef };
    }
    // const [modalIsOpen, setModalIsOpen] = React.useState(true);
    const [OpenAddStructurePopup, setOpenAddStructurePopup] = React.useState(false);
    const refreshData = () => setData(() => renderData);
    const [data, setData] = React.useState([]);
    const [dataUpper, setdataUpper] = React.useState([]);
    copyDtaArray = data;
    const [CheckBoxData, setCheckBoxData] = React.useState([]);
    const [AllMetadataItems, setAllMetadataItems] = React.useState([]);
    const [SharewebComponent, setSharewebComponent] = React.useState("");
    const [AllUsers, setTaskUser] = React.useState([]);
    const [checkedList, setCheckedList] = React.useState<any>({});
    const [ShowingAllData, setShowingData] = React.useState([])
    const [PortfolitypeData, setPortfolitypeData] = React.useState([])
    const [IsComponent, setIsComponent] = React.useState(false);
    const [IsSelections, setIsSelections] = React.useState(false);
    const [IsSelectionsBelow, setIsSelectionsBelow] = React.useState(false);
    const [openCompareToolPopup, setOpenCompareToolPopup] = React.useState(false);
    const [IsUpdated, setIsUpdated] = React.useState("");
    const [isProjectopen, setisProjectopen] = React.useState(false);
    const [IsProjectPopup, setIsProjectPopup] = React.useState(false);
    
    
    const PopupType: any = props?.PopupType;
    let selectedDataArray: any = [];
    let GlobalArray: any = [];
    React.useEffect(() => {
        GetMetaData();


    },
        []);
    function Example(callBack: any, type: any, functionType: any) {
        Call(callBack, type, functionType);
        // setModalIsOpen(false);
    }
    const closePanel = (e: any) => {
        if (e != undefined && e?.type != 'mousedown')
            Example([], ComponentType, "Close");
    }
    const setModalIsOpenToOK = () => {
        try {
            if (props?.linkedComponent != undefined && props?.linkedComponent?.length == 0)
                props.linkedComponent = CheckBoxData;
            else {
                props.linkedComponent = [];
                props.linkedComponent = CheckBoxData;
            }
        } catch (e) {

        }
        // // setModalIsOpen(false);
        if (selectionType === "Multi") {
            setIsSelectionsBelow(true);
            setIsSelections(true);
            Example(MultiSelectedData, selectionType, "Save");
        } else {
       
            Example(CheckBoxData, selectionType, "Save");
        }
        
        MultiSelectedData = [];
    }

    
    const checkSelection1 = (event:any)=>{
        if(event === "SelectionsUpper"){
            if(IsSelections){
                setIsSelections(false);
                selectionType="Single;"
                
            }else{
                setIsSelections(true);
                selectionType="Multi"
                
            }
        }else if(event === "SelectionsBelow"){
            if(IsSelectionsBelow){
                setIsSelectionsBelow(false);
                selectionType="Single;"
            }else{
                setIsSelectionsBelow(true);
                selectionType="Multi"
            }
        }
        
    }
   
    const GetMetaData = async () => {
        if (Dynamic?.SmartMetadataListID != undefined) {
            try {
                let web = new Web(Dynamic?.siteUrl);
                let smartmeta = [];
                smartmeta = await web.lists
                    .getById(Dynamic?.SmartMetadataListID)
                    .items.select("Id", "IsVisible", "ParentID", "Color_x0020_Tag", "Title", "SmartSuggestions", "TaxType", "Description1", "Item_x005F_x0020_Cover", "listId", "siteName", "siteUrl", "SortOrder", "SmartFilters", "Selectable", "Parent/Id", "Parent/Title")
                    .top(5000)
                    .expand("Parent")
                    .get();
                setAllMetadataItems(AllMetadata)
                loadTaskUsers()
                getPortFolioType()
                AllMetadata = smartmeta;

            } catch (error) {
                console.log(error)

            }
        } else {
            alert('Smart Metadata List Id not present')
        }
    };

    const getPortFolioType = async () => {

        let web = new Web(Dynamic.siteUrl);
        let PortFolioType = [];
        PortFolioType = await web.lists
            .getById(Dynamic?.PortFolioTypeID)
            .items.select("Id", "Title", "Color", "IdRange")
            .get();
        setPortfolitypeData(PortFolioType);
    };
    const loadTaskUsers = async () => {
        let taskUser: any = [];
        if (Dynamic?.TaskUsertListID != undefined) {
            try {
                let web = new Web(Dynamic?.siteUrl);
                taskUser = await web.lists
                    .getById(Dynamic?.TaskUsertListID)
                    .items
                    .select("Id,UserGroupId,Suffix,IsActive,Title,Email,SortOrder,Role,showAllTimeEntry,Company,Group,ParentID1,Status,Item_x0020_Cover,AssingedToUserId,isDeleted,AssingedToUser/Title,AssingedToUser/Id,AssingedToUser/EMail,ItemType,Approver/Id,Approver/Title,Approver/Name&$expand=AssingedToUser,Approver")
                    .filter('IsActive eq 1')
                    .get();
            }
            catch (error) {
                GetComponents();
                return Promise.reject(error);
            }
            GetComponents();
            setTaskUser(taskUser);
        } else {
            alert('Task User List Id not Available')
        }
    }
    const GetComponents = async () => {
        if (groupedData?.length > 0) {
            setData(groupedData);
            LinkedServicesBackupArray = groupedData;
        } else {
            if (props?.smartComponent != undefined && props?.smartComponent?.length > 0) {
                selectedDataArray = props?.smartComponent;
            }
            let PropsObject: any = {
                MasterTaskListID: Dynamic.MasterTaskListID,
                siteUrl: Dynamic.siteUrl,
                ComponentType: ComponentType,
                TaskUserListId: Dynamic.TaskUsertListID,
                selectedItems: selectedDataArray
            }
            if (showProject == true) {
                PropsObject.projectSelection = true
            }
            GlobalArray = await globalCommon.GetServiceAndComponentAllData(PropsObject);
            if (GlobalArray?.GroupByData != undefined && GlobalArray?.GroupByData?.length > 0 && showProject != true) {
                let Selecteddata: any;

                if (props?.Portfolios?.results?.length > 0) {
                    // Selecteddata = GlobalArray?.AllData.filter((item: any) => item?.Id === props?.Portfolios?.results[0]?.Id);
                    Selecteddata = GlobalArray?.AllData.filter((item: any) => {
                        if (props?.Portfolios && props?.Portfolios?.results?.length > 0) {
                            return props?.Portfolios?.results?.some((portfolio: any) => portfolio.Id === item.Id);
                        }
                        return false;
                    });
                }else if (props.length>0 && props[0]?.Id != null) {
                    Selecteddata = GlobalArray?.AllData?.filter((item: any) => {
                        if (props && props?.length > 0) {
                            return props?.some((portfolio: any) => portfolio.Id === item.Id);
                        }
                        return false;
                    });
                }
                else{
                    Selecteddata = GlobalArray?.AllData.filter((item: any) => {
                        if (props?.Portfolios && props?.Portfolios?.length > 0) {
                            return props?.Portfolios?.some((portfolio: any) => portfolio.Id === item.Id);
                        }
                        return false;
                    });
                }
                let BackupData = JSON.parse(JSON.stringify(Selecteddata));
                BackupData.map((elem: any) => {
                    if (elem?.subRows?.length > 0) {
                        elem.subRows = []
                    }
                })
                setdataUpper(BackupData);
                setData(GlobalArray.GroupByData);
                LinkedServicesBackupArray = GlobalArray.GroupByData;
            } else if (GlobalArray?.ProjectData != undefined && GlobalArray?.ProjectData?.length > 0 && showProject == true) {
                let Selecteddata: any;

                if (props?.Portfolios?.results?.length > 0) {
                    // Selecteddata = GlobalArray?.AllData.filter((item: any) => item?.Id === props?.Portfolios?.results[0]?.Id);
                    Selecteddata = GlobalArray?.ProjectData.filter((item: any) => {
                        if (props?.Portfolios && props?.Portfolios?.results?.length > 0) {
                            return props?.Portfolios?.results?.some((portfolio: any) => portfolio.Id === item.Id);
                        }
                        return false;
                    });
                }else if (props.length>0 && props[0]?.Id != null) {
                    Selecteddata = GlobalArray?.ProjectData.filter((item: any) => {
                        if (props && props?.length > 0) {
                            return props?.some((portfolio: any) => portfolio.Id === item.Id);
                        }
                        return false;
                    });
                }
                else {
                    Selecteddata = GlobalArray?.ProjectData.filter((item: any) => {
                        if (props?.Portfolios && props?.Portfolios?.length > 0) {
                            return props?.Portfolios?.some((portfolio: any) => portfolio.Id === item.Id);
                        }
                        return false;
                    });
                }

                let BackupData = JSON.parse(JSON.stringify(Selecteddata));
                BackupData.map((elem: any) => {
                    if (elem?.subRows?.length > 0) {
                        elem.subRows = []
                    }
                })
                setdataUpper(BackupData)
                setData(GlobalArray.ProjectData);
                LinkedServicesBackupArray = GlobalArray.ProjectData;
            }
        }
        // setModalIsOpen(true);
    }


    //    add New Edit component 
    const EditComponentPopup = (item: any) => {
        item["siteUrl"] = Dynamic?.siteUrl;
        item["listName"] = "Master Tasks";
        setIsComponent(true);
        setSharewebComponent(item);
        if(showProject == true){
            setIsProjectPopup(true)
            setSharewebComponent(item);
        }
    };

    const callBackData = React.useCallback((elem: any, ShowingData: any, selectedArray: any) => {
        MultiSelectedData = [];
        if (selectionType == "Multi" && elem?.length > 0) {
            elem.map((item: any) => MultiSelectedData?.push(item?.original))
            // MultiSelectedData = elem;
        } else {
            if (elem != undefined) {
                setCheckBoxData([elem])
                console.log("elem", elem);
            } else {
                console.log("elem", elem);
            }
            if (ShowingData != undefined) {
                setShowingData([ShowingData])
            }
        }
    }, []);
    const CallBack = React.useCallback((item: any, type: any) => {
        setisProjectopen(false)
        if (type == 'Save') {
            GetComponents()
        }
    }, [])


    const onRenderCustomHeader = (
    ) => {
        return (
            <div className="d-flex full-width pb-1" >
                <div className='subheading'>
                    <span className="siteColor">
                        {showProject == true ? `Select Project` : `Select Portfolio`}
                    </span>
                </div>
                <Tooltip ComponentId="1667" />
                {/* <span onClick={() => setModalIsOpenToFalse()}><i className="svg__iconbox svg__icon--cross crossBtn me-1"></i></span> */}
            </div>
        );
    };

    const CustomFooter = () => {
        return (
            <footer className={ComponentType == "Service" ? "p-2 px-4 serviepannelgreena text-end" : "p-2 px-4 text-end"}>

                <button type="button" className="btn btn-primary me-1" onClick={setModalIsOpenToOK}>OK</button>
                <button type="button" className="btn btn-default" onClick={(e: any) => closePanel(e)}>Cancel</button>
            </footer>
        )
    }
    const columns = React.useMemo<ColumnDef<any, unknown>[]>(
        () => [
            {
                accessorKey: "",
                placeholder: "",
                hasCheckbox: true,
                hasCustomExpanded: true,
                hasExpanded: true,
                size: 55,
                id: 'Id',
            }, {
                accessorKey: "PortfolioStructureID",
                placeholder: "ID",
                size: 136,

                cell: ({ row, getValue }) => (
                    <div className="alignCenter">
                        {row?.original?.SiteIcon != undefined ? (
                            <div className="alignCenter" title="Show All Child">
                                <img title={row?.original?.TaskType?.Title} className={row?.original?.Item_x0020_Type == "SubComponent" ? "ml-12 workmember ml20 me-1" : row?.original?.Item_x0020_Type == "Feature" ? "ml-24 workmember ml20 me-1" : row?.original?.TaskType?.Title == "Activities" ? "ml-36 workmember ml20 me-1" :
                                    row?.original?.TaskType?.Title == "Workstream" ? "ml-48 workmember ml20 me-1" : row?.original?.TaskType?.Title == "Task" || row?.original?.Item_x0020_Type === "Task" && row?.original?.TaskType == undefined ? "ml-60 workmember ml20 me-1" : "workmember ml20 me-1"
                                }
                                    src={row?.original?.SiteIcon}>
                                </img>
                            </div>
                        ) : (
                            <>
                                {row?.original?.Title != "Others" ? (
                                    <div title={row?.original?.Item_x0020_Type} style={{ backgroundColor: `${row?.original?.PortfolioType?.Color}` }} className={row?.original?.Item_x0020_Type == "SubComponent" ? "ml-12 Dyicons me-1" : row?.original?.Item_x0020_Type == "Feature" ? "ml-24 Dyicons me-1" : row?.original?.TaskType?.Title == "Activities" ? "ml-36 Dyicons me-1" :
                                        row?.original?.TaskType?.Title == "Workstream" ? "ml-48 Dyicons me-1" : row?.original?.TaskType?.Title == "Task" ? "ml-60 Dyicons" : "Dyicons me-1"
                                    }>
                                        {row?.original?.SiteIconTitle}
                                    </div>
                                ) : (
                                    ""
                                )}
                            </>
                        )}
                        {getValue()}
                    </div>
                ),
            },
            {
                accessorFn: (row) => row?.Title,
                cell: ({ row, column, getValue }) => (
                    <>
                        {row?.original?.ItemCat == "Portfolio" ? <a className="hreflink serviceColor_Active" data-interception="off" target="_blank" style={row?.original?.fontColorTask != undefined ? { color: `${row?.original?.fontColorTask}` } : { color: `${row?.original?.PortfolioType?.Color}` }}
                            href={Dynamic.siteUrl + "/SitePages/Portfolio-Profile.aspx?taskId=" + row?.original?.Id}
                        >
                            <HighlightableCell value={getValue()} searchTerm={column.getFilterValue()} />
                        </a>
                            : row?.original?.ItemCat == "Project" ? <a className="hreflink serviceColor_Active" data-interception="off" target="_blank" style={row?.original?.fontColorTask != undefined ? { color: `${row?.original?.fontColorTask}` } : { color: `${row?.original?.PortfolioType?.Color}` }}
                                href={Dynamic.siteUrl + "/SitePages/Project-Management.aspx?ProjectId=" + row?.original?.Id}
                            >
                                <HighlightableCell value={getValue()} searchTerm={column.getFilterValue()} />
                            </a> : ''}

                        {row?.original?.descriptionsSearch?.length > 0 && <span className='alignIcon  mt--5 '><InfoIconsToolTip Discription={row?.original?.Body} row={row?.original} /></span>}
                    </>
                ),
                id: "Title",
                placeholder: "Title",
                header: "",
            },
            {
                accessorFn: (row) => row?.ClientCategory?.map((elem: any) => elem.Title)?.join("-"),
                cell: ({ row }) => (
                    <>
                        <ShowClintCatogory clintData={row?.original} AllMetadata={AllMetadata} />
                    </>
                ),
                id: 'ClientCategory',
                placeholder: "Client Category",
                header: "",
                size: 100,
            },
            {
                accessorFn: (row) => row?.TeamLeaderUser?.map((val: any) => val.Title)?.join("-"),
                cell: ({ row }) => (
                    <div>
                        <ShowTaskTeamMembers key={row?.original?.Id} props={row?.original} TaskUsers={AllUsers} />
                    </div>
                ),
                id: 'TeamLeaderUser',
                placeholder: "Team",
                header: "",
                size: 100,
            },
            {
                accessorKey: "PercentComplete",
                placeholder: "Status",
                header: "",
                size: 42,
            },
            {
                accessorKey: "descriptionsSearch",
                placeholder: "descriptionsSearch",
                header: "",
                resetColumnFilters: false,
                size: 100,
                id: "descriptionsSearch",
            },
            {
                accessorKey: "commentsSearch",
                placeholder: "commentsSearch",
                header: "",
                resetColumnFilters: false,
                size: 100,
                id: "commentsSearch",
            },
            {
                accessorKey: "ItemRank",
                placeholder: "Item Rank",
                header: "",
                size: 42,
            },
            {
                accessorKey: "DueDate",
                placeholder: "Due Date",
                header: "",
                size: 100,
            },
            {
                cell: ({ row, getValue }) => (
                    <>
                        {row?.original?.siteType === "Master Tasks" && (
                            <a
                                className="alignCenter"
                                href="#"
                                data-bs-toggle="tooltip"
                                data-bs-placement="auto"
                                title={"Edit " + `${row.original.Title}`}
                            >
                                {" "}
                                <span
                                    className="svg__iconbox svg__icon--edit"
                                    onClick={(e) => EditComponentPopup(row?.original)}
                                ></span>
                            </a>
                        )}

                        {getValue()}
                    </>
                ),
                id: "row?.original.Id",
                canSort: false,
                placeholder: "",
                header: "",
                size: 30
            }
        ],
        [data]
    );

    let Component = 0;
    let SubComponent = 0;
    let Feature = 0;
    let ComponentCopy = 0;
    let SubComponentCopy = 0;
    let FeatureCopy = 0;
    let FilterShowhideShwingData: any = false;
    data.map((Com) => {
        if (Com?.Item_x0020_Type == "Component") {
            Component = Component + 1;
        }
        if (Com?.Item_x0020_Type == "SubComponent") {
            SubComponent = SubComponent + 1;
        }
        if (Com?.Item_x0020_Type == "Feature") {
            Feature = Feature + 1;
        }
        Com?.subRows?.map((Sub: any) => {
            if (Sub?.Item_x0020_Type == "SubComponent") {
                SubComponent = SubComponent + 1;
            }
            if (Sub?.Item_x0020_Type == "Feature") {
                Feature = Feature + 1;
            }
            Sub?.subRows?.map((feat: any) => {
                if (feat?.Item_x0020_Type == "SubComponent") {
                    SubComponent = SubComponent + 1;
                }
                if (feat?.Item_x0020_Type == "Feature") {
                    Feature = Feature + 1;
                }
            })
        })
    })

    // Comparetool and other button
    const compareToolCallBack = React.useCallback((compareData) => {
        if (compareData != "close") {
            setOpenCompareToolPopup(false);
        } else {
            setOpenCompareToolPopup(false);
        }
    }, []);
    const openCompareTool = () => {
        setOpenCompareToolPopup(true);
    }

    const OpenAddStructureModal = () => {
       
        if(showProject == true){
            setisProjectopen(true)
        }else{
            setOpenAddStructurePopup(true);
        }
        
    };
    const onRenderCustomHeaderMain1 = () => {
        return (
            <div className="d-flex full-width pb-1">
                <div className="subheading">

                    <span className="siteColor">{`Create Component `}</span>
                </div>
                <Tooltip ComponentId={1271} />
            </div>
        );
    };

    let isOpenPopup = false;
    const AddStructureCallBackCall = React.useCallback((item) => {
        childRef?.current?.setRowSelection({});

        // Reset the subRows property to an empty array
        if (item.props?.SelectedItem) {
            item.props.SelectedItem.subRows = [];
        }

        if (!isOpenPopup) {
            if (item.CreatedItem !== undefined) {
                item.CreatedItem.forEach((obj: any) => {
                    obj.data.childs = [];
                    obj.data.subRows = [];
                    obj.data.flag = true;
                    obj.data.TitleNew = obj.data.Title;
                    obj.data.siteType = "Master Tasks";
                    obj.data.SiteIconTitle = obj?.data?.Item_x0020_Type?.charAt(0);
                    obj.data.TaskID = obj.data.PortfolioStructureID;

                    if (
                        item.props !== undefined &&
                        item.props.SelectedItem !== undefined &&
                        (item.props.SelectedItem.subRows === undefined || item.props.SelectedItem.subRows !== undefined)
                    ) {
                        item.props.SelectedItem.subRows = item.props.SelectedItem.subRows === undefined ? [] : item.props.SelectedItem.subRows;
                        item.props.SelectedItem.subRows.unshift(obj.data);
                    }
                });

                copyDtaArray = [
                    ...item.props.SelectedItem.subRows,
                    ...copyDtaArray.filter((existingItem: any) => existingItem.Id !== item.props.SelectedItem.Id)
                ];
            }

            renderData = copyDtaArray.slice();

            if (item?.CreateOpenType === 'CreatePopup') {
                const openEditItem = item?.CreatedItem !== undefined ? item.CreatedItem[0]?.data : item.data;
                setSharewebComponent(openEditItem);
                setIsComponent(true);
            }
            refreshData();
        }

        if (!isOpenPopup && item.data !== undefined) {
            item.data.subRows = [];
            item.data.flag = true;
            item.data.TitleNew = item.data.Title;
            item.data.siteType = "Master Tasks";

            if (PortfolitypeData !== undefined && PortfolitypeData.length > 0) {
                PortfolitypeData.forEach((obj: any) => {
                    if (item.data?.PortfolioTypeId !== undefined) {
                        item.data.PortfolioType = obj;
                    }
                });
            }

            item.data.SiteIconTitle = item?.data?.Item_x0020_Type?.charAt(0);
            item.data.TaskID = item.data.PortfolioStructureID;

            copyDtaArray = [
                item.data,
                ...copyDtaArray
            ];

            renderData = copyDtaArray.slice();

            if (item?.CreateOpenType === 'CreatePopup') {
                const openEditItem = item?.CreatedItem !== undefined ? item.CreatedItem[0]?.data : item.data;
                setSharewebComponent(openEditItem);
                setIsComponent(true);
            }

            refreshData();
        }

        setOpenAddStructurePopup(false);
    }, [isOpenPopup]);

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
        }

        if (itemDeleted) {
            // Remove deleted item from the array
            updatedArray = updatedArray.filter(item => item.Id !== idToDelete || item.siteType !== siteName);
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

            return false;
        };
    }
    const Callbackfrompopup = (res: any, UpdatedData: any) => {
        if (res === "Close") {
            setIsComponent(false);
        } else if (res?.data && res?.data?.ItmesDelete != true && !UpdatedData) {
            childRef?.current?.setRowSelection({});
            setIsComponent(false);


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

            if (res?.data?.PercentComplete != 0) {
                res.data.PercentComplete = res?.data?.PercentComplete * 100;
            }
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

    const customTableHeaderButtons = (
        <>
            <button type="button" className="btn btn-primary" onClick={() => OpenAddStructureModal()}>{showProject == true?"Add Project":"Add Structure" } </button>
            <button type="button" className="btn btn-primary" onClick={() => openCompareTool()}> Compare</button>
            <label className="switch me-2" htmlFor="checkbox4">
            <input checked={IsSelections} onChange={() => checkSelection1("SelectionsUpper") } type="checkbox" id="checkbox4" />
                {IsSelections === true ? <div className="slider round" title='Switch to Multi Selection' ></div> : <div title='Switch to Single Selection' className="slider round"></div>}
            </label>
        </>
    )
    const customTableHeaderButtons1 = (
        <>
            <button type="button" className="btn btn-primary" onClick={() => OpenAddStructureModal()}>{showProject == true?"Add Project":"Add Structure"}</button>
            <button type="button" className="btn btn-primary" onClick={() => openCompareTool()}> Compare</button>
            <label className="switch me-2" htmlFor="checkbox5">
            <input checked={IsSelectionsBelow} onChange={() => checkSelection1("SelectionsBelow")} type="checkbox" id="checkbox5" />
                {IsSelectionsBelow === true ? <div className="slider round" title='Switch to Multi Selection' ></div> : <div title='Switch to Single Selection' className="slider round"></div>}
            </label>
        </>
    )
    const CreateOpenCall = React.useCallback((item) => { }, []);
    // Toogle for single multi

    return (
        <Panel
            type={PanelType.custom}
            customWidth="1100px"
            isOpen={true}
            onDismiss={(e: any) => closePanel(e)}
            onRenderHeader={onRenderCustomHeader}
            isBlocking={false}
            onRenderFooter={CustomFooter}
        >
            <div className={ComponentType == "Service" ? "serviepannelgreena" : ""}>
                <div className="modal-body p-0 mt-2 mb-3 clearfix">
                    <div className="Alltable mt-10">
                    <div className="col-sm-12 p-0 smart" >
                            <div className="">
                                <GlobalCommanTable columns={columns} wrapperHeight="240px"  showHeader={true} customHeaderButtonAvailable={true} customTableHeaderButtons={customTableHeaderButtons} defultSelectedPortFolio={dataUpper} data={dataUpper} selectedData={selectedDataArray} callBackData={callBackData} multiSelect={IsSelections} />
                            </div>
                        </div>
                        {showProject !== true &&
                            <div className="tbl-headings p-2 bg-white">
                                <span className="leftsec">
                                    {ShowingAllData[0]?.FilterShowhideShwingData == true ? <label>
                                        Showing {ShowingAllData[0].ComponentCopy}  of {Component} Components
                                    </label> :
                                        <label>
                                            Showing {Component}  of {Component} Components
                                        </label>}

                                    <label className="ms-1 me-1"> | </label>
                                    {ShowingAllData[0]?.FilterShowhideShwingData == true ? <label>
                                        {ShowingAllData[0].SubComponentCopy} of {SubComponent} SubComponents
                                    </label> :
                                        <label>
                                            {SubComponent} of {SubComponent} SubComponents
                                        </label>}
                                    <label className="ms-1 me-1"> | </label>
                                    {ShowingAllData[0]?.FilterShowhideShwingData == true ? <label>
                                        {ShowingAllData[0].FeatureCopy}  of {Feature} Features
                                    </label> :
                                        <label>
                                            {Feature}  of {Feature} Features
                                        </label>}
                                </span>
                            </div>
                        }
                       
                        <div className="col-sm-12 p-0 smart">
                            <div className="">
                                <GlobalCommanTable columns={columns}  customHeaderButtonAvailable={true} customTableHeaderButtons={customTableHeaderButtons1} showHeader={true} data={data} selectedData={selectedDataArray} callBackData={callBackData} multiSelect={IsSelectionsBelow} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Panel
                onRenderHeader={onRenderCustomHeaderMain1}
                type={PanelType.large}
                isOpen={OpenAddStructurePopup}
                isBlocking={false}
                onDismiss={AddStructureCallBackCall}
            >
                <PortfolioStructureCreationCard
                    CreatOpen={CreateOpenCall}
                    Close={AddStructureCallBackCall}
                    PortfolioType={IsUpdated}
                    PropsValue={Dynamic}
                    SelectedItem={
                        checkedList != null && checkedList?.Id != undefined
                            ? checkedList
                            : props
                    }
                />
            </Panel>
            {isProjectopen && <AddProject CallBack={CallBack} items={CheckBoxData} PageName={"ProjectOverview"} AllListId={Dynamic} data={data} />}
            {openCompareToolPopup && <CompareTool isOpen={openCompareToolPopup} compareToolCallBack={compareToolCallBack} compareData={childRef?.current?.table?.getSelectedRowModel()?.flatRows} contextValue={Dynamic} />}

            {IsComponent && (
                <EditInstitution
                    item={SharewebComponent}
                    Calls={Callbackfrompopup}
                    SelectD={Dynamic}
                    portfolioTypeData={PortfolitypeData}
                >
                    {" "}
                </EditInstitution>
            )}
            {IsProjectPopup && <EditProjectPopup props={SharewebComponent} AllListId={Dynamic} Call={Call} showProgressBar={"showProgressBar"}> </EditProjectPopup>}
        </Panel >
    )
}; export default ServiceComponentPortfolioPopup;