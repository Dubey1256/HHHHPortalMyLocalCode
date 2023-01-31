import * as React from 'react';
import * as $ from 'jquery';
import Modal from 'react-bootstrap/Modal';
import * as Moment from 'moment';
import Button from 'react-bootstrap/Button';
import { map } from 'jquery';
// import { Modal } from 'office-ui-fabric-react';
import "bootstrap/dist/css/bootstrap.min.css";
import { FaAngleDown, FaAngleUp, FaPrint, FaFileExcel, FaPaintBrush, FaEdit, FaSearch, FaFilter, FaRegTimesCircle } from 'react-icons/fa';
import { MdAdd } from 'react-icons/Md';
import Tooltip from '../../../globalComponents/Tooltip';
import Dropdown from 'react-bootstrap/Dropdown';
import EditInstituton from '../../EditPopupFiles/EditComponent'
import { create } from 'lodash';
import EditTaskPopup from '../../../globalComponents/EditTaskPopup/EditTaskPopup';
// import TimeEntryPopup from '../../../globalComponents/TimeEntry/TimeEntryPopup';
import TimeEntryPopup from '../../../globalComponents/TimeEntry/TimeEntryComponent';
import * as globalCommon from '../../../globalComponents/globalCommon';
import { GlobalConstants } from '../../../globalComponents/LocalCommon';
import pnp, { Web, SearchQuery, SearchResults, UrlException } from "sp-pnp-js";
var filt: any = '';
var siteConfig: any = [];
var IsUpdated: any = '';
export default function ComponentTable({ props }: any) {
    const [maidataBackup, setmaidataBackup] = React.useState([])
    const [search, setSearch]: [string, (search: string) => void] = React.useState("");
    const [data, setData] = React.useState([])
    const [Title, setTitle] = React.useState()
    const [ComponentsData, setComponentsData] = React.useState([])
    const [SubComponentsData, setSubComponentsData] = React.useState([])
    const [FeatureData, setFeatureData] = React.useState([])
    const [table, setTable] = React.useState(data);
    const [AllUsers, setTaskUser] = React.useState([]);
    const [modalIsOpen, setModalIsOpen] = React.useState(false);
    const [addModalOpen, setAddModalOpen] = React.useState(false);
    const [state, setState] = React.useState([]);
    const [filterGroups, setFilterGroups] = React.useState([])
    const [filterItems, setfilterItems] = React.useState([])
    // const [AllMetadata, setMetadata] = React.useState([])
    const [IsComponent, setIsComponent] = React.useState(false);
    const [SharewebComponent, setSharewebComponent] = React.useState('');
    const [IsTask, setIsTask] = React.useState(false);
    const [SharewebTask, setSharewebTask] = React.useState('');
    const [SharewebTimeComponent, setSharewebTimeComponent] = React.useState([])
    const [IsTimeEntry, setIsTimeEntry] = React.useState(false);
    const [ShowSelectdSmartfilter, setShowSelectdSmartfilter] = React.useState([]);
    const [checked, setchecked] = React.useState([]);
    //--------------SmartFiltrt--------------------------------------------------------------------------------------------------------------------------------------------------
    IsUpdated = props.Portfolio_x0020_Type;
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

    const Clearitem = () => {
        // setData(maini...[maidataBackup])
        setData(maidataBackup)
        // const { checked } = e.target;

    }



    const LoadAllSiteTasks = function () {

        var Response: any = []
        var Counter = 0;
        map(siteConfig, async (config: any) => {
            if (config.DataLoadNew) {
                let AllTasksMatches = [];
                var select = "ParentTask/Title,ParentTask/Id,Services/Title,ClientTime,Services/Id,Events/Id,Events/Title,ItemRank,Portfolio_x0020_Type,SiteCompositionSettings,SharewebTaskLevel1No,SharewebTaskLevel2No,TimeSpent,BasicImageInfo,OffshoreComments,OffshoreImageUrl,CompletedDate,Shareweb_x0020_ID, Responsible_x0020_Team/Id,Responsible_x0020_Team/Title,SharewebCategories/Id,SharewebCategories/Title,ParentTask/Shareweb_x0020_ID,SharewebTaskType/Id,SharewebTaskType/Title,SharewebTaskType/Level, Priority_x0020_Rank, Team_x0020_Members/Title, Team_x0020_Members/Name, Component/Id,Component/Title,Component/ItemType, Team_x0020_Members/Id, Item_x002d_Image,component_x0020_link,IsTodaysTask,AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,  ClientCategory/Id, ClientCategory/Title, FileLeafRef, FeedBack, Title, Id, PercentComplete,StartDate, DueDate, Comments, Categories, Status, Body, Mileage,PercentComplete,ClientCategory,Priority,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title&$expand=ParentTask,Events,Services,SharewebTaskType,AssignedTo,Component,ClientCategory,Author,Editor,Team_x0020_Members,Responsible_x0020_Team,SharewebCategories&$filter=Status ne 'Completed'"
                AllTasksMatches = await globalCommon.getData(GlobalConstants.SP_SITE_URL, config.listId, select);
                console.log(AllTasksMatches);
                Counter++;
                console.log(AllTasksMatches.length);
                if (AllTasksMatches != undefined && AllTasksMatches.length > 0) {
                    $.each(AllTasksMatches, function (index: any, item: any) {
                        item.isDrafted = false;
                        item.flag = true;
                        item.siteType = config.Title;
                        item.childs = [];
                        item.listId = config.listId;
                        item.siteUrl = GlobalConstants.SP_SITE_URL;
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
                    AllTasks = AllTasks.concat(AllTasksMatches);
                    AllTasks = $.grep(AllTasks, function (type: any) { return type.isDrafted == false });
                    if (Counter == siteConfig.length) {
                        map(AllTasks, (result: any) => {
                            result.TeamLeaderUser = []
                            result.CreatedDateImg = []
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
                                map(result.AssignedTo, (Assig: any) => {
                                    if (Assig.Id != undefined) {
                                        map(TaskUsers, (users: any) => {

                                            if (Assig.Id != undefined && users.AssingedToUser != undefined && Assig.Id == users.AssingedToUser.Id) {
                                                users.ItemCover = users.Item_x0020_Cover;
                                                result.TeamLeaderUser.push(users);
                                                result.TeamLeaderUserTitle += users.Title + ';';
                                            }

                                        })
                                    }
                                })
                            }
                            if (result.Team_x0020_Members != undefined && result.Team_x0020_Members.results != undefined && result.Team_x0020_Members.results.length > 0) {
                                map(result.Team_x0020_Members.results, (Assig: any) => {
                                    if (Assig.Id != undefined) {
                                        map(TaskUsers, (users: any) => {
                                            if (Assig.Id != undefined && users.AssingedToUser != undefined && Assig.Id == users.AssingedToUser.Id) {
                                                users.ItemCover = users.Item_x0020_Cover;
                                                result.TeamLeaderUser.push(users);
                                                result.TeamLeaderUserTitle += users.Title + ';';
                                            }

                                        })
                                    }
                                })
                            }
                            if (result.Author != undefined) {
                                if (result.Author.Id != undefined) {
                                    $.each(TaskUsers, function (index: any, users: any) {
                                        if (result.Author.Id != undefined && users.AssingedToUser != undefined && result.Author.Id == users.AssingedToUser.Id) {
                                            users.ItemCover = users.Item_x0020_Cover;
                                            result.CreatedDateImg.push(users);
                                        }
                                    })
                                }
                            }
                            result['SiteIcon'] = globalCommon.GetIconImageUrl(result.siteType, GlobalConstants.MAIN_SITE_URL, undefined);
                            if (result.ClientCategory != undefined && result.ClientCategory.length > 0) {
                                map(result.Team_x0020_Members, (catego: any) => {
                                    result.ClientCategory.push(catego);
                                })
                            }
                            result['Shareweb_x0020_ID'] = globalCommon.getTaskId(result);
                            if (result['Shareweb_x0020_ID'] == undefined) {
                                result['Shareweb_x0020_ID'] = "";
                            }
                            result['Item_x0020_Type'] = 'Task';
                            TasksItem.push(result);
                        })
                        TasksItem = (AllTasks);
                        console.log(Response);
                        map(TasksItem, (task: any) => {
                            if (!isItemExistsNew(CopyTaskData, task)) {
                                CopyTaskData.push(task);
                            }
                        })
                        filterDataBasedOnList();
                    }
                }

            } else Counter++;

        })

    }

    const handleOpen = (item: any) => {

        item.show = item.show = item.show == true ? false : true;
        setData(maidataBackup => ([...maidataBackup]));

    };

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
                                        // subchilds.Title = subchilds.newTitle;
                                        subchilds.flag = (getSearchTermAvialable1(searchTerms, subchilds, Title));
                                        if (subchilds.flag) {
                                            item.childs[parentIndex].flag = true;
                                            child1.flag = true;
                                            subchild.flag = true;
                                            subchild.childs[childindex].flag = true;
                                            child1.childs[index].flag = true;
                                            child1.childs[index].show = true;
                                            item.childs[parentIndex].show = true;
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


    // var TaxonomyItems: any = [];
    var AllComponetsData: any = [];
    var TaskUsers: any = [];
    // var RootComponentsData: any = [];
    // var ComponentsData: any = [];
    // var SubComponentsData: any = []; var FeatureData: any = [];
    var MetaData: any = []
    var showProgressBar = () => {
        $(' #SpfxProgressbar').show();
    }

    var showProgressHide = () => {
        $(' #SpfxProgressbar').hide();
    }
    var Response: any = []
    const getTaskUsers = async () => {
        let taskUsers = Response = TaskUsers = await globalCommon.loadTaskUsers();
        setTaskUser(Response => ([...Response]));
        console.log(Response);

    }
    const GetSmartmetadata = async () => {
        var metadatItem: any = []
        let smartmetaDetails: any = [];
        var select: any = 'Id,Title,IsVisible,ParentID,SmartSuggestions,TaxType,Description1,Item_x005F_x0020_Cover,listId,siteName,siteUrl,SortOrder,SmartFilters,Selectable,Parent/Id,Parent/Title&$expand=Parent'
        smartmetaDetails = await globalCommon.getData(GlobalConstants.SP_SITE_URL, GlobalConstants.SMARTMETADATA_LIST_ID, select);
        console.log(smartmetaDetails);
        // setMetadata(smartmetaDetails => ([...smartmetaDetails]));
        map(smartmetaDetails, (newtest) => {
            newtest.Id = newtest.ID;
            // if (newtest.ParentID == 0 && newtest.TaxType == 'Client Category') {
            //     TaxonomyItems.push(newtest);
            // }
            if (newtest.TaxType == 'Sites') {
                siteConfig.push(newtest)
            }
        });
        map(siteConfig, (newsite) => {
            if (newsite.Title == "SDC Sites" || newsite.Title == "DRR" || newsite.Title == "Small Projects" || newsite.Title == "Offshore Tasks" || newsite.Title == "Health" || newsite.Title == "Shareweb Old" || newsite.Title == "Master Tasks")
                newsite.DataLoadNew = false;
            else
                newsite.DataLoadNew = true;
            /*-- Code for default Load Task Data---*/
            if (newsite.Title == "DRR" || newsite.Title == "Small Projects" || newsite.Title == "Gruene" || newsite.Title == "Offshore Tasks" || newsite.Title == "Health" || newsite.Title == "Shareweb Old") {

                newsite.Selected = false;
            }
            else {
                newsite.Selected = true;
            }
        })
        LoadAllSiteTasks();
    }
    const GetComponents = async () => {
        filt = "(Item_x0020_Type eq 'Component') or (Item_x0020_Type eq 'SubComponent') or (Item_x0020_Type eq 'Feature') and ((Portfolio_x0020_Type eq 'Service'))";
        if (IsUpdated != undefined && IsUpdated.toLowerCase().indexOf('service') > -1)
            filt = "((Item_x0020_Type eq 'Component') or (Item_x0020_Type eq 'SubComponent') or (Item_x0020_Type eq 'Feature')) and ((Portfolio_x0020_Type eq 'Service'))";
        if (IsUpdated != undefined && IsUpdated.toLowerCase().indexOf('events') > -1)
            filt = "((Item_x0020_Type eq 'Component') or (Item_x0020_Type eq 'SubComponent') or (Item_x0020_Type eq 'Feature')) and ((Portfolio_x0020_Type eq 'Events'))";
        if (IsUpdated != undefined && IsUpdated.toLowerCase().indexOf('component') > -1)
            filt = "((Item_x0020_Type eq 'Component') or (Item_x0020_Type eq 'SubComponent') or (Item_x0020_Type eq 'Feature')) and ((Portfolio_x0020_Type eq 'Component'))";
        let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
        let componentDetails: any = [];
        var select = "ID,Id,Title,Mileage,TaskListId,TaskListName,PortfolioLevel,PortfolioStructureID,PortfolioStructureID,component_x0020_link,Package,Comments,DueDate,Sitestagging,Body,Deliverables,StartDate,Created,Item_x0020_Type,Help_x0020_Information,Background,Categories,Short_x0020_Description_x0020_On,CategoryItem,Priority_x0020_Rank,Priority,TaskDueDate,PercentComplete,Modified,CompletedDate,ItemRank,Portfolio_x0020_Type,Services/Title, ClientTime,Services/Id,Events/Id,Events/Title,Parent/Id,Parent/Title,Component/Id,Component/Title,Component/ItemType,Services/Id,Services/Title,Services/ItemType,Events/Id,Author/Title,Editor/Title,Events/Title,Events/ItemType,SharewebCategories/Id,SharewebTaskType/Title,SharewebCategories/Title,AssignedTo/Id,AssignedTo/Title,Team_x0020_Members/Id,Team_x0020_Members/Title,ClientCategory/Id,ClientCategory/Title,Responsible_x0020_Team/Id,Responsible_x0020_Team/Title&$expand=Parent,Events,Services,SharewebTaskType,AssignedTo,Component,ClientCategory,Author,Editor,Team_x0020_Members,Responsible_x0020_Team,SharewebCategories";

        componentDetails = await globalCommon.getData(GlobalConstants.SP_SITE_URL, GlobalConstants.MASTER_TASKS_LISTID, select);
        console.log(componentDetails);
        var array: any = [];
        if (props.Item_x0020_Type != undefined && props.Item_x0020_Type === 'Component') {
            array = $.grep(componentDetails, function (compo: any) { return compo.Id === props.Id })
            let temp: any =  $.grep(componentDetails, function (compo: any) { return compo.Parent?.Id === props.Id })
            array = [...array, ...temp];
            temp.forEach((obj: any) => {
                if (obj.Id != undefined) {
                    var temp1: any = $.grep(componentDetails, function (compo: any) { return compo.Parent?.Id === obj.Id })
                    if (temp1 != undefined && temp1.length > 0)
                        array = [...array, ...temp1];
                }
            })
        }
        if (props.Item_x0020_Type != undefined && props.Item_x0020_Type === 'SubComponent') {
            array = $.grep(componentDetails, function (compo: any) { return compo.Id === props.Id })
            let temp = $.grep(componentDetails, function (compo: any) { return compo.Parent.Id === props.Id })
            if (temp != undefined && temp.length > 0)
                array = [...array, ...temp];
        }
        if (props.Item_x0020_Type != undefined && props.Item_x0020_Type === 'Feature') {
            array = $.grep(componentDetails, function (compo: any) { return compo.Id === props.Id })
        }

        AllComponetsData = array;
        ComponetsData['allComponets'] = array;
    }

    //const [IsUpdated, setIsUpdated] = React.useState(SelectedProp.SelectedProp);
    React.useEffect(() => {
        showProgressBar();
        getTaskUsers();
        GetSmartmetadata();
        LoadAllSiteTasks();
        GetComponents();
    }, [])
    // common services

    var parseJSON = function (jsonItem: any) {
        var json = [];
        try {
            json = JSON.parse(jsonItem);
        } catch (err) {
            console.log(err);
        }
        return json;
    };

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

    var LIST_CONFIGURATIONS_TASKS = '[{"Title":"Gruene","listId":"2302E0CD-F41A-4855-A518-A2B1FD855E4C","siteName":"Gruene","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"https://www.gruene-washington.de","MetadataName":"SP.Data.GrueneListItem","TimesheetListName":"TaskTimeSheetListNew","TimesheetListId":"464FB776-E4B3-404C-8261-7D3C50FF343F","TimesheetListmetadata":"SP.Data.TaskTimeSheetListNewListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Foundation/logo-gruene.png"},{"Title":"DE","listId":"3204D169-62FD-4240-831F-BCDDA77F5028","siteName":"DE","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"https://www.shareweb.ch/site/Development-Effectiveness","MetadataName":"SP.Data.DEListItem","TimesheetListName":"TaskTimeSheetListNew","TimesheetListId":"464FB776-E4B3-404C-8261-7D3C50FF343F","TimesheetListmetadata":"SP.Data.TaskTimeSheetListNewListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_de.png"},{"Title":"DRR","listId":"CCBCBAFE-292E-4384-A800-7FE0AAB1F70A","siteName":"DRR","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"","MetadataName":"SP.Data.DRRListItem","TimesheetListName":"TaskTimeSheetListNew","TimesheetListId":"464FB776-E4B3-404C-8261-7D3C50FF343F","TimesheetListmetadata":"SP.Data.TaskTimeSheetListNewListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_drr.png"},{"Title":"Education","listId":"CF45B0AD-7BFF-4778-AF7A-7131DAD2FD7D","siteName":"Education","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"https://www.shareweb.ch/site/education","MetadataName":"SP.Data.EducationListItem","TimesheetListName":"TaskTimeSheetListNew","TimesheetListId":"464FB776-E4B3-404C-8261-7D3C50FF343F","TimesheetListmetadata":"SP.Data.TaskTimeSheetListNewListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_education.png"},{"Title":"EI","listId":"E0E1FC6E-0E3E-47F5-8D4B-2FBCDC3A5BB7","siteName":"EI","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"https://www.shareweb.ch/site/ei","MetadataName":"SP.Data.EIListItem","TimesheetListName":"TaskTimeSheetListNew","TimesheetListId":"464FB776-E4B3-404C-8261-7D3C50FF343F","TimesheetListmetadata":"SP.Data.TaskTimeSheetListNewListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_ei.png"},{"Title":"EPS","listId":"EC6F0AE9-4D2C-4943-9E79-067EC77AA613","siteName":"EPS","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"https://www.shareweb.ch/site/eps","MetadataName":"SP.Data.EPSListItem","TimesheetListName":"TaskTimeSheetListNew","TimesheetListId":"464FB776-E4B3-404C-8261-7D3C50FF343F","TimesheetListmetadata":"SP.Data.TaskTimeSheetListNewListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_eps.png"},{"Title":"Gender","listId":"F8FD0ADA-0F3C-40B7-9914-674F63F72ABA","siteName":"Gender","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"","MetadataName":"SP.Data.GenderListItem","TimesheetListName":"TaskTimeSheetListNew","TimesheetListId":"464FB776-E4B3-404C-8261-7D3C50FF343F","TimesheetListmetadata":"SP.Data.TaskTimeSheetListNewListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_gender.png"},{"Title":"Health","listId":"E75C6AA9-E987-43F1-84F7-D1818A862076","siteName":"Health","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"https://www.shareweb.ch/site/Health","MetadataName":"SP.Data.HealthListItem","TimesheetListName":"TaskTimeSheetListNew","TimesheetListId":"464FB776-E4B3-404C-8261-7D3C50FF343F","TimesheetListmetadata":"SP.Data.TaskTimeSheetListNewListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_health.png"},{"Title":"HHHH","listId":"091889BD-5339-4D11-960E-A8FF38DF414B","siteName":"HHHH","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"https://hhhhteams.sharepoint.com/sites/HHHH","MetadataName":"SP.Data.HHHHListItem","TimesheetListName":"TaskTimeSheetListNew","TimesheetListId":"464FB776-E4B3-404C-8261-7D3C50FF343F","TimesheetListmetadata":"SP.Data.TaskTimeSheetListNewListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Foundation/icon_hhhh.png"},{"Title":"KathaBeck","listId":"beb3d9d7-daf3-4c0f-9e6b-fd36d9290fb9","siteName":null,"siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"https://kathabeck.sharepoint.com/sites/TeamK4Bundestag","MetadataName":"SP.Data.KathaBeckListItem","TimesheetListName":"TaskTimeSheetListNew","TimesheetListId":"464FB776-E4B3-404C-8261-7D3C50FF343F","TimesheetListmetadata":"SP.Data.TaskTimeSheetListNewListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Foundation/Icon_Kathabeck.png"},{"Title":"QA","listId":"61B71DBD-7463-4B6C-AF10-6609A23AE650","siteName":"QA","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"https://www.shareweb.ch/site/qa","MetadataName":"SP.Data.QAListItem","TimesheetListName":"TaskTimeSheetListNew","TimesheetListId":"464FB776-E4B3-404C-8261-7D3C50FF343F","TimesheetListmetadata":"SP.Data.TaskTimeSheetListNewListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_qa.png"},{"Title":"ALAKDigital","listId":"d70271ae-3325-4fac-9893-147ee0ba9b4d","siteName":"ALAKDigital","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"https://www.shareweb.ch/site/ei/digitaladministration","MetadataName":"SP.Data.ALAKDigitalListItem","TimesheetListName":"TasksTimesheet2","TimesheetListId":"9ED5C649-3B4E-42DB-A186-778BA43C5C93","TimesheetListmetadata":"SP.Data.TasksTimesheet2ListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_DA.png"},{"Title":"Shareweb","listId":"B7198F49-D58B-4D0A-ADAD-11995F6FADE0","siteName":"Shareweb","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"https://www.shareweb.ch/site/joint","MetadataName":"SP.Data.SharewebListItem","TimesheetListName":"TaskTimeSheetListNew","TimesheetListId":"464FB776-E4B3-404C-8261-7D3C50FF343F","TimesheetListmetadata":"SP.Data.TaskTimeSheetListNewListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_shareweb.png"},{"Title":"Small Projects","listId":"3AFC4CEE-1AC8-4186-B139-531EBCEEA0DE","siteName":"Small Projects","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"","MetadataName":"SP.Data.Small_x0020_ProjectsListItem","TimesheetListName":"TaskTimeSheetListNew","TimesheetListId":"464FB776-E4B3-404C-8261-7D3C50FF343F","TimesheetListmetadata":"SP.Data.TaskTimeSheetListNewListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/small_project.png"},{"Title":"Offshore Tasks","listId":"BEB90492-2D17-4F0C-B332-790BA9E0D5D4","siteName":"Offshore Tasks","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"https://hhhhteams.sharepoint.com/sites/HHHH","MetadataName":"SP.Data.SharewebQAListItem","TimesheetListName":"TaskTimeSheetListNew","TimesheetListId":"464FB776-E4B3-404C-8261-7D3C50FF343F","TimesheetListmetadata":"SP.Data.TaskTimeSheetListNewListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/offshore_Tasks.png"},{"Title":"Migration","listId":"D1A5AC25-3DC2-4939-9291-1513FE5AC17E","siteName":"Migration","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"https://www.shareweb.ch/site/Migration","MetadataName":"SP.Data.MigrationListItem","TimesheetListName":"TasksTimesheet2","TimesheetListId":"9ED5C649-3B4E-42DB-A186-778BA43C5C93","TimesheetListmetadata":"SP.Data.TasksTimesheet2ListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_migration.png"},{"Title":"Master Tasks","listId":"EC34B38F-0669-480A-910C-F84E92E58ADF","siteName":"Master Tasks","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"","MetadataName":"SP.Data.Master_x0020_TasksListItem","ImageUrl":"","ImageInformation":[{"ItemType":"Component","PortfolioType":"Component","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/component_icon.png"},{"ItemType":"SubComponent","PortfolioType":"Component","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/SubComponent_icon.png"},{"ItemType":"Feature","PortfolioType":"Component","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/feature_icon.png"},{"ItemType":"Component","PortfolioType":"Service","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/component_icon.png"},{"ItemType":"SubComponent","PortfolioType":"Service","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/SubComponent_icon.png"},{"ItemType":"Feature","PortfolioType":"Service","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/feature_icon.png"},{"ItemType":"Component","PortfolioType":"Events","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Event_Icons/component_icon.png"},{"ItemType":"SubComponent","PortfolioType":"Events","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Event_Icons/SubComponent_icon.png"},{"ItemType":"Feature","PortfolioType":"Events","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Event_Icons/feature_icon.png"}]}]'

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
            if (item.Id === items.Id && items.siteType === item.siteType) {
                isExists = true;
                return false;
            }
        });
        return isExists;
    }
    const findTaggedComponents = function (task: any) {
        task.Portfolio_x0020_Type = 'Component';
        task.isService = false;
        if (IsUpdated === 'Service') {
            $.each(task['Services'], function (index: any, componentItem: any) {
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
                        if (ComponetsData['allComponets'][i]['childs'] === undefined)
                            ComponetsData['allComponets'][i]['childs'] = [];
                        if (!isItemExistsNew(ComponetsData['allComponets'][i]['childs'], task)) {
                            ComponetsData['allComponets'][i].downArrowIcon = IsUpdated != undefined && IsUpdated == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png';
                            ComponetsData['allComponets'][i].RightArrowIcon = IsUpdated != undefined && IsUpdated == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png';
                            ComponetsData['allComponets'][i]['childs'].push(task);
                            if (ComponetsData['allComponets'][i].Id === 413)
                                console.log(ComponetsData['allComponets'][i]['childs'].length)
                        }
                        break;
                    }
                }
            });
        }
        if (IsUpdated === 'Events') {
            $.each(task['Events'], function (index: any, componentItem: any) {
                for (var i = 0; i < ComponetsData['allComponets'].length; i++) {
                    let crntItem = ComponetsData['allComponets'][i];
                    if (componentItem.Id == crntItem.Id) {
                        if (crntItem.PortfolioStructureID != undefined && crntItem.PortfolioStructureID != '') {
                            task.PortfolioStructureID = crntItem.PortfolioStructureID;
                            task.ShowTooltipSharewebId = crntItem.PortfolioStructureID + '-' + task.Shareweb_x0020_ID;
                        }
                        if (crntItem.Portfolio_x0020_Type == 'Events') {
                            task.isService = true;
                            task.Portfolio_x0020_Type = 'Events';
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
        if (IsUpdated === 'Component') {
            $.each(task['Component'], function (index: any, componentItem: any) {
                for (var i = 0; i < ComponetsData['allComponets'].length; i++) {
                    let crntItem = ComponetsData['allComponets'][i];
                    if (componentItem.Id == crntItem.Id) {
                        if (crntItem.PortfolioStructureID != undefined && crntItem.PortfolioStructureID != '') {
                            task.PortfolioStructureID = crntItem.PortfolioStructureID;
                            task.ShowTooltipSharewebId = crntItem.PortfolioStructureID + '-' + task.Shareweb_x0020_ID;
                        }
                        if (crntItem.Portfolio_x0020_Type == 'Component') {
                            task.isService = true;
                            task.Portfolio_x0020_Type = 'Component';
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
    //var pageType = 'Service-Portfolio';

    const DynamicSort = function (items: any, column: any) {
        items.sort(function (a: any, b: any) {
            // return   a[column] - b[column];
            var aID = a[column];
            var bID = b[column];
            return (aID == bID) ? 0 : (aID > bID) ? 1 : -1;
        })
    }
    var ComponetsData: any = {};
    ComponetsData.allUntaggedTasks = []
    const bindData = function () {
        var RootComponentsData: any[] = [];
        var ComponentsData: any = [];
        var SubComponentsData: any = [];
        var FeatureData: any = [];

        $.each(ComponetsData['allComponets'], function (index: any, result: any) {
            result.TeamLeaderUser = []
            result.CreatedDateImg = []
            result.TeamLeaderUserTitle = '';
            result.childsLength = 0;
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
            result['SiteIcon'] = globalCommon.GetIconImageUrl(result.siteType, 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/', undefined);
            if (result.AssignedTo != undefined && result.AssignedTo.length > 0) {
                $.each(result.AssignedTo, function (index: any, Assig: any) {
                    if (Assig.Id != undefined) {
                        $.each(Response, function (index: any, users: any) {

                            if (Assig.Id != undefined && users.AssingedToUser != undefined && Assig.Id == users.AssingedToUser.Id) {
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
                            if (Assig.Id != undefined && users.AssingedToUser != undefined && Assig.Id == users.AssingedToUser.Id) {
                                users.ItemCover = users.Item_x0020_Cover;
                                result.TeamLeaderUser.push(users);
                                result.TeamLeaderUserTitle += users.Title + ';';
                            }
                        })
                    }
                })
            }
            if (result.Author != undefined) {
                if (result.Author.Id != undefined) {
                    $.each(TaskUsers, function (index: any, users: any) {
                        if (result.Author.Id != undefined && users.AssingedToUser != undefined && result.Author.Id == users.AssingedToUser.Id) {
                            users.ItemCover = users.Item_x0020_Cover;
                            result.CreatedDateImg.push(users);
                        }
                    })
                }
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
                result.SiteIcon = IsUpdated != undefined && IsUpdated == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/component_icon.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/component_icon.png';
                ComponentsData.push(result);


            }

            if (result.Item_x0020_Type == 'SubComponent') {
                result.SiteIcon = IsUpdated != undefined && IsUpdated == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/SubComponent_icon.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/SubComponent_icon.png'
                result['childs'] = result['childs'] != undefined ? result['childs'] : [];
                SubComponentsData.push(result);


            }
            if (result.Item_x0020_Type == 'Feature') {
                result.SiteIcon = IsUpdated != undefined && IsUpdated == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/feature_icon.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/feature_icon.png';
                result['childs'] = result['childs'] != undefined ? result['childs'] : [];
                if(result['childs'].length >0){
                result.downArrowIcon = IsUpdated != undefined && IsUpdated == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png';
                result.RightArrowIcon = IsUpdated != undefined && IsUpdated == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png';
                }
                FeatureData.push(result);
            }
            // if (result.Title == 'Others') {
            //     //result['childs'] = result['childs'] != undefined ? result['childs'] : [];
            //     ComponentsData.push(result);
            // }
        });

        $.each(SubComponentsData, function (index: any, subcomp: any) {
            if (subcomp.Title != undefined) {
                $.each(FeatureData, function (index: any, featurecomp: any) {
                    if (featurecomp.Parent != undefined && subcomp.Id == featurecomp.Parent.Id) {
                        subcomp.downArrowIcon = IsUpdated != undefined && IsUpdated == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png';
                        subcomp.RightArrowIcon = IsUpdated != undefined && IsUpdated == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png';
                        subcomp.childsLength++;
                        subcomp['childs'].unshift(featurecomp);;
                    }
                })
            }
        })
        if (ComponentsData != undefined && ComponentsData.length > 0) {
            $.each(ComponentsData, function (index: any, subcomp: any) {
                if (subcomp.Title != undefined) {
                    $.each(SubComponentsData, function (index: any, featurecomp: any) {
                        if (featurecomp.Parent != undefined && subcomp.Id == featurecomp.Parent.Id) {
                            // subcomp.downArrowIcon  = IsUpdated !=undefined && IsUpdated=='Service Portfolio' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png': 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png' ;
                            //  subcomp.RightArrowIcon = IsUpdated !=undefined && IsUpdated=='Service Portfolio' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png': 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png' ;
                            subcomp.downArrowIcon = IsUpdated != undefined && IsUpdated == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png';
                            subcomp.RightArrowIcon = IsUpdated != undefined && IsUpdated == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png';
                            subcomp.childsLength++;
                            subcomp['childs'].unshift(featurecomp);;
                        }
                    })
                }
            })

            map(ComponentsData, (comp) => {
                if (comp.Title != undefined) {
                    map(FeatureData, (featurecomp) => {
                        if (featurecomp.Parent != undefined && comp.Id === featurecomp.Parent.Id) {
                            comp.downArrowIcon = IsUpdated != undefined && IsUpdated == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png';
                            comp.RightArrowIcon = IsUpdated != undefined && IsUpdated == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png';
                            comp.childsLength++;
                            comp['childs'].unshift(featurecomp);;
                        }
                    })
                }
            })
        } else
            ComponentsData = SubComponentsData
            var array: any = [];
            map(ComponentsData, (comp, index) => {
                if (comp.childs != undefined && comp.childs.length > 0) {
                    var Subcomponnet = comp.childs.filter((sub: { Item_x0020_Type: string; }) => (sub.Item_x0020_Type === 'SubComponent'));
                    DynamicSort(Subcomponnet, 'PortfolioLevel')
                    var SubTasks = comp.childs.filter((sub: { Item_x0020_Type: string; }) => (sub.Item_x0020_Type === 'Task'));
                    var SubFeatures = comp.childs.filter((sub: { Item_x0020_Type: string; }) => (sub.Item_x0020_Type === 'Feature'));
                    DynamicSort(SubFeatures, 'PortfolioLevel')
                    SubFeatures = SubFeatures.concat(SubTasks);
                    Subcomponnet = Subcomponnet.concat(SubFeatures);
                    comp['childs'] = Subcomponnet;
                    array.push(comp)
    
                    if (Subcomponnet != undefined && Subcomponnet.length > 0) {
                        //  if (comp.childs != undefined && comp.childs.length > 0) {
                        map(Subcomponnet, (subcomp, index) => {
                            if (subcomp.childs != undefined && subcomp.childs.length > 0) {
                                var Subchildcomponnet = subcomp.childs.filter((sub: any) => (sub.Item_x0020_Type === 'Feature'));
                                DynamicSort(SubFeatures, 'PortfolioLevel')
                                var SubchildTasks = subcomp.childs.filter((sub: any) => (sub.Item_x0020_Type === 'Task'));
                                Subchildcomponnet = Subchildcomponnet.concat(SubchildTasks);
                                subcomp['childs'] = Subchildcomponnet;
                                // var SubchildTasks = subcomp.childs.filter((sub: any) => (sub.ItemType === 'SubComponnet'));
                            }
    
                        })
                    }
                } else array.push(comp)
            })
            ComponentsData =array;
        var id = props.Id;
        var arrys: any = [];
        if (props.Item_x0020_Type == "Component") {
            $.each(ComponentsData, function (index: any, subcomp: any) {
                if (subcomp.Id == id)
                    arrys.push(subcomp.childs)
                if (subcomp.childs != undefined && subcomp.childs.length > 0) {
                    $.each(subcomp.childs, function (index: any, Nextcomp: any) {
                        if (Nextcomp.childs.Id == id)
                            arrys.push(Nextcomp.childs)
                        if (Nextcomp.childs != undefined && Nextcomp.childs.length > 0) {
                            $.each(Nextcomp.childs, function (index: any, Nextnextcomp: any) {
                                if (Nextnextcomp.Id == id)
                                    arrys.push(Nextnextcomp.childs);
                            })
                        }
                    })
                }
            })
        }
        if (props.Item_x0020_Type == "SubComponent") {
            $.each(SubComponentsData, function (index: any, subcomp: any) {
                if (subcomp.Id == id)
                    arrys.push(subcomp.childs)
                if (subcomp.childs != undefined && subcomp.childs.length > 0) {
                    $.each(subcomp.childs, function (index: any, Nextcomp: any) {
                        if (Nextcomp.childs.Id == id)
                            arrys.push(Nextcomp.childs)
                        if (Nextcomp.childs != undefined && Nextcomp.childs.length > 0) {
                            $.each(Nextcomp.childs, function (index: any, Nextnextcomp: any) {
                                if (Nextnextcomp.Id == id)
                                    arrys.push(Nextnextcomp.childs);
                            })
                        }
                    })
                }
            })
        }
        if (props.Item_x0020_Type == "Feature") {
            $.each(FeatureData, function (index: any, subcomp: any) {
                if (subcomp.Id == id)
                    arrys.push(subcomp.childs)
                if (subcomp.childs != undefined && subcomp.childs.length > 0) {
                    $.each(subcomp.childs, function (index: any, Nextcomp: any) {
                        if (Nextcomp.childs.Id == id)
                            arrys.push(Nextcomp.childs)
                        if (Nextcomp.childs != undefined && Nextcomp.childs.length > 0) {
                            $.each(Nextcomp.childs, function (index: any, Nextnextcomp: any) {
                                if (Nextnextcomp.Id == id)
                                    arrys.push(Nextnextcomp.childs);
                            })
                        }
                    })
                }
            })
        }

        //maidataBackup.push(ComponentsData)
        setSubComponentsData(SubComponentsData); setFeatureData(FeatureData);
        setComponentsData(ComponentsData);
        setmaidataBackup(arrys[0])
        setData(arrys[0]);
        showProgressHide();
    }

    var makeFinalgrouping = function () {
        var AllTaskData1: any = [];
        ComponetsData['allUntaggedTasks'] = [];
        AllTaskData1 = AllTaskData1.concat(TasksItem);
        $.each(AllTaskData1, function (index: any, task: any) {
            task.Portfolio_x0020_Type = 'Component';
            if (IsUpdated === 'Service') {
                if (task['Services'] != undefined && task['Services'].length > 0) {
                    task.Portfolio_x0020_Type = 'Service';
                    findTaggedComponents(task);
                }
                else if (task['Component'] != undefined && task['Component'].length === 0 && task['Events'] != undefined && task['Events'].length === 0) {
                    // if (task.SharewebTaskType != undefined && task.SharewebTaskType.Title && (task.SharewebTaskType.Title == "Activities" || task.SharewebTaskType.Title == "Workstream" || task.SharewebTaskType.Title == "Task"))
                    ComponetsData['allUntaggedTasks'].push(task);
                }

            }
            if (IsUpdated === 'Events') {
                if (task['Events'] != undefined && task['Events'].length > 0) {
                    task.Portfolio_x0020_Type = 'Events';
                    findTaggedComponents(task);
                }
                else if (task['Component'] != undefined && task['Component'].length == 0 && task['Services'] != undefined && task['Services'].length == 0) {
                    // if (task.SharewebTaskType != undefined && task.SharewebTaskType.Title && (task.SharewebTaskType.Title == "Activities" || task.SharewebTaskType.Title == "Workstream" || task.SharewebTaskType.Title == "Task"))
                    ComponetsData['allUntaggedTasks'].push(task);
                }

            }
            if (IsUpdated === 'Component') {
                if (task['Component'] != undefined && task['Component'].length > 0) {
                    task.Portfolio_x0020_Type = 'Component';
                    findTaggedComponents(task);
                }
                else if (task['Services'] != undefined && task['Services'].length == 0 && task['Events'] != undefined && task['Events'].length == 0) {
                    // if (task.SharewebTaskType != undefined && task.SharewebTaskType.Title && (task.SharewebTaskType.Title == "Activities" || task.SharewebTaskType.Title == "Workstream" || task.SharewebTaskType.Title == "Task"))
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
            if (task.Title != undefined) {
                temp.downArrowIcon = IsUpdated != undefined && IsUpdated == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png';
                temp.RightArrowIcon = IsUpdated != undefined && IsUpdated == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png';

                temp.childs.push(task);
            }
        })
        ComponetsData['allComponets'].push(temp);
        bindData();
    }
    const filterDataBasedOnList = function () {
        var AllTaskData1: any = [];
        AllTaskData1 = AllTaskData1.concat(CopyTaskData);
        makeFinalgrouping();
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


    // Expand Table 



    //------------------Edit Data----------------------------------------------------------------------------------------------------------------------------



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
    const Call = React.useCallback((item1) => {
        setIsComponent(false);
        setIsTask(false);
    }, []);
    const TimeEntryCallBack = React.useCallback((item1) => {
        setIsTimeEntry(false);
    }, []);
    var myarray: any = [];
    var myarray1: any = [];
    var myarray2: any = [];
    if (props.Sitestagging != null) {
        myarray.push(JSON.parse(props.Sitestagging));
    }
    if (myarray.length != 0) {
        myarray[0].map((items: any) => {
            if (items.SiteImages != undefined && items.SiteImages != '') {
                items.SiteImages = items.SiteImages.replace('https://www.hochhuth-consulting.de', 'https://hhhhteams.sharepoint.com/sites/HHHH')
                myarray1.push(items)
            }
            // console.log(myarray1);
            // if (items.ClienTimeDescription != undefined) {
            //     items.ClienTimeDescription = parseFloat(item.ClienTimeDescription);
            //     myarray1.push(items)
            // }
        })
        if (props.ClientCategory.results.length != 0) {
            props.ClientCategory.results.map((terms: any) => {
                //     if(myarray2.length!=0 && myarray2[0].title==terms.title){
                //                ""
                //     }else{
                //    myarray2.push(terms);
                // }
                myarray2.push(terms);
            })
        }
        //    const letters = new Set([myarray2]);
        // console.log(myarray2)
        // myarray.push();
    }
    const [lgShow, setLgShow] = React.useState(false);
    const handleClose = () => setLgShow(false);
    const [lgNextShow, setLgNextShow] = React.useState(false);
    const handleCloseNext = () => setLgNextShow(false);
    const [CreateacShow, setCreateacShow] = React.useState(false);
    const handleCreateac = () => setCreateacShow(false);
    // Add activity popup array
    var SomeMetaData1 = [{ "__metadata": { "id": "Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(11)", "uri": "https://hhhhteams.sharepoint.com/sites/HHHH/_api/;Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(11)", "etag": "\"13\"", "type": "SP.Data.SmartMetadataListItem" }, "Id": 15, "Title": "MileStone", "siteName": null, "siteUrl": null, "listId": null, "Description1": null, "IsVisible": true, "SmartFilters": { "__metadata": { "type": "Collection(Edm.String)" }, "results": [] }, "SortOrder": 2, "TaxType": "Categories", "Selectable": true, "ParentID": 24, "SmartSuggestions": null, "ID": 15 }, { "__metadata": { "id": "Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(105)", "uri": "https://hhhhteams.sharepoint.com/sites/HHHH/_api/Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(105)", "etag": "\"4\"", "type": "SP.Data.SmartMetadataListItem" }, "Id": 105, "Title": "Development", "siteName": null, "siteUrl": null, "listId": null, "Description1": null, "IsVisible": true, "Item_x005F_x0020_Cover": { "__metadata": { "type": "SP.FieldUrlValue" }, "Description": "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/development.png", "Url": "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/development.png" }, "SmartFilters": null, "SortOrder": 3, "TaxType": "Category", "Selectable": true, "ParentID": 0, "SmartSuggestions": null, "ID": 105 }, { "__metadata": { "id": "Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(282)", "uri": "https://hhhhteams.sharepoint.com/sites/HHHH/_api/Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(282)", "etag": "\"1\"", "type": "SP.Data.SmartMetadataListItem" }, "Id": 282, "Title": "Implementation", "siteName": null, "siteUrl": null, "listId": null, "Description1": "This should be tagged if a task is for applying an already developed component/subcomponent/feature.", "IsVisible": true, "Item_x005F_x0020_Cover": { "__metadata": { "type": "SP.FieldUrlValue" }, "Description": "/SiteCollectionImages/ICONS/Shareweb/Implementation.png", "Url": "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/Implementation.png" }, "SmartFilters": null, "SortOrder": 4, "TaxType": "Categories", "Selectable": true, "ParentID": 24, "SmartSuggestions": false, "ID": 282 }, { "__metadata": { "id": "Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(11)", "uri": "https://hhhhteams.sharepoint.com/sites/HHHH/_api/;Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(11)", "etag": "\"13\"", "type": "SP.Data.SmartMetadataListItem" }, "Id": 11, "Title": "Bug", "siteName": null, "siteUrl": null, "listId": null, "Description1": null, "IsVisible": true, "Item_x005F_x0020_Cover": { "__metadata": { "type": "SP.FieldUrlValue" }, "Description": "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/bug.png", "Url": "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/bug.png" }, "SmartFilters": { "__metadata": { "type": "Collection(Edm.String)" }, "results": ["MetaSearch", "Dashboard"] }, "SortOrder": 2, "TaxType": "Categories", "Selectable": true, "ParentID": 24, "SmartSuggestions": null, "ID": 11 }, { "__metadata": { "id": "Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(96)", "uri": "https://hhhhteams.sharepoint.com/sites/HHHH/_api/Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(96)", "etag": "\"5\"", "type": "SP.Data.SmartMetadataListItem" }, "Id": 96, "Title": "Feedback", "siteName": null, "siteUrl": null, "listId": null, "Description1": null, "IsVisible": true, "Item_x005F_x0020_Cover": { "__metadata": { "type": "SP.FieldUrlValue" }, "Description": "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/feedbck.png", "Url": "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/feedbck.png" }, "SmartFilters": null, "SortOrder": 2, "TaxType": null, "Selectable": true, "ParentID": 0, "SmartSuggestions": false, "ID": 96 }, { "__metadata": { "id": "Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(191)", "uri": "https://hhhhteams.sharepoint.com/sites/HHHH/_api/Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(191)", "etag": "\"3\"", "type": "SP.Data.SmartMetadataListItem" }, "Id": 191, "Title": "Improvement", "siteName": null, "siteUrl": null, "listId": null, "Description1": "Use this task category for any improvements of EXISTING features", "IsVisible": true, "Item_x005F_x0020_Cover": { "__metadata": { "type": "SP.FieldUrlValue" }, "Description": "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/Impovement.png", "Url": "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/Impovement.png" }, "SmartFilters": null, "SortOrder": 12, "TaxType": "Categories", "Selectable": true, "ParentID": 24, "SmartSuggestions": false, "ID": 191 }, { "__metadata": { "id": "Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(12)", "uri": "https://hhhhteams.sharepoint.com/sites/HHHH/_api/Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(12)", "etag": "\"13\"", "type": "SP.Data.SmartMetadataListItem" }, "Id": 12, "Title": "Design", "siteName": null, "siteUrl": null, "listId": null, "Description1": null, "IsVisible": true, "Item_x005F_x0020_Cover": { "__metadata": { "type": "SP.FieldUrlValue" }, "Description": "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/design.png", "Url": "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/design.png" }, "SmartFilters": { "__metadata": { "type": "Collection(Edm.String)" }, "results": ["MetaSearch", "Dashboard"] }, "SortOrder": 4, "TaxType": "Categories", "Selectable": true, "ParentID": 165, "SmartSuggestions": null, "ID": 12 }, { "__metadata": { "id": "Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(100)", "uri": "https://hhhhteams.sharepoint.com/sites/HHHH/_api/Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(100)", "etag": "\"13\"", "type": "SP.Data.SmartMetadataListItem" }, "Id": 100, "Title": "Activity", "siteName": null, "siteUrl": null, "listId": null, "Description1": null, "IsVisible": true, "Item_x005F_x0020_Cover": null, "SmartFilters": null, "SortOrder": 4, "TaxType": null, "Selectable": true, "ParentID": null, "SmartSuggestions": null, "ID": 100 }, { "__metadata": { "id": "Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(281)", "uri": "https://hhhhteams.sharepoint.com/sites/HHHH/_api/Web/Lists;(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(281)", "etag": "\"13\"", "type": "SP.Data.SmartMetadataListItem" }, "Id": 281, "Title": "Task", "siteName": null, "siteUrl": null, "listId": null, "Description1": null, "IsVisible": true, "Item_x005F_x0020_Cover": null, "SmartFilters": null, "SortOrder": 4, "TaxType": null, "Selectable": true, "ParentID": null, "SmartSuggestions": null, "ID": 281 }] as unknown as { siteName: any, siteUrl: any, listId: any, Description1: any, results: any[], SmartSuggestions: any, SmartFilters: any }[];
    console.log(siteConfig)
    return (
        <div className={IsUpdated == 'Events' ? 'app component eventpannelorange' : (IsUpdated == 'Service' ? 'app component serviepannelgreena' : 'app component')}>
            {/* Add activity task */}
            <Modal
                show={lgShow}
                aria-labelledby="example-modal-sizes-title-lg">
                <Modal.Header>
                    <Modal.Title>
                        <h6>Select Client Category</h6>
                    </Modal.Title>
                    <button type="button" className='Close-button' onClick={handleClose}></button>
                </Modal.Header>
                <Modal.Body className='p-2'>
                    <span className="bold">
                        Please select any one Client Category.
                    </span>
                    <div>
                        {myarray2.map((item: any) => {
                            return (
                                <div>  {item.Title}</div>
                            )
                        })}
                    </div>
                </Modal.Body >
                <Modal.Footer>
                    <Button variant="primary" onClick={() => setLgNextShow(true)}>
                        Ok
                    </Button>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* End of Add activity task */}
            {/* After Add activity task */}
            <Modal
                show={lgNextShow}
                aria-labelledby="example-modal-sizes-title-lg">
                <Modal.Header>
                    <Modal.Title>
                        <h6>Create Task</h6>
                    </Modal.Title>
                    <button type="button" className='Close-button' onClick={handleCloseNext}></button>
                </Modal.Header>
                <Modal.Body className='p-2'>
                    <span className="bold">
                        Clear Selection
                    </span>
                    <div>
                        {SomeMetaData1.map((item: any) => {
                            return (
                                <span>
                                    {item.Item_x005F_x0020_Cover != null &&
                                        <img src={item.Item_x005F_x0020_Cover.Url} />
                                    }
                                    <p onClick={() => setCreateacShow(true)}>{item.Title}</p>
                                </span>
                            )
                        })}
                    </div>
                </Modal.Body >
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseNext}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* After Add activity task End */}
            {/* Create task activity popup  */}
            <Modal
                show={CreateacShow}
                aria-labelledby="example-modal-sizes-title-lg">
                <Modal.Header>
                    <Modal.Title>
                        <h6>Create Quick Option</h6>
                    </Modal.Title>
                    <button type="button" className='Close-button' onClick={handleCreateac}></button>
                </Modal.Header>
                <Modal.Body className='p-2'>
                    <span className="bold">
                        Clear Selection
                    </span>
                    <div>
                        {siteConfig != null &&
                            <>
                                {siteConfig.map((site: any) => {
                                    return (
                                        <span>
                                            {(site.Title != undefined && site.Title != 'Foundation' && site.Title != 'Master Tasks' && site.Title != 'Gender' && site.Title != 'Health' && site.Title != 'SDC Sites' && site.Title != 'Offshore Tasks') &&
                                                <>
                                                    <img src={site.Item_x005F_x0020_Cover.Url} />
                                                    <p>{site.Title}</p>
                                                </>
                                            }
                                        </span>
                                    )
                                })}
                            </>
                        }
                    </div>
                </Modal.Body >
                <Modal.Footer>
                    <Button variant="primary"  >
                        Ok
                    </Button>
                    <Button variant="secondary" onClick={handleCreateac}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* End Create task activity popup  */}
            {/* Smart Time Popup */}
            {/* <Modal
                isOpen={SmartmodalIsOpen}
                onDismiss={setModalSmartIsOpenToFalse}
                isBlocking={true}
                isModeless={true}
            >
                <span >
                    <div id="myDropdown1" className="col-sm-12 pad0 dropdown-content">
                        <h4 className="col-sm-12 siteColor quickheader">
                            Smart Time <span title="Close popup" className="pull-right hreflink"
                                onClick={setModalSmartIsOpenToFalse}>
                                <i className="fa fa-times-circle"  ><FaRegTimesCircle /></i>
                            </span>
                        </h4>
                        <div className="col-md-12 mb-10 mt-10">
                            <select className="form-control"
                          >
                                <option value="">Select</option>
                                <option value="Equal to">Equal to</option>
                                <option value="Greater than">Greater than</option>
                                <option value="Less than">Less than</option>
                                <option value="Not equal to">Not equal to</option>
                            </select>
                        </div>
                        <div className="col-md-12 mb-10 mt-10">
                            <input type="text" placeholder="Effort"  className="form-control full-width ng-pristine ng-untouched ng-valid ng-empty" id="txtSmartTime" />
                        </div>
                        <div className="col-md-12 padL-0 text-center PadR0 mb-10 mt-10">
                            <button type="button" 
                                className="btn btn-primary">
                                Apply
                            </button>
                            <button type="button" className="btn btn-default blocks"
                               >
                                Clear
                            </button>
                        </div>
                    </div>
                </span>
            </Modal> */}
            {/* Smart Time popup end here */}
            {/* Created Date Popup */}
            {/* <Modal
                isOpen={CreatedmodalIsOpen}
                onDismiss={setModalSmartIsOpenToFalse}
                isBlocking={false}
                isModeless={true} >
                <div >
                    <div id="myDropdown4" className="dropdown-content">
                        <h4 className="col-sm-12 siteColor quickheader">
                            Created Date <span title="Close popup" className="pull-right hreflink"
                             onClick={setCreatedmodalIsOpenToFalse}>
                                <i className="fa fa-times-circle" aria-hidden="true"><FaRegTimesCircle /></i>
                            </span>
                        </h4>
                        <div className="col-md-12 mb-10 mt-10">
                            <select id="selectCreatedValue" className="form-control"
                            >
                                <option value="">Select</option>
                                <option value="Equal to">Equal to</option>
                                <option value="Greater than">Greater than</option>
                                <option value="Less than">Less than</option>
                                <option value="Not equal to">Not equal to</option>
                                <option value="In Between">In Between</option>
                                <option value="Presets">Presets</option>
                            </select>
                        </div>
                        <div
                            className="col-md-12 mb-10 mt-10 has-feedback has-feedback">
                            <input type="date" placeholder="dd/mm/yyyy"
                                className="form-control date-picker" id="txtDate4"
                            />
                            <i className="fa fa-calendar form-control-feedback mt-10"
                                style={{ marginRight: "10px" }}></i>
                        </div>
                        <div className="col-md-12 text-center PadR0 mb-10 mt-10">
                            <button type="button" 
                                className="btn btn-primary">
                                Apply
                            </button>
                            <button type="button" className="btn btn-default blocks"
                                >
                                Clear
                            </button>
                        </div>
                    </div>
                </div>
            </Modal> */}
            {/* Created Date popup end here */}
            {/* Due Date Popup */}
            {/* <Modal
                isOpen={DuemodalIsOpen}
                onDismiss={setDuemodalIsOpenToFalse}
                isBlocking={false}
                isModeless={true}
            >
                <div >
                    <div id="myDropdown4" className="dropdown-content">
                        <h4 className="col-sm-12 siteColor quickheader">
                            Due Date <span title="Close popup" className="pull-right hreflink"
                               onClick={setDuemodalIsOpenToFalse}>
                                <i className="fa fa-times-circle" aria-hidden="true"><FaRegTimesCircle /></i>
                            </span>
                        </h4>
                        <div className="col-md-12 mb-10 mt-10">
                            <select id="selectCreatedValue" className="form-control"
                             >
                                <option value="">Select</option>
                                <option value="Equal to">Equal to</option>
                                <option value="Greater than">Greater than</option>
                                <option value="Less than">Less than</option>
                                <option value="Not equal to">Not equal to</option>
                                <option value="In Between">In Between</option>
                                <option value="Presets">Presets</option>
                            </select>
                        </div>
                        <div
                            className="col-md-12 mb-10 mt-10 has-feedback has-feedback">
                            <input type="date" placeholder="dd/mm/yyyy"
                                className="form-control date-picker" id="txtDate4"
                              />
                            <i className="fa fa-calendar form-control-feedback mt-10"
                                style={{ marginRight: "10px" }}></i>
                        </div>
                        <div className="col-md-12 text-center PadR0 mb-10 mt-10">
                            <button type="button"
                                className="btn btn-primary">
                                Apply
                            </button>
                            <button type="button" className="btn btn-default blocks"
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                </div>
            </Modal> */}
            {/* Due Date popup end here */}
            {/* Team Member Popup */}
            {/* <Modal
                isOpen={TeamMembermodalIsOpen}
                onDismiss={setTeamMembermodalIsOpenToFalse}
                isBlocking={false}
                isModeless={true} >
                <span >
                    <div id="myDropdown1" className="dropdown-content">
                        <h4 className="col-sm-12 siteColor quickheader">
                            Team Members <span title="Close popup" className="pull-right hreflink"
                               onClick={setTeamMembermodalIsOpenToFalse}>
                                <i className="fa fa-times-circle" aria-hidden="true"><FaRegTimesCircle /></i>
                            </span>
                        </h4>
                        <div className="col-sm-12 padL-0 ml5">
                            <div className="checkbox mb0 ml15">
                                <input  type="checkbox"
                                    name="Responsibility1"
                                    /><span className=" f-500">
                                    Select All
                                </span>
                            </div>
                        </div>
                        <div className="col-sm-12 PadR0 ml5">
                            {filterGroups.map(function (item) {
                                return (
                                    <>
                                        {item == 'Team Members' &&
                                            <td valign="top">
                                                <fieldset>
                                                    <legend>{item == 'Team Members' && <span>{item}</span>}</legend>
                                                    <legend>{item == 'teamSites' && <span>Sites</span>}</legend>
                                                </fieldset>
                                                {filterItems.map(function (ItemType, index) {
                                                    return (
                                                        <>
                                                            <div style={{ display: "block" }}> {ItemType.Group == item &&
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
                                                                            <input type="checkbox" className="mr0 icon-input" value={ItemType.Title} onChange={(e) => SingleLookDatatest(e, ItemType, index)} />
                                                                            <span className="ml-2">
                                                                                {ItemType.Title}
                                                                            </span>
                                                                        </span>
                                                                    }
                                                                    {ItemType.TaxType == 'Status' &&
                                                                        <span className="ml-2">
                                                                            <input type="checkbox" className="mr0 icon-input" value={ItemType.Title} onChange={(e) => SingleLookDatatest(e, ItemType, index)} />
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
                                                                                                         >
                                                                                                            <img
                                                                                                                src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png" />
                                                                                                        </span>
                                                                                                    }
                                                                                                    {child1.childs.length > 0 && child1.expanded &&
                                                                                                        <span className="plus-icon hreflink"
                                                                                                         >
                                                                                                            <img
                                                                                                                src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png" />
                                                                                                        </span>
                                                                                                    }
                                                                                                    <input type="checkbox" className="icon-input mr0" 
                                                                                                        onChange={(e) => SingleLookDatatest(e, child1, index)} /> {child1.Title}
                                                                                                    <ul id="id_{{child1.Id}}" style={{ display: "none" }} className="subfilter"
                                                                                                    >
                                                                                                        {child1.childs.map(function (child2: any) {
                                                                                                            <li>
                                                                                                                <input type="checkbox"
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
                                                            }
                                                            </div>
                                                        </>
                                                    )
                                                })}
                                            </td>
                                        }
                                    </>
                                )
                            })}
                        </div>
                        <div className="col-md-12 text-center padL-0 PadR0 mb-10 mt-10">
                            <button type="button" 
                                className="btn btn-primary">
                                Apply
                            </button>
                            <button type="button" className="btn btn-default blocks"
                          >
                                Clear
                            </button>
                        </div>
                    </div>
                </span>
            </Modal> */}
            {/* Team Member popup end here */}
            {/* Item Rank Popup */}
            {/* <Modal
                isOpen={ItemRankmodalIsOpen}
                onDismiss={setItemRankmodalIsOpenToFalse}
                isBlocking={false}
                isModeless={true}>
                <span >
                    <div id="myDropdown1" className="dropdown-content">
                        <h4 className="col-sm-12 siteColor quickheader">
                            Item Rank <span title="Close popup" className="pull-right hreflink"
                                onClick={setItemRankmodalIsOpenToFalse}>
                                <i className="fa fa-times-circle" aria-hidden="true"><FaRegTimesCircle /></i>
                            </span>
                        </h4>
                        <div className="col-sm-12 padL-0 ml5" >
                            <div className="checkbox mb0 ml15">
                                <input  type="checkbox" name="ItemRank1"
                                   /><span className="f-500">Select All</span>
                            </div>
                        </div>
                        {AllItemRank.map(item => {
                            return (
                                <div className="col-sm-12 PadR0 ml5">
                                    <div className="col-sm-12 padL-0 PadR0 checkbox mb0 ml15"
                                  >
                                        <input type="checkbox"
                                            name="ItemRank" /><span className="">
                                            {item.Title}
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
                        <div className="col-md-12 padL-0 text-center PadR0 mb-10 mt-10">
                            <button type="button" 
                                className="btn btn-primary">
                                Apply
                            </button>
                            <button type="button" className="btn btn-default blocks"
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                </span>
            </Modal> */}
            {/* Item Rank popup end here */}
            {/* Status Popup */}
            {/* <Modal
                isOpen={StatusmodalIsOpen}
                onDismiss={setStatusmodalIsOpenToFalse}
                isBlocking={false}
                isModeless={true}
            >
                <span >
                    <div id="myDropdown1" className="dropdown-content">
                        <h4 className="col-sm-12 siteColor quickheader">
                            Status <span title="Close popup" className="pull-right hreflink"
                                onClick={setStatusmodalIsOpenToFalse}>
                                <i className="fa fa-times-circle" aria-hidden="true"><FaRegTimesCircle /></i>
                            </span>
                        </h4>
                        <div className="col-sm-12 padL-0 ml5">
                            <div className="checkbox mb0 ml15 f-500">
                                <span className="">
                                    <input  type="checkbox"
                                        name="PercentComplete1"
                                    />
                                    Select All
                                </span>
                            </div>
                        </div>
                        <div className="col-sm-12 PadR0 ml5">
                            {AllItems.map(items => {
                                return (
                                    <div className="col-sm-12 padL-0 PadR0 checkbox mb0 ml15"
                                  >
                                        <input type="checkbox"
                                            name="PercentComplete" /><span className="">
                                            {items.Title}%
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                        <div className="col-md-12 padL-0 PadR0 text-center mb-10 mt-10">
                            <button type="button" 
                                className="btn btn-primary">
                                Apply
                            </button>
                            <button type="button" className="btn btn-default blocks"
                           >
                                Clear
                            </button>
                        </div>
                    </div>
                </span>
            </Modal> */}
            {/* Status popup end here */}
            <div className="Alltable mt-10">
                <div className="tbl-headings">
                    <span className="leftsec">
                        <span className=''>
                            {props.Portfolio_x0020_Type == 'Component' && props.Item_x0020_Type != 'SubComponent' && props.Item_x0020_Type != 'Feature' &&
                                <>
                                    <img className='client-icons' src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/component_icon.png" />    <a>{props.Title}</a>
                                </>
                            }
                            {props.Portfolio_x0020_Type == 'Service' && props.Item_x0020_Type != 'SubComponent' && props.Item_x0020_Type != 'Feature' &&
                                <>
                                    <img className='client-icons' src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/component_icon.png" />  <a>{props.Title}</a>
                                </>}
                            {props.Portfolio_x0020_Type == 'Component' && props.Item_x0020_Type == 'SubComponent' &&
                                <>
                                    {props.Parent != undefined &&
                                        <a target='_blank' data-interception="off"
                                            href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile-SPFx.aspx?taskId=${props.Parent.Id}`}>
                                            <img className='client-icons' src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/component_icon.png" />
                                        </a>
                                    } {'>'} <img className='client-icons' src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/subComponent_icon.png" />    <a>{props.Title}</a>
                                </>
                            }
                            {props.Portfolio_x0020_Type == 'Service' && props.Item_x0020_Type == 'SubComponent' &&
                                <>
                                    {props.Parent != undefined &&
                                        <a target='_blank' data-interception="off"
                                            href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile-SPFx.aspx?taskId=${props.Parent.Id}`}>
                                            <img className='client-icons' src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/component_icon.png" />
                                        </a>
                                    } {'>'}
                                    <img className='client-icons' src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/subcomponent_icon.png" />    <a>{props.Title}</a>
                                </>
                            }

                            {props.Portfolio_x0020_Type == 'Component' && props.Item_x0020_Type == 'Feature' &&
                                <>

                                    {props.Parent != undefined &&
                                        <a target='_blank' data-interception="off"
                                            href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile-SPFx.aspx?taskId=${props.Parent.Id}`}>
                                            <img className='client-icons' src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/component_icon.png" />
                                        </a>

                                    } {'>'}  {(props.Parent.ItemType != undefined && props.Parent.ItemType == "SubComponent") &&
                                        <a target='_blank' data-interception="off"
                                            href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile-SPFx.aspx?taskId=${props.Parent.Id}`}>
                                            <img className='client-icons' src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/subComponent_icon.png" />
                                        </a>
                                    }  {'>'}  <img className='client-icons' src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/feature_icon.png" />    <a>{props.Title}</a>
                                </>
                            }
                            {props.Portfolio_x0020_Type == 'Service' && props.Item_x0020_Type == 'Feature' &&
                                <>
                                    {props.Parent != undefined &&
                                        <a target='_blank' data-interception="off"
                                            href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile-SPFx.aspx?taskId=${props.Parent.Id}`}>
                                            <img className='client-icons' src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/component_icon.png" />
                                        </a>
                                    } {'>'} {(props.Parent.ItemType != undefined && props.Parent.ItemType == "SubComponent") &&
                                        <a target='_blank' data-interception="off"
                                            href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile-SPFx.aspx?taskId=${props.Parent.Id}`}>
                                            <img className='client-icons' title={props.Parent.Title} src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/subcomponent_icon.png" />
                                        </a>
                                    }  {'>'}  <img className='client-icons' title={props.Title} src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/feature_icon.png" />    <a>{props.Title}</a>
                                </>
                            }
                        </span>
                        <span className="g-search">
                            <input type="text" className="searchbox_height full_width" id="globalSearch" placeholder="search all"
                                ng-model="SearchComponent.GlobalSearch" />
                            <span className="gsearch-btn" ng-click="SearchAll_Item()"><i className="fa fa-search"></i></span>
                        </span>
                    </span>
                    <span className="toolbox mx-auto">
                        <button type="button" className="btn btn-primary"
                            onClick={addModal} title=" Add Structure" disabled={true}>
                            Add Structure
                        </button>
                        <button type="button"
                            className="btn btn-primary"
                            onClick={() => setLgShow(true)} disabled={true}>
                            <MdAdd />
                            Add Activity-Task
                        </button>
                        <button type="button"
                            className="btn {{(compareComponents.length==0 && SelectedTasks.length==0)?'btn-grey':'btn-primary'}}"
                            disabled={true}>
                            Restructure
                        </button>
                        <button type="button"
                            className="btn {{(compareComponents.length==0 && SelectedTasks.length==0)?'btn-grey':'btn-primary'}}"
                            disabled={true}>
                            Compare
                        </button>
                        <a>
                            <Tooltip />
                        </a>
                    </span>
                </div>
                <div className="col-sm-12 pad0 smart" >
                    <div className="section-event">
                        <div className="wrapper">
                            <table className="table table-hover" id="EmpTable" style={{ width: "100%" }}>
                                <thead>
                                    <tr>
                                        <th style={{ width: "2%" }}>
                                            <div style={{ width: "2%" }}></div>
                                        </th>
                                        <th style={{ width: "6%" }}>
                                            <div style={{ width: "6%" }}></div>
                                        </th>
                                        <th style={{ width: "7%" }}>
                                            <div style={{ width: "6%" }} className="smart-relative">
                                                <input type="search" placeholder="TaskId" className="full_width searchbox_height"
                                                // onChange={(e)=>SearchVale(e,"TaskId")} 
                                                />
                                                <span className="sorticon">
                                                    <span className="up" onClick={sortBy}>< FaAngleUp /></span>
                                                    <span className="down" onClick={sortByDng}>< FaAngleDown /></span>
                                                </span>
                                            </div>
                                        </th>
                                        <th style={{ width: "23%" }}>
                                            <div style={{ width: "22%" }} className="smart-relative">
                                                <input type="search" placeholder="Title" className="full_width searchbox_height"
                                                //  onChange={(e)=>SearchAll(e)}
                                                />
                                                <span className="sorticon">
                                                    <span className="up" onClick={sortBy}>< FaAngleUp /></span>
                                                    <span className="down" onClick={sortByDng}>< FaAngleDown /></span>
                                                </span>
                                            </div>
                                        </th>
                                        <th style={{ width: "7%" }}>
                                            <div style={{ width: "6%" }} className="smart-relative">
                                                <input id="searchClientCategory" type="search" placeholder="Client Category"
                                                    title="Client Category" className="full_width searchbox_height"
                                                    onChange={(e) => handleChange1(e, "ClientCategory")} />
                                                <span className="sorticon">
                                                    <span className="up" onClick={sortBy}>< FaAngleUp /></span>
                                                    <span className="down" onClick={sortByDng}>< FaAngleDown /></span>
                                                </span>
                                            </div>
                                        </th>
                                        <th style={{ width: "7%" }}>
                                            <div style={{ width: "6%" }} className="smart-relative">
                                                <input id="searchClientCategory" type="search" placeholder="%"
                                                    title="Percentage Complete" className="full_width searchbox_height"
                                                    onChange={(e) => handleChange1(e, "ClientCategory")} />
                                                <span className="sorticon">
                                                    <span className="up" onClick={sortBy}>< FaAngleUp /></span>
                                                    <span className="down" onClick={sortByDng}>< FaAngleDown /></span>
                                                </span>
                                                {/* <Dropdown className='dropdown-fliter'>
                                                    <Dropdown.Toggle className='iconsbutton' variant="success" id="dropdown-basic">
                                                        <FaFilter />
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                                                        <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                                                        <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown> */}
                                                {/* <span className="dropdown filer-icons">
                                                                    <span className="filter-iconfil"
                                                                        onClick={setStatusmodalIsOpenToTrue}
                                                                    >
                                                                        <i ><FaFilter onClick={setStatusmodalIsOpenToTrue} /></i>
                                                                    </span></span> */}
                                            </div>
                                        </th>
                                        <th style={{ width: "7%" }}>
                                            <div style={{ width: "6%" }} className="smart-relative">
                                                <input id="searchClientCategory" type="search" placeholder="ItemRank"
                                                    title="Item Rank" className="full_width searchbox_height"
                                                    onChange={(e) => handleChange1(e, "ClientCategory")} />
                                                <span className="sorticon">
                                                    <span className="up" onClick={sortBy}>< FaAngleUp /></span>
                                                    <span className="down" onClick={sortByDng}>< FaAngleDown /></span>
                                                </span>
                                                {/* <Dropdown className='dropdown-fliter'>
                                                    <Dropdown.Toggle className='iconsbutton' variant="success" id="dropdown-basic">
                                                        <FaFilter />
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                                                        <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                                                        <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown> */}
                                                {/* <span className="dropdown filer-icons">
                                                                    <span className="filter-iconfil"
                                                                        onClick={setItemRankmodalIsOpenToTrue}
                                                                    >
                                                                        <i ><FaFilter onClick={setItemRankmodalIsOpenToTrue} /></i>
                                                                    </span>
                                                                </span> */}
                                            </div>
                                        </th>
                                        <th style={{ width: "10%" }}>
                                            <div style={{ width: "9%" }} className="smart-relative">
                                                <input id="searchClientCategory" type="search" placeholder="Team"
                                                    title="Team" className="full_width searchbox_height"
                                                    onChange={(e) => handleChange1(e, "Team")} />
                                                <span className="sorticon">
                                                    <span className="up" onClick={sortBy}>< FaAngleUp /></span>
                                                    <span className="down" onClick={sortByDng}>< FaAngleDown /></span>
                                                </span>
                                                {/* <Dropdown className='dropdown-fliter'>
                                                    <Dropdown.Toggle className='iconsbutton' variant="success" id="dropdown-basic">
                                                        <FaFilter />
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                                                        <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                                                        <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown> */}
                                                {/* <span className="dropdown filer-icons">
                                                                    <span className="filter-iconfil"
                                                                        onClick={setTeamMembermodalIsOpenToTrue}
                                                                    >
                                                                        <i ><FaFilter onClick={setTeamMembermodalIsOpenToTrue} /></i>
                                                                    </span>
                                                                </span> */}
                                            </div>
                                        </th>
                                        <th style={{ width: "9%" }}>
                                            <div style={{ width: "8%" }} className="smart-relative">
                                                <input id="searchClientCategory" type="search" placeholder="Due Date"
                                                    title="Due Date" className="full_width searchbox_height"
                                                // onChange={(e) => handleChange1(e, "Status")}
                                                />
                                                <span className="sorticon">
                                                    <span className="up" onClick={sortBy}>< FaAngleUp /></span>
                                                    <span className="down" onClick={sortByDng}>< FaAngleDown /></span>
                                                </span>
                                                {/* <Dropdown className='dropdown-fliter'>
                                                    <Dropdown.Toggle className='iconsbutton' variant="success" id="dropdown-basic">
                                                        <FaFilter />
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                                                        <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                                                        <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown> */}
                                                {/* <span className="dropdown filer-icons">
                                                                    <span className="filter-iconfil"
                                                                        onClick={setDuemodalIsOpenToTrue}
                                                                    >
                                                                        <i ><FaFilter onClick={setDuemodalIsOpenToTrue} /></i>
                                                                    </span>
                                                                </span> */}
                                            </div>
                                        </th>
                                        <th style={{ width: "9%" }}>
                                            <div style={{ width: "8%" }} className="smart-relative">
                                                <input id="searchClientCategory" type="search" placeholder="Created Date"
                                                    title="Created Date" className="full_width searchbox_height"
                                                // onChange={(e) => handleChange1(e, "ItemRank")} 
                                                />
                                                <span className="sorticon">
                                                    <span className="up" onClick={sortBy}>< FaAngleUp /></span>
                                                    <span className="down" onClick={sortByDng}>< FaAngleDown /></span>
                                                </span>
                                                {/* <Dropdown className='dropdown-fliter'>
                                                    <Dropdown.Toggle className='iconsbutton' variant="success" id="dropdown-basic">
                                                        <FaFilter />
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                                                        <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                                                        <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown> */}
                                                {/* <span className="dropdown filer-icons">
                                                                    <span className="filter-iconfil"
                                                                        //  href="#myDropdown1"
                                                                        onClick={setCreatedmodalIsOpenToTrue}
                                                                    >
                                                                        <i ><FaFilter onClick={setCreatedmodalIsOpenToTrue} /></i>
                                                                    </span>
                                                                </span> */}
                                            </div>
                                        </th>
                                        <th style={{ width: "7%" }}>
                                            <div style={{ width: "6%" }} className="smart-relative">
                                                <input id="searchClientCategory" type="search" placeholder="Smart Time"
                                                    title="Smart Time" className="full_width searchbox_height"
                                                // onChange={(e) => handleChange1(e, "Due")} 
                                                />
                                                <span className="sorticon">
                                                    <span className="up" onClick={sortBy}>< FaAngleUp /></span>
                                                    <span className="down" onClick={sortByDng}>< FaAngleDown /></span>
                                                </span>
                                                {/* <Dropdown className='dropdown-fliter'>
                                                    <Dropdown.Toggle className='iconsbutton' variant="success" id="dropdown-basic">
                                                        <FaFilter />
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                                                        <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                                                        <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown> */}
                                                {/* <span className="dropdown filer-icons">
                                                                    <span className="filter-iconfil"
                                                                        //  href="#myDropdown1"
                                                                        onClick={setModalSmartIsOpenToTrue}
                                                                    >
                                                                        <i ><FaFilter onClick={setModalSmartIsOpenToTrue} /></i>
                                                                    </span>
                                                                </span> */}
                                            </div>
                                        </th>
                                        <th style={{ width: "3%" }}>
                                            <div style={{ width: "2%" }}></div>
                                        </th>
                                        <th style={{ width: "3%" }}>
                                            <div style={{ width: "2%" }}></div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <div id="SpfxProgressbar" style={{ display: "none" }}>
                                        <img id="sharewebprogressbar-image" src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/loading_apple.gif" alt="Loading..." />
                                    </div>
                                    {data != undefined && data.length > 0 && data && data.map(function (item, index) {
                                        item.ClientCategory != undefined
                                        if (item.flag == true) {
                                            return (
                                                <>
                                                    <tr >
                                                        <td className="p-0" colSpan={13}>
                                                            <table className="table m-0" style={{ width: "100%" }}>
                                                                <tr className="bold for-c0l">
                                                                    <td style={{ width: "2%" }}>


                                                                        <div className="accordian-header" >
                                                                            {item.childs != undefined && item.childs.length > 0 &&
                                                                                <a className='hreflink'
                                                                                    title="Tap to expand the childs">
                                                                                    <div onClick={() => handleOpen(item)} className="sign">{item.childs.length > 0 && item.show ? <img src={item.downArrowIcon} />
                                                                                        : <img src={item.RightArrowIcon} />}
                                                                                    </div>
                                                                                </a>
                                                                            }
                                                                        </div>

                                                                    </td>
                                                                    <td style={{ width: "6%" }}>
                                                                        <div className="d-flex">
                                                                            <span className='pe-2'><input type="checkbox" />
                                                                                <a className="hreflink" data-toggle="modal">
                                                                                    <img className="icon-sites-img ml20" src={item.SiteIcon}></img>
                                                                                </a>
                                                                            </span>
                                                                        </div>
                                                                    </td>
                                                                    <td style={{ width: "7%" }}><span className="ml-2">{item.Shareweb_x0020_ID}</span></td>
                                                                    <td style={{ width: "23%" }}>
                                                                        {item.siteType == "Master Tasks" && <a className="hreflink serviceColor_Active" onClick={() => window.open(`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile-SPFx.aspx?taskId= + ${item.Id}`, '_blank')}
                                                                        >
                                                                            {item.Title}
                                                                        </a>}
                                                                        {item.siteType != "Master Tasks" && <a className="hreflink serviceColor_Active" target='_blank' data-interception="off"
                                                                            href={"https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Task-Profile.aspx?taskId=" + item.Id + '&Site=' + item.siteType}
                                                                        >{item.Title}
                                                                        </a>}
                                                                        {item.childs != undefined &&
                                                                            <span>{item.childs.length == 0 ? "" : <span className='ms-1'>({item.childs.length})</span>}</span>
                                                                        }
                                                                        {item.Short_x0020_Description_x0020_On != null &&
                                                                            // <span className="project-tool"><img
                                                                            //     src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/infoIcon.png" /><span className="tooltipte">
                                                                            //         <span className="tooltiptext">
                                                                            //             <div className="tooltip_Desc">
                                                                            //                 <span>{item.Short_x0020_Description_x0020_On}</span>
                                                                            //             </div>
                                                                            //         </span>
                                                                            //     </span>
                                                                            // </span>
                                                                            <div className='popover__wrapper ms-1' data-bs-toggle="tooltip" data-bs-placement="auto">
                                                                                <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/infoIcon.png" />
                                                                                <div className="popover__content">
                                                                                    {item.Short_x0020_Description_x0020_On}
                                                                                </div>
                                                                            </div>
                                                                        }
                                                                    </td>
                                                                    <td style={{ width: "7%" }}>
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
                                                                    <td style={{ width: "7%" }}>{item.PercentComplete}</td>
                                                                    <td style={{ width: "10%" }}>{item.ItemRank}</td>
                                                                    <td style={{ width: "7%" }}>
                                                                        <div>
                                                                            {item.TeamLeaderUser != undefined && item.TeamLeaderUser.map(function (client1: any) {
                                                                                return (
                                                                                    <span
                                                                                        title={client1.Title}>
                                                                                        {/* <a>{client1.Title.slice(0, 2).toUpperCase()}</a> */}
                                                                                        <img className="AssignUserPhoto" src={client1.ItemCover.Url} />
                                                                                    </span>
                                                                                )
                                                                            })}
                                                                        </div>
                                                                    </td>


                                                                    <td style={{ width: "9%" }}>{item.DueDate}</td>
                                                                    <td style={{ width: "9%" }}>
                                                                        {item.CreatedDateImg != null ? item.CreatedDateImg.map((Creates: any) => {
                                                                            return (
                                                                                <span>
                                                                                    {item.Created != null ? Moment(item.Created).format('DD/MM/YYYY') : ""}
                                                                                    <a target='_blank' data-interception="off" href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/TeamLeader-Dashboard.aspx?UserId=${Creates.AssingedToUser.Id}&Name=${Creates.AssingedToUser.Title}`}>

                                                                                        <img className='AssignUserPhoto' title={Creates.Title} src={Creates.Item_x0020_Cover.Description} />
                                                                                    </a>
                                                                                </span>
                                                                            )
                                                                        }) : ""}
                                                                    </td>
                                                                    <td style={{ width: "7%" }}>
                                                                        <div>
                                                                        </div>
                                                                    </td>
                                                                    <td style={{ width: "3%" }}>{item.siteType != "Master Tasks" && <a onClick={(e) => EditData(e, item)}><img style={{ width: "22px" }} src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/clock-gray.png"></img></a>}</td>
                                                                    <td style={{ width: "3%" }}><a>{item.siteType == "Master Tasks" && <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif" onClick={(e) => EditComponentPopup(item)} />}
                                                                        {item.siteType != "Master Tasks" && <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif" onClick={(e) => EditItemTaskPopup(item)} />}</a></td>
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
                                                                                <td className="p-0" colSpan={13}>
                                                                                    <table className="table m-0" style={{ width: "100%" }}>
                                                                                        <tr className="for-c02">
                                                                                            <td style={{ width: "2%" }}>
                                                                                                <div onClick={() => handleOpen(childitem)} className="sign">{childitem.childs.length > 0 && childitem.show ? <img src={childitem.downArrowIcon} />
                                                                                                    : <img src={childitem.RightArrowIcon} />}
                                                                                                </div>
                                                                                            </td>
                                                                                            <td style={{ width: "6%" }}>
                                                                                                <span className='pe-2'><input type="checkbox" />
                                                                                                    <a className="hreflink" data-toggle="modal">
                                                                                                        <img className="icon-sites-img ml20" src={childitem.SiteIcon}></img>
                                                                                                    </a>
                                                                                                </span>
                                                                                            </td>
                                                                                            <td style={{ width: "7%" }}>  <span className="ml-2">{childitem.Shareweb_x0020_ID}</span>
                                                                                            </td>
                                                                                            <td style={{ width: "23%" }}>
                                                                                                {childitem.siteType == "Master Tasks" && <a className="hreflink serviceColor_Active" target='_blank' data-interception="off"
                                                                                                    href={"https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile-SPFx.aspx?taskId=" + childitem.Id}
                                                                                                >{childitem.Title}
                                                                                                </a>}
                                                                                                {childitem.siteType != "Master Tasks" && <a className="hreflink serviceColor_Active" target='_blank' data-interception="off"
                                                                                                    href={"https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Task-Profile.aspx?taskId=" + childitem.Id + '&Site=' + childitem.siteType}
                                                                                                >{childitem.Title}
                                                                                                </a>}
                                                                                                {childitem.childs != undefined &&
                                                                                                    <span className='ms-1'>({childitem.childs.length})</span>
                                                                                                }
                                                                                                {childitem.Short_x0020_Description_x0020_On != null &&
                                                                                                    // <span className="project-tool"><img
                                                                                                    //     src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/infoIcon.png" /><span className="tooltipte">
                                                                                                    //         <span className="tooltiptext">
                                                                                                    //             <div className="tooltip_Desc">
                                                                                                    //                 <span>{childitem.Short_x0020_Description_x0020_On}</span>
                                                                                                    //             </div>
                                                                                                    //         </span>
                                                                                                    //     </span>
                                                                                                    // </span>
                                                                                                    <div className='popover__wrapper ms-1' data-bs-toggle="tooltip" data-bs-placement="auto">
                                                                                                        <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/infoIcon.png" />
                                                                                                        <div className="popover__content">
                                                                                                            {childitem.Short_x0020_Description_x0020_On}
                                                                                                        </div>
                                                                                                    </div>
                                                                                                }
                                                                                            </td>
                                                                                            <td style={{ width: "7%" }}>
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
                                                                                            <td style={{ width: "7%" }}>{childitem.PercentComplete}</td>
                                                                                            <td style={{ width: "10%" }}>{childitem.ItemRank}</td>
                                                                                            <td style={{ width: "7%" }}><div>{childitem.TeamLeaderUser != undefined && childitem.TeamLeaderUser != undefined && childitem.TeamLeaderUser.map(function (client1: { Title: string; }) {
                                                                                                return (
                                                                                                    <div className="AssignUserPhoto"
                                                                                                        title={client1.Title}>
                                                                                                        <a>{client1.Title.slice(0, 2).toUpperCase()}</a>
                                                                                                    </div>
                                                                                                )
                                                                                            })}</div></td>
                                                                                            <td style={{ width: "9%" }}>{childitem.DueDate}</td>
                                                                                            <td style={{ width: "9%" }}>
                                                                                                {childitem.CreatedDateImg != null ? childitem.CreatedDateImg.map((Creates: any) => {
                                                                                                    return (
                                                                                                        <span>
                                                                                                            {childitem.Created != null ? Moment(childitem.Created).format('DD/MM/YYYY') : ""}
                                                                                                            <a target='_blank' data-interception="off" href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/TeamLeader-Dashboard.aspx?UserId=${Creates.AssingedToUser.Id}&Name=${Creates.AssingedToUser.Title}`}>

                                                                                                                <img className='AssignUserPhoto' title={Creates.Title} src={Creates.Item_x0020_Cover.Description} />
                                                                                                            </a>
                                                                                                        </span>
                                                                                                    )
                                                                                                }) : ""}</td>
                                                                                            <td style={{ width: "7%" }}>
                                                                                                <div></div>
                                                                                            </td>
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
                                                                                                        <td className="p-0" colSpan={13}>
                                                                                                            <table className="table m-0" style={{ width: "100%" }}>
                                                                                                                <tr className="tdrow">
                                                                                                                    <td style={{ width: "2%" }}>
                                                                                                                        <div className="accordian-header" onClick={() => handleOpen(childinew)}>
                                                                                                                            {childinew.childs.length > 0 &&
                                                                                                                                <a className='hreflink'
                                                                                                                                    title="Tap to expand the childs">
                                                                                                                                    <div className="sign">{childinew.childs.length > 0 && childinew.show ? <img src={childinew.downArrowIcon} />
                                                                                                                                        : <img src={childinew.RightArrowIcon} />}
                                                                                                                                    </div>
                                                                                                                                </a>
                                                                                                                            }

                                                                                                                        </div>

                                                                                                                    </td>
                                                                                                                    <td style={{ width: "6%" }}>
                                                                                                                        <span className='pe-2'><input type="checkbox" />
                                                                                                                            <a className="hreflink" title="Show All Child" data-toggle="modal">
                                                                                                                                <img className="icon-sites-img ml20" src={childinew.SiteIcon}></img>
                                                                                                                            </a>
                                                                                                                        </span>
                                                                                                                    </td>
                                                                                                                    <td style={{ width: "7%" }}> <div className="d-flex">

                                                                                                                        <span className="ml-2">{childinew.Shareweb_x0020_ID}</span>
                                                                                                                    </div>
                                                                                                                    </td>
                                                                                                                    <td style={{ width: "23%" }}>
                                                                                                                        {childinew.siteType == "Master Tasks" && <a className="hreflink serviceColor_Active" target='_blank' data-interception="off"
                                                                                                                            href={"https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile-SPFx.aspx?taskId=" + childinew.Id}
                                                                                                                        >{childinew.Title}
                                                                                                                        </a>}
                                                                                                                        {childinew.siteType != "Master Tasks" && <a className="hreflink serviceColor_Active" target='_blank' data-interception="off"
                                                                                                                            href={"https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Task-Profile.aspx?taskId=" + childinew.Id + '&Site=' + childinew.siteType}
                                                                                                                        >{childinew.Title}
                                                                                                                        </a>}
                                                                                                                        {childinew.childs != undefined &&
                                                                                                                            <span className='ms-1'>({childinew.childs.length})</span>
                                                                                                                        }
                                                                                                                        {childinew.Short_x0020_Description_x0020_On != null &&
                                                                                                                            // <span className="project-tool"><img
                                                                                                                            //     src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/infoIcon.png" /><span className="tooltipte">
                                                                                                                            //         <span className="tooltiptext">
                                                                                                                            //             <div className="tooltip_Desc">
                                                                                                                            //                 <span>{childinew.Short_x0020_Description_x0020_On}</span>
                                                                                                                            //             </div>
                                                                                                                            //         </span>
                                                                                                                            //     </span>
                                                                                                                            // </span>
                                                                                                                            <div className='popover__wrapper ms-1' data-bs-toggle="tooltip" data-bs-placement="auto">
                                                                                                                                <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/infoIcon.png" />
                                                                                                                                <div className="popover__content">
                                                                                                                                    {childinew.Short_x0020_Description_x0020_On}
                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                        }
                                                                                                                    </td>
                                                                                                                    <td style={{ width: "7%" }}>
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
                                                                                                                    <td style={{ width: "7%" }}>{childinew.PercentComplete}</td>
                                                                                                                    <td style={{ width: "10%" }}>{childinew.ItemRank}</td>
                                                                                                                    <td style={{ width: "7%" }}>  <div>{childinew.TeamLeaderUser != undefined && childinew.TeamLeaderUser != undefined && childinew.TeamLeaderUser.map(function (client1: { Title: string; }) {
                                                                                                                        return (
                                                                                                                            <span className="AssignUserPhoto"
                                                                                                                                title={client1.Title}>
                                                                                                                                <a>{client1.Title.slice(0, 2).toUpperCase()}</a>
                                                                                                                            </span>
                                                                                                                        )
                                                                                                                    })}</div></td>
                                                                                                                    <td style={{ width: "9%" }}>{childinew.DueDate}</td>
                                                                                                                    <td style={{ width: "9%" }}> {childinew.CreatedDateImg != null ? childinew.CreatedDateImg.map((Creates: any) => {
                                                                                                                        return (
                                                                                                                            <span>
                                                                                                                                {childinew.Created != null ? Moment(childinew.Created).format('DD/MM/YYYY') : ""}
                                                                                                                                <a target='_blank' data-interception="off" href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/TeamLeader-Dashboard.aspx?UserId=${Creates.AssingedToUser.Id}&Name=${Creates.AssingedToUser.Title}`}>

                                                                                                                                    <img className='AssignUserPhoto' title={Creates.Title} src={Creates.Item_x0020_Cover.Description} />
                                                                                                                                </a>
                                                                                                                            </span>
                                                                                                                        )
                                                                                                                    }) : ""}</td>
                                                                                                                    <td style={{ width: "7%" }}></td>
                                                                                                                    <td style={{ width: "3%" }}>{childinew.siteType != "Master Tasks" && <a onClick={(e) => EditData(e, childinew)}><img style={{ width: "22px" }} src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/clock-gray.png"></img></a>}</td>
                                                                                                                    <td style={{ width: "3%" }}><a>{childinew.siteType == "Master Tasks" && <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif" onClick={(e) => EditComponentPopup(childinew)} />}
                                                                                                                        {childinew.siteType != "Master Tasks" && <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif" onClick={(e) => EditItemTaskPopup(childinew)} />}</a></td>
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
                                                                                                                            <td className="p-0" colSpan={13}>
                                                                                                                                <table className="table m-0" style={{ width: "100%" }}>
                                                                                                                                    <tr className="for-c02">
                                                                                                                                        <td style={{ width: "2%" }}>
                                                                                                                                            <div className="accordian-header" onClick={() => handleOpen(subchilditem)}>
                                                                                                                                                {subchilditem.childs.length > 0 &&
                                                                                                                                                    <a className='hreflink'
                                                                                                                                                        title="Tap to expand the childs">
                                                                                                                                                        <div className="sign">{subchilditem.childs.length > 0 && subchilditem.show ? <img src={subchilditem.downArrowIcon} />
                                                                                                                                                            : <img src={subchilditem.RightArrowIcon} />}
                                                                                                                                                        </div>
                                                                                                                                                    </a>
                                                                                                                                                }
                                                                                                                                            </div>
                                                                                                                                        </td>
                                                                                                                                        <td style={{ width: "6%" }}>
                                                                                                                                            <span className='pe-2'><input type="checkbox" /></span>
                                                                                                                                            <span>
                                                                                                                                                <a className="hreflink" title="Show All Child" data-toggle="modal">
                                                                                                                                                    <img className="icon-sites-img ml20" src={subchilditem.SiteIcon}></img>
                                                                                                                                                </a>
                                                                                                                                            </span>
                                                                                                                                        </td>
                                                                                                                                        <td style={{ width: "7%" }}>  <div className="d-flex">

                                                                                                                                            <span className="ml-2">{subchilditem.Shareweb_x0020_ID}</span>
                                                                                                                                        </div>
                                                                                                                                        </td>
                                                                                                                                        <td style={{ width: "23%" }}>
                                                                                                                                            {subchilditem.siteType == "Master Tasks" && <a className="hreflink serviceColor_Active" target='_blank' data-interception="off"
                                                                                                                                                href={"https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile-SPFx.aspx?taskId=" + childitem.Id}
                                                                                                                                            >{subchilditem.Title}
                                                                                                                                            </a>}
                                                                                                                                            {subchilditem.siteType != "Master Tasks" && <a className="hreflink serviceColor_Active" target='_blank' data-interception="off"
                                                                                                                                                href={"https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Task-Profile.aspx?taskId=" + subchilditem.Id + '&Site=' + subchilditem.siteType}
                                                                                                                                            >{subchilditem.Title}
                                                                                                                                            </a>}
                                                                                                                                            {subchilditem.childs != undefined &&
                                                                                                                                                <span className='ms-1'>({subchilditem.childs.length})</span>
                                                                                                                                            }
                                                                                                                                            {subchilditem.Short_x0020_Description_x0020_On != null &&
                                                                                                                                                // <span className="project-tool"><img
                                                                                                                                                //     src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/infoIcon.png" /><span className="tooltipte">
                                                                                                                                                //         <span className="tooltiptext">
                                                                                                                                                //             <div className="tooltip_Desc">
                                                                                                                                                //                 <span>{subchilditem.Short_x0020_Description_x0020_On}</span>
                                                                                                                                                //             </div>
                                                                                                                                                //         </span>
                                                                                                                                                //     </span>
                                                                                                                                                // </span>
                                                                                                                                                <div className='popover__wrapper ms-1' data-bs-toggle="tooltip" data-bs-placement="auto">
                                                                                                                                                    <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/infoIcon.png" />
                                                                                                                                                    <div className="popover__content">
                                                                                                                                                        {subchilditem.Short_x0020_Description_x0020_On}
                                                                                                                                                    </div>
                                                                                                                                                </div>
                                                                                                                                            }
                                                                                                                                        </td>
                                                                                                                                        <td style={{ width: "7%" }}>
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
                                                                                                                                        <td style={{ width: "7%" }}>{subchilditem.PercentComplete}</td>
                                                                                                                                        <td style={{ width: "10%" }}>{subchilditem.ItemRank}</td>
                                                                                                                                        <td style={{ width: "7%" }}>   <div>{subchilditem.TeamLeaderUser != undefined && subchilditem.TeamLeaderUser.map(function (client1: any) {
                                                                                                                                            return (
                                                                                                                                                <div className="AssignUserPhoto"
                                                                                                                                                    title={client1.Title}>
                                                                                                                                                    <a>{client1.Title.slice(0, 2).toUpperCase()}</a>
                                                                                                                                                </div>
                                                                                                                                            )
                                                                                                                                        })}</div></td>

                                                                                                                                        <td style={{ width: "9%" }}>{subchilditem.DueDate}</td>
                                                                                                                                        <td style={{ width: "9%" }}>{subchilditem.CreatedDateImg != null ? subchilditem.CreatedDateImg.map((Creates: any) => {
                                                                                                                                            return (
                                                                                                                                                <span>
                                                                                                                                                    {subchilditem.Created != null ? Moment(subchilditem.Created).format('DD/MM/YYYY') : ""}
                                                                                                                                                    <a target='_blank' data-interception="off" href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/TeamLeader-Dashboard.aspx?UserId=${Creates.AssingedToUser.Id}&Name=${Creates.AssingedToUser.Title}`}>

                                                                                                                                                        <img className='AssignUserPhoto' title={Creates.Title} src={Creates.Item_x0020_Cover.Description} />
                                                                                                                                                    </a>
                                                                                                                                                </span>
                                                                                                                                            )
                                                                                                                                        }) : ""}</td>
                                                                                                                                        <td style={{ width: "7%" }}></td>
                                                                                                                                        <td style={{ width: "3%" }}>{subchilditem.siteType != "Master Tasks" && <a onClick={(e) => EditData(e, subchilditem)}><img style={{ width: "22px" }} src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/clock-gray.png"></img></a>}</td>
                                                                                                                                        <td style={{ width: "3%" }}><a>{subchilditem.siteType == "Master Tasks" && <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif" onClick={(e) => EditComponentPopup(subchilditem)} />}
                                                                                                                                            {subchilditem.siteType != "Master Tasks" && <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif" onClick={(e) => EditItemTaskPopup(subchilditem)} />}</a></td>
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
            {IsTask && <EditTaskPopup Items={SharewebTask} Call={Call}></EditTaskPopup>}
            {IsComponent && <EditInstituton props={SharewebComponent} Call={Call}></EditInstituton>}
            {IsTimeEntry && <TimeEntryPopup props={SharewebTimeComponent} CallBackTimeEntry={TimeEntryCallBack}></TimeEntryPopup>}
            {/* {popupStatus ? <EditInstitution props={itemData} /> : null} */}
        </div>
    );
}