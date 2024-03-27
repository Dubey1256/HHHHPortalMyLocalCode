
import * as React from "react";
import { useState, useEffect } from "react";
import { myContextValue } from '../globalCommon'
import { FaCommentDots } from "react-icons/fa";
import EditTrafficLightComment from './EditTrafficLightComment'
import { Web } from "sp-pnp-js";
//import { LiaCommentDotsSolid } from "react-icons/lia";
import { BiCommentDetail } from "react-icons/bi";
let JsonColumn: any
let ListId: any
let siteUrl: any
let copyTrafficLight: any;
const TrafficLightComponent = (props: any) => {
    const [openCommentpopup, setOpenCommentpopup] = useState(false)
    const [columnVerificationStatus, setcolumnVerificationStatus]: any = useState()
    const [trafficValue, setTrafficValue] = useState("")
    const [CommentData, SetCommentData] = useState("")
    let JsonColumnCopy = React.useRef("")
    const [columnLevelVerificationJson, setColumnLevelVerificationJson]: any = useState()
    useEffect(() => {
        if (props?.columnName != undefined) {
            let copycolumnVerificationStatus = props?.columnData[props?.columnName]
            let typeofcopycolumnVerificationStatus = typeof copycolumnVerificationStatus
            if (typeofcopycolumnVerificationStatus) {
                copycolumnVerificationStatus = copycolumnVerificationStatus == false ? "No" : "Yes"
            }
            setcolumnVerificationStatus(copycolumnVerificationStatus)
            ListId = props?.columnData?.listId;
            siteUrl = props?.columnData?.siteUrl;
        }
        if (props?.usedFor == "GroupByComponents") {
            JsonColumn = "HelpInformationVerifiedJson"
            JsonColumnCopy.current = JsonColumn
            let columnLevelJson = JSON.parse(props?.columnData[JsonColumn])
            if (columnLevelJson?.length > 0) {
                setColumnLevelVerificationJson(columnLevelJson)
                columnLevelJson?.map((jsonvalue: any) => {
                    if (jsonvalue?.Title === props?.columnName) {
                        // setColumnLevelVerificationJson(jsonvalue)
                        SetCommentData(jsonvalue?.Comment)
                        setTrafficValue(jsonvalue?.Value)
                    }
                })
            }

        }
    }, [])


    const changeTrafficLight = (trafficValue: any) => {
        copyTrafficLight = trafficValue
        let UpdateData = {
            trafficValue: trafficValue,
            CommentData: CommentData,
            columnVerificationStatus: columnVerificationStatus === "Yes" ? true : false
        }
        console.log(trafficValue)
        setTrafficValue(trafficValue)
        updateJson(UpdateData)
    }

    const updateJson = async (UpdateData: any) => {
        try {
            let UpdateJsonColumn: any = []
            if (columnLevelVerificationJson == undefined) {
                let particularColumnJsonObj = {
                    Id: props?.columnData?.Id,
                    Title: props?.columnName,
                    Value: UpdateData?.trafficValue,
                    Comment: UpdateData?.CommentData
                }
                UpdateJsonColumn.push(particularColumnJsonObj)
            } else {
                columnLevelVerificationJson?.map((jsonvalue: any) => {
                    if (jsonvalue?.Title === props?.columnName) {
                        jsonvalue.Title = props?.columnName,
                            jsonvalue.Value = UpdateData?.trafficValue,
                            jsonvalue.Comment = UpdateData?.CommentData
                    }
                })


                UpdateJsonColumn = columnLevelVerificationJson
            }
            console.log(JsonColumnCopy.current)
            let postData: any = {
                [JsonColumnCopy.current]: JSON.stringify(UpdateJsonColumn)
            };

            if (props?.columnName !== undefined) {
                postData[props.columnName] = UpdateData?.columnVerificationStatus === "Yes" ? true : false
            }
            const web = new Web(siteUrl);
            await web.lists.getById(ListId)
                .items.getById(props?.columnData?.Id).update(postData).then(async (data: any) => {
                    // let dataNew = await data?.item?.get()
                    try {
                        props.columnData[JsonColumnCopy.current] = JSON.stringify(UpdateJsonColumn);
                        props.columnData[props.columnName] = UpdateData?.columnVerificationStatus === "Yes" ? true : false
                        console.log(props.columnData)
                        props?.callBack(props.columnData)
                    } catch (e) {

                    }

                    // console.log(dataNew)
                    setOpenCommentpopup(false)
                }).catch((error: any) => {
                    console.log(error)
                });
        } catch (e) {
            console.log(e)
        }
    }



    return (
        <>  {props?.columnData != undefined &&
            <myContextValue.Provider value={{ ...myContextValue.default, updateJson, trafficValue: trafficValue, CommentData: CommentData, SetCommentData, setTrafficValue, columnVerificationStatus: columnVerificationStatus, setcolumnVerificationStatus }}>
                <div className="alignCenter">
                    <span title="Incorrect" className={trafficValue == "Incorrect" ? "circlelight br_red pull-left ml5 red" : "circlelight br_red pull-left ml5"} onClick={() => changeTrafficLight("Incorrect")}></span>
                    <span title="Maybe" className={trafficValue == "Maybe" ? "circlelight br_yellow pull-left yellow mx-1" : "circlelight br_yellow pull-left mx-1"} onClick={() => changeTrafficLight("Maybe")}></span>
                    <span title="Correct" className={trafficValue == "Correct" ? "circlelight br_green pull-left green" : "circlelight br_green pull-left"} onClick={() => changeTrafficLight("Correct")} > </span>
                    <span title="NA" className={trafficValue == "NA" ? "circlelight br_green pull-left notable mx-1" : "circlelight br_black pull-left mx-1"} onClick={() => changeTrafficLight("NA")}></span>
                    <div className="alignCenter">
                        <span className="">{columnVerificationStatus != undefined && columnVerificationStatus}</span>
                        <span className="hover-text m-0 ">
                            <BiCommentDetail className="ms-1 f-18" style={CommentData == "" && { color: "floralwhite" }} />

                            {CommentData !== '' && <span className="tooltip-text pop-right" style={{ width: "200px" }}>
                                {
                                    CommentData
                                }
                            </span>}
                        </span>


                        <a className="pancil-icons hreflink" onClick={() => setOpenCommentpopup(true)}><span className="alignIcon  svg__iconbox svg__icon--editBox "></span></a>



                    </div>
                </div>
                {openCommentpopup && <EditTrafficLightComment setOpenCommentpopup={setOpenCommentpopup} columnData={props?.columnData} />}
            </myContextValue.Provider >}
        </>
    )
}
export default TrafficLightComponent
export { myContextValue }