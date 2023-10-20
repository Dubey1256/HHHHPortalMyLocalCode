import * as React from "react";
import { usePopperTooltip } from "react-popper-tooltip";
import "react-popper-tooltip/dist/styles.css";
import { ColumnDef, } from "@tanstack/react-table";
import { FaChevronDown, FaChevronRight, FaPlus } from "react-icons/fa";
import GlobalCommanTable from "../GroupByReactTableComponents/GlobalCommanTable";
import CreateActivity from "../../webparts/servicePortfolio/components/CreateActivity";
import * as globalCommon from "../globalCommon"
import CreateWS from '../../webparts/servicePortfolio/components/CreateWS'
let AllMatsterAndTaskData: any = [];
let counterAllTaskCount: any = 0;
let checkedData = ''

export const getTooltiphierarchyWithoutGroupByTable = (row: any, completeTitle: any): any => {
    let tempTitle = '';
    for (let i = 0; i < AllMatsterAndTaskData.length; i++) {
        const Object = AllMatsterAndTaskData[i];
        if (Object.Id === row?.ParentTask?.Id && row?.siteType === Object?.siteType) {
            Object.subRows = [];
            tempTitle = `${Object?.Title} > ${completeTitle}`
            Object.subRows.push(row);
            return getTooltiphierarchyWithoutGroupByTable(Object, tempTitle);
        } else if (Object.Id === row?.Parent?.Id) {
            Object.subRows = [];
            Object.subRows.push(row);
            tempTitle = `${Object?.Title} > ${completeTitle}`
            return getTooltiphierarchyWithoutGroupByTable(Object, tempTitle);
        } else if (row?.Portfolio != undefined && Object.Id === row?.Portfolio?.Id && row?.ParentTask?.Id == undefined) {
            Object.subRows = [];
            Object.subRows.push(row);
            tempTitle = `${Object?.Title} > ${completeTitle}`
            return getTooltiphierarchyWithoutGroupByTable(Object, tempTitle);
        }

    }
    return {
        structureData: row,
        structureTitle: completeTitle
    };
};





