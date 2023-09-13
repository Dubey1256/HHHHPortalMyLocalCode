import * as React from "react";
import { Panel, PanelType } from 'office-ui-fabric-react';
import Tooltip from "../Tooltip";
import "bootstrap/dist/css/bootstrap.min.css";
import * as globalCommon from "../globalCommon";
import {
    ColumnDef,
} from "@tanstack/react-table";
import GlobalCommanTable, { IndeterminateCheckbox } from "../GroupByReactTableComponents/GlobalCommanTable";
import HighlightableCell from "../GroupByReactTableComponents/highlight";
import ShowTaskTeamMembers from "../ShowTaskTeamMembers";
var LinkedServicesBackupArray: any = [];
var MultiSelectedData: any = [];
const ServiceComponentPortfolioPopup = ({ props, Dynamic, Call, ComponentType, selectionType }: any) => {
    const [modalIsOpen, setModalIsOpen] = React.useState(false);
    const [data, setData] = React.useState([]);
    const [CheckBoxData, setCheckBoxData] = React.useState([]);
    const [selectedComponent, setSelectedComponent] = React.useState([]);
    const [AllUsers, setTaskUser] = React.useState([]);
    const [ShowingAllData, setShowingData] = React.useState([])
    const PopupType: any = props?.PopupType;
    let selectedDataArray: any = [];
    let GlobalArray: any = [];
    React.useEffect(() => {
        if (props.smartComponent != undefined && props.smartComponent.length > 0)
            setSelectedComponent(props?.smartComponent);
        GetComponents();

    },
        []);
    function Example(callBack: any, type: any, functionType: any) {
        Call(callBack, type, functionType);
    }
    const setModalIsOpenToFalse = () => {
        Example([], ComponentType, "Close");
    }
    const setModalIsOpenToOK = () => {
        if (props.linkedComponent != undefined && props?.linkedComponent.length == 0)
            props.linkedComponent = CheckBoxData;
        else {
            props.linkedComponent = [];
            props.linkedComponent = CheckBoxData;
        }
        setModalIsOpen(false);
        if (selectionType == "Multi") {
            Example(MultiSelectedData, selectionType, "Save");
        } else {
            Example(CheckBoxData, selectionType, "Save");
        }
        MultiSelectedData = [];
    }
    const handleOpen = (item: any) => {
        item.show = item.show = item?.show == true ? false : true;
        setData(data => ([...data]));
    };
    const GetComponents = async () => {

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
        GlobalArray = await globalCommon.GetServiceAndComponentAllData(PropsObject);
        if (GlobalArray?.GroupByData != undefined && GlobalArray?.GroupByData?.length > 0) {
            setData(GlobalArray.GroupByData);
            LinkedServicesBackupArray = GlobalArray.GroupByData;
        }
        setModalIsOpen(true);
    }


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


    const onRenderCustomHeader = (
    ) => {
        return (
            <div className="d-flex full-width pb-1" >
                <div style={{ marginRight: "auto", fontSize: "20px", fontWeight: "600", marginLeft: '20px' }}>
                    <span className="siteColor">
                        {`Select Portfolio`}
                    </span>
                </div>
                <Tooltip ComponentId="1667" />
            </div>
        );
    };

    const CustomFooter = () => {
        return (
            <footer className={ComponentType == "Service" ? "me-3 p-2 serviepannelgreena text-end" : "me-3 p-2 text-end"}>

                <button type="button" className="btn btn-primary me-1" onClick={setModalIsOpenToOK}>OK</button>
                <button type="button" className="btn btn-default" onClick={setModalIsOpenToFalse}>Cancel</button>
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
                size: 100,

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
                        {getValue()}
                    </div>
                ),
            },
            {
                accessorFn: (row) => row?.Title,
                cell: ({ row, column, getValue }) => (
                    <>
                        <a className="hreflink serviceColor_Active" target="_blank" style={row?.original?.fontColorTask != undefined ? { color: `${row?.original?.fontColorTask}` } : { color: `${row?.original?.PortfolioType?.Color}` }}
                            href={Dynamic.siteUrl + "/SitePages/Portfolio-Profile.aspx?taskId=" + row?.original?.Id}
                        >
                            <HighlightableCell value={getValue()} searchTerm={column.getFilterValue()} />
                        </a>

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
                size: 100,
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
                size: 100,
            },
            {
                accessorKey: "PercentComplete",
                placeholder: "Status",
                header: "",
                size: 42,
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

    return (
        <Panel
            type={PanelType.custom}
            customWidth="1100px"
            isOpen={modalIsOpen}
            onDismiss={setModalIsOpenToFalse}
            onRenderHeader={onRenderCustomHeader}
            isBlocking={modalIsOpen}
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
                                <GlobalCommanTable columns={columns} showHeader={true} data={data} selectedData={selectedDataArray} callBackData={callBackData} multiSelect={selectionType == 'Multi' ? true : false} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Panel >
    )
}; export default ServiceComponentPortfolioPopup;
