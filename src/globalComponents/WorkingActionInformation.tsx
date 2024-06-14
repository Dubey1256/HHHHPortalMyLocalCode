import * as React from 'react';
import { usePopperTooltip } from "react-popper-tooltip";
import "react-popper-tooltip/dist/styles.css";
import CoustomInfoIcon from './GroupByReactTableComponents/CoustomInfoIcon';
const WorkingActionInformation = (props: any) => {
    const [controlledVisible, setControlledVisible] = React.useState(false);
    const [action, setAction] = React.useState("");
    const { getArrowProps, getTooltipProps, setTooltipRef, setTriggerRef, visible, } = usePopperTooltip({ trigger: null, interactive: true, closeOnOutsideClick: false, placement: "auto", visible: controlledVisible, onVisibleChange: setControlledVisible, });
    const handlAction = (newAction: any) => {
        if (action === "click" && newAction === "hover") return;
        setAction(newAction); setControlledVisible(true);
    };
    const handleMouseLeave = () => { if (action === "click") return; setAction(""); setControlledVisible(!controlledVisible); };
    const handleCloseClick = () => {
        setAction("");
        setControlledVisible(!controlledVisible);
    };
    return (
        <>
            <span ref={setTriggerRef} onClick={() => handlAction("click")} onMouseEnter={() => handlAction("hover")} onMouseLeave={() => handleMouseLeave()} title={props?.actionType} className={`${props?.actionType === "Bottleneck" ? "svg__iconbox svg__icon--bottleneck" : props?.actionType === "Attention" ? "mx-2 svg__iconbox svg__icon--alert" : props?.actionType === "Phone" ? "svg__iconbox svg__icon--phone" : props?.actionType === "Approval" ? "svg__iconbox svg__icon--forApproval" : ""}`} style={props?.actionType === "Phone" ? { height: "14px", width: "14px" } : {}}></span>

            {action === "click" && visible && props?.SingleColumnData == undefined && (
                <div ref={setTooltipRef} {...getTooltipProps({ className: "tooltip-container p-0 m-0" })}>

                    <div><button className="toolTipCross" onClick={handleCloseClick}><div className="popHoverCross">×</div></button></div>
                    <div className="toolsbox">
                        {
                            props?.workingAction?.InformationData?.map((element: any, elementIndex: number) => (
                                props?.actionType === props?.workingAction?.Title && (
                                    <div className='alignCenter justify-content-between p-2' key={elementIndex}>
                                        {element?.TaggedUsers?.userImage ? (
                                            <img
                                                title={element?.TaggedUsers?.Title}
                                                className="workmember ms-1"
                                                src={element?.TaggedUsers?.userImage}
                                            />
                                        ) : (
                                            <span
                                                title={element?.TaggedUsers?.Title}
                                                className='svg__iconbox svg__icon--defaultUser'
                                            ></span>
                                        )}
                                        <span className='mx-2'>{element?.TaggedUsers?.Title}</span>
                                        {element?.Comment && (
                                            <CoustomInfoIcon
                                                Discription={element?.Comment}
                                                iconType="CommentsIcon"
                                            />
                                        )}
                                    </div>
                                )
                            ))
                        }

                    </div>
                    <div {...getArrowProps({ className: "tooltip-arrow" })} />
                </div>
            )}
            {action === "hover" && visible && (
                <div ref={setTooltipRef} {...getTooltipProps({ className: "tooltip-container" })}>

                    {
                        props?.workingAction?.InformationData?.map((element: any, elementIndex: number) => (
                            props?.actionType === props?.workingAction?.Title && (
                                <div className='alignCenter justify-content-between p-2' key={elementIndex}>
                                    {element?.TaggedUsers?.userImage ? (
                                        <img
                                            title={element?.TaggedUsers?.Title}
                                            className="workmember ms-1"
                                            src={element?.TaggedUsers?.userImage}
                                        />
                                    ) : (
                                        <span
                                            title={element?.TaggedUsers?.Title}
                                            className='svg__iconbox svg__icon--defaultUser'
                                        ></span>
                                    )}
                                    <span className='mx-2'>{element?.TaggedUsers?.Title}</span>
                                    {element?.Comment && (
                                        <CoustomInfoIcon
                                            Discription={element?.Comment}
                                            iconType="CommentsIcon"
                                        />
                                    )}
                                </div>
                            )
                        ))
                    }
                    <div {...getArrowProps({ className: "tooltip-arrow" })} />
                </div>
            )}
        </>
    )
}
export default WorkingActionInformation;