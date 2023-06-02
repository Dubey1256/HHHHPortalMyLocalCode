import * as React from "react";
import { Web } from "sp-pnp-js";
import * as globalCommon from "../globalComponents/globalCommon";
import { GlobalConstants } from "../globalComponents/LocalCommon";
// import teamsImg from '../Assets/ICON/Teams-Logo.png'; 
var siteUrl = ''
function ShowTeamMembers(item: any) {
  //siteUrl= item.SelectedProp?.SelectedProp?.siteUrl
  siteUrl = item.props?.siteUrl
//   const [Display, setDisplay] = React.useState("none");
  const [ItemNew, setItemMember] = React.useState<any>({});
  let TaskUsers: any = [];
  const Item = item.props;
//   const handleSuffixHover = (item: any) => {
//     setDisplay("block");
//     //  setTeamMember((TeamMember: any) => (...TeamMember: any));
//   };

//   const handleuffixLeave = (item: any) => {
//     setDisplay("none");

//     //  setTeamMember((TeamMember: any) => (...TeamMember: any));
//   };
  const getTaskUsersNew = async () => {
    let emailarray: any = [];
    TaskUsers = item.TaskUsers;
    console.log(Response);
    // let AllTeamsMails:any ;
    Item.allMembersEmail = [];
    // Item.Display = "none";
    if (Item.AssignedTo != undefined && Item.AssignedTo.length > 0) {
      Item.AssignedTo.forEach((Assig: any) => {
        if (Assig.Id != undefined) {
          TaskUsers.forEach((users: any) => {
            if (Assig.Id != undefined && users.AssingedToUser != undefined && Assig.Id === users.AssingedToUser.Id) {
              if (users.Email != null) {
                emailarray.push(users.Email);
              }
            }
          });
        }
      });
    }
    if ( Item.Team_x0020_Members != undefined &&  Item.Team_x0020_Members != undefined && Item.Team_x0020_Members.length > 0) {
      Item.Team_x0020_Members.forEach((Assig: any) => {
        if (Assig.Id != undefined) {
          TaskUsers.forEach((users: any) => {
            if ( Assig.Id != undefined && users.AssingedToUser != undefined && Assig.Id == users.AssingedToUser.Id) {
              if (users.Email != null) {
                emailarray.push(users.Email);
              }
            }
          });
        }
      });
    }
    if (
      Item.Responsible_x0020_Team != undefined && Item.Responsible_x0020_Team != undefined &&Item.Responsible_x0020_Team.length > 0 ) {
      Item.Responsible_x0020_Team.forEach((Assig: any) => {
        if (Assig.Id != undefined) {
          TaskUsers.forEach((users: any) => {
            if ( Assig.Id != undefined && users.AssingedToUser != undefined && Assig.Id == users.AssingedToUser.Id ) {
              if (users.Email != null) {
                emailarray.push(users.Email);
              }
            }
          });
        }
      });
    }
    Item.allMembersEmail = emailarray.join();
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
            {ItemNew.allMembersEmail != null
              ? (
                <span style={{ marginLeft: '5px' }} >
                  <a
                    href={`https://teams.microsoft.com/l/chat/0/0?users=${ItemNew.allMembersEmail}`}
                    target="_blank"
                  >
                    <img alt="m-teams"
                      width="25px"
                      height="25px"
                      src={require('../Assets/ICON/Teams-Logo.png')}
                    />
                  </a>
                </span>
              ) : (
                ""
              )}
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
}
export default ShowTeamMembers;
