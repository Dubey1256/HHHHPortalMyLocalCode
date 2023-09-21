import React, { useEffect, useContext, useState } from 'react';
import { Web } from 'sp-pnp-js';
import * as globalCommoan from '../../../globalComponents/globalCommon';
import EmployeePieChart from './EmployeePieChart';
import {myContextValue} from '../../../globalComponents/globalCommon'
import WorldClock from './worldclock2';
import Header from './HeaderSection';
import TaskStatusTbl from './TaskStausTable';
var taskUsers:any
var dataLength: any = [];
var count: number = 0;
var AllData:any=[];
 var currentUserData:any
const EmployeProfile = (props:any) => {
  let allData: any = [];
//  const [configurations, setConfigurations] = useState();
 const [AllSite, setAllSite] = useState([]);
//  const [currentUserData,setCurrentUserData]=useState<any>()
 const[data,setData]=React.useState({DraftCatogary:[],TodaysTask:[],BottleneckTask:[],ThisWeekTask:[],ImmediateTask:[],ApprovalTask:[]});
 const [currentTime, setCurrentTime]:any = useState([]);
 const [annouceMents, setAnnouceMents]:any = useState([]);
 const [timesheetListConfig,setTimesheetListConfig]=React.useState<any>()
  useEffect(() => {
   loadTaskUsers();
   annouceMent();
}, []);


 const annouceMent=async ()=>{
  const web = new Web(props.props?.siteUrl);
  await web.lists
 .getById('F3CAD36C-EEF6-492D-B81F-9B441FDF218E')
 .items.select("Title", "ID", "Body")
 .getAll().then(async (data:any)=>{
  setAnnouceMents(data)
 }).catch((err:any)=>{
console.log(err);
 })
 }
 
  const smartMetaData = async () => {
    let sites = [];

    const web = new Web(props.props?.siteUrl);
         await web.lists
        .getById('01a34938-8c7e-4ea6-a003-cee649e8c67a')
        .items.select("Configurations", "ID", "Title", "TaxType", "listId")
        .filter("TaxType eq 'Sites'or TaxType eq 'timesheetListConfigrations'")
        .getAll().then(async (data:any)=>{
        var  AllsiteData:any = [];

        var timesheetListConfig = data.filter((data3: any) => {
          if (data3?.TaxType == 'timesheetListConfigrations') {
              return data3;
          }
      });
      setTimesheetListConfig(timesheetListConfig)
          data?.map((item: any) => {
            if (item.TaxType == "Sites") {
              if (item.Title != "DRR" && item.Title != "Master Tasks" && item.Title != "SDC Sites" && item.Configurations != null)
               {
                AllsiteData.push(item)
                let a: any = JSON.parse(item.Configurations);
               a?.map((newitem: any) => {
                  dataLength.push(newitem);
                  getAllData(newitem);
                });
               
              }
            }
          });
          setAllSite(AllsiteData)
        })
         
        
      
      .catch((error:any)=>{
          console.log(error)
        })
    
  
  };
  const loadTaskUsers = async () => {
    // setPageLoader(true)
    let taskUser;
    
        try {
            let web = new Web(props.props?.siteUrl);
            taskUsers = await web.lists
                .getById("b318ba84-e21d-4876-8851-88b94b9dc300")
                .items
                .select("Id,UserGroupId,Suffix,Title,Email,TeamLeader/Id,TeamLeader/Title,SortOrder,Role,IsShowTeamLeader,Company,ParentID1,Status,Item_x0020_Cover,AssingedToUserId,isDeleted,AssingedToUser/Title,AssingedToUser/Id,AssingedToUser/EMail,ItemType,Approver/Id,Approver/Title,Approver/Name&$expand=TeamLeader,AssingedToUser,Approver")
                .get();
                taskUsers?.map((item: any) => {
                  let  currentUserId:any = props?.props?.Context?.pageContext?.legacyPageContext?.userId
                   if (currentUserId == item?.AssingedToUser?.Id &&currentUserId!=undefined) {
                    currentUserData = item;
                      //  setCurrentUserData(item);
                       smartMetaData()
             
                   }
                   item.expanded = false;
               })
        }
        catch (error) {
            return Promise.reject(error);
        }
        return taskUser;
     }
 
  const getAllData = async (itemsssssss: any) => {
    const web = new Web(itemsssssss.siteUrl);
    await web.lists
        .getById(itemsssssss.listId)
        .items.select("Title","PercentComplete","Categories", "workingThisWeek",'TaskID' ,"IsTodaysTask","Priority","Priority_x0020_Rank","DueDate","Created","Modified","Team_x0020_Members/Id","Team_x0020_Members/Title","ID","Responsible_x0020_Team/Id","Responsible_x0020_Team/Title","Editor/Title","Editor/Id","Author/Title","Author/Id","AssignedTo/Id","AssignedTo/Title")
        .expand("Team_x0020_Members","Author","Editor","Responsible_x0020_Team","AssignedTo")
        .top(5000)
        .getAll()
        .then((data: any) => {
               count++;
              data?.map((items:any)=>{

                items.Team_x0020_Members?.map((itemsss:any)=>{
                  if(itemsss.Id === currentUserData.AssingedToUser.Id){
                    allData.push({...items,siteIcon:itemsssssss.ImageUrl});
                  }
                })
                items.Responsible_x0020_Team?.map((itemsss:any)=>{
                  if(itemsss.Id === currentUserData.AssingedToUser.Id){
                    allData.push({...items,siteIcon:itemsssssss.ImageUrl});
                  }
                })
                items.AssignedTo?.map((itemsss:any)=>{
                  if(itemsss.Id === currentUserData.AssingedToUser.Id){
                    allData.push({...items,siteIcon:itemsssssss.ImageUrl});
                  }
                })
              })
            if (count == dataLength.length) {
              var today = new Date();
                var time = today.getHours() + ":" + today.getMinutes();
               var dateTime = time;
                      setCurrentTime(dateTime)
              const seen = new Set();
                const array:any= allData.filter((item:any) => {
                  const keyValue:any = item['Id'];
                  if (!seen.has(keyValue)) {
                   seen.add(keyValue);
                   return true;
                     }
                     return false;
             });
              let DraftArray : any = [];
              let TodaysTask:any = [];
              let BottleneckTask:any = [];
              let ApprovalTask:any = [];
              let ImmediateTask:any = [];
              let ThisWeekTask:any = [];

              array?.map((items:any)=>
              {
                if(items.Categories == 'Draft'){
                  DraftArray.push(items);
                }else if(items.IsTodaysTask == true){
                  TodaysTask.push(items);
                }else if(items.Categories == 'Bottleneck'){
                  BottleneckTask.push(items);
                }else if(items.Categories == 'Immediate'){
                  ImmediateTask.push(items);
                }else if(items.workingThisWeek == true){
                  ThisWeekTask.push(items);
                }else if(items.PercentComplete == 1){
                  ApprovalTask.push(items);
                }
                
              })
              // setCurrentTaskUser(currentUserData);
                setData({...data, DraftCatogary:DraftArray,TodaysTask:TodaysTask,BottleneckTask:BottleneckTask,ApprovalTask:ApprovalTask,ImmediateTask:ImmediateTask,ThisWeekTask:ThisWeekTask});
           }
        })
        .catch((err: any) => {
            console.log("then catch error", err);
        });
};

 return (
    <myContextValue.Provider value={{ ...myContextValue,annouceMents:annouceMents, siteUrl:props?.props?.siteUrl,AllSite:AllSite,currentUserData:currentUserData,AlltaskData:data,timesheetListConfig:timesheetListConfig}}>
     <div> <Header/></div>
      
      {/* <div><WorldClock/></div> */}
      {/* <WorldClock/> */}
      <TaskStatusTbl/>
      {/* {timesheetListConfig!=undefined &&timesheetListConfig.length>0 &&<EmployeePieChart />} */}
    </myContextValue.Provider>
  );
};

export default EmployeProfile;
