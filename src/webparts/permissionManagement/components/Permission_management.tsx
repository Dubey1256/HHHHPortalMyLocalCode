import * as React from 'react'
import * as $ from 'jquery';
import './IPermissionManagementProps';
// import pnp,{Web} from "sp-pnp-js";
import pnp from "sp-pnp-js";
import '@pnp/sp/webs';
import '@pnp/sp/site-users';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './pm.css';
import { Panel } from "office-ui-fabric-react";
import { Table } from "react-bootstrap";
// import Select from "react-select";
// import {ReactSnackBar} from "react-js-snackbar";
// import ReactSnackBar from "react-js-snackbar";


var Sitegroup: any = [];
export default function Permission_management(props: any) {

    // const [data, setdata]: any = React.useState([]);
    const [readPanel, setreadPanel]: any = React.useState(false);
    const [readPanel2, setreadPanel2]: any = React.useState(false);
    const [readPanel3, setreadPanel3]: any = React.useState(false);
    const [SPGroups, setSPGroups]: any = React.useState([]);
    const [UsersArrByGroup, setUsersArrByGroup]: any = React.useState([]);
    const [refreshState, setRefreshState] = React.useState(false);
    const [Visitors, setVisitors] = React.useState()
    const [newUsersArrByGroupp, setnewUsersArrByGroupp] = React.useState([])
    var SPROOTGroups: any = [], Groups: any = [], newGroup: any = [], arr: any = [], SpGroups: any = [], SearchGroup: any = [], temp: any = [], userNameArray: any = [], UsersArrByGroupp: any = [], addUsers: any = [];
    // const [selectedOptions, setSelectedOptions] = React.useState();
    const [tempr, settempr] = React.useState([])
    const [search, setsearch]: any = React.useState(false);
    // const [addSearch, setAddSearch]: any = React.useState(false);
    const [dGroups, setdGroups]: any = React.useState([]);
    const [value, setValue] = React.useState("");
    const [addValue, setaddValue] = React.useState("");
    const [ValueNew, setValueNew] = React.useState("");
    const [addUser, setaddUser] = React.useState([]);
    const [addUserTemp, setaddUserTemp] = React.useState([]);






    // const [showSnackBar, setshowSnackbar] = React.useState(false)
    // const [SnackMessage, setSnackMessage]:any = React.useState()

    var BaseURL: any, BaseURL1: any, count: any = 0, UserID: any, userId, valuess: any, Flag = true;
    BaseURL = window.location.href;
    BaseURL1 = window.location.href.split('/_layouts');


    const [GroupHierarchy, setGroupHierarchy] = React.useState([{ Title: 'Manage Permissions - Users', Ggroups: [], GroupPermission: 'Design,Contribute,Read' },
    { Title: 'Manage Permissions - Teams', Ggroups: [], GroupPermission: 'Edit' },
    { Title: 'Manage Permissions - Admins', Ggroups: [], GroupPermission: 'Full Control' }]);



    const [userHierarchy, setuserHierarchy]: any = React.useState([
        { Title: 'Approvers', Ugroups: [] },
        { Title: 'Designers', Ugroups: [] },
        { Title: 'GmBH HR', Ugroups: [] },
        { Title: 'GmbH Members ', Ugroups: [] },
        { Title: 'GmbH Owners', Ugroups: [] },
        { Title: 'GmbH Visitors', Ugroups: [] },
        { Title: 'HHHH Administrator', Ugroups: [] },
        { Title: 'HHHH HR', Ugroups: [] },
        { Title: 'HHHH Members', Ugroups: [] },
        { Title: 'HHHH Owners', Ugroups: [] },
        { Title: 'HHHH Visitors', Ugroups: [] },
        { Title: 'Hierarchy Managers', Ugroups: [] },
        { Title: 'HR Members', Ugroups: [] },
        { Title: 'HR Owners', Ugroups: [] },
        { Title: 'HR Visitors', Ugroups: [] },
        { Title: 'Offshore Timesheet Admins', Ugroups: [] },
        { Title: 'Quick Deploy Users', Ugroups: [] },
        { Title: 'Restricted Readers', Ugroups: [] },
        { Title: 'Shareweb Migration-Network Members', Ugroups: [] },
        { Title: 'Shareweb Migration-Network Owners', Ugroups: [] },
        { Title: 'Shareweb Migration-Network Visitors', Ugroups: [] },
        { Title: 'SH Members', Ugroups: [] },
        { Title: 'SH Owners', Ugroups: [] },
        { Title: 'SH Visitors', Ugroups: [] },
        { Title: 'Smalsus Members', Ugroups: [] },
        { Title: 'Smalsus Owners', Ugroups: [] },
        { Title: 'Smalsus Visitors', Ugroups: [] },
        { Title: 'Style Resource Readers', Ugroups: [] },
        { Title: 'Time sheet admin group', Ugroups: [] },
        { Title: 'Training  Members', Ugroups: [] },
        { Title: 'Training Owners', Ugroups: [] },
        { Title: 'Training Visitors', Ugroups: [] },
        { Title: 'Translaton Managers', Ugroups: [] }
    ]);


    // const getSPData = async () => {
    //     pnp.sp.web.currentUser.get().then(
    //         result => { console.log(result) })
    //     var ID = result.ID;
    //     console.log(ID);
    // }




    // Function triggered on selection
    // function handleSelect(data: any) {


    //     setSelectedOptions(data);
    // }


    const getAllData = async () => {


        console.log(props.userDisplayName, "login username");

        await $.ajax({
            url: "https://hhhhteams.sharepoint.com/sites/HHHH/SP/_api/web/sitegroups",
            method: "GET",
            headers: { "accept": "application/json;odata=verbose", "content-Type": "application/json;odata=verbose" },
            success: async function (allData) {

                // sorting 
                // setdata(allData.d.results);
                arr = allData.d.results;

                for (let i = 0; i < arr.length; i++) {
                    if (arr[i].OwnerTitle != "System Account")
                        Sitegroup.push(arr[i]);
                }

                for (let i in Sitegroup) {
                    if (Sitegroup[i].Title == 'KathaBeck42 Visitors' && Sitegroup[i].Id == 4)
                        SPROOTGroups.push(Sitegroup[i]);

                }
                console.log(SPROOTGroups);

                if (arr.length > 0) {
                    for (let i in arr) {
                        if (arr[i].OwnerTitle != "System Account")
                            Groups.push(arr[i]);
                    }

                }
                if (BaseURL.indexOf('SP') > -1) {
                    for (let i in Groups) {
                        if (!(Groups[i].OwnerTitle.indexOf('KSL') > -1))
                            newGroup.push(Groups[i]);
                    }



                    // for (let i in newGroup) {
                    //     count = count + 1;
                    //     await getPermissionLevelBasedOnGroupId(newGroup[i]);


                    // }
                    $.each(newGroup, function (index: any, group: any) {
                        count = count + 1;
                        getPermissionLevelBasedOnGroupId(group);
                    }
                    )
                }
            },
            error: function (res) { }
        });
    }
    console.log(arr);


    /*---Function for Get Permission Level----*/
    const getPermissionLevelBasedOnGroupId: any = async (group: any) => {
        await $.ajax({
            url: "https://hhhhteams.sharepoint.com/sites/HHHH/SP/_api/web/RoleAssignments/GetByPrincipalId(" + group.Id + ")/RoleDefinitionBindings",
            method: "GET",
            async: false,
            headers: {
                "accept": "application/json;odata=verbose",
                "content-Type": "application/json;odata=verbose"
            },
            success: function (data) {
                group['PermissionName'] = data.d.results[0].Name;
                if (count == newGroup.length) {
                    makeGroupHierarchy();

                }
            },
            error: function (data) {

                if (count == newGroup?.length) {

                }
            }

        });

    }


    /*----Function for make hierarchy of groups---*/
    const makeGroupHierarchy: any = async () => {
        let localG = GroupHierarchy;
        await $.each(localG, function (index: any, hierarchy: any) {
            $.each(newGroup, function (index: any, group: any) {
                if (hierarchy['GroupPermission'].indexOf(group['PermissionName']) > -1) {
                    hierarchy.Ggroups.push(group);
                    // Gtemp[Ctemp]=hierarchy.Ggroups;
                    // Ctemp=Ctemp+1;
                }
            }

            )
            setGroupHierarchy(localG)
        })
        setRefreshState(!refreshState);
    }


    console.log(userNameArray);


    React.useEffect(() => {

        // setTimeout(() => {
        //     setshowSnackbar(false)
        // }, 6000);
        getAllData();


        // DisplaySiteOwners();
    }, [])

    /*---Functions for Add/Remove users from group---*/

    const BindUsersByGroup: any = async () => {
        Flag = true;
        await LoadUserByGroupId(SearchGroup.Id, SearchGroup.Title);
    }



    //  const BindUsersByGroup:any = async ()=> {
    //     var Flag=true;
    //    var UsersArrByGroup=[];
    //     var searchText = '';
    //     await {
    //         LoadUserByGroupId(SearchGroup.Id, SearchGroup.Title );
    //     }
    //  }

    //  const generateErrorMsg:any = async (data:any, status:any, headers:any, config:any, baseUrl:any, queryData:any)=> {
    //     var result = '';
    //     if (status === 0) {
    //         result = 'No connection. Verify application is running.';
    //     } else if (status == 401) {
    //         result = 'Unauthorized';

    //     } else if (status == 404) {
    //         result = 'URL not found [404]';
    //     } else if (status == 405) {
    //         result = 'HTTP verb not supported [405]';
    //     } else if (status == 500) {
    //         result = 'Internal Server Error [500].';
    //     } else {
    //         result = JSON.parse(JSON.stringify(data));
    //     }
    //     var pageURL =  window.location.href;
    //     var obj = { 'status': status, 'result': result, 'baseUrl': baseUrl, 'queryData': queryData, 'data': data, 'headers': headers, 'config': config, 'serverRequestUrl': pageURL };
    //     return obj;
    //  }



    // var cName='';

    // Panel open and functions



    const closereadPanel = () => {
        setreadPanel(false);
    }

    const closereadPanel3 = () => {
        setreadPanel3(false);
    }
    const closereadPanel2 = () => {
        setreadPanel2(false);
        setsearch(false);
        setValue("")
        setdGroups([]);
    }

    const DisplaySiteOwners = async (dataa: any) => {
        if (BaseURL.indexOf('SP') > -1) {
            for (let i = 0; i < Sitegroup.length; i++) {

                if (!(Sitegroup[i].OwnerTitle.indexOf('KSL') > -1) && !(Sitegroup[i].LoginName.indexOf('KSL') > -1) && !(Sitegroup[i].LoginName.indexOf('Test') > -1) && !(Sitegroup[i].LoginName.indexOf('test')! > -1)) {
                    SpGroups.push(Sitegroup[i]);
                }
            }
        }

        $.each(SpGroups, function (index: any, group: any) {
            if (group.Title == dataa)
                SearchGroup = group;
        })

        await LoadUserByGroupId(SearchGroup.Id, SearchGroup.Title);
        GetUserByGroupId(SearchGroup.Id, SearchGroup.Title);
        // SiteOwnerChangeView(true, false);
        if (Flag == true) {
            setreadPanel(true);
        }

        console.log(Sitegroup)
        setSPGroups(SpGroups);

    }

    // var IsLoadSiteOwner:any, IsAddSiteOwner:any;
    // const SiteOwnerChangeView = async (IsLoad: any, IsAdd:any) => {
    //     IsLoadSiteOwner = IsLoad;
    //     IsAddSiteOwner = IsAdd;
    // }

    const GetUserByGroupId = async (groupId: any, groupName: any) => {
        var newArr: any = [];

        UsersArrByGroupp.length = 0;
        var query = "/_api/web/SiteGroups/GetById(" + groupId + ")/Users";
        await $.ajax({
            url: BaseURL1[0] + query,
            method: "GET",
            async: false,
            headers: {
                "accept": "application/json;odata=verbose",
                "content-Type": "application/json;odata=verbose"
            },
            success: function (data) {

                newArr = data.d.results;
                $.each(newArr, function (i: any, value: any) {
                    if (newArr[i].Title != "System Account" && newArr[i].Title != groupName) {
                        Flag = true;
                        userId = newArr[i].Id;
                        var userEmail = newArr[i].Email;
                        var userTitle = newArr[i].Title;
                        var userLoginName = newArr[i].LoginName.replace('#', '%23');
                        var userObj: any = {
                            userLoginName: userLoginName,
                            id: userId,
                            title: userTitle,
                            email: userEmail,
                            // userUrl:'',
                            // pictureUrl:''
                        };


                        userObj.userLoginName = userLoginName;
                        userObj.id = userId;
                        userObj.title = userTitle;
                        userObj.email = userEmail;


                        // userObj.userUrl = _spPageContextInfo.ProfileUrl + "?accountname=" + userLoginName;
                        // userObj.pictureUrl = _spPageContextInfo.siteAbsoluteUrl + "/_layouts/15/userphoto.aspx?size=l&accountname=" + userEmail;
                        UsersArrByGroupp.push(userObj);




                    } // end of IF system account
                }
                );
                setUsersArrByGroup(UsersArrByGroupp);

                setnewUsersArrByGroupp(UsersArrByGroupp);
                console.log(addUser);
                //
            },
            error: function (data) {
                setreadPanel(false);
                Flag = false;
                alert('You do not have the necessary rights to access this section');
                // setshowSnackbar(true);
                // setSnackMessage("Please contact with Admin");

            }

        });


    }

    const LoadUserByGroupId = async (GroupId: any, GroupName: any) => {
        GetUserByGroupId(GroupId, GroupName);

    };





    const onOptionChangeHandler = (event: any) => {
        valuess = event.target.value;
        setVisitors(valuess)
        DisplaySiteOwners(valuess)
        openreadPanel3(valuess)
        console.log(event.target.value)
    }

    const openreadPanel = (dataa: any, Ide: any) => {
        let VisitorsSet = Visitors;
        VisitorsSet = dataa
        setVisitors(VisitorsSet);
        //    cName=dataa;
        setreadPanel(true);
        DisplaySiteOwners(dataa);
    }

    const openreadPanel3 = (gg: any) => {
        setreadPanel3(true);
    }


    //   const [UserHierarchy, setUserHierarchy] = React.useState([
    // { Title: '', Ggroups: [], GroupPermission: 'Design,Contribute,Read' },
    // { Title: 'Manage Permissions - Teams', Ggroups: [], GroupPermission: 'Edit' },
    // { Title: 'Manage Permissions - Admins', Ggroups: [], GroupPermission: 'Full Control' }]);


    // const makeUserHierarchy: any = async () => {
    //     let localG = GroupHierarchy;
    //     await $.each(localG, function (index: any, hierarchy: any) {
    //         $.each(newGroup, function (index: any, group: any) {
    //             if (hierarchy['GroupPermission'].indexOf(group['PermissionName']) > -1) {
    //                 hierarchy.Ggroups.push(group);
    //                 // Gtemp[Ctemp]=hierarchy.Ggroups;
    //                 // Ctemp=Ctemp+1;
    //             }
    //         }

    //         )
    //         setGroupHierarchy(localG)
    //     })
    //     setRefreshState(!refreshState);
    // }


    const RemoveSiteOwner = async (U: any) => {
        pnp.sp.web.currentUser.get().then(result => {
            console.log(result)
            UserID = result.Id;

        })

        if (UserID == U) {
            alert("You cannot remove yourself!");
            return false;
        }
        var flag = confirm("Are you sure, you want to delete this?");
        if (flag) {
            RemoveUserByLoginNameInGroupById(U, SearchGroup.Id);
        }
    }


    const RemoveUserByLoginNameInGroupById = async (userId: any, groupId: any) => {

        var url = BaseURL1 + "/_api/web/sitegroups(" + groupId + ")/users/removebyid(" + userId + ")";
        return postRequestWithOutData(url);



    }

    const postRequestWithOutData = async (baseUrl: any) => {

        $.ajax({
            url: baseUrl,
            method: "POST",
            headers: {
                "accept": "application/json;odata=verbose",
                "content-Type": "application/json;odata=verbose"
            },
            success: function (result) {
                BindUsersByGroup();
            },
            error: function (data) {
                alert('You do not have the necessary rights to access this section');
            }
        });

    }


    const seperateUsers = async () => {
        setreadPanel2(true);
        let localU = userHierarchy, userEmail, userTitle;
        var newArr: any = [];


        if (BaseURL.indexOf('SP') > -1) {
            for (let i = 0; i < Sitegroup.length; i++) {

                if (!(Sitegroup[i].OwnerTitle.indexOf('KSL') > -1) && !(Sitegroup[i].LoginName.indexOf('KSL') > -1) && !(Sitegroup[i].LoginName.indexOf('Test') > -1) && !(Sitegroup[i].LoginName.indexOf('test')! > -1)) {
                    SpGroups.push(Sitegroup[i]);
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
                            "accept": "application/json;odata=verbose",
                            "content-Type": "application/json;odata=verbose"
                        },
                        success: function (data) {

                            newArr = data.d.results;
                            $.each(newArr, function (i: any, value: any) {
                                if (newArr[i].Title != "System Account" && newArr[i].Title != group.Title) {
                                    userId = newArr[i].Id;
                                    userEmail = newArr[i].Email;
                                    userTitle = newArr[i].Title;

                                    var userObj: any = {
                                        Name: userTitle,
                                        id: userId,
                                        email: userEmail,
                                        // userUrl:'',
                                        // pictureUrl:''
                                    };

                                    // tempp.Name= userTitle;
                                    // tempp.email= userEmail;



                                } // end of IF system account
                                temp.push(userObj?.Name)
                                // console.log(temp);
                                // groups.Ugroups.push(userObj);
                                localvar.push(userObj);
                                groups.Ugroups = localvar;
                            }
                            );

                        },
                        error: function () {
                            console.log("error");

                        }

                    });

                }

            }
            )
            // userNameArray=[...new Set(temp)]
            setuserHierarchy(localU);
            // if()
            // seperate(group.Id, group.Title)

        })

        await removeDuplicates(temp);

    }

    // const seperate = async (groupId: any, groupName: any) =>{
    //     var newArr: any = [], userEmail, userTitle,
    //     var userObj: any={}
    //     var query = "/_api/web/SiteGroups/GetById(" + groupId + ")/Users";
    //     await $.ajax({
    //         url: BaseURL1[0] + query,
    //         method: "GET",
    //         async: false,
    //         headers: {
    //             "accept": "application/json;odata=verbose",
    //             "content-Type": "application/json;odata=verbose"
    //         },
    //         success: function (data) {

    //             newArr = data.d.results;
    //             $.each(newArr, function (i: any, value: any) {
    //                 if (newArr[i].Title != "System Account" && newArr[i].Title != groupName) {
    //                     userId = newArr[i].Id;
    //                      userEmail = newArr[i].Email;
    //                      userTitle = newArr[i].Title;
    //                       userObj = {
    //                         userName: userTitle,
    //                         email: userEmail,

    //                     };

    //                 } // end of IF system account
    //             }
    //             ); 

    //             $.each(localU, function (index: any, group: any) {
    //                 if(group.Title==groupName){
    //                     group.Ugroups.push(userObj);
    //                 }

    //             })

    //             setuserHierarchy(localU)

    //         },
    //         error: function (data) {
    //            console.log("error");

    //         }

    //     });


    // }
    // userNameArray= temp.reduce(function (previous: any, current: any) {

    //     var alredyExists = previous.filter(function (item: any) {

    //         return item.Id === current.Id

    //     }).length > 0

    //     if (!alredyExists) {

    //         previous.push(current)

    //     }

    //     return previous

    // }, [])

    var tempp: any = [];

    const removeDuplicates = async (temp: any) => {
        for (let i = 0; i < temp.length; i++) {
            if (tempp.indexOf(temp[i]) === -1) {
                tempp.push(temp[i]);
            }
        }
        settempr(tempp);
    }


    console.log(tempp);


    const onChange = (event: any) => {

        setValue(event.target.value);

        if (value.length == 0) {
            setsearch(false);
        }

    };

    const onChangeSearch = (event: any) => {

        var s = event.target.value;
        setValueNew(s);
        console.log(s);

        if (s.length > 0) {
            var a = UsersArrByGroup.filter((data: any) =>
                data.title.toLowerCase().includes(s)
            )
            setUsersArrByGroup(a)
            console.log(a);
        }
        else {
            setUsersArrByGroup(newUsersArrByGroupp);
        }





    };

    var DGroups: any = [];

    const onSearch = (searchTerm: any) => {
        setValue(searchTerm);
        // our api to fetch the search result


        $.each(userHierarchy, function (index: any, d: any) {
            $.each(d.Ugroups, function (index: any, data: any) {

                if (searchTerm == data?.Name)
                    DGroups.push(d.Title);

            })

            setsearch(true);
        })


        console.log(DGroups);
        setdGroups(DGroups);
        console.log("search ", searchTerm);
    };




    const change = () => {
        setValue("");
        setsearch(false);
    }

    const changes = () => {
        setValueNew("");
    }


    const Rtitle: any = () => {
        console.log(UsersArrByGroup)
        var y = [...UsersArrByGroup].reverse();
        console.log(y);
        setUsersArrByGroup(y);

    }



    const Insert = async () => {

        let localU = userHierarchy, userEmail, userTitle;
        var newArr: any = [], ntmp = [];


        if (BaseURL.indexOf('SP') > -1) {
            for (let i = 0; i < Sitegroup.length; i++) {

                if (!(Sitegroup[i].OwnerTitle.indexOf('KSL') > -1) && !(Sitegroup[i].LoginName.indexOf('KSL') > -1) && !(Sitegroup[i].LoginName.indexOf('Test') > -1) && !(Sitegroup[i].LoginName.indexOf('test')! > -1)) {
                    SpGroups.push(Sitegroup[i]);
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
                            "accept": "application/json;odata=verbose",
                            "content-Type": "application/json;odata=verbose"
                        },
                        success: function (data) {

                            newArr = data.d.results;
                            $.each(newArr, function (i: any, value: any) {
                                if (newArr[i].Title != "System Account" && newArr[i].Title != group.Title) {
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
                                    // userAdd.userLoginName = userLoginAddName;
                                    // userAdd.id = userId;
                                    // userAdd.title = userTitle;
                                    // userAdd.email = userEmail;
                                    
                                   

                                    // tempp.Name= userTitle;
                                    // tempp.email= userEmail;



                                } // end of IF system account
                                temp.push(userObj?.Name)
                                // console.log(temp);
                                // groups.Ugroups.push(userObj);
                                localvar.push(userObj);
                                groups.Ugroups = localvar;
                                addUsers.push(userAdd);
                            }
                            );

                        },
                        error: function () {
                            console.log("error");

                        }

                    });

                }

            }
            )
            // userNameArray=[...new Set(temp)]
            setuserHierarchy(localU);
             setaddUser(addUsers)
            // if()
            // seperate(group.Id, group.Title)

        })

        for (let i = 0; i < temp.length; i++) {
            if (ntmp.indexOf(temp[i]) === -1) {
                ntmp.push(temp[i]);
            }
        }

        setaddUserTemp(ntmp)
        setreadPanel3(true)


    }

    const onChangeAdd = (event: any) => {

        setaddValue(event.target.value);

        // if (addValue.length == 0) {
        //     setsearch(false);
        // }

    };

    const onSearchh = (searchTerm: any) => {
        let v = searchTerm, s: any;
        setaddValue(v);

        $.each(addUser, function (i: any, user: any) {
            if (v == user.title) {
                s = user.userLoginName
                InsertUserByLoginNameInGroupById(user.userLoginName, SearchGroup.Id);
            }

            console.log(s);

        })




        // $('#btnSubmitUser').prop('disabled', true);
        // if (Item.siteOwnerUser.results.length == 0) {
        //     alert("Please add Users to add in selected group");
        //     $('#btnSubmitUser').prop('disabled', false);
        //     return false;
        // }
        // angular.forEach($scope.Item.siteOwnerUser.results, function (value, i) {
        //     $scope.InsertUserByLoginNameInGroupById(value.Name, $scope.SearchGroup.Id);
        //     if ($scope.SearchGroup.Title =='TeamK4Bundestag Members' && $scope.SPROOTGroups.Title == 'KathaBeck42 Visitors') {
        //         $scope.InsertUserByLoginNameInGroupByIdSite(value.Name,$scope.SPROOTGroups.Id)
        //     }
        // });

    };


    const InsertUserByLoginNameInGroupById = async (userLoginName: any, groupId: any) => {
        var url = "https://hhhhteams.sharepoint.com/sites/HHHH/admin/_api/web/sitegroups(" + groupId + ")/users";
        var data = {
            "__metadata": {
                "type": "SP.User"
            },
            "LoginName": userLoginName,
        };

            postRequest(data, url);
    };

   const postRequest = (data:any, url:any) => {
        $.ajax({
            url: url,
            method: "POST",
            headers: {
                "accept": "application/json;odata=verbose",
                "content-Type": "application/json;odata=verbose"
            },
            data: JSON.stringify(data),
            success: function (result) {
                 BindUsersByGroup();
               
            },
            error: function (result, status) {
                alert('You do not have the necessary rights to access this section');
                BindUsersByGroup();
                setreadPanel3(false);
            }
        });
    };














    return (


        <div className={refreshState ? '' : ''} >

            {/* <ReactSnackBar Icon={<span>🦄</span>} Show={showSnackBar}>
                {SnackMessage}</ReactSnackBar> */}
            {console.log(SPGroups)}

            <div>
                <Panel
                    headerText="Manage Permissions"

                    isOpen={readPanel}
                    onDismiss={closereadPanel}
                    isFooterAtBottom={true}
                    isBlocking={!readPanel3 && !openreadPanel3}
                >

                    <a className="pull-right " onClick={() => Insert()}>
                        <span className="glyphicon glyphicon-plus" ></span>
                        Add User
                    </a>
                    <Container>
                        <Row>
                            <Col sm={6}>
                                <select value={Visitors} onChange={(event) => onOptionChangeHandler(event)}>

                                    {/* <option > Please choose one option</option> */}
                                    {/* <option value="Select">{props.props}{valuess}</option> */}
                                    {SPGroups?.map((option: any, index: any) => {
                                        return <option value={option.Title} key={index} >
                                            {option.Title}
                                        </option>
                                    })}
                                </select>
                            </Col>
                            <Col sm={6}>
                                <div className="search ">
                                    <input type="text" placeholder="Search User..." value={ValueNew} onChange={onChangeSearch} />
                                    <button id="btnn" onClick={() => changes()} > X </button>
                                    {/* <button onClick={() => onSearchh(value)}> Check Permission</button> */}

                                </div>
                            </Col>
                        </Row>
                    </Container>
                    <Table>
                        <thead>
                            <tr>
                                <th onClick={() => Rtitle()} >

                                    <span className="ptr">
                                        {/* <img className="ms-sortarrowup-icon" src="/_layouts/15/images/spcommon.png?rev=23" alt="" data-themekey="#"/> */}
                                        Title

                                    </span>
                                </th>
                                <th onClick={() => Rtitle()} className="ptr">

                                    <span className="ptr">
                                        {/* <img className="ms-sortarrowup-icon" src="/_layouts/15/images/spcommon.png?rev=23" alt="" data-themekey="#"/> */}
                                        Email
                                    </span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {UsersArrByGroup?.map((op: any, i: any) => {
                                return (<tr className='hhh'>
                                    <td><span>{op.title}
                                    </span></td>
                                    <td>{op.email}</td>
                                    <td>
                                        <a title="Delete {{::SearchGroup.Title}}" href="javascript:void(0)"
                                            className="pull-right">
                                            <img src="/_layouts/images/delete.gif" onClick={() => RemoveSiteOwner(op.id)} />
                                        </a>
                                    </td>
                                </tr>)
                            })}

                        </tbody>
                    </Table>



                </Panel>
            </div>






            <div>
                <Panel headerText={`Add User in ${Visitors}`}

                    isOpen={readPanel3}
                    onDismiss={closereadPanel3}
                    isFooterAtBottom={true}
                // isBlocking={}
                >

                    {/* <div >
                    <input type="text" value={addValue} onChange={onChangeAdd} />

                    <p>{addValue}</p>

                        {addUser?.map((op: any, i: any) => {
                            return (<tr>
                                <td><span>{op.title}</span></td>
                            </tr>)
                        })}


                    </div> */}

                    <div >
                        <div className="search-container ">
                            <div className="search-inner ">
                                <input type="text" value={addValue} onChange={onChangeAdd} />
                                <button id="btn" onClick={() => change()} ><img src="/_layouts/images/delete.gif" /></button>
                                <button onClick={() => onSearchh(addValue)}></button>

                            </div>
                            <div className="dropdown">
                                {addUserTemp?.filter((item) => {
                                    // item?.toLowerCase().includes(item);


                                    const searchTerm = addValue?.toLowerCase();
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
                                            onClick={() => onSearchh(item)}
                                            className="dropdown-row"
                                            key={item}
                                        >
                                            {item}
                                        </div>
                                    ))}
                            </div>
                        </div>


                        {/* <div className='grp'>

                            {search && <div >

                                {dGroups?.map((op: any, i: any) => {
                                    return (<tr>
                                        <td><span>{op}</span></td>
                                    </tr>)
                                })}


                            </div>}
                        </div> */}






                    </div>

                </Panel>
            </div>

            <div>
                <Panel
                    headerText="Check User Permissions"

                    isOpen={readPanel2}
                    onDismiss={closereadPanel2}
                    isFooterAtBottom={true}
                // isBlocking={}
                >
                    <div >
                        <div className="search-container ">
                            <div className="search-inner ">
                                <input type="text" value={value} onChange={onChange} />
                                <button id="btn" onClick={() => change()} ><img src="/_layouts/images/delete.gif" /></button>
                                {/* <button onClick={() => onSearch(value)}> Check Permission</button> */}

                            </div>
                            <div className="dropdown">
                                {tempr?.filter((item) => {
                                    // item?.toLowerCase().includes(item);


                                    const searchTerm = value?.toLowerCase();
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
                                            onClick={() => onSearch(item)}
                                            className="dropdown-row"
                                            key={item}
                                        >
                                            {item}
                                        </div>
                                    ))}
                            </div>
                        </div>
                        <div className='grp'>

                            {search && <div >

                                {dGroups?.map((op: any, i: any) => {
                                    return (<tr>
                                        <td><span>{op}</span></td>
                                    </tr>)
                                })}


                            </div>}
                        </div>






                    </div>
                </Panel>
            </div>

            <h2>
                Permission-Management
                <span>
                    <a href="#">
                        <img className="img-focus" src="/_layouts/images/edititem.gif" data-themekey="#" />
                    </a>
                </span>
            </h2>
            <div>
                <div>
                    <h4 className=" CUP">
                        <a onClick={() => seperateUsers()} className=" CUPP" href="#" >Check User Permissions</a>
                    </h4>
                </div>
            </div>


            <div>
                {/*All big box start*/}

                {GroupHierarchy?.map((options: any, index: any) => {
                    return (<>
                        <div className="pannel">
                            <div className="heading">
                                <h3 className="panel-title ">
                                    {options.Title}
                                </h3>
                            </div>
                            <div>
                                <div className="panel-body">
                                    <div className="ManagePermissionsTiles text-center">
                                        <Table>
                                            <tbody>
                                                <tr>
                                                    {options.Ggroups?.map((option: any, index: any) => {
                                                        return (
                                                            <th>

                                                                <a href="#" className="Permissiontile col-sm-3 col-md-2 col-xs-12 " onClick={() => openreadPanel(option.Title, option.Id)}>
                                                                    <h2 className="whit">{option.Title}</h2>
                                                                    <img className="text-center img-fluid" src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/24/PermisssionUser_Icon2.png" />
                                                                    <span className="whitt">{option.PermissionName}</span>
                                                                </a>
                                                            </th>)
                                                    })}
                                                </tr>
                                            </tbody>

                                        </Table>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </>)
                })}
            </div>
            {/* All big box end */}



        </div>
    );
}