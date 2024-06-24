import * as React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
const { useState, useEffect, useCallback } = React;
import { Panel, PanelType } from "office-ui-fabric-react";
import Tooltip from "../Tooltip";
const MoveSetComponent = (props: any) => {
    const [selectedItems, setSelectedItems] = useState([]);
    const handleCheckboxChange = (data:any, isChecked:any) => {
         setSelectedItems( data);
     
    };
    const onRenderCustomMoveSetHeader = () => {
        return (
            <div className="d-flex full-width pb-1" >
                <div className="subheading siteColor">Move Set Data</div>
                <Tooltip ComponentId="1666" />
            </div>
        )
    }
const Update=()=>{
    if(selectedItems?.length>0){
        props?.AllSetData?.map((alldata:any)=>{
            alldata.setImagesInfo= alldata.setImagesInfo.filter((data:any)=>props?.sectedMoveImageData?.find((secteddata:any)=>data?.ImageName!==secteddata?.ImageName))
            alldata.TemplatesArray=alldata.TemplatesArray.filter((data:any)=>props?.selectedMoveData?.find((secteddata:any)=>data?.Title!==secteddata?.Title))
            selectedItems?.map((selectedset:any)=>{
                if(selectedset?.setTitle==alldata?.setTitle){
                   let setImagesInfo= alldata.setImagesInfo;
                   let TemplatesArray= alldata.TemplatesArray;
                   if(props?.sectedMoveImageData?.length>0){
                    setImagesInfo= setImagesInfo.concat(props?.sectedMoveImageData)
                   }
                   if(props?.selectedMoveData?.length>0){
                    TemplatesArray=TemplatesArray.concat(props?.selectedMoveData)
                   }
                   alldata.setImagesInfo=setImagesInfo;
                   alldata.TemplatesArray=TemplatesArray;

                }
            })  
        })
       
        props?.moveToCallbackFunction(props?.AllSetData)   
    }
    
}
    return (
        <>
            <Panel
                onRenderHeader={onRenderCustomMoveSetHeader}
                isOpen={true}
                onDismiss={() =>   props?.moveToCallbackFunction()}
                isBlocking={true}
                type={PanelType.custom}
                customWidth="500px"
            >
                <div>
                <div className="modal-body mt-3">
            {props?.AllSetData?.length > 0 && props?.AllSetData.map((allsetdata:any, index:any) => {
                const isChecked = selectedItems.some(item => item.setTitle === allsetdata.setTitle);
                return (
                    <div key={index} className="SpfxCheckRadio">
                        <input className="radio"
                            type="radio"
                            id={`checkbox-${index}`}
                            name={`checkbox-${index}`}
                            value={allsetdata.setTitle}
                            checked={isChecked}
                            onChange={(e) => handleCheckboxChange(allsetdata, e.target.checked)}
                        />
                        <label className="ms-2"htmlFor={`checkbox-${index}`}> {allsetdata?.setTitle}</label><br />
                    </div>
                )
            })}
        </div>
                    <footer className="float-end mt-1">
                        <button
                            type="button"
                            className="btn btn-primary px-3 mx-1"
                            onClick={() => Update()}
                        >
                            update
                        </button>
                        <button
                            type="button"
                            className="btn btn-default px-3"
                            onClick={() =>props?.moveToCallbackFunction()}
                        >
                            Cancel
                        </button>
                    </footer>
                </div>
            </Panel>
        </>
    )
}
export default MoveSetComponent;