
import * as moment from 'moment';
import { Modal, Panel, PanelType } from 'office-ui-fabric-react';
import * as React from 'react';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { Web } from "sp-pnp-js";
import TimeEntryPopup from '../../globalComponents/EditTaskPopup/TimeEntryComponent';

function DisplayTimeEntry(item: any) {
    const [AllTimeSheetDataNew, setTimeSheet] = React.useState([])
    const [modalTimeIsOpen, setTimeModalIsOpen] = React.useState(false);
    // const [AllMetadata, setMetadata] = React.useState([]);
    const [EditTaskItemitle, setEditItem] = React.useState('');
    const [collapseItem, setcollapseItem] = React.useState(true);
    const [TaskEntrypopup, setTaskEntrypopup] = React.useState(true);


    // var TaskTimeSheetCategoriesGrouping: any = [];
    // var TaskTimeSheetCategories: any = [];
    // var AllTimeSpentDetails: any = [];
    // var isItemExists = function (arr: any, Id: any) {
    //     var isExists = false;
    //     $.each(arr, function (index: any, item: any) {
    //         if (item.Id == Id) {
    //             isExists = true;
    //             return false;
    //         }
    //     });
    //     return isExists;
    // }
    // const checkCategory = function (item: any, category: any) {
    //     $.each(TaskTimeSheetCategoriesGrouping, function (index: any, categoryTitle: any) {
    //         if (categoryTitle.Id == category) {
    //             // item.isShow = true;
    //             if (categoryTitle.Childs.length == 0) {
    //                 categoryTitle.Childs = [];
    //             }
    //             if (!isItemExists(categoryTitle.Childs, item.Id)) {
    //                 item.show = true;
    //                 categoryTitle.Childs.push(item);
    //             }
    //         }
    //     })
    // }

    // const getStructureData = function () {
    //     $.each(AllTimeSpentDetails, function (index: any, item: any) {
    //         if (item.TimesheetTitle.Id == undefined) {
    //             item.Expanded = true;
    //             item.isAvailableToDelete = false;
    //             $.each(AllTimeSpentDetails, function (index: any, val: any) {
    //                 if (val.TimesheetTitle.Id != undefined && val.TimesheetTitle.Id == item.Id) {
    //                     val.isShifted = true;
    //                     val.show = true;
    //                     $.each(val.AdditionalTime, function (index: any, value: any) {
    //                         value.ParentID = val.Id;
    //                         value.siteListName = val.__metadata.type;
    //                         value.MainParentId = item.Id;
    //                         value.AuthorTitle = val.Author.Title;
    //                         value.EditorTitle = val.Editor.Title;
    //                         value.show = true;
    //                         if (val.Created != undefined)
    //                             //  value.TaskTimeCreatedDate = SharewebCommonFactoryService.ConvertLocalTOServerDate(val.Created, 'DD/MM/YYYY HH:mm');
    //                             if (val.Modified != undefined)
    //                                 // value.TaskTimeModifiedDate = SharewebCommonFactoryService.ConvertLocalTOServerDate(val.Modified, 'DD/MM/YYYY HH:mm');
    //                                 item.AdditionalTime.push(value);
    //                     })

    //                 }
    //             })
    //         }
    //     })
    //     AllTimeSpentDetails = $.grep(AllTimeSpentDetails, function (type: any) { return type.isShifted == false });
    //     $.each(AllTimeSpentDetails, function (index: any, item: any) {
    //         if (item.AdditionalTime.length == 0) {
    //             item.isAvailableToDelete = true;
    //         }
    //         if (item.AdditionalTime != undefined && item.AdditionalTime.length > 0) {
    //             $.each(item.AdditionalTime, function (index: any, type: any) {
    //                 if (type.Id != undefined)
    //                     type.Id = type.ID;
    //             })
    //         }
    //     });
    //     $.each(AllTimeSpentDetails, function (index: any, item: any) {
    //         if (item.AdditionalTime.length > 0) {
    //             $.each(item.AdditionalTime, function (index: any, val: any) {
    //                 var NewDate = val.TaskDate;
    //                 try {
    //                     getDateForTimeEntry(NewDate, val);
    //                 } catch (e) { }
    //             })
    //         }
    //     })
    //     $.each(AllTimeSpentDetails, function (index: any, item: any) {
    //         if (item.Category.Title == undefined)
    //             checkCategory(item, 319);
    //         else
    //             checkCategory(item, item.Category.Id);
    //     })
    //     var IsTimeSheetAvailable = false;
    //     $.each(TaskTimeSheetCategoriesGrouping, function (index: any, item: any) {
    //         if (item.Childs.length > 0) {
    //             IsTimeSheetAvailable = true;
    //         }
    //     });
    //     setTimeSheet(TaskTimeSheetCategoriesGrouping);

    // }




    // function getDateForTimeEntry(newDate: any, items: any) {
    //     var LatestDate = [];
    //     var getMonth = '';
    //     var combinedDate = '';
    //     LatestDate = newDate.split('/');
    //     switch (LatestDate[1]) {
    //         case "01":
    //             getMonth = 'January ';
    //             break;
    //         case "02":
    //             getMonth = 'Febuary ';
    //             break;
    //         case "03":
    //             getMonth = 'March ';
    //             break;
    //         case "04":
    //             getMonth = 'April ';
    //             break;
    //         case "05":
    //             getMonth = 'May ';
    //             break;
    //         case "06":
    //             getMonth = 'June ';
    //             break;
    //         case "07":
    //             getMonth = 'July ';
    //             break;
    //         case "08":
    //             getMonth = 'August ';
    //             break;
    //         case "09":
    //             getMonth = 'September';
    //             break;
    //         case "10":
    //             getMonth = 'October ';
    //             break;
    //         case "11":
    //             getMonth = 'November ';
    //             break;
    //         case "12":
    //             getMonth = 'December ';
    //             break;
    //     }
    //     combinedDate = LatestDate[0] + ' ' + getMonth + ' ' + LatestDate[2];
    //     var dateE = new Date(combinedDate);
    //     items.NewestCreated = dateE.setDate(dateE.getDate());
    // }
    // const getStructurefTimesheetCategories = function () {
    //     $.each(TaskTimeSheetCategories, function (index: any, item: any) {
    //         $.each(TaskTimeSheetCategories, function (index: any, val: any) {
    //             if (item.ParentID == 0 && item.Id == val.ParentID) {
    //                 val.ParentType = item.Title;
    //             }
    //         })
    //     })
    //     $.each(TaskTimeSheetCategoriesGrouping, function (index: any, item: any) {
    //         $.each(TaskTimeSheetCategoriesGrouping, function (index: any, val: any) {
    //             if (item.ParentID == 0 && item.Id == val.ParentID) {
    //                 val.ParentType = item.Title;
    //             }
    //         })
    //     })
    // }
    // var getSmartMetadataItemsByTaxType = function (metadataItems: any, taxType: any) {
    //     var Items: any = [];
    //     $.each(metadataItems, function (index: any, taxItem: any) {
    //         if (taxItem.TaxType == taxType)
    //             Items.push(taxItem);
    //     });
    //     return Items;
    // }

    // const EditData = (item: any) => {
    //     TaskTimeSheetCategories = getSmartMetadataItemsByTaxType(AllMetadata, 'TimesheetCategories');
    //     TaskTimeSheetCategoriesGrouping = TaskTimeSheetCategoriesGrouping.concat(TaskTimeSheetCategories);
    //     TaskTimeSheetCategoriesGrouping.push({ "__metadata": { "id": "Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(319)", "uri": "https://hhhhteams.sharepoint.com/sites/HHHH/_api/Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(319)", "etag": "\"1\"", "type": "SP.Data.SmartMetadataListItem" }, "Id": 319, "Title": "Others", "siteName": null, "siteUrl": null, "listId": null, "Description1": null, "IsVisible": true, "Item_x005F_x0020_Cover": null, "SmartFilters": null, "SortOrder": null, "TaxType": "TimesheetCategories", "Selectable": true, "ParentID": "ParentID", "SmartSuggestions": false, "ID": 319 });
    //     $.each(TaskTimeSheetCategoriesGrouping, function (index: any, categoryTitle: any) {
    //         categoryTitle.Childs = [];
    //         categoryTitle.Expanded = true;
    //         categoryTitle.flag = true;
    //         // categoryTitle.AdditionalTime = [];
    //         categoryTitle.isAlreadyExist = false;
    //         categoryTitle.AdditionalTimeEntry = undefined;
    //         categoryTitle.Author = {};
    //         categoryTitle.AuthorId = 0;
    //         categoryTitle.Category = {};
    //         categoryTitle.Created = undefined;
    //         categoryTitle.Editor = {};
    //         categoryTitle.Modified = undefined
    //         categoryTitle.TaskDate = undefined
    //         categoryTitle.TaskTime = undefined
    //         categoryTitle.TimesheetTitle = [];

    //     });
    //     getStructurefTimesheetCategories();
    //     setEditItem(item.Title);
    //     var filteres = "Task" + item.siteType + "/Id eq " + item.Id;
    //     var select = "Id,Title,TaskDate,Created,Modified,TaskTime,Description,SortOrder,AdditionalTimeEntry,AuthorId,Author/Title,Editor/Id,Editor/Title,Category/Id,Category/Title,TimesheetTitle/Id,TimesheetTitle/Title&$expand=Editor,Author,Category,TimesheetTitle&$filter=" + filteres + "";
    //     var count = 0;
    //     var allurls = [{ 'Url': "https://hhhhteams.sharepoint.com/sites/HHHH/SP/_api/web/lists/getbyid('464FB776-E4B3-404C-8261-7D3C50FF343F')/items?$select=" + select + "" },
    //     { 'Url': "https://hhhhteams.sharepoint.com/sites/HHHH/SP/_api/web/lists/getbyid('11d52f95-4231-4852-afde-884d548c7f1b')/items?$select=" + select + "" }]
    //     $.each(allurls, function (index: any, item: any) {
    //         $.ajax({

    //             url: item.Url,

    //             method: "GET",

    //             headers: {

    //                 "Accept": "application/json; odata=verbose"

    //             },

    //             success: function (data) {
    //                 count++;
    //                 if (data.d.results != undefined && data.d.results.length > 0) {

    //                     AllTimeSpentDetails = AllTimeSpentDetails.concat(data.d.results);
    //                 }
    //                 if (allurls.length == count) {
    //                     //  var AllTimeSpentDetails = data.d.results;
    //                     let TotalPercentage = 0
    //                     let TotalHours = 0;
    //                     let totletimeparentcount = 0;
    //                     //  let totletimeparentcount = 0;
    //                     let AllAvailableTitle = [];
    //                     $.each(AllTimeSpentDetails, function (index: any, item: any) {
    //                         item.IsVisible = false;
    //                         item.Item_x005F_x0020_Cover = undefined;
    //                         item.Parent = {};
    //                         item.ParentID = 0;
    //                         item.ParentId = 0;
    //                         item.ParentType = undefined
    //                         item.Selectable = undefined;
    //                         item.SmartFilters = undefined;
    //                         item.SmartSuggestions = undefined;
    //                         item.isAlreadyExist = false
    //                         item.listId = null;
    //                         item.siteName = null
    //                         item.siteUrl = null;
    //                         if (item.TimesheetTitle.Id != undefined) {
    //                             if (item.AdditionalTimeEntry != undefined && item.AdditionalTimeEntry != '') {
    //                                 try {
    //                                     item.AdditionalTime = JSON.parse(item.AdditionalTimeEntry);
    //                                     if (item.AdditionalTime.length > 0) {
    //                                         $.each(item.AdditionalTime, function (index: any, additionalTime: any) {
    //                                             var time = parseFloat(additionalTime.TaskTime)
    //                                             if (!isNaN(time)) {
    //                                                 totletimeparentcount += time;
    //                                                 // $scope.totletimeparentcount += time;;
    //                                             }
    //                                         });
    //                                     }
    //                                     //$scope.AdditionalTimeSpent.push(item.AdditionalTime[0]);
    //                                 } catch (e) {
    //                                     console.log(e)
    //                                 }
    //                             }

    //                             $.each(AllUsers, function (index: any, taskUser: any) {
    //                                 if (taskUser.AssingedToUserId == item.AuthorId) {
    //                                     item.AuthorName = taskUser.Title;
    //                                     item.AuthorImage = (taskUser.Item_x0020_Cover != undefined && taskUser.Item_x0020_Cover.Url != undefined) ? taskUser.Item_x0020_Cover.Url : '';
    //                                 }
    //                             });
    //                             if (item.TaskTime != undefined) {
    //                                 var TimeInHours = item.TaskTime / 60;
    //                                 // item.IntegerTaskTime = item.TaskTime / 60;
    //                                 item.TaskTime = TimeInHours.toFixed(2);
    //                             }
    //                         } else {
    //                             AllAvailableTitle.push(item);
    //                         }

    //                         if (item.AdditionalTime == undefined) {
    //                             item.AdditionalTime = [];
    //                         }
    //                         // item.ServerTaskDate = angular.copy(item.TaskDate);
    //                         // item.TaskDate = SharewebCommonFactoryService.ConvertLocalTOServerDate(item.TaskDate, 'DD/MM/YYYY');
    //                         item.isShifted = false;

    //                     })
    //                     getStructureData();
    //                 }

    //             },
    //             error: function (error) {
    //                 count++;
    //                 if (allurls.length == count)
    //                     getStructureData();
    //             }
    //         })
    //     })
    // }

    // const openexpendTime = () => {
    //     setcollapseItem(true)
    // }
    // const collapseTime = () => {
    //     setcollapseItem(false)
    // }
    // let handleChange = (e: { target: { value: string; }; }, titleName: any) => {
    //     setSearch(e.target.value.toLowerCase());
    //     var Title = titleName;
    // };
    // const handleTimeOpen = (item: any) => {

    //     item.show = item.show = item.show == true ? false : true;
    //     setTimeSheet(TaskTimeSheetCategoriesGrouping => ([...TaskTimeSheetCategoriesGrouping]));
    //     // setData(data => ([...data]));

    // };
    // const sortBy = () => {

    //     // const copy = data

    //     // copy.sort((a, b) => (a.Title > b.Title) ? 1 : -1);

    //     // setTable(copy)

    // }
    // const sortByDng = () => {

    //     // const copy = data

    //     // copy.sort((a, b) => (a.Title > b.Title) ? -1 : 1);

    //     // setTable(copy)

    // }
    // function AddItem() {
    // }
    // // function AddItem() {
    // //     var MyData = JSON.stringify({
    // //         '__metadata': {
    // //             'type': 'SP.Data.Master_x0020_TasksListItem'
    // //         },
    // //         "Title": Title,
    // //         "Item_x0020_Type": itemType,
    // //         "Portfolio_x0020_Type": 'Component'
    // //     })
    // //     $.ajax({
    // //         url: "https://hhhhteams.sharepoint.com/sites/HHHH/SP/_api/contextinfo",
    // //         type: "POST",
    // //         headers: {
    // //             "Accept": "application/json;odata=verbose"
    // //         },
    // //         success: function (contextData: any) {
    // //             $.ajax({
    // //                 url: "https://hhhhteams.sharepoint.com/sites/HHHH/SP/_api/web/lists/getbyid('ec34b38f-0669-480a-910c-f84e92e58adf')/items",
    // //                 method: "POST",
    // //                 contentType: "application/json;odata=verbose",
    // //                 data: MyData,
    // //                 async: false,
    // //                 headers: {
    // //                     "Accept": "application/json;odata=verbose",
    // //                     "X-RequestDigest": contextData.d.GetContextWebInformation.FormDigestValue,
    // //                     "IF-MATCH": "*",
    // //                     "X-HTTP-Method": "POST"
    // //                 },
    // //                 success: function (data: any) {
    // //                     alert('success');
    // //                     setModalIsOpenToFalse();
    // //                     window.location.reload();
    // //                 },
    // //                 error: function (jqXHR: any, textStatus: any, errorThrown: any) {
    // //                     alert('error');
    // //                 }
    // //             });
    // //         },
    // //         error: function (jqXHR: any, textStatus: any, errorThrown: any) {
    // //             alert('error');
    // //         }
    // //     });


    // // }
    React.useEffect(() => {
        setEditItem(item.props.Title);
        setModalIsTimeOpenToTrue();;
    },
        []);
    // AddTime popup
    const OpenTimeEntryPopup = function () {
        setTaskEntrypopup(true)
    }
    const closeTaskStatusUpdatePoup = function () {
        setTaskEntrypopup(false)
    }

    function TimeCallBack(callBack: any) {

        item.CallBackTimeEntry();


    }
    const setModalIsTimeOpenToTrue = () => {
        setTimeModalIsOpen(true)
    }
    const setModalTimmeIsOpenToFalse = () => {
        TimeCallBack(false);
        setTimeModalIsOpen(false)
    }

    return (
        <div>

            <Panel
               headerText={`  All Time Entry -  ${EditTaskItemitle}`}
                isOpen={modalTimeIsOpen}
                onDismiss={setModalTimmeIsOpenToFalse}
                isBlocking={false} 
                type={PanelType.large}
                >
                <div className=''>
                    <div className=''>
                        <div className='modal-body clearfix'>
                            <TimeEntryPopup props={item.props} Context={item.Context}></TimeEntryPopup>
                        </div>
                        <div className='modal-footer '>
                        <button type="button" className="btn btn-default" onClick={setModalTimmeIsOpenToFalse}>OK</button>
                            <button type="button" className="btn btn-default" onClick={setModalTimmeIsOpenToFalse}>Cancel</button>
                        </div>
                    </div>
                </div>
            </Panel>

        </div>
    )
} export default DisplayTimeEntry;