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
                            <div title={item?.column?.placeholder} className="columnSettingWidth"></div>
                            <div>
                                {item?.columnSorting[item?.column.id] ? (
                                    <div>
                                        {/* <div onClick={() => item?.handleSortClick(item?.column.id, item?.columnSorting[item?.column.id])}>
                                            {item?.columnSorting[item?.column.id].asc === true && (<div><FaSortDown /></div>)}
                                            {item?.columnSorting[item?.column.id].desc === true && (<div><FaSortUp /></div>)}
                                        </div> */}
                                        <div className='mt-1 mb-2'>
                                            <input type="checkbox" className='form-check-input me-1' id={`${item?.column.id}-none`} checked={item?.columnSorting[item?.column.id]?.asc} onChange={() => item?.handleSortClick(item?.column.id, item?.columnSorting[item?.column.id]?.asc ? null : { id: item?.column.id, asc: true, desc: false })} />
                                            <label className="mx-1" htmlFor={`${item?.column.id}-none`}>Defult Order</label>
                                        </div>
                                        <div>
                                            <label htmlFor={`${item?.column.id}-asc`} className='SpfxCheckRadio me-3'>
                                                <input className='radio' type='radio' checked={item?.columnSorting[item?.column.id]?.asc} id={`${item?.column.id}-asc`} name={`${item?.column.id}-sorting`}
                                                    onChange={() => item?.handleSortClick(item?.column.id, { id: item?.column.id, asc: true, desc: false })} /> Ascending Order
                                            </label>
                                            <label className='SpfxCheckRadio me-3' htmlFor={`${item?.column.id}-desc`}>
                                                <input className='radio' type='radio' checked={item?.columnSorting[item?.column.id]?.desc} id={`${item?.column.id}-desc`} name={`${item?.column.id}-sorting`}
                                                    onChange={() => item?.handleSortClick(item?.column.id, { id: item?.column.id, asc: false, desc: true })} /> Descending Order
                                            </label>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className='mt-1 mb-2'>
                                            <input type="checkbox" className='form-check-input me-1' id={`${item?.column.id}-none`} checked={item?.columnSorting[item?.column.id]?.asc} onChange={() => item?.handleSortClick(item?.column.id, item?.columnSorting[item?.column.id]?.asc ? null : { id: item?.column.id, asc: true, desc: false })} />
                                            <label htmlFor={`${item?.column.id}-none`}>Defult Order</label>

                                        </div>
                                        <div>
                                            <label htmlFor={`${item?.column.id}-asc`} className='SpfxCheckRadio me-3'>
                                                <input className='radio' type='radio' checked={false} id={`${item?.column.id}-asc`} name={`${item?.column.id}-sorting`}
                                                    onChange={() => item?.handleSortClick(item?.column.id, { id: item?.column.id, asc: true, desc: false })} /> Ascending Order
                                            </label>
                                            <label className='SpfxCheckRadio me-3' htmlFor={`${item?.column.id}-desc`}>
                                                <input className='radio' type='radio' checked={false} id={`${item?.column.id}-desc`} name={`${item?.column.id}-sorting`}
                                                    onChange={() => item?.handleSortClick(item?.column.id, { id: item?.column.id, asc: false, desc: true })} /> Descending Order
                                            </label>

                                        </div>
                                    </>
                                    // <div onClick={() => item?.handleSortClick(item?.column.id, null)}> <FaSort style={{ color: "gray" }} /></div>
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
                            <div title={item?.column?.placeholder} className="columnSettingWidth"></div>
                            <div>
                                {item?.columnSorting[item?.column.id] ? (
                                    <div>
                                        {/* <div onClick={() => item?.handleSortClick(item?.column.id, item?.columnSorting[item?.column.id])}>
                                            {item?.columnSorting[item?.column.id].asc === true && (<div><FaSortDown /></div>)}
                                            {item?.columnSorting[item?.column.id].desc === true && (<div><FaSortUp /></div>)}
                                        </div> */}
                                        <div className='mt-1 mb-2'>
                                            <input type="checkbox" className='form-check-input me-1' id={`${item?.column.id}-none`} checked={item?.columnSorting[item?.column.id]?.asc} onChange={() => item?.handleSortClick(item?.column.id, item?.columnSorting[item?.column.id]?.asc ? null : { id: item?.column.id, asc: true, desc: false })} />
                                            <label className="mx-1" htmlFor={`${item?.column.id}-none`}>Defult Order</label>
                                        </div>
                                        <div>
                                            <label htmlFor={`${item?.column.id}-asc`} className='SpfxCheckRadio me-3'>
                                                <input className='radio' type='radio' checked={item?.columnSorting[item?.column.id]?.asc} id={`${item?.column.id}-asc`} name={`${item?.column.id}-sorting`}
                                                    onChange={() => item?.handleSortClick(item?.column.id, { id: item?.column.id, asc: true, desc: false })} /> Ascending Order
                                            </label>
                                            <label className='SpfxCheckRadio me-3' htmlFor={`${item?.column.id}-desc`}>
                                                <input className='radio' type='radio' checked={item?.columnSorting[item?.column.id]?.desc} id={`${item?.column.id}-desc`} name={`${item?.column.id}-sorting`}
                                                    onChange={() => item?.handleSortClick(item?.column.id, { id: item?.column.id, asc: false, desc: true })} /> Descending Order
                                            </label>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className='mt-1 mb-2'>
                                            <input type="checkbox" className='form-check-input me-1' id={`${item?.column.id}-none`} checked={item?.columnSorting[item?.column.id]?.asc} onChange={() => item?.handleSortClick(item?.column.id, item?.columnSorting[item?.column.id]?.asc ? null : { id: item?.column.id, asc: true, desc: false })} />
                                            <label className="mx-1" htmlFor={`${item?.column.id}-none`}>Defult Order</label>

                                        </div>
                                        <div>
                                            <label htmlFor={`${item?.column.id}-asc`} className='SpfxCheckRadio me-3'>
                                                <input className='radio' type='radio' checked={false} id={`${item?.column.id}-asc`} name={`${item?.column.id}-sorting`}
                                                    onChange={() => item?.handleSortClick(item?.column.id, { id: item?.column.id, asc: true, desc: false })} /> Ascending Order
                                            </label>
                                            <label className='SpfxCheckRadio me-3' htmlFor={`${item?.column.id}-desc`}>
                                                <input className='radio' type='radio' checked={false} id={`${item?.column.id}-desc`} name={`${item?.column.id}-sorting`}
                                                    onChange={() => item?.handleSortClick(item?.column.id, { id: item?.column.id, asc: false, desc: true })} /> Descending Order
                                            </label>

                                        </div>
                                    </>
                                    // <div onClick={() => item?.handleSortClick(item?.column.id, null)}> <FaSort style={{ color: "gray" }} /></div>
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