import { arraysEqual, Modal, Panel, PanelType } from 'office-ui-fabric-react';
import DatePicker from "react-datepicker";
import { Web } from "sp-pnp-js";
import * as $ from 'jquery';
import "bootstrap/dist/css/bootstrap.min.css";
import * as globalCommon from '../../../globalComponents/globalCommon';
import TeamConfigurationCard from '../../../globalComponents/TeamConfiguration/TeamConfiguration';
// import ComponentPortPolioPopup from '../../EditPopupFiles/ComponentPortfolioSelection';
// import Picker from '../../../globalComponents/EditTaskPopup/SmartMetaDataPicker';
// import EditTaskPopup from '../../../globalComponents/EditTaskPopup/EditTaskPopup';
import * as Moment from 'moment'
import Tooltip from '../../../globalComponents/Tooltip';
import { data } from 'jquery';
import moment from 'moment';
import React from 'react';
import EditTaskPopup from '../../../globalComponents/EditTaskPopup/EditTaskPopup';
let AllListId: any = {};
const itemRanks: any = [
    { rankTitle: 'Select Item Rank', rank: null },
    { rankTitle: '(8) Top Highlights', rank: 8 },
    { rankTitle: '(7) Featured Item', rank: 7 },
    { rankTitle: '(6) Key Item', rank: 6 },
    { rankTitle: '(5) Relevant Item', rank: 5 },
    { rankTitle: '(4) Background Item', rank: 4 },
    { rankTitle: '(2) to be verified', rank: 2 },
    { rankTitle: '(1) Archive', rank: 1 },
    { rankTitle: '(0) No Show', rank: 0 }
]
const CreateWS = (props: any) => {
    const [refreshData, setRefreshData]: any = React.useState(false)
    const [selectedWSTaskIndex, setSelectedWSTaskIndex]: any = React.useState(null)
    const [myDate, setMyDate] = React.useState({ editDate: null, selectDateName: '' });
    const [selectedItem, setSelectedItem]: any = React.useState({})
    const [selectedTaskType, setSelectedTaskType] = React.useState(3)
    const [ParentArray, setParentArray] = React.useState([]);
    const [SharewebTask, setSharewebTask] = React.useState<any>();
    const [IsPopupComponent, setIsPopupComponent] = React.useState(false)
    const [ClientCategoriesData, setClientCategoriesData] = React.useState<any>(
        []
    );
    const [inputFields, setInputFields]: any = React.useState([{
        Title: '',
        ItemRank: '',
        Priority: '',
        DueDate: '',
        Description: [],
        AssignedTo: props?.selectedItem?.AssignedTo?.length > 0 ? props?.selectedItem?.AssignedTo : [],
        TeamMember: props?.selectedItem?.TeamMember?.length > 0 ? props?.selectedItem?.TeamMember : props?.selectedItem?.TeamMembers?.length > 0 ? props?.selectedItem?.TeamMembers : [],
        ResponsibleTeam: props?.selectedItem?.ResponsibleTeam?.length > 0 ? props?.selectedItem?.ResponsibleTeam : props?.selectedItem?.TeamLeader?.length > 0 ? props?.selectedItem?.TeamLeader : [],
    }]);


    const AddchildItem = () => {
        setInputFields([...inputFields, {
            Title: '',
            ItemRank: '',
            Priority: '',
            DueDate: '',
            Description: [],
            AssignedTo: props?.selectedItem?.AssignedTo?.length > 0 ? props?.selectedItem?.AssignedTo : [],
            TeamMember: props?.selectedItem?.TeamMember?.length > 0 ? props?.selectedItem?.TeamMember : props?.selectedItem?.TeamMembers?.length > 0 ? props?.selectedItem?.TeamMembers : [],
            ResponsibleTeam: props?.selectedItem?.ResponsibleTeam?.length > 0 ? props?.selectedItem?.ResponsibleTeam : props?.selectedItem?.TeamLeader?.length > 0 ? props?.selectedItem?.TeamLeader : [],
        }])
        setRefreshData(!refreshData)

    }
    //----------close popup ----

    const closeTaskStatusUpdatePoup = (res: any) => {

        if (res === "item") {
            props.Call("Close");
        } else {
            props.Call(res);
        }


    }
    //---- close popup end -------
    React.useEffect(() => {
        AllListId = props?.AllListId;
        if (props?.selectedItem?.ClientCategory?.length > 0) {
            if (ClientCategoriesData?.length == 0) {
                setClientCategoriesData(props?.selectedItem?.ClientCategory)
            }
        }
        setSelectedItem(props?.selectedItem)
        GetParentHierarchy(props?.selectedItem)

    }, [])
    //************ breadcrum start */
    const GetParentHierarchy = async (Item: any) => {
        const parentdata: any = []
        // parentdata.push()
        // return new Promise((resolve, reject) => {
        if (Item.Parent != null || Item?.Portfolio != undefined) {

            var filt: any = "Id eq " + (Item.Parent != null || undefined ? Item?.Parent?.Id : Item?.Portfolio?.Id) + "";

        }
        let web = new Web(AllListId?.siteUrl);
        let compo = [];
        web.lists
            .getById(AllListId?.MasterTaskListID)
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
    // ***** bread crum end ***********
    //-------- header section of popup
    const onRenderCustomHeaderMain = () => {
        return (
            <div className={props?.props?.PortFolioType?.Id == 2 ? "d-flex full-width pb-1 serviepannelgreena" : "d-flex full-width pb-1"} >
                <div style={{ marginRight: "auto", fontSize: "20px", fontWeight: "600", marginLeft: '20px' }}>
                    <h2 className='heading'>
                        {`Create Item`}
                    </h2>
                </div>
                <Tooltip ComponentId='1710' />
            </div>
        );
    };

    // header section of popup close 





    // --------  Start Change  Function of Radio Button-----



    const handleRankChange = (value: any, index: any) => {
        let allWSTasksRank = JSON.parse(JSON.stringify(inputFields));
        allWSTasksRank[index].ItemRank = value;
        setInputFields((prev: any) => allWSTasksRank);
        setRefreshData(!refreshData)

    };
    const ChangePriorityStatusFunction = (value: any, index: any) => {

        let allWSTasksPriority = JSON.parse(JSON.stringify(inputFields));
        if (Number(value) <= 10) {

            allWSTasksPriority[index].Priority = value;
            setInputFields((prev: any) => allWSTasksPriority);
        } else {
            alert("Priority Status not should be greater than 10");
            allWSTasksPriority[index].Priority = '0';
        }
        setRefreshData(!refreshData)
    };
    const dueDateFomated = (item: any) => {
        let dates = new Date();
        let newDate = new Date();
        switch (item) {
            case 'Today':
                break;
            case 'Tomorrow':
                newDate.setDate(dates.getDate() + 1);
                break;
            case 'This Week':
                newDate.setDate(dates.getDate() - dates.getDay() + 7);
                break;
            case 'This Month':
                newDate = new Date(dates.getFullYear(), dates.getMonth() + 1, 0);
                break;

            default:
                newDate = item;
                break;

        }

        return newDate
    }

    const handleDuedateChange = (type: any, index: any) => {
        let allWSTasksDueDate = JSON.parse(JSON.stringify(inputFields));
        allWSTasksDueDate[index].DueDate = dueDateFomated(type);
        allWSTasksDueDate[index].selectDateName = type;
        setInputFields((prev: any) => allWSTasksDueDate);
        setRefreshData(!refreshData)
    }
    const changeDescription = (value: any, index: any) => {
        // let FeedBackItem: any;
        let allWSTasksDescription = JSON.parse(JSON.stringify(inputFields));
        // let param: any = Moment(new Date().toLocaleString());
        // FeedBackItem["Title"] = "FeedBackPicture" + param;
        // FeedBackItem["FeedBackDescriptions"] = [];
        // FeedBackItem.FeedBackDescriptions = [
        //     {
        //         Title: value
        //     }
        // ];
        // FeedBackItem["ImageDate"] = "" + param;
        // FeedBackItem["Completed"] = "";
        allWSTasksDescription[index].Description = value;
        setInputFields((prev: any) => allWSTasksDescription);
        setRefreshData(!refreshData)
    }
    const chanageTitle = (value: any, index: any) => {
        let allWSTasksTitle = JSON.parse(JSON.stringify(inputFields));
        allWSTasksTitle[index].Title = value;
        setInputFields((prev: any) => allWSTasksTitle);
        setRefreshData(!refreshData)
    }
    // ---------Change  Function of Radio Button  End -----


    //-------- teamMember call back---------

    function DDComponentCallBack(TeamData: any) {
        // setTeamConfig(dt)
        if (selectedWSTaskIndex != null) {
            let allWSTasks = JSON.parse(JSON.stringify(inputFields));
            setRefreshData(!refreshData)
            if (TeamData?.AssignedTo?.length > 0) {
                let AssignedUser: any = [];
                TeamData.AssignedTo?.map((arrayData: any) => {
                    if (arrayData.AssingedToUser != null) {
                        AssignedUser.push(arrayData.AssingedToUser);
                    } else {
                        AssignedUser.push(arrayData);
                    }
                });
                allWSTasks[selectedWSTaskIndex].AssignedTo = AssignedUser;
            } else {
                allWSTasks[selectedWSTaskIndex].AssignedTo = [];
            }
            if (TeamData?.TeamMemberUsers?.length > 0) {
                let teamMembers: any = [];
                TeamData.TeamMemberUsers?.map((arrayData: any) => {
                    if (arrayData.AssingedToUser != null) {
                        teamMembers.push(arrayData.AssingedToUser);
                    } else {
                        teamMembers.push(arrayData);
                    }
                });
                allWSTasks[selectedWSTaskIndex].TeamMember = teamMembers;
            } else {
                allWSTasks[selectedWSTaskIndex].TeamMember = [];
            }
            if (TeamData.ResponsibleTeam != undefined && TeamData.ResponsibleTeam?.length > 0) {
                let responsibleTeam: any = [];
                TeamData.ResponsibleTeam?.map((arrayData: any) => {
                    if (arrayData.AssingedToUser != null) {
                        responsibleTeam.push(arrayData.AssingedToUser);
                    } else {
                        responsibleTeam.push(arrayData);
                    }
                });
                allWSTasks[selectedWSTaskIndex].ResponsibleTeam = responsibleTeam;
            } else {
                allWSTasks[selectedWSTaskIndex].ResponsibleTeam = [];
            }
            setInputFields((prev: any) => allWSTasks);
        }

    }
    //-----------TEAM MEMBER  callback  End -----------------



    // -------------Save  and CREATE WORKSTREAM AND TASK  -----------

    const createWandT = async (type: any) => {
        let WorstreamLatestId: any;
        let web = new Web(AllListId?.siteUrl);
        if (selectedTaskType == 3) {

            let componentDetails: any = [];
            componentDetails = await web.lists
                .getById(selectedItem.listId)
                .items
                .select("FolderID,AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,TaskLevel,FileLeafRef,Title,Id,Priority_x0020_Rank,PercentComplete,Priority,Created,Modified,TaskType/Id,TaskType/Title,ParentTask/Id,ParentTask/Title,Author/Id,Author/Title,Editor/Id,Editor/Title")
                .expand("TaskType,ParentTask,Author,Editor,AssignedTo")
                .filter(("TaskType/Title eq 'Workstream'") && ("ParentTask/Id eq '" + selectedItem?.Id + "'"))
                .orderBy("Created", false)
                .top(499)
                .get()
            console.log(componentDetails)
            if (componentDetails?.length == 0) {
                WorstreamLatestId = 1;
            } else {
                WorstreamLatestId = componentDetails?.length + 1;
            }
        }
        inputFields?.map((inputValue: any, index: any) => {
            let taskLevel = WorstreamLatestId++;
            let priorityRank = 4;
            let priority = '';
            if (inputValue?.Priority === '' || parseInt(inputValue?.Priority) <= 0) {
                priority = '(2) Normal';
            }
            else {
                priorityRank = parseInt(inputValue?.Priority);
                if (priorityRank >= 8 && priorityRank <= 10) {
                    priority = '(1) High';
                }
                if (priorityRank >= 4 && priorityRank <= 7) {
                    priority = '(2) Normal';
                }
                if (priorityRank >= 1 && priorityRank <= 3) {
                    priority = '(3) Low';
                }
            }
            let FeedBackItem: any = {};
            let param: any = Moment(new Date().toLocaleString());
            FeedBackItem["Title"] = "FeedBackPicture" + param;
            FeedBackItem["FeedBackDescriptions"] = [];
            FeedBackItem.FeedBackDescriptions = [
                { Title: inputValue?.Description }
            ];
            FeedBackItem["ImageDate"] = "" + param;
            FeedBackItem["Completed"] = "";
            let AssignedToIds: any = [];
            let ResponsibleTeamIds: any = [];
            let TeamMemberIds: any = [];
            inputValue?.AssignedTo?.map((user: any) => {
                AssignedToIds?.push(user?.Id)
            })
            inputValue?.TeamMember?.map((user: any) => {
                TeamMemberIds?.push(user?.Id)
            })
            inputValue?.ResponsibleTeam?.map((user: any) => {
                ResponsibleTeamIds?.push(user?.Id)
            })
            let CategoryID: any = [];
            let Categories: any = '';
            selectedItem?.TaskCategories?.map((cat: any) => {
                CategoryID.push(cat?.Id)
            })
            let clientTime: any;
            if (selectedItem?.ClientTime != undefined) {
                if (typeof selectedItem?.ClientTime == "object") {

                    clientTime = JSON.stringify(selectedItem?.ClientTime);
                } else {

                    clientTime = selectedItem?.ClientTime
                }
            }

            let ClientCategory: any = []
            if (ClientCategoriesData?.length > 0) {
                ClientCategoriesData?.map((cat: any) => {
                    ClientCategory.push(cat.Id)
                })
            }

            let postdata = {
                Title: inputValue?.Title,
                Categories: selectedItem?.Categories != '' && selectedItem?.Categories != null ? selectedItem?.Categories : null,
                TaskCategoriesId: { "results": CategoryID },
                PriorityRank: priorityRank,
                Priority: priority,
                PortfolioId: selectedItem?.Portfolio?.Id,
                // PortfolioTypeId: portFolioTypeId == undefined ? null : portFolioTypeId[0]?.Id,
                TaskTypeId: selectedTaskType,
                ParentTaskId: selectedItem.Id,
                ItemRank: inputValue.ItemRank == '' ? null : inputValue.ItemRank,
                DueDate: inputValue.DueDate != null && inputValue.DueDate != '' && inputValue.DueDate != undefined ? new Date(inputValue?.DueDate)?.toISOString() : null,
                FeedBack: inputValue?.Description?.length === 0 ? null : JSON.stringify([FeedBackItem]),
                TaskID: selectedTaskType == 3 ? `${selectedItem?.TaskID}-W${taskLevel}` : null,
                TaskLevel: selectedTaskType == 3 ? taskLevel : null,
                // AssignedToId: { results: AssignedToIds?.length > 0 ? AssignedToIds : [] },
                // ResponsibleTeamId: { results : ResponsibleTeamIds ?.length > 0 ? ResponsibleTeamIds: [] },
                // TeamMembersId: { results: TeamMemberIds?.length > 0 ? TeamMemberIds : [] },
                AssignedToId: { results: AssignedToIds },
                ResponsibleTeamId: { results: ResponsibleTeamIds },
                TeamMembersId: { results: TeamMemberIds },
                SiteCompositionSettings:
                    selectedItem?.SiteCompositionSettings != undefined ? selectedItem?.SiteCompositionSettings : null,
                ClientTime: clientTime != undefined ? clientTime : null,
                ClientCategoryId: { results: ClientCategory },
            }
            if (postdata?.ClientTime == false) {
                postdata.ClientTime = null
            }
            web.lists.getById(selectedItem.listId).items.add(postdata).then((res: any) => {
                console.log(res)
                let item: any = {};
                if (res?.data) {
                    item = res?.data;
                    item = {
                        ...item, ...{
                            ClientCategory: ClientCategoriesData,
                            AssignedTo: inputValue?.AssignedTo,
                            DisplayCreateDate: moment(item.Created).format("DD/MM/YYYY"),
                            DisplayDueDate: moment(item.DueDate).format("DD/MM/YYYY"),
                            Portfolio: selectedItem?.Portfolio,
                            siteUrl: selectedItem?.siteUrl,
                            siteType: selectedItem?.siteType,
                            listId: selectedItem?.listId,
                            SiteIcon: selectedItem?.SiteIcon,
                            ResponsibleTeam: inputValue?.ResponsibleTeam,
                            TeamMembers: inputValue?.TeamMember,
                            TeamLeader: inputValue?.ResponsibleTeam,
                            FeedBack:
                                inputValue?.Description?.length > 0
                                    ? [FeedBackItem]
                                    : null,
                            Item_x0020_Type: 'Task',
                            Author: {
                                Id: props?.context?.pageContext?.legacyPageContext?.userId
                            },
                            ParentTask:selectedItem,
                            TaskType: {
                                Title: selectedTaskType == 2 ? 'Task' : 'Workstream',
                                Id: selectedTaskType
                            }
                        }
                    }
                    item.TaskID = globalCommon.GetTaskId(item);
                    if (item.DisplayDueDate == "Invalid date" || "") {
                        item.DisplayDueDate = item.DisplayDueDate.replaceAll(
                            "Invalid date",
                            ""
                        );
                    }
                    res.data = item;
                    if (type == "createopenpopup") {
                        setSharewebTask(res.data);
                        setIsPopupComponent(true)

                    } else {
                        closeTaskStatusUpdatePoup(res);
                    }

                }
                // closeTaskStatusUpdatePoup(res);
            })



        })




    }

    // --------- END save  and CREATE WORKSTREAM AND TASK -----------



    const removeInputFields = (index: any) => {
        let allData = JSON.parse(JSON.stringify(inputFields));
        allData.splice(index, 1)
        setInputFields(allData)
    }

    //**** Callbackfunction for openeditpopup */
    const Call = (items: any) => {
        setIsPopupComponent(false)
        let wsData = { data: SharewebTask }

        closeTaskStatusUpdatePoup(wsData);

    }

    //**End Callbackfunction for openeditpopup  */

    return (
        <>
            <Panel
                onRenderHeader={onRenderCustomHeaderMain}
                type={PanelType.custom}
                customWidth="900px"
                isOpen={true}
                onDismiss={() => closeTaskStatusUpdatePoup("Close")}
                isBlocking={false}
            // className={AllItems?.PortfolioType?.Color}
            >
                <div className="modal-body border p-2 active Create-Item">
                    <div className='row'>
                        {
                            <ul className='spfxbreadcrumb '>


                                {
                                    ParentArray?.map((childsitem: any, index: any) => {
                                        return (
                                            <>
                                                <li><a href='#'>{ParentArray.length - 1 == index ? `${childsitem?.Title}` : `${childsitem?.Title}`} </a> </li>
                                            </>
                                        )
                                    })
                                }
                            </ul>

                        }
                    </div>
                    <div className='row'>
                        <span className="col-sm-3 rediobutton ">
                            <span className='SpfxCheckRadio'>
                                <input type="radio"
                                    checked={selectedTaskType == 3} onClick={() => setSelectedTaskType(3)}
                                    className="radio" /> Workstream
                            </span>
                            <span className='SpfxCheckRadio'>
                                <input type="radio"
                                    checked={selectedTaskType == 2} onClick={() => setSelectedTaskType(2)}
                                    className="radio" />Task
                            </span>
                        </span>
                    </div>
                    <div className={refreshData ? "oiujhgj0gu" : "gugggug"}>
                        {inputFields?.map((multipleWSTask: any, WTindex: any) => {
                            return (
                                <div className="">
                                    {WTindex != 0 && <div className="border-bottom mb-3 mt-1 clearfix">
                                        {(inputFields.length > 1) ? <a className="d-flex justify-content-end"
                                            onClick={() => removeInputFields(WTindex)}
                                        ><span className='hreflink'>Clear section</span> </a> : ''}
                                    </div>}
                                    <div className='row'>
                                        <div className="col-md-8">
                                            <input className="full-width searchbox_height" type="text"
                                                placeholder="Enter Child Item Title"
                                                onChange={(e) => chanageTitle(e.target.value, WTindex)}
                                            />
                                        </div>

                                    </div>

                                    <div className='row mt-2'>
                                        <div className='col-sm-4'>
                                            <div className="input-group">
                                                <label className='form-label full-width ps-0'>Item Rank</label>
                                                <select value={multipleWSTask?.itemRank} onChange={(e: any) => { handleRankChange(e.target.value, WTindex) }} className='form-select'>
                                                    {itemRanks?.map((rank: any) => (
                                                        <option key={rank?.rank} value={rank?.rank}>{rank?.rankTitle}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className='col-sm-4'>
                                            <div>
                                                <fieldset>
                                                    <label className="full-width">
                                                        Priority
                                                        <span>
                                                            <div
                                                                className="popover__wrapper ms-1"
                                                                data-bs-toggle="tooltip"
                                                                data-bs-placement="auto"
                                                            >
                                                                <span
                                                                    title="Edit"
                                                                    className="alignIcon svg__icon--info svg__iconbox"
                                                                ></span>

                                                                <div className="popover__content">
                                                                    <span>
                                                                        8-10 = High Priority,
                                                                        <br />
                                                                        4-7 = Normal Priority,
                                                                        <br />
                                                                        1-3 = Low Priority
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </span>
                                                    </label>

                                                    <div className="input-group">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Enter Priority"
                                                            value={multipleWSTask?.Priority}
                                                            onChange={(e) => ChangePriorityStatusFunction(e.target.value, WTindex)}
                                                        />
                                                    </div>

                                                    <ul className={refreshData ? "p-0 mt-1" : "p-0 mt-1"}>
                                                        <li className="form-check l-radio">
                                                            <input
                                                                className="form-check-input"
                                                                name="radioPriority"
                                                                type="radio"
                                                                checked={
                                                                    Number(multipleWSTask?.Priority) <= 10 &&
                                                                    Number(multipleWSTask?.Priority) >= 8
                                                                }
                                                                onChange={() => ChangePriorityStatusFunction("8", WTindex)}
                                                            />
                                                            <label className="form-check-label">High</label>
                                                        </li>
                                                        <li className="form-check l-radio">
                                                            <input
                                                                className="form-check-input"
                                                                name="radioPriority"
                                                                type="radio"
                                                                checked={
                                                                    Number(multipleWSTask?.Priority) <= 7 &&
                                                                    Number(multipleWSTask?.Priority) >= 4
                                                                }
                                                                onChange={() => ChangePriorityStatusFunction("4", WTindex)}
                                                            />
                                                            <label className="form-check-label">Normal</label>
                                                        </li>
                                                        <li className="form-check l-radio">
                                                            <input
                                                                className="form-check-input"
                                                                name="radioPriority"
                                                                type="radio"
                                                                checked={
                                                                    Number(multipleWSTask?.Priority) <= 3 &&
                                                                    Number(multipleWSTask?.Priority) > 0
                                                                }
                                                                onChange={() => ChangePriorityStatusFunction("1", WTindex)}
                                                            />
                                                            <label className="form-check-label">Low</label>
                                                        </li>
                                                    </ul>
                                                </fieldset>
                                            </div>

                                        </div>
                                        <div className='col-sm-4 position-relative'>
                                            <label className="full_width" ng-bind-html="GetColumnDetails('dueDate') | trustedHTML">Due Date</label>
                                            <input className="full-width searchbox_height"
                                                type="date"

                                                value={multipleWSTask.DueDate != null ? Moment(new Date(multipleWSTask.DueDate)).format('YYYY-MM-DD') : ""}
                                                onChange={(e: any) => handleDuedateChange(e.target.value, WTindex)} />
                                            {myDate.editDate != null && <div className="input-close"><span className="svg__iconbox svg__icon--cross" onClick={() => setMyDate({ ...myDate, editDate: null, selectDateName: "" })}></span></div>}
                                            <dl className={refreshData ? 'mt-1' : "mt-1"}>
                                                <dt className="">
                                                    <label className='SpfxCheckRadio'>
                                                        <input className="radio" name="radioPriority2"
                                                            type="radio" value="(3) Low" checked={multipleWSTask.selectDateName == 'Today'} onClick={(e: any) => handleDuedateChange('Today', WTindex)} />Today
                                                    </label>
                                                </dt>
                                                <dt>
                                                    <label className='SpfxCheckRadio'>
                                                        <input className="radio" name="radioPriority2"
                                                            type="radio" value="(3) Low" checked={multipleWSTask.selectDateName == 'Tomorrow'} onClick={(e: any) => handleDuedateChange('Tomorrow', WTindex)} />Tomorrow
                                                    </label>
                                                </dt>
                                                <dt>
                                                    <label className='SpfxCheckRadio'>
                                                        <input className="radio" name="radioPriority2"
                                                            type="radio" value="(3) Low" checked={multipleWSTask.selectDateName == 'This Week'} onClick={(e: any) => handleDuedateChange('This Week', WTindex)} />This Week
                                                    </label>
                                                </dt>
                                                <dt>
                                                    <label className='SpfxCheckRadio'>
                                                        <input className="radio" name="radioPriority2"
                                                            type="radio" value="(3) Low" checked={multipleWSTask.selectDateName == 'This Month'} onClick={(e: any) => handleDuedateChange('This Month', WTindex)} />This Month
                                                    </label>
                                                </dt>
                                            </dl>
                                        </div>



                                    </div>
                                    <div className='row mt-2' onMouseEnter={() => { setSelectedWSTaskIndex(WTindex) }} onMouseLeave={() => { setSelectedWSTaskIndex(null) }}>
                                        {selectedItem != undefined && AllListId != undefined &&
                                            <TeamConfigurationCard
                                                ItemInfo={selectedItem}
                                                AllListId={AllListId}
                                                parentCallback={DDComponentCallBack}
                                            ></TeamConfigurationCard>}
                                    </div>
                                    <div className='row'>
                                        <div className='col-sm-12 mt-1'>
                                            <label className='full_width'>Description</label>
                                            <textarea rows={4} className="ng-pristine ng-valid ng-empty ng-touched full_width"
                                                onChange={(e: any) => changeDescription(e.target.value, WTindex)}
                                            ></textarea>
                                        </div>
                                    </div>

                                </div>
                            )
                        })}
                    </div>
                </div>

                <a className='hyperlink' type="button" onClick={() => AddchildItem()}>
                    <span title="Edit" className="alignIcon svg__icon--Plus svg__iconbox"></span> Add More Child Items
                </a>
                <div className="modal-footer pt-1">
                    <button type="button" className="btn btn-primary me-1"
                        disabled={inputFields?.length > 1 ? true : false} onClick={() => createWandT("createopenpopup")}
                    >
                        Create & OpenPopup
                    </button>
                    <button type="button" className="btn btn-primary"
                        onClick={() => createWandT("create")}
                    >
                        Create
                    </button>
                </div>

            </Panel>
            {/* {IsComponent && <ComponentPortPolioPopup 
            props={SharewebComponent} 
            AllListId={dynamicList}
            context={props.context} 
            Call={Call}>
                </ComponentPortPolioPopup>}
            {IsComponentPicker && <Picker
             props={SharewebCategory} 
             AllListId={dynamicList} 
             Call={Call}
             >
             </Picker>} */}
            {
                IsPopupComponent
                && <EditTaskPopup
                    Items={SharewebTask}
                    AllListId={AllListId}
                    pageName={"TaskFooterTable"}
                    context={props?.context}
                    Call={Call}
                >
                </EditTaskPopup>}
        </>
    )

}
export default CreateWS;