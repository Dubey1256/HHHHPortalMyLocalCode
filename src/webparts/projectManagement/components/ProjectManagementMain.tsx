import * as React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { FaAngleDown, FaAngleUp, FaHome } from 'react-icons/fa';
import { Web } from "sp-pnp-js";
import '../../cssFolder/Style.scss';
import '../../cssFolder/site_color.scss';
import { IoMdArrowDropright, IoMdArrowDropdown } from 'react-icons/io';
import * as Moment from 'moment';
var siteConfig:any=[]
const ProjectManagementMain = () => {
    const [AllTasks,setAllTasks] = React.useState([])
    const [Masterdata,setMasterdata] = React.useState([])
    const [array, setArray] = React.useState([])
    const [datas, setdatas] = React.useState([])
    const [isActive, setIsActive] = React.useState(false);
    const [datam, setdatam] = React.useState([])
    const [datak, setdatak] = React.useState([])
    const [dataj, setdataj] = React.useState([])
    const [datams, setdatams] = React.useState([])
    const [Title, setTitle] = React.useState()
    //const [QueryId, setQueryId] = React.useState()
var QueryId:any=''
    React.useEffect(() => {
         getQueryVariable((e:any)=>e);
        GetMasterData();
        GetMetaData();
      
    }, [])

    function getQueryVariable(variable:any)

    {

            var query = window.location.search.substring(1);

            console.log(query)//"app=article&act=news_content&aid=160990"

            var vars = query.split("&");

            console.log(vars)

            for (var i=0;i<vars.length;i++) {

                        var pair = vars[i].split("=");
                        QueryId=pair[1]

                        console.log(pair)//[ 'app', 'article' ][ 'act', 'news_content' ][ 'aid', '160990' ]

            if(pair[0] == variable){ return pair[1];}

             }

             return(false);

             

             

    }
    const GetMasterData = async () => {
        let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
        let taskUsers = [];
        var AllUsers: any = []
        taskUsers = await web.lists.getById('EC34B38F-0669-480A-910C-F84E92E58ADF').items
            .select("Deliverables,TechnicalExplanations,ValueAdded,Idea,Short_x0020_Description_x0020_On,Background,Help_x0020_Information,Short_x0020_Description_x0020__x,ComponentCategory/Id,ComponentCategory/Title,Comments,HelpDescription,FeedBack,Body,Services/Title,Services/Id,Events/Id,Events/Title,SiteCompositionSettings,ShortDescriptionVerified,Portfolio_x0020_Type,BackgroundVerified,descriptionVerified,Synonyms,BasicImageInfo,OffshoreComments,OffshoreImageUrl,HelpInformationVerified,IdeaVerified,TechnicalExplanationsVerified,Deliverables,DeliverablesVerified,ValueAddedVerified,CompletedDate,Idea,ValueAdded,TechnicalExplanations,Item_x0020_Type,Sitestagging,Package,Parent/Id,Parent/Title,Short_x0020_Description_x0020_On,Short_x0020_Description_x0020__x,Short_x0020_description_x0020__x0,Admin_x0020_Notes,AdminStatus,Background,Help_x0020_Information,SharewebCategories/Id,SharewebCategories/Title,Priority_x0020_Rank,Reference_x0020_Item_x0020_Json,Team_x0020_Members/Title,Team_x0020_Members/Name,Component/Id,Component/Title,Component/ItemType,Team_x0020_Members/Id,Item_x002d_Image,component_x0020_link,IsTodaysTask,AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,AttachmentFiles/FileName,FileLeafRef,FeedBack,Title,Id,PercentComplete,Company,StartDate,DueDate,Comments,Categories,Status,WebpartId,Body,Mileage,PercentComplete,Attachments,Priority,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title,ComponentPortfolio/Id,ComponentPortfolio/Title,ServicePortfolio/Id,ServicePortfolio/Title").expand("ComponentPortfolio,ServicePortfolio,ComponentCategory,AssignedTo,Component,Events,Services,AttachmentFiles,Author,Editor,Team_x0020_Members,SharewebCategories,Parent").getById(QueryId).get();
            taskUsers.PercentComplete = (taskUsers.PercentComplete * 100).toFixed(0);
            AllUsers.push(taskUsers);
        setMasterdata(AllUsers)

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
    const LoadAllSiteTasks = function () {
var AllTask:any=[]
        var query = "&$filter=Status ne 'Completed'&$orderby=Created desc&$top=4999";
        var Counter = 0;
        let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
        var arraycount = 0;
        siteConfig.map(async (config: any)=> {
            if (config.Title != 'SDC Sites') {
                
                let smartmeta = []; 
                let TaxonomyItems = [];
                smartmeta = await web.lists
                    .getById(config.listId)
                    .items
                    .select("Id,StartDate,DueDate,Title,PercentComplete,Priority_x0020_Rank,Priority,Project/Id,Project/Title")
                        .top(4999)
                        .filter("Project/Id eq " +QueryId)
                        .expand("Project")
                        .get();
                        arraycount++;
                    smartmeta.map((items:any)=>{
                        items.siteType = config.Title;
                        items.PercentComplete = (items.PercentComplete * 100).toFixed(0);
                        AllTask.push(items)
                    })
                        if (arraycount === 17) {
                            setAllTasks(AllTask)
                            // setmaidataBackup(AllTask)
                            // showProgressHide();
                        }
                        

                        
              

    }else{
        arraycount ++
    }})
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
                <a ng-if="Task.Portfolio_x0020_Type=='Component'  (Task.Item_x0020_Type=='Component Category')"
                    href="https://hhhhteams.sharepoint.com/sites/HHHH/SitePages/Component-Portfolio.aspx">
                   Project Management
                </a>
            </li>
            <li> {Masterdata.map(item => <a>{item.Title}</a>)}</li>
        </ul>
        {/* <span className="text-end"><a target="blank" href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=${ID}`}>Old Portfolio profile page</a></span> */}
    </div>
</div>

<div className='row'>
    <div className='p-0' style={{ verticalAlign: "top" }}>
        <h2 className='headign'>
           {Masterdata.map(item => <a>{item.Title}</a>)}
        </h2>
    </div>
</div>

        </div>
        </section>
        <section>
                <div className='container'>
                    <div className='row'>
                        <div className='col-md-9 bg-white'>
                            <div className='team_member row  py-2'>
                                <div className='col-md-4 p-0'>
                                    <dl>
                                        <dt className='bg-fxdark'>Due Date</dt>
                                        <dd className='bg-light'>

                                            <span>
                                                {Masterdata.map(item =>
                                                    <a>{item.DueDate != null ? Moment(item.Created).format('DD/MM/YYYY') : ""}</a>
                                                )}
                                                {/* {data.map(item =>  <i>{item.DueDate}</i>)} */}
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
                                            {Masterdata.map(item =>
                                                <a>{item.Priority != null ? item.Priority : ""}</a>)}
                                            <span
                                                className="hreflink pull-right" title="Edit Inline"
                                              >
                                                <i className="fa fa-pencil siteColor" aria-hidden="true"></i>
                                            </span>

                                        </dd>
                                    </dl>
                                  
                                </div>
                                <div className='col-md-4 p-0'>
                                    
                                    <dl>
                                        <dt className='bg-fxdark'>Assigned To</dt>
                                        <dd className='bg-light'>
                                            {Masterdata.map(item =>
                                                <a>{item.CompletedDate != null ? Moment(item.CompletedDate).format('DD/MM/YYYY') : ""}</a>)}
                                            <span
                                                className="hreflink pull-right" title="Edit Inline"
                                            >
                                                <i className="fa fa-pencil siteColor" aria-hidden="true"></i>
                                            </span>
                                        </dd>
                                    </dl>
                                   
                                    <dl>
                                        <dt className='bg-fxdark'>% Complete</dt>
                                        <dd className='bg-light'>
                                            {Masterdata.map(item => <a>{item.PercentComplete != null ? item.PercentComplete : ""}</a>)}
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
                                <div className='col-md-4 p-0'>
                               
                                </div>
                            </div>
                          
                        </div>
                       
                    </div>
                </div>
       </section>

       {/* ======================================Show Table============================================================================================================================ */}

       <div className="col-sm-12 pad0 smart">
                                    <div className="section-event">
                                        <div className="wrapper">
                                            <table className="table table-hover" id="EmpTable" style={{ width: "100%" }}>
                                            <thead>
                                                    <tr>
                                                      
                                                      
                                                        <th style={{ width: "40%" }}>
                                                            <div className="smart-relative">
                                                                <input type="search" placeholder="Title" className="full_width searchbox_height" />

                                                            </div>
                                                        </th>
                                                        <th style={{ width: "15%" }}>
                                                            <div  className="smart-relative">
                                                                <input type="search" placeholder="% Complete" className="full_width searchbox_height"/>
   

                                                            </div>
                                                        </th>
                                                        <th style={{ width: "15%" }}>
                                                            <div className="smart-relative">
                                                                <input id="searchClientCategory" type="search" placeholder="Priority"
                                                                    title="Client Category" className="full_width searchbox_height"/>
                                                               
                                                            </div>
                                                        </th>
                                                        <th style={{ width: "15%" }}>
                                                            <div className="smart-relative">
                                                                <input id="searchClientCategory" type="search" placeholder="Team"
                                                                    title="Client Category" className="full_width searchbox_height"/>
                                                               
                                                            </div>
                                                        </th>
                                                        <th style={{ width: "13%" }}>
                                                            <div className="smart-relative">
                                                                <input id="searchClientCategory" type="search" placeholder="Due Date"
                                                                    title="Client Category" className="full_width searchbox_height"
                                                                    />
                                                           
                                                                
                                                            </div>
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
                                                                                    <span><a href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Task-Profile.aspx?taskId=${item.Id}&Site=${item.siteType}`}>{item.Title}</a></span>

                                                                                    </td>
                                                                                    <td><span className="ml-2">{item.PercentComplete}</span></td>    
                                                                                    <td>{item.Priority}</td>

                                                                                    <td></td>
                                                                                    <td><span className="ml-2">{Moment(item.DueDate).format('DD/MM/YYYY')}</span></td>
                                                                                    <td><img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif"></img></td>
                                                                                  
                                                                            
                                                                       

                                                                    </tr>
                                                                
                                                                </>


                                                            )
                                                       
                                                    })}



                                                </tbody>



                                            </table>
                                        </div>
                                    </div>
                                </div>

        </>
    )
}
export default ProjectManagementMain;