import * as React from 'react';
import { Web } from "sp-pnp-js";
import TimeEntry from './TimeEntry';
var AllUsers: any = [];
var AllTimeSpentDetails: any = [];
var TaskCate:any=[]
const SmartTimeTotalFunction=(item:any)=>{
    var TaskTimeSheetCategoriesGrouping: any = [];
    var TaskTimeSheetCategories: any = [];
    const [AllUser, setAllUser] = React.useState([])
    const [isTimeEntry,setisTimeEntry]=React.useState(false);
    const [hoverTimeshow,sethoverTimeshow]=React.useState(false)
    const [smartTimeTotal,setsmartTimeTotal] = React.useState(0);
    const [AdditionalTime, setAdditionalTime] = React.useState([]);
    const [AllTimeSheetDataNew, setTimeSheet] = React.useState([]);

    // const[isModalOpen,setisModalOpen]=React.useState(false);

    // const [newData, setNewData] = React.useState({ Title: '', TaskDate: '', Description: '', TimeSpentInMinute: '', TimeSpentInHours: '', TaskTime: '' })
    // // var changeTime = 0;
    // var NewParentId: any = ''
    // var NewParentTitle: any = ''
   
    // var mainParentId: any = ''
    
    console.log(item.props);
    console.log(AllTimeSheetDataNew);
    React.useEffect(() => {
       
        GetSmartMetadata();
    }, []);
    var AllMetadata: [] = [];
    const GetSmartMetadata = async () => {
        let web = new Web(item.props.siteUrl);
        let MetaData = [];
        MetaData = await web.lists
            .getByTitle('SmartMetadata')
            .items
            .top(4999)
            .get();
        AllMetadata = MetaData;
        await GetTaskUsers();

    }
    // if(smartTimeTotal!=null){
    //      console.log("smartTimeTotal",smartTimeTotal)
    //     item.CallBackSumSmartTime(smartTimeTotal);
    // }
    const GetTaskUsers = async () => {
        let web = new Web(item.props.siteUrl);
        let taskUsers = [];
        taskUsers = await web.lists
            .getByTitle('Task Users')
            .items
            .top(4999)
            .get();
        AllUsers = taskUsers;
        EditData(item.props);
        console.log(taskUsers);

    }
   
    const EditData = async (items: any) => {
     

        TaskTimeSheetCategories = getSmartMetadataItemsByTaxType(AllMetadata, 'TimesheetCategories');
        TaskTimeSheetCategoriesGrouping = TaskTimeSheetCategoriesGrouping.concat(TaskTimeSheetCategories);
       // TaskTimeSheetCategoriesGrouping.push({ "__metadata": { "id": "Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(319)", "uri": "https://hhhhteams.sharepoint.com/sites/HHHH/_api/Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(319)", "etag": "\"1\"", "type": "SP.Data.SmartMetadataListItem" }, "Id": 319, "Title": "Others", "siteName": null, "siteUrl": null, "listId": null, "Description1": null, "IsVisible": true, "Item_x005F_x0020_Cover": null, "SmartFilters": null, "SortOrder": null, "TaxType": "TimesheetCategories", "Selectable": true, "ParentID": "ParentID", "SmartSuggestions": false, "ID": 319 });

        $.each(TaskTimeSheetCategoriesGrouping, function (index: any, categoryTitle: any) {

            categoryTitle.Childs = [];
            categoryTitle.Expanded = true;
            categoryTitle.flag = true;
            // categoryTitle.AdditionalTime = [];
            categoryTitle.isAlreadyExist = false;
            categoryTitle.AdditionalTimeEntry = undefined;
            categoryTitle.Author = {};
            categoryTitle.AuthorId = 0;
            categoryTitle.Category = {};
            categoryTitle.Created = undefined;
            categoryTitle.Editor = {};
            categoryTitle.Modified = undefined
            categoryTitle.TaskDate = undefined
            categoryTitle.TaskTime = undefined
            categoryTitle.TimesheetTitle = [];

        });
        

        getStructurefTimesheetCategories();
               if(items.siteType == "Offshore Tasks"){
                var siteType="OffshoreTasks"
                var filteres = "Task" + siteType + "/Id eq " + items.Id;
               }
               else{
                var filteres = "Task" + items.siteType + "/Id eq " + items.Id;
               }
    
        var select = "Id,Title,TaskDate,Created,Modified,TaskTime,Description,SortOrder,AdditionalTimeEntry,AuthorId,Author/Title,Editor/Id,Editor/Title,Category/Id,Category/Title,TimesheetTitle/Id,TimesheetTitle/Title&$expand=Editor,Author,Category,TimesheetTitle&$filter=" + filteres + "";
        var count = 0;
         if(items.siteType=="Migration"||items.siteType=="ALAKDigital"){
            var allurls = [{ 'Url': "https://hhhhteams.sharepoint.com/sites/HHHH/SP/_api/web/lists/getbyid('9ed5c649-3b4e-42db-a186-778ba43c5c93')/items?$select=" + select + "" }]
         }
          else if(item.props.sitePage=="SH"){
            var allurls = [{
                'Url': `${item.props.siteUrl}/_api/web/lists/getbyTitle('TaskTimesheet')/items?$select= ${select}`}]
            
          }
         else{ var allurls = [{ 'Url': "https://hhhhteams.sharepoint.com/sites/HHHH/SP/_api/web/lists/getbyid('464FB776-E4B3-404C-8261-7D3C50FF343F')/items?$select=" + select + "" },
         { 'Url': `${item.props.siteUrl}/_api/web/lists/getbyTitle('TaskTimesheet')/items?$select= ${select}`}]}

       
        $.each(allurls, async function (index: any, item: any) {
            await $.ajax({

                url: item.Url,

                method: "GET",

                headers: {

                    "Accept": "application/json; odata=verbose"

                }, 

                success: function (data) {
                    count++;
                    if (data.d.results != undefined && data.d.results.length > 0) {

                        AllTimeSpentDetails = AllTimeSpentDetails.concat(data.d.results);

                    }

                    if (allurls.length === count) {
                        
                        let TotalPercentage = 0
                        let TotalHours = 0;
                        let totletimeparentcount = 0;
                  
                        let AllAvailableTitle = [];
                       

                        $.each(AllTimeSpentDetails, async function (index: any, item: any) {
                            item.IsVisible = false;
                            item.Item_x005F_x0020_Cover = undefined;
                            item.Parent = {};
                            item.ParentID = 0;
                            item.ParentId = 0;
                            item.ParentType = undefined
                            item.Selectable = undefined;
                            item.SmartFilters = undefined;
                            item.SmartSuggestions = undefined;
                            item.isAlreadyExist = false
                            item.listId = null;
                            item.siteName = null
                            item.siteUrl = null;
                            // if (NewParentId == item.Id) {
                            //     var TimeInH: any = changeTime / 60
                            //     item.TimesheetTitle.Title = NewParentTitle;
                            //     item.TimesheetTitle.Id = mainParentId;
                            //     item.AdditionalTime = []
                            //     var update: any = {};
                            //     update['AuthorName'] = item.Author.Title;
                            //     update['AuthorImage'] = item.AuthorImage;
                            //     update['ID'] = 0;
                            //     update['MainParentId'] = mainParentId;
                            //     update['ParentID'] = NewParentId;
                            //     update['TaskTime'] = TimeInH;
                            //     // update['TaskDate'] =  Moment(changeDates).format('DD/MM/YYYY');
                            //     update['Description'] = newData.Description
                            //     item.AdditionalTime.push(update)
                            //     let web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/SP');

                            //     await web.lists.getById('464fb776-e4b3-404c-8261-7d3c50ff343f').items.filter("FileDirRef eq '/sites/HHHH/SP/Lists/TaskTimeSheetListNew/Smalsus/Santosh Kumar").getById(NewParentId).update({


                            //         AdditionalTimeEntry: JSON.stringify(item.AdditionalTime),
                            //         TimesheetTitleId: mainParentId

                            //     }).then((res: any) => {

                            //         console.log(res);
                                    


                            //     })

                            // }

                            if (item.TimesheetTitle.Id != undefined) {
                                if (item.AdditionalTimeEntry != undefined && item.AdditionalTimeEntry != '') {
                                    try {
                                        item.AdditionalTime = JSON.parse(item.AdditionalTimeEntry);
                                        if (item.AdditionalTime.length > 0) {
                                            $.each(item.AdditionalTime, function (index: any, additionalTime: any) {
                                                var time = parseFloat(additionalTime.TaskTime)
                                                if (!isNaN(time)) {
                                                    totletimeparentcount += time;
                                                    // $scope.totletimeparentcount += time;;
                                                }
                                            });
                                        }

                                    } catch (e) {
                                        console.log(e)
                                    }
                                }
                                setAllUser(AllUsers)

                                $.each(AllUsers, function (index: any, taskUser: any) {
                                    if (taskUser.AssingedToUserId === item.AuthorId) {
                                        item.AuthorName = taskUser.Title;
                                        item.AuthorImage = (taskUser.Item_x0020_Cover != undefined && taskUser.Item_x0020_Cover.Url != undefined) ? taskUser.Item_x0020_Cover.Url : '';
                                    }
                                });
                                if (item.TaskTime != undefined) {
                                    var TimeInHours = item.TaskTime / 60;
                                    // item.IntegerTaskTime = item.TaskTime / 60;
                                    item.TaskTime = TimeInHours.toFixed(2);
                                }
                            } else {
                                AllAvailableTitle.push(item);
                            }

                            if (item.AdditionalTime === undefined) {
                                item.AdditionalTime = [];
                            }
                            // item.ServerTaskDate = angular.copy(item.TaskDate);
                            // item.TaskDate = SharewebCommonFactoryService.ConvertLocalTOServerDate(item.TaskDate, 'DD/MM/YYYY');
                            item.isShifted = false;

                        })


                        getStructureData();

                    }

                }
            })
        })
      

    };
    var getSmartMetadataItemsByTaxType = function (metadataItems: any, taxType: any) {
        var Items: any = [];
        $.each(metadataItems, function (index: any, taxItem: any) {
            if (taxItem.TaxType === taxType)
                Items.push(taxItem);
        });
        return Items;
    }
    const getStructurefTimesheetCategories = function () {
        $.each(TaskTimeSheetCategories, function (index: any, item: any) {
            $.each(TaskTimeSheetCategories, function (index: any, val: any) {
                if (item.ParentID === 0 && item.Id === val.ParentID) {
                    val.ParentType = item.Title;
                }
            })
        })
        $.each(TaskTimeSheetCategoriesGrouping, function (index: any, item: any) {
            $.each(TaskTimeSheetCategoriesGrouping, function (index: any, val: any) {
                if (item.ParentID === 0 && item.Id === val.ParentID) {
                    val.ParentType = item.Title;
                }
            })
        })
    }

    var isItemExists = function (arr: any, Id: any) {
        var isExists = false;
        $.each(arr, function (index: any, items: any) {
            if (items.ID === Id) {
                isExists = true;
                return false;
            }
        });
        return isExists;
    }
    const getStructureData = function () {
        TaskCate= AllTimeSpentDetails
      
       
        $.each(AllTimeSpentDetails, function (index: any, items: any) {
            if (items.TimesheetTitle.Id === undefined) {
                items.Expanded = true;
                items.isAvailableToDelete = false;
                $.each(AllTimeSpentDetails, function (index: any, val: any) {
                    if (val.TimesheetTitle.Id != undefined && val.TimesheetTitle.Id === items.Id) {
                        val.isShifted = true;
                        val.show = true;
                        $.each(val.AdditionalTime, function (index: any, value: any) {
                            value.ParentID = val.Id;
                            value.siteListName = val.__metadata.type;
                            value.MainParentId = items.Id;
                            value.AuthorTitle = val.Author.Title;
                            value.EditorTitle = val.Editor.Title;
                            value.AuthorImage = val.AuthorImage
                            value.show = true;
                            if (val.changeDates != undefined)
                                // value.TaskDate = Moment(val.changeDates).format('DD/MM/YYYY');
                            if (val.Modified != undefined)
                                // value.Modified = Moment(val.Modified).format('DD/MM/YYYY');


                            if (!isItemExists(items.AdditionalTime, value.ID))
                                items.AdditionalTime.push(value);


                        })
                        // $.each(TaskTimeSheetCategoriesGrouping, function (index: any, items: any) {
                        //     if (items.Id == NewCategoryId) {
                        //         items.Childs.push(val);
                        //     }
                        // });
                        //  setAdditionalTime(item.AdditionalTime)


                    }
                })
            }
        })
        var TotalTime =0.0;
        
        AllTimeSpentDetails = $.grep(AllTimeSpentDetails, function (type: any) { 
            if(type.AdditionalTime!=undefined&&type.AdditionalTime.length>0){
              
                $.each(type.AdditionalTime,function(index:any,time:any){
                    TotalTime=TotalTime+parseFloat(time.TaskTime);
                  })
               
                type.totalTimeSpend=TotalTime;
                setsmartTimeTotal(TotalTime);

            }
             return type.isShifted === true });
        
        // $.each(AllTimeSpentDetails, function (index: any, items: any) {
           
           
        //     if (items.AdditionalTime.length === 0) {
              
        //         items.isAvailableToDelete = true;
        //     }
        //     if (items.AdditionalTime != undefined && items.AdditionalTime.length > 0) {
        //         $.each(items.AdditionalTime, function (index: any, type: any) {
        //             if (type.Id != undefined)
        //                 type.Id = type.ID;
        //         })
        //     }
        // });
       
        // $.each(AllTimeSpentDetails, function (index: any, items: any) {
        //     if (items.AdditionalTime.length > 0) {
        //         $.each(items.AdditionalTime, function (index: any, val: any) {
        //             var NewDate = val.TaskDate;
        //             try {
        //                 // getDateForTimeEntry(NewDate, val);
        //             } catch (e) { }
        //         })
        //     }
        // })
        // $.each(AllTimeSpentDetails, function (index: any, items: any) {
        //     if (items.Category.Title === undefined)
        //         checkCategory(items, 319);
        //     else
        //         checkCategory(items, items.Category.Id);
        // })
        // var IsTimeSheetAvailable = false;
        // $.each(TaskTimeSheetCategoriesGrouping, function (index: any, items: any) {
        //     if (items.Childs.length > 0) {
        //         IsTimeSheetAvailable = true;
        //     }
        // });

        // var AdditionalTimes: any = []

        // $.each(TaskTimeSheetCategoriesGrouping, function (index: any, items: any) {

        //     if (items.Childs != undefined && items.Childs.length > 0) {
        //         $.each(items.Childs, function (index: any, child: any) {
        //           if(child.TimesheetTitle.Id != undefined){
        //             if (child.AdditionalTime != undefined && child.AdditionalTime.length > 0) {
        //                 $.each(child.AdditionalTime, function (index: any, Subchild: any) {
        //                     if (Subchild != undefined && (!isItemExists(AdditionalTime, Subchild.ID))) {

        //                         AdditionalTimes.push(Subchild)

        //                     }

                        
        //                 })

        //             }
        //         }
        //         })
        //     }


        // });

        // setAdditionalTime(AdditionalTimes)
       
        setTimeSheet(TaskTimeSheetCategoriesGrouping);




     

    }
    const checkCategory = function (item: any, category: any) {
        $.each(TaskTimeSheetCategoriesGrouping, function (index: any, categoryTitle: any) {
            if (categoryTitle.Id === category) {
                // item.isShow = true;
                if (categoryTitle.Childs.length === 0) {
                    categoryTitle.Childs = [];
                }
                if (!isItemExists(categoryTitle.Childs, item.Id)) {
                    item.show = true;
                    categoryTitle.Childs.push(item);
                }
            }
        })
        
       
    }
    const OpenTimeEntry=()=>{
        setisTimeEntry(true)
    }
     const CallBackTimesheet=()=> {
        setisTimeEntry(false)
        // GetSmartMetadata();
     }
    return(
        <>
           {smartTimeTotal.toFixed(1)}
           {/* <span> <a onClick={OpenTimeEntry}><img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/clock-gray.png" style={{ width: "22px" }} /></a></span> */}
            <span><a onClick={OpenTimeEntry}><img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/clock-gray.png" style={{ width: "22px" }}  
             onMouseOver={(e) => sethoverTimeshow(true)}
             onMouseOut={(e) => sethoverTimeshow(false)}/></a></span>


            {/* {hoverTimeshow?  <div >
           <span>{item.props.Title}</span>
              {AllTimeSpentDetails.length>0&&AllTimeSpentDetails.map((items:any)=>{
              return(
                <>
                {items.AdditionalTime.length>0&& items.AdditionalTime.map((details:any)=>{
                   return(
                    <>
                    <div>
                    <div className="img  "> <span><img src={details.AuthorImage}></img></span></div>
                        <span>{details.TaskTime}</span>
                    </div>
                    <div>
                        <span>{details.TaskDate}</span>
                        <span>{details.TaskTime.toFixed(1)}</span>
                        <span>{details.TaskTime?.Description}</span>
                    </div>
                    </>
                   ) 
                })}
                </>
               )}
              )}
               </div>:null}  */}
            {isTimeEntry ? <TimeEntry data={item.props} isopen={isTimeEntry} CallBackTimesheet={() => {CallBackTimesheet() }} /> : ''}
              </>
    )
   
      

}
export default SmartTimeTotalFunction;