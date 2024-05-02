import * as React from 'react'
import { Web } from "sp-pnp-js";
import { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import GlobalCommanTable from '../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable';
import { Panel, PanelType } from '@fluentui/react/lib/Panel';
import { ContextualMenu, IContextualMenuItem, Icon } from '@fluentui/react';
import ImagesC from "../../EditPopupFiles/ImageInformation";
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import VersionHistoryPopup from "../../../globalComponents/VersionHistroy/VersionHistory";
import "bootstrap/js/dist/tab";
import moment from 'moment';
import Tooltip from '../../../globalComponents/Tooltip';
import zIndex from '@material-ui/core/styles/zIndex';
import CheckboxTree from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import { FaChevronDown, FaChevronRight, FaMinusSquare, FaPlusSquare, FaSquare, FaCheckSquare } from 'react-icons/fa';
import { Col, Container, Row } from "react-bootstrap";
import { SPHttpClient } from "@microsoft/sp-http";

const TaskUserManagementTable = ({ TaskUsersListData, TaskGroupsListData, baseUrl, AllListid, TaskUserListId, context, fetchAPIData, smartMetaDataItems }: any) => {
    const [data, setData] = React.useState<any>([]);
    const [groupData, setGroupData] = useState([]);
    const [title, setTitle] = useState("");
    const [addTitle, setAddTitle] = useState("");
    const [suffix, setSuffix] = useState("");
    const [selectedApprovalType, setSelectedApprovalType] = useState('');
    const [selectedCompany, setSelectedCompany] = useState('');
    const [selectedRoles, setSelectedRoles] = useState<any>([]);
    const [userGroup, setUserGroup] = useState("");
    const [userTeam, setUserTeam] = useState("");
    const [userCategory, setUserCategory] = useState("");
    const [imageUrl, setImageUrl] = useState<any>({});
    const [EditData, setEditData] = React.useState<any>({});
    const [isActive, setIsActive] = useState(false);
    const [isTaskNotifications, setIsTaskNotifications] = useState(false);
    const [assignedToUser, setAssignedToUser] = useState<any>([]);
    const [approver, setApprover] = useState([]);
    let [sortOrder, setSortOrder] = useState(null);
    const [openPopup, setOpenPopup] = useState(false);
    const [openGroupPopup, setOpenGroupPopup] = useState(false);
    const [openUpdateGroupPopup, setOpenUpdateGroupPopup] = useState(false);
    const [openUpdateMemberPopup, setOpenUpdateMemberPopup] = useState(false);
    const [itemToUpdate, setItemToUpdate] = useState(null);
    const [memberToUpdate, setMemberToUpdate] = useState(null);
    const [autoSuggestData, setAutoSuggestData] = useState(null);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [isUserNameValid, setIsUserNameValid] = useState(false);
    const [checked, setChecked] = useState([]);
    const [expanded, setExpanded] = useState([]);
    const [selectedApproval, setSelectedApproval] = useState('');
    
    // const [searchedProjectKey, setSearchedProjectKey] = React.useState("");

    const Categories: any = (smartMetaDataItems.filter((items: any) => items.TaxType === "TimesheetCategories"))
    const uniqueCategories = Categories.filter(
        (ele: any, i: any, item: any) => item.findIndex((elem: any) => (elem.Title === ele.Title) && elem.Parent?.Title === "Components") === i
    );
    // const categoriesToInclude:any = ["Design", "Development", "Investigation", "QA", "Support","Verification", "Coordination", "Implementation", "Conception", "Preparation"];
    // const uniqueCategories = Categories.filter((val: any) =>
    //     categoriesToInclude.includes(val.Title) && val.Parent?.Title === "Components"
    // );

    console.log(Categories)
    console.log(uniqueCategories)

    const TaxTypeCategories: any = (smartMetaDataItems.filter((items: any) => items.TaxType === "Categories"))
    const MyCategories = TaxTypeCategories.filter((items: any) => items.ParentID === 0)
    // When the member to update is set, initialize the Member states
    useEffect(() => {
        if (memberToUpdate) {
            setSelectedApprovalType(memberToUpdate?.IsApprovalMail);
            setSelectedCompany(memberToUpdate?.Company);
            if(memberToUpdate?.Item_x0020_Cover != null)
                setImageUrl(memberToUpdate?.Item_x0020_Cover);
            // setSelectedRoles(memberToUpdate.Role || []);
            setSelectedRoles(Array.isArray(memberToUpdate.Role) ? memberToUpdate.Role : []);
            setIsActive(memberToUpdate?.IsActive);
            setIsTaskNotifications(memberToUpdate?.IsTaskNotifications);
            setUserCategory(memberToUpdate?.TimeCategory)
            // setSelectedCategories(JSON.parse(memberToUpdate.CategoriesItemsJson))
            if (memberToUpdate.CategoriesItemsJson) {
                const categoriesJson = memberToUpdate.CategoriesItemsJson != 'null' ? JSON.parse(memberToUpdate.CategoriesItemsJson): [];
                setSelectedCategories(categoriesJson);
                if (categoriesJson) {
                    const categoryIds = categoriesJson.map((category: any) => category.Id.toString());
                    setChecked(categoryIds);
                }
            }
            setAssignedToUser(memberToUpdate?.AssingedToUser?.Id)
            // setApprover([memberToUpdate.Approver?.[0]?.Id])
            const Approvers: any = memberToUpdate?.Approver?.map((item: any) => item.Id)
            setApprover(Approvers)
            setUserTeam(memberToUpdate?.Team)
        }
    }, [memberToUpdate]);

    const handleApprovalTypeChange = (e: any) => {
        setSelectedApprovalType(e.target.value);
    };

    // Function to handle company selection
    const handleCompanyChange = (e: any) => {
        setSelectedCompany(e.target.value);
    };

    // Function to handle roles selection
    const handleRoleChange = (role: any) => {
        setSelectedRoles((prevSelectedRoles: any) =>
            prevSelectedRoles.includes(role)
                ? prevSelectedRoles.filter((r: any) => r !== role)
                : [...prevSelectedRoles, role]
        );
    };

    console.log(context)

    useEffect(() => {
        setData(TaskUsersListData);
        setGroupData(TaskGroupsListData);
    }, [TaskUsersListData, TaskGroupsListData]);

    const handleUpdateMemberClick = (item: any) => {
        setMemberToUpdate(item);
        setOpenUpdateMemberPopup(true);
        if (item.AssingedToUser) {
            setIsUserNameValid(true)
        }
    };

    const handleUpdateClick = (item: any) => {
        setItemToUpdate(item);
        setOpenUpdateGroupPopup(true);
    };

    const addTeamMember = async () => {
        let web = new Web(baseUrl);
        await web.lists.getById(TaskUserListId).items.add({
            Title: addTitle,
            ItemType: "User",
            Company: "Smalsus",
            IsActive: false,
            IsTaskNotifications: false,
        }).then((res: any) => {
            console.log(res);
            const newItem = res.data;
            setData((prevData: any) => [...prevData, newItem]);
            setTitle("");
            setAddTitle("");
            fetchAPIData()
            setAutoSuggestData(null)
            setOpenPopup(false);
        })
    }

    const addNewGroup = async () => {
        let web = new Web(baseUrl);
        await web.lists.getById(TaskUserListId).items.add({
            Title: title,
            Suffix: suffix,
            SortOrder: sortOrder,
            ItemType: "Group"
        }).then((res: any) => {
            console.log(res);
            const newItem = res.data;
            setGroupData(prevData => [...prevData, newItem]);
            setTitle("");
            setSuffix("");
            setSortOrder("");
            fetchAPIData()
            setOpenGroupPopup(false);
        })
    }

    const deleteTeamMember = async (items: any) => {
        let web = new Web(baseUrl);
        var deleteAlert = confirm("Are you sure you want to delete this?")
        if (deleteAlert) {
            await web.lists.getById(TaskUserListId).items.getById(items?.Id).recycle()
                .then(i => {
                    console.log(i);
                    setData((prevData: any) => prevData.filter((item: any) => item.Id !== items?.Id));
                    setGroupData(prevData => prevData.filter(item => item.Id !== items?.Id));
                    fetchAPIData()
                    setOpenUpdateMemberPopup(false)
                });
        }
    }

    const updateUser = async () => {
        let sortOrderValue = sortOrder !== undefined ? (sortOrder == "" ? sortOrder = null : sortOrder) : memberToUpdate.SortOrder
        // let sortOrderValue = sortOrder !== undefined ? sortOrder : memberToUpdate.SortOrder
        let web = new Web(baseUrl);
        if (memberToUpdate) {
            const updatedData = {
                Title: title ? title : memberToUpdate.Title,
                Suffix: suffix ? suffix : memberToUpdate.Suffix,
                SortOrder: sortOrderValue,
                IsActive: isActive,
                Company: selectedCompany,
                TimeCategory: userCategory ? userCategory : memberToUpdate.userCategory,
                IsApprovalMail: selectedApprovalType ? selectedApprovalType : memberToUpdate.IsApprovalMail,
                // SortOrder: (sortOrder !== undefined && sortOrder !== null) ? sortOrder : memberToUpdate.SortOrder,
                Role: { "results": selectedRoles },
                IsTaskNotifications: isTaskNotifications,
                AssingedToUserId:
                  assignedToUser != null ? assignedToUser?.Id: null,
                // ApproverId: Array.isArray(approver) && approver.every(item => typeof item === 'number' && item != null)
                //     ? { "results": approver } : (approver.length > 0 && approver[0] != null && approver[0].AssingedToUser?.Id != null) ? { "results": [approver[0].AssingedToUser.Id] } : { "results": [] },
                ApproverId: Array.isArray(approver) && approver.every(item => typeof item === 'number' && item != null)
                ? { "results": approver } : Array.isArray(approver) && approver.length > 0 ? { "results": approver?.map(app => app?.userId) } : { "results": [] },
                // ApproverId: Array.isArray(approver) && approver.length > 0 ? { "results": approver?.map(app => app?.AssingedToUser?.Id) } : { "results": [] },
                UserGroupId: userGroup ? parseInt(userGroup) : memberToUpdate?.UserGroup?.Id,
                Team: userTeam ? userTeam : memberToUpdate.Team,
                // Item_x0020_Cover: { "__metadata": { type: "SP.FieldUrlValue" }, Description: "Description", Url: imageUrl?.Item_x002d_Image != undefined ? imageUrl?.Item_x002d_Image?.Url : (imageUrl?.Item_x0020_Cover != undefined ? imageUrl?.Item_x0020_Cover?.Url : null) },
                // Item_x0020_Cover: { "__metadata": { type: "SP.FieldUrlValue" }, Description: "Description", Url: imageUrl?.Item_x0020_Cover != undefined ? imageUrl?.Item_x0020_Cover?.Url : memberToUpdate.Item_x0020_Cover.Url},
                Item_x0020_Cover: { "__metadata": { type: "SP.FieldUrlValue" }, Description: "Description", Url: imageUrl?.Item_x002d_Image?.Url || imageUrl?.Item_x0020_Cover?.Url || (memberToUpdate?.Item_x0020_Cover?.Url || null) },
                CategoriesItemsJson: JSON.stringify(selectedCategories),
            };

            await web.lists.getById(TaskUserListId).items.getById(memberToUpdate.Id).update(updatedData).then((res: any) => {
                console.log('Updated Data:', updatedData);

                // Update the data and groupData states
                const updatedMemberData = data.map((item: any) => {
                    if (item.Id === memberToUpdate.Id) {
                        return { ...item, ...updatedData };
                    }
                    return item;
                });

                setData(updatedMemberData);
                setSortOrder("")
                setMemberToUpdate({})
                setUserCategory("")
                setUserTeam("")
                setSelectedApprovalType('')
                setIsTaskNotifications(false)
                setSelectedCategories([])
                setImageUrl({})
                setTitle("")
                setSelectedRoles([])
                setApprover([])
                setUserGroup("")
                setSelectedCompany('')
                setIsActive(false)
                setAssignedToUser([])
                setSuffix("")
                setOpenUpdateMemberPopup(false);
                fetchAPIData()
            }).catch(error => {
                console.error("Error updating item: ", error);
            });
        }
    };

    const updateGroup = async () => {
        let web = new Web(baseUrl);
        if (itemToUpdate) {
            await web.lists.getById(TaskUserListId).items.getById(itemToUpdate.Id).update({
                Title: title ? title : itemToUpdate.Title,
                Suffix: suffix ? suffix : itemToUpdate.Suffix,
                SortOrder: sortOrder ? sortOrder : itemToUpdate.SortOrder,
            }).then((res: any) => {
                console.log(res);
                setGroupData(prevData => prevData.map(item => {
                    if (item.Id === itemToUpdate.Id) {
                        return {
                            ...item,
                            Title: title ? title : item.Title,
                            Suffix: suffix ? suffix : item.Suffix,
                            SortOrder: sortOrder ? sortOrder : item.SortOrder,
                        };
                    }
                    return item;
                }));
                fetchAPIData()
                setOpenUpdateGroupPopup(false);
            }).catch(error => {
                console.error("Error updating item: ", error);
            });
        }
    }

    // Table for User code

    const columns = React.useMemo<ColumnDef<any, unknown>[]>(
        () => [{
            accessorFn: '',
            canSort: false,
            placeholder: '',
            header: '',
            id: 'row.original',
            size: 10,
        },
        {
            accessorKey: 'Title',
            header: "",
            placeholder: "Search Name",
            id: "Title",
            cell: ({ row }: any) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img
                        className='me-1 workmember'
                        src={row.original.Item_x0020_Cover != null ? row.original?.Item_x0020_Cover?.Url : "https://hhhhteams.sharepoint.com/sites/HHHH/GmBH/SiteCollectionImages/ICONS/32/icon_user.jpg"}
                        alt="User"
                    // style={{ marginRight: '10px', width: '32px', height: '32px' }}
                    />
                    <span>{`${row.original.Title} (${row.original.Suffix})`}</span>
                </div>
            ),
            sortDescFirst: false
        },
        {
            accessorKey: "UserGroup.Title",
            header: "",
            id: "Group",
            placeholder: "Search Group"
        },
        {
            accessorKey: "TimeCategory",
            header: "",
            id: "Category",
            placeholder: "Search Category",
            size: 80,
        },
        {
            accessorKey: "SortOrder",
            header: "",
            id: "SortOrder",
            placeholder: "SortOrder",
            filterFn: (row: any, columnId: any, filterValue: any) => {
                return row?.original?.SortOrder == filterValue
            },
            size: 42,
        },
        {
            accessorKey: "RoleTitle",
            header: "",
            id: "RoleTitle",
            placeholder: "Roles"
        },
        {
            accessorKey: "Company",
            header: "",
            id: "Company",
            placeholder: "Company",
            size: 70,
        },
        {
            accessorFn: (row) => row?.ApproverTitle,
            header: "",
            id: 'ApproverTitle ',
            placeholder: "Approver"
        },
        {
            accessorKey: "Team",
            header: "",
            id: 'Team',
            placeholder: "Team",
            size: 75,
        },
        {
            id: "TaskId",
            accessorKey: "TaskId",
            header: null,
            size: 50,
            cell: (info) => (<div className='pull-right alignCenter'>
                <span onClick={() => handleUpdateMemberClick(info.row.original)} className='svg__iconbox svg__icon--edit' title='Edit'></span>
            </div>),
            enableColumnFilter: false,
            enableSorting: false,
        }
        ],
        [data]
    )

    // Table for Group code

    const columns2 = React.useMemo<ColumnDef<any, unknown>[]>(
        () => [
            {
                accessorKey: 'Title',
                id: "Title",
                header: "",
                placeholder: "Title",
                // sortDescFirst: false
            },
            {
                accessorKey: "SortOrder",
                header: "",
                placeholder: "SortOrder",
                id: "SortOrder",
                isColumnDefultSortingDesc: true,
                filterFn: (row: any, columnId: any, filterValue: any) => {
                    return row?.original?.SortOrder == filterValue
                },
            },
            {
                cell: (info) => (<div className='pull-right alignCenter'>
                    <span onClick={() => handleUpdateClick(info.row.original)} className='svg__iconbox svg__icon--edit' title='Edit'></span>
                    <span onClick={() => deleteTeamMember(info.row.original)} className='svg__iconbox svg__icon--trash' title='Trash'></span>
                </div>),
                id: "editIcon",
                canSort: false,
                placeholder: "",
                size: 30,
            }
        ],
        [groupData]
    )

    const userIdentifier = memberToUpdate?.AssingedToUser?.Name;
    const email = userIdentifier ? userIdentifier.split('|').pop() : '';

    const userIdentifiers = memberToUpdate?.Approver?.map((approver: any) => approver.Name) || [];
    const emails = userIdentifiers.map((identifier: any) => identifier.split('|').pop());

    const callBackData = React.useCallback((elem: any, ShowingData: any) => {

    }, []);

    const imageTabCallBack = React.useCallback((data: any) => {
        setEditData(data);
        console.log(EditData);
        console.log(data);
    }, []);
    const UpdateCallBackData = React.useCallback((data:any)=>{
        setMemberToUpdate(data);
    },[])
  const getUserInfo = async (userMail: string) => {
    const userEndPoint: any = `${context?.pageContext?.web?.absoluteUrl}/_api/Web/EnsureUser`;

    const userData: string = JSON.stringify({
      logonName: userMail,
    });

    const userReqData = {
      body: userData,
    };

    const resUserInfo = await context?.spHttpClient.post(
      userEndPoint,
      SPHttpClient.configurations.v1,
      userReqData
    );
    const userInfo = await resUserInfo.json();

    return userInfo;
  };

  const AssignedToUser = async (items: any[]) => {
    let userId: number = undefined;
    let userTitle: any;
    let userSuffix: string = undefined;
    if (items.length > 0) {
        let userMail = items[0].id.split("|")[2];
        let userInfo = await getUserInfo(userMail);
        userId = userInfo.Id;
        userTitle = userInfo.Title;
        userSuffix = userTitle
          .split(" ")
          .map((i: any) => i.charAt(0))
          .join("");
      setAssignedToUser(userInfo);
      setIsUserNameValid(true);
    } else {
      setAssignedToUser([]);
      setIsUserNameValid(false);
    }
  };

  const ApproverFunction = async (items: any[]) => {
    let userId: number = undefined;
    let userTitle: any;
    let userSuffix: string = undefined;
    let userMail: any
    let userInfo: any
    if (items.length > 0) {
        const approvers = await Promise.all(items.map(async (selectedusers) => {
            userMail = selectedusers?.id.split("|")[2];
            userInfo = await getUserInfo(userMail);
            userId = userInfo.Id;
            userTitle = userInfo.Title;
            userSuffix = userTitle
                .split(" ")
                .map((i: any) => i.charAt(0))
                .join("");
            
            return {
                userId: userId,
                userTitle: userTitle,
                userSuffix: userSuffix
            };
        }));
      setApprover(approvers);
    } else {
      setApprover([]);
    }
  };

    // Autosuggestion code

    const autoSuggestionsForTitle = (e: any) => {
        let SearchedKeyWord: any = e.target.value;
        let TempArray: any = [];
        if (SearchedKeyWord.length > 0) {
            if (data != undefined && data?.length > 0) {
                data.map((AllDataItem: any) => {
                    if (
                        AllDataItem?.Title?.toLowerCase()?.includes(
                            SearchedKeyWord.toLowerCase()
                        )
                    ) {
                        TempArray.push(AllDataItem);
                    }
                });
            }
            if (TempArray != undefined && TempArray.length > 0) {
                setAutoSuggestData(TempArray);
            }
        } else {
            setAutoSuggestData([]);
        }
    };

    // Approval type column - Approve Selected code starts here

    const buildHierarchy = (categories: any) => {
        const rootCategories = categories.filter((c: any) => c.ParentID === 0);
        const findChildren = (parent: any) => {
            const children = categories.filter((c: any) => c.ParentID === parent.ID);
            if (children.length > 0) {
                parent.children = children.map((child: any) => findChildren(child));
            }
            return parent;
        };
        return rootCategories.map((rootCategory: any) => findChildren(rootCategory));
    };

    useEffect(() => {
        buildHierarchy(TaxTypeCategories);
    }, [TaxTypeCategories])

    // Headers for Panel customisation code

    const onRenderCustomHeaderUpdateUser = () => {
        return (
            <>
                <div className='siteColor subheading'> Task-User Management - {memberToUpdate?.Title} </div>
                <Tooltip ComponentId='1767' />
            </>
        );
    };

    const onRenderCustomHeaderUpdateGroup = () => {
        return (
            <>
                <div className='siteColor subheading'> Update Group </div>
                <Tooltip ComponentId='1768' />
            </>
        );
    };

    const onRenderCustomHeaderAddGroup = () => {
        return (
            <>
                <div className='siteColor subheading'> Add Group </div>
                <Tooltip ComponentId='1757' />
            </>
        );
    };

    const onRenderCustomHeaderAddUser = () => {
        return (
            <>
                <div className='siteColor subheading'> Add User </div>
                <Tooltip ComponentId='1757' />
            </>
        );
    };

    const cancelAdd = () => {
        setAddTitle("")
        setAutoSuggestData(null)
        setOpenPopup(false)
    }

    const cancelUpdate = () => {
        setSelectedApprovalType(memberToUpdate.IsApprovalMail);
        setSelectedCompany(memberToUpdate.Company);
        setSelectedRoles(Array.isArray(memberToUpdate.Role) ? memberToUpdate.Role : []);
        setIsActive(memberToUpdate.IsActive);
        setIsTaskNotifications(memberToUpdate.IsTaskNotifications);
        setUserCategory(memberToUpdate.TimeCategory)
        setSelectedCategories(JSON.parse(memberToUpdate.CategoriesItemsJson))
        const Approvers: any = memberToUpdate?.Approver?.map((item: any) => item.Id)
        setApprover([Approvers])
        setUserTeam(memberToUpdate.Team)
        setOpenUpdateMemberPopup(false)
        setImageUrl({})
    }

    const findCategoryById = (categories: any, id: any): any => {
        for (const category of categories) {
            if (category.Id.toString() === id) {
                return category;
            }
            if (category.children) {
                const result = findCategoryById(category.children, id);
                if (result) {
                    return result;
                }
            }
        }
        return null;
    };

    const handleCheck = (checked: any) => {
        setChecked(checked);
        const selected = checked.map((id: any) => {
            const category = findCategoryById(MyCategories, id);
            return category ? { Title: category.Title, Id: category.Id } : null;
        }).filter((cat: any) => cat !== null);
        setSelectedCategories(selected);
    };

    const transformCategoriesToNodes = (categories: any) => {
        return categories.map((category: any) => {
            // Check if the category has children
            const hasChildren = category.children && category.children.length > 0;
            const node: any = {
                value: category.Id.toString(),
                label: category.Title,
            };
            // Conditionally add the 'children' property if the category has children
            if (hasChildren) {
                node.children = transformCategoriesToNodes(category.children);
            }
            return node;
        });
    };

    const icons: any = {
        check: <FaCheckSquare />,
        uncheck: <span className="alignIcon svg__iconbox svg__icon--sqCheckbox" />,
        halfCheck: <span className="alignIcon svg__iconbox svg__icon--dotCheckbox" />,
        expandClose: <span className="alignIcon svg__iconbox svg__icon--arrowRight" />,
        expandOpen: <span className='alignIcon svg__iconbox svg__icon--arrowDown' />,
        parentClose: <span className='alignIcon svg__iconbox svg__icon--arrowRight' />,
        parentOpen: <span className='alignIcon svg__iconbox svg__icon--arrowDown' />,
        leaf: null
    };


    // JSX Code starts here

    return (
        <>
            <ul className="fixed-Header nav nav-tabs" id="myTab" role="tablist">
                <button className="nav-link active" id="TEAM-MEMBERS" data-bs-toggle="tab" data-bs-target="#TEAMMEMBERS"
                    type="button"
                    role="tab"
                    aria-controls="TEAMMEMBERS"
                    aria-selected="true"
                >
                    TEAM MEMBERS
                </button>
                <button className="nav-link" id="TEAM-GROUPS" data-bs-toggle="tab" data-bs-target="#TEAMGROUPS"
                    type="button"
                    role="tab"
                    aria-controls="TEAMGROUPS"
                    aria-selected="true"
                >
                    TEAM GROUPS
                </button>
            </ul >

            <div className="border border-top-0 clearfix p-1 tab-content" id="myTabContent">
                {/* <div className="tab-pane fade show active" id="team-members" role="tabpanel" aria-labelledby="teammemberstab"> */}
                <div className="tab-pane show active" id="TEAMMEMBERS" role="tabpanel" aria-labelledby="TEAMMEMBERS">
                    <div className='Alltable'>
                        <div className='tbl-button'>
                            <button type='button' className='btn btn-primary position-relative' style={{ zIndex: "99" }} onClick={() => setOpenPopup(true)}>Add Team Member</button>
                        </div>
                        <GlobalCommanTable columns={columns} data={data} callBackData={callBackData} showHeader={true} hideOpenNewTableIcon={true} hideTeamIcon={true}/>
                    </div>
                </div>
                <div className="tab-pane" id="TEAMGROUPS" role="tabpanel" aria-labelledby="TEAMGROUPS">

                    <div className='Alltable'>

                        <div className='tbl-button'>
                            <button type='button' className='btn btn-primary position-relative' style={{ zIndex: "99" }} onClick={() => setOpenGroupPopup(true)}>Add Team Group</button>
                        </div>
                        <GlobalCommanTable columns={columns2} data={groupData} callBackData={callBackData} showHeader={true} hideOpenNewTableIcon={true} hideTeamIcon={true}/>
                    </div>
                </div>
            </div>

            <Panel
                onRenderHeader={onRenderCustomHeaderAddUser}
                isOpen={openPopup}
                onDismiss={cancelAdd}
                isFooterAtBottom={true}
                isBlocking={!openPopup}
            >
                <div className="modal-body">
                    <div className='input-group'>
                        <label className='form-label full-width'>User Name: </label>
                        <input className='form-control' type="text" placeholder='Enter Title' value={addTitle} onChange={(e: any) => { setAddTitle(e.target.value); autoSuggestionsForTitle(e) }} />
                    </div>
                    {autoSuggestData?.length > 0 ? (
                        <div>
                            <ul className="list-group">
                                {autoSuggestData?.map((Item: any) => {
                                    return (
                                        <li
                                            className="hreflink list-group-item rounded-0 list-group-item-action"
                                            key={Item.id}
                                        >
                                            <a>{Item.Title}</a>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ) : null}
                </div>

                <footer className='modal-footer mt-2'>
                    <button type='button' className='btn me-2 btn-primary' onClick={() => addTeamMember()}>Save</button>
                    <button type='button' className='btn btn-default' onClick={cancelAdd}>Cancel</button>
                </footer>

            </Panel>
            <Panel
                onRenderHeader={onRenderCustomHeaderAddGroup}
                isOpen={openGroupPopup}
                onDismiss={() => setOpenGroupPopup(false)}
                isFooterAtBottom={true}
                isBlocking={!openGroupPopup}
            >
                <div className="modal-body">
                    <div className='input-group'>
                        <label className='form-label full-width'>Title: </label>
                        <input className='form-control' type="text" value={title} onChange={(e: any) => setTitle(e.target.value)} />
                    </div>
                    <div className='input-group my-2'>
                        <label className='form-label full-width'>Suffix: </label>
                        <input className='form-control' type="text" value={suffix} onChange={(e: any) => setSuffix(e.target.value)} />
                    </div>
                    <div className='input-group'>
                        <label className='form-label full-width'>Sort Order: </label>
                        <input className='form-control' type="text" value={sortOrder} onChange={(e: any) => setSortOrder(e.target.value)} />
                    </div>
                </div>
                <footer className='modal-footer mt-2'>
                    <button type='button' className='btn me-2 btn-primary' onClick={() => addNewGroup()}>Save</button>
                    <button type='button' className='btn btn-default' onClick={() => setOpenGroupPopup(false)}>Cancel</button>
                </footer>
            </Panel>
            <Panel
                onRenderHeader={onRenderCustomHeaderUpdateGroup}
                isOpen={openUpdateGroupPopup}
                onDismiss={() => setOpenUpdateGroupPopup(false)}
                isFooterAtBottom={true}
                isBlocking={!openUpdateGroupPopup}
            >
                <div className='modal-body'>
                    <div className="add-datapanel">
                        <div className='input-group'>
                            <label className='form-label full-width fw-semibold'>Title: </label>
                            <input className='form-control' type="text" defaultValue={itemToUpdate?.Title} onChange={(e: any) => setTitle(e.target.value)} />
                        </div>
                        <div className='input-group'>
                            <label className='form-label full-width fw-semibold'>Suffix: </label>
                            <input className='form-control' type="text" defaultValue={itemToUpdate?.Suffix} onChange={(e: any) => setSuffix(e.target.value)} />
                        </div>
                        <div className='input-group'>
                            <label className='form-label full-width fw-semibold'>Sort Order: </label>
                            <input className='form-control' type="text" defaultValue={itemToUpdate?.SortOrder} onChange={(e: any) => setSortOrder(e.target.value)} />
                        </div>
                    </div>
                </div>
                <footer className='modal-footer mt-2'>
                    <button type='button' onClick={() => updateGroup()} className='btn me-2 btn-primary'>Update</button>
                    <button type='button' onClick={() => setOpenUpdateGroupPopup(false)} className='btn btn-default'>Cancel</button>
                </footer>
            </Panel>
            <Panel
                onRenderHeader={onRenderCustomHeaderUpdateUser}
                type={PanelType.large}
                isOpen={openUpdateMemberPopup}
                onDismiss={cancelUpdate}
                isFooterAtBottom={true}
                isBlocking={!openUpdateMemberPopup}
            >
                <div className='modal-body mb-5'>
                    <ul className="nav nav-tabs" id="myTab" role="tablist">
                        <li className="nav-item" role="presentation">
                            <button className="nav-link active" id="basic-info-tab" data-bs-toggle="tab" data-bs-target="#basicInfo" type="button" role="tab" aria-controls="basicInfo" aria-selected="true">
                                Basic Information
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button className="nav-link" id="image-info-tab" data-bs-toggle="tab" data-bs-target="#imageInfo" type="button" role="tab" aria-controls="imageInfo" aria-selected="false">
                                Image Information
                            </button>
                        </li>
                    </ul>

                    <div className="tab-content p-3 task-user-mangement" id="myTabContent">
                        {/* Basic Information Tab */}
                        <div
                            className="tab-pane fade show active"
                            id="basicInfo"
                            role="tabpanel"
                            aria-labelledby="basic-info-tab"
                        >
                            <Row className='mb-2'>
                                <Col md={2} sm={2}>
                                    <div className='input-group'>
                                        <label className='form-label full-width fw-semibold'>Title: </label>
                                        <input className='form-control' type="text" defaultValue={memberToUpdate?.Title} onChange={(e: any) => setTitle(e.target.value)} />
                                    </div>
                                </Col>

                                <Col md={1} sm={1}>
                                    <div className='input-group'>
                                        <label className='form-label full-width fw-semibold'>Suffix: </label>
                                        <input className='form-control' type="text" defaultValue={memberToUpdate?.Suffix} onChange={(e: any) => setSuffix(e.target.value)} />
                                    </div>
                                </Col>
                        
                                <Col md={3} className='px-1'>
                                    <div className='input-group'>
                                        <label className='form-label full-width fw-semibold'>Group: </label>
                                        <select className='full-width' id="sites" defaultValue={memberToUpdate?.UserGroup?.Id} onChange={(e: any) => setUserGroup(e.target.value)}>
                                            <option>Select</option>
                                            {TaskGroupsListData.map((elem: any) => <option value={elem?.Id}>{elem?.Title}</option>)}
                                        </select>
                                    </div>
                                </Col>
                                <Col md={1} sm={1}>
                                    <div className='input-group'>
                                        <label className='form-label full-width fw-semibold'>Sort Order: </label>
                                        <input className='form-control' type="text" defaultValue={memberToUpdate?.SortOrder} onChange={(e: any) => setSortOrder(e.target.value)} />
                                    </div>
                                </Col>

                                <Col md={3} sm={3} className=' px-1'>
                                    <div className='input-group'>
                                        <label className='form-label full-width fw-semibold'>Manage Categories: </label>
                                        <select className='full-width' id="sites" defaultValue={memberToUpdate?.TimeCategory} onChange={(e: any) => setUserCategory(e.target.value)}>
                                            <option>Select</option>
                                            {uniqueCategories.map((elem: any) => <option value={elem.Title}>{elem.Title}</option>)}
                                        </select>
                                    </div></Col>
                                    <Col md={2} sm={2}>
                                    <div className='input-group'>
                                        <label className='form-label full-width fw-semibold'>Team: </label>
                                        <select className='full-width' id="sites" defaultValue={memberToUpdate?.Team} onChange={(e: any) => setUserTeam(e.target.value)}
                                        >

                                            <option>Select</option>
                                            <option value="Management">Management</option>
                                            <option value="SPFX">SPFX</option>
                                            <option value="Shareweb">Shareweb</option>
                                            <option value="Mobile">Mobile</option>
                                            <option value="QA">QA</option>
                                            <option value="Design">Design</option>
                                            <option value="HR">HR</option>
                                            <option value="Junior Task Management">Junior Task Management</option>
                                            
                                        </select>
                                    </div>
                                </Col>
                                <Row className='mt-2'>
                                <Col md={3} className='pe-0 ps-1'>
                                    <div className='input-group class-input'>
                                        <label className='form-label full-width fw-semibold'>User Name:</label>
                                        <div className="w-100">
                                        <PeoplePicker  context={context} titleText="" personSelectionLimit={1} showHiddenInUI={false}
                                            principalTypes={[PrincipalType.User]} resolveDelay={1000} onChange={(items) => AssignedToUser(items)}
                                            defaultSelectedUsers={email ? [email] : []} />
                                        </div>
                                    </div>
                                </Col>
                                <Col className='ps-2' style={{width:"40%;"}}>
                                    <div className='input-group class-input'>
                                        <label className='form-label full-width fw-semibold'>Approver:</label>
                                        <div>
                                        <PeoplePicker context={context} titleText="" 
                                            personSelectionLimit={4} showHiddenInUI={false} principalTypes=
                                            {[PrincipalType.User]} resolveDelay={1000} onChange={(items) => ApproverFunction(items)}
                                            defaultSelectedUsers={emails.length > 0 ? emails : []} />
                                            </div>
                                    </div>
                                </Col>
                                </Row>
                            </Row>

                            <Row className='mb-2'>
                                <Col md={2}>
                                    <div className='input-group'>
                                        <label className='form-label full-width fw-semibold'>Company: </label>
                                        <Col>
                                            <div className='mb-1'>
                                                <label className='SpfxCheckRadio'>
                                                    <input className='radio' type="radio" id="HHHH" name="company" value="HHHH" checked={selectedCompany === 'HHHH'} onChange={handleCompanyChange} />
                                                    HHHH Team</label>
                                            </div>
                                            <div className='mb-1'>
                                                <label className='SpfxCheckRadio'>
                                                    <input className='radio' type="radio" id="Smalsus" name="company" value="Smalsus" checked={selectedCompany === 'Smalsus'} onChange={handleCompanyChange} />
                                                    Smalsus Team</label>
                                            </div>
                                        </Col>
                                    </div>
                                </Col>
                                <Col md={4} className='px-1'>
                                    <div className='input-group'>
                                        <label className='form-label full-width fw-semibold'>Roles: </label>
                                        <Row>
                                            <Col className='px-0'>
                                                {['Component Teams', 'Service Teams'].map((role: any) => (
                                                    <React.Fragment key={role}>
                                                        <label className='SpfxCheckRadio mb-1' htmlFor={`role-${role}`}>
                                                            <input type="checkbox" className='form-check-input me-1' id={`role-${role}`} name="roles" value={role} checked={selectedRoles?.includes(role)}
                                                                onChange={() => handleRoleChange(role)}
                                                            />
                                                            {role}</label>
                                                    </React.Fragment>
                                                ))}
                                            </Col>
                                            <Col>
                                                <div>
                                                    <label className='SpfxCheckRadio mb-1'>
                                                        <input type="checkbox" className='form-check-input me-1' id="IsActive" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                                                        Active User</label>
                                                </div>
                                                <div>
                                                    <label className='SpfxCheckRadio'>
                                                        <input type="checkbox" className='form-check-input me-1' id="IsTaskNotifications" checked={isTaskNotifications} onChange={(e) => setIsTaskNotifications(e.target.checked)} />
                                                        Task Notifications</label>
                                                </div>

                                            </Col>

                                        </Row>

                                    </div>
                                </Col>

                            </Row>
                            <Row>
                                <label className='form-label full-width fw-semibold'>Approval Type: </label>
                                <Row>
                                    <div className='mb-1'>
                                        <label className='SpfxCheckRadio' htmlFor="approveAll">
                                            <input type="radio" id="Approve All" className='radio' name="approvalType" value="Approve All" checked={selectedApprovalType === 'Approve All'} onChange={handleApprovalTypeChange} />
                                            Approve All</label>
                                    </div>
                                    <div className='mb-1'>
                                        <label className='SpfxCheckRadio' htmlFor="caseByCase">
                                            <input type="radio" id="Decide Case By Case" className='radio' name="approvalType" value="Decide Case By Case" checked={selectedApprovalType === 'Decide Case By Case'} onChange={handleApprovalTypeChange} />
                                            Case by Case</label>

                                    </div>
                                    <Row className='mb-2'>
                                        <label className='SpfxCheckRadio' htmlFor="approveSelected">
                                            <input type="radio" id="Approve Selected" className='radio' name="approvalType" value="Approve Selected" checked={selectedApprovalType === 'Approve Selected'} onChange={handleApprovalTypeChange} />
                                            Approve Selected</label>
                                        {selectedApprovalType === "Approve Selected" ?
                                            <>
                                                <div className="approvelSelected">
                                                    <CheckboxTree
                                                        nodes={transformCategoriesToNodes(MyCategories)}
                                                        checked={checked}
                                                        expanded={expanded}
                                                        onCheck={handleCheck}
                                                        onExpand={setExpanded}
                                                        icons={icons}
                                                        showNodeIcon={false}
                                                        showExpandAll={false}
                                                    />
                                                </div>
                                            </>
                                            : ""}
                                    </Row>

                                </Row>
                            </Row>
                        </div>

                        {/* Image Information Tab */}
                        <div
                            className="tab-pane fade"
                            id="imageInfo"
                            role="tabpanel"
                            aria-labelledby="image-info-tab"
                        >
                            <div>
                                <ImagesC
                                    EditdocumentsData={imageUrl}
                                    setData={setImageUrl}
                                    AllListId={TaskUserListId}
                                    Context={context}
                                    callBack={imageTabCallBack}
                                    setToUpdate={memberToUpdate}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <footer
                    className="bg-f4 fixed-bottom"
                    style={{ position: "absolute" }}>
                    <div className="align-items-center d-flex justify-content-between px-4 py-2">
                        <div>
                            <div className="text-left">
                                Created{" "}
                                <span ng-bind="memberToUpdate?.Created | date:'MM-DD-YYYY'">
                                    {" "}
                                    {memberToUpdate?.Created ? moment(memberToUpdate?.Created).format("DD/MM/YYYY") : ""}
                                </span>{" "}
                                by
                                <span className="panel-title ps-1">
                                    {memberToUpdate?.Author?.Title != undefined
                                        ? memberToUpdate?.Author?.Title
                                        : ""}
                                </span>
                            </div>
                            <div className="text-left">
                                Last modified{" "}
                                <span>
                                    {memberToUpdate?.Modified ? moment(memberToUpdate?.Modified).format("DD/MM/YYYY") : ''}
                                </span>{" "}
                                by{" "}
                                <span className="panel-title">
                                    {memberToUpdate?.Editor?.Title != undefined
                                        ? memberToUpdate?.Editor.Title
                                        : ""}
                                </span>
                            </div>
                            <div className="text-left">
                                <a onClick={() => deleteTeamMember(memberToUpdate)}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        viewBox="0 0 48 48"
                                        fill="none"
                                    >
                                        <path
                                            fill-rule="evenodd"
                                            clip-rule="evenodd"
                                            d="M19.3584 5.28375C18.4262 5.83254 18.1984 6.45859 18.1891 8.49582L18.1837 9.66172H13.5918H9V10.8591V12.0565H10.1612H11.3225L11.3551 26.3309L11.3878 40.6052L11.6525 41.1094C11.9859 41.7441 12.5764 42.3203 13.2857 42.7028L13.8367 43H23.9388C33.9989 43 34.0431 42.9989 34.6068 42.7306C35.478 42.316 36.1367 41.6314 36.4233 40.8428C36.6697 40.1649 36.6735 39.944 36.6735 26.1055V12.0565H37.8367H39V10.8591V9.66172H34.4082H29.8163L29.8134 8.49582C29.8118 7.85452 29.7618 7.11427 29.7024 6.85084C29.5542 6.19302 29.1114 5.56596 28.5773 5.2569C28.1503 5.00999 27.9409 4.99826 23.9833 5.00015C19.9184 5.0023 19.8273 5.00784 19.3584 5.28375ZM27.4898 8.46431V9.66172H24H20.5102V8.46431V7.26691H24H27.4898V8.46431ZM34.4409 25.9527C34.4055 40.9816 34.4409 40.2167 33.7662 40.5332C33.3348 40.7355 14.6335 40.7206 14.2007 40.5176C13.4996 40.1889 13.5306 40.8675 13.5306 25.8645V12.0565H24.0021H34.4736L34.4409 25.9527ZM18.1837 26.3624V35.8786H19.3469H20.5102V26.3624V16.8461H19.3469H18.1837V26.3624ZM22.8367 26.3624V35.8786H24H25.1633V26.3624V16.8461H24H22.8367V26.3624ZM27.4898 26.3624V35.8786H28.6531H29.8163V26.3624V16.8461H28.6531H27.4898V26.3624Z"
                                            fill="#333333"
                                        />
                                    </svg>{" "}
                                    Delete This Item
                                </a>
                                <span>
                                    {" "}
                                    {memberToUpdate?.ID ? (
                                        <VersionHistoryPopup
                                            taskId={memberToUpdate?.ID}
                                            listId={TaskUserListId}
                                            siteUrls={baseUrl}
                                            RequiredListIds={AllListid}
                                        />
                                    ) : (
                                        ""
                                    )}
                                </span>
                            </div>
                        </div>
                        <div>
                            <div className="footer-right">
                                <a
                                    className="p-1"
                                    href={`${baseUrl}/Lists/Task%20Users/DispForm.aspx?ID=${memberToUpdate?.Id}`}
                                    target="_blank"
                                    data-interception="off"
                                >
                                    Open Out-of-The-Box Form
                                </a>
                                <button
                                    type="button"
                                    className="btn btn-primary ms-2 px-4"
                                    onClick={() => updateUser()}
                                    disabled={!isUserNameValid}
                                >
                                    Save
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-default btn-default ms-1"
                                    onClick={cancelUpdate}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </footer>
            </Panel >
        </>
    )
}

export default TaskUserManagementTable;

