import React, { useEffect, useState, useRef, forwardRef } from "react";
import { Web } from "sp-pnp-js";
import { Panel, PanelType } from "office-ui-fabric-react";
import Tooltip from "../Tooltip";
import ReactPopperTooltipSingleLevel from "../Hierarchy-Popper-tooltipSilgleLevel/Hierarchy-Popper-tooltipSingleLevel";

const RestructuringCom = (props: any, ref: any) => {
  let restructureCallBack = props?.restructureCallBack;

  const [OldArrayBackup, setOldArrayBackup]: any = React.useState([]);
  const [selectedItems, setSelectedItems]:any = React.useState([]);
  const [allData, setAllData]: any = React.useState([]);
  const [restructureItem, setRestructureItem]: any = React.useState([]);
  const [NewArrayBackup, setNewArrayBackup]: any = React.useState([]);
  const [NewArrayAll, setNewArrayAll]: any = React.useState([]);
  const [ResturuningOpen, setResturuningOpen]: any = React.useState(false);
  const [newItemBackUp, setNewItemBackUp]: any = React.useState(null);
  const [checkSubChilds, setCheckSubChilds]: any = React.useState([]);
  const [RestructureChecked, setRestructureChecked]: any = React.useState([]);
  const [restructuredItemarray, setRestructuredItemarray]: any = React.useState(
    []
  );
  const [trueTopCompo, setTrueTopCompo]: any = React.useState(false);
  const [restructureTitle, setRestructureTitle]: any = React.useState([]);
  const [projectmngmnt, setProjectmngmnt]: any = React.useState(false);
  const [checkItemLength, setCheckItemLength]: any = React.useState(false);
  const [query4TopIcon, setQuery4TopIcon]: any = React.useState("");
  const [controlUseEffect, setControlUseEffect]: any = React.useState(true);
  const [projects, setProjects]: any = React.useState(false);
  const [topProject, setTopProject]: any = React.useState(false);

  useEffect(() => {
    if (props?.restructureItem != undefined && props?.restructureItem?.length > 0) {
      let array: any = [];
      let portfolioTypeCheck: any = null;
      props?.restructureItem?.map((obj: any) => {
        if (obj?.original?.Item_x0020_Type === "Task") {
          const matchingTask = props?.AllMasterTasksData?.find((task: any) => obj?.original?.Portfolio?.Id === task?.Id);
          if (matchingTask) {
            portfolioTypeCheck = matchingTask?.PortfolioType?.Title;
            obj.original.PortfolioTypeCheck = matchingTask?.PortfolioType?.Title;
          } else {
            portfolioTypeCheck = "";
            obj.original.PortfolioTypeCheck = "";
          }
        } else if (obj?.original?.Item_x0020_Type === "Project" || obj?.original?.Item_x0020_Type === "Sprint") {
          portfolioTypeCheck = null;
        }
        array?.push(obj.original);
      });
      setRestructureItem(array);
      setSelectedItems(array);

      const setPortfolioTypeCheck = (arr: any, portfolioTypeCheck: any) => {
        arr?.forEach((obj: any) => {
          obj.PortfolioTypeCheck = "";
          const matchingTask = props?.AllMasterTasksData?.find((task: any) => obj?.Portfolio?.Id === task?.Id);
          if (matchingTask && portfolioTypeCheck !== "") {
            obj.PortfolioTypeCheck = matchingTask?.PortfolioType?.Title;
          } else {
            if (portfolioTypeCheck !== "" && obj?.Item_x0020_Type !== "Task" && obj?.Title !== "Others") {
              obj.PortfolioTypeCheck = obj?.PortfolioType?.Title;
            } else if (portfolioTypeCheck !== "" && obj?.Title === "Others") {
              obj.PortfolioTypeCheck = portfolioTypeCheck;
            }
          }

          if (obj?.subRows?.length > 0 && obj?.subRows != undefined) {
            setPortfolioTypeCheck(obj.subRows, portfolioTypeCheck);
          }
        });
      };

      if (portfolioTypeCheck != null) {
        setPortfolioTypeCheck(props?.allData, portfolioTypeCheck);
      }

      setAllData(props?.allData);
    }
  }, [props?.restructureItem]);

  useEffect(() => {
    if (props?.restructureItem?.length === 0) {
      let array = allData;
      const recursivelySetRestructureActive = (arr: any) => {
        arr?.forEach((obj: any) => {
          obj.isRestructureActive = false;
          if (obj?.subRows?.length > 0 && obj?.subRows != undefined) {
            recursivelySetRestructureActive(obj.subRows);
          }
        });
      };

      recursivelySetRestructureActive(array);
      setCheckItemLength(false);
      props.restructureFunct(false);
      restructureCallBack(array, false,false);
    }
  }, [props?.restructureItem]);

  const buttonRestructureCheck = () => {
    let checkItem_x0020_Type: any =
      restructureItem[0]?.Item_x0020_Type == "Task"
        ? restructureItem[0]?.TaskType?.Id
        : restructureItem[0]?.Item_x0020_Type;
    let checkSiteType: any = restructureItem[0]?.siteType;
    let PortfolioType: any = restructureItem[0]?.PortfolioTypeCheck;
    let checkPortfolioType: boolean = true;
    let alertNotify: boolean = true;
    let alertNotifyFirst: boolean = true;
    let itemTypes: string = "";
    if (restructureItem != undefined && restructureItem?.length > 0) {
      if (restructureItem?.length > 1 && props?.projectmngmnt != "projectmngmnt") {
        restructureItem?.map((items: any, length: any) => {
          if ( PortfolioType === items?.PortfolioTypeCheck && checkPortfolioType) {
            if ((checkItem_x0020_Type === items?.TaskType?.Id ||  checkItem_x0020_Type === items?.Item_x0020_Type) && alertNotifyFirst) {
              if (checkSiteType == items?.siteType && alertNotify) {
                itemTypes = "SAME_TYPE";
              } else {
                itemTypes = "DIFFRENT_TYPE";
                alertNotify = false;
              }
            } else {
              alertNotifyFirst = false;
              checkPortfolioType = false;
              itemTypes = "";
              alert(
                "You are not allowed to Restructure items with different task type."
              );
            }
          } else {
            if (checkPortfolioType) {
              checkPortfolioType = false;
              itemTypes = "";
              alert(
                "You are not allowed to Restructure items with diffrent portfolio type"
              );
            }
          }
        });
        if (itemTypes == "SAME_TYPE") {
          buttonRestructureSameType();
        }
        if (itemTypes == "DIFFRENT_TYPE") {
          buttonRestructureDifferentType();
        }
      }else{
        if(props?.projectmngmnt == "projectmngmnt"){
          let typeAlert : boolean = true;
          restructureItem?.map((items: any, length: any) => {
            if(items?.Item_x0020_Type != 'Sprint' && typeAlert){
               if(restructureItem[0].TaskType?.Id == items?.TaskType?.Id && restructureItem[0]?.siteType == items?.siteType && typeAlert){
                typeAlert = true;
                 }else{
                  if(typeAlert){
                    typeAlert = false;
                    alert('You are not allowed to restructure different Type of item !')
                  }
                  }
            }else{
                alert("You are not allowed to restructure this item !")
                typeAlert = false;
            }
          })
          if(typeAlert && props?.projectmngmnt == "projectmngmnt"){
            prjtMngmntRestructuring();
          }
        }}
    }
    if (restructureItem?.length == 1 && props?.projectmngmnt != "projectmngmnt") {
      buttonRestructuring();
    }
  };

  const buttonRestructureSameType = () => {
    if (restructureItem != undefined) {
      let ArrayTest: any = [];
      let checkSubcompo: boolean = true;
      let topCompo: any = false;
      let checkfeature: boolean = true;
      let checkchilds: string = "";
      // let noChild : boolean = true;
      let array = allData;
      let arrayalert: boolean = true;

      if (restructureItem[0]?.Item_x0020_Type === "Component") {
        topCompo = false;
        restructureItem?.map((items: any) => {
          if (items?.subRows != undefined && items?.subRows?.length > 0) {
            items?.subRows?.map((subItem: any) => {
              if (subItem.Item_x0020_Type == "SubComponent") {
                checkSubcompo = false;
                checkfeature = false;
                checkchilds = "SUBCOMPONENT";
              } else if (
                subItem.Item_x0020_Type == "Feature" &&
                checkSubcompo
              ) {
                checkfeature = false;
                checkchilds = "FEATURE";
              } else if (subItem.Item_x0020_Type == "Task" && checkfeature) {
                checkchilds = "TASK";
              }
            });
          }
        });

        if (checkchilds === "SUBCOMPONENT") {
          alert("You are not allowed to Restructure this items");
        } else if (checkchilds === "FEATURE") {
          if (array != undefined && array?.length > 0) {
            let newChildarray: any = [];
            let newarrays: any = [];
            array?.map((obj: any) => {
              let actionsPerformed = false;
              restructureItem?.map((items: any) => {
                let newObj: any;
                if (
                  items?.PortfolioType?.Title === obj.PortfolioType?.Title &&
                  !actionsPerformed
                ) {
                  if (items?.Id !== obj.Id && obj.Item_x0020_Type != "Task") {
                    obj.isRestructureActive = true;
                    obj.Restructuring =
                      obj?.PortfolioTypeCheck == "Component"
                        ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"
                        : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                  } else {
                    newObj = {Title: obj?.Title,TaskType: {  Id:    obj.TaskType?.Id == undefined ? "" : obj.TaskType?.Id,},
                      Id: obj.Id,
                      Item_x0020_Type: obj.Item_x0020_Type,
                      siteIcon:
                        obj.SiteIconTitle === undefined
                          ? obj.SiteIcon
                          : obj.SiteIconTitle,
                    };
                    newChildarray?.push(newObj);
                    newarrays?.push(obj);
                    setRestructuredItemarray(newarrays);
                    setCheckSubChilds(obj);
                    setRestructureChecked(newChildarray);
                    ArrayTest?.push(newObj);
                    actionsPerformed = true;
                    obj.isRestructureActive = false;
                  }
                }
              });
            });
          }
        } else if (checkchilds === "TASK" || checkchilds === "") {
          if (array != undefined && array?.length > 0) {
            let newChildarray: any = [];
            let newarrays: any = [];
            array?.map((obj: any) => {
              let actionsPerformed = false;
              restructureItem?.map((items: any) => {
                let newObj: any;
                if (
                  items?.PortfolioTypeCheck === obj.PortfolioTypeCheck &&
                  !actionsPerformed
                ) {
                  if (items?.Id !== obj.Id && obj.Item_x0020_Type != "Task") {
                    obj.isRestructureActive = true;
                    obj.Restructuring =
                      obj?.PortfolioTypeCheck == "Component"
                        ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"
                        : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                  } else {
                    newObj = {
                      Title: obj?.Title,
                      TaskType: {
                        Id:
                          obj.TaskType?.Id == undefined ? "" : obj.TaskType?.Id,
                      },
                      Id: obj.Id,
                      Item_x0020_Type: obj.Item_x0020_Type,
                      siteIcon:
                        obj.SiteIconTitle === undefined
                          ? obj.SiteIcon
                          : obj.SiteIconTitle,
                    };
                    newChildarray?.push(newObj);
                    newarrays?.push(obj);
                    setRestructuredItemarray(newarrays);
                    setCheckSubChilds(obj);
                    setRestructureChecked(newChildarray);
                    ArrayTest?.push(newObj);
                    actionsPerformed = true;
                    obj.isRestructureActive = false;
                  }

                  if (
                    obj?.subRows != undefined &&
                    obj?.subRows?.length > 0 &&
                    !actionsPerformed
                  ) {
                    obj?.subRows?.map((sub: any) => {
                      if (
                        items?.Id !== sub.Id &&
                        sub.Item_x0020_Type != "Task" &&
                        sub.Item_x0020_Type != "Feature"
                      ) {
                        sub.isRestructureActive = true;
                        sub.Restructuring =
                          sub?.PortfolioTypeCheck == "Component"
                            ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"
                            : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                      } else {
                        if (items?.Id === sub.Id) {
                          newObj = {
                            Title: obj?.Title,
                            TaskType: {
                              Id:
                                obj.TaskType?.Id == undefined
                                  ? ""
                                  : obj.TaskType?.Id,
                            },
                            Item_x0020_Type: obj.Item_x0020_Type,
                            Id: obj.Id,
                            siteIcon:
                              obj.SiteIconTitle === undefined
                                ? obj.SiteIcon
                                : obj.SiteIconTitle,
                            newSubChild: {
                              Title: sub?.Title,
                              TaskType: {
                                Id:
                                  sub.TaskType?.Id == undefined
                                    ? ""
                                    : sub.TaskType?.Id,
                              },
                              Item_x0020_Type: sub.Item_x0020_Type,
                              Id: sub.Id,
                              siteIcon:
                                sub.SiteIconTitle === undefined
                                  ? sub.SiteIcon
                                  : sub.SiteIconTitle,
                            },
                          };
                          newarrays?.push(obj);
                          setRestructuredItemarray(newarrays);
                          setCheckSubChilds(sub);
                          newChildarray?.push(newObj.newSubChild);
                          setRestructureChecked(newChildarray);
                          ArrayTest?.push(newObj);
                          actionsPerformed = true;
                          sub.isRestructureActive = false;
                        }
                      }
                    });
                  }
                }
              });
            });
          }
        }
      } else if (restructureItem[0]?.Item_x0020_Type === "SubComponent") {
        restructureItem?.map((items: any) => {
          if (items?.subRows != undefined && items?.subRows?.length > 0) {
            items?.subRows?.map((subItem: any) => {
              if (subItem.Item_x0020_Type == "Feature") {
                checkfeature = false;
                checkchilds = "FEATURE";
              } else if (subItem.Item_x0020_Type == "Task" && checkfeature) {
                checkchilds = "TASK";
              }
            });
          }
        });

        if (checkchilds === "FEATURE") {
          if (array != undefined && array?.length > 0) {
            topCompo = true;
            if(props?.queryItems?.Item_x0020_Type === "Component"){
              topCompo = false;
              alert('You are not allowed to restructure these items! ')
             }
            
            let newChildarray: any = [];
            let newarrays: any = [];
            array?.map((obj: any) => {
              let actionsPerformed = false;
              restructureItem?.map((items: any) => {
                let newObj: any;
                if (
                  items?.PortfolioType?.Title === obj.PortfolioType?.Title &&
                  !actionsPerformed
                ) {
                  if (items?.Id !== obj.Id && obj.Item_x0020_Type != "Task") {
                    obj.isRestructureActive = true;
                    if(props?.queryItems?.Item_x0020_Type === "Component" && (obj.Item_x0020_Type == 'SubComponent' || obj.Item_x0020_Type == 'Feature')){
                      obj.isRestructureActive = false;
                     }
                    obj.Restructuring =
                      obj?.PortfolioTypeCheck == "Component"
                        ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"
                        : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                  } else {
                    newObj = {
                      Title: obj?.Title,TaskType: {  Id:    obj.TaskType?.Id == undefined ? "" : obj.TaskType?.Id,}, Id: obj.Id, Item_x0020_Type: obj.Item_x0020_Type, siteIcon:   obj.SiteIconTitle === undefined     ? obj.SiteIcon     : obj.SiteIconTitle,
                    };
                    newChildarray?.push(newObj);
                    newarrays?.push(obj);
                    setRestructuredItemarray(newarrays);
                    setCheckSubChilds(obj);
                    setRestructureChecked(newChildarray);
                    ArrayTest?.push(newObj);
                    actionsPerformed = true;
                    obj.isRestructureActive = false;
                  }

                 


                }
              });
            });
          }
        } else if (checkchilds === "TASK" || checkchilds === "") {
          if (array != undefined && array?.length > 0) {
            topCompo = true;
            let newChildarray: any = [];
            let newarrays: any = [];
            if (props?.queryItems?.Item_x0020_Type === "Component") {
              setQuery4TopIcon("Feature");
            } else {
              setQuery4TopIcon("Component");
            }
            array?.map((obj: any) => {
              let actionsPerformed = false;
              restructureItem?.map((items: any) => {
                let newObj: any;
                if (
                  items?.PortfolioTypeCheck === obj.PortfolioTypeCheck &&
                  !actionsPerformed
                ) {
                  if (items?.Id !== obj.Id && obj.Item_x0020_Type != "Task") {
                    obj.isRestructureActive = true;
                    obj.Restructuring =
                      obj?.PortfolioTypeCheck == "Component"
                        ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"
                        : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                  } else {
                    newObj = {
                      Title: obj?.Title,
                      TaskType: {
                        Id:
                          obj.TaskType?.Id == undefined ? "" : obj.TaskType?.Id,
                      },
                      Id: obj.Id,
                      Item_x0020_Type: obj.Item_x0020_Type,
                      siteIcon:
                        obj.SiteIconTitle === undefined
                          ? obj.SiteIcon
                          : obj.SiteIconTitle,
                    };
                    newChildarray?.push(newObj);
                    newarrays?.push(obj);
                    setRestructuredItemarray(newarrays);
                    setCheckSubChilds(obj);
                    setRestructureChecked(newChildarray);
                    ArrayTest?.push(newObj);
                    actionsPerformed = true;
                    obj.isRestructureActive = false;
                  }

                  if(props?.queryItems?.Item_x0020_Type === "Component" && obj.Item_x0020_Type == 'Feature'){
                    obj.isRestructureActive = false;
                   } 
                  if (
                    obj?.subRows != undefined &&
                    obj?.subRows?.length > 0 &&
                    !actionsPerformed
                  ) {
                    obj?.subRows?.map((sub: any) => {
                      if (
                        items?.Id !== sub.Id &&
                        sub.Item_x0020_Type != "Task" &&
                        sub.Item_x0020_Type != "Feature"
                      ) {
                        sub.isRestructureActive = true;
                        sub.Restructuring =
                          sub?.PortfolioTypeCheck == "Component"
                            ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"
                            : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                      } else {
                        if (items?.Id === sub.Id) {
                          newObj = {
                            Title: obj?.Title,
                            TaskType: {
                              Id:
                                obj.TaskType?.Id == undefined
                                  ? ""
                                  : obj.TaskType?.Id,
                            },
                            Item_x0020_Type: obj.Item_x0020_Type,
                            Id: obj.Id,
                            siteIcon:
                              obj.SiteIconTitle === undefined
                                ? obj.SiteIcon
                                : obj.SiteIconTitle,
                            newSubChild: {
                              Title: sub?.Title,
                              TaskType: {
                                Id:
                                  sub.TaskType?.Id == undefined
                                    ? ""
                                    : sub.TaskType?.Id,
                              },
                              Item_x0020_Type: sub.Item_x0020_Type,
                              Id: sub.Id,
                              siteIcon:
                                sub.SiteIconTitle === undefined
                                  ? sub.SiteIcon
                                  : sub.SiteIconTitle,
                            },
                          };
                          newarrays?.push(obj);
                          setRestructuredItemarray(newarrays);
                          setCheckSubChilds(sub);
                          newChildarray?.push(newObj.newSubChild);
                          setRestructureChecked(newChildarray);
                          ArrayTest?.push(newObj);
                          actionsPerformed = true;
                          sub.isRestructureActive = false;
                        }
                      }
                    });
                  }
                }
              });
            });
          }
        }
      } else if (restructureItem[0]?.Item_x0020_Type === "Feature") {
        if (array != undefined && array?.length > 0) {
          topCompo = true;
          let newChildarray: any = [];
          let newarrays: any = [];
          array?.map((obj: any) => {
            let actionsPerformed = false;
            restructureItem?.map((items: any) => {
              let newObj: any;
              if (
                items?.PortfolioType?.Title === obj.PortfolioType?.Title &&
                !actionsPerformed
              ) {
                if (items?.Id !== obj.Id && obj.Item_x0020_Type != "Task") {
                  obj.isRestructureActive = true;
                  obj.Restructuring =
                    obj?.PortfolioTypeCheck == "Component"
                      ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"
                      : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                } else {
                  newObj = {
                    Title: obj?.Title,
                    TaskType: {
                      Id: obj.TaskType?.Id == undefined ? "" : obj.TaskType?.Id,
                    },
                    Id: obj.Id,
                    Item_x0020_Type: obj.Item_x0020_Type,
                    siteIcon:
                      obj.SiteIconTitle === undefined
                        ? obj.SiteIcon
                        : obj.SiteIconTitle,
                  };
                  newChildarray?.push(newObj);
                  newarrays?.push(obj);
                  setRestructuredItemarray(newarrays);
                  setCheckSubChilds(obj);
                  setRestructureChecked(newChildarray);
                  ArrayTest?.push(newObj);
                  actionsPerformed = true;
                  obj.isRestructureActive = false;
                }

                if (
                  obj?.subRows != undefined &&
                  obj?.subRows?.length > 0 &&
                  !actionsPerformed
                ) {
                  obj?.subRows?.map((sub: any) => {
                    if (
                      items?.Id !== sub.Id &&
                      sub.Item_x0020_Type != "Task" &&
                      sub.Item_x0020_Type != "Feature"
                    ) {
                      sub.isRestructureActive = true;
                      sub.Restructuring =
                        sub?.PortfolioTypeCheck == "Component"
                          ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"
                          : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                    } else {
                      if (items?.Id === sub.Id) {
                        newObj = {
                          Title: obj?.Title,
                          TaskType: {
                            Id:
                              obj.TaskType?.Id == undefined
                                ? ""
                                : obj.TaskType?.Id,
                          },
                          Item_x0020_Type: obj.Item_x0020_Type,
                          Id: obj.Id,
                          siteIcon:
                            obj.SiteIconTitle === undefined
                              ? obj.SiteIcon
                              : obj.SiteIconTitle,
                          newSubChild: {
                            Title: sub?.Title,
                            TaskType: {
                              Id:
                                sub.TaskType?.Id == undefined
                                  ? ""
                                  : sub.TaskType?.Id,
                            },
                            Item_x0020_Type: sub.Item_x0020_Type,
                            Id: sub.Id,
                            siteIcon:
                              sub.SiteIconTitle === undefined
                                ? sub.SiteIcon
                                : sub.SiteIconTitle,
                          },
                        };
                        newarrays?.push(obj);
                        setRestructuredItemarray(newarrays);
                        setCheckSubChilds(sub);
                        newChildarray?.push(newObj.newSubChild);
                        setRestructureChecked(newChildarray);
                        ArrayTest?.push(newObj);
                        actionsPerformed = true;
                        sub.isRestructureActive = false;
                      }
                    }
                  });
                }
              }
            });
          });
        }
      } else if (restructureItem[0]?.Item_x0020_Type === "Task" && (restructureItem?.[0].TaskType?.Id === 2 ||  restructureItem?.[0].TaskType?.Id === 3 ||  restructureItem?.[0].TaskType?.Id === 1)) {
        if (array != undefined && array?.length > 0) {
          let newChildarray: any = [];
          let newarrays: any = [];
          
          array?.map((obj: any) => {
            let actionsPerformed = false;
            restructureItem?.map((items: any) => {
              if (props?.queryItems?.TaskType?.Title === "Activities" && items?.TaskType?.Id == 2) {
                topCompo = true;
                setQuery4TopIcon("Workstream");
              }
              if (props?.queryItems?.TaskType?.Title === "Activities" && items?.TaskType?.Id == 3) {
                topCompo = true;
                setQuery4TopIcon("Task");
              }
              let newObj: any;
              if (
                items?.PortfolioTypeCheck === obj.PortfolioTypeCheck &&
                !actionsPerformed
              ) {
                if (!actionsPerformed) {
                  if (items?.Id !== obj.Id && obj?.TaskType?.Id != 2) {
                    obj.isRestructureActive = true;
                    obj.Restructuring =
                      obj?.PortfolioTypeCheck == "Component"
                        ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"
                        : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                    if (
                      (obj.TaskType?.Id == 1 || obj.TaskType?.Id == 3) &&
                      obj?.siteType !== items?.siteType
                    ) {
                      obj.isRestructureActive = false;
                    }
                    if (items?.TaskType?.Id == 3 && obj?.TaskType?.Id == 3) {
                      obj.isRestructureActive = false;
                    }
                    if (items?.TaskType?.Id == 1 && obj?.TaskType?.Id == 3 && obj?.TaskType?.Id == 1) {
                      obj.isRestructureActive = false;
                    }
                  } else {
                    if (items?.Id === obj.Id) {
                      newObj = {
                        Title: obj?.Title,
                        TaskType: {
                          Id:
                            obj.TaskType?.Id == undefined
                              ? ""
                              : obj.TaskType?.Id,
                        },
                        Id: obj.Id,
                        Item_x0020_Type: obj.Item_x0020_Type,
                        siteIcon:
                          obj.SiteIconTitle === undefined
                            ? obj.SiteIcon
                            : obj.SiteIconTitle,
                      };
                      newChildarray?.push(newObj);
                      newarrays?.push(obj);
                      setRestructuredItemarray(newarrays);
                      setCheckSubChilds(obj);
                      setRestructureChecked(newChildarray);
                      ArrayTest?.push(newObj);
                      actionsPerformed = true;
                      obj.isRestructureActive = false;
                    }
                  }
                }

                if (obj?.subRows != undefined && obj?.subRows?.length > 0 && !actionsPerformed) {
                  obj?.subRows?.map((sub: any) => {
                    if (items?.Id !== sub.Id && sub?.TaskType?.Id != 2) {
                      sub.isRestructureActive = true;
                      sub.Restructuring =
                        sub?.PortfolioTypeCheck == "Component"
                          ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"
                          : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                      if (
                        (sub.TaskType?.Id == 1 || sub.TaskType?.Id == 3) &&
                        sub?.siteType !== items?.siteType
                      ) {
                        sub.isRestructureActive = false;
                      }
                      if (items?.TaskType?.Id == 3 && sub?.TaskType?.Id == 3) {
                        sub.isRestructureActive = false;
                      }
                      if (
                        items?.TaskType?.Id == 1 &&
                        sub?.TaskType?.Id == 3 &&
                        sub?.TaskType?.Id == 1
                      ) {
                        sub.isRestructureActive = false;
                      }
                    } else {
                      if (items?.Id === sub.Id) {
                        newObj = {
                          Title: obj?.Title,
                          TaskType: {
                            Id:
                              obj.TaskType?.Id == undefined
                                ? ""
                                : obj.TaskType?.Id,
                          },
                          Item_x0020_Type: obj.Item_x0020_Type,
                          Id: obj.Id,
                          siteIcon:
                            obj.SiteIconTitle === undefined
                              ? obj.SiteIcon
                              : obj.SiteIconTitle,
                          newSubChild: {
                            Title: sub?.Title,
                            TaskType: {
                              Id:
                                sub.TaskType?.Id == undefined
                                  ? ""
                                  : sub.TaskType?.Id,
                            },
                            Item_x0020_Type: sub.Item_x0020_Type,
                            Id: sub.Id,
                            siteIcon:
                              sub.SiteIconTitle === undefined
                                ? sub.SiteIcon
                                : sub.SiteIconTitle,
                          },
                        };
                        newarrays?.push(obj);
                        setRestructuredItemarray(newarrays);
                        setCheckSubChilds(sub);
                        if(obj?.TaskType?.Id ==3 && sub?.TaskType?.Id == 2){
                          obj.isRestructureActive=false
                        }
                        newChildarray?.push(newObj.newSubChild);
                        setRestructureChecked(newChildarray);
                        ArrayTest?.push(newObj);
                        actionsPerformed = true;
                        sub.isRestructureActive = false;
                      }
                    }

                    if (
                      sub?.subRows != undefined &&
                      sub?.subRows?.length > 0 &&
                      !actionsPerformed
                    ) {
                      sub?.subRows?.map((feature: any) => {
                        if (
                          items?.Id !== feature.Id &&
                          feature?.TaskType?.Id != 2
                        ) {
                          feature.isRestructureActive = true;
                          feature.Restructuring =
                            feature?.PortfolioTypeCheck == "Component"
                              ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"
                              : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                          if (
                            (feature.TaskType?.Id == 1 ||
                              feature.TaskType?.Id == 3) &&
                            feature?.siteType !== items?.siteType
                          ) {
                            feature.isRestructureActive = false;
                          }
                          if (
                            items?.TaskType?.Id == 3 &&
                            feature?.TaskType?.Id == 3
                          ) {
                            feature.isRestructureActive = false;
                          }
                          if (
                            items?.TaskType?.Id == 1 &&
                            feature?.TaskType?.Id == 3 &&
                            feature?.TaskType?.Id == 1
                          ) {
                            feature.isRestructureActive = false;
                          }
                        } else {
                          if (items?.Id === feature.Id) {
                            newObj = {
                              Title: obj?.Title,
                              TaskType: {
                                Id:
                                  obj.TaskType?.Id == undefined
                                    ? ""
                                    : obj.TaskType?.Id,
                              },
                              Item_x0020_Type: obj.Item_x0020_Type,
                              Id: obj.Id,
                              siteIcon:
                                obj.SiteIconTitle === undefined
                                  ? obj.SiteIcon
                                  : obj.SiteIconTitle,
                              newSubChild: {
                                Title: sub?.Title,
                                TaskType: {
                                  Id:
                                    sub.TaskType?.Id == undefined
                                      ? ""
                                      : sub.TaskType?.Id,
                                },
                                Item_x0020_Type: sub.Item_x0020_Type,
                                Id: sub.Id,
                                siteIcon:
                                  sub.SiteIconTitle === undefined
                                    ? sub.SiteIcon
                                    : sub.SiteIconTitle,
                                newFeatChild: {
                                  Title: feature?.Title,
                                  TaskType: {
                                    Id:
                                      feature.TaskType?.Id == undefined
                                        ? ""
                                        : feature.TaskType?.Id,
                                  },
                                  Item_x0020_Type: feature.Item_x0020_Type,
                                  Id: feature.Id,
                                  siteIcon:
                                    feature.SiteIconTitle === undefined
                                      ? feature.SiteIcon
                                      : feature.SiteIconTitle,
                                },
                              },
                            };
                            newarrays?.push(obj);
                            setRestructuredItemarray(newarrays);
                            setCheckSubChilds(feature);
                            newChildarray?.push(
                              newObj.newSubChild.newFeatChild
                            );
                            setRestructureChecked(newChildarray);
                            ArrayTest?.push(newObj);
                            actionsPerformed = true;
                            feature.isRestructureActive = false;
                          }
                        }

                        if (
                          feature?.subRows != undefined &&
                          feature?.subRows?.length > 0 &&
                          !actionsPerformed &&
                          items?.TaskType?.Id != 1
                        ) {
                          feature?.subRows?.map((activity: any) => {
                            if (
                              items?.Id !== activity.Id &&
                              activity?.TaskType?.Id != 2
                            ) {
                              activity.isRestructureActive = true;
                              activity.Restructuring =
                                activity?.PortfolioTypeCheck == "Component"
                                  ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"
                                  : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                              if (
                                (activity.TaskType?.Id == 1 ||
                                  activity.TaskType?.Id == 3) &&
                                activity?.siteType !== items?.siteType
                              ) {
                                activity.isRestructureActive = false;
                              }
                              if (
                                items?.TaskType?.Id == 3 &&
                                activity?.TaskType?.Id == 3
                              ) {
                                activity.isRestructureActive = false;
                              }
                            } else {
                              if (items?.Id === activity.Id) {
                                newObj = {
                                  Title: obj?.Title,
                                  TaskType: {
                                    Id:
                                      obj.TaskType?.Id == undefined
                                        ? ""
                                        : obj.TaskType?.Id,
                                  },
                                  Item_x0020_Type: obj.Item_x0020_Type,
                                  Id: obj.Id,
                                  siteIcon:
                                    obj.SiteIconTitle === undefined
                                      ? obj.SiteIcon
                                      : obj.SiteIconTitle,
                                  newSubChild: {
                                    Title: sub?.Title,
                                    TaskType: {
                                      Id:
                                        sub.TaskType?.Id == undefined
                                          ? ""
                                          : sub.TaskType?.Id,
                                    },
                                    Item_x0020_Type: sub.Item_x0020_Type,
                                    Id: sub.Id,
                                    siteIcon:
                                      sub.SiteIconTitle === undefined
                                        ? sub.SiteIcon
                                        : sub.SiteIconTitle,
                                    newFeatChild: {
                                      Title: feature?.Title,
                                      TaskType: {
                                        Id:
                                          feature.TaskType?.Id == undefined
                                            ? ""
                                            : feature.TaskType?.Id,
                                      },
                                      Item_x0020_Type: feature.Item_x0020_Type,
                                      Id: feature.Id,
                                      siteIcon:
                                        feature.SiteIconTitle === undefined
                                          ? feature.SiteIcon
                                          : feature.SiteIconTitle,
                                    },
                                  },
                                };
                                newarrays?.push(obj);
                                setRestructuredItemarray(newarrays);
                                setCheckSubChilds(feature);
                                newChildarray?.push(
                                  newObj.newSubChild.newFeatChild
                                );
                                setRestructureChecked(newChildarray);
                                ArrayTest?.push(newObj);
                                actionsPerformed = true;
                                activity.isRestructureActive = false;
                              }
                            }

                            if (
                              activity?.subRows != undefined &&
                              activity?.subRows?.length > 0 &&
                              !actionsPerformed &&
                              items?.TaskType?.Id != 1
                            ) {
                              activity?.subRows?.map((wrkstrm: any) => {
                                if (
                                  items?.Id !== wrkstrm.Id &&
                                  wrkstrm?.TaskType?.Id != 2
                                ) {
                                  wrkstrm.isRestructureActive = true;
                                  wrkstrm.Restructuring =
                                    wrkstrm?.PortfolioTypeCheck == "Component"
                                      ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"
                                      : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                                  if (
                                    (wrkstrm.TaskType?.Id == 1 ||
                                      wrkstrm.TaskType?.Id == 3) &&
                                    wrkstrm?.siteType !== items?.siteType
                                  ) {
                                    wrkstrm.isRestructureActive = false;
                                  }
                                  if (
                                    items?.TaskType?.Id == 3 &&
                                    wrkstrm?.TaskType?.Id == 3
                                  ) {
                                    wrkstrm.isRestructureActive = false;
                                  }
                                } else {
                                  if (items?.Id === wrkstrm.Id) {
                                    newObj = {Title: obj?.Title,  TaskType: {Id:obj.TaskType?.Id == undefined ? "" : obj.TaskType?.Id,  },
                                      Item_x0020_Type: obj.Item_x0020_Type,
                                      Id: obj.Id,
                                      siteIcon:obj.SiteIconTitle === undefined  ? obj.SiteIcon  : obj.SiteIconTitle,
                                      newSubChild: { Title: sub?.Title, TaskType: {   Id:     sub.TaskType?.Id == undefined       ? ""       : sub.TaskType?.Id, },
                                        Item_x0020_Type: sub.Item_x0020_Type,
                                        Id: sub.Id,
                                        siteIcon: sub.SiteIconTitle === undefined   ? sub.SiteIcon   : sub.SiteIconTitle,
                                        newFeatChild: {
                                          Title: feature?.Title,
                                          TaskType: {
                                            Id:
                                              feature.TaskType?.Id == undefined
                                                ? ""
                                                : feature.TaskType?.Id,
                                          },
                                          Item_x0020_Type:
                                            feature.Item_x0020_Type,
                                          Id: feature.Id,
                                          siteIcon:
                                            feature.SiteIconTitle === undefined
                                              ? feature.SiteIcon
                                              : feature.SiteIconTitle,
                                        },
                                      },
                                    };
                                    newarrays?.push(obj);
                                    setRestructuredItemarray(newarrays);
                                    setCheckSubChilds(feature);
                                    newChildarray?.push(
                                      newObj.newSubChild.newFeatChild
                                    );
                                    setRestructureChecked(newChildarray);
                                    ArrayTest?.push(newObj);
                                    actionsPerformed = true;
                                    wrkstrm.isRestructureActive = false;
                                  }
                                }
                                if (
                                  wrkstrm?.subRows != undefined &&
                                  wrkstrm?.subRows?.length > 0 &&
                                  !actionsPerformed &&
                                  items?.TaskType?.Id !== 3 &&
                                  items?.TaskType?.Id != 1
                                ) {
                                  wrkstrm?.subRows?.map((task: any) => {
                                    if (
                                      items?.Id !== task.Id &&
                                      task?.TaskType?.Id != 2
                                    ) {
                                      task.isRestructureActive = true;
                                      task.Restructuring =
                                        task?.PortfolioTypeCheck == "Component"
                                          ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"
                                          : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                                      if (
                                        (task.TaskType?.Id == 1 ||
                                          task.TaskType?.Id == 3) &&
                                        task?.siteType !== items?.siteType
                                      ) {
                                        task.isRestructureActive = false;
                                      }
                                    } else {
                                      if (items?.Id == task.Id) {
                                        newObj = {
                                          Title: obj?.Title,
                                          TaskType: {
                                            Id:
                                              obj.TaskType?.Id == undefined
                                                ? ""
                                                : obj.TaskType?.Id,
                                          },
                                          Item_x0020_Type: obj.Item_x0020_Type,
                                          Id: obj.Id,
                                          siteIcon:
                                            obj.SiteIconTitle === undefined
                                              ? obj.SiteIcon
                                              : obj.SiteIconTitle,
                                          newSubChild: {
                                            Title: sub?.Title,
                                            TaskType: {
                                              Id:
                                                sub.TaskType?.Id == undefined
                                                  ? ""
                                                  : sub.TaskType?.Id,
                                            },
                                            Item_x0020_Type:
                                              sub.Item_x0020_Type,
                                            Id: sub.Id,
                                            siteIcon:
                                              sub.SiteIconTitle === undefined
                                                ? sub.SiteIcon
                                                : sub.SiteIconTitle,
                                            newFeatChild: {
                                              Title: feature?.Title,
                                              TaskType: {
                                                Id:
                                                  feature.TaskType?.Id ==
                                                  undefined
                                                    ? ""
                                                    : feature.TaskType?.Id,
                                              },
                                              Item_x0020_Type:
                                                feature.Item_x0020_Type,
                                              Id: feature.Id,
                                              siteIcon:
                                                feature.SiteIconTitle ===
                                                undefined
                                                  ? feature.SiteIcon
                                                  : feature.SiteIconTitle,
                                            },
                                          },
                                        };
                                        newarrays?.push(obj);
                                        setRestructuredItemarray(newarrays);
                                        setCheckSubChilds(feature);
                                        newChildarray?.push(
                                          newObj.newSubChild.newFeatChild
                                        );
                                        setRestructureChecked(newChildarray);
                                        ArrayTest?.push(newObj);
                                        actionsPerformed = true;
                                        task.isRestructureActive = false;
                                      }
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
              }
            });
          });
          if(restructureItem?.[0].TaskType?.Id === 2 && (props?.queryItems?.Item_x0020_Type == 'Feature' || props?.queryItems?.Item_x0020_Type == 'SubComponent' || props?.queryItems?.Item_x0020_Type == 'Component')){
                      topCompo = true;
          }
        }
      }else if (restructureItem[0]?.Item_x0020_Type === "Sprint") {
        let newarrays: any = [];
        let newObj: any;
        let newChildarray: any = [];
        array?.map((obj: any) => {
          obj.isRestructureActive = true;
          obj?.subRows != undefined &&
            obj?.subRows != null &&
            obj?.subRows?.length > 0 &&
            obj?.subRows?.map((sub: any) => {
              if (sub?.Title == restructureItem[0]?.Title && sub?.Id == restructureItem[0]?.Id) {
                newObj = {...obj,
                newSubChild:{...sub }}
                
                obj.isRestructureActive = false;
                newarrays?.push(obj);
                topCompo = true;
                setRestructuredItemarray(newarrays);
                newChildarray?.push(newObj.newSubChild);
                setRestructureChecked(newChildarray);
                ArrayTest?.push(newObj);
              }
            });
        });
      } else if (restructureItem[0]?.Item_x0020_Type === "Project") {
        let newarrays: any = [];
        let newObj: any;
        let newChildarray: any = [];
        if (restructureItem[0]?.subRows != undefined && restructureItem[0]?.subRows != null && restructureItem[0]?.subRows?.length > 0) {
          alert("You are not allowed to restructure this item.");
        } else {
          array?.map((obj: any) => {
            if (obj?.Title == restructureItem[0]?.Title && obj?.Id == restructureItem[0]?.Id) {
              newObj = {...obj}
              
              newarrays?.push(obj);
              topCompo = false;
              obj.isRestructureActive = false;
              setRestructuredItemarray(newarrays);
              // setCheckSubChilds(task);
              newChildarray?.push(newObj);
              setRestructureChecked(newChildarray);
              ArrayTest?.push(newObj);
              // task.isRestructureActive = false;
            } else {
              obj.isRestructureActive = true;
            }
          });
        }
      }else if (restructureItem[0]?.TaskType?.Id === 1 && props?.findPage == "ProjectOverView") {
        let newarrays: any = [];
        let newObj: any;
        let newChildarray: any = [];
        array?.map((obj: any) => {
          obj.isRestructureActive = true;
          obj?.subRows != undefined &&
            obj?.subRows != null &&
            obj?.subRows?.length > 0 &&
            obj?.subRows?.map((sub: any) => {
              if(sub?.Item_x0020_Type === "Sprint"){
                sub.isRestructureActive = true;
              }
              if((restructureItem[0]?.subRows?.length > 0 || restructureItem[0]?.subRows == undefined || restructureItem[0]?.subRows == null) && (sub?.TaskType?.Id == 1 || sub?.TaskType?.Id == 2)){
                sub.isRestructureActive = true;
              }
              if (sub?.Title == restructureItem[0]?.Title && sub?.Id == restructureItem[0]?.Id) {
                newObj = {...obj, newSubChild:{...sub}}
                newarrays?.push(obj);
                topCompo = false;
                setRestructuredItemarray(newarrays);
                newChildarray?.push(newObj.newSubChild);
                setRestructureChecked(newChildarray);
                ArrayTest?.push(newObj);
              }
              sub?.subRows != undefined &&
              sub?.subRows != null &&
              sub?.subRows?.length > 0 &&
              sub?.subRows?.map((feature: any) => {
                if((restructureItem[0]?.subRows?.length > 0 || restructureItem[0]?.subRows == undefined || restructureItem[0]?.subRows == null) && (feature?.TaskType?.Id == 1 || feature?.TaskType?.Id == 2)){
                  feature.isRestructureActive = true;
                }
                if (feature?.Title == restructureItem[0]?.Title && feature?.Id == restructureItem[0]?.Id) {
                  newObj = {...obj, newSubChild:{...sub ,newFeatChild:{...feature}}}
                  newarrays?.push(obj);
                  topCompo = false;
                  setRestructuredItemarray(newarrays);
                  newChildarray?.push(newObj.newSubChild.newFeatChild);
                  setRestructureChecked(newChildarray);
                  ArrayTest?.push(newObj);
                }
              })
            });
        });
      }else if (restructureItem[0]?.TaskType?.Id === 3 && props?.findPage == "ProjectOverView") {
        let newarrays: any = [];
        let newObj: any;
        let newChildarray: any = [];
        array?.map((obj: any) => {
          obj.isRestructureActive = true;
          obj?.subRows != undefined &&
            obj?.subRows != null &&
            obj?.subRows?.length > 0 &&
            obj?.subRows?.map((sub: any) => {
              if(sub?.Item_x0020_Type === "Sprint" || sub?.TaskType?.Id === 1){
                sub.isRestructureActive = true;
              }
              if (sub?.Title == restructureItem[0]?.Title && sub?.Id == restructureItem[0]?.Id) {
                newObj = {...obj, newSubChild:{...sub}}
                newarrays?.push(obj);
                topCompo = false;
                setRestructuredItemarray(newarrays);
                newChildarray?.push(newObj.newSubChild);
                setRestructureChecked(newChildarray);
                ArrayTest?.push(newObj);
              }
              sub?.subRows != undefined &&
              sub?.subRows != null &&
              sub?.subRows?.length > 0 &&
              sub?.subRows?.map((feature: any) => {
                if(feature?.TaskType?.Id === 1){
                  feature.isRestructureActive = true;
                }
                if (feature?.Title == restructureItem[0]?.Title && feature?.Id == restructureItem[0]?.Id) {
                  newObj = {...obj, newSubChild:{...sub ,newFeatChild:{...feature}}}
                  newarrays?.push(obj);
                  topCompo = false;
                  setRestructuredItemarray(newarrays);
                  newChildarray?.push(newObj?.newSubChild?.newFeatChild);
                  setRestructureChecked(newChildarray);
                  ArrayTest?.push(newObj);
                }
                feature?.subRows != undefined &&
                feature?.subRows != null &&
                feature?.subRows?.length > 0 &&
                feature?.subRows?.map((wrkstrm: any) => {
                  if (wrkstrm?.Title == restructureItem[0]?.Title && wrkstrm?.Id == restructureItem[0]?.Id) {
                    newObj = {...obj, newSubChild:{...sub ,newFeatChild:{...feature, newActChild : {...wrkstrm}}}}
                    newarrays?.push(obj);
                    topCompo = false;
                    setRestructuredItemarray(newarrays);
                    newChildarray?.push(newObj?.newSubChild?.newFeatChild.newActChild);
                    setRestructureChecked(newChildarray);
                    ArrayTest?.push(newObj);
                  }
                })
              })
            });
        });
      }else if (restructureItem[0]?.TaskType?.Id === 2 &&  props?.findPage == "ProjectOverView") {
        let newarrays: any = [];
        let newObj: any;
        let newChildarray: any = [];
        array?.map((obj: any) => {
          obj.isRestructureActive = true;
          obj?.subRows != undefined &&
            obj?.subRows != null &&
            obj?.subRows?.length > 0 &&
            obj?.subRows?.map((sub: any) => {
              if(sub?.Item_x0020_Type === "Sprint" || sub?.TaskType?.Id === 1 || sub?.TaskType?.Id === 3){
                sub.isRestructureActive = true;
              }
              if (sub?.Title == restructureItem[0]?.Title && sub?.Id == restructureItem[0]?.Id) {
                newObj = {...obj, newSubChild:{...sub}}
                newarrays?.push(obj);
                topCompo = false;
                setRestructuredItemarray(newarrays);
                newChildarray?.push(newObj.newSubChild);
                setRestructureChecked(newChildarray);
                ArrayTest?.push(newObj);
              }
              sub?.subRows != undefined &&
              sub?.subRows != null &&
              sub?.subRows?.length > 0 &&
              sub?.subRows?.map((feature: any) => {
                if(feature?.TaskType?.Id === 1 || feature?.TaskType?.Id === 3){
                  feature.isRestructureActive = true;
                }
                if (feature?.Title == restructureItem[0]?.Title && feature?.Id == restructureItem[0]?.Id) {
                  newObj = {...obj, newSubChild:{...sub ,newFeatChild:{...feature}}}
                  newarrays?.push(obj);
                  topCompo = false;
                  setRestructuredItemarray(newarrays);
                  newChildarray?.push(newObj?.newSubChild?.newFeatChild);
                  setRestructureChecked(newChildarray);
                  ArrayTest?.push(newObj);
                }
                feature?.subRows != undefined &&
                feature?.subRows != null &&
                feature?.subRows?.length > 0 &&
                feature?.subRows?.map((wrkstrm: any) => {
                  if(wrkstrm?.TaskType?.Id === 3){
                    wrkstrm.isRestructureActive = true;
                  }
                  if (wrkstrm?.Title == restructureItem[0]?.Title && wrkstrm?.Id == restructureItem[0]?.Id) {
                    newObj = {...obj, newSubChild:{...sub ,newFeatChild:{...feature, newActChild : {...wrkstrm}}}}
                    newarrays?.push(obj);
                    topCompo = false;
                    setRestructuredItemarray(newarrays);
                    newChildarray?.push(newObj?.newSubChild?.newFeatChild.newActChild);
                    setRestructureChecked(newChildarray);
                    ArrayTest?.push(newObj);
                  }
                  wrkstrm?.subRows != undefined &&
                wrkstrm?.subRows != null &&
                wrkstrm?.subRows?.length > 0 &&
                wrkstrm?.subRows?.map((task: any) => {
                  if (task?.Title == restructureItem[0]?.Title && task?.Id == restructureItem[0]?.Id) {
                    newObj = {...obj, newSubChild:{...sub ,newFeatChild:{...feature, newActChild : {...wrkstrm,newWrkChild:{...task} }}}}
                    newarrays?.push(obj);
                    topCompo = false;
                    setRestructuredItemarray(newarrays);
                    newChildarray?.push(newObj?.newSubChild?.newFeatChild.newActChild.newWrkChild);
                    setRestructureChecked(newChildarray);
                    ArrayTest?.push(newObj);
                  }
                })
                })
              })
            });
        });
      }
      setCheckItemLength(true);
      setOldArrayBackup(ArrayTest);
      restructureCallBack(array, topCompo);
    }
  };

  const buttonRestructureDifferentType = () => {
    let topCompo: any = false;
    let array = allData;
    if (
      allData?.length > 0 &&
      allData != undefined &&
      restructureItem?.length > 0 &&
      restructureItem != undefined
    ) {
      let ArrayTest: any = [];

      if (
        restructureItem?.[0].Item_x0020_Type === "Task" &&
        restructureItem?.[0].TaskType?.Id === 2
      ) {
        if (array != undefined && array?.length > 0) {
          let newChildarray: any = [];
          let newarrays: any = [];
          array?.map((obj: any) => {
            let actionsPerformed = false;
            restructureItem?.map((items: any) => {
              let newObj: any;
              if (
                items?.PortfolioTypeCheck === obj.PortfolioTypeCheck &&
                !actionsPerformed
              ) {
                if (!actionsPerformed) {
                  if (items?.Id !== obj.Id && obj?.TaskType?.Id != 2) {
                    obj.isRestructureActive = true;
                    obj.Restructuring =
                      obj?.PortfolioTypeCheck == "Component"
                        ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"
                        : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";

                    if (obj?.Item_x0020_Type == "Task") {
                      obj.isRestructureActive = false;
                    }
                  } else {
                    if (
                      items?.Id === obj.Id &&
                      items?.Item_x0020_Type == obj.Item_x0020_Type &&
                      items?.siteType == obj.siteType
                    ) {
                      newObj = {
                        Title: obj?.Title,
                        TaskType: {
                          Id:
                            obj.TaskType?.Id == undefined
                              ? ""
                              : obj.TaskType?.Id,
                        },
                        Id: obj.Id,
                        Item_x0020_Type: obj.Item_x0020_Type,
                        siteIcon:
                          obj.SiteIconTitle === undefined
                            ? obj.SiteIcon
                            : obj.SiteIconTitle,
                      };
                      newChildarray?.push(newObj);
                      newarrays?.push(obj);
                      setRestructuredItemarray(newarrays);
                      setCheckSubChilds(obj);
                      setRestructureChecked(newChildarray);
                      ArrayTest?.push(newObj);
                      actionsPerformed = true;
                      obj.isRestructureActive = false;
                    }
                  }
                }

                if (
                  obj?.subRows != undefined &&
                  obj?.subRows?.length > 0 &&
                  !actionsPerformed
                ) {
                  obj?.subRows?.map((sub: any) => {
                    if (items?.Id !== sub.Id && sub?.TaskType?.Id != 2) {
                      sub.isRestructureActive = true;
                      sub.Restructuring =
                        sub?.PortfolioTypeCheck == "Component"
                          ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"
                          : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                      if (sub?.Item_x0020_Type == "Task") {
                        sub.isRestructureActive = false;
                      }
                    } else {
                      if (
                        items?.Id === sub.Id &&
                        items?.Item_x0020_Type == sub.Item_x0020_Type &&
                        items?.siteType == sub.siteType
                      ) {
                        newObj = {
                          Title: obj?.Title,
                          TaskType: {
                            Id:
                              obj.TaskType?.Id == undefined
                                ? ""
                                : obj.TaskType?.Id,
                          },
                          Item_x0020_Type: obj.Item_x0020_Type,
                          Id: obj.Id,
                          siteIcon:
                            obj.SiteIconTitle === undefined
                              ? obj.SiteIcon
                              : obj.SiteIconTitle,
                          newSubChild: {
                            Title: sub?.Title,
                            TaskType: {
                              Id:
                                sub.TaskType?.Id == undefined
                                  ? ""
                                  : sub.TaskType?.Id,
                            },
                            Item_x0020_Type: sub.Item_x0020_Type,
                            Id: sub.Id,
                            siteIcon:
                              sub.SiteIconTitle === undefined
                                ? sub.SiteIcon
                                : sub.SiteIconTitle,
                          },
                        };
                        newarrays?.push(obj);
                        setRestructuredItemarray(newarrays);
                        setCheckSubChilds(sub);
                        newChildarray?.push(newObj.newSubChild);
                        setRestructureChecked(newChildarray);
                        ArrayTest?.push(newObj);
                        actionsPerformed = true;
                        sub.isRestructureActive = false;
                      }
                    }

                    if (
                      sub?.subRows != undefined &&
                      sub?.subRows?.length > 0 &&
                      !actionsPerformed
                    ) {
                      sub?.subRows?.map((feature: any) => {
                        if (
                          items?.Id !== feature.Id &&
                          feature?.TaskType?.Id != 2
                        ) {
                          feature.isRestructureActive = true;
                          feature.Restructuring =
                            feature?.PortfolioTypeCheck == "Component"
                              ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"
                              : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                          if (feature?.Item_x0020_Type == "Task") {
                            feature.isRestructureActive = false;
                          }
                        } else {
                          if (
                            items?.Id === feature.Id &&
                            items?.Item_x0020_Type == feature.Item_x0020_Type &&
                            items?.siteType == feature.siteType
                          ) {
                            newObj = {
                              Title: obj?.Title,
                              TaskType: {
                                Id:
                                  obj.TaskType?.Id == undefined
                                    ? ""
                                    : obj.TaskType?.Id,
                              },
                              Item_x0020_Type: obj.Item_x0020_Type,
                              Id: obj.Id,
                              siteIcon:
                                obj.SiteIconTitle === undefined
                                  ? obj.SiteIcon
                                  : obj.SiteIconTitle,
                              newSubChild: {
                                Title: sub?.Title,
                                TaskType: {
                                  Id:
                                    sub.TaskType?.Id == undefined
                                      ? ""
                                      : sub.TaskType?.Id,
                                },
                                Item_x0020_Type: sub.Item_x0020_Type,
                                Id: sub.Id,
                                siteIcon:
                                  sub.SiteIconTitle === undefined
                                    ? sub.SiteIcon
                                    : sub.SiteIconTitle,
                                newFeatChild: {
                                  Title: feature?.Title,
                                  TaskType: {
                                    Id:
                                      feature.TaskType?.Id == undefined
                                        ? ""
                                        : feature.TaskType?.Id,
                                  },
                                  Item_x0020_Type: feature.Item_x0020_Type,
                                  Id: feature.Id,
                                  siteIcon:
                                    feature.SiteIconTitle === undefined
                                      ? feature.SiteIcon
                                      : feature.SiteIconTitle,
                                },
                              },
                            };
                            newarrays?.push(obj);
                            setRestructuredItemarray(newarrays);
                            setCheckSubChilds(feature);
                            newChildarray?.push(
                              newObj.newSubChild.newFeatChild
                            );
                            setRestructureChecked(newChildarray);
                            ArrayTest?.push(newObj);
                            actionsPerformed = true;
                            feature.isRestructureActive = false;
                          }
                        }
                      });
                    }
                  });
                }
              }
            });
          });
        }
        setCheckItemLength(true);
        setOldArrayBackup(ArrayTest);
        restructureCallBack(array, topCompo);
      } else {
        alert(
          "You are not allowed to restructure different site Activities and Workstream"
        );
      }
    }
  };



 const prjtMngmntRestructuring=()=>{
  let array = allData;
  let newChildarray: any = [];
  let ArrayTest: any = [];
  let newarrays: any = [];
  let newObj: any;
  let topCompo = true;
  let hasTask:any = null;
  let hasSprint:any = null;
         hasSprint = restructureItem?.some((subRow:any) => subRow.Item_x0020_Type == 'Sprint');
       if(hasSprint != true){
          if(restructureItem[0].TaskType?.Id == 1 || restructureItem[0]?.TaskType?.Id == 2 || restructureItem[0]?.TaskType?.Id == 3){
            if(restructureItem[0]?.subRows?.length > 0 &&  restructureItem[0]?.subRows != undefined && restructureItem[0]?.subRows != null){
              hasTask = restructureItem[0]?.subRows.some((subRow:any) => subRow.TaskType?.Id === 2);
            }
            array?.map((obj: any) => {
              
                if(hasTask == true){
                  if(obj?.TaskType?.Id != 2  && obj?.TaskType !== null && obj?.TaskType !== undefined && obj?.TaskType?.Id != 3){
                    obj.isRestructureActive = true;
                  }
                  if(obj?.Item_x0020_Type == 'Sprint'){
                    obj.isRestructureActive = true;
                  }
                }else if(hasTask == false){
                  if(obj?.TaskType?.Id != 2 &&  obj?.TaskType !== null && obj?.TaskType !== undefined && obj?.TaskType?.Id != 3 && obj?.TaskType?.Id != 1){
                    obj.isRestructureActive = true;
                  }
                  if(obj?.Item_x0020_Type == 'Sprint'){
                    obj.isRestructureActive = true;
                  }
                }else if(hasTask == null){
                  if(obj?.TaskType?.Id != 2 &&  obj?.TaskType !== null && obj?.TaskType !== undefined){
                    obj.isRestructureActive = true;
                  }
                  if(obj?.Item_x0020_Type == 'Sprint'){
                    obj.isRestructureActive = true;
                  }
                }

                if(obj?.siteType != restructureItem[0]?.siteType && obj?.Item_x0020_Type !== 'Sprint'){
                  obj.isRestructureActive = false;
                }
               
                if(obj?.Title == restructureItem[0]?.Title && obj?.Id == restructureItem[0]?.Id && obj?.TaskType?.Id == restructureItem[0]?.TaskType?.Id){
                  topCompo = false;
                   newObj = {...obj}
                   obj.isRestructureActive = false;
                   newarrays?.push(obj);
                   setRestructuredItemarray(newarrays);
                    newChildarray?.push(newObj);
                    setRestructureChecked(newChildarray);
                    ArrayTest?.push(newObj);
                }
                if(obj?.subRows?.length > 0 &&  obj?.subRows != undefined && obj?.subRows != null){
                  obj?.subRows?.map((sub: any) => {
                    if(hasTask == true){
                      if(sub?.TaskType?.Id != 2 &&  sub?.TaskType !== null && sub?.TaskType !== undefined && sub?.TaskType?.Id != 3){
                        sub.isRestructureActive = true;
                      }
                    }else if(hasTask == false){
                      if(sub?.TaskType?.Id != 2 &&  sub?.TaskType !== null && sub?.TaskType !== undefined && sub?.TaskType?.Id != 3 && sub?.TaskType?.Id != 1){
                        sub.isRestructureActive = true;
                      }
                    }else if(hasTask == null){
                      if(sub?.TaskType?.Id != 2 &&  sub?.TaskType !== null && sub?.TaskType !== undefined){
                        sub.isRestructureActive = true;
                      }
                    }

                    if(sub?.siteType != restructureItem[0]?.siteType && sub?.Item_x0020_Type !== 'Sprint'){
                      sub.isRestructureActive = false;
                    }
                    if (sub?.Title == restructureItem[0]?.Title && sub?.Id == restructureItem[0]?.Id && sub?.TaskType?.Id == restructureItem[0]?.TaskType?.Id) {
                            sub.isRestructureActive = false;
                            obj.isRestructureActive = false;
                            newObj = {...obj,newSubChild:{...sub}}
                            newarrays?.push(obj);
                            setRestructuredItemarray(newarrays);
                            newChildarray?.push(newObj.newSubChild);
                            setRestructureChecked(newChildarray);
                            ArrayTest?.push(newObj);
                    }
                    if(sub?.subRows?.length > 0 &&  sub?.subRows != undefined && sub?.subRows != null){
                      sub?.subRows?.map((feat: any) => {
                        if(hasTask == true){
                          if(feat?.TaskType?.Id != 2 &&  feat?.TaskType !== null && feat?.TaskType !== undefined && feat?.TaskType?.Id != 3){
                            feat.isRestructureActive = true;
                          }
                        }else if(hasTask == false){
                          if(feat?.TaskType?.Id != 2 && feat?.TaskType !== null && feat?.TaskType!== undefined && feat?.TaskType?.Id != 3 && feat?.TaskType?.Id != 1){
                            feat.isRestructureActive = true;
                          }
                        }else if(hasTask == null){
                          if(feat?.TaskType?.Id != 2 && feat?.TaskType !== null && feat?.TaskType !== undefined){
                            feat.isRestructureActive = true;
                          }
                        }
                        if(feat?.siteType != restructureItem[0]?.siteType && feat?.Item_x0020_Type !== 'Sprint'){
                          feat.isRestructureActive = false;
                        }
                        if (feat?.Title == restructureItem[0]?.Title && feat?.Id == restructureItem[0]?.Id && feat?.TaskType?.Id == restructureItem[0]?.TaskType?.Id) {
        
                                  newObj = {...obj,newSubChild:{...sub,feature:{...feat}}}
                                  if(obj?.Item_x0020_Type == 'Sprint'){
                                    obj.isRestructureActive = false;
                                   }
                                  sub.isRestructureActive = false;
                                  feat.isRestructureActive = false;
                                  newarrays?.push(obj);
                                  setRestructuredItemarray(newarrays);
                                  // setCheckSubChilds(task);
                                  newChildarray?.push(newObj.newSubChild.feature);
                                  setRestructureChecked(newChildarray);
                                  ArrayTest?.push(newObj);
                                  // task.isRestructureActive = false;
                        }
                        if(feat?.subRows?.length > 0 &&  feat?.subRows != undefined && feat?.subRows != null){
                          feat?.subRows?.map((last: any) => {
                            if(hasTask == true){
                              if(last?.TaskType?.Id != 2 &&  last?.TaskType !== null && last?.TaskType !== undefined && last?.TaskType?.Id != 3){
                                last.isRestructureActive = true;
                              }
                            }else if(hasTask == false){
                              if(last?.TaskType?.Id != 2 &&  last?.TaskType !== null && last?.TaskType !== undefined && last?.TaskType?.Id != 3 && last?.TaskType?.Id != 1){
                                last.isRestructureActive = true;
                              }
                            }else if(hasTask == null){
                              if(last?.TaskType?.Id != 2 &&  last?.TaskType !== null && last?.TaskType !== undefined){
                                last.isRestructureActive = true;
                              }
                            }
                            if(last?.siteType != restructureItem[0]?.siteType && last?.Item_x0020_Type !== 'Sprint'){
                              last.isRestructureActive = false;
                            }
                            if (last?.Title == restructureItem[0]?.Title && last?.Id == restructureItem[0]?.Id && last?.TaskType?.Id == restructureItem[0]?.TaskType?.Id) {
                              newObj = {...obj,newSubChild:{...sub,feature:{...feat,activity:{...last}}}}
                                       if(obj?.Item_x0020_Type == 'Sprint'){
                                        obj.isRestructureActive = false;
                                       }
                                        last.isRestructureActive = false;
                                        feat.isRestructureActive = false;
                                        newarrays?.push(obj);
                                        setRestructuredItemarray(newarrays);
                                        newChildarray?.push(newObj.newSubChild.feature.activity);
                                        setRestructureChecked(newChildarray);
                                        ArrayTest?.push(newObj);
                            }
                          })}
                      })
                    }
                  })
                }
            })
          }
    }else{
        alert('You are not allowed to restructure this item !')
      }

      setOldArrayBackup(ArrayTest);
      restructureCallBack(array, topCompo);
  }

  // const handleCheckboxChange = (itemId:any) => {
  //   if (restructureItem.includes(itemId)) {
  //     setRestructureItem(restructureItem.filter((Id:any) => Id !== itemId));
  //   } else {
  //     setRestructureItem([...restructureItem, itemId]);
  //   }
  // };

  const handleCheckboxChange = (itemId:any) => {
    const updatedSelectedItems = restructureItem.includes(itemId)
      ? restructureItem.filter((Id:any) => Id !== itemId)
      : [...restructureItem, itemId];

    setRestructureItem(updatedSelectedItems);
  };

  const buttonRestructuring = () => {
    let topCompo: any = false;
    let array = allData;
    if (
      allData?.length > 0 &&
      allData != undefined &&
      restructureItem?.length > 0 &&
      restructureItem != undefined
    ) {
      let ArrayTest: any = [];

      restructureItem?.map((items: any, length: any) => {
        if (items?.Item_x0020_Type === "Component") {
          let checkSubCondition: boolean = true;
          let SubConditionAlert: boolean = true;
          let checkFeatureCondition: boolean = true;
          if (items?.subRows?.length > 0 && items?.subRows != undefined) {
            items?.subRows?.map((newItems: any) => {
              if (
                newItems?.Item_x0020_Type === "SubComponent" &&
                SubConditionAlert
              ) {
                alert("You are not allowed to Restructure this item.");
                SubConditionAlert = false;
                checkSubCondition = false;
              } else if (
                newItems?.Item_x0020_Type === "Feature" &&
                checkSubCondition
              ) {
                checkSubCondition = false;
                checkFeatureCondition = false;
                array?.map((obj: any) => {
                  let newChildarray: any = [];
                  let newarrays: any = [];
                  let newObj: any;
                  if (items?.PortfolioType?.Title === obj.PortfolioType?.Title) {
                    if (items?.Id !== obj.Id && obj.Item_x0020_Type != "Task") {
                      obj.isRestructureActive = true;
                      obj.Restructuring =
                        obj?.PortfolioTypeCheck == "Component"
                          ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"
                          : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                    } else {
                      newObj = {...obj, TaskType: {Id:obj.TaskType?.Id == undefined ? "" : obj.TaskType?.Id,Title:obj.TaskType?.Title}, siteIcon:obj.SiteIconTitle === undefined? obj.SiteIcon: obj.SiteIconTitle}
                      newChildarray?.push(newObj);
                      newarrays?.push(obj);
                      setRestructuredItemarray(newarrays);
                      setCheckSubChilds(obj);
                      setRestructureChecked(newChildarray);
                      ArrayTest?.push(newObj);
                      obj.isRestructureActive = false;
                    }

                    if (obj.Title == "Others") {
                      obj.isRestructureActive = false;
                    }
                  }
                });
              } else {
                if (checkSubCondition && checkFeatureCondition) {
                  checkFeatureCondition = false;
                  array?.map((obj: any) => {
                    let newChildarray: any = [];
                    let newarrays: any = [];
                    let newObj: any;
                    if (items?.PortfolioType?.Title === obj.PortfolioType?.Title) {
                      if (
                        items?.Id !== obj.Id &&
                        obj.Item_x0020_Type != "Task"
                      ) {
                        obj.isRestructureActive = true;
                        obj.Restructuring =
                          obj?.PortfolioTypeCheck == "Component"
                            ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"
                            : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                      } else {
                         newObj = {...obj, TaskType: {Id:obj.TaskType?.Id == undefined ? "" : obj.TaskType?.Id,Title:obj.TaskType?.Title}, siteIcon:obj.SiteIconTitle === undefined? obj.SiteIcon: obj.SiteIconTitle}
                        newChildarray?.push(newObj);
                        newarrays?.push(obj);
                        setRestructuredItemarray(newarrays);
                        setCheckSubChilds(obj);
                        setRestructureChecked(newChildarray);
                        ArrayTest?.push(newObj);
                        obj.isRestructureActive = false;
                      }

                      if (obj.Title == "Others") {
                        obj.isRestructureActive = false;
                      }

                      if (
                        obj?.subRows?.length > 0 &&
                        obj?.subRows != undefined
                      ) {
                        obj.subRows?.map((sub: any) => {
                          if (
                            sub.Item_x0020_Type != "Task" &&
                            sub.Item_x0020_Type != "Feature"
                          ) {
                            sub.isRestructureActive = true;
                            sub.Restructuring =
                              sub?.PortfolioTypeCheck == "Component"
                                ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"
                                : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                          }
                          if (sub.Title == "Others") {
                            sub.isRestructureActive = false;
                          }
                        });
                      }
                    }
                  });
                }
              }
            });
          } else {
            array?.map((obj: any) => {
              let newChildarray: any = [];
              let newarrays: any = [];
              let newObj: any;
              if (items?.PortfolioType?.Title === obj.PortfolioType?.Title) {
                if (items?.Id !== obj.Id && obj.Item_x0020_Type != "Task") {
                  obj.isRestructureActive = true;
                  obj.Restructuring =
                    obj?.PortfolioTypeCheck == "Component"
                      ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"
                      : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                } else {
                  
                  newObj = {...obj, TaskType: {Id:obj.TaskType?.Id == undefined ? "" : obj.TaskType?.Id,Title:obj.TaskType?.Title}, siteIcon:obj.SiteIconTitle === undefined? obj.SiteIcon: obj.SiteIconTitle}
                      ArrayTest?.push(newObj);
                  setCheckSubChilds(obj);
                  newarrays?.push(obj);
                  setRestructuredItemarray(newarrays);
                  newChildarray?.push(newObj);
                  setRestructureChecked(newChildarray);
                  obj.isRestructureActive = false;
                }

                if (obj.Title == "Others") {
                  obj.isRestructureActive = false;
                }

                if (obj?.subRows?.length > 0 && obj?.subRows != undefined) {
                  obj.subRows?.map((sub: any) => {
                    if (
                      sub.Item_x0020_Type != "Task" &&
                      sub.Item_x0020_Type != "Feature"
                    ) {
                      sub.isRestructureActive = true;
                      sub.Restructuring =
                        sub?.PortfolioTypeCheck == "Component"
                          ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"
                          : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                    }
                    if (sub.Title == "Others") {
                      sub.isRestructureActive = false;
                    }
                  });
                }
              }
            });
          }
        } else if (items?.Item_x0020_Type === "SubComponent") {
          let checkFeatureCondition: boolean = true;
          let checkTasks: boolean = true;
          topCompo = true;

          if (items?.subRows?.length > 0 && items?.subRows != undefined) {
            if (props?.queryItems == undefined) {
              setQuery4TopIcon("Component");
            }
            items?.subRows?.map((newItems: any) => {
              if (
                newItems?.Item_x0020_Type === "Feature" &&
                checkFeatureCondition
              ) {
                if (props?.queryItems?.Item_x0020_Type === "Component") {
                  alert("You are not allowed to Restructure this item");
                  topCompo = false;
                }
                checkFeatureCondition = false;
                checkTasks = false;
                array?.map((obj: any) => {
                  let newChildarray: any = [];
                  let newarrays: any = [];
                  let newObj: any;
                  if (items?.PortfolioType?.Title === obj.PortfolioType?.Title) {
                    if (
                      items?.Id !== obj.Id &&
                      obj.Item_x0020_Type != "Task" &&
                      obj.Item_x0020_Type != "SubComponent" &&
                      obj.Item_x0020_Type != "Feature"
                    ) {
                      obj.isRestructureActive = true;
                      obj.Restructuring =
                        obj?.PortfolioTypeCheck == "Component"
                          ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"
                          : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                    } else {
                      if (
                        items?.Id == obj.Id && obj.Item_x0020_Type != "Task"
                      ) {
                      
                        newObj = {...obj, TaskType: {Id:obj.TaskType?.Id == undefined ? "" : obj.TaskType?.Id,Title:obj.TaskType?.Title}, siteIcon:obj.SiteIconTitle === undefined? obj.SiteIcon: obj.SiteIconTitle}
                        newarrays?.push(obj);
                        setRestructuredItemarray(newarrays);
                        setCheckSubChilds(obj);
                        newChildarray?.push(newObj);
                        setRestructureChecked(newChildarray);
                        ArrayTest?.push(newObj);
                        obj.isRestructureActive = false;
                      }
                    }
                    if (obj.Title == "Others") {
                      obj.isRestructureActive = false;
                    }
                    if (obj?.subRows?.length > 0 && obj?.subRows != undefined) {
                      obj.subRows?.map((sub: any) => {
                        if (
                          items?.Id == sub.Id &&
                          sub.Item_x0020_Type != "Task"
                        ) {

                          newObj = {...obj, TaskType: {Id:obj.TaskType?.Id == undefined ? "" : obj.TaskType?.Id,Title:obj.TaskType?.Title}, siteIcon:obj.SiteIconTitle === undefined? obj.SiteIcon: obj.SiteIconTitle,
                          newSubChild:{...sub, TaskType: {Id:sub.TaskType?.Id == undefined ? "" : sub.TaskType?.Id,Title:sub.TaskType?.Title}, siteIcon:sub.SiteIconTitle === undefined? sub.SiteIcon: sub.SiteIconTitle}}
                          newarrays?.push(obj);
                          setRestructuredItemarray(newarrays);
                          setCheckSubChilds(sub);
                          newChildarray?.push(newObj.newSubChild);
                          setRestructureChecked(newChildarray);
                          obj.isRestructureActive = false;
                          ArrayTest?.push(newObj);
                          if(obj?.Item_x0020_Type == 'Component' && items?.subRows?.length == 0){
                            obj.isRestructureActive = true;
                          }
                          
                        }
                        if (sub.Title == "Others") {
                          sub.isRestructureActive = false;
                        }
                      });
                    }
                  }
                });
              } else {
                if (checkFeatureCondition && checkTasks) {
                  checkTasks = false;
                  if (props?.queryItems?.Item_x0020_Type === "Component") {
                    setQuery4TopIcon("Feature");
                  } else {
                    setQuery4TopIcon("Component");
                  }
                  array?.map((obj: any) => {
                    let newChildarray: any = [];
                    let newarrays: any = [];
                    let newObj: any;
                    if (items?.PortfolioType?.Title === obj.PortfolioType?.Title) {
                      if (
                        items?.Id !== obj.Id &&
                        obj.Item_x0020_Type != "Task" &&
                        obj.Item_x0020_Type != "Feature"
                      ) {
                        obj.isRestructureActive = true;
                        obj.Restructuring =
                          obj?.PortfolioTypeCheck == "Component"
                            ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"
                            : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                      } else {
                        if (
                          items?.Id == obj.Id &&
                          items?.Item_x0020_Type == obj?.Item_x0020_Type
                        ) {
                          
                          newObj = {...obj, TaskType: {Id:obj.TaskType?.Id == undefined ? "" : obj.TaskType?.Id,Title:obj.TaskType?.Title}, siteIcon:obj.SiteIconTitle === undefined? obj.SiteIcon: obj.SiteIconTitle}
                          newarrays?.push(obj);
                          setRestructuredItemarray(newarrays);
                          setCheckSubChilds(obj);
                          newChildarray?.push(newObj);
                          setRestructureChecked(newChildarray);
                          ArrayTest?.push(newObj);
                          obj.isRestructureActive = false;
                        }
                      }
                      if (obj.Title == "Others") {
                        obj.isRestructureActive = false;
                      }
                      if (
                        obj?.subRows?.length > 0 &&
                        obj?.subRows != undefined
                      ) {
                        obj.subRows?.map((sub: any) => {
                          if (
                            items?.Id !== sub.Id &&
                            sub.Item_x0020_Type != "Task" &&
                            sub.Item_x0020_Type != "Feature"
                          ) {
                            sub.isRestructureActive = true;
                            sub.Restructuring =
                              sub?.PortfolioTypeCheck == "Component"
                                ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"
                                : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                          } else {
                            if (
                              items?.Id == sub.Id &&
                              items?.Item_x0020_Type == sub?.Item_x0020_Type
                            ) {
                             
                              newObj = {...obj, TaskType: {Id:obj.TaskType?.Id == undefined ? "" : obj.TaskType?.Id,Title:obj.TaskType?.Title}, siteIcon:obj.SiteIconTitle === undefined? obj.SiteIcon: obj.SiteIconTitle,
                          newSubChild:{...sub, TaskType: {Id:sub.TaskType?.Id == undefined ? "" : sub.TaskType?.Id,Title:sub.TaskType?.Title}, siteIcon:sub.SiteIconTitle === undefined? sub.SiteIcon: sub.SiteIconTitle}}
                          
                              newarrays?.push(obj);
                              setRestructuredItemarray(newarrays);
                              setCheckSubChilds(sub);
                              newChildarray?.push(newObj.newSubChild);
                              setRestructureChecked(newChildarray);
                              ArrayTest?.push(newObj);
                              obj.isRestructureActive = false;
                              sub.isRestructureActive = false;
                            }
                          }
                          if (sub.Title == "Others") {
                            sub.isRestructureActive = false;
                          }
                        });
                      }
                    }
                  });
                }
              }
            });
          } else {
            if (props?.queryItems?.Item_x0020_Type === "Component") {
              setQuery4TopIcon("Feature");
            } else {
              setQuery4TopIcon("Component");
            }
            array?.map((obj: any) => {
              let newChildarray: any = [];
              let newarrays: any = [];
              let newObj: any;
              if (items?.PortfolioType?.Title === obj.PortfolioType?.Title) {
                if (
                  items?.Id !== obj.Id &&
                  obj.Item_x0020_Type != "Task" &&
                  obj.Item_x0020_Type != "Feature"
                ) {
                  obj.isRestructureActive = true;
                  obj.Restructuring =
                    obj?.PortfolioTypeCheck == "Component"
                      ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"
                      : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                } else {
                  if (
                    items?.Id == obj.Id &&
                    items?.Item_x0020_Type == obj?.Item_x0020_Type
                  ) {
                    
                    newObj = {...obj, TaskType: {Id:obj.TaskType?.Id == undefined ? "" : obj.TaskType?.Id,Title:obj.TaskType?.Title}, siteIcon:obj.SiteIconTitle === undefined? obj.SiteIcon: obj.SiteIconTitle}
                         
                    newarrays?.push(obj);
                    setRestructuredItemarray(newarrays);
                    setCheckSubChilds(obj);
                    newChildarray?.push(newObj);
                    setRestructureChecked(newChildarray);
                    ArrayTest?.push(newObj);
                    obj.isRestructureActive = false;
                  }
                }
                if (obj.Title == "Others") {
                  obj.isRestructureActive = false;
                }
                if (obj?.subRows?.length > 0 && obj?.subRows != undefined) {
                  obj.subRows?.map((sub: any) => {
                    if (
                      items?.Id !== sub.Id &&
                      sub.Item_x0020_Type != "Task" &&
                      sub.Item_x0020_Type != "Feature"
                    ) {
                      sub.isRestructureActive = true;
                      sub.Restructuring =
                        sub?.PortfolioTypeCheck == "Component"
                          ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"
                          : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                    } else {
                      if (
                        items?.Id == sub.Id &&
                        items?.Item_x0020_Type == sub?.Item_x0020_Type
                      ) {
                        newObj = {...obj, TaskType: {Id:obj.TaskType?.Id == undefined ? "" : obj.TaskType?.Id,Title:obj.TaskType?.Title}, siteIcon:obj.SiteIconTitle === undefined? obj.SiteIcon: obj.SiteIconTitle,
                        newSubChild:{...sub, TaskType: {Id:sub.TaskType?.Id == undefined ? "" : sub.TaskType?.Id,Title:sub.TaskType?.Title}, siteIcon:sub.SiteIconTitle === undefined? sub.SiteIcon: sub.SiteIconTitle}}
                        
                        newarrays?.push(obj);
                        setRestructuredItemarray(newarrays);
                        setCheckSubChilds(sub);
                        newChildarray?.push(newObj.newSubChild);
                        setRestructureChecked(newChildarray);
                        ArrayTest?.push(newObj);
                        obj.isRestructureActive = false;
                        sub.isRestructureActive = false;
                      }
                    }
                    if (sub.Title == "Others") {
                      sub.isRestructureActive = false;
                    }
                  });
                }
              }
            });
          }
        } else if (items?.Item_x0020_Type === "Feature") {
          topCompo = true;
          setQuery4TopIcon("Component");
          if (props?.queryItems?.Item_x0020_Type === "SubComponent") {
            alert("You are not allowed to restructure this item");
            topCompo = false;
          }

          if (props?.queryItems?.Item_x0020_Type === "Component") {
            setQuery4TopIcon("SubComponent");
          }
          array?.map((obj: any) => {
            let newChildarray: any = [];
            let newarrays: any = [];
            let newObj: any;
            if (items?.PortfolioType?.Title === obj.PortfolioType?.Title) {
              if (
                obj.Item_x0020_Type != "Task" &&
                obj.Item_x0020_Type != "Feature"
              ) {
                obj.isRestructureActive = true;
                obj.Restructuring =
                  obj?.PortfolioTypeCheck == "Component"
                    ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"
                    : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
              }
              if (obj.Title == "Others") {
                obj.isRestructureActive = false;
              }
              if (
                items?.Id == obj.Id &&
                items?.Item_x0020_Type == obj?.Item_x0020_Type
              ) {
                newObj = {...obj, TaskType: {Id:obj.TaskType?.Id == undefined ? "" : obj.TaskType?.Id,Title:obj.TaskType?.Title}, siteIcon:obj.SiteIconTitle === undefined? obj.SiteIcon: obj.SiteIconTitle,}
                        
                newChildarray?.push(newObj);
                newarrays?.push(obj);
                setRestructuredItemarray(newarrays);
                setCheckSubChilds(obj);
                setRestructureChecked(newChildarray);
                ArrayTest?.push(newObj);
                obj.isRestructureActive = false;
              }
              if (obj?.subRows?.length > 0 && obj?.subRows != undefined) {
                obj.subRows?.map((sub: any) => {
                  if (
                    sub.Item_x0020_Type != "Task" &&
                    sub.Item_x0020_Type != "Feature"
                  ) {
                    sub.isRestructureActive = true;
                    sub.Restructuring =
                      sub?.PortfolioTypeCheck == "Component"
                        ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"
                        : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                  }
                  if (
                    items?.Id == sub.Id &&
                    items?.Item_x0020_Type == sub?.Item_x0020_Type
                  ) {
                   
                    newObj = {...obj, TaskType: {Id:obj.TaskType?.Id == undefined ? "" : obj.TaskType?.Id,Title:obj.TaskType?.Title}, siteIcon:obj.SiteIconTitle === undefined? obj.SiteIcon: obj.SiteIconTitle,
                        newSubChild:{...sub, TaskType: {Id:sub.TaskType?.Id == undefined ? "" : sub.TaskType?.Id,Title:sub.TaskType?.Title}, siteIcon:sub.SiteIconTitle === undefined? sub.SiteIcon: sub.SiteIconTitle, }}
                        
                    newarrays?.push(obj);
                    setRestructuredItemarray(newarrays);
                    setCheckSubChilds(sub);
                    newChildarray?.push(newObj.newSubChild);
                    setRestructureChecked(newChildarray);
                    ArrayTest?.push(newObj);
                    if(obj?.Item_x0020_Type !== 'Component'){
                     obj.isRestructureActive = false;
                    }
                    sub.isRestructureActive = false;
                  }
                  if (sub.Title == "Others") {
                    sub.isRestructureActive = false;
                  }
                  if (sub?.subRows?.length > 0 && sub?.subRows != undefined) {
                    sub.subRows?.map((feature: any) => {
                      if (items?.Id == feature.Id && items?.Item_x0020_Type == feature?.Item_x0020_Type) {
                        
                        newObj = {...obj, TaskType: {Id:obj.TaskType?.Id == undefined ? "" : obj.TaskType?.Id,Title:obj.TaskType?.Title}, siteIcon:obj.SiteIconTitle === undefined? obj.SiteIcon: obj.SiteIconTitle,
                        newSubChild:{...sub, TaskType: {Id:sub.TaskType?.Id == undefined ? "" : sub.TaskType?.Id,Title:sub.TaskType?.Title}, siteIcon:sub.SiteIconTitle === undefined? sub.SiteIcon: sub.SiteIconTitle,
                        newFeatChild : {...feature, TaskType: {Id:feature.TaskType?.Id == undefined ? "" : feature.TaskType?.Id,Title:feature.TaskType?.Title}, siteIcon:feature.SiteIconTitle === undefined? feature.SiteIcon: feature.SiteIconTitle} }}
                        
                        newarrays?.push(obj);
                        setRestructuredItemarray(newarrays);
                        setCheckSubChilds(feature);
                        newChildarray?.push(newObj.newSubChild.newFeatChild);
                        setRestructureChecked(newChildarray);
                        ArrayTest?.push(newObj);
                        sub.isRestructureActive = false;
                      }
                    });
                  }
                });
              }
            }
          });
        } else if (items.TaskType?.Id === 1 && props?.findPage !== "ProjectOverView") {
          let newChildarray: any = [];
          let newarrays: any = [];
          let checkPortfoliosAlrt: boolean = true;

          topCompo = true;
          array?.map((obj: any) => {
            let newObj: any;
            if (items?.PortfolioTypeCheck === obj.PortfolioTypeCheck && props?.projectmngmnt != "projectmngmnt") {
              if (obj.TaskType?.Id !== 2) {
                let checkchild: any = 0;
                if (items.subRows != undefined) {
                  items.subRows?.map((items: any) => {
                    if ((props?.queryItems?.TaskType?.Title == "Activities") && props?.queryItems != undefined && props?.queryItems != null && checkPortfoliosAlrt) {
                      if (items.TaskType?.Id === 3) {
                        topCompo = false;
                        alert("You are not allowed to restructure this item");
                        checkPortfoliosAlrt = false;
                      } else {
                        topCompo = true;
                        setQuery4TopIcon("Workstream");
                        checkPortfoliosAlrt = false;
                      }
                    }
                    let checkTrue: any = false;
                    if (items.TaskType?.Id === 3) {
                      checkchild = 3;
                      checkTrue = true;
                    }

                    if (items.TaskType?.Id === 2 && !checkTrue) {
                      checkchild = 2;
                    }
                  });
                }

                if ((props?.queryItems?.Item_x0020_Type == "Feature" || props?.queryItems?.Item_x0020_Type == "SubComponent" || props?.queryItems?.Item_x0020_Type == "Component") && (items?.TaskType?.Id==2 || items?.TaskType?.Id==3) && props?.queryItems != undefined && props?.queryItems != null && checkPortfoliosAlrt && items?.subRows?.length === 0) {
                  topCompo = true;
                  setQuery4TopIcon("Activity");
                  checkPortfoliosAlrt = false;
                }
                if ((props?.queryItems?.Item_x0020_Type == "Feature" || props?.queryItems?.Item_x0020_Type == "SubComponent" || props?.queryItems?.Item_x0020_Type == "Component") && (items?.TaskType?.Id==1) && props?.queryItems != undefined && props?.queryItems != null && checkPortfoliosAlrt && items?.subRows?.length > 0) {
                  topCompo = false;
                  setQuery4TopIcon("");
                  alert('You are not allowed to restructure this item !')
                  checkPortfoliosAlrt = false;
                }
                if ((props?.queryItems?.Item_x0020_Type == "Feature" || props?.queryItems?.Item_x0020_Type == "SubComponent" || props?.queryItems?.Item_x0020_Type == "Component") && (items?.TaskType?.Id==1) && props?.queryItems != undefined && props?.queryItems != null && checkPortfoliosAlrt && items?.subRows?.length === 0) {
                  topCompo = true;
                  setQuery4TopIcon("Task");
                  checkPortfoliosAlrt = false;
                }
                if (checkchild == 3) {
                  if (obj.Item_x0020_Type !== "Task") {
                    obj.isRestructureActive = true;
                  }
                } else if (checkchild == 2) {
                  if (obj.TaskType?.Id !== 3) {
                    obj.isRestructureActive = true;
                  }
                } else {
                  obj.isRestructureActive = true;
                }

                if (obj.Title == "Others") {
                  obj.isRestructureActive = false;
                }
              }
              if ( items?.Id == obj.Id && items?.TaskType?.Id == obj?.TaskType?.Id && items?.siteType == obj?.siteType) {
                newObj = {...obj, TaskType: {Id:obj.TaskType?.Id == undefined ? "" : obj.TaskType?.Id,Title:obj.TaskType?.Title}, siteIcon:obj.SiteIconTitle === undefined? obj.SiteIcon: obj.SiteIconTitle}
                newChildarray?.push(newObj);
                newarrays?.push(obj);
                setRestructuredItemarray(newarrays);
                setCheckSubChilds(obj);
                setRestructureChecked(newChildarray);
                ArrayTest?.push(newObj);
                obj.isRestructureActive = false;
              }
              if ((obj.TaskType?.Id == 1 || obj.TaskType?.Id == 3) && obj?.siteType !== items?.siteType) {
                obj.isRestructureActive = false;
              }
              if (obj?.subRows?.length > 0 && obj?.subRows != undefined) {
                obj.subRows?.map((sub: any) => {
                  if (sub.TaskType?.Id !== 2) {
                    let checkchild: any = 0;
                    if (items.subRows != undefined) {
                      items.subRows?.map((items: any) => {
                        let checkTrue: any = false;
                        if (items.TaskType?.Id === 3) {
                          checkchild = 3;
                          checkTrue = true;
                        }

                        if (items.TaskType?.Id === 2 && !checkTrue) {
                          checkchild = 2;
                        }
                      });
                    }

                    if (checkchild == 3) {
                      if (sub.Item_x0020_Type !== "Task") {
                        sub.isRestructureActive = true;
                      }
                    } else if (checkchild == 2) {
                      if (sub.TaskType?.Id !== 3) {
                        sub.isRestructureActive = true;
                      }
                    } else {
                      sub.isRestructureActive = true;
                    }
                  }
                  if (items?.Id == obj.Id) {
                    sub.isRestructureActive = false;
                  }
                  if (sub.Title == "Others") {
                    sub.isRestructureActive = false;
                  }
                  if (items?.Id == sub.Id && items?.TaskType?.Id == sub?.TaskType?.Id && items?.siteType == sub?.siteType) {
                    newObj = {...obj, TaskType: {Id:obj.TaskType?.Id == undefined ? "" : obj.TaskType?.Id,Title:obj.TaskType?.Title}, siteIcon:obj.SiteIconTitle === undefined? obj.SiteIcon: obj.SiteIconTitle,
                    newSubChild:{...sub, TaskType: {Id:sub.TaskType?.Id == undefined ? "" : sub.TaskType?.Id,Title:sub.TaskType?.Title}, siteIcon:sub.SiteIconTitle === undefined? sub.SiteIcon: sub.SiteIconTitle}}
                    newarrays?.push(obj);
                    setRestructuredItemarray(newarrays);
                    setCheckSubChilds(sub);
                    newChildarray?.push(newObj.newSubChild);
                    setRestructureChecked(newChildarray);
                    ArrayTest?.push(newObj);
                    obj.isRestructureActive = false;
                    sub.isRestructureActive = false;
                  }
                  if ((sub.TaskType?.Id == 1 || sub.TaskType?.Id == 3) && sub?.siteType !== items?.siteType) {
                    sub.isRestructureActive = false;
                  }

                  if (sub?.subRows?.length > 0 && sub?.subRows != undefined) {
                    sub.subRows?.map((feature: any) => {
                      if (feature.TaskType?.Id !== 2) {
                        let checkchild: any = 0;
                        if (items.subRows != undefined) {
                          items.subRows?.map((items: any) => {
                            let checkTrue: any = false;
                            if (items.TaskType?.Id === 3) {
                              checkchild = 3;
                              checkTrue = true;
                            }

                            if (items.TaskType?.Id === 2 && !checkTrue) {
                              checkchild = 2;
                            }
                          });
                        }

                        if (checkchild == 3) {
                          if (feature.Item_x0020_Type !== "Task") {
                            feature.isRestructureActive = true;
                          }
                        } else if (checkchild == 2) {
                          if (feature.TaskType?.Id !== 3) {
                            feature.isRestructureActive = true;
                          }
                        } else {
                          feature.isRestructureActive = true;
                        }
                      }
                      if (items?.Id == sub.Id) {
                        feature.isRestructureActive = false;
                      }
                      if (feature.Title == "Others") {
                        feature.isRestructureActive = false;
                      }
                      if (items?.Id == feature.Id && items?.TaskType?.Id == feature?.TaskType?.Id && items?.siteType == feature?.siteType) {
                        newObj = {...obj, TaskType: {Id:obj.TaskType?.Id == undefined ? "" : obj.TaskType?.Id,Title:obj.TaskType?.Title}, siteIcon:obj.SiteIconTitle === undefined? obj.SiteIcon: obj.SiteIconTitle,
                        newSubChild:{...sub, TaskType: {Id:sub.TaskType?.Id == undefined ? "" : sub.TaskType?.Id,Title:sub.TaskType?.Title}, siteIcon:sub.SiteIconTitle === undefined? sub.SiteIcon: sub.SiteIconTitle,
                        newFeatChild : {...feature, TaskType: {Id:feature.TaskType?.Id == undefined ? "" : feature.TaskType?.Id,Title:feature.TaskType?.Title}, siteIcon:feature.SiteIconTitle === undefined? feature.SiteIcon: feature.SiteIconTitle} }}
                        newarrays?.push(obj);
                        setRestructuredItemarray(newarrays);
                        setCheckSubChilds(feature);
                        newChildarray?.push(newObj.newSubChild.newFeatChild);
                        setRestructureChecked(newChildarray);
                        ArrayTest?.push(newObj);
                        feature.isRestructureActive = false;
                        sub.isRestructureActive = false;
                      }
                      if ((feature.TaskType?.Id == 1 ||   feature.TaskType?.Id == 3) && feature?.siteType !== items?.siteType) {
                        feature.isRestructureActive = false;
                      }
                      if (feature?.subRows?.length > 0 &&feature?.subRows != undefined ) {
                        feature.subRows?.map((activity: any) => {
                          if (activity.TaskType?.Id !== 2) {
                            let checkchild: any = 0;
                            if (items.subRows != undefined) {
                              items.subRows?.map((items: any) => {
                                let checkTrue: any = false;
                                if (items.TaskType?.Id === 3) {
                                  checkchild = 3;
                                  checkTrue = true;
                                }

                                if (items.TaskType?.Id === 2 && !checkTrue) {
                                  checkchild = 2;
                                }
                              });
                            }

                            if (checkchild == 3) {
                              if (activity.Item_x0020_Type !== "Task") {
                                activity.isRestructureActive = true;
                              }
                            } else if (checkchild == 2) {
                              if (activity.TaskType?.Id !== 3) {
                                activity.isRestructureActive = true;
                              }
                            } else {
                              activity.isRestructureActive = true;
                            }
                          }
                          if (items?.Id == feature.Id) {
                            activity.isRestructureActive = false;
                          }
                          if (activity.Title == "Others") {
                            activity.isRestructureActive = false;
                          }
                          if (
                            items?.Id == activity.Id &&
                            items?.TaskType?.Id == activity?.TaskType?.Id &&
                            items?.siteType == activity?.siteType
                          ) {
                          
                            newObj = {...obj, TaskType: {Id:obj.TaskType?.Id == undefined ? "" : obj.TaskType?.Id,Title:obj.TaskType?.Title}, siteIcon:obj.SiteIconTitle === undefined? obj.SiteIcon: obj.SiteIconTitle,
                            newSubChild:{...sub, TaskType: {Id:sub.TaskType?.Id == undefined ? "" : sub.TaskType?.Id,Title:sub.TaskType?.Title}, siteIcon:sub.SiteIconTitle === undefined? sub.SiteIcon: sub.SiteIconTitle,
                            newFeatChild : {...feature, TaskType: {Id:feature.TaskType?.Id == undefined ? "" : feature.TaskType?.Id,Title:feature.TaskType?.Title}, siteIcon:feature.SiteIconTitle === undefined? feature.SiteIcon: feature.SiteIconTitle,
                            newActChild : {...activity, TaskType: {Id:activity.TaskType?.Id == undefined ? "" : activity.TaskType?.Id,Title:activity.TaskType?.Title}, siteIcon:activity.SiteIconTitle === undefined? activity.SiteIcon: activity.SiteIconTitle}} }}
                            
                            newarrays?.push(obj);
                            setRestructuredItemarray(newarrays);
                            setCheckSubChilds(activity);
                            newChildarray?.push(
                              newObj.newSubChild.newFeatChild.newActChild
                            );
                            setRestructureChecked(newChildarray);
                            ArrayTest?.push(newObj);
                            activity.isRestructureActive = false;
                            feature.isRestructureActive = false;
                          }
                          if (
                            (activity.TaskType?.Id == 1 ||
                              activity.TaskType?.Id == 3) &&
                            activity?.siteType !== items?.siteType
                          ) {
                            activity.isRestructureActive = false;
                          }

                          if (
                            activity?.subRows?.length > 0 &&
                            activity?.subRows != undefined
                          ) {
                            activity.subRows?.map((wrkstrm: any) => {
                              if (wrkstrm.TaskType?.Id !== 2) {
                                let checkchild: any = 0;
                                if (items.subRows != undefined) {
                                  items.subRows?.map((items: any) => {
                                    let checkTrue: any = false;
                                    if (items.TaskType?.Id === 3) {
                                      checkchild = 3;
                                      checkTrue = true;
                                    }

                                    if (
                                      items.TaskType?.Id === 2 &&
                                      !checkTrue
                                    ) {
                                      checkchild = 2;
                                    }
                                  });
                                }

                                if (checkchild == 3) {
                                  if (wrkstrm.Item_x0020_Type !== "Task") {
                                    wrkstrm.isRestructureActive = true;
                                    wrkstrm.Restructuring =
                                      wrkstrm?.PortfolioTypeCheck == "Component"
                                        ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"
                                        : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                                  }
                                } else if (checkchild == 2) {
                                  if (wrkstrm.TaskType?.Id !== 3) {
                                    wrkstrm.isRestructureActive = true;
                                    wrkstrm.Restructuring =
                                      wrkstrm?.PortfolioTypeCheck == "Component"
                                        ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"
                                        : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                                  }
                                } else {
                                  wrkstrm.isRestructureActive = true;
                                  wrkstrm.Restructuring =
                                    wrkstrm?.PortfolioTypeCheck == "Component"
                                      ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"
                                      : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                                }
                              }
                              if (items?.Id == activity.Id) {
                                wrkstrm.isRestructureActive = false;
                              }
                              if (wrkstrm.Title == "Others") {
                                wrkstrm.isRestructureActive = false;
                              }
                              if (
                                items?.Id == wrkstrm.Id &&
                                items?.TaskType?.Id == wrkstrm?.TaskType?.Id &&
                                items?.siteType == wrkstrm?.siteType
                              ) {
                               
                                newObj = {...obj, TaskType: {Id:obj.TaskType?.Id == undefined ? "" : obj.TaskType?.Id,Title:obj.TaskType?.Title}, siteIcon:obj.SiteIconTitle === undefined? obj.SiteIcon: obj.SiteIconTitle,
                                newSubChild:{...sub, TaskType: {Id:sub.TaskType?.Id == undefined ? "" : sub.TaskType?.Id,Title:sub.TaskType?.Title}, siteIcon:sub.SiteIconTitle === undefined? sub.SiteIcon: sub.SiteIconTitle,
                                newFeatChild : {...feature, TaskType: {Id:feature.TaskType?.Id == undefined ? "" : feature.TaskType?.Id,Title:feature.TaskType?.Title}, siteIcon:feature.SiteIconTitle === undefined? feature.SiteIcon: feature.SiteIconTitle,
                                newActChild : {...activity, TaskType: {Id:activity.TaskType?.Id == undefined ? "" : activity.TaskType?.Id,Title:activity.TaskType?.Title}, siteIcon:activity.SiteIconTitle === undefined? activity.SiteIcon: activity.SiteIconTitle,
                                newWrkChild:{...wrkstrm, TaskType: {Id:wrkstrm.TaskType?.Id == undefined ? "" : wrkstrm.TaskType?.Id,Title:wrkstrm.TaskType?.Title}, siteIcon:wrkstrm.SiteIconTitle === undefined? wrkstrm.SiteIcon: wrkstrm.SiteIconTitle}}} }}
                               
                                newarrays?.push(obj);
                                setRestructuredItemarray(newarrays);
                                setCheckSubChilds(wrkstrm);
                                newChildarray?.push(
                                  newObj.newSubChild.newFeatChild.newActChild
                                    .newWrkChild
                                );
                                setRestructureChecked(newChildarray);
                                ArrayTest?.push(newObj);
                                activity.isRestructureActive = false;
                                wrkstrm.isRestructureActive = false;
                              }
                              if (
                                (wrkstrm.TaskType?.Id == 1 ||
                                  wrkstrm.TaskType?.Id == 3) &&
                                wrkstrm?.siteType !== items?.siteType
                              ) {
                                wrkstrm.isRestructureActive = false;
                              }
                            });
                          }
                        });
                      }
                    });
                  }
                });
              }
            } });
    } else if (items.TaskType?.Id === 3 && props?.findPage !== "ProjectOverView") {
          if (
            props?.queryItems?.Item_x0020_Type !== "Task" &&
            props?.queryItems != undefined &&
            props?.queryItems != null
          ) {
            topCompo = true;
            setQuery4TopIcon("Activity");
          }
          let newChildarray: any = []; 
          let newarrays: any = [];
          let checkPorfiloAlrt: boolean = true;
          topCompo = true;
          array?.map((obj: any) => {
            let newObj: any;
            if (
              props?.queryItems?.TaskType?.Title == "Activities" &&
              props?.queryItems != undefined &&
              props?.queryItems != null &&
              (items?.subRows?.length == 0 ||
                items?.subRows == undefined ||
                items?.subRows == null)
            ) {
              topCompo = true;
              setQuery4TopIcon("Task");
            }
            if (items?.PortfolioTypeCheck === obj.PortfolioTypeCheck && props?.projectmngmnt != "projectmngmnt") {
              if (obj.TaskType?.Id !== 2) {
                if (items?.subRows != undefined && items?.subRows?.length > 0) {
                  if (
                    props?.queryItems?.TaskType?.Title == "Activities" &&
                    props?.queryItems != undefined &&
                    props?.queryItems != null &&
                    checkPorfiloAlrt
                  ) {
                    topCompo = false;
                    alert("You are noy allowed to restructure this item");
                    checkPorfiloAlrt = false;
                  }
                  if (obj.TaskType?.Id !== 3) {
                    obj.isRestructureActive = true;
                    obj.Restructuring =
                      obj?.PortfolioTypeCheck == "Component"
                        ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"
                        : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                  }
                  if (obj.Title == "Others") {
                    obj.isRestructureActive = false;
                  }
                } else {
                  obj.isRestructureActive = true;
                  obj.Restructuring =
                    obj?.PortfolioTypeCheck == "Component"
                      ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"
                      : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";

                  if (obj.Title == "Others") {
                    obj.isRestructureActive = false;
                  }
                }
              }
              if (
                items?.Id == obj.Id &&
                items?.TaskType?.Id == obj?.TaskType?.Id &&
                items?.siteType == obj?.siteType
              ) {
                newObj = {...obj, TaskType: {Id:obj.TaskType?.Id == undefined ? "" : obj.TaskType?.Id,Title:obj.TaskType?.Title}, siteIcon:obj.SiteIconTitle === undefined? obj.SiteIcon: obj.SiteIconTitle}
                
                newChildarray?.push(newObj);
                newarrays?.push(obj);
                setRestructuredItemarray(newarrays);
                setCheckSubChilds(obj);
                setRestructureChecked(newChildarray);
                ArrayTest?.push(newObj);
                obj.isRestructureActive = false;
              }
              if (
                (obj.TaskType?.Id == 1 || obj.TaskType?.Id == 3) &&
                obj?.siteType !== items?.siteType
              ) {
                obj.isRestructureActive = false;
              }
              if (obj?.subRows?.length > 0 && obj?.subRows != undefined) {
                obj.subRows?.map((sub: any) => {
                  if (sub.TaskType?.Id !== 2) {
                    if (
                      items.subRows != undefined &&
                      items.subRows?.length > 0
                    ) {
                      if (sub.TaskType?.Id !== 3) {
                        sub.isRestructureActive = true;
                        sub.Restructuring =
                          sub?.PortfolioTypeCheck == "Component"
                            ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"
                            : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                      }
                    } else {
                      sub.isRestructureActive = true;
                      sub.Restructuring =
                        sub?.PortfolioTypeCheck == "Component"
                          ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"
                          : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                    }
                  }
                  if (items?.Id == obj.Id) {
                    sub.isRestructureActive = false;
                  }

                  if (sub.Title == "Others") {
                    sub.isRestructureActive = false;
                  }

                  if (
                    items?.Id == sub.Id &&
                    items?.TaskType?.Id == sub?.TaskType?.Id &&
                    items?.siteType == sub?.siteType
                  ) {
                    newObj = {...obj, TaskType: {Id:obj.TaskType?.Id == undefined ? "" : obj.TaskType?.Id,Title:obj.TaskType?.Title}, siteIcon:obj.SiteIconTitle === undefined? obj.SiteIcon: obj.SiteIconTitle,
                    newSubChild:{...sub, TaskType: {Id:sub.TaskType?.Id == undefined ? "" : sub.TaskType?.Id,Title:sub.TaskType?.Title}, siteIcon:sub.SiteIconTitle === undefined? sub.SiteIcon: sub.SiteIconTitle }}
                    
                    newarrays?.push(obj);
                    setRestructuredItemarray(newarrays);
                    setCheckSubChilds(sub);
                    newChildarray?.push(newObj.newSubChild);
                    setRestructureChecked(newChildarray);
                    ArrayTest?.push(newObj);
                    if (items.subRows?.length > 0) {
                      obj.isRestructureActive = false;
                    }
                    sub.isRestructureActive = false;
                  }
                  if (
                    (sub.TaskType?.Id == 1 || sub.TaskType?.Id == 3) &&
                    sub?.siteType !== items?.siteType
                  ) {
                    sub.isRestructureActive = false;
                  }

                  if (sub?.subRows?.length > 0 && sub?.subRows != undefined) {
                    sub.subRows?.map((feature: any) => {
                      if (feature.TaskType?.Id !== 2) {
                        if (
                          items.subRows != undefined &&
                          items.subRows?.length > 0
                        ) {
                          if (feature.TaskType?.Id !== 3) {
                            feature.isRestructureActive = true;
                            feature.Restructuring =
                              feature?.PortfolioTypeCheck == "Component"
                                ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"
                                : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                          }
                        } else {
                          feature.isRestructureActive = true;
                          feature.Restructuring =
                            feature?.PortfolioTypeCheck == "Component"
                              ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"
                              : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                        }
                      }
                      if (feature.Title == "Others") {
                        feature.isRestructureActive = false;
                      }

                      if (items?.Id == sub.Id) {
                        feature.isRestructureActive = false;
                      }
                      if (
                        items?.Id == feature.Id &&
                        items?.TaskType?.Id == feature?.TaskType?.Id &&
                        items?.siteType == feature?.siteType
                      ) {
                        newObj = {...obj, TaskType: {Id:obj.TaskType?.Id == undefined ? "" : obj.TaskType?.Id,Title:obj.TaskType?.Title}, siteIcon:obj.SiteIconTitle === undefined? obj.SiteIcon: obj.SiteIconTitle,
                        newSubChild:{...sub, TaskType: {Id:sub.TaskType?.Id == undefined ? "" : sub.TaskType?.Id,Title:sub.TaskType?.Title}, siteIcon:sub.SiteIconTitle === undefined? sub.SiteIcon: sub.SiteIconTitle,
                        newFeatChild : {...feature, TaskType: {Id:feature.TaskType?.Id == undefined ? "" : feature.TaskType?.Id,Title:feature.TaskType?.Title}, siteIcon:feature.SiteIconTitle === undefined? feature.SiteIcon: feature.SiteIconTitle} }}
                        
                        newarrays?.push(obj);
                        setRestructuredItemarray(newarrays);
                        setCheckSubChilds(feature);
                        newChildarray?.push(newObj.newSubChild.newFeatChild);
                        setRestructureChecked(newChildarray);
                        ArrayTest?.push(newObj);
                        if (items.subRows?.length > 0) {
                          sub.isRestructureActive = false;
                        }
                        feature.isRestructureActive = false;
                      }
                      if (
                        (feature.TaskType?.Id == 1 ||
                          feature.TaskType?.Id == 3) &&
                        feature?.siteType !== items?.siteType
                      ) {
                        feature.isRestructureActive = false;
                      }
                      if (
                        feature?.subRows?.length > 0 &&
                        feature?.subRows != undefined
                      ) {
                        feature.subRows?.map((activity: any) => {
                          if (activity.TaskType?.Id !== 2) {
                            if (
                              items.subRows != undefined &&
                              items.subRows?.length > 0
                            ) {
                              if (activity.TaskType?.Id !== 3) {
                                activity.isRestructureActive = true;
                                activity.Restructuring =
                                  activity?.PortfolioTypeCheck == "Component"
                                    ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"
                                    : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                              }
                            } else {
                              activity.isRestructureActive = true;
                              activity.Restructuring =
                                activity?.PortfolioTypeCheck == "Component"
                                  ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"
                                  : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                            }
                          }
                          if (activity.Title == "Others") {
                            activity.isRestructureActive = false;
                          }
                          if (items?.Id == feature.Id) {
                            activity.isRestructureActive = false;
                          }
                          if (
                            items?.Id == activity.Id &&
                            items?.TaskType?.Id == activity?.TaskType?.Id &&
                            items?.siteType == activity?.siteType
                          ) {
                            newObj = {...obj, TaskType: {Id:obj.TaskType?.Id == undefined ? "" : obj.TaskType?.Id,Title:obj.TaskType?.Title}, siteIcon:obj.SiteIconTitle === undefined? obj.SiteIcon: obj.SiteIconTitle,
                            newSubChild:{...sub, TaskType: {Id:sub.TaskType?.Id == undefined ? "" : sub.TaskType?.Id,Title:sub.TaskType?.Title}, siteIcon:sub.SiteIconTitle === undefined? sub.SiteIcon: sub.SiteIconTitle,
                            newFeatChild : {...feature, TaskType: {Id:feature.TaskType?.Id == undefined ? "" : feature.TaskType?.Id,Title:feature.TaskType?.Title}, siteIcon:feature.SiteIconTitle === undefined? feature.SiteIcon: feature.SiteIconTitle,
                            newActChild : {...activity, TaskType: {Id:activity.TaskType?.Id == undefined ? "" : activity.TaskType?.Id,Title:activity.TaskType?.Title}, siteIcon:activity.SiteIconTitle === undefined? activity.SiteIcon: activity.SiteIconTitle}} }}
                            
                            newarrays?.push(obj);
                            setRestructuredItemarray(newarrays);
                            setCheckSubChilds(activity);
                            newChildarray?.push(
                              newObj.newSubChild.newFeatChild.newActChild
                            );
                            setRestructureChecked(newChildarray);
                            ArrayTest?.push(newObj);
                            if (items.subRows?.length > 0) {
                              feature.isRestructureActive = false;
                            }
                            activity.isRestructureActive = false;
                          }
                          if (
                            (activity.TaskType?.Id == 1 ||
                              activity.TaskType?.Id == 3) &&
                            activity?.siteType !== items?.siteType
                          ) {
                            activity.isRestructureActive = false;
                          }

                          if (
                            activity?.subRows?.length > 0 &&
                            activity?.subRows != undefined
                          ) {
                            activity.subRows?.map((wrkstrm: any) => {
                              if (wrkstrm.TaskType?.Id !== 2) {
                                if (
                                  items.subRows != undefined &&
                                  items.subRows?.length > 0
                                ) {
                                  if (wrkstrm.TaskType?.Id !== 3) {
                                    wrkstrm.isRestructureActive = true;
                                    wrkstrm.Restructuring =
                                      wrkstrm?.PortfolioTypeCheck == "Component"
                                        ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"
                                        : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                                  }
                                } else {
                                  wrkstrm.isRestructureActive = true;
                                  wrkstrm.Restructuring =
                                    wrkstrm?.PortfolioTypeCheck == "Component"
                                      ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"
                                      : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                                }
                              }
                              if (wrkstrm.Title == "Others") {
                                wrkstrm.isRestructureActive = false;
                              }

                              if (items?.Id == activity.Id) {
                                wrkstrm.isRestructureActive = false;
                              }
                              if (
                                items?.Id == wrkstrm.Id &&
                                items?.TaskType?.Id == wrkstrm?.TaskType?.Id &&
                                items?.siteType == wrkstrm?.siteType
                              ) {
                                newObj = {...obj, TaskType: {Id:obj.TaskType?.Id == undefined ? "" : obj.TaskType?.Id,Title:obj.TaskType?.Title}, siteIcon:obj.SiteIconTitle === undefined? obj.SiteIcon: obj.SiteIconTitle,
                                newSubChild:{...sub, TaskType: {Id:sub.TaskType?.Id == undefined ? "" : sub.TaskType?.Id,Title:sub.TaskType?.Title}, siteIcon:sub.SiteIconTitle === undefined? sub.SiteIcon: sub.SiteIconTitle,
                                newFeatChild : {...feature, TaskType: {Id:feature.TaskType?.Id == undefined ? "" : feature.TaskType?.Id,Title:feature.TaskType?.Title}, siteIcon:feature.SiteIconTitle === undefined? feature.SiteIcon: feature.SiteIconTitle,
                                newActChild : {...activity, TaskType: {Id:activity.TaskType?.Id == undefined ? "" : activity.TaskType?.Id,Title:activity.TaskType?.Title}, siteIcon:activity.SiteIconTitle === undefined? activity.SiteIcon: activity.SiteIconTitle,
                                newWrkChild:{...wrkstrm, TaskType: {Id:wrkstrm.TaskType?.Id == undefined ? "" : wrkstrm.TaskType?.Id,Title:wrkstrm.TaskType?.Title}, siteIcon:wrkstrm.SiteIconTitle === undefined? wrkstrm.SiteIcon: wrkstrm.SiteIconTitle}}} }}
                                
                                newarrays?.push(obj);
                                setRestructuredItemarray(newarrays);
                                setCheckSubChilds(wrkstrm);
                                newChildarray?.push(
                                  newObj.newSubChild.newFeatChild.newActChild
                                    .newWrkChild
                                );
                                setRestructureChecked(newChildarray);
                                ArrayTest?.push(newObj);
                                if (items.subRows?.length > 0) {
                                  activity.isRestructureActive = false;
                                }

                                wrkstrm.isRestructureActive = false;
                              }
                              if (
                                (wrkstrm.TaskType?.Id == 1 ||
                                  wrkstrm.TaskType?.Id == 3) &&
                                wrkstrm?.siteType !== items?.siteType
                              ) {
                                wrkstrm.isRestructureActive = false;
                              }
                            });
                          }
                        });
                      }
                    });
                  }
                });
              }
            } });
        } else if (items.TaskType?.Id === 2 && props?.findPage !== "ProjectOverView") {
          if (
            props?.queryItems?.Item_x0020_Type !== "Task" &&
            props?.queryItems != undefined &&
            props?.queryItems != null
          ) {
            topCompo = true;
            setQuery4TopIcon("Activity");
          }
          if (props?.queryItems?.TaskType?.Title === "Activities") {
            topCompo = true;
            setQuery4TopIcon("Workstream");
          }
          if (props?.queryItems?.TaskType?.Title === "Workstream") {
            alert("You are not allowed to restructure this item");
          }
          let newChildarray: any = [];
          let newarrays: any = [];
          topCompo = true;
          array?.map((obj: any) => {
            let newObj: any;
            if (items?.PortfolioTypeCheck === obj.PortfolioTypeCheck && props?.projectmngmnt != "projectmngmnt") {
              if (obj.TaskType?.Id !== 2) {
                obj.isRestructureActive = true;
                obj.Restructuring =
                  obj?.PortfolioTypeCheck == "Component"
                    ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"
                    : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
              }
              if (obj.Title == "Others") {
                obj.isRestructureActive = false;
              }
              if (
                items?.Id == obj.Id &&
                items?.TaskType?.Id == obj?.TaskType?.Id &&
                items?.siteType == obj?.siteType
              ) {
                newObj = {...obj, TaskType: {Id:obj.TaskType?.Id == undefined ? "" : obj.TaskType?.Id,Title:obj.TaskType?.Title}, siteIcon:obj.SiteIconTitle === undefined? obj.SiteIcon: obj.SiteIconTitle}
                
                newChildarray?.push(newObj);
                newarrays?.push(obj);
                setRestructuredItemarray(newarrays);
                setCheckSubChilds(obj);
                setRestructureChecked(newChildarray);
                ArrayTest?.push(newObj);
                obj.isRestructureActive = false;
              }
              if (
                (obj.TaskType?.Id == 1 || obj.TaskType?.Id == 3) &&
                obj?.siteType !== items?.siteType
              ) {
                obj.isRestructureActive = false;
              }
              if (obj?.subRows?.length > 0 && obj?.subRows != undefined) {
                obj.subRows?.map((sub: any) => {
                  if (sub.TaskType?.Id !== 2) {
                    sub.isRestructureActive = true;
                    sub.Restructuring =
                      sub?.PortfolioTypeCheck == "Component"
                        ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"
                        : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                  }
                  if (sub.Title == "Others") {
                    sub.isRestructureActive = false;
                  }
                  if (
                    items?.Id == sub.Id &&
                    items?.TaskType?.Id == sub?.TaskType?.Id &&
                    items?.siteType == sub?.siteType
                  ) {
                  newObj = {...obj, TaskType: {Id:obj.TaskType?.Id == undefined ? "" : obj.TaskType?.Id,Title:obj.TaskType?.Title}, siteIcon:obj.SiteIconTitle === undefined? obj.SiteIcon: obj.SiteIconTitle,
                  newSubChild:{...sub, TaskType: {Id:sub.TaskType?.Id == undefined ? "" : sub.TaskType?.Id,Title:sub.TaskType?.Title}, siteIcon:sub.SiteIconTitle === undefined? sub.SiteIcon: sub.SiteIconTitle}}
                  
                    setCheckSubChilds(sub);
                    newarrays?.push(obj);
                    setRestructuredItemarray(newarrays);
                    newChildarray?.push(newObj.newSubChild);
                    setRestructureChecked(newChildarray);
                    ArrayTest?.push(newObj);
                    sub.isRestructureActive = false;
                    if (obj.TaskType?.Id === 3) {
                      obj.isRestructureActive = false;
                    }
                  }
                  if (
                    (sub.TaskType?.Id == 1 || sub.TaskType?.Id == 3) &&
                    sub?.siteType !== items?.siteType
                  ) {
                    sub.isRestructureActive = false;
                  }

                  if (sub?.subRows?.length > 0 && sub?.subRows != undefined) {
                    sub.subRows?.map((feature: any) => {
                      if (feature.TaskType?.Id !== 2) {
                        feature.isRestructureActive = true;
                        feature.Restructuring =
                          feature?.PortfolioTypeCheck == "Component"
                            ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"
                            : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                      }
                      if (feature.Title == "Others") {
                        feature.isRestructureActive = false;
                      }
                      if (
                        items?.Id == feature.Id &&
                        items?.TaskType?.Id == feature?.TaskType?.Id &&
                        items?.siteType == feature?.siteType
                      ) {
                        newObj = {...obj, TaskType: {Id:obj.TaskType?.Id == undefined ? "" : obj.TaskType?.Id,Title:obj.TaskType?.Title}, siteIcon:obj.SiteIconTitle === undefined? obj.SiteIcon: obj.SiteIconTitle,
                        newSubChild:{...sub, TaskType: {Id:sub.TaskType?.Id == undefined ? "" : sub.TaskType?.Id,Title:sub.TaskType?.Title}, siteIcon:sub.SiteIconTitle === undefined? sub.SiteIcon: sub.SiteIconTitle,
                        newFeatChild : {...feature, TaskType: {Id:feature.TaskType?.Id == undefined ? "" : feature.TaskType?.Id,Title:feature.TaskType?.Title}, siteIcon:feature.SiteIconTitle === undefined? feature.SiteIcon: feature.SiteIconTitle} }}
                        
                        setCheckSubChilds(feature);
                        newarrays?.push(obj);
                        setRestructuredItemarray(newarrays);
                        newChildarray?.push(newObj.newSubChild.newFeatChild);
                        setRestructureChecked(newChildarray);
                        ArrayTest?.push(newObj);
                        feature.isRestructureActive = false;
                        if (sub.TaskType?.Id === 3) {
                          sub.isRestructureActive = false;
                        }
                      }
                      if (
                        (feature.TaskType?.Id == 1 ||
                          feature.TaskType?.Id == 3) &&
                        feature?.siteType !== items?.siteType
                      ) {
                        feature.isRestructureActive = false;
                      }
                      if (
                        feature?.subRows?.length > 0 &&
                        feature?.subRows != undefined
                      ) {
                        feature.subRows?.map((activity: any) => {
                          if (activity.TaskType?.Id !== 2) {
                            activity.isRestructureActive = true;
                            activity.Restructuring =
                              activity?.PortfolioTypeCheck == "Component"
                                ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"
                                : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                          }
                          if (activity.Title == "Others") {
                            activity.isRestructureActive = false;
                          }
                          if (
                            items?.Id == activity.Id &&
                            items?.TaskType?.Id == activity?.TaskType?.Id &&
                            items?.siteType == activity?.siteType
                          ) {
                            newObj = {...obj, TaskType: {Id:obj.TaskType?.Id == undefined ? "" : obj.TaskType?.Id,Title:obj.TaskType?.Title}, siteIcon:obj.SiteIconTitle === undefined? obj.SiteIcon: obj.SiteIconTitle,
                            newSubChild:{...sub, TaskType: {Id:sub.TaskType?.Id == undefined ? "" : sub.TaskType?.Id,Title:sub.TaskType?.Title}, siteIcon:sub.SiteIconTitle === undefined? sub.SiteIcon: sub.SiteIconTitle,
                            newFeatChild : {...feature, TaskType: {Id:feature.TaskType?.Id == undefined ? "" : feature.TaskType?.Id,Title:feature.TaskType?.Title}, siteIcon:feature.SiteIconTitle === undefined? feature.SiteIcon: feature.SiteIconTitle,
                            newActChild : {...activity, TaskType: {Id:activity.TaskType?.Id == undefined ? "" : activity.TaskType?.Id,Title:activity.TaskType?.Title}, siteIcon:activity.SiteIconTitle === undefined? activity.SiteIcon: activity.SiteIconTitle}} }}
                            
                            newarrays?.push(obj);
                            setRestructuredItemarray(newarrays);
                            setCheckSubChilds(activity);
                            newChildarray?.push(
                              newObj.newSubChild.newFeatChild.newActChild
                            );
                            setRestructureChecked(newChildarray);
                            ArrayTest?.push(newObj);
                            activity.isRestructureActive = false;
                            if (feature.TaskType?.Id === 3) {
                              feature.isRestructureActive = false;
                            }
                          }
                          if (
                            (activity.TaskType?.Id == 1 ||
                              activity.TaskType?.Id == 3) &&
                            activity?.siteType !== items?.siteType
                          ) {
                            activity.isRestructureActive = false;
                          }

                          if (
                            activity?.subRows?.length > 0 &&
                            activity?.subRows != undefined
                          ) {
                            activity.subRows?.map((wrkstrm: any) => {
                              if (wrkstrm.TaskType?.Id !== 2) {
                                wrkstrm.isRestructureActive = true;
                                wrkstrm.Restructuring =
                                  wrkstrm?.PortfolioTypeCheck == "Component"
                                    ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"
                                    : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                              }
                              if (wrkstrm.Title == "Others") {
                                wrkstrm.isRestructureActive = false;
                              }
                              if (
                                items?.Id == wrkstrm.Id &&
                                items?.TaskType?.Id == wrkstrm?.TaskType?.Id &&
                                items?.siteType == wrkstrm?.siteType
                              ) {
                                newObj = {...obj, TaskType: {Id:obj.TaskType?.Id == undefined ? "" : obj.TaskType?.Id,Title:obj.TaskType?.Title}, siteIcon:obj.SiteIconTitle === undefined? obj.SiteIcon: obj.SiteIconTitle,
                                newSubChild:{...sub, TaskType: {Id:sub.TaskType?.Id == undefined ? "" : sub.TaskType?.Id,Title:sub.TaskType?.Title}, siteIcon:sub.SiteIconTitle === undefined? sub.SiteIcon: sub.SiteIconTitle,
                                newFeatChild : {...feature, TaskType: {Id:feature.TaskType?.Id == undefined ? "" : feature.TaskType?.Id,Title:feature.TaskType?.Title}, siteIcon:feature.SiteIconTitle === undefined? feature.SiteIcon: feature.SiteIconTitle,
                                newActChild : {...activity, TaskType: {Id:activity.TaskType?.Id == undefined ? "" : activity.TaskType?.Id,Title:activity.TaskType?.Title}, siteIcon:activity.SiteIconTitle === undefined? activity.SiteIcon: activity.SiteIconTitle,
                                newWrkChild:{...wrkstrm, TaskType: {Id:wrkstrm.TaskType?.Id == undefined ? "" : wrkstrm.TaskType?.Id,Title:wrkstrm.TaskType?.Title}, siteIcon:wrkstrm.SiteIconTitle === undefined? wrkstrm.SiteIcon: wrkstrm.SiteIconTitle}}} }}
                                
                                newarrays?.push(obj);
                                setRestructuredItemarray(newarrays);
                                setCheckSubChilds(wrkstrm);
                                newChildarray?.push(
                                  newObj.newSubChild.newFeatChild.newActChild
                                    .newWrkChild
                                );
                                setRestructureChecked(newChildarray);
                                ArrayTest?.push(newObj);
                                wrkstrm.isRestructureActive = false;
                                if (wrkstrm.TaskType?.Id === 3) {
                                  wrkstrm.isRestructureActive = false;
                                }
                              }
                              if (
                                (wrkstrm.TaskType?.Id == 1 ||
                                  wrkstrm.TaskType?.Id == 3) &&
                                wrkstrm?.siteType !== items?.siteType
                              ) {
                                wrkstrm.isRestructureActive = false;
                              }
                              if (
                                wrkstrm?.subRows?.length > 0 &&
                                wrkstrm?.subRows != undefined
                              ) {
                                wrkstrm.subRows?.map((task: any) => {
                                  if (task.TaskType?.Id !== 2) {
                                    task.isRestructureActive = true;
                                    task.Restructuring =
                                      task?.PortfolioTypeCheck == "Component"
                                        ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"
                                        : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                                  }
                                  if (task.Title == "Others") {
                                    task.isRestructureActive = false;
                                  }
                                  if (
                                    items?.Id == task.Id &&
                                    items?.TaskType?.Id == task?.TaskType?.Id &&
                                    items?.siteType == task?.siteType
                                  ) {
                                    newObj = {...obj, TaskType: {Id:obj.TaskType?.Id == undefined ? "" : obj.TaskType?.Id,Title:obj.TaskType?.Title}, siteIcon:obj.SiteIconTitle === undefined? obj.SiteIcon: obj.SiteIconTitle,
                                    newSubChild:{...sub, TaskType: {Id:sub.TaskType?.Id == undefined ? "" : sub.TaskType?.Id,Title:sub.TaskType?.Title}, siteIcon:sub.SiteIconTitle === undefined? sub.SiteIcon: sub.SiteIconTitle,
                                    newFeatChild : {...feature, TaskType: {Id:feature.TaskType?.Id == undefined ? "" : feature.TaskType?.Id,Title:feature.TaskType?.Title}, siteIcon:feature.SiteIconTitle === undefined? feature.SiteIcon: feature.SiteIconTitle,
                                    newActChild : {...activity, TaskType: {Id:activity.TaskType?.Id == undefined ? "" : activity.TaskType?.Id,Title:activity.TaskType?.Title}, siteIcon:activity.SiteIconTitle === undefined? activity.SiteIcon: activity.SiteIconTitle,
                                    newWrkChild:{...wrkstrm, TaskType: {Id:wrkstrm.TaskType?.Id == undefined ? "" : wrkstrm.TaskType?.Id,Title:wrkstrm.TaskType?.Title}, siteIcon:wrkstrm.SiteIconTitle === undefined? wrkstrm.SiteIcon: wrkstrm.SiteIconTitle,
                                    newTskChild:{...task, TaskType: {Id:task.TaskType?.Id == undefined ? "" : task.TaskType?.Id,Title:task.TaskType?.Title}, siteIcon:task.SiteIconTitle === undefined? task.SiteIcon: task.SiteIconTitle}}}} }}
                                    
                                    newarrays?.push(obj);
                                    setRestructuredItemarray(newarrays);
                                    setCheckSubChilds(task);
                                    newChildarray?.push(
                                      newObj.newSubChild.newFeatChild
                                        .newActChild.newWrkChild.newTskChild
                                    );
                                    setRestructureChecked(newChildarray);
                                    ArrayTest?.push(newObj);
                                    task.isRestructureActive = false;
                                    if (wrkstrm.TaskType?.Id === 3) {
                                      wrkstrm.isRestructureActive = false;
                                    }
                                  }
                                  if (
                                    (task.TaskType?.Id == 1 ||
                                      task.TaskType?.Id == 3) &&
                                    task?.siteType !== items?.siteType
                                  ) {
                                    task.isRestructureActive = false;
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
            }});
        } else if (items?.Item_x0020_Type === "Sprint" && props?.projectmngmnt !== "projectmngmnt" && props?.findPage !== "ProjectOverView") {
          let newarrays: any = [];
          let newObj: any;
          let newChildarray: any = [];
          array?.map((obj: any) => {
            obj.isRestructureActive = true;
            obj?.subRows != undefined &&
              obj?.subRows != null &&
              obj?.subRows?.length > 0 &&
              obj?.subRows?.map((sub: any) => {
                if (sub?.Title == items?.Title && sub?.Id == items?.Id) {
                  newObj = {...obj,
                  newSubChild:{...sub }}
                  
                  obj.isRestructureActive = false;
                  newarrays?.push(obj);
                  topCompo = true;
                  setRestructuredItemarray(newarrays);
                  newChildarray?.push(newObj.newSubChild);
                  setRestructureChecked(newChildarray);
                  ArrayTest?.push(newObj);
                }
              });
          });
        } else if (items?.Item_x0020_Type === "Project" && props?.projectmngmnt !== "projectmngmnt" && props?.findPage !== "ProjectOverView") {
          let newarrays: any = [];
          let newObj: any;
          let newChildarray: any = [];
          if (items?.subRows != undefined && items?.subRows != null && items?.subRows?.length > 0) {
            alert("You are not allowed to restructure this item.");
          } else {
            array?.map((obj: any) => {
              if (obj?.Title == items?.Title && obj?.Id == items?.Id) {
                newObj = {...obj}
                newarrays?.push(obj);
                topCompo = false;
                obj.isRestructureActive = false;
                setRestructuredItemarray(newarrays);
                newChildarray?.push(newObj);
                setRestructureChecked(newChildarray);
                ArrayTest?.push(newObj);
              } else {
                obj.isRestructureActive = true;
              }
            });
          }
        }else if(props?.findPage == "ProjectOverView"){
          if (items?.Item_x0020_Type === "Project") {
            let newarrays: any = [];
            let newObj: any;
            let newChildarray: any = [];
            if (items?.subRows != undefined && items?.subRows != null && items?.subRows?.length > 0) {
              alert("You are not allowed to restructure this item.");
            } else {
              array?.map((obj: any) => {
                if (obj?.Title == items?.Title && obj?.Id == items?.Id) {
                  newObj = {...obj}
                  
                  newarrays?.push(obj);
                  topCompo = false;
                  obj.isRestructureActive = false;
                  setRestructuredItemarray(newarrays);
                  newChildarray?.push(newObj);
                  setRestructureChecked(newChildarray);
                  ArrayTest?.push(newObj);
                } else {
                  obj.isRestructureActive = true;
                }
              });
            }
          }else if (items?.Item_x0020_Type === "Sprint") {
            let newarrays: any = [];
            let newObj: any;
            let newChildarray: any = [];
            array?.map((obj: any) => {
              obj.isRestructureActive = true;
              obj?.subRows != undefined &&
                obj?.subRows != null &&
                obj?.subRows?.length > 0 &&
                obj?.subRows?.map((sub: any) => {
                  if (sub?.Title == items?.Title && sub?.Id == items?.Id) {
                    newObj = {...obj,
                    newSubChild:{...sub }}
                    obj.isRestructureActive = false;
                    newarrays?.push(obj);
                    topCompo = true;
                    setRestructuredItemarray(newarrays);
                    newChildarray?.push(newObj.newSubChild);
                    setRestructureChecked(newChildarray);
                    ArrayTest?.push(newObj);
                  }
                });
            });
          }else if (items?.TaskType?.Id === 1) {
            let newarrays: any = [];
            let newObj: any;
            let newChildarray: any = [];
            array?.map((obj: any) => {
              obj.isRestructureActive = true;
              obj?.subRows != undefined &&
                obj?.subRows != null &&
                obj?.subRows?.length > 0 &&
                obj?.subRows?.map((sub: any) => {
                  if(sub?.Item_x0020_Type === "Sprint"){
                    sub.isRestructureActive = true;
                  }
                  if (sub?.Title == items?.Title && sub?.Id == items?.Id) {
                    newObj = {...obj, newSubChild:{...sub}}
                    obj.isRestructureActive = false;
                    newarrays?.push(obj);
                    topCompo = false;
                    setRestructuredItemarray(newarrays);
                    newChildarray?.push(newObj.newSubChild);
                    setRestructureChecked(newChildarray);
                    ArrayTest?.push(newObj);
                  }
                  sub?.subRows != undefined &&
                  sub?.subRows != null &&
                  sub?.subRows?.length > 0 &&
                  sub?.subRows?.map((feature: any) => {
                    if (feature?.Title == items?.Title && feature?.Id == items?.Id) {
                      sub.isRestructureActive = false;
                      newObj = {...obj, newSubChild:{...sub ,newFeatChild:{...feature}}}
                      newarrays?.push(obj);
                      topCompo = false;
                      setRestructuredItemarray(newarrays);
                      newChildarray?.push(newObj.newSubChild.newFeatChild);
                      setRestructureChecked(newChildarray);
                      ArrayTest?.push(newObj);
                    }
                  })

                 
                });
            });
          }else if (items?.TaskType?.Id === 3) {
            let newarrays: any = [];
            let newObj: any;
            let newChildarray: any = [];
            array?.map((obj: any) => {
              obj.isRestructureActive = true;
              obj?.subRows != undefined &&
                obj?.subRows != null &&
                obj?.subRows?.length > 0 &&
                obj?.subRows?.map((sub: any) => {
                  if(sub?.Item_x0020_Type === "Sprint" || sub?.TaskType?.Id === 1){
                    sub.isRestructureActive = true;
                  }
                  if (sub?.Title == items?.Title && sub?.Id == items?.Id) {
                    obj.isRestructureActive = false;
                    newObj = {...obj, newSubChild:{...sub}}
                    newarrays?.push(obj);
                    topCompo = false;
                    setRestructuredItemarray(newarrays);
                    newChildarray?.push(newObj.newSubChild);
                    setRestructureChecked(newChildarray);
                    ArrayTest?.push(newObj);
                  }
                  sub?.subRows != undefined &&
                  sub?.subRows != null &&
                  sub?.subRows?.length > 0 &&
                  sub?.subRows?.map((feature: any) => {
                    if(feature?.TaskType?.Id === 1){
                      feature.isRestructureActive = true;
                    }
                    if (feature?.Title == items?.Title && feature?.Id == items?.Id) {
                      newObj = {...obj, newSubChild:{...sub ,newFeatChild:{...feature}}}
                      newarrays?.push(obj);
                      sub.isRestructureActive = false;
                      topCompo = false;
                      setRestructuredItemarray(newarrays);
                      newChildarray?.push(newObj?.newSubChild?.newFeatChild);
                      setRestructureChecked(newChildarray);
                      ArrayTest?.push(newObj);
                    }
                    feature?.subRows != undefined &&
                    feature?.subRows != null &&
                    feature?.subRows?.length > 0 &&
                    feature?.subRows?.map((wrkstrm: any) => {
                      if (wrkstrm?.Title == items?.Title && wrkstrm?.Id == items?.Id) {
                        newObj = {...obj, newSubChild:{...sub ,newFeatChild:{...feature, newActChild : {...wrkstrm}}}}
                        newarrays?.push(obj);
                        feature.isRestructureActive = false;
                        topCompo = false;
                        setRestructuredItemarray(newarrays);
                        newChildarray?.push(newObj?.newSubChild?.newFeatChild.newActChild);
                        setRestructureChecked(newChildarray);
                        ArrayTest?.push(newObj);
                      }
                    })
                  })
                });
            });
          }else if (items?.TaskType?.Id === 2) {
            let newarrays: any = [];
            let newObj: any;
            let newChildarray: any = [];
            array?.map((obj: any) => {
              obj.isRestructureActive = true;
              obj?.subRows != undefined &&
                obj?.subRows != null &&
                obj?.subRows?.length > 0 &&
                obj?.subRows?.map((sub: any) => {
                  if(sub?.Item_x0020_Type === "Sprint" || sub?.TaskType?.Id === 1 || sub?.TaskType?.Id === 3){
                    sub.isRestructureActive = true;
                  }
                  if (sub?.Title == items?.Title && sub?.Id == items?.Id) {
                    newObj = {...obj, newSubChild:{...sub}}
                    obj.isRestructureActive = false;
                    newarrays?.push(obj);
                    topCompo = false;
                    setRestructuredItemarray(newarrays);
                    newChildarray?.push(newObj.newSubChild);
                    setRestructureChecked(newChildarray);
                    ArrayTest?.push(newObj);
                  }
                  sub?.subRows != undefined &&
                  sub?.subRows != null &&
                  sub?.subRows?.length > 0 &&
                  sub?.subRows?.map((feature: any) => {
                    if(feature?.TaskType?.Id === 1 || feature?.TaskType?.Id === 3){
                      feature.isRestructureActive = true;
                    }
                    if (feature?.Title == items?.Title && feature?.Id == items?.Id) {
                      newObj = {...obj, newSubChild:{...sub ,newFeatChild:{...feature}}}
                      newarrays?.push(obj);
                      sub.isRestructureActive = false;
                      topCompo = false;
                      setRestructuredItemarray(newarrays);
                      newChildarray?.push(newObj?.newSubChild?.newFeatChild);
                      setRestructureChecked(newChildarray);
                      ArrayTest?.push(newObj);
                    }
                    feature?.subRows != undefined &&
                    feature?.subRows != null &&
                    feature?.subRows?.length > 0 &&
                    feature?.subRows?.map((wrkstrm: any) => {
                      if(wrkstrm?.TaskType?.Id === 3){
                        wrkstrm.isRestructureActive = true;
                      }
                      if (wrkstrm?.Title == items?.Title && wrkstrm?.Id == items?.Id) {
                        newObj = {...obj, newSubChild:{...sub ,newFeatChild:{...feature, newActChild : {...wrkstrm}}}}
                        newarrays?.push(obj);
                        feature.isRestructureActive = false;
                        topCompo = false;
                        setRestructuredItemarray(newarrays);
                        newChildarray?.push(newObj?.newSubChild?.newFeatChild.newActChild);
                        setRestructureChecked(newChildarray);
                        ArrayTest?.push(newObj);
                      }
                      wrkstrm?.subRows != undefined &&
                    wrkstrm?.subRows != null &&
                    wrkstrm?.subRows?.length > 0 &&
                    wrkstrm?.subRows?.map((task: any) => {
                      if (task?.Title == items?.Title && task?.Id == items?.Id) {
                        newObj = {...obj, newSubChild:{...sub ,newFeatChild:{...feature, newActChild : {...wrkstrm,newWrkChild:{...task} }}}}
                        newarrays?.push(obj);
                        topCompo = false;
                        wrkstrm.isRestructureActive = false;
                        setRestructuredItemarray(newarrays);
                        newChildarray?.push(newObj?.newSubChild?.newFeatChild.newActChild.newWrkChild);
                        setRestructureChecked(newChildarray);
                        ArrayTest?.push(newObj);
                      }
                    })
                    })
                  })
                });
            });
          }
        }
      });

      setCheckItemLength(true);
      setOldArrayBackup(ArrayTest);
      restructureCallBack(array, topCompo);
    }
  };

  const makeMultiSameTask = async () => {
    if (restructureItem[0]?.Item_x0020_Type == "Task") {
      let ParentTask_Portfolio: any =
        newItemBackUp?.Item_x0020_Type == "Task"
          ? newItemBackUp?.Portfolio?.Id
          : newItemBackUp?.Id;
      let ParentTask_ID: any =
        newItemBackUp?.Item_x0020_Type == "Task" ? newItemBackUp?.Id : null;
      let TaskId =
        newItemBackUp?.TaskID == undefined ? null : newItemBackUp?.TaskID;
      let TaskLevel: number = 0;
      let Level: number = 0;
      if (
        newItemBackUp?.subRows != undefined &&
        newItemBackUp?.subRows?.length > 0 &&
        restructureItem[0]?.TaskType?.Id == 3
      ) {
        newItemBackUp?.subRows?.map((sub: any) => {
          if (restructureItem[0]?.TaskType?.Id === sub?.TaskType?.Id) {
            if (TaskLevel <= sub.TaskLevel) {
              TaskLevel = sub.TaskLevel;
              Level = sub.TaskLevel;
            }
          }
        });
      }
      let array: any = [...allData];
      let count: number = 0;

      let activityCount = 0;

      restructureItem?.map(async (items: any, index: any) => {
        let TaskId =
          newItemBackUp?.TaskID == undefined ? null : newItemBackUp?.TaskID;
        TaskLevel = TaskLevel + 1;

        if (RestructureChecked[0]?.TaskType?.Id === 1) {
          // ParentTask_Id = null;
          let web = new Web(items?.siteUrl);
          await web.lists
            .getById(items?.listId)
            .items.select("Id,Title,TaskType/Id,TaskType/Title,TaskLevel")
            .expand("TaskType")
            .orderBy("TaskLevel", false).filter("TaskType/Id eq 1").top(1).get()
            .then((componentDetails: any) => {
              if (componentDetails?.length == 0) {
                var LatestId: any = 1;
                TaskLevel = LatestId;
                LatestId = LatestId + activityCount;
                TaskId = "A" + LatestId;
                activityCount = activityCount + 1;
              } else {
                var LatestId = componentDetails[0].TaskLevel + 1;
                TaskLevel = LatestId;
                LatestId = LatestId + activityCount;
                TaskId = "A" + LatestId;
                activityCount = activityCount + 1;
              }
              items.TaskID = TaskId;
            })
            .catch((err: any) => {
              console.log(err);
            });
        }

        let web = new Web(items.siteUrl);
        TaskId =
          RestructureChecked[0]?.TaskType?.Id == 2
            ? "T" + items?.Id
            : RestructureChecked[0]?.TaskType?.Id == 1
            ? items?.TaskID
            : TaskId + "-" + "W" + TaskLevel;

        if (newItemBackUp?.Item_x0020_Type != "Task") {
          ParentTask_ID = null;
          ParentTask_Portfolio = {
            Id: newItemBackUp?.Id,
            ItemType: newItemBackUp?.Item_x0020_Type,
            PortfolioStructureID: newItemBackUp?.PortfolioStructureID,
            Title: newItemBackUp?.Title,
          };
        } else {
          (ParentTask_Portfolio = {
            Id: newItemBackUp?.Portfolio?.Id,
            ItemType: newItemBackUp?.Portfolio?.ItemType,
            PortfolioStructureID:
              newItemBackUp?.Portfolio?.PortfolioStructureID,
            Title: newItemBackUp?.Portfolio?.Title,
          }),
            (ParentTask_ID = {
              Id: newItemBackUp?.Id,
              Title: newItemBackUp?.Title,
              TaskID: newItemBackUp?.TaskID,
            });
        }

        var postData: any = {
          ParentTaskId: ParentTask_ID == null ? null : ParentTask_ID.Id,
          PortfolioId: ParentTask_Portfolio.Id,
          TaskLevel: TaskLevel,
          TaskTypeId: RestructureChecked[0]?.TaskType.Id,
          TaskID: TaskId,
        };

        await web.lists
          .getById(items.listId)
          .items.getById(items.Id)
          .update(postData)
          .then(async (res: any) => {
            let TaskId =
              newItemBackUp?.TaskID == undefined ? null : newItemBackUp?.TaskID;

            count = count + 1;
            let backupCheckedList: any = [];
            let latestCheckedList: any = [];

            latestCheckedList?.push({ ...items });
            backupCheckedList?.push({ ...items });

            latestCheckedList?.map((itemss: any) => {
              Level = Level + 1;
              (itemss.ParentTask = { Id: ParentTask_ID }),
                (itemss.TaskLevel = Level),
                (itemss.TaskTypeId = RestructureChecked[0]?.TaskType.Id),
                (itemss.TaskID =
                  RestructureChecked[0]?.TaskType?.Id == 2
                    ? "T" + itemss?.Id
                    : RestructureChecked[0]?.TaskType?.Id == 1
                    ? itemss?.TaskID
                    : TaskId + "-" + "W" + Level);
              itemss.Portfolio = ParentTask_Portfolio;
            });

            function processArray(arr: any, pushData: any, spliceData: any) {
              arr?.map((obj: any, index: any) => {
                if (!spliceData || !pushData) {
                  obj.isRestructureActive = false;

                  if (
                    !spliceData &&
                    obj.Id === backupCheckedList[0]?.Id &&
                    obj.Item_x0020_Type ===
                      backupCheckedList[0]?.Item_x0020_Type &&
                    obj.TaskType?.Title ===
                      backupCheckedList[0]?.TaskType?.Title &&
                    obj.Portfolio?.Id == backupCheckedList[0]?.Portfolio?.Id &&
                    obj.ParentTask?.Id == backupCheckedList[0]?.ParentTask?.Id
                  ) {
                    arr.splice(index, 1);
                    spliceData = true;
                  }

                  if (
                    !pushData &&
                    obj.Id === newItemBackUp?.Id &&
                    obj.Item_x0020_Type === newItemBackUp?.Item_x0020_Type &&
                    obj.TaskType?.Title === newItemBackUp?.TaskType?.Title &&
                    obj.Portfolio?.Id == newItemBackUp?.Portfolio?.Id
                  ) {
                    obj.subRows?.push(...latestCheckedList);
                    pushData = true;
                  }

                  if (obj.subRows != undefined && obj.subRows?.length > 0) {
                    processArray(obj.subRows, pushData, spliceData);
                  }
                }
              });
            }

            processArray(array, false, false);
            if (count === restructureItem?.length) {
              setResturuningOpen(false);
              restructureCallBack(array, false);
            }
          });
      });
    } else {
      let ParentTask: any = newItemBackUp?.Id != undefined ? newItemBackUp?.Id : props?.queryItems?.Id ;
      let PortfolioStructureID = newItemBackUp?.PortfolioStructureID != undefined ? newItemBackUp?.PortfolioStructureID : props?.queryItems?.PortfolioStructureID;
      let PortfolioLevel: number = 0;
      let SiteIconTitle: any =
      newItemBackUp?.Item_x0020_Type != undefined ?  (newItemBackUp?.Item_x0020_Type === "Component" ? "S" : "F") : (
        props?.queryItems?.Item_x0020_Type  == "Component" && restructureItem[0]?.Item_x0020_Type  == "SubComponent" ? "F" :(
          props?.queryItems?.Item_x0020_Type  == "Component" && restructureItem[0]?.Item_x0020_Type  == "Feature" ? "S" : ''
        )
      );
      let Item_x0020_Type: any =
      newItemBackUp?.Item_x0020_Type != undefined ?  ( newItemBackUp?.Item_x0020_Type === "Component" ? "SubComponent" : "Feature") : (
        props?.queryItems?.Item_x0020_Type  == "Component" && restructureItem[0]?.Item_x0020_Type  == "SubComponent" ? "Feature" :(
          props?.queryItems?.Item_x0020_Type  == "Component" && restructureItem[0]?.Item_x0020_Type  == "Feature" ? "SubComponent" : ''
        )
      );


       

      if (
        newItemBackUp?.subRows != undefined &&
        newItemBackUp?.subRows?.length > 0
      ) {
        newItemBackUp?.subRows?.map((sub: any) => {
          if (Item_x0020_Type === sub?.Item_x0020_Type) {
            if (PortfolioLevel <= sub?.PortfolioLevel) {
              PortfolioLevel = sub.PortfolioLevel;
            }
          } else {
            PortfolioLevel = 1;
          }
        });
      } else {
        newItemBackUp?.Item_x0020_Type != undefined &&

        allData?.map((sub: any) => {
          if (Item_x0020_Type === sub?.Item_x0020_Type) {
            if (PortfolioLevel <= sub?.PortfolioLevel) {
              PortfolioLevel = sub.PortfolioLevel;
            }
          } else {
            PortfolioLevel = 1;
          }
        });
      }
      let array: any = [...allData];
      let count: number = 0;
      restructureItem?.map(async (items: any, index: any) => {
        PortfolioLevel = PortfolioLevel + 1;
        let level: number = PortfolioLevel;
        let web = new Web(props?.contextValue?.siteUrl);
        var postData: any = {
          ParentId: ParentTask,
          PortfolioLevel: level,
          Item_x0020_Type: Item_x0020_Type,
          PortfolioStructureID:
            PortfolioStructureID + "-" + SiteIconTitle + level,
        };
        await web.lists
          .getById(props?.contextValue?.MasterTaskListID)
          .items.getById(items.Id)
          .update(postData)
          .then(async (res: any) => {
            // let checkUpdate: number = 1;
            PortfolioLevel = PortfolioLevel + 1;
            let backupCheckedList: any = [];
            let latestCheckedList: any = [];
            latestCheckedList?.push({ ...items });
            backupCheckedList?.push({ ...items });
            count = count + 1;
            latestCheckedList?.map((items: any) => {
              (items.Parent = { Id: ParentTask }),
                (items.PortfolioLevel = PortfolioLevel),
                (items.Item_x0020_Type = Item_x0020_Type),
                (items.SiteIconTitle = SiteIconTitle),
                (items.PortfolioStructureID =
                  PortfolioStructureID + "-" + SiteIconTitle + PortfolioLevel),
                (items.TaskID =
                  PortfolioStructureID + "-" + SiteIconTitle + PortfolioLevel);
            });

            function processArray(arr: any, pushData: any, spliceData: any) {
              arr?.map((obj: any, index: any) => {
                if (!spliceData || !pushData) {
                  obj.isRestructureActive = false;

                  if (
                    !spliceData &&
                    obj.Id === backupCheckedList[0]?.Id &&
                    obj.Item_x0020_Type ===
                      backupCheckedList[0]?.Item_x0020_Type &&
                    obj.TaskType?.Title ===
                      backupCheckedList[0]?.TaskType?.Title &&
                    obj.Parent?.Id == backupCheckedList[0]?.Parent?.Id &&
                    obj.Portfolio?.Id == backupCheckedList[0]?.Portfolio?.Id
                  ) {
                    arr.splice(index, 1);
                    spliceData = true;
                  }

                  if (
                    !pushData &&
                    obj.Id === newItemBackUp?.Id &&
                    obj.Item_x0020_Type === newItemBackUp?.Item_x0020_Type &&
                    obj.TaskType?.Title === newItemBackUp?.TaskType?.Title &&
                    obj.Parent?.Id == newItemBackUp?.Parent?.Id
                  ) {
                    obj.subRows?.push(...latestCheckedList);
                    pushData = true;
                  }

                  if (obj.subRows != undefined && obj.subRows?.length > 0) {
                    processArray(obj.subRows, pushData, spliceData);
                  }
                }
              });
            }

            processArray(array, false, false);
            if (count === restructureItem?.length) {
              setResturuningOpen(false);
              restructureCallBack(array, false);
            }
          });
      });
    }
  };

  const OpenModal = (item: any) => {
    setNewItemBackUp(item);
    let array = allData;
    var TestArray: any = [];
    if (array[0]?.Item_x0020_Type !== "Project" && props?.projectmngmnt != "projectmngmnt") {
      array.forEach((obj: any) => {
        let object: any = {};
        if (
          obj.TaskID === item.TaskID &&
          obj.Id === item.Id &&
          (item?.Item_x0020_Type != "Task"
            ? item?.Item_x0020_Type == obj?.Item_x0020_Type
            : item?.TaskType?.Id == obj?.TaskType?.Id &&
              item?.siteType == obj?.siteType)
        ) {
          object = {...obj, TaskType: {Id:obj.TaskType?.Id == undefined ? "" : obj.TaskType?.Id,Title:obj.TaskType?.Title}, siteIcon:obj.SiteIconTitle === undefined? obj.SiteIcon: obj.SiteIconTitle}
          
          TestArray?.push(object);
        }
        if (obj.subRows != undefined && obj.subRows?.length > 0) {
          obj.subRows.forEach((sub: any) => {
            if (
              sub.TaskID === item.TaskID &&
              sub.Id === item.Id &&
              (item?.Item_x0020_Type != "Task"
                ? item?.Item_x0020_Type == sub?.Item_x0020_Type
                : item?.TaskType?.Id == sub?.TaskType?.Id &&
                  item?.siteType == sub?.siteType)
            ) {
              object = {...obj, TaskType: {Id:obj.TaskType?.Id == undefined ? "" : obj.TaskType?.Id,Title:obj.TaskType?.Title}, siteIcon:obj.SiteIconTitle === undefined? obj.SiteIcon: obj.SiteIconTitle,
              newSubChild:{...sub, TaskType: {Id:sub.TaskType?.Id == undefined ? "" : sub.TaskType?.Id,Title:sub.TaskType?.Title}, siteIcon:sub.SiteIconTitle === undefined? sub.SiteIcon: sub.SiteIconTitle }}
              
              TestArray?.push(object);
            }
            if (sub.subRows != undefined && sub.subRows?.length > 0) {
              sub.subRows.forEach((newsub: any) => {
                if (
                  newsub.TaskID === item.TaskID &&
                  newsub.Id === item.Id &&
                  (item?.Item_x0020_Type != "Task"
                    ? item?.Item_x0020_Type == newsub?.Item_x0020_Type
                    : item?.TaskType?.Id == newsub?.TaskType?.Id &&
                      item?.siteType == newsub?.siteType)
                ) {
                  object = {...obj, TaskType: {Id:obj.TaskType?.Id == undefined ? "" : obj.TaskType?.Id,Title:obj.TaskType?.Title}, siteIcon:obj.SiteIconTitle === undefined? obj.SiteIcon: obj.SiteIconTitle,
                  newSubChild:{...sub, TaskType: {Id:sub.TaskType?.Id == undefined ? "" : sub.TaskType?.Id,Title:sub.TaskType?.Title}, siteIcon:sub.SiteIconTitle === undefined? sub.SiteIcon: sub.SiteIconTitle,
                  newFeatChild : {...newsub, TaskType: {Id:newsub.TaskType?.Id == undefined ? "" : newsub.TaskType?.Id,Title:newsub.TaskType?.Title}, siteIcon:newsub.SiteIconTitle === undefined? newsub.SiteIcon: newsub.SiteIconTitle} }}
                  
                  TestArray?.push(object);
                }
                if (newsub.subRows != undefined && newsub.subRows?.length > 0) {
                  newsub.subRows.forEach((activity: any) => {
                    if (
                      activity.TaskID === item.TaskID &&
                      activity.Id === item.Id &&
                      (item?.Item_x0020_Type != "Task"
                        ? item?.Item_x0020_Type == activity?.Item_x0020_Type
                        : item?.TaskType?.Id == activity?.TaskType?.Id &&
                          item?.siteType == activity?.siteType)
                    ) {
                      object = {...obj, TaskType: {Id:obj.TaskType?.Id == undefined ? "" : obj.TaskType?.Id,Title:obj.TaskType?.Title}, siteIcon:obj.SiteIconTitle === undefined? obj.SiteIcon: obj.SiteIconTitle,
                      newSubChild:{...sub, TaskType: {Id:sub.TaskType?.Id == undefined ? "" : sub.TaskType?.Id,Title:sub.TaskType?.Title}, siteIcon:sub.SiteIconTitle === undefined? sub.SiteIcon: sub.SiteIconTitle,
                      newFeatChild : {...newsub, TaskType: {Id:newsub.TaskType?.Id == undefined ? "" : newsub.TaskType?.Id,Title:newsub.TaskType?.Title}, siteIcon:newsub.SiteIconTitle === undefined? newsub.SiteIcon: newsub.SiteIconTitle,
                      newActChild : {...activity, TaskType: {Id:activity.TaskType?.Id == undefined ? "" : activity.TaskType?.Id,Title:activity.TaskType?.Title}, siteIcon:activity.SiteIconTitle === undefined? activity.SiteIcon: activity.SiteIconTitle}} }}
                      
                      TestArray?.push(object);
                    }
                    if (
                      newsub.subRows != undefined &&
                      newsub.subRows?.length > 0
                    ) {
                      activity?.subRows?.forEach((wrkstrm: any) => {
                        if (
                          wrkstrm.TaskID === item.TaskID &&
                          wrkstrm.Id === item.Id &&
                          (item?.Item_x0020_Type != "Task"
                            ? item?.Item_x0020_Type == wrkstrm?.Item_x0020_Type
                            : item?.TaskType?.Id == wrkstrm?.TaskType?.Id &&
                              item?.siteType == wrkstrm?.siteType)
                        ) {
                          object = {...obj, TaskType: {Id:obj.TaskType?.Id == undefined ? "" : obj.TaskType?.Id,Title:obj.TaskType?.Title}, siteIcon:obj.SiteIconTitle === undefined? obj.SiteIcon: obj.SiteIconTitle,
                          newSubChild:{...sub, TaskType: {Id:sub.TaskType?.Id == undefined ? "" : sub.TaskType?.Id,Title:sub.TaskType?.Title}, siteIcon:sub.SiteIconTitle === undefined? sub.SiteIcon: sub.SiteIconTitle,
                          newFeatChild : {...newsub, TaskType: {Id:newsub.TaskType?.Id == undefined ? "" : newsub.TaskType?.Id,Title:newsub.TaskType?.Title}, siteIcon:newsub.SiteIconTitle === undefined? newsub.SiteIcon: newsub.SiteIconTitle,
                          newActChild : {...activity, TaskType: {Id:activity.TaskType?.Id == undefined ? "" : activity.TaskType?.Id,Title:activity.TaskType?.Title}, siteIcon:activity.SiteIconTitle === undefined? activity.SiteIcon: activity.SiteIconTitle,
                          newWrkChild:{...wrkstrm, TaskType: {Id:wrkstrm.TaskType?.Id == undefined ? "" : wrkstrm.TaskType?.Id,Title:wrkstrm.TaskType?.Title}, siteIcon:wrkstrm.SiteIconTitle === undefined? wrkstrm.SiteIcon: wrkstrm.SiteIconTitle}}} }}
                          
                          TestArray?.push(object);
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

      setRestructureTitle([...RestructureChecked])
      let data: any = {};
      let array2: any = [];
      if(TestArray[0]?.Item_x0020_Type == "Component" && (RestructureChecked[0]?.Item_x0020_Type == "Component" || RestructureChecked[0]?.Item_x0020_Type == "Feature")){
        data ={Item_x0020_Type: "SubComponent",siteIcon: "S"}
      }
      
     
      // item?.map((items: any) => {
      //   if (items != undefined && title === "SubComponent") {
      //     data ={Item_x0020_Type: "SubComponent",siteIcon: "S",};
      //   }
      //   if (items != undefined && title === "Feature") {
      //     data ={Item_x0020_Type: "Feature",siteIcon: "F",};
      //   }
      //   if (items != undefined && title === 3) {
      //     data ={Item_x0020_Type: "Task",TaskType: { Id: 3 ,Title:'Workstream'},};
      //   }
      //   if (items != undefined && title === 2) {
      //     data ={Item_x0020_Type: "Task",TaskType: { Id: 2, Title:'Task'},};
      //   }
      //   if (items != undefined && title === 1) {
      //     data ={Item_x0020_Type: "Task",TaskType: { Id: 1,Title:'Activities' },};
      //   }
      // });
      let b = RestructureChecked[0];
      array2?.push({...b,...data});
      setRestructureChecked(array2);


      setNewArrayBackup(TestArray);
      setResturuningOpen(true);
      setTrueTopCompo(false);
    } else {
      array.forEach((obj: any) => {
        let object: any = {};
        if (obj.TaskID === item.TaskID &&obj.Id === item.Id &&item?.Item_x0020_Type == obj.Item_x0020_Type) {
          object = {...obj}
          
          TestArray?.push(object);
        }
        if (obj.subRows != undefined && obj.subRows?.length > 0) {
          obj.subRows.forEach((sub: any) => {
            if (sub.TaskID === item.TaskID &&sub.Id === item.Id &&item?.Item_x0020_Type == sub.Item_x0020_Type) {
              object = {...obj, newSubChild:{...sub }}
              
              TestArray?.push(object);
            }
            if (sub.subRows != undefined && sub.subRows?.length > 0) {
              sub.subRows.forEach((feat: any) => {
                if (feat.TaskID === item.TaskID &&feat.Id === item.Id &&item?.Item_x0020_Type == feat.Item_x0020_Type) {
                  object = {...obj, newSubChild:{...sub ,newFeatChild:{...feat}}}
                  
                  TestArray?.push(object);
                }
                if (feat.subRows != undefined && feat.subRows?.length > 0) {
                  feat.subRows.forEach((last: any) => {
                    if (last.TaskID === item.TaskID &&last.Id === item.Id &&item?.Item_x0020_Type == last.Item_x0020_Type) {
                      object = {...obj, newSubChild:{...sub ,newFeatChild:{...feat,newActChild:{...last}}}}
                      
                      TestArray?.push(object);
                    }
                  })}
              })}
          });
        }
      });
      setRestructureTitle([...RestructureChecked])
      setNewArrayBackup(TestArray);
      
      setTrueTopCompo(false);
      if(props?.projectmngmnt != "projectmngmnt"){
        setProjects(true);
      }else{
        setProjectmngmnt(true);
      }
      
    }
  };

  const trueTopIcon = (items: any) => {
    if(RestructureChecked?.length > 1 || selectedItems?.length > 1){
          setResturuningOpen(true);
    }else{
      setTrueTopCompo(items);
    }
    
    // setResturuningOpen(false);
  };

  const projectTopIcon = (items: any) => {
    setTrueTopCompo(false);
    setResturuningOpen(false);
    setTopProject(items);
    
  };


  React.useImperativeHandle(ref, () => ({
    OpenModal,
    trueTopIcon,
    projectTopIcon,
  }));

  const projectRestruture = async () => {
    if((props?.projectmngmnt == "projectmngmnt" || props?.findPage == 'ProjectOverView') && (RestructureChecked[0]?.Item_x0020_Type != "Sprint" && RestructureChecked[0]?.Item_x0020_Type != "Project")){
           projectMngmntFuc();
    }
    else{
    let count : number = 0;
    let Item_x0020_Type: any;
    let Parent: any;
    let PortfolioLevel: any = 0;
    let PortfolioStructureID: any;
    restructureItem?.map(async (items: any, index: any) => {
      if (items?.Item_x0020_Type == "Project" || items?.Item_x0020_Type == "Sprint") {
        if (newItemBackUp != undefined && newItemBackUp != null && newItemBackUp?.Item_x0020_Type == "Project") {
          Item_x0020_Type = "Sprint";
          Parent = newItemBackUp?.Id;
          if (newItemBackUp?.subRows != undefined &&newItemBackUp?.subRows?.length > 0) {
            newItemBackUp?.subRows?.map((sub: any) => {
              if (PortfolioLevel <= sub.PortfolioLevel) {
                PortfolioLevel = sub.PortfolioLevel;
              }
            });
          }
          PortfolioLevel = PortfolioLevel + 1;
          PortfolioStructureID = newItemBackUp?.PortfolioStructureID + "-" + "X" + PortfolioLevel;
        }
        if (newItemBackUp == undefined || newItemBackUp == null) {
          Item_x0020_Type = "Project";
          Parent = null;
          if (allData != undefined && allData?.length > 0) {
            allData?.map((sub: any) => {
                if (PortfolioLevel <= sub.PortfolioLevel) {
                  PortfolioLevel = sub.PortfolioLevel;
                }
            });
          }
          PortfolioLevel = PortfolioLevel + 1;
          PortfolioStructureID = "P" + PortfolioLevel;
        }
  
      //   function generateNextId(currentId) {
      //     return 'P' + ('000' + (parseInt(currentId.substring(1)) + 1)).slice(-3);
      // }
      
      // var nextId = generateNextId(currentId);
      // console.log(nextId);
      
       
        let web = new Web(props?.contextValue?.siteUrl);
        var postData: any = {
          ParentId: Parent,
          PortfolioLevel: PortfolioLevel,
          Item_x0020_Type: Item_x0020_Type,
          PortfolioStructureID: PortfolioStructureID,
        };
        await web.lists
          .getById(props?.contextValue?.MasterTaskListID)
          .items.getById(items?.Id)
          .update(postData)
          .then(async (res: any) => {
            count = count+1;
            let pushData : any = false;
            let spliceData : any = false;
            let array: any = [...allData];
            let latestCheckedList: any = [];
            let backupCheckedList: any = [];
            restructureItem?.map((items: any) => {
              latestCheckedList?.push({ ...items });
              backupCheckedList?.push({ ...items });
            });
  
            latestCheckedList?.map((items: any) => {
              (items.ParentTask = Parent),
                (items.PortfolioLevel = PortfolioLevel);
              (items.Item_x0020_Type = Item_x0020_Type),
                (items.PortfolioStructureID = PortfolioStructureID),
                (items.TaskID = PortfolioStructureID);
            });
  
            let onceRender: any = true;
            function processArray(arr: any) {
              arr?.map((obj: any, index: any) => {
                if (spliceData == false || pushData == false) {
                  obj.isRestructureActive = false;
  
                  if ((newItemBackUp == undefined || newItemBackUp == null || newItemBackUp?.length == 0) && onceRender == true) {
                    pushData = true;
                    onceRender = false;
                    arr.push(...latestCheckedList);
                    }
  
                  if (spliceData == false &&obj.Id === backupCheckedList[0]?.Id &&obj.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type) {
                    spliceData = true;
                    arr.splice(index, 1);
                  }
  
                  if (pushData == false &&obj.Id === newItemBackUp?.Id &&obj.Item_x0020_Type === newItemBackUp?.Item_x0020_Type) {
                    pushData = true;
                    obj.subRows?.push(...latestCheckedList);
                    
                  }
  
                  if (obj.subRows != undefined && obj.subRows?.length > 0) {
                    processArray(obj.subRows);
                  }
                }
              });
            }
            
            if (count === restructureItem?.length) {
              
            processArray(array);
            setProjects(false);
            setTopProject(false);
            setNewItemBackUp([]);
            setNewItemBackUp(null);
            setOldArrayBackup([])
            restructureCallBack(array, false);
            }
          });
      }
    })
   
  }
  };

  
  const UpdateTaskRestructure = async function () {
    if (restructureItem[0]?.Item_x0020_Type == "Task") {
      let ParentTask_Id: any;
      let Portfolio: any;
      let TaskId = newItemBackUp?.TaskID !== undefined ? newItemBackUp?.TaskID : "";
      let TaskLevel: number = 0;
      let TaskTypeId: any;

      if ( newItemBackUp?.Item_x0020_Type != "Task" && RestructureChecked[0]?.TaskType?.Id === 3) {
         TaskTypeId = 1;
      } else { 
        if (newItemBackUp?.Item_x0020_Type == "Task" &&   newItemBackUp?.TaskType?.Id == 3 &&   RestructureChecked[0].Item_x0020_Type === "Task" ) {   
          TaskTypeId = 2; 
         } else if ( newItemBackUp?.Item_x0020_Type == "Task" && newItemBackUp?.TaskType?.Id == 1 && RestructureChecked[0]?.TaskType?.Id == 1) {
          TaskTypeId = 3;
        } 
        else {
          TaskTypeId = RestructureChecked[0]?.TaskType?.Id;
        }
      }


      if(newItemBackUp?.TaskType?.Id == 1 && newItemBackUp?.subRows?.some((item: any) => item?.Id === restructureItem[0]?.Id && item?.Title === restructureItem[0]?.Title)){
        TaskTypeId = RestructureChecked[0]?.TaskType?.Id == 2 ? 3 : 2
        }


      if ( newItemBackUp?.subRows != undefined && newItemBackUp?.subRows?.length > 0 ) {
        newItemBackUp?.subRows?.map((sub: any) => {
          if (TaskTypeId === sub?.TaskType?.Id) {
            if (TaskLevel <= sub.TaskLevel) {
              TaskLevel = sub.TaskLevel;
            }
          }
        });
      }

      TaskLevel = TaskLevel + 1;

      TaskId = TaskTypeId == 2   ? "T" + RestructureChecked[0]?.Id   : TaskId + "-" + "W" + TaskLevel;

      if (TaskTypeId === 1) {
        ParentTask_Id = null;
        let web = new Web(restructureItem[0]?.siteUrl);
        await web.lists
          .getById(restructureItem[0]?.listId)
          .items.select("Id,Title,TaskType/Id,TaskType/Title,TaskLevel")
          .expand("TaskType")
          .orderBy("TaskLevel", false).filter("TaskType/Id eq 1").top(1).get()
          .then((componentDetails: any) => {
            if (componentDetails?.length == 0) {
              var LatestId: any = 1;
              TaskLevel = LatestId;
              TaskId = "A" + LatestId;
            } else {
              var LatestId = componentDetails[0].TaskLevel + 1;
              TaskLevel = LatestId;
              TaskId = "A" + LatestId;
            }
          })
          .catch((err: any) => {
            console.log(err);
          });
      }

      if (newItemBackUp?.Item_x0020_Type != "Task") {
        ParentTask_Id = null;
        Portfolio = {
          Id: newItemBackUp?.Id,
          ItemType: newItemBackUp?.Item_x0020_Type,
          PortfolioStructureID: newItemBackUp?.PortfolioStructureID,
          Title: newItemBackUp?.Title,
        };
      } else {
        Portfolio = {Id: newItemBackUp?.Portfolio?.Id,ItemType: newItemBackUp?.Portfolio?.ItemType,PortfolioStructureID: newItemBackUp?.Portfolio?.PortfolioStructureID,Title: newItemBackUp?.Portfolio?.Title,}
        ParentTask_Id = {  Id: newItemBackUp?.Id,  Title: newItemBackUp?.Title,  TaskID: newItemBackUp?.TaskID,};
      }

      let web = new Web(props?.contextValue?.siteUrl);
      var postData: any = {
        ParentTaskId: ParentTask_Id == null ? null : ParentTask_Id.Id,
        PortfolioId: Portfolio == null ? null : Portfolio.Id,
        TaskLevel: TaskLevel,
        TaskTypeId: TaskTypeId,
        TaskID: TaskId,
      };

      await web.lists
        .getById(restructureItem[0]?.listId)
        .items.getById(restructureItem[0]?.Id)
        .update(postData)
        .then(async (res: any) => {
          let array: any = [...allData];
          let backupCheckedList: any = [];
          let latestCheckedList: any = [];
          restructureItem?.map((items: any) => {
            latestCheckedList?.push({ ...items });
            backupCheckedList?.push({ ...items });
          });

          latestCheckedList?.map((items: any) => {
            (items.ParentTask = ParentTask_Id == null ? {} : ParentTask_Id),
              (items.Portfolio = Portfolio == null ? {} : Portfolio),
              (items.TaskLevel = TaskLevel),
              (items.TaskType = {
                Id: TaskTypeId,
                Level: TaskTypeId == 1 ? 1 : TaskTypeId == 2 ? 3 : 2,
                Title:
                  TaskTypeId == 1
                    ? "Activity"
                    : TaskTypeId == 2
                    ? "Task"
                    : "Workstream",
              }),
              (items.TaskID =
                TaskTypeId == 2
                  ? newItemBackUp?.PortfolioStructureID == undefined
                    ? newItemBackUp?.TaskID + "-" + TaskId
                    : newItemBackUp?.PortfolioStructureID + "-" + TaskId
                  : TaskId);
          });

          let onceRender: any = true;
          function processArray(arr: any, pushData: any, spliceData: any) {
            arr?.map((obj: any, index: any) => {
              if (!spliceData || !pushData) {
                obj.isRestructureActive = false;

                if (
                  (newItemBackUp == undefined ||
                    newItemBackUp == null ||
                    newItemBackUp?.length == 0) &&
                  onceRender
                ) {
                  arr.push(...latestCheckedList);
                  pushData = true;
                  onceRender = false;
                }

                if (
                  !spliceData &&
                  obj.Id === backupCheckedList[0]?.Id &&
                  obj.Item_x0020_Type ===
                    backupCheckedList[0]?.Item_x0020_Type &&
                  obj.TaskType?.Title ===
                    backupCheckedList[0]?.TaskType?.Title &&
                  obj.Portfolio?.Id == backupCheckedList[0]?.Portfolio?.Id &&
                  obj.ParentTask?.Id == backupCheckedList[0]?.ParentTask?.Id
                ) {
                  arr.splice(index, 1);
                  spliceData = true;
                }

                if (
                  !pushData &&
                  obj.Id === newItemBackUp?.Id &&
                  obj.Item_x0020_Type === newItemBackUp?.Item_x0020_Type &&
                  obj.TaskType?.Title === newItemBackUp?.TaskType?.Title &&
                  obj.Portfolio?.Id == newItemBackUp?.Portfolio?.Id
                ) {
                  obj.subRows?.push(...latestCheckedList);
                  pushData = true;
                }

                if (obj.subRows != undefined && obj.subRows?.length > 0) {
                  processArray(obj.subRows, pushData, spliceData);
                }
              }
            });
          }

          processArray(array, false, false);

          setResturuningOpen(false);
          setNewItemBackUp([]);
          setControlUseEffect(false);
          restructureCallBack(array, false);
        });
    } else {
      let ParentTask: any;
      let Portfolio: any;
      let PortfolioStructureID = newItemBackUp?.PortfolioStructureID;
      let PortfolioLevel: number = 0;
      let SiteIconTitle: any = RestructureChecked[0]?.siteIcon;
      let Item_x0020_Type: any = RestructureChecked[0]?.Item_x0020_Type;

      if (newItemBackUp.Item_x0020_Type === "SubComponent") {
        Item_x0020_Type = "Feature";
        SiteIconTitle = "F";
      }

      if (
        newItemBackUp.Item_x0020_Type === "Component" &&
        RestructureChecked[0]?.Item_x0020_Type === "Component"
      ) {
        Item_x0020_Type = "SubComponent";
        SiteIconTitle = "S";
      }

      if (
        newItemBackUp?.subRows != undefined &&
        newItemBackUp?.subRows?.length > 0
      ) {
        newItemBackUp?.subRows?.map((sub: any) => {
          if (Item_x0020_Type === sub?.Item_x0020_Type) {
            if (PortfolioLevel <= sub?.PortfolioLevel) {
              PortfolioLevel = sub.PortfolioLevel;
            }
          }
        });
      }

      PortfolioLevel = PortfolioLevel + 1;
      ParentTask = {
        Id: newItemBackUp?.Id,
        Title: newItemBackUp?.Title,
        TaskID: newItemBackUp?.TaskID,
      };

      let web = new Web(props?.contextValue?.siteUrl);
      var postData: any = {
        ParentId: ParentTask == null ? null : ParentTask.Id,
        PortfolioLevel: PortfolioLevel,
        Item_x0020_Type: Item_x0020_Type,
        PortfolioStructureID:
          PortfolioStructureID + "-" + SiteIconTitle + PortfolioLevel,
      };
      await web.lists
        .getById(props?.contextValue?.MasterTaskListID)
        .items.getById(RestructureChecked[0]?.Id)
        .update(postData)
        .then(async (res: any) => {
          let array: any = [...allData];
          let backupCheckedList: any = [];
          let latestCheckedList: any = [];
          restructureItem?.map((items: any) => {
            latestCheckedList?.push({ ...items });
            backupCheckedList?.push({ ...items });
          });

          latestCheckedList?.map((items: any) => {
            (items.Parent = ParentTask == null ? {} : ParentTask),
              (items.Portfolio = Portfolio),
              (items.PortfolioLevel = PortfolioLevel),
              (items.Item_x0020_Type = Item_x0020_Type),
              (items.SiteIconTitle = SiteIconTitle),
              (items.PortfolioStructureID =
                PortfolioStructureID + "-" + SiteIconTitle + PortfolioLevel),
              (items.TaskID =
                PortfolioStructureID + "-" + SiteIconTitle + PortfolioLevel);
          });

          // let checkUpdate: number = 1;
          let onceRender: any = true;

          function processArray(arr: any, pushData: any, spliceData: any) {
            arr?.map((obj: any, index: any) => {
              if (!spliceData || !pushData) {
                obj.isRestructureActive = false;

                if (
                  (newItemBackUp == undefined ||
                    newItemBackUp == null ||
                    newItemBackUp?.length == 0) &&
                  onceRender
                ) {
                  arr.push(...latestCheckedList);
                  pushData = true;
                  onceRender = false;
                }

                if (
                  !spliceData &&
                  obj.Id === backupCheckedList[0]?.Id &&
                  obj.Item_x0020_Type ===
                    backupCheckedList[0]?.Item_x0020_Type &&
                  obj.TaskType?.Title ===
                    backupCheckedList[0]?.TaskType?.Title &&
                  obj.Parent?.Id == backupCheckedList[0]?.Parent?.Id &&
                  obj.Portfolio?.Id == backupCheckedList[0]?.Portfolio?.Id
                ) {
                  arr.splice(index, 1);
                  spliceData = true;
                }

                if (
                  !pushData &&
                  obj.Id === newItemBackUp?.Id &&
                  obj.Item_x0020_Type === newItemBackUp?.Item_x0020_Type &&
                  obj.TaskType?.Title === newItemBackUp?.TaskType?.Title &&
                  obj.Parent?.Id == newItemBackUp?.Parent?.Id
                ) {
                  obj.subRows?.push(...latestCheckedList);
                  pushData = true;
                }

                if (obj.subRows != undefined && obj.subRows?.length > 0) {
                  processArray(obj.subRows, pushData, spliceData);
                }
              }
            });
          }

          processArray(array, false, false);

          setResturuningOpen(false);
          restructureCallBack(array, false);
          setControlUseEffect(false);
          setNewArrayBackup([]);
        });
    }
  };

  const makeTopComp = async () => {
    if (restructureItem != undefined && restructureItem != undefined && restructureItem[0].Item_x0020_Type != "Task") {
      let array: any = [...allData];
      let ParentTask: any;
      let PortfolioStructureIDs: any;
      let PortfolioLevel: number = 0;
      let Item_x0020_Type: any;
      let SiteIconTitle: any;
      let Portfolio: any;

      if (array != undefined && array?.length > 0) {
        array?.map((items: any) => {
          if (PortfolioLevel <= items?.PortfolioLevel) {
            PortfolioLevel = items.PortfolioLevel;
          }
        });
      }

      PortfolioLevel = PortfolioLevel + 1;

      if (props?.queryItems === undefined && props?.queryItems == null) {
        ParentTask = null;
        Portfolio = null;
        PortfolioStructureIDs = "C" + PortfolioLevel;
        SiteIconTitle = "C";
        Item_x0020_Type = "Component";
      } else if (
        props?.queryItems != undefined &&
        props?.queryItems != null &&
        props?.queryItems?.Item_x0020_Type == "Component"
      ) {
        if (RestructureChecked[0]?.Item_x0020_Type == "SubComponent") {
          ParentTask = {
            Id: props?.queryItems?.Id,
            Title: props?.queryItems?.Title,
            TaskID: props?.queryItems?.TaskID,
          };
          PortfolioStructureIDs =
            props?.queryItems?.PortfolioStructureID +
            "-" +
            "F" +
            PortfolioLevel;
          SiteIconTitle = "F";
          Item_x0020_Type = "Feature";
        } else {
          ParentTask = {
            Id: props?.queryItems?.Id,
            Title: props?.queryItems?.Title,
            TaskID: props?.queryItems?.TaskID,
          };
          PortfolioStructureIDs =
            props?.queryItems?.PortfolioStructureID +
            "-" +
            "S" +
            PortfolioLevel;
          SiteIconTitle = "S";
          Item_x0020_Type = "SubComponent";
        }
      } else if (
        props?.queryItems != undefined &&
        props?.queryItems != null &&
        props?.queryItems?.Item_x0020_Type == "SubComponent"
      ) {
        ParentTask = {
          Id: props?.queryItems?.Id,
          Title: props?.queryItems?.Title,
          TaskID: props?.queryItems?.TaskID,
        };
        PortfolioStructureIDs =
          props?.queryItems?.PortfolioStructureID + "-" + "F" + PortfolioLevel;
        SiteIconTitle = "F";
        Item_x0020_Type = "Feature";
      }

      let web = new Web(props?.contextValue?.siteUrl);
      var postData: any = {
        ParentId: ParentTask == null ? null : ParentTask.Id,
        PortfolioLevel: PortfolioLevel,
        Item_x0020_Type: Item_x0020_Type,
        PortfolioStructureID: PortfolioStructureIDs,
      };
      await web.lists
        .getById(props?.contextValue?.MasterTaskListID)
        .items.getById(RestructureChecked[0]?.Id)
        .update(postData)
        .then(async (res: any) => {
          let checkUpdate: number = 1;
          let array: any = [...allData];
          let backupCheckedList: any = [];
          let latestCheckedList: any = [];
          restructureItem?.map((items: any) => {
            latestCheckedList?.push({ ...items });
            backupCheckedList?.push({ ...items });
          });

          latestCheckedList?.map((items: any) => {
            (items.Parent = ParentTask == null ? {} : ParentTask),
              (items.PortfolioLevel = PortfolioLevel),
              (items.Item_x0020_Type = Item_x0020_Type),
              (items.SiteIconTitle = SiteIconTitle),
              (items.PortfolioStructureID =
                PortfolioStructureIDs + "-" + SiteIconTitle + PortfolioLevel),
              (items.TaskID = PortfolioStructureIDs);
          });

          let onceRender: any = true;
          array?.map((obj: any, index: any) => {
            obj.isRestructureActive = false;
            if (
             ( newItemBackUp == undefined || newItemBackUp == null) &&
               onceRender && checkUpdate != 3
            ) {
              array?.push(...latestCheckedList);
              checkUpdate = checkUpdate + 1;
              onceRender = false;
            }
            if (
              obj.Id === newItemBackUp?.Id && obj?.Title != 'Others' &&
              obj.Item_x0020_Type === newItemBackUp?.Item_x0020_Type &&
              obj.TaskType?.Title === newItemBackUp?.TaskType?.Title &&
              checkUpdate != 3
            ) {
              obj.subRows?.push(...latestCheckedList);
              checkUpdate = checkUpdate + 1;
            }
            if (
              obj.Id === backupCheckedList[0]?.Id &&
              obj.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type &&
              obj.TaskType?.Title === backupCheckedList[0]?.TaskType?.Title &&
              checkUpdate != 3
            ) {
              array.splice(index, 1);
              checkUpdate = checkUpdate + 1;
            }

            if (obj.subRows != undefined && obj.subRows?.length > 0) {
              obj.subRows.forEach((sub: any, indexsub: any) => {
                sub.isRestructureActive = false;
                if (
                  sub.Id === newItemBackUp?.Id &&
                  sub.Item_x0020_Type === newItemBackUp?.Item_x0020_Type &&
                  sub.TaskType?.Title === newItemBackUp?.TaskType?.Title &&
                  checkUpdate != 3
                ) {
                  sub.subRows?.push(...latestCheckedList);
                  checkUpdate = checkUpdate + 1;
                }
                if (
                  sub.Id === backupCheckedList[0]?.Id &&
                  sub.Item_x0020_Type ===
                    backupCheckedList[0]?.Item_x0020_Type &&
                  sub.TaskType?.Title ===
                    backupCheckedList[0]?.TaskType?.Title &&
                  checkUpdate != 3
                ) {
                  array[index]?.subRows.splice(indexsub, 1);
                  checkUpdate = checkUpdate + 1;
                }

                if (sub.subRows != undefined && sub.subRows?.length > 0) {
                  sub.subRows.forEach((newsub: any, lastIndex: any) => {
                    newsub.isRestructureActive = false;
                    if (
                      newsub.Id === newItemBackUp?.Id &&
                      newsub.Item_x0020_Type ===
                        newItemBackUp?.Item_x0020_Type &&
                      newsub.TaskType?.Title ===
                        newItemBackUp?.TaskType?.Title &&
                      checkUpdate != 3
                    ) {
                      newsub.subRows?.push(...latestCheckedList);
                      checkUpdate = checkUpdate + 1;
                    }
                    if (
                      newsub.Id === backupCheckedList[0]?.Id &&
                      newsub.Item_x0020_Type ===
                        backupCheckedList[0]?.Item_x0020_Type &&
                      newsub.TaskType?.Title ===
                        backupCheckedList[0]?.TaskType?.Title &&
                      checkUpdate != 3
                    ) {
                      array[index]?.subRows[indexsub]?.subRows.splice(
                        lastIndex,
                        1
                      );
                      checkUpdate = checkUpdate + 1;
                    }

                    if (
                      newsub.subRows != undefined &&
                      newsub.subRows?.length > 0
                    ) {
                      newsub.subRows.forEach(
                        (activity: any, activityIndex: any) => {
                          activity.isRestructureActive = false;
                          if (
                            activity.Id === newItemBackUp?.Id &&
                            activity.Item_x0020_Type ===
                              newItemBackUp?.Item_x0020_Type &&
                            activity.TaskType?.Title ===
                              newItemBackUp?.TaskType?.Title &&
                            checkUpdate != 3
                          ) {
                            activity.subRows?.push(...latestCheckedList);
                            checkUpdate = checkUpdate + 1;
                          }
                          if (
                            activity.Id === backupCheckedList[0]?.Id &&
                            activity.Item_x0020_Type ===
                              backupCheckedList[0]?.Item_x0020_Type &&
                            activity.TaskType?.Title ===
                              backupCheckedList[0]?.TaskType?.Title &&
                            checkUpdate != 3
                          ) {
                            array[index]?.subRows[indexsub]?.subRows[
                              lastIndex
                            ].subRows.splice(activityIndex, 1);
                            checkUpdate = checkUpdate + 1;
                          }

                          if (
                            activity.subRows != undefined &&
                            activity.subRows?.length > 0
                          ) {
                            activity.subRows.forEach(
                              (workstream: any, workstreamIndex: any) => {
                                workstream.isRestructureActive = false;
                                if (
                                  workstream.Id === newItemBackUp?.Id &&
                                  workstream.Item_x0020_Type ===
                                    newItemBackUp?.Item_x0020_Type &&
                                  workstream.TaskType?.Title ===
                                    newItemBackUp?.TaskType?.Title &&
                                  checkUpdate != 3
                                ) {
                                  workstream.subRows?.push(
                                    ...latestCheckedList
                                  );
                                  checkUpdate = checkUpdate + 1;
                                }
                                if (
                                  workstream.Id === backupCheckedList[0]?.Id &&
                                  workstream.Item_x0020_Type ===
                                    backupCheckedList[0]?.Item_x0020_Type &&
                                  workstream.TaskType?.Title ===
                                    backupCheckedList[0]?.TaskType?.Title &&
                                  checkUpdate != 3
                                ) {
                                  array[index]?.subRows[indexsub]?.subRows[
                                    lastIndex
                                  ].subRows[activityIndex]?.subRows.splice(
                                    workstreamIndex,
                                    1
                                  );
                                  checkUpdate = checkUpdate + 1;
                                }

                                if (
                                  activity.subRows != undefined &&
                                  activity.subRows?.length > 0
                                ) {
                                  activity.subRows.forEach(
                                    (task: any, taskIndex: any) => {
                                      task.isRestructureActive = false;
                                      if (
                                        task.Id === newItemBackUp?.Id &&
                                        task.Item_x0020_Type ===
                                          newItemBackUp?.Item_x0020_Type &&
                                        task.TaskType?.Title ===
                                          newItemBackUp?.TaskType?.Title &&
                                        checkUpdate != 3
                                      ) {
                                        task.subRows?.push(
                                          ...latestCheckedList
                                        );
                                        checkUpdate = checkUpdate + 1;
                                      }
                                      if (
                                        task.Id === backupCheckedList[0]?.Id &&
                                        task.Item_x0020_Type ===
                                          backupCheckedList[0]
                                            ?.Item_x0020_Type &&
                                        task.TaskType?.Title ===
                                          backupCheckedList[0]?.TaskType
                                            ?.Title &&
                                        checkUpdate != 3
                                      ) {
                                        array[index]?.subRows[
                                          indexsub
                                        ]?.subRows[lastIndex].subRows[
                                          activityIndex
                                        ]?.subRows[
                                          workstreamIndex
                                        ].subRows?.splice(taskIndex, 1);
                                        checkUpdate = checkUpdate + 1;
                                      }
                                    }
                                  );
                                }
                              }
                            );
                          }
                        }
                      );
                    }
                  });
                }
              });
            }
          });
          
          const sortedArray = array.sort((a: any, b: any) => {
            if (a.Title === "Others") return 1;
            if (b.Title === "Others") return -1;
            return 0;
          });
          setResturuningOpen(false);
          setNewItemBackUp([]);
          setTrueTopCompo(false);
          setControlUseEffect(false);
          restructureCallBack(sortedArray, false);
        });
    } else {
      let array: any = [...allData];
      let ParentTask: any;
      let PortfolioLevel: number = 0;
      let TaskType: any;
      let SiteIconTitle: any;
      let Tasklevel: any;
      let TaskID: any;
      let Portfolio: any;

      if (props?.queryItems != undefined && props?.queryItems != null && props?.queryItems?.Item_x0020_Type !== "Task") {
        if (restructureItem[0]?.TaskType?.Id == 1) {
          Portfolio = {Id: props?.queryItems?.Id,ItemType: props?.queryItems?.Item_x0020_Type,PortfolioStructureID: props?.queryItems?.PortfolioStructureID,Title: props?.queryItems?.Title,},
          ParentTask = null;
          TaskType = 2;
          SiteIconTitle = "T";
        } else {
          Portfolio = {Id: props?.queryItems?.Id,ItemType: props?.queryItems?.Item_x0020_Type,PortfolioStructureID: props?.queryItems?.PortfolioStructureID,Title: props?.queryItems?.Title,},
          ParentTask = null;
          TaskType = 1;
          SiteIconTitle = "A";
        }
      } else if (props?.queryItems != undefined && props?.queryItems != null && props?.queryItems?.TaskType?.Title == "Activities") {
        if (restructureItem[0]?.TaskType?.Id == 3) {
          Portfolio = {Id: props?.queryItems?.Portfolio?.Id,ItemType: props?.queryItems?.Portfolio?.ItemType,PortfolioStructureID:  props?.queryItems?.Portfolio?.PortfolioStructureID,Title: props?.queryItems?.Portfolio?.Title,},
          ParentTask = {Id: props?.queryItems?.Id,Title: props?.queryItems?.Title,TaskID: props?.queryItems?.TaskID,};
          SiteIconTitle = "T";
          TaskType = 2;
        } else {
          Portfolio = {Id: props?.queryItems?.Portfolio?.Id,ItemType: props?.queryItems?.Portfolio?.ItemType,PortfolioStructureID:  props?.queryItems?.Portfolio?.PortfolioStructureID,Title: props?.queryItems?.Portfolio?.Title,},
          ParentTask = {Id: props?.queryItems?.Id,Title: props?.queryItems?.Title,TaskID: props?.queryItems?.TaskID,};
          SiteIconTitle = "W";
          TaskType = 3;
        }
      }

      if (array != undefined && array?.length > 0) {
        array?.map((items: any) => {
          if (items?.TaskType?.Id == TaskType) {
            if (PortfolioLevel <= items?.TaskLevel) {
              PortfolioLevel = items.TaskLevel;
            }
          }
        });
      }

      PortfolioLevel = PortfolioLevel + 1;
      

      TaskID = props?.queryItems?.TaskID != undefined   ? props?.queryItems?.TaskID + "-" + SiteIconTitle + (TaskType == 2 ? restructureItem[0]?.Id :  PortfolioLevel)   : "" + SiteIconTitle + PortfolioLevel;
      if (TaskType == 1) {
        ParentTask = null;
        let web = new Web(restructureItem[0]?.siteUrl);
        await web.lists
          .getById(restructureItem[0]?.listId).items.select("Id,Title,TaskType/Id,TaskType/Title,TaskLevel").expand("TaskType").orderBy("TaskLevel", false).filter("TaskType/Id eq 1").top(1).get()
          .then((componentDetails: any) => {
            if (componentDetails?.length == 0) {
              var LatestId: any = 1;
              TaskID = "A" + LatestId;
              PortfolioLevel = LatestId;
            } else {
              var LatestId = componentDetails[0].TaskLevel + 1;
              TaskID = "A" + LatestId;
              PortfolioLevel = LatestId;
            }


          })
          .catch((err: any) => {
            console.log(err);
          });
      }

      let web = new Web(restructureItem[0]?.siteUrl);
      var postData: any = {
        ParentTaskId: ParentTask == null ? null : ParentTask.Id,
        TaskLevel: PortfolioLevel,
        PortfolioId: Portfolio.Id,
        TaskTypeId: TaskType,
        TaskID: TaskID,
      };
      await web.lists
        .getById(restructureItem[0]?.listId)
        .items.getById(RestructureChecked[0]?.Id)
        .update(postData)
        .then((items: any) => {
          let checkUpdate: number = 1;
          let array: any = [...allData];
          let backupCheckedList: any = [];
          let latestCheckedList: any = [];
          restructureItem?.map((items: any) => {
            latestCheckedList?.push({ ...items });
            backupCheckedList?.push({ ...items });
          });

          latestCheckedList?.map((items: any) => {
            items.ParentTask = ParentTask == null ? {} : ParentTask,
            items.Portfolio = Portfolio,
            items.TaskLevel = PortfolioLevel,
            items.TaskType = {Id: TaskType,Level: TaskType == 1 ? 1 : TaskType == 2 ? 3 : 2,Title: TaskType == 1  ? "Activity"  : TaskType == 2  ? "Task"  : "Workstream",},
            items.TaskID = TaskID;
          });

          let onceRender: any = true;
          array?.map((obj: any, index: any) => {
            obj.isRestructureActive = false;
            if (( newItemBackUp == undefined || newItemBackUp == null) && onceRender && checkUpdate != 3) {
              array?.push(...latestCheckedList);
              checkUpdate = checkUpdate + 1;
              onceRender = false;
            }
            if ( newItemBackUp !== undefined && newItemBackUp !== null && newItemBackUp?.length !== 0 && obj.Id === newItemBackUp?.Id && obj?.Title != 'Others' &&  obj.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && obj.TaskType?.Title === newItemBackUp?.TaskType?.Title && checkUpdate != 3
            ) {
              obj.subRows?.push(...latestCheckedList);
              checkUpdate = checkUpdate + 1;
            }
            if (obj.Id === backupCheckedList[0]?.Id &&obj.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type &&obj.TaskType?.Title === backupCheckedList[0]?.TaskType?.Title &&checkUpdate != 3
            ) {
              array.splice(index, 1);
              checkUpdate = checkUpdate + 1;
            }

            if (obj.subRows != undefined && obj.subRows?.length > 0) {
              obj.subRows.forEach((sub: any, indexsub: any) => {
                sub.isRestructureActive = false;
                if ( newItemBackUp !== undefined &&  newItemBackUp !== null && newItemBackUp?.length !== 0 && sub.Id === newItemBackUp?.Id && sub.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && sub.TaskType?.Title === newItemBackUp?.TaskType?.Title && checkUpdate != 3
                ) {
                  sub.subRows?.push(...latestCheckedList);
                  checkUpdate = checkUpdate + 1;
                }
                if (sub.Id === backupCheckedList[0]?.Id && sub.Item_x0020_Type ===   backupCheckedList[0]?.Item_x0020_Type && sub.TaskType?.Title ===   backupCheckedList[0]?.TaskType?.Title && checkUpdate != 3
                ) {
                  array[index]?.subRows.splice(indexsub, 1);
                  checkUpdate = checkUpdate + 1;
                }

                if (sub.subRows != undefined && sub.subRows?.length > 0) {
                  sub.subRows.forEach((newsub: any, lastIndex: any) => {
                    newsub.isRestructureActive = false;
                    if (newItemBackUp !== undefined &&newItemBackUp !== null &&newItemBackUp?.length !== 0 &&newsub.Id === newItemBackUp?.Id &&newsub.Item_x0020_Type ===  newItemBackUp?.Item_x0020_Type &&newsub.TaskType?.Title ===  newItemBackUp?.TaskType?.Title &&checkUpdate != 3) {
                      newsub.subRows?.push(...latestCheckedList);
                      checkUpdate = checkUpdate + 1;
                    }
                    if (newsub.Id === backupCheckedList[0]?.Id &&newsub.Item_x0020_Type ===  backupCheckedList[0]?.Item_x0020_Type &&newsub.TaskType?.Title ===  backupCheckedList[0]?.TaskType?.Title &&checkUpdate != 3) {
                      array[index]?.subRows[indexsub]?.subRows.splice(
                        lastIndex,
                        1
                      );
                      checkUpdate = checkUpdate + 1;
                    }
                   if (newsub.subRows != undefined &&newsub.subRows?.length > 0) {
                      newsub.subRows.forEach(
                        (activity: any, activityIndex: any) => {
                          activity.isRestructureActive = false;
                          if (newItemBackUp !== undefined &&newItemBackUp !== null &&newItemBackUp?.length !== 0 &&activity.Id === newItemBackUp?.Id &&activity.Item_x0020_Type ===  newItemBackUp?.Item_x0020_Type &&activity.TaskType?.Title ===  newItemBackUp?.TaskType?.Title &&checkUpdate != 3) {
                            activity.subRows?.push(...latestCheckedList);
                            checkUpdate = checkUpdate + 1;
                          }
                          if (activity.Id === backupCheckedList[0]?.Id &&activity.Item_x0020_Type ===  backupCheckedList[0]?.Item_x0020_Type &&activity.TaskType?.Title ===  backupCheckedList[0]?.TaskType?.Title &&checkUpdate != 3 ) {
                            array[index]?.subRows[indexsub]?.subRows[
                              lastIndex
                            ].subRows.splice(activityIndex, 1);
                            checkUpdate = checkUpdate + 1;
                          }
                          if ( activity.subRows != undefined && activity.subRows?.length > 0) {
                            activity.subRows.forEach(
                              (workstream: any, workstreamIndex: any) => {
                                workstream.isRestructureActive = false;
                                if (newItemBackUp !== undefined &&newItemBackUp !== null &&newItemBackUp?.length !== 0 &&workstream.Id === newItemBackUp?.Id &&workstream.Item_x0020_Type ===  newItemBackUp?.Item_x0020_Type &&workstream.TaskType?.Title ===  newItemBackUp?.TaskType?.Title &&checkUpdate != 3) {
                                  workstream.subRows?.push(
                                    ...latestCheckedList
                                  );
                                  checkUpdate = checkUpdate + 1;
                                }
                                if (workstream.Id === backupCheckedList[0]?.Id &&workstream.Item_x0020_Type ===  backupCheckedList[0]?.Item_x0020_Type &&workstream.TaskType?.Title ===  backupCheckedList[0]?.TaskType?.Title &&checkUpdate != 3
                                ) {
                                  array[index]?.subRows[indexsub]?.subRows[
                                    lastIndex
                                  ].subRows[activityIndex]?.subRows.splice(
                                    workstreamIndex,
                                    1
                                  );
                                  checkUpdate = checkUpdate + 1;
                                }

                                if (
                                  activity.subRows != undefined &&
                                  activity.subRows?.length > 0
                                ) {
                                  activity.subRows.forEach(
                                    (task: any, taskIndex: any) => {
                                      task.isRestructureActive = false;
                                      if (newItemBackUp !== undefined &&newItemBackUp !== null &&newItemBackUp?.length !== 0 &&task.Id === newItemBackUp?.Id &&task.Item_x0020_Type ===  newItemBackUp?.Item_x0020_Type &&task.TaskType?.Title ===  newItemBackUp?.TaskType?.Title &&checkUpdate != 3) {
                                        task.subRows?.push(
                                          ...latestCheckedList
                                        );
                                        checkUpdate = checkUpdate + 1;
                                      }
                                      if (
                                        task.Id === backupCheckedList[0]?.Id &&
                                        task.Item_x0020_Type ===
                                          backupCheckedList[0]
                                            ?.Item_x0020_Type &&
                                        task.TaskType?.Title ===
                                          backupCheckedList[0]?.TaskType
                                            ?.Title &&
                                        checkUpdate != 3
                                      ) {
                                        array[index]?.subRows[
                                          indexsub
                                        ]?.subRows[lastIndex].subRows[
                                          activityIndex
                                        ]?.subRows[
                                          workstreamIndex
                                        ].subRows?.splice(taskIndex, 1);
                                        checkUpdate = checkUpdate + 1;
                                      }
                                    }
                                  );
                                }
                              }
                            );
                          }
                        }
                      );
                    }
                  });
                }
              });
            }
          });

          const sortedArray = array.sort((a: any, b: any) => {
            if (a.Title === "Others") return 1;
            if (b.Title === "Others") return -1;
            return 0;
          });
          setResturuningOpen(false);
          setTrueTopCompo(false);
          setNewItemBackUp([]);
          setControlUseEffect(false);
          restructureCallBack(sortedArray, false);
        })
        .catch((err: any) => {
          console.log(err);
        });
    }
  };

  function setRestructure (item: any, title: any) {
    let array: any = [];
    let data: any = {};
    item?.map((items: any) => {
      if (items != undefined && title === "SubComponent") {
        data ={Item_x0020_Type: "SubComponent",siteIcon: "S",};
      }
      if (items != undefined && title === "Feature") {
        data ={Item_x0020_Type: "Feature",siteIcon: "F",};
      }
      if (items != undefined && title === 3) {
        data ={Item_x0020_Type: "Task",TaskType: { Id: 3 ,Title:'Workstream'},};
      }
      if (items != undefined && title === 2) {
        data ={Item_x0020_Type: "Task",TaskType: { Id: 2, Title:'Task'},};
      }
      if (items != undefined && title === 1) {
        data ={Item_x0020_Type: "Task",TaskType: { Id: 1,Title:'Activities' },};
      }
    });
    let b = item[0];
    array?.push({...b,...data});
    setRestructureChecked(array);
  };

  const onRenderCustomCalculateS1C = () => {
    return (
      <>
        <div className="subheading siteColor">Restucturing Tool -
        
          <>
           {restructureTitle?.map((items: any) => (
                        <a
                          data-interception="off"
                          target="_blank"
                          className="hreflink mx-2 f-16"
                          // href={
                          //   restructureItem[0]?.Item_x0020_Type != "Task"
                          //     ? props?.contextValue?.siteUrl +
                          //       "/SitePages/Portfolio-Profile.aspx?taskId=" +
                          //       restructureItem[0]?.Id
                          //     : props?.contextValue?.siteUrl + "/SitePages/Task-Profile.aspx?taskId=" + items?.Id + "&Site=" + restructureItem[0]?.siteType
                          // }
                        >
                        
                        {
                          newItemBackUp?.Item_x0020_Type === "Component" && items?.Item_x0020_Type === "Component" ? <span className="Dyicons mt--5 me-2"> S </span> : (
                            newItemBackUp?.Item_x0020_Type == "SubComponent" && (items?.Item_x0020_Type === "Component" || items?.Item_x0020_Type === "SubComponent") ? 
                            <span className="Dyicons mt--5 me-2">F</span> : (
                              items?.Item_x0020_Type === "Task" ? <img className="workmember mt--5 me-2" src={items?.siteIcon} />  : <span className="Dyicons mt--5 me-2">{items?.siteIcon}</span>
                            )

                          )
                        }
                          - <span className="mx-2">
                          <ReactPopperTooltipSingleLevel CMSToolId={RestructureChecked[0]?.TaskID} row={RestructureChecked[0]} AllListId={props?.contextValue} singleLevel={true} masterTaskData={props?.AllMasterTasksData} AllSitesTaskData={props?.AllSitesTaskData} />
                            {/* {
                            newItemBackUp?.Item_x0020_Type != "Task" ?
                            (newItemBackUp?.TaskType?.Id == 1 || newItemBackUp?.TaskType?.Id == 3 ? items?.TaskID : (newItemBackUp?.TaskType?.Id == 2 ? items?.Id : ``) ) : (newItemBackUp?.TaskType?.Id == 1 ? (items?.TaskType?.Id == 2 ? (`${newItemBackUp?.TaskID}-T${items?.Id}`) :
                             (`${items?.TaskType?.Id == 3 ? (`${newItemBackUp?.TaskID}-W`) : ('') }`)) : (newItemBackUp?.TaskType?.Id == 3 ? (`${newItemBackUp?.TaskID}-T${items?.Id}`) : ''))
                          } */}
                          </span>-  {items?.Title}
                        </a>
                    ))}
          </></div>
        <Tooltip ComponentId="454" />
      </>
    );
  };

  // <div className="my-1">
  //             Selected Item will restructure into the
  //               {
  //                newItemBackUp?.Item_x0020_Type == "Project" && newItemBackUp?.Item_x0020_Type !== undefined && newItemBackUp?.Item_x0020_Type !== null ?
  //                (RestructureChecked?.Item_x0020_Type == "Sprint" ? " Sprint " : RestructureChecked?.TaskType?.Title)  : " Project "
  //               }
  //             inside
  //             {newItemBackUp?.Item_x0020_Type == "Project" ?
  //               <span className="Dyicons me-1 ms-1">
  //                 P
  //               </span> : 
  //                 <img
  //                 className="workmember"
  //                 src={
  //                   newItemBackUp.SiteIcon
  //                 }
  //               />
  //             }
  //             {" " + newItemBackUp?.Title }
  //           </div>
  const onRenderCustomCalculateSCProject = () => {
    return (
      <>
        <div className="subheading siteColor">Restucturing Tool -
        
          <>
           {restructureTitle?.map((items: any) => (
                        <a
                          data-interception="off"
                          target="_blank"
                          className="hreflink mx-2 f-16"
                          // href={
                          //   restructureItem[0]?.Item_x0020_Type != "Task"
                          //     ? props?.contextValue?.siteUrl +
                          //       "/SitePages/Portfolio-Profile.aspx?taskId=" +
                          //       restructureItem[0]?.Id
                          //     : props?.contextValue?.siteUrl + "/SitePages/Task-Profile.aspx?taskId=" + items?.Id + "&Site=" + restructureItem[0]?.siteType
                          // }
                        >
                        
                        {
                 newItemBackUp?.Item_x0020_Type == "Project" && newItemBackUp?.Item_x0020_Type !== undefined && newItemBackUp?.Item_x0020_Type !== null ?
                 (RestructureChecked[0]?.Item_x0020_Type == "Sprint" ? <span className="Dyicons mt--5 me-2">X</span> : (RestructureChecked[0]?.Item_x0020_Type == "Project" ? <span className="Dyicons mt--5 me-2">P</span> : <img className="workmember mt--5 me-2" src={items?.SiteIcon} /> ) ) : <span className="Dyicons mt--5 me-2">P</span>
                }
                          - <span className="mx-2">
                          <ReactPopperTooltipSingleLevel CMSToolId={RestructureChecked[0]?.TaskID} row={RestructureChecked[0]} AllListId={props?.contextValue} singleLevel={true} masterTaskData={props?.AllMasterTasksData} AllSitesTaskData={props?.AllSitesTaskData} />
                            {/* {
                            newItemBackUp?.Item_x0020_Type != "Task" ?
                            (newItemBackUp?.TaskType?.Id == 1 || newItemBackUp?.TaskType?.Id == 3 ? items?.TaskID : (newItemBackUp?.TaskType?.Id == 2 ? items?.Id : ``) ) : (newItemBackUp?.TaskType?.Id == 1 ? (items?.TaskType?.Id == 2 ? (`${newItemBackUp?.TaskID}-T${items?.Id}`) :
                             (`${items?.TaskType?.Id == 3 ? (`${newItemBackUp?.TaskID}-W`) : ('') }`)) : (newItemBackUp?.TaskType?.Id == 3 ? (`${newItemBackUp?.TaskID}-T${items?.Id}`) : ''))
                          } */}
                          </span>-  {items?.Title}
                        </a>
                    ))}
          </></div>
        <Tooltip ComponentId="454" />
      </>
    );
  };

  const onRenderCustomCalculateS4CProject = () => {
    return (
      <>
        <div className="subheading siteColor">Restucturing Tool -
        
          <>
           {restructureTitle?.map((items: any) => (
                        <a
                          data-interception="off"
                          target="_blank"
                          className="hreflink mx-2 f-16"
                          // href={
                          //   restructureItem[0]?.Item_x0020_Type != "Task"
                          //     ? props?.contextValue?.siteUrl +
                          //       "/SitePages/Portfolio-Profile.aspx?taskId=" +
                          //       restructureItem[0]?.Id
                          //     : props?.contextValue?.siteUrl + "/SitePages/Task-Profile.aspx?taskId=" + items?.Id + "&Site=" + restructureItem[0]?.siteType
                          // }
                        >
                        
                        {newItemBackUp?.Item_x0020_Type == "Sprint" ?
                <span className="Dyicons mt--5 me-2">
                  X
                </span> : (newItemBackUp?.TaskType?.Id == 1 || newItemBackUp?.TaskType?.Id == 3 ?  <img
                            className="workmember mt--5 me-2"
                              src={newItemBackUp?.SiteIcon}
                            /> : <span className="Dyicons mt--5 me-2">
                            P
                          </span>)
              }
                          - <span className="mx-2">
                          <ReactPopperTooltipSingleLevel CMSToolId={RestructureChecked[0]?.TaskID} row={RestructureChecked[0]} AllListId={props?.contextValue} singleLevel={true} masterTaskData={props?.AllMasterTasksData} AllSitesTaskData={props?.AllSitesTaskData} />
                            {/* {
                            newItemBackUp?.Item_x0020_Type != "Task" ?
                            (newItemBackUp?.TaskType?.Id == 1 || newItemBackUp?.TaskType?.Id == 3 ? items?.TaskID : (newItemBackUp?.TaskType?.Id == 2 ? items?.Id : ``) ) : (newItemBackUp?.TaskType?.Id == 1 ? (items?.TaskType?.Id == 2 ? (`${newItemBackUp?.TaskID}-T${items?.Id}`) :
                             (`${items?.TaskType?.Id == 3 ? (`${newItemBackUp?.TaskID}-W`) : ('') }`)) : (newItemBackUp?.TaskType?.Id == 3 ? (`${newItemBackUp?.TaskID}-T${items?.Id}`) : ''))
                          } */}
                          </span>-  {items?.Title}
                        </a>
                    ))}
          </></div>
        <Tooltip ComponentId="454" />
      </>
    );
  };

  const onRenderCustomCalculateSCmulti = () => {
    return (
      <>
        <div className="subheading siteColor">Restucturing Tool</div>
        <div>
          <Tooltip ComponentId="454" />
        </div>
      </>
    );
  };

  
  const projectMngmntFuc = async () => {
  let web = new Web(props?.contextValue?.siteUrl);
let latestCheckedList:any = [];
let backupCheckedList:any = [];
let array = [...allData];

if (newItemBackUp?.Item_x0020_Type == 'Sprint' || newItemBackUp?.Item_x0020_Type == 'Project' || newItemBackUp == null) {
  const updateItem = async (item: any) => {
    await web.lists.getById(item?.listId).items.getById(item?.Id).update({
      ProjectId: newItemBackUp ? newItemBackUp?.Id : props?.MasterdataItem?.Id
    });
  };

  const processItems = async (items: any) => {
    for (const item of items) {
      await updateItem(item);
      if (item?.subRows?.length > 0) {
        await processItems(item?.subRows);
      }
    }
  };

  let onceRender = true;
  let spliceData = false;
  let pushData = false;

  // Create an array of promises for all the asynchronous operations
  const promises = restructureItem?.map(async (items: any) => {
    await updateItem(items);

    if (items?.subRows?.length > 0) {
      await processItems(items?.subRows);
    }

    restructureItem?.map((items: any) => {
      latestCheckedList?.push({ ...items });
      backupCheckedList?.push({ ...items });
    });

    latestCheckedList?.map((items: any) => {
      items.Project = newItemBackUp != null && newItemBackUp != undefined ? { Id: newItemBackUp?.Id, Title: newItemBackUp?.Title } : { Id: props?.MasterdataItem?.Id, Title: props?.MasterdataItem?.Title };
    });

    const updateProjects = (arr: any[]) => {
      const updatedArray: any[] = [];
    
      const updateRecursively = (objects: any[]) => {
        objects.forEach((obj: any) => {
          obj.isRestructureActive = false;
    
          if (!spliceData && obj.Id === backupCheckedList[0]?.Id && obj.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type) {
            spliceData = true;
            return; // Skip this item
          }
    
          if (!pushData && onceRender && newItemBackUp === null) {
            onceRender = false;
            pushData = true;
            updatedArray.push(...latestCheckedList);
          }
    
          if (!pushData && obj.Id === newItemBackUp?.Id && obj.Item_x0020_Type === newItemBackUp?.Item_x0020_Type) {
            pushData = true;
            obj.subRows = obj.subRows ? [...obj.subRows, ...latestCheckedList] : [...latestCheckedList];
          }
    
          if (obj.subRows?.length > 0) {
            updateRecursively(obj.subRows);
          }
    
          updatedArray.push(obj);
        });
      };
    
      updateRecursively(arr);
    
      // Clear the original array and add items from the updated array
      arr.length = 0;
      arr.push(...updatedArray);
    };
    
    // Call the function with your array
    updateProjects(array);
    
    
    
  });

  // Wait for all promises to resolve before executing the next lines
  await Promise.all(promises);

  // Execute the lines after all the functions have been called
  setProjects(false);
  setNewItemBackUp([]);
  setNewItemBackUp(null);
  setOldArrayBackup([]);
  restructureCallBack(array, false);
  setProjectmngmnt(false);
  setTopProject(false);
}else{
        let ParentTask_Portfolio: any = newItemBackUp?.TaskType?.Id == 1 || newItemBackUp?.TaskType?.Id == 3    ? newItemBackUp?.Portfolio?.Id   : newItemBackUp?.Id;
        let ParentTask_ID: any = newItemBackUp?.TaskType?.Id == 1 || newItemBackUp?.TaskType?.Id == 3  ? newItemBackUp?.Id : null;
        let Project_ID: any = newItemBackUp?.TaskType?.Id == 1 || newItemBackUp?.TaskType?.Id == 3  ? newItemBackUp?.Project?.Id : null;
        let TaskLevel: number = 0;
        let Level: number = 0;
        if ( newItemBackUp?.subRows != undefined && newItemBackUp?.subRows?.length > 0 && restructureItem[0]?.TaskType?.Id == 3) {
          newItemBackUp?.subRows?.map((sub: any) => {
            if (restructureItem[0]?.TaskType?.Id === sub?.TaskType?.Id) {
              if (TaskLevel <= sub.TaskLevel) {
                TaskLevel = sub.TaskLevel;
                Level = sub.TaskLevel;
              }
            }
          });
        }
        let array: any = [...allData];
        let count: number = 0;
  
        restructureItem?.map(async (items: any, index: any) => {
          let TaskId = newItemBackUp?.TaskID == undefined ? null : newItemBackUp?.TaskID;
          TaskLevel = TaskLevel + 1;
          let web = new Web(items.siteUrl);
          TaskId = RestructureChecked[0]?.TaskType?.Id == 2   ? "T" + items?.Id   : RestructureChecked[0]?.TaskType?.Id == 1   ? items?.TaskID   : TaskId + "-" + "W" + TaskLevel;
  
          if (newItemBackUp?.TaskType?.Id == 1 || newItemBackUp?.TaskType?.Id == 3) {
            ParentTask_Portfolio = {  Id: newItemBackUp?.Portfolio?.Id,  ItemType: newItemBackUp?.Portfolio?.ItemType,  PortfolioStructureID:    newItemBackUp?.Portfolio?.PortfolioStructureID,  Title: newItemBackUp?.Portfolio?.Title,},
              ParentTask_ID = {Id: newItemBackUp?.Id,Title: newItemBackUp?.Title,TaskID: newItemBackUp?.TaskID,};
              Project_ID = {Id: newItemBackUp?.Project?.Id,Title: newItemBackUp?.Project?.Title}
          } 
          var postData: any = {
            ParentTaskId: ParentTask_ID == null ? null : ParentTask_ID.Id,
            PortfolioId: ParentTask_Portfolio.Id,
            ProjectId: Project_ID.Id,
            TaskLevel: TaskLevel,
            TaskTypeId: RestructureChecked[0]?.TaskType.Id,
            TaskID: TaskId,
          };
  
          await web.lists
            .getById(items.listId)
            .items.getById(items.Id)
            .update(postData)
            .then(async (res: any) => {
              let TaskId =
                newItemBackUp?.TaskID == undefined ? null : newItemBackUp?.TaskID;
  
              count = count + 1;
              let backupCheckedList: any = [];
              let latestCheckedList: any = [];
  
              latestCheckedList?.push({ ...items });
              backupCheckedList?.push({ ...items });
  
              latestCheckedList?.map((itemss: any) => {
                Level = Level + 1;
                (itemss.ParentTask = { Id: ParentTask_ID }),
                  (itemss.TaskLevel = Level),
                  (itemss.TaskTypeId = RestructureChecked[0]?.TaskType.Id),
                  (itemss.TaskID =
                    RestructureChecked[0]?.TaskType?.Id == 2
                      ? "T" + itemss?.Id
                      : RestructureChecked[0]?.TaskType?.Id == 1
                      ? itemss?.TaskID
                      : TaskId + "-" + "W" + Level);
                itemss.Portfolio = ParentTask_Portfolio;
                itemss.Project = Project_ID;
              });
  
              function processArray(arr: any, pushData: any, spliceData: any) {
                arr?.map((obj: any, index: any) => {
                  if (!spliceData || !pushData) {
                    obj.isRestructureActive = false;
  
                    if (
                      !spliceData &&
                      obj.Id === backupCheckedList[0]?.Id &&
                      obj.Item_x0020_Type ===
                        backupCheckedList[0]?.Item_x0020_Type &&
                      obj.TaskType?.Title ===
                        backupCheckedList[0]?.TaskType?.Title &&
                      obj.Portfolio?.Id == backupCheckedList[0]?.Portfolio?.Id &&
                      obj.ParentTask?.Id == backupCheckedList[0]?.ParentTask?.Id
                    ) {
                      arr.splice(index, 1);
                      spliceData = true;
                    }
  
                    if (
                      !pushData &&
                      obj.Id === newItemBackUp?.Id &&
                      obj.Item_x0020_Type === newItemBackUp?.Item_x0020_Type &&
                      obj.TaskType?.Title === newItemBackUp?.TaskType?.Title &&
                      obj.Portfolio?.Id == newItemBackUp?.Portfolio?.Id
                    ) {
                      obj.subRows?.push(...latestCheckedList);
                      pushData = true;
                    }
  
                    if (obj.subRows != undefined && obj.subRows?.length > 0) {
                      processArray(obj.subRows, pushData, spliceData);
                    }
                  }
                });
              }
  
              processArray(array, false, false);
              if (count === restructureItem?.length) {
                setProjects(false);
                setNewItemBackUp([]);
                setNewItemBackUp(null);
                setOldArrayBackup([]);
                restructureCallBack(array, false);
                setProjectmngmnt(false);
                setTopProject(false);
              }
            });
        });
      
    }
    
    

};




  const closePanel = () => {
    setResturuningOpen(false);
    setTrueTopCompo(false);
    let array = allData;
    array?.map((obj: any) => {
      obj.isRestructureActive = false;
      if (obj?.subRows?.length > 0 && obj?.subRows != undefined) {
        obj?.subRows?.map((sub: any) => {
          sub.isRestructureActive = false;
          if (sub?.subRows?.length > 0 && sub?.subRows != undefined) {
            sub?.subRows?.map((feature: any) => {
              feature.isRestructureActive = false;
              if (
                feature?.subRows?.length > 0 &&
                feature?.subRows != undefined
              ) {
                feature?.subRows?.map((activity: any) => {
                  activity.isRestructureActive = false;
                  if (
                    activity?.subRows?.length > 0 &&
                    activity?.subRows != undefined
                  ) {
                    activity?.subRows?.map((wrkstrm: any) => {
                      wrkstrm.isRestructureActive = false;
                      if (
                        wrkstrm?.subRows?.length > 0 &&
                        wrkstrm?.subRows != undefined
                      ) {
                        wrkstrm?.subRows?.map((task: any) => {
                          task.isRestructureActive = false;
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
    });
    restructureCallBack(array, false);
  };

  return (
    <>
      <button
        type="button"
        title="Restructure"
        className="btn btn-primary"
        style={{
          backgroundColor: `${props?.portfolioColor}`,
          borderColor: `${props?.portfolioColor}`,
          color: "#fff",
        }}
        onClick={buttonRestructureCheck}
      >
        Restructure
      </button>

      {ResturuningOpen === true && selectedItems?.length == 1? (
        <Panel
          onRenderHeader={onRenderCustomCalculateS1C}
          type={PanelType.large}
          isOpen={ResturuningOpen}
          isBlocking={false}
          onDismiss={closePanel}
        >
          <div>
         
            <label className="fw-bold form-label full-width"> Old: </label>
            <div
              className="alignCenter border p-1"
              style={{ flexWrap: "wrap" }}
            >
              {OldArrayBackup?.map(function (obj: any) {
                return (
                  <div className="mainParentSec">
                    {
                      obj?.Title != "Others" && 
                      <div className="reStuMainTiles">

                      <div className="reStuTile">
                      <div className={`${obj?.newSubChild != undefined && obj?.newSubChild != null ? 'alignCenter' : 'alignCenter fw-semibold'}`}>
                      {
                          obj?.siteIcon?.length === 1 ? (
                            <div className="Dyicons">
                              {obj.siteIcon}
                            </div>
                          ) : 
                           <img className="workmember" src={obj?.siteIcon} />
                       }
                        <span className="mx-2">
                        <ReactPopperTooltipSingleLevel CMSToolId={obj?.TaskID} row={obj} AllListId={props?.contextValue} singleLevel={true} masterTaskData={props?.AllMasterTasksData} AllSitesTaskData={props?.AllSitesTaskData} />
                        </span>
                    
                      <a
                        data-interception="off"
                        target="_blank"
                        className="serviceColor_Active"
                        href={
                          obj?.Title != "Others"
                            ? obj.Item_x0020_Type != "Task"
                              ? props?.contextValue?.siteUrl +
                                "/SitePages/Portfolio-Profile.aspx?taskId=" +
                                obj?.Id
                              : props?.contextValue?.siteUrl +
                                "/SitePages/Task-Profile.aspx?taskId=" +
                                obj?.Id +
                                "&Site=" +
                                restructuredItemarray[0]?.siteType
                            : ""
                        }
                      >
                        
                         {obj?.newSubChild != undefined &&
                    obj?.newSubChild != null ? (
                     ""
                    ) : (
                      obj?.Title != "Others" ? (
                        <div className="alignCenter">{obj?.Title}</div>
                      ) : (
                        "Others"
                      )
                    )}
                        
                      </a></div>
                     </div>

                    </div>
                    }
                   
                   
                    {obj?.newSubChild ? (
                      <>
                        <div className="reStuMainTiles">
                        <div className="reStuTile">
                        <div className={`${obj?.newSubChild?.newFeatChild != undefined && obj?.newSubChild?.newFeatChild != null ? 'alignCenter' : 'alignCenter fw-semibold'}`}>
                        {obj?.newSubChild?.siteIcon === "S" ||
                            obj?.newSubChild?.siteIcon === "F" ? (
                              <span className="Dyicons me-1">
                                {obj?.newSubChild?.siteIcon}
                              </span>
                            ) : 
                                <img
                                  className="workmember"
                                  src={obj?.newSubChild?.siteIcon}
                                />
                            }
                        <span className="mx-2">
                        <ReactPopperTooltipSingleLevel CMSToolId={obj?.newSubChild?.TaskID} row={obj?.newSubChild} AllListId={props?.contextValue} singleLevel={true} masterTaskData={props?.AllMasterTasksData} AllSitesTaskData={props?.AllSitesTaskData} />
                        </span>
                          <a
                            className=""
                            data-interception="off"
                            target="_blank"
                            href={
                              obj?.newSubChild?.Title != "Others"
                                ? obj?.newSubChild.Item_x0020_Type != "Task"
                                  ? props?.contextValue?.siteUrl +
                                    "/SitePages/Portfolio-Profile.aspx?taskId=" +
                                    obj?.newSubChild?.Id
                                  : props?.contextValue?.siteUrl +
                                    "/SitePages/Task-Profile.aspx?taskId=" +
                                    obj?.newSubChild?.Id +
                                    "&Site=" +
                                    restructuredItemarray[0]?.siteType
                                : ""
                            }
                          >
                         {/* <div className="alignCenter">{obj?.newSubChild?.TaskID}</div> */}
                            
                              {obj?.newSubChild?.newFeatChild != undefined &&
                        obj?.newSubChild?.newFeatChild != null ? (
                     ""
                    ) : obj?.newSubChild?.Title}
                            
                          </a>
                          </div>
                          </div>
                        </div>
                    
                      </>
                    ) : (
                      ""
                    )}
                    {obj?.newSubChild?.newFeatChild ? (
                      <>
                        <div className="reStuMainTiles">
                        <div className="reStuTile">
                        <div className={`${obj?.newSubChild?.newFeatChild?.newActChild != undefined && obj?.newSubChild?.newFeatChild?.newActChild != null ? 'alignCenter' : 'alignCenter fw-semibold'}`}>
                        {obj?.newSubChild?.newFeatChild?.siteIcon ===
                            "F" ? (
                              <span className="Dyicons me-1">
                                {obj?.newSubChild?.newFeatChild?.siteIcon}
                              </span>
                            ) : (
                                <img
                                  className="workmember"
                                  src={obj?.newSubChild?.newFeatChild?.siteIcon}
                                />
                            )}
                            <span className="mx-2">
                            <ReactPopperTooltipSingleLevel CMSToolId={obj?.newSubChild?.newFeatChild?.TaskID} row={obj?.newSubChild?.newFeatChild} AllListId={props?.contextValue} singleLevel={true} masterTaskData={props?.AllMasterTasksData} AllSitesTaskData={props?.AllSitesTaskData} />
                         
                              </span>
                         
                          <a
                            className=""
                            data-interception="off"
                            target="_blank"
                            href={
                              obj?.newSubChild?.newFeatChild?.Title != "Others"
                                ? obj?.newSubChild?.newFeatChild
                                    .Item_x0020_Type != "Task"
                                  ? props?.contextValue?.siteUrl +
                                    "/SitePages/Portfolio-Profile.aspx?taskId=" +
                                    obj?.newSubChild?.newFeatChild?.Id
                                  : props?.contextValue?.siteUrl +
                                    "/SitePages/Task-Profile.aspx?taskId=" +
                                    obj?.newSubChild?.newFeatChild?.Id +
                                    "&Site=" +
                                    restructuredItemarray[0]?.siteType
                                : ""
                            }
                          >
                            {obj?.newSubChild?.newFeatChild?.newActChild !=
                          undefined &&
                        obj?.newSubChild?.newFeatChild?.newActChild != null ? (
                     ""
                    ) : obj?.newSubChild?.newFeatChild?.Title}
                            
                          </a></div>
                            </div>
                        </div>
                       
                      </>
                    ) : (
                      ""
                    )}
                    {obj?.newSubChild?.newFeatChild?.newActChild ? (
                      <>
                        <div className="reStuMainTiles">
                        <div className="reStuTile">
                        <div className={`${obj?.newSubChild?.newFeatChild?.newActChild?.newWrkChild != undefined && obj?.newSubChild?.newFeatChild?.newActChild?.newWrkChild != null ? 'alignCenter' : 'alignCenter fw-semibold'}`}>
                        <img
                              className="workmember"
                              src={
                                obj?.newSubChild?.newFeatChild?.newActChild
                                  ?.siteIcon
                              }
                            />
                            <span className="mx-2">
                            <ReactPopperTooltipSingleLevel CMSToolId={obj?.newSubChild?.newFeatChild?.newActChild?.TaskID} row={obj?.newSubChild?.newFeatChild?.newActChild} AllListId={props?.contextValue} singleLevel={true} masterTaskData={props?.AllMasterTasksData} AllSitesTaskData={props?.AllSitesTaskData} />
                         
                            </span>
                        
                          <a
                            data-interception="off"
                            target="_blank"
                            href={
                              obj?.newSubChild?.newFeatChild?.newActChild
                                ?.Title != "Others"
                                ? obj?.newSubChild?.newFeatChild?.newActChild
                                    .Item_x0020_Type != "Task"
                                  ? props?.contextValue?.siteUrl +
                                    "/SitePages/Portfolio-Profile.aspx?taskId=" +
                                    obj?.newSubChild?.newFeatChild?.newActChild
                                      ?.Id
                                  : props?.contextValue?.siteUrl +
                                    "/SitePages/Task-Profile.aspx?taskId=" +
                                    obj?.newSubChild?.newFeatChild?.newActChild
                                      ?.Id +
                                    "&Site=" +
                                    restructuredItemarray[0]?.siteType
                                : ""
                            }
                            className=""
                          >
                             {/* <div className="alignCenter">{obj?.newSubChild?.newFeatChild?.newActChild?.TaskID}</div> */}
                           
                              {obj?.newSubChild?.newFeatChild?.newActChild
                          ?.newWrkChild != undefined &&
                        obj?.newSubChild?.newFeatChild?.newActChild
                          ?.newWrkChild != null ? (
                     ""
                    ) : obj?.newSubChild?.newFeatChild?.newActChild?.Title}
                          </a></div>
                            </div>
                        </div>
                      
                      </>
                    ) : (
                      ""
                    )}
                    {obj?.newSubChild?.newFeatChild?.newActChild
                      ?.newWrkChild ? (
                      <>
                        <div className="reStuMainTiles">
                        <div className="reStuTile">
                        <div className={`${obj?.newSubChild?.newFeatChild?.newActChild?.newWrkChild?.newTskChild != undefined && obj?.newSubChild?.newFeatChild?.newActChild?.newWrkChild?.newTskChild != null ? 'alignCenter' : 'alignCenter fw-semibold'}`}>
                        <img
                              className="workmember"
                              src={
                                obj?.newSubChild?.newFeatChild?.newActChild
                                  ?.newWrkChild?.siteIcon
                              }
                            />
                            <span className="mx-2">
                            <ReactPopperTooltipSingleLevel CMSToolId={obj?.newSubChild?.newFeatChild?.newActChild?.newWrkChild?.TaskID} row={obj?.newSubChild?.newFeatChild?.newActChild?.newWrkChild} AllListId={props?.contextValue} singleLevel={true} masterTaskData={props?.AllMasterTasksData} AllSitesTaskData={props?.AllSitesTaskData} />
                         
                            </span>
                        
                          <a
                            data-interception="off"
                            target="_blank"
                            href={
                              obj?.newSubChild?.newFeatChild?.newActChild
                                ?.newWrkChild?.Title != "Others"
                                ? obj?.newSubChild?.newFeatChild?.newActChild
                                    ?.newWrkChild.Item_x0020_Type != "Task"
                                  ? props?.contextValue?.siteUrl +
                                    "/SitePages/Portfolio-Profile.aspx?taskId=" +
                                    obj?.newSubChild?.newFeatChild?.newActChild
                                      ?.newWrkChild?.Id
                                  : props?.contextValue?.siteUrl +
                                    "/SitePages/Task-Profile.aspx?taskId=" +
                                    obj?.newSubChild?.newFeatChild?.newActChild
                                      ?.newWrkChild?.Id +
                                    "&Site=" +
                                    restructuredItemarray[0]?.siteType
                                : ""
                            }
                            className=""
                          >
                            {/* <div className="alignCenter">{obj?.newSubChild?.newFeatChild?.newActChild?.newWrkChild?.TaskID}</div> */}
                           
                            {obj?.newSubChild?.newFeatChild?.newActChild
                          ?.newWrkChild?.newTskChild != undefined &&
                        obj?.newSubChild?.newFeatChild?.newActChild?.newWrkChild
                          ?.newTskChild != null ? (
                     ""
                    ) :  obj?.newSubChild?.newFeatChild?.newActChild
                    ?.newWrkChild?.Title}
                           
                          </a></div>
                          </div>
                        </div>
                      
                      </>
                    ) : (
                      ""
                    )}
                    {obj?.newSubChild?.newFeatChild?.newActChild?.newWrkChild
                      ?.newTskChild ? (
                      <>
                        <div className="reStuMainTiles">
                        <div className="reStuTile">
                        <div className="alignCenter fw-semibold">
                        <img
                              className="workmember"
                              src={
                                obj?.newSubChild?.newFeatChild?.newActChild
                                  ?.newWrkChild?.newTskChild?.siteIcon
                              }
                            />
                            <span className="mx-2">
                            <ReactPopperTooltipSingleLevel CMSToolId={obj?.newSubChild?.newFeatChild?.newActChild?.newWrkChild?.newTskChild?.TaskID} row={obj?.newSubChild?.newFeatChild?.newActChild?.newWrkChild?.newTskChild} AllListId={props?.contextValue} singleLevel={true} masterTaskData={props?.AllMasterTasksData} AllSitesTaskData={props?.AllSitesTaskData} />
                         
                            </span>
                       
                          <a
                            data-interception="off"
                            target="_blank"
                            href={
                              obj?.newSubChild?.newFeatChild?.newActChild
                                ?.newWrkChild?.newTskChild?.Title != "Others"
                                ? obj?.newSubChild?.newFeatChild?.newActChild
                                    ?.newWrkChild?.newTskChild
                                    .Item_x0020_Type != "Task"
                                  ? props?.contextValue?.siteUrl +
                                    "/SitePages/Portfolio-Profile.aspx?taskId=" +
                                    obj?.newSubChild?.newFeatChild?.newActChild
                                      ?.newWrkChild?.newTskChild?.Id
                                  : props?.contextValue?.siteUrl +
                                    "/SitePages/Task-Profile.aspx?taskId=" +
                                    obj?.newSubChild?.newFeatChild?.newActChild
                                      ?.newWrkChild?.newTskChild?.Id +
                                    "&Site=" +
                                    restructuredItemarray[0]?.siteType
                                : ""
                            }
                            className=""
                          >
                              {/* <div className="alignCenter">{obj?.newSubChild?.newFeatChild?.newActChild?.newWrkChild?.newTskChild?.TaskID}</div> */}
                          
                            {
                              obj?.newSubChild?.newFeatChild?.newActChild
                                ?.newWrkChild?.newTskChild?.Title
                            }
                          </a></div>
                          </div>
                        </div>
                      </>
                    ) : (
                      ""
                    )}
                  </div>
                );
              })}
            </div>
            <label className="fw-bold form-label full-width mt-3"> New: </label>
            <div
              className="alignCenter border p-1"
              style={{ flexWrap: "wrap" }}
            >
              {NewArrayBackup?.map(function (obj: any) {
                return (
                  <div className="mainParentSec">
                    <div className="reStuMainTiles">
                    <div className="reStuTile">
                      <div className="alignCenter">
                    {obj?.Title != "Others" ? (
                          obj?.siteIcon?.length === 1 ? (
                            <span className="Dyicons">{obj?.siteIcon}</span>
                          ) : (
                              <img className="workmember" src={obj?.siteIcon} />
                          )
                        ) : (
                          ""
                        )}
                        <span className="mx-2">
                        <ReactPopperTooltipSingleLevel CMSToolId={obj?.TaskID} row={obj} AllListId={props?.contextValue} singleLevel={true} masterTaskData={props?.AllMasterTasksData} AllSitesTaskData={props?.AllSitesTaskData} />
                     
                        </span>
                        
                      <a
                        data-interception="off"
                        target="_blank"
                        className="hreflink serviceColor_Active "
                        href={
                          obj?.Title != "Others"
                            ? obj.Item_x0020_Type != "Task"
                              ? props?.contextValue?.siteUrl +
                                "/SitePages/Portfolio-Profile.aspx?taskId=" +
                                obj?.Id
                              : props?.contextValue?.siteUrl +
                                "/SitePages/Task-Profile.aspx?taskId=" +
                                obj?.Id +
                                "&Site=" +
                                obj?.siteType
                            : ""
                        }
                      >
                         {/* <div className="alignCenter">{obj?.TaskID}</div> */}
                        
                        {/* {obj?.newSubChild != undefined &&
                        obj?.newSubChild != null ? (
                     ""
                    ) :  (obj?.Title != "Others" ? obj?.Title : "Others")} */}
                        
                        
                      </a></div>
                      </div>
                    </div>
                    {obj?.newSubChild ? (
                      <>
                        
                        <div className="reStuMainTiles">
                        <div className="reStuTile">
                        <div className="alignCenter">
                        {obj?.newSubChild?.siteIcon === "S" ||
                            obj?.newSubChild?.siteIcon === "F" ? (
                              <span className="Dyicons">
                                {obj?.newSubChild?.siteIcon}
                              </span>
                            ) : (
                                <img
                                  className="workmember"
                                  src={obj?.newSubChild?.siteIcon}
                                />
                            )}
                            <span className="mx-2">
                            <ReactPopperTooltipSingleLevel CMSToolId={obj?.newSubChild?.TaskID} row={obj?.newSubChild} AllListId={props?.contextValue} singleLevel={true} masterTaskData={props?.AllMasterTasksData} AllSitesTaskData={props?.AllSitesTaskData} />
                         
                            </span>
                        
                          <a
                            data-interception="off"
                            target="_blank"
                            href={
                              obj?.newSubChild?.Title != "Others"
                                ? obj?.newSubChild.Item_x0020_Type != "Task"
                                  ? props?.contextValue?.siteUrl +
                                    "/SitePages/Portfolio-Profile.aspx?taskId=" +
                                    obj?.newSubChild?.Id
                                  : props?.contextValue?.siteUrl +
                                    "/SitePages/Task-Profile.aspx?taskId=" +
                                    obj?.newSubChild?.Id +
                                    "&Site=" +
                                    obj?.newSubChild?.siteType
                                : ""
                            }
                            className=""
                          >
                            {/* <div className="alignCenter">{obj?.newSubChild?.TaskID}</div> */}
                         
                            {/* {obj?.newSubChild?.Title} */}
                          </a>
                          </div>
                          </div>
                        </div>
                        
                      </>
                    ) : (
                      ""
                    )}
                    {obj?.newSubChild?.newFeatChild ? (
                      <>
                        <div className="reStuMainTiles">
                        <div className="reStuTile">
                        <div className="alignCenter">
                        {obj?.newSubChild?.newFeatChild?.siteIcon ===
                            "F"  ? (
                              <span className="Dyicons">
                                {obj?.newSubChild?.newFeatChild?.siteIcon}
                              </span>
                            ) : (
                                <img
                                  className="workmember"
                                  src={obj?.newSubChild?.newFeatChild?.siteIcon}
                                />
                            )}
                            <span className="mx-2">
                            <ReactPopperTooltipSingleLevel CMSToolId={obj?.newSubChild?.newFeatChild?.TaskID} row={obj?.newSubChild?.newFeatChild} AllListId={props?.contextValue} singleLevel={true} masterTaskData={props?.AllMasterTasksData} AllSitesTaskData={props?.AllSitesTaskData} />
                         
                            </span>
                       
                          <a
                            data-interception="off"
                            target="_blank"
                            href={
                              obj?.newSubChild?.newFeatChild?.Title != "Others"
                                ? obj?.newSubChild?.newFeatChild
                                    .Item_x0020_Type != "Task"
                                  ? props?.contextValue?.siteUrl +
                                    "/SitePages/Portfolio-Profile.aspx?taskId=" +
                                    obj?.newSubChild?.newFeatChild?.Id
                                  : props?.contextValue?.siteUrl +
                                    "/SitePages/Task-Profile.aspx?taskId=" +
                                    obj?.newSubChild?.newFeatChild?.Id +
                                    "&Site=" +
                                    obj?.newSubChild?.newFeatChild?.siteType
                                : ""
                            }
                            className=""
                          >
                            {/* <div className="alignCenter">{obj?.newSubChild?.newFeatChild?.TaskID}</div> */}
                          
                            {/* {obj?.newSubChild?.newFeatChild?.Title} */}
                          </a>
                          </div>
                          </div>
                        </div>
                      
                      </>
                    ) : (
                      ""
                    )}
                    {obj?.newSubChild?.newFeatChild?.newActChild ? (
                      <>
                        <div className="reStuMainTiles">
                        <div className="reStuTile">
                        <div className="alignCenter">
                        <img
                              className="workmember"
                              src={
                                obj?.newSubChild?.newFeatChild?.newActChild
                                  ?.siteIcon
                              }
                            />
                            <span className="mx-2">
                            <ReactPopperTooltipSingleLevel CMSToolId={obj?.newSubChild?.newFeatChild?.newActChild?.TaskID} row={obj?.newSubChild?.newFeatChild?.newActChild} AllListId={props?.contextValue} singleLevel={true} masterTaskData={props?.AllMasterTasksData} AllSitesTaskData={props?.AllSitesTaskData} />
                         
                            </span>
                        
                          <a
                            data-interception="off"
                            target="_blank"
                            href={
                              obj?.newSubChild?.newFeatChild?.newActChild
                                ?.Title != "Others"
                                ? obj?.newSubChild?.newFeatChild?.newActChild
                                    .Item_x0020_Type != "Task"
                                  ? props?.contextValue?.siteUrl +
                                    "/SitePages/Portfolio-Profile.aspx?taskId=" +
                                    obj?.newSubChild?.newFeatChild?.newActChild
                                      ?.Id
                                  : props?.contextValue?.siteUrl +
                                    "/SitePages/Task-Profile.aspx?taskId=" +
                                    obj?.newSubChild?.newFeatChild?.newActChild
                                      ?.Id +
                                    "&Site=" +
                                    obj?.newSubChild?.newFeatChild?.newActChild
                                      ?.siteType
                                : ""
                            }
                            className=""
                          >
                            {/* <div className="alignCenter">{obj?.newSubChild?.newFeatChild?.newActChild?.TaskID}</div> */}
                           
                            {/* {obj?.newSubChild?.newFeatChild?.newActChild?.Title} */}
                          </a></div></div>
                        </div>
                       
                      </>
                    ) : (
                      ""
                    )}
                    {obj?.newSubChild?.newFeatChild?.newActChild
                      ?.newWrkChild ? (
                      <>
                        
                        <div className="reStuMainTiles">
                        <div className="reStuTile">
                        <div className="alignCenter">
                        <img
                              className="workmember"
                              src={
                                obj?.newSubChild?.newFeatChild?.newActChild
                                  ?.newWrkChild?.siteIcon
                              }
                            />
                            <span className="mx-2">
                            <ReactPopperTooltipSingleLevel CMSToolId={obj?.newSubChild?.newFeatChild?.newActChild?.newWrkChild?.TaskID} row={obj?.newSubChild?.newFeatChild?.newActChild?.newWrkChild} AllListId={props?.contextValue} singleLevel={true} masterTaskData={props?.AllMasterTasksData} AllSitesTaskData={props?.AllSitesTaskData} />
                        
                            </span>
                        
                          <a
                            data-interception="off"
                            target="_blank"
                            href={
                              obj?.newSubChild?.newFeatChild?.newActChild
                                ?.newWrkChild?.Title != "Others"
                                ? obj?.newSubChild?.newFeatChild?.newActChild
                                    ?.newWrkChild.Item_x0020_Type != "Task"
                                  ? props?.contextValue?.siteUrl +
                                    "/SitePages/Portfolio-Profile.aspx?taskId=" +
                                    obj?.newSubChild?.newFeatChild?.newActChild
                                      ?.newWrkChild?.Id
                                  : props?.contextValue?.siteUrl +
                                    "/SitePages/Task-Profile.aspx?taskId=" +
                                    obj?.newSubChild?.newFeatChild?.newActChild
                                      ?.newWrkChild?.Id +
                                    "&Site=" +
                                    obj?.newSubChild?.newFeatChild?.newActChild
                                      ?.newWrkChild?.siteType
                                : ""
                            }
                          >
                          </a></div></div>
                        </div>
                      </>
                    ) : (
                      ""
                    )}
                    {obj?.newSubChild?.newFeatChild?.newActChild?.newWrkChild
                      ?.newTskChild ? (
                      <>
                        
                        <div className="reStuMainTiles">
                        <div className="reStuTile">
                        <div className="alignCenter">
                        <img
                              className="workmember"
                              src={
                                obj?.newSubChild?.newFeatChild?.newActChild
                                  ?.newWrkChild?.newTskChild?.siteIcon
                              }
                            />
                            <span className="mx-2">
                            <ReactPopperTooltipSingleLevel CMSToolId={obj?.newSubChild?.newFeatChild?.newActChild?.newWrkChild?.newTskChild?.TaskID} row={obj?.newSubChild?.newFeatChild?.newActChild?.newWrkChild?.newTskChild} AllListId={props?.contextValue} singleLevel={true} masterTaskData={props?.AllMasterTasksData} AllSitesTaskData={props?.AllSitesTaskData} />
                         
                            </span>
                       
                          <a
                            data-interception="off"
                            target="_blank"
                            href={
                              obj?.newSubChild?.newFeatChild?.newActChild
                                ?.newWrkChild?.newTskChild?.Title != "Others"
                                ? obj?.newSubChild?.newFeatChild?.newActChild
                                    ?.newWrkChild?.newTskChild
                                    .Item_x0020_Type != "Task"
                                  ? props?.contextValue?.siteUrl +
                                    "/SitePages/Portfolio-Profile.aspx?taskId=" +
                                    obj?.newSubChild?.newFeatChild?.newActChild
                                      ?.newWrkChild?.newTskChild?.Id
                                  : props?.contextValue?.siteUrl +
                                    "/SitePages/Task-Profile.aspx?taskId=" +
                                    obj?.newSubChild?.newFeatChild?.newActChild
                                      ?.newWrkChild?.newTskChild?.Id +
                                    "&Site=" +
                                    obj?.newSubChild?.newFeatChild?.newActChild
                                      ?.newWrkChild?.newTskChild?.siteType
                                : ""
                            }
                            className=""
                          >
                          
                          </a></div></div>
                        </div>
                      </>
                    ) : (
                      ""
                    )}
                    {RestructureChecked?.map((items: any) => (
                      <div className="reStuMainTiles">
                        <a
                          data-interception="off"
                          target="_blank"
                          className="hreflink serviceColor_Active fw-semibold reStuTile"
                          href={
                            restructureItem[0]?.Item_x0020_Type != "Task"
                              ? props?.contextValue?.siteUrl +
                                "/SitePages/Portfolio-Profile.aspx?taskId=" +
                                obj?.Id
                              : props?.contextValue?.siteUrl +
                                "/SitePages/Task-Profile.aspx?taskId=" +
                                items?.Id +
                                "&Site=" +
                                restructureItem[0]?.siteType
                          }
                        >
                        
                        {
                          newItemBackUp?.Item_x0020_Type === "Component" && items?.Item_x0020_Type === "Component" ? <span className="Dyicons"> S </span> : (
                            newItemBackUp?.Item_x0020_Type == "SubComponent" && (items?.Item_x0020_Type === "Component" || items?.Item_x0020_Type === "SubComponent") ? 
                            <span className="Dyicons">F</span> : (
                              items?.Item_x0020_Type === "Task" ? <img className="workmember" src={items?.siteIcon} />  : <span className="Dyicons">{items?.siteIcon}</span>
                            )

                          )
                        }
                          <span className="mx-2">
                            {
                            newItemBackUp?.Item_x0020_Type != "Task" ?
                            (newItemBackUp?.TaskType?.Id == 1 || newItemBackUp?.TaskType?.Id == 3 ? items?.TaskID : (newItemBackUp?.TaskType?.Id == 2 ? items?.Id : ``) ) : (newItemBackUp?.TaskType?.Id == 1 ? (items?.TaskType?.Id == 2 ? (`${newItemBackUp?.TaskID}-T${items?.Id}`) :
                             (`${items?.TaskType?.Id == 3 ? (`${newItemBackUp?.TaskID}-W`) : ('') }`)) : (newItemBackUp?.TaskType?.Id == 3 ? (`${newItemBackUp?.TaskID}-T${items?.Id}`) : ''))
                          }</span>
                          {items?.Title}
                        </a>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
            {selectedItems != undefined &&
            selectedItems?.length > 0 &&
            selectedItems[0]?.Item_x0020_Type != "Task" &&
            checkSubChilds?.subRows[0]?.Item_x0020_Type !== "Feature" ? (
              <div className="mt-2">
                {newItemBackUp?.Item_x0020_Type == "SubComponent" ? (
                  " "
                ) : (
                  <span>
                    <span>
                      {"Select Component Type :"}
                      <label className="SpfxCheckRadio ms-3 me-1">
                        <input
                          type="radio"
                          name="fav_language"
                          value="SubComponent"
                          className="radio"
                          checked={
                            RestructureChecked[0]?.Item_x0020_Type ==
                            "SubComponent"
                              ? true
                              : RestructureChecked[0]?.Item_x0020_Type ==
                                "Component"
                              ? true
                              : false
                          }
                          onChange={(e) =>
                            setRestructure(RestructureChecked, "SubComponent")
                          }
                        />
                      </label>
                      <label className="ms-1"> {"SubComponent"} </label>
                    </span>
                    <span>
                      <label className="SpfxCheckRadio ms-3 me-1">
                        <input
                          type="radio"
                          className="radio"
                          name="fav_language"
                          value="SubComponent"
                          checked={
                            RestructureChecked[0]?.Item_x0020_Type === "Feature"
                              ? true
                              : false
                          }
                          onChange={(e) =>
                            setRestructure(RestructureChecked, "Feature")
                          }
                        />
                      </label>
                      <label className="ms-1"> {"Feature"} </label>
                    </span>
                  </span>
                )}
              </div>
            ) : (
              ""
            )}
            
            {
              newItemBackUp?.subRows?.length > 0 &&
              newItemBackUp?.TaskType?.Id == 1 && newItemBackUp?.subRows?.some((item: any) => item?.Id === restructureItem[0]?.Id && item?.Title === restructureItem[0]?.Title) ?
              "" :
              <>
               {selectedItems != undefined &&
            selectedItems?.length > 0 &&
            selectedItems[0]?.Item_x0020_Type === "Task" &&
            newItemBackUp?.TaskType?.Id == 1 &&
            newItemBackUp?.Item_x0020_Type == "Task" &&
            (selectedItems[0]?.TaskType?.Id == 1 ||
              selectedItems[0]?.TaskType?.Id == 3 ||
              selectedItems[0]?.TaskType?.Id == 2) ? (
              <div className="mt-2">
                <span>
                  {"Select Task Type :"}
                  <label className="SpfxCheckRadio ms-3 me-1">
                    <input
                      type="radio"
                      className="radio"
                      name="fav_language"
                      value="Workstream"
                      checked={
                        RestructureChecked[0]?.TaskType?.Id == 3
                          ? true
                          : RestructureChecked[0]?.TaskType?.Id == 1
                          ? true
                          : false
                      }
                      onChange={(e) => setRestructure(RestructureChecked, 3)}
                    />
                  </label>
                  <label className="ms-1"> {"Workstream"} </label>
                </span>
                <span>
                  <label className="SpfxCheckRadio ms-3 me-1">
                    <input
                      type="radio"
                      className="radio"
                      name="fav_language"
                      value="Task"
                      checked={
                        RestructureChecked[0]?.TaskType?.Id === 2 ? true : false
                      }
                      onChange={(e) => setRestructure(RestructureChecked, 2)}
                    />
                  </label>
                  <label className="ms-1"> {"Task"} </label>
                </span>
              </div>
            ) : (
              " "
            )}
              </>

            }

            {selectedItems != undefined &&
            selectedItems?.length > 0 &&
            selectedItems[0]?.Item_x0020_Type === "Task" &&
            newItemBackUp?.Item_x0020_Type != "Task" &&
            ((selectedItems[0]?.TaskType?.Id == 3 &&
              selectedItems[0]?.subRows?.length == 0) ||
              selectedItems[0]?.TaskType?.Id == 2 ||
              (selectedItems[0]?.TaskType?.Id == 1 &&
                selectedItems[0]?.subRows?.length == 0)) ? (
              <div className="mt-2">
                <span>
                  {"Select Task Type :"}
                  <label className="SpfxCheckRadio ms-3 me-1">
                    <input
                      type="radio"
                      className="radio"
                      value="Activity"
                      checked={
                        RestructureChecked[0]?.TaskType?.Id == 3
                          ? true
                          : RestructureChecked[0]?.TaskType?.Id == 1
                          ? true
                          : false
                      }
                      onChange={(e) => setRestructure(RestructureChecked, 1)}
                    />
                  </label>
                  <label className="ms-1"> {"Activity"} </label>
                </span>
                <span>
                  <label className="SpfxCheckRadio ms-3 me-1">
                    <input
                      type="radio"
                      className="radio"
                      name="fav_language"
                      value="Task"
                      checked={
                        RestructureChecked[0]?.TaskType?.Id === 2 ? true : false
                      }
                      onChange={(e) => setRestructure(RestructureChecked, 2)}
                    />
                  </label>
                  <label className="ms-1"> {"Task"} </label>
                </span>
              </div>
            ) : (
              " "
            )}

            <footer className="mt-2 text-end">
              {selectedItems != undefined &&
              selectedItems?.length > 0 &&
              selectedItems[0]?.Item_x0020_Type === "Task" ? (
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
                  onClick={(e) => UpdateTaskRestructure()}
                >
                  Save
                </button>
              )}
              <button
                type="button"
                className="btn btn-default ms-1"
                onClick={closePanel}
              >
                Cancel
              </button>
            </footer>
          </div>
        </Panel>
      ) : (
        ""
      )}

      {ResturuningOpen === true  && selectedItems?.length > 1 ? (
        <Panel
          isOpen={ResturuningOpen}
          onRenderHeader={onRenderCustomCalculateSCmulti}
          isBlocking={false}
          type={PanelType.medium}
          onDismiss={closePanel}
        >
          <div className="mt-2">
            These all Tasks will restructuring inside
            {
              newItemBackUp != undefined && newItemBackUp != null ?
              <span>
              {newItemBackUp?.SiteIconTitle != undefined ? (
                <span className="Dyicons mx-1">{newItemBackUp?.SiteIconTitle}</span>
              ) : (
                  <img
                    className="workmember mx-1"
                    src={newItemBackUp?.SiteIcon}
                  />
              )}

              {newItemBackUp?.Item_x0020_Type != "Task" ? (
                <a
                  data-interception="off"
                  target="_blank"
                  className="hreflink serviceColor_Active"
                  href={
                    props?.contextValue?.siteUrl +
                    "/SitePages/Portfolio-Profile.aspx?taskId=" +
                    newItemBackUp?.Id
                  }
                >
                  <span>{newItemBackUp?.Title} </span>
                </a>
              ) : (
                <a
                  data-interception="off"
                  target="_blank"                                                                                                                                                                           
                  className="hreflink serviceColor_Active"
                  href={
                    props?.contextValue?.siteUrl +
                    "/SitePages/Task-Profile.aspx?taskId=" +
                    newItemBackUp?.Id +
                    "&Site=" +
                    newItemBackUp?.siteType
                  }
                >
                  <span>{newItemBackUp?.Title} </span>
                </a>
              )}
            </span>
            :
            <span>
            {props?.queryItems?.Item_x0020_Type != "Task" ? (
              <span className="Dyicons mx-1">{props?.queryItems?.Item_x0020_Type[0]}</span>
            ) : (
                <img
                  className="workmember mx-1"
                  src={props?.queryItems?.SiteIcon}
                />
            )}

            {props?.queryItems?.Item_x0020_Type != "Task" ? (
              <a
                data-interception="off"
                target="_blank"
                className="hreflink serviceColor_Active"
                href={
                  props?.contextValue?.siteUrl +
                  "/SitePages/Portfolio-Profile.aspx?taskId=" +
                  props?.queryItems?.Id
                }
              >
                <span>{props?.queryItems?.Title} </span>
              </a>
            ) : (
              <a
                data-interception="off"
                target="_blank"
                className="hreflink serviceColor_Active"
                href={
                  props?.contextValue?.siteUrl +
                  "/SitePages/Task-Profile.aspx?taskId=" +
                  props?.queryItems?.Id +
                  "&Site=" +
                  props?.queryItems?.siteType
                }
              >
                <span>{props?.queryItems?.Title} </span>
              </a>
            )}
          </span>
            }
           
            <div>
            <table className="my-2 border" style={{width:"100%"}}>
                <tr className="bg-ee border">
                  <th className="p-1" style={{width:"25px"}}></th>
                  <th className="p-1" style={{width:"40px"}}>Icon</th>
                  <th className="p-1" style={{width:"120px"}}>Id</th>
                  <th className="p-1">Title</th>  
                </tr>
                {selectedItems.map((val:any) => {
                    return (
                        <tr className="border-bottom" key={val.Id}>
                          <td className="p-1"> 
                            <input type="checkbox" className="form-check-input rounded-0"
                              checked={restructureItem.includes(val)} onChange={() => handleCheckboxChange(val)}
                              /></td>
                            <td className="p-1">{val.SiteIcon != undefined ? <img className="workmember" src={val.SiteIcon}/> :  <span className="Dyicons mx-1">{val?.SiteIconTitle}</span>}  </td>
                            <td  className="p-1">
                            <ReactPopperTooltipSingleLevel CMSToolId={val?.TaskID} row={val} AllListId={props?.contextValue} singleLevel={true} masterTaskData={props?.AllMasterTasksData} AllSitesTaskData={props?.AllSitesTaskData} />
                         
                              </td>
                            <td className="p-1">{val.Title}</td>
                        </tr>
                    )
                })}
            </table>
            </div>
          </div>

              {
                 (newItemBackUp?.TaskType?.Id == 1 || newItemBackUp?.Item_x0020_Type == 'Feature' || newItemBackUp?.Item_x0020_Type == 'SubComponent' || newItemBackUp?.Item_x0020_Type == 'Component') && RestructureChecked[0]?.TaskType?.Id == 1  ?
                 restructureItem.some((item:any) => Array.isArray(item?.subRows) && item.subRows.length > 0) ? "" :
                 <>
                 {"Select Task Type :"}
                  <label className="SpfxCheckRadio ms-3 me-1">
                    <input
                      type="radio"
                      className="radio" 
                      value="Workstream"
                      checked={
                        RestructureChecked[0]?.TaskType?.Id == 3
                          ? true
                          : RestructureChecked[0]?.TaskType?.Id == 1
                          ? true
                          : false
                      }
                      onChange={()=>setRestructure(RestructureChecked, 3)}/>
                  </label>
                  <label className="ms-1"> {"Workstream"} </label>
                  <label className="SpfxCheckRadio ms-3 me-1">
                    <input
                      type="radio"
                      className="radio"
                      name="fav_language"
                      value="Task"
                      checked={
                        RestructureChecked[0]?.TaskType?.Id === 2
                          ? true
                          : false
                      }
                      onChange={(e) =>
                        setRestructure(RestructureChecked, 2)
                      }
                    />
                  </label>
                  <label className="ms-1"> {"Task"} </label>
                </> : ''
              }


          {/* {
                  (newItemBackUp?.TaskType?.Id == 1 || newItemBackUp?.Item_x0020_Type == 'Feature' || newItemBackUp?.Item_x0020_Type == 'SubComponent' || newItemBackUp?.Item_x0020_Type == 'Component') && RestructureChecked[0]?.TaskType?.Id == 1 &&
                  restructureItem.some((item:any) => Array.isArray(item?.subRows) && item.subRows.length > 0) ?
                   '' : 
                    <>
                   {"Select Task Type :"}
                    <label className="SpfxCheckRadio ms-3 me-1">
                      <input
                        type="radio"
                        className="radio" 
                        value="Workstream"
                        checked={
                          RestructureChecked[0]?.TaskType?.Id == 3
                            ? true
                            : RestructureChecked[0]?.TaskType?.Id == 1
                            ? true
                            : false
                        }
                        onChange={()=>setRestructure(RestructureChecked, 3)}/>
                    </label>
                    <label className="ms-1"> {"Workstream"} </label>
                    <label className="SpfxCheckRadio ms-3 me-1">
                      <input
                        type="radio"
                        className="radio"
                        name="fav_language"
                        value="Task"
                        checked={
                          RestructureChecked[0]?.TaskType?.Id === 2
                            ? true
                            : false
                        }
                        onChange={(e) =>
                          setRestructure(RestructureChecked, 2)
                        }
                      />
                    </label>
                    <label className="ms-1"> {"Task"} </label>
                  </>
                } */}
          {selectedItems != undefined &&
          selectedItems?.length > 1 &&
          selectedItems[0]?.Item_x0020_Type == "Task" &&
          selectedItems[0]?.TaskType?.Id == 2 ? (
            <div className="mt-2">
              <span>
                {newItemBackUp?.Item_x0020_Type != "Task" ? (
                  <>
                   {"Select Task Type :"}
                    <label className="SpfxCheckRadio ms-3 me-1">
                      <input
                        type="radio"
                        className="radio"
                        value="Activity"
                        checked={
                          RestructureChecked[0]?.TaskType?.Id == 3
                            ? true
                            : RestructureChecked[0]?.TaskType?.Id == 1
                            ? true
                            : false
                        }
                        onChange={(e) => setRestructure(RestructureChecked, 1)}
                      />
                    </label>
                    <label className="ms-1"> {"Activity"} </label>
                    <label className="SpfxCheckRadio ms-3 me-1">
                      <input
                        type="radio"
                        className="radio"
                        name="fav_language"
                        value="Task"
                        checked={
                          RestructureChecked[0]?.TaskType?.Id === 2
                            ? true
                            : false
                        }
                        onChange={(e) => setRestructure(RestructureChecked, 2)}
                      />
                    </label>
                    <label className="ms-1"> {"Task"} </label>
                  </>
                ) : (
                  <>
                    {
                    newItemBackUp?.Item_x0020_Type == "Task" &&
                    newItemBackUp?.TaskType?.Id == 1 ? (
                      <>
                       {"Select Task Type :"}
                        <label className="SpfxCheckRadio ms-3 me-1">
                          <input
                            type="radio"
                            className="radio"
                            
                            value="Workstream"
                            checked={
                              RestructureChecked[0]?.TaskType?.Id == 3
                                ? true
                                : RestructureChecked[0]?.TaskType?.Id == 1
                                ? true
                                : false
                            }
                            onChange={()=>setRestructure(RestructureChecked, 3)}
                          />
                        </label>
                        <label className="ms-1"> {"Workstream"} </label>
                        <label className="SpfxCheckRadio ms-3 me-1">
                          <input
                            type="radio"
                            className="radio"
                            name="fav_language"
                            value="Task"
                            checked={
                              RestructureChecked[0]?.TaskType?.Id === 2
                                ? true
                                : false
                            }
                            onChange={(e) =>
                              setRestructure(RestructureChecked, 2)
                            }
                          />
                        </label>
                        <label className="ms-1"> {"Task"} </label>
                      </>
                    ) : (
                      ""
                    )}
                  </>
                )}
              </span>
            </div>
          ) : (
            ""
          )}
          <footer className="mt-2 text-end">
            <button
              className="me-2 btn btn-primary"
              onClick={makeMultiSameTask}
            >
              Save
            </button>
            <button className="me-2 btn btn-default" onClick={closePanel}>
              Cancel
            </button>
          </footer>
        </Panel>
      ) : (
        ""
      )}







                  {projects === true && restructureItem?.length > 1 ? (
        <Panel
          isOpen={projects}
          onRenderHeader={onRenderCustomCalculateSCmulti}
          isBlocking={false}
          onDismiss={()=>setProjects(false)}
        >
          <>
          Selected Item will restructure into {
            newItemBackUp != undefined && newItemBackUp != null ? (
              newItemBackUp?.Item_x0020_Type == 'Sprint' ? ' Sprint ' : (newItemBackUp?.Item_x0020_Type == 'Project' ? ' Project ' : <span>{newItemBackUp?.TaskType?.Title}</span> )
            ) : ' Project ' 
          }

<div>
            <table className="my-2 border" style={{width:"100%"}}>
                <tr className="bg-ee border">
                  <th className="p-1" style={{width:"25px"}}></th>
                  <th className="p-1" style={{width:"40px"}}>Icon</th>
                  <th className="p-1" style={{width:"120px"}}>Id</th>
                  <th className="p-1">Title</th>  
                </tr>
                {selectedItems.map((val:any) => {
                    return (
                        <tr className="border-bottom" key={val.Id}>
                          <td className="p-1"> 
                            <input type="checkbox" className="form-check-input rounded-0"
                              checked={restructureItem.includes(val)} onChange={() => handleCheckboxChange(val)}
                              /></td>
                            <td className="p-1"><img className="workmember" src={val.SiteIcon}/></td>
                            <td  className="p-1">
                            <ReactPopperTooltipSingleLevel CMSToolId={val?.TaskID} row={val} AllListId={props?.contextValue} singleLevel={true} masterTaskData={props?.AllMasterTasksData} AllSitesTaskData={props?.AllSitesTaskData} />
                         
                              </td>
                            <td className="p-1">{val.Title}</td>
                        </tr>
                    )
                })}
            </table>
            </div>
            {newItemBackUp?.TaskType?.Id == 1 &&
                    (RestructureChecked[0]?.TaskType?.Id == 2 || (RestructureChecked[0]?.TaskType?.Id == 1 && (RestructureChecked[0]?.subRows == undefined || RestructureChecked[0]?.subRows?.length == 0 || RestructureChecked[0]?.subRows == null)) || (RestructureChecked[0]?.TaskType?.Id == 3 && (RestructureChecked[0]?.subRows == undefined || RestructureChecked[0]?.subRows?.length == 0 || RestructureChecked[0]?.subRows == null))) ? (
                      <>
                       {"Select Task Type :"}
                        <label className="SpfxCheckRadio ms-3 me-1">
                          <input
                            type="radio"
                            className="radio"
                            value="Workstream"
                            checked={
                              RestructureChecked[0]?.TaskType?.Id == 3
                                ? true
                                : RestructureChecked[0]?.TaskType?.Id == 1
                                ? true
                                : false
                            }
                            onChange={()=>setRestructure(RestructureChecked, 3)}
                          />
                        </label>
                        <label className="ms-1"> {"Workstream"} </label>
                        <label className="SpfxCheckRadio ms-3 me-1">
                          <input
                            type="radio"
                            className="radio"
                            name="fav_language"
                            value="Task"
                            checked={
                              RestructureChecked[0]?.TaskType?.Id === 2
                                ? true
                                : false
                            }
                            onChange={(e) =>setRestructure(RestructureChecked, 2)}
                          />
                        </label>
                        <label className="ms-1"> {"Task"} </label>
                      </>
                    ) : (
                      ""
                    )}
          </>
          <footer className="mt-2 text-end">
            <button
              className="me-2 btn btn-primary"
              onClick={projectRestruture}
            >
              Save
            </button>
            <button className="me-2 btn btn-default" onClick={() => setProjects(false)}>
              Cancel
            </button>
          </footer>
        </Panel>
      ) : (
        ""
      )}


      {
        projects && restructureItem?.length == 1 &&
      <Panel
      onRenderHeader={onRenderCustomCalculateSCProject}
        isOpen={projects}
        type={PanelType.large}
        isBlocking={false}
        onDismiss={() => setProjects(false)}
      >

            <div>
            
            <label className="fw-bold form-label full-width"> Old: </label>
            <div
              className="alignCenter border p-1"
              style={{ flexWrap: "wrap" }}
            >
              {OldArrayBackup?.map(function (obj: any) {
                return (
                  <div className="mainParentSec">
                    <div className="reStuMainTiles">
                    <div className="reStuTile">
                    <div className={`${obj?.newSubChild != undefined && obj?.newSubChild != null ? 'alignCenter' : 'alignCenter fw-semibold'}`}>
                    {
                          <div className="Dyicons">
                              {obj.Item_x0020_Type == 'Project' ? "P" : "X"}
                            </div>
                            }
                            <span className="mx-2">
                            <ReactPopperTooltipSingleLevel CMSToolId={obj?.TaskID} row={obj} AllListId={props?.contextValue} singleLevel={true} masterTaskData={props?.AllMasterTasksData} AllSitesTaskData={props?.AllSitesTaskData} />
                     
                            </span>
                       
                      <a
                        data-interception="off"
                        target="_blank"
                        className="serviceColor_Active "
                        href={ props?.contextValue?.siteUrl +
                                "/SitePages/Project-Management.aspx?ProjectId=" +
                                obj?.Id}
                      >
                              {obj?.newSubChild != undefined &&
                    obj?.newSubChild != null ? (
                      ""
                    ) : (
                      <div className="alignCenter">{obj?.Title}</div>
                    )}
                          
                      </a></div>
                      </div>
                    </div>
                    
                    {obj?.newSubChild ? (
                      <>
                        <div className="reStuMainTiles">
                        <div className="reStuTile">
                        <div className="alignCenter fw-semibold">
                        
                              
                                {obj?.newSubChild?.Item_x0020_Type == 'Project' ? <span className="Dyicons me-1">P</span> :   
                                (obj?.newSubChild?.Item_x0020_Type == "Sprint" ? <span className="Dyicons me-1">X</span> : 
                                <img className="workmember" src={obj?.newSubChild?.SiteIcon} />
                                )
                                }
                              
                              <span className="mx-2">
                              <ReactPopperTooltipSingleLevel CMSToolId={obj?.newSubChild?.TaskID} row={obj?.newSubChild} AllListId={props?.contextValue} singleLevel={true} masterTaskData={props?.AllMasterTasksData} AllSitesTaskData={props?.AllSitesTaskData} />
                         
                              </span>
                       
                          <a
                            className=""
                            data-interception="off"
                            target="_blank"
                            href={ props?.contextValue?.siteUrl +
                              "/SitePages/Project-Management.aspx?ProjectId=" +
                              obj?.newSubChild?.Id}
                          >
                             {obj?.newSubChild?.Title}
                          </a></div>
                          </div>
                        </div>
                        {/* newObj?.newSubChild?.newFeatChild.newActChild.newWrkChild */}
                        {
                          obj?.newSubChild?.newFeatChild ? (
                            <>
                            <div className="reStuMainTiles">
                            <div className="reStuTile">
                            <div className="alignCenter fw-semibold">
                            
                                  
                                    {obj?.newSubChild?.newFeatChild?.Item_x0020_Type == 'Project' ? <span className="Dyicons me-1">p</span> :   
                                    (obj?.newSubChild?.newFeatChild?.Item_x0020_Type == "Sprint" ? <span className="Dyicons me-1">x</span> : 
                                    <img className="workmember" src={obj?.newSubChild?.newFeatChild?.SiteIcon} />
                                    )
                                    }
                                  
                                  <span className="mx-2">
                                  <ReactPopperTooltipSingleLevel CMSToolId={obj?.newSubChild?.newFeatChild?.TaskID} row={obj?.newSubChild?.newFeatChild} AllListId={props?.contextValue} singleLevel={true} masterTaskData={props?.AllMasterTasksData} AllSitesTaskData={props?.AllSitesTaskData} />
                             
                                  </span>
                           
                              <a
                                className=""
                                data-interception="off"
                                target="_blank"
                                href={ props?.contextValue?.siteUrl +
                                  "/SitePages/Project-Management.aspx?ProjectId=" +
                                  obj?.newSubChild?.newFeatChild?.Id}
                              >
                                 {obj?.newSubChild?.newFeatChild?.Title}
                              </a></div>
                              </div>
                            </div>

                            {
                              obj?.newSubChild?.newFeatChild?.newActChild ? (
                                   <>
                                     <div className="reStuMainTiles">
                            <div className="reStuTile">
                            <div className="alignCenter fw-semibold">
                            
                                  
                                    {obj?.newSubChild?.newFeatChild?.newActChild?.Item_x0020_Type == 'Project' ? <span className="Dyicons me-1"> "P"</span> :   
                                    (obj?.newSubChild?.newFeatChild?.newActChild?.Item_x0020_Type == "Sprint" ? <span className="Dyicons me-1">"X"</span> : 
                                    <img className="workmember" src={obj?.newSubChild?.newFeatChild?.newActChild?.SiteIcon} />
                                    )
                                    }
                                  
                                  <span className="mx-2">
                                  <ReactPopperTooltipSingleLevel CMSToolId={obj?.newSubChild?.newFeatChild?.newActChild?.TaskID} row={obj?.newSubChild?.newFeatChild?.newActChild} AllListId={props?.contextValue} singleLevel={true} masterTaskData={props?.AllMasterTasksData} AllSitesTaskData={props?.AllSitesTaskData} />
                             
                                  </span>
                           
                              <a
                                className=""
                                data-interception="off"
                                target="_blank"
                                href={ props?.contextValue?.siteUrl +
                                  "/SitePages/Project-Management.aspx?ProjectId=" +
                                  obj?.newSubChild?.newFeatChild?.newActChild?.Id}
                              >
                                 {obj?.newSubChild?.newFeatChild?.newActChild?.Title}
                              </a></div>
                              </div>
                            </div>

                            {
                              obj?.newSubChild?.newFeatChild?.newActChild?.newWrkChild ?
                              (<>
                                   <div className="reStuMainTiles">
                            <div className="reStuTile">
                            <div className="alignCenter fw-semibold">
                            
                                  
                                    {obj?.newSubChild?.newFeatChild?.newActChild?.newWrkChild?.Item_x0020_Type == 'Project' ? <span className="Dyicons me-1"> "P"</span> :   
                                    (obj?.newSubChild?.newFeatChild?.newActChild?.newWrkChild?.Item_x0020_Type == "Sprint" ? <span className="Dyicons me-1">"X"</span> : 
                                    <img className="workmember" src={obj?.newSubChild?.newFeatChild?.newActChild?.newWrkChild?.SiteIcon} />
                                    )
                                    }
                                  
                                  <span className="mx-2">
                                  <ReactPopperTooltipSingleLevel CMSToolId={obj?.newSubChild?.newFeatChild?.newActChild?.newWrkChild?.TaskID} row={obj?.newSubChild?.newFeatChild?.newActChild?.newWrkChild} AllListId={props?.contextValue} singleLevel={true} masterTaskData={props?.AllMasterTasksData} AllSitesTaskData={props?.AllSitesTaskData} />
                             
                                  </span>
                           
                              <a
                                className=""
                                data-interception="off"
                                target="_blank"
                                href={ props?.contextValue?.siteUrl +
                                  "/SitePages/Project-Management.aspx?ProjectId=" +
                                  obj?.newSubChild?.newFeatChild?.newActChild?.newWrkChild?.Id}
                              >
                                 {obj?.newSubChild?.newFeatChild?.newActChild?.newWrkChild?.Title}
                              </a></div>
                              </div>
                            </div>

                              </>):
                              ('')
                            }
                                   </>
                              ) : 
                              ('')
                            }
                              </>
                            
                          ) : ("")
                        }
                      </>
                    ) : (
                      ""
                    )}
                  </div>
                );
              })}
            </div>
            <label className="fw-bold form-label full-width mt-3"> New: </label>
            <div
              className="alignCenter border p-1"
              style={{ flexWrap: "wrap" }}
            >
              {NewArrayBackup?.map(function (obj: any) {
                return (
                  <div className="mainParentSec">
                    <div className="reStuMainTiles">
                    <div className="reStuTile">
                    <div className="alignCenter">
                    <span className="Dyicons">{obj?.Item_x0020_Type == 'Project' ? "P" : "X"}</span>
                    <span className="mx-2">
                    <ReactPopperTooltipSingleLevel CMSToolId={obj?.TaskID} row={obj} AllListId={props?.contextValue} singleLevel={true} masterTaskData={props?.AllMasterTasksData} AllSitesTaskData={props?.AllSitesTaskData} />
                      
                    </span>
                      
                      <a
                        data-interception="off"
                        target="_blank"
                        className="hreflink serviceColor_Active "
                        href={props?.contextValue?.siteUrl +
                                "/SitePages/Project-Management.aspx?ProjectId" +
                                obj?.Id
                        }
                      >
                      </a></div>
                      </div>
                    </div>
                    {obj?.newSubChild ? (
                      <>
                        <div className="reStuMainTiles">
                        <div className="reStuTile">
                        <div className="alignCenterr">
                        {obj?.newSubChild?.Item_x0020_Type == 'Project' ? <span className="Dyicons me-1">P</span> :   
                                    (obj?.newSubChild?.Item_x0020_Type == "Sprint" ? <span className="Dyicons me-1">X</span> : 
                                    <img className="workmember" src={obj?.newSubChild?.SiteIcon} />
                                    )
                                    }
                              <span className="mx-2">
                              <ReactPopperTooltipSingleLevel CMSToolId={obj?.newSubChild?.TaskID} row={obj?.newSubChild} AllListId={props?.contextValue} singleLevel={true} masterTaskData={props?.AllMasterTasksData} AllSitesTaskData={props?.AllSitesTaskData} />
                             </span>
                        
                          <a
                            data-interception="off"
                            target="_blank"
                            href={props?.contextValue?.siteUrl +
                                    "/SitePages/Project-Management.aspx?ProjectId" +
                                    obj?.newSubChild?.Id
                            }
                          >
                          </a></div>
                          </div>
                        </div>
                        {
                          obj?.newSubChild?.newFeatChild ? (
                            <>
                            <div className="reStuMainTiles">
                            <div className="reStuTile">
                            <div className="alignCenter fw-semibold">
                            
                                  
                                    {obj?.newSubChild?.newFeatChild?.Item_x0020_Type == 'Project' ? <span className="Dyicons me-1">P</span> :   
                                    (obj?.newSubChild?.newFeatChild?.Item_x0020_Type == "Sprint" ? <span className="Dyicons me-1">X</span> : 
                                    <img className="workmember" src={obj?.newSubChild?.newFeatChild?.SiteIcon} />
                                    )
                                    }
                                  
                                  <span className="mx-2">
                                  <ReactPopperTooltipSingleLevel CMSToolId={obj?.newSubChild?.newFeatChild?.TaskID} row={obj?.newSubChild?.newFeatChild} AllListId={props?.contextValue} singleLevel={true} masterTaskData={props?.AllMasterTasksData} AllSitesTaskData={props?.AllSitesTaskData} />
                             
                                  </span>
                           
                              <a
                                className=""
                                data-interception="off"
                                target="_blank"
                                href={ props?.contextValue?.siteUrl +
                                  "/SitePages/Project-Management.aspx?ProjectId=" +
                                  obj?.newSubChild?.newFeatChild?.Id}
                              >
                                 {obj?.newSubChild?.newFeatChild?.Title}
                              </a></div>
                              </div>
                            </div>

                            {
                              obj?.newSubChild?.newFeatChild?.newActChild ? (
                                   <>
                                     <div className="reStuMainTiles">
                            <div className="reStuTile">
                            <div className="alignCenter fw-semibold">
                            
                                  
                                    {obj?.newSubChild?.newFeatChild?.newActChild?.Item_x0020_Type == 'Project' ? <span className="Dyicons me-1"> "P"</span> :   
                                    (obj?.newSubChild?.newFeatChild?.newActChild?.Item_x0020_Type == "Sprint" ? <span className="Dyicons me-1">"X"</span> : 
                                    <img className="workmember" src={obj?.newSubChild?.newFeatChild?.newActChild?.SiteIcon} />
                                    )
                                    }
                                  
                                  <span className="mx-2">
                                  <ReactPopperTooltipSingleLevel CMSToolId={obj?.newSubChild?.newFeatChild?.newActChild?.TaskID} row={obj?.newSubChild?.newFeatChild?.newActChild} AllListId={props?.contextValue} singleLevel={true} masterTaskData={props?.AllMasterTasksData} AllSitesTaskData={props?.AllSitesTaskData} />
                             
                                  </span>
                           
                              <a
                                className=""
                                data-interception="off"
                                target="_blank"
                                href={ props?.contextValue?.siteUrl +
                                  "/SitePages/Project-Management.aspx?ProjectId=" +
                                  obj?.newSubChild?.newFeatChild?.newActChild?.Id}
                              >
                                 {obj?.newSubChild?.newFeatChild?.newActChild?.Title}
                              </a></div>
                              </div>
                            </div>

                            {
                              obj?.newSubChild?.newFeatChild?.newActChild?.newWrkChild ?
                              (<>
                                   <div className="reStuMainTiles">
                            <div className="reStuTile">
                            <div className="alignCenter fw-semibold">
                            
                                  
                                    {obj?.newSubChild?.newFeatChild?.newActChild?.newWrkChild?.Item_x0020_Type == 'Project' ? <span className="Dyicons me-1"> "P"</span> :   
                                    (obj?.newSubChild?.newFeatChild?.newActChild?.newWrkChild?.Item_x0020_Type == "Sprint" ? <span className="Dyicons me-1">"X"</span> : 
                                    <img className="workmember" src={obj?.newSubChild?.newFeatChild?.newActChild?.newWrkChild?.SiteIcon} />
                                    )
                                    }
                                  
                                  <span className="mx-2">
                                  <ReactPopperTooltipSingleLevel CMSToolId={obj?.newSubChild?.newFeatChild?.newActChild?.newWrkChild?.TaskID} row={obj?.newSubChild?.newFeatChild?.newActChild?.newWrkChild} AllListId={props?.contextValue} singleLevel={true} masterTaskData={props?.AllMasterTasksData} AllSitesTaskData={props?.AllSitesTaskData} />
                             
                                  </span>
                           
                              <a
                                className=""
                                data-interception="off"
                                target="_blank"
                                href={ props?.contextValue?.siteUrl +
                                  "/SitePages/Project-Management.aspx?ProjectId=" +
                                  obj?.newSubChild?.newFeatChild?.newActChild?.newWrkChild?.Id}
                              >
                                 {obj?.newSubChild?.newFeatChild?.newActChild?.newWrkChild?.Title}
                              </a></div>
                              </div>
                            </div>

                              </>):
                              ('')
                            }
                                   </>
                              ) : 
                              ('')
                            }
                              </>
                            
                          ) : ("")
                        }
                      </>
                    ) : (
                      ""
                    )}
                    {RestructureChecked?.map((items: any) => (
                      <div className="reStuMainTiles">
                        <a
                          data-interception="off"
                          target="_blank"
                          className="hreflink serviceColor_Active fw-semibold reStuTile"
                          href={ props?.contextValue?.siteUrl +
                                "/SitePages/Project-Management.aspx?ProjectId" +
                                obj?.Id
                          }
                        >
                          
                          {
                           newItemBackUp != undefined && newItemBackUp != null ?
                           (
                            RestructureChecked[0]?.Item_x0020_Type == 'Sprint' || RestructureChecked[0]?.Item_x0020_Type == 'Project'  ?
                             <span className="Dyicons">X</span> :  <img className="workmember" src={RestructureChecked[0]?.SiteIcon} />
                             
                            
                           ) : 'P'
                          }
                          {/* <span className="Dyicons">{newItemBackUp != undefined && newItemBackUp != null ? "X" : "P"}</span> */}
                          {
                            RestructureChecked[0]?.Item_x0020_Type == 'Sprint' ? 
                            <div className="alignCenter ms-1 me-2">{`${newItemBackUp?.TaskID}-X${newItemBackUp?.subRows?.length+1}`}</div> :
                            <div className="alignCenter ms-1 me-2">{RestructureChecked[0]?.TaskID}</div>
                          }
                          
                          
                         
                          {items?.Title}
                        </a>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
        <footer className="mt-4 text-end">
          <button className="me-2 btn btn-primary" onClick={projectRestruture}>
            Save
          </button>
          <button
            className="btn me-2 btn-default ms-1"
            onClick={() => setProjects(false)}
          >
            Cancel
          </button>
        </footer>
        </div>



      </Panel>
      }

      
{
  topProject && 
  <Panel
  onRenderHeader={onRenderCustomCalculateSCmulti}
  isOpen={topProject}
  isBlocking={false}
  onDismiss={() => setTopProject(false)}
>
  <div className="mt-2">
   {
    props?.projectmngmnt == "projectmngmnt" ? "After restructuring selected item tagged with Project" : " After restructuring selected item becomes Project"
   }
   
    <footer className="mt-4 text-end">
      <button
        className="me-2 btn btn-primary"
        onClick={projectRestruture}
      >
        Save
      </button>
      <button
        className="btn me-2 btn-default ms-1"
        onClick={() => setTopProject(false)}
      >
        Cancel
      </button>
    </footer>
  </div>
</Panel>
}
     


{
  projectmngmnt === true && restructureItem?.length > 1 &&
  <Panel
  onRenderHeader={onRenderCustomCalculateSCmulti}
  isOpen={projectmngmnt}
  isBlocking={false}
  onDismiss={() => setProjectmngmnt(false)}
>
  <div className="mt-2">
  <div className="my-1">
              Selected Item will restructure 
              inside
              {newItemBackUp?.Item_x0020_Type == "Sprint" ?
                <span className="Dyicons me-1 ms-1">
                  X
                </span> : (newItemBackUp?.TaskType?.Id == 1 || newItemBackUp?.TaskType?.Id == 3 ?  <img
                            className="workmember "
                              src={newItemBackUp?.SiteIcon}
                            /> : <span className="Dyicons me-1 ms-1">
                            P
                          </span>)
              }
              {" " + newItemBackUp?.Title }
            </div>
   
    <footer className="mt-4 text-end">
      <button
        className="me-2 btn btn-primary"
        onClick={projectMngmntFuc}
      >
        Save
      </button>
      <button
        className="btn me-2 btn-default ms-1"
        onClick={() => setProjectmngmnt(false)}
      >
        Cancel
      </button>
    </footer>
  </div>
</Panel>
  
}


      {
        projectmngmnt === true && restructureItem?.length == 1 &&
        <Panel
      onRenderHeader={onRenderCustomCalculateS4CProject}
        isOpen={projectmngmnt}
        type={PanelType.medium}
        isBlocking={false}
        onDismiss={() => setProjectmngmnt(false)}
      >

            <div className="modal-body">
            {/* <div className="my-1">
              Selected Item will restructure 
              inside
              {newItemBackUp?.Item_x0020_Type == "Sprint" ?
                <span className="Dyicons me-1 ms-1">
                  X
                </span> : (newItemBackUp?.TaskType?.Id == 1 || newItemBackUp?.TaskType?.Id == 3 ?  <img
                            className="workmember mx-1"
                              src={newItemBackUp?.SiteIcon}
                            /> : <span className="Dyicons me-1 ms-1">
                            P
                          </span>)
              }
              {newItemBackUp?.Title }
            </div> */}
            <label className="fw-bold form-label full-width"> Old: </label>
            <div
              className="alignCenter border p-1"
              style={{ flexWrap: "wrap" }}
            >
              {OldArrayBackup?.map(function (obj: any) {
                return (
                  <div className="mainParentSec">
                    <div className="reStuMainTiles">
                    <div className="reStuTile">
                    <div className={`${obj?.newSubChild != undefined && obj?.newSubChild != null ? 'alignCenter' : 'alignCenter fw-semibold'}`}>
                    {  obj?.Item_x0020_Type == 'Project' ? <div className="Dyicons">P</div> : (obj?.Item_x0020_Type == "Sprint" ? 
                            <div className="Dyicons">X</div> :
                            <img
                            className="workmember"
                              src={obj?.SiteIcon}
                            />)}
                            <span className="mx-2">
                            <ReactPopperTooltipSingleLevel CMSToolId={obj?.TaskID} row={obj} AllListId={props?.contextValue} singleLevel={true} masterTaskData={props?.AllMasterTasksData} AllSitesTaskData={props?.AllSitesTaskData} />
                     
                            </span>
                        
                      <a
                        data-interception="off"
                        target="_blank"
                        className="serviceColor_Active alignCenter"
                        href={obj.Item_x0020_Type == "Project" || obj.Item_x0020_Type == "Sprint" ?  props?.contextValue?.siteUrl +
                                "/SitePages/Project-Management.aspx?ProjectId=" +
                                obj?.Id :props?.contextValue?.siteUrl +
                                "/SitePages/Task-Profile.aspx?taskId=" +
                                obj?.Id + "&Site=" + obj?.siteType }
                      >
                         {/* <div className="alignCenter">{obj?.TaskID}</div> */}
                      
                          {obj?.newSubChild != undefined &&
                    obj?.newSubChild != null ? (
                     ""
                    ) : (
                      <>{obj?.Title}</>
                    )}
                          
                      </a></div>
                      </div>
                    </div>
                    {obj?.newSubChild ? (
                      <>
                        <div className="reStuMainTiles">
                        <div className="reStuTile">
                        <div className={`${obj?.newSubChild?.feature != undefined && obj?.newSubChild?.feature != null ? 'alignCenter' : 'alignCenter fw-semibold'}`}>
                        {  obj?.newSubChild?.Item_x0020_Type == 'Project' ? <div className="Dyicons">P</div> : (obj?.newSubChild?.Item_x0020_Type == "Sprint" ? 
                            <div className="Dyicons">X</div> :
                            <img className="workmember"
                              src={obj?.newSubChild?.SiteIcon}
                            />)}
                            <span className="mx-2">
                            <ReactPopperTooltipSingleLevel CMSToolId={obj?.newSubChild?.TaskID} row={obj?.newSubChild} AllListId={props?.contextValue} singleLevel={true} masterTaskData={props?.AllMasterTasksData} AllSitesTaskData={props?.AllSitesTaskData} />
                         
                            </span>
                        
                          <a
                            className=""
                            data-interception="off"
                            target="_blank"
                            href={ obj?.newSubChild?.Item_x0020_Type == "Project" || obj?.newSubChild?.Item_x0020_Type == "Sprint" ?  props?.contextValue?.siteUrl +
                            "/SitePages/Project-Management.aspx?ProjectId=" +
                            obj?.newSubChild?.Id :props?.contextValue?.siteUrl +
                            "/SitePages/Task-Profile.aspx?taskId=" +
                            obj?.newSubChild?.Id + "&Site=" + obj?.newSubChild?.siteType}
                          >
                             {/* <div className="alignCenter">{obj?.newSubChild?.TaskID}</div> */}
                             
                          {obj?.newSubChild?.feature != undefined &&
                    obj?.newSubChild?.feature != null ? (
                     ""
                    ) : (
                      <>{obj?.newSubChild?.Title}</>
                    )}
                            
                          </a></div>
                          </div>
                        </div>
                      </>
                    ) : (
                      ""
                    )}
                     {obj?.newSubChild?.feature ? (
                      <>
                        <div className="reStuMainTiles">
                        <div className="reStuTile">
                        <div className={`${obj?.newSubChild?.feature?.activity != undefined && obj?.newSubChild?.feature?.activity != null ? 'alignCenter' : 'alignCenter fw-semibold'}`}>
                        {  obj?.newSubChild?.feature?.Item_x0020_Type == 'Project' ? <div className="Dyicons">P</div> : (obj?.newSubChild?.feature?.Item_x0020_Type == "Sprint" ? 
                            <div className="Dyicons">X</div> : 
                            <img className="workmember"
                              src={obj?.newSubChild?.feature?.SiteIcon}
                            />)}
                            <span className="mx-2">
                            <ReactPopperTooltipSingleLevel CMSToolId={obj?.newSubChild?.feature?.TaskID} row={obj?.newSubChild?.feature} AllListId={props?.contextValue} singleLevel={true} masterTaskData={props?.AllMasterTasksData} AllSitesTaskData={props?.AllSitesTaskData} />
                         
                            </span>
                        
                          <a
                            data-interception="off"
                            target="_blank"
                            href={
                              obj?.newSubChild?.feature?.Item_x0020_Type == "Project" || obj?.newSubChild?.feature?.Item_x0020_Type == "Sprint" ?  props?.contextValue?.siteUrl +
                              "/SitePages/Project-Management.aspx?ProjectId=" +
                              obj?.newSubChild?.feature?.Id :props?.contextValue?.siteUrl +
                              "/SitePages/Task-Profile.aspx?taskId=" +
                              obj?.newSubChild?.feature?.Id + "&Site=" + obj?.newSubChild?.feature?.siteType
                            }
                            className="alignCenter"
                          >
                            {/* <div className="alignCenter">{obj?.newSubChild?.feature?.TaskID}</div> */}
                     
                          {obj?.newSubChild?.feature?.activity != undefined &&
                    obj?.newSubChild?.feature?.activity != null ? (
                     ""
                    ) : (
                      <div className="alignCenter">{obj?.newSubChild?.feature?.Title}</div>
                    )}
                          </a></div>
                          </div>
                        </div>
                      </>
                    ) : (
                      ""
                    )}
                     {obj?.newSubChild?.feature?.activity ? (
                      <>
                        <div className="reStuMainTiles">
                        <div className="reStuTile">
                        <div className="alignCenter fw-semibold">
                        {  obj?.newSubChild?.feature?.activity?.Item_x0020_Type == 'Project' ? <div className="Dyicons">P</div> : (obj?.newSubChild?.feature?.activity?.Item_x0020_Type == "Sprint" ? 
                            <div className="Dyicons">X</div> :
                            <img className="workmember"
                              src={obj?.newSubChild?.feature?.activity?.SiteIcon}
                            />)}
                            <span className="mx-2">
                            <ReactPopperTooltipSingleLevel CMSToolId={obj?.newSubChild?.feature?.activity?.TaskID} row={obj?.newSubChild?.feature?.activity} AllListId={props?.contextValue} singleLevel={true} masterTaskData={props?.AllMasterTasksData} AllSitesTaskData={props?.AllSitesTaskData} />
                         
                            </span>
                       
                          <a
                            data-interception="off"
                            target="_blank"
                            href={
                              obj?.newSubChild?.feature?.activity?.Item_x0020_Type == "Project" || obj?.newSubChild?.feature?.activity?.Item_x0020_Type == "Sprint" ?  props?.contextValue?.siteUrl +
                              "/SitePages/Project-Management.aspx?ProjectId=" +
                              obj?.newSubChild?.feature?.activity?.Id :props?.contextValue?.siteUrl +
                              "/SitePages/Task-Profile.aspx?taskId=" +
                              obj?.newSubChild?.feature?.activity?.Id + "&Site=" + obj?.newSubChild?.feature?.activity?.siteType
                            }
                            className=""
                          > {obj?.newSubChild?.feature?.activity?.Title}
                          </a></div>
                          </div>
                        </div>
                      </>
                    ) : (
                      ""
                    )}
                  </div>
                );
              })}
            </div>
            <label className="fw-bold form-label full-width mt-3"> New: </label>
            <div
              className="alignCenter border p-1"
              style={{ flexWrap: "wrap" }}
            >
              {NewArrayBackup?.map(function (obj: any) {
                return (
                  <div className="mainParentSec">
                    <div className="reStuMainTiles">
                    <div className="reStuTile">
                    <div className="alignCenter">
                    {  obj?.Item_x0020_Type == 'Project' ? <div className="Dyicons">P</div> : (obj?.Item_x0020_Type == "Sprint" ? 
                            <div className="Dyicons">X</div> :
                            <img
                            className="workmember"
                              src={obj?.SiteIcon}
                            />)}
                            <span className="mx-2">
                            <ReactPopperTooltipSingleLevel CMSToolId={obj?.TaskID} row={obj} AllListId={props?.contextValue} singleLevel={true} masterTaskData={props?.AllMasterTasksData} AllSitesTaskData={props?.AllSitesTaskData} />
                     
                            </span>
                       
                      <a
                        data-interception="off"
                        target="_blank"
                        className="hreflink serviceColor_Active "
                        href={props?.contextValue?.siteUrl +
                                "/SitePages/Project-Management.aspx?ProjectId" +
                                obj?.Id
                        }
                      >
                      </a></div>
                      </div>
                    </div>
                    {obj?.newSubChild ? (
                      <>
                        
                        <div className="reStuMainTiles">
                        <div className="reStuTile">
                        <div className="alignCenter">
                        {  obj?.newSubChild?.Item_x0020_Type == 'Project' ? <div className="Dyicons">P</div> : (obj?.newSubChild?.Item_x0020_Type == "Sprint" ? 
                            <div className="Dyicons">X</div> : 
                            <img className="workmember"
                              src={obj?.newSubChild?.SiteIcon}
                            />)}
                            <span className="mx-2">
                            <ReactPopperTooltipSingleLevel CMSToolId={obj?.newSubChild?.TaskID} row={obj?.newSubChild} AllListId={props?.contextValue} singleLevel={true} masterTaskData={props?.AllMasterTasksData} AllSitesTaskData={props?.AllSitesTaskData} />
                         
                            </span>
                        
                          <a
                            data-interception="off"
                            target="_blank"
                            href={props?.contextValue?.siteUrl +
                                    "/SitePages/Project-Management.aspx?ProjectId" +
                                    obj?.newSubChild?.Id
                            }
                          >
                          </a></div>
                          </div>
                        </div>
                      </>
                    ) : (
                      ""
                    )}
                    {obj?.newSubChild?.feature ? (
                      <>
                        <div className="reStuMainTiles">
                        <div className="reStuTile">
                        <div className="alignCenter">
                        {  obj?.newSubChild?.feature?.Item_x0020_Type == 'Project' ? <div className="Dyicons">P</div> : (obj?.newSubChild?.feature?.Item_x0020_Type == "Sprint" ? 
                            <div className="Dyicons">X</div> : 
                            <img className="workmember"
                              src={obj?.newSubChild?.feature?.SiteIcon}
                            />)}
                            <span className="mx-2">
                            <ReactPopperTooltipSingleLevel CMSToolId={obj?.newSubChild?.feature?.TaskID} row={obj?.newSubChild?.feature} AllListId={props?.contextValue} singleLevel={true} masterTaskData={props?.AllMasterTasksData} AllSitesTaskData={props?.AllSitesTaskData} />
                         
                            </span>
                        
                          <a
                            data-interception="off"
                            target="_blank"
                            href={
                              obj?.newSubChild?.feature?.Item_x0020_Type == "Project" || obj?.newSubChild?.feature?.Item_x0020_Type == "Sprint" ?  props?.contextValue?.siteUrl +
                              "/SitePages/Project-Management.aspx?ProjectId=" +
                              obj?.newSubChild?.feature?.Id :props?.contextValue?.siteUrl +
                              "/SitePages/Task-Profile.aspx?taskId=" +
                              obj?.newSubChild?.feature?.Id + "&Site=" + obj?.newSubChild?.feature?.siteType
                            }
                            className=""
                          >
                          {obj?.newSubChild?.feature?.activity != undefined &&
                    obj?.newSubChild?.feature?.activity != null ? (
                     ""
                    ) : (
                      <div className="alignCenter">{obj?.newSubChild?.feature?.Title}</div>
                    )}
                          </a></div>
                          </div>
                        </div>
                      </>
                    ) : (
                      ""
                    )}
                    {obj?.newSubChild?.feature?.activity ? (
                      <>
                        <div className="reStuMainTiles">
                        <div className="reStuTile">
                        <div className="alignCenter">
                        {  obj?.newSubChild?.feature?.activity?.Item_x0020_Type == 'Project' ? <div className="Dyicons">P</div> : (obj?.newSubChild?.feature?.activity?.Item_x0020_Type == "Sprint" ? 
                            <div className="Dyicons">X</div> :
                            <img
                            className="workmember"
                              src={obj?.newSubChild?.feature?.activity?.SiteIcon}
                            />)}
                            <span className="mx-2">
                            <ReactPopperTooltipSingleLevel CMSToolId={obj?.newSubChild?.feature?.activity?.TaskID} row={obj?.newSubChild?.feature?.activity} AllListId={props?.contextValue} singleLevel={true} masterTaskData={props?.AllMasterTasksData} AllSitesTaskData={props?.AllSitesTaskData} />
                         
                            </span>
                       
                          <a
                            data-interception="off"
                            target="_blank"
                            href={
                              obj?.newSubChild?.feature?.activity?.Item_x0020_Type == "Project" || obj?.newSubChild?.feature?.activity?.Item_x0020_Type == "Sprint" ?  props?.contextValue?.siteUrl +
                              "/SitePages/Project-Management.aspx?ProjectId=" +
                              obj?.newSubChild?.feature?.activity?.Id :props?.contextValue?.siteUrl +
                              "/SitePages/Task-Profile.aspx?taskId=" +
                              obj?.newSubChild?.feature?.activity?.Id + "&Site=" + obj?.newSubChild?.feature?.activity?.siteType
                            }
                            className=""
                          > {obj?.newSubChild?.feature?.activity?.Title}
                          </a></div>
                          </div>
                        </div>
                      </>
                    ) : (
                      ""
                    )}
                    {RestructureChecked?.map((items: any) => (
                      <div className="reStuMainTiles">
                        <a
                          data-interception="off"
                          target="_blank"
                          className="hreflink serviceColor_Active fw-semibold reStuTile"
                          href={ props?.contextValue?.siteUrl +
                            "/SitePages/Task-Profile.aspx?taskId=" +
                            items?.Id + "&Site=" + items?.siteType
                          }
                        >
                          
                        
                                <img
                                 className="workmember"
                                  src={items?.SiteIcon}
                                />
                                <span className="mx-2">
                                {items?.TaskID}
                                </span>
                        
                          {items?.Title}
                        </a>
                      </div>
                    ))}

                  </div>
                  
                );
                
              })}
             
            </div>
            <div>
            {restructureItem != undefined && restructureItem?.length > 0 && 
            newItemBackUp?.TaskType?.Id == 1 && (
              <div className="mt-2">
                  <label className="form-label me-2">{"Select Task Type :"}</label>
                  <label className="SpfxCheckRadio">
                    <input
                      type="radio"
                      className="radio"                 
                      value="Workstream"
                      checked={
                        RestructureChecked[0]?.TaskType?.Id == 3
                          ? true
                          : RestructureChecked[0]?.TaskType?.Id == 1
                          ? true
                          : false
                      }
                      onChange={(e) => setRestructure(RestructureChecked, 3)}
                       />
                     {"Workstream"}
                  </label>
                  <label className="SpfxCheckRadio">
                    <input
                      type="radio"
                      className="radio"
                      name="fav_language"
                      value="Task"
                      checked={
                        RestructureChecked[0]?.TaskType?.Id === 2 ? true : false
                      }
                      onChange={(e) => setRestructure(RestructureChecked, 2)}
                    /> {"Task"}
                  </label>
              </div>
            ) }</div>
            </div>
        <footer className="mt-4 text-end">
          <button className="me-2 btn btn-primary" onClick={projectMngmntFuc}>
            Save
          </button>
          <button
            className="btn btn-default ms-1"
            onClick={() => setProjectmngmnt(false)}
          >
            Cancel
          </button>
        </footer>
        </Panel>
      }


       {trueTopCompo == true ? (
        <span>
          <Panel
            onRenderHeader={onRenderCustomCalculateSCmulti}
            isOpen={trueTopCompo}
            isBlocking={false}
            onDismiss={closePanel}
          >
            <div className="mt-2">
              After restructuring selected item becomes {query4TopIcon}
              <footer className="mt-4 text-end">
                <button className="me-2 btn btn-primary" onClick={makeTopComp}>
                  Save
                </button>
                <button
                  className="btn me-2 btn-default ms-1"
                  onClick={closePanel}
                >
                  Cancel
                </button>
              </footer>
            </div>
          </Panel>
          {/* --------------------------------------------------------Restructuring End---------------------------------------------------------------------------------------------------- */}
        </span>
      ) : (
        ""
      )}
    </>
  );
};

export default forwardRef(RestructuringCom);
