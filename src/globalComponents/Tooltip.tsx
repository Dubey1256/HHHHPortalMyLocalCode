import * as React from 'react';
import Popup from 'reactjs-popup';
import "bootstrap/dist/css/bootstrap.min.css";
import { FaCommentAlt, FaQuestion, FaBars } from 'react-icons/fa';
//import { MdHelp } from 'react-icons/md';
import { BiMenu } from 'react-icons/bi';

import { Web } from "sp-pnp-js";
import Feedback from 'react-bootstrap/esm/Feedback';
import CreateMeetingPopup from './CreateMeetingPopup';
var completeUrl=''
var PageUrl = ''
var Test = ''
var Href = ''
var FeedBackURl: any = ''
var ComponentData:any={
  Id:null,
  Title:null,
  Portfolio_x0020_Type:null
}
function Tooltip(props: any) {


  const [projectId, setprojectId] = React.useState(null)
  const [IsComponent, setIsComponent] = React.useState(false);
  const [SharewebComponent, setSharewebComponent] = React.useState('');
  const [IsTask, setIsTask] = React.useState(false);
  const isServiceTask = props.IsServiceTask;

  // React.useEffect(() => {
  //   getQueryVariable((e: any) => e)},
  //       []);
  const feedbackInitial = async (itemType: any) => {
    getQueryVariable((e: any) => e)
    if (itemType === 'HHHH Feedback SP') {
     
      
      if (PageUrl != undefined && PageUrl != null) {
        if (PageUrl == '/sitepages/team-portfolio.aspx') {
          PageUrl = '/sitepages/component-portfolio.aspx';
        }
    
          let res=[];
          const web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/SP');
          if(props?.ComponentId!=undefined){
            res = await web.lists.getById('EC34B38F-0669-480A-910C-F84E92E58ADF').items
            .select("Id,Title")
            .filter("Id eq " + props?.ComponentId)
            .get();
            ComponentData=res[0]
          }else{
            res = await web.lists.getById('EC34B38F-0669-480A-910C-F84E92E58ADF').items
            .select("Id,Title")
            .filter("FoundationPageUrl eq '" + PageUrl + "'")
            .get();
            ComponentData=res[0]
          }
       
          if (ComponentData?.Id != undefined) {
            window.open(`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/CreateTask.aspx?ComponentID=` + ComponentData?.Id + "&Siteurl=" + Href);
          }
      

      }
    }
    if (itemType === 'HHHH Bug') {
      if (PageUrl != undefined && PageUrl != null) {
        if (PageUrl == '/sitepages/team-portfolio.aspx') {
          PageUrl = '/sitepages/component-portfolio.aspx';
        }
    
          let res=[];
          const web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/SP');
          if(props?.ComponentId!=undefined){
            res = await web.lists.getById('EC34B38F-0669-480A-910C-F84E92E58ADF').items
            .select("Id,Title")
            .filter("Id eq " + props?.ComponentId)
            .get();
            ComponentData=res[0]
          }else{
            res = await web.lists.getById('EC34B38F-0669-480A-910C-F84E92E58ADF').items
            .select("Id,Title")
            .filter("FoundationPageUrl eq '" + PageUrl + "'")
            .get();
            ComponentData=res[0]
          }
        
        if (ComponentData?.Id != undefined) {
          window.open(`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Create-Bug.aspx?ComponentID=${ComponentData?.Id}` + "&ComponentTitle=" + ComponentData?.Title + "&Siteurl=" + Href);
        }
        else {
          window.open(`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Create-Bug.aspx?ComponentTitle=${ComponentData?.Title}`);
        }

      }
    }
    if (itemType === 'HHHH Design') {
      if (PageUrl != undefined && PageUrl != null) {
        if (PageUrl == '/sitepages/team-portfolio.aspx') {
          PageUrl = '/sitepages/component-portfolio.aspx';
        }
    
          let res=[];
          const web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/SP');
          if(props?.ComponentId!=undefined){
            res = await web.lists.getById('EC34B38F-0669-480A-910C-F84E92E58ADF').items
            .select("Id,Title")
            .filter("Id eq " + props?.ComponentId)
            .get();
            ComponentData=res[0]
          }else{
            res = await web.lists.getById('EC34B38F-0669-480A-910C-F84E92E58ADF').items
            .select("Id,Title")
            .filter("FoundationPageUrl eq '" + PageUrl + "'")
            .get();
            ComponentData=res[0]
          }
      
        if (ComponentData?.Id != undefined) {
          window.open(`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Create-Design.aspx?ComponentID=${ComponentData?.Id}` + "&ComponentTitle=" + ComponentData?.Title + "&Siteurl=" + Href);
        }
        else {
          window.open(`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Create-Design.aspx?ComponentTitle=${ComponentData?.Title}`);
        }
      }
    }
    if (itemType === 'HHHH Quick') {
      if (PageUrl != undefined && PageUrl != null) {
        
        if (PageUrl == '/sitepages/team-portfolio.aspx') {
          PageUrl = '/sitepages/component-portfolio.aspx';
        }
    
          let res=[];
          const web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/SP');
          if(props?.ComponentId!=undefined){
            res = await web.lists.getById('EC34B38F-0669-480A-910C-F84E92E58ADF').items
            .select("Id,Title")
            .filter("Id eq " + props?.ComponentId)
            .get();
            ComponentData=res[0]
          }else{
            res = await web.lists.getById('EC34B38F-0669-480A-910C-F84E92E58ADF').items
            .select("Id,Title")
            .filter("FoundationPageUrl eq '" + PageUrl + "'")
            .get();
            ComponentData=res[0]
          }
        if (ComponentData?.Id != undefined) {
          window.open(`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/CreateQuickTask.aspx?ComponentID=` + ComponentData?.Id + "&ComponentTitle=" + ComponentData?.Title + "&Siteurl=" + Href);
        }
        else {
          alert('Component not exist for this relevant page');
        }

      }
    }
    if (itemType === 'HHHH Component Page') {
      if (PageUrl != undefined && PageUrl != null) {
        if (PageUrl == '/sitepages/team-portfolio.aspx') {
          PageUrl = '/sitepages/component-portfolio.aspx';
        }
    
          let res=[];
          const web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/SP');
          if(props?.ComponentId!=undefined){
            res = await web.lists.getById('EC34B38F-0669-480A-910C-F84E92E58ADF').items
            .select("Id,Title")
            .filter("Id eq " + props?.ComponentId)
            .get();
            ComponentData=res[0]
          }else{
            res = await web.lists.getById('EC34B38F-0669-480A-910C-F84E92E58ADF').items
            .select("Id,Title")
            .filter("FoundationPageUrl eq '" + PageUrl + "'")
            .get();
            ComponentData=res[0]
          }
       
        if (ComponentData?.Id != undefined) {
          window.open(`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=${ComponentData?.Id}`);
        }


      }

    }
    if (itemType === 'Call Notes') {
      if (PageUrl != undefined && PageUrl != null) {
        if (PageUrl == '/sitepages/team-portfolio.aspx') {
          PageUrl = '/sitepages/component-portfolio.aspx';
        }

        const web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/SP');

        const res = await web.lists.getById('EC34B38F-0669-480A-910C-F84E92E58ADF').items
          .select("Id,Title,Portfolio_x0020_Type")
          .filter("FoundationPageUrl eq '" + PageUrl + "'")
          .get();
          ComponentData=res[0];
        console.log(res)
        if (ComponentData?.Id != undefined) {
          var componentID = ComponentData.Id
          var componentTitle = ComponentData.Title
          var PortfolioType = ComponentData.Portfolio_x0020_Type

        }
        var Component: any = {}
        Component['componentID'] = componentID
        Component['componentTitle'] = componentTitle
        Component['PortfolioType'] = PortfolioType


      }
      setSharewebComponent(Component);
      setIsComponent(true);


    }

  }



  let currentUrl = 'https://hhhhteams.sharepoint.com/sites/HHHH/SP'


 
  function getQueryVariable(variable: any) {

    var query = window.location.search.substring(1);

    console.log(query)
    //Test = 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/CreateTask.aspx'
    var vars = query.split("&");
    Href = window.location.href;
    // Href = Href.toLowerCase().split('?')[0]
    Href = Href.split('#')[0];
    const parts = window.location.href.toLowerCase().split("/");
    const sitePagesIndex = parts.indexOf("sites");
    completeUrl = parts.slice(sitePagesIndex).join("/");
    let foundationUrl: any = completeUrl.toLowerCase().split("/");
    let foundationPageIndex = foundationUrl.indexOf("sitepages")
    foundationUrl = foundationUrl.slice(foundationPageIndex).join("/")
    PageUrl = foundationUrl.toLowerCase().split('?')[0];
    PageUrl='/'+PageUrl;
    PageUrl=PageUrl.split('#')[0];
    console.log(vars)
    return (false);
  }

  const Call = React.useCallback(() => {
    setIsComponent(false);
    setIsTask(false);
  }, []);


  return (
    <>
      <Popup
        trigger={
          <button type='button' className='burgerMenu'><span className="svg__iconbox svg__icon--burgerMenu"></span></button>
        }
        position="left top"
        on="hover"
        closeOnDocumentClick
        mouseLeaveDelay={300}
        mouseEnterDelay={0}
        // contentStyle={{ padding: '0px', border: '1px' }}
        arrow={false}
        className='feedbackpanel'
      >
        {/* {isShown && ( */}
        <div className={isServiceTask ? 'dropdown-menu show dropdown-menu-end toolmenubox serviepannelgreena' :'dropdown-menu show dropdown-menu-end toolmenubox'}>
          <a className='dropdown-item hreflink' onClick={() => feedbackInitial('HHHH Feedback SP')}> <span className="svg__iconbox  svg__icon--Comments"></span> HHHH Feedback SP</a>
          <a className='dropdown-item hreflink' onClick={() => feedbackInitial('HHHH Bug')}> <span className="svg__iconbox  svg__icon--Comments"></span> HHHH Bug</a>
          <a className='dropdown-item hreflink' onClick={() => feedbackInitial('HHHH Design')}> <span className="svg__iconbox  svg__icon--Comments"></span> HHHH Design</a>
          <a className='dropdown-item hreflink' onClick={() => feedbackInitial('HHHH Quick')}> <span className="svg__iconbox  svg__icon--Comments"></span> HHHH Quick</a>
          <a className='dropdown-item hreflink' onClick={() => feedbackInitial('HHHH Component Page')}> <span className="svg__iconbox  svg__icon--Comments"></span> HHHH Component Page</a>

          <a className='dropdown-item hreflink' onClick={(e) => feedbackInitial('Call Notes')}> <span className="svg__iconbox  svg__icon--Comments"></span> Call Notes</a>

          <a className='dropdown-item hreflink' onClick={() => feedbackInitial('Admin Help')}> <span className="svg__iconbox  svg__icon--help-fill"></span> Admin Help</a>
          <a className='dropdown-item hreflink' onClick={() => feedbackInitial('Help')}> <span className="svg__iconbox  svg__icon--help-fill"></span> Help</a>
        </div>

      </Popup>

      {IsComponent && <CreateMeetingPopup Item={SharewebComponent} Call={Call}></CreateMeetingPopup>}
    </>
  )

}
export default Tooltip;