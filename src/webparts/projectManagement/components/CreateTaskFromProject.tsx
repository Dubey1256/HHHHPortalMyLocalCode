import axios, { AxiosResponse } from 'axios';
import * as React from 'react';
//import '../components/TagTaskToProjectPopup.css';
import Button from 'react-bootstrap/Button';
import { Panel, PanelType  } from "office-ui-fabric-react";
import { useEffect, useState } from 'react';
import { Web } from "sp-pnp-js";
import EditTaskPopup from '../../../globalComponents/EditTaskPopup/EditTaskPopup';
import CreateTaskComponent from '../../createTask/components/CreateTaskComponent';

var siteConfig: any = []
const CreateTaskFromProject = (props: any) => {
    const [lgShow, setLgShow] = useState(true);
    const[isOpenEditPopup,setisOpenEditPopup] = React.useState(false)
    const handleClose = () => {
         setLgShow(false);
    }
    const EditPopup=React.useCallback((item:any)=>{
        setisOpenEditPopup(true)
    },[])
   
    // const OpenCreateTaskPopup = () => {
    //     setLgShow(true)
    // }
   
    const callBack=()=>{
        props?.callBack()
        setLgShow(false)
    }
 
    return (
        <>
         
                <Panel
             headerText={`Create Task`}
               type={PanelType.large }
               isOpen={lgShow}
               onDismiss={() => callBack()}
               isBlocking={false}>
                <CreateTaskComponent SelectedProp={props?.SelectedProp} callBack={callBack}  projectItem={props?.projectItem} pageContext={props?.pageContext} projectId={props?.projectId} createComponent={props?.createComponent}/>
            </Panel>
           
        </>
    )
}

export default CreateTaskFromProject