import * as React from "react";
import * as $ from "jquery";
import Modal from "react-bootstrap/Modal";
let TypeSite: string;
// if(TypeSite=="Service"){
//     require('../../cssFolder/sitecolorservice.scss');
// }
// if(TypeSite=="Component"){
//     require('../../cssFolder/site_color.scss');
// }
import { Web } from "sp-pnp-js";
import * as Moment from "moment";
// import Groupby from './TaskWebpart';
import Tooltip from "../../../globalComponents/Tooltip";

import { FaHome } from "react-icons/fa";
import { IoMdArrowDropright, IoMdArrowDropdown } from "react-icons/io";
import { SPComponentLoader } from "@microsoft/sp-loader";
// import { NavItem } from 'react-bootstrap';
import CommentCard from "../../../globalComponents/Comments/CommentCard";
import Smartinfo from "./NextSmart";
import EditInstituton from "../../EditPopupFiles/EditComponent";
import ComponentTable from "./Taskwebparts";
import ShowTaskTeamMembers from "../../../globalComponents/ShowTaskTeamMembers";
// import SmartInformation from "../../taskprofile/components/SmartInformation";
import Sitecomposition from "../../../globalComponents/SiteComposition";

let TeamMembers: any = [];
let AssigntoMembers: any = [];
let AllQuestion: any[] = [];
let AllHelp: any[] = [];
let AllTeamMember: any = [];
let Folderdatas: any = [];
let AssignTeamMember: any = [];
let ContextValue: any = {};


function getQueryVariable(variable:any)
{
        let query = window.location.search.substring(1);
        console.log(query)//"app=article&act=news_content&aid=160990"
        let vars = query.split("&");
       
        console.log(vars) 
        for (let i=0;i<vars.length;i++) {
                    let pair = vars[i].split("=");
                    console.log(pair)//[ 'app', 'article' ][ 'act', 'news_content' ][ 'aid', '160990' ] 
        if(pair[0] == variable){ return pair[1];}
         }
         return(false);
         
         
}
let ID:any='';
let web:any=''

