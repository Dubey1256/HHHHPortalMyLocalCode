import * as React from "react";
import { useState } from 'react';

const CountryContactEditPopup = (props: any) => {
    console.log("selected country ===", props.selectedCountry)
    const [selectedData, setSelectedData] = useState({
        Title: (props.selectedCountry.length>0?props.selectedCountry[0].Title:'')
    });
    const selectData = (item: any) => {
        let data =[];
        data.push(item);
        setSelectedData(item);
        props.selectedCountryStatus(data);
    }
    return (
        <div>
            <div className="popup-section">
                <div className="popup-container-country">
                    <div className="popup-content">
                        <div className="card">
                            <div className="card-header d-flex justify-content-between">
                                <div><h3>Select {props.popupName}</h3></div>
                                <button className="btn-close" onClick={() => props.callBack()}></button>
                            </div>
                            <div className="card-body">
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
                                    <button className="country-popup-header-button">
                                        OK
                                    </button>
                                </div>
                                {props.popupName == "Country" ? <div className="d-flex my-2">
                                    <input type="text" className="form-control" style={{ width: "18rem" }} placeholder="Search Metadata" /><button>Search</button>
                                </div> : null}
                                <div className="d-flex">
                                    <div className="list-group my-2" style={{ width: "18rem" }}>
                                        {props.data?.map((item: any) => {
                                            return (
                                                <li className="list-group-item list-group-item-action" onClick={() => selectData(item)}>{item.Title}</li>
                                            )
                                        })}
                                    </div>
                                    <div className="list-group mx-2 my-2 d-flex" style={{ width: "18rem" }}>
                                        {selectedData.Title != undefined ? 
                                        <li className="list-group-item list-group-item-action d-flex justify-content-between" style={{ background: "#000066", color: "#fff" }} >
                                            <span>{selectedData.Title}</span>
                                            <span style={{ cursor: 'pointer' }} onClick={() => setSelectedData({ ...selectedData, Title: '' })}><img src='https://hhhhteams.sharepoint.com/_layouts/images/delete.gif' />
                                            </span>
                                        </li>
                                         : null}
                                    </div>
                                </div>
                                <div className="card-footer text-muted justify-content-end">
                                    <a>Manage Smart Taxonomy</a>
                                    <button className="btn btn-primary mx-2" onClick={() => props.callBack()}>Save</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default CountryContactEditPopup;