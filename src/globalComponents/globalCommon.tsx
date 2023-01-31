import * as React from "react";
import { useEffect, useState } from 'react';
import { Web } from "sp-pnp-js";
import * as moment from 'moment';

export const getData = async (url:any,listId:any,query:any) => {
    const web = new Web(url);
    let result;
    try {
        result = (await web.lists.getById(listId).items.select(query).get());
    }
    catch (error) {
        return Promise.reject(error);
    }

    return result;
    
}

export const addData = async (url:any,listId:any,item:any) => {
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

export const updateItemById = async (url:any,listId:any,item:any,itemId:any) => {
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

export const deleteItemById = async (url:any,listId:any,item:any,itemId:any) => {
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

export const getTaskId=(item: any)=> {
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
        if (item.Component != undefined && item.Events != undefined && item.Services != undefined)
            // if (!item.Events.results.length > 0 && !item.Services.results.length > 0 && !item.Component.results.length > 0) {
            Shareweb_x0020_ID = 'A' + item.SharewebTaskLevel1No;
        //}
        if (item.Component == undefined && item.Events == undefined && item.Services == undefined) {
            Shareweb_x0020_ID = 'A' + item.SharewebTaskLevel1No;
        }
        if (item.SharewebTaskType.Title == 'Project')
            Shareweb_x0020_ID = 'P' + item.SharewebTaskLevel1No;

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
        if (item.Component == undefined && item.Services == undefined && item.Events == undefined) {
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

export const loadTaskUsers= async ()=> {
    let taskUser ;
    try {
        let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
        taskUser = await web.lists
            .getById('b318ba84-e21d-4876-8851-88b94b9dc300')
            .items
            .select("Id,UserGroupId,Suffix,Title,Email,SortOrder,Role,IsShowTeamLeader,Company,ParentID1,Status,Item_x0020_Cover,AssingedToUserId,isDeleted,AssingedToUser/Title,AssingedToUser/Id,AssingedToUser/EMail,ItemType,Approver/Id,Approver/Title,Approver/Name")
            .expand("AssingedToUser,Approver")
            .get();
    }
    catch (error) {
        return Promise.reject(error);
    }
    return taskUser;
}