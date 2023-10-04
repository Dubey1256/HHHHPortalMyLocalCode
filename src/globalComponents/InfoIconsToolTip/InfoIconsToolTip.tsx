import * as React from "react";
import { usePopperTooltip } from "react-popper-tooltip";
import "react-popper-tooltip/dist/styles.css";
import FeedbackGlobalInfoIcon from "./FeedbackGlobalInfoIcon";

export default function InfoIconsToolTip({ Discription, row }: any) {
    const [controlledVisible, setControlledVisible] = React.useState(false);
    const [feedbackArray, setfeedbackArray] = React.useState([]);
    const [showHoverTitle, setshowHoverTitle] = React.useState<any>();
    const [action, setAction] = React.useState("");
    const [taskInfo, settaskInfo] = React.useState(false);

    const {
        getArrowProps,
        getTooltipProps,
        setTooltipRef,
        setTriggerRef,
        visible,
    } = usePopperTooltip({
        trigger: null,
        interactive: true,
        closeOnOutsideClick: false,
        placement: "auto",
        visible: controlledVisible,
        onVisibleChange: setControlledVisible,
    });

   
    const handlAction = (newAction: any) => {
        if (action === "click" && newAction === "hover") return;
        let feedback:any=[];
         var hoverTitleShow:any
         let hoverdata:any
        if(row!=undefined && newAction=='click'||newAction=='hover'){
            
           try {
                let addToFeedbackArray=( value:any, heading:any)=> {
                    if (value !== undefined) {
                      const obj = {
                        Title: value,
                        heading,
                      };
                      feedback.push(obj);
                      hoverTitleShow = obj;
                      setfeedbackArray(feedback);
                      if(newAction=="hover"&&heading==="Short Description"){
                        if(hoverTitleShow?.Title!=undefined ){
                        hoverdata=hoverTitleShow?.Title.replace(/\n/g, "")
                         }
                        setshowHoverTitle(hoverdata)
                        }
                    }
                  }
                  
                  addToFeedbackArray(row?.Short_x0020_Description_x0020_On, "Short Description");
                  addToFeedbackArray(row?.Background, "Background");
                  addToFeedbackArray(row?.Body, "Description");
                   addToFeedbackArray(row?.AdminNotes, "AdminNotes");
                  addToFeedbackArray(row?.TechnicalExplanations, "Technical Explanations");
                  addToFeedbackArray(row?.Deliverables, "Deliverables");
                  if (row?.FeedBack !== undefined) {
                    feedback = JSON.parse(row.FeedBack);
                    hoverTitleShow = feedback[0].FeedBackDescriptions[0];
                    setfeedbackArray(feedback[0].FeedBackDescriptions);
                    settaskInfo(true);
                    if(newAction=="hover"){
                        if(hoverTitleShow?.Title!=undefined ){
                        hoverdata=hoverTitleShow?.Title.replace(/\n/g, "")
                         }
                        setshowHoverTitle(hoverdata)
                        }
                  }
             
           } catch (error) {
            
           }
        }
        // if(newAction=="hover"&&(hoverTitleShow?.heading==="Short Description"||taskInfo)){
        // if(hoverTitleShow?.Title!=undefined ){
        // hoverdata=hoverTitleShow?.Title.replace(/\n/g, "")
        //  }
        // setshowHoverTitle(hoverdata)
        // }
        setAction(newAction);
        setControlledVisible(true);
    };
    


    const handleMouseLeave = () => {
        if (action === "click") return;
        setAction("");
        setControlledVisible(!controlledVisible);
    };

    const handleCloseClick = () => {
        setAction("");
        setControlledVisible(!controlledVisible);
    };

    const tooltiphierarchy = React.useMemo(() => {
        if (action === "click") {
            return Discription;
        }
        return '';
    }, [action]);
return (
        <>
            <span ref={setTriggerRef} onClick={() => handlAction("click")} onMouseEnter={() => handlAction("hover")} onMouseLeave={() => handleMouseLeave()} title="Description" className=" svg__iconbox svg__icon--info dark"></span>
            
            {action === "click" && visible && (
                <div ref={setTooltipRef} {...getTooltipProps({ className: "tooltip-container p-0 m-0" })}>

                    <div>
                        <div className="tootltip-title">{row?.TaskID != undefined ? row?.TaskID : ""} :- {row?.Title}</div>
                        <button className="toolTipCross" onClick={handleCloseClick}><div className="popHoverCross">×</div></button>
                    </div>
                    <div className="toolsbox">
                    <FeedbackGlobalInfoIcon FeedBack={feedbackArray}taskInfo={taskInfo}/>
                            </div>
                    <div {...getArrowProps({ className: "tooltip-arrow" })} />

                </div>
            )}
            {action === "hover" && visible && (
                <div ref={setTooltipRef} {...getTooltipProps({ className: "tooltip-container" })}>
                    <span dangerouslySetInnerHTML={{ __html: showHoverTitle }}></span>
                    <div {...getArrowProps({ className: "tooltip-arrow" })} />
                </div>
            )}
        </>
    );
}
