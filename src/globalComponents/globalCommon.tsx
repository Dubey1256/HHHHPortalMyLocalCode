import * as React from "react";
import { useEffect, useState } from 'react';
import pnp, { Web } from "sp-pnp-js";
import "@pnp/sp/sputilities";
import * as moment from 'moment';
import { SPFI, SPFx as spSPFx } from "@pnp/sp";
import { GlobalConstants } from '../globalComponents/LocalCommon';
import { PageContext } from "@microsoft/sp-page-context";
import { spfi } from "@pnp/sp/presets/all";
import { MSGraphClientV3 } from '@microsoft/sp-http';
export const myContextValue: any = React.createContext<any>({})
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
export const docxUint8Array = async () => {
    let result: any = [];
    await getData('https://hhhhteams.sharepoint.com/sites/HHHH/SP', 'e968902a-3021-4af2-a30a-174ea95cf8fa', "Id,ID,Title,Configurations&$filter=Title eq 'docxConfig'").then((data: any) => {
        const regularArray = JSON.parse(data[0].Configurations);
        const uint8Array = new Uint8Array(regularArray).buffer;
        result = uint8Array;
    })
    return result
}
export const SendTeamMessage = async (mention_To: any, txtComment: any, Context: any) => {
    let currentUser: any = {}
    try {
        let pageContent = await pageContext()
        let web = new Web(pageContent?.WebFullUrl);
        //let currentUser = await web.currentUser?.get()
        currentUser.Email = Context.pageContext._legacyPageContext.userPrincipalName
        // if (currentUser) {
        //     if (currentUser.Email?.length > 0) {
        //     } else {
        //         currentUser.Email = currentUser.UserPrincipalName;
        //     }
        // }
        // const client: MSGraphClientV3 = await Context.msGraphClientFactory.getClient();
        await Context.msGraphClientFactory.getClient().then((client: MSGraphClientV3) => {
            client.api(`/users`).version("v1.0").get(async (err: any, res: any) => {
                if (err)
                    console.error("MSGraphAPI Error")
                let TeamUser: any[] = [];
                let participants: any = []
                TeamUser = res?.value;
                let CurrentUserChatInfo = TeamUser.filter((items: any) => {
                    if (items.userPrincipalName != undefined && currentUser.Email != undefined && items.userPrincipalName.toLowerCase() == currentUser.Email.toLowerCase())
                        return items
                })
                currentUser.ChatId = CurrentUserChatInfo[0]?.id;
                var SelectedUser: any[] = []

                for (let index = 0; index < mention_To?.length; index++) {
                    for (let TeamUserIndex = 0; TeamUserIndex < TeamUser?.length; TeamUserIndex++) {
                        if (mention_To[index] != undefined && TeamUser[TeamUserIndex] != undefined && mention_To[index].toLowerCase() == TeamUser[TeamUserIndex].userPrincipalName.toLowerCase())
                            SelectedUser.push(TeamUser[TeamUserIndex])
                        if (mention_To[index] != undefined && TeamUser[TeamUserIndex] != undefined && mention_To[index].toLowerCase() == 'stefan.hochhuth@hochhuth-consulting.de' && TeamUser[TeamUserIndex].id == 'b0f99ab1-aef3-475c-98bd-e68229168489')
                            SelectedUser.push(TeamUser[TeamUserIndex])
                    }
                }
                let obj = {
                    "@odata.type": "#microsoft.graph.aadUserConversationMember", "roles": ["owner"], "user@odata.bind": `https://graph.microsoft.com/v1.0/users('${currentUser?.ChatId}')`
                }
                participants.push(obj)
                if (SelectedUser != undefined && SelectedUser.length > 0) {
                    SelectedUser?.forEach((item: any) => {
                        let obj = {
                            "@odata.type": "#microsoft.graph.aadUserConversationMember", "roles": ["owner"], "user@odata.bind": `https://graph.microsoft.com/v1.0/users('${item?.id}')`
                        }
                        participants.push(obj)
                    })
                }
                const chat_payload: any = {
                    "members": participants
                }
                mention_To != undefined && mention_To?.length == 1 ? chat_payload.chatType = 'oneOnOne' : chat_payload.chatType = 'group'
                let new_chat_resp = await client.api('/chats').version('v1.0').post(chat_payload)
                const message_payload = {
                    "body": {
                        contentType: 'html',
                        content: `${txtComment}`,
                        //content: 'test',
                    }
                }
                let result = await client.api('/chats/' + new_chat_resp?.id + '/messages').post(message_payload)
                return result;
            });
        });
    } catch (error) {
        return Promise.reject(error);
    }

}

export const PopHoverBasedOnTaskId = (item: any) => {
    let returnObj = { ...item }
    if (returnObj?.original?.subRows?.length > 0) {
        delete returnObj?.original?.subRows;
    }
    //    let structur= item?.original?.Title;
    //     let structureId=item?.original?.TaskID
    let structur = [returnObj?.original];
    let finalArray: any = [];
    try {
        // let parent = item?.parentRow;
        // while(parent){
        //     structur=parent?.original?.Title+' > '+structur;
        //     structureId=parent?.original?.structureId+'-'+ structureId;
        //     parent=parent?.parentRow;
        // }
        let parent = returnObj?.getParentRow();
        while (parent) {
            structur.push(parent?.original);
            parent = parent?.getParentRow();
        }
        structur.reverse;
        let finalStructure = structur[0]
        for (let i = structur.length - 1; i > 0; i--) {
            const currentObject = structur[i];
            const previousObject = structur[i - 1];
            currentObject.subRows = [];
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


export const hierarchyData = (items: any, MyAllData: any) => {
    var MasterListData: any = []
    var ChildData: any = []
    var AllData: any = []
    var finalData: any = []
    var SubChild: any = []
    var Parent: any = []
    var MainParent: any = []
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
                                    Parent.forEach((val: any) => {
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
                        // item.subRows[0].PortfolioStructureID =items?.TaskID
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
                            if (vall.subRows != undefined && vall.subRows.length > 0) {
                                vall.subRows.forEach((newItem: any) => {
                                    newItem.subRows.push(item)
                                })
                            }
                        })
                        item.subRows.push(items)
                        item.subRows[0].PortfolioStructureID = items?.TaskID
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
                    //     item1.subRows[0].PortfolioStructureID =items?.TaskID
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
                        item.subRows[0].PortfolioStructureID = items?.TaskID
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
                        item.subRows[0].PortfolioStructureID = items?.TaskID
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
                    item.subRows[0].PortfolioStructureID = items?.TaskID
                    item.subRows[0].siteIcon = items?.siteIcon


                })
                items.HierarchyData = AllData
                //setMasterData(newitems.HierarchyData)
            })
        }
        if (ChildData != undefined && ChildData.length > 0 && SubChild.length == 0) {
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
                val.subRows[0].PortfolioStructureID = items?.TaskID
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
    let TaskID = undefined;
    try {

        if (item != undefined && item.TaskType == undefined) {
            TaskID = 'T' + item.Id;
        }
        else if (item.TaskType != undefined && (item.TaskType.Title == 'Task' || item.TaskType.Title == 'MileStone') && item.TaskLevel == undefined && item.TaskLevel == undefined) {
            TaskID = 'T' + item.Id;
            if (item.TaskType.Title == 'MileStone')
                TaskID = 'M' + item.Id;
        }
        else if (item.TaskType != undefined && (item.TaskType.Title == 'Activities' || item.TaskType.Title == 'Project') && item.TaskLevel != undefined) {
            if (item.Portfolio != undefined) {
                if (item.Portfolio != undefined) {
                    TaskID = 'CA' + item.TaskLevel;
                }
            }
            if (item?.Services != undefined) {
                if (item?.Services != undefined && item?.Services?.length > 0) {
                    TaskID = 'SA' + item.TaskLevel;
                }
            }
            if (item?.Events != undefined) {
                if (item?.Events != undefined && item?.Events?.length > 0) {
                    TaskID = 'EA' + item.TaskLevel;
                }
            }
            if (item.Component != undefined && item.Events != undefined && item.Services != undefined) {
                if (item?.Events?.length > 0 && item?.Services?.length > 0 && item?.Component?.length > 0)
                    TaskID = 'A' + item.TaskLevel;
            }
            if (item?.Component == undefined && item?.Events == undefined && item?.Services == undefined) {
                TaskID = 'A' + item.TaskLevel;
            }
            if (item?.TaskType?.Title == 'Project')
                TaskID = 'P' + item.TaskLevel;

            // if (item?.Component?.length === 0 && item?.Services?.length === 0) {
            //     TaskID = 'A' + item.TaskLevel;
            // }
        }
        else if (item.TaskType != undefined && (item.TaskType.Title == 'Workstream' || item.TaskType.Title == 'Step') && item.TaskLevel != undefined && item.TaskLevel != undefined) {
            if (item.Component != undefined && item.Services != undefined && item.Events != undefined) {
                // if (!item.Events.results.length > 0 && !item.Services.results.length > 0 && !item.Component.results.length > 0) {
                TaskID = 'A' + item.TaskLevel + '-W' + item.TaskLevel;
                // }
            }
            if (item.Component != undefined) {
                if (item?.Component != undefined && item?.Component?.length > 0) {
                    TaskID = 'CA' + item.TaskLevel + '-W' + item.TaskLevel;
                }
            }
            if (item.Services != undefined) {
                if (item.Services != undefined && item?.Services?.length > 0) {
                    TaskID = 'SA' + item.TaskLevel + '-W' + item.TaskLevel;
                }
            }
            if (item.Events != undefined) {
                if (item.Events != undefined && item.Events.length > 0) {
                    TaskID = 'EA' + item.TaskLevel + '-W' + item.TaskLevel;
                }
            }
            if ((item?.Component?.length == 0 || item?.Component == undefined) && (item?.Services?.length == 0 || item?.Services == undefined) && item?.Events == undefined) {
                TaskID = 'A' + item.TaskLevel + '-W' + item.TaskLevel;
            }
            if (item.TaskType.Title == 'Step')
                TaskID = 'P' + item.TaskLevel + '-S' + item.TaskLevel;

        }
        else if (item.TaskType != undefined && (item.TaskType.Title == 'Task' || item.TaskType.Title == 'MileStone') && item.TaskLevel != undefined && item.TaskLevel != undefined) {
            if (item.Component != undefined && item.Services != undefined && item.Events != undefined) {
                // if (!item.Events.results.length > 0 && !item.Services.results.length > 0 && !item.Component.results.length > 0) {
                TaskID = 'A' + item.TaskLevel + '-W' + item.TaskLevel + '-T' + item.Id;
                //  }
            }
            if (item.Component != undefined) {
                if (item.Component != undefined && item?.Component?.length > 0) {
                    TaskID = 'CA' + item.TaskLevel + '-W' + item.TaskLevel + '-T' + item.Id;
                }
            }
            if (item.Services != undefined) {
                if (item.Services != undefined && item?.Services?.length > 0) {
                    TaskID = 'SA' + item.TaskLevel + '-W' + item.TaskLevel + '-T' + item.Id;
                }
            }
            if (item.Events != undefined) {
                if (item.Events != undefined && item?.Events?.length > 0) {
                    TaskID = 'EA' + item.TaskLevel + '-W' + item.TaskLevel + '-T' + item.Id;
                }
            }
            if (item.Component == undefined && item.Services == undefined && item.Events == undefined) {
                TaskID = 'A' + item.TaskLevel + '-W' + item.TaskLevel + '-T' + item.Id;
            }
            if (item.TaskType.Title == 'MileStone') {
                TaskID = 'P' + item.TaskLevel + '-S' + item.TaskLevel + '-M' + item.Id;
            }
        }
        else if (item.TaskType != undefined && (item.TaskType.Title == 'Task' || item.TaskType.Title == 'MileStone') && item.TaskLevel != undefined && item.TaskLevel == undefined) {
            if (item.Component != undefined && item.Services != undefined && item.Events != undefined) {
                //  if (!item.Events.results.length > 0 && !item.Services.results.length > 0 && !item.Component.results.length > 0) {
                TaskID = 'A' + item.TaskLevel + '-T' + item.Id;
                // }
            }
            if (item.Component != undefined) {
                if (item.Component != undefined && item?.Component?.length > 0) {
                    TaskID = 'CA' + item.TaskLevel + '-T' + item.Id;
                }
            }
            if (item.Services != undefined) {
                if (item.Services != undefined && item?.Services?.length > 0) {
                    TaskID = 'SA' + item.TaskLevel + '-T' + item.Id;
                }
            }
            if (item.Events != undefined) {
                if (item.Events != undefined && item.Events.length > 0) {
                    TaskID = 'EA' + item.TaskLevel + '-T' + item.Id;
                }
            }
            if (item.Component == undefined && item.Services == undefined && item.Events == undefined) {
                TaskID = 'A' + item.TaskLevel + '-T' + item.Id;
            }
            if (item.TaskType.Title == 'MileStone') {
                TaskID = 'P' + item.TaskLevel + '-M' + item.Id;
            }

        }
    }
    catch (error) {
        return Promise.reject(error);
    }
    return TaskID;
}

