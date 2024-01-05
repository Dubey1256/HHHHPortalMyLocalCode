import * as React from "react";
import { usePopperTooltip } from "react-popper-tooltip";
import "react-popper-tooltip/dist/styles.css";
import FeedbackGlobalInfoIcon from "./FeedbackGlobalInfoIcon";

export default function InfoIconsToolTip(props:any) {
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
    function cleanHTML(html: any) {
        const div = document.createElement('div');
        div.innerHTML = html;
        const paragraphs = div.querySelectorAll('p');

        // Filter out empty <p> tags
        paragraphs.forEach((p) => {
            if (p.innerText.trim() === '') {
                p.parentNode.removeChild(p); // Remove empty <p> tags
            }
        });
        const brTags = div.querySelectorAll('br');
    if (brTags.length > 1) {
      for (let i = brTags.length - 1; i > 0; i--) {
        brTags[i].parentNode.removeChild(brTags[i]);
      }
    }

        return div.innerHTML;
    }
    function removeHtmlAndNewline(text:any) {
        if (text) {
            return text.replace(/(<([^>]+)>)/gi, "").replace(/\n/g, '');
        } else {
            return ''; // or any other default value you prefer
        }
    }
    const handlAction = (newAction: any) => {
        if (action === "click" && newAction === "hover") return;
        let feedback: any = [];
        var hoverTitleShow: any
        let hoverdata: any
        if (props?.row != undefined && newAction == 'click' || newAction == 'hover') {

            try {
                let addToFeedbackArray = (value: any, heading: any) => {
                   value=  removeHtmlAndNewline(value)
                    if (value !== undefined && value != null) {
                        const obj = {
                            Title: value,
                            heading,
                        };
                        feedback.push(obj);
                        hoverTitleShow = obj;
                        setfeedbackArray(feedback);
                        if (newAction == "hover" && heading === "Short Description") {
                            if(hoverTitleShow?.Title==""){
                                hoverTitleShow.Title="Short Description is not available in this. Please click to see other details" 
                            }
                            setshowHoverTitle(hoverTitleShow?.Title)
                        }
                    }
                   
                }
                if(props?.row?.Short_x0020_Description_x0020_On==undefined){
                    let   hovertitle:any;
                if (newAction == "hover" ) {
                    if(hoverTitleShow==undefined){
                       hovertitle="Short Description is not available in this. Please click to see other details" 
                    }
                    setshowHoverTitle(hovertitle)
                }
            }
                if(props?.row?.Short_x0020_Description_x0020_On!=undefined){
                    addToFeedbackArray(props?.row?.Short_x0020_Description_x0020_On, "Short Description");
                }
                if(props?.row?.Background!=undefined){
                    addToFeedbackArray(props?.row?.Background, "Background");
                } if(props?.row?.Body!=undefined){
                    addToFeedbackArray(props?.row?.Body, "Description");
                } if(props?.row?.AdminNotes!=undefined){
                    addToFeedbackArray(props?.row?.AdminNotes, "AdminNotes");
                } if(props?.row?.TechnicalExplanations!=undefined){
                    addToFeedbackArray(props?.row?.TechnicalExplanations, "Technical Explanations");
                }
                if(props?.row?.Deliverables!=undefined){
                    addToFeedbackArray(props?.row?.Deliverables, "Deliverables");
                }
                if(props?.row?.Deliverables!=undefined){
                    addToFeedbackArray(props?.row?.Idea, "Idea");
                }
                if(props?.row?.ValueAdded!=undefined){
                    addToFeedbackArray(props?.row?.ValueAdded, "ValueAdded");
                }
               if (props?.row?.FeedBack !== undefined) {
                    feedback = JSON.parse(props?.row.FeedBack);
                    hoverTitleShow = feedback[0].FeedBackDescriptions[0];
                    hoverTitleShow = {
                        ...hoverTitleShow,
                        Title: cleanHTML(hoverTitleShow.Title),
                    }
                    setfeedbackArray(feedback[0].FeedBackDescriptions);
                    settaskInfo(true);
                    if (newAction == "hover") {
                        setshowHoverTitle(hoverTitleShow?.Title)
                    }
                }

            } catch (error) {
            console.log(error)
            }
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
            return props?.Discription;
        }
        return '';
    }, [action]);
    return (
        <>
             {props?.versionHistory != true ? <span ref={setTriggerRef} onClick={() => handlAction("click")} onMouseEnter={() => handlAction("hover")} onMouseLeave={() => handleMouseLeave()} title="Description" className="alignIcon svg__iconbox svg__icon--info dark"></span>:
            <span className="text-end w-25" ref={setTriggerRef} onClick={() => handlAction("click")} title="Description"><a href="#" className="ps-1">Show More</a></span>}

            {action === "click" && visible && (
                <div ref={setTooltipRef} {...getTooltipProps({ className: "tooltip-container p-0 m-0" })}>

                    <div>
                    {props?.versionHistory != true ?<div className="tootltip-title">{props?.row?.TaskID != undefined ? props?.row?.TaskID : ""} :- {props?.row?.Title}</div>:<div className="tootltip-title">{props?.row?.TaskID != undefined ? props?.row?.TaskID : ""} :- {props?.row?.TaskTitle}</div>}
                        <button className="toolTipCross" onClick={handleCloseClick}><div className="popHoverCross">×</div></button>
                    </div>
                    <div className="toolsbox">
                        <FeedbackGlobalInfoIcon FeedBack={feedbackArray} taskInfo={taskInfo} />
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