
import * as React from "react";
import { useState, useEffect } from "react";
import { myContextValue } from '../globalCommon'
import { FaCommentDots } from "react-icons/fa";
import EditTrafficLightComment from './EditTrafficLightComment'
import { Web } from "sp-pnp-js";
let JsonColumn: any
let ListId: any
let siteUrl: any
let copyTrafficLight: any;
const TrafficLightComponent = (props: any) => {
    const [openCommentpopup, setOpenCommentpopup] = useState(false)
    const [columnVerificationStatus, setcolumnVerificationStatus]: any = useState()
    const [trafficValue, setTrafficValue] = useState("")
    const [CommentData, SetCommentData] = useState("")
    let JsonColumnCopy=React.useRef("")
    const [columnLevelVerificationJson, setColumnLevelVerificationJson]: any = useState()
    useEffect(() => {
        if (props?.columnName != undefined) {
            let copycolumnVerificationStatus=props?.columnData[props?.columnName]
            let typeofcopycolumnVerificationStatus=typeof copycolumnVerificationStatus
            if(typeofcopycolumnVerificationStatus){
                copycolumnVerificationStatus=copycolumnVerificationStatus==false?"No":"Yes" 
            }
         setcolumnVerificationStatus(copycolumnVerificationStatus)
            ListId = props?.columnData?.listId;
            siteUrl = props?.columnData?.siteUrl;
        }
        if (props?.usedFor == "GroupByComponents") {
            JsonColumn = "HelpInformationVerifiedJson"
            JsonColumnCopy.current=JsonColumn
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
        console.log(trafficValue)
        setTrafficValue(trafficValue)
        updateJson()
    }

    const updateJson = async () => {
        let UpdateJsonColumn = []
        if (columnLevelVerificationJson == undefined) {
            let particularColumnJsonObj = {
                Id: props?.columnData?.Id,
                Title: props?.columnName,
                Value: copyTrafficLight != undefined ? copyTrafficLight : trafficValue,
                Comment: CommentData
            }
            UpdateJsonColumn.push(particularColumnJsonObj)
        } else {
            columnLevelVerificationJson?.map((jsonvalue: any) => {
                if (jsonvalue?.Title === props?.columnName) {
                    jsonvalue.Title = props?.columnName,
                        jsonvalue.Value = copyTrafficLight != undefined ? copyTrafficLight : trafficValue,
                        jsonvalue.Comment = CommentData
                }
            })


            UpdateJsonColumn=columnLevelVerificationJson
        }
     console.log(JsonColumnCopy.current)
        let postData: any = {
            [JsonColumnCopy.current]: JSON.stringify(UpdateJsonColumn)
        };
        const web = new Web(siteUrl);
        await web.lists.getById(ListId)
            .items.getById(props?.columnData?.Id).update(postData).then((data: any) => {
                console.log(data)
            }).catch((error: any) => {
                console.log(error)
            });
    }

    return (
        <> {props?.columnData != undefined &&
            <myContextValue.Provider value={{ ...myContextValue.default,updateJson, trafficValue: trafficValue, CommentData: CommentData, SetCommentData, setTrafficValue, columnVerificationStatus: columnVerificationStatus, setcolumnVerificationStatus }}>
                <div>
                    <div className="alignCenter m-0">

                        <span className="alignCenter">
                            <span title="Incorrect" className={trafficValue == "Incorrect" ? "circlelight br_red pull-left ml5 red" : "circlelight br_red pull-left ml5"} onClick={() => changeTrafficLight("Incorrect")}>
                            </span>
                            <span title="Maybe" className={trafficValue == "Maybe" ? "circlelight br_yellow pull-left yellow" : "circlelight br_yellow pull-left"} onClick={() => changeTrafficLight("Maybe")}>
                            </span>
                            <span title="Correct" className={trafficValue == "Correct" ? "circlelight br_green pull-left green" : "circlelight br_green pull-left"} onClick={() => changeTrafficLight("Correct")} >

                            </span>
                            <span title="NA" className={trafficValue == "NA" ? "circlelight br_green pull-left notable" : "circlelight br_black pull-left"} onClick={() => changeTrafficLight("NA")}>
                            </span>

                        </span>
                    </div>

                    <span>{columnVerificationStatus!=undefined&&columnVerificationStatus}</span>
                 

                    <FaCommentDots title={CommentData} />
                    <span className="svg__iconbox svg__icon--editBox alignIcon"
                        //  onClick={() => setOpenColumnLevelVerification(true)}
                        onClick={() => setOpenCommentpopup(true)}
                    ></span>

                    {openCommentpopup && <EditTrafficLightComment setOpenCommentpopup={setOpenCommentpopup} columnData={props?.columnData} />}
                </div>

            </myContextValue.Provider >}
        </>
    )
}
export default TrafficLightComponent
export { myContextValue }