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
    const [lgShow, setLgShow] = useState(false);
    const[isOpenEditPopup,setisOpenEditPopup] = React.useState(false)
    const handleClose = () => {
         setLgShow(false);
    }
    const EditPopup=React.useCallback((item:any)=>{
        setisOpenEditPopup(true)
    },[])
   
    const OpenCreateTaskPopup = () => {
        setLgShow(true)
    }
   
    // const createTask = async () => {
    //     try {
    //         if(selectedSite?.listId!=undefined&&selectedSite?.siteUrl?.Url!=undefined&&taskTitle.length>0){
    //             let web = new Web(selectedSite?.siteUrl?.Url);
    //             await web.lists.getById(selectedSite?.listId).items.add({
    //                 Title: taskTitle,
    //                 ProjectId:props?.projectId!=undefined?props?.projectId:''
    //             }).then((data) => {
    //                 data.data.listId=selectedSite?.listId;
    //                 data.data.siteType=selectedSite?.Title;
    //                 data.data.siteUrl=selectedSite?.siteUrl?.Url;
    //                 EditPopup(data.data)
    //                 console.log(data,"Task Created")
    //                 props.callBack();
    //                 handleClose()
    //             })
    //         }
    //     } catch (error) {
    //         console.log("Error:", error.message);
    //     } 
    // }
    return (
        <>
         
                <Button type="button" variant="primary" className='pull-right' onClick={() => OpenCreateTaskPopup()}>Create Task</Button>
       
            <Panel
             headerText={`Create Task`}
               type={PanelType.large }
               isOpen={lgShow}
               onDismiss={() => setLgShow(false)}
               isBlocking={false}>
                <CreateTaskComponent projectItem={props?.projectItem} pageContext={props?.pageContext} projectId={props?.projectId}/>
            </Panel>
           
        </>
    )
}

export default CreateTaskFromProject