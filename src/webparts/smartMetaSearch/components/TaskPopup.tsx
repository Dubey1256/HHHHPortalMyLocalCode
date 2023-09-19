import * as React from 'react';
import { Web } from "sp-pnp-js";
import * as moment from 'moment';
import { Panel, PanelType, PrimaryButton } from 'office-ui-fabric-react';


const TaskpopUp = (props:any)=>{
    const PageContext = props.PageContext;
    const Taskitem = props.Item
    let web = new Web(PageContext.ContextValue._pageContext._web.absoluteUrl + '/')
    const [UpdatedItem, setUpdatedItem] = React.useState<any>([]);
    
    //getsharewebId
    const  getSharewebId = function (item:any) {
        let TaskID:any = '';
        if (item?.TaskType?.Title) {
            TaskID = 'T' + item.Id;
        }
        else if (item?.TaskType && (item.TaskType.Title === 'Task' || item.TaskType.Title === 'MileStone') && item.TaskLevel == undefined && item.TaskLevel == undefined) {
            TaskID = 'T' + item.Id;
            if (item?.TaskType?.Title === 'MileStone')
                TaskID = 'M' + item.Id;
        }
        else if (item?.TaskType !== undefined && (item.TaskType.Title === 'Activities' || item.TaskType.Title === 'Project') && item.TaskLevel != undefined) {
            if (item?.Component?.results?.length > 0) {
                TaskID = 'CA' + item.TaskLevel;
            }
            if (item?.Services?.results?.length > 0) {
                
                TaskID = 'SA' + item.TaskLevel;
                
            }
            if (item?.Events?.results?.length > 0) {
              
                TaskID = 'EA' + item.TaskLevel;
               
            }
            if (item?.Events?.results?.length > 0 && item?.Services?.results?.length > 0 && item?.Component?.results?.length > 0)
                
                TaskID = 'A' + item.TaskLevel;
               
            if (item.Component == undefined && item.Events == undefined && item.Services == undefined) {
                TaskID = 'A' + item.TaskLevel;
            }
            if (item?.TaskType?.Title == 'Project')
                TaskID = 'P' + item.TaskLevel;

        }
        else if (item?.TaskType && (item.TaskType.Title === 'Workstream' || item.TaskType.Title === 'Step') && item?.TaskLevel && item?.TaskLevel) {
            if (item?.Events?.results?.length > 0 && item?.Services?.results?.length > 0 && item?.Component?.results?.length > 0) {
               
                TaskID = 'A' + item.TaskLevel + '-W' + item.TaskLevel;
                
            }
            if (item?.Component?.results?.length > 0) {                
                TaskID = 'CA' + item.TaskLevel + '-W' + item.TaskLevel;               
            }
            if (item?.Services?.results?.length > 0) {
               
                TaskID = 'SA' + item.TaskLevel + '-W' + item.TaskLevel;
                
            }
            if (item?.Events?.results?.length > 0) {
              
                TaskID = 'EA' + item.TaskLevel + '-W' + item.TaskLevel;
              
            }
            if (item.Component == undefined && item.Services == undefined && item.Events == undefined) {
                TaskID = 'A' + item.TaskLevel + '-W' + item.TaskLevel;
            }
            if (item?.TaskType?.Title == 'Step')
                TaskID = 'P' + item.TaskLevel + '-S' + item.TaskLevel;

        }
        else if (item?.TaskType && (item.TaskType.Title === 'Task' || item.TaskType.Title === 'MileStone') && item?.TaskLevel && item?.TaskLevel) {
            if (item?.Events?.results?.length > 0 && item?.Services?.results?.length > 0 && item?.Component?.results?.length > 0) {              
                TaskID = 'A' + item.TaskLevel + '-W' + item.TaskLevel + '-T' + item.Id;               
            }
            if (item?.Component?.results?.length > 0) {                
                TaskID = 'CA' + item.TaskLevel + '-W' + item.TaskLevel + '-T' + item.Id;             
            }
            if (item?.Services?.results?.length > 0) {
               
                TaskID = 'SA' + item.TaskLevel + '-W' + item.TaskLevel + '-T' + item.Id;
                
            }
            if (item?.Events?.results?.length > 0 ) {
                
                TaskID = 'EA' + item.TaskLevel + '-W' + item.TaskLevel + '-T' + item.Id;
                
            }
            if (item.Component == undefined && item.Services == undefined && item.Events == undefined) {
                TaskID = 'A' + item.TaskLevel + '-W' + item.TaskLevel + '-T' + item.Id;
            }
            if (item?.TaskType?.Title == 'MileStone') {
                TaskID = 'P' + item.TaskLevel + '-S' + item.TaskLevel + '-M' + item.Id;
            }
        }
        else if (item?.TaskType  && (item.TaskType.Title === 'Task' || item.TaskType.Title === 'MileStone') && item?.TaskLevel && item.TaskLevel == undefined) {
            if (item?.Events?.results?.length > 0 && item?.Services?.results?.length > 0 && item?.Component?.results?.length > 0) {
                TaskID = 'A' + item.TaskLevel + '-T' + item.Id;
            }
            if (item?.Component?.results?.length > 0) {
                TaskID = 'CA' + item.TaskLevel + '-T' + item.Id;
            }
            if (item?.Services?.results?.length > 0) {
                TaskID = 'SA' + item.TaskLevel + '-T' + item.Id;
            }
            if (item?.Events?.results?.length > 0) {
                TaskID = 'EA' + item.TaskLevel + '-T' + item.Id;
            }
            if (item.Component == undefined && item.Services == undefined && item.Events == undefined) {
                TaskID = 'A' + item.TaskLevel + '-T' + item.Id;
            }
        }
        return TaskID;
    }
    //end

    //loadTaskItem
    const LoadTaskItem = () =>{
        var query = "ParentTask/Title,ParentTask/Id,Services/Title,ClientTime,Services/Id,RelevantPortfolio/Id,RelevantPortfolio/Title,ItemRank,Portfolio_x0020_Type,SiteCompositionSettings,TaskLevel,TaskLevel,TimeSpent,BasicImageInfo,OffshoreComments,OffshoreImageUrl,CompletedDate,TaskID,ResponsibleTeam/Id,ResponsibleTeam/Title,TaskCategories/Id,TaskCategories/Title,ParentTask/TaskID,TaskType/Id,TaskType/Title,TaskType/Level,TaskType/Prefix,PriorityRank,Reference_x0020_Item_x0020_Json,TeamMembers/Title,TeamMembers/Name,Component/Id,Component/Title,Component/ItemType,TeamMembers/Id,Item_x002d_Image,ComponentLink,IsTodaysTask,AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,AttachmentFiles/FileName,FileLeafRef,FeedBack,Title,Id,PercentComplete,Company,StartDate,DueDate,Comments,Categories,Status,WebpartId,Body,Mileage,PercentComplete,Attachments,Priority,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title,RelevantTasks/Id,RelevantTasks/Title";
        var expandquery = "RelevantTasks,ParentTask,RelevantPortfolio,Services,TaskType,AssignedTo,Component,AttachmentFiles,Author,Editor,TeamMembers,ResponsibleTeam,TaskCategories"
        web.lists.getById(Taskitem.listId).items.select(query).expand(expandquery).filter('Id eq ' + Taskitem.Id).getAll()
         .then((response:any)=>{            
            try{
                const responseitem = response[0];
                if(responseitem?.TaskID === null)
                  responseitem.TaskID = getSharewebId(responseitem); 
                setUpdatedItem(responseitem);                
            }catch(error){
                console.log(error);
            }
        })
    }

    React.useEffect(()=>{
        LoadTaskItem();
    },[Taskitem]);
    
    const EditTaskItem = () => {
        const updateDataValue = {           
        };        
        web.lists.getByTitle("TestAppList").items.getById(UpdatedItem.Id).update(updateDataValue).then((response: any) => {
            alert("Update successful")
            props.closeEditPopup()
        }).catch((error: any) => {
            console.error(error);
        });
    }
    const closePopup=()=>{
        props.closeEditPopup();
    }

    return(
           <Panel title="popup-title" isOpen={true} onDismiss={closePopup} type={PanelType.medium} isBlocking={false} >
                <div className="ms-modalExample-header">
                   <h3 id="popup-title">{UpdatedItem?.siteurl} {UpdatedItem?.TaskID}{UpdatedItem?.Title}</h3>
                </div>
                <div className="ms-modalExample-body">
                    <label>TaskID</label>
                      <input defaultValue={UpdatedItem?.TaskID} onChange={(e) => setUpdatedItem({ ...UpdatedItem, TaskID: e.target.value })}></input>
                    <label> Title</label>
                      <input defaultValue={UpdatedItem?.Title} onChange={(e) => setUpdatedItem({ ...UpdatedItem, Title: e.target.value })}></input>                    
                </div>    
                <div className="ms-modalExample-footer">
                    <PrimaryButton onClick={closePopup} text="Close" />
                    <PrimaryButton onClick={EditTaskItem} text="Update" />
                </div>
            </Panel>
    )

}
export default TaskpopUp;