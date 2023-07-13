import * as React from "react";
import { Web } from "sp-pnp-js";
import * as globalCommon from "../globalComponents/globalCommon";
import { GlobalConstants } from "../globalComponents/LocalCommon";
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
  React.useEffect(() => {
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
        if (Assig.Id != undefined) {
          TaskUsers.forEach((users: any) => {
            if (
              Assig.Id != undefined &&
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
      });
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
    setItemMember(Item);
  }, []);


  const handleuffixLeave = (item: any) => {
    setDisplay("none");

    //  setTeamMember((TeamMember: any) => (...TeamMember: any));
  };


  return (
    <>
      <div className='full-width'>
        {ItemNew?.TeamLeader?.length > 0 || ItemNew?.AllTeamMembers?.length > 0 ? (
          <div className="d-flex align-items-center">
            &nbsp;
            {ItemNew["TeamLeader"] != null && ItemNew["TeamLeader"].length > 0
              ? ItemNew["TeamLeader"].map((rcData: any, i: any) => {
                return (
                  <>
                    <span className="user_Member_img">
                      <a
                        href={`${siteUrl}/SitePages/TaskDashboard.aspx?UserId=${rcData?.AssingedToUserId}&Name=${rcData.Title}`}
                        target="_blank"
                        data-interception="off"
                        title={rcData.Title}
                      >
                        <img className="workmember" src={rcData.ItemCover}></img>
                      </a>
                    </span>
                  </>
                );
              })
              :<span>&nbsp;</span>}
            {/* {Item["TeamLeader"] != null && Item["TeamLeader"].length > 0 &&
                                                                                                                     <div></div>
                                                                                                                 } */}

            {ItemNew["AllTeamMembers"] != null &&
              ItemNew["AllTeamMembers"].length > 0 ? (
              <div className="  ">
                <a
                  href={`${siteUrl}/SitePages/TaskDashboard.aspx?UserId=${ItemNew["AllTeamMembers"][0].AssingedToUserId}&Name=${ItemNew["AllTeamMembers"][0].Title}`}
                  target="_blank"
                  data-interception="off"
                  title={ItemNew["AllTeamMembers"][0].Title}
                >
                  <img
                    className="workmember activeimg"
                    src={ItemNew["AllTeamMembers"][0].ItemCover}
                  ></img>
                </a>
              </div>
            ) : (
              " "
            )}
            {ItemNew["AllTeamMembers"] != null &&
              ItemNew["AllTeamMembers"].length > 1 ? (
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
                    {ItemNew["AllTeamMembers"]
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
                                    className={`workmember ${rcData.activeimg2}`}
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