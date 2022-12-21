import { Modal } from 'office-ui-fabric-react';
import * as React from 'react';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { Web } from "sp-pnp-js";
import * as moment from 'moment';


function TimeEntryPopup(item: any) {
    const [AllTimeSheetDataNew, setTimeSheet] = React.useState([])
    const [modalTimeIsOpen, setTimeModalIsOpen] = React.useState(false);
    // const [AllMetadata, setMetadata] = React.useState([]);
    const [EditTaskItemitle, setEditItem] = React.useState('');
    const [collapseItem, setcollapseItem] = React.useState(true);
    const [search, setSearch]: [string, (search: string) => void] = React.useState("");
    const [TaskStatuspopup, setTaskStatuspopup] = React.useState(false);
    const [TimeSheet, setTimeSheets] = React.useState([])
    const [changeDates, setchangeDates] = React.useState(moment().format('MMMM Do YYYY'))
    const [changeTime, setchangeTime] = React.useState(0)
    const [count, setCount] = React.useState(1)
    const [month, setMonth] = React.useState(1)

    const [year, setYear] = React.useState(1)
    const [TimeInHours, setTimeInHours] = React.useState(0)

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
    const changeDate = (item: any) => {


        if (item == 'Date') {
            setCount(count + 1)
            setchangeDates(moment().add(count, 'days').format("MMMM Do YYYY"))
        }
        if (item == 'month') {
            setMonth(month + 1)
            setchangeDates(moment().add(month, 'months').format("MMMM Do YYYY"))
        }
        if (item == 'Year') {
            setYear(year + 1)
            setchangeDates(moment().add(year, 'years').format("MMMM Do YYYY"))
        }
    }
    const changeDateDec = (item: any) => {


        if (item == 'Date') {
            setCount(count - 1)
            setchangeDates(moment().add(count, 'days').format("MMMM Do YYYY"))
        }
        if (item == 'month') {
            setMonth(month - 1)
            setchangeDates(moment().add(month, 'months').format("MMMM Do YYYY"))
        }
        if (item == 'Year') {
            setYear(year - 1)
            setchangeDates(moment().add(year, 'years').format("MMMM Do YYYY"))
        }
    }
    const changeTimes = (items: any) => {
        if (items == '15') {
            setchangeTime(changeTime + 15)

            if (changeTime != undefined) {
                var TimeInHour: any = changeTime / 60;
                setTimeInHours(TimeInHour.toFixed(2))

            }

        }
        if (items == '60') {
            setchangeTime(changeTime + 60)
            if (changeTime != undefined) {
                var TimeInHour: any = changeTime / 60;
                setTimeInHours(TimeInHour.toFixed(2))
            }

        }

    }
    const openTaskStatusUpdatePoup = () => {
        setTaskStatuspopup(true)
    }
    const closeTaskStatusUpdatePoup = () => {
        setTaskStatuspopup(false)
    }
    const changeTimesDec = (items: any) => {
        if (items == '15') {
            setchangeTime(changeTime - 15)
            if (changeTime != undefined) {
                var TimeInHour: any = changeTime / 60;
                setTimeInHours(TimeInHour.toFixed(2))
            }

        }
        if (items == '60') {
            setchangeTime(changeTime - 60)
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
            if (item.TaxType == "TimesheetCategories") {
                TimeSheets.push(item)

            }
        })
        setTimeSheets(TimeSheets)

    }
    React.useEffect(() => {
        GetTimeSheet();
        GetSmartMetadata();
    }, [])
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
    var AllUsers: [] = [];



    var TaskTimeSheetCategoriesGrouping: any = [];
    var TaskTimeSheetCategories: any = [];
    var AllTimeSpentDetails: any = [];
    var isItemExists = function (arr: any, Id: any) {
        var isExists = false;
        $.each(arr, function (index: any, item: any) {
            if (item.Id == Id) {
                isExists = true;
                return false;
            }
        });
        return isExists;
    }
    const checkCategory = function (item: any, category: any) {
        $.each(TaskTimeSheetCategoriesGrouping, function (index: any, categoryTitle: any) {
            if (categoryTitle.Id == category) {
                // item.isShow = true;
                if (categoryTitle.Childs.length == 0) {
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
        $.each(AllTimeSpentDetails, function (index: any, item: any) {
            if (item.TimesheetTitle.Id == undefined) {
                item.Expanded = true;
                item.isAvailableToDelete = false;
                $.each(AllTimeSpentDetails, function (index: any, val: any) {
                    if (val.TimesheetTitle.Id != undefined && val.TimesheetTitle.Id == item.Id) {
                        val.isShifted = true;
                        val.show = true;
                        $.each(val.AdditionalTime, function (index: any, value: any) {
                            value.ParentID = val.Id;
                            value.siteListName = val.__metadata.type;
                            value.MainParentId = item.Id;
                            value.AuthorTitle = val.Author.Title;
                            value.EditorTitle = val.Editor.Title;
                            value.show = true;
                            if (val.Created != undefined)
                                //  value.TaskTimeCreatedDate = SharewebCommonFactoryService.ConvertLocalTOServerDate(val.Created, 'DD/MM/YYYY HH:mm');
                                if (val.Modified != undefined)
                                    // value.TaskTimeModifiedDate = SharewebCommonFactoryService.ConvertLocalTOServerDate(val.Modified, 'DD/MM/YYYY HH:mm');
                                    item.AdditionalTime.push(value);
                        })

                    }
                })
            }
        })
        AllTimeSpentDetails = $.grep(AllTimeSpentDetails, function (type: any) { return type.isShifted == false });
        $.each(AllTimeSpentDetails, function (index: any, item: any) {
            if (item.AdditionalTime.length == 0) {
                item.isAvailableToDelete = true;
            }
            if (item.AdditionalTime != undefined && item.AdditionalTime.length > 0) {
                $.each(item.AdditionalTime, function (index: any, type: any) {
                    if (type.Id != undefined)
                        type.Id = type.ID;
                })
            }
        });
        $.each(AllTimeSpentDetails, function (index: any, item: any) {
            if (item.AdditionalTime.length > 0) {
                $.each(item.AdditionalTime, function (index: any, val: any) {
                    var NewDate = val.TaskDate;
                    try {
                        getDateForTimeEntry(NewDate, val);
                    } catch (e) { }
                })
            }
        })
        $.each(AllTimeSpentDetails, function (index: any, item: any) {
            if (item.Category.Title == undefined)
                checkCategory(item, 319);
            else
                checkCategory(item, item.Category.Id);
        })
        var IsTimeSheetAvailable = false;
        $.each(TaskTimeSheetCategoriesGrouping, function (index: any, item: any) {
            if (item.Childs.length > 0) {
                IsTimeSheetAvailable = true;
            }
        });
        setTimeSheet(TaskTimeSheetCategoriesGrouping);
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
                if (item.ParentID == 0 && item.Id == val.ParentID) {
                    val.ParentType = item.Title;
                }
            })
        })
        $.each(TaskTimeSheetCategoriesGrouping, function (index: any, item: any) {
            $.each(TaskTimeSheetCategoriesGrouping, function (index: any, val: any) {
                if (item.ParentID == 0 && item.Id == val.ParentID) {
                    val.ParentType = item.Title;
                }
            })
        })
    }
    var getSmartMetadataItemsByTaxType = function (metadataItems: any, taxType: any) {
        var Items: any = [];
        $.each(metadataItems, function (index: any, taxItem: any) {
            if (taxItem.TaxType == taxType)
                Items.push(taxItem);
        });
        return Items;
    }

    const EditData = (item: any) => {
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
        $.each(allurls, function (index: any, item: any) {
            $.ajax({

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
                    if (allurls.length == count) {
                        //  var AllTimeSpentDetails = data.d.results;
                        let TotalPercentage = 0
                        let TotalHours = 0;
                        let totletimeparentcount = 0;
                        //  let totletimeparentcount = 0;
                        let AllAvailableTitle = [];
                        $.each(AllTimeSpentDetails, function (index: any, item: any) {
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
                                        //$scope.AdditionalTimeSpent.push(item.AdditionalTime[0]);
                                    } catch (e) {
                                        console.log(e)
                                    }
                                }

                                $.each(AllUsers, function (index: any, taskUser: any) {
                                    if (taskUser.AssingedToUserId == item.AuthorId) {
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

                            if (item.AdditionalTime == undefined) {
                                item.AdditionalTime = [];
                            }
                            // item.ServerTaskDate = angular.copy(item.TaskDate);
                            // item.TaskDate = SharewebCommonFactoryService.ConvertLocalTOServerDate(item.TaskDate, 'DD/MM/YYYY');
                            item.isShifted = false;

                        })
                        getStructureData();
                    }

                },
                error: function (error) {
                    count++;
                    if (allurls.length == count)
                        getStructureData();
                }
            })
        })
    }
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

        item.show = item.show = item.show == true ? false : true;
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
    function AddItem() {
    }
    // function AddItem() {
    //     var MyData = JSON.stringify({
    //         '__metadata': {
    //             'type': 'SP.Data.Master_x0020_TasksListItem'
    //         },
    //         "Title": Title,
    //         "Item_x0020_Type": itemType,
    //         "Portfolio_x0020_Type": 'Component'
    //     })
    //     $.ajax({
    //         url: "https://hhhhteams.sharepoint.com/sites/HHHH/SP/_api/contextinfo",
    //         type: "POST",
    //         headers: {
    //             "Accept": "application/json;odata=verbose"
    //         },
    //         success: function (contextData: any) {
    //             $.ajax({
    //                 url: "https://hhhhteams.sharepoint.com/sites/HHHH/SP/_api/web/lists/getbyid('ec34b38f-0669-480a-910c-f84e92e58adf')/items",
    //                 method: "POST",
    //                 contentType: "application/json;odata=verbose",
    //                 data: MyData,
    //                 async: false,
    //                 headers: {
    //                     "Accept": "application/json;odata=verbose",
    //                     "X-RequestDigest": contextData.d.GetContextWebInformation.FormDigestValue,
    //                     "IF-MATCH": "*",
    //                     "X-HTTP-Method": "POST"
    //                 },
    //                 success: function (data: any) {
    //                     alert('success');
    //                     setModalIsOpenToFalse();
    //                     window.location.reload();
    //                 },
    //                 error: function (jqXHR: any, textStatus: any, errorThrown: any) {
    //                     alert('error');
    //                 }
    //             });
    //         },
    //         error: function (jqXHR: any, textStatus: any, errorThrown: any) {
    //             alert('error');
    //         }
    //     });


    // }


    return (
        <div>
            <div className="container mt-0 pad0">
                <div className="col-sm-12 pad0">
                    <span ng-if="Item!=undefined">

                    </span>
                    <div className="col-sm-12 pad0 mt-10" ng-form
                        role="form">
                        <div className="col-sm-12 padL-0 pr-5 TimeTabBox">
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
                        <div className="col-sm-12 pad0 smart">
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
                                                                                    <td className="pad0" colSpan={9}>
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
                                                                                                            className="hreflink" title="Delete">
                                                                                                            <img
                                                                                                                src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/32/delete.gif"></img>
                                                                                                        </a>
                                                                                                    </span>
                                                                                                </td>
                                                                                                <td style={{ width: "8%" }}>
                                                                                                    <button type="button"
                                                                                                        className="btn btn-primary pull-right mt-5 mr-0"

                                                                                                    >
                                                                                                        Add Time
                                                                                                        <img className="button-icon hreflink" style={{ width: "24px" }}
                                                                                                            src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/CreateComponentIcon.png" ></img>
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
                                                                                                        <td className="pad0" colSpan={10}>
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
                                                                                                                            src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/32/icon_copy.png"></img>
                                                                                                                    </a></td>

                                                                                                                    <td style={{ width: "2%" }}>  <a className="hreflink"
                                                                                                                    >
                                                                                                                        <img
                                                                                                                            src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/32/edititem.gif"></img>
                                                                                                                    </a></td>
                                                                                                                    <td style={{ width: "2%" }}>  <a title="Copy" className="hreflink">
                                                                                                                        <img style={{ width: "19px" }}
                                                                                                                            src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/32/delete_m.svg"></img>
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
                                                                                                                            <td className="pad0" colSpan={9}>
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
                                    {AllTimeSheetDataNew.length == 0 && <div className="right-col pt-0 MtPb"
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
                isBlocking={false}  >

                <div>

                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-heade">
                                <h3 className="modal-title">
                                    Add Task Time
                                </h3>
                                <button type="button" style={{ minWidth: "10px" }} className="close" data-dismiss="modal"
                                    onClick={closeTaskStatusUpdatePoup}>
                                    &times;
                                </button>
                            </div>
                            <div className="modal-body bg-f5f5 clearfix">


                                <div className="col-sm-9"
                                    style={{ borderRight: "1px solid #dfdfdf" }}>

                                    <div className="col-sm-12 pad0 form-group">
                                        <label>Selected Category</label>
                                        <input type="text" autoComplete="off"
                                            className="form-control"
                                            name="CategoriesTitle"
                                            ng-model="SelectedCategoriesTitle"
                                        />
                                    </div>

                                    <div className="col-sm-12 mt-5 pad0 form-group">
                                        <label>Title</label>
                                        <input type="text" autoComplete="off"
                                            className="form-control" name="TimeTitle"
                                            ng-model="TimeTitle" />
                                    </div>
                                    <div className="col-sm-12 pad0 form-group">
                                        <div className="col-sm-6 padL-0">
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
                                                    value={changeDates} />

                                            </div>
                                        </div>

                                        <div
                                            className="col-sm-6 pad0 session-control-buttons">
                                            <div
                                                className="col-sm-4 padL-0 form-container">
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
                                                className="col-sm-4 padL-0 form-container">
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
                                                className="col-sm-4 padL-0 form-container">
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

                                        <div className="col-sm-12 pad0 form-group">
                                            <div className="col-sm-6 padL-0">
                                                <label
                                                    ng-bind-html="GetColumnDetails('TimeSpent') | trustedHTML"></label>
                                                <input type="text"
                                                    autoComplete="off"
                                                    className="form-control"
                                                    ng-required="true"
                                                    ng-pattern="/^[0-9]+(\.[0-9]{1,2})?$/"
                                                    name="timeSpent"
                                                    ng-model="TimeSpentInMinutes" ng-change="getInHours(TimeSpentInMinutes)"
                                                    value={changeTime} />
                                                <span className="required"
                                                    ng-show="ItemForm.timespent.$error.pattern">
                                                    Not

                                                    a valid number!
                                                </span>
                                            </div>
                                            <div
                                                className="col-sm-6 pad0 Time-control-buttons">
                                                <div className="padR-0 Quaterly-Time">
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
                                                <div className="padR-0 Full-Time">
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
                                        <div className="col-sm-12 pad0 form-group">
                                            <div className="col-sm-6 padL-0">
                                                <label>Time Spent (in hours)</label>
                                                <input className="form-control" type="text" value={TimeInHours} />
                                            </div>
                                        </div>

                                        <div className="col-sm-12 pad0">
                                            <label>Short Description</label>
                                            <textarea
                                                id="AdditionalshortDescription"
                                                cols={15} rows={4}
                                            ></textarea>
                                        </div>

                                    </div>
                                </div>
                                <div className="col-sm-3 pad0">

                                    <div className="col-sm-12">

                                        <a target="_blank" className="mb-5"
                                            ng-href="{{pageContext}}/SitePages/SmartMetadata.aspx?TabName=Timesheet">
                                            Manage
                                            Categories
                                        </a>
                                        {TimeSheet.map((Items: any) => {
                                            return (
                                                <>


                                                    <span className="col-sm-12"
                                                        id="subcategorytasksPriority{{item.Id}}"
                                                    >
                                                        <input
                                                            id="subcategorytasksPriority{{item.Id}}"
                                                            ng-click="TasksCategories(item)"
                                                            type="radio" className="mt-0"
                                                            value='{{item.Id}}'
                                                            name="taskcategory" />
                                                        <label>{Items.Title}</label>
                                                    </span>
                                                </>
                                            )
                                        })}

                                    </div>
                                </div>

                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" ng-click="saveTaskStatusUpdatePoup()">
                                    Submit
                                </button>

                            </div>




                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
export default TimeEntryPopup;