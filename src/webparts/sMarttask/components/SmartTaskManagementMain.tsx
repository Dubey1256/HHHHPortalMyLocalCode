import * as React from 'react'
import { Web } from "sp-pnp-js";
import * as globalCommon from "../../../globalComponents/globalCommon";
import ReactPopperTooltipSingleLevel from "../../../globalComponents/Hierarchy-Popper-tooltipSilgleLevel/Hierarchy-Popper-tooltipSingleLevel"
import PageLoader from '../../../globalComponents/pageLoader';
let designationArray: any = [];
export const SmartTaskManagementMain = (props: any) => {
    let baseUrl: any = props?.props.context?._pageContext?.web?.absoluteUrl;
    let Users: any;
    let allTasks: any = [];
    let loadedAllTasks: any
    let web = new Web(baseUrl)
    const [taskUsers, setTaskUsers] = React.useState([]);
    const [allSitesTasks, setAllSitesTasks] = React.useState([])
    const [allTaskData, setAllTaskData] = React.useState([]);
    const [masterData, setMasterData] = React.useState([])
    const [designationNames, setDesignationNames] = React.useState([]);
    const [dataAsDesignation, setdataAsDesignation] = React.useState([]);
    const [uniqueDesignation, setuniqueDesignation] = React.useState("")
    const [loader, SetLoader] = React.useState(false);
    const AllListId = {
        SmartMetadataListID: props?.props?.SmartMetadataListID,
        MasterTaskListID: props?.props?.MasterTaskListID,
        TaskUsertListID: props?.props?.TaskUsertListID,
        siteUrl: baseUrl
    }
    React.useEffect(() => {
        SetLoader(true)
        getUsers();
        getMasterFunction()
        loadSmartListData();
    }, []
    )

    const getUsers = async () => {
        try {
            let desgination: any = []
            let web = new Web(baseUrl);
            Users = await web.lists
                .getById(props?.props?.TaskUsertListID)
                .items
                .select("Id,UserGroupId,Suffix,Title,Email,SortOrder,Role,Company,ParentID1,Status,Item_x0020_Cover,AssingedToUserId,isDeleted,AssingedToUser/Title,AssingedToUser/Id,AssingedToUser/EMail,ItemType,Approver/Id,Approver/Title,Approver/Name,UserGroup/Id,UserGroup/Title&$expand=AssingedToUser,Approver,UserGroup")
                .get();



            const forbiddenUserIds = new Set(["290", "36", "278", "242", "156", "44"]);
            Users = Users.filter((user: any) => {
                const userId = user?.AssingedToUserId?.toString();
                return (
                    user.Company === "Smalsus" &&
                    userId != null &&
                    !forbiddenUserIds.has(userId) &&
                    user?.UserGroup?.Title !== "Ex Staff"
                );
            });
            setTaskUsers(Users);

            const designations: Set<string> = new Set<string>();
            Users.forEach((user: any) => {
                if (user?.UserGroup?.Title != null && user?.UserGroup?.Title != "External Staff") {
                    designations.add(user?.UserGroup?.Title);
                }
            });

            designations.forEach((value) => {

                var objectDesignation: any = { Title: value, classUsed: "nav-link" }
                designationArray.push(objectDesignation)
            });
            designationArray = designationArray.filter((desg: any) => { return (desg?.Title != "Junior Task Management" && desg?.Title != "QA Team") })

            setDesignationNames(designationArray);
        } catch (error) {
            console.error("Error  user data:", error);
        }
    };

    const getMasterFunction = () => {
        try {
            web.lists.getById(props?.props?.MasterTaskListID).items.select("Id,Title,PercentComplete,PortfolioStructureID,Item_x0020_Type,ComponentCategory/Id,ComponentCategory/Title,PortfolioType/Id,PortfolioType/Title,Parent/Id, Parent/Title").expand('PortfolioType,ComponentCategory,Parent').getAll().then((masterValue: any) => {
                setMasterData(masterValue)
            });
        } catch (error) {
            console.error(error)
        }
    }
    const loadSmartListData = () => {

        let count: number = 0;
        let sitesCount: number = 0;
        // let checkStatus:any=[]
        web.lists.getById(props.props.SmartMetadataListID).items.select("Configurations,TaxType").getAll().then((response: any) => {
            response = response.filter((taxtypeValue: any) => { return (taxtypeValue.TaxType == "Sites") })
            response.map((ConfigrationData: any) => {
                var sites = JSON.parse(ConfigrationData?.Configurations)
                if (sites != undefined && sites != null) {
                    sites.map((sitesData: any) => {

                        sitesCount++
                        web.lists.getById(sitesData.listId).items.select("Id,Title,IsTodaysTask,PriorityRank,PercentComplete,TaskID,TaskType/Id,TaskType/Title, AssignedTo/Id,AssignedTo/Title,TeamMembers/Id,ResponsibleTeam/Id,ResponsibleTeam/Title,TaskCategories/Id,TaskCategories/Title,Project/Id,Project/Title,Project/PriorityRank,ParentTask/Id,ParentTask/Title,Portfolio/Id, Portfolio/Title, Portfolio/PortfolioStructureID").expand("AssignedTo,TeamMembers,ResponsibleTeam,TaskCategories,Project,ParentTask,Portfolio,TaskType").getAll().then((tasks: any) => {
                            tasks.map((tasksSiteNameFor: any) => {
                                tasksSiteNameFor.siteType = sitesData.Title;
                                tasksSiteNameFor.listId = sitesData.listId
                                tasksSiteNameFor.SiteIcon = sitesData.ImageUrl

                            })

                            allTasks.push(...tasks);
                            count++;
                            if (sitesCount == count) {
                                let checkActvity = [];
                                let checkWorkstream = [];
                                let CheckTasks = [];
                                let SomeElse = []
                                allTasks.map((tasks7: any) => {
                                    let checkDraft = false
                                    if (tasks7?.TaskCategories?.some((category: any) => category.Title.toLowerCase() === "draft")) { checkDraft = true; }
                                    if (tasks7?.TaskType?.Title == 'Activities' && checkDraft != true) {
                                        checkActvity.push(tasks7)
                                    }
                                    else if (tasks7?.TaskType?.Title == 'Workstream' && checkDraft != true) {
                                        checkWorkstream.push(tasks7)
                                    }
                                    else if (tasks7?.TaskType?.Title == 'Task' && checkDraft != true) {
                                        CheckTasks.push(tasks7)
                                    }
                                    else {
                                        SomeElse.push(tasks7)
                                    }

                                })
                                getTasks(allTasks)
                                setAllSitesTasks(allTasks)
                            }

                        }).catch((error: any) => {
                            count++;
                            if (sitesCount == count) {

                                getTasks(allTasks)

                                setAllSitesTasks(allTasks)
                            }
                            console.log(error)
                        });
                    })
                }
            })
        });

    }

    const getTasks = (tasks: any) => {
        let userHaveTask: any = [];
        let notWokingSmartpriority: any = [];
        let WorkingProperly: any = [];
        (Users != undefined ? Users : taskUsers).map((users: any) => {
            users.workingToday = [];
            users.numberOfTasks = [];
            users.IshigherSmartPriority = false;
            users.WorkingTasksCount = '0'
            users.designation = users?.UserGroup?.Title;
            if (users?.AssingedToUser != undefined) {
                tasks.map((taskData: any) => {
                    if (taskData?.AssignedTo?.length > 0) {
                        taskData?.AssignedTo?.map((checkAssignedId: any) => {
                            if (checkAssignedId?.Id == users?.AssingedToUser?.Id) {

                                taskData.userUniqueId = users.Id
                                taskData.TaskID = globalCommon.GetTaskId(taskData);
                                taskData.SmartPriority = globalCommon.calculateSmartPriority(taskData);
                                taskData.TaskIdSmartPriority = taskData.TaskID + "/" + taskData.SmartPriority;
                                taskData.flag = false;
                                taskData.baseUrl = baseUrl
                                if (taskData.SmartPriority == undefined) {
                                    taskData.SmartPriority = "0"
                                }
                                if (taskData?.IsTodaysTask == true) {
                                    taskData.NameTypeTask = "WorkingTask"
                                    users.workingToday.push(taskData)
                                    users.WorkingTasksCount++;
                                } else {
                                    taskData.NameTypeTask = "BucketTask"
                                    taskData.higherPriority = false;
                                    users.numberOfTasks.push({ ...taskData })
                                }

                            }
                        })
                    }
                })

                // For blink 
                users.numberOfTasks.map((allTaskpriorty: any) => {
                    users.workingToday.map((checkpriortytodayWork: any, index: any) => {
                        if (allTaskpriorty.SmartPriority != checkpriortytodayWork.SmartPriority && allTaskpriorty.SmartPriority > checkpriortytodayWork.SmartPriority) {
                            allTaskpriorty.higherPriority = true
                            users.IshigherSmartPriority = true;

                        }
                    })
                })
                //For sorting
                if (users.workingToday != undefined) {
                    users.workingToday.sort(function (a: any, b: any) { return b.SmartPriority - a.SmartPriority })
                }
                users?.numberOfTasks?.sort(function (a: any, b: any) { return b.SmartPriority - a.SmartPriority });
                userHaveTask.push(users)
            }
        })
        //To show the data which are not picking smarthigher priority task
        userHaveTask.map((userWorkPriority: any, index: any) => {
            var checkhigherPriority: boolean = false;
            for (var i = 0; i < userWorkPriority?.numberOfTasks.length; i++) {
                if (userWorkPriority?.numberOfTasks[i]?.higherPriority == true) {
                    checkhigherPriority = true;
                    break;
                }
            }
            if (checkhigherPriority == true) {
                notWokingSmartpriority.push(userWorkPriority)

            } else {
                WorkingProperly.push(userWorkPriority)
            }
        })

        notWokingSmartpriority.map((notWorkPriority: any) => {
            WorkingProperly.unshift(notWorkPriority)
        })

        loadedAllTasks = WorkingProperly;
        getDataAccordingDesignation(designationArray[0].Title)
        setAllTaskData(WorkingProperly)
    }

    const getDataAccordingDesignation = (DesignationName: any) => {
        let userInformation: any = [];
        let desgnationBlink: any = [];
        let countForClass: number = 1;
        (loadedAllTasks != undefined ? loadedAllTasks : allTaskData).map((Tasks: any) => {
            if (Tasks?.UserGroup?.Title == DesignationName) {
                userInformation.push(Tasks);
            }
            if (Tasks.IshigherSmartPriority == true) {
                desgnationBlink.push(Tasks?.UserGroup?.Title)
            }

        })


        let designationNamesUsed = designationArray.length > 0 ? designationArray : designationNames;

        designationNamesUsed.map((desgValue: any) => {
            if (desgValue?.Title == DesignationName) {
                desgValue.classUsed = "nav-link active "
            }
            else {

                let checkblink: any = desgnationBlink?.includes(desgValue?.Title)
                if (checkblink == true) {
                    desgValue.classUsed = `nav-link tab${countForClass}BlinkBg`;
                    countForClass++;
                } else {
                    desgValue.classUsed = "nav-link"
                }


            }
        })

        setdataAsDesignation(userInformation)
        setuniqueDesignation(DesignationName)
        SetLoader(false)

    }


    const flagFunction = (item: any) => {
        item.flag = !item.flag;
        var duplicateValue: any = [];
        allTaskData.map((tasks) => {
            duplicateValue.push(tasks)
        })
        setAllTaskData(duplicateValue)

    }

    const dragstart = (e: any, bucketTask: any, uniqueId: any) => {
        bucketTask.userUniqueId = uniqueId;
        e.dataTransfer.setData("DataId", JSON.stringify(bucketTask))
    }
    const dragOver = (e: any) => {
        e.preventDefault()

    }
    const dragDrop = (e: any, dropArea: any, dropCondition: any, UserUnqiueId: any) => {
        let tempStoreUser: any;
        let tempDrop: any;
        let pickUpdropDataJson = e.dataTransfer.getData("DataId")
        let pickUpdropData = JSON.parse(pickUpdropDataJson);
        let tempUser: any;
        let userShift: boolean = false;
        let callDesignationFunction: string; 
        let userInfoDropArea: any=allTaskData.filter((UserInfo: any) => { return (UserInfo.Id == UserUnqiueId) })
        let userInfoPickUp: any = allTaskData.filter((UserInfo: any) => { return (UserInfo.Id == pickUpdropData.userUniqueId) });
        if (dropArea != ""){
        dropArea.userUniqueId=UserUnqiueId
    }
        // The task drop in a  working tasks bucket ,do not exchage with other task
        if (dropArea == "" && pickUpdropData?.NameTypeTask == "BucketTask") {
            if (userInfoPickUp[0]?.Id == userInfoDropArea[0]?.Id) {
                let updateDataPickup = { IsTodaysTask: true }
                pickUpdropData.NameTypeTask = "WorkingTask"
                userInfoDropArea[0]?.workingToday?.push(pickUpdropData);
                globalCommon.updateItemById(baseUrl, pickUpdropData.listId, updateDataPickup, pickUpdropData.Id)
                userInfoDropArea[0]?.numberOfTasks?.map((pickUpItem: any, index: any) => {
                    if (pickUpItem.Id == pickUpdropData.Id) {
                        userInfoDropArea[0]?.numberOfTasks.splice(index, 1)
                    }
                })
                userInfoPickUp[0] = userInfoDropArea[0]
            } else if (userInfoPickUp[0]?.Id != userInfoDropArea[0]?.Id) {

                pickUpdropData.AssignedTo = pickUpdropData?.AssignedTo?.filter((Assigneduser: any) => { return Assigneduser?.Id != userInfoPickUp[0]?.AssingedToUser?.Id })
                pickUpdropData?.AssignedTo?.push({ Id: userInfoDropArea[0].AssingedToUser?.Id, Title: userInfoDropArea[0].AssingedToUser?.Title })
                pickUpdropData.assignedIdS = [];
                pickUpdropData?.AssignedTo?.map((assindIds: any) => {
                    pickUpdropData?.assignedIdS?.push(assindIds.Id)
                })
                pickUpdropData.NameTypeTask = "WorkingTask"
                let updateDataPickup = { IsTodaysTask: true, AssignedToId: { results: pickUpdropData?.assignedIdS } }
                globalCommon.updateItemById(baseUrl, pickUpdropData.listId, updateDataPickup, pickUpdropData.Id)
                userInfoDropArea[0]?.workingToday?.push(pickUpdropData);
                userInfoPickUp[0]?.numberOfTasks?.map((pickUpItem: any, index: any) => {
                    if (pickUpItem?.Id == pickUpdropData?.Id) {
                        userInfoPickUp[0]?.numberOfTasks.splice(index, 1)
                    }
                })
            }
            allTaskData.map((AllUserData: any, index: any) => {

                if (AllUserData?.Id == userInfoPickUp[0].Id || AllUserData?.Id == userInfoDropArea[0].Id) {
                    AllUserData.IshigherSmartPriority = false;
                    AllUserData = checkHigherPriorityFunction(AllUserData)
                    callDesignationFunction = AllUserData?.UserGroup?.Title
                    userShift = AllUserData?.IshigherSmartPriority
                    tempUser = AllUserData
                    if (userShift == true) {
                        allTaskData.splice(index, 1)
                        allTaskData.unshift(tempUser)
                    }

                }
            })
            getDataAccordingDesignation(callDesignationFunction)
            setAllTaskData([...allTaskData])

        }
        else if (pickUpdropData?.userUniqueId != dropArea?.userUniqueId && dropCondition != "WorkingDropParent") {
            if (dropCondition == "WorkingDrop") {
                userInfoDropArea[0]?.workingToday.map((dropAreaTask: any, index: any) => {
                    if (dropAreaTask?.Id == dropArea?.Id) {
                        userInfoDropArea[0]?.workingToday.splice(index, 1)
                        if (dropArea?.NameTypeTask != pickUpdropData?.NameTypeTask) {
                            userInfoPickUp[0]?.numberOfTasks.map((pickupTask: any, index: any) => {
                                if (pickupTask?.Id == pickUpdropData?.Id) {
                                    let updateDrop: any = {}
                                    let updateDataPickup: any = {}
                                    tempDrop = { ...dropAreaTask };
                                    tempDrop.AssignedTo = tempDrop?.AssignedTo?.filter((Assigneduser: any) => { return Assigneduser?.Id != userInfoDropArea[0]?.AssingedToUser?.Id })
                                    tempDrop?.AssignedTo?.push({ Id: userInfoPickUp[0].AssingedToUser?.Id, Title: userInfoPickUp[0].AssingedToUser?.Title })
                                    tempDrop.assignedIdS = [];
                                    tempDrop?.AssignedTo?.map((assindIds: any) => {
                                        tempDrop?.assignedIdS?.push(assindIds.Id)
                                    })
                                    updateDrop = {
                                        IsTodaysTask: false,
                                        AssignedToId: { results: tempDrop?.assignedIdS }
                                    }
                                    tempDrop.userUniqueId = pickupTask?.userUniqueId;
                                    tempDrop.NameTypeTask = pickupTask?.NameTypeTask;
                                    globalCommon.updateItemById(baseUrl, tempDrop.listId, updateDrop, tempDrop.Id)
                                    userInfoPickUp[0]?.numberOfTasks.push(tempDrop)
                                    // *****************
                                    tempStoreUser = { ...pickupTask };
                                    tempStoreUser.AssignedTo = tempStoreUser?.AssignedTo?.filter((Assigneduser: any) => { return Assigneduser?.Id != userInfoPickUp[0]?.AssingedToUser?.Id })
                                    tempStoreUser?.AssignedTo?.push({ Id: userInfoDropArea[0].AssingedToUser?.Id, Title: userInfoDropArea[0].AssingedToUser?.Title })
                                    tempStoreUser.assignedIdS = [];
                                    tempStoreUser?.AssignedTo?.map((assindIds: any) => {
                                        tempStoreUser?.assignedIdS?.push(assindIds.Id)
                                    })
                                    updateDataPickup = {
                                        IsTodaysTask: true,
                                        AssignedToId: { results: tempStoreUser?.assignedIdS }
                                    }
                                    tempStoreUser.userUniqueId = dropAreaTask?.userUniqueId;
                                    tempStoreUser.NameTypeTask = dropAreaTask?.NameTypeTask;
                                    globalCommon.updateItemById(baseUrl, tempStoreUser.listId, updateDataPickup, tempStoreUser.Id)
                                    userInfoPickUp[0]?.numberOfTasks.splice(index, 1)
                                    userInfoDropArea[0]?.workingToday.push(tempStoreUser);
                                }
                            })
                        }
                        else {
                            userInfoPickUp[0]?.workingToday.map((pickupTask: any, index: any) => {
                                if (pickupTask?.Id == pickUpdropData?.Id) {
                                    let updateDrop: any = {}
                                    let updateDataPickup: any = {}
                                    tempDrop = ({ ...dropAreaTask });
                                    tempDrop.AssignedTo = tempDrop?.AssignedTo?.filter((Assigneduser: any) => { return Assigneduser?.Id != userInfoDropArea[0]?.AssingedToUser?.Id })
                                    tempDrop?.AssignedTo?.push({ Id: userInfoPickUp[0].AssingedToUser?.Id, Title: userInfoPickUp[0].AssingedToUser?.Title })
                                    tempDrop.assignedIdS = [];
                                    tempDrop?.AssignedTo?.map((assindIds: any) => {
                                        tempDrop?.assignedIdS?.push(assindIds.Id)
                                    })
                                    updateDrop = {
                                        IsTodaysTask: true,
                                        AssignedToId: { results: tempDrop?.assignedIdS }
                                    }
                                    tempDrop.userUniqueId = pickupTask?.userUniqueId;
                                    tempDrop.NameTypeTask = pickupTask?.NameTypeTask;
                                    globalCommon.updateItemById(baseUrl, tempDrop.listId, updateDrop, tempDrop.Id)
                                    userInfoPickUp[0]?.workingToday?.push(tempDrop)
                                    // ++++++++++
                                    tempStoreUser = ({ ...pickupTask });
                                    tempStoreUser.AssignedTo = tempStoreUser?.AssignedTo?.filter((Assigneduser: any) => { return Assigneduser?.Id != userInfoPickUp[0]?.AssingedToUser?.Id })
                                    tempStoreUser?.AssignedTo?.push({ Id: userInfoDropArea[0].AssingedToUser?.Id, Title: userInfoDropArea[0].AssingedToUser?.Title })
                                    tempStoreUser.assignedIdS = [];
                                    tempStoreUser?.AssignedTo?.map((assindIds: any) => {
                                        tempStoreUser?.assignedIdS?.push(assindIds.Id)
                                    })
                                    updateDataPickup = { IsTodaysTask: true, AssignedToId: { results: tempStoreUser.assignedIdS } }
                                    tempStoreUser.userUniqueId = dropAreaTask?.userUniqueId;
                                    globalCommon.updateItemById(baseUrl, tempStoreUser.listId, updateDataPickup, tempStoreUser.Id)
                                    userInfoDropArea[0]?.workingToday?.push(tempStoreUser);
                                    userInfoPickUp[0]?.workingToday?.splice(index, 1);

                                }

                            })

                        }
                    }
                })
            }
            else if ((dropCondition == "BucketDrop")) {
                userInfoDropArea[0]?.numberOfTasks.map((dropAreaTask: any) => {
                    if (dropAreaTask?.Id == dropArea?.Id) {
                        if (dropArea?.NameTypeTask != pickUpdropData?.NameTypeTask) {
                            userInfoPickUp[0]?.workingToday.map((pickupTask: any, index: any) => {
                                if (pickupTask?.Id == pickUpdropData?.Id) {
                                    let updateDrop: any = {}
                                    let updateDataPickup: any = {}
                                    tempDrop = ({ ...dropAreaTask });
                                    tempDrop.AssignedTo = tempDrop?.AssignedTo?.filter((Assigneduser: any) => { return Assigneduser?.Id != userInfoDropArea[0]?.AssingedToUser?.Id })
                                    tempDrop?.AssignedTo?.push({ Id: userInfoPickUp[0].AssingedToUser?.Id, Title: userInfoPickUp[0].AssingedToUser?.Title })
                                    tempDrop.assignedIdS = [];
                                    tempDrop?.AssignedTo?.map((assindIds: any) => {
                                        tempDrop?.assignedIdS?.push(assindIds.Id)
                                    })
                                    tempDrop.userUniqueId = dropAreaTask?.userUniqueId;
                                    tempDrop.NameTypeTask = dropAreaTask?.NameTypeTask;
                                    updateDrop = {
                                        IsTodaysTask: true,
                                        AssignedToId: { results: tempDrop?.assignedIdS }
                                    }
                                    globalCommon.updateItemById(baseUrl, tempDrop.listId, updateDrop, tempDrop.Id)
                                    userInfoPickUp[0]?.workingToday?.push(tempDrop)
                                    userInfoPickUp[0]?.workingToday?.splice(index, 1)
                                    // userInfoDropArea[0].numberOfTasks.push(tempStoreUser);
                                    tempStoreUser = { ...pickupTask };
                                    tempStoreUser.AssignedTo = tempStoreUser?.AssignedTo?.filter((Assigneduser: any) => { return Assigneduser?.Id != userInfoPickUp[0]?.AssingedToUser?.Id })
                                    tempStoreUser?.AssignedTo?.push({ Id: userInfoDropArea[0].AssingedToUser?.Id, Title: userInfoDropArea[0].AssingedToUser?.Title })
                                    tempStoreUser.assignedIdS = [];
                                    tempStoreUser?.AssignedTo?.map((assindIds: any) => {
                                        tempStoreUser?.assignedIdS?.push(assindIds.Id)
                                    })
                                    updateDataPickup = {
                                        IsTodaysTask: false,
                                        AssignedToId: { results: tempStoreUser?.assignedIdS }
                                    }
                                    tempStoreUser.userUniqueId = dropAreaTask?.userUniqueId;
                                    tempStoreUser.NameTypeTask = dropAreaTask?.NameTypeTask;
                                    globalCommon.updateItemById(baseUrl, tempStoreUser.listId, updateDataPickup, tempStoreUser.Id)
                                    // userInfoPickUp[0]?.numberOfTasks.splice(index, 1)
                                    userInfoDropArea[0]?.numberOfTasks.splice(index, 1)
                                    userInfoDropArea[0]?.numberOfTasks.push(tempStoreUser);



                                    // if (dropArea?.NameTypeTask == "BucketTask") {
                                    //     userInfoDropArea[0]?.numberOfTasks?.push(tempStoreUser);
                                    //     userInfoPickUp[0]?.workingToday?.splice(index, 1);
                                    //     userInfoPickUp[0]?.numberOfTasks.push(pickupTask)
                                    // }
                                    // else if (dropArea?.NameTypeTask == "WorkingTask") {
                                    //     userInfoPickUp[0]?.numberOfTasks?.splice(index, 1);
                                    //     userInfoDropArea[0]?.workingToday?.push(tempStoreUser);
                                    // }
                                }
                            })
                        } else {
                            userInfoPickUp[0].numberOfTasks.map((pickupTask: any, index: any) => {
                                if (pickupTask.Id == pickUpdropData.Id) {
                                    tempStoreUser = pickupTask;
                                    tempStoreUser.userUniqueId = dropAreaTask?.userUniqueId;
                                    userInfoDropArea[0]?.numberOfTasks.push(tempStoreUser);

                                }
                            })
                        }

                    }
                })

            }

            allTaskData.map((AllUserData: any, index: any) => {
                if (AllUserData?.Id == userInfoPickUp[0]?.Id) {
                    AllUserData.IshigherSmartPriority = false;
                    AllUserData = userInfoPickUp[0]
                    AllUserData = checkHigherPriorityFunction(AllUserData)
                    callDesignationFunction = AllUserData?.UserGroup?.Title
                    userShift = AllUserData?.IshigherSmartPriority
                    tempUser = AllUserData
                    if (userShift == true) {
                        allTaskData.splice(index, 1)
                        allTaskData.unshift(tempUser)
                    }
                }
                else if (AllUserData?.Id == userInfoDropArea[0]?.Id) {
                    AllUserData = userInfoDropArea[0]
                    AllUserData = checkHigherPriorityFunction(AllUserData)
                    callDesignationFunction = AllUserData?.UserGroup?.Title
                    userShift = AllUserData?.IshigherSmartPriority
                    tempUser = AllUserData
                    if (userShift == true) {
                        allTaskData.splice(index, 1)
                        allTaskData.unshift(tempUser)
                    }
                }

            })
            getDataAccordingDesignation(callDesignationFunction)
            setAllTaskData([...allTaskData])

        }
        else if (pickUpdropData?.userUniqueId == dropArea?.userUniqueId && pickUpdropData?.NameTypeTask != dropArea?.NameTypeTask) {
            allTaskData.map((AllUserData: any, index: any) => {
                if (AllUserData?.Id == UserUnqiueId) {
                    AllUserData.IshigherSmartPriority = false;
                    if (dropCondition == "WorkingDrop") {
                        AllUserData?.workingToday?.map((workItem: any, index: any) => {
                            if (workItem?.Id == dropArea?.Id) {
                                var dropUpdate = {
                                    IsTodaysTask: true
                                };
                                var workingDropUpdate = {
                                    IsTodaysTask: false
                                }
                                AllUserData?.workingToday?.splice(index, 1);
                                pickUpdropData.NameTypeTask = "WorkingTask"
                                workItem.NameTypeTask = "BucketTask"
                                AllUserData?.workingToday?.push(pickUpdropData)
                                AllUserData?.numberOfTasks?.push(workItem)
                                //   globalCommon.updateItemById(baseUrl, pickUpdropData.listId, dropUpdate, pickUpdropData.Id)
                                //   globalCommon.updateItemById(baseUrl, workItem.listId, workingDropUpdate, workItem.Id)
                            }
                        })
                        AllUserData?.numberOfTasks?.map((totalTasks: any, index: any) => {
                            if (totalTasks?.Id == pickUpdropData?.Id) {
                                AllUserData?.numberOfTasks?.splice(index, 1);
                            }

                        })
                    }
                    else if (dropCondition == "BucketDrop") {
                        AllUserData?.numberOfTasks.map((totalTasks: any, index: any) => {
                            if (totalTasks.Id == dropArea.Id) {
                                var dropUpdate = {
                                    IsTodaysTask: false
                                };
                                var workingDropUpdate = {
                                    IsTodaysTask: true
                                }
                                AllUserData?.numberOfTasks?.splice(index, 1);
                                pickUpdropData.NameTypeTask = "BucketTask"
                                totalTasks.NameTypeTask = "WorkingTask "
                                AllUserData?.numberOfTasks?.push(pickUpdropData)
                                AllUserData?.workingToday?.push(totalTasks)
                                //   globalCommon.updateItemById(baseUrl, pickUpdropData.listId, dropUpdate, pickUpdropData.Id)
                                //   globalCommon.updateItemById(baseUrl, totalTasks.listId, workingDropUpdate, totalTasks.Id)
                            }
                        })
                        AllUserData?.workingToday.map((totalTasks: any, index: any) => {
                            if (totalTasks.Id == pickUpdropData.Id) {
                                AllUserData?.workingToday?.splice(index, 1);
                            }

                        })
                    }
                    AllUserData = checkHigherPriorityFunction(AllUserData)
                    userShift = AllUserData?.IshigherSmartPriority
                    callDesignationFunction = AllUserData?.UserGroup?.Title
                    tempUser = AllUserData
                    if (userShift == true) {
                        allTaskData.splice(index, 1)
                        allTaskData.unshift(tempUser)
                    }

                }
            })
            getDataAccordingDesignation(callDesignationFunction);
            setAllTaskData([...allTaskData])
        }
    }

    const checkHigherPriorityFunction = (AllUserData: any) => {
        AllUserData?.numberOfTasks.map((allTaskhigherPriority: any) => {
            allTaskhigherPriority.higherPriority = false;
        })

        AllUserData?.numberOfTasks?.map((allTaskpriorty: any) => {
            AllUserData?.workingToday?.map((checkpriortytodayWork: any, index: any) => {
                if (allTaskpriorty?.SmartPriority != checkpriortytodayWork?.SmartPriority && allTaskpriorty?.SmartPriority > checkpriortytodayWork?.SmartPriority) {
                    allTaskpriorty.higherPriority = true;
                    // userShift = true;
                    AllUserData.IshigherSmartPriority = true;
                }

            })
        })
        AllUserData?.numberOfTasks?.sort(function (a: any, b: any) { return b.SmartPriority - a.SmartPriority });
        AllUserData?.workingToday?.sort(function (a: any, b: any) { return b.SmartPriority - a.SmartPriority });
        return AllUserData;
    }

    return (
        <>
            <nav>
                <div className="nav nav-tabs SmartTaskMgmtTabsNavLink" id="nav-tab" role="tablist">
                    {dataAsDesignation && dataAsDesignation.length > 0 && designationNames.length > 0 && designationNames.map((designation: any) => {
                        return (
                            <button onClick={() => getDataAccordingDesignation(designation.Title)} className={designation.classUsed} id={`nav-${designation.Title}-tab`} data-bs-toggle="tab" data-bs-target={`#nav-${designation.Title}-tab`} type="button" role="tab" aria-controls={`nav-${designation.Title}`} aria-selected="true">{designation.Title}</button>
                        )
                    })}
                </div>
            </nav>

            <div className="tab-content SmartTaskMgmtTabs" id="nav-tabContent">
                <div className="tab-pane fade show active" id={`nav-${uniqueDesignation}-tab`} role="tabpanel" aria-labelledby={`nav-${uniqueDesignation}-tab`}>
                    {dataAsDesignation && dataAsDesignation.length > 0 &&
                        <div className='SmartTaskMgmt'>
                            <ul>
                                <li className='headerBar'>
                                    <span className="member-detail-box"><h1>Team Members</h1></span>
                                    <span className="working-Today-box"><h1>Working Today Tasks</h1></span>
                                    <span className="bucket-box"><h1>Bucket Tasks</h1></span>
                                </li>
                                {dataAsDesignation.map((data: any) => {
                                    return (
                                        <li>
                                            <span className="member-detail-box">
                                                <img src={data?.Item_x0020_Cover?.Url}></img>
                                                <span className='member-desc'>
                                                    <h2 className="member-name">
                                                        <a href={`${baseUrl}/SitePages/TaskDashboard.aspx?UserId=${data.AssingedToUserId}&Name=${data.Title}`} target="_blank"
                                                            data-interception="off" >
                                                            {data.Title} </a></h2>
                                                    <span className='member-profile'>{data.designation}</span>
                                                </span>
                                            </span>
                                            <span className="working-Today-box" onDragOver={(e) => dragOver(e)} onDrop={(e) => dragDrop(e, "", "WorkingParentDrop", data?.Id)} >
                                                {data?.workingToday != undefined && data.workingToday.length > 0 ?
                                                    data?.workingToday.map((workToday: any, index: any) => {
                                                        return (
                                                            index < 3 ? <>
                                                                <span key={index} draggable data-value={workToday} onDragStart={(e) => dragstart(e, workToday, data?.Id)} onDragOver={(e) => dragOver(e)} onDrop={(e) => { e.stopPropagation(); dragDrop(e, workToday, "WorkingDrop", data?.Id) }} className='task-label'>
                                                                    <ReactPopperTooltipSingleLevel CMSToolId={workToday.TaskIdSmartPriority} row={workToday} AllListId={AllListId} singleLevel={true} masterTaskData={masterData} />
                                                                </span>
                                                            </>
                                                                : ""
                                                        )
                                                    })
                                                    : <span className='task-label' onDragOver={(e) => dragOver(e)} onDrop={(e) => dragDrop(e, "", "WorkingParentDrop", data?.Id)}>+</span>}

                                            </span>
                                            <span className="bucket-box">
                                                {data?.numberOfTasks.map((bucketTasks: any, index: any) => {
                                                    return (
                                                        index < 3 ?
                                                            <span key={index} draggable onDragStart={(e) => dragstart(e, bucketTasks, data?.Id)} onDragOver={(e) => dragOver(e)} onDrop={(e) => dragDrop(e, bucketTasks, "BucketDrop", data?.Id)} className={bucketTasks.higherPriority == true ? "task-label blinkingBackgroundSP" : "task-label"}>
                                                                <ReactPopperTooltipSingleLevel CMSToolId={bucketTasks.TaskIdSmartPriority} row={bucketTasks} AllListId={AllListId} singleLevel={true} AllSitesTaskData={allSitesTasks} masterTaskData={masterData} />
                                                            </span>
                                                            : ""
                                                    )
                                                })}
                                            </span>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    }

                </div>
            </div>



            {loader && <PageLoader />}

        </>
    )
}
