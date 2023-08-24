import React, { useEffect, useState ,useRef, forwardRef} from 'react'
import { Web } from 'sp-pnp-js';
import { Modal, Panel, PanelType } from "office-ui-fabric-react";
// import { restructureCallBack } from '../../webparts/teamPortfolio/components/TeamPortlioTable';

const RestructuringCom = (props:any,ref:any) => {

  let allData:any = [];
  let restructureItem :any = [];
  allData = props.allData;
  restructureItem = props.restructureItem;
  let restructureCallBack = props.restructureCallBack;

  const [OldArrayBackup, setOldArrayBackup]:any = React.useState([]);
  const [NewArrayBackup, setNewArrayBackup] : any = React.useState([]);
  const [ResturuningOpen, setResturuningOpen]:any = React.useState(false);
  const [newItemBackUp, setNewItemBackUp]: any = React.useState([]);
  const [checkSubChilds, setCheckSubChilds]: any = React.useState([]);
  const [RestructureChecked, setRestructureChecked]:any = React.useState([]);
  const [restructuredItemarray, setRestructuredItemarray]: any = React.useState([]);
  const [trueTopCompo, setTrueTopCompo]: any = React.useState(false);
  const [checkItemLength, setCheckItemLength]: any = React.useState(false);




  useEffect(()=>{
    if(restructureItem?.length === 0 && checkItemLength){
      let topCompo:any=false;
      let array = allData;
      array.map((obj:any)=>{
        obj.isRestructureActive = false;
        if(obj?.subRows?.length > 0 && obj?.subRows != undefined){
                obj.subRows.map((sub:any)=>{
                  sub.isRestructureActive = false;
                  if(sub?.subRows?.length > 0 && sub?.subRows != undefined){
                    sub?.subRows?.map((feature:any)=>{
                      feature.isRestructureActive = false;
                       if(feature?.subRows?.length > 0 && feature?.subRows != undefined){
                feature?.subRows?.map((activity:any)=>{
                  activity.isRestructureActive = false;
                  if(activity?.subRows?.length > 0 && activity?.subRows != undefined){
                    activity?.subRows?.map((wrkstrm:any)=>{
                      wrkstrm.isRestructureActive = false;
                      if(wrkstrm?.subRows?.length > 0 && wrkstrm?.subRows != undefined){
                        wrkstrm?.subRows?.map((task:any)=>{
                          task.isRestructureActive = false;
                        })}
                    })}
                })}
                    })}
                })
        }
      })
      props.restructureFunct(false);
      restructureCallBack(array,topCompo);
    }
  },[restructureItem])

const buttonRestructuring=()=>{
  let topCompo:any=false;
  let array = allData;
   if(allData?.length > 0 && allData != undefined && restructureItem.length > 0 && restructureItem != undefined){
    let checkItem_x0020_Type : any = restructureItem[0]?.Item_x0020_Type ;
    let checkSiteType : any = restructureItem[0]?.siteType ;
    let alertNotify : boolean = true;
    let ArrayTest : any = [];

    restructureItem.map((items:any,length:any)=>{
      if(checkItem_x0020_Type === items?.Item_x0020_Type && checkSiteType === items?.siteType && alertNotify){
          if(items?.Item_x0020_Type === "Component"){
            let checkSubCondition : boolean = true;
            let checkFeatureCondition : boolean = true;
            if(items?.subRows?.length > 0 && items?.subRows != undefined){
              items?.subRows?.map((newItems:any)=>{
                  if(newItems?.Item_x0020_Type === "SubComponent"){
                    alert('You can not Restructure this item');
                    checkSubCondition = false;
                  }else if(newItems?.Item_x0020_Type === "Feature" && checkSubCondition){
                    checkSubCondition = false;
                    checkFeatureCondition = false;
                    array?.map((obj:any)=>{
                      let newChildarray: any = [];
                      let newarrays: any = [];
                      let newObj : any ;
                      if(items?.PortfolioType?.Id === obj.PortfolioType?.Id){
                        if (items?.Id !== obj.Id  && obj.Item_x0020_Type != "Task") {
                          obj.isRestructureActive = true;
                          obj.Restructuring   = obj.PortfolioType.Title == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"  : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                        } else {
                          newObj = { Title: obj.Title,TaskType:{Id:obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id} , Id: obj.Id, Item_x0020_Type: obj.Item_x0020_Type, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle};
                          newChildarray.push(newObj);
                          newarrays.push(obj);
                          setRestructuredItemarray(newarrays);
                          setCheckSubChilds(obj);
                          setRestructureChecked(newChildarray);
                          ArrayTest.push(newObj);
                          obj.isRestructureActive = false;
                        }
                      }})
                  }else{
                    if(checkSubCondition && checkFeatureCondition){
                      array?.map((obj:any)=>{
                        let newChildarray: any = [];
                        let newarrays: any = [];
                        let newObj : any ;
                        if(items?.PortfolioType?.Id === obj.PortfolioType?.Id){
                          if (items?.Id !== obj.Id && obj.Item_x0020_Type != "Task") {
                            obj.isRestructureActive = true;
                            obj.Restructuring   = obj.PortfolioType.Title == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"  : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                          }else{
                            newObj = { Title: obj.Title,TaskType:{Id:obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id}, Id: obj.Id, Item_x0020_Type: obj.Item_x0020_Type, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle };
                            newChildarray.push(newObj);
                            newarrays.push(obj);
                          setRestructuredItemarray(newarrays);
                            setCheckSubChilds(obj);
                            setRestructureChecked(newChildarray);
                            ArrayTest.push(newObj);
                            obj.isRestructureActive = false;
                          }
      
                          if(obj?.subRows?.length > 0 && obj?.subRows != undefined){
                            obj.subRows?.map((sub:any)=>{
                              if (sub.Item_x0020_Type != "Task" && sub.Item_x0020_Type != "Feature") {
                                sub.isRestructureActive = true;
                                sub.Restructuring   = sub.PortfolioType.Title == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"  : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                              }
                           })
                          }
                        }
                      })
                    }
                   }
              })
             }else{
              array?.map((obj:any)=>{
                let newChildarray: any = [];
                let newarrays: any = [];
                let newObj : any ;
                if(items?.PortfolioType?.Id === obj.PortfolioType?.Id){
                  if (items?.Id !== obj.Id && obj.Item_x0020_Type != "Task") {
                    obj.isRestructureActive = true;
                    obj.Restructuring   = obj.PortfolioType.Title == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"  : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                  }else{
                    
                   newObj = { Title: obj.Title,TaskType:{Id:obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id}, Id: obj.Id, Item_x0020_Type: obj.Item_x0020_Type, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle };
                    ArrayTest.push(newObj);
                    setCheckSubChilds(obj);
                    newarrays.push(obj);
                    setRestructuredItemarray(newarrays);
                    newChildarray.push(newObj)
                    setRestructureChecked(newChildarray);
                    obj.isRestructureActive = false;
                  }
    
                  if(obj?.subRows?.length > 0 && obj?.subRows != undefined){
                    obj.subRows?.map((sub:any)=>{
                      if (sub.Item_x0020_Type != "Task" && sub.Item_x0020_Type != "Feature") {
                        sub.isRestructureActive = true;
                        sub.Restructuring   = sub.PortfolioType.Title == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"  : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                      }
                   })
                  }
                }
              })
          }
            }else if(items?.Item_x0020_Type === "SubComponent"){
            let checkFeatureCondition : boolean = true;
            topCompo = true;
              if(items?.subRows?.length > 0 && items?.subRows != undefined){
                items?.subRows?.map((newItems:any)=>{
                  if(newItems?.Item_x0020_Type === "Feature"){
                    checkFeatureCondition = false;
                    array?.map((obj:any)=>{
                      let newChildarray: any = [];
                      let newarrays: any = [];
                      let newObj : any ;
                      if(items?.PortfolioType?.Id === obj.PortfolioType?.Id){
                        if (items?.Id !== obj.Id && obj.Item_x0020_Type != "Task" && obj.Item_x0020_Type != "SubComponent" && obj.Item_x0020_Type != "Feature") {
                          obj.isRestructureActive = true;
                          obj.Restructuring   = obj.PortfolioType.Title == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"  :  "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                        }else{
                          if (items?.Id == obj.Id && obj.Item_x0020_Type != "Task") {
                            newObj = {
                              Title: obj.Title,TaskType:{Id:obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id}, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle,
                            };
                            newarrays.push(obj);
                            setRestructuredItemarray(newarrays);
                            setCheckSubChilds(obj);
                            newChildarray.push(newObj)
                              setRestructureChecked(newChildarray);
                            ArrayTest.push(newObj);
                             obj.isRestructureActive = false;
                           }
                        }
                        if(obj?.subRows?.length > 0 && obj?.subRows != undefined){
                          obj.subRows?.map((sub:any)=>{
                            if (items?.Id == sub.Id && sub.Item_x0020_Type != "Task") {
                              newObj = {
                                Title: obj.Title,TaskType:{Id:obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id}, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle,
                                newSubChild: { Title: sub.Title,TaskType:{Id:sub.TaskType?.Id == undefined ? '' : sub.TaskType?.Id}, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIconTitle === undefined ? sub.SiteIcon : sub.SiteIconTitle,}
                              };
                              newarrays.push(obj);
                              setRestructuredItemarray(newarrays);
                              setCheckSubChilds(sub);
                              newChildarray.push(newObj.newSubChild)
                                setRestructureChecked(newChildarray);
                              ArrayTest.push(newObj);
                               obj.isRestructureActive = false;
                             }
                         })
                        }
                      }
                    })
                 }else{
                  if(checkFeatureCondition){
                    array?.map((obj:any)=>{
                      let newChildarray: any = [];
                      let newarrays: any = [];
                      let newObj : any ;
                      if(items?.PortfolioType?.Id === obj.PortfolioType?.Id){
                        if (items?.Id !== obj.Id && obj.Item_x0020_Type != "Task" && obj.Item_x0020_Type != "Feature") {
                          obj.isRestructureActive = true;
                          obj.Restructuring   = obj.PortfolioType.Title == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"  : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                        }else{
                          if(items?.Id == obj.Id){
                            newObj = {
                              Title: obj.Title,TaskType:{Id:obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id}, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle,
                            };
                            newarrays.push(obj);
                            setRestructuredItemarray(newarrays);
                            setCheckSubChilds(obj);
                            newChildarray.push(newObj)
                                setRestructureChecked(newChildarray);
                            ArrayTest.push(newObj)
                            obj.isRestructureActive = false;
                          }
                        }
                        if(obj?.subRows?.length > 0 && obj?.subRows != undefined){
                          obj.subRows?.map((sub:any)=>{
                            if (items?.Id !== sub.Id && sub.Item_x0020_Type != "Task" && sub.Item_x0020_Type != "Feature") {
                              sub.isRestructureActive = true;
                              sub.Restructuring   = sub.PortfolioType.Title == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"  : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                             }else{
                              if(items?.Id == sub.Id){
                                newObj = {
                                  Title: obj.Title,TaskType:{Id:obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id}, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle,
                                  newSubChild: { Title: sub.Title,TaskType:{Id:sub.TaskType?.Id == undefined ? '' : sub.TaskType?.Id}, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIconTitle === undefined ? sub.SiteIcon : sub.SiteIconTitle,}
                                };
                                newarrays.push(obj);
                                setRestructuredItemarray(newarrays);
                                setCheckSubChilds(sub);
                                newChildarray.push(newObj.newSubChild)
                                setRestructureChecked(newChildarray);
                                ArrayTest.push(newObj)
                                obj.isRestructureActive = false;
                                sub.isRestructureActive = false;
                              }
                             }
                         })
                        }
                      }
                    })
                  }}
                })
              }else{
                array?.map((obj:any)=>{
                  let newChildarray: any = [];
                  let newarrays: any = [];
                  let newObj : any ;
                  if(items?.PortfolioType?.Id === obj.PortfolioType?.Id){
                    if (items?.Id !== obj.Id && obj.Item_x0020_Type != "Task" && obj.Item_x0020_Type != "Feature") {
                      obj.isRestructureActive = true;
                      obj.Restructuring   = obj.PortfolioType.Title == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"  : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                    }else{
                      if(items?.Id == obj.Id){
                        newObj = {
                          Title: obj.Title,TaskType:{Id:obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id}, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon:obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle,
                        };
                        newarrays.push(obj);
                        setRestructuredItemarray(newarrays);
                        setCheckSubChilds(obj);
                        newChildarray.push(newObj)
                        setRestructureChecked(newChildarray);
                        ArrayTest.push(newObj)
                        obj.isRestructureActive = false;
                      }
                    }
                    if(obj?.subRows?.length > 0 && obj?.subRows != undefined){
                      obj.subRows?.map((sub:any)=>{
                        if (items?.Id !== sub.Id && sub.Item_x0020_Type != "Task" && sub.Item_x0020_Type != "Feature") {
                          sub.isRestructureActive = true;
                          sub.Restructuring   = sub.PortfolioType.Title == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"  : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                         }else{
                          if(items?.Id == sub.Id){
                            newObj = {
                              Title: obj.Title,TaskType:{Id:obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id}, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle,
                              newSubChild: { Title: sub.Title,TaskType:{Id:sub.TaskType?.Id == undefined ? '' : sub.TaskType?.Id}, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIconTitle === undefined ? sub.SiteIcon : sub.SiteIconTitle,}
                            };
                            newarrays.push(obj);
                            setRestructuredItemarray(newarrays);
                            setCheckSubChilds(sub);
                            newChildarray.push(newObj.newSubChild)
                    setRestructureChecked(newChildarray);
                            ArrayTest.push(newObj)
                            obj.isRestructureActive = false;
                            sub.isRestructureActive = false;
                          }
                        }
                     })
                    }
                  }
                })
             }
            }else if(items?.Item_x0020_Type === "Feature"){
              topCompo = true ;
              array?.map((obj:any)=>{
                let newChildarray: any = [];
                let newarrays: any = [];
                let newObj : any ;
                if(items?.PortfolioType?.Id === obj.PortfolioType?.Id){
                  if(obj.Item_x0020_Type != "Task" && obj.Item_x0020_Type != "Feature"){
                    obj.isRestructureActive = true;
                    obj.Restructuring   = obj.PortfolioType.Title == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"  : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                  }
                  if (items?.Id == obj.Id) {
                    newObj = {Title: obj.Title, Item_x0020_Type: obj.Item_x0020_Type,TaskType:{Id:obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id} , Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle,};
                    newChildarray.push(newObj);
                    newarrays.push(obj);
                    setRestructuredItemarray(newarrays);
                    setCheckSubChilds(obj);
                    setRestructureChecked(newChildarray);
                    ArrayTest.push(newObj)
                    obj.isRestructureActive = false;
                   }
                  if(obj?.subRows?.length > 0 && obj?.subRows != undefined){
                    obj.subRows?.map((sub:any)=>{
                      if(sub.Item_x0020_Type != "Task" && sub.Item_x0020_Type != "Feature"){
                        sub.isRestructureActive = true;
                        sub.Restructuring   = sub.PortfolioType.Title == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"  : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                      }
                      if (items?.Id == sub.Id) {
                        newObj = {Title: obj.Title,TaskType:{Id:obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id} , Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle,
                          newSubChild: {Title: sub.Title, TaskType:{Id:sub.TaskType?.Id == undefined ? '' : sub.TaskType?.Id} , Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIconTitle === undefined ? sub.SiteIcon : sub.SiteIconTitle}
                          };
                          newarrays.push(obj);
                          setRestructuredItemarray(newarrays);
                          setCheckSubChilds(sub);
                          newChildarray.push(newObj.newSubChild)
                          setRestructureChecked(newChildarray);
                           ArrayTest.push(newObj)
                           obj.isRestructureActive = false;
                           sub.isRestructureActive = false;
                       }
                      if(sub?.subRows?.length > 0 && sub?.subRows != undefined){
                        sub.subRows?.map((feature:any)=>{
                          if (items?.Id == feature.Id) {
                            newObj = {Title: obj.Title, TaskType:{Id:obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id} , Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle,
                            newSubChild: {  Title: sub.Title, TaskType:{Id:sub.TaskType?.Id == undefined ? '' : sub.TaskType?.Id} , Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIconTitle === undefined ? sub.SiteIcon : sub.SiteIconTitle,  
                            newFeatChild: { Title: feature.Title,TaskType:{Id:feature.TaskType?.Id == undefined ? '' : feature.TaskType?.Id}, Item_x0020_Type: feature.Item_x0020_Type, Id: feature.Id, siteIcon: feature.SiteIconTitle === undefined ? feature.SiteIcon : feature.SiteIconTitle,}}
                            };
                            newarrays.push(obj);
                            setRestructuredItemarray(newarrays);
                            setCheckSubChilds(feature);
                            newChildarray.push(newObj.newSubChild.newFeatChild)
                            setRestructureChecked(newChildarray);
                            ArrayTest.push(newObj)
                            sub.isRestructureActive = false;
                           }
                        })
                      } 
                   })
                  }
                }
              })
           }else if(items?.Item_x0020_Type === "Task" && (items.TaskType?.Id === 1)){
            array?.map((obj:any)=>{
              let newChildarray: any = [];
              let newarrays: any = [];
              let newObj : any ;
              if(items?.PortfolioType?.Id === obj.PortfolioType?.Id){
                if(obj.TaskType?.Id !== 2){
                  let checkchild:any=0;
                  if(items.subRows != undefined){
                    items.subRows.map((items:any)=>{
                      
                      let checkTrue : any = false;
                      if(items.TaskType?.Id === 3){
                          checkchild = 3;
                          checkTrue = true;
                      }
                      
                      if(items.TaskType?.Id === 2 && !checkTrue){
                        checkchild = 2;
                      }})
                  }

                  if(checkchild == 3){
                        if(obj.Item_x0020_Type !== "Task"){
                          obj.isRestructureActive = true;
                          obj.Restructuring   =obj.PortfolioType.Title == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"  : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                        }
                  }else if(checkchild == 2){
                    if(obj.TaskType?.Id !== 3){
                      obj.isRestructureActive = true;
                      obj.Restructuring   =obj.PortfolioType.Title == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"  : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                    }
                  }else{
                    obj.isRestructureActive = true;
                    obj.Restructuring   = obj.PortfolioType.Title == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"  : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                  }
                  
                  
                }
                if (items?.Id == obj.Id) {
                  newObj = {Title: obj.Title, TaskType:{Id:obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id} , Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle,};
                  newChildarray.push(newObj);
                  newarrays.push(obj);
                  setRestructuredItemarray(newarrays);
                  setCheckSubChilds(obj);
                  setRestructureChecked(newChildarray);
                  ArrayTest.push(newObj)
                  obj.isRestructureActive = false;
                 }
                 if ((obj.TaskType?.Id == 1 || obj.TaskType?.Id == 3) && obj?.siteType !== items?.siteType) {
                  obj.isRestructureActive = false;
                }
                if(obj?.subRows?.length > 0 && obj?.subRows != undefined){
                  obj.subRows?.map((sub:any)=>{
                    if(sub.TaskType?.Id !== 2){
                      let checkchild:any=0;
                      if(items.subRows != undefined){
                        items.subRows.map((items:any)=>{
                          
                          let checkTrue : any = false;
                          if(items.TaskType?.Id === 3){
                              checkchild = 3;
                              checkTrue = true;
                          }
                          
                          if(items.TaskType?.Id === 2 && !checkTrue){
                            checkchild = 2;
                          }})
                      }
    
                      if(checkchild == 3){
                            if(sub.Item_x0020_Type !== "Task"){
                              sub.isRestructureActive = true;
                              sub.Restructuring   = sub.PortfolioType.Title == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"  : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                            }
                      }else if(checkchild == 2){
                        if(sub.TaskType?.Id !== 3){
                          sub.isRestructureActive = true;
                          sub.Restructuring   = sub.PortfolioType.Title == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"  : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                        }
                      }else{
                        sub.isRestructureActive = true;
                        sub.Restructuring   = sub.PortfolioType.Title == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"  : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                      }
                    }
                    if (items?.Id == obj.Id) {
                      sub.isRestructureActive = false;
                    }
                    if (items?.Id == sub.Id) {
                      newObj = {Title: obj.Title, TaskType:{Id:obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id}, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle,
                        newSubChild: {Title: sub.Title, TaskType:{Id:sub.TaskType?.Id == undefined ? '' : sub.TaskType?.Id}, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIconTitle === undefined ? sub.SiteIcon : sub.SiteIconTitle}
                        };
                        newarrays.push(obj);
                        setRestructuredItemarray(newarrays);
                        setCheckSubChilds(sub);
                        newChildarray.push(newObj.newSubChild)
                        setRestructureChecked(newChildarray);
                         ArrayTest.push(newObj);
                         obj.isRestructureActive = false;
                         sub.isRestructureActive = false;
                     } 
                     if ((sub.TaskType?.Id == 1 || sub.TaskType?.Id == 3) && sub?.siteType !== items?.siteType) {
                      sub.isRestructureActive = false;
                     }

                    if(sub?.subRows?.length > 0 && sub?.subRows != undefined){
                      sub.subRows?.map((feature:any)=>{
                        if(feature.TaskType?.Id !== 2){
                          let checkchild:any=0;
                      if(items.subRows != undefined){
                        items.subRows.map((items:any)=>{
                          
                          let checkTrue : any = false;
                          if(items.TaskType?.Id === 3){
                              checkchild = 3;
                              checkTrue = true;
                          }
                          
                          if(items.TaskType?.Id === 2 && !checkTrue){
                            checkchild = 2;
                          }})
                      }
    
                      if(checkchild == 3){
                            if(feature.Item_x0020_Type !== "Task"){
                              feature.isRestructureActive = true;
                              feature.Restructuring   = feature.PortfolioType.Title == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"  : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                            }
                      }else if(checkchild == 2){
                        if(feature.TaskType?.Id !== 3){
                          feature.isRestructureActive = true;
                          feature.Restructuring   = feature.PortfolioType.Title == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"  : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                        }
                      }else{
                        feature.isRestructureActive = true;
                        feature.Restructuring   = feature.PortfolioType.Title == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"  : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                      }
                       
                        }
                        if (items?.Id == sub.Id) {
                          feature.isRestructureActive = false;
                        }
                        if (items?.Id == feature.Id) {
                          newObj = {Title: obj.Title, TaskType:{Id:obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id}, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle,
                          newSubChild: {  Title: sub.Title,TaskType:{Id:sub.TaskType?.Id == undefined ? '' : sub.TaskType?.Id},  Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIconTitle === undefined ? sub.SiteIcon : sub.SiteIconTitle,  
                          newFeatChild: { Title: feature.Title, TaskType:{Id:feature.TaskType?.Id == undefined ? '' : feature.TaskType?.Id}, Item_x0020_Type: feature.Item_x0020_Type, Id: feature.Id, siteIcon: feature.SiteIconTitle === undefined ? feature.SiteIcon : feature.SiteIconTitle,}}
                          };
                          newarrays.push(obj);
                          setRestructuredItemarray(newarrays);
                          setCheckSubChilds(feature);
                          newChildarray.push(newObj.newSubChild.newFeatChild)
                          setRestructureChecked(newChildarray);
                          ArrayTest.push(newObj)
                          feature.isRestructureActive = false;
                          sub.isRestructureActive = false;
                         }
                        if ((feature.TaskType?.Id == 1 || feature.TaskType?.Id == 3) && feature?.siteType !== items?.siteType) {
                          feature.isRestructureActive = false;
                         }
                         if(feature?.subRows?.length > 0 && feature?.subRows != undefined){
                          feature.subRows?.map((activity:any)=>{
                            if(activity.TaskType?.Id !== 2){
                              let checkchild:any=0;
                              if(items.subRows != undefined){
                                items.subRows.map((items:any)=>{
                                  
                                  let checkTrue : any = false;
                                  if(items.TaskType?.Id === 3){
                                      checkchild = 3;
                                      checkTrue = true;
                                  }
                                  
                                  if(items.TaskType?.Id === 2 && !checkTrue){
                                    checkchild = 2;
                                  }})
                              }
            
                              if(checkchild == 3){
                                    if(activity.Item_x0020_Type !== "Task"){
                                      activity.isRestructureActive = true;
                                      activity.Restructuring   = activity.PortfolioType.Title == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"  : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                                    }
                              }else if(checkchild == 2){
                                if(activity.TaskType?.Id !== 3){
                                  activity.isRestructureActive = true;
                                  activity.Restructuring   = activity.PortfolioType.Title == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"  :  "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                                }
                              }else{
                                activity.isRestructureActive = true;
                                activity.Restructuring   = activity.PortfolioType.Title == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"  : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                              }
                              
                            }
                            if (items?.Id == feature.Id) {
                              activity.isRestructureActive = false;
                            }
                            if (items?.Id == activity.Id) {
                              newObj = {Title: obj.Title, TaskType:{Id:obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id}, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle,
                              newSubChild: {  Title: sub.Title, TaskType:{Id:sub.TaskType?.Id == undefined ? '' : sub.TaskType?.Id}, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIconTitle === undefined ? sub.SiteIcon : sub.SiteIconTitle,  
                              newFeatChild: { Title: feature.Title, TaskType:{Id:feature.TaskType?.Id == undefined ? '' : feature.TaskType?.Id}, Item_x0020_Type: feature.Item_x0020_Type, Id: feature.Id, siteIcon: feature.SiteIconTitle === undefined ? feature.SiteIcon : feature.SiteIconTitle,
                              newActChild:{Title: activity.Title, TaskType:{Id:activity.TaskType?.Id == undefined ? '' : activity.TaskType?.Id}, Item_x0020_Type: activity.Item_x0020_Type, Id: activity.Id, siteIcon: activity.SiteIconTitle === undefined ? activity.SiteIcon : activity.SiteIconTitle,}}}
                              };
                              newarrays.push(obj);
                              setRestructuredItemarray(newarrays);
                              setCheckSubChilds(activity);
                              newChildarray.push(newObj.newSubChild.newFeatChild.newActChild);
                              setRestructureChecked(newChildarray);
                              ArrayTest.push(newObj);
                              activity.isRestructureActive = false;
                              feature.isRestructureActive = false;
                             }
                            if ((activity.TaskType?.Id == 1 || activity.TaskType?.Id == 3) && activity?.siteType !== items?.siteType) {
                              activity.isRestructureActive = false;
                             }

                             if(activity?.subRows?.length > 0 && activity?.subRows != undefined){
                              activity.subRows?.map((wrkstrm:any)=>{
                                if(wrkstrm.TaskType?.Id !== 2){
                                  let checkchild:any=0;
                              if(items.subRows != undefined){
                                items.subRows.map((items:any)=>{
                                  
                                  let checkTrue : any = false;
                                  if(items.TaskType?.Id === 3){
                                      checkchild = 3;
                                      checkTrue = true;
                                  }
                                  
                                  if(items.TaskType?.Id === 2 && !checkTrue){
                                    checkchild = 2;
                                  }})
                              }
            
                              if(checkchild == 3){
                                    if(wrkstrm.Item_x0020_Type !== "Task"){
                                      wrkstrm.isRestructureActive = true;
                                      wrkstrm.Restructuring   = wrkstrm.PortfolioType.Title == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"  : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                                    }
                              }else if(checkchild == 2){
                                if(wrkstrm.TaskType?.Id !== 3){
                                  wrkstrm.isRestructureActive = true;
                                  wrkstrm.Restructuring   = wrkstrm.PortfolioType.Title == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"  : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                                }
                              }else{
                                wrkstrm.isRestructureActive = true;
                                  wrkstrm.Restructuring   = wrkstrm.PortfolioType.Title == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"  : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                              }
                                  
                                }
                                if (items?.Id == activity.Id) {
                                  wrkstrm.isRestructureActive = false;
                                }
                                if (items?.Id == wrkstrm.Id) {
                                  newObj = {Title: obj.Title, TaskType:{Id:obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id}, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle,
                                  newSubChild: {  Title: sub.Title, TaskType:{Id:sub.TaskType?.Id == undefined ? '' : sub.TaskType?.Id}, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIconTitle === undefined ? sub.SiteIcon : sub.SiteIconTitle,  
                                  newFeatChild: { Title: feature.Title, TaskType:{Id:feature.TaskType?.Id == undefined ? '' : feature.TaskType?.Id}, Item_x0020_Type: feature.Item_x0020_Type, Id: feature.Id, siteIcon: feature.SiteIconTitle === undefined ? feature.SiteIcon : feature.SiteIconTitle,
                                  newActChild:{Title: activity.Title, TaskType:{Id:activity.TaskType?.Id == undefined ? '' : activity.TaskType?.Id}, Item_x0020_Type: activity.Item_x0020_Type, Id: activity.Id, siteIcon: activity.SiteIconTitle === undefined ? activity.SiteIcon : activity.SiteIconTitle,
                                  newWrkChild:{Title: wrkstrm.Title, TaskType:{Id:wrkstrm.TaskType?.Id == undefined ? '' : wrkstrm.TaskType?.Id}, Item_x0020_Type: wrkstrm.Item_x0020_Type, Id: wrkstrm.Id, siteIcon: wrkstrm.SiteIconTitle === undefined ? wrkstrm.SiteIcon : wrkstrm.SiteIconTitle,}}}}
                                  };
                                  newarrays.push(obj);
                                  setRestructuredItemarray(newarrays);
                                  setCheckSubChilds(wrkstrm);
                                  newChildarray.push(newObj.newSubChild.newFeatChild.newActChild.newWrkChild);
                                  setRestructureChecked(newChildarray);
                                  ArrayTest.push(newObj);
                                  activity.isRestructureActive = false;
                                  wrkstrm.isRestructureActive = false;
                                 }
                                if ((wrkstrm.TaskType?.Id == 1 || wrkstrm.TaskType?.Id == 3) && wrkstrm?.siteType !== items?.siteType) {
                                  wrkstrm.isRestructureActive = false;
                                 }
                              }
                              )}

                          })
                        }

                      })
                    } 
                 })
                }
              }
            })
           }else if(items?.Item_x0020_Type === "Task" && (items.TaskType?.Id === 3)){
            array?.map((obj:any)=>{
              let newChildarray: any = [];
              let newarrays: any = [];
              let newObj : any ;
              if(items?.PortfolioType?.Id === obj.PortfolioType?.Id){
                if(obj.TaskType?.Id !== 2){
                  if(items.subRows != undefined && items.subRows.length > 0){
                    if(obj.TaskType?.Id !== 3){
                      obj.isRestructureActive = true;
                      obj.Restructuring   = obj.PortfolioType.Title == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"  : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                    }
                  }else{
                    obj.isRestructureActive = true;
                    obj.Restructuring   = obj.PortfolioType.Title == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"  : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                  }
                  
                }
                if (items?.Id == obj.Id) {
                  newObj = {Title: obj.Title, TaskType:{Id:obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id} , Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle,};
                  newChildarray.push(newObj);
                  newarrays.push(obj);
                  setRestructuredItemarray(newarrays);
                  setCheckSubChilds(obj);
                  setRestructureChecked(newChildarray);
                  ArrayTest.push(newObj)
                  obj.isRestructureActive = false;
                 }
                 if ((obj.TaskType?.Id == 1 || obj.TaskType?.Id == 3) && obj?.siteType !== items?.siteType) {
                  obj.isRestructureActive = false;
                }
                if(obj?.subRows?.length > 0 && obj?.subRows != undefined){
                  obj.subRows?.map((sub:any)=>{
                    if(sub.TaskType?.Id !== 2){
                      if(items.subRows != undefined && items.subRows.length > 0){
                        if(sub.TaskType?.Id !== 3){
                          sub.isRestructureActive = true;
                          sub.Restructuring   = sub.PortfolioType.Title == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"  : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                        }
                      } else{
                        sub.isRestructureActive = true;
                        sub.Restructuring   = sub.PortfolioType.Title == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"  : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                      }
                    }
                    if (items?.Id == obj.Id) {
                      sub.isRestructureActive = false;
                    }
                    if (items?.Id == sub.Id) {
                      newObj = {Title: obj.Title, TaskType:{Id:obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id}, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle,
                        newSubChild: {Title: sub.Title, TaskType:{Id:sub.TaskType?.Id == undefined ? '' : sub.TaskType?.Id}, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIconTitle === undefined ? sub.SiteIcon : sub.SiteIconTitle}
                        };
                        newarrays.push(obj);
                        setRestructuredItemarray(newarrays);
                        setCheckSubChilds(sub);
                        newChildarray.push(newObj.newSubChild)
                        setRestructureChecked(newChildarray);
                         ArrayTest.push(newObj);
                         if(items.subRows.length > 0){
                          obj.isRestructureActive = false;
                         }
                         sub.isRestructureActive = false;
                     } 
                     if ((sub.TaskType?.Id == 1 || sub.TaskType?.Id == 3) && sub?.siteType !== items?.siteType) {
                      sub.isRestructureActive = false;
                     }

                    if(sub?.subRows?.length > 0 && sub?.subRows != undefined){
                      sub.subRows?.map((feature:any)=>{
                        if(feature.TaskType?.Id !== 2){
                      if(items.subRows != undefined && items.subRows.length > 0){
                        if(feature.TaskType?.Id !== 3){
                          feature.isRestructureActive = true;
                          feature.Restructuring   = feature.PortfolioType.Title == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"  : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                        }
                      }else{
                        feature.isRestructureActive = true;
                        feature.Restructuring   = feature.PortfolioType.Title == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"  : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                      }
                      
                    }
                        if (items?.Id == sub.Id) {
                          feature.isRestructureActive = false;
                        }
                        if (items?.Id == feature.Id) {
                          newObj = {Title: obj.Title, TaskType:{Id:obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id}, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle,
                          newSubChild: {  Title: sub.Title,TaskType:{Id:sub.TaskType?.Id == undefined ? '' : sub.TaskType?.Id},  Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIconTitle === undefined ? sub.SiteIcon : sub.SiteIconTitle,  
                          newFeatChild: { Title: feature.Title, TaskType:{Id:feature.TaskType?.Id == undefined ? '' : feature.TaskType?.Id}, Item_x0020_Type: feature.Item_x0020_Type, Id: feature.Id, siteIcon: feature.SiteIconTitle === undefined ? feature.SiteIcon : feature.SiteIconTitle,}}
                          };
                          newarrays.push(obj);
                          setRestructuredItemarray(newarrays);
                          setCheckSubChilds(feature);
                          newChildarray.push(newObj.newSubChild.newFeatChild)
                          setRestructureChecked(newChildarray);
                          ArrayTest.push(newObj);
                          if(items.subRows.length > 0){
                            sub.isRestructureActive = false;
                        
                           }
                           feature.isRestructureActive = false;
                         }
                        if ((feature.TaskType?.Id == 1 || feature.TaskType?.Id == 3) && feature?.siteType !== items?.siteType) {
                          feature.isRestructureActive = false;
                         }
                         if(feature?.subRows?.length > 0 && feature?.subRows != undefined){
                          feature.subRows?.map((activity:any)=>{
                            if(activity.TaskType?.Id !== 2){
                              if(items.subRows != undefined && items.subRows.length > 0){
                                if(activity.TaskType?.Id !== 3){
                                  activity.isRestructureActive = true;
                                  activity.Restructuring   = activity.PortfolioType.Title == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"  : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                                }
                              }else{
                                activity.isRestructureActive = true;
                                activity.Restructuring   = activity.PortfolioType.Title == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"  : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                              }
                              
                             
                            }
                            if (items?.Id == feature.Id) {
                              activity.isRestructureActive = false;
                            }
                            if (items?.Id == activity.Id) {
                              newObj = {Title: obj.Title, TaskType:{Id:obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id}, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle,
                              newSubChild: {  Title: sub.Title, TaskType:{Id:sub.TaskType?.Id == undefined ? '' : sub.TaskType?.Id}, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIconTitle === undefined ? sub.SiteIcon : sub.SiteIconTitle,  
                              newFeatChild: { Title: feature.Title, TaskType:{Id:feature.TaskType?.Id == undefined ? '' : feature.TaskType?.Id}, Item_x0020_Type: feature.Item_x0020_Type, Id: feature.Id, siteIcon: feature.SiteIconTitle === undefined ? feature.SiteIcon : feature.SiteIconTitle,
                              newActChild:{Title: activity.Title, TaskType:{Id:activity.TaskType?.Id == undefined ? '' : activity.TaskType?.Id}, Item_x0020_Type: activity.Item_x0020_Type, Id: activity.Id, siteIcon: activity.SiteIconTitle === undefined ? activity.SiteIcon : activity.SiteIconTitle,}}}
                              };
                              newarrays.push(obj);
                              setRestructuredItemarray(newarrays);
                              setCheckSubChilds(activity);
                              newChildarray.push(newObj.newSubChild.newFeatChild.newActChild);
                              setRestructureChecked(newChildarray);
                              ArrayTest.push(newObj);
                              if(items.subRows.length > 0){
                                feature.isRestructureActive = false;
                               }
                              activity.isRestructureActive = false;
                              
                             }
                            if ((activity.TaskType?.Id == 1 || activity.TaskType?.Id == 3) && activity?.siteType !== items?.siteType) {
                              activity.isRestructureActive = false;
                             }

                             if(activity?.subRows?.length > 0 && activity?.subRows != undefined){
                              activity.subRows?.map((wrkstrm:any)=>{
                                if(wrkstrm.TaskType?.Id !== 2){
                                  if(items.subRows != undefined && items.subRows.length > 0){
                                    if(wrkstrm.TaskType?.Id !== 3){
                                      wrkstrm.isRestructureActive = true;
                                      wrkstrm.Restructuring   = wrkstrm.PortfolioType.Title == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"  : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                                    }
                                  }else{
                                    wrkstrm.isRestructureActive = true;
                                    wrkstrm.Restructuring   = wrkstrm.PortfolioType.Title == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"  : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                                  }
                                  
                                }
                                if (items?.Id == activity.Id) {
                                  wrkstrm.isRestructureActive = false;
                                }
                                if (items?.Id == wrkstrm.Id) {
                                  newObj = {Title: obj.Title, TaskType:{Id:obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id}, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle,
                                  newSubChild: {  Title: sub.Title, TaskType:{Id:sub.TaskType?.Id == undefined ? '' : sub.TaskType?.Id}, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIconTitle === undefined ? sub.SiteIcon : sub.SiteIconTitle,  
                                  newFeatChild: { Title: feature.Title, TaskType:{Id:feature.TaskType?.Id == undefined ? '' : feature.TaskType?.Id}, Item_x0020_Type: feature.Item_x0020_Type, Id: feature.Id, siteIcon: feature.SiteIconTitle === undefined ? feature.SiteIcon : feature.SiteIconTitle,
                                  newActChild:{Title: activity.Title, TaskType:{Id:activity.TaskType?.Id == undefined ? '' : activity.TaskType?.Id}, Item_x0020_Type: activity.Item_x0020_Type, Id: activity.Id, siteIcon: activity.SiteIconTitle === undefined ? activity.SiteIcon : activity.SiteIconTitle,
                                  newWrkChild:{Title: wrkstrm.Title, TaskType:{Id:wrkstrm.TaskType?.Id == undefined ? '' : wrkstrm.TaskType?.Id}, Item_x0020_Type: wrkstrm.Item_x0020_Type, Id: wrkstrm.Id, siteIcon: wrkstrm.SiteIconTitle === undefined ? wrkstrm.SiteIcon : wrkstrm.SiteIconTitle,}}}}
                                  };
                                  newarrays.push(obj);
                                  setRestructuredItemarray(newarrays);
                                  setCheckSubChilds(wrkstrm);
                                  newChildarray.push(newObj.newSubChild.newFeatChild.newActChild.newWrkChild);
                                  setRestructureChecked(newChildarray);
                                  ArrayTest.push(newObj);
                                  if(items.subRows.length > 0){
                                    activity.isRestructureActive = false;
                                   }
                                  
                                  wrkstrm.isRestructureActive = false;
                                 }
                                if ((wrkstrm.TaskType?.Id == 1 || wrkstrm.TaskType?.Id == 3) && wrkstrm?.siteType !== items?.siteType) {
                                  wrkstrm.isRestructureActive = false;
                                 }
                              }
                              )}

                          })
                        }

                      })
                    } 
                 })
                }
              }
            })
           }else if(items?.Item_x0020_Type === "Task" && items.TaskType?.Id === 2){
            array?.map((obj:any)=>{
              let newChildarray: any = [];
              let newarrays: any = [];
              let newObj : any ;
              if(items?.PortfolioType?.Id === obj.PortfolioType?.Id){
                if(obj.TaskType?.Id !== 2){
                  obj.isRestructureActive = true;
                  obj.Restructuring   = obj.PortfolioType.Title == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"  : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                }
                if (items?.Id == obj.Id) {
                  newObj = {Title: obj.Title, TaskType:{Id:obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id}, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle,};
                  newChildarray.push(newObj);
                  newarrays.push(obj);
                  setRestructuredItemarray(newarrays);
                  setCheckSubChilds(obj);
                  setRestructureChecked(newChildarray);
                  ArrayTest.push(newObj)
                  obj.isRestructureActive = false;
                 }
                 if ((obj.TaskType?.Id == 1 || obj.TaskType?.Id == 3) && obj?.siteType !== items?.siteType) {
                  obj.isRestructureActive = false;
                }
                if(obj?.subRows?.length > 0 && obj?.subRows != undefined){
                  obj.subRows?.map((sub:any)=>{
                    if(sub.TaskType?.Id !== 2){
                      sub.isRestructureActive = true;
                      sub.Restructuring   = sub.PortfolioType.Title == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"  : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                    }
                    if (items?.Id == sub.Id) {
                      newObj = {Title: obj.Title, TaskType:{Id:obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id}, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle,
                        newSubChild: {Title: sub.Title, TaskType:{Id:sub.TaskType?.Id == undefined ? '' : sub.TaskType?.Id}, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIconTitle === undefined ? sub.SiteIcon : sub.SiteIconTitle}
                        };
                        setCheckSubChilds(sub);
                        newarrays.push(obj);
                        setRestructuredItemarray(newarrays);
                        newChildarray.push(newObj.newSubChild);
                        setRestructureChecked(newChildarray);
                         ArrayTest.push(newObj);
                         sub.isRestructureActive = false;
                         if(obj.TaskType?.Id === 3){
                          obj.isRestructureActive = false;
                         }
                     } 
                     if ((sub.TaskType?.Id == 1 || sub.TaskType?.Id == 3) && sub?.siteType !== items?.siteType) {
                      sub.isRestructureActive = false;
                     }

                    if(sub?.subRows?.length > 0 && sub?.subRows != undefined){
                      sub.subRows?.map((feature:any)=>{
                        if(feature.TaskType?.Id !== 2){
                          feature.isRestructureActive = true;
                          feature.Restructuring   = feature.PortfolioType.Title == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"  : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                        }
                        if (items?.Id == feature.Id) {
                          newObj = {Title: obj.Title, TaskType:{Id:obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id}, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle,
                          newSubChild: {  Title: sub.Title, TaskType:{Id:sub.TaskType?.Id == undefined ? '' : sub.TaskType?.Id}, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIconTitle === undefined ? sub.SiteIcon : sub.SiteIconTitle,  
                          newFeatChild: { Title: feature.Title, TaskType:{Id:feature.TaskType?.Id == undefined ? '' : feature.TaskType?.Id}, Item_x0020_Type: feature.Item_x0020_Type, Id: feature.Id, siteIcon: feature.SiteIconTitle === undefined ? feature.SiteIcon : feature.SiteIconTitle,}}
                          };
                          setCheckSubChilds(feature);
                          newarrays.push(obj);
                          setRestructuredItemarray(newarrays);
                          newChildarray.push(newObj.newSubChild.newFeatChild)
                          setRestructureChecked(newChildarray);
                          ArrayTest.push(newObj);
                          feature.isRestructureActive = false;
                          if(sub.TaskType?.Id === 3){
                            sub.isRestructureActive = false;
                           }
                         }
                        if ((feature.TaskType?.Id == 1 || feature.TaskType?.Id == 3) && feature?.siteType !== items?.siteType) {
                          feature.isRestructureActive = false;
                         }
                         if(feature?.subRows?.length > 0 && feature?.subRows != undefined){
                          feature.subRows?.map((activity:any)=>{
                            if(activity.TaskType?.Id !== 2){
                              activity.isRestructureActive = true;
                              activity.Restructuring   = activity.PortfolioType.Title == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"  : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                            }
                            if (items?.Id == activity.Id) {
                              newObj = {Title: obj.Title, TaskType:{Id:obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id}, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle,
                              newSubChild: {  Title: sub.Title,TaskType:{Id:sub.TaskType?.Id == undefined ? '' : sub.TaskType?.Id}, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIconTitle === undefined ? sub.SiteIcon : sub.SiteIconTitle,  
                              newFeatChild: { Title: feature.Title, TaskType:{Id:feature.TaskType?.Id == undefined ? '' : feature.TaskType?.Id}, Item_x0020_Type: feature.Item_x0020_Type, Id: feature.Id, siteIcon: feature.SiteIconTitle === undefined ? feature.SiteIcon : feature.SiteIconTitle,
                              newActChild:{Title: activity.Title, TaskType:{Id:activity.TaskType?.Id == undefined ? '' : activity.TaskType?.Id},  Item_x0020_Type: activity.Item_x0020_Type, Id: activity.Id, siteIcon: activity.SiteIconTitle === undefined ? activity.SiteIcon : activity.SiteIconTitle,}}}
                              };
                              newarrays.push(obj);
                              setRestructuredItemarray(newarrays);
                              setCheckSubChilds(activity);
                              newChildarray.push(newObj.newSubChild.newFeatChild.newActChild);
                              setRestructureChecked(newChildarray);
                              ArrayTest.push(newObj);
                              activity.isRestructureActive = false;
                              if(feature.TaskType?.Id === 3){
                                feature.isRestructureActive = false;
                               }
                             }
                            if ((activity.TaskType?.Id == 1 || activity.TaskType?.Id == 3) && activity?.siteType !== items?.siteType) {
                              activity.isRestructureActive = false;
                             }

                             if(activity?.subRows?.length > 0 && activity?.subRows != undefined){
                              activity.subRows?.map((wrkstrm:any)=>{
                                if(wrkstrm.TaskType?.Id !== 2){
                                  wrkstrm.isRestructureActive = true;
                                  wrkstrm.Restructuring   = wrkstrm.PortfolioType.Title == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"  : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                                }
                                if (items?.Id == wrkstrm.Id) {
                                  newObj = {Title: obj.Title, TaskType:{Id:obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id} , Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle,
                                  newSubChild: {  Title: sub.Title, TaskType:{Id:sub.TaskType?.Id == undefined ? '' : sub.TaskType?.Id} , Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIconTitle === undefined ? sub.SiteIcon : sub.SiteIconTitle,  
                                  newFeatChild: { Title: feature.Title, TaskType:{Id:feature.TaskType?.Id == undefined ? '' : feature.TaskType?.Id} , Item_x0020_Type: feature.Item_x0020_Type, Id: feature.Id, siteIcon: feature.SiteIconTitle === undefined ? feature.SiteIcon : feature.SiteIconTitle,
                                  newActChild:{Title: activity.Title, TaskType:{Id:activity.TaskType?.Id == undefined ? '' : activity.TaskType?.Id} , Item_x0020_Type: activity.Item_x0020_Type, Id: activity.Id, siteIcon: activity.SiteIconTitle === undefined ? activity.SiteIcon : activity.SiteIconTitle,
                                  newWrkChild:{Title: wrkstrm.Title, TaskType:{Id:wrkstrm.TaskType?.Id == undefined ? '' : wrkstrm.TaskType?.Id} , Item_x0020_Type: wrkstrm.Item_x0020_Type, Id: wrkstrm.Id, siteIcon: wrkstrm.SiteIconTitle === undefined ? wrkstrm.SiteIcon : wrkstrm.SiteIconTitle,}}}}
                                  };
                                  newarrays.push(obj);
                                  setRestructuredItemarray(newarrays);
                                  setCheckSubChilds(wrkstrm);
                                  newChildarray.push(newObj.newSubChild.newFeatChild.newActChild.newWrkChild);
                                  setRestructureChecked(newChildarray);
                                  ArrayTest.push(newObj);
                                  wrkstrm.isRestructureActive = false;
                                  if(wrkstrm.TaskType?.Id === 3){
                                    wrkstrm.isRestructureActive = false;
                                   }
                                 }
                                if ((wrkstrm.TaskType?.Id == 1 || wrkstrm.TaskType?.Id == 3) && wrkstrm?.siteType !== items?.siteType) {
                                  wrkstrm.isRestructureActive = false;
                                }
                                 if(wrkstrm?.subRows?.length > 0 && wrkstrm?.subRows != undefined){
                                  wrkstrm.subRows?.map((task:any)=>{
                                    if(task.TaskType?.Id !== 2){
                                      task.isRestructureActive = true;
                                      task.Restructuring   = task.PortfolioType.Title == "Component" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"  : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
                                    }
                                    if (items?.Id == task.Id) {
                                      newObj = {Title: obj.Title, TaskType:{Id:obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id} , Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle,
                                      newSubChild: {  Title: sub.Title, TaskType:{Id:sub.TaskType?.Id == undefined ? '' : sub.TaskType?.Id} , Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIconTitle === undefined ? sub.SiteIcon : sub.SiteIconTitle,  
                                      newFeatChild: { Title: feature.Title, TaskType:{Id:feature.TaskType?.Id == undefined ? '' : feature.TaskType?.Id} , Item_x0020_Type: feature.Item_x0020_Type, Id: feature.Id, siteIcon: feature.SiteIconTitle === undefined ? feature.SiteIcon : feature.SiteIconTitle,
                                      newActChild:{Title: activity.Title, TaskType:{Id:activity.TaskType?.Id == undefined ? '' : activity.TaskType?.Id} , Item_x0020_Type: activity.Item_x0020_Type, Id: activity.Id, siteIcon: activity.SiteIconTitle === undefined ? activity.SiteIcon : activity.SiteIconTitle,
                                      newWrkChild:{Title: wrkstrm.Title, TaskType:{Id:wrkstrm.TaskType?.Id == undefined ? '' : wrkstrm.TaskType?.Id} , Item_x0020_Type: wrkstrm.Item_x0020_Type, Id: wrkstrm.Id, siteIcon: wrkstrm.SiteIconTitle === undefined ? wrkstrm.SiteIcon : wrkstrm.SiteIconTitle,
                                      newTskChild:{Title: task.Title, TaskType:{Id:task.TaskType?.Id == undefined ? '' : task.TaskType?.Id} , Item_x0020_Type: task.Item_x0020_Type, Id: task.Id, siteIcon: task.SiteIconTitle === undefined ? task.SiteIcon : task.SiteIconTitle}}}}}
                                      };
                                      newarrays.push(obj);
                                      setRestructuredItemarray(newarrays);
                                      setCheckSubChilds(task);
                                      newChildarray.push(newObj.newSubChild.newFeatChild.newActChild.newWrkChild.newTskChild);
                                      setRestructureChecked(newChildarray);
                                      ArrayTest.push(newObj);
                                      task.isRestructureActive = false;
                                      if(wrkstrm.TaskType?.Id === 3){
                                        wrkstrm.isRestructureActive = false;
                                       }
                                     }
                                    if ((task.TaskType?.Id == 1 || task.TaskType?.Id == 3) && task?.siteType !== items?.siteType) {
                                      task.isRestructureActive = false;
                                     }
    
                                  }
                                  )}
                              }
                              )}

                          })
                        }

                      })
                    } 
                 })
                }
              }
            })
           }
    }else{
      alert('You can not Restructure this item because item type is different');
      alertNotify = false
    }
    })
    setCheckItemLength(true);
     setOldArrayBackup(ArrayTest);
     restructureCallBack(array,topCompo);
  }}

  console.log(ref);

  const  OpenModal = (item: any) => {
    setNewItemBackUp(item);
    let array = allData;
    var TestArray: any = [];
 
    array.forEach((obj:any) => {
      let object: any = {};
      if (obj.Shareweb_x0020_ID === item.Shareweb_x0020_ID && obj.Id === item.Id) {
        object = { Title: obj.Title, Id: obj.Id, TaskType:{Id:obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id} , Item_x0020_Type: obj.Item_x0020_Type,  siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle }
        TestArray.push(object);
      }
      if (obj.subRows != undefined && obj.subRows.length > 0) {
        obj.subRows.forEach((sub: any) => {
          if (sub.Shareweb_x0020_ID === item.Shareweb_x0020_ID && sub.Id === item.Id) {
            object = {Title: obj.Title, TaskType:{Id:obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id} , Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle,
            newSubChild: { Title: sub.Title, TaskType:{Id:sub.TaskType?.Id == undefined ? '' : sub.TaskType?.Id} , Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIconTitle === undefined ? sub.SiteIcon : sub.SiteIconTitle }
            }
            TestArray.push(object)
          }
          if (sub.subRows != undefined && sub.subRows.length > 0) {
            sub.subRows.forEach((newsub: any) => {
              if (newsub.Shareweb_x0020_ID === item.Shareweb_x0020_ID && newsub.Id === item.Id) {
                object = {Title: obj.Title, TaskType:{Id:obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id} , Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle,
                  newSubChild: {Title: sub.Title, TaskType:{Id:sub.TaskType?.Id == undefined ? '' : sub.TaskType?.Id} , Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIconTitle === undefined ? sub.SiteIcon : sub.SiteIconTitle,
                  newFeatChild: { Title: newsub.Title, TaskType:{Id:newsub.TaskType?.Id == undefined ? '' : newsub.TaskType?.Id} , Item_x0020_Type: newsub.Item_x0020_Type, Id: newsub.Id, siteIcon: newsub.SiteIconTitle === undefined ? newsub.SiteIcon : newsub.SiteIconTitle }
                  }
                }
                TestArray.push(object)
              }
              if (newsub.subRows != undefined && newsub.subRows.length > 0) {
                newsub.subRows.forEach((activity: any) => {
                  if (activity.Shareweb_x0020_ID === item.Shareweb_x0020_ID && activity.Id === item.Id) {
                    object = {Title: obj.Title, TaskType:{Id:obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id} , Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle,
                    newSubChild: {Title: sub.Title, TaskType:{Id:sub.TaskType?.Id == undefined ? '' : sub.TaskType?.Id} , Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIconTitle === undefined ? sub.SiteIcon : sub.SiteIconTitle,
                    newFeatChild: {Title: newsub.Title, TaskType:{Id:newsub.TaskType?.Id == undefined ? '' : newsub.TaskType?.Id} , Item_x0020_Type: newsub.Item_x0020_Type, Id: newsub.Id, siteIcon: newsub.SiteIconTitle === undefined ? newsub.SiteIcon : newsub.SiteIconTitle,
                    newActChild: { Title: activity.Title, TaskType:{Id:activity.TaskType?.Id == undefined ? '' : activity.TaskType?.Id} , Item_x0020_Type: activity.Item_x0020_Type, Id: activity.Id, siteIcon: activity.SiteIcon, }
                        }
                      }
                    }
                    TestArray.push(object)
                  }
                  if (newsub.subRows != undefined && newsub.subRows.length > 0) {
                    activity?.subRows?.forEach((wrkstrm: any) => {
                      if (wrkstrm.Shareweb_x0020_ID === item.Shareweb_x0020_ID && wrkstrm.Id === item.Id) {
                        object = {Title: obj.Title, TaskType:{Id:obj.TaskType?.Id == undefined ? '' : obj.TaskType?.Id} , Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle,
                        newSubChild: {Title: sub.Title, TaskType:{Id:sub.TaskType?.Id == undefined ? '' : sub.TaskType?.Id} , Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIconTitle === undefined ? sub.SiteIcon : sub.SiteIconTitle,
                        newFeatChild: {Title: newsub.Title, TaskType:{Id:newsub.TaskType?.Id == undefined ? '' : newsub.TaskType?.Id} , Item_x0020_Type: newsub.Item_x0020_Type, Id: newsub.Id, siteIcon: newsub.SiteIconTitle === undefined ? newsub.SiteIcon : newsub.SiteIconTitle,
                        newActChild: {Title: activity.Title,  TaskType:{Id:activity.TaskType?.Id == undefined ? '' : activity.TaskType?.Id} , Item_x0020_Type: activity.Item_x0020_Type, Id: activity.Id, siteIcon: activity.SiteIcon,
                        newWrkChild: { Title: wrkstrm.Title,  TaskType:{Id:wrkstrm.TaskType?.Id == undefined ? '' : wrkstrm.TaskType?.Id} , Item_x0020_Type: wrkstrm.Item_x0020_Type, Id: wrkstrm.Id, siteIcon: wrkstrm.SiteIcon, }
                              }}}};
                        TestArray.push(object)
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

  const trueTopIcon=(items:any)=>{
    setTrueTopCompo(items);
    setResturuningOpen(false);
  }

React.useImperativeHandle(ref, () => ({
  OpenModal,trueTopIcon


}));



const UpdateRestructure = async function () {
  let PortfolioStructureIDs: any = "";
  var ItemId: any = "";
  let ItemTitle: any = '';
  let flag: any = false;
  let count: any = 0;
  let newItem: any = "";
  let ChengedItemTitle: any = "";
  let siteIcon: any = '';
  let PortfolioLevelNum: any = 0;



  if (RestructureChecked != undefined && RestructureChecked?.length > 0) {
    RestructureChecked?.map((items: any) => {
      if ((items.Item_x0020_Type == "Feature" || items.Item_x0020_Type == "SubComponent") && newItemBackUp?.Item_x0020_Type == "Component") {
        ChengedItemTitle = items?.Item_x0020_Type;
        siteIcon = items?.siteIcon;
      }
      else if (items.Item_x0020_Type == "Component" && newItemBackUp?.Item_x0020_Type == "Component") {
        ChengedItemTitle = "SubComponent";
        siteIcon = "S";
      }
      else if (newItemBackUp?.Item_x0020_Type == "SubComponent" && (items.Item_x0020_Type == "Feature" || items.Item_x0020_Type == "SubComponent" || items.Item_x0020_Type == "Component")) {
        ChengedItemTitle = "Feature";
        siteIcon = "F";
      }

    })
  }


  allData?.forEach((obj:any) => {
    if (obj.Id === newItemBackUp?.Id && obj.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && obj?.subRows?.length == 0) {
      PortfolioLevelNum = 1;
      ItemId = obj.Id;
      ItemTitle = obj.Title;
      PortfolioStructureIDs = obj.PortfolioStructureID + "-" + siteIcon + PortfolioLevelNum;
    }


    if (obj.Id === newItemBackUp?.Id && obj.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && obj?.subRows?.length > 0) {
      obj.subRows.forEach((sub: any) => {
        if (sub.Item_x0020_Type === ChengedItemTitle) {
          PortfolioLevelNum = sub.PortfolioLevel + 1;
        } else {
          PortfolioLevelNum = 1;
        }
      });
      ItemId = obj.Id;
      ItemTitle = obj.Title;
      PortfolioStructureIDs = obj.PortfolioStructureID + "-" + siteIcon + PortfolioLevelNum;
    } else {
      obj.subRows.forEach((sub: any) => {
        if (sub.Id === newItemBackUp?.Id && sub.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && sub?.subRows?.length == 0) {
          PortfolioLevelNum = 1;
          ItemId = sub.Id;
          ItemTitle = sub.Title;
          PortfolioStructureIDs = sub.PortfolioStructureID + "-" + siteIcon + PortfolioLevelNum;
        }

        if (sub.Id === newItemBackUp?.Id && sub.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && sub?.subRows?.length > 0) {
          sub.subRows.forEach((newsub: any) => {
            if (newsub.Item_x0020_Type === ChengedItemTitle) {
              PortfolioLevelNum = newsub.PortfolioLevel + 1;
            } else {
              PortfolioLevelNum = 1;
            }
          });
          ItemId = sub.Id;
          ItemTitle = sub.Title;
          PortfolioStructureIDs = sub.PortfolioStructureID + "-" + siteIcon + PortfolioLevelNum;
        }
      });
    }
  });




  if (ChengedItemTitle != undefined && ChengedItemTitle != "") {
    let web = new Web(props.contextValue.siteUrl);
    var postData: any = {
      ParentId: ItemId,
      PortfolioLevel: PortfolioLevelNum,
      PortfolioStructureID: PortfolioStructureIDs,
      Item_x0020_Type: ChengedItemTitle,
    };
    // Added by Ranu
    // if (NewArrayBackup[0].Item_x0020_Type === 'Component') {
    //   postData.ComponentId = newItemBackUp.Portfolio_x0020_Type === "Component" ? { results: [ItemId] } : { results: [] };
    //   postData.ServicesId = newItemBackUp.Portfolio_x0020_Type === "Service" ? { results: [ItemId] } : { results: [] };
    // }


    await web.lists
      .getById(props.contextValue.MasterTaskListID)
      .items.getById(restructureItem[0].Id)
      .update(postData)
      .then(async (res: any) => {


        let checkUpdate: number = 1;
        let array: any = [...allData];
        let backupCheckedList: any = [];
        let latestCheckedList: any = [];
        RestructureChecked?.map((items: any) => {
          latestCheckedList.push({ ...items })
          backupCheckedList.push({ ...items })
        })

        latestCheckedList?.map((items: any) => {
          items.Parent = { Id: postData.ParentId, Title: ItemTitle }
          items.PortfolioLevel = postData.PortfolioLevel,
            items.PortfolioStructureID = postData.PortfolioStructureID,
            items.Item_x0020_Type = postData.Item_x0020_Type
          items.Shareweb_x0020_ID = postData.PortfolioStructureID,
            items.SiteIconTitle = siteIcon
        })

        array?.map((obj: any, index: any) => {
          obj.isRestructureActive = false;
          if (obj.Id === newItemBackUp?.Id && obj.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && checkUpdate != 3) {
            obj.subRows.push(...latestCheckedList);
            checkUpdate = checkUpdate + 1;
          }
          if (obj.Id === backupCheckedList[0]?.Id && obj.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && checkUpdate != 3) {
            array.splice(index, 1);
            checkUpdate = checkUpdate + 1;
          }

          if (obj.subRows != undefined && obj.subRows.length > 0) {
            obj.subRows.forEach((sub: any, indexsub: any) => {
              sub.isRestructureActive = false;
              if (sub.Id === newItemBackUp?.Id && sub.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && checkUpdate != 3) {
               
                sub.subRows.push(...latestCheckedList);
                checkUpdate = checkUpdate + 1;
              }
              if (sub.Id === backupCheckedList[0]?.Id && sub.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && checkUpdate != 3) {
                array[index]?.subRows.splice(indexsub, 1);
            
                checkUpdate = checkUpdate + 1;
              }

              if (sub.subRows != undefined && sub.subRows.length > 0) {
                sub.subRows.forEach((newsub: any, lastIndex: any) => {
                  newsub.isRestructureActive = false;
                  if (newsub.Id === newItemBackUp?.Id && newsub.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && checkUpdate != 3) {
               
                    newsub.subRows.push(...latestCheckedList);
                    checkUpdate = checkUpdate + 1;
                  }
                  if (newsub.Id === backupCheckedList[0]?.Id && newsub.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && checkUpdate != 3) {
                    array[index]?.subRows[indexsub]?.subRows.splice(lastIndex, 1);
                   
                    checkUpdate = checkUpdate + 1;
                  }
                })
              }
            })
          }

        })

      
        restructureCallBack(array);
        setResturuningOpen(false);


      });
  }
};



const UpdateTaskRestructure = async function () {


  var Ids: any = [];
  Ids = newItemBackUp.Id;
  let Title: any = newItemBackUp.Title;
  let PortfolioStructureID = newItemBackUp.PortfolioStructureID;
  let ServicesId: any ;
  let Item_x0020_Type = RestructureChecked[0].Item_x0020_Type;
  let Shareweb_x0020_ID: any;
  let TaskType : any = RestructureChecked[0].TaskType?.Id;
  ServicesId = (newItemBackUp?.Services[0]?.length > 0 ? "Service" : (newItemBackUp?.Component[0]?.length > 0 ? "Component" : newItemBackUp?.Portfolio_x0020_Type));


  if (newItemBackUp?.TaskType?.Id !== 1 && newItemBackUp?.TaskType?.Id !== 3) {
    let numbers: any;

    if (newItemBackUp.subRows.length > 0) {
      newItemBackUp.subRows.map((items: any) => {
        if (items?.TaskType?.Id == 1) {
          numbers = items?.SharewebTaskLevel1No + 1;
        } else {
          numbers = 1;
        }
      })
    }

    if (newItemBackUp.subRows.length == 0) {
      numbers = 1;
    }


    Shareweb_x0020_ID = ServicesId === "Service" ? `SA${numbers}` : `CA${numbers}`;


   

    let web = new Web(props.contextValue.siteUrl);
    await web.lists
      .getById(restructureItem[0].listId)
      .items.getById(restructureItem[0].Id)
      .update({
        ServicesId:
        ServicesId === "Service"
            ? { results: [Ids] }
            : { results: [] },
        ComponentId:
        ServicesId === "Component"
            ? { results: [Ids] }
            : { results: [] },
        ParentTaskId: null,
        TaskTypeId: 1,
        SharewebTaskLevel1No: numbers,
        Shareweb_x0020_ID: Shareweb_x0020_ID,
      })
      .then((res: any) => {


        let checkUpdate: number = 1;
        let array: any = [...allData];
        let backupCheckedList: any = [];
        let latestCheckedList: any = [];
        restructureItem.map((items: any) => {
          latestCheckedList.push({ ...items })
          backupCheckedList.push({ ...items })
        })

        latestCheckedList?.map((items: any) => {
          restructureItem[0].Services?.length > 0 ? items.Services = { Id: Ids, Title: Title } : items.Component = { Id: Ids, Title: Title },
            items.Parent = null,
            items.SharewebTaskLevel1No = numbers,
            items.Shareweb_x0020_ID = Shareweb_x0020_ID,
            items.TaskType = { Id: props.taskTypeId[0].Id, Title: props.taskTypeId[0].Title },
            items.PortfolioStructureID = PortfolioStructureID,
            items.Item_x0020_Type = Item_x0020_Type

        })

        array?.map((obj: any, index: any) => {
          obj.isRestructureActive = false;
          if (obj.Id === newItemBackUp?.Id && obj.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && obj.SharewebTaskType?.Title === newItemBackUp?.SharewebTaskType?.Title && checkUpdate != 3) {
            obj.subRows.push(...latestCheckedList);
            checkUpdate = checkUpdate + 1;
          }
          if (obj.Id === backupCheckedList[0]?.Id && obj.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && obj.SharewebTaskType?.Title === backupCheckedList[0]?.SharewebTaskType?.Title && checkUpdate != 3) {
            array.splice(index, 1);
            checkUpdate = checkUpdate + 1;
          }

          if (obj.subRows != undefined && obj.subRows.length > 0) {
            obj.subRows.forEach((sub: any, indexsub: any) => {
              sub.isRestructureActive = false;
              if (sub.Id === newItemBackUp?.Id && sub.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && sub.SharewebTaskType?.Title === newItemBackUp?.SharewebTaskType?.Title && checkUpdate != 3) {
                sub.subRows.push(...latestCheckedList);
                checkUpdate = checkUpdate + 1;
              }
              if (sub.Id === backupCheckedList[0]?.Id && sub.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && sub.SharewebTaskType?.Title === backupCheckedList[0]?.SharewebTaskType?.Title && checkUpdate != 3) {
                array[index]?.subRows.splice(indexsub, 1);
                checkUpdate = checkUpdate + 1;
              }

              if (sub.subRows != undefined && sub.subRows.length > 0) {
                sub.subRows.forEach((newsub: any, lastIndex: any) => {
                  newsub.isRestructureActive = false;
                  if (newsub.Id === newItemBackUp?.Id && newsub.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && newsub.SharewebTaskType?.Title === newItemBackUp?.SharewebTaskType?.Title && checkUpdate != 3) {
                    newsub.subRows.push(...latestCheckedList);
                    checkUpdate = checkUpdate + 1;
                  }
                  if (newsub.Id === backupCheckedList[0]?.Id && newsub.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && newsub.SharewebTaskType?.Title === backupCheckedList[0]?.SharewebTaskType?.Title && checkUpdate != 3) {
                    array[index]?.subRows[indexsub]?.subRows.splice(lastIndex, 1);
                    checkUpdate = checkUpdate + 1;
                  }

                  if (newsub.subRows != undefined && newsub.subRows.length > 0) {
                    newsub.subRows.forEach((activity: any, activityIndex: any) => {
                      activity.isRestructureActive = false;
                      if (activity.Id === newItemBackUp?.Id && activity.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && activity.SharewebTaskType?.Title === newItemBackUp?.SharewebTaskType?.Title && checkUpdate != 3) {
                        activity.subRows.push(...latestCheckedList);
                        checkUpdate = checkUpdate + 1;
                      }
                      if (activity.Id === backupCheckedList[0]?.Id && activity.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && activity.SharewebTaskType?.Title === backupCheckedList[0]?.SharewebTaskType?.Title && checkUpdate != 3) {
                        array[index]?.subRows[indexsub]?.subRows[lastIndex].subRows.splice(activityIndex, 1);
                        checkUpdate = checkUpdate + 1;
                      }

                      if (activity.subRows != undefined && activity.subRows.length > 0) {
                        activity.subRows.forEach((workstream: any, workstreamIndex: any) => {
                          workstream.isRestructureActive = false;
                          if (workstream.Id === newItemBackUp?.Id && workstream.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && workstream.SharewebTaskType?.Title === newItemBackUp?.SharewebTaskType?.Title && checkUpdate != 3) {
                            workstream.subRows.push(...latestCheckedList);
                            checkUpdate = checkUpdate + 1;
                          }
                          if (workstream.Id === backupCheckedList[0]?.Id && workstream.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && workstream.SharewebTaskType?.Title === backupCheckedList[0]?.SharewebTaskType?.Title && checkUpdate != 3) {
                            array[index]?.subRows[indexsub]?.subRows[lastIndex].subRows[activityIndex]?.subRows.splice(workstreamIndex, 1);
                            checkUpdate = checkUpdate + 1;
                          }

                          if (activity.subRows != undefined && activity.subRows.length > 0) {
                            activity.subRows.forEach((task: any, taskIndex: any) => {
                              task.isRestructureActive = false;
                              if (task.Id === newItemBackUp?.Id && task.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && task.SharewebTaskType?.Title === newItemBackUp?.SharewebTaskType?.Title && checkUpdate != 3) {
                                task.subRows.push(...latestCheckedList);
                                checkUpdate = checkUpdate + 1;
                              }
                              if (task.Id === backupCheckedList[0]?.Id && task.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && task.SharewebTaskType?.Title === backupCheckedList[0]?.SharewebTaskType?.Title && checkUpdate != 3) {
                                array[index]?.subRows[indexsub]?.subRows[lastIndex].subRows[activityIndex]?.subRows[workstreamIndex]?.subRows.splice(taskIndex, 1);
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

        restructureCallBack(array);
        setResturuningOpen(false);

      });
  } else {

    let numbers: any;
    let numbers1: any;
    let SharewebTaskTypeId: any;
    let SharewebTaskTypeIds: any;
    if (newItemBackUp.subRows.length > 0) {
      newItemBackUp.subRows.map((items: any) => {

        if (newItemBackUp?.TaskType?.Id == 1) {
          if (RestructureChecked[0].TaskType?.Id === 1) {
            if (items?.TaskType?.Id == 3) {
              numbers1 = items?.SharewebTaskLevel2No + 1;

            } else {
              numbers1 = 1;
            }

          } else {
            if (RestructureChecked[0].TaskType?.Id === items?.TaskType?.Id) {
              numbers1 = items?.SharewebTaskLevel2No + 1;
            } else {
              numbers1 = 1;
            }
          }
        } else if (newItemBackUp?.TaskType?.Id == 3) {
          if (items?.TaskType?.Id == 2) {
            numbers1 = items?.SharewebTaskLevel2No + 1;
          }

        } else {
          numbers1 = 1;
        }
      })
    } else {
      numbers1 = 1;
    }
  
    if (TaskType === 1) {
      SharewebTaskTypeId = props.taskTypeId[2];
    } else {
      SharewebTaskTypeId = TaskType === 2 ? props.taskTypeId[1] : props.taskTypeId[2];
    }

    numbers = newItemBackUp.SharewebTaskLevel1No;

    if(SharewebTaskTypeId.Id == 2){
      Shareweb_x0020_ID = newItemBackUp.Shareweb_x0020_ID + "-" + `W${numbers1}` + "-" + `T${newItemBackUp.Id}`
    }else{
      Shareweb_x0020_ID = newItemBackUp.Shareweb_x0020_ID + "-" + `W${numbers1}`
    }
    
    

    let web = new Web(props.contextValue.siteUrl);
    await web.lists
      .getById(restructureItem[0].listId)
      .items.getById(restructureItem[0].Id)
      .update({
        ServicesId:
        ServicesId === "Service"
            ? { results: [Ids] }
            : { results: [] },
        ComponentId:
        ServicesId === "Component"
            ? { results: [Ids] }
            : { results: [] },
        Shareweb_x0020_ID: Shareweb_x0020_ID,
        SharewebTaskLevel1No: numbers,
        SharewebTaskLevel2No: numbers1,
        TaskTypeId: SharewebTaskTypeId.Id,
        ParentTaskId: Ids
      })
      .then((res: any) => {
        let checkUpdate: number = 1;
        let array: any = [...allData];
        let backupCheckedList: any = [];
        let latestCheckedList: any = [];
        restructureItem.map((items: any) => {
          latestCheckedList.push({ ...items })
          backupCheckedList.push({ ...items })
        })

        latestCheckedList?.map((items: any) => {
          restructureItem[0].Services?.length > 0 ? items.Services = { Id: Ids, Title: Title } : items.Component = { Id: Ids, Title: Title },
            items.Parent = { Id: Ids, Shareweb_x0020_ID: Shareweb_x0020_ID, Title: Title },
            items.SharewebTaskLevel1No = numbers,
            items.Shareweb_x0020_ID = Shareweb_x0020_ID,
            items.SharewebTaskLevel2No = numbers1,
            items.SharewebTaskType = { Id: SharewebTaskTypeId.Id, Level: SharewebTaskTypeId.Level, Title: SharewebTaskTypeId.Title },
            items.Item_x0020_Type = Item_x0020_Type
        })

        array?.map((obj: any, index: any) => {
          obj.isRestructureActive = false;
          if (obj.Id === newItemBackUp?.Id && obj.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && obj.SharewebTaskType?.Title === newItemBackUp?.SharewebTaskType?.Title && checkUpdate != 3) {
            obj.subRows.push(...latestCheckedList);
            checkUpdate = checkUpdate + 1;
          }
          if (obj.Id === backupCheckedList[0]?.Id && obj.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && obj.SharewebTaskType?.Title === backupCheckedList[0]?.SharewebTaskType?.Title && checkUpdate != 3) {
            array.splice(index, 1);
            checkUpdate = checkUpdate + 1;
          }

          if (obj.subRows != undefined && obj.subRows.length > 0) {
            obj.subRows.forEach((sub: any, indexsub: any) => {
              sub.isRestructureActive = false;
              if (sub.Id === newItemBackUp?.Id && sub.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && sub.SharewebTaskType?.Title === newItemBackUp?.SharewebTaskType?.Title && checkUpdate != 3) {
                sub.subRows.push(...latestCheckedList);
                checkUpdate = checkUpdate + 1;
              }
              if (sub.Id === backupCheckedList[0]?.Id && sub.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && sub.SharewebTaskType?.Title === backupCheckedList[0]?.SharewebTaskType?.Title && checkUpdate != 3) {
                array[index]?.subRows.splice(indexsub, 1);
                checkUpdate = checkUpdate + 1;
              }

              if (sub.subRows != undefined && sub.subRows.length > 0) {
                sub.subRows.forEach((newsub: any, lastIndex: any) => {
                  newsub.isRestructureActive = false;
                  if (newsub.Id === newItemBackUp?.Id && newsub.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && newsub.SharewebTaskType?.Title === newItemBackUp?.SharewebTaskType?.Title && checkUpdate != 3) {
                    newsub.subRows.push(...latestCheckedList);
                    checkUpdate = checkUpdate + 1;
                  }
                  if (newsub.Id === backupCheckedList[0]?.Id && newsub.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && newsub.SharewebTaskType?.Title === backupCheckedList[0]?.SharewebTaskType?.Title && checkUpdate != 3) {
                    array[index]?.subRows[indexsub]?.subRows.splice(lastIndex, 1);
                    checkUpdate = checkUpdate + 1;
                  }

                  if (newsub.subRows != undefined && newsub.subRows.length > 0) {
                    newsub.subRows.forEach((activity: any, activityIndex: any) => {
                      activity.isRestructureActive = false;
                      if (activity.Id === newItemBackUp?.Id && activity.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && activity.SharewebTaskType?.Title === newItemBackUp?.SharewebTaskType?.Title && checkUpdate != 3) {
                        activity.subRows.push(...latestCheckedList);
                        checkUpdate = checkUpdate + 1;
                      }
                      if (activity.Id === backupCheckedList[0]?.Id && activity.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && activity.SharewebTaskType?.Title === backupCheckedList[0]?.SharewebTaskType?.Title && checkUpdate != 3) {
                        array[index]?.subRows[indexsub]?.subRows[lastIndex].subRows.splice(activityIndex, 1);
                        checkUpdate = checkUpdate + 1;
                      }

                      if (activity.subRows != undefined && activity.subRows.length > 0) {
                        activity.subRows.forEach((workstream: any, workstreamIndex: any) => {
                          workstream.isRestructureActive = false;
                          if (workstream.Id === newItemBackUp?.Id && workstream.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && workstream.SharewebTaskType?.Title === newItemBackUp?.SharewebTaskType?.Title && checkUpdate != 3) {
                            workstream.subRows.push(...latestCheckedList);
                            checkUpdate = checkUpdate + 1;
                          }
                          if (workstream.Id === backupCheckedList[0]?.Id && workstream.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && workstream.SharewebTaskType?.Title === backupCheckedList[0]?.SharewebTaskType?.Title && checkUpdate != 3) {
                            array[index]?.subRows[indexsub]?.subRows[lastIndex].subRows[activityIndex]?.subRows.splice(workstreamIndex, 1);
                            checkUpdate = checkUpdate + 1;
                          }

                          if (activity.subRows != undefined && activity.subRows.length > 0) {
                            activity.subRows.forEach((task: any, taskIndex: any) => {
                              task.isRestructureActive = false;
                              if (task.Id === newItemBackUp?.Id && task.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && task.SharewebTaskType?.Title === newItemBackUp?.SharewebTaskType?.Title && checkUpdate != 3) {
                                task.subRows.push(...latestCheckedList);
                                checkUpdate = checkUpdate + 1;
                              }
                              if (task.Id === backupCheckedList[0]?.Id && task.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && task.SharewebTaskType?.Title === backupCheckedList[0]?.SharewebTaskType?.Title && checkUpdate != 3) {
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

        restructureCallBack(array);
        setResturuningOpen(false);


      });
  }

};



const makeTopComp = async () => {
  let PortfolioStructureIDs: any = "";
  let ItemTitle: any = '';
  let ChengedItemTitle: any = "";
  let siteIcon: any = '';
  let PortfolioLevelNum: any = 0;
  let SharewebTaskLevel1No: number = 0;
  let Shareweb_x0020_ID: any;




  if (RestructureChecked != undefined && RestructureChecked?.length > 0 && (RestructureChecked[0].Item_x0020_Type == "SubComponent" || RestructureChecked[0].Item_x0020_Type == "Feature")) {
    ChengedItemTitle = "Component";
    siteIcon = "C";

  }

  if (RestructureChecked != undefined && RestructureChecked?.length > 0 && (RestructureChecked[0].SharewebTaskType?.Title == "Workstream" || RestructureChecked[0].SharewebTaskType?.Title == "Task")) {
    ChengedItemTitle = "Activities";
  }

  if (RestructureChecked != undefined && RestructureChecked?.length > 0 && (RestructureChecked[0].Item_x0020_Type == "SubComponent" || RestructureChecked[0].Item_x0020_Type == "Feature")) {
    allData.map((obj: any) => {
      if (obj.Item_x0020_Type === "Component") {
        if (PortfolioLevelNum <= obj.PortfolioLevel) {
          PortfolioLevelNum = obj.PortfolioLevel + 1;
          PortfolioStructureIDs = "C" + PortfolioLevelNum;
        }
      }
    })
  }

  if (RestructureChecked != undefined && RestructureChecked?.length > 0 && (RestructureChecked[0].SharewebTaskType?.Title == "Workstream" || RestructureChecked[0].SharewebTaskType?.Title == "Task")) {
    allData.map((obj: any) => {
      if (obj.subRows.length > 0 && obj.subRows != undefined) {
        obj.subRows.map((sub: any) => {
          if (restructureItem[0].ParentTask?.Id === sub.Id) {
            if (SharewebTaskLevel1No <= sub.SharewebTaskLevel1No) {
              SharewebTaskLevel1No = sub.SharewebTaskLevel1No + 1;
              PortfolioStructureIDs = sub.PortfolioStructureID;
              Shareweb_x0020_ID = 'SA' + SharewebTaskLevel1No;
            }
          }
          if (sub.subRows.length > 0 && sub.subRows != undefined) {
            sub.subRows.map((newsub: any) => {
              if (restructureItem[0].ParentTask?.Id === newsub.Id) {
                if (SharewebTaskLevel1No <= newsub.SharewebTaskLevel1No) {
                  SharewebTaskLevel1No = newsub.SharewebTaskLevel1No + 1;
                  PortfolioStructureIDs = newsub.PortfolioStructureID;
                  Shareweb_x0020_ID = 'SA' + SharewebTaskLevel1No;
                }

              }

              if (newsub.subRows.length > 0 && newsub.subRows != undefined) {
                newsub.subRows.map((feature: any) => {
                  if (restructureItem[0].ParentTask?.Id === feature.Id) {
                    if (SharewebTaskLevel1No <= feature.SharewebTaskLevel1No) {
                      SharewebTaskLevel1No = feature.SharewebTaskLevel1No + 1;
                      PortfolioStructureIDs = feature.PortfolioStructureID;
                      Shareweb_x0020_ID = 'SA' + SharewebTaskLevel1No;
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



  if (ChengedItemTitle != undefined && ChengedItemTitle != "" && (RestructureChecked[0].Item_x0020_Type == "SubComponent" || RestructureChecked[0].Item_x0020_Type == "Feature")) {
    let web = new Web(props.contextValue.siteUrl);
    var postData: any = {
      Item_x0020_Type: ChengedItemTitle,
      PortfolioStructureID: PortfolioStructureIDs,
      PortfolioLevel: PortfolioLevelNum,
      Shareweb_x0020_ID: PortfolioStructureIDs,
      ParentId: null

    };

    await web.lists
      .getById(props.contextValue.MasterTaskListID)
      .items.getById(restructureItem[0].Id)
      .update(postData)
      .then(async (res: any) => {


        let checkUpdate: number = 1;
        let array: any = [...allData];
        let backupCheckedList: any = [];
        let latestCheckedList: any = [];
        let count: number = 0;
        restructureItem.map((items: any) => {
          latestCheckedList.push({ ...items })
          backupCheckedList.push({ ...items })
        })

        latestCheckedList?.map((items: any) => {
          items.PortfolioLevel = postData.PortfolioLevel,
            items.PortfolioStructureID = postData.PortfolioStructureID,
            items.Item_x0020_Type = postData.Item_x0020_Type
          items.Shareweb_x0020_ID = postData.PortfolioStructureID,
            items.SiteIconTitle = siteIcon,
            items.Parent = { Id: null, Title: null }
        })


        array.map((obj: any, index: any) => {
          obj.isRestructureActive = false;

          if (count == 0) {
            array.splice(array.length - 1, 0, ...latestCheckedList);
            count = 1;
          }

          if (obj?.subRows != undefined && obj?.subRows.length > 0) {
            obj?.subRows?.map((sub: any, subIndex: any) => {
              if (sub.Id === backupCheckedList[0]?.Id && sub.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && checkUpdate == 1) {
                array[index]?.subRows.splice(subIndex, 1);
                checkUpdate = 2;
              }
              if (sub?.subRows != undefined && sub?.subRows.length > 0) {
                sub?.subRows?.map((newsub: any, newsubIndex: any) => {
                  if (newsub.Id === backupCheckedList[0]?.Id && newsub.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && checkUpdate == 1) {
                    array[index]?.subRows[subIndex]?.subRows.splice(newsubIndex, 1);
                    checkUpdate = 2;
                  }
                })
              }

            })
          }

        })

        restructureCallBack(array);
        setTrueTopCompo(false);



      });
  }

  if (ChengedItemTitle != undefined && ChengedItemTitle != "" && (RestructureChecked[0].SharewebTaskType?.Title == "Workstream" || RestructureChecked[0].SharewebTaskType?.Title == "Task")) {
    let web = new Web(props.contextValue.siteUrl);
    var postData: any = {
      SharewebTaskTypeId: props.taskTypeId[0].Id,
      SharewebTaskLevel1No: SharewebTaskLevel1No,
      Shareweb_x0020_ID: Shareweb_x0020_ID,
      ParentTaskId: null
    };

    await web.lists
      .getById(restructureItem[0].listId)
      .items.getById(restructureItem[0].Id)
      .update(postData)
      .then(async (res: any) => {


        let checkUpdate: number = 1;
        let count: number = 0
        let array: any = [...allData];
        let backupCheckedList: any = [];
        let latestCheckedList: any = [];
        restructureItem.map((items: any) => {
          latestCheckedList.push({ ...items })
          backupCheckedList.push({ ...items })
        })

        latestCheckedList?.map((items: any) => {
          items.PortfolioStructureID = postData.PortfolioStructureID,
            items.Shareweb_x0020_ID = postData.Shareweb_x0020_ID,
            items.ParentTask = { Id: null, Title: null, Shareweb_x0020_ID: null },
            items.SharewebTaskLevel1No = postData.SharewebTaskLevel1No,
            items.SharewebTaskType = { Id: props.taskTypeId[0].Id, Level: props.taskTypeId[0].Level, Title: props.taskTypeId[0].Title }
        })



        array?.map((obj: any, index: any) => {
          obj.isRestructureActive = false;
          if (obj.Id === newItemBackUp?.Id && obj.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && obj.SharewebTaskType?.Title === newItemBackUp?.SharewebTaskType?.Title && checkUpdate != 3) {
            obj.subRows.push(...latestCheckedList);
            checkUpdate = checkUpdate + 1;
          }
          if (obj.Id === backupCheckedList[0]?.Id && obj.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && obj.SharewebTaskType?.Title === backupCheckedList[0]?.SharewebTaskType?.Title && checkUpdate != 3) {
            array.splice(index, 1);
            checkUpdate = checkUpdate + 1;
          }

          if (obj.subRows != undefined && obj.subRows.length > 0) {
            obj.subRows.forEach((sub: any, indexsub: any) => {
              sub.isRestructureActive = false;
              if (sub.Id === newItemBackUp?.Id && sub.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && sub.SharewebTaskType?.Title === newItemBackUp?.SharewebTaskType?.Title && checkUpdate != 3) {
                sub.subRows.push(...latestCheckedList);
                checkUpdate = checkUpdate + 1;
              }
              if (sub.Id === backupCheckedList[0]?.Id && sub.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && sub.SharewebTaskType?.Title === backupCheckedList[0]?.SharewebTaskType?.Title && checkUpdate != 3) {
                array[index]?.subRows.splice(indexsub, 1);
                checkUpdate = checkUpdate + 1;
              }

              if (sub.subRows != undefined && sub.subRows.length > 0) {
                sub.subRows.forEach((newsub: any, lastIndex: any) => {
                  newsub.isRestructureActive = false;
                  if (newsub.Id === newItemBackUp?.Id && newsub.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && newsub.SharewebTaskType?.Title === newItemBackUp?.SharewebTaskType?.Title && checkUpdate != 3) {
                    newsub.subRows.push(...latestCheckedList);
                    checkUpdate = checkUpdate + 1;
                  }
                  if (newsub.Id === backupCheckedList[0]?.Id && newsub.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && newsub.SharewebTaskType?.Title === backupCheckedList[0]?.SharewebTaskType?.Title && checkUpdate != 3) {
                    array[index]?.subRows[indexsub]?.subRows.splice(lastIndex, 1);
                    checkUpdate = checkUpdate + 1;
                  }

                  if (newsub.subRows != undefined && newsub.subRows.length > 0) {
                    newsub.subRows.forEach((activity: any, activityIndex: any) => {
                      activity.isRestructureActive = false;
                      if (activity.Id === newItemBackUp?.Id && activity.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && activity.SharewebTaskType?.Title === newItemBackUp?.SharewebTaskType?.Title && checkUpdate != 3) {
                        activity.subRows.push(...latestCheckedList);
                        checkUpdate = checkUpdate + 1;
                      }
                      if (activity.Id === backupCheckedList[0]?.Id && activity.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && activity.SharewebTaskType?.Title === backupCheckedList[0]?.SharewebTaskType?.Title && checkUpdate != 3) {
                        array[index]?.subRows[indexsub]?.subRows[lastIndex].subRows.splice(activityIndex, 1);
                        checkUpdate = checkUpdate + 1;
                      }

                      if (activity.subRows != undefined && activity.subRows.length > 0) {
                        activity.subRows.forEach((workstream: any, workstreamIndex: any) => {
                          workstream.isRestructureActive = false;
                          if (workstream.Id === newItemBackUp?.Id && workstream.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && workstream.SharewebTaskType?.Title === newItemBackUp?.SharewebTaskType?.Title && checkUpdate != 3) {
                            workstream.subRows.push(...latestCheckedList);
                            checkUpdate = checkUpdate + 1;
                          }
                          if (workstream.Id === backupCheckedList[0]?.Id && workstream.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && workstream.SharewebTaskType?.Title === backupCheckedList[0]?.SharewebTaskType?.Title && checkUpdate != 3) {
                            array[index]?.subRows[indexsub]?.subRows[lastIndex].subRows[activityIndex]?.subRows.splice(workstreamIndex, 1);
                            checkUpdate = checkUpdate + 1;
                          }

                          if (activity.subRows != undefined && activity.subRows.length > 0) {
                            activity.subRows.forEach((task: any, taskIndex: any) => {
                              task.isRestructureActive = false;
                              if (task.Id === newItemBackUp?.Id && task.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && task.SharewebTaskType?.Title === newItemBackUp?.SharewebTaskType?.Title && checkUpdate != 3) {
                                task.subRows.push(...latestCheckedList);
                                checkUpdate = checkUpdate + 1;
                              }
                              if (task.Id === backupCheckedList[0]?.Id && task.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && task.SharewebTaskType?.Title === backupCheckedList[0]?.SharewebTaskType?.Title && checkUpdate != 3) {
                                array[index]?.subRows[indexsub]?.subRows[lastIndex].subRows[activityIndex]?.subRows[workstreamIndex]?.subRows.splice(taskIndex, 1);
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

        restructureCallBack(array);
        setResturuningOpen(false);


      });
  }


}


const setRestructure = (item: any, title: any) => {
  let array: any = [];
  let data: any = []
  item?.map((items: any) => {
    if (items != undefined && title === "SubComponent") {
      data.push({ Id: items.Id, Item_x0020_Type: "SubComponent", TaskType: items.TaskType, Title: items.Title, siteIcon: "S" })
    }
    if (items != undefined && title === "Feature") {
      data.push({ Id: items.Id, Item_x0020_Type: "Feature", TaskType: items.TaskType, Title: items.Title, siteIcon: "F" })
    }
    if (items != undefined && title === 3) {
      data.push({ Id: items.Id, Item_x0020_Type: "Task", TaskType: {Id: 3}, Title: items.Title, siteIcon: items.siteIcon })
    }
    if (items != undefined && title === 2) {
      data.push({ Id: items.Id, Item_x0020_Type: "Task", TaskType: {Id: 2}, Title: items.Title, siteIcon: items.siteIcon })
    }
  })
  array.push(...data);
  setRestructureChecked(array)
};


  return (
    <div>
      
         <button  type="button" title="Restructure"
        className="btn btn-primary"
        onClick={buttonRestructuring}
        >Restructure</button>
      
        

<span>

  
{
                        ResturuningOpen === true ?
                        <Panel
                         type={PanelType.medium}
                          isOpen={ResturuningOpen}
                          isBlocking={false}
                          onDismiss={()=>setResturuningOpen(false)}
                        >
                        <div>
                        <div>
                <span> Old: </span>
                {OldArrayBackup?.map(function (obj: any) {
                  return (
                    <span>
                      {obj.siteIcon.length === 1 ? <span className="Dyicons ">{obj.siteIcon}</span> : <span><img width={"25px"} height={"25px"} src={obj?.siteIcon} /></span> }
                      
                      <a
                        data-interception="off"
                        target="_blank"
                        className="hreflink serviceColor_Active"
                        href={
                          props.contextValue.siteUrl +
                          "/SitePages/Portfolio-Profile.aspx?taskId=" +
                          obj?.Id
                        }
                      >
                        <span>{obj?.Title} </span>

            

                      </a>
                      <span>{obj?.newSubChild ? <span> {'>'} <span >{obj?.newSubChild?.siteIcon === "S" || obj?.newSubChild?.siteIcon === "F" ? <span className="Dyicons ">{obj?.newSubChild?.siteIcon}</span> : <span><img width={"25px"} height={"25px"} src={obj?.newSubChild?.siteIcon} /></span>}</span> {obj?.newSubChild?.Title}</span> : ''}</span>
                      <span>{obj?.newSubChild?.newFeatChild ? <span> {'>'} <span >{obj?.newSubChild?.newFeatChild?.siteIcon === "F" ? <span className="Dyicons ">{obj?.newSubChild?.newFeatChild?.siteIcon}</span> : <span><img width={"25px"} height={"25px"} src={obj?.newSubChild?.newFeatChild?.siteIcon} /></span>}</span> {obj?.newSubChild?.newFeatChild?.Title}</span> : ''}</span>
                      <span>{obj?.newSubChild?.newFeatChild?.newActChild ? <span> {'>'} <span className=""><img width={"25px"} height={"25px"} src={obj?.newSubChild?.newFeatChild?.newActChild?.siteIcon} /></span> {obj?.newSubChild?.newFeatChild?.newActChild?.Title}</span> : ''}</span>
                      <span>{obj?.newSubChild?.newFeatChild?.newActChild?.newWrkChild ? <span> {'>'} <span className=""><img width={"25px"} height={"25px"} src={obj?.newSubChild?.newFeatChild?.newActChild?.newWrkChild?.siteIcon} /> </span> {obj?.newSubChild?.newFeatChild?.newActChild?.newWrkChild?.Title}</span> : ''}</span>
                      <span>{obj?.newSubChild?.newFeatChild?.newActChild?.newWrkChild?.newTskChild ? <span> {'>'} <span className=""> <img width={"25px"} height={"25px"} src={obj?.newSubChild?.newFeatChild?.newActChild?.newWrkChild?.newTskChild?.siteIcon} /> </span> {obj?.newSubChild?.newFeatChild?.newActChild?.newWrkChild?.newTskChild?.Title}</span> : ''}</span>

                    </span>
                  );
                })}
              </div>

              <div>
                <span> New: </span>
                {NewArrayBackup?.map(function (obj: any) {
                  return (
                    <span>
                      {obj.siteIcon.length === 1 ? <span className="Dyicons ">{obj.siteIcon}</span> : <span><img width={"25px"} height={"25px"} src={obj?.siteIcon} /></span> }
                      
                      <a
                        data-interception="off"
                        target="_blank"
                        className="hreflink serviceColor_Active"
                        href={
                          props.contextValue.siteUrl +
                          "/SitePages/Portfolio-Profile.aspx?taskId=" +
                          obj?.Id
                        }
                      >
                        <span>{obj?.Title} </span>
                    </a>
                      <span>{obj?.newSubChild ? <span> {'>'} <span >{obj?.newSubChild?.siteIcon === "S" || obj?.newSubChild?.siteIcon === "F" ? <span className="Dyicons ">{obj?.newSubChild?.siteIcon}</span> : <span><img width={"25px"} height={"25px"} src={obj?.newSubChild?.siteIcon} /></span>}</span> {obj?.newSubChild?.Title}</span> : ''}</span>
                      <span>{obj?.newSubChild?.newFeatChild ? <span> {'>'} <span >{obj?.newSubChild?.newFeatChild?.siteIcon === "F" ? <span className="Dyicons ">{obj?.newSubChild?.newFeatChild?.siteIcon}</span> : <span><img width={"25px"} height={"25px"} src={obj?.newSubChild?.newFeatChild?.siteIcon} /></span>}</span> {obj?.newSubChild?.newFeatChild?.Title}</span> : ''}</span>
                      <span>{obj?.newSubChild?.newFeatChild?.newActChild ? <span> {'>'} <span className=""><img width={"25px"} height={"25px"} src={obj?.newSubChild?.newFeatChild?.newActChild?.siteIcon} /></span> {obj?.newSubChild?.newFeatChild?.newActChild?.Title}</span> : ''}</span>
                      <span>{obj?.newSubChild?.newFeatChild?.newActChild?.newWrkChild ? <span> {'>'} <span className=""><img width={"25px"} height={"25px"} src={obj?.newSubChild?.newFeatChild?.newActChild?.newWrkChild?.siteIcon} /> </span> {obj?.newSubChild?.newFeatChild?.newActChild?.newWrkChild?.Title}</span> : ''}</span>
                      <span>{obj?.newSubChild?.newFeatChild?.newActChild?.newWrkChild?.newTskChild ? <span> {'>'} <span className=""> <img width={"25px"} height={"25px"} src={obj?.newSubChild?.newFeatChild?.newActChild?.newWrkChild?.newTskChild?.siteIcon} /> </span> {obj?.newSubChild?.newFeatChild?.newActChild?.newWrkChild?.newTskChild?.Title}</span> : ''}</span>

                    </span>
                  );
                })}
                 {
                  RestructureChecked?.map((items: any) =>
                    <span> {">"}
                      {
                        items?.Item_x0020_Type === "Component" ? <div className="Dyicons">
                          S
                        </div> :(newItemBackUp?.Item_x0020_Type == "SubComponent" && items?.Item_x0020_Type === "SubComponent" ? <div className="Dyicons">F</div> :(items?.Item_x0020_Type === "Task" ? <span><img width={"25px"} height={"25px"} src={items?.siteIcon} /></span> : <div className="Dyicons">{items?.siteIcon}</div>))
                      }
                      <a
                        data-interception="off"
                        target="_blank"
                        className="hreflink serviceColor_Active"
                        href={
                          props.contextValue.siteUrl +
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
            restructureItem.length > 0 &&
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
              onClick={(e) => UpdateRestructure()}
            >
              Save
            </button>
          )}
          <button
            type="button"
            className="btn btn-default btn-default ms-1"
            onClick={()=>setResturuningOpen(false)}
          >
            Cancel
          </button>
        </footer>
                        </div>
                        </Panel>  : ''
                  
                        }
</span>
                        

<span>
{
  trueTopCompo == true? 
  <span>
  <Panel
    isOpen={trueTopCompo}
    isBlocking={false}
    onDismiss={() => setTrueTopCompo(false)}
  >
    <div>
     Selected Item will Restructure Into Component 
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
</span>



    </div>
  )
};


export default forwardRef(RestructuringCom);    