import { Panel, PanelType } from "office-ui-fabric-react";
import * as React from "react";
import ComponentTable from "../../componentProfile/components/Taskwebparts";

const TaggedComponentTask = (props: any) => {    
    const onRenderCustomHeaderMain = () => {
        return (
            <div className="d-flex full-width pb-1">
                <div className="subheading">
                    <span className="siteColor">
                        Portfolio Task Tagging - {`${props?.SelectedItem?.Title} (${props?.SelectedItem?.PortfolioStructureID})`}
                    </span>
                </div>
            </div>
        );
    };

    const callBack = () => {
        props?.callBack()
    }
    return (
        <>
            <Panel
                onRenderHeader={onRenderCustomHeaderMain}
                type={PanelType.large}
                isOpen={true}
                onDismiss={() => callBack()}
                isBlocking={false}>
                <div >
                    <ComponentTable props={props?.SelectedItem} UsedFrom={'ProjectManagement'} NextProp={props?.AllListId}/>
                  
                </div>
                <div className="text-end mt-3">
                    <button className="btn btn-default mt-2" onClick={() => callBack()}>Cancel</button>
                </div>
            </Panel>
        </>
    )
};
export default TaggedComponentTask; 