import * as React from "react";


const addToLocalDBComponent = (props: any) => {
    return (

        <div className="popup-section">
            <div className="popup-container">
                <div className="popup-content">
                    <div className="card">
                        <div className="card-header d-flex justify-content-between">
                            <div><h3>Tag Contact</h3></div>
                            <button className="btn-close" onClick={() => props.callBack()}></button>
                        </div>
                        <div className="card-body py-4">
                            <input type='radio'className="mx-1" disabled name="HR"/> <label className="mx-2">HR</label>
                            <input type='radio'className="mx-1"  name="GMBH"/> <label className="mx-">GMBH</label>
                        </div>
                        <div className="card-footer justify-content-end">
                            <button className="btn btn-primary mx-1">Save</button>
                            <button onClick={() => props.callBack()} className="btn btn-danger mx-1">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default addToLocalDBComponent;