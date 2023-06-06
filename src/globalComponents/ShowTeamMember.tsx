// // Commits on Jun 1, 2023  take if required the neha changes in the page , it shows error on the all the profile 

import * as React from "react";
import { Button, Modal } from "react-bootstrap";
let backupTaskUsers: any = [];
function ShowTeamMembers(item: any) {
  let newTaskUsers: any = [...item?.TaskUsers];
  let newTaskUsers11 = [...item?.TaskUsers];
  const [email, setEmail]: any = React.useState("");
  const dragItem: any = React.useRef();
  const dragOverItem: any = React.useRef();
  const [teamMembers, setTeamMembers]: any = React.useState([]);
  const [show, setShow] = React.useState(true);
  const [allEmployeeData, setAllEmployeeData]: any = React.useState([]);
  // const [employees, setEmployees]: any = React.useState();
  var BackupArray: any = [];
  React.useEffect(() => {
    getTeamMembers();
  }, []);

  function getTeamMembers() {

    let UsersData: any = [];
    let Groups: any = [];
    // const backupGroup: any = [];
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
      Groups?.map((groupData: any, index: any) => {
        UsersData?.map((userData: any) => {
          if (groupData?.Id == userData?.UserGroup?.Id) {
            userData.NewLabel = groupData?.Title + " > " + userData?.Title;
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
    item?.props?.map((items: any) => {
      newTaskUsers?.map((taskuser: any) => {
        if (items?.original?.Team_x0020_Members?.length > 0) {
          items?.original?.Team_x0020_Members?.map((item: any) => {
            if (item?.Id == taskuser?.AssingedToUser?.Id) {
              array.push(taskuser);
            }
          });
        }

        if (items?.original.Responsible_x0020_Team?.length > 0) {
          items?.original.Responsible_x0020_Team?.map((item: any) => {
            if (item?.Id == taskuser?.AssingedToUser?.Id) {
              array.push(taskuser);
            }
          });
        }

        if (items?.original?.AssignedTo?.length > 0) {
          items?.original?.AssignedTo?.map((item: any) => {
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
            Groups[index]?.Child?.splice(indexes, 1);

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
    let ab = copyListItems?.map((val: any) => val.Email).join(",");
    setEmail(ab);
  };

  const drop1 = (e: any) => {
    e.preventDefault();
    const copyListItems = [...teamMembers];
    const copyListItems1 = [...allEmployeeData];
    const dragItemContent = copyListItems1[dragItem.current1].Child[dragItem.current];
    // delete copyListItems1[dragItem.current1].Child[dragItem.current];
    copyListItems1[dragItem.current1].Child.splice(dragItem.current, 1);
    // copyListItems1.splice(copyListItems1[dragItem.current1].Child[dragItem.current], 1);
    copyListItems?.splice(dragOverItem.current, 0, dragItemContent);
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
      {/* <div className="full-width">
        {teamMembers?.length > 0 ? (
          <div className="d-flex align-items-center">
            <span style={{ marginLeft: "5px" }}>
              <a onClick={() => setShow(true)}>
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
      </div> */}

      <Modal
        show={show}
        size="lg"
        // onHide={() => {setShow(false);item?.callBack()}}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header >
          <Modal.Title>Team Members</Modal.Title>
          <span onClick={() => { setShow(false); item?.callBack() }}><i className="svg__iconbox svg__icon--cross crossBtn"></i></span>
        </Modal.Header>
        <Modal.Body>



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
                                    />
                                  </span>
                                ) : (
                                  ""
                                )}
                                {items.Title == "External Staff" ? (
                                  <span

                                  >
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
                                    />
                                  </span>
                                ) : (
                                  ""
                                )}
                                {items.Title == "Senior Developer Team" ? (
                                  <span

                                  >
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
                                    />
                                  </span>
                                ) : (
                                  ""
                                )}
                                {items.Title == "Design Team" ? (
                                  <span

                                  >
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
                                    />
                                  </span>
                                ) : (
                                  ""
                                )}
                                {items.Title == "Junior Developer Team" ? (
                                  <span

                                  >
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
                                    />
                                  </span>
                                ) : (
                                  ""
                                )}
                                {items?.Title == "QA Team" ? (
                                  <span

                                  >
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
                                    />
                                  </span>
                                ) : (
                                  ""
                                )}
                                {items.Title == "Smalsus Lead Team" ? (
                                  <span

                                  >
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
                                    />
                                  </span>
                                ) : (
                                  ""
                                )}
                                {items?.Title == "Ex Staff" ? (
                                  <span

                                  >
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
                                    />
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
                            <img
                              className="me-1"
                              title={items?.Title}
                              style={{ borderRadius: "20px" }}
                              height={"35px"}
                              width={"35px"}
                              src={items?.Item_x0020_Cover?.Url}
                            />
                          </span>
                        </>
                      )
                    })}
                  </div>
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
          <a className="btn btn-primary"
            href={`https://teams.microsoft.com/l/chat/0/0?users=${email}`}
            target="_blank"
            onClick={() => { setShow(false); item?.callBack() }}
          >
            Create
          </a>
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default ShowTeamMembers;
