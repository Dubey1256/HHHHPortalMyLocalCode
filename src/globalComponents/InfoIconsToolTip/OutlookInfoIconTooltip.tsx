import * as React from "react";
import { usePopperTooltip } from "react-popper-tooltip";
import "react-popper-tooltip/dist/styles.css";
import FeedbackGlobalInfoIcon from "./FeedbackGlobalInfoIcon";

export default function OutlookInfoIconToolTip(props: any) {
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
    function removeHtmlAndNewline(text: any) {
        if (text) {
            return text.replace(/(<([^>]+)>)/gi, "").replace(/\n/g, '');
        } else {
            return ''; // or any other default value you prefer
        }
    }
    const handlAction = (newAction: any) => {
        if (action === "click" && newAction === "hover") return setAction("");
        let feedback: any = [];
        var hoverTitleShow: any
        let hoverdata: any
        if (props?.row != undefined && newAction == 'click' || newAction == 'hover') {

            try {

                if (props?.row?.Title != undefined) {
                    if (props?.row?.Title != undefined) {
                        let hovertitle: any;
                        if (newAction == "hover") {
                            hovertitle = props?.row?.Title
                            // if(hoverTitleShow==undefined){
                            //    hovertitle="Short Description is not available in this. Please click to see other details" 
                            // }
                            setshowHoverTitle(hovertitle)
                            const obj = {
                                Title: hovertitle,
                                heading: props?.row?.Body == "Body" ? "Description" : props?.row?.Body,
                            };
                            feedback.push(obj);
                            setfeedbackArray(feedback);
                        }
                    }
                }
                else {
                    let addToFeedbackArray = (value: any, heading: any) => {
                        value = removeHtmlAndNewline(value)
                        if (value !== undefined && value != null) {
                            const obj = {
                                Title: value,
                                heading,
                            };
                            feedback.push(obj);
                            hoverTitleShow = obj;
                            setfeedbackArray(feedback);
                            if (newAction == "hover" && heading === "Description") {
                                if (hoverTitleShow?.Title == "") {
                                    hoverTitleShow.Title = "Short Description is not available in this. Please click to see other details"
                                }
                                setshowHoverTitle(hoverTitleShow?.Title)
                            }
                        }

                    }
                    if (props?.row?.Title == undefined) {
                        let hovertitle: any;
                        if (newAction == "hover") {
                            if (hoverTitleShow == undefined) {
                                hovertitle = "Short Description is not available in this. Please click to see other details"
                            }
                            setshowHoverTitle(hovertitle)
                        }
                    } 
                    if (props?.row?.Title != undefined) {
                        addToFeedbackArray(props?.row?.Title, "Short Description");
                    }
                    if (props?.row?.Body != undefined) {
                        addToFeedbackArray(props?.row?.Body, "Description");
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
            {props?.versionHistory != true ? <span ref={setTriggerRef}
                onClick={() => handlAction("click")}
                onMouseEnter={() => handlAction("hover")}
                onMouseLeave={() => handleMouseLeave()} className=" svg__iconbox svg__icon--info dark"></span> :
                <span className="text-end w-25" ref={setTriggerRef} onClick={() => handlAction("click")} title="Description"><a href="#" className="ps-1">Show More</a></span>}

            {action === "click" && visible && (
                <div ref={setTooltipRef} {...getTooltipProps({ className: "tooltip-container p-0 m-0" })}>

                    <div>
                        {props?.versionHistory != true ? <div className="tootltip-title">{props?.row?.TaskID != undefined ? props?.row?.TaskID : ""} :- {props?.row?.Title}</div> : <div className="tootltip-title">{props?.row?.TaskID != undefined ? props?.row?.TaskID : ""} :- {props?.row?.TaskTitle}</div>}
                        <button className="toolTipCross" onClick={handleCloseClick}><div className="popHoverCross">×</div></button>
                    </div>
                    <div className="toolsbox">
                        <div>
                            <div className='f-15 fw-light'>
                                {feedbackArray[0]?.heading}
                            </div>
                            {/* <div className='border p-1'>
                                <span dangerouslySetInnerHTML={{ __html: props?.SingleColumnData == undefined ? cleanHTML(fbData?.Title) : fbData?.Title }}></span>
                            </div> */}

                        </div>

                        {/* <FeedbackGlobalInfoIcon FeedBack={feedbackArray} taskInfo={taskInfo} SingleColumnData={undefined} /> */}
                    </div>
                    <div {...getArrowProps({ className: "tooltip-arrow" })} />

                </div>
            )}
            {action === "hover" && visible && (
                <div ref={setTooltipRef} {...getTooltipProps({ className: "tooltip-container" })}>
                    <span className="tableTooltip" dangerouslySetInnerHTML={{ __html: showHoverTitle }}></span>
                    <div {...getArrowProps({ className: "tooltip-arrow" })} />
                </div>
            )}
        </>
    );
}