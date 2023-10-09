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
        let Shareweb_x0020_ID:any = '';
        if (item?.SharewebTaskType?.Title) {
            Shareweb_x0020_ID = 'T' + item.Id;
        }
        else if (item?.SharewebTaskType && (item.SharewebTaskType.Title === 'Task' || item.SharewebTaskType.Title === 'MileStone') && item.SharewebTaskLevel1No === undefined && item.SharewebTaskLevel2No === undefined) {
            Shareweb_x0020_ID = 'T' + item.Id;
            if (item?.SharewebTaskType?.Title === 'MileStone')
                Shareweb_x0020_ID = 'M' + item.Id;
        }
        else if (item?.SharewebTaskType !== undefined && (item.SharewebTaskType.Title === 'Activities' || item.SharewebTaskType.Title === 'Project') && item.SharewebTaskLevel1No !== undefined) {
            if (item?.Component?.results?.length > 0) {
                Shareweb_x0020_ID = 'CA' + item.SharewebTaskLevel1No;
            }
            if (item?.Services?.results?.length > 0) {
                
                Shareweb_x0020_ID = 'SA' + item.SharewebTaskLevel1No;
                
            }
            if (item?.Events?.results?.length > 0) {
              
                Shareweb_x0020_ID = 'EA' + item.SharewebTaskLevel1No;
               
            }
            if (item?.Events?.results?.length > 0 && item?.Services?.results?.length > 0 && item?.Component?.results?.length > 0)
                
                Shareweb_x0020_ID = 'A' + item.SharewebTaskLevel1No;
               
            if (item.Component === undefined && item.Events === undefined && item.Services == undefined) {
                Shareweb_x0020_ID = 'A' + item.SharewebTaskLevel1No;
            }
            if (item?.SharewebTaskType?.Title == 'Project')
                Shareweb_x0020_ID = 'P' + item.SharewebTaskLevel1No;

        }
        else if (item?.SharewebTaskType && (item.SharewebTaskType.Title === 'Workstream' || item.SharewebTaskType.Title === 'Step') && item?.SharewebTaskLevel1No && item?.SharewebTaskLevel2No) {
            if (item?.Events?.results?.length > 0 && item?.Services?.results?.length > 0 && item?.Component?.results?.length > 0) {
               
                Shareweb_x0020_ID = 'A' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No;
                
            }
            if (item?.Component?.results?.length > 0) {                
                Shareweb_x0020_ID = 'CA' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No;               
            }
            if (item?.Services?.results?.length > 0) {
               
                Shareweb_x0020_ID = 'SA' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No;
                
            }
            if (item?.Events?.results?.length > 0) {
              
                Shareweb_x0020_ID = 'EA' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No;
              
            }
            if (item.Component == undefined && item.Services == undefined && item.Events == undefined) {
                Shareweb_x0020_ID = 'A' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No;
            }
            if (item?.SharewebTaskType?.Title == 'Step')
                Shareweb_x0020_ID = 'P' + item.SharewebTaskLevel1No + '-S' + item.SharewebTaskLevel2No;

        }
        else if (item?.SharewebTaskType && (item.SharewebTaskType.Title === 'Task' || item.SharewebTaskType.Title === 'MileStone') && item?.SharewebTaskLevel1No && item?.SharewebTaskLevel2No) {
            if (item?.Events?.results?.length > 0 && item?.Services?.results?.length > 0 && item?.Component?.results?.length > 0) {              
                Shareweb_x0020_ID = 'A' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No + '-T' + item.Id;               
            }
            if (item?.Component?.results?.length > 0) {                
                Shareweb_x0020_ID = 'CA' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No + '-T' + item.Id;             
            }
            if (item?.Services?.results?.length > 0) {
               
                Shareweb_x0020_ID = 'SA' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No + '-T' + item.Id;
                
            }
            if (item?.Events?.results?.length > 0 ) {
                
                Shareweb_x0020_ID = 'EA' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No + '-T' + item.Id;
                
            }
            if (item.Component == undefined && item.Services == undefined && item.Events == undefined) {
                Shareweb_x0020_ID = 'A' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No + '-T' + item.Id;
            }
            if (item?.SharewebTaskType?.Title == 'MileStone') {
                Shareweb_x0020_ID = 'P' + item.SharewebTaskLevel1No + '-S' + item.SharewebTaskLevel2No + '-M' + item.Id;
            }
        }
        else if (item?.SharewebTaskType  && (item.SharewebTaskType.Title === 'Task' || item.SharewebTaskType.Title === 'MileStone') && item?.SharewebTaskLevel1No && item.SharewebTaskLevel2No == undefined) {
            if (item?.Events?.results?.length > 0 && item?.Services?.results?.length > 0 && item?.Component?.results?.length > 0) {
                Shareweb_x0020_ID = 'A' + item.SharewebTaskLevel1No + '-T' + item.Id;
            }
            if (item?.Component?.results?.length > 0) {
                Shareweb_x0020_ID = 'CA' + item.SharewebTaskLevel1No + '-T' + item.Id;
            }
            if (item?.Services?.results?.length > 0) {
                Shareweb_x0020_ID = 'SA' + item.SharewebTaskLevel1No + '-T' + item.Id;
            }
            if (item?.Events?.results?.length > 0) {
                Shareweb_x0020_ID = 'EA' + item.SharewebTaskLevel1No + '-T' + item.Id;
            }
            if (item.Component == undefined && item.Services == undefined && item.Events == undefined) {
                Shareweb_x0020_ID = 'A' + item.SharewebTaskLevel1No + '-T' + item.Id;
            }
        }
        return Shareweb_x0020_ID;
    }
    //end

    //loadTaskItem
    const LoadTaskItem = () =>{
        var query = "ParentTask/Title,ParentTask/Id,Services/Title,ClientTime,Services/Id,RelevantPortfolio/Id,RelevantPortfolio/Title,ItemRank,Portfolio_x0020_Type,SiteCompositionSettings,SharewebTaskLevel1No,SharewebTaskLevel2No,TimeSpent,BasicImageInfo,OffshoreComments,OffshoreImageUrl,CompletedDate,Shareweb_x0020_ID,Responsible_x0020_Team/Id,Responsible_x0020_Team/Title,SharewebCategories/Id,SharewebCategories/Title,ParentTask/Shareweb_x0020_ID,SharewebTaskType/Id,SharewebTaskType/Title,SharewebTaskType/Level,SharewebTaskType/Prefix,Priority_x0020_Rank,Reference_x0020_Item_x0020_Json,Team_x0020_Members/Title,Team_x0020_Members/Name,Component/Id,Component/Title,Component/ItemType,Team_x0020_Members/Id,Item_x002d_Image,component_x0020_link,IsTodaysTask,AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,AttachmentFiles/FileName,FileLeafRef,FeedBack,Title,Id,PercentComplete,Company,StartDate,DueDate,Comments,Categories,Status,WebpartId,Body,Mileage,PercentComplete,Attachments,Priority,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title,RelevantTasks/Id,RelevantTasks/Title";
        var expandquery = "RelevantTasks,ParentTask,RelevantPortfolio,Services,SharewebTaskType,AssignedTo,Component,AttachmentFiles,Author,Editor,Team_x0020_Members,Responsible_x0020_Team,SharewebCategories"
        web.lists.getById(Taskitem.listId).items.select(query).expand(expandquery).filter('Id eq ' + Taskitem.Id).getAll()
         .then((response:any)=>{            
            try{
                const responseitem = response[0];
                if(responseitem?.Shareweb_x0020_ID === null)
                  responseitem.Shareweb_x0020_ID = getSharewebId(responseitem); 
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
                   <h3 id="popup-title">{UpdatedItem?.siteurl} {UpdatedItem?.Shareweb_x0020_ID}{UpdatedItem?.Title}</h3>
                </div>
                <div className="ms-modalExample-body">
                    <label>Shareweb_x0020_ID</label>
                      <input defaultValue={UpdatedItem?.Shareweb_x0020_ID} onChange={(e) => setUpdatedItem({ ...UpdatedItem, Shareweb_x0020_ID: e.target.value })}></input>
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