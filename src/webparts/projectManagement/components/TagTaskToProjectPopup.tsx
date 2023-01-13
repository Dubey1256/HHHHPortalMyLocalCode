
import axios, { AxiosResponse } from 'axios';
import * as React from 'react';
import '../components/TagTaskToProjectPopup.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useEffect, useState } from 'react';
import { Web } from "sp-pnp-js";
import * as moment from 'moment';
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
    const getSharewebId = (item: any) => {
        var Shareweb_x0020_ID = undefined;
        if (item != undefined && item.SharewebTaskType != undefined && item.SharewebTaskType.Title == undefined) {
            Shareweb_x0020_ID = 'T' + item.Id;
        }
        else if (item.SharewebTaskType != undefined && (item.SharewebTaskType.Title === 'Task' || item.SharewebTaskType.Title === 'MileStone') && item.SharewebTaskLevel1No === undefined && item.SharewebTaskLevel2No === undefined) {
            Shareweb_x0020_ID = 'T' + item.Id;
            if (item.SharewebTaskType.Title === 'MileStone')
                Shareweb_x0020_ID = 'M' + item.Id;
        }
        else if (item.SharewebTaskType != undefined && (item.SharewebTaskType.Title === 'Activities' || item.SharewebTaskType.Title === 'Project') && item.SharewebTaskLevel1No != undefined) {
            if (item.Component != undefined) {
                if (item.Component.results != undefined && item.Component.results.length > 0) {
                    Shareweb_x0020_ID = 'CA' + item.SharewebTaskLevel1No;
                }
            }
            if (item.Services != undefined) {
                if (item.Services.results != undefined && item.Services.results.length > 0) {
                    Shareweb_x0020_ID = 'SA' + item.SharewebTaskLevel1No;
                }
            }
            if (item.Events != undefined) {
                if (item.Events.results != undefined && item.Events.results.length > 0) {
                    Shareweb_x0020_ID = 'EA' + item.SharewebTaskLevel1No;
                }
            }
            if (item.Component != undefined && item.Events != undefined && item.Services != undefined)
                if (!item.Events.results != undefined && !item.Services.results != undefined && !item.Component.results != undefined) {
                    Shareweb_x0020_ID = 'A' + item.SharewebTaskLevel1No;
                }
            if (item.Component === undefined && item.Events === undefined && item.Services === undefined) {
                Shareweb_x0020_ID = 'A' + item.SharewebTaskLevel1No;
            }
            if (item.SharewebTaskType.Title === 'Project')
                Shareweb_x0020_ID = 'P' + item.SharewebTaskLevel1No;

        }
        else if (item.SharewebTaskType != undefined && (item.SharewebTaskType.Title === 'Workstream' || item.SharewebTaskType.Title === 'Step') && item.SharewebTaskLevel1No != undefined && item.SharewebTaskLevel2No != undefined) {
            if (item.Component != undefined && item.Services != undefined && item.Events != undefined) {
                if (!item.Events.results != undefined && !item.Services.results != undefined && !item.Component.results != undefined) {
                    Shareweb_x0020_ID = 'A' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No;
                }
            }
            if (item.Component != undefined) {
                if (item.Component.results != undefined && item.Component.results.length > 0) {
                    Shareweb_x0020_ID = 'CA' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No;
                }
            }
            if (item.Services != undefined) {
                if (item.Services.results != undefined && item.Services.results.length > 0) {
                    Shareweb_x0020_ID = 'SA' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No;
                }
            }
            if (item.Events != undefined) {
                if (item.Events.results != undefined && item.Events.results.length > 0) {
                    Shareweb_x0020_ID = 'EA' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No;
                }
            }
            if (item.Component === undefined && item.Services === undefined && item.Events === undefined) {
                Shareweb_x0020_ID = 'A' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No;
            }
            if (item.SharewebTaskType.Title === 'Step')
                Shareweb_x0020_ID = 'P' + item.SharewebTaskLevel1No + '-S' + item.SharewebTaskLevel2No;

        }
        else if (item.SharewebTaskType != undefined && (item.SharewebTaskType.Title === 'Task' || item.SharewebTaskType.Title === 'MileStone') && item.SharewebTaskLevel1No != undefined && item.SharewebTaskLevel2No != undefined) {
            if (item.Component != undefined && item.Services != undefined && item.Events != undefined) {
                if (!item.Events.results != undefined && !item.Services.results != undefined && !item.Component.results != undefined) {
                    Shareweb_x0020_ID = 'A' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No + '-T' + item.Id;
                }
            }
            if (item.Component != undefined) {
                if (item.Component.results != undefined && item.Component.results.length > 0) {
                    Shareweb_x0020_ID = 'CA' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No + '-T' + item.Id;
                }
            }
            if (item.Services != undefined) {
                if (item.Services.results != undefined && item.Services.results.length > 0) {
                    Shareweb_x0020_ID = 'SA' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No + '-T' + item.Id;
                }
            }
            if (item.Events != undefined) {
                if (item.Events.results != undefined && item.Events.results.length > 0) {
                    Shareweb_x0020_ID = 'EA' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No + '-T' + item.Id;
                }
            }
            if (item.Component === undefined && item.Services === undefined && item.Events === undefined) {
                Shareweb_x0020_ID = 'A' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No + '-T' + item.Id;
            }
            if (item.SharewebTaskType.Title === 'MileStone') {
                Shareweb_x0020_ID = 'P' + item.SharewebTaskLevel1No + '-S' + item.SharewebTaskLevel2No + '-M' + item.Id;
            }
        }
        else if (item.SharewebTaskType != undefined && (item.SharewebTaskType.Title === 'Task' || item.SharewebTaskType.Title === 'MileStone') && item.SharewebTaskLevel1No != undefined && item.SharewebTaskLevel2No === undefined) {
            if (item.Component != undefined && item.Services != undefined && item.Events != undefined) {
                if (!item.Events.results != undefined && !item.Services.results != undefined && !item.Component.results != undefined) {
                    Shareweb_x0020_ID = 'A' + item.SharewebTaskLevel1No + '-T' + item.Id;
                }
            }
            if (item.Component != undefined) {
                if (item.Component.results != undefined && item.Component.results.length > 0) {
                    Shareweb_x0020_ID = 'CA' + item.SharewebTaskLevel1No + '-T' + item.Id;
                }
            }
            if (item.Services != undefined) {
                if (item.Services.results != undefined && item.Services.results.length > 0) {
                    Shareweb_x0020_ID = 'SA' + item.SharewebTaskLevel1No + '-T' + item.Id;
                }
            }
            if (item.Events != undefined) {
                if (item.Events.results != undefined && item.Events.results.length > 0) {
                    Shareweb_x0020_ID = 'EA' + item.SharewebTaskLevel1No + '-T' + item.Id;
                }
            }
            if (item.Component === undefined && item.Services === undefined && item.Events === undefined) {
                Shareweb_x0020_ID = 'A' + item.SharewebTaskLevel1No + '-T' + item.Id;
            }
            if (item.SharewebTaskType.Title === 'MileStone') {
                Shareweb_x0020_ID = 'P' + item.SharewebTaskLevel1No + '-M' + item.Id;
            }

        } else {
            if (item?.Id != undefined) {
                Shareweb_x0020_ID = 'T' + item?.Id
            }
        }
        return Shareweb_x0020_ID;
    }
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
                    items.Shareweb_x0020_ID = getSharewebId(items);
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
                    <button type="button" className='Close-button' onClick={handleClose} >×</button>
                </Modal.Header>
                <Modal.Body>
                    {
                        AllTasks?.length > 0 ? <div>
                            <div className='row'>
                                <div className='col-sm-6 searchTaskTag'>
                                    <input className="form-control " type="text" value={searchText} onKeyDown={handleKeyDown} onChange={onSearchText} placeholder="Search" aria-label="Search" />
                                    <span className="input-group-text" onClick={() => { searchTaskToTag() }}><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 48 48" fill="none">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M31.0138 7.06731C33.8354 7.61202 36.1852 8.86678 37.9071 10.7481C39.8647 12.8866 40.832 15.2084 40.979 18.1218C41.0896 20.3107 40.7731 21.8402 39.7795 23.9182C39.1457 25.2435 38.8458 25.6499 37.5723 26.9085C35.1834 29.2697 33.1175 30.1768 29.783 30.3289C27.9988 30.4101 27.6948 30.3806 26.3472 29.9939C24.6941 29.5197 23.8671 29.1402 22.7405 28.3386C22.3186 28.0385 21.9187 27.7929 21.8519 27.7929C21.7851 27.7929 18.7525 30.7738 15.1127 34.4173C8.73245 40.8041 8.47514 41.04 7.93518 40.9963C7.15937 40.9331 6.78471 40.3003 7.12757 39.6316C7.25623 39.3804 10.2498 36.2724 13.78 32.7251C17.3101 29.1776 20.1984 26.2245 20.1984 26.1623C20.1984 26.1003 19.9343 25.6607 19.6115 25.1856C17.4873 22.0598 17.0424 17.9103 18.4541 14.3929C19.8012 11.0364 22.4973 8.58667 26.0904 7.45461C27.2002 7.10508 30.0487 6.88084 31.0138 7.06731ZM27.5326 9.2402C26.2441 9.47559 24.1717 10.4672 23.1928 11.3167C20.2179 13.8984 19.0413 17.6838 20.0893 21.3025C21.0407 24.5876 23.6698 27.1581 26.9782 28.0375C28.2549 28.3769 30.5384 28.3442 31.8541 27.9679C35.2193 27.0055 37.9175 24.2229 38.6949 20.9132C39.1038 19.1722 38.9464 16.9223 38.3009 15.2809C36.5751 10.8934 32.1303 8.40004 27.5326 9.2402Z" fill="#333333" />
                                    </svg></span>
                                    {searchText?.length > 0 ? <span className='searchclearTagTask' onClick={clearSearch} >×</span> : ''}
                                </div>
                                {SearchedAllTasks?.length > 0 ? <div className="col-sm-12">
                                    <div className="col-sm-12">
                                        <div className="tbl-header">
                                            <table className="compareTable">
                                                <thead>
                                                    <tr>
                                                        <th><input type="checkbox" id="isActive" checked={selectAll} defaultChecked={selectAll} onChange={() => selectAllFiltered(selectAll)} /></th>
                                                        <th style={{ width: "5%" }}>Site</th>
                                                        <th style={{ width: "10%" }}>Task Id</th>
                                                        <th style={{ width: "35%" }}> Task Title</th>
                                                        <th style={{ width: "20%" }}>Portfolio Type</th>
                                                        <th style={{ width: "10%" }}> % Complete</th>
                                                        <th style={{ width: "10%" }}>Priority</th>
                                                        <th style={{ width: "10%" }}>Created</th>
                                                        {/* <th>Edit</th> */}
                                                    </tr>
                                                </thead>
                                            </table>
                                        </div>
                                        <div className="tbl-content">
                                            <table className="compareTable">
                                                <tbody>
                                                    {
                                                        SearchedAllTasks.map((item: any, index: any) => {
                                                            return (
                                                                <tr className="table-body-content" key={index}>
                                                                    <td><input type="checkbox" id="isActive" onClick={() => { selectRow(item, index) }} checked={item?.selected} /></td>
                                                                    <td style={{ width: "5%" }}>
                                                                        <img className="icon-sites-img"
                                                                           title={item?.siteType} src={item?.siteIcon} />
                                                                    </td >
                                                                    <td style={{ width: "10%" }}>{item?.Shareweb_x0020_ID}</td>
                                                                    <td style={{ width: "35%" }}>{item?.Title}</td>
                                                                    <td style={{ width: "20%" }}>
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
                                                                    <td style={{ width: "10%" }}>{item.CreatedDis}
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
                                                            )
                                                        })
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div> : ''}

                            </div>
                        </div> : 'Loading ...'
                    }
                </Modal.Body>
                <div className="modal-footer">

                    <div className="row">
                        <div className="pull-right">
                            <Button type="button" className="me-2" variant="secondary" onClick={handleClose}>Cancel</Button>
                            <Button type="button" variant="primary" onClick={() => tagSelectedTasks()}>Tag</Button>
                        </div>
                    </div>
                </div>
            </Modal>


        </>
    )
}
export default TagTaskToProjectPopup