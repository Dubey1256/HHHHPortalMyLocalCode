import * as React from "react";
import { useEffect, useState } from "react";
import "./Style.css";
import { Web } from "sp-pnp-js";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import {
  useTable,
  useSortBy,
  useFilters,
  useExpanded,
  usePagination,
} from "react-table";
import { Table } from "reactstrap";
import { DefaultColumnFilter, Filter } from "./filters";
import { TextField, Checkbox,  Dropdown, IDropdownOption } from 'office-ui-fabric-react';
import { Panel } from "office-ui-fabric-react";
let userSearch: any = [];
let dynamicValue:any;
const ContactMainPage = () => {
  let siteType = location.href.split("/")[5].toLowerCase();
  const [count, setCount] = useState(0);
  const [EmployeeData, setEmployeeData] = useState([]);
  const [institutionData, setInstitutionsData] = useState([]);
  const [inputField, setInputField] = useState({
    FullName: "",
    EmailAddress: "",
    StaffID: "",
    Organization: "",
    Department: "",
    Position: "",
    WorkCity: "",
    SearchInstitution: "",
    City: "",
    Country: "",
  });
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [bshow, setBShow] = useState(true);
  const [searchData, setSearchData] = useState([]);
  const [allContact, setAllContact] = useState([]);
  const [isvisible, setisvisible] = useState(false);
  // const [isUserExist, setuserExits] = useState(true);
  const [contactNumber, setContactNumber] = useState();
  const [contactStaffId, setContactStaffId] = useState("");
  //const [fullName, setFullName] = useState("");

  const [EditContactStatus, setEditContactStatus] = useState(false);
  const [EditContactData, setEditContactData] = useState([]);
  const [userEmails, setUserEmails] = useState([]);
  const [tableStatus, setTableStatus] = useState(true);
  const [data, setSearchedData] = useState([]);
  const [searchedInstitueData, setSearchedInstitueData] = useState([]);
  //const [AddToLocalDBStatus, setAddToLocalDBStatus] = useState(false);
  //const [CreateContactStatus, setCreateContactStatus] = useState(false);
  const [CreateInstituteStatus, setCreateInstituteStatus] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [btnVisibilty, setBtnVisibility] = useState(true);
  const [searchUser1, setSearchUser1] = useState([]);





  const divisionOptions: IDropdownOption[] = [
    { key: 'select', text: 'Select Division' },
    { key: 'division1', text: 'Division 1' },
  ];
  
  // Initialize state variables for input values
  const [general, setGeneral]:any = useState({firstName:'',
  lastName:'',suffix:'',jobTitle:'',organisation:''});
  // const [lastName, setLastName] = useState('');
  // const [suffix, setSuffix] = useState('');
  // const [jobTitle, setJobTitle] = useState('');
  const [hrChecked, setHrChecked] = useState(false);
  const [gmbhChecked, setGmbhChecked] = useState(false);
  // const [organisation, setOrganisation] = useState('');
  // const [divisionKey, setDivisionKey]:any = useState('select');

  

  const onAllChange = (event:any) => {
   const name=event.target.name;
   const value=event.target.value;
    setGeneral({...general,[name]:value});
 console.log(general);
 setHrChecked(true);
 setGmbhChecked(true);
  };
 

  console.log(searchUser1, "userData1");
  let tempp: any = [];
  const removeDuplicates = async (temp: any) => {
    for (let i = 0; i < temp.length; i++) {
      if (tempp.indexOf(temp[i]) === -1) {
        tempp.push(temp[i]);
      }
    }
    setSearchUser1(tempp);
  };

  const userPanel = () => {
    const web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SH");
    web.lists
      .getById("3b06b2ae-040e-406c-9d5a-a5f9ed14c729")
      .items//.select("Id,Title,staffID0,ItemType")
      .orderBy("Created", false)
      .get()
      .then((Data: any[]) => {
        Data.map((item) => {
          let user = {
            Name: item.Title,
            Email: item.Email,
            Id: item.ID,
          };
          userSearch.push(user);
        });
        //  setSearchUser1(userSearch);
        void removeDuplicates(userSearch);
        // console.log(Data,"userData");
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const EmployeeDetails = async () => {
    // let select;
    // let expand;
    let hrId;
    let weburl;
    if (siteType != undefined && siteType != null) {
      if (siteType == "sh") {
        // select =
        //   "WorkCity,shortName,StaffID,ItemType,Categories,Id,WorkCountry,WorkAddress,SmartContactId,SmartInstitutionId,Email,FullName,Attachments,Item_x0020_Cover,Company,JobTitle,FirstName,Title,WebPage,WorkPhone,CellPhone,HomePhone,WorkZip,Comments,WorkFax,Created,Modified,Suffix,Institution/FullName,Institution/Id,Author/Name,Author/Title,Editor/Name,Editor/Title";
        // expand = "Author,Editor,Institution";
        hrId = "D4002776-F56A-490A-A34E-A8FD026B78E4";
        weburl = "https://hhhhteams.sharepoint.com/sites/HHHH/SH";
      }
    }
    let web = new Web(weburl);
    await web.lists
      .getById(hrId)
      .items //.select(select)
      //.expand(expand)
      .orderBy("Created", true)
      .get()
      .then((Data: any[]) => {
        setAllContact(Data);
        console.log("data ====", Data);
        let contactData: any = [];
        let InstitutionData: any = [];
        Data.map((item: any, index) => {
          if (item.ItemType != "" && item.ItemType != undefined) {
            if (item.ItemType == "Contact") {
              contactData.push(item);
            } else if (item.ItemType == "Institution") {
              InstitutionData.push(item);
            }
          }
        });
        setEmployeeData(contactData);
        void userPanel();
        setSearchedData(contactData);
        setInstitutionsData(InstitutionData);
        setSearchedInstitueData(InstitutionData);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  console.log(
    data,
    EmployeeData,
    institutionData,
    searchedInstitueData,
    EditContactStatus,
    EditContactData,
   
    CreateInstituteStatus
  );
  const contactNavButtonFunction = () => {
    setTableStatus(true);
    setBtnVisibility(true);
  };
  const instituteNavButtonFunction = () => {
    setTableStatus(false);
    setBtnVisibility(false);
  };

  const BasicInfoButton = () => {
    setBShow(true);
     };
     const imageButton = () => {
      setBShow(false);
       };



  const SearchData = (e: any, item: any) => {
    let Key: any = e.target.value.toLowerCase();
    if (item == "Main-Search") {
      // setInputField({ ...inputField, FullName: Key });
      const filterAll: any = EmployeeData.filter((items: any) => {
        return (
          items.FullName?.toLowerCase().includes(Key) ||
          items.Email?.toLowerCase().includes(Key) ||
          items.StaffID?.toLowerCase().includes(Key) ||
          items.JobTitle?.toLowerCase().includes(Key) ||
          items.WorkCity?.toLowerCase().includes(Key)
        );
      });
      setSearchedData(filterAll);
      if (Key.length == 0) {
        setSearchedData(EmployeeData);
      }
    }
    if (item == "Main-SearchInstitution") {
      // setInputField({ ...inputField, FullName: Key });
      const filterAll: any = institutionData.filter((items: any) =>
        items.FullName?.toLowerCase().includes(Key)
      );
      setSearchedInstitueData(filterAll);
      if (Key.length == 0) {
        setSearchedInstitueData(institutionData);
      }
    }

    institutionData;
    if (item == "FullName") {
      setInputField({ ...inputField, FullName: Key });
      const data: any = {
        nodes: EmployeeData.filter((items: any) =>
          items.FullName?.toLowerCase().includes(Key)
        ),
      };
      setSearchedData(data.nodes);
      if (Key.length == 0) {
        setSearchedData(EmployeeData);
      }
    }
    if (item == "Email-Address") {
      setInputField({ ...inputField, EmailAddress: Key });
      const data: any = {
        nodes: EmployeeData.filter((items: any) =>
          items.Email?.toLowerCase().includes(Key)
        ),
      };
      setSearchedData(data.nodes);
      if (Key.length == 0) {
        setSearchedData(EmployeeData);
      }
    }
    if (item == "Organization") {
      setInputField({ ...inputField, Organization: Key });
      let temp: any[] = [];
      EmployeeData.map((items: any) => {
        if (items.Institution) {
          if (items.Institution.FullName !== undefined) {
            temp.push(items);
          }
        }
      });
      const data: any = {
        nodes: temp.filter((items) => items.Email?.toLowerCase().includes(Key)),
      };
      setSearchedData(data.nodes);
      if (Key.length == 0) {
        setSearchedData(EmployeeData);
      }
    }
    if (item == "StaffID") {
      setInputField({ ...inputField, StaffID: Key });
      const data: any = {
        nodes: EmployeeData.filter((items: any) =>
          items.StaffID?.toLowerCase().includes(Key)
        ),
      };
      setSearchedData(data.nodes);
      if (Key.length == 0) {
        setSearchedData(EmployeeData);
      }
    }
    if (item == "Position") {
      setInputField({ ...inputField, Position: Key });
      const data: any = {
        nodes: EmployeeData.filter((items: any) =>
          items.JobTitle?.toLowerCase().includes(Key)
        ),
      };
      setSearchedData(data.nodes);
      if (Key.length == 0) {
        setSearchedData(EmployeeData);
      }
    }
    if (item == "WorkCity") {
      setInputField({ ...inputField, WorkCity: Key });
      const data: any = {
        nodes: EmployeeData.filter((items: any) =>
          items.WorkCity?.toLowerCase().includes(Key)
        ),
      };
      setSearchedData(data.nodes);
      if (Key.length == 0) {
        setSearchedData(EmployeeData);
      }
    }
    if (item == "Search-Institution") {
      setInputField({ ...inputField, SearchInstitution: Key });
      const data: any = {
        nodes: institutionData.filter((items: any) =>
          items.FullName?.toLowerCase().includes(Key)
        ),
      };
      setSearchedInstitueData(data.nodes);
      if (Key.length == 0) {
        setSearchedInstitueData(institutionData);
      }
    }
    if (item == "City") {
      setInputField({ ...inputField, City: Key });
      const data: any = {
        nodes: institutionData.filter((items: any) =>
          items.WorkCity?.toLowerCase().includes(Key)
        ),
      };
      setSearchedInstitueData(data.nodes);
      if (Key.length == 0) {
        setSearchedInstitueData(institutionData);
      }
    }
    if (item == "Country") {
      setInputField({ ...inputField, Country: Key });
      const data: any = {
        nodes: institutionData.filter((items: any) =>
          items.WorkCountry?.toLowerCase().includes(Key)
        ),
      };
      setSearchedInstitueData(data.nodes);
      if (Key.length == 0) {
        setSearchedInstitueData(institutionData);
      }
    }
  };

  const allChecked = (e: any) => {
    let key = e.currentTarget.checked;
    if (key == true) {
      console.log(EmployeeData);
      data.map((item, index) => {
        item.isselect = key;
      });
      console.log(EmployeeData);
      setIsDisabled(false);
      setUserEmails(EmployeeData);
    }
    if (key == false) {
      data.map((item, index) => {
        item.isselect = key;
      });
      setIsDisabled(true);
      setUserEmails([]);
    }
  };
  const checkedData = (e: any, item: any) => {
    let key = e.currentTarget.checked;

    let selectarray: any = [];
    if (key == true) {
      setCount(count + 1);
      data.map((items) => {
        if (items.Id === item.Id) {
          selectarray.push(items);
          item.isselect = key;
          console.log(item);
        }
        if (items.Id != item.Id) {
          selectarray.push(items);
        }
      });

      setSearchedData(selectarray);
      setIsDisabled(false);
    }
    if (key == false) {
      setCount(count - 1);
      data.map((items, index) => {
        if (items.Id === item.Id) {
          item.isselect = key;
          selectarray.push(items);
          console.log(item);
        }
        if (items.Id != item.Id) {
          selectarray.push(items);
        }
        if (count == 1) {
          setIsDisabled(true);
        }
      });

      setSearchedData(selectarray);
      console.log(item);
    }

    userEmails.push(item);

    console.log("user email ===", userEmails);
  };
  const sendEmail = () => {
    let emails = "";
    let ContactsNothavingEmail: any = [];
    userEmails.map((item: any) => {
      console.log("sent mail ===", userEmails);
      if (item.isselect == true) {
        if (item.Email == null) {
          ContactsNothavingEmail.push(item);
          console.log("null emails");
        }
        if (item.Email != null) {
          emails += item.Email + ";";
          console.log("emails");
        }
      }
    });
    window.location.href = "mailto:" + emails;
  };
  const EditContactPopup = (items: any) => {
    setEditContactStatus(true);
    setEditContactData(items);
  };

  const columns = React.useMemo(
    () => [
      {
        internalHeader: "All",
        id: "Id", // 'id' is required
        isSorted: false,
        style: { width: "60px" },
        showSortIcon: true,
        Cell: ({ row }: any) => (
          <span className="d-flex">
            <input
              type="checkbox"
              checked={row?.original.isselect}
              onChange={(e) => checkedData(e, row?.original)}
            />
          </span>
        ),
      },
      {
        internalHeader: "Name",
        accessor: "FullName",
        isSorted: false,
        showSortIcon: true,
        style: { width: "80px" },
        Cell: ({ row }: any) => (
          <span>
            <img
              className="circularImage rounded-circle"
              src={
                row?.original?.Item_x0020_Cover != undefined
                  ? row.original.Item_x0020_Cover.Url
                  : "https://hhhhteams.sharepoint.com/sites/HHHH/GmBH/SiteCollectionImages/ICONS/32/icon_user.jpg"
              }
            />
            <span>{row?.original?.FullName}</span>
          </span>
        ),
      },

      {
        internalHeader: "Email Address",
        accessor: "Email",
        // style: { width: "70px" },

        showSortIcon: true,
        // Cell: ({ row }: any) => (
        //   <span>
        //     {row?.original?.Shareweb_x0020_ID}
        //   </span>
        // ),
      },
      {
        internalHeader: "Organization",
        accessor: "Organization",
        showSortIcon: true,
        Cell: ({ row }: any) => (
          <span>
            {row?.original?.Organization == undefined
              ? "NA"
              : row?.original?.Organization}
          </span>
        ),
      },

      {
        internalHeader: "Department",
        accessor: "Department",
        isSorted: false,
        showSortIcon: false,
        // style: { width: "40px" },
        Cell: ({ row }: any) => (
          <span>
            {row?.original?.Department == undefined
              ? "NA"
              : row?.original?.Department}
          </span>
        ),
      },

      {
        internalHeader: "Position",
        accessor: "JobTitle",
        isSorted: false,
        showSortIcon: false,
        // style: { width: "40px" },
        Cell: ({ row }: any) => (
          <span>
            {row?.original?.JobTitle == undefined
              ? "NA"
              : row?.original?.JobTitle}
          </span>
        ),
      },
      {
        internalHeader: "Site",
        accessor: "Site",
        isSorted: false,
        showSortIcon: false,
      },
      {
        internalHeader: "",
        accessor: "id",
        // id: "siteIcon", // 'id' is required
        isSorted: false,
        showSortIcon: false,
        style: { width: "40px" },
        Cell: ({ row }: any) => (
          <span>
            <button
              className="edit-btn"
              onClick={() => EditContactPopup(row?.original)}
            >
              <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif" />{" "}
            </button>
          </span>
        ),
      },
      //   {
      //     internalHeader: "Portfolio",
      //     accessor: "PortfolioTitle",
      //     showSortIcon: true,
      //     Cell: ({ row }: any) => (
      //       <span>
      //         <a className='hreflink'
      //           data-interception="off"
      //           target="blank"
      //           href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=${row?.original?.portfolio?.Id}`}
      //         >
      //           {row?.original?.portfolio?.Title}
      //         </a>
      //       </span>
      //     ),
      //   },
      //   {
      //     internalHeader: "Priority",
      //     isSorted: true,
      //     isSortedDesc: true,
      //     accessor: "Priority_x0020_Rank",
      //     style: { width: "100px" },
      //     showSortIcon: true,
      //     Cell: ({ row }: any) => (
      //       <span>
      //         <InlineEditingcolumns
      //           type="Task"
      //           callBack={tagAndCreateCallBack}
      //           columnName="Priority"
      //           item={row?.original}
      //           TaskUsers={AllUser}
      //         />
      //       </span>
      //     ),
      //   },

      //   {
      //     internalHeader: "Due Date",
      //     showSortIcon: true,
      //     style: { width: "80px" },
      //     accessor: "DueDate",
      //     Cell: ({ row }: any) => (
      //        <InlineEditingcolumns
      //           callBack={tagAndCreateCallBack}
      //           columnName="DisplayDueDate"
      //           item={row?.original}
      //           TaskUsers={AllUser}
      //         />
      //     ),
      //   },

      //   {
      //     internalHeader: "% Complete",
      //     accessor: "PercentComplete",
      //     style: { width: "70px" },
      //     showSortIcon: true,
      //     Cell: ({ row }: any) => (
      //       <span>
      //         <InlineEditingcolumns
      //           callBack={tagAndCreateCallBack}
      //           columnName="PercentComplete"
      //           item={row?.original}
      //           TaskUsers={AllUser}
      //         />
      //       </span>
      //     ),
      //   },
      //   {
      //     internalHeader: "Team Members",
      //     accessor: "TeamMembersSearch",
      //     showSortIcon: true,
      //     style: { width: "150px" },
      //     Cell: ({ row }: any) => (
      //       <span>
      //         <InlineEditingcolumns
      //           callBack={tagAndCreateCallBack}
      //           columnName="Team"
      //           item={row?.original}
      //           TaskUsers={AllUser}
      //         />
      //       </span>
      //     ),
      //   },

      //   {
      //     internalHeader: "Created",
      //     accessor: "DisplayCreateDate",
      //     showSortIcon: true,
      //     style: { width: "125px" },
      //     Cell: ({ row }: any) => (
      //       <span>
      //         <span className="ms-1">{row?.original?.DisplayCreateDate}</span>
      //         <img className="imgAuthor" src={row?.original?.createdImg}/>
      //       </span>
      //     ),
      //   },

      //   {
      //     internalHeader: "",
      //     id: "Id", // 'id' is required
      //     isSorted: false,
      //     style: { width: "60px" },
      //     showSortIcon: false,
      //     Cell: ({ row }: any) => (
      //       <span className="d-flex">
      //         <span
      //           title="Edit Task"
      //           onClick={() => EditPopup(row?.original)}
      //           className="svg__iconbox svg__icon--edit"
      //         ></span>
      //         <span
      //           style={{ marginLeft: "6px" }}
      //           title="Remove Task"
      //           onClick={() => untagTask(row?.original)}
      //           className="svg__iconbox svg__icon--cross"
      //         ></span>
      //       </span>
      //     ),
      //   },
    ],
    [data]
  );
  const generateSortingIndicator = (column: any) => {
    return column.isSorted ? (
      column.isSortedDesc ? (
        <FaSortDown />
      ) : (
        <FaSortUp />
      )
    ) : column.showSortIcon ? (
      <FaSort />
    ) : (
      ""
    );
  };
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
  }: any = useTable(
    {
      columns,
      data,
      defaultColumn: { Filter: DefaultColumnFilter },
      initialState: { pageIndex: 0, pageSize: 100000 },
    },
    useFilters,
    useSortBy,
    useExpanded,
    usePagination
  );

  const clearFilter = () => {
    setSearchedData(EmployeeData);
    setSearchedInstitueData(institutionData);
    setInputField({
      FullName: "",
      StaffID: "",
      EmailAddress: "",
      Organization: "",
      Department: "",
      Position: "",
      WorkCity: "",
      SearchInstitution: "",
      City: "",
      Country: "",
    });
  };
  const printFunction = () => {
    window.print();
  };

  const searchFun = (e: any) => {
    setisvisible(true);
    let key = e.target.value;

    // setFullName(key);
    const filterdata = allContact.filter((items: any) =>
      items.FullName?.toLowerCase().includes(key)
    );
    setSearchData(filterdata);

    if (key.length == 0) {
      setSearchData(allContact);
      setisvisible(false);
    }
    if (filterdata.length == 0) {
      console.log("data not found");
      //  setuserExits(false);
    }
  };

  const postHrDetailsList = async (selecteditems: any) => {
    const web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH");
    await web.lists
      .getById("D4002776-F56A-490A-A34E-A8FD026B78E4")
      .items.add({
        SmartContactId: selecteditems.Id,
      })
      .then((res: any) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const handleClose = () => {
    setShow(false);
    setShow2(false);
    // props.callBack();
  };

  const postLocalData = async (selecteditems: any) => {
    const web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/HR");
    await web.lists
      .getById("D4002776-F56A-490A-A34E-A8FD026B78E4")
      .items.add({
        FirstName: selecteditems.FirstName,
        FullName: selecteditems.FullName,
        CellPhone: selecteditems.CellPhone,
        Company: selecteditems.Company,
        Email: selecteditems.Email,
        JobTitle: selecteditems.JobTitle,
        WorkCity: selecteditems.WorkCity,
        WorkCountry: selecteditems.WorkCountry,
        Suffix: selecteditems.Suffix,
        WorkPhone: selecteditems.WorkPhone,
        HomePhone: selecteditems.HomePhone,
        WorkZip: selecteditems.WorkZip,
        Office: selecteditems.Office,
        Comments: selecteditems.Comments,
        WorkAddress: selecteditems.WorkAddress,
        WorkFax: selecteditems.WorkFax,
        staffID0: contactNumber,
        StaffID: contactStaffId,
        // InstitutionId: $scope.SelectedItem.Institution.Id,
        IM: selecteditems.IM,
        WebPage: selecteditems.WebPage,
        SmartCountriesId: {
          results:
            selecteditems.smartCountryId != undefined
              ? selecteditems.smartCountryId
              : [],
        },
        Title: selecteditems.Title,
        SmartContactId: selecteditems.Id,
        ItemType: selecteditems.ItemType,
        EmployeeIDId:
          selecteditems.EmployeeIDId != undefined
            ? selecteditems.EmployeeIDId
            : null,
        Item_x0020_Cover: selecteditems.Item_x0020_Cover,
        SocialMediaUrls: selecteditems.SocialMediaUrls,
      })
      .then(async (res: any) => {
        console.log(res);
        await handleClose();
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  //   const newUserCreate = async () => {
  //     let ItemType = "";
  //     if (props.tableStatus == true) {
  //       ItemType = "Contact";
  //     } else if (props.tableStatus == false) {
  //       ItemType = "Institution";
  //     }
  //     console.log(isUserExist);
  //     if (isUserExist == false) {
  //       const web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH");
  //       await web.lists
  //         .getById("edc879b9-50d2-4144-8950-5110cacc267a")
  //         .items.add({
  //           Title: fullName.split(" ")[1],
  //           FirstName: fullName.split(" ")[0],
  //           FullName: fullName,
  //           ItemType: ItemType,
  //           Site: {
  //             results: ["HR"],
  //           },
  //         })
  //         .then(async (res: any) => {
  //           console.log(res);
  //           setisvisible(false);
  //           await postHrDetailsList(res.data);
  //           await postLocalData(res.data);
  //         })
  //         .catch((err) => {
  //           console.log(err.message);
  //         });
  //     }
  //   };

  const createContactStaffId = async () => {
    let contactNumber: any;
    let contactId: any;
    const web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/HR");
    await web.lists
      .getById("A7B80424-E5E1-47C6-80A1-0EE44A70F92C")
      .items.select("Id,Title,staffID0,ItemType")
      .filter("ItemType eq'Contact'")
      .orderBy("staffID0", false)
      .top(1)
      .get()
      .then((Data: any[]) => {
        let contactNumberlength: any;

        console.log("contract list data ", Data);
        if (Data != undefined && Data.length > 0) {
          contactNumber = Data[0].staffID0 + 1;
          let Contactlength = contactNumber.toString();
          contactNumberlength = Contactlength.length;
          console.log("length of contract number ", contactNumberlength);
          setContactNumber(contactNumber);
        }
        if (Data == undefined || Data.length == 0) {
          contactNumber = 1;
          let Contactlength = contactNumber.toString();
          contactNumberlength = Contactlength.length;
          setContactNumber(contactNumber);
        }
        if (contactNumberlength == 0 && contactNumberlength == "") {
          contactId = "HHHH" + "-" + "0000" + contactNumber;
          setContactStaffId(contactId);
        } else if (
          contactNumberlength == 1 &&
          contactNumberlength > 0 &&
          contactNumberlength != "" &&
          contactNumberlength != undefined
        ) {
          contactId = "HHHH" + "-" + "0000" + contactNumber;
          setContactStaffId(contactId);
        } else if (
          contactNumberlength == 2 &&
          contactNumberlength > 0 &&
          contactNumberlength != "" &&
          contactNumberlength != undefined
        ) {
          contactId = "HHHH" + "-" + "000" + contactNumber;
          setContactStaffId(contactId);
        } else if (
          contactNumberlength == 3 &&
          contactNumberlength > 0 &&
          contactNumberlength != "" &&
          contactNumberlength != undefined
        ) {
          contactId = "HHHH" + "-" + "00" + contactNumber;
          setContactStaffId(contactId);
        } else if (
          contactNumberlength == 4 &&
          contactNumberlength > 0 &&
          contactNumberlength != "" &&
          contactNumberlength != undefined
        ) {
          contactId = "HHHH" + "-" + "0" + contactNumber;
          setContactStaffId(contactId);
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const updateSite = async (
    selecteditems: any,
    siteconfirmation: any,
    siteArray: any
  ) => {
    if (siteconfirmation == true) {
      const web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH");
      await web.lists
        .getById("edc879b9-50d2-4144-8950-5110cacc267a")
        .items.getById(selecteditems.Id)
        .update({
          Site: {
            results: siteArray,
          },
        })
        .then(async (res: any) => {
          console.log(res);
          setisvisible(false);
          alert(" HR Site Tagged");

          //Hr Details list post smartcontact

          // const web = new Web(
          //   'https://hhhhteams.sharepoint.com/sites/HHHH'
          //  );
          //  await web.lists.getById('6DD8038B-40D2-4412-B28D-1C86528C7842').items.add(
          //         {
          //           SmartContactId:selecteditems.Id
          //         }
          //   )
          //  .then(async(res:any)=>{
          //   console.log(res);
          await postHrDetailsList(selecteditems);
          await postLocalData(selecteditems);
          //add data in employeeDetails on Hr site

          //   console.log(contactNumber)

          //   console.log(contactStaffId)
          // const web = new Web(
          //     'https://hhhhteams.sharepoint.com/sites/HHHH/HR'
          //    );
          //    await web.lists.getById('a7b80424-e5e1-47c6-80a1-0ee44a70f92c').items.add(
          //           {

          //             FirstName: selecteditems.FirstName,
          //             FullName: selecteditems.FullName,
          //             CellPhone: selecteditems.CellPhone,
          //             Company: selecteditems.Company,
          //             Email: selecteditems.Email,
          //             JobTitle: selecteditems.JobTitle,
          //             WorkCity: selecteditems.WorkCity,
          //             WorkCountry: selecteditems.WorkCountry,
          //             Suffix: selecteditems.Suffix,
          //             WorkPhone: selecteditems.WorkPhone,
          //              HomePhone: selecteditems.HomePhone,
          //             WorkZip: selecteditems.WorkZip,
          //             Office: selecteditems.Office,
          //             Comments: selecteditems.Comments,
          //             WorkAddress: selecteditems.WorkAddress,
          //             WorkFax: selecteditems.WorkFax,
          //             staffID0:contactNumber,
          //             StaffID:contactStaffId,
          //             // InstitutionId: $scope.SelectedItem.Institution.Id,
          //             IM: selecteditems.IM,
          //             WebPage: selecteditems.WebPage,
          //             SmartCountriesId: { "results":selecteditems.smartCountryId!=undefined?selecteditems.smartCountryId:[]},
          //             Title:selecteditems.Title,
          //             SmartContactId: selecteditems.Id,
          //             ItemType: selecteditems.ItemType,
          //             EmployeeIDId: selecteditems.EmployeeIDId != undefined ? selecteditems.EmployeeIDId : null,
          //             Item_x0020_Cover: selecteditems.Item_x0020_Cover,
          //             SocialMediaUrls: selecteditems.SocialMediaUrls,
          //           }
          //     )
          //    .then(async(res:any)=>{
          //     console.log(res);

          //    })
          //    .catch((err) => {
          //     console.log(err.message);
          //  });

          //    })
          //    .catch((err) => {
          //     console.log(err.message);
          //  });
          await handleClose();
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  };
  
  const checkProfile = async (selecteditems: any) => {
    let siteArray: any = [];
    let siteconfirmation = false;
    
    if (selecteditems.Site != undefined) {
      dynamicValue=selecteditems.FullName;
        let itemsite = selecteditems.Site.toLowerCase();
        if (itemsite == "hr") {
          //open edit popup....
          setShow2(true);
        } else if (itemsite == "gmbh") {
          if (itemsite == "gmbh") { 
            siteArray.push("HR", "GMBH");
          }
          confirm("are you want to tag   HR site ")
            ? (siteconfirmation = true)
            : (siteconfirmation = false);
          await updateSite(selecteditems, siteconfirmation, siteArray);
        }
   
    } else if (selecteditems.Site == undefined) {
      siteArray.push("HR");
      confirm("are you want to tag   HR site ")
        ? (siteconfirmation = true)
        : (siteconfirmation = false);

      await updateSite(selecteditems, siteconfirmation, siteArray);
    }
  };

  useEffect(() => {
    void EmployeeDetails();
    void createContactStaffId();
    void userPanel();
  }, []);

  return (
    <div className="contact-section">
      <div className="cotact-container">
        <div className="contact-heading my-3">
          <h2>Contact Database SH</h2>
          <button className="btn btn-light btn-sm mx-1">
            <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif" />
          </button>
        </div>
        <div className="contact-navigation">
          <button
            className={
              btnVisibilty ? "contact-nav-button-active" : "contact-nav-button"
            }
            onClick={contactNavButtonFunction}
          >
            Contacts
          </button>
          <button
            className={
              btnVisibilty
                ? "institute-nav-button"
                : "institute-nav-button-active"
            }
            onClick={instituteNavButtonFunction}
          >
            Institution
          </button>
        </div>
        <div className="component-section my-2">
          {tableStatus ? (
            <div>
              <div className="card-header d-flex justify-content-between">
                <div>
                  <span className="mx-2">
                    Showing <b>{data.length}</b> of{" "}
                    <b>{EmployeeData.length} </b>Contacts
                  </span>
                  <input
                    type="text"
                    onChange={(e) => SearchData(e, "Main-Search")}
                    className="main-search"
                  />
                  <button className="search-button">search</button>
                </div>
                <div className="table-buttons">
                  <button onClick={sendEmail} disabled={isDisabled == true}>
                    Bulk Email
                  </button>
                  &nbsp;&nbsp;
                  <button
                    className="function-btns"
                    onClick={() => setShow(true)}
                  >
                    Create Contact
                  </button>
                  &nbsp;&nbsp;
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      onClick={clearFilter}
                      viewBox="0 0 20 20"
                    >
                      <path d="M2.763 13.563c-1.515 1.488-.235 3.016-2.247 5.279-.908 1.023 3.738.711 6.039-1.551.977-.961.701-2.359-.346-3.389-1.047-1.028-2.47-1.3-3.446-.339zM19.539.659C18.763-.105 10.16 6.788 7.6 9.305c-1.271 1.25-1.695 1.92-2.084 2.42-.17.219.055.285.154.336.504.258.856.496 1.311.943.456.447.699.793.959 1.289.053.098.121.318.342.152.51-.383 1.191-.801 2.462-2.049C13.305 9.88 20.317 1.422 19.539.659z" />
                    </svg>
                  </span>
                  <span>
                    {" "}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="40"
                      height="40"
                      viewBox="0 0 48 48"
                      fill="none"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M25.6583 11.7601C24.7731 11.9281 23.2774 12.2105 22.3888 12.3774C22.0013 12.4502 21.3601 12.5711 20.9639 12.646C20.5676 12.721 19.8872 12.8494 19.4518 12.9314C19.0164 13.0134 18.279 13.1524 17.8131 13.2403C16.4966 13.4887 15.9152 13.5982 14.4565 13.873C13.712 14.0133 12.784 14.1883 12.3943 14.2619C12.0046 14.3355 11.3634 14.4565 10.9693 14.5306C10.5753 14.6048 10.2369 14.669 10.2173 14.6734L10.1816 14.6814L10.1856 25.1976L10.1896 35.7138L10.4191 35.7567C10.5454 35.7803 10.9551 35.8575 11.3295 35.9282C12.9599 36.2361 13.9786 36.4282 14.4803 36.5223C14.7764 36.5779 15.4568 36.7061 15.9923 36.8073C16.5279 36.9084 17.3401 37.0616 17.7973 37.1477C18.2545 37.2338 18.8779 37.3513 19.1827 37.4088C19.4874 37.4664 20.1679 37.5947 20.6947 37.694C21.2215 37.7933 22.3366 38.0034 23.1725 38.161C24.0085 38.3186 25.0523 38.5152 25.4921 38.598C25.9318 38.6808 26.3077 38.7525 26.3273 38.7573L26.3629 38.7661V37.4029V36.0398L31.9717 36.0356L37.5805 36.0315L37.7072 35.9956C38.1189 35.879 38.4116 35.6339 38.5845 35.2611C38.6182 35.1884 38.659 35.0791 38.6752 35.0182C38.7037 34.9107 38.7046 34.614 38.7046 25.2018V15.4962L38.6692 15.3616C38.5381 14.8642 38.1727 14.5107 37.6589 14.3842C37.5562 14.359 37.1715 14.3568 31.9559 14.3525L26.3629 14.3478V12.9953C26.3629 12.2514 26.3575 11.6401 26.351 11.6369C26.3445 11.6336 26.0328 11.6891 25.6583 11.7601ZM37.5726 25.1939V34.9311L31.9638 34.9271L26.355 34.9232V34.0603V33.1974L28.3143 33.1933L30.2736 33.1893V31.9545V30.7196L28.3143 30.7156L26.355 30.7116V30.292V29.8725L28.3222 29.8684L30.2894 29.8644V28.6375V27.4106L28.3222 27.4065L26.355 27.4025V26.9434V26.4842L28.3182 26.4805L30.2815 26.4767L30.2856 25.2495L30.2896 24.0223L28.3223 24.0183L26.355 24.0143V23.5314V23.0485L28.3222 23.0445L30.2894 23.0404V21.8135V20.5866L28.3222 20.5826L26.355 20.5785V20.1273V19.6761L28.3143 19.672L30.2736 19.668V18.4332V17.1983L28.3143 17.1943L26.355 17.1903L26.3508 16.3432C26.3486 15.8774 26.3501 15.4873 26.3543 15.4764C26.3603 15.4606 27.4975 15.4566 31.9672 15.4566H37.5726V25.1939ZM31.2869 18.4332V19.6682H33.5273H35.7676V18.4332V17.1982H33.5273H31.2869V18.4332ZM21.0401 20.7488C20.8837 21.047 20.6857 21.4228 20.6001 21.5839C20.5144 21.745 20.3251 22.1048 20.1794 22.3835C20.0337 22.6622 19.8041 23.1003 19.6692 23.3572C19.3926 23.8842 19.136 24.3741 18.9498 24.7308L18.8238 24.9723L19.0486 25.3958C19.1724 25.6287 19.3287 25.9225 19.3962 26.0488C19.4636 26.1751 19.5884 26.4102 19.6736 26.5713C19.7587 26.7324 19.8871 26.9746 19.9589 27.1096C20.0307 27.2446 20.1794 27.5243 20.2892 27.7311C20.399 27.9379 20.5771 28.2728 20.6849 28.4752C20.7927 28.6777 20.9859 29.0428 21.1141 29.2866C21.2424 29.5305 21.3578 29.7466 21.3706 29.767C21.3834 29.7873 21.3904 29.8074 21.3862 29.8116C21.3712 29.8266 19.1671 29.6695 19.1483 29.6521C19.1381 29.6427 19.0553 29.4675 18.9644 29.2629C18.6063 28.4576 18.1396 27.4133 17.9561 27.0067C17.7418 26.532 17.7076 26.4382 17.6544 26.1789C17.6343 26.0807 17.613 26.0059 17.6071 26.0127C17.6013 26.0195 17.5873 26.0678 17.5762 26.1201C17.5247 26.3608 17.4183 26.6362 17.1603 27.1967C17.012 27.5189 16.7661 28.0533 16.6138 28.3842C16.4616 28.7151 16.291 29.0856 16.2348 29.2075C16.1787 29.3294 16.1267 29.4353 16.1194 29.4427C16.1075 29.4549 14.2036 29.3315 14.1895 29.3177C14.1863 29.3146 14.2372 29.2137 14.3025 29.0935C14.3679 28.9733 14.5902 28.5579 14.7966 28.1704C15.1483 27.51 15.29 27.2447 15.5492 26.7613C15.8118 26.2714 15.9267 26.0562 16.1746 25.5897C16.3203 25.3154 16.4498 25.0731 16.4623 25.0513C16.484 25.0135 16.4613 24.9632 15.9438 23.9035C15.6462 23.2939 15.2832 22.5493 15.1373 22.2489C14.9913 21.9485 14.7606 21.4753 14.6245 21.1974C14.4885 20.9196 14.3795 20.6899 14.3823 20.6871C14.3864 20.683 15.971 20.5703 16.2927 20.5511L16.3635 20.5469L16.4553 20.7685C16.5057 20.8905 16.6154 21.1576 16.699 21.3623C16.7826 21.5669 16.9934 22.0799 17.1674 22.5022C17.4867 23.2771 17.5772 23.5231 17.6427 23.7942C17.6624 23.8759 17.6839 23.9428 17.6904 23.9429C17.6969 23.943 17.7023 23.933 17.7023 23.9208C17.7023 23.8843 17.8746 23.3285 17.931 23.1831C17.9755 23.0684 18.2022 22.5631 18.734 21.3939C18.7954 21.259 18.924 20.974 19.0198 20.7606C19.1157 20.5473 19.1995 20.3669 19.2061 20.3598C19.2174 20.3475 21.0188 20.2127 21.2273 20.2085L21.3245 20.2065L21.0401 20.7488ZM31.2869 21.8135V23.0406H33.5273H35.7676V21.8135V20.5865H33.5273H31.2869V21.8135ZM31.2908 25.2494L31.2948 26.4765L33.5312 26.4804L35.7676 26.4842V25.2532V24.0222H33.5272H31.2867L31.2908 25.2494ZM31.2869 28.6375V29.8645H33.5273H35.7676V28.6375V27.4104H33.5273H31.2869V28.6375ZM31.2869 31.9545V33.1895H33.5273H35.7676V31.9545V30.7195H33.5273H31.2869V31.9545Z"
                        fill="#333333"
                      />
                    </svg>
                  </span>
                  &nbsp;
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      onClick={printFunction}
                      data-name="Layer 1"
                      width="24"
                      height="24"
                      viewBox="0 0 40 40"
                    >
                      <path d="M33.62 14.41h-2.2v-10a1 1 0 0 0-1-1h-19.2a1 1 0 0 0-1 1v10H8a4.21 4.21 0 0 0-4.2 4.21v8A4.2 4.2 0 0 0 8 30.84h2v5.54a1 1 0 0 0 1 1h19.66a1 1 0 0 0 1-1v-5.54h2a4.21 4.21 0 0 0 4.2-4.2v-8a4.21 4.21 0 0 0-4.24-4.23Zm-21.4-9h17.2v9h-17.2Zm17.44 30H12v-11.6h17.66Zm6.16-8.74a2.21 2.21 0 0 1-2.2 2.2h-2v-6a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v6H8a2.21 2.21 0 0 1-2.2-2.2v-8A2.21 2.21 0 0 1 8 16.41h25.6a2.21 2.21 0 0 1 2.2 2.21Z" />
                      <path d="M25.35 26.32h-8.73a1 1 0 0 0 0 2h8.73a1 1 0 0 0 0-2zm0 4.5h-8.73a1 1 0 1 0 0 2h8.73a1 1 0 0 0 0-2zm4.86-12.62h-2.08a1 1 0 0 0 0 2h2.08a1 1 0 0 0 0-2z" />
                    </svg>
                  </span>
                </div>
              </div>
              <div>
                <div className="AllBox">
                  <input type="checkbox" onChange={(e) => allChecked(e)} /> All
                </div>

                {/* <table className="table">
                            <thead style={{ width: "100%" }}>
                                <tr>
                                    <th ><input style={{ width: "100%" }} type='checkbox' onChange={(e) => allChecked(e)} />All</th>
                                    <th ><input type='text' id='Department' className='search-input' style={{ width: "100px" }} placeholder='Staff ID' value={inputField.StaffID} onChange={(e) => SearchData(e, 'StaffID')} /></th>
                                    <th  ><input type='text' id='FullName' className='search-input' placeholder='Name' value={inputField.FullName} onChange={(e) => SearchData(e, 'FullName')} /></th>
                                   <th ><input type='text' id='Organization' className='search-input' placeholder='Organization' value={inputField.Organization} onChange={(e) => SearchData(e, 'Organization')} /></th>
                                   <th ><input type='text' id='Position' className='search-input' placeholder='Job Title' value={inputField.Position} onChange={(e) => SearchData(e, 'Position')} /></th>
                                    <th ><input type='text' id='Email-Address' className='search-input' placeholder='Email Address' value={inputField.EmailAddress} onChange={(e) => SearchData(e, 'Email-Address')} /></th>
                                    <th ><input type='text' id='Sites' placeholder='city' className='search-input' value={inputField.WorkCity} onChange={(e) => SearchData(e, 'WorkCity')} /></th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.map((items, index) => {
                                    return (
                                        <tr key={index}defaultChecked={items.isselect}>
                                            <th scope="row"><input type="checkbox"  checked={items.isselect} onChange={(e) => checkedData(e, items, index)} /></th>
                                            <td>{items.StaffID ? items.StaffID : "NA"}</td>
                                            <td className='full-name'><img className="userImg" src={items.Item_x0020_Cover != undefined ? items.Item_x0020_Cover.Url : "https://hhhhteams.sharepoint.com/sites/HHHH/GmBH/SiteCollectionImages/ICONS/32/icon_user.jpg"} /><a href={`https://hhhhteams.sharepoint.com/sites/HHHH/HR/SitePages/Employee-Info-SPFx.aspx?employeeId=${items.Id}`}target="_blank">{items.FullName ? items.FullName : "NA"}</a> </td>
                                          <td className="full-name">{items.Institution ? items.Institution.FullName : "NA"}</td>
                                           <td>{items.JobTitle ? items.JobTitle : "NA"}</td>
                                            <td>{items.Email ? items.Email : "NA"}</td>
                                            <td>{items.WorkCity ? items.WorkCity : "NA"}</td>
                                            <td><button className='edit-btn' onClick={() => EditContactPopup(items)}><img src='https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif'/> </button></td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table> */}

                <Table
                  className="SortingTable"
                  bordered
                  hover
                  {...getTableProps()}
                >
                  <thead>
                    {headerGroups.map((headerGroup: any) => (
                      <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column: any) => (
                          <th
                            {...column.getHeaderProps()}
                            style={column?.style}
                          >
                            <span
                              class="Table-SortingIcon"
                              style={{ marginTop: "-6px" }}
                              {...column.getSortByToggleProps()}
                            >
                              {column.render("Header")}
                              {generateSortingIndicator(column)}
                            </span>
                            <Filter column={column} />
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>

                  <tbody {...getTableBodyProps()}>
                    {page.map((row: any) => {
                      prepareRow(row);
                      return (
                        <tr
                          className={
                            row?.original?.Services?.length > 0
                              ? "serviepannelgreena"
                              : ""
                          }
                          {...row.getRowProps()}
                        >
                          {row.cells.map(
                            (cell: {
                              getCellProps: () => JSX.IntrinsicAttributes &
                                React.ClassAttributes<HTMLTableDataCellElement> &
                                React.TdHTMLAttributes<HTMLTableDataCellElement>;
                              render: (
                                arg0: string
                              ) =>
                                | boolean
                                | React.ReactChild
                                | React.ReactFragment
                                | React.ReactPortal;
                            }) => {
                              return (
                                <td {...cell.getCellProps()}>
                                  {cell.render("Cell")}
                                </td>
                              );
                            }
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            </div>
          ) : (
            <div className="table-buttons">
              <div className="card-header d-flex justify-content-between">
                <div>
                  <span className="mx-2">
                    Showing <b>{searchedInstitueData.length}</b> of{" "}
                    <b>{institutionData.length}</b> Institutes
                  </span>
                  <input
                    type="text"
                    className="main-search"
                    onChange={(e) => SearchData(e, "Main-SearchInstitution")}
                  />
                  <button className="search-button">search</button>
                </div>
                <div>
                  {/* {isDisabled ? null : <button className='function-btns' onClick={() => setAddToLocalDBStatus(true)}>Tag Institution</button>} */}
                  <button
                    className="function-btns"
                    onClick={() => setCreateInstituteStatus(true)}
                  >
                    Create Institution
                  </button>
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      onClick={clearFilter}
                      viewBox="0 0 20 20"
                    >
                      <path d="M2.763 13.563c-1.515 1.488-.235 3.016-2.247 5.279-.908 1.023 3.738.711 6.039-1.551.977-.961.701-2.359-.346-3.389-1.047-1.028-2.47-1.3-3.446-.339zM19.539.659C18.763-.105 10.16 6.788 7.6 9.305c-1.271 1.25-1.695 1.92-2.084 2.42-.17.219.055.285.154.336.504.258.856.496 1.311.943.456.447.699.793.959 1.289.053.098.121.318.342.152.51-.383 1.191-.801 2.462-2.049C13.305 9.88 20.317 1.422 19.539.659z" />
                    </svg>
                  </span>
                  <span>
                    {" "}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="40"
                      height="40"
                      viewBox="0 0 48 48"
                      fill="none"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M25.6583 11.7601C24.7731 11.9281 23.2774 12.2105 22.3888 12.3774C22.0013 12.4502 21.3601 12.5711 20.9639 12.646C20.5676 12.721 19.8872 12.8494 19.4518 12.9314C19.0164 13.0134 18.279 13.1524 17.8131 13.2403C16.4966 13.4887 15.9152 13.5982 14.4565 13.873C13.712 14.0133 12.784 14.1883 12.3943 14.2619C12.0046 14.3355 11.3634 14.4565 10.9693 14.5306C10.5753 14.6048 10.2369 14.669 10.2173 14.6734L10.1816 14.6814L10.1856 25.1976L10.1896 35.7138L10.4191 35.7567C10.5454 35.7803 10.9551 35.8575 11.3295 35.9282C12.9599 36.2361 13.9786 36.4282 14.4803 36.5223C14.7764 36.5779 15.4568 36.7061 15.9923 36.8073C16.5279 36.9084 17.3401 37.0616 17.7973 37.1477C18.2545 37.2338 18.8779 37.3513 19.1827 37.4088C19.4874 37.4664 20.1679 37.5947 20.6947 37.694C21.2215 37.7933 22.3366 38.0034 23.1725 38.161C24.0085 38.3186 25.0523 38.5152 25.4921 38.598C25.9318 38.6808 26.3077 38.7525 26.3273 38.7573L26.3629 38.7661V37.4029V36.0398L31.9717 36.0356L37.5805 36.0315L37.7072 35.9956C38.1189 35.879 38.4116 35.6339 38.5845 35.2611C38.6182 35.1884 38.659 35.0791 38.6752 35.0182C38.7037 34.9107 38.7046 34.614 38.7046 25.2018V15.4962L38.6692 15.3616C38.5381 14.8642 38.1727 14.5107 37.6589 14.3842C37.5562 14.359 37.1715 14.3568 31.9559 14.3525L26.3629 14.3478V12.9953C26.3629 12.2514 26.3575 11.6401 26.351 11.6369C26.3445 11.6336 26.0328 11.6891 25.6583 11.7601ZM37.5726 25.1939V34.9311L31.9638 34.9271L26.355 34.9232V34.0603V33.1974L28.3143 33.1933L30.2736 33.1893V31.9545V30.7196L28.3143 30.7156L26.355 30.7116V30.292V29.8725L28.3222 29.8684L30.2894 29.8644V28.6375V27.4106L28.3222 27.4065L26.355 27.4025V26.9434V26.4842L28.3182 26.4805L30.2815 26.4767L30.2856 25.2495L30.2896 24.0223L28.3223 24.0183L26.355 24.0143V23.5314V23.0485L28.3222 23.0445L30.2894 23.0404V21.8135V20.5866L28.3222 20.5826L26.355 20.5785V20.1273V19.6761L28.3143 19.672L30.2736 19.668V18.4332V17.1983L28.3143 17.1943L26.355 17.1903L26.3508 16.3432C26.3486 15.8774 26.3501 15.4873 26.3543 15.4764C26.3603 15.4606 27.4975 15.4566 31.9672 15.4566H37.5726V25.1939ZM31.2869 18.4332V19.6682H33.5273H35.7676V18.4332V17.1982H33.5273H31.2869V18.4332ZM21.0401 20.7488C20.8837 21.047 20.6857 21.4228 20.6001 21.5839C20.5144 21.745 20.3251 22.1048 20.1794 22.3835C20.0337 22.6622 19.8041 23.1003 19.6692 23.3572C19.3926 23.8842 19.136 24.3741 18.9498 24.7308L18.8238 24.9723L19.0486 25.3958C19.1724 25.6287 19.3287 25.9225 19.3962 26.0488C19.4636 26.1751 19.5884 26.4102 19.6736 26.5713C19.7587 26.7324 19.8871 26.9746 19.9589 27.1096C20.0307 27.2446 20.1794 27.5243 20.2892 27.7311C20.399 27.9379 20.5771 28.2728 20.6849 28.4752C20.7927 28.6777 20.9859 29.0428 21.1141 29.2866C21.2424 29.5305 21.3578 29.7466 21.3706 29.767C21.3834 29.7873 21.3904 29.8074 21.3862 29.8116C21.3712 29.8266 19.1671 29.6695 19.1483 29.6521C19.1381 29.6427 19.0553 29.4675 18.9644 29.2629C18.6063 28.4576 18.1396 27.4133 17.9561 27.0067C17.7418 26.532 17.7076 26.4382 17.6544 26.1789C17.6343 26.0807 17.613 26.0059 17.6071 26.0127C17.6013 26.0195 17.5873 26.0678 17.5762 26.1201C17.5247 26.3608 17.4183 26.6362 17.1603 27.1967C17.012 27.5189 16.7661 28.0533 16.6138 28.3842C16.4616 28.7151 16.291 29.0856 16.2348 29.2075C16.1787 29.3294 16.1267 29.4353 16.1194 29.4427C16.1075 29.4549 14.2036 29.3315 14.1895 29.3177C14.1863 29.3146 14.2372 29.2137 14.3025 29.0935C14.3679 28.9733 14.5902 28.5579 14.7966 28.1704C15.1483 27.51 15.29 27.2447 15.5492 26.7613C15.8118 26.2714 15.9267 26.0562 16.1746 25.5897C16.3203 25.3154 16.4498 25.0731 16.4623 25.0513C16.484 25.0135 16.4613 24.9632 15.9438 23.9035C15.6462 23.2939 15.2832 22.5493 15.1373 22.2489C14.9913 21.9485 14.7606 21.4753 14.6245 21.1974C14.4885 20.9196 14.3795 20.6899 14.3823 20.6871C14.3864 20.683 15.971 20.5703 16.2927 20.5511L16.3635 20.5469L16.4553 20.7685C16.5057 20.8905 16.6154 21.1576 16.699 21.3623C16.7826 21.5669 16.9934 22.0799 17.1674 22.5022C17.4867 23.2771 17.5772 23.5231 17.6427 23.7942C17.6624 23.8759 17.6839 23.9428 17.6904 23.9429C17.6969 23.943 17.7023 23.933 17.7023 23.9208C17.7023 23.8843 17.8746 23.3285 17.931 23.1831C17.9755 23.0684 18.2022 22.5631 18.734 21.3939C18.7954 21.259 18.924 20.974 19.0198 20.7606C19.1157 20.5473 19.1995 20.3669 19.2061 20.3598C19.2174 20.3475 21.0188 20.2127 21.2273 20.2085L21.3245 20.2065L21.0401 20.7488ZM31.2869 21.8135V23.0406H33.5273H35.7676V21.8135V20.5865H33.5273H31.2869V21.8135ZM31.2908 25.2494L31.2948 26.4765L33.5312 26.4804L35.7676 26.4842V25.2532V24.0222H33.5272H31.2867L31.2908 25.2494ZM31.2869 28.6375V29.8645H33.5273H35.7676V28.6375V27.4104H33.5273H31.2869V28.6375ZM31.2869 31.9545V33.1895H33.5273H35.7676V31.9545V30.7195H33.5273H31.2869V31.9545Z"
                        fill="#333333"
                      />
                    </svg>
                  </span>
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      onClick={printFunction}
                      data-name="Layer 1"
                      width="24"
                      height="24"
                      viewBox="0 0 40 40"
                    >
                      <path d="M33.62 14.41h-2.2v-10a1 1 0 0 0-1-1h-19.2a1 1 0 0 0-1 1v10H8a4.21 4.21 0 0 0-4.2 4.21v8A4.2 4.2 0 0 0 8 30.84h2v5.54a1 1 0 0 0 1 1h19.66a1 1 0 0 0 1-1v-5.54h2a4.21 4.21 0 0 0 4.2-4.2v-8a4.21 4.21 0 0 0-4.24-4.23Zm-21.4-9h17.2v9h-17.2Zm17.44 30H12v-11.6h17.66Zm6.16-8.74a2.21 2.21 0 0 1-2.2 2.2h-2v-6a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v6H8a2.21 2.21 0 0 1-2.2-2.2v-8A2.21 2.21 0 0 1 8 16.41h25.6a2.21 2.21 0 0 1 2.2 2.21Z" />
                      <path d="M25.35 26.32h-8.73a1 1 0 0 0 0 2h8.73a1 1 0 0 0 0-2zm0 4.5h-8.73a1 1 0 1 0 0 2h8.73a1 1 0 0 0 0-2zm4.86-12.62h-2.08a1 1 0 0 0 0 2h2.08a1 1 0 0 0 0-2z" />
                    </svg>
                  </span>
                </div>
              </div>
              <div>
                <table className="table">
                  <thead>
                    <tr>
                      {/* <th><input type='checkbox' onChange={(e) => allChecked(e)} />All</th> */}
                      <th>
                        <input
                          type="text"
                          placeholder="Search Institution"
                          className="search-input"
                          value={inputField.SearchInstitution}
                          onChange={(e) => SearchData(e, "Search-Institution")}
                        />
                      </th>
                      <th>
                        <input
                          type="text"
                          placeholder="City"
                          value={inputField.City}
                          className="search-input"
                          onChange={(e) => SearchData(e, "City")}
                        />
                      </th>
                      <th>
                        <input
                          type="text"
                          placeholder="Country"
                          value={inputField.Country}
                          onChange={(e) => SearchData(e, "Country")}
                        />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchedInstitueData?.map((items, index) => {
                      return (
                        <tr key={index}>
                          {/* <th scope="row"><input type="checkbox" onChange={(e) => checkedData(e, items, index)} /></th> */}
                          <td>{items.FullName}</td>
                          <td>{items.WorkCity ? items.WorkCity : "NA"}</td>
                          <td>
                            {items.WorkCountry ? items.WorkCountry : "NA"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      <Panel
        headerText="Create Contact"
        isOpen={show}
        onDismiss={handleClose}
        isFooterAtBottom={true}
        isBlocking={!show2}
      >
        <input
          type="text"
          placeholder="search name"
          onChange={(e) => searchFun(e)}
        ></input>
        {isvisible ? (
          <div>
            {" "}
            <ul className="list-group">
              {searchData.map((item: any, index: any) => {
                return (
                  <>
                    <li
                      className="list-group-item"
                      value={item.FullName || item.Email}
                      onClick={() => checkProfile(item)}
                    >
                      {item.FullName}
                    </li>
                  </>
                );
              })}
            </ul>
          </div>
        ) : null}
      </Panel>
      <Panel
        headerText={`Edit - ${dynamicValue}`}
        isOpen={show2}
        onDismiss={handleClose}
        isFooterAtBottom={true}
      >
        <div>
        <div className="contact-navigation">
          <button
            className={
              btnVisibilty ? "contact-nav-button-active" : "contact-nav-button"
            }
            onClick={BasicInfoButton}
          >
            Basic Information
          </button>
          <button
            className={
              btnVisibilty
                ? "institute-nav-button"
                : "institute-nav-button-active"
            }
            onClick={imageButton}
          >
            Image Information
          </button>
        </div>
{bshow ? (
  <div>
<>
    <TextField label="First Name" value={general.firstName} name={"firstName"} onChange={(e) => onAllChange(e)} />
    <TextField label="Last Name" value={general.lastName} name={"lastName"} onChange={(e) => onAllChange(e)} />
    <TextField label="Suffix" value={general.suffix} name={"suffix"} onChange={(e) => onAllChange(e)} />
    <TextField label="Job Title" value={general.jobTitle}  name={"jobTitle"} onChange={(e) => onAllChange(e)} />
    <Checkbox label="HR" checked={hrChecked}  onChange={(e) => onAllChange} />
    <Checkbox label="GMBH" checked={gmbhChecked} onChange={(e:any) => onAllChange(e)} />
    <TextField label="Organisation" value={general.organisation} name={"organisation"} onChange={(e) => onAllChange(e)} />
    <Dropdown label="Division" defaultSelectedKey={general.divisionKey} options={divisionOptions} onChange={(e:any) => onAllChange(e)} />
  </>
  </div>
) :
("")
}

        </div>

      </Panel>
      {/* {EditContactStatus ? <HHHHEditComponent props={EditContactData} InstitutionAllData={institutionData} callBack={ClosePopup} userUpdateFunction={updateUserDtlFunction} /> : null} */}
      {/* {AddToLocalDBStatus ? <AddToLocalDBComponent callBack={ClosePopup} /> : null} */}
      {/* {CreateContactStatus ? <CreateContact callBack={Callback} data={EmployeeData} tableStatus={tableStatus} /> : null}
       */}
    </div>
  );
};

export default ContactMainPage;
