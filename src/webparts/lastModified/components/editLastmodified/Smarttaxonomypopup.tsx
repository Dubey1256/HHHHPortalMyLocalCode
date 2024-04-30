import * as React from "react";
import { useState } from 'react';
import Tooltip from "../../../../globalComponents/Tooltip";
import { Panel, PanelType } from 'office-ui-fabric-react';
import { Button } from "react-bootstrap";
import { IoSearchOutline } from "react-icons/io5";

let data: any = [];
let backupdata: any;
const Smarttaxonomypopup = (props: any) => {
    const [updateData, setUpdateData] = React.useState(props?.updateData)
    backupdata = JSON.parse(JSON.stringify(updateData));
    const [selectedStateData, setSelectedStateData] = useState({
        Title: (props?.selectedState != undefined ? props?.selectedState?.Fedral_State : '')
    })
    React.useEffect(() => {
        setUpdateData(props?.updateData)
    }, [])
    const selectData = (item: any) => {
        backupdata = JSON.parse(JSON.stringify(updateData));
        setUpdateData(backupdata);
        data.push(item);
        if (props.popupName == 'Country') {
            backupdata.SmartActivities.map((i: any) => {
                if (i.Id != item.Id) {
                    backupdata.SmartActivities.push(item)
                }
            })
            setUpdateData(backupdata);
        }
        if (props.popupName == 'Activities') {
            backupdata.SmartActivities.map((i: any) => {
                if (i.Id != item.Id) {
                    backupdata.SmartActivities.push(item)
                }
            })
            setUpdateData(backupdata);
        }
        if (props.popupName == 'Contact Categories') {
            backupdata.SmartCategories.map((i: any) => {
                if (i.Id != item.Id) {
                    backupdata.SmartCategories.push(item)
                }
            })
            setUpdateData(backupdata);
        }
        if (props.popupName == 'State') {
            setSelectedStateData(item);
            props.selectedStateStatus(item);
        }
    }
    const onRenderCustomHeadersmartinfo = () => {
        return (
            <>
            <h3>Select {props.popupName} <span className="ml-auto"> <Tooltip ComponentId='1626' /></span></h3>
            </>
        );
    };
    const CustomFootersmartinfo = () => {
        return (
            <footer>
                <div className="col text-end">
                    <button className='btn btn-primary mx-2' onClick={() => props.callBack(updateData)}>
                        Save
                    </button>
                    <button className='btn btn-default' onClick={() => props.callBack()}>
                        Cancel
                    </button>
                </div>
            </footer>
        )
    }
    const removeSelectTaxanomy = (item: any, taxType: any) => {
        if (taxType == 'Activities' && backupdata.SmartActivities != undefined && backupdata.SmartActivities != null && backupdata.SmartActivities.length > 0) {
            backupdata.SmartActivities.map((i: any, index: any) => {
                if (i.Id == item.Id) {
                    backupdata.SmartActivities.splice(index, 1)
                }
            })
        }
        if (taxType == 'Contact Categories' && backupdata.SmartCategories != undefined && backupdata.SmartCategories != null && backupdata.SmartCategories.length > 0) {
            backupdata.SmartCategories.map((i: any, index: any) => {
                if (i.Id == item.Id) {
                    backupdata.SmartCategories.splice(index, 1)
                }
            })
        }
        if (taxType == 'Country' && backupdata.SmartCountries != undefined && backupdata.SmartCountries != null && backupdata.SmartCountries.length > 0) {
            backupdata.SmartCountries.map((i: any, index: any) => {
                if (i.Id == item.Id) {
                    backupdata.SmartCountries.splice(index, 1)
                }
            })
        }
        setUpdateData(backupdata);
    }
    return (
        <Panel onRenderHeader={onRenderCustomHeadersmartinfo}
            isOpen={true}
            type={PanelType.custom}
            customWidth="1280px"
            isBlocking={false}
            onRenderFooterContent={CustomFootersmartinfo}
            isFooterAtBottom={true}
            onDismiss={() => props.callBack()}
        >
            <div>
                <div className="panel-body">
                    <div className="d-flex justify-content-between">
                        <div className="country-popup-header d-flex">
                            {/* <img src="https://hhhhteams.sharepoint.com/_layouts/images/EMMDoubleTag.png" /> */}
                            <div className="mx-2">
                                <div>
                                    <span>New items are added under the currently selected item.  <a href="#">Add New Item</a>
                                    </span>
                                </div>
                                <div>
                                    <span>Make a request or send feedback to the Term Set manager. <a href="#">Send Feedback</a>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="position-relative w-25">
                        <input type="text" className="form-control searchbox_height mt-20 mb-3" style={{ width: "18rem" }} placeholder="Search Metadata" />
                        <span className="searchicon"><IoSearchOutline size={24} /></span>
                    </div>
                    <div className="d-flex">
                        <div className="list-group my-2" style={{ width: "18rem" }}>
                            {props.data?.map((item: any) => {
                                if (item.Title !== 'Status') {
                                    return (
                                        <li className="list-group-item list-group-item-action" style={{ cursor: 'pointer' }} onClick={() => selectData(item)}>
                                            {item.Title}               
                                        </li>
                                    );
                                }
                                return null;
                            })}

                        </div>
                        <div className="list-group mx-2 my-2 d-flex" style={{ width: "18rem" }}>
                            {props?.popupName == 'Country' && updateData?.SmartCountries?.length > 0 ?
                                updateData?.SmartCountries?.map((item: any) => {
                                    return (
                                        <>
                                            <li className="list-group-item list-group-item-action alignCenter justify-content-between" style={{ background: "#008939", color: "#fff" }} >
                                                <span>{item.Title}</span>
                                                <span className='bg-light ms-1 hreflink svg__icon--cross svg__iconbox' onClick={() => removeSelectTaxanomy(item, 'Country')}>
                                                </span>
                                            </li >
                                        </>
                                    )
                                })
                                : null}
                            {props?.popupName == 'Activities' && updateData?.SmartActivities?.length > 0 ?
                                updateData?.SmartActivities?.map((item: any) => {
                                    return (
                                        <>
                                            <li className="list-group-item list-group-item-action alignCenter justify-content-between" style={{ background: "#008939", color: "#fff" }} >
                                                <span>{item.Title}</span>
                                                <span className='bg-light ms-1 hreflink svg__icon--cross svg__iconbox' onClick={() => removeSelectTaxanomy(item, 'Activities')}>
                                                </span>
                                            </li >
                                        </>
                                    )
                                })
                                : null}

                            {props?.popupName == 'Contact Categories' && updateData?.SmartCategories?.length > 0 ?
                                updateData?.SmartCategories?.map((item: any) => {
                                    return (
                                        <>
                                            <li className="list-group-item list-group-item-action alignCenter justify-content-between" style={{ background: "#008939", color: "#fff" }} >
                                                <span>{item.Title}</span>
                                                <span className='bg-light ms-1 hreflink svg__icon--cross svg__iconbox' onClick={() => removeSelectTaxanomy(item, 'Contact Categories')}>
                                                </span>
                                            </li >
                                        </>
                                    )
                                })
                                : null}
                        </div>
                    </div>
                </div>

            </div>

        </Panel>
    )
}
export default Smarttaxonomypopup;