import { Panel, PanelType } from "office-ui-fabric-react";
import * as React from 'react';
import * as $ from 'jquery';
// import Tooltip from "../../../globalComponents/Tooltip";
import {
  PeoplePicker,
  PrincipalType,
} from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { Web} from "sp-pnp-js";
import GlobalCommanTable from "../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable";
import Tooltip from "../../../globalComponents/Tooltip";
import EditPage from "../../../globalComponents/EditPanelPage/EditPage";
// import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';

var id: any = [];
const Permission_management = (props: any) => {
  console.log(props);
  let arr: any = [];
  const [groups, setGroups]: any = React.useState([]);
  const [groupsMember, setGroupsMember]: any = React.useState([]);
  const [tiles, setTiles]: any = React.useState([]);
  const [descriptionChange, setDescriptionChange]: any = React.useState("");
  const [truePanel, setTruePanel]: any = React.useState(false);
  const [optionsData, setOptionsData]: any = React.useState("");
  const [data, setData]: any = React.useState([]);
  const [addUser, setAddUser]: any = React.useState(false);
  const [taskUser, setTaskUser]: any = React.useState([]);
  const [inputValue, setInputValue]: any = React.useState({ Title: "", Id: "" });
  const [suggestions, setSuggestions] = React.useState([]);
  const [checkPermission, setCheckPermission] = React.useState(false);
  const [permissionUserGroup, setPermissionUserGroup]: any = React.useState([]);
 const [headerChange, setHeaderChange]: any = React.useState("");
  const [selectedPeople, setSelectedPeople] = React.useState([]);
 const [checkUserPermission, setCheckUserPermission]: any = React.useState([]);

   React.useEffect(() => {
     taskUserData();
    getData();
    tilesData();
  }, []);

  const taskUserData = async () => {
    let web = new Web(props?.context?.siteUrl);
    let AllTasksMatches: any = [];
    AllTasksMatches = await web.lists
      .getById(props?.context?.TaskUserListID)
      .items.getAll(4000)
      .then((data: any) => {
        setTaskUser(data);
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  const tilesData = async () => {
    let web = new Web(props?.context?.siteUrl);
    await web.lists
      .getById(props?.context?.TilesManagementListID)
      .items.getAll()
      .then((data: any) => {
       console.log(data);
       setTiles(data);
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  const getData = async () => {
    await $.ajax({
      method: "GET",
      url: `${props?.context?.siteUrl}/_api/web/sitegroups`,
      headers: {
        accept: "application/json;odata=verbose",
        "content-Type": "application/json;odata=verbose",
      },
      success: async function (res: any) {
        let newArray: any = [];
        console.log(res);
        arr = res.d.results;

        arr.map((items: any) => {
          if (
            items?.OwnerTitle !== "System Account" &&
            !(items?.OwnerTitle.indexOf("KSL") > -1) &&
            !(items?.LoginName.indexOf("KSL") > -1) &&
            !(items?.LoginName.indexOf("Test") > -1) &&
            !(items?.LoginName.indexOf("test")! > -1)
          ) {
            newArray.push(items);
          }
        });

        setGroups(newArray);
      },
    });

    // console.log(Group);
  };
  const changeDescription = (items: any) => {
    setDescriptionChange(items);
  };
  const GetUserByGroupId = (groupId: any) => {
    id = groupId;
    setOptionsData(groupId);
    if (typeof groupId == "string") {
      id = groupId;
      const findByTitle = (array: any, title: any) => {
        return array.find((item: any) => item.Title === title);
      };

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
    var SiteUrl = props?.context?.siteUrl;
    $.ajax({
      url: SiteUrl + query,
      method: "GET",
      async: false,
      headers: {
        accept: "application/json;odata=verbose",
        "content-Type": "application/json;odata=verbose",
      },
      success: function (data:any) {
        setTruePanel(true);
        setData(data?.d?.results);
      },
      error: function (data:any) {
        alert("You do not have rights to access this section");
      },
    });
  };

  
  const postUser = async () => {
    const webUrl = props?.context?.siteUrl;
    // const id = 1; // Replace with your actual group ID
    // const inputValue = { Email: "user@example.com" }; // Replace with your actual input value

    try {
      // Ensure the SPFx context is available
      const web = new Web(webUrl);

      // Construct the user data
      // const userData:any = {
      //   LoginName: `i:0#.f|membership|${inputValue.Email}`
      // };
      // var data: any = {
      //   LoginName: `i:0#.f|membership|${selectedPeople[0].secondaryText}`,
      // };
      // let loginName : any = ;

      // Make the HTTP POST request to add the user to the group
      await web.siteGroups.getById(id).users.add(`i:0#.f|membership|${selectedPeople[0].secondaryText}`);

      alert("User added successfully");
      setInputValue({ ...inputValue, Title: "" });
    } catch (error) {
      console.error(error);

      // Handle unauthorized/forbidden error
      if (error.status === 403 || error.status === 401) {
        alert("You do not have the necessary rights to access this section");
      } else {
        alert("An error occurred while adding the user");
      }
    }
  };

  const checkUser = async () => {
    const filteredSuggestions : any= taskUser.filter((suggestion: any) =>
      selectedPeople.some(
        (limitedItem: any) => limitedItem.secondaryText == suggestion?.Email
      )
    );

    let commanArray: any = [];
    filteredSuggestions?.map(async (items: any) => {
      let newArray: any = [];
      var targetId = items?.AuthorId;
      var query = "/_api/web/GetUserById(" + targetId + ")/Groups";
      var SiteUrl = props?.context?.siteUrl;

      await $.ajax({
        url: SiteUrl + query,
        method: "GET",
        async: false,
        headers: {
          accept: "application/json;odata=verbose",
          "content-Type": "application/json;odata=verbose",
        },
        success: function (data) {
          data?.d?.results?.map((items: any) => {
            if (
              items?.OwnerTitle !== "System Account" &&
              !(items?.OwnerTitle.indexOf("KSL") > -1) &&
              !(items?.LoginName.indexOf("KSL") > -1) &&
              !(items?.LoginName.indexOf("Test") > -1) &&
              !(items?.LoginName.indexOf("test")! > -1)
            ) {
              newArray.push(items);
            }
          });

          commanArray.push(...newArray);
        },
        error: function (data) {
          console.log("You do not have rights to access this section");
        },
      });
    });
    const newArrayWithoutDuplicates = commanArray.filter((obj : any, index : any, self: any) =>
  index === self.findIndex((o: any) => o.Id === obj.Id)
);
    // const newArrayWithoutDuplicates : any= Array.from(new Set(commanArray.map((obj:any) => obj.Id))).map((Id:any) => commanArray.find((obj:any) => obj.Id === Id));
    setPermissionUserGroup(newArrayWithoutDuplicates);
  };

  const deleteRequestWithOutData = (Idd: any) => {
    let confirmation = confirm("Are you sure you want to delete this User ?");
    if (confirmation) {
      var url = `${props?.context?.siteUrl}/_api/web/sitegroups${id}/users/removebyid${Idd}`;
      $.ajax({
        url: url,
        method: "DELETE",
        headers: {
          accept: "application/json;odata=verbose",
          "content-Type": "application/json;odata=verbose",
        },
        success: function (result: any) {
          console.log(result);
        },
        error: function () {
          alert("You do not have the necessary rights to access this section");
        },
      });
    }
  };

  React.useEffect(() => {
    if (descriptionChange != null && descriptionChange != undefined){
        let modifiedDescription : any = descriptionChange.replace("<p>", "");
        modifiedDescription = modifiedDescription.replace("</p>", "");
        setDescriptionChange(modifiedDescription)
    }
}, [changeDescription])

  const onRenderCustomCalculateSC = () => {
    return (
      <>
       <div className="subheading">Manage Permissions</div>
        <div>
          <Tooltip ComponentId="1229" />
        </div>
      </>
    );
  };

  const onRenderCustomCalculateSC1 = () => {
    return (
      <>
        <div className="subheading">Add User in {optionsData}</div>
        <div>
          <Tooltip ComponentId="1126" />
        </div>
      </>
    );
  };

  const onRenderCustomCalculateSC3 = () => {
    return (
      <>
       
        <div className="subheading">Check User Permissions {optionsData}</div>
        <div>
          <Tooltip ComponentId="1126" />
        </div>
      </>
    );
  };

  const setSelectOptions = (event: any) => {
    id = event.target.value;
    GetUserByGroupId(event.target.value);
  };

  const columns = React.useMemo(
    () => [
      {
        accessorFn: (row: any) => row?.Title,
        cell: ({ row, getValue }: any) => <>{row?.original?.Title}</>,
        id: "Title",
        placeholder: "Title",
        header: "",
        resetColumnFilters: false,
        size: 40,
      },
      {
        accessorFn: (row: any) => row?.Email,
        cell: ({ row, getValue }: any) => <>{row?.original?.Email}</>,
        id: "Email",
        placeholder: "Email",
        header: "",
        resetColumnFilters: false,
        size: 40,
      },
      {
        cell: ({ row, getValue }: any) => (
          <div className="alignCenter">
            <span
              // onClick={() => {
              //   deleteRequestWithOutData(row?.original?.Id);
              // }}
              className="bg-dark hreflink ml-auto svg__icon--cross svg__iconbox"
            ></span>
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

  const callBackData = () => {};

  const handleInputChange = (e: any) => {
    const value = e.target.value;
    setInputValue(value);

    // const filteredSuggestions = taskUser.filter((item: any) =>
    //   item?.Title.toLowerCase().includes(value.toLowerCase())
    // );

    // if (value != undefined && value != null && value != "") {
    //   setSuggestions(filteredSuggestions);
    // } else {
    //   setSuggestions([]);
    // }
  };

  const handleSuggestionClick = (suggestion: any) => {
    suggestions?.map((items: any) => {
      if (items?.AssingedToUserId === suggestion?.AssingedToUserId) {
        setInputValue(items);
      }
    });

    setSuggestions([]);
    setPermissionUserGroup([]);
  };

//   const AssignedToUser = (item: any) => {
//     if (item.length > 0) {
//       const email = item.length > 0 ? item[0].loginName.split("|").pop() : null;
//       const member = data.filter((elem: any) => elem.Email === email);
//       // setAssignedToUser(member)
//       // setIsUserNameValid(true);
//     } else {
//       // setAssignedToUser([])
//       // setIsUserNameValid(false);
//     }
//   };

  const changeHeader = (items: any) => {
    setHeaderChange(items);
  };

  const handlePeoplePickerChange = (items: any) => {
    setSelectedPeople(items);
  };

  return (
    <>
    
        <div className="alignCenter">
          <h2 className="heading">
          Permission-Management
            {headerChange != undefined &&
            headerChange != null &&
            headerChange != ""
              ? headerChange
              : "Permission-Management"}{" "}
          </h2>
          <h4 className="heading">
            {descriptionChange != undefined &&
            descriptionChange != null &&
            descriptionChange != ""
              ? descriptionChange
              : ""}
          </h4>
          <EditPage
            context={props?.context}
            changeHeader={changeHeader}
            changeDescription = {changeDescription}
            tooltipId={"956"}
          /> 
        </div>
     
      <div
        className="d-flex justify-content-end"
        onClick={() => {
          setCheckPermission(true);
        }}
        role="button"
      >
        Check User Permissions
      </div>
      {
       tiles?.length > 0 && tiles.some((item:any) => item.Itemtype === 'Manage Permissions-Users') &&
       <div className="mb-3 card commentsection">
       <div className="card-header">
         <h2 className="align-items-center heading card-title d-flex h5 justify-content-between my-2">
           Manage Permissions - Users
         </h2>
       </div>
       <div className="card-body d-flex justify-content-around  my-3">
         {
           tiles?.length > 0 &&
           tiles?.map((tilesItem:any)=> tilesItem?.Itemtype == "Manage Permissions-Users" &&
           <div
           className="card"
           style={{ width: "14rem" }}
           onClick={() => {
             GetUserByGroupId(tilesItem?.Title);
           }}
         >
           <div className="card-body bg-siteColor">
             <a className="d-flex flex-column align-items-center mt-2">
               <h6 className="text-white">{tilesItem?.Title}</h6>
               <img
                 className="m-3"
                 src="https://www.gruene-washington.de/PublishingImages/Icons/32/admin.png"
               />
               <span className="fw-bold text-white">{tilesItem?.Footer}</span>
             </a>
           </div>
         </div>
           )
         }
       </div>
     </div>
      }
    
{
   tiles?.length > 0 && tiles.some((item:any) => item.Itemtype === 'Manage Permissions-Team') &&
   <div className="mb-3 card commentsection">
   <div className="card-header">
     <h2 className="align-items-center heading card-title d-flex h5 justify-content-between my-2">
     Manage Permissions - Teams
     </h2>
   </div>
   <div className="card-body d-flex justify-content-around  my-3">
     {
       tiles?.length > 0 &&
       tiles?.map((tilesItem:any)=> tilesItem?.Itemtype == "Manage Permissions-Team" &&
       <div
       className="card"
       style={{ width: "14rem" }}
       onClick={() => {
         GetUserByGroupId(tilesItem?.Title);
       }}
     >
       <div className="card-body bg-siteColor">
         <a className="d-flex flex-column align-items-center mt-2">
           <h6 className="text-white">{tilesItem?.Title}</h6>
           <img
             className="m-3"
             src="https://www.gruene-washington.de/PublishingImages/Icons/32/admin.png"
           />
           <span className="fw-bold text-white">{tilesItem?.Footer}</span>
         </a>
       </div>
     </div>
       )
     }
   </div>
 </div>
}

{
  tiles?.length > 0 && tiles.some((item:any) => item.Itemtype === 'Manage Permissions-Admins') &&
   
  <div className="mb-3 card commentsection">
  <div className="card-header">
    <h2 className="align-items-center heading card-title d-flex h5 justify-content-between my-2">
    Manage Permissions - Admins
    </h2>
  </div>
  <div className="card-body  d-flex justify-content-around  my-3">
    {
      tiles?.length > 0 &&
      tiles?.map((tilesItem:any)=> tilesItem?.Itemtype == "Manage Permissions-Admins" &&
      <div
      className="card"
      style={{ width: "14rem" }}
      onClick={() => {
        GetUserByGroupId(tilesItem?.Title);
      }}
    >
      <div className="card-body bg-siteColor">
        <a className="d-flex flex-column align-items-center mt-2">
          <h6 className="text-white">{tilesItem?.Title}</h6>
          <img
            className="m-3"
            src="https://www.gruene-washington.de/PublishingImages/Icons/32/admin.png"
          />
          <span className="fw-bold text-white">{tilesItem?.Footer}</span>
        </a>
      </div>
    </div>
      )
    }
  </div>
</div>
}
  

      <a
       target="_blank"
       data-interception="off"
        href={`${props?.context?.siteUrl}/_layouts/15/user.aspx`}
        className="d-flex justify-content-end"
      >
        OOTB Permissions Management
      </a>

      <Panel
        onRenderHeader={onRenderCustomCalculateSC}
        className='PresetDate'
        type={PanelType.large}
        isOpen={truePanel}
        isBlocking={false}
        onDismiss={() => {
          setTruePanel(false);
        }}
      >
        <div className="modal-body">
          <div className="text-end hreflink" onClick={() => setAddUser(true)}>
            <span
              className="svg__iconbox svg__icon--Plus mini"
              title="Add Document"
            ></span>{" "}
            Add User
          </div>
          <div className="">
            <select value={optionsData} onChange={setSelectOptions}>
              {tiles?.map((items: any) => (
                <option value={items.Title} key={items.Title}>
                  {items.Title}
                </option>
              ))}
            </select>
          </div>
           <div className="Alltable my-3">
            <GlobalCommanTable
              showHeader={true}
              showPagination={true}
              callBackData={callBackData}
              columns={columns}
              data={data}
              hideOpenNewTableIcon={true}
              hideTeamIcon={true}
            />
          </div> 
        </div>
        <footer className="text-end">
          <button className="btn btn-primary">OK</button>
        </footer>
      </Panel>

      <Panel
        onRenderHeader={onRenderCustomCalculateSC1}
        type={PanelType.medium}
        isOpen={addUser}
        isBlocking={false}
        onDismiss={() => {
          setAddUser(false),
            setSuggestions([]),
            setInputValue({ ...inputValue, Title: "" });
        }}
      >
        <div className="modal-body">
          <div className="input-group">
            <label className="form-label full-width">User*</label>
            <div className="full-width">
            <PeoplePicker
                    titleText="Select People"
                    personSelectionLimit={3}
                    principalTypes={[PrincipalType.User]}
                    resolveDelay={800}
                    onChange={handlePeoplePickerChange}
                    defaultSelectedUsers={selectedPeople}
                    context={props?.context?.context != undefined?props?.context?.context:props?.context?.Context}
                    
                  />
                  </div>
          </div>
         
        </div>
        <footer className="d-block full-width text-end mt-2" style={{paddingRight:"0px !important"}}>
          <button className="me-2 btn btn-primary" onClick={postUser}>
            Save
          </button>
          <button
            className="btn btn-default"
            onClick={() => {
              setAddUser(false),
                setSuggestions([]),
                setInputValue({ ...inputValue, Title: "" });
            }}
          >
            Cancel
          </button>
        </footer>
      </Panel>

      <Panel
        onRenderHeader={onRenderCustomCalculateSC3}
        type={PanelType.medium}
        isOpen={checkPermission}
        isBlocking={false}
        onDismiss={() => {
          setCheckPermission(false),
            setSuggestions([]),
            setPermissionUserGroup([]),
            setInputValue({ ...inputValue, Title: "" });
        }}
      >
        <div className="modal-body">
          <div className="row">
            <div className="col-md-8">
           
              <div className="input-group class-input">
                <div className="w-100 peoplePickerData">
                <PeoplePicker
                    titleText="Select People"
                    personSelectionLimit={3}
                    principalTypes={[PrincipalType.User]}
                    resolveDelay={800}
                    onChange={handlePeoplePickerChange}
                    defaultSelectedUsers={selectedPeople}
                    context={props?.context?.context != undefined?props?.context?.context:props?.context?.Context}
                  />
                </div>
              </div>
             
               
                  {suggestions?.map((suggestion: any, index: any) => (
                    <li className="hreflink list-group-item rounded-0 p-1 list-group-item-action" key={index} onClick={() => handleSuggestionClick(suggestion)}>
                      {suggestion?.Title}
                    </li>
                  ))}
                
            </div>
            <div className="col-md-4">
        
                <label className="full-width form-label"></label>
                <button
                  className="btnCol btn btn-primary mt-2"
                  onClick={() => checkUser()}
                >
                  Check Permission
                </button>
             
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

        <footer className="mt-4 d-flex justify-content-end">
          <button
            className="btn btn-primary"
            onClick={() => {
              setCheckPermission(false),
                setSuggestions([]),
                setPermissionUserGroup([]),
                setInputValue({ ...inputValue, Title: "" });
            }}
          >
            OK
          </button>
        </footer>
      </Panel>
    </>
  );
};

export default Permission_management;
