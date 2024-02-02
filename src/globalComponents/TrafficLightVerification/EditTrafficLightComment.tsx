import * as React from "react";
import { useState } from "react";
import { Panel, PanelType } from 'office-ui-fabric-react';
import { myContextValue } from '../globalCommon'
import Tooltip from "../Tooltip";
const EditTrafficLightComment = (props: any) => {
    const myContextValue2: any = React.useContext(myContextValue)

    const onRenderCustomHeadercomment = () => {
        return (
            <>
                <div className='subheading alignCenter'>

                    Comment -{props?.columnData?.Title}

                </div>
                <Tooltip ComponentId='' />
            </>
        );
    }
    const handleUpdateComment = (commentData: any) => {
        myContextValue2.SetCommentData(commentData)
    }
    const changeTrafficLight = (trafficValue: any) => {
        console.log(trafficValue)
        myContextValue2.setTrafficValue(trafficValue)
    }
    return (
        <>
            <Panel
                onRenderHeader={onRenderCustomHeadercomment}
                isOpen={true}
                type={PanelType.custom}
                customWidth="950px"
                onDismiss={() => props?.setOpenCommentpopup(false)}
                isBlocking={false}
            >
                <div className="border-dark border-top modal-body">
                    <div className="row py-3">
                        <div className="col">
                            <div className="editcolumn">


                                <select className="w-100" value={myContextValue2?.columnVerificationStatus} onChange={(e) => myContextValue2?.setcolumnVerificationStatus(e?.target?.value)}>
                                    <option value="false">NO</option>
                                    <option value="true"> Yes </option>

                                </select>

                            </div>
                        </div>
                        <div className="col">
                            <div className="alignCenter">
                                <div>
                                    <span className="fw-semilold">Select Traffic Lights</span>
                                </div>
                                <div className="ml-auto">
                                    <a className="href"><span >Clear</span></a>
                                </div>
                            </div>
                            <div>
                                <ul className="list-none">
                                    <li className="alignCenter my-1" onClick={() => changeTrafficLight("Incorrect")}>
                                        <span title="Incorrect" className={myContextValue2?.trafficValue == "Incorrect" ? "circlelight br_red red" : "circlelight br_red"}>
                                        </span> <span className="ms-1">Incorrect</span>
                                    </li>
                                    <li className="alignCenter my-1" onClick={() => changeTrafficLight("Maybe")} >
                                        <span title="Maybe" className={myContextValue2?.trafficValue == "Maybe" ? "circlelight br_yellow yellow" : "circlelight br_yellow"} >
                                        </span>  <span className="ms-1">Maybe</span>
                                    </li>
                                    <li className="alignCenter my-1" onClick={() => changeTrafficLight("Correct")}>
                                        <span title="Correct" className={myContextValue2?.trafficValue == "Correct" ? "circlelight br_green green" : "circlelight br_green"} >
                                        </span>   <span className="ms-1">Correct</span>
                                    </li>
                                    <li className="alignCenter my-1" onClick={() => changeTrafficLight("NA")}>
                                        <span title="NA" className={myContextValue2?.trafficValue == "NA" ? "circlelight notable" : "circlelight br_black"} >
                                        </span>   <span className="ms-1">Not Available</span>
                                    </li>
                                </ul>
                            </div>


                        </div>
                    </div>

                    <div className='col mt-3'>
                        <div className="alignCenter">
                            <div className="fw-semilold">Add Comment</div>
                            <div className="ml-auto">
                                <a className="href"><span >Clear</span></a>
                            </div>
                        </div>

                        <textarea id="txtUpdateComment" rows={6} className="full-width" value={myContextValue2?.CommentData} onChange={(e) => handleUpdateComment(e.target.value)}  ></textarea>
                    </div>
                </div>
                <footer className='modal-footer mt-2'>
                    <button className="btn btn-primary ms-1"
                     onClick={(e) => myContextValue2?.updateJson()}
                    >Save</button>
                    <button className='btn btn-default ms-1' onClick={() => props?.setOpenCommentpopup(false)}>Cancel</button>
                </footer>
            </Panel>
        </>
    )
}
export default EditTrafficLightComment;