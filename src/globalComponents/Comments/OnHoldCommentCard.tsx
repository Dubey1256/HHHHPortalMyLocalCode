import * as React from 'react';
import { Panel, PanelType } from 'office-ui-fabric-react';
import { useState, useEffect, useCallback } from 'react';
import CommentCard from './CommentCard';
const OnHoldCommentCard = (Props: any) => {
    const siteUrl: string = Props?.siteUrl;
    const ItemId: any = Props?.ItemId;
    const AllListIds: any = Props?.AllListIds;
    const context: any = Props?.Context;
    const callBack: any = Props?.callback;
    const usedFor:string = Props?.usedFor;
    const [IsPanelOpen, setIsPanelOpen] = useState(true);

    const onHoldCallBack = (usedFor:any) => {
        setIsPanelOpen(false)
        callBack(usedFor);
    }

    // ************** this is custom header and custom Footers section functions for panel *************

    const onRenderCustomOnHoldPanelHeader = () => {
        return (
            <div
                className={"d-flex full-width pb-1"}
            >
                <div className="alignCenter full-width pb-1">
                    <span className="boldClable f-19 ms-4 pb-2 siteColor">
                        State the reason why Task is On-Hold
                    </span>
                </div>
            </div>
        );
    }

    return (
        <section className='on-hold-comment-card-section'>
            <Panel
                type={PanelType.custom}
                customWidth="450px"
                onRenderHeader={onRenderCustomOnHoldPanelHeader}
                isOpen={IsPanelOpen}
                onDismiss={() => onHoldCallBack("Close")}
                isBlocking={false}
            >
                <div className="full_width ">
                    <CommentCard
                        siteUrl={siteUrl}
                        itemID={ItemId}
                        AllListId={AllListIds}
                        Context={context}
                        onHoldCallBack={onHoldCallBack}
                        commentFor="On-Hold"
                    />
                </div>
            </Panel>
        </section>
    )
}
export default OnHoldCommentCard;