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

    const handlAction = (newAction: any) => {
        if (action === "click" && newAction === "hover") return;
        let feedback: any = [];
        var hoverTitleShow: any
        let hoverdata: any
        if (row != undefined && newAction == 'click' || newAction == 'hover') {

            try {
                let addToFeedbackArray = (value: any, heading: any) => {
                   value=  cleanHTML(value)
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
                if(row?.Short_x0020_Description_x0020_On!=undefined){
                    addToFeedbackArray(row?.Short_x0020_Description_x0020_On, "Short Description");
                }
                if(row?.Background!=undefined){
                    addToFeedbackArray(row?.Background, "Background");
                } if(row?.Body!=undefined){
                    addToFeedbackArray(row?.Body, "Description");
                } if(row?.AdminNotes!=undefined){
                    addToFeedbackArray(row?.AdminNotes, "AdminNotes");
                } if(row?.TechnicalExplanations!=undefined){
                    addToFeedbackArray(row?.TechnicalExplanations, "Technical Explanations");
                }
                if(row?.Deliverables!=undefined){
                    addToFeedbackArray(row?.Deliverables, "Deliverables");
                }
                if(row?.Deliverables!=undefined){
                    addToFeedbackArray(row?.Deliverables, "Idea");
                }
                if(row?.ValueAdded!=undefined){
                    addToFeedbackArray(row?.ValueAdded, "ValueAdded");
                }
               if (row?.FeedBack !== undefined) {
                    feedback = JSON.parse(row.FeedBack);
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
