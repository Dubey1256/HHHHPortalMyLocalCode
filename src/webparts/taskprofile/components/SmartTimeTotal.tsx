import { styled } from 'office-ui-fabric-react';
import * as React from 'react';
import { Web } from "sp-pnp-js";
import TimeEntry from './TimeEntry';

var AllTimeSpentDetails: any = [];
let AllAvailableTitle: any = [];

     const SmartTimeTotalFunction = (item: any) => {
    var TaskTimeSheetCategoriesGrouping: any = [];
   const [isTimeEntry, setisTimeEntry] = React.useState(false);
    const [timeEntry, setTimeEntry] = React.useState(null);
    const [smartTimeTotal, setsmartTimeTotal] = React.useState(0);
    const [additionalTime, setAdditionalTime] = React.useState([]);
    const [AllTimeSheetDataNew, setTimeSheet] = React.useState([]);



    console.log(item.props);
    console.log(AllTimeSheetDataNew);
    React.useEffect(() => {
    if(item.props!=undefined){
        EditData(item.props);
    }
      
    }, []);
   const EditData = async (items: any) => {
      if (items.siteType == "Offshore Tasks") {
            var siteType = "OffshoreTasks"
            var filteres = "Task" + siteType + "/Id eq " + items.Id;
        }
        else {
            var filteres = "Task" + items.siteType + "/Id eq " + items.Id;
        }

        var select = "Id,Title,TaskDate,Created,Modified,TaskTime,Description,SortOrder,AdditionalTimeEntry,AuthorId,Author/Title,Editor/Id,Editor/Title,Category/Id,Category/Title,TimesheetTitle/Id,TimesheetTitle/Title&$expand=Editor,Author,Category,TimesheetTitle&$filter=" + filteres + "";
        var count = 0;
        if (items.siteType == "Migration" || items.siteType == "ALAKDigital") {
            var allurls = [{ 'Url': "https://hhhhteams.sharepoint.com/sites/HHHH/SP/_api/web/lists/getbyid('9ed5c649-3b4e-42db-a186-778ba43c5c93')/items?$select=" + select + "" }]
                  //TasksTimesheet2
       
        }
        else if (item?.props?.sitePage == "SH") {
            var allurls = [{
                'Url': `${item?.props?.siteUrl}/_api/web/lists/getbyTitle('TaskTimesheet')/items?$select= ${select}`
            }]

        }
        else {
            var allurls = [{ 
                // 'Url': "https://hhhhteams.sharepoint.com/sites/HHHH/SP/_api/web/lists/getbyid('464FB776-E4B3-404C-8261-7D3C50FF343F')/items?$select=" + select + "" },

            'Url': `${item?.props?.siteUrl}/_api/web/lists/getbyId('${item.AllListId.TaskTimeSheetListID}')/items?$select=${select}`
              
                //	TaskTimeSheetListNew
        }]
        }


        $.each(allurls, async function (index: any, item: any) {
            await $.ajax({

                url: item.Url,

                method: "GET",

                headers: {
               "Accept": "application/json; odata=verbose"
                },

                success: function (data) {
                    count++;
                    var duplicateArray:any=[];
                    if (data?.d?.results != undefined && data?.d?.results?.length > 0) {
                        data?.d?.results?.map((items:any)=>{
                            if(items.AdditionalTimeEntry!=null){
                             items.AdditionalTime = JSON.parse(items.AdditionalTimeEntry)
                             duplicateArray.push(items);
                           }
                         })
                          if(duplicateArray!=undefined&& duplicateArray.length>0){
                            AllTimeSpentDetails = AllTimeSpentDetails.concat(duplicateArray);
                          }
                    
                         if(AllTimeSpentDetails!=undefined&&AllTimeSpentDetails.length>0){
                            getStructureData();
                         }
                        }
                   
                }
            })
        })
    };
   
   
  
    const getStructureData = function () {
  
        // Smart total time code   get code
        var TotalTime = 0.0;

        console.log(timeEntry);
        let newArray: any = [];
        let hoversmartArray: any = [];
        AllTimeSpentDetails.map((items: any) => {
            items.AdditionalTime.map((item: any) => {
                item.additionaltime2 = [];
                item.additionaltime2.push(item);
                hoversmartArray.push(item)
            })
               })
        console.log(hoversmartArray);

        hoversmartArray.map((items: any) => {
            let parentfound = false;
            if (newArray.length == 0) {
                newArray.push(items);
            }
            else if (newArray.length > 0) {
                newArray.map((child: any) => {
                    
                    if (child.AuthorId == items.AuthorId) {
                        child.additionaltime2.unshift(items.additionaltime2[0])
                        parentfound = true;
                    }
                   
                })
               
                if (parentfound == false) {
                    newArray.push(items);
                }
            }
        })

        // =================Remove duplicate Description in a array =========

        // newArray.forEach((item:any)=>{
        //     if(item.additionaltime2 != undefined && item.additionaltime2.length>0){
        //         item.additionaltime3 =item.additionaltime2 .reduce(function (previous: any, current: any) {

        //             let alredyExists =
                    
        //              previous.filter(function (item: any) {
                    
        //              return (item.Description === current.Description||item.Created==current.Created);
                    
        //            }).length > 0;
                    
        //              if (!alredyExists) {
                    
        //              previous.push(current);
                    
        //             }
                    
        //              return previous;
                    
        //           }, []);
        //     }
           
        // })

        setTimeEntry(newArray)
        console.log(newArray);

        if (newArray.length > 0) {
            newArray.map((items: any) => {
                var hoverTime = 0;
                if (items.additionaltime2.length > 0) {
                    $.each(items.additionaltime2, function (index: any, time: any) {
                        hoverTime = hoverTime + parseFloat(time.TaskTime);
                        TotalTime=TotalTime+ parseFloat(time.TaskTime)
                    })
                }
                items.hoverTime = hoverTime;
              
            })
        }
       setsmartTimeTotal(TotalTime)
        setAdditionalTime(newArray)
        setTimeSheet(TaskTimeSheetCategoriesGrouping);
    }

    const OpenTimeEntry = () => {
        setisTimeEntry(true)
    }
    const CallBackTimesheet = () => {
        setisTimeEntry(false)
        AllTimeSpentDetails = [];
        EditData(item.props);
    }
    const ComponentCallBack = (dt: any) => {
       console.log(dt)
    }
    return (
        <>

            {console.log(timeEntry)}
            {console.log(AllAvailableTitle)}
            {console.log(additionalTime)}
            {smartTimeTotal.toFixed(1)}
            <span className='openhoverpopup hoverimg'>
            <span className="svg__iconbox svg__icon--clock dark" onClick={OpenTimeEntry}></span>
               <div className='hoverpopup overlay'>
                    <div className='hoverpopuptitle'>{item.props.Title}</div>
                    <div className='hoverpopupbody'>
                        <table className='table mb-0'>
                           { additionalTime.length > 0?<tbody>
                                {additionalTime.length > 0 && additionalTime.map((items: any) => {
                                    return (
                                        <>
                                            <tr className='for-c0l'>
                                                <td style={{ width: "20%" }}>
                                                    <img className='workmember '  src={items?.AuthorImage != undefined && items?.AuthorImage !="" ? items?.AuthorImage:"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg"}></img>
                                                </td>
                                                <td style={{ width: "80%" }} colSpan={2}><span className='px-2'>Total Time</span>{items.hoverTime.toFixed(2)}<span className='mx-1'>{items.hoverTime>1?'hours':'hour'}</span></td>
                                            </tr>

                                            {items?.additionaltime2?.length > 0 && items?.additionaltime2?.map((details: any) => {
                                                return (
                                                    <>       <tr>
                                                        <td style={{ width: "20%" }}>{details.TaskDate}</td>
                                                        <td style={{ width: "10%" }}>{details?.TaskTime}<span className='mx-1'>{details?.TaskTime>1?'hours':'hour'}</span></td>
                                                        <td style={{ width: "70%" }}>{details.Description}</td>
                                                    </tr>
                                                    </>
                                                )
                                            })}
                                        </>
                                    )
                                }
                                )}
                            </tbody>:<div className='p-2'><div className='noTimeEntry'>No Time Entry</div></div>}

                        </table>
                    </div> </div>
            </span>
            {isTimeEntry ? <TimeEntry data={item?.props} context={item.Context} Context={item.Context} isopen={isTimeEntry} CallBackTimesheet={() => { CallBackTimesheet() }}  parentCallback={ComponentCallBack}/> : ''}
        </>
    )
}
export default SmartTimeTotalFunction;