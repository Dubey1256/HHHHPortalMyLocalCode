
import axios, { AxiosResponse } from 'axios';
import * as React from 'react';
// import '../components/TagTaskToProjectPopup.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FaAngleDown, FaAngleUp, FaPrint, FaFileExcel, FaPaintBrush, FaEdit, FaSearch } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { Web } from "sp-pnp-js";
import * as moment from 'moment';
import * as globalCommon from "../../../globalComponents/globalCommon"
var AllUser: any = []
var siteConfig: any = []
var DataSiteIcon: any = []

const TagTaskToProjectPopup = (props: any) => {

    const [lgShow, setLgShow] = useState(false);
    const handleClose = () => {

        setLgShow(false);

        clearSearch()

    }
    const [AllTasks, setAllTasks] = React.useState([])
    const [SearchedAllTasks, setSearchedAllTasks] = React.useState([])
    const [selectAll, setselectAll] = React.useState(false)

    const [countSelected, setCountSelected] = React.useState(0)


    const TaskUser = async () => {
        let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
        let taskUser = [];
        taskUser = await web.lists
            .getById('b318ba84-e21d-4876-8851-88b94b9dc300')
            .items
            .select("Id,UserGroupId,Suffix,Title,Email,SortOrder,Role,IsShowTeamLeader,Company,ParentID1,Status,Item_x0020_Cover,AssingedToUserId,isDeleted,AssingedToUser/Title,AssingedToUser/Id,AssingedToUser/EMail,ItemType,Approver/Id,Approver/Title,Approver/Name")
            .expand("AssingedToUser,Approver")
            .get();
        AllUser = taskUser;
    }
    const GetMetaData = async () => {
        let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
        let smartmeta = [];

        let TaxonomyItems = [];
        smartmeta = await web.lists
            .getById('01a34938-8c7e-4ea6-a003-cee649e8c67a')
            .items
            .select('Id', 'IsVisible', 'ParentID', 'Title', 'SmartSuggestions', 'TaxType', 'Description1', 'Item_x005F_x0020_Cover', 'listId', 'siteName', 'siteUrl', 'SortOrder', 'SmartFilters', 'Selectable', 'Parent/Id', 'Parent/Title')
            .top(5000)
            .filter("TaxType eq 'Sites'")
            .expand('Parent')
            .get();
        siteConfig = smartmeta;
        LoadAllSiteTasks();
    }
    // const getSharewebId = (item: any) => {
    //     var Shareweb_x0020_ID = undefined;
    //     if (item != undefined && item.SharewebTaskType != undefined && item.SharewebTaskType.Title == undefined) {
    //         Shareweb_x0020_ID = 'T' + item.Id;
    //     }
    //     else if (item.SharewebTaskType != undefined && (item.SharewebTaskType.Title === 'Task' || item.SharewebTaskType.Title === 'MileStone') && item.SharewebTaskLevel1No === undefined && item.SharewebTaskLevel2No === undefined) {
    //         Shareweb_x0020_ID = 'T' + item.Id;
    //         if (item.SharewebTaskType.Title === 'MileStone')
    //             Shareweb_x0020_ID = 'M' + item.Id;
    //     }
    //     else if (item.SharewebTaskType != undefined && (item.SharewebTaskType.Title === 'Activities' || item.SharewebTaskType.Title === 'Project') && item.SharewebTaskLevel1No != undefined) {
    //         if (item.Component != undefined) {
    //             if (item.Component.results != undefined && item.Component.results.length > 0) {
    //                 Shareweb_x0020_ID = 'CA' + item.SharewebTaskLevel1No;
    //             }
    //         }
    //         if (item.Services != undefined) {
    //             if (item.Services.results != undefined && item.Services.results.length > 0) {
    //                 Shareweb_x0020_ID = 'SA' + item.SharewebTaskLevel1No;
    //             }
    //         }
    //         if (item.Events != undefined) {
    //             if (item.Events.results != undefined && item.Events.results.length > 0) {
    //                 Shareweb_x0020_ID = 'EA' + item.SharewebTaskLevel1No;
    //             }
    //         }
    //         if (item.Component != undefined && item.Events != undefined && item.Services != undefined)
    //             if (!item.Events.results != undefined && !item.Services.results != undefined && !item.Component.results != undefined) {
    //                 Shareweb_x0020_ID = 'A' + item.SharewebTaskLevel1No;
    //             }
    //         if (item.Component === undefined && item.Events === undefined && item.Services === undefined) {
    //             Shareweb_x0020_ID = 'A' + item.SharewebTaskLevel1No;
    //         }
    //         if (item.SharewebTaskType.Title === 'Project')
    //             Shareweb_x0020_ID = 'P' + item.SharewebTaskLevel1No;

    //     }
    //     else if (item.SharewebTaskType != undefined && (item.SharewebTaskType.Title === 'Workstream' || item.SharewebTaskType.Title === 'Step') && item.SharewebTaskLevel1No != undefined && item.SharewebTaskLevel2No != undefined) {
    //         if (item.Component != undefined && item.Services != undefined && item.Events != undefined) {
    //             if (!item.Events.results != undefined && !item.Services.results != undefined && !item.Component.results != undefined) {
    //                 Shareweb_x0020_ID = 'A' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No;
    //             }
    //         }
    //         if (item.Component != undefined) {
    //             if (item.Component.results != undefined && item.Component.results.length > 0) {
    //                 Shareweb_x0020_ID = 'CA' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No;
    //             }
    //         }
    //         if (item.Services != undefined) {
    //             if (item.Services.results != undefined && item.Services.results.length > 0) {
    //                 Shareweb_x0020_ID = 'SA' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No;
    //             }
    //         }
    //         if (item.Events != undefined) {
    //             if (item.Events.results != undefined && item.Events.results.length > 0) {
    //                 Shareweb_x0020_ID = 'EA' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No;
    //             }
    //         }
    //         if (item.Component === undefined && item.Services === undefined && item.Events === undefined) {
    //             Shareweb_x0020_ID = 'A' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No;
    //         }
    //         if (item.SharewebTaskType.Title === 'Step')
    //             Shareweb_x0020_ID = 'P' + item.SharewebTaskLevel1No + '-S' + item.SharewebTaskLevel2No;

    //     }
    //     else if (item.SharewebTaskType != undefined && (item.SharewebTaskType.Title === 'Task' || item.SharewebTaskType.Title === 'MileStone') && item.SharewebTaskLevel1No != undefined && item.SharewebTaskLevel2No != undefined) {
    //         if (item.Component != undefined && item.Services != undefined && item.Events != undefined) {
    //             if (!item.Events.results != undefined && !item.Services.results != undefined && !item.Component.results != undefined) {
    //                 Shareweb_x0020_ID = 'A' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No + '-T' + item.Id;
    //             }
    //         }
    //         if (item.Component != undefined) {
    //             if (item.Component.results != undefined && item.Component.results.length > 0) {
    //                 Shareweb_x0020_ID = 'CA' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No + '-T' + item.Id;
    //             }
    //         }
    //         if (item.Services != undefined) {
    //             if (item.Services.results != undefined && item.Services.results.length > 0) {
    //                 Shareweb_x0020_ID = 'SA' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No + '-T' + item.Id;
    //             }
    //         }
    //         if (item.Events != undefined) {
    //             if (item.Events.results != undefined && item.Events.results.length > 0) {
    //                 Shareweb_x0020_ID = 'EA' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No + '-T' + item.Id;
    //             }
    //         }
    //         if (item.Component === undefined && item.Services === undefined && item.Events === undefined) {
    //             Shareweb_x0020_ID = 'A' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No + '-T' + item.Id;
    //         }
    //         if (item.SharewebTaskType.Title === 'MileStone') {
    //             Shareweb_x0020_ID = 'P' + item.SharewebTaskLevel1No + '-S' + item.SharewebTaskLevel2No + '-M' + item.Id;
    //         }
    //     }
    //     else if (item.SharewebTaskType != undefined && (item.SharewebTaskType.Title === 'Task' || item.SharewebTaskType.Title === 'MileStone') && item.SharewebTaskLevel1No != undefined && item.SharewebTaskLevel2No === undefined) {
    //         if (item.Component != undefined && item.Services != undefined && item.Events != undefined) {
    //             if (!item.Events.results != undefined && !item.Services.results != undefined && !item.Component.results != undefined) {
    //                 Shareweb_x0020_ID = 'A' + item.SharewebTaskLevel1No + '-T' + item.Id;
    //             }
    //         }
    //         if (item.Component != undefined) {
    //             if (item.Component.results != undefined && item.Component.results.length > 0) {
    //                 Shareweb_x0020_ID = 'CA' + item.SharewebTaskLevel1No + '-T' + item.Id;
    //             }
    //         }
    //         if (item.Services != undefined) {
    //             if (item.Services.results != undefined && item.Services.results.length > 0) {
    //                 Shareweb_x0020_ID = 'SA' + item.SharewebTaskLevel1No + '-T' + item.Id;
    //             }
    //         }
    //         if (item.Events != undefined) {
    //             if (item.Events.results != undefined && item.Events.results.length > 0) {
    //                 Shareweb_x0020_ID = 'EA' + item.SharewebTaskLevel1No + '-T' + item.Id;
    //             }
    //         }
    //         if (item.Component === undefined && item.Services === undefined && item.Events === undefined) {
    //             Shareweb_x0020_ID = 'A' + item.SharewebTaskLevel1No + '-T' + item.Id;
    //         }
    //         if (item.SharewebTaskType.Title === 'MileStone') {
    //             Shareweb_x0020_ID = 'P' + item.SharewebTaskLevel1No + '-M' + item.Id;
    //         }

    //     } else {
    //         if (item?.Id != undefined) {
    //             Shareweb_x0020_ID = 'T' + item?.Id
    //         }
    //     }
    //     return Shareweb_x0020_ID;
    // }
    const loadAdminConfigurations = function () {

        var CurrentSiteType = ''

        axios.get("https://hhhhteams.sharepoint.com/sites/HHHH/sp/_api/web/lists/getbyid('e968902a-3021-4af2-a30a-174ea95cf8fa')/items?$select=Id,Title,Value,Key,Description,DisplayTitle,Configurations&$filter=Key eq 'TaskDashboardConfiguration'")
            .then((response: AxiosResponse) => {
                var SmartFavoritesConfig = [];
                $.each(response.data.value, function (index: any, smart: any) {
                    if (smart.Configurations != undefined) {
                        DataSiteIcon = JSON.parse(smart.Configurations);
                    }
                });

            },
                function (error) {

                });
    }
    const LoadAllSiteTasks = function () {
        loadAdminConfigurations();
        var AllTask: any = []
        var query = "&$filter=Status ne 'Completed'&$orderby=Created desc&$top=4999";
        var Counter = 0;
        let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
        var arraycount = 0;
        siteConfig.map(async (config: any) => {
            if (config.Title != 'SDC Sites' && config.Title != 'Master Tasks') {

                let smartmeta = [];
                let TaxonomyItems = [];
                smartmeta = await web.lists
                    .getById(config.listId)
                    .items
                    .select("Id,StartDate,DueDate,Title,Created,PercentComplete,Priority_x0020_Rank,Priority,ClientCategory/Id,SharewebTaskType/Id,SharewebTaskType/Title,ComponentId,ServicesId,ClientCategory/Title,Project/Id,Project/Title,Author/Id,Author/Title,Editor/Id,Editor/Title,AssignedTo/Id,AssignedTo/Title,Team_x0020_Members/Id,Team_x0020_Members/Title,Responsible_x0020_Team/Id,Responsible_x0020_Team/Title,Component/Id,component_x0020_link,Component/Title,Services/Id,Services/Title")
                    .top(4999)
                    // .filter("Project/Id ne " + props.projectId)
                    .expand("Project,AssignedTo,Author,Editor,Team_x0020_Members,Responsible_x0020_Team,ClientCategory,Component,Services,SharewebTaskType")
                    .get();
                arraycount++;
                smartmeta.map((items: any) => {
                    items.AllTeamMember = []
                    items.siteType = config.Title;
                    if (items?.Project?.Id == props?.projectId) {
                        items.selected = true;
                    } else {
                        items.selected = false;
                    }
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
                        if(config.Title=="DRR"||config.Title=="Gender"||config.Title=="KathaBeck"){
                            items['siteIcon'] = config.Item_x005F_x0020_Cover.Url
                        }else{
                            DataSiteIcon.map((site: any) => {
                                if (site.Site == items.siteType) {
                                    items['siteIcon'] = site.SiteIcon
                                }
                            })
                        }
                       
                    }
                    items.CreatedDis=items?.Created != null ? moment(items.Created).format('DD/MM/YYYY') : ""
                    items.componentString = items.Component != undefined && items.Component != undefined && items.Component.length > 0 ? getComponentasString(items.Component) : '';
                    items.Shareweb_x0020_ID = globalCommon.getTaskId(items);
                    if (items.Team_x0020_Members != undefined) {
                        items.Team_x0020_Members.map((taskUser: any) => {
                            var newuserdata: any = {};

                            AllUser.map((user: any) => {
                                if (user.AssingedToUserId == taskUser.Id) {

                                    newuserdata['useimageurl'] = user.Item_x0020_Cover.Url;
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

                if (arraycount === 17) {
                    setAllTasks(AllTask)

                    // setmaidataBackup(AllTask)
                    // showProgressHide();
                }

            } else {
                arraycount++
            }
        })
        console.log(AllTasks)
    }
    const getComponentasString = function (results: any) {
        var component = '';
        $.each(results, function (cmp: any) {
            component += cmp.Title + '; ';
        })
        return component;
    }
    useEffect(() => {
        TaskUser();
        GetMetaData();
    }, [props.projectId]);
    const OpenTaskPopupData = () => {
        TaskUser();
        GetMetaData();
        setLgShow(true)
    }
    const selectAllFiltered = (selected: any) => {
        setselectAll(!selectAll)
        // let selectAllArray=[];
        // selectAllArray=SearchedAllTasks;
        SearchedAllTasks.map((item: any) => {
            item.selected = !selectAll
        })
    }
    const [searchText, setSearchText] = useState("");
    const onSearchText = (e: any) => {
        setSearchText(e.target.value);

    };
    const clearSearch = () => {
        setSearchText('');
        setSearchedAllTasks([])
        setselectAll(false)
    }
    const searchTaskToTag = () => {
        let SearchedTasks: any[];
        if (searchText) {
            SearchedTasks = AllTasks.filter((task: any) => {
                if (
                    task?.Title?.toLowerCase().includes(searchText.toLowerCase()) || task?.Shareweb_x0020_ID?.toLowerCase().includes(searchText.toLowerCase())
                    || task.Priority.toLowerCase().includes(searchText.toLowerCase()) || task.PercentComplete.toLowerCase().includes(searchText.toLowerCase()) ||
                    task.Author.Title.toLowerCase().includes(searchText.toLowerCase())||task.siteType.toLowerCase().includes(searchText.toLowerCase())||task.CreatedDis.toLowerCase().includes(searchText.toLowerCase())
                ) {
                    return true;
                }
                return false;
            });
            setSearchedAllTasks(SearchedTasks)
        }
    }
    const tagSelectedTasks = () => {
        let selectedTaskId = ''
        SearchedAllTasks?.map(async (item: any, index: any) => {
            if (item.selected == true) {
                if (index == 0) {
                    selectedTaskId = selectedTaskId + '(' + item?.siteType + ') ' + item?.Shareweb_x0020_ID
                } else {
                    selectedTaskId = selectedTaskId + ',' + '(' + item?.siteType + ') ' + item?.Shareweb_x0020_ID
                }
            }
        })

        let confirmation = confirm('Are you sure you want to tag ' + selectedTaskId + ' to this project ?')
        if (confirmation == true) {
            SearchedAllTasks?.map(async (item: any) => {
                if (item.selected == true) {
                    const web = new Web(item?.siteUrl);
                    await web.lists.getById(item?.listId).items.getById(item?.Id).update({
                        ProjectId: props?.projectId != undefined ? props?.projectId : ''
                    }).then((e: any) => {
                        props.callBack();
                    })
                        .catch((err: { message: any; }) => {
                            console.log(err.message);
                        });
                }
            })
            handleClose()
        }

    }

    const handleKeyDown = (event: any) => {
        if (event.key === 'Enter') {
            searchTaskToTag();
        }
    }
    const selectRow = (item: any, ind: any) => {
        let selectedItems = 0;
        SearchedAllTasks.map((item: any, index) => {
            if (ind == index) {
                item.selected = !item.selected
            }
            if (item?.selected == true) {
                selectedItems++;
            }
        })
        setCountSelected(selectedItems);
        if (selectedItems == SearchedAllTasks.length && selectedItems > 0) {
            setselectAll(true)
        } else {
            setselectAll(false)
        }

    }
    return (
        <>
            <Button type="button" variant="secondary" className='pull-right me-2' onClick={() => OpenTaskPopupData()}>Tag Tasks</Button>
            <Modal
                size="lg"
                show={lgShow}
                onHide={() => setLgShow(false)}
                aria-labelledby="example-modal-sizes-title-lg">
                <Modal.Header>
                    <span className='modal-title' id="example-modal-sizes-title-lg">
                        <span><strong>Tag Tasks - {props.projectTitle}</strong></span>
                    </span>
                    <button type="button" className="btn-close" aria-label="Close" onClick={handleClose}></button>
                </Modal.Header>
                <Modal.Body>
                    {
                        AllTasks?.length > 0 ? <div className=''>
                            <div className='col'>
                                <div className='Alltable'>
                                    <div className="tbl-headings">
                                        <span className="leftsec">
                                            <span className="g-search">
                                                <input className="searchbox_height full_width" type="text" value={searchText} onKeyDown={handleKeyDown} onChange={onSearchText} placeholder="Search" aria-label="Search" />
                                                    {searchText?.length > 0 ? <span className='g-searchclear' onClick={clearSearch} >×</span> : ''}
                                                    <span className="gsearch-btn" onClick={() => { searchTaskToTag() }}><i><FaSearch /></i></span>
                                            </span>
                                        </span>
                                    </div>
                                
                                    {SearchedAllTasks?.length > 0 ? <div className="col-sm-12 p-0 smart">
                                            <div className="section-event" style={{paddingTop : "35px"}}>
                                                <div className='Scrolling'>
                                                    <table className="table table-hover">
                                                        <thead>
                                                            <tr>
                                                                <th style={{ width: "2%" }}><div className='smart-relative'><input type="checkbox" id="isActive" checked={selectAll} defaultChecked={selectAll} onChange={() => selectAllFiltered(selectAll)} /></div></th>
                                                                <th style={{ width: "5%" }}><div className='smart-relative'>Site</div></th>
                                                                <th style={{ width: "10%" }}><div className='smart-relative'>Task Id</div></th>
                                                                <th style={{ width: "33%" }}><div className='smart-relative'> Task Title</div></th>
                                                                <th style={{ width: "18%" }}><div className='smart-relative'>Portfolio Type</div></th>
                                                                <th style={{ width: "10%" }}><div className='smart-relative'> % Complete</div></th>
                                                                <th style={{ width: "10%" }}><div className='smart-relative'>Priority</div></th>
                                                                <th style={{ width: "12%" }}><div className='smart-relative'>Created</div></th>
                                                                {/* <th>Edit</th> */}
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                                {
                                                                    SearchedAllTasks.map((item: any, index: any) => {
                                                                        return (
                                                                            <>
                                                                            <tr >
                                                                                <td className="p-0" colSpan={8}>
                                                                                    <table className="table table-hover m-0" style={{ width: "100%" }}>
                                                                                        <tr className="" key={index}>
                                                                                            <td style={{ width: "2%" }}><input type="checkbox" id="isActive" onClick={() => { selectRow(item, index) }} checked={item?.selected} /></td>
                                                                                            <td style={{ width: "5%" }}>
                                                                                                <img className="icon-sites-img"
                                                                                                title={item?.siteType} src={item?.siteIcon} />
                                                                                            </td >
                                                                                            <td style={{ width: "10%" }}>{item?.Shareweb_x0020_ID}</td>
                                                                                            <td style={{ width: "33%" }}>
                                                                                            <span><a data-interception="off" target="blank" href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Task-Profile-spfx.aspx?taskId=${item.Id}&Site=${item.siteType}`}>{item.Title}</a></span>
                                                                                            </td>
                                                                                            <td style={{ width: "18%" }}>
                                                                                                {item.Component != undefined &&
                                                                                                    <>
                                                                                                        {item.Component.map((types: any) => {
                                                                                                            return (
                                                                                                                <>
                                                                                                                    <span><a data-interception="off" target='blank' href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=${types.Id}`}>{types.Title}</a></span>
                                                                                                                </>
                                                                                                            )
                                                                                                        })}
                                                                                                    </>
                                                                                                }
                                                                                                {item.Component == undefined &&
                                                                                                    <>
                                                                                                        {item.Services.map((types: any) => {
                                                                                                            return (
                                                                                                                <>
                                                                                                                    <span><a data-interception="off" target='blank' href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=${types.Id}`}>{types.Title}</a></span>
                                                                                                                </>
                                                                                                            )
                                                                                                        })}
                                                                                                    </>
                                                                                                }
                                                                                            </td>
                                                                                            <td style={{ width: "10%" }}><span className="ml-2">{item.PercentComplete}</span></td>
                                                                                            <td style={{ width: "10%" }}>{item.Priority}</td>
                                                                                            <td style={{ width: "12%" }}>{item.CreatedDis}
                                                                                                {
                                                                                                    AllUser.map((user: any) => {
                                                                                                        if (user.AssingedToUserId == item.Author.Id) {
                                                                                                            return (
                                                                                                                <img className="AssignUserPhoto1" title={user.Title} src={user.Item_x0020_Cover.Url} alt={user.Title} />
                                                                                                            )

                                                                                                        }
                                                                                                    }) 
                                                                                                }
                                                                                            </td>
                                                                                        </tr>
                                                                                    </table>
                                                                                </td>
                                                                            </tr>
                                                                            </>
                                                                        )
                                                                    })
                                                                }
                                                            </tbody>
                                                            
                                                    </table>
                                                </div>
                                            </div>
                                    </div> : ''}
                                </div>
                            </div>
                        </div> : 'Loading ...'
                    }
                </Modal.Body>
                <div className="modal-footer">
                    <Button type="button" variant="btn btn-primary" onClick={() => tagSelectedTasks()}>Tag</Button>
                    <Button type="button" className="btn btn-grey" variant="secondary" onClick={handleClose}>Cancel</Button>
                </div>
            </Modal>


        </>
    )
}
export default TagTaskToProjectPopup