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
const ContentEditingDocumentsTable = (props: any) => {
    const styles = useStyles();
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
                LivingNews: props?.props?.LivingNews,             
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
                    LoadNewsListData();
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
        if(AllTaskUser?.length>0){
          const user = AllTaskUser?.filter(
            (user: any) => user?.AssingedToUser?.Id === name
        );
        let Image: any;
        if (user[0]?.Item_x0020_Cover != undefined) {
            Image = user[0].Item_x0020_Cover.Url;
        } 
       return user?.length>0 ? Image : null;
        }
       
    };
    const LoadNewsListData = async () => {
        try {
                const web = new Web(props?.props?.siteUrl);
                await web.lists.getById(AllListId?.LivingNews)
                    .items.getAll()
                    .then((Data: any[]) => {
                        copyData = JSON.parse(JSON.stringify(Data))
                        console.log(Data)
                        Data.forEach((item: any) => {
                            item.Id = item.ID;
                            item. Editor={}
                            item.Author={}
                            item.displayDescription="";
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
                            if(item?.EventDate!=undefined){
                                item.EventDate = moment(item.Modified).format("DD/MM/YYYY");
                                if (item.EventDate == "Invalid date" || "") {
                                    item.EventDate = item.EventDate.replaceAll("Invalid date", "");
                                }  
                            }

                            item.displayDescription=  item?.Body;
                            
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
    const editItem=(editData:any)=>{
        setEditData(editData)
        setopenEditPopup(true)
     }
    const columns = React.useMemo<ColumnDef<any, unknown>[]>(
        () => [
            {
                accessorKey: "",
                placeholder: "",
                hasCheckbox: false,
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
                        {row?.original?.displayDescription && <InfoIconsToolTip row={row?.original} SingleColumnData={"displayDescription"} />}
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
                accessorFn: (row: any) => row?.EventDate,
                cell: ({ row }: any) => (
                    <span
                        className="text-content hreflink"
                        title={row?.original?.EventDate}
                    >
                        {row?.original?.EventDate}
                    </span>
                ),
                id: "EventDate",
                placeholder: "Date",
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
                            <div style={{ width: "70px" }} className="me-1">{row?.original?.DisplayModifiedDate}</div>
                            {row?.original?.Editor != undefined || row?.original?.Editor != undefined ? (
                                <>
                                    <a
                                       onClick={()=> globalCommon?.openUsersDashboard(AllListId?.siteUrl, row?.original?.Editor?.Id)}
                                    >
                                        {row?.original?.Editor?.AuthorImage!=undefined?
                                        <img title={row?.original?.Editor?.Title}className="workmember ms-1"
                                        src={findUserByName(row?.original?.EditorId != undefined ? row?.original?.AuthorId : row?.original?.Editor?.Id)} 
                                        />:<span className='svg__iconbox svg__icon--defaultUser' title={row?.original?.Editor?.Title}></span>}
                                    </a>
                                </>
                            ) : (
                                <span className='svg__iconbox svg__icon--defaultUser' title={row?.original?.Editor?.Title}  onClick={()=> globalCommon?.openUsersDashboard(AllListId?.siteUrl, undefined,row?.original?.Editor?.Title)}></span>
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
                                            onClick={()=> globalCommon?.openUsersDashboard(AllListId?.siteUrl, row?.original?.AuthoId?.Id)}
                                        >
                                            {row?.original?.Author?.AuthorImage!=undefined?
                                            <img title={row?.original?.Author?.Title}className="workmember ms-1"
                                            src={findUserByName(row?.original?.AuthorId != undefined ? row?.original?.AuthorId : row?.original?.Author?.Id)} 
                                            />:<span className='svg__iconbox svg__icon--defaultUser' title={row?.original?.Author?.Title}></span>}
                                        </a>
                                    </>
                                ) : (
                                    <span className='svg__iconbox svg__icon--defaultUser' title={row?.original?.Author?.Title}   onClick={()=> globalCommon?.openUsersDashboard(AllListId?.siteUrl,undefined ,row?.original?.Author?.Title)}></span>
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
        <div className="container section">
            <div className='mb-4'>
                <h2 className="heading">LivingDocs Document Tool</h2>
            </div>
            <div>
              
            <div className="TableContentSection">
                            <div className='Alltable mt-2 mb-2'>
                                <div className='col-md-12 p-0'>
                                    <GlobalCommanTable customHeaderButtonAvailable={true}
                                        ref={childRef} hideTeamIcon={true} hideOpenNewTableIcon={false}
                                        columns={columns} data={livingDocsSyncData} showHeader={true}
                                        callBackData={callBackData} />
                                    {!loaded && <PageLoader />}
                                </div>
                            </div>
                        </div>
                

            </div>
            </div>

    );
}
export default ContentEditingDocumentsTable;
