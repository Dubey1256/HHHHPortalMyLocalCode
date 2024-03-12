import React from 'react';
import { Handle, NodeProps, Position } from 'reactflow';
import EditInstitution from "../../EditPopupFiles/EditComponent";
import EditProjectPopup from "../../../globalComponents/EditProjectPopup";
import { useState } from 'react';
import InfoIconsToolTip from '../../../globalComponents/InfoIconsToolTip/InfoIconsToolTip';

export default function CustomNode(props: NodeProps<any>) {
    const [IsComponent, setIsComponent] = React.useState(false);
    const [IsProjectPopup, setIsProjectPopup] = React.useState(false);
    const [SharewebComponent, setSharewebComponent]: any = React.useState({});
    const Callbackfrompopup = () => {
        setSharewebComponent({})
        setIsComponent(false)
        setIsProjectPopup(false)
    }
    const EditComponentPopup = (event: any, item: any) => {
        event.stopPropagation();
        setSharewebComponent(item)
        if (item?.ItemCat == "Portfolio") {
            setIsComponent(true)
        }
        if (item?.ItemCat == "Project") {
            setIsProjectPopup(true)
        }
    }
    return (
        <>

            <div className='react-flow__node-output' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="nodrag" style={{margin:'4px'}}>
                    <a className='hreflink ' href={props?.data?.item?.targetUrl} data-interception="off" target="_blank">
                        {`${props?.data?.item?.PortfolioStructureID} - ${props?.data?.item?.Title}`}
                    </a>
                    {props?.data?.item?.descriptionsSearch?.length > 0 && <span className='alignIcon  mt--5 '><InfoIconsToolTip Discription={props?.data?.item?.bodys} row={props?.data?.item} /></span>}
                    <a
                        className="alignCenter"
                        data-bs-toggle="tooltip"
                        data-bs-placement="auto"
                        title={"Edit " + `${props?.data?.item?.Title}`}
                    >
                        {" "}
                        <span
                            className="svg__iconbox svg__icon--edit"
                            onClick={(e) => EditComponentPopup(e, props?.data?.item)}
                        ></span>
                    </a>

                </div>

                {props?.data?.handles?.bottom == true && <Handle type="source" position={Position.Bottom} />}
                {props?.data?.handles?.top == true && <Handle type="target" position={Position.Top} />}
                <div className='nodrag'>
                    {IsComponent && (
                        <EditInstitution
                            item={SharewebComponent}
                            Calls={Callbackfrompopup}
                            SelectD={props?.data?.AllListId}
                        >
                            {" "}
                        </EditInstitution>
                    )}
                    {IsProjectPopup && <EditProjectPopup props={SharewebComponent} AllListId={props?.data?.AllListId} Call={Callbackfrompopup} > </EditProjectPopup>}
                </div>

            </div>

        </>

    );
}