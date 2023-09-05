
import moment from 'moment';
import { useEffect, useState } from 'react'
import React from 'react';
import { Web } from "sp-pnp-js"
import GlobalTable from "./GlobalTable";
import { ColumnDef } from '@tanstack/react-table';
import styles from './MydraftTask.module.scss';
import getTaskItem, { IndeterminateCheckbox } from "./GlobalTable";
import MydraftTask from './MydraftTask';


export default function GetDraft(search: any) {
    const [userName, userNameChange] = useState(' ')
    const [AllSitesTaskDisplay, setAllSitesTask] = useState<any>([]);
    const [checkData, setCheckData] = React.useState<any>([])
    var userIds = search.search.context.pageContext._legacyPageContext.userId;
    var baseUrl = search.search.context.pageContext.web.absoluteUrl;
    let TaskUserDisplay: any;
    let metaDataurl: any;
    var storeAllMetaData: any;
    let disabled: boolean;
    let filter: any;
    let web = new Web(baseUrl);
    //----------- function to get all user detail---------
    const LoadUsers = () => {
        let web = new Web(baseUrl)
        web.lists.getById(search.search.userlistId).items.select('Id,UserGroupId,Suffix,Title,Email,SortOrder,Role,Company,ParentID1,Status,Item_x0020_Cover,AssingedToUserId,isDeleted,AssingedToUser/Title,AssingedToUser/Id,AssingedToUser/EMail,ItemType').
            expand('AssingedToUser').getAll().then((response: any) => {
                var userAssingedTo: any = [];
                response.forEach((user: any) => {
                    if (userIds == user.AssingedToUser) {
                        userNameChange(user.Title)
                    }
                    if (user.AssingedToUserId != null) {
                        userAssingedTo.push(user)
                    }
                }
                )
                TaskUserDisplay = userAssingedTo;
            })
    }
    // ----------load all metaData item-----------
    const LoadAllMetaDataAndTasks = () => {
        metaDataurl = web.lists.getById(search.search.smartMetadata).items.getAll().then((response: any) => {
            storeAllMetaData = response;
            AllSitesInfo();
        })
    }
    const AllSitesInfo = function () {
        var taskArray: any[] = [];
        var taskInformation: any = [];
        var count: any = [];
        var sitesLength = 0;
        var Sites: any[] = [];
        var Image: any;
        var filters = "(Author/Id eq '" + userIds + "')";
        storeAllMetaData.forEach((AllMetaData: any) => {
            if (AllMetaData.TaxType == 'Sites' && AllMetaData.listId != undefined && AllMetaData.Title != 'Master Task') {
                Sites.push(AllMetaData)
                sitesLength++;
                web.lists.getById(AllMetaData.listId).items.filter(filters).select('Id,Title,TaskID,TaskType/Id,TaskType/Title,Services/Id,PriorityRank,PercentComplete,ComponentId,ServicesId,EventsId,PriorityRank,DueDate,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title,TaskCategories/Id,TaskCategories/Title,AssignedTo/Id,AssignedTo/Title,TeamMembers/Id,TeamMembers/Title').expand('AssignedTo,Author,Editor,TeamMembers,TaskCategories,TaskType,Services').getAll()
                    .then((response1: any) => {
                        count++;
                        if (response1.length > 0 && response1 != undefined) {
                            response1.siteType = AllMetaData.Title;
                            response1.listId = AllMetaData.listId;
                            Image = JSON.parse(AllMetaData.Configurations)
                            response1.ImageUrls = Image[0].ImageUrl;
                        }
                        taskInformation.push(response1)
                        if (sitesLength === count) {
                            loadAllSitesTask(taskInformation)
                        }
                    })
            }

        })
    }
    //-------Load all Task --------
    const loadAllSitesTask = function (success: any) {
        var TempArray: any = [];
        var taskInformation = success;
        taskInformation.forEach((items: any) => {
            if (items.length > 0 && items != undefined) {
                items.forEach((item: any) => {
                    item.listId = items.listId
                    item.siteType = items.siteType
                    item.ImageUrls = items.ImageUrls
                    item.CreatedBynew = item.Author.Title;
                    item.AllCreatedimages = [];
                    item.Allmodifiedimages = [];
                    if (item.TaskCategories != undefined && item.TaskCategories.length > 0) {
                        item.TaskCategories.forEach((value: any) => {
                            if (value.Title.toLowerCase() === 'draft') {
                                if (item.Author.Title != undefined && item.Author.Title.length > 0) {
                                    var newuserdata: any = {};
                                    TaskUserDisplay.forEach((user: any) => {
                                        if (item.Author.Id == user.AssingedToUserId) {
                                            if (user.Item_x0020_Cover == undefined)
                                                user.Item_x0020_Cover = {}
                                            newuserdata['useimageurl'] = user.Item_x0020_Cover.Url;
                                            newuserdata['Suffix'] = user.Suffix;
                                            newuserdata['Title'] = user.Title;
                                            newuserdata['UserId'] = user.AssingedToUserId;
                                            item['Usertitlename'] = user.Title;
                                        }
                                    })
                                    item.AllCreatedimages.push(newuserdata);
                                }
                                if (item.Editor.Title != undefined && item.Editor.Title.length > 0) {
                                    let newusermodified: any = {};
                                    TaskUserDisplay.forEach((modiuser: any) => {
                                        if (item.Editor.Id == modiuser.AssingedToUserId) {
                                            newusermodified['modifiedimageurl'] = modiuser.Item_x0020_Cover.Url;
                                            newusermodified['Suffix'] = modiuser.Suffix;
                                            newusermodified['Title'] = modiuser.Title;
                                            newusermodified['modifiedUserId'] = modiuser.AssingedToUserId;
                                            item['modifiedtitlename'] = modiuser.Title;
                                        }
                                    })
                                    item.Allmodifiedimages.push(newusermodified);
                                    //})
                                }
                                //----------funcin use to know Author data---------
                                item.CreatedBynew = item.Author.Title;
                                item.Editor = item.Editor.Title;
                                item.AuthorName = item.Author.Title;
                                if (item.Author != undefined) {
                                    TaskUserDisplay.forEach((newuser: any) => {
                                        if (item.AuthorName == newuser.AssingedToUser.Title) {
                                            if (newuser.Item_x0020_Cover != undefined)
                                                item['autherimage'] = newuser.Item_x0020_Cover.Url;
                                            item['autheruserId'] = newuser.AssingedToUserId;
                                            item['autherusertitle'] = newuser.Title;
                                        }
                                        if (item.Editor == newuser.AssingedToUser.Title) {
                                            if (newuser.Item_x0020_Cover != undefined)
                                                item['editoreimage'] = newuser.Item_x0020_Cover.Url;
                                            item['userid'] = newuser.AssingedToUserId;
                                            item['usertitle'] = newuser.Title;
                                        }
                                    })
                                }
                                //****************date formate ********
                                item.ServerModifiedDate = '';
                                if (item.Modified != undefined)
                                    item.Modified = moment(item.Modified).format('DD/MM/YYYY');
                                item.ServerModifiedDate = item.Modified;
                                if (item.Created != undefined)
                                    item.CreatedNew = moment(item.Created).format('DD/MM/YYYY');
                                if (item.DueDate != undefined) {
                                    item.TaskDueDate = moment(item.DueDate).format('DD/MM/YYYY');
                                }
                                if (item.PercentComplete != undefined)
                                    item.PercentComplete = parseInt((item.PercentComplete * 100).toFixed(0));
                                else
                                    item.PercentComplete = '';
                                //This function is used for getting Shareweb Id,
                                item.TaskID = getSharewebId(item)
                                //******End*********

                                // *******************Item Categories-*******************
                                var smartCategories: any = []
                                if (item.TaskCategories != undefined) {
                                    item.TaskCategories.forEach((category: any) => {
                                        storeAllMetaData.forEach((taxonomyItem: any) => {
                                            if (taxonomyItem.Id == category.Id && (taxonomyItem.TaxType == "Categories" || taxonomyItem.TaxType == 'Category')) {
                                                var Item: any = {};
                                                Item.Title = taxonomyItem.Title;
                                                Item.Id = category.Id;
                                                Item.ParentID = taxonomyItem.ParentID;
                                                smartCategories.push(Item);
                                            }
                                        })
                                    })
                                }
                                smartCategories.forEach((category: any) => {
                                    item.CategoryItem = item.CategoryItem != undefined ? item.CategoryItem + ';' + category.Title : category.Title;
                                })
                                TempArray.push(item)
                            }
                        })
                    }
                })
            }
        })
        setAllSitesTask(TempArray);
    }
    // ------This function is used for getting ShareFweb Id--------
    const getSharewebId = function (item: any) {
        var TaskID = undefined;
        if (item != undefined && item.TaskType != undefined && item.TaskType.Title == undefined) {
            TaskID = 'T' + item.Id;
        }
        else if (item.TaskType != undefined && (item.TaskType.Title == 'Task' || item.TaskType.Title == 'MileStone') && item.TaskLevel == undefined && item.TaskLevel == undefined) {
            TaskID = 'T' + item.Id;
            if (item.TaskType.Title == 'MileStone')
                TaskID = 'M' + item.Id;
        }
        else if (item.TaskType != undefined && (item.TaskType.Title == 'Activities' || item.TaskType.Title == 'Project') && item.TaskLevel != undefined) {
            if (item.Component != undefined) {
                if (item.Component != undefined && item.Component.length > 0) {
                    TaskID = 'CA' + item.TaskLevel;
                }
            }
            if (item.Services != undefined) {
                if (item.Services != undefined && item.Services.length > 0) {
                    TaskID = 'SA' + item.TaskLevel;
                }
            }
            if (item.Events != undefined) {
                if (item.Events != undefined && item.Events.length > 0) {
                    TaskID = 'EA' + item.TaskLevel;
                }
            }
            if (item.Component != undefined && item.Events != undefined && item.Services != undefined)
                if (item.Events.length! > 0 && item.Services.length! > 0 && item.Component.length! > 0) {
                    TaskID = 'A' + item.TaskLevel;
                }
            if (item.Component == undefined && item.Events == undefined && item.Services == undefined) {
                TaskID = 'A' + item.TaskLevel;
            }
            if (item.TaskType.Title == 'Project')
                TaskID = 'P' + item.TaskLevel;

        }
        else if (item.TaskType != undefined && (item.TaskType.Title == 'Workstream' || item.TaskType.Title == 'Step') && item.TaskLevel != undefined && item.TaskLevel != undefined) {
            if (item.Component != undefined && item.Services != undefined && item.Events != undefined) {
                if (item.Events.length! > 0 && item.Services.length! > 0 && item.Component.length! > 0) {
                    TaskID = 'A' + item.TaskLevel + '-W' + item.TaskLevel;
                }
            }
            if (item.Component != undefined) {
                if (item.Component != undefined && item.Component.length > 0) {
                    TaskID = 'CA' + item.TaskLevel + '-W' + item.TaskLevel;
                }
            }
            if (item.Services != undefined) {
                if (item.Services != undefined && item.Services.length > 0) {
                    TaskID = 'SA' + item.TaskLevel + '-W' + item.TaskLevel;
                }
            }
            if (item.Events != undefined) {
                if (item.Events != undefined && item.Events.length > 0) {
                    TaskID = 'EA' + item.TaskLevel + '-W' + item.TaskLevel;
                }
            }
            if (item.Component == undefined && item.Services == undefined && item.Events == undefined) {
                TaskID = 'A' + item.TaskLevel + '-W' + item.TaskLevel;
            }
            if (item.TaskType.Title == 'Step')
                TaskID = 'P' + item.TaskLevel + '-S' + item.TaskLevel;

        }
        else if (item.TaskType != undefined && (item.TaskType.Title == 'Task' || item.TaskType.Title == 'MileStone') && item.TaskLevel != undefined && item.TaskLevel != undefined) {
            if (item.Component != undefined && item.Services != undefined && item.Events != undefined) {
                if (item.Events.length! > 0 && item.Services.length! > 0 && item.Component.length! > 0) {
                    TaskID = 'A' + item.TaskLevel + '-W' + item.TaskLevel + '-T' + item.Id;
                }
            }
            if (item.Component != undefined) {
                if (item.Component.results != undefined && item.Component.results.length > 0) {
                    TaskID = 'CA' + item.TaskLevel + '-W' + item.TaskLevel + '-T' + item.Id;
                }
            }
            if (item.Services != undefined) {
                if (item.Services.results != undefined && item.Services.length > 0) {
                    TaskID = 'SA' + item.TaskLevel + '-W' + item.TaskLevel + '-T' + item.Id;
                }
            }
            if (item.Events != undefined) {
                if (item.Events != undefined && item.Events.length > 0) {
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
                if (item.Events.length! > 0 && item.Services.length! > 0 && item.Component.length! > 0) {
                    TaskID = 'A' + item.TaskLevel + '-T' + item.Id;
                }
            }
            if (item.Component != undefined) {
                if (item.Component != undefined && item.Component.length > 0) {
                    TaskID = 'CA' + item.TaskLevel + '-T' + item.Id;
                }
            }
            if (item.Services != undefined) {
                if (item.Services != undefined && item.Services.length > 0) {
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
        return TaskID;
    }
    //******** Task Delete **********
    const deleteData = (dlData: any) => {
        var copy: any = [];
        let web = new Web(baseUrl);
        let flag = confirm("Are you sure, you want to delete this?")
        if (flag) {
            web.lists.getById(dlData.listId).items.getById(dlData.Id).recycle().then((response: any) => {
                AllSitesTaskDisplay?.forEach((item: any, index: any) => {
                    if (item?.Id == dlData.Id) {
                        AllSitesTaskDisplay.splice(index, 1)
                    }
                })
                copy = AllSitesTaskDisplay;
                setAllSitesTask([...copy])
            }).catch((error: any) => {
                console.error(error);
            });
        }
    }
    //-----Select Item (checkbox) And Approve task--------  
    var sub: any = [];
    const SaveAndUpdateDraft = function (recviedClicked: any) {
        recviedClicked.forEach((subchild: any) => {
            recviedClicked.updateCategories = '';
            recviedClicked.updatedId = [];
            sub = subchild;
            if (subchild.TaskCategories != undefined && subchild.TaskCategories.length > 0) {
                subchild.TaskCategories.forEach(function (Subchild: any, index: any) {
                    if (Subchild.Title === 'Draft') {
                        subchild.TaskCategories.splice(index, 1);
                        subchild.TaskCategories.forEach(function (restId: any) {
                            recviedClicked.updatedId.push(restId.Id);
                            recviedClicked.updateCategories += restId.Title + ',';
                        })
                    }
                })
            }
        })
        // -------------Update call draft categories--------------
        var postData = {
            "Categories": recviedClicked.updateCategories,
            SharewebCategoriesId: { "results": recviedClicked.updatedId },
        };
        const updateData = (subchild: any, AllMetaData: any) => {
            let web = new Web(baseUrl);
            web.lists.getById(AllMetaData.listId).items.getById(AllMetaData.Id).update(subchild).then((response: any) => {
                LoadAllMetaDataAndTasks()
            }).catch((error: any) => {
                console.error(error);
            });
        }
        disabled = true;
        LoadAllMetaDataAndTasks();
        alert("The Task has approved");
        updateData(postData, sub)
    }

    //----------Select Table All Column--------- 
    const columns = React.useMemo<ColumnDef<any, unknown>[]>(() =>
        [
            {
                header: ({ table }: any) => (
                    <>
                        <IndeterminateCheckbox className="mx-1 "
                            {...{
                                checked: table.getIsAllRowsSelected(),
                                indeterminate: table.getIsSomeRowsSelected(),
                                onChange: table.getToggleAllRowsSelectedHandler(),
                            }}
                        />All{" "}
                    </>
                ),
                cell: ({ row, getValue }) => (
                    <>
                        <IndeterminateCheckbox
                            {...{
                                checked: row.getIsSelected(),
                                indeterminate: row.getIsSomeSelected(),
                                onChange: row.getToggleSelectedHandler(),
                            }}
                        />
                    </>
                ),
                accessorKey: "",
                id: "row?.original.Id",
                canSort: false,
                placeholder: "",
                size: 10,
            },
            {
                cell: ({ row }) => {
                    return (
                        <>
                            <img className={styles.welcomeImage} src={row.original.ImageUrls}></img>
                            {row.original.TaskID}
                        </>
                    );
                },
                accessorKey: "TaskID",
                placeholder: "Task Id",
                header: "",
                size: 70,
            },

            {
                cell: (({ row }) => (
                    <a target='_blank' href={`${baseUrl}/SitePages/Task-Profile.aspx?taskId=${row.original.Id}&Site=${row.original.siteType}`}>
                        {row.original.Title}
                    </a>
                )),
                accessorKey: "Title",
                placeholder: "Title",
                id: "Title",
                header: "",
                size: 90,
            },
            {
                accessorKey: "CategoryItem",
                placeholder: "Category",
                id: "CategoryItem",
                header: "",
                size: 70,
            },
            {
                accessorKey: "PercentComplete",
                placeholder: "%",
                id: "PercentComplete",
                header: "", size: 50,
            },
            {
                accessorKey: "PriorityRank",
                placeholder: "Priority",
                id: "PriorityRank",
                header: "",
                size: 60,
            },
            {
                accessorKey: "ServerModifiedDate",
                placeholder: "Modified Date",
                id: "ServerModifiedDate",
                header: "",
                size: 70,
                cell: ({ row }) => (
                    <>
                        <a target='_blank' href={`${baseUrl}/SitePages/TaskDashboard.aspx?UserId=${row.original.autheruserId}&Name=${row.original.autherusertitle}`}>
                            {row.original.ServerModifiedDate}
                            {row.original.autherimage != undefined ?
                                <img className={styles.welcomeImage} src={`${row.original.autherimage}`} alt="" /> : <img src={`${row.original.undefined}`} />}
                        </a>
                    </>
                )
            },
            {
                accessorKey: "CreatedNew",
                placeholder: "Created Date",
                id: "CreatedNew",
                header: "",
                size: 90,
                cell: ({ row }) => (
                    <>
                        <a target='_blank' href={`${baseUrl}/SitePages/TaskDashboard.aspx?UserId=${row.original.autheruserId}&Name=${row.original.autherusertitle}`}>
                            {row.original.CreatedNew}
                            {row.original.autherimage != undefined ?
                                <img className={styles.welcomeImage} src={`${row.original?.autherimage}`} alt="" /> : <img src={`${row.original.undefined}`} />}
                        </a>
                    </>
                )
            },
            {
                accessorKey: "TaskDueDate",
                placeholder: "Due Date",
                id: "TaskDueDate",
                header: "",
                size: 70,
            },
            //******Edit Icon******
            {
                accessorKey: '',
                canShort: false,
                placeholder: '',
                header: '',
                id: 'row.original',
                size: 40,
                cell: ({ row, getValue }) => (
                    <>
                        <a onClick={() => (row.original)} title="Edit"><img src={`${baseUrl}/_layouts/images/edititem.gif`}></img></a>
                        {getValue}
                    </>
                ),
            },
            //****Delete Icon*************
            {
                accessorKey: '',
                canShort: false,
                placeholder: '',
                header: '',
                id: 'row.original',
                size: 40,
                cell: ({ row, getValue }) => (
                    <>
                        <a onClick={() => deleteData(row.original)} title="Delete"><img src={`${baseUrl}/_layouts/images/delete.gif`}></img></a>
                        {getValue()}

                    </>
                ),
            },
        ], [AllSitesTaskDisplay]);
    useEffect(() => {
        LoadAllMetaDataAndTasks();
        LoadUsers();
    }, []);
    const callBackData = React.useCallback((elem: any, getSelectedRowModel: any, ShowingData: any) => {
        if (elem) {
            setCheckData([elem]);
        } else {
            setCheckData([]);
        }
    }, []);
    return (
        <>
            <div>
                <h1>My Draft Task</h1>
                {AllSitesTaskDisplay && <div>
                    {checkData.length > 0 ? <button type="button" className="btn btn-primary" onClick={() => SaveAndUpdateDraft(checkData)}>Approve</button> :
                        <button type="button" className="btn btn-primary" disabled onClick={() => SaveAndUpdateDraft(checkData)}>Approve</button>}
                    <GlobalTable columns={columns} data={AllSitesTaskDisplay} showHeader={true} callBackData={callBackData} />
                </div>}
            </div>
        </>
    )
}


