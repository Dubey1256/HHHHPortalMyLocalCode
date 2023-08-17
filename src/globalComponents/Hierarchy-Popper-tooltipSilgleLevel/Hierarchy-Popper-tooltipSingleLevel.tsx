import * as React from "react";
import { usePopperTooltip } from "react-popper-tooltip";
import "react-popper-tooltip/dist/styles.css";
import { ColumnDef, } from "@tanstack/react-table";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import GlobalCommanTable from "../GroupByReactTableComponents/GlobalCommanTable";
import CreateActivity from "../../webparts/servicePortfolio/components/CreateActivity";
import CreateWS from '../../webparts/servicePortfolio/components/CreateWS'
let AllMatsterAndTaskData: any = [];
let counterAllTaskCount: any = 0;
let checkedData=''

// export const getTooltiphierarchyWithoutGroupByTable = (row: any) => {
//     AllMatsterAndTaskData.map((Object: any) => {
//         if (Object.Id === row?.ParentTask?.Id && row?.siteType === Object?.siteType) {
//             Object.subRows = [];
//             Object.subRows.push(row)
//             return getTooltiphierarchyWithoutGroupByTable(Object);
//         } else if (Object.Id === row?.Parent?.Id) {
//             Object.subRows = [];
//             Object.subRows.push(row);
//             return getTooltiphierarchyWithoutGroupByTable(Object);
//         } else if (row?.Component!=undefined &&row?.Component?.length>0 && Object.Id === row?.Component[0]?.Id) {
//             Object.subRows = [];
//             Object.subRows.push(row);
//             return getTooltiphierarchyWithoutGroupByTable(Object);
//         } else if (row?.Services!=undefined &&row?.Services?.length>0 && Object.Id === row?.Services[0]?.Id) {
//             Object.subRows = [];
//             Object.subRows.push(row);
//             return getTooltiphierarchyWithoutGroupByTable(Object);
//         } else {
//             return row 

//         }
//     })
//     return [row]
// };
export const getTooltiphierarchyWithoutGroupByTable = (row: any): any[] => {
    for (let i = 0; i < AllMatsterAndTaskData.length; i++) {
        const Object = AllMatsterAndTaskData[i];
        if (Object.Id === row?.ParentTask?.Id && row?.siteType === Object?.siteType) {
            Object.subRows = [];
            Object.subRows.push(row);
            return getTooltiphierarchyWithoutGroupByTable(Object);
        } else if (Object.Id === row?.Parent?.Id) {
            Object.subRows = [];
            Object.subRows.push(row);
            return getTooltiphierarchyWithoutGroupByTable(Object);
        } else if (row?.Component != undefined && row?.Component?.length > 0 && Object.Id === row?.Component[0]?.Id) {
            Object.subRows = [];
            Object.subRows.push(row);
            return getTooltiphierarchyWithoutGroupByTable(Object);
        } else if (row?.Services != undefined && row?.Services?.length > 0 && Object.Id === row?.Services[0]?.Id) {
            Object.subRows = [];
            Object.subRows.push(row);
            return getTooltiphierarchyWithoutGroupByTable(Object);
        }
    }
    return [row];
};





let scrollToolitem: any = false
let pageName: any = 'hierarchyPopperToolTip'
export default function ReactPopperTooltipSingleLevel({ ShareWebId, row, masterTaskData, AllSitesTaskData, AllListId }: any) {
    AllMatsterAndTaskData = [...masterTaskData];
    AllMatsterAndTaskData = AllMatsterAndTaskData?.concat(AllSitesTaskData);

    const [controlledVisible, setControlledVisible] = React.useState(false);
    const [action, setAction] = React.useState("");
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
        if (action === "click") return;
        setAction(newAction);
        setControlledVisible(true);
    };


    const handleCloseClick = () => {
        setAction("");
        setControlledVisible(!controlledVisible);
        scrollToolitem = false;
    };

    const openActivityPopup = (row:any) => {
        if(row.SharewebTaskType == undefined){
            setOpenActivity(true)
            row['NoteCall'] = 'Task'
            row['PageType'] = 'ProjectManagement'
            checkedData=row;
        }
        if(row?.SharewebTaskType?.Title == 'Activities'){
            setOpenWS(true)
            row['NoteCall'] = 'Task'
            checkedData=row;
        }
        if(row?.SharewebTaskType?.Title == 'Workstream'){
            setOpenActivity(true)
            row['NoteCall'] = 'Task'
            row['PageType'] = 'ProjectManagement'
            checkedData=row;
        }
       
    }
    const Call=(childItem:any)=>{
        setOpenActivity(false)
        setOpenWS(false)
       
    }
    const tooltiphierarchy = React.useMemo(() => {
        if (action === "click") {
            return getTooltiphierarchyWithoutGroupByTable(row);
        }
        return [];
    }, [action]);

    const columns = React.useMemo<ColumnDef<any, unknown>[]>(
        () => [
            {
                accessorKey: "",
                size: 7,
                canSort: false,
                header: "",
                placeholder: "",
                id: 'Shareweb_x0020_ID',
                cell: ({ row, getValue }) => (
                    <div
                        style={row.getCanExpand() ? {
                            paddingLeft: `${0}px`,
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

                            <> {row?.original?.SiteIcon != undefined ?
                                <a className="hreflink" title="Show All Child" data-toggle="modal">
                                    <img className="icon-sites-img ml20 me-1" src={row?.original?.SiteIcon}></img>
                                </a> : <>{row?.original?.Title != "Others" ? <div className='Dyicons'>{row?.original?.SiteIconTitle}</div> : ""}</>}
                                <span>{row?.original?.Shareweb_x0020_ID}</span>
                            </>
                            {getValue()}
                        </>
                    </div>
                ),
            },
            {
                cell: ({ row }) => (
                    <>
                        <span>{row.original.Title}</span>
                    </>
                ),
                id: "Title",
                canSort: false,
                placeholder: "",
                header: "",
                size: 15,
            },
            {
                accessorKey: "",
                size: 7,
                canSort: false,
                header: "",
                placeholder: "",
                id: 'Shareweb_x0020_ID',
                cell: ({ row, getValue }) => (
                    <div
                        style={row.getCanExpand() ? {
                            paddingLeft: `${0}px`,
                        } : {
                            paddingLeft: "18px",
                        }}
                    >
                        <>
                          <span onClick={()=>openActivityPopup(row.original)}>+</span>
                        </>
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
                        <GlobalCommanTable columns={columns} data={tooltiphierarchy} callBackDataToolTip={callBackDataToolTip} callBackData={callBackData} pageName={pageName} />
                    </div>
                    <div {...getArrowProps({ className: "tooltip-arrow" })} />
                </div>
            )}
            {openActivity && (
        <CreateActivity
          props={checkedData}
          Call={Call}
          SelectedProp={AllListId}
        ></CreateActivity>
      )}
       {openWS && (
        <CreateWS
          props={checkedData}
          Call={Call}
          SelectedProp={AllListId}
        ></CreateWS>
      )}
        </>
    );
}
