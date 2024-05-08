import * as React from "react";
import ReactDOMServer from "react-dom/server";
import { Panel, PanelType } from "office-ui-fabric-react";
import { Web } from "sp-pnp-js";
import TeamConfigurationCard from "./TeamConfiguration/TeamConfiguration";
import HtmlEditorCard from "./HtmlEditor/HtmlEditor";
import moment, * as Moment from "moment";
import DatePicker from "react-datepicker";
import Picker from "./EditTaskPopup/SmartMetaDataPicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import Tooltip from "./Tooltip";
import "react-datepicker/dist/react-datepicker.css";
import "froala-editor/js/plugins.pkgd.min.js";
import "froala-editor/js/froala_editor.pkgd.min.js";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import * as globalCommon from "./globalCommon";
import FlorarImageUploadComponent from "../webparts/EditPopupFiles/FlorarImagetabportfolio";
import { myContextValue } from './globalCommon';
import ServiceComponentPortfolioPopup from "./EditTaskPopup/ServiceComponentPortfolioPopup";
let SitesTypes: any = [];
let AllListId: any = {};
let IsapprovalTask = false;
let groupedComponentData: any = [];
let groupedProjectData: any = [];
let AllProjects: any = [];
let subCategories: any = [];
let AllMetadata: any = [];
let AllTaskUsers: any = [];
let siteConfig: any = [];
let loggedInUser: any = {};
let ClientCategoriesData: any = [];
let AutoCompleteItemsArray: any = [];
let FeedBackItem: any = {};
let uploadedImage: any;
let imgdefaultContent = "";
let quickCategory: any = [];
let updatedInputValue: any = ''
const CreateActivity = (props: any) => {
  const [isActive, setIsActive] = React.useState({
    siteType: false,
    time: false,
    rank: false,
    dueDate: false,
  });
  const [siteType, setSiteType] = React.useState([]);
  const [TaskTitle, setTaskTitle] = React.useState(props?.selectedItem?.Title);
  const [TaskUrl, setTaskUrl] = React.useState("");
  const [instantCategories, setInstantCategories] = React.useState([]);
  const [sendApproverMail, setSendApproverMail] = React.useState(false);
  const [ProjectManagementPopup, setProjectManagementPopup] = React.useState(false);
  const [selectedSites, setSelectedSites] = React.useState([]);
  const [CategoriesData, setCategoriesData] = React.useState<any>([]);
  const [categorySearchKey, setCategorySearchKey] = React.useState("");
  const [SearchedProjectItems, setSearchedProjectItems] = React.useState<any>([]);
  const [CMSToolComponent, setCMSToolComponent] = React.useState('');
  const [SearchedProjectKey, setSearchedProjectKey] = React.useState<any>('');
  const [selectedProjectData, setSelectedProjectData]: any = React.useState({});
  const [refreshData, setRefreshData] = React.useState(false);
  const [IsComponentPicker, setIsComponentPicker] = React.useState(false);
  // const [IsClientPopup, setIsClientPopup] = React.useState(false);
  const [FeedbackPost, setFeedbackPost] = React.useState([]);
  const [TaskCat, setTaskCat] = React.useState("");
  const [selectedItem, setSelectedItem]: any = React.useState({});
  const [TaskAssignedTo, setTaskAssignedTo] = React.useState([]);
  const [TaskTeamMembers, setTaskTeamMembers] = React.useState([]);
  const [selectPriority, setselectPriority] = React.useState("4");
  const [SearchedCategoryData, setSearchedCategoryData] = React.useState([]);
  // const [ClientCategoriesData, setClientCategoriesData] = React.useState<any>(
  //     []
  // );
  const [TaskResponsibleTeam, setTaskResponsibleTeam] = React.useState([]);
  const [editTaskPopupData, setEditTaskPopupData] = React.useState({
    isOpenEditPopup: false,
    passdata: null,
  });
  const [save, setSave] = React.useState({
    siteType: undefined,
    linkedServices: [],
    recentClick: undefined,
    Mileage: "",
    Body: [],
    DueDate: undefined,
    dueDate: "",
    taskCategory: "",
    taskCategoryParent: "",
    rank: undefined,
    taskName: "",
    taskUrl: undefined,
    portfolioType: "Component",
    Component: [],
  });
  const [siteName, setSiteName] = React.useState(false);
  const globalContextData: any = React.useContext<any>(myContextValue)

  React.useEffect(() => {
    AllListId = props?.AllListId;
    if (props?.selectedItem?.NoteCall != "Task" && props?.selectedItem?.NoteCall != "Activities") {
      setTaskTitle(`${props?.selectedItem?.NoteCall} - ${props?.selectedItem?.Title}`);
    }

    getTaskUsers();
    GetSmartMetadata();
    GetComponents();
    if (props?.pageName == "QuickTask") {
      if (props?.Title?.length > 0) {
        setTaskTitle(`Quick - ${props?.Title}`);
      } else {
        setTaskTitle("Quick Task");
      }
      if (props?.SiteUrl != undefined && props?.SiteUrl?.length > 0) {
        setTaskUrl(props?.SiteUrl);
      }
    }

    if (props?.selectedItem?.AssignedTo?.length > 0) {
      setTaskAssignedTo(props?.selectedItem?.AssignedTo);
    }
    if (props?.selectedItem?.ResponsibleTeam?.length > 0) {
      setTaskResponsibleTeam(props?.selectedItem?.ResponsibleTeam);
    } else if (props?.selectedItem?.TeamLeader?.length > 0) {
      setTaskTeamMembers(props?.selectedItem?.TeamLeader);
    }
    if (props?.selectedItem?.TeamMembers?.length > 0) {
      setTaskTeamMembers(props?.selectedItem?.TeamMembers);
    } else if (props?.selectedItem?.TeamMember?.length > 0) {
      setTaskTeamMembers(props?.selectedItem?.TeamMember);
    }
    if (props?.selectedItem?.ClientCategory?.length > 0) {
      ClientCategoriesData = props?.selectedItem?.ClientCategory;
    } else if (props?.selectedItem?.ClientCategory?.results?.length > 0) {
      ClientCategoriesData = props?.selectedItem?.ClientCategory?.results;
    }
    setSelectedItem(props?.selectedItem);
    let targetDiv: any = document?.querySelector(".ms-Panel-main");
    if (props?.selectedItem?.PortfolioType?.Color != undefined) { //Changes Made by Robin
      setTimeout(() => {
        if (targetDiv) {
          // Change the --SiteBlue variable for elements under the targetDiv
          // $('.ms-Panel-main').css('--SiteBlue', props?.selectedItem?.PortfolioType?.Color);
          $(".ms-Panel-main").css(
            "--SiteBlue",
            props?.selectedItem?.PortfolioType?.Color    //Changes Made by Robin
          );
        }
      }, 1000);
    }
  }, []);
  React.useEffect(() => {
    setTimeout(() => {
      const panelMain: any = document.querySelector(".ms-Panel-main");
      if (panelMain && props?.selectedItem?.PortfolioType?.Color) { //Changes Made by Robin
        $(".ms-Panel-main").css("--SiteBlue", props?.selectedItem?.PortfolioType?.Color); // Set the desired color value here   //Changes Made by Robin
      }
    }, 2000);
  }, [IsComponentPicker]);
  //***************** Load All task Users***************** */
  const getTaskUsers = async () => {
    if (AllListId?.TaskUsertListID != undefined) {
      let web = new Web(AllListId?.siteUrl);
      let taskUser = [];
      taskUser = await web.lists
        .getById(AllListId?.TaskUsertListID)
        .items.select(
          "Id,UserGroupId,Suffix,Title,IsTaskNotifications,IsApprovalMail,CategoriesItemsJson,technicalGroup,Email,SortOrder,Role,Company,ParentID1,Status,Item_x0020_Cover,AssingedToUserId,isDeleted,AssingedToUser/Title,AssingedToUser/Id,AssingedToUser/EMail,UserGroup/Id,ItemType,Approver/Id,Approver/Title,Approver/Name"
        )
        .top(5000)
        .expand("AssingedToUser,Approver, UserGroup")
        .get();
      try {
        taskUser?.map((user: any) => {
          if (
            props?.context?.pageContext?.legacyPageContext?.userId ==
            user?.AssingedToUser?.Id
          ) {
            loggedInUser = user;
          }
        });
      } catch (error) {
        console.log(error);
      }

      AllTaskUsers = taskUser;
    }
    // console.log("all task user =====", taskUser)
  };

  // Task User End
  //   ***************** Start Callback function for  open categories  popup ************************
  const Call = React.useCallback((item1: any, type: any) => {
    setIsComponentPicker(false);
    // setIsClientPopup(false);
    item1.map((cats2: any) => {
      cats2.ActiveTile = true
    }) // code by Anupam
    if (type == "Category-Task-Footertable") {
      setCategoriesData(item1);
    }
  }, []);
  //   ***************** End  Callback function for  open categories  popup ************************

  //  ****************** Load All Components *******************///

  const GetComponents = async () => {
    let PropsObject: any = {
      MasterTaskListID: AllListId.MasterTaskListID,
      siteUrl: AllListId.siteUrl,
      TaskUserListId: AllListId.TaskUsertListID,
    }
    let componentDetails: any = [];
    let results = await globalCommon.GetServiceAndComponentAllData(PropsObject)
    if (results?.AllData?.length > 0) {
      componentDetails = results?.AllData;
      groupedComponentData = results?.GroupByData;
      groupedProjectData = results?.ProjectData;
      AllProjects = results?.FlatProjectData
    }
    let Project :any= {};
    if (globalContextData?.tagProjectFromTable == true) {
      if (props?.UsedFrom == "ProjectManagement" && props?.selectedItem?.Id != undefined && props?.selectedItem?.Item_x0020_Type == "Sprint") {
        Project = AllProjects?.find((ProjectItem: any) => ProjectItem?.Id == props?.selectedItem?.Id);
      } else {
        Project = AllProjects?.find((ProjectItem: any) => ProjectItem?.Id == globalContextData?.ProjectLandingPageDetails?.Id);
      }
    } else if (selectedItem?.Project?.Id != undefined) {
      Project = AllProjects?.find((ProjectItem: any) => ProjectItem?.Id == selectedItem?.Project?.Id);
    }
    if(Project?.Id!=undefined){
      setSelectedProjectData(Project)
    }
    return componentDetails
  }

  const EditPortfolio = (item: any, Type: any) => {
    // if (Type == 'Component') {
    //     setIsOpenPortfolio(true);
    //     setOpenPortfolioType(Type)
    //     setCMSToolComponent(item);
    // }
    if (Type == 'Project') {
      setProjectManagementPopup(true)
      setCMSToolComponent(item);
    }
  }
  const autoSuggestionsForProject = (e: any) => {
    let SearchedKeyWord: any = e.target.value;
    let TempArray: any = [];
    if (SearchedKeyWord.length > 0) {
      if (AllProjects != undefined && AllProjects?.length > 0) {
        AllProjects?.map((AllDataItem: any) => {
          if ((AllDataItem.Path?.toLowerCase())?.includes(SearchedKeyWord.toLowerCase())) {
            TempArray.push(AllDataItem);
          }
        })
      }
      if (TempArray != undefined && TempArray.length > 0) {
        setSearchedProjectItems(TempArray);
        setSearchedProjectKey(SearchedKeyWord);
      }
    } else {
      setSearchedProjectItems([]);
      setSearchedProjectKey("");
    }
  }
  const ComponentServicePopupCallBack = React.useCallback((DataItem: any, Type: any, functionType: any) => {
    // let saveItem = save;
    if (functionType == "Close") {
      setProjectManagementPopup(false);
      // setIsOpenPortfolio(false);
    } else {
      if (DataItem != undefined && DataItem.length > 0) {
        if (DataItem[0]?.Item_x0020_Type == "Project" || DataItem[0]?.Item_x0020_Type == "Sprint") {
          setSave(prevSave => ({
            ...prevSave,
            Project: DataItem[0],
          }));
          setSelectedProjectData(DataItem[0]);
          setProjectManagementPopup(false);
          setSearchedProjectItems([]);
          setSearchedProjectKey("");
        } else {
          // setSave(prevSave => ({
          //     ...prevSave,
          //     Component: DataItem,
          //     portfolioType: "Component"
          // }));
          // let suggestedProjects = AllProjects?.filter((Projects: any) => Projects?.Portfolios?.some((port: any) => port?.Id == DataItem[0]?.Id));
          // setSuggestedProjectsOfporfolio(suggestedProjects);
          // // setSave({ ...save, Component: DataItem });
          // setSmartComponentData(DataItem);
          // selectedPortfolio = DataItem;
          // setSearchedServiceCompnentData([]);
          // setSearchedServiceCompnentKey('');
          // // selectPortfolioType('Component');
          // console.log("Popup component component ", DataItem)
          // setIsOpenPortfolio(false)
        }

      }

    }
    // setSave(saveItem);
  }, [])
  // End
  // ************** start MAIN  Get smartmetadata function main function*************************
  const GetSmartMetadata = async () => {
    SitesTypes = [];
    subCategories = [];
    var TaskTypes: any = [];
    var Task: any = [];
    let web = new Web(AllListId?.siteUrl);
    let MetaData = [];
    MetaData = await web.lists
      .getById(AllListId?.SmartMetadataListID)
      .items.select(
        "Id,Title,listId,siteUrl,siteName,Item_x005F_x0020_Cover,ParentID,Parent/Id,Parent/Title,EncodedAbsUrl,IsVisible,Created,Item_x0020_Cover,Modified,Description1,SortOrder,Selectable,TaxType,Created,Modified,Author/Name,Author/Title,Editor/Name,Editor/Title,AlternativeTitle"
      )
      .top(4999)
      .expand("Author,Editor,Parent")
      .get();
    AllMetadata = MetaData;
    siteConfig = getSmartMetadataItemsByTaxType(AllMetadata, "Sites");
    siteConfig?.map((site: any) => {
      if (
        site?.Title !== undefined &&
        site?.Title !== "Foundation" &&
        site?.Title !== "Master Tasks" &&
        site?.Title !== "DRR" &&
        site?.Title !== "Health" &&
        site?.Title !== "Gender" &&
        site?.Title !== "SP Online"
      ) {
        SitesTypes.push(site);
      }
    });
    if (SitesTypes?.length == 1) {
      setSelectedSites(SitesTypes);
      setSiteType(SitesTypes);
    } else {
      setSiteType(SitesTypes);
    }

    if (props?.SiteUrl != undefined && props?.SiteUrl?.length > 0) {
      let e = {
        target: {
          value: props?.SiteUrl
        }
      }
      setTimeout(() => {
        changeTaskUrl(e)
      }, 1200);
    }

    if (props?.selectedItem?.NoteCall == "Task") {
      SitesTypes.map((item: any) => {
        if (
          item?.Title?.toLowerCase() ==
          props?.selectedItem?.siteType?.toLowerCase()
        ) {
          setSelectedSites([item]);
        }
      });
    }
    TaskTypes = getSmartMetadataItemsByTaxType(AllMetadata, "Categories");
    quickCategory = TaskTypes?.filter((item: any) => {
      return item?.Title == "Quick";
    });
    if (props?.pageName != undefined && props?.pageName == "QuickTask") {
      setCategoriesData(quickCategory);
    }
    let instantCat: any = [];
    TaskTypes?.map((cat: any) => {
      cat.ActiveTile = false;
      getChilds(cat, TaskTypes);
      if (
        cat?.ParentID !== undefined &&
        cat?.ParentID === 0 &&
        cat?.Title !== "Phone"
      ) {
        Task.push(cat);
      }
      if (
        cat?.Title == "Phone" ||
        cat?.Title == "Email Notification" ||
        cat?.Title == "Immediate" ||
        cat?.Title == "Approval"
      ) {
        instantCat.push(cat);
      }
      if (
        cat?.Parent?.Id !== undefined &&
        cat?.Parent?.Id !== 0 &&
        cat?.IsVisible
      ) {
        subCategories.push(cat);
      }
    });
    setInstantCategories(instantCat);
    console.log(AutoCompleteItemsArray, "Auto Due Date");
    let uniqueArray: any = [];
    AutoCompleteItemsArray.map((currentObject: any) => {
      if (!uniqueArray.find((obj: any) => obj.Id === currentObject.Id)) {
        uniqueArray.push(currentObject);
      }
    });
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
      });
    });

    if (props?.pageName != undefined && props?.pageName == "QuickTask") {
      quickCategory = TaskTypes?.filter((item: any) => {
        return item?.Title == "Quick";
      });

      quickCategory.map((itms: any) => {
        itms.ActiveTile = true
      })
      setCategoriesData(quickCategory);
    } // code by Anupam

    if (loggedInUser?.IsApprovalMail?.toLowerCase() == "approve all") {
      IsapprovalTask = true;
    }
    if (IsapprovalTask == true) {
      subCategories?.map((item: any) => {
        if (item?.Title == "Approval" && !item.ActiveTile) {
          selectSubTaskCategory(item?.Title, item?.Id, item);
        }
      });
    }
    if (props?.selectedItem?.NoteCall != "Task" && props?.selectedItem?.NoteCall != "Activity") {
      subCategories?.map((item: any) => {
        if (item?.Title == props?.selectedItem?.NoteCall && !item.ActiveTile) {
          selectSubTaskCategory(item?.Title, item?.Id, item);
          if (props?.selectedItem?.NoteCall == "Development") {
            props.selectedItem.CopyNoteCall = "Development"
            props.selectedItem.NoteCall = "Activity"

          } else {
            props.selectedItem.NoteCall = "Task"
          }

        }
      });
    }
    props?.selectedItem?.NoteCall


    if (AllMetadata?.length > 0 && ClientCategoriesData?.length > 0) {
      let a: any = [];
      ClientCategoriesData?.map((cat: any) => {
        let searchedCat = AllMetadata?.find((item: any) => item.Id == cat?.Id);
        if (searchedCat) {
          a?.push(searchedCat);
        } else {
          a?.push(cat);
        }
      });
      ClientCategoriesData = a;
    }
  };
  // **************  Get smartmetadata function End *************************
  const changeTitle = (e: any) => {
    if (e.target.value.length > 56) {
      alert(
        "Task Title is too long. Please chose a shorter name and enter the details into the task description."
      );
    } else {
      setTaskTitle(e.target.value);
    }
  };
  const changeTaskUrl = (e: any) => {
    let TaskUrl = e?.target?.value;
    let saveValue = save;
    saveValue.taskUrl = TaskUrl;
    let siteFromUrl = [];
    if (SitesTypes?.length > 1) {
      let selectedSiteTitle = "";
      var testarray = e?.target?.value?.split("&");
      // TaskUrl = $scope.ComponentLink;
      var item = "";
      if (TaskUrl !== undefined) {
        if (TaskUrl.toLowerCase().indexOf(".com") > -1)
          TaskUrl = TaskUrl.split(".com")[1];
        else if (TaskUrl.toLowerCase().indexOf(".ch") > -1)
          TaskUrl = TaskUrl.split(".ch")[1];
        else if (TaskUrl.toLowerCase().indexOf(".de") > -1) {
          TaskUrl = TaskUrl.split(".de");
          try {
            if (TaskUrl[0]?.toLowerCase()?.indexOf("gruene-washington") > -1) {
              TaskUrl = TaskUrl[0];
            } else {
              TaskUrl = TaskUrl[1];
            }
          } catch (e) { }
        }
        let URLDataArr: any = TaskUrl.split("/");
        for (let index = 0; index < SitesTypes?.length; index++) {
          let site = SitesTypes[index];
          let Isfound = false;
          if (
            (TaskUrl !== undefined &&
              URLDataArr?.find(
                (urlItem: any) =>
                  urlItem?.toLowerCase() == site?.Title?.toLowerCase()
              )) ||
            (site?.AlternativeTitle != null &&
              URLDataArr?.find(
                (urlItem: any) =>
                  urlItem?.toLowerCase() ==
                  site?.AlternativeTitle?.toLowerCase()
              ))
          ) {
            item = site.Title;
            selectedSiteTitle = site.Title;
            Isfound = true;
            siteFromUrl?.push(site);
          }

          if (!Isfound) {
            if (TaskUrl !== undefined && site.AlternativeTitle != null) {
              let sitesAlterNatives =
                site.AlternativeTitle.toLowerCase().split(";");
              for (let j = 0; j < sitesAlterNatives.length; j++) {
                let element = sitesAlterNatives[j];
                if (
                  URLDataArr?.find(
                    (urlItem: any) =>
                      urlItem?.toLowerCase() == element?.toLowerCase()
                  )
                ) {
                  item = site.Title;
                  selectedSiteTitle = site.Title;
                  Isfound = true;
                }
              }
            }
          }
        }
      }

      saveValue.siteType = selectedSiteTitle;
      setSave(saveValue);
      if (selectedSiteTitle !== undefined) {
        setIsActive({ ...isActive, siteType: true });
      } else {
        setIsActive({ ...isActive, siteType: false });
      }
    }
    setSelectedSites(siteFromUrl);
    setTaskUrl(e.target.value);
  };

  // *************** START  Select Tiles Function ********************************
  const setActiveTile = (site: any) => {
    let saveItem = selectedSites;
    if (saveItem?.some((item: any) => item?.Id == site?.Id)) {
      if (selectedItem?.NoteCall == "Task") {
        if (props?.pageName != undefined && props?.pageName == 'QuickTask') {
          saveItem = [site];
        }
        else if (props?.pageName == undefined) {
          saveItem = []
        }
      } else {
        saveItem = saveItem?.filter(
          (filterValue: any) => filterValue?.Id != site?.Id
        );
      }
    } else {
      if (
        selectedItem?.NoteCall == "Task"
      ) {
        saveItem = [site];
      } else {
        saveItem?.push(site);
      }
    }
    setSelectedSites((prev) => saveItem);
    setRefreshData(!refreshData);
    setSiteType((prev) => prev);
  };
  // *************** END   Select Tiles Function ********************************
  // ****** THIS FUNCTION IS USE FOR CATROGIES AUTO SUGGESTION ************************
  const getChilds = (item: any, items: any) => {
    let parent = JSON.parse(JSON.stringify(item));
    parent.Newlabel = `${parent?.Title}`;
    AutoCompleteItemsArray.push(parent);
    parent.childs = [];
    items?.map((childItem: any) => {
      if (
        childItem?.Parent?.Id !== undefined &&
        parseInt(childItem?.Parent?.Id) === parent.ID
      ) {
        let child = JSON.parse(JSON.stringify(childItem));
        parent.childs.push(child);
        child.Newlabel = `${parent?.Newlabel} > ${child?.Title}`;
        AutoCompleteItemsArray.push(child);
        getChilds(child, items);
      }
    });
  };
  // ****** THIS FUNCTION IS USE FOR CATROGIES AUTO SUGGESTION ************************
  let getSmartMetadataItemsByTaxType = (metadataItems: any, taxType: any) => {
    var Items: any = [];
    metadataItems?.map((taxItem: any) => {
      if (taxItem.TaxType === taxType) Items.push(taxItem);
    });

    Items.sort((a: any, b: any) => {
      return a.SortOrder - b.SortOrder;
    });
    return Items;
  };
  // ****** THIS FUNCTION IS USE FOR CATROGIES AUTO SUGGESTION  END  ************************
  const onRenderCustomHeaderMain = () => {
    return (
      <>
        <div className="subheading">
          {props?.pageName == "QuickTask" || props?.pageName == 'Add Task'
            ? `Create Quick Option - Task`
            : `Create Quick Option - ${selectedItem?.NoteCall}`}
        </div>
        {props?.pageName != undefined &&
          props?.pageName == "QuickTask" ? null : (
          <Tooltip ComponentId={1746} />
        )}
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
    if (
      TeamData.ResponsibleTeam != undefined &&
      TeamData.ResponsibleTeam.length > 0
    ) {
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
    // var finalDate: any = Moment(date).format("YYYY-MM-DD");
    setSave({ ...save, DueDate: date });
  };
  const HtmlEditorCallBack = React.useCallback((EditorData: any) => {
    if (EditorData.length > 8) {
      let param: any = Moment(new Date().toLocaleString());
      FeedBackItem["Title"] = "FeedBackPicture" + param;
      FeedBackItem["FeedBackDescriptions"] = [];
      FeedBackItem.FeedBackDescriptions = [
        {
          Title: EditorData,
        },
      ];
      FeedBackItem["ImageDate"] = "" + param;
      FeedBackItem["Completed"] = "";
      setFeedbackPost([FeedBackItem]);
    }
  }, []);

  //------------Image upload function start--------------

  const FlorarImageUploadComponentCallBack = (item: any, FileName: any) => {
    imgdefaultContent = item;
    console.log(item);
    let DataObject: any = {
      fileURL: item,
      file: "Image/jpg",
      fileName: FileName,
    };
    uploadedImage = DataObject;
  };
  const onUploadImageFunction = async (postData: any) => {
    let fileName: any = "";
    let tempArray: any = [];
    let SiteUrl = AllListId?.siteUrl;
    let date = new Date();
    let timeStamp = date.getTime();
    let imageIndex = 0;
    fileName =
      "T" +
      postData.Id +
      "-Image" +
      imageIndex +
      "-" +
      postData.Title?.replace(/["/':?]/g, "")?.slice(0, 40) +
      " " +
      timeStamp +
      ".jpg";

    let ImgArray = {
      ImageName: fileName,
      UploadeDate: Moment(new Date()).format("DD/MM/YYYY"),
      ImageUrl:
        SiteUrl +
        "/Lists/" +
        postData.siteType +
        "/Attachments/" +
        postData?.Id +
        "/" +
        fileName,

      UserImage:
        loggedInUser != undefined &&
          loggedInUser.Item_x0020_Cover?.Url?.length > 0
          ? loggedInUser.Item_x0020_Cover?.Url
          : "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg",
      UserName:
        loggedInUser != undefined && loggedInUser.Title?.length > 0
          ? loggedInUser.Title
          : props.context.pageContext._user.displayName,
      Description: "",
    };
    tempArray.push(ImgArray);

    tempArray?.map((tempItem: any) => {
      tempItem.Checked = false;
    });
    // setTaskImages(tempArray);
    // UploadImageFunction(lastindexArray, fileName);

    UploadImageFunction(postData, fileName, tempArray);
  };

  const UploadImageFunction = (
    postData: any,
    imageName: any,
    DataJson: any
  ) => {
    try {
      let listId = postData.listId;

      let Id = postData.Id;
      var src = uploadedImage?.fileURL?.split(",")[1];
      var byteArray = new Uint8Array(
        atob(src)
          ?.split("")
          ?.map(function (c) {
            return c.charCodeAt(0);
          })
      );
      const data: any = byteArray;
      var fileData = "";
      for (var i = 0; i < byteArray.byteLength; i++) {
        fileData += String.fromCharCode(byteArray[i]);
      }
      setTimeout(() => {
        if (postData.listId != undefined) {
          (async () => {
            let web = new Web(AllListId?.siteUrl);
            let item = web.lists.getById(listId).items.getById(Id);
            item.attachmentFiles.add(imageName, data).then(() => {
              console.log("Attachment added");
              UpdateBasicImageInfoJSON(DataJson, "Upload", 0, postData);
              postData.UploadedImage = DataJson;
            });
          })().catch(console.log);
        }
      }, 2500);
    } catch (error) {
      console.log(error)
    }
  };

  const UpdateBasicImageInfoJSON = async (
    JsonData: any,
    usedFor: any,
    ImageIndex: any,
    postData: any
  ) => {
    var UploadImageArray: any = [];
    if (JsonData != undefined && JsonData.length > 0) {
      JsonData?.map((imgItem: any, Index: any) => {
        if (imgItem.ImageName != undefined && imgItem.ImageName != null) {
          if (
            imgItem.imageDataUrl != undefined &&
            imgItem.imageDataUrl != null
          ) {
            let TimeStamp: any = Moment(new Date().toLocaleString());
            let ImageUpdatedURL: any;
            if (usedFor == "Update" && Index == ImageIndex) {
              ImageUpdatedURL = imgItem.imageDataUrl + "?Updated=" + TimeStamp;
            } else {
              ImageUpdatedURL = imgItem.imageDataUrl;
            }
            let tempObject: any = {
              ImageName: imgItem.ImageName,
              ImageUrl: ImageUpdatedURL,
              UploadeDate: imgItem.UploadeDate,
              UserName: imgItem.UserName,
              UserImage: imgItem.UserImage,
              Description:
                imgItem.Description != undefined ? imgItem.Description : "",
            };
            UploadImageArray.push(tempObject);
          } else {
            let TimeStamp: any = Moment(new Date().toLocaleString());
            let ImageUpdatedURL: any;
            if (usedFor == "Update" && Index == ImageIndex) {
              ImageUpdatedURL = imgItem.ImageUrl + "?Updated=" + TimeStamp;
            } else {
              ImageUpdatedURL = imgItem.ImageUrl;
            }
            imgItem.Description =
              imgItem.Description != undefined ? imgItem.Description : "";
            imgItem.ImageUrl = ImageUpdatedURL;
            UploadImageArray.push(imgItem);
          }
        }
      });
    }
    if (UploadImageArray != undefined && UploadImageArray.length > 0) {
      try {
        let web = new Web(AllListId?.siteUrl);
        await web.lists
          .getById(postData.listId)
          .items.getById(postData.Id)
          .update({ BasicImageInfo: JSON.stringify(UploadImageArray) })
          .then((res: any) => {
            console.log("Image JSON Updated !!");
          });
      } catch (error) {
        console.log("Error Message :", error);
      }
    }
  };

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

  const EditComponentPicker = (item: any) => {
    setIsComponentPicker(true);
    setTaskCat(item);
  };
  //-------- Edit client categrory and categrioes open popup  fuction end ------------

  //-------------------- save function  start ---------------------
  const saveNoteCall = () => {
    if (selectedSites?.length == 0) {
      alert("Please select the site");
    } else if (TaskTitle?.length <= 0) {
      alert("Please Enter Task Title");
    } else {
      let priorityRank = 4;
      let priority = "";
      let postedCC: any = [];
      if (selectPriority === "" || parseInt(selectPriority) <= 0) {
        priority = "(2) Normal";
      } else {
        priorityRank = parseInt(selectPriority);
        if (priorityRank >= 8 && priorityRank <= 10) {
          priority = "(1) High";
        }
        if (priorityRank >= 4 && priorityRank <= 7) {
          priority = "(2) Normal";
        }
        if (priorityRank >= 1 && priorityRank <= 3) {
          priority = "(3) Low";
        }
      }
      var categoriesItem = "";
      var CategoryID: any = [];
      let AssignedToIds: any = [];
      let TeamMemberIds: any = [];
      let ResponsibleTeamIds: any = [];
      CategoriesData.map((category: any) => {
        if (category.Title != undefined) {
          categoriesItem =
            categoriesItem == ""
              ? category.Title
              : categoriesItem + ";" + category.Title;
          CategoryID.push(category.Id);
        }
        if (category.Title == "Design") {
          AssignedToIds.push(298);
          TeamMemberIds = [298];
          ResponsibleTeamIds = [49];
        }
      });

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
      if (TaskResponsibleTeam != undefined && TaskResponsibleTeam?.length > 0) {
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
                postedCC.push(val);
              } else if (
                site.Title?.toLowerCase() == val?.siteName?.toLowerCase()
              ) {
                ClientCategory.push(val?.Id);
                postedCC.push(val);
              } else if (selectedItem?.TaskType?.Title == "Workstream") {
                ClientCategory.push(val?.Id);
                postedCC.push(val);
              }
            });
          }

          if (selectedItem?.Sitestagging != undefined) {
            if (typeof selectedItem?.Sitestagging == "object") {
              if (site?.Title?.toLowerCase() == "shareweb") {

                Sitestagging = JSON.stringify(selectedItem?.Sitestagging);
              } else {

                var siteComp: any = {};
                siteComp.Title = site?.Title,
                  siteComp.localSiteComposition = true;
                siteComp.SiteImages = site?.Item_x005F_x0020_Cover?.Url;
                siteComp.ClienTimeDescription = 100,
                  //   siteComp.SiteImages = ,
                  siteComp.Date = Moment(new Date().toLocaleString()).format("MM-DD-YYYY");
                Sitestagging = JSON?.stringify([siteComp]);
              }
              // clientTime = JSON.stringify(selectedItem?.ClientTime);
            } else {
              if (site?.Title?.toLowerCase() == "shareweb") {
                var sitetag = JSON.parse(selectedItem?.Sitestagging);
                Sitestagging = JSON.stringify(sitetag);
              } else {
                var siteComp: any = {};
                siteComp.Title = site?.Title,
                  siteComp.localSiteComposition = true;
                siteComp.SiteImages = site?.Item_x005F_x0020_Cover?.Url;
                siteComp.ClienTimeDescription = 100,
                  //   siteComp.SiteImages = ,
                  siteComp.Date = Moment(new Date().toLocaleString()).format("MM-DD-YYYY");
                Sitestagging = JSON?.stringify([siteComp]);
              }
            }
          }
        } catch (error) {
          console.log(error, "CC Fetching ");
        }
        let ProjectId = null;
        if (globalContextData?.tagProjectFromTable == true) {
          if (props?.UsedFrom == "ProjectManagement" && selectedItem?.Id != undefined && selectedItem?.Item_x0020_Type == "Sprint") {
            ProjectId = selectedItem?.Id;
          } else {
            ProjectId = globalContextData?.ProjectLandingPageDetails?.Id != undefined ? globalContextData?.ProjectLandingPageDetails?.Id : null;
          }
        }
        if (selectedProjectData?.Id !== undefined) {
          ProjectId = selectedProjectData?.Id;
        }
        if (selectedItem?.NoteCall != "Task") {
          let web = new Web(AllListId?.siteUrl);
          let componentDetails: any = [];
          componentDetails = await web.lists
            .getById(site.listId)
            .items.select("Id,Title,TaskType/Id,TaskType/Title,TaskLevel")
            .expand("TaskType")
            .orderBy("TaskLevel", false)
            .filter("TaskType/Id eq 1")
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
              Title: siteName ? `${TaskTitle} - ${site?.Title}` : TaskTitle,
              Categories: categoriesItem ? categoriesItem : null,
              ProjectId: ProjectId,
              DueDate:
                save.DueDate != undefined
                  ? new Date(save.DueDate).toISOString()
                  : null,
              TaskCategoriesId: { results: CategoryID },
              ClientCategoryId: { results: ClientCategory },
              PortfolioId: props?.UsedFrom === "ProjectManagement" ? props?.taggedPortfolioItem?.Id : selectedItem?.Id,
              PriorityRank: priorityRank,
              Priority: priority,
              TaskTypeId: 1,
              FeedBack:
                FeedbackPost?.length > 0 ? JSON.stringify(FeedbackPost) : null,
              AssignedToId: {
                results:
                  AssignedToIds != undefined && AssignedToIds?.length > 0
                    ? AssignedToIds
                    : [],
              },
              ResponsibleTeamId: {
                results:
                  ResponsibleTeamIds != undefined &&
                    ResponsibleTeamIds?.length > 0
                    ? ResponsibleTeamIds
                    : [],
              },
              TeamMembersId: {
                results:
                  TeamMemberIds != undefined && TeamMemberIds?.length > 0
                    ? TeamMemberIds
                    : [],
              },
              SiteCompositionSettings: selectedItem.SiteCompositionSettings,

              Sitestagging: Sitestagging,
              TaskID: TaskID,
              TaskLevel: Tasklevel,
            })
            .then(async (res: any) => {
              let item: any = {};
              if (res?.data) {
                item = res?.data;
                item = {
                  ...item,
                  ...{
                    ClientCategory: postedCC,
                    AssignedTo: TaskAssignedTo,
                    DisplayCreateDate: moment(item.Created).format(
                      "DD/MM/YYYY"
                    ),
                    DisplayDueDate: moment(item.DueDate).format("DD/MM/YYYY"),
                    Portfolio: (props?.UsedFrom == "ProjectManagement" && props?.taggedPortfolioItem != undefined) ? props?.taggedPortfolioItem: selectedItem?.Portfolio,
                    TaskID: TaskID,
                    siteUrl: site?.siteUrl?.Url,
                    siteType: site?.Title,
                    listId: site?.listId,
                    FeedBack:
                      FeedbackPost?.length > 0
                        ? JSON.stringify(FeedbackPost)
                        : null,
                    SiteIcon: site?.Item_x005F_x0020_Cover?.Url,
                    ResponsibleTeam: TaskResponsibleTeam,
                    TeamMembers: TaskTeamMembers,
                    TeamLeader: TaskResponsibleTeam,
                    Author: {
                      Id: props?.context?.pageContext?.legacyPageContext
                        ?.userId,
                    },
                  },
                };
                if (item?.FeedBack != undefined) {
                  let DiscriptionSearchData: any = "";
                  let feedbackdata: any = JSON.parse(item?.FeedBack);
                  DiscriptionSearchData =
                    feedbackdata[0]?.FeedBackDescriptions?.map((child: any) => {
                      const childText = child?.Title?.replace(
                        /(<([^>]+)>)/gi,
                        ""
                      )?.replace(/\n/g, "");
                      const subtextText = (child?.Subtext || [])
                        ?.map((elem: any) =>
                          elem.Title?.replace(/(<([^>]+)>)/gi, "")?.replace(
                            /\n/g,
                            ""
                          )
                        )
                        .join("");
                      return childText + subtextText;
                    }).join("");
                  item.descriptionsSearch = DiscriptionSearchData;
                }
                onUploadImageFunction(item);
                if (
                  categoriesItem?.indexOf("Immediate") > -1 ||
                  categoriesItem?.indexOf("Email Notification") > -1
                ) {
                  let listID = "3BBA0B9A-4A9F-4CE0-BC15-61F4F550D556";
                  var postData = {
                    __metadata: {
                      type: "SP.Data.ImmediateNotificationsListItem",
                    },
                    Title: TaskTitle,
                    TaskId: TaskID,
                    Site: site?.Title,
                  };
                  await globalCommon.addData(
                    AllListId?.siteUrl,
                    listID,
                    postData
                  );
                  await globalCommon
                    ?.sendImmediateEmailNotifications(
                      item?.Id,
                      site?.siteUrl?.Url,
                      site?.listId,
                      item,
                      undefined,
                      "Immediate",
                      AllTaskUsers,
                      props?.context
                    )
                    .then((response: any) => {
                      console.log(response);
                    });
                }
                if (categoriesItem?.indexOf("Design") > -1) {
                  setSendApproverMail(true);
                  await globalCommon
                    ?.sendImmediateEmailNotifications(
                      item?.Id,
                      site?.siteUrl?.Url,
                      site?.listId,
                      item,
                      undefined,
                      "DesignMail",
                      AllTaskUsers,
                      props?.context
                    )
                    .then((response: any) => {
                      console.log(response);
                    });
                }
                if (categoriesItem?.indexOf("Approval") > -1) {
                  setSendApproverMail(true);
                  await globalCommon
                    ?.sendImmediateEmailNotifications(
                      item?.Id,
                      site?.siteUrl?.Url,
                      site?.listId,
                      item,
                      undefined,
                      "ApprovalMail",
                      AllTaskUsers,
                      props?.context
                    )
                    .then((response: any) => {
                      console.log(response);
                    });
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
                props.Call("Close");
                let url = `${AllListId.siteUrl}/SitePages/Task-Profile.aspx?taskId=${res.data.Id}&Site=${res.data.siteType}`;
                window.open(url, "_blank");
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
            selectedItem?.TaskType === "Workstream"
          ) {
            TaskID = selectedItem?.TaskID + "-T" + LatestId;
          } else {
            TaskID = "T" + LatestId;
          }

          if (
            selectedItem?.TaskType?.Title == "Workstream" ||
            selectedItem?.TaskType === "Workstream"
          ) {
            var PortfolioData = selectedItem?.Portfolio?.Id;
            var ParentData = selectedItem?.Id;
          } else {
            var PortfolioData = selectedItem?.Id;
          }
          let clientTime: any;
          if (selectedItem?.Sitestagging != undefined) {
            if (typeof selectedItem?.Sitestagging == "object") {
              if (site?.Title?.toLowerCase() == "shareweb") {
                clientTime = JSON.stringify(selectedItem?.Sitestagging);
              } else {
                var siteComp: any = {};
                siteComp.Title = site?.Title,
                  siteComp.localSiteComposition = true;
                siteComp.SiteImages = site?.Item_x005F_x0020_Cover?.Url;
                siteComp.ClienTimeDescription = 100,
                  //   siteComp.SiteImages = ,
                  siteComp.Date = Moment(new Date().toLocaleString()).format("MM-DD-YYYY");
                clientTime = JSON?.stringify([siteComp]);
              }
              // clientTime = JSON.stringify(selectedItem?.ClientTime);
            } else {
              if (site?.Title?.toLowerCase() == "shareweb") {
                var sitetag = JSON.parse(selectedItem?.Sitestagging);
                clientTime = JSON.stringify(sitetag);
              } else {
                var siteComp: any = {};
                siteComp.Title = site?.Title,
                  siteComp.localSiteComposition = true;
                siteComp.SiteImages = site?.Item_x005F_x0020_Cover?.Url;
                siteComp.ClienTimeDescription = 100,
                  siteComp.Date = Moment(new Date().toLocaleString()).format("MM-DD-YYYY");
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
              ComponentLink: {
                __metadata: { type: "SP.FieldUrlValue" },
                Description: TaskUrl?.length > 0 ? TaskUrl : null,
                Url: TaskUrl?.length > 0 ? TaskUrl : null,
              },
              ProjectId: ProjectId,
              Categories: categoriesItem ? categoriesItem : null,
              PriorityRank: priorityRank,
              Priority: priority,
              // DueDate: date != undefined ? new Date(date).toDateString() : date,
              DueDate:
                save?.DueDate != undefined
                  ? new Date(save.DueDate).toISOString()
                  : null,
              TaskCategoriesId: { results: CategoryID },
              PortfolioId: (props?.UsedFrom == "ProjectManagement" && props?.taggedPortfolioItem != undefined) ? props?.taggedPortfolioItem?.Id: PortfolioData,
              ParentTaskId: ParentData != undefined ? ParentData : null,
              ClientCategoryId: { results: ClientCategory },
              FeedBack:
                FeedbackPost?.length > 0 ? JSON.stringify(FeedbackPost) : null,
              AssignedToId: {
                results:
                  AssignedToIds != undefined && AssignedToIds?.length > 0
                    ? AssignedToIds
                    : [],
              },
              ResponsibleTeamId: {
                results:
                  ResponsibleTeamIds != undefined &&
                    ResponsibleTeamIds?.length > 0
                    ? ResponsibleTeamIds
                    : [],
              },
              TeamMembersId: {
                results:
                  TeamMemberIds != undefined && TeamMemberIds?.length > 0
                    ? TeamMemberIds
                    : [],
              },
              SiteCompositionSettings:
                selectedItem?.SiteCompositionSettingsbackup != undefined
                  ? JSON.stringify(selectedItem?.SiteCompositionSettingsbackup)
                  : null,
              Sitestagging:
                clientTime != undefined
                  ? clientTime
                  : Sitestagging != undefined
                    ? Sitestagging
                    : null,
              TaskID: TaskID,
              TaskTypeId: 2,
              TaskType: {
                Title: "Task",
                Id: 2,
              },
            })
            .then(async (res: any) => {
              let item: any = {};
              if (res?.data) {
                item = res?.data;
                item = {
                  ...item,
                  ClientCategory: postedCC,
                  AssignedTo: TaskAssignedTo,
                  DisplayCreateDate: moment(item.Created).format("DD/MM/YYYY"),
                  DisplayDueDate: moment(item.DueDate).format("DD/MM/YYYY"),
                  Portfolio: selectedItem?.Portfolio,
                  siteUrl: site?.siteUrl?.Url,
                  siteType: site?.Title,
                  listId: site?.listId,
                  SiteIcon: site?.Item_x005F_x0020_Cover?.Url,
                  ResponsibleTeam: TaskResponsibleTeam,
                  FeedBack:
                    FeedbackPost?.length > 0
                      ? JSON.stringify(FeedbackPost)
                      : null,
                  TeamMembers: TaskTeamMembers,
                  TeamLeader: TaskResponsibleTeam,
                  Author: {
                    Id: props?.context?.pageContext?.legacyPageContext?.userId,
                  },
                  Item_x0020_Type: "Task",
                  ParentTask: selectedItem,
                  TaskType: {
                    Title: "Task",
                    Id: 2,
                  },
                };

                if (item?.FeedBack != undefined) {
                  let DiscriptionSearchData: any = "";
                  let feedbackdata: any = JSON.parse(item?.FeedBack);
                  DiscriptionSearchData =
                    globalCommon.descriptionSearchData(feedbackdata);
                }
                // item.TaskID = globalCommon?.GetTaskId(item);
                onUploadImageFunction(item);
                if (
                  categoriesItem?.indexOf("Immediate") > -1 ||
                  categoriesItem?.indexOf("Email Notification") > -1
                ) {
                  let listID = "3BBA0B9A-4A9F-4CE0-BC15-61F4F550D556";
                  var postData = {
                    __metadata: {
                      type: "SP.Data.ImmediateNotificationsListItem",
                    },
                    Title: TaskTitle,
                    TaskId: TaskID,
                    Site: site?.Title,
                  };
                  await globalCommon.addData(
                    AllListId?.siteUrl,
                    listID,
                    postData
                  );
                  await globalCommon
                    ?.sendImmediateEmailNotifications(
                      item?.Id,
                      site?.siteUrl?.Url,
                      site?.listId,
                      item,
                      undefined,
                      "Immediate",
                      AllTaskUsers,
                      props?.context
                    )
                    .then((response: any) => {
                      console.log(response);
                    });
                }
                if (categoriesItem?.indexOf("Design") > -1) {
                  setSendApproverMail(true);
                  await globalCommon
                    ?.sendImmediateEmailNotifications(
                      item?.Id,
                      site?.siteUrl?.Url,
                      site?.listId,
                      item,
                      undefined,
                      "DesignMail",
                      AllTaskUsers,
                      props?.context
                    )
                    .then((response: any) => {
                      console.log(response);
                    });
                }
                if (categoriesItem?.indexOf("Approval") > -1) {
                  setSendApproverMail(true);
                  await globalCommon
                    ?.sendImmediateEmailNotifications(
                      item?.Id,
                      site?.siteUrl?.Url,
                      site?.listId,
                      item,
                      undefined,
                      "ApprovalMail",
                      AllTaskUsers,
                      props?.context
                    )
                    .then((response: any) => {
                      console.log(response);
                    });
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
                window.open(url, "_blank");
              } else if (selectedItem.PageType == "QuickTask") {
                let url = `${AllListId.siteUrl}/SitePages/Task-Profile.aspx?taskId=${res.data.Id}&Site=${res.data.siteType}`;
                window.open(url, "_blank");
              } else {
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
    imgdefaultContent = "";
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

  const selectSubTaskCategory = (title: any, Id: any, item: any) => {
    setCategorySearchKey("");
    setIsComponentPicker(false);
    setSearchedCategoryData([]);
    if (
      loggedInUser?.IsApprovalMail?.toLowerCase() ==
      "approve all but selected items" ||
      (loggedInUser?.IsApprovalMail?.toLowerCase() == "approve selected" &&
        !IsapprovalTask)
    ) {
      try {
        let selectedApprovalCat = JSON.parse(loggedInUser?.CategoriesItemsJson);
        IsapprovalTask = selectedApprovalCat?.some(
          (selectiveApproval: any) => selectiveApproval?.Title == title
        );
        if (IsapprovalTask == true) {
          subCategories?.map((item: any) => {
            if (item?.Title == "Approval" && !item.ActiveTile) {
              selectSubTaskCategory(item?.Title, item?.Id, item);
            }
          });
        }
      } catch (error: any) {
        console.log(error, "Can't Parse Selected Approval Categories");
      }
    }

    let TaskCategories: any[] = CategoriesData;
    if (item.ActiveTile) {
      if (IsapprovalTask && title == "Approval") {
        console.log("");
      } else {
        item.ActiveTile = !item.ActiveTile;
        TaskCategories = TaskCategories.filter(
          (category: any) => category?.Id !== Id
        );
        if (
          loggedInUser?.IsApprovalMail?.toLowerCase() ==
          "approve all but selected items" ||
          (loggedInUser?.IsApprovalMail?.toLowerCase() == "approve selected" &&
            IsapprovalTask)
        ) {
          try {
            let selectedApprovalCat = JSON.parse(
              loggedInUser?.CategoriesItemsJson
            );
            IsapprovalTask = !selectedApprovalCat?.some(
              (selectiveApproval: any) => selectiveApproval?.Title == title
            );
            subCategories?.map((item: any) => {
              if (item?.Title == "Approval" && item.ActiveTile) {
                selectSubTaskCategory(item?.Title, item?.Id, item);
              }
            });
          } catch (error: any) {
            console.log(error, "Can't Parse Selected Approval Categories");
          }
        }
      }
    } else if (!item.ActiveTile) {
      if (
        title === "Email Notification" ||
        title === "Immediate" ||
        title === "Bug"
      ) {
        setselectPriority("10");
        handleDatedue(new Date());
      }
      if (title == "Feedback" || title == "Quality Control") {
        var flag = true;
        let AssignedToUsers: any = [];
        AllTaskUsers?.map((User: any) => {
          if (User.Role == "QA") {
            AssignedToUsers.filter((item: any) => item != User.Id);
            AssignedToUsers.push(User.Id);
            flag = false;
          }
        });
      }
      if (title?.indexOf("Design") > -1) {
        let AssignedToUsers: any = [];
        var flag = true;
        AllTaskUsers?.map((User: any) => {
          if (User.Role == "Developer" && User.Title == "Design Team") {
            AssignedToUsers.filter((item: any) => item != User.Id);
            AssignedToUsers.push(User);
            flag = false;
          }
        });
      }
      if (title?.indexOf("Support") > -1) {
        var flag = true;
        let AssignedToUsers: any = [];
        AllTaskUsers?.map((User: any) => {
          if (User.Role == "Developer" && User.Title == "Support") {
            AssignedToUsers.filter((item: any) => item?.Id != User.Id);
            AssignedToUsers.push(User);
            flag = false;
          }
        });
        setTaskAssignedTo(AssignedToUsers);
      }
      item.ActiveTile = !item.ActiveTile;
      TaskCategories.push(item);
    }
    setInstantCategories((CategoriesData: any) =>
      CategoriesData?.map((selectCAT: any) => {
        if (selectCAT?.Id === item?.Id) {
          return item;
        }
        return selectCAT; // Return the original value if no change is needed
      })
    );

    setCategoriesData(TaskCategories);
  };
  const ExampleCustomInput = React.forwardRef(
    ({ value, onClick }: any, ref: any) => (
      <div style={{ position: "relative" }} onClick={onClick} ref={ref}>
        <input
          type="text"
          id="datepicker"
          className="form-control date-picker ps-2"
          placeholder="DD/MM/YYYY"
          defaultValue={value}
        />
        <span
          style={{
            position: "absolute",
            top: "58%",
            right: "22px",
            transform: "translateY(-50%)",
            cursor: "pointer",
          }}
        >
          <span className="svg__iconbox svg__icon--calendar"></span>
        </span>
      </div>
    )
  );

  const handleSiteNameClick = () => {
    setSiteName(!siteName);
  };

  const onRenderMainHtml = (
    <>
      <div className="modal-body">
        {siteType?.length > 1 &&
          selectedItem?.TaskType?.Title != "Workstream" ? (
          <div className="col mt-4">
            <h4 className="titleBorder ">Websites</h4>
            <div className="clearfix p-0">
              <ul className="site-actions">
                {siteType?.map((item: any) => {
                  return (
                    <>
                      {item.Title !== undefined &&
                        item.Title !== "Offshore Tasks" &&
                        item.Title !== "Master Tasks" &&
                        item.Title !== "DRR" &&
                        item.Title !== "SDC Sites" &&
                        item.Title !== "QA" && (
                          <>
                            <li
                              className={
                                selectedSites?.some(
                                  (selectedSite: any) =>
                                    selectedSite?.Id == item?.Id
                                )
                                  ? "bgtile active text-center position-relative"
                                  : "position-relative bgtile text-center"
                              }
                              onClick={() => setActiveTile(item)}
                            >
                              {/*  */}
                              <a
                                className={
                                  refreshData
                                    ? " text-decoration-none ikkkkddd"
                                    : " text-decoration-none lkjhgfdsa"
                                }
                              >
                                <span className="icon-sites">
                                  {item.Item_x005F_x0020_Cover != undefined && (
                                    <img
                                      className="icon-sites"
                                      src={item.Item_x005F_x0020_Cover.Url}
                                    />
                                  )}
                                </span>
                                {item.Title}
                              </a>
                            </li>
                          </>
                        )}
                    </>
                  );
                })}
              </ul>
            </div>
          </div>
        ) : (
          ""
        )}
        <div className="row">
          <div className="col-sm-10">
            <div className="row">
              <div className="col-sm-10 mb-10 mt-3">
                <div className="input-group">
                  <label className="full-width">
                    Task Name{" "}
                    {selectedItem?.NoteCall != "Task" && props?.pageName == undefined && selectedSites.length >= 1 ? (
                      <span
                        className={siteName ? "siteColor fw-bold" : null}
                        onClick={handleSiteNameClick}
                      >
                        | SiteName
                      </span>
                    ) : null}
                  </label>
                  <input
                    type="text"
                    placeholder="Enter task Name"
                    className="form-control"
                    value={TaskTitle}
                    onChange={(e) => {
                      changeTitle(e);
                    }}
                  ></input>
                </div>
              </div>
              <div className="col-sm-2 mb-10 padL-0 mt-3">
                <div className="input-group">
                  <label className="full-width">Due Date</label>
                  <DatePicker
                    selected={save?.DueDate}
                    onChange={(date) => handleDatedue(date)}
                    dateFormat="dd/MM/yyyy"
                    minDate={new Date()}
                    customInput={<ExampleCustomInput />}
                    isClearable
                    showYearDropdown
                    scrollableYearDropdown
                  />
                </div>
              </div>
            </div>
            {props?.pageName == "QuickTask" && props?.pageName != undefined ? (
              <div className="row">
                <div className="input-group">
                  <div className="col-sm-12">
                    <label className="full-width">URL</label>
                    <input
                      type="text"
                      placeholder="Enter Url"
                      className="form-control"
                      value={TaskUrl}
                      onChange={(e) => {
                        changeTaskUrl(e);
                      }}
                    ></input>
                  </div>
                </div>
              </div>
            ) : null}
            <div className="row mt-3">
              <TeamConfigurationCard
                ItemInfo={
                  props?.pageName != undefined && (props?.pageName == "QuickTask" || props?.pageName == 'Add Task')
                    ? props?.selectedItem
                    : selectedItem
                }
                AllListId={
                  props?.pageName != undefined && (props?.pageName == "QuickTask" || props?.pageName == 'Add Task')
                    ? props?.AllListId
                    : AllListId
                }
                parentCallback={DDComponentCallBack}
              ></TeamConfigurationCard>
            </div>
            <div className="row mt-3">
              <div className="col-sm-5">
                {/* <FroalaImageUploadComponent 
                                     callBack={copyImage} /> */}
                <div
                  className="Florar-Editor-Image-Upload-Container"
                  id="uploadImageFroalaEditor"
                >
                  <div>
                    <FlorarImageUploadComponent
                      callBack={FlorarImageUploadComponentCallBack}
                      defaultContent={imgdefaultContent}
                    />
                  </div>
                </div>
              </div>
              <div className="col-sm-7 ps-0">
                <HtmlEditorCard
                  editorValue={save?.Body != undefined ? save?.Body : ""}
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

                  <ul className="p-0 mt-1 list-none">
                    <li className="SpfxCheckRadio">
                      <input
                        className="radio"
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
                    <li className="SpfxCheckRadio">
                      <input
                        className="radio"
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
                    <li className="SpfxCheckRadio">
                      <input
                        className="radio"
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
                    <span
                      onClick={() => EditComponentPicker(selectedItem)}
                      title="Edit Categories"
                      className="hreflink svg__iconbox svg__icon--editBox"
                    ></span>
                  </span>
                   {SearchedCategoryData?.length > 0 ? (
                  <div className="SmartTableOnTaskPopup">
                    <ul className="list-group">
                      {SearchedCategoryData.map((item: any) => {
                        return (
                          <li
                            className="hreflink list-group-item rounded-0 list-group-item-action"
                            key={item.id}
                            onClick={
                              () =>
                                selectSubTaskCategory(
                                  item?.Title,
                                  item?.Id,
                                  item
                                )
                              // setSelectedCategoryData([item], "For-Auto-Search")
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
                {instantCategories?.map((item: any) => {
                  return (
                    <div className="form-check">
                      <input
                        className="form-check-input rounded-0"
                        type="checkbox"
                        checked={CategoriesData?.some(
                          (selectedCat: any) => selectedCat?.Id == item?.Id
                        )}
                        onClick={() =>
                          selectSubTaskCategory(item?.Title, item?.Id, item)
                        }
                      />
                      <label>{item?.Title}</label>
                    </div>
                  );
                })}
               
              </div>
              {CategoriesData != undefined ? (
                <div>
                  {CategoriesData?.map((type: any, index: number) => {
                    return (
                      <>
                        {!instantCategories?.some(
                          (selectedCat: any) =>
                            selectedCat?.Title == type?.Title
                        ) && (
                            <div className="block alignCenter">
                              <a
                                className="wid90"
                                style={{ color: "#fff !important" }}
                                target="_blank"
                                data-interception="off"
                              >
                                {type?.Title}
                              </a>
                              <span className="light svg__iconbox svg__icon--cross"
                                onClick={() =>
                                  selectSubTaskCategory(
                                    type?.Title,
                                    type?.Id,
                                    type
                                  )
                                }
                              ></span>
                              {/* <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/_layouts/images/delete.gif" onClick={() => deleteCategories(type?.Id)} className="p-1" /> */}
                            </div>
                          )}
                      </>
                    );
                  })}
                </div>
              ) : null}
            </div>
            <div className='mt-2'>
              <div className="input-group mb-2">
                <label className="form-label full-width">
                  Project
                </label>
                {selectedProjectData?.Id != undefined ? (
                  <span className="full-width">
                    <div className="full-width replaceInput pe-0 alignCenter" style={{ width: '90%' }}>
                      <a title={selectedProjectData?.Title} target="_blank" data-interception="off" className="textDotted"
                        href={`${AllListId?.siteUrl}/SitePages/PX-Profile.aspx?ProjectId=${selectedProjectData?.ID}`} >
                        {selectedProjectData?.Title}
                      </a>
                      <span title="Remove Project" onClick={() => { setSelectedProjectData({}) }}
                        style={{ backgroundColor: 'black' }} className="svg__iconbox svg__icon--cross hreflink mx-2"></span>
                    </div>

                  </span>
                ) : (<input type="text" className="form-control" value={SearchedProjectKey}
                  onChange={(e) => autoSuggestionsForProject(e)} placeholder="Search Project/Sprints" />)}
                <span className="input-group-text">
                  <span title="Component Popup" onClick={(e) => EditPortfolio(save, 'Project')}
                    className="svg__iconbox svg__icon--editBox"></span>
                </span>
                {SearchedProjectItems?.length > 0 ? (
                  <div className="SmartTableOnTaskPopup">
                    <ul className="autosuggest-list maXh-200 scrollbar list-group">
                      {SearchedProjectItems.map((Item: any) => {
                        return (
                          <li className='hreflink list-group-item rounded-0 p-1 list-group-item-action' key={Item.id} onClick={() => ComponentServicePopupCallBack([Item], undefined, undefined)} >
                            <a>{Item.Path}</a>
                          </li>
                        )
                      }
                      )}
                    </ul>
                  </div>) : null}
              </div>



            </div>
          </div>
        </div>
      </div>
      <footer
        className={
          refreshData ? "col text-end mt-3 lkjhgfds" : "col text-end mt-3 kkkkk"
        }
      >
        {selectedSites?.map((site: any) => {
          return (
            <span className="ms-2">
              {site.Item_x005F_x0020_Cover !== undefined &&
                site.Item_x005F_x0020_Cover?.Url !== undefined && (
                  <img
                    className={
                      refreshData
                        ? "createTask-SiteIcon me-1 rdfgererg"
                        : "createTask-SiteIcon me-1 erfrerg"
                    }
                    style={{ width: "31.5px" }}
                    title={site?.Title}
                    src={site.Item_x005F_x0020_Cover.Url}
                  />
                )}
            </span>
          );
        })}
        <button
          type="button"
          className="btn btn-primary ms-2"
          onClick={() => saveNoteCall()}
        >
          Submit
        </button>
        {props?.pageName != "QuickTask" ? <button
          type="button"
          className="btn btn-default ms-2"
          onClick={() => closeTaskStatusUpdatePoup("item")}
        >
          Cancel
        </button> : ''}
      </footer>
    </>
  );

  return (
    <>
      {props?.pageName == "QuickTask" ? (
          <>

            <h2 className="heading">
              {props?.pageName == "QuickTask"
                ? `Create Quick Option - Task`
                : `Create Quick Option - ${selectedItem?.NoteCall}`}
            </h2>

            {onRenderMainHtml}
          </>
      ) : (
        <Panel
          onRenderHeader={onRenderCustomHeaderMain}
          type={PanelType.large}
          isOpen={true}
          onDismiss={() => closePopup("item")}
          isBlocking={false}
          // hasCloseButton={true}
          className={`${props?.selectedItem?.PortfolioType?.Color} widthPanel`} //Changes Made by Robin
        >
          <div>
            <>{onRenderMainHtml}</>
          </div>
        </Panel>
      )}
      {ProjectManagementPopup && (
        <ServiceComponentPortfolioPopup
          props={CMSToolComponent}
          Dynamic={AllListId}
          Call={ComponentServicePopupCallBack}
          selectionType={"Single"}
          groupedData={groupedProjectData}
          showProject={ProjectManagementPopup}
        />
      )}
      {IsComponentPicker && (
        <Picker
          props={TaskCat}
          selectedCategoryData={CategoriesData}
          usedFor="Task-Footertable"
          AllListId={AllListId}
          Call={Call}
        ></Picker>
      )}
    </>
  );
};

export default CreateActivity;
