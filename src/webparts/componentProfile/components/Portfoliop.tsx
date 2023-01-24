import * as React from 'react';
import * as $ from 'jquery';
import Modal from 'react-bootstrap/Modal';
var TypeSite: string;
// if(TypeSite=="Service"){
//     require('../../cssFolder/sitecolorservice.scss');
// }
// if(TypeSite=="Component"){
//     require('../../cssFolder/site_color.scss');
// }
import { Web } from 'sp-pnp-js';
import * as Moment from 'moment';
// import Groupby from './TaskWebpart';
import Tooltip from '../../../globalComponents/Tooltip';

import { FaHome } from 'react-icons/fa';
import { IoMdArrowDropright, IoMdArrowDropdown } from 'react-icons/io';
import { SPComponentLoader } from '@microsoft/sp-loader';
// import { NavItem } from 'react-bootstrap';
import CommentCard from '../../../globalComponents/Comments/CommentCard';
import Smartinfo from './NextSmart';
import EditInstituton from '../../EditPopupFiles/EditComponent';
import ComponentTable from './Taskwebpart';



var TeamMembers: any = [];
var AssigntoMembers: any = [];

var AllTeamMember:any = [];
var AssignTeamMember:any = [];
function Portfolio({ ID }: any) {
    const [data, setTaskData] = React.useState([]);
    const [isActive, setIsActive] = React.useState(false);
    const [array, setArray] = React.useState([])
    const [datas, setdatas] = React.useState([])
    const [datam, setdatam] = React.useState([])
    const [datak, setdatak] = React.useState([])
    const [dataj, setdataj] = React.useState([])
    const [datams, setdatams] = React.useState([])
    const [datamb, setdatamb] = React.useState([])
    const [FolderData, SetFolderData] = React.useState([]);
    const [IsComponent, setIsComponent] = React.useState(false);
    const [SharewebComponent, setSharewebComponent] = React.useState('');
    const [showBlock, setShowBlock] = React.useState(false);
    const [IsTask, setIsTask] = React.useState(false);
    const [AllTaskuser, setAllTaskuser] = React.useState([]);
    const handleOpen = (item: any) => {
        setIsActive(current => !current);
        setIsActive(false);
        item.show = item.show == true ? false : true;
        setArray(array => ([...array]));
    };
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
    const handleOpen6 = (item: any) => {
        setIsActive(current => !current);
        setIsActive(true);
        item.showm = item.showb = item.showb == true ? false : true;
        setdatamb(datamb => ([...datamb]));
    };
    React.useEffect(() => {
        var folderId: any = "";
        var url = `https://hhhhteams.sharepoint.com/sites/HHHH/SP/_api/lists/getbyid('EC34B38F-0669-480A-910C-F84E92E58ADF')/items?$select=ItemRank,Item_x0020_Type,Portfolio_x0020_Type,Site,FolderID,PortfolioLevel,PortfolioStructureID,ValueAdded,Idea,TaskListName,TaskListId,WorkspaceType,CompletedDate,ClientActivityJson,ClientSite,Item_x002d_Image,Sitestagging,SiteCompositionSettings,TechnicalExplanations,Deliverables,ComponentPortfolio/Id,ComponentPortfolio/Title,ServicePortfolio/Id,Author/Id,Author/Title,Editor/Id,Editor/Title,ServicePortfolio/Title,Package,Short_x0020_Description_x0020_On,Short_x0020_Description_x0020__x,Short_x0020_description_x0020__x0,Admin_x0020_Notes,AdminStatus,Background,Help_x0020_Information,BasicImageInfo,Item_x0020_Type,AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,Component/Id,Component/Title,Component/ItemType,Component/ItemType,Categories,FeedBack,component_x0020_link,FileLeafRef,Title,Id,Comments,StartDate,DueDate,Status,Body,Company,Mileage,PercentComplete,FeedBack,Attachments,Priority,Created,Modified,PermissionGroup/Id,PermissionGroup/Title,Team_x0020_Members/Id,Team_x0020_Members/Title,Services/Id,Services/Title,Services/ItemType,Parent/Id,Parent/Title,Parent/ItemType,SharewebCategories/Id,SharewebCategories/Title,ClientCategory/Id,ClientCategory/Title&$expand=Author,Editor,ClientCategory,ComponentPortfolio,ServicePortfolio,Parent,AssignedTo,Services,Team_x0020_Members,Component,PermissionGroup,SharewebCategories&$filter=Id eq ${ID}&$top=4999`;
        var response: any = [];
        var responsen: any = []; // this variable is used for storing list items
        function GetListItems() {
            $.ajax({
                url: url,
                method: "GET",
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (data) {
                    response = response.concat(data.d.results);
                    response.map((item: any) => {
                        if (item.FolderID != undefined) {
                            folderId = item.FolderID;
                            var urln = `https://hhhhteams.sharepoint.com/sites/HHHH/SP/_api/lists/getbyid('d0f88b8f-d96d-4e12-b612-2706ba40fb08')/items?$select=Id,Title,FileDirRef,FileLeafRef,ServerUrl,FSObjType,EncodedAbsUrl&$filter=Id eq ${folderId}`;
                            $.ajax({
                                url: urln,
                                method: "GET",
                                headers: {
                                    "Accept": "application/json; odata=verbose"
                                },
                                success: function (data) {
                                    responsen = responsen.concat(data.d.results);
                                    if (data.d.__next) {
                                        urln = data.d.__next;
                                    } else SetFolderData(responsen);
                                    // console.log(responsen);
                                },
                                error: function (error) {
                                    console.log(error);
                                    // error handler code goes here
                                }
                            });
                        }
                        // console.log(folderId)
                    })
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
        var urln = `https://hhhhteams.sharepoint.com/sites/HHHH/SP/_api/lists/getbyid('d0f88b8f-d96d-4e12-b612-2706ba40fb08')/items?$select=Id,Title,FileDirRef,FileLeafRef,ServerUrl,FSObjType,EncodedAbsUrl&$filter=Id eq ${folderId}`;
        var responsen: any = [];// this variable is used for storing list items
        GetListItems();
        getTaskUser();
        open();
    },
        []);

    // Get All User
     
    const getTaskUser=async()=>{
        const web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/SP');
         await web.lists.getById('b318ba84-e21d-4876-8851-88b94b9dc300').items
         .orderBy("Created", true)
         .get()
         .then((Data: any[])=>{
            console.log(Data);
            
            setAllTaskuser(Data);
         }) 
         .catch((err) => {
               console.log(err.message);
            });
         }
    function open() {
        data.map((item: any) => {
            handleOpen(item);
            handleOpen1(item);
            handleOpen2(item);
            handleOpen3(item);
            handleOpen4(item);
        })
    }
    var myarray: any = [];
    var myarray1: any = [];
    var myarray2: any = [];
    var myarray3: any = [];
    var FolderID: any = '';
    data.map(item => {
        if (item.Portfolio_x0020_Type != undefined) {
            TypeSite = item.Portfolio_x0020_Type
        }

       if(item.Team_x0020_Members.results != undefined ){
            AllTaskuser.map(users=>{
                
                item.Team_x0020_Members.results.map((members:any)=>{
                    if(members.Id!=undefined){
                         if(users.AssingedToUserId == members.Id){
                        TeamMembers.push(users); }
                    }
                    
                })
          
                
            })
            // console.log(TeamMembers);
            
       }
        if(item.AssignedTo.results != undefined ){
            AllTaskuser.map(users=>{
                item.AssignedTo.results.map((members:any)=>{
                   
                         if(users.AssingedToUserId == members.Id){
                            AssigntoMembers.push(users);
                        
                     }
                    
                    
                })
                
            })
            // console.log(AssigntoMembers);
            
        }
        if (item.Sitestagging != null) {
            myarray.push(JSON.parse(item.Sitestagging));
        }
        if (myarray.length != 0) {
            myarray[0].map((items: any) => {
                if (items.SiteImages != undefined && items.SiteImages != '') {
                    items.SiteImages = items.SiteImages.replace('https://www.hochhuth-consulting.de', 'https://hhhhteams.sharepoint.com/sites/HHHH')
                    myarray1.push(items)
                }
                // console.log(myarray1);
                // if (items.ClienTimeDescription != undefined) {
                //     items.ClienTimeDescription = parseFloat(item.ClienTimeDescription);
                //     myarray1.push(items)
                // }
            })
        }
        if (item.ClientCategory.results.length != 0) {
            item.ClientCategory.results.map((terms: any) => {
                //     if(myarray2.length!=0 && myarray2[0].title==terms.title){
                //                ""
                //     }else{
                //    myarray2.push(terms);
                // }
                myarray2.push(terms);
            })
        }

         
        myarray3 = myarray2.reduce(function(previous:any, current:any){
        var alredyExists = previous.filter(function(item:any){
            return item.Id === current.Id
        }).length > 0
        if(!alredyExists){
            previous.push(current)
        }
        return previous
    }, [])


    myarray3.sort((a:any, b:any) => a.Id - b.Id);
        //    const letters = new Set([myarray2]);
        console.log(myarray3)
        console.log(myarray1)
        // myarray.push();
    })
    //    Get Folder data
    const [lgShow, setLgShow] = React.useState(false);
    const handleClose = () => setLgShow(false);

    const EditComponentPopup = (item: any) => {
        // <ComponentPortPolioPopup ></ComponentPortPolioPopup>
        setIsComponent(true);
        setSharewebComponent(item);
        // <ComponentPortPolioPopup props={item}></ComponentPortPolioPopup>
    }
    const Call = React.useCallback((item1) => {
        setIsComponent(false);
        setIsTask(false);
    }, []);


    //  Remove duplicate values
    // const UniqueArray = [...TeamMembers, ...AssigntoMembers];
    
     AllTeamMember = TeamMembers.reduce(function(previous:any, current:any){
        var alredyExists = previous.filter(function(item:any){
            return item.Id === current.Id
        }).length > 0
        if(!alredyExists){
            previous.push(current)
        }
        return previous
    }, [])

    AssignTeamMember = AssigntoMembers.reduce(function(previous:any, current:any){
        var alredyExists = previous.filter(function(item:any){
            return item.Id === current.Id
        }).length > 0
        if(!alredyExists){
            previous.push(current)
        }
        return previous
    }, [])

   console.log(AllTeamMember)
     
   

   function handleSuffixHover(){
    setShowBlock(true)
  }

  function handleuffixLeave(){
    
    setShowBlock(false)
  }
    return (
        <div className={TypeSite == 'Service' ? 'serviepannelgreena' : ""}>
            {/* breadcrumb & title */}
            <section>
                <div className='col'>
                    <div className='d-flex justify-content-between p-0' >
                        <ul className="spfxbreadcrumb m-0 p-0">
                            <li><a href='#'><FaHome /> </a></li>
                            {data.map((item: any) => {
                                return (
                                    <>
                                        <li>
                                            {/* if="Task.Portfolio_x0020_Type=='Component'  (Task.Item_x0020_Type=='Component Category')" */}
                                            {item.Portfolio_x0020_Type != undefined &&
                                                <a target='_blank' data-interception="off"
                                                    href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/${item.Portfolio_x0020_Type}-Portfolio-SPFx.aspx`}>
                                                    {item.Portfolio_x0020_Type}-Portfolio
                                                </a>
                                            }
                                        </li>
                                        {item.Item_x0020_Type=='SubComponent' && 
                                        <li>
                                            {/* if="Task.Portfolio_x0020_Type=='Component'  (Task.Item_x0020_Type=='Component Category')" */}
                                            {item.Parent != undefined &&
                                                <a target='_blank' data-interception="off"
                                                    href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=${item.Parent.Id}`}>
                                                    {item.Parent.Title}
                                                </a>
                                            }
                                        </li>
                                        }

                                        <li><a>{item.Title}</a></li>
                                    </>
                                )
                            })}
                        </ul>
                        <span className="text-end"><a target='_blank' data-interception="off"  href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=${ID}`}>Old Portfolio profile page</a></span>
                    </div>
                </div>
                <div className='col'>
                    <div className='p-0' style={{ verticalAlign: "top" }}>
                        {data.map(item =>
                        <>
                            <h2 className='heading'>
                                {item.Portfolio_x0020_Type == 'Component' && item.Item_x0020_Type=='SubComponent'&&
                                <>
                                     <img className='client-icons' src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/subComponent_icon.png" />    <a>{item.Title}</a>   <span> <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif" onClick={(e) => EditComponentPopup(item)} /> 
                  
                                     </span>
                                  </>   
                                }
                                 {item.Portfolio_x0020_Type == 'Service' && item.Item_x0020_Type=='SubComponent'&&
                                <>
                                     <img className='client-icons' src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/subcomponent_icon.png" />    <a>{item.Title}</a>   <span> <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif" onClick={(e) => EditComponentPopup(item)} /> 
                  
                                     </span>
                                  </>   
                                }
                                {item.Portfolio_x0020_Type == 'Component' && item.Item_x0020_Type!='SubComponent' &&
                                    <>
                                        <img className='client-icons' src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/component_icon.png" />    <a>{item.Title}</a>   <span> <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif" onClick={(e) => EditComponentPopup(item)} /> 
                  
                  </span>
                                        
                                    </>
                                }
                                {item.Portfolio_x0020_Type == 'Service' && item.Item_x0020_Type!='SubComponent' && 
                                    <>
                                        <img className='client-icons' src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/component_icon.png" />  <a>{item.Title}</a>   <span> <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif" onClick={(e) => EditComponentPopup(item)} /> 
                  
                  </span>
                                        

                                    </>}
                            </h2>
                            
                            </>
                        )}
                    </div>
                </div>
              
            </section>
            {/* left bar  & right bar */}
            <section>
                <div className='row'>
                    <div className='col-md-9 bg-white'>
                        <div className='team_member row  py-2'>
                            <div className='col-md-4 pe-0'>
                                <dl>
                                    <dt className='bg-fxdark'>Due Date</dt>
                                    <dd className='bg-light'>
                                        <span>
                                            {/* <i> 02/12/2019</i> */}
                                            {data.map(item =>
                                                <a>{item.DueDate != null ? Moment(item.DueDate).format('DD/MM/YYYY') : ""}</a>
                                            )}
                                            {/* {data.map(item =>  <i>{item.DueDate}</i>)} */}
                                        </span>
                                       
                                    </dd>
                                </dl>
                                <dl>
                                    <dt className='bg-fxdark'>Start Date</dt>
                                    <dd className='bg-light'>
                                        {data.map(item =>
                                            <a>{item.StartDate != null ? Moment(item.StartDate).format('DD/MM/YYYY') : ""}</a>
                                        )}
                                       
                                    </dd>
                                </dl>
                                <dl>
                                    <dt className='bg-fxdark'>Status</dt>
                                    <dd className='bg-light'>{data.map(item => <a>{item.Status}</a>)}</dd>
                                </dl>
                                <dl>
                                    <dt className='bg-fxdark'>Team Members</dt>
                                    <dd className='bg-light d-flex'>
                                        {AssignTeamMember.length!=0?AssignTeamMember.map((item:any)=>
                                    <>
                                            <a  target='_blank' data-interception="off" href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/TeamLeader-Dashboard.aspx?UserId=${item.AssingedToUserId}&Name=${item.Title}`}>
                                             <img className='AssignUserPhoto' src={item.Item_x0020_Cover.Url} title={item.Title} />
                                            </a>
                                           
                                            </>
                                    ):""}
                                     <div className='px-1'>|</div>
                                            {AllTeamMember != null && AllTeamMember.length > 0 &&
                  <div className="user_Member_img"><a href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/TeamLeader-Dashboard.aspx?UserId=${AllTeamMember[0].Id}&Name=${AllTeamMember[0].Title}`} target="_blank" data-interception="off"><img className="imgAuthor" src={AllTeamMember[0].Item_x0020_Cover.Url} title={AllTeamMember[0].Title}></img></a></div>                        
                }
                {AllTeamMember != null && AllTeamMember.length > 1 &&
                  <div className="user_Member_img_suffix2 multimember" onMouseOver={(e) =>handleSuffixHover()} onMouseLeave={(e) =>handleuffixLeave()}>+{AllTeamMember.length - 1}
                   {showBlock &&
                    <span className="tooltiptext" >
                      <div>                        
                          { AllTeamMember.slice(1).map( (rcData:any,i:any)=> {
                            
                            return  <div className="team_Members_Item" style={{padding: '2px'}}>
                              <div><a href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/TeamLeader-Dashboard.aspx?UserId=${rcData.Id}&Name=${rcData.Title}`} target="_blank" data-interception="off">
                                <img className="imgAuthor" src={rcData.Item_x0020_Cover.Url}></img></a></div>
                              <div>{rcData.Title}</div>
                            </div>
                                                    
                          })
                          }
                       
                      </div>
                    </span>
                    }
                  </div>                        
                }   
                                            {/* {AllTeamMember.length!=0?AllTeamMember.map((member:any)=>
                                            <>
                                                    <a  target='_blank' data-interception="off" href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/TeamLeader-Dashboard.aspx?UserId=${member.AssingedToUserId}&Name=${member.Title}`}>
                                                    <img className='AssignUserPhoto' src={member.Item_x0020_Cover.Url} title={member.Title} />
                                                   </a>
                                            </>
                                            ):""} */}

                                  </dd>
                                </dl>
                                <dl>
                                    <dt className='bg-fxdark'>Item Rank</dt>
                                    <dd className='bg-light'>
                                        {data.map(item => <a>{item.ItemRank}</a>)}
                                       
                                    </dd>
                                </dl>
                            </div>
                            <div className='col-md-4 p-0'>
                                <dl>
                                    <dt className='bg-fxdark'>Priority</dt>
                                    <dd className='bg-light'>
                                        {data.map(item =>
                                            <a>{item.Priority != null ? item.Priority : ""}</a>)}
                                       
                                    </dd>
                                </dl>
                                <dl>
                                    <dt className='bg-fxdark'>Completion Date</dt>
                                    <dd className='bg-light'>
                                        {data.map(item =>
                                            <a>{item.CompletedDate != null ? Moment(item.CompletedDate).format('DD/MM/YYYY') : ""}</a>)}
                                      
                                    </dd>
                                </dl>
                                <dl>
                                    <dt className='bg-fxdark'>Categories</dt>
                                    <dd className='bg-light text-break'>{data.map(item => <a>{item.Categories}</a>)}</dd>
                                </dl>
                                <dl>
                                    <dt className='bg-fxdark'>% Complete</dt>
                                    <dd className='bg-light'>
                                        {data.map(item => <a>{(item.PercentComplete * 100).toFixed(0) }</a>)}
                                       
                                    </dd>
                                </dl>
                                {data.map((item: any) => {
                                    return (
                                        <>
                                            {item.Parent.Title != undefined &&
                                                <dl>
                                                    <dt className='bg-fxdark'>Parent</dt>
                                                    <dd className='bg-light'>
                                                        <a target='_blank' data-interception="off" href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile-SPFx.aspx?taskId=${item.Parent.Id}`}>{item.Parent.Title}</a>
                                                        <span className="pull-right">
                                                            <span className="pencil_icon">
                                                                <span className="hreflink"
                                                                    
                                                                >
                                                                       {item.Portfolio_x0020_Type == 'Component' &&
                                    <>
                                        <a target="_blank" data-interception="off" href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Component-Portfolio.aspx?ComponentID=${item.Parent.Id}`}><img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif" />    </a> 
                                        
                                    </>
                                }
                                {item.Portfolio_x0020_Type == 'Service' &&
                                    <>
                                       <a target="_blank" data-interception="off" href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Service-Portfolio.aspx?ComponentID=${item.Parent.Id}`}> <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif" /> </a> 
                                        

                                    </>}
                                                                 
                                                                </span>
                                                            </span>
                                                        </span>
                                                    </dd>
                                                </dl>
                                            }
                                        </>)
                                })}
                            </div>
                            <div className='col-md-4 p-0'>
                                {data.map((item: any) => {
                                    return (
                                        <>
                                            {item.Portfolio_x0020_Type == "Component" &&
                                                <dl>
                                                    <dt className='bg-fxdark'>Service Portfolio</dt>
                                                    <dd className='bg-light'><a style={{ border: "0px" }} target='_blank' data-interception="off" href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=${item.ServicePortfolio.Id}`}>{item.ServicePortfolio.Title}</a></dd>
                                                </dl>
                                            }
                                            {item.Portfolio_x0020_Type == "Service" &&
                                                <dl>
                                                    <dt className='bg-fxdark'>Component Portfolio</dt>
                                                    <dd className='bg-light'><a style={{ border: "0px" }} target='_blank' data-interception="off" href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=${item.ComponentPortfolio.Id}`}>{item.ComponentPortfolio.Title}</a></dd>
                                                </dl>
                                            }
                                        </>
                                    )
                                })}
                                {myarray1.length != 0 &&
                                    <dl className='Sitecomposition'>
                                        <div className="dropdown">
                                            {data.map(item =>
                                                <a className="sitebutton  bg-fxdark  p-0" title="Tap to expand the childs" onClick={() => handleOpen3(item)} >
                                                    <span className="sign">{item.showk ? <IoMdArrowDropdown /> : <IoMdArrowDropright />}</span>  Site Composition
                                                </a>
                                            )}
                                            {data.map(item =>
                                                <>
                                                    {item.showk &&
                                                        <div className='spxdropdown-menu'>
                                                            <ul>
                                                                {myarray1.map((item: any) =>
                                                                    <li className="dropdown-item">
                                                                        <span>
                                                                            <img style={{ width: "22px" }} src={item.SiteImages} data-themekey="#" />
                                                                        </span>
                                                                        <span >
                                                                            {/* {{item.ClienTimeDescription.substring(0,2)}}% */}
                                                                            {/* {data.map(item =><i>{item.ClienTimeDescription.substring(0,2)}%</i>)} */}
                                                                            {(item.ClienTimeDescription != undefined) &&
                                                                                <span className="ng-binding">
                                                                                    {/* {item.ClienTimeDescription}% */}
                                                                                    {parseInt(item.ClienTimeDescription)}%
                                                                                </span>
                                                                            }
                                                                        </span>
                                                                        {item.Title == 'EPS' &&
                                                                            <span>
                                                                                {myarray3.length != 0 ? myarray3.map((client: any) => {
                                                                                    return (
                                                                                        <div className="Members-Item">
                                                                                            <div className="user-Member-img"   >
                                                                                            {(client.Id>340 && client.Id<420 ) &&
                                                                                                   <span>
                                                                                                        {client.Title}
                                                                                                    </span>
                                                                                             }
                                                                                            </div>
                                                                                        </div>
                                                                                    )
                                                                                }) : ""}
                                                                            </span>
                                                                        }
                                                                        {item.Title == 'Education' &&
                                                                            <span>
                                                                                {myarray3.length != 0 ? myarray3.map((client: any) => {
                                                                                    return (
                                                                                        <div className="Members-Item">
                                                                                            <div className="user-Member-img">
                                                                                            {(client.Id>609 && client.Id<631 ) &&
                                                                                                <span>
                                                                                                        {client.Title}
                                                                                                    </span>
                                                                                }
                                                                                            </div>
                                                                                        </div>
                                                                                    )
                                                                                }) : ""}
                                                                            </span>
                                                                        }
                                                                        {item.Title == 'EI' &&
                                                                            <span  >
                                                                                {myarray3.length != 0 ? myarray3.map((client: any) => {
                                                                                    return (
                                                                                        <div className="Members-Item">
                                                                                            <div className="user-Member-img"
                                                                                            >
                                                                                                {(client.Id>419 && client.Id<435 ) &&
                                                                                                    <span>
                                                                                                        {client.Title}
                                                                                                    </span>
                                                                                                }
                                                                                            </div>
                                                                                        </div>
                                                                                    )
                                                                                }) : ""}
                                                                            </span>
                                                                        }
                                                                          {item.Title == 'Migration' &&
                                                                            <span  >
                                                                                {myarray3.length != 0 ? myarray3.map((client: any) => {
                                                                                    return (
                                                                                        <div className="Members-Item">
                                                                                            <div className="user-Member-img"
                                                                                            >
                                                                                                {(client.Id>630 && client.Id<640 ) &&
                                                                                                    <span>
                                                                                                        {client.Title}
                                                                                                    </span>
                                                                                                }
                                                                                            </div>
                                                                                        </div>
                                                                                    )
                                                                                }) : ""}
                                                                            </span>
                                                                        }
                                                                    </li>
                                                                )}
                                                            </ul>
                                                        </div>
                                                    }</>
                                            )}
                                        </div>
                                    </dl>
                                }
                            </div>
                        </div>
                        <section className='row  accordionbox'>
                            <div className="accordion   overflow-hidden">
                                  {/* description */}
                                {data.map(item =>
                                    <>
                                        {item.Body !== null &&
                                            <div className="card shadow-none  mb-2">
                                                <div className="accordion-item border-0" id="t_draggable1">
                                                    <div className="card-header p-0 border-bottom-0 " onClick={() => handleOpen6(item)} ><button className="accordion-button btn btn-link text-decoration-none d-block w-100 py-2 px-1 border-0 text-start rounded-0 shadow-none" data-bs-toggle="collapse">
                                                        <span className="fw-medium font-sans-serif text-900"><span className="sign">{item.showb ? <IoMdArrowDropdown /> : <IoMdArrowDropright />}</span>   Description</span></button></div>
                                                    <div className="accordion-collapse collapse show"  >
                                                        {item.showb &&
                                                            <div className="accordion-body pt-1" id="testDiv1">
                                                                {/* dangerouslySetInnerHTML={{__html: item.Short_x0020_Description_x0020_On}} */}
                                                                {data.map(item =>
                                                                    <p className="m-0" dangerouslySetInnerHTML={{ __html: item.Body }}>
                                                                        {/* {data.map(item => <a>{item.Short_x0020_Description_x0020_On}</a>)}  */}
                                                                    </p>)}
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        } </>)}

                                {/* Short description */}
                                {data.map(item =>
                                    <>
                                        {item.Short_x0020_Description_x0020_On !== null &&
                                            <div className="card shadow-none  mb-2">
                                                <div className="accordion-item border-0" id="t_draggable1">
                                                    <div className="card-header p-0 border-bottom-0 " onClick={() => handleOpen(item)} ><button className="accordion-button btn btn-link text-decoration-none d-block w-100 py-2 px-1 border-0 text-start rounded-0 shadow-none" data-bs-toggle="collapse">
                                                        <span className="fw-medium font-sans-serif text-900"><span className="sign">{item.show ? <IoMdArrowDropdown /> : <IoMdArrowDropright />}</span>  Short  Description</span></button></div>
                                                    <div className="accordion-collapse collapse show"  >
                                                        {item.show &&
                                                            <div className="accordion-body pt-1" id="testDiv1">
                                                                {/* dangerouslySetInnerHTML={{__html: item.Short_x0020_Description_x0020_On}} */}
                                                                {data.map(item =>
                                                                    <p className="m-0" dangerouslySetInnerHTML={{ __html: item.Short_x0020_Description_x0020_On }}>
                                                                        {/* {data.map(item => <a>{item.Short_x0020_Description_x0020_On}</a>)}  */}
                                                                    </p>)}
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        } </>)}
                                {/* Background */}
                                {data.map(item =>
                                    <>
                                        {item.Background !== null &&
                                            <div className="card shadow-none  mb-2">
                                                <div className="accordion-item border-0" id="t_draggable1">
                                                    <div className="card-header p-0 border-bottom-0 " onClick={() => handleOpen1(item)} ><button className="accordion-button btn btn-link text-decoration-none d-block w-100 py-2 px-1 border-0 text-start rounded-0 shadow-none" data-bs-toggle="collapse">
                                                        <span className="sign">{item.showl ? <IoMdArrowDropdown /> : <IoMdArrowDropright />}</span><span className="fw-medium font-sans-serif text-900" > Background</span></button></div>
                                                    <div className="accordion-collapse collapse show" >
                                                        {item.showl &&
                                                            <div className="accordion-body pt-1" id="testDiv1">
                                                                <p className="m-0" >{data.map(item => <a>{item.Background}</a>)}</p>
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        }</>)}
                                {/* Idea */}
                                {data.map(item =>
                                    <>
                                        {item.Idea !== null &&
                                            <div className="card shadow-none mb-2">
                                                <div className="accordion-item border-0" id="t_draggable1">
                                                    <div className="card-header p-0 border-bottom-0 " onClick={() => handleOpen2(item)}><button className="accordion-button btn btn-link text-decoration-none d-block w-100 py-2 px-1 border-0 text-start rounded-0 shadow-none" data-bs-toggle="collapse">
                                                        <span className="sign">{item.shows ? <IoMdArrowDropdown /> : <IoMdArrowDropright />}</span><span className="fw-medium font-sans-serif text-900"> Idea</span></button></div>
                                                    <div className="accordion-collapse collapse show"  >
                                                        {item.shows &&
                                                            <div className="accordion-body pt-1" id="testDiv1">
                                                                <p className="m-0" dangerouslySetInnerHTML={{ __html: item.Idea }}></p>
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        }</>)}
                                {/* Value Added */}
                                {data.map(item =>
                                    <>
                                        {item.ValueAdded !== null &&
                                            <div className="card shadow-none mb-2">
                                                <div className="accordion-item border-0" id="t_draggable1">
                                                    <div className="card-header p-0 border-bottom-0 " onClick={() => handleOpen4(item)}><button className="accordion-button btn btn-link text-decoration-none d-block w-100 py-2 px-1 border-0 text-start rounded-0 shadow-none" data-bs-toggle="collapse">
                                                        <span className="sign">{item.showj ? <IoMdArrowDropdown /> : <IoMdArrowDropright />}</span><span className="fw-medium font-sans-serif text-900"> Value Added</span></button></div>
                                                    <div className="accordion-collapse collapse show"  >
                                                        {item.showj &&
                                                            <div className="accordion-body pt-1" id="testDiv1">
                                                                <p className="m-0" dangerouslySetInnerHTML={{ __html: item.ValueAdded }}></p>
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        }</>)}
                                {/* Deliverables */}
                                {data.map(item =>
                                    <>
                                        {item.Deliverables !== null &&
                                            <div className="card shadow-none mb-2">
                                                <div className="accordion-item border-0" id="t_draggable1">
                                                    <div className="card-header p-0 border-bottom-0 " onClick={() => handleOpen5(item)}><button className="accordion-button btn btn-link text-decoration-none d-block w-100 py-2 px-1 border-0 text-start rounded-0 shadow-none" data-bs-toggle="collapse">
                                                        <span className="sign">{item.showm ? <IoMdArrowDropdown /> : <IoMdArrowDropright />}</span><span className="fw-medium font-sans-serif text-900" > Deliverables</span></button></div>
                                                    <div className="accordion-collapse collapse show"  >
                                                        {item.showm &&
                                                            <div className="accordion-body pt-1" id="testDiv1">
                                                                <p className="m-0" dangerouslySetInnerHTML={{ __html: item.Deliverables }}></p>
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        }</>)}
                            </div>
                        </section>
                    </div>
                    <div className='col-md-3'>
                        <aside>
                            {/* <div className='mb-3 card'>
                                    <div className='card-header'>
                                        <div className='card-actions float-end'>  <Tooltip /></div>
                                        <div className="mb-0 card-title h5">Smart Information</div>
                                    </div>
                                    <div className='card-body'>
                                        <div className="border-bottom pb-2"><a title="+ Add SmartInformation" ng-click="editSmartInfoItem(item,'add')"><Smartinfo/>+ Add SmartInformation</a></div>
                                    </div>
                                </div>
                                <div className='mb-3 card' ng-if="isOwner==true">
                                    <div className='card-header'>
                                        <div className='card-actions float-end'>  <Tooltip /></div>
                                        <div className="mb-0 card-title h5">Add & Connect Tool</div>
                                    </div>
                                    <div className='card-body'>
                                        <div className="border-bottom pb-2"> <a ng-click="TagItems();">
                                            Click here to add more content
                                        </a></div>
                                    </div>
                                </div>
                                {FolderData!=undefined&&
                                <>
                                  {FolderData.map(item =>{
                                    return(
                                <div className='mb-3 card'>
                                    <div className='card-header'>
                                        <div className='card-actions float-end'>  <Tooltip /></div>
                                        <div className="mb-0 card-title h5">Main Folder</div>
                                    </div>
                                    <div className='card-body'>
                                        <div className="border-bottom pb-2">
                                                <div>
                                                    <img  data-themekey="#" src="/_layouts/15/images/folder.gif?rev=23" />
                                                    <a className="hreflink ng-binding" target="_blank" href={item.EncodedAbsUrl}>
                                                        {item.FileLeafRef}
                                                    </a>
                                                </div>
                                        </div>
                                    </div>
                                </div>
                            )})} </>
                               }  */} 
                            <div className='mb-3 card'>
                                <>
                                    {data.map(item =>
                                        <CommentCard siteUrl={"https://hhhhteams.sharepoint.com/sites/HHHH/SP"} userDisplayName={item.userDisplayName} listName={"Master Tasks"} itemID={item.Id}></CommentCard>
                                    )}
                                </>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>
            {/* table secation artical */}
            <section className="TableSection">
                {/* {data.map(item => (
                                <Groupbyt  title={item.Title} level={item.PortfolioLevel}/>))} */}
                {/* <Groupby/> */}
                {/* {data.map(item => (
                                <Groupby Id={item.Id} level={item.PortfolioLevel}/>
                                ))} */}
                {data.map(item => (
                    <ComponentTable props={item} NextProp={myarray2} />
                ))}
            </section>
            <div className="col-sm-12 pad0">
                {data.map((item: any) => {
                    return (
                        <div className="col-sm-6 padL-0 ItemInfo mb-20" style={{ paddingTop: "15px" }}>
                            <div>
                                Created <span>{Moment(item.Created).format('DD/MM/YYYY hh:mm')}</span> by <span className="footerUsercolor">{item.Author.Title}</span>
                            </div>
                            <div>
                                Last modified <span>{Moment(item.Modified).format('DD/MM/YYYY hh:mm')}</span> by <span className="footerUsercolor">{item.Editor.Title}</span>
                                {/* {{ModifiedDate}} {{Editor}}*/}
                            </div>
                        </div>
                    )
                })}
            </div>
            {IsComponent && <EditInstituton props={SharewebComponent} Call={Call}></EditInstituton>}
        </div>


    )
}
export default Portfolio;