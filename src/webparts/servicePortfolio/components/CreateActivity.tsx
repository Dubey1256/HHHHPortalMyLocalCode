import * as React from 'react';
import { arraysEqual, Modal, Panel, PanelType } from 'office-ui-fabric-react';
import { Web } from "sp-pnp-js";
import TeamConfigurationCard from '../../../globalComponents/TeamConfiguration/TeamConfiguration';
import FroalaImageUploadComponent from '../../../globalComponents/FlorarComponents/FlorarImageUploadComponent';
//import FroalaCommentBox from '../../../globalComponents/FlorarComponents/FroalaCommentBoxComponent';
import HtmlEditorCard from '../../../globalComponents/HtmlEditor/HtmlEditor';
import * as Moment from 'moment';
import Picker from '../../../globalComponents/EditTaskPopup/SmartMetaDataPicker';

import ClientCategoryPupup from '../../../globalComponents/ClientCategoryPopup';
import Tooltip from '../../../globalComponents/Tooltip';
import "react-datepicker/dist/react-datepicker.css";
import "froala-editor/js/plugins.pkgd.min.js";
import "froala-editor/js/froala_editor.pkgd.min.js";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import * as globalCommon from "../../../globalComponents/globalCommon";

import Froala from "react-froala-wysiwyg";
import ServiceComponentPortfolioPopup from '../../../globalComponents/EditTaskPopup/ServiceComponentPortfolioPopup';
import { expandRows } from '@tanstack/react-table';
let action = false;



//import "bootstrap/dist/css/bootstrap.min.css";
let ShowCategoryDatabackup: any = [];
let AutoCompleteItemsArray: any = [];
var AssignedToIds: any = [];
var ResponsibleTeamIds: any = [];
var TaskTypeItems: any = [];
var SharewebTasknewTypeId: any = ''
var SharewebTasknewType: any = ''
var FeedBackItem: any = {};
var SelectedTasks: any = []
var Task: any = []
var TeamMemberIds: any = [];
var portfolioId: any = ''
var WorstreamLatestId: any = ''
var newIndex: any = ''
var BackupCat: any = "";
var FeedBackItemArray: any = [];
var NewArray: any = [];
var feedbackArray: any = [];
var dynamicList: any = {}
var SiteTypeBackupArray: any = [];
var counts = 0
var isModelChange = false
var TaskImagess: any = []
var AllClientCategory: any = [];
let AllItems: any = {}
const defaultContent = "";
let defaultfile = [];
let AllMatsterAndTaskData: any = []

