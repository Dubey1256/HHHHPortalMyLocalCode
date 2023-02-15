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

var AllUser: any = []
var siteConfig: any = []
var DataSiteIcon: any = []
const ProjectManagementMain = (props: any) => {
    const [IsComponent, setIsComponent] = React.useState(false);
    const [SharewebComponent, setSharewebComponent] = React.useState('');
    const [AllTasks, setAllTasks] = React.useState([])
    const [isOpenEditPopup, setisOpenEditPopup] = React.useState(false)
    const [Masterdata, setMasterdata] = React.useState([])
    const [array, setArray] = React.useState([])
    const [datas, setdatas] = React.useState([])
    const [isActive, setIsActive] = React.useState(false);
    const [datam, setdatam] = React.useState([])
    const [datak, setdatak] = React.useState([])
    const [dataj, setdataj] = React.useState([])
    const [datams, setdatams] = React.useState([])
    const [passdata, setpassdata] = React.useState('');
    const [Title, setTitle] = React.useState()
    const [projectTitle, setProjectTitle] = React.useState('')
    const [projectId, setProjectId] = React.useState(null)

    var QueryId: any = ''
    React.useEffect(() => {
        getQueryVariable((e: any) => e);
        TaskUser();
        GetMasterData();
        GetMetaData();

    }, [])
    var showProgressBar = () => {
        $(' #SpfxProgressbar').show();
    }
    var showProgressHide = () => {
        $(' #SpfxProgressbar').hide();
    }
    const Call = React.useCallback((item1) => {
        setIsComponent(false);
    }, []);
    function getQueryVariable(variable: any) {

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
    const GetMasterData = async () => {
        let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
        let taskUsers = [];
        var AllUsers: any = []
        taskUsers = await web.lists.getById('EC34B38F-0669-480A-910C-F84E92E58ADF').items
            .select("Deliverables,TechnicalExplanations,ValueAdded,Idea,Short_x0020_Description_x0020_On,Background,Help_x0020_Information,Short_x0020_Description_x0020__x,ComponentCategory/Id,ComponentCategory/Title,Comments,HelpDescription,FeedBack,Body,Services/Title,Services/Id,Events/Id,Events/Title,SiteCompositionSettings,ShortDescriptionVerified,Portfolio_x0020_Type,BackgroundVerified,descriptionVerified,Synonyms,BasicImageInfo,OffshoreComments,OffshoreImageUrl,HelpInformationVerified,IdeaVerified,TechnicalExplanationsVerified,Deliverables,DeliverablesVerified,ValueAddedVerified,CompletedDate,Idea,ValueAdded,TechnicalExplanations,Item_x0020_Type,Sitestagging,Package,Parent/Id,Parent/Title,Short_x0020_Description_x0020_On,Short_x0020_Description_x0020__x,Short_x0020_description_x0020__x0,Admin_x0020_Notes,AdminStatus,Background,Help_x0020_Information,SharewebCategories/Id,SharewebCategories/Title,Priority_x0020_Rank,Reference_x0020_Item_x0020_Json,Team_x0020_Members/Title,Team_x0020_Members/Name,Component/Id,Component/Title,Component/ItemType,Team_x0020_Members/Id,Item_x002d_Image,component_x0020_link,IsTodaysTask,AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,AttachmentFiles/FileName,FileLeafRef,FeedBack,Title,Id,PercentComplete,Company,StartDate,DueDate,Comments,Categories,Status,WebpartId,Body,Mileage,PercentComplete,Attachments,Priority,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title,ComponentPortfolio/Id,ComponentPortfolio/Title,ServicePortfolio/Id,ServicePortfolio/Title").expand("ComponentPortfolio,ServicePortfolio,ComponentCategory,AssignedTo,Component,Events,Services,AttachmentFiles,Author,Editor,Team_x0020_Members,SharewebCategories,Parent").getById(QueryId).get();
        taskUsers.PercentComplete = (taskUsers.PercentComplete * 100).toFixed(0);
        if (taskUsers.Body != undefined) {
            taskUsers.Body = taskUsers.Body.replace(/(<([^>]+)>)/ig, '');
        }

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
    const getSharewebId = (item: any) => {
        var Shareweb_x0020_ID = undefined;
        if (item != undefined && item.SharewebTaskType != undefined && item.SharewebTaskType.Title === undefined) {
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
                    .filter("Project/Id eq " + QueryId)
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

    const handleOpen1 = (item: any) => {
        item.showl = item.showl = item.showl == true ? false : true;
        setdatam(datam => ([...datam]));
    };
    const handleOpen2 = (item: any) => {

        item.shows = item.shows = item.shows == true ? false : true;
        setdatas(datas => ([...datas]));
    };
    const handleOpen3 = (item: any) => {
        setIsActive(current => !current);
        setIsActive(true);
        item.showk = item.showk = item.showk == true ? false : true;
        setdatak(datak => ([...datak]));
    };
    const handleOpen4 = (item: any) => {
        setIsActive(current => !current);
        setIsActive(true);
        item.showj = item.showj = item.showj == true ? false : true;
        setdataj(dataj => ([...dataj]));
    };
    const handleOpen5 = (item: any) => {
        setIsActive(current => !current);
        setIsActive(true);
        item.showm = item.showm = item.showm == true ? false : true;
        setdatams(datams => ([...datams]));
    };
    const handleOpen = (item: any) => {
        Masterdata
        setIsActive(current => !current);
        setIsActive(false);
        item.show = item.show == true ? false : true;
        setArray(array => ([...array]));
    };
    // const sortBy = () => {

    //     const copy = data

    //     copy.sort((a, b) => (a.Title > b.Title) ? 1 : -1);

    //     setTable(copy)

    // }
    // const sortByDng = () => {

    //     const copy = data

    //     copy.sort((a, b) => (a.Title > b.Title) ? -1 : 1);

    //     setTable(copy)

    // }
    return (
        <>
            <section>
                <div className='container'>

                    <div className='row'>
                        <div className='d-flex justify-content-between p-0' ng-if="(Task.Item_x0020_Type=='Component Category')">
                            <ul className="spfxbreadcrumb m-0 p-0">
                                <li><a href='#'><FaHome /> </a></li>
                                <li>
                                    <a href="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Project-Management-Overview.aspx">
                                        Project Management
                                    </a>
                                </li>
                                <li> {Masterdata.map(item =><> <a>{item.Title}</a> </>)} </li>
                            </ul>
                            {/* <span className="text-end"><a target="blank" href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=${ID}`}>Old Portfolio profile page</a></span> */}
                        </div>


                    </div>

                    <div className='row'>
                        <div className='col-sm-9 p-0' style={{ verticalAlign: "top" }}>
                            <h2 className='heading'>
                                <img className='circularImage rounded-circle ' src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/Icon_Project.png" />
                                {Masterdata.map(item =><> <a>{item.Title}</a> <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif"  onClick={(e) => EditComponentPopup(item)}></img></>)}
                            </h2>
                        </div>
                        <div className='col-sm-3 pull-right' style={{ verticalAlign: "top" }}>
                            {projectId && <CreateTaskFromProject projectItem={Masterdata[0]} pageContext={props.pageContext} projectId={projectId} callBack={tagAndCreateCallBack} />}
                            {projectId && <TagTaskToProjectPopup projectId={projectId} callBack={tagAndCreateCallBack} projectTitle={projectTitle} />}


                        </div>
                    </div>
                </div>
            </section>
            <section>
                <div className='container'>
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

            {/* ======================================Show Table============================================================================================================================ */}
            <div className='container'>
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
                                                    <td>
                                                        {item.AllTeamMember != undefined &&
                                                            item.AllTeamMember.map((users: any) => {
                                                                return (
                                                                    <>
                                                                        <span className="headign" title={users.Title}><img className="circularImage rounded-circle" src={users.useimageurl} /></span>
                                                                    </>
                                                                )
                                                            })

                                                        }
                                                    </td>
                                                    <td><span className="ml-2">{item?.DueDate!=undefined ? Moment(item.DueDate).format('DD/MM/YYYY'):''}</span></td>
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
            {IsComponent && <EditProjectPopup props={SharewebComponent} Call={Call} showProgressBar={showProgressBar}> </EditProjectPopup>}
        </>
    )
}
export default ProjectManagementMain;