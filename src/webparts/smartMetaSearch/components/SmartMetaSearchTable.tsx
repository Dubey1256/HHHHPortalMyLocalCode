import * as React from 'react';
import { Web } from "sp-pnp-js";
import { ColumnDef } from '@tanstack/react-table';
// import GlobalCommonTable from '../../../GlobalCommon/GlobalCommonTable';
import GlobalCommonTable from '../../../globalComponents/GlobalCommanTable';
import TaskPopup from './TaskPopup'
import * as moment from 'moment';
import { Panel, PanelType, PrimaryButton } from 'office-ui-fabric-react';
import EditTaskPopup from '../../../globalComponents/EditTaskPopup/EditTaskPopup';
// const web = "https://hhhhteams.sharepoint.com/sites/HHHH/SP/";
// let web = new Web(web);

const SmartMetaSearchTable = (props:any) => {
    const AllListId = props.AllListId;
    const tableitems = props.SiteSmartfilters;
    let web = new Web(AllListId.ContextValue._pageContext._web.absoluteUrl + '/');
    let parenturl = AllListId.ContextValue._pageContext._web.absoluteUrl;    
    const [AllTask,setAllTask] = React.useState<any[]>([]);    
    const [iseditOpen,setiseditOpen] = React.useState(false);
    const [Updateditem,setUpdateditem] = React.useState([]);   
    
    React.useEffect(() => {        
        if(tableitems?.selectedfilters?.length>0)      
          loadfilters(tableitems?.AllData);
        else{
            setAllTask([]) 
        }  
    }, [tableitems]);
  
    const getChilds = (item: any, items: any) => {
        item.children = [];
        for (let index = 0; index < items?.length; index++) {
            let childItem = items[index];
            if (childItem.UserGroupId != undefined && parseInt(childItem.UserGroupId) == item.ID) {
                childItem.value = childItem.Id;
                childItem.label = childItem.Title;
                item.children.push(childItem);
                getChilds(childItem, items);
            }
        }
        if (item?.children?.length == 0) {
            delete item.children;
        }
    }
    const checkDuplicateItem =(resultitem:any,item:any):boolean =>{
        if(resultitem?.length === 0) {return false}
        else {          
            return resultitem.some((result: any) => result.Id == item.Id);
        }
    }
    const Datefilter = (datefilteritems:any)=>{
        let smartdatefilter:any = '';
        if(tableitems?.startDate !== '' || tableitems?.endDate !== ''){
            let tempdata:any = [];
            let temparr:any = [];
            datefilteritems.map((taskitems:any)=>{
                if(tableitems.duedate.isCretaedDate || tableitems.duedate.isModifiedDate || tableitems.duedate.isDueDate){
                    const start = new Date(tableitems.startDate).valueOf();                                     
                    const end = new Date(tableitems.endDate).valueOf();
                    const days = Math.floor((end - start) / (1000 * 60 * 60 * 24));
                    const dates = [];
                    for (let i = 0; i <= days; i++) {
                        const currentDate = new Date(tableitems.startDate.getTime() + i * 24 * 60 * 60 * 1000);                                                                         
                            if(currentDate.toString() === new Date(taskitems.Modified).toString() || currentDate.toString() === new Date(taskitems.Modified).toString()){
                                if(!checkDuplicateItem(temparr,taskitems))
                                 temparr.push(taskitems);
                            }
                    }                                                                        
                }
            })                        
            tempdata = {...tempdata,...temparr};                                        
            smartdatefilter = temparr;                
        }
        else{
            smartdatefilter=datefilteritems;
        }
        return smartdatefilter;
    }
    const loadfilters=(AllTaskitem:any)=>{
        let resultitem:any = AllTaskitem;
        let Allresultitem:any = [];
        let highFilters:any = [];
        let imageurl:any = ''        
        let userImageTitle:any = '';
        let GlobalFilter:any = '';
        let temptask:any = [];
        tableitems.selectedfilters.map((selecteditem:any)=>{                      
            var flag = false;
            highFilters.map((high:any)=> {
                if (high.TaxType == selecteditem.TaxType) {
                    if (high.TaxType == "Team Member") {
                        high.child.push(selecteditem.AssingedToUserId);
                    } else if (high.TaxType == "Status") {
                        high.child.push(selecteditem.StatusValue);
                    } else {
                        high.child.push(selecteditem.Title);
                    }
                    flag = true;
                }
            })
            if(!flag){
                var temp:any = {};             
                temp['TaxType'] = selecteditem.TaxType;
                temp.child = [];
                if(temp.TaxType !== 'Date'){
                    highFilters.push(temp)                   
                }
                else{
                    highFilters.push(temp)
                }
                highFilters.map((high:any)=>{
                    if(high.TaxType === selecteditem.TaxType){
                        if (high.TaxType == "Team Member") {                            
                            high.child.push(selecteditem.AssingedToUserId);
                        }
                        else if (high.TaxType == "Status") {
                            high.child.push(selecteditem.StatusValue);
                        }
                        else if (high.TaxType == "Date") {
                            high.child.push(selecteditem);
                        }
                        else if (high.TaxType == "Url") {
                            high.child.push(selecteditem.Url);
                        }
                        else {
                            high.child.push(selecteditem.Title);
                        }
                    }
                })  
            } 
            
            if (selecteditem?.GlobalSearch) {
                GlobalFilter = selecteditem;
            }                          
        })
        if(GlobalFilter !== undefined) {
            if (GlobalFilter.advanceValueAll === 'Allwords') {               
                GlobalFilter.GlobalSearch.split(' ').map((word:any)=>{
                    if (GlobalFilter.updateFilterAll === "Allfields") {                       
                        temptask =  resultitem.filter((x:any) => x?.includes(word));
                        resultitem = temptask;
                    } else {                        
                        temptask = resultitem.filter((x:any) => x?.Title?.includes(word));
                        resultitem = temptask;
                    }

                })                
            } else if (GlobalFilter.advanceValueAll == 'Anywords') {              
                GlobalFilter.GlobalSearch.split(' ').map((word:any)=> {
                    if (GlobalFilter.updateFilterAll == "Allfields") {
                        temptask = resultitem.filter((x:any) => x?.includes(word));
                        resultitem = temptask;
                    } else {                       
                        temptask = resultitem.filter((x:any) => x?.Title?.includes(word));
                        resultitem = temptask;
                    }
                })               
            } else if (GlobalFilter.advanceValueAll == 'ExactPhrase') {                
                if (GlobalFilter.updateFilterAll == "Allfields") {
                    temptask = resultitem.filter((x:any) => x?.includes(GlobalFilter.GlobalSearch));
                    resultitem = temptask;
                } else {                    
                    temptask = resultitem.filter((x:any) => x?.Title?.includes(GlobalFilter.GlobalSearch));
                    resultitem = temptask;
                }                
            }
        }
        highFilters?.map((selecteditems:any)=>{
            if(selecteditems.TaxType === 'Sites'){
                let tempdata:any = [];
                let temparr:any = [];
                selecteditems?.child.map((childitem:any)=>{
                    resultitem.map((item:any)=>{
                        if(childitem === item.siteType){
                            if(!checkDuplicateItem(temparr,item))
                                temparr.push(item);                        
                        }
                    })                                      
                })
                
                tempdata = {...tempdata,...temparr};                                        
                resultitem = temparr;
            }
            else if(selecteditems.label === 'Status' || selecteditems.TaxType === 'Status'){
                let tempdata:any = [];
                let temparr:any = [];
                selecteditems?.child.map((childitem:any)=>{
                    resultitem?.map((taskitems:any)=>{
                        if(childitem === taskitems.PercentComplete){
                            if(!checkDuplicateItem(temparr,taskitems))
                                temparr.push(taskitems); 
                        }                        
                    })                                       
                })
                                      
                tempdata = {...tempdata,...temparr};                                        
                resultitem = temparr;
            }  
            else if(selecteditems.label === 'Priority' || selecteditems.TaxType === 'Priority'){
                let tempdata:any = [];
                let temparr:any = [];
                selecteditems?.child.map((childitem:any)=>{
                    resultitem.forEach((taskitems:any)=>{
                        if(childitem == taskitems.PriorityRank){
                            if(!checkDuplicateItem(temparr,taskitems))
                                temparr.push(taskitems); 
                        }
                    })                                       
                })
                                       
                tempdata = {...tempdata,...temparr};                                        
                resultitem = temparr;                                        
            }
            else if(selecteditems.label === 'Type' || selecteditems.TaxType === 'Type'){ 
                let tempdata:any = [];
                let temparr:any = [];
                selecteditems?.child.map((childitem:any)=>{
                    resultitem?.map((taskitems:any)=>{
                        if(childitem == taskitems?.TaskType?.Title){
                            if(!checkDuplicateItem(temparr,taskitems))
                                temparr.push(taskitems); 
                        }
                    })                                        
                })
                                    
                tempdata = {...tempdata,...temparr};                                        
                resultitem = temparr;                                   
                
            }
            else if(selecteditems.label === 'Categories' || selecteditems.TaxType === 'Categories'){ 
                let tempdata:any = [];
                let temparr:any = [];
                selecteditems?.child.map((childitem:any)=>{
                    resultitem?.map((taskitems:any)=>{
                        if(taskitems?.TaskCategories?.length>0){
                            taskitems.TaskCategories.map((ctype:any)=>{
                                if(ctype.Title === childitem){
                                    if(!checkDuplicateItem(temparr,taskitems))
                                        temparr.push(taskitems);
                                }
                            })                                         
                        }
                    })                                        
                })
                                      
                tempdata = {...tempdata,...temparr};                                        
                resultitem = temparr;                                   
                
            }
            else if(selecteditems.label === 'Client Category'  || selecteditems.TaxType === 'Client Category'){  
                let tempdata:any = [];
                let temparr:any = [];
                selecteditems?.child.map((childitem:any)=>{
                    resultitem?.map((taskitems:any)=>{
                        if(taskitems?.ClientCategory?.length>0){
                            taskitems.ClientCategory.map((cctype:any)=>{
                                if(cctype.Title === childitem){
                                    if(!checkDuplicateItem(temparr,taskitems))
                                        temparr.push(taskitems);
                                }                                   
                            })                                         
                        }
                    })                                       
                })
                                       
                tempdata = {...tempdata,...temparr};
                resultitem = temparr;                                   
                
            }
            else if(selecteditems.label === 'Portfolio Type'  || selecteditems.TaxType === 'Portfolio Type'){
                let tempdata:any = [];
                let temparr:any = [];
                selecteditems?.child.map((childitem:any)=>{
                    resultitem?.map((taskitems:any)=>{
                        if((childitem == 'Component' && taskitems.Component?.length>0) || (childitem == 'Service' && taskitems.Service?.length>0) || (childitem == 'Deliverable' && taskitems.Deliverable?.length>0) || (selecteditems.Title == 'Events' && taskitems.Events?.length>0)){                                           
                            if(!checkDuplicateItem(temparr,taskitems))
                                temparr.push(taskitems);                                   
                        }
                    })                                     
                })
                                       
                tempdata = [{...tempdata,...temparr}];                                        
                resultitem = temparr;                                       
                
            }
            else if(selecteditems.TaxType === 'Team Member'){
                let tempdata:any = [];
                let temparr:any = [];
                selecteditems?.child.map((childitem:any)=>{
                    resultitem?.map((taskitems:any)=>{
                        taskitems.imageurl = imageurl;
                        taskitems.userImageId = childitem;
                        taskitems.userImageTitle = userImageTitle;
                        if(tableitems?.Createmodified?.isCreated ){
                            if(childitem === taskitems.Author.Id){                                                                                                              
                                if(!checkDuplicateItem(temparr,taskitems))
                                    temparr.push(taskitems);
                            }
                        }
                        if(tableitems?.Createmodified?.isModified){                                            
                            if(childitem === taskitems.Editor.Id){
                                if(!checkDuplicateItem(temparr,taskitems))
                                    temparr.push(taskitems);
                            }                                                                                 
                        }
                        if(tableitems?.Createmodified?.isAssignedto){                                           
                            taskitems?.AssignedTo?.map((assignitem:any)=>{
                                if(childitem=== assignitem.Id){                                                      
                                    if(!checkDuplicateItem(temparr,taskitems))
                                        temparr.push(taskitems);
                                }
                            })
                            
                        }
                        if(!tableitems?.Createmodified?.isCreated && !tableitems?.Createmodified?.isModified && !tableitems?.Createmodified?.isAssignedto){
                            if(childitem === taskitems.Author.Id){                                               
                                if(!checkDuplicateItem(temparr,taskitems))
                                    temparr.push(taskitems);
                            }
                            if(childitem === taskitems.Editor.Id){
                                if(!checkDuplicateItem(temparr,taskitems))
                                    temparr.push(taskitems);
                            }
                            if(taskitems?.AssignedTo){
                                taskitems.AssignedTo.map((assignitem:any)=>{
                                    if(childitem === assignitem.Id){                                                      
                                        if(!checkDuplicateItem(temparr,taskitems))
                                            temparr.push(taskitems);
                                    }
                                })
                            } 
                        }
                    })                                    
                })
                                      
                tempdata = {...tempdata,...temparr};                                        
                resultitem = temparr;
                
            }
            else if(selecteditems.TaxType === 'Date'){
                let tempdata:any = [];
                let temparr:any = [];
                selecteditems?.child.map((childitem:any)=>{
                    resultitem.map((dateitem:any)=>{
                        if(childitem?.isCretaedDate || childitem?.isModifiedDate || childitem?.isDueDate ){
                            const start = new Date(childitem.Startdate).valueOf();                                     
                            const end = new Date(childitem.EndDate).valueOf();
                            const days = Math.floor((end - start) / (1000 * 60 * 60 * 24));
                            const dates = [];
                            for (let i = 0; i <= days; i++) {
                                const currentDate = new Date(childitem.Startdate.getTime() + i * 24 * 60 * 60 * 1000);                                                                         
                                    if(currentDate.toString() === new Date(dateitem.Modified).toString() || currentDate.toString() === new Date(dateitem.Modified).toString()){
                                        if(!checkDuplicateItem(temparr,dateitem))
                                        temparr.push(dateitem);
                                    }
                            }   
                        }
                    })
                })
              
                tempdata = {...tempdata,...temparr};                                        
                resultitem = temparr;
            }
            Allresultitem = resultitem;
        })
        if(Allresultitem?.length>0){
          resultitem = Datefilter(Allresultitem);
        }
        if(tableitems?.isShowItem == true){
            if(resultitem?.length>0){
                resultitem = resultitem.sort((a:any, b:any) => {
                    if (a.TaskID < b.TaskID) return 1;
                    if (a.TaskID > b.TaskID) return -1;
                    return 0;
                });
                setAllTask(resultitem);
                // tableitems.isShowTable = false;
            }         
            else
             setAllTask([]);
        }
        
        
    }
     
    
  const Call = React.useCallback((childItem: any) => {
    setiseditOpen(false);
  
  }, []);
    const EdittaskItems = (taskitem:any) =>{       
        setUpdateditem(taskitem);
        setiseditOpen(true);       
    }
    const closeEditPopup =()=>{
        setiseditOpen(false);
    }

    const RemoveItem = (Item: any) => {
        var flag: any = confirm('Do you want to delete this item')
        if (flag) {            
            web.lists.getById(Item.listId).items.getById(Item.Id).recycle().then(() => {
                alert("delete successfully")
                props.closeEditPopup()
            }).catch((error: any) => {
                console.error(error);
            });
        }
    }

    const columns = React.useMemo<ColumnDef<any, unknown>[]>(() =>
    [
        { cell: ({ row }) => (
            <>
                <a> <img className='workmember ' src={row.original.siteurl} /></a>{row.original.TaskID}
            </>
        ),accessorKey: "TaskID", placeholder: "TaskID", header: "", size: 70, },
        { cell: ({ row }) => (
            <>
                <a target='_blank' href={`${parenturl}/SitePages/Task-Profile.aspx?taskId=${row.original.Id}&Site=${row.original.siteType}`}>{row.original.Title}</a>
            </>
        ),accessorKey: "Title", placeholder: "Title", header: "", size: 150, },
        {cell: ({ row }) => (
            <>
                <a target='_blank' href={`${parenturl}/SitePages/Portfolio-Profile.aspx?taskId=${row.original.tagComponentId}`}>{row.original.tagComponentTitle}</a>
            </>
        ), accessorKey: "tagComponentTitle", placeholder: "Component", header: "", size: 70, },
        { accessorKey: "Categories", placeholder: "Categories", header: "", size: 70, },
        { accessorKey: "PercentComplete", placeholder: "%", header: "", size: 70, },
        { accessorKey: "PriorityRank", placeholder: "Priority", header: "", size: 70, },
        { accessorKey: "Modified", placeholder: "Modified", header: "", size: 70, cell: ({ row }) => (
            <>
                {row.original.Modified}<a target='_blank' href={`${web}/SitePages/TeamLeader-Dashboard.aspx?UserId=${row.original.userImageId}&Name=${row.original.userImageTitle}`}><img className='workmember ' src={row.original.userImageUrl} /></a>
            </>
        ) },
        { accessorKey: "DueDate", placeholder: "DueDate", header: "", size: 70, },
        {
            cell: ({ row }) => (
                <>
                    <a onClick={() => EdittaskItems(row.original)} title="Edit"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="25" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 21.9323V35.8647H13.3613H19.7226V34.7589V33.6532H14.3458H8.96915L9.0264 25.0837L9.08387 16.5142H24H38.9161L38.983 17.5647L39.0499 18.6151H40.025H41V13.3076V8H24H7V21.9323ZM38.9789 12.2586L39.0418 14.4164L24.0627 14.3596L9.08387 14.3027L9.0196 12.4415C8.98428 11.4178 9.006 10.4468 9.06808 10.2838C9.1613 10.0392 11.7819 9.99719 24.0485 10.0441L38.9161 10.1009L38.9789 12.2586ZM36.5162 21.1565C35.8618 21.3916 34.1728 22.9571 29.569 27.5964L23.4863 33.7259L22.7413 36.8408C22.3316 38.554 22.0056 39.9751 22.017 39.9988C22.0287 40.0225 23.4172 39.6938 25.1029 39.2686L28.1677 38.4952L34.1678 32.4806C41.2825 25.3484 41.5773 24.8948 40.5639 22.6435C40.2384 21.9204 39.9151 21.5944 39.1978 21.2662C38.0876 20.7583 37.6719 20.7414 36.5162 21.1565ZM38.5261 23.3145C39.2381 24.2422 39.2362 24.2447 32.9848 30.562C27.3783 36.2276 26.8521 36.6999 25.9031 36.9189C25.3394 37.0489 24.8467 37.1239 24.8085 37.0852C24.7702 37.0467 24.8511 36.5821 24.9884 36.0529C25.2067 35.2105 25.9797 34.3405 31.1979 29.0644C35.9869 24.2225 37.2718 23.0381 37.7362 23.0381C38.0541 23.0381 38.4094 23.1626 38.5261 23.3145Z" fill="#333333"></path></svg></a>
                </>
            ),
            accessorKey: '',
            canSort: false,
            placeholder: '',
            header: '',
            id: 'row.original',
            size: 10,
        },
        {
            cell: ({ row }) => (
                <>
                    <a onClick={() => RemoveItem(row.original)}><svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M19.3584 5.28375C18.4262 5.83254 18.1984 6.45859 18.1891 8.49582L18.1837 9.66172H13.5918H9V10.8591V12.0565H10.1612H11.3225L11.3551 26.3309L11.3878 40.6052L11.6525 41.1094C11.9859 41.7441 12.5764 42.3203 13.2857 42.7028L13.8367 43H23.9388C33.9989 43 34.0431 42.9989 34.6068 42.7306C35.478 42.316 36.1367 41.6314 36.4233 40.8428C36.6697 40.1649 36.6735 39.944 36.6735 26.1055V12.0565H37.8367H39V10.8591V9.66172H34.4082H29.8163L29.8134 8.49582C29.8118 7.85452 29.7618 7.11427 29.7024 6.85084C29.5542 6.19302 29.1114 5.56596 28.5773 5.2569C28.1503 5.00999 27.9409 4.99826 23.9833 5.00015C19.9184 5.0023 19.8273 5.00784 19.3584 5.28375ZM27.4898 8.46431V9.66172H24H20.5102V8.46431V7.26691H24H27.4898V8.46431ZM34.4409 25.9527C34.4055 40.9816 34.4409 40.2167 33.7662 40.5332C33.3348 40.7355 14.6335 40.7206 14.2007 40.5176C13.4996 40.1889 13.5306 40.8675 13.5306 25.8645V12.0565H24.0021H34.4736L34.4409 25.9527ZM18.1837 26.3624V35.8786H19.3469H20.5102V26.3624V16.8461H19.3469H18.1837V26.3624ZM22.8367 26.3624V35.8786H24H25.1633V26.3624V16.8461H24H22.8367V26.3624ZM27.4898 26.3624V35.8786H28.6531H29.8163V26.3624V16.8461H28.6531H27.4898V26.3624Z" fill="#333333"></path></svg></a>
                </>
            ),
            accessorKey: '',
            canSort: false,
            placeholder: '',
            header: '',
            id: 'row.original',
            size: 10,
        }    
    ],[AllTask]
    );
    const callBackData = React.useCallback((elem: any, getSelectedRowModel: any, ShowingData: any) => {

    }, []);
  return(
    <>  
       <div>
            {AllTask && <GlobalCommonTable columns={columns} data={AllTask} showHeader={true} callBackData={callBackData} />}
            {iseditOpen && <EditTaskPopup Items={Updateditem} AllListId={AllListId} Call={Call} context={AllListId.ContextValue}></EditTaskPopup>
     
            }
       </div>
    </>
  )

}

export default SmartMetaSearchTable;