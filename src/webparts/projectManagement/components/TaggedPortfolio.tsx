import * as React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { FaAngleDown, FaAngleUp, FaHome } from 'react-icons/fa';
import { Web } from "sp-pnp-js";
import EditProjectPopup from '../../projectmanagementOverviewTool/components/EditProjectPopup';
import { IoMdArrowDropright, IoMdArrowDropdown } from 'react-icons/io';
import * as Moment from 'moment';
import EditTaskPopup from '../../../globalComponents/EditTaskPopup/EditTaskPopup';
import axios, { AxiosResponse } from 'axios';
import TagTaskToProjectPopup from './TagTaskToProjectPopup'
import CreateTaskFromProject from './CreateTaskFromProject';
import * as globalCommon from '../../../globalComponents/globalCommon';
import PortfolioTagging from '../../projectmanagementOverviewTool/components/PortfolioTagging';
import ShowTaskTeamMembers from '../../../globalComponents/ShowTaskTeamMembers';

let linkedComponentData: any = [];
let smartComponentData: any = [];
let portfolioType = '';
var AllUser: any = []
var siteConfig: any = []
var DataSiteIcon: any = []
const TaggedPortfolio = (props: any) => {
  const [item, setItem] = React.useState({});
  const [ShareWebComponent, setShareWebComponent] = React.useState('');
  const [IsPortfolio, setIsPortfolio] = React.useState(false);
  const [IsComponent, setIsComponent] = React.useState(false);
  const [SharewebComponent, setSharewebComponent] = React.useState('');
  const [AllTasks, setAllTasks] = React.useState([])
  const [isOpenEditPopup, setisOpenEditPopup] = React.useState(false)
  const [Masterdata, setMasterdata] = React.useState([])
  const [passdata, setpassdata] = React.useState('');
  const [projectTitle, setProjectTitle] = React.useState('')
  const [projectId, setProjectId] = React.useState(null)
  const [sidebarStatus, setSidebarStatus] = React.useState(
    {
      dashboard:false,
      compoonents:false,
      services:false
    }
  )
  var QueryId: any = ''
  React.useEffect(() => {
    getQueryVariable((e: any) => e);
    GetMasterData();
    GetMetaData();

  }, [])
  var showProgressBar = () => {
    $(' #SpfxProgressbar').show();
  }
  var showProgressHide = () => {
    $(' #SpfxProgressbar').hide();
  }

  const getQueryVariable = async (variable: any) => {

    var query = window.location.search.substring(1);

    console.log(query)//"app=article&act=news_content&aid=160990"

    var vars = query.split("&");

    console.log(vars)

    for (var i = 0; i < vars.length; i++) {

      var pair = vars[i].split("=");
      QueryId = pair[1]
      setProjectId(QueryId)

      console.log(pair)//[ 'app', 'article' ][ 'act', 'news_content' ][ 'aid', '160990' ]

      if (pair[0] == variable) { return pair[1]; }

    }

    return (false);

  }

  const GetMasterData = async () => {
    AllUser= await globalCommon.loadTaskUsers();
    let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
    let taskUsers: any = {};
    var AllUsers: any = []
    taskUsers = await web.lists.getById('EC34B38F-0669-480A-910C-F84E92E58ADF').items
      .select("ComponentCategory/Id", "ComponentCategory/Title", "SiteCompositionSettings", "PortfolioStructureID", "ItemRank", "ShortDescriptionVerified", "Portfolio_x0020_Type", "BackgroundVerified", "descriptionVerified", "Synonyms", "BasicImageInfo", "Deliverable_x002d_Synonyms", "OffshoreComments", "OffshoreImageUrl", "HelpInformationVerified", "IdeaVerified", "TechnicalExplanationsVerified", "Deliverables", "DeliverablesVerified", "ValueAddedVerified", "CompletedDate", "Idea", "ValueAdded", "TechnicalExplanations", "Item_x0020_Type", "Sitestagging", "Package", "Parent/Id", "Parent/Title", "Short_x0020_Description_x0020_On", "Short_x0020_Description_x0020__x", "Short_x0020_description_x0020__x0", "Admin_x0020_Notes", "AdminStatus", "Background", "Help_x0020_Information", "SharewebComponent/Id", "SharewebCategories/Id", "SharewebCategories/Title", "Priority_x0020_Rank", "Reference_x0020_Item_x0020_Json", "Team_x0020_Members/Title", "Team_x0020_Members/Name", "Component/Id", "Services/Id", "Services/Title", "Services/ItemType", "Component/Title", "Component/ItemType", "Team_x0020_Members/Id", "Item_x002d_Image", "component_x0020_link", "IsTodaysTask", "AssignedTo/Title", "AssignedTo/Name", "AssignedTo/Id", "AttachmentFiles/FileName", "FileLeafRef", "FeedBack", "Title", "Id", "PercentComplete", "Company", "StartDate", "DueDate", "Comments", "Categories", "Status", "WebpartId", "Body", "Mileage", "PercentComplete", "Attachments", "Priority", "Created", "Modified", "Author/Id", "Author/Title", "Editor/Id", "Editor/Title", "ClientCategory/Id", "ClientCategory/Title")
      .expand("ClientCategory", "ComponentCategory", "AssignedTo", "Component", "Services", "AttachmentFiles", "Author", "Editor", "Team_x0020_Members", "SharewebComponent", "SharewebCategories", "Parent")
      .getById(QueryId).get();
    if (taskUsers.PercentComplete = undefined)
      taskUsers.PercentComplete = (taskUsers?.PercentComplete * 100).toFixed(0);
    if (taskUsers.Body != undefined) {
      taskUsers.Body = taskUsers.Body.replace(/(<([^>]+)>)/ig, '');
    }
    let allPortfolios: any[] = [];
    allPortfolios = await globalCommon.getPortfolio("All")

    taskUsers.smartService = [];
    taskUsers?.ServicesId?.map((item: any) => {
      allPortfolios?.map((portfolio: any) => {
        if (portfolio?.Id == item) {
          taskUsers.smartService.push(portfolio)
        }
      })
    })
    taskUsers.smartComponent = []
    taskUsers?.ComponentId?.map((item: any) => {
      allPortfolios?.map((portfolio: any) => {
        if (portfolio?.Id == item) {
          taskUsers.smartComponent.push(portfolio)
        }
      })
    })
    AllUsers.push(taskUsers);


    AllUsers.map((items: any) => {
      items.AssignedUser = []
      if (items.AssignedToId != undefined) {
        items.AssignedToId.map((taskUser: any) => {
          var newuserdata: any = {};

          AllUser.map((user: any) => {
            if (user.AssingedToUserId == taskUser) {

              newuserdata['useimageurl'] = user.Item_x0020_Cover.Url;
              newuserdata['Suffix'] = user.Suffix;
              newuserdata['Title'] = user.Title;
              newuserdata['UserId'] = user.AssingedToUserId;
              items['Usertitlename'] = user.Title;
            }

          })
          items.AssignedUser.push(newuserdata);
        })
      }
    })
    if (AllUsers?.length > 0) {
      setProjectTitle(AllUsers[0].Title)
    }
    setMasterdata(AllUsers)
  }

  const CallBack = React.useCallback(() => {
    setisOpenEditPopup(false)
  }, [])

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

  const EditPopup = React.useCallback((item: any) => {
    setisOpenEditPopup(true)
    setpassdata(item)
  }, [])
  const EditComponentPopup = (item: any) => {
    item['siteUrl'] = 'https://hhhhteams.sharepoint.com/sites/HHHH/SP';
    item['listName'] = 'Master Tasks';
    // <ComponentPortPolioPopup ></ComponentPortPolioPopup>
    setIsComponent(true);
    setSharewebComponent(item);
    // <ComponentPortPolioPopup props={item}></ComponentPortPolioPopup>
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
  const tagAndCreateCallBack = React.useCallback(
    () => {
      LoadAllSiteTasks();
    },
    []
  )


  const LoadAllSiteTasks = function () {
    loadAdminConfigurations();
    var AllTask: any = []
    var query = "&$filter=Status ne 'Completed'&$orderby=Created desc&$top=4999";
    var Counter = 0;
    let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
    var arraycount = 0;
    siteConfig.map(async (config: any) => {
      if (config.Title != 'SDC Sites') {
        let smartmeta = [];
        smartmeta = await web.lists
          .getById(config.listId)
          .items
          .select("Id,StartDate,DueDate,Title,PercentComplete,Priority_x0020_Rank,Priority,ClientCategory/Id,SharewebTaskType/Id,SharewebTaskType/Title,ComponentId,ServicesId,ClientCategory/Title,Project/Id,Project/Title,Author/Id,Author/Title,Editor/Id,Editor/Title,AssignedTo/Id,AssignedTo/Title,Team_x0020_Members/Id,Team_x0020_Members/Title,Responsible_x0020_Team/Id,Responsible_x0020_Team/Title,Component/Id,component_x0020_link,Component/Title,Services/Id,Services/Title")
          .top(4999)
          .filter("ProjectId eq " + QueryId)
          .expand("Project,AssignedTo,Author,Editor,Team_x0020_Members,Responsible_x0020_Team,ClientCategory,Component,Services,SharewebTaskType")
          .get();
        arraycount++;
        smartmeta.map((items: any) => {
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
            DataSiteIcon.map((site: any) => {
              if (site.Site == items.siteType) {
                items['siteIcon'] = site.SiteIcon
              }
            })
          }
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
        }
      } else {
        arraycount++
      }
    })
  }
  const getComponentasString = function (results: any) {
    var component = '';
    $.each(results, function (cmp: any) {
      component += cmp.Title + '; ';
    })
    return component;
  }


  React.useEffect(() => {
    if (Masterdata[0]?.Id != undefined) {
      setItem(Masterdata[0])

      linkedComponentData = Masterdata[0]?.smartService;
      smartComponentData = Masterdata[0].smartComponent;
    }

  }, [Masterdata]);
  const EditPortfolio = (item: any, type: any) => {
    portfolioType = type
    setIsPortfolio(true);
    setShareWebComponent(item);
  }
  const Call = (propsItems: any, type: any) => {
    setIsPortfolio(false);
    if (type === "Service") {
      if (propsItems?.smartService?.length > 0) {
        linkedComponentData = propsItems.smartService;
        TagPotfolioToProject();
      }
    }
    if (type === "Component") {
      if (propsItems?.smartComponent?.length > 0) {
        smartComponentData = propsItems.smartComponent;
        TagPotfolioToProject()
      }
    }

  };
  const TagPotfolioToProject = async () => {
    if (Masterdata[0]?.Id != undefined) {


      let selectedComponent: any[] = [];
      if (smartComponentData !== undefined && smartComponentData.length > 0) {
        $.each(smartComponentData, function (index: any, smart: any) {
          selectedComponent.push(smart?.Id);
        })
      }
      let selectedService: any[] = [];
      if (linkedComponentData !== undefined && linkedComponentData.length > 0) {
        $.each(linkedComponentData, function (index: any, smart: any) {
          selectedService.push(smart?.Id);
        })
      }
      let web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/SP');
      await web.lists.getById('ec34b38f-0669-480a-910c-f84e92e58adf').items.getById(Masterdata[0]?.Id).update({
        ComponentId: { "results": (selectedComponent !== undefined && selectedComponent?.length > 0) ? selectedComponent : [] },
        ServicesId: { "results": (selectedService !== undefined && selectedService?.length > 0) ? selectedService : [] },
      }).then((res: any) => {
        GetMasterData();
        console.log(res);
      })
    }
  }
  return (
    <>

      <div className='row'>
        <div className='d-flex justify-content-between p-0' ng-if="(Task.Item_x0020_Type=='Component Category')">
          <ul className="spfxbreadcrumb mb-2 ms-2 p-0">
            {/* <li><a href='#'><FaHome /> </a></li> */}
            <li>
              <a href="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Project-Management-Overview.aspx">
                Project Management
              </a>
            </li>
            <li> {Masterdata.map(item => <> <a>{item.Title}</a> </>)} </li>
          </ul>
          {/* <span className="text-end"><a target="blank" href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=${ID}`}>Old Portfolio profile page</a></span> */}
        </div>
      </div>
      <div className='Dashboardsecrtion'>
        <div className="dashboard-colm">
          <aside className="sidebar">
            <button type="button" ng-click="ShowFullMonth==true?ShowFullMonth=false:ShowFullMonth=true" className="collapse-toggle"></button>
            <section className="sidebar__section sidebar__section--menu" >
              <nav className="nav__item">
                <ul className="nav__list">
                  <li id="DefaultViewSelectId" className="nav__item">
                    <a ng-click="ChangeView('DefaultView','DefaultViewSelectId')" className="nav__link">
                      <span className="nav__icon nav__icon--home"></span>
                      <span className="nav__text">Components</span>
                    </a>
                  </li>
                  <li className="nav__item p-2 pt-0">
                    <div className="" >
                      {
                        Masterdata[0]?.smartComponent?.length > 0 ?
                         <div className="border">
                           <table className="table">
                            <tbody>
                              { 
                                Masterdata[0]?.smartComponent?.map((component: any) => {
                                  return (
                                    <tr>
                                      <td>
                                        <span><a className='text-white' data-interception="off" target="blank" href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages//Portfolio-Profile.aspx?taskId=${component?.Id}`}>{component?.Title}</a></span>
                                      </td>
                                    </tr>
                                  )
                                })
                              }
                            </tbody>
                          </table>
                         </div>
                          :
                          <div className="border rounded-2 p-2 pt-0 text-center">
                            No Tagged Component
                          </div>
                      }
                      <div className="text-end mt-2 bt-2">
                        <span style={{ cursor: 'pointer' }} onClick={(e) => EditPortfolio(Masterdata[0], 'Component')}>Tag Components</span>
                      </div>
                    </div>
                  </li>
                </ul>
              </nav>
            </section>
            <section className="sidebar__section sidebar__section--menu">
              <nav className="nav__item">
                <ul className="nav__list">
                  <li id="DefaultViewSelectId" className="nav__item">
                    <a ng-click="ChangeView('DefaultView','DefaultViewSelectId')" className="nav__link">
                      <span className="nav__icon nav__icon--home"></span>
                      <span className="nav__text">Services</span>
                    </a>
                  </li>
                  <li id="DefaultViewSelectId" className="nav__item p-2 pt-0">
                    <div className="">
                      {
                        Masterdata[0]?.smartService?.length > 0 ?
                        <div className="border">
                            <table className="table">
                            <tbody>
                              {
                                Masterdata[0]?.smartService?.map((service: any) => {
                                  return (
                                    <tr>
                                      <td>
                                        <span><a className='text-white' data-interception="off" target="blank" href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages//Portfolio-Profile.aspx?taskId=${service?.Id}`}>{service?.Title}</a></span>
                                      </td>
                                    </tr>
                                  )
                                })
                              }

                            </tbody>
                          </table>
                        </div>
                          :
                          <div className="border rounded-2 p-2 pt-0 text-center">
                            No Tagged Service
                          </div>
                      }
                      <div className="text-end mt-2 bt-2">
                        <span style={{ cursor: 'pointer' }} onClick={(e) => EditPortfolio(Masterdata[0], 'Service')}>Tag Services</span>
                      </div>
                    </div>
                  </li>
                </ul>
              </nav>
            </section>
          </aside>
          <div className="dashboard-content ps-2 full-width">
            <article className='row'>
              <div className='col-md-12'>
                <section>
                  <div>
                    <div className='align-items-center d-flex justify-content-between'>
                      <div>
                        <h2 className='heading'>
                          <img className='circularImage rounded-circle ' src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/Icon_Project.png" />
                          {Masterdata.map(item => <> <a>{item.Title}</a> <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif" onClick={(e) => EditComponentPopup(item)}></img></>)}
                        </h2>
                      </div>
                      <div>
                        <div className='d-flex'>
                          {projectId && <CreateTaskFromProject projectItem={Masterdata[0]} pageContext={props.pageContext} projectId={projectId} callBack={tagAndCreateCallBack} />}
                          {projectId && <TagTaskToProjectPopup className='ms-2' projectId={projectId} callBack={tagAndCreateCallBack} projectTitle={projectTitle} />}
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
                <section>
                  <div>
                    <div className='row'>
                      <div className='col-md-12 bg-white'>
                        {Masterdata.map((item: any) => {
                          return (
                            <>

                              <div className='team_member row  py-2'>
                                <div className='col-md-6 p-0'>
                                  <dl>
                                    <dt className='bg-fxdark'>Due Date</dt>
                                    <dd className='bg-light'>

                                      <span>

                                        <a>{item.DueDate != null ? Moment(item.Created).format('DD/MM/YYYY') : ""}</a>

                                      </span>
                                      <span
                                        className="pull-right" title="Edit Inline"
                                        ng-click="EditContents(Task,'editableDueDate')">
                                        <i className="fa fa-pencil siteColor" aria-hidden="true"></i>
                                      </span>
                                    </dd>
                                  </dl>
                                  <dl>
                                    <dt className='bg-fxdark'>Priority</dt>
                                    <dd className='bg-light'>

                                      <a>{item.Priority != null ? item.Priority : ""}</a>
                                      <span
                                        className="hreflink pull-right" title="Edit Inline"
                                      >
                                        <i className="fa fa-pencil siteColor" aria-hidden="true"></i>
                                      </span>

                                    </dd>
                                  </dl>


                                </div>
                                <div className='col-md-6 p-0'>

                                  <dl>
                                    <dt className='bg-fxdark'>Assigned To</dt>
                                    <dd className='bg-light'>
                                      {item.AssignedUser.map((image: any) =>
                                        <span className="headign" title={image.Title}><img className='circularImage rounded-circle' src={image.useimageurl} /></span>
                                      )}

                                    </dd>
                                  </dl>
                                  <dl>
                                    <dt className='bg-fxdark'>% Complete</dt>
                                    <dd className='bg-light'>
                                      <a>{item.PercentComplete != null ? item.PercentComplete : ""}</a>
                                      <span className="pull-right">
                                        <span className="pencil_icon">
                                          <span ng-show="isOwner" className="hreflink"
                                            title="Edit Inline"
                                          >
                                            <i className="fa fa-pencil" aria-hidden="true"></i>
                                          </span>
                                        </span>
                                      </span>

                                    </dd>
                                  </dl>


                                </div>
                                <div className='team_member row  py-2'>
                                  <div className='col-md-12 p-0'>
                                    <dl className='bg-light p-2'>

                                      <a>{item.Body != null ? item.Body : ""}</a>
                                      <span
                                        className="hreflink pull-right" title="Edit Inline"
                                      >
                                        <i className="fa fa-pencil siteColor" aria-hidden="true"></i>
                                      </span>


                                    </dl>
                                  </div>
                                </div>
                              </div>
                            </>
                          )
                        })}

                      </div>

                    </div>
                  </div>
                </section>
                <div>
                  <div className="row">
                    <div className="section-event border-top">
                      <div className="wrapper">
                        <table className="table table-hover" id="EmpTable" style={{ width: "100%" }}>
                          <thead>
                            <tr>
                              <th></th>
                              <th style={{ width: "10%" }}>
                                <div> Task Id </div></th>

                              <th style={{ width: "25%" }}>
                                <div> Title </div></th>

                              <th style={{ width: "10%" }}>
                                <div> Portfolio Type </div>
                              </th>

                              <th style={{ width: "10%" }}>
                                <div> % Complete </div>
                              </th>

                              <th style={{ width: "13%" }}>
                                <div> Priority </div>
                              </th>

                              <th style={{ width: "15%" }}>
                                <div> Team </div>
                              </th>

                              <th style={{ width: "13%" }}>
                                <div> Due Date </div>
                              </th>

                              <th style={{ width: "2%" }}>
                              </th>

                            </tr>
                          </thead>
                          <tbody>

                            <div id="SpfxProgressbar" style={{ display: "none" }}>

                              <img id="sharewebprogressbar-image" src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/loading_apple.gif" alt="Loading..." />

                            </div>
                            {AllTasks.length > 0 && AllTasks && AllTasks.map(function (item, index) {


                              return (
                                <>
                                  <tr >
                                    <td>
                                      <img className="circularImage rounded-circle"
                                        src={item.siteIcon} />
                                    </td>
                                    <td>{item.Shareweb_x0020_ID}</td>
                                    <td>
                                      <span><a data-interception="off" target="blank" href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Task-Profile.aspx?taskId=${item.Id}&Site=${item.siteType}`}>{item.Title}</a></span>
                                    </td>
                                    <td>
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
                                    <td><span className="ml-2">{item.PercentComplete}</span></td>
                                    <td>{item.Priority}</td>
                                    <td><ShowTaskTeamMembers props={item} TaskUsers={AllUser}></ShowTaskTeamMembers></td>
                                    <td><span className="ml-2">{item?.DueDate != undefined ? Moment(item.DueDate).format('DD/MM/YYYY') : ''}</span></td>
                                    <td onClick={() => EditPopup(item)}><img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif"></img></td>
                                  </tr>
                                </>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                <div id="SpfxProgressbar" style={{ display: "none" }}>
                  <img id="sharewebprogressbar-image" src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/loading_apple.gif" alt="Loading..." />
                </div>
                {isOpenEditPopup ? <EditTaskPopup Items={passdata} Call={CallBack} /> : ''}
                {IsComponent ? <EditProjectPopup props={SharewebComponent} Call={Call} showProgressBar={showProgressBar}> </EditProjectPopup> : ''}
              </div>
            </article>
          </div>
        </div>
      </div>
      {/* <div className="" id="myTabContent">
      <div className="col">
        <div className="card mb-4 rounded-3 shadow-sm">
          <div className="card-header py-2">
            <div className="my-0 fw-normal fs-6">Components</div>
          </div>
          <div className="card-body">
          {
            props?.taggedComponents?.length > 0 ?
              <table className="table">
                <tbody>
                  {
                    props?.taggedComponents?.map((component: any) => {
                      return (
                        <tr>
                          <td>
                            <span><a data-interception="off" target="blank" href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages//Portfolio-Profile.aspx?taskId=${component?.Id}`}>{component?.Title}</a></span>
                          </td>
                        </tr>
                      )
                    })
                  }
                </tbody>
              </table>
              :
              <div className="border rounded-2 p-3 text-center">
                No Tagged Component
              </div>
              }
              <div className="text-end mt-2 bt-2">
                <a onClick={(e) => EditPortfolio(props?.item, 'Component')}>Tag Components</a>
              </div>
          </div>
        </div>
      </div>
      <div className="col">
        <div className="card mb-4 rounded-3 shadow-sm">
          <div className="card-header py-2">
            <div className="my-0 fw-normal fs-6">Services</div>
          </div>
          <div className="card-body">
          {
            props?.taggedServices?.length > 0 ?
              <table className="table">
                <tbody>
                  {
                    props?.taggedServices?.map((service: any) => {
                      return (
                        <tr>
                          <td>
                            <span><a data-interception="off" target="blank" href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages//Portfolio-Profile.aspx?taskId=${service?.Id}`}>{service?.Title}</a></span>
                          </td>
                        </tr>
                      )
                    })
                  }

                </tbody>
              </table>
              :
              <div className="border rounded-2 p-3 text-center">
              No Tagged Service
            </div>
              }
              <div className="text-end mt-2 bt-2">
                <a onClick={(e) => EditPortfolio(props?.item, 'Service')}>Tag Services</a>
              </div>
          </div>
        </div>
      </div>
    



      </div> */}
      {IsPortfolio && <PortfolioTagging props={ShareWebComponent} type={portfolioType} Call={Call}></PortfolioTagging>}



    </>
  )
}
export default TaggedPortfolio;