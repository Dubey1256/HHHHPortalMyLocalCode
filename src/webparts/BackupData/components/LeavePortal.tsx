import * as React from 'react'
import { Web } from 'sp-pnp-js';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Panel, PanelType } from 'office-ui-fabric-react';
const LeavePortal = (props: any) => {
    const closeLeavesPopup = () => {
        props.closeLeavesPopup()
    };
    const SaveLeave = () => {
        const Postdata: any = {
        };
        let web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/SP/')
        web.lists.getByTitle("SmalsusLeaveCalendar").items.add(Postdata).then((response: any) => {
            console.log(response);
        }).catch((error: any) => {
            console.error(error);
        });
    }
    return (
        <>
        
     
         <div>
            {
                <Panel
                    title="popup-title"
                    isOpen={true}
                    type={PanelType.medium}
                    isBlocking={false}  >
                    <div className="ms-modalExample-header">
                        <h3 id="popup-title">Apply Leave</h3>
                    </div>
                    <div className="col-sm-12">
                        <div className="col-sm-6">
                            <label> Planned Leaves</label>
                            <input type="text"></input>
                        </div>
                        <div className="col-sm-6">
                            <label> Un-Planned Leaves</label>
                            <input type="text"></input>
                        </div>
                    </div>
                    <div className="col-sm-12">
                        <div className="col-sm-6">
                            <label> Sick Leaves</label>
                            <input type="text"></input>
                        </div>
                        <div className="col-sm-6">
                            <label> Restricted Holiday Leaves</label>
                            <input type="text"></input>
                        </div>
                    </div>
                    <div className="col-sm-12">
                        <div className="col-sm-3">
                            <label> From Date</label>
                            <input type="date"></input>
                        </div>
                        <div className="col-sm-3">
                            <label> To Date</label>
                            <input type="date"></input>
                        </div>
                        <div className="col-sm-3">
                            <label> Leaves types</label>
                            <input type="option"></input>
                        </div>
                    </div>
                    <div className="ms-modalExample-footer">
                        <PrimaryButton onClick={() => closeLeavesPopup()} text="Close" />
                        <PrimaryButton onClick={() => SaveLeave()} text="Update" />
                    </div>
                </Panel>
            }
        </div >
        </>
    )
}
export default LeavePortal