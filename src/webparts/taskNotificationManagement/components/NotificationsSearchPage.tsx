import React from 'react'
import * as globalCommon from '../../../globalComponents/globalCommon'
import { Web } from "sp-pnp-js";
import GlobalCommanTable from '../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable'
import { ColumnDef } from '@tanstack/react-table';
import PageLoader from "../../../globalComponents/pageLoader";
import moment from 'moment';
import { NotificationsAddPopup } from './NotificationsAddPopup';
let AllListId: any = {}
let AllTaskUser: any = []
export const NotificationsSearchPage = (props: any) => {
  const [AllNotificationConfigrations, setAllNotificationConfigrations] = React.useState([]);
  const [loaderActive, setLoaderActive] = React.useState(false);
  const [isPopupOpen, setIsPopupOpen] = React.useState(false);
  const [selectedEditItem, setSelectedEditItem]: any = React.useState();
  const [SelectedItems, setSelectedItems]: any = React.useState([]);

  React.useEffect(() => {
    AllListId = {
      siteUrl: props?.props?.siteUrl,
      Context: props?.props?.Context,
      PortFolioTypeID: props?.props?.PortFolioTypeID,
      SmartMetadataListID:props?.props?.SmartMetadataListID,
      TaskUserListID:props?.props?.TaskUserListID
    }
    loadAllTaskUsers()
  }, [])
  const loadAllTaskUsers = async () => {

    try {
        let web = new Web(AllListId?.siteUrl);
        await web.lists
            .getById(AllListId?.TaskUserListID)
            .items
            .select("Id,UserGroupId,Suffix,Title,Email,SortOrder,Role,Company,ParentID1,Status,Item_x0020_Cover,AssingedToUserId,isDeleted,AssingedToUser/Title,AssingedToUser/Id,AssingedToUser/EMail,ItemType,Approver/Id,Approver/Title,Approver/Name,UserGroup/Id,UserGroup/Title,TeamLeader/Id,TeamLeader/Title&$expand=UserGroup,AssingedToUser,Approver,TeamLeader").get()
            .then((taskuser: any) => {
                AllTaskUser = taskuser
                LoadAllNotificationConfigrations();
            }).catch((error: any) => {
                console.log(error)
            });
    }
    catch (error) {
        return Promise.reject(error);
    }

}
  const LoadAllNotificationConfigrations = async () => {
    let pageInfo = await globalCommon.pageContext()
    let permission = false;
    if (pageInfo?.WebFullUrl) {
      let web = new Web(pageInfo.WebFullUrl);

      web.lists.getByTitle('NotificationsConfigration').items.select('Id,ID,Modified,Created,Title,Author/Id,Author/Title,Editor/Id,Editor/Title,Recipients/Id,Recipients/Title,ConfigType,ConfigrationJSON,Subject,PortfolioType/Id,PortfolioType/Title').expand('Author,Editor,Recipients ,PortfolioType').get().then((result: any) => {
        result?.map((data: any) => {
          data.showUsers =""
          data.Modified = moment(data.Modified).format("DD/MM/YYYY");
          if (data.Modified == "Invalid date" || "") {
            data.Modified = data.Modified.replaceAll("Invalid date", "");
          }
          data.Created = moment(data.Created).format("DD/MM/YYYY");
          if (data.Created == "Invalid date" || "") {
            data.Created = data.Created.replaceAll("Invalid date", "");
          }
          if (data?.Editor) {
            data.Editor.EditorImage = findUserByName(data?.Editor?.Id)
        }
        if (data?.Author) {
          data.Author.AuthorImage = findUserByName(data?.Author?.Id)
        }
        if(data?.Recipients?.length>0){
         let copyRecipients= AllTaskUser.filter((user:any)=>data.Recipients.find((data2:any)=>user.AssingedToUserId==data2.Id))
        // console.log(copyData)
        data.Recipients=copyRecipients
        data.showUsers = data?.Recipients?.map((elem: any) => elem?.Title).join(",")
        }
       
          
        })
        setAllNotificationConfigrations(result)
      })

    }
    return permission;
  }
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
        placeholder: "Configuration Name",
        header: "",
        id: "Title",
        size: 115,
      },
      {
        accessorFn: (row) => row?.showUsers ,
        cell: ({ row, column, getValue }) => (
            <>
                {row?.original?.showUsers != (null || undefined) &&
                    <span >{row?.original?.showUsers}</span>
                }
            </>
        ),
        id: 'showUsers',
        placeholder: "Recipients Users/Groups",
        resetColumnFilters: false,
        header: "",
        size: 115,
        isColumnVisible: true
    },
    
     {
        accessorFn: (row) => row?.Modified,
        cell: ({ row, column }) => (
            <div className="alignCenter">
                {row?.original?.Modified == null ? ("") : (
                    <>
                        <div style={{ width: "70px" }} className="me-1">{row?.original?.Modified}</div>
                        {row?.original?.Editor != undefined || row?.original?.Editor != undefined ? (
                            <>
                                <a
                                    onClick={() => globalCommon?.openUsersDashboard(AllListId?.siteUrl, row?.original?.Editor?.Id)}
                                >
                                    {row?.original?.Editor?.EditorImage != undefined ?
                                        <img title={row?.original?.Editor?.Title} className=" alignIcon workmember ms-1"
                                            src={findUserByName(row?.original?.EditorId != undefined ? row?.original?.AuthorId : row?.original?.Editor?.Id)}
                                        /> : <span className=' alignIcon svg__iconbox svg__icon--defaultUser' title={row?.original?.Editor?.Title}></span>}
                                </a>
                            </>
                        ) : (
                            <span className='alignIcon svg__iconbox svg__icon--defaultUser' title={row?.original?.Editor?.Title} onClick={() => globalCommon?.openUsersDashboard(AllListId?.siteUrl, undefined, row?.original?.Editor?.Title)}></span>
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
            if (row?.original?.Editor?.Title?.toLowerCase()?.includes(filterValue?.toLowerCase()) || row?.original?.Modified?.includes(filterValue)) {
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
                        <div style={{ width: "70px" }} className="me-1">{row?.original?.Created}</div>
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
            if (row?.original?.Author?.Title?.toLowerCase()?.includes(filterValue?.toLowerCase()) || row?.original?.Created?.includes(filterValue)) {
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
        accessorKey: "",
        placeholder: "",
        header: "",
        id: "Edit",
        size: 5,
        cell: ({ row }: any) => (
          <>
            <span title="Edit Permission" className="svg__iconbox svg__icon--edit hreflink" onClick={() => { setSelectedEditItem(row?.original); setIsPopupOpen(true) }}></span>
          </>
        ),
      },
    ],
    [AllNotificationConfigrations] // Include any dependencies here
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
      LoadAllNotificationConfigrations();
    }
}
  const customTableHeaderButtons = (
    <div>
      <button type="button" className="btn btn-primary" title="Add Configuration" onClick={() => setIsPopupOpen(true)}>Add Configuration</button>
    </div>
  )
  return (
    <div className="section container">
      <header className="page-header heading ">
        <h1 className="page-title">Task-Notification-Management</h1>
      </header>
      <div className="TableContentSection">
        <div className='Alltable mt-2 mb-2'>
          <div className='col-md-12 p-0 '>
            <GlobalCommanTable 
            tableId={"Task-Notification-Management"}
            AllListId={AllListId} fixedWidthTable={true} columns={columns} multiSelect={true} 
            customHeaderButtonAvailable={true}
             customTableHeaderButtons={customTableHeaderButtons} 
            data={AllNotificationConfigrations}
            hideTeamIcon={true}
            hideOpenNewTableIcon={true}
             showHeader={true} callBackData={callBackData} />
          </div>
        </div>
      </div>
      {isPopupOpen && <NotificationsAddPopup context={props?.props?.context} SelectedEditItem={selectedEditItem} AllListId={AllListId} callBack={PopupCallBack} />}
      
      
      {loaderActive && <PageLoader />}
    </div>
  )
}
