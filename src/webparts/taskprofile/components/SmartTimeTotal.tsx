import { styled } from 'office-ui-fabric-react';
import * as React from 'react';
import { Web } from "sp-pnp-js";
import TimeEntry from './TimeEntry';
var AllUsers: any = [];
var AllTimeSpentDetails: any = [];
let AllAvailableTitle: any = [];
var TaskCate: any = []
const SmartTimeTotalFunction = (item: any) => {
    var TaskTimeSheetCategoriesGrouping: any = [];
    var TaskTimeSheetCategories: any = [];
    const [AllUser, setAllUser] = React.useState([])
    const [isTimeEntry, setisTimeEntry] = React.useState(false);
    const [timeEntry, setTimeEntry] = React.useState(null);
    const [smartTimeTotal, setsmartTimeTotal] = React.useState(0);
    const [additionalTime, setAdditionalTime] = React.useState([]);
    const [AllTimeSheetDataNew, setTimeSheet] = React.useState([]);



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
        $.each(TaskTimeSheetCategoriesGrouping, function (index: any, categoryTitle: any) {
            categoryTitle.Childs = [];
            categoryTitle.Expanded = true;
            categoryTitle.flag = true;

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
        }
        else if (item.props.sitePage == "SH") {
            var allurls = [{
                'Url': `${item.props.siteUrl}/_api/web/lists/getbyTitle('TaskTimesheet')/items?$select= ${select}`
            }]

        }
        else {
            var allurls = [{ 'Url': "https://hhhhteams.sharepoint.com/sites/HHHH/SP/_api/web/lists/getbyid('464FB776-E4B3-404C-8261-7D3C50FF343F')/items?$select=" + select + "" },
                //{ 'Url': `${item.props.siteUrl}/_api/web/lists/getbyTitle('TaskTimesheet')/items?$select= ${select}`}
            ]
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
                    if (data.d.results != undefined && data.d.results.length > 0) {

                        AllTimeSpentDetails = AllTimeSpentDetails.concat(data.d.results);
                        // AllTimeSpentDetails.map((items:any)=>{
                        //    if(items.AdditionalTimeEntry!=null){
                        //     item.AdditionalTime = JSON.parse(item.AdditionalTimeEntry)
                        //     setTimeEntry(items);
                        //    } 
                        // })

                    }
                    if (allurls.length === count) {
                        let totletimeparentcount = 0;
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

                                    item.TaskTime = TimeInHours.toFixed(2);
                                }
                            } else {
                                AllAvailableTitle.push(item);
                            }

                            if (item.AdditionalTime === undefined) {
                                item.AdditionalTime = [];
                            }

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
        TaskCate = AllTimeSpentDetails
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

                                if (val.Modified != undefined)



                                    if (!isItemExists(items.AdditionalTime, value.ID))
                                        items.AdditionalTime.push(value);
                        })
                    }
                })
            }
        })
        // Smart total time code   get code
        var TotalTime = 0.0;

        AllTimeSpentDetails = $.grep(AllTimeSpentDetails, function (type: any) {
            type.AdditionalTime1 = JSON.parse(type.AdditionalTimeEntry);
            if (type.AdditionalTime != undefined && type.AdditionalTime.length > 0) {

                $.each(type.AdditionalTime, function (index: any, time: any) {
                    TotalTime = TotalTime + parseFloat(time.TaskTime);

                })

                type.totalTimeSpend = TotalTime;
                setsmartTimeTotal(TotalTime);
            }
            return type.isShifted === true
        });

        console.log(timeEntry);
        let newArray: any = [];
        let hoversmartArray: any = [];
        AllTimeSpentDetails.map((items: any) => {
            items.AdditionalTime1.map((item: any) => {
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
                        child.additionaltime2.push(items.additionaltime2[0])
                        parentfound = true;
                    }
                })
                if (parentfound == false) {
                    newArray.push(items);
                }
            }
        })

        setTimeEntry(newArray)
        console.log(newArray);

        if (newArray.length > 0) {
            newArray.map((items: any) => {
                var hoverTime = 0;
                if (items.additionaltime2.length > 0) {
                    $.each(items.additionaltime2, function (index: any, time: any) {
                        hoverTime = hoverTime + parseFloat(time.TaskTime);
                    })
                }
                items.hoverTime = hoverTime;
            })
        }
        setAdditionalTime(newArray)
        setTimeSheet(TaskTimeSheetCategoriesGrouping);
    }

    const OpenTimeEntry = () => {
        setisTimeEntry(true)
    }
    const CallBackTimesheet = () => {
        setisTimeEntry(false)
        AllTimeSpentDetails = [];
        GetSmartMetadata();
    }
    return (
        <>

            {console.log(timeEntry)}
            {console.log(AllAvailableTitle)}
            {console.log(additionalTime)}
            {smartTimeTotal.toFixed(1)}
            <span className='openhoverpopup hoverimg'>
            <span className="svg__iconbox svg__icon--clock" onClick={OpenTimeEntry}></span>

                {/* <img className='ms-1' src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/clock-gray.png" style={{ width: "22px" }} />
 */}

                <div className='hoverpopup overlay'>
                    <div className='hoverpopuptitle'>{item.props.Title}</div>
                    <div className='hoverpopupbody'>
                        <table className='table mb-0'>
                            <tbody>
                                {additionalTime.length > 0 && additionalTime.map((items: any) => {
                                    return (
                                        <>
                                            <tr className='for-c0l'>
                                                <td style={{ width: "20%" }}>
                                                    <img style={{ width: "30px" }} src={items.AuthorImage}></img>
                                                </td>
                                                <td style={{ width: "80%" }} colSpan={2}><span className='px-2'>Total- Time</span>{items.hoverTime}</td>
                                            </tr>

                                            {items?.additionaltime2?.length > 0 && items?.additionaltime2?.map((details: any) => {
                                                return (
                                                    <>       <tr>
                                                        <td style={{ width: "20%" }}>{details.TaskDate}</td>
                                                        <td style={{ width: "10%" }}>{details?.TaskTime}</td>
                                                        <td style={{ width: "70%" }}>{details.Description}</td>
                                                    </tr>
                                                    </>
                                                )
                                            })}
                                        </>
                                    )
                                }
                                )}
                            </tbody>
                        </table>
                    </div> </div>
            </span>
            {isTimeEntry ? <TimeEntry data={item.props} isopen={isTimeEntry} CallBackTimesheet={() => { CallBackTimesheet() }} /> : ''}
        </>
    )
}
export default SmartTimeTotalFunction;