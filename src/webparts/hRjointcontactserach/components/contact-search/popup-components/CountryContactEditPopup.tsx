import * as React from "react";

const CountryContactEditPopup = (props: any) => {
    return (
        <div>
            <div className="popup-section">
                <div className="popup-container-country">
                    <div className="popup-content">
                        <div className="card">
                            <div className="card-header d-flex justify-content-between">
                                <div><h3>Select Countries</h3></div>
                                <button className="btn-close" onClick={() => props.callBack()}></button>
                            </div>
                            <div className="card-body">
                                <div className="d-flex justify-content-between">
                                    <div>
                                        <p>New items are added under the currently selected item. <button>Add New Item</button></p>
                                        <p>Make a request or send feedback to the Term Set manager. <button>Send Feedback</button></p>
                                    </div>
                                    <button className="btn btn-primary">
                                        OK
                                    </button>
                                </div>
                                <div>
                                    <input type="text" className="from-control" placeholder="Search Metadata" /><button>Search</button>
                                </div>
                                {props.data?.map((item:any)=>{
                                    return(
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