const CreateActivity = (props: any) => {
    // AllMatsterAndTaskData = [...props?.AllMasterTasks];
    // AllMatsterAndTaskData = AllMatsterAndTaskData?.concat(props?.LoadAllSiteTasks);
    if (props.SelectedProp != undefined && props.SelectedProp.SelectedProp != undefined) {
        dynamicList = props.SelectedProp.SelectedProp;
    } else {
        dynamicList = props.SelectedProp;
    }
    if (props != undefined) {
        //props.props.DueDate =  Moment(props.props.DueDate).format('DD/MM/YYYY
        AllItems = { ...props?.props };
        SelectedTasks.push(AllItems)
        if (AllItems?.Services != undefined && AllItems?.Services?.length > 0) {
            portfolioId = AllItems.Services[0].Id
        }

        console.log(props)
    }

    let portFolioTypeId = props?.portfolioTypeData?.filter((elem: any) => elem?.Id === props?.props?.PortfolioType?.Id)
    var portFolio = props?.props?.Id

    const [PhoneStatus, setPhoneStatus] = React.useState(false);
    const [EmailStatus, setEmailStatus] = React.useState(false);
    const [ImmediateStatus, setImmediateStatus] = React.useState(false);
    const [ApprovalStatus, setApprovalStatus] = React.useState(false);
    const [TaskImages, setTaskImages] = React.useState<any>([])
    const [AllCategoryData, setAllCategoryData] = React.useState([]);
    const [SearchedCategoryData, setSearchedCategoryData] = React.useState([]);
    const [TaskStatuspopup, setTaskStatuspopup] = React.useState(true);
    const [date, setDate] = React.useState(undefined);
    const [siteTypess, setSiteType] = React.useState([]);
    const [Categories, setCategories] = React.useState([]);
    const [categorySearchKey, setCategorySearchKey] = React.useState('');
    const [checkedCat, setcheckedCat] = React.useState(false);
    const [IsComponent, setIsComponent] = React.useState(false);
    const [SharewebComponent, setSharewebComponent] = React.useState<any>('');
    const [selectPriority, setselectPriority] = React.useState('');
    const [Priorityy, setPriorityy] = React.useState(false);
    const [SharewebCategory, setSharewebCategory] = React.useState('');
    const [isDropItem, setisDropItem] = React.useState(false);
    const [isDropItemRes, setisDropItemRes] = React.useState(false);
    var [smartComponentData, setSmartComponentData] = React.useState<any>([]);
    var [linkedComponentData, setLinkedComponentData] = React.useState<any>([]);
    const [TaskAssignedTo, setTaskAssignedTo] = React.useState([]);
    const [TaskTeamMembers, setTaskTeamMembers] = React.useState([]);
    const [TaskResponsibleTeam, setTaskResponsibleTeam] = React.useState([]);
    const [CategoriesData, setCategoriesData] = React.useState<any>([]);
    const [ClientCategoriesData, setClientCategoriesData] = React.useState<any>([]);
    const [ClientCategory, setClientCategory] = React.useState([]);
    const [IsComponentPicker, setIsComponentPicker] = React.useState(false);
    const [IsClientPopup, setIsClientPopup] = React.useState(false);
    const [site, setSite] = React.useState('');
    const [count, setCount] = React.useState(0);
    var [isActive, setIsActive] = React.useState({ siteType: false, });
    const [save, setSave] = React.useState<any>({ Title: '', siteType: [], linkedServices: [], recentClick: undefined, DueDate: undefined, taskCategory: '', IsShowSelectedSite: false })
    const [post, setPost] = React.useState({ Title: '' })


    var CheckCategory: any = []
    CheckCategory.push({ "TaxType": "Categories", "Title": "Phone", "Id": 199, "ParentId": 225 }, { "TaxType": "Categories", "Title": "Email Notification", "Id": 276, "ParentId": 225 }, { "TaxType": "Categories", "Title": "Approval", "Id": 227, "ParentId": 225 },
        { "TaxType": "Categories", "Title": "Immediate", "Id": 228, "parentId": 225 });



    React.useEffect(() => {
        GetCategoryData();

        loadAllCategoryData("Categories");
        setPost({ ...post, Title: (AllItems.NoteCall === 'Activities' || AllItems.NoteCall === 'Task' ? AllItems.Title : AllItems.NoteCall + ' - ' + AllItems.Title) })
        if (AllItems?.Clientcategories != undefined && AllItems?.Clientcategories?.length > 0) {
            AllItems.Clientcategories.forEach((value: any) => {
                ClientCategoriesData.push(value)
            })
        }
        if (AllItems?.ClientCategory != undefined && AllItems?.ClientCategory?.length > 0) {
            AllItems.ClientCategory.forEach((value: any) => {
                ClientCategoriesData.push(value)
            })
        }

        if (AllItems?.ClientCategory != undefined && AllItems?.ClientCategory?.length > 0) {
            if (AllItems?.ClientCategory2 != undefined && AllItems?.ClientCategory2.results?.length > 0) {
                AllItems.ClientCategory2.results.forEach((value2: any) => {
                    ClientCategoriesData.push(value2)
                })
            } else {
                AllItems.ClientCategory?.results?.forEach((value: any) => {
                    ClientCategoriesData.push(value)
                })
            }
        }


        if (AllItems?.ClientCategory != undefined && AllItems?.ClientCategory?.results?.length > 0) {
            if (AllItems?.ClientCategory2 != undefined && AllItems?.ClientCategory2.results?.length > 0) {
                AllItems.ClientCategory2.results.forEach((value2: any) => {
                    ClientCategoriesData.push(value2)
                })
            } else {
                AllItems.ClientCategory?.results?.forEach((value: any) => {
                    ClientCategoriesData.push(value)
                })
            }

        }
        // if (AllItems?.ClientCategory2 != undefined && AllItems?.ClientCategory2.results?.length > 0) {
        //     AllItems.ClientCategory2.results.forEach((value: any) => {
        //         ClientCategoriesData.push(value)
        //     })
        // }
        if (AllItems?.Portfolio_x0020_Type != undefined) {
            if (AllItems?.Portfolio_x0020_Type == 'Component' || (AllItems.Component != undefined && AllItems.Component.length > 0)) {
                smartComponentData.push(AllItems);
            }
            smartComponentData = smartComponentData?.filter((val: any, id: any, array: any) => {
                return array.indexOf(val) == id;
            })

            if (AllItems?.Portfolio_x0020_Type?.toLowerCase() == 'service' || (AllItems.Service != undefined && AllItems.Service.length > 0)) {
                linkedComponentData.push(AllItems);
            }
            linkedComponentData = linkedComponentData?.filter((val: any, id: any, array: any) => {
                return array.indexOf(val) == id;
            })

            linkedComponentData = linkedComponentData?.filter((val: any, id: any, array: any) => {
                return array.indexOf(val) == id;
            })
            smartComponentData = smartComponentData?.filter((val: any, id: any, array: any) => {
                return array.indexOf(val) == id;
            })
        }
        if (AllItems?.Portfolio_x0020_Type == undefined) {
            if (AllItems?.Component != undefined && AllItems?.Component?.length > 0) {
                smartComponentData.push(AllItems);
            }

            if (AllItems?.Services != undefined && AllItems?.Services?.length > 0) {
                linkedComponentData.push(AllItems);
            }
            linkedComponentData = linkedComponentData?.filter((val: any, id: any, array: any) => {
                return array.indexOf(val) == id;
            })
            smartComponentData = smartComponentData?.filter((val: any, id: any, array: any) => {
                return array.indexOf(val) == id;
            })

        }
        GetSmartMetadata();
    }, [])

    const getTooltiphierarchyWithoutGroupByTable = (row: any): any => {
       
        var Data: any = []
        AllMatsterAndTaskData?.forEach((val: any) => {

            if (row?.Services != undefined && row?.Services?.length > 0 && val.Id === row?.Services[0]?.Id) {
                val.subRows = []
                Data = val.subRows.push(val);
                return getTooltiphierarchyWithoutGroupByTable(val);
            }
            else if (val.Id === row?.Parent?.Id) {
                val.subRows = []
                Data = val.subRows.push(val);

                return getTooltiphierarchyWithoutGroupByTable(val);
            }
        })
        // return Data
    };


    const GetCategoryData = async () => {
        const web = new Web(dynamicList?.siteUrl);

        const res = await web.lists.getById(dynamicList?.SmartMetadataListID).items
            .select("Id,Title,TaxType,ParentID").top(4999)
            .filter("TaxType eq 'Client Category'")
            .get();
        console.log(res)
        AllClientCategory = AllClientCategory.concat(res)


    }
    const GetSmartMetadata = async () => {
        var SitesTypes: any = [];
        var siteConfig = []
        var AllMetadata: any = []
        let web = new Web(dynamicList?.siteUrl);
        let MetaData = [];
        MetaData = await web.lists
            .getByTitle('SmartMetadata')
            .items
            .select("Id,Title,listId,siteUrl,siteName,Item_x005F_x0020_Cover,ParentID,EncodedAbsUrl,IsVisible,Created,Modified,Description1,SortOrder,Selectable,TaxType,Created,Modified,Author/Name,Author/Title,Editor/Name,Editor/Title")
            .top(4999)
            .expand('Author,Editor')
            .get();
        AllMetadata = MetaData;
        siteConfig = getSmartMetadataItemsByTaxType(AllMetadata, 'Sites')
        siteConfig?.forEach((site: any) => {
            if (site.Title !== undefined && site.Title !== 'Foundation' && site.Title !== 'Master Tasks' && site.Title !== 'DRR' && site.Title !== 'Health' && site.Title !== 'Gender') {
                site.IscreateTask = false;
                site.isSiteSelect = false;
                SitesTypes.push(site);
            }

        })
        if (AllItems?.NoteCall == 'Task' && AllItems?.Item_x0020_Type != 'Component' && AllItems?.Item_x0020_Type != 'SubComponent' && AllItems?.Item_x0020_Type != 'Feature') {
            SitesTypes?.forEach((type: any) => {
                if (type.listId != null) {
                    if (type.listId.toLowerCase() == AllItems?.listId?.toLowerCase()) {
                        type.IscreateTask = true;
                        save.IsShowSelectedSite = true;
                    }
                }
            })

            if (AllItems.listId != undefined) {
                let web = new Web(dynamicList.siteUrl);
                let componentDetails:any = [];
                componentDetails = await web.lists
                    .getById(AllItems.listId)
                    .items
                    .select("FolderID,TaskLevel,TaskLevel,AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,FileLeafRef,Title,Id,PriorityRank,PercentComplete,Priority,Created,Modified,TaskType/Id,TaskType/Title,TaskType/Level,TaskType/Prefix,ParentTask/Id,ParentTask/Title,Author/Id,Author/Title,Editor/Id,Editor/Title")
                    .expand("TaskType,ParentTask,Author,Editor,AssignedTo")
                    .filter(("TaskType/Title eq 'Workstream'") && ("ParentTask/Id eq '" + AllItems?.Id + "'"))
                    .orderBy("Created", false)
                    .top(4999)
                    .get()
                console.log(componentDetails)
                if (componentDetails?.length == 0) {
                    WorstreamLatestId = AllItems?.TaskLevel;
                } else {
                    if (AllItems?.TaskType.Title != undefined ? AllItems?.TaskType.Title != 'Workstream' : AllItems?.TaskType != "Workstream") {
                        WorstreamLatestId = componentDetails[0]?.TaskLevel + 1;
                    }
                    else {
                        WorstreamLatestId = componentDetails[0]?.TaskLevel != undefined ? componentDetails[0]?.TaskLevel : AllItems?.TaskLevel;
                    }

                }
                getTasktype();
            }
        }


        setSiteType(SitesTypes)
        SiteTypeBackupArray = SitesTypes;

        AllItems.SiteCompositionSettingsbackup = globalCommon?.parseJSON(AllItems.SiteCompositionSettings);

        if (AllItems.Portfolio_x0020_Type != undefined && (AllItems.Portfolio_x0020_Type === 'Component' || AllItems.Portfolio_x0020_Type === 'Service' || AllItems.Portfolio_x0020_Type == 'Event' || AllItems.Portfolio_x0020_Type == 'Team')) {

            let allItems = globalCommon?.parseJSON(AllItems?.Sitestagging);

            AllItems.Sitestaggingbackup = [];

            allItems?.forEach((obj: any) => {

                if (obj?.ClienTimeDescription != undefined) {

                    let Item: any = {};

                    Item.SiteName = obj.Title;

                    Item.ClienTimeDescription = obj.ClienTimeDescription;

                    Item.localSiteComposition = obj.isAvailable;

                    AllItems.Sitestaggingbackup.push(Item);

                }

            })
        }
        else AllItems.Sitestaggingbackup = globalCommon.parseJSON(AllItems?.ClientTime);

        if (AllItems != undefined && AllItems.Sitestaggingbackup != undefined && AllItems.Sitestaggingbackup.length > 1) {

            SiteTypeBackupArray.forEach((site: any) => {

                if (site.Title != undefined && site.Title === 'Shareweb')

                    setActiveTile("siteType", "siteType", site)
            })

        }

        else if (AllItems != undefined && AllItems.Sitestaggingbackup != undefined && AllItems.Sitestaggingbackup.length === 1) {

            SiteTypeBackupArray.forEach((site: any) => {

                if (site.Title != undefined && site.Title === AllItems.Sitestaggingbackup[0].Title)
                    setActiveTile("siteType", "siteType", site)
            })

        }
        // else if (AllItems != undefined && AllItems.Sitestaggingbackup != undefined && AllItems.Sitestaggingbackup.length === 0) {
        //     SiteTypeBackupArray.forEach((site: any) => {

        //         if (site.Title != undefined && site.Title === 'HHHH')

        //             setActiveTile("siteType", "siteType", site)

        //     })
        // }


    }
    const getTasktype = async () => {
        if (AllItems?.NoteCall == 'Task') {
            let web = new Web(dynamicList.siteUrl);
            TaskTypeItems = await web.lists
                .getById(dynamicList.TaskTypeID)
                .items
                .select("Id,Title,Shareweb_x0020_Edit_x0020_Column,Prefix,Level")
                .top(4999)
                .get()
            console.log(TaskTypeItems)
            TaskTypeItems?.forEach((item: any, index: any) => {
                if (item.Title == AllItems?.NoteCall) {
                    SharewebTasknewTypeId = item.Id;
                    SharewebTasknewType = item.Title;
                    newIndex = index
                }
            })
        }
    }
    var getSmartMetadataItemsByTaxType = function (metadataItems: any, taxType: any) {
        var Items: any = [];
        metadataItems?.forEach((taxItem: any) => {
            if (taxItem.TaxType === taxType)
                Items.push(taxItem);
        });

        Items.sort((a: any, b: any) => {
            return a.SortOrder - b.SortOrder;
        });
        return Items;
    }
    const setActiveTile = async (item: keyof typeof save, isActiveItem: keyof typeof isActive, value: any) => {
        AllItems['SiteListItem'] = value.Title
        let saveItem = save;

        let tempArray: any = [];
        let flag = false;
        SiteTypeBackupArray.forEach((val: any) => {
            if (val.Id == value.Id) {
                if (val.IscreateTask) {
                    val.IscreateTask = false;
                } else {
                    val.IscreateTask = true;
                    flag = true;

                }
                if (val.isSiteSelect) {
                    val.isSiteSelect = false;
                } else {
                    val.isSiteSelect = true;
                    flag = true;
                }
                tempArray.push(val);
            } else {
                tempArray.push(val);
            }
        })
        setSiteType(tempArray);
        //  setIsShowSelectedSite(flag);
        getActivitiesDetails(value)
        if (AllItems.NoteCall != 'Task') {
            setSave({ ...save, recentClick: isActiveItem, IsShowSelectedSite: flag })
        }

    };
    const Call = React.useCallback((item1: any, type: any) => {
        setIsComponentPicker(false);
        setIsComponent(false);
        setIsClientPopup(false);
        if (type == "SmartComponent") {
            var ComponentData: any = []
            if (AllItems != undefined && item1 != undefined) {
                AllItems.smartComponent = item1.smartComponent;
                item1.smartComponent.forEach((val: any) => {
                    ComponentData.push(val)
                })
                setSmartComponentData(ComponentData);
            }

        }

        if (type == "Category") {
            if (item1 != undefined && item1.Categories != "") {
                var title: any = {};
                title.Title = item1.categories;
                item1.categories.map((itenn: any) => {
                    if (!isItemExists(CategoriesData, itenn.Id)) {
                        CategoriesData.push(itenn);
                    }

                })
                item1.TaskCategories?.map((itenn: any) => {
                    CategoriesData.push(itenn)
                })

                setCategoriesData(CategoriesData)


            }
        }
        if (type == "Category-Task-Footertable") {

            setPhoneStatus(false)
            setEmailStatus(false)
            setImmediateStatus(false)
            setApprovalStatus(false)

            if (item1 != undefined && item1.length > 0) {
                item1?.map((itenn: any) => {
                    selectedCategoryTrue(itenn.Title)

                })

                setCategoriesData(item1)
            }
        }
        if (type == "ClientCategory") {
            var Data: any = []
            if (item1 != undefined && item1.Clientcategories != "") {
                var title: any = {};
                title.Title = item1.Clientcategories;
                item1.Clientcategories.map((itenn: any) => {
                    if (!isItemExists(ClientCategoriesData, itenn.Id)) {
                        Data.push(itenn);
                    }

                })
                setClientCategoriesData(Data)


            }
        }
        if (type == "LinkedComponent") {
            let ServiceData: any = []
            if (item1?.linkedComponent?.length > 0) {
                // Item.props.linkedComponent = item1.linkedComponent;
                // setEditData({ ...EditData, RelevantPortfolio: propsItems.linkedComponent })
                item1.linkedComponent.forEach((val: any) => {
                    ServiceData.push(val)
                })
                setLinkedComponentData(ServiceData);
                console.log("Popup component linkedComponent", item1.linkedComponent)
            }
        }
        if (type == "Service") {


            setSmartComponentData(item1);
            console.log("Popup component taskfootertable", item1)
        }


        if (CategoriesData != undefined) {
            CategoriesData?.forEach(function (type: any) {
                CheckCategory.forEach(function (val: any) {
                    if (type.Id == val.Id) {
                        BackupCat = type.Id
                        setcheckedCat(true)
                    }
                })

            })
            //   setUpdate(update+2)
        }


    }, []);
    const EditComponentPicker = (item: any) => {
        setIsComponentPicker(true);
        setSharewebCategory(item);

    }
    const EditClientCategory = (item: any) => {
        setIsClientPopup(true);
        setSharewebCategory(item);

    }
    // React.useMemo(()=>{
    //     copyImage((e:any)=>e)
    // },[])
    const froalaEditorConfig = {
        heightMin: 230,
        heightMax: 500,
        // width:250,
        pastePlain: true,
        wordPasteModal: false,
        listAdvancedTypes: false,
        paragraphDefaultSelection: 'Normal',
        attribution: false,
        quickInsertEnabled: false,
        imageAllowedTypes: ["jpeg", "jpg", "png", "gif"],
        placeholderText: "Copy & Paste Image Here!",
        key: 'nB3B2F2A1C2F2E1rA1C7A6D6E1D4G3E1C10C6eUd1QBRVCDLPAZMBQ==',

        events: {
            "image.beforeUpload": function (files: any, arg1: any, arg2: any) {
                defaultfile = files;
                var editor = this;
                if (files.length) {
                    // Create a File Reader.
                    var reader = new FileReader();
                    // Set the reader to insert images when they are loaded.
                    reader.onload = (e) => {
                        var result = e.target.result;
                        editor.image.insert(result, null, null, editor.image.get());
                    };
                    // Read image as base64.
                    reader.readAsDataURL(files[0]);
                    let data = files[0]
                    var reader = new FileReader();
                    reader.readAsDataURL(data);
                    let ImageRawData: any = ''
                    reader.onloadend = function () {
                        var base64String: any = reader.result;
                        console.log('Base64 String - ', base64String);
                        ImageRawData = base64String.substring(base64String.indexOf(', ') + 1)

                    }
                    if (ImageRawData.length > 0) {
                        imageArrayUpdateFunction(ImageRawData);
                    }

                }
                editor.popups.hideAll();
                return false;
            }
        }
    };

    // const froalaEditorConfig1 = {
    //     heightMin: 230,
    //     heightMax: 500,
    //     // width:250,
    //     pastePlain: true,
    //     wordPasteModal: false,
    //     listAdvancedTypes: false,
    //     paragraphDefaultSelection: 'Normal',
    //     attribution: false,
    //     quickInsertEnabled: false,
    //     imageAllowedTypes: ["jpeg", "jpg", "png", "gif"],
    //     placeholderText: "Copy & Paste Image Here!",
    //     key: 'nB3B2F2A1C2F2E1rA1C7A6D6E1D4G3E1C10C6eUd1QBRVCDLPAZMBQ==',

    //     events: {
    //         "image.beforeUpload": function (defaultfile: any, arg1: any, arg2: any) {
    //             // defaultfile = files;
    //             let files = defaultfile
    //             var editor = this;
    //             if (files.length) {
    //                 // Create a File Reader.
    //                 var reader = new FileReader();
    //                 // Set the reader to insert images when they are loaded.
    //                 reader.onload = (e) => {
    //                     var result = e.target.result;
    //                     editor.image.insert(result, null, null, editor.image.get());
    //                 };
    //                 // Read image as base64.
    //                 reader.readAsDataURL(files[0]);
    //                 let data = files[0]
    //                 var reader = new FileReader();
    //                 reader.readAsDataURL(data);
    //                 let ImageRawData: any = ''
    //                 reader.onloadend = function () {
    //                     var base64String: any = reader.result;
    //                     console.log('Base64 String - ', base64String);
    //                     ImageRawData = base64String.substring(base64String.indexOf(', ') + 1)

    //                 }
    //                 if (ImageRawData.length > 0) {
    //                   imageArrayUpdateFunction(ImageRawData);
    //                 }

    //             }
    //             editor.popups.hideAll();
    //             return false;
    //         }
    //     }
    // };
    const copyImage = (dt: any) => {

        let DataObject = {
            data_url: dt,
            file: "Image/jpg"
        }
        let arrayIndex: any = TaskImages?.length
        TaskImagess.push(DataObject)
        setTaskImages(TaskImagess)


    }
    const imageArrayUpdateFunction = (ImageData: any) => {
        let tempArray = ImageData.toString();
        let data1 = tempArray.split('"')
        copyImage(data1[1]);
    }
    const FlorarImageUploadComponentCallBack = (dt: any) => {
        copyImage(dt)
    }
    const deleteCategories = (id: any) => {
        CategoriesData.map((catId: { Id: any; }, index: any) => {
            if (id == catId.Id) {
                CategoriesData.splice(index, 1)
            }
        })
        setCategoriesData((CategoriesData: any) => ([...CategoriesData]));

    }
    const deleteClientCategories = (id: any) => {
        ClientCategoriesData.map((catId: { Id: any; }, index: any) => {
            if (id == catId.Id) {
                ClientCategoriesData.splice(index, 1)
            }
        })
        setClientCategoriesData((ClientCategoriesData: any) => ([...ClientCategoriesData]));

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
    const EditComponent = (items: any) => {

        setIsComponent(true);
        setSharewebComponent(items);

    }
    var LatestTaskNumber: any = ''
    var SharewebID: any = ''

    const getActivitiesDetails = async (item: any) => {
        // siteTypess?.forEach((ba:any)=>{
        //     if(item.Title == ba.Title){
        //         ba.IscreateTask = true;
        //         ba.isSiteSelect = true;
        //     }
        // })
        console.log(item)
        let web = new Web(dynamicList.siteUrl);
        let componentDetails:any = [];
        componentDetails = await web.lists
            .getById(item?.listId)
            .items
            .select("FolderID,TaskLevel,AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,AttachmentFiles/FileName,FileLeafRef,Title,Id,PriorityRank,PercentComplete,StartDate,DueDate,Status,Body,PercentComplete,Attachments,Priority,Created,Modified,TaskType/Id,TaskType/Title,TaskType/Level,TaskType/Prefix,ParentTask/Id,ParentTask/Title,Author/Id,Author/Title,Editor/Id,Editor/Title")
            .expand("TaskType,ParentTask,AssignedTo,AttachmentFiles,Author,Editor")
            .filter("TaskType/Title eq 'Activities'")
            .orderBy("TaskLevel", false)
            .top(4999)
            .get()
        console.log(componentDetails)
        if (componentDetails.length == 0) {
            LatestTaskNumber = 1;
            item.LatestTaskNumber = LatestTaskNumber
        } else {
            LatestTaskNumber = componentDetails[0].TaskLevel;
            LatestTaskNumber += 1;
            item.LatestTaskNumber = LatestTaskNumber
        }
        if (AllItems != undefined) {
            if (AllItems?.Portfolio_x0020_Type != undefined) {
                if (AllItems?.Portfolio_x0020_Type == 'Component') {
                    SharewebID = 'CA' + LatestTaskNumber;
                }
                if (AllItems?.Portfolio_x0020_Type == 'Service') {
                    SharewebID = 'SA' + LatestTaskNumber;
                }
                if (AllItems?.Portfolio_x0020_Type == 'Events') {
                    SharewebID = 'EA' + LatestTaskNumber;
                }
            } else {
                SharewebID = 'A' + LatestTaskNumber;
            }
            item.SharewebID = SharewebID
        }
        siteTypess?.forEach(async (val: any) => {
            if (val.IscreateTask == true) {
                if (AllItems?.NoteCall == 'Task' && AllItems.Item_x0020_Type == 'Component' || AllItems.Item_x0020_Type == 'SubComponent' || AllItems.Item_x0020_Type == 'Feature') {

                    let web = new Web(dynamicList.siteUrl);
                    let componentDetails:any = [];
                    componentDetails = await web.lists
                        .getById(val.listId)
                        .items
                        .select("FolderID,TaskLevel,TaskLevel,AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,FileLeafRef,Title,Id,PriorityRank,PercentComplete,Priority,Created,Modified,TaskType/Id,TaskType/Title,TaskType/Level,TaskType/Prefix,ParentTask/Id,ParentTask/Title,Author/Id,Author/Title,Editor/Id,Editor/Title")
                        .expand("TaskType,ParentTask,Author,Editor,AssignedTo")
                        .filter(`(TaskType/Title eq 'Workstream')&&(ParentTask/Id eq ${val.Id})`)
                        .orderBy("Created", false)
                        .top(4999)
                        .get()
                    console.log(componentDetails)
                    if (componentDetails.length == 0) {
                        WorstreamLatestId = 1;
                    } else {
                        WorstreamLatestId = componentDetails[0].TaskLevel + 1;
                    }
                    getTasktype();
                }
            }
        })




    }
    const closeTaskStatusUpdatePoup = (res: any) => {
        setTaskStatuspopup(false)
        props.Call(res);

    }

    const checkCat = (type: any) => {
        CheckCategory.map((catTitle: any) => {
            if (type == catTitle.Title) {
                NewArray.push(catTitle);
            }
        });
    };

    const HtmlEditorCallBack = React.useCallback((EditorData: any) => {

        if (EditorData.length > 8) {
            AllItems.Body = EditorData;

            let param: any = Moment(new Date().toLocaleString())

            FeedBackItem['Title'] = "FeedBackPicture" + param;
            FeedBackItem['FeedBackDescriptions'] = [];
            FeedBackItem.FeedBackDescriptions = [{
                'Title': EditorData
            }]
            FeedBackItem['ImageDate'] = "" + param;
            FeedBackItem['Completed'] = '';

        }


    }, [])
    // const tooltiphierarchy = React.useMemo(() => {
    //     if (action === true) {
    //         return getTooltiphierarchyWithoutGroupByTable(props.props);
    //     }
    //     return [];
    // }, [action]);

    const saveNoteCall = () => {


        if (save?.IsShowSelectedSite === false && AllItems?.NoteCall !== 'Task')
            alert("Please select the site")
        else {
            FeedBackItemArray.push(FeedBackItem?.FeedBackDescriptions != undefined ? FeedBackItem : "")
            var TaskprofileId: any = ''
            if (NewArray != undefined && NewArray.length > 0) {
                NewArray.map((NeitemA: any) => {
                    CategoriesData.push(NeitemA);
                });
            }
            var RelevantPortfolioIds: any = []
            var Component: any = []
            if (smartComponentData != undefined && smartComponentData.length > 0) {

            }
            smartComponentData?.forEach((com: any) => {
                if (smartComponentData[0] != undefined && smartComponentData[0].TaskType != undefined && smartComponentData[0].TaskType.Title == 'Workstream') {
                    $.each(com.Component, function (index: any, smart: any) {
                        Component.push(smart.Id)
                    })
                }
            })
            var RelevantPortfolioIds: any = []
            var Component: any = []
            smartComponentData?.forEach((com: any) => {
                if (smartComponentData[0] != undefined && smartComponentData[0].TaskType != undefined && smartComponentData[0].TaskType.Title == 'Workstream') {
                    $.each(com.Component, function (index: any, smart: any) {
                        Component.push(smart.Id)
                    })
                }
                else {

                    if (com != undefined) {
                        Component.push(com.Id)
                    }
                }

            })
            if (linkedComponentData.length == 0) {
                if (portfolioId != '') {
                    RelevantPortfolioIds.push(portfolioId)
                }

            }
            if (linkedComponentData != undefined && linkedComponentData?.length > 0) {
                linkedComponentData?.map((com: any) => {
                    if (linkedComponentData != undefined && linkedComponentData?.length >= 0) {
                        if (linkedComponentData[0] != undefined && linkedComponentData[0].TaskType != undefined && linkedComponentData[0].TaskType.Title == 'Workstream' || linkedComponentData[0].TaskType == 'Workstream') {
                            $.each(com.Services, function (index: any, smart: any) {
                                RelevantPortfolioIds.push(smart.Id)
                            })
                        }
                        else {
                            $.each(linkedComponentData, function (index: any, smart: any) {
                                RelevantPortfolioIds.push(smart.Id)
                            })
                        }
                    }
                })
            }
            var categoriesItem = '';
            CategoriesData.map((category:any) => {
                if (category.Title != undefined) {
                    categoriesItem = categoriesItem == "" ? category.Title : categoriesItem + ';' + category.Title;
                }
            })
            var CategoryID: any = []
            CategoriesData.map((category:any) => {
                if (category.Id != undefined) {
                    CategoryID.push(category.Id)
                }
            })
            var ClientCategory: any = []
            if (ClientCategoriesData != undefined && ClientCategoriesData.length > 0) {


                ClientCategoriesData.map((val: any) => {
                    if (val.Id != undefined) {
                        ClientCategory.push(val.Id)
                    }
                })
            }
            if (AllItems?.AssignedTo != undefined && AllItems?.AssignedTo?.length > 0) {
                AllItems.AssignedTo.forEach((obj: any) => {
                    AssignedToIds.push(obj.Id);
                })
            }
            if (isDropItemRes == true) {
                if (TaskAssignedTo != undefined && TaskAssignedTo?.length > 0) {
                    TaskAssignedTo.map((taskInfo:any) => {
                        AssignedToIds.push(taskInfo.Id);
                    })
                }
            }
            if (AllItems?.TeamMembers != undefined && AllItems?.TeamMembers?.length > 0) {
                AllItems.TeamMembers.forEach((obj: any) => {
                    TeamMemberIds.push(obj.Id);
                })
            }
            if (isDropItem == true) {
                if (TaskTeamMembers != undefined && TaskTeamMembers?.length > 0) {
                    TaskTeamMembers.map((taskInfo:any) => {
                        TeamMemberIds.push(taskInfo.Id);
                    })
                }
            }
            if (AllItems?.ResponsibleTeam != undefined && AllItems?.ResponsibleTeam?.length > 0) {
                AllItems.ResponsibleTeam.forEach((obj: any) => {
                    ResponsibleTeamIds.push(obj.Id);
                })
            }
            if (isDropItem == true) {
                if (TaskResponsibleTeam != undefined && TaskResponsibleTeam?.length > 0) {
                    TaskResponsibleTeam.map((taskInfo:any) => {
                        ResponsibleTeamIds.push(taskInfo.Id);
                    })
                }
            }

            siteTypess.forEach(async (value: any) => {
                let Tasklevel: any = ''
                let TaskID = ''
                let prentID = ''
                let LetestLevelData:any = []
                if (value.IscreateTask == true) {
                    if (AllItems?.NoteCall != 'Task') {
                        let web = new Web(dynamicList.siteUrl);

                        AllMatsterAndTaskData?.forEach((val:any)=>{
                            if(val?.ParentTask?.Id == props?.props?.Id){
                                TaskID = val.TaskID
                                prentID = val.ID;
                            }
                          })

                          let componentDetails: any = [];
                          componentDetails = await web.lists
                              .getById(value.listId)
                              .items
                              .select("Id,Title,TaskType/Id,TaskType/Title,TaskLevel")
                              .expand('TaskType')
                              .orderBy("Id", false)
                              .filter("TaskType/Title eq 'Activities'")
                              .top(1)
                              .get()
                          console.log(componentDetails)
                          var LatestId = componentDetails[0].TaskLevel + 1;
                          Tasklevel = LatestId
                          TaskID =  'A' + LatestId 
                     

                        // AllItems?.subRows?.forEach((vall: any) => {
                        //     if (vall?.TaskType?.Title == 'Activities' || vall?.TaskType?.Title == 'Activities') {
                        //         LetestLevelData.push(vall)
                        //     }

                        // })
                        // if (LetestLevelData.length == 0) {
                        //     Tasklevel = 1
                        //     TaskID = props?.props?.PortfolioStructureID + '-A' + Tasklevel 
                        // }
                        // else {
                        //     Tasklevel = LetestLevelData.length + 1
                        //     TaskID = props?.props?.PortfolioStructureID + '-A' + Tasklevel 
                        // }

                        // if (AllItems.Title == undefined) {
                        //     alert("Enter The Task Name");
                        // }
                        // else if (AllItems?.SiteListItem == undefined) {
                        //     alert("Select Task List.");
                        // }
                        if (value.selectSiteName == true) {
                            var Title = save.Title != undefined && save.Title != '' ? save.Title + value.Title : post.Title + value.Title
                            save.Title = ''
                        }
                        else {
                            var Title = save.Title != undefined && save.Title != '' ? save.Title : post.Title
                        }

                       
                        if (Task == undefined || Task == '')
                            Task = SelectedTasks[0];
                        if (TaskprofileId == '' || SelectedTasks.length > 0) {
                            TaskprofileId = SelectedTasks[0].Id;
                        }
                        if (SharewebTasknewTypeId == 2 || SharewebTasknewTypeId == 6) {


                            if (Task?.Portfolio_x0020_Type != undefined && Task?.Portfolio_x0020_Type == 'Component' || Task?.Component != undefined && Task?.Component?.length > 0 && AllItems.TaskLevel != undefined) {
                                SharewebID = 'A' + AllItems.TaskLevel + '-T' + LatestId;
                            }
                            if (Task?.Services != undefined && Task?.Portfolio_x0020_Type == 'Service' || Task?.Services != undefined && Task?.Services?.length > 0 && AllItems.TaskLevel != undefined) {
                                SharewebID = 'SA' + AllItems.TaskLevel + '-T' + LatestId;
                            }
                            if ((Task?.Services != undefined && Task?.Portfolio_x0020_Type == 'Service') || (Task?.Services != undefined && Task?.Services?.length > 0) && (Task.TaskType.Title == "Workstream" || Task.TaskType == 'Workstream')) {
                                SharewebID = 'SA' + AllItems.TaskLevel + '-W' + WorstreamLatestId + '-T' + LatestId;
                            }

                            if (Task?.Events != undefined && Task?.Portfolio_x0020_Type == 'Events') {
                                SharewebID = 'EA' + AllItems?.TaskLevel + '-T' + LatestId;
                            }
                            if (AllItems.TaskLevel == undefined && Task?.Portfolio_x0020_Type.toLowerCase() == 'service') {
                                SharewebID = 'SA' + LatestId;
                            }
                            if (AllItems.TaskLevel == undefined && Task?.Portfolio_x0020_Type == 'Component') {
                                SharewebID = 'CA' + LatestId;
                            }
                        }
                        else {
                            SharewebID = 'A' + LatestId;
                            SharewebTasknewTypeId = 2;
                            WorstreamLatestId = undefined;
                        }
                        var MyTaskID = TaskID + LatestId;

                        await web.lists.getById(value.listId).items.add({
                            Title: Title != undefined && Title != '' ? Title : post.Title,
                            ComponentId: { "results": Component },
                            Categories: categoriesItem ? categoriesItem : null,
                            //DueDate: date != undefined ? new Date(date).toDateString() : date,
                            DueDate: date != undefined ? Moment(date).format("MM-DD-YYYY") : null,
                            SharewebCategoriesId: { "results": CategoryID },
                            ClientCategoryId: { "results": ClientCategory },
                            ServicesId: { "results": RelevantPortfolioIds },
                            PortfolioId: portFolio,
                            PortfolioTypeId: portFolioTypeId == undefined ? null : portFolioTypeId[0]?.Id,
                            TaskTypeId: 1,
                            SharewebTaskTypeId: 1,
                            Body: AllItems.Body,
                            FeedBack: FeedBackItemArray[0] != "" ? JSON.stringify(FeedBackItemArray) : null,
                            AssignedToId: { "results": (AssignedToIds != undefined && AssignedToIds?.length > 0) ? AssignedToIds : [] },
                            ResponsibleTeamId: { "results": (ResponsibleTeamIds != undefined && ResponsibleTeamIds?.length > 0) ? ResponsibleTeamIds : [] },
                            TeamMembersId: { "results": (TeamMemberIds != undefined && TeamMemberIds?.length > 0) ? TeamMemberIds : [] },
                            SiteCompositionSettings: JSON.stringify(AllItems.SiteCompositionSettingsbackup),
                            ClientTime: JSON.stringify(AllItems.Sitestaggingbackup),
                            TaskID: TaskID,
                            TaskLevel: Tasklevel

                        }).then((res: any) => {
                            res.data['SiteIcon'] = value.Item_x005F_x0020_Cover?.Url
                            res.data['listId'] = value?.listId
                            res.data['PortfolioType'] =  portFolioTypeId == undefined ? null : portFolioTypeId[0],
                            res.data['Portfolio'] = { 'Id': portFolio };
                            res.data['TaskType'] = { 'Id': res.data.TaskTypeId };
                            // res.data['TaskType'] =
                            res.data.DueDate = date ? Moment(date).format("MM-DD-YYYY") : null,
                                res.data['siteType'] = value.siteName

                            res.data.ParentTaskId = AllItems.Id
                            res.data.ClientCategory = []
                            res.data.AssignedTo = []
                            res.data.TeamMembers = []
                            res.data.ResponsibleTeam = []
                            var MyData = res.data;
                            if (res?.data?.TeamMembersId?.length > 0) {
                                res.data?.TeamMembersId?.map((teamUser: any) => {
                                    let elementFound = props?.TaskUsers?.filter((User: any) => {
                                        if (User?.AssingedToUser?.Id == teamUser) {
                                            res.data.TeamMembers.push(User?.AssingedToUser)
                                        }
                                    })

                                })
                            }
                            if (res?.data?.ResponsibleTeamId?.length > 0) {
                                res.data?.ResponsibleTeamId?.map((teamUser: any) => {
                                    let elementFound = props?.TaskUsers?.filter((User: any) => {
                                        if (User?.AssingedToUser?.Id == teamUser) {
                                            res.data.ResponsibleTeam.push(User?.AssingedToUser);
                                        }
                                    })

                                })
                            }
                            if (res?.data?.AssignedToId?.length > 0) {
                                res.data?.AssignedToId?.map((teamUser: any) => {
                                    let elementFound = props?.TaskUsers?.filter((User: any) => {
                                        if (User?.AssingedToUser?.Id == teamUser) {
                                            res.data.AssignedTo.push(User?.AssingedToUser)
                                        }
                                    })

                                })
                            }
                            if (res?.data?.ClientCategoryId?.length > 0) {
                                res.data?.ClientCategoryId?.map((category: any) => {
                                    let elementFound = AllClientCategory?.filter((metaCategory: any) => metaCategory?.Id == category)
                                    if (elementFound) {
                                        res.data.ClientCategory.push(elementFound[0]);
                                    }
                                })
                            }
                            res.data.Clientcategories = res.data.ClientCategory;

                            let fileName: any = '';
                            let tempArray: any = [];
                            // let SiteUrl = SiteUrl;
                            if (TaskImages != undefined && TaskImages.length > 0) {
                                TaskImages?.map(async (imgItem: any, index: number) => {
                                    if (imgItem.data_url != undefined && imgItem.file != undefined) {
                                        let date = new Date()
                                        let timeStamp = date.getTime();
                                        fileName = 'Image' + "-" + res.data.Title + " " + res.data.Title + timeStamp + ".jpg"
                                        let ImgArray = {
                                            ImageName: fileName,
                                            UploadeDate: Moment(new Date()).format("DD/MM/YYYY"),
                                            imageDataUrl: dynamicList?.siteUrl + '/Lists/' + res.data.siteType + '/Attachments/' + res?.data.Id + '/' + fileName,
                                            ImageUrl: imgItem.data_url,
                                            
                                        };
                                        tempArray.push(ImgArray);
                                    }
                                })
                                tempArray?.map((tempItem: any) => {
                                    tempItem.Checked = false
                                })
                                var src = TaskImages[0].data_url?.split(",")[1];
                                var byteArray = new Uint8Array(atob(src)?.split("")?.map(function (c) {
                                    return c.charCodeAt(0);
                                }));
                                const data: any = byteArray
                                var fileData = '';
                                for (var i = 0; i < byteArray.byteLength; i++) {
                                    fileData += String.fromCharCode(byteArray[i]);
                                }
                                if (res.data.listId != undefined) {
                                    let web = new Web(dynamicList?.siteUrl);
                                    let item = web.lists.getById(res.data.listId).items.getById(res.data.Id);
                                    item.attachmentFiles.add(fileName, data).then((res) => {

                                        console.log("Attachment added");




                                        UpdateBasicImageInfoJSON(tempArray, MyData);




                                    })

                                }
                            }

                            if (AllItems.PageType == 'ProjectManagement') {
                                props.Call();
                                let url = `${dynamicList.siteUrl}/SitePages/Task-Profile.aspx?taskId=${res.data.Id}&Site=${res.data.siteType}`
                                window.location.href = url;
                            }
                            else {
                                console.log(res);
                                closeTaskStatusUpdatePoup(res);
                                console.log(res);
                            }

                            //closeTaskStatusUpdatePoup(res);


                        })
                    }
                    if (AllItems?.NoteCall == 'Task') {
                        let web = new Web(dynamicList.siteUrl);
                        let componentDetails: any = [];
                        componentDetails = await web.lists
                            .getById(value.listId)
                            .items
                            .select("Id,Title")
                            .orderBy("Id", false)
                            .top(1)
                            .get()
                        console.log(componentDetails)
                        var LatestId = componentDetails[0].Id + 1;

                        if(AllItems?.TaskType?.Title == 'Workstream' || AllItems?.SharewebTaskType?.Title == 'Workstream'){
                            TaskID = props?.props?.TaskID + '-T' + LatestId;
                        }
                        else{
                            TaskID =  '-T' + LatestId;
                        }
                       

                        if (Task == undefined || Task == '')
                            Task = SelectedTasks[0];
                        if (TaskprofileId == '' || SelectedTasks.length > 0) {
                            TaskprofileId = SelectedTasks[0].Id;
                        }
                        // var PortfolioStructureId = ''
                        // AllItems?.subRows?.forEach((vall: any) => {
                        //     if (vall?.TaskType?.Title == 'Task' || vall?.TaskType?.Title == 'Task') {
                        //         LetestLevelData.push(vall)
                        //     }

                        // })
                        // if (LetestLevelData.length == 0) {
                        //     Tasklevel = 1
                        //     TaskID = props?.props?.TaskID + '-T' + LatestId;;
                        // }
                        // else {
                        //     Tasklevel = LetestLevelData.length + 1
                        //     TaskID = props?.props?.TaskID + '-T'  + LatestId; 
                        // }
                        if (SharewebTasknewTypeId == 2 || SharewebTasknewTypeId == 6) {
                            var SharewebID = '';
                            if (Task?.Portfolio_x0020_Type != undefined && Task?.Portfolio_x0020_Type == 'Component' || Task?.Component != undefined && Task?.Component?.length > 0) {
                                SharewebID = 'A' + AllItems.TaskLevel + '-W' + WorstreamLatestId + '-T' + LatestId;
                            }
                            if (Task?.Services != undefined && Task?.Portfolio_x0020_Type?.toLowerCase() == 'service' || Task?.Services != undefined && Task?.Services?.length > 0) {
                                SharewebID = 'SA' + AllItems.TaskLevel + '-T' + LatestId;
                            }
                            if ((Task?.Services != undefined && Task?.Services?.length > 0) && (Task?.TaskType?.Title == "Workstream" || Task?.TaskType == 'Workstream')) {
                                SharewebID = 'SA' + AllItems.TaskLevel + '-W' + WorstreamLatestId + '-T' + LatestId;
                            }
                            if ((Task?.Services == undefined) && (Task?.TaskType?.Title == "Workstream" || Task?.TaskType == 'Workstream')) {
                                SharewebID = 'SA' + AllItems.TaskLevel + '-W' + WorstreamLatestId + '-T' + LatestId;
                            }

                            if (Task?.Events != undefined && Task?.Portfolio_x0020_Type == 'Events') {
                                SharewebID = 'EA' + AllItems?.TaskLevel + '-T' + LatestId;
                            }
                            if (AllItems.TaskLevel == undefined) {
                                WorstreamLatestId = AllItems?.TaskLevel;
                            }
                        } else { SharewebID = 'A' + AllItems.Id; SharewebTasknewTypeId = 2; WorstreamLatestId = undefined; }
                        // var Portfolio: any = []
                        // var PortfolioType: any = []
                        // if (Component != undefined && Component.length > 0) {
                        //     Portfolio.push(Component[0])
                        //     PortfolioType.push(1)
                        // }
                        // if (RelevantPortfolioIds != undefined && RelevantPortfolioIds.length > 0) {
                        //     Portfolio.push(RelevantPortfolioIds[0])
                        //     PortfolioType.push(2)
                        // }
                        var arrayy = []
                        web = new Web(dynamicList.siteUrl);
                        await web.lists.getById(value.listId).items.add({
                            Title: save.Title != undefined && save.Title != '' ? save.Title : post.Title,
                            ComponentId: { "results": Component },
                            Categories: categoriesItem ? categoriesItem : null,
                            PriorityRank: AllItems.PriorityRank,
                            // DueDate: date != undefined ? new Date(date).toDateString() : date,
                            DueDate: date != undefined ? Moment(date).format("MM-DD-YYYY") : null,
                            ServicesId: { "results": RelevantPortfolioIds },
                            SharewebCategoriesId: { "results": CategoryID },
                            PortfolioId: AllItems.Id,
                            PortfolioTypeId: portFolioTypeId == undefined ? null : portFolioTypeId[0]?.Id,
                            TaskTypeId: SharewebTasknewTypeId,
                            ParentTaskId: AllItems.Id,
                            ClientCategoryId: { "results": ClientCategory },
                            SharewebTaskTypeId: SharewebTasknewTypeId,
                            Body: AllItems?.Description,
                            FeedBack: FeedBackItemArray[0] != "" ? JSON.stringify(FeedBackItemArray) : null,
                            //TaskID: SharewebID,
                            Priority: AllItems.Priority,
                            AssignedToId: { "results": (AssignedToIds != undefined && AssignedToIds?.length > 0) ? AssignedToIds : [] },
                            Responsible_x0020_TeamId: { "results": (ResponsibleTeamIds != undefined && ResponsibleTeamIds?.length > 0) ? ResponsibleTeamIds : [] },
                            Team_x0020_MembersId: { "results": (TeamMemberIds != undefined && TeamMemberIds?.length > 0) ? TeamMemberIds : [] },
                            SiteCompositionSettings: JSON.stringify(AllItems.SiteCompositionSettingsbackup),
                            ClientTime: JSON.stringify(AllItems?.ClientTime),
                            TaskID: TaskID,
                         

                        }).then((res: any) => {
                            res.data['SiteIcon'] = value.Item_x005F_x0020_Cover?.Url
                            res.data['listId'] = value?.listId
                            res.data['PortfolioType'] =  portFolioTypeId == undefined ? null : portFolioTypeId[0],
                            res.data['Portfolio'] = { 'Id': portFolio };
                            res.data['TaskType'] = { 'Id': res.data.TaskTypeId };
                            // res.data['TaskType'] =
                            res.data.DueDate = date ? Moment(date).format("MM-DD-YYYY") : null,
                                res.data['siteType'] = value.siteName

                            res.data.ParentTaskId = AllItems.Id
                            res.data.ClientCategory = []
                            res.data.AssignedTo = []
                            res.data.TeamMembers = []
                            res.data.ResponsibleTeam = []
                            var MyData = res.data;
                            if (res?.data?.TeamMembersId?.length > 0) {
                                res.data?.TeamMembersId?.map((teamUser: any) => {
                                    let elementFound = props?.TaskUsers?.filter((User: any) => {
                                        if (User?.AssingedToUser?.Id == teamUser) {
                                            res.data.TeamMembers.push(User?.AssingedToUser)
                                        }
                                    })

                                })
                            }
                            if (res?.data?.ResponsibleTeamId?.length > 0) {
                                res.data?.ResponsibleTeamId?.map((teamUser: any) => {
                                    let elementFound = props?.TaskUsers?.filter((User: any) => {
                                        if (User?.AssingedToUser?.Id == teamUser) {
                                            res.data.ResponsibleTeam.push(User?.AssingedToUser);
                                        }
                                    })

                                })
                            }
                            if (res?.data?.AssignedToId?.length > 0) {
                                res.data?.AssignedToId?.map((teamUser: any) => {
                                    let elementFound = props?.TaskUsers?.filter((User: any) => {
                                        if (User?.AssingedToUser?.Id == teamUser) {
                                            res.data.AssignedTo.push(User?.AssingedToUser)
                                        }
                                    })

                                })
                            }
                            if (res?.data?.ClientCategoryId?.length > 0) {
                                res.data?.ClientCategoryId?.map((category: any) => {
                                    let elementFound = AllClientCategory?.filter((metaCategory: any) => metaCategory?.Id == category)
                                    if (elementFound) {
                                        res.data.ClientCategory.push(elementFound[0]);
                                    }
                                })
                            }
                            res.data.Clientcategories = res.data.ClientCategory;

                            let fileName: any = '';
                            let tempArray: any = [];
                            // let SiteUrl = SiteUrl;
                            if (TaskImages != undefined && TaskImages.length > 0) {
                                TaskImages?.map(async (imgItem: any, index: number) => {
                                    if (imgItem.data_url != undefined && imgItem.file != undefined) {
                                        let date = new Date()
                                        let timeStamp = date.getTime();
                                        fileName = 'Image' + "-" + res.data.Title + " " + res.data.Title + timeStamp + ".jpg"
                                        let ImgArray = {
                                            ImageName: fileName,
                                            UploadeDate: Moment(new Date()).format("DD/MM/YYYY"),
                                            imageDataUrl: dynamicList?.siteUrl + '/Lists/' + res.data.siteType + '/Attachments/' + res?.data.Id + '/' + fileName,
                                            ImageUrl: imgItem.data_url,
                                            
                                        };
                                        tempArray.push(ImgArray);
                                    }
                                })
                                tempArray?.map((tempItem: any) => {
                                    tempItem.Checked = false
                                })
                                var src = TaskImages[0].data_url?.split(",")[1];
                                var byteArray = new Uint8Array(atob(src)?.split("")?.map(function (c) {
                                    return c.charCodeAt(0);
                                }));
                                const data: any = byteArray
                                var fileData = '';
                                for (var i = 0; i < byteArray.byteLength; i++) {
                                    fileData += String.fromCharCode(byteArray[i]);
                                }
                                if (res.data.listId != undefined) {
                                    let web = new Web(dynamicList?.siteUrl);
                                    let item = web.lists.getById(res.data.listId).items.getById(res.data.Id);
                                    item.attachmentFiles.add(fileName, data).then((res) => {

                                        console.log("Attachment added");




                                        UpdateBasicImageInfoJSON(tempArray, MyData);




                                    })

                                }
                            }

                            if (AllItems.PageType == 'ProjectManagement') {
                                props.Call();
                                let url = `${dynamicList.siteUrl}/SitePages/Task-Profile.aspx?taskId=${res.data.Id}&Site=${res.data.siteType}`
                                window.location.href = url;
                            }
                            else {
                                console.log(res);
                                closeTaskStatusUpdatePoup(res);
                                console.log(res);
                            }

                            //closeTaskStatusUpdatePoup(res);


                        })
                        // }
                    }
                }
            })
        }
    }


    const UpdateBasicImageInfoJSON = async (tempArray: any, item: any) => {
        var UploadImageArray: any = []
        if (tempArray != undefined && tempArray.length > 0) {
            tempArray?.map((imgItem: any) => {
                if (imgItem.imageDataUrl != undefined && imgItem.imageDataUrl != null) {
                    let tempObject: any = {
                        ImageName: imgItem.ImageName,
                        ImageUrl: imgItem.imageDataUrl,
                        UploadeDate: imgItem.UploadeDate,
                        // UserName: imgItem.UserName,
                        // UserImage: imgItem.UserImage
                    }
                    UploadImageArray.push(tempObject)
                } else {
                    UploadImageArray.push(imgItem);
                }
            })
        }
        if (UploadImageArray != undefined && UploadImageArray.length > 0) {
            try {
                let web = new Web(dynamicList?.siteUrl);
                await web.lists.getById(item.listId).items.getById(item.Id).update({ BasicImageInfo: JSON.stringify(UploadImageArray) }).then((res: any) => { console.log("Image JSON Updated !!") })
            } catch (error) {
                console.log("Error Message :", error);
            }
        }
    }
    function DDComponentCallBack(dt: any) {
        // setTeamConfig(dt)
        setisDropItem(dt.isDrop)
        setisDropItemRes(dt.isDropRes)
        console.log(dt)
        if (dt?.AssignedTo?.length > 0) {
            let tempArray: any = [];
            dt.AssignedTo?.map((arrayData: any) => {
                if (arrayData.AssingedToUser != null) {
                    tempArray.push(arrayData.AssingedToUser)
                } else {
                    tempArray.push(arrayData);
                }
            })
            setTaskAssignedTo(tempArray);
            console.log("Team Config  assigadf=====", tempArray)
        } else {
            setTaskAssignedTo([]);

        }
        if (dt?.TeamMemberUsers?.length > 0) {
            let tempArray: any = [];
            dt.TeamMemberUsers?.map((arrayData: any) => {
                if (arrayData.AssingedToUser != null) {
                    tempArray.push(arrayData.AssingedToUser)
                } else {
                    tempArray.push(arrayData);
                }
            })
            setTaskTeamMembers(tempArray);
            console.log("Team Config member=====", tempArray)

        } else {
            setTaskTeamMembers([]);
        }
        if (dt.ResponsibleTeam != undefined && dt.ResponsibleTeam.length > 0) {
            let tempArray: any = [];
            dt.ResponsibleTeam?.map((arrayData: any) => {
                if (arrayData.AssingedToUser != null) {
                    tempArray.push(arrayData.AssingedToUser)
                } else {
                    tempArray.push(arrayData);
                }
            })
            setTaskResponsibleTeam(tempArray);
            console.log("Team Config reasponsible ===== ", tempArray)

        }
        else {
            setTaskResponsibleTeam([])
        }
    }


    const handleDatedue = (date: any) => {
        AllItems.DueDate = date;
        var finalDate:any = Moment(date).format("YYYY-MM-DD")
        setDate(finalDate);

    };
    // const Priority = (e: any) => {
    //     if (e.target.value == '1' || e.target.value == '2' || e.target.value == '3') {
    //         setselectPriority(e.target.value)
    //         setPriorityy(true)
    //     }
    //     if (e.target.value == '4' || e.target.value == '5' || e.target.value == '6' || e.target.value == '7') {
    //         setselectPriority(e.target.value)
    //         setPriorityy(true)
    //     }
    //     if (e.target.value == '8' || e.target.value == '9' || e.target.value == '10') {
    //         setselectPriority(e.target.value)
    //         setPriorityy(true)
    //     }

    // }
    const onRenderCustomHeaderMain = () => {
        return (
            <div className={AllItems?.Portfolio_x0020_Type == 'Service' || AllItems?.Services?.length > 0 ? "serviepannelgreena d-flex full-width pb-1" : "d-flex full-width pb-1"} >
                <div style={{ marginRight: "auto", fontSize: "20px", fontWeight: "600", marginLeft: '20px' }}>
                    <h2 className='heading'>
                        {`Create Quick Option - ${AllItems?.NoteCall}`}
                    </h2>
                </div>
                <Tooltip ComponentId={1746} />
            </div>
        );
    };
    const SelectSiteType = () => {
        var mySite: any = []
        siteTypess.forEach((value: any) => {
            value.selectSiteName = true;
        })
        setSite('Site Name')
        setCount(count + 1)
    }
    let ArrayImage: any[] = []
    const onModelChange = (model: any) => {
        isModelChange = true;
        let edData = model;
        let imgArray = model.split("=")

        imgArray?.map((data: any, index: any) => {
            if (imgArray?.length > 8) {
                if (index == 1) {
                    ArrayImage.push(data)
                }
            }

        })
        let elem = document.createElement("img");
        elem.innerHTML = edData;
        imageArrayUpdateFunction(ArrayImage);
    };

    //  ###################  Smart Category Auto Suggesution Functions  ##################

    const autoSuggestionsForCategory = (e: any) => {
        let searchedKey: any = e.target.value;
        setCategorySearchKey(e.target.value);
        let tempArray: any = [];
        if (searchedKey?.length > 0) {
            AutoCompleteItemsArray?.map((itemData: any) => {
                if (itemData.Newlabel.toLowerCase().includes(searchedKey.toLowerCase())) {
                    tempArray.push(itemData);
                }
            })
            setSearchedCategoryData(tempArray);
        } else {
            setSearchedCategoryData([]);
        }
    }


    ///======================================auto suggestion =====================

    var AutoCompleteItems: any = [];
    const loadAllCategoryData = function (SmartTaxonomy: any) {
        var AllTaskusers = []
        var AllMetaData: any = []
        var TaxonomyItems: any = []
        var url = (`${dynamicList.siteUrl}/_api/web/lists/getbyid('${dynamicList?.SmartMetadataListID}')/items?$select=Id,Title,IsVisible,ParentID,SmartSuggestions,TaxType,Description1,Item_x005F_x0020_Cover,listId,siteName,siteUrl,SortOrder,SmartFilters,Selectable,IsSendAttentionEmail/Id,IsSendAttentionEmail/Title,IsSendAttentionEmail/EMail&$expand=IsSendAttentionEmail&$orderby=SortOrder&$top=4999&$filter=TaxType eq '` + SmartTaxonomy + "'")
        $.ajax({
            url: url,
            method: "GET",
            headers: {
                "Accept": "application/json; odata=verbose"
            },
            success: function (data) {
                AllTaskusers = data.d.results;
                $.each(AllTaskusers, function (index: any, item: any) {
                    if (item.Title.toLowerCase() == 'pse' && item.TaxType == 'Client Category') {
                        item.newTitle = 'EPS';
                    }
                    else if (item.Title.toLowerCase() == 'e+i' && item.TaxType == 'Client Category') {
                        item.newTitle = 'EI';
                    }
                    else if (item.Title.toLowerCase() == 'education' && item.TaxType == 'Client Category') {
                        item.newTitle = 'Education';
                    }
                    else {
                        item.newTitle = item.Title;
                    }
                    AllMetaData.push(item);

                })
                if (SmartTaxonomy == "Categories") {
                    TaxonomyItems = loadSmartTaxonomyPortfolioPopup(AllMetaData, SmartTaxonomy);
                    setAllCategoryData(TaxonomyItems)
                    TaxonomyItems?.map((items: any) => {
                        if (items.Title == "Actions") {
                            ShowCategoryDatabackup = ShowCategoryDatabackup.concat(items.childs)
                        }
                    })

                }
            },
            error: function (error: any) {
                console.log('Error:', error)
            }
        })
    };
    // **************** this is for Smart Category Data fetch from Backend and Call Back functions ******************

    //  ######################  This is Smart Category Get Data Call From Backend and Bulid Nested Array According to Parent Child Categories #######################

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

    if (AllCategoryData?.length > 0) {
        AllCategoryData?.map((item: any) => {
            if (item.newTitle != undefined) {
                item['Newlabel'] = item.newTitle;
                AutoCompleteItems.push(item)
                if (item.childs != null && item.childs != undefined && item.childs.length > 0) {
                    item.childs.map((childitem: any) => {
                        if (childitem.newTitle != undefined) {
                            childitem['Newlabel'] = item['Newlabel'] + ' > ' + childitem.Title;
                            AutoCompleteItems.push(childitem)
                        }
                        if (childitem.childs.length > 0) {
                            childitem.childs.map((subchilditem: any) => {
                                if (subchilditem.newTitle != undefined) {
                                    subchilditem['Newlabel'] = childitem['Newlabel'] + ' > ' + subchilditem.Title;
                                    AutoCompleteItems.push(subchilditem)
                                }
                            })
                        }
                    })
                }
            }
        })
    }

    AutoCompleteItemsArray = AutoCompleteItems.reduce(function (previous: any, current: any) {
        var alredyExists = previous.filter(function (item: any) {
            return item.Title === current.Title
        }).length > 0
        if (!alredyExists) {
            previous.push(current)
        }
        return previous
    }, [])

    //  ###################  Smart Category slection Common Functions with Validations ##################

    const setSelectedCategoryData = (selectCategoryData: any, usedFor: any) => {
        setCategorySearchKey("");
        console.log(selectCategoryData)
        selectedCategoryTrue(selectCategoryData[0].Title)

        setIsComponentPicker(false);
        let data: any = CategoriesData
        CategoriesData?.map((items: any) => {
            if (items.Id != selectCategoryData[0].Id) {
                data = data.concat(selectCategoryData)
            }
        })


        setCategoriesData((CategoriesData: any) => [...data])


        setSearchedCategoryData([]);

        // setCategoriesData(data)
    }
    // ==============CHANGE Category function==============
    const CategoryChange = (e: any, typeValue: any, IdValue: any) => {
        let statusValue: any = e.currentTarget.checked;
        let type: any = typeValue;
        let Id: any = IdValue;
        if (statusValue) {

            selectedCategoryTrue(type)
            console.log(ShowCategoryDatabackup)
            let array: any = [];

            array = array.concat(CategoriesData);
            ShowCategoryDatabackup.map((items: any) => {
                if (items.Title == type) {
                    array.push(items)
                }
            })

            setCategoriesData((CategoriesData: any) => [...array])
        }
        if (statusValue == false) {

            selectedCategoryFalse(type)
            console.log(ShowCategoryDatabackup)
            let array: any = [];

            array = array.concat(CategoriesData);
            array?.map((item: any, index: any) => {

                if (item.Title == type) {
                    array.splice(index, 1);
                }
            })
            setCategoriesData((CategoriesData: any) => [...array])
        }


    }

    const selectedCategoryFalse = (type: any) => {
        if (type == "Phone") {
            setPhoneStatus(false)
        }
        if (type == "Email Notification") {
            setEmailStatus(false)
        }
        if (type == "Immediate") {
            setImmediateStatus(false)
        }
        if (type == "Approval") {
            setApprovalStatus(false)
        }
    }
    const selectedCategoryTrue = (type: any) => {
        if (type == "Phone") {
            setPhoneStatus(true)
        }
        if (type == "Email Notification") {
            setEmailStatus(true)
        }
        if (type == "Immediate") {
            setImmediateStatus(true)
        }
        if (type == "Approval") {
            setApprovalStatus(true)
        }
    }
    const ChangePriorityStatusFunction = (e: any) => {
        let value = e.target.value;
        if (Number(value) <= 10) {
            setselectPriority(e.target.value)
        } else {
            alert("Priority Status not should be greater than 10");
            setselectPriority('0')
        }
    }
    const deleteLinkedComponentData = () => {
        setLinkedComponentData([]);
    }


    return (
        <>
            <Panel
                onRenderHeader={onRenderCustomHeaderMain}
                type={PanelType.custom}
                customWidth="1348px"
                isOpen={TaskStatuspopup}
                onDismiss={closeTaskStatusUpdatePoup}
                isBlocking={false}
                className={AllItems?.Portfolio_x0020_Type == 'Service' || AllItems?.Services?.length > 0 || props?.props?.PortfolioType?.Id == 2 ? "serviepannelgreena" : ""}

            >
                <div className="modal-body active">


                    <div className={AllItems?.Portfolio_x0020_Type == 'Events' ? 'app component clearfix eventpannelorange' : (AllItems?.Portfolio_x0020_Type == 'Service' || AllItems?.Services?.length > 0 ? 'app component clearfix serviepannelgreena' : 'app component clearfix')}>
                        <div className='col px-2 mt-2 border Create-taskpage'>
                            {(AllItems?.Item_x0020_Type == 'Component' || AllItems?.Item_x0020_Type == 'SubComponent' || AllItems?.Item_x0020_Type == 'Feature' || AllItems.PageType == 'ProjectManagement') &&
                                <fieldset>
                                    <legend className="border-bottom fs-6 ">Sites</legend>
                                    <ul className="quick-actions">
                                        {siteTypess?.map(function (item: any) {
                                            return (
                                                <>
                                                    {(item.Title !== undefined && item.Title !== 'Offshore Tasks' && item.Title !== 'Master Tasks' && item.Title !== 'DRR' && item.Title !== 'SDC Sites' && item.Title !== 'QA') &&
                                                        <>
                                                            <li
                                                                id={"subcategorytasks" + item.Id} className={item.isSiteSelect ? 'mx-1 p-2 bg-siteColor selectedTaskList text-center mb-2 position-relative' : "mx-1 p-2 position-relative bg-siteColor text-center  mb-2"} onClick={() => setActiveTile("siteType", "siteType", item)} >
                                                                {/*  */}
                                                                <a className='text-white text-decoration-none' >
                                                                    <span className="icon-sites">
                                                                        <img className="icon-sites"
                                                                            src={item.Item_x005F_x0020_Cover?.Url} />
                                                                    </span>{item.Title}
                                                                </a>
                                                            </li>
                                                        </>
                                                    }
                                                </>)
                                        })}
                                    </ul>
                                </fieldset>
                            }
                        </div>
                        <div className='row'>
                            <div className='col-sm-10'>
                                <div className="row">
                                    <div className="col-sm-10 mb-10 mt-2">
                                        <label className="full_width"><span style={{ color: "black" }}>
                                            Task Name </span> <a id='siteName'
                                                onClick={SelectSiteType}> Site Name</a>
                                        </label>
                                        <input className="form-control" type="text" placeholder="Enter Task Name"
                                            defaultValue={post.Title} onChange={(e) => setPost({ ...post, Title: e.target.value })} />

                                    </div>
                                    <div className="col-sm-2 mb-10 padL-0 mt-2">
                                        <label>Due Date</label>
                                        <input type="date" className="form-control"
                                            defaultValue={Moment(date).format("DD/MM/YYYY")}
                                            onChange={handleDatedue}



                                        />
                                    </div>
                                </div>
                                <div className='row mt-2'>

                                    <TeamConfigurationCard ItemInfo={AllItems} AllListId={dynamicList} parentCallback={DDComponentCallBack}></TeamConfigurationCard>

                                </div>
                                <div className='row'>
                                    <div className='col-sm-5'>

                                        {/* <FroalaImageUploadComponent 
                                         callBack={copyImage} /> */}
                                        <div className="Florar-Editor-Image-Upload-Container" id="uploadImageFroalaEditor">
                                            <Froala
                                                model={defaultContent}
                                                onModelChange={isModelChange == false ? onModelChange : undefined}
                                                tag="textarea"
                                                config={isModelChange == false ? froalaEditorConfig : undefined}
                                            ></Froala>

                                        </div>

                                    </div>
                                    <div className='col-sm-7'>
                                        <HtmlEditorCard
                                            editorValue={AllItems?.Body != undefined ? AllItems?.Body : ''}
                                            HtmlEditorStateChange={HtmlEditorCallBack}
                                        >
                                        </HtmlEditorCard>
                                    </div>
                                </div>

                            </div>

                            <div className='col-sm-2'>
                                {/* {AllItems.Portfolio_x0020_Type == 'Component'
                                &&
                                <div className="col-sm-12 padL-0 PadR0">
                                    <div ng-show="smartComponent.length==0" className="col-sm-12 mb-10 padL-0 input-group">
                                        <label ng-show="!IsShowComSerBoth" className="full_width">Component</label>
                                        <input type="text" className="ui-autocomplete-input form-control" id="txtSharewebComponentcrt"
                                        /><span role="status" aria-live="polite"
                                            className="ui-helper-hidden-accessible"></span>
                                            <span className="input-group-text">
                                            <a className="hreflink" title="Edit Component" data-toggle="modal"
                                                    onClick={(e) => EditComponent(AllItems)}>
                                                    <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/_layouts/15/images/EMMCopyTerm.png" />
                                                </a>
                                            </span>
                                    </div>
                                    <div className="col-sm-12 padL-0 PadR0">
                                        <div className="col-sm-12  top-assign  mb-10 padL-0 PadR0">
                                            {smartComponentData?.map((cat: any) => {
                                                return (
                                                    <>
                                                        <div className=" col-sm-12 block" ng-mouseover="HoverIn(item);"
                                                            ng-mouseleave="ComponentTitle.STRING='';" title="{{ComponentTitle.STRING}}">
                                                            <a className="hreflink" target="_blank"
                                                                ng-href="{{CuurentSiteUrl}}/SitePages/Portfolio-Profile.aspx?taskId={{item.Id}}">{cat.Title}</a>
                                                            <a className="hreflink" ng-click="removeSmartComponent(item.Id)">
                                                                <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/_layouts/images/delete.gif" />
                                                            </a>
                                                        </div>
                                                    </>
                                                )
                                            })}
                                          
                                        </div>
                                    </div>
                                </div>} */}


                                {AllItems?.Portfolio_x0020_Type == 'Component' &&
                                    <div className="input-group">
                                        <label className="form-label full-width">
                                            Component Portfolio
                                        </label>
                                        <input type="text"
                                            className="form-control" />
                                        <span className="input-group-text">
                                            <svg onClick={(e) => EditComponent(AllItems)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">

                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M33.5163 8.21948C33.058 8.34241 32.4072 8.6071 32.0702 8.80767C31.7334 9.00808 26.7046 13.9214 20.8952 19.7259L10.3328 30.2796L9.12891 35.1C8.46677 37.7511 7.95988 39.9549 8.0025 39.9975C8.04497 40.0399 10.2575 39.5397 12.919 38.8857L17.7581 37.6967L28.08 27.4328C33.7569 21.7875 38.6276 16.861 38.9036 16.4849C40.072 14.8925 40.3332 12.7695 39.5586 11.1613C38.8124 9.61207 37.6316 8.62457 36.0303 8.21052C34.9371 7.92775 34.5992 7.92896 33.5163 8.21948ZM35.7021 10.1369C36.5226 10.3802 37.6953 11.5403 37.9134 12.3245C38.2719 13.6133 38.0201 14.521 36.9929 15.6428C36.569 16.1059 36.1442 16.4849 36.0489 16.4849C35.8228 16.4849 31.5338 12.2111 31.5338 11.9858C31.5338 11.706 32.8689 10.5601 33.5598 10.2469C34.3066 9.90852 34.8392 9.88117 35.7021 10.1369ZM32.3317 15.8379L34.5795 18.0779L26.1004 26.543L17.6213 35.008L17.1757 34.0815C16.5838 32.8503 15.1532 31.437 13.9056 30.8508L12.9503 30.4019L21.3663 21.9999C25.9951 17.3788 29.8501 13.5979 29.9332 13.5979C30.0162 13.5979 31.0956 14.6059 32.3317 15.8379ZM12.9633 32.6026C13.8443 32.9996 14.8681 33.9926 15.3354 34.9033C15.9683 36.1368 16.0094 36.0999 13.2656 36.7607C11.9248 37.0836 10.786 37.3059 10.7347 37.2547C10.6535 37.1739 11.6822 32.7077 11.8524 32.4013C11.9525 32.221 12.227 32.2709 12.9633 32.6026Z" fill="#333333" />
                                            </svg>
                                        </span>
                                    </div>
                                }
                                {AllItems?.Portfolio_x0020_Type == 'Service' &&
                                    <div className="input-group">
                                        <label className="form-label full-width">
                                            Service Portfolio
                                        </label>
                                        <input type="text"
                                            className="form-control" />
                                        <span className="input-group-text">
                                        <span  onClick={(e) => EditComponent(AllItems)} title="Edit Task" className="svg__iconbox svg__icon--editBox"></span>
                                           
                                        </span>
                                    </div>
                                }
                                {AllItems?.Portfolio_x0020_Type == 'Service' &&
                                    <div className="col-sm-12  inner-tabb">

                                        {
                                            linkedComponentData?.length > 0 ? <div>
                                                {linkedComponentData?.map((com: any) => {
                                                    return (

                                                        <div className="block d-flex justify-content-between mb-1">

                                                            <a className="hreflink " target="_blank" style={{ color: "#ffffff !important" }} data-interception="off" href={`${dynamicList.siteUrl}/SitePages/Portfolio-Profile.aspx?taskId=${com.ID}`}>
                                                                {com.Title}
                                                            </a>
                                                            <a className='text-end'>
                                                                <span className='bg-light svg__iconbox svg__icon--cross' onClick={() => deleteLinkedComponentData()}> </span>
                                                            </a>

                                                            {/* <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/_layouts/images/delete.gif" onClick={() => setLinkedComponentData([])} /> */}

                                                        </div>

                                                    )
                                                })}
                                            </div> : null

                                        }
                                        {/* <span className="input-group-text">
                                                            <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif"
                                                                onClick={(e) => EditComponent(EditData, 'Component')} />
                                                        </span> */}
                                    </div>
                                }

                                <div className="col-sm-12  inner-tabb">

                                    {smartComponentData ? smartComponentData?.map((com: any) => {
                                        return (

                                            <div className="block d-flex justify-content-between mb-1" >

                                                <a className='Portfolio-Title' target="_blank" href={`${dynamicList.siteUrl}/SitePages/Portfolio-Profile.aspx?taskId=${com.ID}`}>{com.Title}</a>

                                                <a className='text-end'>
                                                    <span className='bg-light svg__iconbox svg__icon--cross' onClick={() => setSmartComponentData([])}></span>
                                                    {/* <img className="mx-2" src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/_layouts/images/delete.gif" onClick={() => setSmartComponentData([])} /> */}
                                                </a>
                                            </div>

                                        )
                                    }) : null}



                                </div>


                                <div className="col-sm-12 padL-0 Prioritytp PadR0 mt-2">

                                    <div>
                                        <div className="input-group">
                                            <input type="text" className="form-control"
                                                placeholder="Enter Priority"
                                                value={selectPriority ? selectPriority : ''}
                                                onChange={(e) => ChangePriorityStatusFunction(e)}
                                            />
                                        </div>
                                        <ul className="p-0 mt-1 list-none">
                                            <li className="form-check SpfxCheckRadio ">
                                                <input className="radio"
                                                    name="radioPriority" type="radio"
                                                    checked={Number(selectPriority) <= 10 && Number(selectPriority) >= 8}
                                                    onChange={() => setselectPriority('8')}
                                                />
                                                <label className="form-check-label">High</label>
                                            </li>
                                            <li className="form-check SpfxCheckRadio ">
                                                <input className="radio" name="radioPriority"
                                                    type="radio" checked={Number(selectPriority) <= 7 && Number(selectPriority) >= 4}
                                                    onChange={() => setselectPriority('4')}
                                                />
                                                <label className="form-check-label">Normal</label>
                                            </li>
                                            <li className="form-check SpfxCheckRadio ">
                                                <input className="radio" name="radioPriority"
                                                    type="radio" checked={Number(selectPriority) <= 3 && Number(selectPriority) > 0}
                                                    onChange={() => setselectPriority('1')}
                                                />
                                                <label className="form-check-label">Low</label>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="row mt-2">
                                    <div className="col-sm-12">
                                        <div className="col-sm-12 padding-0 input-group">
                                            <label className="full_width">Categories</label>
                                            {/* <input type="text" className="ui-autocomplete-input form-control" id="txtCategories" value={categorySearchKey} onChange={(e) => autoSuggestionsForCategory(e)} /> */}
                                            <input type="text" className="ui-autocomplete-input form-control" id="txtCategories" value={categorySearchKey} onChange={(e) => autoSuggestionsForCategory(e)} />
                                            <span className="input-group-text">

                                                <a className="hreflink" title="Edit Categories">
                                                <span  onClick={() => EditComponentPicker(AllItems)}  className="input-group-text"><span title="Edit Task" className="svg__iconbox svg__icon--editBox"></span></span>
                                                    {/* <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/_layouts/15/images/EMMCopyTerm.png"
                                                        onClick={() => EditComponentPicker(AllItems)} /> */}
                                                </a>
                                            </span>
                                        </div>
                                    </div>



                                </div>
                                {SearchedCategoryData?.length > 0 ? (
                                    <div className="SmartTableOnTaskPopup">
                                        <ul className="list-group">
                                            {SearchedCategoryData.map((item: any) => {
                                                return (
                                                    <li className="hreflink list-group-item rounded-0 list-group-item-action" key={item.id} onClick={() => setSelectedCategoryData([item], "For-Auto-Search")} >
                                                        <a>{item.Newlabel}</a>
                                                    </li>
                                                )
                                            }
                                            )}
                                        </ul>
                                    </div>) : null}

                                <div className="col">
                                    <div className="col">
                                        <div
                                            className="form-check">
                                            <input className="form-check-input rounded-0"
                                                name="Phone"
                                                type="checkbox" checked={PhoneStatus}
                                                value={`${PhoneStatus}`}
                                                onClick={(e) => CategoryChange(e, "Phone", 199)}
                                            />
                                            <label className="form-check-label">Phone</label>
                                        </div>
                                        <div
                                            className="form-check">
                                            <input className="form-check-input rounded-0"
                                                type="checkbox"
                                                checked={EmailStatus}
                                                value={`${EmailStatus}`}
                                                onClick={(e) => CategoryChange(e, "Email Notification", 276)}
                                            />
                                            <label>Email Notification</label>

                                        </div>
                                        <div
                                            className="form-check">
                                            <input className="form-check-input rounded-0"
                                                type="checkbox"
                                                checked={ImmediateStatus}
                                                value={`${ImmediateStatus}`}
                                                onClick={(e) => CategoryChange(e, "Immediate", 228)} />
                                            <label>Immediate</label>
                                        </div>

                                    </div>
                                    <div className="form-check ">
                                        <label className="full-width">Approval</label>
                                        <input
                                            type="checkbox"
                                            className="form-check-input rounded-0"
                                            name="Approval"
                                            checked={ApprovalStatus}
                                            value={`${ApprovalStatus}`}
                                            onClick={(e) => CategoryChange(e, "Approval", 227)}

                                        />
                                    </div>
                                </div>
                                {CategoriesData != undefined ?
                                    <div>
                                        {CategoriesData?.map((type: any, index: number) => {
                                            return (
                                                <>
                                                    {(type.Title != "Phone" && type.Title != "Email Notification" && type.Title != "Approval" && type.Title != "Immediate") &&

                                                        <div className="block d-flex full-width justify-content-between mb-1 p-2">
                                                            <a style={{ color: "#fff !important" }} target="_blank" data-interception="off" href={`${dynamicList.siteUrl}/SitePages/Portfolio-Profile.aspx?${AllItems?.Id}`}>
                                                                {type.Title}
                                                            </a>
                                                            <span className='bg-light svg__iconbox svg__icon--cross' onClick={() => deleteCategories(type?.Id)}></span>
                                                            {/* <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/_layouts/images/delete.gif" onClick={() => deleteCategories(type?.Id)} className="p-1" /> */}
                                                        </div>
                                                    }
                                                </>
                                            )
                                        })}
                                    </div> : null
                                }
                                <div className="row mt-2">
                                    <div className="col-sm-12">
                                        <div className="col-sm-12 padding-0 input-group">
                                            <label className="full_width">Client Category</label>
                                            <input type="text" className="ui-autocomplete-input form-control" id="txtCategories" />

                                            <span className="input-group-text">

                                                <a className="hreflink" title="Edit Categories">
                                                <span  onClick={() => EditClientCategory(AllItems)}  className="input-group-text"><span title="Edit Task" className="svg__iconbox svg__icon--editBox"></span></span>
                                                    {/* <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/_layouts/15/images/EMMCopyTerm.png"
                                                        onClick={() => EditClientCategory(AllItems)} /> */}
                                                </a>
                                            </span>
                                        </div>
                                    </div>



                                </div>
                                {(ClientCategoriesData != undefined && ClientCategoriesData?.length > 0) ?
                                    <div>
                                        {ClientCategoriesData?.map((type: any, index: number) => {
                                            return (
                                                <>
                                                    {(type.Title != "Phone" && type.Title != "Email Notification" && type.Title != "Approval" && type.Title != "Immediate") &&

                                                        <div className="block d-flex full-width justify-content-between mb-1 p-2">
                                                            <a target="_blank" data-interception="off" href={`${dynamicList.siteUrl}/SitePages/Portfolio-Profile.aspx?${AllItems?.Id}`}>
                                                                {type.Title}
                                                            </a>
                                                            <span className='bg-light svg__iconbox svg__icon--cross' onClick={() => deleteClientCategories(type.Id)}> </span>
                                                            {/* <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/_layouts/images/delete.gif" onClick={() => deleteClientCategories(type.Id)} className="p-1" /> */}
                                                        </div>
                                                    }
                                                </>
                                            )
                                        })}
                                    </div> : null
                                }
                            </div>

                        </div>
                    </div>


                </div>


                <div className="modal-footer">
                    {
                        siteTypess?.map((site: any) => {
                            if (site.IscreateTask == true) {
                                return (
                                    <span className='ms-2'>
                                        <img className="client-icons"
                                            src={site?.Item_x005F_x0020_Cover?.Url} />
                                    </span>
                                )
                            }
                        })
                    }
                    <button type="button" className="btn btn-primary m-2" onClick={() => saveNoteCall()}>
                        Submit
                    </button>
                    <button type="button" className="btn btn-default m-2" onClick={() => closeTaskStatusUpdatePoup('item')}>
                        Cancel
                    </button>

                </div>

            </Panel>
            {IsComponent && ((AllItems?.Services?.length > 0 || AllItems?.Services?.results?.length > 0) || ((AllItems?.Services?.length == 0 || AllItems?.Services?.results?.length == 0) && (AllItems?.Component.length == 0 || AllItems?.Component?.results?.length == 0) && AllItems?.Portfolio_x0020_Type == 'Service')) &&
                <ServiceComponentPortfolioPopup
                    props={SharewebComponent}
                    Dynamic={dynamicList}
                    Call={Call}
                    ComponentType={"Service"}
                />
            }
            {IsComponent && ((AllItems?.Component.length > 0 || AllItems?.Component?.results?.length > 0) || ((AllItems?.Component.length == 0 || AllItems?.Component?.results?.length == 0) && (AllItems?.Services.length == 0 || AllItems?.Component?.results?.length == 0) && AllItems?.Portfolio_x0020_Type == 'Component')) &&
                <ServiceComponentPortfolioPopup
                    props={SharewebComponent}
                    Dynamic={dynamicList}
                    Call={Call}
                    ComponentType={"Component"}

                />
            }
            {/* {(IsComponent && AllItems?.Portfolio_x0020_Type == 'Service') && <LinkedComponent props={SharewebComponent} Dynamic={dynamicList} Call={Call}></LinkedComponent>}
            {(IsComponent && AllItems?.Portfolio_x0020_Type == 'Component') && <ComponentPortPolioPopup props={SharewebComponent} Dynamic={dynamicList} Call={Call}></ComponentPortPolioPopup>} */}
            {IsComponentPicker && <Picker props={SharewebCategory} selectedCategoryData={CategoriesData} usedFor="Task-Footertable" AllListId={dynamicList} Call={Call}></Picker>}
            {IsClientPopup && <ClientCategoryPupup props={SharewebCategory} selectedClientCategoryData={ClientCategoriesData} Call={Call}></ClientCategoryPupup>}
        </>
    )
}


export default CreateActivity;