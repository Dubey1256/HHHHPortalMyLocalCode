import * as React from "react";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import { usePopperTooltip } from "react-popper-tooltip";
import "react-popper-tooltip/dist/styles.css";






const columnSettingSortingToolTip = (item: any) => {
    const [controlledVisible, setControlledVisible] = React.useState(false);
    const [action, setAction] = React.useState("");

    const { getArrowProps, getTooltipProps, setTooltipRef, setTriggerRef, visible, } = usePopperTooltip({ trigger: null, interactive: true, closeOnOutsideClick: false, placement: "auto", visible: controlledVisible, onVisibleChange: setControlledVisible, });
    const handlAction = (newAction: any) => {
        if (action === "click" && newAction === "hover") return;
        setAction(newAction); setControlledVisible(true);
    };
    const handleMouseLeave = () => { if (action === "click") return; setAction(""); setControlledVisible(!controlledVisible); };
    const handleCloseClick = () => { setAction(""); setControlledVisible(!controlledVisible); };



    return (
        <>
            <div ref={setTriggerRef} onClick={() => handlAction("click")} onMouseEnter={() => handlAction("hover")} onMouseLeave={() => handleMouseLeave()}>{item?.placeholder}</div>
            {action === "click" && visible && (
                <div ref={setTooltipRef} {...getTooltipProps({ className: "tooltip-container m-0 p-0" })}>
                    <div className='d-flex settingTooltip'>
                        {item?.column?.placeholder != undefined && item?.column?.placeholder != '' && item?.column.id != "descriptionsSearch" && item?.column.id != "commentsSearch" && item?.column.id != "timeSheetsDescriptionSearch" && <div className="edititem alignCenter">
                            <div title={item?.column?.placeholder} className="columnSettingWidth" style={{ width: "50px", padding: "1px", border: "1px solid #ccc", height: "27px" }}></div>
                            <div style={{ position: "relative", right: '19px', border: "2px solid gray", padding: '1px' }}>
                                {item?.columnSorting[item?.column.id] ? (
                                    <div onClick={() => item?.handleSortClick(item?.column.id, item?.columnSorting[item?.column.id])}>
                                        {item?.columnSorting[item?.column.id].asc === true && (<div><FaSortDown /></div>)}
                                        {item?.columnSorting[item?.column.id].desc === true && (<div><FaSortUp /></div>)}
                                    </div>
                                ) : (
                                    <div onClick={() => item?.handleSortClick(item?.column.id, null)}> <FaSort style={{ color: "gray" }} /></div>
                                )}
                            </div>
                        </div>}
                        <div className='crossSec text-end'><span onClick={handleCloseClick} className='svg__iconbox svg__icon--cross ml-auto hreflink dark'></span></div>
                    </div>
                    <div {...getArrowProps({ className: "tooltip-arrow" })} />
                </div>
            )}
            {action === "hover" && visible && (
                <div ref={setTooltipRef} {...getTooltipProps({ className: "tooltip-container" })}>
                    <div className='d-flex settingTooltip'>
                        {item?.column?.placeholder != undefined && item?.column?.placeholder != '' && item?.column.id != "descriptionsSearch" && item?.column.id != "commentsSearch" && item?.column.id != "timeSheetsDescriptionSearch" && <div className="edititem alignCenter">
                            <div title={item?.column?.placeholder} className="columnSettingWidth" style={{ width: "50px", padding: "1px", border: "1px solid #ccc", height: "27px" }}></div>
                            <div style={{ position: "relative", right: '19px', border: "2px solid gray", padding: '1px' }}>
                                {item?.columnSorting[item?.column.id] ? (
                                    <div onClick={() => item?.handleSortClick(item?.column.id, item?.columnSorting[item?.column.id])}>
                                        {item?.columnSorting[item?.column.id].asc === true && (<div><FaSortDown /></div>)}
                                        {item?.columnSorting[item?.column.id].desc === true && (<div><FaSortUp /></div>)}
                                    </div>
                                ) : (
                                    <div onClick={() => item?.handleSortClick(item?.column.id, null)}> <FaSort style={{ color: "gray" }} /></div>
                                )}
                            </div>
                        </div>}
                        <div className='crossSec text-end'><span onClick={handleCloseClick} className='svg__iconbox svg__icon--cross ml-auto hreflink dark'></span></div>
                    </div>
                    <div {...getArrowProps({ className: "tooltip-arrow" })} />
                </div>
            )}
        </>
    )

}
export default columnSettingSortingToolTip;