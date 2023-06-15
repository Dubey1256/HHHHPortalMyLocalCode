import * as React from "react";
import { useEffect, useState } from 'react';
import pnp, { Web } from "sp-pnp-js";
import "@pnp/sp/sputilities";
import * as moment from 'moment';
import { GlobalConstants } from '../globalComponents/LocalCommon';
import { PageContext } from "@microsoft/sp-page-context";
import { spfi } from "@pnp/sp/presets/all";

export const pageContext = async () => {
    let result;
    try {
        result = (await pnp.sp.site.getContextInfo());
    }
    catch (error) {
        return Promise.reject(error);
    }

    return result;

}


export const PopHoverBasedOnTaskId = (item: any) => {
    let returnObj={...item}
    if(returnObj?.original?.subRows?.length > 0 ){
        delete returnObj?.original?.subRows;
    }
    //    let structur= item?.original?.Title;
    //     let structureId=item?.original?.Shareweb_x0020_ID
       let structur= [returnObj?.original];
       let finalArray:any=[];
        try {
            // let parent = item?.parentRow;
            // while(parent){
            //     structur=parent?.original?.Title+' > '+structur;
            //     structureId=parent?.original?.structureId+'-'+ structureId;
            //     parent=parent?.parentRow;
            // }
             let parent = returnObj?.getParentRow();
            while(parent){
                structur.push(parent?.original);
                parent=parent?.getParentRow();
            }
            structur.reverse;
            let finalStructure=structur[0]
            for (let i = structur.length - 1; i > 0; i--) {
                const currentObject = structur[i];
                const previousObject = structur[i - 1];
                currentObject.subRows=[];
                currentObject.subRows.push(previousObject);
              }
        } catch (error) {
            
        }
    // let finalResult ='';
    //     if(structur!=undefined&&structureId!=undefined){
    //         finalResult=structureId+' : '+structur
    //     }
        return finalArray = structur?.slice(-1);
    }


export const hierarchyData= (items:any,MyAllData:any)=>{
    var MasterListData:any=[]
    var ChildData:any=[]
    var AllData:any=[]
    var finalData:any=[]
    var SubChild:any=[]
    var Parent:any=[]
    var MainParent:any=[]
    try {
        MyAllData?.forEach((item: any) => {
            if (items.Component != undefined) {
              items.Component.forEach((com: any) => {
                    if (item.Id == com.Id) {
                        ChildData.push(item)
                        ChildData?.forEach((val: any) => {
                            if (val.Parent?.Id != undefined) {
                                SubChild.push(val.Parent)
                                SubChild?.forEach((item: any) => {
                                    if (item.Parent?.Id != undefined) {
                                        Parent.push(item.Parent)
                                    }
    
                                })
    
                            }
                        })
                    }
                })
            }
            if (items?.Services != undefined) {
              items.Services.forEach((com: any) => {
                    if (item.Id == com.Id) {
                        ChildData.push(item)
                        ChildData?.forEach((val: any) => {
                            if (val.Parent?.Id != undefined) {
                                SubChild.push(val.Parent)
                                SubChild?.forEach((item: any) => {
                                    MyAllData?.forEach((items: any) => {
                                        if (items.Id == item.Id) {
                                            Parent.push(items)
                                        }
                      
                                    })
                                    Parent.forEach((val:any)=>{
                                        if (val.Parent?.Id != undefined) {
                                            MyAllData?.forEach((items: any) => {
                                                if (items.Id == val.Parent.Id) {
                                                    MainParent.push(items)
                                                }
                              
                                            })
                                           
                                        }
                                    })
                                   
                                       
                                    
    
                                })
    
                            }
                        })
                    }
                })
            }
    
          
    
        })
        if (MainParent != undefined && MainParent.length > 0) {
           
            if (MainParent != undefined && MainParent.length > 0) {
                MainParent?.forEach((val: any) => {
                    val.subRows = []
                    if (val.Item_x0020_Type == undefined) {
                        MyAllData?.forEach((items: any) => {
                            if (items.Id == val.Id) {
                                val.Item_x0020_Type = items.Item_x0020_Type;
                                val.PortfolioStructureID = items.PortfolioStructureID
                            }
          
                        })
                    }
                    if (val.Item_x0020_Type != undefined && val.Item_x0020_Type === "Component") {
                        val.SiteIconTitle = "C"
                    }
                    if (val.Item_x0020_Type != undefined && val.Item_x0020_Type === "SubComponent") {
                        val.SiteIconTitle = "S"
                    }
                    if (val.Item_x0020_Type != undefined && val.Item_x0020_Type === "Feature") {
                        val.SiteIconTitle = "F"
                    }
                    //val.subRows(val)
                    AllData.push(val)
                    Parent?.forEach((item: any) => {
                        item.subRows = []
                        if (item.Item_x0020_Type == undefined) {
                            MyAllData?.forEach((items: any) => {
                                if (items.Id == val.Id) {
                                    val.Item_x0020_Type = items.Item_x0020_Type;
                                    val.PortfolioStructureID = items.PortfolioStructureID
                                }
          
                            })
                        }
                        if (item.Item_x0020_Type != undefined && item.Item_x0020_Type === "Component") {
                            item.SiteIconTitle = "C"
                        }
                        if (item.Item_x0020_Type != undefined && item.Item_x0020_Type === "SubComponent") {
                            item.SiteIconTitle = "S"
                        }
                        if (item.Item_x0020_Type != undefined && item.Item_x0020_Type === "Feature") {
                            item.SiteIconTitle = "F"
                        }
          
                        AllData?.forEach((vall: any) => {
                            vall.subRows.push(item)
                        })
                        //item.subRows.push(items)
                       // item.subRows[0].PortfolioStructureID =items?.Shareweb_x0020_ID
                       // item.subRows[0].siteIcon = items?.siteIcon
          
          
                    })
                    ChildData?.forEach((item: any) => {
                        item.subRows = []
                        if (item.Item_x0020_Type == undefined) {
                            MyAllData?.forEach((items: any) => {
                                if (items.Id == item.Id) {
                                    item.Item_x0020_Type = items.Item_x0020_Type;
                                    item.PortfolioStructureID = items.PortfolioStructureID
                                }
          
                            })
                        }
                        if (item.Item_x0020_Type != undefined && item.Item_x0020_Type === "Component") {
                            item.SiteIconTitle = "C"
                        }
                        if (item.Item_x0020_Type != undefined && item.Item_x0020_Type === "SubComponent") {
                            item.SiteIconTitle = "S"
                        }
                        if (item.Item_x0020_Type != undefined && item.Item_x0020_Type === "Feature") {
                            item.SiteIconTitle = "F"
                        }
          
                        AllData?.forEach((vall: any) => {
                            if(vall.subRows != undefined && vall.subRows.length >0){
                                vall.subRows.forEach((newItem:any)=>{
                                    newItem.subRows.push(item)
                                })
                            }
                        })
                        item.subRows.push(items)
                        item.subRows[0].PortfolioStructureID =items?.Shareweb_x0020_ID
                        item.subRows[0].siteIcon = items?.siteIcon
          
          
                    })
                    // ChildData?.forEach((item1: any) => {
                    //     item1.subRows = []
                    //     if (item1.Item_x0020_Type == undefined) {
                    //         MyAllData?.forEach((items: any) => {
                    //             if (items.Id == val.Id) {
                    //                 val.Item_x0020_Type = items.Item_x0020_Type;
                    //                 val.PortfolioStructureID = items.PortfolioStructureID
                    //             }
          
                    //         })
                    //     }
                    //     if (item1.Item_x0020_Type != undefined && item1.Item_x0020_Type === "Component") {
                    //         item1.SiteIconTitle = "C"
                    //     }
                    //     if (item1.Item_x0020_Type != undefined && item1.Item_x0020_Type === "SubComponent") {
                    //         item1.SiteIconTitle = "S"
                    //     }
                    //     if (item1.Item_x0020_Type != undefined && item1.Item_x0020_Type === "Feature") {
                    //         item1.SiteIconTitle = "F"
                    //     }
          
                    //     AllData?.forEach((vall: any) => {
                    //         if(vall.subRows != undefined && vall.subRows.length >0){
                    //             vall.subRows.forEach((newItem:any)=>{
                    //                 newItem.subRows.forEach((Itemsss:any)=>{
                    //                     Itemsss.subRows.push(item1)
                    //                 })
                    //             })
                    //         }
                    //     })
                    //     item1.subRows.push(items)
                    //     item1.subRows[0].PortfolioStructureID =items?.Shareweb_x0020_ID
                    //     item1.subRows[0].siteIcon = items?.siteIcon
          
          
                    // })
                    console.log(AllData)
                    items.HierarchyData = AllData
                    //setMasterData(newitems.HierarchyData)
                })
            }
            console.log(Parent)
        
  
  
        }
        if (Parent != undefined && Parent.length > 0 && MainParent.length == 0) {
           
                if (Parent != undefined && Parent.length > 0) {
                    Parent?.forEach((val: any) => {
                        val.subRows = []
                        if (val.Item_x0020_Type == undefined) {
                            MyAllData?.forEach((items: any) => {
                                if (items.Id == val.Id) {
                                    val.Item_x0020_Type = items.Item_x0020_Type;
                                    val.PortfolioStructureID = items.PortfolioStructureID
                                }
              
                            })
                        }
                        if (val.Item_x0020_Type != undefined && val.Item_x0020_Type === "Component") {
                            val.SiteIconTitle = "C"
                        }
                        if (val.Item_x0020_Type != undefined && val.Item_x0020_Type === "SubComponent") {
                            val.SiteIconTitle = "S"
                        }
                        if (val.Item_x0020_Type != undefined && val.Item_x0020_Type === "Feature") {
                            val.SiteIconTitle = "F"
                        }
                        //val.subRows(val)
                        AllData.push(val)
                        SubChild?.forEach((item: any) => {
                            item.subRows = []
                            if (item.Item_x0020_Type == undefined) {
                                MyAllData?.forEach((items: any) => {
                                    if (items.Id == val.Id) {
                                        val.Item_x0020_Type = items.Item_x0020_Type;
                                        val.PortfolioStructureID = items.PortfolioStructureID
                                    }
              
                                })
                            }
                            if (item.Item_x0020_Type != undefined && item.Item_x0020_Type === "Component") {
                                item.SiteIconTitle = "C"
                            }
                            if (item.Item_x0020_Type != undefined && item.Item_x0020_Type === "SubComponent") {
                                item.SiteIconTitle = "S"
                            }
                            if (item.Item_x0020_Type != undefined && item.Item_x0020_Type === "Feature") {
                                item.SiteIconTitle = "F"
                            }
              
                            AllData?.forEach((vall: any) => {
                                vall.subRows.push(item)
                            })
                            item.subRows.push(items)
                            item.subRows[0].PortfolioStructureID =items?.Shareweb_x0020_ID
                            item.subRows[0].siteIcon = items?.siteIcon
              
              
                        })
                        ChildData?.forEach((item: any) => {
                            item.subRows = []
                            if (item.Item_x0020_Type == undefined) {
                                MyAllData?.forEach((items: any) => {
                                    if (items.Id == val.Id) {
                                        val.Item_x0020_Type = items.Item_x0020_Type;
                                        val.PortfolioStructureID = items.PortfolioStructureID
                                    }
              
                                })
                            }
                            if (item.Item_x0020_Type != undefined && item.Item_x0020_Type === "Component") {
                                item.SiteIconTitle = "C"
                            }
                            if (item.Item_x0020_Type != undefined && item.Item_x0020_Type === "SubComponent") {
                                item.SiteIconTitle = "S"
                            }
                            if (item.Item_x0020_Type != undefined && item.Item_x0020_Type === "Feature") {
                                item.SiteIconTitle = "F"
                            }
              
                            AllData?.forEach((vall: any) => {
                                vall.subRows.push(item)
                            })
                            item.subRows.push(items)
                            item.subRows[0].PortfolioStructureID =items?.Shareweb_x0020_ID
                            item.subRows[0].siteIcon = items?.siteIcon
              
              
                        })
                        console.log(AllData)
                        items.HierarchyData = AllData
                        //setMasterData(newitems.HierarchyData)
                    })
                }
                console.log(Parent)
            
      
      
        }
        if (SubChild != undefined && SubChild.length > 0 && MainParent.length == 0) {
            SubChild?.forEach((val: any) => {
                val.subRows = []
                if (val.Item_x0020_Type == undefined) {
                    MyAllData?.forEach((items: any) => {
                        if (items.Id == val.Id) {
                            val.Item_x0020_Type = items.Item_x0020_Type;
                            val.PortfolioStructureID = items.PortfolioStructureID
                        }
      
                    })
                }
                if (val.Item_x0020_Type != undefined && val.Item_x0020_Type === "Component") {
                    val.SiteIconTitle = "C"
                }
                if (val.Item_x0020_Type != undefined && val.Item_x0020_Type === "SubComponent") {
                    val.SiteIconTitle = "S"
                }
                if (val.Item_x0020_Type != undefined && val.Item_x0020_Type === "Feature") {
                    val.SiteIconTitle = "F"
                }
                //val.subRows(val)
                AllData.push(val)
                ChildData?.forEach((item: any) => {
                    item.subRows = []
                    if (item.Item_x0020_Type == undefined) {
                        MyAllData?.forEach((items: any) => {
                            if (items.Id == val.Id) {
                                val.Item_x0020_Type = items.Item_x0020_Type;
                                val.PortfolioStructureID = items.PortfolioStructureID
                            }
      
                        })
                    }
                    if (item.Item_x0020_Type != undefined && item.Item_x0020_Type === "Component") {
                        item.SiteIconTitle = "C"
                    }
                    if (item.Item_x0020_Type != undefined && item.Item_x0020_Type === "SubComponent") {
                        item.SiteIconTitle = "S"
                    }
                    if (item.Item_x0020_Type != undefined && item.Item_x0020_Type === "Feature") {
                        item.SiteIconTitle = "F"
                    }
      
                    AllData?.forEach((vall: any) => {
                        vall.subRows.push(item)
                    })
                    item.subRows.push(items)
                    item.subRows[0].PortfolioStructureID =items?.Shareweb_x0020_ID
                    item.subRows[0].siteIcon = items?.siteIcon
      
      
                })
                items.HierarchyData = AllData
                //setMasterData(newitems.HierarchyData)
            })
        }
        if (ChildData != undefined && ChildData.length > 0 && SubChild.length == 0 ) {
            ChildData?.forEach((val: any) => {
                val.subRows = []
                if (val.Item_x0020_Type == undefined) {
                    MyAllData?.forEach((items: any) => {
                        if (items.Id == val.Id) {
                            val.Item_x0020_Type = items.Item_x0020_Type;
                            val.PortfolioStructureID = items.PortfolioStructureID
                        }
      
                    })
                }
                if (val.Item_x0020_Type != undefined && val.Item_x0020_Type === "Component") {
                    val.SiteIconTitle = "C"
                }
                if (val.Item_x0020_Type != undefined && val.Item_x0020_Type === "SubComponent") {
                    val.SiteIconTitle = "S"
                }
                if (val.Item_x0020_Type != undefined && val.Item_x0020_Type === "Feature") {
                    val.SiteIconTitle = "F"
                }
      
                AllData.push(val)
               val.subRows.push(items)
                val.subRows[0].PortfolioStructureID = items?.Shareweb_x0020_ID
                val.subRows[0].siteIcon = items?.siteIcon
                console.log(AllData)
               // items.HierarchyData = AllData
               // setMasterData(newitems.HierarchyData)
               // setData(AllData)
            })
            
            //  finalData = AllData.filter((val: any, id: any, array: any) => {

            //     return array.indexOf(val) == id;
            // })
        }
    }
    catch (error) {
        return Promise.reject(error);
    }
        
        return AllData;
}
const sp = spfi();
export const getData = async (url: any, listId: any, query: any) => {
    const web = new Web(url);
    let result;
    try {
        result = (await web.lists.getById(listId).items.select(query).getAll());
    }
    catch (error) {
        return Promise.reject(error);
    }

    return result;

}

