import * as React from 'react';
import { useEffect } from 'react';
import { sp, Web } from "sp-pnp-js";
import GlobalCommanTable from '../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable';
import { ColumnDef } from '@tanstack/react-table';
import moment from 'moment';
import PageLoader from '../../../globalComponents/pageLoader';
import {
    makeStyles,
    shorthands,
    Tab,
    TabList,
} from "@fluentui/react-components";

const useStyles = makeStyles({
    root: {
        alignItems: "flex-start",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        rowGap: "20px",
    },
});
let copyData: any = []
let AllListId: any = {}
let AllTaskUser: any = []
const LivingDocsSyncToolTable = (props: any) => {
    const chanageTiles = React.useRef("SharewebNews")
    const styles = useStyles();
    const childRef = React.useRef<any>();
    const [livingDocsSyncData, setLivingDocsSyncData] = React.useState([])
    const [syncActive, setSyncActive] = React.useState(false)

    const [loaded, setLoaded] = React.useState(false);


    useEffect(() => {
        if (props?.props != undefined) {

            AllListId = {
                siteUrl: props?.props?.siteUrl,
                Context: props?.props?.Context,
                SharewebNews: props?.props?.SharewebNews,
                SharewebEvent: props?.props?.SharewebEvent,
                SharewebDocument: props?.props?.SharewebDocument,
                LivingNews: props?.props?.LivingNews,
                LivingEvent: props?.props?.LivingEvent,
                LivingDocument: props?.props?.LivingDocument,
                TaskUserListID: props?.props?.TaskUserListID
            }
        }
        //    AllTaskUser= globalCommon?.loadAllTaskUsers(AllListId)
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
                    LoadNewsEventDocListData();
                }).catch((error: any) => {
                    console.log(error)
                });
        }
        catch (error) {
            return Promise.reject(error);
        }

    }
    // ==================loadBriefwahlData function to prepare the data of the BriefwahlData   Start  ===================

    const LoadNewsEventDocListData = async () => {

        try {
            if (chanageTiles?.current == "SharewebDocument") {
                loadDocuments()
            } else {
                const web = new Web(props?.props?.siteUrl);
                await web.lists.getById(AllListId?.[chanageTiles?.current])
                    .items.getAll()
                    .then((Data: any[]) => {
                        copyData = JSON.parse(JSON.stringify(Data))
                        console.log(Data)
                        Data.forEach((item: any) => {
                            item.Id = item.ID;


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
                        });
                        setLivingDocsSyncData(Data)


                        setLoaded(true)
                    }).catch((err) => {
                        setLoaded(true)
                        console.log(err.message);
                    });

            }


        } catch (error) {
            console.log('Error fetching list items:', error);

        }

    }
    const loadDocuments = async () => {
        const web = new Web(AllListId?.siteUrl);
        try {
            await web.lists.getByTitle('SharewebDocument')
                .items
                .select('Id', 'Title', 'PriorityRank', 'Year', 'Body', 'Status', 'recipients', 'senderEmail', 'creationTime', 'Item_x0020_Cover', 'File_x0020_Type', 'FileLeafRef', 'FileDirRef', 'ItemRank', 'ItemType', 'Url', 'Created', 'Modified', 'Author/Id', 'Author/Title', 'Editor/Id', 'Editor/Title', 'EncodedAbsUrl')
                .expand('Author,Editor')
                .getAll()
                .then((data: any) => {
                    console.log(data)
                    copyData = JSON.parse(JSON.stringify(data))
                    data.forEach((item: any) => {

                        item.Id = item.ID;


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
                    });
                    setLivingDocsSyncData(data)


                    setLoaded(true)
                });

        } catch (e: any) {
            console.log(e);
        }
    };
    //  const PrepareDataShown=(item:any)=>{
    //     item.Id = item.ID;

    //     if (item?.Modified != null && item?.Modified != undefined) {
    //         item.serverModifiedDate = new Date(item?.Modified).setHours(0, 0, 0, 0)
    //     }
    //     if (item?.Created != null && item?.Created != undefined) {
    //         item.serverCreatedDate = new Date(item?.Created).setHours(0, 0, 0, 0)
    //     }
    //     item.DisplayCreateDate = moment(item.Created).format("DD/MM/YYYY");
    //     if (item.DisplayCreateDate == "Invalid date" || "") {
    //         item.DisplayCreateDate = item.DisplayCreateDate.replaceAll("Invalid date", "");
    //     }
    //     item.DisplayModifiedDate = moment(item.Modified).format("DD/MM/YYYY");
    //     if (item.DisplayModifiedDate == "Invalid date" || "") {
    //         item.DisplayModifiedDate = item.DisplayModifiedDate.replaceAll("Invalid date", "");
    //     }


    //     item.Link = getSafeUrl(item.Link);
    //     item.editPLZ = item.PLZ
    //     try {
    //         if (item.ZipCodes != undefined) {
    //             item.PLZ = item.PLZ.charAt(0) + '....';
    //             item.ZipCodePLZ = item.editPLZ + '\n' + item.ZipCodes;
    //         }
    //         else {
    //             item.ZipCodePLZ = item.editPLZ;
    //         }
    //     } catch (e) { }
    //     item.LinkLandtag = getSafeUrl(item.LinkLandtag);
    //     item.LinkBundestag = getSafeUrl(item.LinkBundestag);
    //     item.LinkVerified = item.LinkVerified == '1' ? true : false;
    //     item.EmailVerified = item.EmailVerified == '1' ? true : false;
    //     item.listId = props?.props?.BriefwahlListId
    //     item.siteUrl = props?.props?.siteUrl

    //     item.StadtMobile = item.Stadt;
    //     item.ZipCodePLZMobile = item.ZipCodePLZ;
    //     return  item;
    //  }
    const columns = React.useMemo<ColumnDef<any, unknown>[]>(
        () => [
            {
                accessorKey: "",
                placeholder: "",
                hasCheckbox: true,
                hasCustomExpanded: false,
                hasExpanded: false,
                isHeaderNotAvlable: true,
                size: 10,
                id: 'Id',
            },
            {
                accessorFn: (row: any) => row?.Title,
                cell: ({ row }: any) => (
                    <span
                        className="text-content hreflink"
                        title={row?.original?.Title}
                    >
                        {row?.original?.Title}
                    </span>
                ),
                id: "Title",
                placeholder: "Title",
                resetColumnFilters: false,
                header: "",
                size: 70,
                isColumnVisible: true
            },
            {
                accessorFn: (row: any) => row?.Status,
                cell: ({ row }: any) => (
                    <span
                        className="text-content hreflink"
                        title={row?.original?.Status}
                    >
                        {row?.original?.Status}
                    </span>
                ),
                id: "Status",
                placeholder: "Status",
                resetColumnFilters: false,
                header: "",
                size: 70,
                isColumnVisible: true
            },

            {
                accessorFn: (row) => row?.Modified,
                cell: ({ row, column }) => (
                    <div className="alignCenter">
                        {row?.original?.Modified == null ? ("") : (
                            <>
                                <div className="me-1">
                                    {row?.original?.DisplayModifiedDate}
                                </div>
                                {row?.original?.EditorId != undefined &&
                                    <>
                                        <span className="svg__icon--defaultUser svg__iconbox" title={row?.original?.Editor?.Title}></span>
                                        {/* <img title={row?.original?.Editor?.Title} className="workmember ms-1" />  */}

                                    </>
                                }
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
                size: 115
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
                                            href={`${AllListId?.siteUrl}/SitePages/TaskDashboard.aspx?UserId=${row?.original?.Author?.Id}&Name=${row?.original?.Author?.Title}`}
                                            target="_blank"
                                            data-interception="off"
                                        >
                                            <img title={row?.original?.Author?.Title} className="workmember ms-1"
                                            // src={findUserByName(row?.original?.AuthorId != undefined ? row?.original?.AuthorId : row?.original?.Author?.Id)} 
                                            />
                                        </a>
                                    </>
                                ) : (
                                    <span className='svg__iconbox svg__icon--defaultUser' title={row?.original?.Author?.Title}></span>
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
                size: 105,
                isColumnVisible: true
            },




            // {
            //     cell: ({ row, getValue }: any) => (
            //         <>



            //             <div className='alignCenter'>
            //                 {row?.original?.contenteditable && <div>
            //                     <span title="Save" className="svg__iconbox svg__icon--Save" onClick={() => saveInlineData(row?.original)} ></span>
            //                     <span title="Cancel" className="alignIcon svg__iconbox svg__icon--cross hreflink ms-1" onClick={() => cancleInlineData(row.original)} ></span>
            //                 </div>}
            //                 <span title="Edit Inline" className="alignIcon svg__iconbox svg__icon--editBox hreflink ms-1" onClick={() => InlineEditingFunction(row.original)} ></span>
            //                 <span title="Edit" className="alignIcon svg__iconbox svg__icon--edit hreflink ms-1" onClick={() => editItem(row.original)} ></span>

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
        if (childRef?.current?.table?.getSelectedRowModel()?.flatRows?.length > 0) {
            setSyncActive(true)
        } else {
            setSyncActive(false)
        }
        console.log(data)
    }
    const ChangeTile = function (Tile: any) {
        setLoaded(false)
        chanageTiles.current = Tile

        LoadNewsEventDocListData()
    }
    const SyncDataToLivingDocs = async () => {

        if (childRef?.current?.table?.getSelectedRowModel()?.flatRows?.length > 0) {
            const batchSize = 50; // Adjust the batch size as needed
            const batches = Math.ceil(childRef?.current?.table?.getSelectedRowModel()?.flatRows?.length / batchSize);

            for (let i = 0; i < batches; i++) {
                const batchItems = childRef?.current?.table?.getSelectedRowModel()?.flatRows.slice(i * batchSize, (i + 1) * batchSize);
                await batchUpdateLivingDocsList(batchItems);
            }
            if (chanageTiles?.current == "SharewebDocument") {
                LoadNewsEventDocListData()
            }else{
                loadDocuments() 
            }
          
            console.log("Batch update completed successfully.");
        } else {
            console.log("No items to update.");
        }

    }
    const batchUpdateLivingDocsList = async (itemsToUpdate: any): Promise<void> => {
        const web = new Web(AllListId?.siteUrl);
        const batch = sp.createBatch();
        let postDataArry = copyData?.filter((data: any) => itemsToUpdate.find((data2: any) => data2.original.Id == data?.Id))
        console.log(postDataArry)
        postDataArry?.map(async (postDataArry2: any) => {
            let postData: any = {}
            try {

                if (chanageTiles?.current == "SharewebNews") {
                    postDataArry2.SyncListId = AllListId?.LivingNews;
                    postData = {
                        Title: postDataArry2?.Title,

                        SortOrder: postDataArry2?.SortOrder,
                        SmartTopicsId: {
                            results: postDataArry2?.SmartTopicsId

                        },
                        SmartPagesId: {
                            results: postDataArry2?.SmartPagesId

                        },
                        SmartContactId: {
                            results: postDataArry2?.SmartContactId

                        },
                        SmartActivitiesId: {
                            results: postDataArry2?.SmartActivitiesId

                        },
                        OData__ColorTag: postDataArry2?.OData__ColorTag,
                        ItemRank: postDataArry2?.ItemRank,
                        ComplianceAssetId: postDataArry2?.ComplianceAssetId,
                        Body: postDataArry2?.Body,
                        Attachments: postDataArry2?.Attachments
                    }
                    web.lists.getById(postDataArry2?.SyncListId).items.add(postData).then(async (data) => {
                        console.log("sucess")

                        await web.lists.getById(AllListId?.SharewebNews).items.getById(postDataArry2?.Id).update({ Status: "Sync" })
                            .then(async (dataupdate: any) => {
                                console.log(dataupdate)
                                await batch.execute();
                            }).catch((error: any) => {
                                console.log(error)
                            })

                    });
                }
                if (chanageTiles?.current == "SharewebEvent") {
                    postDataArry2.SyncListId = AllListId?.LivingEvent;
                    postData = {
                        Title: postDataArry2?.Title,

                        SmartTopicsId: {
                            results: postDataArry2?.SmartTopicsId

                        },
                        SmartPagesId: {
                            results: postDataArry2?.SmartPagesId

                        },
                        SmartContactId: {
                            results: postDataArry2?.SmartContactId

                        },
                        SmartActivitiesId: {
                            results: postDataArry2?.SmartActivitiesId

                        },
                        EventDate: postDataArry2?.EventDate,
                        Attachments: postDataArry2?.Attachments,

                        BannerUrl: {
                            "__metadata": { type: "SP.FieldUrlValue" },
                            Description: postDataArry2?.BannerUrl,
                            Url: postDataArry2?.BannerUrl
                        },
                        Category: postDataArry2?.Category,
                        ParticipantsPickerId: { results: postDataArry2?.ParticipantsPickerId != null ? postDataArry2?.ParticipantsPickerId : [] },
                        Overbook: postDataArry2?.Overbook,
                        OData__ColorTag: postDataArry2?.OData__ColorTag,
                        Description: postDataArry2?.Description,
                        EndDate: postDataArry2?.EndDate,
                        EventDescription: postDataArry2?.EventDescription,
                        Event_x002d_Type: postDataArry2?.Event_x002d_Type,
                        FreeBusy: postDataArry2?.FreeBusy,
                        Geolocation: postDataArry2?.Geolocation,
                        Location: postDataArry2?.Location,
                        Facilities: postDataArry2?.Facilities

                    }

                    web.lists.getById(postDataArry2?.SyncListId).items.add(postData).then(async (data) => {
                        console.log("sucess")
                        await web.lists.getById(AllListId?.SharewebEvent).items.getById(postDataArry2?.Id).update({ Status: "Sync" })
                            .then(async (dataupdate: any) => {
                                console.log(dataupdate)
                                await batch.execute();
                            }).catch((error: any) => {
                                console.log(error)
                            })

                    });
                }
                //========= copy file from one list to another doc list function start =======
                if (chanageTiles?.current == "SharewebDocument") {
                    postDataArry2.SyncListId = AllListId?.LivingDocument;
                    const web = new Web(props?.props?.siteUrl);
                    // destination is a server-relative url of a new file

                    const destinationUrl = `/sites/HHHH/LivingDocs/LivingDocument/${postDataArry2?.FileLeafRef}`;

                    await web.getFileByServerRelativePath(`/sites/HHHH/LivingDocs/SharewebDocument/${postDataArry2?.FileLeafRef}`).copyTo(destinationUrl, false).then(async (data: any) => {
                        console.log(data)
                        await batch.execute();
                    }).catch((eror: any) => {
                        console.log(eror)
                    });

                }
                //========= copy file from one list to another doc list function End =======

            } catch (error) {
                console.log(error)
            }
        })

    }


    // =========Custom button html start ================
    let customTableHeaderButtons = (
        <>
            {syncActive ?
                <button type="button" className="btn btn-primary" title='Bulk- Email'
                    onClick={() => SyncDataToLivingDocs()}
                >Sync</button> :
                <button type="button" className="btn btn-primary" disabled={true} >Sync Data </button>
            }
        </>
    )
    // =========Custom button html End ================
    return (
        <div className="container section">
            <div className='mb-4'>
                <h2 className="heading">LivingDocs Sync Tool</h2>
            </div>
            <div>
                <ul className="nav nav-tabs" id="myTab" role="tablist">
                    <button
                        className={`nav-link ${chanageTiles?.current=="SharewebNews" ? 'active' : ''}`}
                        id="SharewebNews"
                        type="button"
                        onClick={() => ChangeTile('SharewebNews')}
                    >
                        SharewebNews
                    </button>
                    <button
                        className={`nav-link ${chanageTiles?.current=="SharewebEvent" ? 'active' : ''}`}
                        id="SharewebEvent"
                        type="button"
                        onClick={() => ChangeTile('SharewebEvent')}
                    >
                        SharewebEvent
                    </button>
                    <button
                            className={`nav-link ${chanageTiles?.current=="SharewebDocument" ? 'active' : ''}`}
                        id="SharewebDocument"
                        type="button"
                        onClick={() => ChangeTile('SharewebDocument')}
                    >
                        SharewebDocument
                    </button>
                </ul>
                <div
                    className="border border-top-0 clearfix p-3 tab-content" id="myTabContent">
                    <div
                        className="tab-pane show active"
                        id={chanageTiles?.current}
                        role="tabpanel"
                        aria-labelledby={chanageTiles?.current}>
                        <div className="TableContentSection">
                            <div className='Alltable mt-2 mb-2'>
                                <div className='col-md-12 p-0'>
                                    <GlobalCommanTable customHeaderButtonAvailable={true}
                                        customTableHeaderButtons={customTableHeaderButtons}
                                        ref={childRef} hideTeamIcon={true} hideOpenNewTableIcon={false}
                                        columns={columns} data={livingDocsSyncData} showHeader={true}
                                        callBackData={callBackData} />
                                    {!loaded && <PageLoader />}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                

            </div></div>

    );
}
export default LivingDocsSyncToolTable;
