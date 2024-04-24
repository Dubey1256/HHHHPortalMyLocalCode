import * as React from 'react';
import { Web } from "sp-pnp-js";
import * as moment from 'moment';
import { Panel, PanelType, PrimaryButton } from 'office-ui-fabric-react';
import * as globalComman from '../../../globalComponents/globalCommon'

const TaskpopUp = (props:any)=>{
    const PageContext = props.PageContext;
    const Taskitem = props.Item
    let web = new Web(PageContext.ContextValue._pageContext._web.absoluteUrl + '/')
    const [UpdatedItem, setUpdatedItem] = React.useState<any>([]);
    
    //getCMSToolId
   
    //end

    //loadTaskItem
    const LoadTaskItem = () =>{
        var query = "ParentTask/Title,ParentTask/Id,Services/Title,ClientTime,Services/Id,RelevantPortfolio/Id,RelevantPortfolio/Title,ItemRank,Portfolio_x0020_Type,SiteCompositionSettings,TimeSpent,BasicImageInfo,OffshoreComments,OffshoreImageUrl,CompletedDate,TaskID,Responsible_x0020_Team/Id,Responsible_x0020_Team/Title,ParentTask/TaskID,Priority_x0020_Rank,Reference_x0020_Item_x0020_Json,Team_x0020_Members/Title,Team_x0020_Members/Name,Component/Id,Component/Title,Component/ItemType,Team_x0020_Members/Id,Item_x002d_Image,component_x0020_link,IsTodaysTask,AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,AttachmentFiles/FileName,FileLeafRef,FeedBack,Title,Id,PercentComplete,Company,StartDate,DueDate,Comments,Categories,Status,WebpartId,Body,Mileage,PercentComplete,Attachments,Priority,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title,RelevantTasks/Id,RelevantTasks/Title";
        var expandquery = "RelevantTasks,ParentTask,RelevantPortfolio,Services,AssignedTo,Component,AttachmentFiles,Author,Editor,Team_x0020_Members,Responsible_x0020_Team"
        web.lists.getById(Taskitem.listId).items.select(query).expand(expandquery).filter('Id eq ' + Taskitem.Id).getAll()
         .then((response:any)=>{            
            try{
                const responseitem = response[0];
                if(responseitem?.TaskID === null)
                  responseitem.TaskID = globalComman?.getTaskId(responseitem); 
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