export const addData = async (url: any, listId: any, item: any) => {
    const web = new Web(url);
    let result;
    try {
        result = (await web.lists.getById(listId).items.add(item));
    }
    catch (error) {
        return Promise.reject(error);
    }
    return result;
}

export const updateItemById = async (url: any, listId: any, item: any, itemId: any) => {
    const web = new Web(url);
    let result;
    try {
        result = (await web.lists.getById(listId).items.getById(itemId).update(item));
    }
    catch (error) {
        return Promise.reject(error);
    }
    return result;
}

export const deleteItemById = async (url: any, listId: any, item: any, itemId: any) => {
    const web = new Web(url);
    let result;
    try {
        result = (await web.lists.getById(listId).items.getById(itemId).delete());
    }
    catch (error) {
        return Promise.reject(error);
    }
    return result;
}

export const getTaskId = (item: any) => {
    let Shareweb_x0020_ID = undefined;
    try {

        if (item != undefined && item.SharewebTaskType == undefined) {
            Shareweb_x0020_ID = 'T' + item.Id;
        }
        else if (item.SharewebTaskType != undefined && (item.SharewebTaskType.Title == 'Task' || item.SharewebTaskType.Title == 'MileStone') && item.SharewebTaskLevel1No == undefined && item.SharewebTaskLevel2No == undefined) {
            Shareweb_x0020_ID = 'T' + item.Id;
            if (item.SharewebTaskType.Title == 'MileStone')
                Shareweb_x0020_ID = 'M' + item.Id;
        }
        else if (item.SharewebTaskType != undefined && (item.SharewebTaskType.Title == 'Activities' || item.SharewebTaskType.Title == 'Project') && item.SharewebTaskLevel1No != undefined) {
            if (item.Component != undefined) {
                if (item.Component != undefined && item.Component.length > 0) {
                    Shareweb_x0020_ID = 'CA' + item.SharewebTaskLevel1No;
                }
            }
            if (item.Services != undefined) {
                if (item.Services != undefined && item.Services.length > 0) {
                    Shareweb_x0020_ID = 'SA' + item.SharewebTaskLevel1No;
                }
            }
            if (item.Events != undefined) {
                if (item.Events != undefined && item.Events.length > 0) {
                    Shareweb_x0020_ID = 'EA' + item.SharewebTaskLevel1No;
                }
            }
            if (item.Component != undefined && item.Events != undefined && item.Services != undefined) {
                if (item.Events.length > 0 && item.Services.length > 0 && item.Component.length > 0)
                    Shareweb_x0020_ID = 'A' + item.SharewebTaskLevel1No;
            }
            if (item.Component == undefined && item.Events == undefined && item.Services == undefined) {
                Shareweb_x0020_ID = 'A' + item.SharewebTaskLevel1No;
            }
            if (item.SharewebTaskType.Title == 'Project')
                Shareweb_x0020_ID = 'P' + item.SharewebTaskLevel1No;

            if (item.Component.length === 0 && item.Services.length === 0) {
                Shareweb_x0020_ID = 'A' + item.SharewebTaskLevel1No;
            }
        }
        else if (item.SharewebTaskType != undefined && (item.SharewebTaskType.Title == 'Workstream' || item.SharewebTaskType.Title == 'Step') && item.SharewebTaskLevel1No != undefined && item.SharewebTaskLevel2No != undefined) {
            if (item.Component != undefined && item.Services != undefined && item.Events != undefined) {
                // if (!item.Events.results.length > 0 && !item.Services.results.length > 0 && !item.Component.results.length > 0) {
                Shareweb_x0020_ID = 'A' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No;
                // }
            }
            if (item.Component != undefined) {
                if (item.Component != undefined && item.Component.length > 0) {
                    Shareweb_x0020_ID = 'CA' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No;
                }
            }
            if (item.Services != undefined) {
                if (item.Services != undefined && item.Services.length > 0) {
                    Shareweb_x0020_ID = 'SA' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No;
                }
            }
            if (item.Events != undefined) {
                if (item.Events != undefined && item.Events.length > 0) {
                    Shareweb_x0020_ID = 'EA' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No;
                }
            }
            if (item.Component.length == 0 || item.Component == undefined && item.Services.length == 0 || item.Services == undefined && item.Events == undefined) {
                Shareweb_x0020_ID = 'A' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No;
            }
            if (item.SharewebTaskType.Title == 'Step')
                Shareweb_x0020_ID = 'P' + item.SharewebTaskLevel1No + '-S' + item.SharewebTaskLevel2No;

        }
        else if (item.SharewebTaskType != undefined && (item.SharewebTaskType.Title == 'Task' || item.SharewebTaskType.Title == 'MileStone') && item.SharewebTaskLevel1No != undefined && item.SharewebTaskLevel2No != undefined) {
            if (item.Component != undefined && item.Services != undefined && item.Events != undefined) {
                // if (!item.Events.results.length > 0 && !item.Services.results.length > 0 && !item.Component.results.length > 0) {
                Shareweb_x0020_ID = 'A' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No + '-T' + item.Id;
                //  }
            }
            if (item.Component != undefined) {
                if (item.Component != undefined && item.Component.length > 0) {
                    Shareweb_x0020_ID = 'CA' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No + '-T' + item.Id;
                }
            }
            if (item.Services != undefined) {
                if (item.Services != undefined && item.Services.length > 0) {
                    Shareweb_x0020_ID = 'SA' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No + '-T' + item.Id;
                }
            }
            if (item.Events != undefined) {
                if (item.Events != undefined && item.Events.length > 0) {
                    Shareweb_x0020_ID = 'EA' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No + '-T' + item.Id;
                }
            }
            if (item.Component == undefined && item.Services == undefined && item.Events == undefined) {
                Shareweb_x0020_ID = 'A' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No + '-T' + item.Id;
            }
            if (item.SharewebTaskType.Title == 'MileStone') {
                Shareweb_x0020_ID = 'P' + item.SharewebTaskLevel1No + '-S' + item.SharewebTaskLevel2No + '-M' + item.Id;
            }
        }
        else if (item.SharewebTaskType != undefined && (item.SharewebTaskType.Title == 'Task' || item.SharewebTaskType.Title == 'MileStone') && item.SharewebTaskLevel1No != undefined && item.SharewebTaskLevel2No == undefined) {
            if (item.Component != undefined && item.Services != undefined && item.Events != undefined) {
                //  if (!item.Events.results.length > 0 && !item.Services.results.length > 0 && !item.Component.results.length > 0) {
                Shareweb_x0020_ID = 'A' + item.SharewebTaskLevel1No + '-T' + item.Id;
                // }
            }
            if (item.Component != undefined) {
                if (item.Component != undefined && item.Component.length > 0) {
                    Shareweb_x0020_ID = 'CA' + item.SharewebTaskLevel1No + '-T' + item.Id;
                }
            }
            if (item.Services != undefined) {
                if (item.Services != undefined && item.Services.length > 0) {
                    Shareweb_x0020_ID = 'SA' + item.SharewebTaskLevel1No + '-T' + item.Id;
                }
            }
            if (item.Events != undefined) {
                if (item.Events != undefined && item.Events.length > 0) {
                    Shareweb_x0020_ID = 'EA' + item.SharewebTaskLevel1No + '-T' + item.Id;
                }
            }
            if (item.Component == undefined && item.Services == undefined && item.Events == undefined) {
                Shareweb_x0020_ID = 'A' + item.SharewebTaskLevel1No + '-T' + item.Id;
            }
            if (item.SharewebTaskType.Title == 'MileStone') {
                Shareweb_x0020_ID = 'P' + item.SharewebTaskLevel1No + '-M' + item.Id;
            }

        }
    }
    catch (error) {
        return Promise.reject(error);
    }
    return Shareweb_x0020_ID;
}

