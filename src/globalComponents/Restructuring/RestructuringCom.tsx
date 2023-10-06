import React, { useEffect, useState, useRef, forwardRef } from 'react'
import { Web } from 'sp-pnp-js';
import { Modal, Panel, PanelType } from "office-ui-fabric-react";
import { GetTaskId } from '../globalCommon';
import Tooltip from '../Tooltip';
// import { restructureCallBack } from '../../webparts/teamPortfolio/components/TeamPortlioTable';

const RestructuringCom = (props: any, ref: any) => {

  let restructureCallBack = props?.restructureCallBack;

  const [OldArrayBackup, setOldArrayBackup]: any = React.useState([]);
  const [allData, setAllData]: any = React.useState([]);
  const [restructureItem, setRestructureItem]: any = React.useState([]);
  const [NewArrayBackup, setNewArrayBackup]: any = React.useState([]);
  const [ResturuningOpen, setResturuningOpen]: any = React.useState(false);
  const [newItemBackUp, setNewItemBackUp]: any = React.useState([]);
  const [checkSubChilds, setCheckSubChilds]: any = React.useState([]);
  const [RestructureChecked, setRestructureChecked]: any = React.useState([]);
  const [restructuredItemarray, setRestructuredItemarray]: any = React.useState([]);
  const [trueTopCompo, setTrueTopCompo]: any = React.useState(false);
  const [checkItemLength, setCheckItemLength]: any = React.useState(false);
  const [query4TopIcon, setQuery4TopIcon]:any = React.useState('');



  useEffect(() => {

     if (props?.restructureItem != undefined && props?.restructureItem?.length > 0) {
      let array: any = []
      let portfolioTypeCheck:any;
      props?.restructureItem?.map((obj: any) => {
        if(obj?.original?.Item_x0020_Type === 'Task'){
          const matchingTask = props?.AllMasterTasksData?.find((task:any) => obj?.original?.Portfolio?.Id === task?.Id);
          if (matchingTask) {
            portfolioTypeCheck = matchingTask?.PortfolioType?.Title;
            obj.original.PortfolioTypeCheck = matchingTask?.PortfolioType?.Title;
          }else{
            portfolioTypeCheck = '';
            obj.original.PortfolioTypeCheck = '';
          }
        }
        array?.push(obj.original);
      })
      setRestructureItem(array);

      props?.allData?.map((obj:any)=>{
        obj.PortfolioTypeCheck=''
          const matchingTask = props?.AllMasterTasksData?.find((task:any) => obj?.Portfolio?.Id === task?.Id);
          if (matchingTask && portfolioTypeCheck != '') {
            obj.PortfolioTypeCheck = matchingTask?.PortfolioType?.Title;
          }else{
            if(portfolioTypeCheck != '' && obj?.Item_x0020_Type !== "Task" && obj?.Title !== "Others"){
              obj.PortfolioTypeCheck = obj?.PortfolioType?.Title;
            }
            else if(portfolioTypeCheck != '' && obj?.Title == "Others"){
              obj.PortfolioTypeCheck = portfolioTypeCheck;
            }else{
              obj.PortfolioTypeCheck = ''
            }
           }
        if (obj?.subRows?.length > 0 && obj?.subRows != undefined) {
          obj?.subRows?.map((sub: any) => {
            sub.PortfolioTypeCheck=''
              const matchingTask = props?.AllMasterTasksData?.find((task:any) => sub?.Portfolio?.Id === task?.Id);
              if (matchingTask && portfolioTypeCheck != '') {
                sub.PortfolioTypeCheck = matchingTask?.PortfolioType?.Title;
              }else{
                if(portfolioTypeCheck != '' && sub?.Item_x0020_Type !== "Task" && sub?.Title !== "Others"){
                  sub.PortfolioTypeCheck = sub?.PortfolioType?.Title;
                }
                else if(portfolioTypeCheck != '' && sub?.Title == "Others"){
                  sub.PortfolioTypeCheck = portfolioTypeCheck;
                }else{
                  sub.PortfolioTypeCheck = ''
                }
              }
            if (sub?.subRows?.length > 0 && sub?.subRows != undefined) {
              sub?.subRows?.map((feature: any) => {
                feature.PortfolioTypeCheck=''
                  const matchingTask = props?.AllMasterTasksData?.find((task:any) => feature?.Portfolio?.Id === task?.Id);
                  if (matchingTask && portfolioTypeCheck != '') {
                    feature.PortfolioTypeCheck = matchingTask?.PortfolioType?.Title;
                  }else{
                    if(portfolioTypeCheck != '' && feature?.Item_x0020_Type !== "Task" && feature?.Title !== "Others"){
                      feature.PortfolioTypeCheck = feature?.PortfolioType?.Title;
                    }
                    else if(portfolioTypeCheck != '' && feature?.Title == "Others"){
                      feature.PortfolioTypeCheck = portfolioTypeCheck;
                    }else{
                      feature.PortfolioTypeCheck = ''
                    }
                  }
                if (feature?.subRows?.length > 0 && feature?.subRows != undefined) {
                  feature?.subRows?.map((activity: any) => {
                    activity.PortfolioTypeCheck=''
                  const matchingTask = props?.AllMasterTasksData?.find((task:any) => activity?.Portfolio?.Id === task?.Id);
                  if (matchingTask && portfolioTypeCheck != '') {
                    activity.PortfolioTypeCheck = matchingTask?.PortfolioType?.Title;
                  }else{
                    if(portfolioTypeCheck != '' && activity?.Item_x0020_Type !== "Task" && activity?.Title !== "Others"){
                      activity.PortfolioTypeCheck = activity?.PortfolioType?.Title;
                    }
                    else if(portfolioTypeCheck != '' && activity?.Title == "Others"){
                      activity.PortfolioTypeCheck = portfolioTypeCheck;
                    }else{
                      activity.PortfolioTypeCheck = ''
                    }
                   }
                if (activity?.subRows?.length > 0 && activity?.subRows != undefined) {
                  activity?.subRows?.map((wrkstrm: any) => {
                    wrkstrm.PortfolioTypeCheck=''
                      const matchingTask = props?.AllMasterTasksData?.find((task:any) => wrkstrm?.Portfolio?.Id === task?.Id);
                      if (matchingTask && portfolioTypeCheck != '') {
                        wrkstrm.PortfolioTypeCheck = matchingTask?.PortfolioType?.Title;
                      }else{
                        if(portfolioTypeCheck != '' && wrkstrm?.Item_x0020_Type !== "Task" && wrkstrm?.Title !== "Others"){
                          wrkstrm.PortfolioTypeCheck = wrkstrm?.PortfolioType?.Title;
                        }
                        else if(portfolioTypeCheck != '' && wrkstrm?.Title == "Others"){
                          wrkstrm.PortfolioTypeCheck = portfolioTypeCheck;
                        }else{
                          wrkstrm.PortfolioTypeCheck = ''
                        }
                        }
                    if (wrkstrm?.subRows?.length > 0 && wrkstrm?.subRows != undefined) {
                      wrkstrm?.subRows?.map((task: any) => {
                        task.PortfolioTypeCheck=''
                          const matchingTask = props?.AllMasterTasksData?.find((task:any) => task?.Portfolio?.Id === task?.Id);
                          if (matchingTask && portfolioTypeCheck != '') {
                            task.PortfolioTypeCheck = matchingTask?.PortfolioType?.Title;
                          }else{
                            if(portfolioTypeCheck != '' && obj?.Title == "Others"){
                              task.PortfolioTypeCheck = portfolioTypeCheck;
                            }else{
                              task.PortfolioTypeCheck = ''
                            }
                          }
                      })}
                  })}
                  })}
              })}
          })}
        
  })
  setAllData(props?.allData); 

      
    }
  }, [props?.restructureItem])


  useEffect(() => {
    if (restructureItem?.length === 0 && checkItemLength) {
      let topCompo: any = false;
      let array = allData;
      array?.map((obj: any) => {
        obj.isRestructureActive = false;
        if (obj?.subRows?.length > 0 && obj?.subRows != undefined) {
          obj?.subRows?.map((sub: any) => {
            sub.isRestructureActive = false;
            if (sub?.subRows?.length > 0 && sub?.subRows != undefined) {
              sub?.subRows?.map((feature: any) => {
                feature.isRestructureActive = false;
                if (feature?.subRows?.length > 0 && feature?.subRows != undefined) {
                  feature?.subRows?.map((activity: any) => {
                    activity.isRestructureActive = false;
                    if (activity?.subRows?.length > 0 && activity?.subRows != undefined) {
                      activity?.subRows?.map((wrkstrm: any) => {
                        wrkstrm.isRestructureActive = false;
                        if (wrkstrm?.subRows?.length > 0 && wrkstrm?.subRows != undefined) {
                          wrkstrm?.subRows?.map((task: any) => {
                            task.isRestructureActive = false;
                          })
                        }
                      })
                    }
                  })
                }
              })
            }
          })
        }
      })
      props.restructureFunct(false);
      restructureCallBack(array, topCompo);
    }
  }, [restructureItem])



  const buttonRestructureCheck = () => {
    let checkItem_x0020_Type: any = restructureItem[0]?.Item_x0020_Type == "Task" ? restructureItem[0]?.TaskType?.Id : restructureItem[0]?.Item_x0020_Type;
    let checkSiteType: any = restructureItem[0]?.siteType;
    let PortfolioType: any = restructureItem[0]?.PortfolioTypeCheck;
    let checkPortfolioType: boolean = true;
    let alertNotify: boolean = true;
    let alertNotifyFirst: boolean = true;
    let itemTypes: string = '';
    if (restructureItem != undefined && restructureItem?.length > 0) {
      if (restructureItem?.length > 1) {
        restructureItem?.map((items: any, length: any) => {
          if (PortfolioType === items?.PortfolioTypeCheck && checkPortfolioType) {
            if ((checkItem_x0020_Type === items?.TaskType?.Id || checkItem_x0020_Type === items?.Item_x0020_Type) && alertNotifyFirst) {
              if (checkSiteType == items?.siteType && alertNotify) {
                itemTypes = "SAME_TYPE"
              } else {
                itemTypes = "DIFFRENT_TYPE"
                alert("You can not restructure the items with diffrent site type");
                alertNotify = false;
              }
            } else {
              alertNotifyFirst = false;
              checkPortfolioType = false;
              itemTypes = "";
              alert("You can not restructure the items with diffrent types");
            }
          } else {
            if (checkPortfolioType) {
              checkPortfolioType = false;
              itemTypes = "";
              alert("You can not restructure the items with diffrent portfolio types");
            }
          }
        })
        if (itemTypes == "SAME_TYPE") {
          buttonRestructureSameType();
        }
      }
    }
    if (restructureItem?.length == 1) {
      buttonRestructuring();
    }
  }


  const buttonRestructureSameType = () => {
    if (restructureItem != undefined) {
      let ArrayTest: any = [];
      let checkSubcompo: boolean = true;
      let topCompo: any = false;
      let checkfeature: boolean = true;
      let checkchilds: string = '';
      // let noChild : boolean = true;
      let array = allData;
      let arrayalert: boolean = true;

      if (restructureItem?.[0].Item_x0020_Type === "Component") {
        topCompo = false;
        restructureItem?.map((items: any) => {
          if (items?.subRows != undefined && items?.subRows?.length > 0) {
            items?.subRows?.map((subItem: any) => {
              if (subItem.Item_x0020_Type == "SubComponent") {
                checkSubcompo = false;
                checkfeature = false;
                checkchilds = "SUBCOMPONENT"
              } else if (subItem.Item_x0020_Type == "Feature" && checkSubcompo) {
                checkfeature = false;
                checkchilds = "FEATURE"
              } else if (subItem.Item_x0020_Type == "Task" && checkfeature) {
                checkchilds = "TASK"
              }
            })
          }
        })


        if (checkchilds === "SUBCOMPONENT") {
          alert("you can not restructure this items");
        } else if (checkchilds === "FEATURE") {
          if (array != undefined && array?.length > 0) {
            let newChildarray: any = [];
            let newarrays: any = [];
            array?.map((obj: any) => {
              let actionsPerformed = false;
              restructureItem?.map((items: any) => {
                let newObj: any;
                if (items?.PortfolioTypeCheck === obj.PortfolioTypeCheck && !actionsPerformed) {
                  if (items?.Id !== obj.Id && obj.Item_x0020_Type != "Task") {
                    obj.isRestructureActive = true;
                    obj.Restructuring = obj?.PortfolioTypeCheck == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png" : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                  } else {
                    newObj = { Title: obj?.Title, TaskType: { Id: obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id }, Id: obj.Id, Item_x0020_Type: obj.Item_x0020_Type, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle };
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
              })
            })
          }
        } else if (checkchilds === "TASK" || checkchilds === '') {
          if (array != undefined && array?.length > 0) {
            let newChildarray: any = [];
            let newarrays: any = [];
            array?.map((obj: any) => {
              let actionsPerformed = false;
              restructureItem?.map((items: any) => {

                let newObj: any;
                if (items?.PortfolioTypeCheck === obj.PortfolioTypeCheck && !actionsPerformed) {
                  if (items?.Id !== obj.Id && obj.Item_x0020_Type != "Task") {
                    obj.isRestructureActive = true;
                    obj.Restructuring = obj?.PortfolioTypeCheck == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png" : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                  } else {
                    newObj = { Title: obj?.Title, TaskType: { Id: obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id }, Id: obj.Id, Item_x0020_Type: obj.Item_x0020_Type, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle };
                    newChildarray?.push(newObj);
                    newarrays?.push(obj);
                    setRestructuredItemarray(newarrays);
                    setCheckSubChilds(obj);
                    setRestructureChecked(newChildarray);
                    ArrayTest?.push(newObj);
                    actionsPerformed = true;
                    obj.isRestructureActive = false;
                  }

                  if (obj?.subRows != undefined && obj?.subRows?.length > 0 && !actionsPerformed) {
                    obj?.subRows?.map((sub: any) => {
                      if (items?.Id !== sub.Id && sub.Item_x0020_Type != "Task" && sub.Item_x0020_Type != 'Feature') {
                        sub.isRestructureActive = true;
                        sub.Restructuring = sub?.PortfolioTypeCheck == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png" : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                      } else {
                        if (items?.Id === sub.Id) {
                          newObj = {
                            Title: obj?.Title, TaskType: { Id: obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id }, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle,
                            newSubChild: { Title: sub?.Title, TaskType: { Id: sub.TaskType?.Id == undefined ? '' : sub.TaskType?.Id }, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIconTitle === undefined ? sub.SiteIcon : sub.SiteIconTitle, }
                          };
                          newarrays?.push(obj);
                          setRestructuredItemarray(newarrays);
                          setCheckSubChilds(sub);
                          newChildarray?.push(newObj.newSubChild)
                          setRestructureChecked(newChildarray);
                          ArrayTest?.push(newObj);
                          actionsPerformed = true;
                          sub.isRestructureActive = false;
                        }
                      }
                    })
                  }
                }
              })
            })
          }
        }

      } else if (restructureItem?.[0].Item_x0020_Type === "SubComponent") {
        restructureItem?.map((items: any) => {
          if (items?.subRows != undefined && items?.subRows?.length > 0) {
            items?.subRows?.map((subItem: any) => {
              if (subItem.Item_x0020_Type == "Feature") {
                checkfeature = false;
                checkchilds = "FEATURE"
              } else if (subItem.Item_x0020_Type == "Task" && checkfeature) {
                checkchilds = "TASK"
              }
            })
          }
        })


        if (checkchilds === "FEATURE") {
          if (array != undefined && array?.length > 0) {
            topCompo = true;
            let newChildarray: any = [];
            let newarrays: any = [];
            array?.map((obj: any) => {
              let actionsPerformed = false;
              restructureItem?.map((items: any) => {
                let newObj: any;
                if (items?.PortfolioTypeCheck === obj.PortfolioTypeCheck && !actionsPerformed) {
                  if (items?.Id !== obj.Id && obj.Item_x0020_Type != "Task") {
                    obj.isRestructureActive = true;
                    obj.Restructuring = obj?.PortfolioTypeCheck == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png" : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                  } else {
                    newObj = { Title: obj?.Title, TaskType: { Id: obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id }, Id: obj.Id, Item_x0020_Type: obj.Item_x0020_Type, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle };
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
              })
            })
          }
        } else if (checkchilds === "TASK" || checkchilds === '') {
          if (array != undefined && array?.length > 0) {
            topCompo = true;
            let newChildarray: any = [];
            let newarrays: any = [];
            array?.map((obj: any) => {
              let actionsPerformed = false;
              restructureItem?.map((items: any) => {
                let newObj: any;
                if (items?.PortfolioTypeCheck === obj.PortfolioTypeCheck && !actionsPerformed) {
                  if (items?.Id !== obj.Id && obj.Item_x0020_Type != "Task") {
                    obj.isRestructureActive = true;
                    obj.Restructuring = obj?.PortfolioTypeCheck == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png" : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                  } else {
                    newObj = { Title: obj?.Title, TaskType: { Id: obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id }, Id: obj.Id, Item_x0020_Type: obj.Item_x0020_Type, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle };
                    newChildarray?.push(newObj);
                    newarrays?.push(obj);
                    setRestructuredItemarray(newarrays);
                    setCheckSubChilds(obj);
                    setRestructureChecked(newChildarray);
                    ArrayTest?.push(newObj);
                    actionsPerformed = true;
                    obj.isRestructureActive = false;
                  }

                  if (obj?.subRows != undefined && obj?.subRows?.length > 0 && !actionsPerformed) {
                    obj?.subRows?.map((sub: any) => {
                      if (items?.Id !== sub.Id && sub.Item_x0020_Type != "Task" && sub.Item_x0020_Type != 'Feature') {
                        sub.isRestructureActive = true;
                        sub.Restructuring = sub?.PortfolioTypeCheck == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png" : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                      } else {
                        if (items?.Id === sub.Id) {
                          newObj = {
                            Title: obj?.Title, TaskType: { Id: obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id }, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle,
                            newSubChild: { Title: sub?.Title, TaskType: { Id: sub.TaskType?.Id == undefined ? '' : sub.TaskType?.Id }, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIconTitle === undefined ? sub.SiteIcon : sub.SiteIconTitle, }
                          };
                          newarrays?.push(obj);
                          setRestructuredItemarray(newarrays);
                          setCheckSubChilds(sub);
                          newChildarray?.push(newObj.newSubChild)
                          setRestructureChecked(newChildarray);
                          ArrayTest?.push(newObj);
                          actionsPerformed = true;
                          sub.isRestructureActive = false;
                        }
                      }
                    })
                  }
                }
              })
            })
          }
        }

      } else if (restructureItem?.[0].Item_x0020_Type === "Feature") {
        if (array != undefined && array?.length > 0) {
          topCompo = true;
          let newChildarray: any = [];
          let newarrays: any = [];
          array?.map((obj: any) => {
            let actionsPerformed = false;
            restructureItem?.map((items: any) => {
              let newObj: any;
              if (items?.PortfolioTypeCheck === obj.PortfolioTypeCheck && !actionsPerformed) {
                if (items?.Id !== obj.Id && obj.Item_x0020_Type != "Task") {
                  obj.isRestructureActive = true;
                  obj.Restructuring = obj?.PortfolioTypeCheck == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png" : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                } else {
                  newObj = { Title: obj?.Title, TaskType: { Id: obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id }, Id: obj.Id, Item_x0020_Type: obj.Item_x0020_Type, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle };
                  newChildarray?.push(newObj);
                  newarrays?.push(obj);
                  setRestructuredItemarray(newarrays);
                  setCheckSubChilds(obj);
                  setRestructureChecked(newChildarray);
                  ArrayTest?.push(newObj);
                  actionsPerformed = true;
                  obj.isRestructureActive = false;
                }

                if (obj?.subRows != undefined && obj?.subRows?.length > 0 && !actionsPerformed) {
                  obj?.subRows?.map((sub: any) => {
                    if (items?.Id !== sub.Id && sub.Item_x0020_Type != "Task" && sub.Item_x0020_Type != 'Feature') {
                      sub.isRestructureActive = true;
                      sub.Restructuring = sub?.PortfolioTypeCheck == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png" : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                    } else {
                      if (items?.Id === sub.Id) {
                        newObj = {
                          Title: obj?.Title, TaskType: { Id: obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id }, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle,
                          newSubChild: { Title: sub?.Title, TaskType: { Id: sub.TaskType?.Id == undefined ? '' : sub.TaskType?.Id }, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIconTitle === undefined ? sub.SiteIcon : sub.SiteIconTitle, }
                        };
                        newarrays?.push(obj);
                        setRestructuredItemarray(newarrays);
                        setCheckSubChilds(sub);
                        newChildarray?.push(newObj.newSubChild)
                        setRestructureChecked(newChildarray);
                        ArrayTest?.push(newObj);
                        actionsPerformed = true;
                        sub.isRestructureActive = false;
                      }
                    }
                  })
                }
              }
            })
          })
        }
      } else if (restructureItem?.[0].Item_x0020_Type === "Task" && (restructureItem?.[0].TaskType?.Id === 2 || restructureItem?.[0].TaskType?.Id === 3 || restructureItem?.[0].TaskType?.Id === 1)) {

        if (array != undefined && array?.length > 0) {
          let newChildarray: any = [];
          let newarrays: any = [];
          array?.map((obj: any) => {
            let actionsPerformed = false;
            restructureItem?.map((items: any) => {
              let newObj: any;
              if (items?.PortfolioTypeCheck === obj.PortfolioTypeCheck && !actionsPerformed) {
                if (!actionsPerformed) {
                  if (items?.Id !== obj.Id && obj?.TaskType?.Id != 2) {
                    obj.isRestructureActive = true;
                    obj.Restructuring = obj?.PortfolioTypeCheck == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png" : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                    if ((obj.TaskType?.Id == 1 || obj.TaskType?.Id == 3) && obj?.siteType !== items?.siteType) {
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
                      newObj = { Title: obj?.Title, TaskType: { Id: obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id }, Id: obj.Id, Item_x0020_Type: obj.Item_x0020_Type, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle };
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
                      sub.Restructuring = sub?.PortfolioTypeCheck == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png" : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                      if ((sub.TaskType?.Id == 1 || sub.TaskType?.Id == 3) && sub?.siteType !== items?.siteType) {
                        sub.isRestructureActive = false;
                      }
                      if (items?.TaskType?.Id == 3 && sub?.TaskType?.Id == 3) {
                        sub.isRestructureActive = false;
                      }
                      if (items?.TaskType?.Id == 1 && sub?.TaskType?.Id == 3 && sub?.TaskType?.Id == 1) {
                        sub.isRestructureActive = false;
                      }
                    } else {
                      if (items?.Id === sub.Id) {
                        newObj = {
                          Title: obj?.Title, TaskType: { Id: obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id }, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle,
                          newSubChild: { Title: sub?.Title, TaskType: { Id: sub.TaskType?.Id == undefined ? '' : sub.TaskType?.Id }, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIconTitle === undefined ? sub.SiteIcon : sub.SiteIconTitle, }
                        };
                        newarrays?.push(obj);
                        setRestructuredItemarray(newarrays);
                        setCheckSubChilds(sub);
                        newChildarray?.push(newObj.newSubChild)
                        setRestructureChecked(newChildarray);
                        ArrayTest?.push(newObj);
                        actionsPerformed = true;
                        sub.isRestructureActive = false;
                      }

                    }

                    if (sub?.subRows != undefined && sub?.subRows?.length > 0 && !actionsPerformed) {
                      sub?.subRows?.map((feature: any) => {
                        if (items?.Id !== feature.Id && feature?.TaskType?.Id != 2) {
                          feature.isRestructureActive = true;
                          feature.Restructuring = feature?.PortfolioTypeCheck == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png" : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                          if ((feature.TaskType?.Id == 1 || feature.TaskType?.Id == 3) && feature?.siteType !== items?.siteType) {
                            feature.isRestructureActive = false;
                          }
                          if (items?.TaskType?.Id == 3 && feature?.TaskType?.Id == 3) {
                            feature.isRestructureActive = false;
                          }
                          if (items?.TaskType?.Id == 1 && feature?.TaskType?.Id == 3 && feature?.TaskType?.Id == 1) {
                            feature.isRestructureActive = false;
                          }
                        } else {
                          if (items?.Id === feature.Id) {
                            newObj = {
                              Title: obj?.Title, TaskType: { Id: obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id }, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle,
                              newSubChild: {
                                Title: sub?.Title, TaskType: { Id: sub.TaskType?.Id == undefined ? '' : sub.TaskType?.Id }, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIconTitle === undefined ? sub.SiteIcon : sub.SiteIconTitle,
                                newFeatChild: { Title: feature?.Title, TaskType: { Id: feature.TaskType?.Id == undefined ? '' : feature.TaskType?.Id }, Item_x0020_Type: feature.Item_x0020_Type, Id: feature.Id, siteIcon: feature.SiteIconTitle === undefined ? feature.SiteIcon : feature.SiteIconTitle, }
                              }
                            };
                            newarrays?.push(obj);
                            setRestructuredItemarray(newarrays);
                            setCheckSubChilds(feature);
                            newChildarray?.push(newObj.newSubChild.newFeatChild)
                            setRestructureChecked(newChildarray);
                            ArrayTest?.push(newObj);
                            actionsPerformed = true;
                            feature.isRestructureActive = false;
                          }
                        }

                        if (feature?.subRows != undefined && feature?.subRows?.length > 0 && !actionsPerformed && items?.TaskType?.Id != 1) {
                          feature?.subRows?.map((activity: any) => {
                            if (items?.Id !== activity.Id && activity?.TaskType?.Id != 2) {
                              activity.isRestructureActive = true;
                              activity.Restructuring = activity?.PortfolioTypeCheck == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png" : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                              if ((activity.TaskType?.Id == 1 || activity.TaskType?.Id == 3) && activity?.siteType !== items?.siteType) {
                                activity.isRestructureActive = false;
                              }
                              if (items?.TaskType?.Id == 3 && activity?.TaskType?.Id == 3) {
                                activity.isRestructureActive = false;
                              }

                            } else {
                              if (items?.Id === activity.Id) {
                                newObj = {
                                  Title: obj?.Title, TaskType: { Id: obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id }, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle,
                                  newSubChild: {
                                    Title: sub?.Title, TaskType: { Id: sub.TaskType?.Id == undefined ? '' : sub.TaskType?.Id }, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIconTitle === undefined ? sub.SiteIcon : sub.SiteIconTitle,
                                    newFeatChild: { Title: feature?.Title, TaskType: { Id: feature.TaskType?.Id == undefined ? '' : feature.TaskType?.Id }, Item_x0020_Type: feature.Item_x0020_Type, Id: feature.Id, siteIcon: feature.SiteIconTitle === undefined ? feature.SiteIcon : feature.SiteIconTitle, }
                                  }
                                };
                                newarrays?.push(obj);
                                setRestructuredItemarray(newarrays);
                                setCheckSubChilds(feature);
                                newChildarray?.push(newObj.newSubChild.newFeatChild)
                                setRestructureChecked(newChildarray);
                                ArrayTest?.push(newObj);
                                actionsPerformed = true;
                                activity.isRestructureActive = false;
                              }
                            }

                            if (activity?.subRows != undefined && activity?.subRows?.length > 0 && !actionsPerformed && items?.TaskType?.Id != 1) {
                              activity?.subRows?.map((wrkstrm: any) => {
                                if (items?.Id !== wrkstrm.Id && wrkstrm?.TaskType?.Id != 2) {
                                  wrkstrm.isRestructureActive = true;
                                  wrkstrm.Restructuring = wrkstrm?.PortfolioTypeCheck == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png" : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                                  if ((wrkstrm.TaskType?.Id == 1 || wrkstrm.TaskType?.Id == 3) && wrkstrm?.siteType !== items?.siteType) {
                                    wrkstrm.isRestructureActive = false;
                                  }
                                  if (items?.TaskType?.Id == 3 && wrkstrm?.TaskType?.Id == 3) {
                                    wrkstrm.isRestructureActive = false;
                                  }
                                } else {
                                  if (items?.Id === wrkstrm.Id) {
                                    newObj = {
                                      Title: obj?.Title, TaskType: { Id: obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id }, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle,
                                      newSubChild: {
                                        Title: sub?.Title, TaskType: { Id: sub.TaskType?.Id == undefined ? '' : sub.TaskType?.Id }, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIconTitle === undefined ? sub.SiteIcon : sub.SiteIconTitle,
                                        newFeatChild: { Title: feature?.Title, TaskType: { Id: feature.TaskType?.Id == undefined ? '' : feature.TaskType?.Id }, Item_x0020_Type: feature.Item_x0020_Type, Id: feature.Id, siteIcon: feature.SiteIconTitle === undefined ? feature.SiteIcon : feature.SiteIconTitle, }
                                      }
                                    };
                                    newarrays?.push(obj);
                                    setRestructuredItemarray(newarrays);
                                    setCheckSubChilds(feature);
                                    newChildarray?.push(newObj.newSubChild.newFeatChild)
                                    setRestructureChecked(newChildarray);
                                    ArrayTest?.push(newObj);
                                    actionsPerformed = true;
                                    wrkstrm.isRestructureActive = false;
                                  }
                                }
                                if (wrkstrm?.subRows != undefined && wrkstrm?.subRows?.length > 0 && !actionsPerformed && items?.TaskType?.Id !== 3 && items?.TaskType?.Id != 1) {
                                  wrkstrm?.subRows?.map((task: any) => {
                                    if (items?.Id !== task.Id && task?.TaskType?.Id != 2) {
                                      task.isRestructureActive = true;
                                      task.Restructuring = task?.PortfolioTypeCheck == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png" : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                                      if ((task.TaskType?.Id == 1 || task.TaskType?.Id == 3) && task?.siteType !== items?.siteType) {
                                        task.isRestructureActive = false;
                                      }
                                    } else {
                                      if (items?.Id == task.Id) {
                                        newObj = {
                                          Title: obj?.Title, TaskType: { Id: obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id }, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle,
                                          newSubChild: {
                                            Title: sub?.Title, TaskType: { Id: sub.TaskType?.Id == undefined ? '' : sub.TaskType?.Id }, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIconTitle === undefined ? sub.SiteIcon : sub.SiteIconTitle,
                                            newFeatChild: { Title: feature?.Title, TaskType: { Id: feature.TaskType?.Id == undefined ? '' : feature.TaskType?.Id }, Item_x0020_Type: feature.Item_x0020_Type, Id: feature.Id, siteIcon: feature.SiteIconTitle === undefined ? feature.SiteIcon : feature.SiteIconTitle, }
                                          }
                                        };
                                        newarrays?.push(obj);
                                        setRestructuredItemarray(newarrays);
                                        setCheckSubChilds(feature);
                                        newChildarray?.push(newObj.newSubChild.newFeatChild)
                                        setRestructureChecked(newChildarray);
                                        ArrayTest?.push(newObj);
                                        actionsPerformed = true;
                                        task.isRestructureActive = false;
                                      }
                                    }
                                  })
                                }


                              })
                            }

                          })
                        }
                      })
                    }

                  })
                }
              }

            })
          })
        }

      }
      setCheckItemLength(true);
      setOldArrayBackup(ArrayTest);
      restructureCallBack(array, topCompo);
    }
  }




  const buttonRestructuring = () => {
    let topCompo: any = false;
    let array = allData;
    if (allData?.length > 0 && allData != undefined && restructureItem?.length > 0 && restructureItem != undefined) {
      let ArrayTest: any = [];

      restructureItem?.map((items: any, length: any) => {
        if (items?.Item_x0020_Type === "Component") {
          let checkSubCondition: boolean = true;
          let checkFeatureCondition: boolean = true;
          if (items?.subRows?.length > 0 && items?.subRows != undefined) {
            items?.subRows?.map((newItems: any) => {
              if (newItems?.Item_x0020_Type === "SubComponent") {
                alert('You can not Restructure this item');
                checkSubCondition = false;
              } else if (newItems?.Item_x0020_Type === "Feature" && checkSubCondition) {
                checkSubCondition = false;
                checkFeatureCondition = false;
                array?.map((obj: any) => {
                  let newChildarray: any = [];
                  let newarrays: any = [];
                  let newObj: any;
                  if (items?.PortfolioTypeCheck === obj.PortfolioTypeCheck) {
                    if (items?.Id !== obj.Id && obj.Item_x0020_Type != "Task") {
                      obj.isRestructureActive = true;
                      obj.Restructuring = obj?.PortfolioTypeCheck == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png" : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                    } else {
                      newObj = { Title: obj?.Title, TaskType: { Id: obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id }, Id: obj.Id, Item_x0020_Type: obj.Item_x0020_Type, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle };
                      newChildarray?.push(newObj);
                      newarrays?.push(obj);
                      setRestructuredItemarray(newarrays);
                      setCheckSubChilds(obj);
                      setRestructureChecked(newChildarray);
                      ArrayTest?.push(newObj);
                      obj.isRestructureActive = false;
                    }

                    if(obj.Title == "Others"){
                      obj.isRestructureActive = false;
                    }

                  }
                })
              } else {
                if (checkSubCondition && checkFeatureCondition) {
                  checkFeatureCondition =  false;
                  array?.map((obj: any) => {
                    let newChildarray: any = [];
                    let newarrays: any = [];
                    let newObj: any;
                    if (items?.PortfolioTypeCheck === obj.PortfolioTypeCheck) {
                      if (items?.Id !== obj.Id && obj.Item_x0020_Type != "Task") {
                        obj.isRestructureActive = true;
                        obj.Restructuring = obj?.PortfolioTypeCheck == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png" : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                      } else {
                        newObj = { Title: obj?.Title, TaskType: { Id: obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id }, Id: obj.Id, Item_x0020_Type: obj.Item_x0020_Type, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle };
                        newChildarray?.push(newObj);
                        newarrays?.push(obj);
                        setRestructuredItemarray(newarrays);
                        setCheckSubChilds(obj);
                        setRestructureChecked(newChildarray);
                        ArrayTest?.push(newObj);
                        obj.isRestructureActive = false;
                      }

                      if(obj.Title == "Others"){
                        obj.isRestructureActive = false;
                      }

                      if (obj?.subRows?.length > 0 && obj?.subRows != undefined) {
                        obj.subRows?.map((sub: any) => {
                          if (sub.Item_x0020_Type != "Task" && sub.Item_x0020_Type != "Feature") {
                            sub.isRestructureActive = true;
                            sub.Restructuring = sub?.PortfolioTypeCheck == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png" : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                          }
                          if(sub.Title == "Others"){
                            sub.isRestructureActive = false;
                          }
                        })
                      }
                    }
                  })
                }
              }
            })
          } else {
            array?.map((obj: any) => {
              let newChildarray: any = [];
              let newarrays: any = [];
              let newObj: any;
              if (items?.PortfolioTypeCheck === obj.PortfolioTypeCheck) {
                if (items?.Id !== obj.Id && obj.Item_x0020_Type != "Task") {
                  obj.isRestructureActive = true;
                  obj.Restructuring = obj?.PortfolioTypeCheck == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png" : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                } else {

                  newObj = { Title: obj?.Title, TaskType: { Id: obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id }, Id: obj.Id, Item_x0020_Type: obj.Item_x0020_Type, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle };
                  ArrayTest?.push(newObj);
                  setCheckSubChilds(obj);
                  newarrays?.push(obj);
                  setRestructuredItemarray(newarrays);
                  newChildarray?.push(newObj)
                  setRestructureChecked(newChildarray);
                  obj.isRestructureActive = false;
                }

                if(obj.Title == "Others"){
                  obj.isRestructureActive = false;
                }

                if (obj?.subRows?.length > 0 && obj?.subRows != undefined) {
                  obj.subRows?.map((sub: any) => {
                    if (sub.Item_x0020_Type != "Task" && sub.Item_x0020_Type != "Feature") {
                      sub.isRestructureActive = true;
                      sub.Restructuring = sub?.PortfolioTypeCheck == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png" : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                    }
                    if(sub.Title == "Others"){
                      sub.isRestructureActive = false;
                    }
                  })
                }
              }
            })
          }
        } else if (items?.Item_x0020_Type === "SubComponent") {
          let checkFeatureCondition: boolean = true;
          topCompo = true;
          setQuery4TopIcon('Component')
          if(props?.queryItems?.Item_x0020_Type === 'Component'){
            topCompo = false;
          }


          if (items?.subRows?.length > 0 && items?.subRows != undefined) {
            items?.subRows?.map((newItems: any) => {
              if (newItems?.Item_x0020_Type === "Feature") {
                checkFeatureCondition = false;
                array?.map((obj: any) => {
                  let newChildarray: any = [];
                  let newarrays: any = [];
                  let newObj: any;
                  if (items?.PortfolioTypeCheck === obj.PortfolioTypeCheck) {
                    if (items?.Id !== obj.Id && obj.Item_x0020_Type != "Task" && obj.Item_x0020_Type != "SubComponent" && obj.Item_x0020_Type != "Feature") {
                      obj.isRestructureActive = true;
                      obj.Restructuring = obj?.PortfolioTypeCheck == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png" : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                    } else {
                      if (items?.Id == obj.Id && obj.Item_x0020_Type != "Task") {
                        newObj = {
                          Title: obj?.Title, TaskType: { Id: obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id }, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle,
                        };
                        newarrays?.push(obj);
                        setRestructuredItemarray(newarrays);
                        setCheckSubChilds(obj);
                        newChildarray?.push(newObj)
                        setRestructureChecked(newChildarray);
                        ArrayTest?.push(newObj);
                        obj.isRestructureActive = false;
                      }
                    }
                    if(obj.Title == "Others"){
                      obj.isRestructureActive = false;
                    }
                    if (obj?.subRows?.length > 0 && obj?.subRows != undefined) {
                      obj.subRows?.map((sub: any) => {
                        if (items?.Id == sub.Id && sub.Item_x0020_Type != "Task") {
                          newObj = {
                            Title: obj?.Title, TaskType: { Id: obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id }, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle,
                            newSubChild: { Title: sub?.Title, TaskType: { Id: sub.TaskType?.Id == undefined ? '' : sub.TaskType?.Id }, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIconTitle === undefined ? sub.SiteIcon : sub.SiteIconTitle, }
                          };
                          newarrays?.push(obj);
                          setRestructuredItemarray(newarrays);
                          setCheckSubChilds(sub);
                          newChildarray?.push(newObj.newSubChild)
                          setRestructureChecked(newChildarray);
                          ArrayTest?.push(newObj);
                          obj.isRestructureActive = false;
                        }
                        if(sub.Title == "Others"){
                          sub.isRestructureActive = false;
                        }
                      })
                    }
                  }
                })
              } else {
                if (checkFeatureCondition) {
                  array?.map((obj: any) => {
                    let newChildarray: any = [];
                    let newarrays: any = [];
                    let newObj: any;
                    if (items?.PortfolioTypeCheck === obj.PortfolioTypeCheck) {
                      if (items?.Id !== obj.Id && obj.Item_x0020_Type != "Task" && obj.Item_x0020_Type != "Feature") {
                        obj.isRestructureActive = true;
                        obj.Restructuring = obj?.PortfolioTypeCheck == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png" : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                      } else {
                        if (items?.Id == obj.Id) {
                          newObj = {
                            Title: obj?.Title, TaskType: { Id: obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id }, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle,
                          };
                          newarrays?.push(obj);
                          setRestructuredItemarray(newarrays);
                          setCheckSubChilds(obj);
                          newChildarray?.push(newObj);
                          setRestructureChecked(newChildarray);
                          ArrayTest?.push(newObj)
                          obj.isRestructureActive = false;
                        }
                      }
                      if(obj.Title == "Others"){
                        obj.isRestructureActive = false;
                      }
                      if (obj?.subRows?.length > 0 && obj?.subRows != undefined) {
                        obj.subRows?.map((sub: any) => {
                          if (items?.Id !== sub.Id && sub.Item_x0020_Type != "Task" && sub.Item_x0020_Type != "Feature") {
                            sub.isRestructureActive = true;
                            sub.Restructuring = sub?.PortfolioTypeCheck == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png" : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                          } else {
                            if (items?.Id == sub.Id) {
                              newObj = {
                                Title: obj?.Title, TaskType: { Id: obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id }, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle,
                                newSubChild: { Title: sub?.Title, TaskType: { Id: sub.TaskType?.Id == undefined ? '' : sub.TaskType?.Id }, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIconTitle === undefined ? sub.SiteIcon : sub.SiteIconTitle, }
                              };
                              newarrays?.push(obj);
                              setRestructuredItemarray(newarrays);
                              setCheckSubChilds(sub);
                              newChildarray?.push(newObj.newSubChild)
                              setRestructureChecked(newChildarray);
                              ArrayTest?.push(newObj)
                              obj.isRestructureActive = false;
                              sub.isRestructureActive = false;
                            }
                          }
                          if(sub.Title == "Others"){
                            sub.isRestructureActive = false;
                          }
                        })
                      }
                    }
                  })
                }
              }
            })
          } else {
            array?.map((obj: any) => {
              let newChildarray: any = [];
              let newarrays: any = [];
              let newObj: any;
              if (items?.PortfolioTypeCheck === obj.PortfolioTypeCheck) {
                if (items?.Id !== obj.Id && obj.Item_x0020_Type != "Task" && obj.Item_x0020_Type != "Feature") {
                  obj.isRestructureActive = true;
                  obj.Restructuring = obj?.PortfolioTypeCheck == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png" : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                } else {
                  if (items?.Id == obj.Id) {
                    newObj = {
                      Title: obj?.Title, TaskType: { Id: obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id }, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle,
                    };
                    newarrays?.push(obj);
                    setRestructuredItemarray(newarrays);
                    setCheckSubChilds(obj);
                    newChildarray?.push(newObj)
                    setRestructureChecked(newChildarray);
                    ArrayTest?.push(newObj)
                    obj.isRestructureActive = false;
                  }
                }
                if(obj.Title == "Others"){
                  obj.isRestructureActive = false;
                }
                if (obj?.subRows?.length > 0 && obj?.subRows != undefined) {
                  obj.subRows?.map((sub: any) => {
                    if (items?.Id !== sub.Id && sub.Item_x0020_Type != "Task" && sub.Item_x0020_Type != "Feature") {
                      sub.isRestructureActive = true;
                      sub.Restructuring = sub?.PortfolioTypeCheck == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png" : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                    } else {
                      if (items?.Id == sub.Id) {
                        newObj = {
                          Title: obj?.Title, TaskType: { Id: obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id }, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle,
                          newSubChild: { Title: sub?.Title, TaskType: { Id: sub.TaskType?.Id == undefined ? '' : sub.TaskType?.Id }, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIconTitle === undefined ? sub.SiteIcon : sub.SiteIconTitle, }
                        };
                        newarrays?.push(obj);
                        setRestructuredItemarray(newarrays);
                        setCheckSubChilds(sub);
                        newChildarray?.push(newObj.newSubChild)
                        setRestructureChecked(newChildarray);
                        ArrayTest?.push(newObj)
                        obj.isRestructureActive = false;
                        sub.isRestructureActive = false;
                      }
                    }
                    if(sub.Title == "Others"){
                      sub.isRestructureActive = false;
                    }
                  })
                }
              }
            })
          }
        } else if (items?.Item_x0020_Type === "Feature") {
          topCompo = true;
          setQuery4TopIcon('Component')
          if(props?.queryItems?.Item_x0020_Type === 'SubComponent'){
            topCompo = false;
          } 

          if(props?.queryItems?.Item_x0020_Type === 'Component'){
            setQuery4TopIcon('SubComponent')
          }  
          array?.map((obj: any) => {
            let newChildarray: any = [];
            let newarrays: any = [];
            let newObj: any;
            if (items?.PortfolioTypeCheck === obj.PortfolioTypeCheck) {
              if (obj.Item_x0020_Type != "Task" && obj.Item_x0020_Type != "Feature") {
                obj.isRestructureActive = true;
                obj.Restructuring = obj?.PortfolioTypeCheck == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png" : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
              }
              if(obj.Title == "Others"){
                obj.isRestructureActive = false;
              }
              if (items?.Id == obj.Id) {
                newObj = { Title: obj?.Title, Item_x0020_Type: obj.Item_x0020_Type, TaskType: { Id: obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id }, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle, };
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
                  if (sub.Item_x0020_Type != "Task" && sub.Item_x0020_Type != "Feature") {
                    sub.isRestructureActive = true;
                    sub.Restructuring = sub?.PortfolioTypeCheck == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png" : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                  }
                  if (items?.Id == sub.Id) {
                    newObj = {
                      Title: obj?.Title, TaskType: { Id: obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id }, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle,
                      newSubChild: { Title: sub?.Title, TaskType: { Id: sub.TaskType?.Id == undefined ? '' : sub.TaskType?.Id }, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIconTitle === undefined ? sub.SiteIcon : sub.SiteIconTitle }
                    };
                    newarrays?.push(obj);
                    setRestructuredItemarray(newarrays);
                    setCheckSubChilds(sub);
                    newChildarray?.push(newObj.newSubChild)
                    setRestructureChecked(newChildarray);
                    ArrayTest?.push(newObj)
                    obj.isRestructureActive = false;
                    sub.isRestructureActive = false;
                  }
                  if(sub.Title == "Others"){
                    sub.isRestructureActive = false;
                  }
                  if (sub?.subRows?.length > 0 && sub?.subRows != undefined) {
                    sub.subRows?.map((feature: any) => {
                      if (items?.Id == feature.Id) {
                        newObj = {
                          Title: obj?.Title, TaskType: { Id: obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id }, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle,
                          newSubChild: {
                            Title: sub?.Title, TaskType: { Id: sub.TaskType?.Id == undefined ? '' : sub.TaskType?.Id }, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIconTitle === undefined ? sub.SiteIcon : sub.SiteIconTitle,
                            newFeatChild: { Title: feature?.Title, TaskType: { Id: feature.TaskType?.Id == undefined ? '' : feature.TaskType?.Id }, Item_x0020_Type: feature.Item_x0020_Type, Id: feature.Id, siteIcon: feature.SiteIconTitle === undefined ? feature.SiteIcon : feature.SiteIconTitle, }
                          }
                        };
                        newarrays?.push(obj);
                        setRestructuredItemarray(newarrays);
                        setCheckSubChilds(feature);
                        newChildarray?.push(newObj.newSubChild.newFeatChild)
                        setRestructureChecked(newChildarray);
                        ArrayTest?.push(newObj)
                        sub.isRestructureActive = false;
                      }
                    })
                  }
                })
              }
            }
          })
        } else if (items?.Item_x0020_Type === "Task" && (items.TaskType?.Id === 1)) {
          let newChildarray: any = [];
          let newarrays: any = [];
          array?.map((obj: any) => {
            let newObj: any;
            if (items?.PortfolioTypeCheck === obj.PortfolioTypeCheck) {
              if (obj.TaskType?.Id !== 2) {
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
                  })
                }

                if (checkchild == 3) {
                  if (obj.Item_x0020_Type !== "Task") {
                    obj.isRestructureActive = true;
                    obj.Restructuring = obj?.PortfolioTypeCheck == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png" : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                  }
                } else if (checkchild == 2) {
                  if (obj.TaskType?.Id !== 3) {
                    obj.isRestructureActive = true;
                    obj.Restructuring = obj?.PortfolioTypeCheck == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png" : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                  }
                } else {
                  obj.isRestructureActive = true;
                  obj.Restructuring = obj?.PortfolioTypeCheck == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png" : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                }

                if(obj.Title == "Others"){
                  obj.isRestructureActive = false;
                }

              }
              if (items?.Id == obj.Id) {
                newObj = { Title: obj?.Title, TaskType: { Id: obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id }, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle, };
                newChildarray?.push(newObj);
                newarrays?.push(obj);
                setRestructuredItemarray(newarrays);
                setCheckSubChilds(obj);
                setRestructureChecked(newChildarray);
                ArrayTest?.push(newObj)
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
                      })
                    }

                    if (checkchild == 3) {
                      if (sub.Item_x0020_Type !== "Task") {
                        sub.isRestructureActive = true;
                        sub.Restructuring = sub?.PortfolioTypeCheck == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png" : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                      }
                    } else if (checkchild == 2) {
                      if (sub.TaskType?.Id !== 3) {
                        sub.isRestructureActive = true;
                        sub.Restructuring = sub?.PortfolioTypeCheck == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png" : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                      }
                    } else {
                      sub.isRestructureActive = true;
                      sub.Restructuring = sub?.PortfolioTypeCheck == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png" : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                    }
                  }
                  if (items?.Id == obj.Id) {
                    sub.isRestructureActive = false;
                  }
                  if(sub.Title == "Others"){
                    sub.isRestructureActive = false;
                  }
                  if (items?.Id == sub.Id) {
                    newObj = {
                      Title: obj?.Title, TaskType: { Id: obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id }, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle,
                      newSubChild: { Title: sub?.Title, TaskType: { Id: sub.TaskType?.Id == undefined ? '' : sub.TaskType?.Id }, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIconTitle === undefined ? sub.SiteIcon : sub.SiteIconTitle }
                    };
                    newarrays?.push(obj);
                    setRestructuredItemarray(newarrays);
                    setCheckSubChilds(sub);
                    newChildarray?.push(newObj.newSubChild)
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
                          })
                        }

                        if (checkchild == 3) {
                          if (feature.Item_x0020_Type !== "Task") {
                            feature.isRestructureActive = true;
                            feature.Restructuring = feature?.PortfolioTypeCheck == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png" : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                          }
                        } else if (checkchild == 2) {
                          if (feature.TaskType?.Id !== 3) {
                            feature.isRestructureActive = true;
                            feature.Restructuring = feature?.PortfolioTypeCheck == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png" : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                          }
                        } else {
                          feature.isRestructureActive = true;
                          feature.Restructuring = feature?.PortfolioTypeCheck == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png" : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                        }

                      }
                      if (items?.Id == sub.Id) {
                        feature.isRestructureActive = false;
                      }
                      if(feature.Title == "Others"){
                        feature.isRestructureActive = false;
                      }
                      if (items?.Id == feature.Id) {
                        newObj = {
                          Title: obj?.Title, TaskType: { Id: obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id }, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle,
                          newSubChild: {
                            Title: sub?.Title, TaskType: { Id: sub.TaskType?.Id == undefined ? '' : sub.TaskType?.Id }, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIconTitle === undefined ? sub.SiteIcon : sub.SiteIconTitle,
                            newFeatChild: { Title: feature?.Title, TaskType: { Id: feature.TaskType?.Id == undefined ? '' : feature.TaskType?.Id }, Item_x0020_Type: feature.Item_x0020_Type, Id: feature.Id, siteIcon: feature.SiteIconTitle === undefined ? feature.SiteIcon : feature.SiteIconTitle, }
                          }
                        };
                        newarrays?.push(obj);
                        setRestructuredItemarray(newarrays);
                        setCheckSubChilds(feature);
                        newChildarray?.push(newObj.newSubChild.newFeatChild)
                        setRestructureChecked(newChildarray);
                        ArrayTest?.push(newObj)
                        feature.isRestructureActive = false;
                        sub.isRestructureActive = false;
                      }
                      if ((feature.TaskType?.Id == 1 || feature.TaskType?.Id == 3) && feature?.siteType !== items?.siteType) {
                        feature.isRestructureActive = false;
                      }
                      if (feature?.subRows?.length > 0 && feature?.subRows != undefined) {
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
                              })
                            }

                            if (checkchild == 3) {
                              if (activity.Item_x0020_Type !== "Task") {
                                activity.isRestructureActive = true;
                                activity.Restructuring = activity?.PortfolioTypeCheck == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png" : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                              }
                            } else if (checkchild == 2) {
                              if (activity.TaskType?.Id !== 3) {
                                activity.isRestructureActive = true;
                                activity.Restructuring = activity?.PortfolioTypeCheck == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png" : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                              }
                            } else {
                              activity.isRestructureActive = true;
                              activity.Restructuring = activity?.PortfolioTypeCheck == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png" : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                            }

                          }
                          if (items?.Id == feature.Id) {
                            activity.isRestructureActive = false;
                          }
                          if(activity.Title == "Others"){
                            activity.isRestructureActive = false;
                          }
                          if (items?.Id == activity.Id) {
                            newObj = {
                              Title: obj?.Title, TaskType: { Id: obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id }, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle,
                              newSubChild: {
                                Title: sub?.Title, TaskType: { Id: sub.TaskType?.Id == undefined ? '' : sub.TaskType?.Id }, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIconTitle === undefined ? sub.SiteIcon : sub.SiteIconTitle,
                                newFeatChild: {
                                  Title: feature?.Title, TaskType: { Id: feature.TaskType?.Id == undefined ? '' : feature.TaskType?.Id }, Item_x0020_Type: feature.Item_x0020_Type, Id: feature.Id, siteIcon: feature.SiteIconTitle === undefined ? feature.SiteIcon : feature.SiteIconTitle,
                                  newActChild: { Title: activity?.Title, TaskType: { Id: activity.TaskType?.Id == undefined ? '' : activity.TaskType?.Id }, Item_x0020_Type: activity.Item_x0020_Type, Id: activity.Id, siteIcon: activity.SiteIconTitle === undefined ? activity.SiteIcon : activity.SiteIconTitle, }
                                }
                              }
                            };
                            newarrays?.push(obj);
                            setRestructuredItemarray(newarrays);
                            setCheckSubChilds(activity);
                            newChildarray?.push(newObj.newSubChild.newFeatChild.newActChild);
                            setRestructureChecked(newChildarray);
                            ArrayTest?.push(newObj);
                            activity.isRestructureActive = false;
                            feature.isRestructureActive = false;
                          }
                          if ((activity.TaskType?.Id == 1 || activity.TaskType?.Id == 3) && activity?.siteType !== items?.siteType) {
                            activity.isRestructureActive = false;
                          }

                          if (activity?.subRows?.length > 0 && activity?.subRows != undefined) {
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

                                    if (items.TaskType?.Id === 2 && !checkTrue) {
                                      checkchild = 2;
                                    }
                                  })
                                }

                                if (checkchild == 3) {
                                  if (wrkstrm.Item_x0020_Type !== "Task") {
                                    wrkstrm.isRestructureActive = true;
                                    wrkstrm.Restructuring = wrkstrm?.PortfolioTypeCheck == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png" : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                                  }
                                } else if (checkchild == 2) {
                                  if (wrkstrm.TaskType?.Id !== 3) {
                                    wrkstrm.isRestructureActive = true;
                                    wrkstrm.Restructuring = wrkstrm?.PortfolioTypeCheck == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png" : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                                  }
                                } else {
                                  wrkstrm.isRestructureActive = true;
                                  wrkstrm.Restructuring = wrkstrm?.PortfolioTypeCheck == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png" : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                                }

                              }
                              if (items?.Id == activity.Id) {
                                wrkstrm.isRestructureActive = false;
                              }
                              if(wrkstrm.Title == "Others"){
                                wrkstrm.isRestructureActive = false;
                              }
                              if (items?.Id == wrkstrm.Id) {
                                newObj = {
                                  Title: obj?.Title, TaskType: { Id: obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id }, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle,
                                  newSubChild: {
                                    Title: sub?.Title, TaskType: { Id: sub.TaskType?.Id == undefined ? '' : sub.TaskType?.Id }, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIconTitle === undefined ? sub.SiteIcon : sub.SiteIconTitle,
                                    newFeatChild: {
                                      Title: feature?.Title, TaskType: { Id: feature.TaskType?.Id == undefined ? '' : feature.TaskType?.Id }, Item_x0020_Type: feature.Item_x0020_Type, Id: feature.Id, siteIcon: feature.SiteIconTitle === undefined ? feature.SiteIcon : feature.SiteIconTitle,
                                      newActChild: {
                                        Title: activity?.Title, TaskType: { Id: activity.TaskType?.Id == undefined ? '' : activity.TaskType?.Id }, Item_x0020_Type: activity.Item_x0020_Type, Id: activity.Id, siteIcon: activity.SiteIconTitle === undefined ? activity.SiteIcon : activity.SiteIconTitle,
                                        newWrkChild: { Title: wrkstrm?.Title, TaskType: { Id: wrkstrm.TaskType?.Id == undefined ? '' : wrkstrm.TaskType?.Id }, Item_x0020_Type: wrkstrm.Item_x0020_Type, Id: wrkstrm.Id, siteIcon: wrkstrm.SiteIconTitle === undefined ? wrkstrm.SiteIcon : wrkstrm.SiteIconTitle, }
                                      }
                                    }
                                  }
                                };
                                newarrays?.push(obj);
                                setRestructuredItemarray(newarrays);
                                setCheckSubChilds(wrkstrm);
                                newChildarray?.push(newObj.newSubChild.newFeatChild.newActChild.newWrkChild);
                                setRestructureChecked(newChildarray);
                                ArrayTest?.push(newObj);
                                activity.isRestructureActive = false;
                                wrkstrm.isRestructureActive = false;
                              }
                              if ((wrkstrm.TaskType?.Id == 1 || wrkstrm.TaskType?.Id == 3) && wrkstrm?.siteType !== items?.siteType) {
                                wrkstrm.isRestructureActive = false;
                              }
                            }
                            )
                          }

                        })
                      }

                    })
                  }
                })
              }
            }
          })
        } else if (items?.Item_x0020_Type === "Task" && (items.TaskType?.Id === 3)) {
          if(props?.queryItems?.Item_x0020_Type !== 'Task' && props?.queryItems != undefined && props?.queryItems != null){
            topCompo = true;
            setQuery4TopIcon('Activity')
          } 
            let newChildarray: any = [];
          let newarrays: any = [];
          array?.map((obj: any) => {
            let newObj: any;
            if (items?.PortfolioTypeCheck === obj.PortfolioTypeCheck) {
              if (obj.TaskType?.Id !== 2) {
                if (items.subRows != undefined && items.subRows?.length > 0) {
                  if (obj.TaskType?.Id !== 3) {
                    obj.isRestructureActive = true;
                    obj.Restructuring = obj?.PortfolioTypeCheck == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png" : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                  }
                  if(obj.Title == "Others"){
                    obj.isRestructureActive = false;
                  }
                } else {
                  obj.isRestructureActive = true;
                  obj.Restructuring = obj?.PortfolioTypeCheck == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png" : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                  
                  if(obj.Title == "Others"){
                    obj.isRestructureActive = false;
                  }
                
                }

              }
              if (items?.Id == obj.Id) {
                newObj = { Title: obj?.Title, TaskType: { Id: obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id }, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle, };
                newChildarray?.push(newObj);
                newarrays?.push(obj);
                setRestructuredItemarray(newarrays);
                setCheckSubChilds(obj);
                setRestructureChecked(newChildarray);
                ArrayTest?.push(newObj)
                obj.isRestructureActive = false;
              }
              if ((obj.TaskType?.Id == 1 || obj.TaskType?.Id == 3) && obj?.siteType !== items?.siteType) {
                obj.isRestructureActive = false;
              }
              if (obj?.subRows?.length > 0 && obj?.subRows != undefined) {
                obj.subRows?.map((sub: any) => {
                  if (sub.TaskType?.Id !== 2) {
                    if (items.subRows != undefined && items.subRows?.length > 0) {
                      if (sub.TaskType?.Id !== 3) {
                        sub.isRestructureActive = true;
                        sub.Restructuring = sub?.PortfolioTypeCheck == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png" : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                      }
                    } else {
                      sub.isRestructureActive = true;
                      sub.Restructuring = sub?.PortfolioTypeCheck == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png" : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                    }
                  }
                  if (items?.Id == obj.Id) {
                    sub.isRestructureActive = false;
                  }

                  if(sub.Title == "Others"){
                    sub.isRestructureActive = false;
                  }

                  if (items?.Id == sub.Id) {
                    newObj = {
                      Title: obj?.Title, TaskType: { Id: obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id }, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle,
                      newSubChild: { Title: sub?.Title, TaskType: { Id: sub.TaskType?.Id == undefined ? '' : sub.TaskType?.Id }, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIconTitle === undefined ? sub.SiteIcon : sub.SiteIconTitle }
                    };
                    newarrays?.push(obj);
                    setRestructuredItemarray(newarrays);
                    setCheckSubChilds(sub);
                    newChildarray?.push(newObj.newSubChild)
                    setRestructureChecked(newChildarray);
                    ArrayTest?.push(newObj);
                    if (items.subRows?.length > 0) {
                      obj.isRestructureActive = false;
                    }
                    sub.isRestructureActive = false;
                  }
                  if ((sub.TaskType?.Id == 1 || sub.TaskType?.Id == 3) && sub?.siteType !== items?.siteType) {
                    sub.isRestructureActive = false;
                  }

                  if (sub?.subRows?.length > 0 && sub?.subRows != undefined) {
                    sub.subRows?.map((feature: any) => {
                      if (feature.TaskType?.Id !== 2) {
                        if (items.subRows != undefined && items.subRows?.length > 0) {
                          if (feature.TaskType?.Id !== 3) {
                            feature.isRestructureActive = true;
                            feature.Restructuring = feature?.PortfolioTypeCheck == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png" : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                          }
                        } else {
                          feature.isRestructureActive = true;
                          feature.Restructuring = feature?.PortfolioTypeCheck == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png" : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                        }

                      }
                      if(feature.Title == "Others"){
                        feature.isRestructureActive = false;
                      }

                      if (items?.Id == sub.Id) {
                        feature.isRestructureActive = false;
                      }
                      if (items?.Id == feature.Id) {
                        newObj = {
                          Title: obj?.Title, TaskType: { Id: obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id }, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle,
                          newSubChild: {
                            Title: sub?.Title, TaskType: { Id: sub.TaskType?.Id == undefined ? '' : sub.TaskType?.Id }, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIconTitle === undefined ? sub.SiteIcon : sub.SiteIconTitle,
                            newFeatChild: { Title: feature?.Title, TaskType: { Id: feature.TaskType?.Id == undefined ? '' : feature.TaskType?.Id }, Item_x0020_Type: feature.Item_x0020_Type, Id: feature.Id, siteIcon: feature.SiteIconTitle === undefined ? feature.SiteIcon : feature.SiteIconTitle, }
                          }
                        };
                        newarrays?.push(obj);
                        setRestructuredItemarray(newarrays);
                        setCheckSubChilds(feature);
                        newChildarray?.push(newObj.newSubChild.newFeatChild)
                        setRestructureChecked(newChildarray);
                        ArrayTest?.push(newObj);
                        if (items.subRows?.length > 0) {
                          sub.isRestructureActive = false;

                        }
                        feature.isRestructureActive = false;
                      }
                      if ((feature.TaskType?.Id == 1 || feature.TaskType?.Id == 3) && feature?.siteType !== items?.siteType) {
                        feature.isRestructureActive = false;
                      }
                      if (feature?.subRows?.length > 0 && feature?.subRows != undefined) {
                        feature.subRows?.map((activity: any) => {
                          if (activity.TaskType?.Id !== 2) {
                            if (items.subRows != undefined && items.subRows?.length > 0) {
                              if (activity.TaskType?.Id !== 3) {
                                activity.isRestructureActive = true;
                                activity.Restructuring = activity?.PortfolioTypeCheck == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png" : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                              }
                            } else {
                              activity.isRestructureActive = true;
                              activity.Restructuring = activity?.PortfolioTypeCheck == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png" : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                            }


                          }
                          if(activity.Title == "Others"){
                            activity.isRestructureActive = false;
                          }
                          if (items?.Id == feature.Id) {
                            activity.isRestructureActive = false;
                          }
                          if (items?.Id == activity.Id) {
                            newObj = {
                              Title: obj?.Title, TaskType: { Id: obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id }, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle,
                              newSubChild: {
                                Title: sub?.Title, TaskType: { Id: sub.TaskType?.Id == undefined ? '' : sub.TaskType?.Id }, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIconTitle === undefined ? sub.SiteIcon : sub.SiteIconTitle,
                                newFeatChild: {
                                  Title: feature?.Title, TaskType: { Id: feature.TaskType?.Id == undefined ? '' : feature.TaskType?.Id }, Item_x0020_Type: feature.Item_x0020_Type, Id: feature.Id, siteIcon: feature.SiteIconTitle === undefined ? feature.SiteIcon : feature.SiteIconTitle,
                                  newActChild: { Title: activity?.Title, TaskType: { Id: activity.TaskType?.Id == undefined ? '' : activity.TaskType?.Id }, Item_x0020_Type: activity.Item_x0020_Type, Id: activity.Id, siteIcon: activity.SiteIconTitle === undefined ? activity.SiteIcon : activity.SiteIconTitle, }
                                }
                              }
                            };
                            newarrays?.push(obj);
                            setRestructuredItemarray(newarrays);
                            setCheckSubChilds(activity);
                            newChildarray?.push(newObj.newSubChild.newFeatChild.newActChild);
                            setRestructureChecked(newChildarray);
                            ArrayTest?.push(newObj);
                            if (items.subRows?.length > 0) {
                              feature.isRestructureActive = false;
                            }
                            activity.isRestructureActive = false;

                          }
                          if ((activity.TaskType?.Id == 1 || activity.TaskType?.Id == 3) && activity?.siteType !== items?.siteType) {
                            activity.isRestructureActive = false;
                          }

                          if (activity?.subRows?.length > 0 && activity?.subRows != undefined) {
                            activity.subRows?.map((wrkstrm: any) => {
                              if (wrkstrm.TaskType?.Id !== 2) {
                                if (items.subRows != undefined && items.subRows?.length > 0) {
                                  if (wrkstrm.TaskType?.Id !== 3) {
                                    wrkstrm.isRestructureActive = true;
                                    wrkstrm.Restructuring = wrkstrm?.PortfolioTypeCheck == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png" : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                                  }
                                } else {
                                  wrkstrm.isRestructureActive = true;
                                  wrkstrm.Restructuring = wrkstrm?.PortfolioTypeCheck == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png" : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                                }

                              }
                              if(wrkstrm.Title == "Others"){
                                wrkstrm.isRestructureActive = false;
                              }

                              if (items?.Id == activity.Id) {
                                wrkstrm.isRestructureActive = false;
                              }
                              if (items?.Id == wrkstrm.Id) {
                                newObj = {
                                  Title: obj?.Title, TaskType: { Id: obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id }, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle,
                                  newSubChild: {
                                    Title: sub?.Title, TaskType: { Id: sub.TaskType?.Id == undefined ? '' : sub.TaskType?.Id }, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIconTitle === undefined ? sub.SiteIcon : sub.SiteIconTitle,
                                    newFeatChild: {
                                      Title: feature?.Title, TaskType: { Id: feature.TaskType?.Id == undefined ? '' : feature.TaskType?.Id }, Item_x0020_Type: feature.Item_x0020_Type, Id: feature.Id, siteIcon: feature.SiteIconTitle === undefined ? feature.SiteIcon : feature.SiteIconTitle,
                                      newActChild: {
                                        Title: activity?.Title, TaskType: { Id: activity.TaskType?.Id == undefined ? '' : activity.TaskType?.Id }, Item_x0020_Type: activity.Item_x0020_Type, Id: activity.Id, siteIcon: activity.SiteIconTitle === undefined ? activity.SiteIcon : activity.SiteIconTitle,
                                        newWrkChild: { Title: wrkstrm?.Title, TaskType: { Id: wrkstrm.TaskType?.Id == undefined ? '' : wrkstrm.TaskType?.Id }, Item_x0020_Type: wrkstrm.Item_x0020_Type, Id: wrkstrm.Id, siteIcon: wrkstrm.SiteIconTitle === undefined ? wrkstrm.SiteIcon : wrkstrm.SiteIconTitle, }
                                      }
                                    }
                                  }
                                };
                                newarrays?.push(obj);
                                setRestructuredItemarray(newarrays);
                                setCheckSubChilds(wrkstrm);
                                newChildarray?.push(newObj.newSubChild.newFeatChild.newActChild.newWrkChild);
                                setRestructureChecked(newChildarray);
                                ArrayTest?.push(newObj);
                                if (items.subRows?.length > 0) {
                                  activity.isRestructureActive = false;
                                }

                                wrkstrm.isRestructureActive = false;
                              }
                              if ((wrkstrm.TaskType?.Id == 1 || wrkstrm.TaskType?.Id == 3) && wrkstrm?.siteType !== items?.siteType) {
                                wrkstrm.isRestructureActive = false;
                              }
                            }
                            )
                          }

                        })
                      }

                    })
                  }
                })
              }
            }
          })
        } else if (items?.Item_x0020_Type === "Task" && items.TaskType?.Id === 2) {
          if(props?.queryItems?.Item_x0020_Type !== 'Task' && props?.queryItems != undefined && props?.queryItems != null){
            topCompo = true;
            setQuery4TopIcon('Activity')
          } 
          if(props?.queryItems?.TaskType === "Activities"){
            topCompo = true;
            setQuery4TopIcon('Workstream')
          } 
          let newChildarray: any = [];
          let newarrays: any = [];
          array?.map((obj: any) => {
            let newObj: any;
            if (items?.PortfolioTypeCheck === obj.PortfolioTypeCheck) {
              if (obj.TaskType?.Id !== 2) {
                obj.isRestructureActive = true;
                obj.Restructuring = obj?.PortfolioTypeCheck == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png" : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
              }
              if(obj.Title == "Others"){
                obj.isRestructureActive = false;
              }
              if (items?.Id == obj.Id) {
                newObj = { Title: obj?.Title, TaskType: { Id: obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id }, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle, };
                newChildarray?.push(newObj);
                newarrays?.push(obj);
                setRestructuredItemarray(newarrays);
                setCheckSubChilds(obj);
                setRestructureChecked(newChildarray);
                ArrayTest?.push(newObj)
                obj.isRestructureActive = false;
              }
              if ((obj.TaskType?.Id == 1 || obj.TaskType?.Id == 3) && obj?.siteType !== items?.siteType) {
                obj.isRestructureActive = false;
              }
              if (obj?.subRows?.length > 0 && obj?.subRows != undefined) {
                obj.subRows?.map((sub: any) => {
                  if (sub.TaskType?.Id !== 2) {
                    sub.isRestructureActive = true;
                    sub.Restructuring = sub?.PortfolioTypeCheck == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png" : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                  }
                  if(sub.Title == "Others"){
                    sub.isRestructureActive = false;
                  }
                  if (items?.Id == sub.Id) {
                    newObj = {
                      Title: obj?.Title, TaskType: { Id: obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id }, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle,
                      newSubChild: { Title: sub?.Title, TaskType: { Id: sub.TaskType?.Id == undefined ? '' : sub.TaskType?.Id }, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIconTitle === undefined ? sub.SiteIcon : sub.SiteIconTitle }
                    };
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
                  if ((sub.TaskType?.Id == 1 || sub.TaskType?.Id == 3) && sub?.siteType !== items?.siteType) {
                    sub.isRestructureActive = false;
                  }

                  if (sub?.subRows?.length > 0 && sub?.subRows != undefined) {
                    sub.subRows?.map((feature: any) => {
                      if (feature.TaskType?.Id !== 2) {
                        feature.isRestructureActive = true;
                        feature.Restructuring = feature?.PortfolioTypeCheck == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png" : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                      }
                      if(feature.Title == "Others"){
                        feature.isRestructureActive = false;
                      }
                      if (items?.Id == feature.Id) {
                        newObj = {
                          Title: obj?.Title, TaskType: { Id: obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id }, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle,
                          newSubChild: {
                            Title: sub?.Title, TaskType: { Id: sub.TaskType?.Id == undefined ? '' : sub.TaskType?.Id }, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIconTitle === undefined ? sub.SiteIcon : sub.SiteIconTitle,
                            newFeatChild: { Title: feature?.Title, TaskType: { Id: feature.TaskType?.Id == undefined ? '' : feature.TaskType?.Id }, Item_x0020_Type: feature.Item_x0020_Type, Id: feature.Id, siteIcon: feature.SiteIconTitle === undefined ? feature.SiteIcon : feature.SiteIconTitle, }
                          }
                        };
                        setCheckSubChilds(feature);
                        newarrays?.push(obj);
                        setRestructuredItemarray(newarrays);
                        newChildarray?.push(newObj.newSubChild.newFeatChild)
                        setRestructureChecked(newChildarray);
                        ArrayTest?.push(newObj);
                        feature.isRestructureActive = false;
                        if (sub.TaskType?.Id === 3) {
                          sub.isRestructureActive = false;
                        }
                      }
                      if ((feature.TaskType?.Id == 1 || feature.TaskType?.Id == 3) && feature?.siteType !== items?.siteType) {
                        feature.isRestructureActive = false;
                      }
                      if (feature?.subRows?.length > 0 && feature?.subRows != undefined) {
                        feature.subRows?.map((activity: any) => {
                          if (activity.TaskType?.Id !== 2) {
                            activity.isRestructureActive = true;
                            activity.Restructuring = activity?.PortfolioTypeCheck == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png" : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                          }
                          if(activity.Title == "Others"){
                            activity.isRestructureActive = false;
                          }
                          if (items?.Id == activity.Id) {
                            newObj = {
                              Title: obj?.Title, TaskType: { Id: obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id }, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle,
                              newSubChild: {
                                Title: sub?.Title, TaskType: { Id: sub.TaskType?.Id == undefined ? '' : sub.TaskType?.Id }, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIconTitle === undefined ? sub.SiteIcon : sub.SiteIconTitle,
                                newFeatChild: {
                                  Title: feature?.Title, TaskType: { Id: feature.TaskType?.Id == undefined ? '' : feature.TaskType?.Id }, Item_x0020_Type: feature.Item_x0020_Type, Id: feature.Id, siteIcon: feature.SiteIconTitle === undefined ? feature.SiteIcon : feature.SiteIconTitle,
                                  newActChild: { Title: activity?.Title, TaskType: { Id: activity.TaskType?.Id == undefined ? '' : activity.TaskType?.Id }, Item_x0020_Type: activity.Item_x0020_Type, Id: activity.Id, siteIcon: activity.SiteIconTitle === undefined ? activity.SiteIcon : activity.SiteIconTitle, }
                                }
                              }
                            };
                            newarrays?.push(obj);
                            setRestructuredItemarray(newarrays);
                            setCheckSubChilds(activity);
                            newChildarray?.push(newObj.newSubChild.newFeatChild.newActChild);
                            setRestructureChecked(newChildarray);
                            ArrayTest?.push(newObj);
                            activity.isRestructureActive = false;
                            if (feature.TaskType?.Id === 3) {
                              feature.isRestructureActive = false;
                            }
                          }
                          if ((activity.TaskType?.Id == 1 || activity.TaskType?.Id == 3) && activity?.siteType !== items?.siteType) {
                            activity.isRestructureActive = false;
                          }

                          if (activity?.subRows?.length > 0 && activity?.subRows != undefined) {
                            activity.subRows?.map((wrkstrm: any) => {
                              if (wrkstrm.TaskType?.Id !== 2) {
                                wrkstrm.isRestructureActive = true;
                                wrkstrm.Restructuring = wrkstrm?.PortfolioTypeCheck == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png" : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                              }
                              if(wrkstrm.Title == "Others"){
                                wrkstrm.isRestructureActive = false;
                              }
                              if (items?.Id == wrkstrm.Id) {
                                newObj = {
                                  Title: obj?.Title, TaskType: { Id: obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id }, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle,
                                  newSubChild: {
                                    Title: sub?.Title, TaskType: { Id: sub.TaskType?.Id == undefined ? '' : sub.TaskType?.Id }, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIconTitle === undefined ? sub.SiteIcon : sub.SiteIconTitle,
                                    newFeatChild: {
                                      Title: feature?.Title, TaskType: { Id: feature.TaskType?.Id == undefined ? '' : feature.TaskType?.Id }, Item_x0020_Type: feature.Item_x0020_Type, Id: feature.Id, siteIcon: feature.SiteIconTitle === undefined ? feature.SiteIcon : feature.SiteIconTitle,
                                      newActChild: {
                                        Title: activity?.Title, TaskType: { Id: activity.TaskType?.Id == undefined ? '' : activity.TaskType?.Id }, Item_x0020_Type: activity.Item_x0020_Type, Id: activity.Id, siteIcon: activity.SiteIconTitle === undefined ? activity.SiteIcon : activity.SiteIconTitle,
                                        newWrkChild: { Title: wrkstrm?.Title, TaskType: { Id: wrkstrm.TaskType?.Id == undefined ? '' : wrkstrm.TaskType?.Id }, Item_x0020_Type: wrkstrm.Item_x0020_Type, Id: wrkstrm.Id, siteIcon: wrkstrm.SiteIconTitle === undefined ? wrkstrm.SiteIcon : wrkstrm.SiteIconTitle, }
                                      }
                                    }
                                  }
                                };
                                newarrays?.push(obj);
                                setRestructuredItemarray(newarrays);
                                setCheckSubChilds(wrkstrm);
                                newChildarray?.push(newObj.newSubChild.newFeatChild.newActChild.newWrkChild);
                                setRestructureChecked(newChildarray);
                                ArrayTest?.push(newObj);
                                wrkstrm.isRestructureActive = false;
                                if (wrkstrm.TaskType?.Id === 3) {
                                  wrkstrm.isRestructureActive = false;
                                }
                              }
                              if ((wrkstrm.TaskType?.Id == 1 || wrkstrm.TaskType?.Id == 3) && wrkstrm?.siteType !== items?.siteType) {
                                wrkstrm.isRestructureActive = false;
                              }
                              if (wrkstrm?.subRows?.length > 0 && wrkstrm?.subRows != undefined) {
                                wrkstrm.subRows?.map((task: any) => {
                                  if (task.TaskType?.Id !== 2) {
                                    task.isRestructureActive = true;
                                    task.Restructuring = task?.PortfolioTypeCheck == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png" : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                                  }
                                  if(task.Title == "Others"){
                                    task.isRestructureActive = false;
                                  }
                                  if (items?.Id == task.Id) {
                                    newObj = {
                                      Title: obj?.Title, TaskType: { Id: obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id }, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle,
                                      newSubChild: {
                                        Title: sub?.Title, TaskType: { Id: sub.TaskType?.Id == undefined ? '' : sub.TaskType?.Id }, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIconTitle === undefined ? sub.SiteIcon : sub.SiteIconTitle,
                                        newFeatChild: {
                                          Title: feature?.Title, TaskType: { Id: feature.TaskType?.Id == undefined ? '' : feature.TaskType?.Id }, Item_x0020_Type: feature.Item_x0020_Type, Id: feature.Id, siteIcon: feature.SiteIconTitle === undefined ? feature.SiteIcon : feature.SiteIconTitle,
                                          newActChild: {
                                            Title: activity?.Title, TaskType: { Id: activity.TaskType?.Id == undefined ? '' : activity.TaskType?.Id }, Item_x0020_Type: activity.Item_x0020_Type, Id: activity.Id, siteIcon: activity.SiteIconTitle === undefined ? activity.SiteIcon : activity.SiteIconTitle,
                                            newWrkChild: {
                                              Title: wrkstrm?.Title, TaskType: { Id: wrkstrm.TaskType?.Id == undefined ? '' : wrkstrm.TaskType?.Id }, Item_x0020_Type: wrkstrm.Item_x0020_Type, Id: wrkstrm.Id, siteIcon: wrkstrm.SiteIconTitle === undefined ? wrkstrm.SiteIcon : wrkstrm.SiteIconTitle,
                                              newTskChild: { Title: task?.Title, TaskType: { Id: task.TaskType?.Id == undefined ? '' : task.TaskType?.Id }, Item_x0020_Type: task.Item_x0020_Type, Id: task.Id, siteIcon: task.SiteIconTitle === undefined ? task.SiteIcon : task.SiteIconTitle }
                                            }
                                          }
                                        }
                                      }
                                    };
                                    newarrays?.push(obj);
                                    setRestructuredItemarray(newarrays);
                                    setCheckSubChilds(task);
                                    newChildarray?.push(newObj.newSubChild.newFeatChild.newActChild.newWrkChild.newTskChild);
                                    setRestructureChecked(newChildarray);
                                    ArrayTest?.push(newObj);
                                    task.isRestructureActive = false;
                                    if (wrkstrm.TaskType?.Id === 3) {
                                      wrkstrm.isRestructureActive = false;
                                    }
                                  }
                                  if ((task.TaskType?.Id == 1 || task.TaskType?.Id == 3) && task?.siteType !== items?.siteType) {
                                    task.isRestructureActive = false;
                                  }

                                }
                                )
                              }
                            }
                            )
                          }

                        })
                      }

                    })
                  }
                })
              }
            }
          })
        }
      })

      setCheckItemLength(true);
      setOldArrayBackup(ArrayTest);
      restructureCallBack(array, topCompo);
    }
  }



  const makeMultiSameTask = () => {
    let array: any = allData;
    if (restructureItem[0]?.Item_x0020_Type == 'Task') {
      let ParentTask_Portfolio: any = newItemBackUp?.Id;
      let TaskId = newItemBackUp?.TaskID == undefined ? newItemBackUp?.TaskID : newItemBackUp?.PortfolioStructureID
      let TaskLevel: number = 0;
      if (newItemBackUp?.subRows != undefined && newItemBackUp?.subRows?.length > 0) {
        newItemBackUp?.subRows?.map((sub: any) => {
          if (restructureItem[0]?.TaskType?.Id === sub?.TaskType?.Id) {
            if (TaskLevel <= sub.TaskLevel) {
              TaskLevel = sub.TaskLevel;
            }
          } else {
            TaskLevel = 1;
          }

        })
      } else {
        TaskLevel = 1;
      }
      let array: any = [...allData];
      let count: number = 0;
      if(newItemBackUp?.Item_x0020_Type != 'Task'){
        ParentTask_Portfolio = null;
       }
      restructureItem?.map(async (items: any, index: any) => {
        let level: number = TaskLevel + index;
        let web = new Web(items.siteUrl);
        var postData: any = {
          ParentTaskId: ParentTask_Portfolio,
          TaskLevel: level,
          TaskID: items?.TaskType?.Id == 2 ? TaskId + '-' + 'T' + items.Id : (items?.TaskType?.Id == 1 ? TaskId + '-' + 'A' + level : (items?.TaskType?.Id == 3 && newItemBackUp?.Item_x0020_Type == 'Task' ? TaskId + '-' + 'W' + level : TaskId + '-' + 'A' + level))
        };

        await web.lists
          .getById(items.listId)
          .items.getById(items.Id)
          .update(postData)
          .then(async (res: any) => {
            let checkUpdate: number = 1;
            count = count + 1;
            let backupCheckedList: any = [];
            let latestCheckedList: any = [];

            latestCheckedList?.push({ ...items })
            backupCheckedList?.push({ ...items })


            latestCheckedList?.map((items: any) => {
              items.ParentTask = { Id: ParentTask_Portfolio },
                items.Portfolio = { Id: ParentTask_Portfolio, ItemType: RestructureChecked[0]?.TaskType?.Title == undefined ? RestructureChecked[0]?.Item_x0020_Type : RestructureChecked[0]?.TaskType?.Title, Title: restructureItem[0]?.Title },
                items.TaskLevel = TaskLevel,
                items.TaskType = { Id: RestructureChecked[0]?.TaskType?.Id, Level: RestructureChecked[0]?.TaskType?.Level, Title: RestructureChecked[0]?.TaskType?.Title },
                items.TaskID = RestructureChecked[0]?.TaskType?.Id == 2 ? TaskId + '-' + 'T' + RestructureChecked[0]?.Id : (RestructureChecked[0]?.TaskType?.Id == 1 ? TaskId + '-' + 'A' + TaskLevel : (RestructureChecked[0]?.TaskType?.Id == 3 && newItemBackUp?.Item_x0020_Type == 'Task' ? TaskId + '-' + 'W' + TaskLevel : TaskId + '-' + 'A' + TaskLevel))
            })

            array?.map((obj: any, index: any) => {
              obj.isRestructureActive = false;
              if (obj.Id === newItemBackUp?.Id && obj.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && obj.TaskType?.Title === newItemBackUp?.TaskType?.Title && checkUpdate != 3) {
                obj.subRows?.push(...latestCheckedList);
                checkUpdate = checkUpdate + 1;
              }
              if (obj.Id === backupCheckedList[0]?.Id && obj.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && obj.TaskType?.Title === backupCheckedList[0]?.TaskType?.Title && checkUpdate != 3) {
                array.splice(index, 1);
                checkUpdate = checkUpdate + 1;
              }

              if (obj.subRows != undefined && obj.subRows?.length > 0) {
                obj.subRows.forEach((sub: any, indexsub: any) => {
                  sub.isRestructureActive = false;
                  if (sub.Id === newItemBackUp?.Id && sub.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && sub.TaskType?.Title === newItemBackUp?.TaskType?.Title && checkUpdate != 3) {
                    sub.subRows?.push(...latestCheckedList);
                    checkUpdate = checkUpdate + 1;
                  }
                  if (sub.Id === backupCheckedList[0]?.Id && sub.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && sub.TaskType?.Title === backupCheckedList[0]?.TaskType?.Title && checkUpdate != 3) {
                    array[index]?.subRows.splice(indexsub, 1);
                    checkUpdate = checkUpdate + 1;
                  }

                  if (sub.subRows != undefined && sub.subRows?.length > 0) {
                    sub.subRows.forEach((newsub: any, lastIndex: any) => {
                      newsub.isRestructureActive = false;
                      if (newsub.Id === newItemBackUp?.Id && newsub.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && newsub.TaskType?.Title === newItemBackUp?.TaskType?.Title && checkUpdate != 3) {
                        newsub.subRows?.push(...latestCheckedList);
                        checkUpdate = checkUpdate + 1;
                      }
                      if (newsub.Id === backupCheckedList[0]?.Id && newsub.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && newsub.TaskType?.Title === backupCheckedList[0]?.TaskType?.Title && checkUpdate != 3) {
                        array[index]?.subRows[indexsub]?.subRows.splice(lastIndex, 1);
                        checkUpdate = checkUpdate + 1;
                      }

                      if (newsub.subRows != undefined && newsub.subRows?.length > 0) {
                        newsub.subRows.forEach((activity: any, activityIndex: any) => {
                          activity.isRestructureActive = false;
                          if (activity.Id === newItemBackUp?.Id && activity.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && activity.TaskType?.Title === newItemBackUp?.TaskType?.Title && checkUpdate != 3) {
                            activity.subRows?.push(...latestCheckedList);
                            checkUpdate = checkUpdate + 1;
                          }
                          if (activity.Id === backupCheckedList[0]?.Id && activity.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && activity.TaskType?.Title === backupCheckedList[0]?.TaskType?.Title && checkUpdate != 3) {
                            array[index]?.subRows[indexsub]?.subRows[lastIndex].subRows.splice(activityIndex, 1);
                            checkUpdate = checkUpdate + 1;
                          }

                          if (activity.subRows != undefined && activity.subRows?.length > 0) {
                            activity.subRows.forEach((workstream: any, workstreamIndex: any) => {
                              workstream.isRestructureActive = false;
                              if (workstream.Id === newItemBackUp?.Id && workstream.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && workstream.TaskType?.Title === newItemBackUp?.TaskType?.Title && checkUpdate != 3) {
                                workstream.subRows?.push(...latestCheckedList);
                                checkUpdate = checkUpdate + 1;
                              }
                              if (workstream.Id === backupCheckedList[0]?.Id && workstream.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && workstream.TaskType?.Title === backupCheckedList[0]?.TaskType?.Title && checkUpdate != 3) {
                                array[index]?.subRows[indexsub]?.subRows[lastIndex].subRows[activityIndex]?.subRows.splice(workstreamIndex, 1);
                                checkUpdate = checkUpdate + 1;
                              }

                              if (activity.subRows != undefined && activity.subRows?.length > 0) {
                                activity.subRows.forEach((task: any, taskIndex: any) => {
                                  task.isRestructureActive = false;
                                  if (task.Id === newItemBackUp?.Id && task.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && task.TaskType?.Title === newItemBackUp?.TaskType?.Title && checkUpdate != 3) {
                                    task.subRows?.push(...latestCheckedList);
                                    checkUpdate = checkUpdate + 1;
                                  }
                                  if (task.Id === backupCheckedList[0]?.Id && task.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && task.TaskType?.Title === backupCheckedList[0]?.TaskType?.Title && checkUpdate != 3) {
                                    array[index]?.subRows[indexsub]?.subRows[lastIndex].subRows[activityIndex]?.subRows[workstreamIndex].subRows?.splice(taskIndex, 1);
                                    checkUpdate = checkUpdate + 1;
                                  }
                                })
                              }


                            })
                          }


                        })
                      }
                    })
                  }
                })
              }

            })

            array = array;

            if (count === restructureItem?.length - 1) {
              setResturuningOpen(false);
              restructureCallBack(array, false);
            }

          })


      })
    } else {
      let ParentTask: any = newItemBackUp?.Id;
      let PortfolioStructureID = newItemBackUp?.PortfolioStructureID;
      let PortfolioLevel: number = 0;
      let SiteIconTitle: any = newItemBackUp?.Item_x0020_Type === 'Component' ? 'S' : 'F';;
      let Item_x0020_Type: any = newItemBackUp?.Item_x0020_Type === 'Component' ? 'SubComponent' : 'Feature';

      if (newItemBackUp?.subRows != undefined && newItemBackUp?.subRows?.length > 0) {
        newItemBackUp?.subRows?.map((sub: any) => {
          if (Item_x0020_Type === sub?.Item_x0020_Type) {
            if (PortfolioLevel <= sub?.PortfolioLevel) {
              PortfolioLevel = sub.PortfolioLevel;
            }
          } else {
            PortfolioLevel = 1;
          }
        })
      } else {
        PortfolioLevel = 1;
      }
      let array: any = [...allData];
      let count: number = 0;
      restructureItem?.map(async (items: any, index: any) => {
        let level: number = PortfolioLevel + index;
        let web = new Web(props?.contextValue?.siteUrl);
        var postData: any = {
          ParentId: ParentTask,
          PortfolioLevel: level,
          Item_x0020_Type: Item_x0020_Type,
          PortfolioStructureID: PortfolioStructureID + '-' + SiteIconTitle + level,
        };
        await web.lists
          .getById(props?.contextValue?.MasterTaskListID)
          .items.getById(items.Id)
          .update(postData)
          .then(async (res: any) => {
            let checkUpdate: number = 1;
            let backupCheckedList: any = [];
            let latestCheckedList: any = [];
            latestCheckedList?.push({ ...items })
            backupCheckedList?.push({ ...items })
            count = count + 1;
            latestCheckedList?.map((items: any) => {
              items.Parent = { Id: ParentTask },
                items.PortfolioLevel = PortfolioLevel,
                items.Item_x0020_Type = Item_x0020_Type,
                items.SiteIconTitle = SiteIconTitle,
                items.PortfolioStructureID = PortfolioStructureID + '-' + SiteIconTitle + PortfolioLevel,
                items.TaskID = PortfolioStructureID + '-' + SiteIconTitle + PortfolioLevel
            })

            array?.map((obj: any, index: any) => {
              obj.isRestructureActive = false;
              if (obj.Id === newItemBackUp?.Id && obj.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && obj.TaskType?.Title === newItemBackUp?.TaskType?.Title && checkUpdate != 3) {
                obj.subRows?.push(...latestCheckedList);
                checkUpdate = checkUpdate + 1;
              }
              if (obj.Id === backupCheckedList[0]?.Id && obj.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && obj.TaskType?.Title === backupCheckedList[0]?.TaskType?.Title && checkUpdate != 3) {
                array.splice(index, 1);
                checkUpdate = checkUpdate + 1;
              }

              if (obj.subRows != undefined && obj.subRows?.length > 0) {
                obj.subRows.forEach((sub: any, indexsub: any) => {
                  sub.isRestructureActive = false;
                  if (sub.Id === newItemBackUp?.Id && sub.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && sub.TaskType?.Title === newItemBackUp?.TaskType?.Title && checkUpdate != 3) {
                    sub.subRows?.push(...latestCheckedList);
                    checkUpdate = checkUpdate + 1;
                  }
                  if (sub.Id === backupCheckedList[0]?.Id && sub.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && sub.TaskType?.Title === backupCheckedList[0]?.TaskType?.Title && checkUpdate != 3) {
                    array[index]?.subRows.splice(indexsub, 1);
                    checkUpdate = checkUpdate + 1;
                  }

                  if (sub.subRows != undefined && sub.subRows?.length > 0) {
                    sub.subRows.forEach((newsub: any, lastIndex: any) => {
                      newsub.isRestructureActive = false;
                      if (newsub.Id === newItemBackUp?.Id && newsub.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && newsub.TaskType?.Title === newItemBackUp?.TaskType?.Title && checkUpdate != 3) {
                        newsub.subRows?.push(...latestCheckedList);
                        checkUpdate = checkUpdate + 1;
                      }
                      if (newsub.Id === backupCheckedList[0]?.Id && newsub.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && newsub.TaskType?.Title === backupCheckedList[0]?.TaskType?.Title && checkUpdate != 3) {
                        array[index]?.subRows[indexsub]?.subRows.splice(lastIndex, 1);
                        checkUpdate = checkUpdate + 1;
                      }

                      if (newsub.subRows != undefined && newsub.subRows?.length > 0) {
                        newsub.subRows.forEach((activity: any, activityIndex: any) => {
                          activity.isRestructureActive = false;
                          if (activity.Id === newItemBackUp?.Id && activity.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && activity.TaskType?.Title === newItemBackUp?.TaskType?.Title && checkUpdate != 3) {
                            activity.subRows?.push(...latestCheckedList);
                            checkUpdate = checkUpdate + 1;
                          }
                          if (activity.Id === backupCheckedList[0]?.Id && activity.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && activity.TaskType?.Title === backupCheckedList[0]?.TaskType?.Title && checkUpdate != 3) {
                            array[index]?.subRows[indexsub]?.subRows[lastIndex].subRows.splice(activityIndex, 1);
                            checkUpdate = checkUpdate + 1;
                          }

                          if (activity.subRows != undefined && activity.subRows?.length > 0) {
                            activity.subRows.forEach((workstream: any, workstreamIndex: any) => {
                              workstream.isRestructureActive = false;
                              if (workstream.Id === newItemBackUp?.Id && workstream.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && workstream.TaskType?.Title === newItemBackUp?.TaskType?.Title && checkUpdate != 3) {
                                workstream.subRows?.push(...latestCheckedList);
                                checkUpdate = checkUpdate + 1;
                              }
                              if (workstream.Id === backupCheckedList[0]?.Id && workstream.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && workstream.TaskType?.Title === backupCheckedList[0]?.TaskType?.Title && checkUpdate != 3) {
                                array[index]?.subRows[indexsub]?.subRows[lastIndex].subRows[activityIndex]?.subRows.splice(workstreamIndex, 1);
                                checkUpdate = checkUpdate + 1;
                              }

                              if (activity.subRows != undefined && activity.subRows?.length > 0) {
                                activity.subRows.forEach((task: any, taskIndex: any) => {
                                  task.isRestructureActive = false;
                                  if (task.Id === newItemBackUp?.Id && task.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && task.TaskType?.Title === newItemBackUp?.TaskType?.Title && checkUpdate != 3) {
                                    task.subRows?.push(...latestCheckedList);
                                    checkUpdate = checkUpdate + 1;
                                  }
                                  if (task.Id === backupCheckedList[0]?.Id && task.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && task.TaskType?.Title === backupCheckedList[0]?.TaskType?.Title && checkUpdate != 3) {
                                    array[index]?.subRows[indexsub]?.subRows[lastIndex].subRows[activityIndex]?.subRows[workstreamIndex].subRows?.splice(taskIndex, 1);
                                    checkUpdate = checkUpdate + 1;
                                  }
                                })
                              }


                            })
                          }


                        })
                      }
                    })
                  }
                })
              }

            })
            if (count === restructureItem?.length - 1) {
              setResturuningOpen(false);
              restructureCallBack(array, false);
            }
          })
      })
    }
  }





  const OpenModal = (item: any) => {
    setNewItemBackUp(item);
    let array = allData;
    var TestArray: any = [];

    array.forEach((obj: any) => {
      let object: any = {};
      if (obj.TaskID === item.TaskID && obj.Id === item.Id) {
        object = { Title: obj?.Title, Id: obj.Id, TaskType: { Id: obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id }, Item_x0020_Type: obj.Item_x0020_Type, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle }
        TestArray?.push(object);
      }
      if (obj.subRows != undefined && obj.subRows?.length > 0) {
        obj.subRows.forEach((sub: any) => {
          if (sub.TaskID === item.TaskID && sub.Id === item.Id) {
            object = {
              Title: obj?.Title, TaskType: { Id: obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id }, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle,
              newSubChild: { Title: sub?.Title, TaskType: { Id: sub.TaskType?.Id == undefined ? '' : sub.TaskType?.Id }, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIconTitle === undefined ? sub.SiteIcon : sub.SiteIconTitle }
            }
            TestArray?.push(object)
          }
          if (sub.subRows != undefined && sub.subRows?.length > 0) {
            sub.subRows.forEach((newsub: any) => {
              if (newsub.TaskID === item.TaskID && newsub.Id === item.Id) {
                object = {
                  Title: obj?.Title, TaskType: { Id: obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id }, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle,
                  newSubChild: {
                    Title: sub?.Title, TaskType: { Id: sub.TaskType?.Id == undefined ? '' : sub.TaskType?.Id }, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIconTitle === undefined ? sub.SiteIcon : sub.SiteIconTitle,
                    newFeatChild: { Title: newsub?.Title, TaskType: { Id: newsub.TaskType?.Id == undefined ? '' : newsub.TaskType?.Id }, Item_x0020_Type: newsub.Item_x0020_Type, Id: newsub.Id, siteIcon: newsub.SiteIconTitle === undefined ? newsub.SiteIcon : newsub.SiteIconTitle }
                  }
                }
                TestArray?.push(object)
              }
              if (newsub.subRows != undefined && newsub.subRows?.length > 0) {
                newsub.subRows.forEach((activity: any) => {
                  if (activity.TaskID === item.TaskID && activity.Id === item.Id) {
                    object = {
                      Title: obj?.Title, TaskType: { Id: obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id }, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle,
                      newSubChild: {
                        Title: sub?.Title, TaskType: { Id: sub.TaskType?.Id == undefined ? '' : sub.TaskType?.Id }, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIconTitle === undefined ? sub.SiteIcon : sub.SiteIconTitle,
                        newFeatChild: {
                          Title: newsub?.Title, TaskType: { Id: newsub.TaskType?.Id == undefined ? '' : newsub.TaskType?.Id }, Item_x0020_Type: newsub.Item_x0020_Type, Id: newsub.Id, siteIcon: newsub.SiteIconTitle === undefined ? newsub.SiteIcon : newsub.SiteIconTitle,
                          newActChild: { Title: activity?.Title, TaskType: { Id: activity.TaskType?.Id == undefined ? '' : activity.TaskType?.Id }, Item_x0020_Type: activity.Item_x0020_Type, Id: activity.Id, siteIcon: activity.SiteIcon, }
                        }
                      }
                    }
                    TestArray?.push(object)
                  }
                  if (newsub.subRows != undefined && newsub.subRows?.length > 0) {
                    activity?.subRows?.forEach((wrkstrm: any) => {
                      if (wrkstrm.TaskID === item.TaskID && wrkstrm.Id === item.Id) {
                        object = {
                          Title: obj?.Title, TaskType: { Id: obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id }, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle,
                          newSubChild: {
                            Title: sub?.Title, TaskType: { Id: sub.TaskType?.Id == undefined ? '' : sub.TaskType?.Id }, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIconTitle === undefined ? sub.SiteIcon : sub.SiteIconTitle,
                            newFeatChild: {
                              Title: newsub?.Title, TaskType: { Id: newsub.TaskType?.Id == undefined ? '' : newsub.TaskType?.Id }, Item_x0020_Type: newsub.Item_x0020_Type, Id: newsub.Id, siteIcon: newsub.SiteIconTitle === undefined ? newsub.SiteIcon : newsub.SiteIconTitle,
                              newActChild: {
                                Title: activity?.Title, TaskType: { Id: activity.TaskType?.Id == undefined ? '' : activity.TaskType?.Id }, Item_x0020_Type: activity.Item_x0020_Type, Id: activity.Id, siteIcon: activity.SiteIcon,
                                newWrkChild: { Title: wrkstrm?.Title, TaskType: { Id: wrkstrm.TaskType?.Id == undefined ? '' : wrkstrm.TaskType?.Id }, Item_x0020_Type: wrkstrm.Item_x0020_Type, Id: wrkstrm.Id, siteIcon: wrkstrm.SiteIcon, }
                              }
                            }
                          }
                        };
                        TestArray?.push(object)
                      }
                    })
                  }

                })
              }

            })
          }

        })
      }
    })
    setNewArrayBackup(TestArray);
    setResturuningOpen(true);
    setTrueTopCompo(false);
  };

  const trueTopIcon = (items: any) => {
    setTrueTopCompo(items);
    setResturuningOpen(false);
  }

  React.useImperativeHandle(ref, () => ({
    OpenModal, trueTopIcon


  }));




  const UpdateTaskRestructure = async function () {

    if (restructureItem[0]?.Item_x0020_Type == 'Task') {
      let ParentTask_Id: any = newItemBackUp?.Id;
      let Portfolio:any;
      let TaskId = newItemBackUp?.TaskID !== undefined ? newItemBackUp?.TaskID : ''
      let TaskLevel: number = 0;
      let TaskTypeId:any;

      if(newItemBackUp?.Item_x0020_Type != 'Task' && (RestructureChecked[0]?.TaskType?.Id === 3) ){
        TaskTypeId = 1;
      }else{
        if(newItemBackUp?.Item_x0020_Type == 'Task' && newItemBackUp?.TaskType?.Id == 1 && RestructureChecked[0]?.TaskType?.Id === 1){
          TaskTypeId = 3;
        }else{
          TaskTypeId = RestructureChecked[0]?.TaskType?.Id;
        }
      }

     if (newItemBackUp?.subRows != undefined && newItemBackUp?.subRows?.length > 0) {
        newItemBackUp?.subRows?.map((sub: any) => {
          if (RestructureChecked[0]?.TaskType?.Id === sub?.TaskType?.Id) {
            if (TaskLevel <= sub.TaskLevel) {
              TaskLevel = sub.TaskLevel;
            }
          }})
      } 

         TaskLevel = TaskLevel+1;


         TaskId = TaskTypeId == 2 ? 'T' + RestructureChecked[0]?.Id : TaskId + '-' + 'W' + TaskLevel
      if(TaskTypeId === 1){
        ParentTask_Id = null;
        let web = new Web(restructureItem[0]?.siteUrl);
        await web.lists
           .getById(restructureItem[0]?.listId)
           .items
           .select("Id,Title,TaskType/Id,TaskType/Title,TaskLevel")
           .expand('TaskType')
           .orderBy("Id", false)
           .filter("TaskType/Title eq 'Activities'")
           .top(1)
           .get().then((componentDetails:any)=>{
             if(componentDetails?.length == 0){
               var LatestId:any =  1;
               TaskLevel = LatestId
               TaskId =  'A' + LatestId
             }
             else{
               var LatestId = componentDetails[0].TaskLevel + 1;
               TaskLevel = LatestId
               TaskId =  'A' + LatestId
             }
           }).catch((err:any)=>{
            console.log(err);
           })
    
        }

        if(newItemBackUp?.Item_x0020_Type != 'Task'){
          ParentTask_Id = null;
          Portfolio = newItemBackUp?.Id
        }else{
          Portfolio = newItemBackUp?.Portfolio?.Id;
        }
        

      let web = new Web(props?.contextValue?.siteUrl);
      var postData: any = {
        ParentTaskId: ParentTask_Id,
        PortfolioId: Portfolio,
        TaskLevel: TaskLevel,
        TaskTypeId: TaskTypeId,
        TaskID:  TaskId 
      };

      await web.lists
        .getById(restructureItem[0]?.listId)
        .items.getById(restructureItem[0]?.Id)
        .update(postData)
        .then(async (res: any) => {
          let checkUpdate: number = 1;
          let array: any = [...allData];
          let backupCheckedList: any = [];
          let latestCheckedList: any = [];
          restructureItem?.map((items: any) => {
            latestCheckedList?.push({ ...items })
            backupCheckedList?.push({ ...items })
          })

          latestCheckedList?.map((items: any) => {
            items.ParentTask = { Id: ParentTask_Id },
            items.Portfolio = { Id: Portfolio},
            items.TaskLevel = TaskLevel,
            items.TaskType = { Id : TaskTypeId, Title: TaskTypeId == 1 ? "Activity" : (TaskTypeId == 2 ? "Task" : "Workstream")},
            items.TaskID = GetTaskId(newItemBackUp) })

          array?.map((obj: any, index: any) => {
            obj.isRestructureActive = false;
            if (obj.Id === newItemBackUp?.Id && obj?.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && obj?.TaskType?.Title === newItemBackUp?.TaskType?.Title && checkUpdate != 3) {
              obj?.subRows?.push(...latestCheckedList);
              checkUpdate = checkUpdate + 1;
            }
            if (obj?.Id === backupCheckedList[0]?.Id && obj?.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && obj?.TaskType?.Title === backupCheckedList[0]?.TaskType?.Title && checkUpdate != 3) {
              array.splice(index, 1);
              checkUpdate = checkUpdate + 1;
            }

            if (obj?.subRows != undefined && obj?.subRows?.length > 0) {
              obj?.subRows?.forEach((sub: any, indexsub: any) => {
                sub.isRestructureActive = false;
                if (sub?.Id === newItemBackUp?.Id && sub?.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && sub?.TaskType?.Title === newItemBackUp?.TaskType?.Title && checkUpdate != 3) {
                  sub.subRows?.push(...latestCheckedList);
                  checkUpdate = checkUpdate + 1;
                }
                if (sub.Id === backupCheckedList[0]?.Id && sub?.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && sub?.TaskType?.Title === backupCheckedList[0]?.TaskType?.Title && checkUpdate != 3) {
                  array[index]?.subRows.splice(indexsub, 1);
                  checkUpdate = checkUpdate + 1;
                }

                if (sub.subRows != undefined && sub.subRows?.length > 0) {
                  sub.subRows.forEach((newsub: any, lastIndex: any) => {
                    newsub.isRestructureActive = false;
                    if (newsub.Id === newItemBackUp?.Id && newsub.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && newsub.TaskType?.Title === newItemBackUp?.TaskType?.Title && checkUpdate != 3) {
                      newsub.subRows?.push(...latestCheckedList);
                      checkUpdate = checkUpdate + 1;
                    }
                    if (newsub?.Id === backupCheckedList[0]?.Id && newsub?.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && newsub?.TaskType?.Title === backupCheckedList[0]?.TaskType?.Title && checkUpdate != 3) {
                      array[index]?.subRows[indexsub]?.subRows.splice(lastIndex, 1);
                      checkUpdate = checkUpdate + 1;
                    }

                    if (newsub.subRows != undefined && newsub.subRows?.length > 0) {
                      newsub.subRows.forEach((activity: any, activityIndex: any) => {
                        activity.isRestructureActive = false;
                        if (activity.Id === newItemBackUp?.Id && activity?.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && activity?.TaskType?.Title === newItemBackUp?.TaskType?.Title && checkUpdate != 3) {
                          activity.subRows?.push(...latestCheckedList);
                          checkUpdate = checkUpdate + 1;
                        }
                        if (activity.Id === backupCheckedList[0]?.Id && activity?.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && activity?.TaskType?.Title === backupCheckedList[0]?.TaskType?.Title && checkUpdate != 3) {
                          array[index]?.subRows[indexsub]?.subRows[lastIndex].subRows.splice(activityIndex, 1);
                          checkUpdate = checkUpdate + 1;
                        }

                        if (activity.subRows != undefined && activity.subRows?.length > 0) {
                          activity.subRows.forEach((workstream: any, workstreamIndex: any) => {
                            workstream.isRestructureActive = false;
                            if (workstream.Id === newItemBackUp?.Id && workstream.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && workstream.TaskType?.Title === newItemBackUp?.TaskType?.Title && checkUpdate != 3) {
                              workstream.subRows?.push(...latestCheckedList);
                              checkUpdate = checkUpdate + 1;
                            }
                            if (workstream.Id === backupCheckedList[0]?.Id && workstream.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && workstream.TaskType?.Title === backupCheckedList[0]?.TaskType?.Title && checkUpdate != 3) {
                              array[index]?.subRows[indexsub]?.subRows[lastIndex].subRows[activityIndex]?.subRows.splice(workstreamIndex, 1);
                              checkUpdate = checkUpdate + 1;
                            }

                            if (activity.subRows != undefined && activity.subRows?.length > 0) {
                              activity.subRows.forEach((task: any, taskIndex: any) => {
                                task.isRestructureActive = false;
                                if (task.Id === newItemBackUp?.Id && task.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && task.TaskType?.Title === newItemBackUp?.TaskType?.Title && checkUpdate != 3) {
                                  task.subRows?.push(...latestCheckedList);
                                  checkUpdate = checkUpdate + 1;
                                }
                                if (task.Id === backupCheckedList[0]?.Id && task.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && task.TaskType?.Title === backupCheckedList[0]?.TaskType?.Title && checkUpdate != 3) {
                                  array[index]?.subRows[indexsub]?.subRows[lastIndex].subRows[activityIndex]?.subRows[workstreamIndex].subRows?.splice(taskIndex, 1);
                                  checkUpdate = checkUpdate + 1;
                                }
                              })
                            }


                          })
                        }


                      })
                    }
                  })
                }
              })
            }

          })

          setResturuningOpen(false);
          restructureCallBack(array, false);

        })

    } else {
      let ParentTask: any = newItemBackUp?.Id;
      let PortfolioStructureID = newItemBackUp?.PortfolioStructureID;
      let PortfolioLevel: number = 0;
      let SiteIconTitle: any = RestructureChecked[0]?.siteIcon;
      let Item_x0020_Type: any = RestructureChecked[0]?.Item_x0020_Type;

      if(newItemBackUp.Item_x0020_Type === "SubComponent"){
        Item_x0020_Type = 'Feature';
        SiteIconTitle = "F";
      }

      if(newItemBackUp.Item_x0020_Type === "Component" && RestructureChecked[0]?.Item_x0020_Type === "Component"){
        Item_x0020_Type = 'SubComponent';
        SiteIconTitle = "S";
      }

      if (newItemBackUp?.subRows != undefined && newItemBackUp?.subRows?.length > 0) {
        newItemBackUp?.subRows?.map((sub: any) => {
          if (Item_x0020_Type === sub?.Item_x0020_Type) {
            if (PortfolioLevel <= sub?.PortfolioLevel) {
              PortfolioLevel = sub.PortfolioLevel;
            }
          } 

        })
      } 

      
      PortfolioLevel = PortfolioLevel +1;
      

      let web = new Web(props?.contextValue?.siteUrl);
      var postData: any = {
        ParentId: ParentTask,
        PortfolioLevel: PortfolioLevel,
        Item_x0020_Type: Item_x0020_Type,
        PortfolioStructureID: PortfolioStructureID + '-' + SiteIconTitle + PortfolioLevel,
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
            latestCheckedList?.push({ ...items })
            backupCheckedList?.push({ ...items })
          })

          latestCheckedList?.map((items: any) => {
            items.Parent = { Id: ParentTask },
              items.PortfolioLevel = PortfolioLevel,
              items.Item_x0020_Type = Item_x0020_Type,
              items.SiteIconTitle = SiteIconTitle,
              items.PortfolioStructureID = PortfolioStructureID + '-' + SiteIconTitle + PortfolioLevel,
              items.TaskID = PortfolioStructureID + '-' + SiteIconTitle + PortfolioLevel
          })

          array?.map((obj: any, index: any) => {
            obj.isRestructureActive = false;
            if (obj?.Id === newItemBackUp?.Id && obj?.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && obj.TaskType?.Title === newItemBackUp?.TaskType?.Title && checkUpdate != 3) {
              obj.subRows?.push(...latestCheckedList);
              checkUpdate = checkUpdate + 1;
            }
            if (obj?.Id === backupCheckedList[0]?.Id && obj?.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && obj.TaskType?.Title === backupCheckedList[0]?.TaskType?.Title && checkUpdate != 3) {
              array.splice(index, 1);
              checkUpdate = checkUpdate + 1;
            }

            if (obj?.subRows != undefined && obj?.subRows?.length > 0) {
              obj?.subRows.forEach((sub: any, indexsub: any) => {
                sub.isRestructureActive = false;
                if (sub.Id === newItemBackUp?.Id && sub.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && sub.TaskType?.Title === newItemBackUp?.TaskType?.Title && checkUpdate != 3) {
                  sub.subRows?.push(...latestCheckedList);
                  checkUpdate = checkUpdate + 1;
                }
                if (sub.Id === backupCheckedList[0]?.Id && sub.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && sub.TaskType?.Title === backupCheckedList[0]?.TaskType?.Title && checkUpdate != 3) {
                  array[index]?.subRows.splice(indexsub, 1);
                  checkUpdate = checkUpdate + 1;
                }

                if (sub.subRows != undefined && sub.subRows?.length > 0) {
                  sub.subRows.forEach((newsub: any, lastIndex: any) => {
                    newsub.isRestructureActive = false;
                    if (newsub.Id === newItemBackUp?.Id && newsub.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && newsub.TaskType?.Title === newItemBackUp?.TaskType?.Title && checkUpdate != 3) {
                      newsub.subRows?.push(...latestCheckedList);
                      checkUpdate = checkUpdate + 1;
                    }
                    if (newsub.Id === backupCheckedList[0]?.Id && newsub.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && newsub.TaskType?.Title === backupCheckedList[0]?.TaskType?.Title && checkUpdate != 3) {
                      array[index]?.subRows[indexsub]?.subRows.splice(lastIndex, 1);
                      checkUpdate = checkUpdate + 1;
                    }

                    if (newsub.subRows != undefined && newsub.subRows?.length > 0) {
                      newsub.subRows.forEach((activity: any, activityIndex: any) => {
                        activity.isRestructureActive = false;
                        if (activity.Id === newItemBackUp?.Id && activity.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && activity.TaskType?.Title === newItemBackUp?.TaskType?.Title && checkUpdate != 3) {
                          activity.subRows?.push(...latestCheckedList);
                          checkUpdate = checkUpdate + 1;
                        }
                        if (activity.Id === backupCheckedList[0]?.Id && activity.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && activity.TaskType?.Title === backupCheckedList[0]?.TaskType?.Title && checkUpdate != 3) {
                          array[index]?.subRows[indexsub]?.subRows[lastIndex].subRows.splice(activityIndex, 1);
                          checkUpdate = checkUpdate + 1;
                        }

                        if (activity.subRows != undefined && activity.subRows?.length > 0) {
                          activity.subRows.forEach((workstream: any, workstreamIndex: any) => {
                            workstream.isRestructureActive = false;
                            if (workstream.Id === newItemBackUp?.Id && workstream.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && workstream.TaskType?.Title === newItemBackUp?.TaskType?.Title && checkUpdate != 3) {
                              workstream.subRows?.push(...latestCheckedList);
                              checkUpdate = checkUpdate + 1;
                            }
                            if (workstream.Id === backupCheckedList[0]?.Id && workstream.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && workstream.TaskType?.Title === backupCheckedList[0]?.TaskType?.Title && checkUpdate != 3) {
                              array[index]?.subRows[indexsub]?.subRows[lastIndex].subRows[activityIndex]?.subRows.splice(workstreamIndex, 1);
                              checkUpdate = checkUpdate + 1;
                            }

                            if (activity.subRows != undefined && activity.subRows?.length > 0) {
                              activity.subRows.forEach((task: any, taskIndex: any) => {
                                task.isRestructureActive = false;
                                if (task.Id === newItemBackUp?.Id && task.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && task.TaskType?.Title === newItemBackUp?.TaskType?.Title && checkUpdate != 3) {
                                  task.subRows?.push(...latestCheckedList);
                                  checkUpdate = checkUpdate + 1;
                                }
                                if (task.Id === backupCheckedList[0]?.Id && task.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && task.TaskType?.Title === backupCheckedList[0]?.TaskType?.Title && checkUpdate != 3) {
                                  array[index]?.subRows[indexsub]?.subRows[lastIndex].subRows[activityIndex]?.subRows[workstreamIndex].subRows?.splice(taskIndex, 1);
                                  checkUpdate = checkUpdate + 1;
                                }
                              })
                            }


                          })
                        }


                      })
                    }
                  })
                }
              })
            }

          })
          setResturuningOpen(false);
          restructureCallBack(array, false);
        })
    }

  };



  const makeTopComp = async () => {

if(restructureItem != undefined && restructureItem != undefined && restructureItem[0].Item_x0020_Type != 'Task'){
  let array: any = [...allData];
    let ParentTask: any ;
    let PortfolioStructureIDs :any ;
    let PortfolioLevel: number = 0;
    let Item_x0020_Type: any ;
    let SiteIconTitle: any ;
    let PortfolioId : any
 

    if (array != undefined && array?.length > 0) {
      array?.map((items: any) => {
        if (PortfolioLevel <= items?.PortfolioLevel){
          PortfolioLevel = items.PortfolioLevel;
        }
      })
    }

    PortfolioLevel = PortfolioLevel + 1;


    if(props?.queryItems === undefined && props?.queryItems == null){
      ParentTask = null;
      PortfolioStructureIDs = 'C' + PortfolioLevel;
      SiteIconTitle = 'C'
      Item_x0020_Type = 'Component'
     }else if(props?.queryItems != undefined && props?.queryItems != null && props?.queryItems?.Item_x0020_Type == 'Component'){
      ParentTask = props?.queryItems?.Id;
      PortfolioId = props?.queryItems?.Id;
      PortfolioStructureIDs = props?.queryItems?.PortfolioStructureID + '-' + 'S' + PortfolioLevel;
      SiteIconTitle = 'S';
      Item_x0020_Type = 'SubComponent';
     }else if(props?.queryItems != undefined && props?.queryItems != null && props?.queryItems?.Item_x0020_Type == 'SubComponent'){
      ParentTask = props?.queryItems?.Id;
      PortfolioId = props?.queryItems?.Id;
      PortfolioStructureIDs = props?.queryItems?.PortfolioStructureID + '-' + 'F' + PortfolioLevel;
      SiteIconTitle = 'F';
      Item_x0020_Type = 'Feature';
     }

    let web = new Web(props?.contextValue?.siteUrl);
    var postData: any = {
      ParentId: ParentTask,
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
          latestCheckedList?.push({ ...items })
          backupCheckedList?.push({ ...items })
        })

        latestCheckedList?.map((items: any) => {
            items.Parent = { Id: ParentTask},
            items.PortfolioLevel = PortfolioLevel,
            items.Item_x0020_Type = Item_x0020_Type,
            items.SiteIconTitle = SiteIconTitle,
            items.PortfolioStructureID = PortfolioStructureIDs + '-' + SiteIconTitle + PortfolioLevel,
            items.TaskID = PortfolioStructureIDs + '-' + SiteIconTitle + PortfolioLevel
        })

        array?.map((obj: any, index: any) => {
          obj.isRestructureActive = false;
          if (obj.Id === newItemBackUp?.Id && obj.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && obj.TaskType?.Title === newItemBackUp?.TaskType?.Title && checkUpdate != 3) {
            obj.subRows?.push(...latestCheckedList);
            checkUpdate = checkUpdate + 1;
          }
          if (obj.Id === backupCheckedList[0]?.Id && obj.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && obj.TaskType?.Title === backupCheckedList[0]?.TaskType?.Title && checkUpdate != 3) {
            array.splice(index, 1);
            checkUpdate = checkUpdate + 1;
          }

          if (obj.subRows != undefined && obj.subRows?.length > 0) {
            obj.subRows.forEach((sub: any, indexsub: any) => {
              sub.isRestructureActive = false;
              if (sub.Id === newItemBackUp?.Id && sub.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && sub.TaskType?.Title === newItemBackUp?.TaskType?.Title && checkUpdate != 3) {
                sub.subRows?.push(...latestCheckedList);
                checkUpdate = checkUpdate + 1;
              }
              if (sub.Id === backupCheckedList[0]?.Id && sub.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && sub.TaskType?.Title === backupCheckedList[0]?.TaskType?.Title && checkUpdate != 3) {
                array[index]?.subRows.splice(indexsub, 1);
                checkUpdate = checkUpdate + 1;
              }

              if (sub.subRows != undefined && sub.subRows?.length > 0) {
                sub.subRows.forEach((newsub: any, lastIndex: any) => {
                  newsub.isRestructureActive = false;
                  if (newsub.Id === newItemBackUp?.Id && newsub.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && newsub.TaskType?.Title === newItemBackUp?.TaskType?.Title && checkUpdate != 3) {
                    newsub.subRows?.push(...latestCheckedList);
                    checkUpdate = checkUpdate + 1;
                  }
                  if (newsub.Id === backupCheckedList[0]?.Id && newsub.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && newsub.TaskType?.Title === backupCheckedList[0]?.TaskType?.Title && checkUpdate != 3) {
                    array[index]?.subRows[indexsub]?.subRows.splice(lastIndex, 1);
                    checkUpdate = checkUpdate + 1;
                  }

                  if (newsub.subRows != undefined && newsub.subRows?.length > 0) {
                    newsub.subRows.forEach((activity: any, activityIndex: any) => {
                      activity.isRestructureActive = false;
                      if (activity.Id === newItemBackUp?.Id && activity.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && activity.TaskType?.Title === newItemBackUp?.TaskType?.Title && checkUpdate != 3) {
                        activity.subRows?.push(...latestCheckedList);
                        checkUpdate = checkUpdate + 1;
                      }
                      if (activity.Id === backupCheckedList[0]?.Id && activity.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && activity.TaskType?.Title === backupCheckedList[0]?.TaskType?.Title && checkUpdate != 3) {
                        array[index]?.subRows[indexsub]?.subRows[lastIndex].subRows.splice(activityIndex, 1);
                        checkUpdate = checkUpdate + 1;
                      }

                      if (activity.subRows != undefined && activity.subRows?.length > 0) {
                        activity.subRows.forEach((workstream: any, workstreamIndex: any) => {
                          workstream.isRestructureActive = false;
                          if (workstream.Id === newItemBackUp?.Id && workstream.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && workstream.TaskType?.Title === newItemBackUp?.TaskType?.Title && checkUpdate != 3) {
                            workstream.subRows?.push(...latestCheckedList);
                            checkUpdate = checkUpdate + 1;
                          }
                          if (workstream.Id === backupCheckedList[0]?.Id && workstream.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && workstream.TaskType?.Title === backupCheckedList[0]?.TaskType?.Title && checkUpdate != 3) {
                            array[index]?.subRows[indexsub]?.subRows[lastIndex].subRows[activityIndex]?.subRows.splice(workstreamIndex, 1);
                            checkUpdate = checkUpdate + 1;
                          }

                          if (activity.subRows != undefined && activity.subRows?.length > 0) {
                            activity.subRows.forEach((task: any, taskIndex: any) => {
                              task.isRestructureActive = false;
                              if (task.Id === newItemBackUp?.Id && task.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && task.TaskType?.Title === newItemBackUp?.TaskType?.Title && checkUpdate != 3) {
                                task.subRows?.push(...latestCheckedList);
                                checkUpdate = checkUpdate + 1;
                              }
                              if (task.Id === backupCheckedList[0]?.Id && task.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && task.TaskType?.Title === backupCheckedList[0]?.TaskType?.Title && checkUpdate != 3) {
                                array[index]?.subRows[indexsub]?.subRows[lastIndex].subRows[activityIndex]?.subRows[workstreamIndex].subRows?.splice(taskIndex, 1);
                                checkUpdate = checkUpdate + 1;
                              }
                            })
                          }


                        })
                      }


                    })
                  }
                })
              }
            })
          }

        })
        setResturuningOpen(false);
        setTrueTopCompo(false);
        restructureCallBack(array, false);
      })
}else{
  let array: any = [...allData];
  let ParentTask: any ;
  let PortfolioLevel: number = 0;
  let TaskType: any ;
  let SiteIconTitle: any ;
  let Tasklevel:any;
  let TaskID:any;
  let PortfolioId : any;

   if(props?.queryItems != undefined && props?.queryItems != null && props?.queryItems?.Item_x0020_Type !== "Task" ){
    PortfolioId = props?.queryItems?.Id;
    ParentTask = null;
    TaskType = 1;
    SiteIconTitle = 'A';
   }else if(props?.queryItems != undefined && props?.queryItems != null && props?.queryItems?.TaskType == "Activities"){
    PortfolioId = props?.queryItems?.Id;
    ParentTask = props?.queryItems?.Id;
    SiteIconTitle = 'W';
    TaskType = 3;
   }
  
   if (array != undefined && array?.length > 0) {
    array?.map((items: any) => {
      if(items?.TaskType?.Id == TaskType){
        if (PortfolioLevel <= items?.PortfolioLevel){
          PortfolioLevel = items.PortfolioLevel;
        }
      }
      
    })
   }
   
   PortfolioLevel = PortfolioLevel + 1;

   TaskID = props?.queryItems?.TaskID != undefined ?  props?.queryItems?.TaskID + '-' + SiteIconTitle + PortfolioLevel : '' + SiteIconTitle + PortfolioLevel
   
          
  
   if(TaskType == 1){
    ParentTask = null;
    let web = new Web(restructureItem[0]?.siteUrl);
    await web.lists
       .getById(restructureItem[0]?.listId)
       .items
       .select("Id,Title,TaskType/Id,TaskType/Title,TaskLevel")
       .expand('TaskType')
       .orderBy("Id", false)
       .filter("TaskType/Title eq 'Activities'")
       .top(1)
       .get().then((componentDetails:any)=>{
         if(componentDetails?.length == 0){
           var LatestId:any =  1;
           TaskID =  'A' + LatestId
           PortfolioLevel = LatestId
         }
         else{
           var LatestId = componentDetails[0].TaskLevel + 1;
           TaskID =  'A' + LatestId
           PortfolioLevel = LatestId
         }
       }).catch((err:any)=>{
        console.log(err);
       })
     }
    

     
    let web = new Web(restructureItem[0]?.siteUrl);
    var postData: any = {
      ParentTaskId: ParentTask,
      TaskLevel: PortfolioLevel,
      PortfolioId : PortfolioId,
      TaskTypeId:TaskType,
      TaskID: TaskID
    };
     await web.lists
    .getById(restructureItem[0]?.listId)
    .items.getById(RestructureChecked[0]?.Id)
    .update(postData).then((items:any)=>{
      let checkUpdate: number = 1;
      let array: any = [...allData];
      let backupCheckedList: any = [];
      let latestCheckedList: any = [];
      restructureItem?.map((items: any) => {
        latestCheckedList?.push({ ...items })
        backupCheckedList?.push({ ...items })
      })

      latestCheckedList?.map((items: any) => {
          items.ParentTask = { Id: ParentTask},
          items.TaskLevel = PortfolioLevel,
          items.TaskType = { Id : TaskType, Title: TaskType == 1 ? "Activity" : (TaskType == 2 ? "Task" : "Workstream")},
          items.TaskID = GetTaskId(props?.queryItems);
      })

      array?.map((obj: any, index: any) => {
        obj.isRestructureActive = false;
        if (obj.Id === newItemBackUp?.Id && obj.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && obj.TaskType?.Title === newItemBackUp?.TaskType?.Title && checkUpdate != 3) {
          obj.subRows?.push(...latestCheckedList);
          checkUpdate = checkUpdate + 1;
        }
        if (obj.Id === backupCheckedList[0]?.Id && obj.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && obj.TaskType?.Title === backupCheckedList[0]?.TaskType?.Title && checkUpdate != 3) {
          array.splice(index, 1);
          checkUpdate = checkUpdate + 1;
        }

        if (obj.subRows != undefined && obj.subRows?.length > 0) {
          obj.subRows.forEach((sub: any, indexsub: any) => {
            sub.isRestructureActive = false;
            if (sub.Id === newItemBackUp?.Id && sub.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && sub.TaskType?.Title === newItemBackUp?.TaskType?.Title && checkUpdate != 3) {
              sub.subRows?.push(...latestCheckedList);
              checkUpdate = checkUpdate + 1;
            }
            if (sub.Id === backupCheckedList[0]?.Id && sub.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && sub.TaskType?.Title === backupCheckedList[0]?.TaskType?.Title && checkUpdate != 3) {
              array[index]?.subRows.splice(indexsub, 1);
              checkUpdate = checkUpdate + 1;
            }

            if (sub.subRows != undefined && sub.subRows?.length > 0) {
              sub.subRows.forEach((newsub: any, lastIndex: any) => {
                newsub.isRestructureActive = false;
                if (newsub.Id === newItemBackUp?.Id && newsub.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && newsub.TaskType?.Title === newItemBackUp?.TaskType?.Title && checkUpdate != 3) {
                  newsub.subRows?.push(...latestCheckedList);
                  checkUpdate = checkUpdate + 1;
                }
                if (newsub.Id === backupCheckedList[0]?.Id && newsub.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && newsub.TaskType?.Title === backupCheckedList[0]?.TaskType?.Title && checkUpdate != 3) {
                  array[index]?.subRows[indexsub]?.subRows.splice(lastIndex, 1);
                  checkUpdate = checkUpdate + 1;
                }

                if (newsub.subRows != undefined && newsub.subRows?.length > 0) {
                  newsub.subRows.forEach((activity: any, activityIndex: any) => {
                    activity.isRestructureActive = false;
                    if (activity.Id === newItemBackUp?.Id && activity.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && activity.TaskType?.Title === newItemBackUp?.TaskType?.Title && checkUpdate != 3) {
                      activity.subRows?.push(...latestCheckedList);
                      checkUpdate = checkUpdate + 1;
                    }
                    if (activity.Id === backupCheckedList[0]?.Id && activity.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && activity.TaskType?.Title === backupCheckedList[0]?.TaskType?.Title && checkUpdate != 3) {
                      array[index]?.subRows[indexsub]?.subRows[lastIndex].subRows.splice(activityIndex, 1);
                      checkUpdate = checkUpdate + 1;
                    }

                    if (activity.subRows != undefined && activity.subRows?.length > 0) {
                      activity.subRows.forEach((workstream: any, workstreamIndex: any) => {
                        workstream.isRestructureActive = false;
                        if (workstream.Id === newItemBackUp?.Id && workstream.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && workstream.TaskType?.Title === newItemBackUp?.TaskType?.Title && checkUpdate != 3) {
                          workstream.subRows?.push(...latestCheckedList);
                          checkUpdate = checkUpdate + 1;
                        }
                        if (workstream.Id === backupCheckedList[0]?.Id && workstream.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && workstream.TaskType?.Title === backupCheckedList[0]?.TaskType?.Title && checkUpdate != 3) {
                          array[index]?.subRows[indexsub]?.subRows[lastIndex].subRows[activityIndex]?.subRows.splice(workstreamIndex, 1);
                          checkUpdate = checkUpdate + 1;
                        }

                        if (activity.subRows != undefined && activity.subRows?.length > 0) {
                          activity.subRows.forEach((task: any, taskIndex: any) => {
                            task.isRestructureActive = false;
                            if (task.Id === newItemBackUp?.Id && task.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && task.TaskType?.Title === newItemBackUp?.TaskType?.Title && checkUpdate != 3) {
                              task.subRows?.push(...latestCheckedList);
                              checkUpdate = checkUpdate + 1;
                            }
                            if (task.Id === backupCheckedList[0]?.Id && task.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && task.TaskType?.Title === backupCheckedList[0]?.TaskType?.Title && checkUpdate != 3) {
                              array[index]?.subRows[indexsub]?.subRows[lastIndex].subRows[activityIndex]?.subRows[workstreamIndex].subRows?.splice(taskIndex, 1);
                              checkUpdate = checkUpdate + 1;
                            }
                          })
                        }


                      })
                    }


                  })
                }
              })
            }
          })
        }

      })
      setResturuningOpen(false);
      setTrueTopCompo(false);
      restructureCallBack(array, false);
    }).catch((err:any)=>{
      console.log(err);
    })
    
}
}


  const setRestructure = (item: any, title: any) => {
    let array: any = [];
    let data: any = []
    item?.map((items: any) => {
      if (items != undefined && title === "SubComponent") {
        data?.push({ Id: items.Id, Item_x0020_Type: "SubComponent", TaskType: items.TaskType, Title: items?.Title, siteIcon: "S" })
      }
      if (items != undefined && title === "Feature") {
        data?.push({ Id: items.Id, Item_x0020_Type: "Feature", TaskType: items.TaskType, Title: items?.Title, siteIcon: "F" })
      }
      if (items != undefined && title === 3) {
        data?.push({ Id: items.Id, Item_x0020_Type: "Task", TaskType: { Id: 3 }, Title: items?.Title, siteIcon: items.siteIcon })
      }
      if (items != undefined && title === 2) {
        data?.push({ Id: items.Id, Item_x0020_Type: "Task", TaskType: { Id: 2 }, Title: items?.Title, siteIcon: items.siteIcon })
      }
    })
    array?.push(...data);
    setRestructureChecked(array)
  };


  const onRenderCustomCalculateSC = () => {
    return (
         <>
         <div className='subheading siteColor'>Restucturing Tool</div>
         <div><Tooltip ComponentId="454" /></div>
         </>
    )
  }

  return (
    <>

      <button type="button" title="Restructure" className="btn btn-primary" style={{ backgroundColor: `${props?.portfolioColor}`, borderColor: `${props?.portfolioColor}`, color: '#fff' }}
        onClick={buttonRestructureCheck}
      >Restructure</button>
      
      {
        ResturuningOpen === true && restructureItem?.length == 1 ?
          <Panel
            onRenderHeader={onRenderCustomCalculateSC}
            type={PanelType.medium}
            isOpen={ResturuningOpen}
            isBlocking={false}
            onDismiss={() => setResturuningOpen(false)}
          >
            <div>
              <div className='alignCenter'>
                <div className='me-2'> Old: </div>
                {OldArrayBackup?.map(function (obj: any) {
                  return (
                    <div className=''>
                      {obj?.siteIcon?.length === 1 ? 
                      <span className="Dyicons mx-1">{obj.siteIcon}</span> : <span className='mx-1'><img className='workmember' src={obj?.siteIcon} /></span>}

                      <a
                        data-interception="off" target="_blank" className="serviceColor_Active reStuTile"
                        href={obj.Item_x0020_Type != 'Task' ? (props?.contextValue?.siteUrl + "/SitePages/Portfolio-Profile.aspx?taskId=" + obj?.Id) : 
                        (props?.contextValue?.siteUrl + "/SitePages/Task-Profile.aspx?taskId=" + obj?.Id + "&Site=" + restructuredItemarray[0]?.siteType)
                        }
                      >
                       {obj?.Title}

                      </a>
                      <span className='my-1'>{obj?.newSubChild ? <span> {'>'} <span >{obj?.newSubChild?.siteIcon === "S" || obj?.newSubChild?.siteIcon === "F" ? <span className="Dyicons mx-1">{obj?.newSubChild?.siteIcon}</span> : <span className='mx-1'><img className='workmember' src={obj?.newSubChild?.siteIcon} /></span>}</span> <a className='reStuTile'>{obj?.newSubChild?.Title}</a></span> : ''}</span>
                      <span className='my-1'>{obj?.newSubChild?.newFeatChild ? <span> {'>'} <span >{obj?.newSubChild?.newFeatChild?.siteIcon === "F" ? <span className="Dyicons mx-1">{obj?.newSubChild?.newFeatChild?.siteIcon}</span> : <span className='mx-1'><img className='workmember' src={obj?.newSubChild?.newFeatChild?.siteIcon} /></span>}</span> <a className='reStuTile'>{obj?.newSubChild?.newFeatChild?.Title}</a></span> : ''}</span>
                      <span className='my-1'>{obj?.newSubChild?.newFeatChild?.newActChild ? <span> {'>'} <span className="mx-1"><img className='workmember' src={obj?.newSubChild?.newFeatChild?.newActChild?.siteIcon} /></span><a className='reStuTile'> {obj?.newSubChild?.newFeatChild?.newActChild?.Title}</a></span> : ''}</span>
                      <span className='my-1'>{obj?.newSubChild?.newFeatChild?.newActChild?.newWrkChild ? <span> {'>'} <span className="mx-1"><img className='workmember' src={obj?.newSubChild?.newFeatChild?.newActChild?.newWrkChild?.siteIcon} /> </span><a className='reStuTile'> {obj?.newSubChild?.newFeatChild?.newActChild?.newWrkChild?.Title}</a></span> : ''}</span>
                      <span className='my-1'>{obj?.newSubChild?.newFeatChild?.newActChild?.newWrkChild?.newTskChild ? <span> {'>'} <span className="mx-1"> <img className='workmember' src={obj?.newSubChild?.newFeatChild?.newActChild?.newWrkChild?.newTskChild?.siteIcon} /> </span> <a className='reStuTile'>{obj?.newSubChild?.newFeatChild?.newActChild?.newWrkChild?.newTskChild?.Title}</a></span> : ''}</span>

                    </div>
                  );
                })}
              </div>

              <div className='alignCenter'>
                <div className='me-2'> New: </div>
                {NewArrayBackup?.map(function (obj: any) {
                  return (
                    <div>
                      {obj?.siteIcon?.length === 1 ? <span className="Dyicons mx-1">{obj?.siteIcon}</span> : <span className='mx-1'><img className='workmember' src={obj?.siteIcon} /></span>}

                      <a
                        data-interception="off"
                        target="_blank"
                        className="hreflink serviceColor_Active"
                        href={obj.Item_x0020_Type != 'Task' ? (props?.contextValue?.siteUrl + "/SitePages/Portfolio-Profile.aspx?taskId=" + obj?.Id) : 
                        (props?.contextValue?.siteUrl + "/SitePages/Task-Profile.aspx?taskId=" + obj?.Id + "&Site=" + restructuredItemarray[0]?.siteType)
                        }
                      >
                        <span>{obj?.Title} </span>
                      </a>
                      <span className='my-1'>{obj?.newSubChild ? <span> {'>'} <span >{obj?.newSubChild?.siteIcon === "S" || obj?.newSubChild?.siteIcon === "F" ? <span className="Dyicons mx-1">{obj?.newSubChild?.siteIcon}</span> : <span className='mx-1'><img className='workmember' src={obj?.newSubChild?.siteIcon} /></span>}</span> <a className='reStuTile'>{obj?.newSubChild?.Title}</a></span> : ''}</span>
                      <span className='my-1'>{obj?.newSubChild?.newFeatChild ? <span> {'>'} <span >{obj?.newSubChild?.newFeatChild?.siteIcon === "F" ? <span className="Dyicons mx-1">{obj?.newSubChild?.newFeatChild?.siteIcon}</span> : <span className='mx-1'><img className='workmember' src={obj?.newSubChild?.newFeatChild?.siteIcon} /></span>}</span> <a className='reStuTile'>{obj?.newSubChild?.newFeatChild?.Title}</a></span> : ''}</span>
                      <span className='my-1'>{obj?.newSubChild?.newFeatChild?.newActChild ? <span> {'>'} <span className="mx-1"><img className='workmember' src={obj?.newSubChild?.newFeatChild?.newActChild?.siteIcon} /></span> <a className='reStuTile'>{obj?.newSubChild?.newFeatChild?.newActChild?.Title}</a></span> : ''}</span>
                      <span className='my-1'>{obj?.newSubChild?.newFeatChild?.newActChild?.newWrkChild ? <span> {'>'} <span className="mx-1"><img className='workmember' src={obj?.newSubChild?.newFeatChild?.newActChild?.newWrkChild?.siteIcon} /> </span><a className='reStuTile'> {obj?.newSubChild?.newFeatChild?.newActChild?.newWrkChild?.Title}</a></span> : ''}</span>
                      <span className='my-1'>{obj?.newSubChild?.newFeatChild?.newActChild?.newWrkChild?.newTskChild ? <span> {'>'} <span className="mx-1"> <img className='workmember' src={obj?.newSubChild?.newFeatChild?.newActChild?.newWrkChild?.newTskChild?.siteIcon} /> </span><a className='reStuTile'> {obj?.newSubChild?.newFeatChild?.newActChild?.newWrkChild?.newTskChild?.Title}</a></span> : ''}</span>

                    </div>
                  );
                })}
                {
                  RestructureChecked?.map((items: any) =>
                    <span> {">"}
                      {
                        items?.Item_x0020_Type === "Component" ? <div className="Dyicons">
                          S
                        </div> : (newItemBackUp?.Item_x0020_Type == "SubComponent" && items?.Item_x0020_Type === "SubComponent" ? <div className="Dyicons">F</div> : (items?.Item_x0020_Type === "Task" ? <span><img className='workmember' src={items?.siteIcon} /></span> : <div className="Dyicons">{items?.siteIcon}</div>))
                      }
                      <a
                        data-interception="off"
                        target="_blank"
                        className="hreflink serviceColor_Active"
                        href={
                          props?.contextValue?.siteUrl +
                          "/SitePages/Portfolio-Profile.aspx?taskId=" +
                          items?.Id
                        }
                      >
                        <span className="ms-1 me-1" >{items?.Title} </span>
                      </a>
                    </span>
                  )
                }
              </div>
              {restructureItem != undefined &&
                restructureItem?.length > 0 &&
                restructureItem[0]?.Item_x0020_Type != "Task" && (checkSubChilds?.subRows[0]?.Item_x0020_Type !== "Feature") ? (
                <div>
                  {
                    newItemBackUp?.Item_x0020_Type == "SubComponent" ? " " :
                      <span>
                        <span>

                          {"Select Component Type :"}
                          <input
                            type="radio"
                            name="fav_language"
                            value="SubComponent"
                            checked={
                              RestructureChecked[0]?.Item_x0020_Type == "SubComponent"
                                ? true
                                : RestructureChecked[0]?.Item_x0020_Type == "Component" ? true : false
                            }
                            onChange={(e) =>
                              setRestructure(RestructureChecked, "SubComponent")
                            }
                          />
                          <label className="ms-1"> {"SubComponent"} </label>
                        </span>
                        <span>
                          <input
                            type="radio"
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
                          <label className="ms-1"> {"Feature"} </label>
                        </span>
                      </span>

                  }

                </div>
              ) : (
                ""
              )}

              {
                restructureItem != undefined &&
                  restructureItem?.length > 0 &&
                  restructureItem[0]?.Item_x0020_Type === "Task" &&
                  newItemBackUp?.TaskType?.Id == 1 && newItemBackUp?.Item_x0020_Type == "Task" &&
                  (restructureItem[0]?.TaskType?.Id == 1 || restructureItem[0]?.TaskType?.Id == 3 || restructureItem[0]?.TaskType?.Id == 2) ?
                  <span>
                    <span>

                      {"Select Component Type :"}
                      <input
                        type="radio"
                        name="fav_language"
                        value="Workstream"
                        checked={
                          RestructureChecked[0]?.TaskType?.Id == 3
                            ? true
                            : (RestructureChecked[0]?.TaskType?.Id == 1 ? true : false)
                        }
                        onChange={(e) =>
                          setRestructure(RestructureChecked, 3)
                        }
                      />
                      <label className="ms-1"> {"Workstream"} </label>
                    </span>
                    <span>

                      <input
                        type="radio"
                        name="fav_language"
                        value="SubComponent"
                        checked={
                          RestructureChecked[0]?.TaskType?.Id === 2
                            ? true
                            : false
                        }
                        onChange={(e) =>
                          setRestructure(RestructureChecked, 2)
                        }
                      />
                      <label className="ms-1"> {"Task"} </label>
                    </span>
                  </span> : " "
              }
              <footer className="mt-2 text-end">
                {restructureItem != undefined &&
                  restructureItem?.length > 0 &&
                  restructureItem[0]?.Item_x0020_Type === "Task" ? (
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
                  className="btn btn-default btn-default ms-1"
                  onClick={() => setResturuningOpen(false)}
                >
                  Cancel
                </button>
              </footer>
            </div>
          </Panel> : ''

      }



      {
        ResturuningOpen === true && restructureItem?.length > 1 ?
          <Panel isOpen={ResturuningOpen}
          onRenderHeader={onRenderCustomCalculateSC}
            isBlocking={false}
            onDismiss={() => setResturuningOpen(false)}>
            <div>
              These all Tasks will restructuring inside
              <span>
                {NewArrayBackup[0]?.siteIcon?.length === 1 ? <span className="Dyicons ">{NewArrayBackup[0]?.siteIcon}</span> : <span><img width={"25px"} height={"25px"} src={NewArrayBackup[0]?.siteIcon} /></span>}

                <a
                  data-interception="off"
                  target="_blank"
                  className="hreflink serviceColor_Active"
                  href={
                    props?.contextValue?.siteUrl +
                    "/SitePages/Portfolio-Profile.aspx?taskId=" +
                    NewArrayBackup[0]?.Id
                  }
                >
                  <span>{NewArrayBackup[0]?.Title} </span>
                </a></span>
            </div>
            <footer className="mt-2 text-end">
              <button className="me-2 btn border-primary" onClick={() => setResturuningOpen(false)}>Cancel</button>
              <button className="me-2 btn btn-primary" onClick={makeMultiSameTask} >Save</button>
            </footer>
          </Panel> : ""
      }




      {
        trueTopCompo == true ?
          <span>
            <Panel
            onRenderHeader={onRenderCustomCalculateSC}
              isOpen={trueTopCompo}
              isBlocking={false}
              onDismiss={() => setTrueTopCompo(false)}
            >
              <div>
              After restructuring selected item becomes {query4TopIcon}
                <footer className="mt-2 text-end">
                  <button className="me-2 btn border-primary" onClick={() => setTrueTopCompo(false)}>Cancel</button>
                  <button className="me-2 btn btn-primary" onClick={makeTopComp} >Save</button>
                </footer>

              </div>
            </Panel>
            {/* --------------------------------------------------------Restructuring End---------------------------------------------------------------------------------------------------- */}
          </span>
          : ''
      }
    </>
  )
};


export default forwardRef(RestructuringCom); 