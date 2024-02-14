import { Checkbox, Dropdown, Label, Panel, PanelType, TextField } from "office-ui-fabric-react";
import React, { useEffect, useState } from "react";
import Tooltip from "../Tooltip";
import * as Icon from 'react-bootstrap-icons';
import { LuUndo2 } from "react-icons/lu";
import { Button, Col, Container, Modal, Row } from "react-bootstrap";
import { Text } from "@fluentui/react";
import * as globalCommon from '../globalCommon';
import { Web } from "sp-pnp-js";
import moment from "moment";
import _ from "lodash";
import HtmlEditorCard from "../HtmlEditor/HtmlEditor";
import Picker from "../EditTaskPopup/SmartMetaDataPicker";
import { FaLeftLong, FaRightLong } from "react-icons/fa6";
import PageLoader from "../pageLoader";
import DatePicker from "react-datepicker";
import ClientCategoryPupup from "../ClientCategoryPopup";
import ServiceComponentPortfolioPopup from "../EditTaskPopup/ServiceComponentPortfolioPopup";
import { TbRuler2Off } from "react-icons/tb";
import { ColumnDef } from "@tanstack/react-table";
import GlobalCommanTable from "../GroupByReactTableComponents/GlobalCommanTable";
import EditTaskPopup from "../EditTaskPopup/EditTaskPopup";
import Smartmetadatapickerin from "../../globalComponents/Smartmetadatapickerindependent/SmartmetadatapickerSingleORMulti";
import { Item } from "@pnp/sp/items";
import { SlArrowDown, SlArrowRight } from "react-icons/sl";
import EditInstituton from "../../webparts/EditPopupFiles/EditComponent";
import EditProjectPopup from "../EditProjectPopup"; 
let renderData: any = [];
let AutoCompleteItemsArray: any = [];
let catItem: any = {};
let color: any = false;
let PutComment: any = "";

