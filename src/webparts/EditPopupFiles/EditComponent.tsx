import * as React from "react";
import { Panel, PanelType, DefaultButton } from "office-ui-fabric-react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/js/dist/modal.js";
import "bootstrap/js/dist/tab.js";
import * as moment from "moment";
import { Web } from "sp-pnp-js";
import CommentCard from "../../globalComponents/Comments/CommentCard";
import * as globalCommon from "../../globalComponents/globalCommon";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { map } from "lodash";
import "react-datepicker/dist/react-datepicker.css";
import Picker from "../../globalComponents/EditTaskPopup/SmartMetaDataPicker";
import ServiceComponentPortfolioPopup from "../../globalComponents/EditTaskPopup/ServiceComponentPortfolioPopup";
import { EditorState } from "draft-js";
import HtmlEditorCard from "../../globalComponents/HtmlEditor/HtmlEditor";
import TeamConfigurationCard from "./TeamConfigurationPortfolio";
import Tooltip from "../../globalComponents/Tooltip";
import VersionHistoryPopup from "../../globalComponents/VersionHistroy/VersionHistory";
import CentralizedSiteComposition from "../../globalComponents/SiteCompositionComponents/CentralizedSiteComposition";

import ImagesC from "./ImageInformation";
import { SlArrowDown, SlArrowRight } from "react-icons/sl";
import Smartmetadatapickerin from "../../globalComponents/Smartmetadatapickerindependent/SmartmetadatapickerSingleORMulti";
import { EditableField } from "../componentProfile/components/Portfoliop";
var PostTechnicalExplanations = "";
var PostHelp_x0020_Information = "";
var PostQuestionDescription = "";
var PostDeliverables = "";
let PortfolioTypeColor: any = "";
var PostShort_x0020_Description_x0020_On = "";
var PostBody = "";
var AllUsers: any = [];
var Assin: any = [];
var AssignedToIds: any = [];
var GlobalServiceAndComponentData: any = [];
var ResponsibleTeamIds: any = [];
var SiteTypeBackupArray: any = [];
var TeamMemberIds: any = [];
var Backupdata: any = [];
var BackupCat: any = "";
let web: any = "";
let RequireData: any = {};
var selectedClientCategoryData: any = [];
var AllClientCategoryDataBackup: any = [];
let AutoCompleteItemsArray: any = [];
var AllClientCategory: any = [];
let smartmetaDetails: any = [];
let ShowCategoryDatabackup: any = [];
let subCategories: any = [];
let IsapprovalTask = false;
let CategoryAllData: any = [];
let mydata: any = [];
let componentDetailsData: any = [];
let count = 0;
let ID: any;

