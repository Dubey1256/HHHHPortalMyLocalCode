import * as React from "react";
import { Button, Modal } from "react-bootstrap";

let backupTaskUsers: any = [];
function ShowTeamMembers(item: any) {
  let newTaskUsers :any= [...item?.TaskUsers];
  let newTaskUsers11 = [...item?.TaskUsers];
  const [email, setEmail]: any = React.useState("");
  const dragItem: any = React.useRef();
  const dragOverItem: any = React.useRef();
  const [teamMembers, setTeamMembers]: any = React.useState([]);
  const [show, setShow] = React.useState(false);
  const [allEmployeeData, setAllEmployeeData]: any = React.useState([]);
  // const [employees, setEmployees]: any = React.useState();
  var BackupArray: any = [];

  React.useEffect(() => {
    getTeamMembers();
  }, [item]);
  const getTeamMembers = () => {
    
    let UsersData: any = [];
    let Groups: any = [];
    // const backupGroup: any = [];
    newTaskUsers?.map((EmpData: any) => {
      if (EmpData.ItemType == "Group") {
        EmpData.Child = [];
        Groups.push(EmpData);
      }

      if (EmpData.ItemType == "User") {
        UsersData.push(EmpData);
      }
    });

    if (UsersData.length > 0 && Groups.length > 0) {
      Groups.map((groupData: any, index: any) => {
        UsersData.map((userData: any) => {
          if (groupData.Id == userData.UserGroup.Id) {
            userData.NewLabel = groupData.Title + " > " + userData.Title;
            groupData.Child.push(userData);
          }
        });
      });
    }
    // let data = [...Groups]
    // if(data != undefined && data.length > 0){
    //   data.map((dataItem:any)=>{
    //     backupGroup.push(dataItem);
    //   })
    // }

    let array: any = [];
    item.props?.map((items: any) => {
      newTaskUsers?.map((taskuser: any) => {
        if (items.original.Team_x0020_Members?.length > 0) {
          items.original.Team_x0020_Members?.map((item: any) => {
            if (item?.Id == taskuser?.AssingedToUser?.Id) {
              array.push(taskuser);
            }
          });
        }

        if (items.original.Responsible_x0020_Team?.length > 0) {
          items.original.Responsible_x0020_Team?.map((item: any) => {
            if (item?.Id == taskuser?.AssingedToUser?.Id) {
              array.push(taskuser);
            }
          });
        }

        if (items.original.AssignedTo?.length > 0) {
          items.original.AssignedTo?.map((item: any) => {
            if (item?.Id == taskuser?.AssingedToUser?.Id) {
              array.push(taskuser);
            }
          });
        }
      });
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
            Groups[index].Child.splice(indexes, 1);
            
          }
        });
      });
    });

    const copyListItems = [...uniqueAuthors];
    let ab = copyListItems?.map((val: any) => val.Email).join(",");
    setEmail(ab);
    setAllEmployeeData(Groups);
    setTeamMembers(uniqueAuthors);
  };

  const dragStart = (e: any, position: any, index: any) => {
    dragItem.current = position;
    dragItem.current1 = index;
    console.log(e.target.innerHTML);
  };

  // const dragEnter = (e: any, position: any, index: any) => {
  //   dragOverItem.current = position;
  //   dragOverItem.current1 = index;
  //   console.log(e.target.innerHTML);
  // };

  const drop = (e: any) => {
    e.preventDefault();
    console.log("drophbdj");
    const copyListItems = [...teamMembers];
    const copyListItems1 = [...allEmployeeData];
   
    const dragItemContent = copyListItems[dragItem.current];
    copyListItems.splice(dragItem.current, 1);

    copyListItems1.map((items: any, index: any) => {
           if (items.Id == dragItemContent.UserGroup.Id) {
          copyListItems1[index].Child.push(dragItemContent);
        }
    
    });
    dragItem.current = null;
    dragOverItem.current = null;
    setTeamMembers(copyListItems);
    setAllEmployeeData(copyListItems1);
    let ab = copyListItems?.map((val: any) => val.Email).join(",");
    setEmail(ab);
  };

  const drop1 = (e: any) => {
    const copyListItems = [...teamMembers];
    const copyListItems1 = [...allEmployeeData];
    const dragItemContent =
      copyListItems1[dragItem.current1].Child[dragItem.current];
    // delete copyListItems1[dragItem.current1].Child[dragItem.current];
    copyListItems1[dragItem.current1].Child.splice(dragItem.current, 1);
    // copyListItems1.splice(copyListItems1[dragItem.current1].Child[dragItem.current], 1);
    copyListItems.splice(dragOverItem.current, 0, dragItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setTeamMembers(copyListItems);
    setAllEmployeeData(copyListItems1);
    let ab = copyListItems?.map((val: any) => val.Email).join(",");
    setEmail(ab);
  };



  return (
    <>
      {console.log("BackupArrayBackupArrayBackupArrayBackupArray", BackupArray)}
      <div className="full-width">
        {teamMembers.length > 0 ? (
          <div className="d-flex align-items-center">
            <span style={{ marginLeft: "5px" }}>
              <a onClick={()=> setShow(true)}>
                <img
                  alt="m-teams"
                  width="25px"
                  height="25px"
                  src={require("../Assets/ICON/Teams-Logo.png")}
                />
              </a>
            </span>
          </div>
        ) : (
          ""
        )}
      </div>

      <Modal
        show={show}
        size="lg"
        onHide={() => setShow(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Team Members</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: "300px", overflow: "auto" }}>

        {/* <div className="border col p-2" ng-show="teamUserExpanded">
                            <div className="taskTeamBox">
                                {this.state.taskUsers != null && this.state.taskUsers.length > 0 && this.state.taskUsers.map((user: any, index: number) => {
                                    return <div ui-on-drop="onDropRemoveTeam($event,$data,taskUsers)" className="top-assign ng-scope">
                                        {user.childs.length > 0 &&
                                            <div ng-if="user.childs.length >0" className="team ng-scope">
                                                <label className="BdrBtm">
                                                    {user.Title}
                                                </label>
                                                <div className='d-flex'>
                                                    {user.childs.map((item: any, i: number) => {
                                                        return <div className="marginR41 ng-scope">
                                                            {item.Item_x0020_Cover != undefined && item.AssingedToUser != undefined &&
                                                                <span>
                                                                    <div
                                                                        className="ProirityAssignedUserPhoto"
                                                                        style={{ backgroundImage: "url('" + item.Item_x0020_Cover.Url + "')", backgroundSize: "36px 36px" }}
                                                                        title={item.AssingedToUser.Title}
                                                                        draggable
                                                                        onDragStart={(e) => this.dragStart(e, i, item, 'All')}
                                                                        onDragOver={(e) => e.preventDefault()} />
                                                                </span>
                                                            }
                                                        </div>
                                                    })}
                                                </div>
                                            </div>
                                        }
                                    </div>
                                })
                                }
                            </div>
                            <div className="row">
                                
                                <div className="col-sm-7">
                                    <h6>Team Members</h6>
                                    <div className="d-flex p-1  UserTimeTabGray">
                                        <div className="col-sm-5 border-end p-0" >
                                            <div className="col"
                                                onDrop={(e) => this.onDropTeam(e, this.state.ResponsibleTeam, 'Team Leaders', this.state.taskUsers,'ResponsibleTeam')}
                                                onDragOver={(e) => e.preventDefault()}>
                                                <div className="p-1">
                                                    <div className='d-flex flex-wrap' style={{minHeight:"30px", height:'auto'}}>
                                                        {this.state.ResponsibleTeam != null && this.state.ResponsibleTeam.length > 0 && this.state.ResponsibleTeam.map((image: any, index: number) => {
                                                            return <div
                                                                className="ProirityAssignedUserPhoto" style={{ backgroundImage: "url('" + (image.userImage != null ? image.userImage : image.Item_x0020_Cover.Url) + "')", backgroundSize: "36px 36px" }}
                                                                title={image.Title} draggable
                                                                onDragStart={(e) => this.dragStart(e, index, image, 'ResponsibleTeam')}
                                                                onDragOver={(e) => e.preventDefault()} />
                                                        })
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-7 ">
                                            <div className="col-sm-12"
                                                onDrop={(e) => this.onDropTeam(e, this.state.TeamMemberUsers, 'Team Members', this.state.taskUsers,'TeamMemberUsers')}
                                                onDragOver={(e) => e.preventDefault()}>
                                                <div className="p-1">
                                                    <div className='d-flex flex-wrap' style={{minHeight:"30px", height:'auto'}}>
                                                        {this.state.TeamMemberUsers != null && this.state.TeamMemberUsers.length > 0 && this.state.TeamMemberUsers.map((image: any, index: number) => {
                                                            return <div
                                                                className="ProirityAssignedUserPhoto" style={{ backgroundImage: "url('" + (image.userImage != null ? image.userImage : image.Item_x0020_Cover.Url) + "')", backgroundSize: "36px 36px" }}
                                                                title={image.Title}
                                                                draggable
                                                                onDragStart={(e) => this.dragStart(e, index, image, 'TeamMemberUsers')}
                                                                onDragOver={(e) => e.preventDefault()} />
                                                        })
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                
                                <div className="col-sm-2">
                                    <div>
                                        <div onDrop={(e) => this.onDropRemoveTeam(e, this.state.taskUsers)}
                                            onDragOver={(e) => e.preventDefault()}>
                                            <img title="Drag user here to  remove user from team for this Network Activity." className="width-75"
                                                src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/icon_Dustbin.png" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> */}




          <div className="col">
            <div className="col bg-ee p-1">
              <div className="d-flex justify-content-between align-items-center">
                <span>All Team Members</span>
              </div>
            </div>
            <div className="border col p-2">
              <div className="taskTeamBox">
                {allEmployeeData.map((items: any, indexes: any) => (
                  <div className="top-assign me-2">
                    <div className="team">
                      <label className="BdrBtm">{items.Title}</label>
                  
                      <div className="d-flex">
                        {items.Child.map((childItem: any, index: any) => (
                          <div>
                            {items.Title == "HHHH Team" ? (
                              <span
                               onDragStart={(e) =>
                                  dragStart(e, index, indexes)
                                }
                                onDragOver={(e) => e.preventDefault()}
                                onDragEnd={drop1}
                                key={index}
                                draggable
                              >
                                <img  
                                  className="ProirityAssignedUserPhoto"
                                  title={childItem.Title}
                                  src={childItem.Item_x0020_Cover?.Url}
                                />
                              </span>
                            ) : (
                              ""
                            )}
                            {items.Title == "External Staff" ? (
                              <span
                                onDragStart={(e) =>
                                  dragStart(e, index, indexes)
                                }
                                onDragOver={(e) => e.preventDefault()}
                                onDragEnd={drop1}
                                key={index}
                                draggable
                              >
                                <img 
                                  className="ProirityAssignedUserPhoto"
                                  title={childItem.Title}
                                  src={childItem.Item_x0020_Cover?.Url}
                                />
                              </span>
                            ) : (
                              ""
                            )}
                            {items.Title == "Senior Developer Team" ? (
                              <span
                               onDragStart={(e) =>
                                  dragStart(e, index, indexes)
                                }
                                onDragOver={(e) => e.preventDefault()}
                                onDragEnd={drop1}
                                key={index}
                                draggable
                              >
                                <img  
                                  className="ProirityAssignedUserPhoto"
                                  title={childItem.Title}
                                  src={childItem.Item_x0020_Cover?.Url}
                                />
                              </span>
                            ) : (
                              ""
                            )}
                            {items.Title == "Design Team" ? (
                              <span
                                onDragStart={(e) =>
                                  dragStart(e, index, indexes)
                                }
                                onDragOver={(e) => e.preventDefault()}
                                onDragEnd={drop1}
                                key={index}
                                draggable
                              >
                                <img 
                                  className="ProirityAssignedUserPhoto"
                                  title={childItem.Title}
                                  src={childItem.Item_x0020_Cover?.Url}
                                />
                              </span>
                            ) : (
                              ""
                            )}
                            {items.Title == "Junior Developer Team" ? (
                              <span
                                onDragStart={(e) =>
                                  dragStart(e, index, indexes)
                                }
                                onDragOver={(e) => e.preventDefault()}
                                onDragEnd={drop1}
                                key={index}
                                draggable
                              >
                                <img 
                                  className="ProirityAssignedUserPhoto"
                                  title={childItem.Title}
                                  src={childItem.Item_x0020_Cover?.Url}
                                />
                              </span>
                            ) : (
                              ""
                            )}
                            {items.Title == "QA Team" ? (
                              <span
                                onDragStart={(e) =>
                                  dragStart(e, index, indexes)
                                }
                                onDragOver={(e) => e.preventDefault()}
                                onDragEnd={drop1}
                                key={index}
                                draggable
                              >
                                <img 
                                  className="ProirityAssignedUserPhoto"
                                  title={childItem.Title}
                                  src={childItem.Item_x0020_Cover?.Url}
                                />
                              </span>
                            ) : (
                              ""
                            )}
                            {items.Title == "Smalsus Lead Team" ? (
                              <span
                                onDragStart={(e) =>
                                  dragStart(e, index, indexes)
                                }
                                onDragOver={(e) => e.preventDefault()}
                                onDragEnd={drop1}
                                key={index}
                                draggable
                              >
                                <img 
                                  className="ProirityAssignedUserPhoto"
                                  title={childItem?.Title}
                                  src={childItem?.Item_x0020_Cover?.Url}
                                />
                              </span>
                            ) : (
                              ""
                            )}
                            {items.Title == "Ex Staff" ? (
                              <span
                                onDragStart={(e) =>
                                  dragStart(e, index, indexes)
                                }
                                onDragOver={(e) => e.preventDefault()}
                                onDragEnd={drop1}
                                key={index}
                                draggable
                              >
                                <img 
                                  className="ProirityAssignedUserPhoto"
                                  title={childItem?.Title}
                                  src={childItem?.Item_x0020_Cover?.Url}
                                />
                              </span>
                            ) : (
                              ""
                            )}
                          </div>
                        ))}
                      </div>
                    </div>{" "}
                  </div>
                ))}
              </div>

              <div className="row m-0 mt-3">
                <div className="col-9">
                  <h6>Selected Team Members</h6>
                  <div className="d-flex p-1  UserTimeTabGray">
                    {teamMembers?.map((items: any, index: any) => (
                      <span
                        onDragStart={(e) => dragStart(e, index, index)}
                        onDragOver={(e) => e.preventDefault()} 
                        key={index}
                        draggable
                      >
                        <img
                          className="me-1"
                          title={items?.Title}
                          style={{ borderRadius: "20px" }}
                          height={"35px"}
                          width={"35px"}
                          src={items?.Item_x0020_Cover?.Url}
                        />
                      </span>
                    ))}
                  </div>
                </div>
                <div className="col-3" onDrop={(e)=>drop(e)} onDragOver={(e) => e.preventDefault()}>
                  <img 
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
        <Modal.Footer>
          <Button className="btn-default" onClick={() => setShow(false)}>
            Close
          </Button>
          <a
            href={`https://teams.microsoft.com/l/chat/0/0?users=${email}`}
            target="_blank"
            onClick={() => setShow(false)}
          >
            Create
          </a>
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default ShowTeamMembers;
