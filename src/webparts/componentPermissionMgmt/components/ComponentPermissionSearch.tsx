import React from 'react'
import * as globalCommon from '../../../globalComponents/globalCommon'
import { Web } from "sp-pnp-js";
import GlobalCommanTable from '../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable'
import { ColumnDef } from '@tanstack/react-table';
import PageLoader from "../../../globalComponents/pageLoader";
import moment from 'moment';
import ContentPermissionPopup from './ContentPermissionPopup';

export const ComponentPermissionSearch = (props: any) => {
    const [AllPermission, setAllPermission] = React.useState([]);
    const [loaderActive, setLoaderActive] = React.useState(false);
    const [isPopupOpen, setIsPopupOpen] = React.useState(false);
    const [selectedEditItem, setSelectedEditItem]: any = React.useState({});
    const [selectedItems, setSelectedItems] = React.useState([]);
    var AllListId = props.props
    // AllListId.siteUrl = SiteURL;
    const PageContext = AllListId;
    var AllTaskUser: any = []


    React.useEffect(() => {
        LoadAllPermission()
        loadAllTaskUsers()
    }, [])
    const LoadAllPermission = async () => {
        let pageInfo = await globalCommon.pageContext()
        let permission = false;
        if (pageInfo?.WebFullUrl) {
            let web = new Web(pageInfo.WebFullUrl);

            web.lists.getByTitle('ComponentPermissions').items.select('Id,ID,Modified,Created,Title,Author/Id,Author/Title,Editor/Id,Editor/Title,AllowedUsers/Id,AllowedUsers/Title').expand('Author,Editor,AllowedUsers').get().then((result: any) => {
                result?.map((data: any) => {
                    data.DisplayModifiedDate = data.Modified != null
                        ? moment(data.Modified).format("DD/MM/YYYY")
                        : "";
                    if (data.DisplayModifiedDate == "Invalid date" || "") {
                        data.DisplayModifiedDate = data.DisplayModifiedDate.replaceAll("Invalid date", "");
                    }
                    data.DisplayCreatedDate =
                        data.Created != null
                            ? moment(data.Created).format("DD/MM/YYYY")
                            : "";

                    if (data.DisplayCreatedDate == "Invalid date" || "") {
                        data.DisplayCreatedDate = data.DisplayCreatedDate.replaceAll("Invalid date", "");
                    }
                    data.showUsers = data?.AllowedUsers?.map((elem: any) => elem.Title).join(",")

                    AllTaskUser?.map((user: any) => {
                        if (user?.AssingedToUserId == data?.Author?.Id) {
                            data.createdImg = user?.Item_x0020_Cover?.Url;
                        }
                        if (user?.AssingedToUser?.Id == data?.Editor?.Id) {
                            data.modifiedImg = user?.Item_x0020_Cover?.Url;
                        }

                    });
                })
                setAllPermission(result)
            })

        }
        return permission;
    }


    const loadAllTaskUsers = async () => {

        try {
            let web = new Web(AllListId?.siteUrl);
            await web.lists
                .getById(AllListId?.TaskUserListID)
                .items
                .select("Id,UserGroupId,Suffix,Title,Email,SortOrder,Role,Company,ParentID1,Status,Item_x0020_Cover,AssingedToUserId,isDeleted,AssingedToUser/Title,AssingedToUser/Id,AssingedToUser/EMail,ItemType,Approver/Id,Approver/Title,Approver/Name,UserGroup/Id,UserGroup/Title,TeamLeader/Id,TeamLeader/Title&$expand=UserGroup,AssingedToUser,Approver,TeamLeader").get()
                .then((taskuser: any) => {
                    AllTaskUser = taskuser
                    LoadAllPermission();
                }).catch((error: any) => {
                    console.log(error)
                });
        }
        catch (error) {
            return Promise.reject(error);
        }
    
    }
   
    const columns = React.useMemo<ColumnDef<any, unknown>[]>(
        () => [
            {
                accessorKey: "",
                placeholder: "",
                hasCheckbox: true,
                hasCustomExpanded: false,
                hasExpanded: false,
                isHeaderNotAvlable: true,
                size: 25,
                id: 'Id',
            },
            {
                accessorKey: "Title",
                placeholder: "Permission Name",
                header: "",
                id: "Title",
                size: 115,
            },
            {
                accessorKey: "showUsers",
                placeholder: "Allowed Users/Groups",
                header: "",
                id: "showUsers",
                size: 115,
            },

            {
                accessorKey: "Modified",
                placeholder: "Modified",
                header: "",
                id: "DisplayModifiedDate",
                size: 115,
                cell: ({ row }) => (
                    <span>
                        {row?.original?.DisplayModifiedDate}
                        {row?.original?.Modified == null ? (
                            ""
                        ) : (
                            <>
                                {row?.original?.Editor != undefined ? (
                                    <>
                                        <a
                                            href={`${AllListId?.siteUrl}/SitePages/TaskDashboard.aspx?UserId=${row?.original?.Editor?.Id}&Name=${row?.original?.Editor?.Title}`}
                                            target="_blank"
                                            data-interception="off"
                                        >{row?.original?.modifiedImg != undefined ?
                                            <img title={row?.original?.Editor?.Title} className="workmember ms-1" src={row?.original?.modifiedImg} /> :
                                            <span className='svg__iconbox svg__icon--defaultUser grey' title={row?.original?.Editor?.Title}></span>
                                            }

                                        </a>
                                    </>
                                ) : (
                                    <span className='svg__iconbox svg__icon--defaultUser grey' title={row?.original?.Editor?.Title}></span>
                                )}
                            </>
                        )}
                    </span>
                ),
                filterFn: (row: any, columnId: any, filterValue: any) => row?.original?.DisplayModifiedDate?.includes(filterValue),

            },
            {
                accessorKey: "Created",
                placeholder: "Created",
                header: "",
                id: "DisplayCreatedDate",
                size: 115,
                cell: ({ row }) => (
                    <span>
                        {row?.original?.DisplayCreatedDate}
                        {row?.original?.Created == null ? (
                            ""
                        ) : (
                            <>
                                {row?.original?.Author != undefined ? (
                                    <>
                                        <a
                                            href={`${AllListId?.siteUrl}/SitePages/TaskDashboard.aspx?UserId=${row?.original?.Author?.Id}&Name=${row?.original?.Author?.Title}`}
                                            target="_blank"
                                            data-interception="off"
                                        >{row?.original?.createdImg != undefined ?
                                            <img title={row?.original?.Author?.Title} className="workmember ms-1" src={row?.original?.createdImg} /> :
                                            <span className='svg__iconbox svg__icon--defaultUser grey' title={row?.original?.Author?.Title}></span>
                                            }

                                        </a>
                                    </>
                                ) : (
                                    <span className='svg__iconbox svg__icon--defaultUser grey' title={row?.original?.Author?.Title}></span>
                                )}
                            </>
                        )}
                    </span>
                ),
                filterFn: (row: any, columnId: any, filterValue: any) => row?.original?.DisplayCreatedDate?.includes(filterValue),
            },
            {
                accessorKey: "",
                placeholder: "",
                header: "",
                id: "Edit",
                size: 5,
                cell: ({ row }: any) => (
                    <>
                        <span title="Edit Permission" className="svg__iconbox svg__icon--edit" onClick={() => { setSelectedEditItem(row?.original); setIsPopupOpen(true) }}></span>
                    </>
                ),
            },
        ],
        [AllPermission] // Include any dependencies here
    );


    const callBackData = (data: any) => {
        if (data != undefined) {
            setSelectedItems(data)
        } else {
        }
    }
    const PopupCallBack = (type: any, data?: any | undefined) => {
        setIsPopupOpen(false)
        setSelectedEditItem({})
        if (type != undefined && (type == 'update' || type == 'add')) {
            LoadAllPermission();
        }
    }
    const customTableHeaderButtons = (
        <div>

            <button type="button" className="btn btn-primary" title="Add Permission" onClick={() => setIsPopupOpen(true)}>Add Permission</button>
        </div>
    )
    return (

        <div className="section">
            <h2 className="heading">Component-Permission-Management</h2>

            <div className="TableContentSection">
                <div className='Alltable mt-2 mb-2'>
                    <div className='col-md-12 p-0 '>
                        <GlobalCommanTable fixedWidthTable={true} columns={columns} multiSelect={true} customHeaderButtonAvailable={true} customTableHeaderButtons={customTableHeaderButtons} hideTeamIcon={true} hideOpenNewTableIcon={true} data={AllPermission} showHeader={true} callBackData={callBackData} />
                    </div>
                </div>
            </div>
            {isPopupOpen && <ContentPermissionPopup context={props?.props?.context} SelectedEditItem={selectedEditItem} callBack={PopupCallBack} />}
            {loaderActive && <PageLoader />}
        </div>
    )
}