function EditInstitution({ item, SelectD, Calls, usedFor, portfolioTypeData, }: any) {
  // var AssignedToIds: any = [];
  ResponsibleTeamIds = [];
  AssignedToIds = [];
  TeamMemberIds = [];
  if (SelectD != undefined && SelectD?.siteUrl != undefined) {
    web = new Web(SelectD?.siteUrl);
    RequireData = SelectD;
  } else {
    if (item?.siteUrl != undefined) {
      web = new Web(item?.siteUrl);
    }
    RequireData = SelectD.SelectedProp;
    web = new Web(RequireData?.siteUrl);
  }
  let categoryitem: any = [];
  if (item.Categories != undefined) {
    categoryitem = item.Categories.split(";");
  }
  //
  // smart fetaure data
  const [Smartdatapopup, setSmartdatapopup] = React.useState(false);
  const [Smartdata, setSmartdata] = React.useState([]);
  const [CompoenetItem, setComponent] = React.useState([]);
  const [changeType, setChangeType] = React.useState(false);
  const [selectPortfolioType, setSelectPortfolioType]: any = React.useState({
    Title: item?.PortfolioType?.Title,
  });
  const [SmartHelpDetails, setSmartHelpDetails] = React.useState<any>([]);
  const [update, setUpdate] = React.useState(0);
  const [isDropItem, setisDropItem] = React.useState(false);
  const [isDropItemRes, setisDropItemRes] = React.useState(false);
  const [EditData, setEditData] = React.useState<any>({});
  const [modalIsOpen, setModalIsOpen] = React.useState(false);
  const [CMSItemRank, setCMSItemRank] = React.useState([]);
  const [isOpenPicker, setIsOpenPicker] = React.useState(false);
  const [IsComponent, setIsComponent] = React.useState(false);
  const [isopenProjectpopup, setisopenProjectpopup] = React.useState(false);
  const [CMSToolComponent, setCMSToolComponent] = React.useState("");
  const [TaskCat, setTaskCat] = React.useState("");
  const [CollapseExpend, setCollapseExpend] = React.useState(true);
  let [CategoriesData, setCategoriesData] = React.useState([]);
  const TeamConfigInfo = item;
  const [smartComponentData, setSmartComponentData] = React.useState([]);
  const [TeamConfig, setTeamConfig] = React.useState();
  const [date, setDate] = React.useState(undefined);
  const [siteDetails, setsiteDetails] = React.useState([]);
  const [checkedCat, setcheckedCat] = React.useState(false);
  const [linkedComponentData, setLinkedComponentData] = React.useState([]);
  const [TaskAssignedTo, setTaskAssignedTo] = React.useState([]);
  const [TaskTeamMembers, setTaskTeamMembers] = React.useState([]);
  const [TaskResponsibleTeam, setTaskResponsibleTeam] = React.useState([]);
  const [filterdata, setfilterData] = React.useState([]);
  const [Completiondate, setCompletiondate] = React.useState(undefined);
  const [AssignUser, setAssignUser] = React.useState(undefined);
  const [allProjectData, SetAllProjectData] = React.useState([]);
  const [SearchedServiceCompnentData, setSearchedServiceCompnentData] =
    React.useState<any>([]);
  const [searchedProjectData, setSearchedProjectData] = React.useState([]);
  const [IsComponentPicker, setIsComponentPicker] = React.useState(false);
  const [IsService, setIsService] = React.useState(false);
  const [editorState, setEditorState] = React.useState(
    EditorState.createEmpty()
  );
  const [selectedClientCategory, setSelectedClientCategory] = React.useState(
    []
  );
  const [ParentData, SetParentData] = React.useState([]);
  const [SiteTypes, setSiteTypes] = React.useState([]);
  const [EnableSiteCompositionValidation, setEnableSiteCompositionValidation] =
    React.useState(false);
  const [SiteCompositionSetting, setSiteCompositionSetting] = React.useState(
    []
  );
  const [SiteTaggingData, setSiteTaggingData] = React.useState([]);
  // For Status
  const [PhoneStatus, setPhoneStatus] = React.useState(false);

  const [EmailStatus, setEmailStatus] = React.useState(false);

  const [ImmediateStatus, setImmediateStatus] = React.useState(false);

  const [ApprovalStatus, setApprovalStatus] = React.useState(false);
  const [AllCategoryData, setAllCategoryData] = React.useState([]);
  const [categorySearchKey, setCategorySearchKey] = React.useState("");
  const [SearchedCategoryData, setSearchedCategoryData] = React.useState([]);
  const [imagetab, setImagetab] = React.useState(false);
  const [instantCategories, setInstantCategories] = React.useState([]);
  const [openPopup, setOpenPopup] = React.useState(false);
  const [isOpenPopup, setIsOpenPopup] = React.useState(false);
  const [editPopup, setEditPopup] = React.useState(false);
  const [editHelpPopup, setEditHelpPopup] = React.useState(false);
  const [choice, setChoice] = React.useState("");
  const [question, setQuestion] = React.useState("");
  const [help, setHelp] = React.useState("");
  const [dataUpdate, setDataUpdate] = React.useState<any>();
  const [helpDataUpdate, setHelpDataUpdate] = React.useState<any>();
  //    for the verified
  const [shortDescriptionVerifieds, setShortDescriptionVerifieds] =
    React.useState(false); // State to manage checkbox status
  const [descriptionVerifieds, setdescriptionVerifieds] = React.useState(false);
  const [BackgroundVerifieds, setBackgroundVerifieds] = React.useState(false);
  const [IdeaVerifieds, setIdeaVerifieds] = React.useState(false);
  const [ValueAddedVerifieds, setValueAddedVerifieds] = React.useState(false);
  const [DeliverablesVerifieds, setDeliverablesVerifieds] =
    React.useState(false);
  const [TechnicalExplanationsVerifieds, setTechnicalExplanationsVerifieds] =
    React.useState(false);
  const [HelpInformationVerifieds, setHelpInformationVerifieds] =
    React.useState(false);

  const [SiteCompositionShow, setSiteCompositionShow] = React.useState(false);
  const [composition, setComposition] = React.useState(true);
  const [FeatureTypeData, setFeatureTypeData] = React.useState([]);
  const [autoSearchFeatureType, setAutoSearchFeatureType] = React.useState([]);
  const [percentComplete, setPercentComplete]: any = React.useState();
  const [searchFeatureType, setSearchFeatureType] = React.useState([]);

  const handleCheckboxChange = () => {
    setShortDescriptionVerifieds((prevChecked: any) => !prevChecked);
  };
  const handleCheckboxChangedescription = () => {
    setdescriptionVerifieds((prevChecked: any) => !prevChecked);
  };
  const handleCheckboxBackground = () => {
    setBackgroundVerifieds((prevChecked: any) => !prevChecked);
  };
  const handleCheckboxIdea = () => {
    setIdeaVerifieds((prevChecked: any) => !prevChecked);
  };
  const handleCheckboxValueAdded = () => {
    setValueAddedVerifieds((prevChecked: any) => !prevChecked);
  };
  const handleCheckboxDeliverables = () => {
    setDeliverablesVerifieds((prevChecked: any) => !prevChecked);
  };
  const getPlainTextFromHTML = (htmlString: any) => {
    const temporaryElement = document.createElement("div");
    temporaryElement.innerHTML = htmlString;
    const plainText = temporaryElement.innerText.replace(/\n/g, "");
    return plainText;
  };
  const handleCheckboxTechnicalExplanations = () => {
    setTechnicalExplanationsVerifieds((prevChecked: any) => !prevChecked);
  };
  const handleCheckboxHelpInformation = () => {
    setHelpInformationVerifieds((prevChecked: any) => !prevChecked);
  };

  function imageta() {
    setImagetab(true);
  }
  // End of Status
  const setModalIsOpenToTrue = (e: any) => {
    setModalIsOpen(true);
    let targetDiv: any = document?.querySelector(".ms-Panel-main");
    setTimeout(() => {
      if (targetDiv && PortfolioTypeColor?.length > 0) {
        // Change the --SiteBlue variable for elements under the targetDiv
        targetDiv?.style?.setProperty("--SiteBlue", PortfolioTypeColor); // Change the color to your desired value
      }
    }, 1000);
  };
  let statusDropDown = [
    { rankTitle: "Not Started", rank: 0 },
    { rankTitle: "In Progress", rank: 10 },
    { rankTitle: "Completed", rank: 100 },
  ];

  const handleFieldChange = (fieldName: any) => (e: any) => {
    // const updatedItem = { ...data[0], [fieldName]: e.target.value };
    // setItem(updatedItem);
  };

  const onEditorStateChange = React.useCallback(
    (rawcontent) => {
      setEditorState(rawcontent.blocks[0].text);
    },
    [editorState]
  );
  const setModalIsOpenToFalse = () => {
    EditComponentCallback("Close");
    setModalIsOpen(false);
  };

  async function updateMultiLookup(
    itemIds: number[],
    lookupIds: number[],
    AllListId: any
  ) {
    try {
      if (itemIds?.length == 0) {
        getMasterTaskListTasksData();
      } else {
        let web = new Web(AllListId?.siteUrl);
        for (const itemId of itemIds) {
          // Update the multi-lookup field for each item
          await web.lists
            .getById(AllListId?.MasterTaskListID)
            .items.getById(itemId)
            .update({
              PortfoliosId: {
                results:
                  lookupIds !== undefined && lookupIds?.length > 0
                    ? lookupIds
                    : [],
              },
            })
            .then((res: any) => {
              getMasterTaskListTasksData();
              count++;
              console.log(res);
            });
        }
      }
    } catch (error) {
      console.error("Error updating multi-lookup field:", error);
    }
  }

  let getMasterTaskListTasksData = async function () {
    try {
      let web = new Web(SelectD?.siteUrl);

      componentDetailsData = await web.lists
        .getById(SelectD.MasterTaskListID)
        .items.select(
          "Item_x0020_Type",
          "Title",
          "PortfolioStructureID",
          "Id",
          "PercentComplete",
          "Portfolios/Id",
          "Portfolios/Title"
        )
        .expand("Portfolios")
        .filter("(Item_x0020_Type eq 'Project' or Item_x0020_Type eq 'Sprint') and Portfolios/Id eq " + item.Id)
        .top(4000)
        .getAll();

      // Project Data for HHHH Project Management

      setfilterData(componentDetailsData);
      console.log("data show on componentdetails", componentDetailsData);
    } catch (error) {
      console.log("error show", error);
    }
  };

  const autoSuggestionsForProject = (e: any) => {
    let searchedKey: any = e.target.value;
    let tempArray: any = [];
    if (searchedKey?.length > 0) {
      allProjectData?.map((itemData: any) => {
        if (itemData.Title.toLowerCase().includes(searchedKey.toLowerCase())) {
          tempArray.push(itemData);
        }
      });
      setSearchedProjectData(tempArray);
      // callServiceComponent(tempArray,"Multi","Save");
    } else {
      setSearchedProjectData([]);
    }
  };
  const autoSuggestionsForFeatureType = (e: any) => {
    let searchedKey: any = e.target.value;
    let tempArray: any = [];
    if (searchedKey?.length > 0) {
      autoSearchFeatureType?.map((itemData: any) => {
        if (itemData.Title.toLowerCase().includes(searchedKey.toLowerCase())) {
          tempArray.push(itemData);
        }
      });
      setSearchFeatureType(tempArray);
      // callServiceComponent(tempArray,"Multi","Save");
    } else {
      setSearchFeatureType([]);
    }
  };

  const handleSuggestionProject = (suggestion: any) => {
    allProjectData?.map((items: any) => {
      if (items?.Id === suggestion?.Id) {
        callServiceComponent([items], "Multi", "Save");
      }
    });
    setSearchedProjectData([]);
  };

  const handleSuggestionFeature = (suggestion: any) => {
    autoSearchFeatureType?.map((items: any) => {
      if (items?.Id === suggestion?.Id) {
        Smartmetadatafeature([items]);
      }
    });
    setSearchFeatureType([]);
  };

  const GetAllComponentAndServiceData = async () => {
    let PropsObject: any = {
      MasterTaskListID: RequireData.MasterTaskListID,
      siteUrl: RequireData?.siteUrl,
      ComponentType: "Component",
      TaskUserListId: RequireData.TaskUsertListID,
    };
    let CallBackData = await globalCommon.GetServiceAndComponentAllData(
      PropsObject
    );

    if (CallBackData?.AllData != undefined && CallBackData?.AllData?.length > 0) {
      GlobalServiceAndComponentData = CallBackData.AllData;
      SetAllProjectData(CallBackData?.FlatProjectData);
      // AllProjectBackupArray = CallBackData?.FlatProjectData;
    }
  };

  const autoSuggestionsForServiceAndComponent = (e: any, usedFor: any) => {
    let SearchedKeyWord: any = e.target.value;
    let TempArray: any = [];
    if (SearchedKeyWord.length > 0) {
      if (
        GlobalServiceAndComponentData != undefined &&
        GlobalServiceAndComponentData.length > 0
      ) {
        GlobalServiceAndComponentData.map((AllDataItem: any) => {
          if (
            AllDataItem.Path?.toLowerCase()?.includes(
              SearchedKeyWord.toLowerCase()
            )
          ) {
            TempArray.push(AllDataItem);
          }
        });
      }
      if (TempArray != undefined && TempArray.length > 0) {
        if (usedFor == "Portfolio") {
          setSearchedServiceCompnentData(TempArray);
        }
      }
    } else {
      setSearchedServiceCompnentData([]);
    }
  };

  React.useEffect(() => {
    GetAllComponentAndServiceData();
  }, []);

  const Call = React.useCallback((item1: any, type: any, functionType: any) => {
    if (type == "SmartComponent") {
      if (EditData != undefined && item1 != undefined) {
        item.smartComponent = item1.smartComponent;
        setSmartComponentData(item1.smartComponent);
      }
    }
    if (type == "Category-Task-Footertable") {
      setPhoneStatus(false);

      setEmailStatus(false);

      setImmediateStatus(false);

      setApprovalStatus(false);

      if (item1 != undefined && item1.length > 0) {
        item1?.map((itenn: any) => {
          selectedCategoryTrue(itenn.Title);
        });

        setCategoriesData(item1);
      }
    }
    if (type == "Category") {
      if (item1 != undefined && item1.categories != "") {
        var title: any = {};
        title.Title = item1.categories;
        item1.categories.map((itenn: any) => {
          if (!isItemExists(CategoriesData, itenn.Id)) {
            CategoriesData.push(itenn);
          }
        });
        item1.TaskCategories.map((itenn: any) => {
          CategoriesData.push(itenn);
        });
        setCategoriesData(CategoriesData);
      }
    }
    if (functionType == "Close") {
      if (type == "Multi") {
        setIsService(false);
      } else {
        setIsComponent(false);
      }
    } else {
      if (type == "Multi" && functionType != "Save") {
        if (item1 != undefined && item1.length > 0) {
          setfilterData(item1);
          console.log("Popup component linkedComponent", item1.linkedComponent);
        }
      }
      if (type == "Single" && functionType == "Save") {
        if (item1 != undefined && item1.length > 0) {
          if (item1[0]?.length != undefined && item1[0]?.length > 1) {
            setLinkedComponentData(item1[0].map((item: any) => item.original));
          } else {
            setLinkedComponentData(item1);
          }

          setSearchedServiceCompnentData([]);
        } else {
          if (item1 != undefined) {
            setLinkedComponentData([item1]);
            setSearchedServiceCompnentData([]);
          }
        }
      }
    }
    if (CategoriesData != undefined) {
      CategoriesData.forEach(function (type: any) {
        CheckCategory.forEach(function (val: any) {
          if (type.Id == val.Id) {
            BackupCat = type.Id;
            setcheckedCat(true);
          }
        });
      });
      setUpdate(update + 2);
    }
    setIsComponentPicker(false);
    setIsComponent(false);
    // setComponent(CompoenetItem => ([...CompoenetItem]));
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
  };

  const GetSmartHelpDetails = async () => {
    let smartHelpDetails = await web.lists
      .getById(RequireData.SmartHelpListID)
      .items.select(
        "Title, Id, Body, Permission, ItemType, Components/Id, Components/Title, Created, Modified, Author/Id, Author/Title, Editor/Id, Editor/Title"
      )
      .expand("Components, Author, Editor")
      .getAll();
    setSmartHelpDetails(smartHelpDetails);
  };

  const GetTaskUsers = async () => {
    let taskUsers = [];
    taskUsers = await web.lists
      .getById(RequireData.TaskUsertListID)
      .items.top(4999)
      .get();
    AllUsers = taskUsers;
    var UpdatedData: any = {};
    AllUsers.forEach(function (taskUser: any) {
      // item.AssignedTo.forEach(function(assign:any){
      //     if (taskUser.AssingedToUserId == assign.Id) {
      //         UpdatedData['AuthorName'] = taskUser.Title;
      //         UpdatedData['Company'] = taskUser.Company;
      //         UpdatedData['AuthorImage'] = (taskUser.Item_x0020_Cover != undefined && taskUser.Item_x0020_Cover.Url != undefined) ? taskUser.Item_x0020_Cover.Url : '';
      //     }
      //     Assin.push(UpdatedData)
      // })
      setAssignUser(Assin);
    });
  };

  //Popup call for smartmetdata min

  const Smartmetadatafeature = React.useCallback((data: any) => {
    if (data === "Close") {
      setSmartdatapopup(false);
    } else {
      setSmartdatapopup(false);
      setFeatureTypeData(data);
    }
  }, []);
  const deleteFeatureItem = (Item: any) => {
    const updatedSelectedItems = FeatureTypeData.filter(
      (valuee: any) => Item !== valuee.Id
    );
    setFeatureTypeData(updatedSelectedItems);
  };

  const ClosePopupCallBack = (FnType: any) => {
    if (FnType == "Close") {
      setSiteCompositionShow(false);
    }
    if ((FnType = "Save")) {
      setSiteCompositionShow(false);
      setTimeout(() => {
        getMasterTaskListTasks();
      }, 1000);
    }
  };

  var getMultiUserValues = function (item: any) {
    var users = "";
    var isuserexists = false;
    var userarray = [];
    if (item.AssignedTo != undefined && item.AssignedTo.results != undefined)
      userarray = item.AssignedTo.results;
    for (var i = 0; i < userarray.length; i++) {
      users += userarray[i].Title + ", ";
    }
    if (users.length > 0) users = users.slice(0, -2);
    return users;
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
  const GetSiteIcon = (listName: string) => {
    console.log(this.state.Result)
    if (listName != undefined) {
      let siteicon = '';
      smartmetaDetails?.map((icondata: any) => {
        if (icondata.Title != undefined) {
          if (icondata.Title.toLowerCase() == listName?.toLowerCase() && icondata.Item_x0020_Cover != undefined) {
            siteicon = icondata.Item_x0020_Cover.Url
          }
          if (icondata.Title.toLowerCase() == listName?.toLowerCase() && icondata.Item_x005F_x0020_Cover != undefined) {
            siteicon = icondata.Item_x005F_x0020_Cover.Url
          }
        }
      })

      return siteicon;
    }

  }

  const getpriority = function (item: any) {
    if (item.PriorityRank >= 0 && item.PriorityRank <= 3) {
      item.Priority = "(3) Low";
    }
    if (item.PriorityRank >= 4 && item.PriorityRank <= 7) {
      item.Priority = "(2) Normal";
    }
    if (item.PriorityRank >= 8) {
      item.Priority = "(1) High";
    }
  };


  var getMasterTaskListTasks = async function () {
    //  var query = "ComponentCategory/Id,ComponentCategory/Title,ComponentPortfolio/Id,ComponentPortfolio/Title,ServicePortfolio/Id,ServicePortfolio/Title,SiteCompositionSettings,PortfolioStructureID,ItemRank,ShortDescriptionVerified,Portfolio_x0020_Type,BackgroundVerified,descriptionVerified,Synonyms,BasicImageInfo,DeliverableSynonyms,OffshoreComments,OffshoreImageUrl,HelpInformationVerified,IdeaVerified,TechnicalExplanationsVerified,Deliverables,DeliverablesVerified,ValueAddedVerified,CompletedDate,Idea,ValueAdded,TechnicalExplanations,Item_x0020_Type,Sitestagging,Package,Parent/Id,Parent/Title,Short_x0020_Description_x0020_On,Short_x0020_Description_x0020__x,Short_x0020_description_x0020__x0,AdminNotes,AdminStatus,Background,Help_x0020_Information,CMSToolComponent/Id,TaskCategories/Id,TaskCategories/Title,PriorityRank,Reference_x0020_Item_x0020_Json,TeamMembers/Title,TeamMembers/Name,Component/Id,Component/Title,Component/ItemType,TeamMembers/Id,Item_x002d_Image,ComponentLink,IsTodaysTask,AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,AttachmentFiles/FileName,FileLeafRef,FeedBack,Title,Id,PercentComplete,Company,StartDate,DueDate,Comments,Categories,Status,WebpartId,Body,Mileage,PercentComplete,Attachments,Priority,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title,ClientCategory/Id,ClientCategory/Title";

    let componentDetails: any = [];

    componentDetails = await web.lists
      .getById(RequireData.MasterTaskListID)
      .items.select(
        "ServicePortfolio/Id",
        "ServicePortfolio/Title",
        "SiteCompositionSettings",
        "PortfolioStructureID",
        "ItemRank",
        "ShortDescriptionVerified",
        "Portfolio_x0020_Type",
        "BackgroundVerified",
        "descriptionVerified",
        "Synonyms",
        "BasicImageInfo",
        "DeliverableSynonyms",
        "OffshoreComments",
        "OffshoreImageUrl",
        "HelpInformationVerified",
        "IdeaVerified",
        "TechnicalExplanationsVerified",
        "Deliverables",
        "DeliverablesVerified",
        "ValueAddedVerified",
        "CompletedDate",
        "Idea",
        "ValueAdded",
        "TechnicalExplanations",
        "Item_x0020_Type",
        "Sitestagging",
        "Package",
        "Short_x0020_Description_x0020_On",
        "Short_x0020_Description_x0020__x",
        "Short_x0020_description_x0020__x0",
        "AdminNotes",
        "AdminStatus",
        "Background",
        "Help_x0020_Information",
        "TaskCategories/Id",
        "TaskCategories/Title",
        "PriorityRank",
        "Reference_x0020_Item_x0020_Json",
        "TeamMembers/Title",
        "TeamMembers/Name",
        "TeamMembers/Id",
        "Item_x002d_Image",
        "ComponentLink",
        "IsTodaysTask",
        "AssignedTo/Title",
        "AssignedTo/Name",
        "AssignedTo/Id",
        "AttachmentFiles/FileName",
        "FileLeafRef",
        "FeedBack",
        "Title",
        "Id",
        "PercentComplete",
        "Company",
        "StartDate",
        "DueDate",
        "Comments",
        "Categories",
        "Status",
        "WebpartId",
        "Body",
        "Mileage",
        "PercentComplete",
        "Attachments",
        "Priority",
        "Created",
        "Modified",
        "Author/Id",
        "Author/Title",
        "Editor/Id",
        "Editor/Title",
        "ClientCategory/Id",
        "ClientCategory/Title",
        "Sitestagging",
        "SiteCompositionSettings",
        "ResponsibleTeam/Id",
        "ResponsibleTeam/Title",
        "Parent/Id",
        "FeatureType/Title",
        "FeatureType/Id",
        "Parent/Title",
        "Parent/ItemType",
        "Portfolios/Id",
        "Portfolios/Title",
        "PortfolioType/Color"
      )
      .expand(
        "ServicePortfolio",
        "ClientCategory",
        "Portfolios",
        "AssignedTo",
        "AttachmentFiles",
        "Author",
        "FeatureType",
        "Editor",
        "PortfolioType",
        "TeamMembers",
        "TaskCategories",
        "ResponsibleTeam",
        "Parent"
      )
      .filter("Id eq " + item.Id + "")
      .top(4000)
      .getAll();
    console.log("data show on componentdetails", componentDetails);

    var Tasks = componentDetails;
    let ParentData: any = [];
    let tempArray1: any = [];
    let tempArray2: any = [];
    $.each(Tasks, function (index: any, item: any) {
      if (item?.Short_x0020_Description_x0020_On) {
        item.Short_x0020_Description_x0020_Onlength = getPlainTextFromHTML(
          item?.Short_x0020_Description_x0020_On
        );
        setShortDescriptionVerifieds(item?.Short_x0020_Description_x0020_On);
      }
      shortDescriptionVerifieds;
      setShortDescriptionVerifieds(item?.ShortDescriptionVerified);
      if (item?.Body) {
        item.Bodylength = getPlainTextFromHTML(item?.Body);
        setdescriptionVerifieds(item?.Body);
      }
      descriptionVerifieds;
      setdescriptionVerifieds(item?.descriptionVerified);
      setBackgroundVerifieds(item?.BackgroundVerified);
      setIdeaVerifieds(item?.IdeaVerified);
      setValueAddedVerifieds(item?.ValueAddedVerified);
      if (item?.Deliverables) {
        item.Deliverableslength = getPlainTextFromHTML(item?.Deliverables);
        setDeliverablesVerifieds(item?.Deliverables);
      }
      DeliverablesVerifieds;
      setDeliverablesVerifieds(item?.DeliverablesVerified);
      if (item?.TechnicalExplanations) {
        item.TechnicalExplanationslength = getPlainTextFromHTML(
          item?.TechnicalExplanations
        );
        setTechnicalExplanationsVerifieds(item?.TechnicalExplanations);
      }
      TechnicalExplanationsVerifieds;
      if (item?.Help_x0020_Information) {
        item.Help_x0020_Informationlength = getPlainTextFromHTML(
          item?.Help_x0020_Information
        );
        setHelpInformationVerifieds(item?.Help_x0020_Information);
      }
      HelpInformationVerifieds;
      setHelpInformationVerifieds(item?.HelpInformationVerified);
      setTechnicalExplanationsVerifieds(item?.TechnicalExplanationsVerified);
      PortfolioTypeColor = item?.PortfolioType?.Color;
      item.DateTaskDueDate = new Date(item.DueDate);
      if (item.DueDate != null)
        item.TaskDueDate = moment(item.DueDate).format("MM-DD-YYYY");
      // item.TaskDueDate = ConvertLocalTOServerDate(item.DueDate, 'MM-DD-YYYY');
      item.FilteredModifiedDate = item.Modified;
      item.DateModified = new Date(item.Modified);
      item.DateCreatedNew = new Date(item.Created);
      // changecode select member
      if (item?.AssignedTo?.length > 0) {
        item.AssignedTo?.map((arrayData: any) => {
          if (arrayData != null) {
            tempArray1.push(arrayData);
          }
        });
        setTaskAssignedTo(tempArray1);
      }
      if (item?.TeamMembers?.length > 0) {
        item.TeamMembers?.map((arrayData: any) => {
          if (arrayData != null) {
            tempArray2.push(arrayData);
          }
        });
        setTaskTeamMembers(tempArray2);
      }
      setFeatureTypeData([item.FeatureType]);
      item.DateCreated = item.CreatedDate = moment(item.Created).format(
        "MM-DD-YYYY"
      ); // ConvertLocalTOServerDate(item.Created, 'MM-DD-YYYY');
      item.Creatednewdate = moment(item.Created).format("MM-DD-YYYY"); //ConvertLocalTOServerDate(item.Created, 'MM-DD-YYYY HH:mm');
      // item.Modified = moment(item.Modified).format('MM-DD-YYYY');
      //ConvertLocalTOServerDate(item.Modified, 'MM-DD-YYYY HH:mm');
      if (item.PriorityRank == undefined && item.Priority != undefined) {
        switch (item.Priority) {
          case "(1) High":
            item.PriorityRank = 8;
            break;
          case "(2) Normal":
            item.PriorityRank = 4;
            break;
          case "(3) Low":
            item.PriorityRank = 1;
            break;
        }
      }
      getpriority(item);
      item.assigned = getMultiUserValues(item);
      if (item.ItemRank != undefined)
        item.ItemRankTitle = TaskItemRank[0].filter(
          (option: { rank: any }) => option.rank == item.ItemRank
        )[0].rankTitle;
      item.PercentComplete =
        item.PercentComplete <= 1
          ? item.PercentComplete * 100
          : item.PercentComplete;
      if (item.PercentComplete != undefined) {
        item.PercentComplete = parseInt(item.PercentComplete.toFixed(0));
      }
      item.smartComponent = [];
      item.smartCategories = [];
      if (item.ComponentPortfolio != undefined) {
        if (item?.ComponentPortfolio?.Id != undefined) {
          if (item.smartComponent != undefined)
            item.smartComponent.push({
              Title: item?.ComponentPortfolio?.Title,
              Id: item?.ComponentPortfolio?.Id,
            });
        }
      }
      let ClientCategory: any;
      ClientCategory = item.ClientCategory;
      if (ClientCategory != undefined && ClientCategory.length > 0) {
        let TempArray: any = [];
        ClientCategory.map((ClientData: any) => {
          if (
            AllClientCategoryDataBackup != undefined &&
            AllClientCategoryDataBackup.length > 0
          ) {
            AllClientCategoryDataBackup.map((clientCategoryData: any) => {
              if (ClientData.Id == clientCategoryData.ID) {
                ClientData.siteName = clientCategoryData.siteName;
                ClientData.ParentID = clientCategoryData.ParentID;
                TempArray.push(ClientData);
              }
            });
          }
        });
        setSelectedClientCategory(TempArray);
        selectedClientCategoryData = TempArray;
        console.log(
          "selected client category form backend ==========",
          TempArray
        );
      }

      item.AssignedUsers = [];
      AllUsers?.map((userData: any) => {
        item.AssignedTo?.map((AssignedUser: any) => {
          if (userData?.AssingedToUserId == AssignedUser.Id) {
            item.AssignedUsers.push(userData);
          }
        });
      });
      if (item.TaskCategories != undefined) {
        if (item.TaskCategories.results != undefined) {
          map(item.TaskCategories.results, (bj) => {
            if (bj.Title != undefined)
              item.smartCategories.push({ Title: bj.Title, Id: bj.Id });
          });
        }
      }
      item.siteType = "Master Tasks";
      item.taskLeader = "None";
      if (
        item.AssignedTo != undefined &&
        item.AssignedTo.results != undefined &&
        item.AssignedTo.results.length > 0
      )
        item.taskLeader = getMultiUserValues(item);
      if (item.Task_x0020_Type == undefined)
        item.Task_x0020_Type = "Activity Tasks";
      if (item.DueDate != undefined) {
        item.DueDate = moment(item.DueDate).format("MM-DD-YYYY");
        // setDate(item.DueDate);
      }
      // if (item.TaskCategories != null) {
      //   setCategoriesData(item.TaskCategories);
      // }
      if (item.TaskCategories != null) {
        item.TaskCategories.forEach(function (type: any) {
          CheckCategory.forEach(function (val: any) {
            if (type.Id == val.Id) {
              BackupCat = type.Id;
              setcheckedCat(true);
            }
          });
        });
      }
      if (item.Component?.length > 0) {
        setSmartComponentData(item.Component);
      }
      if (item.Portfolios != undefined) {
        setLinkedComponentData(item.Portfolios);
      }

      if (item.ComponentLink != null) {
        item.ComponentLink = item.ComponentLink.Url;
      }
      if (item.CompletedDate != undefined) {
        item.CompletedDate = moment(item.CompletedDate).format("MM-DD-YYYY");
      }
      item.SmartCountries = [];
      item.siteUrl = RequireData.siteUrl;
      item["SiteIcon"] =
        item.siteType == "Master Tasks"
          ? GetSiteIcon(
            item.siteType
          )
          : GetSiteIcon(
            item.siteType
          );
      if (item.Synonyms != undefined && item.Synonyms.length > 0) {
        item.Synonyms = JSON.parse(item.Synonyms);
      }
      let ParentId: any = "";
      if (
        item?.Parent != undefined &&
        item.Parent.Id != undefined &&
        item.Item_x0020_Type == "Feature"
      ) {
        ParentId = item.Parent.Id;
        let urln = `${RequireData.siteUrl}/_api/lists/getbyid(${RequireData.MasterTaskListID})/items?$select=Id,Parent/Id,Title,Parent/Title,Parent/ItemType&$expand=Parent&$filter=Id eq ${ParentId}`;
        $.ajax({
          url: urln,
          method: "GET",
          headers: {
            Accept: "application/json; odata=verbose",
          },
          success: function (data) {
            ParentData = ParentData.concat(data.d.results);
            if (data.d.__next) {
              urln = data.d.__next;
            } else SetParentData(ParentData);
            // console.log(responsen);
          },
          error: function (error) {
            console.log(error);
            // error handler code goes here
          },
        });
      }
    });
    //  deferred.resolve(Tasks);
    setComponent(Tasks);
    console.log("All Portfolio Data From Backend =====", Tasks);
    if (Tasks[0].ClientCategory?.length > 0) {
      Tasks[0].ClientCategory = {
        results: Tasks[0].ClientCategory,
      };
    }

    let SiteCompositionTemp: any = [];
    if (Tasks[0]?.Sitestagging?.length > 0) {
      SiteCompositionTemp = JSON.parse(Tasks[0]?.Sitestagging);
    } else {
      SiteCompositionTemp = [];
    }
    if (Tasks[0]?.ClientCategory?.results?.length > 0) {
      let TempCCItems: any = [];
      AllClientCategoryDataBackup?.map((AllCCItem: any) => {
        item.ClientCategory?.results?.map((SelectedCCItem: any) => {
          if (SelectedCCItem?.Id == AllCCItem?.Id) {
            TempCCItems.push(AllCCItem);
          }
        });
      });
      if (TempCCItems?.length > 0) {
        SiteCompositionTemp?.map((TaggedSC: any) => {
          TempCCItems?.map((TaggedCC: any) => {
            if (TaggedSC.Title == TaggedCC.siteName) {
              if (TaggedSC?.ClientCategory?.length > 0) {
                TaggedSC.ClientCategory?.push(TaggedCC);
              } else {
                TaggedSC.ClientCategory = [TaggedCC];
              }
            }
          });
        });
      }
    }

    const imagesForSecondArray = Tasks[0].TeamMembers?.map(
      ({ Id, Name, Title }: any) => ({
        Id,
        Name,
        Title,
        Item_x0020_Cover:
          AllUsers.find((item: any) => item.AssingedToUserId === Id)
            ?.Item_x0020_Cover || null,
      })
    );

    console.log(imagesForSecondArray);
    //     const user = AllUsers.filter(
    //         (user: any) => user?.AssingedToUser?.Id === name
    //     );
    //     let Image: any;
    //     if (user[0]?.Item_x0020_Cover != undefined) {
    //         Image = user[0].Item_x0020_Cover.Url;
    //     } else {
    //         Image = "https://hhhhteams.sharepoint.com/sites/HHHH/PublishingImages/Portraits/icon_user.jpg";
    //     }

    Tasks[0].TeamMembers = imagesForSecondArray;
    Tasks[0].siteCompositionData = SiteCompositionTemp;
    Tasks[0].listId = RequireData.MasterTaskListID;
    Tasks[0].siteUrl = RequireData.siteUrl;
    setEditData(Tasks[0]);
    getMasterTaskListTasksData();
    setModalIsOpenToTrue(true);
  };

  const onRenderCustomHeaderQuestion = () => {
    return (
      <>
        <div className="subheading">Add Question</div>
        <Tooltip ComponentId="1000" />
      </>
    );
  };
  const onRenderCustomHeaderHelp = () => {
    return (
      <>
        <div className="subheading">Add Help</div>
        <Tooltip ComponentId="1000" />
      </>
    );
  };
  const onRenderHeaderQuestionEdit = () => {
    return (
      <>
        <div className="subheading">Edit Question</div>
        <Tooltip ComponentId="1000" />
      </>
    );
  };
  const onRenderHeaderHelpEdit = () => {
    return (
      <>
        <div className="subheading">Edit Help</div>
        <Tooltip ComponentId="1000" />
      </>
    );
  };
  const onRenderHeaderChangeParent = () => {
    return <div className="subheading siteColor">Change Portfolio Type</div>;
  };
  var ListId: any = "";
  var CurrentSiteUrl: any = "";
  //var CMSItemRank: any = '';
  const [state, setState] = React.useState("state");

  const loadDataOnlyOnce = React.useCallback(() => {
    console.log(`I need ${state}!!`);
  }, [state]);

  var Item: any = "";
  const TaskItemRank: any = [];
  const site: any = [];
  const siteDetail: any = [];
  const GetSmartmetadata = async () => {
    smartmetaDetails = [];
    subCategories = [];
    var TaskTypes: any = [];
    var Task: any = [];
    smartmetaDetails = await web.lists
      //.getById('ec34b38f-0669-480a-910c-f84e92e58adf')
      .getById(RequireData.SmartMetadataListID)
      .items //.getById(this.state.itemID)
      .select(
        "ID,Title,IsVisible,ParentID,Parent/Id,Parent/Title,SmartSuggestions,TaxType,Description1,Item_x005F_x0020_Cover,listId,siteName,siteUrl,SortOrder,SmartFilters,Selectable"
      )
      .expand("Parent")
      .top(4999)
      .get();

    console.log(smartmetaDetails);
    if (smartmetaDetails != undefined) {
      smartmetaDetails.forEach(function (val: any) {
        if (val.TaxType == "Sites") {
          site.push(val);
        }
      });
      const featureTypeItems = smartmetaDetails.filter(
        (item: any) => item.TaxType === "Feature Type"
      );
      setAutoSearchFeatureType(featureTypeItems);

      site.forEach(function (val: any) {
        if (
          val.listId != undefined &&
          val.Title != "Master Tasks" &&
          val.Title != "Small Projects" &&
          val.Title != "Foundation" &&
          val.Title != "Offshore Tasks" &&
          val.Title != "DRR" &&
          val.Title != "Health" &&
          val.Title != "Gender"
        ) {
          siteDetail.push(val);
        }
      });
    }
    TaskTypes = getSmartMetadataItemsByTaxType(smartmetaDetails, "Categories");
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

    setsiteDetails(siteDetail);
    getMasterTaskListTasks();
  };

  React.useEffect(() => {
    GetTaskUsers();
    getAllSitesData();
    GetSmartHelpDetails();
    loadAllCategoryData("Categories");
    var initLoading = function () {
      if (item != undefined) {
        var Item = item;
        if (Item.siteType == "HTTPS:") {
          Item.siteType = "HHHH";
        }
        GetSmartmetadata();

        ListId = RequireData.MasterTaskListID;
        CurrentSiteUrl = RequireData.siteUrl;
        TaskItemRank.push([
          { rankTitle: "Select Item Rank", rank: null },
          { rankTitle: "(8) Top Highlights", rank: 8 },
          { rankTitle: "(7) Featured Item", rank: 7 },
          { rankTitle: "(6) Key Item", rank: 6 },
          { rankTitle: "(5) Relevant Item", rank: 5 },
          { rankTitle: "(4) Background Item", rank: 4 },
          { rankTitle: "(2) to be verified", rank: 2 },
          { rankTitle: "(1) Archive", rank: 1 },
          { rankTitle: "(0) No Show", rank: 0 },
        ]);
        setCMSItemRank(TaskItemRank[0]);
        loadAllClientCategoryData("Client Category");
      }
    };
    initLoading();
  }, []);

  const EditComponent = (items: any) => {
    setIsComponent(true);
    setCMSToolComponent(items);
    // <ComponentPortPolioPopup props={item}></ComponentPortPolioPopup>
  };

  const openPortfolioPopup = (itemm: any) => {
    setisopenProjectpopup(true);
    mydata.push(item.Id);
    setCMSToolComponent(itemm);
  };

  const callServiceComponent = React.useCallback(
    (item1: any, type: any, functionType: any) => {
      if (functionType === "Close") {
        if (type === "Multi") {
          setisopenProjectpopup(false);
        } else {
          setisopenProjectpopup(false);
        }
      } else {
        if (type === "Multi" || type === "Single") {
          let mydataid: any = [item?.Id];
          let filteredIds = item1
            .filter((item: { Id: null }) => item.Id !== null)
            .map((item: { Id: any }) => item.Id);

          updateMultiLookup(filteredIds, mydataid, SelectD);
          setisopenProjectpopup(false);
        }
      }
    },
    []
  );

  const GetComponents = async () => {
    let componentDetails = [];
    componentDetails = await web.lists
      //.getById('ec34b38f-0669-480a-910c-f84e92e58adf')
      .getById(RequireData.MasterTaskListID)
      .items //.getById(this.state.itemID)
      .select(
        "ID",
        "Title",
        "DueDate",
        "Status",
        "ItemRank",
        "Item_x0020_Type",
        "FeatureType/Title",
        "FeatureType/Id",
        "Parent/Id",
        "Author/Id",
        "Author/Title",
        "Parent/Title",
        "TaskCategories/Id",
        "TaskCategories/Title",
        "AssignedTo/Id",
        "AssignedTo/Title",
        "TeamMembers/Id",
        "TeamMembers/Title",
        "ClientCategory/Id",
        "ClientCategory/Title"
      )
      .expand(
        "TeamMembers",
        "Author",
        "ClientCategory",
        "Parent",
        "TaskCategories",
        "AssignedTo",
        "FeatureType"
      )
      .top(4999)
      .filter("Item_x0020_Type eq Component")
      .get();

    console.log(componentDetails);
  };
  function EditComponentCallback(res: any) {
    if (res === "Close") {
      Calls(res);
    } else {
      const date = moment(res?.Created);
      const formattedDate = date.format("DD/MM/YYYY");
      const datedue = moment(res?.DueDate);
      const formattedDateDue = datedue.format("DD/MM/YYYY");
      if (TaskAssignedTo != undefined && TaskAssignedTo?.length > 0) {
        $.map(TaskAssignedTo, (Assig: any) => {
          if (Assig.Id != undefined) {
            $.map(AllUsers, (users: any) => {
              if (
                Assig.Id != undefined &&
                users.AssingedToUser != undefined &&
                Assig.Id == users.AssingedToUser.Id
              ) {
                users.ItemCover = users.Item_x0020_Cover;
                res?.TeamLeaderUser?.push(users);
              }
            });
          }
        });
      }

      if (TaskTeamMembers != undefined && TaskTeamMembers.length > 0) {
        $.map(TaskTeamMembers, (Assig: any) => {
          if (Assig.Id != undefined) {
            $.map(AllUsers, (users: any) => {
              if (
                Assig.Id != undefined &&
                users.AssingedToUser != undefined &&
                Assig.Id == users.AssingedToUser.Id
              ) {
                users.ItemCover = users.Item_x0020_Cover;
                res?.TeamLeaderUser?.push(users);
              }
            });
          }
        });
      }
      // ClientCategory
      if (
        res?.ClientCategory != undefined &&
        res?.ClientCategory?.results?.length > 0
      ) {
        const clientarray = res?.ClientCategory?.results?.filter(
          (item: any) => item.Title != undefined
        );
        res.ClientCategory = clientarray;
      }
      res.DisplayCreateDate = formattedDate;

      if (formattedDateDue === "Invalid date") {
        res.DisplayDueDate = "";
      } else {
        res.DisplayDueDate = formattedDateDue;
      }
      res.TaskID = item.TaskID;
      res.SiteIconTitle = item.SiteIconTitle;
      res.Item_x0020_Type = item.Item_x0020_Type;
      res.isRestructureActive = item.isRestructureActive;
      res.ItemRank = item.ItemRank;
      res.PercentComplete = item.PercentComplete;
      res.PortfolioType = item.PortfolioType;
      res.SiteIcon = undefined;
      res.siteUrl = RequireData?.siteUrl;
      res.data = res;
      Calls(res, "UpdatedData");
    }
  }

  let mentionUsers: any = [];
  var generateHierarchichalData = function (item: any, items: any) {
    var autoCompleteItem: any = {};
    autoCompleteItem["value"] = item.Title;
    autoCompleteItem["Id"] = item.Id;
    autoCompleteItem["description"] = item.Description1;
    autoCompleteItem["TaxType"] = item.TaxType;
    if (item.SiteType != undefined)
      autoCompleteItem["SiteType"] = item.SiteType;
    autoCompleteItem["label"] = item.Title;
    map(items, (parentItem) => {
      if (item.ParentID == parentItem.Id) {
        autoCompleteItem["label"] = parentItem.Title + " > " + item.Title;
        if (parentItem.ParentID > 0) {
          map(items, (gParentItem) => {
            if (parentItem.ParentID == gParentItem.Id) {
              autoCompleteItem["label"] =
                gParentItem.Title + " > " + autoCompleteItem.label;
              if (gParentItem.ParentID > 0) {
                map(items, (mParentItem) => {
                  if (gParentItem.ParentID == mParentItem.Id) {
                    autoCompleteItem["label"] =
                      mParentItem.Title + " > " + autoCompleteItem.label;

                    return false;
                  }
                });
              }
            }
          });
        }

        return false;
      }
    });

    return autoCompleteItem;
  };
  const setPriority = function (item: any, val: number) {
    item.PriorityRank = val;
    getpriority(item);

    setComponent((EditData) => [...EditData]);
  };
  const setPriorityNew = function (e: any, item: any) {
    item.PriorityRank = e.target.value;
    if (item.PriorityRank <= 10) {
      if (
        item.PriorityRank == 8 ||
        item.PriorityRank == 9 ||
        item.PriorityRank == 10
      ) {
        item.Priority = "(1) High";
      }
      if (
        item.PriorityRank == 4 ||
        item.PriorityRank == 5 ||
        item.PriorityRank == 6 ||
        item.PriorityRank == 7
      ) {
        item.Priority = "(2) Normal";
      }
      if (
        item.PriorityRank == 1 ||
        item.PriorityRank == 2 ||
        item.PriorityRank == 3 ||
        item.PriorityRank == 0
      ) {
        item.Priority = "(3) Low";
      }
    } else {
      item.PriorityRank = "";
      alert("Please Enter priority between 0 to 10");
    }
    // getpriority(item);
    setComponent((EditData) => [...EditData]);
  };
  const setTime = function (item: any, val: any) {
    item.Mileage = val;
    setComponent((EditData) => [...EditData]);
  };
  const setStatus = function (item: any, val: any) {
    item.AdminStatus = val;
    setComponent((EditData) => [...EditData]);
  };
  const expendcollapsAccordion = (item: any, title: any) => {
    item[title] = item[title] = item[title] == true ? false : true;
    setComponent((EditData) => [...EditData]);
  };
  const test12 = (e: any, item: any) => {
    item.SynonymsTitle = e.target.value;
    setComponent((EditData) => [...EditData]);
  };
  const createSynonyms = (item: any) => {
    if (item.SynonymsTitle == undefined || item.SynonymsTitle == "") {
      alert("You have not enter Synonym name.");
    } else {
      let flag = true;
      if (item["Synonyms"] != undefined && item["Synonyms"].length > 0) {
        if (
          item["Synonyms"][item["Synonyms"].length - 1]["Title"] ==
          item.SynonymsTitle
        ) {
          flag = false;
          alert("You have a blank synonym try to fill it first");
        } else if (
          item["Synonyms"][item["Synonyms"].length - 1]["status"] == false
        ) {
          flag = false;
          alert("You have not saved your last item.");
        }
      } else item["Synonyms"] = [];
      flag
        ? item["Synonyms"].push({
          status: true,
          Title: item.SynonymsTitle,
          Id: "",
        })
        : null;
      item.SynonymsTitle = "";
    }
    item.SynonymsTitle = "";
    setComponent((EditData) => [...EditData]);
  };
  const deleteItem = (item: any) => {
    if (item["Synonyms"] != undefined && item["Synonyms"].length > 0) {
      map(item["Synonyms"], (val, index) => {
        item["Synonyms"].splice(index, 1);
      });
    }
    setComponent((EditData) => [...EditData]);
  };
  const SaveData = async () => {
    let TaskShuoldBeUpdate = true;
    var UploadImage: any = [];
    let ClientCategoryIDs: any = [];
    var item: any = {};
    var smartComponentsIds: any[] = [];
    // var RelevantPortfolioIds = "";
    var RelevantProjectIds = "";
    var RelevantPortfolioIds = "";
    let PortfolioIds: any[] = [];
    let ProjectId: any[] = [];
    var RelevantProjectIdRemove = "";
    let ProjectIdRemove: any[] = [];
    let TotalCompositionsValue: any = 0;
    var Items = EditData;

    if (SiteTaggingData?.length > 0) {
      SiteTaggingData.map((clientData: any) => {
        TotalCompositionsValue =
          TotalCompositionsValue + Number(clientData.ClienTimeDescription);
      });
    }
    if (EnableSiteCompositionValidation) {
      if (TotalCompositionsValue > 100) {
        TaskShuoldBeUpdate = false;
        TotalCompositionsValue = 0;
        alert("site composition allocation should not be more than 100%");
      }
      if (
        TotalCompositionsValue.toFixed(0) < 100 &&
        TotalCompositionsValue > 0
      ) {
        TotalCompositionsValue = 0;
        let conformationStatus = confirm(
          "Site composition should not be less than 100% if you still want to do it click on OK"
        );
        if (conformationStatus) {
          TaskShuoldBeUpdate = true;
        } else {
          TaskShuoldBeUpdate = false;
        }
      }
    }
    if (TaskShuoldBeUpdate) {
      if (smartComponentData != undefined && smartComponentData.length > 0) {
        smartComponentData.map((com: any) => {
          if (
            smartComponentData != undefined &&
            smartComponentData.length >= 0
          ) {
            $.each(smartComponentData, function (index: any, smart: any) {
              smartComponentsIds.push(smart.Id);
            });
          }
        });
      }
      if (NewArray != undefined && NewArray.length > 0) {
        CategoriesData = [];
        NewArray.map((NeitemA: any) => {
          CategoriesData.push(NeitemA);
        });
      }
      var categoriesItem = "";
      CategoriesData.map((category) => {
        if (category.Title != undefined) {
          categoriesItem =
            categoriesItem == ""
              ? category.Title
              : categoriesItem + ";" + category.Title;
        }
      });
      var CategoryID: any = [];
      CategoriesData.map((category) => {
        if (category.Id != undefined) {
          CategoryID.push(category.Id);
        }
      });
      if (linkedComponentData != undefined && linkedComponentData?.length > 0) {
        linkedComponentData?.map((com: any) => {
          if (
            linkedComponentData != undefined &&
            linkedComponentData?.length >= 0
          ) {
            $.each(linkedComponentData, function (index: any, smart: any) {
              RelevantPortfolioIds = smart.Id;
              PortfolioIds.push(smart.Id);
            });
          }
        });
      }

      if (filterdata != undefined && filterdata?.length > 0) {
        filterdata?.map((com: any) => {
          if (filterdata != undefined && filterdata?.length >= 0) {
            $.each(filterdata, function (index: any, smart: any) {
              RelevantProjectIds = smart.Id;
              ProjectId.push(smart.Id);
            });
          }
        });
      }

      if (filterdata != null && filterdata.length >= 0) {
        filterdata.filter((com: any) => {
          RelevantProjectIdRemove = com.Id;
          ProjectIdRemove.push(com.Id);
        });
      }

      if (TaskTeamMembers != undefined && TaskTeamMembers?.length > 0) {
        TaskTeamMembers?.map((taskInfo) => {
          TeamMemberIds.push(taskInfo.Id);
        });
      } else if (TaskTeamMembers.length === 0 && TeamMemberIds.length > 0) {
        TeamMemberIds;
      } else {
        TeamMemberIds = [];
      }
      if (TaskAssignedTo != undefined && TaskAssignedTo?.length > 0) {
        TaskAssignedTo?.map((taskInfo) => {
          AssignedToIds.push(taskInfo.Id);
        });
      } else if (TaskAssignedTo?.length === 0 && AssignedToIds?.length > 0) {
        AssignedToIds;
      } else {
        AssignedToIds = [];
      }

      if (selectedClientCategory?.length > 0) {
        selectedClientCategory.map((dataItem: any) => {
          ClientCategoryIDs.push(dataItem.Id);
        });
      } else {
        ClientCategoryIDs = [];
      }

      if (
        Items.ItemRankTitle != undefined &&
        Items.ItemRankTitle != "Select Item Rank"
      )
        var ItemRank = CMSItemRank.filter(
          (option: { rankTitle: any }) =>
            option.rankTitle == Items.ItemRankTitle
        )[0].rank;
      let FeatureTypeIds =
        FeatureTypeData?.length != 0 ? FeatureTypeData[0]?.Id : null;
      await web.lists
        .getById(RequireData.MasterTaskListID)
        .items.getById(Items.Id)
        .update({
          Title: Items.Title,
          FeatureTypeId: FeatureTypeIds,
          ItemRank: ItemRank,
          PriorityRank: Items.PriorityRank,
          // ComponentId: { results: smartComponentsIds },
          DeliverableSynonyms: Items.DeliverableSynonyms,
          StartDate: EditData?.StartDate
            ? moment(EditData?.StartDate).format("MM-DD-YYYY")
            : null,
          DueDate: EditData?.DueDate
            ? moment(EditData?.DueDate).format("MM-DD-YYYY")
            : null,
          CompletedDate: EditData?.CompletedDate
            ? moment(EditData?.CompletedDate).format("MM-DD-YYYY")
            : null,

          // Categories:EditData?.smartCategories != undefined && EditData?.smartCategories != ''?EditData?.smartCategories[0].Title:EditData?.Categories,
          Categories: categoriesItem ? categoriesItem : null,
          // ClientCategoryId: { "results": RelevantPortfolioIds },
          ServicePortfolioId:
            RelevantPortfolioIds != "" ? RelevantPortfolioIds : null,
          PortfoliosId: (
            { results: PortfolioIds?.length != 0 ? PortfolioIds : [] }
              ? { results: PortfolioIds?.length != 0 ? PortfolioIds : [] }
              : null
          )
            ? { results: PortfolioIds?.length >= 0 ? PortfolioIds : [] }
            : null,
          Synonyms: JSON.stringify(Items["Synonyms"]),
          Package: Items.Package,
          AdminStatus: Items.AdminStatus,
          PercentComplete: Items?.PercentComplete / 100,
          Priority: Items.Priority,
          Mileage: Items.Mileage,
          ValueAdded: Items.ValueAdded,
          Idea: Items.Idea,
          Background: Items.Background,
          AdminNotes: Items.AdminNotes,
          ShortDescriptionVerified: shortDescriptionVerifieds,
          descriptionVerified: descriptionVerifieds,
          BackgroundVerified: BackgroundVerifieds,
          IdeaVerified: IdeaVerifieds,
          ValueAddedVerified: ValueAddedVerifieds,
          DeliverablesVerified: DeliverablesVerifieds,
          TechnicalExplanationsVerified: TechnicalExplanationsVerifieds,
          Item_x002d_Image: {
            __metadata: { type: "SP.FieldUrlValue" },
            Description:
              EditData?.Item_x002d_Image?.Url != undefined
                ? EditData?.Item_x002d_Image?.Url
                : "",
            Url:
              EditData?.Item_x002d_Image?.Url != undefined
                ? EditData?.Item_x002d_Image?.Url
                : "",
          },
          // ClientActivity:,
          ComponentLink: {
            Description:
              Items.ComponentLink != undefined ? Items.ComponentLink : null,
            Url: Items.ComponentLink != undefined ? Items.ComponentLink : null,
          },
          TechnicalExplanations:
            PostTechnicalExplanations != undefined &&
              PostTechnicalExplanations != ""
              ? PostTechnicalExplanations
              : EditData?.TechnicalExplanations,
          Deliverables:
            PostDeliverables != undefined && PostDeliverables != ""
              ? PostDeliverables
              : EditData?.Deliverables,
          Short_x0020_Description_x0020_On:
            PostShort_x0020_Description_x0020_On != undefined &&
              PostShort_x0020_Description_x0020_On != ""
              ? PostShort_x0020_Description_x0020_On
              : EditData?.Short_x0020_Description_x0020_On,
          Help_x0020_Information:
            PostHelp_x0020_Information != undefined &&
              PostHelp_x0020_Information != ""
              ? PostHelp_x0020_Information
              : EditData?.Help_x0020_Information,
          HelpInformation:
            PostHelp_x0020_Information != undefined &&
              PostHelp_x0020_Information != ""
              ? PostHelp_x0020_Information
              : EditData?.HelpInformation,
          Body:
            PostBody != undefined && PostBody != "" ? PostBody : EditData?.Body,
          AssignedToId: {
            results:
              AssignedToIds != undefined && AssignedToIds?.length > 0
                ? AssignedToIds
                : [],
          },
          ResponsibleTeamId: {
            results:
              AssignedToIds != undefined && AssignedToIds?.length > 0
                ? AssignedToIds
                : [],
          },
          TeamMembersId: {
            results:
              TeamMemberIds != undefined && TeamMemberIds?.length > 0
                ? TeamMemberIds
                : [],
          },
        })
        .then((res: any) => {
          console.log(res);
          EditComponentCallback(Items);
          setModalIsOpenToFalse();
        });
    }
  };
  const AddQuestionFunc = async () => {
    try {
      let componentId = CompoenetItem[0].Id;
      const questionDescription = PostQuestionDescription;
      const newItem = {
        ItemType: "Question",
        // Title: `${CompoenetItem[0].Title} - ${question}`,
        Title: question,
        ComponentsId: { results: [componentId] },
        Permission: choice,
        Body: questionDescription || EditData?.PostQuestionDescription || "",
      };
      await web.lists.getById(RequireData.SmartHelpListID).items.add(newItem);

      // Update the state with the newly added item
      setSmartHelpDetails([...SmartHelpDetails, newItem]);
      setIsOpenPopup(false);
      let smartHelpDetails = await web.lists
        .getById(RequireData.SmartHelpListID)
        .items.select(
          "Title, Id, Body, Permission, ItemType, Components/Id, Components/Title, Created, Modified, Author/Id, Author/Title, Editor/Id, Editor/Title"
        )
        .expand("Components, Author, Editor")
        .getAll();
      setSmartHelpDetails(smartHelpDetails);
      setQuestion("");
      setChoice("");
      PostQuestionDescription = "";
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (event: any) => {
    const selectedValue = event.target.value;
    setEditData({ ...EditData, PercentComplete: selectedValue });
  };

  const AddHelpFunc = async () => {
    try {
      let componentId = CompoenetItem[0].Id;
      const questionDescription = PostQuestionDescription;
      const newItem = {
        ItemType: "Help",
        // Title: `${CompoenetItem[0].Title} - ${help}`,
        Title: help,
        ComponentsId: { results: [componentId] },
        Permission: choice,
        Body: questionDescription || EditData?.PostQuestionDescription || "",
      };
      await web.lists.getById(RequireData.SmartHelpListID).items.add(newItem);

      // Update the state with the newly added item
      setSmartHelpDetails([...SmartHelpDetails, newItem]);
      setOpenPopup(false);
      let smartHelpDetails = await web.lists
        .getById(RequireData.SmartHelpListID)
        .items.select(
          "Title, Id, Body, Permission, ItemType, Components/Id, Components/Title, Created, Modified, Author/Id, Author/Title, Editor/Id, Editor/Title"
        )
        .expand("Components, Author, Editor")
        .getAll();
      setSmartHelpDetails(smartHelpDetails);
      setHelp("");
      setChoice("");
      PostQuestionDescription = "";
    } catch (error) {
      console.log(error);
    }
  };
  const EditComponentPicker = (item: any) => {
    setIsComponentPicker(true);
    setTaskCat(item);
  };
  const opensmartmetadatapopup = (item: any) => {
    setSmartdatapopup(true);
    setSmartdata(item);
  };
  const ChangeStatus = (e: any, item: any) => {
    item.AdminStatus = e.target.value;
    setComponent((EditData) => [...EditData]);
  };
  const changeTime = (e: any, item: any) => {
    item.Mileage = e.target.value;
    setComponent((EditData) => [...EditData]);
  };
  const HtmlEditorCallBack = React.useCallback((Editorvalue: any) => {
    let message: any = Editorvalue;
    EditData.Body = message;
    PostBody = EditData?.Body;
    console.log("Editor Data call back ====", Editorvalue);
  }, []);
  const SortHtmlEditorCallBack = React.useCallback((Editorvalue: any) => {
    let message: any = Editorvalue;
    EditData.Short_x0020_Description_x0020_On = message;
    PostShort_x0020_Description_x0020_On =
      EditData?.Short_x0020_Description_x0020_On;
    console.log("Editor Data call back ====", Editorvalue);
  }, []);
  const DeliverablesHtmlEditorCallBack = React.useCallback(
    (Editorvalue: any) => {
      let message: any = Editorvalue;
      EditData.Deliverables = message;
      PostDeliverables = EditData?.Deliverables;
      console.log("Editor Data call back ====", Editorvalue);
    },
    []
  );
  const TechnicalExplanationsHtmlEditorCallBack = React.useCallback(
    (Editorvalue: any) => {
      let message: any = Editorvalue;
      EditData.TechnicalExplanations = message;
      PostTechnicalExplanations = EditData?.TechnicalExplanations;
      console.log("Editor Data call back ====", Editorvalue);
    },
    []
  );
  const HelpInformationHtmlEditorCallBack = React.useCallback(
    (Editorvalue: any) => {
      let message: any = Editorvalue;
      EditData.Help_x0020_Information = message;
      PostHelp_x0020_Information = EditData?.Help_x0020_Information;
      console.log("Editor Data call back ====", Editorvalue);
    },
    []
  );
  const QuestionDescriptionEditorCallBack = React.useCallback(
    (Editorvalue: any) => {
      let message: any = Editorvalue;
      EditData.QuestionDescription = message;
      PostQuestionDescription = EditData?.QuestionDescription;
      console.log("Editor Data call back ====", Editorvalue);
    },
    []
  );
  var CheckCategory: any = [];
  CheckCategory.push(
    { TaxType: "Categories", Title: "Phone", Id: 199, ParentId: 225 },
    {
      TaxType: "Categories",
      Title: "Email Notification",
      Id: 276,
      ParentId: 225,
    },
    { TaxType: "Categories", Title: "Approval", Id: 227, ParentId: 225 },
    { TaxType: "Categories", Title: "Immediate", Id: 228, parentId: 225 }
  );

  const DDComponentCallBack = (dt: any) => {
    setTeamConfig(dt);
    setisDropItem(dt.isDrop);
    setisDropItemRes(dt.isDropRes);
    console.log(TeamConfig);
    if (dt?.AssignedTo?.length > 0) {
      let tempArray: any = [];
      dt.AssignedTo?.map((arrayData: any) => {
        if (arrayData.AssingedToUser != null) {
          tempArray.push(arrayData.AssingedToUser);
        } else {
          tempArray.push(arrayData);
        }
      });
      setTaskAssignedTo(tempArray);
      console.log("Team Config  assigadf=====", tempArray);
    } else {
      setTaskAssignedTo([]);
    }
    if (dt?.TeamMemberUsers?.length > 0) {
      let tempArray: any = [];
      dt.TeamMemberUsers?.map((arrayData: any) => {
        if (arrayData.AssingedToUser != null) {
          tempArray.push(arrayData.AssingedToUser);
        } else {
          tempArray.push(arrayData);
        }
      });
      setTaskTeamMembers(tempArray);
      console.log("Team Config member=====", tempArray);
    } else {
      setTaskTeamMembers([]);
    }
    if (dt.ResponsibleTeam != undefined && dt.ResponsibleTeam.length > 0) {
      let tempArray: any = [];
      dt.ResponsibleTeam?.map((arrayData: any) => {
        if (arrayData.AssingedToUser != null) {
          tempArray.push(arrayData.AssingedToUser);
        } else {
          tempArray.push(arrayData);
        }
      });
      setTaskResponsibleTeam(tempArray);
      console.log("Team Config reasponsible ===== ", tempArray);
    } else {
      setTaskResponsibleTeam([]);
    }
  };
  var itemInfo = {
    Portfolio_x0020_Type: TeamConfigInfo
      ? TeamConfigInfo?.Portfolio_x0020_Type
      : "",
    Services: TeamConfigInfo ? TeamConfigInfo?.Services : "",
    siteUrl: TeamConfigInfo ? TeamConfigInfo?.siteUrl : RequireData.siteUrl,
    listName: TeamConfigInfo ? TeamConfigInfo?.siteType : "",
    itemID: TeamConfigInfo ? TeamConfigInfo?.Id : "",
  };
  const deleteCategories = (id: any) => {
    CategoriesData.map((catId, index) => {
      if (id == catId.Id) {
        CategoriesData.splice(index, 1);
      }
    });
    setCategoriesData((CategoriesData) => [...CategoriesData]);
  };
  const deleteComponent = (type: any) => {
    if (type == "EditData?.Component") {
      EditData.Component = "";
    } else {
      EditData.smartComponent = "";
    }
    setComponent((EditData) => [...EditData]);
  };
  const onRenderCustomHeader = () => {
    return (
      <>
        <div className="align-items-center d-flex full-width justify-content-between">
          <div className="ps-4">
            {" "}
            <ul className=" m-0 p-0 spfxbreadcrumb">
              <li>
                {/* if="Task.Portfolio_x0020_Type=='Component'  (Task.Item_x0020_Type=='Component Category')" */}
                {EditData?.Portfolio_x0020_Type != undefined && (
                  <a
                    target="_blank"
                    data-interception="off"
                    href={`${RequireData.siteUrl}/SitePages/Team-Portfolio.aspx?PortfolioType=${EditData?.Portfolio_x0020_Type}`}
                  >
                    {EditData?.Portfolio_x0020_Type}-Portfolio
                  </a>
                )}
              </li>
              {(EditData?.Item_x0020_Type == "SubComponent" ||
                EditData?.Item_x0020_Type == "Feature") && (
                  <>
                    {" "}
                    <li>
                      {/* if="Task.Portfolio_x0020_Type=='Component'  (Task.Item_x0020_Type=='Component Category')" */}
                      {EditData?.Parent != undefined &&
                        ParentData != undefined &&
                        ParentData.length != 0 && (
                          <a
                            target="_blank"
                            data-interception="off"
                            href={`${RequireData.siteUrl}/SitePages/Portfolio-Profile.aspx?taskId=${ParentData[0].Parent.Id}`}
                          >
                            {ParentData[0].Parent.Title}
                          </a>
                        )}
                    </li>
                    <li>
                      {/* if="Task.Portfolio_x0020_Type=='Component'  (Task.Item_x0020_Type=='Component Category')" */}
                      {EditData?.Parent != undefined && (
                        <a
                          target="_blank"
                          data-interception="off"
                          href={`${RequireData.siteUrl}/SitePages/Portfolio-Profile.aspx?taskId=${EditData?.Parent.Id}`}
                        >
                          {EditData?.Parent.Title}
                        </a>
                      )}
                    </li>
                  </>
                )}

              <li>
                {EditData?.Item_x0020_Type == "Feature" && (
                  <a>
                    <>
                      <span className="Dyicons mt--3 me-1">F</span>

                      {EditData?.Title}
                    </>
                  </a>
                )}
                {EditData?.Item_x0020_Type == "SubComponent" && (
                  <a>
                    <>
                      <span className="Dyicons mt--3 me-1">S</span>
                      {EditData?.Title}
                    </>
                  </a>
                )}
                {EditData?.Item_x0020_Type == "Component" && (
                  <a>
                    <>
                      <span className="Dyicons mt--3 me-1">C</span>
                      {EditData?.Title}
                    </>
                  </a>
                )}
              </li>
            </ul>
          </div>

          <div className="feedbkicon">
            {" "}
            <Tooltip
              ComponentId="1258"
              IsServiceTask={
                EditData?.Portfolio_x0020_Type == "Service" ? true : false
              }
            />{" "}
          </div>
        </div>
      </>
    );
  };
  const deleteTask = async () => {
    var confirmDelete = confirm("Are you sure, you want to delete this?");
    if (confirmDelete) {
      await web.lists
        .getById(RequireData.MasterTaskListID)
        .items.getById(item.Id)
        .recycle()
        .then((i: any) => {
          console.log(i);
          setComponent((EditData) => [...EditData]);

          var ItmesDelete: any = {
            data: {
              Id: item.Id,
              ItmesDelete: true,
              siteType: item?.siteType,
            },
          };
          Calls(ItmesDelete);
          setModalIsOpenToFalse();

          item.showProgressBar();
        });
    }
  };
  var NewArray: any = [];
  const checkCat = (type: any) => {
    CheckCategory.map((catTitle: any) => {
      setcheckedCat(false);
      if (type == catTitle.Title) {
        NewArray.push(catTitle);
      }
    });
  };

  // ******************** This is for the Site Compsition Component related All Functions And CallBack *******************

  const SiteCompositionCallBack = React.useCallback((Data: any, Type: any) => {
    if (Data.ClientTime != undefined && Data.ClientTime.length > 0) {
      setEnableSiteCompositionValidation(true);
      let tempArray: any = [];
      Data.ClientTime?.map((ClientTimeItems: any) => {
        if (
          ClientTimeItems.ClientCategory != undefined ||
          ClientTimeItems.SiteImages?.length > 0
        ) {
          let newObject: any = {
            ClienTimeDescription: ClientTimeItems.ClienTimeDescription,
            Title: ClientTimeItems.Title,
            localSiteComposition: true,
            SiteImages: ClientTimeItems.SiteImages,
            Date: ClientTimeItems.Date,
          };
          tempArray.push(newObject);
        } else {
          tempArray.push(ClientTimeItems);
        }
      });
      const finalData = tempArray.filter((val: any, id: any, array: any) => {
        return array.indexOf(val) == id;
      });
      setSiteTaggingData(finalData);
    } else {
      if (Type == "dataDeleted") {
        setSiteTaggingData([{}]);
      }
    }
    if (
      Data.selectedClientCategory != undefined &&
      Data.selectedClientCategory.length > 0
    ) {
      setSelectedClientCategory(Data.selectedClientCategory);
    } else {
      if (Type == "dataDeleted") {
        setSelectedClientCategory([]);
      }
    }
    if (
      Data.SiteCompositionSettings != undefined &&
      Data.SiteCompositionSettings.length > 0
    ) {
      setSiteCompositionSetting(Data.SiteCompositionSettings);
    }
    console.log("Site Composition final Call back Data =========", Data);
  }, []);

  //  ******************  This is All Site Details Get Data Call From Backend **************

  const getAllSitesData = async () => {
    let web = new Web(RequireData.siteUrl);
    let MetaData: any = [];
    let siteConfig: any = [];
    let tempArray: any = [];
    MetaData = await web.lists
      .getById(RequireData.SmartMetadataListID)
      .items.select(
        "Id,Title,listId,siteUrl,siteName,Item_x005F_x0020_Cover,ParentID,EncodedAbsUrl,IsVisible,Created,Modified,Description1,SortOrder,Selectable,TaxType,Created,Modified,Author/Name,Author/Title,Editor/Name,Editor/Title"
      )
      .top(4999)
      .expand("Author,Editor")
      .get();
    CategoryAllData = MetaData?.filter(
      (item: any) => item?.TaxType === "Categories"
    );
    let MyCategoriesd: any = [];
    if (CategoryAllData?.length > 0 && categoryitem?.length > 0) {
      CategoryAllData.map((item: any) => {
        categoryitem.map((items: any) => {
          if (item.Title === items) {
            MyCategoriesd.push(item);
          }
        });
      });
    }
    setCategoriesData(MyCategoriesd);
    siteConfig = getSmartMetadataItemsByTaxType(MetaData, "Sites");
    siteConfig?.map((site: any) => {
      if (
        site.Title !== undefined &&
        site.Title !== "Foundation" &&
        site.Title !== "Master Tasks" &&
        site.Title !== "DRR" &&
        site.Title !== "SDC Sites"
      ) {
        site.BtnStatus = false;
        site.isSelected = false;
        tempArray.push(site);
      }
    });
    setSiteTypes(tempArray);
    tempArray?.map((tempData: any) => {
      SiteTypeBackupArray.push(tempData);
    });
  };
  var getSmartMetadataItemsByTaxType = function (
    metadataItems: any,
    taxType: any
  ) {
    var Items: any = [];
    metadataItems.map((taxItem: any) => {
      if (taxItem.TaxType === taxType) Items.push(taxItem);
    });
    Items.sort((a: any, b: any) => {
      return a.SortOrder - b.SortOrder;
    });
    return Items;
  };

  //  ######################  This is  Client Category Get Data Call From Backend  #######################

  const loadAllClientCategoryData = function (SmartTaxonomy: any) {
    var AllTaskusers = [];
    var AllMetaData: any = [];
    var TaxonomyItems: any = [];
    var url =
      `${RequireData.siteUrl}/_api/web/lists/getbyid('${RequireData?.SmartMetadataListID}')/items?$select=Id,Title,IsVisible,ParentID,SmartSuggestions,TaxType,Description1,Item_x005F_x0020_Cover,listId,siteName,siteUrl,SortOrder,SmartFilters,Selectable,IsSendAttentionEmail/Id,IsSendAttentionEmail/Title,IsSendAttentionEmail/EMail&$expand=IsSendAttentionEmail&$orderby=SortOrder&$top=4999&$filter=TaxType eq '` +
      SmartTaxonomy +
      "'";
    $.ajax({
      url: url,
      method: "GET",
      headers: {
        Accept: "application/json; odata=verbose",
      },
      success: function (data) {
        AllTaskusers = data.d.results;
        $.each(AllTaskusers, function (index: any, item: any) {
          if (
            item.Title.toLowerCase() == "pse" &&
            item.TaxType == "Client Category"
          ) {
            item.newTitle = "EPS";
          } else if (
            item.Title.toLowerCase() == "e+i" &&
            item.TaxType == "Client Category"
          ) {
            item.newTitle = "EI";
          } else if (
            item.Title.toLowerCase() == "education" &&
            item.TaxType == "Client Category"
          ) {
            item.newTitle = "Education";
          } else if (
            item.Title.toLowerCase() == "migration" &&
            item.TaxType == "Client Category"
          ) {
            item.newTitle = "Migration";
          } else {
            item.newTitle = item.Title;
          }
          AllMetaData.push(item);
        });
        if (SmartTaxonomy == "Client Category") {
          // setAllClientCategoryData(AllMetaData);
          // AllClientCategoryDataBackup = AllMetaData;
          BuildClieantCategoryAllDataArray(AllMetaData);
        }
      },
      error: function (error: any) {
        console.log("Error:", error);
      },
    });
  };

  const BuildClieantCategoryAllDataArray = (DataItem: any) => {
    let MainParentArray: any = [];
    let FinalArray: any = [];
    if (DataItem != undefined && DataItem.length > 0) {
      DataItem.map((Item: any) => {
        if (Item.ParentID == 0) {
          Item.Child = [];
          MainParentArray.push(Item);
        }
      });
    }
    if (MainParentArray?.length > 0) {
      MainParentArray.map((ParentArray: any) => {
        if (DataItem?.length > 0) {
          DataItem.map((ChildArray: any) => {
            if (ParentArray.Id == ChildArray.ParentID) {
              ChildArray.siteName = ParentArray.newTitle;
              ChildArray.Child = [];
              ParentArray.Child.push(ChildArray);
            }
          });
        }
      });
    }
    if (MainParentArray?.length > 0) {
      MainParentArray.map((ParentArray: any) => {
        if (ParentArray?.Child?.length > 0) {
          ParentArray?.Child.map((ChildLevelFirst: any) => {
            if (DataItem?.length > 0) {
              DataItem.map((ChildArray: any) => {
                if (ChildLevelFirst.Id == ChildArray.ParentID) {
                  ChildArray.siteName = ParentArray.newTitle;
                  ChildArray.Child = [];
                  ChildLevelFirst.Child.push(ChildArray);
                }
              });
            }
          });
        }
      });
    }
    if (MainParentArray?.length > 0) {
      MainParentArray.map((ParentArray: any) => {
        if (ParentArray?.Child?.length > 0) {
          ParentArray?.Child.map((ChildLevelFirst: any) => {
            if (ChildLevelFirst.Child?.length > 0) {
              ChildLevelFirst.Child.map((lastChild: any) => {
                if (DataItem?.length > 0) {
                  DataItem.map((ChildArray: any) => {
                    if (lastChild.Id == ChildArray.ParentID) {
                      ChildArray.siteName = ParentArray.newTitle;
                      ChildArray.Child = [];
                      lastChild.Child.push(ChildArray);
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
    if (MainParentArray?.length > 0) {
      MainParentArray.map((ParentArray: any) => {
        if (ParentArray?.Child?.length > 0) {
          ParentArray?.Child.map((ChildLevelFirst: any) => {
            if (ChildLevelFirst.Child?.length > 0) {
              ChildLevelFirst.Child.map((lastChild: any) => {
                if (lastChild.Child?.length > 0) {
                  lastChild.Child?.map((endChild: any) => {
                    if (DataItem?.length > 0) {
                      DataItem.map((ChildArray: any) => {
                        if (endChild.Id == ChildArray.ParentID) {
                          ChildArray.siteName = ParentArray.newTitle;
                          ChildArray.Child = [];
                          endChild.Child.push(ChildArray);
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
    if (MainParentArray?.length > 0) {
      MainParentArray.map((finalItem: any) => {
        FinalArray.push(finalItem);
        if (finalItem.Child?.length > 0) {
          finalItem.Child.map((FinalChild: any) => {
            FinalArray.push(FinalChild);
            if (FinalChild.Child?.length > 0) {
              FinalChild.Child.map((LastChild: any) => {
                FinalArray.push(LastChild);
                if (LastChild.Child?.length > 0) {
                  LastChild.Child?.map((endChild: any) => {
                    FinalArray.push(endChild);
                  });
                }
              });
            }
          });
        }
      });
    }
    AllClientCategoryDataBackup = FinalArray;
  };

  // AutoSuggestion
  const autoSuggestionsForCategory = (e: any) => {
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
  let AutoCompleteItems: any = [];
  const loadAllCategoryData = function (SmartTaxonomy: any) {
    var AllTaskusers = [];

    var AllMetaData: any = [];

    var TaxonomyItems: any = [];

    var url =
      `${RequireData?.siteUrl}/_api/web/lists/getbyid('${RequireData?.SmartMetadataListID}')/items?$select=Id,Title,IsVisible,ParentID,SmartSuggestions,TaxType,Description1,Item_x005F_x0020_Cover,listId,siteName,siteUrl,SortOrder,SmartFilters,Selectable,IsSendAttentionEmail/Id,IsSendAttentionEmail/Title,IsSendAttentionEmail/EMail&$expand=IsSendAttentionEmail&$orderby=SortOrder&$top=4999&$filter=TaxType eq '` +
      SmartTaxonomy +
      "'";

    $.ajax({
      url: url,

      method: "GET",

      headers: {
        Accept: "application/json; odata=verbose",
      },

      success: function (data) {
        AllTaskusers = data.d.results;

        $.each(AllTaskusers, function (index: any, item: any) {
          if (
            item.Title.toLowerCase() == "pse" &&
            item.TaxType == "Client Category"
          ) {
            item.newTitle = "EPS";
          } else if (
            item.Title.toLowerCase() == "e+i" &&
            item.TaxType == "Client Category"
          ) {
            item.newTitle = "EI";
          } else if (
            item.Title.toLowerCase() == "education" &&
            item.TaxType == "Client Category"
          ) {
            item.newTitle = "Education";
          } else {
            item.newTitle = item.Title;
          }

          AllMetaData.push(item);
        });

        if (SmartTaxonomy == "Categories") {
          TaxonomyItems = loadSmartTaxonomyPortfolioPopup(
            AllMetaData,
            SmartTaxonomy
          );

          setAllCategoryData(TaxonomyItems);

          TaxonomyItems?.map((items: any) => {
            if (items.Title == "Actions") {
              ShowCategoryDatabackup = ShowCategoryDatabackup.concat(
                items.childs
              );
            }
          });
        }
      },

      error: function (error: any) {
        console.log("Error:", error);
      },
    });
  };
  var loadSmartTaxonomyPortfolioPopup = (
    AllTaxonomyItems: any,
    SmartTaxonomy: any
  ) => {
    var TaxonomyItems: any = [];

    var uniqueNames: any = [];

    $.each(AllTaxonomyItems, function (index: any, item: any) {
      if (item.ParentID == 0 && SmartTaxonomy == item.TaxType) {
        TaxonomyItems.push(item);

        getChilds(item, AllTaxonomyItems);

        if (item.childs != undefined && item.childs.length > 0) {
          TaxonomyItems.push(item);
        }

        uniqueNames = TaxonomyItems.filter((val: any, id: any, array: any) => {
          return array.indexOf(val) == id;
        });
      }
    });

    return uniqueNames;
  };
  const getChilds = (item: any, items: any) => {
    item.childs = [];

    $.each(items, function (index: any, childItem: any) {
      if (
        childItem.ParentID != undefined &&
        parseInt(childItem.ParentID) == item.ID
      ) {
        childItem.isChild = true;

        item.childs.push(childItem);

        getChilds(childItem, items);
      }
    });
  };

  if (AllCategoryData?.length > 0) {
    AllCategoryData?.map((item: any) => {
      if (item.newTitle != undefined) {
        item["Newlabel"] = item.newTitle;

        AutoCompleteItems.push(item);

        if (
          item.childs != null &&
          item.childs != undefined &&
          item.childs.length > 0
        ) {
          item.childs.map((childitem: any) => {
            if (childitem.newTitle != undefined) {
              childitem["Newlabel"] =
                item["Newlabel"] + " > " + childitem.Title;

              AutoCompleteItems.push(childitem);
            }

            if (childitem.childs.length > 0) {
              childitem.childs.map((subchilditem: any) => {
                if (subchilditem.newTitle != undefined) {
                  subchilditem["Newlabel"] =
                    childitem["Newlabel"] + " > " + subchilditem.Title;

                  AutoCompleteItems.push(subchilditem);
                }
              });
            }
          });
        }
      }
    });
  }

  AutoCompleteItemsArray = AutoCompleteItems.reduce(function (
    previous: any,
    current: any
  ) {
    var alredyExists =
      previous.filter(function (item: any) {
        return item.Title === current.Title;
      }).length > 0;

    if (!alredyExists) {
      previous.push(current);
    }

    return previous;
  },
    []);
  const setSelectedCategoryData = (selectCategoryData: any, usedFor: any) => {
    setCategorySearchKey("");

    console.log(selectCategoryData);

    selectedCategoryTrue(selectCategoryData[0].Title);

    setIsComponentPicker(false);

    let data: any = CategoriesData;

    data = data.concat(selectCategoryData);

    setCategoriesData((CategoriesData) => [...data]);

    setSearchedCategoryData([]);

    // setCategoriesData(data)
  };

  // ==============CHANGE Category function==============

  const CategoryChange = (e: any, typeValue: any, IdValue: any) => {
    let statusValue: any = e.currentTarget.checked;

    let type: any = typeValue;

    let Id: any = IdValue;

    if (statusValue) {
      selectedCategoryTrue(type);

      console.log(ShowCategoryDatabackup);

      let array: any = [];

      array = array.concat(CategoriesData);

      ShowCategoryDatabackup.map((items: any) => {
        if (items.Title == type) {
          array.push(items);
        }
      });

      setCategoriesData((CategoriesData) => [...array]);
    }

    if (statusValue == false) {
      selectedCategoryFalse(type);

      console.log(ShowCategoryDatabackup);

      let array: any = [];

      array = array.concat(CategoriesData);

      array?.map((item: any, index: any) => {
        if (item.Title == type) {
          array.splice(index, 1);
        }
      });

      setCategoriesData((CategoriesData) => [...array]);
    }
  };

  const selectedCategoryFalse = (type: any) => {
    if (type == "Phone") {
      setPhoneStatus(false);
    }

    if (type == "Email Notification") {
      setEmailStatus(false);
    }

    if (type == "Immediate") {
      setImmediateStatus(false);
    }

    if (type == "Approval") {
      setApprovalStatus(false);
    }
  };

  // For first time

  const selectedCategoryTrue = (type: any) => {
    if (type == "Phone") {
      setPhoneStatus(true);
    }

    if (type == "Email Notification") {
      setEmailStatus(true);
    }

    if (type == "Immediate") {
      setImmediateStatus(true);
    }

    if (type == "Approval") {
      setApprovalStatus(true);
    }
  };

  const imageTabCallBack = React.useCallback((data: any) => {
    setEditData(data);
    console.log(EditData);
    console.log(data);
    // setEditdocumentsData(data);
  }, []);

  React.useEffect(() => {
    const categoryd = item?.Categories?.split(";");
    categoryd?.map((item: any) => {
      selectedCategoryTrue(item);
    });
  }, []);

  const toggleCategorySelection = function (item: any) {
    setCategoriesData(function (prevCategoriesData) {
      var itemIndex = -1;

      for (var i = 0; i < prevCategoriesData.length; i++) {
        if (prevCategoriesData[i].Id === item.Id) {
          itemIndex = i;
          break;
        }
      }

      if (itemIndex !== -1) {
        // Category is already selected, so remove it.
        var updatedCategoriesData = prevCategoriesData.slice(); // Create a shallow copy.
        updatedCategoriesData.splice(itemIndex, 1);
        return updatedCategoriesData;
      } else {
        // Category is not selected, so add it.
        return prevCategoriesData.concat([item]);
      }
    });
  };

  const DeleteCrossIconData = async (titleToRemove: any) => {
    try {
      let web = new Web(SelectD?.siteUrl);

      // Update the multi-lookup field for each item
      titleToRemove.length > 0 &&
        (await web.lists
          .getById(SelectD?.MasterTaskListID)
          .items.getById(titleToRemove[0])
          .update({
            PortfoliosId: {
              results: titleToRemove !== undefined ? titleToRemove : [],
            },
          })
          .then((res: any) => {
            console.log(res);
          })
          .catch((error) => {
            console.log("error", error);
          }));

      let updatedComponentData: any = [];
      updatedComponentData = filterdata.filter(
        (itemmm: any) => itemmm.Id !== titleToRemove[0]
      );
      console.log("remove data", updatedComponentData);
      setfilterData(updatedComponentData);
    } catch (error) {
      console.log(error);
    }
  };

  const choiceHandler = (event: any) => {
    setChoice(event.target.value);
  };

  const editQuestionHandler = (ques: any) => {
    setEditPopup(true);
    setDataUpdate(ques);
    ID = ques.Id;
  };

  const editHelpHandler = (help: any) => {
    setEditHelpPopup(true);
    setHelpDataUpdate(help);
    ID = help.Id;
  };

  const updateDetails = async () => {
    const questionDescription = PostQuestionDescription?.replace(
      /<[^>]+>|&nbsp;|\n/g,
      ""
    );
    try {
      await web.lists
        .getById(RequireData.SmartHelpListID)
        .items.getById(ID)
        .update({
          Title: question ? question : dataUpdate?.Title,
          Permission: choice ? choice : dataUpdate?.choice,
          Body: questionDescription
            ? questionDescription || EditData?.PostQuestionDescription || ""
            : dataUpdate?.Body,
        })
        .then(async (i: any) => {
          console.log(i);

          // Fetch the updated data and set it to SmartHelpDetails
          const updatedSmartHelpDetails = await web.lists
            .getById(RequireData.SmartHelpListID)
            .items.select(
              "Title, Id, Body, Permission, ItemType, Components/Id, Components/Title, Created, Modified, Author/Id, Author/Title, Editor/Id, Editor/Title"
            )
            .expand("Components, Author, Editor")
            .getAll();
          setSmartHelpDetails(updatedSmartHelpDetails);
          setQuestion("");
          setChoice("");
          PostQuestionDescription = "";
          setEditPopup(false);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const updateHelpDetails = async () => {
    const questionDescription = PostQuestionDescription?.replace(
      /<[^>]+>|&nbsp;|\n/g,
      ""
    );
    try {
      await web.lists
        .getById(RequireData.SmartHelpListID)
        .items.getById(ID)
        .update({
          Title: help ? help : helpDataUpdate?.Title,
          Permission: choice ? choice : helpDataUpdate?.choice,
          Body: questionDescription
            ? questionDescription || EditData?.PostQuestionDescription || ""
            : helpDataUpdate?.Body,
        })
        .then(async (i: any) => {
          console.log(i);

          // Fetch the updated data and set it to SmartHelpDetails
          const updatedSmartHelpDetails = await web.lists
            .getById(RequireData.SmartHelpListID)
            .items.select(
              "Title, Id, Body, Permission, ItemType, Components/Id, Components/Title, Created, Modified, Author/Id, Author/Title, Editor/Id, Editor/Title"
            )
            .expand("Components, Author, Editor")
            .getAll();
          setSmartHelpDetails(updatedSmartHelpDetails);
          setHelp("");
          setChoice("");
          PostQuestionDescription = "";
          setEditHelpPopup(false);
        });
    } catch (error) {
      console.log(error);
    }
  };

  // Function to delete Question and Help from Help tab section
  const deleteHandler = async (item_Id: any) => {
    await web.lists
      .getById(RequireData.SmartHelpListID)
      .items.getById(item_Id)
      .recycle()
      .then((i: any) => {
        console.log(i);
        SmartHelpDetails.map((catId: any, index: any) => {
          if (item_Id == catId.Id) {
            SmartHelpDetails.splice(index, 1);
          }
        });
      });
    setSmartHelpDetails((SmartHelpDetails: any) => [...SmartHelpDetails]);
  };

  React.useEffect(() => {
    setTimeout(() => {
      const panelMain: any = document.querySelector(".ms-Panel-main");
      if (panelMain && PortfolioTypeColor?.length > 0) {
        panelMain.style.setProperty("--SiteBlue", PortfolioTypeColor); // Set the desired color value here
      }
    }, 2000);
  }, [
    IsComponentPicker,
    imagetab,
    IsComponent,
    IsService,
    isOpenPopup,
    editPopup,
  ]);

  // Change Type functionality

  const changePortfolioType = async () => {
    let confirmation = confirm("Are you sure you want to change the type ?");
    if (confirmation) {
      let web = new Web(item.siteUrl);
      const selectedPopupItem = item.PortfolioStructureID;
      const numbersOnly = selectedPopupItem.substring(1);
      const selectedPorfolioItem = selectPortfolioType?.Title;
      let firstWord: any;

      if (selectedPorfolioItem.length > 0) {
        firstWord = selectedPorfolioItem[0];
      }

      var postData: any = {
        PortfolioTypeId: selectPortfolioType?.Id,
        PortfolioStructureID: firstWord + numbersOnly,
      };

      await web.lists
        .getById(RequireData.MasterTaskListID)
        .items.getById(item.Id)
        .update(postData)
        .then(async (res: any) => {
          if (
            item?.subRows?.length > 0 &&
            item?.subRows != undefined &&
            item?.subRows != null
          ) {
            item?.subRows?.map(async (subRow: any) => {
              if (
                subRow?.Item_x0020_Type === "SubComponent" ||
                subRow?.Item_x0020_Type === "Feature"
              ) {
                var originalString = subRow.PortfolioStructureID;
                var stringWithoutFirstLetter = originalString.substring(1);
                const selectedPorfolioItem = selectPortfolioType?.Title;
                let firstWord: any;

                if (selectedPorfolioItem.length > 0) {
                  firstWord = selectedPorfolioItem[0];
                }

                var postData1: any = {
                  PortfolioTypeId: selectPortfolioType?.Id,
                  PortfolioStructureID: firstWord + stringWithoutFirstLetter,
                };

                await web.lists
                  .getById(RequireData.MasterTaskListID)
                  .items.getById(subRow.Id)
                  .update(postData1)
                  .then(async (res: any) => {
                    if (
                      subRow?.subRows?.length > 0 &&
                      subRow?.subRows != undefined &&
                      subRow?.subRows != null
                    ) {
                      subRow?.subRows?.map(async (feat: any) => {
                        if (feat?.Item_x0020_Type === "Feature") {
                          var originalString = feat.PortfolioStructureID;
                          var stringWithoutFirstLetter =
                            originalString.substring(1);
                          const selectedPorfolioItem =
                            selectPortfolioType?.Title;
                          let firstWord: any;

                          if (selectedPorfolioItem.length > 0) {
                            firstWord = selectedPorfolioItem[0];
                          }

                          var postData2: any = {
                            PortfolioTypeId: selectPortfolioType?.Id,
                            PortfolioStructureID:
                              firstWord + stringWithoutFirstLetter,
                          };
                          await web.lists
                            .getById(RequireData.MasterTaskListID)
                            .items.getById(feat.Id)
                            .update(postData2)
                            .then(async (res: any) => {
                              setChangeType(false);
                            })
                            .catch((err: any) => { });
                        }
                      });
                    } else {
                      setChangeType(false);
                    }
                  })
                  .catch((err: any) => {
                    console.log(err);
                  });
              }
            });
          } else {
            setChangeType(false);
          }
        })
        .catch((err: any) => {
          console.log(err);
        });
    }
  };

  return (
    <>
      {console.log("All Done")}
      <Panel
        className={`${EditData?.Portfolio_x0020_Type == "Service"
            ? " serviepannelgreena"
            : ""
          }`}
        headerText={`${EditData?.Portfolio_x0020_Type}-Portfolio > ${EditData?.Title}`}
        isOpen={modalIsOpen}
        onDismiss={setModalIsOpenToFalse}
        onRenderHeader={onRenderCustomHeader}
        isBlocking={false}
        type={PanelType.large}
      >
        {EditData != undefined && EditData?.Title != undefined && (
          <div id="EditGrueneContactSearch">
            <div className="modal-body mb-5">
              <ul
                className="nav nav-tabs fixed-Header"
                id="myTab"
                role="tablist"
              >
                <li className="nav-item" role="presentation">
                  <button
                    className={
                      usedFor != "Task-Popup" ? "nav-link active" : "nav-link"
                    }
                    id="home-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#home"
                    type="button"
                    role="tab"
                    aria-controls="home"
                    aria-selected="true"
                  >
                    BASIC INFORMATION
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className={
                      usedFor == "Task-Popup" ? "nav-link active" : "nav-link"
                    }
                    id="cncept-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#concept"
                    type="button"
                    role="tab"
                    aria-controls="concept"
                    aria-selected="false"
                  >
                    CONCEPT
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="profile-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#profile"
                    type="button"
                    role="tab"
                    aria-controls="profile"
                    aria-selected="false"
                  >
                    ARCHITECTURE & TECHNOLOGIES
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="help-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#help"
                    type="button"
                    role="tab"
                    aria-controls="help"
                    aria-selected="false"
                  >
                    HELP
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="image-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#image"
                    type="button"
                    role="tab"
                    aria-controls="image"
                    aria-selected="false"
                    onClick={(e) => {
                      e.stopPropagation();
                      imageta();
                    }}
                  >
                    IMAGE INFORMATION
                  </button>
                </li>
                <li className="alignCenter ml-auto">
                  <a
                    className="mt--2 hreflink"
                    role="button"
                    onClick={() => {
                      setChangeType(true);
                    }}
                  >
                    Change Type
                  </a>
                  <span className="hover-text">
                    <span className="svg__iconbox mt-1 svg__icon--info dark"></span>
                    <span className="tooltip-text pop-left">
                      This link will be used to change the portfolio type of the
                      Component item.
                    </span>
                  </span>
                </li>
              </ul>
              <div className="tab-content clearfix " id="myTabContent">
                <div
                  className={
                    usedFor != "Task-Popup"
                      ? "tab-pane show active"
                      : "tab-pane"
                  }
                  id="home"
                  role="tabpanel"
                  aria-labelledby="home-tab"
                >
                  <div className="row  px-3 py-2">
                    <div className="col-sm-6 ">
                      <div className="col-12">
                        <div className="input-group">
                          <label className="form-label full-width">Title</label>
                          <input
                            type="text"
                            className="form-control"
                            defaultValue={
                              EditData?.Title != undefined
                                ? EditData?.Title
                                : ""
                            }
                            onChange={(e) => (EditData.Title = e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="mx-0 row ">
                        <div className="col-4 ps-0 mt-2">
                          <div className="input-group">
                            <label className="form-label full-width">
                              Item Rank
                            </label>
                            <select
                              className="w-100" style={{ paddingTop: '3px' }}
                              defaultValue={EditData?.ItemRankTitle}
                              onChange={(e) =>
                                (EditData.ItemRankTitle = e.target.value)
                              }
                            >
                              <option>
                                {EditData?.ItemRankTitle == undefined
                                  ? "select Item Rank"
                                  : EditData?.ItemRankTitle}
                              </option>
                              {CMSItemRank &&
                                CMSItemRank.map(function (h: any, i: any) {
                                  return (
                                    <option
                                      key={i}
                                      defaultValue={EditData?.ItemRankTitle}
                                    >
                                      {EditData?.ItemRankTitle == h.rankTitle
                                        ? EditData?.ItemRankTitle
                                        : h.rankTitle}
                                    </option>
                                  );
                                })}
                            </select>
                          </div>
                        </div>
                        <div className="col-4 mt-2 ps-0">
                          <div className="input-group">
                            <label className="form-label full-width">
                              Deliverable-Synonyms
                            </label>

                            <input
                              type="text"
                              className="form-control"
                              defaultValue={
                                EditData?.DeliverableSynonyms != undefined
                                  ? EditData?.DeliverableSynonyms
                                  : ""
                              }
                              onChange={(e) =>
                                (EditData.DeliverableSynonyms = e.target.value)
                              }
                            />
                          </div>
                        </div>
                        <div className="col-4 px-0 mt-2">
                          <div className="input-group">
                            <label className="form-label full-width">
                              Portfolio Item
                            </label>

                            {(linkedComponentData?.length == 0 ||
                              linkedComponentData.length !== 1) && (
                                <>
                                  <input type="text" className="form-control" onChange={(e) =>
                                    autoSuggestionsForServiceAndComponent(
                                      e,
                                      "Portfolio"
                                    )
                                  } />
                                  <span
                                    className="input-group-text"
                                    placeholder="Portfolio Item"
                                  >
                                    <span
                                      onClick={(e) => EditComponent(EditData)}
                                      className="svg__iconbox svg__icon--editBox"
                                    >
                                      {" "}
                                    </span>
                                  </span>
                                </>
                              )}
                            {SearchedServiceCompnentData?.length > 0 ? (
                              <div className="SmartTableOnTaskPopup">
                                <ul className="autosuggest-list maXh-200 scrollbar list-group">
                                  {SearchedServiceCompnentData.map((Item: any) => {
                                    return (
                                      <li
                                        className="hreflink list-group-item rounded-0 p-1 list-group-item-action"
                                        key={Item.id}
                                        onClick={() => Call([Item], "Single", "Save")}>
                                        <a>{Item.Path}</a>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>) : null} </div>

                          {linkedComponentData &&
                            linkedComponentData.length == 1 ? (
                            <div>
                              {linkedComponentData?.map(
                                (items: any, Index: any) => (
                                  <div
                                    className="full-width replaceInput pe-1 alignCenter"
                                    key={Index}
                                  >
                                    <a
                                      href={`${SelectD.siteUrl}/SitePages/Portfolio-Profile.aspx?taskId=${items.Id}`}
                                      className="textDotted hreflink"
                                      data-interception="off"
                                      target="_blank"
                                    >
                                      {items?.Title}
                                    </a>
                                    <span className="alignCenter" placeholder="Project">
                                      <span
                                        className="bg-dark svg__icon--cross svg__iconbox"
                                        onClick={() =>
                                          setLinkedComponentData([])
                                        }
                                      ></span>
                                      <span
                                        onClick={(e) => EditComponent(EditData)}
                                        className="svg__iconbox svg__icon--editBox"
                                      >
                                        {" "}
                                      </span>

                                    </span>
                                  </div>
                                )
                              )}
                            </div>
                          ) : (
                            ""
                          )}

                          {linkedComponentData &&
                            linkedComponentData.length > 1 ? (
                            <div className="w=100">
                              {linkedComponentData?.map(
                                (items: any, Index: any) => (
                                  <div
                                    className="block d-flex justify-content-between mb-1"
                                    key={Index}
                                  >
                                    <a
                                      href={`${SelectD.siteUrl}/SitePages/Portfolio-Profile.aspx?taskId=${items.Id}`}
                                      className="wid-90 light"
                                      data-interception="off"
                                      target="_blank"
                                    >
                                      {items?.Title}
                                    </a>
                                    <a className="text-end">
                                      {" "}
                                      <span
                                        className="bg-light svg__icon--cross svg__iconbox"
                                        onClick={() =>
                                          setLinkedComponentData([])
                                        }
                                      ></span>
                                    </a>

                                  </div>
                                )
                              )}
                            </div>
                          ) : (
                            ""
                          )}


                          <div className="col-sm-12  inner-tabb">
                            <div>
                              {smartComponentData
                                ? smartComponentData?.map((com: any) => {
                                  return (
                                    <>
                                      <div className="">
                                        <div
                                          className="d-flex Component-container-edit-task block "
                                          style={{ width: "81%" }}
                                        >
                                          <a
                                            style={{
                                              color: "#fff !important",
                                            }}
                                            target="_blank"
                                            href={`${RequireData.siteUrl}/SitePages/Portfolio-Profile.aspx?taskId=${com.ID}`}
                                          >
                                            {com.Title}
                                          </a>
                                          <a>
                                            <span
                                              className="bg-light svg__iconbox svg__icon--cross"
                                              onClick={() =>
                                                setSmartComponentData([])
                                              }
                                            ></span>
                                          </a>
                                        </div>
                                      </div>
                                    </>
                                  );
                                })
                                : null}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mx-0 row mt-2">
                        <div className="col-sm-4 ps-0 ">
                          <div className="input-group">
                            <label className="form-label full-width">
                              Start Date
                            </label>
                            <input
                              type="date"
                              className="form-control"
                              max="9999-12-31"
                              defaultValue={moment(EditData?.StartDate).format(
                                "YYYY-MM-DD"
                              )}
                              onChange={(e) =>
                                setEditData({
                                  ...EditData,
                                  StartDate: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                        <div className="col-sm-4 ps-0">
                          <div className="input-group">
                            <label className="form-label  full-width">
                              Due Date
                            </label>
                            <input
                              type="date"
                              className="form-control"
                              max="9999-12-31"
                              defaultValue={
                                EditData?.DueDate
                                  ? moment(EditData?.DueDate).format(
                                    "YYYY-MM-DD"
                                  )
                                  : ""
                              }
                              onChange={(e) =>
                                setEditData({
                                  ...EditData,
                                  DueDate: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                        <div className="col-sm-4 px-0">
                          <div className="input-group">
                            <label className="form-label  full-width">
                              {" "}
                              Completion Date{" "}
                            </label>
                            <input
                              type="date"
                              className="form-control"
                              max="9999-12-31"
                              defaultValue={
                                EditData?.CompletedDate
                                  ? moment(EditData?.CompletedDate).format(
                                    "YYYY-MM-DD"
                                  )
                                  : ""
                              }
                              onChange={(e) =>
                                setEditData({
                                  ...EditData,
                                  CompletedDate: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mx-0 row mt-2 ">
                        <div className="col-sm-4 ps-0 ">
                          <div className="input-group">
                            <label className="form-label  full-width">
                              Synonyms{" "}
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              defaultValue={EditData?.SynonymsTitle}
                              onChange={(e) =>
                                (EditData.SynonymsTitle = e.target.value)
                              }
                            />
                            <span
                              className="input-group-text"
                              onClick={(e) => createSynonyms(EditData)}
                            >
                              {" "}
                              <img src="https://www.shareweb.ch/site/Joint/SiteCollectionImages/ICONS/24/save.png"></img>
                            </span>
                          </div>
                          <div className="">
                            {EditData["Synonyms"] != undefined &&
                              EditData["Synonyms"].length > 0 &&
                              map(EditData["Synonyms"], (obj, index) => {
                                return (
                                  <>
                                    <div className="alignCenter block">
                                      <span className="wid90">{obj.Title}</span>
                                      <span
                                        onClick={(e) => deleteItem(EditData)}
                                        className="bg-light ml-auto svg__iconbox svg__icon--cross"
                                      ></span>
                                      {/* <img onClick={(e) => deleteItem(EditData)} src="/_layouts/images/delete.gif"></img> */}
                                    </div>
                                  </>
                                );
                              })}
                          </div>
                        </div>

                        <div className="col-sm-4 ps-0">
                          <div className="input-group">
                            <label className="form-label  full-width">
                              Client Activity{" "}
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              defaultValue={
                                EditData?.Twitter != null
                                  ? EditData?.Twitter.Description
                                  : ""
                              }
                            />
                          </div>
                        </div>

                        <div className="col-sm-4 px-0">
                          <div className="input-group">
                            <label className="form-label  full-width">
                              Package
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              defaultValue={
                                EditData?.Package != null
                                  ? EditData?.Package
                                  : ""
                              }
                              onChange={(e) =>
                                (EditData.Package = e.target.value)
                              }
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row mb-2 mt-2 ">
                        <div className="col-sm-6">
                          <div className="input-group mb-2">
                            <label className="form-label  full-width">
                              Status
                            </label>
                            <div className="editcolumn full-width">
                              {statusDropDown.map((item: any, index: any) => (
                                <div className="SpfxCheckRadio">
                                  <label key={index}>
                                    <input
                                      type="radio" className="radio"
                                      name="percentComplete"
                                      value={item.rank}
                                      defaultChecked={
                                        EditData?.PercentComplete === item.rank
                                      }
                                      onChange={handleInputChange}
                                    />
                                    {item.rankTitle}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-6">
                          <div className="input-group mb-2">
                            <label className="form-label  full-width">
                              Time{" "}
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              value={
                                EditData?.Mileage != null
                                  ? EditData?.Mileage
                                  : ""
                              }
                              onChange={(e) => changeTime(e, EditData)}
                            />
                          </div>

                          <div className="SpfxCheckRadio ">
                            <input
                              className="radio"
                              name="radioTime"
                              onChange={(e) => setTime(EditData, "05")}
                              checked={
                                EditData?.Mileage === "05" ? true : false
                              }
                              type="radio"
                            ></input>
                            <label className="form-check-label">
                              Very Quick
                            </label>
                          </div>
                          <div className="SpfxCheckRadio">
                            <input
                              className="radio"
                              name="radioTime"
                              onChange={(e) => setTime(EditData, "15")}
                              checked={
                                EditData?.Mileage === "15" ? true : false
                              }
                              type="radio"
                            ></input>

                            <label className="form-check-label">Quick </label>
                          </div>
                          <div className="SpfxCheckRadio">
                            <input
                              className="radio"
                              name="radioTime"
                              onChange={(e) => setTime(EditData, "60")}
                              checked={
                                EditData?.Mileage === "60" ? true : false
                              }
                              type="radio"
                            ></input>
                            <label className="form-check-label">Medium</label>
                          </div>
                          <div className="SpfxCheckRadio">
                            <input
                              className="radio"
                              name="radioTime"
                              onChange={(e) => setTime(EditData, "240")}
                              checked={
                                EditData?.Mileage === "240" ? true : false
                              }
                              type="radio"
                            ></input>
                            <label className="form-check-label">Long</label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-2 ">
                      <div className="col" title="Priority">
                        <div className="input-group mb-2">
                          <label className="form-label  full-width">
                            Priority
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            value={EditData?.PriorityRank}
                            onChange={(e) => setPriorityNew(e, EditData)}
                            maxLength={2}
                          />
                        </div>

                        <div className="SpfxCheckRadio">
                          <input
                            className="radio"
                            name="radioPriority"
                            type="radio"
                            value="(1) High"
                            onChange={(e) => setPriority(EditData, 8)}
                            checked={
                              EditData?.Priority === "(1) High" ? true : false
                            }
                          ></input>
                          <label> High</label>
                        </div>
                        <div className="SpfxCheckRadio">
                          <input
                            className="radio"
                            name="radioPriority"
                            type="radio"
                            value="(2) Normal"
                            onChange={(e) => setPriority(EditData, 4)}
                            checked={
                              EditData?.Priority === "(2) Normal" ? true : false
                            }
                          ></input>
                          <label> Normal</label>
                        </div>
                        <div className="SpfxCheckRadio">
                          <input
                            className="radio"
                            name="radioPriority"
                            type="radio"
                            value="(3) Low"
                            onChange={(e) => setPriority(EditData, 1)}
                            checked={
                              EditData?.Priority === "(3) Low" ? true : false
                            }
                          ></input>
                          <label> Low</label>
                        </div>
                        <div className="col mt-2">
                          <div className="input-group">
                            <div className="TaskUsers">
                              <label className="form-label full-width  mx-2">
                                Working Member
                              </label>
                              {EditData?.TeamMembers?.map(
                                (userDtl: any, index: any) => {
                                  return (
                                    <a
                                      target="_blank"
                                      href={
                                        userDtl.Item_x0020_Cover
                                          ? userDtl.Item_x0020_Cover?.Url
                                          : "https://hhhhteams.sharepoint.com/sites/HHHH/GmBH/SiteCollectionImages/ICONS/32/icon_user.jpg"
                                      }
                                    >
                                      <img
                                        ui-draggable="true"
                                        data-bs-toggle="tooltip"
                                        data-bs-placement="bottom"
                                        title={
                                          userDtl.Title ? userDtl.Title : ""
                                        }
                                        on-drop-success="dropSuccessHandler($event, $index, AssignedToUsers)"
                                        data-toggle="popover"
                                        data-trigger="hover"
                                        style={{
                                          width: "35px",
                                          height: "35px",
                                          marginLeft: "10px",
                                          borderRadius: "50px",
                                        }}
                                        src={
                                          userDtl.Item_x0020_Cover?.Url
                                            ? userDtl.Item_x0020_Cover?.Url
                                            : "https://hhhhteams.sharepoint.com/sites/HHHH/GmBH/SiteCollectionImages/ICONS/32/icon_user.jpg"
                                        }
                                      />
                                    </a>
                                  );
                                }
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row mt-2">
                        <div className="col-sm-12">
                          <div className="col-sm-12 padding-0 input-group">
                            <label className="full_width">Categories</label>
                            {(CategoriesData?.length == 0 ||
                              CategoriesData[0] == undefined ||
                              CategoriesData?.length > 1) && (
                                <>
                                  <input
                                    type="text"
                                    className="ui-autocomplete-input form-control"
                                    id="txtCategories"
                                    value={categorySearchKey}
                                    onChange={(e) =>
                                      autoSuggestionsForCategory(e)
                                    }
                                  />
                                  <span className="input-group-text">
                                    <span
                                      title="Edit Categories"
                                      onClick={() => EditComponentPicker(item)}
                                      className="svg__iconbox svg__icon--editBox"
                                    ></span>
                                  </span>
                                </>
                              )}
                            {CategoriesData &&
                              CategoriesData?.length == 1 &&
                              CategoriesData != undefined ? (
                              <div className="full-width">
                                {CategoriesData?.map(
                                  (type: any, index: number) => {
                                    return (
                                      <>
                                        {!instantCategories?.some(
                                          (selectedCat: any) =>
                                            selectedCat?.Title == type?.Title
                                        ) && (
                                            <div className="full-width replaceInput alignCenter">
                                              <a
                                                style={{
                                                  color: "#fff !important",
                                                }}
                                                target="_blank"
                                                className="textDotted hreflink"
                                                data-interception="off"
                                                href={`${SelectD.siteUrl}/SitePages/Portfolio-Profile.aspx?${item?.Id}`}
                                              >
                                                {type.Title}
                                              </a>
                                              <span className="input-group-text">
                                                {/* <span className="dark mini svg__iconbox svg__icon--cross"
                                                                                onClick={() => deleteCategories(type?.Id)}
                                                                            ></span> */}
                                                <span
                                                  title="Edit Categories"
                                                  onClick={() =>
                                                    EditComponentPicker(item)
                                                  }
                                                  className="svg__iconbox svg__icon--editBox"
                                                ></span>
                                              </span>

                                              {/* <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/_layouts/images/delete.gif" onClick={() => deleteCategories(type?.Id)} className="p-1" /> */}
                                            </div>
                                          )}
                                      </>
                                    );
                                  }
                                )}

                              </div>
                            ) : null}
                            {SearchedCategoryData?.length > 0 ? (
                              <div className="SmartTableOnTaskPopup">
                                <ul className="autosuggest-list maXh-200 scrollbar list-group">
                                  {SearchedCategoryData.map((item: any) => {
                                    return (
                                      <li
                                        className="hreflink list-group-item p-1 rounded-0 list-group-item-action"
                                        key={item.id}
                                        onClick={() =>
                                          setSelectedCategoryData(
                                            [item],
                                            "For-Auto-Search"
                                          )
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
                          {instantCategories?.map((item: any, index: any) => {
                            const isChecked = CategoriesData?.some(
                              (selectedCat: any) => selectedCat?.Id === item?.Id
                            );

                            return (
                              <div key={index} className="form-check mt-2">
                                <input
                                  className="form-check-input rounded-0"
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => toggleCategorySelection(item)}
                                />
                                <label>{item?.Title}</label>
                              </div>
                            );
                          })}
                        </div>
                        {CategoriesData &&
                          CategoriesData.length > 1 &&
                          CategoriesData != undefined ? (
                          <div>
                            {CategoriesData?.map((type: any, index: number) => {
                              return (
                                <>
                                  {!instantCategories?.some(
                                    (selectedCat: any) =>
                                      selectedCat?.Title == type?.Title
                                  ) && (
                                      <div className="block d-flex full-width justify-content-between mb-1 p-2">
                                        <a
                                          style={{ color: "#fff !important" }}
                                          target="_blank"
                                          data-interception="off"
                                          href={`${SelectD.siteUrl}/SitePages/Portfolio-Profile.aspx?${item?.Id}`}
                                        >
                                          {type.Title}
                                        </a>
                                        <span
                                          className="bg-light svg__iconbox svg__icon--cross"
                                          onClick={() =>
                                            deleteCategories(type?.Id)
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
                        <div className="col-sm-12 mt-2">
                          <div className="col-sm-12 padding-0 input-group">
                            <label className="full_width">Project</label>
                            {(filterdata?.length == 0 ||
                              filterdata.length !== 1) && (
                                <>
                                  <input
                                    type="text"
                                    className="form-control"
                                    onChange={(e) => autoSuggestionsForProject(e)}
                                  />
                                  <span
                                    className="input-group-text"
                                    placeholder="Project"
                                  >
                                    <span
                                      title="Project"
                                      onClick={(e) =>
                                        openPortfolioPopup("Project")
                                      }
                                      className="svg__iconbox svg__icon--editBox"
                                    ></span>
                                  </span>
                                </>
                              )}

                            {filterdata && filterdata.length == 1 ? (
                              //    "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Project-Management.aspx?ProjectId=4310"
                              <div className="w-100">
                                {filterdata?.map((items: any, Index: any) => (
                                  <div
                                    className="full-width replaceInput alignCenter"
                                    key={Index}
                                  >
                                    <a
                                      href={`${SelectD.siteUrl}/SitePages/Project-Management-Profile.aspx?ProjectId?=${items.Id}`}
                                      className="textDotted hreflink"
                                      data-interception="off"
                                      target="_blank"
                                    >
                                      {items?.Title}
                                    </a>
                                    <span
                                      className="input-group-text"
                                      placeholder="Project"
                                    >
                                      <span
                                        className="bg-dark svg__icon--cross svg__iconbox"
                                        onClick={() =>
                                          DeleteCrossIconData([items?.Id])
                                        }
                                      ></span>
                                      <span
                                        title="Project"
                                        onClick={(e) =>
                                          openPortfolioPopup("Project")
                                        }
                                        className="svg__iconbox svg__icon--editBox"
                                      ></span>
                                    </span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              ""
                            )}

                            {searchedProjectData?.length > 0 && (
                              <div className="SmartTableOnTaskPopup">
                                <ul className="autosuggest-list maXh-200 scrollbar list-group">
                                  {searchedProjectData.map(
                                    (suggestion: any, index: any) => (
                                      <li
                                        className="hreflink list-group-item rounded-0 p-1 list-group-item-action"
                                        key={index}
                                        onClick={() =>
                                          handleSuggestionProject(suggestion)
                                        }
                                      >
                                        {suggestion?.Title}
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div>
                            )}

                            <div className="col-sm-12  inner-tabb">
                              {filterdata && filterdata.length > 1 ? (
                                <div className="w=100">
                                  {filterdata?.map((items: any, Index: any) => (
                                    <div
                                      className="block d-flex justify-content-between mb-1"
                                      key={Index}
                                    >
                                      <a
                                        href={`${SelectD.siteUrl}/SitePages/Project-Management-Profile.aspx?ProjectId?=${items.Id}`}
                                        className="wid-90 light"
                                        data-interception="off"
                                        target="_blank"
                                      >
                                        {items?.Title}
                                      </a>
                                      <a className="text-end">
                                        {" "}
                                        <span
                                          className="bg-light svg__icon--cross svg__iconbox"
                                          onClick={() =>
                                            DeleteCrossIconData([items?.Id])
                                          }
                                        ></span>
                                      </a>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                          <div className="col-sm-12 padding-0 input-group mt-2">
                            <label className="full_width">Feature Type </label>
                            {(FeatureTypeData?.length == 0 ||
                              FeatureTypeData[0] == undefined) && (
                                <>
                                  <input
                                    type="text"
                                    className="form-control"
                                    onChange={(e) =>
                                      autoSuggestionsForFeatureType(e)
                                    }
                                  />
                                  <span
                                    className="input-group-text"
                                    placeholder="Feature Type"
                                  >
                                    <span
                                      title="Feature Type"
                                      onClick={(e) =>
                                        opensmartmetadatapopup(
                                          EditData?.FeatureType
                                        )
                                      }
                                      className="svg__iconbox svg__icon--editBox"
                                    ></span>
                                  </span>
                                </>
                              )}

                            {FeatureTypeData &&
                              FeatureTypeData?.length == 1 &&
                              FeatureTypeData?.map((item: any) => {
                                return (
                                  <>
                                    {item != undefined && (
                                      <div className="full-width replaceInput alignCenter">
                                        <a style={{ color: "#fff !important" }}>
                                          {item?.Title}
                                        </a>
                                        <span
                                          className="input-group-text"
                                          placeholder="Feature Type"
                                        >
                                          <span
                                            title="Feature Type"
                                            onClick={(e) =>
                                              opensmartmetadatapopup(
                                                EditData?.FeatureType
                                              )
                                            }
                                            className="svg__iconbox svg__icon--editBox"
                                          ></span>
                                        </span>
                                      </div>
                                    )}
                                  </>
                                );
                              })}

                            {searchFeatureType?.length > 0 && (
                              <div className="SmartTableOnTaskPopup">
                                <ul className="autosuggest-list maXh-200 scrollbar list-group">
                                  {searchFeatureType.map(
                                    (suggestion: any, index: any) => (
                                      <li
                                        className="hreflink list-group-item rounded-0 p-1 list-group-item-action"
                                        key={index}
                                        onClick={() =>
                                          handleSuggestionFeature(suggestion)
                                        }
                                      >
                                        {suggestion?.Title}
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div>
                            )}

                            {FeatureTypeData &&
                              FeatureTypeData?.length > 1 &&
                              FeatureTypeData?.map((item: any) => {
                                return (
                                  <>
                                    {item != undefined && (
                                      <div className="block d-flex full-width justify-content-between mb-1 p-2">
                                        <a style={{ color: "#fff !important" }}>
                                          {item?.Title}
                                        </a>
                                        <span
                                          className="bg-light svg__iconbox svg__icon--cross"
                                          onClick={() =>
                                            deleteFeatureItem(item?.Id)
                                          }
                                        ></span>
                                      </div>
                                    )}
                                  </>
                                );
                              })}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-4  ">
                      <div className="mb-3 mt-1">
                        {RequireData?.isShowSiteCompostion ? (
                          <div className="Sitecomposition mb-2">
                            <div className="dropdown">
                              <a className="sitebutton bg-fxdark alignCenter justify-content-between">
                                <div
                                  style={{ cursor: "pointer" }}
                                  onClick={() =>
                                    setComposition(composition ? false : true)
                                  }
                                >
                                  <span>
                                    {composition ? (
                                      <SlArrowDown />
                                    ) : (
                                      <SlArrowRight />
                                    )}
                                  </span>
                                  <span className="mx-2">Site Composition</span>
                                </div>
                                <span
                                  className="svg__iconbox svg__icon--editBox hreflink"
                                  title="Edit Site Composition"
                                  onClick={() => setSiteCompositionShow(true)}
                                ></span>
                              </a>
                              {composition &&
                                EditData?.siteCompositionData?.length > 0 &&
                                EditData?.siteCompositionData?.length > 0 ? (
                                <div className="spxdropdown-menu">
                                  <ul>
                                    {EditData?.siteCompositionData !=
                                      undefined &&
                                      EditData?.siteCompositionData?.length >
                                      0 ? (
                                      <>
                                        {EditData?.siteCompositionData?.map(
                                          (SiteDtls: any, i: any) => {
                                            return (
                                              <li className="Sitelist">
                                                <span
                                                  className="ms-2"
                                                  title={SiteDtls.Title}
                                                >
                                                  <img
                                                    style={{ width: "22px" }}
                                                    src={SiteDtls.SiteImages}
                                                  />
                                                </span>

                                                {SiteDtls.ClienTimeDescription !=
                                                  undefined && (
                                                    <span className="mx-2">
                                                      {Number(
                                                        SiteDtls.ClienTimeDescription
                                                      ).toFixed(2)}
                                                      %
                                                    </span>
                                                  )}

                                                <span className="d-inline">
                                                  {SiteDtls.ClientCategory !=
                                                    undefined &&
                                                    SiteDtls.ClientCategory
                                                      .length > 0
                                                    ? SiteDtls.ClientCategory?.map(
                                                      (
                                                        clientcat: any,
                                                        Index: any
                                                      ) => {
                                                        return (
                                                          <div
                                                            className={
                                                              Index ==
                                                                SiteDtls
                                                                  .ClientCategory
                                                                  ?.length -
                                                                1
                                                                ? "mb-0"
                                                                : "mb-0 border-bottom"
                                                            }
                                                          >
                                                            {clientcat.Title}
                                                          </div>
                                                        );
                                                      }
                                                    )
                                                    : null}
                                                </span>
                                              </li>
                                            );
                                          }
                                        )}
                                      </>
                                    ) : null}
                                  </ul>
                                </div>
                              ) : null}
                            </div>
                          </div>
                        ) : null}
                      </div>
                      <CommentCard
                        siteUrl={EditData?.siteUrl}
                        userDisplayName={EditData?.userDisplayName}
                        listName={EditData?.siteType}
                        itemID={EditData?.Id}
                        AllListId={RequireData}
                        Context={RequireData.Context}
                      ></CommentCard>
                    </div>
                    <div className="col-sm-8 taskurl">
                      <div className="input-group mb-2">
                        <label className="form-label  full-width">
                          Relevant URL
                        </label>
                        <input
                          type="text"
                          className="form-control me-1"
                          defaultValue={
                            EditData.ComponentLink != null
                              ? EditData.ComponentLink
                              : ""
                          }
                          onChange={(e) =>
                            (EditData.ComponentLink = e.target.value)
                          }
                          placeholder="Url"
                        ></input>
                        <span className="input-group-text">
                          <a
                            href={EditData.ComponentLink}
                            target="_blank"
                            data-interception="off"
                          >
                            <span className="svg__iconbox svg__icon--link"></span>
                          </a>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className={
                    usedFor == "Task-Popup"
                      ? "tab-pane show active"
                      : "tab-pane"
                  }
                  id="concept"
                  role="tabpanel"
                  aria-labelledby="profile-tab"
                >
                  <div className="row">
                    <div className="">
                      <div className="row">
                        <TeamConfigurationCard
                          ItemInfo={EditData}
                          AllListId={RequireData}
                          parentCallback={DDComponentCallBack}
                        />
                      </div>
                      <div className="row">
                        <section className="accordionbox mt-2">
                          <div className="accordion p-0  overflow-hidden">
                            <details>
                              <summary className="alignCenter">
                                <label className="toggler full_width">
                                  <div className="alignCenter">
                                    Admin Notes{" "}
                                    {`(${EditData?.AdminNotes?.length != undefined
                                        ? EditData?.AdminNotes?.length
                                        : 0
                                      })`}
                                    <span className="ml-auto"></span>
                                  </div>
                                </label>
                              </summary>
                              <div className="border border-top-0 p-2">
                                <div id="testDiv1">
                                  <textarea
                                    className="full_width"
                                    defaultValue={EditData?.AdminNotes}
                                    onChange={(e) =>
                                      (EditData.AdminNotes = e.target.value)
                                    }
                                  ></textarea>
                                </div>
                              </div>
                            </details>

                            <details>
                              <summary className="alignCenter">
                                <label className="toggler full_width">
                                  <div className="alignCenter">
                                    Description{" "}
                                    {`(${EditData?.Bodylength?.length != undefined
                                        ? EditData?.Bodylength?.length
                                        : 0
                                      })`}{" "}
                                    <span className="ml-auto">
                                      <input
                                        type="checkbox"
                                        className="form-check-input me-1 rounded-0"
                                        checked={descriptionVerifieds}
                                        onChange={
                                          handleCheckboxChangedescription
                                        }
                                      />
                                      <span className="ps-1">Verified</span>
                                    </span>
                                  </div>
                                </label>
                              </summary>
                              <div className="border border-top-0 p-2">
                                <div id="testDiv1">
                                  <HtmlEditorCard
                                    editorValue={
                                      EditData?.Body != undefined
                                        ? EditData?.Body
                                        : ""
                                    }
                                    HtmlEditorStateChange={HtmlEditorCallBack}
                                  ></HtmlEditorCard>
                                </div>
                              </div>
                            </details>

                            <details>
                              <summary className="alignCenter">
                                <label className="toggler full_width">
                                  <div className="alignCenter">
                                    Short Description{" "}
                                    {`(${EditData
                                        ?.Short_x0020_Description_x0020_Onlength
                                        ?.length != undefined
                                        ? EditData
                                          ?.Short_x0020_Description_x0020_Onlength
                                          ?.length
                                        : 0
                                      })`}{" "}
                                    <span className="ml-auto">
                                      <input
                                        type="checkbox"
                                        className="form-check-input me-1 rounded-0"
                                        checked={shortDescriptionVerifieds}
                                        onChange={handleCheckboxChange}
                                      />
                                      <span className="ps-1">Verified</span>
                                    </span>
                                  </div>
                                </label>
                              </summary>
                              <div className="border border-top-0 p-2">
                                <div id="testDiv1">
                                  <HtmlEditorCard
                                    editorValue={
                                      EditData?.Short_x0020_Description_x0020_On !=
                                        undefined
                                        ? EditData?.Short_x0020_Description_x0020_On
                                        : ""
                                    }
                                    HtmlEditorStateChange={
                                      SortHtmlEditorCallBack
                                    }
                                  ></HtmlEditorCard>
                                </div>
                              </div>
                            </details>

                            <details>
                              <summary className="alignCenter">
                                <label className="toggler full_width">
                                  <div className="alignCenter">
                                    Background{" "}
                                    {`(${EditData?.Background?.length != undefined
                                        ? EditData?.Background?.length
                                        : 0
                                      })`}
                                    <span className="ml-auto">
                                      <input
                                        type="checkbox"
                                        className="form-check-input me-1 rounded-0"
                                        checked={BackgroundVerifieds}
                                        onChange={handleCheckboxBackground}
                                      />
                                      <span className="ps-1">Verified</span>
                                    </span>
                                  </div>
                                </label>
                              </summary>
                              <div className="border border-top-0 p-2">
                                <div id="testDiv1">
                                  <textarea
                                    className="full_width"
                                    defaultValue={EditData?.Background}
                                    onChange={(e) =>
                                      (EditData.Background = e.target.value)
                                    }
                                  ></textarea>
                                </div>
                              </div>
                            </details>

                            <details>
                              <summary className="alignCenter">
                                <label className="toggler full_width">
                                  <div className="alignCenter">
                                    Idea{" "}
                                    {`(${EditData?.Idea?.length != undefined
                                        ? EditData?.Idea?.length
                                        : 0
                                      })`}{" "}
                                    <span className="ml-auto">
                                      <input
                                        type="checkbox"
                                        className="form-check-input me-1 rounded-0"
                                        checked={IdeaVerifieds}
                                        onChange={handleCheckboxIdea}
                                      />

                                      <span className="ps-1">Verified</span>
                                    </span>
                                  </div>
                                </label>
                              </summary>
                              <div className="border border-top-0 p-2">
                                <div id="testDiv1">
                                  <textarea
                                    className="full_width"
                                    defaultValue={EditData?.Idea}
                                    onChange={(e) =>
                                      (EditData.Idea = e.target.value)
                                    }
                                  ></textarea>
                                </div>
                              </div>
                            </details>

                            <details>
                              <summary className="alignCenter">
                                <label className="toggler full_width">
                                  <div className="alignCenter">
                                    Value Added{" "}
                                    {`(${EditData?.ValueAdded?.length != undefined
                                        ? EditData?.ValueAdded?.length
                                        : 0
                                      })`}
                                    <span className="ml-auto alignCenter">
                                      <input
                                        type="checkbox"
                                        className="form-check-input me-1 rounded-0"
                                        checked={ValueAddedVerifieds}
                                        onChange={handleCheckboxValueAdded}
                                      />

                                      <span className="ps-1">Verified</span>
                                    </span>
                                  </div>
                                </label>
                              </summary>
                              <div className="border border-top-0 p-2">
                                <div id="testDiv1">
                                  <textarea
                                    className="full_width"
                                    defaultValue={EditData?.ValueAdded}
                                    onChange={(e) =>
                                      (EditData.ValueAdded = e.target.value)
                                    }
                                  ></textarea>
                                </div>
                              </div>
                            </details>

                            <details>
                              <summary>
                                <label className="toggler full_width">
                                  <div className="alignCenter">
                                    {" "}
                                    Deliverables{" "}
                                    {`(${EditData?.Deliverableslength?.length !=
                                        undefined
                                        ? EditData?.Deliverableslength?.length
                                        : 0
                                      })`}
                                    <span className="alignCenter ml-auto">
                                      <input
                                        type="checkbox"
                                        className="form-check-input me-1 rounded-0"
                                        checked={DeliverablesVerifieds}
                                        onChange={handleCheckboxDeliverables}
                                      />

                                      <span className="ps-1">Verified</span>
                                    </span>
                                  </div>
                                </label>
                              </summary>
                              <div className="border border-top-0 p-2">
                                <div id="testDiv1">
                                  <HtmlEditorCard
                                    editorValue={
                                      EditData?.Deliverables != undefined
                                        ? EditData?.Deliverables
                                        : ""
                                    }
                                    HtmlEditorStateChange={
                                      DeliverablesHtmlEditorCallBack
                                    }
                                  ></HtmlEditorCard>
                                </div>
                              </div>
                            </details>
                          </div>
                        </section>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="tab-pane"
                  id="profile"
                  role="tabpanel"
                  aria-labelledby="profile-tab"
                >
                  <div className="col p-2">
                    <details>
                      <summary className="alignCenter">
                        <label className="toggler full_width">
                          <div className="alignCenter">
                            Technical Concept{" "}
                            {`(${EditData?.TechnicalExplanationslength?.length !=
                                undefined
                                ? EditData?.TechnicalExplanationslength?.length
                                : 0
                              })`}{" "}
                            <span className="ml-auto">
                              <input
                                type="checkbox"
                                className="form-check-input me-1 rounded-0"
                                checked={TechnicalExplanationsVerifieds}
                                onChange={handleCheckboxTechnicalExplanations}
                              />
                              <span className="ps-1">Verified</span>
                            </span>
                          </div>
                        </label>
                      </summary>
                      <div className="border border-top-0 p-2">
                        {CollapseExpend && (
                          <div>
                            <HtmlEditorCard
                              editorValue={
                                EditData?.TechnicalExplanations != undefined
                                  ? EditData?.TechnicalExplanations
                                  : ""
                              }
                              HtmlEditorStateChange={
                                TechnicalExplanationsHtmlEditorCallBack
                              }
                            ></HtmlEditorCard>
                          </div>
                        )}
                      </div>
                    </details>
                  </div>
                </div>
                <div
                  className="tab-pane"
                  id="help"
                  role="tabpanel"
                  aria-labelledby="help-tab"
                >
                  <div className="col p-2">
                    <section className="accordionbox">
                      <details>
                        <summary>
                          <label className="toggler full_width">
                            <div className="alignCenter">
                              Help Information{" "}
                              {`(${EditData?.Help_x0020_Informationlength
                                  ?.length != undefined
                                  ? EditData?.Help_x0020_Informationlength
                                    ?.length
                                  : 0
                                })`}
                              <span className="alignCenter ml-auto">
                                <input
                                  type="checkbox"
                                  className="form-check-input me-1 rounded-0"
                                  checked={HelpInformationVerifieds}
                                  onChange={handleCheckboxHelpInformation}
                                />
                                <span className="ps-1">Verified</span>
                              </span>
                            </div>
                          </label>
                        </summary>
                        <div className="border border-top-0 p-2">
                          <HtmlEditorCard
                            editorValue={
                              EditData?.Help_x0020_Information != undefined
                                ? EditData?.Help_x0020_Information
                                : ""
                            }
                            HtmlEditorStateChange={
                              HelpInformationHtmlEditorCallBack
                            }
                          ></HtmlEditorCard>
                        </div>
                      </details>
                    </section>
                    <div className="">
                      <div className="col-md-12">
                        <div className="col-sm-12 mb-3 mt-10 pad0">
                          <div className="col-sm-12 p-0">
                            {" "}
                            <label>Questions Description </label>
                            <a
                              className="pull-right hreflink"
                              onClick={() => setIsOpenPopup(true)}
                            >
                              Add Questions
                            </a>
                          </div>
                          <div className="borderDes p-2">
                            {SmartHelpDetails?.filter(
                              (elem: any) => elem?.ComponentsId != undefined
                            ).map((item: any) =>
                              CompoenetItem[0]?.Id ===
                                item.ComponentsId?.results[0]
                                ? item.ItemType === "Question" && (
                                  <div key={item.Id}>
                                    <details open>
                                      <summary>
                                        <label className="toggler full_width alignCenter">
                                          <span className="pull-left">
                                            {item.Title}
                                          </span>

                                          <div className="ml-auto alignCenter">
                                            <span
                                              className="svg__iconbox svg__icon--edit hreflink"
                                              onClick={() =>
                                                editQuestionHandler(item)
                                              }
                                            >
                                              Edit
                                            </span>
                                            <span
                                              className="svg__iconbox svg__icon--cross hreflink"
                                              onClick={() =>
                                                deleteHandler(item.Id)
                                              }
                                            >
                                              Delete
                                            </span>
                                          </div>
                                        </label>
                                      </summary>
                                      <div className="border border-top-0 p-2">
                                        {item.Body?.replace(/<[^>]*>/g, "")}
                                      </div>
                                    </details>
                                  </div>
                                )
                                : null
                            )}

                            {SmartHelpDetails?.filter(
                              (elem: any) => elem.ComponentsId === undefined
                            ).map((filteredItem: any) =>
                              filteredItem?.Components != undefined &&
                                CompoenetItem[0]?.Id ===
                                filteredItem?.Components[0]?.Id
                                ? filteredItem.ItemType === "Question" && (
                                  <div key={filteredItem.Id}>
                                    <details open>
                                      <summary>
                                        <label className="toggler full_width alignCenter">
                                          <span className="pull-left">
                                            {filteredItem.Title}
                                          </span>

                                          <div className="ml-auto alignCenter">
                                            <span
                                              className="svg__iconbox svg__icon--edit hreflink"
                                              onClick={() =>
                                                editQuestionHandler(
                                                  filteredItem
                                                )
                                              }
                                            >
                                              Edit
                                            </span>
                                            <span
                                              className="svg__iconbox svg__icon--cross hreflink"
                                              onClick={() =>
                                                deleteHandler(filteredItem.Id)
                                              }
                                            >
                                              Delete
                                            </span>
                                          </div>
                                        </label>
                                      </summary>
                                      <div className="border border-top-0 p-2">
                                        {filteredItem.Body?.replace(
                                          /<[^>]*>/g,
                                          ""
                                        )}
                                      </div>
                                    </details>
                                  </div>
                                )
                                : null
                            )}

                            {SmartHelpDetails.filter(
                              (elem: any) =>
                                elem.Components &&
                                elem.Components[0] &&
                                CompoenetItem[0]?.Id === elem.Components[0]?.Id
                            ).every(
                              (elem: any) => elem.ItemType !== "Question"
                            ) ? (
                              <div className="text-center p-2">
                                No Questions Description available
                              </div>
                            ) : null}
                          </div>
                          <div></div>
                        </div>
                      </div>

                      <div>
                        <div className="col-sm-12 p-0">
                          <label> Help Description </label>{" "}
                          <a
                            className="pull-right hreflink"
                            onClick={() => setOpenPopup(true)}
                          >
                            Add Help
                          </a>
                        </div>
                        <div className="borderDes p-2">
                          {SmartHelpDetails?.filter(
                            (elem: any) => elem?.ComponentsId != undefined
                          ).map((item: any) =>
                            CompoenetItem[0]?.Id ===
                              item.ComponentsId?.results[0]
                              ? item.ItemType === "Help" && (
                                <div key={item.Id}>
                                  <details open>
                                    <summary>
                                      <label className="toggler full_width alignCenter">
                                        <span className="pull-left">
                                          {item.Title}
                                        </span>

                                        <div className="ml-auto alignCenter">
                                          <span
                                            className="svg__iconbox svg__icon--edit hreflink"
                                            onClick={() =>
                                              editHelpHandler(item)
                                            }
                                          >
                                            Edit
                                          </span>
                                          <span
                                            className="svg__iconbox svg__icon--cross hreflink"
                                            onClick={() =>
                                              deleteHandler(item.Id)
                                            }
                                          >
                                            Delete
                                          </span>
                                        </div>
                                      </label>
                                    </summary>
                                    <div className="border border-top-0 p-2">
                                      {item.Body?.replace(/<[^>]*>/g, "")}
                                    </div>
                                  </details>
                                </div>
                              )
                              : null
                          )}

                          {SmartHelpDetails?.filter(
                            (elem: any) => elem?.ComponentsId === undefined
                          ).map((filteredItem: any) =>
                            filteredItem?.Components != undefined &&
                              CompoenetItem[0]?.Id ===
                              filteredItem?.Components[0]?.Id
                              ? filteredItem.ItemType === "Help" && (
                                <div key={filteredItem.Id}>
                                  <details open>
                                    <summary>
                                      <label className="toggler full_width alignCenter">
                                        <span className="pull-left">
                                          {filteredItem.Title}
                                        </span>

                                        <div className="ml-auto alignCenter">
                                          <span
                                            className="svg__iconbox svg__icon--edit hreflink"
                                            onClick={() =>
                                              editHelpHandler(filteredItem)
                                            }
                                          >
                                            Edit
                                          </span>
                                          <span
                                            className="svg__iconbox svg__icon--cross hreflink"
                                            onClick={() =>
                                              deleteHandler(filteredItem.Id)
                                            }
                                          >
                                            Delete
                                          </span>
                                        </div>
                                      </label>
                                    </summary>
                                    <div className="border border-top-0 p-2">
                                      {filteredItem.Body?.replace(
                                        /<[^>]*>/g,
                                        ""
                                      )}
                                    </div>
                                  </details>
                                </div>
                              )
                              : null
                          )}

                          {SmartHelpDetails && CompoenetItem[0] ? (
                            SmartHelpDetails.filter(
                              (elem: any) =>
                                elem.Components &&
                                elem.Components[0] &&
                                CompoenetItem[0]?.Id === elem.Components[0]?.Id
                            ).every((elem: any) => elem.ItemType !== "Help") ? (
                              <div className="text-center p-2">
                                No Help Description available
                              </div>
                            ) : null
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="tab-pane"
                  id="image"
                  role="tabpanel"
                  aria-labelledby="image-tab"
                >
                  <div className="col-sm-12">
                    {imagetab && (
                      <ImagesC
                        EditdocumentsData={EditData}
                        setData={setEditData}
                        AllListId={RequireData}
                        Context={RequireData.Context}
                        callBack={imageTabCallBack}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <footer
              className="bg-f4 fixed-bottom"
              style={{ position: "absolute" }}
            >
              <div className="align-items-center d-flex justify-content-between px-4 py-2">
                <div>
                  <div className="text-left">
                    Created{" "}
                    <span ng-bind="EditData?.Created | date:'MM-DD-YYYY'">
                      {" "}
                      {EditData.Created
                        ? moment(EditData.Created).format("DD/MM/YYYY")
                        : ""}
                    </span>{" "}
                    by
                    <span className="panel-title ps-1">
                      {EditData?.Author?.Title != undefined
                        ? EditData?.Author?.Title
                        : ""}
                    </span>
                  </div>
                  <div className="text-left">
                    Last modified{" "}
                    <span>
                      {EditData.Modified
                        ? moment(EditData.Modified).format("DD/MM/YYYY")
                        : ""}
                    </span>{" "}
                    by{" "}
                    <span className="panel-title">
                      {EditData?.Editor.Title != undefined
                        ? EditData?.Editor.Title
                        : ""}
                    </span>
                  </div>
                  <div className="text-left">
                    <a onClick={() => deleteTask()}>
                      <span style={{ marginLeft: '-4px' }} className="alignIcon svg__iconbox hreflink mini svg__icon--trash"></span>
                      Delete This Item
                    </a>
                    <span>
                      {" "}
                      {EditData?.ID ? (
                        <VersionHistoryPopup
                          RequiredListIds={RequireData}
                          taskId={EditData?.ID}
                          listId={RequireData.MasterTaskListID}
                          siteUrls={RequireData?.siteUrl}
                        />
                      ) : (
                        ""
                      )}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="footer-right">
                    <span>
                      <a
                        className="me-1"
                        target="_blank"
                        data-interception="off"
                        href={`${RequireData.siteUrl}/SitePages/Portfolio-Profile.aspx?taskId=${EditData?.Id}`}
                      >
                        {/* <img src="https://hhhhteams.sharepoint.com/sites/HHHH/_layouts/15/images/ichtm.gif?rev=23" />{" "} */}
                        Go To Profile Page
                      </a>
                      ||
                      {/* <img
                      className="mail-width mx-2"
                      src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/32/icon_maill.png"
                    /> */}
                      <span className="hreflink mx-1 siteColor f-mailicons">
                        <span
                          title="Edit Task"
                          className="alignIcon svg__iconbox svg__icon--mail"
                        ></span>
                      </span>
                      <a
                        href={`mailto:?subject=${"Test"}&body=${EditData?.ComponentLink
                          }`}
                      >
                        {" "}
                        Share This Task ||
                      </a>
                    </span>

                    <a
                      className="p-1"
                      href={`${RequireData.siteUrl}/Lists/Master%20Tasks/EditForm.aspx?ID=${EditData?.Id}`}
                      target="_blank"
                      data-interception="off"
                    >
                      Open Out-of-The-Box Form
                    </a>
                    <button
                      type="button"
                      className="btn btn-primary ms-2 px-4"
                      onClick={(e) => SaveData()}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="btn btn-default btn-default ms-1"
                      onClick={setModalIsOpenToFalse}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </footer>

            {IsComponent ? (
              <ServiceComponentPortfolioPopup
                props={CMSToolComponent}
                Dynamic={RequireData}
                ComponentType={"Component"}
                Call={Call}
                selectionType={"Single"}
              />
            ) : null}

            {isopenProjectpopup ? (
              <ServiceComponentPortfolioPopup
                props={filterdata}
                Dynamic={SelectD}
                ComponentType={"Component"}
                selectionType={"Multi"}
                Call={(Call: any, type: any, functionType: any) => {
                  callServiceComponent(Call, type, functionType);
                }}
                updateMultiLookup={updateMultiLookup}
                showProject={isopenProjectpopup}
              />
            ) : null}

            {IsComponentPicker && (
              <Picker
                props={TaskCat}
                Call={Call}
                usedFor="Task-Footertable"
                selectedCategoryData={CategoriesData}
                AllListId={RequireData}
              ></Picker>
            )}
          </div>
        )}
      </Panel>
      <Panel
        onRenderHeader={onRenderCustomHeaderQuestion}
        isOpen={isOpenPopup}
        isBlocking={!isOpenPopup}
        onDismiss={() => setIsOpenPopup(false)}
        closeButtonAriaLabel="Close"
        type={PanelType.large}
      >
        <div className="modal-body clearfix">
          <div className="input-group mb-2">
            <label className="form-label full-width">Title</label>
            <input
              type="text"
              className="form-control"
              defaultValue={`${CompoenetItem[0]?.Title} - ${question}`}
              onChange={(e) => setQuestion(e.target.value)}
            ></input>
          </div>
          <div className="mb-2">
            <label className="form-label">Description</label>
            <div>
              <HtmlEditorCard
                editorValue={
                  EditData.QuestionDescription != undefined
                    ? EditData.QuestionDescription
                    : ""
                }
                HtmlEditorStateChange={QuestionDescriptionEditorCallBack}
              ></HtmlEditorCard>
            </div>
          </div>
        </div>
        <footer className="modal-footer">
          <button className="btn btn-primary" onClick={() => AddQuestionFunc()}>
            Save
          </button>
          <button
            className="btn btn-default ms-1"
            onClick={() => setIsOpenPopup(false)}
          >
            Cancel
          </button>
        </footer>
      </Panel>

      <Panel
        isOpen={editPopup}
        isBlocking={!editPopup}
        onDismiss={() => setEditPopup(false)}
        closeButtonAriaLabel="Close"
        onRenderHeader={onRenderHeaderQuestionEdit}
        type={PanelType.large}
      >
        <div className="modal-body clearfix">
          <div className="input-group mb-2">
            <label className="form-label full-width">Title</label>
            <input
              className="form-control"
              type="text"
              defaultValue={dataUpdate?.Title}
              onChange={(e) => {
                setQuestion(e.target.value);
              }}
            ></input>
          </div>

          <div className="mb-2">
            <label className="form-label full-width">Description</label>
            <div>
              <HtmlEditorCard
                editorValue={
                  EditData.QuestionDescription != undefined
                    ? EditData.QuestionDescription
                    : dataUpdate?.Body
                }
                HtmlEditorStateChange={QuestionDescriptionEditorCallBack}
              ></HtmlEditorCard>
            </div>
          </div>
        </div>
        <footer className="footer-right">
          <div className="align-items-center d-flex justify-content-between">
            <div>
              <div className="text-left">
                Created{" "}
                <span ng-bind="dataUpdate?.Created | date:'MM-DD-YYYY'">
                  {" "}
                  {dataUpdate?.Created
                    ? moment(dataUpdate?.Created).format("DD/MM/YYYY")
                    : ""}
                </span>{" "}
                by
                <span className="panel-title ps-1 hreflink">
                  {dataUpdate?.Author?.Title != undefined
                    ? dataUpdate?.Author?.Title
                    : ""}
                </span>
              </div>
              <div className="text-left">
                Last modified{" "}
                <span>
                  {dataUpdate?.Modified
                    ? moment(dataUpdate?.Modified).format("DD/MM/YYYY")
                    : ""}
                </span>{" "}
                by{" "}
                <span className="panel-title hreflink">
                  {dataUpdate?.Editor?.Title != undefined
                    ? dataUpdate?.Editor?.Title
                    : ""}
                </span>
              </div>
              <div className="text-left">
                <span className="hreflink">
                  {" "}
                  {dataUpdate?.ID ? (
                    <VersionHistoryPopup
                      taskId={dataUpdate?.ID}
                      listId={RequireData?.SmartHelpListID}
                      siteUrls={RequireData?.siteUrl}
                    />
                  ) : (
                    ""
                  )}
                </span>
              </div>
            </div>
            <div className="">
              <button
                className="me-1 btn btn-primary"
                onClick={() => updateDetails()}
              >
                Save
              </button>
              <button
                className="btn btn-default"
                onClick={() => setEditPopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </footer>
      </Panel>
      <Panel
        isOpen={openPopup}
        isBlocking={!openPopup}
        onDismiss={() => setOpenPopup(false)}
        closeButtonAriaLabel="Close"
        onRenderHeader={onRenderCustomHeaderHelp}
        type={PanelType.large}
      >
        <div className="modal-body clearfix">
          <div className="input-group mb-2">
            <label className="form-label full-width">Title</label>
            <input
              type="text"
              className="form-control"
              defaultValue={`${CompoenetItem[0]?.Title} - ${help}`}
              onChange={(e) => {
                setHelp(e.target.value);
              }}
            ></input>
          </div>

          <div className="mb-2">
            <label className="form-label full-width">Description</label>
            <div>
              <HtmlEditorCard
                editorValue={
                  EditData?.TechnicalExplanations != undefined
                    ? EditData?.TechnicalExplanations
                    : ""
                }
                HtmlEditorStateChange={QuestionDescriptionEditorCallBack}
              ></HtmlEditorCard>
            </div>
          </div>
        </div>
        <footer className="modal-footer">
          <button
            className="me-1 btn btn-primary"
            onClick={() => AddHelpFunc()}
          >
            Save
          </button>
          <button
            className="btn btn-default"
            onClick={() => setOpenPopup(false)}
          >
            Cancel
          </button>
        </footer>
      </Panel>
      <Panel
        isOpen={editHelpPopup}
        isBlocking={!editHelpPopup}
        onDismiss={() => setEditHelpPopup(false)}
        closeButtonAriaLabel="Close"
        onRenderHeader={onRenderHeaderHelpEdit}
        type={PanelType.large}
      >
        <div className="modal-body clearfix">
          <div className="input-group mb-2">
            <label className="form-label full-width">Title</label>
            <input
              type="text"
              className="form-control"
              defaultValue={helpDataUpdate?.Title}
              onChange={(e) => {
                setHelp(e.target.value);
              }}
            ></input>
          </div>
          <div className="mb-2">
            <label className="form-label">Description</label>
            <div>
              <HtmlEditorCard
                editorValue={
                  EditData.QuestionDescription != undefined
                    ? EditData.QuestionDescription
                    : helpDataUpdate?.Body
                }
                HtmlEditorStateChange={QuestionDescriptionEditorCallBack}
              ></HtmlEditorCard>
            </div>
          </div>
        </div>
        <footer className="footer-right">
          <div className="align-items-center d-flex justify-content-between">
            <div>
              <div className="text-left">
                Created{" "}
                <span ng-bind="helpDataUpdate?.Created | date:'MM-DD-YYYY'">
                  {" "}
                  {helpDataUpdate?.Created
                    ? moment(helpDataUpdate?.Created).format("DD/MM/YYYY")
                    : ""}
                </span>{" "}
                by
                <span className="panel-title ps-1 hreflink">
                  {helpDataUpdate?.Author?.Title != undefined
                    ? helpDataUpdate?.Author?.Title
                    : ""}
                </span>
              </div>
              <div className="text-left">
                Last modified{" "}
                <span>
                  {helpDataUpdate?.Modified
                    ? moment(helpDataUpdate?.Modified).format("DD/MM/YYYY")
                    : ""}
                </span>{" "}
                by{" "}
                <span className="panel-title hreflink">
                  {helpDataUpdate?.Editor?.Title != undefined
                    ? helpDataUpdate?.Editor?.Title
                    : ""}
                </span>
              </div>
              <div className="text-left">
                <span className="hreflink">
                  {" "}
                  {helpDataUpdate?.ID ? (
                    <VersionHistoryPopup
                      taskId={helpDataUpdate?.ID}
                      listId={RequireData?.SmartHelpListID}
                      siteUrls={RequireData?.siteUrl}
                    />
                  ) : (
                    ""
                  )}
                </span>
              </div>
            </div>
            <div className="">
              <button
                className="me-1 btn btn-primary"
                onClick={() => updateHelpDetails()}
              >
                Save
              </button>
              <button
                className="btn btn-default"
                onClick={() => setEditHelpPopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </footer>
      </Panel>
      {/*change portfolio type */}
      <Panel
        className={`${EditData?.Portfolio_x0020_Type == "Service"
            ? " serviepannelgreena"
            : ""
          }`}
        onRenderHeader={onRenderHeaderChangeParent}
        isOpen={changeType}
        onDismiss={() => {
          setChangeType(false);
        }}
        isBlocking={false}
        type={PanelType.medium}
      >
        <div className="modal-body clearfix">
          {portfolioTypeData?.map((value: any) => (
            <div key={value.ID} className="SpfxCheckRadio">
              <input
                className="radio"
                type="radio"
                name="selectedTitle"
                value={value.Title}
                checked={selectPortfolioType.Title === value.Title}
                onChange={() => setSelectPortfolioType(value)}
              />
              {value.Title}
            </div>
          ))}
        </div>
        <footer className="footer-right">
          <div className="align-items-center d-flex justify-content-between">
            <div>
              <div className="text-left">
                Created{" "}
                <span
                  className="hreflink"
                  ng-bind="EditData?.Created | date:'MM-DD-YYYY'"
                >
                  {" "}
                  {EditData?.Created
                    ? moment(EditData?.Created).format("DD/MM/YYYY")
                    : ""}
                </span>{" "}
                by
                <span className="panel-title ps-1 hreflink">
                  {EditData?.Author?.Title != undefined
                    ? EditData?.Author?.Title
                    : ""}
                </span>
              </div>
              <div className="text-left">
                Last modified{" "}
                <span>
                  {EditData?.Modified
                    ? moment(EditData?.Modified).format("DD/MM/YYYY")
                    : ""}
                </span>{" "}
                by{" "}
                <span className="panel-title hreflink">
                  {EditData?.Editor?.Title != undefined
                    ? EditData?.Editor?.Title
                    : ""}
                </span>
              </div>
              <div className="text-left">
                <span className="hreflink">
                  {" "}
                  {EditData?.ID ? (
                    <VersionHistoryPopup
                      taskId={EditData?.ID}
                      listId={RequireData.MasterTaskListID}
                      siteUrls={RequireData?.siteUrl}
                    />
                  ) : (
                    ""
                  )}
                </span>
              </div>
            </div>
            <div>
              <button className="btn btn-primary" onClick={changePortfolioType}>
                Save
              </button>
              <button
                className="btn btn-default ms-1"
                onClick={() => setChangeType(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </footer>
      </Panel>
      {SiteCompositionShow && EditData?.Title && (
        <CentralizedSiteComposition
          ItemDetails={EditData}
          RequiredListIds={RequireData}
          closePopupCallBack={ClosePopupCallBack}
          usedFor={"CSF"}
        />
      )}
      {Smartdatapopup && (
        <Smartmetadatapickerin
          props={FeatureTypeData}
          Call={Smartmetadatafeature}
          selectedFeaturedata={Smartdata}
          AllListId={RequireData}
          TaxType="Feature Type"
          usedFor="Single"
        ></Smartmetadatapickerin>
      )}
    </>
  );
}
export default EditInstitution;