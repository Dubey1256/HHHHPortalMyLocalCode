import * as React from "react";
import { useEffect, useState } from 'react';
import { Web } from "sp-pnp-js";
import * as moment from 'moment';
import { GlobalConstants } from "./LocalCommon";
import { sp } from "@pnp/sp";
import "@pnp/sp/sputilities";


export const getData = async (url: any, listId: any, query: any) => {
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

export const loadTaskUsers = async () => {
    let taskUser = undefined;
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

export const GetItemFromDomainUrl = async (SiteUrl: any) => {
    var ItemMetadata = undefined;
    if (SiteUrl != undefined) {
        let TaskListsConfiguration = JSON.parse(GlobalConstants.LIST_CONFIGURATIONS_TASKS);
        let TaskListItem = TaskListsConfiguration.filter(function (filterItem: any) {
            if (filterItem.DomainUrl != undefined && filterItem.DomainUrl != "") {
                return (SiteUrl.toLowerCase().indexOf(filterItem.DomainUrl.toLowerCase()) > -1);
            }
        });

        /*  #region Updated by ABH*/
        if (TaskListItem.length > 0) {
            if (SiteUrl.includes('digitaladministration') || SiteUrl.includes('DigitalAdministration')) {
                ItemMetadata = TaskListItem.filter((x: any) => x.Title == 'ALAKDigital')[0];
            } else {
                ItemMetadata = TaskListItem[0];
            }
        }
    }
    return ItemMetadata;
}

export const loadSiteTypeMetadata = async () => {
    let result = undefined;
    try {
        let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
        let smartmeta = [];
        smartmeta = await web.lists
            .getById('01a34938-8c7e-4ea6-a003-cee649e8c67a')
            .items
            .select('Id', 'IsVisible', 'ParentID', 'Title', 'SmartSuggestions', 'TaxType', 'Description1', 'Item_x005F_x0020_Cover', 'listId', 'siteName', 'siteUrl', 'SortOrder', 'SmartFilters', 'Selectable', 'Parent/Id', 'Parent/Title')
            .top(5000)
            .filter("TaxType eq 'Sites'")
            .expand('Parent')
            .get();
        result = smartmeta;
    }
    catch (error) {
        return Promise.reject(error);
    }
    return result;

}

export const loadAdminConfigurations = async () => {


    let result = undefined;
    try {
        let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
        let smartmeta: any[] = [];
        await web.lists
            .getById('e968902a-3021-4af2-a30a-174ea95cf8fa')
            .items
            .select("Id,Title,Value,Key,Description,DisplayTitle,Configurations&$filter=Key eq 'TaskDashboardConfiguration'")
            .top(5000)
            .get().then((data: any) => {
                $.each(data, function (index: any, smart: any) {
                    if (smart.Configurations != undefined) {
                        smartmeta = JSON.parse(smart.Configurations);
                    }
                });
            });
        result = smartmeta;
    }
    catch (error) {
        return Promise.reject(error);
    }
    return result;


}

export const LoadAllSiteTasks = async () => {
    let result;
    try {
        loadAdminConfigurations();
        var AllTask: any = []
        let AllUser = await loadTaskUsers();
        var query = "&$filter=Status ne 'Completed'&$orderby=Created desc&$top=4999";
        var Counter = 0;
        let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
        var arraycount = 0;
        let siteConfig: any[] = [];
        let DataSiteIcon = await loadAdminConfigurations()
        siteConfig = await loadSiteTypeMetadata();
         await siteConfig.map(async (config: any) => {
            if (config.Title != 'SDC Sites' && config.Title != 'Master Tasks') {
                let smartmeta = [];
                smartmeta = await web.lists
                    .getById(config.listId)
                    .items
                    .select("Id,StartDate,DueDate,Title,Created,PercentComplete,Priority_x0020_Rank,Priority,ClientCategory/Id,SharewebTaskType/Id,SharewebTaskType/Title,ComponentId,ServicesId,ClientCategory/Title,Project/Id,Project/Title,Author/Id,Author/Title,Editor/Id,Editor/Title,AssignedTo/Id,AssignedTo/Title,Team_x0020_Members/Id,Team_x0020_Members/Title,Responsible_x0020_Team/Id,Responsible_x0020_Team/Title,Component/Id,component_x0020_link,Component/Title,Services/Id,Services/Title")
                    .top(4999)
                    .expand("Project,AssignedTo,Author,Editor,Team_x0020_Members,Responsible_x0020_Team,ClientCategory,Component,Services,SharewebTaskType")
                    .get();
                await smartmeta.map((items: any) => {
                    items.AllTeamMember = []
                    items.siteType = config.Title;
                    items.listId = config.listId;
                    items.siteUrl = config.siteUrl.Url;
                    items.PercentComplete = (items.PercentComplete * 100).toFixed(0);
                    if (items.Component != undefined && items.Component.results != undefined && items.Component.results.length > 0) {
                        items['Portfoliotype'] = 'Component';
                    }
                    if (items.Services != undefined && items.Services.results && items.Services.results.length > 0) {
                        items['Portfoliotype'] = 'Service';
                    }
                    if (DataSiteIcon != undefined) {
                        if (config.Title == "DRR" || config.Title == "Gender" || config.Title == "KathaBeck") {
                            items['siteIcon'] = config.Item_x005F_x0020_Cover.Url
                        } else {
                            DataSiteIcon.map((site: any) => {
                                if (site.Site == items.siteType) {
                                    items['siteIcon'] = site.SiteIcon
                                }
                            })
                        }
    
                    }
                    items.CreatedDis = items?.Created != null ? moment(items.Created).format('DD/MM/YYYY') : ""
                    items.componentString = items.Component != undefined && items.Component != undefined && items.Component.length > 0 ? getComponentasString(items.Component) : '';
                    items.Shareweb_x0020_ID = getTaskId(items);
                    if (items.Team_x0020_Members != undefined) {
                        items.Team_x0020_Members.map((taskUser: any) => {
                            var newuserdata: any = {};
    
                            AllUser.map((user: any) => {
                                if (user.AssingedToUserId == taskUser.Id) {
                                    newuserdata['useimageurl'] = user?.Item_x0020_Cover?.Url;
                                    newuserdata['Suffix'] = user.Suffix;
                                    newuserdata['Title'] = user.Title;
                                    newuserdata['UserId'] = user.AssingedToUserId;
                                    items['Usertitlename'] = user.Title;
                                }
    
                            })
                            items.AllTeamMember.push(newuserdata);
                        })
    
                    }
                    AllTask.push(items)
                })
                arraycount++;
                if (arraycount === 17) {
                    result = AllTask;
                  
                }
    
            } else {
                arraycount++
            }
        })
        return result;
    }
    catch (error) {
        return Promise.reject(error);
    }
   
}

export const getComponentasString = async (results: any) => {
    var component = '';
    $.each(results, function (cmp: any) {
        component += cmp.Title + '; ';
    })
    return component;
}

export const getParameterByName = async (name : any) =>{
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