export const loadTaskUsers = async () => {
    let taskUser;
    try {
        let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
        taskUser = await web.lists
            .getById('b318ba84-e21d-4876-8851-88b94b9dc300')
            .items
            .select("Id,UserGroupId,Suffix,Title,Email,SortOrder,Role,IsShowTeamLeader,Company,ParentID1,Status,Item_x0020_Cover,AssingedToUserId,isDeleted,AssingedToUser/Title,AssingedToUser/Id,AssingedToUser/EMail,ItemType,Approver/Id,Approver/Title,Approver/Name&$expand=AssingedToUser,Approver")
            .get();
    }
    catch (error) {
        return Promise.reject(error);
    }
    return taskUser;
}
export const parseJSON = (jsonItem: any) => {
    var json = [];
    try {
        json = JSON.parse(jsonItem);
    } catch (err) {
        console.log(err);
    }
    return json;
};
export const GetIconImageUrl = (listName: any, listUrl: any, Item: any) => {
    var IconUrl = '';
    if (listName != undefined) {
        let TaskListsConfiguration = parseJSON(GlobalConstants.LIST_CONFIGURATIONS_TASKS);
        let TaskListItem = TaskListsConfiguration.filter(function (filterItem: any) {
            let SiteRelativeUrl = filterItem.siteUrl;
            return (filterItem.Title.toLowerCase() == listName.toLowerCase() && SiteRelativeUrl.toLowerCase() == (listUrl).toLowerCase());
        });
        if (TaskListItem.length > 0) {
            if (Item == undefined) {
                IconUrl = TaskListItem[0].ImageUrl;
            }
            else if (TaskListItem[0].ImageInformation != undefined) {
                var IconUrlItem = (TaskListItem[0].ImageInformation.filter(function (index: any, filterItem: any) { return filterItem.ItemType == Item.Item_x0020_Type && filterItem.PortfolioType == Item.Portfolio_x0020_Type }));
                if (IconUrlItem != undefined && IconUrlItem.length > 0) {
                    IconUrl = IconUrlItem[0].ImageUrl;
                }
            }
        }
    }
    return IconUrl;
}
export const makePostDataForApprovalProcess = async (postData: any) => {
    var TaskUsers: any = [];
    await loadTaskUsers().then(function (data) {
        TaskUsers = data;
        var UserManager: any[] = [];
        TaskUsers.map((user: any) => {
            if (user?.Approver?.results?.length > 0) {
                user.Approver.results.map((approver: any) => {
                    UserManager.push(approver?.Id)
                })
            }
        })
        var Item = { TaskUsers: '', postData: '' };
        if ((postData?.Categories?.toLowerCase().indexOf('approval') > -1) && UserManager != undefined && UserManager?.length > 0) {
            //postData.PercentComplete = 0.01;
            //postData.Status = "For Approval";
            var isAvailable = false;
            if (postData?.Responsible_x0020_TeamId?.results?.length > 0) {
                postData.Responsible_x0020_TeamId.results.map((user: any) => {
                    UserManager.map((ID: any) => {
                        if (ID == user) {
                            isAvailable = true;
                        }
                    })
                })
            }
            if (!isAvailable) {
                var TeamMembersID: any[] = [];
                if (postData?.Team_x0020_MembersId?.results?.length > 0) {
                    postData.Team_x0020_MembersId.results((user: any) => {
                        UserManager.map((ID: any) => {
                            if (ID == user) {
                                TeamMembersID.push(user);
                            }
                        })
                    })
                }
                UserManager.map((ID: any) => {
                    TeamMembersID.push(ID);
                })
                postData.Team_x0020_MembersId = { results: TeamMembersID };
            }
            if (postData?.AssignedToId?.results?.length > 0 && UserManager?.length > 0) {
                UserManager.map((ID: any) => {
                    postData.AssignedToId.results.push(ID);
                })
            }
            else {
                postData.AssignedToId = { results: UserManager };
            }
        }
        Item.TaskUsers = TaskUsers;
        Item.postData = postData;
        Promise.resolve(Item);
    },
        function (error) {
            Promise.reject(error)
        });
    return Promise;

}
export const GetImmediateTaskNotificationEmails = async (item: any, isLoadNotification: any, rootsite: any) => {
    let pageContent = await pageContext()
    var isLoadNotification = isLoadNotification;
    var CurrentItem = item;
    var Allmail: any[] = [];
    var query = ''
    if ((item != undefined) && (item.PercentComplete == 80 || item.PercentComplete == 93)) {
        query = "Id,Title,IsTaskNotifications,AssingedToUser/Title,AssingedToUser/EMail,AssingedToUser/Name,AssingedToUser/Id&$expand=AssingedToUser&$filter=TaskStatusNotification eq " + item?.PercentComplete + "";
    }
    if ((item?.PercentComplete == 80 && item?.newCategories == 'Immediate') || (item?.PercentComplete == 90 && item?.newCategories == 'Immediate') || (item?.PercentComplete == 90 && item?.newCategories == 'Email Notification')) {
        query = "Id,Title,IsTaskNotifications,AssingedToUser/Title,AssingedToUser/EMail,AssingedToUser/Name,AssingedToUser/Id&$expand=AssingedToUser&$filter=TaskStatusNotification eq " + item?.PercentComplete + " or AssingedToUser/Id eq " + item?.Author?.Id + "";
    }
    if (item?.PercentComplete == 5 && item?.newCategories == 'Immediate') {
        query = "Id,Title,IsTaskNotifications,AssingedToUser/Title,AssingedToUser/EMail,AssingedToUser/Name,AssingedToUser/Id&$expand=AssingedToUser&$filter= AssingedToUser/Id eq " + item?.Author?.Id + "";
    }
    if (item == undefined) {
        query = "Id,Title,IsTaskNotifications,Email,AssingedToUser/Title,AssingedToUser/EMail,AssingedToUser/Name,AssingedToUser/Id&$expand=AssingedToUser&$filter=IsTaskNotifications eq 1"

    }
    if (item?.TeamLeadersId != undefined) {
        var filter = '';
        if (item?.TeamLeadersId != undefined) {
            item.TeamLeadersId.map((UserId: any, indexing: any) => {
                if (item.TeamLeadersId.length - 1 != indexing)
                    filter = filter + 'AssingedToUser/Id eq ' + UserId + ' or ';
                else
                    filter = filter + 'AssingedToUser/Id eq ' + UserId;
            })
        } else {
            item.TeamLeadersId.map((UserId: any, indexing: any) => {
                if (item.TeamLeadersId.length - 1 != indexing)
                    filter = filter + 'AssingedToUser/Id eq ' + UserId + ' or ';
                else
                    filter = filter + 'AssingedToUser/Id eq ' + UserId;
            })
        }
        query = "Id,Title,IsTaskNotifications,AssingedToUser/Title,AssingedToUser/EMail,Email,AssingedToUser/Name,AssingedToUser/Id&$expand=AssingedToUser&$filter=" + filter;
    }
    else if (item?.TeamLeadersId?.length == 0 && isLoadNotification == 'ApprovalMail') {
        query = "Id,Title,IsTaskNotifications,AssingedToUserId,Approver/Title,Approver/EMail,Email,Approver/Name,Approver/Id&$expand=Approver";
    }
    if (query != undefined && query != '') {
        var listID = rootsite != undefined ? rootsite.TaskUserlistId : GlobalConstants.ADMIN_TASK_USERS_LISTID;
        await getData(rootsite != undefined ? rootsite.SiteUrl : pageContent?.WebFullUrl, listID, query)
            .then((data: any) => {
                var Allusers = data?.data
                if (item != undefined && item.TeamLeadersId != undefined && isLoadNotification != undefined && isLoadNotification != '' && isLoadNotification == 'ApprovalMail') {
                    Allusers.map((user: any) => {
                        if (CurrentItem?.Author?.Id == user?.AssingedToUserId) {
                            if (user?.Approver?.results?.length > 0)
                                user.Approver.results.map((approver: any) => {
                                    Allmail.push(approver?.EMail);
                                })
                        }
                    })
                }
                else {
                    Allusers.map((user: any) => {
                        if (user?.Email != null || user?.Email != undefined) {
                            Allmail.push(user?.Email);
                        }
                        else if (user.AssingedToUser != undefined) {
                            if (user.AssingedToUser.EMail != null || user.AssingedToUser.EMail != undefined) {
                                Allmail.push(user?.AssingedToUser?.EMail);
                            }
                        }
                    })
                }
                if (Allmail == undefined || Allmail.length == 0 && isLoadNotification == 'ApprovalMail')
                    alert("User has no Approver to send an email");
                Promise.resolve(Allmail);

            },
                function (error) {
                    Promise.reject();
                });
    }
    else {
        Promise.resolve(Allmail);

        if (isLoadNotification == 'ApprovalMail')
            alert("User has no Approver to send an email");
    }
    return Promise;

}

