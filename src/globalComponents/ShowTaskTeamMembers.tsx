import * as React from "react";

// import teamsImg from '../Assets/ICON/Teams-Logo.png'; 
var siteUrl = ''

function ShowTaskTeamMembers(item: any) {

  siteUrl =
 item.props?.siteUrl != undefined
? item?.props?.siteUrl
 : item?.Context?.Siteurl;
  const [Display, setDisplay] = React.useState("none");
  const [taskData, settaskData] = React.useState<any>()
  let TaskUsers: any = [];
//  let  taskDetails = item?.props;
  TaskUsers = item?.TaskUsers;
  const GetUserObjectFromCollection = (UsersValues: any) => {
    let userDeatails = [];
    for (let index = 0; index < UsersValues?.length; index++) {
      let senderObject:any = TaskUsers?.filter(function (user: any, i: any) {
        if (user?.AssingedToUser != undefined) {
          return user?.AssingedToUser["Id"] == UsersValues[index]?.Id
        }
      });
      if (senderObject.length > 0) {
        userDeatails.push({
          'Id': senderObject[0]?.AssingedToUser.Id,
          'Name': senderObject[0]?.Email,
          'Suffix': senderObject[0]?.Suffix,
          'Title': senderObject[0]?.Title,
          'userImage': senderObject[0]?.Item_x0020_Cover?.Url,
          'activeimg2': UsersValues[index]?.workingMember ? UsersValues[index]?.workingMember : "",
        })
      }

    }
    return userDeatails;
  }
  React.useMemo(() => {
    if(item?.props!=undefined){
      let  taskDetails = item?.props;
      if (taskDetails["AssignedTo"] != undefined) {
        taskDetails["AssignedTo"]?.map((item: any, index: any) => {
          if (taskDetails?.TeamMembers != undefined) {
            for (let i = 0; i < taskDetails?.TeamMembers?.length; i++) {
              if (item.Id == taskDetails?.TeamMembers[i]?.Id) {
                taskDetails?.TeamMembers?.splice(i, true);
                i--;
              }
            }
          }
  
          item.workingMember = "activeimg";
  
        });
      }
      var array2: any = taskDetails["AssignedTo"] != undefined ? taskDetails["AssignedTo"] : [];
      if (taskDetails["TeamMembers"] != undefined) {
        taskDetails.array = array2.concat(taskDetails["TeamMembers"]?.filter((item: any) => array2?.Id != item?.Id))
      } else {
        taskDetails.array = array2;
      }
  
      taskDetails.TeamLeader = taskDetails["ResponsibleTeam"] != null && taskDetails["ResponsibleTeam"].length>0? GetUserObjectFromCollection(taskDetails["ResponsibleTeam"]) : null;
  
      taskDetails.TeamMembers = taskDetails?.array != null &&  taskDetails?.array.length>0? GetUserObjectFromCollection(taskDetails.array) : null;
      settaskData(taskDetails)
    }
    
  }, [item?.props!=undefined])
 
  const handleSuffixHover = () => {
    //e.preventDefault();
    setDisplay("block")

  }
  const handleuffixLeave = () => {
    setDisplay("none")
  }



  return (
    <>
      <div className='full-width'>

        <div className="d-flex align-items-center">
          {taskData?.TeamLeader != null && taskData?.TeamLeader?.length > 0 && taskData?.TeamLeader?.map((rcData: any, i: any) => {
            return <div className="user_Member_img"><a href={`${siteUrl}/SitePages/TaskDashboard.aspx?UserId=${rcData?.Id}&Name=${rcData?.Title}`} target="_blank" data-interception="off" title={rcData?.Title}>
              {rcData.userImage != null && <img className="workmember" src={rcData?.userImage}></img>}
              {rcData.userImage == null && <span className="workmember bg-fxdark" >{rcData?.Suffix}</span>}
            </a>
            </div>
          })}
        {(taskData?.TeamLeader==null && taskData?.TeamLeader==undefined)&&(taskData?.TeamMembers != null && taskData?.TeamMembers?.length > 0) && <div className="user_Member_img">
                <span className="workmember d-flex clearfix" ></span>
                <span className="workmember bg-fxdark" ></span>
        
         </div>}

          {taskData?.TeamMembers != null && taskData?.TeamMembers?.length > 0 &&
            <div className="img  "><a href={`${siteUrl}/SitePages/TaskDashboard.aspx?UserId=${taskData?.TeamMembers[0]?.Id}&Name=${taskData?.TeamMembers[0]?.Title}`} target="_blank" data-interception="off" title={taskData?.TeamMembers[0]?.Title}>
              {taskData?.TeamMembers[0].userImage != null && <img className={`workmember ${taskData?.TeamMembers[0].activeimg2}`} src={taskData?.TeamMembers[0]?.userImage}></img>}
              {taskData?.TeamMembers[0].userImage == null && <span className={`workmember ${taskData?.TeamMembers[0].activeimg2}bg-fxdark border bg-e9 p-1 `} >{taskData?.TeamMembers[0]?.Suffix}</span>}
            </a>
            </div>
          }

          {taskData?.TeamMembers != null && taskData?.TeamMembers?.length == 2 && <div className="img mx-2"><a href={`${siteUrl}/SitePages/TaskDashboard.aspx?UserId=${taskData?.TeamMembers[1]?.Id}&Name=${taskData?.TeamMembers[1]?.Title}`} target="_blank" data-interception="off" title={taskData?.TeamMembers[1]?.Title}>
            {taskData?.TeamMembers[1]?.userImage != null && <img className={`workmember ${taskData?.TeamMembers[1]?.activeimg2}`} src={taskData?.TeamMembers[1]?.userImage}></img>}
            {taskData?.TeamMembers[1]?.userImage == null && <span className={`workmember ${taskData?.TeamMembers[1]?.activeimg2}bg-fxdark border bg-e9 p-1`} >{taskData?.TeamMembers[1]?.Suffix}</span>}
          </a>
          </div>
          }
          {taskData?.TeamMembers != null && taskData?.TeamMembers?.length > 2 &&
            <div className="position-relative user_Member_img_suffix2 ms-1 alignCenter" onMouseOver={(e) => handleSuffixHover()} onMouseLeave={(e) => handleuffixLeave()}>+{taskData?.TeamMembers?.length - 1}
              <span className="tooltiptext" style={{ display: Display, padding: '10px' }}>
                <div>
                  {taskData?.TeamMembers?.slice(1)?.map((rcData: any, i: any) => {

                    return <div className=" mb-1 team_Members_Item" style={{ padding: '2px' }}>
                      <a href={`${siteUrl}/SitePages/TaskDashboard.aspx?UserId=${rcData?.Id}&Name=${rcData?.Title}`} target="_blank" data-interception="off">

                        {rcData?.userImage != null && <img className={`workmember ${rcData?.activeimg2}`} src={rcData?.userImage}></img>}
                        {rcData?.userImage == null && <span className={`workmember ${rcData?.activeimg2}bg-fxdark border bg-e9 p-1`}>{rcData?.Suffix}</span>}

                        <span className='mx-2'>{rcData?.Title}</span>
                      </a>
                    </div>

                  })
                  }

                </div>
              </span>
            </div>
          }

        </div>


      </div>
    </>
  );
}
export default ShowTaskTeamMembers;