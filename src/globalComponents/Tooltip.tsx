import * as React from 'react';
import Popup from 'reactjs-popup';
import "bootstrap/dist/css/bootstrap.min.css";
import { FaCommentAlt, FaQuestion, FaBars } from 'react-icons/fa';
import { BiMenu } from 'react-icons/bi';
var PageUrl =''
function Tooltip() {
  const [projectId, setProjectId] = React.useState(null)
  const feedbackInitial=(itemType:any)=>{
 // if(itemType === 'HHHH Feedback SP){
  //   if (PageUrl != undefined && PageUrl != null) {
  //     if (PageUrl == '/sitepages/team-portfolio.aspx') {
  //       PageUrl = '/sitepages/component-portfolio.aspx';
  //     }
  //     SharewebListService.getRequest($scope.SpSiteUrl, "/getbyId('" + $scope.SpMasterTaskListId + "')/items?$select=Id&$filter=FoundationPageUrl eq '" + $scope.Componentpageurl + "'").then(function (success) {
  //         if (success.d.results != undefined && success.d.results.length > 0) {
  //             $scope.ComponentId = success.d.results[0].Id;
  //         }

  //         if (success.d.results != undefined && success.d.results.length > 0 && $scope.ComponentId != undefined)
  //             window.open($scope.HHHHTeamSiteURL + '/SP/SitePages/CreateTask.aspx?ComponentID=' + $scope.ComponentId + "&Siteurl=" + window.location.href, '_blank');
  //         else
  //             window.open($scope.HHHHTeamSiteURL + '/SP/SitePages/CreateTask.aspx?Siteurl=' + window.location.href, '_blank');
  //     });
  // }
 // else window.open($scope.HHHHTeamSiteURL + '/SP/SitePages/CreateTask.aspx?Siteurl=' + window.location.href, '_blank');
  //}

  }
  let currentUrl ='https://hhhhteams.sharepoint.com/sites/HHHH/SP'
  function getQueryVariable(variable: any) {

    var query = window.location.search.substring(1);

    console.log(query)

    var vars = query.split("&");
    var Href =  window.location.href.toLowerCase().split('?')[0]
    Href = Href.split('#')[0];
     PageUrl = Href.split(currentUrl.toLowerCase())[1];

    console.log(vars)

    for (var i = 0; i < vars.length; i++) {

        var pair = vars[i].split("=");
       var QueryId = pair[1]
       setProjectId(QueryId)

        console.log(pair)

        if (pair[0] == variable) { return pair[1]; }

    }

    return (false);

}
  return (
    <Popup
      trigger={
        <button type='button'><BiMenu /></button>
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
        <a href="#" className='dropdown-item'onClick={()=>feedbackInitial('Call Notes')}><FaCommentAlt /> Call Notes</a>
        <a href="#" className='dropdown-item'onClick={()=>feedbackInitial('Admin Help')}><FaQuestion /> Admin Help</a>
        <a href="#" className='dropdown-item'onClick={()=>feedbackInitial('Help')}><FaQuestion /> Help</a>
      </div>
    </Popup>
  )
}
export default Tooltip;