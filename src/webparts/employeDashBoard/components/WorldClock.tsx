import * as React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';

// import { Tooltip } from 'react-tooltip';

import { Button, ButtonToolbar, OverlayTrigger,Popover, Tooltip } from 'react-bootstrap';
import moment from 'moment';

const WorldClock = () => {

 
  const [countryDetails, setCountryDetails] = useState<any>([{
    country:"India",
    Image:"https://flagcdn.com/in.svg",
    currentCuntry:false,
    Time:""
   },{
    country:"Germany",
    Image:"https://flagcdn.com/de.svg",
    currentCuntry:false,
    Time:""
   },{
    country:"Switzerland",
    Image:"https://flagcdn.com/ch.svg",
    currentCuntry:false,
    Time:""
   }]);
  const [time, setTime] = useState('Loading...');
// console.log(countryDetails)
  
  useEffect(() => {
  
    
    fetchUserCountry()
    displayTime();
  }, []); 
  const fetchUserCountry = async () => {
    
      const response = await axios.get('https://ipinfo.io/json');
      const { CurrentcountryLogin } = response.data;
    // console.log(response.data)
    let data=countryDetails;
    data?.map((item:any)=>{
      if( response.data.country=="IN"&&item.country=="India"){
          item.currentCuntry=true;
      }
      if(response.data.country=="Switzerland"){
      
      }
      if(response.data.country=="India"){
       
      }
   })
   
   setCountryDetails(data)
    }

    const displayTime =()=>{
       
     var data= [...countryDetails];
     const I = new Date();
    //  console.log(I)
     const localTime2 = I.getTime();
     const localOffset2 = I.getTimezoneOffset() * 60000;
     
     const utc2 = localTime2 + localOffset2;
     
     const isDST = (date:any) => {
       const year = date.getFullYear();
       const dstStart = new Date(year, 2, 31 - ((5 * year / 4 + 4) % 7), 2, 0, 0, 0); 
       const dstEnd = new Date(year, 9, 31 - ((5 * year / 4 + 1) % 7), 3, 0, 0, 0);  
       return date >= dstStart && date < dstEnd;
     };
     
     // for Germany
     const isDaylightSavingTime = isDST(I);
     const offset = isDaylightSavingTime ? 2 : 1;
     const germany = utc2 + (3600000 * offset);
     const germanyTimeNow = new Date(germany).toLocaleString('en-US', { hour12: true });
    //  console.log("Current time in Germany:", germanyTimeNow);
  
  
     
     // for Switzerland
     const isDaylightSavingTime1 = isDST(I);
     const offset1 = isDaylightSavingTime1 ? 2 : 1;
     const switzerland = utc2 + (3600000 * offset1);
     const switzerlandTimeNow = new Date(switzerland).toLocaleString('en-US', { hour12: true });
    //  console.log("Current time in Switzerland:", switzerlandTimeNow);
     
    
    

      
      const indianTimeFormatter = new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata', // Use 'Asia
        hour12: true, 
        // weekday: 'long', 
        // year: 'numeric', 
        // month: 'long', 
        // day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit', 
      });

      // Format the current date and time in IST
      const currentTimeInIndia = indianTimeFormatter.format(I);
     data?.map((item:any)=>{
      if(item.country=="Germany"){
        item .Time=germanyTimeNow.split(',')[1]
      }
      if(item.country=="Switzerland"){
        item .Time=switzerlandTimeNow.split(',')[1]
      }
      if(item.country=="India"){
    // console.log(currentTimeInIndia)
        item .Time= currentTimeInIndia
      }
   })

   setCountryDetails(data)
    }
  
    setInterval(displayTime,1000)
 
  // const popoverHoverFocus = (
  //   <Popover id="popover-trigger-hover-focus" title="Popover bottom">
  //    {countryDetails?.map((items:any)=>{
  //       return(
  //         <>
  //          <div>
  //           <span ><img className='workmember' src={items.Image}/></span> 
  //           <span>{items?.country}</span>
  //           <div className="rounded"style={{backgroundColor:items.currentCuntry?"green":"yellow",height:"10px",width:"10px"}}></div>
  //           <span className="svg__iconbox svg__icon--clock dark"></span>
  //           <span>{items?.Time}</span></div>
     
  //         </>
  //       )
     
  //     })}
  //   </Popover>
  // );
