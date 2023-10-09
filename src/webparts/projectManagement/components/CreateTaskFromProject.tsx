import axios, { AxiosResponse } from 'axios';
import * as React from 'react';
//import '../components/TagTaskToProjectPopup.css';
import Button from 'react-bootstrap/Button';
import { Panel, PanelType } from "office-ui-fabric-react";
import { useEffect, useState } from 'react';
import { Web } from "sp-pnp-js";
import EditTaskPopup from '../../../globalComponents/EditTaskPopup/EditTaskPopup';
import CreateTaskComponent from '../../createTask/components/CreateTaskComponent';

var siteConfig: any = []
const CreateTaskFromProject = (props: any) => {
    const [lgShow, setLgShow] = useState(false);
    const OpenCreateTaskPopup = () => {
        setLgShow(true)
    }
    const callBack = () => {
        props?.callBack()
        setLgShow(false)
    }
    const onRenderCustomHeaderMain = () => {
        return (
            <div className="d-flex full-width pb-1">
                <div className="subheading">
                    <span className="siteColor">
                        Create Task Under - {props?.projectItem?.Title}
                    </span>
                </div>
            </div>
        );
    };

    return (
        <>
            <div className='mb-1 text-end'>
                <a className="hyperlink" onClick={() => OpenCreateTaskPopup()}> <span className="alignIcon svg__icon--Plus svg__iconbox"></span> <span style={{position:"relative", top:"-2px"}}> Create Task</span></a>

                {/* <Button type="button" className='btn btn-primary btnCol' >Create Task</Button> */}
            </div>
            <Panel
                onRenderHeader={onRenderCustomHeaderMain}
                type={PanelType.large}
                isOpen={lgShow}
                onDismiss={() => callBack()}
                isBlocking={false}>
                <CreateTaskComponent SelectedProp={props?.SelectedProp} callBack={callBack} projectItem={props?.projectItem} pageContext={props?.pageContext} projectId={props?.projectId} createComponent={props?.createComponent} />
            </Panel>

        </>
    )
}

export default CreateTaskFromProject