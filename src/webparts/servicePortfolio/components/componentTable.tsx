import * as React from 'react';
import * as $ from 'jquery';
import * as Moment from 'moment';
import '../../cssFolder/foundation.scss';
import { Modal } from 'office-ui-fabric-react';
import "bootstrap/dist/css/bootstrap.min.css";
import { FaAngleDown, FaAngleUp, FaPrint, FaFileExcel, FaPaintBrush, FaEdit, FaSearch } from 'react-icons/fa';
import { MdAdd } from 'react-icons/Md';
import { CSVLink } from "react-csv";
//import SmartFilter from './SmartFilter';
import '../../cssFolder/foundation.scss';
import '../../cssFolder/Style.scss'
import '../../cssFolder/site_color.scss'
import { map } from 'jquery';
import { concat } from 'lodash';
import EditInstituton from '../../EditPopupFiles/EditComponent';
import TimeEntryPopup from '../../../globalComponents/TimeEntry/TimeEntryComponent';
import { any, number } from 'prop-types';
import CheckboxTree from 'react-checkbox-tree';
import EditTaskPopup from '../../../globalComponents/EditTaskPopup/EditTaskPopup'






function ComponentTable() {

    const [maiArrayBackup, setmaiArrayBackup] = React.useState([])
    // const [Editpopup, setEditpopup] = React.useState(false)
    const [maidataBackup, setmaidataBackup] = React.useState([])
    const [search, setSearch]: [string, (search: string) => void] = React.useState("");
    const [data, setData] = React.useState([])
    const [Title, setTitle] = React.useState()
    const [itemType, setitemType] = React.useState()
    const [ComponentsData, setComponentsData] = React.useState([])
    const [SubComponentsData, setSubComponentsData] = React.useState([])
    const [FeatureData, setFeatureData] = React.useState([])
    const [table, setTable] = React.useState(data);
    const [AllUsers, setTaskUser] = React.useState([]);
    const [modalIsOpen, setModalIsOpen] = React.useState(false);
    const [modalTimeIsOpen, setTimeModalIsOpen] = React.useState(false);
    const [Editpopup, setEditpopup] = React.useState(false);
    const [addModalOpen, setAddModalOpen] = React.useState(false);
    const [showItem, setshowItem] = React.useState(false);
    const [state, setState] = React.useState([]);
    const [filterGroups, setFilterGroups] = React.useState([])
    const [filterItems, setfilterItems] = React.useState([])
    const [Editdata, setEditdata] = React.useState([]);
    const [AllMetadata, setMetadata] = React.useState([])
    const [IsComponent, setIsComponent] = React.useState(false);
    const [SharewebComponent, setSharewebComponent] = React.useState('');
    const [IsTask, setIsTask] = React.useState(false);
    const [SharewebTask, setSharewebTask] = React.useState('');
    const [SharewebTimeComponent, setSharewebTimeComponent] = React.useState([])
    const [IsTimeEntry, setIsTimeEntry] = React.useState(false);
    const [ShowSelectdSmartfilter, setShowSelectdSmartfilter] = React.useState([]);
    const [checked, setchecked] = React.useState([]);
    //--------------SmartFiltrt--------------------------------------------------------------------------------------------------------------------------------------------------

    var IsExitSmartfilter = function (array: any, Item: any) {
        var isExists = false;
        var count = 0;
        Item.MultipleTitle = '';
        map(array, (item) => {
            if (item.TaxType != undefined && Item.Title != undefined && item.TaxType == Item.Title) {
                isExists = true;
                count++;
                Item.MultipleTitle += item.Title + ', ';
                return false;
            }
        });
        if (Item.MultipleTitle != "")
            Item.MultipleTitle = Item.MultipleTitle.substring(0, Item.MultipleTitle.length - 2);
        Item.count = count;
        return isExists;
    }


    var issmartExists = function (array: any, title: any) {
        var isExists = false;
        map(array, (item) => {
            if (item.Title == title.Title) {
                isExists = true;
                return false;
            }
        });
        return isExists;
    }
    const SingleLookDatatest = (e: any, item: any, value: any) => {
        const { checked } = e.target;
        if (checked) {
            state.push(item);
            if (item.childs != undefined && item.childs.length > 0) {
                map(item.childs, (child) => {
                    state.push(child);
                })
            }

        }
        else {
            $.each(state, function (index: any, newite: any) {
                if (newite.Title == item.Title) {
                    state.splice(index, 1);
                }
                if (item.childs != undefined && item.childs.length > 0) {
                    for (var i: number = 0; item.childs > 0; i++) {
                        state.splice(i, 1);
                        --i;
                    }
                }

            })
        }
        var ArrayItem: any = []
        if (state != undefined) {
            map(state, (smart) => {
                var smartfilterItems: any = {};
                smartfilterItems.Title = smart.TaxType;
                if (IsExitSmartfilter(state, smartfilterItems)) {
                    if (smartfilterItems.count >= 3) {
                        smartfilterItems.selectTitle = ' : (' + smartfilterItems.count + ')';
                    } else smartfilterItems.selectTitle = ' : ' + smartfilterItems.MultipleTitle;
                }
                if (!issmartExists(ArrayItem, smartfilterItems))
                    ArrayItem.push(smartfilterItems);
            })
        }
        setShowSelectdSmartfilter(ShowSelectdSmartfilter => ([...ArrayItem]));
        // setState(state)
    }
    const Clearitem = () => {
        // setData(maini...[maidataBackup])
        setData(maidataBackup)
        // const { checked } = e.target;

    }
    // const isItemExists = function (arr: any, Id: any) {
    //     var isExists = false;
    //     map(arr, (item) => {
    //         if (item.Id == Id) {
    //             isExists = true;
    //             return false;
    //         }
    //     });
    //     return isExists;
    // }
    const Updateitem = () => {
        var filters: any[] = []
        var CategoryItems: any = [];
        var TeamUsers: any = [];
        var IsTeamUsers: any = false;
        var PriorityItems: any = [];
        var isPrioritySelected: any = false;
        var ResponsibilityItems: any = [];
        var isResponsibilitySelected: any = false;
        var PortfolioItems: any = [];
        var isPortfolioSelected = false;
        if (state.length == 0) {
            setData(maidataBackup)
        }
        else {
            map(maidataBackup, (item) => {

                map(state, (select) => {
                    if (select.Selected)
                        switch (select.TaxType) {
                            case 'Portfolio':
                                if (item.Item_x0020_Type != undefined && item.Item_x0020_Type == select.Title && !isItemExists(PortfolioItems, item.Id)) {
                                    item.flag = true
                                    PortfolioItems.push(item);
                                }
                                if (item.childs != undefined && item.childs.length > 0) {
                                    map(item.childs, (child) => {
                                        if (child.Item_x0020_Type != undefined && child.Item_x0020_Type == select.Title && !isItemExists(PortfolioItems, item.Id)) {
                                            child.flag = true
                                            PortfolioItems.push(item);
                                        }
                                        if (child.childs != undefined && child.childs.length > 0) {
                                            map(child.childs, (subchild) => {
                                                if (subchild.Item_x0020_Type != undefined && subchild.Item_x0020_Type == select.Title && !isItemExists(PortfolioItems, item.Id)) {
                                                    child.flag = true
                                                    PortfolioItems.push(item);
                                                }
                                            })
                                        }
                                    })
                                }
                                break;

                            case 'Type':
                                if (item.SharewebTaskType != undefined && item.SharewebTaskType.Title == select.Title && !isItemExists(CategoryItems, item.Id)) {
                                    item.flag = true
                                    CategoryItems.push(item);
                                }
                                if (item.childs != undefined && item.childs.length > 0) {
                                    map(item.childs, (child) => {
                                        if (child.SharewebTaskType != undefined && child.SharewebTaskType.Title == select.Title && !isItemExists(CategoryItems, item.Id)) {
                                            child.flag = true
                                            CategoryItems.push(item);
                                        }
                                        if (child.childs != undefined && child.childs.length > 0) {
                                            map(child.childs, (subchild) => {
                                                if (subchild.SharewebTaskType != undefined && subchild.SharewebTaskType.Title == select.Title && !isItemExists(CategoryItems, item.Id)) {
                                                    child.flag = true
                                                    CategoryItems.push(item);
                                                }
                                            })
                                        }
                                    })
                                }
                                break;

                            case 'Priority':
                                if (item.Priority != undefined && item.Priority == select.Title && !isItemExists(PriorityItems, item.Id)) {
                                    item.flag = true
                                    PriorityItems.push(item);
                                }
                                if (item.childs != undefined && item.childs.length > 0) {
                                    map(item.childs, (child) => {
                                        if (child.Priority != undefined && child.Priority == select.Title && !isItemExists(PriorityItems, item.Id)) {
                                            child.flag = true
                                            PriorityItems.push(item);
                                        }
                                        if (child.childs != undefined && child.childs.length > 0) {
                                            map(child.childs, (subchild) => {
                                                if (subchild.Priority != undefined && subchild.Priority == select.Title && !isItemExists(PriorityItems, item.Id)) {
                                                    child.flag = true
                                                    PriorityItems.push(item);
                                                }
                                            })
                                        }
                                    })
                                }
                                break;

                            case 'Sites':
                                if (item.Priority != undefined && item.Priority == select.Title && !isItemExists(PriorityItems, item.Id)) {
                                    item.flag = true
                                    PriorityItems.push(item);
                                }
                                if (item.childs != undefined && item.childs.length > 0) {
                                    map(item.childs, (child) => {
                                        if (child.Priority != undefined && child.Priority == select.Title && !isItemExists(PriorityItems, item.Id)) {
                                            child.flag = true
                                            PriorityItems.push(item);
                                        }
                                        if (child.childs != undefined && child.childs.length > 0) {
                                            map(child.childs, (subchild) => {
                                                if (subchild.Priority != undefined && subchild.Priority == select.Title && !isItemExists(PriorityItems, item.Id)) {
                                                    child.flag = true
                                                    PriorityItems.push(item);
                                                }
                                            })
                                        }
                                    })
                                }
                                break;

                            case 'Team Members':
                                if (item.TeamLeaderUserTitle != undefined && item.TeamLeaderUserTitle.toLowerCase().indexOf(select.Title) > -1 && !isItemExists(ResponsibilityItems, item.Id)) {
                                    item.flag = true
                                    ResponsibilityItems.push(item);
                                }
                                if (item.childs != undefined && item.childs.length > 0) {
                                    map(item.childs, (child) => {
                                        if (child.TeamLeaderUserTitle != undefined && child.TeamLeaderUserTitle.toLowerCase().indexOf(select.Title && !isItemExists(ResponsibilityItems, item.Id))) {
                                            child.flag = true
                                            ResponsibilityItems.push(item);
                                        }
                                        if (child.childs != undefined && child.childs.length > 0) {
                                            map(child.childs, (subchild) => {
                                                if (subchild.TeamLeaderUserTitle != undefined && subchild.TeamLeaderUserTitle == select.Title && !isItemExists(ResponsibilityItems, item.Id)) {
                                                    child.flag = true
                                                    ResponsibilityItems.push(item);
                                                }
                                            })
                                        }
                                    })
                                }
                                break;


                        }
                })
            })

        }
        if (state.length > 0)
            setData(CategoryItems)


    }


    const LoadAllSiteTasks = function () {

        var query = "&$filter=Status ne 'Completed'&$orderby=Created desc&$top=4999";
        var Counter = 0;


        $.each(siteConfig, function (index: any, config: any) {
            if (config.Title != 'SDC Sites') {
                //     $.each($scope.filterItems, function (filter) {
                //         if (config.Title == filter.Title) {
                //             filter.DataLoad = true;
                //         }
                //         if (filter.childs != undefined && filter.childs.length > 0) {
                //             angular.forEach(filter.childs, function (child) {
                //                 if (config.Title == child.Title) {
                //                     child.DataLoad = true;
                //                 }
                //             })
                //         }
                //     })
                config.DataLoad = true;
                var Response: any = []
                var select = "ParentTask/Title,ParentTask/Id,Services/Title,ClientTime,Services/Id,Events/Id,Events/Title,ItemRank,Portfolio_x0020_Type,SiteCompositionSettings,SharewebTaskLevel1No,SharewebTaskLevel2No,TimeSpent,BasicImageInfo,OffshoreComments,OffshoreImageUrl,CompletedDate,Shareweb_x0020_ID,Responsible_x0020_Team/Id,Responsible_x0020_Team/Title,SharewebCategories/Id,SharewebCategories/Title,ParentTask/Shareweb_x0020_ID,SharewebTaskType/Id,SharewebTaskType/Title,SharewebTaskType/Level,Priority_x0020_Rank,Reference_x0020_Item_x0020_Json,Team_x0020_Members/Title,Team_x0020_Members/Name,Component/Id,Component/Title,Component/ItemType,Team_x0020_Members/Id,Item_x002d_Image,component_x0020_link,IsTodaysTask,AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,ClientCategory/Id,ClientCategory/Title,FileLeafRef,FeedBack,Title,Id,PercentComplete,Company,StartDate,DueDate,Comments,Categories,Status,WebpartId,Body,Mileage,PercentComplete,ClientCategory,Priority,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title&$expand=ParentTask,Events,Services,SharewebTaskType,AssignedTo,Component,ClientCategory,Author,Editor,Team_x0020_Members,Responsible_x0020_Team,SharewebCategories";
                if (config.Title == 'Master Tasks') {
                    select = "ComponentCategory/Id,ComponentCategory/Title,Services/Title,Services/Id,Events/Id,Events/Title,SiteCompositionSettings,ShortDescriptionVerified,Portfolio_x0020_Type,BackgroundVerified,descriptionVerified,Synonyms,BasicImageInfo,OffshoreComments,OffshoreImageUrl,HelpInformationVerified,IdeaVerified,TechnicalExplanationsVerified,Deliverables,DeliverablesVerified,ValueAddedVerified,CompletedDate,SharewebTaskType/Id,SharewebTaskType/Title,SharewebTaskType/Level,Idea,ValueAdded,TechnicalExplanations,Item_x0020_Type,Sitestagging,Package,Parent/Id,Parent/Title,Short_x0020_Description_x0020_On,Short_x0020_Description_x0020__x,Short_x0020_description_x0020__x0,Admin_x0020_Notes,AdminStatus,Background,Help_x0020_Information,SharewebComponent/Id,SharewebCategories/Id,SharewebCategories/Title,Priority_x0020_Rank,Reference_x0020_Item_x0020_Json,Team_x0020_Members/Title,Team_x0020_Members/Name,Component/Id,Component/Title,Component/ItemType,Team_x0020_Members/Id,Item_x002d_Image,component_x0020_link,IsTodaysTask,AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,AttachmentFiles/FileName,FileLeafRef,FeedBack,Title,Id,PercentComplete,Company,StartDate,DueDate,Comments,Categories,Status,WebpartId,Body,Mileage,PercentComplete,Attachments,Priority,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title&$expand=SharewebTaskType,ComponentCategory,AssignedTo,Component,Events,Services,AttachmentFiles,Author,Editor,Team_x0020_Members,SharewebComponent,SharewebCategories,Parent";
                }
                var url = "https://hhhhteams.sharepoint.com/sites/HHHH/SP/_api/web/lists/getbyid('" + config.listId + "')/items?$select=" + select + '&$' + query;
                $.ajax({
                    url: url,
                    method: "GET",
                    headers: {
                        "Accept": "application/json; odata=verbose"
                    },
                    success: function (data) {
                        Counter++;
                        console.log(data.d.results.length);
                        $.each(data.d.results, function (index: any, item: any) {
                            item.isDrafted = false;
                            item.flag = true;
                            item.siteType = config.Title;
                            item.childs = [];

                            if (item.SharewebCategories.results != undefined) {
                                if (item.SharewebCategories.results.length > 0) {
                                    $.each(item.SharewebCategories.results, function (ind: any, value: any) {
                                        if (value.Title.toLowerCase() == 'draft') {
                                            item.isDrafted = true;
                                        }
                                    });
                                }
                            }
                        })
                        AllTasks = AllTasks.concat(data.d.results);
                        AllTasks = $.grep(AllTasks, function (type: any) { return type.isDrafted == false });
                        // var result = $.grep(AllTasks, function (mPho, index) {
                        //     {return mPho.isDrafted == false};
                        // });
                        if (Counter == 18) {
                            $.each(AllTasks, function (index: any, result: any) {
                                result.TeamLeaderUser = []
                                result.TeamLeaderUserTitle = ''
                                result.DueDate = Moment(result.DueDate).format('DD/MM/YYYY')

                                if (result.DueDate == 'Invalid date' || '') {
                                    result.DueDate = result.DueDate.replaceAll("Invalid date", "")
                                }
                                result.PercentComplete = (result.PercentComplete * 100).toFixed(0);

                                if (result.Short_x0020_Description_x0020_On != undefined) {
                                    result.Short_x0020_Description_x0020_On = result.Short_x0020_Description_x0020_On.replace(/(<([^>]+)>)/ig, '');
                                }

                                if (result.AssignedTo != undefined && result.AssignedTo.length > 0) {
                                    $.each(result.AssignedTo, function (index: any, Assig: any) {
                                        if (Assig.Id != undefined) {
                                            $.each(TaskUsers, function (index: any, users: any) {

                                                if (Assig.Id != undefined && users.AssingedToUserId != undefined && Assig.Id == users.AssingedToUserId) {
                                                    users.ItemCover = users.Item_x0020_Cover;
                                                    result.TeamLeaderUser.push(users);
                                                    result.TeamLeaderUserTitle += users.Title + ';';
                                                }

                                            })
                                        }
                                    })
                                }
                                if (result.Team_x0020_Members != undefined && result.Team_x0020_Members.results != undefined && result.Team_x0020_Members.results.length > 0) {
                                    $.each(result.Team_x0020_Members.results, function (index: any, Assig: any) {
                                        if (Assig.Id != undefined) {
                                            $.each(TaskUsers, function (index: any, users: any) {
                                                if (Assig.Id != undefined && users.AssingedToUserId != undefined && Assig.Id == users.AssingedToUserId) {
                                                    users.ItemCover = users.Item_x0020_Cover;
                                                    result.TeamLeaderUser.push(users);
                                                    result.TeamLeaderUserTitle += users.Title + ';';
                                                }

                                            })
                                        }
                                    })
                                }
                                result['SiteIcon'] = GetIconImageUrl(result.siteType, 'https://hhhhteams.sharepoint.com/sites/HHHH/SP', undefined);
                                if (result.ClientCategory != undefined && result.ClientCategory.length > 0) {
                                    $.each(result.Team_x0020_Members, function (index: any, catego: any) {
                                        result.ClientCategory.push(catego);
                                    })
                                }
                                result['Shareweb_x0020_ID'] = getSharewebId(result);
                                if (result['Shareweb_x0020_ID'] == undefined) {
                                    result['Shareweb_x0020_ID'] = "";
                                }
                                TasksItem.push(result);
                                // if (task.ClientCategory != undefined && task.ClientCategory.results != undefined && task.ClientCategory.results.length > 0) {

                                //     $.each(task.ClientCategory.results, function (index: any, clientcategory: any) {
                                //         task.ClientCategoryTitle = task.ClientCategoryTitle + ';' + clientcategory.Title;
                                //     })
                                //     $.each(TaxonomyItems, function (newindex: any, firstLevel: any) {
                                //         $.each(task.ClientCategory.results, function (index: any, clientcategory: any) {
                                //             if (clientcategory.ParentClientCategoryStructure == undefined)
                                //                 clientcategory.ParentClientCategoryStructure = '';
                                //             if (firstLevel.Id == clientcategory.Id && firstLevel.Parent.Title != undefined) {
                                //                 clientcategory.ParentClientCategoryStructure = firstLevel.Parent.Title + '>' + firstLevel.Title;
                                //             }
                                //             else if (firstLevel.Id == clientcategory.Id && firstLevel.Parent.Title == undefined) {
                                //                 clientcategory.ParentClientCategoryStructure = firstLevel.Title;
                                //             }
                                //         })
                                //         if (firstLevel.childs != undefined && firstLevel.childs.length > 0) {
                                //             $.each(firstLevel.childs, function (index: any, SecondLevel: any) {
                                //                 $.each(task.ClientCategory.results, function (index: any, clientcategory: any) {
                                //                     if (clientcategory.ParentClientCategoryStructure == undefined)
                                //                         clientcategory.ParentClientCategoryStructure = '';
                                //                     if (SecondLevel.Id == clientcategory.Id && SecondLevel.Parent.Title != undefined) {
                                //                         clientcategory.ParentClientCategoryStructure = SecondLevel.Parent.Title + '>' + SecondLevel.Title;
                                //                     }
                                //                 })
                                //                 if (SecondLevel.childs != undefined && SecondLevel.childs.length > 0) {
                                //                     $.each(SecondLevel.childs, function (index: any, ThirdLevel: any) {
                                //                         $.each(task.ClientCategory.results, function (index: any, clientcategory: any) {
                                //                             if (clientcategory.ParentClientCategoryStructure == undefined)
                                //                                 clientcategory.ParentClientCategoryStructure = '';
                                //                             if (ThirdLevel.Id == clientcategory.Id && ThirdLevel.Parent.Title != undefined) {
                                //                                 clientcategory.ParentClientCategoryStructure = SecondLevel.Parent.Title + '>' + ThirdLevel.Parent.Title + '>' + ThirdLevel.Title;
                                //                             }
                                //                         })
                                //                     })

                                //                 }
                                //             })

                                //         }
                                //     })
                                // } else task.ClientCategory = [];

                                // task['Item_x0020_Type'] = 'Task';
                                // task['flag'] = true;
                                // task['newTitle'] = task.Title;
                                // task['childsLength'] = 0;
                                // task['childs'] = [];
                                // task['select'] = false;
                                // task['isShifted'] = false;
                                // task['mailcomments'] = '';
                                // if (task['Body'] != "") {
                                //     task['WordCount'] = countOfWord(task['Body']);
                                // }
                                // task.Short_x0020_Description_x0020_On = []
                                // if (task.FeedBack != undefined && task.FeedBack[0] != '' && parseJSON(task.FeedBack) != undefined && parseJSON(task.FeedBack)[0] != undefined && parseJSON(task.FeedBack)[0] != '') {
                                //     task.Short_x0020_Description_x0020_On = parseJSON(task.FeedBack)[0].FeedBackDescriptions
                                //     if (task.Short_x0020_Description_x0020_On[0] != undefined && task.Short_x0020_Description_x0020_On[0] != '' && task.Short_x0020_Description_x0020_On[0].Title != '' && task.Short_x0020_Description_x0020_On[0].Title != undefined)
                                //         task['searchSortDescription'] = task.Short_x0020_Description_x0020_On[0].Title.replace(/<\/?.+?>/ig, '');
                                // }
                                // $.each(task.Short_x0020_Description_x0020_On, function (index: any, item: any) {
                                //     $.each(item.Comments, function (index: any, com: any) {
                                //         task['searchSortDescription'] = com.Title;
                                //     })
                                // })
                                // if (task.Comments != undefined && task.Comments != '' && task.Comments != null && task.Comments != 'Done')
                                //     task.mailComment = parseJSON(task.Comments)
                                // $.each(task.mailComment, function (index: any, item: any) {
                                //     task['mailcomments'] += item.Description
                                // })
                                // task['PortfolioItemsId'] = undefined
                                // if (task.Component.results.length > 0) {
                                //     task['PortfolioItemsId'] = task.Component.results[0].Id;
                                // }
                                // else if (task.Services.results.length > 0) {
                                //     task['PortfolioItemsId'] = task.Services.results[0].Id;
                                // }
                                // else if (task.Events.results.length > 0) {
                                //     task['PortfolioItemsId'] = task.Events.results[0].Id;
                                // }
                                // if (task.SharewebTaskType.Title == undefined) {
                                //     task.SharewebTaskType.Title = 'Task';
                                // }
                                // task['Shareweb_x0020_ID'] = getSharewebId(index, task);
                                // if (task['Shareweb_x0020_ID'] == undefined) {
                                //     task['Shareweb_x0020_ID'] = "";
                                // }
                                // if (task['DateModified'] != undefined) task['Modified'] = Moment(task['DateModified']).format('DD/MM/YYYY'); //new Date(task['DateModified']).format('dd/MM/yyyy');
                                // if (task['Created'] != undefined) task['Created'] = Moment(task['Created']).format('DD/MM/YYYY'); //new Date(task['Created']).format('dd/MM/yyyy');
                                // if (task['CompletedDate'] != undefined) task['DateTaskDueDate'] = Moment(task['CompletedDate']).format('DD/MM/YYYY'); //new Date(task['CompletedDate']);
                                // if (task['CompletedDate'] != undefined) task['CompletedDate'] = Moment(task['CompletedDate']).format('DD/MM/YYYY'); //new Date(task['CompletedDate']).format('dd/MM/yyyy');
                                // if (task['StartDate'] != undefined) task['StartDate'] = Moment(task['StartDate']).format('DD/MM/YYYY'); //new Date(task['StartDate']).format('dd/MM/yyyy');
                                // if (task['DueDate'] != undefined) {
                                //     task['MainDueDate'] = (task.DueDate);
                                //     var dateE = (new Date(task.DueDate));
                                //     task.NewestDueDate = dateE.setDate(dateE.getDate());
                                // }
                                // task['SiteIcon'] = GetIconImageUrl(task.siteType, 'https://hhhhteams.sharepoint.com/sites/HHHH/SP', '');
                                // if (task['DueDate'] != undefined) task['DueDate'] = Moment(task['DueDate']).format('DD/MM/YYYY'); //new Date(task['DueDate']).toString('dd/MM/yyyy');
                                // task.AssignedUser = [];
                                // task.TeamMemberUser = [];
                                // task.AllTeamName = '';
                                // task['AdditionalTeam'] = [];
                                // task['CompleteStructure'] = makeFullStructureOfPortfolioTaskDatabase(task, AllTasks);
                                // task.TeamLeaderUser = []
                                // getTeamLeadersName(task.Responsible_x0020_Team, task);
                                // getTeamLeadersName(task.Team_x0020_Members, task);

                                // // getTeamLeadersShowImage(task.Responsible_x0020_Team, task.AssignedUser, task['AdditionalTeam']);
                                // // getTeamLeadersShowImage(task.Team_x0020_Members, task.TeamMemberUser, task['AdditionalTeam']);
                                // TasksItem.push(task);
                                // task['AdditionalTeamName'] = '';
                                // $.each(task['AdditionalTeam'], function (index: any, team: any) {
                                //     task['AdditionalTeamName'] += "<div>" + (index + 1) + ". " + team.Title + "</div>";
                                // });
                                // if (task.ClientCategory != undefined && task.ClientCategory.results != undefined && task.ClientCategory.results.length > 0) {

                                //     $.each(task.ClientCategory.results, function (index: any, clientcategory: any) {
                                //         task.ClientCategoryTitle = task.ClientCategoryTitle + ';' + clientcategory.Title;
                                //     })
                                //     $.each(TaxonomyItems, function (newindex: any, firstLevel: any) {
                                //         $.each(task.ClientCategory.results, function (index: any, clientcategory: any) {
                                //             if (clientcategory.ParentClientCategoryStructure == undefined)
                                //                 clientcategory.ParentClientCategoryStructure = '';
                                //             if (firstLevel.Id == clientcategory.Id && firstLevel.Parent.Title != undefined) {
                                //                 clientcategory.ParentClientCategoryStructure = firstLevel.Parent.Title + '>' + firstLevel.Title;
                                //             }
                                //             else if (firstLevel.Id == clientcategory.Id && firstLevel.Parent.Title == undefined) {
                                //                 clientcategory.ParentClientCategoryStructure = firstLevel.Title;
                                //             }
                                //         })
                                //         if (firstLevel.childs != undefined && firstLevel.childs.length > 0) {
                                //             $.each(firstLevel.childs, function (index: any, SecondLevel: any) {
                                //                 $.each(task.ClientCategory.results, function (index: any, clientcategory: any) {
                                //                     if (clientcategory.ParentClientCategoryStructure == undefined)
                                //                         clientcategory.ParentClientCategoryStructure = '';
                                //                     if (SecondLevel.Id == clientcategory.Id && SecondLevel.Parent.Title != undefined) {
                                //                         clientcategory.ParentClientCategoryStructure = SecondLevel.Parent.Title + '>' + SecondLevel.Title;
                                //                     }
                                //                 })
                                //                 if (SecondLevel.childs != undefined && SecondLevel.childs.length > 0) {
                                //                     $.each(SecondLevel.childs, function (index: any, ThirdLevel: any) {
                                //                         $.each(task.ClientCategory.results, function (index: any, clientcategory: any) {
                                //                             if (clientcategory.ParentClientCategoryStructure == undefined)
                                //                                 clientcategory.ParentClientCategoryStructure = '';
                                //                             if (ThirdLevel.Id == clientcategory.Id && ThirdLevel.Parent.Title != undefined) {
                                //                                 clientcategory.ParentClientCategoryStructure = SecondLevel.Parent.Title + '>' + ThirdLevel.Parent.Title + '>' + ThirdLevel.Title;
                                //                             }
                                //                         })
                                //                     })

                                //                 }
                                //             })

                                //         }
                                //     })
                                // } else task.ClientCategory = [];

                                // task['Item_x0020_Type'] = 'Task';
                                // task['flag'] = true;
                                // task['newTitle'] = task.Title;
                                // task['childsLength'] = 0;
                                // task['childs'] = [];
                                // task['select'] = false;
                                // task['isShifted'] = false;
                                // task['mailcomments'] = '';
                                // if (task['Body'] != "") {
                                //     task['WordCount'] = countOfWord(task['Body']);
                                // }
                                // task.Short_x0020_Description_x0020_On = []
                                // if (task.FeedBack != undefined && task.FeedBack[0] != '' && parseJSON(task.FeedBack) != undefined && parseJSON(task.FeedBack)[0] != undefined && parseJSON(task.FeedBack)[0] != '') {
                                //     task.Short_x0020_Description_x0020_On = parseJSON(task.FeedBack)[0].FeedBackDescriptions
                                //     if (task.Short_x0020_Description_x0020_On[0] != undefined && task.Short_x0020_Description_x0020_On[0] != '' && task.Short_x0020_Description_x0020_On[0].Title != '' && task.Short_x0020_Description_x0020_On[0].Title != undefined)
                                //         task['searchSortDescription'] = task.Short_x0020_Description_x0020_On[0].Title.replace(/<\/?.+?>/ig, '');
                                // }
                                // $.each(task.Short_x0020_Description_x0020_On, function (index: any, item: any) {
                                //     $.each(item.Comments, function (index: any, com: any) {
                                //         task['searchSortDescription'] = com.Title;
                                //     })
                                // })
                                // if (task.Comments != undefined && task.Comments != '' && task.Comments != null && task.Comments != 'Done')
                                //     task.mailComment = parseJSON(task.Comments)
                                // $.each(task.mailComment, function (index: any, item: any) {
                                //     task['mailcomments'] += item.Description
                                // })
                                // task['PortfolioItemsId'] = undefined
                                // if (task.Component.results.length > 0) {
                                //     task['PortfolioItemsId'] = task.Component.results[0].Id;
                                // }
                                // else if (task.Services.results.length > 0) {
                                //     task['PortfolioItemsId'] = task.Services.results[0].Id;
                                // }
                                // else if (task.Events.results.length > 0) {
                                //     task['PortfolioItemsId'] = task.Events.results[0].Id;
                                // }
                                // if (task.SharewebTaskType.Title == undefined) {
                                //     task.SharewebTaskType.Title = 'Task';
                                // }
                                // task['Shareweb_x0020_ID'] = getSharewebId(index, task);
                                // if (task['Shareweb_x0020_ID'] == undefined) {
                                //     task['Shareweb_x0020_ID'] = "";
                                // }
                                // if (task['DateModified'] != undefined) task['Modified'] = Moment(task['DateModified']).format('DD/MM/YYYY'); //new Date(task['DateModified']).format('dd/MM/yyyy');
                                // if (task['Created'] != undefined) task['Created'] = Moment(task['Created']).format('DD/MM/YYYY'); //new Date(task['Created']).format('dd/MM/yyyy');
                                // if (task['CompletedDate'] != undefined) task['DateTaskDueDate'] = Moment(task['CompletedDate']).format('DD/MM/YYYY'); //new Date(task['CompletedDate']);
                                // if (task['CompletedDate'] != undefined) task['CompletedDate'] = Moment(task['CompletedDate']).format('DD/MM/YYYY'); //new Date(task['CompletedDate']).format('dd/MM/yyyy');
                                // if (task['StartDate'] != undefined) task['StartDate'] = Moment(task['StartDate']).format('DD/MM/YYYY'); //new Date(task['StartDate']).format('dd/MM/yyyy');
                                // if (task['DueDate'] != undefined) {
                                //     task['MainDueDate'] = (task.DueDate);
                                //     var dateE = (new Date(task.DueDate));
                                //     task.NewestDueDate = dateE.setDate(dateE.getDate());
                                // }
                                // task['SiteIcon'] = GetIconImageUrl(task.siteType, 'https://hhhhteams.sharepoint.com/sites/HHHH/SP', '');
                                // if (task['DueDate'] != undefined) task['DueDate'] = Moment(task['DueDate']).format('DD/MM/YYYY'); //new Date(task['DueDate']).toString('dd/MM/yyyy');
                                // task.AssignedUser = [];
                                // task.TeamMemberUser = [];
                                // task.AllTeamName = '';
                                // task['AdditionalTeam'] = [];
                                // task['CompleteStructure'] = makeFullStructureOfPortfolioTaskDatabase(task, AllTasks);
                                // task.TeamLeaderUser = []
                                // getTeamLeadersName(task.Responsible_x0020_Team, task);
                                // getTeamLeadersName(task.Team_x0020_Members, task);

                                // // getTeamLeadersShowImage(task.Responsible_x0020_Team, task.AssignedUser, task['AdditionalTeam']);
                                // // getTeamLeadersShowImage(task.Team_x0020_Members, task.TeamMemberUser, task['AdditionalTeam']);
                                // TasksItem.push(task);
                                // task['AdditionalTeamName'] = '';
                                // $.each(task['AdditionalTeam'], function (index: any, team: any) {
                                //     task['AdditionalTeamName'] += "<div>" + (index + 1) + ". " + team.Title + "</div>";
                                // });
                            })
                            TasksItem = (AllTasks);
                            console.log(Response);
                            $.each(TasksItem, function (index: any, task: any) {
                                if (!isItemExistsNew(CopyTaskData, task)) {
                                    CopyTaskData.push(task);
                                }
                            })
                            filterDataBasedOnList();
                            // $scope.Advancefilter();
                            // $scope.Advancefilter();
                        }
                        // if (data.d.__next) {
                        //     url = data.d.__next;
                        // }
                        // else setTask(Response);
                        // if (data.d.__next) {
                        //     url = data.d.__next;
                        // }
                        // else setTask(Response);
                    },
                    error: function (error) {
                        Counter++;
                    }

                });



            } else Counter++;

        })

    }
    const handleOpen2 = (item: any) => {

        item.show = item.show = item.show == true ? false : true;
        setfilterItems(filterItems => ([...filterItems]));


    };
    const handleOpen = (item: any) => {

        item.show = item.show = item.show == true ? false : true;
        setData(maidataBackup => ([...maidataBackup]));

    };
    const handleEditPopup = (item: any) => {

        //    item.Isclick = item.Isclick = item.Isclick == true ? false : true;
        //    setData(data => ([...data]));

        // item.Isclick = item.Isclick = item.Isclick == true ? false : true;
        //setData(data => ([...data]));

    };

    // const handleTimeOpen = (item: any) => {

    //     item.show = item.show = item.show == true ? false : true;
    //     setTimeSheet(TaskTimeSheetCategoriesGrouping => ([...TaskTimeSheetCategoriesGrouping]));
    //     // setData(data => ([...data]));

    // };

    // const handleTimeOpen = (item: any) => {

    //     item.show = item.show = item.show == true ? false : true;
    //     setTimeSheet(TaskTimeSheetCategoriesGrouping => ([...TaskTimeSheetCategoriesGrouping]));
    //     // setData(data => ([...data]));

    // };


    const addModal = () => {
        setAddModalOpen(true)
    }
    const setModalIsOpenToTrue = () => {
        setModalIsOpen(true)
    }


    const sortBy = () => {

        const copy = data

        copy.sort((a, b) => (a.Title > b.Title) ? 1 : -1);

        setTable(copy)

    }
    const sortByDng = () => {

        const copy = data

        copy.sort((a, b) => (a.Title > b.Title) ? -1 : 1);

        setTable(copy)

    }
    // let handleChange = (e: { target: { value: string; }; }, titleName: any) => {
    //     setSearch(e.target.value.toLowerCase());
    //     var Title = titleName;
    // };
    // let handleChange = (e: { target: { value: string; }; }, titleName: any) => {
    //     setSearch(e.target.value.toLowerCase());
    //     var Title = titleName;
    // };
    var stringToArray = function (input: any) {
        if (input) {
            return input.match(/\S+/g);
        } else {
            return [];
        }
    };
    var getSearchTermAvialable1 = function (searchTerms: any, item: any, Title: any) {
        var isSearchTermAvailable = true;
        $.each(searchTerms, function (index: any, val: any) {
            if (isSearchTermAvailable && (item[Title] != undefined && item[Title].toLowerCase().indexOf(val.toLowerCase()) > -1)) {
                isSearchTermAvailable = true;

            } else
                isSearchTermAvailable = false;
        })
        return isSearchTermAvailable;
    }
    let handleChange1 = (e: { target: { value: string; }; }, titleName: any) => {
        setSearch(e.target.value.toLowerCase());
        var Title = titleName;

        var AllFilteredTagNews = [];
        var filterglobal = e.target.value.toLowerCase();
        if (filterglobal != undefined && filterglobal.length >= 1) {
            var searchTerms = stringToArray(filterglobal);
            $.each(data, function (pareIndex: any, item: any) {
                item.flag = false;
                item.isSearch = true;
                item.show = false;
                item.flag = (getSearchTermAvialable1(searchTerms, item, Title));
                if (item.childs != undefined && item.childs.length > 0) {
                    $.each(item.childs, function (parentIndex: any, child1: any) {
                        child1.flag = false;
                        child1.isSearch = true;
                        child1.flag = (getSearchTermAvialable1(searchTerms, child1, Title));
                        if (child1.flag) {
                            item.childs[parentIndex].flag = true;
                            data[pareIndex].flag = true;
                            item.childs[parentIndex].show = true;
                            data[pareIndex].show = true;
                        }
                        if (child1.childs != undefined && child1.childs.length > 0) {
                            $.each(child1.childs, function (index: any, subchild: any) {
                                subchild.flag = false;
                                subchild.flag = (getSearchTermAvialable1(searchTerms, subchild, Title));
                                if (subchild.flag) {
                                    item.childs[parentIndex].flag = true;
                                    child1.flag = true;
                                    child1.childs[index].flag = true;
                                    child1.childs[index].show = true;
                                    item.childs[parentIndex].show = true;
                                    data[pareIndex].flag = true;
                                    data[pareIndex].show = true;
                                }
                                if (subchild.childs != undefined && subchild.childs.length > 0) {
                                    $.each(subchild.childs, function (childindex: any, subchilds: any) {
                                        subchilds.flag = false;
                                        subchilds.Title = subchilds.newTitle;
                                        subchilds.flag = (getSearchTermAvialable1(searchTerms, subchilds, Title));
                                        if (subchilds.flag) {
                                            item.childs[parentIndex].flag = true;
                                            subchild.flag = true;
                                            subchild.childs[index].show = true;
                                            subchild.childs[childindex].flag = true;
                                            item.childs[parentIndex].show = true;
                                            subchild.childs[childindex].show = true;
                                            data[pareIndex].flag = true;
                                            data[pareIndex].show = true;
                                        }
                                    })
                                }
                            })
                        }

                    })
                }
            })
            //   getFilterLength();
        } else {
            //  ungetFilterLength();
            // setData(data => ([...maidataBackup]));
            setData(maidataBackup);
            //setData(ComponentsData)= SharewebCommonFactoryService.ArrayCopy($scope.CopyData);
        }
        // console.log($scope.ComponetsData['allComponentItemWithStructure']);

    };

    var siteConfig: any = [];
    var TaxonomyItems: any = [];
    var AllComponetsData: any = [];
    var TaskUsers: any = [];
    var RootComponentsData: any = [];
    // var ComponentsData: any = [];
    // var SubComponentsData: any = []; var FeatureData: any = [];
    var MetaData: any = []
    var showProgressBar = () => {
        $(' #SpfxProgressbar').show();
    }

    var showProgressHide = () => {
        $(' #SpfxProgressbar').hide();
    }
    React.useEffect(() => {


        showProgressBar();
        function RetrieveSPData() {
            //--------------------------task user--------------------------------------------------------------------------------------------------
            var Response: any = []
            var url = "https://hhhhteams.sharepoint.com/sites/HHHH/SP/_api/web/lists/getbyid('b318ba84-e21d-4876-8851-88b94b9dc300')/items?$top=1000";

            $.ajax({


                url: url,


                method: "GET",


                headers: {


                    "Accept": "application/json; odata=verbose"


                },

                success: function (data) {

                    Response = Response.concat(data.d.results);
                    TaskUsers = Response;
                    console.log(Response);
                    setTaskUser(Response);
                    //   if (data.d.__next) {

                    //   url = data.d.__next;



                    // }
                    //  else setTaskUser(Response);


                    setTaskUser(Response);
                    //   if (data.d.__next) {

                    //   url = data.d.__next;



                    // }
                    //  else setTaskUser(Response);


                },

                error: function (error) {


                }

            });

            //-----------------------------------end taskuser data--------------------------------------------------------------------------------------------

            //----------------------------------------LoadSmartMetaData---------------------------------------------------------------------------------------------------------------------------



            var metadatItem: any = []
            var filterItems: any = [];
            // siteConfig =[];
            // var filterGroups: any = [];
            // siteConfig =[];
            // var filterGroups: any = [];
            filterGroups.push("Portfolio");
            filterGroups.push("Sites");
            filterGroups.push("Type");
            filterGroups.push("Team Members");
            // setFilterGroups(filterGroups);
            var url = "https://hhhhteams.sharepoint.com/sites/HHHH/SP/_api/web/lists/getbyid('01a34938-8c7e-4ea6-a003-cee649e8c67a')/items?$select=Id,Title,IsVisible,ParentID,SmartSuggestions,TaxType,Description1,Item_x005F_x0020_Cover,listId,siteName,siteUrl,SortOrder,SmartFilters,Selectable,Parent/Id,Parent/Title&$expand=Parent&$orderby=SortOrder&$top=4999";
            $.ajax({
                url: url,
                method: "GET",
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (data) {
                    MetaData = MetaData.concat(data.d.results);
                    setMetadata(MetaData);
                    $.each(MetaData, function (item: any, newtest) {
                        if (newtest.ParentID == 0 && newtest.TaxType == 'Client Category') {
                            TaxonomyItems.push(newtest);
                        }
                        if (newtest.TaxType == 'Sites') {
                            siteConfig.push(newtest)
                        }
                    });
                    LoadAllSiteTasks();
                    $.each(siteConfig, function (index: any, newsite) {
                        /*-- Code for default Load Task Data---*/
                        if (newsite.Title == "DRR" && newsite.Title == "Small Projects" && newsite.Title == "Gruene" && newsite.Title == "Offshore Tasks" && newsite.Title == "Health" && newsite.Title == "Shareweb Old") {
                            newsite.Selected = false;
                        }
                        else {
                            newsite.Selected = true;
                        }
                        if (newsite.Title != "Master Tasks" || newsite.Title != "Foundation")
                            siteConfig.push(newsite);
                    })
                    $.each(MetaData, function (newitem: any, item) {
                        if (item.TaxType != 'Status' && item.TaxType != 'Admin Status' && item.TaxType != 'Task Type' && item.TaxType != 'Time' && item.Id != 300 && item.TaxType != 'Portfolio Type' && item.TaxType != 'Task Types') {
                            if (item.TaxType == 'Sites') {
                                item.DataLoad = false;
                                /*-- Code for default Load Task Data---*/
                                if (item.Title == "DRR" || item.Title == "Small Projects" || item.Title == "Offshore Tasks" || item.Title == "Health") {
                                    item.Selected = false;
                                }
                                else {
                                    item.Selected = true;
                                }
                            }
                            else if (item.TaxType == 'Sites Old') {
                                /*-- Code for default Load Task Data---*/
                                item.Selected = true;
                            }
                            metadatItem.push(item);
                            //setFilterGroups(metadatItem)
                        }
                    })
                    $.each(Response, function (index: any, user) {
                        user.TaxType = 'Team Members';
                        user.SmartFilters = {};
                        user.SmartFilters.results = [];
                        user.SmartFilters.results.push('Portfolio');
                        if (user.UserGroupId == undefined)
                            user.ParentID = 0;
                        if (user.UserGroupId != undefined)
                            user.ParentID = user.UserGroupId;
                        metadatItem.push(user);
                    });
                    $.each(metadatItem, function (newi: any, item) {
                        if (item.Title == 'Shareweb Old') {
                            item.TaxType = 'Sites';
                        }
                    })
                    $.each(metadatItem, function (newitem: any, filterItem) {
                        if (filterItem.SmartFilters != undefined && filterItem.SmartFilters.results != undefined && filterItem.SmartFilters.results.indexOf('Portfolio') > -1) {
                            var item: any = [];
                            item.ID = item.Id = filterItem.Id;
                            item.Title = filterItem.Title;
                            item.Group = filterItem.TaxType;
                            item.value = filterItem.Id;
                            item.label = filterItem.Title;
                            item.TaxType = filterItem.TaxType;
                            if (item.Title == "Activities" || item.Title == "Workstream" || item.Title == "Task") {
                                item.Selected = true;
                            }


                            if (filterItem.ParentID == 0 || (filterItem.Parent != undefined && filterItem.Parent.Id == undefined)) {
                                if (item.TaxType == 'Team Members') {
                                    getChildsBasedonId(item, Response);
                                } else {
                                    getChildsBasedOn(item, MetaData);
                                }
                                filterItems.push(item);
                                if (filterItem.TaxType != "Type" && filterItem.TaxType != "Sites Old" && (filterGroups.length == 0 || filterGroups.indexOf(filterItem.TaxType) == -1)) {
                                    filterGroups.push(filterItem.TaxType);

                                }

                                setFilterGroups(filterGroups)

                            }

                        }
                    });

                    filterItems.push({ "Group": "Portfolio", "TaxType": "Portfolio", "Title": "Component", "Selected": true, 'value': 1000, 'label': "Component", "childs": [] }, { "Group": "Portfolio", "TaxType": "Portfolio", "Title": "SubComponent", "Selected": true, 'value': 10000, 'label': "SubComponent", "childs": [] }, { "Group": "Portfolio", "TaxType": "Portfolio", "Title": "Feature", "Selected": true, 'value': 100000000, 'label': "Feature", "childs": [] });
                    $.each(filterItems, function (neww: any, item) {
                        if (item.TaxType == "Sites" && item.Title == 'SDC Sites' || item.Title == 'Tasks') {
                            item.Selected = true;
                        }
                    })
                    setfilterItems(filterItems)

                    function getChildsBasedonId(item: { childs: any[]; Id: any; }, items: any) {
                        item.childs = [];
                        $.each(items, function (child: any, childItem) {
                            if (childItem.UserGroupId != undefined && childItem.UserGroupId == item.Id) {
                                childItem.value = childItem.Id;
                                childItem.label = childItem.Title;
                                item.childs.push(childItem);
                                getChildsBasedonId(childItem, items);
                            }
                        });
                    }
                    function getChildsBasedOn(item: { childs: any[]; ID: number; }, items: any) {
                        item.childs = [];
                        $.each(MetaData, function (news: any, childItem) {
                            if (childItem.Parent != undefined && childItem.Parent.Id != undefined && parseInt(childItem.Parent.Id) == item.ID) {
                                childItem.value = childItem.Id;
                                childItem.label = childItem.Title;
                                item.childs.push(childItem);
                                getChildsBasedOn(childItem, items);
                            }
                        });
                    }

                },


                error: function (error) {


                }

            });
            //---------------------------------------End SmartMetaData-------------------------------------------------------------------------------------------------------------------------------------

            var spRequest = new XMLHttpRequest();
            var query = "Id,Mileage,TaskListId,TaskListName,WorkspaceType,PortfolioLevel,PortfolioStructureID,component_x0020_link,Package,Comments,DueDate,Sitestagging,Body,Deliverables,SiteCompositionSettings,StartDate,Created,Item_x0020_Type,Help_x0020_Information,Background,Categories,TechnicalExplanations,Idea,ValueAdded,Synonyms,Package,Short_x0020_Description_x0020_On,Admin_x0020_Notes,AdminStatus,CategoryItem,Priority_x0020_Rank,Priority,TaskDueDate,DueDate,PercentComplete,Modified,CompletedDate,ItemRank,Title,Portfolio_x0020_Type,Parent/Id,Parent/Title,Component/Id,Component/Title,Component/ItemType,Services/Id,Services/Title,Services/ItemType,Events/Id,Events/Title,Events/ItemType,SharewebCategories/Id,SharewebCategories/Title,AssignedTo/Id,AssignedTo/Title,Team_x0020_Members/Id,Team_x0020_Members/Title,ClientCategory/Id,ClientCategory/Title&$expand=SharewebCategories,ClientCategory,Parent,Component,Services,Events,AssignedTo,Team_x0020_Members&$filter=((Item_x0020_Type eq 'Component') or (Item_x0020_Type eq 'SubComponent') or (Item_x0020_Type eq 'Feature'))and (Portfolio_x0020_Type eq 'Service')&$top=4999";
            spRequest.open('GET', "https://hhhhteams.sharepoint.com/sites/HHHH/SP/_api/lists/getbyid('ec34b38f-0669-480a-910c-f84e92e58adf')/items?$select=" + query);
            spRequest.setRequestHeader("Accept", "application/json");

            spRequest.onreadystatechange = function () {
                //  var RootComponentsData: any[] = [];
                // var ComponentsData: any = [];
                // var SubComponentsData: any = [];
                // var FeatureData: any = [];
                //  var RootComponentsData: any[] = [];
                // var ComponentsData: any = [];
                // var SubComponentsData: any = [];
                // var FeatureData: any = [];
                var maiArrayBackup: any = []

                if (spRequest.readyState === 4 && spRequest.status === 200) {
                    var results = JSON.parse(spRequest.responseText);

                    maiArrayBackup.push(results.value)
                    setmaiArrayBackup(maiArrayBackup)
                    AllComponetsData = maiArrayBackup[0];
                    //  setData(AllComponetsData);
                    ComponetsData['allComponets'] = AllComponetsData;



                }
                else if (spRequest.readyState === 4 && spRequest.status !== 200) {
                    console.log('Error Occurred !');
                }

            },

                spRequest.send();
        }
        RetrieveSPData();
        $.each(data, function (index: any, item) {
            $.each(state, function (index: any, select) {
                if (item.Portfolio_x0020_Type == select.Title) {
                    select.Selected = true;

                }
                if (item.Id == select.Id) {
                    select.Selected = true;

                }

            })

        })
    }, [])
    // common services
    const countOfWord = function (text: any) {
        var s = text ? text.split(/\s+/) : 0; // it splits the text on space/tab/enter
        return s ? s.length : '';
    };
    var parseJSON = function (jsonItem: any) {
        var json = [];
        try {
            json = JSON.parse(jsonItem);
        } catch (err) {
            console.log(err);
        }
        return json;
    };
    var getSharewebId = function (item: any) {
        var Shareweb_x0020_ID = undefined;
        if (item != undefined && item.SharewebTaskType != undefined && item.SharewebTaskType.Title == undefined) {
            Shareweb_x0020_ID = 'T' + item.Id;
        }
        else if (item.SharewebTaskType != undefined && (item.SharewebTaskType.Title == 'Task' || item.SharewebTaskType.Title == 'MileStone') && item.SharewebTaskLevel1No == undefined && item.SharewebTaskLevel2No == undefined) {
            Shareweb_x0020_ID = 'T' + item.Id;
            if (item.SharewebTaskType.Title == 'MileStone')
                Shareweb_x0020_ID = 'M' + item.Id;
        }
        else if (item.SharewebTaskType != undefined && (item.SharewebTaskType.Title == 'Activities' || item.SharewebTaskType.Title == 'Project') && item.SharewebTaskLevel1No != undefined) {
            if (item.Component != undefined) {
                if (item.Component.results != undefined && item.Component.results.length > 0) {
                    Shareweb_x0020_ID = 'CA' + item.SharewebTaskLevel1No;
                }
            }
            if (item.Services != undefined) {
                if (item.Services.results != undefined && item.Services.results.length > 0) {
                    Shareweb_x0020_ID = 'SA' + item.SharewebTaskLevel1No;
                }
            }
            if (item.Events != undefined) {
                if (item.Events.results != undefined && item.Events.results.length > 0) {
                    Shareweb_x0020_ID = 'EA' + item.SharewebTaskLevel1No;
                }
            }
            if (item.Component != undefined && item.Events != undefined && item.Services != undefined)
                // if (!item.Events.results.length > 0 && !item.Services.results.length > 0 && !item.Component.results.length > 0) {
                Shareweb_x0020_ID = 'A' + item.SharewebTaskLevel1No;
            //}
            if (item.Component == undefined && item.Events == undefined && item.Services == undefined) {
                Shareweb_x0020_ID = 'A' + item.SharewebTaskLevel1No;
            }
            if (item.SharewebTaskType.Title == 'Project')
                Shareweb_x0020_ID = 'P' + item.SharewebTaskLevel1No;

        }
        else if (item.SharewebTaskType != undefined && (item.SharewebTaskType.Title == 'Workstream' || item.SharewebTaskType.Title == 'Step') && item.SharewebTaskLevel1No != undefined && item.SharewebTaskLevel2No != undefined) {
            if (item.Component != undefined && item.Services != undefined && item.Events != undefined) {
                // if (!item.Events.results.length > 0 && !item.Services.results.length > 0 && !item.Component.results.length > 0) {
                Shareweb_x0020_ID = 'A' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No;
                // }
            }
            if (item.Component != undefined) {
                if (item.Component.results != undefined && item.Component.results.length > 0) {
                    Shareweb_x0020_ID = 'CA' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No;
                }
            }
            if (item.Services != undefined) {
                if (item.Services.results != undefined && item.Services.results.length > 0) {
                    Shareweb_x0020_ID = 'SA' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No;
                }
            }
            if (item.Events != undefined) {
                if (item.Events.results != undefined && item.Events.results.length > 0) {
                    Shareweb_x0020_ID = 'EA' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No;
                }
            }
            if (item.Component == undefined && item.Services == undefined && item.Events == undefined) {
                Shareweb_x0020_ID = 'A' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No;
            }
            if (item.SharewebTaskType.Title == 'Step')
                Shareweb_x0020_ID = 'P' + item.SharewebTaskLevel1No + '-S' + item.SharewebTaskLevel2No;

        }
        else if (item.SharewebTaskType != undefined && (item.SharewebTaskType.Title == 'Task' || item.SharewebTaskType.Title == 'MileStone') && item.SharewebTaskLevel1No != undefined && item.SharewebTaskLevel2No != undefined) {
            if (item.Component != undefined && item.Services != undefined && item.Events != undefined) {
                // if (!item.Events.results.length > 0 && !item.Services.results.length > 0 && !item.Component.results.length > 0) {
                Shareweb_x0020_ID = 'A' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No + '-T' + item.Id;
                //  }
            }
            if (item.Component != undefined) {
                if (item.Component.results != undefined && item.Component.results.length > 0) {
                    Shareweb_x0020_ID = 'CA' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No + '-T' + item.Id;
                }
            }
            if (item.Services != undefined) {
                if (item.Services.results != undefined && item.Services.results.length > 0) {
                    Shareweb_x0020_ID = 'SA' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No + '-T' + item.Id;
                }
            }
            if (item.Events != undefined) {
                if (item.Events.results != undefined && item.Events.results.length > 0) {
                    Shareweb_x0020_ID = 'EA' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No + '-T' + item.Id;
                }
            }
            if (item.Component == undefined && item.Services == undefined && item.Events == undefined) {
                Shareweb_x0020_ID = 'A' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No + '-T' + item.Id;
            }
            if (item.SharewebTaskType.Title == 'MileStone') {
                Shareweb_x0020_ID = 'P' + item.SharewebTaskLevel1No + '-S' + item.SharewebTaskLevel2No + '-M' + item.Id;
            }
        }
        else if (item.SharewebTaskType != undefined && (item.SharewebTaskType.Title == 'Task' || item.SharewebTaskType.Title == 'MileStone') && item.SharewebTaskLevel1No != undefined && item.SharewebTaskLevel2No == undefined) {
            if (item.Component != undefined && item.Services != undefined && item.Events != undefined) {
                //  if (!item.Events.results.length > 0 && !item.Services.results.length > 0 && !item.Component.results.length > 0) {
                Shareweb_x0020_ID = 'A' + item.SharewebTaskLevel1No + '-T' + item.Id;
                // }
            }
            if (item.Component != undefined) {
                if (item.Component.results != undefined && item.Component.results.length > 0) {
                    Shareweb_x0020_ID = 'CA' + item.SharewebTaskLevel1No + '-T' + item.Id;
                }
            }
            if (item.Services != undefined) {
                if (item.Services.results != undefined && item.Services.results.length > 0) {
                    Shareweb_x0020_ID = 'SA' + item.SharewebTaskLevel1No + '-T' + item.Id;
                }
            }
            if (item.Events != undefined) {
                if (item.Events.results != undefined && item.Events.results.length > 0) {
                    Shareweb_x0020_ID = 'EA' + item.SharewebTaskLevel1No + '-T' + item.Id;
                }
            }
            if (item.Component == undefined && item.Services == undefined && item.Events == undefined) {
                Shareweb_x0020_ID = 'A' + item.SharewebTaskLevel1No + '-T' + item.Id;
            }
            if (item.SharewebTaskType.Title == 'MileStone') {
                Shareweb_x0020_ID = 'P' + item.SharewebTaskLevel1No + '-M' + item.Id;
            }

        }
        return Shareweb_x0020_ID;
    }
    var ArrayCopy = function (array: any) {
        let MainArray = [];
        if (array != undefined && array.length != undefined) {
            MainArray = parseJSON(JSON.stringify(array));
        }
        return MainArray;
    }
    var stringToArray1 = function (input: any) {
        if (input) {
            return input.split('>');
        } else {
            return [];
        }
    };
    var getRegexPattern = function (keywordArray: any) {
        var pattern = "(^|\\b)(" + keywordArray.join("|") + ")";
        return new RegExp(pattern, "gi");
    };
    const makeFullStructureOfPortfolioTaskDatabase = function (task: any, AllTaskItems: any) {
        var CompleteStructure = "";
        if (task.SharewebTaskType != undefined && task.SharewebTaskType.Title == 'Activities' || task.SharewebTaskType != undefined && task.SharewebTaskType.Title == 'Smart Case') {
            CompleteStructure = task.Title;
        } else if (task.SharewebTaskType != undefined && task.SharewebTaskType.Title == 'Workstream') {
            //var temp = $.grep(AllTaskItems, item => { return item.Id == task.ParentTask.Id })[0];
            var temp = $.grep(AllTaskItems, function (item: any) { return (task.ParentTask != undefined && task.ParentTask.Id != undefined && item.Id == task.ParentTask.Id) })[0];
            if (temp != undefined)
                CompleteStructure = temp.Title + " >" + task.Title;
            else
                CompleteStructure = task.Title;
        } else if (task.SharewebTaskType != undefined && task.SharewebTaskType.Title == 'Task') {
            //  var temp = $.grep(AllTaskItems, item => { return item.Id == task.ParentTask.Id })[0];
            var temp = $.grep(AllTaskItems, function (item: any) { return (task.ParentTask != undefined && task.ParentTask.Id != undefined && item.Id == task.ParentTask.Id) })[0];
            if (temp == undefined || temp == null)
                CompleteStructure = task.Title;
            else {
                if (temp.SharewebTaskType != undefined && temp.SharewebTaskType.Title == 'Activities' || temp.SharewebTaskType != undefined && temp.SharewebTaskType.Title == 'Smart Case') {
                    CompleteStructure = temp.Title + " >" + task.Title;
                } else if (temp.SharewebTaskType != undefined && temp.SharewebTaskType.Title == 'Workstream') {
                    //var temp1 = $.grep(AllTaskItems, item => { return item.Id == temp.ParentTask.Id })[0];
                    var temp1 = $.grep(AllTaskItems, function (item: any) { return (task.ParentTask != undefined && task.ParentTask.Id != undefined && item.Id == task.ParentTask.Id) })[0];
                    if (temp1 == undefined) {
                        CompleteStructure = temp.Title + " >" + task.Title;
                    } else {
                        CompleteStructure = temp1.Title + " >" + temp.Title + " >" + task.Title;
                    }
                } else if (temp.SharewebTaskType != undefined && temp.SharewebTaskType.Title == 'Task') {
                    CompleteStructure = task.ParentTask.Title;
                }
            }
        }
        var MainComponent: any = [];

        if (task.PortfolioItemsId != undefined) {
            MainComponent = ArrayCopy($.grep(AllComponetsData, function (index: any, type: any) { return type.Id == task.PortfolioItemsId }));
        }
        if (task.Item_x0020_Type != undefined && task.Item_x0020_Type == 'Component' || task.Item_x0020_Type == 'SubComponent' || task.Item_x0020_Type == 'Feature') {
            MainComponent = ArrayCopy($.grep(AllComponetsData, function (type: any) { return type.Id == task.Id }));
        }

        var OtherStructure = "";
        if (MainComponent.length > 0) {
            if (MainComponent[0].Item_x0020_Type == 'Component') {
                OtherStructure = MainComponent[0].Title;
            } else if (MainComponent[0].Item_x0020_Type == 'SubComponent') {
                // var temp = $.grep($scope.AllComponetsData, item => { return item.Id == MainComponent[0].Parent.Id })[0];
                var temp = $.grep(AllComponetsData, function (item: any) { return (MainComponent[0].Parent != undefined && MainComponent[0].Parent.Id != undefined && item.Id == MainComponent[0].Parent.Id) })[0];
                if (temp != undefined)
                    OtherStructure = temp.Title + " >" + MainComponent[0].Title;
                else
                    OtherStructure = MainComponent[0].Title;
            } else if (MainComponent[0].Item_x0020_Type == 'Feature') {
                // var temp = $.grep($scope.AllComponetsData, item => { return item.Id == MainComponent[0].Parent.Id })[0];
                var temp = $.grep(AllComponetsData, function (item: any) { return (MainComponent[0].Parent != undefined && MainComponent[0].Parent.Id != undefined && item.Id == MainComponent[0].Parent.Id) })[0];
                if (temp == undefined || temp == null)
                    OtherStructure = MainComponent[0].Title;
                else {
                    if (temp.Item_x0020_Type != undefined && temp.Item_x0020_Type == 'Component') {
                        OtherStructure = temp.Title + " >" + MainComponent[0].Title;
                    } else if (temp.Item_x0020_Type == 'SubComponent') {
                        //var temp1 = $.grep($scope.AllComponetsData, item => { return item.Id == temp.Parent.Id })[0];
                        var temp1 = $.grep(AllComponetsData, function (item: any) { return (temp.Parent != undefined && temp.Parent.Id != undefined && item.Id == temp.Parent.Id) })[0];
                        if (temp1 == undefined) {
                            OtherStructure = temp.Title + " >" + MainComponent[0].Title;
                        } else {
                            OtherStructure = temp1.Title + " >" + temp.Title + " >" + MainComponent[0].Title;
                        }
                    } else if (temp.Item_x0020_Type == 'Task') {
                        OtherStructure = MainComponent[0].Parent.Title;
                    }
                }
            }
            if (CompleteStructure == '') {
                var keywordList = [];
                keywordList = stringToArray1(OtherStructure);
                var pattern = getRegexPattern(keywordList);
                CompleteStructure = OtherStructure.replace(pattern, '<span class="siteColor bold">$2</span>');;
            }
            else {
                var keywordList = [];
                keywordList = stringToArray1(OtherStructure);
                var pattern = getRegexPattern(keywordList);
                CompleteStructure = OtherStructure.replace(pattern, '<span class="siteColor bold">$2</span>') + ' >' + CompleteStructure;
            }
            // CompleteStructure = OtherStructure + ' >' + CompleteStructure;
        }
        return CompleteStructure;
    }
    var LIST_CONFIGURATIONS_TASKS = '[{"Title":"Gruene","listId":"2302E0CD-F41A-4855-A518-A2B1FD855E4C","siteName":"Gruene","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"https://www.gruene-washington.de","MetadataName":"SP.Data.GrueneListItem","TimesheetListName":"TaskTimeSheetListNew","TimesheetListId":"464FB776-E4B3-404C-8261-7D3C50FF343F","TimesheetListmetadata":"SP.Data.TaskTimeSheetListNewListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Foundation/logo-gruene.png"},{"Title":"DE","listId":"3204D169-62FD-4240-831F-BCDDA77F5028","siteName":"DE","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"https://www.shareweb.ch/site/Development-Effectiveness","MetadataName":"SP.Data.DEListItem","TimesheetListName":"TaskTimeSheetListNew","TimesheetListId":"464FB776-E4B3-404C-8261-7D3C50FF343F","TimesheetListmetadata":"SP.Data.TaskTimeSheetListNewListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_de.png"},{"Title":"DRR","listId":"CCBCBAFE-292E-4384-A800-7FE0AAB1F70A","siteName":"DRR","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"","MetadataName":"SP.Data.DRRListItem","TimesheetListName":"TaskTimeSheetListNew","TimesheetListId":"464FB776-E4B3-404C-8261-7D3C50FF343F","TimesheetListmetadata":"SP.Data.TaskTimeSheetListNewListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_drr.png"},{"Title":"Education","listId":"CF45B0AD-7BFF-4778-AF7A-7131DAD2FD7D","siteName":"Education","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"https://www.shareweb.ch/site/education","MetadataName":"SP.Data.EducationListItem","TimesheetListName":"TaskTimeSheetListNew","TimesheetListId":"464FB776-E4B3-404C-8261-7D3C50FF343F","TimesheetListmetadata":"SP.Data.TaskTimeSheetListNewListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_education.png"},{"Title":"EI","listId":"E0E1FC6E-0E3E-47F5-8D4B-2FBCDC3A5BB7","siteName":"EI","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"https://www.shareweb.ch/site/ei","MetadataName":"SP.Data.EIListItem","TimesheetListName":"TaskTimeSheetListNew","TimesheetListId":"464FB776-E4B3-404C-8261-7D3C50FF343F","TimesheetListmetadata":"SP.Data.TaskTimeSheetListNewListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_ei.png"},{"Title":"EPS","listId":"EC6F0AE9-4D2C-4943-9E79-067EC77AA613","siteName":"EPS","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"https://www.shareweb.ch/site/eps","MetadataName":"SP.Data.EPSListItem","TimesheetListName":"TaskTimeSheetListNew","TimesheetListId":"464FB776-E4B3-404C-8261-7D3C50FF343F","TimesheetListmetadata":"SP.Data.TaskTimeSheetListNewListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_eps.png"},{"Title":"Gender","listId":"F8FD0ADA-0F3C-40B7-9914-674F63F72ABA","siteName":"Gender","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"","MetadataName":"SP.Data.GenderListItem","TimesheetListName":"TaskTimeSheetListNew","TimesheetListId":"464FB776-E4B3-404C-8261-7D3C50FF343F","TimesheetListmetadata":"SP.Data.TaskTimeSheetListNewListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_gender.png"},{"Title":"Health","listId":"E75C6AA9-E987-43F1-84F7-D1818A862076","siteName":"Health","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"https://www.shareweb.ch/site/Health","MetadataName":"SP.Data.HealthListItem","TimesheetListName":"TaskTimeSheetListNew","TimesheetListId":"464FB776-E4B3-404C-8261-7D3C50FF343F","TimesheetListmetadata":"SP.Data.TaskTimeSheetListNewListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_health.png"},{"Title":"HHHH","listId":"091889BD-5339-4D11-960E-A8FF38DF414B","siteName":"HHHH","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"https://hhhhteams.sharepoint.com/sites/HHHH","MetadataName":"SP.Data.HHHHListItem","TimesheetListName":"TaskTimeSheetListNew","TimesheetListId":"464FB776-E4B3-404C-8261-7D3C50FF343F","TimesheetListmetadata":"SP.Data.TaskTimeSheetListNewListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Foundation/icon_hhhh.png"},{"Title":"KathaBeck","listId":"beb3d9d7-daf3-4c0f-9e6b-fd36d9290fb9","siteName":null,"siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"https://kathabeck.sharepoint.com/sites/TeamK4Bundestag","MetadataName":"SP.Data.KathaBeckListItem","TimesheetListName":"TaskTimeSheetListNew","TimesheetListId":"464FB776-E4B3-404C-8261-7D3C50FF343F","TimesheetListmetadata":"SP.Data.TaskTimeSheetListNewListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Foundation/Icon_Kathabeck.png"},{"Title":"QA","listId":"61B71DBD-7463-4B6C-AF10-6609A23AE650","siteName":"QA","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"https://www.shareweb.ch/site/qa","MetadataName":"SP.Data.QAListItem","TimesheetListName":"TaskTimeSheetListNew","TimesheetListId":"464FB776-E4B3-404C-8261-7D3C50FF343F","TimesheetListmetadata":"SP.Data.TaskTimeSheetListNewListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_qa.png"},{"Title":"ALAKDigital","listId":"d70271ae-3325-4fac-9893-147ee0ba9b4d","siteName":"ALAKDigital","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"https://www.shareweb.ch/site/ei/digitaladministration","MetadataName":"SP.Data.ALAKDigitalListItem","TimesheetListName":"TasksTimesheet2","TimesheetListId":"9ED5C649-3B4E-42DB-A186-778BA43C5C93","TimesheetListmetadata":"SP.Data.TasksTimesheet2ListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_DA.png"},{"Title":"Shareweb","listId":"B7198F49-D58B-4D0A-ADAD-11995F6FADE0","siteName":"Shareweb","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"https://www.shareweb.ch/site/joint","MetadataName":"SP.Data.SharewebListItem","TimesheetListName":"TaskTimeSheetListNew","TimesheetListId":"464FB776-E4B3-404C-8261-7D3C50FF343F","TimesheetListmetadata":"SP.Data.TaskTimeSheetListNewListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_shareweb.png"},{"Title":"Small Projects","listId":"3AFC4CEE-1AC8-4186-B139-531EBCEEA0DE","siteName":"Small Projects","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"","MetadataName":"SP.Data.Small_x0020_ProjectsListItem","TimesheetListName":"TaskTimeSheetListNew","TimesheetListId":"464FB776-E4B3-404C-8261-7D3C50FF343F","TimesheetListmetadata":"SP.Data.TaskTimeSheetListNewListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/small_project.png"},{"Title":"Offshore Tasks","listId":"BEB90492-2D17-4F0C-B332-790BA9E0D5D4","siteName":"Offshore Tasks","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"https://hhhhteams.sharepoint.com/sites/HHHH","MetadataName":"SP.Data.SharewebQAListItem","TimesheetListName":"TaskTimeSheetListNew","TimesheetListId":"464FB776-E4B3-404C-8261-7D3C50FF343F","TimesheetListmetadata":"SP.Data.TaskTimeSheetListNewListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/offshore_Tasks.png"},{"Title":"Migration","listId":"D1A5AC25-3DC2-4939-9291-1513FE5AC17E","siteName":"Migration","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"https://www.shareweb.ch/site/Migration","MetadataName":"SP.Data.MigrationListItem","TimesheetListName":"TasksTimesheet2","TimesheetListId":"9ED5C649-3B4E-42DB-A186-778BA43C5C93","TimesheetListmetadata":"SP.Data.TasksTimesheet2ListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_migration.png"},{"Title":"Master Tasks","listId":"EC34B38F-0669-480A-910C-F84E92E58ADF","siteName":"Master Tasks","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"","MetadataName":"SP.Data.Master_x0020_TasksListItem","ImageUrl":"","ImageInformation":[{"ItemType":"Component","PortfolioType":"Component","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/component_icon.png"},{"ItemType":"SubComponent","PortfolioType":"Component","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/SubComponent_icon.png"},{"ItemType":"Feature","PortfolioType":"Component","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/feature_icon.png"},{"ItemType":"Component","PortfolioType":"Service","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/component_icon.png"},{"ItemType":"SubComponent","PortfolioType":"Service","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/SubComponent_icon.png"},{"ItemType":"Feature","PortfolioType":"Service","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/feature_icon.png"},{"ItemType":"Component","PortfolioType":"Events","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Event_Icons/component_icon.png"},{"ItemType":"SubComponent","PortfolioType":"Events","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Event_Icons/SubComponent_icon.png"},{"ItemType":"Feature","PortfolioType":"Events","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Event_Icons/feature_icon.png"}]}]'
    var GetIconImageUrl = function (listName: any, listUrl: any, Item: any) {
        var IconUrl = '';
        if (listName != undefined) {
            let TaskListsConfiguration = parseJSON(LIST_CONFIGURATIONS_TASKS);
            let TaskListItem = TaskListsConfiguration.filter(function (filterItem: any) {
                let SiteRelativeUrl = filterItem.siteUrl;
                return (filterItem.Title.toLowerCase() == listName.toLowerCase() && SiteRelativeUrl.toLowerCase() == (listUrl).toLowerCase());
            });
            if (TaskListItem.length > 0) {
                if (Item == undefined) {
                    IconUrl = TaskListItem[0].ImageUrl;
                }
                else if (TaskListItem[0].ImageInformation != undefined) {
                    var IconUrlItem = (TaskListItem[0].ImageInformation.filter(function (index: any, filterItem: any) { return filterItem.ItemType == Item.Item_x0020_Type && filterItem.PortfolioType == Item.Portfolio_x0020_Type }));
                    if (IconUrlItem != undefined && IconUrlItem.length > 0) {
                        IconUrl = IconUrlItem[0].ImageUrl;
                    }
                }
            }
        }
        return IconUrl;
    }
    const getTeamLeadersName = function (Items: any, Item: any) {
        if (Items != undefined) {
            map(Items.results, (index: any, user: any) => {
                $.each(AllUsers, function (index: any, item: any) {
                    $.each(AllUsers, function (index: any, item: any) {
                        if (user.Id == item.AssingedToUserId) {
                            Item.AllTeamName = Item.AllTeamName + item.Title + ' ';
                        }
                    });
                })
            })
        }
    }
    var AllTasks: any = [];
    var CopyTaskData: any = [];
    var isItemExistsNew = function (array: any, items: any) {
        var isExists = false;
        $.each(array, function (index: any, item: any) {
            if (item.Id == items.Id && items.siteType == item.siteType) {
                isExists = true;
                return false;
            }
        });
        return isExists;
    }
    const findTaggedComponents = function (task: any) {
        task.Portfolio_x0020_Type = 'Component';
        task.isService = false;
        if (pageType == 'Service-Portfolio') {
            $.each(task['Services']['results'], function (index: any, componentItem: any) {
                for (var i = 0; i < ComponetsData['allComponets'].length; i++) {
                    let crntItem = ComponetsData['allComponets'][i];
                    if (componentItem.Id == crntItem.Id) {
                        if (crntItem.PortfolioStructureID != undefined && crntItem.PortfolioStructureID != '') {
                            task.PortfolioStructureID = crntItem.PortfolioStructureID;
                            task.ShowTooltipSharewebId = crntItem.PortfolioStructureID + '-' + task.Shareweb_x0020_ID;
                        }
                        if (crntItem.Portfolio_x0020_Type == 'Service') {
                            task.isService = true;
                            task.Portfolio_x0020_Type = 'Service';
                        }
                        if (ComponetsData['allComponets'][i]['childs'] == undefined)
                            ComponetsData['allComponets'][i]['childs'] = [];
                        if (!isItemExistsNew(ComponetsData['allComponets'][i]['childs'], task))
                            ComponetsData['allComponets'][i]['childs'].push(task);
                        break;
                    }
                }
            });
        }
    }
    var pageType = 'Service-Portfolio';
    var ComponetsData: any = {};
    ComponetsData.allUntaggedTasks = []
    const bindData = function () {
        $.each(ComponetsData['allComponets'], function (index: any, result: any) {
            result.TeamLeaderUser = []
            result.TeamLeaderUserTitle = '';
            result.DueDate = Moment(result.DueDate).format('DD/MM/YYYY')
            result.flag = true;
            if (result.DueDate == 'Invalid date' || '') {
                result.DueDate = result.DueDate.replaceAll("Invalid date", "")
            }
            result.PercentComplete = (result.PercentComplete * 100).toFixed(0);

            if (result.Short_x0020_Description_x0020_On != undefined) {
                result.Short_x0020_Description_x0020_On = result.Short_x0020_Description_x0020_On.replace(/(<([^>]+)>)/ig, '');
            }
            result['siteType'] = 'Master Tasks';
            result['SiteIcon'] = GetIconImageUrl(result.siteType, 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/', undefined);
            if (result.AssignedTo != undefined && result.AssignedTo.length > 0) {
                $.each(result.AssignedTo, function (index: any, Assig: any) {
                    if (Assig.Id != undefined) {
                        $.each(Response, function (index: any, users: any) {

                            if (Assig.Id != undefined && users.AssingedToUserId != undefined && Assig.Id == users.AssingedToUserId) {
                                users.ItemCover = users.Item_x0020_Cover;
                                result.TeamLeaderUser.push(users);
                                result.TeamLeaderUserTitle += users.Title + ';';
                            }

                        })
                    }
                })
            }
            if (result.Team_x0020_Members != undefined && result.Team_x0020_Members.results != undefined && result.Team_x0020_Members.results.length > 0) {
                $.each(result.Team_x0020_Members.results, function (index: any, Assig: any) {
                    if (Assig.Id != undefined) {
                        $.each(TaskUsers, function (index: any, users: any) {
                            if (Assig.Id != undefined && users.AssingedToUserId != undefined && Assig.Id == users.AssingedToUserId) {
                                users.ItemCover = users.Item_x0020_Cover;
                                result.TeamLeaderUser.push(users);
                                result.TeamLeaderUserTitle += users.Title + ';';
                            }

                        })
                    }
                })
            }
            if (result.PortfolioStructureID != null && result.PortfolioStructureID != undefined) {
                result['Shareweb_x0020_ID'] = result.PortfolioStructureID;
            }
            else {
                result['Shareweb_x0020_ID'] = '';
            }
            if (result.ClientCategory != undefined && result.ClientCategory.length > 0) {
                $.each(result.Team_x0020_Members, function (index: any, catego: any) {
                    result.ClientCategory.push(catego);
                })
            }
            if (result.Item_x0020_Type == 'Root Component') {
                result['childs'] = result['childs'] != undefined ? result['childs'] : [];
                RootComponentsData.push(result);
            }
            if (result.Item_x0020_Type == 'Component') {
                result['childs'] = result['childs'] != undefined ? result['childs'] : [];
                result.SiteIcon = 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/component_icon.png'
                ComponentsData.push(result);


            }

            if (result.Item_x0020_Type == 'SubComponent') {
                result.SiteIcon = 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/SubComponent_icon.png'
                result['childs'] = result['childs'] != undefined ? result['childs'] : [];
                SubComponentsData.push(result);


            }
            if (result.Item_x0020_Type == 'Feature') {
                result.SiteIcon = "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/feature_icon.png"
                result['childs'] = result['childs'] != undefined ? result['childs'] : [];
                FeatureData.push(result);
            }
            if (result.Title == 'Others') {
                //result['childs'] = result['childs'] != undefined ? result['childs'] : [];
                ComponentsData.push(result);
            }
        });

        $.each(SubComponentsData, function (index: any, subcomp: any) {
            if (subcomp.Title != undefined) {
                $.each(FeatureData, function (index: any, featurecomp: any) {
                    if (featurecomp.Parent != undefined && subcomp.Id == featurecomp.Parent.Id) {
                        subcomp['childs'].push(featurecomp);;
                    }
                })
            }
        })

        $.each(ComponentsData, function (index: any, subcomp: any) {
            if (subcomp.Title != undefined) {
                $.each(SubComponentsData, function (index: any, featurecomp: any) {
                    if (featurecomp.Parent != undefined && subcomp.Id == featurecomp.Parent.Id) {
                        subcomp['childs'].push(featurecomp);;
                    }
                })
            }
        })
        //maidataBackup.push(ComponentsData)

        setmaidataBackup(ComponentsData)
        setData(ComponentsData);
        showProgressHide();
    }

    var makeFinalgrouping = function () {
        var AllTaskData1: any = [];
        AllTaskData1 = AllTaskData1.concat(TasksItem);
        $.each(AllTaskData1, function (index: any, task: any) {
            task.Portfolio_x0020_Type = 'Component';
            if (pageType == 'Service-Portfolio') {
                if (task['Services'] != undefined && task['Services']['results'].length > 0) {
                    task.Portfolio_x0020_Type = 'Service';
                    findTaggedComponents(task);
                }
                else if (task['Component'] != undefined && task['Component']['results'].length == 0 && task['Events'] != undefined && task['Events']['results'].length == 0) {
                    if (task.SharewebTaskType != undefined && task.SharewebTaskType.Title && (task.SharewebTaskType.Title == "Activities" || task.SharewebTaskType.Title == "Workstream" || task.SharewebTaskType.Title == "Task"))
                        ComponetsData['allUntaggedTasks'].push(task);
                }

            }
        })
        var temp: any = {};
        temp.Title = 'Others';
        temp.childs = [];
        temp.flag = true;
        // ComponetsData['allComponets'][i]['childs']
        map(ComponetsData['allUntaggedTasks'], (task: any) => {
            if (task.Title != undefined)
                temp.childs.push(task);
        })
        ComponetsData['allComponets'].push(temp);
        bindData();
    }
    const filterDataBasedOnList = function () {
        //$scope.AllTaskData = angular.copy($scope.CopyTaskData);
        //$scope.AllTaskData = JSON.parse(JSON.stringify($scope.CopyTaskData));

        //$scope.AllTaskData = $scope.CopyTaskData.map(function (value) { value = Object.create(value); return value });
        //$scope.AllTaskData = angular.copy($scope.CopyTaskData);
        //$scope.AllTaskData = JSON.parse(JSON.stringify($scope.CopyTaskData));

        //$scope.AllTaskData = $scope.CopyTaskData.map(function (value) { value = Object.create(value); return value });
        var AllTaskData1: any = [];
        AllTaskData1 = AllTaskData1.concat(CopyTaskData);
        // CountOfAWTStructuredData();
        var SelectedList: any = [];
        $.each(filterItems, function (index: any, config: any) {
            if (config.Selected && config.TaxType == 'Sites') {
                SelectedList.push(config);
            }
            if (config.childs != undefined && config.childs.length > 0) {
                $.each(config.childs, function (index: any, child: any) {
                    if (child.Selected && child.TaxType == 'Sites') {
                        SelectedList.push(child);
                    }
                })
            }
        })
        var AllTaggedTask: any = [];
        $.each(SelectedList, function (index: any, item: any) {
            $.each(AllTaskData1, function (index: any, task: any) {
                if ((item.Title).toLowerCase() == (task.siteType).toLowerCase()) {
                    AllTaggedTask.push(task);
                }
            })
        })
        if (AllTaggedTask != undefined) {
            //$scope.AllTaskData = $scope.AllTaggedTask.map(function (value) { value = Object.create(value); return value });
            AllTaskData1 = AllTaggedTask;
        }
        makeFinalgrouping();
        //  makeGroupingBasedOnLevel();
    }
    var TasksItem: any = [];

    function Buttonclick(e: any) {
        e.preventDefault();
        this.setState({ callchildcomponent: true });

    }
    const setModalIsOpenToFalse = () => {
        setModalIsOpen(false)
    }

    const closeModal = () => {
        setAddModalOpen(false)
    }


    const Prints = () => {
        window.print();
    }
    // ---------------------Export to Excel-------------------------------------------------------------------------------------

    const getCsvData = () => {
        const csvData = [['Title']];
        let i;
        for (i = 0; i < data.length; i += 1) {
            csvData.push([`${data[i].Title}`]);
        }
        return csvData;
    };
    const clearSearch = () => {
        setSearch('')

    }



    //------------------Edit Data----------------------------------------------------------------------------------------------------------------------------


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
    var TaskTimeSheetCategoriesGrouping: any = [];
    var TaskTimeSheetCategories: any = [];
    var AllTimeSpentDetails: any = [];
    const isItemExists = function (arr: any, Id: any) {
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

    const EditData = (e: any, item: any) => {
        setIsTimeEntry(true);
        setSharewebTimeComponent(item);
    }

    const handleTitle = (e: any) => {
        setTitle(e.target.value)

    };
    const Call = React.useCallback((item1) => {
        setIsComponent(false);
        setIsTask(false);
    }, []);

    const TimeEntryCallBack = React.useCallback((item1) => {
        setIsTimeEntry(false);
    }, []);
    const EditComponentPopup = (item: any) => {
        // <ComponentPortPolioPopup ></ComponentPortPolioPopup>
        setIsComponent(true);
        setSharewebComponent(item);
        // <ComponentPortPolioPopup props={item}></ComponentPortPolioPopup>
    }
    const EditItemTaskPopup = (item: any) => {
        // <ComponentPortPolioPopup ></ComponentPortPolioPopup>
        setIsTask(true);
        setSharewebTask(item);
        // <ComponentPortPolioPopup props={item}></ComponentPortPolioPopup>
    }
    function AddItem() {
    }
    return (
        <div className="app component taskprofilepagegreen">

            {/* ---------------------------------------Editpopup------------------------------------------------------------------------------------------------------- */}
            {/* <Modal
                isOpen={modalIsOpen}
                onDismiss={setModalIsOpenToFalse}
                isBlocking={false} >
                <div className='modal-dialog modal-lg'>
                    <form>
                        <div className='modal-content'>
                            <div className='modal-header'>
                                <h5 className='modal-title'><span>Add Item</span></h5>
                                <button type="button" className='btn btn-danger pull-right' onClick={setModalIsOpenToFalse}>Cancel</button>
                            </div>
                            <div className='modal-body clearfix bg-f5f5'>
                                <div className="col-sm-12 tab-content">
                                    <div className="col-md-5">
                                        <div className="row">
                                            <div className="col-sm-4 mb-10 pad0" title="Task Name">
                                                <label>Title</label>
                                                <input type="text" className="form-control" placeholder="Task Name"
                                                    value={Title} onChange={handleTitle} />
                                            </div>
                                            <div className="col-sm-4 mb-10 Doc-align padR0">
                                                <label className="full_width">ItemRank
                                                </label>
                                                <select className="form-control" value="2">
                                                    <option value="">Select Item Rank</option>
                                                    <option value="1">1</option>
                                                    <option value="2">2</option>
                                                    <option value="3">3</option>
                                                </select>


                                            </div>
                                            <div className="col-4 mb-10">
                                                <label>Item Type</label>
                                                <select value={itemType} onChange={(e: any) => setitemType(e.target.value)}>
                                                    <option>Component</option>
                                                    <option>Feature</option>
                                                    <option>SubComponent</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="row">

                                            <div className="col-sm-6 pad0">
                                                <div ng-show="Item.Portfolio_x0020_Type=='Service'"
                                                    className="col-sm-12 mb-10 Doc-align padL-0">
                                                    <div className="col-sm-11 PadR0 Doc-align">
                                                        <label>
                                                            Service Portfolio
                                                            <span data-toggle="popover" data-placement="right"
                                                                data-trigger="hover"
                                                                data-content="Click to activate auto suggest for components/services"
                                                                data-original-title="Click to activate auto suggest for components/services"
                                                                title="Click to activate auto suggest for components/services">

                                                            </span>

                                                        </label>
                                                        <input type="text" className="form-control ui-autocomplete-input"
                                                            id="txtSharewebComponent" ng-model="SearchComponent"
                                                        /><span role="status" aria-live="polite"
                                                            className="ui-helper-hidden-accessible"></span>
                                                    </div>
                                                    <div className="col-sm-1 no-padding">
                                                        <label className="full_width">&nbsp;</label>
                                                        <img ng-src="{{baseUrl}}/SiteCollectionImages/ICONS/32/edititem.gif"
                                                            ng-click="EditComponent('Components',item)" />
                                                    </div>

                                                </div>
                                                <div ng-show="Item.Portfolio_x0020_Type=='Component'"
                                                    className="col-sm-12 padL-0">
                                                    <div className="col-sm-11 pad0 Doc-align">

                                                        <label>
                                                            Service Portfolio
                                                            <span data-toggle="popover" data-placement="right"
                                                                data-trigger="hover"
                                                                data-content="Click to activate auto suggest for components/services"
                                                                data-original-title="Click to activate auto suggest for components/services"
                                                                title="Click to activate auto suggest for components/services">

                                                            </span>

                                                        </label>
                                                        <input type="text" className="form-control ui-autocomplete-input"
                                                            id="txtServiceSharewebComponent" ng-model="SearchService"
                                                        /><span role="status" aria-live="polite"
                                                            className="ui-helper-hidden-accessible"></span>
                                                    </div>
                                                    <div className="col-sm-1 no-padding">
                                                        <label className="full_width">&nbsp;</label>

                                                    </div>

                                                </div>

                                            </div>
                                            <div className="col-sm-6 padR0">
                                                <label>Deliverable-Synonyms </label>
                                                <input type="text" className="form-control ui-autocomplete-input"
                                                    id="txtDeliverable_x002d_Synonyms"
                                                    ng-model="Item.Deliverable_x002d_Synonyms" /><span
                                                        role="status" aria-live="polite"
                                                        className="ui-helper-hidden-accessible"></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div className='modal-footer mt-3'>
                    <button type="button" className="btn btn-primary m-2" onClick={AddItem}>Save</button>
                    <button type="button" className="btn btn-danger" onClick={setModalIsOpenToFalse}>Cancel</button>
                </div>
            </Modal> */}
            {/* ------------------------Add Popup------------------------------------------------------------------------------------------------------------------------------ */}

            {/* <Modal
                isOpen={addModalOpen}
                onDismiss={closeModal}
                isBlocking={false}>
                <div className='modal-dialog modal-lg'>
                    <div className='modal-header'>
                        <h5 className='modal-title'><span>Add Component</span></h5>
                        <button type="button" className='btn btn-danger pull-right' onClick={closeModal}>Cancel</button>
                    </div>
                    <div className="row">
                        <div className="col-sm-6 mb-10" title="Task Name">
                            <label>Title</label>
                            <input type="text" className="form-control" placeholder="Task Name"
                                ng-required="true" />
                        </div>
                    </div>
                </div>
                <div className='modal-footer mt-3'>
                    <button type="button" className="btn btn-primary m-2" disabled={true}> Create & Open Popup</button>
                    <button type="button" className="btn btn-primary" disabled={true} onClick={closeModal}>Create</button>
                </div>
            </Modal> */}
            {/* -----------------------------------------end-------------------------------------------------------------------------------------------------------------------------------------- */}
            <div className="col-sm-12 padL-0 PadR0">
                <h2 className="alignmentitle ng-binding">
                    Service Portfolio
                    <span className="icontype display_hide padLR">
                    </span>

                </h2>
            </div>
            <div className="col-sm-12 padL-0 PadR0">
                <section className="ContentSection">
                    <div className="bg-f5f5 bdrbox pad10 clearfix">
                        <div className="togglebox">
                            <label className="toggler full_width mb-10">
                                <span className=" siteColor">
                                    <img className="hreflink wid22"
                                        src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Filter-12-WF.png" />
                                    SmartSearch – Filters
                                </span>
                                <span className="ml-20 siteColor">
                                    {ShowSelectdSmartfilter != undefined && ShowSelectdSmartfilter.length > 0 &&

                                        <>
                                            {ShowSelectdSmartfilter.map(function (obj, index) {
                                                return (
                                                    <>
                                                        {obj.Title}
                                                        <span className="font-normal">{obj.selectTitle}</span>
                                                        {index != ShowSelectdSmartfilter.length - 1 && <span> | </span>}
                                                    </>
                                                )
                                            })
                                            }
                                        </>
                                    }

                                </span>
                                <span className="pull-right siteColor">
                                    <img className="icon-sites-img  wid22 ml5" ng-show="pagesType=='componentportfolio'"
                                        title="Share SmartFilters selection" ng-click="GenerateUrl()"
                                        src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Icon_Share_Green.png" />
                                </span>
                                <span className="pull-right siteColor">
                                    <span className="hreflink" ng-if="!smartfilter2.expanded">
                                        <img ng-show="pagesType=='componentportfolio'" className="hreflink wid22"
                                            ng-src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Add-New.png" />
                                    </span>
                                </span>
                            </label>
                            <div className="togglecontent">
                                <div className="col-sm-12 pad0">
                                    <table width="100%" className="indicator_search">
                                        <tr>
                                            {filterGroups.map(function (item) {
                                                return (
                                                    <>

                                                        <td valign="top">
                                                            <fieldset>
                                                                <legend>{item != 'teamSites' && <span>{item}</span>}</legend>
                                                                <legend>{item == 'teamSites' && <span>Sites</span>}</legend>
                                                            </fieldset>
                                                            {filterItems.map(function (ItemType, index) {
                                                                return (

                                                                    <>
                                                                        {ItemType.Group == item &&
                                                                            <div style={{ display: "block" }}>
                                                                                <>
                                                                                    <span className="plus-icon hreflink" onClick={() => handleOpen2(ItemType)}>
                                                                                        {ItemType.childs.length > 0 &&
                                                                                            <a className='hreflink'
                                                                                                title="Tap to expand the childs">
                                                                                                {ItemType.showItem ? <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png" />
                                                                                                    : <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png" />}

                                                                                            </a>}
                                                                                    </span>
                                                                                    {ItemType.TaxType != 'Status' &&
                                                                                        <span className="ml-1">


                                                                                            <input type="checkbox" checked={ItemType.Selected == true} className="mr0 icon-input" value={ItemType.Title} onChange={(e) => SingleLookDatatest(e, ItemType, index)} />

                                                                                            <span className="ml-2">
                                                                                                {ItemType.Title}

                                                                                            </span>

                                                                                        </span>
                                                                                    }
                                                                                    {ItemType.TaxType == 'Status' &&
                                                                                        <span className="ml-2">


                                                                                            <input type="checkbox" checked={ItemType.Selected == true} className="mr0 icon-input" value={ItemType.Title} onChange={(e) => SingleLookDatatest(e, ItemType, index)} />
                                                                                            <span className="ml-2">
                                                                                                {ItemType.Title}

                                                                                            </span>

                                                                                        </span>
                                                                                    }
                                                                                    <ul id="id_{ItemType.Id}"
                                                                                        className="subfilter width-85">
                                                                                        <span>
                                                                                            {ItemType.show && (
                                                                                                <>
                                                                                                    {ItemType.childs.map(function (child1: any, index: any) {
                                                                                                        return (
                                                                                                            <>
                                                                                                                <div style={{ display: "block" }}>
                                                                                                                    {child1.childs.length > 0 && !child1.expanded &&
                                                                                                                        <span className="plus-icon hreflink"
                                                                                                                            ng-click="loadMoreFilters(child1);">
                                                                                                                            <img
                                                                                                                                src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png" />
                                                                                                                        </span>
                                                                                                                    }
                                                                                                                    {child1.childs.length > 0 && child1.expanded &&
                                                                                                                        <span className="plus-icon hreflink"
                                                                                                                            ng-click="loadMoreFilters(child1);">
                                                                                                                            <img
                                                                                                                                src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png" />
                                                                                                                        </span>
                                                                                                                    }
                                                                                                                    <input type="checkbox" checked={child1.Selected == true} className="icon-input mr0" ng-model="child1.Selected"
                                                                                                                        onChange={(e) => SingleLookDatatest(e, child1, index)} /> {child1.Title}

                                                                                                                    <ul id="id_{{child1.Id}}" style={{ display: "none" }} className="subfilter"
                                                                                                                    >
                                                                                                                        {child1.childs.map(function (child2: any) {
                                                                                                                            <li>
                                                                                                                                <input type="checkbox" checked={child1.Selected == true}

                                                                                                                                    ng-model="child2.Selected"
                                                                                                                                    onChange={(e) => SingleLookDatatest(e, child1, index)} /> {child2.Title}
                                                                                                                            </li>
                                                                                                                        })}
                                                                                                                    </ul>
                                                                                                                </div>
                                                                                                            </>
                                                                                                        )

                                                                                                    })}
                                                                                                </>
                                                                                            )}
                                                                                        </span>
                                                                                    </ul>

                                                                                </>


                                                                            </div>
                                                                        }
                                                                    </>

                                                                )
                                                            })}

                                                        </td>

                                                    </>
                                                )
                                            })}
                                            {/* {filterItems.length >0 && <CheckboxTree
                                                nodes={filterItems}
                                                checked={checked}
                                                // expanded={expanded}
                                                // onCheck={checked => setchecked({ checked })}
                                                // onExpand={expanded => this.setState({ expanded })}
                                                nativeCheckboxes={true}
                                                showNodeIcon={false}

                                            />
                                           } */}

                                        </tr>
                                    </table>
                                </div>
                                <div className="pull-right">

                                    <button type="button" className="btn btn-primary"
                                        title="Smart Filter" onClick={() => Updateitem()}>
                                        Update
                                    </button>
                                    <button type="button" className="btn btn-grey ml5" title="Clear All"
                                        onClick={() => Clearitem()} >
                                        Clear All
                                    </button>
                                </div>

                            </div>

                        </div>
                    </div>
                </section>
            </div >

            <section className="TableContentSection taskprofilepagegreen">
                <div className="container-fluid">
                    <section className="TableSection">
                        <div className="container pad0">
                            <div className="Alltable mt-10">
                                <div className="tbl-headings">
                                    <span className="leftsec w65">
                                        <label>
                                            Showing {ComponentsData.length} of {ComponentsData.length} Components
                                        </label>
                                        <label> | </label>
                                        <label>
                                            {SubComponentsData.length} of {SubComponentsData.length} SubComponents
                                        </label>
                                        <label> | </label>
                                        <label>
                                            {FeatureData.length} of {FeatureData.length} Features
                                        </label>
                                        <span className="g-search">
                                            <input type="text" className="searchbox_height full_width" id="globalSearch" placeholder="search all" />
                                            <span className="gsearch-btn" ><i><FaSearch /></i></span>
                                        </span>
                                        <span>
                                            <select className="ml2 searchbox_height">
                                                <option value="All Words">All Words</option>
                                                <option value="Any Words">Any Words</option>
                                                <option value="Exact Phrase">Exact Phrase</option>

                                            </select>
                                        </span>
                                    </span>
                                    <span className="toolbox mx-auto">
                                        <button type="button" className="btn btn-primary"
                                            ng-disabled="(isOwner!=true) || ( SelectedTasks.length > 0 || compareComponents[0].Item_x0020_Type =='Feature') "
                                            onClick={addModal} title=" Add Structure">
                                            Add Structure
                                        </button>

                                        <button type="button"
                                            className="btn {{(compareComponents.length==0 && SelectedTasks.length==0)?'btn-grey':'btn-primary'}}"
                                            ng-click="openActivity()"
                                            disabled={true}>

                                            <MdAdd />
                                            Add Activity-Task
                                        </button>


                                        <button type="button"
                                            className="btn {{(compareComponents.length==0 && SelectedTasks.length==0)?'btn-grey':'btn-primary'}}"
                                            ng-click="openRestructure()"
                                            disabled={true}>
                                            Restructure
                                        </button>
                                        <a onClick={Prints}>
                                            <i className="print"><FaPrint /></i>
                                        </a>
                                        <a>
                                            <CSVLink data={getCsvData()} >
                                                <i className="excal"><FaFileExcel /></i>
                                            </CSVLink>
                                        </a>
                                        <a onClick={clearSearch}>
                                            <i className="brush"><FaPaintBrush /></i>
                                        </a>
                                        {/* <span>
                                        <ExpandTable/>
                                        </span> */}
                                    </span>
                                </div>
                                <div className="col-sm-12 pad0 smart">
                                    <div className="section-event">
                                        <div className="wrapper">
                                            <table className="table table-hover" id="EmpTable" style={{ width: "100%" }}>
                                                <thead>
                                                    <tr>
                                                        <th style={{ width: "2%" }}>
                                                            <div></div>
                                                        </th>
                                                        <th style={{ width: "7%" }}>
                                                            <div style={{ width: "7%" }} className="smart-relative">
                                                                <input type="search" placeholder="ID" className="full_width searchbox_height" onChange={event => handleChange1(event, 'Shareweb_x0020_ID')} />

                                                                <span className="sorticon">
                                                                    <span className="up" onClick={sortBy}>< FaAngleUp /></span>
                                                                    <span className="down" onClick={sortByDng}>< FaAngleDown /></span>
                                                                </span>


                                                            </div>
                                                        </th>
                                                        <th style={{ width: "20%" }}>
                                                            <div style={{ width: "19%" }} className="smart-relative">
                                                                <input type="search" placeholder="Title" className="full_width searchbox_height" onChange={event => handleChange1(event, 'Title')} />

                                                                <span className="sorticon">
                                                                    <span className="up" onClick={sortBy}>< FaAngleUp /></span>
                                                                    <span className="down" onClick={sortByDng}>< FaAngleDown /></span>
                                                                </span>


                                                            </div>
                                                        </th>
                                                        <th style={{ width: "18%" }}>
                                                            <div style={{ width: "17%" }} className="smart-relative">
                                                                <input id="searchClientCategory" type="search" placeholder="Client Category"
                                                                    title="Client Category" className="full_width searchbox_height"
                                                                // onChange={event => handleChange(event, 'Client Category')} 
                                                                />
                                                                <span className="sorticon">
                                                                    <span className="up" onClick={sortBy}>< FaAngleUp /></span>
                                                                    <span className="down" onClick={sortByDng}>< FaAngleDown /></span>
                                                                </span>
                                                            </div>
                                                        </th>
                                                        <th style={{ width: "20%" }}>
                                                            <div style={{ width: "19%" }} className="smart-relative">
                                                                <input id="searchClientCategory" type="search" placeholder="Team"
                                                                    title="Client Category" className="full_width searchbox_height"
                                                                // onChange={event => handleChange(event, 'Team')} 
                                                                />
                                                                <span className="sorticon">
                                                                    <span className="up" onClick={sortBy}>< FaAngleUp /></span>
                                                                    <span className="down" onClick={sortByDng}>< FaAngleDown /></span>
                                                                </span>

                                                            </div>
                                                        </th>
                                                        <th style={{ width: "10%" }}>
                                                            <div style={{ width: "9%" }} className="smart-relative">
                                                                <input id="searchClientCategory" type="search" placeholder="Status"
                                                                    title="Client Category" className="full_width searchbox_height"
                                                                    onChange={event => handleChange1(event, 'PercentComplete')} />
                                                                <span className="sorticon">
                                                                    <span className="up" onClick={sortBy}>< FaAngleUp /></span>
                                                                    <span className="down" onClick={sortByDng}>< FaAngleDown /></span>
                                                                </span>

                                                            </div>
                                                        </th>
                                                        <th style={{ width: "10%" }}>
                                                            <div style={{ width: "9%" }} className="smart-relative">
                                                                <input id="searchClientCategory" type="search" placeholder="Item Rank"
                                                                    title="Item Rank" className="full_width searchbox_height"
                                                                    onChange={event => handleChange1(event, 'ItemRank')} />
                                                                <span className="sorticon">
                                                                    <span className="up" onClick={sortBy}>< FaAngleUp /></span>
                                                                    <span className="down" onClick={sortByDng}>< FaAngleDown /></span>
                                                                </span>
                                                            </div>
                                                        </th>
                                                        <th style={{ width: "10%" }}>
                                                            <div style={{ width: "9%" }} className="smart-relative">
                                                                <input id="searchClientCategory" type="search" placeholder="Due"
                                                                    title="Due Date" className="full_width searchbox_height"
                                                                    onChange={event => handleChange1(event, 'DueDate')} />
                                                                <span className="sorticon">
                                                                    <span className="up" onClick={sortBy}>< FaAngleUp /></span>
                                                                    <span className="down" onClick={sortByDng}>< FaAngleDown /></span>
                                                                </span>

                                                            </div>
                                                        </th>
                                                        <th style={{ width: "3%" }}></th>
                                                        <th style={{ width: "3%" }}></th>
                                                    </tr>
                                                </thead>
                                                <tbody>

                                                    <div id="SpfxProgressbar" style={{ display: "none" }}>

                                                        <img id="sharewebprogressbar-image" src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/loading_apple.gif" alt="Loading..." />

                                                    </div>
                                                    {data.length > 0 && data && data.map(function (item, index) {
                                                        if (item.flag == true) {
                                                            return (
                                                                <>
                                                                    <tr >
                                                                        <td className="pad0" colSpan={9}>
                                                                            <table className="table" style={{ width: "100%" }}>
                                                                                <tr className="bold for-c0l">

                                                                                    <td style={{ width: "2%" }}>
                                                                                        <div className="accordian-header" >
                                                                                            {item.childs != undefined &&
                                                                                                <a className='hreflink'
                                                                                                    title="Tap to expand the childs">
                                                                                                    <div onClick={() => handleOpen(item)} className="sign">{item.childs.length > 0 && item.show ? <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png" />
                                                                                                        : <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png" />}
                                                                                                    </div>
                                                                                                </a>
                                                                                            }
                                                                                        </div>

                                                                                    </td>

                                                                                    <td style={{ width: "7%" }}>
                                                                                        <div className="">
                                                                                            <span>
                                                                                                {item.SiteIcon != undefined && <a className="hreflink" title="Show All Child" data-toggle="modal">
                                                                                                    <img className="icon-sites-img ml20" src={item.SiteIcon}></img>
                                                                                                    {/* <img className="icon-sites-img"
                                                                                                        src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/component_icon.png" /> */}
                                                                                                </a>
                                                                                                }
                                                                                            </span>
                                                                                            <span className="ml-2">{item.Shareweb_x0020_ID}</span>
                                                                                        </div>
                                                                                    </td>
                                                                                    {/* <td style={{ width: "6%" }}></td> */}
                                                                                    <td style={{ width: "20%" }}>
                                                                                        {item.siteType == "Master Tasks" && <a target="_blank" className="hreflink serviceColor_Active"
                                                                                            href={"https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile-SPFx.aspx?taskId=" + item.Id}
                                                                                        ><span>{item.Title}</span>
                                                                                        </a>}
                                                                                        {item.siteType != "Master Tasks" && <a target="_blank" className="hreflink serviceColor_Active"
                                                                                            href={"https://hhhhteams.sharepoint.com/sites/HHHH/{item.siteType}/SP/SitePages/Task-Profile-SPFx.aspx?taskId=" + item.Id + '&Site=' + item.siteType}
                                                                                        ><span>{item.Title}</span>
                                                                                        </a>}
                                                                                        {item.childs != undefined &&
                                                                                            <span>({item.childs.length})</span>
                                                                                        }

                                                                                        {item.Short_x0020_Description_x0020_On != null &&
                                                                                            <span className="project-tool"><img
                                                                                                src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/infoIcon.png" /><span className="tooltipte">
                                                                                                    <span className="tooltiptext">
                                                                                                        <div className="tooltip_Desc">
                                                                                                            <span>{item.Short_x0020_Description_x0020_On}</span>
                                                                                                        </div>
                                                                                                    </span>
                                                                                                </span>
                                                                                            </span>
                                                                                        }
                                                                                    </td>
                                                                                    <td style={{ width: "18%" }}>
                                                                                        <div>
                                                                                            {item.ClientCategory != undefined && item.ClientCategory.length > 0 && item.ClientCategory.map(function (client: { Title: string; }) {
                                                                                                return (
                                                                                                    <span className="ClientCategory-Usericon"
                                                                                                        title={client.Title}>
                                                                                                        <a>{client.Title.slice(0, 2).toUpperCase()}</a>
                                                                                                    </span>
                                                                                                )
                                                                                            })}</div>
                                                                                    </td>
                                                                                    <td style={{ width: "20%" }}>
                                                                                        <div>{item.TeamLeaderUser != undefined && item.TeamLeaderUser.length > 0 && item.TeamLeaderUser.map(function (client1: { Title: string; }) {
                                                                                            return (
                                                                                                <span className="ClientCategory-Usericon"
                                                                                                    title={client1.Title}>

                                                                                                    <a>{client1.Title.slice(0, 2).toUpperCase()}</a>

                                                                                                </span>
                                                                                            )
                                                                                        })}</div></td>
                                                                                    <td style={{ width: "10%" }}>{item.PercentComplete}</td>
                                                                                    <td style={{ width: "10%" }}>{item.ItemRank}</td>
                                                                                    <td style={{ width: "10%" }}>{item.DueDate}</td>
                                                                                    {/* <td style={{ width: "3%" }}></td> */}
                                                                                    <td style={{ width: "3%" }}></td>
                                                                                    <td style={{ width: "3%" }}>{item.siteType == "Master Tasks" && <a><img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif" onClick={(e) => EditComponentPopup(item)} /></a>}
                                                                                        {item.siteType != "Master Tasks" && <a><img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif" onClick={(e) => EditComponentPopup(item)} /></a>}</td>
                                                                                    {/* <a onClick={(e) => editProfile(item)}> */}
                                                                                </tr>
                                                                            </table>
                                                                        </td>


                                                                    </tr>
                                                                    {item.show && item.childs.length > 0 && (
                                                                        <>
                                                                            {item.childs.map(function (childitem: any) {
                                                                                if (childitem.flag == true) {
                                                                                    return (

                                                                                        <>
                                                                                            <tr >
                                                                                                <td className="pad0" colSpan={9}>
                                                                                                    <table className="table" style={{ width: "100%" }}>
                                                                                                        <tr className="for-c02">
                                                                                                            <td style={{ width: "2%" }}>
                                                                                                                <div className="accordian-header" onClick={() => handleOpen(childitem)}>
                                                                                                                    {childitem.childs.length > 0 &&
                                                                                                                        <a className='hreflink'
                                                                                                                            title="Tap to expand the childs">
                                                                                                                            <div className="sign">{childitem.childs.length > 0 && childitem.show ? <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png" />
                                                                                                                                : <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png" />}
                                                                                                                            </div>
                                                                                                                        </a>
                                                                                                                    }

                                                                                                                </div>
                                                                                                            </td>
                                                                                                            {/* <td style={{ width: "2%" }}></td> */}
                                                                                                            <td style={{ width: "7%" }}>  <div className="d-flex">
                                                                                                                <span>

                                                                                                                    <a className="hreflink" title="Show All Child" data-toggle="modal">
                                                                                                                        <img className="icon-sites-img ml20" src={childitem.SiteIcon}></img>
                                                                                                                        {/* <img className="icon-sites-img"
                                                                                                                        src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/SubComponent_icon.png" /> */}
                                                                                                                    </a>

                                                                                                                </span>
                                                                                                                <span className="ml-2">{childitem.Shareweb_x0020_ID}</span>
                                                                                                            </div>
                                                                                                            </td>

                                                                                                            <td style={{ width: "20%" }}>
                                                                                                                {childitem.siteType == "Master Tasks" && <a target="_blank" className="hreflink serviceColor_Active"
                                                                                                                    href={"https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile-SPFx.aspx?taskId=" + childitem.Id}
                                                                                                                >{childitem.Title}
                                                                                                                </a>}
                                                                                                                {childitem.siteType != "Master Tasks" && <a target="_blank" className="hreflink serviceColor_Active"
                                                                                                                    href={"https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Task-Profile-SPFx.aspx?taskId=" + childitem.Id + '&Site=' + childitem.siteType}
                                                                                                                >{childitem.Title}
                                                                                                                </a>}
                                                                                                                {childitem.childs.length > 0 &&
                                                                                                                    <span>({childitem.childs.length})</span>
                                                                                                                }

                                                                                                                {childitem.Short_x0020_Description_x0020_On != null &&
                                                                                                                    <span className="project-tool"><img
                                                                                                                        src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/infoIcon.png" /><span className="tooltipte">
                                                                                                                            <span className="tooltiptext">
                                                                                                                                <div className="tooltip_Desc">
                                                                                                                                    <span>{childitem.Short_x0020_Description_x0020_On}</span>
                                                                                                                                </div>
                                                                                                                            </span>
                                                                                                                        </span>
                                                                                                                    </span>
                                                                                                                }
                                                                                                            </td>
                                                                                                            <td style={{ width: "18%" }}>
                                                                                                                <div>
                                                                                                                    {childitem.ClientCategory != undefined && childitem.ClientCategory.length > 0 && childitem.ClientCategory.map(function (client: { Title: string; }) {
                                                                                                                        return (
                                                                                                                            <span className="ClientCategory-Usericon"
                                                                                                                                title={client.Title}>
                                                                                                                                <a>{client.Title.slice(0, 2).toUpperCase()}</a>
                                                                                                                            </span>
                                                                                                                        )
                                                                                                                    })}</div>
                                                                                                            </td>
                                                                                                            <td style={{ width: "20%" }}>
                                                                                                                <div>{childitem.TeamLeaderUser != undefined && childitem.TeamLeaderUser.length > 0 && childitem.TeamLeaderUser.map(function (client1: { Title: string; }) {
                                                                                                                    return (
                                                                                                                        <div className="ClientCategory-Usericon"
                                                                                                                            title={client1.Title}>

                                                                                                                            <a>{client1.Title.slice(0, 2).toUpperCase()}</a>

                                                                                                                        </div>
                                                                                                                    )
                                                                                                                })}</div></td>
                                                                                                            <td style={{ width: "10%" }}>{childitem.PercentComplete}</td>
                                                                                                            <td style={{ width: "10%" }}>{childitem.ItemRank}</td>
                                                                                                            <td style={{ width: "10%" }}>{childitem.DueDate}</td>
                                                                                                            <td style={{ width: "3%" }}>{childitem.siteType != "Master Tasks" && <a onClick={(e) => EditData(e, childitem)}><img style={{ width: "22px" }} src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/clock-gray.png"></img></a>}</td>
                                                                                                            <td style={{ width: "3%" }}><a>{childitem.siteType == "Master Tasks" && <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif" onClick={(e) => EditComponentPopup(childitem)} />}
                                                                                                                {childitem.siteType != "Master Tasks" && <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif" onClick={(e) => EditItemTaskPopup(childitem)} />}</a></td>
                                                                                                        </tr>
                                                                                                    </table>
                                                                                                </td>
                                                                                            </tr>

                                                                                            {childitem.show && childitem.childs.length > 0 && (
                                                                                                <>
                                                                                                    {childitem.childs.map(function (childinew: any) {
                                                                                                        if (childinew.flag == true) {
                                                                                                            return (
                                                                                                                <>
                                                                                                                    <tr >
                                                                                                                        <td className="pad0" colSpan={10}>
                                                                                                                            <table className="table" style={{ width: "100%" }}>
                                                                                                                                <tr className="tdrow">
                                                                                                                                    <td style={{ width: "2%" }}>
                                                                                                                                        {childinew.childs.length > 0 &&
                                                                                                                                            <div className="accordian-header" onClick={() => handleOpen(childinew)}>
                                                                                                                                                <a className='hreflink' onClick={(e) => this.EditData(e, item)}
                                                                                                                                                    title="Tap to expand the childs">
                                                                                                                                                    <div className="sign">{childinew.childs.length > 0 && childinew.show ? <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png" />
                                                                                                                                                        : <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png" />}
                                                                                                                                                    </div>
                                                                                                                                                </a>

                                                                                                                                            </div>
                                                                                                                                        }
                                                                                                                                    </td>


                                                                                                                                    <td style={{ width: "7%" }}> <div className="d-flex">
                                                                                                                                        <span>

                                                                                                                                            <a className="hreflink" title="Show All Child" data-toggle="modal">
                                                                                                                                                <img className="icon-sites-img ml20" src={childinew.SiteIcon}></img>
                                                                                                                                                {/* <img  className="icon-sites-img" 
                                                                                                                                        src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/feature_icon.png" /> */}
                                                                                                                                            </a>

                                                                                                                                        </span>
                                                                                                                                        <span className="ml-2">{childinew.Shareweb_x0020_ID}</span>
                                                                                                                                    </div>
                                                                                                                                    </td>

                                                                                                                                    <td style={{ width: "20%" }}>

                                                                                                                                        {childinew.siteType == "Master Tasks" && <a target="_blank" className="hreflink serviceColor_Active"

                                                                                                                                            href={"https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile-SPFx.aspx?taskId=" + childinew.Id}
                                                                                                                                        >{childinew.Title}
                                                                                                                                        </a>}
                                                                                                                                        {childinew.siteType != "Master Tasks" && <a target="_blank" className="hreflink serviceColor_Active"
                                                                                                                                            href={"https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Task-Profile-SPFx.aspx?taskId=" + childinew.Id + '&Site=' + childinew.siteType}
                                                                                                                                        >{childinew.Title}
                                                                                                                                        </a>}
                                                                                                                                        {childinew.childs.length > 0 &&
                                                                                                                                            <span>({childinew.childs.length})</span>
                                                                                                                                        }

                                                                                                                                        {childinew.Short_x0020_Description_x0020_On != null &&
                                                                                                                                            <span className="project-tool"><img
                                                                                                                                                src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/infoIcon.png" /><span className="tooltipte">
                                                                                                                                                    <span className="tooltiptext">
                                                                                                                                                        <div className="tooltip_Desc">
                                                                                                                                                            <span>{childinew.Short_x0020_Description_x0020_On}</span>
                                                                                                                                                        </div>
                                                                                                                                                    </span>
                                                                                                                                                </span>
                                                                                                                                            </span>
                                                                                                                                        }
                                                                                                                                    </td>
                                                                                                                                    <td style={{ width: "18%" }}>
                                                                                                                                        <div>
                                                                                                                                            {childinew.ClientCategory != undefined && childinew.ClientCategory.length > 0 && childinew.ClientCategory.map(function (client: { Title: string; }) {
                                                                                                                                                return (
                                                                                                                                                    <span className="ClientCategory-Usericon"
                                                                                                                                                        title={client.Title}>
                                                                                                                                                        <a>{client.Title.slice(0, 2).toUpperCase()}</a>
                                                                                                                                                    </span>
                                                                                                                                                )
                                                                                                                                            })}</div>
                                                                                                                                    </td>
                                                                                                                                    <td style={{ width: "20%" }}>
                                                                                                                                        <div>{childinew.TeamLeaderUser != undefined && childinew.TeamLeaderUser.length > 0 && childinew.TeamLeaderUser.map(function (client1: { Title: string; }) {
                                                                                                                                            return (
                                                                                                                                                <span className="ClientCategory-Usericon"
                                                                                                                                                    title={client1.Title}>

                                                                                                                                                    <a>{client1.Title.slice(0, 2).toUpperCase()}</a>

                                                                                                                                                </span>
                                                                                                                                            )
                                                                                                                                        })}</div></td>
                                                                                                                                    <td style={{ width: "10%" }}>{childinew.PercentComplete}</td>
                                                                                                                                    <td style={{ width: "10%" }}>{childinew.ItemRank}</td>
                                                                                                                                    <td style={{ width: "10%" }}>{childinew.DueDate}</td>
                                                                                                                                    <td style={{ width: "3%" }}>{childinew.siteType != "Master Tasks" && <a onClick={(e) => EditData(e, childinew)}><img style={{ width: "22px" }} src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/clock-gray.png"></img></a>}</td>
                                                                                                                                    <td style={{ width: "3%" }}>{childinew.siteType == "Master Tasks" && <a>   <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif" onClick={(e) => EditComponentPopup(childinew)} /></a>}</td>
                                                                                                                                </tr>
                                                                                                                            </table>
                                                                                                                        </td>
                                                                                                                    </tr>
                                                                                                                    {childinew.show && childinew.childs.length > 0 && (
                                                                                                                        <>
                                                                                                                            {childinew.childs.map(function (subchilditem: any) {

                                                                                                                                return (

                                                                                                                                    <>
                                                                                                                                        <tr >
                                                                                                                                            <td className="pad0" colSpan={9}>
                                                                                                                                                <table className="table" style={{ width: "100%" }}>
                                                                                                                                                    <tr className="for-c02">
                                                                                                                                                        <td style={{ width: "2%" }}>
                                                                                                                                                            <div className="accordian-header" onClick={() => handleOpen(subchilditem)}>
                                                                                                                                                                {subchilditem.childs.length > 0 &&
                                                                                                                                                                    <a className='hreflink'
                                                                                                                                                                        title="Tap to expand the childs">
                                                                                                                                                                        {/* <div className="sign">{subchilditem.show ? <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png" />
                                                                                                                                                                    : <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png" />}
                                                                                                                                                                </div> */}
                                                                                                                                                                    </a>
                                                                                                                                                                }

                                                                                                                                                            </div>
                                                                                                                                                        </td>
                                                                                                                                                        {/* <td style={{ width: "2%" }}></td> */}
                                                                                                                                                        <td style={{ width: "7%" }}>  <div className="d-flex">
                                                                                                                                                            <span>

                                                                                                                                                                <a className="hreflink" title="Show All Child" data-toggle="modal">
                                                                                                                                                                    <img className="icon-sites-img ml20" src={subchilditem.SiteIcon}></img>
                                                                                                                                                                    {/* <img className="icon-sites-img"
                                                                                                                        src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/SubComponent_icon.png" /> */}
                                                                                                                                                                </a>

                                                                                                                                                            </span>
                                                                                                                                                            <span className="ml-2">{subchilditem.Shareweb_x0020_ID}</span>
                                                                                                                                                        </div>
                                                                                                                                                        </td>

                                                                                                                                                        <td style={{ width: "20%" }}>
                                                                                                                                                            {subchilditem.siteType == "Master Tasks" && <a target="_blank" className="hreflink serviceColor_Active"
                                                                                                                                                                href={"https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile-SPFx.aspx?taskId=" + childitem.Id}
                                                                                                                                                            >{subchilditem.Title}
                                                                                                                                                            </a>}
                                                                                                                                                            {subchilditem.siteType != "Master Tasks" && <a target="_blank" className="hreflink serviceColor_Active"
                                                                                                                                                                href={"https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Task-Profile-SPFx.aspx?taskId=" + subchilditem.Id + '&Site=' + subchilditem.siteType}
                                                                                                                                                            >{subchilditem.Title}
                                                                                                                                                            </a>}
                                                                                                                                                            {subchilditem.childs.length > 0 &&
                                                                                                                                                                <span>({subchilditem.childs.length})</span>
                                                                                                                                                            }

                                                                                                                                                            {subchilditem.Short_x0020_Description_x0020_On != null &&
                                                                                                                                                                <span className="project-tool"><img
                                                                                                                                                                    src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/infoIcon.png" /><span className="tooltipte">
                                                                                                                                                                        <span className="tooltiptext">
                                                                                                                                                                            <div className="tooltip_Desc">
                                                                                                                                                                                <span>{subchilditem.Short_x0020_Description_x0020_On}</span>
                                                                                                                                                                            </div>
                                                                                                                                                                        </span>
                                                                                                                                                                    </span>
                                                                                                                                                                </span>
                                                                                                                                                            }
                                                                                                                                                        </td>
                                                                                                                                                        <td style={{ width: "18%" }}>
                                                                                                                                                            <div>
                                                                                                                                                                {subchilditem.ClientCategory != undefined && subchilditem.ClientCategory.length > 0 && subchilditem.ClientCategory.map(function (client: { Title: string; }) {
                                                                                                                                                                    return (
                                                                                                                                                                        <span className="ClientCategory-Usericon"
                                                                                                                                                                            title={client.Title}>
                                                                                                                                                                            <a>{client.Title.slice(0, 2).toUpperCase()}</a>
                                                                                                                                                                        </span>
                                                                                                                                                                    )
                                                                                                                                                                })}</div>
                                                                                                                                                        </td>
                                                                                                                                                        <td style={{ width: "20%" }}>
                                                                                                                                                            <div>{subchilditem.TeamLeaderUser != undefined && subchilditem.TeamLeaderUser.length > 0 && subchilditem.TeamLeaderUser.map(function (client1: { Title: string; }) {
                                                                                                                                                                return (
                                                                                                                                                                    <div className="ClientCategory-Usericon"
                                                                                                                                                                        title={client1.Title}>

                                                                                                                                                                        <a>{client1.Title.slice(0, 2).toUpperCase()}</a>

                                                                                                                                                                    </div>
                                                                                                                                                                )
                                                                                                                                                            })}</div></td>
                                                                                                                                                        <td style={{ width: "10%" }}>{subchilditem.PercentComplete}</td>
                                                                                                                                                        <td style={{ width: "10%" }}>{subchilditem.ItemRank}</td>
                                                                                                                                                        <td style={{ width: "10%" }}>{subchilditem.DueDate}</td>
                                                                                                                                                        <td style={{ width: "3%" }}><td>{subchilditem.siteType != "Master Tasks" && <a onClick={(e) => EditData(e, subchilditem)}><img style={{ width: "22px" }} src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/clock-gray.png"></img></a>}</td></td>
                                                                                                                                                        <td style={{ width: "3%" }}></td>
                                                s                                                                                                    </tr>
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
                                                                                                        }
                                                                                                    })}</>
                                                                                            )}</>
                                                                                    )
                                                                                }
                                                                            })}
                                                                        </>
                                                                    )}
                                                                </>


                                                            )
                                                        }
                                                    })}



                                                </tbody>



                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div></section>
                </div></section>{IsTask && <EditTaskPopup Items={SharewebTask} Call={Call}></EditTaskPopup>}
            {IsComponent && <EditInstituton props={SharewebComponent} Call={Call}></EditInstituton>}
            {IsTimeEntry && <TimeEntryPopup props={SharewebTimeComponent} CallBackTimeEntry={TimeEntryCallBack}></TimeEntryPopup>}
        </div >
    );
}
export default ComponentTable;







