import * as React from "react";
import { Panel, PanelType } from 'office-ui-fabric-react';
import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import Tooltip from "../Tooltip";
const BulkEditingConfrigation = (item: any) => {
    const [checkboxValues, setCheckboxValues] = React.useState(Object?.keys(item?.bulkEditingCongration)?.length > 0 ? item?.bulkEditingCongration : { priority: false, status: false, dueDate: false, itemRank: false, categories: false, clientCategories: false, Project: false, FeatureType: false });

    const handleCheckboxChange = (checkboxName: any) => {
        setCheckboxValues((prevValues: any) => ({
            ...prevValues,
            [checkboxName]: !prevValues[checkboxName],
        }));
    };
    const handleClosePopup = () => {
        item?.bulkEditingSetting('close')
    };
    const handleChangeDateAndDataCallBack = () => {
        item?.bulkEditingSetting(checkboxValues)
    };
    const onRenderCustomHeader = () => {
        return (
            <>
                <div className="alignCenter subheading"><span className="siteColor">Bulk Editing Configurations</span></div>
                <Tooltip ComponentId={6797} />
            </>
        );
    };
    return (
        <>
            <Panel
                type={PanelType.custom}
                customWidth="450px"
                isOpen={item?.isOpen}
                onDismiss={handleClosePopup}
                onRenderHeader={onRenderCustomHeader}
                isBlocking={false}
            >
                <div className="modal-body p-0 mt-2 mb-3">
                    <div className="col-sm-12 p-0 smart">
                        <div className="">
                            <div>
                                <label>
                                    <input type="checkbox" className="cursor-pointer form-check-input rounded-0 me-1" checked={checkboxValues.priority} onChange={() => handleCheckboxChange('priority')} />
                                    Priority
                                </label>
                                <br />
                                <label>
                                    <input type="checkbox" className="cursor-pointer form-check-input rounded-0 me-1" checked={checkboxValues.status} onChange={() => handleCheckboxChange('status')} />
                                    Status
                                </label>
                                <br />
                                <label>
                                    <input type="checkbox" className="cursor-pointer form-check-input rounded-0 me-1" checked={checkboxValues.dueDate} onChange={() => handleCheckboxChange('dueDate')} />
                                    Due Date
                                </label>
                                <br />
                                <label>
                                    <input type="checkbox" className="cursor-pointer form-check-input rounded-0 me-1" checked={checkboxValues.Project} onChange={() => handleCheckboxChange('Project')} />
                                    Project
                                </label>
                                <br />
                                <label>
                                    <input type="checkbox" className="cursor-pointer form-check-input rounded-0 me-1" checked={checkboxValues.categories} onChange={() => handleCheckboxChange('categories')} />
                                    Categories
                                </label>
                                <br />
                                <label>
                                    <input type="checkbox" className="cursor-pointer form-check-input rounded-0 me-1" checked={checkboxValues.FeatureType} onChange={() => handleCheckboxChange('FeatureType')} />
                                    Feature Type
                                </label>
                                {/* <label>
                                    <input type="checkbox" className="cursor-pointer form-check-input rounded-0" checked={checkboxValues.itemRank} onChange={() => handleCheckboxChange('itemRank')} />
                                    Item Rank
                                </label>
                                <br />
                                <label>
                                    <input type="checkbox" className="cursor-pointer form-check-input rounded-0" checked={checkboxValues.categories} onChange={() => handleCheckboxChange('categories')} />
                                    Categories
                                </label>
                                <br />
                                <label>
                                    <input type="checkbox" className="cursor-pointer form-check-input rounded-0" checked={checkboxValues.clientCategories} onChange={() => handleCheckboxChange('clientCategories')} />
                                    Client Categories
                                </label>
                                <br /> */}
                            </div>
                        </div>
                    </div>
                </div>

                <footer>
                    <button type="button" className="btn btn-default pull-right" onClick={() => handleClosePopup()}>Clear</button>
                    <button type="button" className="btn btn-primary mx-1 pull-right" onClick={handleChangeDateAndDataCallBack}>Save</button>
                </footer>
            </Panel>
        </>
    )
}
export default BulkEditingConfrigation;