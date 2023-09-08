import * as React from "react";
import { Panel, PanelType } from 'office-ui-fabric-react';


const SelectFilterPanel = (props: any) => {
    // const [props?.selectedFilterPannelData, setCheckboxes] = React.useState({
    //   Title: { Title: 'Title', Selected: true },
    //   commentsSearch: { commentsSearch: 'commentsSearch', Selected: true },
    //   descriptionsSearch: { descriptionsSearch: 'Body', Selected: true },
    // });
    // Function to handle individual checkbox toggling
    const handleCheckboxChange = (event: any) => {
        const { name, checked } = event.target;
        props?.setSelectedFilterPannelData((prevCheckboxes: any) => ({ ...prevCheckboxes, [name]: { [name]: name, Selected: checked } }));
    };

    const handleSelectAllChange = (event: any) => {
        const { checked } = event.target;
        props?.setSelectedFilterPannelData({
            Title: { Title: 'Title', Selected: checked },
            commentsSearch: { commentsSearch: 'commentsSearch', Selected: checked },
            descriptionsSearch: { descriptionsSearch: 'descriptionsSearch', Selected: checked },
        });
    };

    const setModalIsOpenToFalse = () => {
        props?.selectedFilterCallBack();
    };

    const handleChangeData = () => {
        props?.selectedFilterCallBack(props?.selectedFilterPannelData);
    };

    // const CustomFooter = () => {
    //     return (
    //         <div>
    //             <button type="button" className="btn btn-default mx-1 me-2 pull-right" style={{backgroundColor: `${props?.portfolioColor}`}} onClick={setModalIsOpenToFalse}>
    //                 Cancel
    //             </button>
    //             <button type="button" className="btn btn-primary pull-right" style={{backgroundColor: `${props?.portfolioColor}`}} onClick={() => handleChangeData()}>
    //                 Apply
    //             </button>
    //         </div>
    //     );
    // };

    const onRenderCustomHeader = () => {
        return (
            <div className="d-flex full-width pb-1">
                <div className="subheading">
                    <span style={{ color: `${props?.portfolioColor}` }}>Select Filter</span>
                </div>
            </div>
        );
    };

    return (
        <Panel
            type={PanelType.custom}
            customWidth="250px"
            isOpen={props?.isOpen}
            onDismiss={setModalIsOpenToFalse}
            onRenderHeader={onRenderCustomHeader}
            isBlocking={props?.isOpen}
        // onRenderFooter={CustomFooter}
        >
            <div className="modal-body p-0 mt-2 mb-3">
                <div className="col-sm-12 p-0 smart">
                    <div className="">
                        <div>
                            <label>
                                <input style={{ marginRight: '6px', marginBottom: '6px', backgroundColor: `${props?.portfolioColor}`, borderColor: `${props?.portfolioColor}` }} className="cursor-pointer form-check-input rounded-0"
                                    type="checkbox"
                                    name="selectAll"
                                    checked={props?.selectedFilterPannelData.Title.Selected && props?.selectedFilterPannelData.commentsSearch.Selected && props?.selectedFilterPannelData.descriptionsSearch.Selected}
                                    onChange={handleSelectAllChange}
                                />
                                Select All
                            </label>
                            <br />
                            <label>
                                <input className="cursor-pointer form-check-input rounded-0" style={{ marginRight: '6px', marginBottom: '6px', backgroundColor: `${props?.portfolioColor}`, borderColor: `${props?.portfolioColor}` }}
                                    type="checkbox"
                                    name="Title"
                                    checked={props?.selectedFilterPannelData.Title.Selected}
                                    onChange={handleCheckboxChange}
                                />
                                Title
                            </label>
                            <br />
                            <label>
                                <input className="cursor-pointer form-check-input rounded-0" style={{ marginRight: '6px', marginBottom: '6px', backgroundColor: `${props?.portfolioColor}`, borderColor: `${props?.portfolioColor}` }}
                                    type="checkbox"
                                    name="commentsSearch"
                                    checked={props?.selectedFilterPannelData.commentsSearch.Selected}
                                    onChange={handleCheckboxChange}
                                />
                                Comments
                            </label>
                            <br />
                            <label>
                                <input className="cursor-pointer form-check-input rounded-0" style={{ marginRight: '6px', marginBottom: '6px', backgroundColor: `${props?.portfolioColor}`, borderColor: `${props?.portfolioColor}` }}
                                    type="checkbox"
                                    name="descriptionsSearch"
                                    checked={props?.selectedFilterPannelData.descriptionsSearch.Selected}
                                    onChange={handleCheckboxChange}
                                />
                                Descriptions
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <footer>
            <button type="button" className="btn btn-default pull-right" style={{ backgroundColor: `${props?.portfolioColor}`, borderColor:`${props?.portfolioColor}` }} onClick={setModalIsOpenToFalse}>
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
