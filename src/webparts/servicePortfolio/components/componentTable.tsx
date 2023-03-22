import * as React from 'react';
import * as $ from 'jquery';
import * as Moment from 'moment';
//import '../../cssFolder/foundation.scss';
import { Modal, Panel, PanelType } from 'office-ui-fabric-react';
//import "bootstrap/dist/css/bootstrap.min.css";
import { FaAngleDown, FaAngleUp, FaPrint, FaFileExcel, FaPaintBrush, FaEdit, FaSearch } from 'react-icons/fa';
import { RxDotsVertical } from 'react-icons/rx';
import { MdAdd } from 'react-icons/Md';
import { CSVLink } from "react-csv";
import pnp, { Web, SearchQuery, SearchResults, UrlException } from "sp-pnp-js";
//import SmartFilter from './SmartFilter';
//import '../../cssFolder/foundation.scss';
import { map } from 'jquery';
import { concat } from 'lodash';
import EditInstituton from '../../EditPopupFiles/EditComponent';
import TimeEntryPopup from '../../../globalComponents/TimeEntry/TimeEntryComponent';
import { any, number } from 'prop-types';
import CheckboxTree from 'react-checkbox-tree';
import EditTaskPopup from '../../../globalComponents/EditTaskPopup/EditTaskPopup'
import ExpndTable from '../../../globalComponents/ExpandTable/Expandtable';
import { GlobalConstants } from '../../../globalComponents/LocalCommon';
import * as globalCommon from '../../../globalComponents/globalCommon';
import { typography } from '@mui/system';
import ShowTaskTeamMembers from '../../../globalComponents/ShowTaskTeamMembers';
import { PortfolioStructureCreationCard } from '../../../globalComponents/tableControls/PortfolioStructureCreation';
import CreateActivity from './CreateActivity';
import CreateWS from './CreateWS'
import 'bootstrap/dist/css/bootstrap.min.css';
import Tooltip from '../../../globalComponents/Tooltip';