export const getMultiUserValues = (item: any) => {
    var users = '';
    var isuserexists = false;
    var userarray = [];
    if (item?.AssignedTo?.results != undefined)
        userarray = item.AssignedTo.results;
    for (var i = 0; i < userarray.length; i++) {
        users += userarray[i].Title + ', ';
    }
    if (users.length > 0)
        users = users.slice(0, -2);
    return users;
};
export const getListNameFromItemProperties = (item: any) => {
    var listName = [];
    var metadataType = item.__metadata.type;
    if (metadataType != undefined)
        listName = metadataType.split('.');
    listName = listName[2];
    if (listName != undefined)
        listName = listName.substr(0, listName.indexOf('ListItem'));
    return listName;
}

export const ConvertLocalTOServerDate = async (LocalDateTime: any, dtformat: any) => {
    if (dtformat == undefined || dtformat == '') dtformat = "DD/MM/YYYY";

    // below logic works fine in all condition 
    if (LocalDateTime != '') {
        var serverDateTime;
        var vLocalDateTime = new Date(LocalDateTime);
        //var offsetObj = GetServerOffset();
        //var IANATimeZoneName = GetIANATimeZoneName();
        var mDateTime = moment(LocalDateTime);
        serverDateTime = mDateTime.tz('Europe/Berlin').format(dtformat); // 5am PDT
        //serverDateTime = mDateTime.tz('America/Los_Angeles').format(dtformat);  // 5am PDT
        return serverDateTime;
    }
    return '';
}

// export const loadRelevantTask = async (SitesTypes:any,query: any) => {
//     let taskUsers: any[]=[];
//     taskUsers=await loadTaskUsers();
//     try {
//         let SiteTaskTaggedToComp: any[] = []
//         let count = 0
//         SitesTypes.map(async (site: any) => {
//             await getData(site?.siteUrl?.Url, site?.listId, query).then((data: any) => {
//                 data.map((item: any) => {

//                     item.siteCover = site?.Item_x005F_x0020_Cover?.Url
//                     item.siteType = site.siteName;
//                     item.TaskName = item.Title;
//                     taskUsers.map((user: any) => {
//                         if (user?.AssingedToUser?.Id == item.Author.Id) {
//                             item.AuthorCover = user?.Item_x0020_Cover?.Url
//                         }
//                         if (user?.AssingedToUser?.Id == item.Editor.Id) {
//                             item.EditorCover = user?.Item_x0020_Cover?.Url
//                         }

//                     })

//                     item.Author = item.Author.Title;
//                     item.Editor = item.Editor.Title;
//                     item.PercentComplete = item?.PercentComplete * 100;
//                     item.Priority = item.Priority_x0020_Rank * 1;
//                     if (item.Categories == null)
//                         item.Categories = '';
//                     //type.Priority = type.Priority.split('')[1];
//                     //type.Component = type.Component.results[0].Title,
//                     item.ComponentTitle = '';
//                     if (item?.Component?.results?.length > 0) {
//                         item.Component.results.map((comResult: any) => {
//                             item.ComponentTitle = comResult.Title + ';' + item.ComponentTitle;
//                         })
//                     }
//                     else {
//                         item.ComponentTitle = '';
//                     }

//                     if (item?.Component?.results?.length > 0) {
//                         item['Portfoliotype'] = 'Component';
//                     }
//                     if (item?.Services?.results?.length > 0) {
//                         item['Portfoliotype'] = 'Service';
//                     }
//                     if (item?.Component?.results?.length > 0 && item?.Services?.results?.length > 0) {
//                         item['Portfoliotype'] = 'Component';
//                     }

//                     item.Shareweb_x0020_ID = getTaskId(item);

//                     item.TaskDueDate = moment(item?.DueDate).format('YYYY-MM-DD');
//                     if (item.TaskDueDate == "Invalid date" || item.TaskDueDate == undefined) {
//                         item.TaskDueDate = '';
//                     }
//                     item.CreateDate = moment(item?.Created).format('YYYY-MM-DD');
//                     item.CreatedSearch = item.CreateDate + '' + item.Author;
//                     item.DateModified = item.Modified;
//                     item.ModifiedDate = moment(item?.Modified).format('YYYY-MM-DD');
//                     item.ModifiedSearch = item.ModifiedDate + '' + item.Editor;
//                     if (item.siteType != 'Offshore Tasks') {
//                         try {
//                             SiteTaskTaggedToComp.push(item);
//                         } catch (error) {
//                             console.log(error.message)
//                         }
//                     }
//                 })
//             })
//             count++;
//             if (count == SitesTypes.length - 1) {
//                 console.log("inside Set Task")
//                 return SiteTaskTaggedToComp
//             }


//         })
//     } catch (error) {
//         return Promise.reject(error);
//     }


// }

