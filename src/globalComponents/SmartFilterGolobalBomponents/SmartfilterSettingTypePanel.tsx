import React from "react";
import { Panel, PanelType } from '@fluentui/react/lib/Panel';
const SmartfilterSettingTypePanel = (items: any) => {
    const onRenderCustomHeader = () => {
        return (
            <>
                <div className="alignCenter subheading">
                    <span className="siteColor">Settings Portfolio And Task Types</span>
                </div>
            </>
        );
    };
    const handleChangeData = () => {
        items?.setSmartFilterTypePannel(false)
    }
    return (
        <>
            <Panel
                isOpen={items?.isOpen}
                onDismiss={handleChangeData}
                type={PanelType.custom}
                customWidth="400px"
                onRenderHeader={onRenderCustomHeader}
                isBlocking={false}
            >
                <div className='d-flex settingTooltip'>
                    {items?.filterGroupsData != null && items?.filterGroupsData.length > 0 &&
                        items?.filterGroupsData?.map((MainGroup: any, index: any) => {
                            if (MainGroup?.Title == "Type") {
                                return (
                                    <>
                                        {MainGroup?.values?.map((Group: any) => {
                                            return (
                                                <div className='dataSec'>
                                                    <div className="alignCenter dataSecParentSec">
                                                        <input className={"form-check-input cursor-pointer mt-0"}
                                                            style={Group?.values?.length === MainGroup?.checked?.length ? { backgroundColor: items?.portfolioColor, borderColor: items?.portfolioColor } : Group?.selectAllChecked === true ? { backgroundColor: items?.portfolioColor, borderColor: items?.portfolioColor } : { backgroundColor: '', borderColor: '' }}
                                                            type="checkbox"
                                                            checked={items?.isGroupChecked(MainGroup, Group)}
                                                            onChange={(e: any) => items?.selectAllFromAbove(Group, e.target.checked)}
                                                            ref={(input) => {
                                                                if (input) {
                                                                    let filteredChecked = MainGroup?.checked?.filter((checkedItem: any) => Group?.children?.some((child: any) => child.Id == checkedItem && child?.ParentID !== "0"));
                                                                    const isIndeterminate = !items?.isGroupChecked(MainGroup, Group) && filteredChecked?.length != 0;
                                                                    input.indeterminate = isIndeterminate;
                                                                    if (isIndeterminate) { input.style.backgroundColor = items?.portfolioColor; input.style.borderColor = items?.portfolioColor; } else { input.style.backgroundColor = ''; input.style.borderColor = ''; }
                                                                }
                                                            }}
                                                        />
                                                        <div className="fw-semibold ms-8 f-16 text-dark">{Group.Title}</div>
                                                    </div>
                                                    <div className='dataSecChild'>
                                                        {Group?.values?.sort((a: any, b: any) => a.SortOrder - b.SortOrder)?.map((insideCheckBox: any) => {
                                                            return (
                                                                <label className='alignCenter f-16 dataSecChildSec'>
                                                                    <input type="checkbox" className={"form-check-input cursor-pointer mt-0"} checked={MainGroup?.checked?.some((datachecked: any) => datachecked == insideCheckBox?.Id)} onChange={() => items?.selectChild(insideCheckBox)} />
                                                                    <div className='ms-8'>{insideCheckBox?.Title}</div>
                                                                </label>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </>
                                )
                            }
                        })
                    }
                </div>
                <footer>
                    <button type="button" className="btn btn-default pull-right" onClick={handleChangeData}>
                        Cancel
                    </button>
                    <button type="button" className="btn btn-primary mx-1 pull-right" onClick={handleChangeData}>
                        Apply
                    </button>
                </footer>
            </Panel>
        </>
    )
}

export default SmartfilterSettingTypePanel;