import * as React from "react";
import { useState, useEffect } from "react";
import { Panel, PanelType } from "office-ui-fabric-react";
import pnp from "sp-pnp-js";
import { Web } from "sp-pnp-js";
import { Table } from "react-bootstrap";
import * as $ from "jquery";
import "./pm.css";

var BaseURL1: any;
var BaseUrl: any = window.location.href;
BaseURL1 = window.location.href.split("/_layouts");

var newGrp: any = [];
const Per_management = () => {
  var Group: any = [],
    count = 0,
    arr: any = [],
    item: any = [],
    newGroups: any = [],
    userName: any = [],
    grp: any = [],
    valuess: any = [],
    userId: any,
    usersArr: any = [],
    SpGroups: any = [],
    Flag = true,
    sGgroup: any = [],
    temp: any = [],
    addUsers: any = [];
  // var sitegroup:any=[]
  var checkGroups: any = [];

  const [showgroups, setShowGroups] = useState([
    {
      Title: "Manage Permission-Users",
      Ggroups: [],
      child: [],
      GroupPermission: "Design,Read",
    },
    {
      Title: "Manage Permission- Teams",
      Ggroups: [],
      child: [],
      GroupPermission: "Edit",
    },
    {
      Title: "Manage Permission- Admins",
      Ggroups: [],
      child: [],
      GroupPermission: "Full Control",
    },
  ]);

  const [userHierarchy, setuserHierarchy]: any = React.useState([
    { Title: "Approvers", Ugroups: [] },
    { Title: "Designers", Ugroups: [] },
    { Title: "GmBH HR", Ugroups: [] },
    { Title: "GmbH Members ", Ugroups: [] },
    { Title: "GmbH Owners", Ugroups: [] },
    { Title: "GmbH Visitors", Ugroups: [] },
    { Title: "HHHH Administrator", Ugroups: [] },
    { Title: "HHHH HR", Ugroups: [] },
    { Title: "HHHH Members", Ugroups: [] },
    { Title: "HHHH Owners", Ugroups: [] },
    { Title: "HHHH Visitors", Ugroups: [] },
    { Title: "Hierarchy Managers", Ugroups: [] },
    { Title: "HR Members", Ugroups: [] },
    { Title: "HR Owners", Ugroups: [] },
    { Title: "HR Visitors", Ugroups: [] },
    { Title: "Offshore Timesheet Admins", Ugroups: [] },
    { Title: "Quick Deploy Users", Ugroups: [] },
    { Title: "Restricted Readers", Ugroups: [] },
    { Title: "Shareweb Migration-Network Members", Ugroups: [] },
    { Title: "Shareweb Migration-Network Owners", Ugroups: [] },
    { Title: "Shareweb Migration-Network Visitors", Ugroups: [] },
    { Title: "SH Members", Ugroups: [] },
    { Title: "SH Owners", Ugroups: [] },
    { Title: "SH Visitors", Ugroups: [] },
    { Title: "Smalsus Members", Ugroups: [] },
    { Title: "Smalsus Owners", Ugroups: [] },
    { Title: "Smalsus Visitors", Ugroups: [] },
    { Title: "Style Resource Readers", Ugroups: [] },
    { Title: "Time sheet admin group", Ugroups: [] },
    { Title: "Training  Members", Ugroups: [] },
    { Title: "Training Owners", Ugroups: [] },
    { Title: "Training Visitors", Ugroups: [] },
    { Title: "Translaton Managers", Ugroups: [] },
  ]);

  const [refreshState, setRefreshState] = useState(false);
  const [readPanel, setreadPanel] = useState(false);
  const [readPanel1, setreadPanel1] = useState(false);
  const [readopenPanel, setReadOpenPanel] = useState<any>(false);

  // const [edit, setEdit] = useState({});
  const [valNew, setValNew] = useState("");
  const [valueSearch, setValueSearch] = useState("");
  const [usersGrp, setUsersGrp]: any = useState([]);
  const [newUsersGroupp, setnewUsersGroupp] = useState([]);
  const [visitors, setVisitors] = useState();
  const [newGrps, setNewGrps] = useState([]);
  const [counts, setcounts] = useState<any>(0);
  const [addds, setAddds] = useState([]);

  const [addUserTemp, setaddUserTemp] = useState([]);

  const getData = async () => {
    await $.ajax({
      method: "GET",
      url: "https://hhhhteams.sharepoint.com/sites/HHHH/SP/_api/web/sitegroups",
      headers: {
        accept: "application/json;odata=verbose",
        "content-Type": "application/json;odata=verbose",
      },
      success: async function (res: any) {
        console.log(res);
        arr = res.d.results;

        for (let i = 0; i < arr.length; i++) {
          if (arr[i].OwnerTitle != "System Account") item.push(arr[i]);
        }
        //   if(BaseUrl.indexOf('SP')>-1)
        //   for(let i in item){
        //     if(!(item[i].OwnerTitle.indexOf("KSL")>-1))
        //     newGrp.push(item)
        // }

        //  item.forEach((val:any)=>{
        //   val.OwnerTitle=item.OwnerTitle
        //  })

        if (BaseUrl.indexOf("SP") > -1) {
          for (let i in item) {
            if (!(item[i].OwnerTitle.indexOf("KSL") > -1)) newGrp.push(item[i]);
          }
        }
        $.each(newGrp, function (index: any, group: any) {
          count = count + 1;

          Daata(group);
        });
      },
    });

    console.log(Group);
  };
  useEffect(() => {
    getData();
  }, []);

  const Daata = async (val: any) => {
    if (val.Id != "196") {
      await $.ajax({
        url:
          "https://hhhhteams.sharepoint.com/sites/HHHH/SP/_api/web/RoleAssignments/GetByPrincipalId(" +
          val.Id +
          ")/RoleDefinitionBindings",
        method: "GET",
        headers: {
          accept: "application/json;odata=verbose",
          "content-Type": "application/json;odata=verbose",
        },
        success: function (data1) {
          // console.log( "my data is",data1)
          val["Permissionname"] = data1.d.results[0].Name;
          if (count == newGrp.length) {
            groupData();
          }
        },
        error: function (data1) {
          console.log(data1);
        },
      });
    }

    // useEffect(()=>{
    //     Daata()
    // },[]);
  };

  const groupData = async () => {
    let local = showgroups;
    var a = false;
    $.each(local, function (_index: any, hierarchy: any) {
      $.each(newGrp, function (_index: any, Group: any) {
        if (
          hierarchy["GroupPermission"].indexOf(Group["Permissionname"]) > -1
        ) {
          hierarchy.Ggroups.push(Group);
        }
      });
      //  setShowGroups(local)
    });
    setRefreshState(!refreshState);

    local?.forEach((ba: any) => {
      ba.child = ba.Ggroups?.filter((val: any, id: any, array: any) => {
        return array.indexOf(val) == id;
      });
      setShowGroups(local);
    });
    setcounts(count + 1);
    setcounts((counts: any) => [...counts]);
  };
  // useEffect(()=>{
  //     groupData()
  //   },[]);

  // const uniqueValues=showgroups.filter((_dup:any,index:any)=>{
  //   return(showgroups.indexOf(_dup)== index)
  // })
  //   console.log(uniqueValues)
  const onSearch = (event: any) => {
    var s = event.target.value;
    setValNew(s);
    console.log(s);

    if (s.length > 0) {
      var a = usersGrp.filter((data: any) =>
        data.title.toLowerCase().includes(s)
      );
      setUsersGrp(a);
      console.log(a);
    } else {
      setUsersGrp(newUsersGroupp);
    }
  };

  /*---Functions for Add/Remove users from group---*/

  const BindUsersByGroup: any = async () => {
    Flag = true;
    await LoadUserByGroupId(checkGroups.Id, checkGroups.Title);
  };

  const DisplayOwners = async (d1: any) => {
    if (BaseUrl.indexOf("SP") > -1) {
      for (let i = 0; i < newGrp.length; i++) {
        if (
          !(newGrp[i].OwnerTitle.indexOf("KSL") > -1) &&
          !(newGrp[i].LoginName.indexOf("KSL") > -1) &&
          !(newGrp[i].LoginName.indexOf("Test") > -1) &&
          !(newGrp[i].LoginName.indexOf("test")! > -1)
        ) {
          SpGroups.push(newGrp[i]);
        }
      }
    }
    // SpGroups?.forEach((group:any, _index:any)=>{
    //   if(group.Title == d1)
    //   checkGroups = group

    // })
    $.each(SpGroups, function (index: any, group: any) {
      if (group.Title == d1) checkGroups = group;
    });

    // await LoadUserByGroupId(checkGroups.Id, checkGroups.Title);
    // showGroupps(checkGroups.Id, checkGroups.Title);
    // if (Flag == true) {
    //   setreadPanel(true);
    // }
    showGroupps(checkGroups.Id, checkGroups.Title);
    console.log(newGrp);
    setNewGrps(SpGroups);
  };

  const showGroupps = async (groupId: any, groupName: any) => {
    var newArr: any[];

    usersArr.length = 0;
    var query = "/_api/web/SiteGroups/GetById(" + groupId + ")/Users";
    await $.ajax({
      url: BaseURL1[0] + query,
      method: "GET",
      async: false,
      headers: {
        accept: "application/json;odata=verbose",
        "content-Type": "application/json;odata=verbose",
      },
      success: function (data1) {
        newArr = data1.d.results;
        $.each(newArr, function (i: any, value: any) {
          if (
            newArr[i].Title != "System Account" &&
            newArr[i].Title != groupName
          ) {
            Flag = true;
            userId = newArr[i].Id;
            var userEmail = newArr[i].Email;
            var userTitle = newArr[i].Title;
            var userLoginName = newArr[i].LoginName.replace("#", "%23");
            var userObj: any = {
              userLoginName: userLoginName,
              id: userId,
              title: userTitle,
              email: userEmail,
            };

            userObj.userLoginName = userLoginName;
            userObj.id = userId;
            userObj.title = userTitle;
            userObj.email = userEmail;

            usersArr.push(userObj);
          } // end of IF system account
        });
        setUsersGrp(usersArr);

        setnewUsersGroupp(usersArr);
        console.log(addds);
      },
      error: function (data1) {
        setreadPanel(false);
        Flag = false;
        alert("You do not have rights to access this section");
      },
    });
  };

  const LoadUserByGroupId = async (GroupId: any, GroupName: any) => {
    showGroupps(GroupId, GroupName);
  };

  const onSearching = (event: any) => {
    var sr = event.target.value;
    setValueSearch(sr);
    console.log(sr);
  };

  const changex = () => {
    setValNew("");
  };

  const titlex = () => {
    console.log(usersGrp);
    var tile = [...usersGrp].reverse();
    console.log(tile);
    setUsersGrp(tile);
  };

  const changeCancel = () => {
    setValueSearch("");
  };

  // const userData=async ()=>{
  //   const web =new Web('https://smalsusinfolabs.sharepoint.com/sites/Dashboard');
  //   const res = await web.lists.getByTitle('').items.get();

  // }

  const saveData = (searchTerm: any) => {
    let v = searchTerm,
      s: any;
    setValueSearch(v);

    $.each(addds, function (i: any, user: any) {
      if (v == user.title) {
        s = user.userLoginName;
        InsertUserByLoginNameInGroupById(user.userLoginName, checkGroups.Id);
      }

      console.log(s);
    });
  };

  const InsertUserByLoginNameInGroupById = async (
    userLoginName: any,
    groupId: any
  ) => {
    var url =
      "https://hhhhteams.sharepoint.com/sites/HHHH/admin/_api/web/sitegroups(" +
      groupId +
      ")/users";
    var data = {
      __metadata: {
        type: "SP.User",
      },
      LoginName: userLoginName,
    };

    postRequest(data, url);
  };

  const postRequest = (data: any, url: any) => {
    $.ajax({
      url: url,
      method: "POST",
      headers: {
        accept: "application/json;odata=verbose",
        "content-Type": "application/json;odata=verbose",
      },
      data: JSON.stringify(data),
      success: function (result) {
        BindUsersByGroup();
      },
      error: function (result, status) {
        alert("You do not have the necessary rights to access this section");
        BindUsersByGroup();
        setReadOpenPanel(false);
      },
    });
  };

  const openreadPanel = (d1: any, Id: any) => {
    let visitorsSet = visitors;
    visitorsSet = d1;
    setVisitors(visitorsSet);
    setreadPanel(true);
    DisplayOwners(d1);
    // setreadPanel(true)
    // setEdit(Ide)
  };
  //  ---- main panel open start-----

  const dismissPanel = () => {
    setreadPanel(false);
  };
  // -----close----

  //  add user Panel functionality

  const closereadPanel3 = () => {
    setReadOpenPanel(false);
  };

  const oppenAddPanel = () => {
    setReadOpenPanel(true);
    setcounts(counts + 1);
    insertData();
  };

  const insertData = () => {
    let localU = userHierarchy,
      userEmail,
      userTitle;
    var newArr: any = [],
      ntmp = [];

    if (BaseUrl.indexOf("SP") > -1) {
      for (let i = 0; i < newGrp.length; i++) {
        if (
          !(newGrp[i].OwnerTitle.indexOf("KSL") > -1) &&
          !(newGrp[i].LoginName.indexOf("KSL") > -1) &&
          !(newGrp[i].LoginName.indexOf("Test") > -1) &&
          !(newGrp[i].LoginName.indexOf("test")! > -1)
        ) {
          SpGroups.push(newGrp[i]);
        }
      }
    }
    $.each(SpGroups, function (index: any, group: any) {
      $.each(localU, function (i: any, groups: any) {
        var localvar: any = [];
        if (groups.Title == group.Title) {
          var query = "/_api/web/SiteGroups/GetById(" + group.Id + ")/Users";
          $.ajax({
            url: BaseURL1[0] + query,
            method: "GET",
            async: false,
            headers: {
              accept: "application/json;odata=verbose",
              "content-Type": "application/json;odata=verbose",
            },
            success: function (data) {
              newArr = data.d.results;
              $.each(newArr, function (i: any, value: any) {
                if (
                  newArr[i].Title != "System Account" &&
                  newArr[i].Title != group.Title
                ) {
                  userId = newArr[i].Id;
                  userEmail = newArr[i].Email;
                  userTitle = newArr[i].Title;
                  var userLoginAddName = newArr[i].LoginName;

                  var userObj: any = {
                    Name: userTitle,
                    id: userId,
                    email: userEmail,
                    // userUrl:'',
                    // pictureUrl:''
                  };

                  var userAdd: any = {
                    userLoginName: userLoginAddName,
                    id: userId,
                    title: userTitle,
                    email: userEmail,
                    // userUrl:'',
                    // pictureUrl:''
                  };
                } // end of IF system account
                temp.push(userObj?.Name);
                // console.log(temp);
                // groups.Ugroups.push(userObj);
                localvar.push(userObj);
                groups.Ugroups = localvar;
                addUsers.push(userAdd);
              });
            },
            error: function () {
              console.log("error");
            },
          });
        }
      });
      // userNameArray=[...new Set(temp)]
      setuserHierarchy(localU);
      setAddds(addUsers);
      // setReadOpenPanel(true);
    });

    for (let i = 0; i < temp.length; i++) {
      if (ntmp.indexOf(temp[i]) === -1) {
        ntmp.push(temp[i]);
      }
    }

    setaddUserTemp(ntmp);
  };

  const onOptionHandle = (event: any) => {
    valuess = event.target.value;
    setVisitors(valuess);
    DisplayOwners(valuess);
    openreadssPanel(valuess);
    console.log(event.target.value);
  };

  const openreadssPanel = (gg: any) => {
    setreadPanel1(true);
  };

  const RemoveSiteOwner = async (U: any) => {
    pnp.sp.web.currentUser.get().then((result: { Id: any }) => {
      console.log(result);
      userId = result.Id;
    });

    if (userId == U) {
      alert("You cannot remove yourself!");
      return false;
    }
    var flag = confirm("Are you sure, you want to delete this?");
    if (flag) {
      RemoveUserByLoginName(U, checkGroups.Id);
    }
  };

  const RemoveUserByLoginName = async (userId: any, groupId: any) => {
    var url =
      BaseURL1 +
      "/_api/web/sitegroups(" +
      groupId +
      ")/users/removebyid(" +
      userId +
      ")";
    return postRequestWithOutData(url);
  };

  const postRequestWithOutData = (baseUrl: any) => {
    $.ajax({
      url: baseUrl,
      method: "POST",
      headers: {
        accept: "application/json;odata=verbose",
        "content-Type": "application/json;odata=verbose",
      },
      success: function (result) {
        BindUsersByGroup();
      },
      error: function (data) {
        alert("You do not have the necessary rights to access this section");
      },
    });
  };

  return (
    <>
    {/*-------common header----- */}
      <div>
        <h2 className="d-flex justify-content-between align-items-center siteColor  serviceColor_Active">
          <div>Permission-Management</div>

          <div className="text-end fs-6">
            <a href="#">Check User Permissions</a>
          </div>
        </h2>
      </div>
      <div>
            {/*------- common header-----*/}
        <Panel
          className="p1"
          headerText="Manage Permissions"
          isOpen={readPanel}
          onDismiss={dismissPanel}
          isFooterAtBottom={true}
          isBlocking={!readPanel && !openreadPanel}
          type={PanelType.custom}
          customWidth="850px"
        >
          <a href="#" className="Permissionss" onClick={() => oppenAddPanel()}>
            <span className="iconss">
              <i className="fa fa-plus" aria-hidden="true"></i>Add User
            </span>
          </a>

          <div className="container">
            <div className="row">
              <div className="col-sm-6">
                <select
                  className="select"
                  value={visitors}
                  onChange={(event) => onOptionHandle(event)}
                >
                  {showgroups?.map((option: any, index: any) => {
                    return (
                      <>
                        {option?.child.map((_ie: any, index: any) => {
                          return (
                            <>
                              <option value={_ie.Title} key={index}>
                                {_ie.Title}
                              </option>
                            </>
                          );
                        })}
                      </>
                    );
                  })}
                </select>
              </div>
              <div className="col-sm-6">
                <input
                  type="text"
                  className="search"
                  placeholder="Search User..."
                  value={valNew}
                  onChange={onSearch}
                />
                <button className="btnn" onClick={() => changex()}>
                  {" "}
                  X{" "}
                </button>
              </div>
            </div>
          </div>
          <table>
            <thead>
              <tr className="inner">
                <th onClick={() => titlex()}>
                  <span className="ty">Title</span>
                </th>
                <th onClick={() => titlex()}>
                  <span className="ty1">Email</span>
                </th>
              </tr>
            </thead>
            {/* <tbody>
              {usersArr?.map((ins1:any, i:any)=>{
              return(
                  <>
                  <tr>
                     <td><span> {ins1.title}</span> </td>               
                    <td><span> {ins1.email}</span></td>
                   
                  </tr>
                  
                  </>

                
              )
                
               })} 

            </tbody> */}

            <tbody>
              {usersGrp?.map((op: any, i: any) => {
                return (
                  <tr className="roww">
                    <td>
                      <span>{op.title}</span>
                    </td>
                    <td className="emails">{op.email}</td>
                    <td>
                      <a className="pull-right">
                        <img
                          src="/_layouts/images/delete.gif"
                          onClick={() => RemoveSiteOwner(op.id)}
                        />
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Panel>
      </div>

      {/* add user panel open*/}

      <div>
        <Panel
          headerText={`Add User in ${visitors}`}
          isOpen={readopenPanel}
          onDismiss={closereadPanel3}
          isBlocking={!readopenPanel && !oppenAddPanel}
          isFooterAtBottom={true}
        >
          <div>
            <div>
              <div>
                <label className="labels">User </label>
                <span>
                  <input
                    type="text"
                    className="search_icon"
                    placeholder="Enter names or email addresses..."
                    value={valueSearch}
                    onChange={onSearching}
                  />
                </span>
                <br></br>
                {/* <button className="savebutton  btn btn-primary"  onClick={() => saveData(valueSearch)} >Save</button>
                <button className="buttoncancel" onClick={() => changeCancel()} > Cancel</button> */}
              </div>
              <div className="dropdown">
                {addUserTemp
                  ?.filter((item) => {
                    // item?.toLowerCase().includes(item);

                    const searchTerm = valueSearch?.toLowerCase();
                    const fullName = item?.toLowerCase();

                    return (
                      searchTerm &&
                      fullName?.startsWith(searchTerm) &&
                      fullName !== searchTerm
                    );
                  })
                  .slice(0, 10)
                  .map((item) => (
                    <div
                      onClick={() => saveData(item)}
                      className="dropdown-row"
                      key={item}
                    >
                      {item}
                    </div>
                  ))}
              </div>
              <button
                className="savebutton  btn btn-primary"
                onClick={() => saveData(valueSearch)}
              >
                Save
              </button>
              <button className="buttoncancel" onClick={() => changeCancel()}>
                {" "}
                Cancel
              </button>
            </div>
          </div>
        </Panel>
      </div>
      {/* -----end add user panel----- */}

      <div>

        {showgroups?.map((options: any, _index: any) => {

          return (

          <>

            <div className="pannel">

              <div className="heading">

                <h3 className="panel-title ">

                  {options.Title}

                </h3>

              </div>

              {/* <div className='large-div'>

                <div  className='min-div'>

                 <div className='groups'>

                   {options.GroupPermission}

                 </div>

                </div>

              </div> */}

              <div className='panel-body'>

              <div className='d-flex justify-content-center  mb-3'>

                    {options?.child.map((option: any, _index: any)=>{

                      return(

                        <>

                       

                        <div className='cardbox block'>

                        <a href="#"  onClick={() => openreadPanel(option.Title, option.Id)}>

                          <h2>{option.Title }</h2>

                          <span>  <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/24/PermisssionUser_Icon2.png" /></span>

                          <span>{option.Permissionname}</span>

                        </a>

                        </div>

                        </>

                      )

                     

                     })    

                   }

                           

              </div>

              </div>

            </div>

          </>

          )

        })}

      </div>
    </>
  );
};

export default Per_management;