export const sendImmediateEmailNotifications = async (itemId: any, siteUrl: any, listId: any, item: any, RecipientMail: any, isLoadNotification: any, rootSite: any) => {
    await GetImmediateTaskNotificationEmails(item, isLoadNotification, rootSite)
        .then(async (ToEmails: any) => {
            if (isLoadNotification == false)
                ToEmails = [];
            if (RecipientMail?.Email != undefined && ToEmails?.length == 0) {
                ToEmails.push(RecipientMail.Email)
            }
            if (ToEmails.length > 0) {
                var query = '';
                query += "AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,AttachmentFiles/FileName,Component/Id,Component/Title,Component/ItemType,component_x0020_link,Categories,FeedBack,component_x0020_link,FileLeafRef,Title,Id,Comments,StartDate,DueDate,Status,Body,Company,Mileage,PercentComplete,FeedBack,Attachments,Priority,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title,SharewebCategories/Id,SharewebCategories/Title,Services/Id,Services/Title,Events/Id,Events/Title,SharewebTaskType/Id,SharewebTaskType/Title,Shareweb_x0020_ID,CompletedDate,SharewebTaskLevel1No,SharewebTaskLevel2No&$expand=AssignedTo,Component,AttachmentFiles,Author,Editor,SharewebCategories,SharewebTaskType,Services,Events&$filter=Id eq " + itemId;
                await getData(siteUrl, listId, query)
                    .then(async (data: any) => {
                        data?.data?.map((item: any) => {
                            item.PercentageCompleted = item?.PercentComplete < 1 ? item?.PercentComplete * 100 : item?.PercentComplete;
                            item.PercentComplete = item?.PercentComplete < 1 ? item?.PercentComplete * 100 : item?.PercentComplete;
                            if (item.PercentageCompleted != undefined) {
                                item.PercentageCompleted = parseInt((item?.PercentageCompleted).toFixed(0));
                            }
                            if (item.PercentComplete != undefined) {
                                item.PercentComplete = parseInt((item?.PercentComplete).toFixed(0));
                            }
                            item.taskLeader = 'None';
                            if (item?.AssignedTo?.results?.length > 0)
                                item.taskLeader = getMultiUserValues(item);
                        })
                        var UpdateItem = data?.data[0];
                        if (item?.PercentComplete != undefined) {
                            item.PercentComplete = item.PercentComplete < 1 ? item.PercentComplete * 100 : item.PercentComplete;
                            item.PercentComplete = parseInt((item.PercentComplete).toFixed(0));

                            item.PercentageCompleted = item.PercentComplete;
                        }
                        if (item?.siteType != undefined) {
                            item.siteType = item.siteType.replace(/_x0020_/g, ' ');
                        }
                        var siteType = getListNameFromItemProperties(UpdateItem);
                        UpdateItem.siteType = '';
                        if (UpdateItem.siteType == '') {
                            if (siteType != undefined) {
                                siteType = siteType.replace(/_x0020_/g, '%20');
                            }
                            UpdateItem.siteType = siteType;
                        }
                        UpdateItem.Shareweb_x0020_ID = getTaskId(UpdateItem);
                        if (UpdateItem?.Author != undefined) {
                            UpdateItem.Author1 = '';
                            UpdateItem.Author1 = UpdateItem.Author.Title;
                        } else
                            UpdateItem.Editor1 = '';
                        if (UpdateItem?.Editor != undefined) {
                            UpdateItem.Editor1 = '';
                            UpdateItem.Editor1 = UpdateItem.Editor.Title;
                        } else
                            UpdateItem.Editor1 = '';
                        if (UpdateItem?.component_x0020_link?.Url != undefined)
                            UpdateItem.URL = UpdateItem.component_x0020_link.Url;
                        else
                            UpdateItem.URL = '';

                        if (UpdateItem?.DueDate != undefined)
                            UpdateItem.DueDate = ConvertLocalTOServerDate(UpdateItem.DueDate, 'DD-MMM-YYYY');
                        else
                            UpdateItem.DueDate = '';
                        if (UpdateItem?.StartDate != undefined)
                            UpdateItem.StartDate = ConvertLocalTOServerDate(UpdateItem.StartDate, 'DD-MMM-YYYY');
                        else
                            UpdateItem.StartDate = '';
                        if (UpdateItem?.CompletedDate != undefined)
                            UpdateItem.CompletedDate = ConvertLocalTOServerDate(UpdateItem.CompletedDate, 'DD-MMM-YYYY');
                        else
                            UpdateItem.CompletedDate = '';

                        if (UpdateItem?.Created != undefined)
                            UpdateItem.Created = ConvertLocalTOServerDate(UpdateItem.Created, 'DD-MMM-YYYY');
                        else
                            UpdateItem.Created = '';
                        if (UpdateItem?.Modified != undefined)
                            UpdateItem.Modified = ConvertLocalTOServerDate(UpdateItem.Modified, 'DD-MMM-YYYY');
                        else
                            UpdateItem.Modified = '';
                        if (UpdateItem?.PercentComplete != undefined)
                            UpdateItem.PercentComplete = UpdateItem.PercentComplete;
                        else
                            UpdateItem.PercentComplete = '';
                        if (UpdateItem?.Priority != undefined)
                            UpdateItem.Priority = UpdateItem.Priority;
                        else
                            UpdateItem.Priority = '';
                        if (UpdateItem?.Body != undefined)
                            UpdateItem.Body = $.parseHTML(UpdateItem.Body)[0]?.textContent;
                        else
                            UpdateItem.Body = '';
                        if (UpdateItem?.Title != undefined)
                            UpdateItem.Title = UpdateItem.Title;
                        else
                            UpdateItem.Title = '';
                        UpdateItem.AssignedToTitle = '';
                        if (UpdateItem?.AssignedTo?.results != undefined) {
                            UpdateItem.AssignedTo.results.map((item: any) => {
                                UpdateItem.AssignedToTitle += item.Title + ';';
                            })
                        }
                        UpdateItem.ComponentName = '';
                        if (UpdateItem?.Component?.results != undefined) {
                            UpdateItem.Component.results.map((item: any) => {
                                UpdateItem.ComponentName += item.Title + ';';
                            })
                        }
                        UpdateItem.Category = '';
                        UpdateItem.Categories = '';
                        if (UpdateItem?.SharewebCategories?.results != undefined) {
                            UpdateItem.SharewebCategories.results.map((item: any) => {
                                UpdateItem.Categories += item.Title + ';';
                                UpdateItem.Category += item.Title + ',';
                            })
                        }
                        var pos = UpdateItem?.Category?.lastIndexOf(',');
                        UpdateItem.Category = UpdateItem?.Category?.substring(0, pos) + UpdateItem?.Category?.substring(pos + 1);
                        var Commentdata = [];
                        UpdateItem.AllComments = '';
                        if (UpdateItem?.Comments != undefined) {
                            Commentdata = JSON.parse(UpdateItem.Comments);
                            Commentdata.map((comment: any) => {
                                UpdateItem.AllComments += '<div colspan="6" style="padding: 9px;border: 1px solid #ccc;background: #fbfbfb;color: #000;margin-top:5px;">' +
                                    '<span>' +
                                    '<div style="margin-bottom:5px;">' +
                                    comment?.AuthorName +
                                    ' - ' +
                                    comment?.Created +
                                    '</div>' +
                                    comment?.Title +
                                    '</span>' +
                                    '</div>'
                            })
                        }
                        UpdateItem.Description = '';
                        if (UpdateItem?.Body != undefined && UpdateItem?.Body != '')
                            UpdateItem.Description = UpdateItem.Body;
                        if (UpdateItem?.FeedBack != undefined) {
                            try {
                                var Description = JSON.parse(UpdateItem?.FeedBack);
                                if (Description?.length > 0) {
                                    UpdateItem.Description = '';
                                    Description[0]?.FeedBackDescriptions?.map((description: any, index: any) => {
                                        var index1 = index + 1;
                                        var Comment = '';
                                        if (description?.Comments?.length > 0) {
                                            description.Comments.map((val: any) => {
                                                Comment += '<div colspan="6" style="padding: 9px;border: 1px solid #ccc;background: #fbfbfb;color: #000;margin-top:5px;">' +
                                                    '<span>' +
                                                    '<div style="margin-bottom:5px;">' +
                                                    val?.AuthorName +
                                                    ' - ' +
                                                    val?.Created +
                                                    '</div>' +
                                                    val?.Title +
                                                    '</span>' +
                                                    '</div>'

                                            })

                                        }
                                        UpdateItem.Description += '<tr><td colspan="1" style="background: #f4f4f4;text - align: left;padding: 10px 5px 10px 5px;color: #6F6F6F;font - family: arial;font - size: 14px;font - weight: bold;border - bottom: 2px solid #fff;border - right: 2px solid #fff;background-color: #fbfbfb;font-size: 13px;flex-basis: 27px !important;border: 1px solid #ccc;"><span>' + index1 + '</span>' +
                                            '</td>' +
                                            '<td colspan="11" style="background: #f4f4f4;text - align: left;padding: 10px 5px 10px 5px;color: #6F6F6F;font - family: arial;font - size: 14px;font - weight: bold;border - bottom: 2px solid #fff;border - right: 2px solid #fff;background-color: #fbfbfb;flex-basis: 100%;background-color: #fff;font-weight: normal;font-size: 13px;color: #000;margin-left: 2px;border: 1px solid #ccc;">' +
                                            '<span>' +
                                            description?.Title +
                                            '</span>' +
                                            Comment +
                                            '</td>' +
                                            '</tr>';
                                        if (description?.Subtext?.length > 0) {
                                            description.Subtext.map((Childdescription: any, Childindex: any) => {
                                                var Childindex1 = Childindex + 1;
                                                var ChildComment = '';
                                                if (Childdescription?.Comments?.length > 0) {
                                                    description.Comments.map((Childval: any) => {
                                                        ChildComment += '<div colspan="6" style="padding: 9px;border: 1px solid #ccc;background: #fbfbfb;color: #000;margin-top:5px;">' +
                                                            '<span>' +
                                                            '<div style="margin-bottom:5px;">' +
                                                            Childval?.AuthorName +
                                                            ' - ' +
                                                            Childval?.Created +
                                                            '</div>' +
                                                            Childval?.Title +
                                                            '</span>' +
                                                            '</div>'

                                                    })

                                                }
                                                UpdateItem.Description += '<tr><td colspan="1" style="background: #f4f4f4;text - align: left;padding: 10px 5px 10px 5px;color: #6F6F6F;font - family: arial;font - size: 14px;font - weight: bold;border - bottom: 2px solid #fff;border - right: 2px solid #fff;background-color: #fbfbfb;font-size: 13px;flex-basis: 27px !important;border: 1px solid #ccc;"><span>' + index1 + '.' + Childindex1 + '</span>' +
                                                    '</td>' +
                                                    '<td colspan="11" style="background: #f4f4f4;text - align: left;padding: 10px 5px 10px 5px;color: #6F6F6F;font - family: arial;font - size: 14px;font - weight: bold;border - bottom: 2px solid #fff;border - right: 2px solid #fff;background-color: #fbfbfb;flex-basis: 100%;background-color: #fff;font-weight: normal;font-size: 13px;color: #000;margin-left: 2px;border: 1px solid #ccc;">' +
                                                    '<span>' +
                                                    Childdescription?.Title +
                                                    '</span>' +
                                                    ChildComment +
                                                    '</td>' +
                                                    '</tr>';
                                            });

                                        }
                                    });
                                }
                                //$scope.AdditionalTimeSpent.push(item.AdditionalTime[0]);
                            } catch (e) {
                                console.log(e)
                            }

                        }
                        let pageContent = await pageContext()
                        var siteUrl = pageContent?.SiteFullUrl + '/sp';
                        var Name = '';
                        var OtherDetails = '';
                        let Subject: any = '';
                        var TaskDescriptionStart = '';
                        var NoOfApprovalTask = '';
                        var TaskDescription = '';
                        var ApprovalRejectionComments = '';
                        var TaskComments = '';
                        var TaskDashBoardURl = '';
                        var ApprovalDashboard = '';
                        var TaskDashBoardTitle = '';
                        var ApprovalDashboardTitle = '';
                        var CC = [];
                        if (item == undefined) {
                            //Subject = "[" + siteType + "-Task] " + UpdateItem.Title + "(" + UpdateItem.Category + ")";
                            Subject = "[" + siteType + " - " + UpdateItem?.Category + " (" + UpdateItem?.PercentComplete + "%)] " + UpdateItem?.Title + "";
                        }
                        else {
                            if (item?.PercentComplete == 5 && item?.newCategories == 'Immediate') {

                                Subject = "[" + item?.siteType + " - " + item?.newCategories + " (" + item?.PercentComplete + "%)] " + item?.Title + "";
                            }
                            if (item?.TeamLeadersId?.length > 0 && item?.CategoriesType == undefined && item?.isApprovalRejection == undefined) {

                                Subject = "[" + item?.siteType + " - " + UpdateItem?.Category + " (" + item?.PercentComplete + "%)] " + item?.Title + "";
                            }
                            if ((item != undefined && (item?.PercentComplete == 80 && item.newCategories == undefined) || (item.PercentComplete == 80 && item.newCategories != undefined && item.newCategories != 'Immediate' && item.newCategories != 'Email Notification'))) {

                                Subject = "[" + item?.siteType + " - " + UpdateItem?.Category + " (" + item?.PercentComplete + "%)] " + item?.Title + "";
                            }
                            if (item != undefined && item?.PercentComplete == 93) {
                                if (item?.newCategories == undefined || item?.newCategories == null)
                                    item.newCategories = '';

                                Subject = "[" + item?.siteType + " - " + item?.newCategories + " (" + item?.PercentComplete + "%)] " + item?.Title + "";
                            }
                            if ((item != undefined && (item?.PercentComplete == 80 && item?.newCategories != undefined && item?.newCategories == 'Immediate'))) {

                                Subject = "[" + item?.siteType + " - " + item?.newCategories + " (" + item?.PercentComplete + "%)] " + item?.Title + "";
                            }

                            if ((item != undefined && (item?.PercentComplete == 90 && item?.newCategories != undefined && item?.newCategories == 'Email Notification'))) {

                                CC.push("deepak@hochhuth-consulting.de");
                                Subject = "[" + item?.siteType + " - " + item?.newCategories + " (" + item?.PercentComplete + "%)] " + item?.Title + "";
                            }
                            if ((item != undefined && (item.PercentComplete == 90 && item.newCategories != undefined && item.newCategories == 'Immediate'))) {
                                CC.push("deepak@hochhuth-consulting.de");
                                Subject = "[" + item?.siteType + " - " + item?.newCategories + " (" + item?.PercentComplete + "%)] " + item?.Title + "";
                            }
                            if ((item?.CategoriesType?.toLowerCase()).indexOf('draft') > -1 || (item?.CategoriesType?.toLowerCase()).indexOf('approval') > -1 && item?.PercentComplete == 1) {
                                CC = [];
                                if (item.CategoriesType != undefined && item.CategoriesType != '')
                                    item.CategoriesType = item?.CategoriesType?.replaceAll(';', ',')
                                Subject = "[" + item?.siteType + " - " + item?.CategoriesType + " (" + item?.PercentComplete + "%)] " + item?.Title + "";
                                TaskDescriptionStart = 'Hi,';
                                TaskDescription = UpdateItem?.Author1 + ' has created a Task which requires your Approval.Please take your time and review:';
                                if (item?.TotalApprovalTask != undefined && item?.TotalApprovalTask != 0)
                                    NoOfApprovalTask = 'Please note that you still have ' + item?.TotalApprovalTask + ' tasks left to approve.You can find all pending approval tasks on your task dashboard or the approval page.';
                                TaskDashBoardURl = 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/TaskDashboard.aspx';
                                ApprovalDashboard = 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/TaskManagement.aspx?SmartfavoriteId=101&smartfavorite=All%20Approval%20Tasks';
                                var TaskDashBoardTitle = 'Your Task Dashboard';
                                var ApprovalDashboardTitle = 'Your Approval Page';

                            }
                            if ((item != undefined && (item?.isApprovalRejection != undefined && item?.isApprovalRejection))) {
                                CC = [];
                                Subject = "[" + item?.siteType + " (" + item?.PercentComplete + "%)] " + item?.Title + " Approved";
                                TaskDescriptionStart = 'Hi,';
                                TaskDescription = 'Your task has been approved by ' + item?.ApproverName + ', team will process it further. Refer Approval Comments.';
                                TaskComments = item?.TaskComments;
                                ApprovalRejectionComments = '<tr><td style="border: 1px solid #ccc;background: #f4f4f4;"><b style="font-size: 13px;">Approval Comments:</b> </td><td colspan="7" style="border: 1px solid #ccc;background: #fafafa;"><span style="font-size: 13px; margin-left:13px">' +
                                    TaskComments + '</span> </td>' +
                                    '</tr>'
                            }
                            if ((item != undefined && (item?.isApprovalRejection != undefined && !item?.isApprovalRejection))) {
                                CC = [];
                                Subject = "[" + item?.siteType + " (" + item?.PercentComplete + "%)] " + item?.Title + " Rejected";
                                TaskDescriptionStart = 'Hi,';
                                TaskDescription = 'Your task has been rejected by ' + item?.ApproverName + '. Refer Reject Comments.';
                                TaskComments = item.TaskComments;
                                ApprovalRejectionComments = '<tr><td style="border: 1px solid #ccc;background: #f4f4f4;"><b style="font-size: 13px;">Rejection Comments:</b> </td><td colspan="7" style="border: 1px solid #ccc;background: #fafafa;"><span style="font-size: 13px; margin-left:13px">' +
                                    TaskComments + '</span> </td>' +
                                    '</tr>';
                            }
                            //------
                            if (item?.PercentComplete == 2 && item?.Categories != undefined && RecipientMail != undefined) {
                                CC = [];
                                Subject = "[" + item?.siteType + " - Immediate - Follow up(2 %)] " + item?.Title;
                                TaskDescriptionStart = "Hi " + RecipientMail?.Title + ",";
                                TaskDescription = 'Your immediate attention required on this task please review and respond ASAP.';
                            }
                            //---------
                        }
                        if (Subject == undefined || Subject == '') {
                            if (UpdateItem?.PercentComplete != undefined && UpdateItem?.PercentComplete != '' && UpdateItem?.PercentComplete != 1 && UpdateItem?.Category != undefined && UpdateItem?.Category != '' && UpdateItem?.Category.toLowerCase('approval') > -1)
                                item.CategoriesType = item?.Category?.replace('Approval,', '')
                            Subject = "[" + siteType + " - " + UpdateItem?.Category + " (" + UpdateItem?.PercentComplete + "%)] " + UpdateItem?.Title + "";
                        }
                        if (UpdateItem?.PercentComplete != 1) {
                            Subject = Subject?.replaceAll('Approval,', '')
                            Subject = Subject?.replaceAll('Normal Approval,', '')
                            Subject = Subject?.replaceAll('Normal Approval', '')
                            Subject = Subject?.replaceAll('Quick Approval,', '')
                            Subject = Subject?.replaceAll('Quick Approval', '')
                            Subject = Subject?.replaceAll('Complex Approval,', '')
                            Subject = Subject?.replaceAll('Complex Approval', '')
                            Subject = Subject?.replaceAll(',,', ',')
                        }
                        if (UpdateItem?.PercentComplete == 1 && UpdateItem?.Category?.toLowerCase().indexOf('approval') > -1) {
                            //Subject = Subject.replaceAll('Approval,', '')
                            //if (Subject.indexOf('Normal Approval') <= -1 && Subject.indexOf('Quick Approval') <= -1 && Subject.indexOf('Complex Approval') <= -1)
                            //    Subject = Subject.replaceAll('Approval', '')
                            //Subject = Subject.replaceAll(',,', ',')
                            Subject = "[" + siteType + " - " + "Approval" + "] " + UpdateItem?.Title + "";
                            if (UpdateItem?.Category?.toLowerCase().indexOf('email notification') > -1 && UpdateItem?.Category?.toLowerCase().indexOf('immediate') > -1) {
                                Subject = "[" + siteType + " - " + "Approval,Email notification,Immediate" + "] " + UpdateItem?.Title + "";
                            }
                            else if (UpdateItem?.Category?.toLowerCase().indexOf('email notification') > -1) {
                                Subject = "[" + siteType + " - " + "Approval,Email notification" + "] " + UpdateItem?.Title + "";
                            }
                            else if (UpdateItem?.Category?.toLowerCase().indexOf('immediate') > -1) {
                                Subject = "[" + siteType + " - " + "Approval,Immediate" + "] " + UpdateItem?.Title + "";
                            }
                        }
                        var body =
                            '<div>' +
                            '</div>' +
                            '<div style="margin-top:4px">' +
                            TaskDescriptionStart +
                            '</div>' +
                            '<div style="margin-top:6px">' +
                            TaskDescription +
                            '</div>'
                            + '<div style="margin-top:10px">' +
                            NoOfApprovalTask +
                            '</div>'
                            + '<div style="margin-top:10px;">' +
                            '<a style="padding-right: 17px;" href =' + TaskDashBoardURl + '>' + TaskDashBoardTitle + '</a>' +
                            '<a href =' + ApprovalDashboard + '>' + ApprovalDashboardTitle + '</a>' +
                            '</div>'
                            + '<div style="margin-top:15px">' +
                            '<a href =' + siteUrl + '/SitePages/Task-Profile.aspx?taskId=' + UpdateItem?.Id + '&Site=' + siteType + '>' +
                            UpdateItem?.Title + '</a>' +
                            '</div>' +
                            '<table style="width:100%">' +
                            '<tbody>' +
                            '<td style="width:70%;vertical-align: top;">' +
                            '<table style="width:99%;">' +
                            '<tbody>' +
                            '<tr>'
                            + '<tr><td style="border: 1px solid #ccc;background: #f4f4f4;"><b style="font-size: 13px;">Task Id:</b></td><td colspan="2" style="border: 1px solid #ccc;background: #fafafa;"> <span style="font-size: 13px; margin-left:13px" >' +
                            UpdateItem?.Shareweb_x0020_ID + '</span></td>' +
                            '<td style="border: 1px solid #ccc;background: #f4f4f4;"><b style="font-size: 13px;">Component:</b></td><td colspan="2" style="border: 1px solid #ccc;background: #fafafa;"> <span style="font-size: 13px; margin-left:13px" >' +
                            UpdateItem?.ComponentName + '</span> </td>' +
                            '<td style="border: 1px solid #ccc;background: #f4f4f4;"><b style="font-size: 13px;">Priority:</b></td><td colspan="2" style="border: 1px solid #ccc;background: #fafafa;"> <span style="font-size: 13px; margin-left:13px" >' +
                            UpdateItem?.Priority + '</span> </td>' +
                            '</tr>' +
                            '<tr><td style="border: 1px solid #ccc;background: #f4f4f4;"><b style="font-size: 13px;">Start Date:</b></td><td colspan="2" style="border: 1px solid #ccc;background: #fafafa;"> <span style="font-size: 13px; margin-left:13px" >' +
                            UpdateItem?.StartDate + '</span></td>' +
                            '<td style="border: 1px solid #ccc;background: #f4f4f4;"><b style="font-size: 13px;">Completion Date:</b></td><td colspan="2" style="border: 1px solid #ccc;background: #fafafa;"> <span style="font-size: 13px; margin-left:13px" >' +
                            UpdateItem?.CompletedDate + '</span> </td>' +
                            '<td style="border: 1px solid #ccc;background: #f4f4f4;"><b style="font-size: 13px;">Due Date:</b></td><td colspan="2" style="border: 1px solid #ccc;background: #fafafa;"> <span style="font-size: 13px; margin-left:13px" >' +
                            UpdateItem?.DueDate + '</span> </td>' +
                            '</tr>' +
                            '<tr><td style="border: 1px solid #ccc;background: #f4f4f4;"><b style="font-size: 13px;">Team Members:</b></td><td colspan="2" style="border: 1px solid #ccc;background: #fafafa;"> <span style="font-size: 13px; margin-left:13px" >' +
                            UpdateItem?.AssignedToTitle + '</span></td>' +
                            '<td style="border: 1px solid #ccc;background: #f4f4f4;"><b style="font-size: 13px;">Created By:</b></td><td colspan="2" style="border: 1px solid #ccc;background: #fafafa;"> <span style="font-size: 13px; margin-left:13px" >' +
                            UpdateItem?.Author1 + '</span> </td>' +
                            '<td style="border: 1px solid #ccc;background: #f4f4f4;"><b style="font-size: 13px;">Created:</b></td><td colspan="2" style="border: 1px solid #ccc;background: #fafafa;"> <span style="font-size: 13px; margin-left:13px" >' +
                            UpdateItem?.Created + '</span> </td>' +
                            '</tr>' +
                            '<tr><td style="border: 1px solid #ccc;background: #f4f4f4;"><b style="font-size: 13px;">Categories:</b></td><td colspan="2" style="border: 1px solid #ccc;background: #fafafa;"> <span style="font-size: 13px; margin-left:13px" >' +
                            UpdateItem?.Categories + '</span></td>' +
                            '<td style="border: 1px solid #ccc;background: #f4f4f4;"><b style="font-size: 13px;">Status:</b></td><td colspan="2" style="border: 1px solid #ccc;background: #fafafa;"> <span style="font-size: 13px; margin-left:13px" >' +
                            UpdateItem?.Status + '</span> </td>' +
                            '<td style="border: 1px solid #ccc;background: #f4f4f4;"><b style="font-size: 13px;">% Complete:</b></td><td colspan="2" style="border: 1px solid #ccc;background: #fafafa;"> <span style="font-size: 13px; margin-left:13px" >' +
                            UpdateItem?.PercentComplete + '%</span> </td>' +
                            '</tr>' +
                            '<tr><td style="border: 1px solid #ccc;background: #f4f4f4;"><b style="font-size: 13px;">URL:</b> </td><td colspan="7" style="border: 1px solid #ccc;background: #fafafa;"><span style="font-size: 13px; margin-left:13px">' +
                            UpdateItem?.URL + '</span> </td>' +
                            '</tr>' +
                            ApprovalRejectionComments +
                            '</tr> ' +
                            '</tr>' +
                            '</tr>' +
                            '<tr>' +
                            '</tbody>' +
                            '</table>' +
                            '<table style="width:99%;margin-top: 10px;">' +
                            '<tbody>' +
                            '<tr>' + UpdateItem?.Description + '</tr>' +
                            '</tbody>' +
                            '</table>' +
                            '</td>' +
                            '<td style="width:22%">' +
                            '<table style="border:1px solid #ddd;border-radius:4px;margin-bottom:25%;width:100%">' +
                            '<tbody>' +
                            '<tr>' +
                            '<td style="color:#333; background-color:#f5f5f5;border-bottom:1px solid #ddd">Comments:' + '</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td>' + UpdateItem?.AllComments + '</td>' +
                            '</tr>' +
                            '</tbody>' +
                            '</table>' +
                            '</td>' +
                            '</tr>' +
                            '</tbody>' +
                            '</table>' +
                            '</td>' +
                            '</tr>' +
                            '</tbody>' +
                            '</table>';
                        if (CC.length > 1)
                            CC.splice(1, 1);
                        //'<tr><td colspan="7" style="background: #f4f4f4;text - align: left;padding: 10px 5px 10px 5px;color: #6F6F6F;font - family: arial;font - size: 14px;font - weight: bold;border - bottom: 2px solid #fff;border - right: 2px solid #fff;background-color: #fbfbfb;flex-basis: 100%;background-color: #fff;font-weight: normal;font-size: 13px;color: #000;margin-left: 2px;border: 1px solid #ccc;">' + UpdateItem.Description + '</td></tr>' +
                        if (RecipientMail?.length > 0) {
                            if (ToEmails == undefined) {
                                ToEmails = [];
                            }
                            RecipientMail.map((mail: any) => {
                                ToEmails.push(mail.Email);
                            })

                        }
                        var from = '',
                            to = ToEmails,
                            cc = CC,
                            body = body,
                            subject = Subject,
                            ReplyTo = "deepak@hochhuth-consulting.de";
                        sendEmail(from, to, body, subject, ReplyTo, cc);
                    }, function (error) {
                        console.log(error);
                    })
            }
        },

            function (error) { });
}
export const sendEmail = async (from: any, to: any, body: any, subject: any, ReplyTo: any, cc: any) => {

    let result;
    try {
        result = (await sp.utility.sendEmail({
            To: ['abhishek.tiwari@smalsus.com'],
            Subject: subject,
            Body: body
        }));
    }
    catch (error) {
        return Promise.reject(error);
    }

    return result;

}
export const getPortfolio = async (type: any) => {
    let result;
    try {
        var RootComponentsData: any[] = []; var ComponentsData: any[] = [];
        var SubComponentsData: any[] = [];
        var FeatureData: any[] = [];
        if (type != undefined) {
            let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
            let componentDetails = [];
            if (type == 'All') {
                componentDetails = await web.lists
                    .getById(GlobalConstants.MASTER_TASKS_LISTID)
                    .items
                    .select("ID", "Title", "DueDate", "Status", "ItemRank", "Item_x0020_Type", "Parent/Id", "Author/Id", "Author/Title", "Parent/Title", "SharewebCategories/Id", "SharewebCategories/Title", "AssignedTo/Id", "AssignedTo/Title", "Team_x0020_Members/Id", "Team_x0020_Members/Title", "ClientCategory/Id", "ClientCategory/Title")
                    .expand("Team_x0020_Members", "Author", "ClientCategory", "Parent", "SharewebCategories", "AssignedTo", "ClientCategory")
                    .top(4999)
                    .get()
            } else {
                componentDetails = await web.lists
                    .getById(GlobalConstants.MASTER_TASKS_LISTID)
                    .items
                    .select("ID", "Title", "DueDate", "Status", "ItemRank", "Item_x0020_Type", "Parent/Id", "Author/Id", "Author/Title", "Parent/Title", "SharewebCategories/Id", "SharewebCategories/Title", "AssignedTo/Id", "AssignedTo/Title", "Team_x0020_Members/Id", "Team_x0020_Members/Title", "ClientCategory/Id", "ClientCategory/Title")
                    .expand("Team_x0020_Members", "Author", "ClientCategory", "Parent", "SharewebCategories", "AssignedTo", "ClientCategory").filter("Portfolio_x0020_Type eq '" + type + "'")
                    .top(4999)
                    .get()
            }



            let Response: ArrayLike<any> = [];
            Response = await loadTaskUsers();

            $.each(componentDetails, function (index: any, result: any) {

                result.TitleNew = result.Title;
                result.TeamLeaderUser = []
                result.DueDate = moment(result.DueDate).format('DD/MM/YYYY')

                if (result.DueDate == 'Invalid date' || '') {
                    result.DueDate = result.DueDate.replaceAll("Invalid date", "")
                }
                if (result.PercentComplete != undefined)
                    result.PercentComplete = (result.PercentComplete * 100).toFixed(0);

                if (result.Short_x0020_Description_x0020_On != undefined) {
                    result.Short_x0020_Description_x0020_On = result.Short_x0020_Description_x0020_On.replace(/(<([^>]+)>)/ig, '');
                }

                if (result.AssignedTo != undefined && result.AssignedTo.length > 0) {
                    $.each(result.AssignedTo, function (index: any, Assig: any) {
                        if (Assig.Id != undefined) {
                            $.each(Response, function (index: any, users: any) {

                                if (Assig.Id != undefined && users.AssingedToUserId != undefined && Assig.Id == users.AssingedToUserId) {
                                    users.ItemCover = users.Item_x0020_Cover;
                                    result.TeamLeaderUser.push(users);
                                }

                            })
                        }
                    })
                }
                if (result.Team_x0020_Members != undefined && result.Team_x0020_Members.length > 0) {
                    $.each(result.Team_x0020_Members, function (index: any, Assig: any) {
                        if (Assig.Id != undefined) {
                            $.each(Response, function (index: any, users: any) {
                                if (Assig.Id != undefined && users.AssingedToUserId != undefined && Assig.Id == users.AssingedToUserId) {
                                    users.ItemCover = users.Item_x0020_Cover;
                                    result.TeamLeaderUser.push(users);
                                }

                            })
                        }
                    })
                }

                if (result.ClientCategory != undefined && result.ClientCategory.length > 0) {
                    $.each(result.Team_x0020_Members, function (index: any, catego: any) {
                        result.ClientCategory.push(catego);
                    })
                }
                if (result.Item_x0020_Type == 'Root Component') {
                    result['Child'] = [];
                    RootComponentsData.push(result);
                }
                if (result.Item_x0020_Type == 'Component') {
                    result['Child'] = [];
                    ComponentsData.push(result);


                }

                if (result.Item_x0020_Type == 'SubComponent') {
                    result['Child'] = [];
                    SubComponentsData.push(result);


                }
                if (result.Item_x0020_Type == 'Feature') {
                    result['Child'] = [];
                    FeatureData.push(result);
                }
            });

            $.each(SubComponentsData, function (index: any, subcomp: any) {
                if (subcomp.Title != undefined) {
                    $.each(FeatureData, function (index: any, featurecomp: any) {
                        if (featurecomp.Parent != undefined && subcomp.Id == featurecomp.Parent.Id) {
                            subcomp['Child'].push(featurecomp);;
                        }
                    })
                }
            })

            $.each(ComponentsData, function (index: any, subcomp: any) {
                if (subcomp.Title != undefined) {
                    $.each(SubComponentsData, function (index: any, featurecomp: any) {
                        if (featurecomp.Parent != undefined && subcomp.Id == featurecomp.Parent.Id) {
                            subcomp['Child'].push(featurecomp);;
                        }
                    })
                }
            })
            result = componentDetails;
        }
    }
    catch (error) {
        return Promise.reject(error);
    }

    return result;

}


