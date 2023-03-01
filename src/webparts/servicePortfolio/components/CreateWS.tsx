import * as React from 'react';
import { arraysEqual, Modal, Panel, PanelType } from 'office-ui-fabric-react';
import DatePicker from "react-datepicker";
import { Web } from "sp-pnp-js";
import "bootstrap/dist/css/bootstrap.min.css";
import TeamConfigurationCard from '../../../globalComponents/TeamConfiguration/TeamConfiguration';
import ComponentPortPolioPopup from '../../EditPopupFiles/ComponentPortfolioSelection';
import Picker from '../../../globalComponents/EditTaskPopup/SmartMetaDataPicker';
import EditTaskPopup from '../../../globalComponents/EditTaskPopup/EditTaskPopup';

const TaskItemRank: any = [];
var TaskTypeItems: any = [];
var SharewebTasknewTypeId: any = ''
var SharewebTasknewType: any = ''
var SelectedTasks: any = []
var Task: any = []
var AssignedToIds: any = [];
var ResponsibleTeamIds: any = [];
var TeamMemberIds: any = [];
const CreateWS = (props: any) => {
    SelectedTasks=[]
    var AllItems = props.props
    console.log(props)
    SelectedTasks.push(AllItems)
    const [TaskStatuspopup, setTaskStatuspopup] = React.useState(true);
    const [isDropItem, setisDropItem] = React.useState(false);
    const [isDropItemRes, setisDropItemRes] = React.useState(false);
    const [SharewebComponent, setSharewebComponent] = React.useState('');
    const [smartComponentData, setSmartComponentData] = React.useState([]);
    const [linkedComponentData, setLinkedComponentData] = React.useState([]);
    const [TaskAssignedTo, setTaskAssignedTo] = React.useState([]);
    const [IsComponentPicker, setIsComponentPicker] = React.useState(false);
    const [SharewebCategory, setSharewebCategory] = React.useState('');
    const [SharewebTask, setSharewebTask] = React.useState('');
    const [IsComponent, setIsComponent] = React.useState(false);
    const [date, setDate] = React.useState(undefined);
    const [TaskTeamMembers, setTaskTeamMembers] = React.useState([]);
    const [selectPriority, setselectPriority] = React.useState('');
    const [Priorityy, setPriorityy] = React.useState(false);
    const [Categories, setCategories] = React.useState([]);
    const[IsPopupComponent,setIsPopupComponent]= React.useState(false)
    const [CategoriesData, setCategoriesData] = React.useState([]);
    const [TaskResponsibleTeam, setTaskResponsibleTeam] = React.useState([]);

    const closeTaskStatusUpdatePoup = (res: any) => {
        setTaskStatuspopup(false)
        props.Call(res);

    }
    // React.useEffect(()=>{
    //     if (AllItems.Portfolio_x0020_Type != undefined) {
    //         if(AllItems.Portfolio_x0020_Type == 'Component'){
    //             smartComponentData.push(AllItems);
    //         }
    //         if(AllItems.Portfolio_x0020_Type == 'Service'){
    //             linkedComponentData.push(AllItems);
    //         }
           
    //     }
    // },[])
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
    var PopupType =''
    const createWorkStream = async (Type: any) => {
        PopupType = Type;
        if (AllItems == '' || AllItems.length > 0) {
            TaskprofileId = AllItems[0].Id;
        }
        console.log(Type)
        let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
        let componentDetails = [];
        componentDetails = await web.lists
            .getById(AllItems.listId)
            .items
            .select("FolderID,Shareweb_x0020_ID,SharewebTaskLevel1No,SharewebTaskLevel2No,AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,FileLeafRef,Title,Id,Priority_x0020_Rank,PercentComplete,Priority,Created,Modified,SharewebTaskType/Id,SharewebTaskType/Title,SharewebTaskType/Level,SharewebTaskType/Prefix,ParentTask/Id,ParentTask/Title,ParentTask/Shareweb_x0020_ID,Author/Id,Author/Title,Editor/Id,Editor/Title")
            .expand("SharewebTaskType,ParentTask,Author,Editor,AssignedTo")
            .filter(("SharewebTaskType/Title eq 'Workstream'") && ("ParentTask/Id eq '" + AllItems.Id + "'"))
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
                } else {
                    createChildAsTask(item, Type, index);
                }
            }
        })



    }
    const createChildAsWorkStream = async (item: any, Type: any, index: any, WorstreamLatestId: any) => {
        WorstreamLatestId += index;
        var SharewebID = '';
        if (Task == undefined || Task == '')
            Task = SelectedTasks[0];
        if (TaskprofileId == '' || SelectedTasks.length > 0) {
            TaskprofileId = SelectedTasks[0].Id;
        }
        if (Task.Component != undefined  && Task.Component.length > 0) {
            SharewebID = 'CA' + Task.SharewebTaskLevel1No + '-W' + WorstreamLatestId;
        }
        if (Task.Services != undefined  && Task.Services.length > 0) {
            SharewebID = 'SA' + Task.SharewebTaskLevel1No + '-W' + WorstreamLatestId;
        }
        // if (Task.SharewebTaskType != undefined && Task.SharewebTaskType.Title != undefined) {
        //     SharewebID = 'A' + Task.SharewebTaskLevel1No + '-W' + WorstreamLatestId;
        // }
        var Component: any = []
        var RelevantPortfolioIds:any=[]
        
        // smartComponentData.forEach((com: any) => {
        //     if (com != undefined) {
        //         Component.push(com.Id)
        //     }

        // })
        if(AllItems.Portfolio_x0020_Type == 'Component'){
            Component.push(AllItems.PortfolioId)
        }
        if(AllItems.Portfolio_x0020_Type == 'Service'){
            RelevantPortfolioIds.push(AllItems.PortfolioId)
        }
        
        var categoriesItem = '';
        CategoriesData.map((category) => {
            if (category.Title != undefined) {
                categoriesItem = categoriesItem == "" ? category.Title : categoriesItem + ';' + category.Title;
            }
        })
        smartComponentData.forEach((com: any) => {
            if (com != undefined) {
                Component.push(com.Id)
            }

        })
        if (linkedComponentData != undefined && linkedComponentData?.length > 0) {
            linkedComponentData?.map((com: any) => {
                if (linkedComponentData != undefined && linkedComponentData?.length >= 0) {
                    $.each(linkedComponentData, function (index: any, smart: any) {
                        RelevantPortfolioIds.push(smart.Id)
                    })
                }
            })
        }
        var CategoryID: any = []
        CategoriesData.map((category) => {
            if (category.Id != undefined) {
                CategoryID.push(category.Id)
            }
        })
        if (isDropItemRes == true) {
            if (TaskAssignedTo != undefined && TaskAssignedTo?.length > 0) {
                TaskAssignedTo.map((taskInfo) => {
                    AssignedToIds.push(taskInfo.Id);
                })
            }
        }
        if (isDropItem == true) {
            if (TaskTeamMembers != undefined && TaskTeamMembers?.length > 0) {
                TaskTeamMembers.map((taskInfo) => {
                    TeamMemberIds.push(taskInfo.Id);
                })
            }
        }
        if (isDropItem == true) {
            if (TaskResponsibleTeam != undefined && TaskResponsibleTeam?.length > 0) {
                TaskResponsibleTeam.map((taskInfo) => {
                    ResponsibleTeamIds.push(taskInfo.Id);
                })
            }
        }

        let web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/SP');
        await web.lists.getById(AllItems.listId).items.add({
            Title: AllItems.Title,
            ComponentId: { "results": Component },
            Categories: categoriesItem ? categoriesItem : null,
            SharewebCategoriesId: { "results": CategoryID },
            Priority_x0020_Rank: AllItems.Priority_x0020_Rank,
            ParentTaskId: AllItems.Id,
            ServicesId: { "results": RelevantPortfolioIds},
            Priority: AllItems.Priority,
            Body:AllItems.Description,
            DueDate: date != undefined ? new Date(date).toDateString() : date,
            SharewebTaskTypeId: SharewebTasknewTypeId,
            Shareweb_x0020_ID: SharewebID,
            SharewebTaskLevel2No: WorstreamLatestId,
            AssignedToId: { "results": (AssignedToIds != undefined && AssignedToIds?.length > 0) ? AssignedToIds : [] },
            Responsible_x0020_TeamId: { "results": (ResponsibleTeamIds != undefined && ResponsibleTeamIds?.length > 0) ? ResponsibleTeamIds : [] },
           Team_x0020_MembersId: { "results": (TeamMemberIds != undefined && TeamMemberIds?.length > 0) ? TeamMemberIds : [] }

        }).then((res: any) => {
            console.log(res);
            if(PopupType=='CreatePopup'){
                closeTaskStatusUpdatePoup(res);
                res.data['SiteIcon']= AllItems.Item_x005F_x0020_Cover.Url
                res.data['listId']= AllItems.listId
                setIsPopupComponent(true)
                setSharewebTask(res.data)
            }
            else{
                closeTaskStatusUpdatePoup(res);
            }
           
           

        })

    }
    const deleteCategories = (id: any) => {
        CategoriesData.map((catId, index) => {
            if (id == catId.Id) {
                CategoriesData.splice(index, 1)
            }
        })
        setCategoriesData(CategoriesData => ([...CategoriesData]));

    }
    const SelectPriority =(priority:any,e:any)=>{
        if(priority == '(1) High'){
            setselectPriority('8')
        }
        if(priority == '(2) Normal'){
            setselectPriority("4")
        }
        if(priority == '(3) Low'){
            setselectPriority("1")
        }
        }
        const Priority=(e:any)=>{
            if(e.target.value == '1' || e.target.value == '2' || e.target.value == '3'){
                setselectPriority(e.target.value)
                setPriorityy(true)
            }
            if(e.target.value == '4' || e.target.value == '5' || e.target.value == '6' || e.target.value == '7'){
                setselectPriority(e.target.value)
                setPriorityy(true)
            }
            if(e.target.value == '8' || e.target.value == '9' || e.target.value == '10'){
                setselectPriority(e.target.value)
                setPriorityy(true)
            }
    
        }
    const createChildAsTask = async (item: any, Type: any, index: any) => {
        var RelevantPortfolioIds:any=[]
        let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
        let componentDetails: any = [];
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
        if (Task == undefined || Task == '')
            Task = SelectedTasks[0];
        if (TaskprofileId == '' || SelectedTasks.length > 0) {
            TaskprofileId = SelectedTasks[0].Id;
        }
        if (SharewebTasknewTypeId == 2 || SharewebTasknewTypeId == 6) {
            var SharewebID = '';
            if (Task.Portfolio_x0020_Type != undefined && Task.Portfolio_x0020_Type == 'Component') {
                SharewebID = 'A' + AllItems.SharewebTaskLevel1No + '-T' + LatestId;
            }
            if (Task.Services != undefined && Task.Portfolio_x0020_Type == 'Service') {
                SharewebID = 'SA' + AllItems.SharewebTaskLevel1No + '-T' + LatestId;
            }
            if (Task.Events != undefined && Task.Portfolio_x0020_Type == 'Events') {
                SharewebID = 'EA' + AllItems.SharewebTaskLevel1No + '-T' + LatestId;
            }
            var Component: any = []
            smartComponentData.forEach((com: any) => {
                if (com != undefined) {
                    Component.push(com.Id)
                }

            })
            // smartComponentData.forEach((com: any) => {
            //     if (com != undefined) {
            //         Component.push(com.Id)
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
            if(AllItems.Portfolio_x0020_Type == 'Component'){
                Component.push(AllItems.PortfolioId)
            }
            if(AllItems.Portfolio_x0020_Type == 'Service'){
                RelevantPortfolioIds.push(AllItems.PortfolioId)
            }
            var categoriesItem = '';
            CategoriesData.map((category) => {
                if (category.Title != undefined) {
                    categoriesItem = categoriesItem == "" ? category.Title : categoriesItem + ';' + category.Title;
                }
            })
            var CategoryID: any = []
            CategoriesData.map((category) => {
                if (category.Id != undefined) {
                    CategoryID.push(category.Id)
                }
            })
            if (isDropItemRes == true) {
                if (TaskAssignedTo != undefined && TaskAssignedTo?.length > 0) {
                    TaskAssignedTo.map((taskInfo) => {
                        AssignedToIds.push(taskInfo.Id);
                    })
                }
            }
            if (isDropItem == true) {
                if (TaskTeamMembers != undefined && TaskTeamMembers?.length > 0) {
                    TaskTeamMembers.map((taskInfo) => {
                        TeamMemberIds.push(taskInfo.Id);
                    })
                }
            }
            if (isDropItem == true) {
                if (TaskResponsibleTeam != undefined && TaskResponsibleTeam?.length > 0) {
                    TaskResponsibleTeam.map((taskInfo) => {
                        ResponsibleTeamIds.push(taskInfo.Id);
                    })
                }
            }
            let web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/SP');
            await web.lists.getById(AllItems.listId).items.add({
                Title: AllItems.Title,
                ComponentId: { "results": Component },
             Categories: categoriesItem ? categoriesItem : null,
             Priority_x0020_Rank: AllItems.Priority_x0020_Rank,
                SharewebCategoriesId: { "results": CategoryID },
                ParentTaskId: AllItems.Id,
                ServicesId: { "results": RelevantPortfolioIds},
                SharewebTaskTypeId: SharewebTasknewTypeId,
                Body:AllItems.Description,
                DueDate: date != undefined ? new Date(date).toDateString() : date,
                Shareweb_x0020_ID: SharewebID,
                PortfolioStructureID: SharewebID,
                Priority: AllItems.Priority,
                SharewebTaskLevel2No: WorstreamLatestId,
                SharewebTaskLevel1No: AllItems.SharewebTaskLevel1No,
                AssignedToId: { "results": (AssignedToIds != undefined && AssignedToIds?.length > 0) ? AssignedToIds : [] },
                Responsible_x0020_TeamId: { "results": (ResponsibleTeamIds != undefined && ResponsibleTeamIds?.length > 0) ? ResponsibleTeamIds : [] },
                Team_x0020_MembersId: { "results": (TeamMemberIds != undefined && TeamMemberIds?.length > 0) ? TeamMemberIds : [] }

            }).then((res: any) => {
                console.log(res);
                res.data['SiteIcon']= AllItems.Item_x005F_x0020_Cover.Url
                res.data['listId']= AllItems.listId
                closeTaskStatusUpdatePoup(res);
            })
        }

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
        let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
        TaskTypeItems = await web.lists
            .getById('21b55c7b-5748-483a-905a-62ef663972dc')
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
    const handleDatedue = (date: any) => {
        AllItems.DueDate = date;
        setDate(date);
        
    };
    return (
        <>
            <Panel
                headerText="Create Item"
                type={PanelType.custom}
                customWidth="900px"
                isOpen={TaskStatuspopup}
                onDismiss={closeTaskStatusUpdatePoup}
                isBlocking={false}
            >
                <div className="modal-body border p-3 bg-f5f5">

                    <div className='row mt-2'>
                        <span className="col-sm-2 padL-0 ">
                            <label>
                                <input type="radio" value="Workstream" onClick={() => selectType('Workstream')} className="me-1" />Workstream
                            </label>
                        </span>
                        <span className="col-sm-2" >
                            <label>
                                <input type="radio" value="Task" onClick={() => selectType('Task')} className="me-1" />Task
                            </label>
                        </span>

                    </div>
                    <div className='row'>
                        <div className="col-sm-8 pad0">
                        <label className="full-width"></label>
                            <input className="full-width" type="text"
                                placeholder="Enter Child Item Title" onChange={(e: any) => AllItems.Title = e.target.value}
                            />
                        </div>
                        <div className="col-sm-4">
                            {AllItems.Portfolio_x0020_Type == 'Component'
                                &&
                                <div className="">
                                    <div ng-show="smartComponent.length==0" className="input-group">
                                        <label ng-show="!IsShowComSerBoth" className="full-width">Component</label>
                                        <input type="text" className="full-width" id="txtSharewebComponentcrt"
                                        /><span role="status" aria-live="polite" title="Edit Component" data-toggle="modal"
                                        onClick={(e) => EditComponent(AllItems)}
                                            className="input-group-text">
                                                 <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/_layouts/15/images/EMMCopyTerm.png" />
                                            </span>
                                    </div>
                                    <div className="col-sm-12 padL-0 PadR0">
                                        <div className="col-sm-12  top-assign  mb-10 padL-0 PadR0">
                                            {smartComponentData.map((cat: any) => {
                                                return (
                                                    <>
                                                        <div className=" col-sm-12 block p-1 mt-1" ng-mouseover="HoverIn(item);"
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

                                            {/* <span ng-show="smartComponent.length!=0" className="col-sm-1">
                                                <a className="hreflink" title="Edit Component" data-toggle="modal"
                                                    onClick={(e) => EditComponent(AllItems)}>

                                                    <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/_layouts/15/images/EMMCopyTerm.png" />
                                                </a>
                                            </span> */}
                                        </div>
                                    </div>
                                </div>}
                        </div>

                    </div>
                    <div className='row mt-4'>
                        <div className='col-sm-3'>
                            <div className="input-group">
                                <label className="full-width">Item Rank</label>
                                <select
                              className="full_width searchbox_height"
                              defaultValue={AllItems.ItemRankTitle}
                              onChange={(e) =>
                                (AllItems.ItemRankTitle = e.target.value)
                              }
                            >
                              <option>
                                {AllItems.ItemRankTitle == undefined
                                  ? "select Item Rank"
                                  : AllItems.ItemRankTitle}
                              </option>
                              {TaskItemRank &&
                                TaskItemRank[0].map(function (h: any, i: any) {
                                  return (
                                    <option
                                      key={i}
                                      defaultValue={AllItems.ItemRankTitle}
                                    >
                                      {AllItems.ItemRankTitle == h.rankTitle
                                        ? AllItems.ItemRankTitle
                                        : h.rankTitle}
                                    </option>
                                  );
                                })}
                            </select>
                            </div>
                        </div>
                        <div className='col-sm-3'>
                            <fieldset>
                                <label className="full-width">Priority</label>
                                <input type="text" className="full-width" placeholder="Priority" ng-model="PriorityRank"
                                    defaultValue={selectPriority}  onChange={(e:any)=>Priority(e)} />
                                <div className="mt-2">
                                    <label>
                                        <input className="form-check-input  me-1" name="radioPriority"
                                            type="radio" value="(1) High" 
                                            defaultChecked={Priorityy} onClick={(e:any)=>SelectPriority('(1) High',e)} />High
                                    </label>
                                </div>
                                <div className="">
                                    <label>
                                        <input className="form-check-input me-1" name="radioPriority"
                                            type="radio" value="(2) Normal"
                                            defaultChecked={Priorityy} onClick={(e:any)=>SelectPriority('(2) Normal',e)} />Normal
                                    </label>
                                </div>
                                <div className="">
                                    <label>
                                        <input className="form-check-input me-1" name="radioPriority"
                                            type="radio" value="(3) Low"  defaultChecked={Priorityy} onClick={(e:any)=>SelectPriority('(3) Low',e)}  />Low
                                    </label>
                                </div>
                            </fieldset>

                        </div>
                        <div className='col-sm-3'>
                            <label className="full_width ng-binding" ng-bind-html="GetColumnDetails('dueDate') | trustedHTML">Due Date</label>
                            <DatePicker className="form-control"
                                                            selected={date}
                                                            value={AllItems.DueDate}
                                                            onChange={handleDatedue}
                                                            dateFormat="dd/MM/yyyy"
                                                           

                                                        />
                        </div>
                        <div className="col-sm-3">
                                <div className="input-group">
                                    <label className='full-width'>Categories</label>
                                    <input type="text" className="form-control" id="txtCategories" />
                                
                                    <span className="input-group-text">

                                        <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/_layouts/15/images/EMMCopyTerm.png"
                                            onClick={() => EditComponentPicker(AllItems)} />
                                    </span>
                                </div>
                                <div className="col-sm-12 mt-2">
                            {CheckCategory.map((item: any) => {
                                return (
                                    <>
                                        <div
                                            className="col-sm-12 padL-0 checkbox">
                                            <input type="checkbox"
                                                ng-click="selectRootLevelTerm(item)" />
                                            <span style={{ marginLeft: "20px" }}> {item.Title}</span>
                                        </div>
                                    </>
                                )
                            })}
                        </div>
                            {CategoriesData != undefined ?
                                <div className='col-sm-12 padL-0 PadR0'>
                                    {CategoriesData?.map((type: any, index: number) => {
                                        return (
                                            <>
                                                {(type.Title != "Phone" && type.Title != "Email Notification" && type.Title != "Approval" && type.Title != "Immediate") &&

                                                    <div className="col-sm-12 block p-1 mt-1">
                                                        <a style={{ color: "#fff !important" }} target="_blank" data-interception="off" href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?${AllItems.Id}`}>
                                                            {type.Title}
                                                        </a>
                                                        <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/_layouts/images/delete.gif" onClick={() => deleteCategories(type.Id)} />
                                                    </div>
                                                }
                                            </>
                                        )
                                    })}
                                </div> : null
                            }
                        </div>
                        
                    </div>
                    <div className='row mt-2'>
                        <TeamConfigurationCard ItemInfo={AllItems} parentCallback={DDComponentCallBack}></TeamConfigurationCard>
                    </div>
                    <div className='row'>
                        <div className='col-sm-12 mt-1'>
                            <label className='full_width'>Description</label>
                            <textarea rows={4}  className="ng-pristine ng-valid ng-empty ng-touched full_width" onChange={(e: any) => AllItems.Description = e.target.value}></textarea>
                        </div>
                    </div>
                    {/* <div className="row">
                        


                    </div> */}

                </div>


                <div className="modal-footer pt-1">
                    <button type="button" className="btn btn-primary me-1" onClick={() => createWorkStream('CreatePopup')}>
                        Create & OpenPopup
                    </button>
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