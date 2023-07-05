import * as React from 'react';
//import "bootstrap/dist/css/bootstrap.min.css";

import * as $ from 'jquery';
import { FaAngleDown, FaAngleUp, FaPrint, FaFileExcel, FaPaintBrush, FaEdit, FaSearch } from 'react-icons/fa';
import { FiDelete } from 'react-icons/fi';
import { Modal } from 'office-ui-fabric-react';
import Tab from './Tabs/Tab';
import Tabs from './Tabs/Tabs';
import './Tabs/styles.css';
import '../components/Tabs/styles.css';

import { SPComponentLoader } from '@microsoft/sp-loader';
import {
    Column, Table,
    ExpandedState, useReactTable, getCoreRowModel, getFilteredRowModel, getExpandedRowModel, ColumnDef, flexRender, getSortedRowModel, SortingState,
    ColumnFiltersState, FilterFn, getFacetedUniqueValues, getFacetedRowModel
} from "@tanstack/react-table";
import { RankingInfo, rankItem, compareItems } from "@tanstack/match-sorter-utils";
import GlobalCommanTable from '../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable';



SPComponentLoader.loadCss("https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css");
function Task(): JSX.Element {
    const [modalIsOpen, setModalIsOpen] = React.useState(false)
    const [Title, setTitle] = React.useState([])
    const [UserGroup, setUserGroup] = React.useState([])
    const [modalIsOpen2, setModalIsOpen2] = React.useState(false)
    const [taskUser, settaskUser] = React.useState([])
    const [taskGroup, settaskGroup] = React.useState([])
    const [table, setTable] = React.useState(taskUser);
    const [search, setSearch]: [string, (search: string) => void] = React.useState("");
    const [excelData, setExcelData]: any = React.useState([]);
    let handleChange = (e: { target: { value: string; }; }) => {
        setSearch(e.target.value.toLowerCase());
    };
    React.useEffect(() => {
        function UserData() {
            var siteConfig: any = []
            var url = "https://hhhhteams.sharepoint.com/sites/HHHH/SP/_api/web/lists/getbyid('e968902a-3021-4af2-a30a-174ea95cf8fa')/items?$select=Id,Title,Value,Key,Description,Configurations&$filter=Key eq '" + 'SP-TaskUser-Management' + "'";
            $.ajax({
                url: url,
                method: "GET",
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (data) {
                    siteConfig = JSON.parse(data.d.results[0].Configurations);
                    console.log(siteConfig);
                    $.each(siteConfig, function (users: any, user) {
                        if (user.Title == 'sp' || user.Title == 'GmBH') {
                            var ListId = user.listId;
                            var Siteurl = user.siteUrl;
                            TaskUserData(user)
                        }
                    });
                },
                error: function (error) {
                }
            });
        }
        UserData();
    }, [])
    function TaskUserData(user: any) {
        var siteConfig: any = []
        var TaskGroup: any = []
        var taskUser: any = []
        var url = ("https://hhhhteams.sharepoint.com/sites/HHHH/SP/_api/web/lists/getbyid('" + user.listId + "')/items?$select=" + user.query + " ");
        $.ajax({
            url: url,
            method: "GET",
            headers: {
                "Accept": "application/json; odata=verbose"
            },
            success: function (data) {
                $.each(data.d.results, function (uass: any, user) {
                    if (user.Item_x0020_Cover != undefined || user.Item_x0020_Cover != null) {
                        user.Item_x0020_Cover = user.Item_x0020_Cover.Url;
                    }
                    if (user.ItemType == "Group") {
                        user.UserType = "Group"
                        TaskGroup.push(user);
                        settaskGroup(TaskGroup)
                    }
                    else if (user.ItemType == "User") {
                        if (user.IsApprovalMail == undefined || user.IsApprovalMail == '' || user.IsApprovalMail == null || user.IsApprovalMail == 0) {
                            user.IsApprovalMail = 'Decide Case By Case';
                        }
                        user.UserType = "User"
                        user.usertitle = user.UserGroup.Title;
                        if (user.Role != undefined && user.Role.results.length > 0) {
                            user.Userrole = user.Role.results[0];
                        }
                        if (user.TimeCategory != undefined && user.TimeCategory.length > 0) {
                            user.TimeCategory = user.TimeCategory;
                        }
                        if (user.Role != undefined && user.Role != undefined && user.Role.results.length > 1) {
                            user.Userrole = user.Role.results[0] + ',' + user.Role.results[1];
                        }
                        if (user.Role != undefined && user.Role.results[0] == 'Deliverable Teams' && user.Role.results[1] == undefined) {
                            user.Userrole = 'Component Teams';
                        }
                        if (user.Role != undefined && user.Role.results[0] == 'Service Teams' && user.Role.results[1] == undefined) {
                            user.Userrole = 'Service Teams';
                        }
                        if (user.Role != undefined && user.Role.results[0] == 'Deliverable Teams' && user.Role.results[1] == 'Service Teams') {
                            user.Userrole = 'Component Teams' + ',' + user.Role.results[1];
                        }
                        if (user.Role != undefined && user.Role.results[0] == 'Service Teams' && user.Role.results[1] == 'Deliverable Teams') {
                            user.Userrole = user.Role.results[0] + ',' + 'Component Teams';
                        }
                        var ApproverUserItem = '';
                        if (user.Approver.results != undefined) {
                            $.each(user.Approver.results, function (index: any, ApproverUser: any) {
                                ApproverUserItem += ApproverUser.Title + (index == user.Approver.results.length - 1 ? '' : ',');
                            })
                            user['UserManagerName'] = ApproverUserItem;
                        }
                        taskUser.push(user);
                    }
                });
                let datass: any = [];
                taskUser.map((items: any) => {
                    datass.push(
                        {
                            Title: items?.Title,
                            Item_x0020_Cover: items?.Item_x0020_Cover,
                            usertitle: items?.usertitle,
                            TimeCategory: items?.TimeCategory,
                            SortOrder: items?.SortOrder,
                            Userrole: items?.Userrole,
                            msCompany: items?.msCompany,
                            UserManagerName: items?.UserManagerName,
                            Suffix: items?.Suffix,
                            Id: items?.Id,
                        }
                    )
                })
                setExcelData(datass);
                settaskUser(taskUser)
            },
            error: function (error) {
            }

        });


    }
    const setModalIsOpenToTrue = () => {
        setModalIsOpen(true)
    }
    const setModalIsOpenToTrue2 = () => {
        setModalIsOpen2(true)
    }
    const setModalIsOpenToFalse = () => {
        setModalIsOpen(false)
    }
    const setModalIsOpenToFalse2 = () => {
        setModalIsOpen2(false)
    }
    const sortBy = () => {

        const copy = taskUser

        copy.sort((a, b) => (a.Title > b.Title) ? 1 : -1);

        setTable(copy)

    }
    const sortByDng = () => {

        const copy2 = taskUser

        copy2.sort((a, b) => (a.Title > b.Title) ? -1 : 1);

        setTable(copy2)

    }

    const callBackData = React.useCallback((elem: any, ShowingData: any) => {

    }, []);


    const Columns = React.useMemo<ColumnDef<any, unknown>[]>(
        () => [
            {
                accessorKey: "",
                size: 7,
                canSort: true,
                placeholder: "",
                id: 'Id',
                cell: ({ row }) => (
                    <div>

                        {row?.original?.Item_x0020_Cover == undefined &&
                            <div className="text-center title2_taskuser contact ng-binding"
                                title={row?.original?.Title}
                                ui-draggable="true"
                                on-drop-success="dropSuccessHandler($event, $index, group.childs">
                                {row?.original?.Suffix}
                            </div>
                        }
                        {row?.original?.Item_x0020_Cover != undefined &&
                            <img style={{ width: "28px" }}
                                title={row?.original?.Title} src={row?.original?.Item_x0020_Cover} />
                        }
                    </div>
                ),
            },
            {
                cell: ({ row }) => (
                    <>
                        <span className="hreflink">{row?.original?.Title}</span>
                        {row?.original?.Suffix != undefined &&
                            <span>({row?.original?.Suffix})</span>
                        }
                    </>
                ),
                accessorKey: "Title",
                id: "Title",
                canSort: true,
                placeholder: "Search Name",
                header: "",
                size: 15,
            },
            {
                cell: ({ row }) => (
                    <>
                        <span >{row?.original?.usertitle}</span>
                    </>
                ),
                accessorKey: "usertitle",
                id: "usertitle",
                canSort: true,
                placeholder: "Search",
                header: "",
                size: 5,
            },
            {
                cell: ({ row }) => (
                    <>
                        <span >{row?.original?.TimeCategory}</span>
                    </>
                ),
                accessorKey: "TimeCategory",
                id: "TimeCategory",
                canSort: true,
                placeholder: "Search Category",
                header: "",
                size: 5,
            },
            {
                cell: ({ row }) => (
                    <>
                        <span >{row?.original?.SortOrder}</span>
                    </>
                ),
                accessorKey: "SortOrder",
                id: "SortOrder",
                canSort: true,
                placeholder: "Sort",
                header: "",
                size: 5,
            },
            {
                cell: ({ row }) => (
                    <>
                        <span >{row?.original?.Userrole}</span>
                    </>
                ),
                accessorKey: "Userrole",
                id: "Userrole",
                canSort: true,
                placeholder: "Search Roles",
                header: "",
                size: 5,
            },
            {




                cell: ({ row }) => (
                    <>
                        <span >{row?.original?.Company}</span>
                    </>
                ),
                accessorKey: "Company",
                id: "Company",
                canSort: true,
                placeholder: "Company",
                header: "",
                size: 5,
            },
            {
                cell: ({ row }) => (
                    <>
                        <span >{row?.original?.UserManagerName}</span>
                    </>
                ),
                accessorKey: "UserManagerName",
                id: "UserManagerName",
                canSort: true,
                placeholder: "Approver",
                header: "",
                size: 5,
            },
            {
                cell: ({ row }) => (
                    <>
                        <span ><a onClick={(e) => EditData(e, row?.original?.Id)}><FaEdit /></a></span>
                    </>
                ),

                id: "Id",
                canSort: true,
                placeholder: "",
                header: "",
                size: 5,
            },
            {
                cell: ({ row }) => (
                    <>
                        <span ><a><FiDelete /></a></span>
                    </>
                ),

                id: "Id",
                canSort: true,
                placeholder: "",
                header: "",
                size: 5,
            },

        ],
        [taskUser]
    );



    const EditData = (e: any, Id: any) => {
        var spRequest = new XMLHttpRequest();
        spRequest.open('GET', "https://hhhhteams.sharepoint.com/sites/HHHH/SP/_api/web/lists/getbyid('b318ba84-e21d-4876-8851-88b94b9dc300')/items?$filter=Id eq'" + Id + "'", true);
        spRequest.setRequestHeader("Accept", "application/json");

        spRequest.onreadystatechange = function () {

            if (spRequest.readyState === 4 && spRequest.status === 200) {
                var result = JSON.parse(spRequest.responseText);

                if (result.value.ItemType == "Group") {
                    result.value.UserType = "Group"
                    UserGroup.push(result.value);
                    setUserGroup(UserGroup)
                }
                else {

                    setTitle(result.value)

                }
            }

            else if (spRequest.readyState === 4 && spRequest.status !== 200) {
                console.log('Error Occurred !');
            }
            setModalIsOpenToTrue();

        };
        spRequest.send();
    }
    const handleTitle = (e: any) => {
        setTitle(e.target.value)

    };
    return (
        <>

            {/* {Title.map(function(items:any){ */}
            {Title.map(function (items: any) {
                return (
                    <Modal
                        isOpen={modalIsOpen}
                        onDismiss={setModalIsOpenToFalse}
                        isBlocking={false}>
                        <div className='modal-dialog modal-lg'>

                            <div className='modal-content'>
                                <div className='modal-header'>
                                    <h3 className='modal-title'>Add Item</h3>
                                    <button type="button" className='btn btn-danger pull-right' onClick={setModalIsOpenToFalse}>Cancel</button>
                                </div>
                            </div>

                            <div className='modal-body clearfix bg-f5f5'>

                                <Tabs>

                                    <Tab title='BASIC INFORMATION'>
                                        <form name="NewForm" noValidate role="form">
                                            <div className="col-sm-12 pad0">


                                                <div className="form-group mt-10">


                                                    <div className="col-sm-3 pad0 mb-10">
                                                        <label className="full_width">Title</label>


                                                        <input type="search" placeholder="Title" value={items.Title} className="full_width searchbox_height" onChange={handleTitle} />


                                                    </div>
                                                    <div className=" col-sm-1 mb-10">
                                                        <label className="full_width">Suffix</label>
                                                        <input className="form-control text-box" type="text" id="txtSuffix" value={items.Suffix} />
                                                    </div>

                                                    <div className="col-sm-2 mb-10" ng-if="Item.UserGroup.Id!=undefined">


                                                        <label className="full_width">Group</label>

                                                        <select ng-change="groupselectitem(grouptitle)" id="" className="form-control" ng-model="grouptitle">
                                                            <option value="" className="">Select</option>
                                                            {taskGroup.map(function (item: any) {
                                                                return (
                                                                    <option value={item.Title}>{item.Group}</option>
                                                                )
                                                            })}
                                                        </select>
                                                    </div>
                                                    <div ng-if="Item.UserGroup.Id==undefined" className="col-sm-2 PadR0 mb-10">

                                                        <label className="full_width">SortOrder</label>
                                                        <input className="form-control text-box" type="text" ng-pattern="/^[0-9]+([,.][0-9]+)?$/" id="txtTitle" ng-model="Item.SortOrder" autoComplete="off" value={items.SortOrder} />

                                                    </div>
                                                    <div ng-if="Item.UserGroup.Id==undefined" className="col-sm-1 PadR0 mb-10 active_user">
                                                        <label ng-bind-html="GetColumnDetails('ActiveGroup')"></label>
                                                        <label></label>

                                                        <div>
                                                            <div className="col-sm-12">
                                                                <input ng-model="Item.IsActive" className="no-padding" type="checkbox" ng-click="Activuser(Item)" value={items.IsActive} /> Active
                                                            </div>
                                                        </div>

                                                    </div>

                                                    {items.UserGroupId! = undefined &&
                                                        <div className="col-sm-1 padL-0 mb-10">

                                                            <label className="full_width">SortOrder</label>
                                                            <input className="form-control text-box" type="text" ng-pattern="/^[0-9]+([,.][0-9]+)?$/" id="txtTitle" value={items.SortOrder} autoComplete="off" />

                                                        </div>
                                                    }
                                                    {items.UserGroupId! = undefined &&
                                                        <div className="col-sm-2 PadR0 mb-10">
                                                            <label className="full_width"></label>
                                                            <input type="checkbox" ng-model="IsComnponentDraft" ng-click="IsComponentUserDraft(IsComnponentDraft)" value={items.IsComnponentDraft} /> IsComponentDraft

                                                        </div>
                                                    }
                                                    <div className="clearfix"></div>
                                                    <div className=" col-sm-4 padL-0 mb-10">
                                                        <label className="full_width">User Name</label>
                                                        <div data-ng-disabled="false" ui-people data-ng-model="Item.AssingedToUser" pp-is-multiuser="false" pp-account-type="User,DL" id="updateAssignedToUser" className="form-control PeopleHeight"></div>
                                                    </div>
                                                    <div className="col-sm-4 mb-10" ng-show="Item.UserGroup.Id!=undefined">


                                                        <label className="full_width">Manage Categories</label>
                                                        <select ng-change="Categoriesselectitem(searchTimeCategory)" id="" className="form-control" value={items.searchTimeCategory}>
                                                            <option value="" className="">Select</option>
                                                            <option value={items.Title} ng-repeat="items in TaskTimeSheetCategories ">{items.Title}</option>
                                                        </select>
                                                    </div>
                                                    <div className=" col-sm-4 mb-10" ng-if="Item.UserGroup.Id!=undefined">
                                                        <label className="full_width">Approver</label>
                                                        <div data-ng-disabled="false" ui-people data-ng-model="Item.Approver" pp-is-multiuser="true" pp-account-type="User,DL" id="updateManagerToUser" className="form-control PeopleHeight"></div>
                                                    </div>
                                                    <div className="clearfix"></div>
                                                    <div className="col-sm-12 pad0 mb-10 mt-10">

                                                        <div className="col-sm-3 padL-0">
                                                            <label className="full_width headerbox">Approval Type</label>
                                                            <div className="col-sm-12 pl-3">
                                                                <span className="mt-5 col-sm-12 padL-0">
                                                                    <span className="no-padding">
                                                                        <input name="IsApprovalMailProcess" className="no-padding" checked={items.IsApprovalMail == 'Approve All'} type="radio" ng-click="IsApprovalMailFunction('Approve All')" />
                                                                        Approve All
                                                                    </span>
                                                                </span>
                                                                <span className="mt-5 col-sm-12 pad0">
                                                                    <span className="no-padding">
                                                                        <input name="IsApprovalMailProcess" className="no-padding" ng-checked="Item.IsApprovalMail=='Approve All But Selected Items'" type="radio" ng-click="IsApprovalMailFunction('Approve All But Selected Items')" />
                                                                        Approve Selected
                                                                        <div ng-show="IsApprovalMail=='Approve All But Selected Items'">
                                                                            <label> Select Items</label>
                                                                            <div className="col-sm-12 padL-0">
                                                                                <div className="col-sm-11 padding-0  ">
                                                                                    <input type="text" className="form-control"
                                                                                        id="txtCategories" />
                                                                                </div>
                                                                                <div className="col-sm-1 no-padding">

                                                                                    <img ng-src="{{SiteAbsoluteUrl}}/SiteCollectionImages/ICONS/Foundation/EMMCopyTerm.png"
                                                                                        ng-click="openSmartTaxonomyPopup('Categories', Item.SharewebCategories);" />
                                                                                </div>
                                                                                <div className="row">
                                                                                    <div className="col-sm-12 mt-2">

                                                                                        <div className="block" ng-repeat="item in smartCategories">
                                                                                            "item.Title"
                                                                                            <a className="hreflink"
                                                                                                ng-click="removeCategories(item.Id)">
                                                                                                <img ng-src="/_layouts/images/delete.gif" />
                                                                                            </a>
                                                                                        </div>

                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </span>

                                                                </span>
                                                                <span className="mt-5 col-sm-12 pad0">
                                                                    <span className="no-padding">
                                                                        <input name="IsApprovalMailProcess" className="no-padding" ng-checked="Item.IsApprovalMail=='Decide Case By Case'" type="radio" ng-click="IsApprovalMailFunction('Decide Case By Case')" />
                                                                        Case by Case
                                                                    </span>
                                                                </span>
                                                            </div>
                                                        </div>


                                                        <div ng-show="Item.UserGroup.Id!=undefined" className="col-sm-5 pad0 b-right">
                                                            <div className="col-sm-6 padL-0">
                                                                <label className="full_width headerbox">Company</label>
                                                                <div className="col-sm-12 pl-5">

                                                                    <span className="col-sm-12 mt-5 pad0"><input name="Smalsus" className="no-padding" checked={items.Company == 'HHHH'} type="radio" /> HHHH Team</span>
                                                                    <span className="col-sm-12 mt-5 pad0"><input name="Smalsus" className="no-padding" checked={items.Company == 'Smalsus'} type="radio" ng-click="Companyitem('Smalsus')" /> Smalsus Team</span>

                                                                </div>
                                                            </div>
                                                            <div className="col-sm-6 pad0">
                                                                <label className="full_width headerbox">Roles</label>
                                                                <div className="col-sm-12 pl-5 PadR0">
                                                                    <span className="col-sm-12 mt-5 pad0">
                                                                        <input ng-model="DeliverableTeams" className="no-padding" type="checkbox" ng-click="Roletype('Deliverable Teams')" /> Component Teams

                                                                    </span>
                                                                    <span className="col-sm-12 mt-5 pad0">
                                                                        <input ng-model="ServiceTeams" className="no-padding" type="checkbox" ng-click="Roletype('Service Teams')" /> Service
                                                                        Teams
                                                                    </span>
                                                                </div>
                                                            </div>

                                                        </div>

                                                        {items.UserGroupId
                                                            != undefined &&
                                                            <div ng-show="Item.UserGroup.Id!=undefined" className="col-sm-4 mb-10 active_user">
                                                                <input value={items.IsActive} type="checkbox" ng-click="Activuser(Item)" /> Active User
                                                            </div>
                                                        }
                                                        {items.UserGroupId
                                                            != undefined &&
                                                            <div ng-if="Item.UserGroup.Id!=undefined" className="col-sm-4">
                                                                <div>
                                                                    <input ng-model={items.IsTaskNotifications} className="no-padding" type="checkbox" ng-click="verifyCheck(Item)" /> Task Notifications
                                                                </div>
                                                            </div>
                                                        }

                                                    </div>

                                                    <div className="clearfix">

                                                    </div>


                                                </div>

                                            </div>
                                        </form>
                                    </Tab>

                                    {/* ------------------------Tab for image Section------------------------------------------------------------------------------------------- */}

                                    <Tab title='IMAGE INFORMATION'>
                                        <div id="imginfo" className="tab-pane clearfix" ng-show="Item.UserGroup.Id!=undefined">
                                            <div className="link-tab">
                                                <div className="col-md-10 .col-md-offset-2 pull-right form-group ">
                                                    <div className="pull-right">
                                                        <a href="javascript:void(0);" ng-click="clearselectedimage();">Clear</a>
                                                    </div>
                                                    <label>Image Url</label>
                                                    <input type="text" className="form-control" placeholder="Search" title={items.Item_x0020_Cover.Url} value={items.Item_x0020_Cover.Url} />
                                                </div>
                                            </div>
                                            <div className="col-sm-12 box" id="img-part">
                                                <div className="left-section col-md-2">
                                                    <div className="exTab3 row">
                                                        <ul className="nav nav-pills col-sm-12">
                                                            <li className="Tab-length ">
                                                                <a href="#Active_tab" data-toggle="pill" ng-click="selectImageType('logo')">
                                                                    &nbsp;LOGOS
                                                                </a>
                                                            </li>
                                                            <li className=" Tab-length">
                                                                <a href=" #Active_tab" data-toggle="pill" ng-click="selectImageType('page-images')">
                                                                    &nbsp;IMAGES
                                                                </a>
                                                            </li>

                                                            <li className="Tab-length active">
                                                                <a href="#Active_tab" data-toggle="pill" ng-click="selectImageType('portraits')">
                                                                    &nbsp;PORTRAITS
                                                                </a>
                                                            </li>
                                                        </ul>
                                                    </div>

                                                    <div ng-if="selectedImageUrl != undefined">
                                                        <div className="col-sm-12  mt-5">
                                                            <div className="img">
                                                                <img id="selectedimage" src={items.Item_x0020_Cover.Url} title={items.Item_x0020_Cover.Url} />
                                                            </div>
                                                            <div className="break_url">
                                                                {items.FileLeafRef}
                                                            </div>
                                                            <div className="para">
                                                                <a target="_blank" ng-href="{{getimagefolderurl(selectedImageUrl)}}"> <img src="/_layouts/15/images/folder.gif" /> Image Folder </a>
                                                            </div>
                                                            <div className="clear-btn">
                                                                <a className="hreflink" ng-click="clearselectedimage();"><img ng-src="/_layouts/images/delete.gif" /> Clear Image</a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-10 fix-height inner-tabb padding0 ">
                                                    <div className="tab-pane active">
                                                        <div className="row">
                                                            <div className="pb5">
                                                                <div className="tabbable-panel">
                                                                    <div className="exTab3 tabbable-line">
                                                                        <ul className="nav nav-pills nav nav-tabs  ">
                                                                            <li className="active" id="Active_tab">

                                                                                <a href="#tab_default_1" data-toggle="tab" ng-model="imageoptions" ng-click="showcoveroption('exsting')">Choose from existing</a>
                                                                            </li>

                                                                            <li>
                                                                                <a id="coverhide1" href="#coverhide1" data-toggle="tab" ng-model="imageoptions" ng-click="showcoveroption('copypaste')">Copy & Paste</a>
                                                                            </li>

                                                                            <li>
                                                                                <a href="#showUpload" data-toggle="tab" ng-model="imageoptions" ng-click="showcoveroption('upload')">Upload</a>
                                                                            </li>
                                                                        </ul>
                                                                        <div className="tab-content pad_tab-content imageinfo_border mb-5" id="tab_default_1">
                                                                            <div className="form-group search-image" ng-show="existingcover && Images !=null && Images != undefined && Images.length>0">
                                                                                <a className="pull-right" href="javascript:void(0);" ng-click="ShowImagesOOTB()"><img src="/_layouts/15/images/folder.gif" /> Find in SP picture library</a>
                                                                                <input type="text" className="form-control" ng-model="searchImage" placeholder="Search all images here..." />
                                                                            </div>

                                                                            <div ng-show="existingcover && Images !=null && Images != undefined && Images.length>0">

                                                                                {/* <div className="panel-body">
                                                                                    <div className="gallery" id="" ng-show="selectedImageType == 'page-images'">
                                                                                        <ul className="imageinfo-gallery">
                                                                                            <li className="images-list" ng-repeat="img in Images | filter:searchImage | limitTo:17">
                                                                                                <a href="javascript:void(0);" id="pageImages" rel="{{img.EncodedAbsUrl}}" className="preview" title="{{img.FileLeafRef}}">
                                                                                                    <img ng-if="img.FileDirRef.indexOf('Covers/Default') == -1 && img.FileLeafRef != 'cover.png'" id="{{img.Id}}_icon" src="{{img.EncodedAbsUrl}}?RenditionID=9" ng-click="selectImage(img)" className="coverimage" alt="{{img.FileLeafRef}}" />
                                                                                                </a>
                                                                                                <div className="img-bottom ">
                                                                                                    <img className="pull-right setting-icon" ng-src="{{baseUrl}}/SiteCollectionImages/ICONS/32/settings.png" ng-click="Replaceselectedimage(img);" />
                                                                                                </div>
                                                                                            </li>
                                                                                        </ul>
                                                                                        <img data-toggle="popover" data-trigger="hover" data-content="Click here to load more images" ng-src="{{baseUrl}}/PublishingImages/Tiles/Permission/Default/view_more.png?RenditionID=9" ng-click="ShowAllCovers()" className="coverimage view_more_img" />
                                                                                    </div>

                                                                                    <div className="gallery" id="logoImages" ng-show="selectedImageType == 'logo'">



                                                                                        <ul className="imageinfo-gallery">
                                                                                            <li className="logos-list" ng-repeat="img in Images | filter:searchImage">
                                                                                                <a href="javascript:void(0);" id="logosimg" rel="{{img.EncodedAbsUrl}}" className="preview" title="{{img.FileLeafRef}}">
                                                                                                    <img id="{{img.Id}}_image" ng-src="{{img.EncodedAbsUrl}}?RenditionID=9" ng-click="selectImage(img)" className="logo-imgg" />
                                                                                                </a>
                                                                                                <div className="img-bottom ">
                                                                                                    <img className="pull-right setting-icon" ng-src="{{baseUrl}}/SiteCollectionImages/ICONS/32/settings.png" ng-click="Replaceselectedimage(img);" />
                                                                                                </div>
                                                                                            </li>
                                                                                        </ul>

                                                                                    </div>

                                                                                    <div className="gallery" id="tilesImages" ng-show="selectedImageType == 'portraits'">





                                                                                        <ul className="imageinfo-gallery">
                                                                                            <li ng-repeat="img in Images | filter:searchImage | limitTo:17" className="images-list">
                                                                                                <a href="javascript:void(0);" id="pageImages" rel="{{img.EncodedAbsUrl}}" className="preview" title="{{img.FileLeafRef}}">
                                                                                                    <img id="{{img.Id}}_tiles" ng-src="{{img.EncodedAbsUrl}}?RenditionID=9" ng-click="selectImage(img)" className="pageimage" />
                                                                                                </a>
                                                                                                <div className="img-bottom ">
                                                                                                    <img className="pull-right setting-icon" ng-src="{{baseUrl}}/SiteCollectionImages/ICONS/32/settings.png" ng-click="Replaceselectedimage(img);" />
                                                                                                </div>
                                                                                            </li>
                                                                                        </ul>
                                                                                        <img data-toggle="popover" data-trigger="hover" data-content="Click here to load more images" ng-src="{{baseUrl}}/SiteCollectionImages/Tiles/Permission/Default/view_more.png?RenditionID=9" ng-click="ShowAllCovers()" className="pageimage view_more_img" />

                                                                                    </div>

                                                                                </div> */}

                                                                            </div>


                                                                            <div ng-show="copycover" className="form-group pad_tab-content" id="coverhide1">

                                                                                <div className="form-group" id="pasteitemcover">
                                                                                    {/* <div className="col-sm-12">
                                                                                        <label className="full_width">Image Name</label>
                                                                                        <input type="text" className="form-control" ng-model="ImageName" placeholder=".jpg" />
                                                                                    </div> */}
                                                                                </div>
                                                                                <div className="col-sm-12">
                                                                                    <label className="full_width">Paste a new cover:</label>
                                                                                    <div id="itemCoverBody"></div>
                                                                                    <button type="button" className="btn btn-primary pull-right mt-10" ng-click="copyPasteCover()">Upload</button>
                                                                                </div>
                                                                                <div className="clearfix"></div>
                                                                            </div>
                                                                            <div ng-show="uploadcover==true" className="tab-pane pad_tab-content" id="showUpload">
                                                                                <div className="" id="fixedHieght">
                                                                                    <div className="">
                                                                                        <div id="itemcover">
                                                                                            <div className="col-sm-12">
                                                                                                <label className="full_width">Upload from Computer:</label>
                                                                                                <br />
                                                                                                <input className="form-control" ng-model="uploadFile" type="file" id="uploadFile" accept="image/*" valid-file />
                                                                                            </div>
                                                                                            <div className="col-md-12">
                                                                                                <br />
                                                                                                <button type="button" className="btn btn-primary pull-right va" ng-click="uploadCoverImage()">Upload</button>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </Tab>

                                </Tabs>





                                <div className="modal-footer">
                                    <div className="col-sm-6 text-left pad0">
                                        <div>Created <span>11/05/2022</span> by <span className="footerUsercolor">Amit Kumar</span></div>
                                        <div>Last modified <span>22/08/2022</span> by <span className="footerUsercolor">Harshit Chauhan</span></div>
                                        <div>
                                            <a style={{ cursor: "pointer" }} ng-click="deleteTaskUser(Item.Id);"><img src="/_layouts/images/delete.gif" /><span ng-if="Item.UserGroup.Id!=undefined"> Delete this User</span><span ng-if="Item.UserGroup.Id==undefined"> Delete this Group</span></a>
                                        </div>
                                    </div>
                                    <div className="col-sm-6 text-right">
                                        <a target="_blank" href={"https://hhhhteams.sharepoint.com/sites/HHHH/SP/Lists/Task%20Users/EditForm.aspx?ID=" + items.Id}>Open out-of-the-box form</a>
                                        <button type="button" className="btn btn-primary" ng-disabled="UserForm.$error.required" ng-click="UpdateTaskUser(Item)">Save</button>
                                        <button type="button" className="btn btn-default" ng-click="cancelUpdate()">Cancel</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal>
                )
            })}

            {/* ---------------------------------------------------Add Member PopUp------------------------------------------------------------------------------------------------------------------------ */}
            <Modal
                isOpen={modalIsOpen2}
                onDismiss={setModalIsOpenToFalse2}
                isBlocking={false} >
                <div className='modal-dialog modal-lg'>
                    <form>

                        <div className='modal-header'>
                            <h3 className='modal-title'><span>Create New-User</span></h3>
                            <button type="button" className='btn btn-danger pull-right' onClick={setModalIsOpenToFalse2}>Cancel</button>
                        </div>

                        <div className='modal-body clearfix bg-f5f5'>
                            <div className="col-sm-12 tab-content">
                                <label className="full_width">User Name</label>
                                <input type="text" style={{ width: "100%" }} id="username" className='form-Control' placeholder='Enter name or Email adderess' />
                            </div>
                        </div>
                    </form>
                </div>
                <div className='modal-footer mt-3'>
                    <button type="button" className="btn btn-primary m-2" >Save</button>
                    <button type="button" className="btn btn-danger" onClick={setModalIsOpenToFalse2}>Cancel</button>
                </div>
            </Modal>
            <div className="col-sm-12 padL-0 PadR0">
                <h2 className="alignmentitle ng-binding">
                    TaskUser Management
                    <span className="icontype display_hide padLR">
                    </span>

                </h2>
            </div>
            <div className="taskuserr">

                <div className="Alltable">

                    {/* <div id="contacttabs" className="exTab3"> */}
                    {/* <div className="tab-content"> */}
                    <Tabs>
                        <Tab title='Task User'>
                            {/* <div id="TaskUser" className="tab-pane fade in active"> */}
                            {
                                <GlobalCommanTable columns={Columns} data={taskUser} callBackData={callBackData} excelDatas={excelData} />
                            }
                        </Tab>
                        <Tab title='TaskGroup'>

                            <div className="tbl-headings">
                                <span className="leftsec">
                                    <label>
                                        Showing {taskGroup.length} of {taskGroup.length} Components
                                    </label>
                                    <label> | </label>
                                    <span className="g-search">
                                        <input type="text" className="searchbox_height full_width" id="globalSearch" placeholder="search all" />
                                        <span className="gsearch-btn" ><i><FaSearch /></i></span>
                                    </span>
                                </span>
                                <span className="toolbox mx-auto">
                                    <span className="pull-left mr-10">  <button type="button" className="btn btn-primary" onClick={setModalIsOpenToTrue2}>
                                        Add Team Member</button>
                                    </span>
                                    <span>
                                        <a ng-click="printResults('table-wrapper')">
                                            <i className="fa fa-print mr-5" aria-hidden="true" title="Print"></i>
                                        </a>
                                    </span>
                                    <span>
                                        <a data-ng-click="ClearFilters()"><i className="fa fa-paint-brush hreflink" aria-hidden="true" title="Clear All"></i></a>
                                    </span>
                                    <span>
                                        <a>
                                            <i className="fa fa- mr-5" aria-hidden="true" title="Print"></i>
                                        </a>
                                    </span>
                                </span>
                            </div>
                            <div className="col-sm-12 pad0 smart">
                                <div className="section-event">
                                    <div className="container-new">
                                        <table className="table table-hover" id="EmpTable" style={{ width: "100%" }}>
                                            <thead>
                                                <tr>
                                                    {/* <th style={{ width: "2%" }}></th> */}
                                                    <th style={{ width: "45%" }}>
                                                        <div style={{ width: "40%" }} className="smart-relative">
                                                            <input type="search" placeholder="search Name" className="full_width searchbox_height" onChange={handleChange} />
                                                            <span className="sorticon">
                                                                <span className="up" onClick={sortBy}>< FaAngleUp /></span>
                                                                <span className="down" onClick={sortByDng}>< FaAngleDown /></span>
                                                            </span>
                                                        </div>
                                                    </th>
                                                    <th style={{ width: "48%" }}>
                                                        <div style={{ width: "40%" }} className="smart-relative">
                                                            <input id="searchClientCategory" type="search" placeholder="Sort Order"
                                                                title="Client Category" className="full_width searchbox_height"
                                                                onChange={handleChange} />
                                                            <span className="sorticon">
                                                                <span className="up">< FaAngleUp /></span>
                                                                <span className="down">< FaAngleDown /></span>
                                                            </span>

                                                        </div>
                                                    </th>
                                                    <th style={{ width: "2%" }}></th>
                                                    <th style={{ width: "2%" }}></th>

                                                </tr>
                                            </thead>
                                            <tbody>
                                                {taskGroup.map(function (item: any, items: any) {
                                                    if (search == "" || item.Title.toLowerCase().includes(search.toLowerCase())) {
                                                        return (
                                                            <>
                                                                <tr >
                                                                    <td className="pad0" colSpan={9}>
                                                                        <table className="table" style={{ width: "100%" }}>
                                                                            <tr className="bold">

                                                                                <td style={{ width: "17%" }}>{item.Title}</td>
                                                                                <td style={{ width: "17%" }}>{item.SortOrder} </td>

                                                                                <td style={{ width: "2%" }}><a onClick={setModalIsOpenToTrue}><FaEdit /></a></td>
                                                                                <td style={{ width: "2%" }}><a><FiDelete /></a></td>
                                                                            </tr>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </>
                                                        )
                                                    }
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            {/* </div> */}
                        </Tab>
                    </Tabs>
                    {/* </div> */}

                    {/* </div> */}
                </div>

            </div>
        </>

    )
}
export default Task; 