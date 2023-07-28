import * as React from "react";
import { usePopperTooltip } from "react-popper-tooltip";
import "react-popper-tooltip/dist/styles.css";


export default function InfoIconsToolTip({ Discription, row }: any) {
    const [controlledVisible, setControlledVisible] = React.useState(false);
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
            <span
                ref={setTriggerRef}
                onClick={() => handlAction("click")}
                onMouseEnter={() => handlAction("hover")}
                onMouseLeave={() => handleMouseLeave()}
            >
                <span title="Edit" className="svg__iconbox svg__icon--info"></span>
            </span>

            {action === "click" && visible && (
                <div ref={setTooltipRef} {...getTooltipProps({ className: "tooltip-container p-0 m-0" })}>

                    <div>
                        <div className="tootltip-title">{row?.Shareweb_x0020_ID  !=undefined ? row?.Shareweb_x0020_ID : ""} :- {row?.Title}</div>
                        <button className="toolTipCross" onClick={handleCloseClick}><div className="popHoverCross">×</div></button>
                    </div>
                    <div className="toolsbox"><span dangerouslySetInnerHTML={{ __html: tooltiphierarchy, }}></span></div>
                    <div {...getArrowProps({ className: "tooltip-arrow" })} />

                </div>
            )}
            {action === "hover" && visible && (
                <div ref={setTooltipRef} {...getTooltipProps({ className: "tooltip-container" })}>
                    <span dangerouslySetInnerHTML={{ __html: Discription, }}></span>
                    <div {...getArrowProps({ className: "tooltip-arrow" })} />
                </div>
            )}
        </>
    );
}
