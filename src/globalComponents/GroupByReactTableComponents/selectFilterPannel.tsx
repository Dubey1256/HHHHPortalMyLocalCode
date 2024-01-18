import * as React from "react";
import { Panel, PanelType } from 'office-ui-fabric-react';
import Tooltip from "../../globalComponents/Tooltip";
const SelectFilterPanel = (props: any) => {
    // const handleCheckboxChange = (event: any) => {
    //     const { name, checked } = event.target;
    //     props?.setSelectedFilterPannelData((prevCheckboxes: any) => ({ ...prevCheckboxes, [name]: { [name]: name, Selected: checked } }));
    // };
    const handleCheckboxChange = (event: any) => {
        const { name, checked } = event.target;
        props?.setSelectedFilterPannelData((prevCheckboxes: any) => ({
            ...prevCheckboxes,
            [name]: { ...prevCheckboxes[name], Selected: checked }
        }));
    };
    const handleSelectAllChange = (event: any) => {
        const { checked } = event.target;
        props?.setSelectedFilterPannelData({
            Title: { Title: 'Title', Selected: checked, lebel: 'Title' },
            commentsSearch: { commentsSearch: 'commentsSearch', Selected: checked, lebel: 'Comments' },
            descriptionsSearch: { descriptionsSearch: 'descriptionsSearch', Selected: checked, lebel: 'Descriptions' },
            timeSheetsDescriptionSearch: { timeSheetsDescriptionSearch: 'timeSheetsDescriptionSearch', Selected: checked, lebel: 'Timesheet Data' }
        });
    };
    const selectedCount = () => {
        props.setSelectedFilterCount((prevFilterCount: any) => ({
            selectedFilterCount: '',
        }));

        const updateSelectedFilterCount = (key: any, value: any, lebel: any) => {
            props.setSelectedFilterCount((prevFilterCount: any) => ({
                selectedFilterCount:
                    prevFilterCount.selectedFilterCount === 'All content'
                        ? lebel
                        : prevFilterCount.selectedFilterCount !== ''
                            ? prevFilterCount.selectedFilterCount + ',' + lebel
                            : lebel,
            }));
        };

        const filterKeys = Object.keys(props?.selectedFilterPannelData);
        const processedKeys = new Set();

        if (filterKeys?.every((key) => props?.selectedFilterPannelData[key]?.Selected)) {
            props?.setSelectedFilterCount({ selectedFilterCount: 'All content' });
        } else if (filterKeys.some((key) => props?.selectedFilterPannelData[key]?.Selected)) {
            filterKeys.forEach((key) => {
                if (props?.selectedFilterPannelData[key]?.Selected && !processedKeys.has(key)) {
                    updateSelectedFilterCount(key, props?.selectedFilterPannelData[key]?.[key], props?.selectedFilterPannelData[key]?.lebel);
                    processedKeys.add(key);
                }
            });
        } else {
            props?.setSelectedFilterCount({ selectedFilterCount: 'No item is selected' });
        }
    };

    const setModalIsOpenToFalse = () => {
        props?.selectedFilterCallBack();
    };
    const handleChangeData = () => {
        props?.selectedFilterCallBack(props?.selectedFilterPannelData);
        selectedCount();
    };
    const onRenderCustomHeader = () => {
        return (
            <>
                <div className="alignCenter subheading">
                    <span style={{ color: `${props?.portfolioColor}` }} className="siteColor">Settings Advanced Search</span>
                </div>
                <Tooltip ComponentId={839} />
            </>
        );
    };
    return (
        <Panel className="overflow-x-visible"
            type={PanelType.custom}
            customWidth="450px"
            isOpen={props?.isOpen}
            onDismiss={setModalIsOpenToFalse}
            onRenderHeader={onRenderCustomHeader}
            isBlocking={false}
        >
            <div className="modal-body p-0 mt-2 mb-3">
                <div className="col-sm-12 p-0 smart">
                    <div className="">
                        <div>
                            <label>
                                <input className="cursor-pointer form-check-input rounded-0" style={props?.selectedFilterPannelData.Title.Selected && props?.portfolioColor ? { marginRight: '6px', marginBottom: '6px', backgroundColor: `${props?.portfolioColor}`, borderColor: `${props?.portfolioColor}` } : { marginRight: '6px', marginBottom: '6px', backgroundColor: "", borderColor: "" }}
                                    type="checkbox"
                                    name="Title"
                                    checked={props?.selectedFilterPannelData.Title.Selected}
                                    onChange={handleCheckboxChange}
                                />
                                Title
                            </label>
                            <br />
                            <label>
                                <input className="cursor-pointer form-check-input rounded-0" style={props?.selectedFilterPannelData.descriptionsSearch.Selected && props?.portfolioColor ? { marginRight: '6px', marginBottom: '6px', backgroundColor: `${props?.portfolioColor}`, borderColor: `${props?.portfolioColor}` } : { marginRight: '6px', marginBottom: '6px', backgroundColor: "", borderColor: "" }}
                                    type="checkbox"
                                    name="descriptionsSearch"
                                    checked={props?.selectedFilterPannelData.descriptionsSearch.Selected}
                                    onChange={handleCheckboxChange}
                                />
                                Descriptions
                            </label>
                            <br />
                            <label>
                                <input className="cursor-pointer form-check-input rounded-0" style={props?.selectedFilterPannelData.commentsSearch.Selected && props?.portfolioColor ? { marginRight: '6px', marginBottom: '6px', backgroundColor: `${props?.portfolioColor}`, borderColor: `${props?.portfolioColor}` } : { marginRight: '6px', marginBottom: '6px', backgroundColor: "", borderColor: "" }}
                                    type="checkbox"
                                    name="commentsSearch"
                                    checked={props?.selectedFilterPannelData.commentsSearch.Selected}
                                    onChange={handleCheckboxChange}
                                />
                                Comments
                            </label>
                            <br />
                            <label>
                                <input className="cursor-pointer form-check-input rounded-0" style={props?.selectedFilterPannelData.timeSheetsDescriptionSearch.Selected && props?.portfolioColor ? { marginRight: '6px', marginBottom: '6px', backgroundColor: `${props?.portfolioColor}`, borderColor: `${props?.portfolioColor}` } : { marginRight: '6px', marginBottom: '6px', backgroundColor: "", borderColor: "" }}
                                    type="checkbox"
                                    name="timeSheetsDescriptionSearch"
                                    checked={props?.selectedFilterPannelData.timeSheetsDescriptionSearch.Selected}
                                    onChange={handleCheckboxChange}
                                />
                                Timesheet Data
                            </label>
                            <br />
                            <label>
                                <input style={props?.selectedFilterPannelData.Title.Selected && props?.selectedFilterPannelData.commentsSearch.Selected && props?.selectedFilterPannelData.descriptionsSearch.Selected && props?.selectedFilterPannelData.timeSheetsDescriptionSearch.Selected && props?.portfolioColor ? { marginRight: '6px', marginBottom: '6px', backgroundColor: `${props?.portfolioColor}`, borderColor: `${props?.portfolioColor}` } : { marginRight: '6px', marginBottom: '6px', backgroundColor: "", borderColor: "" }} className="cursor-pointer form-check-input rounded-0"
                                    type="checkbox"
                                    name="selectAll"
                                    checked={props?.selectedFilterPannelData.Title.Selected && props?.selectedFilterPannelData.commentsSearch.Selected && props?.selectedFilterPannelData.descriptionsSearch.Selected && props?.selectedFilterPannelData.timeSheetsDescriptionSearch.Selected}
                                    onChange={handleSelectAllChange}
                                />
                                All content
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <footer>
                <button type="button" className="btn btn-default pull-right" style={{ backgroundColor: `${props?.portfolioColor}`, borderColor: `${props?.portfolioColor}` }} onClick={setModalIsOpenToFalse}>
                    Cancel
                </button>
                <button type="button" className="btn btn-primary mx-1 pull-right" style={{ backgroundColor: `${props?.portfolioColor}` }} onClick={() => handleChangeData()}>
                    Apply
                </button>

            </footer>
        </Panel>
    );
};
export default SelectFilterPanel;
