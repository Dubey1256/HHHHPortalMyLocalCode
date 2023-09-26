import * as React from "react";
import { usePopperTooltip } from "react-popper-tooltip";
import "react-popper-tooltip/dist/styles.css";
import FeedbackGlobalInfoIcon from "../FeedbackGlobalInfoIcon";

export default function InfoIconsToolTip({ Discription, row }: any) {
    const [controlledVisible, setControlledVisible] = React.useState(false);
    const [feedbackArray, setfeedbackArray] = React.useState([]);
    const [showHoverTitle, setshowHoverTitle] = React.useState<any>();
    const [action, setAction] = React.useState("");

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
        if(row!=undefined && newAction=='click'||newAction=='hover'){
            
           try {
             feedback=JSON.parse(row?.FeedBack)
           
           } catch (error) {
            
           }
           setfeedbackArray(feedback);  
        }
        if(newAction=="hover"&& feedback?.length>0){

     let hoverdata=feedback[0]?.FeedBackDescriptions[0].Title.replace(/\n/g, "")
     if(feedback[0]?.FeedBackDescriptions?.length>1){
        hoverdata=hoverdata+"...."
     }
     setshowHoverTitle(hoverdata)
        }
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

    const callBackData = React.useCallback((elem: any, ShowingData: any) => {

    }, []);
    return (
        <>
            <span ref={setTriggerRef} onClick={() => handlAction("click")} onMouseEnter={() => handlAction("hover")} onMouseLeave={() => handleMouseLeave()} title="Edit" className=" svg__iconbox svg__icon--info dark"></span>
            
            {action === "click" && visible && (
                <div ref={setTooltipRef} {...getTooltipProps({ className: "tooltip-container p-0 m-0" })}>

                    <div>
                        <div className="tootltip-title">{row?.TaskID != undefined ? row?.TaskID : ""} :- {row?.Title}</div>
                        <button className="toolTipCross" onClick={handleCloseClick}><div className="popHoverCross">×</div></button>
                    </div>
                    <div className="toolsbox">
                    <FeedbackGlobalInfoIcon FeedBack={feedbackArray}/>
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