let scrollToolitem: any = false
let pageName: any = 'hierarchyPopperToolTip'
export default function ReactPopperTooltipSingleLevel({ ShareWebId, row, masterTaskData, AllSitesTaskData, AllListId }: any) {
    AllMatsterAndTaskData = [...masterTaskData];
    AllMatsterAndTaskData = AllMatsterAndTaskData?.concat(AllSitesTaskData);

    const [controlledVisible, setControlledVisible] = React.useState(false);
    const [action, setAction] = React.useState("");
    const [hoverOverInfo, setHoverOverInfo] = React.useState("");
    const [openActivity, setOpenActivity] = React.useState(false);
    const [openWS, setOpenWS] = React.useState(false);

    const {
        getArrowProps,
        getTooltipProps,
        setTooltipRef,
        setTriggerRef,
        visible,
    } = usePopperTooltip({
        trigger: null,
        interactive: true,
        closeOnOutsideClick: false,
        placement: "auto",
        visible: controlledVisible,
        onVisibleChange: setControlledVisible,
    });

    const handlAction = (newAction: any) => {
        if (newAction === "click" && newAction === "hover") return;
        setAction(newAction);
        setControlledVisible(true);
    };

    const handleMouseLeave = () => {
        if (action === "click") return;
        setAction("");
        setControlledVisible(!controlledVisible);
    };
    const handleCloseClick = () => {
        setAction("");
        setControlledVisible(!controlledVisible);
        scrollToolitem = false;
    };

    const openActivityPopup = (row: any) => {
        if (row.TaskType == undefined) {
            setOpenActivity(true)
            row['NoteCall'] = 'Task'
            row['PageType'] = 'ProjectManagement'
            checkedData = row;
        }
        if (row?.TaskType?.Title == 'Activities') {
            setOpenWS(true)
            row['NoteCall'] = 'Task'
            row['PageType'] = 'ProjectManagement'
            checkedData = row;
        }
        if (row?.TaskType?.Title == 'Workstream') {
            setOpenActivity(true)
            row['NoteCall'] = 'Task'
            row['PageType'] = 'ProjectManagement'
            checkedData = row;
        }

    }
    /// Code bye santosh///
    const Call = (childItem: any) => {
        setOpenActivity(false)
        setOpenWS(false)

    }
    /// end////
    const tooltiphierarchy = React.useMemo(() => {
        let completeTitle = '';
        if (action === "click") {
            let result = getTooltiphierarchyWithoutGroupByTable(row, completeTitle);
            console.log(row?.TaskID, ' : ', result?.structureTitle + row?.Title)
            return [result?.structureData]
        }
        if (action === "hover") {
            let result = getTooltiphierarchyWithoutGroupByTable(row, completeTitle);
            let TaskId = row?.SiteIcon != undefined ? globalCommon.GetCompleteTaskId(row) : row?.PortfolioStructureID;
            let completedID = `${TaskId} : ${result?.structureTitle}${row?.Title}`
            setHoverOverInfo(completedID);
        }
        return [];
    }, [action]);

    const columns = React.useMemo<ColumnDef<any, unknown>[]>(
        () => [
            {
                accessorKey: "",
                placeholder: "",
                hasCustomExpanded: true,
                hasExpanded: true,
                isHeaderNotAvlable: true,
                size: 30,
                id: 'Id',
            },
            {
                accessorKey: "",
                size: 140,
                canSort: false,
                placeholder: "",
                id: 'TaskID',
                cell: ({ row, getValue }) => (
                    <div>
                        {row?.original?.SiteIcon != undefined ?
                            <a className="hreflink" title="Show All Child" data-toggle="modal">
                                <img className="icon-sites-img ml20 me-1" src={row?.original?.SiteIcon}></img>
                                <span>{row?.original?.TaskID}</span>
                            </a> : <>{row?.original?.Title != "Others" ? <div className=""><div className='Dyicons me-1'>{row?.original?.Item_x0020_Type?.toUpperCase()?.charAt(0)}
                            </div><span>{row?.original?.PortfolioStructureID}</span></div> : ""}</>}
                    </div>
                ),
            },
            {
                cell: ({ row }) => (
                    <>
                        <div>
                            {row?.original?.SiteIcon != undefined ?
                                <a
                                    className="hreflink"
                                    href={`${AllListId?.siteUrl}/SitePages/Task-Profile.aspx?taskId=${row?.original?.Id}&Site=${row?.original?.siteType}`}
                                    data-interception="off"
                                    target="_blank"
                                >
                                    {row?.original?.Title}
                                </a> : <>{row?.original?.Title != "Others" ? <a
                                    className="hreflink"
                                    data-interception="off"
                                    target="blank"
                                    href={`${AllListId?.siteUrl}/SitePages/Portfolio-Profile.aspx?taskId=${row?.original?.Id}`}
                                >
                                    <span className="d-flex">
                                        {row?.original?.Title}
                                    </span>
                                </a> : ""}</>}
                        </div>
                    </>
                ),
                id: "Title",
                canSort: false,
                placeholder: "",
                header: "",
            },
            {
                accessorKey: "",
                size: 27,
                canSort: false,
                header: "",
                placeholder: "",
                id: 'plushIcon',
                cell: ({ row }) => (
                    <div>
                        {row?.original?.TaskType?.Title != 'Task' ?
                            <span onClick={() => openActivityPopup(row.original)} className="hreflink"><FaPlus style={{ fontSize: '10px' }} /></span>
                            : ''}
                    </div>
                ),
            },
        ],
        [tooltiphierarchy]
    );
    const callBackDataToolTip = React.useCallback((expanded: any) => {
        if (expanded[0] === true) {
            scrollToolitem = true;
        } else {
            scrollToolitem = false;
        }
    }, []);
    const callBackData = React.useCallback((elem: any, ShowingData: any) => {

    }, []);
    return (
        <>
            <span
                ref={setTriggerRef}
                onMouseEnter={() => handlAction("hover")}
                onMouseLeave={() => handleMouseLeave()}
                onClick={() => handlAction("click")}
            >
                {ShareWebId}
            </span>

            {action === "click" && visible && (
                <div ref={setTooltipRef} {...getTooltipProps({ className: "tooltip-container p-0 m-0" })}>
                    <div>
                        <div className="tootltip-title">{row?.Title}</div>
                        <button className="toolTipCross" onClick={handleCloseClick}><div className="popHoverCross">×</div></button>
                    </div>

                    <div className={scrollToolitem === true ? "tool-Wrapper toolWrapper-Th scroll-toolitem" : "tool-Wrapper toolWrapper-Th"}  >
                        <GlobalCommanTable columns={columns} data={tooltiphierarchy} callBackDataToolTip={callBackDataToolTip} callBackData={callBackData} pageName={pageName} expendedTrue={true} />
                    </div>
                    <div {...getArrowProps({ className: "tooltip-arrow" })} />
                </div>
            )}
            {action === "hover" && visible && (
                <div ref={setTooltipRef} {...getTooltipProps({ className: "tooltip-container" })}>
                    <span>
                        <span>
                            <a>{hoverOverInfo}</a>
                        </span>
                    </span>
                    <div {...getArrowProps({ className: "tooltip-arrow" })} />
                </div>
            )}
            {openActivity && (
                <CreateActivity
                    selectedItem={checkedData}
                    Call={Call}
                    AllListId={AllListId}
                    context={AllListId?.Context}
                ></CreateActivity>
            )}
            {openWS && (
                <CreateWS
                selectedItem={checkedData}
                    Call={Call}
                    AllListId={AllListId}
                    context={AllListId?.Context}
                ></CreateWS>
            )}
        </>
    );
}
