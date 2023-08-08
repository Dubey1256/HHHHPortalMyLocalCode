import * as React from "react";
import { arraysEqual, Modal, Panel, PanelType } from "office-ui-fabric-react";
import pnp, { Web, SearchQuery, SearchResults } from "sp-pnp-js";
import { Version } from "@microsoft/sp-core-library";
import * as moment from "moment";
import { sortBy } from "@microsoft/sp-lodash-subset";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import Tooltip from "../../globalComponents/Tooltip";
import { Title } from "@material-ui/icons";
var serachTitle: any = "";
var search: any = "";
const ComponentPortPolioPopup = ({ props, Dynamic, Call }: any) => {
  const [modalIsOpen, setModalIsOpen] = React.useState(false);
  const [backupComponentsData, setBackupComponentsData] = React.useState([]);
  const [componentsData, setComponentsData] = React.useState([]);
  const [table, setTable] = React.useState(componentsData);
  const [CheckBoxdata, setcheckbox] = React.useState([]);
  const [selectedComponent, selctedCompo] = React.useState("");
  // const [search, setSearch]: [string, (search: string) => void] = React.useState("");
  const [MainDataBackup, setMainDataBackup] = React.useState([]);
  const [TotalTask, setTotalTask] = React.useState([]);
  const [SubComponentsData, setSubComponentsData] = React.useState([]);
  const [FeatureData, setFeatureData] = React.useState([]);
  React.useEffect(() => {
    if (props.smartComponent != undefined && props.smartComponent.length > 0)
      selctedCompo(props.smartComponent[0]);
    GetComponents();
  }, []);
  function Example(callBack: any, type: any) {
    Call(callBack, type);
  }

  const setModalIsOpenToFalse = () => {
    Example(props, "SmartComponent");
    setModalIsOpen(false);
  };
  const setModalIsOpenToOK = () => {
    if (
      props?.smartComponent != undefined &&
      props?.smartComponent.length == 0
    )
      props.smartComponent = CheckBoxdata;
    else {
      props.smartComponent = [];
      props.smartComponent = CheckBoxdata;
    }
    Example(props, "SmartComponent");
    setModalIsOpen(false);
  };

  const sortByDng = () => {
    const copy = componentsData;

    copy.sort((a, b) => (a.Title > b.Title ? -1 : 1));

    setTable(copy);
  };

  const handleOpen = (item: any) => {
    item.show = item.show = item?.show == true ? false : true;
    setComponentsData((componentsData) => [...componentsData]);
  };
  var Response: [] = [];
  const GetTaskUsers = async () => {
    let web = new Web(Dynamic?.siteUrl);
    let taskUsers = [];
    taskUsers = await web.lists.getById(Dynamic.TaskUsertListID).items.get();
    Response = taskUsers;
    //console.log(this.taskUsers);
  };
  const GetComponents = async () => {
    var RootComponentsData: any[] = [];
    var ComponentsData: any[] = [];
    var SubComponentsData: any[] = [];
    var FeatureData: any[] = [];

    let web = new Web(Dynamic?.siteUrl);
    let componentDetails = [];
    componentDetails = await web.lists
      //.getById('ec34b38f-0669-480a-910c-f84e92e58adf')
      .getById(`${Dynamic.MasterTaskListID}`)
      .items//.getById(this.state.itemID)
      .select(
        "ID",
        "Title",
        "DueDate",
        "Status",
        "ItemRank",
        "ClientTime",
        "Item_x0020_Type",
        "Parent/Id",
        "Author/Id",
        "Author/Title",
        "Parent/Title",
        "Portfolio_x0020_Type",
        "SharewebCategories/Id",
        "SharewebCategories/Title",
        "AssignedTo/Id",
        "AssignedTo/Title",
        "Team_x0020_Members/Id",
        "Team_x0020_Members/Title",
        "ClientCategory/Id",
        "ClientCategory/Title"
      )
      .expand(
        "Team_x0020_Members",
        "Author",
        "ClientCategory",
        "Parent",
        "SharewebCategories",
        "AssignedTo",
        "ClientCategory"
      )
      .top(4999)
      .get();

    console.log(componentDetails);
    await GetTaskUsers();

    $.each(componentDetails, function (index: any, result: any) {
      result.TitleNew = result.Title;
      result.TeamLeaderUser = [];
      result.DueDate = moment(result.DueDate).format("DD/MM/YYYY");

      if (result.DueDate == "Invalid date" || "") {
        result.DueDate = result.DueDate.replaceAll("Invalid date", "");
      }
      if (result.PercentComplete != undefined)
        result.PercentComplete = (result.PercentComplete * 100).toFixed(0);

      if (result.Short_x0020_Description_x0020_On != undefined) {
        result.Short_x0020_Description_x0020_On =
          result.Short_x0020_Description_x0020_On.replace(/(<([^>]+)>)/gi, "");
      }

      if (result.AssignedTo != undefined && result.AssignedTo.length > 0) {
        $.each(result.AssignedTo, function (index: any, Assig: any) {
          if (Assig.Id != undefined) {
            $.each(Response, function (index: any, users: any) {
              if (
                Assig.Id != undefined &&
                users.AssingedToUserId != undefined &&
                Assig.Id == users.AssingedToUserId
              ) {
                users.ItemCover = users.Item_x0020_Cover;
                result.TeamLeaderUser.push(users);
              }
            });
          }
        });
      }
      if (
        result.Team_x0020_Members != undefined &&
        result.Team_x0020_Members.length > 0
      ) {
        $.each(result.Team_x0020_Members, function (index: any, Assig: any) {
          if (Assig.Id != undefined) {
            $.each(Response, function (index: any, users: any) {
              if (
                Assig.Id != undefined &&
                users.AssingedToUserId != undefined &&
                Assig.Id == users.AssingedToUserId
              ) {
                users.ItemCover = users.Item_x0020_Cover;
                result.TeamLeaderUser.push(users);
              }
            });
          }
        });
      }

      if (
        result.ClientCategory != undefined &&
        result.ClientCategory.length > 0
      ) {
        $.each(result.Team_x0020_Members, function (index: any, catego: any) {
          result.ClientCategory.push(catego);
        });
      }
      if(result.Portfolio_x0020_Type == 'Component'){
      if (result.Item_x0020_Type == "Root Component") {
        result["childs"] = [];
        RootComponentsData.push(result);
      }
      if (result.Item_x0020_Type == "Component") {
        result["childs"] = [];
        ComponentsData.push(result);
      }

      if (result.Item_x0020_Type == "SubComponent") {
        result["childs"] = [];
        SubComponentsData.push(result);
      }
      if (result.Item_x0020_Type == "Feature") {
        result["childs"] = [];
        FeatureData.push(result);
      }
      }
      
    });

    $.each(SubComponentsData, function (index: any, subcomp: any) {
      if (subcomp.Title != undefined) {
        $.each(FeatureData, function (index: any, featurecomp: any) {
          if (
            featurecomp.Parent != undefined &&
            subcomp.Id == featurecomp.Parent.Id
          ) {
            subcomp["childs"].push(featurecomp);
          }
        });
      }
    });

    $.each(ComponentsData, function (index: any, subcomp: any) {
      if (subcomp.Title != undefined) {
        $.each(SubComponentsData, function (index: any, featurecomp: any) {
          if (
            featurecomp.Parent != undefined &&
            subcomp.Id == featurecomp.Parent.Id
          ) {
            subcomp["childs"].push(featurecomp);
          }
        });
      }
    });
    //MainDataBackup.push(ComponentsData)
    setMainDataBackup(ComponentsData);
    setComponentsData(ComponentsData);
    const tempData: any = ComponentsData;
    setMainDataBackup(tempData);
    console.log("All Components Data =======================", ComponentsData);
    setModalIsOpen(true);
  };
  // *********** this is for Column  searching in Table ******************

  // const columnSearchFunction = (e: { target: { value: string; }; }, titleName: any) => {
  //     let searchKey = e.target.value;
  //     let filteredMainArrayData: any = [];
  //     let filteredLevelTwoData: any = [];
  //     let filteredLevelThreeData: any = [];
  //     let filteredLevelFourData: any = [];
  //     if (searchKey?.length > 0) {
  //         if (titleName == "Title") {
  //             MainDataBackup?.map((ComponentDataItem: any) => {
  //                 if (ComponentDataItem.Title.toLowerCase().includes(searchKey)) {
  //                     let changeArrayFirst: any = ComponentDataItem
  //                     changeArrayFirst.childs = []
  //                     filteredMainArrayData.push(changeArrayFirst)
  //                     if (ComponentDataItem.childs != undefined && ComponentDataItem.childs?.length > 0) {
  //                         ComponentDataItem.childs?.map((FirstChild: any) => {
  //                             if (FirstChild.Title.toLowerCase().includes(searchKey)) {
  //                                 let changeArraySecond: any = FirstChild
  //                                 changeArraySecond.childs = []
  //                                 filteredLevelTwoData.push(changeArraySecond);
  //                                 if (FirstChild.childs != undefined && FirstChild.childs?.length > 0) {
  //                                     FirstChild.childs?.map((SecondChild: any) => {
  //                                         if (SecondChild.Title.toLowerCase().includes(searchKey)) {
  //                                             let changeArrayThird: any = SecondChild;
  //                                             changeArrayThird.childs = [];
  //                                             filteredLevelThreeData.push(changeArrayThird);
  //                                         }
  //                                     })
  //                                 }

  //                             }
  //                         })
  //                     }

  //                     // filteredMainArrayData.push(ComponentDataItem);
  //                 } else {
  //                     let changeArrayThird: any = [];
  //                     filteredLevelThreeData.push(changeArrayThird);
  //                 }
  //             })
  //         }
  //         if (titleName == "ClientCategory") {
  //             MainDataBackup?.map((ComponentDataItem: any) => {
  //                 if (ComponentDataItem.ClientCategory != undefined && ComponentDataItem.ClientCategory?.length > 0) {
  //                     ComponentDataItem.ClientCategory?.map((ClientData: any) => {
  //                         if (ClientData.Title.toLowerCase().includes(searchKey)) {
  //                             filteredMainArrayData.push(ComponentDataItem);
  //                         }
  //                     })
  //                 }

  //                 // if (ComponentData.Title.toLowerCase().includes(searchKey)) {
  //                 //     // if (ComponentData.childs != undefined && ComponentData.childs?.length > 0) {

  //                 //     // } else {
  //                 //     //     filteredMainArrayData.push(ComponentData);
  //                 //     // }
  //                 //     filteredMainArrayData.push(ComponentData);
  //                 // }
  //             })
  //             MainDataBackup?.map((ComponentDataItem: any) => {
  //                 if (ComponentDataItem.ClientCategory != undefined && ComponentDataItem.ClientCategory?.length > 0) {
  //                 if (ComponentDataItem.Title.toLowerCase().includes(searchKey)) {
  //                     let changeArrayFirst: any = ComponentDataItem
  //                     changeArrayFirst.childs = []
  //                     filteredMainArrayData.push(changeArrayFirst)
  //                     if (ComponentDataItem.childs != undefined && ComponentDataItem.childs?.length > 0) {
  //                         ComponentDataItem.childs?.map((FirstChild: any) => {
  //                             if (FirstChild.Title.toLowerCase().includes(searchKey)) {
  //                                 let changeArraySecond: any = FirstChild
  //                                 changeArraySecond.childs = []
  //                                 filteredLevelTwoData.push(changeArraySecond);
  //                                 if (FirstChild.childs != undefined && FirstChild.childs?.length > 0) {
  //                                     FirstChild.childs?.map((SecondChild: any) => {
  //                                         if (SecondChild.Title.toLowerCase().includes(searchKey)) {
  //                                             let changeArrayThird: any = SecondChild;
  //                                             changeArrayThird.childs = [];
  //                                             filteredLevelThreeData.push(changeArrayThird);
  //                                         }
  //                                     })
  //                                 }

  //                             }
  //                         })
  //                     }

  //                     // filteredMainArrayData.push(ComponentDataItem);
  //                 } else {
  //                     let changeArrayThird: any = [];
  //                     filteredLevelThreeData.push(changeArrayThird);
  //                 }

  //             }})
  //         }
  //         if (titleName == "TeamLeaderUser") {
  //             MainDataBackup?.map((ComponentDataItem: any) => {
  //                 if (ComponentDataItem.TeamLeaderUser != undefined && ComponentDataItem.TeamLeaderUser?.length > 0) {
  //                     ComponentDataItem.TeamLeaderUser?.map((ClientData: any) => {
  //                         if (ClientData.Title.toLowerCase().includes(searchKey)) {
  //                             filteredMainArrayData.push(ComponentDataItem);
  //                         }
  //                     })
  //                 }

  //                 // if (ComponentData.Title.toLowerCase().includes(searchKey)) {
  //                 //     // if (ComponentData.childs != undefined && ComponentData.childs?.length > 0) {

  //                 //     // } else {
  //                 //     //     filteredMainArrayData.push(ComponentData);
  //                 //     // }
  //                 //     filteredMainArrayData.push(ComponentData);
  //                 // }
  //             })
  //         }
  //         if (titleName == "PercentComplete") {
  //             MainDataBackup?.map((ComponentDataItem: any) => {
  //                 if (ComponentDataItem.PercentComplete == searchKey) {
  //                     // if (ComponentData.childs != undefined && ComponentData.childs?.length > 0) {

  //                     // } else {
  //                     //     filteredMainArrayData.push(ComponentData);
  //                     // }
  //                     filteredMainArrayData.push(ComponentDataItem);
  //                 }
  //             })
  //         }
  //         if (titleName == "ItemRank") {
  //             MainDataBackup?.map((ComponentDataItem: any) => {
  //                 if (ComponentDataItem.ItemRank == searchKey) {
  //                     // if (ComponentData.childs != undefined && ComponentData.childs?.length > 0) {

  //                     // } else {
  //                     //     filteredMainArrayData.push(ComponentData);
  //                     // }
  //                     filteredMainArrayData.push(ComponentDataItem);
  //                 }
  //             })
  //         }
  //         if (titleName == "DueDate") {
  //             MainDataBackup?.map((ComponentDataItem: any) => {
  //                 if (ComponentDataItem.DueDate.toLowerCase().includes(searchKey)) {
  //                     // if (ComponentData.childs != undefined && ComponentData.childs?.length > 0) {

  //                     // } else {
  //                     //     filteredMainArrayData.push(ComponentData);
  //                     // }
  //                     filteredMainArrayData.push(ComponentDataItem);
  //                 }
  //             })
  //         }
  //         if (filteredLevelThreeData?.length > 0) {
  //             $.each(filteredLevelTwoData, function (index: any, subcomp: any) {
  //                 if (subcomp.Title != undefined) {
  //                     $.each(filteredLevelThreeData, function (index: any, featurecomp: any) {
  //                         if (featurecomp.Parent != undefined && subcomp.Id == featurecomp.Parent.Id) {
  //                             subcomp['childs'].push(featurecomp);;
  //                         }
  //                     })
  //                 }
  //             })
  //         }
  //         if (filteredLevelTwoData?.length > 0) {
  //             $.each(filteredMainArrayData, function (index: any, subcomp: any) {
  //                 if (subcomp.Title != undefined) {
  //                     $.each(filteredLevelTwoData, function (index: any, featurecomp: any) {
  //                         if (featurecomp.Parent != undefined && subcomp.Id == featurecomp.Parent.Id) {
  //                             subcomp['childs'].push(featurecomp);;
  //                         }
  //                     })
  //                 }
  //             })
  //         }
  //         setComponentsData(filteredMainArrayData);
  //     } else {
  //         setComponentsData(MainDataBackup);
  //     }
  // }

  // const columnsearching = (e: { target: { value: string; }; }, titleName: any) =>{
  //     let searchKey = e.target.value;
  //     if(MainDataBackup!=undefined){
  //         let filteredMainArrayData: any = [];
  //     MainDataBackup?.forEach((ComponentDataItem: any) => {

  //         if(ComponentDataItem.Title.toLowerCase().includes(searchKey) ){
  //             filteredMainArrayData.push(ComponentDataItem)
  //         }
  //         if(ComponentDataItem.childs != undefined){
  //             ComponentDataItem.childs = []
  //             ComponentDataItem.childs.forEach((nextComponentDataItem: any) => {

  //                 if(nextComponentDataItem.Title.toLowerCase().includes(searchKey)){
  //                     ComponentDataItem.childs.push(nextComponentDataItem)
  //                 }
  //                 if(nextComponentDataItem.childs != undefined){
  //                     nextComponentDataItem.childs=[]
  //                     nextComponentDataItem.childs.forEach((ThirdComponentDataItem: any) => {
  //                         if(ThirdComponentDataItem.Title.toLowerCase().includes(searchKey)){
  //                             nextComponentDataItem.childs.push(ThirdComponentDataItem)
  //                         }
  //                     })
  //                 }
  //             })
  //         }
  //         setComponentsData(filteredMainArrayData);
  //     })

  //     }
  //     }
  var getRegexPattern = function (keywordArray: any) {
    var pattern = "(^|\\b)(" + keywordArray.join("|") + ")";
    return new RegExp(pattern, "gi");
  };
  var getHighlightdata = function (item: any, searchTerms: any) {
    var keywordList = [];
    // if (serachTitle != undefined && serachTitle != '') {
    //     keywordList = stringToArray(serachTitle);
    // } else {
    //     keywordList = stringToArray(serachTitle);
    // }
    var pattern: any = getRegexPattern(searchTerms);
    //let Title :any =(...item?.Title)
    item.TitleNew = item?.Title;
    item.TitleNew = item?.Title.replace(
      pattern,
      '<span class="highlighted">$2</span>'
    );
    // item?.Title = item?.Title;
    keywordList = [];
    pattern = "";
  };
  var MyArrayForData: any = [];
  // var getSearchTermAvialable1 = function (
  //   searchTerms: any,
  //   item: any,
  //   Title: any
  // ) {
  //   var isSearchTermAvailable = false;
  //   if (searchTerms != undefined && searchTerms.length > 0) {
  //     //$.each(searchTerms, function (index: any, val: any) {
  //     if (item[Title] != undefined && Title == "ItemRank") {
  //       if (item[Title] == searchTerms) {
  //         isSearchTermAvailable = true;
  //         item?.flag == true;
  //         AllFilteredTagNews.push(item);
  //       } if(item[Title] != undefined && Title == "ItemRank" && item?.childs != undefined && item?.childs.length>0 ) {

  //         AllFilteredTagNews.map((Child:any,index:any)=>{

  //           Child.childs.map((subChild:any)=>{
  //               if((subChild[Title] == searchTerms)){
  //                   item?.show == true;
  //                   item?.flag == true;
  //                   Child.push(subChild)
  //                subChild.childs.map((nextsubchild:any,nextindex:any)=>{
  //                   if(nextsubchild!=undefined && nextsubchild[Title]==searchTerms){

  //                       subChild.show == true;
  //                       subChild.flag == true;
  //                       Child.push(nextsubchild)
  //                      }
  //               })
  //               }
  //        }) })

  //           isSearchTermAvailable = true;
  //       }
  //     } if (
  //       item?.ClientCategory != undefined &&
  //       Title == "ClientCategory" &&
  //       item?.ClientCategory.length > 0
  //     ) {
  //       item?.ClientCategory.map((Client: any) => {
  //         if (Client.Title.toLowerCase().includes(searchTerms.toLowerCase())) {

  //           isSearchTermAvailable = true;
  //           item?.flag == true;
  //           AllFilteredTagNews.push(item);
  //         } else {
  //           isSearchTermAvailable = false;
  //         }
  //       });
  //     } if (
  //       item?.TeamLeaderUser != undefined &&
  //       Title == "TeamLeaderUser" &&
  //       item?.TeamLeaderUser.length > 0
  //     ) {
  //       item?.TeamLeaderUser.map((Teamleader: any) => {
  //         if (
  //           Teamleader.Title.toLowerCase().includes(searchTerms.toLowerCase())
  //         ) {
  //           isSearchTermAvailable = true;
  //           item?.flag == true;
  //           AllFilteredTagNews.push(item);
  //         } else {
  //           isSearchTermAvailable = false;
  //         }
  //       });
  //     } if (

  //       item[Title] != undefined &&
  //       Title != "ItemRank" &&
  //       Title != "ClientCategory" &&
  //       Title != "TeamLeaderUser"
  //     ) {
  //       if (item[Title].toLowerCase().includes(searchTerms.toLowerCase())) {
  //         isSearchTermAvailable = true;
  //         item?.flag == true;
  //         AllFilteredTagNews.push(item);
  //       //   getHighlightdata(item, searchTerms.toLowerCase());

  //       } else {
  //         isSearchTermAvailable = false;
  //       }

  //       // }}
  //     } else {
  //       isSearchTermAvailable = false;

  //     }}
  //     else {
  //       isSearchTermAvailable = false;
  //       setComponentsData(MainDataBackup);
  //     }
  //     return isSearchTermAvailable;

  // };

  var LocalArray: any = [];
  var getSearchTermAvialable1 = function (
    searchTerms: any,
    item: any,
    Title: any
  ) {
    if (searchTerms != undefined && searchTerms.length > 0) {
      if (item[Title] != undefined && item[Title] == searchTerms) {
        LocalArray.push(item)
        if (LocalArray != undefined && LocalArray.length > 0) {
          LocalArray.map((child: any, index: any) => {
            child.childs.map((subChild: any) => {
              if (subChild[Title] == searchTerms) {
                child.childs.push(subChild)
                child.childs.map((nextSub: any) => {
                  if (nextSub[Title] == searchTerms) {
                    nextSub.childs.push(nextSub)
                  }
                })
              }
            })
          })
        }
      }
    }
  }


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
      if (item?.Id === items.Id && items.siteType === item?.siteType) {
        isExists = true;
        return false;
      }
    });
    return isExists;
  };
  var AllFilteredTagNews: any = [];
  var finalOthersData: any = [];
  var ALllTAsk: any = [];
  var childData: any = [];
  var subChild: any = [];
  var subChild2: any = [];

  let handleChange1 = (e: { target: { value: string } }, Title: any) => {
    if (Title == "ItemRank") {
      search = e.target.value;
      serachTitle = Title;
      var filterglobal = e.target.value;
    } else {
      search = e.target.value.toLowerCase();
      serachTitle = Title.toLowerCase();
      var filterglobal = e.target.value.toLowerCase();
    }

    if (filterglobal != undefined && filterglobal.length >= 0) {
      //var searchTerms = stringToArray(filterglobal);
      $.each(MainDataBackup, function (pareIndex: any, item: any) {
        item.flag = false;
        item.isSearch = true;
        item.show = false;
        item.flag = getSearchTermAvialable1(search, item, Title);
        // if (item?.flag == true) {
        //     AllFilteredTagNews.push(item)
        // }

        if (item?.childs != undefined && item?.childs.length > 0) {
          $.each(item?.childs, function (parentIndex: any, child1: any) {
            child1.flag = false;
            child1.isSearch = true;
            child1.flag = getSearchTermAvialable1(search, child1, Title);
            if (child1.flag) {
              item.childs[parentIndex].flag = child1.flag;
              MainDataBackup[pareIndex].flag = child1.flag;
              item.childs[parentIndex].show = child1.flag;
              MainDataBackup[pareIndex].show = true;
              //   if (!isItemExistsNew(AllFilteredTagNews, item)) {
              //     AllFilteredTagNews.push(item);
              //   }
              childData.push(child1);
              ALllTAsk.push(item);
            }
            if (child1.childs != undefined && child1.childs.length > 0) {
              $.each(child1.childs, function (index: any, subchild: any) {
                subchild.flag = false;
                subchild.flag = getSearchTermAvialable1(
                  search,
                  subchild,
                  Title
                );
                if (subchild.flag) {
                  item.childs[parentIndex].flag = subchild.flag;
                  child1.flag = subchild.flag;
                  child1.childs[index].flag = subchild.flag;
                  child1.childs[index].show = subchild.flag;
                  item.childs[parentIndex].show = subchild.flag;
                  MainDataBackup[pareIndex].flag = subchild.flag;
                  MainDataBackup[pareIndex].show = subchild.flag;
                  //   if (!isItemExistsNew(AllFilteredTagNews, item)) {
                  //     AllFilteredTagNews.push(item);
                  //   }
                  if (!isItemExistsNew(childData, child1))
                    childData.push(child1);
                  subChild.push(subchild);
                }
                if (
                  subchild.childs != undefined &&
                  subchild.childs.length > 0
                ) {
                  $.each(
                    subchild.childs,
                    function (childindex: any, subchilds: any) {
                      subchilds.flag = false;
                      // subchilds.Title = subchilds.newTitle;
                      subchilds.flag = getSearchTermAvialable1(
                        search,
                        subchilds,
                        Title
                      );
                      if (subchilds.flag) {
                        item.childs[parentIndex].flag = subchilds.flag;
                        child1.flag = subchilds.flag;
                        subchild.flag = subchilds.flag;
                        subchild.childs[childindex].flag = subchilds.flag;
                        child1.childs[index].flag = subchilds.flag;
                        child1.childs[index].show = subchilds.flag;
                        item.childs[parentIndex].show = subchilds.flag;
                        MainDataBackup[pareIndex].flag = subchilds.flag;
                        MainDataBackup[pareIndex].show = subchilds.flag;
                        // if (!isItemExistsNew(AllFilteredTagNews, item)) {
                        //   AllFilteredTagNews.push(item);
                        // }
                        if (!isItemExistsNew(childData, child1))
                          childData.push(child1);
                        if (!isItemExistsNew(subChild, subChild))
                          subChild.push(subChild);
                        subChild2.push(subchilds);
                      }
                    }
                  );
                }
              });
            }
          });
        }
      });
      const CData = AllFilteredTagNews.filter(
        (val: any, id: any, array: any) => {
          return array.indexOf(val) == id;
        }
      );
      const AllDataTaskk = ALllTAsk.filter((val: any, id: any, array: any) => {
        return array.indexOf(val) == id;
      });
      const SData = childData.filter((val: any, id: any, array: any) => {
        return array.indexOf(val) == id;
      });
      const FData = subChild.filter((val: any, id: any, array: any) => {
        return array.indexOf(val) == id;
      });
      if (AllDataTaskk != undefined) {
        AllDataTaskk.forEach((newval: any) => {
          if (newval.Title == "Others" && newval.childs != undefined) {
            newval.forEach((valllA: any) => {
              finalOthersData.push(valllA);
            });
          }
        });
      }

      setTotalTask(finalOthersData);
      setSubComponentsData(SData);
      setFeatureData(FData);
      setComponentsData(CData);
    } else {
      //  ungetFilterLength();
      // setData(data => ([...maidataBackup]));
      setComponentsData(MainDataBackup);
      //setData(ComponentsData)= SharewebCommonFactoryService.ArrayCopy($scope.CopyData);
    }
  };

  //************ Custom Header And Footer  **********

  const CustomFooter = () => {
    return (
      <footer className="d-flex justify-content-end me-4 mt-2">
        <button type="button" className="btn btn-primary">
          <a target="_blank" className="text-light" data-interception="off"
            href={`${Dynamic?.siteUrl}/SitePages/Component-Portfolio.aspx`}>
            Create New One
          </a>
        </button>
        <button
          type="button"
          className="btn btn-primary mx-1"
          onClick={setModalIsOpenToOK}
        >
          OK
        </button>
        <button
          type="button"
          className="btn btn-default"
          onClick={setModalIsOpenToFalse}
        >
          Cancel
        </button>
      </footer>
    );
  };

  const onRenderCustomHeader = () => {
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
          <span>{`Select Components`}</span>
        </div>
        <Tooltip ComponentId="1667" />
      </div>
    );
  };

  return (
    <Panel
      onRenderHeader={onRenderCustomHeader}
      type={PanelType.large}
      isOpen={modalIsOpen}
      onDismiss={setModalIsOpenToFalse}
      isBlocking={false}
      onRenderFooter={CustomFooter}
    >
      <div>
        <div className="modal-body">
          <div className="Alltable mt-10">
            <div className="col-sm-12 p-0 smart">
              <div className="section-event">
                <div className="wrapper">
                  <table
                    className="mb-0 table table-hover"
                    id="EmpTable"
                    style={{ width: "100%" }}
                  >
                    <thead>
                      <tr>
                        <th style={{ width: "2%" }}>
                          <div style={{ width: "2%" }}>
                            <div
                              className="accordian-header"
                              onClick={() => handleOpen(props)}
                            >
                              {props?.childs?.length > 0 &&
                                props?.childs != undefined ? (
                                <a
                                  className="hreflink"
                                  title="Tap to expand the childs"
                                >
                                  <div className="sign">
                                    {props?.show ? (
                                      <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png" />
                                    ) : (
                                      <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png" />
                                    )}
                                  </div>
                                </a>
                              ) : null}
                            </div>
                          </div>
                        </th>
                        <th style={{ width: "2%" }}>
                          <div></div>
                        </th>
                        <th style={{ width: "4%" }}>
                          <div></div>
                        </th>
                        {/* <th style={{ width: "2%" }}>
                                                    <div></div>
                                                </th> */}
                        <th style={{ width: "24%" }}>
                          <div
                            style={{ width: "23%" }}
                            className="smart-relative "
                          >
                            <input
                              type="search"
                              placeholder="Title"
                              className="full_width searchbox_height"
                              onChange={(event) =>
                                handleChange1(event, "Title")
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
                        <th style={{ width: "18%" }}>
                          <div
                            style={{ width: "17%" }}
                            className="smart-relative "
                          >
                            <input
                              id="searchClientCategory"
                              onChange={(event) =>
                                handleChange1(event, "ClientCategory")
                              }
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
                        <th style={{ width: "20%" }}>
                          <div
                            style={{ width: "19%" }}
                            className="smart-relative "
                          >
                            <input
                              id="searchClientCategory"
                              type="search"
                              placeholder="Team"
                              title="Team Member"
                              className="full_width searchbox_height"
                              onChange={(event) =>
                                handleChange1(event, "TeamLeaderUser")
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
                        <th style={{ width: "10%" }}>
                          <div
                            style={{ width: "9%" }}
                            className="smart-relative"
                          >
                            <input
                              id="searchClientCategory"
                              type="search"
                              placeholder="Status"
                              title="Client Category"
                              className="full_width searchbox_height"
                            // onChange={event => handleChange1(event, 'PercentComplete')}
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
                          <div
                            style={{ width: "9%" }}
                            className="smart-relative corm-control"
                          >
                            <input
                              id="searchClientCategory"
                              type="search"
                              placeholder="Item Rank"
                              title="Client Category"
                              className="full_width searchbox_height"
                              onChange={(event) =>
                                handleChange1(event, "ItemRank")
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
                        <th style={{ width: "10%" }}>
                          <div
                            style={{ width: "9%" }}
                            className="smart-relative "
                          >
                            <input
                              id="searchClientCategory"
                              type="search"
                              placeholder="Due"
                              title="Client Category"
                              className="full_width searchbox_height"
                              onChange={(event) =>
                                handleChange1(event, "DueDate")
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
                      </tr>
                    </thead>
                    <tbody>
                      <div id="SpfxProgressbar" style={{ display: "none" }}>
                        <img
                          id="sharewebprogressbar-image"
                          src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/loading_apple.gif"
                          alt="Loading..."
                        />
                      </div>
                      {componentsData &&
                        componentsData.map(function (item, index) {
                          return (
                            <>
                              <tr>
                                <td className="p-0" colSpan={10}>
                                  <table
                                    className="mb-0 table"
                                    style={{ width: "100%" }}
                                  >
                                    <tr className="bold for-c0l">
                                      <td style={{ width: "2%" }}>
                                        <div
                                          className="accordian-header"
                                          onClick={() => handleOpen(item)}
                                        >
                                          {item?.childs?.length > 0 && (
                                            <a
                                              className="hreflink"
                                              title="Tap to expand the childs"
                                            >
                                              <div className="sign">
                                                {item?.show ? (
                                                  <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png" />
                                                ) : (
                                                  <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png" />
                                                )}
                                              </div>
                                            </a>
                                          )}
                                        </div>
                                      </td>
                                      <td style={{ width: "2%" }}>
                                        <input
                                          type="checkbox"
                                          name="Active"
                                          checked={
                                            item?.Id ==
                                              (CheckBoxdata.length > 0 &&
                                                CheckBoxdata[0]["Id"]
                                                ? CheckBoxdata[0]["Id"]
                                                : CheckBoxdata)
                                              ? true
                                              : false
                                          }
                                          onClick={() => {
                                            item.checked = !item?.checked;
                                            setcheckbox([
                                              item?.Title ==
                                                (CheckBoxdata.length > 0
                                                  ? CheckBoxdata[0]["Title"]
                                                  : CheckBoxdata)
                                                ? []
                                                : item,
                                            ]);
                                          }}
                                        ></input>
                                      </td>

                                      <td style={{ width: "4%" }}>
                                        <div className="">
                                          <span>
                                            <a
                                              className="hreflink"
                                              title="Show All Child"
                                              data-toggle="modal"
                                            >
                                              <img
                                                className="icon-sites-img"
                                                src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/component_icon.png"
                                              />
                                            </a>
                                          </span>
                                        </div>
                                      </td>
                                      {/* <td style={{ width: "2%" }}>
                                                                            <div className="">
                                                                                <span>
                                                                                    <div className="accordian-header" onClick={() => handleOpen(item)}>
                                                                                        {item?.childs != undefined && item?.childs?.length > 0 ?
                                                                                            <a className='hreflink'
                                                                                                title="Tap to expand the childs">
                                                                                                <div className="sign">{item?.show ? <img style={{ width: "22px" }} src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/Minus-Gray.png" />
                                                                                                    : <img style={{ width: "22px" }} src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/Add-New-Grey.png" />}
                                                                                                </div>
                                                                                            </a> : null
                                                                                        }
                                                                                    </div>

                                                                                </span>
                                                                            </div>
                                                                        </td> */}
                                      <td style={{ width: "24%" }}>
                                        {/* <a className="hreflink serviceColor_Active" target="_blank"
                                                                                href={"https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=" + item?.Id}
                                                                            >{item?.Title}
                                                                            </a>
                                                                            {item?.Child != undefined &&
                                                                                <span className="ms-1 siteColor">({item?.Child.length})</span>
                                                                            }

                                                                            {item?.Short_x0020_Description_x0020_On != null &&
                                                                                <span className="project-tool"><img
                                                                                    src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/infoIcon.png" /><span className="tooltipte">
                                                                                        <span className="tooltiptext">
                                                                                            <div className="tooltip_Desc">
                                                                                                <span>{item?.Short_x0020_Description_x0020_On}</span>
                                                                                            </div>
                                                                                        </span>
                                                                                    </span>
                                                                                </span>
                                                                            } */}
                                        <a
                                          data-interception="off"
                                          target="_blank"
                                          className="hreflink serviceColor_Active"
                                          href={
                                            Dynamic?.siteUrl + "/SitePages/Portfolio-Profile.aspx?taskId=" +
                                            item?.Id
                                          }
                                        >
                                          <span
                                            dangerouslySetInnerHTML={{
                                              __html: item?.TitleNew,
                                            }}
                                          ></span>

                                          {/* {item?.Title} */}
                                        </a>
                                        {item?.childs?.length > 0 && (
                                          <span className="ms-1">
                                            ({item?.childs.length})
                                          </span>
                                        )}

                                        {item?.Short_x0020_Description_x0020_On !=
                                          null && (
                                            <div
                                              className="popover__wrapper ms-1"
                                              data-bs-toggle="tooltip"
                                              data-bs-placement="auto"
                                            >
                                              <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/infoIcon.png" />

                                              <div className="popover__content">
                                                {
                                                  item?.Short_x0020_Description_x0020_On
                                                }
                                              </div>
                                            </div>
                                          )}
                                      </td>
                                      <td style={{ width: "18%" }}>
                                        <div>
                                          {item?.ClientCategory.map(
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
                                      <td style={{ width: "20%" }}>
                                        <div>
                                          {item?.TeamLeaderUser.map(
                                            function (client1: {
                                              Title: string;
                                            }) {
                                              return (
                                                <span
                                                  className="ClientCategory-Usericon"
                                                  title={client1.Title}
                                                >
                                                  <a>
                                                    {client1.Title.slice(
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
                                      <td style={{ width: "10%" }}>
                                        {item?.PercentComplete}
                                      </td>
                                      <td style={{ width: "10%" }}>
                                        {item?.ItemRank}
                                      </td>
                                      <td style={{ width: "10%" }}>
                                        {item?.DueDate}
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                              {item?.show && (
                                <>
                                  {item?.childs.map(function (childitem: any) {
                                    return (
                                      <>
                                        <tr>
                                          <td className="p-0" colSpan={10}>
                                            <table
                                              className="mb-0 table"
                                              style={{ width: "100%" }}
                                            >
                                              <tr className="for-c02">
                                                <td style={{ width: "2%" }}>
                                                  <div
                                                    className="accordian-header"
                                                    onClick={() =>
                                                      handleOpen(childitem)
                                                    }
                                                  >
                                                    {childitem.childs.length >
                                                      0 && (
                                                        <a
                                                          className="hreflink"
                                                          title="Tap to expand the childs"
                                                        >
                                                          <div className="sign">
                                                            {childitem.show ? (
                                                              <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png" />
                                                            ) : (
                                                              <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png" />
                                                            )}
                                                          </div>
                                                        </a>
                                                      )}
                                                  </div>
                                                </td>
                                                <td style={{ width: "2%" }}>
                                                  <input
                                                    type="checkbox"
                                                    name="Active"
                                                    checked={
                                                      childitem.Id ==
                                                        (CheckBoxdata.length >
                                                          0 &&
                                                          CheckBoxdata[0]["Id"]
                                                          ? CheckBoxdata[0]["Id"]
                                                          : CheckBoxdata)
                                                        ? true
                                                        : false
                                                    }
                                                    onClick={() => {
                                                      childitem.checked =
                                                        !childitem.checked;
                                                      setcheckbox([
                                                        childitem.Title ==
                                                          (CheckBoxdata.length > 0
                                                            ? CheckBoxdata[0][
                                                            "Title"
                                                            ]
                                                            : CheckBoxdata)
                                                          ? []
                                                          : childitem,
                                                      ]);
                                                    }}
                                                  ></input>
                                                </td>
                                                <td style={{ width: "4%" }}>
                                                  {" "}
                                                  <div>
                                                    <span>
                                                      <a
                                                        className="hreflink"
                                                        title="Show All Child"
                                                        data-toggle="modal"
                                                      >
                                                        <img
                                                          className="icon-sites-img"
                                                          src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/SubComponent_icon.png"
                                                        />
                                                      </a>
                                                    </span>
                                                  </div>
                                                </td>
                                                {/* <td style={{ width: "2%" }}>
                                                                                                <div className="accordian-header" onClick={() => handleOpen(childitem)}>
                                                                                                    {childitem.childs.length > 0 &&
                                                                                                        <a className='hreflink'
                                                                                                            title="Tap to expand the childs">
                                                                                                            <div className="sign">{childitem.show ? <img style={{ width: "22px" }} src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/Minus-Gray.png" />
                                                                                                                : <img style={{ width: "22px" }} src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/Add-New-Grey.png" />}
                                                                                                            </div>
                                                                                                        </a>
                                                                                                    }

                                                                                                </div>

                                                                                            </td> */}
                                                <td style={{ width: "24%" }}>
                                                  <a
                                                    className="hreflink serviceColor_Active"
                                                    target="_blank"
                                                    href={
                                                      Dynamic?.siteUrl + "/SitePages/Portfolio-Profile.aspx?taskId=" +
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
                                                  {childitem.childs.length >
                                                    0 && (
                                                      <span className="ms-1 siteColor">
                                                        ({childitem.childs.length}
                                                        )
                                                      </span>
                                                    )}

                                                  {childitem.Short_x0020_Description_x0020_On !=
                                                    null && (
                                                      <span className="project-tool">
                                                        <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/infoIcon.png" />
                                                        <span className="tooltipte">
                                                          <span className="tooltiptext">
                                                            <div className="tooltip_Desc">
                                                              <span>
                                                                {
                                                                  childitem.Short_x0020_Description_x0020_On
                                                                }
                                                              </span>
                                                            </div>
                                                          </span>
                                                        </span>
                                                      </span>
                                                    )}
                                                </td>
                                                <td style={{ width: "18%" }}>
                                                  <div>
                                                    {childitem.ClientCategory.map(
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
                                                <td style={{ width: "20%" }}>
                                                  <div>
                                                    {childitem.TeamLeaderUser.map(
                                                      function (client1: {
                                                        Title: string;
                                                      }) {
                                                        return (
                                                          <div
                                                            className="ClientCategory-Usericon"
                                                            title={
                                                              client1.Title
                                                            }
                                                          >
                                                            <a>
                                                              {client1.Title.slice(
                                                                0,
                                                                2
                                                              ).toUpperCase()}
                                                            </a>
                                                          </div>
                                                        );
                                                      }
                                                    )}
                                                  </div>
                                                </td>
                                                <td style={{ width: "10%" }}>
                                                  {childitem.PercentComplete}
                                                </td>
                                                <td style={{ width: "10%" }}>
                                                  {childitem.ItemRank}
                                                </td>
                                                <td style={{ width: "10%" }}>
                                                  {childitem.DueDate}
                                                </td>
                                              </tr>
                                            </table>
                                          </td>
                                        </tr>

                                        {childitem.show && (
                                          <>
                                            {childitem.childs.map(function (
                                              childinew: any
                                            ) {
                                              return (
                                                <tr>
                                                  <td
                                                    className="p-0"
                                                    colSpan={10}
                                                  >
                                                    <table
                                                      className="mb-0 table"
                                                      style={{ width: "100%" }}
                                                    >
                                                      <tr className="tdrow">
                                                        <td
                                                          style={{
                                                            width: "2%",
                                                          }}
                                                        ></td>

                                                        <td
                                                          style={{
                                                            width: "2%",
                                                          }}
                                                        >
                                                          <input
                                                            type="checkbox"
                                                            name="Active"
                                                            checked={
                                                              childinew.Id ==
                                                                (CheckBoxdata.length >
                                                                  0 &&
                                                                  CheckBoxdata[0][
                                                                  "Id"
                                                                  ]
                                                                  ? CheckBoxdata[0][
                                                                  "Id"
                                                                  ]
                                                                  : CheckBoxdata)
                                                                ? true
                                                                : false
                                                            }
                                                            onClick={() => {
                                                              childinew.checked =
                                                                !childinew.checked;
                                                              setcheckbox([
                                                                childinew.Title ==
                                                                  (CheckBoxdata.length >
                                                                    0
                                                                    ? CheckBoxdata[0][
                                                                    "Title"
                                                                    ]
                                                                    : CheckBoxdata)
                                                                  ? []
                                                                  : childinew,
                                                              ]);
                                                            }}
                                                          ></input>
                                                        </td>
                                                        <td
                                                          style={{
                                                            width: "4%",
                                                          }}
                                                        >
                                                          {" "}
                                                          <div>
                                                            <span>
                                                              <a
                                                                className="hreflink"
                                                                title="Show All Child"
                                                                data-toggle="modal"
                                                              >
                                                                <img
                                                                  className="icon-sites-img"
                                                                  src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/feature_icon.png"
                                                                />
                                                              </a>
                                                            </span>
                                                          </div>
                                                        </td>
                                                        {/* <td style={{ width: "2%" }}></td> */}
                                                        <td
                                                          style={{
                                                            width: "24%",
                                                          }}
                                                        >
                                                          <a
                                                            className="hreflink serviceColor_Active"
                                                            target="_blank"
                                                            href={
                                                              Dynamic?.siteUrl + "/SitePages/Portfolio-Profile.aspx?taskId=" +
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
                                                          {childinew.childs
                                                            .length > 0 && (
                                                              <span className="ms-1 siteColor">
                                                                (
                                                                {
                                                                  childinew.childs
                                                                    .length
                                                                }
                                                                )
                                                              </span>
                                                            )}

                                                          {childinew.Short_x0020_Description_x0020_On !=
                                                            null && (
                                                              <span className="project-tool">
                                                                <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/infoIcon.png" />
                                                                <span className="tooltipte">
                                                                  <span className="tooltiptext">
                                                                    <div className="tooltip_Desc">
                                                                      <span>
                                                                        {
                                                                          childinew.Short_x0020_Description_x0020_On
                                                                        }
                                                                      </span>
                                                                    </div>
                                                                  </span>
                                                                </span>
                                                              </span>
                                                            )}
                                                        </td>
                                                        <td
                                                          style={{
                                                            width: "18%",
                                                          }}
                                                        >
                                                          <div>
                                                            {childinew.ClientCategory.map(
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
                                                            width: "20%",
                                                          }}
                                                        >
                                                          <div>
                                                            {childinew.TeamLeaderUser.map(
                                                              function (client1: {
                                                                Title: string;
                                                              }) {
                                                                return (
                                                                  <span
                                                                    className="ClientCategory-Usericon"
                                                                    title={
                                                                      client1.Title
                                                                    }
                                                                  >
                                                                    <a>
                                                                      {client1.Title.slice(
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
                                                            width: "10%",
                                                          }}
                                                        >
                                                          {
                                                            childinew.PercentComplete
                                                          }
                                                        </td>
                                                        <td
                                                          style={{
                                                            width: "10%",
                                                          }}
                                                        >
                                                          {childinew.ItemRank}
                                                        </td>
                                                        <td
                                                          style={{
                                                            width: "10%",
                                                          }}
                                                        >
                                                          {childinew.DueDate}
                                                        </td>
                                                      </tr>
                                                    </table>
                                                  </td>
                                                </tr>
                                              );
                                            })}
                                          </>
                                        )}
                                      </>
                                    );
                                  })}
                                </>
                              )}
                            </>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
};
export default ComponentPortPolioPopup;