function Portfolio({SelectedProp}:any) {
  const [data, setTaskData] = React.useState([]);
  const [isActive, setIsActive] = React.useState(false);
  const [array, setArray] = React.useState([]);
  const [datas, setdatas] = React.useState([]);
  const [datam, setdatam] = React.useState([]);
  const [datak, setdatak] = React.useState([]);
  const [dataj, setdataj] = React.useState([]);
  const [datams, setdatams] = React.useState([]);
  const [datamb, setdatamb] = React.useState([]);
  const [datahelp, setdatahelp] = React.useState([]);
  const [datatech, setdatatech] = React.useState([]);
  const [dataQues, setdataQues] = React.useState([]);
  const [dataHelp, setdataHelp] = React.useState([]);
  const [FolderData, SetFolderData] = React.useState([]);
  const [IsComponent, setIsComponent] = React.useState(false);
  const [SharewebComponent, setSharewebComponent] = React.useState("");
  const [showBlock, setShowBlock] = React.useState(false);
  const [IsTask, setIsTask] = React.useState(false);
  const [AllTaskuser, setAllTaskuser] = React.useState([]);
  const [questionandhelp, setquestionandhelp] = React.useState([]);


  ID=getQueryVariable('taskId');
  const handleOpen = (item: any) => {
    setIsActive((current) => !current);
    setIsActive(false);
    item.show = item.show == true ? false : true;
    setArray((array) => [...array]);
  };
  const handleOpen1 = (item: any) => {
    item.showl = item.showl = item.showl == true ? false : true;
    setdatam((datam) => [...datam]);
  };
  const handleOpen2 = (item: any) => {
    item.shows = item.shows = item.shows == true ? false : true;
    setdatas((datas) => [...datas]);
  };

  const handleOpen4 = (item: any) => {
    setIsActive((current) => !current);
    setIsActive(true);
    item.showj = item.showj = item.showj == true ? false : true;
    setdataj((dataj) => [...dataj]);
  };
  const handleOpen5 = (item: any) => {
    setIsActive((current) => !current);
    setIsActive(true);
    item.showm = item.showm = item.showm == true ? false : true;
    setdatams((datams) => [...datams]);
  };
  const handleOpen6 = (item: any) => {
    setIsActive((current) => !current);
    setIsActive(true);
    item.showm = item.showb = item.showb == true ? false : true;
    setdatamb((datamb) => [...datamb]);
  };
  const handleOpen7 = (item: any) => {
    setIsActive((current) => !current);
    setIsActive(true);
    item.showhelp = item.showhelp = item.showhelp == true ? false : true;
    setdatahelp((datahelp) => [...datahelp]);
  };
  const handleOpen8 = (item: any) => {
    setIsActive((current) => !current);
    setIsActive(true);
    item.showQues = item.showQues = item.showQues == true ? false : true;
    setdataQues((dataQues) => [...dataQues]);
  };
  const handleOpen9 = (item: any) => {
    setIsActive((current) => !current);
    setIsActive(true);
    item.showtech = item.showtech = item.showtech == true ? false : true;
    setdatatech((datatech) => [...datatech]);
  };
  const handleOpen10 = (item: any) => {
    setIsActive((current) => !current);
    setIsActive(true);
    item.showHelp = item.showHelp = item.showHelp == true ? false : true;
    setdataHelp((dataHelp) => [...dataHelp]);
  };
  React.useEffect(() => {
    let folderId: any = "";
    ContextValue = SelectedProp;
    let web = ContextValue.siteUrl;
    let url = `${web}/_api/lists/getbyid('${ContextValue.MasterTaskListID}')/items?$select=ItemRank,Item_x0020_Type,Portfolio_x0020_Type,Site,FolderID,PortfolioLevel,PortfolioStructureID,ValueAdded,Idea,TaskListName,TaskListId,WorkspaceType,CompletedDate,ClientActivityJson,ClientSite,Item_x002d_Image,Sitestagging,SiteCompositionSettings,TechnicalExplanations,Deliverables,ComponentPortfolio/Id,ComponentPortfolio/Title,ServicePortfolio/Id,Author/Id,Author/Title,Editor/Id,Editor/Title,ServicePortfolio/Title,Package,Short_x0020_Description_x0020_On,Short_x0020_Description_x0020__x,Short_x0020_description_x0020__x0,Admin_x0020_Notes,AdminStatus,Background,Help_x0020_Information,BasicImageInfo,Item_x0020_Type,AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,Component/Id,Component/Title,Component/ItemType,Component/ItemType,Categories,FeedBack,component_x0020_link,FileLeafRef,Title,Id,Comments,StartDate,DueDate,Status,Body,Company,Mileage,PercentComplete,FeedBack,Attachments,Priority,Created,Modified,PermissionGroup/Id,PermissionGroup/Title,Team_x0020_Members/Id,Team_x0020_Members/Title,Services/Id,Services/Title,Services/ItemType,Parent/Id,Parent/Title,Parent/ItemType,SharewebCategories/Id,SharewebCategories/Title,ClientCategory/Id,ClientCategory/Title&$expand=Author,Editor,ClientCategory,ComponentPortfolio,ServicePortfolio,Parent,AssignedTo,Services,Team_x0020_Members,Component,PermissionGroup,SharewebCategories&$filter=Id eq ${ID}&$top=4999`;
    let response: any = [];
    let responsen: any = []; // this variable is used for storing list items
    function GetListItems() {
      $.ajax({
        url: url,
        method: "GET",
        headers: {
          Accept: "application/json; odata=verbose",
        },
        success: function (data) {
          response = response.concat(data.d.results);
          response.map((item: any) => {
            if (item.FolderID != undefined) {
              folderId = item.FolderID;
              let urln = `${web}/_api/lists/getbyid('${ContextValue.DocumentsListID}')/items?$select=Id,Title,FileDirRef,FileLeafRef,ServerUrl,FSObjType,EncodedAbsUrl&$filter=Id eq ${folderId}`;
              $.ajax({
                url: urln,
                method: "GET",
                headers: {
                  Accept: "application/json; odata=verbose",
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
                },
              });
            }
            if (item.Portfolio_x0020_Type != undefined) {
              let filter = "";
              if (item.Portfolio_x0020_Type == "Component") {
                filter += "(Components / Id eq " + ID + ")";
              } else if (item.Portfolio_x0020_Type == "Service") {
                filter += "(Service / Id eq " + ID + ")";
              }

              let urln = `${web}/_api/lists/getbyid('${ContextValue.SmartHelptListID}')/items?$select=Id,Title,ItemRank,PercentComplete,Categories,AssignedTo/Id,AssignedTo/Title,Body,Components/Id,Components/Title,Components/ItemType,Service/Id,Service/Title,Service/ItemType,DueDate,ItemType,Priority,StartDate,Status&$expand=AssignedTo,Components,Service&$filter=${filter}`;
              $.ajax({
                url: urln,
                method: "GET",
                headers: {
                  Accept: "application/json; odata=verbose",
                },
                success: function (data) {
                  if (data != undefined) {
                    data.d.results.forEach(function (item: any) {
                      if (item.ItemType == "Question")
                        AllQuestion.unshift(item);
                      else if (item.ItemType == "Help") AllHelp.unshift(item);
                    });
                  }
                  responsen = responsen.concat(data.d.results);
                  if (data.d.__next) {
                    urln = data.d.__next;
                  } else setquestionandhelp(responsen);
                  // console.log("Data of question help"+responsen);
                },
                error: function (error) {
                  console.log(error);
                  // error handler code goes here
                },
              });
            }

            // console.log(folderId)
          });
          if (data.d.__next) {
            url = data.d.__next;
            GetListItems();
          } else setTaskData(response);
          console.log(response);
        },
        error: function (error) {
          console.log(error);
          // error handler code goes here
        },
      });
    }
  
    GetListItems();
    getTaskUser();
    open();
    
  }, []);

  // Make Folder data unique

  Folderdatas = FolderData.reduce(function (previous: any, current: any) {
    let alredyExists =
      previous.filter(function (item: any) {
        return item.Id === current.Id;
      }).length > 0;
    if (!alredyExists) {
      previous.push(current);
    }
    return previous;
  }, []);
  // Get All User

  const getTaskUser = async () => {
    let web = new Web(ContextValue.siteUrl);
    await web.lists
      .getById(ContextValue.TaskUsertListID)
      .items.orderBy("Created", true)
      .get()
      .then((Data: any[]) => {
        console.log(Data);

        setAllTaskuser(Data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  function open() {
    data.map((item: any) => {
      handleOpen(item);
      handleOpen1(item);
      handleOpen2(item);

      handleOpen4(item);
    });
  }

  let myarray2: any = [];

  let FolderID: any = "";
  data.map((item) => {
    if (item.Portfolio_x0020_Type != undefined) {
      TypeSite = item.Portfolio_x0020_Type;
    }
    // Set the page titile
    document.title = `${item.Portfolio_x0020_Type}-${item.Title}`;
    if (item.Team_x0020_Members.results != undefined) {
      AllTaskuser.map((users) => {
        item.Team_x0020_Members.results.map((members: any) => {
          if (members.Id != undefined) {
            if (users.AssingedToUserId == members.Id) {
              TeamMembers.push(users);
            }
          }
        });
      });
      // console.log(TeamMembers);
    }
    if (item.AssignedTo.results != undefined) {
      AllTaskuser.map((users) => {
        item.AssignedTo.results.map((members: any) => {
          if (users.AssingedToUserId == members.Id) {
            AssigntoMembers.push(users);
          }
        });
      });
      // console.log(AssigntoMembers);
    }
  });
  //    Get Folder data
  const [lgShow, setLgShow] = React.useState(false);
  const handleClose = () => setLgShow(false);

  const EditComponentPopup = (item: any) => {
   
    item["siteUrl"] = web;
    item["listName"] = ContextValue.MasterTaskListID;
    setIsComponent(true);
    setSharewebComponent(item);
    
    // <ComponentPortPolioPopup props={item}></ComponentPortPolioPopup>
  };
  const Call = React.useCallback((item1) => {
    setIsComponent(false);
    setIsTask(false);
   
    
  }, []);

  //  Remove duplicate values
  // const UniqueArray = [...TeamMembers, ...AssigntoMembers];

  AllTeamMember = TeamMembers.reduce(function (previous: any, current: any) {
    let alredyExists =
      previous.filter(function (item: any) {
        return item.Id === current.Id;
      }).length > 0;
    if (!alredyExists) {
      previous.push(current);
    }
    return previous;
  }, []);

  AssignTeamMember = AssigntoMembers.reduce(function (
    previous: any,
    current: any
  ) {
    let alredyExists =
      previous.filter(function (item: any) {
        return item.Id === current.Id;
      }).length > 0;
    if (!alredyExists) {
      previous.push(current);
    }
    return previous;
  },
  []);

  console.log(AllTeamMember);

  function handleSuffixHover() {
    setShowBlock(true);
  }

  function handleuffixLeave() {
    setShowBlock(false);
  }

  return (
    <div className={TypeSite == "Service" ? "serviepannelgreena" : ""}>
      {/* breadcrumb & title */}
      <section className="ContentSection">
        <section>
          <div className="col">
            <div className="d-flex justify-content-between p-0">
              <ul className="spfxbreadcrumb m-0 p-0">
                <li>
                  <a href="#">
                    <FaHome />{" "}
                  </a>
                </li>
                {data.map((item: any) => {
                  return (
                    <>
                      <li>
                        {/* if="Task.Portfolio_x0020_Type=='Component'  (Task.Item_x0020_Type=='Component Category')" */}
                        {item.Portfolio_x0020_Type != undefined && (
                          <a
                            target="_blank"
                            data-interception="off"
                            href={SelectedProp.siteUrl+"/SitePages/"+item.Portfolio_x0020_Type+"-Portfolio.aspx"}
                          >
                            {item.Portfolio_x0020_Type}-Portfolio
                          </a>
                        )}
                      </li>
                      {(item.Item_x0020_Type == "SubComponent" ||
                        item.Item_x0020_Type == "Feature") && (
                        <li>
                          {/* if="Task.Portfolio_x0020_Type=='Component'  (Task.Item_x0020_Type=='Component Category')" */}
                          {item.Parent != undefined && (
                            <a
                              target="_blank"
                              data-interception="off"
                              href={SelectedProp.siteUrl+"/SitePages/Portfolio-Profile.aspx?taskId="+item.Parent.Id}
                            >
                              {item.Parent.Title}
                            </a>
                          )}
                        </li>
                      )}

                      <li>
                        <a>{item.Title}</a>
                      </li>
                    </>
                  );
                })}
              </ul>
            </div>
          </div>
          <div className="col">
            <div className="p-0" style={{ verticalAlign: "top" }}>
              {data.map((item) => (
                <>
                  <h2 className="heading d-flex justify-content-between align-items-center">
                    <span>
                      {item.Portfolio_x0020_Type == "Component" &&
                        item.Item_x0020_Type == "SubComponent" && (
                          <>
                            <img
                              className="client-icons"
                              src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/subComponent_icon.png"
                            />{" "}
                            <a>{item.Title}</a>{" "}
                            <span>
                              {" "}
                              <img
                               src={require('../../../Assets/ICON/edit_page.svg')}
                                width="30" height="25"
                                onClick={(e) => EditComponentPopup(item)}
                              />
                            </span>
                          </>
                        )}
                      {item.Portfolio_x0020_Type == "Service" &&
                        item.Item_x0020_Type == "SubComponent" && (
                          <>
                            <img
                              className="client-icons"
                              src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/subcomponent_icon.png"
                            />{" "}
                            <a>{item.Title}</a>{" "}
                            <span>
                              {" "}
                              <img
                                src={require('../../../Assets/ICON/edit_page.svg')}
                                width="30" height="25"
                                onClick={(e) => EditComponentPopup(item)}
                              />
                            </span>
                          </>
                        )}

                      {item.Portfolio_x0020_Type == "Component" &&
                        item.Item_x0020_Type == "Feature" && (
                          <>
                            <img
                              className="client-icons"
                              src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/feature_icon.png"
                            />{" "}
                            <a>{item.Title}</a>{" "}
                            <span >
                              {" "}
                              <img
                               src={require('../../../Assets/ICON/edit_page.svg')}
                                width="30" height="25"
                                onClick={(e) => EditComponentPopup(item)}
                              />
                            </span>
                          </>
                        )}
                      {item.Portfolio_x0020_Type == "Service" &&
                        item.Item_x0020_Type == "Feature" && (
                          <>
                            <img
                              className="client-icons"
                              src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/feature_icon.png"
                            />{" "}
                            <a>{item.Title}</a>{" "}
                            <span>
                              {" "}
                              <img
                               src={require('../../../Assets/ICON/edit_page.svg')}
                                width="30" height="25"
                                onClick={(e) => EditComponentPopup(item)}
                              />
                            </span>
                          </>
                        )}
                      {item.Portfolio_x0020_Type == "Component" &&
                        item.Item_x0020_Type != "SubComponent" &&
                        item.Item_x0020_Type != "Feature" && (
                          <>
                            <img
                              className="client-icons"
                              src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/component_icon.png"
                            />{" "}
                            <a>{item.Title}</a>{" "}
                            <span>
                              {" "}
                              <img
                               src={require('../../../Assets/ICON/edit_page.svg')}
                                width="30" height="25"
                                onClick={(e) => EditComponentPopup(item)}
                              />
                            </span>
                          </>
                        )}
                      {item.Portfolio_x0020_Type == "Service" &&
                        item.Item_x0020_Type != "SubComponent" &&
                        item.Item_x0020_Type != "Feature" && (
                          <>
                            <img
                              className="client-icons"
                              src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/component_icon.png"
                            />{" "}
                            <a>{item.Title}</a>{" "}
                            <span>
                              {" "}
                              <img
                               src={require('../../../Assets/ICON/edit_page.svg')}
                                width="30" height="25"
                                onClick={(e) => EditComponentPopup(item)}
                              />
                            </span>
                          </>
                        )}
                    </span>
                    <span className="text-end fs-6">
                      <a
                        target="_blank"
                        data-interception="off"
                        href={SelectedProp.siteUrl+"/SitePages/Portfolio-Profile-Old.aspx?taskId="+ID}
                      >
                        Old Portfolio profile page
                      </a>
                    </span>
                  </h2>
                </>
              ))}
            </div>
          </div>
        </section>
        {/* left bar  & right bar */}
        <section>
          <div className="row">
            <div className="col-md-9 bg-white">
              <div className="team_member row  py-2">
                <div className="col-md-8">
                  <div className="row mb-2">
                    <div className="col-md-6 pe-0">
                      <dl>
                        <dt className="bg-fxdark">Due Date</dt>
                        <dd className="bg-light">
                          <span>
                            {/* <i> 02/12/2019</i> */}
                            {data.map((item) => (
                              <a>
                                {item.DueDate != null
                                  ? Moment(item.DueDate).format("DD/MM/YYYY")
                                  : ""}
                              </a>
                            ))}
                            {/* {data.map(item =>  <i>{item.DueDate}</i>)} */}
                          </span>
                        </dd>
                      </dl>
                      <dl>
                        <dt className="bg-fxdark">Start Date</dt>
                        <dd className="bg-light">
                          {data.map((item) => (
                            <a>
                              {item.StartDate != null
                                ? Moment(item.StartDate).format("DD/MM/YYYY")
                                : ""}
                            </a>
                          ))}
                        </dd>
                      </dl>
                      <dl>
                        <dt className="bg-fxdark">Status</dt>
                        <dd className="bg-light">
                          {data.map((item) => (
                            <a>{item.Status}</a>
                          ))}
                        </dd>
                      </dl>
                      <dl>
                        <dt className="bg-fxdark">Team Members</dt>
                        <dd className='bg-light d-flex'>
                                            {AssignTeamMember.length!=0?AssignTeamMember.map((item:any)=>
                                        <>
                                                <a  target='_blank' data-interception="off" href={SelectedProp.siteUrl+`/SitePages/TeamLeader-Dashboard.aspx?UserId=${item.AssingedToUserId}&Name=${item.Title}`}>
                                                <img className='AssignUserPhoto' src={item.Item_x0020_Cover?.Url} title={item.Title} />
                                                </a>
                                            
                                                </>
                                        ):""}
                                        <div className='px-1'>|</div>
                                                {AllTeamMember != null && AllTeamMember.length > 0 &&
                    <div className="user_Member_img"><a href={SelectedProp.siteUrl+`/SitePages/TeamLeader-Dashboard.aspx?UserId=${AllTeamMember[0].Id}&Name=${AllTeamMember[0].Title}`} target="_blank" data-interception="off"><img className="imgAuthor" src={AllTeamMember[0].Item_x0020_Cover?.Url} title={AllTeamMember[0].Title}></img></a></div>                        
                    }
                    {AllTeamMember != null && AllTeamMember.length > 1 &&
                    <div className="position-relative user_Member_img_suffix2 multimember fs13" style={{paddingTop: '2px'}} onMouseOver={(e) =>handleSuffixHover()} onMouseLeave={(e) =>handleuffixLeave()}>+{AllTeamMember.length - 1}
                    {showBlock &&
                        <span className="tooltiptext">
                        <div className='bg-white border p-2'>                        
                            { AllTeamMember.slice(1).map( (rcData:any,i:any)=> {
                                
                                return  <div className="team_Members_Item p-1">
                                <div><a href={SelectedProp.siteUrl+"/SitePages/TeamLeader-Dashboard.aspx?UserId="+rcData.Id+"&Name="+rcData.Title} target="_blank" data-interception="off">
                                    <img className="imgAuthor" src={rcData.Item_x0020_Cover?.Url}></img></a></div>
                                <div className='m-1'>{rcData.Title}</div>
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
                                                        <a  target='_blank' data-interception="off" href={web+`/SitePages/TeamLeader-Dashboard.aspx?UserId=${member.AssingedToUserId}&Name=${member.Title}`}>
                                                        <img className='AssignUserPhoto' src={member.Item_x0020_Cover?.Url} title={member.Title} />
                                                    </a>
                                                </>
                                                ):""} */}

                                    </dd>
                      </dl>
                      <dl>
                        <dt className="bg-fxdark">Item Rank</dt>
                        <dd className="bg-light">
                          {data.map((item) => (
                            <a>{item.ItemRank}</a>
                          ))}
                        </dd>
                      </dl>
                    </div>
                    <div className="col-md-6 p-0">
                      <dl>
                        <dt className="bg-fxdark">Priority</dt>
                        <dd className="bg-light">
                          {data.map((item) => (
                            <a>{item.Priority != null ? item.Priority : ""}</a>
                          ))}
                        </dd>
                      </dl>
                      <dl>
                        <dt className="bg-fxdark">Completion Date</dt>
                        <dd className="bg-light">
                          {data.map((item) => (
                            <a>
                              {item.CompletedDate != null
                                ? Moment(item.CompletedDate).format(
                                    "DD/MM/YYYY"
                                  )
                                : ""}
                            </a>
                          ))}
                        </dd>
                      </dl>
                      <dl>
                        <dt className="bg-fxdark">Categories</dt>
                        <dd className="bg-light text-break">
                          {data.map((item) => (
                            <a>{item.Categories}</a>
                          ))}
                        </dd>
                      </dl>
                      <dl>
                        <dt className="bg-fxdark">% Complete</dt>
                        <dd className="bg-light">
                          {data.map((item) => (
                            <a>{(item.PercentComplete * 100).toFixed(0)}</a>
                          ))}
                        </dd>
                      </dl>
                      {data.map((item: any) => {
                        return (
                          <>
                            {item.Parent.Title != undefined && (
                              <dl>
                                <dt className="bg-fxdark">Parent</dt>
                                <dd className="bg-light">
                                  <a
                                    target="_blank"
                                    data-interception="off"
                                    href={SelectedProp.siteUrl+"/SitePages/Portfolio-Profile.aspx?taskId="+item.Parent.Id}
                                  >
                                    {item.Parent.Title}
                                  </a>
                                  <span className="pull-right">
                                    <span className="pencil_icon">
                                      <span className="hreflink">
                                        {item.Portfolio_x0020_Type ==
                                          "Component" && (
                                          <>
                                            <a
                                              target="_blank"
                                              data-interception="off"
                                              href={SelectedProp.siteUrl+"/SitePages/Component-Portfolio.aspx?ComponentID="+item.Parent.Id}
                                            >
                                              <img src={require('../../../Assets/ICON/edit_page.svg')}
                                width="30" height="25" />{" "}
                                            </a>
                                          </>
                                        )}
                                        {item.Portfolio_x0020_Type ==
                                          "Service" && (
                                          <>
                                            <a
                                              target="_blank"
                                              data-interception="off"
                                              href={SelectedProp.siteUrl+"/SitePages/Service-Portfolio.aspx?ComponentID="+item.Parent.Id}
                                            >
                                              {" "}
                                              <img src={require('../../../Assets/ICON/edit_page.svg')}
                                width="30" height="25" />{" "}
                                            </a>
                                          </>
                                        )}
                                      </span>
                                    </span>
                                  </span>
                                </dd>
                              </dl>
                            )}
                          </>
                        );
                      })}
                    </div>
                  </div>
                  <section className="row  accordionbox">
                    <div className="accordion  pe-1 overflow-hidden">
                      {/* description */}
                      {data.map((item) => (
                        <>
                          {item.Body !== null && (
                            <div className="card shadow-none  mb-2">
                              <div
                                className="accordion-item border-0"
                                id="t_draggable1"
                              >
                                <div
                                  className="card-header p-0 border-bottom-0 "
                                  onClick={() => handleOpen6(item)}
                                >
                                  <button
                                    className="accordion-button btn btn-link text-decoration-none d-block w-100 py-2 px-1 border-0 text-start rounded-0 shadow-none"
                                    data-bs-toggle="collapse"
                                  >
                                    <span className="fw-medium font-sans-serif text-900">
                                      <span className="sign">
                                        {item.showb ? (
                                          <IoMdArrowDropdown />
                                        ) : (
                                          <IoMdArrowDropright />
                                        )}
                                      </span>{" "}
                                      Description
                                    </span>
                                  </button>
                                </div>
                                <div className="accordion-collapse collapse show">
                                  {item.showb && (
                                    <div
                                      className="accordion-body pt-1"
                                      id="testDiv1"
                                    >
                                      {/* dangerouslySetInnerHTML={{__html: item.Short_x0020_Description_x0020_On}} */}
                                      {data.map((item) => (
                                        <p
                                          className="m-0"
                                          dangerouslySetInnerHTML={{
                                            __html: item.Body,
                                          }}
                                        >
                                          {/* {data.map(item => <a>{item.Short_x0020_Description_x0020_On}</a>)}  */}
                                        </p>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}{" "}
                        </>
                      ))}

                      {/* Short description */}
                      {data.map((item) => (
                        <>
                          {item.Short_x0020_Description_x0020_On !== null && (
                            <div className="card shadow-none  mb-2">
                              <div
                                className="accordion-item border-0"
                                id="t_draggable1"
                              >
                                <div
                                  className="card-header p-0 border-bottom-0 "
                                  onClick={() => handleOpen(item)}
                                >
                                  <button
                                    className="accordion-button  btn-link text-decoration-none d-block w-100 py-2 px-1 border-0 text-start rounded-0 shadow-none"
                                    data-bs-toggle="collapse"
                                  >
                                    <span className="fw-medium font-sans-serif text-900">
                                      <span className="sign">
                                        {item.show ? (
                                          <IoMdArrowDropdown />
                                        ) : (
                                          <IoMdArrowDropright />
                                        )}
                                      </span>{" "}
                                      Short Description
                                    </span>
                                  </button>
                                </div>
                                <div className="accordion-collapse collapse show">
                                  {item.show && (
                                    <div
                                      className="accordion-body pt-1"
                                      id="testDiv1"
                                    >
                                      {/* dangerouslySetInnerHTML={{__html: item.Short_x0020_Description_x0020_On}} */}
                                      {data.map((item) => (
                                        <p
                                          className="m-0"
                                          dangerouslySetInnerHTML={{
                                            __html:
                                              item.Short_x0020_Description_x0020_On,
                                          }}
                                        >
                                          {/* {data.map(item => <a>{item.Short_x0020_Description_x0020_On}</a>)}  */}
                                        </p>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}{" "}
                        </>
                      ))}

                      {/* Question description */}
                      {AllQuestion != undefined &&
                        AllQuestion.length != 0 &&
                        data.map((item) => (
                          <>
                            <div className="card shadow-none Qapannel  mb-2">
                              <div
                                className="card-header p-0 border-bottom-0 "
                                onClick={() => handleOpen8(item)}
                              >
                                <button
                                  className="accordion-button btn-link text-decoration-none d-block w-100 py-2 px-1 border-0 text-start rounded-0 shadow-none"
                                  data-bs-toggle="collapse"
                                >
                                  <span className="fw-medium font-sans-serif text-900">
                                    <span className="sign">
                                      {item.showQues ? (
                                        <IoMdArrowDropdown />
                                      ) : (
                                        <IoMdArrowDropright />
                                      )}
                                    </span>{" "}
                                    Question Description
                                  </span>
                                </button>
                              </div>

                              {item.showQues && (
                                <>
                                  <div className="px-2 my-2">
                                    {AllQuestion.map((item) => (
                                      <div id="t_draggable1" className="mb-2">
                                        <div
                                          className="card-header p-0 border-bottom-0 "
                                          onClick={() => handleOpen8(item)}
                                        >
                                          <button
                                            className="accordion-button  btn-link text-decoration-none d-block w-100 py-2 px-1 border-0 text-start rounded-0 shadow-none"
                                            data-bs-toggle="collapse"
                                          >
                                            <span className="fw-medium font-sans-serif text-900">
                                              <span className="sign">
                                                {item.showQues ? (
                                                  <IoMdArrowDropdown />
                                                ) : (
                                                  <IoMdArrowDropright />
                                                )}
                                              </span>{" "}
                                              {item.Title}
                                            </span>
                                          </button>
                                        </div>
                                        <div className="accordion-collapse collapse show">
                                          {item.showQues && (
                                            <div
                                              className="accordion-body pt-1"
                                              id="testDiv1"
                                            >
                                              {/* dangerouslySetInnerHTML={{__html: item.Short_x0020_Description_x0020_On}} */}

                                              <p
                                                className="m-0"
                                                dangerouslySetInnerHTML={{
                                                  __html: item.Body,
                                                }}
                                              >
                                                {/* {data.map(item => <a>{item.Short_x0020_Description_x0020_On}</a>)}  */}
                                              </p>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </>
                              )}
                            </div>
                          </>
                        ))}
                      {/* Help description */}
                      {AllHelp != undefined &&
                        AllHelp.length != 0 &&
                        data.map((item) => (
                          <>
                            <div className="card shadow-none Qapannel  mb-2">
                              <div
                                className="card-header p-0 border-bottom-0 "
                                onClick={() => handleOpen10(item)}
                              >
                                <button
                                  className="accordion-button btn-link text-decoration-none d-block w-100 py-2 px-1 border-0 text-start rounded-0 shadow-none"
                                  data-bs-toggle="collapse"
                                >
                                  <span className="fw-medium font-sans-serif text-900">
                                    <span className="sign">
                                      {item.showHelp ? (
                                        <IoMdArrowDropdown />
                                      ) : (
                                        <IoMdArrowDropright />
                                      )}
                                    </span>{" "}
                                    Help Description
                                  </span>
                                </button>
                              </div>

                              {item.showHelp && (
                                <>
                                  <div className="px-2 my-2">
                                    {AllHelp.map((item) => (
                                      <div id="t_draggable1" className="mb-2">
                                        <div
                                          className="card-header p-0 border-bottom-0 "
                                          onClick={() => handleOpen10(item)}
                                        >
                                          <button
                                            className="accordion-button  btn-link text-decoration-none d-block w-100 py-2 px-1 border-0 text-start rounded-0 shadow-none"
                                            data-bs-toggle="collapse"
                                          >
                                            <span className="fw-medium font-sans-serif text-900">
                                              <span className="sign">
                                                {item.showHelp ? (
                                                  <IoMdArrowDropdown />
                                                ) : (
                                                  <IoMdArrowDropright />
                                                )}
                                              </span>{" "}
                                              {item.Title}
                                            </span>
                                          </button>
                                        </div>
                                        <div className="accordion-collapse collapse show">
                                          {item.showHelp && (
                                            <div
                                              className="accordion-body pt-1"
                                              id="testDiv1"
                                            >
                                              {/* dangerouslySetInnerHTML={{__html: item.Short_x0020_Description_x0020_On}} */}

                                              <p
                                                className="m-0"
                                                dangerouslySetInnerHTML={{
                                                  __html: item.Body,
                                                }}
                                              >
                                                {/* {data.map(item => <a>{item.Short_x0020_Description_x0020_On}</a>)}  */}
                                              </p>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </>
                              )}
                            </div>
                          </>
                        ))}

                      {/* Background */}
                      {data.map((item) => (
                        <>
                          {item.Background !== null && (
                            <div className="card shadow-none  mb-2">
                              <div
                                className="accordion-item border-0"
                                id="t_draggable1"
                              >
                                <div
                                  className="card-header p-0 border-bottom-0 "
                                  onClick={() => handleOpen1(item)}
                                >
                                  <button
                                    className="accordion-button  btn-link text-decoration-none d-block w-100 py-2 px-1 border-0 text-start rounded-0 shadow-none"
                                    data-bs-toggle="collapse"
                                  >
                                    <span className="sign">
                                      {item.showl ? (
                                        <IoMdArrowDropdown />
                                      ) : (
                                        <IoMdArrowDropright />
                                      )}
                                    </span>
                                    <span className="fw-medium font-sans-serif text-900">
                                      {" "}
                                      Background
                                    </span>
                                  </button>
                                </div>
                                <div className="accordion-collapse collapse show">
                                  {item.showl && (
                                    <div
                                      className="accordion-body pt-1"
                                      id="testDiv1"
                                    >
                                      <p className="m-0">
                                        {data.map((item) => (
                                          <a>{item.Background}</a>
                                        ))}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      ))}
                      {/* Idea */}
                      {data.map((item) => (
                        <>
                          {item.Idea !== null && (
                            <div className="card shadow-none mb-2">
                              <div
                                className="accordion-item border-0"
                                id="t_draggable1"
                              >
                                <div
                                  className="card-header p-0 border-bottom-0 "
                                  onClick={() => handleOpen2(item)}
                                >
                                  <button
                                    className="accordion-button  btn-link text-decoration-none d-block w-100 py-2 px-1 border-0 text-start rounded-0 shadow-none"
                                    data-bs-toggle="collapse"
                                  >
                                    <span className="sign">
                                      {item.shows ? (
                                        <IoMdArrowDropdown />
                                      ) : (
                                        <IoMdArrowDropright />
                                      )}
                                    </span>
                                    <span className="fw-medium font-sans-serif text-900">
                                      {" "}
                                      Idea
                                    </span>
                                  </button>
                                </div>
                                <div className="accordion-collapse collapse show">
                                  {item.shows && (
                                    <div
                                      className="accordion-body pt-1"
                                      id="testDiv1"
                                    >
                                      <p
                                        className="m-0"
                                        dangerouslySetInnerHTML={{
                                          __html: item.Idea,
                                        }}
                                      ></p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      ))}
                      {/* Value Added */}
                      {data.map((item) => (
                        <>
                          {item.ValueAdded !== null && (
                            <div className="card shadow-none mb-2">
                              <div
                                className="accordion-item border-0"
                                id="t_draggable1"
                              >
                                <div
                                  className="card-header p-0 border-bottom-0 "
                                  onClick={() => handleOpen4(item)}
                                >
                                  <button
                                    className="accordion-button  btn-link text-decoration-none d-block w-100 py-2 px-1 border-0 text-start rounded-0 shadow-none"
                                    data-bs-toggle="collapse"
                                  >
                                    <span className="sign">
                                      {item.showj ? (
                                        <IoMdArrowDropdown />
                                      ) : (
                                        <IoMdArrowDropright />
                                      )}
                                    </span>
                                    <span className="fw-medium font-sans-serif text-900">
                                      {" "}
                                      Value Added
                                    </span>
                                  </button>
                                </div>
                                <div className="accordion-collapse collapse show">
                                  {item.showj && (
                                    <div
                                      className="accordion-body pt-1"
                                      id="testDiv1"
                                    >
                                      <p
                                        className="m-0"
                                        dangerouslySetInnerHTML={{
                                          __html: item.ValueAdded,
                                        }}
                                      ></p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      ))}
                      {/* Help Information Help_x0020_Information */}
                      {data.map((item) => (
                        <>
                          {item.Help_x0020_Information !== null && (
                            <div className="card shadow-none mb-2">
                              <div
                                className="accordion-item border-0"
                                id="t_draggable1"
                              >
                                <div
                                  className="card-header p-0 border-bottom-0 "
                                  onClick={() => handleOpen7(item)}
                                >
                                  <button
                                    className="accordion-button  btn-link text-decoration-none d-block w-100 py-2 px-1 border-0 text-start rounded-0 shadow-none"
                                    data-bs-toggle="collapse"
                                  >
                                    <span className="sign">
                                      {item.showhelp ? (
                                        <IoMdArrowDropdown />
                                      ) : (
                                        <IoMdArrowDropright />
                                      )}
                                    </span>
                                    <span className="fw-medium font-sans-serif text-900">
                                      {" "}
                                      Help Information
                                    </span>
                                  </button>
                                </div>
                                <div className="accordion-collapse collapse show">
                                  {item.showhelp && (
                                    <div
                                      className="accordion-body pt-1"
                                      id="testDiv1"
                                    >
                                      <p
                                        className="m-0"
                                        dangerouslySetInnerHTML={{
                                          __html: item.Help_x0020_Information,
                                        }}
                                      ></p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      ))}

                      {/* Technical Explanation */}
                      {data.map((item) => (
                        <>
                          {item.TechnicalExplanations !== null && (
                            <div className="card shadow-none mb-2">
                              <div
                                className="accordion-item border-0"
                                id="t_draggable1"
                              >
                                <div
                                  className="card-header p-0 border-bottom-0 "
                                  onClick={() => handleOpen9(item)}
                                >
                                  <button
                                    className="accordion-button  btn-link text-decoration-none d-block w-100 py-2 px-1 border-0 text-start rounded-0 shadow-none"
                                    data-bs-toggle="collapse"
                                  >
                                    <span className="sign">
                                      {item.showtech ? (
                                        <IoMdArrowDropdown />
                                      ) : (
                                        <IoMdArrowDropright />
                                      )}
                                    </span>
                                    <span className="fw-medium font-sans-serif text-900">
                                      Technical Explanation
                                    </span>
                                  </button>
                                </div>
                                <div className="accordion-collapse collapse show">
                                  {item.showtech && (
                                    <div
                                      className="accordion-body pt-1"
                                      id="testDiv1"
                                    >
                                      <p
                                        className="m-0"
                                        dangerouslySetInnerHTML={{
                                          __html: item.TechnicalExplanations,
                                        }}
                                      ></p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      ))}
                      {/* Deliverables */}
                      {data.map((item) => (
                        <>
                          {item.Deliverables !== null && (
                            <div className="card shadow-none mb-2">
                              <div
                                className="accordion-item border-0"
                                id="t_draggable1"
                              >
                                <div
                                  className="card-header p-0 border-bottom-0 "
                                  onClick={() => handleOpen5(item)}
                                >
                                  <button
                                    className="accordion-button  btn-link text-decoration-none d-block w-100 py-2 px-1 border-0 text-start rounded-0 shadow-none"
                                    data-bs-toggle="collapse"
                                  >
                                    <span className="sign">
                                      {item.showm ? (
                                        <IoMdArrowDropdown />
                                      ) : (
                                        <IoMdArrowDropright />
                                      )}
                                    </span>
                                    <span className="fw-medium font-sans-serif text-900">
                                      {" "}
                                      Deliverables
                                    </span>
                                  </button>
                                </div>
                                <div className="accordion-collapse collapse show">
                                  {item.showm && (
                                    <div
                                      className="accordion-body pt-1"
                                      id="testDiv1"
                                    >
                                      <p
                                        className="m-0"
                                        dangerouslySetInnerHTML={{
                                          __html: item.Deliverables,
                                        }}
                                      ></p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      ))}
                    </div>
                  </section>
                </div>
                <div className="col-md-4 p-0">
                  {data.map((item: any) => {
                    return (
                      <>
                        {item.Portfolio_x0020_Type == "Component" && (
                          <dl>
                            <dt className="bg-fxdark">Service Portfolio</dt>
                            <dd className="bg-light">
                              <div className="block">
                                <a
                                  className="service"
                                  style={{ border: "0px" }}
                                  target="_blank"
                                  data-interception="off"
                                  href={SelectedProp.siteUrl+"/SitePages/Portfolio-Profile.aspx?taskId="+item?.Services?.results[0]?.Id}
                                >
                                  {item?.Services?.results[0]?.Title}
                                </a>
                              </div>
                            </dd>
                          </dl>
                        )}
                        {item.Portfolio_x0020_Type == "Service" && (
                          <dl>
                            <dt className="bg-fxdark">Component Portfolio</dt>
                            <dd className="bg-light">
                              <div className="block">
                                <a
                                  className="service"
                                  style={{ border: "0px" }}
                                  target="_blank"
                                  data-interception="off"
                                  href={SelectedProp.siteUrl+`/SitePages/Portfolio-Profile.aspx?taskId=${item?.Component?.results[0]?.Id}`}
                                >
                                  {item?.Component?.results[0]?.Title}
                                </a>
                              </div>
                            </dd>
                          </dl>
                        )}
                      </>
                    );
                  })}
                  {data.map((item: any) => {
                    return <Sitecomposition props={item} />;
                  })}
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <aside>
                {data.map((item) => {
                  return (
                    <>
                      {item.Item_x002d_Image != null && (
                        <div>
                          <img
                            alt={item.Item_x002d_Image.Url}
                            style={{ width: "280px", height: "145px" }}
                            src={item.Item_x002d_Image.Url}
                          />
                        </div>
                      )}
                    </>
                  );
                })}
                <div className="mb-3 card">
                  {data.map((item) => {
                    return (
                      // <SmartInformation
                      //   Id={item.Id}
                      //   siteurl={
                      //     "${web}"
                      //   }
                      //   listName={"HHHH"}
                      //   spPageContext={"/sites/HHHH/SP"}
                      // />
                      <></>
                    );
                  })}
                </div>
                {/* <div className='mb-3 card' ng-if="isOwner==true">
                                        <div className='card-header'>
                                            <div className='card-actions float-end'>  <Tooltip ComponentId='324'/></div>
                                            <div className="mb-0 card-title h5">Add & Connect Tool</div>
                                        </div>
                                        <div className='card-body'>
                                            <div className="border-bottom pb-2"> <a ng-click="TagItems();">
                                                Click here to add more content
                                            </a></div>
                                        </div>
                                    </div> */}
                {Folderdatas != undefined && (
                  <>
                    {Folderdatas.map((item: any) => {
                      return (
                        <div className="mb-3 card">
                          <div className="card-header">
                            <div className="card-actions float-end">
                              {" "}
                              <Tooltip ComponentId="1748" />
                            </div>
                            <div className="mb-0 card-title h5">
                              Main Folder
                            </div>
                          </div>
                          <div className="card-body">
                            <div className="border-bottom pb-2">
                              <div>
                                <img
                                  data-themekey="#"
                                  src="/_layouts/15/images/folder.gif?rev=23"
                                />
                                <a
                                  target="_blank"
                                  data-interception="off"
                                  href={item?.EncodedAbsUrl}
                                >
                                  {item?.FileLeafRef}
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}{" "}
                  </>
                )}
                <div className="mb-3 card">
                  <>
                    {data.map((item) => (
                      <CommentCard
                        siteUrl={
                          web
                        }
                        AllListId={SelectedProp}
                        userDisplayName={item.userDisplayName}
                        itemID={item.Id}
                      ></CommentCard>
                    ))}
                  </>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </section>
      {/* table secation artical */}
      <section className="TableContentSection taskprofilepagegreen">
        <div className="container-fluid">
          <section className="TableSection">
            {/* {data.map(item => (
                                        <Groupbyt  title={item.Title} level={item.PortfolioLevel}/>))} */}
            {/* <Groupby/> */}
            {/* {data.map(item => (
                                        <Groupby Id={item.Id} level={item.PortfolioLevel}/>
                                        ))} */}
            {data.map((item) => (
              <ComponentTable props={item} NextProp={ContextValue} />
            ))}
          </section>
        </div>
      </section>
      <div className="col-sm-12 pad0">
        {data.map((item: any) => {
          return (
            <div
              className="col-sm-6 padL-0 ItemInfo mb-20"
              style={{ paddingTop: "15px" }}
            >
              <div>
                Created{" "}
                <span>{Moment(item.Created).format("DD/MM/YYYY hh:mm")}</span>{" "}
                by <span className="footerUsercolor">{item.Author.Title}</span>
              </div>
              <div>
                Last modified{" "}
                <span>{Moment(item.Modified).format("DD/MM/YYYY hh:mm")}</span>{" "}
                by <span className="footerUsercolor">{item.Editor.Title}</span>
                {/* {{ModifiedDate}} {{Editor}}*/}
              </div>
            </div>
          );
        })}
      </div>
      {IsComponent && (
        <EditInstituton item={SharewebComponent} SelectD={SelectedProp} Calls={Call}></EditInstituton>
      )}
    </div>
  );
}
export default Portfolio;
