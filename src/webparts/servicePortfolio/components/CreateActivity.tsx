import * as React from "react";
import { Panel, PanelType } from "office-ui-fabric-react";
import { Web } from "sp-pnp-js";
import TeamConfigurationCard from "../../../globalComponents/TeamConfiguration/TeamConfiguration";
import HtmlEditorCard from "../../../globalComponents/HtmlEditor/HtmlEditor";
import moment, * as Moment from "moment";
import Picker from "../../../globalComponents/EditTaskPopup/SmartMetaDataPicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import Tooltip from "../../../globalComponents/Tooltip";
import "react-datepicker/dist/react-datepicker.css";
import "froala-editor/js/plugins.pkgd.min.js";
import "froala-editor/js/froala_editor.pkgd.min.js";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import * as globalCommon from "../../../globalComponents/globalCommon";
import FlorarImageUploadComponent from "../../../globalComponents/FlorarComponents/FlorarImageUploadComponent";
let SitesTypes: any = [];
let AllListId: any = {};
let IsapprovalTask = false
let subCategories: any = [];
let AllMetadata: any = [];
let AllTaskUsers: any = [];
let siteConfig: any = [];
let loggedInUser: any = {};
let AutoCompleteItemsArray: any = [];
let FeedBackItem: any = {};
const CreateActivity = (props: any) => {
    const [isActive, setIsActive] = React.useState({
        siteType: false,
        time: false,
        rank: false,
        dueDate: false,

    });
    const [siteType, setSiteType] = React.useState([]);
    const [TaskTitle, setTaskTitle] = React.useState(props?.selectedItem?.Title);
    const [instantCategories, setInstantCategories] = React.useState([])
    const [sendApproverMail, setSendApproverMail] = React.useState(false)
    const [selectedSites, setSelectedSites] = React.useState([]);
    const [CategoriesData, setCategoriesData] = React.useState<any>([]);
    const [categorySearchKey, setCategorySearchKey] = React.useState("");
    const [refreshData, setRefreshData] = React.useState(false);
    const [IsComponentPicker, setIsComponentPicker] = React.useState(false);
    // const [IsClientPopup, setIsClientPopup] = React.useState(false);
    const [FeedbackPost, setFeedbackPost] = React.useState([])
    const [SharewebCategory, setSharewebCategory] = React.useState("");
    const [selectedItem, setSelectedItem]: any = React.useState({})
    const [TaskAssignedTo, setTaskAssignedTo] = React.useState([]);
    const [TaskTeamMembers, setTaskTeamMembers] = React.useState([]);
    const [selectPriority, setselectPriority] = React.useState("");
    const [SearchedCategoryData, setSearchedCategoryData] = React.useState([]);
    const [ClientCategoriesData, setClientCategoriesData] = React.useState<any>(
        []
    );
    const [TaskResponsibleTeam, setTaskResponsibleTeam] = React.useState([]);
    const [editTaskPopupData, setEditTaskPopupData] = React.useState({
        isOpenEditPopup: false,
        passdata: null
    })
    const [save, setSave] = React.useState({ siteType: undefined, linkedServices: [], recentClick: undefined, Mileage: '', Body: [], DueDate: undefined, dueDate: '', taskCategory: '', taskCategoryParent: '', rank: undefined, taskName: '', taskUrl: undefined, portfolioType: 'Component', Component: [] })

    React.useEffect(() => {

        AllListId = props?.AllListId
        getTaskUsers();
        GetSmartMetadata();

        if (props?.selectedItem?.AssignedTo?.length > 0) {
            setTaskAssignedTo(props?.selectedItem?.AssignedTo)
        }
        if (props?.selectedItem?.ResponsibleTeam?.length > 0 || props?.selectedItem?.TeamLeader?.length > 0) {
            setTaskResponsibleTeam(props?.ResponsibleTeam?.AssignedTo)
        }
        if (props?.selectedItem?.TeamMembers?.length > 0 || props?.selectedItem?.TeamMembers?.length > 0) {
            setTaskTeamMembers(props?.TeamMembers?.AssignedTo)
        }
        if (props?.selectedItem?.ClientCategory?.length > 0) {
            setClientCategoriesData(props?.selectedItem?.ClientCategory)
        } else if (props?.selectedItem?.ClientCategory?.results?.length > 0) {
            setClientCategoriesData(props?.selectedItem?.ClientCategory?.results)
        }
        setSelectedItem(props?.selectedItem)

    }, [])
    //***************** Load All task Users***************** */
    const getTaskUsers = async () => {
        if (AllListId?.TaskUsertListID != undefined) {
            let web = new Web(AllListId?.siteUrl);
            let taskUser = [];
            taskUser = await web.lists
                .getById(AllListId?.TaskUsertListID)
                .items
                .select("Id,UserGroupId,Suffix,Title,technicalGroup,Email,SortOrder,Role,Company,ParentID1,Status,Item_x0020_Cover,AssingedToUserId,isDeleted,AssingedToUser/Title,AssingedToUser/Id,AssingedToUser/EMail,UserGroup/Id,ItemType,Approver/Id,Approver/Title,Approver/Name")
                .top(5000)
                .expand("AssingedToUser,Approver, UserGroup")
                .get();
            try {
                taskUser?.map((user: any) => {
                    if (props?.context?.pageContext?.legacyPageContext?.userId == user?.AssingedToUser?.Id) {
                        loggedInUser = user;
                    }
                })
            } catch (error) {
                console.log(error)
            }

            AllTaskUsers = taskUser;
        }
        // console.log("all task user =====", taskUser)
    }

    // Task User End   
    //   ***************** Start Callback function for  open categories  popup ************************
    const Call = React.useCallback((item1: any, type: any) => {
        setIsComponentPicker(false);
        // setIsClientPopup(false);
        if (type == "Category-Task-Footertable") {
            setCategoriesData(item1);
        }
    }, []);
    //   ***************** End  Callback function for  open categories  popup ************************
    // ************** start MAIN  Get smartmetadata function main function************************* 
    const GetSmartMetadata = async () => {
        SitesTypes = [];
        subCategories = [];
        var TaskTypes: any = []
        var Task: any = []
        let web = new Web(AllListId?.siteUrl);
        let MetaData = [];
        MetaData = await web.lists
            .getById(AllListId?.SmartMetadataListID)
            .items
            .select("Id,Title,listId,siteUrl,siteName,Item_x005F_x0020_Cover,ParentID,Parent/Id,Parent/Title,EncodedAbsUrl,IsVisible,Created,Item_x0020_Cover,Modified,Description1,SortOrder,Selectable,TaxType,Created,Modified,Author/Name,Author/Title,Editor/Name,Editor/Title,AlternativeTitle")
            .top(4999)
            .expand('Author,Editor,Parent')
            .get();
        AllMetadata = MetaData;
        siteConfig = getSmartMetadataItemsByTaxType(AllMetadata, 'Sites')
        siteConfig?.map((site: any) => {
            if (site?.Title !== undefined && site?.Title !== 'Foundation' && site?.Title !== 'Master Tasks' && site?.Title !== 'DRR' && site?.Title !== 'Health' && site?.Title !== 'Gender' && site?.Title !== 'SP Online') {
                SitesTypes.push(site);
            }
        })
        if (SitesTypes?.length == 1) {
            setSelectedSites(SitesTypes)
            setSiteType(SitesTypes)
        } else {
            setSiteType(SitesTypes)
        }
        if (props?.selectedItem?.NoteCall == "Task") {
            SitesTypes.map((item: any) => {
                if (item?.Title?.toLowerCase() == props?.selectedItem?.siteType?.toLowerCase()) {
                    setSelectedSites([item]);
                }
            })
        }
        TaskTypes = getSmartMetadataItemsByTaxType(AllMetadata, 'Categories');
        let instantCat: any = [];
        TaskTypes?.map((cat: any) => {
            cat.ActiveTile = false;
            getChilds(cat, TaskTypes);
            if (cat?.ParentID !== undefined && cat?.ParentID === 0 && cat?.Title !== 'Phone') {
                Task.push(cat);
            }
            if (cat?.Title == 'Phone' || cat?.Title == 'Email Notification' || cat?.Title == 'Immediate' || cat?.Title == 'Approval') {
                instantCat.push(cat)
            }
            if (cat?.Parent?.Id !== undefined && cat?.Parent?.Id !== 0 && cat?.IsVisible) {
                subCategories.push(cat);
            }
        })
        setInstantCategories(instantCat)
        console.log(AutoCompleteItemsArray, 'Auto Due Date')
        let uniqueArray: any = [];
        AutoCompleteItemsArray.map((currentObject: any) => {
            if (!uniqueArray.find((obj: any) => obj.Id === currentObject.Id)) {
                uniqueArray.push(currentObject)
            }
        })
        AutoCompleteItemsArray = uniqueArray;
        Task?.map((taskItem: any) => {
            subCategories?.map((item: any) => {
                if (taskItem?.Id === item?.Parent?.Id) {
                    try {
                        item.ActiveTile = false;
                        item.SubTaskActTile = item?.Title?.replace(/\s/g, "");
                    } catch (error) {
                        console.log(error);
                    }
                }
            })
        })

        if (IsapprovalTask == true) {
            subCategories?.map((item: any) => {
                if (item?.Title == "Approval" && !item.ActiveTile) {
                    selectSubTaskCategory(item?.Title, item?.Id, item)
                }
            })
        }
    }
    // **************  Get smartmetadata function End ************************* 
    const changeTitle = (e: any) => {
        if (e.target.value.length > 56) {
            alert("Task Title is too long. Please chose a shorter name and enter the details into the task description.")
        } else {
            setTaskTitle(e.target.value);
        }
    }

    // *************** START  Select Tiles Function ********************************
    const setActiveTile = (site: any) => {
        let saveItem = selectedSites;
        if (saveItem?.some((item: any) => item?.Id == site?.Id)) {
            if (selectedItem?.NoteCall == "Task") {
                saveItem = [];
            } else {
                saveItem = saveItem?.filter((filterValue: any) => filterValue?.Id != site?.Id);
            }
        } else {
            if (selectedItem?.NoteCall == "Task") {
                saveItem = [site];
            } else {
                saveItem?.push(site)
            }
        }
        setSelectedSites((prev) => saveItem)
        setRefreshData(!refreshData)
        setSiteType((prev) => prev)

    };
    // *************** END   Select Tiles Function ********************************
    // ****** THIS FUNCTION IS USE FOR CATROGIES AUTO SUGGESTION ************************
    const getChilds = (item: any, items: any) => {
        let parent = JSON.parse(JSON.stringify(item))
        parent.Newlabel = `${parent?.Title}`;
        AutoCompleteItemsArray.push(parent)
        parent.childs = [];
        items?.map((childItem: any) => {
            if (childItem?.Parent?.Id !== undefined && parseInt(childItem?.Parent?.Id) === parent.ID) {
                let child = JSON.parse(JSON.stringify(childItem))
                parent.childs.push(child);
                child.Newlabel = `${parent?.Newlabel} > ${child?.Title}`;
                AutoCompleteItemsArray.push(child);
                getChilds(child, items);
            }
        });
    }
    // ****** THIS FUNCTION IS USE FOR CATROGIES AUTO SUGGESTION ************************
    let getSmartMetadataItemsByTaxType = (metadataItems: any, taxType: any) => {
        var Items: any = [];
        metadataItems?.map((taxItem: any) => {
            if (taxItem.TaxType === taxType)
                Items.push(taxItem);
        });

        Items.sort((a: any, b: any) => {
            return a.SortOrder - b.SortOrder;
        });
        return Items;
    }
    // ****** THIS FUNCTION IS USE FOR CATROGIES AUTO SUGGESTION  END  ************************
    const onRenderCustomHeaderMain = () => {
        return (
            <>
                <div
                    style={{
                        marginRight: "auto",
                        fontSize: "20px",
                        fontWeight: "600",
                        marginLeft: "20px"
                    }}
                >
                    <h2 className="heading">
                        {`Create Quick Option - ${selectedItem?.NoteCall}`}
                    </h2>
                </div>
                <Tooltip ComponentId={1746} />
            </>
        );
    };

    const closePopup = (res: any) => {
        if (res === "item") {
            props.Call("Close");
        } else {
            props.Call(res);
        }
    };
    function DDComponentCallBack(TeamData: any) {
        // setTeamConfig(dt)

        if (TeamData?.AssignedTo?.length > 0) {
            let AssignedUser: any = [];
            TeamData.AssignedTo?.map((arrayData: any) => {
                if (arrayData.AssingedToUser != null) {
                    AssignedUser.push(arrayData.AssingedToUser);
                } else {
                    AssignedUser.push(arrayData);
                }
            });
            setTaskAssignedTo(AssignedUser);
        } else {
            setTaskAssignedTo([]);
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
            setTaskTeamMembers(teamMembers);
        } else {
            setTaskTeamMembers([]);
        }
        if (TeamData.ResponsibleTeam != undefined && TeamData.ResponsibleTeam.length > 0) {
            let responsibleTeam: any = [];
            TeamData.ResponsibleTeam?.map((arrayData: any) => {
                if (arrayData.AssingedToUser != null) {
                    responsibleTeam.push(arrayData.AssingedToUser);
                } else {
                    responsibleTeam.push(arrayData);
                }
            });
            setTaskResponsibleTeam(responsibleTeam);
        } else {
            setTaskResponsibleTeam([]);
        }
    }
    const handleDatedue = (date: any) => {
        // AllItems.DueDate = date;
        var finalDate: any = Moment(date).format("YYYY-MM-DD");
        setSave({ ...save, DueDate: finalDate });
    };
    const HtmlEditorCallBack = React.useCallback((EditorData: any) => {


        if (EditorData.length > 8) {
            let param: any = Moment(new Date().toLocaleString());
            FeedBackItem["Title"] = "FeedBackPicture" + param;
            FeedBackItem["FeedBackDescriptions"] = [];
            FeedBackItem.FeedBackDescriptions = [
                {
                    Title: EditorData
                }
            ];
            FeedBackItem["ImageDate"] = "" + param;
            FeedBackItem["Completed"] = "";
            setFeedbackPost([FeedBackItem]);
        }
    }, []);

    //------------Image upload function start--------------


    const FlorarImageUploadComponentCallBack = (dt: any) => {
        console.log(dt)
        // setUploadBtnStatus(false);
        // let DataObject: any = {
        //     data_url: dt,
        //     file: "Image/jpg"
        // }
        // let arrayIndex: any = TaskImages?.length
        // TaskImages.push(DataObject)
        // if (dt.length > 0) {
        //     onUploadImageFunction(TaskImages, [arrayIndex]);
        // }
    }

    //------------ Image Upload Function end -------------

    // ---------------- change priority status function start -------------------
    const ChangePriorityStatusFunction = (e: any) => {
        let value = e.target.value;
        if (Number(value) <= 10) {
            setselectPriority(e.target.value);
        } else {
            alert("Priority Status not should be greater than 10");
            setselectPriority("0");
        }
    };

    //------- change priority status function End -----------


    //--------Edit client categroy and categrioes open popup function  -------------
    // const EditClientCategory = (item: any) => {
    //     setIsClientPopup(true);
    //     setSharewebCategory(item);
    // };
    const EditComponentPicker = (item: any) => {
        setIsComponentPicker(true);
        setSharewebCategory(item);
    };
    //-------- Edit client categrory and categrioes open popup  fuction end ------------


    //-------------------- save function  start ---------------------
    const saveNoteCall = () => {
        if (selectedSites?.length == 0) {
            alert("Please select the site");
        } else if (TaskTitle?.length <= 0) {
            alert("Please Enter Task Title");
        }
        else {
            let priorityRank = 4;
            let priority = '';
            if (selectPriority === '' || parseInt(selectPriority) <= 0) {
                priority = '(2) Normal';
            }
            else {
                priorityRank = parseInt(selectPriority);
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
            var categoriesItem = "";
            var CategoryID: any = [];
            CategoriesData.map((category: any) => {
                if (category.Title != undefined) {
                    categoriesItem =
                        categoriesItem == ""
                            ? category.Title
                            : categoriesItem + ";" + category.Title;
                    CategoryID.push(category.Id);
                }
            });
            let AssignedToIds: any = [];
            let TeamMemberIds: any = [];
            let ResponsibleTeamIds: any = [];
            if (TaskAssignedTo != undefined && TaskAssignedTo?.length > 0) {
                TaskAssignedTo.map((taskInfo: any) => {
                    AssignedToIds.push(taskInfo.Id);
                });
            }

            if (TaskTeamMembers != undefined && TaskTeamMembers?.length > 0) {
                TaskTeamMembers.map((taskInfo: any) => {
                    TeamMemberIds.push(taskInfo.Id);
                });
            }
            if (
                TaskResponsibleTeam != undefined &&
                TaskResponsibleTeam?.length > 0
            ) {
                TaskResponsibleTeam.map((taskInfo: any) => {
                    ResponsibleTeamIds.push(taskInfo.Id);
                });
            }

            selectedSites.forEach(async (site: any) => {
                let Tasklevel: any = "";
                let TaskID = "";
                let prentID = "";
                let LetestLevelData: any = [];
                let Sitestagging: any;
                var ClientCategory: any = [];
                try {

                    if (
                        ClientCategoriesData != undefined &&
                        ClientCategoriesData?.length > 0
                    ) {
                        ClientCategoriesData.map((val: any) => {
                            if (site?.Title?.toLowerCase() == "shareweb") {
                                ClientCategory.push(val?.Id);
                            }
                            else if (val?.Id != undefined && val?.siteName == site?.Title) {
                                ClientCategory.push(val?.Id);
                            }
                            else if (val?.Id != undefined && val?.Titles != undefined && val?.Titles.length > 0 && val?.Titles[0] == site?.Title) {
                                ClientCategory.push(val?.Id);
                            }
                        });
                    }

                    if (selectedItem?.Sitestagging != undefined) {
                        if (typeof selectedItem?.Sitestagging == "object") {
                            if (site?.Title?.toLowerCase() == "shareweb") {
                                Sitestagging = JSON.stringify(selectedItem?.Sitestagging);
                            } else {
                                var siteComp: any = {};
                                siteComp.SiteName = site?.Title,
                                    siteComp.localSiteComposition = true
                                siteComp.ClienTimeDescription = 100,
                                    //   siteComp.SiteImages = ,
                                    siteComp.Date = Moment(new Date().toLocaleString()).format("DD-MM-YYYY");
                                Sitestagging = JSON?.stringify([siteComp]);
                            }
                            // clientTime = JSON.stringify(selectedItem?.ClientTime);
                        } else {
                            if (site?.Title?.toLowerCase() == "shareweb") {
                                Sitestagging = selectedItem?.Sitestagging
                            } else {
                                var siteComp: any = {};
                                siteComp.SiteName = site?.Title,
                                    siteComp.localSiteComposition = true
                                siteComp.ClienTimeDescription = 100,
                                    //   siteComp.SiteImages = ,
                                    siteComp.Date = Moment(new Date().toLocaleString()).format("DD-MM-YYYY");
                                Sitestagging = JSON?.stringify([siteComp]);
                            }

                        }
                    }
                } catch (error) {
                    console.log(error, 'CC Fetching ')
                }
                if (selectedItem?.NoteCall != "Task") {
                    let web = new Web(AllListId?.siteUrl);
                    let componentDetails: any = [];
                    componentDetails = await web.lists
                        .getById(site.listId)
                        .items.select("Id,Title,TaskType/Id,TaskType/Title,TaskLevel")
                        .expand("TaskType")
                        .orderBy("Id", false)
                        .filter("TaskType/Title eq 'Activities'")
                        .top(1)
                        .get();
                    console.log(componentDetails);
                    if (componentDetails.length == 0) {
                        var LatestId: any = 1;
                        Tasklevel = LatestId;
                        TaskID = "A" + LatestId;
                    } else {
                        var LatestId = componentDetails[0].TaskLevel + 1;
                        Tasklevel = LatestId;
                        TaskID = "A" + LatestId;
                    }

                    var MyTaskID = TaskID + LatestId;

                    await web.lists
                        .getById(site.listId)
                        .items.add({
                            Title: TaskTitle,
                            Categories: categoriesItem ? categoriesItem : null,

                            DueDate:
                                save.DueDate != undefined ? new Date(save.DueDate).toISOString() : null,
                            TaskCategoriesId: { results: CategoryID },
                            ClientCategoryId: { results: ClientCategory },
                            PortfolioId: selectedItem?.Id,
                            PriorityRank: priorityRank,
                            Priority: priority,
                            TaskTypeId: 1,
                            FeedBack:
                                FeedbackPost?.length > 0
                                    ? JSON.stringify(FeedbackPost)
                                    : null,
                            AssignedToId: {
                                results:
                                    AssignedToIds != undefined && AssignedToIds?.length > 0
                                        ? AssignedToIds
                                        : []
                            },
                            ResponsibleTeamId: {
                                results:
                                    ResponsibleTeamIds != undefined &&
                                        ResponsibleTeamIds?.length > 0
                                        ? ResponsibleTeamIds
                                        : []
                            },
                            TeamMembersId: {
                                results:
                                    TeamMemberIds != undefined && TeamMemberIds?.length > 0
                                        ? TeamMemberIds
                                        : []
                            },
                            SiteCompositionSettings:
                                selectedItem.SiteCompositionSettings,

                            ClientTime: Sitestagging,
                            TaskID: TaskID,
                            TaskLevel: Tasklevel
                        })
                        .then((res: any) => {
                            let item: any = {};
                            if (res?.data) {
                                item = res?.data;
                                item = {
                                    ...item, ...{
                                        ClientCategory: ClientCategoriesData,
                                        AssignedTo: TaskAssignedTo,
                                        DisplayCreateDate: moment(item.Created).format("DD/MM/YYYY"),
                                        DisplayDueDate: moment(item.DueDate).format("DD/MM/YYYY"),
                                        Portfolio: selectedItem?.Portfolio,
                                        TaskID: TaskID,
                                        siteUrl: site?.siteUrl,
                                        siteType: site?.Title,
                                        listId: site?.listId,
                                        SiteIcon: site?.Item_x005F_x0020_Cover?.Url,
                                        ResponsibleTeam: TaskResponsibleTeam,
                                        TeamMembers: TaskTeamMembers,
                                        TeamLeader: TaskResponsibleTeam,
                                        Author: {
                                            Id: props?.context?.pageContext?.legacyPageContext?.userId
                                        }
                                    }
                                }
                                if (item.DisplayDueDate == "Invalid date" || "") {
                                    item.DisplayDueDate = item.DisplayDueDate.replaceAll(
                                        "Invalid date",
                                        ""
                                    );
                                }
                                res.data = item;
                            }
                            if (selectedItem.PageType == "ProjectManagement") {
                                props.Call();
                                let url = `${AllListId.siteUrl}/SitePages/Task-Profile.aspx?taskId=${res.data.Id}&Site=${res.data.siteType}`;
                                window.location.href = url;
                            } else {
                                console.log(res);
                                closeTaskStatusUpdatePoup(res);
                                console.log(res);
                            }
                        });


                }
                if (selectedItem?.NoteCall == "Task") {
                    let web = new Web(AllListId?.siteUrl);
                    let componentDetails: any = [];
                    componentDetails = await web.lists
                        .getById(site.listId)
                        .items.select("Id,Title")
                        .orderBy("Id", false)
                        .top(1)
                        .get();
                    console.log(componentDetails);
                    var LatestId = componentDetails[0].Id + 1;

                    if (
                        selectedItem?.TaskType?.Title == "Workstream" ||
                        selectedItem?.SharewebTaskType?.Title == "Workstream" || selectedItem?.TaskType === "Workstream"
                    ) {
                        TaskID = selectedItem?.TaskID + "-T" + LatestId;
                    } else {
                        TaskID = "T" + LatestId;
                    }



                    if (selectedItem?.TaskType?.Title == "Workstream" || selectedItem?.TaskType === "Workstream") {
                        var PortfolioData = selectedItem?.Portfolio?.Id;
                        var ParentData = selectedItem?.Id;
                    } else {
                        var PortfolioData = selectedItem?.Id;
                    }
                    let clientTime: any;
                    if (selectedItem?.ClientTime != undefined) {
                        if (typeof selectedItem?.ClientTime == "object") {
                            if (site?.Title?.toLowerCase() == "shareweb") {
                                clientTime = JSON.stringify(selectedItem?.ClientTime);
                            } else {
                                var siteComp: any = {};
                                siteComp.SiteName = site?.Title,
                                    siteComp.localSiteComposition = true
                                siteComp.ClienTimeDescription = 100,
                                    //   siteComp.SiteImages = ,
                                    siteComp.Date = Moment(new Date().toLocaleString()).format("DD-MM-YYYY");
                                clientTime = JSON?.stringify([siteComp]);
                            }
                            // clientTime = JSON.stringify(selectedItem?.ClientTime);
                        } else {
                            if (site?.Title?.toLowerCase() == "shareweb") {
                                clientTime = selectedItem?.ClientTime
                            } else {
                                var siteComp: any = {};
                                siteComp.SiteName = site?.Title,
                                    siteComp.localSiteComposition = true
                                siteComp.ClienTimeDescription = 100,
                                    //   siteComp.SiteImages = ,
                                    siteComp.Date = Moment(new Date().toLocaleString()).format("DD-MM-YYYY");
                                clientTime = JSON?.stringify([siteComp]);
                            }

                        }
                    }


                    var arrayy = [];
                    web = new Web(AllListId?.siteUrl);
                    await web.lists
                        .getById(site.listId)
                        .items.add({
                            Title: TaskTitle,
                            Categories: categoriesItem ? categoriesItem : null,
                            PriorityRank: priorityRank,
                            Priority: priority,
                            // DueDate: date != undefined ? new Date(date).toDateString() : date,
                            DueDate:
                                save?.DueDate != undefined ? new Date(save.DueDate).toISOString() : null,
                            TaskCategoriesId: { results: CategoryID },
                            PortfolioId: PortfolioData,
                            ParentTaskId: ParentData != undefined ? ParentData : null,
                            ClientCategoryId: { results: ClientCategory },
                            FeedBack:
                                FeedbackPost?.length > 0
                                    ? JSON.stringify(FeedbackPost)
                                    : null,
                            AssignedToId: {
                                results:
                                    AssignedToIds != undefined && AssignedToIds?.length > 0
                                        ? AssignedToIds
                                        : []
                            },
                            ResponsibleTeamId: {
                                results:
                                    ResponsibleTeamIds != undefined &&
                                        ResponsibleTeamIds?.length > 0
                                        ? ResponsibleTeamIds
                                        : []
                            },
                            TeamMembersId: {
                                results:
                                    TeamMemberIds != undefined && TeamMemberIds?.length > 0
                                        ? TeamMemberIds
                                        : []
                            },
                            SiteCompositionSettings: selectedItem?.SiteCompositionSettingsbackup != undefined ? JSON.stringify(
                                selectedItem?.SiteCompositionSettingsbackup) : null
                            ,
                            ClientTime: clientTime != undefined ? clientTime : Sitestagging != undefined ? Sitestagging : null,
                            TaskID: TaskID,
                            TaskTypeId: 2
                        })
                        .then((res: any) => {
                            let item: any = {};
                            if (res?.data) {
                                item = res?.data;
                                item = {
                                    ...item,
                                    ClientCategory: ClientCategoriesData,
                                    AssignedTo: TaskAssignedTo,
                                    DisplayCreateDate: moment(item.Created).format("DD/MM/YYYY"),
                                    DisplayDueDate: moment(item.DueDate).format("DD/MM/YYYY"),
                                    Portfolio: selectedItem?.Portfolio,
                                    siteUrl: site?.siteUrl,
                                    siteType: site?.Title,
                                    listId: site?.listId,
                                    SiteIcon: site?.Item_x005F_x0020_Cover?.Url,
                                    ResponsibleTeam: TaskResponsibleTeam,
                                    FeedBack:
                                        FeedbackPost?.length > 0
                                            ? FeedbackPost
                                            : null,
                                    TeamMembers: TaskTeamMembers,
                                    TeamLeader: TaskResponsibleTeam,
                                    Author: {
                                        Id: props?.context?.pageContext?.legacyPageContext?.userId
                                    }


                                }
                                if (item.DisplayDueDate == "Invalid date" || "") {
                                    item.DisplayDueDate = item.DisplayDueDate.replaceAll(
                                        "Invalid date",
                                        ""
                                    );
                                }
                                res.data = item;
                            }

                            if (selectedItem.PageType == "ProjectManagement") {
                                props.Call();
                                let url = `${AllListId.siteUrl}/SitePages/Task-Profile.aspx?taskId=${res.data.Id}&Site=${res.data.siteType}`;
                                window.location.href = url;
                            }
                            else {

                                closeTaskStatusUpdatePoup(res);
                            }

                        });
                    // }
                }

            });
        }
    };
    const closeTaskStatusUpdatePoup = (res: any) => {
        if (res === "item") {
            //   setTaskStatuspopup(false);
            props.Call("Close");
        } else {
            //   setTaskStatuspopup(false);
            props.Call(res);
        }
    };
    //----------- save function end --------------

    //Auto Suggest Categories 
    const autoSuggestionsForCategory = async (e: any) => {
        let searchedKey: any = e.target.value;
        setCategorySearchKey(e.target.value);
        let tempArray: any = [];
        if (searchedKey?.length > 0) {
            AutoCompleteItemsArray?.map((itemData: any) => {
                if (
                    itemData.Newlabel.toLowerCase().includes(searchedKey.toLowerCase())
                ) {
                    tempArray.push(itemData);
                }
            });
            setSearchedCategoryData(tempArray);
        } else {
            setSearchedCategoryData([]);
        }
    };
    const setSelectedCategoryData = (selectCategoryData: any, usedFor: any) => {
        setCategorySearchKey("");
        setIsComponentPicker(false);
        let data: any = CategoriesData;
        if (selectCategoryData[0].Id != undefined) {
            data?.push(selectCategoryData[0]);
        }
        let uniqueData: any = [];
        data?.map((item: any) => {
            if (!uniqueData.find((secItem: any) => secItem?.Id == item?.Id)) {
                uniqueData.push(item)
            }
        })

        setCategoriesData((CategoriesData: any) => [...uniqueData]);
        setSearchedCategoryData([]);
    };
    //End

    // select category Functionality

    const selectSubTaskCategory = (title: any, Id: any, item: any) => {


        if (loggedInUser?.IsApprovalMail?.toLowerCase() == 'approve all but selected items' && !IsapprovalTask) {
            try {
                let selectedApprovalCat = JSON.parse(loggedInUser?.CategoriesItemsJson)
                IsapprovalTask = selectedApprovalCat?.some((selectiveApproval: any) => selectiveApproval?.Title == title)
                if (IsapprovalTask == true) {
                    subCategories?.map((item: any) => {
                        if (item?.Title == "Approval" && !item.ActiveTile) {
                            selectSubTaskCategory(item?.Title, item?.Id, item)
                        }
                    })
                }
            } catch (error: any) {
                console.log(error, "Can't Parse Selected Approval Categories")
            }
        }

        let TaskCategories: any[] = CategoriesData;
        if (item.ActiveTile) {
            if (IsapprovalTask && title == 'Approval') {
                console.log('')
            } else {
                item.ActiveTile = !item.ActiveTile;
                TaskCategories = TaskCategories.filter((category: any) => category?.Id !== Id);
                if (loggedInUser?.IsApprovalMail?.toLowerCase() == 'approve all but selected items' && IsapprovalTask) {
                    try {
                        let selectedApprovalCat = JSON.parse(loggedInUser?.CategoriesItemsJson)
                        IsapprovalTask = !selectedApprovalCat?.some((selectiveApproval: any) => selectiveApproval?.Title == title)
                        subCategories?.map((item: any) => {
                            if (item?.Title == "Approval" && item.ActiveTile) {
                                selectSubTaskCategory(item?.Title, item?.Id, item)
                            }
                        })
                    } catch (error: any) {
                        console.log(error, "Can't Parse Selected Approval Categories")
                    }
                }
            }

        } else if (!item.ActiveTile) {
            if (title === 'Email Notification' || title === 'Immediate' || title === 'Bug') {
                setselectPriority('10');
                handleDatedue(new Date());
            }
            if (title == 'Feedback' || title == 'Quality Control') {
                var flag = true;
                let AssignedToUsers: any = [];
                AllTaskUsers?.map((User: any) => {
                    if (User.Role == 'QA') {
                        AssignedToUsers.filter((item: any) => item != User.Id)
                        AssignedToUsers.push(User.Id);
                        flag = false;
                    }
                });
            }
            if (title?.indexOf('Design') > -1) {
                let AssignedToUsers: any = [];
                var flag = true;
                AllTaskUsers?.map((User: any) => {
                    if (User.Role == 'Developer' && User.Title == 'Design Team') {

                        AssignedToUsers.filter((item: any) => item != User.Id)
                        AssignedToUsers.push(User.Id);
                        flag = false;
                    }


                });
                AssignedToUsers.push(301)
                setTaskAssignedTo(AssignedToUsers)
                setTaskTeamMembers([301, 49]);
            }
            if (title?.indexOf('Support') > -1) {
                var flag = true;
                let AssignedToUsers: any = [];
                AllTaskUsers?.map((User: any) => {
                    if (User.Role == 'Developer' && User.Title == 'Support') {
                        AssignedToUsers.filter((item: any) => item != User.Id)
                        AssignedToUsers.push(User.Id);
                        flag = false;
                    }
                });
                setTaskAssignedTo(AssignedToUsers)
            }
            item.ActiveTile = !item.ActiveTile;
            TaskCategories.push(item)
        }
        setInstantCategories((CategoriesData: any) => CategoriesData?.map((selectCAT: any) => {
            if (selectCAT?.Id === item?.Id) {
                return item;
            }
            return selectCAT; // Return the original value if no change is needed
        }));
        setCategoriesData(TaskCategories)

    }
    const deleteCategories = (id: any) => {
        CategoriesData.map((catId: { Id: any }, index: any) => {
            if (id == catId.Id) {
                CategoriesData.splice(index, 1);
            }
        });
        setCategoriesData((CategoriesData: any) => [...CategoriesData]);
    };
    //End
    return (
        <>
            <Panel
                onRenderHeader={onRenderCustomHeaderMain}
                type={PanelType.custom}
                customWidth="1348px"
                isOpen={true}
                onDismiss={() => closePopup("item")}
                isBlocking={false}
                className={props?.props?.PortfolioType?.Color}
            >
                <div className="modal-body active">

                </div>

                <div className="modal-footer">
                    {siteType?.length > 1 && selectedItem?.TaskType?.Title != "Workstream" ?
                        <div className='col mt-4'>
                            <h4 className="titleBorder ">Websites</h4>
                            <div className='clearfix p-0'>
                                <ul className="site-actions">
                                    {siteType?.map((item: any) => {
                                        return (
                                            <>
                                                {(item.Title !== undefined && item.Title !== 'Offshore Tasks' && item.Title !== 'Master Tasks' && item.Title !== 'DRR' && item.Title !== 'SDC Sites' && item.Title !== 'QA') &&
                                                    <>
                                                        <li
                                                            className={selectedSites?.some((selectedSite: any) => selectedSite?.Id == item?.Id) ? 'bgtile active text-center position-relative' : "position-relative bgtile text-center"} onClick={() => setActiveTile(item)} >
                                                            {/*  */}
                                                            <a className={refreshData ? ' text-decoration-none ikkkkddd' : ' text-decoration-none lkjhgfdsa'} >
                                                                <span className="icon-sites">
                                                                    {item.Item_x005F_x0020_Cover != undefined &&
                                                                        <img className="icon-sites"
                                                                            src={item.Item_x005F_x0020_Cover.Url} />
                                                                    }
                                                                </span>{item.Title}
                                                            </a>
                                                        </li>
                                                    </>
                                                }
                                            </>)
                                    })}
                                </ul>
                            </div>
                        </div> : ''}
                    <div className="row">
                        <div className="col-sm-10">
                            <div className="row">
                                <div className="col-sm-10 mb-10 mt-2">
                                    <div className='input-group'>
                                        <label className='full-width'>Task Name</label>
                                        <input type="text" placeholder='Enter task Name' className='form-control' value={TaskTitle} onChange={(e) => { changeTitle(e) }}></input>
                                    </div>

                                </div>
                                <div className="col-sm-2 mb-10 padL-0 mt-2">
                                    <label>Due Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={save.DueDate}
                                        // defaultValue={Moment(save.DueDate).format("YYYY/MM/DD/")}
                                        onChange={handleDatedue}
                                    />
                                </div>
                            </div>
                            <div className="row mt-2">
                                <TeamConfigurationCard
                                    ItemInfo={selectedItem}
                                    AllListId={AllListId}
                                    parentCallback={DDComponentCallBack}
                                ></TeamConfigurationCard>
                            </div>
                            <div className="row">
                                <div className="col-sm-5">
                                    {/* <FroalaImageUploadComponent 
                                     callBack={copyImage} /> */}
                                    <div
                                        className="Florar-Editor-Image-Upload-Container"
                                        id="uploadImageFroalaEditor"
                                    >
                                        <div>
                                            <FlorarImageUploadComponent callBack={FlorarImageUploadComponentCallBack} />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-7">
                                    <HtmlEditorCard
                                        editorValue={
                                            save?.Body != undefined ? save?.Body : ""
                                        }
                                        HtmlEditorStateChange={HtmlEditorCallBack}
                                    ></HtmlEditorCard>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-2">
                            <div className="col-sm-12 padL-0 Prioritytp PadR0 mt-2">
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
                                                value={selectPriority ? selectPriority : ""}
                                                onChange={(e) => ChangePriorityStatusFunction(e)}
                                            />
                                        </div>

                                        <ul className="p-0 mt-1">
                                            <li className="form-check l-radio">
                                                <input
                                                    className="form-check-input"
                                                    name="radioPriority"
                                                    type="radio"
                                                    checked={
                                                        Number(selectPriority) <= 10 &&
                                                        Number(selectPriority) >= 8
                                                    }
                                                    onChange={() => setselectPriority("8")}
                                                />
                                                <label className="form-check-label">High</label>
                                            </li>
                                            <li className="form-check l-radio">
                                                <input
                                                    className="form-check-input"
                                                    name="radioPriority"
                                                    type="radio"
                                                    checked={
                                                        Number(selectPriority) <= 7 &&
                                                        Number(selectPriority) >= 4
                                                    }
                                                    onChange={() => setselectPriority("4")}
                                                />
                                                <label className="form-check-label">Normal</label>
                                            </li>
                                            <li className="form-check l-radio">
                                                <input
                                                    className="form-check-input"
                                                    name="radioPriority"
                                                    type="radio"
                                                    checked={
                                                        Number(selectPriority) <= 3 &&
                                                        Number(selectPriority) > 0
                                                    }
                                                    onChange={() => setselectPriority("1")}
                                                />
                                                <label className="form-check-label">Low</label>
                                            </li>
                                        </ul>
                                    </fieldset>
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-sm-12">
                                    <div className="col-sm-12 padding-0 input-group">
                                        <label className="full_width">Categories</label>

                                        <input
                                            type="text"
                                            className="ui-autocomplete-input form-control"
                                            id="txtCategories"
                                            value={categorySearchKey}
                                            onChange={(e) => autoSuggestionsForCategory(e)}
                                        />
                                        <span className="input-group-text">
                                            <a className="hreflink" title="Edit Categories">
                                                <img
                                                    src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/_layouts/15/images/EMMCopyTerm.png"
                                                    onClick={() => EditComponentPicker(selectedItem)}
                                                />
                                            </a>
                                        </span>

                                    </div>
                                    {
                                        instantCategories?.map((item: any) => {
                                            return (
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input rounded-0"
                                                        type="checkbox"
                                                        checked={CategoriesData?.some((selectedCat: any) => selectedCat?.Id == item?.Id)}
                                                        onClick={() =>
                                                            selectSubTaskCategory(item?.Title, item?.Id, item)
                                                        }
                                                    />
                                                    <label>{item?.Title}</label>
                                                </div>
                                            )
                                        })
                                    }
                                    {SearchedCategoryData?.length > 0 ? (
                                        <div className="SmartTableOnTaskPopup">
                                            <ul className="list-group">
                                                {SearchedCategoryData.map((item: any) => {
                                                    return (
                                                        <li
                                                            className="hreflink list-group-item rounded-0 list-group-item-action"
                                                            key={item.id}
                                                            onClick={() =>
                                                                setSelectedCategoryData([item], "For-Auto-Search")
                                                            }
                                                        >
                                                            <a>{item.Newlabel}</a>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                    ) : null}
                                </div>
                                {CategoriesData != undefined ? (
                                    <div>
                                        {CategoriesData?.map((type: any, index: number) => {
                                            return (
                                                <>
                                                    {!instantCategories?.some((selectedCat: any) => selectedCat?.Title == type?.Title) && (
                                                        <div className="block d-flex full-width justify-content-between mb-1 p-2">
                                                            <a
                                                                style={{ color: "#fff !important" }}
                                                                target="_blank"
                                                                data-interception="off"
                                                                href={`${AllListId.siteUrl.siteUrl}/SitePages/Portfolio-Profile.aspx?${selectedItem?.Id}`}
                                                            >
                                                                {type.Title}
                                                            </a>
                                                            <span
                                                                className="bg-light svg__iconbox svg__icon--cross"
                                                                onClick={() => deleteCategories(type?.Id)}
                                                            ></span>
                                                            {/* <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/_layouts/images/delete.gif" onClick={() => deleteCategories(type?.Id)} className="p-1" /> */}
                                                        </div>
                                                    )}
                                                </>
                                            );
                                        })}
                                    </div>
                                ) : null}
                                {/* <div className="col-sm-12">
                                    <div className="col-sm-12 padding-0 input-group">
                                        <label className="full_width">Client Category</label>
                                        <input
                                            type="text"
                                            className="ui-autocomplete-input form-control"
                                            id="txtCategories"
                                        />

                                        <span className="input-group-text">
                                            <a className="hreflink" title="Edit Categories">
                                                <img
                                                    src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/_layouts/15/images/EMMCopyTerm.png"
                                                    onClick={() => EditClientCategory(selectedItem)}
                                                />
                                            </a>
                                        </span>
                                    </div>

                                </div> */}

                            </div>
                            {/* 
                            {ClientCategoriesData != undefined &&
                                ClientCategoriesData?.length > 0 ? (
                                <div>
                                    {ClientCategoriesData?.map((type: any, index: number) => {
                                        return (
                                            <>

                                                <div className="block d-flex full-width justify-content-between mb-1 p-2">
                                                    <a
                                                        target="_blank"
                                                        data-interception="off"
                                                        href={`${AllListId.siteUrl}/SitePages/Portfolio-Profile.aspx?${props?.selectedItem?.Id}`}
                                                    >
                                                        {type.Title}
                                                    </a>
                                                    <span
                                                        className="bg-light svg__iconbox svg__icon--cross"
                                                      onClick={() =>
                                                        deleteClientCategories(type.Id)
                                                      }
                                                    >
                                                        {" "}
                                                    </span>
                                                    <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/_layouts/images/delete.gif" onClick={() => deleteClientCategories(type.Id)} className="p-1" />
                                                </div>

                                            </>
                                        );
                                    })}
                                </div>
                            ) : null} */}

                        </div>



                    </div>
                    <footer className={refreshData ? 'col text-end mt-3 lkjhgfds' : 'col text-end mt-3 kkkkk'}>
                        {
                            selectedSites?.map((site: any) => {
                                return (
                                    <span className='ms-2'>
                                        {(site.Item_x005F_x0020_Cover !== undefined && site.Item_x005F_x0020_Cover?.Url !== undefined) &&
                                            <img className={refreshData ? "createTask-SiteIcon me-1 rdfgererg" : "createTask-SiteIcon me-1 erfrerg"} style={{ width: '31.5px' }} title={site?.Title} src={site.Item_x005F_x0020_Cover.Url} />
                                        }
                                    </span>
                                )
                            })
                        }
                        <button
                            type="button"
                            className="btn btn-primary m-2"
                            onClick={() => saveNoteCall()}
                        >
                            Submit
                        </button>
                        <button
                            type="button"
                            className="btn btn-default m-2"
                            onClick={() => closeTaskStatusUpdatePoup("item")}
                        >
                            Cancel
                        </button>
                    </footer>

                </div>
            </Panel>


            {IsComponentPicker && (
                <Picker
                    props={SharewebCategory}
                    selectedCategoryData={CategoriesData}
                    usedFor="Task-Footertable"
                    AllListId={AllListId}
                    Call={Call}
                ></Picker>
            )}
            {/* {IsClientPopup && (
                <ClientCategoryPupup
                    props={SharewebCategory}
                    selectedClientCategoryData={ClientCategoriesData}
                    Call={Call}
                ></ClientCategoryPupup>
            )} */}
        </>
    );
};

export default CreateActivity;
