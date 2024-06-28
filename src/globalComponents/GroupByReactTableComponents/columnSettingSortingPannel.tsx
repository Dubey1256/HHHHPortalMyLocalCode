import * as React from "react";
import "react-popper-tooltip/dist/styles.css";
import { Panel, PanelType } from 'office-ui-fabric-react';
import Tooltip from "../Tooltip";
import CoustomInfoIcon from "./CoustomInfoIcon";

const ColumnSettingSortingPannel = (item: any) => {
    const setModalIsOpenToFalse = () => {
        item?.setSelectedSortingPanelIsOpen(false);
    };
    const onRenderCustomHeader = () => {
        return (
            <>
                <div className="alignCenter subheading">
                    <span className="siteColor">Type Of Order</span>
                </div>
                <Tooltip ComponentId={7464} />
            </>
        );
    };
    const handleChangeData = () => {
        item?.setSelectedSortingPanelIsOpen(false);
    };
    const DefaultOrderSorting = () => {
        if (item?.columnSorting[item?.column.id]?.asc === true && item?.columnSorting[item?.column.id]?.desc === false) {
            item?.handleSortClick(item?.column.id, null)
        } else if (item?.columnSorting[item?.column.id]?.desc === true && item?.columnSorting[item?.column.id]?.asc === false) {
            item?.handleSortClick(item?.column.id, null)
        } else if ((item?.columnSorting[item?.column.id]?.desc === false && item?.columnSorting[item?.column.id]?.asc === false) || (item?.columnSorting[item?.column.id]?.desc === undefined && item?.columnSorting[item?.column.id]?.asc === undefined)) {
            item?.handleSortClick(item?.column.id, { id: item?.column.id, asc: true, desc: false })
        }
    }
    return (
        <>
            <Panel className="overflow-x-visible"
                type={PanelType.custom}
                customWidth="600px"
                isOpen={item?.isOpen}
                onDismiss={setModalIsOpenToFalse}
                onRenderHeader={onRenderCustomHeader}
                isBlocking={false}
            >

                <div className=''>
                    {item?.column?.placeholder != undefined && item?.column?.placeholder != '' && item?.column.id != "descriptionsSearch" && item?.column.id != "commentsSearch" && item?.column.id != "timeSheetsDescriptionSearch" && <div className="">
                        <div>
                            {item?.columnSorting[item?.column.id] ? (
                                <>
                                    <div className=''>
                                        <div className="alignCenter">Order Type <span className="mt-2 mx-1"><CoustomInfoIcon Discription="Sorting arranges elements in a sequence: smallest to largest for ascending, and largest to smallest for descending. If already sorted, the default order is verified." /></span></div>
                                    </div>
                                    <div className='mt-2'>
                                        <input type="checkbox" className='form-check-input me-1' id={`${item?.column.id}-none`} checked={item?.columnSorting[item?.column.id]?.asc || item?.columnSorting[item?.column.id]?.desc} onChange={() => DefaultOrderSorting()} />
                                        <label className="mx-1" htmlFor={`${item?.column.id}-none`}>Default Order</label>
                                    </div>
                                    <div className="mt-2">
                                        <div>
                                            <label htmlFor={`${item?.column.id}-asc`} className='SpfxCheckRadio me-3'>
                                                <input className='radio' type='radio' checked={item?.columnSorting[item?.column.id]?.asc} id={`${item?.column.id}-asc`} name={`${item?.column.id}-sorting`}
                                                    onChange={() => item?.handleSortClick(item?.column.id, { id: item?.column.id, asc: true, desc: false })} /> Ascending Order
                                            </label>
                                        </div>
                                        <div className="mt-2">
                                            <label className='SpfxCheckRadio me-3' htmlFor={`${item?.column.id}-desc`}>
                                                <input className='radio' type='radio' checked={item?.columnSorting[item?.column.id]?.desc} id={`${item?.column.id}-desc`} name={`${item?.column.id}-sorting`}
                                                    onChange={() => item?.handleSortClick(item?.column.id, { id: item?.column.id, asc: false, desc: true })} /> Descending Order
                                            </label>
                                        </div>

                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className=''>
                                        <div className="alignCenter">Order Type <span className="mt-2 mx-1"><CoustomInfoIcon Discription="Sorting arranges elements in a sequence: smallest to largest for ascending, and largest to smallest for descending. If already sorted, the default order is verified." /></span></div>
                                    </div>
                                    <div className='mt-2'>
                                        <input type="checkbox" className='form-check-input me-1' id={`${item?.column.id}-none`} checked={item?.columnSorting[item?.column.id]?.asc || item?.columnSorting[item?.column.id]?.desc} onChange={() => DefaultOrderSorting()} />
                                        <label className="mx-1" htmlFor={`${item?.column.id}-none`}>Default Order</label>
                                    </div>
                                    <div className="mt-2">
                                        <div>
                                            <label htmlFor={`${item?.column.id}-asc`} className='SpfxCheckRadio me-3'>
                                                <input className='radio' type='radio' checked={false} id={`${item?.column.id}-asc`} name={`${item?.column.id}-sorting`}
                                                    onChange={() => item?.handleSortClick(item?.column.id, { id: item?.column.id, asc: true, desc: false })} /> Ascending Order
                                            </label>
                                        </div>
                                        <div className="mt-2">
                                            <label className='SpfxCheckRadio me-3' htmlFor={`${item?.column.id}-desc`}>
                                                <input className='radio' type='radio' checked={false} id={`${item?.column.id}-desc`} name={`${item?.column.id}-sorting`}
                                                    onChange={() => item?.handleSortClick(item?.column.id, { id: item?.column.id, asc: false, desc: true })} /> Descending Order
                                            </label>
                                        </div>

                                    </div>
                                </>
                            )}
                        </div>
                    </div>}
                </div>
                <footer>
                    <button type="button" className="btn btn-default pull-right" onClick={setModalIsOpenToFalse}>
                        Cancel
                    </button>
                    <button type="button" className="btn btn-primary mx-1 pull-right" onClick={() => handleChangeData()}>
                        Save
                    </button>
                </footer>
            </Panel>
        </>
    )
}
export default ColumnSettingSortingPannel;