var filt: any = '';
var siteConfig: any = [];
var finalData: any = []
var ComponentsDataCopy: any = [];
var SubComponentsDataCopy: any = [];
var FeatureDataCopy: any = [];
var array: any = [];
var MeetingItems:any=[]
var childsData:any=[]
var AllTask: any = [];
var serachTitle: any = '';
let ChengedTitle: any = '';
function ComponentTable(SelectedProp: any) {

    const [maidataBackup, setmaidataBackup] = React.useState([])
    const [search, setSearch]: [string, (search: string) => void] = React.useState("");
    const [data, setData] = React.useState([])
    const [Title, setTitle] = React.useState()
    const [ComponentsData, setComponentsData] = React.useState([])
    const [SubComponentsData, setSubComponentsData] = React.useState([])
    const [TotalTask, setTotalTask] = React.useState([])
    //const [childsData, setchildsData] = React.useState<any>([])
    const [ActivityDisable, setActivityDisable] = React.useState(true);
   // const [MeetingItems, setMeetingItems] = React.useState<any>([])
    const [ActivityPopup, setActivityPopup] = React.useState(false);
    const [TaggedAllTask, setTaggedAllTask] = React.useState([])
    const [FeatureData, setFeatureData] = React.useState([])
    const [MeetingPopup, setMeetingPopup] = React.useState(false);
    const [table, setTable] = React.useState(data);
    const [WSPopup, setWSPopup] = React.useState(false);
    const [AllUsers, setTaskUser] = React.useState([]);
    const [modalIsOpen, setModalIsOpen] = React.useState(false);
    const [addModalOpen, setAddModalOpen] = React.useState(false);
    const [show, setShow] = React.useState(false);
    const [showChild, setShowChild] = React.useState(false);
    const [showSubChild, setShowSubChild] = React.useState(false);
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
    const [IsUpdated, setIsUpdated] = React.useState('');
    const [tablecontiner, settablecontiner]: any = React.useState("hundred");
    const [Isshow, setIsshow] = React.useState(false);
    const [checkedList, setCheckedList] = React.useState([]);
    const [TotalArrayBackup, setTotalArrayBackup] = React.useState([]);
    const [IsSmartfilter, setIsSmartfilter] = React.useState(false);
    const [AllTasksData, setAllTasks] = React.useState([]);
    const [AllMasterTasks, setAllMasterTasks] = React.useState([]);
    const [AllCountItems, setAllCountItems] = React.useState({
        AllComponentItems: [], AllSubComponentItems: [], AllFeaturesItems: [], AfterSearchComponentItems: [], AfterSearchSubComponentItems: [], AfterSearchFeaturesItems: [],
    });
    const [OldArrayBackup, setOldArrayBackup] = React.useState([]);
    const [NewArrayBackup, setNewArrayBackup] = React.useState([]);
    const [ResturuningOpen, setResturuningOpen] = React.useState(false);
    const [RestructureChecked, setRestructureChecked] = React.useState([]);
    const [ChengedItemTitl, setChengedItemTitle] = React.useState('');

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
    const closeTaskStatusUpdatePoup2 = () => {
        MeetingItems?.forEach((val:any):any=>{
            val.chekBox =false;
        })
        setActivityPopup(false)
       // childsData =[]
        MeetingItems =[]
        childsData =[]
        // setMeetingItems([])


    }
    const openActivity = () => {
        if(MeetingItems.length > 1){
            alert('More than 1 Parents selected, Select only 1 Parent to create a child item')
        }
        else{
            if(MeetingItems[0] != undefined){
            if (MeetingItems[0].SharewebTaskType != undefined) {
                if (MeetingItems[0].SharewebTaskType.Title == 'Activities') {
                    setWSPopup(true)
                }
            }
            if (MeetingItems != undefined && MeetingItems[0].SharewebTaskType?.Title == 'Workstream') {
                setActivityPopup(true)
            }
            if(MeetingItems[0].Portfolio_x0020_Type == 'Service'&& MeetingItems[0].SharewebTaskType == undefined && childsData[0] == undefined){
                MeetingItems[0]['NoteCall'] = 'Activities';
                setMeetingPopup(true)
            }
            if (MeetingItems[0].Portfolio_x0020_Type == 'Component' && MeetingItems[0].SharewebTaskType == undefined && childsData[0] == undefined) {
                setActivityPopup(true)
            }
        }
        }
      
        if (childsData[0] != undefined && childsData[0].SharewebTaskType != undefined) {
            if (childsData[0].SharewebTaskType.Title == 'Activities') {
                setWSPopup(true)
                MeetingItems.push(childsData[0])
                //setMeetingItems(childsData)
            }
        }
      
        if (childsData[0] != undefined && childsData[0].SharewebTaskType.Title == 'Workstream') {
            setActivityPopup(true)
            MeetingItems.push(childsData[0])
        }
     




    }
    const ShowSelectedfiltersItems = () => {
        var ArrayItem: any = []
        var arrayselect: any = [];
        $.each(filterItems, function (index: any, newite: any) {
            if (newite.Selected === true) {
                arrayselect.push(newite);
            }
            if (newite.childs != undefined && newite.childs.length > 0) {
                newite.childs.forEach((obj: any) => {
                    if (obj.Selected === true) {
                        arrayselect.push(obj);
                    }
                })
            }

        })
        if (arrayselect != undefined) {
            map(arrayselect, (smart) => {
                var smartfilterItems: any = {};
                smartfilterItems.Title = smart.TaxType;
                if (IsExitSmartfilter(arrayselect, smartfilterItems)) {
                    if (smartfilterItems.count >= 3) {
                        smartfilterItems.selectTitle = ' : (' + smartfilterItems.count + ')';
                    } else smartfilterItems.selectTitle = ' : ' + smartfilterItems.MultipleTitle;
                }
                if (!issmartExists(ArrayItem, smartfilterItems))
                    ArrayItem.push(smartfilterItems);
            })
        }
        setShowSelectdSmartfilter(ShowSelectdSmartfilter => ([...ArrayItem]));
    }

    const SingleLookDatatest = (e: any, item: any, value: any) => {
        const { checked } = e.target;
        if (checked) {
            item.Selected = true;
            if (item.childs != undefined && item.childs.length > 0) {
                map(item.childs, (child) => {
                    child.Selected = true;
                })
            }

        }
        else {
            $.each(filterItems, function (index: any, newite: any) {
                if (newite.Title == item.Title) {
                    newite.Selected = false;
                }
                if (newite.childs != undefined && newite.childs.length > 0) {
                    newite.childs.forEach((obj: any) => {
                        if (obj.Title == item.Title) {
                            obj.Selected = false;
                        }
                    })
                }

            })
        }
        setfilterItems(filterItems => ([...filterItems]));
        ShowSelectedfiltersItems();
        // setState(state)
    }
    const Clearitem = () => {

        maidataBackup.forEach(function (val: any) {
            val.show = false;
            if (val.childs != undefined) {
                val.childs.forEach(function (i: any) {
                    i.show = false
                    if (i.childs != undefined) {
                        i.childs.forEach(function (subc: any) {
                            subc.show = false
                            if (subc.childs != undefined) {
                                subc.childs.forEach(function (last: any) {
                                    last.show = false
                                })
                            }
                        })

                    }
                })
            }
        })
        filterItems.forEach(function (itemm: any) {
            itemm.Selected = false;
        })

        setSubComponentsData(SubComponentsDataCopy);
        setFeatureData(FeatureDataCopy);
        setmaidataBackup(ComponentsDataCopy)
        setShowSelectdSmartfilter([])

        setState([])


        setData(maidataBackup)
        // const { checked } = e.target;

    }
    const getCommonItems = function (arr1: any, arr2: any) {
        var commonItems: any = [];
        arr1.forEach((item1: any) => {
            arr2.forEach((item2: any) => {
                if (item1.Id === item2.Id && item1.siteType == item2.siteType) {
                    commonItems.push(item2);
                    return false;
                }
            });
        });
        return commonItems;
    }

    const Updateitem = function () {
        var selectedFilters: any = [];
        $.each(filterItems, function (index: any, newite: any) {
            if (newite.Selected === true) {
                selectedFilters.push(newite);
            }
            if (newite.childs != undefined && newite.childs.length > 0) {
                newite.childs.forEach((obj: any) => {
                    if (obj.Selected === true) {
                        selectedFilters.push(obj);
                    }
                })
            }

        })

        if (selectedFilters.length > 0) {

            var PortfolioItems: any = [];
            var PriorityItems: any = [];
            var TypeItems = [];
            var ResponsibilityItems: any = [];
            var ItemRankItems: any = [];
            var PercentCompleteItems: any = [];
            var DueDateItems: any = [];
            var isDueDateSelected = false;
            var SitesItems: any = [];
            var isSitesSelected = false;
            var isPortfolioSelected = false;
            var isPrioritySelected = false;
            var isItemRankSelected = false;
            var isTypeSelected = false;
            var isResponsibilitySelected = false;
            var isPercentCompleteSelected = false;
            var AllData: any = [];
            AllTasksData.forEach((item: any) => {
                AllData.push(item);
            })
            AllMasterTasks.forEach((item: any) => {
                AllData.push(item);
            })
            AllData.forEach((item: any) => {
                selectedFilters.forEach((filterItem: any) => {
                    if (filterItem.Selected)
                        switch (filterItem.TaxType) {
                            case 'Portfolio':
                                if (item.Item_x0020_Type != undefined) {
                                    if (item.Item_x0020_Type != undefined && item.Item_x0020_Type == filterItem.Title && !isItemExistsNew(PortfolioItems, item)) {
                                        PortfolioItems.push(item);
                                        return false;
                                    }
                                }
                                isPortfolioSelected = true;
                                break;
                            case 'Priority':
                                if (item.Priority != undefined) {
                                    if (item.Priority != undefined && item.Priority == filterItem.Title && !isItemExistsNew(PriorityItems, item)) {
                                        PriorityItems.push(item);
                                        return false;
                                    }
                                }
                                isPrioritySelected = true;
                                break;
                            case 'ItemRank':
                                if (item.ItemRank != undefined) {
                                    if (item.ItemRank != undefined && item.ItemRank == filterItem.Title && !isItemExistsNew(ItemRankItems, item)) {
                                        ItemRankItems.push(item);
                                        return false;
                                    }
                                }
                                isItemRankSelected = true;
                                break;
                            // case 'Sites':
                            //     if (item.ItemRank != undefined) {
                            //         if (item.siteType != undefined && item.siteType == filterItem.Title && !isItemExistsNew(SitesItems, item)) {
                            //             SitesItems.push(item);
                            //             return false;
                            //         }
                            //     }
                            //     isSitesSelected = true;
                            //     break;
                            case 'PercentComplete':
                                if (item.PercentComplete != undefined) {
                                    if (item.PercentComplete != undefined && item.PercentComplete == filterItem.Title && !isItemExistsNew(PercentCompleteItems, item)) {
                                        PercentCompleteItems.push(item);
                                        return false;
                                    }
                                }
                                isPercentCompleteSelected = true;
                                break;
                            case 'Team Members':
                                if (item.AllTeamName != undefined) {
                                    if (item.AllTeamName != undefined && item.AllTeamName.toLowerCase().indexOf(filterItem.Title.toLowerCase()) > -1 && !isItemExistsNew(ResponsibilityItems, item)) {
                                        ResponsibilityItems.push(item);
                                        return false;
                                    }
                                }
                                isResponsibilitySelected = true;
                                break;

                        }
                });
            });
            var commonItems: any = [];
            if (isPortfolioSelected) {
                if (commonItems != undefined && commonItems.length > 0) {
                    commonItems = getCommonItems(commonItems, PortfolioItems);
                    if (commonItems.length == 0) {
                        PortfolioItems = null;
                        TypeItems = null;
                        PriorityItems = null;
                        ResponsibilityItems = null;
                        ItemRankItems = null;
                        PercentCompleteItems = null;
                        DueDateItems = null;
                        SitesItems = null;
                    }
                } else
                    commonItems = ([...PortfolioItems]);
            }
            if (isResponsibilitySelected) {
                if (commonItems != undefined && commonItems.length > 0) {
                    commonItems = getCommonItems(commonItems, ResponsibilityItems);
                    if (commonItems.length == 0) {
                        PortfolioItems = null;
                        TypeItems = null;
                        PriorityItems = null;
                        ResponsibilityItems = null;
                        ItemRankItems = null;
                        PercentCompleteItems = null;
                        DueDateItems = null;
                        SitesItems = null;
                    }
                } else
                    commonItems = ([...ResponsibilityItems]);
            }
            if (isPrioritySelected) {
                if (commonItems != undefined && commonItems.length > 0) {
                    commonItems = getCommonItems(commonItems, PriorityItems);
                    if (commonItems.length == 0) {
                        PortfolioItems = null;
                        TypeItems = null;
                        PriorityItems = null;
                        ResponsibilityItems = null;
                        ItemRankItems = null;
                        PercentCompleteItems = null;
                        DueDateItems = null;
                        SitesItems = null;
                    }
                } else
                    commonItems = ([...PriorityItems]);
            }

            if (isItemRankSelected) {
                if (commonItems != undefined && commonItems.length > 0) {
                    commonItems = getCommonItems(commonItems, ItemRankItems);
                    if (commonItems.length == 0) {
                        PortfolioItems = null;
                        TypeItems = null;
                        PriorityItems = null;
                        ResponsibilityItems = null;
                        ItemRankItems = null;
                        PercentCompleteItems = null;
                        DueDateItems = null;
                        SitesItems = null;
                    }
                } else
                    commonItems = ([...ItemRankItems]);
            }

            if (isSitesSelected) {
                if (commonItems != undefined && commonItems.length > 0) {
                    commonItems = getCommonItems(commonItems, SitesItems);
                    if (commonItems.length == 0) {
                        PortfolioItems = null;
                        TypeItems = null;
                        PriorityItems = null;
                        ResponsibilityItems = null;
                        ItemRankItems = null;
                        PercentCompleteItems = null;
                        DueDateItems = null;
                        SitesItems = null;
                    }
                } else
                    commonItems = ([...SitesItems]);
            }
            if (isPercentCompleteSelected) {
                if (commonItems != undefined && commonItems.length > 0) {
                    commonItems = getCommonItems(commonItems, PercentCompleteItems);
                    if (commonItems.length == 0) {
                        PortfolioItems = null;
                        TypeItems = null;
                        PriorityItems = null;
                        ResponsibilityItems = null;
                        ItemRankItems = null;
                        PercentCompleteItems = null;
                        DueDateItems = null;
                        SitesItems = null;
                    }
                } else
                    commonItems = ([...PercentCompleteItems]);
            }
            let arrayItem = [...TotalArrayBackup];
            arrayItem.forEach((item: any, pareIndex: any) => {
                item.flag = false;
                if (item.childs != undefined && item.childs.length > 0) {
                    item.childs.forEach((child: any, parentIndex: any) => {
                        child.flag = false;
                        if (child.childs != undefined && child.childs.length > 0) {
                            child.childs.forEach((subchild: any, index: any) => {
                                subchild.flag = false;
                                if (subchild.childs != undefined && subchild.childs.length > 0) {
                                    subchild.childs.forEach((subchilds: any, index: any) => {
                                        subchilds.flag = false;
                                        if (subchilds.childs != undefined && subchilds.childs.length > 0) {
                                            subchilds.childs.forEach((Lastsubchilds: any, index: any) => {
                                                Lastsubchilds.flag = false;

                                            })
                                        }
                                    })
                                }
                            })
                        }

                    })
                }
            })

            let Subcomponnet = commonItems.filter((sub: { Item_x0020_Type: string; }) => (sub.Item_x0020_Type === 'SubComponent'));
            var Componnet = commonItems.filter((sub: { Item_x0020_Type: string; }) => (sub.Item_x0020_Type === 'Component'));
            var Features = commonItems.filter((sub: { Item_x0020_Type: string; }) => (sub.Item_x0020_Type === 'Feature'));
            setAllCountItems({ ...AllCountItems, AfterSearchComponentItems: Subcomponnet, AfterSearchSubComponentItems: Componnet, AfterSearchFeaturesItems: Features });
            // var Subcomponnet = commonItems.filter((sub: { Item_x0020_Type: string; }) => (sub.Item_x0020_Type === 'SubComponent'));
            commonItems.forEach((filterItem: any) => {
                arrayItem.forEach((item: any, pareIndex: any) => {
                    if ((item.Id == filterItem.Id) && (item.siteType.toLowerCase() == filterItem.siteType.toLowerCase())) {
                        item.flag = true;
                        item.show = true;
                    }
                    if (item.childs != undefined && item.childs.length > 0) {
                        item.childs.forEach((child: any, parentIndex: any) => {
                            //  child.flag = false;
                            if ((child.Id == filterItem.Id) && (child.siteType.toLowerCase() == filterItem.siteType.toLowerCase())) {
                                item.childs[parentIndex].flag = true;
                                arrayItem[pareIndex].flag = true;
                                child.flag = true;
                                item.childs[parentIndex].show = true;
                                arrayItem[pareIndex].show = true;
                            }
                            if (child.childs != undefined && child.childs.length > 0) {
                                child.childs.forEach((subchild: any, index: any) => {
                                    //  subchild.flag = false;
                                    if ((subchild.Id == filterItem.Id) && (subchild.siteType.toLowerCase() == filterItem.siteType.toLowerCase())) {
                                        item.childs[parentIndex].flag = true;
                                        child.flag = true;
                                        child.childs[index].flag = true;
                                        arrayItem[pareIndex].flag = true;
                                        subchild.flag = true;
                                        child.childs[index].show = true;
                                        arrayItem[pareIndex].show = true;
                                        subchild.show = true;
                                    }
                                    if (subchild.childs != undefined && subchild.childs.length > 0) {
                                        subchild.childs.forEach((subchilds: any, childindex: any) => {
                                            //  subchilds.flag = false;
                                            if ((subchilds.Id == filterItem.Id) && (subchilds.siteType.toLowerCase() == filterItem.siteType.toLowerCase())) {
                                                subchilds.flag = true;
                                                item.childs[parentIndex].flag = true;
                                                subchild.flag = true;
                                                subchild.childs[childindex].flag = true;
                                                arrayItem[pareIndex].flag = true;
                                                item.childs[parentIndex].show = true;
                                                subchild.show = true;
                                                subchild.childs[childindex].show = true;
                                                arrayItem[pareIndex].show = true;
                                            }
                                            if (subchild.childs != undefined && subchild.childs.length > 0) {
                                                subchilds.childs.forEach((Lastsubchilds: any, subchildindex: any) => {
                                                    //   Lastsubchilds.flag = false;
                                                    if ((Lastsubchilds.Id == filterItem.Id) && (Lastsubchilds.siteType.toLowerCase() == filterItem.siteType.toLowerCase())) {
                                                        Lastsubchilds.flag = true;
                                                        item.childs[parentIndex].flag = true;
                                                        child.childs[index].flag = true;
                                                        subchilds.flag = true;
                                                        subchilds.childs[subchildindex].flag = true;
                                                        arrayItem[pareIndex].flag = true;

                                                        item.childs[parentIndex].show = true;
                                                        child.childs[index].show = true;
                                                        subchilds.show = true;
                                                        subchilds.childs[subchildindex].show = true;
                                                        arrayItem[pareIndex].show = true;
                                                    }
                                                })
                                            }
                                        })
                                    }
                                });
                            }

                        })
                    }
                })
            })
            setData((arrayItem) => [...arrayItem])
        }
        else {
            setData((data) => [...TotalArrayBackup])
        }
        //  setData((data) =>[...data])
        //  getFilterLength();
        //  getOtherSorting('Shareweb_x0020_ID', false);
        //   $scope.ValueTitle = undefined;
        // $scope.ShowhideAccordingTitle = undefined;
        //document.getElementById("myDropdown1").style.display = "none";
        //  SharewebCommonFactoryService.hideProgressBar();
    }

    const CreateMeetingPopups = (item: any) => {
        setMeetingPopup(true);
        MeetingItems[0]['NoteCall'] = item;
        

    }
    const Updateitem1 = () => {
        var component: any[] = []
        var subcomponent: any[] = []
        var feature: any[] = []
        var filters: any[] = []
        var finalArray: any = []
        var RootData: any = []
        var ALTask: any = [];

        var arrayselect: any = [];
        $.each(filterItems, function (index: any, newite: any) {
            if (newite.Selected === true) {
                arrayselect.push(newite);
            }
            if (newite.childs != undefined && newite.childs.length > 0) {
                newite.childs.forEach((obj: any) => {
                    if (obj.Selected === true) {
                        arrayselect.push(obj);
                    }
                })
            }

        })



        if (arrayselect.length > 0) {
            // maidataBackup.forEach(function (val: any) {
            //     val.Child = []
            //     if (val.childs != undefined) {
            //         val.childs.forEach(function (type: any) {
            //             type.Child = []
            //             if (type.childs != undefined) {
            //                 type.childs.forEach(function (value: any) {
            //                     value.Child = []
            //                     if (value.childs != undefined) {
            //                         value.childs.forEach(function (last: any) {
            //                             last.Child = []

            //                         })
            //                     }
            //                 })
            //             }
            //         })
            //     }
            // })

            var all = ([...TotalArrayBackup]);;
            all.forEach((item, index) => {
                item.flag = false;
                $.each(arrayselect, function (index: any, select) {
                    if (select.Selected === true) {
                        if (select.TaxType == 'Team Members') {
                            //  if (item.AssignedTo != null) {
                            item.TeamLeaderUser.forEach(function (typee: any) {
                                if (typee.Title == select.Title) {
                                    item.flag = true;
                                }
                            })
                            if (item.childs !== undefined) {
                                //   item.Child = []
                                item.childs.forEach(function (type: any) {
                                    type.flag = false;
                                    if (type.TeamLeaderUser != undefined) {
                                        type.TeamLeaderUser.forEach(function (typee: any) {
                                            if (typee.Title == select.Title) {
                                                item.flag = true;
                                                type.flag = true;
                                                // item.Child.push(type);
                                                // RootData.push(item);
                                            }
                                        })


                                    }
                                    if (type.childs !== undefined) {
                                        //   type.Child = []
                                        type.childs.forEach(function (vall: any) {
                                            vall.flag = false;
                                            if (vall.TeamLeaderUser != undefined) {
                                                vall.TeamLeaderUser.forEach(function (typee: any) {
                                                    if (typee.Title == select.Title) {
                                                        type.flag = true
                                                        typee.flag = true;
                                                        vall.flag = true;
                                                        item.flag = true;
                                                        //  type.Child.push(vall);
                                                        //  RootData.push(item)
                                                    }
                                                })


                                            }
                                            if (vall.childs !== undefined) {
                                                //  vall.Child = []
                                                vall.childs.forEach(function (user: any, index: any) {
                                                    user.flag = false;
                                                    if (user.TeamLeaderUser != undefined) {
                                                        user.TeamLeaderUser.forEach(function (tyrr: any) {
                                                            if (tyrr.Title == select.Title) {
                                                                user.flag = true
                                                                type.flag = true
                                                                vall.flag = true;
                                                                item.flag = true;
                                                            }
                                                        })
                                                    }


                                                })
                                            }


                                        })
                                    }

                                })

                            }

                        }
                        // if (select.TaxType == 'Sites') {

                        //     if (item.childs !== undefined) {
                        //         //item.Child = []
                        //         item.childs.forEach(function (type: any) {
                        //             if (select.Title == 'Foundation' && item.Title == 'Others') {
                        //                 select.childs.forEach(function (value: any) {
                        //                     if (type.siteType == value.Title) {
                        //                         item.show = true;
                        //                         item.Child.push(type);
                        //                         RootData.push(item);
                        //                     }
                        //                 })
                        //             }

                        //             if (select.Title != 'Foundation' && type.siteType == select.Title) {
                        //                 item.show = true;
                        //                 item.Child.push(type);
                        //                 RootData.push(item);
                        //             }




                        //             if (type.childs !== undefined) {
                        //                 //type.Child = []
                        //                 type.childs.forEach(function (vall: any) {
                        //                     if (select.Title == 'Foundation') {
                        //                         select.childs.forEach(function (value: any) {
                        //                             if (type.siteType == value.Title) {
                        //                                 type.show = true
                        //                                 type.Child.push(vall);
                        //                                 RootData.push(item);
                        //                             }
                        //                         })
                        //                     }

                        //                     if (select.Title != 'Foundation' && vall.siteType == select.Title) {
                        //                         type.show = true
                        //                         type.Child.push(vall);
                        //                         RootData.push(item)
                        //                     }




                        //                     if (vall.childs !== undefined) {
                        //                         // vall.Child = []
                        //                         vall.childs.forEach(function (user: any, index: any) {
                        //                             if (select.Title == 'Foundation') {
                        //                                 select.childs.forEach(function (value: any) {
                        //                                     if (type.siteType == value.Title) {
                        //                                         vall.show = true
                        //                                         vall.Child.push(vall);
                        //                                     }
                        //                                 })
                        //                             }

                        //                             if (select.Title != 'Foundation' && user.siteType == select.Title) {
                        //                                 vall.show = true
                        //                                 vall.Child.push(user)
                        //                             }

                        //                         })
                        //                     }


                        //                 })
                        //             }

                        //         })

                        //     }

                        // }
                        // if (select.TaxType == 'Priority') {

                        //     if (item.Priority_x0020_Rank
                        //         == select.Title) {
                        //         RootData.push(item);
                        //     }


                        //     if (item.childs !== undefined) {
                        //         item.childs.forEach(function (type: any) {

                        //             if (type.Priority_x0020_Rank == select.Title) {
                        //                 item.show = true;
                        //                 item.Child.push(type);
                        //                 RootData.push(item);
                        //             }


                        //             if (type.childs !== undefined) {
                        //                 type.childs.forEach(function (vall: any) {


                        //                     if (vall.Priority_x0020_Rank == select.Title) {
                        //                         type.show = true;
                        //                         type.Child.push(vall);
                        //                         RootData.push(item);
                        //                     }


                        //                     if (vall.childs !== undefined) {
                        //                         vall.childs.forEach(function (user: any, index: any) {


                        //                             if (user.Priority_x0020_Rank == select.Title) {
                        //                                 vall.show = true;
                        //                                 vall.Child.push(user);
                        //                                 RootData.push(item);
                        //                             }


                        //                         })
                        //                     }


                        //                 })
                        //             }

                        //         })
                        //     }



                        // }
                        // if (select.TaxType == 'Type') {

                        //     if (item.SharewebTaskType != undefined && item.SharewebTaskType.Title == select.Title) {
                        //         RootData.push(item);
                        //     }


                        //     if (item.childs !== undefined) {
                        //         item.childs.forEach(function (type: any) {

                        //             if (type.SharewebTaskType != undefined && type.SharewebTaskType.Title == select.Title) {
                        //                 item.show = true;
                        //                 item.Child.push(type);
                        //                 RootData.push(item);
                        //             }


                        //             if (type.childs !== undefined) {
                        //                 type.childs.forEach(function (vall: any) {


                        //                     if (vall.SharewebTaskType != undefined && vall.SharewebTaskType.Title == select.Title) {
                        //                         type.show = true;
                        //                         type.Child.push(vall);
                        //                         RootData.push(item);
                        //                     }


                        //                     if (vall.childs !== undefined) {
                        //                         vall.childs.forEach(function (user: any, index: any) {


                        //                             if (user.SharewebTaskType != undefined && user.SharewebTaskType.Title == select.Title) {
                        //                                 vall.show = true;
                        //                                 vall.Child.push(user);
                        //                                 RootData.push(item);
                        //                             }


                        //                         })
                        //                     }


                        //                 })
                        //             }

                        //         })
                        //     }



                        // }
                        // if (select.TaxType == 'Portfolio') {



                        //     if (item.childs !== undefined) {
                        //         item.childs.forEach(function (type: any) {

                        //             if (type.Item_x0020_Type != undefined && type.Item_x0020_Type == select.Title) {
                        //                 item.show = true;
                        //                 item.Child.push(type);
                        //                 RootData.push(item);
                        //             }


                        //             if (type.childs !== undefined) {
                        //                 type.childs.forEach(function (vall: any) {


                        //                     if (vall.Item_x0020_Type != undefined && vall.Item_x0020_Type == select.Title) {
                        //                         type.show = true;
                        //                         type.Child.push(vall);
                        //                         RootData.push(item);
                        //                     }




                        //                 })
                        //             }

                        //         })
                        //     }



                        // }
                    }

                })





            })
            // RootData.forEach(function (newItem: any) {
            //     newItem.childs = []
            //     if (newItem.Child != undefined) {
            //         newItem.Child.forEach(function (val: any) {
            //             newItem.childs.push(val)
            //             if (val.Child != undefined) {
            //                 val.Child.forEach(function (subVal: any) {
            //                     subVal.childs = []
            //                     if (subVal.Child != undefined) {
            //                         subVal.childs.push(subVal)
            //                     }
            //                 })

            //             }
            //         })

            //     }
            // })

        }

        // finalData = RootData.filter((val: any, id: any, array: any) => {
        //     return array.indexOf(val) == id;
        // })
        // finalData.forEach(function (com: any) {
        //     if (com.Item_x0020_Type == 'Component') {
        //         component.push(com)
        //     }
        //     if (com.childs != undefined && com.Title == 'Others') {
        //         com.childs.forEach((value: any) => {
        //             ALTask.push(value)
        //         })
        //     }
        //     if (com.childs != undefined) {
        //         com.childs.forEach(function (sub: any) {
        //             if (sub.Item_x0020_Type == 'SubComponent') {
        //                 subcomponent.push(com)
        //             }
        //             if (sub.childs != undefined) {
        //                 sub.childs.forEach(function (fea: any) {
        //                     if (fea.Item_x0020_Type == 'Feature') {
        //                         feature.push(com)
        //                     }
        //                 })
        //             }
        //         })


        //     }
        //     setTotalTask(ALTask)
        //     setSubComponentsData(subcomponent);
        //     setFeatureData(feature);
        //     setComponentsData(component);
        // })
        // if (state.length > 0)
        setData((data) => ([...all]));


    }


    const LoadAllSiteTasks = function () {

        var Response: any = []
        var Counter = 0;
        map(siteConfig, async (config: any) => {
            if (config.DataLoadNew) {
                let web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/SP');
                let AllTasksMatches = [];
                AllTasksMatches = await web.lists
                    .getById(config.listId)
                    .items
                    .select('ParentTask/Title', 'ParentTask/Id', 'Services/Title', 'ClientTime', 'Services/Id', 'Events/Id', 'Events/Title', 'ItemRank', 'Portfolio_x0020_Type', 'SiteCompositionSettings', 'SharewebTaskLevel1No',
                        'SharewebTaskLevel2No', 'TimeSpent', 'BasicImageInfo', 'OffshoreComments', 'OffshoreImageUrl', 'CompletedDate', 'Shareweb_x0020_ID',
                        'Responsible_x0020_Team/Id', 'Responsible_x0020_Team/Title', 'SharewebCategories/Id', 'SharewebCategories/Title', 'ParentTask/Shareweb_x0020_ID', 'SharewebTaskType/Id', 'SharewebTaskType/Title',
                        'SharewebTaskType/Level', 'Priority_x0020_Rank', 'Team_x0020_Members/Title', 'Team_x0020_Members/Name', 'Component/Id', 'Component/Title', 'Component/ItemType',
                        'Team_x0020_Members/Id', 'Item_x002d_Image', 'component_x0020_link', 'IsTodaysTask', 'AssignedTo/Title', 'AssignedTo/Name', 'AssignedTo/Id',
                        'ClientCategory/Id', 'ClientCategory/Title', 'FileLeafRef', 'FeedBack', 'Title', 'Id', 'PercentComplete', 'StartDate', 'DueDate', 'Comments', 'Categories', 'Status', 'Body',
                        'Mileage', 'PercentComplete', 'ClientCategory', 'Priority', 'Created', 'Modified', 'Author/Id', 'Author/Title', 'Editor/Id', 'Editor/Title'
                    )
                    .expand('ParentTask', 'Events', 'Services', 'SharewebTaskType', 'AssignedTo', 'Component', 'ClientCategory', 'Author', 'Editor', 'Team_x0020_Members', 'Responsible_x0020_Team', 'SharewebCategories')
                    .filter("Status ne 'Completed'")
                    .orderBy('orderby', false)
                    .getAll(4000);

                console.log(AllTasksMatches);
                Counter++;
                console.log(AllTasksMatches.length);
                if (AllTasksMatches != undefined && AllTasksMatches.length > 0) {
                    $.each(AllTasksMatches, function (index: any, item: any) {
                        item.isDrafted = false;
                        item.flag = true;
                        item.TitleNew = item.Title;
                        item.siteType = config.Title;
                        item.childs = [];
                        item.listId = config.listId;
                        item.siteUrl = 'https://hhhhteams.sharepoint.com/sites/HHHH/SP';
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
                            result.AllTeamName = result.AllTeamName === undefined ? '' : result.AllTeamName;
                            result.chekbox=false;
                            result.DueDate = Moment(result.DueDate).format('DD/MM/YYYY')

                            if (result.DueDate == 'Invalid date' || '') {
                                result.DueDate = result.DueDate.replaceAll("Invalid date", "")
                            }
                            result.PercentComplete = (result.PercentComplete * 100).toFixed(0);
                            result.chekbox=false;
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
                                                result.AllTeamName += users.Title + ';';
                                            }

                                        })
                                    }
                                })
                            }
                            if (result.Responsible_x0020_Team != undefined && result.Responsible_x0020_Team.length > 0) {
                                map(result.Responsible_x0020_Team, (Assig: any) => {
                                    if (Assig.Id != undefined) {
                                        map(TaskUsers, (users: any) => {

                                            if (Assig.Id != undefined && users.AssingedToUser != undefined && Assig.Id == users.AssingedToUser.Id) {
                                                users.ItemCover = users.Item_x0020_Cover;
                                                result.TeamLeaderUser.push(users);
                                                result.AllTeamName += users.Title + ';';
                                            }

                                        })
                                    }
                                })
                            }
                            if (result.Team_x0020_Members != undefined && result.Team_x0020_Members.length > 0) {
                                map(result.Team_x0020_Members, (Assig: any) => {
                                    if (Assig.Id != undefined) {
                                        map(TaskUsers, (users: any) => {
                                            if (Assig.Id != undefined && users.AssingedToUser != undefined && Assig.Id == users.AssingedToUser.Id) {
                                                users.ItemCover = users.Item_x0020_Cover;
                                                result.TeamLeaderUser.push(users);
                                                result.AllTeamName += users.Title + ';';
                                            }

                                        })
                                    }
                                })
                            }
                            result['SiteIcon'] = GetIconImageUrl(result.siteType, 'https://hhhhteams.sharepoint.com/sites/HHHH/SP', undefined);
                            if (result.ClientCategory != undefined && result.ClientCategory.length > 0) {
                                map(result.Team_x0020_Members, (catego: any) => {
                                    result.ClientCategory.push(catego);
                                })
                            }
                            if(result.Id ===1441)
                            console.log(result);
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
                        setAllTasks(CopyTaskData);
                        filterDataBasedOnList();
                    }
                }

            } else Counter++;

        })

    }
    const handleOpen2 = (item: any) => {
        item.show = item.showItem = item.show == true ? false : true;
        //item.showItem  = item.showItem == true ? false : true;
        setfilterItems(filterItems => ([...filterItems]));
    };
    const handleOpen = (item: any) => {
        item.show = item.show = item.show == true ? false : true;
        setData(data => ([...data]));
    };
    const handleOpenAll = () => {
        var Isshow1: any = Isshow == true ? false : true;
        map(data, (obj) => {
            obj.show = Isshow1;
            if (obj.childs != undefined && obj.childs.length > 0) {
                map(obj.childs, (subchild) => {
                    subchild.show = Isshow1;
                    if (subchild.childs != undefined && subchild.childs.length > 0) {
                        map(subchild.childs, (child) => {
                            child.show = Isshow1;
                        })

                    }
                })

            }

        })
        setIsshow(Isshow1);
        setData(data => ([...data]));
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
                getHighlightdata(item, val.toLowerCase());

            } else
                isSearchTermAvailable = false;
        })
        return isSearchTermAvailable;
    }
    var stringToArray = function (input: any) {
        if (input) {
            return input.match(/\S+/g);
        } else {
            return [];
        }
    };
    var getRegexPattern = function (keywordArray: any) {
        var pattern = "(^|\\b)(" + keywordArray.join("|") + ")";
        return new RegExp(pattern, "gi");
    };
    var getHighlightdata = function (item: any, searchTerms: any) {
        var keywordList = [];
        if (serachTitle != undefined && serachTitle != '') {
            keywordList = stringToArray(serachTitle);
        } else {
            keywordList = stringToArray(serachTitle);
        }
        var pattern: any = getRegexPattern(keywordList);
        //let Title :any =(...item.Title)
        item.TitleNew = item.Title;
        item.TitleNew = item.Title.replace(pattern, '<span class="highlighted">$2</span>');
        // item.Title = item.Title;
        keywordList = [];
        pattern = '';
    }
    var getSearchTermAvialable = function (searchTerms: any, item: any) {
        var isSearchTermAvailable = true;
        searchTerms.forEach((val: any) => {
            if (isSearchTermAvailable && (item.Title != undefined && item.Title.toLowerCase().indexOf(val.toLowerCase()) > -1)) {
                isSearchTermAvailable = true;
                getHighlightdata(item, searchTerms[0]);
            } else if (item.Synonyms != undefined && item.Synonyms != '') {
                let flag = false;
                item.Synonyms.forEach((Synonyms: any) => {
                    if (isSearchTermAvailable && (Synonyms.Title != undefined && Synonyms.Title.toLowerCase().indexOf(val.toLowerCase()) > -1)) {
                        isSearchTermAvailable = true;
                        getHighlightdata(item, searchTerms[0]);
                        flag = true;
                    }
                })
                if (flag == false)
                    isSearchTermAvailable = false;
            } else
                isSearchTermAvailable = false;
        })
        return isSearchTermAvailable;
    }
    let handleChange1 = (e: { target: { value: string; }; }, titleName: any) => {
        setSearch(e.target.value.toLowerCase());
        serachTitle = e.target.value.toLowerCase();
        var Title = titleName;

        var AllFilteredTagNews: any = [];
        var finalOthersData: any = []
        var ALllTAsk: any = []
        var childData: any = [];
        var subChild: any = [];
        var subChild2: any = [];
        AllFilteredTagNews.forEach(function (val: any) {
            val.Child = []
            if (val.childs != undefined) {
                val.childs.forEach(function (type: any) {
                    type.Child = []
                    if (type.childs != undefined) {
                        type.childs.forEach(function (value: any) {
                            value.Child = []
                            if (value.childs != undefined) {
                                value.childs.forEach(function (last: any) {
                                    last.Child = []

                                })
                            }
                        })
                    }
                })
            }
        })
        var filterglobal = e.target.value.toLowerCase();
        if (filterglobal != undefined && filterglobal.length >= 1) {
            var searchTerms = stringToArray(filterglobal);
            $.each(maidataBackup, function (pareIndex: any, item: any) {
                item.flag = false;
                item.isSearch = true;
                item.show = false;
                item.flag = (getSearchTermAvialable1(searchTerms, item, Title));
                if (item.flag == true) {
                    AllFilteredTagNews.push(item)
                }

                if (item.childs != undefined && item.childs.length > 0) {
                    $.each(item.childs, function (parentIndex: any, child1: any) {
                        child1.flag = false;
                        child1.isSearch = true;
                        child1.flag = (getSearchTermAvialable1(searchTerms, child1, Title));
                        if (child1.flag) {
                            item.childs[parentIndex].flag = true;
                            maidataBackup[pareIndex].flag = true;
                            item.childs[parentIndex].show = true;
                            maidataBackup[pareIndex].show = true;
                            if (!isItemExistsNew(AllFilteredTagNews, item)) {
                                AllFilteredTagNews.push(item)
                            }
                            childData.push(child1)
                            ALllTAsk.push(item)

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
                                    maidataBackup[pareIndex].flag = true;
                                    maidataBackup[pareIndex].show = true;
                                    if (!isItemExistsNew(AllFilteredTagNews, item)) {
                                        AllFilteredTagNews.push(item)
                                    }
                                    if (!isItemExistsNew(childData, child1))
                                        childData.push(child1)
                                    subChild.push(subchild)

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
                                            maidataBackup[pareIndex].flag = true;
                                            maidataBackup[pareIndex].show = true;
                                            if (!isItemExistsNew(AllFilteredTagNews, item)) {
                                                AllFilteredTagNews.push(item)
                                            }
                                            if (!isItemExistsNew(childData, child1))
                                                childData.push(child1)
                                            if (!isItemExistsNew(subChild, subChild))
                                                subChild.push(subChild)
                                            subChild2.push(subchilds)

                                        }
                                    })
                                }
                            })
                        }

                    })
                }

            })
        }

        // if (AllDataTaskk != undefined) {
        //     AllDataTaskk.forEach((newval: any) => {
        //         if (newval.Title == 'Others' && newval.childs != undefined) {
        //             newval.forEach((valllA: any) => {
        //                 finalOthersData.push(valllA)
        //             })
        //         }

        //     })
        // }

        //     setTotalTask(finalOthersData)
        //     setSubComponentsData(SData);
        //     setFeatureData(FData);
        //     setComponentsData(CData);
        // } 
        else {
            //  ungetFilterLength();
            // setData(data => ([...maidataBackup]));
            setData(maidataBackup);
            //setData(ComponentsData)= SharewebCommonFactoryService.ArrayCopy($scope.CopyData);
        }
        // setData(data => ([...maidataBackup]));
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
        let web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/SP');
        let taskUsers = [];
        taskUsers = await web.lists
            .getByTitle('Task Users')
            .items
            .select('Id', 'Email', 'Suffix', 'Title', 'Item_x0020_Cover', 'AssingedToUser/Title', 'AssingedToUser/Id', 'UserGroup/Id')
            // .filter("ItemType eq 'User'")
            .expand('AssingedToUser', 'UserGroup')
            .get();
        Response = taskUsers;
        TaskUsers = Response;
        setTaskUser(Response);
        // setTaskUser(Response);
        console.log(Response);

    }
    const GetSmartmetadata = async () => {
        var metadatItem: any = []
        let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
        let smartmetaDetails: any = [];
        smartmetaDetails = await web.lists
            //.getById('ec34b38f-0669-480a-910c-f84e92e58adf')
            .getById('01a34938-8c7e-4ea6-a003-cee649e8c67a')
            .items
            //.getById(this.state.itemID)
            .select('Id', 'Title', 'IsVisible', 'ParentID', 'SmartSuggestions', 'TaxType', 'Description1', 'Item_x005F_x0020_Cover', 'listId', 'siteName', 'siteUrl', 'SortOrder', 'SmartFilters', 'Selectable', 'Parent/Id', 'Parent/Title')
            .top(4999)
            // .filter("TaxType eq 'Categories'")
            .expand('Parent')
            .get()

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
        map(smartmetaDetails, (item) => {
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
        LoadAllSiteTasks();

        map(Response, (user: any) => {
            user.TaxType = 'Team Members';
            user.SmartFilters = {};
            user.SmartFilters = [];
            user.SmartFilters.push('Portfolio');
            if (user.UserGroup == undefined)
                user.ParentID = 0;
            if (user.UserGroup != undefined && user.UserGroup.Id != undefined)
                user.ParentID = user.UserGroup.Id;
            metadatItem.push(user);
        });
        map(metadatItem, (item) => {
            if (item.Title == 'Shareweb Old') {
                item.TaxType = 'Sites';
            }
        })

        map(metadatItem, (filterItem) => {
            if (filterItem.SmartFilters != undefined && filterItem.SmartFilters != undefined && filterItem.SmartFilters.indexOf('Portfolio') > -1) {
                var item: any = [];
                item.ID = item.Id = filterItem.Id;
                item.Title = filterItem.Title;
                item.Group = filterItem.TaxType;
                item.TaxType = filterItem.TaxType;
                if (item.Title == "Activities" || item.Title == "Workstream" || item.Title == "Task") {
                    item.Selected = true;
                }

                if (filterItem.ParentID == 0 || (filterItem.Parent != undefined && filterItem.Parent.Id == undefined)) {
                    if (item.TaxType == 'Team Members') {
                        getChildsBasedonId(item, Response);
                    } else {
                        getChildsBasedOn(item, smartmetaDetails);
                    }
                    filterItems.push(item);
                    if (filterItem.TaxType != "Type" && filterItem.TaxType != "Sites Old" && (filterGroups.length == 0 || filterGroups.indexOf(filterItem.TaxType) == -1)) {
                        filterGroups.push(filterItem.TaxType);

                    }

                    setFilterGroups(filterGroups)

                }

            }
        });
        var ArrayItem: any = [];


        filterItems.push({ "Group": "Portfolio", "TaxType": "Portfolio", "Title": "Component", "Selected": true, 'value': 1000, 'label': "Component", "childs": [] }, { "Group": "Portfolio", "TaxType": "Portfolio", "Title": "SubComponent", "Selected": true, 'value': 10000, 'label': "SubComponent", "childs": [] }, { "Group": "Portfolio", "TaxType": "Portfolio", "Title": "Feature", "Selected": true, 'value': 100000000, 'label': "Feature", "childs": [] }, { "Group": "Portfolio", "TaxType": "Portfolio", "Title": "Task", "Selected": true, 'value': 100000000, 'label': "Feature", "childs": [] });
        map(filterItems, (item) => {
            if (item.TaxType == "Sites" && item.Title == 'SDC Sites' || item.Title == 'Tasks') {
                item.Selected = true;
            }

        })
        setfilterItems(filterItems => ([...filterItems]));
        // setfilterItems(filterItems)
        ShowSelectedfiltersItems();
        setShowSelectdSmartfilter(ShowSelectdSmartfilter => ([...ArrayItem]));
        function getChildsBasedonId(item: { RightArrowIcon: string; downArrowIcon: string; childs: any[]; Id: any; }, items: any) {
            item.childs = [];
            map(metadatItem, (childItem) => {
                if (childItem.UserGroup != undefined && childItem.UserGroup.Id != undefined && childItem.UserGroup.Id == item.Id) {
                    childItem.value = childItem.Id;
                    childItem.label = childItem.Title;

                    item.downArrowIcon = IsUpdated != undefined && IsUpdated == 'Service Portfolio' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png';
                    item.RightArrowIcon = IsUpdated != undefined && IsUpdated == 'Service Portfolio' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png';
                    item.childs.push(childItem);
                    getChildsBasedonId(childItem, items);
                }
            });
        }
        function getChildsBasedOn(item: { RightArrowIcon: string; downArrowIcon: string; childs: any[]; ID: number; }, items: any) {
            item.childs = [];
            map(metadatItem, (childItem) => {
                if (childItem.Parent != undefined && childItem.Parent.Id != undefined && parseInt(childItem.Parent.Id) == item.ID) {
                    childItem.value = childItem.Id;
                    childItem.label = childItem.Title;
                    item.downArrowIcon = IsUpdated != undefined && IsUpdated == 'Service Portfolio' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png';
                    item.RightArrowIcon = IsUpdated != undefined && IsUpdated == 'Service Portfolio' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png';
                    item.childs.push(childItem);
                    getChildsBasedOn(childItem, items);
                }
            });
        }
    }
    var WebpartItem: any = [];
    const LoadSPComponents = async () => {
        var metadatItem: any = []
        let smartmetaDetails: any = [];
        var select: any = '=Title,Id,PageUrl,WebpartId,Component/Id,Component/Title,Service/Id,Service/Title&$expand=Component,Service&$top=4999'
        smartmetaDetails = await globalCommon.getData(GlobalConstants.ADMIN_SITE_URL, GlobalConstants.SPCOMPONENTS_LISTID, select);
        console.log(smartmetaDetails);
        WebpartItem = smartmetaDetails;

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
        let componentDetails = [];
        componentDetails = await web.lists
            .getById('ec34b38f-0669-480a-910c-f84e92e58adf')
            //.getByTitle('Master Tasks')
            .items
            //.getById(this.state.itemID)
            .select("ID", "Id", "Title", "Mileage", "TaskListId", "TaskListName", "WorkspaceType", "PortfolioLevel", "PortfolioStructureID", "PortfolioStructureID",
                "component_x0020_link", "Package", "Comments", "DueDate", "Sitestagging", "Body", "Deliverables", "SiteCompositionSettings", "StartDate",
                "Created", "Item_x0020_Type", "Help_x0020_Information", "Background", "Categories", "Short_x0020_Description_x0020_On", "TechnicalExplanations", "Idea", "ValueAdded",
                "CategoryItem", "Priority_x0020_Rank", "Priority", "TaskDueDate", "PercentComplete", "Modified", "CompletedDate", "ItemRank", "Portfolio_x0020_Type", 'Services/Title', 'ClientTime', 'Services/Id', 'Events/Id', 'Events/Title',
                "Parent/Id", "Parent/Title", "Component/Id", "Component/Title", "Component/ItemType", "Services/Id", "Services/Title", "Services/ItemType", "Events/Id", "Author/Title", 'Editor/Title',
                "Events/Title", "Events/ItemType", "SharewebCategories/Id", "SharewebTaskType/Title", "SharewebCategories/Title", "AssignedTo/Id", "AssignedTo/Title", "Team_x0020_Members/Id", "Team_x0020_Members/Title", "ClientCategory/Id", "ClientCategory/Title", 'Responsible_x0020_Team/Id', 'Responsible_x0020_Team/Title',
            )
            .expand('Parent', 'Events', 'Services', 'SharewebTaskType', 'AssignedTo', 'Component', 'ClientCategory', 'Author', 'Editor', 'Team_x0020_Members', 'Responsible_x0020_Team', 'SharewebCategories')
            .top(4999)
            .filter(filt)
            .get()

        console.log(componentDetails);
        componentDetails.forEach((result: any) => {
            result.AllTeamName = '';
            if (result.AssignedTo != undefined && result.AssignedTo.length > 0) {
                $.each(result.AssignedTo, function (index: any, Assig: any) {
                    if (Assig.Id != undefined) {
                        $.each(Response, function (index: any, users: any) {

                            if (Assig.Id != undefined && users.AssingedToUser != undefined && Assig.Id == users.AssingedToUser.Id) {
                                users.ItemCover = users.Item_x0020_Cover;
                                result.AllTeamName += users.Title + ';';
                            }

                        })
                    }
                })
            }
            if (result.Responsible_x0020_Team != undefined && result.Responsible_x0020_Team.length > 0) {
                map(result.Responsible_x0020_Team, (Assig: any) => {
                    if (Assig.Id != undefined) {
                        map(TaskUsers, (users: any) => {

                            if (Assig.Id != undefined && users.AssingedToUser != undefined && Assig.Id == users.AssingedToUser.Id) {
                                users.ItemCover = users.Item_x0020_Cover;
                                result.AllTeamName += users.Title + ';';
                            }

                        })
                    }
                })
            }
            if (result.Team_x0020_Members != undefined && result.Team_x0020_Members.length > 0) {
                $.each(result.Team_x0020_Members, function (index: any, Assig: any) {
                    if (Assig.Id != undefined) {
                        $.each(TaskUsers, function (index: any, users: any) {
                            if (Assig.Id != undefined && users.AssingedToUser != undefined && Assig.Id == users.AssingedToUser.Id) {
                                users.ItemCover = users.Item_x0020_Cover;
                                result.AllTeamName += users.Title + ';';
                            }

                        })
                    }
                })
            }
        })
        AllComponetsData = componentDetails;
        setAllMasterTasks(AllComponetsData);
        ComponetsData['allComponets'] = componentDetails;
    }

    if (IsUpdated == '') {
        setIsUpdated('Service Portfolio')
    } else if (IsUpdated != SelectedProp.SelectedProp) {
        setIsUpdated(SelectedProp.SelectedProp)
    }
    let props = undefined;
    //const [IsUpdated, setIsUpdated] = React.useState(SelectedProp.SelectedProp);
    React.useEffect(() => {
        showProgressBar();
        setmaidataBackup(maidataBackup => ([...[]]))
        setmaidataBackup(maidataBackup => ([...[]]))
        setData(data => ([...[]]));
        if (filterGroups != undefined && filterGroups.indexOf('Sites') === -1) {
            filterGroups.push("Portfolio");
            filterGroups.push("Sites");
            filterGroups.push("Type");
            filterGroups.push("Team Members");
            getTaskUsers();
            GetSmartmetadata();
        } else {
            map(filterItems, (filte) => {
                if (filte != undefined && filte.childs) {
                    filte.downArrowIcon = IsUpdated != undefined && IsUpdated == 'Service Portfolio' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png';
                    filte.RightArrowIcon = IsUpdated != undefined && IsUpdated == 'Service Portfolio' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png';
                }
            })
            LoadAllSiteTasks();

        }

        GetComponents();
    }, [IsUpdated])
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
        if (IsUpdated === 'Service Portfolio') {
            $.each(task['Services'], function (index: any, componentItem: any) {
                for (var i = 0; i < ComponetsData['allComponets'].length; i++) {
                    let crntItem = ComponetsData['allComponets'][i];
                    if (componentItem?.Id == crntItem?.Id) {
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
                            ComponetsData['allComponets'][i].downArrowIcon = IsUpdated != undefined && IsUpdated == 'Service Portfolio' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png';
                            ComponetsData['allComponets'][i].RightArrowIcon = IsUpdated != undefined && IsUpdated == 'Service Portfolio' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png';
                            ComponetsData['allComponets'][i]['childs'].push(task);
                            if (ComponetsData['allComponets'][i].Id === 413)
                                console.log(ComponetsData['allComponets'][i]['childs'].length)
                        }
                        break;
                    }
                }
            });
        }
        if (IsUpdated === 'Events Portfolio') {
            $.each(task['Events'], function (index: any, componentItem: any) {
                for (var i = 0; i < ComponetsData['allComponets'].length; i++) {
                    let crntItem = ComponetsData['allComponets'][i];
                    if (componentItem?.Id == crntItem?.Id) {
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
                        if (!isItemExistsNew(ComponetsData['allComponets'][i]['childs'], task)) {
                            ComponetsData['allComponets'][i].downArrowIcon = IsUpdated != undefined && IsUpdated == 'Events Portfolio' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png';
                            ComponetsData['allComponets'][i].RightArrowIcon = IsUpdated != undefined && IsUpdated == 'Events Portfolio' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png';

                            ComponetsData['allComponets'][i]['childs'].push(task);
                        }
                        break;
                    }
                }
            });
        }
        if (IsUpdated === 'Component Portfolio') {
            $.each(task['Component'], function (index: any, componentItem: any) {
                for (var i = 0; i < ComponetsData['allComponets'].length; i++) {
                    let crntItem = ComponetsData['allComponets'][i];
                    if (componentItem?.Id == crntItem?.Id) {
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
                        if (!isItemExistsNew(ComponetsData['allComponets'][i]['childs'], task)) {
                            ComponetsData['allComponets'][i].downArrowIcon = IsUpdated != undefined && IsUpdated == 'Component Portfolio' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png';
                            ComponetsData['allComponets'][i].RightArrowIcon = IsUpdated != undefined && IsUpdated == 'Component Portfolio' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png';

                            ComponetsData['allComponets'][i]['childs'].push(task);
                        }
                        break;
                    }
                }
            });
        }
    }
    //var pageType = 'Service-Portfolio';
    var ComponetsData: any = {};
    ComponetsData.allUntaggedTasks = []

    const DynamicSort = function (items: any, column: any) {
        items.sort(function (a: any, b: any) {
            // return   a[column] - b[column];
            var aID = a[column];
            var bID = b[column];
            return (aID == bID) ? 0 : (aID > bID) ? 1 : -1;
        })
    }
    const getWebpartId = function (Item: any) {
        WebpartItem.forEach((item: any) => {
            if (item.Component?.Id != undefined) {
                if (item.Component.Id === Item.Id) {
                    Item.WebpartItemId = item.Id;
                }
            }
            if (item.Service?.Id != undefined) {
                if (item.Service.Id === Item.Id) {
                    Item.WebpartItemId = item.Id;
                }
            }
        });
    }
    const bindData = function () {
        var RootComponentsData: any[] = [];

        $.each(ComponetsData['allComponets'], function (index: any, result: any) {
            result.show = false;
            result.checkBox = false;
            if (result.childs != undefined) {
                result.childs.forEach(function (i: any) {
                    i.show = []
                    i.checkBox = false;
                    if (i.childs != undefined) {
                        i.childs.forEach(function (subc: any) {
                            subc.show = []
                            subc.checkBox = false;
                            if (subc.childs != undefined) {
                                subc.childs.forEach(function (last: any) {
                                    last.show = []
                                    last.checkBox = false;
                                })
                            }
                        })

                    }
                })
            }
            result.TeamLeaderUser = result.TeamLeaderUser === undefined ? [] : result.TeamLeaderUser;
            result.Restructuring = IsUpdated != undefined && IsUpdated == 'Service Portfolio' ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png" : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png";
            result.AllTeamName = '';
            result.TitleNew = result.Title;
            getWebpartId(result);
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
            result['SiteIcon'] = GetIconImageUrl(result.siteType, 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/', undefined);
            if (result.AssignedTo != undefined && result.AssignedTo.length > 0) {
                $.each(result.AssignedTo, function (index: any, Assig: any) {
                    if (Assig.Id != undefined) {
                        $.each(Response, function (index: any, users: any) {

                            if (Assig.Id != undefined && users.AssingedToUser != undefined && Assig.Id == users.AssingedToUser.Id) {
                                users.ItemCover = users.Item_x0020_Cover;
                                result.TeamLeaderUser.push(users);
                                result.AllTeamName += users.Title + ';';
                            }

                        })
                    }
                })
            }
            if (result.Team_x0020_Members != undefined && result.Team_x0020_Members.length > 0) {
                $.each(result.Team_x0020_Members, function (index: any, Assig: any) {
                    if (Assig.Id != undefined) {
                        $.each(TaskUsers, function (index: any, users: any) {
                            if (Assig.Id != undefined && users.AssingedToUser != undefined && Assig.Id == users.AssingedToUser.Id) {
                                users.ItemCover = users.Item_x0020_Cover;
                                result.TeamLeaderUser.push(users);
                                result.AllTeamName += users.Title + ';';
                            }

                        })
                    }
                })
            }
            if (result.Responsible_x0020_Team != undefined && result.Responsible_x0020_Team.length > 0) {
                $.each(result.Responsible_x0020_Team, function (index: any, Assig: any) {
                    if (Assig.Id != undefined) {
                        $.each(TaskUsers, function (index: any, users: any) {
                            if (Assig.Id != undefined && users.AssingedToUser != undefined && Assig.Id == users.AssingedToUser.Id) {
                                users.ItemCover = users.Item_x0020_Cover;
                                result.TeamLeaderUser.push(users);
                                result.AllTeamName += users.Title + ';';
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
                result.SiteIcon = IsUpdated != undefined && IsUpdated == 'Service Portfolio' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/component_icon.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/component_icon.png';
                ComponentsData.push(result);


            }

            if (result.Item_x0020_Type == 'SubComponent') {
                result.SiteIcon = IsUpdated != undefined && IsUpdated == 'Service Portfolio' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/SubComponent_icon.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/SubComponent_icon.png'
                result['childs'] = result['childs'] != undefined ? result['childs'] : [];
                SubComponentsData.push(result);
                SubComponentsDataCopy.push(result);


            }
            if (result.Item_x0020_Type == 'Feature') {
                result.SiteIcon = IsUpdated != undefined && IsUpdated == 'Service Portfolio' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/feature_icon.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/feature_icon.png';
                result['childs'] = result['childs'] != undefined ? result['childs'] : [];
                FeatureData.push(result);
                FeatureDataCopy.push(result);
            }
            if (result.Title == 'Others') {
                //result['childs'] = result['childs'] != undefined ? result['childs'] : [];
                result.childsLength = result.childs.length;
                ComponentsData.push(result);
                ComponentsDataCopy.push(result)
            }
        });

        $.each(SubComponentsData, function (index: any, subcomp: any) {
            if (subcomp.Title != undefined) {
                $.each(FeatureData, function (index: any, featurecomp: any) {
                    if (featurecomp.Parent != undefined && subcomp.Id == featurecomp.Parent.Id) {
                        subcomp.downArrowIcon = IsUpdated != undefined && IsUpdated == 'Service Portfolio' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png';
                        subcomp.RightArrowIcon = IsUpdated != undefined && IsUpdated == 'Service Portfolio' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png';
                        subcomp.childsLength++;
                        subcomp['childs'].push(featurecomp);;
                    }
                })
                DynamicSort(subcomp.childs, 'PortfolioLevel');
            }
        })

        $.each(ComponentsData, function (index: any, subcomp: any) {
            if (subcomp.Title != undefined) {
                $.each(SubComponentsData, function (index: any, featurecomp: any) {
                    if (featurecomp.Parent != undefined && subcomp.Id == featurecomp.Parent.Id) {
                        // subcomp.downArrowIcon  = IsUpdated !=undefined && IsUpdated=='Service Portfolio' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png': 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png' ;
                        //  subcomp.RightArrowIcon = IsUpdated !=undefined && IsUpdated=='Service Portfolio' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png': 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png' ;
                        subcomp.downArrowIcon = IsUpdated != undefined && IsUpdated == 'Service Portfolio' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png';
                        subcomp.RightArrowIcon = IsUpdated != undefined && IsUpdated == 'Service Portfolio' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png';
                        subcomp.childsLength++;
                        subcomp['childs'].push(featurecomp);;
                    }
                })
                DynamicSort(subcomp.childs, 'PortfolioLevel')
            }
        })

        map(ComponentsData, (comp, index) => {
            if (comp.Title != undefined) {
                map(FeatureData, (featurecomp) => {
                    if (featurecomp.Parent != undefined && comp.Id === featurecomp.Parent.Id) {
                        comp.downArrowIcon = IsUpdated != undefined && IsUpdated == 'Service Portfolio' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png';
                        comp.RightArrowIcon = IsUpdated != undefined && IsUpdated == 'Service Portfolio' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png';
                        comp.childsLength++;
                        comp['childs'].push(featurecomp);;
                    }
                })
                DynamicSort(comp.childs, 'PortfolioLevel')
            }
        })

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
                    // }
                }
                // if (SubFeatures != undefined && SubFeatures.length > 0) {
                //     //  if (comp.childs != undefined && comp.childs.length > 0) {
                //           map(SubFeatures, (subcomp, index) => {
                //               if (subcomp.childs != undefined && subcomp.childs.length > 0) {
                //                   //var Subchildcomponnet = subcomp.childs.filter((sub: any) => (sub.Item_x0020_Type === 'Feature'));
                //                   var SubchildTasks = subcomp.childs.filter((sub: any) => (sub.Item_x0020_Type === 'Task'));
                //                   subcomp['childs'] =SubchildTasks;
                //                   // var SubchildTasks = subcomp.childs.filter((sub: any) => (sub.ItemType === 'SubComponnet'));
                //               }

                //           })
                //      // }
                //   }
            } else array.push(comp)
        })

        setSubComponentsData(SubComponentsData);
        setFeatureData(FeatureData);
        setComponentsData(array);
        setmaidataBackup(array)
        setTotalArrayBackup(array)
        setData(array);
        setAllCountItems({
            ...AllCountItems, AfterSearchComponentItems: array, AfterSearchSubComponentItems: SubComponentsData, AfterSearchFeaturesItems: FeatureData
            , AllComponentItems: array, AllSubComponentItems: SubComponentsData, AllFeaturesItems: FeatureData
        });
        showProgressHide();
    }

    var makeFinalgrouping = function () {
        var AllTaskData1: any = [];
        ComponetsData['allUntaggedTasks'] = [];
        var SelectedLevel: any = [];
        filterItems.forEach((item) => {
            if (item.Selected && (item.Title == "Activities" || item.Title == "Workstream" || item.Title == "Task")) {
                SelectedLevel.push(item);
            }
        })

        if (SelectedLevel.length > 0) {
            var AllTaggedTask: any = [];
            SelectedLevel.forEach((item: any) => {
                TasksItem.forEach((task: any) => {
                    if (task.SharewebTaskType != undefined && task.SharewebTaskType.Title != undefined && item.Title == task.SharewebTaskType.Title) {
                        AllTaggedTask.push(task);
                    }
                })
            })
            // AllTaskData1 = AllTaskData1.concat(TasksItem);
            setTaggedAllTask(AllTaggedTask)
            $.each(AllTaggedTask, function (index: any, task: any) {
                task.Portfolio_x0020_Type = 'Component';
                if (IsUpdated === 'Service Portfolio') {
                    if (task['Services'] != undefined && task['Services'].length > 0) {
                        task.Portfolio_x0020_Type = 'Service';
                        findTaggedComponents(task);
                    }
                    else if (task['Component'] != undefined && task['Component'].length === 0 && task['Events'] != undefined && task['Events'].length === 0) {
                        // if (task.SharewebTaskType != undefined && task.SharewebTaskType.Title && (task.SharewebTaskType.Title == "Activities" || task.SharewebTaskType.Title == "Workstream" || task.SharewebTaskType.Title == "Task"))
                        ComponetsData['allUntaggedTasks'].push(task);
                    }

                }
                if (IsUpdated === 'Events Portfolio') {
                    if (task['Events'] != undefined && task['Events'].length > 0) {
                        task.Portfolio_x0020_Type = 'Events';
                        findTaggedComponents(task);
                    }
                    else if (task['Component'] != undefined && task['Component'].length == 0 && task['Services'] != undefined && task['Services'].length == 0) {
                        // if (task.SharewebTaskType != undefined && task.SharewebTaskType.Title && (task.SharewebTaskType.Title == "Activities" || task.SharewebTaskType.Title == "Workstream" || task.SharewebTaskType.Title == "Task"))
                        ComponetsData['allUntaggedTasks'].push(task);
                    }

                }
                if (IsUpdated === 'Component Portfolio') {
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
        }
        var temp: any = {};
        temp.Title = 'Others';
        temp.TitleNew = 'Others';
        temp.childs = [];
        temp.childsLength = 0;
        temp.flag = true;
        temp.PercentComplete = '';
        temp.ItemRank = '';
        temp.DueDate = '';
        // ComponetsData['allComponets'][i]['childs']
        map(ComponetsData['allUntaggedTasks'], (task: any) => {
            if (task.Title != undefined) {
                temp.downArrowIcon = IsUpdated != undefined && IsUpdated == 'Service Portfolio' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png';
                temp.RightArrowIcon = IsUpdated != undefined && IsUpdated == 'Service Portfolio' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png';

                temp.childs.push(task);
            }
        })

        ComponetsData['allComponets'].push(temp);
        bindData();
    }
    const filterDataBasedOnList = function () {
        //$scope.AllTaskData = angular.copy($scope.CopyTaskData);
        //$scope.AllTaskData = JSON.parse(JSON.stringify($scope.CopyTas kData));

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
            if (config.Title == 'Foundation' || config.Title == 'SDC Sites') {
                config.show = true
                config.showItem = true
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

    // Expand Table 
    const expndpopup = (e: any) => {

        settablecontiner(e);
    };

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
    const Call = React.useCallback((childItem: any) => {
        MeetingItems?.forEach((val:any):any=>{
            val.chekBox =false;
        })
        closeTaskStatusUpdatePoup2();
        setIsComponent(false);; 
        setIsTask(false);
        setMeetingPopup(false);
        setWSPopup(false);
        var MainId: any = ''
        if (childItem != undefined) {
            childItem.data['flag'] = true;
            childItem.data['TitleNew'] = childItem.data.Title;
            childItem.data['SharewebTaskType'] = { Title: 'Activities' }
            if (childItem.data.ServicesId != undefined && childItem.data.ServicesId.length > 0) {
                MainId = childItem.data.ServicesId[0]
            }
            if (childItem.data.ComponentId != undefined && childItem.data.ComponentId.length > 0) {
                MainId = childItem.data.ComponentId[0]
            }
            
            if (array != undefined) {
                array.forEach((val: any) => {
                    val.flag = true;
                    val.show = false;
                    if (val.Id == MainId) {
                        val.childs.push(childItem.data)
                    }

                })
                setData(array => ([...array]))
                
            }

        }



    }, []);

    const TimeEntryCallBack = React.useCallback((item1) => {
        setIsTimeEntry(false);
    }, []);
    const EditComponentPopup = (item: any) => {
        item['siteUrl'] = 'https://hhhhteams.sharepoint.com/sites/HHHH/SP';
        item['listName'] = 'Master Tasks';
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
    const onChangeHandler = (itrm: any, child: any, e: any) => {
        var Arrays: any = []
       

        const { checked } = e.target;
        if (checked == true) {
            itrm.chekBox = true;
            if (itrm.SharewebTaskType == undefined) {
                setActivityDisable(false)
                itrm['siteUrl'] = 'https://hhhhteams.sharepoint.com/sites/HHHH/SP';
                itrm['listName'] = 'Master Tasks';
                MeetingItems.push(itrm)
                //setMeetingItems(itrm);

            }
            if (itrm.SharewebTaskType != undefined) {
                if (itrm.SharewebTaskType.Title == 'Activities' || itrm.SharewebTaskType.Title == "Workstream") {
                    setActivityDisable(false)
                    itrm['siteUrl'] = 'https://hhhhteams.sharepoint.com/sites/HHHH/SP';
                    itrm['listName'] = 'Master Tasks';
                    Arrays.push(itrm)
                    itrm['PortfolioId'] = child.Id;
                    childsData.push(itrm)
                }
            }
            if (itrm.SharewebTaskType != undefined) {
                if (itrm.SharewebTaskType.Title == 'Task') {
                    setActivityDisable(true)
                   
                }
            }
        }
        if (checked == false) {
            itrm.chekBox = false;
            MeetingItems?.forEach((val:any,index:any)=>{
                if(val.Id == itrm.Id){
                    MeetingItems.splice(index,1)
                }
            })
            if(MeetingItems.length == 0){
           setActivityDisable(true)
            }

            $('#ClientCategoryPopup').hide();
        }

        const list = [...checkedList];
        var flag = true;
        list.forEach((obj: any, index: any) => {
            if (obj.Id != undefined && itrm?.Id != undefined && obj.Id === itrm.Id) {
                flag = false;
                list.splice(index, 1);
            }
        })
        if (flag)
            list.push(itrm);
        maidataBackup.forEach((obj, index) => {
            obj.isRestructureActive = false;
            if (obj.childs != undefined && obj.childs.length > 0) {
                obj.childs.forEach((sub: any, indexsub: any) => {
                    sub.isRestructureActive = false;
                    if (sub.childs != undefined && sub.childs.length > 0) {
                        sub.childs.forEach((newsub: any, lastIndex: any) => {
                            newsub.isRestructureActive = false;

                        })
                    }

                })
            }

        })
        setData(data => ([...maidataBackup]));
        setCheckedList(checkedList => ([...list]));
    };
    function AddItem() {
    }
    const hideAllChildsMinus = (item: any) => {
        if (item?.childs?.length > 0) {
            item.Isexpend = false;
            if (item.Item_x0020_Type === "Component" || item.Item_x0020_Type === "SubComponent" || item.Item_x0020_Type === "Feature")
                item.show = false;
            handleOpen(item);
            item.childs.forEach((child: any) => {
                child.flag = child?.show == true ? child?.show : false;
                if (child.Title.toLowerCase().indexOf(search) > -1)
                    child.flag = true;
                child.Isexpend = false;
            })
            // if (flag)
            //     item.flag = flag;
        }
        setData(data => ([...data]));
    }

    const ShowAllChildsPlus = (item: any) => {
        if (item?.childs?.length > 0) {
            item.Isexpend = true;
            item.show = false;
            handleOpen(item);
            item.childs.forEach((child: any) => {
                child.flag = true;
                child.Isexpend = false;
            })
        }
        setData(data => ([...data]));
    }
    let isOpenPopup = false;
    const CloseCall = React.useCallback((item) => {
        if (!isOpenPopup && item.CreatedItem != undefined) {
            item.CreatedItem.forEach((obj: any) => {
                obj.data.childs = [];
                obj.data.flag = true;
                obj.data.TitleNew = obj.data.Title;
                // obj.data.Team_x0020_Members=item.TeamMembersIds;
                // obj.AssignedTo =item.AssignedIds;
                obj.data.siteType = "Master Tasks"
                if (obj.data.Item_x0020_Type != undefined && obj.data.Item_x0020_Type === 'Component')
                    obj.data.SiteIcon = obj.data.Portfolio_x0020_Type != undefined && obj.data.Portfolio_x0020_Type == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/component_icon.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/component_icon.png';

                if (obj.data.Item_x0020_Type != undefined && obj.data.Item_x0020_Type === 'SubComponent')
                    obj.data.SiteIcon = obj.data.Portfolio_x0020_Type != undefined && obj.data.Portfolio_x0020_Type == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/SubComponent_icon.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/SubComponent_icon.png'
                if (obj.data.Item_x0020_Type != undefined && obj.data.Item_x0020_Type === 'Feature')
                    obj.data.SiteIcon = obj.data.Portfolio_x0020_Type != undefined && obj.data.Portfolio_x0020_Type == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/feature_icon.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/feature_icon.png';
                obj.data['Shareweb_x0020_ID'] = obj.data.PortfolioStructureID;
                if (item.props != undefined && item.props.SelectedItem != undefined && item.props.SelectedItem.childs != undefined) {
                    item.props.SelectedItem.childs = item.props.SelectedItem.childs == undefined ? [] : item.props.SelectedItem.childs;
                    item.props.SelectedItem.childs.unshift(obj.data);
                }

            })
            if (ComponentsData != undefined && ComponentsData.length > 0) {

                ComponentsData.forEach((compnew: any, index: any) => {
                    if (compnew.childs != undefined && compnew.childs.length > 0) {
                        item.props.SelectedItem.downArrowIcon = compnew.downArrowIcon;
                        item.props.SelectedItem.RightArrowIcon = compnew.RightArrowIcon;
                        return false;
                    }
                })
                ComponentsData.forEach((comp: any, index: any) => {
                    // comp.downArrowIcon =comp.downArrowIcon;
                    if (comp.Id != undefined && item.props.SelectedItem != undefined && comp.Id === item.props.SelectedItem.Id) {
                        comp.childsLength = item.props.SelectedItem.childs.length;
                        comp.show = comp.show == undefined ? false : comp.show
                        comp.downArrowIcon = item.props.SelectedItem.downArrowIcon;
                        comp.RightArrowIcon = item.props.SelectedItem.RightArrowIcon;

                        comp.childs = item.props.SelectedItem.childs;
                    }
                    if (comp.childs != undefined && comp.childs.length > 0) {
                        comp.childs.forEach((subcomp: any, index: any) => {
                            if (subcomp.Id != undefined && item.props.SelectedItem != undefined && subcomp.Id === item.props.SelectedItem.Id) {
                                subcomp.childsLength = item.props.SelectedItem.childs.length;
                                subcomp.show = subcomp.show == undefined ? false : subcomp.show
                                subcomp.childs = item.props.SelectedItem.childs;
                                comp.downArrowIcon = item.props.SelectedItem.downArrowIcon;
                                comp.RightArrowIcon = item.props.SelectedItem.RightArrowIcon;
                            }
                        })
                    }

                })
                // }
            }
            setData((data) => [...ComponentsData]);
            if (item.CreateOpenType != undefined && item.CreateOpenType === 'CreatePopup') {
                setSharewebComponent(item.CreatedItem[0].data)
                setIsComponent(true);
            }
        }
        if (!isOpenPopup && item.data != undefined) {
            item.data.childs = [];
            item.data.flag = true;
            item.data.TitleNew = item.data.Title;
            item.data.siteType = "Master Tasks"
            item.data.childsLength = 0;
            if (item.data.Item_x0020_Type != undefined && item.data.Item_x0020_Type === 'Component')
                item.data.SiteIcon = item.data.Portfolio_x0020_Type != undefined && item.data.Portfolio_x0020_Type == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/component_icon.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/component_icon.png';

            if (item.data.Item_x0020_Type != undefined && item.data.Item_x0020_Type === 'SubComponent')
                item.data.SiteIcon = item.data.Portfolio_x0020_Type != undefined && item.data.Portfolio_x0020_Type == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/SubComponent_icon.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/SubComponent_icon.png'
            if (item.data.Item_x0020_Type != undefined && item.data.Item_x0020_Type === 'Feature')
                item.data.SiteIcon = item.data.Portfolio_x0020_Type != undefined && item.data.Portfolio_x0020_Type == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/feature_icon.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/feature_icon.png';

            // item.data['SiteIcon'] = GetIconImageUrl(item.data.siteType, 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/', undefined);
            item.data['Shareweb_x0020_ID'] = item.data.PortfolioStructureID;

            // if (checkedList != undefined && checkedList.length > 0)
            //     checkedList[0].childs.unshift(item.data);
            // else 
            ComponentsData.unshift(item.data);
            setData((data) => [...ComponentsData]);
        }
        setAddModalOpen(false)
    }, []);

    const CreateOpenCall = React.useCallback((item) => {
        isOpenPopup = true;
        item.data.childs = [];
        item.data.flag = true;
        item.data.siteType = "Master Tasks"
        item.data.TitleNew = item.data.Title;
        item.data.childsLength = 0;
        if (item.data.Item_x0020_Type != undefined && item.data.Item_x0020_Type === 'Component')
            item.data.SiteIcon = item.data.Portfolio_x0020_Type != undefined && item.data.Portfolio_x0020_Type == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/component_icon.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/component_icon.png';

        if (item.data.Item_x0020_Type != undefined && item.data.Item_x0020_Type === 'SubComponent')
            item.data.SiteIcon = item.data.Portfolio_x0020_Type != undefined && item.data.Portfolio_x0020_Type == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/SubComponent_icon.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/SubComponent_icon.png'
        if (item.data.Item_x0020_Type != undefined && item.data.Item_x0020_Type === 'Feature')
            item.data.SiteIcon = item.data.Portfolio_x0020_Type != undefined && item.data.Portfolio_x0020_Type == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/feature_icon.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/feature_icon.png';
        item.data['Shareweb_x0020_ID'] = item.data.PortfolioStructureID;
        if (checkedList != undefined && checkedList.length > 0)
            checkedList[0].childs.unshift(item.data);
        else ComponentsData.unshift(item.data);

        setSharewebComponent(item.data)
        setIsComponent(true);
        setData((data) => [...ComponentsData]);
        // setSharewebComponent(item);
    }, []);
    const buttonRestructuring = () => {
        var ArrayTest: any = [];
        //  if (checkedList != undefined && checkedList.length === 1) {
        if (checkedList.length > 0 && checkedList[0].childs != undefined && checkedList[0].childs.length > 0 && checkedList[0].Item_x0020_Type === 'Component')
            alert('You are not allowed to Restructure this item.')
        if (checkedList.length > 0 && checkedList[0].childs != undefined && checkedList[0].childs.length === 0 && checkedList[0].Item_x0020_Type === 'Component') {

            maidataBackup.forEach((obj) => {
                obj.isRestructureActive = true;
                if (obj.childs != undefined && obj.childs.length > 0) {
                    obj.childs.forEach((sub: any) => {
                        if (sub.Item_x0020_Type === 'SubComponent') {
                            sub.isRestructureActive = true;
                            // ArrayTest.push(sub)
                        }

                    })
                }
            })
        }
        if (checkedList.length > 0 && checkedList[0].Item_x0020_Type === 'SubComponent') {
            maidataBackup.forEach((obj) => {
                obj.isRestructureActive = true;
                if (obj.childs != undefined && obj.childs.length > 0) {
                    obj.childs.forEach((sub: any) => {
                        if (sub.Id === checkedList[0].Id) {
                            ArrayTest.push(...[obj])
                            ArrayTest.push(...[sub])
                            // ArrayTest.push(sub)
                        }

                    })
                }


            })
        }
        if (checkedList.length > 0 && checkedList[0].Item_x0020_Type === 'Feature') {
            maidataBackup.forEach((obj) => {
                obj.isRestructureActive = true;
                if (obj.childs != undefined && obj.childs.length > 0) {
                    obj.childs.forEach((sub: any) => {
                        sub.isRestructureActive = true;
                        if (sub.Id === checkedList[0].Id) {
                            ArrayTest.push(...[obj]);
                            ArrayTest.push(...[sub]);
                        }
                        if (sub.childs != undefined && sub.childs.length > 0) {
                            sub.childs.forEach((newsub: any) => {
                                if (newsub.Id === checkedList[0].Id) {
                                    ArrayTest.push(...[obj]);
                                    ArrayTest.push(...[sub]);
                                    ArrayTest.push(...[newsub]);
                                }


                            })
                        }

                    })
                }

            })
        }
        else if (checkedList.length > 0 && checkedList[0].Item_x0020_Type === 'Task') {
            maidataBackup.forEach((obj) => {
                obj.isRestructureActive = true;
                if (obj.Id === checkedList[0].Id) {
                    ArrayTest.push(...[obj])
                }
                if (obj.childs != undefined && obj.childs.length > 0) {
                    obj.childs.forEach((sub: any) => {
                        if (sub.Item_x0020_Type === 'SubComponent')
                            sub.isRestructureActive = true;
                        if (sub.Id === checkedList[0].Id) {
                            ArrayTest.push(...[obj])
                            ArrayTest.push(...[sub])
                            // ArrayTest.push(sub)
                        }
                        if (sub.childs != undefined && sub.childs.length > 0) {
                            sub.childs.forEach((subchild: any) => {
                                if (subchild.Item_x0020_Type === 'SubComponent')
                                    subchild.isRestructureActive = true;
                                if (subchild.Id === checkedList[0].Id) {
                                    ArrayTest.push(...[obj])
                                    ArrayTest.push(...[sub])
                                    ArrayTest.push(...[subchild])
                                    // ArrayTest.push(sub)
                                }
                                if (subchild.childs != undefined && subchild.childs.length > 0) {
                                    subchild.childs.forEach((listsubchild: any) => {
                                        if (listsubchild.Id === checkedList[0].Id) {
                                            ArrayTest.push(...[obj])
                                            ArrayTest.push(...[sub])
                                            ArrayTest.push(...[subchild])
                                            ArrayTest.push(...[listsubchild])
                                        }

                                    })
                                }

                            })
                        }

                    })
                }


            })
        }
        setOldArrayBackup(ArrayTest)
        setData((data) => [...maidataBackup]);

        //  }
        // setAddModalOpen(true)
    }
    const RestruringCloseCall = () => {
        setResturuningOpen(false)
    };
    const OpenModal = (item: any) => {
        var TestArray: any = [];
        setResturuningOpen(true);
        maidataBackup.forEach((obj) => {
            if (obj.Id === item.Id)
                TestArray.push(obj)
            if (obj.childs != undefined && obj.childs.length > 0) {
                obj.childs.forEach((sub: any) => {
                    sub.isRestructureActive = true;
                    if (sub.Id === item.Id) {
                        //TestArray.push(obj)
                        TestArray.push(...[obj]);
                        TestArray.push(...[sub])
                    }
                    if (sub.childs != undefined && sub.childs.length > 0) {
                        sub.childs.forEach((newsub: any) => {
                            if (newsub.Id === item.Id) {
                                TestArray.push(...[obj])
                                TestArray.push(...[sub])
                                TestArray.push(...[newsub])
                            }

                        })
                    }

                })
            }

        })
        setChengedItemTitle(checkedList[0].Item_x0020_Type);
        ChengedTitle = (checkedList[0].Item_x0020_Type === 'Feature' ? 'SubComponent' : (checkedList[0].Item_x0020_Type === 'SubComponent' ? 'Component' : checkedList[0].Item_x0020_Type));
        let Items: any = []; Items.push(OldArrayBackup[OldArrayBackup.length - 1]);
        setRestructureChecked(Items);
        setNewArrayBackup(NewArrayBackup => ([...TestArray]));

    }

    const setRestructure = (item: any, title: any) => {
        let array: any = [];
        item.Item_x0020_Type = title;
        if (item != undefined && title === 'SubComponent') {
            item.SiteIcon = IsUpdated != undefined && IsUpdated == 'Service Portfolio' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/SubComponent_icon.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/SubComponent_icon.png'

            ChengedTitle = 'Component';

        }
        if (item != undefined && title === 'Feature') {
            item.SiteIcon = IsUpdated != undefined && IsUpdated == 'Service Portfolio' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/feature_icon.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/feature_icon.png';
            ChengedTitle = 'SubComponent';

        }
        setChengedItemTitle(title);
        array.push(item)
        setRestructureChecked((RestructureChecked: any) => [...array]);
        maidataBackup.forEach((obj) => {
            if (obj.Id === item.Id) {
                PortfolioLevelNum = obj.childs.length + 1;
            }
            if (obj.childs != undefined && obj.childs.length > 0) {
                obj.childs.forEach((sub: any) => {
                    if (sub.Id === item.Id) {
                        PortfolioLevelNum = sub.childs.length + 1;
                    }
                    if (sub.childs != undefined && sub.childs.length > 0) {
                        sub.childs.forEach((newsub: any) => {
                            if (newsub.Id === item.Id) {
                                PortfolioLevelNum = newsub.childs.length + 1;
                            }

                        })
                    }

                })
            }

        })
        // setRestructureChecked(item);
    }
    let changetoTaxType: any = ''
    const UpdateTaskRestructure = async function () {
        var Ids: any = [];
        if (NewArrayBackup != undefined && NewArrayBackup.length > 0) {
            NewArrayBackup.forEach((obj, index) => {
                if ((NewArrayBackup.length - 1) === index)
                    Ids.push(obj.Id);
            })

        }

        let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
        await web.lists.getById(checkedList[0].listId).items.getById(checkedList[0].Id).update({
            // EventsId: checkedList[0].Portfolio_x0020_Type === 'Event' ? { "results": Ids } : [],
            //    '__metadata': { 'type': 'SP.Data.'+checkedList[0].siteType+'ListItem' },
            ComponentId: (checkedList[0].Portfolio_x0020_Type === 'Component') ? { "results": Ids } : { "results": [] },
            ServicesId: (checkedList[0].Portfolio_x0020_Type === 'Service') ? { "results": Ids } : { "results": [] },
        }).then((res: any) => {
            maidataBackup.forEach((obj, index) => {
                obj.isRestructureActive = false;
                if (obj.Id === checkedList[0].Id) {
                    if (obj.childs.length === 0) {
                        obj.downArrowIcon = '';
                        obj.RightArrowIcon = '';
                    }
                }
                if (obj.childs != undefined && obj.childs.length > 0) {
                    obj.childs.forEach((sub: any, indexsub: any) => {
                        sub.isRestructureActive = false;
                        if (sub.Id === checkedList[0].Id) {
                            obj.childs.splice(indexsub, 1)
                            if (sub.childs.length === 0) {
                                sub.downArrowIcon = '';
                                sub.RightArrowIcon = '';
                            }

                        }
                        if (sub.childs != undefined && sub.childs.length > 0) {
                            sub.childs.forEach((newsub: any, lastIndex: any) => {
                                newsub.isRestructureActive = false;
                                if (newsub.Id === checkedList[0].Id) {
                                    sub.childs.splice(lastIndex, 1)
                                    if (newsub.childs.length === 0) {
                                        newsub.downArrowIcon = '';
                                        newsub.RightArrowIcon = '';
                                    }
                                }

                            })
                        }

                    })
                }

            })
            maidataBackup.forEach((obj, index) => {
                if (obj.Id === Ids[0]) {
                    obj.flag = true;
                    obj.show = true;
                    obj.downArrowIcon = obj.Portfolio_x0020_Type == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png';
                    obj.RightArrowIcon = obj.Portfolio_x0020_Type == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png';

                    obj.childs.push(checkedList[0]);
                    obj.childsLength = obj.childs.length;
                }
                if (obj.childs != undefined && obj.childs.length > 0) {
                    obj.childs.forEach((sub: any, indexsub: any) => {
                        sub.isRestructureActive = false;
                        if (sub.Id === Ids[0]) {
                            sub.flag = true;
                            sub.show = true;
                            sub.downArrowIcon = sub.Portfolio_x0020_Type == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png';
                            sub.RightArrowIcon = sub.Portfolio_x0020_Type == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png';

                            sub.childs.push(checkedList[0]);
                            sub.childsLength = sub.childs.length
                        }
                        if (sub.childs != undefined && sub.childs.length > 0) {
                            sub.childs.forEach((newsub: any, lastIndex: any) => {
                                if (newsub.Id === Ids[0]) {
                                    newsub.flag = true;
                                    newsub.show = true;
                                    newsub.downArrowIcon = newsub.Portfolio_x0020_Type == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png';
                                    newsub.RightArrowIcon = newsub.Portfolio_x0020_Type == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png';

                                    newsub.childs.push(checkedList[0]);
                                    newsub.childsLength = newsub.childs.length



                                }

                            })
                        }

                    })
                }

            })
            setData(data => ([...maidataBackup]));
            RestruringCloseCall()
        })
    }
    const UpdateRestructure = async function () {
        let PortfolioStructureIDs: any = ''
        var Item: any = ''
        let flag: any = false;
        let ChengedItemTitle: any = '';
        // if (ChengedItemTitle === '' && RestructureChecked != undefined && RestructureChecked.length > 0 && RestructureChecked[0].Item_x0020_Type == 'Component') {
        //     ChengedItemTitle = RestructureChecked[0].Item_x0020_Type;
        // }
        if (RestructureChecked != undefined && RestructureChecked.length > 0 && RestructureChecked[0].Item_x0020_Type == 'Feature') {
            ChengedItemTitle = RestructureChecked[0].Item_x0020_Type;
        }
        else if (RestructureChecked != undefined && RestructureChecked.length > 0 && RestructureChecked[0].Item_x0020_Type == 'SubComponent') {
            ChengedItemTitle = RestructureChecked[0].Item_x0020_Type;
        }
        // else if (ChengedItemTitl !== '' && RestructureChecked != undefined && RestructureChecked.length > 0 && RestructureChecked[0].Item_x0020_Type == 'Feature') {
        //     ChengedItemTitle = 'SubComponent';
        //     flag = true;
        // }
        // else if (ChengedItemTitle !== '' && RestructureChecked != undefined && RestructureChecked.length > 0 && RestructureChecked[0].Item_x0020_Type == 'SubComponent') {
        //     ChengedItemTitle = 'Component';
        //     flag = true;
        // }
        let count: any = 0;
        let newItem: any = '';
        if (NewArrayBackup.length === 1)
            newItem = NewArrayBackup[0];
        else {
            // if (flag) {
            NewArrayBackup.forEach((newe: any) => {
                if (ChengedTitle != '' && newe.Item_x0020_Type === ChengedTitle)
                    newItem = newe;
                else if (newe.Item_x0020_Type === ChengedItemTitle)
                    newItem = newe;
            })
            // }
            // if (!flag) {
            //     NewArrayBackup.forEach((newe1: any) => {
            //         if (newe1.Item_x0020_Type !== ChengedItemTitle)
            //             newItem = newe1;
            //     })
            // }

        }
        maidataBackup.forEach((obj) => {
            if (obj.Id === newItem.Id) {
                PortfolioLevelNum = obj.childs.length + 1;
            }
            if (obj.childs != undefined && obj.childs.length > 0) {
                obj.childs.forEach((sub: any) => {
                    if (sub.Id === newItem.Id) {
                        obj.childs.forEach((leng: any) => {
                            if (leng.Item_x0020_Type === newItem.Item_x0020_Type)
                                count++
                        })
                        PortfolioLevelNum = count + 1;
                    }
                    if (sub.childs != undefined && sub.childs.length > 0) {
                        sub.childs.forEach((newsub: any) => {
                            if (newsub.Id === newItem.Id) {
                                sub.childs.forEach((subleng: any) => {
                                    if (subleng.Item_x0020_Type === newItem.Item_x0020_Type)
                                        count++
                                })
                                PortfolioLevelNum = count + 1;
                            }

                        })
                    }

                })
            }

        })
        if (NewArrayBackup != undefined && NewArrayBackup.length > 0) {
            NewArrayBackup.forEach((newobj: any) => {
                if (ChengedTitle != '' && newobj.Item_x0020_Type === ChengedTitle)
                    Item = newobj;
                else if (ChengedTitle === '' && ChengedItemTitle === newobj.Item_x0020_Type)
                    Item = newobj;
            })

        }
        if (Item === "")
            Item = NewArrayBackup[0];
        if (Item !== undefined && Item.PortfolioStructureID != undefined && ChengedItemTitle != undefined) {
            PortfolioStructureIDs = Item.PortfolioStructureID + '-' + ChengedItemTitle.slice(0, 1) + PortfolioLevelNum;
            // if (Item != undefined)
            //     PortfolioStructureIDs = Item.PortfolioStructureID + '-' + ChengedItemTitle.slice(0, 1) + PortfolioLevelNum;
        }

        var UploadImage: any = [];

        var item: any = {};
        if (ChengedItemTitl === undefined) {
            let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
            await web.lists
                .getById("ec34b38f-0669-480a-910c-f84e92e58adf")
                .items.getById(checkedList[0].Id)
                .update({
                    ParentId: Item.Id,
                    PortfolioLevel: (PortfolioLevelNum),
                    PortfolioStructureID: PortfolioStructureIDs
                }
                )
                .then((res: any) => {
                    if (ChengedItemTitl === undefined) {
                        checkedList[0].Shareweb_x0020_ID = PortfolioStructureIDs;
                        checkedList[0].PortfolioStructureID = PortfolioStructureIDs;
                        checkedList[0].PortfolioLevel = PortfolioLevelNum;
                        if (Item.childs != undefined) {
                            Item.childs.push(checkedList[0]);
                        } else {
                            Item.childs = [];
                            Item.childs.push(checkedList[0]);
                        }
                    }
                    console.log(res);
                    setData(data => ([...maidataBackup]));
                    RestruringCloseCall()
                    //setModalIsOpenToFalse();
                });
        }
        if (ChengedItemTitl != undefined && ChengedItemTitl != "") {
            let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
            await web.lists
                .getById("ec34b38f-0669-480a-910c-f84e92e58adf")
                .items.getById(checkedList[0].Id)
                .update({
                    ParentId: Item.Id,
                    PortfolioLevel: (PortfolioLevelNum),
                    PortfolioStructureID: PortfolioStructureIDs,
                    Item_x0020_Type: ChengedItemTitl

                }
                )
                .then((res: any) => {
                    console.log(res);
                    maidataBackup.forEach((obj, index) => {
                        obj.isRestructureActive = false;
                        if (obj.Id === checkedList[0].Id) {
                            //  maidataBackup[index].childs.splice(index, 1)
                            checkedList[0].downArrowIcon = obj.downArrowIcon;;
                            checkedList[0].RightArrowIcon = obj.RightArrowIcon;
                        }
                        if (obj.childs != undefined && obj.childs.length > 0) {
                            obj.childs.forEach((sub: any, indexsub: any) => {
                                sub.isRestructureActive = false;
                                if (sub.Id === checkedList[0].Id) {
                                    obj.childs.splice(indexsub, 1)
                                    checkedList[0].downArrowIcon = obj.downArrowIcon;;
                                    checkedList[0].RightArrowIcon = obj.RightArrowIcon;
                                }
                                if (sub.childs != undefined && sub.childs.length > 0) {
                                    sub.childs.forEach((newsub: any, lastIndex: any) => {
                                        newsub.isRestructureActive = false;
                                        if (newsub.Id === checkedList[0].Id) {
                                            sub.childs.splice(lastIndex, 1)

                                            checkedList[0].downArrowIcon = obj.downArrowIcon;;
                                            checkedList[0].RightArrowIcon = obj.RightArrowIcon;
                                        }

                                    })
                                }

                            })
                        }

                    })
                    checkedList[0].PortfolioStructureID = PortfolioStructureIDs;
                    checkedList[0].Shareweb_x0020_ID = PortfolioStructureIDs;
                    checkedList[0].PortfolioLevel = PortfolioLevelNum;
                    checkedList[0].IsNew = true;
                    checkedList[0].Item_x0020_Type = ChengedItemTitl;
                    if (Item.childs != undefined) {
                        checkedList[0].downArrowIcon = Item.Portfolio_x0020_Type == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png';
                        checkedList[0].RightArrowIcon = Item.Portfolio_x0020_Type == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png';

                        Item.childs.push(checkedList[0]);
                    } else {
                        Item.childs = [];
                        Item.show = true;
                        Item.downArrowIcon = checkedList[0].downArrowIcon
                        Item.RightArrowIcon = checkedList[0].RightArrowIcon;
                        // Item.show = Item.show == undefined ? false : Item.show
                        // Item.downArrowIcon = item.props.SelectedItem.downArrowIcon;
                        // Item.RightArrowIcon = item.props.SelectedItem.RightArrowIcon;
                        Item.childs.push(checkedList[0]);
                    }
                    setCheckedList(checkedList => ([...[]]));
                    setData(data => ([...maidataBackup]));
                    RestruringCloseCall()

                });
        }
        // setResturuningOpen(true)
    }
    var PortfolioLevelNum: any = 0;
    // const getPortfolioItemID = async function () {
    //     // var defer = $q.defer();
    //     var filter = ""
    //     if (RestructureChecked != undefined && RestructureChecked.length > 0 && RestructureChecked[0].Id != undefined) {
    //         filter = "Id eq '" + RestructureChecked[0].Parent.Id + "' and Item_x0020_Type eq '" + (ChengedItemTitle != '' ? ChengedItemTitle : changetoTaxType) + "'" //" and Parent/Id eq " + RestructureChecked[0].Id;
    //     }
    //     if (ChengedItemTitle === 'SubComponent')
    //         filter = "Id eq '" + NewArrayBackup[0].Parent.Id + "' and Item_x0020_Type eq '" + (ChengedItemTitle != '' ? ChengedItemTitle : changetoTaxType) + "'"// " and Parent/Id eq " + NewArrayBackup[0].Id;
    //  let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
    //     let results = await web.lists
    //         .getById("ec34b38f-0669-480a-910c-f84e92e58adf")
    //         .items
    //         .select("Id", "Title", "PortfolioLevel", "PortfolioStructureID", "Parent/Id")
    //         .expand("Parent")
    //         .filter(filter)
    //         .orderBy("PortfolioLevel", false)
    //         .top(1)
    //         .get()
    //     if (results.length > 0) {
    //         PortfolioLevelNum = results[0].PortfolioLevel + 1;
    //     } else {
    //         PortfolioLevelNum = 1;
    //     }
    // }
    const onRenderCustomHeaderMain = () => {
        return (
            <div className="d-flex full-width pb-1" >
                <div style={{ marginRight: "auto", fontSize: "20px", fontWeight: "600", marginLeft: '20px' }}>
                    <span>
                        {`Create Activity ${MeetingItems[0]?.Title}`}
                    </span>
                </div>
                <Tooltip ComponentId={MeetingItems[0]?.Id} />
            </div>
        );
    };
    return (
        <div id="ExandTableIds" className={IsUpdated == 'Events Portfolio' ? 'app component clearfix eventpannelorange' : (IsUpdated == 'Service Portfolio' ? 'app component clearfix serviepannelgreena' : 'app component clearfix')}>

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
                                            <div className="col-sm-4 mb-10 p-0" title="Task Name">
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
                                            <div className="col-sm-6 p-0">
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
                                                    <div className="col-sm-11 p-0 Doc-align">
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


            <section className="ContentSection">
                <div className="col-sm-12 clearfix">
                    <h2 className="d-flex justify-content-between align-items-center siteColor  serviceColor_Active">
                        {(IsUpdated != undefined && IsUpdated.toLowerCase().indexOf('service') > -1) && <div>Service Portfolio</div>}
                        {(IsUpdated != undefined && IsUpdated.toLowerCase().indexOf('service') > -1) && <div className='text-end fs-6'><a data-interception="off" target="_blank" className="hreflink serviceColor_Active" href={"https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Service-Portfolio-Old.aspx"} >Old Service Portfolio</a></div>}
                        {(IsUpdated != undefined && IsUpdated.toLowerCase().indexOf('event') > -1) && <div>Event Portfolio</div>}
                        {(IsUpdated != undefined && IsUpdated.toLowerCase().indexOf('event') > -1) && <div className='text-end fs-6'><a data-interception="off" target="_blank" className="hreflink serviceColor_Active" href={"https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Event-Portfolio-Old.aspx"} >Old Event Portfolio</a></div>}
                        {(IsUpdated != undefined && IsUpdated.toLowerCase().indexOf('component') > -1) && <div>Component Portfolio</div>}
                        {(IsUpdated != undefined && IsUpdated.toLowerCase().indexOf('component') > -1) && <div className='text-end fs-6'><a data-interception="off" target="_blank" className="hreflink serviceColor_Active" href={"https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Component-Portfolio-Old.aspx"} >Old Component Portfolio</a></div>}
                    </h2>
                </div>
                <div className="bg-wihite border p-2">
                    <div className="togglebox">
                        <label className="toggler full_width mb-10">
                            <span className=" siteColor" onClick={() => setIsSmartfilter(IsSmartfilter === true ? false : true)}>
                                {/* <img className="hreflink wid22"
                                    src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Filter-12-WF.png" /> */}
                                {/* <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 48 48" fill="currentColor">
                                    <path d="M36 11H11V15.0625L20.6774 23.1875V32.9375L27.129 37V23.1875L36 15.0625V11Z" stroke="#333333" stroke-width="0" />
                                </svg> */}
                                {(IsUpdated != undefined && IsUpdated.toLowerCase().indexOf('service') > -1) && <img className="hreflink wid22"
                                    src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Filter-12-WF.png" />}
                                {(IsUpdated != undefined && IsUpdated.toLowerCase().indexOf('event') > -1) && <img className="hreflink wid22"
                                    src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Event_Icons/Filter-12-WF.png" />}
                                {(IsUpdated != undefined && IsUpdated.toLowerCase().indexOf('component') > -1) && <img className="hreflink wid22"
                                    src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Filter-12-WF.png" />}
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
                            <span className="pull-right bg-color">
                                {(IsUpdated != undefined && IsUpdated.toLowerCase().indexOf('service') > -1) &&
                                    <span>  <img className="icon-sites-img  wid22 ml5"
                                        title="Share SmartFilters selection" onClick={() => setIsSmartfilter(IsSmartfilter === true ? false : true)}
                                        src={IsSmartfilter === true ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/newsub_icon.png" : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Add-New.png"} />
                                        <img className="icon-sites-img  wid22 ml5"
                                            title="Share SmartFilters selection"
                                            src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Icon_Share_Green.png" />


                                    </span>

                                }
                                {((IsUpdated != undefined && IsUpdated.toLowerCase().indexOf('component') > -1) || IsUpdated != undefined && IsUpdated.toLowerCase().indexOf('event') > -1) &&
                                    <span>
                                        <img className="icon-sites-img  wid22 ml5"
                                            title="Share SmartFilters selection" onClick={() => setIsSmartfilter(IsSmartfilter === true ? false : true)}
                                            src={IsSmartfilter === true ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/newsub_icon.png" : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Add-New.png"} />
                                        <img className="icon-sites-img  wid22 ml5"
                                            title="Share SmartFilters selection" ng-click="GenerateUrl()"
                                            src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Icon_Share_Blue.png" />

                                    </span>}
                            </span>
                            <span className="pull-right siteColor">
                                <span className="hreflink" ng-if="!smartfilter2.expanded">
                                    <img ng-show="pagesType=='componentportfolio'" className="hreflink wid22"
                                        ng-src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Add-New.png" />
                                </span>
                            </span>
                        </label>
                        {IsSmartfilter ?
                            <div className="togglecontent mt-1">
                                <table width="100%" className="indicator_search">
                                    <tr>
                                        {filterGroups.map(function (item) {
                                            return (
                                                <>

                                                    <td valign="top">
                                                        <fieldset>
                                                            {item != 'teamSites' && <legend><span className="mparent">{item}</span></legend>}
                                                            {item == 'teamSites' && <legend><span className="mparent">Sites</span></legend>}
                                                        </fieldset>
                                                        {filterItems.map(function (ItemType, index) {
                                                            return (

                                                                <>
                                                                    {ItemType.Group == item &&
                                                                        <div style={{ display: "block" }}>
                                                                            <>

                                                                                {ItemType.TaxType != 'Status' &&

                                                                                    <div className="align-items-center d-flex">
                                                                                        <span className="hreflink me-1 GByicon" onClick={() => handleOpen2(ItemType)}>
                                                                                            {ItemType.childs.length > 0 &&
                                                                                                <a title="Tap to expand the childs">
                                                                                                    {ItemType.showItem ? <img src={ItemType.downArrowIcon} />
                                                                                                        : <img src={ItemType.RightArrowIcon} />}

                                                                                                </a>}
                                                                                        </span>
                                                                                        <input className="form-check-input me-1" defaultChecked={ItemType.Selected == true} type="checkbox" value={ItemType.Title} onChange={(e) => SingleLookDatatest(e, ItemType, index)} />
                                                                                        <label className="form-check-label">
                                                                                            {ItemType.Title}
                                                                                        </label>
                                                                                    </div>
                                                                                }
                                                                                {ItemType.TaxType == 'Status' &&

                                                                                    <div className="align-items-center d-flex">
                                                                                        <input className="form-check-input me-1" defaultChecked={ItemType.Selected == true} type="checkbox" value={ItemType.Title} onChange={(e) => SingleLookDatatest(e, ItemType, index)} />
                                                                                        <label className="form-check-label">
                                                                                            {ItemType.Title}
                                                                                        </label>
                                                                                    </div>
                                                                                }
                                                                                <ul id="id_{ItemType.Id}"
                                                                                    className="m-0 ps-3 pe-2">
                                                                                    <span>
                                                                                        {ItemType.show && (
                                                                                            <>
                                                                                                {ItemType.childs.map(function (child1: any, index: any) {
                                                                                                    return (
                                                                                                        <>

                                                                                                            <div className="align-items-center d-flex">
                                                                                                                {child1.childs.length > 0 && !child1.expanded &&
                                                                                                                    <span className="hreflink me-1 GByicon"  >
                                                                                                                        <img
                                                                                                                            src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png" />
                                                                                                                    </span>
                                                                                                                }
                                                                                                                {child1.childs.length > 0 && child1.expanded &&
                                                                                                                    <span className="hreflink me-1 GByicon"  >
                                                                                                                        <img
                                                                                                                            src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png" />
                                                                                                                    </span>
                                                                                                                }
                                                                                                                <input type="checkbox" defaultChecked={child1.Selected == true} className="form-check-input me-1" onChange={(e) => SingleLookDatatest(e, child1, index)} />
                                                                                                                <label className="form-check-label">
                                                                                                                    {child1.Title}
                                                                                                                </label>
                                                                                                                <ul id="id_{{child1.Id}}" style={{ display: "none" }} className="m-0 ps-3 pe-2">
                                                                                                                    {child1.childs.map(function (child2: any) {
                                                                                                                        <li>
                                                                                                                            <div className="align-items-center d-flex">
                                                                                                                                <input className="form-check-input me-1" type="checkbox" defaultChecked={child1.Selected == true} ng-model="child2.Selected" onChange={(e) => SingleLookDatatest(e, child1, index)} />
                                                                                                                                <label className="form-check-label">
                                                                                                                                    {child2.Title}
                                                                                                                                </label>
                                                                                                                            </div>
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
                                    </tr>
                                </table>
                                <div className="text-end mt-3">
                                    <button type="button" className="btn btn-primary"
                                        title="Smart Filter" onClick={() => Updateitem()}>
                                        Update Filters
                                    </button>
                                    <button type="button" className="btn btn-grey ms-2" title="Clear All"
                                        onClick={() => Clearitem()} >
                                        Clear Filters
                                    </button>
                                </div>

                            </div>
                            : ''}

                    </div>
                </div>
            </section>

            <section className="TableContentSection taskprofilepagegreen" id={tablecontiner}>
                <div className="container-fluid">
                    <section className="TableSection">
                        <div className="container p-0">
                            <div className="Alltable mt-2">
                                <div className="tbl-headings">
                                    <span className="leftsec">
                                        <label>
                                            Showing {AllCountItems.AfterSearchComponentItems.length} of {AllCountItems.AllComponentItems.length} Components
                                        </label>
                                        <label className="ms-1 me-1"> | </label>
                                        <label>
                                            {AllCountItems.AfterSearchSubComponentItems.length} of {AllCountItems.AllSubComponentItems.length} SubComponents
                                        </label>
                                        <label className="ms-1 me-1"> | </label>
                                        <label>
                                            {AllCountItems.AfterSearchFeaturesItems.length} of {AllCountItems.AllFeaturesItems.length} Features
                                        </label>
                                        {/* <span className="g-search">
                                            <input type="text" className="searchbox_height full_width" id="globalSearch" placeholder="search all" />
                                            <span className="gsearch-btn" ><i><FaSearch /></i></span>
                                        </span> */}
                                        {/* <span>
                                            <select className="ml2 searchbox_height">
                                                <option value="All Words">All Words</option>
                                                <option value="Any Words">Any Words</option>
                                                <option value="Exact Phrase">Exact Phrase</option>
                                            </select>
                                        </span> */}
                                    </span>
                                    <span className="toolbox mx-auto">
                                        {checkedList != undefined && checkedList.length > 0 && checkedList[0].Item_x0020_Type === 'Feature' ?
                                            <button type="button" disabled={true} className="btn btn-primary" onClick={addModal} title=" Add Structure">
                                                Add Structure
                                            </button>
                                            : <button type="button" disabled={checkedList.length >= 2} className="btn btn-primary" onClick={addModal} title=" Add Structure">
                                                Add Structure
                                            </button>}

                                        <button type="button"
                                            className="btn btn-primary"
                                            onClick={() => openActivity()}
                                            disabled={ActivityDisable}>

                                            <MdAdd />
                                            Add Activity-Task
                                        </button>

                                        <button type="button"
                                            className="btn btn-primary"
                                            onClick={buttonRestructuring}
                                        >

                                            <MdAdd />
                                            Restructure
                                        </button>




                                        <a className="brush" onClick={clearSearch}>
                                            <FaPaintBrush />
                                        </a>

                                        <a onClick={Prints} className='Prints'>
                                            <FaPrint />
                                        </a>

                                        <CSVLink className="excal" data={getCsvData()} >
                                            <FaFileExcel />
                                        </CSVLink>
                                        <a className='expand'>
                                            <ExpndTable prop={expndpopup} prop1={tablecontiner} />
                                        </a>
                                    </span>
                                </div>
                                <div className="col-sm-12 p-0 smart">
                                    <div className="section-event">
                                        <div className="wrapper">
                                            <table className="table table-hover" id="EmpTable" style={{ width: "100%" }}>
                                                <thead>
                                                    <tr>
                                                        <th style={{ width: "2%" }}>
                                                            <div className="smart-relative sign hreflink" onClick={() => handleOpenAll()} >{Isshow ? <img src={(IsUpdated != undefined && IsUpdated.toLowerCase().indexOf('service') > -1) ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png" : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png'} />
                                                                : <img src={(IsUpdated != undefined && IsUpdated.toLowerCase().indexOf('service') > -1) ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png" : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png"} />}
                                                            </div>
                                                        </th>
                                                        <th style={{ width: "2%" }}>
                                                            <div className="smart-relative sign hreflink">
                                                                <span className='pe-2'><input type="checkbox" /></span>
                                                            </div>

                                                        </th>

                                                        <th style={{ width: "9%" }}>
                                                            <div style={{ width: "8%" }} className="smart-relative">
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
                                                        <th style={{ width: "17%" }}>
                                                            <div style={{ width: "16%" }} className="smart-relative">
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
                                                        <th style={{ width: "17%" }}>
                                                            <div style={{ width: "16%" }} className="smart-relative">
                                                                <input id="searchClientCategory" type="search" placeholder="Team"
                                                                    title="Team members" className="full_width searchbox_height"
                                                                // onChange={event => handleChange(event, 'Team')} 
                                                                />
                                                                <span className="sorticon">
                                                                    <span className="up" onClick={sortBy}>< FaAngleUp /></span>
                                                                    <span className="down" onClick={sortByDng}>< FaAngleDown /></span>
                                                                </span>

                                                            </div>
                                                        </th>
                                                        <th style={{ width: "6%" }}>
                                                            <div style={{ width: "5%" }} className="smart-relative">
                                                                <input id="searchClientCategory" type="search" placeholder="Status"
                                                                    title="Status" className="full_width searchbox_height"
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
                                                        <th style={{ width: "2%" }}></th>
                                                        <th style={{ width: "2%" }}></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <div id="SpfxProgressbar" className="align-items-center" style={{ display: "none" }}>
                                                        <img id="sharewebprogressbar-image" src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/loading_apple.gif" alt="Loading..." />
                                                    </div>
                                                    {data.length > 0 && data && data.map(function (item, index) {
                                                        if (item.flag == true) {
                                                            return (
                                                                <>
                                                                    <tr >
                                                                        <td className="p-0" colSpan={12}>
                                                                            <table className="table m-0" style={{ width: "100%" }}>
                                                                                <tr className="bold for-c0l">

                                                                                    <td style={{ width: "2%" }}>
                                                                                        <div className="accordian-header" >
                                                                                            {item.childs != undefined &&
                                                                                                <a className='hreflink'
                                                                                                    title="Tap to expand the childs">
                                                                                                    <div onClick={() => handleOpen(item)} className="sign">{item.childs.length > 0 && item.show ? <img src={item.downArrowIcon} />
                                                                                                        : <img src={item.RightArrowIcon} />}
                                                                                                    </div>
                                                                                                </a>
                                                                                            }
                                                                                        </div>

                                                                                    </td>
                                                                                    <td style={{ width: "2%" }}>
                                                                                        <div className="accordian-header" >
                                                                                            {/* checked={item.checked === true ? true : false} */}
                                                                                            <span className='pe-2'><input type="checkbox" checked={item.chekBox}
                                                                                                onChange={(e) => onChangeHandler(item, 'Parent', e)} /></span>
                                                                                        </div>

                                                                                    </td>


                                                                                    <td style={{ width: "9%" }}>
                                                                                        <div className="">
                                                                                            <span>
                                                                                                {item.SiteIcon != undefined && <a className="hreflink" title="Show All Child" data-toggle="modal">
                                                                                                    <img className="icon-sites-img ml20 me-1" src={item.SiteIcon}></img>
                                                                                                    {/* <img className="icon-sites-img"
                                                                                                        src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/component_icon.png" /> */}
                                                                                                </a>
                                                                                                }
                                                                                            </span>
                                                                                            {search != undefined && search != '' && item.childs?.length > 0 ?
                                                                                                <>
                                                                                                    {item?.Isexpend ?
                                                                                                        <span>
                                                                                                            <a className="hreflink" title="Show All Child" data-toggle="modal" onClick={() => hideAllChildsMinus(item)}>
                                                                                                                <img className="icon-sites-img me-1 ml20" src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Minus-Gray.png"></img>
                                                                                                            </a>
                                                                                                        </span>
                                                                                                        : ''}
                                                                                                    {!item?.Isexpend ?
                                                                                                        <span>
                                                                                                            <a className="hreflink" title="Show All Child" data-toggle="modal" onClick={() => ShowAllChildsPlus(item)}>
                                                                                                                <img className="icon-sites-img me-1 ml20" src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Add-New-Grey.png"></img>
                                                                                                            </a>
                                                                                                        </span>
                                                                                                        : ''}
                                                                                                </> : ''}
                                                                                            <span>{item.Shareweb_x0020_ID}</span>
                                                                                        </div>
                                                                                    </td>
                                                                                    {/* <td style={{ width: "6%" }}></td> */}
                                                                                    <td style={{ width: "20%" }}>
                                                                                        {item.siteType == "Master Tasks" && item.Title !== 'Others' && <a data-interception="off" target="_blank" className="hreflink serviceColor_Active"
                                                                                            href={"https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=" + item.Id}
                                                                                        >
                                                                                            <span dangerouslySetInnerHTML={{ __html: item.TitleNew }}></span>
                                                                                            {/* {item.Title} */}
                                                                                        </a>}
                                                                                        {item.siteType != "Master Tasks" && item.Title !== 'Others' &&
                                                                                        <a data-interception="off" target="_blank" className="hreflink serviceColor_Active" onClick={(e) => EditData(e, item)}
                                                                                            href={"https://hhhhteams.sharepoint.com/sites/HHHH/{item.siteType}/SP/SitePages/Task-Profile.aspx?taskId=" + item.Id + '&Site=' + item.siteType }
                                                                                        >
                                                                                           
                                                                                            <span dangerouslySetInnerHTML={{ __html: item.TitleNew }}></span>
                                                                                          

                                                                                        </a>}
                                                                                        {item.Title === 'Others' &&
                                                                                        <span dangerouslySetInnerHTML={{ __html: item.TitleNew }}></span>}
                                                                                        {item.childs != undefined &&
                                                                                            <span className='ms-1'>({item.childsLength})</span>
                                                                                        }

                                                                                        {item.Short_x0020_Description_x0020_On != null &&
                                                                                            <div className='popover__wrapper ms-1' data-bs-toggle="tooltip" data-bs-placement="auto">
                                                                                                <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/infoIcon.png" />

                                                                                                <div className="popover__content">
                                                                                                    {item.Short_x0020_Description_x0020_On}
                                                                                                </div>
                                                                                            </div>
                                                                                        }
                                                                                    </td>
                                                                                    <td style={{ width: "17%" }}>
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
                                                                                    <td style={{ width: "17%" }}>
                                                                                        <div>
                                                                                            <ShowTaskTeamMembers props={item} TaskUsers={AllUsers}></ShowTaskTeamMembers>

                                                                                        </div></td>
                                                                                    <td style={{ width: "6%" }}>{item.PercentComplete}</td>
                                                                                    <td style={{ width: "10%" }}>{item.ItemRank}</td>
                                                                                    <td style={{ width: "10%" }}>{item.DueDate}</td>
                                                                                    <td style={{ width: "3%" }}></td>
                                                                                    <td style={{ width: "2%" }}> </td>
                                                                                    <td style={{ width: "2%" }}>{item.siteType === "Master Tasks" && item.Title !== 'Others' && <a href="#" data-bs-toggle="tooltip" data-bs-placement="auto" title="Edit"><img src={require('../../../Assets/ICON/edit_page.svg')} width="25" onClick={(e) => EditComponentPopup(item)} /></a>}
                                                                                        {item.siteType != "Master Tasks" && item.Title !== 'Others' && <a href="#" data-bs-toggle="tooltip" data-bs-placement="auto" title="Edit"><img src={require('../../../Assets/ICON/edit_page.svg')} width="25" onClick={(e) => EditComponentPopup(item)} /></a>}</td>
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
                                                                                                <td className="p-0" colSpan={12}>
                                                                                                    <table className="table m-0" style={{ width: "100%" }}>
                                                                                                        <tr className="for-c02">
                                                                                                            <td style={{ width: "2%" }}>
                                                                                                                <div className="accordian-header" onClick={() => handleOpen(childitem)}>
                                                                                                                    {(childitem.childs != undefined && childitem.childs?.length > 0) &&
                                                                                                                        <a className='hreflink'
                                                                                                                            title="Tap to expand the childs">
                                                                                                                            <div className="sign">{(childitem.childs != undefined && childitem.childs?.length > 0) && childitem.show ? <img src={childitem.downArrowIcon} />
                                                                                                                                : <img src={childitem.RightArrowIcon} />}
                                                                                                                            </div>
                                                                                                                        </a>
                                                                                                                    }

                                                                                                                </div>
                                                                                                            </td>
                                                                                                            <td style={{ width: "2%" }}>
                                                                                                               
                                                                                                            
                                                                                                                <div className="accordian-header">

                                                                                                                    <span className='pe-2'><input type="checkbox" checked={childitem.chekBox}
                                                                                                                        onChange={(e) => onChangeHandler(childitem, item, e)} /></span>
                                                                                                                </div>
                                                                                

                                                                                                            </td>
                                                                                                            {/* <td style={{ width: "2%" }}></td> */}
                                                                                                            <td style={{ width: "9%" }}>  <div className="d-flex">
                                                                                                                <span>

                                                                                                                    <a className="hreflink" title="Show All Child" data-toggle="modal">
                                                                                                                        <img className="icon-sites-img me-1 ml20" src={childitem.SiteIcon}></img>
                                                                                                                        {/* <img className="icon-sites-img"
                                                                                                                        src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/SubComponent_icon.png" /> */}
                                                                                                                    </a>

                                                                                                                </span>
                                                                                                                {search != undefined && search != '' && childitem.childs?.length > 0 ?
                                                                                                                    <>
                                                                                                                        {childitem?.Isexpend ?
                                                                                                                            <span>
                                                                                                                                <a className="hreflink" title="Show All Child" data-toggle="modal" onClick={() => hideAllChildsMinus(childitem)}>
                                                                                                                                    <img className="icon-sites-img me-1 ml20" src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Minus-Gray.png"></img>
                                                                                                                                </a>
                                                                                                                            </span>
                                                                                                                            : ''}
                                                                                                                        {!childitem?.Isexpend ?
                                                                                                                            <span>
                                                                                                                                <a className="hreflink" title="Show All Child" data-toggle="modal" onClick={() => ShowAllChildsPlus(childitem)}>
                                                                                                                                    <img className="icon-sites-img me-1 ml20" src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Add-New-Grey.png"></img>
                                                                                                                                </a>
                                                                                                                            </span>
                                                                                                                            : ''}
                                                                                                                    </> : ''}
                                                                                                                <span className="ml-2">{childitem.Shareweb_x0020_ID}</span>
                                                                                                            </div>
                                                                                                            </td>

                                                                                                            <td style={{ width: "20%" }}>
                                                                                                                {childitem.siteType == "Master Tasks" && <a data-interception="off" target="_blank" className="hreflink serviceColor_Active"
                                                                                                                    href={"https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=" + childitem.Id }
                                                                                                                ><span dangerouslySetInnerHTML={{ __html: childitem.TitleNew }}></span>
                                                                                                                </a>}
                                                                                                                {childitem.siteType != "Master Tasks" && <a data-interception="off" target="_blank" className="hreflink serviceColor_Active"
                                                                                                                    href={"https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Task-Profile.aspx?taskId=" + childitem.Id + '&Site=' + childitem.siteType }
                                                                                                                ><span dangerouslySetInnerHTML={{ __html: childitem.TitleNew }}></span>
                                                                                                                </a>}
                                                                                                                {(childitem.childs != undefined && childitem.childs.length > 0) && childitem.Item_x0020_Type == 'Feature' &&
                                                                                                                    <span className='ms-1'>  ({childitem.childs.length})</span>
                                                                                                                }
                                                                                                                {(childitem.childs != undefined && childitem.childs.length > 0) && childitem.Item_x0020_Type != 'Feature' &&
                                                                                                                    <span className='ms-1'>  ({childitem.childsLength})</span>
                                                                                                                }

                                                                                                                {childitem.Short_x0020_Description_x0020_On != null &&

                                                                                                                    <div className='popover__wrapper ms-1'>
                                                                                                                        <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/infoIcon.png" />
                                                                                                                        {/* <span className="tooltipte">
                                                                                                                        <span className="tooltiptext">
                                                                                                                            <div className="tooltip_Desc">
                                                                                                                                <span> {childitem.Short_x0020_Description_x0020_On}</span>
                                                                                                                            </div>
                                                                                                                        </span>
                                                                                                                    </span> */}
                                                                                                                        <div className="popover__content">
                                                                                                                            {childitem.Short_x0020_Description_x0020_On}
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                }
                                                                                                            </td>
                                                                                                            <td style={{ width: "17%" }}>
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
                                                                                                            <td style={{ width: "17%" }}>
                                                                                                                <ShowTaskTeamMembers props={childitem} TaskUsers={AllUsers}></ShowTaskTeamMembers></td>
                                                                                                            <td style={{ width: "6%" }}>{childitem.PercentComplete}</td>
                                                                                                            <td style={{ width: "10%" }}>{childitem.ItemRank}</td>
                                                                                                            <td style={{ width: "10%" }}>{childitem.DueDate}</td>

                                                                                                            <td style={{ width: "3%" }}>{childitem.siteType != "Master Tasks" && <a onClick={(e) => EditData(e, childitem)} data-bs-toggle="tooltip" data-bs-placement="auto" title="Click To Edit Timesheet"><img style={{ width: "22px" }} src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/clock-gray.png"></img></a>}</td>
                                                                                                            <td style={{ width: "2%" }}>{childitem.siteType === "Master Tasks" && childitem.isRestructureActive && <a href="#" data-bs-toggle="tooltip" data-bs-placement="auto" title="Edit"><img className='icon-sites-img' src={childitem.Restructuring} onClick={(e) => OpenModal(childitem)} /></a>}</td>
                                                                                                            <td style={{ width: "2%" }}><a data-bs-toggle="tooltip" data-bs-placement="auto" title="Edit">
                                                                                                                {childitem.siteType == "Master Tasks" &&
                                                                                                                    <img src={require('../../../Assets/ICON/edit_page.svg')} width="25" onClick={(e) => EditComponentPopup(childitem)} />}
                                                                                                                {childitem.siteType != "Master Tasks" && <img data-bs-toggle="tooltip" data-bs-placement="auto" title="Edit" src={require('../../../Assets/ICON/edit_page.svg')} width="25" onClick={(e) => EditItemTaskPopup(childitem)} />}</a></td>
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
                                                                                                                        <td className="p-0" colSpan={12}>
                                                                                                                            <table className="table m-0" style={{ width: "100%" }}>
                                                                                                                                <tr className="tdrow">
                                                                                                                                    
                                                                                                                                        <td style={{ width: "2%" }}>
                                                                                                                                            {childinew.childs.length > 0 &&
                                                                                                                                                <div className="accordian-header" onClick={() => handleOpen(childinew)}>
                                                                                                                                                    <a className='hreflink'
                                                                                                                                                        title="Tap to expand the childs">
                                                                                                                                                        <div className="sign">{childinew.childs.length > 0 && childinew.show ? <img src={childinew.downArrowIcon} />
                                                                                                                                                            : <img src={childinew.RightArrowIcon} />}
                                                                                                                                                        </div>
                                                                                                                                                    </a>

                                                                                                                                                </div>
                                                                                                                                            }
                                                                                                                                        </td>
                                                                                                                                   
                                                                                                                                    <td style={{ width: "2%" }}>
                                                                                                                                       
                                                                                                                                            
                                                                                                                                                  <div className="accordian-header" >
                                                                                                                                        
                                                                                                                                            <span className='pe-2'><input type="checkbox"  checked={childinew.chekBox}
                                                                                                                                                onChange={(e) => onChangeHandler(childinew, item, e)} /></span>
                                                                                                                                           
                                                                                                                                        </div>
                                                                                                                                         

                                                                                                                                    </td>

                                                                                                                                    <td style={{ width: "9%" }}> <div className="d-flex">
                                                                                                                                        <span>

                                                                                                                                            <a className="hreflink" title="Show All Child" data-toggle="modal">
                                                                                                                                                <img className="icon-sites-img me-1 ml20" src={childinew.SiteIcon}></img>
                                                                                                                                                {/* <img  className="icon-sites-img" 
                                                                                                                                        src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/feature_icon.png" /> */}
                                                                                                                                            </a>
                                                                                                                                        </span>
                                                                                                                                        {search != undefined && search != '' && childinew.childs?.length > 0 ?
                                                                                                                                            <>
                                                                                                                                                {childinew?.Isexpend ?
                                                                                                                                                    <span>
                                                                                                                                                        <a className="hreflink" title="Show All Child" data-toggle="modal" onClick={() => hideAllChildsMinus(childinew)}>
                                                                                                                                                            <img className="icon-sites-img me-1 ml20" src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Minus-Gray.png"></img>
                                                                                                                                                        </a>
                                                                                                                                                    </span>
                                                                                                                                                    : ''}
                                                                                                                                                {!childinew?.Isexpend ?
                                                                                                                                                    <span>
                                                                                                                                                        <a className="hreflink" title="Show All Child" data-toggle="modal" onClick={() => ShowAllChildsPlus(childinew)}>
                                                                                                                                                            <img className="icon-sites-img me-1 ml20" src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Add-New-Grey.png"></img>
                                                                                                                                                        </a>
                                                                                                                                                    </span>
                                                                                                                                                    : ''}
                                                                                                                                            </> : ''}
                                                                                                                                        <span className="ml-2">{childinew.Shareweb_x0020_ID}</span>
                                                                                                                                    </div>
                                                                                                                                    </td>

                                                                                                                                    <td style={{ width: "20%" }}>

                                                                                                                                        {childinew.siteType == "Master Tasks" && <a data-interception="off" target="_blank" className="hreflink serviceColor_Active"

                                                                                                                                            href={"https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=" + childinew.Id }
                                                                                                                                        ><span dangerouslySetInnerHTML={{ __html: childinew.TitleNew }}></span>
                                                                                                                                        </a>}
                                                                                                                                        {childinew.siteType != "Master Tasks" && <a data-interception="off" target="_blank" className="hreflink serviceColor_Active"
                                                                                                                                            href={"https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Task-Profile.aspx?taskId=" + childinew.Id + '&Site=' + childinew.siteType }
                                                                                                                                        ><span dangerouslySetInnerHTML={{ __html: childinew.TitleNew }}></span>
                                                                                                                                        </a>}
                                                                                                                                        {/* {childinew.childs.length > 0 &&
                                                                                                                                            <span className='ms-1'>({childinew.childsLength})</span>
                                                                                                                                        } */}
                                                                                                                                        {childinew.childs.length > 0 && childinew.Item_x0020_Type == 'Feature' &&
                                                                                                                                            <span className='ms-1'>  ({childinew.childs.length})</span>
                                                                                                                                        }
                                                                                                                                        {childinew.childs.length > 0 && childinew.Item_x0020_Type != 'Feature' &&
                                                                                                                                            <span className='ms-1'>  ({childinew.childsLength})</span>
                                                                                                                                        }

                                                                                                                                        {childinew.Short_x0020_Description_x0020_On != null &&
                                                                                                                                            <div className='popover__wrapper ms-1'>
                                                                                                                                                <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/infoIcon.png" />
                                                                                                                                                {/* <span className="tooltipte">
                                                                                                                                                    <span className="tooltiptext">
                                                                                                                                                        <div className="tooltip_Desc">
                                                                                                                                                            <span> {childinew.Short_x0020_Description_x0020_On}</span>
                                                                                                                                                        </div>
                                                                                                                                                    </span>
                                                                                                                                                </span> */}
                                                                                                                                                <div className="popover__content">
                                                                                                                                                    {childinew.Short_x0020_Description_x0020_On}
                                                                                                                                                </div>
                                                                                                                                            </div>
                                                                                                                                        }
                                                                                                                                    </td>
                                                                                                                                    <td style={{ width: "17%" }}>
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
                                                                                                                                    <td style={{ width: "17%" }}>
                                                                                                                                        <div>
                                                                                                                                            <ShowTaskTeamMembers props={childinew} TaskUsers={AllUsers}></ShowTaskTeamMembers>

                                                                                                                                        </div></td>
                                                                                                                                    <td style={{ width: "6%" }}>{childinew.PercentComplete}</td>
                                                                                                                                    <td style={{ width: "10%" }}>{childinew.ItemRank}</td>
                                                                                                                                    <td style={{ width: "10%" }}>{childinew.DueDate}</td>
                                                                                                                                    <td style={{ width: "3%" }}>{childinew.siteType != "Master Tasks" && <a onClick={(e) => EditData(e, childinew)} data-bs-toggle="tooltip" data-bs-placement="auto" title="Click To Edit Timesheet"><img style={{ width: "22px" }} data-bs-toggle="tooltip" data-bs-placement="bottom" title="Click To Edit Timesheet" src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/clock-gray.png"></img></a>}
                                                                                                                                    </td>
                                                                                                                                    <td style={{ width: "2%" }}>{childinew.siteType === "Master Tasks" && childinew.isRestructureActive && <a href="#" data-bs-toggle="tooltip" data-bs-placement="auto" title="Edit"><img className='icon-sites-img' src={childinew.Restructuring} onClick={(e) => OpenModal(childinew)} /></a>}</td>
                                                                                                                                    <td style={{ width: "2%" }}> {childinew.siteType != "Master Tasks" && <img data-bs-toggle="tooltip" data-bs-placement="auto" title="Edit" src={require('../../../Assets/ICON/edit_page.svg')} width="25" onClick={(e) => EditItemTaskPopup(childinew)} />}
                                                                                                                                        {childinew.siteType == "Master Tasks" && <a data-bs-toggle="tooltip" data-bs-placement="auto" title="Edit">   <img src={require('../../../Assets/ICON/edit_page.svg')} width="25" onClick={(e) => EditComponentPopup(childinew)} /></a>}</td>
                                                                                                                                </tr>
                                                                                                                            </table>
                                                                                                                        </td>
                                                                                                                    </tr>
                                                                                                                    {childinew.show && childinew.childs.length > 0 && (
                                                                                                                        <>
                                                                                                                            {childinew.childs.map(function (subchilditem: any) {
                                                                                                                                if (subchilditem.flag == true) {

                                                                                                                                    return (

                                                                                                                                        <>
                                                                                                                                            <tr >
                                                                                                                                                <td className="p-0" colSpan={12}>
                                                                                                                                                    <table className="table m-0" style={{ width: "100%" }}>
                                                                                                                                                        <tr className="for-c02">
                                                                                                                                                            <td style={{ width: "2%" }}>
                                                                                                                                                                <div className="accordian-header" onClick={() => handleOpen(subchilditem)}>
                                                                                                                                                                    {(subchilditem.childs != undefined && subchilditem.childs.length > 0) &&
                                                                                                                                                                        <a className='hreflink'
                                                                                                                                                                            title="Tap to expand the childs">
                                                                                                                                                                            {/* <div className="sign">{subchilditem.show ? <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png" />
                                                                                                                                                                    : <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png" />}
                                                                                                                                                                </div> */}
                                                                                                                                                                        </a>
                                                                                                                                                                    }

                                                                                                                                                                </div>
                                                                                                                                                            </td>
                                                                                                                                                            <td style={{ width: "2%" }}>
                                                                                                                                                           
                                                                                                                                                                <div className="accordian-header" >
                                                                                                                                                                    <span className='pe-2'><input type="checkbox" onChange={(e) => onChangeHandler(subchilditem, item, e)} /></span>
                                                                                                                                                                </div>
                                                                                                                                

                                                                                                                                                            </td>
                                                                                                                                                            {/* <td style={{ width: "2%" }}></td> */}
                                                                                                                                                            <td style={{ width: "9%" }}>  <div className="d-flex">
                                                                                                                                                                <span>

                                                                                                                                                                    <a className="hreflink" title="Show All Child" data-toggle="modal">
                                                                                                                                                                        <img className="icon-sites-img ml20 me-1" src={subchilditem.SiteIcon}></img>
                                                                                                                                                                        {/* <img className="icon-sites-img"
                                                                                                                        src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/SubComponent_icon.png" /> */}
                                                                                                                                                                    </a>

                                                                                                                                                                </span>
                                                                                                                                                                {search != undefined && search != '' && subchilditem.childs?.length > 0 ?
                                                                                                                                                                    <>
                                                                                                                                                                        {subchilditem?.Isexpend ?
                                                                                                                                                                            <span>
                                                                                                                                                                                <a className="hreflink" title="Show All Child" data-toggle="modal" onClick={() => hideAllChildsMinus(subchilditem)}>
                                                                                                                                                                                    <img className="icon-sites-img me-1 ml20" src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Minus-Gray.png"></img>
                                                                                                                                                                                </a>
                                                                                                                                                                            </span>
                                                                                                                                                                            : ''}
                                                                                                                                                                        {!subchilditem?.Isexpend ?
                                                                                                                                                                            <span>
                                                                                                                                                                                <a className="hreflink" title="Show All Child" data-toggle="modal" onClick={() => ShowAllChildsPlus(subchilditem)}>
                                                                                                                                                                                    <img className="icon-sites-img me-1 ml20" src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Add-New-Grey.png"></img>
                                                                                                                                                                                </a>
                                                                                                                                                                            </span>
                                                                                                                                                                            : ''}
                                                                                                                                                                    </> : ''}
                                                                                                                                                                <span className="">{subchilditem.Shareweb_x0020_ID}</span>
                                                                                                                                                            </div>
                                                                                                                                                            </td>

                                                                                                                                                            <td style={{ width: "20%" }}>
                                                                                                                                                                {subchilditem.siteType == "Master Tasks" && <a data-interception="off" target="_blank" className="hreflink serviceColor_Active"
                                                                                                                                                                    href={"https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=" + childitem.Id }
                                                                                                                                                                ><span dangerouslySetInnerHTML={{ __html: subchilditem.TitleNew }}></span>
                                                                                                                                                                </a>}
                                                                                                                                                                {subchilditem.siteType != "Master Tasks" && <a data-interception="off" target="_blank" className="hreflink serviceColor_Active"
                                                                                                                                                                    href={"https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Task-Profile.aspx?taskId=" + subchilditem.Id + '&Site=' + subchilditem.siteType }
                                                                                                                                                                ><span dangerouslySetInnerHTML={{ __html: subchilditem.TitleNew }}></span>
                                                                                                                                                                </a>}
                                                                                                                                                                {(subchilditem.childs != undefined && subchilditem.childs.length > 0) &&
                                                                                                                                                                    <span className='ms-1'>({subchilditem.childs.length})</span>
                                                                                                                                                                }

                                                                                                                                                                {subchilditem.Short_x0020_Description_x0020_On != null &&
                                                                                                                                                                    // <span data-bs-toggle="tooltip" data-bs-placement="auto" title={subchilditem.Short_x0020_Description_x0020_On}><img
                                                                                                                                                                    //     src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/infoIcon.png" />
                                                                                                                                                                    // </span>
                                                                                                                                                                    <div className='popover__wrapper ms-1'>
                                                                                                                                                                        <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/infoIcon.png" />
                                                                                                                                                                        {/* <span className="tooltipte">
                                                                                                                                                                    <span className="tooltiptext">
                                                                                                                                                                        <div className="tooltip_Desc">
                                                                                                                                                                            <span> {subchilditem.Short_x0020_Description_x0020_On}</span>
                                                                                                                                                                        </div>
                                                                                                                                                                    </span>
                                                                                                                                                                </span> */}
                                                                                                                                                                        <div className="popover__content">
                                                                                                                                                                            {subchilditem.Short_x0020_Description_x0020_On}
                                                                                                                                                                        </div>
                                                                                                                                                                    </div>
                                                                                                                                                                }
                                                                                                                                                            </td>
                                                                                                                                                            <td style={{ width: "17%" }}>
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
                                                                                                                                                            <td style={{ width: "17%" }}>
                                                                                                                                                                <div>
                                                                                                                                                                    <ShowTaskTeamMembers props={subchilditem} TaskUsers={AllUsers}></ShowTaskTeamMembers>
                                                                                                                                                                </div></td>
                                                                                                                                                            <td style={{ width: "6%" }}>{subchilditem.PercentComplete}</td>
                                                                                                                                                            <td style={{ width: "10%" }}>{subchilditem.ItemRank}</td>
                                                                                                                                                            <td style={{ width: "10%" }}>{subchilditem.DueDate}</td>
                                                                                                                                                            <td style={{ width: "3%" }}>{subchilditem.siteType != "Master Tasks" && <a onClick={(e) => EditData(e, subchilditem)} data-bs-toggle="tooltip" data-bs-placement="auto" title="Click To Edit Timesheet"><img style={{ width: "22px" }} src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/clock-gray.png"></img></a>}</td>
                                                                                                                                                            <td style={{ width: "2%" }}></td>
                                                                                                                                                            <td style={{ width: "2%" }}> {subchilditem.siteType != "Master Tasks" && <img data-bs-toggle="tooltip" data-bs-placement="auto" title="Edit" src={require('../../../Assets/ICON/edit_page.svg')} width="25" onClick={(e) => EditItemTaskPopup(subchilditem)} ></img>}</td>
                                                                                                                                                        </tr>
                                                                                                                                                    </table>
                                                                                                                                                </td>
                                                                                                                                            </tr>
                                                                                                                                        </>
                                                                                                                                    )
                                                                                                                                }
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
                </div></section>

            {IsTask && <EditTaskPopup Items={SharewebTask} Call={Call}></EditTaskPopup>}
            {IsComponent && <EditInstituton props={SharewebComponent} Call={Call} showProgressBar={showProgressBar}> </EditInstituton>}
            {IsTimeEntry && <TimeEntryPopup props={SharewebTimeComponent} CallBackTimeEntry={TimeEntryCallBack}></TimeEntryPopup>}
            {MeetingPopup && <CreateActivity props={MeetingItems[0]} Call={Call} LoadAllSiteTasks={LoadAllSiteTasks}></CreateActivity>}
            {WSPopup && <CreateWS props={MeetingItems[0]} Call={Call} data={data}></CreateWS>}
            <Panel headerText={` Create Component `} type={PanelType.large} isOpen={addModalOpen} isBlocking={false} onDismiss={CloseCall}>
                <PortfolioStructureCreationCard CreatOpen={CreateOpenCall} Close={CloseCall} PortfolioType={IsUpdated} SelectedItem={checkedList != null && checkedList.length > 0 ? checkedList[0] : props} />
            </Panel>

            <Panel
               onRenderHeader={onRenderCustomHeaderMain}
               type={PanelType.custom}
               customWidth="600px"
                isOpen={ActivityPopup}
                onDismiss={closeTaskStatusUpdatePoup2}
                isBlocking={false}
            >

               
                 

                        {/* <div className="modal-header  mt-1 px-3">
                            <h5 className="modal-title" id="exampleModalLabel"> Select Client Category</h5>
                            <button onClick={closeTaskStatusUpdatePoup2} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div> */}
                       


                        <div className="modal-body bg-f5f5 clearfix">
                            <div className={IsUpdated == 'Events Portfolio' ? 'app component clearfix eventpannelorange' : (IsUpdated == 'Service Portfolio' ? 'app component clearfix serviepannelgreena' : 'app component clearfix')}>
                                <div id="portfolio" className="section-event pt-0">
                                
                                    {/* {
                                    
                                    MeetingItems.SharewebTaskType == undefined  &&
                                        <ul className="quick-actions">

                                            <li className="mx-1 p-2 position-relative bg-siteColor text-center mb-2">
                                                <div onClick={(e) => CreateMeetingPopups('Implementation')}>
                                                    <span className="icon-sites">
                                                        <img className="icon-sites"
                                                            src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/Implementation.png" />

                                                    </span>
                                                    Implmentation
                                                </div>
                                            </li>
                                            <li className="mx-1 p-2 position-relative bg-siteColor text-center mb-2">
                                                <div onClick={() => CreateMeetingPopups('Development')}>
                                                    <span className="icon-sites">
                                                        <img className="icon-sites"
                                                            src="	https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/development.png" />

                                                    </span>
                                                    Development
                                                </div>
                                            </li>
                                            <li className="mx-1 p-2 position-relative bg-siteColor text-center mb-2">
                                                <div onClick={() => CreateMeetingPopups('Activities')}>
                                                    <span className="icon-sites">
                                                    </span>
                                                    Activity
                                                </div>
                                            </li>
                                        </ul>
                                         
                                    } */}
                                    {
                                        (childsData != undefined && childsData[0]?.SharewebTaskType?.Title == 'Workstream') ?
                                        <ul className="quick-actions">

                                            <li className="mx-1 p-2 position-relative bg-siteColor text-center mb-2">
                                                <div onClick={(e) => CreateMeetingPopups('Task')}>
                                                    <span className="icon-sites">
                                                        <img className="icon-sites"
                                                            src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/bug.png" />

                                                    </span>
                                                    Bug
                                                </div>
                                            </li>
                                            <li className="mx-1 p-2 position-relative bg-siteColor text-center mb-2">
                                                <div onClick={() => CreateMeetingPopups('Task')}>
                                                    <span className="icon-sites">
                                                        <img className="icon-sites"
                                                            src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/feedbck.png" />

                                                    </span>
                                                    Feedback
                                                </div>
                                            </li>
                                            <li className="mx-1 p-2 position-relative bg-siteColor text-center mb-2">
                                                <div onClick={() => CreateMeetingPopups('Task')}>
                                                    <span className="icon-sites">
                                                        <img src="	https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/Impovement.png" />
                                                    </span>
                                                    Improvement
                                                </div>
                                            </li>
                                            <li className="mx-1 p-2 position-relative bg-siteColor text-center mb-2">
                                                <div onClick={() => CreateMeetingPopups('Task')}>
                                                    <span className="icon-sites">
                                                        <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/design.png" />
                                                    </span>
                                                    Design
                                                </div>
                                            </li>
                                            <li className="mx-1 p-2 position-relative bg-siteColor text-center mb-2">
                                                <div onClick={() => CreateMeetingPopups('Task')}>
                                                    <span className="icon-sites">
                                                    </span>
                                                    Task
                                                </div>
                                            </li>
                                        </ul>:
                                         <ul className="quick-actions">

                                         <li className="mx-1 p-2 position-relative bg-siteColor text-center mb-2">
                                             <div onClick={(e) => CreateMeetingPopups('Implementation')}>
                                                 <span className="icon-sites">
                                                     <img className="icon-sites"
                                                         src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/Implementation.png" />

                                                 </span>
                                                 Implmentation
                                             </div>
                                         </li>
                                         <li className="mx-1 p-2 position-relative bg-siteColor text-center mb-2">
                                             <div onClick={() => CreateMeetingPopups('Development')}>
                                                 <span className="icon-sites">
                                                     <img className="icon-sites"
                                                         src="	https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/development.png" />

                                                 </span>
                                                 Development
                                             </div>
                                         </li>
                                         <li className="mx-1 p-2 position-relative bg-siteColor text-center mb-2">
                                             <div onClick={() => CreateMeetingPopups('Activities')}>
                                                 <span className="icon-sites">
                                                 </span>
                                                 Activity
                                             </div>
                                         </li>
                                     </ul>

                                    }
                                </div>
                            </div>
                            <button type="button" className="btn btn-default btn-default ms-1 pull-right" onClick={closeTaskStatusUpdatePoup2}>Cancel</button>
                        </div>
                    
               


            </Panel >
            <Panel headerText={` Restructuring Tool `} type={PanelType.medium} isOpen={ResturuningOpen} isBlocking={false} onDismiss={RestruringCloseCall}>
                <div>
                    {ResturuningOpen ?
                        <div className='bg-ee p-2 restructurebox'>
                            <div>
                                {NewArrayBackup != undefined && NewArrayBackup.length > 0 ? <span>All below selected items will become child of  <img className="icon-sites-img me-1 " src={NewArrayBackup[0].SiteIcon}></img> <a data-interception="off" target="_blank" className="hreflink serviceColor_Active"
                                    href={"https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=" + NewArrayBackup[0].Id}
                                ><span>{NewArrayBackup[0].Title}</span>
                                </a>  please click Submit to continue.</span> : ''}
                            </div>
                            <div>
                                <span>  Old: </span>
                                {OldArrayBackup.map(function (obj: any, index) {
                                    return (
                                        <span> <img className="icon-sites-img me-1 ml20" src={obj.SiteIcon}></img><a data-interception="off" target="_blank" className="hreflink serviceColor_Active"
                                            href={"https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=" + obj.Id}
                                        ><span>{obj.Title}  </span>
                                        </a>{(OldArrayBackup.length - 1 < index) ? '>' : ''} </span>
                                    )
                                })}

                            </div>
                            <div>
                                <span>  New:   </span> {NewArrayBackup.map(function (newobj: any, indexnew) {
                                    return (
                                        <>
                                            <span> <img className="icon-sites-img me-1 ml20" src={newobj.SiteIcon}></img><a data-interception="off" target="_blank" className="hreflink serviceColor_Active"
                                                href={"https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=" + newobj.Id}
                                            ><span>{newobj.Title}  </span>
                                            </a>{(NewArrayBackup.length - 1 < indexnew) ? '>' : ''}</span></>
                                    )
                                })}
                                <span> <img className="icon-sites-img me-1 ml20" src={RestructureChecked[0].SiteIcon}></img><a data-interception="off" target="_blank" className="hreflink serviceColor_Active"
                                    href={"https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=" + RestructureChecked[0].Id}
                                ><span>{RestructureChecked[0].Title}  </span>
                                </a></span>
                            </div>
                            {console.log("restructure functio test in div===================================")}
                            {checkedList != undefined && checkedList.length > 0 && checkedList[0].Item_x0020_Type != 'Task' ?
                                <div>
                                    <span> {'Select Component Type :'}<input type="radio" name="fav_language" value="SubComponent" checked={RestructureChecked[0].Item_x0020_Type == "SubComponent" ? true : false} onChange={(e) => setRestructure(RestructureChecked[0], 'SubComponent')} /><label className="ms-1"> {'SubComponent'} </label></span>
                                    <span> <input type='radio' name="fav_language" value="SubComponent" checked={RestructureChecked[0].Item_x0020_Type === "Feature" ? true : false} onChange={(e) => setRestructure(RestructureChecked[0], 'Feature')} /> <label className="ms-1"> {'Feature'} </label> </span>
                                </div>
                                : ''}
                        </div>
                        : ''}
                </div>
                <footer className="mt-2 text-end">
                    {checkedList != undefined && checkedList.length > 0 && checkedList[0].Item_x0020_Type === 'Task' ?
                        <button type="button" className="btn btn-primary " onClick={(e) => UpdateTaskRestructure()}>Save</button>
                        : <button type="button" className="btn btn-primary " onClick={(e) => UpdateRestructure()}>Save</button>}
                    <button type="button" className="btn btn-default btn-default ms-1" onClick={RestruringCloseCall}>Cancel</button>


                </footer>
            </Panel>
        </div >
    );
}
export default ComponentTable;