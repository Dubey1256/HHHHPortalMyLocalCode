import * as React from "react";
import { useEffect, useState } from 'react';
import { Web } from "sp-pnp-js";
import * as moment from 'moment';
export const getData = async (url:any,listId:any,query:any,filter:any) => {
    const web = new Web(url);
    let result;
    try {
        result = (await web.lists.getById(listId).items.select(query).filter(filter).get());
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
