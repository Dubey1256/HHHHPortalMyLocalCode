import * as React from 'react';
import * as $ from 'jquery';
import '../../cssFolder/foundation.scss';
import '../../cssFolder/foundationmin.scss';
import "bootstrap/dist/css/bootstrap.min.css";
import * as Moment from 'moment';

import Tooltip from './Tooltip';
import ComponentTable from './TaskWebpart';
   

function Portfolio({ID}:any) {
    const [data, setTaskData] = React.useState([]);
    const [isActive, setIsActive] = React.useState(false);
    const [array, setArray] = React.useState([])
    const [datas, setdatas] = React.useState([])
    const [datam, setdatam] = React.useState([])
    const [datak, setdatak] = React.useState([])
    const [dataj, setdataj] = React.useState([])
    const [datams, setdatams] = React.useState([])
    const handleOpen = (item: any) => {
        setIsActive(current => !current);
        setIsActive(true);
        item.show = item.show = item.show == false ? true : false;
        setArray(array => ([...array]));
    };
    const handleOpen1 = (item: any) => {
        item.showl = item.showl = item.showl == false ? true : false;
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


   
    React.useEffect(() => {
           
        var url = `https://hhhhteams.sharepoint.com/sites/HHHH/SP/_api/lists/getbyid('EC34B38F-0669-480A-910C-F84E92E58ADF')/items?$select=ItemRank,Item_x0020_Type,Portfolio_x0020_Type,Site,FolderID,PortfolioLevel,PortfolioStructureID,ValueAdded,Idea,TaskListName,TaskListId,WorkspaceType,CompletedDate,ClientActivityJson,ClientSite,Item_x002d_Image,Sitestagging,SiteCompositionSettings,TechnicalExplanations,Deliverables,ComponentPortfolio/Id,ComponentPortfolio/Title,ServicePortfolio/Id,ServicePortfolio/Title,Package,Short_x0020_Description_x0020_On,Short_x0020_Description_x0020__x,Short_x0020_description_x0020__x0,Admin_x0020_Notes,AdminStatus,Background,Help_x0020_Information,BasicImageInfo,Item_x0020_Type,AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,Component/Id,Component/Title,Component/ItemType,Component/ItemType,Categories,FeedBack,component_x0020_link,FileLeafRef,Title,Id,Comments,StartDate,DueDate,Status,Body,Company,Mileage,PercentComplete,FeedBack,Attachments,Priority,Created,Modified,PermissionGroup/Id,PermissionGroup/Title,Team_x0020_Members/Id,Team_x0020_Members/Title,Services/Id,Services/Title,Services/ItemType,Parent/Id,Parent/Title,Parent/ItemType,SharewebCategories/Id,SharewebCategories/Title,ClientCategory/Id,ClientCategory/Title&$expand=ClientCategory,ComponentPortfolio,ServicePortfolio,Parent,AssignedTo,Services,Team_x0020_Members,Component,PermissionGroup,SharewebCategories&$filter=Id eq ${ID}&$top=4999`;
        var response: any = [];  // this variable is used for storing list items
        function GetListItems() {
            $.ajax({
                url: url,
                method: "GET",
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (data) {
                    response = response.concat(data.d.results);
                    if (data.d.__next) {
                        url = data.d.__next;
                        GetListItems();
                    } else setTaskData(response);
                    console.log(response);
                },
                error: function (error) {
                    console.log(error);
                    // error handler code goes here
                }
            });
        }
        GetListItems();
    },
        []);

        var myarray: any = [];
        var myarray1: any = [];
        var myarray2: any = [];
        
      
        

    
        data.map(item => {
            if(item.Sitestagging!=null){
            myarray.push(JSON.parse(item.Sitestagging));
        }
            if(myarray.length!=0){
            myarray[0].map((items: any) => {
    
    
                if (items.SiteImages != undefined && items.SiteImages != '' ) {
                    items.SiteImages = items.SiteImages.replace('https://www.hochhuth-consulting.de', 'https://hhhhteams.sharepoint.com/sites/HHHH')
                    myarray1.push(items)
                    
    
                }
                console.log(myarray1);
    
                // if (items.ClienTimeDescription != undefined) {
                //     items.ClienTimeDescription = parseFloat(item.ClienTimeDescription);
                //     myarray1.push(items)
    
                // }
                
    
            })
        }
    
        if(item.ClientCategory.results.length!=0){
            item.ClientCategory.results.map((terms: any)=>{
            //     if(myarray2.length!=0 && myarray2[0].title==terms.title){
            //                ""
            //     }else{
            //    myarray2.push(terms);
            // }
            myarray2.push(terms);
           })

       }
    //    const letters = new Set([myarray2]);
        
            console.log(myarray2)
        
      
        // myarray.push();
    })
     
    var name;
    return (
        <div>
           
            <div className="col-lg-12 pad0">
                <section className="ContentSection">
                    <div className="container">
                        <div className="col-sm-9 left-col">
                            <div className="row">
                                <div className="col-sm-12 col-sm-12 pad0">
                                    <div className="col-sm-12 no-padding"
                                        ng-if="(Task.Item_x0020_Type=='Component Category')">
                                        <ul className="">
                                            <li>
                                                <span>
                                                    <a ng-if="Task.Portfolio_x0020_Type=='Component'  (Task.Item_x0020_Type=='Component Category')"
                                                        href="https://hhhhteams.sharepoint.com/sites/HHHH/SitePages/Component-Portfolio.aspx">
                                                        Component-Portfolio<span>{'>'}</span>
                                                    </a>
                                                </span>
                                                <span className="">
                                                    {data.map(item => <a>{item.Title}</a>)}
                                                    
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="task-title mb-10" style={{ verticalAlign: "top" }}>
                                        <h1 className="mb-5">
                                            <span>
                                                <img style={{ height: "24px", width: "24px", marginTop: "-2px" }}
                                                    src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/component_icon.png" />
                                            </span>
                                            <span>
                                                {data.map(item => <a>{item.Title}</a>)}
                                            </span>
                                            {/* <img className="icon-sites-img" ng-show="Task.isNewItem"
                                     src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/NewItemIcon-green.png" /> */}
                                            {/* <a ng-if="isMemberOwner==true  isOwner==true" className="hreflink"
                                                title="EditTask" ng-click="EditTask(Task)">
                                                <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/32/edititem.gif" />
                                            </a>
                                            <a ng-if="isMemberOwner==true  Task.WebpartItemId!=undefined"
                                                className="hreflink" title="Portfolio Description" target="_blank"
                                                href="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/PortfolioDescriptionForm.aspx?taskId={{Task.WebpartItemId}}">
                                                <img className="wid-20"
                                                    src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/32/help_Icon.png" />
                                            </a> */}
                                        </h1>
                                    </div>
                                </div>
                                <div className="col-lg-12 pad0">
                                    <div className="col-lg-8 left-col pad0">
                                        <div className="">
                                            <div className="col-sm-12 pad0">
                                                <div className="involve_actor">
                                                    <div className="tmvalue impact-info53" title="due date">
                                                        <label className="full_width">Due Date</label>
                                                    </div>
                                                    <div className="tlvalue impact-infoII">
                                                        <span>
                                                            {/* <i> 02/12/2019</i> */}
                                                            {data.map(item =>
                                                                <a>{item.DueDate != null ? Moment(item.DueDate).format('DD/MM/YYYY') : ""}</a>
                                                            )}
                                                            {/* {data.map(item =>  <i>{item.DueDate}</i>)} */}
                                                        </span>
                                                        <span
                                                            className="hreflink pull-right" title="Edit Inline"
                                                            ng-click="EditContents(Task,'editableDueDate')">
                                                            <i className="fa fa-pencil siteColor" aria-hidden="true"></i>
                                                        </span>
                                                    </div>
                                                    <div className="tmvalue impact-info53" title="Priority of Task">
                                                        <label className="full_width">Priority</label>
                                                    </div>
                                                    <div className="tlvalue impact-infoII "
                                                    >
                                                        {data.map(item =>
                                                            <a>{item.Priority != null ? item.Priority : ""}</a>)}
                                                        <span
                                                            className="hreflink pull-right" title="Edit Inline"
                                                            ng-click="EditContents(Task,'editablePriority')">
                                                            <i className="fa fa-pencil siteColor" aria-hidden="true"></i>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-12 pad0">
                                                <div className="involve_actor">
                                                    <div className="tmvalue impact-info53">
                                                        <label className="full_width">Start Date</label>
                                                    </div>
                                                    <div className="tlvalue impact-infoII">
                                                        {data.map(item =>
                                                            <a>{item.StartDate != null ? Moment(item.StartDate).format('DD/MM/YYYY') : ""}</a>
                                                        )}
                                                        <span
                                                            className="hreflink pull-right" title="Edit Inline"
                                                            ng-click="EditContents(Task,'editableStartDate')">
                                                            <i className="fa fa-pencil siteColor" aria-hidden="true"></i>
                                                        </span>
                                                    </div>
                                                    <div className="tmvalue impact-info53">
                                                        <label className="full_width">Completion Date</label>
                                                    </div>
                                                    <div className="tlvalue impact-infoII"
                                                    >
                                                        {data.map(item =>
                                                            <a>{item.CompletedDate != null ? Moment(item.CompletedDate).format('DD/MM/YYYY') : ""}</a>)}
                                                        <span
                                                            className="hreflink pull-right" title="Edit Inline"
                                                        >
                                                            <i className="fa fa-pencil siteColor" aria-hidden="true"></i>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-12 pad0">
                                                <div className="involve_actor">
                                                    <div className="tmvalue impact-info53" title="Status">
                                                        <label className="full_width">Status</label>
                                                    </div>
                                                    <div className="tlvalue impact-infoII ">
                                                        {data.map(item => <a>{item.Status}</a>)}
                                                        
                                                    </div>
                                                    <div className="tmvalue impact-info53" title="Task Category">
                                                        <label className="full_width">Categories </label>
                                                    </div>
                                                    <div className="tlvalue impact-infoII ">
                                                        {data.map(item => <a>{item.Categories}</a>)}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-12 pad0">
                                                <div className="involve_actor blocks">
                                                    <div className="tmvalue impact-info53" title="Assigned Person">
                                                        <label className="full_width">Team Members</label>
                                                    </div>
                                                    <div className="tlvalue impact-infoII">
                                                        <span>
                                                            {/* <img className="AssignUserPhoto userimgsize1 " title="Pravesh Kumar" src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/PublishingImages/NewUsersImages/PraveshKumar.png" data-themekey="#" /> */}
                                                        </span>
                                                    </div>
                                                    <div className="tmvalue impact-info53" title="% Complete">
                                                        <label className="full_width">% Complete</label>
                                                    </div>
                                                    <div className="tlvalue impact-infoII "
                                                    >
                                                        {data.map(item => <a>{item.PercentComplete}</a>)}
                                                        <span className="pull-right">
                                                            <span className="pencil_icon">
                                                                <span ng-show="isOwner" className="hreflink"
                                                                    title="Edit Inline"
                                                                >
                                                                    <i className="fa fa-pencil" aria-hidden="true"></i>
                                                                </span>
                                                            </span>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-12 pad0">
                                                <div className="involve_actor ">
                                                    <div className="tmvalue" style={{ flexBasis: "20.5%"}}
                                                        title="Item Rank">
                                                        <label className="full_width">Item Rank</label>
                                                    </div>
                                                    <div className="tlvalue impact-infoII"
                                                    >
                                                        {data.map(item => <a>{item.ItemRank}</a>)}
                                                        <span className="pull-right">
                                                            <span className="hreflink"
                                                                title="Edit Inline"
                                                                ng-click="EditContents(Task,'editableItemRank')">
                                                                <i className="fa fa-pencil siteColor"
                                                                    aria-hidden="true"></i>
                                                            </span>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="col-lg-4 pad0">
                                        <div className="col-sm-12 pad0">
                                            <div className="involve_actor">
                                                <div ng-show="Task.Portfolio_x0020_Type=='Component'"
                                                    className="tmvalue impact-info53" title="ServicePortfolio">
                                                    <label className="full_width">Service Portfolio</label>
                                                </div>
                                                
                                                {data.map(item=>    
                                                 <>
                                                 {item.ServicePortfolio.Title != undefined &&
                                                <div ng-show="Task.Portfolio_x0020_Type=='Component'"
                                                    className="tlvalue impact-infoII ">
                                                        
                                                    <div className="hreflink block ng-binding">
                                                        <a className="hreflink block ng-binding" style={{border:"0px"}}target="_blank" href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=${item.ServicePortfolio.Id}`}>{item.ServicePortfolio.Title}</a>
                                                    </div>
                                                   
                                                </div>
                                                }
                                                </>
                                     ) }
                                            </div>
                                        </div>
                                        
                                        <div
                                            className="col-sm-12 pad0 dashboard-sm-12">
                                            <div className="panel panel-primary-head blocks"
                                                style={{ boxShadow: "none", transition: "none" }} id="t_draggable1">
                                                <div className="panel-heading profileboxclr clearfix"
                                                    style={{ backgroundColor: "#f5f5f5", padding: "7px" }}>
                                                    <a className="panel-title" >
                                                        
                                                        <span className="pull-left mr-5">
                                                          {/* {myarray.length!=0?myarray[0].map((items: any)=>  */}
                                                           {data.map(item =>
                                                                <span className="accordian-header" onClick={() => handleOpen3(item)}>
                                                                     <a className='hreflink'
                                                                        title="Tap to expand the childs">
                                                                        <span className="sign">{item.showk ? <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png" />
                                                                            : <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png" />}</span></a>
                                                                    <label className="lbltitleclr">
                                                        
                                                        Site
                                                        Composition
                                                    </label>
                                                    <a className="hreflink ng-scope" title="Analyse Site Composition" >
                                                        <img className="wid-20"  data-themekey="#" src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/analyze.png" />
                                                    </a>
                                                      
                                                                </span>
                                                           )}
                                                            {/* <span ng-if="Task.expanded2 &amp;&amp;Task.Portfolio_x0020_Type=='Component'" style={{ cursor: "pointer" }} ng-click="toggle2Smart(Task)" className="ng-scope">
                                                        <img style={{ width: "10px" }}  data-themekey="#" src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/24/list-icon.png" />
                                                        </span> */}
                                                        </span>



                                                    </a>
                                                </div>
                                                {data.map(item =>
                                                <div className='accordion-content'>
                                                {item.showk &&
                                                                           
                                                                           <ul className="list-unstyled mb-0 fortablee" style={{ fontWeight: "normal" }}>
                                                                           {myarray1.length!=0?myarray1.map((item: any)=>
                                                                               
                                                                                <li
                                                                                   className="SiteCompositionlist for-lis">
                                                                                   <div className="SiteCompositionlist-SiteImage" style={{width:"10%"}}>
                                                                                       <img style={{ width: "22px" }} src={item.SiteImages} data-themekey="#" />
                                                                                   </div>
                                                                                   <div style={{width:"15%"}} className="SiteCompositionlist-ClienTimeDescription">
                                                                                       {/* {{item.ClienTimeDescription.substring(0,2)}}% */}
                                                                                       {/* {data.map(item =><i>{item.ClienTimeDescription.substring(0,2)}%</i>)} */}
                                                                                       {(item.ClienTimeDescription!=undefined)&&
                                                                                       <span className="ng-binding">
                                                                                       {/* {item.ClienTimeDescription}% */}
                                                                                                 
                                                                                                   {parseInt(item.ClienTimeDescription)}%
                                                                                       
                                                                                       </span>
                                                                                }
                                                                                   </div>
                                                                                  {item.Title=='EPS' &&
                                                                                   <div 
                                                                                       className="SiteCompositionlist-ClientTitle">
                                                                                           {myarray2.length!=0? myarray2.map((client: any)=>{
                                                                                                       return( 
                                                                                       <div className="Members-Item">
                                                                                     
                                                                                           <div ng-show="client.siteName=='EPS'"
                                                                                               className="user-Member-img"
                                                                                               ng-repeat="client in Task.ClientCategory.results">
                                                                                                    {(client.Title=="Kontakt Verwaltung" ||client.Title==" Steuerungsbericht der Direktion"||client.Title== "Shareweb Maintenance"||client.Title== "Newsletter Einbindung"||client.Title=="PSE-Partnerschaften")  &&
                                                                                               <span> 
                                                                                                  
                                                                                                   {client.Title} 
                                                                                              
                                                                                                   </span>
                                                                                                   }
                                                                                           </div>
                                                                                       </div>
                                                                                   )
                                                                               }):""} 
                                                                                   </div>
                                                                                   }
                                                                                    {item.Title=='Education' &&
                                                                                   <div 
                                                                                       className="SiteCompositionlist-ClientTitle">
                                                                                           {myarray2.length!=0? myarray2.map((client: any)=>{
                                                                                                       return( 
                                                                                       <div className="Members-Item">
                                                                                     
                                                                                           <div 
                                                                                               className="user-Member-img"
                                                                                               ng-repeat="client in Task.ClientCategory.results">
                                                                                                    {(client.Title=="Contact Management" )  &&
                                                                                               <span> 
                                                                                                  
                                                                                                   {client.Title} 
                                                                                              
                                                                                                   </span>
                                                                                                   }
                                                                                           </div>
                                                                                       </div>
                                                                                   )
                                                                               }):""} 
                                                                                   </div>
                                                                                   }
                                                                                   {item.Title=='EI'&&
                                                                                   <div ng-show="item.Title=='EI'"
                                                                                       className="SiteCompositionlist-ClientTitle">
                                                                                            { myarray2.length!=0?myarray2.map((client: any)=>{
                                                                                               return(
                                                                                       <div className="Members-Item">
                                                                                           <div ng-show="client.siteName=='EI'"
                                                                                               className="user-Member-img"
                                                                                               ng-repeat="client in Task.ClientCategory.results">
                                                                                                     {(client.Title=="Nutzer Verwaltung" ||client.Title== "Shareweb Maintenance"||client.Title== "EI fachspezifische Aufgaben"||client.Title== "EI Projekt-Übersicht"||client.Title=="Mithilfe Zugriffsrechte-Konzepts") &&
                                                                                               <span> 
                                                                                                  
                                                                                                   {client.Title}
                                                                                                    </span>
                                                                                            }
                                                                                           </div>
                                                                                               
                                                                                       </div>
                                                                                          ) }):""} 
                                                                                   </div>
                                                                                   }
                                                                               </li>
                                                                           ):""}
                                                                           </ul>
                                                                      }
                                                </div>
                                                )}
                                            </div>
                                        </div>
                                        
                                        
                                    </div>
                                   
                                    
                                    {/*  Short Description */}
                                    {data.map(item =>
                                    <div className="col-sm-8 mt-10 pad0 teamdashboard_col-sm-12 ng-scope">
                                         
                                        {item.Short_x0020_Description_x0020_On !== null &&
                                         
                                         
                                        <div className="panel panel-default" id="t_draggable1">
                                            <div className="panel-heading">
                                           
                                                    <h3 className="panel-title">
                                                    <span className="accordian-header" onClick={() => handleOpen(item)}>
                                                            <span>
                                                            <a className='hreflink'
                                                  title="Tap to expand the childs">
                                                  <span className="sign">{item.show ? <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png" />
                                                      : <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png" />} </span>
                                                      </a>
                                                                <label htmlFor="identifier-3" className="no-padding">
                                                                    Short
                                                                    Description
                                                                </label>
                                                                
                                                                </span>
                                                           
                                                            </span>       
                                                            </h3>
                                                               
                                            </div>
                                            <div className="accordian-content">
                                                                 
                                                                 {item.show &&
                                                                     <div className="boxbdrdesign" id="testDiv1">
                                                                         {/* dangerouslySetInnerHTML={{__html: item.Short_x0020_Description_x0020_On}} */}
                                                                         {data.map(item =>
                                                                     <span className="ng-binding" dangerouslySetInnerHTML={{__html: item.Short_x0020_Description_x0020_On}}>
                                                                          {/* {data.map(item => <a>{item.Short_x0020_Description_x0020_On}</a>)}  */}
                                                                          </span>)}
                                                                     </div>
                                                                     }
                                                                 
                                                            
                                                     </div>
                                           
                                        </div>
                                        
                                       
                                        }
                                        
                                        </div>
                                        )}
                                    
                                    {/* Background */}
                                    {data.map(item =>
                                    <div className="col-sm-8 pad0 teamdashboard_col-sm-12 ng-scope">
                                         {item.Background !== null &&
                                        <div className="panel panel-default" id="t_draggable1">
                                            <div className="panel-heading">
                                                
                                                    <h3 className="panel-title">
                                                    <span className="accordian-header" onClick={() => handleOpen1(item)}>
                                                            <span>
                                                                
                                                            <a className='hreflink'
                                                  title="Tap to expand the childs">
                                                  <span className="sign">{item.showl ? <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png" />
                                                      : <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png" />} </span>
                                                      </a>
                                                                <label htmlFor="identifier-3" className="no-padding ng-binding" ng-bind-html="GetColumnDetails('Background') | trustedHTML">Background</label>
                                                                
                                                                            </span>
                                                                            </span>
                                                                           
                                                                      
                                                               
                                                      
                                                    </h3>
                                               
                                            </div>
                                            <div className="accordian-content">
                                                                   
                                                                   {item.showl &&
                                                                           <div className="boxbdrdesign" id="testDiv1">
                                                                           <span className="ng-binding" >{data.map(item =>  <a>{item.Background}</a>)}</span>
                                                                           </div>
                                                                           }
                                                                      
                                                                   </div>
                                        </div>
                                          }
                                          
                                    </div>
                                    
                                    )}
                                     
                                    {/* Idea */}
                                    {data.map(item =>
                                    <div className="col-sm-8 pad0 teamdashboard_col-sm-12 ng-scope">
                                        {item.Idea !== null &&
                                        <div className="panel panel-default" id="t_draggable1">
                                            <div className="panel-heading">
                                                
                                                    <h3 className="panel-title">
                                                    <span className="accordian-header" onClick={() => handleOpen2(item)}>
                                                            <span>
                                                                
                                                            <a className='hreflink'
                                                  title="Tap to expand the childs">
                                                  <span className="sign">{item.shows ? <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png" />
                                                      : <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png" />} </span>
                                                      </a>
                                                                <label htmlFor="identifier-3" className="no-padding ng-binding" ng-bind-html="GetColumnDetails('Idea') | trustedHTML">Idea</label>
                                                              
                                                                
                                                                </span>
                                                            </span>
                                                       
                                                    </h3>
                                                
                                            </div>
                                            <div className="accordian-content">
                                                                   
                                                                   {item.shows &&
                                                                           <div className="boxbdrdesign" id="testDiv1">
                                                                           <span className="ng-binding" >{data.map(item =>  <a>{item.Idea}</a>)}</span>
                                                                           </div>
                                                                           }
                                                                      
                                                                   </div>
                                        </div>
                                        }
                                        
                     
                                </div>
                                )}

                                               
                                {/* Value Added */}

                                  
                                {data.map(item =>
                                    <div className="col-sm-8 pad0 teamdashboard_col-sm-12 ng-scope">
                                        {item.ValueAdded !== null &&
                                        <div className="panel panel-default" id="t_draggable1">
                                            <div className="panel-heading">
                                               
                                                    <h3 className="panel-title">
                                                    <span className="accordian-header" onClick={() => handleOpen4(item)}>
                                                            <span>
                                                            <a className='hreflink'
                                                  title="Tap to expand the childs">
                                                  <span className="sign">{item.showj ? <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png" />
                                                      : <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png" />} </span>
                                                      </a>
                                                                <label htmlFor="identifier-3" className="no-padding">
                                                                Value Added
                                                                </label>
                                                               
                                                                        
                                                                </span>
                                                            </span></h3>
                                               
                                            </div>
                                            <div className="accordion-content">
                                                                {item.showj &&
                                                                                    <div className="boxbdrdesign" id="testDiv1">
                                                                                  
                                                                                        <span className="ng-binding" > {data.map(item =><a>{item.ValueAdded}</a>)} </span> 
                                                                                    </div>
}
                                                                            </div>
                                        </div>
                                        }
                                    </div>
                                     )}



{/* Deliverables */}
{data.map(item =>
                                    <div className="col-sm-8 pad0 teamdashboard_col-sm-12 ng-scope">
                                        {item.Deliverables !== null &&
                                        <div className="panel panel-default" id="t_draggable1">
                                            <div className="panel-heading">
                                               
                                                    <h3 className="panel-title">
                                                    <span className="accordian-header" onClick={() => handleOpen5(item)}>
                                                            <span>
                                                            <a className='hreflink'
                                                  title="Tap to expand the childs">
                                                  <span className="sign">{item.showm ? <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png" />
                                                      : <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png" />} </span>
                                                      </a>
                                                                <label htmlFor="identifier-3" className="no-padding">
                                                                Deliverables
                                                                </label>
                                                                
                                                                       
                                                                
                                                            </span>
                                                            </span></h3>
                                               
                                            </div>
                                            <div className="accordion-content">
                                                                {item.showm &&
                                                                                    <div className="boxbdrdesign" id="testDiv1">
                                                                                    {data.map(item => 
                                                                                        <span className="ng-binding" dangerouslySetInnerHTML={{__html: item.Deliverables}}></span>)}
                                                                                    </div>}
                                                                                
                                                                            </div>
                                        </div>
                                        }
                                    </div>
                                     )}

                            </div>
                        </div>
                        </div>
                        <div className='col-sm-3 padL-25 mt60' >
                            <div className="panel panel-default">
                                <div className="panel-heading">
                                    <h3 className="panel-title">
                                        Smart Information
                                        <span className="panel-title-right">
                                            <Tooltip />
                                        </span>
                                    </h3>
                                </div>
                                <div id="updateId" className="panel-body">
                                    <ul className="SmartNotes-ContractPanel customlist-style1 list-unstyled">
                                    </ul>
                                    <a className="pull-right mr-5 " title="+ Add SmartInformation" ng-click="editSmartInfoItem(item,'add')">+ Add SmartInformation</a>
                                </div>
                            </div>
                            {/* Add and Connect */}
                            <div className="panel panel-default displayhide  ng-scope" ng-if="isOwner==true">
                                <div className="panel-heading">
                                    <label className="blue-clr">
                                        Add &amp; Connect Tool
                                    </label>
                                    <span className="addtoggle pull-right">
                                        <span className="dropdown">
                                            <Tooltip />
                                        </span>
                                    </span>
                                </div>
                                <div className="panel-body">
                                    <div className=" col-sm-12 Doc-align inner-tabb">
                                        <a className="hreflink padding-left" ng-click="TagItems();">
                                            Click here to add more content
                                        </a>
                                        <div className="clearfix"></div>
                                    </div>
                                </div>
                            </div>
                            {/* Main Folder */}
                            
                            <div className="panel panel-default displayhide mt-25 ng-scope" ng-show="Folders!=undefined" ng-if="isOwner==true">
                                <div className="panel-heading" title="Main Folder">
                                    <label className="full_width blue-clr">
                                        Main Folder
                                        <span className="addtoggle pull-right">
                                            <span className="dropdown">
                                                <Tooltip />
                                            </span>
                                        </span>
                                    </label>
                                </div>
                                <div className="panel-body">
                                    <div style={{ width: "100%" }} className="panel1 panel-default">
                                        <div className="col-sm-12 padL-0 mb-10">
                                        {data.map(item =>
                                            <div className="col-sm-12 pad0">
                                                <img ng-src="/_layouts/15/images/folder.gif?rev=23" data-themekey="#" src="/_layouts/15/images/folder.gif?rev=23" />
                                            <a className="hreflink ng-binding" target="_blank"  href={`/sites/HHHH/SP/Documents/COMPONENT-PORTFOLIO/${item.Title}`}>
                                            {item.Title}
                                                </a>
                                            </div>
)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Comment */}
                            <div className="panel panel-default mt-25">
                                <div className="panel-heading">
                                    <h3 className="panel-title">Comments
                                        <span className="panel-title-right">
                                            <Tooltip />
                                        </span>
                                    </h3>
                                </div>
                                <div className="panel-body">
                                    <div className="TopRecipients">
                                        <span className="mt-2 mr-5"> <strong>To:</strong>  </span>
                                        <span className="Recipients ng-scope" ng-repeat="item in UserForQuickComment">
                                            <a className="hreflink" target="_blank">
                                                <img className="circularImage" title="Deepak Trivedi" data-toggle="popover" data-trigger="hover" src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/PublishingImages/Portraits/portrait_Deepak.jpg" data-themekey="#" />
                                            </a>
                                        </span>
                                        <span className="Recipients ng-scope" ng-repeat="item in UserForQuickComment">
                                            <a className="hreflink" target="_blank">
                                                <img ng-show="item.Item_x0020_Cover!=undefined || item.Item_x0020_Cover!= null" className="circularImage" title="Stefan Hochhuth" data-toggle="popover" data-trigger="hover" ng-click="topCommentrs(item)" ng-src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/PublishingImages/Portraits/portrait_Stefan.jpg" src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/PublishingImages/Portraits/portrait_Stefan.jpg" data-themekey="#" />
                                            </a>
                                        </span>
                                        <span className="Recipients ng-scope" ng-repeat="item in UserForQuickComment">
                                            <a className="hreflink" target="_blank">
                                                <img ng-show="item.Item_x0020_Cover!=undefined || item.Item_x0020_Cover!= null" className="circularImage" title="Robert Ungethuem" data-toggle="popover" data-trigger="hover" ng-click="topCommentrs(item)" ng-src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/PublishingImages/NewUsersImages/Robert%20Ungethuem.png" src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/PublishingImages/NewUsersImages/Robert%20Ungethuem.png" data-themekey="#" />
                                            </a>
                                        </span>
                                        <span className="Recipients ng-scope">
                                            <a className="hreflink" target="_blank">
                                                <img className="circularImage" title="Mattis Hahn" data-toggle="popover" src='https://hhhhteams.sharepoint.com/sites/HHHH/SP/PublishingImages/Portraits/portrait_Mattis_Hahn.jpg' data-trigger="hover" data-themekey="#" />
                                            </a>
                                        </span>
                                        <span className="RecipientsNameField mt-0  mb-5" style={{ position: "absolute", width: "48%" }}>
                                            <textarea style={{ height: "26px" }} placeholder="Recipients Name" className="form-control ng-pristine ng-untouched ng-valid ng-empty ui-autocomplete-input" id="portfolioprofile"></textarea><span role="status" aria-live="polite" className="ui-helper-hidden-accessible"></span>
                                        </span>
                                    </div>
                                    <div className="RecipientsCommentsField ">
                                        <textarea style={{ height: "76px", marginTop: "10px" }} className="form-control ui-autocomplete-input ng-pristine ng-untouched ng-valid ng-empty" placeholder="Enter your comments here"  ></textarea>
                                        {/* <p className="ng-hide">
                                            <i className="fa fa-exclamation-circle" aria-hidden="true"></i>
                                            Comment shouldn't be empty
                                        </p> */}
                                        <button title="Post comment" type="button" className="btn btn-primary pull-right mt-5 mb-5">
                                            Post
                                        </button>
                                    </div>
                                    <div className="clearfix"></div>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="TableContentSection">
                    <div className="container-fluid">
                        <section className="TableSection">
                            <div className="container">
                            {/* {data.map(item => (
                                <Groupbyt  title={item.Title} level={item.PortfolioLevel}/>))} */}
                                {/* <Groupby/> */}
                                {data.map(item => (
                                // <Groupby Id={item.Id} level={item.PortfolioLevel}/>
                                <ComponentTable props={item.Title}/>
                                ))}
                            </div>

                        </section>
                    </div>
                </section>
                <div className="col-sm-12 pad0">
                    <div className="col-sm-6 padL-0 ItemInfo mb-20" style={{ paddingTop: "15px" }}>
                        <div>
                            Created <span></span> by <span className="footerUsercolor"></span>
                            {/* {{DateCreated}}  {{Author}}*/}
                        </div>
                        <div>
                            Last modified <span></span> by <span className="footerUsercolor"></span>
                            {/* {{ModifiedDate}} {{Editor}}*/}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Portfolio;