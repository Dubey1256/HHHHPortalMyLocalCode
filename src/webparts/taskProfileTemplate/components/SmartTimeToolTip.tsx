import * as React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';

let allTaskUsers:any
const SmartTooltipComponent = (props:any) => {
const [hoverDetails,setHoverDetails]:any=React.useState();
React.useEffect(()=>{
    allTaskUsers=  props?.allTaskUsers;
    console.log(allTaskUsers)
    let hoverData= allTaskUsers.find((user:any)=>user?.AssingedToUser?.Id==props?.items?.AuthorId)
    setHoverDetails(hoverData)
    console.log(hoverDetails)

},[props?.items!=undefined])
  const TootltipDetails=()=>{
    return(
      <div className='col-sm-12 row'>
      <div className='col-sm-4'>
      {hoverDetails?.Title}
      </div>
      <div className='col-sm-4'>
      {hoverDetails?.UserGroup?.Title}
      </div>
      <div className='col-sm-4'>
      ({hoverDetails?.Team})
      </div>
      </div>
    )
  }
  return (
    <>
         {console.log(hoverDetails)}
        <Tooltip title={TootltipDetails()} arrow>
        <a href={`${props["siteUrl"]}/SitePages/TaskDashboard.aspx?UserId=${props?.items?.AuthorId}&Name=${props?.items?.AuthorName}`} target="_blank" data-interception="off" title={props?.items?.AuthorName}>{props?.items?.AuthorName}</a>
         </Tooltip>
    
    </>
  );
};

export default SmartTooltipComponent;