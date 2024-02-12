import * as React from "react";
import { Panel, PanelType } from 'office-ui-fabric-react';
import Tooltip from "../../globalComponents/Tooltip";
const ColumnsSetting = (props: any) => {
    const [columnSettingVisibility, setColumnSettingVisibility] = React.useState<any>({});
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
        const dataString = JSON.stringify(updatedData);
        localStorage.setItem('preSetColumnSettingVisibility', dataString);
        props?.columnSettingCallBack(columnSettingVisibility)
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
                    <span style={{ color: `${props?.portfolioColor}` }} className="siteColor">Column Settings</span>
                </div>
                <Tooltip ComponentId={7464} />
            </>
        );
    };
    return (
        <Panel className="overflow-x-visible"
            type={PanelType.custom}
            customWidth="450px"
            isOpen={props?.isOpen}
            onDismiss={handleClosePopup}
            onRenderHeader={onRenderCustomHeader}
            isBlocking={false}
        >
            <div className="modal-body p-0 mt-2 mb-3">
                <div className="col-sm-12 p-0 smart">

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