export const loadTaskUsers = async () => {
    let taskUser;
    try {
        let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
        taskUser = await web.lists
            .getById('b318ba84-e21d-4876-8851-88b94b9dc300')
            .items
            .select("Id,UserGroupId,Suffix,Title,Email,SortOrder,Role,Company,ParentID1,Status,Item_x0020_Cover,AssingedToUserId,isDeleted,AssingedToUser/Title,AssingedToUser/Id,AssingedToUser/EMail,ItemType,Approver/Id,Approver/Title,Approver/Name,UserGroup/Id,UserGroup/Title&$expand=AssingedToUser,Approver,UserGroup")
            .get();
    }
    catch (error) {
        return Promise.reject(error);
    }
    return taskUser;
}
export const loadAllTaskUsers = async (AllListId: any) => {

    let taskUser;
    try {
        let web = new Web(AllListId?.siteUrl);
        taskUser = await web.lists
            .getById(AllListId?.TaskUsertListID)
            .items
            .select("Id,UserGroupId,Suffix,Title,Email,SortOrder,Role,Company,ParentID1,Status,Item_x0020_Cover,AssingedToUserId,isDeleted,AssingedToUser/Title,AssingedToUser/Id,AssingedToUser/EMail,ItemType,Approver/Id,Approver/Title,Approver/Name,UserGroup/Id,UserGroup/Title,TeamLeader/Id,TeamLeader/Title&$expand=UserGroup,AssingedToUser,Approver,TeamLeader").get();
    }
    catch (error) {
        return Promise.reject(error);
    }
    return taskUser;
}
export const loadSmartMetadata = async (AllListId: any, TaxType: any) => {
    let metadata;
    try {
        let web = new Web(AllListId?.siteUrl);
        metadata = await web.lists
            .getById(AllListId?.SmartMetadataListID)
            .items
            .select("Id,IsVisible,ParentID,Title,SmartSuggestions,Configurations,TaxType,Item_x005F_x0020_Cover,Color_x0020_Tag,listId,siteName,siteUrl,SortOrder,SmartFilters,Selectable,Parent/Id,Parent/Title")
            .expand('Parent')
            .getAll();
    }
    catch (error) {
        return Promise.reject(error);
    }
    if (TaxType != undefined) {
        if (TaxType == "Sites") {
            return metadata?.filter((metadataItem: any) => metadataItem?.TaxType == TaxType && metadataItem?.listId != undefined)
        } else {
            return metadata?.filter((metadataItem: any) => metadataItem?.TaxType == TaxType)
        }
    } else {
        return metadata;
    }

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
            if (postData?.ResponsibleTeamId?.results?.length > 0) {
                postData.ResponsibleTeamId.results.map((user: any) => {
                    UserManager.map((ID: any) => {
                        if (ID == user) {
                            isAvailable = true;
                        }
                    })
                })
            }
            if (!isAvailable) {
                var TeamMembersID: any[] = [];
                if (postData?.TeamMembersId?.results?.length > 0) {
                    postData.TeamMembersId.results((user: any) => {
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
                postData.TeamMembersId = { results: TeamMembersID };
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
const GetImmediateTaskNotificationEmails = async (item: any, isLoadNotification: any, taskUsers: any) => {
    var isLoadNotification = isLoadNotification;
    var CurrentItem = item;
    var Allmail: any[] = [];
    try {
        if (taskUsers?.length > 0) {
            var Allusers = taskUsers
            if (item != undefined && isLoadNotification != undefined && isLoadNotification != '' && isLoadNotification == 'ApprovalMail') {
                Allusers.map((user: any) => {
                    if (CurrentItem?.AuthorId == user?.AssingedToUserId) {
                        if (user?.Approver?.length > 0)
                            user.Approver.map((approver: any) => {
                                Allmail.push(approver?.Name?.split('|')[2]);
                            })
                    }
                })
            } else if (item != undefined && isLoadNotification != undefined && isLoadNotification != '' && isLoadNotification == 'Immediate') {
                Allusers.map((user: any) => {
                    if (user?.IsTaskNotifications == true) {
                        if (user?.AssingedToUser?.EMail != undefined)
                            Allmail.push(user?.AssingedToUser?.EMail);
                    }
                })
            }


            if (Allmail == undefined || Allmail.length == 0 && isLoadNotification == 'ApprovalMail')
                alert("User has no Approver to send an email");


        } else {

            if (isLoadNotification == 'ApprovalMail')
                alert("User has no Approver to send an email");
        }
        return Allmail;
    } catch (error) {
        console.log(error)
    }

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
//                     item.Priority = item.PriorityRank * 1;
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

//                     item.TaskID = getTaskId(item);

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

export const sendImmediateEmailNotifications = async (
    itemId: any,
    siteUrl: any,
    listId: any,
    item: any,
    RecipientMail: any,
    isLoadNotification: any,
    taskUsers: any,
    Context: any
) => {
    let clientTaskDetails :any= [];
    if(item?.ClientActivityJson!=undefined){
        try{
            clientTaskDetails= JSON.parse(item?.ClientActivityJson);
            clientTaskDetails= clientTaskDetails[0]
        }catch(e){

        }
    }
   
    await GetImmediateTaskNotificationEmails(
        item,
        isLoadNotification,
        taskUsers
    ).then(
        async (ToEmails: any) => {
            if (isLoadNotification == false) ToEmails = [];

            if (ToEmails?.length > 0 || RecipientMail?.length > 0) {
                var query = "";
                query +=
                    "AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,ClientActivityJson,AttachmentFiles/FileName,Component/Id,Component/Title,Component/ItemType,ComponentLink,Categories,FeedBack,ComponentLink,FileLeafRef,Title,Id,Comments,StartDate,DueDate,Status,Body,Company,Mileage,PercentComplete,FeedBack,Attachments,Priority,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title,TaskCategories/Id,TaskCategories/Title,Services/Id,Services/Title,Events/Id,Events/Title,TaskType/Id,TaskType/Title,TaskID,CompletedDate,TaskLevel,TaskLevel&$expand=AssignedTo,Component,AttachmentFiles,Author,Editor,TaskCategories,TaskType,Services,Events&$filter=Id eq " +
                    itemId;
                await getData(siteUrl, listId, query).then(
                    async (data: any) => {
                        data?.map((task: any) => {
                            task.PercentageCompleted =
                                task?.PercentComplete < 1
                                    ? task?.PercentComplete * 100
                                    : task?.PercentComplete;
                            task.PercentComplete =
                                task?.PercentComplete < 1
                                    ? task?.PercentComplete * 100
                                    : task?.PercentComplete;
                            if (task.PercentageCompleted != undefined) {
                                task.PercentageCompleted = parseInt(
                                    (task?.PercentageCompleted).toFixed(0)
                                );
                            }
                            if (task.PercentComplete != undefined) {
                                task.PercentComplete = parseInt(
                                    (task?.PercentComplete).toFixed(0)
                                );
                            }
                            task.taskLeader = "None";
                            if (task?.AssignedTo?.length > 0)
                                task.taskLeader = getMultiUserValues(task);

                            if (task?.PercentComplete != undefined) {
                                task.PercentComplete =
                                    task.PercentComplete < 1
                                        ? task.PercentComplete * 100
                                        : task.PercentComplete;
                                task.PercentComplete = parseInt(
                                    task.PercentComplete.toFixed(0)
                                );

                                task.PercentageCompleted = task.PercentComplete;
                            }
                            if (task?.siteType != undefined) {
                                task.siteType = task.siteType.replace(/_x0020_/g, " ");
                            }
                        });

                        var UpdateItem = data[0];
                        if (UpdateItem?.ClientActivityJson != undefined) {
                            try {
                                UpdateItem.ClientActivityJson = JSON.parse(
                                    UpdateItem?.ClientActivityJson
                                );
                                if (UpdateItem.ClientActivityJson?.length > 0) {
                                    UpdateItem.ClientActivityJson =
                                        UpdateItem.ClientActivityJson[0];
                                }
                            } catch (e) { }
                        }
                        var siteType = item?.siteType;
                        UpdateItem.siteType = "";
                        if (UpdateItem.siteType == "") {
                            if (siteType != undefined) {
                                siteType = siteType.replace(/_x0020_/g, "%20");
                            }
                            UpdateItem.siteType = siteType;
                        }
                        UpdateItem.TaskID = GetTaskId(UpdateItem);
                        if (UpdateItem?.Author != undefined) {
                            UpdateItem.Author1 = "";
                            UpdateItem.Author1 = UpdateItem.Author.Title;
                        } else UpdateItem.Editor1 = "";
                        if (UpdateItem?.Editor != undefined) {
                            UpdateItem.Editor1 = "";
                            UpdateItem.Editor1 = UpdateItem.Editor.Title;
                        } else UpdateItem.Editor1 = "";
                        if (UpdateItem?.ComponentLink?.Url != undefined)
                            UpdateItem.URL = UpdateItem?.ComponentLink?.Url;
                        else UpdateItem.URL = "";

                        if (UpdateItem?.DueDate != undefined)
                            UpdateItem.DueDate = moment(new Date(UpdateItem.DueDate)).format(
                                "DD/MM/YYYY"
                            );
                        else UpdateItem.DueDate = "";
                        if (UpdateItem?.StartDate != undefined)
                            UpdateItem.StartDate = moment(
                                new Date(UpdateItem.StartDate)
                            ).format("DD/MM/YYYY");
                        else UpdateItem.StartDate = "";
                        if (UpdateItem?.CompletedDate != undefined)
                            UpdateItem.CompletedDate = moment(
                                new Date(UpdateItem.CompletedDate)
                            ).format("DD/MM/YYYY");
                        else UpdateItem.CompletedDate = "";

                        if (UpdateItem?.Created != undefined)
                            UpdateItem.Created = moment(new Date(UpdateItem.Created)).format(
                                "DD/MM/YYYY"
                            );
                        else UpdateItem.Created = "";
                        if (UpdateItem?.Modified != undefined)
                            UpdateItem.Modified = moment(
                                new Date(UpdateItem.Modified)
                            ).format("DD/MM/YYYY");
                        else UpdateItem.Modified = "";
                        if (UpdateItem?.PercentComplete != undefined)
                            UpdateItem.PercentComplete = UpdateItem.PercentComplete;
                        else UpdateItem.PercentComplete = "";
                        if (UpdateItem?.Priority != undefined)
                            UpdateItem.Priority = UpdateItem.Priority;
                        else UpdateItem.Priority = "";
                        if (UpdateItem?.Body != undefined)
                            UpdateItem.Body = $.parseHTML(UpdateItem.Body)[0]?.textContent;
                        else UpdateItem.Body = "";
                        if (UpdateItem?.Title != undefined)
                            UpdateItem.Title = UpdateItem.Title;
                        else UpdateItem.Title = "";
                        UpdateItem.AssignedToTitle = "";
                        if (UpdateItem?.AssignedTo != undefined) {
                            UpdateItem.AssignedTo.map((item: any) => {
                                UpdateItem.AssignedToTitle += item.Title + ";";
                            });
                        }
                        UpdateItem.ComponentName = "";
                        if (UpdateItem?.Portfolio?.Id != undefined) {
                            UpdateItem.ComponentName += UpdateItem?.Portfolio.Title;
                        }
                        UpdateItem.Category = "";
                        UpdateItem.Categories = "";
                        if (UpdateItem?.TaskCategories != undefined) {
                            UpdateItem.TaskCategories.map((item: any) => {
                                UpdateItem.Categories += item.Title + ";";
                                UpdateItem.Category += item.Title + ",";
                            });
                        }
                        var pos = UpdateItem?.Category?.lastIndexOf(",");
                        UpdateItem.Category =
                            UpdateItem?.Category?.substring(0, pos) +
                            UpdateItem?.Category?.substring(pos + 1);
                        var Commentdata = [];
                        UpdateItem.AllComments = "";
                        if (UpdateItem?.Comments != undefined) {
                            Commentdata = JSON.parse(UpdateItem.Comments);
                            Commentdata.map((comment: any) => {
                                UpdateItem.AllComments +=
                                    '<div colspan="6" style="padding: 9px;border: 1px solid #ccc;background: #fbfbfb;color: #000;margin-top:5px;">' +
                                    "<span>" +
                                    '<div style="margin-bottom:5px;">' +
                                    comment?.AuthorName +
                                    " - " +
                                    comment?.Created +
                                    "</div>" +
                                    comment?.Title +
                                    "</span>" +
                                    "</div>";
                            });
                        }
                        UpdateItem.Description = "";
                        if (UpdateItem?.Body != undefined && UpdateItem?.Body != "")
                            UpdateItem.Description = UpdateItem.Body;
                        if (UpdateItem?.FeedBack != undefined) {
                            try {
                                var Description = JSON.parse(UpdateItem?.FeedBack);
                                if (Description?.length > 0) {
                                    UpdateItem.Description = "";
                                    Description[0]?.FeedBackDescriptions?.map(
                                        (description: any, index: any) => {
                                            var index1 = index + 1;
                                            var Comment = "";
                                            if (description?.Comments?.length > 0) {
                                                description.Comments.map((val: any) => {
                                                    Comment +=
                                                        '<div colspan="6" style="padding: 9px;border: 1px solid #ccc;background: #fbfbfb;color: #000;margin-top:5px;">' +
                                                        "<span>" +
                                                        '<div style="margin-bottom:5px;">' +
                                                        val?.AuthorName +
                                                        " - " +
                                                        val?.Created +
                                                        "</div>" +
                                                        val?.Title +
                                                        "</span>" +
                                                        "</div>";
                                                });
                                            }
                                            UpdateItem.Description +=
                                                '<tr><td colspan="1" style="background: #f4f4f4;text - align: left;padding: 10px 5px 10px 5px;color: #6F6F6F;font - family: arial;font - size: 14px;font - weight: bold;border - bottom: 2px solid #fff;border - right: 2px solid #fff;background-color: #fbfbfb;font-size: 13px;flex-basis: 27px !important;border: 1px solid #ccc;"><span>' +
                                                index1 +
                                                "</span>" +
                                                "</td>" +
                                                '<td colspan="11" style="background: #f4f4f4;text - align: left;padding: 10px 5px 10px 5px;color: #6F6F6F;font - family: arial;font - size: 14px;font - weight: bold;border - bottom: 2px solid #fff;border - right: 2px solid #fff;background-color: #fbfbfb;flex-basis: 100%;background-color: #fff;font-weight: normal;font-size: 13px;color: #000;margin-left: 2px;border: 1px solid #ccc;">' +
                                                "<span>" +
                                                description?.Title +
                                                "</span>" +
                                                Comment +
                                                "</td>" +
                                                "</tr>";
                                            if (description?.Subtext?.length > 0) {
                                                description.Subtext.map(
                                                    (Childdescription: any, Childindex: any) => {
                                                        var Childindex1 = Childindex + 1;
                                                        var ChildComment = "";
                                                        if (Childdescription?.Comments?.length > 0) {
                                                            description.Comments.map((Childval: any) => {
                                                                ChildComment +=
                                                                    '<div colspan="6" style="padding: 9px;border: 1px solid #ccc;background: #fbfbfb;color: #000;margin-top:5px;">' +
                                                                    "<span>" +
                                                                    '<div style="margin-bottom:5px;">' +
                                                                    Childval?.AuthorName +
                                                                    " - " +
                                                                    Childval?.Created +
                                                                    "</div>" +
                                                                    Childval?.Title +
                                                                    "</span>" +
                                                                    "</div>";
                                                            });
                                                        }
                                                        UpdateItem.Description +=
                                                            '<tr><td colspan="1" style="background: #f4f4f4;text - align: left;padding: 10px 5px 10px 5px;color: #6F6F6F;font - family: arial;font - size: 14px;font - weight: bold;border - bottom: 2px solid #fff;border - right: 2px solid #fff;background-color: #fbfbfb;font-size: 13px;flex-basis: 27px !important;border: 1px solid #ccc;"><span>' +
                                                            index1 +
                                                            "." +
                                                            Childindex1 +
                                                            "</span>" +
                                                            "</td>" +
                                                            '<td colspan="11" style="background: #f4f4f4;text - align: left;padding: 10px 5px 10px 5px;color: #6F6F6F;font - family: arial;font - size: 14px;font - weight: bold;border - bottom: 2px solid #fff;border - right: 2px solid #fff;background-color: #fbfbfb;flex-basis: 100%;background-color: #fff;font-weight: normal;font-size: 13px;color: #000;margin-left: 2px;border: 1px solid #ccc;">' +
                                                            "<span>" +
                                                            Childdescription?.Title +
                                                            "</span>" +
                                                            ChildComment +
                                                            "</td>" +
                                                            "</tr>";
                                                    }
                                                );
                                            }
                                        }
                                    );
                                }
                                //$scope.AdditionalTimeSpent.push(item.AdditionalTime[0]);
                            } catch (e) {
                                console.log(e);
                            }
                        }
                        let pageContent = Context;
                        var siteUrl = pageContent?.pageContext?.web?.absoluteUrl;
                        var Name = "";
                        var OtherDetails = "";
                        let Subject: any = "";
                        var TaskDescriptionStart = "";
                        var NoOfApprovalTask = "";
                        var TaskDescription = "";
                        var ApprovalRejectionComments = "";
                        var TaskComments = "";
                        var TaskDashBoardURl = "";
                        var ApprovalDashboard = "";
                        var TaskDashBoardTitle = "";
                        var ApprovalDashboardTitle = "";
                        var CC: any[] = [];
                        if (item == undefined) {
                            //Subject = "[" + siteType + "-Task] " + UpdateItem.Title + "(" + UpdateItem.Category + ")";
                            Subject =
                                "[" +
                                siteType +
                                " - " +
                                UpdateItem?.Category +
                                " (" +
                                UpdateItem?.PercentComplete +
                                "%)] " +
                                UpdateItem?.Title +
                                "";
                        }

                        if (Subject == undefined || Subject == "") {
                            if (
                                UpdateItem?.PercentComplete != undefined &&
                                UpdateItem?.PercentComplete != "" &&
                                UpdateItem?.PercentComplete != 1 &&
                                UpdateItem?.Category != undefined &&
                                UpdateItem?.Category != "" &&
                                UpdateItem?.Category.toLowerCase("approval") > -1
                            )
                                item.CategoriesType = item?.Category?.replace("Approval,", "");
                                if (
                                    UpdateItem?.Category?.toLowerCase()?.indexOf("immediate") > -1
                                ) {
                                    Subject =
                                    `[Immediate - ${UpdateItem.siteType} - ${UpdateItem.TaskID} ${UpdateItem.Title}] New Immediate Task Created`
                                }
                                else{
                                    Subject =
                                    "[" +
                                    siteType +
                                    " - " +
                                    UpdateItem?.Category +
                                    " (" +
                                    UpdateItem?.PercentComplete +
                                    "%)] " +
                                    UpdateItem?.Title +
                                    "";
                                }
                           
                        }
                        if (UpdateItem?.PercentComplete != 1) {
                            Subject = Subject?.replaceAll("Approval,", "");
                            Subject = Subject?.replaceAll("Normal Approval,", "");
                            Subject = Subject?.replaceAll("Normal Approval", "");
                            Subject = Subject?.replaceAll("Quick Approval,", "");
                            Subject = Subject?.replaceAll("Quick Approval", "");
                            Subject = Subject?.replaceAll("Complex Approval,", "");
                            Subject = Subject?.replaceAll("Complex Approval", "");
                            Subject = Subject?.replaceAll(",,", ",");
                        }
                        if (
                            UpdateItem?.PercentComplete == 1 &&
                            UpdateItem?.Category?.toLowerCase()?.indexOf("approval") > -1
                        ) {
                            //Subject = Subject.replaceAll('Approval,', '')
                            //if (Subject.indexOf('Normal Approval') <= -1 && Subject.indexOf('Quick Approval') <= -1 && Subject.indexOf('Complex Approval') <= -1)
                            //    Subject = Subject.replaceAll('Approval', '')
                            //Subject = Subject.replaceAll(',,', ',')
                            Subject =
                                "[" +
                                siteType +
                                " - " +
                                "Approval" +
                                "] " +
                                UpdateItem?.Title +
                                "";
                            if (isLoadNotification == "Client Task" && clientTaskDetails?.ClientActivityId!=undefined) {
                                Subject =  `[Client Task - ${clientTaskDetails?.ClientSite} - ${clientTaskDetails?.SDCTaskId} ${clientTaskDetails?.SDCTitle} by ${clientTaskDetails?.SDCCreatedBy}] New Client Task`
                            }
                            if (isLoadNotification == "Client Task Completed" && clientTaskDetails?.ClientActivityId!=undefined) {
                                Subject =  `[Client Task - ${clientTaskDetails?.ClientSite} - ${clientTaskDetails?.SDCTaskId} ${clientTaskDetails?.SDCTitle} by ${clientTaskDetails?.SDCCreatedBy}] Client Task completed`
                            }
                            if (
                                UpdateItem?.Category?.toLowerCase()?.indexOf(
                                    "email notification"
                                ) > -1 &&
                                UpdateItem?.Category?.toLowerCase().indexOf("immediate") > -1
                            ) {
                                Subject =
                                    "[" +
                                    siteType +
                                    " - " +
                                    "Approval,Email notification,Immediate" +
                                    "] " +
                                    UpdateItem?.Title +
                                    "";
                            } else if (
                                UpdateItem?.Category?.toLowerCase()?.indexOf(
                                    "email notification"
                                ) > -1
                            ) {
                                Subject =
                                    "[" +
                                    siteType +
                                    " - " +
                                    "Approval,Email notification" +
                                    "] " +
                                    UpdateItem?.Title +
                                    "";
                            } else if (
                                UpdateItem?.Category?.toLowerCase()?.indexOf("immediate") > -1
                            ) {
                                Subject =
                                `[Immediate - ${UpdateItem.siteType} - ${UpdateItem.TaskId} ${UpdateItem.Title} New Immediate Task Created]`
                            }
                        } else if (
                            UpdateItem?.PercentComplete == 0 &&
                            UpdateItem?.Category?.toLowerCase()?.indexOf("user experience - ux") > -1
                        ) {
                            if (isLoadNotification == "DesignMail") {
                                Subject =
                                    "[" +
                                    siteType +
                                    " - " +
                                    "User Experience - UX" +
                                    "]" +
                                    UpdateItem?.Title +
                                    "";
                            }
                        }
                        var body =
                            "<div>" +
                                "</div>" +
                                '<div style="margin-top:4px">' +
                                isLoadNotification ==
                                "DesignMail"
                                ? null
                                : TaskDescriptionStart +
                                    "</div>" +
                                    '<div style="margin-top:6px">' +
                                    isLoadNotification ==
                                    "DesignMail"
                                    ? null
                                    : TaskDescription +
                                        "</div>" +
                                        '<div style="margin-top:10px">' +
                                        isLoadNotification ==
                                        "DesignMail"
                                        ? null
                                        : NoOfApprovalTask +
                                            "</div>" +
                                            '<div style="margin-top:10px;">' +
                                            '<a style="padding-right: 17px;" href =' +
                                            isLoadNotification ==
                                            "DesignMail"
                                            ? null
                                            : TaskDashBoardURl + ">" + isLoadNotification == "DesignMail"
                                                ? null
                                                : TaskDashBoardTitle +
                                                    "</a>" +
                                                    "<a href =" +
                                                    isLoadNotification ==
                                                    "DesignMail"
                                                    ? null
                                                    : ApprovalDashboard + ">" + isLoadNotification == "DesignMail"
                                                        ? null
                                                        : ApprovalDashboardTitle +
                                                        "</a>" +
                                                        "</div>" +
                                                        '<div style="margin-top:15px">' +
                                                        "<a href =" +
                                                        siteUrl +
                                                        "/SitePages/Task-Profile.aspx?taskId=" +
                                                        UpdateItem?.Id +
                                                        "&Site=" +
                                                        siteType +
                                                        ">" +
                                                        UpdateItem?.Title +
                                                        "</a>" +
                                                        "</div>" +
                                                        '<table style="width:100%">' +
                                                        "<tbody>" +
                                                        '<td style="width:70%;vertical-align: top;">' +
                                                        '<table style="width:99%;">' +
                                                        "<tbody>" +
                                                        "<tr>" +
                                                        '<tr><td style="border: 1px solid #ccc;background: #f4f4f4;"><b style="font-size: 13px;">Task Id:</b></td><td colspan="2" style="border: 1px solid #ccc;background: #fafafa;"> <span style="font-size: 13px; margin-left:13px" >' +
                                                        UpdateItem?.TaskID +
                                                        "</span></td>" +
                                                        '<td style="border: 1px solid #ccc;background: #f4f4f4;"><b style="font-size: 13px;">Component:</b></td><td colspan="2" style="border: 1px solid #ccc;background: #fafafa;"> <span style="font-size: 13px; margin-left:13px" >' +
                                                        UpdateItem?.ComponentName +
                                                        "</span> </td>" +
                                                        '<td style="border: 1px solid #ccc;background: #f4f4f4;"><b style="font-size: 13px;">Priority:</b></td><td colspan="2" style="border: 1px solid #ccc;background: #fafafa;"> <span style="font-size: 13px; margin-left:13px" >' +
                                                        UpdateItem?.Priority +
                                                        "</span> </td>" +
                                                        "</tr>" +
                                                        '<tr><td style="border: 1px solid #ccc;background: #f4f4f4;"><b style="font-size: 13px;">Start Date:</b></td><td colspan="2" style="border: 1px solid #ccc;background: #fafafa;"> <span style="font-size: 13px; margin-left:13px" >' +
                                                        UpdateItem?.StartDate +
                                                        "</span></td>" +
                                                        '<td style="border: 1px solid #ccc;background: #f4f4f4;"><b style="font-size: 13px;">Completion Date:</b></td><td colspan="2" style="border: 1px solid #ccc;background: #fafafa;"> <span style="font-size: 13px; margin-left:13px" >' +
                                                        UpdateItem?.CompletedDate +
                                                        "</span> </td>" +
                                                        '<td style="border: 1px solid #ccc;background: #f4f4f4;"><b style="font-size: 13px;">Due Date:</b></td><td colspan="2" style="border: 1px solid #ccc;background: #fafafa;"> <span style="font-size: 13px; margin-left:13px" >' +
                                                        UpdateItem?.DueDate +
                                                        "</span> </td>" +
                                                        "</tr>" +
                                                        '<tr><td style="border: 1px solid #ccc;background: #f4f4f4;"><b style="font-size: 13px;">Team Members:</b></td><td colspan="2" style="border: 1px solid #ccc;background: #fafafa;"> <span style="font-size: 13px; margin-left:13px" >' +
                                                        UpdateItem?.AssignedToTitle +
                                                        "</span></td>" +
                                                        '<td style="border: 1px solid #ccc;background: #f4f4f4;"><b style="font-size: 13px;">Created By:</b></td><td colspan="2" style="border: 1px solid #ccc;background: #fafafa;"> <span style="font-size: 13px; margin-left:13px" >' +
                                                        UpdateItem?.Author1 +
                                                        "</span> </td>" +
                                                        '<td style="border: 1px solid #ccc;background: #f4f4f4;"><b style="font-size: 13px;">Created:</b></td><td colspan="2" style="border: 1px solid #ccc;background: #fafafa;"> <span style="font-size: 13px; margin-left:13px" >' +
                                                        UpdateItem?.Created +
                                                        "</span> </td>" +
                                                        "</tr>" +
                                                        '<tr><td style="border: 1px solid #ccc;background: #f4f4f4;"><b style="font-size: 13px;">Categories:</b></td><td colspan="2" style="border: 1px solid #ccc;background: #fafafa;"> <span style="font-size: 13px; margin-left:13px" >' +
                                                        UpdateItem?.Categories +
                                                        "</span></td>" +
                                                        '<td style="border: 1px solid #ccc;background: #f4f4f4;"><b style="font-size: 13px;">Status:</b></td><td colspan="2" style="border: 1px solid #ccc;background: #fafafa;"> <span style="font-size: 13px; margin-left:13px" >' +
                                                        UpdateItem?.Status +
                                                        "</span> </td>" +
                                                        '<td style="border: 1px solid #ccc;background: #f4f4f4;"><b style="font-size: 13px;">% Complete:</b></td><td colspan="2" style="border: 1px solid #ccc;background: #fafafa;"> <span style="font-size: 13px; margin-left:13px" >' +
                                                        UpdateItem?.PercentComplete +
                                                        "%</span> </td>" +
                                                        "</tr>" +
                                                        '<tr><td style="border: 1px solid #ccc;background: #f4f4f4;"><b style="font-size: 13px;">URL:</b> </td><td colspan="7" style="border: 1px solid #ccc;background: #fafafa;"><span style="font-size: 13px; margin-left:13px">' +
                                                        UpdateItem?.URL +
                                                        "</span> </td>" +
                                                        "</tr>" +
                                                        ApprovalRejectionComments +
                                                        "</tr> " +
                                                        "</tr>" +
                                                        "</tr>" +
                                                        "<tr>" +
                                                        "</tbody>" +
                                                        "</table>" +
                                                        '<table style="width:99%;margin-top: 10px;">' +
                                                        "<tbody>" +
                                                        "<tr>" +
                                                        UpdateItem?.Description +
                                                        "</tr>" +
                                                        "</tbody>" +
                                                        "</table>" +
                                                        "</td>" +
                                                        '<td style="width:22%">' +
                                                        '<table style="border:1px solid #ddd;border-radius:4px;margin-bottom:25%;width:100%">' +
                                                        "<tbody>" +
                                                        "<tr>" +
                                                        '<td style="color:#333; background-color:#f5f5f5;border-bottom:1px solid #ddd">Comments:' +
                                                        "</td>" +
                                                        "</tr>" +
                                                        "<tr>" +
                                                        "<td>" +
                                                        UpdateItem?.AllComments +
                                                        "</td>" +
                                                        "</tr>" +
                                                        "</tbody>" +
                                                        "</table>" +
                                                        "</td>" +
                                                        "</tr>" +
                                                        "</tbody>" +
                                                        "</table>" +
                                                        "</td>" +
                                                        "</tr>" +
                                                        "</tbody>" +
                                                        "</table>";
                        if (CC.length > 1) CC.splice(1, 1);
                        //'<tr><td colspan="7" style="background: #f4f4f4;text - align: left;padding: 10px 5px 10px 5px;color: #6F6F6F;font - family: arial;font - size: 14px;font - weight: bold;border - bottom: 2px solid #fff;border - right: 2px solid #fff;background-color: #fbfbfb;flex-basis: 100%;background-color: #fff;font-weight: normal;font-size: 13px;color: #000;margin-left: 2px;border: 1px solid #ccc;">' + UpdateItem.Description + '</td></tr>' +

                        //'<tr><td colspan="7" style="background: #f4f4f4;text - align: left;padding: 10px 5px 10px 5px;color: #6F6F6F;font - family: arial;font - size: 14px;font - weight: bold;border - bottom: 2px solid #fff;border - right: 2px solid #fff;background-color: #fbfbfb;flex-basis: 100%;background-color: #fff;font-weight: normal;font-size: 13px;color: #000;margin-left: 2px;border: 1px solid #ccc;">' + UpdateItem.Description + '</td></tr>' +
                        if (RecipientMail?.length > 0) {
                            if (ToEmails == undefined) {
                                ToEmails = [];
                            }
                            RecipientMail.map((mail: any) => {
                                ToEmails.push(mail.Email);
                            });
                        }
                        if (isLoadNotification == "Client Task") {
                            let SDCDetails: any = {};
                            let extraBody = "";
                            if (UpdateItem?.ClientActivityJson?.SDCCreatedBy?.length > 0) {
                                SDCDetails = UpdateItem?.ClientActivityJson;
                                if (isLoadNotification == "Client Task" && clientTaskDetails?.ClientActivityId!=undefined) {
                                    Subject =  `[Client Task - ${clientTaskDetails?.ClientSite} - ${clientTaskDetails?.SDCTaskId} ${clientTaskDetails?.SDCTitle} by ${clientTaskDetails?.SDCCreatedBy}] New Client Task`
                                }
                                if (isLoadNotification == "Client Task Completed" && clientTaskDetails?.ClientActivityId!=undefined) {
                                    Subject =  `[Client Task - ${clientTaskDetails?.ClientSite} - ${clientTaskDetails?.SDCTaskId} ${clientTaskDetails?.SDCTitle} by ${clientTaskDetails?.SDCCreatedBy}] Client Task completed`
                                }
                                if (UpdateItem?.PercentComplete < 90) {
                                //     extraBody = `<div>
                                //       <h2>Email Subject : Your Task has been seen - [${SDCDetails?.SDCTaskId} ${UpdateItem?.Title}]</h2>
                                //       <p>Message:</p>
                                //       <p>Dear ${SDCDetails?.SDCCreatedBy},</p>
                                //       <p>Thank you for your Feedback!</p>
                                //       <p>Your Task - [${UpdateItem?.Title}] has been seen by our Team and we are now working on it.</p>
                                //       <p>You can track your Task Status here: <a href="${SDCDetails?.SDCTaskUrl}">${SDCDetails?.SDCTaskUrl}</a></p>
                                //       <p>If you want to see all your Tasks or all Sharweb Tasks click here: <a href="${SDCDetails?.SDCTaskDashboard}">Team Dashboard - Task View</a></p>
                                //       <p>Best regards,<br />Your HHHH Support Team</p>
                                //       <br>
                                //       <h4>Client Email : - ${SDCDetails?.SDCEmail}
                                //   </div><br><br>`;
                                } else if (UpdateItem?.PercentComplete == 90) {
                                    Subject =  `[Client Task - ${clientTaskDetails?.ClientSite} - ${clientTaskDetails?.SDCTaskId} ${clientTaskDetails?.SDCTitle} by ${clientTaskDetails?.SDCCreatedBy}] Client Task completed`
                                    extraBody = `<div>
                                      <h2>Email Subject : Your Task has been completed - [${SDCDetails?.SDCTaskId} ${UpdateItem?.Title}]</h2>
                                      <p>Message:</p>
                                      <p>Dear ${SDCDetails?.SDCCreatedBy},</p>
                                      <p>Thank you for your Feedback!</p>
                                      <p>Your Task - [${UpdateItem?.Title}] has been completed.</p>
                                      <p>You can review your Task here:: <a href="${SDCDetails?.SDCTaskUrl}">${SDCDetails?.SDCTaskUrl}</a></p>
                                      <p>If you want to see all your Tasks or all Shareweb Tasks click here: <a href="${SDCDetails?.SDCTaskDashboard}">Team Dashboard - Task View</a></p>
                                      <p>Best regards,<br />Your HHHH Support Team</p>
                                      <br>
                                      <h4>Client Email : - ${SDCDetails?.SDCEmail}
                                  </div><br><br>`;
                                }

                                body = extraBody + body;
                            }
                           
                        }
                        if(UpdateItem?.Category?.toLowerCase()?.indexOf("immediate") > -1){

                            let headercontain = 
                            `<div style="margin-top: 11.25pt;">
                                <div style="margin-top: 2pt;">Hello ${UpdateItem?.Author1},</div>
                                <div style="margin-top: 5pt;">Your task has been set to  ${UpdateItem?.PercentComplete}%  by ${UpdateItem?.Author1}, team will process it further.</div>
                                <div style="margin-top: 5pt;">Have a nice day !</div>
                                <div style="margin-top: 5pt;">Regards,</div>
                                <div style="margin-top: 5pt;">Task Management Team,</div>
                            </div>`

                            body = headercontain + body;
                        }
                        var from = "",
                            to = ToEmails,
                            cc = CC,
                            body = body,
                            subject = Subject,
                            ReplyTo = "deepak@hochhuth-consulting.de";
                        SendEmailFinal(to, subject, body, Context);
                    },
                    function (error) {
                        console.log(error);
                    }
                );
            }
        },

        function (error) { }
    );
};
const SendEmailFinal = async (to: any, subject: any, body: any, Context: any) => {
    let sp = spfi().using(spSPFx(Context));
    sp.utility.sendEmail({
        //Body of Email  
        Body: body,
        //Subject of Email  
        Subject: subject,
        //Array of string for To of Email  
        To: to,
        AdditionalHeaders: {
            "content-type": "text/html"
        },
    }).then(() => {
        console.log("Email Sent!");

    }).catch((err) => {
        console.log(err.message);
    });
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
                    .select("ID", "Title", "DueDate", "Status", "ItemRank", "Item_x0020_Type", "Parent/Id", "Author/Id", "Author/Title", "Parent/Title", "TaskCategories/Id", "TaskCategories/Title", "AssignedTo/Id", "AssignedTo/Title", "TeamMembers/Id", "TeamMembers/Title", "ClientCategory/Id", "ClientCategory/Title")
                    .expand("TeamMembers", "Author", "ClientCategory", "Parent", "TaskCategories", "AssignedTo", "ClientCategory")
                    .top(4999)
                    .get()
            } else {
                componentDetails = await web.lists
                    .getById(GlobalConstants.MASTER_TASKS_LISTID)
                    .items
                    .select("ID", "Title", "DueDate", "Status", "ItemRank", "Item_x0020_Type", "Parent/Id", "Author/Id", "Author/Title", "Parent/Title", "TaskCategories/Id", "TaskCategories/Title", "AssignedTo/Id", "AssignedTo/Title", "TeamMembers/Id", "TeamMembers/Title", "ClientCategory/Id", "ClientCategory/Title")
                    .expand("TeamMembers", "Author", "ClientCategory", "Parent", "TaskCategories", "AssignedTo", "ClientCategory").filter("Portfolio_x0020_Type eq '" + type + "'")
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
                if (result.TeamMembers != undefined && result.TeamMembers.length > 0) {
                    $.each(result.TeamMembers, function (index: any, Assig: any) {
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

                // if (result.ClientCategory != undefined && result.ClientCategory.length > 0) {
                //     $.each(result.TeamMembers, function (index: any, catego: any) {
                //         result.ClientCategory.push(catego);
                //     })
                // }
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
export const GetServiceAndComponentAllData = async (Props?: any | null, filter?: any | null) => {
    var ComponentsData: any = [];
    var AllPathGeneratedData: any = [];
    let AllPathGeneratedProjectdata: any = [];
    // let TaskUsers: any = [];
    let AllMasterTaskData: any = [];
    try {
        
        let Response: ArrayLike<any> = [];
        Response = await loadTaskUsers();
        let ProjectData: any = [];
        let web = new Web(Props.siteUrl);
        AllMasterTaskData = await web.lists
            .getById(Props.MasterTaskListID)
            .items
            .select("ID", "Id", "Title", "PortfolioLevel", "PortfolioStructureID", "HelpInformationVerifiedJson", "HelpInformationVerified", "Comments", "ItemRank", "Portfolio_x0020_Type", "Parent/Id", "Parent/Title", "DueDate",
                "Created", "Body", "SiteCompositionSettings", "Sitestagging", "Item_x0020_Type", "Categories", "Short_x0020_Description_x0020_On", "Help_x0020_Information", "PriorityRank",
                "Priority", "AssignedTo/Title", "TeamMembers/Id", "TeamMembers/Title", "ClientCategory/Id", "ClientCategory/Title", "PercentComplete", "ResponsibleTeam/Id", "Author/Id",
                "Author/Title", "ResponsibleTeam/Title", "PortfolioType/Id", "PortfolioType/Color", "PortfolioType/IdRange", "PortfolioType/Title", "AssignedTo/Id", "Deliverables",
                "TechnicalExplanations", "Help_x0020_Information", "AdminNotes", "Background", "Idea", "ValueAdded", "FeatureType/Title", "FeatureType/Id", "Portfolios/Id", "Portfolios/Title", "Editor/Id", "Modified", "Editor/Title")
            .expand("Parent", "PortfolioType", "AssignedTo", "Author", "ClientCategory", "TeamMembers", "FeatureType", "ResponsibleTeam", "Editor", "Portfolios").filter(filter != null ? filter : '')
            .getAll();

        // console.log("all Service and Coponent data form global Call=======", AllMasterTaskData);
        // TaskUsers = await AllTaskUsers(Props.siteUrl, Props.TaskUserListId);
        $.each(AllMasterTaskData, function (index: any, result: any) {
            result.isSelected = false;
            result.siteUrl = Props?.siteUrl;
            result["siteType"] = "Master Tasks";
            result.AllTeamName = "";
            result.listId = Props.MasterTaskListID;
            result.TaskID = result?.PortfolioStructureID;
            result.portfolioItemsSearch = result.Item_x0020_Type;
            result.isSelected = Props?.selectedItems?.find((obj: any) => obj.Id === result.ID);
            result.TeamLeaderUser = [];
            result.SmartPriority;

            result.DisplayDueDate = moment(result.DueDate).format("DD/MM/YYYY");
            result.DisplayCreateDate = moment(result.Created).format("DD/MM/YYYY");
            result.DueDate = moment(result.DueDate).format('DD/MM/YYYY')
            if (result.DueDate == 'Invalid date' || '') {
                result.DueDate = result.DueDate.replaceAll("Invalid date", "")
            }
            if (result.DisplayDueDate == "Invalid date" || "") {
                result.DisplayDueDate = result.DisplayDueDate.replaceAll(
                    "Invalid date",
                    ""
                );
            }
            if (result.DisplayCreateDate == "Invalid date" || "") {
                result.DisplayCreateDate = result.DisplayCreateDate.replaceAll(
                    "Invalid date",
                    ""
                );
            }
            if (result.PercentComplete != undefined)
                result.PercentComplete = (result.PercentComplete * 100).toFixed(0);

            if (result.Short_x0020_Description_x0020_On != undefined) {
                result.Short_x0020_Description_x0020_On = result.Short_x0020_Description_x0020_On.replace(/(<([^>]+)>)/ig, '');
            }
            if (result.Item_x0020_Type === "Component") {
                result.boldRow = "boldClable";
                result.lableColor = "f-bg";
                result.ItemCat = "Portfolio"
            }
            if (result.Item_x0020_Type === "SubComponent") {
                result.lableColor = "a-bg";
                result.ItemCat = "Portfolio"
            }
            if (result.Item_x0020_Type === "Feature") {
                result.lableColor = "w-bg";
                result.ItemCat = "Portfolio"
            }
            if (result.Item_x0020_Type === "Project") {
                result.lableColor = "w-bg";
                result.ItemCat = "Project"
            }
            if (result.Item_x0020_Type === "Sprint") {
                result.ItemCat = "Project"
            }
            if (result?.Item_x0020_Type != undefined) {
                result.SiteIconTitle = result?.Item_x0020_Type?.charAt(0);
            }
            result.FeatureTypeTitle = ''
            if (result?.FeatureType?.Id != undefined) {
                result.FeatureTypeTitle = result?.FeatureType?.Title
            }


            result.descriptionsSearch = '';
            result.commentsSearch = "";
            result.descriptionsDeliverablesSearch = '';
            result.descriptionsHelpInformationSarch = '';
            result.descriptionsShortDescriptionSearch = '';
            result.descriptionsTechnicalExplanationsSearch = '';
            result.descriptionsBodySearch = '';
            result.descriptionsAdminNotesSearch = '';
            result.descriptionsValueAddedSearch = '';
            result.descriptionsIdeaSearch = '';
            result.descriptionsBackgroundSearch = '';
            try {
                result.descriptionsSearch = portfolioSearchData(result)
                if (result?.Deliverables != undefined) {
                    result.descriptionsDeliverablesSearch = `${removeHtmlAndNewline(result.Deliverables)}`;
                }
                if (result.Help_x0020_Information != undefined) {
                    result.descriptionsHelpInformationSarch = `${removeHtmlAndNewline(result?.Help_x0020_Information)}`;
                }
                if (result.Short_x0020_Description_x0020_On != undefined) {
                    result.descriptionsShortDescriptionSearch = ` ${removeHtmlAndNewline(result.Short_x0020_Description_x0020_On)} `;
                }
                if (result.TechnicalExplanations != undefined) {
                    result.descriptionsTechnicalExplanationsSearch = `${removeHtmlAndNewline(result.TechnicalExplanations)}`;
                }
                if (result.Body != undefined) {
                    result.descriptionsBodySearch = `${removeHtmlAndNewline(result.Body)}`;
                }
                if (result.AdminNotes != undefined) {
                    result.descriptionsAdminNotesSearch = `${removeHtmlAndNewline(result.AdminNotes)}`;
                }
                if (result.ValueAdded != undefined) {
                    result.descriptionsValueAddedSearch = `${removeHtmlAndNewline(result.ValueAdded)}`;
                }
                if (result.Idea != undefined) {
                    result.descriptionsIdeaSearch = `${removeHtmlAndNewline(result.Idea)}`;
                }
                if (result.Background != undefined) {
                    result.descriptionsBackgroundSearch = `${removeHtmlAndNewline(result.Background)}`;
                }
                result.commentsSearch = result?.Comments != null && result?.Comments != undefined ? result.Comments.replace(/(<([^>]+)>)/gi, "").replace(/\n/g, '') : '';
            } catch (error) {

            }
            result.Id = result.Id != undefined ? result.Id : result.ID;
            result["TaskID"] = result?.PortfolioStructureID;
            if (result.AssignedTo != undefined && result.AssignedTo.length > 0) {
                $.each(result.AssignedTo, function (index: any, Assig: any) {
                    if (Assig.Id != undefined) {
                        $.each(Response, function (index: any, users: any) {
                            if (Assig.Id != undefined && users.AssingedToUserId != undefined && Assig.Id == users.AssingedToUserId) {
                                users.ItemCover = users.Item_x0020_Cover;
                                result.TeamLeaderUser.push(users);
                                result.AllTeamName += users.Title + ";";
                            }
                        })
                    }
                })
            }
            if (result.TeamMembers != undefined && result.TeamMembers.length > 0) {
                $.each(result.TeamMembers, function (index: any, Assig: any) {
                    if (Assig.Id != undefined) {
                        $.each(Response, function (index: any, users: any) {
                            if (Assig.Id != undefined && users.AssingedToUserId != undefined && Assig.Id == users.AssingedToUserId) {
                                users.ItemCover = users.Item_x0020_Cover;
                                result.TeamLeaderUser.push(users);
                                result.AllTeamName += users.Title + ";";
                            }

                        })
                    }
                })
            }
            if (
                result.ResponsibleTeam != undefined &&
                result.ResponsibleTeam.length > 0
            ) {
                result?.ResponsibleTeam?.map((Assig: any) => {
                    if (Assig.Id != undefined) {
                        $.each(Response, function (index: any, users: any) {
                            if (
                                Assig.Id != undefined &&
                                users.AssingedToUser != undefined &&
                                Assig.Id == users.AssingedToUser.Id
                            ) {
                                users.ItemCover = users.Item_x0020_Cover;
                                result.TeamLeaderUser.push(users);
                                result.AllTeamName += users.Title + ";";
                            }
                        });
                    }
                });
            }
            if (result?.ClientCategory?.length > 0) {
                result.ClientCategorySearch = result?.ClientCategory?.map(
                    (elem: any) => elem.Title
                ).join(" ");
            } else {
                result.ClientCategorySearch = "";
            }
            // if (result.ClientCategory != undefined && result.ClientCategory.length > 0) {
            //     $.each(result.TeamMembers, function (index: any, categoryData: any) {
            //         result.ClientCategory.push(categoryData);
            //     })
            // }
            if (result?.Item_x0020_Type != undefined) {
                result.SiteIconTitle = result?.Item_x0020_Type?.charAt(0);
            }
            if (result.Item_x0020_Type == 'Component' && Props?.projectSelection != true) {
                const groupedResult = componentGrouping(result, AllMasterTaskData)
                AllPathGeneratedData = [...AllPathGeneratedData, ...groupedResult?.PathArray];
                ComponentsData.push(groupedResult?.comp);
            }
            if (result.Item_x0020_Type == 'Project' && Props?.projectSelection == true) {
                const groupedResult = componentGrouping(result, AllMasterTaskData)
                AllPathGeneratedData = [...AllPathGeneratedData, ...groupedResult?.PathArray];
                ComponentsData.push(groupedResult?.comp);
            }
            if (result.Item_x0020_Type == 'Project') {
                const groupedResult = componentGrouping(result, AllMasterTaskData)
                AllPathGeneratedProjectdata = [...AllPathGeneratedProjectdata, ...groupedResult?.PathArray];
            }
            let checkIsSCProtected: any = false;
            if (result?.SiteCompositionSettings != undefined) {
                let TempSCSettingsData: any = JSON.parse(result?.SiteCompositionSettings);
                if (TempSCSettingsData?.length > 0) {
                    checkIsSCProtected = TempSCSettingsData[0].Protected;
                }
                result.compositionType = siteCompositionType(result?.SiteCompositionSettings);
            } else {
                result.compositionType = '';
            }
            if (Props?.usedFor !== undefined && Props?.usedFor == "Site-Composition") {
                if (checkIsSCProtected) {
                    result.IsSCProtected = true;
                    result.IsSCProtectedStatus = "Protected";
                } else {
                    result.IsSCProtected = false;
                    result.IsSCProtectedStatus = "";
                }
            }
        });
        ProjectData = AllMasterTaskData?.filter(
            (projectItem: any) => projectItem.Item_x0020_Type === "Project"
        );

        let dataObject = {
            GroupByData: ComponentsData,
            AllData: AllPathGeneratedData,
            ProjectData: ProjectData,
            FlatProjectData: AllPathGeneratedProjectdata
        }
        return dataObject;

    } catch (error) {
        console.log("Error:", error)
    }
    console.log("all Service and Coponent data in global common =======", AllMasterTaskData)
}



export const componentGrouping = (Portfolio: any, AllProtFolioData: any, path: string = "") => {
    let pathArray: any = [];
    Portfolio.subRows = [];
    let subComFeat = AllProtFolioData?.filter((comp: any) => comp?.Parent?.Id === Portfolio?.Id);
    Portfolio.subRows = Portfolio?.subRows?.concat(subComFeat);

    // Create the path for the Portfolio by appending its name to the existing path
    Portfolio.Path = `${Portfolio.Title}`;
    pathArray.push(Portfolio);
    subComFeat?.forEach((subComp: any) => {
        subComp.subRows = [];
        let allFeattData = AllProtFolioData?.filter((elem: any) => elem?.Parent?.Id === subComp?.Id);
        subComp.subRows = subComp?.subRows?.concat(allFeattData);

        // Create the path for the sub-component by appending its name to the Portfolio's path
        subComp.Path = `${Portfolio.Path}>${subComp.Title}`;
        pathArray.push(subComp);
        allFeattData?.forEach((subFeat: any) => {
            subFeat.subRows = [];
            // Create the hierarchy path by appending the current sub-component and feature names to the sub-component's path
            subFeat.Path = `${subComp.Path}>${subFeat.Title}`;
            pathArray.push(subFeat);
        });
    });

    return {
        comp: Portfolio,
        PathArray: pathArray
    };
}

const AllTaskUsers = async (siteUrl: any, ListId: any) => {
    let taskUser;
    try {
        let web = new Web(siteUrl);
        taskUser = await web.lists
            .getById(ListId)
            .items
            .select("Id,UserGroupId,Suffix,Title,Email,SortOrder,Role,Company,ParentID1,Status,Item_x0020_Cover,AssingedToUserId,isDeleted,AssingedToUser/Title,AssingedToUser/Id,AssingedToUser/EMail,ItemType,Approver/Id,Approver/Title,Approver/Name&$expand=AssingedToUser,Approver")
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
export const GetCompleteTaskId = (Item: any) => {
    const { Portfolio, TaskID, ParentTask, Id, TaskType } = Item;
    let taskIds = "";
    if (Portfolio?.PortfolioStructureID) {
        taskIds += Portfolio.PortfolioStructureID;
    }
    if (TaskType?.Title === 'Activities' || TaskType?.Title === 'Workstream') {
        taskIds += taskIds.length > 0 ? `-${TaskID}` : `${TaskID}`;
    }
    if (ParentTask?.TaskID && TaskType?.Title === 'Task') {
        taskIds += taskIds.length > 0 ? `-${ParentTask?.TaskID}-T${Id}` : `${ParentTask?.TaskID}-T${Id}`;
    } else if (ParentTask?.TaskID == undefined && TaskType?.Title === 'Task') {
        taskIds += taskIds.length > 0 ? `-T${Id}` : `T${Id}`;
    } else if (taskIds?.length <= 0) {
        taskIds += `T${Id}`;
    }
    return taskIds;
};

export const GetTaskId = (Item: any) => {
    const { TaskID, ParentTask, Id, TaskType, Item_x0020_Type } = Item;
    let taskIds = "";
    if (TaskType?.Title === 'Activities' || TaskType?.Title === 'Workstream') {
        taskIds += taskIds.length > 0 ? `-${TaskID}` : `${TaskID}`;
    }
    if (ParentTask?.TaskID != undefined && TaskType?.Title === 'Task') {
        taskIds += taskIds.length > 0 ? `-${ParentTask?.TaskID}-T${Id}` : `${ParentTask?.TaskID}-T${Id}`;
    }
    else if (ParentTask?.TaskID == undefined && TaskType?.Title === 'Task') {
        taskIds += taskIds.length > 0 ? `-T${Id}` : `T${Id}`;
    } else if (taskIds?.length <= 0) {
        taskIds += `T${Id}`;
    }
    return taskIds;
};
export const findTaskHierarchy = (
    row: any,
    AllMatsterAndTaskData: any
): any[] => {
    let createGrouping = (row: any): any[] => {
        for (let i = 0; i < AllMatsterAndTaskData.length; i++) {
            let Object = AllMatsterAndTaskData[i];
            // if (Object?.Item_x0020_Type?.toLowerCase() != 'task') {
            //     Object.SiteIconTitle = Object?.Item_x0020_Type?.charAt(0);
            // }
            if (Object.Id === row?.ParentTask?.Id && row?.siteType === Object?.siteType && row?.TaskType?.Title != "Activities") {
                Object.subRows = [];
                Object.subRows.push(row);
                return createGrouping(Object);
            } else if (Object.Id === row?.Parent?.Id) {
                Object.subRows = [];
                Object.subRows.push(row);
                return createGrouping(Object);
            } else if (
                row?.Portfolio != undefined &&
                Object.Id === row?.Portfolio?.Id &&
                (row?.ParentTask?.Id == undefined || row?.TaskType?.Title == "Activities")
            ) {
                Object.subRows = [];
                Object.subRows.push(row);
                return createGrouping(Object);
            }
        }
        return [row];
    };
    return createGrouping(row);
};

export const loadAllTimeEntry = async (timesheetListConfig: any) => {
    var AllTimeEntry: any = []
    if (timesheetListConfig?.Id != undefined) {
        let timesheetLists: any = [];
        timesheetLists = JSON.parse(timesheetListConfig?.Configurations)
        if (timesheetLists?.length > 0) {
            const fetchPromises = timesheetLists.map(async (list: any) => {
                let web = new Web(list?.siteUrl);
                try {
                    const data = await web.lists.getById(list?.listId).items.select(list?.query).getAll();
                    AllTimeEntry = [...AllTimeEntry, ...data];
                } catch (error) {
                    console.log(error, 'HHHH Time');
                }
            });
            await Promise.all(fetchPromises)
            return AllTimeEntry
        }

    }
}
export const loadAllSiteTasks = async (allListId?: any | null, filter?: any | null, pertiCularSites?: any | null, showOffShore?: any | undefined) => {
    let query = "Id,Title,Comments,FeedBack,WorkingAction,PriorityRank,Remark,Project/PriorityRank,EstimatedTimeDescription,ClientActivityJson,Project/PortfolioStructureID,ParentTask/Id,ParentTask/Title,ParentTask/TaskID,TaskID,SmartInformation/Id,SmartInformation/Title,Project/Id,Project/Title,workingThisWeek,EstimatedTime,TaskLevel,TaskLevel,OffshoreImageUrl,OffshoreComments,SiteCompositionSettings,Sitestagging,Priority,Status,ItemRank,IsTodaysTask,Body,Portfolio/Id,Portfolio/Title,Portfolio/PortfolioStructureID,PercentComplete,Categories,StartDate,PriorityRank,DueDate,TaskType/Id,TaskType/Title,TaskType/Level,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title,TaskCategories/Id,TaskCategories/Title,AssignedTo/Id,AssignedTo/Title,TeamMembers/Id,TeamMembers/Title,ResponsibleTeam/Id,ResponsibleTeam/Title,ClientCategory/Id,ClientCategory/Title&$expand=AssignedTo,Project,ParentTask,SmartInformation,Author,Portfolio,Editor,TaskType,TeamMembers,ResponsibleTeam,TaskCategories,ClientCategory"
    if (filter != undefined) {
        query += `&$filter=${filter}`
    }
    let siteConfig: any = await loadSmartMetadata(allListId, "Sites")
    let filteredSiteConfig = [];
    if (pertiCularSites != null && pertiCularSites != undefined) {
        filteredSiteConfig = siteConfig.filter((site: any) => pertiCularSites?.find((item: any) => site?.Title?.toLowerCase() == item?.toLowerCase()))
    } else if (showOffShore == true) {
        filteredSiteConfig = siteConfig.filter((site: any) => site?.Title != "Master Tasks" && site?.Title != "SDC Sites")
    } else {
        filteredSiteConfig = siteConfig.filter((site: any) => site?.Title != "Master Tasks" && site?.Title != "SDC Sites" && site?.Title != "Offshore Tasks")
    }
    let AllSiteTasks: any = []
    if (filteredSiteConfig?.length > 0) {
        const fetchPromises = filteredSiteConfig.map(async (site: any) => {
            let web = new Web(allListId?.siteUrl);
            try {
                const data = await web.lists.getById(site?.listId).items.select(query).getAll();
                data?.map((task: any) => {
                    task.siteType = site.Title;
                    task.listId = site.listId;
                    task.siteUrl = site.siteUrl.Url;
                    task.SmartPriority;
                    task.TaskTypeValue = '';
                    task.projectPriorityOnHover = '';
                    task.taskPriorityOnHover = task?.PriorityRank;
                    task.showFormulaOnHover;
                    task["SiteIcon"] = site?.Item_x005F_x0020_Cover?.Url;
                    if (task.PercentComplete != undefined) {
                        task.PercentComplete = (task.PercentComplete * 100).toFixed(0);
                    }
                    if (task?.Portfolio?.Id != undefined) {
                        task.portfolio = task?.Portfolio;
                        task.PortfolioTitle = task?.Portfolio?.Title;
                    }
                    let checkIsSCProtected: any = false;
                    task.DisplayDueDate = moment(task?.DueDate).format("DD/MM/YYYY");
                    if (task.DisplayDueDate == "Invalid date" || "") {
                        task.DisplayDueDate = task?.DisplayDueDate.replaceAll("Invalid date", "");
                    }
                    task.DisplayCreateDate = moment(task.Created).format("DD/MM/YYYY");
                    task.descriptionsSearch = descriptionSearchData(task);
                    if (task.Project) {
                        task.ProjectTitle = task?.Project?.Title;
                        task.ProjectId = task?.Project?.Id;
                        task.projectStructerId =
                            task?.Project?.PortfolioStructureID;
                        const title = task?.Project?.Title || "";
                        const dueDate = task?.DueDate;
                        task.joinedData = [];
                        if (title) task.joinedData.push(`Title: ${title}`);
                        if (dueDate) task.joinedData.push(`Due Date: ${dueDate}`);
                    }
                    if (task?.SiteCompositionSettings != undefined) {
                        let TempSCSettingsData: any = JSON.parse(task?.SiteCompositionSettings);
                        if (TempSCSettingsData?.length > 0) {
                            checkIsSCProtected = TempSCSettingsData[0].Protected;
                        }
                        task.compositionType = siteCompositionType(task?.SiteCompositionSettings);
                    } else {
                        task.compositionType = '';
                    }
                    if (checkIsSCProtected) {
                        task.IsSCProtected = true;
                        task.IsSCProtectedStatus = "Protected";
                    } else {
                        task.IsSCProtected = false;
                        task.IsSCProtectedStatus = "";
                    }
                    task.portfolioItemsSearch = site.Title;
                    task.TaskID = GetTaskId(task);
                })
                AllSiteTasks = [...AllSiteTasks, ...data];
            } catch (error) {
                console.log(error, 'HHHH Time');
            }
        });
        await Promise.all(fetchPromises)
        return AllSiteTasks
    }
}

export const descriptionSearchData = (result: any) => {
    let descriptionSearchData = '';
    if (result?.FeedBack && result?.FeedBack != undefined) {
        const cleanText = (text: any) => text?.replace(/(<([^>]+)>)/gi, '').replace(/\n/g, '');

        try {
            const feedbackData = JSON.parse(result.FeedBack);
            descriptionSearchData = feedbackData[0]?.FeedBackDescriptions?.map((child: any) => {
                const childText = cleanText(child?.Title);
                const comments = (child?.Comments || [])?.map((comment: any) => {
                    const commentText = cleanText(comment?.Title);
                    const replyText = (comment?.ReplyMessages || [])?.map((val: any) => cleanText(val?.Title)).join(' ');
                    return [commentText, replyText]?.filter(Boolean).join(' ');
                }).join(' ');

                const subtextData = (child.Subtext || [])?.map((subtext: any) => {
                    const subtextComment = cleanText(subtext?.Title);
                    const subtextReply = (subtext.ReplyMessages || [])?.map((val: any) => cleanText(val?.Title)).join(' ');
                    const subtextComments = (subtext.Comments || [])?.map((subComment: any) => {
                        const subCommentTitle = cleanText(subComment?.Title);
                        const subCommentReplyText = (subComment.ReplyMessages || []).map((val: any) => cleanText(val?.Title)).join(' ');
                        return [subCommentTitle, subCommentReplyText]?.filter(Boolean).join(' ');
                    }).join(' ');
                    return [subtextComment, subtextReply, subtextComments].filter(Boolean).join(' ');
                }).join(' ');

                return [childText, comments, subtextData].filter(Boolean).join(' ');
            }).join(' ');

            result.descriptionsSearch = descriptionSearchData;
            return descriptionSearchData
        } catch (error) {
            console.error("Error:", error);
            return descriptionSearchData

        }
    }
}
export const portfolioSearchData = (items: any) => {
    let descriptionSearch = '';
    try {
        if (items?.Deliverables != undefined || items.Short_x0020_Description_x0020_On != undefined || items.TechnicalExplanations != undefined || items.Body != undefined || items.AdminNotes != undefined || items.ValueAdded != undefined
            || items.Idea != undefined || items.Background != undefined) {
            descriptionSearch = `${removeHtmlAndNewline(items?.Deliverables)} ${removeHtmlAndNewline(items?.Short_x0020_Description_x0020_On)} ${removeHtmlAndNewline(items?.TechnicalExplanations)} ${removeHtmlAndNewline(items?.Body)} ${removeHtmlAndNewline(items?.AdminNotes)} ${removeHtmlAndNewline(items?.ValueAdded)} ${removeHtmlAndNewline(items?.Idea)} ${removeHtmlAndNewline(items?.Background)}`;
        }
        return descriptionSearch
    } catch (error: any) {
        console.log(error)
        return descriptionSearch
    }
}
function removeHtmlAndNewline(text: any) {
    if (text) {
        let testValue = text.replace(/(<([^>]+)>)/gi, "").replace(/\n/g, '');
        return testValue?.trim()
    } else {
        return ''; // or any other default value you prefer
    }
}


//// make sure task object most have bilow properies//////
//// requrired result?.PriorityRank ////
//// requrired result?.Project?.PriorityRank ////
//// next Project array it is a lookup columns where project//////
///// next result?.TaskCategories ////

export const calculateSmartPriority = (result: any) => {
    let smartPriority = result.SmartPriority;
    if (result?.Project) {
        const priorityRank = result?.Project?.PriorityRank ?? 1;
        if (priorityRank >= 1 && result?.PriorityRank) {
            const hasImmediateCategory = result?.TaskCategories?.some((cat: any) => cat.Title === 'Immediate');
            const hasEmailNotificationCategory = result?.TaskCategories?.some((cat: any) => cat.Title === 'Email Notification');
            if (hasImmediateCategory) {
                smartPriority = ((result?.PriorityRank) + (priorityRank * 4)) / 5 * 2;
                result.showFormulaOnHover = `((TaskPriority : ${result?.PriorityRank}) + (ProjectPriority : ${priorityRank} * 4)) / 5 * 2`
            } else if (hasEmailNotificationCategory) {
                smartPriority = ((result?.PriorityRank * 2) + (priorityRank * 4)) / 5;
                result.showFormulaOnHover = `((TaskPriority : ${result?.PriorityRank} * 2) + (ProjectPriority : ${priorityRank} * 4)) / 5`
            } else {
                smartPriority = ((result?.PriorityRank) + (priorityRank * 4)) / 5;
                result.showFormulaOnHover = `((TaskPriority : ${result?.PriorityRank}) + (ProjectPriority : ${priorityRank} * 4)) / 5`
            }
            result.projectPriorityOnHover = priorityRank;
            smartPriority = parseFloat(smartPriority);
        }
    } else {
        const priorityRank = 1;
        result.projectPriorityOnHover = priorityRank;
        if (result?.PriorityRank) {
            const hasImmediateCategory = result?.TaskCategories?.some((cat: any) => cat.Title === 'Immediate');
            const hasEmailNotificationCategory = result?.TaskCategories?.some((cat: any) => cat.Title === 'Email Notification');
            if (hasImmediateCategory) {
                smartPriority = ((result?.PriorityRank) + (priorityRank * 4)) / 5 * 2;
                smartPriority = parseFloat(smartPriority);
                result.showFormulaOnHover = `((TaskPriority : ${result?.PriorityRank}) + (ProjectPriority : ${priorityRank} * 4)) / 5 * 2`
            } else if (hasEmailNotificationCategory) {
                smartPriority = ((result?.PriorityRank * 2) + (priorityRank * 4)) / 5;
                smartPriority = parseFloat(smartPriority);
                result.showFormulaOnHover = `((TaskPriority : ${result?.PriorityRank} * 2) + (ProjectPriority : ${priorityRank} * 4)) / 5`
            } else {
                smartPriority = ((result?.PriorityRank) + (priorityRank * 4)) / 5;
                smartPriority = parseFloat(smartPriority);
                result.showFormulaOnHover = `((TaskPriority : ${result?.PriorityRank}) + (ProjectPriority : ${priorityRank} * 4)) / 5`
            }
        }
    }
    return smartPriority;
}

function siteCompositionType(jsonStr: any) {
    var data = JSON.parse(jsonStr);
    try {
        data = data[0];
        for (var key in data) {
            if (data?.hasOwnProperty(key) && data[key] === true) {
                return key;
            }
        }
        return '';
    } catch (error) {
        console.log(error)
        return '';
    }
}
export const deepCopy = (obj: any, originalReferences = new WeakMap()) => {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    if (originalReferences.has(obj)) {
        return originalReferences.get(obj);
    }
    const copy: any = Array.isArray(obj) ? [] : {};
    originalReferences.set(obj, copy);
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            copy[key] = deepCopy(obj[key], originalReferences);
        }
    }
    return copy;
}

export const openUsersDashboard = (siteUrl?: any | undefined, AssignedUserId?: any | undefined, AssignedUserTitle?: any | undefined, AllTaskUsers?: any | undefined) => {
    let AssignedToUserId: any = AssignedUserId
    if (AllTaskUsers?.length > 0) {
        let AssignToUserDetail = AllTaskUsers?.find((user: any) => user?.AssingedToUser?.Title === AssignedUserTitle)
        AssignedToUserId = AssignToUserDetail?.AssingedToUser?.Id
    }
    if (AssignedToUserId != undefined) {
        window?.open(`${siteUrl}/SitePages/TaskDashboard.aspx?UserId=${AssignedToUserId}`, '_blank')
    } else {
        window?.open(`${siteUrl}/SitePages/TaskDashboard.aspx`, '_blank')
    }
}


//   use csae for openUsersDashboard function
// if have the AssignedUserId
// 1. openUsersDashboard(siteUrl:"Https....................", AssignedUserId:Number )

// if don't have the AssignedUserId
// 1. openUsersDashboard(siteUrl:"Https....................", AssignedUserId:Undefined,  AssignedUserTitle:"UserName", AllTaskUsers=[alltaskuserData])
export const getBreadCrumbHierarchyAllData = async (item: any, AllListId: any, AllItems?: any | []): Promise<any> => {
    let web = new Web(AllListId?.siteUrl);
    let Object: any;

    item.isExpanded = true;
    item.siteUrl = AllListId?.siteUrl
    if (item?.ParentTask != undefined || item?.ParentTask != null) {
        try {
            Object = await web.lists.getById(item?.listId)
                .items.getById(item?.ParentTask.Id).select(
                    "Id, TaskID, TaskId, Title, ParentTask/Id, ParentTask/Title, Portfolio/Id, Portfolio/Title, Portfolio/PortfolioStructureID"
                )
                .expand("ParentTask, Portfolio")
                .get();
        } catch (error) {
            console.error(error)
        }
    }
    else if (item.Parent != undefined || item?.Portfolio != undefined) {
        let useId = item.Portfolio != undefined ? item?.Portfolio?.Id : item?.Parent?.Id;
        try {
            Object = await web.lists.getById(AllListId?.MasterTaskListID)
                .items.getById(useId).select("Id, Title, Parent/Id, Parent/Title, PortfolioStructureID, PortfolioType/Id,PortfolioType/Title,PortfolioType/Color")
                .expand("Parent", "PortfolioType")
                .get()
        }
        catch (error) {
            console.error(error)
        }
    }

    if (Object != undefined) {
        if (
            Object?.Id === item?.ParentTask?.Id
        ) {
            Object.subRows = [item]; AllItems?.push(item)
            Object.listId = item?.listId;
            Object.SiteIcon = item?.SiteIcon;
            Object.siteType = item?.siteType;
            return getBreadCrumbHierarchyAllData(Object, AllListId, AllItems);
        } else if (Object?.Id === item?.Parent?.Id) {
            item.siteType = "Master Tasks"
            Object.subRows = [item]; AllItems?.push(item)
            if (Object?.Parent == undefined) {
                Object.siteType = "Master Tasks"
                Object.subRows = [item]; AllItems?.push(Object)
            } else {
                return getBreadCrumbHierarchyAllData(Object, AllListId, AllItems);
            }

        } else if (
            item?.Portfolio != undefined &&
            Object?.Id === item?.Portfolio?.Id &&
            (item?.ParentTask?.TaskID == null || item?.ParentTask?.TaskID == undefined)
        ) {
            Object.subRows = [item];
            AllItems?.push(item)
            if (Object?.Parent == undefined) {
                Object.siteType = "Master Tasks"
                Object.subRows = [Object];
                AllItems?.push(Object)
            }
            return getBreadCrumbHierarchyAllData(Object, AllListId, AllItems);
        }

    }
    return { withGrouping: item, flatdata: AllItems };
}
export const AwtGroupingAndUpdatePrarticularColumn = async (findGrouping: any, AllTask: any, UpdateColumnObject?: any) => {
    let flatdata: any = []
    if (findGrouping?.TaskType?.Title == "Activities") {
        findGrouping.subRows = AllTask?.filter((ws: any) => {
            if (ws.TaskType?.Title == "Workstream" && ws?.ParentTask?.Id == findGrouping?.Id) {
                flatdata.push(ws)
                return true
            }
        })

        findGrouping?.subRows?.map((ws: any) => {
            ws.subRows = AllTask?.filter((task: any) => {
                if (task.TaskType?.Title == "Task" && task?.ParentTask?.Id == ws?.Id) {
                    flatdata.push(task)
                    return true
                }
            })
        })
        let directTask = AllTask?.filter((task: any) => {
            if (task.TaskType?.Title == "Task" && task?.ParentTask?.Id == findGrouping?.Id) {
                flatdata.push(task)
                return true
            }
        })
        // findGrouping.subRows = findGrouping?.subRows?.concat(directTask)
        // flatdata.push(directTask)
    }
    if (findGrouping?.TaskType?.Title == "Workstream") {
        findGrouping.subRows = AllTask?.filter((task: any) => {
            if (task.TaskType?.Title == "Task" && task?.ParentTask?.Id == findGrouping?.Id) {
                flatdata.push(task)
                return true
            }
        })
    }

    if (UpdateColumnObject != undefined) {

        for (let i = 0; i < flatdata?.length;) {

            let web = new Web(findGrouping.siteUrl);
            await web.lists
                .getById(findGrouping?.listId)
                // .getById(this.props.SiteTaskListID)
                .items
                .getById(flatdata[i]?.Id)
                .update(UpdateColumnObject).then(async (data: any) => {
                    console.log(data)
                    i++;
                }).catch((error: any) => {
                    console.log(error)
                });
        }
    }
    return { findGrouping, flatdata }; 
}
export const replaceURLsWithAnchorTags = (text:any) => {
    // Regular expression to match URLs
    var urlRegex = /(https?:\/\/[^\s<>"]+)(?=["'\s.,]|$)/g;
    // Replace URLs with anchor tags
    let textToIgnore :any= ''
    var replacedText = text.replace(urlRegex, function (url:any) {
        if (!isURLInsideAnchorTag(url, text) && !textToIgnore.includes(url)) {
            console.log(url,'in if')
            return '<a href="' + url + '" target="_blank" data-interception="off" class="hreflink">' + url + '</a>';
        } else{
            textToIgnore += `${url} `
            return url;
        }
    });
    return replacedText;
}

function isURLInsideAnchorTag(url:any, text:any) {
    // Regular expression to match anchor tags
    var anchorRegex = /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/i;
    return anchorRegex.test(text) && anchorRegex.exec(text)[2] === url;
}
//--------------------------------------Share TimeSheet Report-----------------------------------------------------------------------

export const ShareTimeSheet = async (AllTaskTimeEntries: any, taskUser: any, Context: any, type: any) => {
    let AllData: any = []
    var isCustomDate = false;
    const currentLoginUserId = Context.pageContext?._legacyPageContext.userId;
    const CurrentUserTitle = Context.pageContext?._legacyPageContext?.userDisplayName;

    var startDateMid =''
    var eventDateMid = ''
    if (type == "Today" || type == "Yesterday" || type == "This Week" ||  type == "Last Week" || type == "This Month"){
        const startDate = getStartingDate(type);
        const endDate = getEndingDate(type);
        const startDateMidnight = new Date(startDate.setHours(0, 0, 0, 0));
        const endDateMidnight = new Date(endDate.setHours(0, 0, 0, 0));
    
         startDateMid = moment(startDateMidnight).format("DD/MM/YYYY")
         eventDateMid = moment(endDateMidnight).format("DD/MM/YYYY")
      }
      else{
        var splitDate = type.split(' - ')
         startDateMid = splitDate[0]
         eventDateMid = splitDate[1]
         if(splitDate[0] == splitDate[1]){
            isCustomDate = false
         }
         else{
            isCustomDate = true;
         }
        
      }
     
    
    var NewStartDate = startDateMid.split("/")
    var NewEndDate = eventDateMid.split("/")

    var End = NewEndDate[2] + NewEndDate[1] + NewEndDate[0]
    var starts = NewStartDate[2] + NewStartDate[1] + NewStartDate[0]
    const { weekTimeEntries, totalTime } = AllTaskTimeEntries?.reduce(
        (acc: any, timeEntry: any) => {
            try {
                if (timeEntry?.AdditionalTimeEntry) {
                    const AdditionalTime = JSON.parse(timeEntry?.AdditionalTimeEntry);

                    AdditionalTime?.forEach((filledTime: any) => {
                        const [day, month, year] = filledTime?.TaskDate?.split('/');
                        const timeFillDate = new Date(+year, +month - 1, +day);
                        var b = moment(timeFillDate).format("DD/MM/YYYY")
                        var newDate = b.split("/")
                        var seleteddate = newDate[2] + newDate[1] + newDate[0]

                        if (
                            filledTime?.AuthorId == currentLoginUserId &&
                            seleteddate >= starts &&
                            seleteddate <= End && timeEntry?.taskDetails[0]

                        ) {
                            const data = { ...timeEntry.taskDetails[0] } || {};
                            const taskTime = parseFloat(filledTime.TaskTime);

                            data.TaskTime = taskTime;
                            data.timeDate = filledTime.TaskDate;
                            data.Description = filledTime.Description;
                            data.timeFillDate = timeFillDate;

                            acc.weekTimeEntries.push(data);
                            acc.totalTime += taskTime;
                        }
                    });
                }

            } catch (error) {

            }
            return acc;
        },
        { weekTimeEntries: [], totalTime: 0 }
    );
    weekTimeEntries.sort((a: any, b: any) => {
        return b.timeFillDate - a.timeFillDate;
    });
    AllData = weekTimeEntries;
    var input = `${type}time entries`
    var day = type;
    let currentDate = moment(new Date()).format("DD/MM/YYYY")
    var today = new Date();
    const yesterdays = new Date(today.setDate(today.getDate() - 1))
    const yesterday = moment(yesterdays).format("DD/MM/YYYY")
    let body: any = '';
    let text = '';
    let to: any = [];
    let body1: any = [];
    let userApprover: any = '';
    let email: any = [];

    taskUser?.map((user: any) => {
        user.UserManagerMail = [];
        user.UserManagerName = ''
        user?.Approver?.map((Approver: any, index: any) => {
            if (index == 0) {

                user.UserManagerName = Approver?.Title;
            } else {
                user.UserManagerName += ' ,' + Approver?.Title
            }
            let Mail = Approver?.Name?.split('|')[2]
            user.UserManagerMail.push(Mail)
        })
        if (user?.AssingedToUser?.Id == currentLoginUserId && user?.Title != undefined) {
            to = user?.UserManagerMail;
            userApprover = user?.UserManagerName;
            email.push(user?.UserManagerMail)
        }
    });


    body = body.replaceAll('>,<', '><').replaceAll(',', '')


    // var subject = currentLoginUser + `- ${selectedTimeReport} Time Entries`;
    let timeSheetData: any = await currentUserTimeEntryCalculation(AllTaskTimeEntries, currentLoginUserId);
    var updatedCategoryTime: any = {};
    for (const key in timeSheetData) {
        if (timeSheetData.hasOwnProperty(key)) {
            let newKey = key;

            // Replace 'this month' with 'thisMonth'
            newKey = newKey.replace('this month', 'thisMonth');

            // Replace 'this week' with 'thisWeek'
            newKey = newKey.replace('this week', 'thisWeek');

            updatedCategoryTime[newKey] = timeSheetData[key];
        }
    }
    var subject: any;
    // if (day == 'Today') {
    //     subject = "Daily Timesheet - " + CurrentUserTitle + ' - ' + currentDate + ' - ' + (updatedCategoryTime.today) + ' hours '
    // }
    // if (day == 'Yesterday') {
    //     subject = "Daily Timesheet - " + CurrentUserTitle + ' - ' + yesterday + ' - ' + (updatedCategoryTime.yesterday) + ' hours '
    // }
    function padWithZero(num: number): string {
        return num < 10 ? '0' + num : num.toString();
    }
    
    function formatDate(date: Date): string {
        const day = padWithZero(date.getDate());
        const month = padWithZero(date.getMonth() + 1); 
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
      if (day == "Today") {
        subject = "Daily Timesheet - " + CurrentUserTitle + " - " + currentDate + " - " + updatedCategoryTime.today +  " hours ";
      } else if (day == "Yesterday") {
        subject =
          "Daily Timesheet - " +
          CurrentUserTitle +
          " - " +
          yesterday +
          " - " +
          updatedCategoryTime.yesterday +
          " hours ";
      } else {
        subject =
          "Daily Timesheet - " +
          CurrentUserTitle +
          " - " +
          type;
          day = 'Custom'
      }
    AllData.map((item: any) => {
        item.ClientCategories = ''
        item.ClientCategory.forEach((val: any, index: number) => {
            item.ClientCategories += val.Title;

            // Add a comma only if it's not the last item
            if (index < item.ClientCategory.length - 1) {
                item.ClientCategories += '; ';
            }
        });


        text =
            '<tr>' +
            '<td style="border:1px solid #ccc;border-right:0px;border-top:0px;line-height:24px;font-size:13px;padding:5px;width:40px;text-align:center">' + item?.siteType + '</td>'
            + '<td style="border:1px solid #ccc;border-right:0px;border-top:0px;line-height:24px;font-size:13px;padding:5px;width:250px;text-align:center">' + '<p style="margin:0px;">' + '<a style="text-decoration:none;" href =' + item.siteUrl + '/SitePages/PX-Profile.aspx?ProjectId=' + item.Project?.Id + '><span style="font-size:13px">' + (item?.Project == undefined ? '' : item?.Project.Title) + '</span></a>' + '</p>' + '</td>'
            + '<td style="border:1px solid #ccc;border-right:0px;border-top:0px;line-height:24px;font-size:13px;padding:5px;width:135px;text-align:center">' + '<p style="margin:0px;">' + '<a style="text-decoration:none;" href =' + item.siteUrl + '/SitePages/Portfolio-Profile.aspx?taskId=' + item?.Portfolio?.Id + '><span style="font-size:13px">' + (item.Portfolio == undefined ? '' : item.Portfolio.Title) + '</span></a>' + '</p>' + '</td>'
            + '<td style="border:1px solid #ccc;border-right:0px;border-top:0px;line-height:24px;font-size:13px;padding:5px;width:250px;text-align:center">' + '<p style="margin:0px;">' + '<a style="text-decoration:none;" href =' + item.siteUrl + '/SitePages/Task-Profile.aspx?taskId=' + item.Id + '&Site=' + item.siteType + '><span style="font-size:13px">' + item.Title + '</span></a>' + '</p>' + '</td>'
            + '<td style="border:1px solid #ccc;border-right:0px;border-top:0px;line-height:24px;font-size:13px;padding:5px;width:40px;text-align:center">' + item?.TaskTime + '</td>'
            + '<td style="border:1px solid #ccc;border-right:0px;border-top:0px;line-height:24px;font-size:13px;padding:5px;text-align:center">' + item?.Description + '</td>'
            + '<td style="border:1px solid #ccc;border-right:0px;border-top:0px;line-height:24px;font-size:13px;padding:5px;width:120px;text-align:center">' + (item?.SmartPriority !== undefined ? item?.SmartPriority : '') + '</td>'
            + '<td style="border:1px solid #ccc;border-top:0px;line-height:24px;font-size:13px;padding:5px;width:130px;text-align:center">' + item.ClientCategories + '</td>'

        body1.push(text);

    });
    body =
        `<table width="100%" align="center" cellpadding="0" cellspacing="0" border="0">
            <thead>
            <tr valign="middle" style="font-size:15px;"><td style="font-weight:600; padding: 5px 0px;width: 210px;">Username: </td><td style="padding: 5px 0px;"> <a style="text-decoration:none;" href='${Context?.pageContext?.web?.absoluteUrl}/SitePages/TaskDashboard.aspx?UserId=${currentLoginUserId}'>${CurrentUserTitle}</a></td></tr>
            ${isCustomDate != true && `<tr valign="middle" style="font-size:15px;"><td style="font-weight:600; padding: 5px 0px;width: 210px;">Total hours ${day} :</td><td style="padding: 5px 0px;">${day == 'Today' ? updatedCategoryTime.today : updatedCategoryTime.yesterday} Hours</td></tr>
            <tr valign="middle" style="font-size:15px;"><td  ="font-weight:600; padding: 5px 0px;width: 210px;">Total hours this week :</td><td style="padding: 5px 0px;">${updatedCategoryTime.thisWeek} Hours</td></tr>
            <tr valign="middle" style="font-size:15px;"><td style="font-weight:600;padding: 5px 0px;width: 210px;">Total hours this month :</td><td style="padding: 5px 0px;">${updatedCategoryTime.thisMonth} Hours</td></tr>`}
            <tr valign="middle" style="font-size:15px;"><td colspan="2" style="padding: 5px 0px;"><a style="text-decoration:none;" href ='${Context.pageContext?.web?.absoluteUrl}/SitePages/UserTimeEntry.aspx?userId=${currentLoginUserId}'>Click here to open Online-Timesheet</a></td></tr>
            </thead>
            </table> `
        + '<table style="margin-top:20px;" cellspacing="0" cellpadding="0" width="100%" border="0">'
        + '<thead>'
        + '<tr>'
        + '<th style="line-height:24px;font-size:15px;padding:5px;width:40px;border:1px solid #ccc;border-right:0px;" bgcolor="#f5f5f5">' + 'Site' + '</th>'
        + '<th style="line-height:24px;font-size:15px;padding:5px;width:250px;border:1px solid #ccc;border-right:0px;" bgcolor="#f5f5f5">' + 'Project Title' + '</th>'
        + '<th style="line-height:24px;font-size:15px;padding:5px;width:135px;border:1px solid #ccc;border-right:0px;" bgcolor="#f5f5f5">' + 'Component' + '</th>'
        + '<th style="line-height:24px;font-size:15px;padding:5px;width:250px;border:1px solid #ccc;border-right:0px;" bgcolor="#f5f5f5">' + 'Task Name' + '</th>'
        + '<th style="line-height:24px;font-size:15px;padding:5px;width:40px;border:1px solid #ccc;border-right:0px;" bgcolor="#f5f5f5">' + 'Time' + '</th>'
        + '<th style="line-height:24px;font-size:15px;padding:5px;border:1px solid #ccc;border-right:0px;" bgcolor="#f5f5f5">' + 'Time Entry Description' + '</th>'
        + '<th style="line-height:24px;font-size:15px;padding:5px;width:120px;border:1px solid #ccc;border-right:0px;" bgcolor="#f5f5f5">' + 'Smart Priority' + '</th>'
        + '<th style="line-height:24px;font-size:15px;padding:5px;width:130px;border:1px solid #ccc;" bgcolor="#f5f5f5">' + 'Client Category' + '</th>'
        + '</tr>'
        + '</thead>'
        + '<tbody>'
        + '<tr>'
        + body1
        + '</tr>'
        + '</tbody>'
        + '</table>'

    body = body.replaceAll('>,<', '><').replaceAll(',', '')
    let EmailSubject: string = `TimeSheet : ${currentDate}`;

    let confirmation = confirm('Your' + ' ' + input + ' ' + 'will be automatically shared with your approver' + ' ' + '(' + userApprover + ')' + '.' + '\n' + 'Do you want to continue?')
    if (confirmation) {
        if (body1.length > 0 && body1 != undefined) {
            //SendEmailFinal(to, subject, body,Context);
            let sp = spfi().using(spSPFx(Context));
            sp.utility.sendEmail({
                //Body of Email  
                Body: body,
                //Subject of Email  
                Subject: subject,
                //Array of string for To of Email  
                To: to,
                AdditionalHeaders: {
                    "content-type": "text/html",
                    'Reply-To': 'santosh.kumar@smalsus.com'
                },
            }).then(() => {
                console.log("Email Sent!");
                alert('Email sent sucessfully');
            }).catch((err) => {
                console.log(err.message);
            });
        } else {
            alert("No entries available");
        }
    }

}

const currentUserTimeEntryCalculation = async (AllTaskTimeEntries: any, currentLoginUserId: any) => {
    const timesheetDistribution = ['Today', 'Yesterday', 'This Week', 'This Month'];
    const allTimeCategoryTime = timesheetDistribution?.reduce((totals, start) => {
        const startDate = getStartingDate(start);
        const startDateMidnight = new Date(startDate.setHours(0, 0, 0, 0));
        const endDate = getEndingDate(start);
        const endDateMidnight = new Date(endDate.setHours(0, 0, 0, 0));

        const total = AllTaskTimeEntries?.reduce((acc: any, timeEntry: any) => {

            if (timeEntry?.AdditionalTimeEntry) {
                const AdditionalTime = JSON.parse(timeEntry.AdditionalTimeEntry);

                const taskTime = AdditionalTime?.reduce((taskAcc: any, filledTime: any) => {
                    const [day, month, year] = filledTime?.TaskDate?.split('/');
                    const timeFillDate = new Date(+year, +month - 1, +day);

                    if (
                        filledTime?.AuthorId == currentLoginUserId &&
                        timeFillDate >= startDateMidnight &&
                        timeFillDate <= endDateMidnight

                    ) {
                        return taskAcc + parseFloat(filledTime.TaskTime);
                    }

                    return taskAcc;
                }, 0);

                return acc + taskTime;
            }

            return acc;
        }, 0);

        return { ...totals, [start.toLowerCase()]: total };
    }, {
        today: 0,
        yesterday: 0,
        thisWeek: 0,
        thisMonth: 0,
    });

    return allTimeCategoryTime;
};
function getStartingDate(startDateOf: any) {
    const startingDate = new Date();
    let formattedDate = startingDate;
    if (startDateOf == 'This Week') {
        startingDate.setDate(startingDate.getDate() - startingDate.getDay());
        formattedDate = startingDate;
    } else if (startDateOf == 'Today') {
        formattedDate = startingDate;
    } else if (startDateOf == 'Yesterday') {
        startingDate.setDate(startingDate.getDate() - 1);
        formattedDate = startingDate;
    } else if (startDateOf == 'This Month') {
        startingDate.setDate(1);
        formattedDate = startingDate;
    } else if (startDateOf == 'Last Month') {
        const lastMonth = new Date(startingDate.getFullYear(), startingDate.getMonth() - 1);
        const startingDateOfLastMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1);
        var change = (moment(startingDateOfLastMonth).add(17, 'days').format())
        var b = new Date(change)
        formattedDate = b;
    } else if (startDateOf == 'Last Week') {
        const lastWeek = new Date(startingDate.getFullYear(), startingDate.getMonth(), startingDate.getDate() - 7);
        const startingDateOfLastWeek = new Date(lastWeek.getFullYear(), lastWeek.getMonth(), lastWeek.getDate() - lastWeek.getDay() + 1);
        formattedDate = startingDateOfLastWeek;
    }

    return formattedDate;
}
function getEndingDate(startDateOf: any): Date {
    const endingDate = new Date();
    let formattedDate = endingDate;

    if (startDateOf === 'This Week') {
        endingDate.setDate(endingDate.getDate() + (6 - endingDate.getDay()));
        formattedDate = endingDate;
    } else if (startDateOf === 'Today') {
        formattedDate = endingDate;
    } else if (startDateOf === 'Yesterday') {
        endingDate.setDate(endingDate.getDate() - 1);
        formattedDate = endingDate;
    } else if (startDateOf === 'This Month') {
        endingDate.setMonth(endingDate.getMonth() + 1, 0);
        formattedDate = endingDate;
    } else if (startDateOf === 'Last Month') {
        const lastMonth = new Date(endingDate.getFullYear(), endingDate.getMonth() - 1);
        endingDate.setDate(0);
        formattedDate = endingDate;
    } else if (startDateOf === 'Last Week') {
        const lastWeek = new Date(endingDate.getFullYear(), endingDate.getMonth(), endingDate.getDate() - 7);
        endingDate.setDate(lastWeek.getDate() - lastWeek.getDay() + 7);
        formattedDate = endingDate;
    }

    return formattedDate;
}

//----------------------------End Time Report function------------------------------------------------------------------------------------


export const ShareTimeSheetMultiUser = async (AllTimeEntry: any, TaskUser: any, Context: any, DateType: any, selectedUser: any) => {
    let DevloperTime: any = 0.00;
    let QATime: any = 0.00;
    let QAMembers: any = 0;
    let DesignMembers: any = 0;
    let DesignTime: any = 0;
    let TotleTaskTime: any = 0;
    let DevelopmentMembers: any = 0;
    let TotalQAMember: any = 0;
    let TotalDesignMember: any = 0;
    let TotalDevelopmentMember: any = 0;
    let QAleaveHours: any = 0;
    let DevelopmentleaveHours: any = 0;
    let DesignMemberleaveHours: any = 0;
    let startDate: any = ''
    let DevCount: any = 0;
    let Trainee: any = 0;
    let DesignCount: any = 0;
    let QACount: any = 0;
    let TranineesNum: any = 0;
    const LeaveUserData = await GetleaveUser(TaskUser, Context)
    console.log(LeaveUserData)
    //-------------------------leave User Data---------------------------------------------------------------------------------------
    //-----------------------End--------------------------------------------------------------------------------------------------------------
    if (DateType == 'Yesterday' || DateType == 'Today') {
        startDate = getStartingDate(DateType);
    }
    startDate = getStartingDate(DateType);
    startDate = moment(startDate).format('DD/MM/YYYY')
    let endDate: any = getEndingDate(DateType);
    endDate = moment(endDate).format('DD/MM/YYYY')
    var selectedDate = startDate.split("/")
    var select = selectedDate[2] + selectedDate[1] + selectedDate[0]

    const currentLoginUserId = Context.pageContext?._legacyPageContext.userId;
    selectedUser?.forEach((items: any) => {
        if (items?.UserGroup?.Title == 'Senior Developer Team' || items?.UserGroup?.Title == 'Smalsus Lead Team' || items?.UserGroup?.Title == 'Junior Developer Team' || items?.UserGroup?.Title == 'Trainees') {
            DevCount++
        }
        if ((items?.TimeCategory == 'Design' && items.Company == 'Smalsus') || items?.UserGroup?.Title == 'Design Team') {
            DesignCount++
        }
        if ((items?.TimeCategory == 'QA' && items.Company == 'Smalsus') && items?.UserGroup?.Title != 'Ex-Staff') {
            QACount++
        }

    })
    TaskUser?.forEach((val: any) => {
        AllTimeEntry?.map((item: any) => {

            if (item?.AuthorId == val?.AssingedToUserId) {

                if (val?.UserGroup?.Title == 'Senior Developer Team' || val?.UserGroup?.Title == 'Smalsus Lead Team' || val?.UserGroup?.Title == 'External Staff')
                    item.Department = 'Developer';
                item.userName = val?.Title
                if (val?.UserGroup?.Title == 'Junior Developer Team')
                    item.Department = 'Junior Developer';
                item.userName = val?.Title

                if (val?.UserGroup?.Title == 'Design Team')
                    item.Department = 'Design';
                item.userName = val?.Title

                if (val?.UserGroup?.Title == 'QA Team')
                    item.Department = 'QA';
                item.userName = val?.Title

            }
        })

    })
    if (AllTimeEntry != undefined) {
        AllTimeEntry?.forEach((time: any) => {
            if (time?.Department == 'Developer' || time?.Department == 'Junior Developer') {
                DevloperTime = DevloperTime + parseFloat(time.Effort)
            }

            if (time?.Department == 'Design') {
                DesignTime = DesignTime + parseFloat(time.Effort)
            }
            if (time?.Department == 'QA') {
                QATime = QATime + parseFloat(time.Effort)
            }

        })
        TotleTaskTime = QATime + DevloperTime + DesignTime
    }
    LeaveUserData?.forEach((items: any) => {
        if (select >= items.Start && select <= items.EndDate) {
            items.TaskDate = startDate
            if (items?.Department == 'Development') {
                DevelopmentMembers++
                DevelopmentleaveHours += items.totaltime
            }

            if (items?.Department == 'Design') {
                DesignMembers++
                DesignMemberleaveHours += items.totaltime
            }

            if (items?.Department == 'QA') {
                QAMembers++
                QAleaveHours += items.totaltime
            }


            AllTimeEntry.push(items)
        }
    })
    var body1: any = []
    var body2: any = []
    var To: any = []
    var MyDate: any = ''
    var ApprovalId: any = []
    var TotlaTime = QATime + DevloperTime + DesignTime
    var TotalleaveHours = DesignMemberleaveHours + DevelopmentleaveHours + QAleaveHours;
    TaskUser?.forEach((items: any) => {
        if (currentLoginUserId == items.AssingedToUserId) {
            items.Approver?.forEach((val: any) => {
                ApprovalId.push(val)
            })

        }

    })
    ApprovalId?.forEach((va: any) => {
        TaskUser?.forEach((ba: any) => {
            if (ba.AssingedToUserId == va.Id) {
                To.push(ba?.Email)
            }
        })

    })

    AllTimeEntry?.forEach((item: any) => {


        if (item.PriorityRank == undefined || item.PriorityRank == '') {
            item.PriorityRank = '';
        }
        if (item.TaskTitle == undefined || item.TaskTitle == '') {
            item.TaskTitle = '';
        }
        if (item.ComponentName == undefined || item.ComponentName == '') {
            item.ComponentName = '';
        }
        if (item.ClientCategorySearch == undefined || item.ClientCategorySearch == '') {
            item.ClientCategorySearch = '';
        }
        if (item.PercentComplete == undefined || item.PercentComplete == '') {
            item.PercentComplete = '';
        }
        if (item.Status == undefined || item.Status == null) {
            item.Status = '';
        }
        if (item.Status == undefined || item.Status == null) {
            item.Status = '';
        }

        if (item.Department == undefined || item.Department == '') {
            item.Department = ''
        }
        var text = '<tr>' +
            '<td width="7%" style="border: 1px solid #aeabab;padding: 4px">' + item?.TaskDate + '</td>'
            + '<td width="7%" style="border: 1px solid #aeabab;padding: 4px">' + item.siteType + '</td>'
            + '<td width="10%" style="border: 1px solid #aeabab;padding: 4px">' + item?.ComponentName + '</td>'
            + '<td style="border: 1px solid #aeabab;padding: 4px">' + `<a href='https://hhhhteams.sharepoint.com/sites/HHHH/sp/SitePages/Task-Profile.aspx?taskId=${item.Id}&Site=${item.siteType}'>` + '<span style="font-size:11px; font-weight:600">' + item.TaskTitle + '</span>' + '</a >' + '</td>'
            + '<td align="left" style="border: 1px solid #aeabab;padding: 4px">' + item?.Description + '</td>'
            + '<td style="border: 1px solid #aeabab;padding: 4px">' + item?.PriorityRank + '</td>'
            + '<td style="border: 1px solid #aeabab;padding: 4px">' + item?.Effort + '</td>'
            + '<td style="border: 1px solid #aeabab;padding: 4px">' + item?.PercentComplete + '%' + '</td>'
            + '<td width="7%" style="border: 1px solid #aeabab;padding: 4px">' + item?.Status + '</td>'
            + '<td width="10%" style="border: 1px solid #aeabab;padding: 4px">' + item?.userName + '</td>'
            + '<td style="border: 1px solid #aeabab;padding: 4px">' + item?.Department + '</td>'
            + '<td style="border: 1px solid #aeabab;padding: 4px">' + item?.ClientCategorySearch + '</td>'
            + '</tr>'
        body1.push(text);
    })
    var text2 =
        '<tr>'
        + '<td style="border: 1px solid #aeabab;padding: 5px;width: 50%;" bgcolor="#f5f5f5">' + '<strong>' + 'Team' + '</strong>' + '</td>'
        + '<td style="border: 1px solid #aeabab;padding: 4px">' + '<strong>' + 'Total Employees' + '</strong>' + '</td>'
        + '<td style="border: 1px solid #aeabab;padding: 4px">' + '<strong>' + 'Employees on leave' + '</strong>' + '</td>'
        + '<td style="border: 1px solid #aeabab;padding: 4px">' + '<strong>' + 'Hours' + '</strong>' + '</td>'
        + '<td style="border: 1px solid #aeabab;padding: 4px">' + '<strong>' + 'Leave Hours' + '</strong>' + '</td>'
        + '</tr>'
        + '<tr>'
        + '<td style="border: 1px solid #aeabab;padding: 5px;width: 50%;" bgcolor="#f5f5f5">' + 'Design' + '</td>'
        + '<td style="border: 1px solid #aeabab;padding: 4px">' + DesignCount + '</td>'
        + '<td style="border: 1px solid #aeabab;padding: 4px">' + DesignMembers + '</td>'
        + '<td style="border: 1px solid #aeabab;padding: 4px">' + DesignTime.toFixed(2) + '</td>'
        + '<td style="border: 1px solid #aeabab;padding: 4px">' + DesignMemberleaveHours + '</td>'
        + '</tr>'
        + '<tr>'
        + '<td style="border: 1px solid #aeabab;padding: 5px;width: 50%;" bgcolor="#f5f5f5">' + 'Development' + '</td>'
        + '<td style="border: 1px solid #aeabab;padding: 4px">' + DevCount + '</td>'
        + '<td style="border: 1px solid #aeabab;padding: 4px">' + DevelopmentMembers + '</td>'
        + '<td style="border: 1px solid #aeabab;padding: 4px">' + DevloperTime.toFixed(2) + '</td>'
        + '<td style="border: 1px solid #aeabab;padding: 4px">' + DevelopmentleaveHours + '</td>'
        + '</tr>'
        + '<tr>'
        + '<td style="border: 1px solid #aeabab;padding: 5px;width: 50%;" bgcolor="#f5f5f5">' + 'QA' + '</td>'
        + '<td style="border: 1px solid #aeabab;padding: 4px">' + QACount + '</td>'
        + '<td style="border: 1px solid #aeabab;padding: 4px">' + QAMembers + '</td>'
        + '<td style="border: 1px solid #aeabab;padding: 4px">' + QATime.toFixed(2) + '</td>'
        + '<td style="border: 1px solid #aeabab;padding: 4px">' + QAleaveHours + '</td>'
        + '</tr>'
        + '<tr>'
        + '<td style="border: 1px solid #aeabab;padding: 5px;width: 50%;" bgcolor="#f5f5f5">' + '<strong>' + 'Total' + '</strong>' + '</td>'
        + '<td style="border: 1px solid #aeabab;padding: 4px">' + '<strong>' + (DesignCount + DevCount + QACount).toFixed(2) + '</strong>' + '</td>'
        + '<td style="border: 1px solid #aeabab;padding: 4px">' + '<strong>' + (DesignMembers + DevelopmentMembers + QAMembers).toFixed(2) + '</strong>' + '</td>'
        + '<td style="border: 1px solid #aeabab;padding: 4px">' + '<strong>' + TotlaTime.toFixed(2) + '</strong>' + '</td>'
        + '<td style="border: 1px solid #aeabab;padding: 4px">' + '<strong>' + TotalleaveHours + '</strong>' + '</td>'
        + '</tr>';
    body2.push(text2);



    var bodyA =
        '<table cellspacing="0" cellpadding="1" width="30%" style="margin: 0 auto;border-collapse: collapse;">'
        + '<tbody align="center">' +
        body2 +
        '</tbody>' +
        '</table>'
    var pageurl = "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/UserTimeEntry.aspx";
    var ReportDatetime: any;
    if (DateType == 'Yesterday' || DateType == 'Today') {
        ReportDatetime = startDate;
    }
    else {
        ReportDatetime = `${startDate} - ${endDate}`
    }

    var body: any =
        '<p style="text-align: center;margin-bottom: 1px;">' + 'TimeSheet of  date' + '&nbsp;' + '<strong>' + ReportDatetime + '</strong>' + '</p>' +
        '<p style="text-align: center;margin: 0 auto;">' + '<a  href=' + pageurl + ' >' + 'Online version of timesheet' + '</a >' + '</p>' +
        '<br>'

        + '</br>' +
        bodyA +
        '<br>' + '</br>'
        + '<table cellspacing="0" cellpadding="1" width="100%" style="border-collapse: collapse;">' +
        '<thead>' +
        '<tr style="font-size: 11px;">' +
        '<th  style="border: 1px solid #aeabab;padding: 5px;" width = "7%" bgcolor="#f5f5f5">' + 'Date' + '</th>'
        + '<th style="border: 1px solid #aeabab;padding: 5px;" width = "7%" bgcolor="#f5f5f5">' + 'Sites' + '</th>'
        + '<th style="border: 1px solid #aeabab;padding: 5px;" width = "8%" bgcolor="#f5f5f5">' + 'Component' + '</th>'
        + '<th style="border: 1px solid #aeabab;padding: 5px;" bgcolor="#f5f5f5">' + 'Task' + '</th>'
        + '<th style="border: 1px solid #aeabab;padding: 5px;" bgcolor="#f5f5f5">' + 'FullDescription' + '</th>'
        + '<th style="border: 1px solid #aeabab;padding: 5px;" bgcolor="#f5f5f5">' + 'Priority' + '</th>'
        + '<th style="border: 1px solid #aeabab;padding: 5px;" bgcolor="#f5f5f5">' + 'Effort' + '</th>'
        + '<th style="border: 1px solid #aeabab;padding: 5px;" bgcolor="#f5f5f5">' + 'Complete' + '</th>'
        + '<th style="border: 1px solid #aeabab;padding: 5px;" width = "7%" bgcolor="#f5f5f5">' + 'Status' + '</th>'
        + '<th style="border: 1px solid #aeabab;padding: 5px;" width = "8%" bgcolor="#f5f5f5">' + 'TimeEntryUser' + '</th>'
        + '<th style="border: 1px solid #aeabab;padding: 5px;" bgcolor="#f5f5f5">' + 'Designation' + '</th>'
        + '<th style="border: 1px solid #aeabab;padding: 5px;" bgcolor="#f5f5f5">' + 'ClientCategory' + '</th>'
        + '</thead>' +
        '<tbody align="center">' +
        '<tr>' +
        body1 +
        '</tr>' +
        '</tbody>' +
        '</table>' +
        '<p>' + '<strong>' + 'Thank You' + '</strong>' + '</p>'
    var cc: any = []
    var ReplyTo: any = ""
    var from: any = undefined
    var subject = 'TimeSheet :' + ' ' + ReportDatetime;
    body = body.replaceAll(',', '');
    sendEmailToUser(from, To, body, subject, ReplyTo, cc, Context);
    alert('Email sent sucessfully');

}

const sendEmailToUser = (from: any, to: any, body: any, subject: any, ReplyTo: any, cc: any, Context: any) => {
    let sp = spfi().using(spSPFx(Context));
    sp.utility.sendEmail({
        Body: body,
        Subject: subject,
        To: to,
        CC: cc,
        AdditionalHeaders: {
            "content-type": "text/html"
        },
    }).then(() => {
        console.log("Email Sent!");

    }).catch((err) => {
        console.log(err.message);
    });
}
const GetleaveUser = async (TaskUser: any, Context: any) => {
    var myData: any = []
    let finalData: any = []
    var leaveData: any = []
    var leaveUser: any = []
    let todayLeaveUsers: any = []
    let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");

    myData = await web.lists
        .getById('72ABA576-5272-4E30-B332-25D7E594AAA4')
        .items
        .select("RecurrenceData,Duration,Author/Title,Editor/Title,Category,HalfDay,Description,ID,EndDate,EventDate,Location,Title,fAllDayEvent,EventType,UID,fRecurrence,Event_x002d_Type,Employee/Id")
        .top(499)
        .expand("Author,Editor,Employee")
        .getAll()
    console.log(myData);

    myData?.forEach((val: any) => {
        val.EndDate = new Date(val?.EndDate);
        val?.EndDate.setHours(val?.EndDate.getHours() - 9);
        var itemDate = moment(val.EventDate)
        val.endDate = moment(val?.EndDate).format("DD/MM/YYYY")
        var eventDate = moment(val.EventDate).format("DD/MM/YYYY")
        const date = val.EndDate
        var NewEndDate = val.endDate.split("/")
        var NewEventDate = eventDate.split("/")
        val.End = NewEndDate[2] + NewEndDate[1] + NewEndDate[0]
        val.start = NewEventDate[2] + NewEventDate[1] + NewEventDate[0]
        leaveData.push(val)

    })
    console.log(leaveData)
    leaveData?.forEach((val: any) => {
        if (val?.fAllDayEvent == true) {
            val.totaltime = 8
        }
        else {
            val.totaltime = 8
        }
        if (val?.HalfDay == true) {
            val.totaltime = 4
        }
        var users: any = {}
        TaskUser?.forEach((item: any) => {
            if (item?.AssingedToUserId != null && val?.Employee?.Id == item?.AssingedToUserId && item.UserGroup?.Title != 'Ex Staff') {
                users['userName'] = item.Title
                users['ComponentName'] = ''
                users['Department'] = item.TimeCategory
                users['Effort'] = val.totaltime !== undefined && val.totaltime <= 4 ? val.totaltime : 8
                users['Description'] = 'Leave'
                users['ClientCategoryy'] = 'Leave'
                users['siteType'] = ''
                users['Status'] = ''
                users['EndDate'] = val.End
                users['Start'] = val.start
                users['totaltime'] = val.totaltime
                todayLeaveUsers.push(users)
            }
        })
    })
    finalData = todayLeaveUsers.filter((val: any, TaskId: any, array: any) => {
        return array.indexOf(val) == TaskId;
    })
    console.log(finalData)
    return finalData
}
export const findTaskCategoryParent = (taskCategories: any, result: any) => {
    if (taskCategories?.length > 0 && result.TaskCategories?.length > 0) {
        let newTaskCat = taskCategories?.filter((val: any) => result?.TaskCategories?.some((elem: any) => val.Id === elem.Id));
        newTaskCat.map((elemVal: any) => {
            if (result[elemVal?.Parent?.Title]) {
                result[elemVal?.Parent?.Title] += ` ${elemVal?.Title}`
            } else {
                result[elemVal?.Parent?.Title] = elemVal?.Title;
            }
        })
    }
    return result;
}