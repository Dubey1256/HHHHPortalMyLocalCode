import * as React from "react";
import { Web } from "sp-pnp-js";
import * as globalCommon from "../globalComponents/globalCommon";
import { GlobalConstants } from "../globalComponents/LocalCommon";
import "../webparts/projectmanagementOverviewTool/components/styles.css"
// import teamsImg from '../Assets/ICON/Teams-Logo.png'; 
var siteUrl = ''
function ShowTaskTeamMembers(item: any) {
  //siteUrl= item.SelectedProp?.SelectedProp?.siteUrl
  siteUrl = item.props?.siteUrl
  const [Display, setDisplay] = React.useState("none");
  const [ItemNew, setItemMember] = React.useState<any>({});
  let TaskUsers: any = [];
  const Item = item.props;
  const handleSuffixHover = (item: any) => {
    setDisplay("block");
    //  setTeamMember((TeamMember: any) => (...TeamMember: any));
  };

  const handleuffixLeave = (item: any) => {
    setDisplay("none");

    //  setTeamMember((TeamMember: any) => (...TeamMember: any));
  };
  const getTaskUsersNew = async () => {
    let emailarray: any = [];
    TaskUsers = item.TaskUsers;
    console.log(Response);
    // let AllTeamsMails:any ;
    Item.AllTeamMembers = [];
    Item.allMembersEmail = [];
    Item.TeamLeaderUserTitle = "";
    Item.TeamLeader = [];
    Item.Display = "none";

    if (Item.AssignedTo != undefined && Item.AssignedTo.length > 0) {
      Item.AssignedTo.forEach((Assig: any) => {
        if(Assig.Id != undefined){
          const assignedToResponsibles = Item?.Responsible_x0020_Team?.filter(
            (respMember: any) => respMember?.Id === Assig.Id
          ).length > 0
          const assignedToTeamMembers = Item?.Team_x0020_Members?.filter(
            (teamMember: any) => teamMember?.Id === Assig.Id
          ).length > 0
          if(!assignedToResponsibles && !assignedToTeamMembers) {
            TaskUsers?.forEach((users: any) => {
              if (
                users.AssingedToUser != undefined &&
                Assig.Id === users.AssingedToUser.Id
              ) {
                users.ItemCover = users.Item_x0020_Cover?.Url;
                if (users.Email != null) {
                  emailarray.push(users.Email);
                }
                Item.AllTeamMembers.push(users);
                Item.TeamLeaderUserTitle += users.Title + ";";
              }
            });
          }
        }
      })
    }

    if (
      Item.Team_x0020_Members != undefined &&
      Item.Team_x0020_Members != undefined &&
      Item.Team_x0020_Members.length > 0
    ) {
      Item.Team_x0020_Members.forEach((Assig: any) => {
        if (Assig.Id != undefined) {
          TaskUsers.forEach((users: any) => {
            if (
              Assig.Id != undefined &&
              users.AssingedToUser != undefined &&
              Assig.Id == users.AssingedToUser.Id
            ) {
              users.ItemCover = users.Item_x0020_Cover?.Url;
              Assig.ItemCover=users.Item_x0020_Cover?.Url;
              if (users.Email != null) {
                emailarray.push(users.Email);
              }
              Item.AllTeamMembers.push(users);
              Item.TeamLeaderUserTitle += users.Title + ";";
            }
          });
        }
      });
    }
    if (
      Item.Responsible_x0020_Team != undefined &&
      Item.Responsible_x0020_Team != undefined &&
      Item.Responsible_x0020_Team.length > 0
    ) {
      Item.Responsible_x0020_Team.forEach((Assig: any) => {
        if (Assig.Id != undefined) {
          TaskUsers.forEach((users: any) => {
            if (
              Assig.Id != undefined && users.AssingedToUser != undefined && Assig.Id == users.AssingedToUser.Id
            ) {
              users.ItemCover = users.Item_x0020_Cover?.Url;
              Assig.ItemCover=users.Item_x0020_Cover?.Url;
              if (users.Email != null) {
                emailarray.push(users.Email);
              }
              Item.TeamLeader.push(users);
              Item.TeamLeaderUserTitle += users.Title + ";";
            }
          });
        }
      });
    }
    Item.allMembersEmail = emailarray.join();

    if(Item?.Team_x0020_Members?.length>0 && Item?.AssignedTo?.length>0){
      Item?.AssignedTo.map((Assign:any)=>{
        Item.Team_x0020_Members.map((teamMember:any)=>{
          if(teamMember.Id==Assign.Id){
            teamMember.Isactive = true
          }
        })    
      })
    }

    if(Item?.Responsible_x0020_Team?.length>0 && Item?.AssignedTo?.length>0){
      Item?.AssignedTo.map((Assign:any)=>{
        Item.Responsible_x0020_Team.map((teamMember:any)=>{
          if(teamMember.Id==Assign.Id){
            teamMember.Isactive = true
          }
        })    
      })
    }

    setItemMember(Item);
  };
  React.useEffect(() => {
    getTaskUsersNew();
  }, []);

  return (
    <>
      <div className='full-width'>
        {ItemNew?.TeamLeader?.length > 0 || ItemNew?.AllTeamMembers?.length > 0 ? (
          <div className="d-flex align-items-center">
            &nbsp;
            {ItemNew["Responsible_x0020_Team"] != null && ItemNew["Responsible_x0020_Team"].length > 0
              ? ItemNew["Responsible_x0020_Team"].map((rcData: any, i: any) => {
                if(i == ItemNew["Responsible_x0020_Team"].length-1){
                  return (
                    <>
                      <span className="mx-1 user_TeamLeaders">
                        <a
                          href={`${siteUrl}/SitePages/TaskDashboard.aspx?UserId=${rcData?.AssingedToUserId}&Name=${rcData.Title}`}
                          target="_blank"
                          data-interception="off"
                          title={rcData.Title}
                        >
                          <img className={rcData?.Isactive?"workmember activeimg":"workmember"} src={rcData.ItemCover}></img>
                        </a>
                      </span>
                    </>
                  );
                }
                else{
                  return (
                    <>
                      <span>
                        <a
                          href={`${siteUrl}/SitePages/TaskDashboard.aspx?UserId=${rcData?.AssingedToUserId}&Name=${rcData.Title}`}
                          target="_blank"
                          data-interception="off"
                          title={rcData.Title}
                        >
                          <img className={rcData?.Isactive?"workmember activeimg":"workmember"} src={rcData.ItemCover}></img>
                        </a>
                      </span>
                    </>
                  );
                }
              })
              : ""}
            {/* {Item["TeamLeader"] != null && Item["TeamLeader"].length > 0 &&
                                                                                                                     <div></div>
                                                                                                                 } */}

            {ItemNew["Team_x0020_Members"] != null &&
              ItemNew["Team_x0020_Members"].length > 0 ? (
              <div className="  ">
                <a
                  href={`${siteUrl}/SitePages/TaskDashboard.aspx?UserId=${ItemNew["Team_x0020_Members"][0].AssingedToUserId}&Name=${ItemNew["Team_x0020_Members"][0].Title}`}
                  target="_blank"
                  data-interception="off"
                  title={ItemNew["Team_x0020_Members"][0].Title}
                >
                  <img
                    // className={`workmember ${ItemNew["AllTeamMembers"][0].activeimg}`}
                    className={ItemNew["Team_x0020_Members"][0].Isactive?"workmember activeimg":"workmember"}
                    src={ItemNew["Team_x0020_Members"][0].ItemCover}
                  ></img>
                </a>
              </div>
            ) : (
              ""
            )}
            {ItemNew["Team_x0020_Members"] != null &&
              ItemNew["Team_x0020_Members"].length > 1 ? (
              <div
                className="position-relative user_Member_img_suffix2 ms-1"
                onMouseOver={(e) => handleSuffixHover(ItemNew)}
                onMouseLeave={(e) => handleuffixLeave(ItemNew)}
              >
                +{ItemNew?.AllTeamMembers?.slice(1)?.length}
                <span
                  className="tooltiptext"
                  style={{ display: Display, padding: "10px" }}
                >
                  <div>
                    {ItemNew["Team_x0020_Members"]
                      .slice(1)
                      .map((rcData: any, i: any) => {
                        return (
                          <>
                            <span
                              className="team_Members_Item"
                              style={{ padding: "2px" }}
                            >
                              <span>
                                <a
                                  href={`${siteUrl}/SitePages/TaskDashboard.aspx?UserId=${rcData?.AssingedToUserId}&Name=${rcData.Title}`}
                                  target="_blank"
                                  data-interception="off"
                                >
                                  <img
                                    className={rcData.Isactive?"workmember activeimg":'workmember'}
                                    src={rcData.ItemCover}
                                  ></img>
                                </a>
                              </span>
                              <div className="mx-2">{rcData.Title}</div>
                            </span>
                          </>
                        );
                      })}
                  </div>
                </span>
              </div>
            ) : (
              ""
            )}
            {/* {item?.ShowTeamsIcon != false ? <div>
              {ItemNew?.allMembersEmail != null ? (
                <span style={{ marginLeft: '5px' }} >
                  <a
                    href={`https://teams.microsoft.com/l/chat/0/0?users=${ItemNew?.allMembersEmail}`}
                    target="_blank"
                  >
                   <span className="svg__iconbox svg__icon--team"></span>
                  </a>
                </span>
              ) : (
                ""
              )}
            </div>:''} */}
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
}
export default ShowTaskTeamMembers;