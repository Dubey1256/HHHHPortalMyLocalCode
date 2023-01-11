
import axios, { AxiosResponse } from 'axios';
import * as React from 'react';
import '../components/TagTaskToProjectPopup.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useEffect, useState } from 'react';
import { Web } from "sp-pnp-js";
var AllUser: any = []
var siteConfig: any = []
var DataSiteIcon: any = []
const TagTaskToProjectPopup = (props: any) => {

    const [lgShow, setLgShow] = useState(false);
    const handleClose = () =>{
        setLgShow(false);
        clearSearch()
    } 
    const [AllTasks, setAllTasks] = React.useState([])
    const [SearchedAllTasks, setSearchedAllTasks] = React.useState([])
    const [selectAll, setselectAll] = React.useState(false)

    const [Masterdata, setMasterdata] = React.useState([])


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

        }else {
            if (item?.Id!= undefined) {
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
                    .select("Id,StartDate,DueDate,Title,PercentComplete,Priority_x0020_Rank,Priority,ClientCategory/Id,SharewebTaskType/Id,SharewebTaskType/Title,ComponentId,ServicesId,ClientCategory/Title,Project/Id,Project/Title,Author/Id,Author/Title,Editor/Id,Editor/Title,AssignedTo/Id,AssignedTo/Title,Team_x0020_Members/Id,Team_x0020_Members/Title,Responsible_x0020_Team/Id,Responsible_x0020_Team/Title,Component/Id,component_x0020_link,Component/Title,Services/Id,Services/Title")
                    .top(4999)
                    // .filter("Project/Id ne " + props.projectId)
                    .expand("Project,AssignedTo,Author,Editor,Team_x0020_Members,Responsible_x0020_Team,ClientCategory,Component,Services,SharewebTaskType")
                    .get();
                arraycount++;
                smartmeta.map((items: any) => {
                    items.AllTeamMember = []
                    items.siteType = config.Title;
                    if(items?.Project?.Id==props?.projectId){
                        items.selected=true;
                    }else {
                        items.selected=false;
                    }
                    items.listId = config.listId;
                    items.SiteUrl = config.siteUrl.Url;
                    items.PercentComplete = (items.PercentComplete * 100).toFixed(0);
                    if (items.Component != undefined && items.Component.results != undefined && items.Component.results.length > 0) {
                        items['Portfoliotype'] = 'Component';
                    }
                    if (items.Services != undefined && items.Services.results && items.Services.results.length > 0) {
                        items['Portfoliotype'] = 'Service';
                    }
                    if (DataSiteIcon != undefined) {
                        DataSiteIcon.map((site: any) => {
                            if (site.Site == items.siteType) {
                                items['siteIcon'] = site.SiteIcon
                            }
                        })
                    }
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
    }, []);
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
    const onSearchText = (e:any) => {
        setSearchText(e.target.value);
       
    };
    const clearSearch=()=>{
        setSearchText('');
        setSearchedAllTasks([])
    }
   const searchTaskToTag=()=>{
    let SearchedTasks: any[];
    if (searchText) {
        SearchedTasks = AllTasks.filter((task:any) => {
            if (
                task?.Title?.toLowerCase().includes(searchText.toLowerCase()) || task?.Shareweb_x0020_ID?.toLowerCase().includes(searchText.toLowerCase())      
                // ta.phone.toLowerCase().includes(searchText.toLowerCase()) || employee.userName.toLowerCase().includes(searchText.toLowerCase()) ||
                // employee.email.toLowerCase().includes(searchText.toLowerCase())
            ) {
                return true;
            }
            return false;
        });
        setSearchedAllTasks(SearchedTasks)
    } 
   }
   const tagSelectedTasks=()=>{
    SearchedAllTasks?.map(async(item:any)=>{
        if(item.selected==true){
            const web = new Web(item?.SiteUrl);
            await web.lists.getById(item?.listId).items.getById(item?.Id).update({
               ProjectId:props?.projectId!=undefined?props?.projectId:''
            }).then((e: any) => {
                
                props.callback();
     
            })
                .catch((err: { message: any; }) => {
                    console.log(err.message);
                });
        }
    })
   }
   
   const handleKeyDown = (event:any) => {
    if (event.key === 'Enter') {
        searchTaskToTag();
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
                        <span><strong>Tag Task To Project</strong></span>
                    </span>
                    <button type="button" className='Close-button' onClick={handleClose} >×</button>
                </Modal.Header>
                <Modal.Body>
                    <div className='row'>
                        <div className='col-sm-6'>
                           
                        {/* <div className="Custom-Search">
  <form>
    <input type="text" placeholder="type something"/>
    <a href="javascript:void(0);" className="search-button">
      <div className="icon">
        <span className="clear">x</span>
      </div>
    </a>
  </form>
</div> */}
                           
                            <input className="form-control searchTaskTag" type="text"  value={searchText} onKeyDown={handleKeyDown} onChange={onSearchText} placeholder="Search" aria-label="Search" />
                            <span className='searchclearTagTask' onClick={clearSearch} >×</span>
                        </div>
                        <div className="col-sm-12">
                            <div className="col-sm-12">
                                <div className="tbl-header">
                                    <table className="compareTable">
                                        <thead>
                                            <tr>
                                                <th><input type="checkbox" id="isActive" checked={selectAll} defaultChecked={selectAll} onChange={() => selectAllFiltered(selectAll)} /></th>
                                                <th style={{ width: "5%" }}>Site</th>
                                                <th style={{ width: "10%" }}>Task Id</th>
                                                <th > Task Title</th>
                                                {/* <th>Phone</th>
                                                    <th>Email</th>
                                                    <th>Is Active</th>
                                                    <th>Delete</th>
                                                    <th>Edit</th> */}
                                            </tr>
                                        </thead>
                                    </table>
                                </div>
                                <div className="tbl-content">
                                    <table className="compareTable">
                                        <tbody>
                                            {
                                                SearchedAllTasks.map((item, index) => {
                                                    return (
                                                        <tr className="table-body-content" key={index}>
                                                            <td><input type="checkbox" id="isActive" onChange={()=>{item.selected=!item?.selected}} checked={item?.selected} defaultChecked={item?.Project?.Id==props?.projectId} /></td>
                                                            <td style={{ width: "5%" }}>
                                                                <img className="icon-sites-img"
                                                                    src={item?.siteIcon} />
                                                            </td >
                                                            <td style={{ width: "10%" }}>{item?.Shareweb_x0020_ID}</td>
                                                            <td>{item?.Title}</td>
                                                            {/* <td>{item?.phone}</td>
                                                                <td>{item?.email}</td>
                                                                <td><input type="checkbox" id="isActive" defaultChecked={item?.isActive} disabled /></td>
                                                                <td><DeleteUsers userId={item?.userId} getUsers={getUsers} setshowSnackbar={setshowSnackbar} setSnackMessage={setSnackMessage}  /></td>
                                                                <td className='editIcon'><Update userId={item?.userId} getUsers={getUsers} setshowSnackbar={setshowSnackbar} setSnackMessage={setSnackMessage} /></td> */}
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <div className="modal-footer">

                    <div className="row">
                            <div className="pull-right">
                                <Button type="button" className="me-2" variant="primary"  onClick={handleClose}>Cancel</Button>
                                <Button type="button" variant="secondary" onClick={()=>tagSelectedTasks()}>Tag Tasks</Button>
                            </div>
                    </div>
                </div>
            </Modal>
        </>
    )
}
export default TagTaskToProjectPopup