let TempTimeSheetCategoryArray: any = [];
const CompareTool = (props: any) => {
    const refreshData = () => setData(() => renderData);
    const [data, setData]: any = useState([]);
    const [TaskUser, setTaskUser]: any = useState([]);
    const [history, setHistory] = useState([]);
    const [verionhistory, setVersionHistory] = useState([]);
    const [SmartMetaDataAllItems, setSmartMetaDataAllItems] = useState<any>({});
    const [comments, setcomments] = React.useState<any>('');
    const [categories, setCategories] = useState<any>({});
    const [TaskItem, setTaskItem] = useState<any>("");
    const [componentItem, setcomponentItem] = useState<any>("");
    const [IsClientPopup, setIsClientPopup] = useState<any>(false);
    const [isPicker, setisPicker] = useState<any>({ PortfolioTitle: '', condition: false });
    const [openComment, setOpenComment] = useState({ data: [], condition: false, fieldName: '', ItemIndex: 0 });
    const [htmlEditor, setHtmlEditor] = useState<any>({ data: '', condition: false, fieldName: '', ItemIndex: 0 });
    const [floraData, setFoloraData] = useState<any>('');
    const [autoSearch, setautoSearch] = useState<any>('');
    const [taggedItems, setTaggedItems] = useState<any>({});
    const [SearchedCategoryData, setSearchedCategoryData] = React.useState([]); 
    const [PortFolioType, setPortfolioTypeData] = React.useState([]);
    const [categorySearchKey, setCategorySearchKey] = React.useState<any>({});
    const [AllMasterTasksItems, setAllMasterTasksItems] = React.useState<any>({});
    const [selectedData, setSelectedData] = React.useState([]);
    const [AllCommentModal, setAllCommentModal] = React.useState<any>(false)
    const [showLoader, setshowLoader] = React.useState<any>(false)
    const [Smartdatapopup, setSmartdatapopup] = React.useState(false);
    const rerender = React.useReducer(() => ({}), {})[1]
    const [isExpanded, setIsExpanded] = useState(false);


    const [ItemRankArray, setItemRankArray]: any = useState([
        { rankTitle: 'Select Item Rank', rank: null },
        { rankTitle: '(8) Top Highlights', rank: 8 },
        { rankTitle: '(7) Featured Item', rank: 7 },
        { rankTitle: '(6) Key Item', rank: 6 },
        { rankTitle: '(5) Relevant Item', rank: 5 },
        { rankTitle: '(4) Background Item', rank: 4 },
        { rankTitle: '(2) to be verified', rank: 2 },
        { rankTitle: '(1) Archive', rank: 1 },
        { rankTitle: '(0) No Show', rank: 0 }
    ])
    // const getchildstasks = async (Items: any, props: any) => {
    //     Items?.map(async (items: any) => {
    //         items.subRows = [];
    //         if (items?.TaskType?.Id != undefined) {
    //             let filter = `(ParentTask/Id eq ${items?.Id})`
    //             const Itesm: any = await globalCommon.loadAllSiteTasks(props?.contextValue, filter);
    //             items.subRows = Itesm;
    //         }
    //     })
    // };
    const getTaskChilds = (item: any, items: any, property: any) => {
        item[property] = [];
        items?.forEach((childItem: any) => {
            if (childItem.ParentTask?.Id != undefined && parseInt(childItem?.ParentTask?.Id) == item.ID) {
                childItem.isExpanded = false;
                childItem.property = property;
                item[property].push(childItem);
                getChilds(childItem, items);
            }
        });
    };
    const gettaggedItems = async (Items: any, props: any) => {
        let count = 0;
        Items?.map(async (items: any) => {
            items.subRows = [];
            items.isExpanded = false;
            if (items?.Item_x0020_Type === "Component" || items?.Item_x0020_Type === "SubComponent" || items?.Item_x0020_Type === "Feature" || items?.Item_x0020_Type === "Project" || items?.Item_x0020_Type === "Sprint") {
                let filter = `((Portfolio/Id eq ${items?.Id}))`
                const Itesm: any = await globalCommon.loadAllSiteTasks(props?.contextValue, undefined);
                items.taggedTasks = [];
                if (Itesm?.length > 0) {
                    Itesm.forEach((obj: any) => {
                        if (obj?.Portfolio?.Id === items?.Id) {
                            obj.property = 'taggedTasks';
                            obj.isExpanded = false;
                            items.taggedTasks.push(obj);
                            getTaskChilds(obj, Itesm, 'taggedTasks');
                        }
                    })
                }
            }
            let select: any = '';
            // get tagged tasks of selected tasks
            if (items?.TaskType?.Id != undefined) {
                //  let filter = `(ParentTask/Id eq ${items?.Id})`
                const Itesm: any = await globalCommon.loadAllSiteTasks(props?.contextValue, undefined);
                if (Itesm != undefined && Itesm.length > 0) {
                    Itesm?.forEach((task: any) => {
                        if (task?.ParentTask?.Id === items?.Id) {
                            task.isExpanded = false;
                            items.subRows.push(task);
                            getTaskChilds(task, Itesm, 'subRows');
                        }

                    })

                }
                count++;
                if (Items?.length === count) {

                    setData(Items);
                    setVersionHistory(Items);
                    setshowLoader(false);
                }

            }
            // get tagged component of selected Component
            else {
                select = "ID,Id,Title,Mileage,TaskListId,TaskListName,PortfolioLevel,TaskCategories/Title,TaskCategories/Id,AdminNotes,Status,ClientActivity,PriorityRank,Item_x002d_Image,AdminStatus,Help_x0020_Information,HelpInfo, TechnicalExplanations, SiteCompositionSettings,HelpDescription,PortfolioStructureID,ValueAdded,Idea,Synonyms,ComponentLink,Package,Comments,TaskDueDate,DueDate,Sitestagging,Body,Deliverables, DeliverableSynonyms,StartDate,Created,Item_x0020_Type,Background,Categories,Short_x0020_Description_x0020_On,CategoryItem,Priority_x0020_Rank,Priority,PercentComplete,Modified,CompletedDate,ItemRank,Portfolio_x0020_Type,Portfolios/Title, Portfolios/Id,Portfolios/ItemType, ClientTime,Parent/Id,Parent/Title,Author/Title,Author/Id,Editor/Title,SharewebCategories/Id,SharewebCategories/Title,ClientCategory/Id,ClientCategory/Title&$expand=Parent,Portfolios,TaskCategories,ClientCategory,Author,Editor,SharewebCategories"
                await globalCommon.getData(props?.contextValue?.siteUrl, items?.listId === undefined ? props?.contextValue?.MasterTaskListID : items?.listId, select + "&$filter=" + `(Parent/Id eq ${items?.Id})`)
                    .then(async (datas: any) => {
                        count++;
                        datas.forEach((obj: any) => {
                            obj.property = 'subRows';
                            obj.siteUrl = props?.contextValue?.siteUrl,
                                obj.listId = props?.contextValue?.MasterTaskListID,
                                obj.IconTitle = obj.Item_x0020_Type.charAt(0);
                        })
                        items.subRows = datas;
                        if (Items?.length === count) {
                            setData(Items);
                            setVersionHistory(Items);
                            setshowLoader(false);
                        }
                    }).catch((err: any) => {
                        console.error(err);
                    })
            }

        })
        // if(a.length >0)
        // setData(a);
    };
    const getPortfolioItems = async () => {
        let CallBackData: any = await globalCommon.GetServiceAndComponentAllData(
            props?.contextValue
        );
        if (CallBackData.AllData != undefined && CallBackData.AllData.length > 0) {
            setAllMasterTasksItems(CallBackData);
        }

        // setData(a);
    };
    // get the time
    const getDateForTimeEntry = function (newDate: any, items: any) {
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
                getMonth = 'September'
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
    const checkCategory = function (item: any, category: any, Item: any) {
        Item?.TaskTimeSheetCategoriesGrouping?.forEach((categoryTitle: any) => {
            if (categoryTitle?.Id == category)
                categoryTitle.subRows.push(item);
        })
    }

    const getStructureData = function (Item: any) {
        Item?.AllTimeSpentDetails.map((item: any) => {
            if (item.TimesheetTitle == undefined || item.TimesheetTitle.Id == undefined) {
                item.Expanded = true;
                Item?.AllTimeSpentDetails.map((val: any) => {
                    if (val.TimesheetTitle != undefined && val.TimesheetTitle.Id != undefined && val.TimesheetTitle.Id == item.Id) {
                        val.isShifted = true;
                        val?.AdditionalTime.forEach((value: any) => {
                            value.ParentID = val.Id;
                            value.MainParentId = item.Id;
                            item.AdditionalTime.push(value);
                        })
                    }
                })
            }
        })
        Item.AllTimeSpentDetails = Item.AllTimeSpentDetails.filter((type: { isShifted: boolean; }) => type.isShifted == false)
        Item?.AllTimeSpentDetails.map((item: any) => {
            if (item.AdditionalTime.length > 0) {
                item?.AdditionalTime.map((val: any) => {
                    var NewDate = val.TaskDate;
                    try {
                        getDateForTimeEntry(NewDate, val);
                    } catch (e) { }
                })
            }
        })
        Item?.AllTimeSpentDetails?.map((item: any) => {
            if (item.Category.Title == undefined)
                checkCategory(item, 319, Item);
            else
                checkCategory(item, item?.Category?.Id, Item);
        })
        Item.IsTimeSheetAvailable = false;
        Item?.TaskTimeSheetCategoriesGrouping?.forEach((item: any) => {
            if (item.subRows.length > 0)
                Item.IsTimeSheetAvailable = true;
        })
        let finalData: any = [];
        Item?.TaskTimeSheetCategoriesGrouping?.forEach((items: any) => {
            if (items.subRows != undefined && items.subRows.length > 0) {
                items?.subRows?.forEach((child: any) => {
                    child.CategoryTitleShow = true;
                    if (child.AdditionalTime != undefined && child?.AdditionalTime?.length > 0 && (child.subRows == undefined || child.subRows.length == 0)) {
                        child.subRows = child.AdditionalTime;
                        child.TaskDate = undefined;
                    }
                    if (!IsExistsData(finalData, child))
                        finalData.push(child);

                });
            }
        });
        Item.finalData = finalData;
    }
    const GetTaskTime = async (Item: any) => {
        Item.AllTimeSpentDetails = [];
        Item.CopyAllTimeSpentDetails = [];
        var site = Item.siteType.replace(' ', '');
        if (site != undefined && site.toLowerCase() == 'shareweb')
            site = site.toLowerCase().replace(/\b[a-z]/g, function (letter: string) { return letter.toUpperCase(); });
        if (site != undefined && site.toLowerCase() == 'sharewebqa')
            site = 'OffshoreTasks';
        var filteres = "Task" + site + "/Id eq " + Item.Id;
        var select = "Id,Title,TaskDate,TaskTime,Description,AdditionalTimeEntry,AuthorId,Author/Title,Category/Id,Category/Title,TimesheetTitle/Id,TimesheetTitle/Title&$expand=Author,Category,TimesheetTitle&$filter=" + filteres + "";
        var listID = "464FB776-E4B3-404C-8261-7D3C50FF343F";
        if (site != undefined && site == 'Migration' || site == 'ALAKDigital')
            listID = "9ed5c649-3b4e-42db-a186-778ba43c5c93";
        const web = new Web(props?.contextValue?.siteUrl);
        await web.lists.getById(listID).items.select(select)
            .getAll().then((data: any) => {
                data?.d?.results.map((time: any) => {
                    time.IsItemUpdated = false;
                    time.select = false;
                })
                Item.AllTimeSpentDetails = [...data];
                Item.CopyAllTimeSpentDetails = [...Item.AllTimeSpentDetails];
                var totletimeparentcount = 0;
                Item.AllAvailableTitle = [];
                Item?.AllTimeSpentDetails.map((item: any) => {
                    if (item.TimesheetTitle != undefined && item.TimesheetTitle.Id != undefined) {
                        if (item.AdditionalTimeEntry != undefined && item.AdditionalTimeEntry != '') {
                            try {
                                item.AdditionalTime = JSON.parse(item.AdditionalTimeEntry);
                                if (item.AdditionalTime.length > 0) {
                                    item?.AdditionalTime.map((additionalTime: any) => {
                                        var time = parseFloat(additionalTime.TaskTime)
                                        if (!isNaN(time))
                                            totletimeparentcount += time;
                                    });
                                }
                            } catch (e) { console.log(e) }
                        }
                        TaskUser?.map((taskUser: any) => {
                            if (taskUser.AssingedToUserId == item.AuthorId) {
                                item.AuthorName = taskUser.Title;
                                item.AuthorImage = taskUser.Item_x0020_Cover.Url != undefined ? taskUser.Item_x0020_Cover.Url : taskUser.Item_x0020_Cover.Url;
                            }
                        });
                        if (item.TaskTime != undefined) {
                            var TimeInHours = item.TaskTime / 60;
                            item.TaskTime = TimeInHours.toFixed(2);
                        }
                    } else {
                        Item.AllAvailableTitle.push(item);
                    }
                    if (item.AdditionalTime == undefined) {
                        item.AdditionalTime = [];
                    }
                    item.TaskDate = globalCommon.ConvertLocalTOServerDate(item.TaskDate, 'DD/MM/YYYY');
                    item.isShifted = false;
                })
                getStructureData(Item);
                Item.AllSiteData = [...Item.copyAllSites]
                Item?.AllSiteData.map((site: any) => {
                    if (site.ClienTimeDescription != undefined && site.ClienTimeDescription != '')
                        if (Item.siteType != undefined && site.Title != undefined && Item.siteType == site.Title && site.ClienTimeParcent == undefined && site.flag == true) {
                            site.ClienTimeParcent = parseFloat(((totletimeparentcount * parseFloat((site.ClienTimeDescription).toFixed(2))) / 100).toFixed(2));
                            site.newClienTimeParcent = parseFloat(((totletimeparentcount * parseFloat((site.ClienTimeDescription).toFixed(2))) / 100).toFixed(3));
                        } else if (site.ClienTimeParcent == undefined && site.flag == true) {
                            site.ClienTimeParcent = parseFloat(((totletimeparentcount * parseFloat((site.ClienTimeDescription).toFixed(2))) / 100).toFixed(2));
                            site.newClienTimeParcent = parseFloat(((totletimeparentcount * parseFloat((site.ClienTimeDescription).toFixed(2))) / 100).toFixed(3));
                        }
                })
            },
                function (error: any) {
                    alert(JSON.stringify(error));

                });
    }
    const TimeEntryColumnsFirst = React.useMemo<ColumnDef<any, unknown>[]>(
        () => [
            {
                accessorKey: "",
                placeholder: "",
                hasCheckbox: true,
                hasCustomExpanded: true,
                hasExpanded: true,
                isHeaderNotAvlable: true,
                size: 22,
                id: 'Id',

            },
            {
                id: "AuthorName",
                placeholder: "",
                canSort: false,
                header: "",
                size: 90,
                cell: ({ row }) => (
                    <>
                        <span>
                            <div className="d-flex">
                                <>
                                    {row?.original?.CategoryTitleShow != true ? (
                                        <span>
                                            {row?.original?.AuthorImage != "" &&
                                                row?.original.AuthorImage != null ? (
                                                <img
                                                    className="AssignUserPhoto1 bdrbox m-0 wid29"
                                                    title={row?.original.AuthorName}
                                                    data-toggle="popover"
                                                    data-trigger="hover"
                                                    src={row?.original.AuthorImage}
                                                ></img>
                                            ) : (
                                                <>
                                                    {" "}
                                                    <img
                                                        className="AssignUserPhoto1 bdrbox m-0 wid29"
                                                        title={row?.original.AuthorName}
                                                        data-toggle="popover"
                                                        data-trigger="hover"
                                                        src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg"
                                                    ></img>
                                                </>
                                            )}
                                            <span className="mx-1">{row?.original?.AuthorName}</span>
                                        </span>
                                    ) : (
                                        <>
                                            <span className="mx-1">
                                                {row?.original?.Category?.Title} -{" "}
                                                {row?.original?.Title}
                                            </span>
                                        </>
                                    )}
                                </>
                            </div>
                        </span>
                    </>
                )
            },
            {
                cell: ({ row }) => (
                    <>
                        <span>{row?.original?.TaskDate}</span>
                    </>
                ),
                id: "TaskDate",
                size: 95,
                placeholder: "",
                canSort: false,
                header: "",
            },
            {
                cell: ({ row }) => (
                    <>
                        <span>{row?.original?.TaskTime}</span>
                    </>
                ),
                id: "TaskTime",
                size: 95,
                placeholder: "",
                canSort: false,
                header: "",
            },
            {
                cell: ({ row }) => (
                    <>
                        <span>{row?.original?.Description}</span>
                    </>
                ),
                id: "Description",
                size: 300,
                placeholder: "",
                canSort: false,
                header: "",
            },
        ],
        [data[0]?.finalData]
    );
    const callBackDataFirst = React.useCallback((elem: any, ShowingData: any) => { },
        []);
    const TimeEntryColumnsSecond = React.useMemo<ColumnDef<any, unknown>[]>(
        () => [
            {
                accessorKey: "",
                placeholder: "",
                hasCheckbox: true,
                hasCustomExpanded: true,
                hasExpanded: true,
                isHeaderNotAvlable: true,
                size: 22,
                id: 'Id',

            },
            {
                cell: ({ row }) => (
                    <>
                        <span>
                            <div className="d-flex">
                                <>
                                    {row?.original?.CategoryTitleShow != true ? (
                                        <span>
                                            {row?.original?.AuthorImage != "" &&
                                                row?.original.AuthorImage != null ? (
                                                <img
                                                    className="AssignUserPhoto1 bdrbox m-0 wid29"
                                                    title={row?.original.AuthorName}
                                                    data-toggle="popover"
                                                    data-trigger="hover"
                                                    src={row?.original.AuthorImage}
                                                ></img>
                                            ) : (
                                                <>
                                                    {" "}
                                                    <img
                                                        className="AssignUserPhoto1 bdrbox m-0 wid29"
                                                        title={row?.original.AuthorName}
                                                        data-toggle="popover"
                                                        data-trigger="hover"
                                                        src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg"
                                                    ></img>
                                                </>
                                            )}
                                            <span className="mx-1">{row?.original?.AuthorName}</span>
                                        </span>
                                    ) : (
                                        <>
                                            <span className="mx-1">
                                                {row?.original?.Category?.Title} -{" "}
                                                {row?.original?.Title}
                                            </span>
                                        </>
                                    )}
                                </>
                            </div>
                        </span>
                    </>
                ),
                id: "AuthorName",
                placeholder: "",
                canSort: false,
                header: "",
                size: 90,
            },
            {
                cell: ({ row }) => (
                    <>
                        <span>{row?.original?.TaskDate}</span>
                    </>
                ),
                id: "TaskDate",
                size: 95,
                placeholder: "",
                canSort: false,
                header: "",
            },
            {
                cell: ({ row }) => (
                    <>
                        <span>{row?.original?.TaskTime}</span>
                    </>
                ),
                id: "TaskTime",
                size: 95,
                placeholder: "",
                canSort: false,
                header: "",
            },
            {
                cell: ({ row }) => (
                    <>
                        <span>{row?.original?.Description}</span>
                    </>
                ),
                id: "Description",
                size: 300,
                placeholder: "",
                canSort: false,
                header: "",
            },
        ],
        [data[1]?.finalData]
    );
    const callBackDataSecond = React.useCallback((elem: any, ShowingData: any) => { },
        []);




    const getDataWithFilter = async () => {
        let a: any = [];
        let select: any = '';
        selectedData?.map(async (items: any) => {
            if (items?.Item_x0020_Type === "Component" || items?.Item_x0020_Type === "SubComponent" || items?.Item_x0020_Type === "Feature" || items?.Item_x0020_Type === "Project" || items?.Item_x0020_Type === "Sprint") {
                select = "ID,Id,Title,Mileage,PortfolioLevel,Synonyms,TaskCategories/Title,TaskCategories/Id,AdminNotes,Status,ClientActivity,PriorityRank,Item_x002d_Image,AdminStatus,Help_x0020_Information,HelpInfo,TechnicalExplanations,SiteCompositionSettings,HelpDescription,PortfolioStructureID,ValueAdded,Idea,Synonyms,ComponentLink,Package,Comments,TaskDueDate,DueDate,Sitestagging,Body,Deliverables, DeliverableSynonyms,StartDate,Created,Item_x0020_Type,Background,Categories,Short_x0020_Description_x0020_On,CategoryItem,Priority_x0020_Rank,Priority,PercentComplete,Modified,CompletedDate,ItemRank,Portfolio_x0020_Type,Portfolios/Title,Portfolios/Id,ClientTime,Parent/Id,Parent/Title,Author/Title,Author/Id,Editor/Title,ClientCategory/Id,ClientCategory/Title,FeatureType/Id,FeatureType/Title,AssignedTo/Title,AssignedTo/Id,TeamMembers/Title,TeamMembers/Id,ResponsibleTeam/Title,ResponsibleTeam/Id&$expand=Parent,Portfolios,TaskCategories,AssignedTo,ClientCategory,TeamMembers,ResponsibleTeam,FeatureType,Author,Editor"
            } else
                select = "ID,Id,ParentTask/Title,ParentTask/Id,ItemRank,TaskLevel,OffshoreComments,TeamMembers/Id,ClientCategory/Id,ClientCategory/Title,TaskID,ResponsibleTeam/Id,ResponsibleTeam/Title,ParentTask/TaskID,TaskType/Level,PriorityRank,TeamMembers/Title,FeedBack,Title,Id,ID,DueDate,Comments,Categories,Status,Body,PercentComplete,ClientCategory,Priority,TaskType/Id,TaskType/Title,Portfolio/Id,Portfolio/ItemType,Portfolio/PortfolioStructureID,Portfolio/Title,TaskCategories/Id,TaskCategories/Title,TeamMembers/Name,Project/Id,Project/PortfolioStructureID,Project/Title,Project/PriorityRank,AssignedTo/Id,AssignedTo/Title,AssignedToId,Author/Id,Author/Title,Editor/Id,Editor/Title,Created,Modified,IsTodaysTask,workingThisWeek&$expand=ParentTask, Portfolio,TaskType,ClientCategory,TeamMembers,ResponsibleTeam,AssignedTo,Editor,Author,TaskCategories,Project";

            await globalCommon.getData(
                props?.contextValue?.siteUrl,
                items?.listId === undefined ? props?.contextValue?.MasterTaskListID : items?.listId,

                select + "&$filter=" + `((Id eq ${items?.Id}))`
            ).then(async (datas: any) => {
                if (datas?.length > 0) {
                    datas[0].Comments = globalCommon.parseJSON(datas[0]?.Comments);
                    datas[0].Comments = datas[0].Comments == undefined ? [] : datas[0].Comments;
                    datas[0].SiteComposition = globalCommon.parseJSON(datas[0]?.Sitestagging);
                    datas[0].SiteComposition = datas[0].SiteComposition == undefined ? [] : datas[0].SiteComposition;
                    datas[0].Synonyms = globalCommon.parseJSON(datas[0]?.Synonyms);
                    datas[0].AssignToUsers = [];
                    datas[0].TeamMembersUsers = [];
                    datas[0]["SiteIcon"] = SmartMetaDataAllItems?.Sites.map((site: any) => {
                        if (site.Title === items.siteType) {
                            return site.Item_x005F_x0020_Cover?.Url;
                        }
                        return null; // Or any other default value if the condition is not met
                    }).filter((url: any) => url !== null)[0];
                    SmartMetaDataAllItems?.Sites.map((site: any) => { return site?.Item_x005F_x0020_Cover?.Url; site.Title === items.siteType })
                    //datas[0]["SiteIcon"] = site?.Item_x005F_x0020_Cover?.Url;
                    datas[0].TaskTimeSheetCategoriesGrouping = JSON.parse(JSON.stringify(SmartMetaDataAllItems?.TimeSheetCategory));
                    datas[0].TaskCategories = datas[0]?.TaskCategories === undefined ? [] : datas[0]?.TaskCategories;
                    datas[0].ClientCategory = datas[0]?.ClientCategory === undefined ? [] : datas[0]?.ClientCategory;
                    datas[0].PortfolioItem = [];
                    datas[0].ProjectItem = [];
                    datas[0]?.Portfolios?.forEach((obj: any) => {
                        let dataitem: any = AllMasterTasksItems?.AllData?.filter((master: any) => master.Id === obj.Id);
                        if (dataitem?.length === 0)
                            dataitem = AllMasterTasksItems?.ProjectData?.filter((master: any) => master.Id === obj.Id)
                        if (dataitem[0]?.Item_x0020_Type != undefined && dataitem[0]?.Item_x0020_Type === 'Project')
                            datas[0].ProjectItem.push(obj)
                        else if (dataitem[0]?.Item_x0020_Type != undefined && dataitem[0]?.Item_x0020_Type != 'Project') datas[0].PortfolioItem.push(obj);
                    })
                    datas[0].FeatureType = datas[0]?.FeatureType === undefined ? [] : [{ Id: datas[0]?.FeatureType?.Id, Title: datas[0]?.FeatureType?.Title }];
                    // datas[0].ProjectItem = datas[0]?.Portfolios === undefined ? [] : datas[0]?.Portfolios;
                    datas[0].ResponsibileUsers = [];
                    if (datas[0]?.CompletedDate != undefined && datas[0]?.CompletedDate != null)
                        datas[0].CompletedDate = new Date(datas[0]?.CompletedDate);
                    if (datas[0]?.StartDate != undefined && datas[0]?.StartDate != null)
                        datas[0].StartDate = new Date(datas[0]?.StartDate);
                    if (datas[0]?.DueDate != undefined && datas[0]?.DueDate != null)
                        datas[0].DueDate = new Date(datas[0]?.DueDate);
                    TaskUser?.forEach((element: any) => {
                        if (datas[0]?.AssignedTo?.length > 0)
                            datas[0].AssignToUsers = datas[0].AssignToUsers.concat(datas[0]?.AssignedTo?.filter((obj: any) => {
                                if (obj.Id === element?.AssingedToUser?.Id) {
                                    obj["userImage"] = element?.Item_x0020_Cover?.Url
                                    return obj;
                                }
                            }));
                        if (datas[0]?.TeamMembers?.length > 0)
                            datas[0].TeamMembersUsers = datas[0].TeamMembersUsers.concat(datas[0]?.TeamMembers?.filter((obj: any) => {
                                if (obj.Id === element?.AssingedToUser?.Id) {
                                    obj["userImage"] = element?.Item_x0020_Cover?.Url
                                    return obj;
                                }
                            }));
                        if (datas[0]?.ResponsibleTeam?.length > 0)
                            datas[0].ResponsibileUsers = datas[0].ResponsibileUsers.concat(datas[0]?.ResponsibleTeam?.filter((obj: any) => {
                                if (obj.Id === element?.AssingedToUser?.Id) {
                                    obj["userImage"] = element?.Item_x0020_Cover?.Url
                                    return obj;
                                }
                            }));
                    });

                    datas[0].TaskID = globalCommon.GetTaskId(datas[0]);
                    datas[0].siteUrl = props?.contextValue?.siteUrl,
                        datas[0].listId = items?.listId === undefined ? props?.contextValue?.MasterTaskListID : items?.listId,
                        datas[0].siteType = items.siteType === undefined ? "Master Tasks" : items.siteType,
                        getDocuments(datas)
                    if (datas[0]?.TaskType?.Id != undefined)
                        GetTaskTime(datas[0]);
                    a.push(...datas);
                    if (selectedData?.length === a?.length)
                        gettaggedItems(a, props);
                }

            }).catch((err: any) => {
                console.error(err);
            })



        })
        // if(a.length >0)
        // setData(a);
    };

    const getDocuments = async (data: any) => {
        try {
            let web = new Web(props?.contextValue?.siteUrl);
            let items = await web.lists
                .getById("D0F88B8F-D96D-4E12-B612-2706BA40FB08").items
                .select('Id', 'Title', 'Portfolios/Id', 'Portfolios/Title', 'EncodedAbsUrl', 'File_x0020_Type')
                .expand('Portfolios')
                .filter(`Portfolios/Id eq ${data[0]?.Id}`)
                .get();

            if (items?.length > 0) {
                items.forEach((obj: any) => {
                    obj.property = 'tagDoc';
                })
            }
            data[0].tagDoc = items;
            console.log(items);
        } catch (error) {
            console.error(error);
        }
    };



    const onRenderCustomHeaderMain = () => {
        return (
            <>
                <div className="subheading">
                    Compare Components

                </div>
                <Tooltip ComponentId={611} />
            </>
        );
    };

    const onRenderCustomHeaderMain1 = () => {
        return (
            <>
                <div className="subheading">
                    All Comments:

                </div>
                <Tooltip ComponentId={586} />
            </>
        );
    };

    const onRenderCustomHeaderMain2 = () => {
        return (
            <>
                <div className="subheading">
                    Description
                </div>
                <Tooltip ComponentId={2011} />
            </>
        );
    };

    const getTaskUsers = async () => {
        let taskUsers = [];
        taskUsers = await globalCommon.loadAllTaskUsers(props?.contextValue);
        setTaskUser(taskUsers)
        console.log(taskUsers);
    };
    useEffect(() => {
        if (TaskUser.length > 0) {
            getPortfolioItems();

        }
    }, [TaskUser])
    useEffect(() => {
        if (AllMasterTasksItems?.AllData?.length > 0) {

            getDataWithFilter();
        }
    }, [AllMasterTasksItems])

 useEffect(() => {
        let columns ="Id,Title,Color,IdRange";
        let PortFolioType:any =[];
         globalCommon.getData(props?.contextValue?.siteUrl,props?.contextValue?.PortFolioTypeID,columns)
         .then(async (datas: any) => {
            setPortfolioTypeData(datas);
           })
      
    }, [])

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        console.log(params.get('Item1'));
        console.log(params.get('Item2'));
        if (props?.compareData?.length == 2) {
            let selectedDataValue: any = []
            props?.compareData.map((elem: any) => {
                if (elem) {
                    selectedDataValue.push(elem?.original)
                }
            })
            setshowLoader(true);
            setSelectedData(selectedDataValue)
            getTaskUsers();
            SmartMetaDataListInformations();
        } else if (params.get('Item2') != undefined && params.get('Item1') != undefined) {
            getTaskUsers();
            SmartMetaDataListInformations();
        }
        else if (props?.compareData?.length > 2) {
            alert('More than 2 Items selected, Select only 2 Items to compare.');
        }

    }, [props?.compareData])



    const changeData = (index: any, property: any, value: any) => {
        setHistory((prevHistory) => [...prevHistory, _.cloneDeep(data)]);
        const updatedItems = _.cloneDeep(data);
        if (property === 'ItemRank')
            value = parseInt(value);
        updatedItems[index][property] = value;
        setData(updatedItems);
    };
    const switchItems = () => {
        const updatedItems = _.cloneDeep(data);
        let temp = updatedItems[0];
        updatedItems[0] = updatedItems[1];
        updatedItems[1] = temp;
        setData(updatedItems);
    }
    const IsExistsData = (array: any, taggedItem: any) => {
        let isExists = false;
        for (let index = 0; index < array.length; index++) {
            let item = array[index];
            if (item.Id == taggedItem?.Id) {
                isExists = true;
                //return false;
            }
        }
        return isExists;
    }
    const taggedChildItems = (index: any, property: any, value: any) => {
        setHistory((prevHistory) => [...prevHistory, _.cloneDeep(data)]);
        const updatedItems = _.cloneDeep(data);
        const indexValue = index == 1 ? 0 : 1
        if (taggedItems != undefined && (property === 'tagDoc' || property === 'subRows')) {
            const findUnSelected = updatedItems[indexValue][property].filter((obj: any) => taggedItems?.Id != obj.Id);

            updatedItems[indexValue][property] = findUnSelected
            if (!IsExistsData(updatedItems[index][property], taggedItems))
                updatedItems[index][property].unshift(taggedItems);
            updatedItems[index][property].map((elem: any) => {
                elem.checked = false
            })
        }
        else if ((property === "AssignToUsers" || property === "TeamMembersUsers" || property === "ResponsibileUsers")) {
            const selectedItems = updatedItems[indexValue][property].filter((obj: any) => obj.checked === true);

            if (updatedItems[index][property]?.length > 0 && selectedItems?.length > 0) {
                if (!IsExistsData(updatedItems[index][property], selectedItems[0])) {
                    updatedItems[index][property] = [...updatedItems[index][property], ...selectedItems];
                    updatedItems[index][property].map((elem: any) => {
                        elem.checked = false
                    })
                }
            } else if (selectedItems?.length > 0) {
                updatedItems[index][property] = selectedItems;
                updatedItems[index][property]?.map((elem: any) => {
                    elem.checked = false
                })
            }
        }

        else if (property === 'taggedTasks') {
            const selectedItems = updatedItems[indexValue][property].filter((obj: any) => obj.checked === true);
            const UnselectedItems = updatedItems[indexValue][property].filter((obj: any) => obj.checked != true);
            updatedItems[indexValue][property] = UnselectedItems;
            if (updatedItems[index][property]?.length > 0 && selectedItems?.length > 0) {
                if (!IsExistsData(updatedItems[index][property], selectedItems[0])) {
                    updatedItems[index][property] = [...updatedItems[index][property], ...selectedItems];
                    updatedItems[index][property].map((elem: any) => {
                        elem.checked = false
                    })
                }
            } else if (selectedItems?.length > 0) {
                updatedItems[index][property] = selectedItems;
                updatedItems[index][property]?.map((elem: any) => {
                    elem.checked = false
                })
            }

        }

        else {
            const selectedItems = updatedItems[indexValue][property].filter((obj: any) => obj.checked === true);
            if (selectedItems?.length === 0)
                alert("please select items " + property)
        }

        setData(updatedItems);
        rerender()
    };

    const undoChanges = () => {
        if (history.length > 0) {
            // Get the previous state from the history
            const previousState = history[history.length - 1];
            // Remove the last item from the history
            const newHistory = history.slice(0, -1);
            // Update the state and history
            setData(previousState);
            setHistory(newHistory);
        }
    };
    const undoChangescolumns = (Property: any) => {
        if (verionhistory.length > 0) {
            data[0][Property] = _.cloneDeep(verionhistory[0][Property]);
            data[1][Property] = _.cloneDeep(verionhistory[1][Property]);
            let renderData: any = [];
            renderData = renderData.concat(data)
            setData(renderData);
        }
    };

    const Callcategory = React.useCallback((item1: any, type: any, functionType: any) => {
        setCategories({ ...categories, taskCate: item1, condition: false })
    }, []);


    const HtmlEditorCallBack = React.useCallback((Editorvalue: any) => {
        let message = Editorvalue;
        setFoloraData(message);
    }, []);

    const saveEditorData = () => {
        if (openComment?.fieldName === 'Comments') {
            let dataItem: any = (floraData != undefined &&
                floraData != null
                ? floraData
                    .replace(/(<([^>]+)>)/gi, "")
                    .replace(/\n/g, "")
                    .replace(/&#160;/g, " ")
                : "")
            catItem.Comments[htmlEditor.ItemIndex].Description = dataItem;
            setHtmlEditor((prev: any) => ({
                ...prev,
                data: "",
                condition: false,
                fieldName: floraData[htmlEditor.fieldName],
                ItemIndex: floraData[htmlEditor.ItemIndex]
            }));
        } else {
            changeData(htmlEditor.ItemIndex, htmlEditor.fieldName, floraData)
            setHtmlEditor((prev: any) => ({
                ...prev,
                data: "",
                condition: false,
                fieldName: floraData[htmlEditor.fieldName],
                ItemIndex: floraData[htmlEditor.ItemIndex]
            }));
        }
    }

    const handleRadioChange = (item: any, property: any) => {
        // Toggle the value when the radio button is clicked
        item.checked = !item.checked;
        if (property === "tagDoc")
            setTaggedItems(item);
        if (property === "taggedTask")
            setTaggedItems(item);
        if (property === "taggedComponents")
            setTaggedItems(item);
    };
    const handleCheckboxChange = (index: any, item: any, property: any) => {
        item.checked = !item.checked;
        rerender();
    };
    const closeHtmlEditor = () => {
        setHtmlEditor({ ...htmlEditor, condition: false, })
    };

    const bindEditorData = (dataItem: any, dataIndex: any, fieldName: any, condition: any) => {
        setHtmlEditor((prev: any) => ({
            ...prev,
            data: dataItem[fieldName] != undefined &&
                dataItem[fieldName] != null
                ? dataItem[fieldName]
                    .replace(/(<([^>]+)>)/gi, "")
                    .replace(/\n/g, "")
                    .replace(/&#160;/g, " ")
                : "",
            condition: condition,
            fieldName: fieldName,
            ItemIndex: dataIndex
        }));

    }
    const setSelectedCategoryData = (selectCategoryData: any, usedFor: any) => {
        let TempArray: any = [];
        setCategorySearchKey('');
        setautoSearch('');
        setHistory((prevHistory) => [...prevHistory, _.cloneDeep(data)]);
        const updatedItems = _.cloneDeep(data);
        if (updatedItems[autoSearch?.itemIndex][autoSearch?.property] != undefined) {
            if (!IsExistsData(updatedItems[autoSearch?.itemIndex][autoSearch?.property], selectCategoryData) && autoSearch?.property === "PortfolioItem")
                updatedItems[autoSearch?.itemIndex][autoSearch?.property] = selectCategoryData;
            else if (!IsExistsData(updatedItems[autoSearch?.itemIndex][autoSearch?.property], selectCategoryData[0]))
                updatedItems[autoSearch?.itemIndex][autoSearch?.property].push(selectCategoryData[0]);
        }
        setData(updatedItems);

    }
    const autoSuggestionsForCategory = (e: any, property: any, itemIndex: any, AutoCompleteItemsArray: any) => {
        let searchedKey: any = e.target.value;
        setCategorySearchKey(searchedKey);
        let tempArray: any = [];
        if (searchedKey?.length > 0) {
            AutoCompleteItemsArray?.map((itemData: any) => {
                if ((itemData?.Newlabel || itemData.Path).toLowerCase().includes(searchedKey.toLowerCase())) {
                    tempArray.push(itemData);
                }
            })
            setSearchedCategoryData(tempArray);
        } else {
            setSearchedCategoryData([]);
        }
        let autoProperty: any = {};
        autoProperty.property = property;
        autoProperty.itemIndex = itemIndex;
        setautoSearch(autoProperty)
    }
    var getSmartMetadataItemsByTaxType = function (metadataItems: any, taxType: any) {
        var Items: any = [];
        metadataItems.map((taxItem: any) => {
            if (taxItem.TaxType === taxType)
                Items.push(taxItem);
        });
        Items.sort((a: any, b: any) => {
            return a.SortOrder - b.SortOrder;
        });
        return Items;
    }
    const getChilds = (item: any, items: any) => {
        item.childs = [];
        $.each(items, function (index: any, childItem: any) {
            if (childItem.ParentID != undefined && parseInt(childItem.ParentID) == item.ID) {
                childItem.isChild = true;
                item.childs.push(childItem);
                getChilds(childItem, items);
            }
        });
    }
    var loadSmartTaxonomyPortfolioPopup = (AllTaxonomyItems: any, SmartTaxonomy: any) => {
        var TaxonomyItems: any = [];
        var uniqueNames: any = [];
        $.each(AllTaxonomyItems, function (index: any, item: any) {
            if (item.ParentID == 0 && SmartTaxonomy == item.TaxType) {
                TaxonomyItems.push(item);
                getChilds(item, AllTaxonomyItems);
                if (item.childs != undefined && item.childs.length > 0) {
                    TaxonomyItems.push(item)
                }
                uniqueNames = TaxonomyItems.filter((val: any, id: any, array: any) => {
                    return array.indexOf(val) == id;
                });
            }
        });
        return uniqueNames;
    }


    const SmartMetaDataListInformations = async () => {
        let AllSmartDataListData: any = [];

        let AllClientCategoryData: any = [];
        let AllCategoriesData: any = [];

        let AllStatusData: any = [];
        let AllPriorityData: any = [];
        let AllPriorityRankData: any = [];
        let CategoriesGroupByData: any = [];
        let AllFeatureTypeData: any = [];
        let AllSitesData: any = [];
        let AllTimesheetCategoriesData: any = [];
        try {
            let web = new Web(props?.contextValue?.siteUrl);
            AllSmartDataListData = await web.lists
                .getById(props?.contextValue?.SmartMetadataListID)
                .items.select(
                    "Id,Title,listId,siteUrl,siteName,Item_x005F_x0020_Cover,ParentID,Configurations,EncodedAbsUrl,IsVisible,Created,Modified,Description1,SortOrder,Selectable,TaxType,Created,Modified,Author/Name,Author/Title,Editor/Name,Editor/Title,IsSendAttentionEmail/Id,IsSendAttentionEmail/Title,IsSendAttentionEmail/EMail"
                )
                .expand("Author,Editor,IsSendAttentionEmail")
                .getAll();

            if (AllSmartDataListData?.length > 0) {
                AllSmartDataListData?.map((SmartItemData: any, index: any) => {
                    if (SmartItemData.TaxType == "Client Category") {
                        if (
                            SmartItemData.Title?.toLowerCase() == "pse" &&
                            SmartItemData.TaxType == "Client Category"
                        ) {
                            SmartItemData.newTitle = "EPS";
                        } else if (
                            SmartItemData.Title?.toLowerCase() == "e+i" &&
                            SmartItemData.TaxType == "Client Category"
                        ) {
                            SmartItemData.newTitle = "EI";
                        } else if (
                            SmartItemData.Title?.toLowerCase() == "education" &&
                            SmartItemData.TaxType == "Client Category"
                        ) {
                            SmartItemData.newTitle = "Education";
                        } else {
                            SmartItemData.newTitle = SmartItemData.Title;
                        }
                    } else {
                        SmartItemData.newTitle = SmartItemData.Title;
                    }
                });
            }
            AllSitesData = getSmartMetadataItemsByTaxType(AllSmartDataListData, "Sites");
            AllFeatureTypeData = getSmartMetadataItemsByTaxType(AllSmartDataListData, "Feature Type");
            AllClientCategoryData = getSmartMetadataItemsByTaxType(
                AllSmartDataListData,
                "Client Category"
            );
            AllCategoriesData = getSmartMetadataItemsByTaxType(
                AllSmartDataListData,
                "Categories"
            );


            AllTimesheetCategoriesData = getSmartMetadataItemsByTaxType(
                AllSmartDataListData,
                "TimesheetCategories"
            );
            AllTimesheetCategoriesData.push({ "__metadata": { "id": "Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(319)", "uri": "https://hhhhteams.sharepoint.com/sites/HHHH/_api/Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(319)", "etag": "\"1\"", "type": "SP.Data.SmartMetadataListItem" }, "Id": 319, "Title": "Others", "siteName": null, "siteUrl": null, "listId": null, "Description1": null, "IsVisible": true, "Item_x005F_x0020_Cover": null, "SmartFilters": null, "SortOrder": null, "TaxType": "TimesheetCategories", "Selectable": true, "ParentID": "ParentID", "SmartSuggestions": false, "ID": 319 });
            AllStatusData = getSmartMetadataItemsByTaxType(
                AllSmartDataListData,
                "Status"
            );
            AllPriorityData = getSmartMetadataItemsByTaxType(
                AllSmartDataListData,
                "Priority"
            );
            AllPriorityRankData = getSmartMetadataItemsByTaxType(
                AllSmartDataListData,
                "Priority Rank"
            );

            // ########## this is for All Client Category related validations ################

            // ########## this is for All Categories related validations ################
            if (AllCategoriesData?.length > 0) {
                CategoriesGroupByData = loadSmartTaxonomyPortfolioPopup(
                    AllCategoriesData,
                    "Categories"
                );
                if (CategoriesGroupByData?.length > 0) {
                    CategoriesGroupByData?.map((item: any) => {
                        if (item.newTitle != undefined) {
                            item["Newlabel"] = item.newTitle;
                            AutoCompleteItemsArray.push(item);
                            if (item.childs != null && item.childs != undefined && item.childs.length > 0) {
                                item.childs.map((childitem: any) => {
                                    if (childitem.newTitle != undefined) {
                                        childitem["Newlabel"] = item["Newlabel"] + " > " + childitem.Title;
                                        AutoCompleteItemsArray.push(childitem);
                                    }
                                    if (childitem.childs.length > 0) {
                                        childitem.childs.map((subchilditem: any) => {
                                            if (subchilditem.newTitle != undefined) {
                                                subchilditem["Newlabel"] = childitem["Newlabel"] + " > " + subchilditem.Title;
                                                AutoCompleteItemsArray.push(subchilditem);
                                            }
                                        });
                                    }
                                });
                            }
                        }
                    });
                }
                if (AutoCompleteItemsArray?.length > 0) {
                    AutoCompleteItemsArray = AutoCompleteItemsArray.reduce(function (
                        previous: any,
                        current: any
                    ) {
                        var alredyExists =
                            previous.filter(function (item: any) {
                                return item.Title === current.Title;
                            }).length > 0;
                        if (!alredyExists) {
                            previous.push(current);
                        }
                        return previous;
                    },
                        []);
                }

                // ############## this is used for filttering time sheet category data from smart medatadata list ##########
                if (AllTimesheetCategoriesData?.length > 0) {
                    AllTimesheetCategoriesData = AllTimesheetCategoriesData.map((TimeSheetCategory: any) => {
                        TimeSheetCategory.subRows = [];
                        TimeSheetCategory.IsSelectTimeEntry = false;
                        if (TimeSheetCategory.ParentId == 303) {
                            TempTimeSheetCategoryArray.push(TimeSheetCategory);
                        }
                    }
                    );
                }
                console.log("Timesheet Category Data ====", TempTimeSheetCategoryArray);

                let AllSmartMetaDataGroupBy: any = {
                    TimeSheetCategory: TempTimeSheetCategoryArray,
                    Categories: AutoCompleteItemsArray,
                    Sites: AllSitesData,
                    Status: AllStatusData,
                    Priority: AllPriorityData,
                    PriorityRank: AllPriorityRankData,
                    ClientCategory: AllClientCategoryData,
                    AllSmartDataListData: AllSmartDataListData,
                    AllFeatureTypeData: AllFeatureTypeData,
                };
                // setsmartMetadataItems(AllSmartDataListData);
                setSmartMetaDataAllItems(AllSmartMetaDataGroupBy);
            }
        } catch (error) {
            console.log("Error : ", error.message);
        }
    };
    const CustomCompletedDateFirst = React.forwardRef(({ id, value, onClick }: any, ref: any) => {
        const inputId = `datepickerCompletedDateFirst-${id}`;

        return (
            <div style={{ position: "relative" }} onClick={onClick} ref={ref}>
                <input
                    type="text"
                    id={inputId}
                    data-input-type="Completed Date"
                    className="form-control date-picker"
                    placeholder="DD/MM/YYYY"
                    value={value}
                />
                <span style={{ position: "absolute", top: "50%", right: "5px", transform: "translateY(-50%)", cursor: "pointer" }}>
                    <span className="svg__iconbox svg__icon--calendar"></span>
                </span>
            </div>
        );
    });

    // export default CustomCompletedDateFirst;
    // const CustomCompletedDateFirst = React.forwardRef(({  id, value, onClick }: any, ref: any) => (
    //     const inputId = `datepickerCompletedDateFirst-${id}`;
    //     return (
    //     <div style={{ position: "relative" }} onClick={onClick} ref={ref}>
    //         <input type="text" id="datepickerCompletedDateFirst" data-input-type="Completed Date" className="form-control date-picker" placeholder="DD/MM/YYYY" value={value} />
    //         <span style={{ position: "absolute", top: "50%", right: "5px", transform: "translateY(-50%)", cursor: "pointer" }}>
    //             <span className="svg__iconbox svg__icon--calendar"></span>
    //         </span>
    //     </div>
    //     );
    // ));

    const CustomCompletedDateSecond = React.forwardRef(({ value, onClick }: any, ref: any) => (
        <div style={{ position: "relative" }} onClick={onClick} ref={ref}>
            <input type="text" id="datepickerCompletedDateSecond" data-input-type="Completed Date" className="form-control date-picker" placeholder="DD/MM/YYYY" value={value} />
            <span style={{ position: "absolute", top: "50%", right: "5px", transform: "translateY(-50%)", cursor: "pointer" }}>
                <span className="svg__iconbox svg__icon--calendar"></span>
            </span>
        </div>
    ));
    const removeItem = (item: any, index: any, property: any) => {
        const updatedItems = _.cloneDeep(data);
        let items = updatedItems[index][property]?.filter((obj: any) => item?.Id != obj?.Id);
        updatedItems[index][property] = items?.length > 0 ? items : [];
        setData(updatedItems);
    }
    const openCategoryPicker = (item: any, condition: any, taskCategory: any) => {
        catItem = item;
        setCategories({ data: item, condition: condition, taskCate: taskCategory });
    };

    const OpenComponentPicker = (item: any, condition: any, PortfolioTitle: any) => {
        catItem = item;
        setisPicker({ PortfolioTitle: PortfolioTitle, condition: condition });
    };
    // const EditClientCategory = (item: any, Type: any) => {
    //     ItemType = Type;
    //     setIsClientPopup(true);
    //     setEditData(item);
    // };
    const EditClientCategory = (item: any, condition: any, PortfolioTitle: any) => {
        catItem = item;
        setIsClientPopup(true);
    };

    const ComponentServicePopupCallBack = React.useCallback((DataItem: any, Type: any, functionType: any, WhichItem: any) => {
        if (functionType == "Close") {
            setisPicker({ PortfolioTitle: '', condition: false });
        } else {
            if (DataItem[0]?.ItemCat === 'Project')
                catItem.ProjectItem = DataItem;
            else
                catItem.PortfolioItem = DataItem;

            setisPicker({ PortfolioTitle: '', condition: false });
        }
    }, []);
    const ClientCategoryCallBack = React.useCallback((DataItem: any, Type: any, functionType: any, WhichItem: any) => {
        if (functionType == "Close") {
            setisPicker({ PortfolioTitle: '', condition: false }); setIsClientPopup(false);
        } else {
            catItem.ClientCategory = catItem.Clientcategories === undefined ? [] : catItem.Clientcategories;
            setIsClientPopup(false);
        }
    }, []);
    const SelectCategoryCallBack = React.useCallback((selectCategoryDataCallBack: any) => {
        catItem.TaskCategories = selectCategoryDataCallBack;
        setCategories({ ...categories, taskCate: [], condition: false })
    }, []);

    // comment code here
    const OpenComment = (item: any, condition: any, property: any, Itemindex: any) => {
        catItem = item;
        setOpenComment({ data: item, condition: condition, fieldName: property, ItemIndex: Itemindex });
        setAllCommentModal(condition);
    }

    const customHeaderforALLcomments = () => {
        return (
            <div className={color ? "d-flex full-width pb-1 serviepannelgreena" : "d-flex full-width pb-1 "}>
                <div className='subheading'>
                    <span className="siteColor">
                        All Comments
                    </span>
                </div>
                <Tooltip ComponentId="588" />
            </div>
        )
    }
    const closeAllCommentModal = (e: any) => {
        setAllCommentModal(false)
    }
    const handleInputChange = (e: any) => {
        PutComment = e.target.value;
        setcomments(e.target.value);
    }
    const PostComment = async (txtCommentControlId: any) => {
        let web = new Web(props?.contextValue?.siteUrl);
        let currentUser = await web.currentUser?.get();
        TaskUser?.forEach((user: any) => {
            if (user?.AssingedToUser?.Id === currentUser?.Id)
                currentUser.Item_x0020_Cover = user.Item_x0020_Cover;
        })
        console.log("this is post comment function")
        if (PutComment != '') {
            let temp = {
                AuthorImage: currentUser?.Item_x0020_Cover != null ? currentUser?.Item_x0020_Cover?.Url : '',
                AuthorName: currentUser?.Title != null ? currentUser['Title'] : props?.contextValue?.Context.pageContext._user.displayName,
                Created: moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
                MsTeamCreated: moment(new Date()).format('MM/DD/YYYY, hh:mm A'),
                Description: PutComment,
                // Header: this.GetMentionValues(this.state.mentionValue),
                ID: catItem["Comments"] != undefined ? catItem["Comments"].length + 1 : 1,
                Title: PutComment,
                editable: false,
            };
            //   if (this.state?.ChildLevel == true) {
            //     catItem?.Comments?.forEach((element: any) => {
            //       if (element.isReplyMsg == true && element?.ReplyMessages != undefined) {
            //         temp.ID = element?.ReplyMessages != undefined ? element?.ReplyMessages.length + 1 : 1;
            //         temp.Header = this.GetMentionValues(this.state.ReplymentionValue);
            //       }
            //     });
            //   }
            //Add object in feedback
            let isPushOnRoot: any = true
            if (catItem["Comments"] != undefined) {
                if (catItem != undefined && catItem?.Comments != undefined && catItem?.Comments?.length > 0) {
                    catItem?.Comments?.forEach((element: any) => {
                        if (element.isReplyMsg == true && element?.ReplyMessages != undefined) {
                            element?.ReplyMessages.push(temp);
                            element.isReplyMsg = false;
                            isPushOnRoot = false;
                        }
                    });
                }
                if (isPushOnRoot != false)
                    catItem["Comments"].push(temp);
                setcomments('');
                // }
            }
            else {
                catItem["Comments"] = [temp];
                setcomments('');
            }
            catItem["Comments"].sort(function (a: any, b: any) {
                let keyA = a.ID,
                    keyB = b.ID;
                // Compare the 2 dates
                if (keyA < keyB) return 1;
                if (keyA > keyB) return -1;
                return 0;
            });
        } else {
            alert('Please input some text.')
        }
        PutComment = '';
        setcomments('');
    }
    useEffect(() => {
        if (comments === "") {
            setcomments('');
        }
    }, [comments])

    //Save func
    const TaggeddocumentConfiguration = (Firstitem: any, secondItem: any) => {
        let PortfoliosIds: any = [];
        Firstitem?.tagDoc?.forEach((element: any) => {
            let temp1 = element?.Portfolios?.filter((obj: any) => obj.Id == secondItem.Id)
            try {
                if (temp1?.length > 0) {
                    let PortfolioIds: any = [];
                    element?.Portfolios.forEach((elo: any) => {
                        if (elo?.Id != secondItem.Id)
                            PortfolioIds.push(elo.Id);
                    })
                    PortfolioIds.push(Firstitem.Id)
                    let postData = {
                        PortfoliosId: { "results": PortfolioIds },
                    }
                    globalCommon.updateItemById(props?.contextValue?.siteUrl, props?.contextValue?.DocumentListID === undefined ? 'D0F88B8F-D96D-4E12-B612-2706BA40FB08' : props?.contextValue?.DocumentListID, postData, element.Id)
                        .then((returnresult) => {
                            console.log(returnresult);
                            // result.smartTime = String(returnresult)
                            // console.log("Final Total Time:", returnresult);
                        })
                        .catch((error) => {
                            console.error("Error:", error);
                        });

                }
            } catch (error) {
                // Handle the error, you can log it or perform any other actions
                console.error('Error in the first block:', error);
            }
        });
    }
    const TaggedTaskSavingConfiguration = (Firstitem: any, secondItem: any) => {
        let PortfoliosIds: any = [];
        let taggedtasks = Firstitem?.taggedTasks?.filter((obj: any) => obj?.Portfolio?.Id == secondItem.Id)
        try {
            if (taggedtasks?.length > 0) {
                taggedtasks.forEach((element: any) => {
                    let postData = {
                        PortfoliosId: Firstitem.Id,
                    }
                    globalCommon.updateItemById(element.siteUrl, element.listId, postData, element.Id)
                        .then((returnresult) => {
                            console.log(returnresult);
                            // result.smartTime = String(returnresult)
                            // console.log("Final Total Time:", returnresult);
                        })
                        .catch((error) => {
                            console.error("Error:", error);
                        });

                });

            }
        } catch (error) {
            // Handle the error, you can log it or perform any other actions
            console.error('Error in the first block:', error);
        }
    }
    const SaveComponentsItems = async (FirstItem: any, SecondItem: any) => {
        if (FirstItem?.subRows?.length > 0) {
            let allCompo = FirstItem?.subRows?.filter((obj: any) => obj?.Parent?.Id === SecondItem.Id)
            try {
                allCompo.forEach((item: any) => {
                    const postData: any = {
                        ParentId: FirstItem.Id,
                    }
                    globalCommon.updateItemById(props?.contextValue?.siteUrl, props?.contextValue?.MasterTaskListID, postData, item.Id)
                        .then((returnresult) => {
                            console.log(returnresult);
                            // result.smartTime = String(returnresult)
                            // console.log("Final Total Time:", returnresult);
                        })
                        .catch((error) => {
                            console.error("Error:", error);
                        });

                })
            } catch (error) {
                // Handle the error, you can log it or perform any other actions
                console.error('Error in the first block:', error);
            }
        }
    }
    const saveSmartHelp = function (obj: any, Item: any) {
        // let postData:any = {
        //     '__metadata': { 'type': "SP.Data.SmartHelpListItem" },
        //     Title: obj.Title,
        //     //ComponentsId: { "results": [Item.Id] },
        // }
        // if (Item.Portfolio_x0020_Type == "Component") {
        //     postData.ComponentsId = { "results": [Item.Id] };
        // }
        // else if (Item.Portfolio_x0020_Type == "Service") {
        //     postData.ServiceId = { "results": [Item.Id] };
        // }

        //  return SharewebListService.UpdateListItemByListId(GlobalConstants.ADMIN_SITE_URL, GlobalConstants.QUESTIONHELPDESCRIPTION_LISTID, postData, obj.Id);
    }
    const componentPost = (Item: any, type: any) => {
        try {
            var AssignedToIds: any = [];
            var TeamMembersIds: any = [];
            if (Item.AssignToUsers != undefined && Item.AssignToUsers.length > 0) {
                Item.AssignToUsers.forEach((user: any) => {
                    if (user?.Id != undefined)
                        AssignedToIds.push(user.Id);
                });
            }
            if (Item.TeamMembersUsers != undefined && Item.TeamMembersUsers.length > 0) {
                Item.TeamMembersUsers.forEach((user: any) => {
                    if (user?.Id != undefined)
                        TeamMembersIds.push(user?.Id);
                });
            }


            if (Item.QuestionDescription != undefined && Item.QuestionDescription.length > 0) {
                Item.QuestionDescription.forEach((obj: any) => {
                    if (obj.IsUpdated != undefined && obj.IsUpdated)
                        saveSmartHelp(obj, Item);
                })

            }
            if (Item.HelpDescription != undefined && Item.HelpDescription.length > 0) {
                Item.HelpDescription.forEach((obj: any) => {
                    if (obj.IsUpdated != undefined && obj.IsUpdated)
                        saveSmartHelp(obj, Item);
                })

            }
            var PercentComplete = Item.PercentComplete > 1 ? Item.PercentComplete / 100 : Item.PercentComplete;
            let taskCategoryIds: any = [];
            if (Item.TaskCategories.length > 0) {
                Item.TaskCategories.forEach((categories: any) => {
                    taskCategoryIds.push(categories.Id);
                })
            }

            let portfolioIds: any = [];
            if (Item.PortfolioItem.length > 0) {
                Item.PortfolioItem.forEach((portfolio: any) => {
                    portfolioIds.push(portfolio.Id);
                })
            }
            if (Item.ProjectItem.length > 0) {
                Item.ProjectItem.forEach((project: any) => {
                    portfolioIds.push(project.Id);
                })
            }
            if (Item.ProjectItem.length > 0) {
                Item.ProjectItem.forEach((project: any) => {
                    portfolioIds.push(project.Id);
                })
            }
            let ClientCategoryIds: any = [];
            if (Item.ClientCategory.length > 0) {
                Item.ClientCategory.forEach((cate: any) => {
                    ClientCategoryIds.push(cate.Id);
                })
            }

            let postData: any = {
                'Title': Item.Title,
                'Help_x0020_Information': Item.Help_x0020_Information,
                'TechnicalExplanations': Item.TechnicalExplanations,
                'Short_x0020_Description_x0020_On': Item.Short_x0020_Description_x0020_On,
                'Admin_x0020_Notes': Item.Admin_x0020_Notes,
                'Background': Item.Background,
                'Body': Item.Body,
                'Idea': Item.Idea,
                'ValueAdded': Item.ValueAdded,
                'PercentComplete': PercentComplete,
                'Priority': Item.Priority,
                'Deliverable_x002d_Synonyms': Item.Deliverable_x002d_Synonyms,
                // 'Synonyms': Item.Synonyms,
                'StartDate': Item.StartDate ? moment(Item.StartDate).format("MM-DD-YYYY") : null,
                'DueDate': Item.DueDate ? moment(Item.DueDate).format("MM-DD-YYYY") : null,
                'CompletedDate': Item.CompletedDate ? moment(Item.CompletedDate).format("MM-DD-YYYY") : null,
                'ItemRank': Item.ItemRank,
                'Mileage': Item.Mileage,
                'Priority_x0020_Rank': Item.PriorityRank,
                // 'ComponentId': { "results": $scope.smartComponentsIds },
                'PortfoliosId': { "results": portfolioIds },
                'TaskCategoriesId': { "results": taskCategoryIds },
                'Package': Item.Package,
                // 'SiteCompositionSettings': angular.toJson(Item.SiteCompositionSettingsValue),
                'Sitestagging': JSON.stringify(Item.SiteCompositionSettingsValue),
                'Deliverables': Item.Deliverables,
                'ClientActivity': Item.ClientActivity,
                Comments: JSON.stringify(Item.Comments),
                'Item_x002d_Image': {
                    '__metadata': { 'type': 'SP.FieldUrlValue' },
                    'Description': Item.Item_x002d_Image != undefined ? Item.Item_x002d_Image.Url : null,
                    'Url': Item.Item_x002d_Image != undefined ? Item.Item_x002d_Image.Url : null,
                },
                'component_x0020_link': {
                    '__metadata': { 'type': 'SP.FieldUrlValue' },
                    'Description': Item.component_x0020_link != undefined ? Item.component_x0020_link.Url : null,
                    'Url': Item.component_x0020_link != undefined ? Item.component_x0020_link.Url : null,
                },
                AssignedToId: { "results": AssignedToIds },
                TeamMembersId: { "results": TeamMembersIds },
                ClientCategoryId: { "results": ClientCategoryIds },
            }
            if (Item?.Synonyms?.length > 0) {
                postData.Synonyms = JSON.stringify(Item.Synonyms);
            }
            else {
                postData.Synonyms = null;
            }
            if (Item?.FeatureType?.length > 0) {
                postData.FeatureTypeId = Item.FeatureType[0].Id;
            }
            globalCommon.updateItemById(props?.contextValue?.siteUrl, props?.contextValue?.MasterTaskListID, postData, Item.Id)
                .then((returnresult) => {
                    console.log(returnresult);
                    if (type === 'Keep1')
                        props.compareToolCallBack(data[0])
                    if (type === 'Keep2')
                        props.compareToolCallBack(data[1])
                    if (type === 'KeepBoth')
                        props.compareToolCallBack(data)
                    // result.smartTime = String(returnresult)
                    // console.log("Final Total Time:", returnresult);
                })
                .catch((error) => {
                    console.error("Error:", error);
                });

        } catch (error) {
            // Handle the error, you can log it or perform any other actions
            console.error('Error in the first block:', error);
        }
    }
    const TaskPost = (Item: any, type: any) => {
        try {
            var AssignedToIds: any = [];
            var TeamMembersIds: any = [];
            let ResponsibleTeamIds: any = [];
            if (Item.AssignToUsers != undefined && Item.AssignToUsers.length > 0) {
                Item.AssignToUsers.forEach((user: any) => {
                    if (user?.Id != undefined)
                        AssignedToIds.push(user.Id);
                });
            }
            if (Item.TeamMembersUsers != undefined && Item.TeamMembersUsers.length > 0) {
                Item.TeamMembersUsers.forEach((user: any) => {
                    if (user?.Id != undefined)
                        TeamMembersIds.push(user?.Id);
                });
            }
            if (Item.ResponsibleTeam != undefined && Item.ResponsibleTeam.length > 0) {
                Item.ResponsibleTeam.forEach((user: any) => {
                    if (user?.Id != undefined)
                        ResponsibleTeamIds.push(user.Id);
                });
            }


            if (Item.QuestionDescription != undefined && Item.QuestionDescription.length > 0) {
                Item.QuestionDescription.forEach((obj: any) => {
                    if (obj.IsUpdated != undefined && obj.IsUpdated)
                        saveSmartHelp(obj, Item);
                })

            }
            if (Item.HelpDescription != undefined && Item.HelpDescription.length > 0) {
                Item.HelpDescription.forEach((obj: any) => {
                    if (obj.IsUpdated != undefined && obj.IsUpdated)
                        saveSmartHelp(obj, Item);
                })

            }
            var PercentComplete = Item.PercentComplete > 1 ? Item.PercentComplete / 100 : Item.PercentComplete;
            let taskCategoryIds: any = [];
            if (Item.TaskCategories.length > 0) {
                Item.TaskCategories.forEach((categories: any) => {
                    taskCategoryIds.push(categories.Id);
                })
            }

            let portfolioIds: any = [];
            if (Item.PortfolioItem.length > 0) {
                Item.PortfolioItem.forEach((portfolio: any) => {
                    portfolioIds.push(portfolio.Id);
                })
            }
            if (Item.ProjectItem.length > 0) {
                Item.ProjectItem.forEach((project: any) => {
                    portfolioIds.push(project.Id);
                })
            }

            let ClientCategoryIds: any = [];
            if (Item.ClientCategory.length > 0) {
                Item.ClientCategory.forEach((cate: any) => {
                    ClientCategoryIds.push(cate.Id);
                })
            }
            let postData: any = {
                'Title': Item.Title,
                'Background': Item.Background,
                'Body': Item.Body,
                'PercentComplete': PercentComplete,
                'Priority': Item.Priority,
                'Deliverable_x002d_Synonyms': Item.Deliverable_x002d_Synonyms,
                // 'Synonyms': Item.Synonyms,
                'StartDate': Item.StartDate ? moment(Item.StartDate).format("MM-DD-YYYY") : null,
                'DueDate': Item.DueDate ? moment(Item.DueDate).format("MM-DD-YYYY") : null,
                'CompletedDate': Item.CompletedDate ? moment(Item.CompletedDate).format("MM-DD-YYYY") : null,
                'ItemRank': Item.ItemRank,
                'Mileage': Item.Mileage,
                'Priority_x0020_Rank': Item.PriorityRank,
                'PortfoliosId': { "results": portfolioIds },
                'TaskCategoriesId': { "results": taskCategoryIds },
                'Package': Item.Package,
                'Sitestagging': JSON.stringify(Item.SiteCompositionSettingsValue),
                'Deliverables': Item.Deliverables,
                'ClientActivity': Item.ClientActivity,
                Comments: JSON.stringify(Item.Comments),
                'Item_x002d_Image': {
                    '__metadata': { 'type': 'SP.FieldUrlValue' },
                    'Description': Item.Item_x002d_Image != undefined ? Item.Item_x002d_Image.Url : null,
                    'Url': Item.Item_x002d_Image != undefined ? Item.Item_x002d_Image.Url : null,
                },
                'component_x0020_link': {
                    '__metadata': { 'type': 'SP.FieldUrlValue' },
                    'Description': Item.component_x0020_link != undefined ? Item.component_x0020_link.Url : null,
                    'Url': Item.component_x0020_link != undefined ? Item.component_x0020_link.Url : null,
                },
                AssignedToId: { "results": AssignedToIds },
                TeamMembersId: { "results": TeamMembersIds },
                ResponsibleTeamId: { "results": ResponsibleTeamIds },
                ClientCategoryId: { "results": ClientCategoryIds },
            }
            if (Item?.Synonyms?.length > 0) {
                postData.Synonyms = JSON.stringify(Item.Synonyms);
            }
            else {
                postData.Synonyms = null;
            }
           
            globalCommon.updateItemById(props?.contextValue?.siteUrl, Item.listId, postData, Item.Id)
                .then((returnresult) => {
                    console.log(returnresult);
                    if (type === 'Keep1')
                        props.compareToolCallBack(data[0])
                    if (type === 'Keep2')
                        props.compareToolCallBack(data[1])
                    if (type === 'KeepBoth')
                        props.compareToolCallBack(data)
                    // result.smartTime = String(returnresult)
                    // console.log("Final Total Time:", returnresult);
                })
                .catch((error) => {
                    console.error("Error:", error);
                });

        } catch (error) {
            // Handle the error, you can log it or perform any other actions
            console.error('Error in the first block:', error);
        }
    }

    const SaveComponent = async (Item: any, type: any) => {
        try {
            if (Item?.ItemType?.Id != undefined)
                TaskPost(Item, type);
            else componentPost(Item, type);
               

        } catch (error) {
            // Handle the error, you can log it or perform any other actions
            console.error('Error in the first block:', error);
        }
    }
    const deleteComponent = function (Item: any) {
        return globalCommon.deleteItemById(props?.contextValue?.siteUrl, props?.contextValue?.MasterTaskListID, '', Item.Id);
    }
    const WhichComponentToSave = (type: any) => {
        if (type == 'Keep1')
            var flag = confirm("This operation will save all changes in " + data[0]?.Title + " 1 and delete " + data[1].Title + " 2. Do you want to continue?");
        if (type == 'Keep2')
            var flag = confirm("This operation will save all changes in " + data[1].Title + " 2 and delete " + data[0].Title + " 1. Do you want to continue?");
        if (type == 'KeepBoth')
            var flag = confirm("This operation will save all changes in both the Compare Components.  Do you want to continue?");

        if (flag) {
            if (type == 'Keep1') {
                SaveComponent(data[0], type);
                TaggedTaskSavingConfiguration(data[0], data[1]);
                TaggeddocumentConfiguration(data[0], data[1]);
                SaveComponentsItems(data[0], data[1]);
                deleteComponent(data[1]);
            } else if (type == 'Keep2') {
                SaveComponent(data[1], type);
                TaggedTaskSavingConfiguration(data[1], data[0]);
                TaggeddocumentConfiguration(data[1], data[0]);
                SaveComponentsItems(data[1], data[0]);
                deleteComponent(data[0]);
            } else if (type == 'KeepBoth') {
                SaveComponent(data[0], '');
                TaggedTaskSavingConfiguration(data[0], data[1]);
                TaggeddocumentConfiguration(data[0], data[1]);
                SaveComponentsItems(data[0], data[1]);
                TaggedTaskSavingConfiguration(data[1], data[0]);
                TaggeddocumentConfiguration(data[1], data[0]);
                SaveComponentsItems(data[1], data[0]);
                SaveComponent(data[1], type);
            }
        }
    }
    const bindMultilineValue = (e: any, index: any, property: any) => {
        let v = e.target.value;
        const updatedItems = _.cloneDeep(data);
        updatedItems[index][property] = v;
        setData(updatedItems);
    }
    const EditItemTaskPopup = (item: any) => {
        setTaskItem(item);
    };
    const EditComponenetPopup = (item: any) => {
        setcomponentItem(item);
    };
    const CallcomponentItem = (res: any, UpdatedData: any) => {
        setcomponentItem(undefined);
    }
    const Call = (res: any, UpdatedData: any) => {
        setTaskItem(undefined);
    }
    const checkboxValueHandler = (id: any, Items: any) => {
        Items.map((checkbox: any) =>
            checkbox.id === id ? { ...checkbox, checked: !checkbox.checked } : checkbox
        )

    };
    const Smartmetadatafeature = React.useCallback((data: any) => {
        if (data === "Close") {
            setSmartdatapopup(false)
        } else {
            setSmartdatapopup(false)
            catItem["FeatureType"] = data;
            rerender()
        }
    }, [])
    const toggleExpand = (item: any, ParentItem: any, property: any) => {
        item.isExpanded = !item.isExpanded;
        setHistory((prevHistory) => [...prevHistory, _.cloneDeep(data)]);
        const updatedItems = _.cloneDeep(data);
        updatedItems?.forEach((ite: any) => {
            if (ite?.Id === ParentItem?.Id) {
                ite[property]?.forEach((task: any) => {
                    if (task?.Id === item?.Id)
                        task.isExpanded = item.isExpanded;
                })
            }
        })

        setData(updatedItems);
    };
    const TreeNode: React.FC<any> = ({ items, taggedItems, handleRadioChange }) => (
        <>
            {items?.subRows?.length > 0 &&

                items?.subRows?.map((child: any) => (
                    <div className="SpfxCheckRadio" key={child.Id}>
                        {child?.subRows && child?.subRows?.length > 0 ? (
                            <span>
                                <span onClick={() => toggleExpand(items, data[0], 'taggedTasks')}>  {items.isExpanded ? <SlArrowDown style={{ color: "#000" }} /> : <SlArrowRight style={{ color: "#000" }}></SlArrowRight>}</span>
                                <div className="SpfxCheckRadio" key={child.Id}>
                                    <span className="me-1">
                                        <img className="workmember" src={child.SiteIcon} alt="Site Icon" />
                                    </span>
                                    <span>{child.TaskID}</span>
                                    <input type="radio" checked={taggedItems?.Id === child?.Id ? true : false} name="radioCheck" onClick={() => handleRadioChange(child, 'taggedComponents')} className="radio" />
                                    <span>
                                        <a target="_blank" className="mx-2" data-interception="off" href={`${child.siteUrl}/SitePages/Task-Profile.aspx?taskId=${child?.Id}&Site=${child?.siteType}`} >
                                            {child?.Title}
                                        </a>
                                    </span>
                                    {child.isExpanded &&
                                        <TreeNode items={child} taggedItems={taggedItems} handleRadioChange={handleRadioChange} />
                                    }
                                </div>
                            </span>) :
                            <div className="SpfxCheckRadio" key={child.Id}>
                                <span className="me-1">
                                    <img className="workmember" src={child.SiteIcon} alt="Site Icon" />
                                </span>
                                <span>{child.TaskID}</span>
                                <input type="radio" checked={taggedItems?.Id === child?.Id ? true : false} name="radioCheck" onClick={() => handleRadioChange(child, 'taggedComponents')} className="radio" />
                                <span>
                                    <a target="_blank" className="mx-2" data-interception="off" href={`${child.siteUrl}/SitePages/Task-Profile.aspx?taskId=${child?.Id}&Site=${child?.siteType}`} >
                                        {child?.Title}
                                    </a>
                                </span>

                            </div>}
                    </div>))}
        </>
    );
    const TreeNodeTasks: React.FC<any> = ({ items, taggedItems, handleRadioChange }) => (
        <>
            {items?.taggedTasks?.length > 0 &&
                items?.taggedTasks?.map((child: any) => (

                    <div className="SpfxCheckRadio" key={child.Id}>
                        {child?.subRows && child?.subRows?.length > 0 ? (
                            <span>
                                <span onClick={() => toggleExpand(items, data[0], 'taggedTasks')}>  {items.isExpanded ? <SlArrowDown style={{ color: "#000" }} /> : <SlArrowRight style={{ color: "#000" }}></SlArrowRight>}</span>
                                <span className="me-1">
                                    <img className="workmember" src={child.SiteIcon} alt="Site Icon" />
                                </span>
                                <span>{child.TaskID}</span>
                                <input type="checkbox" checked={items.checked} className="form-check-input me-1 mt-0" name="radiotask1" onClick={() => handleCheckboxChange(0, child, undefined)} />
                                <span>
                                    <a target="_blank" className="mx-2" data-interception="off" href={`${child.siteUrl}/SitePages/Task-Profile.aspx?taskId=${child?.Id}&Site=${child?.siteType}`} >
                                        {child?.Title}
                                    </a>
                                </span>
                                {child.isExpanded &&
                                    <TreeNode items={child} taggedItems={taggedItems} handleRadioChange={handleRadioChange} />}
                            </span>) : (<span> <span className="me-1">
                                <img className="workmember" src={child.SiteIcon} alt="Site Icon" />
                            </span>
                                <span>{child.TaskID}</span>
                                <input type="checkbox" checked={items.checked} className="form-check-input me-1 mt-0" name="radiotask1" onClick={() => handleCheckboxChange(0, child, undefined)} />
                                <span>
                                    <a target="_blank" className="mx-2" data-interception="off" href={`${child.siteUrl}/SitePages/Task-Profile.aspx?taskId=${child?.Id}&Site=${child?.siteType}`} >
                                        {child?.Title}
                                    </a>
                                </span></span>)}
                    </div>
                ))}
        </>
    );

    // export default TreeNode;

    return (
        <>
            <Panel onRenderHeader={onRenderCustomHeaderMain} type={PanelType.large} isOpen={props?.isOpen} isBlocking={false} onDismiss={() => props?.compareToolCallBack("close")}>
                <Modal.Body className="mb-5">
                    <Container fluid className="CompareSmartpopup">
                        {data[0]?.Item_x0020_Type === "Component" || data[0]?.Item_x0020_Type === "SubComponent" || data[0]?.Item_x0020_Type === "Feature" || data[0]?.Item_x0020_Type === "Project" || data[0]?.Item_x0020_Type === "Sprint" ?
                            (<Row className="Metadatapannel ">
                                <Col sm="5" md="5" lg="5" className="alignCenter siteColor contentSec">
                                    <span className="Dyicons me-1">{data[0]?.Item_x0020_Type.charAt(0)}</span> <Label><a target="_blank" data-interception="off"
                                        href={`${data[0]?.siteUrl}/SitePages/Portfolio-Profile.aspx?taskId=${data[0]?.Id}`}>
                                        {data[0]?.Title}
                                    </a></Label> <span className="svg__iconbox svg__icon--edit"
                                        onClick={() => EditComponenetPopup(data[1])}
                                    ></span>
                                </Col>
                                <Col sm="1" md="1" lg="1" className="text-center iconSec">
                                    <span><img className="imgWid29" src={`${props?.contextValue?.siteUrl}/SiteCollectionImages/ICONS/Shareweb/SwitchItem_icon.png`} title="Switch Items" onClick={() => switchItems()} /></span>
                                </Col>
                                <Col sm="5" md="5" lg="5" className="alignCenter siteColor contentSec">
                                    <span className="Dyicons me-1">{data[1]?.Item_x0020_Type.charAt(0)}</span> <Label>
                                        <a target="_blank" data-interception="off"
                                            href={`${data[1]?.siteUrl}/SitePages/Portfolio-Profile.aspx?taskId=${data[1]?.Id}`}>
                                            {data[1]?.Title}
                                        </a>
                                    </Label>
                                    <span className="svg__iconbox svg__icon--edit"
                                        onClick={() => EditComponenetPopup(data[1])}
                                    ></span>
                                </Col>
                                <Col sm="1" md="1" lg="1" className="iconSec">
                                    <div className="text-center">
                                    <LuUndo2 size="25" onClick={undoChanges} />
                                    </div>
                                </Col>
                            </Row>) :
                            <Row className="Metadatapannel">
                                <Col sm="5" md="5" lg="5" className="alignCenter siteColor contentSec">
                                    <span>
                                        <img className="imgWid29 pe-1" src={data[0]?.SiteIcon} />
                                    </span>
                                    <span>{data[0]?.TaskID}</span>
                                    <a target="_blank" className="mx-2" data-interception="off"
                                        href={`${data[0]?.siteUrl}/SitePages/Task-Profile.aspx?taskId=${data[0]?.Id}&Site=${data[0]?.siteType}`}>
                                        {data[0]?.Title}
                                    </a>
                                    <span className="svg__iconbox svg__icon--edit"
                                        onClick={(e) => EditItemTaskPopup(data[0])}
                                    ></span>
                                </Col>
                                <Col sm="1" md="1" lg="1" className="text-center iconSec">
                                    <span><img className="imgWid29" src={`${props?.contextValue?.siteUrl}/SiteCollectionImages/ICONS/Shareweb/SwitchItem_icon.png`} title="Switch Items" onClick={() => switchItems()} /></span>
                                </Col>
                                <Col sm="5" md="5" lg="5" className="alignCenter siteColor contentSec">
                                    <span>
                                        <img className="imgWid29 pe-1" src={data[1]?.SiteIcon} />
                                    </span>
                                    <span>{data[1]?.TaskID}</span>
                                    <a target="_blank" className="mx-2" data-interception="off"
                                        href={`${data[1]?.siteUrl}/SitePages/Task-Profile.aspx?taskId=${data[1]?.Id}&Site=${data[1]?.siteType}`}>
                                        {data[1]?.Title}
                                    </a>
                                    <span className="svg__iconbox svg__icon--edit"
                                        onClick={() => EditItemTaskPopup(data[1])}
                                    ></span>
                                </Col>
                                <Col sm="1" md="1" lg="1" className="iconSec">
                                    <div className="text-center">
                                        <LuUndo2 size="25" onClick={() => undoChangescolumns(undefined)} />
                                    </div>
                                </Col>
                            </Row>}
                        {/* <Row className="Metadatapannel ">
                            <Col sm="5" md="5" lg="5" className="alignCenter siteColor">
                                <span className="Dyicons me-1">{data[0]?.Item_x0020_Type.charAt(0)}</span> <Label><a target="_blank" data-interception="off"
                                    href={`${data[0]?.siteUrl}/SitePages/Portfolio-Profile.aspx?taskId=${data[0]?.Id}`}>
                                    {data[0]?.Title}
                                </a></Label>
                            </Col>
                            <Col sm="1" md="1" lg="1" className="text-center">
                                <span><img className="imgWid29" src={`${props?.contextValue?.siteUrl}/SiteCollectionImages/ICONS/Shareweb/SwitchItem_icon.png`} title="Switch Items" onClick={() => switchItems()} /></span>
                            </Col>
                            <Col sm="5" md="5" lg="5" className="alignCenter siteColor">
                                <span className="Dyicons me-1">{data[1]?.Item_x0020_Type.charAt(0)}</span> <Label>
                                    <a target="_blank" data-interception="off"
                                        href={`${data[1]?.siteUrl}/SitePages/Portfolio-Profile.aspx?taskId=${data[1]?.Id}`}>
                                        {data[1]?.Title}
                                    </a>
                                </Label>
                            </Col>
                            <Col sm="1" md="1" lg="1">
                                <LuUndo2 size="25" />
                            </Col>
                        </Row> */}
                        <Row className="Metadatapannel">
                            <Col sm="5" md="5" lg="5" className="contentSec">
                                <div className="input-group">
                                    <label className="fw-semibold form-label me-2 mt-1">Component Title</label>
                                    <input type="text" defaultValue={data[0]?.Title} className="form-control" />
                                </div>
                            </Col>
                            <Col sm="1" md="1" lg="1" className="iconSec">
                                <div className="text-center">
                                    <div><FaLeftLong size="16" onClick={() => changeData(0, 'Title', data[1]?.Title)} /></div>
                                    <div><FaRightLong size="16" onClick={() => changeData(1, 'Title', data[0]?.Title)} /></div>
                                </div>
                            </Col>
                            <Col sm="5" md="5" lg="5" className="contentSec">
                                <div className="input-group">
                                    <label className="fw-semibold form-label me-2 mt-1">Component Title</label>
                                    <input type="text" defaultValue={data[1]?.Title} className="form-control" />
                                </div>
                            </Col>
                            <Col sm="1" md="1" lg="1" className="text-center iconSec">
                                <LuUndo2 size="25" onClick={() => undoChangescolumns('Title')} />
                            </Col>
                        </Row>
                        {/* <Row className="Metadatapannel ">
                            <Col sm="5" md="5" lg="5">
                                <label className="fw-semibold form-label">Shareweb Feedback Linked Component</label>
                                <span className="ms-3">{ }</span>
                            </Col>
                            <Col sm="1" md="1" lg="1">
                                <div className="text-center">
                                    <div><FaLeftLong size="16" /></div>
                                    <div><FaRightLong size="16" /></div>
                                </div>
                            </Col>
                            <Col sm="5" md="5" lg="5">
                                <label className="fw-semibold form-label">Shareweb Feedback Linked Component</label>
                                <span className="ms-3">{ }</span>
                            </Col>
                            <Col sm="1" md="1" lg="1">
                                <LuUndo2 size="25" />
                            </Col>
                        </Row> */}
                        <Row className="Metadatapannel ">
                            <Col sm="5" md="5" lg="5" className="contentSec">
                                <label className="fw-semibold form-label me-2">Tagged Documents</label>
                                <div className="my-1 SearchTableCategoryComponent">
                                    <div className="SpfxCheckRadio">
                                        {data[0]?.tagDoc?.length > 0 && data[0]?.tagDoc?.map((items: any) => {
                                            return (<div className="alignCenter">
                                                <input type="radio" checked={taggedItems?.Id === items?.Id ? true : false} name="radiodoc" onClick={() => handleRadioChange(items, 'tagDoc')} className="radio" />
                                                <a className="alignCenter" href={items?.EncodedAbsUrl}>
                                                    {items?.File_x0020_Type == "pdf" && <span className='svg__iconbox svg__icon--pdf' title="pdf"></span>}
                                                    {items?.File_x0020_Type == "docx" && <span className='svg__iconbox svg__icon--docx' title="docx"></span>}
                                                    {items?.File_x0020_Type == "csv" && <span className='svg__iconbox svg__icon--csv' title="csv"></span>}
                                                    {items?.File_x0020_Type == "xlsx" && <span className='svg__iconbox svg__icon--xlsx' title="xlsx"></span>}
                                                    {items?.File_x0020_Type == "jpeg" || items?.File_x0020_Type == "jpg " && <span className='svg__iconbox svg__icon--jpeg' title="jpeg"></span>}
                                                    {items?.File_x0020_Type == "ppt" || items?.File_x0020_Type == "pptx" && <span className='svg__iconbox svg__icon--ppt' title="ppt"></span>}
                                                    {items?.File_x0020_Type == "svg" && <span className='svg__iconbox svg__icon--svg' title="svg"></span>}
                                                    {items?.File_x0020_Type == "zip" && <span className='svg__iconbox svg__icon--zip' title="zip"></span>}
                                                    {items?.File_x0020_Type == "png" && <span className='svg__iconbox svg__icon--png' title="png"></span>}
                                                    {items?.File_x0020_Type == "txt" && <span style={{ width: "20px", height: "20px" }} className='svg__iconbox svg__icon--txt' title="txt"></span>}
                                                    {items?.File_x0020_Type == "smg" && <span className='svg__iconbox svg__icon--smg' title="smg"></span>}

                                                </a><a href={`${items?.EncodedAbsUrl}?web=1`} target="_blank" data-interception="off"> <span>{items?.Title}</span></a>
                                            </div>
                                            )
                                        })}
                                    </div></div>
                            </Col>
                            <Col sm="1" md="1" lg="1" className="iconSec">
                                <div className="text-center">
                                    <div><FaLeftLong size="16" onClick={() => taggedChildItems(0, 'tagDoc', data[1]?.tagDoc)} /></div>
                                    <div><FaRightLong size="16" onClick={() => taggedChildItems(1, 'tagDoc', data[0]?.tagDoc)} /></div>
                                </div>
                            </Col>
                            <Col sm="5" md="5" lg="5" className="contentSec">
                                <label className="fw-semibold form-label me-2">Tagged Documents</label>
                                <div className="my-1 SearchTableCategoryComponent">
                                    <div className="SpfxCheckRadio">
                                        {data[1]?.tagDoc?.length > 0 && data[1]?.tagDoc?.map((items: any) => {
                                            return (
                                                <div className="alignCenter">
                                                    <input type="radio" checked={taggedItems?.Id === items?.Id ? true : false} name="radiodoc" onClick={() => handleRadioChange(items, 'tagDoc')} className="radio" />
                                                    <a className="alignCenter" href={items?.EncodedAbsUrl}>
                                                        {items?.File_x0020_Type == "pdf" && <span className='svg__iconbox svg__icon--pdf' title="pdf"></span>}
                                                        {items?.File_x0020_Type == "docx" && <span className='svg__iconbox svg__icon--docx' title="docx"></span>}
                                                        {items?.File_x0020_Type == "csv" && <span className='svg__iconbox svg__icon--csv' title="csv"></span>}
                                                        {items?.File_x0020_Type == "xlsx" && <span className='svg__iconbox svg__icon--xlsx' title="xlsx"></span>}
                                                        {items?.File_x0020_Type == "jpeg" || items?.File_x0020_Type == "jpg " && <span className='svg__iconbox svg__icon--jpeg' title="jpeg"></span>}
                                                        {items?.File_x0020_Type == "ppt" || items?.File_x0020_Type == "pptx" && <span className='svg__iconbox svg__icon--ppt' title="ppt"></span>}
                                                        {items?.File_x0020_Type == "svg" && <span className='svg__iconbox svg__icon--svg' title="svg"></span>}
                                                        {items?.File_x0020_Type == "zip" && <span className='svg__iconbox svg__icon--zip' title="zip"></span>}
                                                        {items?.File_x0020_Type == "png" && <span className='svg__iconbox svg__icon--png' title="png"></span>}
                                                        {items?.File_x0020_Type == "txt" && <span className='svg__iconbox svg__icon--txt' title="txt"></span>}
                                                        {items?.File_x0020_Type == "smg" && <span className='svg__iconbox svg__icon--smg' title="smg"></span>}

                                                    </a><a href={`${items?.EncodedAbsUrl}?web=1`} target="_blank" data-interception="off"> <span>{items?.Title}</span></a>
                                                </div>
                                            )
                                        })}
                                    </div></div>
                            </Col>
                            <Col sm="1" md="1" lg="1" className="text-center iconSec">
                                <LuUndo2 size="25" onClick={() => undoChangescolumns('tagDoc')} />
                            </Col>
                        </Row>
                        {data[0]?.TaskType === undefined &&
                            <Row className="Metadatapannel">
                                <Col sm="5" md="5" lg="5" className="contentSec">
                                    <label className="fw-semibold form-label">Tagged Tasks</label>
                                    <div className="my-1 SearchTableCategoryComponent">
                                        <span className="ms-3"> {
                                            data[0]?.taggedTasks?.length > 0 && data[0]?.taggedTasks?.map((items: any) => {
                                                return <div className="SpfxCheckRadio alignCenter" key={items.Id}>
                                                    {items?.subRows && items?.subRows?.length > 0 ? (
                                                        <>
                                                            <span style={{ flex: "0 0 60px" }} onClick={() => toggleExpand(items, data[0], 'taggedTasks')}>  {items.isExpanded ? <SlArrowDown style={{ color: "#000" }} /> : <SlArrowRight style={{ color: "#000" }}></SlArrowRight>}</span>
                                                            <span className="me-1"><img className="workmember" src={items.SiteIcon}></img></span>  <div style={{ flex: "0 0 60px" }}>{items.TaskID}</div>
                                                            <input type="checkbox" checked={items.checked} className="form-check-input me-1 mt-0" name="radiotask1" onClick={() => handleCheckboxChange(0, items, undefined)} />
                                                            <span> <a target="_blank" className="mx-2" data-interception="off"
                                                                href={`${items.siteUrl}/SitePages/Task-Profile.aspx?taskId=${items?.Id}&Site=${items?.siteType}`}>
                                                                {items?.Title}
                                                            </a></span>
                                                            {items.isExpanded &&
                                                                <TreeNodeTasks items={items} taggedItems={data[0]} handleRadioChange={'taggedTasks'} />}
                                                        </>) : <>

                                                        <img className="workmember me-1" src={items.SiteIcon}></img>
                                                        <div style={{ flex: "0 0 60px" }}>{items.TaskID}</div>

                                                        <input type="checkbox" checked={items.checked} className="form-check-input mx-1 mt-0" name="radiotask1" onClick={() => handleCheckboxChange(0, items, undefined)} />

                                                        <a target="_blank" data-interception="off"
                                                            href={`${items.siteUrl}/SitePages/Task-Profile.aspx?taskId=${items?.Id}&Site=${items?.siteType}`}>
                                                            {items?.Title}
                                                        </a>

                                                    </>}
                                                </div>
                                            })
                                        }</span>
                                    </div>
                                </Col>
                                <Col sm="1" md="1" lg="1" className="iconSec">
                                    <div className="text-center">
                                        <div><FaLeftLong size="16" onClick={() => taggedChildItems(0, 'taggedTasks', data[1]?.taggedTasks)} /></div>
                                        <div><FaRightLong size="16" onClick={() => taggedChildItems(1, 'taggedTasks', data[0]?.taggedTasks)} /></div>
                                    </div>
                                </Col>
                                <Col sm="5" md="5" lg="5" className="contentSec">
                                    <label className="fw-semibold form-label">Tagged Tasks</label>
                                    <div className="my-1 SearchTableCategoryComponent"> {
                                        <span className="ms-3"> {
                                            data[1]?.taggedTasks?.length > 0 && data[1]?.taggedTasks?.map((items: any) => {
                                                return <div className="SpfxCheckRadio alignCenter" key={items.Id}>
                                                    {items?.subRows && items?.subRows?.length > 0 ? (
                                                        <>
                                                            <span style={{ flex: "0 0 60px" }} onClick={() => toggleExpand(items, data[1], 'taggedTasks')}>   {items.isExpanded ? <SlArrowDown style={{ color: "#000" }} /> : <SlArrowRight style={{ color: "#000" }}></SlArrowRight>}</span>
                                                            <span className="me-1"><img className="workmember" src={items.SiteIcon}></img></span>  <div style={{ flex: "0 0 60px" }}>{items.TaskID}</div>
                                                            <input type="checkbox" checked={items.checked} className="form-check-input me-1 mt-0" name="radiotask1" onClick={() => handleCheckboxChange(0, items, undefined)} />
                                                            <span> <a target="_blank" className="mx-2" data-interception="off"
                                                                href={`${items.siteUrl}/SitePages/Task-Profile.aspx?taskId=${items?.Id}&Site=${items?.siteType}`}>
                                                                {items?.Title}
                                                            </a></span>
                                                            {items.isExpanded &&
                                                                <TreeNodeTasks items={items} taggedItems={data[0]} handleRadioChange={'taggedTasks'} />}
                                                        </>) : <>

                                                        <img className="workmember me-1" src={items.SiteIcon}></img>
                                                        <div style={{ flex: "0 0 60px" }}>{items.TaskID}</div>
                                                        <input type="checkbox" checked={items.checked} className="form-check-input mx-1 mt-0" name="radiotask" onClick={() => handleCheckboxChange(1, items, 'taggedTask')} />
                                                        <a target="_blank" data-interception="off"
                                                            href={`${items.siteUrl}/SitePages/Task-Profile.aspx?taskId=${items?.Id}&Site=${items?.siteType}`}>
                                                            {items?.Title}
                                                        </a>

                                                    </>}
                                                </div>
                                            })
                                        }</span>}</div>
                                </Col>
                                <Col sm="1" md="1" lg="1" className="text-center iconSec">
                                    <LuUndo2 size="25" onClick={() => undoChangescolumns('taggedTasks')} />
                                </Col>
                            </Row>
                        }
                        <Row className="Metadatapannel">
                            <Col sm="5" md="5" lg="5" className="contentSec">
                                <label className="fw-semibold form-label">Team Leaders</label>
                                <div className="my-1 SearchTableCategoryComponent">
                                    {
                                        data[0]?.AssignToUsers?.length > 0 && data[0]?.AssignToUsers?.map((items: any) =>
                                            <span className="SpfxCheckRadio alignCenter">
                                                <input type="checkbox" className="form-check-input me-1 mt-0" onChange={() => handleCheckboxChange(0, items, 'AssignToUsers')} />
                                                <img className="workmember" src={items?.userImage} />
                                                <span className="ms-1">{items?.Title}</span>
                                            </span>)
                                    }</div>
                            </Col>
                            <Col sm="1" md="1" lg="1" className="iconSec">
                                <div className="text-center">
                                    <div><FaLeftLong size="16" onClick={() => taggedChildItems(0, 'AssignToUsers', data[1]?.AssignToUsers)} /></div>
                                    <div><FaRightLong size="16" onClick={() => taggedChildItems(1, 'AssignToUsers', data[0]?.AssignToUsers)} /></div>
                                </div>
                            </Col>
                            <Col sm="5" md="5" lg="5" className="contentSec">
                                <label className="fw-semibold form-label">Team Leaders</label>
                                <div className="my-1 SearchTableCategoryComponent">
                                    {
                                        data[1]?.AssignToUsers?.length > 0 && data[1]?.AssignToUsers?.map((items: any) =>
                                            <span className="SpfxCheckRadio alignCenter">
                                                <input type="checkbox" className="form-check-input me-1 mt-0" onChange={() => handleCheckboxChange(1, items, 'AssignToUsers')} />
                                                <img className="workmember" src={items?.userImage} />
                                                <span className="ms-1">{items?.Title}</span>
                                            </span>)
                                    }</div>
                            </Col>
                            <Col sm="1" md="1" lg="1" className="text-center iconSec">
                                <LuUndo2 size="25" onClick={() => undoChangescolumns('AssignToUsers')} />
                            </Col>
                        </Row>
                        {<Row className="Metadatapannel">
                            <Col sm="5" md="5" lg="5" className="contentSec">
                                {data[0]?.Item_x0020_Type === 'Task' ?
                                    <label className="fw-semibold form-label">TeamMembers</label>
                                    : <label className="fw-semibold form-label">Responsible Team</label>}
                                {
                                    data[0]?.TeamMembersUsers?.length > 0 && data[0]?.TeamMembersUsers?.map((items: any) =>
                                        <span className="SpfxCheckRadio alignCenter">
                                            <input type="checkbox" className="form-check-input me-1 mt-0" onChange={() => handleCheckboxChange(0, items, 'TeamMembersUsers')} />
                                            <img className="workmember" src={items?.userImage} />
                                            <span className="ms-1">{items?.Title}</span>
                                        </span>)
                                }
                            </Col>
                            <Col sm="1" md="1" lg="1" className="iconSec">
                                <div className="text-center">
                                    <div><FaLeftLong size="16" onClick={() => taggedChildItems(0, 'TeamMembersUsers', data[1]?.TeamMembersUsers)} /></div>
                                    <div><FaRightLong size="16" onClick={() => taggedChildItems(1, 'TeamMembersUsers', data[0]?.TeamMembersUsers)} /></div>
                                </div>
                            </Col>
                            <Col sm="5" md="5" lg="5" className="contentSec">
                                {data[0]?.Item_x0020_Type === 'Task' ?
                                    <label className="fw-semibold form-label">TeamMembers</label>
                                    : <label className="fw-semibold form-label">Responsible Team</label>}
                                {
                                    data[1]?.TeamMembersUsers?.length > 0 && data[1]?.TeamMembersUsers?.map((items: any) =>
                                        <span className="SpfxCheckRadio alignCenter">
                                            <input type="checkbox" className="form-check-input me-1 mt-0" onChange={() => handleCheckboxChange(1, items, 'TeamMembersUsers')} />
                                            <img className="workmember" src={items?.userImage} />
                                            <span className="ms-1">{items?.Title}</span>
                                        </span>)
                                }
                            </Col>
                            <Col sm="1" md="1" lg="1" className="text-center iconSec">
                                <LuUndo2 size="25" onClick={() => undoChangescolumns('TeamMembersUsers')} />
                            </Col>
                        </Row>}

                        {data[0]?.Item_x0020_Type === 'Task' && <Row className="Metadatapannel">
                            <Col sm="5" md="5" lg="5" className="contentSec">
                                <label className="fw-semibold form-label">Working Members</label>
                                {
                                    data[0]?.ResponsibileUsers?.length > 0 && data[0]?.ResponsibileUsers?.map((items: any) =>
                                        <span className="SpfxCheckRadio alignCenter">
                                            <input type="checkbox" className="form-check-input me-1" onChange={() => handleCheckboxChange(0, items, 'ResponsibileUsers')} />
                                            <img className="workmember" src={items?.userImage} />
                                            <span className="ms-1">{items?.Title}</span>
                                        </span>)
                                }
                            </Col>
                            <Col sm="1" md="1" lg="1" className="iconSec">
                                <div className="text-center">
                                    <div><FaLeftLong size="16" onClick={() => taggedChildItems(0, 'ResponsibileUsers', data[1]?.ResponsibileUsers)} /></div>
                                    <div><FaRightLong size="16" onClick={() => taggedChildItems(1, 'ResponsibileUsers', data[0]?.ResponsibileUsers)} /></div>
                                </div>
                            </Col>
                            <Col sm="5" md="5" lg="5" className="contentSec">
                                <label className="fw-semibold form-label">Working Members</label>
                                {
                                    data[1]?.ResponsibileUsers?.length > 0 && data[1]?.ResponsibileUsers?.map((items: any) =>
                                        <span className="SpfxCheckRadio alignCenter">
                                            <input type="checkbox" className="form-check-input me-1" onChange={() => handleCheckboxChange(1, items, 'ResponsibileUsers')} />
                                            <img className="workmember" src={items?.userImage} />
                                            <span className="ms-1">{items?.Title}</span>
                                        </span>)
                                }
                            </Col>
                            <Col sm="1" md="1" lg="1" className="text-center iconSec">
                                <LuUndo2 size="25" onClick={() => undoChangescolumns('ResponsibileUsers')} />
                            </Col>
                        </Row>}
                        {data[0]?.TaskType?.Id != undefined ?
                            <Row className="Metadatapannel">
                                <Col sm="5" md="5" lg="5" className="contentSec">
                                    <label className="fw-semibold form-label">Child Items</label>

                                    <div className="ms-3 SearchTableCategoryComponent my-1">
                                        <span className="ms-3">
                                            {data[0]?.subRows?.length > 0 &&
                                                data[0]?.subRows?.map((items: any) => (
                                                    <div className="SpfxCheckRadio alignCenter" key={items.Id}>
                                                        {items?.subRows && items?.subRows?.length > 0 ? (
                                                            <>
                                                                <span onClick={() => toggleExpand(items, data[0], 'subRows')}>    {items.isExpanded ? <SlArrowDown style={{ color: "#000" }} /> : <SlArrowRight style={{ color: "#000" }}></SlArrowRight>}</span>

                                                                <span className="me-1">
                                                                    <img className="workmember" src={items.SiteIcon} alt="Site Icon" />
                                                                </span>
                                                                <div style={{ flex: "0 0 60px" }}>{items.TaskID}</div>
                                                                <input type="radio" checked={taggedItems?.Id === items?.Id} name="radioCheck" onClick={() => handleRadioChange(items, 'taggedComponents')} className="radio" />
                                                                <span>
                                                                    <a target="_blank" className="mx-2" data-interception="off" href={`${items.siteUrl}/SitePages/Task-Profile.aspx?taskId=${items?.Id}&Site=${items?.siteType}`}  >
                                                                        {items?.Title}
                                                                    </a>
                                                                </span>
                                                                {items.isExpanded &&
                                                                    <TreeNode items={items} taggedItems={data[0]} handleRadioChange={'subRows'} />}
                                                            </>) :
                                                            <> <span className="me-1">
                                                                <img className="workmember" src={items.SiteIcon} alt="Site Icon" />
                                                            </span>
                                                                <span>{items.TaskID}</span>
                                                                <input type="radio" checked={taggedItems?.Id === items?.Id} name="radioCheck" onClick={() => handleRadioChange(items, 'taggedComponents')} className="radio" />
                                                                <span>
                                                                    <a target="_blank" className="mx-2" data-interception="off" href={`${items.siteUrl}/SitePages/Task-Profile.aspx?taskId=${items?.Id}&Site=${items?.siteType}`}  >
                                                                        {items?.Title}
                                                                    </a>
                                                                </span></>}
                                                    </div>
                                                ))}
                                        </span>

                                    </div>
                                </Col>
                                <Col sm="1" md="1" lg="1" className="iconSec">
                                    <div className="text-center">
                                        <div><FaLeftLong size="16" onClick={() => taggedChildItems(0, 'subRows', data[1]?.subRows)} /></div>
                                        <div><FaRightLong size="16" onClick={() => taggedChildItems(1, 'subRows', data[0]?.subRows)} /></div>
                                    </div>
                                </Col>
                                <Col sm="5" md="5" lg="5" className="contentSec">
                                    <label className="fw-semibold form-label">Child Items</label>
                                    <div className="ms-3 my-1 SearchTableCategoryComponent">
                                        <span className="ms-3">
                                            {data[1]?.subRows?.length > 0 &&
                                                data[1]?.subRows?.map((items: any) => (
                                                    <div className="SpfxCheckRadio alignCenter" key={items.Id}>
                                                        {items?.subRows && items?.subRows?.length > 0 ? (
                                                            <>
                                                                <span onClick={() => toggleExpand(items, data[1], 'subRows')}>    {items.isExpanded ? <SlArrowDown style={{ color: "#000" }} /> : <SlArrowRight style={{ color: "#000" }}></SlArrowRight>}</span>


                                                                <span className="me-1">
                                                                    <img className="workmember" src={items.SiteIcon} alt="Site Icon" />
                                                                </span>
                                                                <div style={{ flex: "0 0 60px" }}>{items.TaskID}</div>
                                                                <input type="radio" checked={taggedItems?.Id === items?.Id} name="radioCheck" onClick={() => handleRadioChange(items, 'taggedComponents')} className="radio" />
                                                                <span>
                                                                    <a target="_blank" className="mx-2" data-interception="off" href={`${items.siteUrl}/SitePages/Task-Profile.aspx?taskId=${items?.Id}&Site=${items?.siteType}`}  >
                                                                        {items?.Title}
                                                                    </a>
                                                                </span>
                                                                {items.isExpanded &&
                                                                    <TreeNode items={items} taggedItems={data[0]} handleRadioChange={'subRows'} />}
                                                            </>) :
                                                            <> <span className="me-1">
                                                                <img className="workmember" src={items.SiteIcon} alt="Site Icon" />
                                                            </span>
                                                                <span>{items.TaskID}</span>
                                                                <input type="radio" checked={taggedItems?.Id === items?.Id} name="radioCheck" onClick={() => handleRadioChange(items, 'taggedComponents')} className="radio" />
                                                                <span>
                                                                    <a target="_blank" className="mx-2" data-interception="off" href={`${items.siteUrl}/SitePages/Task-Profile.aspx?taskId=${items?.Id}&Site=${items?.siteType}`}  >
                                                                        {items?.Title}
                                                                    </a>
                                                                </span></>}
                                                    </div>
                                                ))}
                                        </span>
                                    </div>

                                </Col>
                                <Col sm="1" md="1" lg="1" className="text-center iconSec">
                                    <LuUndo2 size="25" onClick={() => undoChangescolumns('subRows')} />
                                </Col>
                            </Row> :
                            <Row className="Metadatapannel">
                                <Col sm="5" md="5" lg="5" className="contentSec">
                                    <label className="fw-semibold form-label">Child Items</label>
                                    <div className="ms-3 SearchTableCategoryComponent my-1"> {
                                        data[0]?.subRows?.length > 0 && data[0]?.subRows?.map((items: any) => {
                                            return <div className="SpfxCheckRadio alignCenter">
                                                <span className="Dyicons me-1">{items.IconTitle}</span>
                                                <input type="radio" checked={taggedItems?.Id === items?.Id ? true : false} name="radioCheck" onClick={() => handleRadioChange(items, 'taggedComponents')} className="radio" />
                                                <span> <a target="_blank" className="ms-2" data-interception="off"
                                                    href={`${items.siteUrl}/SitePages/Portfolio-Profile.aspx?taskId=${items?.Id}&Site=${items?.Id}`}>
                                                    {items?.Title}
                                                </a></span>
                                            </div>
                                        })
                                    }</div>
                                </Col>
                                <Col sm="1" md="1" lg="1" className="iconSec">
                                    <div className="text-center">
                                        <div><FaLeftLong size="16" onClick={() => taggedChildItems(0, 'subRows', data[1]?.subRows)} /></div>
                                        <div><FaRightLong size="16" onClick={() => taggedChildItems(1, 'subRows', data[0]?.subRows)} /></div>
                                    </div>
                                </Col>
                                <Col sm="5" md="5" lg="5" className="contentSec">
                                    <label className="fw-semibold form-label">Child Items</label>
                                    <div className="ms-3 SearchTableCategoryComponent my-1">{
                                        data[1]?.subRows?.length > 0 && data[1]?.subRows?.map((items: any) => {
                                            return <div className="SpfxCheckRadio alignCenter">
                                                <span className="Dyicons me-1">{items.IconTitle}</span>
                                                <input type="radio" checked={taggedItems?.Id === items?.Id ? true : false} name="radioCheck" onClick={() => handleRadioChange(items, 'taggedComponents')} className="radio" />
                                                <span> <a target="_blank" className="mx-2" data-interception="off"
                                                    href={`${items.siteUrl}/SitePages/Portfolio-Profile.aspx?taskId=${items?.Id}`}>
                                                    {items?.Title}
                                                </a></span>
                                            </div>
                                        })
                                    }</div>
                                </Col>
                                <Col sm="1" md="1" lg="1" className="text-center iconSec">
                                    <LuUndo2 size="25" onClick={() => undoChangescolumns('subRows')} />
                                </Col>
                            </Row>}
                        <Row className="Metadatapannel">
                            <Col sm="5" md="5" lg="5" className="sit-preview contentSec">
                                <label className="fw-semibold form-label">Image</label>
                                <span className="ms-3"><img src={data[0]?.Item_x002d_Image?.Url} /></span>
                            </Col>
                            <Col sm="1" md="1" lg="1" className="iconSec">
                                <div className="text-center">
                                    <div><FaLeftLong size="16" onClick={() => changeData(0, 'Item_x002d_Image', data[1]?.Item_x002d_Image)} /></div>
                                    <div><FaRightLong size="16" onClick={() => changeData(1, 'Item_x002d_Image', data[0]?.Item_x002d_Image)} /></div>
                                </div>
                            </Col>
                            <Col sm="5" md="5" lg="5" className="sit-preview contentSec">
                                <label className="fw-semibold form-label">Image</label>
                                <span className="ms-3"><img src={data[1]?.Item_x002d_Image?.Url} /></span>
                            </Col>
                            <Col sm="1" md="1" lg="1" className="text-center iconSec">
                                <LuUndo2 size="25" onClick={() => undoChangescolumns('Item_x002d_Image')} />
                            </Col>
                        </Row>
                        <Row className="Metadatapannel">
                            <Col sm="5" md="5" lg="5" className="contentSec">
                                <div className="input-group">
                                    <label className="fw-semibold full-width form-label">Categories</label>
                                    <input type="text" className="form-control" placeholder="Search Category Here" value={(autoSearch?.property + autoSearch?.itemIndex === 'TaskCategories0') ? categorySearchKey : ''} onChange={(e) => autoSuggestionsForCategory(e, 'TaskCategories', 0, AutoCompleteItemsArray)} />

                                    {data[0]?.TaskCategories != undefined && data[0]?.TaskCategories.map((type: any, index: number) => {
                                        return (
                                            <div className="block w-100">
                                                <a style={{ color: "#fff !important" }} className="textDotted" > {type.Title}</a>
                                                <span onClick={() => removeItem(type, 0, 'TaskCategories')} className="bg-light hreflink ml-auto svg__icon--cross svg__iconbox" >
                                                </span>
                                            </div>
                                        );
                                    }
                                    )}
                                    <span className="input-group-text">
                                        <span title="Edit Categories" onClick={() => openCategoryPicker(data[0], true, data[0]?.TaskCategories)} className="svg__iconbox svg__icon--editBox"></span>
                                    </span>
                                    {autoSearch?.itemIndex === 0 && autoSearch?.property === 'TaskCategories' && SearchedCategoryData?.length > 0 ? (
                                    <div className="SmartTableOnTaskPopup">
                                        <ul className="list-group hreflink scrollbar maXh-200">
                                            {SearchedCategoryData.map((item: any) => {
                                                return (
                                                    <li className="hreflink list-group-item rounded-0 p-1 list-group-item-action" key={item.id} onClick={() => setSelectedCategoryData([item], "For-Auto-Search")} >
                                                        <a>{item.Newlabel}</a>
                                                    </li>
                                                )
                                            }
                                            )}
                                        </ul>
                                    </div>) : null}
                                </div>
                                
                            </Col>
                            <Col sm="1" md="1" lg="1" className="iconSec">
                                <div className="text-center">
                                    <div><FaLeftLong size="16" onClick={() => changeData(0, 'TaskCategories', data[1]?.TaskCategories)} /></div>
                                    <div><FaRightLong size="16" onClick={() => changeData(1, 'TaskCategories', data[0]?.TaskCategories)} /></div>
                                </div>
                            </Col>
                            <Col sm="5" md="5" lg="5" className="contentSec">
                                <div className="input-group">
                                    <label className="fw-semibold full-width form-label">Categories</label>
                                    <input type="text" defaultValue={data[1]?.TaskCategories} className="form-control" placeholder="Search Category Here" value={(autoSearch?.property + autoSearch?.itemIndex === 'TaskCategories1') ? categorySearchKey : ''} onChange={(e) => autoSuggestionsForCategory(e, 'TaskCategories', 1, AutoCompleteItemsArray)} />

                                    {data[1]?.TaskCategories != undefined && data[1]?.TaskCategories.map((type: any, index: number) => {
                                        return (
                                            <div className="block w-100">
                                                <a style={{ color: "#fff !important" }} className="textDotted" > {type.Title}</a>
                                                <span onClick={() => removeItem(type, 1, 'TaskCategories')} className="bg-light hreflink ml-auto svg__icon--cross svg__iconbox" >
                                                </span>
                                            </div>
                                        );
                                    }
                                    )}
                                    <span className="input-group-text">
                                        <span title="Edit Categories" onClick={() => openCategoryPicker(data[1], true, data[1]?.TaskCategories)} className="svg__iconbox svg__icon--editBox"></span>
                                    </span>
                                    {autoSearch?.itemIndex === 1 && autoSearch?.property === 'TaskCategories' && SearchedCategoryData?.length > 0 ? (
                                    <div className="SmartTableOnTaskPopup">
                                        <ul className="list-group hreflink scrollbar maXh-200">
                                            {SearchedCategoryData.map((item: any) => {
                                                return (
                                                    <li className="hreflink list-group-item rounded-0 p-1 list-group-item-action" key={item.id} onClick={() => setSelectedCategoryData([item], "For-Auto-Search")} >
                                                        <a>{item.Newlabel}</a>
                                                    </li>
                                                )
                                            }
                                            )}
                                        </ul>
                                    </div>) : null}
                                </div>
                                
                            </Col>
                            <Col sm="1" md="1" lg="1" className="text-center iconSec">
                                <LuUndo2 size="25" onClick={() => undoChangescolumns('TaskCategories')} />
                            </Col>
                        </Row>
                        <Row className="Metadatapannel">
                            <Col sm="5" md="5" lg="5" className="contentSec">
                                <div className="input-group">
                                    <label className="fw-semibold full-width form-label">Client Categories</label>
                                    <input type="text" className="form-control" placeholder="Search Category Here" value={(autoSearch?.property + autoSearch?.itemIndex === 'ClientCategory0') ? categorySearchKey : ''} onChange={(e) => autoSuggestionsForCategory(e, 'ClientCategory', 0, AllMasterTasksItems?.AllData)} />
                                    {data[0]?.ClientCategory != undefined && data[0]?.ClientCategory.map((type: any, index: number) => {
                                        return (
                                            <div className="block w-100">
                                                <a style={{ color: "#fff !important" }} className="textDotted" > {type.Title}</a>
                                                <span onClick={() => removeItem(type, 0, 'ClientCategory')} className="bg-light hreflink ml-auto svg__icon--cross svg__iconbox" >
                                                </span>
                                            </div>
                                        );
                                    }
                                    )}
                                    <span className="input-group-text">
                                        <span title="Edit Categories" onClick={() => EditClientCategory(data[0], true, 'ClientCategory')} className="svg__iconbox svg__icon--editBox"></span>
                                    </span>
                                    {autoSearch?.itemIndex === 0 && autoSearch?.property === 'ClientCategory' && SmartMetaDataAllItems?.ClientCategory?.length > 0 ? (
                                    <div className="SmartTableOnTaskPopup">
                                        <ul className="list-group hreflink scrollbar maXh-200">
                                            {SmartMetaDataAllItems?.ClientCategory.map((item: any) => {
                                                return (
                                                    <li className="hreflink list-group-item p-1 rounded-0 list-group-item-action" key={item.id} onClick={() => setSelectedCategoryData([item], "For-Auto-Search")} >
                                                        <a>{item.newTitle}</a>
                                                    </li>
                                                )
                                            }
                                            )}
                                        </ul>
                                    </div>) : null}
                                </div>
                                
                            </Col>
                            <Col sm="1" md="1" lg="1" className="iconSec">
                                <div className="text-center">
                                    <div><FaLeftLong size="16" onClick={() => changeData(0, 'ClientCategory', data[1]?.ClientCategory)} /></div>
                                    <div><FaRightLong size="16" onClick={() => changeData(1, 'ClientCategory', data[0]?.ClientCategory)} /></div>
                                </div>
                            </Col>
                            <Col sm="5" md="5" lg="5" className="contentSec">
                                <div className="input-group">
                                    <label className="fw-semibold full-width form-label">Client Categories</label>
                                    <input type="text" className="form-control" placeholder="Search Category Here" value={(autoSearch?.property + autoSearch?.itemIndex === 'ClientCategory1') ? categorySearchKey : ''} onChange={(e) => autoSuggestionsForCategory(e, 'ClientCategory', 1, AllMasterTasksItems?.AllData)} />

                                    {data[1]?.ClientCategory != undefined && data[1]?.ClientCategory.map((type: any, index: number) => {
                                        return (
                                            <div className="block w-100">
                                                <a style={{ color: "#fff !important" }} className="textDotted" > {type.Title}</a>
                                                <span onClick={() => removeItem(type, 1, 'ClientCategory')} className="bg-light hreflink ml-auto svg__icon--cross svg__iconbox" >
                                                </span>
                                            </div>
                                        );
                                    }
                                    )}
                                    <span className="input-group-text">
                                        <span title="Edit Categories" onClick={() => EditClientCategory(data[1], true, 'ClientCategory')} className="svg__iconbox svg__icon--editBox"></span>
                                    </span>
                                    {autoSearch?.itemIndex === 1 && autoSearch?.property === 'ClientCategory' && SmartMetaDataAllItems?.ClientCategory?.length > 0 ? (
                                    <div className="SmartTableOnTaskPopup">
                                        <ul className="list-group hreflink scrollbar maXh-200">
                                            {SmartMetaDataAllItems?.ClientCategory?.map((item: any) => {
                                                return (
                                                    <li className="hreflink list-group-item p-1 rounded-0 list-group-item-action" key={item.id} onClick={() => setSelectedCategoryData([item], "For-Auto-Search")} >
                                                        <a>{item.newTitle}</a>
                                                    </li>
                                                )
                                            }
                                            )}
                                        </ul>
                                    </div>) : null}
                                </div>
                               
                            </Col>
                            <Col sm="1" md="1" lg="1" className="text-center iconSec">
                                <LuUndo2 size="25" onClick={() => undoChangescolumns('ClientCategory')} />
                            </Col>
                        </Row>
                        <Row className="Metadatapannel">
                            <Col sm="5" md="5" lg="5" className="contentSec">
                                <div className="input-group">
                                    <label className="fw-semibold full-width form-label">Portfolio Item</label>
                                    <input type="text" defaultValue={data[1]?.TaskCategories} className="form-control" placeholder="Search Portfolio Here" value={(autoSearch?.property + autoSearch?.itemIndex === 'PortfolioItem0') ? categorySearchKey : ''} onChange={(e) => autoSuggestionsForCategory(e, 'PortfolioItem', 0, AllMasterTasksItems?.AllData)} />
                                    {data[0]?.PortfolioItem != undefined && data[0]?.PortfolioItem.map((type: any, index: number) => {
                                        return (
                                            <div className="block w-100">
                                                <a style={{ color: "#fff !important" }} className="textDotted" > {type.Title}</a>
                                                <span onClick={() => removeItem(type, 0, 'PortfolioItem')} className="bg-light hreflink ml-auto svg__icon--cross svg__iconbox" >
                                                </span>
                                            </div>
                                        );
                                    }
                                    )}
                                    <span className="input-group-text">
                                        <span title="Edit Categories" onClick={() => OpenComponentPicker(data[0], true, 'PortfolioItem')} className="svg__iconbox svg__icon--editBox"></span>
                                    </span>
                                    {autoSearch?.itemIndex === 0 && autoSearch?.property === 'PortfolioItem' && AllMasterTasksItems?.ProjectData?.length > 0 ? (
                                    <div className="SmartTableOnTaskPopup">
                                        <ul className="list-group hreflink scrollbar maXh-200">
                                            {AllMasterTasksItems?.ProjectData.map((item: any) => {
                                                return (
                                                    <li className="hreflink list-group-item rounded-0 p-1 list-group-item-action" key={item.id} onClick={() => setSelectedCategoryData([item], "For-Auto-Search")} >
                                                        <a>{item.Newlabel || item.Path}</a>
                                                    </li>
                                                )
                                            }
                                            )}
                                        </ul>
                                    </div>) : null}
                                </div>
                                
                            </Col>
                            <Col sm="1" md="1" lg="1" className="iconSec">
                                <div className="text-center">
                                    <div><FaLeftLong size="16" onClick={() => changeData(0, 'PortfolioItem', data[1]?.PortfolioItem)} /></div>
                                    <div><FaRightLong size="16" onClick={() => changeData(1, 'PortfolioItem', data[0]?.PortfolioItem)} /></div>
                                </div>
                            </Col>
                            <Col sm="5" md="5" lg="5" className="contentSec">
                                <div className="input-group">
                                    <label className="fw-semibold full-width form-label">Portfolio Item</label>
                                    <input type="text" className="form-control" placeholder="Search Portfolio Here" value={(autoSearch?.property + autoSearch?.itemIndex === 'PortfolioItem1') ? categorySearchKey : ''} onChange={(e) => autoSuggestionsForCategory(e, 'PortfolioItem', 1, AllMasterTasksItems?.AllData)} />

                                    {data[1]?.PortfolioItem != undefined && data[1]?.PortfolioItem.map((type: any, index: number) => {
                                        return (
                                            <div className="block w-100">
                                                <a style={{ color: "#fff !important" }} className="textDotted" > {type.Title}</a>
                                                <span onClick={() => removeItem(type, 1, 'PortfolioItem')} className="bg-light hreflink ml-auto svg__icon--cross svg__iconbox" >
                                                </span>
                                            </div>
                                        );
                                    }
                                    )}
                                    <span className="input-group-text">
                                        <span title="Edit Categories" onClick={() => OpenComponentPicker(data[1], true, 'PortfolioItem')} className="svg__iconbox svg__icon--editBox"></span>
                                    </span>
                                    {autoSearch?.itemIndex === 1 && autoSearch?.property === 'PortfolioItem' && AllMasterTasksItems?.AllData?.length > 0 ? (
                                    <div className="SmartTableOnTaskPopup">
                                        <ul className="list-group hreflink scrollbar maXh-200">
                                            {AllMasterTasksItems?.AllData.map((item: any) => {
                                                return (
                                                    <li className="hreflink list-group-item p-1 rounded-0 list-group-item-action" key={item.id} onClick={() => setSelectedCategoryData([item], "For-Auto-Search")} >
                                                        <a>{item.Newlabel || item.Path}</a>
                                                    </li>
                                                )
                                            }
                                            )}
                                        </ul>
                                    </div>) : null}
                                </div>
                                
                            </Col>
                            <Col sm="1" md="1" lg="1" className="text-center iconSec">
                                <LuUndo2 size="25" onClick={() => undoChangescolumns('PortfolioItem')} />
                            </Col>
                        </Row>
                        <Row className="Metadatapannel">
                            <Col sm="5" md="5" lg="5" className="contentSec">
                                <div className="input-group">
                                    <label className="fw-semibold full-width form-label">Feature Type</label>
                                    <input type="text" defaultValue={data[1]?.TaskCategories} className="form-control" placeholder="Search Feature Type Here" value={(autoSearch?.property + autoSearch?.itemIndex === 'FeatureType0') ? categorySearchKey : ''} onChange={(e) => autoSuggestionsForCategory(e, 'FeatureType', 0, AllMasterTasksItems?.AllData)} />
                                    {data[0]?.FeatureType != undefined && data[0]?.FeatureType?.map((type: any, index: number) => {
                                        return (
                                            <div className="block w-100">
                                                <a style={{ color: "#fff !important" }} className="textDotted" > {type.Title}</a>
                                                <span onClick={() => removeItem(type, 0, 'FeatureType')} className="bg-light hreflink ml-auto svg__icon--cross svg__iconbox" >
                                                </span>
                                            </div>
                                        );
                                    }
                                    )}
                                    <span className="input-group-text">
                                        <span title="Edit Categories" onClick={() => OpenComponentPicker(data[0], true, 'FeatureType')} className="svg__iconbox svg__icon--editBox"></span>
                                    </span>
                                    {autoSearch?.itemIndex === 0 && autoSearch?.property === 'FeatureType' && SmartMetaDataAllItems?.AllFeatureTypeData?.length > 0 ? (
                                    <div className="SmartTableOnTaskPopup">
                                        <ul className="list-group hreflink scrollbar maXh-200">
                                            {SmartMetaDataAllItems?.AllFeatureTypeData?.map((item: any) => {
                                                return (
                                                    <li className="hreflink list-group-item rounded-0 p-1 list-group-item-action" key={item.id} onClick={() => setSelectedCategoryData([item], "For-Auto-Search")} >
                                                        <a>{item.Title}</a>
                                                    </li>
                                                )
                                            }
                                            )}
                                        </ul>
                                    </div>) : null}
                                </div>
                               
                            </Col>
                            <Col sm="1" md="1" lg="1" className="iconSec">
                                <div className="text-center">
                                    <div><FaLeftLong size="16" onClick={() => changeData(0, 'FeatureType', data[1]?.FeatureType)} /></div>
                                    <div><FaRightLong size="16" onClick={() => changeData(1, 'FeatureType', data[0]?.FeatureType)} /></div>
                                </div>
                            </Col>
                            <Col sm="5" md="5" lg="5" className="contentSec">
                                <div className="input-group">
                                    <label className="fw-semibold full-width form-label">Feature Type</label>
                                    <input type="text" className="form-control" placeholder="Search Feature Type Here" value={(autoSearch?.property + autoSearch?.itemIndex === 'FeatureType1') ? categorySearchKey : ''} onChange={(e) => autoSuggestionsForCategory(e, 'FeatureType', 1, AllMasterTasksItems?.AllData)} />

                                    {data[1]?.FeatureType != undefined && data[1]?.FeatureType?.map((type: any, index: number) => {
                                        return (
                                            <div className="block w-100">
                                                <a style={{ color: "#fff !important" }} className="textDotted" > {type.Title}</a>
                                                <span onClick={() => removeItem(type, 1, 'FeatureType')} className="bg-light hreflink ml-auto svg__icon--cross svg__iconbox" >
                                                </span>
                                            </div>
                                        );
                                    }
                                    )}
                                    <span className="input-group-text">
                                        <span title="Edit Categories" onClick={() => OpenComponentPicker(data[1], true, 'FeatureType')} className="svg__iconbox svg__icon--editBox"></span>
                                    </span>
                                    {autoSearch?.itemIndex === 1 && autoSearch?.property === 'FeatureType' && SmartMetaDataAllItems?.AllFeatureTypeData?.length > 0 ? (
                                    <div className="SmartTableOnTaskPopup">
                                        <ul className="list-group hreflink scrollbar maXh-200">
                                            {SmartMetaDataAllItems?.AllFeatureTypeData?.map((item: any) => {
                                                return (
                                                    <li className="hreflink list-group-item p-1 rounded-0 list-group-item-action" key={item.id} onClick={() => setSelectedCategoryData([item], "For-Auto-Search")} >
                                                        <a>{item.Title}</a>
                                                    </li>
                                                )
                                            }
                                            )}
                                        </ul>
                                    </div>) : null}
                                </div>
                               
                            </Col>
                            <Col sm="1" md="1" lg="1" className="text-center iconSec">
                                <LuUndo2 size="25" onClick={() => undoChangescolumns('FeatureType')} />
                            </Col>
                        </Row>
                        <Row className="Metadatapannel">
                            <Col sm="5" md="5" lg="5" className="contentSec">
                                <div className="input-group">
                                    <label className="fw-semibold full-width form-label">Project</label>
                                    <input type="text" className="form-control" placeholder="Search Project Here" value={(autoSearch?.property + autoSearch?.itemIndex === 'ProjectItem0') ? categorySearchKey : ''} onChange={(e) => autoSuggestionsForCategory(e, 'ProjectItem', 0, AllMasterTasksItems?.ProjectData)} />
                                    {data[0]?.ProjectItem != undefined && data[0]?.ProjectItem.map((type: any, index: number) => {
                                        return (
                                            <div className="block w-100">
                                                <a style={{ color: "#fff !important" }} className="textDotted" > {type.Title}</a>
                                                <span onClick={() => removeItem(type, 0, 'ProjectItem')} className="bg-light hreflink ml-auto svg__icon--cross svg__iconbox" >
                                                </span>
                                            </div>
                                        );
                                    }
                                    )}
                                    <span className="input-group-text">
                                        <span title="Edit Project" onClick={() => OpenComponentPicker(data[0], true, 'ProjectItem')} className="svg__iconbox svg__icon--editBox"></span>
                                    </span>
                                    {autoSearch?.itemIndex === 0 && autoSearch?.property === 'ProjectItem' && AllMasterTasksItems?.ProjectData?.length > 0 ? (
                                    <div className="SmartTableOnTaskPopup">
                                        <ul className="list-group hreflink scrollbar maXh-200">
                                            {AllMasterTasksItems?.ProjectData.map((item: any) => {
                                                return (
                                                    <li className="hreflink list-group-item rounded-0 p-1 list-group-item-action" key={item.id} onClick={() => setSelectedCategoryData([item], "For-Auto-Search")} >
                                                        <a>{item.Newlabel || item.Path}</a>
                                                    </li>
                                                )
                                            }
                                            )}
                                        </ul>
                                    </div>) : null}
                                </div>
                                
                            </Col>
                            <Col sm="1" md="1" lg="1" className="iconSec">
                                <div className="text-center">
                                    <div><FaLeftLong size="16" onClick={() => changeData(0, 'ProjectItem', data[1]?.ProjectItem)} /></div>
                                    <div><FaRightLong size="16" onClick={() => changeData(1, 'ProjectItem', data[0]?.ProjectItem)} /></div>
                                </div>
                            </Col>
                            <Col sm="5" md="5" lg="5" className="contentSec">
                                <div className="input-group">
                                    <label className="fw-semibold full-width form-label">Project</label>
                                    <input type="text" className="form-control" placeholder="Search Project Here" value={(autoSearch?.property + autoSearch?.itemIndex === 'ProjectItem1') ? categorySearchKey : ''} onChange={(e) => autoSuggestionsForCategory(e, 'ProjectItem', 1, AllMasterTasksItems?.ProjectData)} />
                                    {data[1]?.ProjectItem != undefined && data[1]?.ProjectItem.map((type: any, index: number) => {
                                        return (
                                            <div className="block w-100">
                                                <a style={{ color: "#fff !important" }} className="textDotted" > {type.Title}</a>
                                                <span onClick={() => removeItem(type, 1, 'ProjectItem')} className="bg-light hreflink ml-auto svg__icon--cross svg__iconbox" >
                                                </span>
                                            </div>
                                        );
                                    }
                                    )}
                                    <span className="input-group-text">
                                        <span title="Edit Project" onClick={() => OpenComponentPicker(data[1], true, 'ProjectItem')} className="svg__iconbox svg__icon--editBox"></span>
                                    </span>
                                </div>
                                {autoSearch?.itemIndex === 1 && autoSearch?.property === 'ProjectItem' && AllMasterTasksItems?.ProjectData?.length > 0 ? (
                                    <div className="SmartTableOnTaskPopup">
                                        <ul className="list-group hreflink scrollbar maXh-200">
                                            {AllMasterTasksItems?.ProjectData.map((item: any) => {
                                                return (
                                                    <li className="hreflink list-group-item rounded-0 p-1 list-group-item-action" key={item.id} onClick={() => setSelectedCategoryData([item], "For-Auto-Search")} >
                                                        <a>{item.Newlabel || item.Path}</a>
                                                    </li>
                                                )
                                            }
                                            )}
                                        </ul>
                                    </div>) : null}
                            </Col>
                            <Col sm="1" md="1" lg="1" className="text-center iconSec">
                                <LuUndo2 size="25" onClick={() => undoChangescolumns('ProjectItem')} />
                            </Col>
                        </Row>
                        <Row className="Metadatapannel">
                            <Col sm="5" md="5" lg="5" className="contentSec">
                                <div className="input-group">
                                    <label className="fw-semibold full-width form-label">Due Date</label>
                                    <DatePicker selected={data[0]?.DueDate} data-input-type="First" onChange={(date: any) => changeData(0, 'DueDate', date)} dateFormat="dd/MM/yyyy" // Format as DD/MM/YYYY
                                        className="form-control date-picker" id="5" popperPlacement="bottom-start" customInput={<CustomCompletedDateFirst />}
                                    />
                                </div>
                            </Col>
                            <Col sm="1" md="1" lg="1" className="iconSec">
                                <div className="text-center">
                                    <div><FaLeftLong size="16" onClick={() => changeData(0, 'DueDate', data[1]?.DueDate)} /></div>
                                    <div><FaRightLong size="16" onClick={() => changeData(1, 'DueDate', data[0]?.DueDate)} /></div>
                                </div>
                            </Col>
                            <Col sm="5" md="5" lg="5" className="contentSec">
                                <div className="input-group">
                                    <label className="fw-semibold full-width form-label">Due Date</label>
                                    <DatePicker selected={data[1]?.DueDate} data-input-type="Second" onChange={(date: any) => changeData(1, 'DueDate', date)} dateFormat="dd/MM/yyyy" // Format as DD/MM/YYYY
                                        className="form-control date-picker" id="6" popperPlacement="bottom-start" customInput={<CustomCompletedDateFirst />}
                                    />
                                </div>
                            </Col>
                            <Col sm="1" md="1" lg="1" className="text-center iconSec">
                                <LuUndo2 size="25" onClick={() => undoChangescolumns('DueDate')} />
                            </Col>
                        </Row>

                        <Row className="Metadatapannel">
                            <Col sm="5" md="5" lg="5" className="contentSec">
                                <div className="input-group">
                                    <label className="fw-semibold full-width form-label">StartDate</label>
                                    <DatePicker selected={data[0]?.StartDate} data-input-type="First" onChange={(date: any) => changeData(0, 'StartDate', date)} dateFormat="dd/MM/yyyy" // Format as DD/MM/YYYY
                                        className="form-control date-picker" id="3" popperPlacement="bottom-start" customInput={<CustomCompletedDateFirst />}
                                    />
                                </div>
                            </Col>
                            <Col sm="1" md="1" lg="1" className="iconSec">
                                <div className="text-center">
                                    <div><FaLeftLong size="16" onClick={() => changeData(0, 'StartDate', data[1]?.StartDate)} /></div>
                                    <div><FaRightLong size="16" onClick={() => changeData(1, 'StartDate', data[0]?.StartDate)} /></div>
                                </div>
                            </Col>
                            <Col sm="5" md="5" lg="5" className="contentSec">
                                <div className="input-group">
                                    <label className="fw-semibold full-width form-label">StartDate</label>
                                    <DatePicker selected={data[1]?.StartDate} data-input-type="Second" onChange={(date: any) => changeData(1, 'StartDate', date)} dateFormat="dd/MM/yyyy" // Format as DD/MM/YYYY
                                        className="form-control date-picker" id="4" popperPlacement="bottom-start" customInput={<CustomCompletedDateFirst />}
                                    />
                                </div>
                            </Col>
                            <Col sm="1" md="1" lg="1" className="text-center iconSec">
                                <LuUndo2 size="25" onClick={() => undoChangescolumns('StartDate')} />
                            </Col>
                        </Row>

                        <Row className="Metadatapannel">
                            <Col sm="5" md="5" lg="5" className="contentSec">
                                <div className="input-group">
                                    <label className="fw-semibold full-width form-label">Completion Date</label>
                                    <DatePicker selected={data[0]?.CompletedDate} data-input-type="First" onChange={(date: any) => changeData(0, 'CompletedDate', date)} dateFormat="dd/MM/yyyy" // Format as DD/MM/YYYY
                                        className="form-control date-picker" id="1" popperPlacement="bottom-start" customInput={<CustomCompletedDateFirst />}
                                    />
                                </div>
                            </Col>
                            <Col sm="1" md="1" lg="1" className="iconSec">
                                <div className="text-center">
                                    <div><FaLeftLong size="16" onClick={() => changeData(0, 'CompletedDate', data[1]?.CompletedDate)} /></div>
                                    <div><FaRightLong size="16" onClick={() => changeData(1, 'CompletedDate', data[0]?.CompletedDate)} /></div>
                                </div>
                            </Col>
                            <Col sm="5" md="5" lg="5" className="contentSec">
                                <div className="input-group">
                                    <label className="fw-semibold full-width form-label">Completion Date</label>
                                    <DatePicker selected={data[1]?.CompletedDate} data-input-type="Second" onChange={(date: any) => changeData(1, 'CompletedDate', date)} dateFormat="dd/MM/yyyy" // Format as DD/MM/YYYY
                                        className="form-control date-picker" id="2" popperPlacement="bottom-start" customInput={<CustomCompletedDateFirst />}
                                    />
                                </div>
                            </Col>
                            <Col sm="1" md="1" lg="1" className="text-center iconSec">
                                <LuUndo2 size="25" onClick={() => undoChangescolumns('CompletedDate')} />
                            </Col>
                        </Row>

                        <Row className="Metadatapannel">
                            <Col sm="5" md="5" lg="5" className="contentSec">
                                <label className="fw-semibold full-width form-label">Item Rank</label>
                                <div className="alignCenter" key={data[0]}>
                                    <Col sm="10" md="10" lg="10">
                                        <Dropdown className='full-width'
                                            id="ItemRankUpload"
                                            options={ItemRankArray.map((rank: any) => ({ key: rank?.rank, text: rank?.rankTitle }))}
                                            selectedKey={data[0]?.ItemRank}
                                            onChange={(e, option) => changeData(0, 'ItemRank', option.key)}
                                            styles={{ dropdown: { width: '100%' } }}
                                        />

                                    </Col>
                                    <Col sm="2" md="2" lg="2">
                                        <div key={data[0]?.ItemRank} className="input-group ps-3">
                                            <input type="text" className="form-control" defaultValue={data[0]?.ItemRank} onChange={(e) => changeData(0, 'ItemRank', e.target.value)} />
                                        </div>
                                    </Col>
                                </div>
                            </Col>
                            <Col sm="1" md="1" lg="1" className="iconSec">
                                <div className="text-center">
                                    <div><FaLeftLong size="16" onClick={() => changeData(0, 'ItemRank', data[1]?.ItemRank)} /></div>
                                    <div><FaRightLong size="16" onClick={() => changeData(1, 'ItemRank', data[0]?.ItemRank)} /></div>
                                </div>
                            </Col>
                            <Col sm="5" md="5" lg="5" className="contentSec">
                                <label className="fw-semibold full-width form-label">Item Rank</label>
                                <div className="alignCenter" key={data[1]}>
                                    <Col sm="10" md="10" lg="10">
                                        <Dropdown className='full-width'
                                            id="ItemRankUpload"
                                            options={ItemRankArray.map((rank: any) => ({ key: rank?.rank, text: rank?.rankTitle }))}
                                            selectedKey={data[1]?.ItemRank}
                                            onChange={(e, option) => changeData(1, 'ItemRank', option.key)}
                                            styles={{ dropdown: { width: '100%' } }}
                                        />

                                    </Col>
                                    <Col sm="2" md="2" lg="2">
                                        <div key={data[1]?.ItemRank} className="input-group ps-3">
                                            <input type="text" className="form-control" defaultValue={data[1]?.ItemRank} onChange={(e) => changeData(1, 'ItemRank', e.target.value)} />
                                        </div>
                                    </Col>
                                </div>
                            </Col>
                            <Col sm="1" md="1" lg="1" className="text-center iconSec">
                                <LuUndo2 size="25" onClick={() => undoChangescolumns('ItemRank')} />
                            </Col>
                        </Row>
                        <Row className="Metadatapannel">
                            <Col sm="5" md="5" lg="5" className="contentSec">
                                <div className="input-group">
                                    <label className="fw-semibold full-width form-label">Time</label>
                                    <input type="text" className="form-control" defaultValue={data[0]?.Mileage} />
                                </div>
                            </Col>
                            <Col sm="1" md="1" lg="1" className="iconSec">
                                <div className="text-center">
                                    <div><FaLeftLong size="16" onClick={() => changeData(0, 'Mileage', data[1]?.Mileage)} /></div>
                                    <div><FaRightLong size="16" onClick={() => changeData(1, 'Mileage', data[0]?.Mileage)} /></div>
                                </div>
                            </Col>
                            <Col sm="5" md="5" lg="5" className="contentSec">
                                <div className="input-group">
                                    <label className="fw-semibold full-width form-label">Time</label>
                                    <input type="text" className="form-control" defaultValue={data[1]?.Mileage} />
                                </div>
                            </Col>
                            <Col sm="1" md="1" lg="1" className="text-center iconSec">
                                <LuUndo2 size="25" onClick={() => undoChangescolumns('Mileage')} />
                            </Col>
                        </Row>
                        <Row className="Metadatapannel">
                            <Col sm="5" md="5" lg="5" className="contentSec">
                                <div className="input-group">
                                    <label className="fw-semibold full-width form-label">Priority Rank</label>
                                    <input type="text" className="form-control" defaultValue={data[0]?.PriorityRank} />
                                </div>
                            </Col>
                            <Col sm="1" md="1" lg="1" className="iconSec">
                                <div className="text-center">
                                    <div><FaLeftLong size="16" onClick={() => changeData(0, 'PriorityRank', data[1]?.PriorityRank)} /></div>
                                    <div><FaRightLong size="16" onClick={() => changeData(1, 'PriorityRank', data[0]?.PriorityRank)} /></div>
                                </div>
                            </Col>
                            <Col sm="5" md="5" lg="5" className="contentSec">
                                <div className="input-group">
                                    <label className="fw-semibold full-width form-label">Priority Rank</label>
                                    <input type="text" className="form-control" defaultValue={data[1]?.PriorityRank} />
                                </div>
                            </Col>
                            <Col sm="1" md="1" lg="1" className="text-center iconSec">
                                <LuUndo2 size="25" onClick={() => undoChangescolumns('PriorityRank')} />
                            </Col>
                        </Row>
                        <Row className="Metadatapannel">
                            <Col sm="5" md="5" lg="5" className="contentSec">
                                <div className="input-group">
                                    <label className="fw-semibold full-width form-label">Client Activity</label>
                                    <input type="text" className="form-control" defaultValue={data[0]?.ClientActivity} />
                                </div>
                            </Col>
                            <Col sm="1" md="1" lg="1" className="iconSec">
                                <div className="text-center">
                                    <div><FaLeftLong size="16" onClick={() => changeData(0, 'ClientActivity', data[1]?.ClientActivity)} /></div>
                                    <div><FaRightLong size="16" onClick={() => changeData(1, 'ClientActivity', data[0]?.ClientActivity)} /></div>
                                </div>
                            </Col>
                            <Col sm="5" md="5" lg="5" className="contentSec">
                                <div className="input-group">
                                    <label className="fw-semibold full-width form-label">Client Activity</label>
                                    <input type="text" className="form-control" defaultValue={data[1]?.ClientActivity} />
                                </div>
                            </Col>
                            <Col sm="1" md="1" lg="1" className="text-center iconSec">
                                <LuUndo2 size="25" onClick={() => undoChangescolumns('ClientActivity')} />
                            </Col>
                        </Row>
                        <Row className="Metadatapannel">
                            <Col sm="5" md="5" lg="5" className="contentSec">
                                <div className="input-group">
                                    <label className="fw-semibold full-width form-label">Status</label>
                                    <input type="text" className="form-control" defaultValue={data[0]?.Status} />
                                </div>
                            </Col>
                            <Col sm="1" md="1" lg="1" className="iconSec">
                                <div className="text-center">
                                    <div><FaLeftLong size="16" onClick={() => changeData(0, 'Status', data[1]?.Status)} /></div>
                                    <div><FaRightLong size="16" onClick={() => changeData(1, 'Status', data[0]?.Status)} /></div>
                                </div>
                            </Col>
                            <Col sm="5" md="5" lg="5" className="contentSec">
                                <div className="input-group">
                                    <label className="fw-semibold full-width form-label">Status</label>
                                    <input type="text" className="form-control" defaultValue={data[1]?.Status} />
                                </div>
                            </Col>
                            <Col sm="1" md="1" lg="1" className="text-center iconSec">
                                <LuUndo2 size="25" onClick={() => undoChangescolumns('Status')} />
                            </Col>
                        </Row>
                        <Row className="Metadatapannel">
                            <Col sm="5" md="5" lg="5" className="contentSec">
                                <div className="input-group">
                                    <label className="fw-semibold full-width form-label">Url</label>
                                    <input type="text" className="form-control" defaultValue={data[0]?.ComponentLink?.Url} />
                                </div>
                            </Col>
                            <Col sm="1" md="1" lg="1" className="iconSec">
                                <div className="text-center">
                                    <div><FaLeftLong size="16" onClick={() => changeData(0, 'ComponentLink', data[1]?.ComponentLink)} /></div>
                                    <div><FaRightLong size="16" onClick={() => changeData(1, 'ComponentLink', data[0]?.ComponentLink)} /></div>
                                </div>
                            </Col>
                            <Col sm="5" md="5" lg="5" className="contentSec">
                                <div className="input-group">
                                    <label className="fw-semibold full-width form-label">Url</label>
                                    <input type="text" className="form-control" defaultValue={data[1]?.ComponentLink?.Url} />
                                </div>
                            </Col>
                            <Col sm="1" md="1" lg="1" className="text-center iconSec">
                                <LuUndo2 size="25" onClick={() => undoChangescolumns('ComponentLink')} />
                            </Col>
                        </Row>
                        <Row className="Metadatapannel">
                            <Col sm="5" md="5" lg="5" className="contentSec">
                                <div className="input-group">
                                    <label className="fw-semibold full-width form-label">Deliverable-Synonyms</label>
                                    <input type="text" className="form-control" value={data[0]?.DeliverableSynonyms} />
                                </div>
                            </Col>
                            <Col sm="1" md="1" lg="1" className="iconSec">
                                <div className="text-center">
                                    <div><FaLeftLong size="16" onClick={() => changeData(0, 'DeliverableSynonyms', data[1]?.DeliverableSynonyms)} /></div>
                                    <div><FaRightLong size="16" onClick={() => changeData(1, 'DeliverableSynonyms', data[0]?.DeliverableSynonyms)} /></div>
                                </div>
                            </Col>
                            <Col sm="5" md="5" lg="5" className="contentSec">
                                <div className="input-group">
                                    <label className="fw-semibold full-width form-label">Deliverable-Synonyms</label>
                                    <input type="text" className="form-control" value={data[1]?.DeliverableSynonyms} />
                                </div>
                            </Col>
                            <Col sm="1" md="1" lg="1" className="text-center iconSec">
                                <LuUndo2 size="25" onClick={() => undoChangescolumns('DeliverableSynonyms')} />
                            </Col>
                        </Row>
                        <Row className="Metadatapannel">
                            <Col sm="5" md="5" lg="5" className="contentSec">
                                <div className="input-group">
                                    <label className="fw-semibold full-width form-label">Package</label>
                                    <input type="text" className="form-control" defaultValue={data[0]?.Package} />
                                </div>
                                {/* <TextField label="Package" value={data[0]?.Package} /> */}
                            </Col>
                            <Col sm="1" md="1" lg="1" className="iconSec">
                                <div className="text-center">
                                    <div><FaLeftLong size="16" onClick={() => changeData(0, 'Package', data[1]?.Package)} /></div>
                                    <div><FaRightLong size="16" onClick={() => changeData(1, 'Package', data[0]?.Package)} /></div>
                                </div>
                            </Col>
                            <Col sm="5" md="5" lg="5" className="contentSec">
                                <div className="input-group">
                                    <label className="fw-semibold full-width form-label">Package</label>
                                    <input type="text" className="form-control" defaultValue={data[1]?.Package} />
                                </div>
                                {/* <TextField label="Package" value={data[1]?.Package} /> */}
                            </Col>
                            <Col sm="1" md="1" lg="1" className="text-center iconSec">
                                <LuUndo2 size="25" onClick={() => undoChangescolumns('Package')} />
                            </Col>
                        </Row>
                        <Row className="Metadatapannel">
                            <Col sm="5" md="5" lg="5" className="contentSec">
                                <div className="input-group">
                                    <label className="fw-semibold full-width form-label">Admin Status</label>
                                    <input type="text" className="form-control" defaultValue={data[0]?.AdminStatus} />
                                </div>
                                {/* <TextField label="Admin Status" value={data[0]?.AdminStatus} /> */}
                            </Col>
                            <Col sm="1" md="1" lg="1" className="iconSec">
                                <div className="text-center">
                                    <div><FaLeftLong size="16" onClick={() => changeData(0, 'AdminStatus', data[1]?.AdminStatus)} /></div>
                                    <div><FaRightLong size="16" onClick={() => changeData(1, 'AdminStatus', data[0]?.AdminStatus)} /></div>
                                </div>
                            </Col>
                            <Col sm="5" md="5" lg="5" className="contentSec">
                                {/* <TextField label="Admin Status" value={data[1]?.AdminStatus} /> */}
                                <div className="input-group">
                                    <label className="fw-semibold full-width form-label">Admin Status</label>
                                    <input type="text" className="form-control" defaultValue={data[1]?.AdminStatus} />
                                </div>
                            </Col>
                            <Col sm="1" md="1" lg="1" className="text-center iconSec">
                                <LuUndo2 size="25" onClick={() => undoChangescolumns('AdminStatus')} />
                            </Col>
                        </Row>
                        <Row className="Metadatapannel">
                            <Col sm="5" md="5" lg="5" className="contentSec">
                                <div className="input-group">
                                    <label className="fw-semibold full-width form-label">Synonyms</label>
                                    <textarea className="form-control">{data[0]?.Synonyms}</textarea>
                                </div>
                            </Col>
                            <Col sm="1" md="1" lg="1" className="iconSec">
                                <div className="text-center">
                                    <div><FaLeftLong size="16" onClick={() => changeData(0, 'Synonyms', data[1]?.Synonyms)} /></div>
                                    <div><FaRightLong size="16" onClick={() => changeData(1, 'Synonyms', data[0]?.Synonyms)} /></div>
                                </div>
                            </Col>
                            <Col sm="5" md="5" lg="5" className="contentSec">
                                <div className="input-group">
                                    <label className="fw-semibold full-width form-label">Synonyms</label>
                                    <textarea className="form-control">{data[1]?.Synonyms}</textarea>
                                </div>
                            </Col>
                            <Col sm="1" md="1" lg="1" className="text-center iconSec">
                                <LuUndo2 size="25" onClick={() => undoChangescolumns('Synonyms')} />
                            </Col>
                        </Row>
                        <Row className="Metadatapannel">
                            <Col sm="5" md="5" lg="5" className="contentSec">
                                <div className="input-group">
                                    <label className="fw-semibold full-width form-label">Comments {data[0]?.Comments?.length > 0 && (data[0]?.Comments?.length)}
                                        <span className="svg__iconbox alignIcon svg__icon--edit" onClick={() => OpenComment(data[0], true, 'Comments', 0)}></span>
                                    </label>
                                    {data[0]?.Comments?.length > 0 && <div className="alignCenter">
                                        <div className="alignCenter">
                                            <div className="alignCenter f-13">
                                                <span className='comment-date'>
                                                    <span className='round  pe-1'> <img className='align-self-start me-1' title={data[0]?.Comments[0]?.AuthorName}
                                                        src={data[0]?.Comments[0]?.AuthorImage != undefined && data[0]?.Comments[0]?.AuthorImage != '' ?
                                                            data[0]?.Comments[0]?.AuthorImage :
                                                            "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg"}
                                                    />
                                                        <a>{data[0]?.Comments[0]?.AuthorName} - </a>   {data[0]?.Comments[0]?.Created}

                                                    </span>
                                                    <p className='m-0' id="pageContent">  <span dangerouslySetInnerHTML={{ __html: data[0]?.Comments[0]?.Description }}></span></p>
                                                </span>
                                            </div>
                                            <div>

                                            </div>
                                        </div>
                                    </div>}
                                </div>
                            </Col>
                            <Col sm="1" md="1" lg="1" className="iconSec">
                                <div className="text-center">
                                    <div><FaLeftLong size="16" onClick={() => changeData(0, 'Comments', data[1]?.Comments)} /></div>
                                    <div><FaRightLong size="16" onClick={() => changeData(1, 'Comments', data[0]?.Comments)} /></div>
                                </div>
                            </Col>
                            <Col sm="5" md="5" lg="5" className="contentSec">
                                <div className="input-group">
                                    <label className="fw-semibold full-width form-label">Comments {data[1]?.Comments?.length > 0 && (data[1]?.Comments?.length)}
                                        <span className="svg__iconbox alignIcon svg__icon--edit" onClick={() => OpenComment(data[1], true, 'Comments', 1)}></span>
                                    </label>
                                    {data[1]?.Comments?.length > 0 && <div className="alignCenter">
                                        <div className="alignCenter">
                                            <div className="alignCenter f-13">
                                                <span className='comment-date'>
                                                    <span className='round  pe-1'> <img className='align-self-start me-1' title={data[1]?.Comments[0]?.AuthorName}
                                                        src={data[1]?.Comments[0]?.AuthorImage != undefined && data[1]?.Comments[0]?.AuthorImage != '' ?
                                                            data[1]?.Comments[0]?.AuthorImage :
                                                            "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg"}
                                                    />
                                                        <a>{data[1]?.Comments[0]?.AuthorName} - </a>   {data[1]?.Comments[0]?.Created}

                                                    </span>
                                                    <p className='m-0' id="pageContent">  <span dangerouslySetInnerHTML={{ __html: data[1]?.Comments[0]?.Description }}></span></p>
                                                </span>
                                            </div>
                                            <div>

                                            </div>
                                        </div>
                                    </div>}
                                </div>
                            </Col>
                            <Col sm="1" md="1" lg="1" className="text-center iconSec">
                                <LuUndo2 size="25" onClick={() => undoChangescolumns('Comments')} />
                            </Col>
                        </Row>
                        {data[0]?.TaskType?.Title != undefined &&
                            <Row className="Metadatapannel">
                                <Col sm="5" md="5" lg="5" className="contentSec">
                                    <div className="input-group">
                                        <label className="fw-semibold full-width form-label">Description
                                            <span className="svg__iconbox alignIcon svg__icon--edit" onClick={() => { bindEditorData(data[0], 0, "Body", true) }}></span>
                                        </label>
                                        <textarea rows={3} className="form-control" value={data[0]?.Body != undefined && data[0]?.Body != null ? data[0]?.Body.replace(/(<([^>]+)>)/gi, "").replace(/\n/g, '').replace(/&#160;/g, ' ') : ''}>

                                        </textarea>
                                    </div>
                                </Col>
                                <Col sm="1" md="1" lg="1" className="iconSec">
                                    <div className="text-center">
                                        <div><FaLeftLong size="16" onClick={() => changeData(0, 'Body', data[1]?.Body)} /></div>
                                        <div><FaRightLong size="16" onClick={() => changeData(1, 'Body', data[0]?.Body)} /></div>
                                    </div>
                                </Col>
                                <Col sm="5" md="5" lg="5" className="contentSec">
                                    <div className="input-group">
                                        <label className="fw-semibold full-width form-label">Description
                                            <span className="svg__iconbox alignIcon svg__icon--edit" onClick={() => { bindEditorData(data[1], 1, "Body", true) }}></span>
                                        </label>
                                        <textarea className="form-control" rows={3} value={data[1]?.Body != undefined && data[1]?.Body != null ? data[1]?.Body.replace(/(<([^>]+)>)/gi, "").replace(/\n/g, '').replace(/&#160;/g, ' ') : ''}></textarea>
                                    </div>
                                </Col>
                                <Col sm="1" md="1" lg="1" className="text-center iconSec">
                                    <LuUndo2 size="25" onClick={() => undoChangescolumns('Body')} />
                                </Col>
                            </Row>
                        }
                        {data[0]?.TaskType === undefined && <span>
                            <Row className="Metadatapannel">
                                <Col sm="5" md="5" lg="5" className="contentSec">
                                    <div className="input-group">
                                        <label className="fw-semibold full-width form-label">Help Information
                                            <span className="svg__iconbox alignIcon svg__icon--edit" onClick={() => { bindEditorData(data[0], 0, "Help_x0020_Information", true) }}></span>
                                        </label>
                                        <textarea className="form-control" rows={3} value={data[0]?.Help_x0020_Information != undefined && data[0]?.Help_x0020_Information != null ? data[0]?.Help_x0020_Information.replace(/(<([^>]+)>)/gi, "").replace(/\n/g, '').replace(/&#160;/g, ' ').replace(/&nbsp;/g, ' ') : ''}></textarea>
                                    </div>
                                </Col>
                                <Col sm="1" md="1" lg="1" className="iconSec">
                                    <div className="text-center">
                                        <div><FaLeftLong size="16" onClick={() => changeData(0, 'Help_x0020_Information', data[1]?.Help_x0020_Information)} /></div>
                                        <div><FaRightLong size="16" onClick={() => changeData(1, 'Help_x0020_Information', data[0]?.Help_x0020_Information)} /></div>
                                    </div>
                                </Col>
                                <Col sm="5" md="5" lg="5" className="contentSec">
                                    <div className="input-group">
                                        <label className="fw-semibold full-width form-label">Help Information
                                            <span className="svg__iconbox alignIcon svg__icon--edit" onClick={() => { bindEditorData(data[1], 1, "Help_x0020_Information", true) }}></span>
                                        </label>
                                        <textarea className="form-control" rows={3} value={data[1]?.Help_x0020_Information != undefined && data[1]?.Help_x0020_Information != null ? data[1]?.Help_x0020_Information.replace(/(<([^>]+)>)/gi, "").replace(/\n/g, '').replace(/&#160;/g, ' ').replace(/&nbsp;/g, ' ') : ''}></textarea>

                                    </div>
                                </Col>
                                <Col sm="1" md="1" lg="1" className="text-center iconSec">
                                    <LuUndo2 size="25" onClick={() => undoChangescolumns('Help_x0020_Information')} />
                                </Col>
                            </Row>
                            <Row className="Metadatapannel">
                                <Col sm="5" md="5" lg="5" className="contentSec">
                                    <div className="input-group">
                                        <label className="fw-semibold full-width form-label">Technical Explanations
                                            <span className="svg__iconbox alignIcon svg__icon--edit" onClick={() => { bindEditorData(data[0], 0, "TechnicalExplanations", true) }}></span>
                                        </label>
                                        <textarea className="form-control" rows={3} value={data[0]?.TechnicalExplanations != null && data[0]?.TechnicalExplanations != undefined ? data[0]?.TechnicalExplanations.replace(/(<([^>]+)>)/gi, "").replace(/\n/g, '').replace(/&#160;/g, ' ').replace(/&nbsp;/g, ' ') : ''}></textarea>
                                    </div>
                                </Col>
                                <Col sm="1" md="1" lg="1" className="iconSec">
                                    <div className="text-center">
                                        <div><FaLeftLong size="16" onClick={() => changeData(0, 'TechnicalExplanations', data[1]?.TechnicalExplanations)} /></div>
                                        <div><FaRightLong size="16" onClick={() => changeData(1, 'TechnicalExplanations', data[0]?.TechnicalExplanations)} /></div>
                                    </div>
                                </Col>
                                <Col sm="5" md="5" lg="5" className="contentSec">
                                    <div className="input-group">
                                        <label className="fw-semibold full-width form-label">Technical Explanations
                                            <span className="svg__iconbox alignIcon svg__icon--edit" onClick={() => { bindEditorData(data[1], 1, "TechnicalExplanations", true) }}></span>
                                        </label>
                                        <textarea className="form-control" rows={3} value={data[1]?.TechnicalExplanations != null && data[1]?.TechnicalExplanations != undefined ? data[1]?.TechnicalExplanations.replace(/(<([^>]+)>)/gi, "").replace(/\n/g, '').replace(/&#160;/g, ' ').replace(/&nbsp;/g, ' ') : ''}></textarea>
                                    </div>
                                </Col>
                                <Col sm="1" md="1" lg="1" className="text-center iconSec">
                                    <LuUndo2 size="25" onClick={() => undoChangescolumns('TechnicalExplanations')} />
                                </Col>
                            </Row>
                            <Row className="Metadatapannel">
                                <Col sm="5" md="5" lg="5" className="contentSec">
                                    <div className="input-group">
                                        <label className="fw-semibold full-width form-label">Deliverables
                                            <span className="svg__iconbox alignIcon svg__icon--edit" onClick={() => { bindEditorData(data[0], 0, "Deliverables", true) }}></span>
                                        </label>
                                        <textarea className="form-control" rows={3} value={data[0]?.Deliverables != null && data[0]?.Deliverables != undefined ? data[0]?.Deliverables.replace(/(<([^>]+)>)/gi, "").replace(/\n/g, '').replace(/&#160;/g, ' ').replace(/&nbsp;/g, ' ') : ''}></textarea>
                                    </div>
                                </Col>
                                <Col sm="1" md="1" lg="1" className="iconSec">
                                    <div className="text-center">
                                        <div><FaLeftLong size="16" onClick={() => changeData(0, 'Deliverables', data[1]?.Deliverables)} /></div>
                                        <div><FaRightLong size="16" onClick={() => changeData(1, 'Deliverables', data[0]?.Deliverables)} /></div>
                                    </div>
                                </Col>
                                <Col sm="5" md="5" lg="5" className="contentSec">
                                    <div className="input-group">
                                        <label className="fw-semibold full-width form-label">Deliverables
                                            <span className="svg__iconbox alignIcon svg__icon--edit" onClick={() => { bindEditorData(data[1], 1, "Deliverables", true) }}></span>
                                        </label>
                                        <textarea className="form-control" rows={3} value={data[1]?.Deliverables != undefined && data[1]?.Deliverables != null ? data[1]?.Deliverables.replace(/(<([^>]+)>)/gi, "").replace(/\n/g, '').replace(/&#160;/g, ' ').replace(/&nbsp;/g, ' ') : ''}></textarea>
                                    </div>
                                </Col>
                                <Col sm="1" md="1" lg="1" className="text-center iconSec">
                                    <LuUndo2 size="25" onClick={() => undoChangescolumns('Deliverables')} />
                                </Col>
                            </Row>
                            <Row className="Metadatapannel">
                                <Col sm="5" md="5" lg="5" className="contentSec">
                                    <div className="input-group">
                                        <label className="fw-semibold full-width form-label">Short Description
                                            <span className="svg__iconbox alignIcon svg__icon--edit" onClick={() => { bindEditorData(data[0], 0, "Short_x0020_Description_x0020_On", true) }}></span>
                                        </label>
                                        <textarea className="form-control" rows={3} value={data[0]?.Short_x0020_Description_x0020_On != null && data[0]?.Short_x0020_Description_x0020_On != undefined ? data[0]?.Short_x0020_Description_x0020_On.replace(/(<([^>]+)>)/gi, "").replace(/\n/g, '').replace(/&#160;/g, ' ').replace(/&nbsp;/g, ' ') : ''}></textarea>
                                    </div>
                                </Col>
                                <Col sm="1" md="1" lg="1" className="iconSec">
                                    <div className="text-center">
                                        <div><FaLeftLong size="16" onClick={() => changeData(0, 'Short_x0020_Description_x0020_On', data[1]?.Short_x0020_Description_x0020_On)} /></div>
                                        <div><FaRightLong size="16" onClick={() => changeData(1, 'Short_x0020_Description_x0020_On', data[0]?.Short_x0020_Description_x0020_On)} /></div>
                                    </div>
                                </Col>
                                <Col sm="5" md="5" lg="5" className="contentSec">
                                    <div className="input-group">
                                        <label className="fw-semibold full-width form-label">Short Description
                                            <span className="svg__iconbox alignIcon svg__icon--edit" onClick={() => { bindEditorData(data[1], 1, "Short_x0020_Description_x0020_On", true) }}></span>
                                        </label>
                                        <textarea className="form-control" rows={3} value={data[1]?.Short_x0020_Description_x0020_On != undefined && data[1]?.Short_x0020_Description_x0020_On != null ? data[1]?.Short_x0020_Description_x0020_On.replace(/(<([^>]+)>)/gi, "").replace(/\n/g, '').replace(/&#160;/g, ' ').replace(/&nbsp;/g, ' ') : ''}></textarea>
                                    </div>
                                </Col>
                                <Col sm="1" md="1" lg="1" className="text-center iconSec">
                                    <LuUndo2 size="25" onClick={() => undoChangescolumns('Short_x0020_Description_x0020_On')} />
                                </Col>
                            </Row>
                            <Row className="Metadatapannel">
                                <Col sm="5" md="5" lg="5" className="contentSec">
                                    <div className="input-group">
                                        <label className="fw-semibold full-width form-label">Admin Notes</label>
                                        <textarea className="full-width" onChange={(e) => bindMultilineValue(e, 0, 'AdminNotes')} rows={3} value={(data[0]?.AdminNotes == null || data[0]?.AdminNotes === "") ? "" : data[0]?.AdminNotes} ></textarea>
                                    </div>
                                </Col>
                                <Col sm="1" md="1" lg="1" className="iconSec">
                                    <div className="text-center">
                                        <div><FaLeftLong size="16" onClick={() => changeData(0, 'AdminNotes', data[1]?.AdminNotes)} /></div>
                                        <div><FaRightLong size="16" onClick={() => changeData(1, 'AdminNotes', data[0]?.AdminNotes)} /></div>
                                    </div>
                                </Col>
                                <Col sm="5" md="5" lg="5" className="contentSec">
                                    <div className="input-group">
                                        <label className="fw-semibold full-width form-label">Admin Notes</label>
                                        <textarea className="full-width" onChange={(e) => bindMultilineValue(e, 1, 'AdminNotes')} rows={3} value={(data[1]?.AdminNotes == null || data[1]?.AdminNotes === "") ? "" : data[1]?.AdminNotes} ></textarea>
                                    </div>
                                </Col>
                                <Col sm="1" md="1" lg="1" className="text-center iconSec">
                                    <LuUndo2 size="25" onClick={() => undoChangescolumns('AdminNotes')} />
                                </Col>
                            </Row>
                            <Row className="Metadatapannel">
                                <Col sm="5" md="5" lg="5" className="contentSec">
                                    <div className="input-group">
                                        <label className="fw-semibold full-width form-label">Background</label>
                                        <textarea className="full-width" onChange={(e) => bindMultilineValue(e, 0, 'Background')} rows={3} value={(data[0]?.Background == null || data[0]?.Background === "") ? "" : data[0]?.Background} ></textarea>
                                    </div>
                                </Col>
                                <Col sm="1" md="1" lg="1" className="iconSec">
                                    <div className="text-center">
                                        <div><FaLeftLong size="16" onClick={() => changeData(0, 'Background', data[1]?.Background)} /></div>
                                        <div><FaRightLong size="16" onClick={() => changeData(1, 'Background', data[0]?.Background)} /></div>
                                    </div>
                                </Col>
                                <Col sm="5" md="5" lg="5" className="contentSec">
                                    <div className="input-group">
                                        <label className="fw-semibold full-width form-label">Background</label>
                                        <textarea className="full-width" onChange={(e) => bindMultilineValue(e, 1, 'Background')} rows={3} value={(data[1]?.Background == null || data[1]?.Background === "") ? "" : data[1]?.Background} ></textarea>
                                    </div>
                                </Col>
                                <Col sm="1" md="1" lg="1" className="text-center iconSec">
                                    <LuUndo2 size="25" onClick={() => undoChangescolumns('Background')} />
                                </Col>
                            </Row>
                            <Row className="Metadatapannel">
                                <Col sm="5" md="5" lg="5" className="contentSec">
                                    {/* <TextField label="Idea" value={data[0]?.Idea} /> */}
                                    <div className="input-group">
                                        <label className="fw-semibold full-width form-label">Idea</label>
                                        <textarea className="full-width" onChange={(e) => bindMultilineValue(e, 0, 'Idea')} rows={3} value={(data[0]?.Idea == null || data[0]?.Idea === "") ? "" : data[0]?.Idea}></textarea>
                                    </div>
                                </Col>
                                <Col sm="1" md="1" lg="1" className="iconSec">
                                    <div className="text-center">
                                        <div><FaLeftLong size="16" onClick={() => changeData(0, 'Idea', data[1]?.Idea)} /></div>
                                        <div><FaRightLong size="16" onClick={() => changeData(0, 'Idea', data[1]?.Idea)} /></div>
                                    </div>
                                </Col>
                                <Col sm="5" md="5" lg="5" className="contentSec">
                                    {/* <TextField label="Idea" value={data[1]?.Idea} /> */}
                                    <div className="input-group">
                                        <label className="fw-semibold full-width form-label">Idea</label>
                                        <textarea className="full-width" onChange={(e) => bindMultilineValue(e, 1, 'Idea')} rows={3} value={(data[1]?.Idea == null || data[1]?.Idea === "") ? "" : data[1]?.Idea}></textarea>
                                    </div>
                                </Col>
                                <Col sm="1" md="1" lg="1" className="text-center iconSec">
                                    <LuUndo2 size="25" onClick={() => undoChangescolumns('Idea')} />
                                </Col>
                            </Row>
                            <Row className="Metadatapannel">
                                <Col sm="5" md="5" lg="5" className="contentSec">
                                    <div className="input-group" key={data[0]}>
                                        <label className="fw-semibold full-width form-label">Value Added</label>
                                        <textarea className="full-width" rows={3} onChange={(e) => bindMultilineValue(e, 0, 'ValueAdded')} value={(data[0]?.ValueAdded == null || data[0]?.ValueAdded === "") ? "" : data[0]?.ValueAdded}></textarea>
                                    </div>
                                </Col>
                                <Col sm="1" md="1" lg="1" className="iconSec">
                                    <div className="text-center">
                                        <div><FaLeftLong size="16" onClick={() => changeData(0, 'ValueAdded', data[1]?.ValueAdded)} /></div>
                                        <div><FaRightLong size="16" onClick={() => changeData(1, 'ValueAdded', data[0]?.ValueAdded)} /></div>
                                    </div>
                                </Col>
                                <Col sm="5" md="5" lg="5" className="contentSec">
                                    <div className="input-group" key={data[1]}>
                                        <label className="fw-semibold full-width form-label">Value Added</label>
                                        <textarea className="full-width" onChange={(e) => bindMultilineValue(e, 1, 'ValueAdded')} rows={3} value={(data[1]?.ValueAdded == null || data[1]?.ValueAdded === "") ? "" : data[1]?.ValueAdded}></textarea>
                                    </div>
                                </Col>
                                <Col sm="1" md="1" lg="1" className="text-center iconSec">
                                    <LuUndo2 size="25" onClick={() => undoChangescolumns('ValueAdded')} />
                                </Col>
                            </Row>
                        </span>}
                        {/* <Row className="Metadatapannel">
                            <Col sm="5" md="5" lg="5">
                                <div className="input-group">
                                    <label className="fw-semibold full-width form-label">Questions Descriptions</label>
                                </div>
                            </Col>
                            <Col sm="1" md="1" lg="1">
                                <div className="text-center">
                                    <div><FaLeftLong size="16" /></div>
                                    <div><FaRightLong size="16" /></div>
                                </div>
                            </Col>
                            <Col sm="5" md="5" lg="5">
                                <div className="input-group">
                                    <label className="fw-semibold full-width form-label">Questions Descriptions</label>
                                </div>
                            </Col>
                            <Col sm="1" md="1" lg="1">
                                <LuUndo2 size="25" onClick={undoChanges} />
                            </Col>
                        </Row> */}
                        {data[0]?.TaskType === undefined &&
                            <Row className="Metadatapannel">
                                <Col sm="5" md="5" lg="5" className="contentSec">
                                    <div className="input-group">
                                        <label className="fw-semibold full-width form-label">Help Descriptions</label>
                                        <textarea className="full-width" rows={3}>{data[0]?.HelpDescription}</textarea>
                                    </div>
                                </Col>
                                <Col sm="1" md="1" lg="1" className="iconSec">
                                    <div className="text-center">
                                        <div><FaLeftLong size="16" onClick={() => changeData(0, 'HelpDescription', data[1]?.HelpDescription)} /></div>
                                        <div><FaRightLong size="16" onClick={() => changeData(1, 'HelpDescription', data[0]?.HelpDescription)} /></div>
                                    </div>
                                </Col>
                                <Col sm="5" md="5" lg="5" className="contentSec">
                                    <div className="input-group">
                                        <label className="fw-semibold full-width form-label">Help Descriptions</label>
                                        <textarea className="full-width" rows={3}>{data[0]?.HelpDescription}</textarea>
                                    </div>
                                </Col>
                                <Col sm="1" md="1" lg="1" className="text-center iconSec">
                                    <LuUndo2 size="25" onClick={() => undoChangescolumns('HelpDescription')} />
                                </Col>
                            </Row>
                        }
                        {data[0]?.TaskType?.Title != undefined &&
                            <Row className="Metadatapannel">
                                <Col sm="5" md="5" lg="5" className="contentSec">

                                    <div className="input-group" >
                                        <label className="fw-semibold full-width form-label">Time Entries</label>
                                        {data[0]?.finalData?.length > 0 ? (
                                            <GlobalCommanTable
                                                columns={TimeEntryColumnsFirst}
                                                data={data[0]?.finalData}
                                                callBackData={callBackDataFirst}
                                                expendedTrue={true}
                                            />
                                        ) : <div className="d-flex justify-content-center">No Timesheet Available</div>}
                                    </div>
                                </Col>
                                <Col sm="1" md="1" lg="1" className="iconSec">
                                    <div className="text-center">
                                        <div><FaLeftLong size="16" onClick={() => changeData(0, 'HelpDescription', data[1]?.HelpDescription)} /></div>
                                        <div><FaRightLong size="16" onClick={() => changeData(1, 'HelpDescription', data[0]?.HelpDescription)} /></div>
                                    </div>
                                </Col>
                                <Col sm="5" md="5" lg="5" className="contentSec">

                                    <div className="input-group">
                                        <label className="fw-semibold full-width form-label">Time Entries</label>
                                        {data[1]?.finalData?.length > 0 ? (
                                            <GlobalCommanTable
                                                columns={TimeEntryColumnsSecond}
                                                data={data[1]?.finalData}
                                                callBackData={callBackDataSecond}
                                                expendedTrue={true}
                                            />
                                        ) : <div className="d-flex justify-content-center">No Timesheet Available</div>}
                                    </div>
                                </Col>
                                <Col sm="1" md="1" lg="1" className="text-center iconSec">
                                    <LuUndo2 size="25" />
                                </Col>
                            </Row>
                        }
                        <Row className="Metadatapannel">
                            <Col sm="5" md="5" lg="5" className="contentSec">
                                <label className="fw-semibold form-label">Site Composition</label>
                                <div className="px-3"> {
                                    data[0]?.SiteComposition?.length > 0 && data[0]?.SiteComposition?.map((items: any) => {
                                        return <div className="bg-Ff border row mb-1 p-1">
                                            <div className="col-sm-4"><img className="workmember ml20 me-1" src={items?.SiteImages}></img>{items.Title} </div><div className="col-sm-4">{items?.ClienTimeDescription}</div><div className="col-sm-4">{items?.Date}</div>
                                        </div>
                                    })
                                }</div>
                            </Col>
                            <Col sm="1" md="1" lg="1" className="iconSec">
                                <div className="text-center">
                                    <div><FaLeftLong size="16" onClick={() => changeData(0, 'SiteComposition', data[1]?.SiteComposition)} /></div>
                                    <div><FaRightLong size="16" onClick={() => changeData(1, 'SiteComposition', data[0]?.SiteComposition)} /></div>
                                </div>
                            </Col>

                            <Col sm="5" md="5" lg="5" className="contentSec">
                                <label className="fw-semibold form-label">Site Composition</label>
                                <div className="px-3"> {
                                    data[1]?.SiteComposition?.length > 0 && data[1]?.SiteComposition?.map((items: any) => {
                                        return <div className="bg-Ff border row mb-1 p-1">
                                            <div className="col-sm-4"><img className="workmember ml20 me-1" src={items?.SiteImages}></img>{items.Title} </div><div className="col-sm-4">{items?.ClienTimeDescription}</div><div className="col-sm-4">{items?.Date}</div>
                                        </div>
                                    })
                                }</div>
                            </Col>
                            <Col sm="1" md="1" lg="1" className="text-center iconSec">
                                <LuUndo2 size="25" onClick={() => undoChangescolumns('SiteComposition')} />
                            </Col>
                        </Row>
                    </Container>
                </Modal.Body>
                <footer className="bg-f4 fixed-bottom position-absolute">
                    <div className="align-items-center d-flex justify-content-between px-4 py-2">
                        <div>
                            <div className="text-left">
                                <a target="_blank" data-interception="off"
                                    href={`${data[0]?.siteUrl}/Lists/${data[0]?.siteType}/EditForm.aspx?ID=${data[0]?.Id}`}>
                                    Open Out-Of-The-Box Form
                                </a>
                            </div>
                            <div className="text-left">Created
                                <span ng-bind="EditData?.Created | date:'MM-DD-YYYY'">{data[0]?.Created != null && data[0]?.Created != undefined ? moment(data[0]?.Created).format("DD/MM/YYYY") : ''}</span> by<span className="panel-title ps-1">{data[0]?.Author?.Title}</span>
                            </div>
                            <div className="text-left">Last modified <span>{data[0]?.Modified != null && data[0]?.Modified != undefined ? moment(data[0]?.Modified).format("DD/MM/YYYY") : ''}</span> by <span className="panel-title">{data[0]?.Editor?.Title}</span>
                            </div>
                        </div>
                        <div>
                            <Button variant="primary" onClick={() => WhichComponentToSave('Keep1')}>Update & Keep Component 1</Button>
                            <Button variant="primary mx-1" onClick={() => WhichComponentToSave('Keep2')}>Update & Keep Component 2</Button>
                            <Button variant="primary" onClick={() => WhichComponentToSave('KeepBoth')}>Update & Keep both</Button>
                        </div>
                        <div>
                            <div className="footer-right">
                                <div className="text-end">
                                    <a target="_blank" data-interception="off"
                                        href={`${data[1]?.siteUrl}/Lists/${data[1]?.siteType}/EditForm.aspx?ID=${data[1]?.Id}`}>
                                        Open Out-Of-The-Box Form
                                    </a>
                                </div>
                                <div className="text-end">Created
                                    <span ng-bind="EditData?.Created | date:'MM-DD-YYYY'">{data[1]?.Created != null && data[1]?.Created != undefined ? moment(data[1]?.Created).format("DD/MM/YYYY") : ''}</span> by<span className="panel-title ps-1">{data[1]?.Author?.Title}</span>
                                </div>
                                <div className="text-end">Last modified <span>{data[1]?.Modified != null && data[1]?.Modified != undefined ? moment(data[1]?.Modified).format("DD/MM/YYYY") : ''}</span> by <span className="panel-title">{data[1]?.Editor?.Title}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
                {showLoader ? <PageLoader /> : ''}
            </Panel>
            {
                categories?.condition && <Picker
                    props={categories?.data}
                    Call={Callcategory}
                    CallBack={SelectCategoryCallBack}
                    usedFor="Task-Popup"
                    selectedCategoryData={categories?.taskCate}
                    AllListId={props?.contextValue}
                ></Picker>
            }
            {
                isPicker?.condition && isPicker?.PortfolioTitle != 'FeatureType' && <ServiceComponentPortfolioPopup
                    props={catItem}
                    Dynamic={props?.contextValue}
                    ComponentType={catItem.Item_x0020_Type}
                    Call={ComponentServicePopupCallBack}
                    selectionType={"Single"}
                    showProject={isPicker?.PortfolioTitle === 'ProjectItem' ? true : false}
                />
            }
            {(componentItem?.Item_x0020_Type === "Project" || componentItem?.Item_x0020_Type === "Sprint") && (
                <EditProjectPopup AllListId={props.contextValue} props={componentItem} Call={Call}  > {" "} </EditProjectPopup>) }

            {(componentItem?.Item_x0020_Type === "Component" || componentItem?.Item_x0020_Type === "SubComponent" || componentItem?.Item_x0020_Type === "Feature") && (
            <EditInstituton item={componentItem} Calls={Call} SelectD={props.contextValue} portfolioTypeData={PortFolioType}  > </EditInstituton>)}

            {isPicker?.condition && isPicker?.PortfolioTitle === 'FeatureType' && (<Smartmetadatapickerin props={catItem} Call={Smartmetadatafeature} selectedFeaturedata={catItem?.FeatureType != undefined ? catItem?.FeatureType[0] : catItem?.FeatureType} AllListId={props.contextValue} TaxType='Feature Type' usedFor="Single" ></Smartmetadatapickerin>)}

            <Panel onRenderHeader={onRenderCustomHeaderMain2} type={PanelType.medium} isOpen={htmlEditor?.condition} isBlocking={false} onDismiss={closeHtmlEditor}>

                <div className="modal-body"><HtmlEditorCard
                    editorValue={
                        htmlEditor?.data != undefined
                            ? htmlEditor?.data
                            : ""
                    }
                    HtmlEditorStateChange={HtmlEditorCallBack}
                ></HtmlEditorCard>
                </div>
                <footer className="modal-footer mt-2">
                    <button className="btn btn-primary" type="button" onClick={() => { saveEditorData() }}>Save</button>
                    <button className="btn btn-default" type="button" onClick={closeHtmlEditor}>Cancel</button>
                </footer>
            </Panel>
            {IsClientPopup && <ClientCategoryPupup props={catItem} selectedClientCategoryData={catItem?.ClientCategory} Call={ClientCategoryCallBack} ></ClientCategoryPupup>}
            {TaskItem && <EditTaskPopup Items={TaskItem} Call={CallcomponentItem} AllListId={props?.contextValue} context={props?.contextValue} pageName={"TaskFooterTable"} ></EditTaskPopup>}

            <Panel

                onRenderHeader={customHeaderforALLcomments}
                type={PanelType.custom}
                customWidth="500px"
                onDismiss={(e) => closeAllCommentModal(e)}
                isOpen={AllCommentModal}
                isBlocking={false}>

                <div id='ShowAllCommentsId' className={color ? "serviepannelgreena" : ""}>

                    <div className='modal-body mt-2'>
                        <div className="col-sm-12 " id="ShowAllComments">
                            <div className="col-sm-12">
                                <div className="row d-flex mb-2">
                                    <div>
                                        <textarea value={(comments == null || comments == '') ? '' : comments} onChange={(e) => handleInputChange(e)} className="form-control" rows={2} placeholder="Enter your comments here"></textarea>

                                    </div>
                                    <div className='text-end mt-1'> <span className='btn btn-primary hreflink' onClick={() => PostComment('txtCommentModal')} >Post</span></div>

                                </div>
                                {catItem["Comments"] != null && catItem["Comments"]?.length > 0 && catItem["Comments"]?.map((cmtData: any, i: any) => {
                                    return <div className="p-1 mb-2">
                                        <div>
                                            <div className='d-flex justify-content-between align-items-center'>
                                                <span className='comment-date'>
                                                    <span className='round  pe-1'> <img className='align-self-start me-1' title={cmtData?.AuthorName}
                                                        src={cmtData?.AuthorImage != undefined && cmtData?.AuthorImage != '' ?
                                                            cmtData.AuthorImage :
                                                            "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg"}
                                                    />
                                                        <a>{cmtData?.AuthorName} - </a>   {cmtData?.Created}

                                                    </span>
                                                </span>
                                                <div className='d-flex media-icons ml-auto '>
                                                    <a className="hreflink" title='Edit' onClick={() => { bindEditorData(cmtData, i, "Description", true) }} >
                                                        <span className='svg__iconbox svg__icon--edit'></span>
                                                    </a>
                                                    <a className="hreflink" title="Delete" onClick={() => { bindEditorData(cmtData, i, "Description", true) }}>

                                                        <span className='svg__iconbox svg__icon--trash'></span>
                                                    </a>

                                                </div>


                                            </div>

                                            <div className="media-text">
                                                <h6 className='userid m-0 fs-6'>   {cmtData?.Header != '' && <b>{cmtData?.Header}</b>}</h6>
                                                <p className='m-0' id="pageContent">  <span dangerouslySetInnerHTML={{ __html: cmtData?.Description }}></span></p>
                                            </div>
                                        </div>
                                    </div>
                                })}

                            </div>

                        </div>
                    </div>
                    <footer className='text-end'>
                        <button type="button" className="btn btn-default" onClick={(e) => closeAllCommentModal(e)}>Cancel</button>
                    </footer>

                </div>

            </Panel>
        </>
    );
};

export default CompareTool;
