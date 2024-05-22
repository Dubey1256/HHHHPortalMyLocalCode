import * as React from 'react';
import { useEffect } from 'react';
import { sp, Web } from "sp-pnp-js";
import GlobalCommanTable from '../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable';
import { ColumnDef } from '@tanstack/react-table';
import moment from 'moment';
import * as globalCommon from '../../../globalComponents/globalCommon'
import PageLoader from '../../../globalComponents/pageLoader';
import {
    makeStyles,
    shorthands,
    Tab,
    TabList,
} from "@fluentui/react-components";
import InfoIconsToolTip from '../../../globalComponents/InfoIconsToolTip/InfoIconsToolTip';
import EditEventCardPopup from '../../../globalComponents/EditEventCard';
import EditLivingDocumentpanel from './EditLivingDocument';
const imgPattern = /<img[^>]+>/g;
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
    const [openEditPopup, setopenEditPopup] = React.useState(false)
    const [editData, setEditData] = React.useState({})
    const [loaded, setLoaded] = React.useState(false);
    const [openEditDocumentPopup, setopenEditDocumentPopup] = React.useState(false);
  

    useEffect(() => {
        if (props?.props != undefined) {
            const params = new URLSearchParams(window.location.search);
            console.log(params.get('ItemType'));

            const capitalizeFLetter = (site: String) => {
                return site[0].toUpperCase() + site.slice(1);
            }
            chanageTiles.current = capitalizeFLetter(params.get('ItemType'))
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


    const LoadNewsEventDocListData = async () => {

        try {
            if (chanageTiles?.current == "SharewebDocument") {
                loadDocuments()
            } else {

                let select = '';
                if (chanageTiles?.current == "SharewebEvent") {
                    select = `Id,ID,Title,Responsible/Id,Item_x0020_Cover,Status,Responsible/Title,Responsible/FullName,EventDate,Category,EndDate,EventDescription,Event_x002d_Type,Description,SmartContact/Id,SmartActivitiesId,SmartTopics/Title,SmartTopics/Id,SmartPages/Title,SmartPages/Id,Created,Author/Id,Author/Title,Modified,Editor/Id,Editor/Title&$expand=Author,SmartContact,SmartTopics,Responsible,SmartPages,Editor`
                } else {
                    select = `Id,ID,Title,Responsible/Id,Item_x0020_Cover,Status,Responsible/Title,Responsible/FullName,Expires,SmartContact/Id,SmartActivitiesId,SmartTopics/Title,SmartTopics/Id,SmartPages/Title,SmartPages/Id,ItemRank,Body,SortOrder,PublishingDate,Created,Author/Id,Author/Title,Modified,Editor/Id,Editor/Title&$expand=Author,SmartContact,SmartTopics,SmartPages,Editor,Responsible`
                }
                const web = new Web(props?.props?.siteUrl);
                await web.lists.getById(AllListId?.[chanageTiles?.current])
                    .items.select(select).getAll()
                    .then((Data: any[]) => {
                        let notSyncData = Data?.filter((items: any) => items?.Status != "Sync")
                        copyData = JSON.parse(JSON.stringify(notSyncData))
                        console.log(Data)
                        notSyncData.forEach((item: any) => {
                            item.Id = item.ID;
                            item.Date = ""
                           
                            item.showSmartTopic=""
                            item.displayDescription = ""
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

                            if (item?.EventDate != undefined) {
                                item.Date = moment(item.EventDate).format("DD/MM/YYYY");
                                if (item.Date == "Invalid date" || "") {
                                    item.Date = item.EventDate.replaceAll("Invalid date", "");
                                }
                            }
                            if (item?.PublishingDate != undefined) {
                                item.Date = moment(item.PublishingDate).format("DD/MM/YYYY");
                                if (item.Date == "Invalid date" || "") {
                                    item.Date = item.PublishingDate.replaceAll("Invalid date", "");
                                }
                            }

                            if (chanageTiles?.current == "SharewebNews") {
                                item.displayDescription = limitTo100Words(item?.Body)
                                item.Description = item?.Body
                            } else {
                                item.displayDescription =  limitTo100Words(item?.EventDescription)
                                item.Description = item?.EventDescription
                            }

                            if (item?.Editor) {
                                item.Editor.EditorImage = findUserByName(item?.Editor?.Id)
                            }
                            if (item?.Author) {
                                item.Author.AuthorImage = findUserByName(item?.Author?.Id)
                            }
                            
                            if(item?.SmartTopics?.length>0){
                                let SmartTopic=""
                                item?.SmartTopics?.map((data:any)=>{
                                    if(SmartTopic?.length>0){
                                        SmartTopic= SmartTopic+";"+data?.Title
                                    }else{
                                        SmartTopic= data?.Title
                                    }
                                    
                                })
                                item.showSmartTopic=SmartTopic
                            }
                        });
                        setLivingDocsSyncData(notSyncData)


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

    const limitTo100Words = (gethtml: any) => {
        let first100Words = '';
        if (gethtml !== null && gethtml !== undefined && gethtml !== '') {
            const plainText = gethtml.replace(/<[^>]*>|&#[^;]+;/g, '');
            const words = plainText.split(' ');
            first100Words = words.slice(0, 20).join(' ');
        }
        return first100Words;
    };
    const loadDocuments = async () => {
        const web = new Web(AllListId?.siteUrl);
        try {
           
                await web.lists.getById(AllListId?.SharewebDocument)
                .items.select('Id', 'Title', 'PriorityRank', 'Responsible/Id', 'Body', 'Responsible/Title','Responsible/FullName', 'Year', 'Body', 'Status', 'recipients', 'senderEmail', 'creationTime', 'Item_x0020_Cover', 'File_x0020_Type', 'FileLeafRef', 'FileDirRef', 'ItemRank', 'ItemType', 'Url', 'Created', 'Modified', 'Author/Id', 'Author/Title', 'Editor/Id', 'Editor/Title', 'EncodedAbsUrl', 'SmartTopics/Id', 'SmartTopics/Title')
                .expand('Author,Editor,Responsible,SmartTopics').getAll()
                
                .then((data: any) => {
                    console.log(data)
                    let notSyncData = data?.filter((items: any) => items?.Status != "Sync")
                    copyData = JSON.parse(JSON.stringify(notSyncData))
                    notSyncData.forEach((item: any) => {

                        item.Id = item.ID;
                        item.showSmartTopic=""
                        item.Date =  item?.Year
                        item.displayDescription = ""
                        item.displayDescription = limitTo100Words(item?.Body)
                        item.Description = item?.Body
                      
                        item.Description=item?.Body
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
                        if (item.Editor) {
                            item.Editor.EditorImage = findUserByName(item.Editor?.Id)
                        }
                        if (item.Author) {
                            item.Author.AuthorImage = findUserByName(item.Author?.Id)
                        }
                        if(item?.SmartTopics?.length>0){
                            let SmartTopic=""
                            item?.SmartTopics?.map((data:any)=>{
                                if(SmartTopic?.length>0){
                                    SmartTopic= SmartTopic+";"+data?.Title
                                }else{
                                    SmartTopic= data?.Title
                                }
                                
                            })
                            item.showSmartTopic=SmartTopic
                        }
                    });
                    setLivingDocsSyncData(notSyncData)


                    setLoaded(true)
                });

        } catch (e: any) {
            console.log(e);
        }
    };
 

    const editItem = (editData: any) => {
        setEditData(editData)
        if(chanageTiles.current!="SharewebDocument"){
            setopenEditPopup(true)
        }else{
            setopenEditDocumentPopup(true)  
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
                size: 10,
                id: 'Id',
              
            },
            {
                accessorFn: (row: any) => row?.Item_x0020_Cover,
                cell: ({ row }: any) => (
                    <span
                        className="text-content hreflink"
                       
                    >
                       {row?.original?.Item_x0020_Cover?.Url!=undefined &&<img src={row?.original?.Item_x0020_Cover?.Url} alt="" style={{width:"50px"}}/> }
                    </span>
                ),
                id: "Item_x0020_Cover",
                placeholder: "Image",
                resetColumnFilters: false,
                header: "",
                size: 70,
                isColumnVisible: true
            },
            {
                accessorFn: (row: any) => row?.Date,
                cell: ({ row }: any) => (
                    <span
                        className="text-content hreflink"
                        title={row?.original?.Date}
                    >
                        {row?.original?.Date}
                    </span>
                ),
                id: "Date",
                placeholder: chanageTiles?.current == "SharewebNews" ? "Published Date" : chanageTiles?.current == "SharewebEvent" ? "Start Date" : "Year",
                resetColumnFilters: false,
                header: "",
                size: 70,
                isColumnVisible: true
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
                size: 300,
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
                    <span>{row?.original?.displayDescription != "" && <InfoIconsToolTip row={row?.original} SingleColumnData={"Description"} />}</span>
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
                accessorFn: (row: any) => row?.Responsible,
                cell: ({ row }: any) => (
                    <span>
                        {row?.original?.Responsible?.FullName}
                    </span>
                ),
                id: "Responsible",
                placeholder: "Responsible",
                resetColumnFilters: false,
                header: "",
                size: 120,
                isColumnVisible: true
            },
            {
                accessorFn: (row: any) => row?.showSmartTopic,
                cell: ({ row }: any) => (
                    <span style={{ display: "flex", alignItems: "center", maxWidth: "120px" }}>
                    <span className="text-content hreflink" style={{ flexGrow: "1", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={row?.original?.showSmartTopic}>
                        {row?.original?.showSmartTopic}
                    </span>
                    </span>
                ),
                id: "SmartTopicShowing",
                placeholder: "Page",
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
                                                <img title={row?.original?.Editor?.Title} className=" alignIcon workmember ms-1"
                                                    src={findUserByName(row?.original?.EditorId != undefined ? row?.original?.AuthorId : row?.original?.Editor?.Id)}
                                                /> : <span className=' alignIcon svg__iconbox svg__icon--defaultUser' title={row?.original?.Editor?.Title}></span>}
                                        </a>
                                    </>
                                ) : (
                                    <span className='alignIcon svg__iconbox svg__icon--defaultUser' title={row?.original?.Editor?.Title} onClick={() => globalCommon?.openUsersDashboard(AllListId?.siteUrl, undefined, row?.original?.Editor?.Title)}></span>
                                )}
                            </>
                            // <>
                            //     <div className="me-1">
                            //         {row?.original?.DisplayModifiedDate}
                            //     </div>
                            //     {row?.original?.EditorId != undefined &&
                            //         <>
                            //             <span className="svg__icon--defaultUser svg__iconbox" title={row?.original?.Editor?.Title}></span>
                            //             {/* <img title={row?.original?.Editor?.Title} className="workmember ms-1" />  */}

                            //         </>
                            //     }
                            // </>
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
                size: 105
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
                                                <img title={row?.original?.Author?.Title} className="alignIcon workmember ms-1"
                                                    src={findUserByName(row?.original?.AuthorId != undefined ? row?.original?.AuthorId : row?.original?.Author?.Id)}
                                                /> : <span className='alignIcon svg__iconbox svg__icon--defaultUser' title={row?.original?.Author?.Title}></span>}
                                        </a>
                                    </>
                                ) : (
                                    <span className='alignIcon svg__iconbox svg__icon--defaultUser' title={row?.original?.Author?.Title} onClick={() => globalCommon?.openUsersDashboard(AllListId?.siteUrl, undefined, row?.original?.Author?.Title)}></span>
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




            {
                cell: ({ row, getValue }: any) => (
                    <>



                        <div className='alignCenter'>
                            <span title="Edit" className="alignIcon svg__iconbox svg__icon--edit hreflink ms-1"
                                onClick={() => editItem(row.original)}
                            >

                            </span>

                        </div>

                    </>
                ),
                id: 'AnonymousEditTaskPopup',
                canSort: false,
                placeholder: "",
                header: "",
                resetColumnFilters: false,
                resetSorting: false,
                size: 10,
                isColumnVisible: true
            },

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
            await Promise.all(childRef?.current?.table?.getSelectedRowModel()?.flatRows?.map(async (config: any) => {
                await Promise.all([batchUpdateLivingDocsList(config?.original),]);
            }));


            if (chanageTiles?.current == "SharewebDocument") {
                loadDocuments()

            } else {
                LoadNewsEventDocListData()
            }

            console.log("Batch update completed successfully.");
        } else {
            console.log("No items to update.");
        }

    }
    const batchUpdateLivingDocsList = async (postDataArry2: any): Promise<void> => {
        const web = new Web(AllListId?.siteUrl);
        let postData: any = {}
        let SmartTopicsId:any=[]
        let  SmartPagesId:any=[]
         let SmartContactId:any=[]
         let SmartActivitiesId:any=[]
      
        try {
     
      if(postDataArry2?.SmartTopics?.length>0){
        postDataArry2?.SmartTopics?.map((data:any)=>{
            SmartTopicsId.push(data?.Id)
        })
      }
      if(postDataArry2?.SmartPages?.length>0){
        postDataArry2?.SmartPages?.map((data:any)=>{
            SmartPagesId.push(data?.Id)
        })
      }
      if(postDataArry2?.SmartContact?.length>0){
        postDataArry2?.SmartContact?.map((data:any)=>{
            SmartContactId.push(data?.Id)
        })
      }
      if(postDataArry2?.SmartActivities?.length>0){
        postDataArry2?.SmartActivities?.map((data:any)=>{
            SmartActivitiesId.push(data?.Id)
        })
      }
      
            if (chanageTiles?.current == "SharewebNews") {
                postDataArry2.SyncListId = AllListId?.LivingNews;
                postData = {
                    Title: postDataArry2?.Title,

                    SortOrder: postDataArry2?.SortOrder,
                    SmartTopicsId: {
                        results: SmartTopicsId

                    },
                    SmartPagesId: {
                        results: SmartPagesId

                    },
                    SmartContactId: {
                        results: SmartContactId

                    },
                    SmartActivitiesId: {
                        results: SmartActivitiesId

                    },
                    ResponsibleId:postDataArry2?.Responsible?.Id,
                    PublishingDate:postDataArry2?.PublishingDate,
                    Item_x0020_Cover: {
                        "__metadata": { type: 'SP.FieldUrlValue' },
                        'Description': postDataArry2?.Item_x0020_Cover?.Url,
                        'Url': postDataArry2?.Item_x0020_Cover?.Url,
                      },
                    OData__ColorTag: postDataArry2?.OData__ColorTag,
                    ItemRank: postDataArry2?.ItemRank,
                    ComplianceAssetId: postDataArry2?.ComplianceAssetId,
                    Body: postDataArry2?.Body,
                    Attachments: postDataArry2?.Attachments
                }
                await Promise.all([syncFunctionAndUpadte(postDataArry2, postData), updateStatusdata(postDataArry2)])
            }
            if (chanageTiles?.current == "SharewebEvent") {
                postDataArry2.SyncListId = AllListId?.LivingEvent;
                postData = {
                    Title: postDataArry2?.Title,

                    SmartTopicsId: {
                        results:SmartTopicsId

                    },
                    SmartPagesId: {
                        results: SmartPagesId

                    },
                    SmartContactId: {
                        results:SmartContactId

                    },
                    SmartActivitiesId: {
                        results:SmartActivitiesId

                    },
                    EventDate: postDataArry2?.EventDate,
                  
                    ResponsibleId:postDataArry2?.Responsible?.Id,
                    Item_x0020_Cover: {
                        "__metadata": { type: 'SP.FieldUrlValue' },
                        'Description': postDataArry2?.Item_x0020_Cover?.Url,
                        'Url': postDataArry2?.Item_x0020_Cover?.Url,
                      },
                   
                 
                   
                    Description: postDataArry2?.Description,
                    EndDate: postDataArry2?.EndDate,
                    EventDescription: postDataArry2?.EventDescription,
                    Event_x002d_Type: postDataArry2?.Event_x002d_Type,
                  

                }
                await Promise.all([syncFunctionAndUpadte(postDataArry2, postData), updateStatusdata(postDataArry2)])

            }
            //========= copy file from one list to another doc list function start =======
            if (chanageTiles?.current == "SharewebDocument") {
                postDataArry2.SyncListId = AllListId?.LivingDocument;
                const web = new Web(props?.props?.siteUrl);
                // destination is a server-relative url of a new file

                await Promise.all([syncFunctionAndUpadteForDoc(postDataArry2), updateStatusdata(postDataArry2)])

            }
            //========= copy file from one list to another doc list function End =======

        } catch (error) {
            console.log(error)
        }



    }

    const syncFunctionAndUpadte = (postDataArry2: any, postData: any) => {
        const web = new Web(AllListId?.siteUrl);
        web.lists.getById(postDataArry2?.SyncListId).items.add(postData).then(async (data) => {
            console.log("sucess")


        });
    }
    const updateStatusdata = async (postDataArry2: any) => {
        const web = new Web(AllListId?.siteUrl);
        await web.lists.getById(AllListId?.[chanageTiles?.current])
            .items.getById(postDataArry2?.Id).update({ Status: "Sync" }).then(async (data) => {
                console.log(data)

            }).catch((error: any) => {
                console.log(error)
            })
    }
    const syncFunctionAndUpadteForDoc = (postDataArry2: any) => {
        const web = new Web(AllListId?.siteUrl);
        const destinationUrl = `/sites/HHHH/LivingDocs/LivingDocument/${postDataArry2?.FileLeafRef}`;

        web.getFileByServerRelativePath(`/sites/HHHH/LivingDocs/SharewebDocument/${postDataArry2?.FileLeafRef}`).copyTo(destinationUrl, false).then(async (data: any) => {
            console.log(data)


        }).catch((eror: any) => {
            console.log(eror)
        });
    }

    // =========Custom button html start ================
    let customTableHeaderButtons = (
        <>
            {syncActive ?
                <button type="button" className="btn btn-primary" title='Sync Tool'
                    onClick={() => SyncDataToLivingDocs()}
                >Sync</button> :
                <button type="button" className="btn btn-primary" disabled={true} >Sync Data </button>
            }
        </>
    )

    // =========Custom button html End ================
    const EditCallBack = (data: any) => {
        console.log(data)
        setEditData({})
        setopenEditDocumentPopup(false)
        setopenEditPopup(false)
        LoadNewsEventDocListData()
       
    }
    return (
        <div className="section">
            <div className='mb-4'>
                <h2 className="heading">SP LivingDocs Content Library - {chanageTiles?.current=="SharewebNews"?"News":chanageTiles?.current=="SharewebEvent"?"Event":"Document"}</h2>
            </div>
            <div>
                {/* <ul className="nav nav-tabs" id="myTab" role="tablist">
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
                </ul> */}
              
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
                                        ref={childRef} hideTeamIcon={true} hideOpenNewTableIcon={true}
                                        columns={columns} data={livingDocsSyncData} showHeader={true}
                                      
                                        callBackData={callBackData} fixedWidth={true}/>
                                    {!loaded && <PageLoader />}
                                </div>
                            </div>
                        </div>

                    </div>
               


            </div>
            {openEditPopup && <EditEventCardPopup allListId={AllListId} usedFor={chanageTiles.current} EditEventData={editData} Context={AllListId?.Context} callBack={EditCallBack} />}
      
           {openEditDocumentPopup && <EditLivingDocumentpanel callbackeditpopup={EditCallBack} editData={editData} AllListId={AllListId} Context={AllListId?.Context} />}
        </div>

    );
}
export default LivingDocsSyncToolTable;
