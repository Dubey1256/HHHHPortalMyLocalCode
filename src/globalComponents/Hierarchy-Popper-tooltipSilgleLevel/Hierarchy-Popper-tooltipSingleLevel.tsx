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
            row['NoteCall'] = 'Activities'
            row['PageType'] = 'ProjectManagement'
            checkedData=row;
        }
        if(row?.SharewebTaskType?.Title == 'Activities'){
            setOpenWS(true)
            row['NoteCall'] = 'Workstream'
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
        // if (childItem != undefined) {
        //     childItem.data.Services = [];
        //     childItem.data.Component = [];
        //     childItem.data["flag"] = true;
        //     childItem.data["TitleNew"] = childItem?.data?.Title;
        //     if (childItem?.data?.ServicesId[0] != undefined) {
        //       childItem.data.Services.push({ Id: childItem?.data?.ServicesId[0] });
        //     }
        //     if (childItem?.data?.ComponentId[0] != undefined) {
        //       childItem.data.Component.push({ Id: childItem?.data?.ComponentId[0] });
      
        //     }
        //     if (
        //       childItem?.data?.ServicesId != undefined &&
        //       childItem?.data?.ServicesId?.length > 0
        //     ) {
        //       MainId = childItem.data.ServicesId[0];
        //     }
        //     if (
        //       childItem.data.ComponentId != undefined &&
        //       childItem.data.ComponentId.length > 0
        //     ) {
        //       MainId = childItem.data.ComponentId[0];
        //     }
        //     if (
        //       childItem.data.ParentTaskId != undefined &&
        //       childItem.data.ParentTaskId != ""
        //     ) {
        //       ParentTaskId = childItem.data.ParentTaskId;
        //     }
        //     if (
        //       childItem?.data?.DueDate != undefined &&
        //       childItem?.data?.DueDate != "" &&
        //       childItem?.data?.DueDate != "Invalid date"
        //     ) {
        //       childItem.data.DueDate = childItem.data.DueDate
        //         ? Moment(childItem?.data?.DueDate).format("MM-DD-YYYY")
        //         : null;
        //     }
        //     if (array != undefined) {
        //       array?.map((comp: any) => {
        //         comp.flag = true;
        //         comp.show = false;
        //         if (comp.Id == MainId || comp.ID == MainId) {
        //           comp.childs.push(childItem.data);
        //           comp.subRows.push(childItem.data);
        //           comp.subRows = comp?.subRows?.filter((ele: any, ind: any) => ind === comp?.subRows?.findIndex((elem: any) => elem.ID === ele.ID));
      
        //         }
      
        //         if (comp.subRows != undefined && comp.subRows.length > 0) {
        //           comp?.subRows?.map((subComp: any) => {
        //             subComp.flag = true;
        //             subComp.show = false;
        //             if (subComp.Id == MainId || subComp.ID == MainId) {
        //               subComp.childs.push(childItem.data);
        //               subComp.subRows.push(childItem.data);
        //               subComp.subRows = subComp?.subRows?.filter((ele: any, ind: any) => ind === subComp?.subRows?.findIndex((elem: any) => elem.ID === ele.ID));
      
        //             }
      
        //             if (subComp.subRows != undefined && subComp.subRows.length > 0) {
        //               subComp?.subRows?.map((Feat: any) => {
        //                 if (
        //                   Feat?.DueDate?.length > 0 &&
        //                   Feat?.DueDate != "Invalid date"
        //                 ) {
        //                   Feat.DueDate = Feat?.DueDate
        //                     ? Moment(Feat?.DueDate).format("MM-DD-YYYY")
        //                     : null;
        //                 } else {
        //                   Feat.DueDate = "";
        //                 }
        //                 Feat.flag = true;
        //                 Feat.show = false;
        //                 if (Feat.Id == ParentTaskId || Feat.ID == ParentTaskId) {
        //                   Feat.childs = Feat.childs == undefined ? [] : Feat.childs;
        //                   Feat.subRows =
        //                     Feat.subRows == undefined ? [] : Feat.subRows;
        //                   Feat.childs.push(childItem.data);
        //                   Feat.subRows.push(childItem.data);
        //                   Feat.subRows = Feat?.subRows?.filter((ele: any, ind: any) => ind === Feat?.subRows?.findIndex((elem: any) => elem.ID === ele.ID));
        //                 }
      
        //                 if (Feat.subRows != undefined && Feat.subRows.length > 0) {
        //                   Feat?.subRows?.map((Activity: any) => {
        //                     if (
        //                       Activity?.DueDate?.length > 0 &&
        //                       Activity?.DueDate != "Invalid date"
        //                     ) {
        //                       Activity.DueDate = Activity?.DueDate
        //                         ? Moment(Activity?.DueDate).format("MM-DD-YYYY")
        //                         : null;
        //                     } else {
        //                       Activity.DueDate = "";
        //                     }
        //                     Activity.flag = true;
        //                     Activity.show = false;
        //                     if (
        //                       Activity.Id == ParentTaskId ||
        //                       Activity.ID == ParentTaskId
        //                     ) {
        //                       Activity.childs =
        //                         Activity.childs == undefined ? [] : Activity.childs;
        //                       Activity.subRows =
        //                         Activity.subRows == undefined ? [] : Activity.subRows;
        //                       Activity.childs.push(childItem.data);
        //                       Activity.subRows.push(childItem.data);
        //                       // Activity.subRows = Activity?.subRows.filter((val: any, id: any, array: any) => {
        //                       //     return array.indexOf(val) == id;
        //                       // })
        //                       // Activity.subRows = Activity?.subRows?.filter((ele: any, ind: any) => ind === Activity?.subRows?.findIndex((elem: { ID: any }) => elem.ID === ele.ID));
        //                       Activity.subRows = Activity?.subRows?.filter((ele: any, ind: any) => ind === Activity?.subRows?.findIndex((elem: any) => elem.ID === ele.ID));
        //                     }
      
        //                     if (
        //                       Activity.subRows != undefined &&
        //                       Activity.subRows.length > 0
        //                     ) {
        //                       Activity?.subRows?.map((workst: any) => {
        //                         if (
        //                           workst?.DueDate?.length > 0 &&
        //                           workst?.DueDate != "Invalid date"
        //                         ) {
        //                           workst.DueDate = workst?.DueDate
        //                             ? Moment(workst?.DueDate).format("MM-DD-YYYY")
        //                             : null;
        //                         } else {
        //                           workst.DueDate = "";
        //                         }
        //                         workst.flag = true;
        //                         workst.show = false;
        //                         if (
        //                           workst.Id == ParentTaskId ||
        //                           workst.ID == ParentTaskId
        //                         ) {
        //                           workst.childs =
        //                             workst.childs == undefined ? [] : workst.childs;
        //                           workst.subRows =
        //                             workst.subRows == undefined ? [] : workst.subRows;
        //                           workst.childs.push(childItem.data);
        //                           workst.subRows.push(childItem.data);
        //                           // workst.subRows = workst?.subRows?.filter((ele: any, ind: any) => ind === workst?.subRows?.findIndex((elem: { ID: any }) => elem.ID === ele.ID));
        //                           workst.subRows = workst?.subRows?.filter((ele: any, ind: any) => ind === workst?.subRows?.findIndex((elem: any) => elem.ID === ele.ID));
        //                         }
        //                       });
        //                     }
        //                   });
        //                 }
        //               });
        //             }
        //           });
        //         }
        //       });
        //       AllDataRender = AllDataRender?.concat(array);
        //       Renderarray = [];
        //       Renderarray = Renderarray.concat(AllDataRender);
        //       // setData((array) => array);
        //       refreshDataTaskLable();
        //       // rerender();
        //     }
        //   }
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
