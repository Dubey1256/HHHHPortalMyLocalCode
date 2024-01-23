import { Panel, PanelType } from "office-ui-fabric-react";
import React, { useEffect, useState } from "react";
import Tooltip from "../../../globalComponents/Tooltip";
import { event } from "jquery";
import GlobalCommanTable from "../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable";
import { Web } from "sp-pnp-js";
import EditPage from "../../../globalComponents/EditPanelPage/EditPage";
// import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';





var id: any = [];
const Permission_management = (props:any) => {
  console.log(props);
  let arr: any = [];
  const [groups, setGroups]: any = useState([]);
  const [truePanel, setTruePanel]: any = useState(false);
  const [optionsData, setOptionsData]: any = useState('');
  const [data, setData]: any = useState([]);
  const [addUser, setAddUser]: any = useState(false);
  const [taskUser, setTaskUser]: any = useState([]);
  const [inputValue, setInputValue]: any = useState({ Title: '', Id: '' });
  const [suggestions, setSuggestions] = useState([]);
  const [checkPermission, setCheckPermission] = useState(false);
  const [permissionUserGroup, setPermissionUserGroup]: any = useState([]);
  const [headerChange, setHeaderChange]: any = useState('');




  useEffect(() => {
    taskUserData()
    getData();
  }, []);


  const taskUserData = async () => {
    let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
    let AllTasksMatches: any = [];
    AllTasksMatches = await web.lists
      .getById("B318BA84-E21D-4876-8851-88B94B9DC300")
      .items.getAll(4000).then((data: any) => {
        setTaskUser(data);
      }).catch((err: any) => {
        console.log(err);
      })
  }

  const getData = async () => {
    await $.ajax({
      method: "GET",
      url: "https://hhhhteams.sharepoint.com/sites/HHHH/SP/_api/web/sitegroups",
      headers: {
        accept: "application/json;odata=verbose",
        "content-Type": "application/json;odata=verbose",
      },
      success: async function (res: any) {
        let newArray: any = [];
        console.log(res);
        arr = res.d.results;

        arr.map((items: any) => {
          if (items?.OwnerTitle !== 'System Account' && !(items?.OwnerTitle.indexOf("KSL") > -1) && !(items?.LoginName.indexOf("KSL") > -1) && !(items?.LoginName.indexOf("Test") > -1) && !(items?.LoginName.indexOf("test")! > -1)) {
            newArray.push(items);
          }
        })

        setGroups(newArray);


      },
    });

    // console.log(Group);
  };



  const GetUserByGroupId = (groupId: any) => {

    id = groupId;
    setOptionsData(groupId);
    if (typeof groupId == "string") {
      id = groupId
      const findByTitle = (array: any, title: any) => {
        return array.find((item: any) => item.Title === title);
      }

      // Use the function to find the object with the specified title
      var foundObject = findByTitle(groups, groupId);

      // Check if the object was found
      if (foundObject) {
        id = foundObject.Id;
      } else {
        id = 0;
      }
    }



    var query = "/_api/web/SiteGroups/GetById(" + id + ")/Users";
    var SiteUrl = "https://hhhhteams.sharepoint.com/sites/HHHH/SP"
    $.ajax({
      url: SiteUrl + query,
      method: "GET",
      async: false,
      headers: {
        "accept": "application/json;odata=verbose",
        "content-Type": "application/json;odata=verbose"
      },
      success: function (data) {
        setTruePanel(true);
        setData(data?.d?.results);

      },
      error: function (data) {
        alert("You do not have rights to access this section");

      },

    });
  };


  // const getRequestDigest = async (localizedPath: string): Promise<string> => {
  //   // Check if 'localizedPath' starts with 'somePrefix'
  //   const startsWithSomePrefix = /^somePrefix/.test(localizedPath);
  
  //   if (startsWithSomePrefix) {
  //     try {
  //       // Perform the asynchronous operation
  //       const response: SPHttpClientResponse = await props.context.spHttpClient.post(
  //         `${props.context.pageContext.web.absoluteUrl}/_api/contextinfo`,
  //         SPHttpClient.configurations.v1
  //       );
  
  //       // Parse the response JSON
  //       const data = await response.json();
  
  //       // Return the FormDigestValue
  //       return data.FormDigestValue;
  //     } catch (error) {
  //       console.error('Error while fetching digest:', error);
  //       // Handle the error or return a default value if needed
  //       return ''; // or throw error;
  //     }
  //   } else {
  //     // Handle the case where localizedPath does not start with 'somePrefix'
  //     console.warn('localizedPath does not start with "somePrefix"');
  //     // Return a default value or throw an error, depending on your requirements
  //     return ''; // or throw new Error('localizedPath does not start with "somePrefix"');
  //   }
  // };
  const postUser = async () => {
    // const digestValue = await getRequestDigest('somePrefixExampleString');
    var url = "https://hhhhteams.sharepoint.com/sites/HHHH/sp" + "/_api/web/sitegroups(" + id + ")/users";
    var data = {
      "__metadata": {
        "type": "SP.User"
      },
      "LoginName": inputValue.LoginName,
    };

    $.ajax({
      url: url,
      method: "POST",
      headers: {
        "accept": "application/json;odata=verbose",
        "content-Type": "application/json;odata=verbose"
      },
      data: JSON.stringify(data),
      success: function (result) {
        console.log(result);
      },
      error: function (result, status) {
        console.log(result);
        alert("You do not have the necessary rights to access this section");
      }
    });
  };


  const checkUser = async () => {
    let newArray: any = [];
    var targetId = inputValue?.AuthorId;
    var query = "/_api/web/GetUserById(" + targetId + ")/Groups";
    var SiteUrl = "https://hhhhteams.sharepoint.com/sites/HHHH/SP";

    await $.ajax({
      url: SiteUrl + query,
      method: "GET",
      async: false,
      headers: {
        "accept": "application/json;odata=verbose",
        "content-Type": "application/json;odata=verbose"
      },
      success: function (data) {
        data?.d?.results?.map((items: any) => {
          if (items?.OwnerTitle !== 'System Account' && !(items?.OwnerTitle.indexOf("KSL") > -1) && !(items?.LoginName.indexOf("KSL") > -1) && !(items?.LoginName.indexOf("Test") > -1) && !(items?.LoginName.indexOf("test")! > -1)) {
            newArray.push(items);
          }
        })
        setPermissionUserGroup(newArray);

      },
      error: function (data) {
        console.log("You do not have rights to access this section");

      },
    });
  };


  const deleteRequestWithOutData = (Idd: any) => {
    let confirmation = confirm("Are you sure you want to delete this User ?");
    if (confirmation) {
      var url = "https://hhhhteams.sharepoint.com/sites/HHHH/sp" + "/_api/web/sitegroups(" + id + ")/users/removebyid(" + Idd + ")";
      $.ajax({
        url: url,
        method: "DELETE",
        headers: {
          accept: "application/json;odata=verbose",
          "content-Type": "application/json;odata=verbose",
        },
        success: function (result) {
          console.log(result);
        },
        error: function (data) {
          alert("You do not have the necessary rights to access this section");
        },
      });
    }
  };




  const onRenderCustomCalculateSC = () => {
    return (
      <>
        <div className='subheading siteColor'>Manage Permissions</div>
        <div><Tooltip ComponentId="1229" /></div>
      </>
    )
  }


  const onRenderCustomCalculateSC1 = () => {
    return (
      <>
        <div className='subheading siteColor'>Add User in {optionsData}</div>
        <div><Tooltip ComponentId="1126" /></div>
      </>
    )
  }

  const onRenderCustomCalculateSC3 = () => {
    return (
      <>
        <div className='subheading siteColor'>Check User Permissions</div>
        <div><Tooltip ComponentId="1126" /></div>
      </>
    )
  }

  const setSelectOptions = (event: any) => {
    id = event.target.value;
    GetUserByGroupId(event.target.value);
  }


  const columns = React.useMemo(
    () => [
      {
        accessorFn: (row: any) => row?.Title,
        cell: ({ row, getValue }: any) => (

          <>{row?.original?.Title}</>


        ),
        id: "Title",
        placeholder: "Title",
        header: "",
        resetColumnFilters: false,
        size: 40,
      },
      {
        accessorFn: (row: any) => row?.Email,
        cell: ({ row, getValue }: any) => (

          <>{row?.original?.Email}</>

        ),
        id: "Email",
        placeholder: "Email",
        header: "",
        resetColumnFilters: false,
        size: 40,
      },
      {
        cell: ({ row, getValue }: any) => (
          <div className='alignCenter'>
            <span onClick={() => { deleteRequestWithOutData(row?.original?.Id) }} className="bg-dark hreflink ml-auto svg__icon--cross svg__iconbox"></span>
          </div>
        ),
        id: "ID",
        placeholder: "",
        header: "",
        resetColumnFilters: false,
        size: 60,
      },
    ],
    [data]
  );

  const callBackData = () => {

  }





  const handleInputChange = (e: any) => {
    const value = e.target.value;
    setInputValue(value);

    const filteredSuggestions = taskUser.filter(
      (item: any) => item?.Title.toLowerCase().includes(value.toLowerCase())
    );

    if (value != undefined && value != null && value != '') {
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }

  };

  const handleSuggestionClick = (suggestion: any) => {
    data?.map((items:any)=>{
      if(items?.Id === suggestion?.AssingedToUserId){
        setInputValue(items);
      }
    })
    
    setSuggestions([]);
    setPermissionUserGroup([]);
  };



const changeHeader=(items:any)=>{
  setHeaderChange(items)
}


  return (
    <>
      <div className="alignCenter">
        <div className="alignCenter">
          <h2 className="heading">{headerChange != undefined && headerChange != null && headerChange != '' ? headerChange : 'Permission-Management'} </h2>
          <EditPage context={props?.context} changeHeader={changeHeader} />
        </div>
        <div className="ml-auto">
              
          <a target="_blank" data-interception="off"  className="fw-bold" href="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Manage-Permission-Tool.aspx">
            Old Permission-Management
          </a>
        </div>
      </div>
      <div className="d-flex justify-content-end" onClick={() => { setCheckPermission(true) }} role="button">
        Check User Permissions
      </div>
      <div className="mb-3 card commentsection">
        <div className="card-header">
          <div className="align-items-center card-title d-flex h5 justify-content-between my-2">Manage Permissions - Users</div>
        </div>
        <div className="card-body d-flex justify-content-around  my-3">
          <div className="card" style={{ width: "14rem" }} onClick={() => { GetUserByGroupId("Designers") }} >
            <div className="card-body" style={{ backgroundColor: "#000066" }} >
              <a className="d-flex flex-column align-items-center mt-2">
                <h6 className="text-white">Designers</h6>
                <img
                  className="m-3"
                  src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/24/PermisssionUser_Icon2.png"
                />
                <span className="fw-bold text-white">Design</span>
              </a>
            </div>
          </div>
          <div className="card" style={{ width: "14rem" }} onClick={() => { GetUserByGroupId("HHHH Visitors") }} >
            <div className="card-body" style={{ backgroundColor: "#000066" }} >
              <a className="d-flex flex-column align-items-center mt-2">
                <h6 className="text-white">HHHH Visitors</h6>
                <img
                  className="m-3"
                  src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/24/PermisssionUser_Icon2.png"
                />
                <span className="fw-bold text-white">Read</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-3 card commentsection">
        <div className="card-header">
          <div className="align-items-center card-title d-flex h5 justify-content-between my-2">Manage Permissions - Admins</div>
        </div>
        <div className="card-body d-flex justify-content-center  my-3" onClick={() => { GetUserByGroupId("HHHH Members") }}>
          <div className="card" style={{ width: "14rem" }}>
            <div className="card-body" style={{ backgroundColor: "#000066" }}>
              <a className="d-flex flex-column align-items-center mt-2">
                <h6 className="text-white">HHHH Members</h6>
                <img
                  className="m-3"
                  src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/24/PermisssionUser_Icon2.png"
                />
                <span className="fw-bold text-white">Edit</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-3 card commentsection">
        <div className="card-header">
          <div className="align-items-center card-title d-flex h5 justify-content-between my-2">Manage Permissions - Users</div>
        </div>
        <div className="card-body d-flex justify-content-around  my-3" >
          <div className="card" style={{ width: "14rem" }} onClick={() => { GetUserByGroupId("HHHH Administrator") }}>
            <div className="card-body" style={{ backgroundColor: "#000066" }}>
              <a className="d-flex flex-column align-items-center mt-2">
                <h6 className="text-white">HHHH Administrator</h6>
                <img
                  className="m-3"
                  src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/24/PermisssionUser_Icon2.png"
                />
                <span className="fw-bold text-white">Full Control</span>
              </a>
            </div>
          </div>

          <div className="card" style={{ width: "14rem" }} onClick={() => { GetUserByGroupId("HHHH Owners") }} >
            <div className="card-body" style={{ backgroundColor: "#000066" }}>
              <a className="d-flex flex-column align-items-center mt-2">
                <h6 className="text-white">HHHH Owners</h6>
                <img
                  className="m-3"
                  src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/24/PermisssionUser_Icon2.png"
                />
                <span className="fw-bold text-white">Full Control</span>
              </a>
            </div>
          </div>

          <div className="card" style={{ width: "14rem" }} onClick={() => { GetUserByGroupId("Offshore Timesheet Admins") }} >
            <div className="card-body" style={{ backgroundColor: "#000066" }}>
              <a className="d-flex flex-column align-items-center mt-2">
                <h6 className="text-white">Offshore Timesheet Admins</h6>
                <img
                  className="m-3"
                  src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/24/PermisssionUser_Icon2.png"
                />
                <span className="fw-bold text-white">Full Control</span>
              </a>
            </div>
          </div>

          <div className="card" style={{ width: "14rem" }} onClick={() => { GetUserByGroupId("Time sheet admin group") }}>
            <div className="card-body" style={{ backgroundColor: "#000066" }}>
              <a className="d-flex flex-column align-items-center mt-2">
                <h6 className="text-white">Time sheet admin group</h6>
                <img
                  className="m-3"
                  src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/24/PermisssionUser_Icon2.png"
                />
                <span className="fw-bold text-white">Full Control</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      <a href="https://hhhhteams.sharepoint.com/sites/HHHH/SP/_layouts/15/user.aspx" className="d-flex justify-content-end">
        OOTB Permissions Management
      </a>


      <Panel
        onRenderHeader={onRenderCustomCalculateSC}
        type={PanelType.large}
        isOpen={truePanel}
        isBlocking={false}
        onDismiss={() => { setTruePanel(false) }}
      >
        <div className="modal-body">
          <div className="text-end hreflink" onClick={() => { setAddUser(true) }} ><span className="svg__iconbox svg__icon--Plus mini" title="Add Document"></span> Add User</div>
          <div className="">
            <select value={optionsData} onChange={setSelectOptions}>
              {
                groups?.map((items: any) =>
                  <option value={items.Title} key={items.Title} >{items.Title}</option>
                )}
            </select>
          </div>
          <div className="Alltable my-3">
            <GlobalCommanTable showHeader={true} showPagination={true} callBackData={callBackData} columns={columns} data={data} />
          </div>
        </div>
        <footer className="text-end">
          <button className="btn btn-primary">Ok</button>
        </footer>
      </Panel>

      <Panel
        onRenderHeader={onRenderCustomCalculateSC1}
        type={PanelType.medium}
        isOpen={addUser}
        isBlocking={false}
        onDismiss={() => { setAddUser(false), setSuggestions([]) }}
        className="PresetDate"
      >
        <div className="modal-body">
          <div className="input-group">
            <label className="form-label full-width">User*</label>
            <input type="text" className="form-control"
              value={inputValue?.Title}
              onChange={handleInputChange} placeholder="Enter names or email addresses..." />
          </div>
          <div className="SmartTableOnTaskPopup w-50">
            <ul className="list-group">
              {suggestions.map((suggestion: any, index: any) => (
                <li className="hreflink list-group-item rounded-0 p-1 list-group-item-action" key={index} onClick={() => handleSuggestionClick(suggestion)}>
                  {suggestion?.Title}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <footer className="mt-4 text-end">
          <button className="me-2 btn btn-primary" onClick={postUser} >Save</button>
          <button className="btn btn-default" onClick={() => { setAddUser(false), setSuggestions([]) }} >Cancel</button>
        </footer>
      </Panel>


      <Panel
        onRenderHeader={onRenderCustomCalculateSC3}
        type={PanelType.medium}
        isOpen={checkPermission}
        isBlocking={false}
        onDismiss={() => { setCheckPermission(false), setSuggestions([]) }}
      >
        <div className="modal-body">
          <div className="row">
            <div className="col-sm-9">
              <div className="input-group">
                <label className="form-label full-width">User*</label>
                <input type="text" className="form-control"
                  value={inputValue?.Title}
                  onChange={handleInputChange} placeholder="Enter names or email addresses..." />
              </div>
              <div className="SmartTableOnTaskPopup w-50">
                <ul className="list-group">
                  {suggestions.map((suggestion: any, index: any) => (
                    <li className="hreflink list-group-item rounded-0 p-1 list-group-item-action" key={index} onClick={() => handleSuggestionClick(suggestion)}>
                      {suggestion?.Title}
                    </li>
                  ))}
                </ul></div>
            </div>
            <div className="col-sm-3">
              <div className="mt-3">
                <button className="btnCol mt-1 btn btn-primary" onClick={checkUser} >Check Permission</button>
              </div>
            </div>
          </div>
          <div className="mt-16">
            <ul className="p-0">
              {permissionUserGroup.map((checkItem: any, index: any) => (
                <li className="alignCenter p-1 bg-ee mb-1 full-width">
                  {checkItem?.Title}
                  <span className="hreflink ml-auto svg__icon--cross svg__iconbox dark"></span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <footer className="mt-4 text-end">
          <button className="btn btn-primary" onClick={() => { setCheckPermission(false), setSuggestions([]) }} >Ok</button>
        </footer>
      </Panel>
    </>
  );
};

export default Permission_management;
