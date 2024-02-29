import * as React from "react";
import { useState } from "react";
import { Panel, PanelType } from 'office-ui-fabric-react';
import { myContextValue } from '../globalCommon'
import Tooltip from "../Tooltip";
import Form from 'react-bootstrap/Form';
const EditTrafficLightComment = (props: any) => {
    const myContextValue2: any = React.useContext(myContextValue)
    const [copyTrafficlight, setCopyTrafficlight] = useState("");
    const [copycolumnVerificationStatus, SetCopycolumnVerificationStatus]: any = useState("No")
    const [copyCommentData, setCopyCommentData] = useState("")
    React.useEffect(() => {
        if (myContextValue2?.columnVerificationStatus == "true" || myContextValue2?.columnVerificationStatus == "Yes") {
            SetCopycolumnVerificationStatus("Yes")
        }
        if (myContextValue2?.columnVerificationStatus == "false" || myContextValue2?.columnVerificationStatus == "No") {
            SetCopycolumnVerificationStatus("No")
        }
        setCopyTrafficlight(myContextValue2?.trafficValue)
        setCopyCommentData(myContextValue2?.CommentData)

    }, [])
    const onRenderCustomHeadercomment = () => {
        return (
            <>
                <div className='subheading alignCenter'>

                    Comment - {props?.columnData?.Title}

                </div>
                <Tooltip ComponentId='484' />
            </>
        );
    }
    const handleUpdateComment = (commentData: any) => {
        setCopyCommentData(commentData)
        // myContextValue2.SetCommentData(commentData)
    }
    const changeTrafficLight = (trafficValue: any) => {
        console.log(trafficValue)
        setCopyTrafficlight(trafficValue)
        // myContextValue2.setTrafficValue(trafficValue)
    }
    const cancelPopup = () => {
        props?.setOpenCommentpopup(false)
    }
    const updateData = () => {
        myContextValue2?.setTrafficValue(copyTrafficlight);
         myContextValue2?.SetCommentData(copyCommentData)
         myContextValue2?.setcolumnVerificationStatus(copycolumnVerificationStatus)
         props?.setOpenCommentpopup(false)
         let UpdateData={
             trafficValue:copyTrafficlight,
             CommentData:copyCommentData,
             columnVerificationStatus:copycolumnVerificationStatus
         }
         myContextValue2?.updateJson(UpdateData) 
         
      
     }
    return (
        <>
            <Panel
                onRenderHeader={onRenderCustomHeadercomment}
                isOpen={true}
                type={PanelType.custom}
                customWidth="375px"
                onDismiss={() => props?.setOpenCommentpopup(false)}
                isBlocking={false}
            >
                <div className="border-top modal-body">
                    <div className="row py-3">
                     <div className="col">
                     <span className="fw-semibold">Select Traffic Lights</span>
                            <div>
                                <ul className="list-none">
                                    <li className="alignCenter my-1" onClick={() => changeTrafficLight("Incorrect")}>
                                        <span title="Incorrect" className={copyTrafficlight == "Incorrect" ? "circlelight br_red red" : "circlelight br_red"}>
                                        </span> <span className="ms-1">Incorrect</span>
                                    </li>
                                    <li className="alignCenter my-1" onClick={() => changeTrafficLight("Maybe")} >
                                        <span title="Maybe" className={copyTrafficlight == "Maybe" ? "circlelight br_yellow yellow" : "circlelight br_yellow"} >
                                        </span>  <span className="ms-1">Maybe</span>
                                    </li>
                                    <li className="alignCenter my-1" onClick={() => changeTrafficLight("Correct")}>
                                        <span title="Correct" className={copyTrafficlight == "Correct" ? "circlelight br_green green" : "circlelight br_green"} >
                                        </span>   <span className="ms-1">Correct</span>
                                    </li>
                                    <li className="alignCenter my-1" onClick={() => changeTrafficLight("NA")}>
                                        <span title="NA" className={copyTrafficlight == "NA" ? "circlelight notable" : "circlelight br_black"} >
                                        </span>   <span className="ms-1">Not Available</span>
                                    </li>
                                </ul>
                            </div>


                        </div>
                        <div className="col-4">
                        <div className="fw-semibold ps-2"> Verify</div>
                        <div className="alignCenter  float-end">
                                {/* <span className='me-1'>No</span> */}
                                <label className="switch me-1" htmlFor="checkbox">
                                    <input checked={copycolumnVerificationStatus === "Yes" ? true : false} onChange={() => SetCopycolumnVerificationStatus(copycolumnVerificationStatus == "No" ? "Yes" : "No")} type="checkbox" id="checkbox" />
                                    {copycolumnVerificationStatus === "Yes" ? <div className="slider round" title='Toggle To Verify the Present Content ' ></div> : <div title='The Information Present is Verified' className="slider round"></div>}
                                </label>
                                {/* <span>Yes</span> */}
                                <span> <a className="border brush ms-2 p-1" onClick={()=>setCopyTrafficlight("")}><i className="fa fa-paint-brush " aria-hidden="true" title="Clear All"></i></a>                        
                                </span>
                            </div>
                   
                        </div>
                    </div>

                    <div className='col mt-3'>
                        <div className="alignCenter">
                            <div className="fw-semibold">Add Comment</div>
                            <div className="ml-auto">
                                <a className="href"><span onClick={()=>setCopyCommentData("")} >Clear</span></a>
                            </div>
                        </div>

                        <textarea id="txtUpdateComment" rows={6} className="full-width" value={copyCommentData} onChange={(e) => handleUpdateComment(e.target.value)}  ></textarea>
                    </div>
                </div>
                <footer className='modal-footer mt-2 p-0 pt-1 '>
                    <button className="btn btn-primary  mx-1"
                        onClick={(e) => updateData()}
                    >Save</button>
                    <button className='btn btn-default m-0' onClick={() => cancelPopup()}>Cancel</button>
                </footer>
            </Panel>
        </>
    )
}
export default EditTrafficLightComment;