import * as React from "react";
import { useEffect} from 'react';

const CountryContactEditPopup = (props: any) => {

   useEffect(()=>{
    console.log("use effect");
    if(props.popupName == "State"){
        getStateData();
    }else{
        getCountryData();
    }
   },[])

   const getStateData =()=>{
      console.log("this state api function");
   }
   const getCountryData =()=>{
      console.log("this country api function");
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
                                {props.popupName == "Country" ? <div>
                                    <input type="text" className="from-control" placeholder="Search Metadata" /><button>Search</button>
                                </div> : null}
                                {props.data?.map((item: any) => {
                                    return (
                                        <div className="d-inline">
                                            <input type='button' className="form-control btn-sm" defaultValue={item.Title} />
                                        </div>
                                    )
                                })}

                                <div className="card-footer text-muted justify-content-end">
                                    <a>Manage Smart Taxonomy</a><button className="btn btn-primary mx-2">Save</button>
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