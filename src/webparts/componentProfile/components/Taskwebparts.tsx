import * as React from "react";
import * as $ from "jquery";
import Modal from "react-bootstrap/Modal";
import * as Moment from "moment";
import Button from "react-bootstrap/Button";
import { map } from "jquery";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaAngleDown,
  FaAngleUp,
} from "react-icons/fa";
import { MdAdd } from "react-icons/Md";
import Tooltip from "../../../globalComponents/Tooltip";
import Dropdown from "react-bootstrap/Dropdown";
import EditInstituton from "../../EditPopupFiles/EditComponent";
import { create } from "lodash";
import EditTaskPopup from "../../../globalComponents/EditTaskPopup/EditTaskPopup";
import TimeEntryPopup from "../../../globalComponents/TimeEntry/TimeEntryComponent";
import * as globalCommon from "../../../globalComponents/globalCommon";
import { GlobalConstants } from "../../../globalComponents/LocalCommon";
import pnp, { Web, SearchQuery, SearchResults, UrlException } from "sp-pnp-js";
import PortfolioStructureCreationCard from "../../../globalComponents/tableControls/PortfolioStructureCreation";
import ShowTaskTeamMembers from "../../../globalComponents/ShowTaskTeamMembers";
import ExpndTable from "../../../globalComponents/ExpandTable/Expandtable";
import { Panel, PanelType } from "office-ui-fabric-react";
import CreateWS from "../../servicePortfolio/components/CreateWS";
import CreateActivity from "../../servicePortfolio/components/CreateActivity";
var filt: any = "";
var siteConfig: any = [];
var IsUpdated: any = "";
let serachTitle: any = "";
var MeetingItems: any = [];
var childsData: any = [];
var selectedCategory: any = [];
var AllItems: any = [];
let IsShowRestru: any = false;
let ChengedTitle: any = "";
export default function ComponentTable({ props,NextProp }: any) {
  
  const [maidataBackup, setmaidataBackup] = React.useState([]);
  const [search, setSearch]: [string, (search: string) => void] =
    React.useState("");
  const [data, setData] = React.useState([]);
  const [Title, setTitle] = React.useState();
  const [ComponentsData, setComponentsData] = React.useState([]);
  const [SubComponentsData, setSubComponentsData] = React.useState([]);
  const [FeatureData, setFeatureData] = React.useState([]);
  const [table, setTable] = React.useState(data);
  const [AllUsers, setTaskUser] = React.useState([]);
  const [modalIsOpen, setModalIsOpen] = React.useState(false);
  const [addModalOpen, setAddModalOpen] = React.useState(false);
  const [count, setCount] = React.useState(0);
  const [filterGroups, setFilterGroups] = React.useState([]);
  const [filterItems, setfilterItems] = React.useState([]);
  // const [AllMetadata, setMetadata] = React.useState([])
  const [IsComponent, setIsComponent] = React.useState(false);
  const [SharewebComponent, setSharewebComponent] = React.useState("");
  const [IsTask, setIsTask] = React.useState(false);
  const [SharewebTask, setSharewebTask] = React.useState("");
  const [SharewebTimeComponent, setSharewebTimeComponent] = React.useState([]);
  const [IsTimeEntry, setIsTimeEntry] = React.useState(false);
  const [ShowSelectdSmartfilter, setShowSelectdSmartfilter] = React.useState(
    []
  );
  const [checked, setchecked] = React.useState([]);
  const [checkedList, setCheckedList] = React.useState([]);
  const [Isshow, setIsshow] = React.useState(false);
  const [tablecontiner, settablecontiner]: any = React.useState("hundred");
  const [MeetingPopup, setMeetingPopup] = React.useState(false);
  const [WSPopup, setWSPopup] = React.useState(false);
  const [ActivityPopup, setActivityPopup] = React.useState(false);
  const [ActivityDisable, setActivityDisable] = React.useState(false);
  const [OldArrayBackup, setOldArrayBackup] = React.useState([]);
  //  For selected client category
  const [items, setItems] = React.useState<any>([]);
  const [NewArrayBackup, setNewArrayBackup] = React.useState([]);
  const [ResturuningOpen, setResturuningOpen] = React.useState(false);
  const [RestructureChecked, setRestructureChecked] = React.useState([]);
  const [ChengedItemTitl, setChengedItemTitle] = React.useState("");


  // CustomHeader of the Add Structure
  
  const onRenderCustomHeader = () => {
    return (
        <div className= {IsUpdated == "Service" ? 'd-flex full-width pb-1 serviepannelgreena' : 'd-flex full-width pb-1'} >
        
            <div style={{ marginRight: "auto", fontSize: "20px", fontWeight: "600", marginLeft: '20px' }}>
                <span>
                 
                {(props!=undefined||checkedList[0]!=undefined) &&
                <>
                 <a href={NextProp.siteUrl+"/SitePages/Portfolio-Profile.aspx?taskId="+checkedList[0]?.Id}><img className="icon-sites-img" src={checkedList[0]?.SiteIcon} />{(props!=undefined&&checkedList[0]===undefined)?props.Title:checkedList[0].Title}- Create Child Item</a>
                
                </>
                }
                </span>
            </div>
            <Tooltip ComponentId={1272} />
        </div>
    );
};

// CustomHeader of the Add Structure End

  function handleClick(item: any) {
    const index = items.indexOf(item);
    if (index !== -1) {
      // Item already exists, remove it
      const newItems = [...items];
      newItems.splice(index, 1);
      setItems(newItems);
    } else {
      // Item doesn't exist, add it
      items.Title = item.Title;
      items.Id = item.Id;
      items.Title = item.Title;
      items.Id = item.Id;
      setItems([...items, item]);
    }
  }

  //--------------SmartFiltrt--------------------------------------------------------------------------------------------------------------------------------------------------
  IsUpdated = props?.Portfolio_x0020_Type;
  // for smarttime

  //Open activity popup
  const onRenderCustomHeaderMain = () => {
    return (
      <div className="d-flex full-width pb-1">
        <div
          style={{
            marginRight: "auto",
            fontSize: "20px",
            fontWeight: "600",
            marginLeft: "20px",
          }}
        >
          <span>{`Create Activity ${MeetingItems[0]?.Title}`}</span>
        </div>
        <Tooltip ComponentId={MeetingItems[0]?.Id} />
      </div>
    );
  };

  

  const groupbyTasks = function (TaskArray: any, item: any) {
    item.childs = item.childs != undefined ? item.childs : [];
   
    let Allworkstream = $.grep(AllTasks, function (type: any) {
      return type.ParentTask?.Id == item.Id;
    });
    if (Allworkstream != undefined && Allworkstream.length > 0) {
      Allworkstream.forEach((activ: any) => {
        if (activ.ParentTask?.Id != undefined) {
          activ.tagged = true;
          activ.show = true;
          item.downArrowIcon =
            IsUpdated != undefined && IsUpdated == "Service"
              ? GlobalConstants.MAIN_SITE_URL +
                "/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png"
              : GlobalConstants.MAIN_SITE_URL +
                "/SP/SiteCollectionImages/ICONS/24/list-icon.png";
          item.RightArrowIcon =
            IsUpdated != undefined && IsUpdated == "Service"
              ? GlobalConstants.MAIN_SITE_URL +
                "/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png"
              : GlobalConstants.MAIN_SITE_URL +
                "/SP/SiteCollectionImages/ICONS/24/right-list-icon.png";

          item.childs.push(activ);
          activ.childs = activ.childs != undefined ? activ.childs : [];
          let Allworkstream = $.grep(AllTasks, function (type: any) {
            return type.ParentTask?.Id == activ.Id;
          });
          {
            if (Allworkstream != undefined && Allworkstream.length > 0) {
              Allworkstream.forEach((subactiv: any) => {
                subactiv.tagged = true;
                activ.downArrowIcon =
                  IsUpdated != undefined && IsUpdated == "Service"
                    ? GlobalConstants.MAIN_SITE_URL +
                      "/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png"
                    : GlobalConstants.MAIN_SITE_URL +
                      "/SP/SiteCollectionImages/ICONS/24/list-icon.png";
                activ.RightArrowIcon =
                  IsUpdated != undefined && IsUpdated == "Service"
                    ? GlobalConstants.MAIN_SITE_URL +
                      "/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png"
                    : GlobalConstants.MAIN_SITE_URL +
                      "/SP/SiteCollectionImages/ICONS/24/right-list-icon.png";

                activ.childs.push(subactiv);
              });
            }
          }
        } else {
          activ.tagged = true;
          item.childs.push(activ);
        }
      });
    }
    // }

    // })
  };

  const LoadAllSiteTasks = function (filterarray: any) {
    var Response: any = [];
    var Counter = 0;
    filterarray.forEach((filter: any) => {
      map(siteConfig, async (config: any) => {
        if (config.Title != "Master Tasks" && config.Title != "SDC Sites") {
          try {
            let AllTasksMatches = [];
            var select =
              "SharewebTaskLevel2No,ParentTask/Title,ParentTask/Id,Services/Title,ClientTime,SharewebTaskLevel1No,Services/Id,Events/Id,Events/Title,ItemRank,Portfolio_x0020_Type,TimeSpent,BasicImageInfo,CompletedDate,Shareweb_x0020_ID, Responsible_x0020_Team/Id,Responsible_x0020_Team/Title,SharewebCategories/Id,SharewebCategories/Title,ParentTask/Shareweb_x0020_ID,SharewebTaskType/Id,SharewebTaskType/Title,SharewebTaskType/Level, Priority_x0020_Rank, Team_x0020_Members/Title, Team_x0020_Members/Name, Component/Id,Component/Title,Component/ItemType, Team_x0020_Members/Id, Item_x002d_Image,component_x0020_link,IsTodaysTask,AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,  ClientCategory/Id, ClientCategory/Title, FileLeafRef, FeedBack, Title, Id, PercentComplete,StartDate, DueDate, Comments, Categories, Status, Body, Mileage,PercentComplete,ClientCategory,Priority,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title&$expand=ParentTask,Events,Services,SharewebTaskType,AssignedTo,Component,ClientCategory,Author,Editor,Team_x0020_Members,Responsible_x0020_Team,SharewebCategories&$filter=" +
              filter +
              "";
            AllTasksMatches = await globalCommon.getData(
              NextProp.siteUrl,
              config.listId,
              select
            );
            Counter++;
            if (AllTasksMatches != undefined && AllTasksMatches.length > 0) {
              $.each(AllTasksMatches, function (index: any, item: any) {
                item.isDrafted = false;
                item.flag = true;
                item.siteType = config.Title;
                item.childs = [];
                item.TitleNew = item.Title;
                item.listId = config.listId;
                item.siteUrl = NextProp.siteUrl;
                if (item.SharewebCategories != undefined) {
                  if (item.SharewebCategories.length > 0) {
                    $.each(
                      item.SharewebCategories,
                      function (ind: any, value: any) {
                        if (value.Title.toLowerCase() == "draft") {
                          item.isDrafted = true;
                        }
                      }
                    );
                  }
                }
              });
            }
            AllTasks = AllTasks.concat(AllTasksMatches);
            AllTasks = $.grep(AllTasks, function (type: any) {
              return type.isDrafted == false;
            });

            if (
              Counter ===
              (filterarray.length === 1
                ? siteConfig.length
                : siteConfig.length * filterarray.length)
            ) {
              map(AllTasks, (result: any) => {
                result.CreatedDateImg = [];
                result.TeamLeaderUserTitle = "";
                result.Display = "none";
                result.DueDate = Moment(result.DueDate).format("DD/MM/YYYY");

                if (result.DueDate == "Invalid date" || "") {
                  result.DueDate = result.DueDate.replaceAll(
                    "Invalid date",
                    ""
                  );
                }
                result.PercentComplete = (result.PercentComplete * 100).toFixed(
                  0
                );

                if (result.Short_x0020_Description_x0020_On != undefined) {
                  result.Short_x0020_Description_x0020_On =
                    result.Short_x0020_Description_x0020_On.replace(
                      /(<([^>]+)>)/gi,
                      ""
                    );
                }

                if (result.Author != undefined) {
                  if (result.Author.Id != undefined) {
                    $.each(TaskUsers, function (index: any, users: any) {
                      if (
                        result.Author.Id != undefined &&
                        users.AssingedToUser != undefined &&
                        result.Author.Id == users.AssingedToUser.Id
                      ) {
                        users.ItemCover = users.Item_x0020_Cover.Url;
                        result.CreatedDateImg.push(users);
                      }
                    });
                  }
                }
                result["SiteIcon"] = globalCommon.GetIconImageUrl(
                  result.siteType,
                  GlobalConstants.MAIN_SITE_URL + "/SP",
                  undefined
                );
                if (
                  result.ClientCategory != undefined &&
                  result.ClientCategory.length > 0
                ) {
                  map(result.Team_x0020_Members, (catego: any) => {
                    result.ClientCategory.push(catego);
                  });
                }
                if (result.Id === 498 || result.Id === 104) console.log(result);
                result["Shareweb_x0020_ID"] = globalCommon.getTaskId(result);
                if (result["Shareweb_x0020_ID"] == undefined) {
                  result["Shareweb_x0020_ID"] = "";
                }
                result["Item_x0020_Type"] = "Task";

                result.Portfolio_x0020_Type = "Component";
                TasksItem.push(result);
              });
              let AllAcivities = $.grep(AllTasks, function (type: any) {
                return type.SharewebTaskType?.Title == "Activities";
              });
              if (AllAcivities != undefined && AllAcivities.length > 0) {
                AllAcivities.forEach((activ: any) => {
                  if (activ.Id != undefined) {
                    groupbyTasks(AllTasks, activ);
                    AllTasks.forEach((obj: any) => {
                      if (obj.Id === activ.Id) {
                        obj.show = false;
                        obj.childs = activ.childs;
                        obj.childsLength = activ.childs.length;
                      }
                    });
                  }
                });
              }
              AllTasks = $.grep(AllTasks, function (type: any) {
                return type.tagged != true;
              });
              TasksItem = AllTasks;
            
              map(TasksItem, (task: any) => {
                if (!isItemExistsNew(CopyTaskData, task)) {
                  CopyTaskData.push(task);
                }
              });

              // bindData();
              makeFinalgrouping();
            }
          } catch (error) {
            console.log(error);
          }
        } else Counter++;
      });
    });
  };

  const handleOpen = (item: any) => {
    item.show = item.show = item.show == true ? false : true;
    setData((maidataBackup) => [...maidataBackup]);
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
            });
          }
        });
      }
    });
    setIsshow(Isshow1);
    setData((data) => [...data]);
  };

  const addModal = () => {
    setAddModalOpen(true);
  };
 

  const sortBy = () => {
    const copy = data;

    copy.sort((a, b) => (a.Title > b.Title ? 1 : -1));

    setTable(copy);
  };
  const sortByDng = () => {
    const copy = data;

    copy.sort((a, b) => (a.Title > b.Title ? -1 : 1));

    setTable(copy);
  };

  // Global Search
  var getRegexPattern = function (keywordArray: any) {
    var pattern = "(^|\\b)(" + keywordArray.join("|") + ")";
    return new RegExp(pattern, "gi");
  };
  var getHighlightdata = function (item: any, searchTerms: any) {
    var keywordList = [];
    if (serachTitle != undefined && serachTitle != "") {
      keywordList = stringToArray(serachTitle);
    } else {
      keywordList = stringToArray(serachTitle);
    }
    var pattern: any = getRegexPattern(keywordList);
    //let Title :any =(...item.Title)
    item.TitleNew = item.Title;
    item.TitleNew = item.Title.replace(
      pattern,
      '<span class="highlighted">$2</span>'
    );
    // item.Title = item.Title;
    keywordList = [];
    pattern = "";
  };
  var getSearchTermAvialable1 = function (
    searchTerms: any,
    item: any,
    Title: any
  ) {
    var isSearchTermAvailable = true;
    $.each(searchTerms, function (index: any, val: any) {
      if (
        isSearchTermAvailable &&
        item[Title] != undefined &&
        item[Title].toLowerCase().indexOf(val.toLowerCase()) > -1
      ) {
        isSearchTermAvailable = true;
        getHighlightdata(item, val.toLowerCase());
      } else isSearchTermAvailable = false;
    });
    return isSearchTermAvailable;
  };

  var stringToArray = function (input: any) {
    if (input) {
      return input.match(/\S+/g);
    } else {
      return [];
    }
  };

  var isItemExistsNew = function (array: any, items: any) {
    var isExists = false;
    $.each(array, function (index: any, item: any) {
      if (item.Id === items.Id && items.siteType === item.siteType) {
        isExists = true;
        return false;
      }
    });
    return isExists;
  };
  let handleChange1 = (e: { target: { value: string } }, titleName: any) => {
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
        item.flag = getSearchTermAvialable1(searchTerms, item, Title);
        if (item.childs != undefined && item.childs.length > 0) {
          $.each(item.childs, function (parentIndex: any, child1: any) {
            child1.flag = false;
            child1.isSearch = true;
            child1.flag = getSearchTermAvialable1(searchTerms, child1, Title);
            if (child1.flag) {
              item.childs[parentIndex].flag = true;
              data[pareIndex].flag = true;
              item.childs[parentIndex].show = true;
              data[pareIndex].show = true;
            }
            if (child1.childs != undefined && child1.childs.length > 0) {
              $.each(child1.childs, function (index: any, subchild: any) {
                subchild.flag = false;
                subchild.flag = getSearchTermAvialable1(
                  searchTerms,
                  subchild,
                  Title
                );
                if (subchild.flag) {
                  item.childs[parentIndex].flag = true;
                  child1.flag = true;
                  child1.childs[index].flag = true;
                  child1.childs[index].show = true;
                  item.childs[parentIndex].show = true;
                  data[pareIndex].flag = true;
                  data[pareIndex].show = true;
                }
                if (
                  subchild.childs != undefined &&
                  subchild.childs.length > 0
                ) {
                  $.each(
                    subchild.childs,
                    function (childindex: any, subchilds: any) {
                      subchilds.flag = false;
                      subchilds.flag = getSearchTermAvialable1(
                        searchTerms,
                        subchilds,
                        Title
                      );
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
                    }
                  );
                }
              });
            }
          });
        }
      });
    } else {
      setData(maidataBackup);
   
    }
    
  };

  var AllComponetsData: any = [];
  var TaskUsers: any = [];
 
  var MetaData: any = [];
  var showProgressBar = () => {
    $(" #SpfxProgressbar").show();
  };

  var showProgressHide = () => {
    $(" #SpfxProgressbar").hide();
  };
  var Response: any = [];
  const getTaskUsers = async () => {
    let taskUsers = (Response = TaskUsers = await globalCommon.loadTaskUsers());
    setTaskUser(Response);
  
  };
  const GetSmartmetadata = async () => {
    var metadatItem: any = [];
    let smartmetaDetails: any = [];
    var select: any =
      "Id,Title,IsVisible,ParentID,SmartSuggestions,TaxType,Description1,Item_x005F_x0020_Cover,listId,siteName,siteUrl,SortOrder,SmartFilters,Selectable,Parent/Id,Parent/Title&$expand=Parent";
    smartmetaDetails = await globalCommon.getData(
      NextProp.siteUrl,
      NextProp.SmartMetadataListID,
      select
    );
    map(smartmetaDetails, (newtest) => {
      newtest.Id = newtest.ID;
     
      if (
        newtest.TaxType == "Sites" &&
        newtest.Title != "Master Tasks" &&
        newtest.Title != "SDC Sites"
      ) {
        siteConfig.push(newtest);
      }
    });
    map(siteConfig, (newsite) => {
      if (
        newsite.Title == "SDC Sites" ||
        newsite.Title == "DRR" ||
        newsite.Title == "Small Projects" ||
        newsite.Title == "Offshore Tasks" ||
        newsite.Title == "Health" ||
        newsite.Title == "Shareweb Old" ||
        newsite.Title == "Master Tasks"
      )
        newsite.DataLoadNew = false;
      else newsite.DataLoadNew = true;
      /*-- Code for default Load Task Data---*/
      if (
        newsite.Title == "DRR" ||
        newsite.Title == "Small Projects" ||
        newsite.Title == "Gruene" ||
        newsite.Title == "Offshore Tasks" ||
        newsite.Title == "Health" ||
        newsite.Title == "Shareweb Old"
      ) {
        newsite.Selected = false;
      } else {
        newsite.Selected = true;
      }
    });
  };
  const GetComponents = async () => {
    filt =
      "(Item_x0020_Type eq 'Component') or (Item_x0020_Type eq 'SubComponent') or (Item_x0020_Type eq 'Feature') and ((Portfolio_x0020_Type eq 'Service'))";
    if (
      IsUpdated != undefined &&
      IsUpdated.toLowerCase().indexOf("service") > -1
    )
      filt =
        "((Item_x0020_Type eq 'Component') or (Item_x0020_Type eq 'SubComponent') or (Item_x0020_Type eq 'Feature')) and ((Portfolio_x0020_Type eq 'Service'))";
    if (
      IsUpdated != undefined &&
      IsUpdated.toLowerCase().indexOf("events") > -1
    )
      filt =
        "((Item_x0020_Type eq 'Component') or (Item_x0020_Type eq 'SubComponent') or (Item_x0020_Type eq 'Feature')) and ((Portfolio_x0020_Type eq 'Events'))";
    if (
      IsUpdated != undefined &&
      IsUpdated.toLowerCase().indexOf("component") > -1
    )
      filt =
        "((Item_x0020_Type eq 'Component') or (Item_x0020_Type eq 'SubComponent') or (Item_x0020_Type eq 'Feature')) and ((Portfolio_x0020_Type eq 'Component'))";

    let componentDetails: any = [];
    var select =
      "ID,Id,Title,Mileage,TaskListId,TaskListName,PortfolioLevel,PortfolioStructureID,PortfolioStructureID,component_x0020_link,Package,Comments,DueDate,Sitestagging,Body,Deliverables,StartDate,Created,Item_x0020_Type,Help_x0020_Information,Background,Categories,Short_x0020_Description_x0020_On,CategoryItem,Priority_x0020_Rank,Priority,TaskDueDate,PercentComplete,Modified,CompletedDate,ItemRank,Portfolio_x0020_Type,Services/Title, ClientTime,Services/Id,Events/Id,Events/Title,Parent/Id,Parent/Title,Component/Id,Component/Title,Component/ItemType,Services/Id,Services/Title,Services/ItemType,Events/Id,Author/Title,Editor/Title,Events/Title,Events/ItemType,SharewebCategories/Id,SharewebTaskType/Title,SharewebCategories/Title,AssignedTo/Id,AssignedTo/Title,Team_x0020_Members/Id,Team_x0020_Members/Title,ClientCategory/Id,ClientCategory/Title,Responsible_x0020_Team/Id,Responsible_x0020_Team/Title&$expand=Parent,Events,Services,SharewebTaskType,AssignedTo,Component,ClientCategory,Author,Editor,Team_x0020_Members,Responsible_x0020_Team,SharewebCategories&$filter=" +
      filt +
      "";

    componentDetails = await globalCommon.getData(
      NextProp.siteUrl,
      NextProp.MasterTaskListID,
      select
    );
    var array: any = [];
    if (
      props.Item_x0020_Type != undefined &&
      props.Item_x0020_Type === "Component"
    ) {
      array = $.grep(componentDetails, function (compo: any) {
        return compo.Id === props.Id;
      });
      let temp: any = $.grep(componentDetails, function (compo: any) {
        return compo.Parent?.Id === props.Id;
      });
      array = [...array, ...temp];
      temp.forEach((obj: any) => {
        if (obj.Id != undefined) {
          var temp1: any = $.grep(componentDetails, function (compo: any) {
            return compo.Parent?.Id === obj.Id;
          });
          if (temp1 != undefined && temp1.length > 0)
            array = [...array, ...temp1];
        }
      });
    }
    if (
      props.Item_x0020_Type != undefined &&
      props.Item_x0020_Type === "SubComponent"
    ) {
      array = $.grep(componentDetails, function (compo: any) {
        return compo.Id === props.Id;
      });
      let temp = $.grep(componentDetails, function (compo: any) {
        return compo.Parent?.Id === props.Id;
      });
      if (temp != undefined && temp.length > 0) array = [...array, ...temp];
    }
    if (
      props.Item_x0020_Type != undefined &&
      props.Item_x0020_Type === "Feature"
    ) {
      array = $.grep(componentDetails, function (compo: any) {
        return compo.Id === props.Id;
      });
    }

    AllComponetsData = array;
    ComponetsData["allComponets"] = array;

    var arrayfilter: any = [];
    const Itmes: any = [];
    const chunkSize = 20;
    for (let i = 0; i < AllComponetsData.length; i += chunkSize) {
      const chunk = AllComponetsData.slice(i, i + chunkSize);
      if (chunk != undefined && chunk.length > 0) {
        var filter: any = "";
        if (IsUpdated === "Service" && chunk != undefined && chunk.length > 0) {
          chunk.forEach((obj: any, index: any) => {
            if (chunk.length - 1 === index)
              filter += "(Services/Id eq " + obj.Id + " )";
            else filter += "(Services/Id eq " + obj.Id + " ) or ";
          });
        }
        if (
          IsUpdated === "Component" &&
          chunk != undefined &&
          chunk.length > 0
        ) {
          chunk.forEach((obj: any, index: any) => {
            if (chunk.length - 1 === index)
              filter += "(Component/Id eq " + obj.Id + " )";
            else filter += "(Component/Id eq " + obj.Id + " ) or ";
          });
        }
        if (IsUpdated === "Events" && chunk != undefined && chunk.length > 0) {
          chunk.forEach((obj: any, index: any) => {
            if (chunk.length - 1 === index)
              filter += "(Events/Id eq " + obj.Id + " )";
            else filter += "(Events/Id eq " + obj.Id + " ) or ";
          });
        }

        Itmes.push(filter);
      }
     
    }

    LoadAllSiteTasks(Itmes);
  };

  React.useEffect(() => {
    showProgressBar();
    getTaskUsers();
    GetSmartmetadata();
    GetComponents();
  }, []);

  // common services

 

  
  var getRegexPattern = function (keywordArray: any) {
    var pattern = "(^|\\b)(" + keywordArray.join("|") + ")";
    return new RegExp(pattern, "gi");
  };

  
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
  };
  const findTaggedComponents = function (task: any) {
    task.Portfolio_x0020_Type = "Component";
    task.isService = false;
    if (IsUpdated === "Service") {
      $.each(task["Services"], function (index: any, componentItem: any) {
        for (var i = 0; i < ComponetsData["allComponets"].length; i++) {
          let crntItem = ComponetsData["allComponets"][i];
          if (componentItem.Id == crntItem.Id) {
            if (
              crntItem.PortfolioStructureID != undefined &&
              crntItem.PortfolioStructureID != ""
            ) {
              task.PortfolioStructureID = crntItem.PortfolioStructureID;
              task.ShowTooltipSharewebId =
                crntItem.PortfolioStructureID + "-" + task.Shareweb_x0020_ID;
            }
            if (crntItem.Portfolio_x0020_Type == "Service") {
              task.isService = true;
              task.Portfolio_x0020_Type = "Service";
            }
            if (ComponetsData["allComponets"][i]["childs"] === undefined)
              ComponetsData["allComponets"][i]["childs"] = [];
            if (
              !isItemExistsNew(ComponetsData["allComponets"][i]["childs"], task)
            ) {
              ComponetsData["allComponets"][i].downArrowIcon =
                IsUpdated != undefined && IsUpdated == "Service"
                  ? GlobalConstants.MAIN_SITE_URL +
                    "/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png"
                  : GlobalConstants.MAIN_SITE_URL +
                    "/SP/SiteCollectionImages/ICONS/24/list-icon.png";
              ComponetsData["allComponets"][i].RightArrowIcon =
                IsUpdated != undefined && IsUpdated == "Service"
                  ? GlobalConstants.MAIN_SITE_URL +
                    "/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png"
                  : GlobalConstants.MAIN_SITE_URL +
                    "/SP/SiteCollectionImages/ICONS/24/right-list-icon.png";
              ComponetsData["allComponets"][i]["childs"].push(task);
              if (ComponetsData["allComponets"][i].Id === 413)
                console.log(ComponetsData["allComponets"][i]["childs"].length);
            }
            break;
          }
        }
      });
    }
    if (IsUpdated === "Events") {
      $.each(task["Events"], function (index: any, componentItem: any) {
        for (var i = 0; i < ComponetsData["allComponets"].length; i++) {
          let crntItem = ComponetsData["allComponets"][i];
          if (componentItem.Id == crntItem.Id) {
            if (
              crntItem.PortfolioStructureID != undefined &&
              crntItem.PortfolioStructureID != ""
            ) {
              task.PortfolioStructureID = crntItem.PortfolioStructureID;
              task.ShowTooltipSharewebId =
                crntItem.PortfolioStructureID + "-" + task.Shareweb_x0020_ID;
            }
            if (crntItem.Portfolio_x0020_Type == "Events") {
              task.isService = true;
              task.Portfolio_x0020_Type = "Events";
            }
            if (ComponetsData["allComponets"][i]["childs"] == undefined)
              ComponetsData["allComponets"][i]["childs"] = [];
            if (
              !isItemExistsNew(ComponetsData["allComponets"][i]["childs"], task)
            )
              ComponetsData["allComponets"][i]["childs"].push(task);
            break;
          }
        }
      });
    }
    if (IsUpdated === "Component") {
      $.each(task["Component"], function (index: any, componentItem: any) {
        for (var i = 0; i < ComponetsData["allComponets"].length; i++) {
          let crntItem = ComponetsData["allComponets"][i];
          if (componentItem.Id == crntItem.Id) {
            if (
              crntItem.PortfolioStructureID != undefined &&
              crntItem.PortfolioStructureID != ""
            ) {
              task.PortfolioStructureID = crntItem.PortfolioStructureID;
              task.ShowTooltipSharewebId =
                crntItem.PortfolioStructureID + "-" + task.Shareweb_x0020_ID;
            }
            if (crntItem.Portfolio_x0020_Type == "Component") {
              task.isService = true;
              task.Portfolio_x0020_Type = "Component";
            }
            if (ComponetsData["allComponets"][i]["childs"] == undefined)
              ComponetsData["allComponets"][i]["childs"] = [];
            if (
              !isItemExistsNew(ComponetsData["allComponets"][i]["childs"], task)
            )
              ComponetsData["allComponets"][i]["childs"].push(task);
            break;
          }
        }
      });
    }
  };

  const DynamicSort = function (items: any, column: any) {
    items.sort(function (a: any, b: any) {
      var aID = a[column];
      var bID = b[column];
      return aID == bID ? 0 : aID > bID ? 1 : -1;
    });
  };
  var ComponetsData: any = {};
  ComponetsData.allUntaggedTasks = [];
  const bindData = function () {
    var RootComponentsData: any[] = [];
    var ComponentsData: any = [];
    var SubComponentsData: any = [];
    var FeatureData: any = [];

    $.each(ComponetsData["allComponets"], function (index: any, result: any) {
      result.CreatedDateImg = [];
      result.childsLength = 0;
      result.TitleNew = result.Title;
      result.DueDate = Moment(result.DueDate).format("DD/MM/YYYY");
      result.flag = true;
      if (result.DueDate == "Invalid date" || "") {
        result.DueDate = result.DueDate.replaceAll("Invalid date", "");
      }
      result.PercentComplete = (result.PercentComplete * 100).toFixed(0);

      if (result.Short_x0020_Description_x0020_On != undefined) {
        result.Short_x0020_Description_x0020_On =
          result.Short_x0020_Description_x0020_On.replace(/(<([^>]+)>)/gi, "");
      }
      result["siteType"] = "Master Tasks";
      result["SiteIcon"] = globalCommon.GetIconImageUrl(
        result.siteType,
        GlobalConstants.MAIN_SITE_URL + "/SP",
        undefined
      );
      
      if (result.Author != undefined) {
        if (result.Author.Id != undefined) {
          $.each(TaskUsers, function (index: any, users: any) {
            if (
              result.Author.Id != undefined &&
              users.AssingedToUser != undefined &&
              result.Author.Id == users.AssingedToUser.Id
            ) {
              users.ItemCover = users.Item_x0020_Cover.Url;
              result.CreatedDateImg.push(users);
            }
          });
        }
      }
      if (
        result.PortfolioStructureID != null &&
        result.PortfolioStructureID != undefined
      ) {
        result["Shareweb_x0020_ID"] = result.PortfolioStructureID;
      } else {
        result["Shareweb_x0020_ID"] = "";
      }
      if (
        result.ClientCategory != undefined &&
        result.ClientCategory.length > 0
      ) {
        $.each(result.Team_x0020_Members, function (index: any, catego: any) {
          result.ClientCategory.push(catego);
        });
      }
      if (result.Item_x0020_Type == "Root Component") {
        result["childs"] =
          result["childs"] != undefined ? result["childs"] : [];
        RootComponentsData.push(result);
      }
      if (result.Item_x0020_Type == "Component") {
        result["childs"] =
          result["childs"] != undefined ? result["childs"] : [];
        result.SiteIcon =
          IsUpdated != undefined && IsUpdated == "Service"
            ? GlobalConstants.MAIN_SITE_URL +
              "/SP/SiteCollectionImages/ICONS/Service_Icons/component_icon.png"
            : GlobalConstants.MAIN_SITE_URL +
              "/SP/SiteCollectionImages/ICONS/Shareweb/component_icon.png";
        ComponentsData.push(result);
      }

      if (result.Item_x0020_Type == "SubComponent") {
        result.SiteIcon =
          IsUpdated != undefined && IsUpdated == "Service"
            ? GlobalConstants.MAIN_SITE_URL +
              "/SP/SiteCollectionImages/ICONS/Service_Icons/SubComponent_icon.png"
            : GlobalConstants.MAIN_SITE_URL +
              "/SP/SiteCollectionImages/ICONS/Shareweb/SubComponent_icon.png";
        result["childs"] =
          result["childs"] != undefined ? result["childs"] : [];
        if (result["childs"].length > 0) {
          result.downArrowIcon =
            IsUpdated != undefined && IsUpdated == "Service"
              ? GlobalConstants.MAIN_SITE_URL +
                "/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png"
              : GlobalConstants.MAIN_SITE_URL +
                "/SP/SiteCollectionImages/ICONS/24/list-icon.png";
          result.RightArrowIcon =
            IsUpdated != undefined && IsUpdated == "Service"
              ? GlobalConstants.MAIN_SITE_URL +
                "/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png"
              : GlobalConstants.MAIN_SITE_URL +
                "/SP/SiteCollectionImages/ICONS/24/right-list-icon.png";
        }
        SubComponentsData.push(result);
      }
      if (result.Item_x0020_Type == "Feature") {
        result.SiteIcon =
          IsUpdated != undefined && IsUpdated == "Service"
            ? GlobalConstants.MAIN_SITE_URL +
              "/SP/SiteCollectionImages/ICONS/Service_Icons/feature_icon.png"
            : GlobalConstants.MAIN_SITE_URL +
              "/SP/SiteCollectionImages/ICONS/Shareweb/feature_icon.png";
        result["childs"] =
          result["childs"] != undefined ? result["childs"] : [];
        if (result["childs"].length > 0) {
          result.downArrowIcon =
            IsUpdated != undefined && IsUpdated == "Service"
              ? GlobalConstants.MAIN_SITE_URL +
                "/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png"
              : GlobalConstants.MAIN_SITE_URL +
                "/SP/SiteCollectionImages/ICONS/24/list-icon.png";
          result.RightArrowIcon =
            IsUpdated != undefined && IsUpdated == "Service"
              ? GlobalConstants.MAIN_SITE_URL +
                "/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png"
              : GlobalConstants.MAIN_SITE_URL +
                "/SP/SiteCollectionImages/ICONS/24/right-list-icon.png";
          DynamicSort(result.childs, "Shareweb_x0020_ID");
          //if (result.childs != undefined && result.childs.length > 0)
          result.childsLength = result.childs.length;
        }
        FeatureData.push(result);
      }
     
    });

    $.each(SubComponentsData, function (index: any, subcomp: any) {
      if (subcomp.Title != undefined) {
        if (subcomp["childs"] != undefined && subcomp["childs"].length > 0) {
          let Tasks = subcomp["childs"].filter(
            (sub: { Item_x0020_Type: string }) => sub.Item_x0020_Type === "Task"
          );
          let Features = subcomp["childs"].filter(
            (sub: { Item_x0020_Type: string }) =>
              sub.Item_x0020_Type === "Feature"
          );
          subcomp["childs"] = [];
          DynamicSort(Tasks, "Shareweb_x0020_ID");
          subcomp["childs"] = Features.concat(Tasks);
          subcomp.childsLength = Tasks.length;
        }
        $.each(FeatureData, function (index: any, featurecomp: any) {
          if (
            featurecomp.Parent != undefined &&
            subcomp.Id == featurecomp.Parent.Id
          ) {
            subcomp.downArrowIcon =
              IsUpdated != undefined && IsUpdated == "Service"
                ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png"
                : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png";
            subcomp.RightArrowIcon =
              IsUpdated != undefined && IsUpdated == "Service"
                ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png"
                : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png";
            subcomp.childsLength++;
            if (
              featurecomp["childs"] != undefined &&
              featurecomp["childs"].length > 0
            ) {
              let Tasks = featurecomp["childs"].filter(
                (sub: { Item_x0020_Type: string }) =>
                  sub.Item_x0020_Type === "Task"
              );
              featurecomp["childs"] = [];
              DynamicSort(Tasks, "Shareweb_x0020_ID");
              featurecomp["childs"] = Tasks;
              featurecomp.childsLength = Tasks.length;
            }
            subcomp["childs"].unshift(featurecomp);
          }
        });

        DynamicSort(subcomp.childs, "PortfolioLevel");
      }
    });
    if (ComponentsData != undefined && ComponentsData.length > 0) {
      $.each(ComponentsData, function (index: any, subcomp: any) {
        
        if (subcomp.Title != undefined) {
          $.each(SubComponentsData, function (index: any, featurecomp: any) {
            if (
              featurecomp.Parent != undefined &&
              subcomp.Id == featurecomp.Parent.Id
            ) {
              subcomp.downArrowIcon =
                IsUpdated != undefined && IsUpdated == "Service"
                  ? GlobalConstants.MAIN_SITE_URL +
                    "/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png"
                  : GlobalConstants.MAIN_SITE_URL +
                    "/SP/SiteCollectionImages/ICONS/24/list-icon.png";
              subcomp.RightArrowIcon =
                IsUpdated != undefined && IsUpdated == "Service"
                  ? GlobalConstants.MAIN_SITE_URL +
                    "/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png"
                  : GlobalConstants.MAIN_SITE_URL +
                    "/SP/SiteCollectionImages/ICONS/24/right-list-icon.png";
              subcomp.childsLength++;
              subcomp["childs"].unshift(featurecomp);
            }
          });
          DynamicSort(subcomp.childs, "PortfolioLevel");
        }
      });

      map(ComponentsData, (comp) => {
        if (comp.Title != undefined) {
          map(FeatureData, (featurecomp) => {
            if (
              featurecomp.Parent != undefined &&
              comp.Id === featurecomp.Parent.Id
            ) {
              comp.downArrowIcon =
                IsUpdated != undefined && IsUpdated == "Service"
                  ? GlobalConstants.MAIN_SITE_URL +
                    "/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png"
                  : GlobalConstants.MAIN_SITE_URL +
                    "/SP/SiteCollectionImages/ICONS/24/list-icon.png";
              comp.RightArrowIcon =
                IsUpdated != undefined && IsUpdated == "Service"
                  ? GlobalConstants.MAIN_SITE_URL +
                    "/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png"
                  : GlobalConstants.MAIN_SITE_URL +
                    "/SP/SiteCollectionImages/ICONS/24/right-list-icon.png";
              comp.childsLength++;
              comp["childs"].unshift(featurecomp);
            }
          });
        }
      });
    } else
      ComponentsData =
        SubComponentsData.length === 0 ? FeatureData : SubComponentsData;
    var array: any = [];
    map(ComponentsData, (comp, index) => {
      if (comp.childs != undefined && comp.childs.length > 0) {
        var Subcomponnet = comp.childs.filter(
          (sub: { Item_x0020_Type: string }) =>
            sub.Item_x0020_Type === "SubComponent"
        );
        DynamicSort(Subcomponnet, "PortfolioLevel");
        var SubTasks = comp.childs.filter(
          (sub: { Item_x0020_Type: string }) => sub.Item_x0020_Type === "Task"
        );
        var SubFeatures = comp.childs.filter(
          (sub: { Item_x0020_Type: string }) =>
            sub.Item_x0020_Type === "Feature"
        );
        DynamicSort(SubFeatures, "PortfolioLevel");
        SubFeatures = SubFeatures.concat(SubTasks);
        Subcomponnet = Subcomponnet.concat(SubFeatures);
        comp["childs"] = Subcomponnet;
        array.push(comp);

        if (Subcomponnet != undefined && Subcomponnet.length > 0) {
        
          map(Subcomponnet, (subcomp, index) => {
            if (subcomp.childs != undefined && subcomp.childs.length > 0) {
              var Subchildcomponnet = subcomp.childs.filter(
                (sub: any) => sub.Item_x0020_Type === "Feature"
              );
              DynamicSort(SubFeatures, "PortfolioLevel");
              var SubchildTasks = subcomp.childs.filter(
                (sub: any) => sub.Item_x0020_Type === "Task"
              );
              Subchildcomponnet = Subchildcomponnet.concat(SubchildTasks);
              subcomp["childs"] = Subchildcomponnet;
        
            }
          });
        }
      } else array.push(comp);
    });
    ComponentsData = array;
  
    var temp: any = {};
    temp.TitleNew = "Tasks";
    temp.childs = [];
   
    temp.TeamLeader = [];
    temp.flag = true;
    temp.downArrowIcon =
      IsUpdated != undefined && IsUpdated == "Service"
        ? GlobalConstants.MAIN_SITE_URL +
          "/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png"
        : GlobalConstants.MAIN_SITE_URL +
          "/SP/SiteCollectionImages/ICONS/24/list-icon.png";
    temp.RightArrowIcon =
      IsUpdated != undefined && IsUpdated == "Service"
        ? GlobalConstants.MAIN_SITE_URL +
          "/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png"
        : GlobalConstants.MAIN_SITE_URL +
          "/SP/SiteCollectionImages/ICONS/24/right-list-icon.png";

    temp.show = true;
    ComponentsData.push(temp);
    temp.childs = ComponentsData[0].childs.filter(
      (sub: any) => sub.Item_x0020_Type === "Task" && sub.childs.length == 0
    );
    AllItems = ComponentsData[0].childs.filter(
      (sub: any) => sub.Item_x0020_Type != "Task" || sub.childs.length > 0
    );
    var activities = temp.childs.filter(
      (sub: any) => sub?.SharewebTaskType?.Title === "Activities"
    );
    if (activities != undefined && activities.length > 0) {
      AllItems = AllItems.concat(activities);
    }
    temp.childs = temp.childs.filter(
      (sub: any) => sub?.SharewebTaskType?.Title != "Activities"
    );
    temp.childsLength = temp.childs.length;

    if (temp.childs != undefined && temp.childs.length > 0) AllItems.push(temp);
    setSubComponentsData(SubComponentsData);
    setFeatureData(FeatureData);
    setComponentsData(ComponentsData);
    setmaidataBackup(AllItems);
    setData(AllItems);
    showProgressHide();
  };

  var makeFinalgrouping = function () {
    var AllTaskData1: any = [];
    ComponetsData["allUntaggedTasks"] = [];
    AllTaskData1 = AllTaskData1.concat(TasksItem);
    $.each(AllTaskData1, function (index: any, task: any) {
      if (task.Id === 3559 || task.Id === 3677) 
      task.Portfolio_x0020_Type = "Component";
      if (IsUpdated === "Service") {
        if (task["Services"] != undefined && task["Services"].length > 0) {
          task.Portfolio_x0020_Type = "Service";
          findTaggedComponents(task);
        }
      }
      if (IsUpdated === "Events") {
        if (task["Events"] != undefined && task["Events"].length > 0) {
          task.Portfolio_x0020_Type = "Events";
          findTaggedComponents(task);
        }
      }
      if (IsUpdated === "Component") {
        if (task["Component"] != undefined && task["Component"].length > 0) {
          task.Portfolio_x0020_Type = "Component";
          findTaggedComponents(task);
        }
      }
    });
    var temp: any = {};
    temp.TitleNew = "Tasks";
    temp.childs = [];
    temp.flag = true;
    ComponetsData["allComponets"].push(temp);
    bindData();
  };
 
  var TasksItem: any = [];

 
  // Expand Table
  const expndpopup = (e: any) => {
    settablecontiner(e);
  };

  //------------------Edit Data----------------------------------------------------------------------------------------------------------------------------

  
  const onChangeHandler = (itrm: any, child: any, e: any) => {
    var Arrays: any = [];

    const { checked } = e.target;
    if (checked == true) {
      itrm.chekBox = true;
      if (itrm.ClientCategory != undefined && itrm.ClientCategory.length > 0) {
        itrm.ClientCategory.map((clientcategory: any) => {
          selectedCategory.push(clientcategory);
        });
      }

      if (itrm.SharewebTaskType == undefined) {
        setActivityDisable(false);
        itrm["siteUrl"] = `${NextProp.siteUrl}`;
        itrm["listName"] = "Master Tasks";
        MeetingItems.push(itrm);
        
      }
      if (itrm.SharewebTaskType != undefined) {
        if (
          itrm.SharewebTaskType.Title == "Activities" ||
          itrm.SharewebTaskType.Title == "Workstream"
        ) {
          setActivityDisable(false);
         
          Arrays.push(itrm);
          itrm["PortfolioId"] = child.Id;
          childsData.push(itrm);
        }
      }
      if (itrm.SharewebTaskType != undefined) {
        if (itrm.SharewebTaskType.Title == "Task") {
          setActivityDisable(true);
        }
      }
      if (itrm.SharewebTaskType != undefined) {
        if (itrm.SharewebTaskType.Title == "Task") {
          setActivityDisable(true);
        }
      }
    }
    if (checked == false) {
      itrm.chekBox = false;
      MeetingItems?.forEach((val: any, index: any) => {
        if (val.Id == itrm.Id) {
          MeetingItems.splice(index, 1);
        }
      });
      if (itrm.SharewebTaskType != undefined) {
        if (itrm.SharewebTaskType.Title == "Task") {
          setActivityDisable(false);
          if (itrm.SharewebTaskType != undefined) {
            if (itrm.SharewebTaskType.Title == "Task") {
              setActivityDisable(false);
            }
          }
        }
      }
    }

    const list = [...checkedList];
    var flag = true;
    list.forEach((obj: any, index: any) => {
      if (obj.Id != undefined && itrm?.Id != undefined && obj.Id === itrm.Id) {
        flag = false;
        list.splice(index, 1);
      }
    });
    if (flag) list.push(itrm);
    maidataBackup.forEach((obj, index) => {
      obj.isRestructureActive = false;
      if (obj.childs != undefined && obj.childs.length > 0) {
        obj.childs.forEach((sub: any, indexsub: any) => {
          sub.isRestructureActive = false;
          if (sub.childs != undefined && sub.childs.length > 0) {
            sub.childs.forEach((newsub: any, lastIndex: any) => {
              newsub.isRestructureActive = false;
            });
          }
        });
      }
    });
    setData((data) => [...maidataBackup]);
    setCheckedList((checkedList) => [...list]);
  };
  var TaskTimeSheetCategoriesGrouping: any = [];
  const isItemExists = function (arr: any, Id: any) {
    var isExists = false;
    $.each(arr, function (index: any, item: any) {
      if (item.Id == Id) {
        isExists = true;
        return false;
      }
    });
    return isExists;
  };
 

  const EditData = (e: any, item: any) => {
    setIsTimeEntry(true);
    setSharewebTimeComponent(item);
  };



  const EditComponentPopup = (item: any) => {
    setIsComponent(true);
    setSharewebComponent(item);
  };
  const EditItemTaskPopup = (item: any) => {
    setIsTask(true);
    setSharewebTask(item);
  };
 

  const Call = React.useCallback((childItem: any) => {
    MeetingItems?.forEach((val: any): any => {
      val.chekBox = false;
    });
    closeTaskStatusUpdatePoup2();
    setIsComponent(false);
    setIsTask(false);
    setMeetingPopup(false);
    setWSPopup(false);
    var MainId: any = "";
    if (childItem != undefined) {
      childItem.data["flag"] = true;
      childItem.data["TitleNew"] = childItem.data.Title;
      childItem.data["SharewebTaskType"] = { Title: "Activities" };
      if (
        childItem.data.ServicesId != undefined &&
        childItem.data.ServicesId.length > 0
      ) {
        MainId = childItem.data.ServicesId[0];
      }
      if (
        childItem.data.ComponentId != undefined &&
        childItem.data.ComponentId.length > 0
      ) {
        MainId = childItem.data.ComponentId[0];
      }

      if (AllItems != undefined) {
        AllItems.forEach((val: any) => {
          val.flag = true;
          val.show = false;
          if (
            val.Id == MainId ||
            (val.childs != undefined && val.childs.length > 0)
          ) {
            if (val.Id == MainId) {
              val.childs.push(childItem.data);
            }
            if (val.childs != undefined && val.childs.length > 0) {
              val.childs.forEach((type: any) => {
                if (type.Id == MainId) {
                  val.flag = true;
                  type.childs.push(childItem.data);
                } else {
                  AllItems.push(childItem.data);
                }
              });
            }
          } else {
            AllItems.push(childItem.data);
          }
        });
        const finalData = AllItems.filter((val: any, id: any, array: any) => {
          return array.indexOf(val) == id;
        });
        setData(finalData);
        setCount(count + 1);
      }
    }
  }, []);
  const TimeEntryCallBack = React.useCallback((item1) => {
    setIsTimeEntry(false);
  }, []);
  let isOpenPopup = false;
  const onPopUpdata = function (item: any) {
    isOpenPopup = true;
    item.data.childs = [];
    item.data.flag = true;
    item.data.siteType = "Master Tasks";
    item.data.TitleNew = item.data.Title;
    item.data.childsLength = 0;
    item.data["Shareweb_x0020_ID"] = item.data.PortfolioStructureID;
    if (checkedList != undefined && checkedList.length > 0)
      checkedList[0].childs.unshift(item.data);
    else AllItems.unshift(item.data);

    setSharewebComponent(item.data);
    setIsComponent(true);
    setData((data) => [...AllItems]);
  };
  const CloseCall = React.useCallback((item) => {
    if (item.CreateOpenType === "CreatePopup") {
      onPopUpdata(item.CreatedItem[0]);
    } else if (!isOpenPopup && item.CreatedItem != undefined) {
      item.CreatedItem.forEach((obj: any) => {
        obj.data.childs = [];
        obj.data.flag = true;
        obj.data.TitleNew = obj.data.Title;
       
        obj.data.siteType = "Master Tasks";
        obj.data["Shareweb_x0020_ID"] = obj.data.PortfolioStructureID;
        if (item.props != undefined && item.props.SelectedItem != undefined) {
          item.props.SelectedItem.childs =
            item.props.SelectedItem.childs == undefined
              ? []
              : item.props.SelectedItem.childs;
          if (item.props.SelectedItem.childs.length === 0) {
            item.props.SelectedItem.downArrowIcon =
              IsUpdated != undefined && IsUpdated == "Service"
                ? GlobalConstants.MAIN_SITE_URL +
                  "/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png"
                : GlobalConstants.MAIN_SITE_URL +
                  "/SP/SiteCollectionImages/ICONS/24/list-icon.png";
            item.props.SelectedItem.RightArrowIcon =
              IsUpdated != undefined && IsUpdated == "Service"
                ? GlobalConstants.MAIN_SITE_URL +
                  "/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png"
                : GlobalConstants.MAIN_SITE_URL +
                  "/SP/SiteCollectionImages/ICONS/24/right-list-icon.png";
          }
          item.props.SelectedItem.childs.unshift(obj.data);
        }
      });
      if (AllItems != undefined && AllItems.length > 0) {
        AllItems.forEach((comp: any, index: any) => {
          if (
            comp.Id != undefined &&
            item.props.SelectedItem != undefined &&
            comp.Id === item.props.SelectedItem.Id
          ) {
            comp.childsLength = item.props.SelectedItem.childs.length;
            comp.show = comp.show == undefined ? false : comp.show;
            if (comp.childs.length === 0) {
              comp.downArrowIcon = item.props.SelectedItem.downArrowIcon;
              comp.RightArrowIcon = item.props.SelectedItem.RightArrowIcon;
            }
            comp.childs = item.props.SelectedItem.childs;
          }
          if (comp.childs != undefined && comp.childs.length > 0) {
            comp.childs.forEach((subcomp: any, index: any) => {
              if (
                subcomp.Id != undefined &&
                item.props.SelectedItem != undefined &&
                subcomp.Id === item.props.SelectedItem.Id
              ) {
                subcomp.childsLength = item.props.SelectedItem.childs.length;
                subcomp.show = subcomp.show == undefined ? false : subcomp.show;
                if (comp.childs.length === 0) {
                  subcomp.downArrowIcon = item.props.SelectedItem.downArrowIcon;
                  subcomp.RightArrowIcon =
                    item.props.SelectedItem.RightArrowIcon;
                }
                subcomp.childs = item.props.SelectedItem.childs;
              }
            });
          }
        });
        // }
      }
      setData((data) => [...AllItems]);
    }
    if (!isOpenPopup && item.data != undefined) {
      item.data.childs = [];
      item.data.flag = true;
      item.data.TitleNew = item.data.Title;
      item.data.siteType = "Master Tasks";
      item.data.childsLength = 0;
      item.data["Shareweb_x0020_ID"] = item.data.PortfolioStructureID;
      AllItems.unshift(item.data);
      setData((data) => [...AllItems]);
    }
    setAddModalOpen(false);
  }, []);

  const CreateOpenCall = React.useCallback((item) => {
    // setSharewebComponent(item);
  }, []);

  var myarray: any = [];
  var myarray1: any = [];
  var myarray2: any = [];
  if (props.Sitestagging != null) {
    myarray.push(JSON.parse(props.Sitestagging));
  }
  if (myarray.length != 0) {
    myarray[0].map((items: any) => {
      if (items.SiteImages != undefined && items.SiteImages != "") {
        items.SiteImages = items.SiteImages.replace(
          "https://www.hochhuth-consulting.de",
          GlobalConstants.MAIN_SITE_URL
        );
        myarray1.push(items);
      }
   
    });
    if (props.ClientCategory.results.length != 0) {
      props.ClientCategory.results.map((terms: any) => {
       
        myarray2.push(terms);
      });
    }
  
  }
  const [lgShow, setLgShow] = React.useState(false);
  function handleClose() {
    selectedCategory = [];
    setLgShow(false);
  }
  const [lgNextShow, setLgNextShow] = React.useState(false);
  const handleCloseNext = () => setLgNextShow(false);
  const [CreateacShow, setCreateacShow] = React.useState(false);
  const handleCreateac = () => setCreateacShow(false);

  
  // Add activity popup array
  const closeTaskStatusUpdatePoup2 = () => {
    MeetingItems?.forEach((val: any): any => {
      val.chekBox = false;
    });
    setActivityPopup(false);
   
    MeetingItems = [];
    childsData = [];
  };
  const CreateMeetingPopups = (item: any) => {
    setMeetingPopup(true);
    MeetingItems[0]["NoteCall"] = item;
  };
  const openActivity = () => {
    if (MeetingItems.length == 0 && childsData.length == 0) {
      MeetingItems.push(props);
    }
    if (MeetingItems.length > 1) {
      alert(
        "More than 1 Parents selected, Select only 1 Parent to create a child item"
      );
    } else {
      if (MeetingItems[0] != undefined) {
        if (items != undefined && items.length > 0) {
          MeetingItems[0].ClientCategory = [];
          items.forEach((val: any) => {
            MeetingItems[0].ClientCategory.push(val);
          });
        }
        if (MeetingItems[0].SharewebTaskType != undefined) {
          if (MeetingItems[0].SharewebTaskType.Title == "Activities") {
            setWSPopup(true);
          }
        }

        if (
          MeetingItems != undefined &&
          MeetingItems[0].SharewebTaskType?.Title == "Workstream"
        ) {
          setActivityPopup(true);
        }
        if (
          MeetingItems[0].SharewebTaskType == undefined &&
          childsData[0] == undefined
        ) {
          setActivityPopup(true);
        }
      }
    }

    if (
      childsData[0] != undefined &&
      childsData[0].SharewebTaskType != undefined
    ) {
      if (childsData[0].SharewebTaskType.Title == "Activities") {
        setWSPopup(true);
        MeetingItems.push(childsData[0]);
      }
      if (
        childsData[0] != undefined &&
        childsData[0].SharewebTaskType.Title == "Workstream"
      ) {
        childsData[0].NoteCall = "Task";
        setMeetingPopup(true);
        MeetingItems.push(childsData[0]);
      }
    }
  };
  const buttonRestructuring = () => {
    var ArrayTest: any = [];
    if (
      checkedList.length > 0 &&
      checkedList[0].childs != undefined &&
      checkedList[0].childs.length > 0 &&
      checkedList[0].Item_x0020_Type === "Component"
    )
      alert("You are not allowed to Restructure this item.");
    if (
      checkedList.length > 0 &&
      checkedList[0].childs != undefined &&
      checkedList[0].childs.length === 0 &&
      checkedList[0].Item_x0020_Type === "Component"
    ) {
      maidataBackup.forEach((obj) => {
        obj.isRestructureActive = true;
        if (obj.Id === checkedList[0].Id) obj.isRestructureActive = false;
        ArrayTest.push(...[obj]);
        if (obj.childs != undefined && obj.childs.length > 0) {
          obj.childs.forEach((sub: any) => {
            if (sub.Item_x0020_Type === "SubComponent") {
              sub.isRestructureActive = true;
             
            }
          });
        }
      });
    }
    if (
      checkedList.length > 0 &&
      checkedList[0].Item_x0020_Type === "SubComponent"
    ) {
      maidataBackup.forEach((obj) => {
        if (obj.Id === checkedList[0].Id) {
          obj.isRestructureActive = false;
          ArrayTest.push(...[obj]);
        }
        if (obj.childs != undefined && obj.childs.length > 0) {
          obj.childs.forEach((sub: any) => {
            if (sub.Id === checkedList[0].Id) {
              obj.isRestructureActive = false;
              ArrayTest.push(...[obj]);
              ArrayTest.push(...[sub]);
            }
          });
        }
      });
    }
    if (
      checkedList.length > 0 &&
      checkedList[0].Item_x0020_Type === "Feature"
    ) {
      maidataBackup.forEach((obj) => {
        obj.isRestructureActive = true;
        if (obj.Id === checkedList[0].Id) {
          obj.isRestructureActive = false;
        }

        if (obj.childs != undefined && obj.childs.length > 0) {
          obj.childs.forEach((sub: any) => {
            sub.isRestructureActive = true;
            if (sub.Id === checkedList[0].Id) {
              sub.isRestructureActive = false;
              obj.isRestructureActive = false;
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
              });
            }
          });
        }
      });
    } else if (
      checkedList.length > 0 &&
      checkedList[0].Item_x0020_Type === "Task"
    ) {
      maidataBackup.forEach((obj) => {
        obj.isRestructureActive = true;
        if (obj.Id === checkedList[0].Id) {
          ArrayTest.push(...[obj]);
        }
        if (obj.childs != undefined && obj.childs.length > 0) {
          obj.childs.forEach((sub: any) => {
            if (
              sub.Item_x0020_Type === "SubComponent" ||
              sub.Item_x0020_Type === "Feature"
            )
              sub.isRestructureActive = true;
            if (sub.Id === checkedList[0].Id) {
              ArrayTest.push(...[obj]);
              ArrayTest.push(...[sub]);
              // ArrayTest.push(sub)
            }
            if (sub.childs != undefined && sub.childs.length > 0) {
              sub.childs.forEach((subchild: any) => {
                if (
                  subchild.Item_x0020_Type === "SubComponent" ||
                  subchild.Item_x0020_Type === "Feature"
                )
                  subchild.isRestructureActive = true;
                if (subchild.Id === checkedList[0].Id) {
                  ArrayTest.push(...[obj]);
                  ArrayTest.push(...[sub]);
                  ArrayTest.push(...[subchild]);
                
                }
                if (
                  subchild.childs != undefined &&
                  subchild.childs.length > 0
                ) {
                  subchild.childs.forEach((listsubchild: any) => {
                    if (listsubchild.Id === checkedList[0].Id) {
                      ArrayTest.push(...[obj]);
                      ArrayTest.push(...[sub]);
                      ArrayTest.push(...[subchild]);
                      ArrayTest.push(...[listsubchild]);
                    }
                  });
                }
                if (
                  subchild.childs != undefined &&
                  subchild.childs.length > 0
                ) {
                  subchild.childs.forEach((listsubchild: any) => {
                    if (listsubchild.Id === checkedList[0].Id) {
                      ArrayTest.push(...[obj]);
                      ArrayTest.push(...[sub]);
                      ArrayTest.push(...[subchild]);
                      ArrayTest.push(...[listsubchild]);
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
    if (props.Item_x0020_Type !== "SubComponent") IsShowRestru = true;
    maidataBackup.forEach((obj) => {
      if (obj.isRestructureActive === false) {
        if (obj.childs != undefined && obj.childs.length > 0) {
          obj.childs.forEach((sub: any) => {
            sub.isRestructureActive = false;
            if (sub.childs != undefined && sub.childs.length > 0) {
              sub.childs.forEach((newsub: any) => {
                newsub.isRestructureActive = false;
              });
            }
          });
        }
      }
    });
    setOldArrayBackup(ArrayTest);
    setData((data) => [...maidataBackup]);

   
  };

  const RestruringCloseCall = () => {
    setResturuningOpen(false);
  };
  const OpenModal = (item: any) => {
    var TestArray: any = [];
    setResturuningOpen(true);
    maidataBackup.forEach((obj) => {
      if (obj.Id === item.Id) TestArray.push(obj);
      if (obj.childs != undefined && obj.childs.length > 0) {
        obj.childs.forEach((sub: any) => {
          sub.isRestructureActive = true;
          if (sub.Id === item.Id) {
            TestArray.push(...[obj]);
            TestArray.push(...[sub]);
          }
          if (sub.childs != undefined && sub.childs.length > 0) {
            sub.childs.forEach((newsub: any) => {
              if (newsub.Id === item.Id) {
                TestArray.push(...[obj]);
                TestArray.push(...[sub]);
                TestArray.push(...[newsub]);
              }
            });
          }
        });
      }
    });
    setChengedItemTitle(checkedList[0].Item_x0020_Type);
    ChengedTitle =
      checkedList[0].Item_x0020_Type === "Feature"
        ? "SubComponent"
        : checkedList[0].Item_x0020_Type === "SubComponent"
        ? "Component"
        : checkedList[0].Item_x0020_Type;
    let Items: any = [];
    Items.push(OldArrayBackup[OldArrayBackup.length - 1]);
    setRestructureChecked(Items);
    if (TestArray.length === 0) {
      OldArrayBackup.unshift(props);
      TestArray.push(props);
    }
    setNewArrayBackup((NewArrayBackup) => [...TestArray]);
  };
  var PortfolioLevelNum: any = 0;
  const setRestructure = (item: any, title: any) => {
    let array: any = [];
    item.Item_x0020_Type = title;
    if (item != undefined && title === "SubComponent") {
      item.SiteIcon =
        IsUpdated != undefined && IsUpdated == "Service"
          ? "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/SubComponent_icon.png"
          : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/SubComponent_icon.png";

      ChengedTitle = "Component";
    }
    if (item != undefined && title === "Feature") {
      item.SiteIcon =
        IsUpdated != undefined && IsUpdated == "Service"
          ? "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/feature_icon.png"
          : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/feature_icon.png";
      ChengedTitle = "SubComponent";
    }
    setChengedItemTitle(title);
    array.push(item);
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
            });
          }
        });
      }
    });
  };
  
  const UpdateTaskRestructure = async function () {
    var Ids: any = [];
    if (NewArrayBackup != undefined && NewArrayBackup.length > 0) {
      NewArrayBackup.forEach((obj, index) => {
        if (NewArrayBackup.length - 1 === index) Ids.push(obj.Id);
      });
    }

    let web = new Web(NextProp.siteUrl);
    await web.lists
      .getById(checkedList[0].listId)
      .items.getById(checkedList[0].Id)
      .update({
        ComponentId:
          checkedList[0].Portfolio_x0020_Type === "Component"
            ? { results: Ids }
            : { results: [] },
        ServicesId:
          checkedList[0].Portfolio_x0020_Type === "Service"
            ? { results: Ids }
            : { results: [] },
      })
      .then((res: any) => {
        maidataBackup.forEach((obj, index) => {
          obj.isRestructureActive = false;
          if (obj.Id === checkedList[0].Id) {
            maidataBackup.splice(index, 1);
            if (obj.childs.length === 0) {
              obj.downArrowIcon = "";
              obj.RightArrowIcon = "";
            }
          }
          if (obj.childs != undefined && obj.childs.length > 0) {
            obj.childs.forEach((sub: any, indexsub: any) => {
              sub.isRestructureActive = false;
              if (sub.Id === checkedList[0].Id) {
                obj.childs.splice(indexsub, 1);
                if (sub.childs.length === 0) {
                  sub.downArrowIcon = "";
                  sub.RightArrowIcon = "";
                }
              }
              if (sub.childs != undefined && sub.childs.length > 0) {
                sub.childs.forEach((newsub: any, lastIndex: any) => {
                  newsub.isRestructureActive = false;
                  if (newsub.Id === checkedList[0].Id) {
                    sub.childs.splice(lastIndex, 1);
                    if (newsub.childs.length === 0) {
                      newsub.downArrowIcon = "";
                      newsub.RightArrowIcon = "";
                    }
                  }
                  if (newsub.childs != undefined && newsub.childs.length > 0) {
                    newsub.childs.forEach((newsub1: any, lastIndex: any) => {
                      newsub1.isRestructureActive = false;
                      if (newsub1.Id === checkedList[0].Id) {
                        newsub1.childs.splice(lastIndex, 1);
                        if (newsub1.childs.length === 0) {
                          newsub1.downArrowIcon = "";
                          newsub1.RightArrowIcon = "";
                        }
                      }
                    });
                  }
                });
              }
            });
          }
        });
        let flag = true;
        maidataBackup.forEach((obj, index) => {
          if (obj.Id === Ids[0]) {
            obj.flag = true;
            obj.show = true;
            obj.downArrowIcon =
              obj.Portfolio_x0020_Type == "Service"
                ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png"
                : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png";
            obj.RightArrowIcon =
              obj.Portfolio_x0020_Type == "Service"
                ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png"
                : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png";
            flag = false;
            obj.childs.push(checkedList[0]);
            obj.childsLength = obj.childs.length;
          }
          if (obj.childs != undefined && obj.childs.length > 0) {
            obj.childs.forEach((sub: any, indexsub: any) => {
              sub.isRestructureActive = false;
              if (sub.Id === Ids[0]) {
                sub.flag = true;
                sub.show = true;
                sub.downArrowIcon =
                  sub.Portfolio_x0020_Type == "Service"
                    ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png"
                    : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png";
                sub.RightArrowIcon =
                  sub.Portfolio_x0020_Type == "Service"
                    ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png"
                    : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png";
                flag = false;
                sub.childs.push(checkedList[0]);
                sub.childsLength = sub.childs.length;
              }
              if (sub.childs != undefined && sub.childs.length > 0) {
                sub.childs.forEach((newsub: any, lastIndex: any) => {
                  if (newsub.Id === Ids[0]) {
                    newsub.flag = true;
                    newsub.show = true;
                    newsub.downArrowIcon =
                      newsub.Portfolio_x0020_Type == "Service"
                        ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png"
                        : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png";
                    newsub.RightArrowIcon =
                      newsub.Portfolio_x0020_Type == "Service"
                        ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png"
                        : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png";
                    flag = false;
                    newsub.childs.push(checkedList[0]);
                    newsub.childsLength = newsub.childs.length;
                  }
                });
              }
            });
          }
        });
        if (flag) maidataBackup.push(checkedList[0]);
        setData((data) => [...maidataBackup]);
        RestruringCloseCall();
      });
  };
  const UpdateRestructure = async function () {
    let PortfolioStructureIDs: any = "";
    var Item: any = "";
    let flag: any = false;
    let ChengedItemTitle: any = "";
   
    if (
      RestructureChecked != undefined &&
      RestructureChecked.length > 0 &&
      RestructureChecked[0].Item_x0020_Type == "Feature"
    ) {
      ChengedItemTitle = RestructureChecked[0].Item_x0020_Type;
    } else if (
      RestructureChecked != undefined &&
      RestructureChecked.length > 0 &&
      RestructureChecked[0].Item_x0020_Type == "SubComponent"
    ) {
      ChengedItemTitle = RestructureChecked[0].Item_x0020_Type;
    }
   
    let count: any = 0;
    let newItem: any = "";
    if (NewArrayBackup.length === 1) newItem = NewArrayBackup[0];
    else {
      // if (flag) {
      NewArrayBackup.forEach((newe: any) => {
        if (ChengedTitle != "" && newe.Item_x0020_Type === ChengedTitle)
          newItem = newe;
        else if (newe.Item_x0020_Type === ChengedItemTitle) newItem = newe;
      });
      
    }
    maidataBackup.forEach((obj) => {
      if (obj.Id === newItem.Id) {
        PortfolioLevelNum = obj.childs.length + 1;
      }
      if (obj.childs != undefined && obj.childs.length > 0) {
        obj.childs.forEach((sub: any) => {
          if (sub.Id === newItem.Id) {
            obj.childs.forEach((leng: any) => {
              if (leng.Item_x0020_Type === newItem.Item_x0020_Type) count++;
            });
            PortfolioLevelNum = count + 1;
          }
          if (sub.childs != undefined && sub.childs.length > 0) {
            sub.childs.forEach((newsub: any) => {
              if (newsub.Id === newItem.Id) {
                sub.childs.forEach((subleng: any) => {
                  if (subleng.Item_x0020_Type === newItem.Item_x0020_Type)
                    count++;
                });
                PortfolioLevelNum = count + 1;
              }
            });
          }
        });
      }
    });
    if (NewArrayBackup != undefined && NewArrayBackup.length > 0) {
      NewArrayBackup.forEach((newobj: any) => {
        if (ChengedTitle != "" && newobj.Item_x0020_Type === ChengedTitle)
          Item = newobj;
        else if (
          ChengedTitle === "" &&
          ChengedItemTitle === newobj.Item_x0020_Type
        )
          Item = newobj;
      });
    }
    if (Item === "") Item = NewArrayBackup[0];
    if (
      Item !== undefined &&
      Item.PortfolioStructureID != undefined &&
      ChengedItemTitle != undefined
    ) {
      PortfolioStructureIDs =
        Item.PortfolioStructureID +
        "-" +
        ChengedItemTitle.slice(0, 1) +
        PortfolioLevelNum;
   }

    var UploadImage: any = [];

    var item: any = {};
    if (ChengedItemTitl === undefined) {
      let web = new Web(NextProp.siteUrl);
      await web.lists
        .getById(NextProp.MasterTaskListID)
        .items.getById(checkedList[0].Id)
        .update({
          ParentId: Item.Id,
          PortfolioLevel: PortfolioLevelNum,
          PortfolioStructureID: PortfolioStructureIDs,
        })
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
          setData((data) => [...maidataBackup]);
          RestruringCloseCall();
         
        });
    }
    if (ChengedItemTitl != undefined && ChengedItemTitl != "") {
      let web = new Web(NextProp.siteUrl);
      await web.lists
        .getById(NextProp.MasterTaskListID)
        .items.getById(checkedList[0].Id)
        .update({
          ParentId: Item.Id,
          PortfolioLevel: PortfolioLevelNum,
          PortfolioStructureID: PortfolioStructureIDs,
          Item_x0020_Type: ChengedItemTitl,
        })
        .then((res: any) => {
          console.log(res);
          maidataBackup.forEach((obj, index) => {
            obj.isRestructureActive = false;
            if (obj.Id === checkedList[0].Id) {
           
              checkedList[0].downArrowIcon = obj.downArrowIcon;
              checkedList[0].RightArrowIcon = obj.RightArrowIcon;
            }
            if (obj.childs != undefined && obj.childs.length > 0) {
              obj.childs.forEach((sub: any, indexsub: any) => {
                sub.isRestructureActive = false;
                if (sub.Id === checkedList[0].Id) {
                  obj.childs.splice(indexsub, 1);
                  checkedList[0].downArrowIcon = obj.downArrowIcon;
                  checkedList[0].RightArrowIcon = obj.RightArrowIcon;
                }
                if (sub.childs != undefined && sub.childs.length > 0) {
                  sub.childs.forEach((newsub: any, lastIndex: any) => {
                    newsub.isRestructureActive = false;
                    if (newsub.Id === checkedList[0].Id) {
                      sub.childs.splice(lastIndex, 1);

                      checkedList[0].downArrowIcon = obj.downArrowIcon;
                      checkedList[0].RightArrowIcon = obj.RightArrowIcon;
                    }
                  });
                }
              });
            }
          });
          checkedList[0].PortfolioStructureID = PortfolioStructureIDs;
          checkedList[0].Shareweb_x0020_ID = PortfolioStructureIDs;
          checkedList[0].PortfolioLevel = PortfolioLevelNum;
          checkedList[0].IsNew = true;
          checkedList[0].Item_x0020_Type = ChengedItemTitl;
          if (Item.childs != undefined) {
            checkedList[0].downArrowIcon =
              Item.Portfolio_x0020_Type == "Service"
                ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png"
                : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png";
            checkedList[0].RightArrowIcon =
              Item.Portfolio_x0020_Type == "Service"
                ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png"
                : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png";

            Item.childs.push(checkedList[0]);
          } else {
            Item.childs = [];
            Item.show = true;
            Item.downArrowIcon = checkedList[0].downArrowIcon;
            Item.RightArrowIcon = checkedList[0].RightArrowIcon;
          
            Item.childs.push(checkedList[0]);
          }
          setCheckedList((checkedList) => [...[]]);
          setData((data) => [...maidataBackup]);
          RestruringCloseCall();
        });
    }
  };

 
  var SomeMetaData1 = [
    {
      __metadata: {
        id: "Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(11)",
        uri: "https://hhhhteams.sharepoint.com/sites/HHHH/_api/;Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(11)",
        etag: '"13"',
        type: "SP.Data.SmartMetadataListItem",
      },
      Id: 15,
      Title: "MileStone",
      siteName: null,
      siteUrl: null,
      listId: null,
      Description1: null,
      IsVisible: true,
      SmartFilters: {
        __metadata: { type: "Collection(Edm.String)" },
        results: [],
      },
      SortOrder: 2,
      TaxType: "Categories",
      Selectable: true,
      ParentID: 24,
      SmartSuggestions: null,
      ID: 15,
    },
    {
      __metadata: {
        id: "Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(105)",
        uri: "https://hhhhteams.sharepoint.com/sites/HHHH/_api/Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(105)",
        etag: '"4"',
        type: "SP.Data.SmartMetadataListItem",
      },
      Id: 105,
      Title: "Development",
      siteName: null,
      siteUrl: null,
      listId: null,
      Description1: null,
      IsVisible: true,
      Item_x005F_x0020_Cover: {
        __metadata: { type: "SP.FieldUrlValue" },
        Description:
          "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/development.png",
        Url: "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/development.png",
      },
      SmartFilters: null,
      SortOrder: 3,
      TaxType: "Category",
      Selectable: true,
      ParentID: 0,
      SmartSuggestions: null,
      ID: 105,
    },
    {
      __metadata: {
        id: "Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(282)",
        uri: "https://hhhhteams.sharepoint.com/sites/HHHH/_api/Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(282)",
        etag: '"1"',
        type: "SP.Data.SmartMetadataListItem",
      },
      Id: 282,
      Title: "Implementation",
      siteName: null,
      siteUrl: null,
      listId: null,
      Description1:
        "This should be tagged if a task is for applying an already developed component/subcomponent/feature.",
      IsVisible: true,
      Item_x005F_x0020_Cover: {
        __metadata: { type: "SP.FieldUrlValue" },
        Description: "/SiteCollectionImages/ICONS/Shareweb/Implementation.png",
        Url: "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/Implementation.png",
      },
      SmartFilters: null,
      SortOrder: 4,
      TaxType: "Categories",
      Selectable: true,
      ParentID: 24,
      SmartSuggestions: false,
      ID: 282,
    },
    {
      __metadata: {
        id: "Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(11)",
        uri: "https://hhhhteams.sharepoint.com/sites/HHHH/_api/;Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(11)",
        etag: '"13"',
        type: "SP.Data.SmartMetadataListItem",
      },
      Id: 11,
      Title: "Bug",
      siteName: null,
      siteUrl: null,
      listId: null,
      Description1: null,
      IsVisible: true,
      Item_x005F_x0020_Cover: {
        __metadata: { type: "SP.FieldUrlValue" },
        Description:
          "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/bug.png",
        Url: "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/bug.png",
      },
      SmartFilters: {
        __metadata: { type: "Collection(Edm.String)" },
        results: ["MetaSearch", "Dashboard"],
      },
      SortOrder: 2,
      TaxType: "Categories",
      Selectable: true,
      ParentID: 24,
      SmartSuggestions: null,
      ID: 11,
    },
    {
      __metadata: {
        id: "Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(96)",
        uri: "https://hhhhteams.sharepoint.com/sites/HHHH/_api/Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(96)",
        etag: '"5"',
        type: "SP.Data.SmartMetadataListItem",
      },
      Id: 96,
      Title: "Feedback",
      siteName: null,
      siteUrl: null,
      listId: null,
      Description1: null,
      IsVisible: true,
      Item_x005F_x0020_Cover: {
        __metadata: { type: "SP.FieldUrlValue" },
        Description:
          "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/feedbck.png",
        Url: "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/feedbck.png",
      },
      SmartFilters: null,
      SortOrder: 2,
      TaxType: null,
      Selectable: true,
      ParentID: 0,
      SmartSuggestions: false,
      ID: 96,
    },
    {
      __metadata: {
        id: "Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(191)",
        uri: "https://hhhhteams.sharepoint.com/sites/HHHH/_api/Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(191)",
        etag: '"3"',
        type: "SP.Data.SmartMetadataListItem",
      },
      Id: 191,
      Title: "Improvement",
      siteName: null,
      siteUrl: null,
      listId: null,
      Description1:
        "Use this task category for any improvements of EXISTING features",
      IsVisible: true,
      Item_x005F_x0020_Cover: {
        __metadata: { type: "SP.FieldUrlValue" },
        Description:
          "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/Impovement.png",
        Url: "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/Impovement.png",
      },
      SmartFilters: null,
      SortOrder: 12,
      TaxType: "Categories",
      Selectable: true,
      ParentID: 24,
      SmartSuggestions: false,
      ID: 191,
    },
    {
      __metadata: {
        id: "Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(12)",
        uri: "https://hhhhteams.sharepoint.com/sites/HHHH/_api/Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(12)",
        etag: '"13"',
        type: "SP.Data.SmartMetadataListItem",
      },
      Id: 12,
      Title: "Design",
      siteName: null,
      siteUrl: null,
      listId: null,
      Description1: null,
      IsVisible: true,
      Item_x005F_x0020_Cover: {
        __metadata: { type: "SP.FieldUrlValue" },
        Description:
          "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/design.png",
        Url: "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/design.png",
      },
      SmartFilters: {
        __metadata: { type: "Collection(Edm.String)" },
        results: ["MetaSearch", "Dashboard"],
      },
      SortOrder: 4,
      TaxType: "Categories",
      Selectable: true,
      ParentID: 165,
      SmartSuggestions: null,
      ID: 12,
    },
    {
      __metadata: {
        id: "Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(100)",
        uri: "https://hhhhteams.sharepoint.com/sites/HHHH/_api/Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(100)",
        etag: '"13"',
        type: "SP.Data.SmartMetadataListItem",
      },
      Id: 100,
      Title: "Activity",
      siteName: null,
      siteUrl: null,
      listId: null,
      Description1: null,
      IsVisible: true,
      Item_x005F_x0020_Cover: null,
      SmartFilters: null,
      SortOrder: 4,
      TaxType: null,
      Selectable: true,
      ParentID: null,
      SmartSuggestions: null,
      ID: 100,
    },
    {
      __metadata: {
        id: "Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(281)",
        uri: "https://hhhhteams.sharepoint.com/sites/HHHH/_api/Web/Lists;(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(281)",
        etag: '"13"',
        type: "SP.Data.SmartMetadataListItem",
      },
      Id: 281,
      Title: "Task",
      siteName: null,
      siteUrl: null,
      listId: null,
      Description1: null,
      IsVisible: true,
      Item_x005F_x0020_Cover: null,
      SmartFilters: null,
      SortOrder: 4,
      TaxType: null,
      Selectable: true,
      ParentID: null,
      SmartSuggestions: null,
      ID: 281,
    },
  ] as unknown as {
    siteName: any;
    siteUrl: any;
    listId: any;
    Description1: any;
    results: any[];
    SmartSuggestions: any;
    SmartFilters: any;
  }[];

  const findUserByName = (name: any) => {
    const user = AllUsers.filter((user: any) => user.Title === name);
    let Image: any;
    if (user[0]?.Item_x0020_Cover != undefined) {
      Image = user[0].Item_x0020_Cover.Url;
    } else {
      Image =
        "https://hhhhteams.sharepoint.com/sites/HHHH/PublishingImages/Portraits/icon_user.jpg";
    }
    return user ? Image : null;
  };
  return (
    <div
      className={
        IsUpdated == "Events"
          ? "app component eventpannelorange"
          : IsUpdated == "Service"
          ? "app component serviepannelgreena"
          : "app component"
      }
    >
      {/* Add activity task */}
      <Modal show={lgShow} aria-labelledby="example-modal-sizes-title-lg">
        <Modal.Header>
          <Modal.Title>
            <h6>Select Client Category</h6>
          </Modal.Title>
          <button type="button" className="Close-button" onClick={handleClose}>
            X
          </button>
        </Modal.Header>
        <Modal.Body className="p-2">
          <span className="bold">
            <b>Please select any one Client Category.</b>
          </span>
          <div>
            {selectedCategory.map((item: any) => {
              return <li onClick={() => handleClick(item)}>{item.Title}</li>;
            })}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => openActivity()}>
            Ok
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      {/* End of Add activity task */}
      {/* After Add activity task */}
      <Modal show={lgNextShow} aria-labelledby="example-modal-sizes-title-lg">
        <Modal.Header>
          <Modal.Title>
            <h6>Create Task</h6>
          </Modal.Title>
          <button
            type="button"
            className="Close-button"
            onClick={handleCloseNext}
          ></button>
        </Modal.Header>
        <Modal.Body className="p-2">
          <span className="bold">Clear Selection</span>
          <div>
            {SomeMetaData1.map((item: any) => {
              return (
                <span>
                  {item.Item_x005F_x0020_Cover != null && (
                    <img src={item.Item_x005F_x0020_Cover.Url} />
                  )}
                  <p onClick={() => setCreateacShow(true)}>{item.Title}</p>
                </span>
              );
            })}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseNext}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      {/* After Add activity task End */}
      {/* Create task activity popup  */}
      <Modal show={CreateacShow} aria-labelledby="example-modal-sizes-title-lg">
        <Modal.Header>
          <Modal.Title>
            <h6>Create Quick Option</h6>
          </Modal.Title>
          <button
            type="button"
            className="Close-button"
            onClick={handleCreateac}
          ></button>
        </Modal.Header>
        <Modal.Body className="p-2">
          <span className="bold">Clear Selection</span>
          <div>
            {siteConfig != null && (
              <>
                {siteConfig.map((site: any) => {
                  return (
                    <span>
                      {site?.Title != undefined &&
                        site.Title != "Foundation" &&
                        site.Title != "Master Tasks" &&
                        site.Title != "Gender" &&
                        site.Title != "Health" &&
                        site.Title != "SDC Sites" &&
                        site.Title != "Offshore Tasks" && (
                          <>
                            <img src={site?.Item_x005F_x0020_Cover?.Url} />
                            <p>{site?.Title}</p>
                          </>
                        )}
                    </span>
                  );
                })}
              </>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary">Ok</Button>
          <Button variant="secondary" onClick={handleCreateac}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="Alltable mt-10">
        <div className="tbl-headings">
          <span className="leftsec">
            <span className="">
              {props.Portfolio_x0020_Type == "Component" &&
                props.Item_x0020_Type != "SubComponent" &&
                props.Item_x0020_Type != "Feature" && (
                  <>
                    <img
                      className="client-icons"
                      src={
                        GlobalConstants.MAIN_SITE_URL +
                        "/SiteCollectionImages/ICONS/Shareweb/component_icon.png"
                      }
                    />{" "}
                    <a>{props.Title}</a>
                  </>
                )}
              {props.Portfolio_x0020_Type == "Service" &&
                props.Item_x0020_Type != "SubComponent" &&
                props.Item_x0020_Type != "Feature" && (
                  <>
                    <img
                      className="client-icons"
                      src={
                        GlobalConstants.MAIN_SITE_URL +
                        "/SiteCollectionImages/ICONS/Service_Icons/component_icon.png"
                      }
                    />{" "}
                    <a>{props.Title}</a>
                  </>
                )}
              {props.Portfolio_x0020_Type == "Component" &&
                props.Item_x0020_Type == "SubComponent" && (
                  <>
                    {props.Parent != undefined && (
                      <a
                        target="_blank"
                        data-interception="off"
                        href={
                          NextProp.siteUrl +
                          `/SitePages/Portfolio-Profile.aspx?taskId=${props.Parent.Id}`
                        }
                      >
                        <img
                          className="client-icons"
                          src={
                            GlobalConstants.MAIN_SITE_URL +
                            "/SiteCollectionImages/ICONS/Shareweb/component_icon.png"
                          }
                        />
                      </a>
                    )}{" "}
                    {">"}{" "}
                    <img
                      className="client-icons"
                      src={
                        GlobalConstants.MAIN_SITE_URL +
                        "/SiteCollectionImages/ICONS/Shareweb/subComponent_icon.png"
                      }
                    />{" "}
                    <a>{props.Title}</a>
                  </>
                )}
              {props.Portfolio_x0020_Type == "Service" &&
                props.Item_x0020_Type == "SubComponent" && (
                  <>
                    {props.Parent != undefined && (
                      <a
                        target="_blank"
                        data-interception="off"
                        href={
                          NextProp.siteUrl +
                          `/SitePages/Portfolio-Profile.aspx?taskId=${props.Parent.Id}`
                        }
                      >
                        <img
                          className="client-icons"
                          src={
                            GlobalConstants.MAIN_SITE_URL +
                            "/SiteCollectionImages/ICONS/Service_Icons/component_icon.png"
                          }
                        />
                      </a>
                    )}{" "}
                    {">"}
                    <img
                      className="client-icons"
                      src={
                        GlobalConstants.MAIN_SITE_URL +
                        "/SiteCollectionImages/ICONS/Service_Icons/subcomponent_icon.png"
                      }
                    />{" "}
                    <a>{props.Title}</a>
                  </>
                )}

              {props.Portfolio_x0020_Type == "Component" &&
                props.Item_x0020_Type == "Feature" && (
                  <>
                    {props.Parent != undefined && (
                      <a
                        target="_blank"
                        data-interception="off"
                        href={
                          NextProp.siteUrl +
                          `/SitePages/Portfolio-Profile.aspx?taskId=${props.Parent.Id}`
                        }
                      >
                        <img
                          className="client-icons"
                          src={
                            GlobalConstants.MAIN_SITE_URL +
                            "/SiteCollectionImages/ICONS/Shareweb/component_icon.png"
                          }
                        />
                      </a>
                    )}{" "}
                    {">"}{" "}
                    {props.Parent.ItemType != undefined &&
                      props.Parent.ItemType == "SubComponent" && (
                        <a
                          target="_blank"
                          data-interception="off"
                          href={
                            NextProp.siteUrl +
                            `/SitePages/Portfolio-Profile.aspx?taskId=${props.Parent.Id}`
                          }
                        >
                          <img
                            className="client-icons"
                            src={
                              GlobalConstants.MAIN_SITE_URL +
                              "/SiteCollectionImages/ICONS/Shareweb/subComponent_icon.png"
                            }
                          />
                        </a>
                      )}{" "}
                    {">"}{" "}
                    <img
                      className="client-icons"
                      src={
                        GlobalConstants.MAIN_SITE_URL +
                        "/SiteCollectionImages/ICONS/Shareweb/feature_icon.png"
                      }
                    />{" "}
                    <a>{props.Title}</a>
                  </>
                )}
              {props.Portfolio_x0020_Type == "Service" &&
                props.Item_x0020_Type == "Feature" && (
                  <>
                    {props.Parent != undefined && (
                      <a
                        target="_blank"
                        data-interception="off"
                        href={
                          GlobalConstants.MAIN_SITE_URL +
                          `/SitePages/Portfolio-Profile.aspx?taskId=${props.Parent.Id}`
                        }
                      >
                        <img
                          className="client-icons"
                          src={
                            GlobalConstants.MAIN_SITE_URL +
                            "/SiteCollectionImages/ICONS/Service_Icons/component_icon.png"
                          }
                        />
                      </a>
                    )}{" "}
                    {">"}{" "}
                    {props.Parent.ItemType != undefined &&
                      props.Parent.ItemType == "SubComponent" && (
                        <a
                          target="_blank"
                          data-interception="off"
                          href={
                            NextProp.siteUrl +
                            `/SitePages/Portfolio-Profile.aspx?taskId=${props.Parent.Id}`
                          }
                        >
                          <img
                            className="client-icons"
                            title={props.Parent.Title}
                            src={
                              GlobalConstants.MAIN_SITE_URL +
                              "/SiteCollectionImages/ICONS/Service_Icons/subcomponent_icon.png"
                            }
                          />
                        </a>
                      )}{" "}
                    {">"}{" "}
                    <img
                      className="client-icons"
                      title={props.Title}
                      src={
                        GlobalConstants.MAIN_SITE_URL +
                        "/SiteCollectionImages/ICONS/Service_Icons/feature_icon.png"
                      }
                    />{" "}
                    <a>{props.Title}</a>
                  </>
                )}
            </span>
            <span className="g-search">
              <input
                type="text"
                className="searchbox_height full_width"
                id="globalSearch"
                placeholder="search all"
                onChange={(e) => handleChange1(e, "Title")}
              />
              <span className="gsearch-btn" ng-click="SearchAll_Item()">
                <i className="fa fa-search"></i>
              </span>
            </span>
          </span>
          <span className="toolbox mx-auto">
            {checkedList != undefined &&
            checkedList.length > 0 &&
            (checkedList[0].Item_x0020_Type === "Feature" ||
              checkedList[0].Item_x0020_Type === "Task") ? (
              <button
                type="button"
                disabled={true}
                className="btn btn-primary"
                onClick={addModal}
                title=" Add Structure"
              >
                Add Structure
              </button>
            ) : (
              <button
                type="button"
                disabled={checkedList.length >= 2}
                className="btn btn-primary"
                onClick={addModal}
                title=" Add Structure"
              >
                Add Structure
              </button>
            )}

       
            <button
              type="button"
              onClick={() => openActivity()}
              disabled={ActivityDisable}
              className="btn btn-primary"
              title=" Add Activity-Task"
            >
              Add Activity-Task
            </button>

            <button
              type="button"
              className="btn btn-primary"
              onClick={buttonRestructuring}
            >
              Restructure
            </button>
            <button
              type="button"
              className="btn {{(compareComponents.length==0 && SelectedTasks.length==0)?'btn-grey':'btn-primary'}}"
              disabled={true}
            >
              Compare
            </button>
            <a className="expand">
              <ExpndTable prop={expndpopup} prop1={tablecontiner} />
            </a>
            <a>
              <Tooltip ComponentId="1748" />
            </a>
          </span>
        </div>
        <div className="col-sm-12 pad0 smart">
          <div className="section-event">
            <div className={`${data.length>10?"wrapper":"MinHeight"}`}>
              <table
                className="table table-hover"
                id="EmpTable"
                style={{ width: "100%" }}
              >
                <thead>
                  <tr>
                    <th style={{ width: "2%" }}>
                      <div style={{ width: "2%" }}>
                        <div
                          className="smart-relative sign hreflink"
                          onClick={() => handleOpenAll()}
                        >
                          {Isshow ? (
                            <img
                              src={
                                IsUpdated != undefined &&
                                IsUpdated.toLowerCase().indexOf("service") > -1
                                  ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png"
                                  : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png"
                              }
                            />
                          ) : (
                            <img
                              src={
                                IsUpdated != undefined &&
                                IsUpdated.toLowerCase().indexOf("service") > -1
                                  ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png"
                                  : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png"
                              }
                            />
                          )}
                        </div>
                      </div>
                    </th>
                    <th style={{ width: "6%" }}>
                      <div style={{ width: "6%" }}></div>
                    </th>
                    <th style={{ width: "7%" }}>
                      <div style={{ width: "6%" }} className="smart-relative">
                        <input
                          type="search"
                          placeholder="TaskId"
                          className="full_width searchbox_height"
                          onChange={(e) =>
                            handleChange1(e, "Shareweb_x0020_ID")
                          }
                        />
                        <span className="sorticon">
                          <span className="up" onClick={sortBy}>
                            <FaAngleUp />
                          </span>
                          <span className="down" onClick={sortByDng}>
                            <FaAngleDown />
                          </span>
                        </span>
                      </div>
                    </th>
                    <th style={{ width: "23%" }}>
                      <div style={{ width: "22%" }} className="smart-relative">
                        <input
                          type="search"
                          placeholder="Title"
                          className="full_width searchbox_height"
                          onChange={(e) => handleChange1(e, "Title")}
                        />
                        <span className="sorticon">
                          <span className="up" onClick={sortBy}>
                            <FaAngleUp />
                          </span>
                          <span className="down" onClick={sortByDng}>
                            <FaAngleDown />
                          </span>
                        </span>
                      </div>
                    </th>
                    <th style={{ width: "7%" }}>
                      <div style={{ width: "6%" }} className="smart-relative">
                        <input
                          id="searchClientCategory"
                          type="search"
                          placeholder="Client Category"
                          title="Client Category"
                          className="full_width searchbox_height"
                        />
                        <span className="sorticon">
                          <span className="up" onClick={sortBy}>
                            <FaAngleUp />
                          </span>
                          <span className="down" onClick={sortByDng}>
                            <FaAngleDown />
                          </span>
                        </span>
                      </div>
                    </th>
                    <th style={{ width: "4%" }}>
                      <div style={{ width: "4%" }} className="smart-relative">
                        <input
                          id="searchClientCategory"
                          type="search"
                          placeholder="%"
                          title="Percentage Complete"
                          className="full_width searchbox_height"
                          onChange={(e) => handleChange1(e, "PercentComplete")}
                        />
                        <span className="sorticon">
                          <span className="up" onClick={sortBy}>
                            <FaAngleUp />
                          </span>
                          <span className="down" onClick={sortByDng}>
                            <FaAngleDown />
                          </span>
                        </span>
                      
                      </div>
                    </th>
                    <th style={{ width: "7%" }}>
                      <div style={{ width: "6%" }} className="smart-relative">
                        <input
                          id="searchClientCategory"
                          type="search"
                          placeholder="ItemRank"
                          title="Item Rank"
                          className="full_width searchbox_height"
                          // onChange={(e) => handleChange1(e, "ItemRank")}
                        />
                        <span className="sorticon">
                          <span className="up" onClick={sortBy}>
                            <FaAngleUp />
                          </span>
                          <span className="down" onClick={sortByDng}>
                            <FaAngleDown />
                          </span>
                        </span>
                     
                      </div>
                    </th>
                    <th style={{ width: "10%" }}>
                      <div style={{ width: "9%" }} className="smart-relative">
                        <input
                          id="searchClientCategory"
                          type="search"
                          placeholder="Team"
                          title="Team"
                          className="full_width searchbox_height"
                          // onChange={(e) => handleChange1(e, "Team")}
                        />
                        <span className="sorticon">
                          <span className="up" onClick={sortBy}>
                            <FaAngleUp />
                          </span>
                          <span className="down" onClick={sortByDng}>
                            <FaAngleDown />
                          </span>
                        </span>
                    
                      </div>
                    </th>
                    <th style={{ width: "9%" }}>
                      <div style={{ width: "8%" }} className="smart-relative">
                        <input
                          id="searchClientCategory"
                          type="search"
                          placeholder="Due Date"
                          title="Due Date"
                          className="full_width searchbox_height"
                          onChange={(e) => handleChange1(e, "DueDate")}
                        />
                        <span className="sorticon">
                          <span className="up" onClick={sortBy}>
                            <FaAngleUp />
                          </span>
                          <span className="down" onClick={sortByDng}>
                            <FaAngleDown />
                          </span>
                        </span>
                   
                      </div>
                    </th>
                    <th style={{ width: "11%" }}>
                      <div style={{ width: "10%" }} className="smart-relative">
                        <input
                          id="searchClientCategory"
                          type="search"
                          placeholder="Created Date"
                          title="Created Date"
                          className="full_width searchbox_height"
                        />
                        <span className="sorticon">
                          <span className="up" onClick={sortBy}>
                            <FaAngleUp />
                          </span>
                          <span className="down" onClick={sortByDng}>
                            <FaAngleDown />
                          </span>
                        </span>
                       
                      </div>
                    </th>
                    <th style={{ width: "7%" }}>
                      <div style={{ width: "6%" }} className="smart-relative">
                        <input
                          id="searchClientCategory"
                          type="search"
                          placeholder="Smart Time"
                          title="Smart Time"
                          className="full_width searchbox_height"
                      
                        />
                        <span className="sorticon">
                          <span className="up" onClick={sortBy}>
                            <FaAngleUp />
                          </span>
                          <span className="down" onClick={sortByDng}>
                            <FaAngleDown />
                          </span>
                        </span>
                       
                      </div>
                    </th>
                    <th style={{ width: "2%" }}>
                      <div style={{ width: "2%" }}></div>
                    </th>
                    <th style={{ width: "2%" }}></th>
                    <th style={{ width: "2%" }}></th>
                  </tr>
                </thead>
                <tbody>
                  <div id="SpfxProgressbar" style={{ display: "none" }}>
                    <img
                      id="sharewebprogressbar-image"
                      src={
                        GlobalConstants.MAIN_SITE_URL +
                        "/SiteCollectionImages/ICONS/32/loading_apple.gif"
                      }
                      alt="Loading..."
                    />
                  </div>
                  {data?.length == 0 ? (
                    <div className="border m-2 p-5 text-center noitems">
                      <h5 className="opacity-50">No items available</h5>
                    </div>
                  ) : (
                    <>
                      {" "}
                      {data?.length > 0 &&
                        data &&
                        data.map(function (item, index) {
                          if (item.flag == true) {
                            return (
                              <>
                                <tr>
                                  <td className="p-0" colSpan={14}>
                                    <table
                                      className="table m-0"
                                      style={{ width: "100%" }}
                                    >
                                      <tr className="bold for-c0l">
                                        <td style={{ width: "2%" }}>
                                          <div className="accordian-header">
                                            {item.childs != undefined &&
                                              item.childs.length > 0 && (
                                                <a
                                                  className="hreflink"
                                                  title="Tap to expand the childs"
                                                >
                                                  <div
                                                    onClick={() =>
                                                      handleOpen(item)
                                                    }
                                                    className="sign"
                                                  >
                                                    {item.childs.length > 0 &&
                                                    item.show ? (
                                                      <img
                                                        src={item.downArrowIcon}
                                                      />
                                                    ) : (
                                                      <img
                                                        src={
                                                          item.RightArrowIcon
                                                        }
                                                      />
                                                    )}
                                                  </div>
                                                </a>
                                              )}
                                          </div>
                                        </td>
                                        <td style={{ width: "6%" }}>
                                          <div className="d-flex">
                                            <span className="pe-2">
                                              <input
                                                type="checkbox"
                                                checked={item.chekBox}
                                                onChange={(e) =>
                                                  onChangeHandler(
                                                    item,
                                                    "Parent",
                                                    e
                                                  )
                                                }
                                              />
                                              <a
                                                className="hreflink"
                                                data-toggle="modal"
                                              >
                                                <img
                                                  className="icon-sites-img ml20"
                                                  src={item.SiteIcon}
                                                ></img>
                                              </a>
                                            </span>
                                          </div>
                                        </td>
                                        <td style={{ width: "7%" }}>
                                          <span className="ml-2">
                                            {item.Shareweb_x0020_ID}
                                          </span>
                                        </td>
                                        <td style={{ width: "26%" }}>
                                          {/* {item.siteType == "Master Tasks" && <a className="hreflink serviceColor_Active" onClick={() => window.open(GlobalConstants.MAIN_SITE_URL + `/SP/SitePages/Portfolio-Profile.aspx?taskId= + ${item.Id}`, '_blank')} */}
                                          {item.siteType === "Master Tasks" && (
                                            <a
                                              className="hreflink serviceColor_Active"
                                              target="_blank"
                                              data-interception="off"
                                              href={
                                                NextProp.siteUrl +
                                                "/SitePages/Portfolio-Profile.aspx?taskId=" +
                                                item.Id
                                              }
                                            >
                                              <span
                                                dangerouslySetInnerHTML={{
                                                  __html: item.TitleNew,
                                                }}
                                              ></span>
                                              {/* {item.TitleNew} */}
                                            </a>
                                          )}
                                          {item.siteType != "Master Tasks" && (
                                            <a
                                              className="hreflink serviceColor_Active"
                                              target="_blank"
                                              data-interception="off"
                                              href={
                                                NextProp.siteUrl +
                                                "/SitePages/Task-Profile.aspx?taskId=" +
                                                item.Id +
                                                "&Site=" +
                                                item.siteType
                                              }
                                            >
                                              <span
                                                dangerouslySetInnerHTML={{
                                                  __html: item?.TitleNew,
                                                }}
                                              ></span>
                                            </a>
                                          )}
                                          {item.childs != undefined &&
                                            item.childs.length > 0 && (
                                              <span>
                                                {item.childs.length == 0 ? (
                                                  ""
                                                ) : (
                                                  <span className="ms-1">
                                                    ({item.childsLength})
                                                  </span>
                                                )}
                                              </span>
                                            )}
                                          {item.Short_x0020_Description_x0020_On !=
                                            null && (
                                         
                                            <div
                                              className="popover__wrapper ms-1"
                                              data-bs-toggle="tooltip"
                                              data-bs-placement="auto"
                                            >
                                              <img
                                                src={
                                                  GlobalConstants.MAIN_SITE_URL +
                                                  "/SP/SiteCollectionImages/ICONS/24/infoIcon.png"
                                                }
                                              />
                                              <div className="popover__content">
                                                {
                                                  item.Short_x0020_Description_x0020_On
                                                }
                                              </div>
                                            </div>
                                          )}
                                        </td>
                                        <td style={{ width: "7%" }}>
                                          <div>
                                            {item.ClientCategory != undefined &&
                                              item.ClientCategory.length > 0 &&
                                              item.ClientCategory.map(
                                                function (client: {
                                                  Title: string;
                                                }) {
                                                  return (
                                                    <span
                                                      className="ClientCategory-Usericon"
                                                      title={client.Title}
                                                    >
                                                      <a>
                                                        {client.Title.slice(
                                                          0,
                                                          2
                                                        ).toUpperCase()}
                                                      </a>
                                                    </span>
                                                  );
                                                }
                                              )}
                                          </div>
                                        </td>
                                        <td style={{ width: "4%" }}>
                                          {item.PercentComplete}
                                        </td>
                                        <td style={{ width: "7%" }}>
                                          {item.ItemRank}
                                        </td>
                                        <td style={{ width: "10%" }}>
                                          <div>
                                            <ShowTaskTeamMembers
                                              props={item}
                                              TaskUsers={AllUsers}
                                            ></ShowTaskTeamMembers>
                                          </div>
                                        </td>

                                        <td style={{ width: "9%" }}>
                                          {item.DueDate}
                                        </td>
                                        <td style={{ width: "11%" }}>
                                          {item.Created != null
                                            ? Moment(item.Created).format(
                                                "DD/MM/YYYY"
                                              )
                                            : ""}
                                          {item.Created == null ? (
                                            ""
                                          ) : (
                                            <>
                                              {item.Author != undefined ? (
                                                <img
                                                  className="AssignUserPhoto"
                                                  title={item.Author.Title}
                                                  src={findUserByName(
                                                    item.Author.Title
                                                  )}
                                                />
                                              ) : (
                                                <img
                                                  className="AssignUserPhoto"
                                                  src="https://hhhhteams.sharepoint.com/sites/HHHH/PublishingImages/Portraits/icon_user.jpg"
                                                />
                                              )}{" "}
                                            </>
                                          )}
                                        </td>

                                        <td style={{ width: "7%" }}>
                                      
                                        </td>

                                        <td style={{ width: "2%" }}>
                                          {item.Item_x0020_Type == "Task" &&
                                            item.siteType != "Master Tasks" && (
                                              <a
                                                onClick={(e) =>
                                                  EditData(e, item)
                                                }
                                              >
                                                <span className="svg__iconbox svg__icon--clock"></span>
                                              </a>
                                            )}
                                        </td>
                                        <td style={{ width: "2%" }}>
                                          {item.siteType === "Master Tasks" &&
                                            item.isRestructureActive && (
                                              <a
                                                href="#"
                                                data-bs-toggle="tooltip"
                                                data-bs-placement="auto"
                                                title="Edit"
                                              >
                                                <img
                                                  className="icon-sites-img"
                                                  src={item.Restructuring}
                                                  onClick={(e) =>
                                                    OpenModal(item)
                                                  }
                                                />
                                              </a>
                                            )}
                                          <span>
                                            {IsShowRestru ? (
                                              <img
                                                className="icon-sites-img ml20"
                                                onClick={(e) =>
                                                  OpenModal(props)
                                                }
                                                src={
                                                  IsShowRestru &&
                                                  IsUpdated == "Service"
                                                    ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png"
                                                    : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"
                                                }
                                              ></img>
                                            ) : (
                                              ""
                                            )}
                                          </span>
                                        </td>
                                        <td style={{ width: "2%" }}>
                                          <a>
                                            {item.siteType ==
                                              "Master Tasks" && (
                                             
                                             <span className="svg__iconbox svg__icon--edit" onClick={(e) =>
                                              EditComponentPopup(item)
                                            }> 

                                              </span>
                                            )}
                                            {item.Item_x0020_Type == "Task" &&
                                              item.siteType !=
                                                "Master Tasks" && (
                                                  <span  onClick={(e) => EditItemTaskPopup(item)} className="svg__iconbox svg__icon--edit"></span>
                                               
                                              )}
                                          </a>
                                        </td>
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
                                            <tr>
                                              <td className="p-0" colSpan={14}>
                                                <table
                                                  className="table m-0"
                                                  style={{ width: "100%" }}
                                                >
                                                  <tr className="for-c02">
                                                    <td style={{ width: "2%" }}>
                                                      <div
                                                        onClick={() =>
                                                          handleOpen(childitem)
                                                        }
                                                        className="sign"
                                                      >
                                                        {childitem.childs
                                                          ?.length > 0 &&
                                                        childitem.show ? (
                                                          <img
                                                            src={
                                                              childitem.downArrowIcon
                                                            }
                                                          />
                                                        ) : (
                                                          <img
                                                            src={
                                                              childitem.RightArrowIcon
                                                            }
                                                          />
                                                        )}
                                                      </div>
                                                    </td>
                                                    <td style={{ width: "6%" }}>
                                                      <span className="pe-2">
                                                        <input
                                                          type="checkbox"
                                                          onChange={(e) =>
                                                            onChangeHandler(
                                                              childitem,
                                                              "Parent",
                                                              e
                                                            )
                                                          }
                                                        />
                                                        <a
                                                          className="hreflink"
                                                          data-toggle="modal"
                                                        >
                                                          <img
                                                            className="icon-sites-img ml20"
                                                            src={
                                                              childitem.SiteIcon
                                                            }
                                                          ></img>
                                                        </a>
                                                      </span>
                                                    </td>
                                                    <td style={{ width: "7%" }}>
                                                      {" "}
                                                      <span className="ml-2">
                                                        {
                                                          childitem.Shareweb_x0020_ID
                                                        }
                                                      </span>
                                                    </td>
                                                    <td
                                                      style={{ width: "23%" }}
                                                    >
                                                      {childitem.siteType ==
                                                        "Master Tasks" && (
                                                        <a
                                                          className="hreflink serviceColor_Active"
                                                          target="_blank"
                                                          data-interception="off"
                                                          href={
                                                            NextProp.siteUrl +
                                                            "/SitePages/Portfolio-Profile.aspx?taskId=" +
                                                            childitem.Id
                                                          }
                                                        >
                                                          <span
                                                            dangerouslySetInnerHTML={{
                                                              __html:
                                                                childitem?.TitleNew,
                                                            }}
                                                          ></span>
                                                        </a>
                                                      )}
                                                      {childitem.siteType !=
                                                        "Master Tasks" && (
                                                        <a
                                                          className="hreflink serviceColor_Active"
                                                          target="_blank"
                                                          data-interception="off"
                                                          href={
                                                            NextProp.siteUrl +
                                                            "/SitePages/Task-Profile.aspx?taskId=" +
                                                            childitem.Id +
                                                            "&Site=" +
                                                            childitem.siteType
                                                          }
                                                        >
                                                          <span
                                                            dangerouslySetInnerHTML={{
                                                              __html:
                                                                childitem?.TitleNew,
                                                            }}
                                                          ></span>
                                                        </a>
                                                      )}
                                                      {childitem.childs !=
                                                        undefined &&
                                                        childitem.childs
                                                          .length > 0 && (
                                                          <span className="ms-1">
                                                            (
                                                            {
                                                              childitem.childsLength
                                                            }
                                                            )
                                                          </span>
                                                        )}
                                                      {childitem.Short_x0020_Description_x0020_On !=
                                                        null && (
                                                        
                                                        <div
                                                          className="popover__wrapper ms-1"
                                                          data-bs-toggle="tooltip"
                                                          data-bs-placement="auto"
                                                        >
                                                          <img
                                                            src={
                                                              GlobalConstants.MAIN_SITE_URL +
                                                              "/SP/SiteCollectionImages/ICONS/24/infoIcon.png"
                                                            }
                                                          />
                                                          <div className="popover__content">
                                                            {
                                                              childitem.Short_x0020_Description_x0020_On
                                                            }
                                                          </div>
                                                        </div>
                                                      )}
                                                    </td>
                                                    <td style={{ width: "7%" }}>
                                                      <div>
                                                        {childitem.ClientCategory !=
                                                          undefined &&
                                                          childitem
                                                            .ClientCategory
                                                            .length > 0 &&
                                                          childitem.ClientCategory.map(
                                                            function (client: {
                                                              Title: string;
                                                            }) {
                                                              return (
                                                                <span
                                                                  className="ClientCategory-Usericon"
                                                                  title={
                                                                    client.Title
                                                                  }
                                                                >
                                                                  <a>
                                                                    {client.Title.slice(
                                                                      0,
                                                                      2
                                                                    ).toUpperCase()}
                                                                  </a>
                                                                </span>
                                                              );
                                                            }
                                                          )}
                                                      </div>
                                                    </td>
                                                    <td style={{ width: "4%" }}>
                                                      {
                                                        childitem.PercentComplete
                                                      }
                                                    </td>
                                                    <td style={{ width: "7%" }}>
                                                      {childitem.ItemRank}
                                                    </td>
                                                    <td
                                                      style={{ width: "10%" }}
                                                    >
                                                      <div>
                                                        <ShowTaskTeamMembers
                                                          props={childitem}
                                                          TaskUsers={AllUsers}
                                                        ></ShowTaskTeamMembers>
                                                      </div>
                                                    </td>
                                                    <td style={{ width: "9%" }}>
                                                      {childitem.DueDate}
                                                    </td>
                                                    <td
                                                      style={{ width: "11%" }}
                                                    >
                                                      {childitem.Created != null
                                                        ? Moment(
                                                            childitem.Created
                                                          ).format("DD/MM/YYYY")
                                                        : ""}
                                                      {childitem.Author !=
                                                      undefined ? (
                                                        <img
                                                          className="AssignUserPhoto"
                                                          title={
                                                            childitem.Author
                                                              .Title
                                                          }
                                                          src={findUserByName(
                                                            childitem.Author
                                                              .Title
                                                          )}
                                                        />
                                                      ) : (
                                                        <img
                                                          className="AssignUserPhoto"
                                                          src="https://hhhhteams.sharepoint.com/sites/HHHH/PublishingImages/Portraits/icon_user.jpg"
                                                        />
                                                      )}
                                                    </td>
                                                    <td style={{ width: "7%" }}>
                                              </td>

                                                    <td style={{ width: "2%" }}>
                                                      {childitem.Item_x0020_Type ==
                                                        "Task" &&
                                                        childitem.siteType !=
                                                          "Master Tasks" && (
                                                          <a
                                                            onClick={(e) =>
                                                              EditData(
                                                                e,
                                                                childitem
                                                              )
                                                            }
                                                          >
                                                            <span className="svg__iconbox svg__icon--clock"></span>
                                                          </a>
                                                        )}
                                                    </td>
                                                    <td style={{ width: "2%" }}>
                                                      {childitem.siteType ===
                                                        "Master Tasks" &&
                                                        childitem.isRestructureActive && (
                                                          <a
                                                            href="#"
                                                            data-bs-toggle="tooltip"
                                                            data-bs-placement="auto"
                                                            title="Edit"
                                                          >
                                                            <img
                                                              className="icon-sites-img"
                                                              src={
                                                                childitem.Restructuring
                                                              }
                                                              onClick={(e) =>
                                                                OpenModal(
                                                                  childitem
                                                                )
                                                              }
                                                            />
                                                          </a>
                                                        )}
                                                      <span>
                                                        {IsShowRestru ? (
                                                          <img
                                                            className="icon-sites-img ml20"
                                                            onClick={(e) =>
                                                              OpenModal(props)
                                                            }
                                                            src={
                                                              IsShowRestru &&
                                                              IsUpdated ==
                                                                "Service"
                                                                ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png"
                                                                : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"
                                                            }
                                                          ></img>
                                                        ) : (
                                                          ""
                                                        )}
                                                      </span>
                                                    </td>
                                                    <td style={{ width: "2%" }}>
                                                      <a>
                                                        {childitem.siteType ==
                                                          "Master Tasks" && (
                                                            <span  onClick={(e) => EditComponentPopup(childitem)} className="svg__iconbox svg__icon--edit"></span>
                                            
                                                        )}
                                                        {childitem.Item_x0020_Type ==
                                                          "Task" &&
                                                          childitem.siteType !=
                                                            "Master Tasks" && (
                                                              <span  onClick={(e) => EditItemTaskPopup(childitem)} className="svg__iconbox svg__icon--edit"></span>
                                                 
                                                          )}
                                                      </a>
                                                    </td>
                                                  </tr>
                                                </table>
                                              </td>
                                            </tr>
                                            {childitem.show &&
                                              childitem.childs.length > 0 && (
                                                <>
                                                  {childitem.childs.map(
                                                    function (childinew: any) {
                                                      if (
                                                        childinew.flag == true
                                                      ) {
                                                        return (
                                                          <>
                                                            <tr>
                                                              <td
                                                                className="p-0"
                                                                colSpan={14}
                                                              >
                                                                <table
                                                                  className="table m-0"
                                                                  style={{
                                                                    width:
                                                                      "100%",
                                                                  }}
                                                                >
                                                                  <tr className="tdrow">
                                                                    <td
                                                                      style={{
                                                                        width:
                                                                          "2%",
                                                                      }}
                                                                    >
                                                                      <div
                                                                        className="accordian-header"
                                                                        onClick={() =>
                                                                          handleOpen(
                                                                            childinew
                                                                          )
                                                                        }
                                                                      >
                                                                        {childinew.childs &&
                                                                          childinew
                                                                            .childs
                                                                            .length >
                                                                            0 && (
                                                                            <a
                                                                              className="hreflink"
                                                                              title="Tap to expand the childs"
                                                                            >
                                                                              <div className="sign">
                                                                                {childinew.childs &&
                                                                                childinew
                                                                                  .childs
                                                                                  .length >
                                                                                  0 &&
                                                                                childinew.show ? (
                                                                                  <img
                                                                                    src={
                                                                                      childinew.downArrowIcon
                                                                                    }
                                                                                  />
                                                                                ) : (
                                                                                  <img
                                                                                    src={
                                                                                      childinew.RightArrowIcon
                                                                                    }
                                                                                  />
                                                                                )}
                                                                              </div>
                                                                            </a>
                                                                          )}
                                                                      </div>
                                                                    </td>
                                                                    <td
                                                                      style={{
                                                                        width:
                                                                          "6%",
                                                                      }}
                                                                    >
                                                                      <span className="pe-2">
                                                                        <input
                                                                          type="checkbox"
                                                                          onChange={(
                                                                            e
                                                                          ) =>
                                                                            onChangeHandler(
                                                                              childinew,
                                                                              item,
                                                                              e
                                                                            )
                                                                          }
                                                                        />
                                                                        <a
                                                                          className="hreflink"
                                                                          title="Show All Child"
                                                                          data-toggle="modal"
                                                                        >
                                                                          <img
                                                                            className="icon-sites-img ml20"
                                                                            src={
                                                                              childinew.SiteIcon
                                                                            }
                                                                          ></img>
                                                                        </a>
                                                                      </span>
                                                                    </td>
                                                                    <td
                                                                      style={{
                                                                        width:
                                                                          "7%",
                                                                      }}
                                                                    >
                                                                      {" "}
                                                                      <div className="d-flex">
                                                                        <span className="ml-2">
                                                                          {
                                                                            childinew.Shareweb_x0020_ID
                                                                          }
                                                                        </span>
                                                                      </div>
                                                                    </td>
                                                                    <td
                                                                      style={{
                                                                        width:
                                                                          "23%",
                                                                      }}
                                                                    >
                                                                      {childinew.siteType ==
                                                                        "Master Tasks" && (
                                                                        <a
                                                                          className="hreflink serviceColor_Active"
                                                                          target="_blank"
                                                                          data-interception="off"
                                                                          href={
                                                                            NextProp.siteUrl +
                                                                            "/SitePages/Portfolio-Profile.aspx?taskId=" +
                                                                            childinew.Id
                                                                          }
                                                                        >
                                                                          <span
                                                                            dangerouslySetInnerHTML={{
                                                                              __html:
                                                                                childinew?.TitleNew,
                                                                            }}
                                                                          ></span>
                                                                        </a>
                                                                      )}
                                                                      {childinew.siteType !=
                                                                        "Master Tasks" && (
                                                                        <a
                                                                          className="hreflink serviceColor_Active"
                                                                          target="_blank"
                                                                          data-interception="off"
                                                                          href={
                                                                            NextProp.siteUrl +
                                                                            "/SitePages/Task-Profile.aspx?taskId=" +
                                                                            childinew.Id +
                                                                            "&Site=" +
                                                                            childinew.siteType
                                                                          }
                                                                        >
                                                                          {" "}
                                                                          <span
                                                                            dangerouslySetInnerHTML={{
                                                                              __html:
                                                                                childinew?.TitleNew,
                                                                            }}
                                                                          ></span>
                                                                        </a>
                                                                      )}
                                                                      {childinew.childs !=
                                                                        undefined &&
                                                                        childinew
                                                                          .childs
                                                                          .length >
                                                                          0 && (
                                                                          <span className="ms-1">
                                                                            (
                                                                            {
                                                                              childinew
                                                                                .childs
                                                                                .length
                                                                            }
                                                                            )
                                                                          </span>
                                                                        )}
                                                                      {childinew.Short_x0020_Description_x0020_On !=
                                                                        null && (
                                                                       
                                                                        <div
                                                                          className="popover__wrapper ms-1"
                                                                          data-bs-toggle="tooltip"
                                                                          data-bs-placement="auto"
                                                                        >
                                                                          <img
                                                                            src={
                                                                              GlobalConstants.MAIN_SITE_URL +
                                                                              "/SP/SiteCollectionImages/ICONS/24/infoIcon.png"
                                                                            }
                                                                          />
                                                                          <div className="popover__content">
                                                                            {
                                                                              childinew.Short_x0020_Description_x0020_On
                                                                            }
                                                                          </div>
                                                                        </div>
                                                                      )}
                                                                    </td>
                                                                    <td
                                                                      style={{
                                                                        width:
                                                                          "7%",
                                                                      }}
                                                                    >
                                                                      <div>
                                                                        {childinew.ClientCategory !=
                                                                          undefined &&
                                                                          childinew
                                                                            .ClientCategory
                                                                            .length >
                                                                            0 &&
                                                                          childinew.ClientCategory.map(
                                                                            function (client: {
                                                                              Title: string;
                                                                            }) {
                                                                              return (
                                                                                <span
                                                                                  className="ClientCategory-Usericon"
                                                                                  title={
                                                                                    client.Title
                                                                                  }
                                                                                >
                                                                                  <a>
                                                                                    {client.Title.slice(
                                                                                      0,
                                                                                      2
                                                                                    ).toUpperCase()}
                                                                                  </a>
                                                                                </span>
                                                                              );
                                                                            }
                                                                          )}
                                                                      </div>
                                                                    </td>
                                                                    <td
                                                                      style={{
                                                                        width:
                                                                          "4%",
                                                                      }}
                                                                    >
                                                                      {
                                                                        childinew.PercentComplete
                                                                      }
                                                                    </td>
                                                                    <td
                                                                      style={{
                                                                        width:
                                                                          "7%",
                                                                      }}
                                                                    >
                                                                      {
                                                                        childinew.ItemRank
                                                                      }
                                                                    </td>
                                                                    <td
                                                                      style={{
                                                                        width:
                                                                          "10%",
                                                                      }}
                                                                    >
                                                                      <div>
                                                                        <ShowTaskTeamMembers
                                                                          props={
                                                                            childinew
                                                                          }
                                                                          TaskUsers={
                                                                            AllUsers
                                                                          }
                                                                        ></ShowTaskTeamMembers>
                                                                    
                                                                      </div>
                                                                    </td>
                                                                    <td
                                                                      style={{
                                                                        width:
                                                                          "9%",
                                                                      }}
                                                                    >
                                                                      {
                                                                        childinew.DueDate
                                                                      }
                                                                    </td>
                                                                    <td
                                                                      style={{
                                                                        width:
                                                                          "11%",
                                                                      }}
                                                                    >
                                                                      {childinew.Created !=
                                                                      null
                                                                        ? Moment(
                                                                            childinew.Created
                                                                          ).format(
                                                                            "DD/MM/YYYY"
                                                                          )
                                                                        : ""}

                                                                      {childinew.Author !=
                                                                      undefined ? (
                                                                        <img
                                                                          className="AssignUserPhoto"
                                                                          title={
                                                                            childinew
                                                                              .Author
                                                                              .Title
                                                                          }
                                                                          src={findUserByName(
                                                                            childinew
                                                                              .Author
                                                                              .Title
                                                                          )}
                                                                        />
                                                                      ) : (
                                                                        <img
                                                                          className="AssignUserPhoto"
                                                                          src="https://hhhhteams.sharepoint.com/sites/HHHH/PublishingImages/Portraits/icon_user.jpg"
                                                                        />
                                                                      )}
                                                                    </td>

                                                                    <td
                                                                      style={{
                                                                        width:
                                                                          "7%",
                                                                      }}
                                                                    >
                                                                      {/* {childinew.Item_x0020_Type == 'Task' &&
                                                                                                                        <>
                                                                                                                        {smartTime.toFixed(1)}
                                                                                                                      </>
                                                                                                                      }
                                                                                                                       {SmartTimes? <SmartTimeTotal props={childinew} CallBackSumSmartTime={CallBackSumSmartTime} /> : null} */}
                                                                    </td>

                                                                    <td
                                                                      style={{
                                                                        width:
                                                                          "2%",
                                                                      }}
                                                                    >
                                                                      {childinew.Item_x0020_Type ==
                                                                        "Task" &&
                                                                        childinew.siteType !=
                                                                          "Master Tasks" && (
                                                                          <a
                                                                            onClick={(
                                                                              e
                                                                            ) =>
                                                                              EditData(
                                                                                e,
                                                                                childinew
                                                                              )
                                                                            }
                                                                          >
                                                                            <span className="svg__iconbox svg__icon--clock"></span>
                                                                          </a>
                                                                        )}
                                                                    </td>
                                                                    <td
                                                                      style={{
                                                                        width:
                                                                          "2%",
                                                                      }}
                                                                    >
                                                                      {childinew.siteType ===
                                                                        "Master Tasks" &&
                                                                        childinew.isRestructureActive && (
                                                                          <a
                                                                            href="#"
                                                                            data-bs-toggle="tooltip"
                                                                            data-bs-placement="auto"
                                                                            title="Edit"
                                                                          >
                                                                            <img
                                                                              className="icon-sites-img"
                                                                              src={
                                                                                childinew.Restructuring
                                                                              }
                                                                              onClick={(
                                                                                e
                                                                              ) =>
                                                                                OpenModal(
                                                                                  childinew
                                                                                )
                                                                              }
                                                                            />
                                                                          </a>
                                                                        )}
                                                                      <span>
                                                                        {IsShowRestru ? (
                                                                          <img
                                                                            className="icon-sites-img ml20"
                                                                            onClick={(
                                                                              e
                                                                            ) =>
                                                                              OpenModal(
                                                                                props
                                                                              )
                                                                            }
                                                                            src={
                                                                              IsShowRestru &&
                                                                              IsUpdated ==
                                                                                "Service"
                                                                                ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png"
                                                                                : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"
                                                                            }
                                                                          ></img>
                                                                        ) : (
                                                                          ""
                                                                        )}
                                                                      </span>
                                                                    </td>
                                                                    <td
                                                                      style={{
                                                                        width:
                                                                          "2%",
                                                                      }}
                                                                    >
                                                                      <a>
                                                                        {childinew.siteType ==
                                                                          "Master Tasks" && (
                                                                            <span onClick={(e) => EditComponentPopup(childinew )}  className="svg__iconbox svg__icon--edit"></span>
                                                                        
                                                                        )}
                                                                        {childinew.Item_x0020_Type ==
                                                                          "Task" &&
                                                                          childinew.siteType !=
                                                                            "Master Tasks" && (
                                                                              <span onClick={(e) => EditItemTaskPopup(childinew )}  className="svg__iconbox svg__icon--edit"></span>
                                                            
                                                                          )}
                                                                      </a>
                                                                    </td>
                                                                    {/* <td style={{ width: "3%" }}>{childinew.Item_x0020_Type == 'Task' && childinew.siteType != "Master Tasks" && <a onClick={(e) => EditData(e, childinew)}><img style={{ width: "22px" }} src={GlobalConstants.MAIN_SITE_URL + "/SP/SiteCollectionImages/ICONS/24/clock-gray.png"}></img></a>}</td>
                                                                                                                <td style={{ width: "3%" }}><a>{childinew.siteType == "Master Tasks" && <img width="30" height="25" src={require('../../../Assets/ICON/edit_page.svg')} onClick={(e) => EditComponentPopup(childinew)} />}
                                                                                                                    {childinew.Item_x0020_Type == 'Task' && childinew.siteType != "Master Tasks" && <img width="30" height="25" src={require('../../../Assets/ICON/edit_page.svg')} onClick={(e) => EditItemTaskPopup(childinew)} />}</a></td> */}
                                                                  </tr>
                                                                </table>
                                                              </td>
                                                            </tr>
                                                            {childinew.show &&
                                                              childinew.childs
                                                                .length > 0 && (
                                                                <>
                                                                  {childinew.childs.map(
                                                                    function (
                                                                      subchilditem: any
                                                                    ) {
                                                                      return (
                                                                        <>
                                                                          <tr>
                                                                            <td
                                                                              className="p-0"
                                                                              colSpan={
                                                                                14
                                                                              }
                                                                            >
                                                                              <table
                                                                                className="table m-0"
                                                                                style={{
                                                                                  width:
                                                                                    "100%",
                                                                                }}
                                                                              >
                                                                                <tr className="for-c02">
                                                                                  <td
                                                                                    style={{
                                                                                      width:
                                                                                        "2%",
                                                                                    }}
                                                                                  >
                                                                                    <div
                                                                                      className="accordian-header"
                                                                                      onClick={() =>
                                                                                        handleOpen(
                                                                                          subchilditem
                                                                                        )
                                                                                      }
                                                                                    >
                                                                                      {subchilditem
                                                                                        .childs
                                                                                        .length >
                                                                                        0 && (
                                                                                        <a
                                                                                          className="hreflink"
                                                                                          title="Tap to expand the childs"
                                                                                        >
                                                                                          <div className="sign">
                                                                                            {subchilditem
                                                                                              .childs
                                                                                              .length >
                                                                                              0 &&
                                                                                            subchilditem.show ? (
                                                                                              <img
                                                                                                src={
                                                                                                  subchilditem.downArrowIcon
                                                                                                }
                                                                                              />
                                                                                            ) : (
                                                                                              <img
                                                                                                src={
                                                                                                  subchilditem.RightArrowIcon
                                                                                                }
                                                                                              />
                                                                                            )}
                                                                                          </div>
                                                                                        </a>
                                                                                      )}
                                                                                    </div>
                                                                                  </td>
                                                                                  <td
                                                                                    style={{
                                                                                      width:
                                                                                        "6%",
                                                                                    }}
                                                                                  >
                                                                                    <span className="pe-2">
                                                                                      <input
                                                                                        type="checkbox"
                                                                                        onChange={(
                                                                                          e
                                                                                        ) =>
                                                                                          onChangeHandler(
                                                                                            subchilditem,
                                                                                            item,
                                                                                            e
                                                                                          )
                                                                                        }
                                                                                      />
                                                                                    </span>
                                                                                    <span>
                                                                                      <a
                                                                                        className="hreflink"
                                                                                        title="Show All Child"
                                                                                        data-toggle="modal"
                                                                                      >
                                                                                        <img
                                                                                          className="icon-sites-img ml20"
                                                                                          src={
                                                                                            subchilditem.SiteIcon
                                                                                          }
                                                                                        ></img>
                                                                                      </a>
                                                                                    </span>
                                                                                  </td>
                                                                                  <td
                                                                                    style={{
                                                                                      width:
                                                                                        "7%",
                                                                                    }}
                                                                                  >
                                                                                    {" "}
                                                                                    <div className="d-flex">
                                                                                      <span className="ml-2">
                                                                                        {
                                                                                          subchilditem.Shareweb_x0020_ID
                                                                                        }
                                                                                      </span>
                                                                                    </div>
                                                                                  </td>
                                                                                  <td
                                                                                    style={{
                                                                                      width:
                                                                                        "23%",
                                                                                    }}
                                                                                  >
                                                                                    {subchilditem.siteType ==
                                                                                      "Master Tasks" && (
                                                                                      <a
                                                                                        className="hreflink serviceColor_Active"
                                                                                        target="_blank"
                                                                                        data-interception="off"
                                                                                        href={
                                                                                          NextProp.siteUrl +
                                                                                          "/SitePages/Portfolio-Profile.aspx?taskId=" +
                                                                                          childitem.Id
                                                                                        }
                                                                                      >
                                                                                        <span
                                                                                          dangerouslySetInnerHTML={{
                                                                                            __html:
                                                                                              subchilditem?.TitleNew,
                                                                                          }}
                                                                                        ></span>
                                                                                      </a>
                                                                                    )}
                                                                                    {subchilditem.siteType !=
                                                                                      "Master Tasks" && (
                                                                                      <a
                                                                                        className="hreflink serviceColor_Active"
                                                                                        target="_blank"
                                                                                        data-interception="off"
                                                                                        href={
                                                                                          NextProp.siteUrl +
                                                                                          "/SitePages/Task-Profile.aspx?taskId=" +
                                                                                          subchilditem.Id +
                                                                                          "&Site=" +
                                                                                          subchilditem.siteType
                                                                                        }
                                                                                      >
                                                                                        {" "}
                                                                                        <span
                                                                                          dangerouslySetInnerHTML={{
                                                                                            __html:
                                                                                              subchilditem?.TitleNew,
                                                                                          }}
                                                                                        ></span>
                                                                                      </a>
                                                                                    )}
                                                                                    {subchilditem.childs !=
                                                                                      undefined &&
                                                                                      subchilditem
                                                                                        .childs
                                                                                        .length >
                                                                                        0 && (
                                                                                        <span className="ms-1">
                                                                                          (
                                                                                          {
                                                                                            subchilditem
                                                                                              .childs
                                                                                              .length
                                                                                          }

                                                                                          )
                                                                                        </span>
                                                                                      )}
                                                                                    {subchilditem.Short_x0020_Description_x0020_On !=
                                                                                      null && (
                                                                                      // <span className="project-tool"><img
                                                                                      //     src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/infoIcon.png" /><span className="tooltipte">
                                                                                      //         <span className="tooltiptext">
                                                                                      //             <div className="tooltip_Desc">
                                                                                      //                 <span>{subchilditem.Short_x0020_Description_x0020_On}</span>
                                                                                      //             </div>
                                                                                      //         </span>
                                                                                      //     </span>
                                                                                      // </span>
                                                                                      <div
                                                                                        className="popover__wrapper ms-1"
                                                                                        data-bs-toggle="tooltip"
                                                                                        data-bs-placement="auto"
                                                                                      >
                                                                                        <img
                                                                                          src={
                                                                                            GlobalConstants.MAIN_SITE_URL +
                                                                                            "/SP/SiteCollectionImages/ICONS/24/infoIcon.png"
                                                                                          }
                                                                                        />
                                                                                        <div className="popover__content">
                                                                                          {
                                                                                            subchilditem.Short_x0020_Description_x0020_On
                                                                                          }
                                                                                        </div>
                                                                                      </div>
                                                                                    )}
                                                                                  </td>
                                                                                  <td
                                                                                    style={{
                                                                                      width:
                                                                                        "7%",
                                                                                    }}
                                                                                  >
                                                                                    <div>
                                                                                      {subchilditem.ClientCategory !=
                                                                                        undefined &&
                                                                                        subchilditem
                                                                                          .ClientCategory
                                                                                          .length >
                                                                                          0 &&
                                                                                        subchilditem.ClientCategory.map(
                                                                                          function (client: {
                                                                                            Title: string;
                                                                                          }) {
                                                                                            return (
                                                                                              <span
                                                                                                className="ClientCategory-Usericon"
                                                                                                title={
                                                                                                  client.Title
                                                                                                }
                                                                                              >
                                                                                                <a>
                                                                                                  {client.Title.slice(
                                                                                                    0,
                                                                                                    2
                                                                                                  ).toUpperCase()}
                                                                                                </a>
                                                                                              </span>
                                                                                            );
                                                                                          }
                                                                                        )}
                                                                                    </div>
                                                                                  </td>
                                                                                  <td
                                                                                    style={{
                                                                                      width:
                                                                                        "4%",
                                                                                    }}
                                                                                  >
                                                                                    {
                                                                                      subchilditem.PercentComplete
                                                                                    }
                                                                                  </td>
                                                                                  <td
                                                                                    style={{
                                                                                      width:
                                                                                        "7%",
                                                                                    }}
                                                                                  >
                                                                                    {
                                                                                      subchilditem.ItemRank
                                                                                    }
                                                                                  </td>
                                                                                  <td
                                                                                    style={{
                                                                                      width:
                                                                                        "10%",
                                                                                    }}
                                                                                  >
                                                                                    <div>
                                                                                      <ShowTaskTeamMembers
                                                                                        props={
                                                                                          subchilditem
                                                                                        }
                                                                                        TaskUsers={
                                                                                          AllUsers
                                                                                        }
                                                                                      ></ShowTaskTeamMembers>
                                                                                    </div>
                                                                                  </td>

                                                                                  <td
                                                                                    style={{
                                                                                      width:
                                                                                        "9%",
                                                                                    }}
                                                                                  >
                                                                                    {
                                                                                      subchilditem.DueDate
                                                                                    }
                                                                                  </td>
                                                                                  <td
                                                                                    style={{
                                                                                      width:
                                                                                        "11%",
                                                                                    }}
                                                                                  >
                                                                                    {subchilditem.Created !=
                                                                                    null
                                                                                      ? Moment(
                                                                                          subchilditem.Created
                                                                                        ).format(
                                                                                          "DD/MM/YYYY"
                                                                                        )
                                                                                      : ""}
                                                                                    {subchilditem.Author !=
                                                                                    undefined ? (
                                                                                      <img
                                                                                        className="AssignUserPhoto"
                                                                                        title={
                                                                                          subchilditem
                                                                                            .Author
                                                                                            .Title
                                                                                        }
                                                                                        src={findUserByName(
                                                                                          subchilditem
                                                                                            .Author
                                                                                            .Title
                                                                                        )}
                                                                                      />
                                                                                    ) : (
                                                                                      <img
                                                                                        className="AssignUserPhoto"
                                                                                        src="https://hhhhteams.sharepoint.com/sites/HHHH/PublishingImages/Portraits/icon_user.jpg"
                                                                                      />
                                                                                    )}
                                                                                  </td>

                                                                                  <td
                                                                                    style={{
                                                                                      width:
                                                                                        "7%",
                                                                                    }}
                                                                                  >
                                                                                    </td>

                                                                                  <td
                                                                                    style={{
                                                                                      width:
                                                                                        "2%",
                                                                                    }}
                                                                                  >
                                                                                    {subchilditem.Item_x0020_Type ==
                                                                                      "Task" &&
                                                                                      subchilditem.siteType !=
                                                                                        "Master Tasks" && (
                                                                                        <a
                                                                                          onClick={(
                                                                                            e
                                                                                          ) =>
                                                                                            EditData(
                                                                                              e,
                                                                                              subchilditem
                                                                                            )
                                                                                          }
                                                                                        >
                                                                                          <span className="svg__iconbox svg__icon--clock"></span>
                                                                                        </a>
                                                                                      )}
                                                                                  </td>
                                                                                  <td
                                                                                    style={{
                                                                                      width:
                                                                                        "2%",
                                                                                    }}
                                                                                  >
                                                                                    {childitem.siteType ===
                                                                                      "Master Tasks" &&
                                                                                      subchilditem.isRestructureActive && (
                                                                                        <a
                                                                                          href="#"
                                                                                          data-bs-toggle="tooltip"
                                                                                          data-bs-placement="auto"
                                                                                          title="Edit"
                                                                                        >
                                                                                          <img
                                                                                            className="icon-sites-img"
                                                                                            src={
                                                                                              childitem.Restructuring
                                                                                            }
                                                                                            onClick={(
                                                                                              e
                                                                                            ) =>
                                                                                              OpenModal(
                                                                                                childitem
                                                                                              )
                                                                                            }
                                                                                          />
                                                                                        </a>
                                                                                      )}
                                                                                    <span>
                                                                                      {IsShowRestru ? (
                                                                                        <img
                                                                                          className="icon-sites-img ml20"
                                                                                          onClick={(
                                                                                            e
                                                                                          ) =>
                                                                                            OpenModal(
                                                                                              props
                                                                                            )
                                                                                          }
                                                                                          src={
                                                                                            IsShowRestru &&
                                                                                            IsUpdated ==
                                                                                              "Service"
                                                                                              ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png"
                                                                                              : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"
                                                                                          }
                                                                                        ></img>
                                                                                      ) : (
                                                                                        ""
                                                                                      )}
                                                                                    </span>
                                                                                  </td>
                                                                                  <td
                                                                                    style={{
                                                                                      width:
                                                                                        "2%",
                                                                                    }}
                                                                                  >
                                                                                    <a>
                                                                                      {subchilditem.siteType ==
                                                                                        "Master Tasks" && (
                                                                                          <span onClick={(e) => EditComponentPopup(subchilditem )}  className="svg__iconbox svg__icon--edit"></span>
                                                                                       
                                                                                      )}
                                                                                      {subchilditem.Item_x0020_Type ==
                                                                                        "Task" &&
                                                                                        subchilditem.siteType !=
                                                                                          "Master Tasks" && (
                                                                                            <span onClick={(e) => EditItemTaskPopup(subchilditem )}  className="svg__iconbox svg__icon--edit"></span>
                                                                                   
                                                                                        )}
                                                                                    </a>
                                                                                  </td>
                                                                                   </tr>
                                                                              </table>
                                                                            </td>
                                                                          </tr>
                                                                          {subchilditem.show &&
                                                                            subchilditem
                                                                              .childs
                                                                              .length >
                                                                              0 && (
                                                                              <>
                                                                                {subchilditem.childs.map(
                                                                                  function (
                                                                                    nextsubchilditem: any
                                                                                  ) {
                                                                                    return (
                                                                                      <>
                                                                                        <tr>
                                                                                          <td
                                                                                            className="p-0"
                                                                                            colSpan={
                                                                                              14
                                                                                            }
                                                                                          >
                                                                                            <table
                                                                                              className="table m-0"
                                                                                              style={{
                                                                                                width:
                                                                                                  "100%",
                                                                                              }}
                                                                                            >
                                                                                              <tr className="for-c02">
                                                                                                <td
                                                                                                  style={{
                                                                                                    width:
                                                                                                      "2%",
                                                                                                  }}
                                                                                                >
                                                                                                  <div
                                                                                                    className="accordian-header"
                                                                                                    onClick={() =>
                                                                                                      handleOpen(
                                                                                                        nextsubchilditem
                                                                                                      )
                                                                                                    }
                                                                                                  >
                                                                                                    {nextsubchilditem
                                                                                                      .childs
                                                                                                      .length >
                                                                                                      0 && (
                                                                                                      <a
                                                                                                        className="hreflink"
                                                                                                        title="Tap to expand the childs"
                                                                                                      >
                                                                                                        <div className="sign">
                                                                                                          {nextsubchilditem
                                                                                                            .childs
                                                                                                            .length >
                                                                                                            0 &&
                                                                                                          nextsubchilditem.show ? (
                                                                                                            <img
                                                                                                              src={
                                                                                                                nextsubchilditem.downArrowIcon
                                                                                                              }
                                                                                                            />
                                                                                                          ) : (
                                                                                                            <img
                                                                                                              src={
                                                                                                                nextsubchilditem.RightArrowIcon
                                                                                                              }
                                                                                                            />
                                                                                                          )}
                                                                                                        </div>
                                                                                                      </a>
                                                                                                    )}
                                                                                                  </div>
                                                                                                </td>
                                                                                                <td
                                                                                                  style={{
                                                                                                    width:
                                                                                                      "6%",
                                                                                                  }}
                                                                                                >
                                                                                                  <span className="pe-2">
                                                                                                    <input
                                                                                                      type="checkbox"
                                                                                                      onChange={(
                                                                                                        e
                                                                                                      ) =>
                                                                                                        onChangeHandler(
                                                                                                          nextsubchilditem,
                                                                                                          item,
                                                                                                          e
                                                                                                        )
                                                                                                      }
                                                                                                    />
                                                                                                  </span>
                                                                                                  <span>
                                                                                                    <a
                                                                                                      className="hreflink"
                                                                                                      title="Show All Child"
                                                                                                      data-toggle="modal"
                                                                                                    >
                                                                                                      <img
                                                                                                        className="icon-sites-img ml20"
                                                                                                        src={
                                                                                                          nextsubchilditem.SiteIcon
                                                                                                        }
                                                                                                      ></img>
                                                                                                    </a>
                                                                                                  </span>
                                                                                                </td>
                                                                                                <td
                                                                                                  style={{
                                                                                                    width:
                                                                                                      "7%",
                                                                                                  }}
                                                                                                >
                                                                                                  {" "}
                                                                                                  <div className="d-flex">
                                                                                                    <span className="ml-2">
                                                                                                      {
                                                                                                        nextsubchilditem.Shareweb_x0020_ID
                                                                                                      }
                                                                                                    </span>
                                                                                                  </div>
                                                                                                </td>
                                                                                                <td
                                                                                                  style={{
                                                                                                    width:
                                                                                                      "23%",
                                                                                                  }}
                                                                                                >
                                                                                                  {nextsubchilditem.siteType ==
                                                                                                    "Master Tasks" && (
                                                                                                    <a
                                                                                                      className="hreflink serviceColor_Active"
                                                                                                      target="_blank"
                                                                                                      data-interception="off"
                                                                                                      href={
                                                                                                        NextProp.siteUrl +
                                                                                                        "/SitePages/Portfolio-Profile.aspx?taskId=" +
                                                                                                        childitem.Id
                                                                                                      }
                                                                                                    >
                                                                                                      {" "}
                                                                                                      <span
                                                                                                        dangerouslySetInnerHTML={{
                                                                                                          __html:
                                                                                                            nextsubchilditem?.TitleNew,
                                                                                                        }}
                                                                                                      ></span>
                                                                                                    </a>
                                                                                                  )}
                                                                                                  {nextsubchilditem.siteType !=
                                                                                                    "Master Tasks" && (
                                                                                                    <a
                                                                                                      className="hreflink serviceColor_Active"
                                                                                                      target="_blank"
                                                                                                      data-interception="off"
                                                                                                      href={
                                                                                                        NextProp.siteUrl +
                                                                                                        "/SitePages/Task-Profile.aspx?taskId=" +
                                                                                                        nextsubchilditem.Id +
                                                                                                        "&Site=" +
                                                                                                        nextsubchilditem.siteType
                                                                                                      }
                                                                                                    >
                                                                                                      {" "}
                                                                                                      <span
                                                                                                        dangerouslySetInnerHTML={{
                                                                                                          __html:
                                                                                                            nextsubchilditem?.TitleNew,
                                                                                                        }}
                                                                                                      ></span>
                                                                                                    </a>
                                                                                                  )}
                                                                                                  {nextsubchilditem.childs !=
                                                                                                    undefined &&
                                                                                                    nextsubchilditem
                                                                                                      .childs
                                                                                                      .length >
                                                                                                      0 && (
                                                                                                      <span className="ms-1">
                                                                                                        (
                                                                                                        {
                                                                                                          nextsubchilditem
                                                                                                            .childs
                                                                                                            .length
                                                                                                        }

                                                                                                        )
                                                                                                      </span>
                                                                                                    )}
                                                                                                  {nextsubchilditem.Short_x0020_Description_x0020_On !=
                                                                                                    null && (
                                                                                                    // <span className="project-tool"><img
                                                                                                    //     src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/infoIcon.png" /><span className="tooltipte">
                                                                                                    //         <span className="tooltiptext">
                                                                                                    //             <div className="tooltip_Desc">
                                                                                                    //                 <span>{nextsubchilditem.Short_x0020_Description_x0020_On}</span>
                                                                                                    //             </div>
                                                                                                    //         </span>
                                                                                                    //     </span>
                                                                                                    // </span>
                                                                                                    <div
                                                                                                      className="popover__wrapper ms-1"
                                                                                                      data-bs-toggle="tooltip"
                                                                                                      data-bs-placement="auto"
                                                                                                    >
                                                                                                      <img
                                                                                                        src={
                                                                                                          GlobalConstants.MAIN_SITE_URL +
                                                                                                          "/SP/SiteCollectionImages/ICONS/24/infoIcon.png"
                                                                                                        }
                                                                                                      />
                                                                                                      <div className="popover__content">
                                                                                                        {
                                                                                                          nextsubchilditem.Short_x0020_Description_x0020_On
                                                                                                        }
                                                                                                      </div>
                                                                                                    </div>
                                                                                                  )}
                                                                                                </td>
                                                                                                <td
                                                                                                  style={{
                                                                                                    width:
                                                                                                      "7%",
                                                                                                  }}
                                                                                                >
                                                                                                  <div>
                                                                                                    {nextsubchilditem.ClientCategory !=
                                                                                                      undefined &&
                                                                                                      nextsubchilditem
                                                                                                        .ClientCategory
                                                                                                        .length >
                                                                                                        0 &&
                                                                                                      nextsubchilditem.ClientCategory.map(
                                                                                                        function (client: {
                                                                                                          Title: string;
                                                                                                        }) {
                                                                                                          return (
                                                                                                            <span
                                                                                                              className="ClientCategory-Usericon"
                                                                                                              title={
                                                                                                                client.Title
                                                                                                              }
                                                                                                            >
                                                                                                              <a>
                                                                                                                {client.Title.slice(
                                                                                                                  0,
                                                                                                                  2
                                                                                                                ).toUpperCase()}
                                                                                                              </a>
                                                                                                            </span>
                                                                                                          );
                                                                                                        }
                                                                                                      )}
                                                                                                  </div>
                                                                                                </td>
                                                                                                <td
                                                                                                  style={{
                                                                                                    width:
                                                                                                      "4%",
                                                                                                  }}
                                                                                                >
                                                                                                  {
                                                                                                    nextsubchilditem.PercentComplete
                                                                                                  }
                                                                                                </td>
                                                                                                <td
                                                                                                  style={{
                                                                                                    width:
                                                                                                      "7%",
                                                                                                  }}
                                                                                                >
                                                                                                  {
                                                                                                    nextsubchilditem.ItemRank
                                                                                                  }
                                                                                                </td>
                                                                                                <td
                                                                                                  style={{
                                                                                                    width:
                                                                                                      "10%",
                                                                                                  }}
                                                                                                >
                                                                                                  <div>
                                                                                                    <ShowTaskTeamMembers
                                                                                                      props={
                                                                                                        nextsubchilditem
                                                                                                      }
                                                                                                      TaskUsers={
                                                                                                        AllUsers
                                                                                                      }
                                                                                                    ></ShowTaskTeamMembers>
                                                                                                  </div>
                                                                                                </td>

                                                                                                <td
                                                                                                  style={{
                                                                                                    width:
                                                                                                      "9%",
                                                                                                  }}
                                                                                                >
                                                                                                  {
                                                                                                    nextsubchilditem.DueDate
                                                                                                  }
                                                                                                </td>
                                                                                                <td
                                                                                                  style={{
                                                                                                    width:
                                                                                                      "11%",
                                                                                                  }}
                                                                                                >
                                                                                                  {nextsubchilditem.Created !=
                                                                                                  null
                                                                                                    ? Moment(
                                                                                                        nextsubchilditem.Created
                                                                                                      ).format(
                                                                                                        "DD/MM/YYYY"
                                                                                                      )
                                                                                                    : ""}
                                                                                                  {nextsubchilditem.Author !=
                                                                                                  undefined ? (
                                                                                                    <img
                                                                                                      className="AssignUserPhoto"
                                                                                                      title={
                                                                                                        nextsubchilditem
                                                                                                          .Author
                                                                                                          .Title
                                                                                                      }
                                                                                                      src={findUserByName(
                                                                                                        nextsubchilditem
                                                                                                          .Author
                                                                                                          .Title
                                                                                                      )}
                                                                                                    />
                                                                                                  ) : (
                                                                                                    <img
                                                                                                      className="AssignUserPhoto"
                                                                                                      src="https://hhhhteams.sharepoint.com/sites/HHHH/PublishingImages/Portraits/icon_user.jpg"
                                                                                                    />
                                                                                                  )}
                                                                                                </td>

                                                                                                <td
                                                                                                  style={{
                                                                                                    width:
                                                                                                      "7%",
                                                                                                  }}
                                                                                                >
                                                                                                </td>

                                                                                                <td
                                                                                                  style={{
                                                                                                    width:
                                                                                                      "2%",
                                                                                                  }}
                                                                                                >
                                                                                                  {nextsubchilditem.Item_x0020_Type ==
                                                                                                    "Task" &&
                                                                                                    nextsubchilditem.siteType !=
                                                                                                      "Master Tasks" && (
                                                                                                      <a
                                                                                                        onClick={(
                                                                                                          e
                                                                                                        ) =>
                                                                                                          EditData(
                                                                                                            e,
                                                                                                            nextsubchilditem
                                                                                                          )
                                                                                                        }
                                                                                                      >
                                                                                                        <span className="svg__iconbox svg__icon--clock"></span>
                                                                                                      </a>
                                                                                                    )}
                                                                                                </td>
                                                                                                <td
                                                                                                  style={{
                                                                                                    width:
                                                                                                      "2%",
                                                                                                  }}
                                                                                                >
                                                                                                  {nextsubchilditem.siteType ===
                                                                                                    "Master Tasks" &&
                                                                                                    nextsubchilditem.isRestructureActive && (
                                                                                                      <a
                                                                                                        href="#"
                                                                                                        data-bs-toggle="tooltip"
                                                                                                        data-bs-placement="auto"
                                                                                                        title="Edit"
                                                                                                      >
                                                                                                        <img
                                                                                                          className="icon-sites-img"
                                                                                                          src={
                                                                                                            nextsubchilditem.Restructuring
                                                                                                          }
                                                                                                          onClick={(
                                                                                                            e
                                                                                                          ) =>
                                                                                                            OpenModal(
                                                                                                              nextsubchilditem
                                                                                                            )
                                                                                                          }
                                                                                                        />
                                                                                                      </a>
                                                                                                    )}

                                                                                                  <span>
                                                                                                    {IsShowRestru ? (
                                                                                                      <img
                                                                                                        className="icon-sites-img ml20"
                                                                                                        onClick={(
                                                                                                          e
                                                                                                        ) =>
                                                                                                          OpenModal(
                                                                                                            props
                                                                                                          )
                                                                                                        }
                                                                                                        src={
                                                                                                          IsShowRestru &&
                                                                                                          IsUpdated ==
                                                                                                            "Service"
                                                                                                            ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png"
                                                                                                            : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"
                                                                                                        }
                                                                                                      ></img>
                                                                                                    ) : (
                                                                                                      ""
                                                                                                    )}
                                                                                                  </span>
                                                                                                </td>
                                                                                                <td
                                                                                                  style={{
                                                                                                    width:
                                                                                                      "2%",
                                                                                                  }}
                                                                                                >
                                                                                                  <a>
                                                                                                    {nextsubchilditem.siteType ==
                                                                                                      "Master Tasks" && (
                                                                                                        <span onClick={(
                                                                                                          e
                                                                                                        ) =>
                                                                                                          EditComponentPopup(
                                                                                                            nextsubchilditem)} className="svg__iconbox svg__icon--clock"></span>
                                                                                                  
                                                                                                    )}
                                                                                                    {nextsubchilditem.Item_x0020_Type ==
                                                                                                      "Task" &&
                                                                                                      nextsubchilditem.siteType !=
                                                                                                        "Master Tasks" && (
                                                                                                          <span onClick={(
                                                                                                            e
                                                                                                          ) =>
                                                                                                          EditItemTaskPopup(
                                                                                                              nextsubchilditem)} className="svg__iconbox svg__icon--clock"></span>

                                                          
                                                                                                      )}
                                                                                                  </a>
                                                                                                </td>
                                                                                            </tr>
                                                                                            </table>
                                                                                          </td>
                                                                                        </tr>
                                                                                      </>
                                                                                    );
                                                                                  }
                                                                                )}
                                                                              </>
                                                                            )}
                                                                        </>
                                                                      );
                                                                    }
                                                                  )}
                                                                </>
                                                              )}
                                                          </>
                                                        );
                                                      }
                                                    }
                                                  )}
                                                </>
                                              )}
                                          </>
                                        );
                                      }
                                    })}
                                  </>
                                )}
                              </>
                            );
                          }
                        })}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {IsTask && (
        <EditTaskPopup Items={SharewebTask} AllListId={NextProp} Call={Call}  context={NextProp.Context}></EditTaskPopup>
      )}
      {IsComponent && (
        <EditInstituton item={SharewebComponent} SelectD={NextProp} Calls={Call}></EditInstituton>
      )}
      {IsTimeEntry && (
        <TimeEntryPopup
          props={SharewebTimeComponent}
          Context={NextProp.Context}
          CallBackTimeEntry={TimeEntryCallBack}
        ></TimeEntryPopup>
      )}
      {/* {popupStatus ? <EditInstitution props={itemData} /> : null} */}
      {MeetingPopup && (
        <CreateActivity
          props={MeetingItems[0]}
          Call={Call}
          LoadAllSiteTasks={LoadAllSiteTasks}
          SelectedProp={NextProp}
        ></CreateActivity>
      )}
      {WSPopup && (
        <CreateWS props={MeetingItems[0]} SelectedProp={NextProp} Call={Call} data={data}></CreateWS>
      )}

      <Panel
        
        onRenderHeader={onRenderCustomHeader} 
        type={PanelType.medium}
        isOpen={addModalOpen}
        isBlocking={false}
        onDismiss={CloseCall}
      >
        <PortfolioStructureCreationCard
          CreatOpen={CreateOpenCall}
          Close={CloseCall}
          PortfolioType={IsUpdated}
          PropsValue={NextProp} 
          SelectedItem={
            checkedList != null && checkedList.length > 0
              ? checkedList[0]
              : props
          }
        />
      </Panel>
      <Panel
        onRenderHeader={onRenderCustomHeaderMain}
        type={PanelType.custom}
        customWidth="600px"
        isOpen={ActivityPopup}
        onDismiss={closeTaskStatusUpdatePoup2}
        isBlocking={false}
      >
      

        <div className="modal-body bg-f5f5 clearfix">
          <div
            className={
              props?.Portfolio_x0020_Type == "Events Portfolio"
                ? "app component clearfix eventpannelorange"
                : props?.Portfolio_x0020_Type == "Service"
                ? "app component clearfix serviepannelgreena"
                : "app component clearfix"
            }
          >
            <div id="portfolio" className="section-event pt-0">
             
              {props != undefined && props.Portfolio_x0020_Type == "Service" ? (
                <ul className="quick-actions">
                  <li className="mx-1 p-2 position-relative bg-siteColor text-center mb-2">
                    <div onClick={(e) => CreateMeetingPopups("Task")}>
                      <span className="icon-sites">
                        <img
                          className="icon-sites"
                          src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/bug.png"
                        />
                      </span>
                      Bug
                    </div>
                  </li>
                  <li className="mx-1 p-2 position-relative bg-siteColor text-center mb-2">
                    <div onClick={() => CreateMeetingPopups("Task")}>
                      <span className="icon-sites">
                        <img
                          className="icon-sites"
                          src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/feedbck.png"
                        />
                      </span>
                      Feedback
                    </div>
                  </li>
                  <li className="mx-1 p-2 position-relative bg-siteColor text-center mb-2">
                    <div onClick={() => CreateMeetingPopups("Task")}>
                      <span className="icon-sites">
                        <img src="	https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/Impovement.png" />
                      </span>
                      Improvement
                    </div>
                  </li>
                  <li className="mx-1 p-2 position-relative bg-siteColor text-center mb-2">
                    <div onClick={() => CreateMeetingPopups("Task")}>
                      <span className="icon-sites">
                        <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/design.png" />
                      </span>
                      Design
                    </div>
                  </li>
                  <li className="mx-1 p-2 position-relative bg-siteColor text-center mb-2">
                    <div onClick={() => CreateMeetingPopups("Activities")}>
                      <span className="icon-sites"></span>
                      Activities
                    </div>
                  </li>
                  <li className="mx-1 p-2 position-relative bg-siteColor text-center mb-2">
                    <div onClick={() => CreateMeetingPopups("Task")}>
                      <span className="icon-sites"></span>
                      Task
                    </div>
                  </li>
                </ul>
              ) : (
                <ul className="quick-actions">
                  <li className="mx-1 p-2 position-relative bg-siteColor text-center mb-2">
                    <div onClick={(e) => CreateMeetingPopups("Implementation")}>
                      <span className="icon-sites">
                        <img
                          className="icon-sites"
                          src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/Implementation.png"
                        />
                      </span>
                      Implmentation
                    </div>
                  </li>
                  <li className="mx-1 p-2 position-relative bg-siteColor text-center mb-2">
                    <div onClick={() => CreateMeetingPopups("Development")}>
                      <span className="icon-sites">
                        <img
                          className="icon-sites"
                          src="	https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/development.png"
                        />
                      </span>
                      Development
                    </div>
                  </li>
                  <li className="mx-1 p-2 position-relative bg-siteColor text-center mb-2">
                    <div onClick={() => CreateMeetingPopups("Activities")}>
                      <span className="icon-sites"></span>
                      Activity
                    </div>
                  </li>
                </ul>
              )}
            </div>
          </div>
          <button
            type="button"
            className="btn btn-default btn-default ms-1 pull-right"
            onClick={closeTaskStatusUpdatePoup2}
          >
            Cancel
          </button>
        </div>
      </Panel>
      <Panel
        headerText={` Restructuring Tool `}
        type={PanelType.medium}
        isOpen={ResturuningOpen}
        isBlocking={false}
        onDismiss={RestruringCloseCall}
      >
        <div>
          {ResturuningOpen ? (
            <div className="bg-ee p-2 restructurebox">
              <div>
                {NewArrayBackup != undefined && NewArrayBackup.length > 0 ? (
                  <span>
                    All below selected items will become child of{" "}
                    <img
                      className="icon-sites-img me-1 "
                      src={NewArrayBackup[0].SiteIcon}
                    ></img>{" "}
                    <a
                      data-interception="off"
                      target="_blank"
                      className="hreflink serviceColor_Active"
                      href={
                        NextProp.siteUrl+"/SitePages/Portfolio-Profile.aspxHH?taskId=" +
                        NewArrayBackup[0].Id
                      }
                    >
                      <span>{NewArrayBackup[0].Title}</span>
                    </a>{" "}
                    please click Submit to continue.
                  </span>
                ) : (
                  ""
                )}
              </div>
              <div>
                <span> Old: </span>
                {OldArrayBackup.map(function (obj: any, index) {
                  return (
                    <span>
                      {" "}
                      <img
                        className="icon-sites-img me-1 ml20"
                        src={obj.SiteIcon}
                      ></img>
                      <a
                        data-interception="off"
                        target="_blank"
                        className="hreflink serviceColor_Active"
                        href={
                          NextProp.siteUrl+"/SitePages/Portfolio-Profile.aspx?taskId=" +
                          obj.Id
                        }
                      >
                        <span>{obj.Title} </span>
                      </a>
                      {OldArrayBackup.length - 1 < index ? ">" : ""}{" "}
                    </span>
                  );
                })}
              </div>
              <div>
                <span> New: </span>{" "}
                {NewArrayBackup.map(function (newobj: any, indexnew) {
                  return (
                    <>
                      <span>
                        {" "}
                        <img
                          className="icon-sites-img me-1 ml20"
                          src={newobj.SiteIcon}
                        ></img>
                        <a
                          data-interception="off"
                          target="_blank"
                          className="hreflink serviceColor_Active"
                          href={
                            NextProp.siteUrl+"/SitePages/Portfolio-Profile.aspx?taskId=" +
                            newobj.Id
                          }
                        >
                          <span>{newobj.Title} </span>
                        </a>
                        {NewArrayBackup.length - 1 < indexnew ? ">" : ""}
                      </span>
                    </>
                  );
                })}
                <span>
                  {" "}
                  <img
                    className="icon-sites-img me-1 ml20"
                    src={RestructureChecked[0].SiteIcon}
                  ></img>
                  <a
                    data-interception="off"
                    target="_blank"
                    className="hreflink serviceColor_Active"
                    href={
                      NextProp.siteUrl+"/SitePages/Portfolio-Profile.aspx?taskId=" +
                      RestructureChecked[0].Id
                    }
                  >
                    <span>{RestructureChecked[0].Title} </span>
                  </a>
                </span>
              </div>
              {console.log(
                "restructure functio test in div==================================="
              )}
              {checkedList != undefined &&
              checkedList.length > 0 &&
              checkedList[0].Item_x0020_Type != "Task" ? (
                <div>
                  <span>
                    {" "}
                    {"Select Component Type :"}
                    <input
                      type="radio"
                      name="fav_language"
                      value="SubComponent"
                      checked={
                        RestructureChecked[0].Item_x0020_Type == "SubComponent"
                          ? true
                          : false
                      }
                      onChange={(e) =>
                        setRestructure(RestructureChecked[0], "SubComponent")
                      }
                    />
                    <label className="ms-1"> {"SubComponent"} </label>
                  </span>
                  <span>
                    {" "}
                    <input
                      type="radio"
                      name="fav_language"
                      value="SubComponent"
                      checked={
                        RestructureChecked[0].Item_x0020_Type === "Feature"
                          ? true
                          : false
                      }
                      onChange={(e) =>
                        setRestructure(RestructureChecked[0], "Feature")
                      }
                    />{" "}
                    <label className="ms-1"> {"Feature"} </label>{" "}
                  </span>
                </div>
              ) : (
                ""
              )}
            </div>
          ) : (
            ""
          )}
        </div>
        <footer className="mt-2 text-end">
          {checkedList != undefined &&
          checkedList.length > 0 &&
          checkedList[0].Item_x0020_Type === "Task" ? (
            <button
              type="button"
              className="btn btn-primary "
              onClick={(e) => UpdateTaskRestructure()}
            >
              Save
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary "
              onClick={(e) => UpdateRestructure()}
            >
              Save
            </button>
          )}
          <button
            type="button"
            className="btn btn-default btn-default ms-1"
            onClick={RestruringCloseCall}
          >
            Cancel
          </button>
        </footer>
      </Panel>
    </div>
  );
}
