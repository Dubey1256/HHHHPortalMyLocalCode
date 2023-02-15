import * as React from 'react';
import Popup from 'reactjs-popup';
import "bootstrap/dist/css/bootstrap.min.css";
import { FaCommentAlt, FaQuestion, FaBars } from 'react-icons/fa';
import { BiMenu } from 'react-icons/bi';
import { Web } from "sp-pnp-js";
import Feedback from 'react-bootstrap/esm/Feedback';
import CreateMeetingPopup from './CreateMeetingPopup';

var PageUrl =''
var Test =''
var Href=''
var FeedBackURl:any =''
function Tooltip() {
  const [projectId, setprojectId] = React.useState(null)
  const [IsComponent, setIsComponent] = React.useState(false);
  const [SharewebComponent, setSharewebComponent] = React.useState('');
    const [IsTask, setIsTask] = React.useState(false);

  const feedbackInitial=async (itemType:any)=>{
    getQueryVariable((e:any)=>e)
 if(itemType === 'HHHH Feedback SP'){
    if (PageUrl != undefined && PageUrl != null) {
      if (PageUrl == '/sitepages/team-portfolio.aspx') {
        PageUrl = '/sitepages/component-portfolio.aspx';
      }
   
      const web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/SP');

      const res = await web.lists.getById('EC34B38F-0669-480A-910C-F84E92E58ADF').items
          .select("Id,Title")
          .filter("FoundationPageUrl eq '" + PageUrl + "'")
          .get();
          console.log(res)
          if(res[0].Id != undefined){
            var componentID=res[0].Id

          }
          if(componentID != undefined){
            window.open(`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/CreateTask.aspx?ComponentID=` + componentID + "&Siteurl=" + Href);
          }
  
  }
}
if(itemType === 'HHHH Bug'){
  if (PageUrl != undefined && PageUrl != null) {
    if (PageUrl == '/sitepages/team-portfolio.aspx') {
      PageUrl = '/sitepages/component-portfolio.aspx';
    }
 
    const web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/SP');

    const res = await web.lists.getById('EC34B38F-0669-480A-910C-F84E92E58ADF').items
        .select("Id,Title,Portfolio_x0020_Type")
        .filter("FoundationPageUrl eq '" + PageUrl + "'")
        .get();
        console.log(res)
        if(res[0].Id != undefined){
          var componentID=res[0].Id
          var componentTitle=res[0].Title

        }
        if(componentID != undefined){
          window.open(`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Create-Bug.aspx?ComponentID=${componentID}` + "&ComponentTitle="  +  componentTitle + "&Siteurl=" + Href);
        }
        else{
          window.open(`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Create-Bug.aspx?ComponentTitle=${componentTitle}`);
        }

}
else{
  window.open(`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Create-Bug.aspx?ComponentTitle=${componentTitle}`);
}
}
if(itemType === 'HHHH Design'){
  if (PageUrl != undefined && PageUrl != null) {
    if (PageUrl == '/sitepages/team-portfolio.aspx') {
      PageUrl = '/sitepages/component-portfolio.aspx';
    }
 
    const web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/SP');

    const res = await web.lists.getById('EC34B38F-0669-480A-910C-F84E92E58ADF').items
        .select("Id,Title,Portfolio_x0020_Type")
        .filter("FoundationPageUrl eq '" + PageUrl + "'")
        .get();
        console.log(res)
        if(res[0].Id != undefined){
          var componentID=res[0].Id
          var componentTitle=res[0].Title

        }
        if(componentID != undefined){
          window.open(`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Create-Design.aspx?ComponentID=${componentID}` + "&ComponentTitle=" + componentTitle + "&Siteurl=" + Href);
        }
        else{
          window.open(`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Create-Design.aspx?ComponentTitle=${componentTitle}`);
        }

}
else{
  window.open(`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Create-Design.aspx?ComponentTitle=${componentTitle}`);
}
}
if(itemType === 'HHHH Quick'){
  if (PageUrl != undefined && PageUrl != null) {
    if (PageUrl == '/sitepages/team-portfolio.aspx') {
      PageUrl = '/sitepages/component-portfolio.aspx';
    }
 
    const web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/SP');

    const res = await web.lists.getById('EC34B38F-0669-480A-910C-F84E92E58ADF').items
        .select("Id,Title,Portfolio_x0020_Type")
        .filter("FoundationPageUrl eq '" + PageUrl + "'")
        .get();
        console.log(res)
        if(res[0].Id != undefined){
          var componentID=res[0].Id
          var componentTitle=res[0].Title

        }
        if(componentID != undefined){
          window.open(`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/CreateQuickTask.aspx?ComponentID=${componentID}=` + componentID + "&ComponentTitle="  + componentTitle + "&Siteurl=" + Href);
        }
        else{
          alert('Component not exist for this relevant page');
        }

}
else{
  alert('Component not exist for this relevant page');
}
}
if(itemType === 'HHHH Component Page'){
  if (PageUrl != undefined && PageUrl != null) {
    if (PageUrl == '/sitepages/team-portfolio.aspx') {
      PageUrl = '/sitepages/component-portfolio.aspx';
    }
 
    const web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/SP');

    const res = await web.lists.getById('EC34B38F-0669-480A-910C-F84E92E58ADF').items
        .select("Id,Title,Portfolio_x0020_Type")
        .filter("FoundationPageUrl eq '" + PageUrl + "'")
        .get();
        console.log(res)
        if(res[0].Id != undefined){
          var componentID=res[0].Id
          var componentTitle=res[0].Title

        }
        if(componentID != undefined){
          window.open(`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=${componentID}`);
        }
        

}

}
if(itemType === 'Call Notes'){
  if (PageUrl != undefined && PageUrl != null) {
    if (PageUrl == '/sitepages/team-portfolio.aspx') {
      PageUrl = '/sitepages/component-portfolio.aspx';
    }
 
    const web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/SP');

    const res = await web.lists.getById('EC34B38F-0669-480A-910C-F84E92E58ADF').items
        .select("Id,Title,Portfolio_x0020_Type")
        .filter("FoundationPageUrl eq '" + PageUrl + "'")
        .get();
        console.log(res)
        if(res[0].Id != undefined){
          var componentID=res[0].Id
          var componentTitle=res[0].Title
          var PortfolioType=res[0].Portfolio_x0020_Type

        }
        var Component:any={}
        Component['componentID']=componentID
        Component['componentTitle']=componentTitle
        Component['PortfolioType']=PortfolioType
        

}
setSharewebComponent(Component);
setIsComponent(true);


}

}



  let currentUrl ='https://hhhhteams.sharepoint.com/sites/HHHH/SP'


  function getQueryVariable(variable: any) {

    var query = window.location.search.substring(1);

    console.log(query)
    //Test = 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/CreateTask.aspx'
    var vars = query.split("&");
     Href =  window.location.href.toLowerCase().split('?')[0]
     Href =  Href.toLowerCase().split('?')[0]
    Href = Href.split('#')[0];
     PageUrl = Href.split(currentUrl.toLowerCase())[1];

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
      <button type='button' className='Burgermenu'><BiMenu /></button>
      }
      position="left top"
      on="hover"
      closeOnDocumentClick
      mouseLeaveDelay={300}
      mouseEnterDelay={0}
      contentStyle={{ padding: '0px', border: '1px' }}
      arrow={false}
    >
      {/* {isShown && ( */}
        <div className='dropdown-menu show dropdown-menu-end toolmenu'>
        <a href="#" className='dropdown-item' onClick={()=>feedbackInitial('HHHH Feedback SP')}><FaCommentAlt /> HHHH Feedback SP</a>
        <a href="#" className='dropdown-item' onClick={()=>feedbackInitial('HHHH Bug')}><FaCommentAlt /> HHHH Bug</a>
        <a href="#" className='dropdown-item'onClick={()=>feedbackInitial('HHHH Design')}><FaCommentAlt /> HHHH Design</a>
        <a href="#" className='dropdown-item'onClick={()=>feedbackInitial('HHHH Quick')}><FaCommentAlt /> HHHH Quick</a>
        <a href="#" className='dropdown-item'onClick={()=>feedbackInitial('HHHH Component Page')}><FaCommentAlt /> HHHH Component Page</a>
       
        <a href="#" className='dropdown-item' onClick={(e) =>feedbackInitial('Call Notes')}><FaCommentAlt /> Call Notes</a>
      
        <a href="#" className='dropdown-item'onClick={()=>feedbackInitial('Admin Help')}><FaQuestion /> Admin Help</a>
        <a href="#" className='dropdown-item'onClick={()=>feedbackInitial('Help')}><FaQuestion /> Help</a>
      </div>
     
    </Popup>
    
    {IsComponent && <CreateMeetingPopup Item={SharewebComponent} Call={Call}></CreateMeetingPopup>}
    </>
    )
 
}
export default Tooltip;