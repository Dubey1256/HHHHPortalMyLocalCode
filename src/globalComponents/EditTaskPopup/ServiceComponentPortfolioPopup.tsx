import * as React from "react";
import { Panel, PanelType } from 'office-ui-fabric-react';
import pnp, { Web } from "sp-pnp-js";

import Tooltip from "../Tooltip";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import * as moment from "moment";
import {
    Column,
    Table,
    ExpandedState,
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getExpandedRowModel,
    ColumnDef,
    flexRender,
    getSortedRowModel,
    SortingState,
} from "@tanstack/react-table";
import { FaPrint, FaFileExcel, FaPaintBrush, FaEdit, FaSearch, FaSort, FaSortDown, FaSortUp, FaInfoCircle, FaChevronRight, FaChevronDown } from 'react-icons/fa';
import GlobalCommanTable, { IndeterminateCheckbox } from "../GlobalCommanTable";  
import HighlightableCell from "../../webparts/componentPortfolio/components/highlight";
import ShowTaskTeamMembers from "../ShowTaskTeamMembers";
var LinkedServicesBackupArray: any = [];
const ServiceComponentPortfolioPopup = ({ props, Dynamic, Call, ComponentType }: any) => {
    const [modalIsOpen, setModalIsOpen] = React.useState(false);
    const [data, setData] = React.useState([]);
    const [CheckBoxData, setCheckBoxData] = React.useState([]);
    // const [table, setTable] = React.useState(data);
    const [selectedComponent, setSelectedComponent] = React.useState('');
    const [AllUsers, setTaskUser] = React.useState([]);


    const PopupType: any = props?.PopupType;
    React.useEffect(() => {
        if (props.smartComponent != undefined && props.smartComponent.length > 0)
            setSelectedComponent(props?.smartComponent[0]);
        GetComponents();
    },
        []);
    function Example(callBack: any, type: any) {
        Call(callBack, type);
    }
    const setModalIsOpenToFalse = () => {
        Example(props, "LinkedServices");
        setModalIsOpen(false)
    }
    const setModalIsOpenToOK = () => {
        if (props.linkedComponent != undefined && props?.linkedComponent.length == 0)
            props.linkedComponent = CheckBoxData;
        else {
            props.linkedComponent = [];
            props.linkedComponent = CheckBoxData;
        }
        Example(props, "LinkedServices");
        setModalIsOpen(false);
    }
    const handleOpen = (item: any) => {
        item.show = item.show = item?.show == true ? false : true;
        setData(data => ([...data]));
    };
    var Response: [] = [];
    const GetTaskUsers = async () => {
        let web = new Web(Dynamic.siteUrl);
        let taskUsers = [];
        taskUsers = await web.lists
            .getById(Dynamic.TaskUsertListID)
            .items
            .select('Id', 'Email', 'Suffix', 'Title', 'Item_x0020_Cover', 'AssingedToUser/Title', 'AssingedToUser/Id', 'UserGroup/Id')
            .expand('AssingedToUser', 'UserGroup')
            .get();
        Response = taskUsers;
        setTaskUser(taskUsers);
    }
    const GetComponents = async () => {
        var RootComponentsData: any = [];
        var ComponentsData: any = [];
        var SubComponentsData: any = [];
        var FeatureData: any = [];
        let web = new Web(Dynamic.siteUrl);
        let componentDetails = [];
        componentDetails = await web.lists
            .getById(Dynamic.MasterTaskListID)
            .items
            .select("ID", "Title", "DueDate", "Status", "Portfolio_x0020_Type", "ItemRank", "Item_x0020_Type", 'PortfolioStructureID', "Parent/Id", "Author/Id", "Author/Title", "Parent/Title", "SharewebCategories/Id", "SharewebCategories/Title", "AssignedTo/Id", "AssignedTo/Title", "Team_x0020_Members/Id", "Team_x0020_Members/Title", "ClientCategory/Id", "ClientCategory/Title")
            .expand("Team_x0020_Members", "Author", "ClientCategory", "Parent", "SharewebCategories", "AssignedTo", "ClientCategory")
            .top(4999)
            .get()

        console.log(componentDetails);
        await GetTaskUsers();

        $.each(componentDetails, function (index: any, result: any) {
            result.TeamLeaderUser = []
            if (result.Portfolio_x0020_Type == ComponentType) {
                result.DueDate = moment(result.DueDate).format('DD/MM/YYYY')
                if (result.DueDate == 'Invalid date' || '') {
                    result.DueDate = result.DueDate.replaceAll("Invalid date", "")
                }
                if (result.PercentComplete != undefined)
                    result.PercentComplete = (result.PercentComplete * 100).toFixed(0);

                if (result.Short_x0020_Description_x0020_On != undefined) {
                    result.Short_x0020_Description_x0020_On = result.Short_x0020_Description_x0020_On.replace(/(<([^>]+)>)/ig, '');
                }
                if (result.AssignedTo != undefined && result.AssignedTo.length > 0) {
                    $.each(result.AssignedTo, function (index: any, Assig: any) {
                        if (Assig.Id != undefined) {
                            $.each(Response, function (index: any, users: any) {
                                if (Assig.Id != undefined && users.AssingedToUserId != undefined && Assig.Id == users.AssingedToUserId) {
                                    users.ItemCover = users.Item_x0020_Cover;
                                    result.TeamLeaderUser.push(users);
                                }
                            })
                        }
                    })
                }
                if (result.Team_x0020_Members != undefined && result.Team_x0020_Members.length > 0) {
                    $.each(result.Team_x0020_Members, function (index: any, Assig: any) {
                        if (Assig.Id != undefined) {
                            $.each(Response, function (index: any, users: any) {
                                if (Assig.Id != undefined && users.AssingedToUserId != undefined && Assig.Id == users.AssingedToUserId) {
                                    users.ItemCover = users.Item_x0020_Cover;
                                    result.TeamLeaderUser.push(users);
                                }

                            })
                        }
                    })
                }

                if (result.ClientCategory != undefined && result.ClientCategory.length > 0) {
                    $.each(result.Team_x0020_Members, function (index: any, categoryData: any) {
                        result.ClientCategory.push(categoryData);
                    })
                }
                if (result.Item_x0020_Type == 'Root Component') {
                    RootComponentsData.push(result);
                }
                if (result.Item_x0020_Type == 'Component') {
                    result['Child'] = [];
                    result['subRows'] = [];
                    result.SiteIconTitle = "C"
                    ComponentsData.push(result);
                }

                if (result.Item_x0020_Type == 'SubComponent') {
                    result['Child'] = [];
                    result['subRows'] = [];
                    result.SiteIconTitle = "S"
                    SubComponentsData.push(result);
                }
                if (result.Item_x0020_Type == 'Feature') {
                    result['Child'] = [];
                    result['subRows'] = [];
                    result.SiteIconTitle = "F"
                    FeatureData.push(result);
                }

            }
        });
        // $.each(SubComponentsData, function (subcomp: any) {
        //     if (subcomp.Title != undefined) {
        //         $.each(FeatureData, function (featurecomp: any) {
        //             if (featurecomp.Parent != undefined && subcomp.Id == featurecomp.Parent.Id) {
        //                 subcomp['Child'].push(featurecomp);
        //                 subcomp['subRows'].push(featurecomp);
        //             }
        //         })
        //     }
        // })
        // $.each(ComponentsData, function (index: any, subcomp: any) {
        //     if (subcomp.Title != undefined) {
        //         $.each(SubComponentsData, function (index: any, featurecomp: any) {
        //             if (featurecomp != undefined) {
        //                 if (featurecomp.Parent != undefined && subcomp.Id == featurecomp.Parent.Id) {
        //                     subcomp['Child'].push(featurecomp);
        //                     subcomp['subRows'].push(featurecomp);
        //                 }
        //             }
        //         })
        //     }
        // })
        $.each(SubComponentsData, function (index: any, subcomp: any) {
            if (subcomp.Title != undefined) {
                $.each(FeatureData, function (index: any, featurecomp: any) {
                    if (
                        featurecomp.Parent != undefined &&
                        subcomp.Id == featurecomp.Parent.Id
                    ) {
                        subcomp["Child"].push(featurecomp);
                        subcomp['subRows'].push(featurecomp);
                    }
                });
            }
        });

        $.each(ComponentsData, function (index: any, subcomp: any) {
            if (subcomp.Title != undefined) {
                $.each(SubComponentsData, function (index: any, featurecomp: any) {
                    if (
                        featurecomp.Parent != undefined &&
                        subcomp.Id == featurecomp.Parent.Id
                    ) {
                        subcomp["Child"].push(featurecomp);
                        subcomp['subRows'].push(featurecomp);
                    }
                });
            }
        });
        //maidataBackup.push(ComponentsData)
        // setmaidataBackup(ComponentsData)
        setData(ComponentsData);
        setModalIsOpen(true);
        LinkedServicesBackupArray = ComponentsData;
    }
    const onRenderCustomHeader = (
    ) => {
        return (
            <div className="d-flex full-width pb-1" >
                <div style={{ marginRight: "auto", fontSize: "20px", fontWeight: "600", marginLeft: '20px' }}>
                    <span>
                        {`Select ${ComponentType}`}
                    </span>
                </div>
                <Tooltip ComponentId="1667" />
            </div>
        );
    };
    // const sortBy = () => {
    //     const copy = data
    //     copy.sort((a, b) => (a.Title > b.Title) ? 1 : -1);
    //     setTable(copy)
    // }
    // const sortByDng = () => {
    //     const copy = data
    //     copy.sort((a, b) => (a.Title > b.Title) ? -1 : 1);
    //     setTable(copy)
    // }

    // const ColumnSearchForLinkedServices = (e: any, columnName: any) => {
    //     let searchKey = e.target.value.toLoserCase();
    //     let tempArray: any = [];
    //     if (columnName == "Title") {
    //         data?.map((dataItem: any) => {
    //             if (dataItem.Title.toLowerCase() == searchKey) {
    //                 tempArray.push(dataItem);
    //             }
    //         })
    //         setData(tempArray);
    //     }
    //     if (columnName == "Client-Category") { }
    //     if (columnName == "Team-Member") { }
    //     if (columnName == "Status") { }
    //     if (columnName == "Item-Rank") { }
    //     if (columnName == "Due-Date") { }
    //     if (searchKey.length == 0) {
    //         setData(LinkedServicesBackupArray);
    //     }
    // }
    const CustomFooter = () => {
        return (
            <div className={ComponentType == "Service" ? "me-3 p-2 serviepannelgreena text-end" : "me-3 p-2 text-end"}>
                <button type="button" className="btn btn-primary">
                    <a target="_blank" data-interception="off"
                        href={ComponentType == "Service" ? `${Dynamic.siteUrl}/SitePages/Service-Portfolio.aspx` : `${Dynamic.siteUrl}/SitePages/Component-Portfolio.aspx`}>
                        <span className="text-light"> Create New One</span>
                    </a>
                </button>
                <button type="button" className="btn btn-primary mx-1" onClick={setModalIsOpenToOK}>OK</button>
                <button type="button" className="btn btn-default" onClick={setModalIsOpenToFalse}>Cancel</button>
            </div>
        )
    }




    const columns = React.useMemo<ColumnDef<any, unknown>[]>(
        () => [
            {
                accessorKey: "PortfolioStructureID",
                placeholder: "ID",
                size: 15,
                header: ({ table }: any) => (
                    <>
                        <button className='border-0 bg-Ff'
                            {...{
                                onClick: table.getToggleAllRowsExpandedHandler(),
                            }}
                        >
                            {table.getIsAllRowsExpanded() ? <FaChevronDown /> : <FaChevronRight />}
                        </button>{" "}
                        <IndeterminateCheckbox {...{
                            checked: table.getIsAllRowsSelected(),
                            indeterminate: table.getIsSomeRowsSelected(),
                            onChange: table.getToggleAllRowsSelectedHandler(),
                        }} />{" "}
                    </>
                ),
                cell: ({ row, getValue }) => (
                    <div
                        style={row.getCanExpand() ? {
                            paddingLeft: `${row.depth * 5}px`,
                        } : {
                            paddingLeft: "18px",
                        }}
                    >
                        <>
                            {row.getCanExpand() ? (
                                <span className=' border-0'
                                    {...{
                                        onClick: row.getToggleExpandedHandler(),
                                        style: { cursor: "pointer" },
                                    }}
                                >
                                    {row.getIsExpanded() ? <FaChevronDown /> : <FaChevronRight />}
                                </span>
                            ) : (
                                ""
                            )}{" "}
                            {row?.original.Title != 'Others' ? <IndeterminateCheckbox
                                {...{
                                    checked: row.getIsSelected(),
                                    indeterminate: row.getIsSomeSelected(),
                                    onChange: row.getToggleSelectedHandler(),

                                }}
                            /> : ""}{" "}
                            {row?.original?.SiteIcon != undefined ?
                                <a className="hreflink" title="Show All Child" data-toggle="modal">
                                    <img className="icon-sites-img ml20 me-1" src={row?.original?.SiteIcon}></img>
                                </a> : <>{row?.original?.Title != "Others" ? <div className='Dyicons'>{row?.original?.SiteIconTitle}</div> : ""}</>
                            }
                            {getValue()}
                        </>
                    </div>
                ),
                // id: "row?.original.Id",
                // canSort: false,
                // placeholder: "",
                // size: 10,


            },
            {
                accessorFn: (row) => row?.Title,
                cell: ({ row, column, getValue }) => (
                    <>
                        <a className="hreflink serviceColor_Active" target="_blank"
                            href={Dynamic.siteUrl + "/SitePages/Portfolio-Profile.aspx?taskId=" + row?.original?.Id}
                        >
                            <HighlightableCell value={getValue()} searchTerm={column.getFilterValue()} />
                        </a>
                        {/* {row?.original?.Short_x0020_Description_x0020_On != null &&
                                <span className="project-tool"><img
                                    src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/infoIcon.png" /><span className="tooltipte">
                                        <span className="tooltiptext">
                                            <span className="tooltip_Desc">
                                                <span>{row?.original?.Short_x0020_Description_x0020_On}</span>
                                            </span>
                                        </span>
                                    </span>
                                </span>
                            } */}
                        {row?.original?.Short_x0020_Description_x0020_On != null &&
                            <span className='popover__wrapper ms-1' data-bs-toggle="tooltip" data-bs-placement="auto">
                                <span title="Edit" className="svg__iconbox svg__icon--info"></span>
                                <span className="popover__content">
                                    {row?.original?.Short_x0020_Description_x0020_On}
                                </span>
                            </span>}
                    </>
                ),
                id: "Title",
                placeholder: "Title",
                header: "",
                size: 27,
            },
            {
                accessorFn: (row) => row?.ClientCategory?.map((elem: any) => elem.Title).join("-"),
                cell: ({ row }) => (
                    <>
                        {row?.original?.ClientCategory?.map((elem: any) => {
                            return (
                                <> <span title={elem?.Title} className="ClientCategory-Usericon">{elem?.Title?.slice(0, 2).toUpperCase()}</span></>
                            )
                        })}
                    </>
                ),
                id: 'ClientCategory',
                placeholder: "Client Category",
                header: "",
                size: 15,
            },
            {
                accessorFn: (row) => row?.TeamLeaderUser?.map((val: any) => val.Title).join("-"),
                cell: ({ row }) => (
                    <div>
                        <ShowTaskTeamMembers key={row?.original?.Id} props={row?.original} TaskUsers={AllUsers} />
                    </div>
                ),
                id: 'TeamLeaderUser',
                placeholder: "Team",
                header: "",
                size: 15,
            },
            {
                accessorKey: "PercentComplete",
                placeholder: "Status",
                header: "",
                size: 7,
            },
            {
                accessorKey: "ItemRank",
                placeholder: "Item Rank",
                header: "",
                size: 7,
            },
            {
                accessorKey: "DueDate",
                placeholder: "Due Date",
                header: "",
                size: 9,
            },
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
    // const [AfterSearch, setAfterSearch]=React.useState([])

    // const showingDataFunction =()=>{
    //     if (AfterSearch != undefined && AfterSearch.length > 0) {
    //         AfterSearch?.map((Comp: any) => {
    //             if (Comp.columnFilters.Title == true || Comp.columnFilters.PortfolioStructureID == true || Comp.columnFilters.ClientCategory == true || Comp.columnFilters.TeamLeaderUser == true || Comp.columnFilters.PercentComplete == true || Comp.columnFilters.ItemRank == true || Comp.columnFilters.DueDate == true) {
    //                 FilterShowhideShwingData = true;
    //             }
    //             if (Comp.original != undefined) {
    //                 if (Comp?.original?.Item_x0020_Type == "Component") {
    //                     ComponentCopy = ComponentCopy + 1
    //                 }
    //                 if (Comp?.original?.Item_x0020_Type == "SubComponent") {
    //                     SubComponentCopy = SubComponentCopy + 1;
    //                 }
    //                 if (Comp?.original?.Item_x0020_Type == "Feature") {
    //                     FeatureCopy = FeatureCopy + 1;
    //                 }
    //             }
    //         })
    //     }
    // }
    // React.useEffect(()=>{
    //     showingDataFunction();
    // },[AfterSearch])
    const [ShowingAllData, setShowingData] = React.useState([])
    console.log("ShowingAllData", ShowingAllData)
    // const refreshData = () => setShowingData(() => ShowingAllData);

    const callBackData = React.useCallback((elem: any, ShowingData: any) => {
        if (elem != undefined) {
            setCheckBoxData([elem])
            console.log("elem", elem);
        } else {
            console.log("elem", elem);
        }
        if (ShowingData != undefined) {
            // setShowingData((ShowingData) => ShowingData);
            setShowingData([ShowingData])
            // refreshData()
        }
    }, []);

    return (
        <Panel  type={PanelType.custom} customWidth="1100px"  isOpen={modalIsOpen}   onDismiss={setModalIsOpenToFalse} onRenderHeader={onRenderCustomHeader}
            isBlocking={false}
            onRenderFooter={CustomFooter}
        >
            <div className={ComponentType == "Service" ? "serviepannelgreena" : ""}>
                <div className="modal-body p-0 mt-2">
                    <div className="Alltable mt-10">
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
                        <div className="col-sm-12 p-0 smart">
                            <div className="wrapper">
                                <GlobalCommanTable columns={columns} data={data} callBackData={callBackData} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Panel >
    )
}; export default ServiceComponentPortfolioPopup;
