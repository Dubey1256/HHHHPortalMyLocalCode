import { Modal } from 'office-ui-fabric-react';
import * as React from 'react';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { Web } from "sp-pnp-js";
import * as moment from 'moment';
import { post } from 'jquery';
import { CurrentUser } from 'sp-pnp-js/lib/sharepoint/siteusers';
import pnp, { PermissionKind } from "sp-pnp-js";
import Task from '../../webparts/taskUserManagement/components/TaskUser';
var AllTimeSpentDetails: any = [];
var CurntUserId = ''
var changeTime = 0;
var childs: any = []
var ParentId: any = ''
var Category: any = '';
var NewCategoryId: any = ''
var AllUsers:any = [];
function TimeEntryPopup(item: any) {
    const [AllTimeSheetDataNew, setTimeSheet] = React.useState([])
    const [modalTimeIsOpen, setTimeModalIsOpen] = React.useState(false);
    // const [AllMetadata, setMetadata] = React.useState([]);
    const [EditTaskItemitle, setEditItem] = React.useState('');
    const [collapseItem, setcollapseItem] = React.useState(true);
    const [search, setSearch]: [string, (search: string) => void] = React.useState("");
    const [TaskStatuspopup, setTaskStatuspopup] = React.useState(false);
    const [TaskStatuspopup2, setTaskStatuspopup2] = React.useState(false);
    const [CopyTaskpopup, setCopyTaskpopup] = React.useState(false);
    const [AddTaskTimepopup, setAddTaskTimepopup] = React.useState(false);
    const [TimeSheet, setTimeSheets] = React.useState([])
    const [changeDates, setchangeDates] = React.useState(moment().format('MMMM Do YYYY'))
    const [changeTimeAdd, setchangeTimeAdd] = React.useState()
    const [AdditionalTime, setAdditionalTime] = React.useState([])
    const [count, setCount] = React.useState(1)
    const [month, setMonth] = React.useState(1)
    const [saveEditTaskTime, setsaveEditTaskTime] = React.useState([])
    const [postData, setPostData] = React.useState({ Title: '', TaskDate: '', Description: '', TaskTime: '' })
    const [newData, setNewData] = React.useState({ Title: '', TaskDate: '', Description: '', TimeSpentInMinute: '', TimeSpentInHours: '', TaskTime: '' })
    const [add, setAdd] = React.useState({ Title: '', TaskDate: '', Description: '', TaskTime: '' })
    const [saveEditTaskTimeChild, setsaveEditTaskTimeChild] = React.useState([])
    const [AllUser, setAllUser] = React.useState([])
    const [checkCategories, setcheckCategories] = React.useState()
    const [updateData, setupdateData] = React.useState(0)

    const [year, setYear] = React.useState(1)
    const [TimeInHours, setTimeInHours] = React.useState(0)
    var smartTermName = "Task" + item.props.siteType;

    const GetTaskUsers = async () => {
        let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
        let taskUsers = [];
        taskUsers = await web.lists
            .getByTitle('Task Users')
            .items
            .top(4999)
            .get();
        AllUsers = taskUsers;
        EditData(item.props);
        //console.log(this.taskUsers);

    }
    pnp.sp.web.currentUser.get().then(result => {
        CurntUserId = result.Id;
        console.log(CurntUserId)

    });

    const changeDate = (val: any) => {


        if (val === 'Date') {
            setCount(count + 1)
            setchangeDates(moment().add(count, 'days').format("MMMM Do YYYY"))

        }
        if (val === 'month') {
            setMonth(month + 1)
            setchangeDates(moment().add(month, 'months').format("MMMM Do YYYY"))

        }
        if (val === 'Year') {
            setYear(year + 1)
            setchangeDates(moment().add(year, 'years').format("MMMM Do YYYY"))

        }
    }
    const changeDateDec = (val: any) => {


        if (val === 'Date') {
            setCount(count - 1)
            setchangeDates(moment().add(count, 'days').format("MMMM Do YYYY"))
        }
        if (val === 'month') {
            setMonth(month - 1)
            setchangeDates(moment().add(month, 'months').format("MMMM Do YYYY"))
        }
        if (val === 'Year') {
            setYear(year - 1)
            setchangeDates(moment().add(year, 'years').format("MMMM Do YYYY"))
        }
    }

    const changeTimes = (val: any) => {
        if (val === '15') {
            // setchangeTime(changeTime + 15)
            changeTime = changeTime + 15
            if (changeTime != undefined) {
                var TimeInHour: any = changeTime / 60;
                setTimeInHours(TimeInHour.toFixed(2))

            }

        }
        if (val === '60') {
            //setchangeTime(changeTime + 60)
            changeTime = changeTime + 60
            if (changeTime != undefined) {
                var TimeInHour: any = changeTime / 60;
                setTimeInHours(TimeInHour.toFixed(2))
            }

        }

    }
    const openTaskStatusUpdatePoup = () => {
        setTaskStatuspopup(true)
    }
    const openCopyTaskpopup = () => {
        setCopyTaskpopup(true)
    }

    const openAddTasktimepopup = (val: any) => {
        ParentId = val.Id;
        var CategoryTitle = val.Title;
        setAddTaskTimepopup(true)
    }
    const openTaskStatusUpdatePoup2 = (childitem: any, childinew: any) => {
        var Array: any = []
        var Childitem: any = []
        setTaskStatuspopup2(true)
        Array.push(childitem)
        Childitem.push(childinew)
        setsaveEditTaskTime(Array)
        setsaveEditTaskTimeChild(Childitem)
        console.log(item)

    }
    const closeTaskStatusUpdatePoup = () => {
        setTaskStatuspopup(false)
        setTimeInHours(0)
        changeTime = 0;
        setCount(0)
    }
    const closeCopyTaskpopup = () => {
        setCopyTaskpopup(false)
    }
    const closeAddTaskTimepopup = () => {
        setPostData(undefined)
        setAddTaskTimepopup(false)
        setTimeInHours(0)
        changeTime = 0;
        setCount(0)
    }
    const closeTaskStatusUpdatePoup2 = () => {
        setTaskStatuspopup2(false)
        setTaskStatuspopup(false)
        setTimeInHours(0)
        changeTime = 0;
        setCount(0)
    }
    const changeTimesDec = (items: any) => {
        if (items === '15') {
            //setchangeTime(changeTime - 15)
            changeTime = changeTime - 15
            if (changeTime != undefined) {
                var TimeInHour: any = changeTime / 60;
                setTimeInHours(TimeInHour.toFixed(2))
            }

        }
        if (items === '60') {
            //setchangeTime(changeTime - 60)
            changeTime = changeTime - 60
            if (changeTime != undefined) {
                var TimeInHour: any = changeTime / 60;
                setTimeInHours(TimeInHour.toFixed(2))
            }

        }

    }


    const GetTimeSheet = async () => {
        var TimeSheets: any = []

        const web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/SP');

        const res = await web.lists.getById('01A34938-8C7E-4EA6-A003-CEE649E8C67A').items
            .select("Id,Title,TaxType").top(4999).get();
        res.map((item: any) => {
            if (item.TaxType === "TimesheetCategories") {
                TimeSheets.push(item)

            }
        })
        setTimeSheets(TimeSheets)

    }
    const selectCategories = (e: any) => {
        const target = e.target;
        if (target.checked) {
            setcheckCategories(target.value);
        }
    }
    React.useEffect(() => {
        GetTimeSheet();
        GetSmartMetadata();
    }, [updateData])
    // React.useEffect(() => {
    //    getStructureData()
    // }, [AllTimeSheetDataNew])
    var AllMetadata: [] = [];
    const GetSmartMetadata = async () => {
        let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
        let MetaData = [];
        MetaData = await web.lists
            .getByTitle('SmartMetadata')
            .items
            .top(4999)
            .get();
        AllMetadata = MetaData;
        await GetTaskUsers();

    }
   



    var TaskTimeSheetCategoriesGrouping: any = [];
    var TaskTimeSheetCategories: any = [];

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

    const getStructureData = function () {
        $.each(AllTimeSpentDetails, function (index: any, items: any) {
            // if (items.TimesheetTitle.Id === undefined) {
            items.Expanded = true;
            items.isAvailableToDelete = false;
            $.each(AllTimeSpentDetails, function (index: any, val: any) {
                if (val.TimesheetTitle.Id != undefined && val.TimesheetTitle.Id === items.Id) {
                    val.isShifted = true;
                    val.show = true;
                    $.each(val.AdditionalTime, function (index: any, value: any) {
                        value.ParentID = val.Id;
                        value.siteListName = val.__metadata.type;
                        value.MainParentId = item.Id;
                        value.AuthorTitle = val.Author.Title;
                        value.EditorTitle = val.Editor.Title;
                        value.show = true;
                        // if (val.Created != undefined)
                        //  value.TaskTimeCreatedDate = SharewebCommonFactoryService.ConvertLocalTOServerDate(val.Created, 'DD/MM/YYYY HH:mm');
                        // if (val.Modified != undefined)
                        // value.TaskTimeModifiedDate = SharewebCommonFactoryService.ConvertLocalTOServerDate(val.Modified, 'DD/MM/YYYY HH:mm');
                        // 
                        if (!isItemExists(items.AdditionalTime, value.ID))
                            items.AdditionalTime.push(value);


                    })
                    $.each(TaskTimeSheetCategoriesGrouping, function (index: any, items: any) {
                        if (items.Id == NewCategoryId) {
                            items.Childs.push(val);
                        }
                    });
                    //  setAdditionalTime(item.AdditionalTime)


                }
            })
            // }
        })

        AllTimeSpentDetails = $.grep(AllTimeSpentDetails, function (type: any) { return type.isShifted === false });
        $.each(AllTimeSpentDetails, function (index: any, items: any) {
            if (items.AdditionalTime.length === 0) {
                items.isAvailableToDelete = true;
            }
            if (items.AdditionalTime != undefined && items.AdditionalTime.length > 0) {
                $.each(items.AdditionalTime, function (index: any, type: any) {
                    if (type.Id != undefined)
                        type.Id = type.ID;
                })
            }
        });
        $.each(AllTimeSpentDetails, function (index: any, items: any) {
            if (items.AdditionalTime.length > 0) {
                $.each(items.AdditionalTime, function (index: any, val: any) {
                    var NewDate = val.TaskDate;
                    try {
                        getDateForTimeEntry(NewDate, val);
                    } catch (e) { }
                })
            }
        })
        $.each(AllTimeSpentDetails, function (index: any, items: any) {
            if (items.Category.Title === undefined)
                checkCategory(items, 319);
            else
                checkCategory(items, items.Category.Id);
        })
        var IsTimeSheetAvailable = false;
        $.each(TaskTimeSheetCategoriesGrouping, function (index: any, items: any) {
            if (items.Childs.length > 0) {
                IsTimeSheetAvailable = true;
            }
        });

        var AdditionalTimes: any = []

        $.each(TaskTimeSheetCategoriesGrouping, function (index: any, items: any) {

            if (items.Childs != undefined && items.Childs.length > 0) {
                $.each(items.Childs, function (index: any, child: any) {
                    if (child.AdditionalTimeEntry != undefined) {
                        child.AdditionalTime = JSON.parse(child.AdditionalTimeEntry);
                    }
                    if (child.AdditionalTime != undefined && child.AdditionalTime.length > 0) {
                        $.each(child.AdditionalTime, function (index: any, Subchild: any) {
                            if (Subchild != undefined && (!isItemExists(AdditionalTime, Subchild.ID))) {

                                AdditionalTimes.push(Subchild)

                            }


                        })

                    }

                })
            }


        });

        setAdditionalTime(AdditionalTimes)
       setTimeSheet(TaskTimeSheetCategoriesGrouping);
      
       if(TaskStatuspopup==true){
        closeTaskStatusUpdatePoup();
        setupdateData(updateData+1)
       }
      
         
       
        setModalIsTimeOpenToTrue();
     
    }

    const setModalIsTimeOpenToTrue = () => {
        setTimeModalIsOpen(true)
    }
    function TimeCallBack(callBack: any) {

        item.CallBackTimeEntry();

    }


    function getDateForTimeEntry(newDate: any, items: any) {
        var LatestDate = [];
        var getMonth = '';
        var combinedDate = '';
        LatestDate = newDate.split('/');
        switch (LatestDate[1]) {
            case "01":
                getMonth = 'January ';
                break;
            case "02":
                getMonth = 'Febuary ';
                break;
            case "03":
                getMonth = 'March ';
                break;
            case "04":
                getMonth = 'April ';
                break;
            case "05":
                getMonth = 'May ';
                break;
            case "06":
                getMonth = 'June ';
                break;
            case "07":
                getMonth = 'July ';
                break;
            case "08":
                getMonth = 'August ';
                break;
            case "09":
                getMonth = 'September';
                break;
            case "10":
                getMonth = 'October ';
                break;
            case "11":
                getMonth = 'November ';
                break;
            case "12":
                getMonth = 'December ';
                break;
        }
        combinedDate = LatestDate[0] + ' ' + getMonth + ' ' + LatestDate[2];
        var dateE = new Date(combinedDate);
        items.NewestCreated = dateE.setDate(dateE.getDate());
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
    var getSmartMetadataItemsByTaxType = function (metadataItems: any, taxType: any) {
        var Items: any = [];
        $.each(metadataItems, function (index: any, taxItem: any) {
            if (taxItem.TaxType === taxType)
                Items.push(taxItem);
        });
        return Items;
    }

    const EditData = async (item: any) => {
        AllTimeSpentDetails=[]
        TaskTimeSheetCategories = getSmartMetadataItemsByTaxType(AllMetadata, 'TimesheetCategories');
        TaskTimeSheetCategoriesGrouping = TaskTimeSheetCategoriesGrouping.concat(TaskTimeSheetCategories);
        TaskTimeSheetCategoriesGrouping.push({ "__metadata": { "id": "Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(319)", "uri": "https://hhhhteams.sharepoint.com/sites/HHHH/_api/Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(319)", "etag": "\"1\"", "type": "SP.Data.SmartMetadataListItem" }, "Id": 319, "Title": "Others", "siteName": null, "siteUrl": null, "listId": null, "Description1": null, "IsVisible": true, "Item_x005F_x0020_Cover": null, "SmartFilters": null, "SortOrder": null, "TaxType": "TimesheetCategories", "Selectable": true, "ParentID": "ParentID", "SmartSuggestions": false, "ID": 319 });

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
        setEditItem(item.Title);
        var filteres = "Task" + item.siteType + "/Id eq " + item.Id;
        var select = "Id,Title,TaskDate,Created,Modified,TaskTime,Description,SortOrder,AdditionalTimeEntry,AuthorId,Author/Title,Editor/Id,Editor/Title,Category/Id,Category/Title,TimesheetTitle/Id,TimesheetTitle/Title&$expand=Editor,Author,Category,TimesheetTitle&$filter=" + filteres + "";
        var count = 0;
        var allurls = [{ 'Url': "https://hhhhteams.sharepoint.com/sites/HHHH/SP/_api/web/lists/getbyid('464FB776-E4B3-404C-8261-7D3C50FF343F')/items?$select=" + select + "" },
        { 'Url': "https://hhhhteams.sharepoint.com/sites/HHHH/SP/_api/web/lists/getbyid('11d52f95-4231-4852-afde-884d548c7f1b')/items?$select=" + select + "" }]
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
                        // if (AllTimeSpentDetails != undefined && AllTimeSpentDetails > 0) {

                        //     AllTimeSpentDetails.map((val:any)=>{
                        //     if(val.AuthorId===CurntUserId){
                        //         AllTimeSpentDetails.push(val)
                        //     }
                        //     })
    
                        // }
                        //  var AllTimeSpentDetails = data.d.results;
                        let TotalPercentage = 0
                        let TotalHours = 0;
                        let totletimeparentcount = 0;
                        //  let totletimeparentcount = 0;
                        let AllAvailableTitle = [];
                        // TaskTimeSheetCategoriesGrouping.map((val:any)=>{
                        //     (!isItemExists(TaskTimeSheetCategoriesGrouping, val.Id))
            
                        // })
            
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
                            if (NewParentId == item.Id) {
                                item.TimesheetTitle.Title = NewParentTitle;
                                item.TimesheetTitle.Id = NewParentId;
                                item.AdditionalTime = []
                                var update: any = {};
                                update['AuthorName'] = item.Author.Title;
                                // update['AuthorImage'] = item.AuthorImage;
                                update['ID'] = 0;
                                //update['MainParentId'] = item.props.Id;
                                update['ParentID'] = NewParentId;
                                update['TaskTime'] = TimeInHours;
                                update['TaskDate'] = moment(item.Created).format("MMMM Do YYYY");
                                update['Description'] = newData.Description
                                item.AdditionalTime.push(update)
                                let web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/SP');
            
                                await web.lists.getById('464fb776-e4b3-404c-8261-7d3c50ff343f').items.filter("FileDirRef eq '/sites/HHHH/SP/Lists/TaskTimeSheetListNew/Smalsus/Santosh Kumar").getById(NewParentId).update({
            
            
                                    AdditionalTimeEntry: JSON.stringify(item.AdditionalTime),
            
                                }).then((res: any) => {
            
                                    console.log(res);
            
            
                                })
            
                            }
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
        // setAllTimeSpentDetails(AllTimeSpentDetails)
       
    };
    // error: function (error) {
    //     count++;
    //     if (allurls.length === count)
    //         getStructureData();
    // }




const setModalTimmeIsOpenToFalse = () => {
    TimeCallBack(false);
    setTimeModalIsOpen(false)
}
const openexpendTime = () => {
    setcollapseItem(true)
}
const collapseTime = () => {
    setcollapseItem(false)
}
let handleChange = (e: { target: { value: string; }; }, titleName: any) => {
    setSearch(e.target.value.toLowerCase());
    var Title = titleName;
};
const handleTimeOpen = (item: any) => {

    item.show = item.show = item.show === true ? false : true;
    setTimeSheet(TaskTimeSheetCategoriesGrouping => ([...TaskTimeSheetCategoriesGrouping]));
    // setData(data => ([...data]));

};
const sortBy = () => {

    // const copy = data

    // copy.sort((a, b) => (a.Title > b.Title) ? 1 : -1);

    // setTable(copy)

}
const sortByDng = () => {

    // const copy = data

    // copy.sort((a, b) => (a.Title > b.Title) ? -1 : 1);

    // setTable(copy)

}


const deleteTaskTime = async (childinew: any) => {
    var UpdatedData: any = []
    confirm("Are you sure, you want to delete this?")
    $.each(AllTimeSheetDataNew, async function (index: any, items: any) {

        if (items.Childs.length > 0 && items.Childs != undefined) {
            $.each(items.Childs, function (index: any, subItem: any) {
                if (childinew.ParentID == subItem.Id) {
                    if (subItem.AdditionalTime.length > 0 && subItem.AdditionalTime != undefined) {
                        $.each(subItem.AdditionalTime, async function (index: any, NewsubItem: any) {
                            if (NewsubItem != undefined) {
                                if (NewsubItem.ID === childinew.ID)
                                    subItem.AdditionalTime.splice(index, 1)
                            }
                        })
                        UpdatedData = subItem.AdditionalTime
                    }
                }
            })
        }
    })
    setAdditionalTime({ ...AdditionalTime })
    //  setTimeSheet(AllTimeSheetDataNew)

    let web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/SP');

    await web.lists.getById('464fb776-e4b3-404c-8261-7d3c50ff343f').items.filter("FileDirRef eq '/sites/HHHH/SP/Lists/TaskTimeSheetListNew/Smalsus/Santosh Kumar").getById(AdditionalTime[0].ParentID).update({


        AdditionalTimeEntry: JSON.stringify(UpdatedData),

    }).then((res: any) => {

        console.log(res);


    })

}

const UpdateAdditionaltime = async (child: any) => {
    var UpdatedData: any = []
    $.each(saveEditTaskTime, function (index: any, update: any) {
        $.each(update.AdditionalTime, function (index: any, updateitem: any) {
            if (updateitem.ID === child.ID && updateitem.ParentID === child.ParentID) {
                
                updateitem.Id = child.ID;
                updateitem.TaskTime = postData.TaskTime != undefined ? postData.TaskTime : child.TaskTime;
                updateitem.TaskDate = postData.TaskDate != undefined ? postData.TaskDate : child.TaskDate;
                updateitem.Description = postData.Description != undefined ? postData.Description : child.Description;
               

            }
            UpdatedData.push(updateitem)
        })
    });

    let web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/SP');

    await web.lists.getById('464fb776-e4b3-404c-8261-7d3c50ff343f').items.filter("FileDirRef eq '/sites/HHHH/SP/Lists/TaskTimeSheetListNew/Smalsus/Santosh Kumar").getById(child.ParentID).update({


        // TaskDate:postData.TaskDate,
        AdditionalTimeEntry: JSON.stringify(UpdatedData),

    }).then((res: any) => {

        console.log(res);
        closeTaskStatusUpdatePoup2();

    })

}
var NewParentId: any = ''
var NewParentTitle: any = ''
const saveTimeSpent =  async () => {
    var UpdatedData: any = {}
    var smartTermId = "Task" + item.props.siteType + "Id";


    var AddedData: any = []

    if (checkCategories == undefined && checkCategories == undefined) {
        alert("please select category or Title");
        return false;
    }

    $.each(AllUser, function (index: any, taskUser: any) {
        if (taskUser.AssingedToUserId == CurntUserId) {
            UpdatedData['AuthorName'] = taskUser.Title;
            UpdatedData['Company'] = taskUser.Company;
            UpdatedData['UserImage'] = (taskUser.Item_x0020_Cover != undefined && taskUser.Item_x0020_Cover.Url != undefined) ? taskUser.Item_x0020_Cover.Url : '';
        }

    });


    var TimeInHours: any = changeTime / 60;
    TimeInHours = TimeInHours.toFixed(2);



    if (AllTimeSpentDetails == undefined) {
        var AllTimeSpentDetails: any = []
    }
    var TimeListName = 'TaskTimeSheetListNew'
    var Company = 'Smalsus'
    TimeSheet.map((items: any) => {
        if (items.Title == checkCategories) {
            Category = items.Id
        }
    })
    let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");

    let ParentId = await web.lists
        .getById('464fb776-e4b3-404c-8261-7d3c50ff343f')
        .items
        .filter("FileDirRef eq '/sites/HHHH/SP/Lists/TaskTimeSheetListNew/"+ UpdatedData.AuthorName + "/" + UpdatedData.Company)
        .add({
            Title: checkCategories,
            [smartTermId]: item.props.Id,
            CategoryId: Category
        })
    console.log(ParentId)

    let getParentId = await web.lists
        .getById('464fb776-e4b3-404c-8261-7d3c50ff343f')
        .items
        .select("ID,Title,Category/Title,Category/Id")
        .expand("Category")
        .orderBy("ID", false)
        .top(1)
        .get();
    console.log(getParentId);

    NewParentId = getParentId[0].Id;
    NewParentTitle = getParentId[0].Title;
    NewCategoryId = getParentId[0].Category.Id;

   
    //await GetSmartMetadata();

    await EditData(item.props);
    
   
}

const AddTaskTime = async () => {
    var UpdatedData: any = []
    var CurrentUser:any={}
    var TimeInMinute: any = changeTime / 60
    $.each(AllUsers, function (index: any, taskUser: any) {
        if (taskUser.AssingedToUserId === CurntUserId
        ) {
            CurrentUser['AuthorName'] = taskUser.Title;
            CurrentUser['AuthorImage'] = (taskUser.Item_x0020_Cover != undefined && taskUser.Item_x0020_Cover.Url != undefined) ? taskUser.Item_x0020_Cover.Url : '';
        }

    });


    // timeSpentId['ID'] = timeSpentId.ID + 1;


    $.each(AllTimeSheetDataNew, async function (index: any, items: any) {
        if (items.Childs.length > 0 && items.Childs != undefined) {
            $.each(items.Childs, function (index: any, subItem: any) {
                if (subItem.Id == ParentId) {
                    if (subItem.AdditionalTime.length > 0 && subItem.AdditionalTime != undefined) {
                        var timeSpentId = subItem.AdditionalTime[subItem.AdditionalTime.length - 1];
                        $.each(subItem.AdditionalTime, async function (index: any, NewsubItem: any) {
                        })
                        var update: any = {};
                        update['AuthorName'] = CurrentUser.AuthorName;
                        update['AuthorImage'] = CurrentUser.AuthorImage;
                        update['ID'] = timeSpentId.ID + 1;
                        update['MainParentId'] = item.props.Id;
                        update['ParentID'] = ParentId;
                        update['TaskTime'] = TimeInMinute;
                        update['TaskDate'] = postData.TaskDate != undefined ? postData.TaskDate : changeDates;
                        update['Description'] = postData.Description
                        subItem.AdditionalTime.push(update)
                        UpdatedData = subItem.AdditionalTime
                    }
                    else {
                        var update: any = {};
                        update['AuthorName'] = CurrentUser.AuthorName;
                        update['AuthorImage'] = CurrentUser.AuthorImage;
                        update['ID'] = 0;
                        update['MainParentId'] = item.props.Id;
                        update['ParentID'] = ParentId;
                        update['TaskTime'] = TimeInMinute;
                        update['TaskDate'] = postData.TaskDate != undefined ? postData.TaskDate : changeDates;
                        update['Description'] = postData.Description
                        subItem.AdditionalTime.push(update)
                        UpdatedData = subItem.AdditionalTime

                    }
                }
            })
        }
    })

    let web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/SP');
    //let res= await web.lists.getById('464fb776-e4b3-404c-8261-7d3c50ff343f').select("ID,Title").items.filter("FileDirRef eq '/sites/HHHH/SP/Lists/TaskTimeSheetListNew/Smalsus/Santosh Kumar'").top(4999).getAll()
    

    await web.lists.getById('464fb776-e4b3-404c-8261-7d3c50ff343f').items.filter("FileDirRef eq '/sites/HHHH/SP/Lists/TaskTimeSheetListNew/Smalsus/Santosh Kumar'").getById(ParentId).update({


    // TaskDate:postData.TaskDate,
       AdditionalTimeEntry: JSON.stringify(UpdatedData),

   }).then((res: any) => {

        console.log(res);
        closeAddTaskTimepopup();

   })

}

const deleteCategory = (val: any) => {
    confirm("Are you sure, you want to delete this?")
    $.each(AllTimeSheetDataNew, async function (index: any, items: any) {
        if (items.Childs.length > 0 && items.Childs != undefined) {
            $.each(items.Childs, function (index: any, subItem: any) {
                if (subItem.Id == val.Id) {
                    items.Childs.splice(index, 1)

                }
            })
            //({...items.Childs})
        }
    })
}
const SaveCopytime=async (child:any)=>{
    var CurrentUser:any={}
    var TimeInMinute: any = changeTime / 60
    var UpdatedData: any = []
    $.each(AllUsers, function (index: any, taskUser: any) {
        if (taskUser.AssingedToUserId === CurntUserId
        ) {
            CurrentUser['AuthorName'] = taskUser.Title;
            CurrentUser['AuthorImage'] = (taskUser.Item_x0020_Cover != undefined && taskUser.Item_x0020_Cover.Url != undefined) ? taskUser.Item_x0020_Cover.Url : '';
        }

    });
    $.each(AllTimeSheetDataNew, async function (index: any, items: any) {
        if (items.Childs.length > 0 && items.Childs != undefined) {
            $.each(items.Childs, function (index: any, subItem: any) {
                if (subItem.Id == ParentId) {
                    if (subItem.AdditionalTime.length > 0 && subItem.AdditionalTime != undefined) {
                        var timeSpentId = subItem.AdditionalTime[subItem.AdditionalTime.length - 1];
                        $.each(subItem.AdditionalTime, async function (index: any, NewsubItem: any) {
                        })
                        var update: any = {};
                        update['AuthorName'] = CurrentUser.AuthorName;
                        update['AuthorImage'] = CurrentUser.AuthorImage;
                        update['ID'] = timeSpentId.ID + 1;
                        update['MainParentId'] = item.props.Id;
                        update['ParentID'] = child.ParentId;
                        update['TaskTime'] = child.TimeInMinute;
                        update['TaskDate'] = child.TaskDate;
                        update['Description'] = child.Description;
                        subItem.AdditionalTime.push(update)
                        UpdatedData = subItem.AdditionalTime
                    }
                    
                }
            })
        }
    })

    let web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/SP');

    await web.lists.getById('464fb776-e4b3-404c-8261-7d3c50ff343f').items.filter("FileDirRef eq '/sites/HHHH/SP/Lists/TaskTimeSheetListNew"+ UpdatedData.AuthorName + "/" + UpdatedData.Company).getById(child.ParentId).update({


        // TaskDate:postData.TaskDate,
        AdditionalTimeEntry: JSON.stringify(UpdatedData),

    }).then((res: any) => {

        console.log(res);
        closeCopyTaskpopup();

    })
}

return (
    <div>
    <div className="container mt-0 p-0">
        <div className="col-sm-12 p-0">
            <span ng-if="Item!=undefined">

            </span>
            <div className="col-sm-12 p-0 mt-10" ng-form
                role="form">
                <div className="col-sm-12 ps-0 pr-5 TimeTabBox">
                    <a className="hreflink pull-right mt-5 mr-0" onClick={openTaskStatusUpdatePoup}>

                        + Add Time in New Structure
                    </a>

                </div>

            </div>
        </div>

    </div>

    {collapseItem && <div className="togglecontent clearfix">
        <div id="forShowTask" className="pt-0" >
            <div className='Alltable'>
                <div className="col-sm-12 p-0 smart">
                    <div className="section-event">
                        <div className="wrapper">
                            <table className="table table-hover" id="EmpTable" style={{ width: "100%" }}>
                                <thead>
                                    <tr>
                                        <th style={{ width: "2%" }}>
                                            <div></div>
                                        </th>
                                        <th style={{ width: "20%" }}>
                                            <div style={{ width: "19%" }} className="smart-relative">
                                                <input type="search" placeholder="AuthorName" className="full_width searchbox_height" />

                                                <span className="sorticon">
                                                    <span className="up" onClick={sortBy}>< FaAngleUp /></span>
                                                    <span className="down" onClick={sortByDng}>< FaAngleDown /></span>
                                                </span>


                                            </div>
                                        </th>
                                        <th style={{ width: "15%" }}>
                                            <div style={{ width: "16%" }} className="smart-relative">
                                                <input id="searchClientCategory" type="search" placeholder="Date"
                                                    title="Client Category" className="full_width searchbox_height"
                                                    onChange={event => handleChange(event, 'Date')} />
                                                <span className="sorticon">
                                                    <span className="up" onClick={sortBy}>< FaAngleUp /></span>
                                                    <span className="down" onClick={sortByDng}>< FaAngleDown /></span>
                                                </span>
                                            </div>
                                        </th>
                                        <th style={{ width: "15%" }}>
                                            <div style={{ width: "14%" }} className="smart-relative">
                                                <input id="searchClientCategory" type="search" placeholder="Time"
                                                    title="Client Category" className="full_width searchbox_height"
                                                    onChange={event => handleChange(event, 'Time')} />
                                                <span className="sorticon">
                                                    <span className="up" onClick={sortBy}>< FaAngleUp /></span>
                                                    <span className="down" onClick={sortByDng}>< FaAngleDown /></span>
                                                </span>

                                            </div>
                                        </th>
                                        <th style={{ width: "48%" }}>
                                            <div style={{ width: "43%" }} className="smart-relative">
                                                <input id="searchClientCategory" type="search" placeholder="Description"
                                                    title="Client Category" className="full_width searchbox_height"
                                                    onChange={event => handleChange(event, 'Description')} />
                                                <span className="sorticon">
                                                    <span className="up" onClick={sortBy}>< FaAngleUp /></span>
                                                    <span className="down" onClick={sortByDng}>< FaAngleDown /></span>
                                                </span>

                                            </div>
                                        </th>
                                        <th style={{ width: "2%" }}></th>
                                        <th style={{ width: "2%" }}></th>
                                        <th style={{ width: "2%" }}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {AllTimeSheetDataNew != undefined && AllTimeSheetDataNew.length > 0 && AllTimeSheetDataNew.map(function (item, index) {
                                        if (item.Childs != undefined && item.Childs.length > 0) {
                                            return (
                                                <>

                                                    {item.Childs != undefined && item.Childs.length > 0 && (
                                                        <>
                                                            {item.Childs.map(function (childitem: any) {

                                                                return (

                                                                    <>
                                                                        <tr >
                                                                            <td className="p-0" colSpan={9}>
                                                                                <table className="table" style={{ width: "100%" }}>
                                                                                    <tr className="for-c02">
                                                                                        <td style={{ width: "2%" }}>

                                                                                            <div className="sign" onClick={() => handleTimeOpen(childitem)}>{childitem.AdditionalTime.length > 0 && childitem.show ? <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png" />
                                                                                                : <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png" />}
                                                                                            </div>
                                                                                        </td>

                                                                                        <td colSpan={6} style={{ width: "90%" }}>
                                                                                            <span>{item.Title} - {childitem.Title}</span>

                                                                                            <span className="ml5">
                                                                                                <img src='https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/32/edititem.gif' className="button-icon hreflink" title="Edit">
                                                                                                </img>
                                                                                            </span>
                                                                                            <span className="ml5">
                                                                                                <a
                                                                                                    className="hreflink" title="Delete" onClick={() => deleteCategory(childitem)}>
                                                                                                    <img
                                                                                                        src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/32/delete.gif"></img>
                                                                                                </a>
                                                                                            </span>
                                                                                        </td>
                                                                                        <td style={{ width: "8%" }}>
                                                                                            <button type="button"  className="btn btn-primary me-1"

                                                                                                onClick={() => openAddTasktimepopup(childitem)} >
                                                                                                Add Time
                                                                                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 48 48" fill="#fff">
<path fill-rule="evenodd" clip-rule="evenodd" d="M22.8746 14.3436C22.8774 18.8722 22.8262 22.6308 22.7608 22.6962C22.6954 22.7616 18.9893 22.8128 14.525 22.8101C10.0606 22.8073 6.32545 22.8876 6.22467 22.9884C5.99582 23.2172 6.00541 24.6394 6.23742 24.8714C6.33182 24.9658 10.0617 25.0442 14.526 25.0455C18.9903 25.0469 22.6959 25.1009 22.7606 25.1657C22.8254 25.2304 22.8808 28.9921 22.8834 33.5248L22.8884 41.7663L23.9461 41.757L25.0039 41.7476L25.0012 33.3997L24.9986 25.0516L33.2932 25.0542C37.8555 25.0556 41.6431 25.0017 41.7105 24.9343C41.8606 24.7842 41.8537 23.0904 41.7024 22.9392C41.6425 22.8793 37.8594 22.8258 33.2955 22.8204L24.9975 22.8104L24.9925 14.4606L24.9874 6.11084L23.9285 6.11035L22.8695 6.10998L22.8746 14.3436Z" fill="#fff"/>
</svg>
                                                                                            </button>
                                                                                        </td>

                                                                                    </tr>
                                                                                </table>
                                                                            </td>
                                                                        </tr>

                                                                        {childitem.AdditionalTime != undefined && childitem.show && childitem.AdditionalTime.length > 0 && (
                                                                            <>
                                                                                {childitem.AdditionalTime.map(function (childinew: any) {
                                                                                    return (
                                                                                        <>
                                                                                            <tr >
                                                                                                <td className="p-0" colSpan={10}>
                                                                                                    <table className="table" style={{ width: "100%" }}>
                                                                                                        <tr className="tdrow">

                                                                                                            <td colSpan={2} style={{ width: "22%" }}>
                                                                                                                <img className="AssignUserPhoto1 wid29 bdrbox"
                                                                                                                    title="{subchild.AuthorName}"
                                                                                                                    data-toggle="popover"
                                                                                                                    data-trigger="hover"
                                                                                                                    src={childinew.AuthorImage}></img>
                                                                                                                <span className="ml5"> {childinew.AuthorName}</span>
                                                                                                            </td>

                                                                                                            <td style={{ width: "15%" }}>

                                                                                                                {childinew.TaskDate}
                                                                                                            </td>
                                                                                                            <td style={{ width: "15%" }}>
                                                                                                                {childinew.TaskTime}
                                                                                                            </td>
                                                                                                            <td style={{ width: "42%" }}>
                                                                                                                {childinew.Description}
                                                                                                            </td>
                                                                                                            <td style={{ width: "2%" }}>  <a title="Copy" className="hreflink">
                                                                                                                <img
                                                                                                                    src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/32/icon_copy.png" onClick={openCopyTaskpopup}></img>
                                                                                                            </a></td>

                                                                                                            <td style={{ width: "2%" }}>  <a className="hreflink"
                                                                                                            >
                                                                                                                <img
                                                                                                                    src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/32/edititem.gif" onClick={() => openTaskStatusUpdatePoup2(childitem, childinew)}></img>
                                                                                                            </a></td>
                                                                                                            <td style={{ width: "2%" }}>  <a title="Copy" className="hreflink">
                                                                                                                <img style={{ width: "19px" }}
                                                                                                                    src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/32/delete_m.svg" onClick={() => deleteTaskTime(childinew)}></img>
                                                                                                            </a></td>
                                                                                                        </tr>
                                                                                                    </table>
                                                                                                </td>
                                                                                            </tr>
                                                                                            {childinew.AdditionalTime != undefined && childinew.AdditionalTime.length > 0 && (
                                                                                                <>
                                                                                                    {childinew.AdditionalTime.map(function (subchilditem: any) {

                                                                                                        return (

                                                                                                            <>
                                                                                                                <tr >
                                                                                                                    <td className="p-0" colSpan={9}>
                                                                                                                        <table className="table" style={{ width: "100%" }}>
                                                                                                                            <tr className="for-c02">

                                                                                                                                <td colSpan={2} style={{ width: "22%" }}>
                                                                                                                                    <img className="AssignUserPhoto1  bdrbox"
                                                                                                                                        title="{subchilds.AuthorName}"
                                                                                                                                        data-toggle="popover"
                                                                                                                                        data-trigger="hover"
                                                                                                                                        src={subchilditem.AuthorImage}></img>
                                                                                                                                    <span
                                                                                                                                        className="ml5">{subchilditem.AuthorName}</span>
                                                                                                                                </td>

                                                                                                                                <td style={{ width: "15%" }}>
                                                                                                                                    {subchilditem.TaskDate}
                                                                                                                                </td>
                                                                                                                                <td style={{ width: "15%" }}>
                                                                                                                                    {subchilditem.TaskTime}
                                                                                                                                </td>
                                                                                                                                <td style={{ width: "42%" }}>
                                                                                                                                    {subchilditem.Description}</td>
                                                                                                                                <td style={{ width: "2%" }}><a title="Copy" className="hreflink"
                                                                                                                                >
                                                                                                                                    <img
                                                                                                                                        src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/32/icon_copy.png"></img>
                                                                                                                                </a></td>


                                                                                                                                <td style={{ width: "2%" }}>
                                                                                                                                    <a className="hreflink"
                                                                                                                                    >
                                                                                                                                        <img
                                                                                                                                            src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/32/edititem.gif"></img>
                                                                                                                                    </a></td>
                                                                                                                                <td style={{ width: "2%" }}><a title="Copy" className="hreflink"
                                                                                                                                >
                                                                                                                                    <img style={{ width: "19px" }}
                                                                                                                                        src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/32/delete_m.svg"></img>
                                                                                                                                </a></td>
                                                                                                                            </tr>
                                                                                                                        </table>
                                                                                                                    </td>
                                                                                                                </tr>
                                                                                                            </>
                                                                                                        )
                                                                                                    })}
                                                                                                </>
                                                                                            )}


                                                                                        </>
                                                                                    )
                                                                                })}</>
                                                                        )}</>
                                                                )
                                                            })}
                                                        </>
                                                    )}
                                                </>


                                            )
                                        }
                                    })}
                                </tbody>
                            </table>
                            {AllTimeSheetDataNew.length === 0 && <div className="right-col pt-0 MtPb"
                            >
                                No Timesheet Available
                            </div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>}

    <Modal
        isOpen={TaskStatuspopup}
        onDismiss={closeTaskStatusUpdatePoup}
        isBlocking={false}

    >

        <div id="EditGrueneContactSearch">

            <div className="modal-dialog modal-lg">
                <div className="modal-content" ng-cloak>
                <div className="modal-header  mt-1 px-3">
    <h5 className="modal-title" id="exampleModalLabel">  Add Task Time</h5>
    <button onClick={closeTaskStatusUpdatePoup} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
  </div>
                  
                    <div className="modal-body  border m-3 p-3  ">

<div className='row'>
                        <div className="col-sm-9 border-end" >
<div className='mb-3'>
                            <div className=" form-group">
                                <label>Selected Category</label>
                                <input type="text" autoComplete="off"
                                    className="form-control"
                                    name="CategoriesTitle"
                                    value={checkCategories}
                                />
                            </div>
                            </div>
<div className='mb-3'>
                            <div className=" form-group">
                                <label>Title</label>
                                <input type="text" autoComplete="off"
                                    className="form-control" name="TimeTitle"
                                    defaultValue={checkCategories}
                                    onChange={(e) => setNewData({ ...newData, Title: e.target.value })} />
                            </div>
                            </div>
                            <div className='mb-3'>
                            <div className=" form-group">
                                <div className='row'>
                                <div className="col-sm-6">
                                    <div className="date-div">
                                        <div className="Date-Div-BAR">
                                            <span className="href"

                                                id="selectedYear"

                                                ng-click="changeDatetodayQuickly('firstOfMonth','AdditionalnewDate','AdditionalNewDatePicker','','NewEntry')">1st</span>
                                            | <span className="href"

                                                id="selectedYear"

                                                ng-click="changeDatetodayQuickly('fifteenthOfMonth','AdditionalnewDate','AdditionalNewDatePicker','','NewEntry')">15th</span>
                                            | <span className="href"

                                                id="selectedYear"

                                                ng-click="changeDatetodayQuickly('year','AdditionalnewDate','AdditionalNewDatePicker','','NewEntry')">
                                                1
                                                Jan
                                            </span>
                                            |
                                            <span className="href"

                                                id="selectedToday"

                                                ng-click="changeDatetodayQuickly('today','AdditionalnewDate','AdditionalNewDatePicker','','NewEntry')">Today</span>
                                        </div>
                                        <label className="full_width">
                                            Date

                                        </label>
                                        <input type="text"
                                            autoComplete="off"
                                            id="AdditionalNewDatePicker"
                                            className="form-control"
                                            ng-required="true"
                                            placeholder="DD/MM/YYYY"
                                            ng-model="AdditionalnewDate"
                                            defaultValue={changeDates}
                                            onChange={(e) => setNewData({ ...newData, TaskDate: e.target.value })} />

                                    </div>
                                </div>

                                <div className="col-sm-6  session-control-buttons">
                                    <div className='row'>
                                    <div className="col-sm-4 ">
                                        <button id="DayPlus"
                                            className="top-container plus-button plus-minus"
                                            onClick={() => changeDate('Date')}>
                                            <i className="fa fa-plus"
                                                aria-hidden="true">+</i>
                                        </button>
                                        <span className="min-input">Day</span>
                                        <button id="DayMinus"
                                            className="top-container minus-button plus-minus"
                                            onClick={() => changeDateDec('Date')}>
                                            <i className="fa fa-minus"
                                                aria-hidden="true">-</i>
                                        </button>
                                    </div>

                                    <div className="col-sm-4 ">
                                        <button id="MonthPlus"
                                            className="top-container plus-button plus-minus"
                                            onClick={() => changeDate('month')}>
                                            <i className="fa fa-plus"
                                                aria-hidden="true">+</i>
                                        </button>
                                        <span className="min-input">Month</span>
                                        <button id="MonthMinus"
                                            className="top-container minus-button plus-minus"
                                            onClick={() => changeDateDec('month')}>
                                            <i className="fa fa-minus"
                                                aria-hidden="true">-</i>
                                        </button>
                                    </div>

                                    <div
                                        className="col-sm-4 ">
                                        <button id="YearPlus"
                                            className="top-container plus-button plus-minus"
                                            onClick={() => changeDate('Year')}>
                                            <i className="fa fa-plus"
                                                aria-hidden="true">+</i>
                                        </button>
                                        <span className="min-input">Year</span>
                                        <button id="YearMinus"
                                            className="top-container minus-button plus-minus"
                                            onClick={() => changeDateDec('year')}>
                                            <i className="fa fa-minus"
                                                aria-hidden="true">-</i>
                                        </button>
                                    </div>
                                    </div>
                                </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6 ">
                                        <label  ng-bind-html="GetColumnDetails('TimeSpent') | trustedHTML"></label>
                                        <input type="text"
                                            autoComplete="off"
                                            className="form-control"
                                            ng-required="true"
                                            ng-pattern="/^[0-9]+(\.[0-9]{1,2})?$/"
                                            name="timeSpent"
                                            ng-model="TimeSpentInMinutes" ng-change="getInHours(TimeSpentInMinutes)"
                                            defaultValue={item.Title}
                                            onChange={(e) => setNewData({ ...newData, TimeSpentInMinute: e.target.value })} />

                                    </div>
                                    <div
                                        className="col-sm-6  Time-control-buttons">
                                        <div className="pe-0 Quaterly-Time">
                                            <label
                                                className="full_width"></label>
                                            <button className="btn btn-primary"
                                                title="Decrease by 15 Min"
                                                onClick={() => changeTimesDec('15')}>-

                                            </button>
                                            <span> 15min </span>
                                            <button className="btn btn-primary"
                                                title="Increase by 15 Min"
                                                onClick={() => changeTimes('15')}>+

                                            </button>
                                        </div>
                                        <div className="pe-0 Full-Time">
                                            <label
                                                className="full_width"></label>
                                            <button className="btn btn-primary"
                                                title="Decrease by 60 Min"
                                                onClick={() => changeTimesDec('60')}>-

                                            </button>
                                            <span> 60min </span>
                                            <button className="btn btn-primary"
                                                title="Increase by 60 Min"
                                                onClick={() => changeTimes('60')}>+

                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-sm-6">
                                        <label>Time Spent (in hours)</label>
                                        <input className="form-control" type="text" value={TimeInHours}
                                        />
                                    </div>
                                </div>

                              
                                    <div className='col-12'>
                                    <label>Short Description</label>
                                    <textarea className='full-width'
                                        id="AdditionalshortDescription"
                                        cols={15} rows={4}
                                        defaultValue={item.Description}
                                        onChange={(e) => setNewData({ ...newData, Description: e.target.value })}
                                    ></textarea>
                                </div>
                                
                            </div>
                            </div>
                        </div>
                        <div className="col-sm-3">

                            <div className="col mb-2">
                                <div>
                                <a target="_blank"  ng-href="{{pageContext}}/SitePages/SmartMetadata.aspx?TabName=Timesheet">
                                    Manage
                                    Categories
                                </a>
                                </div>
                                {TimeSheet.map((Items: any) => {
                                    return (
                                        <>
                                            <div className="form-check"
                                                id="subcategorytasksPriority{{item.Id}}">
                                                <input 
                                                    id="subcategorytasksPriority{{item.Id}}"
                                                    ng-click="TasksCategories(item)"
                                                    type="radio" className="form-check-input"
                                                    value={Items.Title}
                                                    checked={selectCategories === Items.Title}
                                                    onChange={selectCategories}

                                                    name="taskcategory" />
                                                <label className='form-check-label'>{Items.Title}</label>
                                            </div>
                                        </>
                                    )
                                })}

                            </div>
                        </div>
                        </div>

                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary" onClick={saveTimeSpent}>
                            Submit
                        </button>

                    </div>




                </div>
            </div>
        </div>
    </Modal>
    <Modal
        isOpen={TaskStatuspopup2}
        onDismiss={closeTaskStatusUpdatePoup2}
        isBlocking={false}

    >
        {saveEditTaskTime.map((item: any) => {
            return (
                <>

                    <div id="EditGrueneContactSearch">

                        <div className="modal-dialog" style={{ width: "600px" }} >
                            <div className="modal-content" ng-cloak>
                            <div className="modal-header  mt-1 px-3">
    <h5 className="modal-title" id="exampleModalLabel">  Edit Task Time</h5>
    <button    onClick={closeTaskStatusUpdatePoup2} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
  </div>
                                
                                <div className="modal-body border m-3 p-3">
                                    <div className="col">

                                        <div className="form-group mb-2">
                                            <label>Title</label>
                                            <input type="text" autoComplete="off"
                                                className="form-control" name="TimeTitle"
                                                defaultValue={item.Title}
                                                onChange={(e) => setPostData({ ...postData, Title: e.target.value })} />

                                        </div>
                                        {saveEditTaskTimeChild.map((child: any, index: any) => {
                                            return (
                                                <>

                                                    <div className="col ">
                                                        <div className='row'>
                                                        <div className="col-sm-6 ">
                                                            <div className="date-div">
                                                                <div className="Date-Div-BAR">
                                                                    <span className="href"

                                                                        id="selectedYear"

                                                                        ng-click="changeDatetodayQuickly('firstOfMonth','AdditionalnewDate','AdditionalNewDatePicker','','NewEntry')">1st</span>
                                                                    | <span className="href"

                                                                        id="selectedYear"

                                                                        ng-click="changeDatetodayQuickly('fifteenthOfMonth','AdditionalnewDate','AdditionalNewDatePicker','','NewEntry')">15th</span>
                                                                    | <span className="href"

                                                                        id="selectedYear"

                                                                        ng-click="changeDatetodayQuickly('year','AdditionalnewDate','AdditionalNewDatePicker','','NewEntry')">
                                                                        1
                                                                        Jan
                                                                    </span>
                                                                    |
                                                                    <span className="href"

                                                                        id="selectedToday"

                                                                        ng-click="changeDatetodayQuickly('today','AdditionalnewDate','AdditionalNewDatePicker','','NewEntry')">Today</span>
                                                                </div>
                                                                <label className="full_width">
                                                                    Date

                                                                </label>
                                                                <input type="text"
                                                                    autoComplete="off"
                                                                    id="AdditionalNewDatePicker"
                                                                    className="form-control"
                                                                    ng-required="true"
                                                                    placeholder="DD/MM/YYYY"
                                                                    ng-model="AdditionalnewDate"
                                                                    defaultValue={child.TaskDate}
                                                                    onChange={(e) => setPostData({ ...postData, TaskDate: e.target.value })} />

                                                            </div>
                                                        </div>

                                                        <div className="col-sm-6 session-control-buttons">
                                                            <div className='row'>
                                                            <div className="col-sm-4">
                                                                <button id="DayPlus"
                                                                    className="top-container plus-button plus-minus"
                                                                    onClick={() => changeDate('Date')}>
                                                                    <i className="fa fa-plus"
                                                                        aria-hidden="true">+</i>
                                                                </button>
                                                                <span className="min-input">Day</span>
                                                                <button id="DayMinus"
                                                                    className="top-container minus-button plus-minus"
                                                                    onClick={() => changeDateDec('Date')}>
                                                                    <i className="fa fa-minus"
                                                                        aria-hidden="true">-</i>
                                                                </button>
                                                            </div>

                                                            <div
                                                                className="col-sm-4">
                                                                <button id="MonthPlus"
                                                                    className="top-container plus-button plus-minus"
                                                                    onClick={() => changeDate('month')}>
                                                                    <i className="fa fa-plus"
                                                                        aria-hidden="true">+</i>
                                                                </button>
                                                                <span className="min-input">Month</span>
                                                                <button id="MonthMinus"
                                                                    className="top-container minus-button plus-minus"
                                                                    onClick={() => changeDateDec('month')}>
                                                                    <i className="fa fa-minus"
                                                                        aria-hidden="true">-</i>
                                                                </button>
                                                            </div>

                                                            <div
                                                                className="col-sm-4  ">
                                                                <button id="YearPlus"
                                                                    className="top-container plus-button plus-minus"
                                                                    onClick={() => changeDate('Year')}>
                                                                    <i className="fa fa-plus"
                                                                        aria-hidden="true">+</i>
                                                                </button>
                                                                <span className="min-input">Year</span>
                                                                <button id="YearMinus"
                                                                    className="top-container minus-button plus-minus"
                                                                    onClick={() => changeDateDec('year')}>
                                                                    <i className="fa fa-minus"
                                                                        aria-hidden="true">-</i>
                                                                </button>
                                                            </div>
                                                            </div>
                                                        </div>
                                                        </div>
                                                        <div className="row mb-2">
                                                            <div className="col-sm-6">
                                                                <label
                                                                    ng-bind-html="GetColumnDetails('TimeSpent') | trustedHTML"></label>
                                                                <input type="text"
                                                                    autoComplete="off"
                                                                    className="form-control"
                                                                    ng-required="true"
                                                                    ng-pattern="/^[0-9]+(\.[0-9]{1,2})?$/"
                                                                    name="timeSpent"
                                                                    ng-model="TimeSpentInMinutes" ng-change="getInHours(TimeSpentInMinutes)"
                                                                    defaultValue={changeTime} />

                                                            </div>
                                                            <div
                                                                className="col-sm-6 d-flex justify-content-between align-items-center">
                                                                <div className="Quaterly-Time">
                                                                    <label className="full_width"></label>
                                                                    <button className="btn btn-primary"
                                                                        title="Decrease by 15 Min"
                                                                        onClick={() => changeTimesDec('15')}>-

                                                                    </button>
                                                                    <span> 15min </span>
                                                                    <button className="btn btn-primary"
                                                                        title="Increase by 15 Min"
                                                                        onClick={() => changeTimes('15')}>+

                                                                    </button>
                                                                </div>
                                                                <div className="pe-0 Full-Time">
                                                                    <label
                                                                        className="full_width"></label>
                                                                    <button className="btn btn-primary"
                                                                        title="Decrease by 60 Min"
                                                                        onClick={() => changeTimesDec('60')}>-

                                                                    </button>
                                                                    <span> 60min </span>
                                                                    <button className="btn btn-primary"
                                                                        title="Increase by 60 Min"
                                                                        onClick={() => changeTimes('60')}>+

                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-sm-6 ">
                                                                <label>Time Spent (in hours)</label>
                                                                <input className="form-control" type="text" defaultValue={child.TaskTime}
                                                                    onChange={(e) => setPostData({ ...postData, TaskTime: e.target.value })} />
                                                            </div>
                                                        </div>

                                                        <div className="col-sm-12 ">
                                                            <label>Short Description</label>
                                                            <textarea className='full_width'
                                                                id="AdditionalshortDescription"
                                                                cols={15} rows={4} defaultValue={child.Description
                                                                }
                                                                onChange={(e) => setPostData({ ...postData, Description: e.target.value })}
                                                            ></textarea>
                                                        </div>

                                                    </div>
                                                    <footer>
                                                        <div className='row'>
                                                        <div className="col-sm-6 ">
                                                            <div className="text-left">
                                                                Created
                                                                <span>{child.TaskTimeCreatedDate}</span>
                                                                by <span
                                                                    className="siteColor">{child.AuthorTitle}</span>
                                                            </div>
                                                            <div className="text-left">
                                                                Last modified
                                                                <span>{child.TaskTimeModifiedDate}</span>
                                                                by <span
                                                                    className="siteColor">{child.EditorTitle}</span>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-6 text-end">
                                                            {/* <a target="_blank"
                                                                        ng-if="AdditionalTaskTime.siteListName != 'SP.Data.TasksTimesheet2ListItem'"
                                                                        ng-href="https://hhhhteams.sharepoint.com/sites/HHHH/SP/Lists/TaskTimeSheetListNew/EditForm.aspx?ID={{AdditionalTaskTime.ParentID}}">
                                                                        Open out-of-the-box
                                                                        form
                                                                    </a> */}
                                                            <a target="_blank"
                                                                ng-if="AdditionalTaskTime.siteListName === 'SP.Data.TasksTimesheet2ListItem'"
                                                                href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/Lists/TaskTimeSheetListNew/EditForm.aspx?ID=${child.ParentID}`}>
                                                                Open out-of-the-box
                                                                form
                                                            </a>
                                                            <button type="button" className="btn btn-primary ms-2"
                                                                onClick={(e) => UpdateAdditionaltime(child)}>
                                                                Save
                                                            </button>
                                                        </div>
                                                        </div>
                                                    </footer>
                                                </>
                                            )
                                        })}
                                    </div>



                                </div>





                            </div>
                        </div>
                    </div>
                </>
            )
        })}
    </Modal>
    <Modal
        isOpen={CopyTaskpopup}
        onDismiss={closeCopyTaskpopup}
        isBlocking={false}

    >
        {saveEditTaskTime.map((item: any) => {
            return (
                <>

                    <div id="EditGrueneContactSearch">

                        <div className="modal-dialog" style={{ width: "600px" }}>
                            <div className="modal-content" ng-cloak>
                            <div className="modal-header  mt-1 px-3">
    <h5 className="modal-title" id="exampleModalLabel">  Copy Task Time</h5>
    <button     onClick={closeCopyTaskpopup} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
  </div>
                              
                                <div className="modal-body  border m-3 p-3  ">
                                    <div className="col">

                                        <div className="col-md-12 mb-2">
                                            <label>Title</label>
                                            <input type="text" autoComplete="off"
                                                className="form-control" name="TimeTitle"
                                                defaultValue={item.Title}
                                                onChange={(e) => setPostData({ ...postData, Title: e.target.value })} />

                                        </div>
                                        {saveEditTaskTimeChild.map((child: any, index: any) => {
                                            return (
                                                <>

                                                    <div className="form-group">
                                                        <div className='row'>
                                                        <div className="col-sm-6">
                                                            <div className="date-div">
                                                                <div className="Date-Div-BAR">
                                                                    <span className="href"

                                                                        id="selectedYear"

                                                                        ng-click="changeDatetodayQuickly('firstOfMonth','AdditionalnewDate','AdditionalNewDatePicker','','NewEntry')">1st</span>
                                                                    | <span className="href"

                                                                        id="selectedYear"

                                                                        ng-click="changeDatetodayQuickly('fifteenthOfMonth','AdditionalnewDate','AdditionalNewDatePicker','','NewEntry')">15th</span>
                                                                    | <span className="href"

                                                                        id="selectedYear"

                                                                        ng-click="changeDatetodayQuickly('year','AdditionalnewDate','AdditionalNewDatePicker','','NewEntry')">
                                                                        1
                                                                        Jan
                                                                    </span>
                                                                    |
                                                                    <span className="href"

                                                                        id="selectedToday"

                                                                        ng-click="changeDatetodayQuickly('today','AdditionalnewDate','AdditionalNewDatePicker','','NewEntry')">Today</span>
                                                                </div>
                                                                <label className="full_width">
                                                                    Date

                                                                </label>
                                                                <input type="text"
                                                                    autoComplete="off"
                                                                    id="AdditionalNewDatePicker"
                                                                    className="form-control"

                                                                    placeholder="DD/MM/YYYY"

                                                                    defaultValue={child.TaskDate}
                                                                    onChange={(e) => setPostData({ ...postData, TaskDate: e.target.value })} />

                                                            </div>
                                                        </div>

                                                        <div
                                                            className="col-sm-6 session-control-buttons">
                                                                <div className='row'>
                                                            <div
                                                                className="col-sm-4 ">
                                                                <button id="DayPlus"
                                                                    className="top-container plus-button plus-minus"
                                                                    onClick={() => changeDate('Date')}>
                                                                    <i className="fa fa-plus"
                                                                        aria-hidden="true">+</i>
                                                                </button>
                                                                <span className="min-input">Day</span>
                                                                <button id="DayMinus"
                                                                    className="top-container minus-button plus-minus"
                                                                    onClick={() => changeDateDec('Date')}>
                                                                    <i className="fa fa-minus"
                                                                        aria-hidden="true">-</i>
                                                                </button>
                                                            </div>

                                                            <div
                                                                className="col-sm-4">
                                                                <button id="MonthPlus"
                                                                    className="top-container plus-button plus-minus"
                                                                    onClick={() => changeDate('month')}>
                                                                    <i className="fa fa-plus"
                                                                        aria-hidden="true">+</i>
                                                                </button>
                                                                <span className="min-input">Month</span>
                                                                <button id="MonthMinus"
                                                                    className="top-container minus-button plus-minus"
                                                                    onClick={() => changeDateDec('month')}>
                                                                    <i className="fa fa-minus"
                                                                        aria-hidden="true">-</i>
                                                                </button>
                                                            </div>

                                                            <div className="col-sm-4 ">
                                                                <button id="YearPlus"
                                                                    className="top-container plus-button plus-minus"
                                                                    onClick={() => changeDate('Year')}>
                                                                    <i className="fa fa-plus"
                                                                        aria-hidden="true">+</i>
                                                                </button>
                                                                <span className="min-input">Year</span>
                                                                <button id="YearMinus"
                                                                    className="top-container minus-button plus-minus"
                                                                    onClick={() => changeDateDec('year')}>
                                                                    <i className="fa fa-minus"
                                                                        aria-hidden="true">-</i>
                                                                </button>
                                                            </div>
                                                            </div>
                                                        </div>
                                                        </div>
                                                        <div className="row mb-2">
                                                            <div className="col-sm-6 ">
                                                                <label
                                                                    ng-bind-html="GetColumnDetails('TimeSpent') | trustedHTML"></label>
                                                                <input type="text"
                                                                    autoComplete="off"
                                                                    className="form-control"
                                                                    defaultValue={changeTime} />

                                                            </div>
                                                            <div
                                                                className="col-sm-6 Time-control-buttons">
                                                                <div className="pe-0 Quaterly-Time">
                                                                    <label
                                                                        className="full_width"></label>
                                                                    <button className="btn btn-primary"
                                                                        title="Decrease by 15 Min"
                                                                        onClick={() => changeTimesDec('15')}>-

                                                                    </button>
                                                                    <span> 15min </span>
                                                                    <button className="btn btn-primary"
                                                                        title="Increase by 15 Min"
                                                                        onClick={() => changeTimes('15')}>+

                                                                    </button>
                                                                </div>
                                                                <div className="pe-0 Full-Time">
                                                                    <label
                                                                        className="full_width"></label>
                                                                    <button className="btn btn-primary"
                                                                        title="Decrease by 60 Min"
                                                                        onClick={() => changeTimesDec('60')}>-

                                                                    </button>
                                                                    <span> 60min </span>
                                                                    <button className="btn btn-primary"
                                                                        title="Increase by 60 Min"
                                                                        onClick={() => changeTimes('60')}>+

                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row mb-2">
                                                            <div className="col-sm-6">
                                                                <label>Time Spent (in hours)</label>
                                                                <input className="form-control" type="text" defaultValue={child.TaskTime}
                                                                    onChange={(e) => setPostData({ ...postData, TaskTime: e.target.value })} />
                                                            </div>
                                                        </div>

                                                        <div className="col-sm-12 ">
                                                            <label>Short Description</label>
                                                            <textarea className='full_width'
                                                                id="AdditionalshortDescription"
                                                                cols={15} rows={4} defaultValue={child.Description
                                                                }
                                                                onChange={(e) => setPostData({ ...postData, Description: e.target.value })}
                                                            ></textarea>
                                                        </div>

                                                    </div>
                                                    <footer>
                                                        <div className='row'>
                                                        <div className="col-sm-6 p-0">
                                                            <div className="text-left">
                                                                Created
                                                                <span>{child.TaskTimeCreatedDate}</span>
                                                                by <span
                                                                    className="siteColor">{child.AuthorTitle}</span>
                                                            </div>
                                                            <div className="text-left">
                                                                Last modified
                                                                <span>{child.TaskTimeModifiedDate}</span>
                                                                by <span
                                                                    className="siteColor">{child.EditorTitle}</span>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-6 text-end">
                                                            {/* <a target="_blank"
                                                                        ng-if="AdditionalTaskTime.siteListName != 'SP.Data.TasksTimesheet2ListItem'"
                                                                        ng-href="https://hhhhteams.sharepoint.com/sites/HHHH/SP/Lists/TaskTimeSheetListNew/EditForm.aspx?ID={{AdditionalTaskTime.ParentID}}">
                                                                        Open out-of-the-box
                                                                        form
                                                                    </a> */}
                                                            <a target="_blank"
                                                                ng-if="AdditionalTaskTime.siteListName === 'SP.Data.TasksTimesheet2ListItem'"
                                                                href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/Lists/TaskTimeSheetListNew/EditForm.aspx?ID=${child.ParentID}`}>
                                                                Open out-of-the-box
                                                                form
                                                            </a>
                                                            <button type="button" className="btn btn-primary ms-2"
                                                                onClick={(e) => UpdateAdditionaltime(child)}>
                                                                Save
                                                            </button>
                                                        </div>
                                                        </div>
                                                    </footer>
                                                </>
                                            )
                                        })}
                                    </div>



                                </div>





                            </div>
                        </div>
                    </div>
                </>
            )
        })}
    </Modal>
    <Modal
        isOpen={AddTaskTimepopup}
        onDismiss={closeAddTaskTimepopup}
        isBlocking={false}

    >


        <div id="EditGrueneContactSearch">

            <div className="modal-dialog" style={{ width: "600px" }}>
                <div className="modal-content" ng-cloak>
                    <div className="modal-header mt-1 px-3">
                        <h5 className="modal-title">
                            Add Additional Time
                        </h5>
                        <button type="button" style={{ minWidth: "10px", marginTop: "-21px;", opacity: "1" }} className="close" data-dismiss="modal"
                            onClick={closeAddTaskTimepopup}>
                            &times;
                        </button>
                    </div>
                    <div className="modal-body  border m-3 p-3  ">



                        <div className="col-sm-12">
                            <div className="col-sm-12 p-0 form-group">
                                <div className='row'>
                                <div className="col-sm-6">
                                    <div className="date-div">
                                        <div className="Date-Div-BAR">
                                            <span className="href"

                                                id="selectedYear"

                                                ng-click="changeDatetodayQuickly('firstOfMonth','AdditionalnewDate','AdditionalNewDatePicker','','NewEntry')">1st</span>
                                            | <span className="href"

                                                id="selectedYear"

                                                ng-click="changeDatetodayQuickly('fifteenthOfMonth','AdditionalnewDate','AdditionalNewDatePicker','','NewEntry')">15th</span>
                                            | <span className="href"

                                                id="selectedYear"

                                                ng-click="changeDatetodayQuickly('year','AdditionalnewDate','AdditionalNewDatePicker','','NewEntry')">
                                                1
                                                Jan
                                            </span>
                                            |
                                            <span className="href"

                                                id="selectedToday"

                                                ng-click="changeDatetodayQuickly('today','AdditionalnewDate','AdditionalNewDatePicker','','NewEntry')">Today</span>
                                        </div>
                                        <label className="full_width">
                                            Date

                                        </label>
                                        <input type="text"
                                            autoComplete="off"
                                            id="AdditionalNewDatePicker"
                                            className="form-control"
                                            ng-required="true"
                                            placeholder="DD/MM/YYYY"
                                            ng-model="AdditionalnewDate"
                                            defaultValue={changeDates}
                                            onChange={(e) => setPostData({ ...postData, TaskDate: e.target.value })} />

                                    </div>
                                </div>

                                <div
                                    className="col-sm-6 session-control-buttons">
                                        <div className='row'>
                                    <div
                                        className="col-sm-4 ">
                                        <button id="DayPlus"
                                            className="top-container plus-button plus-minus"
                                            onClick={() => changeDate('Date')}>
                                            <i className="fa fa-plus"
                                                aria-hidden="true">+</i>
                                        </button>
                                        <span className="min-input">Day</span>
                                        <button id="DayMinus"
                                            className="top-container minus-button plus-minus"
                                            onClick={() => changeDateDec('Date')}>
                                            <i className="fa fa-minus"
                                                aria-hidden="true">-</i>
                                        </button>
                                    </div>

                                    <div
                                        className="col-sm-4 ">
                                        <button id="MonthPlus"
                                            className="top-container plus-button plus-minus"
                                            onClick={() => changeDate('month')}>
                                            <i className="fa fa-plus"
                                                aria-hidden="true">+</i>
                                        </button>
                                        <span className="min-input">Month</span>
                                        <button id="MonthMinus"
                                            className="top-container minus-button plus-minus"
                                            onClick={() => changeDateDec('month')}>
                                            <i className="fa fa-minus"
                                                aria-hidden="true">-</i>
                                        </button>
                                    </div>

                                    <div
                                        className="col-sm-4">
                                        <button id="YearPlus"
                                            className="top-container plus-button plus-minus"
                                            onClick={() => changeDate('Year')}>
                                            <i className="fa fa-plus"
                                                aria-hidden="true">+</i>
                                        </button>
                                        <span className="min-input">Year</span>
                                        <button id="YearMinus"
                                            className="top-container minus-button plus-minus"
                                            onClick={() => changeDateDec('year')}>
                                            <i className="fa fa-minus"
                                                aria-hidden="true">-</i>
                                        </button>
                                    </div>
                                    </div>
                                </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-sm-6">
                                        <label
                                            ng-bind-html="GetColumnDetails('TimeSpent') | trustedHTML"></label>
                                        <input type="text"
                                            autoComplete="off"
                                            className="form-control"
                                            defaultValue={changeTime} onChange={(e) => setPostData({ ...postData, TaskTime: e.target.value })} />

                                    </div>
                                    <div
                                        className="col-sm-6  Time-control-buttons">
                                        <div className="pe-0 Quaterly-Time">
                                            <label
                                                className="full_width"></label>
                                            <button className="btn btn-primary"
                                                title="Decrease by 15 Min"
                                                onClick={() => changeTimesDec('15')}>-

                                            </button>
                                            <span> 15min </span>
                                            <button className="btn btn-primary"
                                                title="Increase by 15 Min"
                                                onClick={() => changeTimes('15')}>+

                                            </button>
                                        </div>
                                        <div className="pe-0 Full-Time">
                                            <label
                                                className="full_width"></label>
                                            <button className="btn btn-primary"
                                                title="Decrease by 60 Min"
                                                onClick={() => changeTimesDec('60')}>-

                                            </button>
                                            <span> 60min </span>
                                            <button className="btn btn-primary"
                                                title="Increase by 60 Min"
                                                onClick={() => changeTimes('60')}>+

                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-12 p-0 form-group">
                                    <div className="col-sm-6">
                                        <label>Time Spent (in hours)</label>
                                        <input className="form-control" type="text"
                                            value={TimeInHours} />
                                    </div>
                                </div>

                                <div className="col-sm-12 p-0">
                                    <label>Short Description</label>
                                    <textarea className='full_width'
                                        id="AdditionalshortDescription"
                                        cols={15} rows={4}

                                        onChange={(e) => setPostData({ ...postData, Description: e.target.value })}
                                    ></textarea>
                                </div>

                            </div>
                            <footer>
                                <div className='row'>
                                <div className="col-sm-6 ">
                                    <div className="text-left">
                                        Created
                                        <span></span>
                                        by <span
                                            className="siteColor"></span>
                                    </div>
                                    <div className="text-left">
                                        Last modified
                                        <span></span>
                                        by <span
                                            className="siteColor"></span>
                                    </div>
                                </div>
                                <div className="col-sm-6 text-end">

                                    <button type="button" className="btn btn-primary ms-2"
                                        onClick={AddTaskTime}>
                                        Save
                                    </button>
                                </div>
                                </div>
                            </footer>

                        </div>



                    </div>





                </div>
            </div>
        </div>

    </Modal>
</div>
)
}

export default TimeEntryPopup;