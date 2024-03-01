import * as React from "react";
import { Panel, PanelType } from 'office-ui-fabric-react';
import Tooltip from "../../globalComponents/Tooltip";
const ColumnsSetting = (props: any) => {
    const [columnSettingVisibility, setColumnSettingVisibility] = React.useState<any>({});
    const [showHeader, setShowHeader] = React.useState<any>(props?.showHeader);
    const handleClosePopup = () => {
        props?.columnSettingCallBack('close')
    };
    const handleChangeDateAndDataCallBack = () => {
        const updatedData = { ...props?.columnVisibilityData };
        for (let key in columnSettingVisibility) {
            if (columnSettingVisibility.hasOwnProperty(key)) {
                if (props?.columnVisibilityData.hasOwnProperty(key)) {
                    updatedData[key] = columnSettingVisibility[key];
                } else {
                    updatedData[key] = columnSettingVisibility[key];
                }
            }
        }
        let preSetColumnSettingVisibility = {
            columnSettingVisibility: updatedData,
            showHeader: showHeader
        }
        const dataString = JSON.stringify(preSetColumnSettingVisibility);
        localStorage.setItem('preSetColumnSettingVisibility', dataString);
        let columnsVisibllityDataAll = {
            columnSettingVisibility: columnSettingVisibility,
            showHeader: showHeader
        }
        props?.columnSettingCallBack(columnsVisibllityDataAll)
    };
    const coustomColumnsSetting = (item: any, event: any) => {
        const { name, checked } = event.target;
        if (name != "toggleAll") {
            setColumnSettingVisibility((prevCheckboxes: any) => ({
                ...prevCheckboxes,
                [name]: checked
            }));
            props?.columns?.forEach((element: any) => {
                if (element.id === item.id) {
                    return element.isColumnVisible = checked
                }
            });
        } else {
            props?.columns?.forEach((element: any) => {
                if (element.id != "Title" && element.id != "portfolioItemsSearch" && element.id != "TaskID" && element.id != "descriptionsSearch" && element.id != "commentsSearch" && element.id != "timeSheetsDescriptionSearch") {
                    element.isColumnVisible = checked
                    setColumnSettingVisibility((prevCheckboxes: any) => ({
                        ...prevCheckboxes,
                        [element.id]: checked
                    }));
                }
            });
        }
    }

    const onRenderCustomHeader = () => {
        return (
            <>
                <div className="alignCenter subheading">
                    <span style={{ color: `${props?.portfolioColor}` }} className="siteColor">Table Settings</span>
                </div>
                <Tooltip ComponentId={7464} />
            </>
        );
    };

    const handleCheckboxChange = (event: any) => {
        setShowHeader(event.target.checked);
    };
    return (
        <Panel className="overflow-x-visible"
            type={PanelType.custom}
            customWidth="950px"
            isOpen={props?.isOpen}
            onDismiss={handleClosePopup}
            onRenderHeader={onRenderCustomHeader}
            isBlocking={false}
        >
            <div className="modal-body p-0 mt-2 mb-3">
                <div style={{ width: '100%' }} className="d-flex">
                    <div style={{ width: "50%" }}>
                        <div className="px-1 col-sm-6"><div style={{ fontWeight: 300, fontSize: "21px", display: 'contents' }}><span className="siteColor">Table Columns Settings</span></div></div>
                        {/* <div className="px-1 border-b border-black">
                            <label>
                                <input type='checkbox' checked={props?.columns.every((e: any) => e.isColumnVisible === true)}
                                    onChange={() => coustomColumnsSetting(props?.columns, event)} name="toggleAll"
                                />{' '}
                                Select All
                            </label>
                        </div> */}
                        {props?.columns?.map((column: any) => {
                            return (
                                <div key={column?.id} className="px-1 col-sm-6">
                                    {column?.placeholder != undefined && column?.placeholder != '' && column.id != "descriptionsSearch" && column.id != "commentsSearch" && column.id != "timeSheetsDescriptionSearch" && <label>
                                        <input className="form-check-input cursor-pointer me-1" type='checkbox' disabled={column?.id === "Title" || column?.id === "TaskID" || column?.id === "portfolioItemsSearch" ? true : false} checked={column?.isColumnVisible}
                                            onChange={(e: any) => coustomColumnsSetting(column, event)} name={column.id}
                                        />
                                        {column?.placeholder}
                                    </label>}
                                </div>
                            )
                        })}
                    </div>
                    <div style={{ width: "50%" }} className="m-2">
                        <div className="px-1 col-sm-6"><div style={{ fontWeight: 300, fontSize: "21px", display: 'contents' }}><span className="siteColor">Table Header Settings</span></div></div>
                        <div className="px-1 col-sm-6">
                            <label><input className="form-check-input cursor-pointer me-1" type="checkbox" checked={showHeader} onChange={handleCheckboxChange} name="showHeader" />Show Header</label>
                        </div>
                    </div>
                </div>
            </div>
            <footer>
                <button type="button" className="btn btn-default pull-right" style={{ backgroundColor: `${props?.portfolioColor}`, borderColor: `${props?.portfolioColor}` }} onClick={handleClosePopup}>
                    Cancel
                </button>
                <button type="button" className="btn btn-primary mx-1 pull-right" style={{ backgroundColor: `${props?.portfolioColor}` }} onClick={handleChangeDateAndDataCallBack}>
                    Apply
                </button>
            </footer>
        </Panel>
    );
};
export default ColumnsSetting;