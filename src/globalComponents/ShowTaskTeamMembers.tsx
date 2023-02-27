import * as React from 'react';
import { Web } from 'sp-pnp-js';
import * as globalCommon from '../globalComponents/globalCommon';
import { GlobalConstants } from '../globalComponents/LocalCommon';
function ShowTaskTeamMembers(item: any) {
    const [Display, setDisplay] = React.useState('none');
    const [ItemNew ,setItemMember] =React.useState<any>({});
    let TaskUsers: any = [];
    const Item = item.props;
    const handleSuffixHover = (item: any) => {
        setDisplay('block')
        //  setTeamMember((TeamMember: any) => (...TeamMember: any));
    }

    const handleuffixLeave = (item: any) => {
        setDisplay('none')

        //  setTeamMember((TeamMember: any) => (...TeamMember: any));
    }
    const getTaskUsersNew = async () => {
        TaskUsers = item.TaskUsers;
        console.log(Response);
        Item.AllTeamMembers = []
        Item.TeamLeaderUserTitle = ''
        Item.TeamLeader = [];
        Item.Display = 'none';
        if (Item.AssignedTo != undefined && Item.AssignedTo.length > 0) {
            Item.AssignedTo.forEach((Assig: any) => {
                if (Assig.Id != undefined) {
                    TaskUsers.forEach((users: any) => {

                        if (Assig.Id != undefined && users.AssingedToUser != undefined && Assig.Id === users.AssingedToUser.Id) {
                            users.ItemCover = users.Item_x0020_Cover?.Url;
                            Item.AllTeamMembers.push(users);
                            Item.TeamLeaderUserTitle += users.Title + ';';
                        }

                    })
                }
            })
        }
        if (Item.Team_x0020_Members != undefined && Item.Team_x0020_Members != undefined && Item.Team_x0020_Members.length > 0) {
            Item.Team_x0020_Members.forEach((Assig: any) => {
                if (Assig.Id != undefined) {
                    TaskUsers.forEach((users: any) => {
                        if (Assig.Id != undefined && users.AssingedToUser != undefined && Assig.Id == users.AssingedToUser.Id) {
                            users.ItemCover = users.Item_x0020_Cover?.Url;
                            Item.AllTeamMembers.push(users);
                            Item.TeamLeaderUserTitle += users.Title + ';';
                        }

                    })
                }
            })
        }
        if (Item.Responsible_x0020_Team != undefined && Item.Responsible_x0020_Team != undefined && Item.Responsible_x0020_Team.length > 0) {
            Item.Responsible_x0020_Team.forEach((Assig: any) => {
                if (Assig.Id != undefined) {
                    TaskUsers.forEach((users: any) => {
                        if (Assig.Id != undefined && users.AssingedToUser != undefined && Assig.Id == users.AssingedToUser.Id) {
                            users.ItemCover = users.Item_x0020_Cover?.Url;
                            Item.TeamLeader.push(users);
                            Item.TeamLeaderUserTitle += users.Title + ';';
                        }

                    })
                }
            })
        }
         setItemMember(Item);
    }
    React.useEffect(() => {
        getTaskUsersNew()
    }, [])

    return (
        <div >
             {ItemNew?.TeamLeader?.length > 0 || ItemNew?.AllTeamMembers?.length > 0 ?
               
               <div className="d-flex align-items-center">
                   {ItemNew["TeamLeader"] != null && ItemNew["TeamLeader"].length > 0 ?
                       ItemNew["TeamLeader"].map((rcData: any, i: any) => {
                           return (<><span className="user_Member_img"><a href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/TeamLeader-Dashboard.aspx?UserId=${rcData.Id}&Name=${rcData.Title}`} target="_blank" data-interception="off" title={rcData.Title}><img className="imgAuthor" src={rcData.ItemCover}></img></a></span></>)
                       }) : ''}
                   {/* {Item["TeamLeader"] != null && Item["TeamLeader"].length > 0 &&
                                                                                                                           <div></div>
                                                                                                                       } */}

                   {ItemNew["AllTeamMembers"] != null && ItemNew["AllTeamMembers"].length > 0 ?
                       <div className="  "><a href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/TeamLeader-Dashboard.aspx?UserId=${ItemNew["AllTeamMembers"][0].Id}&Name=${ItemNew["AllTeamMembers"][0].Title}`} target="_blank" data-interception="off" title={ItemNew["AllTeamMembers"][0].Title}><img className="imgAuthor activeimg" src={ItemNew["AllTeamMembers"][0].ItemCover}></img></a></div> : ''
                   }
                   {ItemNew["AllTeamMembers"] != null && ItemNew["AllTeamMembers"].length > 1 ?
                       <div className="position-relative user_Member_img_suffix2 ms-1" onMouseOver={(e) => handleSuffixHover(ItemNew)} onMouseLeave={(e) => handleuffixLeave(ItemNew)}>+{ItemNew["AllTeamMembers"].length - 1}
                           <span className="tooltiptext" style={{ display: Display, padding: '10px' }}>
                               <div>
                                   {ItemNew["AllTeamMembers"].slice(1).map((rcData: any, i: any) => {

                                       return (<><span className="team_Members_Item" style={{ padding: '2px' }}>
                                           <span><a href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/TeamLeader-Dashboard.aspx?UserId=${rcData.Id}&Name=${rcData.Title}`} target="_blank" data-interception="off">
                                               <img className={` imgAuthor ${rcData.activeimg2}`} src={rcData.ItemCover}></img></a></span>
                                           <div className='mx-2'>{rcData.Title}</div>
                                       </span></>)

                                   })
                                   }

                               </div>
                           </span>
                       </div> : ''
                   }

               </div>

            : ''
       }
            {/* {Item.TeamLeader?.length > 0 || Item.AllTeamMembers?.length > 0 ?
               
                    <div className="d-flex align-items-center">
                        {Item["TeamLeader"] != null && Item["TeamLeader"].length > 0 ?
                            Item["TeamLeader"].map((rcData: any, i: any) => {
                                return (<><span className="user_Member_img"><a href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/TeamLeader-Dashboard.aspx?UserId=${rcData.Id}&Name=${rcData.Title}`} target="_blank" data-interception="off" title={rcData.Title}><img className="imgAuthor" src={rcData.ItemCover}></img></a></span></>)
                            }) : ''}
                        {Item["AllTeamMembers"] != null && Item["AllTeamMembers"].length > 0 ?
                            <div className=" activeimg "><a href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/TeamLeader-Dashboard.aspx?UserId=${Item["AllTeamMembers"][0].Id}&Name=${Item["AllTeamMembers"][0].Title}`} target="_blank" data-interception="off" title={Item["AllTeamMembers"][0].Title}><img className="imgAuthor" src={Item["AllTeamMembers"][0].ItemCover}></img></a></div> : ''
                        }
                        {Item["AllTeamMembers"] != null && Item["AllTeamMembers"].length > 1 ?
                            <div className="position-relative user_Member_img_suffix2" onMouseOver={(e) => handleSuffixHover(Item)} onMouseLeave={(e) => handleuffixLeave(Item)}>+{Item["AllTeamMembers"].length - 1}
                                <span className="tooltiptext" style={{ display: Display, padding: '10px' }}>
                                    <div>
                                        {Item["AllTeamMembers"].slice(1).map((rcData: any, i: any) => {

                                            return (<><span className="team_Members_Item" style={{ padding: '2px' }}>
                                                <span><a href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/TeamLeader-Dashboard.aspx?UserId=${rcData.Id}&Name=${rcData.Title}`} target="_blank" data-interception="off">
                                                    <img className={`imgAuthor ${rcData.activeimg2}`} src={rcData.ItemCover}></img></a></span>
                                                <div className='mx-2'>{rcData.Title}</div>
                                            </span></>)

                                        })
                                        }

                                    </div>
                                </span>
                            </div> : ''
                        }

                    </div>

                 : ''
            } */}
            {/* {Item?.TeamLeader?.length > 0 || Item?.AllTeamMembers?.length > 0 &&
            <dd className='bg-light'>
                <div className="d-flex align-items-center">
                    {Item["TeamLeader"] != null && Item["TeamLeader"].length > 0 && Item["TeamLeader"].map((rcData: any, i: any) => {
                        return <> <div className="user_Member_img"><a href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/TeamLeader-Dashboard.aspx?UserId=${rcData.Id}&Name=${rcData.Title}`} target="_blank" data-interception="off" title={rcData.Title}><img className="imgAuthor" src={rcData.ItemCover}></img></a></div></>
                    })}
                    {Item["TeamLeader"] != null && Item["TeamLeader"].length > 0 &&
                        <div></div>
                    }

                    {Item["AllTeamMembers"] != null && Item["AllTeamMembers"].length > 0 &&
                        <div className=" activeimg "><a href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/TeamLeader-Dashboard.aspx?UserId=${Item["AllTeamMembers"][0].Id}&Name=${Item["AllTeamMembers"][0].Title}`} target="_blank" data-interception="off" title={Item["AllTeamMembers"][0].Title}><img className="imgAuthor" src={Item["AllTeamMembers"][0].ItemCover}></img></a></div>
                    }
                    {Item["AllTeamMembers"] != null && Item["AllTeamMembers"].length > 1 &&
                        <div className="position-relative user_Member_img_suffix2" onMouseOver={(e) => handleSuffixHover(Item)} onMouseLeave={(e) => handleuffixLeave(Item)}>+{Item["AllTeamMembers"].length - 1}
                            <span className="tooltiptext" style={{ display: Item.Display, padding: '10px' }}>
                                <div>
                                    {Item["AllTeamMembers"].slice(1).map((rcData: any, i: any) => {

                                        return <><div className="team_Members_Item" style={{ padding: '2px' }}>
                                            <div><a href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/TeamLeader-Dashboard.aspx?UserId=${rcData.Id}&Name=${rcData.Title}`} target="_blank" data-interception="off">
                                                <img className={`imgAuthor ${rcData.activeimg2}`} src={rcData.ItemCover}></img></a></div>
                                            <div className='mx-2'>{rcData.Title}</div>
                                        </div></>

                                    })
                                    }

                                </div>
                            </span>
                        </div>
                    }

                </div>

            </dd>
        } */}

        </div>
    )



}
export default ShowTaskTeamMembers;