// ********************* This is for the Getting All Component And Service Portfolio Data ********************

export const GetServiceAndComponentAllData = async (Props: any) => {

    var RootComponentsData: any = [];
    var ComponentsData: any = [];
    var SubComponentsData: any = [];
    var FeatureData: any = [];
    let TaskUsers: any = [];
    let componentDetails: any = [];
    var AllData: any = [];
    try {
        let web = new Web(Props.siteUrl);
        componentDetails = await web.lists
            .getById(Props.MasterTaskListID)
            .items
            .select("ID", "Title", "DueDate", "Status", "Portfolio_x0020_Type", "Sitestagging",
                "SiteCompositionSettings", "ItemRank", "Item_x0020_Type", 'PortfolioStructureID', "Parent/Id", "Author/Id", "Author/Title", "Parent/Title", "SharewebCategories/Id", "SharewebCategories/Title", "AssignedTo/Id", "AssignedTo/Title", "Team_x0020_Members/Id", "Team_x0020_Members/Title", "ClientCategory/Id", "ClientCategory/Title")
            .expand("Team_x0020_Members", "Author", "ClientCategory", "Parent", "SharewebCategories", "AssignedTo", "ClientCategory")
            .top(4999)
            .get();
        // console.log("all Service and Coponent data form global Call=======", componentDetails);
        TaskUsers = await AllTaskUsers(Props.siteUrl, Props.TaskUserListId);
        $.each(componentDetails, function (index: any, result: any) {
            result.isSelected=false;
            result.isSelected=Props?.selectedItems?.find((obj:any) => obj.Id === result.ID);
            result.TeamLeaderUser = []
            if (result.Portfolio_x0020_Type == Props.ComponentType) {
                result.DueDate = moment(result.DueDate).format('DD/MM/YYYY')
                if (result.DueDate == 'Invalid date' || '') {
                    result.DueDate = result.DueDate.replaceAll("Invalid date", "")
                }
                if (result.PercentComplete != undefined)
                    result.PercentComplete = (result.PercentComplete * 100).toFixed(0);

                if (result.Short_x0020_Description_x0020_On != undefined) {
                    result.Short_x0020_Description_x0020_On = result.Short_x0020_Description_x0020_On.replace(/(<([^>]+)>)/ig, '');
                }
                if (result.AssignedTo != undefined && result.AssignedTo.length > 0) {
                    $.each(result.AssignedTo, function (index: any, Assig: any) {
                        if (Assig.Id != undefined) {
                            $.each(Response, function (index: any, users: any) {
                                if (Assig.Id != undefined && users.AssingedToUserId != undefined && Assig.Id == users.AssingedToUserId) {
                                    users.ItemCover = users.Item_x0020_Cover;
                                    result.TeamLeaderUser.push(users);
                                }
                            })
                        }
                    })
                }
                if (result.Team_x0020_Members != undefined && result.Team_x0020_Members.length > 0) {
                    $.each(result.Team_x0020_Members, function (index: any, Assig: any) {
                        if (Assig.Id != undefined) {
                            $.each(Response, function (index: any, users: any) {
                                if (Assig.Id != undefined && users.AssingedToUserId != undefined && Assig.Id == users.AssingedToUserId) {
                                    users.ItemCover = users.Item_x0020_Cover;
                                    result.TeamLeaderUser.push(users);
                                }

                            })
                        }
                    })
                }

                if (result.ClientCategory != undefined && result.ClientCategory.length > 0) {
                    $.each(result.Team_x0020_Members, function (index: any, categoryData: any) {
                        result.ClientCategory.push(categoryData);
                    })
                }
                if (result.Item_x0020_Type == 'Root Component') {
                    RootComponentsData.push(result);
                }
                if (result.Item_x0020_Type == 'Component') {
                    result['Child'] = [];
                    result['subRows'] = [];
                    result.SiteIconTitle = "C"
                    ComponentsData.push(result);
                }

                if (result.Item_x0020_Type == 'SubComponent') {
                    result['Child'] = [];
                    result['subRows'] = [];
                    result.SiteIconTitle = "S"
                    SubComponentsData.push(result);
                }
                if (result.Item_x0020_Type == 'Feature') {
                    result['Child'] = [];
                    result['subRows'] = [];
                    result.SiteIconTitle = "F"
                    FeatureData.push(result);
                }

            }

        });
        $.each(ComponentsData, function (index: any, subcomp: any) {
            if (subcomp.Title != undefined) {
                subcomp.NewLeble = subcomp.Title;
                $.each(SubComponentsData, function (index: any, featurecomp: any) {
                    if (
                        featurecomp.Parent != undefined &&
                        subcomp.Id == featurecomp.Parent.Id
                    ) {
                        featurecomp.NewLeble = subcomp.Title + " > " + featurecomp.Title
                        subcomp["Child"].push(featurecomp);
                        AllData.push(featurecomp);
                        subcomp['subRows'].push(featurecomp);
                    }
                });
            }
        });
        $.each(SubComponentsData, function (index: any, subcomp: any) {
            if (subcomp.Title != undefined) {
                $.each(FeatureData, function (index: any, featurecomp: any) {
                    if (
                        featurecomp.Parent != undefined &&
                        subcomp.Id == featurecomp.Parent.Id
                    ) {
                        featurecomp.NewLeble = subcomp.NewLeble + " > " + featurecomp.Title
                        subcomp["Child"].push(featurecomp);
                        subcomp['subRows'].push(featurecomp);
                        AllData.push(featurecomp);
                    }
                });
            }
        });
        let dataObject = {
            GroupByData: ComponentsData,
            AllData: ComponentsData.concat(AllData)
        }
        return dataObject;

    } catch (error) {
        console.log("Error:", error)
    }
    // console.log("all Service andCoponent data in global common =======", componentDetails)
}

const AllTaskUsers = async (siteUrl: any, ListId: any) => {
    let taskUser;
    try {
        let web = new Web(siteUrl);
        taskUser = await web.lists
            .getById(ListId)
            .items
            .select("Id,UserGroupId,Suffix,Title,Email,SortOrder,Role,IsShowTeamLeader,Company,ParentID1,Status,Item_x0020_Cover,AssingedToUserId,isDeleted,AssingedToUser/Title,AssingedToUser/Id,AssingedToUser/EMail,ItemType,Approver/Id,Approver/Title,Approver/Name&$expand=AssingedToUser,Approver")
            .get();
    }
    catch (error) {
        return (error);
    }
    return taskUser;
}

export const ArrayCopy = async (array: any) => {

    let MainArray = [];

    if (array != undefined && array.length != undefined) {

        MainArray = parseJSON(JSON.stringify(array));

    }

    return MainArray;

}

export const getParameterByName = async (name: any) => {

    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");

    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),

        results = regex.exec(location.search);

    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));

}