import * as React from "react";
import { usePopperTooltip } from "react-popper-tooltip";
import "react-popper-tooltip/dist/styles.css";
import { ColumnDef, } from "@tanstack/react-table";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import GlobalCommanTable from "./GroupByReactTableComponents/GlobalCommanTable";
import CreateActivity from "../webparts/servicePortfolio/components/CreateActivity";
import CreateWS from "../webparts/servicePortfolio/components/CreateWS";

let checkedData=''
export const getTooltiphierarchy = (row: any) => {
    let rowOrg = { ...row.original };
    rowOrg.subRows = [];
    while (true) {
        // if (row?.parentRow) {
        if (row?.getParentRow()) {
            // const temp = { ...row.parentRow.original };
            const temp = { ...row.getParentRow().original };
            temp.subRows = [rowOrg];
            rowOrg = temp;
            // row = row.parentRow;
            row = row.getParentRow();
        } else {
            break;
        }
    }
    return [rowOrg];
};
let scrollToolitem: any = false
let pageName: any = 'hierarchyPopperToolTip'
export default function ReactPopperTooltip({ ShareWebId, row, projectToolShow, AllListId }: any) {
    const [controlledVisible, setControlledVisible] = React.useState(false);
    const [openActivity, setOpenActivity] = React.useState(false);
    const [openWS, setOpenWS] = React.useState(false);
    const [action, setAction] = React.useState("");

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
        if (action === "click" && newAction === "hover") return;
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

    const tooltiphierarchy = React.useMemo(() => {
        if (action === "click") {
            return getTooltiphierarchy(row);
        }
        return [];
    }, [action]);

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
            row['PageType'] = 'ProjectManagement'
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
    const columns = React.useMemo<ColumnDef<any, unknown>[]>(
        () => [
            {
                accessorKey: "",
                size: 7,
                canSort: false,
                placeholder: "",
                id: 'Shareweb_x0020_ID',
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
            {projectToolShow != true ? <span
                ref={setTriggerRef}
                onClick={() => handlAction("click")}
                onMouseEnter={() => handlAction("hover")}
                onMouseLeave={() => handleMouseLeave()}
            >
                {ShareWebId}
            </span> :
                <span
                    ref={setTriggerRef}
                    onMouseEnter={() => handlAction("hover")}
                    onMouseLeave={() => handleMouseLeave()}
                >
                    {ShareWebId}
                </span>}

            {action === "click" && visible && (
                <div ref={setTooltipRef} {...getTooltipProps({ className: "tooltip-container p-0 m-0" })}>
                    <div>
                        <div className="tootltip-title">{row?.original?.Title}</div>
                        <button className="toolTipCross" onClick={handleCloseClick}><div className="popHoverCross">×</div></button>
                    </div>

                    <div className={scrollToolitem === true ? "tool-Wrapper scroll-toolitem" : "tool-Wrapper"}  >
                        <GlobalCommanTable columns={columns} data={tooltiphierarchy} callBackDataToolTip={callBackDataToolTip} callBackData={callBackData} pageName={pageName} expendedTrue={true}/>
                    </div>
                    <div {...getArrowProps({ className: "tooltip-arrow" })} />
                </div>
            )}
            {action === "hover" && visible && projectToolShow != true && (
                <div ref={setTooltipRef} {...getTooltipProps({ className: "tooltip-container" })}>
                    <span>
                        <span>
                            <a>{row.original.toolSharewebId} : </a></span><span><a>{row.original.toolTitle}</a>
                        </span>
                    </span>
                    <div {...getArrowProps({ className: "tooltip-arrow" })} />
                </div>
            )}

            {action === "hover" && visible && projectToolShow === true && (
                <div ref={setTooltipRef} {...getTooltipProps({ className: "tooltip-container" })}>
                    <span>
                        {projectToolShow != true ? <span>
                            {row?.original?.joinedData}
                        </span>
                            :
                            <>
                                {row?.original?.joinedData.split('\n').map((line: any, index: any) => (
                                    <span key={index}>
                                        {line}
                                        <br />
                                    </span>
                                ))}</>
                        }
                    </span>
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