return (


   <>
   
 
     {/* <ButtonToolbar>
    <OverlayTrigger
      trigger={['hover', 'focus']}
      placement="bottom"
      overlay={popoverHoverFocus}
    >
     <span className="me-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-globe"
                viewBox="0 0 16 16"
              >
                <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 0 0 5.145 4H7.5V1.077zM4.09 4a9.267 9.267 0 0 1 .64-1.539 6.7 6.7 0 0 1 .597-.933A7.025 7.025 0 0 0 2.255 4H4.09zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a6.958 6.958 0 0 0-.656 2.5h2.49zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5H4.847zM8.5 5v2.5h2.99a12.495 12.495 0 0 0-.337-2.5H8.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5H4.51zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5H8.5zM5.145 12c.138.386.295.744.468 1.068.552 1.035 1.218 1.65 1.887 1.855V12H5.145zm.182 2.472a6.696 6.696 0 0 1-.597-.933A9.268 9.268 0 0 1 4.09 12H2.255a7.024 7.024 0 0 0 3.072 2.472zM3.82 11a13.652 13.652 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5H3.82zm6.853 3.472A7.024 7.024 0 0 0 13.745 12H11.91a9.27 9.27 0 0 1-.64 1.539 6.688 6.688 0 0 1-.597.933zM8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855.173-.324.33-.682.468-1.068H8.5zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.65 13.65 0 0 1-.312 2.5zm2.802-3.5a6.959 6.959 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5h2.49zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7.024 7.024 0 0 0-3.072-2.472c.218.284.418.598.597.933zM10.855 4a7.966 7.966 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4h2.355z" />
              </svg>
            </span>
    </OverlayTrigger></ButtonToolbar> */}
  <span className='hover-text mt--5 me-2'>
    <svg xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="#333333"
                  className="bi bi-globe"
                  viewBox="0 0 16 16"
                >
                  <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 0 0 5.145 4H7.5V1.077zM4.09 4a9.267 9.267 0 0 1 .64-1.539 6.7 6.7 0 0 1 .597-.933A7.025 7.025 0 0 0 2.255 4H4.09zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a6.958 6.958 0 0 0-.656 2.5h2.49zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5H4.847zM8.5 5v2.5h2.99a12.495 12.495 0 0 0-.337-2.5H8.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5H4.51zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5H8.5zM5.145 12c.138.386.295.744.468 1.068.552 1.035 1.218 1.65 1.887 1.855V12H5.145zm.182 2.472a6.696 6.696 0 0 1-.597-.933A9.268 9.268 0 0 1 4.09 12H2.255a7.024 7.024 0 0 0 3.072 2.472zM3.82 11a13.652 13.652 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5H3.82zm6.853 3.472A7.024 7.024 0 0 0 13.745 12H11.91a9.27 9.27 0 0 1-.64 1.539 6.688 6.688 0 0 1-.597.933zM8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855.173-.324.33-.682.468-1.068H8.5zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.65 13.65 0 0 1-.312 2.5zm2.802-3.5a6.959 6.959 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5h2.49zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7.024 7.024 0 0 0-3.072-2.472c.218.284.418.598.597.933zM10.855 4a7.966 7.966 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4h2.355z" />
      </svg>
    <span className='tooltip-text pop-left'>
    {countryDetails?.map((items:any)=>{
        return(
          <>
           <div className='alignCenter border-bottom'>
              <div><img className='workmember' src={items.Image}/></div> 
              <div className='mx-2'>{items?.country}</div>
              <div className="rounded"style={{backgroundColor:items.currentCuntry?"green":"yellow",height:"10px",width:"10px"}}></div>
              <div className='alignCenter ml-auto'>
                <div className="svg__iconbox svg__icon--clock dark mx-2"></div>
                <div>{items?.Time}</div>
              </div>
            </div>
     
          </>
        )
     
      })}
    </span>
  </span>
   
 
    </>
  );
};

export default WorldClock;
