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
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import moment from 'moment';
import Tooltip from '../../../globalComponents/Tooltip';
import zIndex from '@material-ui/core/styles/zIndex';
import CheckboxTree from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import { FaChevronDown, FaChevronRight, FaMinusSquare, FaPlusSquare, FaSquare, FaCheckSquare } from 'react-icons/fa';
import "./styles.css"

const TaskUserManagementTable = ({ TaskUsersListData, TaskGroupsListData, baseUrl, TaskUserListId, context, fetchAPIData, smartMetaDataItems }: any) => {
    const [data, setData] = React.useState([]);
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
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
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
            setSelectedApprovalType(memberToUpdate.IsApprovalMail);
            setSelectedCompany(memberToUpdate.Company);
            // setSelectedRoles(memberToUpdate.Role || []);
            setSelectedRoles(Array.isArray(memberToUpdate.Role) ? memberToUpdate.Role : []);
            setIsActive(memberToUpdate.IsActive);
            setIsTaskNotifications(memberToUpdate.IsTaskNotifications);
            setUserCategory(memberToUpdate.TimeCategory)
            // setSelectedCategories(JSON.parse(memberToUpdate.CategoriesItemsJson))

            // Parse JSON and set selected categories
            const categoriesJson = JSON.parse(memberToUpdate?.CategoriesItemsJson);
            setSelectedCategories(categoriesJson);
            // Extract IDs and set them as checked
            const categoryIds = categoriesJson?.map((category: any) => category.Id.toString());
            setChecked(categoryIds);
            setAssignedToUser(memberToUpdate.AssingedToUser?.Id)
            setApprover([memberToUpdate.Approver?.[0]?.Id])
            setUserTeam(memberToUpdate.Team)
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

    const handleDeleteClick = (item: any) => {
        setItemToDelete(item);
        setShowConfirmationModal(true);
    };

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
            setData(prevData => [...prevData, newItem]);
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
            Title: addTitle,
            Suffix: suffix,
            SortOrder: sortOrder,
            ItemType: "Group"
        }).then((res: any) => {
            console.log(res);
            const newItem = res.data;
            setGroupData(prevData => [...prevData, newItem]);
            setAddTitle("");
            setSuffix("");
            setSortOrder("");
            fetchAPIData()
            setOpenGroupPopup(false);
        })
    }

    const deleteTeamMember = async () => {
        let web = new Web(baseUrl);
        if (itemToDelete) {
            await web.lists.getById(TaskUserListId).items.getById(itemToDelete.Id).recycle()
                .then(i => {
                    console.log(i);
                    setData(prevData => prevData.filter(item => item.Id !== itemToDelete.Id));
                    setGroupData(prevData => prevData.filter(item => item.Id !== itemToDelete.Id));
                    setItemToDelete(null);
                    fetchAPIData()
                    setOpenUpdateMemberPopup(false)
                    setShowConfirmationModal(false);
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
                AssingedToUserId: typeof assignedToUser === 'number' ? assignedToUser : (assignedToUser?.length > 0 ? assignedToUser[0]?.AssingedToUser?.Id : null),
                ApproverId: Array.isArray(approver) && approver.every(item => typeof item === 'number' && item != null)
                    ? { "results": approver } : (approver.length > 0 && approver[0] != null && approver[0].AssingedToUser?.Id != null) ? { "results": [approver[0].AssingedToUser.Id] } : { "results": [] },
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
                const updatedMemberData = data.map(item => {
                    if (item.Id === memberToUpdate.Id) {
                        return { ...item, ...updatedData };
                    }
                    return item;
                });

                setData(updatedMemberData);
                // Update memberToUpdate state if necessary
                setMemberToUpdate((prevState: any) => ({ ...prevState, ...updatedData }));

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
                            // AssingedToUserId: assignedToGroup.length > 0 ? assignedToGroup[0]?.Id : null,
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
                        src={row.original.Item_x0020_Cover?.Url || 'https://hhhhteams.sharepoint.com/sites/HHHH/GmBH/SiteCollectionImages/ICONS/32/icon_user.jpg'}
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
            accessorKey: "Role",
            header: "",
            id: "Role",
            placeholder: "Roles",
        },
        {
            accessorKey: "Company",
            header: "",
            id: "Company",
            placeholder: "Company",
            size: 70,
        },
        {
            accessorFn: (row) => row.Approver?.[0]?.Title || '',
            header: "",
            id: 'Approver',
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
                <span onClick={() => handleDeleteClick(info.row.original)} className='svg__iconbox svg__icon--trash' title='Trash'></span>
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
                sortDescFirst: false
            },
            {
                accessorKey: "SortOrder",
                header: "",
                placeholder: "SortOrder",
                filterFn: (row: any, columnId: any, filterValue: any) => {
                    return row?.original?.SortOrder == filterValue
                },
            },
            {
                accessorKey: "TaskId",
                header: null,
                Size: 50,
                cell: (info) => (<div className='pull-right alignCenter'>
                    <span onClick={() => handleUpdateClick(info.row.original)} className='svg__iconbox svg__icon--edit' title='Edit'></span>
                    <span onClick={() => handleDeleteClick(info.row.original)} className='svg__iconbox svg__icon--trash' title='Trash'></span>
                </div>),
                enableColumnFilter: false,
                enableSorting: false
                
            }
        ],
        [groupData]
    )

    const userIdentifier = memberToUpdate?.AssingedToUser?.Name;
    const email = userIdentifier ? userIdentifier.split('|').pop() : '';

    const userIdentifier2 = memberToUpdate?.Approver?.[0]?.Name;
    const email2 = userIdentifier2 ? userIdentifier2.split('|').pop() : '';

    const callBackData = React.useCallback((elem: any, ShowingData: any) => {

    }, []);

    const imageTabCallBack = React.useCallback((data: any) => {
        setEditData(data);
        console.log(EditData);
        console.log(data);
    }, []);

    const AssignedToUser = (item: any) => {
        if (item.length > 0) {
            const email = item.length > 0 ? item[0].loginName.split('|').pop() : null;
            const member = data.filter((elem: any) => elem.Email === email)
            setAssignedToUser(member)
            setIsUserNameValid(true);
        }
        else {
            setAssignedToUser([])
            setIsUserNameValid(false);
        }
    }

    const ApproverFunction = (item: any) => {
        if (item.length > 0) {
            const email = item.length > 0 ? item[0].loginName.split('|').pop() : null;
            const member = data.filter((elem: any) => elem.Email === email)
            setApprover(member)
        }
        else {
            setApprover([])
        }
    }

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
                // setSearchedProjectKey(SearchedKeyWord);
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
                <div className='siteColor subheading'> Task-User Management - {memberToUpdate.Title} </div>
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
        // setSelectedRoles(memberToUpdate.Role || []);
        setSelectedRoles(Array.isArray(memberToUpdate.Role) ? memberToUpdate.Role : []);
        setIsActive(memberToUpdate.IsActive);
        setIsTaskNotifications(memberToUpdate.IsTaskNotifications);
        setUserCategory(memberToUpdate.TimeCategory)
        setSelectedCategories(JSON.parse(memberToUpdate.CategoriesItemsJson))
        // setAssignedToUser(memberToUpdate.AssingedToUser?.Id)
        setApprover([memberToUpdate.Approver?.[0]?.Id])
        setUserTeam(memberToUpdate.Team)
        setOpenUpdateMemberPopup(false)
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

    // const renderRadios = (approvalCategory: any) => {
    //     console.log(approvalCategory)
    // }

    const transformCategoriesToNodes = (categories: any) => {
        return categories.map((category: any) => {
            // Check if the category has children
            const hasChildren = category.children && category.children.length > 0;
            const node:any = {
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

    // const transformCategoriesToNodes = (categories: any, ) => {
    //     return categories.map((category: any) => {
    //         // Skip the Approval category's children as they are rendered separately
    //         if (parentId === 'Approval') return null;

    //         const hasChildren = category.children && category.children.length > 0;
    //         const node = {
    //             value: category.Id.toString(),
    //             label: category.Title,
    //             children: hasChildren ? transformCategoriesToNodes(category.children, category.Title) : []
    //         };
    //         return node;
    //     }).filter(Boolean); // Remove any null entries
    // };
    
    
    


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
                        <GlobalCommanTable columns={columns} data={data} callBackData={callBackData} showHeader={true} />
                    </div>
                </div>
                <div className="tab-pane" id="TEAMGROUPS" role="tabpanel" aria-labelledby="TEAMGROUPS">

                    <div className='Alltable'>

                        <div className='tbl-button'>
                            <button type='button' className='btn btn-primary position-relative' style={{ zIndex: "99" }} onClick={() => setOpenGroupPopup(true)}>Add Team Group</button>
                        </div>
                        <GlobalCommanTable columns={columns2} data={groupData} callBackData={callBackData} showHeader={true} />
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
                                        // onClick={() => window.open(`${Item?.siteUrl}/SitePages/Project-Management.aspx?ProjectId=${Item?.Id}`, '_blank')}
                                        >
                                            <a>{Item.Title}</a>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ) : null}
                </div>

                {/* <input className='form-control' type="text" value={title} onChange={(e: any) => setTitle(e.target.value)} /> */}
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
                        <label className='form-label full-width'>User Name: </label>
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
                        <div className='input-group mb-1'>
                            <label className='form-label full-width fw-semibold'>Title: </label>
                            <input className='form-control' type="text" defaultValue={itemToUpdate?.Title} onChange={(e: any) => setTitle(e.target.value)} />
                        </div>
                        <div className='input-group mb-1'>
                            <label className='form-label full-width fw-semibold'>Suffix: </label>
                            <input className='form-control' type="text" defaultValue={itemToUpdate?.Suffix} onChange={(e: any) => setSuffix(e.target.value)} />
                        </div>
                        <div className='input-group mb-1'>
                            <label className='form-label full-width fw-semibold'>Sort Order: </label>
                            <input className='form-control' type="text" defaultValue={itemToUpdate?.SortOrder} onChange={(e: any) => setSortOrder(e.target.value)} />
                        </div>
                    </div>
                </div>
                <footer className='modal-footer mt-2'>
                    {/* <DefaultButton className="btn btn-primary mt-3 p-3 shadow"
                        onClick={() => updateGroup()}>Update</DefaultButton>
                    <DefaultButton className="btn btn-primary mt-3 p-3 shadow"
                        onClick={() => setOpenUpdateGroupPopup(false)}>Cancel</DefaultButton> */}
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

                    <div className="tab-content p-3" id="myTabContent">
                        {/* Basic Information Tab */}
                        <div
                            className="tab-pane fade show active"
                            id="basicInfo"
                            role="tabpanel"
                            aria-labelledby="basic-info-tab"
                        >
                            <div className="row mb-2">
                                <div className='col-2'>
                                    <div className='input-group'>
                                        <label className='form-label full-width fw-semibold'>Title: </label>
                                        <input className='form-control' type="text" defaultValue={memberToUpdate?.Title} onChange={(e: any) => setTitle(e.target.value)} />
                                    </div>
                                </div>

                                <div className='col p-0'>
                                    <div className='input-group'>
                                        <label className='form-label full-width fw-semibold'>Suffix: </label>
                                        <input className='form-control' type="text" defaultValue={memberToUpdate?.Suffix} onChange={(e: any) => setSuffix(e.target.value)} />
                                    </div></div>
                                <div className='col'>
                                    <div className='input-group'>
                                        <label className='form-label full-width fw-semibold'>User Name:</label>
                                        <PeoplePicker context={context} titleText="" personSelectionLimit={1} showHiddenInUI={false}
                                            principalTypes={[PrincipalType.User]} resolveDelay={1000} onChange={(items) => AssignedToUser(items)}
                                            defaultSelectedUsers={email ? [email] : []} />
                                    </div>
                                </div>
                                <div className='col p-0'>
                                    <div className='input-group'>
                                        <label className='form-label full-width fw-semibold'>Group: </label>
                                        <select className='form-control' id="sites" defaultValue={memberToUpdate?.UserGroup?.Id} onChange={(e: any) => setUserGroup(e.target.value)}>
                                            <option>Select</option>
                                            {TaskGroupsListData.map((elem: any) => <option value={elem?.Id}>{elem?.Title}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className='col'>
                                    <div className='input-group'>
                                        <label className='form-label full-width fw-semibold'>Sort Order: </label>
                                        <input className='form-control' type="text" defaultValue={memberToUpdate?.SortOrder} onChange={(e: any) => setSortOrder(e.target.value)} />
                                    </div>
                                </div>

                                <div className='col p-0'>
                                    <div className='input-group'>
                                        <label className='form-label full-width fw-semibold'>Manage Categories: </label>
                                        <select className='full-width' id="sites" defaultValue={memberToUpdate?.TimeCategory} onChange={(e: any) => setUserCategory(e.target.value)}>
                                            <option>Select</option>
                                            {uniqueCategories.map((elem: any) => <option value={elem.Title}>{elem.Title}</option>)}
                                        </select>
                                    </div></div>
                                <div className='col'>
                                    <div className='input-group'>
                                        <label className='form-label full-width fw-semibold'>Approver:</label>
                                        <PeoplePicker context={context} titleText="" personSelectionLimit={1} showHiddenInUI={false} principalTypes=
                                            {[PrincipalType.User]} resolveDelay={1000} onChange={(items) => ApproverFunction(items)}
                                            defaultSelectedUsers={email2 ? [email2] : []} />
                                    </div></div>
                                <div className='col p-0'>
                                    <div className='input-group'>
                                        <label className='form-label full-width fw-semibold'>Team: </label>
                                        <select className='form-control' id="sites" defaultValue={memberToUpdate?.Team} onChange={(e: any) => setUserTeam(e.target.value)}
                                        >
                                            <option>Select</option>
                                            <option value="SPFx">SPFx</option>
                                            <option value="Project">Project</option>
                                            <option value="AnC">AnC</option>
                                            <option value="Contact">Contact</option>
                                            <option value="QA">QA</option>
                                            <option value="Design">Design</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="row mb-2">
                                <div className='col-2'>
                                    <div className='input-group'>
                                        <label className='form-label full-width fw-semibold'>Company: </label>
                                        <div className='col'>
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
                                        </div>
                                    </div></div>
                                <div className='col-md-4'>
                                    <div className='input-group'>
                                        <label className='form-label full-width fw-semibold'>Roles: </label>
                                        <div className='row'>
                                            <div className='col-5 px-0'>
                                                {['Component Teams', 'Service Teams', 'Component Creator', 'Component Editor', 'Task Creator'].map((role: any) => (
                                                    <React.Fragment key={role}>
                                                        <label className='SpfxCheckRadio mb-1' htmlFor={`role-${role}`}>
                                                            <input type="checkbox" className='form-check-input me-1' id={`role-${role}`} name="roles" value={role} checked={selectedRoles?.includes(role)}
                                                                onChange={() => handleRoleChange(role)}
                                                            />
                                                            {role}</label>
                                                    </React.Fragment>
                                                ))}
                                            </div>
                                            <div className='col'>
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

                                            </div>

                                        </div>

                                    </div>
                                </div>

                            </div>
                            <div className='row'>
                                <label className='form-label full-width fw-semibold'>Approval Type: </label>
                                <div className='row'>
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
                                    <div className='mb-1 row'>
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

                                                {/* <div className="categories-container">
                                                                {MyCategories?.map((parent: any) => (
                                                                    <div key={parent?.Id} className="parent-category">
                                                                        <div className="parent-title">{parent?.Title}</div>
                                                                        <div className="child-categories">
                                                                            {parent?.children?.map((child: any) => (
                                                                                <>
                                                                                    <div key={child?.Id} className="child-category">{child?.Title}</div>
                                                                                    <div className="child-categories">
                                                                                        {child?.children?.map((subChild: any) => (
                                                                                            <div key={subChild?.Id} className="child-category">{subChild?.Title}</div>
                                                                                        ))}
                                                                                    </div>
                                                                                </>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div> */}

                                                {/* <PrimaryButton text="Select Category" menuProps={{ items: menuItems }} styles={{ root: { display: 'block', width: '100%' } }} />
                                                        {(selectedCategories || []).map((category: any) => (
                                                            <div key={category.Id} className='alignCenter block'>
                                                                <span className='wid90'>{category.Title}</span>
                                                                <span className='svg__iconbox svg__icon--cross light hreflink'></span>
                                                            </div>
                                                        ))} */}
                                            </>
                                            : ""}
                                    </div>

                                </div>
                            </div>
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
                                <a onClick={() => handleDeleteClick(memberToUpdate)}>
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
                                // onClick={() => setOpenUpdateMemberPopup(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </footer>
            </Panel >
            <Modal
                show={showConfirmationModal}
                onHide={() => setShowConfirmationModal(false)}
                backdrop="static"
                keyboard={false} style={{ zIndex: "9999999" }}
            >
                <Modal.Header closeButton>
                    <Modal.Title className='subheading'>Warning</Modal.Title>
                </Modal.Header>
                <Modal.Body className='text-center p-2'>Are you sure you want to delete this?</Modal.Body>
                <Modal.Footer>
                    <button type='button' onClick={() => setShowConfirmationModal(false)} className='btn me-2 btn-primary'>
                        Cancel
                    </button>
                    <button type='button' onClick={deleteTeamMember} className='btn btn-default'>
                        Delete
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default TaskUserManagementTable;



// private onRenderCustomHeaderCreateNewUser = () => {
//     return (
//         <>

//             <div className='siteColor subheading'>
//                 Create New User
//             </div>
//             <Tooltip ComponentId='1757' />
//         </>
//     );
// };



{/* <div className="categories-container">
  {MyCategories.map((parent) => (
    <div key={parent.Id} className="parent-category">
      <div className="parent-title">{parent.Title}</div>
      <div className="child-categories">
        {parent.children.map((child) => (
          <div key={child.Id} className="child-category">{child.Title}</div>
        ))}
      </div>
    </div>
  ))}
</div> */}
