import * as React from "react";
var siteUrl = '';
function ShowTaskTeamMembers(item: any) {
  siteUrl = item.props?.siteUrl != undefined ? item?.props?.siteUrl : item?.Context?.siteurl;
  const [Display, setDisplay] = React.useState("none");
  const [taskData, settaskData] = React.useState<any>();
  const [key, setKey] = React.useState(0);
  const [LeadCount, setLeadCount] = React.useState(0);
  let TaskUsers: any = [];
  TaskUsers = item?.TaskUsers;
  let CompleteTeamMembers: any = [];
  React.useEffect(() => {
    if (item?.props != undefined) {
      let taskDetails = item?.props;
      let LeadCount =0;
      if(taskDetails["ResponsibleTeam"] != undefined&&taskDetails["ResponsibleTeam"].length > 0){
        taskDetails["ResponsibleTeam"]=GetUserObjectFromCollection(taskDetails["ResponsibleTeam"]);
        LeadCount=taskDetails["ResponsibleTeam"].length;
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
      if (taskDetails["TeamMembers"] != undefined) {
        taskDetails["TeamMembers"]?.map((item: any, index: any) => {
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
      if (taskDetails?.AssignedTo != undefined) {
        taskDetails["AssignedTo"]?.map((item: any, index: any) => {
          item.workingMember = true;
          CompleteTeamMembers.push(item);
        });
      }
      // Remove duplicate items
      CompleteTeamMembers = CompleteTeamMembers.filter((item: any, index: any) => {
        return CompleteTeamMembers.indexOf(item) === index;
      });
      if(CompleteTeamMembers?.length>0){
        CompleteTeamMembers= GetUserObjectFromCollection(CompleteTeamMembers)
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
      let workingToday=item?.workingMember!=undefined?item?.workingMember:false;
      item = TaskUsers?.find((User: any) => User?.AssingedToUser?.Id == item?.Id)
      if(item?.Id!=undefined){
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
  };

  const handleSuffixLeave = () => {
    setDisplay("none");
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
        <div key={key} className="">
          {taskData?.TeamMembersFlat != null &&
            taskData?.TeamMembersFlat?.length > 0 &&
            taskData?.TeamMembersFlat?.map((rcData: any, i: any) => {
              return (
                <a
                  style={{ marginRight: "4px" }}
                  href={`${siteUrl}/SitePages/TaskDashboard.aspx?UserId=${rcData?.Id}&Name=${rcData?.Title}`}
                  target="_blank"
                  className={i == (LeadCount - 1) && i != 3 ? "teamLeader-IconEnd" : ''}
                  data-interception="off"
                  title={rcData?.Title}
                >
                  {rcData.userImage != null && (
                    <img
                      className={rcData?.workingMember ? "suffix_Usericon activeimg" : "suffix_Usericon"}
                      src={rcData?.userImage}
                    />
                  )}
                  {rcData.userImage == null && (
                    <span
                      className={
                        rcData?.workingMember
                          ? "workmember activeimg bg-fxdark"
                          : "workmember bg-fxdark"
                      }
                    >
                      {rcData?.Suffix}
                    </span>
                  )}
                </a>
              );
            })}
        </div>
        {taskData?.TeamMembersTip != null &&
          taskData?.TeamMembersTip?.length > 0 && (
            <div
              className="position-relative user_Member_img_suffix2 ms-1 alignCenter"
              onMouseOver={(e) => handleSuffixHover()}
              onMouseLeave={(e) => handleSuffixLeave()}
            >
              +{taskData?.TeamMembersTip?.length}
              <span className="tooltiptext" style={{ display: Display, padding: "10px" }}>
                <div key={key}>
                  {taskData?.TeamMembersTip?.map((rcData: any, i: any) => {
                    return (
                      <div
                        key={key}
                        className="mb-1 team_Members_Item"
                        style={{ padding: "2px" }}
                      >
                        <a
                          href={`${siteUrl}/SitePages/TaskDashboard.aspx?UserId=${rcData?.Id}&Name=${rcData?.Title}`}
                          target="_blank"
                          data-interception="off"
                        >
                          {rcData.userImage != null && (
                            <img
                              className={
                                rcData?.workingMember ? "suffix_Usericon activeimg" : "suffix_Usericon"
                              }
                              src={rcData?.userImage}
                            />
                          )}
                          {rcData.userImage == null && (
                            <span
                              className={
                                rcData?.workingMember
                                  ? "workmember activeimg bg-fxdark border bg-e9"
                                  : "workmember bg-fxdark border bg-e9"
                              }
                            >
                              {rcData?.Suffix}
                            </span>
                          )}
                          <span className="mx-2">{rcData?.Title}</span>
                        </a>
                      </div>
                    );
                  })}
                </div>
              </span>
            </div>
          )}
      </div>
    </>
  );
}

export default ShowTaskTeamMembers;