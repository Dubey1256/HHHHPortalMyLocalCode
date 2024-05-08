import React from 'react';
import { Handle, NodeProps, Position } from 'reactflow';
import EditInstitution from "../../EditPopupFiles/EditComponent";
import EditProjectPopup from "../../../globalComponents/EditProjectPopup";
import { useState } from 'react';
import InfoIconsToolTip from '../../../globalComponents/InfoIconsToolTip/InfoIconsToolTip';
import { myContextValue } from '../../../globalComponents/globalCommon';

export default function CustomNode(props:any) {
    const globalContextData: any = React.useContext<any>(myContextValue)
    return (
        <>

            <div className='react-flow__node-output' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="nodrag" style={{ margin: '4px' }}>
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
                            onClick={(e) => globalContextData?.EditComponentPopup(e, props?.data?.item)}
                        ></span>
                    </a>

                </div>

                {props?.data?.handles?.bottom == true && <Handle type="source" position={Position.Bottom} />}
                {props?.data?.handles?.top == true && <Handle type="target" position={Position.Top} />}


            </div>

        </>

    );
}