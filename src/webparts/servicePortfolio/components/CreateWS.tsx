import * as React from 'react';
import { arraysEqual, Modal, Panel, PanelType } from 'office-ui-fabric-react';
import DatePicker from "react-datepicker";
import { Web } from "sp-pnp-js";
import * as $ from 'jquery';
import "bootstrap/dist/css/bootstrap.min.css";
import TeamConfigurationCard from '../../../globalComponents/TeamConfiguration/TeamConfiguration';
import ComponentPortPolioPopup from '../../EditPopupFiles/ComponentPortfolioSelection';
import Picker from '../../../globalComponents/EditTaskPopup/SmartMetaDataPicker';
import EditTaskPopup from '../../../globalComponents/EditTaskPopup/EditTaskPopup';
import * as Moment from 'moment'
import Tooltip from '../../../globalComponents/Tooltip';
import { data } from 'jquery';

const TaskItemRank: any = [];
var TaskTypeItems: any = [];
var SharewebTasknewTypeId: any = ''
var SharewebTasknewType: any = ''
var SelectedTasks: any = []
var Task: any = []
var AssignedToIds: any = [];
var ResponsibleTeamIds: any = [];
var dynamicList: any = {}
var TeamMemberIds: any = [];
let InheritClientCategory: any = [];
let AllItems: any = {};
var portFolioTypeId:any = ''
//var checkedWS:boolean=true;
const CreateWS = (props: any) => {

     portFolioTypeId = props?.portfolioTypeData?.filter((elem: any) => elem?.Id === props?.props?.PortfolioType?.Id)
    let portFolio = props?.props?.Id

    if (props.SelectedProp != undefined && props.SelectedProp.SelectedProp != undefined) {
        dynamicList = props.SelectedProp.SelectedProp;
    } else {
        dynamicList = props.SelectedProp;
    }
    SelectedTasks = []
    if (props != undefined) {
        AllItems = { ...props?.props };
        SelectedTasks.push(AllItems)
        console.log(props)
    }

    const [TaskStatuspopup, setTaskStatuspopup] = React.useState(true);

    const [isDropItem, setisDropItem] = React.useState(false);
    const [isDropItemRes, setisDropItemRes] = React.useState(false);
    const [SharewebComponent, setSharewebComponent] = React.useState('');
    const [smartComponentData, setSmartComponentData] = React.useState<any>([]);
    const [inputFields, setInputFields] = React.useState([]);
    const [ParentArray, setParentArray] = React.useState([]);
    const [postData, setPostData] = React.useState({ Title: '' })
    const [linkedComponentData, setLinkedComponentData] = React.useState<any>([]);
    const [TaskAssignedTo, setTaskAssignedTo] = React.useState([]);
    const [IsComponentPicker, setIsComponentPicker] = React.useState(false);
    const [SharewebCategory, setSharewebCategory] = React.useState('');
    const [SharewebTask, setSharewebTask] = React.useState<any>('');
    const [IsComponent, setIsComponent] = React.useState(false);
    const [date, setDate] = React.useState(undefined);
    const [myDate, setMyDate] = React.useState({ editDate: null, selectDateName: '' });
    const [TaskTeamMembers, setTaskTeamMembers] = React.useState([]);
    const [selectPriority, setselectPriority] = React.useState('');
    const [Priorityy, setPriorityy] = React.useState(false);
    const [Categories, setCategories] = React.useState([]);
    const [IsPopupComponent, setIsPopupComponent] = React.useState(false)
    const [CategoriesData, setCategoriesData] = React.useState<any>([]);
    const [checkedWS, setcheckedWS] = React.useState(true);
    const [checkedTask, setcheckedTask] = React.useState(false);
    const [TaskResponsibleTeam, setTaskResponsibleTeam] = React.useState([]);
    const [showChildData, setShowChildData] = React.useState(false);
    const [childItem, setChildItem] = React.useState(false);



    const closeTaskStatusUpdatePoup = (res: any) => {
        setTaskStatuspopup(false)
        props.Call(res);

    }
    React.useEffect(() => {

        selectType('Workstream');
        GetParentHierarchy(props.props)
        // .then((data:any)=>{
        //   console.log(data)
        //   setParentArray(data)
        // }).catch((error:any)=>{
        //     console.log(error)
        // })
        // var Parent: any = []
        // props.data.forEach((val: any) => {

        //     if (val.Id == AllItems.Id) {
        //         Parent.push(val);
        //     }
        //     if (val.childs != undefined) {
        //         val.child = []
        //         val.childs.map((chi: any) => {
        //             if (chi.Id == AllItems.Id) {
        //                 Parent.push(val);
        //                 val.child.push(chi)

        //             }
        //         })

        //     }
        // })
        // setParentArray(Parent)

    }, [])
    const GetParentHierarchy = async (Item: any) => {
        const parentdata: any = []
        // parentdata.push()
        // return new Promise((resolve, reject) => {
            if(Item.Parent != null || Item?.Component != undefined || Item?.Services != undefined){

                var filt:any = "Id eq " + (Item.Parent != null || undefined ? Item?.Parent?.Id : Item?.Component?.length > 0 ? Item?.Component[0]?.Id : Item?.Services[0]?.Id) + "";
            
            }
            let web = new Web(dynamicList?.siteUrl);
        let compo = [];
        web.lists
            .getById(dynamicList?.MasterTaskListID)
            .items
            .select("ID", "Id", "Title", "Mileage", "ItemType", "Parent/Id", "Parent/Title"
            ).expand("Parent")

            .top(4999)
            .filter(filt)
            .get().then((comp: any) => {

                console.log(comp)
                parentdata.push(comp[0])
                parentdata.push(Item)
                //  if(comp[0].Parent!=undefined){
                // GetParentHierarchy(comp[0])
                //  }else{
                setParentArray(parentdata)
                // resolve(parentdata)
                //  }

            }).catch((error: any) => {
                console.log(error)
                // reject(error)
            });
        // })

    }
    var ItemRankTitle: any = ''
    TaskItemRank.push([{ rankTitle: 'Select Item Rank', rank: null }, { rankTitle: '(8) Top Highlights', rank: 8 }, { rankTitle: '(7) Featured Item', rank: 7 }, { rankTitle: '(6) Key Item', rank: 6 }, { rankTitle: '(5) Relevant Item', rank: 5 }, { rankTitle: '(4) Background Item', rank: 4 }, { rankTitle: '(2) to be verified', rank: 2 }, { rankTitle: '(1) Archive', rank: 1 }, { rankTitle: '(0) No Show', rank: 0 }]);
    const DDComponentCallBack = (dt: any) => {
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
    var CheckCategory: any = []
    CheckCategory.push({ "TaxType": "Categories", "Title": "Phone", "Id": 199, "ParentId": 225 }, { "TaxType": "Categories", "Title": "Email Notification", "Id": 276, "ParentId": 225 }, { "TaxType": "Categories", "Title": "Approval", "Id": 227, "ParentId": 225 },
        { "TaxType": "Categories", "Title": "Immediate", "Id": 228, "parentId": 225 });
    const Call = React.useCallback((item1: any, type: any) => {
        if (type == "SmartComponent") {
            if (AllItems != undefined && item1 != undefined) {
                AllItems.smartComponent = item1.smartComponent;
                setSmartComponentData(item1.smartComponent);
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
                item1.SharewebCategories?.map((itenn: any) => {
                    CategoriesData.push(itenn)
                })

                setCategoriesData(CategoriesData)


            }
        }

        // if (CategoriesData != undefined){
        //     CategoriesData.forEach(function(type:any){
        //     CheckCategory.forEach(function(val:any){
        //         if(type.Id == val.Id){
        //         BackupCat = type.Id
        //         setcheckedCat(true)
        //         }
        //       })

        //   })
        //   setUpdate(update+2)
        // }
        setIsComponentPicker(false);
        setIsComponent(false);
    }, []);
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
    var TaskprofileId: any = ''
    var WorstreamLatestId: any = ''
    var PopupType = ''
    const createWorkStream = async (Type: any) => {
        PopupType = Type;
        if (AllItems == '' || AllItems.length > 0) {
            TaskprofileId = AllItems[0].Id;
        }
        console.log(Type)
        let web = new Web(dynamicList.siteUrl);
        let componentDetails:any = [];
        componentDetails = await web.lists
            .getById(AllItems.listId)
            .items
            .select("FolderID,SharewebTaskLevel1No,SharewebTaskLevel2No,AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,FileLeafRef,Title,Id,Priority_x0020_Rank,PercentComplete,Priority,Created,Modified,TaskType/Id,TaskType/Title,ParentTask/Id,ParentTask/Title,Author/Id,Author/Title,Editor/Id,Editor/Title")
            .expand("TaskType,ParentTask,Author,Editor,AssignedTo")
            .filter(("TaskType/Title eq 'Workstream'") && ("ParentTask/Id eq '" + AllItems?.Id + "'"))
            .orderBy("Created", false)
            .top(4999)
            .get()
        console.log(componentDetails)
        if (componentDetails.length == 0) {
            WorstreamLatestId = 1;
        } else {
            WorstreamLatestId = componentDetails[0].SharewebTaskLevel2No + 1;
        }
        SelectedTasks.forEach((item: any, index: any) => {
            if (item.Title != "") {
                if (SharewebTasknewTypeId == 3 || SharewebTasknewTypeId == 5) {
                    createChildAsWorkStream(item, Type, index, WorstreamLatestId);
                    if (inputFields != undefined && inputFields.length > 0) {
                        inputFields.forEach((obj: any) => {
                            if (obj.Title != undefined && obj.Title != "") {
                                index++
                                createMultiChildAsWorkStream(obj, Type, index, WorstreamLatestId);
                            }
                        })
                    }
                } else {
                    createChildAsTask(item, Type, index);
                    if (inputFields != undefined && inputFields.length > 0) {
                        inputFields.forEach((obj: any) => {
                            if (obj.Title != undefined && obj.Title != "") {
                                index++
                                createMultiChildTask(obj, Type, index, WorstreamLatestId);
                            }
                        })
                    }
                }
            }
        })



    }
    // const createMultiChildAsWorkStream = async (item: any, Type: any, index: any, WorstreamLatestId: any) => {
    //     var NewDate = ''
    //    var  clientcaterogiesdata2:any=[];
    //    var AssignedToUser:any=[];
    //    var AllTeamMembers:any=[];
    //    var TeamLeaderws:any=[];
    //     WorstreamLatestId += index;
    //     var SharewebID = '';
    //     if (Task == undefined || Task == '')
    //         Task = SelectedTasks[0];
    //     if (TaskprofileId == '' || SelectedTasks.length > 0) {
    //         TaskprofileId = SelectedTasks[0].Id;
    //     }
    //     if (Task.Component != undefined && Task.Component.length > 0) {
    //         SharewebID = 'CA' + Task.SharewebTaskLevel1No + '-W' + WorstreamLatestId;
    //     }
    //     if (Task.Services != undefined && Task.Services.length > 0) {
    //         SharewebID = 'SA' + Task.SharewebTaskLevel1No + '-W' + WorstreamLatestId;
    //     }
    //     // if (Task.SharewebTaskType != undefined && Task.SharewebTaskType.Title != undefined) {
    //     //     SharewebID = 'A' + Task.SharewebTaskLevel1No + '-W' + WorstreamLatestId;
    //     // }
    //     var Component: any = []
    //     var RelevantPortfolioIds: any = []

    //     // smartComponentData.forEach((com: any) => {
    //     //     if (com != undefined) {
    //     //         Component.push(com.Id)
    //     //     }

    //     // })
    //     // if (myDate?.editDate != undefined && myDate?.editDate != null) {
    //     //     var dateValue = myDate?.editDate?.split("/");
    //     //     var dp = dateValue[1] + "/" + dateValue[0] + "/" + dateValue[2];
    //     //     var Dateet = new Date(dp)
    //     //     NewDate = Moment(Dateet).format("ddd, DD MMM yyyy")
    //     // }
    //     if (date != undefined) {
    //         NewDate = new Date(date).toDateString();
    //     }
    //     if (AllItems.Component[0] != undefined && AllItems.Component.length > 0) {
    //         Component.push(AllItems.Component[0].Id)
    //     }
    //     if (AllItems.Services[0] != undefined && AllItems.Services.length > 0) {
    //         RelevantPortfolioIds.push(AllItems.Services[0].Id)
    //     }
    //     if (AllItems?.Portfolio_x0020_Type == undefined) {
    //         if (AllItems.Component != undefined && AllItems.Component.length > 0) {
    //             smartComponentData.push(AllItems.Component);
    //         }

    //         if (AllItems.Services != undefined && AllItems.Services.length > 0) {
    //             linkedComponentData.push(AllItems);
    //         }

    //     }

    //     var categoriesItem = '';
    //     CategoriesData.map((category) => {
    //         if (category.Title != undefined) {
    //             categoriesItem = categoriesItem == "" ? category.Title : categoriesItem + ';' + category.Title;
    //         }
    //     })
    //     smartComponentData.forEach((com: any) => {
    //         if (com != undefined) {
    //             Component.push(com[0].Id)
    //         }

    //     })
    //     if (linkedComponentData != undefined && linkedComponentData?.length > 0) {
    //         linkedComponentData?.map((com: any) => {
    //             if (linkedComponentData != undefined && linkedComponentData?.length >= 0) {
    //                 $.each(linkedComponentData, function (index: any, smart: any) {
    //                     RelevantPortfolioIds.push(smart.Id)
    //                 })
    //             }
    //         })
    //     }
    //     var CategoryID: any = []
    //     CategoriesData.map((category) => {
    //         if (category.Id != undefined) {
    //             CategoryID.push(category.Id)
    //         }
    //     })
    //     if (AllItems?.AssignedTo != undefined && AllItems?.AssignedTo?.length>0) {
    //         AllItems.AssignedTo.forEach((obj: any) => {
    //             AssignedToIds.push(obj.Id);
    //             AssignedToUser.push(obj);

    //         })
    //     }
    //     if (isDropItemRes == true) {
    //         if (TaskAssignedTo != undefined && TaskAssignedTo?.length > 0) {
    //             TaskAssignedTo.map((taskInfo) => {
    //                 AssignedToIds.push(taskInfo.Id);
    //                 AssignedToUser.push(taskInfo);
    //             })
    //         }
    //     }
    //     if (AllItems?.TeamMembers != undefined  && AllItems?.TeamMembers?.length>0) {
    //         AllItems?.TeamMembers.forEach((obj: any) => {
    //             TeamMemberIds.push(obj.Id);
    //             AllTeamMembers.push(obj);

    //         })
    //     }
    //     if (isDropItem == true) {
    //         if (TaskTeamMembers != undefined && TaskTeamMembers?.length > 0) {
    //             TaskTeamMembers?.map((taskInfo) => {
    //                 TeamMemberIds.push(taskInfo.Id);
    //                 AllTeamMembers.push(taskInfo);

    //             })
    //         }
    //     }
    //     if (AllItems?.TeamLeader != undefined &&  AllItems?.TeamLeader?.length>0) {
    //         AllItems?.TeamLeader?.forEach((obj: any) => {
    //             ResponsibleTeamIds.push(obj.Id);
    //              TeamLeaderws.push(obj)
    //         })
    //     }
    //     if (isDropItem == true) {
    //         if (TaskResponsibleTeam != undefined && TaskResponsibleTeam?.length > 0) {
    //             TaskResponsibleTeam?.map((taskInfo) => {
    //                 ResponsibleTeamIds.push(taskInfo.Id);
    //                 TeamLeaderws.push(taskInfo)
    //             })
    //         }
    //     }
    //     if(props?.props!=undefined && props?.props?.ClientCategory?.length>0){
    //       if(props?.props?.ClientCategory2!=undefined && props?.props?.ClientCategory2?.results?.length>0){
    //         props?.props?.ClientCategory2?.results?.map((items:any)=>{
    //             InheritClientCategory.push(items.Id)
    //             clientcaterogiesdata2.push(items)  
    //         })
    //       }else{
    //         props.props.ClientCategory?.map((items:any)=>{
    //             InheritClientCategory.push(items.Id) 
    //             clientcaterogiesdata2.push(items)  
    //         }) 
    //       }


    //     }
    //     let web = new Web(dynamicList.siteUrl);
    //     // if(props?.props?.ClientTime?.length>0){
    //     //     props.props.ClientTime=JSON.stringify(props?.props?.ClientTime) 
    //     // }
    //     await web.lists.getById(AllItems.listId).items.add({
    //         Title: AllItems.Title,
    //         ComponentId: { "results": Component },
    //         Categories: categoriesItem ? categoriesItem : null,
    //         SharewebCategoriesId: { "results": CategoryID },
    //         Priority_x0020_Rank: AllItems.Priority_x0020_Rank,
    //         ParentTaskId: AllItems.Id,
    //         ServicesId: { "results": RelevantPortfolioIds },
    //         Priority: AllItems.Priority,
    //         Body: AllItems.Description,
    //         // DueDate: NewDate != '' && NewDate != undefined ? NewDate : undefined,
    //         DueDate: myDate.editDate = myDate.editDate ? Moment(myDate?.editDate).format("ddd, DD MMM yyyy"): '',
    //         SharewebTaskTypeId: SharewebTasknewTypeId,
    //         Shareweb_x0020_ID: SharewebID,
    //         SharewebTaskLevel2No: WorstreamLatestId,
    //         SharewebTaskLevel1No: AllItems.SharewebTaskLevel1No,
    //         ClientCategoryId: { "results": InheritClientCategory },
    //         SiteCompositionSettings:props?.props?.SiteCompositionSettings!=undefined?props?.props?.SiteCompositionSettings:"",
    //         ClientTime:props?.props?.ClientTime!=null ?props?.props?.ClientTime:"",
    //         AssignedToId: { "results": (AssignedToIds != undefined && AssignedToIds?.length > 0) ? AssignedToIds : [] },
    //         Responsible_x0020_TeamId: { "results": (ResponsibleTeamIds != undefined && ResponsibleTeamIds?.length > 0) ? ResponsibleTeamIds : [] },
    //         Team_x0020_MembersId: { "results": (TeamMemberIds != undefined && TeamMemberIds?.length > 0) ? TeamMemberIds : [] }

    //     }).then((res: any) => {
    //         console.log(res);
    //         if (PopupType == 'CreatePopup') {
    //             res.data['SiteIcon'] = AllItems.SiteIcon
    //             res.data['listId'] = AllItems.listId
    //             res.data['SharewebTaskType'] = { Title: 'Workstream' }
    //             res.data.DueDate = res?.data?.DueDate ?  Moment(res?.data?.DueDate).format("DD-MM-YYYY"):'',
    //                 res.data['siteType'] = AllItems.siteType
    //             res.data['Shareweb_x0020_ID'] = SharewebID,
    //             res.data.ClientCategory=clientcaterogiesdata2,
    //             res.data.Created=new Date();
    //             res.data.Author={
    //                 Id: res?.data?.AuthorId
    //             }
    //             res.data.Team_x0020_Members=AllTeamMembers?.length>0?AllTeamMembers:[]
    //             res.data.Responsible_x0020_Team=TeamLeaderws?.length>0?TeamLeaderws:[]
    //             res.data.AssignedTo=AssignedToUser?.length>0?AssignedToUser:[]
    //             res.Item_x0020_Type=""
    //             setIsPopupComponent(true)
    //             setSharewebTask(res.data)
    //             closeTaskStatusUpdatePoup(res);
    //         }
    //         else {
    //             res.data['SiteIcon'] = AllItems.SiteIcon
    //             res.data['listId'] = AllItems.listId
    //             res.data['SharewebTaskType'] = { Title: 'Workstream' }
    //             res.data.DueDate = res?.data?.DueDate ?  Moment(res?.data?.DueDate).format("MM-DD-YYYY"):'',
    //                 res.data['siteType'] = AllItems.siteType
    //             res.data['Shareweb_x0020_ID'] = SharewebID
    //             res.data.ClientCategory= clientcaterogiesdata2,
    //             res.data.Created=new Date();
    //             res.data.Author={
    //                 Id: res?.data?.AuthorId
    //             }
    //             res.data.Team_x0020_Members=AllTeamMembers?.length>0?AllTeamMembers:[]
    //             res.data.Responsible_x0020_Team=TeamLeaderws?.length>0?TeamLeaderws:[]
    //             res.data.AssignedTo=AssignedToUser?.length>0?AssignedToUser:[]
    //             res.Item_x0020_Type=""
    //             setSharewebTask(res.data)
    //             closeTaskStatusUpdatePoup(res);
    //         }



    //     })

    // }
    const createMultiChildAsWorkStream = async (item: any, Type: any, index: any, WorstreamLatestId: any) => {
        var clientcaterogiesdata2: any = [];
        var AssignedToUser: any = [];
        var AllTeamMembers: any = [];
        var TeamLeaderws: any = [];
        let LetestLevelData:any=[]
        let Tasklevel:any =''
        let TaskID  = ''
        var NewDate = ''
        let componentDetails:any=[]
        WorstreamLatestId += index;
        var SharewebID = '';
        let web = new Web(dynamicList.siteUrl);
        if (Task == undefined || Task == '')
            Task = SelectedTasks[0];
        if (TaskprofileId == '' || SelectedTasks.length > 0) {
            TaskprofileId = SelectedTasks[0].Id;
        }
        // if (Task.Component != undefined && Task.Component.length > 0) {
        //     SharewebID = 'CA' + Task.SharewebTaskLevel1No + '-W' + WorstreamLatestId;
        // }
        // if (Task.Services != undefined && Task.Services.length > 0) {
        //     SharewebID = 'SA' + Task.SharewebTaskLevel1No + '-W' + WorstreamLatestId;
        // }
        // if (Task.SharewebTaskType != undefined && Task.SharewebTaskType.Title != undefined) {
        //     SharewebID = 'A' + Task.SharewebTaskLevel1No + '-W' + WorstreamLatestId;
        // }
        componentDetails = await web.lists
        .getById(AllItems.listId)
        .items
        .select("Id,Title")
        .orderBy("Id", false)
        .top(1)
        .get()
    console.log(componentDetails)
    var LatestId = componentDetails[0].Id + 1;
    LatestId += index;
        var Component: any = []
        var RelevantPortfolioIds: any = []

        // smartComponentData.forEach((com: any) => {
        //     if (com != undefined) {
        //         Component.push(com.Id)
        //     }

        // })
        // if (myDate?.editDate != undefined && myDate?.editDate != null) {
        //     var dateValue = myDate?.editDate?.split("/");
        //     var dp = dateValue[1] + "/" + dateValue[0] + "/" + dateValue[2];
        //     var Dateet = new Date(dp)
        //     NewDate = Moment(Dateet).format("ddd, DD MMM yyyy")
        // }
        if (date != undefined) {
            NewDate = new Date(date).toDateString();
        }
        // if (AllItems.Component != undefined && AllItems.Component.length > 0) {
        //     Component.push(AllItems.Component[0].Id)
        // }
        // if (AllItems.Services != undefined && AllItems.Services.length > 0) {
        //     RelevantPortfolioIds.push(AllItems.Services[0].Id)
        // }
        // if (AllItems?.Portfolio_x0020_Type == undefined) {
        //     if (AllItems.Component != undefined && AllItems.Component.length > 0) {
        //         smartComponentData.push(AllItems.Component);
        //     }

        //     if (AllItems.Services != undefined && AllItems.Services.length > 0) {
        //         linkedComponentData.push(AllItems);
        //     }

        // }

        var categoriesItem = '';
        CategoriesData.map((category: { Title: string; }) => {
            if (category.Title != undefined) {
                categoriesItem = categoriesItem == "" ? category.Title : categoriesItem + ';' + category.Title;
            }
        })
        smartComponentData.forEach((com: any) => {
            if (com != undefined) {
                Component.push(com[0].Id)
            }

        })
        // if (linkedComponentData != undefined && linkedComponentData?.length > 0) {
        //     linkedComponentData?.map((com: any) => {
        //         if (linkedComponentData != undefined && linkedComponentData?.length >= 0) {
        //             $.each(linkedComponentData, function (index: any, smart: any) {
        //                 RelevantPortfolioIds.push(smart.Id)
        //             })
        //         }
        //     })
        // }
        AllItems?.subRows?.forEach((vall: any) => {
            if (vall?.TaskType?.Title == 'Workstream' || vall?.SharewebTaskType?.Title == 'Workstream') {
                LetestLevelData.push(vall)
            }

        })
        if (LetestLevelData.length == 0) {
            Tasklevel = 1
            TaskID = props?.props?.TaskID + '-W' + Tasklevel ;
        }
        else {
            Tasklevel = LetestLevelData.length + 1
            TaskID = props?.props?.TaskID + '-W' + Tasklevel ;
        }
        var CategoryID: any = []
        CategoriesData.map((category: { Id: any; }) => {
            if (category.Id != undefined) {
                CategoryID.push(category.Id)
            }
        })
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
        if (AllItems?.TeamLeader != undefined && AllItems?.TeamLeader?.length > 0) {
            AllItems.TeamLeader.forEach((obj: any) => {
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

       
        let FeedBackItemArrayNew: any = [];
        if (item.Description != undefined) {
            let param: any = Moment(new Date().toLocaleString())
            let FeedBackItem: any = {};
            FeedBackItem['Title'] = "FeedBackPicture" + param;
            FeedBackItem['FeedBackDescriptions'] = [];
            FeedBackItem.FeedBackDescriptions = [{
                'Title': item.Description
            }]
            FeedBackItem['ImageDate'] = "" + param;
            FeedBackItem['Completed'] = '';
            if (FeedBackItem != undefined && FeedBackItem.length > 1)
                FeedBackItemArrayNew.push(FeedBackItem)
        }
        await web.lists.getById(AllItems.listId).items.add({
            Title: item?.Title != undefined ? item?.Title : AllItems.Title,
            Categories: categoriesItem ? categoriesItem : null,
            TaskCategoriesId: { "results": CategoryID },
            Priority_x0020_Rank: item.selectPriority,
            PortfolioId: portFolio,
            PortfolioTypeId: portFolioTypeId == undefined?null:portFolioTypeId[0]?.Id,
            TaskTypeId: SharewebTasknewTypeId,
            ParentTaskId: AllItems.Id,
            Priority: item.Priority,
            Body: item?.Description != undefined ? item?.Description : AllItems.Description,
            // DueDate: NewDate != '' && NewDate != undefined ? NewDate : undefined,
            DueDate: item.editDate != null ? Moment(item?.editDate).format("ddd, DD MMM yyyy") : null,
            SharewebTaskTypeId: SharewebTasknewTypeId,
            FeedBack: FeedBackItemArrayNew.length === 0 ? '' : JSON.stringify(FeedBackItemArrayNew),
            SharewebTaskLevel2No: WorstreamLatestId,
            SharewebTaskLevel1No: AllItems.SharewebTaskLevel1No,
            AssignedToId: { "results": (AssignedToIds != undefined && AssignedToIds?.length > 0) ? AssignedToIds : [] },
            ResponsibleTeamId: { "results": (ResponsibleTeamIds != undefined && ResponsibleTeamIds?.length > 0) ? ResponsibleTeamIds : [] },
            TeamMembersId: { "results": (TeamMemberIds != undefined && TeamMemberIds?.length > 0) ? TeamMemberIds : [] },
            TaskID :TaskID,
            TaskLevel : Tasklevel


        }).then((res: any) => {
            console.log(res);
            if (PopupType == 'CreatePopup') {
                res.data['SiteIcon'] = AllItems.SiteIcon
                res.data['listId'] = AllItems.listId
                res.data['SharewebTaskType'] = { Title: 'Workstream' }
                res.data['PortfolioType'] = portFolioTypeId != undefined ? portFolioTypeId[0]:null
                res.data.AssignedTo = []
                res.data.ResponsibleTeam = []
                res.data.TeamMembers = []
                if (res?.data?.TeamMembersId?.length > 0) {
                    res.data?.MembersId?.map((teamUser: any) => {
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
                res.data.DueDate = res?.data?.DueDate ? Moment(res?.data?.DueDate).format("DD-MM-YYYY") : null,
                    res.data['siteType'] = AllItems.siteType
                res.data['Shareweb_x0020_ID'] = SharewebID
                if (SelectedTasks != undefined && SelectedTasks.length > 0)
                    setIsPopupComponent(true)
                setSharewebTask(res.data)
                closeTaskStatusUpdatePoup(res);
            }
            else {
                res.data['SiteIcon'] = AllItems.SiteIcon
                res.data['listId'] = AllItems.listId
                res.data['SharewebTaskType'] = { Title: 'Workstream' }
                res.data.DueDate = res?.data?.DueDate ? Moment(res?.data?.DueDate).format("MM-DD-YYYY") : null,
                res.data['PortfolioType'] =  portFolioTypeId != undefined ? portFolioTypeId[0]:null
                    res.data['siteType'] = AllItems.siteType
                res.data['Shareweb_x0020_ID'] = SharewebID
                res.data.ClientCategory = clientcaterogiesdata2,
                    res.data.Created = new Date();
                res.data.Author = {
                    Id: res?.data?.AuthorId
                }
                res.data.TeamMembers = AllTeamMembers?.length > 0 ? AllTeamMembers : []
                res.data.Responsible_x0020_Team = TeamLeaderws?.length > 0 ? TeamLeaderws : []
                res.data.AssignedTo = AssignedToUser?.length > 0 ? AssignedToUser : []
                res.Item_x0020_Type = ""
                setSharewebTask(res.data)
                closeTaskStatusUpdatePoup(res);

            }



        })

    }

    const createMultiChildTask = async (item: any, Type: any, index: any, WorstreamLatestId: any) => {
        var clientcaterogiesdata2: any = [];
        var AssignedToUser: any = [];
        var AllTeamMembers: any = [];
        var TeamLeaderws: any = [];
        let LetestLevelData:any=[]
        let Tasklevel:any =''
        let TaskID  = ''
        var NewDate = ''
        let componentDetails:any=[]
        WorstreamLatestId += index;
        var SharewebID = '';
        let web = new Web(dynamicList.siteUrl);
        if (Task == undefined || Task == '')
            Task = SelectedTasks[0];
        if (TaskprofileId == '' || SelectedTasks.length > 0) {
            TaskprofileId = SelectedTasks[0].Id;
        }
      
        // if (Task.SharewebTaskType != undefined && Task.SharewebTaskType.Title != undefined) {
        //     SharewebID = 'A' + Task.SharewebTaskLevel1No + '-W' + WorstreamLatestId;
        // }
        componentDetails = await web.lists
        .getById(AllItems.listId)
        .items
        .select("Id,Title")
        .orderBy("Id", false)
        .top(1)
        .get()
    console.log(componentDetails)
    var LatestId = componentDetails[0].Id + 1;
    LatestId += index;
    if (Task.Component != undefined && Task.Component.length > 0) {
        SharewebID = 'CA' + Task.SharewebTaskLevel1No + '-T' + LatestId;
    }
    if (Task.Services != undefined && Task.Services.length > 0) {
        SharewebID = 'SA' + Task.SharewebTaskLevel1No + '-T' + LatestId;
    }
        var Component: any = []
        var RelevantPortfolioIds: any = []

        // smartComponentData.forEach((com: any) => {
        //     if (com != undefined) {
        //         Component.push(com.Id)
        //     }

        // })
        // if (myDate?.editDate != undefined && myDate?.editDate != null) {
        //     var dateValue = myDate?.editDate?.split("/");
        //     var dp = dateValue[1] + "/" + dateValue[0] + "/" + dateValue[2];
        //     var Dateet = new Date(dp)
        //     NewDate = Moment(Dateet).format("ddd, DD MMM yyyy")
        // }
        if (date != undefined) {
            NewDate = new Date(date).toDateString();
        }
        if (AllItems?.Component != undefined && AllItems?.Component.length > 0) {
            Component.push(AllItems.Component[0].Id)
        }
        if (AllItems?.Services != undefined && AllItems?.Services?.length > 0) {
            RelevantPortfolioIds.push(AllItems.Services[0].Id)
        }
        if (AllItems?.Portfolio_x0020_Type == undefined) {
            if (AllItems?.Component != undefined && AllItems?.Component?.length > 0) {
                smartComponentData.push(AllItems.Component);
            }

            if (AllItems?.Services != undefined && AllItems?.Services?.length > 0) {
                linkedComponentData.push(AllItems);
            }

        }

        var categoriesItem = '';
        CategoriesData.map((category: { Title: string; }) => {
            if (category.Title != undefined) {
                categoriesItem = categoriesItem == "" ? category.Title : categoriesItem + ';' + category.Title;
            }
        })
        // smartComponentData.forEach((com: any) => {
        //     if (com != undefined) {
        //         Component.push(com[0].Id)
        //     }

        // })
        // if (linkedComponentData != undefined && linkedComponentData?.length > 0) {
        //     linkedComponentData?.map((com: any) => {
        //         if (linkedComponentData != undefined && linkedComponentData?.length >= 0) {
        //             $.each(linkedComponentData, function (index: any, smart: any) {
        //                 RelevantPortfolioIds.push(smart.Id)
        //             })
        //         }
        //     })
        // }
        AllItems?.subRows?.forEach((vall: any) => {
            if (vall?.TaskType?.Title == 'Task' || vall?.SharewebTaskType?.Title == 'Task') {
                LetestLevelData.push(vall)
            }

        })
        if (LetestLevelData.length == 0) {
            Tasklevel = 1
            TaskID = props?.props?.TaskID + '-T'  + LatestId;
        }
        else {
            Tasklevel = LetestLevelData.length + 1
            TaskID = props?.props?.TaskID + '-T'  + LatestId;
        }
        var CategoryID: any = []
        CategoriesData.map((category: { Id: any; }) => {
            if (category.Id != undefined) {
                CategoryID.push(category.Id)
            }
        })
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
        if (AllItems?.TeamLeader != undefined && AllItems?.TeamLeader?.length > 0) {
            AllItems.TeamLeader.forEach((obj: any) => {
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

       
        let FeedBackItemArrayNew: any = [];
        if (item.Description != undefined) {
            let param: any = Moment(new Date().toLocaleString())
            let FeedBackItem: any = {};
            FeedBackItem['Title'] = "FeedBackPicture" + param;
            FeedBackItem['FeedBackDescriptions'] = [];
            FeedBackItem.FeedBackDescriptions = [{
                'Title': item.Description
            }]
            FeedBackItem['ImageDate'] = "" + param;
            FeedBackItem['Completed'] = '';
            if (FeedBackItem != undefined && FeedBackItem.length > 1)
                FeedBackItemArrayNew.push(FeedBackItem)
        }
        await web.lists.getById(AllItems.listId).items.add({
            Title: item?.Title != undefined ? item?.Title : AllItems.Title,
            Categories: categoriesItem ? categoriesItem : null,
            TaskCategoriesId: { "results": CategoryID },
            Priority_x0020_Rank: item.selectPriority,
            PortfolioId: portFolio,
            PortfolioTypeId: portFolioTypeId == undefined?null:portFolioTypeId[0]?.Id,
            TaskTypeId: SharewebTasknewTypeId,
            ParentTaskId: AllItems.Id,
            Priority: item.Priority,
            Body: item?.Description != undefined ? item?.Description : AllItems.Description,
            // DueDate: NewDate != '' && NewDate != undefined ? NewDate : undefined,
            DueDate: item.editDate != null ? Moment(item?.editDate).format("ddd, DD MMM yyyy") : null,
            FeedBack: FeedBackItemArrayNew.length === 0 ? '' : JSON.stringify(FeedBackItemArrayNew),
            AssignedToId: { "results": (AssignedToIds != undefined && AssignedToIds?.length > 0) ? AssignedToIds : [] },
            ResponsibleTeamId: { "results": (ResponsibleTeamIds != undefined && ResponsibleTeamIds?.length > 0) ? ResponsibleTeamIds : [] },
            TeamMembersId: { "results": (TeamMemberIds != undefined && TeamMemberIds?.length > 0) ? TeamMemberIds : [] },
            TaskID :TaskID,
            TaskLevel : Tasklevel


        }).then((res: any) => {
            console.log(res);
            if (PopupType == 'CreatePopup') {
                res.data['SiteIcon'] = AllItems.SiteIcon
                res.data['listId'] = AllItems.listId
                res.data['SharewebTaskType'] = { Title: 'Task' }
                res.data['PortfolioType'] =   portFolioTypeId != undefined ? portFolioTypeId[0]:null
                res.data.AssignedTo = []
                res.data.ResponsibleTeam = []
                res.data.TeamMembers = []
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
                res.data.DueDate = res?.data?.DueDate ? Moment(res?.data?.DueDate).format("DD-MM-YYYY") : null,
                    res.data['siteType'] = AllItems.siteType
                res.data['Shareweb_x0020_ID'] = SharewebID
                if (SelectedTasks != undefined && SelectedTasks.length > 0)
                    setIsPopupComponent(true)
                setSharewebTask(res.data)
                closeTaskStatusUpdatePoup(res);
            }
            else {
                res.data['SiteIcon'] = AllItems.SiteIcon
                res.data['listId'] = AllItems.listId
                res.data['SharewebTaskType'] = { Title: 'Task' }
                res.data['PortfolioType'] =  portFolioTypeId != undefined ? portFolioTypeId[0]:null
                res.data.DueDate = res?.data?.DueDate ? Moment(res?.data?.DueDate).format("MM-DD-YYYY") : null,
                    res.data['siteType'] = AllItems.siteType
                res.data['Shareweb_x0020_ID'] = SharewebID
                res.data.ClientCategory = clientcaterogiesdata2,
                    res.data.Created = new Date();
                res.data.Author = {
                    Id: res?.data?.AuthorId
                }
                res.data.TeamMembers = AllTeamMembers?.length > 0 ? AllTeamMembers : []
                res.data.ResponsibleTeam = TeamLeaderws?.length > 0 ? TeamLeaderws : []
                res.data.AssignedTo = AssignedToUser?.length > 0 ? AssignedToUser : []
                res.Item_x0020_Type = ""
                setSharewebTask(res.data)
                closeTaskStatusUpdatePoup(res);

            }



        })

    }
    const createChildAsWorkStream = async (item: any, Type: any, index: any, WorstreamLatestId: any) => {
        var NewDate = ''
        var clientcaterogiesdata2: any = [];
        var AssignedToUser: any = [];
        var AllTeamMembers: any = [];
        var TeamLeaderws: any = [];
        WorstreamLatestId += index;
        var SharewebID = '';
        if (Task == undefined || Task == '')
            Task = SelectedTasks[0];
        if (TaskprofileId == '' || SelectedTasks.length > 0) {
            TaskprofileId = SelectedTasks[0].Id;
        }
        let LetestLevelData:any=[]
        let Tasklevel:any =''
        let TaskID  = ''


        AllItems?.subRows?.forEach((vall:any)=>{
            if(vall?.TaskType?.Title == 'Workstream'|| vall?.SharewebTaskType?.Title == 'Workstream'){
                LetestLevelData.push(vall)
            }
              
        })
    if(LetestLevelData.length  ==  0){
        Tasklevel = 1
        TaskID = props?.props?.TaskID + '-W'+ WorstreamLatestId;
    }
    else{
        Tasklevel = LetestLevelData.length + 1
         TaskID = props?.props?.TaskID + '-W'+ WorstreamLatestId;
    }


        // if (SharewebTasknewTypeId == 3 || SharewebTasknewTypeId == 5) {
        //     var SharewebID = '';
        //     if (Task?.Portfolio_x0020_Type != undefined && Task?.Portfolio_x0020_Type == 'Component' || Task?.Component != undefined && Task?.Component?.length > 0) {
        //         SharewebID = 'A' + AllItems.SharewebTaskLevel1No + '-W' + WorstreamLatestId;
        //     }
        //     if (Task?.Services != undefined && Task?.Portfolio_x0020_Type == 'Service' || Task?.Services != undefined && Task?.Services?.length > 0) {
        //         SharewebID = 'SA' + AllItems.SharewebTaskLevel1No + '-W' + WorstreamLatestId;
        //     }
        //     if ((Task?.Services != undefined && Task?.Portfolio_x0020_Type == 'Service') || (Task?.Services != undefined && Task?.Services?.length > 0) && (Task.SharewebTaskType.Title == "Workstream" || Task.SharewebTaskType == 'Workstream')) {
        //         SharewebID = 'SA' + AllItems.SharewebTaskLevel1No + '-W' + WorstreamLatestId
        //     }

        //     if (Task?.Events != undefined && Task?.Portfolio_x0020_Type == 'Events') {
        //         SharewebID = 'EA' + AllItems?.SharewebTaskLevel1No + '-T' + WorstreamLatestId;
        //     }
            // if (AllItems.SharewebTaskLevel1No == undefined) {
            //     WorstreamLatestId = AllItems?.SharewebTaskLevel1No;
            // }
        //}
        // else {
        //     SharewebID = 'A' + WorstreamLatestId;
        //     SharewebTasknewTypeId = 2;
        //     WorstreamLatestId = undefined;
        // }
        var Component: any = []
        var RelevantPortfolioIds: any = []

        // smartComponentData.forEach((com: any) => {
        //     if (com != undefined) {
        //         Component.push(com.Id)
        //     }

        // })
        // if (myDate?.editDate != undefined && myDate?.editDate != null) {
        //     var dateValue = myDate?.editDate?.split("/");
        //     var dp = dateValue[1] + "/" + dateValue[0] + "/" + dateValue[2];
        //     var Dateet = new Date(dp)
        //     NewDate = Moment(Dateet).format("ddd, DD MMM yyyy")
        // }
        if (date != undefined) {
            NewDate = new Date(date).toDateString();
        }
        // if (AllItems?.Component != undefined && AllItems?.Component.length > 0) {
        //     Component.push(AllItems.Component[0].Id)
        // }
        // if (AllItems?.Services != undefined && AllItems?.Services.length > 0) {
        //     RelevantPortfolioIds.push(AllItems.Services[0].Id)
        // }
        // if (AllItems?.Portfolio_x0020_Type == undefined) {
        //     if (AllItems.Component != undefined && AllItems.Component.length > 0) {
        //         smartComponentData.push(AllItems.Component);
        //     }

        //     if (AllItems?.Services != undefined && AllItems?.Services.length > 0) {
        //         linkedComponentData.push(AllItems);
        //     }

        // }

        var categoriesItem = '';
        CategoriesData.map((category:any) => {
            if (category.Title != undefined) {
                categoriesItem = categoriesItem == "" ? category.Title : categoriesItem + ';' + category.Title;
            }
        })
        // smartComponentData.forEach((com: any) => {
        //     if (com != undefined) {
        //         Component.push(com[0].Id)
        //     }

        // })
        // if (linkedComponentData != undefined && linkedComponentData?.length > 0) {
        //     linkedComponentData?.map((com: any) => {
        //         if (linkedComponentData != undefined && linkedComponentData?.length >= 0) {
        //             $.each(linkedComponentData, function (index: any, smart: any) {
        //                 RelevantPortfolioIds.push(smart.Id)
        //             })
        //         }
        //     })
        // }
        var CategoryID: any = []
        CategoriesData.map((category: { Id: any; }) => {
            if (category.Id != undefined) {
                CategoryID.push(category.Id)
            }
        })
        if (AllItems?.AssignedTo != undefined && AllItems?.AssignedTo?.length > 0) {
            AllItems.AssignedTo.forEach((obj: any) => {
                AssignedToIds.push(obj.Id);
                AssignedToUser.push(obj);

            })
        }
        if (isDropItemRes == true) {
            if (TaskAssignedTo != undefined && TaskAssignedTo?.length > 0) {
                TaskAssignedTo.map((taskInfo:any) => {
                    AssignedToIds.push(taskInfo.Id);
                    AssignedToUser.push(taskInfo);
                })
            }
        }
        if (AllItems?.TeamMembers != undefined && AllItems?.TeamMembers?.length > 0) {
            AllItems?.TeamMembers.forEach((obj: any) => {
                TeamMemberIds.push(obj.Id);
                AllTeamMembers.push(obj);

            })
        }
        if (isDropItem == true) {
            if (TaskTeamMembers != undefined && TaskTeamMembers?.length > 0) {
                TaskTeamMembers?.map((taskInfo:any) => {
                    TeamMemberIds.push(taskInfo.Id);
                    AllTeamMembers.push(taskInfo);

                })
            }
        }
        if (AllItems?.TeamLeader != undefined && AllItems?.TeamLeader?.length > 0) {
            AllItems?.TeamLeader?.forEach((obj: any) => {
                ResponsibleTeamIds.push(obj.Id);
                TeamLeaderws.push(obj)
            })
        }
        if (isDropItem == true) {
            if (TaskResponsibleTeam != undefined && TaskResponsibleTeam?.length > 0) {
                TaskResponsibleTeam?.map((taskInfo:any) => {
                    ResponsibleTeamIds.push(taskInfo.Id);
                    TeamLeaderws.push(taskInfo)
                })
            }
        }
        if (props?.props != undefined && props?.props?.ClientCategory?.length > 0) {
            if (props?.props?.ClientCategory2 != undefined && props?.props?.ClientCategory2?.results?.length > 0) {
                props?.props?.ClientCategory2?.results?.map((items: any) => {
                    InheritClientCategory.push(items.Id)
                    clientcaterogiesdata2.push(items)
                })
            } else {
                props.props.ClientCategory?.map((items: any) => {
                    InheritClientCategory.push(items.Id)
                    clientcaterogiesdata2.push(items)
                })
            }


        }
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
        let web = new Web(dynamicList.siteUrl);
        // if(props?.props?.ClientTime?.length>0){
        //     props.props.ClientTime=JSON.stringify(props?.props?.ClientTime) 
        // }
        await web.lists.getById(AllItems.listId).items.add({
            Title: postData.Title != '' && postData.Title != undefined ?postData.Title:AllItems.Title,
            Categories: categoriesItem ? categoriesItem : null,
            SharewebCategoriesId: { "results": CategoryID },
            Priority_x0020_Rank: AllItems.Priority_x0020_Rank,
            PortfolioId: AllItems.Id,
            PortfolioTypeId: portFolioTypeId == undefined?null:portFolioTypeId[0]?.Id,
            ParentTaskId: AllItems.Id,
            TaskTypeId: SharewebTasknewTypeId,
            //ParentTaskId :portFolio,
            Priority: AllItems.Priority,
            Body: AllItems.Description,
            // DueDate: NewDate != '' && NewDate != undefined ? NewDate : undefined,
            DueDate: myDate.editDate = myDate.editDate ? Moment(myDate?.editDate).format("ddd, DD MMM yyyy") : null,
            ClientCategoryId: { "results": InheritClientCategory },
            SiteCompositionSettings: props?.props?.SiteCompositionSettings != undefined ? props?.props?.SiteCompositionSettings : "",
            ClientTime: props?.props?.ClientTime != null ? props?.props?.ClientTime : "",
            AssignedToId: { "results": (AssignedToIds != undefined && AssignedToIds?.length > 0) ? AssignedToIds : [] },
            ResponsibleTeamId: { "results": (ResponsibleTeamIds != undefined && ResponsibleTeamIds?.length > 0) ? ResponsibleTeamIds : [] },
            TeamMembersId: { "results": (TeamMemberIds != undefined && TeamMemberIds?.length > 0) ? TeamMemberIds : [] },
            TaskID :TaskID,
            TaskLevel : Tasklevel

        }).then((res: any) => {
            console.log(res);
            if (PopupType == 'CreatePopup') {
                res.data['SiteIcon'] = AllItems.SiteIcon
                res.data['listId'] = AllItems.listId
                res.data['SharewebTaskType'] = { Title: 'Workstream' }
                res.data['listId'] = AllItems.listId
                res.data['Shareweb_x0020_ID'] = SharewebID;
                res.data['PortfolioType'] =  portFolioTypeId != undefined ? portFolioTypeId[0]:null
                res.data['Portfolio'] = { 'Id': portFolio };
                res.data.DueDate = res?.data?.DueDate != null ? Moment(res?.data?.DueDate).format("DD-MM-YYYY") : null,
                    res.data['siteType'] = AllItems.siteType

                res.data.ClientCategory = clientcaterogiesdata2,
                    res.data.Created = new Date();
                res.data.Author = {
                    Id: res?.data?.AuthorId
                }
                res.data.TeamMembers = AllTeamMembers?.length > 0 ? AllTeamMembers : []
                res.data.ResponsibleTeam = TeamLeaderws?.length > 0 ? TeamLeaderws : []
                res.data.AssignedTo = AssignedToUser?.length > 0 ? AssignedToUser : []
                res.Item_x0020_Type = ""
                setIsPopupComponent(true)
                setSharewebTask(res.data)
                closeTaskStatusUpdatePoup(res);
            }
            else {
                res.data['SiteIcon'] = AllItems.SiteIcon
                res.data['listId'] = AllItems.listId
                res.data['SharewebTaskType'] = { Title: 'Workstream' }
                res.data['Shareweb_x0020_ID'] = SharewebID;
                res.data['PortfolioType'] =   portFolioTypeId != undefined ? portFolioTypeId[0]:null
                res.data['Portfolio'] = { 'Id': portFolio };
                res.data.DueDate = res?.data?.DueDate != null ? Moment(res?.data?.DueDate).format("MM-DD-YYYY") : null;
                res.data['siteType'] = AllItems.siteType

                res.data.ClientCategory = clientcaterogiesdata2,
                    res.data.Created = new Date();
                res.data.Author = {
                    Id: res?.data?.AuthorId
                }
                res.data.TeamMembers = AllTeamMembers?.length > 0 ? AllTeamMembers : []
                res.data.ResponsibleTeam = TeamLeaderws?.length > 0 ? TeamLeaderws : []
                res.data.AssignedTo = AssignedToUser?.length > 0 ? AssignedToUser : []
                res.Item_x0020_Type = ""
                setSharewebTask(res.data)
                closeTaskStatusUpdatePoup(res);
            }



        })

    }
    const deleteCategories = (id: any) => {
        CategoriesData.map((catId: { Id: any; }, index: any) => {
            if (id == catId.Id) {
                CategoriesData.splice(index, 1)
            }
        })
        setCategoriesData((CategoriesData: any) => ([...CategoriesData]));

    }
    const SelectPriority = (priority: any, e: any) => {
        if (priority == '(1) High') {
            setselectPriority('8')
        }
        if (priority == '(2) Normal') {
            setselectPriority("4")
        }
        if (priority == '(3) Low') {
            setselectPriority("1")
        }
    }
    const SelectPriorityArray = (data: any, e: any) => {
        if (e.target.value == '(1) High') {
            data.selectPriority = '8'
            data.Priorityy = e.target.value;
        }
        if (e.target.value == '(2) Normal') {
            data.selectPriority = "4"
            data.Priorityy = e.target.value;
        }
        if (e.target.value == '(3) Low') {
            data.selectPriority = ("1")
            data.Priorityy = e.target.value;
        }
        setInputFields((inputFields: any) => [...inputFields]);
    }
    const PriorityArray = (e: any, data: any) => {
        if (e.target.value == '1' || e.target.value == '2' || e.target.value == '3') {
            data.selectPriority = (e.target.value)
            // setPriorityy(true)
        }
        if (e.target.value == '4' || e.target.value == '5' || e.target.value == '6' || e.target.value == '7') {
            data.selectPriority = (e.target.value)
        }
        if (e.target.value == '8' || e.target.value == '9' || e.target.value == '10') {
            data.selectPriority = (e.target.value)
        }
        setInputFields((inputFields: any) => [...inputFields]);
    }
    const Priority = (e: any) => {
        if (e.target.value == '1' || e.target.value == '2' || e.target.value == '3') {
            setselectPriority(e.target.value)
            setPriorityy(true)
        }
        if (e.target.value == '4' || e.target.value == '5' || e.target.value == '6' || e.target.value == '7') {
            setselectPriority(e.target.value)
            setPriorityy(true)
        }
        if (e.target.value == '8' || e.target.value == '9' || e.target.value == '10') {
            setselectPriority(e.target.value)
            setPriorityy(true)
        }

    }
    const createChildAsTask = async (item: any, Type: any, index: any) => {
        let NewDate = ''
        var RelevantPortfolioIds: any = []
        var clientcaterogiesdata2: any = [];
        var AssignedToUser: any = [];
        var AllTeamMembers: any = [];
        var TeamLeaderws: any = [];
        let LetestLevelData:any=[]
        let Tasklevel:any =''
        let TaskID  = ''
        let web = new Web(dynamicList.siteUrl);
        let componentDetails: any = [];
        componentDetails = await web.lists
            .getById(AllItems?.listId)
            .items
            .select("Id,Title")
            .orderBy("Id", false)
            .top(1)
            .get()
        console.log(componentDetails)
        var LatestId = componentDetails[0].Id + 1;
       
        if (Task == undefined || Task == '')
            Task = SelectedTasks[0];
        if (TaskprofileId == '' || SelectedTasks.length > 0) {
            TaskprofileId = SelectedTasks[0].Id;
        }
        AllItems?.subRows?.forEach((vall: any) => {
            if (vall?.TaskType?.Title == 'Task' || vall?.SharewebTaskType?.Title == 'Task') {
                LetestLevelData.push(vall)
            }

        })
        if (LetestLevelData.length == 0) {
            Tasklevel = 1
            TaskID = props?.props?.TaskID + '-T' + LatestId;
        }
        else {
            Tasklevel = LetestLevelData.length + 1
            TaskID = props?.props?.TaskID + '-T' + LatestId;;
        }
     
            // var SharewebID = '';
            // if (Task?.Portfolio_x0020_Type != undefined && Task?.Portfolio_x0020_Type == 'Component') {
            //     SharewebID = 'A' + AllItems.SharewebTaskLevel1No + '-T' + LatestId;
            // }
            // if (Task?.Services != undefined && Task.Services.length > 0 || Task?.Portfolio_x0020_Type == 'Service') {
            //     SharewebID = 'SA' + AllItems.SharewebTaskLevel1No + '-T' + LatestId;
            // }
            // if (Task?.Events != undefined && Task.Events.length > 0 || Task?.Portfolio_x0020_Type == 'Events') {
            //     SharewebID = 'EA' + AllItems.SharewebTaskLevel1No + '-T' + LatestId;
            // }
            // if (Task?.Component != undefined && Task.Component.length > 0) {
            //     SharewebID = 'CA' + Task.SharewebTaskLevel1No + '-T' + LatestId;
            // }
            // if (Task?.Component == undefined && Task.Services == undefined) {
            //     SharewebID = 'T' + LatestId;
            // }
           
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
            if (AllItems?.AssignedTo != undefined && AllItems?.AssignedTo?.length > 0) {
                AllItems.AssignedTo.forEach((obj: any) => {
                    AssignedToIds.push(obj.Id);
                    AssignedToUser.push(obj)
                })
            }
            if (isDropItemRes == true) {
                if (TaskAssignedTo != undefined && TaskAssignedTo?.length > 0) {
                    TaskAssignedTo.map((taskInfo) => {
                        AssignedToIds.push(taskInfo.Id);
                        AssignedToUser.push(taskInfo);
                    })
                }
            }
            if (AllItems?.TeamMembers != undefined && AllItems?.TeamMembers?.length > 0) {
                AllItems.TeamMembers.forEach((obj: any) => {
                    TeamMemberIds.push(obj.Id);
                    AllTeamMembers.push(obj)
                })
            }
            if (isDropItem == true) {
                if (TaskTeamMembers != undefined && TaskTeamMembers?.length > 0) {
                    TaskTeamMembers.map((taskInfo) => {
                        TeamMemberIds.push(taskInfo.Id);
                        AllTeamMembers.push(taskInfo)
                    })
                }
            }
            if (AllItems?.TeamLeader != undefined && AllItems?.TeamLeader?.length > 0) {
                AllItems.TeamLeader.forEach((obj: any) => {
                    ResponsibleTeamIds.push(obj.Id);
                    TeamLeaderws.push(obj)
                })
            }
            if (isDropItem == true) {
                if (TaskResponsibleTeam != undefined && TaskResponsibleTeam?.length > 0) {
                    TaskResponsibleTeam.map((taskInfo) => {
                        ResponsibleTeamIds.push(taskInfo.Id);
                        TeamLeaderws.push(taskInfo)
                    })
                }
            }
            if (props?.props != undefined && props?.props?.ClientCategory?.length > 0) {
                if (props?.props?.ClientCategory2 != undefined && props?.props?.ClientCategory2?.results?.length > 0) {
                    props?.props?.ClientCategory2?.results?.map((items: any) => {
                        InheritClientCategory.push(items.Id)
                        clientcaterogiesdata2.push(items)
                    })
                } else {
                    props.props.ClientCategory?.map((items: any) => {
                        InheritClientCategory.push(items.Id)
                        clientcaterogiesdata2.push(items)
                    })
                }
            }

           
            await web.lists.getById(AllItems.listId).items.add({
                Title: postData.Title != '' && postData.Title != undefined ?postData.Title:AllItems.Title,
    
                Categories: categoriesItem ? categoriesItem : null,
                Priority_x0020_Rank: AllItems.Priority_x0020_Rank,
                PortfolioId: AllItems.Id,
                PortfolioTypeId: portFolioTypeId == undefined ?null:portFolioTypeId[0]?.Id,
                TaskTypeId: SharewebTasknewTypeId,
                SharewebCategoriesId: { "results": CategoryID },
                ParentTaskId: AllItems.Id,
                Body: AllItems.Description,
        
                DueDate: myDate.editDate = myDate.editDate != null ? Moment(myDate?.editDate).format("ddd, DD MMM yyyy") : null,
                Priority: AllItems.Priority,
                AssignedToId: { "results": (AssignedToIds != undefined && AssignedToIds?.length > 0) ? AssignedToIds : [] },
                ResponsibleTeamId: { "results": (ResponsibleTeamIds != undefined && ResponsibleTeamIds?.length > 0) ? ResponsibleTeamIds : [] },
                TeamMembersId: { "results": (TeamMemberIds != undefined && TeamMemberIds?.length > 0) ? TeamMemberIds : [] },
                ClientCategoryId: { "results": InheritClientCategory },
                SiteCompositionSettings: props?.props?.SiteCompositionSettings != undefined ? props?.props?.SiteCompositionSettings : "",
                ClientTime: props?.props?.ClientTime != null ? props?.props?.ClientTime : "",
                TaskID :TaskID,
                TaskLevel : Tasklevel
    
            }).then((res: any) => {
                console.log(res);
                res.data['SiteIcon'] = AllItems?.SiteIcon
                res.data['listId'] = AllItems?.listId
                res.data['PortfolioType'] =  portFolioTypeId != undefined ? portFolioTypeId[0]:null
                res.data['Portfolio'] = { 'Id': portFolio };
                res.data['TaskType'] = { 'Id': res.data?.TaskTypeId };
                // res.DueDate = NewDate != '' && NewDate != undefined ? NewDate : undefined,
                res.data.DueDate = res?.data?.DueDate ? Moment(res?.data?.DueDate).format("MM-DD-YYYY") : null,
                    res.data['siteType'] = AllItems.siteType

                res.data.Created = new Date();
                res.data.Author = {
                    Id: res?.data?.AuthorId
                }
                res.data.ClientCategory = clientcaterogiesdata2,
                    res.data.TeamMembers = AllTeamMembers?.length > 0 ? AllItems?.AllTeamMembers : []
                res.data.ResponsibleTeam = TeamLeaderws.length > 0 ? TeamLeaderws : []
                res.data.AssignedTo = AssignedToUser?.length > 0 ? AssignedToUser : []
                res.Item_x0020_Type = ""
                closeTaskStatusUpdatePoup(res);
            })
        

    }
    const EditComponentPicker = (item: any) => {
        setIsComponentPicker(true);
        setSharewebCategory(item);

    }
    const EditComponent = (items: any) => {

        setIsComponent(true);
        setSharewebComponent(items);

    }
    const selectType = async (type: any) => {
        if (type == 'Task') {
            setcheckedWS(false)
            setcheckedTask(true)
        }
        if (type == 'Workstream') {
            setcheckedWS(true)
            setcheckedTask(false)
        }

        let web = new Web(dynamicList?.siteUrl);
        TaskTypeItems = await web.lists
            .getById(dynamicList?.TaskTypeID)
            .items
            .select("Id,Title,Shareweb_x0020_Edit_x0020_Column,Prefix,Level")
            .top(4999)
            .get()
        console.log(TaskTypeItems)
        TaskTypeItems?.forEach((item: any) => {
            if (item.Title == type) {
                SharewebTasknewTypeId = item.Id;
                SharewebTasknewType = item.Title;
            }
        })
    }
    // const handleDatedue = (date: any) => {
    //     // let selectedDate = new window.Date(date)
    //     // let formatDate = moment(selectedDate).format('DDMMYYYY')
    //     // let datee = formatDate.length < 9
    //     if (date) {
    //         // var final = moment(selectedDate).format("DD/MM/YYYY")
    //         // AllItems.DueDate = date;
    //         setMyDate(date);
    //     }
    //     else {
    //         setMyDate(undefined)
    //     }
    // };
    const onRenderCustomHeaderMain = () => {
        return (
            <div className={AllItems?.Portfolio_x0020_Type == 'Service' || AllItems?.Services?.length > 0 ? "serviepannelgreena d-flex full-width pb-1" : "d-flex full-width pb-1"} >
                <div style={{ marginRight: "auto", fontSize: "20px", fontWeight: "600", marginLeft: '20px' }}>
                    <h2 className='heading'>
                        {`Create Item`}
                    </h2>
                </div>
                <Tooltip ComponentId='1710' />
            </div>
        );
    };
    // const SelectDate = (Date: any) => {
    //     if (Date == 'Today') {

    //         let change = moment().format('YYYY-MM-DD hh:mm:ss')
    //         let NewDate = new window.Date().toString()
    //         let FinalDate = moment(NewDate).format("DD/MM/YYYY")

    //     }
    //     if (Date == 'Tomorrow') {
    //         let Tommorrow = new window.Date();
    //         Tommorrow.setDate(Tommorrow.getDate() + 1);
    //         let FinalDate = moment(Tommorrow).format("DD/MM/YYYY")
    //         console.log(FinalDate)
    //     }
    //     if (Date == 'This Week') {
    //         let ThisWeek = new window.Date();
    //         ThisWeek.setDate(ThisWeek.getDate());
    //         let getdayitem = ThisWeek.getDay();
    //         let dayscount = 7 - getdayitem
    //         ThisWeek.setDate(ThisWeek.getDate() + dayscount);
    //         let FinalDate = moment(ThisWeek).format("DD/MM/YYYY")
    //     }
    //     if (Date == 'This Month') {
    //         let ThisMonth = new window.Date();
    //         let year = ThisMonth.getFullYear();
    //         let month = ThisMonth.getMonth();
    //         let lastday = new window.Date(year, month + 1, 0);
    //         var FinalDate = moment(lastday).format("DD/MM/YYYY")
    //     }
    //     setMyDate(FinalDate)
    // }


    const SelectDate = (item: any) => {
        let dates = new Date();
        if (item == 'Today') {
            setMyDate({ ...myDate, editDate: dates, selectDateName: item });
        }
        if (item == 'Tomorrow') {
            setMyDate({ ...myDate, editDate: dates.setDate(dates.getDate() + 1), selectDateName: item })
        }
        if (item == 'This Week') {
            setMyDate({ ...myDate, editDate: new Date(dates.setDate(dates.getDate() - dates.getDay() + 7)), selectDateName: item });
        }
        if (item == 'This Month') {
            let lastDay = new Date(dates.getFullYear(), dates.getMonth() + 1, 0);
            setMyDate({ ...myDate, editDate: lastDay, selectDateName: item });
        }
    }
    const SelectChildDate = (Value: any, item: any) => {
        let dates = new Date();
        if (Value !== null && item === null) {
            Value.editDate = item;
            Value.selectDateName = item;
        }
        if (item == 'Today') {
            Value.editDate = dates;
            Value.selectDateName = item;
        }
        if (item == 'Tomorrow') {
            Value.editDate = dates.setDate(dates.getDate() + 1);
            Value.selectDateName = item;
        }
        if (item == 'This Week') {
            Value.editDate = new Date(dates.setDate(dates.getDate() - dates.getDay() + 7));
            Value.selectDateName = item;
        }
        if (item == 'This Month') {
            let lastDay = new Date(dates.getFullYear(), dates.getMonth() + 1, 0);
            Value.editDate = lastDay;
            Value.selectDateName = item;
        }
        setInputFields((inputFields: any) => [...inputFields]);
    }
    const clickonDate = (Value: any, e: any) => {
        let dates = new Date();
        Value.editDate = e.target.value;

        setInputFields((inputFields: any) => [...inputFields]);
    }
    // React.useEffect(()=>{
    //     if(myDate?.editDate == undefined || myDate.editDate == null){
    //         let dates = new Date();
    //         setMyDate({ ...myDate, editDate: dates, selectDateName: "Today" });
    //     }
    // })

    const AddchildItem = () => {
        setShowChildData(true)
        setInputFields([...inputFields, {
            Title: '',
            ItemRank: '',
            Priority: '',
            DueDate: '',
            Description: ''
        }])
    }
    const removeInputFields = (index: any) => {
        const rows = [...inputFields];
        rows.splice(index, 1);
        setInputFields(rows);
    }

    // const Addchild =()=>{
    //     return(
    //         <>
    //         <div className='row mt-4'>
    //            <div className='col-sm-4'>
    //                <div className="input-group">
    //                    <label className="full-width">Item Rank</label>
    //                    <select
    //                        className="full_width searchbox_height"
    //                        defaultValue={AllItems?.ItemRankTitle}
    //                        onChange={(e) =>
    //                            (AllItems.ItemRankTitle = e.target.value)
    //                        }
    //                    >
    //                        <option>
    //                            {AllItems?.ItemRankTitle == undefined
    //                                ? "select Item Rank"
    //                                : AllItems.ItemRankTitle}
    //                        </option>
    //                        {TaskItemRank &&
    //                            TaskItemRank[0].map(function (h: any, i: any) {
    //                                return (
    //                                    <option
    //                                        key={i}
    //                                        defaultValue={AllItems?.ItemRankTitle}
    //                                    >
    //                                        {AllItems?.ItemRankTitle == h.rankTitle
    //                                            ? AllItems.ItemRankTitle
    //                                            : h.rankTitle}
    //                                    </option>
    //                                );
    //                            })}
    //                    </select>
    //                </div>
    //            </div>
    //            <div className='col-sm-4'>
    //                <fieldset>
    //                    <label className="full-width">Priority
    //                    <span>
    //                        <div className='popover__wrapper ms-1' data-bs-toggle="tooltip" data-bs-placement="auto">
    //                        <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/infoIcon.png" />

    //                        <div className="popover__content">
    //                            <span>

    //                                    8-10 = High Priority,<br/>
    //                                    4-7 = Normal Priority,<br/>
    //                                        1-3 = Low Priority
    //                                        </span>

    //                                </div>

    //                        </div>
    //                        </span></label>

    //                    <input type="text" className="full-width" placeholder="Priority" ng-model="PriorityRank"
    //                        defaultValue={selectPriority} onChange={(e: any) => Priority(e)} />
    //                    <div className="mt-2">
    //                        <label>
    //                            <input className="form-check-input  me-1" name="radioPriority"
    //                                type="radio" value="(1) High"
    //                                defaultChecked={Priorityy} onClick={(e: any) => SelectPriority('(1) High', e)} />High
    //                        </label>
    //                    </div>
    //                    <div className="">
    //                        <label>
    //                            <input className="form-check-input me-1" name="radioPriority"
    //                                type="radio" value="(2) Normal"
    //                                defaultChecked={Priorityy} onClick={(e: any) => SelectPriority('(2) Normal', e)} />Normal
    //                        </label>
    //                    </div>
    //                    <div className="">
    //                        <label>
    //                            <input className="form-check-input me-1" name="radioPriority"
    //                                type="radio" value="(3) Low" defaultChecked={Priorityy} onClick={(e: any) => SelectPriority('(3) Low', e)} />Low
    //                        </label>
    //                    </div>
    //                </fieldset>

    //            </div>
    //            <div className='col-sm-4'>
    //                <label className="full_width ng-binding" ng-bind-html="GetColumnDetails('dueDate') | trustedHTML">Due Date</label>
    //                <DatePicker className="form-control"
    //                    selected={date}
    //                    value={date}
    //                    onChange={handleDatedue}
    //                    dateFormat="dd/MM/yyyy"


    //                />
    //                 <div className="">
    //                        <label>
    //                            <input className="form-check-input me-1" name="radioPriority"
    //                                type="radio" value="(3) Low" defaultChecked={Priorityy} onClick={(e: any) => SelectDate('Today')} />Today
    //                        </label>
    //                    </div>
    //                    <div className="">
    //                        <label>
    //                            <input className="form-check-input me-1" name="radioPriority"
    //                                type="radio" value="(3) Low" defaultChecked={Priorityy} onClick={(e: any) => SelectDate('Tomorrow')} />Tomorrow
    //                        </label>
    //                    </div>
    //                    <div className="">
    //                        <label>
    //                            <input className="form-check-input me-1" name="radioPriority"
    //                                type="radio" value="(3) Low" defaultChecked={Priorityy} onClick={(e: any) => SelectDate('This Week')} />This Week
    //                        </label>
    //                    </div>
    //                    <div className="">
    //                        <label>
    //                            <input className="form-check-input me-1" name="radioPriority"
    //                                type="radio" value="(3) Low" defaultChecked={Priorityy} onClick={(e: any) => SelectDate('This Month')} />This Month
    //                        </label>
    //                    </div>
    //            </div>

    //        </div>
    //        <div className='row'>
    //            <div className='col-sm-12 mt-1'>
    //                <label className='full_width'>Description</label>
    //                <textarea rows={4} className="ng-pristine ng-valid ng-empty ng-touched full_width" onChange={(e: any) => AllItems.Description = e.target.value}></textarea>
    //            </div>
    //        </div>

    //        </>
    //     )
    // }
    return (
        <>
            <Panel
                onRenderHeader={onRenderCustomHeaderMain}
                type={PanelType.custom}
                customWidth="900px"
                isOpen={TaskStatuspopup}
                onDismiss={closeTaskStatusUpdatePoup}
                isBlocking={false}
                className={AllItems?.Portfolio_x0020_Type == 'Service' || AllItems?.Services?.length > 0  || props?.props?.PortfolioType?.Id == 2 ? "serviepannelgreena" : ""}
            >
                <div className="modal-body border p-3 active Create-Item">
                    <div className='row'>
                        {
                            // ParentArray?.map((pare: any) => {
                            //     return (
                            //         <>
                            <tr className='d-flex'>
                                <td className='list-none mx-2'><b>Parent</b></td>
                                {/* <td className='list-none mx-2'>{`${pare.Title} >`}</td> */}
                                {
                                    ParentArray?.map((childsitem: any, index: any) => {
                                        return (
                                            <>
                                                <td className='list-none'>{ParentArray.length - 1 == index ? `${childsitem?.Title}` : `${childsitem?.Title}>`}</td>
                                            </>
                                        )
                                    })
                                }
                            </tr>
                            //     </>
                            // )
                            // })
                        }
                    </div>
                    <div className='row'>
                        <span className="col-sm-3 rediobutton ">
                            <span className='SpfxCheckRadio'>
                                <input type="radio" checked={checkedWS} onClick={() => selectType('Workstream')} className="radio" /> Workstream
                            </span>
                            <span className='SpfxCheckRadio'>
                                <input type="radio" checked={checkedTask} onClick={() => selectType('Task')} className="radio" />Task
                            </span>
                        </span>
                    </div>
                    <div className='row'>
                        <div className="col-md-8">
                            <input className="full-width" type="text"
                                placeholder="Enter Child Item Title" defaultValue={AllItems?.Title}  onChange={(e) => setPostData({ ...postData, Title: e.target.value })}
                            />
                        </div>
                        
                    </div>
                    <div className='row mt-2'>
                        <div className='col-sm-4'>
                            <div className="input-group">
                                <label className="full-width">Item Rank</label>
                                <select
                                    className="full_width searchbox_height"
                                    defaultValue={AllItems?.ItemRankTitle}
                                    onChange={(e) =>
                                        (AllItems.ItemRankTitle = e.target.value)
                                    }
                                >
                                    <option>
                                        {AllItems?.ItemRankTitle == undefined
                                            ? "select Item Rank"
                                            : AllItems.ItemRankTitle}
                                    </option>
                                    {TaskItemRank &&
                                        TaskItemRank[0].map(function (h: any, i: any) {
                                            return (
                                                <option
                                                    key={i}
                                                    defaultValue={AllItems?.ItemRankTitle}
                                                >
                                                    {AllItems?.ItemRankTitle == h.rankTitle
                                                        ? AllItems.ItemRankTitle
                                                        : h.rankTitle}
                                                </option>
                                            );
                                        })}
                                </select>
                            </div>
                        </div>
                        <div className='col-sm-4'>
                            <div className='Create-Priority'>
                                <label className="full-width">

                                    <div className='popover__wrapper ms-1' data-bs-toggle="tooltip" data-bs-placement="auto">
                                        Priority  <span title="Edit" className="svg__iconbox svg__icon--info "></span>
                                        <div className="popover__content">
                                            8-10 = High Priority,<br />
                                            4-7 = Normal Priority,<br />
                                            1-3 = Low Priority
                                        </div>

                                    </div>

                                </label>

                                <input type="text" className="full-width" placeholder="Priority" ng-model="PriorityRank"
                                    defaultValue={selectPriority} onChange={(e: any) => Priority(e)} />
                                <dl className='mt-1'>
                                    <dt>
                                        <label className='SpfxCheckRadio'>
                                            <input className="radio" name="radioPriority"
                                                type="radio" value="(1) High"
                                                defaultChecked={Priorityy} onClick={(e: any) => SelectPriority('(1) High', e)} />High
                                        </label>
                                    </dt>
                                    <dt>
                                        <label className='SpfxCheckRadio'>
                                            <input className="radio" name="radioPriority"
                                                type="radio" value="(2) Normal"
                                                defaultChecked={Priorityy} onClick={(e: any) => SelectPriority('(2) Normal', e)} />Normal
                                        </label>
                                    </dt>
                                    <dt>
                                        <label className='SpfxCheckRadio'>
                                            <input className="radio" name="radioPriority"
                                                type="radio" value="(3) Low" defaultChecked={Priorityy} onClick={(e: any) => SelectPriority('(3) Low', e)} />Low
                                        </label>
                                    </dt>
                                </dl>
                            </div>

                        </div>
                        <div className='col-sm-4 position-relative'>
                            <label className="full_width" ng-bind-html="GetColumnDetails('dueDate') | trustedHTML">Due Date</label>
                            <input className="form-control"
                                type="date"
                                // value={myDate != null ? Moment(new Date(myDate)).format('YYYY-MM-DD') : ''}
                                // onChange={(e) => setMyDate(`${e.target.value}`)}
                                // dateFormat="dd/MM/yyyy"
                                value={myDate.editDate != null ? Moment(new Date(myDate.editDate)).format('YYYY-MM-DD') : ""}
                                onChange={(e: any) => setMyDate({ ...myDate, editDate: e.target.value })} />
                            {myDate.editDate != null && <div className="input-close"><span className="svg__iconbox svg__icon--cross" onClick={() => setMyDate({ ...myDate, editDate: null, selectDateName: "" })}></span></div>}
                            <dl className='mt-1'>
                                <dt className="">
                                    <label className='SpfxCheckRadio'>
                                        <input className="radio" name="radioPriority2"
                                            type="radio" value="(3) Low" checked={myDate.selectDateName == 'Today'} onClick={(e: any) => SelectDate('Today')} />Today
                                    </label>
                                </dt>
                                <dt>
                                    <label className='SpfxCheckRadio'>
                                        <input className="radio" name="radioPriority2"
                                            type="radio" value="(3) Low" checked={myDate.selectDateName == 'Tomorrow'} onClick={(e: any) => SelectDate('Tomorrow')} />Tomorrow
                                    </label>
                                </dt>
                                <dt>
                                    <label className='SpfxCheckRadio'>
                                        <input className="radio" name="radioPriority2"
                                            type="radio" value="(3) Low" checked={myDate.selectDateName == 'This Week'} onClick={(e: any) => SelectDate('This Week')} />This Week
                                    </label>
                                </dt>
                                <dt>
                                    <label className='SpfxCheckRadio'>
                                        <input className="radio" name="radioPriority2"
                                            type="radio" value="(3) Low" checked={myDate.selectDateName == 'This Month'} onClick={(e: any) => SelectDate('This Month')} />This Month
                                    </label>
                                </dt>
                            </dl>
                        </div>



                    </div>
                    <div className='row mt-2'>
                        {AllItems != undefined && dynamicList != undefined && <TeamConfigurationCard ItemInfo={AllItems} AllListId={dynamicList} parentCallback={DDComponentCallBack}></TeamConfigurationCard>}
                    </div>
                    <div className='row'>
                        <div className='col-sm-12 mt-1'>
                            <label className='full_width'>Description</label>
                            <textarea rows={4} className="ng-pristine ng-valid ng-empty ng-touched full_width" onChange={(e: any) => AllItems.Description = e.target.value}></textarea>
                        </div>
                    </div>


                    {/* _________________Add More Item____________________________________________________________________________________________________________ */}

                    {
                        showChildData == true && inputFields?.map((data, index) => {
                            const { Priority, DueDate, ItemRank, Description } = data;
                            return (
                                <div>
                                     <div className="border-bottom clearfix">
                                       {(inputFields.length > 0) ? <a className="d-flex justify-content-end" onClick={removeInputFields}><span className='svg__iconbox svg__icon--cross'></span><span>Clear section</span> </a> : ''}
                                   </div>

                                    <div className="col-sm-8 pad0">
                                        <label className="full-width"></label>
                                        <input className="full-width" type="text"
                                            placeholder="Enter Child Item Title" onChange={(e: any) => data.Title = e.target.value}
                                        />
                                    </div>
                                    <div className="row my-3" key={index}>
                                        <div className='col-sm-4'>
                                            <div className="input-group">
                                                <label className="full-width">Item Rank</label>
                                                <select
                                                    className="full_width searchbox_height"
                                                    defaultValue={data?.ItemRankTitle}
                                                    onChange={(e) =>
                                                        (data.ItemRankTitle = e.target.value)
                                                    }
                                                >
                                                    <option>
                                                        {data?.ItemRankTitle == undefined
                                                            ? "select Item Rank"
                                                            : data.ItemRankTitle}
                                                    </option>
                                                    {TaskItemRank &&
                                                        TaskItemRank[0].map(function (h: any, i: any) {
                                                            return (
                                                                <option
                                                                    key={i}
                                                                    defaultValue={data?.ItemRankTitle}
                                                                >
                                                                    {data?.ItemRankTitle == h.rankTitle
                                                                        ? data.ItemRankTitle
                                                                        : h.rankTitle}
                                                                </option>
                                                            );
                                                        })}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="col-sm-4">
                                            <fieldset>
                                                <label className="full-width">Priority
                                                    <span>
                                                        <div className='popover__wrapper ms-1' data-bs-toggle="tooltip" data-bs-placement="auto">
                                                            <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/infoIcon.png" />

                                                            <div className="popover__content">
                                                                <span>

                                                                    8-10 = High Priority,<br />
                                                                    4-7 = Normal Priority,<br />
                                                                    1-3 = Low Priority
                                                                </span>

                                                            </div>

                                                        </div>
                                                    </span></label>

                                                <input type="text" className="full-width" placeholder="Priority"
                                                    defaultValue={data.selectPriority} onClick={(e: any) => PriorityArray(data, e)} />
                                                <div className="mt-2">
                                                    <label>
                                                        <input className="form-check-input  me-1" name={'radioPriority' + index}
                                                            type="radio" value="(1) High"
                                                            defaultChecked={data.Priorityy === "(1) High"} onClick={(e: any) => SelectPriorityArray(data, e)} />High
                                                    </label>
                                                </div>
                                                <div className="">
                                                    <label>
                                                        <input className="form-check-input me-1" name={'radioPriority' + index}
                                                            type="radio" value="(2) Normal"
                                                            defaultChecked={data.Priorityy === "(2) Normal"} onClick={(e: any) => SelectPriorityArray(data, e)} />Normal
                                                    </label>
                                                </div>
                                                <div className="">
                                                    <label>
                                                        <input className="form-check-input me-1" name={'radioPriority' + index}
                                                            type="radio" value="(3) Low" defaultChecked={data.Priorityy === "(3) Low"} onClick={(e: any) => SelectPriorityArray(data, e)} />Low
                                                    </label>
                                                </div>
                                            </fieldset>
                                        </div>

                                        <div className='col-sm-4 position-relative'>
                                            <label className="full_width ng-binding" >Due Date</label>
                                            <input className="form-control"
                                                // selected={date}
                                                type="date"
                                                // value={myDate != null ? Moment(new Date(myDate)).format('YYYY-MM-DD') : ''}
                                                // onChange={(e) => setMyDate(`${e.target.value}`)}
                                                value={data.editDate != null ? Moment(new Date(data.editDate)).format('YYYY-MM-DD') : ''}
                                                onChange={(e: any) => clickonDate(data, e)} />
                                            {data.editDate != null && <div className="input-close"><span className="svg__iconbox svg__icon--cross" onClick={(e: any) => SelectChildDate(data, null)} ></span></div>}
                                            <div className="">
                                                <label>
                                                    <input className="form-check-input me-1" name={'radioPriority1' + index}
                                                        type="radio" value="Today" checked={data.selectDateName == "Today"} onClick={(e: any) => SelectChildDate(data, 'Today')} />Today
                                                </label>
                                            </div>
                                            <div className="">
                                                <label>
                                                    <input className="form-check-input me-1" name={'radioPriority1' + index}
                                                        type="radio" value="Tomorrow" checked={data.selectDateName == 'Tomorrow'} onClick={(e: any) => SelectChildDate(data, 'Tomorrow')} />Tomorrow
                                                </label>
                                            </div>
                                            <div className="">
                                                <label>
                                                    <input className="form-check-input me-1" name={'radioPriority1' + index}
                                                        type="radio" value="This Week" defaultChecked={data.selectDateName == "This Week"} onClick={(e: any) => SelectChildDate(data, 'This Week')} />This Week
                                                </label>
                                            </div>
                                            <div className="">
                                                <label>
                                                    <input className="form-check-input me-1" name={'radioPriority1' + index}
                                                        type="radio" value="This Month" checked={data.selectDateName == "This Month"} onClick={(e: any) => SelectChildDate(data, 'This Month')} />This Month
                                                </label>
                                            </div>
                                        </div>



                                    </div>
                                    <div className='row'>
                                        <div className='col-sm-12 mt-1'>
                                            {AllItems != undefined && dynamicList != undefined && <TeamConfigurationCard ItemInfo={AllItems} AllListId={dynamicList} parentCallback={DDComponentCallBack}></TeamConfigurationCard>}
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-sm-12 mt-1'>
                                            <label className='full_width'>Description</label>
                                            <textarea rows={4} className="ng-pristine ng-valid ng-empty ng-touched full_width" onChange={(e: any) => data.Description = e.target.value}></textarea>
                                        </div>
                                    </div>



                                    {/* {(inputFields.length > 0) ? <a className="pull-left" onClick={removeInputFields}><span className='svg__iconbox svg__icon--cross'></span></a> : ''} */}



                                </div>
                            )
                        })
                    }


                </div>

                <a type="button" onClick={() => AddchildItem()}>
                    Add More Child Items
                </a>
                <div className="modal-footer pt-1">
                    {/* {(inputFields.length!==1)? <button className="btn btn-outline-danger" onClick={removeInputFields}>x</button>:''} */}

                    {(inputFields.length === undefined || inputFields.length === 0) && <button type="button" className="btn btn-primary me-1" onClick={() => createWorkStream('CreatePopup')}>
                        Create & OpenPopup
                    </button>}
                    <button type="button" className="btn btn-primary" onClick={() => createWorkStream('Create')}>
                        Create
                    </button>

                </div>

            </Panel>
            {IsComponent && <ComponentPortPolioPopup props={SharewebComponent} Call={Call}></ComponentPortPolioPopup>}
            {IsComponentPicker && <Picker props={SharewebCategory} Call={Call}></Picker>}
            {IsPopupComponent && <EditTaskPopup Items={SharewebTask} Call={Call}></EditTaskPopup>}
        </>
    )
}
export default CreateWS; 