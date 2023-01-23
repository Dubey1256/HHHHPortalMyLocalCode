import axios, { AxiosResponse } from 'axios';
import * as React from 'react';
//import '../components/TagTaskToProjectPopup.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useEffect, useState } from 'react';
import { Web } from "sp-pnp-js";
import EditTaskPopup from '../../../globalComponents/EditTaskPopup/EditTaskPopup';

var siteConfig: any = []
const CreateTaskFromProject = (props: any) => {
    const [selectedSite, setSelectedSite] = React.useState({Title:undefined,listId:undefined,siteUrl:undefined})
    const [taskTitle, setTaskTitle] = React.useState('')
    const [allMetadataSites, setAllMetadataSites] = React.useState([])
    const [lgShow, setLgShow] = useState(false);
    const[isOpenEditPopup,setisOpenEditPopup] = React.useState(false)
    const [passdata, setpassdata] = React.useState('');
    const CallBack =React.useCallback(()=>{
        setisOpenEditPopup(false)
    },[])
    const handleClose = () => {
       
        setSelectedSite({Title:undefined,listId:undefined,siteUrl:undefined});
        setTaskTitle('')
        setLgShow(false);
        
    }
    const EditPopup=React.useCallback((item:any)=>{
        
        setpassdata(item)
        setisOpenEditPopup(true)
  
    },[])
   
    const OpenCreateTaskPopup = () => {
        GetMetaData();
        setLgShow(true)
    }
    const GetMetaData = async () => {
        let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
        let smartmeta = [];

        let TaxonomyItems = [];
        smartmeta = await web.lists
            .getById('01a34938-8c7e-4ea6-a003-cee649e8c67a')
            .items
            .select('Id', 'IsVisible', 'ParentID', 'Title', 'SmartSuggestions', 'TaxType', 'Description1', 'Item_x005F_x0020_Cover', 'listId', 'siteName', 'siteUrl', 'SortOrder', 'SmartFilters', 'Selectable', 'Parent/Id', 'Parent/Title')
            .top(5000)
            .filter("TaxType eq 'Sites'")
            .orderBy("SortOrder")
            .expand('Parent')
            .get();
        siteConfig = smartmeta.filter((item: any) => {
            if (item?.Title != undefined) {
                if (item.Title != undefined && item.Title != 'Foundation' && item.Title != 'Master Tasks' && item.Title != 'DRR' && item.Title != 'Health' && item.Title != 'Gender' && item.Title != 'Offshore Tasks' && item.Title != 'SDC Sites' && item.Title != 'QA') {
                    return true;
                }
            }
            return false;
        });
        setAllMetadataSites(siteConfig)
        console.log(siteConfig);
    }

    const createTask = async () => {
        try {
            if(selectedSite?.listId!=undefined&&selectedSite?.siteUrl?.Url!=undefined&&taskTitle.length>0){
                let web = new Web(selectedSite?.siteUrl?.Url);
                await web.lists.getById(selectedSite?.listId).items.add({
                    Title: taskTitle,
                    ProjectId:props?.projectId!=undefined?props?.projectId:''
                }).then((data) => {
                    data.data.listId=selectedSite?.listId;
                    data.data.siteType=selectedSite?.Title;
                    data.data.siteUrl=selectedSite?.siteUrl?.Url;
                    EditPopup(data.data)
                    console.log(data,"Task Created")
                    props.callBack();
                    handleClose()
                })
            }
        } catch (error) {
            console.log("Error:", error.message);
        } 
    }
    return (
        <>
         
                <Button type="button" variant="primary" className='pull-right' onClick={() => OpenCreateTaskPopup()}>Create Task</Button>
       
            <Modal size='lg' show={lgShow} onHide={() => setLgShow(false)} aria-labelledby="example-modal-sizes-title-lg">
                <Modal.Header>
                    <span className='modal-title' id="example-modal-sizes-title-lg">
                        <span><strong>Create Task</strong></span>
                    </span>
                    <button type="button" className='Close-button' onClick={handleClose} >×</button>
                </Modal.Header>
                <Modal.Body>
                    <div className="">
                        <div className="row">
                            <div className="col-sm-6">
                                <input id="searchinput "  type="text" value={taskTitle} onChange={(e)=>{setTaskTitle(e.target.value)}} placeholder="Enter Task Name.. " className="searchhbox_height form-control searchbox_height searchTaskTag " />
                            </div>
                        </div>
                        <div className="row">

                            <div id="ShareWeb">
                                <div className="col-md-12 form-group">
                                    <fieldset className="fieldsett"     ng-hide="SitesTypes.length == 1">
                                        <legend className="activity">Sites</legend>
                                        <span className="pull-right clear">
                                            <a onClick={()=>{setSelectedSite({Title:undefined,listId:undefined,siteUrl:undefined})}} className=" hreflink">
                                                Clear Selection<img src="/_layouts/images/delete.gif" />
                                            </a>
                                        </span>
                                        <ul className="quick-actions">
                                            {
                                                allMetadataSites.map((item: any, index: any) => {
                                                    return (
                                                        <li onClick={()=>{setSelectedSite(item)}} className="bg_lb" id='{{TaskListId(item)}}' >
                                                            <a ng-click="SiteDetail(item);">
                                                                <span className="icon-sites">
                                                                    <img className="icon-sites"
                                                                        src={item?.Item_x005F_x0020_Cover?.Url} />
                                                                </span>{item?.Title}
                                                            </a>
                                                        </li>
                                                    )
                                                })}


                                        </ul>
                                        {/* <div className="col-sm-12 text-right">
                                <a ng-click="OpenOtherSitesPopup()" className=" hreflink">
                                    Select Other Sites
                                </a>
                            </div> */}
                                    </fieldset>
                                </div>

                            </div>
                            <h5>{selectedSite.Title}</h5>
                            {console.log(selectedSite)}
                        </div>

                    </div>
                </Modal.Body>
                <div className="modal-footer">

                    <div className="row">
                        <div className="pull-right">
                            <Button type="button" className="me-2" variant="secondary" onClick={handleClose}>Cancel</Button>
                            <Button type="button" variant="primary" onClick={() => createTask()}>Create</Button>
                        </div>
                    </div>
                </div>
            </Modal>
            {isOpenEditPopup ? <EditTaskPopup Items={passdata} Call={CallBack}  />:''}
        </>
    )
}

export default CreateTaskFromProject