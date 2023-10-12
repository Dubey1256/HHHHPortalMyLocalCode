// // Commits on Jun 1, 2023  take if required the neha changes in the page , it shows error on the all the profile 
import * as React from "react";
import { Button, Modal } from "react-bootstrap";
import Tooltip from "./Tooltip";
import { MSGraphClientV3 } from '@microsoft/sp-http';
import * as globalCommon from '../globalComponents/globalCommon';
import { Web } from "sp-pnp-js";
import { BsSend } from "react-icons/bs";
import { GlobalConstants } from "./LocalCommon";
import Loader from "react-loader";
let backupTaskUsers: any = [];
let TeamUser: any[] = [];
let new_chat_resp: any;
let GroupChatMemberUser: any = [];
let CurrentItem: any;
let listID: any;
let currentUser: any;
let portfolioColor: any = '';
function ShowTeamMembers(item: any) {
  let newTaskUsers: any = [...item?.TaskUsers];
  let newTaskUsers11 = [...item?.TaskUsers];
  const [loaded, setLoaded] = React.useState(false);
  const [email, setEmail]: any = React.useState("");
  const dragItem: any = React.useRef();
  const dragOverItem: any = React.useRef();
  const [teamMembers, setTeamMembers]: any = React.useState([]);
  const [message, setmessage] = React.useState<any>('')
  const [Data, setData] = React.useState([]);
  const [show, setShow] = React.useState(true);
  const [allEmployeeData, setAllEmployeeData]: any = React.useState([]); 
  var BackupArray: any = [];
  function getTeamMembers() {
    let UsersData: any = [];
    let Groups: any = [];  
    if (newTaskUsers != undefined && newTaskUsers?.length > 0) {
      newTaskUsers?.map((user: any, index: any) => {
        if (user?.AssingedToUser != undefined && user?.AssingedToUser?.Id != undefined && user?.AssingedToUser?.Id == item?.context?.pageContext?._legacyPageContext?.userId) {
          newTaskUsers.splice(index, 1);
        }
      });
    }
    newTaskUsers?.map((EmpData: any) => {
      if (EmpData?.ItemType === "Group") {
        EmpData.Child = [];
        Groups.push(EmpData);
      }
      if (EmpData?.ItemType == "User" && EmpData?.Id != 43) {
        UsersData.push(EmpData);
      }
    });
    if (UsersData?.length > 0 && Groups?.length > 0) {
      Groups?.map((groupData: any, _index: any) => {
        UsersData?.map((userData: any) => {
          if (groupData?.Id == (userData?.UserGroup?.Id || userData?.UserGroupId)) {
            userData.NewLabel = groupData?.Title + " > " + userData?.Title;
            groupData.Child.push(userData);
          }
        });
      });
    }    
    let array: any = [];  
    newTaskUsers?.map((taskuser: any) => {
      if (GroupChatMemberUser != undefined && GroupChatMemberUser?.length > 0) {
        GroupChatMemberUser?.map((item: any) => {
          if (item?.email?.trim() == taskuser?.AssingedToUser?.EMail?.trim()) {
            array.push(taskuser);
          }
        });
      }
      // if (items?.original.Responsible_x0020_Team?.length > 0) {
      //   items?.original.Responsible_x0020_Team?.map((item: any) => {
      //     if (item?.Id == taskuser?.AssingedToUser?.Id) {
      //       array.push(taskuser);
      //     }
      //   });
      // }

      // if (items?.original?.AssignedTo?.length > 0) {
      //   items?.original?.AssignedTo?.map((item: any) => {
      //     if (item?.Id == taskuser?.AssingedToUser?.Id) {
      //       array.push(taskuser);
      //     }
      //   });
      // }
    });   
    const uniqueAuthors: any = array.filter(
      (value: any, index: any, self: any) =>
        index ===
        self.findIndex(
          (t: any) => t?.AssingedToUser?.Id === value?.AssingedToUser?.Id
        )
    );
    uniqueAuthors?.map((item2: any) => {
      Groups?.map((items: any, index: any) => {
        items.Child?.map((item: any, indexes: any) => {
          if (
            item?.AssingedToUser?.Id == item2?.AssingedToUser?.Id ||
            item?.AssingedToUser == undefined
          ) {
            Groups[index]?.Child?.splice(indexes, 1);

          }
        });
      });
    });
    const copyListItems = [...uniqueAuthors];
    let ab: any = copyListItems?.map((val: any) => val?.AssingedToUser?.EMail).join(",");
    const emailStringWithoutSpaces: any = ab.replace(/\s/g, '');
    setEmail(emailStringWithoutSpaces);
    setAllEmployeeData(Groups);
    setTeamMembers(uniqueAuthors);
    setLoaded(true);  
  };
  const dragStart = (e: any, position: any, index: any) => {
    dragItem.current = position;
    dragItem.current1 = index;
    console.log(e.target.innerHTML);
  };
  const drop = async (e: any) => {
    e.preventDefault();
    console.log("drophbdj");
    const copyListItems = [...teamMembers];
    const copyListItems1 = [...allEmployeeData];
    const dragItemContent = copyListItems[dragItem.current];
    copyListItems?.splice(dragItem.current, 1);
    copyListItems1?.map((items: any, index: any) => {
      if (items.Id == dragItemContent?.UserGroup?.Id) {
        copyListItems1[index].Child.push(dragItemContent);
      }
    });
    dragItem.current = null;
    dragOverItem.current = null;
    setTeamMembers(copyListItems);
    setAllEmployeeData(copyListItems1);
    let ab = copyListItems?.map((val: any) => val?.AssingedToUser?.EMail).join(",");
    const emailStringWithoutSpaces: any = ab.replace(/\s/g, '');
    setEmail(emailStringWithoutSpaces);
    if (new_chat_resp != undefined && new_chat_resp != '') {
      let mention_To: any = []
      if (dragItemContent != undefined && dragItemContent != '')
        mention_To.push(dragItemContent?.AssingedToUser?.EMail)
      try {
        const client: MSGraphClientV3 = await item?.context.msGraphClientFactory.getClient();
        let participants: any = {};
        for (let index = 0; index < mention_To?.length; index++) {
          for (let TeamUserIndex = 0; TeamUserIndex < TeamUser?.length; TeamUserIndex++) {
            if (mention_To[index] != undefined && TeamUser[TeamUserIndex] != undefined && mention_To[index].toLowerCase().trim() == TeamUser[TeamUserIndex].userPrincipalName.toLowerCase().trim())
              participants = TeamUser[TeamUserIndex]
            if (mention_To[index] != undefined && TeamUser[TeamUserIndex] != undefined && mention_To[index].toLowerCase().trim() == 'stefan.hochhuth@hochhuth-consulting.de' && TeamUser[TeamUserIndex].id == 'b0f99ab1-aef3-475c-98bd-e68229168489')
              participants = TeamUser[TeamUserIndex]
          }
        }
        if (participants != undefined && participants != '')
          await client.api('/chats/' + new_chat_resp + '/members/' + participants?.MembershipId).version('beta').delete();
      } catch (error) {
        console.log(error)
      }
    }
  };
  const drop1 = async (e: any) => {
    e.preventDefault();
    const copyListItems = [...teamMembers];
    const copyListItems1 = [...allEmployeeData];
    const dragItemContent = copyListItems1[dragItem.current1].Child[dragItem.current];    
    copyListItems1[dragItem.current1].Child.splice(dragItem.current, 1);
    copyListItems?.splice(dragOverItem.current, 0, dragItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setTeamMembers(copyListItems);
    setAllEmployeeData(copyListItems1);
    let ab = copyListItems?.map((val: any) => val?.AssingedToUser?.EMail).join(",");
    const emailStringWithoutSpaces: any = ab.replace(/\s/g, '');
    setEmail(emailStringWithoutSpaces);
    if (new_chat_resp != undefined && new_chat_resp != '') {
      let mention_To: any = []
      if (dragItemContent != undefined && dragItemContent != '')
        mention_To.push(dragItemContent?.AssingedToUser?.EMail)
      try {
        const client: MSGraphClientV3 = await item?.context.msGraphClientFactory.getClient();
        let participants: any = {};
        for (let index = 0; index < mention_To?.length; index++) {
          for (let TeamUserIndex = 0; TeamUserIndex < TeamUser?.length; TeamUserIndex++) {
            if (mention_To[index] != undefined && TeamUser[TeamUserIndex] != undefined && mention_To[index].toLowerCase().trim() == TeamUser[TeamUserIndex].userPrincipalName.toLowerCase().trim())
              participants = TeamUser[TeamUserIndex]
            if (mention_To[index] != undefined && TeamUser[TeamUserIndex] != undefined && mention_To[index].toLowerCase().trim() == 'stefan.hochhuth@hochhuth-consulting.de' && TeamUser[TeamUserIndex].id == 'b0f99ab1-aef3-475c-98bd-e68229168489')
              participants = TeamUser[TeamUserIndex]
          }
        }
        if (participants != undefined && participants != '') {
          const conversationMember = {
            '@odata.type': '#microsoft.graph.aadUserConversationMember',
            'user@odata.bind': `https://graph.microsoft.com/v1.0/users/${participants?.id}`,
            visibleHistoryStartDateTime: '2019-04-18T23:51:43.255Z',
            roles: ['owner']
          };
          client.api('/chats/' + new_chat_resp + '/members').version('v1.0').post(conversationMember).then(function () {
            console.log('add user successfully')
          });
        }
      } catch (error) {
        console.log(error)
      }
    }
  };
  const CreateGroup = async (mention_To: any, GroupName: any, Context: any) => {
    try {
      if (mention_To != undefined && mention_To?.length <= 1) {
        alert('Please select more than 1 user')
        return false;
      }
      else {
        const client: MSGraphClientV3 = await Context.msGraphClientFactory.getClient();
        let participants: any[] = [];
        var SelectedUser: any[] = [];
        let obj = {
          "@odata.type": "#microsoft.graph.aadUserConversationMember", "roles": ["owner"], "user@odata.bind": `https://graph.microsoft.com/v1.0/users('${currentUser?.ChatId}')`
        }
        participants.push(obj)
        for (let index = 0; index < mention_To?.length; index++) {
          for (let TeamUserIndex = 0; TeamUserIndex < TeamUser?.length; TeamUserIndex++) {
            if (mention_To[index] != undefined && TeamUser[TeamUserIndex] != undefined && mention_To[index].toLowerCase().trim() == TeamUser[TeamUserIndex].userPrincipalName.toLowerCase())
              SelectedUser.push(TeamUser[TeamUserIndex])
            if (mention_To[index] != undefined && TeamUser[TeamUserIndex] != undefined && mention_To[index].toLowerCase().trim() == 'stefan.hochhuth@hochhuth-consulting.de' && TeamUser[TeamUserIndex].id == 'b0f99ab1-aef3-475c-98bd-e68229168489')
              SelectedUser.push(TeamUser[TeamUserIndex])
          }
        }
        if (SelectedUser != undefined && SelectedUser.length > 0) {
          SelectedUser?.forEach((item: any) => {
            let obj = {
              "@odata.type": "#microsoft.graph.aadUserConversationMember", "roles": ["owner"], "user@odata.bind": `https://graph.microsoft.com/v1.0/users('${item?.id}')`
            }
            participants.push(obj)
          })
        }
        if (participants != undefined && participants?.length > 0) {
          const chat_payload: any = {
            "members": participants,
            "chatType": "group",
            "topic": `${GroupName}`
          }
          client.api('/chats').version('v1.0').post(chat_payload).then(function (data: any) {
            new_chat_resp = data?.id;
            if (new_chat_resp != undefined && new_chat_resp != '') {
              if (CurrentItem[0]?.Comments == undefined || CurrentItem[0]?.Comments == '' || CurrentItem[0]?.Comments?.length == 0)
                CurrentItem[0].Comments = [{ "MSGRoupChatID": new_chat_resp }]
              else
                CurrentItem[0].Comments.push({ "MSGRoupChatID": new_chat_resp })
              const item: any = {
                Comments: CurrentItem[0].Comments?.length > 0 ? JSON.stringify(CurrentItem[0].Comments) : null,
              }
              globalCommon.updateItemById(GlobalConstants.SP_SITE_URL, listID, item, CurrentItem[0]?.Id)
            }
          });

        }
      }
    } catch (error) {
      console.log(error)
    }
    return new_chat_resp
  }
  const CreateTeamGroup = async () => {
    let mention_To: any[] = [];
    if (email != undefined && email != '' && email?.length > 0)
      mention_To = email.split(',')
    if (mention_To == undefined || mention_To?.length == 0) {
      alert('Please select user')
    }
    else {
      (async () => {
        let ChatId = await Promise.all([CreateGroup(mention_To, item?.props[0]?.original.Title, item?.context)]);
        setShow(false);
        item?.callBack()
      })();
    }
  }
  const SendMessage = async () => {
    try {
      const client: MSGraphClientV3 = await item?.context?.msGraphClientFactory.getClient();
      const message_payload = {
        "body": {
          contentType: 'text',
          content: `${message}`,
        }
      }
      await client.api('/chats/' + new_chat_resp + '/messages').post(message_payload)
      setmessage('');
      loadGroupChat(new_chat_resp)
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  }
  const loadGroupChatMember = () => {
    item?.context?.msGraphClientFactory.getClient().then((client: MSGraphClientV3) => {
      client.api('chats/' + new_chat_resp + '/members').version("v1.0").get((err: any, res: any) => {
        if (err) {
          console.error(err);
          return;
        }
        GroupChatMemberUser = res?.value;
        getTeamMembers();
      });
    });
  }
  const loadGroupChat = (new_chat_resp: any) => {
    item?.context?.msGraphClientFactory.getClient().then((client: MSGraphClientV3) => {
      client.api('chats/' + new_chat_resp + '/messages').version("v1.0").get((err: any, res: any) => {
        if (err) {
          console.error(err);
          return;
        }

        try {
          res?.value.forEach((chat: any) => {
            if (chat.body != undefined && chat.body.contentType != undefined && chat.body.contentType == 'html') {
              let chatContent = chat.body.content.split('\n')
              chat.body.content = chatContent[chatContent.length - 1];
            }
          })

          res?.value.forEach((chat: any) => {
            GroupChatMemberUser?.forEach((chatMember: any) => {
              if (chat?.from != undefined && chat?.from?.user != undefined && chat?.from?.user?.id != undefined && chatMember?.userId != undefined && chat?.from?.user?.id.trim() == chatMember?.userId.trim()) {
                chat.AuthorMail = chatMember?.email;
              }
            })
            item?.TaskUsers?.forEach((User: any) => {
              if (User?.Item_x0020_Cover != undefined && User?.Item_x0020_Cover?.Url != undefined && User?.Item_x0020_Cover?.Url != '' && chat?.AuthorMail != undefined && User?.AssingedToUser?.EMail != undefined && chat?.AuthorMail.toLowerCase().trim() == User?.AssingedToUser?.EMail.toLowerCase().trim()) {
                chat.UserImage = User?.Item_x0020_Cover?.Url;
              }
              else if ((User?.Item_x0020_Cover == undefined || User?.Item_x0020_Cover?.Url == undefined || User?.Item_x0020_Cover?.Url == '') && chat?.AuthorMail != undefined && User?.AssingedToUser?.EMail != undefined && chat?.AuthorMail.toLowerCase().trim() == User?.AssingedToUser?.EMail.toLowerCase().trim()) {
                chat.Suffix = User?.Suffix;
              }
            })
          })
          setData(res?.value);
          setLoaded(true);
        } catch (e) { setLoaded(true); console.log(e) }
      });
    });
  }
  const GetTeamUserAndMembershipId = async () => {
    try { 
      let pageContent = await globalCommon.pageContext()
      let web = new Web(pageContent?.WebFullUrl);
      currentUser = await web.currentUser?.get()
      if (currentUser) {
        if (currentUser.Email?.length > 0) {
        } else {
          currentUser.Email = currentUser.UserPrincipalName;
        }
      }
      await item?.context.msGraphClientFactory.getClient().then((client: MSGraphClientV3) => {
        client.api(`/users`).version("v1.0").get(async (err: any, res: any) => {
          if (err) {
            console.error(err);
            return;
          }
          TeamUser = res?.value;
          let CurrentUserChatInfo = TeamUser.filter((items: any) => {
            if (items.userPrincipalName != undefined && currentUser.Email != undefined && items.userPrincipalName.toLowerCase() == currentUser.Email.toLowerCase())
              return items
          })
          currentUser.ChatId = CurrentUserChatInfo[0]?.id;
        });
      });      
    } catch (error) {
      console.log(error)
    }
  }
  const LoadCurrentItem = async () => {
    GroupChatMemberUser = [];
    new_chat_resp = undefined;
    var select: any = 'Id,Title,Comments&$filter=Id eq ' + item?.props[0]?.original?.Id;
    if (item?.props[0]?.original != undefined && item?.props[0]?.original?.siteType == 'Master Tasks')
      listID = GlobalConstants.MASTER_TASKS_LISTID;
    else if (item?.props[0]?.original != undefined && item?.props[0]?.original?.siteType != 'Master Tasks')
      listID = item?.props[0]?.original?.listId;
    CurrentItem = await globalCommon.getData(GlobalConstants.SP_SITE_URL, listID, select);
    if (CurrentItem != undefined && CurrentItem?.length > 0) {
      if (CurrentItem[0]?.Comments != undefined && CurrentItem[0]?.Comments?.length > 0) {
        CurrentItem[0].Comments = globalCommon.parseJSON(CurrentItem[0]?.Comments)
        CurrentItem[0]?.Comments?.forEach((GroupId: any) => {
          if (GroupId?.MSGRoupChatID != undefined && GroupId?.MSGRoupChatID != '') {
            new_chat_resp = GroupId?.MSGRoupChatID;
          }
        })
      }
    }
    if (new_chat_resp != undefined && new_chat_resp != '') {
      loadGroupChatMember()
      loadGroupChat(new_chat_resp)
    }
    else {
      getTeamMembers()
    }
  }
  React.useEffect(() => {
    if (item?.portfolioTypeData != undefined && item?.portfolioTypeData.length > 0) {
      item?.portfolioTypeData?.map((elem: any) => {
        if (elem.Title === "Component") {
          portfolioColor = elem.Color;
        }
      })
    }
    setLoaded(false);
    GetTeamUserAndMembershipId()
    LoadCurrentItem()
    const refreshInterval = setInterval(() => {
      if (new_chat_resp != undefined && new_chat_resp != '') {
        loadGroupChat(new_chat_resp)
      }
    }, 4000);
    return () => {
      clearInterval(refreshInterval);
    };
  }, [item]);

  return (
    <>
      {console.log("BackupArrayBackupArrayBackupArrayBackupArray", BackupArray)}
      <Modal
        show={show}
        size="lg"       
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header >
          <Modal.Title>Team Members - {item?.props[0]?.original?.Title}</Modal.Title>
          <span><Tooltip ComponentId='1740' /></span>
          <span onClick={() => { setShow(false); item?.callBack() }}><i className="svg__iconbox svg__icon--cross crossBtn"></i></span>
        </Modal.Header>
        <Modal.Body>
          <Loader loaded={loaded} lines={13} length={20} width={10} radius={30} corners={1} rotate={0} direction={1}
            color={portfolioColor ? portfolioColor : "#000069"}
            speed={2}
            trail={60}
            shadow={false}
            hwaccel={false}
            className="spinner"
            zIndex={2e9}
            top="28%"
            left="50%"
            scale={1.0}
            loadedClassName="loadedContent"
          />
          <div className="col m-2">
            <div className="col bg-ee p-1">
              <div className="d-flex justify-content-between align-items-center">
                <span className="ps-1">All Team Members</span>
              </div>
            </div>
            <div className="border col p-2">
              <div className="taskTeamBox">
                {allEmployeeData?.map((items: any, indexes: any) => {
                  return (
                    <>
                      <div className="top-assign me-2">
                        <div className="team">
                          <label className="BdrBtm">{items?.Title}</label>
                          <div className="d-flex">
                            {items?.Child?.map((childItem: any, index: any) => (
                              <div>
                                {items?.Title == "HHHH Team" ? (
                                  <span

                                  >
                                    {
                                      childItem?.Item_x0020_Cover?.Url != undefined ?
                                        <img
                                          onDragStart={(e) =>
                                            dragStart(e, index, indexes)
                                          }
                                          onDragOver={(e) => e.preventDefault()}

                                          key={index}
                                          draggable
                                          className="ProirityAssignedUserPhoto"
                                          title={childItem?.Title}
                                          src={childItem?.Item_x0020_Cover?.Url}
                                        /> : <span onDragStart={(e) =>
                                          dragStart(e, index, indexes)
                                        }
                                          onDragOver={(e) => e.preventDefault()}

                                          key={index} draggable title={childItem?.Title} className="workmember activeimgbg-fxdark border bg-e9 p-1 ">{childItem?.Suffix}</span>
                                    }

                                  </span>
                                ) : (
                                  ""
                                )}
                                {items.Title == "External Staff" ? (
                                  <span

                                  >
                                    {
                                      childItem?.Item_x0020_Cover?.Url != undefined ?
                                        <img onDragStart={(e) => dragStart(e, index, indexes)} onDragOver={(e) => e.preventDefault()} key={index} draggable
                                          className="ProirityAssignedUserPhoto" title={childItem?.Title} src={childItem?.Item_x0020_Cover?.Url} />
                                        : <span onDragStart={(e) => dragStart(e, index, indexes)} onDragOver={(e) => e.preventDefault()} key={index} title={childItem?.Title} draggable className="workmember activeimgbg-fxdark border bg-e9 p-1 ">{childItem?.Suffix}</span>
                                    }

                                  </span>
                                ) : (
                                  ""
                                )}
                                {items.Title == "Senior Developer Team" ? (
                                  <span

                                  >
                                    {
                                      childItem?.Item_x0020_Cover?.Url != undefined ?
                                        <img
                                          onDragStart={(e) =>
                                            dragStart(e, index, indexes)
                                          }
                                          onDragOver={(e) => e.preventDefault()}

                                          key={index}
                                          draggable
                                          className="ProirityAssignedUserPhoto"
                                          title={childItem?.Title}
                                          src={childItem?.Item_x0020_Cover?.Url}
                                        /> : <span onDragStart={(e) =>
                                          dragStart(e, index, indexes)
                                        }
                                          onDragOver={(e) => e.preventDefault()}

                                          key={index} draggable title={childItem?.Title} className="workmember activeimgbg-fxdark border bg-e9 p-1 ">{childItem?.Suffix}</span>
                                    }
                                  </span>
                                ) : (
                                  ""
                                )}
                                {items.Title == "Design Team" ? (
                                  <span

                                  >
                                    {
                                      childItem?.Item_x0020_Cover?.Url != undefined ?
                                        <img
                                          onDragStart={(e) =>
                                            dragStart(e, index, indexes)
                                          }
                                          onDragOver={(e) => e.preventDefault()}

                                          key={index}
                                          draggable
                                          className="ProirityAssignedUserPhoto"
                                          title={childItem?.Title}
                                          src={childItem?.Item_x0020_Cover?.Url}
                                        /> : <span onDragStart={(e) =>
                                          dragStart(e, index, indexes)
                                        }
                                          onDragOver={(e) => e.preventDefault()}

                                          key={index} draggable title={childItem?.Title} className="workmember activeimgbg-fxdark border bg-e9 p-1 ">{childItem?.Suffix}</span>
                                    }
                                  </span>
                                ) : (
                                  ""
                                )}
                                {items.Title == "Junior Developer Team" ? (
                                  <span

                                  >
                                    {
                                      childItem?.Item_x0020_Cover?.Url != undefined ?
                                        <img
                                          onDragStart={(e) =>
                                            dragStart(e, index, indexes)
                                          }
                                          onDragOver={(e) => e.preventDefault()}

                                          key={index}
                                          draggable
                                          className="ProirityAssignedUserPhoto"
                                          title={childItem?.Title}
                                          src={childItem?.Item_x0020_Cover?.Url}
                                        /> : <span onDragStart={(e) =>
                                          dragStart(e, index, indexes)
                                        }
                                          onDragOver={(e) => e.preventDefault()}

                                          key={index} draggable title={childItem?.Title} className="workmember activeimgbg-fxdark border bg-e9 p-1 ">{childItem?.Suffix}</span>
                                    }
                                  </span>
                                ) : (
                                  ""
                                )}
                                {items?.Title == "QA Team" ? (
                                  <span

                                  >
                                    {
                                      childItem?.Item_x0020_Cover?.Url != undefined ?
                                        <img
                                          onDragStart={(e) =>
                                            dragStart(e, index, indexes)
                                          }
                                          onDragOver={(e) => e.preventDefault()}

                                          key={index}
                                          draggable
                                          className="ProirityAssignedUserPhoto"
                                          title={childItem?.Title}
                                          src={childItem?.Item_x0020_Cover?.Url}
                                        /> : <span onDragStart={(e) =>
                                          dragStart(e, index, indexes)
                                        }
                                          onDragOver={(e) => e.preventDefault()}

                                          key={index} draggable title={childItem?.Title} className="workmember activeimgbg-fxdark border bg-e9 p-1 ">{childItem?.Suffix}</span>
                                    }
                                  </span>
                                ) : (
                                  ""
                                )}
                                {items.Title == "Smalsus Lead Team" ? (
                                  <span

                                  >
                                    {
                                      childItem?.Item_x0020_Cover?.Url != undefined ?
                                        <img
                                          onDragStart={(e) =>
                                            dragStart(e, index, indexes)
                                          }
                                          onDragOver={(e) => e.preventDefault()}

                                          key={index}
                                          draggable
                                          className="ProirityAssignedUserPhoto"
                                          title={childItem?.Title}
                                          src={childItem?.Item_x0020_Cover?.Url}
                                        /> : <span onDragStart={(e) =>
                                          dragStart(e, index, indexes)
                                        }
                                          onDragOver={(e) => e.preventDefault()}

                                          key={index} draggable title={childItem?.Title} className="workmember activeimgbg-fxdark border bg-e9 p-1 ">{childItem?.Suffix}</span>
                                    }
                                  </span>
                                ) : (
                                  ""
                                )}
                                {items?.Title == "Ex Staff" ? (
                                  <span

                                  >
                                    {
                                      childItem?.Item_x0020_Cover?.Url != undefined ?
                                        <img
                                          onDragStart={(e) =>
                                            dragStart(e, index, indexes)
                                          }
                                          onDragOver={(e) => e.preventDefault()}

                                          key={index}
                                          draggable
                                          className="ProirityAssignedUserPhoto"
                                          title={childItem?.Title}
                                          src={childItem?.Item_x0020_Cover?.Url}
                                        /> : <span onDragStart={(e) =>
                                          dragStart(e, index, indexes)
                                        }
                                          onDragOver={(e) => e.preventDefault()}

                                          key={index} draggable title={childItem?.Title} className="workmember activeimgbg-fxdark border bg-e9 p-1 ">{childItem?.Suffix}</span>
                                    }
                                  </span>
                                ) : (
                                  ""
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </>
                  )
                })}
              </div>

              <div className="row m-0 mt-3">
                <div className="col-9 p-0">
                  <h6>Selected Team Members</h6>
                  <div className="d-flex p-1  UserTimeTabGray" onDrop={(e) => drop1(e)} onDragOver={(e) => e.preventDefault()}>
                    {teamMembers?.map((items: any, index: any) => {
                      return (
                        <>
                          <span
                            onDragStart={(e) => dragStart(e, index, index)}
                            onDragOver={(e) => e.preventDefault()}
                            key={index}
                            draggable
                          >
                            {
                              items?.Item_x0020_Cover?.Url != undefined ? <img
                                className="me-1"
                                title={items?.Title}
                                style={{ borderRadius: "20px" }}
                                height={"35px"}
                                width={"35px"}
                                src={items?.Item_x0020_Cover?.Url}
                              /> : <span title={items?.Title} className="workmember activeimgbg-fxdark border bg-e9 p-1 ">{items?.Suffix}</span>
                            }

                          </span>
                        </>
                      )
                    })}
                  </div>

                  {new_chat_resp != undefined && <div className="input-group my-2">
                    <input type="text" className="form-control" value={message} onChange={(e) => setmessage(e.target.value)} placeholder="Type a message..." />
                    <span className='bg-dark light fs-5 ms-1 p-2 text-white' onClick={SendMessage}><BsSend /></span>
                  </div>}
                  {new_chat_resp && Data && Data.map((item: any) => {
                    return (
                      <> {item.messageType == 'message' && item?.body?.content != undefined && item?.body?.content != '' ?
                        <p>{item?.UserImage != undefined && item?.UserImage != '' ? <img className="me-1" title={item?.from?.user?.displayName} style={{ borderRadius: "20px" }} height={"35px"} width={"35px"} src={item?.UserImage}
                        /> : <span className="workmember activeimgbg-fxdark border bg-e9 p-1 ">{item?.Suffix}</span>} - {item?.body?.content.replace(/<\/?[^>]+(>|$)/g, '')}</p> : ''}
                      </>
                    )
                  })}
                </div>
                <div className="col-3 mt-4" >
                  <img onDrop={(e) => drop(e)} onDragOver={(e) => e.preventDefault()}
                    title="Drag user here to  remove user from team for this Network Activity."
                    height={"50px"}
                    width={"50px"}
                    style={{ borderRadius: "25px" }}
                    src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/icon_Dustbin.png"
                  />
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0 pb-1 pt-0">
          <Button className="btn btn-default" onClick={() => { setShow(false); item?.callBack() }}>
            Cancel
          </Button>
          <Button disabled={new_chat_resp != undefined && new_chat_resp != ''} className="btn btn-primary" onClick={() => { CreateTeamGroup() }}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default ShowTeamMembers;
