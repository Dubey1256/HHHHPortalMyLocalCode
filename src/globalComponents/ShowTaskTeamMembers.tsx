import moment from "moment";
import * as React from "react";
import { usePopperTooltip } from "react-popper-tooltip";
import "react-popper-tooltip/dist/styles.css";
import { Avatar } from "@fluentui/react-components";
var siteUrl = '';
function ShowTaskTeamMembers(item: any) {
  siteUrl = item.props?.siteUrl != undefined ? item?.props?.siteUrl : item?.Context?.siteurl;
  const [Display, setDisplay] = React.useState("none");
  const [taskData, settaskData] = React.useState<any>();
  const [key, setKey] = React.useState(0);
  const [LeadCount, setLeadCount] = React.useState(0);
  const [controlledVisible, setControlledVisible] = React.useState(false);

  const {
    getArrowProps,
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    visible,
  } = usePopperTooltip({
    trigger: null,
    interactive: true,
    closeOnOutsideClick: false,
    placement: "auto",
    visible: controlledVisible,
    onVisibleChange: setControlledVisible,
  });
  let TaskUsers: any = [];
  TaskUsers = item?.TaskUsers;
  let CompleteTeamMembers: any = [];
  React.useEffect(() => {
    if (item?.props != undefined) {
      let itemDetails={
        ...item?.props
      }
      let taskDetails=item?.props;
    try{
     taskDetails = JSON.parse(JSON.stringify(itemDetails));
    }catch(e){
      // console.log('Team error',e)
    }
      let LeadCount =0;
      
      if(taskDetails["ResponsibleTeam"] != undefined&&taskDetails["ResponsibleTeam"].length > 0){
        taskDetails["ResponsibleTeam"]=GetUserObjectFromCollection(taskDetails["ResponsibleTeam"]);
        LeadCount=taskDetails["ResponsibleTeam"].length;
      }
        if( taskDetails["WorkingAction"] != null){
          let WorkingAction:any=[];
          let changeAssignToData:any=taskDetails?.AssignedTo;
          if (typeof taskDetails["WorkingAction"] != "object") {
             WorkingAction = taskDetails["WorkingAction"] != null ? JSON.parse(taskDetails["WorkingAction"]) : [];

            }else{
              WorkingAction=taskDetails["WorkingAction"] 
            }
          
          if (taskDetails?.WorkingAction?.length > 0) {
            WorkingAction?.map((Action: any) => {
              if(Action?.Title == "WorkingDetails"){
                let currentDate = moment(new Date()).format("DD/MM/YYYY")
                Action?.InformationData?.map((isworkingToday:any)=>{
                  if(isworkingToday?.WorkingDate==currentDate && isworkingToday?.WorkingMember?.length>0){
                    changeAssignToData=isworkingToday?.WorkingMember
                    }})
                  }
                })
              }
              taskDetails.AssignedTo=changeAssignToData
          }
        
      // GetUserObjectFromCollection
      // const LeadCount = taskDetails["ResponsibleTeam"] != undefined && taskDetails["ResponsibleTeam"].length > 0 ? taskDetails["ResponsibleTeam"].length : 0;
      setLeadCount(LeadCount);
      if (taskDetails["ResponsibleTeam"] != undefined) {
        taskDetails["ResponsibleTeam"]?.map((item: any, index: any) => {
          if (taskDetails?.AssignedTo != undefined) {
            for (let i = 0; i < taskDetails?.AssignedTo?.length; i++) {
              if (item.Id == taskDetails?.AssignedTo[i]?.Id) {
                item.workingMember = true;
                taskDetails?.AssignedTo?.splice(i, true);
                i--;
              }
            }
          }
          CompleteTeamMembers.push(item);
        });
      }
      if (taskDetails["AssignedTo"] != undefined) {
        taskDetails["AssignedTo"]?.map((item: any, index: any) => {
          if (taskDetails?.TeamMembers != undefined) {
            for (let i = 0; i < taskDetails?.TeamMembers?.length; i++) {
              if (item.Id == taskDetails?.TeamMembers[i]?.Id) {
                item.workingMember = true;
                taskDetails?.TeamMembers?.splice(i, true);
                i--;
              }
            }
          }
          item.workingMember = true;
          CompleteTeamMembers.push(item);
        });
      }
      if (taskDetails?.TeamMembers != undefined) {
        taskDetails["TeamMembers"]?.map((item: any, index: any) => {

          CompleteTeamMembers.push(item);
        });
      }
      // Remove duplicate items
      CompleteTeamMembers = CompleteTeamMembers.filter((item: any, index: any) => {
        return CompleteTeamMembers.indexOf(item) === index;
      });
      if (CompleteTeamMembers?.length > 0) {
        CompleteTeamMembers = GetUserObjectFromCollection(CompleteTeamMembers)
      }

      // Check if there are more than 3 members
      if (CompleteTeamMembers.length > 3) {
        // If there is no lead, show the first 2 members and the rest in a tooltip
        // if (LeadCount === 0) {
        //   taskDetails.TeamMembersFlat = GetUserObjectFromCollection(CompleteTeamMembers.toSpliced(1));
        //   taskDetails.TeamMembersTip = GetUserObjectFromCollection(CompleteTeamMembers.slice(1));
        // } else if (LeadCount === 1) {
        //   // If there is a lead, show the lead and the first member and the rest in a tooltip
        taskDetails.TeamMembersFlat = CompleteTeamMembers?.toSpliced(2);
        taskDetails.TeamMembersTip = CompleteTeamMembers?.slice(2);
        // }
      } else {
        // If there are less than or equal to 3 members, show all of them
        taskDetails.TeamMembersFlat = CompleteTeamMembers;
        taskDetails.TeamMembersTip = [];
      }

      settaskData(taskDetails);
    }
    setKey((prevKey) => prevKey + 1);
  }, [item]);

  const GetUserObjectFromCollection = (UsersValues: any) => {
    let userDeatails: any = [];
    UsersValues?.map((item: any) => {
      let workingToday = item?.workingMember != undefined ? item?.workingMember : false;


      item = TaskUsers?.find((User: any) => User?.AssingedToUser?.Id == item?.Id)
      if (item?.Id != undefined) {
        userDeatails.push({
          'Id': item?.AssingedToUser.Id,
          'Name': item?.Email,
          'Suffix': item?.Suffix,
          'Title': item?.Title,
          'userImage': item?.Item_x0020_Cover?.Url,
          "workingMember": workingToday
        });
      }

    })

    setKey((prevKey) => prevKey + 1);
    return userDeatails;
  };

  const handleSuffixHover = () => {
    //e.preventDefault();
    setDisplay("block");
    setControlledVisible(true)
  };

  const handleSuffixLeave = () => {
    setDisplay("none");
    setControlledVisible(false)
  };

  return (
    <>
      <div className="d-flex align-items-center full-width">
        {/* {LeadCount === 0 ?
          <div className="user_Member_img">
            <span className="workmember d-flex clearfix"></span>
            <span className="workmember bg-fxdark"></span>
          </div> :
         
        } */}
        <div key={key} className="alignCenter">
          {taskData?.TeamMembersFlat != null &&
            taskData?.TeamMembersFlat?.length > 0 &&
            taskData?.TeamMembersFlat?.map((rcData: any, i: any) => {
              return (
                <a
                  style={{ marginRight: "4px" }}
                  href={`${siteUrl}/SitePages/TaskDashboard.aspx?UserId=${rcData?.Id}&Name=${rcData?.Title}`}
                  target="_blank"
                  className={i === (LeadCount - 1) && i !== 3 ? "teamLeader-IconEnd alignCenter" : "alignCenter"}
                  data-interception="off"
                  title={rcData?.Title}
                >
                  <Avatar
                    className="UserImage"
                    title={rcData?.Title}
                    name={rcData?.Title}
                    image={rcData?.userImage ? { src: rcData?.userImage } : null}
                    initials={rcData?.Suffix}  // Display suffix when image is not available
                  />
                </a>
              );
            })}
        </div>
        {taskData?.TeamMembersTip != null &&
          taskData?.TeamMembersTip?.length > 0 && (
            <div
              className="hover-text user_Member_img_suffix2 alignCenter"
              ref={setTriggerRef}
              onMouseOver={(e) => handleSuffixHover()}
              onMouseLeave={(e) => handleSuffixLeave()}
            >
              +{taskData?.TeamMembersTip?.length}
              {visible && (<span
                ref={setTooltipRef}
                {...getTooltipProps({ className: "tooltip-container" })}
              >
                <div key={key}
                >
                  {taskData?.TeamMembersTip?.map((rcData: any, i: any) => (
                    <div
                      key={i}
                      className="mb-1 team_Members_Item"
                      style={{ position: "relative" }}
                    >
                      <div>
                        <a
                          href={`${siteUrl}/SitePages/TaskDashboard.aspx?UserId=${rcData?.Id}&Name=${rcData?.Title}`}
                          target="_blank"
                          data-interception="off"
                          style={{
                            position: "relative",
                            display: "inline-block",
                          }}
                        >
                          <Avatar
                            className="UserImage"
                            title={rcData?.Title}
                            name={rcData?.Title}
                            image={rcData?.userImage ? { src: rcData?.userImage } : null}
                          />
                        </a>
                        <span className="mx-2">{rcData?.Title}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </span>)}
            </div>
          )}
      </div >
    </>
  );
}

export default ShowTaskTeamMembers;