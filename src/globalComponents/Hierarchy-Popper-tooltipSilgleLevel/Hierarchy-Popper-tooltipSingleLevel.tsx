import * as React from "react";
import { usePopperTooltip } from "react-popper-tooltip";
import "react-popper-tooltip/dist/styles.css";
import { ColumnDef, } from "@tanstack/react-table";
import { FaChevronDown, FaChevronRight, FaPlus } from "react-icons/fa";
import GlobalCommanTable from "../GroupByReactTableComponents/GlobalCommanTable";
import CreateActivity from "../CreateActivity";
import * as globalCommon from "../globalCommon"
import CreateWS from '../CreateWS'
import { SlArrowDown, SlArrowRight } from "react-icons/sl";
import { MdAdd, MdRemove } from "react-icons/Md";
import { Web } from "sp-pnp-js";
import $ from 'jquery';
let AllMatsterAndTaskData: any = [];
let counterAllTaskCount: any = 0;
let checkedData = ''

let allMasterData: any;

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
export default function ReactPopperTooltipSingleLevel({ CMSToolId, row, masterTaskData, AllSitesTaskData, AllListId }: any) {
    let paddingCount: number = -1;
    let marginCount: number = 0;
    
    masterTaskData=masterTaskData?.concat(AllSitesTaskData)
    // AllMatsterAndTaskData = [...masterTaskData];
    // AllMatsterAndTaskData = JSON.parse(JSON.stringify(AllMatsterAndTaskData?.concat(AllSitesTaskData)));
    const [controlledVisible, setControlledVisible] = React.useState(false);
    const [action, setAction] = React.useState("");
    const [hoverOverInfo, setHoverOverInfo] = React.useState("");
    const [openActivity, setOpenActivity] = React.useState(false);
    const [openWS, setOpenWS] = React.useState(false);

    const [expandDataTooltip, setExpandDataTooltip] = React.useState(false);
    const [allValue, setallValue] = React.useState([])

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

    React.useEffect(() => {
        let targetDiv: any = document?.querySelector('.ms-Panel-main');
        setTimeout(() => {
            if (targetDiv && row?.PortfolioType?.Color != undefined) {
                // Change the --SiteBlue variable for elements under the targetDiv
                targetDiv?.style?.setProperty('--SiteBlue', row?.PortfolioType?.Color); // Change the color to your desired value
            }
        }, 1000)
    }, [action]);



    const getTooltiphierarchyAllData = async (item: any): Promise<any> => {
        let web = new Web(item?.siteUrl || AllListId?.siteUrl);
        let Object: any;
        item.isExpanded = true;
        item.siteUrl = item?.siteUrl || AllListId?.siteUrl;
        if (item?.ParentTask != undefined || item?.ParentTask != null) {
            try {
                Object = await web.lists.getById(item?.listId)
                    .items.getById(item?.ParentTask.Id).select(
                        "Id, TaskID, TaskId, Title, ParentTask/Id, ParentTask/Title, Portfolio/Id, Portfolio/Title, Portfolio/PortfolioStructureID"
                    )
                    .expand("ParentTask, Portfolio")
                    .get();
            } catch (error) {
                console.error(error)
            }
        }
        else if (item.Parent != undefined || item?.Portfolio != undefined) {
            let useId = item.Portfolio != undefined ? item?.Portfolio?.Id : item?.Parent?.Id;
            try {
                Object = await web.lists.getById(AllListId?.MasterTaskListID)
                    .items.getById(useId).select("Id, Title, Parent/Id, Parent/Title, PortfolioStructureID, Item_x0020_Type")
                    .expand("Parent")
                    .get()
            }
            catch (error) {
                console.error(error)
            }
        }

        if (Object != undefined) {
            if (Object?.Id === item?.ParentTask?.Id) {
                Object.subRowsFirst = [item];
                Object.listId = item?.listId;
                Object.SiteIcon = item?.SiteIcon;
                Object.siteType = item?.siteType;
                Object.siteUrl = item?.siteUrl;
                return getTooltiphierarchyAllData(Object);
            } else if (Object?.Id === item?.Parent?.Id) {
                Object.listId = item?.listId;
                Object.siteUrl = item?.siteUrl;
                Object.subRowsFirst = [item];
                return getTooltiphierarchyAllData(Object);
            } else if (item?.Portfolio != undefined && Object?.Id === item?.Portfolio?.Id && (item?.ParentTask?.TaskID == null || item?.ParentTask?.TaskID == undefined)) {
                Object.listId = item?.listId;
                Object.siteUrl = item?.siteUrl;
                Object.subRowsFirst = [item];
                return getTooltiphierarchyAllData(Object);
            }

        }
        return item;
    }



    const handlAction = (newAction: any) => {
        if (newAction === "click" && newAction === "hover") return;
        setAction(newAction);
        setControlledVisible(true);
    };

    const handlClick = (newAction: any) => {
        let rowOrg: any = {};
        if (row?.subRows?.length > 0) {
            rowOrg = { ...row };
            rowOrg.subRows = [];
        } else {
            rowOrg = { ...row };
        }
        if (newAction === "click" && newAction === "hover") return;
        getTooltiphierarchyAllData(rowOrg).then((response: any) => {

            checkAllChilds(response)
            setAction(newAction);
            setControlledVisible(true);
            setallValue(response);
        });
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
        if (row?.TaskType?.Title == undefined) {
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
        let rowOrg: any = {};
        if (row?.subRows?.length > 0) {
            rowOrg = { ...row };
            rowOrg.subRows = [];
        } else {
            rowOrg = { ...row };
        }
        let completeTitle = '';

        if (action === "hover") {
            let result = getTooltiphierarchyWithoutGroupByTable(rowOrg, completeTitle);
            let TaskId = rowOrg?.SiteIcon != undefined ? globalCommon.GetCompleteTaskId(rowOrg) : rowOrg?.PortfolioStructureID;
            let completedID = `${TaskId} : ${result?.structureTitle}${rowOrg?.Title}`
            setHoverOverInfo(completedID);
        }
        return [];
    }, [action]);

   



    
    const checkAllChilds=(data:any)=>{
         const haveSubrows=data?.subRowsFirst?.length>0;
         data.subRows=[]
         data.openAllChilds = false;
        data.subRows=masterTaskData?.filter((AllData:any)=> {
            AllData.siteUrl=data?.siteUrl;  
         return((data?.SiteIcon==undefined && AllData?.Parent?.Id==data?.Id)||
         (( (data?.ParentTask?.Id==undefined || data?.ParentTask?.Id==null) &&(data?.Item_x0020_Type!=undefined && data?.Item_x0020_Type?.toLowerCase()!="tasks" && AllData?.Portfolio?.Id==data?.Id)))
         ||(data?.SiteIcon!=undefined && AllData?.siteType==data?.siteType && AllData?.ParentTask?.Id ==data.Id) 
         )
        })
        if(haveSubrows==true){
            checkAllChilds(data?.subRowsFirst[0])
        }
    }
    const onToggle = (data: any, type: any) => {
        if (type == "CurentHirearchy") {     
            data.isExpanded = !data.isExpanded
        }
        if (type == "AllHirearchy") {
            data.openAllChilds = !data.openAllChilds
            childsAllHirearchy(data)
        }
        setExpandDataTooltip(!expandDataTooltip)

    }
    const childsAllHirearchy=(data:any)=>{
        if(data?.subRows?.length>0){
            data?.subRows.map((item:any)=>{
                item.openAllChilds = false;
                item.subRows=[];
               item.subRows=masterTaskData.filter((AllData:any)=>(item?.SiteIcon==undefined && AllData?.Parent?.Id==item?.Id)||
               ((AllData?.ParentTask?.Id==undefined || AllData?.ParentTask?.Id==null) && (item?.Item_x0020_Type!=undefined && item?.Item_x0020_Type?.toLowerCase()!="tasks" && AllData?.Portfolio?.Id==item?.Id)) ||
               (item?.SiteIcon!=undefined && AllData?.siteType==item?.siteType
                && AllData?.ParentTask?.Id ==item.Id))
                
                
            })
            
          
        }
    }
    

    const expandData = (itemData: any) => {
        const hasChildren = itemData?.subRowsFirst?.length > 0;
        const haveAllChildren = itemData?.subRows?.length > 0;
        let lastChild = false;
        // let firstChild = false;
        // if (paddingCount >= 0) {
        //     firstChild = true
        // }
        // if (hasChildren == true) {
        //     paddingCount++
        // } else{
        //     if (paddingCount == 0) {
        //         paddingCount++
        //     }
        //     if (firstChild == true) {
        //         marginCount = paddingCount;
        //         lastChild = true
        //     }
        // }
        if (hasChildren != true) {
            lastChild = true;
        }
        return (

            <>
                <div className={itemData.Item_x0020_Type == "Component" ? ' d-flex p-1 f-bg borderBottomWhite' :
                    itemData.Item_x0020_Type == "SubComponent" ? 'd-flex p-1 a-bg borderBottomWhite' : itemData.Item_x0020_Type == 'Feature' ? "d-flex p-1 borderBottomWhite w-bg" : "d-flex p-1 border-top"}>
                    <div style={{ flex: "0 0 160px" }}>
                        <div className={lastChild == true ? `alignCenter levelml-1` : `alignCenter`}>
                            {hasChildren &&
                                <span style={{ width: "20px" }} className="mt--3" onClick={() => onToggle(itemData, "CurentHirearchy")}>
                                    {hasChildren && (
                                        itemData.isExpanded ? <SlArrowDown style={{ color: "#000" }} /> : <SlArrowRight style={{ color: "#000" }} />
                                    )}

                                </span>
                            }

                            {haveAllChildren==true?
                                <span style={{ width: "20px" }} className="mt--3" onClick={() => onToggle(itemData, "AllHirearchy")}>
                                    {haveAllChildren&&(
                                    itemData?.openAllChilds!=true?<MdAdd />:<MdRemove />
                                    )}
                                </span>
                                :<span style={{ width: "20px" }} className="mt--3"></span>
                            }

                            {itemData?.SiteIcon != undefined ? <>
                                <img className="icon-sites-img ml20 mx-1" src={itemData?.SiteIcon}></img>
                                <span className="fw-normal">{itemData?.TaskId != undefined ? itemData?.TaskId : itemData?.TaskID}</span>
                            </> : <>{itemData?.Title != "Others" ? <>
                                <span className='Dyicons mx-1 '>{itemData?.Item_x0020_Type?.toUpperCase()?.charAt(0)}
                                </span>
                                <span className="fw-normal">{itemData?.PortfolioStructureID}</span>
                            </>
                                : ""}</>}


                        </div>

                    </div>

                    <div className={lastChild == true ? "lastlevel" : ''} style={{ flex: "0 0 330px" }}>
                        <div className="aligncenter textDotted" style={{ width: "330px" }}>
                            {itemData?.SiteIcon != undefined ? <>

                                <a
                                    href={`${itemData?.siteUrl}/SitePages/Task-Profile.aspx?taskId=${itemData?.Id}&Site=${itemData?.siteType}`}
                                    data-interception="off" className="fw-normal hreflink" title={`${itemData?.Title}`}
                                    target="_blank">
                                    {itemData?.Title}
                                </a> </> : <>{itemData?.Title != "Others" && itemData?.Item_x0020_Type != "Sprint" && itemData?.Item_x0020_Type != "Project" ? <>

                                    <a className="fw-normal hreflink" title={`${itemData?.Title}`}
                                        data-interception="off"
                                        target="blank"
                                        href={`${itemData?.siteUrl}/SitePages/Portfolio-Profile.aspx?taskId=${itemData?.Id}`}>
                                        {itemData?.Title}
                                    </a>
                                </>
                                 :itemData?.Item_x0020_Type == "Sprint" || itemData.Item_x0020_Type == "Project" ?
                                 <a className="fw-normal hreflink" title={`${itemData?.Title}`} data-interception="off" target="blank"
                                     href={`${itemData?.siteUrl}/SitePages/PX-Profile.aspx?ProjectId=${itemData?.Id}`}>
                                         {itemData?.Title}
                                 </a>   : ""}</>}
                        </div>
                    </div>
                    <div className={lastChild == true ? "roundRight lastlevel" : ''} style={{ flex: "0 0 25px" }}>
                        {itemData?.TaskType?.Title != 'Task' && itemData?.Item_x0020_Type != "Sprint" && itemData?.Item_x0020_Type != "Project" ?
                            <svg onClick={() => openActivityPopup(itemData)} className={lastChild == true ? "hreflink text-white" : "hreflink"} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48" fill="#333333">
                                <title>Open Activity Popup</title>
                                <path d="M27.9601 22.2H26.0401V26.0399H22.2002V27.9599H26.0401V31.8H27.9601V27.9599H31.8002V26.0399H27.9601V22.2Z" fill="#333333" />
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M32.3996 9.60001H9.59961V32.4H15.5996V38.4H38.3996V15.6H15.5996V31.2968H10.7028V10.7032H31.2964V15.4839H32.3996V9.60001ZM16.7028 16.7032H37.2964V37.2968H16.7028V16.7032Z" fill="#333333" />
                                <path d="M9.59956 9.59999V9.29999H9.29956V9.59999H9.59956ZM32.3996 9.59999H32.6996V9.29999H32.3996V9.59999ZM9.59956 32.4H9.29956V32.7H9.59956V32.4ZM15.5996 32.4H15.8996V32.1H15.5996V32.4ZM15.5996 38.4H15.2996V38.7H15.5996V38.4ZM38.3996 38.4V38.7H38.6996V38.4H38.3996ZM38.3996 15.6H38.6996V15.3H38.3996V15.6ZM15.5996 15.6V15.3H15.2996V15.6H15.5996ZM15.5996 31.2968V31.5968H15.8996V31.2968H15.5996ZM10.7028 31.2968H10.4028V31.5968H10.7028V31.2968ZM10.7028 10.7032V10.4032H10.4028V10.7032H10.7028ZM31.2964 10.7032H31.5963V10.4032H31.2964V10.7032ZM31.2964 15.4839H30.9964V15.7839H31.2964V15.4839ZM32.3996 15.4839V15.7839H32.6996V15.4839H32.3996ZM37.2963 16.7032H37.5964V16.4032H37.2963V16.7032ZM16.7028 16.7032V16.4032H16.4028V16.7032H16.7028ZM37.2963 37.2968V37.5968H37.5964V37.2968H37.2963ZM16.7028 37.2968H16.4028V37.5968H16.7028V37.2968ZM9.59956 9.89999H32.3996V9.29999H9.59956V9.89999ZM9.89956 32.4V9.59999H9.29956V32.4H9.89956ZM15.5996 32.1H9.59956V32.7H15.5996V32.1ZM15.2996 32.4V38.4H15.8996V32.4H15.2996ZM15.5996 38.7H38.3996V38.1H15.5996V38.7ZM38.6996 38.4V15.6H38.0996V38.4H38.6996ZM38.3996 15.3H15.5996V15.9H38.3996V15.3ZM15.2996 15.6V31.2968H15.8996V15.6H15.2996ZM10.7028 31.5968H15.5996V30.9968H10.7028V31.5968ZM10.4028 10.7032V31.2968H11.0028V10.7032H10.4028ZM31.2964 10.4032H10.7028V11.0032H31.2964V10.4032ZM31.5963 15.4839V10.7032H30.9964V15.4839H31.5963ZM32.3996 15.1839H31.2964V15.7839H32.3996V15.1839ZM32.0996 9.59999V15.4839H32.6996V9.59999H32.0996ZM37.2963 16.4032H16.7028V17.0032H37.2963V16.4032ZM37.5964 37.2968V16.7032H36.9963V37.2968H37.5964ZM16.7028 37.5968H37.2963V36.9968H16.7028V37.5968ZM16.4028 16.7032V37.2968H17.0028V16.7032H16.4028Z" fill="#333333" />
                            </svg>
                            : ""}

                    </div>
                </div>

                {hasChildren && itemData?.isExpanded && itemData?.openAllChilds!=true &&  (

                    itemData?.subRowsFirst.map((items: any) => (
                        expandData(items)

                    ))
                )}
                {haveAllChildren && itemData?.openAllChilds && (
                    itemData?.subRows?.map((items: any) => (
                        expandData(items)
                    ))
                )}
            </>




        )
    }

    return (
        <>
            <span
                ref={setTriggerRef}
                onMouseEnter={() => handlAction("hover")}
                onMouseLeave={() => handleMouseLeave()}
                onClick={() => handlClick("click")}
            >
                {CMSToolId}
            </span>

            {action === "click" && visible && (
                <div ref={setTooltipRef} {...getTooltipProps({ className: "tooltip-container clickTooltip p-3 m-0" })}>
                    <div className="alignCenter mb-2">
                        <span className="fw-normal">{row?.Title}</span>
                        <span onClick={handleCloseClick} style={{ marginRight: "3px" }} title="Close" className="ml-auto hreflink svg__iconbox svg__icon--cross dark"></span>
                    </div>
                    <div className="maXh-300 scrollbar">
                    {allValue != undefined && allValue != null &&

                        expandData(allValue)

                    }

                    <div {...getArrowProps({ className: "tooltip-arrow" })} />
                </div>
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