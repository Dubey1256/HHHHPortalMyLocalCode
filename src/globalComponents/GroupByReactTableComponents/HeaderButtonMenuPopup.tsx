import * as React from "react";
import { Panel, PanelType } from 'office-ui-fabric-react';
import Tooltip from "../../globalComponents/Tooltip";
import { RiFileExcel2Fill, RiFilter3Fill, RiListSettingsFill } from "react-icons/ri";
import { FaListAlt } from "react-icons/fa";
import { AiFillSetting } from "react-icons/ai";
import { BsClockHistory, BsList } from "react-icons/bs";
import ExpndTable from "../ExpandTable/Expandtable";
const HeaderButtonMenuPopup = (items: any) => {
    const portfolioColor = items?.portfolioColor
    const handleClosePopup = () => {
        items?.setCoustomButtonMenuPopup(false)
    };

    const onRenderCustomHeader = () => {
        return (
            <>
                <div className="alignCenter subheading">
                    <span style={{ color: `${items?.portfolioColor}` }} className="siteColor">Column Header</span>
                </div>
                <Tooltip ComponentId={5756} />
            </>
        );
    };
    return (
        <Panel className="overflow-x-visible"
            type={PanelType.custom}
            customWidth="330px"
            isOpen={items?.isOpen}
            onDismiss={handleClosePopup}
            onRenderHeader={onRenderCustomHeader}
            isBlocking={false}
        >
            <div className="modal-body modal-body p-0 mt-2 mb-3">
                <div className="tbl-headings justify-content-between" style={{ background: 'white', borderBottom: "none" }}>
                    <div className="">
                        {/* {items?.hideTeamIcon != true ? <>
                            <div className="col-sm-12 p-0">
                                {items?.selectedRow?.length > 0 ? <div className="alignCenter mb-1"><a className="teamIcon me-1" onClick={() => items?.ShowTeamFunc()}><span title="Create Teams Group" style={{ color: `${portfolioColor}`, backgroundColor: `${portfolioColor}` }} className="svg__iconbox svg__icon--team"></span></a>Create Teams Group</div>
                                    : <div className="alignCenter mb-1"><a className="teamIcon me-1"><span title="Create Teams Group" style={{ backgroundColor: "gray" }} className="svg__iconbox svg__icon--team"></span></a>Create Teams Group</div>}
                            </div>
                        </> : ''} */}

                        {items?.showEmailIcon === true ? <>
                            <div className="col-sm-12 p-0">
                                <div  onClick={() => items?.openCreationAllStructure("sendEmail")} className="alignCenter mb-1"> <a className="teamIcon p-0 me-1"><span title="send email" style={{ color: `${portfolioColor}`, backgroundColor: `${portfolioColor}` }} className="svg__iconbox svg__icon--mail"></span></a>Send Email</div>
                            </div>
                        </> : ''}

                        {items?.hideOpenNewTableIcon != true ? <>
                            {items?.selectedRow?.length > 0 ?
                                <div onClick={() => items?.openTaskAndPortfolioMulti()} className="alignCenter mb-1 col-sm-12 p-0"><a  title='Open in New Tab' className="openWebIcon p-0 me-1"><span style={{ color: `${portfolioColor}`, backgroundColor: `${portfolioColor}` }} className="svg__iconbox svg__icon--openWeb"></span></a>Open in New Tab</div>
                                : <div className="alignCenter mb-1 col-sm-12 p-0"><a className="openWebIcon p-0 me-1" title='Open in New Tab'><span className="svg__iconbox svg__icon--openWeb" style={{ backgroundColor: "gray" }}></span></a>Open in New Tab</div>}
                        </> : ''}

                        <div onClick={() => items?.exportToExcel()} className="alignCenter mb-1 col-sm-12"><a className='excal me-1' title='Export to Excel' ><RiFileExcel2Fill style={{ color: `${portfolioColor}` }} /></a>Export to Excel</div>

                        {items?.SmartTimeIconShow === true && items?.AllListId?.isShowTimeEntry === true && <div className="alignCenter mb-1 col-sm-12"><a className='smartTotalTime me-1' title="Load SmartTime of AWT" onClick={() => items?.openCreationAllStructure("Smart-Time")} > <BsClockHistory style={{ color: `${portfolioColor}` }} /></a>Load SmartTime of AWT</div>}

                        {items?.flatView === true && items?.updatedSmartFilterFlatView === false && <>{items?.clickFlatView === false ? <div className="alignCenter mb-1 col-sm-12"><a className='smartTotalTime me-1' title='Switch to Flat-View' style={{ color: `${portfolioColor}` }} onClick={() => items?.openCreationAllStructure("Flat-View")}><BsList /></a>Switch to Flat-View</div> :
                            <div className="alignCenter mb-1 col-sm-12"><a className='smartTotalTime me-1' title='Switch to Groupby View' style={{ color: `${portfolioColor}` }} onClick={() => items?.openCreationAllStructure("Groupby-View")}><FaListAlt /></a>Switch to Groupby View</div>}</>}

                        {items?.flatView === true && items?.updatedSmartFilterFlatView === true && <div className="alignCenter mb-1 col-sm-12"><a className='smartTotalTime me-1' title='deactivated to Groupby View'><FaListAlt style={{ color: "#918d8d" }} /></a>deactivated to Groupby View</div>}

                        <div onClick={() => { items?.setGlobalFilter(''); items?.setColumnFilters([]); items?.setRowSelection({}); }} className="alignCenter mb-1 col-sm-12"><a className='brush me-1'><i className="fa fa-paint-brush hreflink" style={{ color: `${portfolioColor}` }} aria-hidden="true" title="Clear All" ></i></a>Clear All</div>


                        <div onClick={() => items?.downloadPdf()} className="alignCenter mb-1 col-sm-12"><a className='Prints me-1' >
                            <i className="fa fa-print" aria-hidden="true" style={{ color: `${portfolioColor}` }} title="Print"></i>
                        </a>Print</div>
                        {items?.bulkEditIcon === true && <div className="alignCenter mb-1 col-sm-12"><a className='smartTotalTime me-1' title='Bulk editing setting' onClick={() => items?.bulkEditingSettingPopupEvent()} ><RiListSettingsFill style={{ color: `${portfolioColor}` }} /></a>Bulk editing setting</div>}

                        {items?.expandIcon === true && <div className="alignCenter mb-1 col-sm-12"><a className="expand me-1" title="Expand table section" style={{ color: `${portfolioColor}` }}>
                            <ExpndTable prop={items?.expndpopup} prop1={items?.tablecontiner} />
                        </a>Expand table section</div>}
                        {items?.columnSettingIcon === true && <><div className="alignCenter mb-1 col-sm-12"><a className='smartTotalTime me-1' title='Column setting' style={{ color: `${portfolioColor}` }} onClick={() => items?.setColumnSettingPopup(true)}><AiFillSetting /></a>Column setting</div></>}
                    </div>
                </div>
            </div>
            <footer>
                <button type="button" className="btn btn-default pull-right" style={{ backgroundColor: `${items?.portfolioColor}`, borderColor: `${items?.portfolioColor}` }} onClick={handleClosePopup}>
                    Cancel
                </button>
            </footer>
        </Panel>
    );
};
export default HeaderButtonMenuPopup;
