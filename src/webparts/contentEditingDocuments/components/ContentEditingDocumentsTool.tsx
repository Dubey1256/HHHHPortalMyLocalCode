import * as React from 'react';
import { useEffect } from 'react';
import { sp, Web } from "sp-pnp-js";
import GlobalCommanTable from '../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable';
import { ColumnDef } from '@tanstack/react-table';
import moment from 'moment';
import * as globalCommon from '../../../globalComponents/globalCommon'
import PageLoader from '../../../globalComponents/pageLoader';

import InfoIconsToolTip from '../../../globalComponents/InfoIconsToolTip/InfoIconsToolTip';


let copyData: any = []
let AllListId: any = {}
let AllTaskUser: any = []
const ContentEditingDocumentsTable = (props: any) => {

    const childRef = React.useRef<any>();
    const [livingDocsSyncData, setLivingDocsSyncData] = React.useState([])
    const [loaded, setLoaded] = React.useState(false);
    const [openEditPopup, setopenEditPopup] = React.useState(false)
    const [editData, setEditData] = React.useState({})

    useEffect(() => {
        if (props?.props != undefined) {
            AllListId = {
                siteUrl: props?.props?.siteUrl,
                Context: props?.props?.Context,
                LivingDocument: props?.props?.LivingDocument,
                TaskUserListID: props?.props?.TaskUserListID
            }
        }
        loadAllTaskUsers()
    }, []);
    const loadAllTaskUsers = async () => {
        try {
            let web = new Web(AllListId?.siteUrl);
            await web.lists
                .getById(AllListId?.TaskUserListID)
                .items
                .select("Id,UserGroupId,Suffix,Title,Email,SortOrder,Role,Company,ParentID1,Status,Item_x0020_Cover,AssingedToUserId,isDeleted,AssingedToUser/Title,AssingedToUser/Id,AssingedToUser/EMail,ItemType,Approver/Id,Approver/Title,Approver/Name,UserGroup/Id,UserGroup/Title,TeamLeader/Id,TeamLeader/Title&$expand=UserGroup,AssingedToUser,Approver,TeamLeader").get()
                .then((taskuser: any) => {
                    AllTaskUser = taskuser
                    LoadDocListData();
                }).catch((error: any) => {
                    console.log(error)
                });
        }
        catch (error) {
            return Promise.reject(error);
        }

    }
    // ==================loadBriefwahlData function to prepare the data of the BriefwahlData   Start  ===================
    const findUserByName = (name: any,) => {
        if (AllTaskUser?.length > 0) {
            const user = AllTaskUser?.filter(
                (user: any) => user?.AssingedToUser?.Id === name
            );
            let Image: any;
            if (user[0]?.Item_x0020_Cover != undefined) {
                Image = user[0].Item_x0020_Cover.Url;
            }
            return user?.length > 0 ? Image : null;
        }

    };
    const LoadDocListData = async () => {
        try {
            const web = new Web(props?.props?.siteUrl);
            // await web.lists.getById(AllListId?.LivingDocument)
            // .items.getAll()
            await web.lists.getById(AllListId?.LivingDocument)
                .items.select('Id', 'Title', 'PriorityRank', 'Responsible/Id', 'Body', 'Responsible/Title', 'Year', 'Body', 'Status', 'recipients', 'senderEmail', 'creationTime', 'Item_x0020_Cover', 'File_x0020_Type', 'FileLeafRef', 'FileDirRef', 'ItemRank', 'ItemType', 'Url', 'Created', 'Modified', 'Author/Id', 'Author/Title', 'Editor/Id', 'Editor/Title', 'EncodedAbsUrl', 'SmartTopics/Id', 'SmartTopics/Title')
                .expand('Author,Editor,Responsible,SmartTopics').getAll()
                .then((Data: any[]) => {
                    copyData = JSON.parse(JSON.stringify(Data))
                    console.log(Data)
                    Data.forEach((item: any) => {
                        item.Id = item.ID;
                        if (item.Title === null || item.Title === undefined || item.Title === '')
                            item.Title = item.FileLeafRef;
                        item.Editor = {}
                        item.Author = {}
                        item.displayDescription = "";
                        item.SmartTopicShowing = '';
                        item.ResponsibleTitle = '';
                        if (item.Responsible?.Title != undefined) {
                            item.ResponsibleTitle = item.Responsible?.Title;
                        }
                        if (item?.SmartTopics?.length > 0) {
                            item.SmartTopicShowing = item?.SmartTopics?.map((elem: any) => elem?.Title).join("; ")
                        }
                        if (item?.Modified != null && item?.Modified != undefined) {
                            item.serverModifiedDate = new Date(item?.Modified).setHours(0, 0, 0, 0)
                        }
                        if (item?.Created != null && item?.Created != undefined) {
                            item.serverCreatedDate = new Date(item?.Created).setHours(0, 0, 0, 0)
                        }
                        item.DisplayCreateDate = moment(item.Created).format("DD/MM/YYYY");
                        if (item.DisplayCreateDate == "Invalid date" || "") {
                            item.DisplayCreateDate = item.DisplayCreateDate.replaceAll("Invalid date", "");
                        }
                        item.DisplayModifiedDate = moment(item.Modified).format("DD/MM/YYYY");
                        if (item.DisplayModifiedDate == "Invalid date" || "") {
                            item.DisplayModifiedDate = item.DisplayModifiedDate.replaceAll("Invalid date", "");
                        }
                        item.EventDate
                        if (item?.EventDate != undefined) {
                            item.EventDate = moment(item.Modified).format("DD/MM/YYYY");
                            if (item.EventDate == "Invalid date" || "") {
                                item.EventDate = item.EventDate.replaceAll("Invalid date", "");
                            }
                        }

                        try {
                            item.inconDescription = item?.Body
                            item.displayDescription = limitTo100Words(item?.Body)
                        } catch (e) {

                        }

                        if (item?.AuthorId) {
                            item.Editor.EditorImage = findUserByName(item?.EditorId)
                        }
                        if (item?.AuthorId) {
                            item.Author.AuthorImage = findUserByName(item?.AuthorId)
                        }
                    });
                    setLivingDocsSyncData(Data)
                    setLoaded(true)
                }).catch((err) => {
                    setLoaded(true)
                    console.log(err.message);
                });

        } catch (error) {
            console.log('Error fetching list items:', error);
        }
    }
    const editItem = (editData: any) => {
        setEditData(editData)
        setopenEditPopup(true)
    }
    const limitTo100Words = (gethtml: any) => {
        let first100Words = '';
        if (gethtml !== null && gethtml !== undefined && gethtml !== '') {
            const plainText = gethtml.replace(/<[^>]*>|&#[^;]+;/g, '');
            const words = plainText.split(' ');
            first100Words = words.slice(0, 20).join(' ');
         
        }
        return first100Words;
    };
    const columns = React.useMemo<ColumnDef<any, unknown>[]>(
        () => [
            {
                accessorKey: "",
                placeholder: "",
                hasCheckbox: false,
                hasCustomExpanded: false,
                hasExpanded: false,
                isHeaderNotAvlable: true,
                size: 2,
                id: 'Id',
            },
            {
                accessorFn: (row: any) => row?.Item_x0020_Cover,
                cell: ({ row }: any) => (
                    <span className="text-content hreflink">
                        {row?.original?.Item_x0020_Cover?.Url != undefined ?
                            < img src={row?.original?.Item_x0020_Cover?.Url} alt="" style={{ width: "50px", height: "50px" }} /> : ''
                        }
                    </span>
                ),
                id: "Item_x0020_Cover",
                placeholder: 'Image',
                resetColumnFilters: false,
                header: "",
                size: 35,
                isColumnVisible: true
            },
            {
                accessorFn: (row: any) => row?.Date,
                cell: ({ row }: any) => (
                    <span className="text-content hreflink" title={row?.original?.Year} >
                        {row?.original?.Year}
                    </span>
                ),
                id: "Date",
                placeholder: "Year",
                resetColumnFilters: false,
                header: "",
                size: 100,
                isColumnVisible: true
            },
            {
                accessorFn: (row: any) => row?.Title,
                cell: ({ row }: any) => (
                    <span style={{ display: "flex", alignItems: "center", maxWidth: "480px" }}>
                    <span className="text-content hreflink" style={{ flexGrow: "1", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={row?.original?.Title}>
                        {row?.original?.Title}
                    </span>
                    </span>
                ),
                id: "Title",
                placeholder: "Title",
                resetColumnFilters: false,
                header: "",
                size: 500,
                isColumnVisible: true
            },
            {
                accessorFn: (row: any) => row?.displayDescription,
                cell: ({ row }: any) => (
                    <div className='alignCenter'>
                    <span style={{ display: "flex", alignItems: "center", maxWidth: "480px" }}>
                        <span className="hreflink" style={{ flexGrow: "1", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={row?.original?.displayDescription}>
                            {row?.original?.displayDescription}
                        </span>
                    </span>
                    <span>{row?.original?.displayDescription != "" && <InfoIconsToolTip row={row?.original} SingleColumnData={"inconDescription"} />}</span>
                </div>
                ),
                id: "displayDescription",
                placeholder: "Description",
                resetColumnFilters: false,
                header: "",
                size: 500,
                isColumnVisible: true
            },
            {
                accessorFn: (row: any) => row?.ResponsibleTitle,
                cell: ({ row }: any) => (
                    <span style={{ display: "flex", alignItems: "center", maxWidth: "120px" }}>
                <span className="text-content hreflink" style={{ flexGrow: "1", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={row?.original?.Responsible?.Title}>
                        {row?.original?.Responsible?.Title}
                    </span>
                    </span>
                ),
                id: "Responsible",
                placeholder: "Responsible",
                resetColumnFilters: false,
                header: "",
                size: 140,
                isColumnVisible: true
            },
            {
                accessorFn: (row: any) => row?.SmartTopicShowing,
                cell: ({ row }: any) => (
                    <span style={{ display: "flex", alignItems: "center", maxWidth: "120px" }}>
                    <span className="text-content hreflink" style={{ flexGrow: "1", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={row?.original?.SmartTopicShowing}>
                        {row?.original?.SmartTopicShowing}
                    </span>
                    </span>
                ),
                id: "SmartTopicShowing",
                placeholder: "Smart Topic",
                resetColumnFilters: false,
                header: "",
                size: 140,
                isColumnVisible: true
            },
            {
                accessorFn: (row) => row?.Modified,
                cell: ({ row, column }) => (
                    <div className="alignCenter">
                        {row?.original?.Modified == null ? ("") : (
                            <>
                                <div style={{ width: "70px" }} className="me-1">{row?.original?.DisplayModifiedDate}</div>
                                {row?.original?.Editor != undefined || row?.original?.Editor != undefined ? (
                                    <>
                                        <a
                                            onClick={() => globalCommon?.openUsersDashboard(AllListId?.siteUrl, row?.original?.Editor?.Id)}
                                        >
                                            {row?.original?.Editor?.AuthorImage != undefined ?
                                                <img title={row?.original?.Editor?.Title} className="workmember ms-1"
                                                    src={findUserByName(row?.original?.EditorId != undefined ? row?.original?.AuthorId : row?.original?.Editor?.Id)}
                                                /> : <span className='svg__iconbox svg__icon--defaultUser' title={row?.original?.Editor?.Title}></span>}
                                        </a>
                                    </>
                                ) : (
                                    <span className='svg__iconbox svg__icon--defaultUser' title={row?.original?.Editor?.Title} onClick={() => globalCommon?.openUsersDashboard(AllListId?.siteUrl, undefined, row?.original?.Editor?.Title)}></span>
                                )}
                            </>
                        )}
                    </div>
                ),
                id: 'Modified',
                resetColumnFilters: false,
                resetSorting: false,
                placeholder: "Modified",
                fixedColumnWidth: true,
                isColumnVisible: false,
                filterFn: (row: any, columnName: any, filterValue: any) => {
                    if (row?.original?.Editor?.Title?.toLowerCase()?.includes(filterValue?.toLowerCase()) || row?.original?.DisplayModifiedDate?.includes(filterValue)) {
                        return true
                    } else {
                        return false
                    }
                },
                header: "",
                size: 100
            },
            {
                accessorFn: (row) => row?.Created,
                cell: ({ row }) => (
                    <div className="alignCenter">
                        {row?.original?.Created == null ? (
                            ""
                        ) : (
                            <>
                                <div style={{ width: "70px" }} className="me-1">{row?.original?.DisplayCreateDate}</div>
                                {row?.original?.Author != undefined || row?.original?.AuthoId != undefined ? (
                                    <>
                                        <a
                                            onClick={() => globalCommon?.openUsersDashboard(AllListId?.siteUrl, row?.original?.AuthoId?.Id)}
                                        >
                                            {row?.original?.Author?.AuthorImage != undefined ?
                                                <img title={row?.original?.Author?.Title} className="workmember ms-1"
                                                    src={findUserByName(row?.original?.AuthorId != undefined ? row?.original?.AuthorId : row?.original?.Author?.Id)}
                                                /> : <span className='svg__iconbox svg__icon--defaultUser' title={row?.original?.Author?.Title}></span>}
                                        </a>
                                    </>
                                ) : (
                                    <span className='svg__iconbox svg__icon--defaultUser' title={row?.original?.Author?.Title} onClick={() => globalCommon?.openUsersDashboard(AllListId?.siteUrl, undefined, row?.original?.Author?.Title)}></span>
                                )}
                            </>
                        )}
                    </div>
                ),
                id: 'Created',
                resetColumnFilters: false,
                resetSorting: false,
                placeholder: "Created",
                fixedColumnWidth: true,
                filterFn: (row: any, columnName: any, filterValue: any) => {
                    if (row?.original?.Author?.Title?.toLowerCase()?.includes(filterValue?.toLowerCase()) || row?.original?.DisplayCreateDate?.includes(filterValue)) {
                        return true
                    } else {
                        return false
                    }
                },
                header: "",
                size: 100,
                isColumnVisible: true
            },
            // {
            //     cell: ({ row, getValue }: any) => (
            //         <>
            //             <div className='alignCenter'>
            //                <span title="Edit" className="alignIcon svg__iconbox svg__icon--edit hreflink ms-1"
            //                 onClick={() => editItem(row.original)}
            //                  >

            //                 </span>

            //             </div>

            //         </>
            //     ),
            //     id: 'AnonymousEditTaskPopup',
            //     canSort: false,
            //     placeholder: "",
            //     header: "",
            //     resetColumnFilters: false,
            //     resetSorting: false,
            //     size: 10,
            //     isColumnVisible: true
            // },

        ],
        [livingDocsSyncData]
    );
    const callBackData = (data: any) => {

        console.log(data)
    }
    // =========Custom button html End ================
    return (
        <div className="section">
            <div className='mb-4'>
                <h2 className="heading">LivingDocs Document Tool</h2>
            </div>
            <div>
                <div className="TableContentSection">
                    <div className='Alltable mt-2 mb-2'>
                        <div className='col-md-12 p-0'>
                            <GlobalCommanTable customHeaderButtonAvailable={true}
                                ref={childRef} hideTeamIcon={true} hideOpenNewTableIcon={true}
                                columns={columns} data={livingDocsSyncData} showHeader={true}
                                callBackData={callBackData} fixedWidth={true}/>
                            {!loaded && <PageLoader />}
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}
export default ContentEditingDocumentsTable;
