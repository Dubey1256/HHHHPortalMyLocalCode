import * as React from "react";
import { useState } from 'react';
import Tooltip from "../../../../../globalComponents/Tooltip";
import { Panel, PanelType } from 'office-ui-fabric-react';
import { Button } from "react-bootstrap";
const CountryContactEditPopup = (props: any) => {
    const [updateData,setUpdateData]=React.useState(props?.updateData)
  
    const [selectedStateData, setSelectedStateData] = useState({
        Title: (props?.selectedState != undefined ? props?.selectedState?.Fedral_State : '')
    })
    React.useEffect(()=>{
        setUpdateData(props?.updateData) 
    },[])
    const selectData = (item: any) => {
        let backupdata=JSON.parse(JSON.stringify(updateData));
       setUpdateData(backupdata);
         let data = [];
        data.push(item);
        if (props.popupName == 'Country') {
    backupdata= {...backupdata,...{
            SmartCountries:[item]
        }}
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
                <div className='subheading alignCenter'>
                    Select {props.popupName}
                </div>
                <Tooltip ComponentId='1626' />
            </>
        );
    };
    return (
        <Panel onRenderHeader={onRenderCustomHeadersmartinfo}
            isOpen={true}
            type={PanelType.custom}
            customWidth="1280px"
            isBlocking={false}
            onDismiss={() => props.callBack()}
        >
             <div>
                <div className="panel-body">
                    <div className="d-flex justify-content-between">
                        <div className="country-popup-header d-flex">
                            <img src="https://hhhhteams.sharepoint.com/_layouts/images/EMMDoubleTag.png" />
                            <div className="mx-2">
                                <div>
                                    <span>New items are added under the currently selected item.  <button>Add New Item</button>
                                    </span>
                                </div>
                                <div>
                                    <span>Make a request or send feedback to the Term Set manager. <button>Send Feedback</button>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {props.popupName == "Country" ? <div className="d-flex my-2">
                        <input type="text" className="form-control" style={{ width: "18rem" }} placeholder="Search Metadata" /><button>Search</button>
                    </div> : null}
                    <div className="d-flex">
                        <div className="list-group my-2" style={{ width: "18rem" }}>
                            {props.data?.map((item: any) => {
                                return (
                                    <li className="list-group-item list-group-item-action" style={{ cursor: 'pointer' }} onClick={() => selectData(item)}>{item.Title}</li>
                                )
                            })}
                        </div>
                        <div className="list-group mx-2 my-2 d-flex" style={{ width: "18rem" }}>
                            {props?.popupName == 'Country' && updateData?.SmartCountries?.length>0 ?
                                <li className="list-group-item list-group-item-action d-flex justify-content-between" style={{ background: "#000066", color: "#fff" }} >
                                    <span>{updateData?.SmartCountries?.[0]?.Title}</span>
                                    <span style={{ cursor: 'pointer' }} onClick={() => updateData({ ...updateData, SmartCountries: [] })}><img src='https://hhhhteams.sharepoint.com/_layouts/images/delete.gif' />
                                    </span>
                                </li>
                                : null}

                            {/* {props?.popupName == 'State' && selectedStateData?.Title != '' ?
                                <li className="list-group-item list-group-item-action d-flex justify-content-between" style={{ background: "#000066", color: "#fff" }} >
                                    <span>{selectedStateData.Title}</span>
                                    <span style={{ cursor: 'pointer' }} onClick={() => setSelectedData({ ...selectedStateData, Title: '' })}><img src='https://hhhhteams.sharepoint.com/_layouts/images/delete.gif' />
                                    </span>
                                </li>
                                : null} */}
                        </div>
                    </div>
                </div>
                <footer className="pull-right">
                    {/* <a href="">Manage Smart Taxonomy</a> */}
                    <Button className='btn btn-primary mx-1' onClick={() => props.callBack(updateData)}>
                        Save
                    </Button>
                    <Button className='btn btn-default mx-1' onClick={() => props.callBack()}>
                        Cancel
                    </Button>
                </footer>
                </div>

        </Panel>
    )
}
export default CountryContactEditPopup;