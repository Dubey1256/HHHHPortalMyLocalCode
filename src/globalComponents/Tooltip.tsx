import * as React from 'react';
import Popup from 'reactjs-popup';
import "bootstrap/dist/css/bootstrap.min.css";
import { FaCommentAlt, FaQuestion, FaBars } from 'react-icons/fa';
//import { MdHelp } from 'react-icons/md';
import { BiMenu } from 'react-icons/bi';
import { myContextValue } from './globalCommon'
import { Web } from "sp-pnp-js";
import Feedback from 'react-bootstrap/esm/Feedback';
import CallNotes from './CreateMeetingPopup';
import * as globalCommon from './globalCommon'
var completeUrl = ''
var PageUrl = ''
var Test = ''
var Href = ''
var FeedBackURl: any = ''
let pageContent: any
var IsSameSite = false
var ComponentData: any = {
  Id: null,
  Title: null,
  Portfolio_x0020_Type: null
}
function Tooltip(props: any) {
  const [projectId, setprojectId] = React.useState(null)
  const [OpenCallNotes, setOpenCallNotes] = React.useState(false);
  const [CMSToolComponent, setCMSToolComponent] = React.useState('');
  const [currentbrowser, setcurrentbrowser] = React.useState('');
  const [allowLabelEdit, setAllowLabelEdit] = React.useState(false);
  
  const isServiceTask = props.IsServiceTask;
  
  const loadSiteUrl = async () => {
    pageContent = await globalCommon.pageContext()
  }

  React.useEffect(() => {
    loadSiteUrl();
  }, [])

  React.useEffect(() => {
    var userAgent = navigator.userAgent;
    let grueneTopNavBrowser = userAgent;
      try {
        let sessionData: any = localStorage.getItem('grueneTopNavBrowser');
        try {
          if (sessionData != null) {
            sessionData = JSON.parse(sessionData);
            sessionData = sessionData[0]
            grueneTopNavBrowser = sessionData
          } else {
            if (userAgent.indexOf("Firefox") !== -1) {
              grueneTopNavBrowser = 'firefox:';
            } else if (userAgent.indexOf("Chrome") !== -1) {
              grueneTopNavBrowser = 'googlechrome://';
            } else if (userAgent.indexOf("Edge") !== -1) {
              grueneTopNavBrowser = 'microsoft-edge:';
            }
          }
        } catch (e) {
  
        }
        setcurrentbrowser(grueneTopNavBrowser);
      } catch {
        if (userAgent.indexOf("Firefox") !== -1) {
          setcurrentbrowser('firefox:')
        } else if (userAgent.indexOf("Chrome") !== -1) {
          setcurrentbrowser('googlechrome://')
        } else if (userAgent.indexOf("Edge") !== -1) {
          setcurrentbrowser('microsoft-edge:')
        }
      }     
  }, [])

  const feedbackInitial = async (itemType: any) => {
    getQueryVariable((e: any) => e)
    if (itemType === 'HHHH Feedback SP') {
      if (PageUrl != undefined && PageUrl != null) {
        if (props?.ComponentId != undefined && pageContent?.WebFullUrl.indexOf("hhhhteams") > -1) {
          window.open(`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/CreateTask.aspx?ComponentID=` + props?.ComponentId + "&Siteurl=" + Href);
        }
        else if (props?.ComponentId && pageContent?.WebFullUrl.indexOf("hhhhteams") == -1){
          window.open((IsSameSite ? "" : currentbrowser) + "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/CreateTask.aspx?ComponentID="+ props?.ComponentId + "&Siteurl=" + Href);
        }
      }

    }
    if (itemType === 'HHHH Bug') {
      if (PageUrl != undefined && PageUrl != null) {
        if (props?.ComponentId != undefined && pageContent?.WebFullUrl.indexOf("hhhhteams") > -1) {
          window.open(`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/CreateTask.aspx?ComponentID=${props?.ComponentId}`+ "&TaskType=Bug" + "&Siteurl=" + Href);
        }
        else if(props?.ComponentId && pageContent?.WebFullUrl.indexOf("hhhhteams") == -1){
          window.open((IsSameSite ? "" : currentbrowser) + `https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/CreateTask.aspx?ComponentID=${props?.ComponentId}` + "&TaskType=Bug" + "&Siteurl=" + Href);
        }
      }

    }
    if (itemType === 'HHHH Design') {
      if (PageUrl != undefined && PageUrl != null) {
        if (props?.ComponentId!= undefined && pageContent?.WebFullUrl.indexOf("hhhhteams") > -1) {
          window.open(`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/CreateTask.aspx?ComponentID=${props?.ComponentId}` + "&TaskType=Design" + "&Siteurl=" + Href);
        }
        else if(props?.ComponentId && pageContent?.WebFullUrl.indexOf("hhhhteams") == -1){
          window.open((IsSameSite ? "" : currentbrowser) + `https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/CreateTask.aspx?ComponentID=${props?.ComponentId}` + "&TaskType=Design" + "&Siteurl=" + Href);
        }
      }

    }
    if (itemType === 'HHHH UX') {
      if (PageUrl != undefined && PageUrl != null) {
        if (props?.ComponentId!= undefined && pageContent?.WebFullUrl.indexOf("hhhhteams") > -1) {
          window.open(`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/CreateTask.aspx?ComponentID=${props?.ComponentId}` + "&TaskType=UX" + "&Siteurl=" + Href);
        }
        else if(props?.ComponentId && pageContent?.WebFullUrl.indexOf("hhhhteams") == -1){
          window.open((IsSameSite ? "" : currentbrowser) + `https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/CreateTask.aspx?ComponentID=${props?.ComponentId}` + "&TaskType=UX" + "&Siteurl=" + Href);
        }
      }

    }
    if (itemType === 'HHHH Quick') {
      if (PageUrl != undefined && PageUrl != null) {
        if (props?.ComponentId != undefined && pageContent?.WebFullUrl.indexOf("hhhhteams") > -1) {
          window.open(`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/CreateQuickTask.aspx?ComponentID=` + props?.ComponentId + "&Siteurl=" + Href);
        }
        else if(props?.ComponentId && pageContent?.WebFullUrl.indexOf("hhhhteams") == -1){
          window.open((IsSameSite ? "" : currentbrowser) + `https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/CreateQuickTask.aspx?ComponentID=` + props?.ComponentId + "&Siteurl=" + Href);
        }
        else {
          alert('Component not exist for this relevant page');
        }
      }

    }
    if (itemType === 'HHHH Component Page') {
      if (PageUrl != undefined && PageUrl != null) {
        if (props?.ComponentId != undefined && pageContent?.WebFullUrl.indexOf("hhhhteams") > -1) {
          window.open(`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=${props?.ComponentId}`);
        }
        else if(props?.ComponentId && pageContent?.WebFullUrl.indexOf("hhhhteams") == -1){
          window.open((IsSameSite ? "" : currentbrowser) + `https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=${props?.ComponentId}`);
        }
      }

    }
    if (itemType === 'Call Notes') {
      if (PageUrl != undefined && PageUrl != null) {
        try{
        let res = [];
        const web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/SP');
        if (props?.ComponentId != undefined) {
          res = await web.lists.getByTitle('Master Tasks').items
            .select("Id,Title")
            .filter("Id eq " + props?.ComponentId)
            .get();
          ComponentData = res[0]
        } else {
          res = await web.lists.getByTitle('Master Tasks').items
            .select("Id,Title")
            .filter("FoundationPageUrl eq '" + PageUrl + "'")
            .get();
          ComponentData = res[0]
          console.log(res)
        }
        }
        catch(error){
          console.log(error)
        }
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
      setCMSToolComponent(Component);
      setOpenCallNotes(true);
    }
    IsSameSite = false
  }

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
    PageUrl = '/' + PageUrl;
    PageUrl = PageUrl.split('#')[0];
    console.log(vars)
    return (false);
  }

  const setDefaultBrowser = (browserName: any) => {
    if (browserName) {
      if (browserName == currentbrowser) {
        IsSameSite = true
      }
      let toBeSetLocally: any = JSON.stringify([browserName]);
      localStorage.setItem('grueneTopNavBrowser', toBeSetLocally)
    }
    setcurrentbrowser(browserName);
    $(".showBrowsers").css("display", "none");
  }
  const handleMouseEnter = () => {
    $(".showBrowsers").css("display", "block");
  }

  const callNotesCallBack = () => {
    setOpenCallNotes(false);
  }


  return (
    <myContextValue.Provider value={{ ...myContextValue, createNotesCallback: callNotesCallBack }}>
      <>
        <Popup
          trigger={
            <button type='button' className='burgerMenu d-flex ms-1'><span className="svg__iconbox svg__icon--burgerMenu"></span></button>
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
          <div className={isServiceTask ? 'dropdown-menu show dropdown-menu-end toolmenubox serviepannelgreena' : 'dropdown-menu show dropdown-menu-end toolmenubox'}>
              
              <a className='dropdown-item hreflink' onClick={() => feedbackInitial('HHHH Feedback SP')}><span className="svg__iconbox  svg__icon--Comments mr-4"></span>HHHH Feedback SP</a>
              <a className='dropdown-item hreflink' onClick={() => feedbackInitial('HHHH Bug')}><span className="svg__iconbox  svg__icon--Comments mr-4"></span>HHHH Bug</a>
              <a className='dropdown-item hreflink' onClick={() => feedbackInitial('HHHH Design')}><span className="svg__iconbox  svg__icon--Comments mr-4"></span>HHHH Design</a>
              <a className='dropdown-item hreflink' onClick={() => feedbackInitial('HHHH UX')}><span className="svg__iconbox  svg__icon--Comments mr-4"></span>HHHH UX - New</a>
              <a className='dropdown-item hreflink' onClick={() => feedbackInitial('HHHH Quick')} ><span className="svg__iconbox  svg__icon--Comments mr-4"></span>HHHH Quick</a>
              <a className='dropdown-item hreflink' onClick={() => feedbackInitial('HHHH Component Page')} ><span className="svg__iconbox  svg__icon--Comments mr-4"></span>HHHH Component Page</a>
              <a className='dropdown-item hreflink' onClick={(e) => feedbackInitial('Call Notes')}> <span className="svg__iconbox  svg__icon--Comments mr-4"></span>Call Notes</a>
              <a className='dropdown-item hreflink' onClick={() => feedbackInitial('Admin Help')}> <span className="svg__iconbox  svg__icon--help-fill mr-4"></span>Admin Help</a>
              <a className='dropdown-item hreflink' onClick={() => feedbackInitial('Help')}> <span className="svg__iconbox  svg__icon--help-fill mr-4"></span>Help</a>
              {(props.ShowPencilIcon==true || props.ShowPencilIcon==false) && <a className='dropdown-item hreflink' onClick={() => { setAllowLabelEdit(!allowLabelEdit); props?.setShowPencilIcon(!allowLabelEdit)}}> <span className="svg__iconbox  svg__icon--help-fill mr-4"></span>{allowLabelEdit == true ? 'Stop Editing' : 'Edit Labels'}</a>}
              {pageContent?.WebFullUrl.indexOf("hhhhteams") == -1 && <li>
              <a className='dropdown-item hreflink' onMouseEnter={() => { handleMouseEnter() }} ><span className="svg__iconbox  svg__icon--help-fill mr-4"></span>Browser Setting</a>
                <div className="dropdown-submenu dropdown-menu-level-1 showBrowsers" onMouseLeave={() => $(".showBrowsers").css("display", "none")} style={{ display: "none" }}>
                  <ul className="dropdown-menu-item">
                    <li className="dropdown-submenu" onClick={() => setDefaultBrowser('googlechrome://')} ><a className='dropdown-item' ><input type="checkbox" className='form-check-input' name="" id="" checked={currentbrowser == 'googlechrome://'} /><FaCommentAlt /> Chrome</a></li>
                    <li className="dropdown-submenu" onClick={() => setDefaultBrowser('microsoft-edge:')}><a className='dropdown-item' ><input type="checkbox" className='form-check-input' name="" id="" checked={currentbrowser == 'microsoft-edge:'} /><FaCommentAlt /> Edge</a></li>
                    <li className="dropdown-submenu" onClick={() => setDefaultBrowser('firefox:')}><a className='dropdown-item' ><input type="checkbox" className='form-check-input' name="" id="" checked={currentbrowser == 'firefox:'} /><FaCommentAlt /> Firefox</a></li>
                  </ul>
                </div>
              </li>}
          </div>

        </Popup>

        {OpenCallNotes && <CallNotes Item={CMSToolComponent} callback={callNotesCallBack} />}
      </>
    </myContextValue.Provider>
  )

}
export default Tooltip;
export { myContextValue }
