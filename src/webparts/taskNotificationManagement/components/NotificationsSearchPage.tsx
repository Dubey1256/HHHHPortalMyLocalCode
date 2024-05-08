import React from 'react'
import * as globalCommon from '../../../globalComponents/globalCommon'
import { Web } from "sp-pnp-js";
import GlobalCommanTable from '../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable'
import { ColumnDef } from '@tanstack/react-table';
import PageLoader from "../../../globalComponents/pageLoader";
import moment from 'moment';
import { NotificationsAddPopup } from './NotificationsAddPopup';
let AllListId: any = {}
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
    }
    LoadAllNotificationConfigrations()
  }, [])
  const LoadAllNotificationConfigrations = async () => {
    let pageInfo = await globalCommon.pageContext()
    let permission = false;
    if (pageInfo?.WebFullUrl) {
      let web = new Web(pageInfo.WebFullUrl);

      web.lists.getByTitle('NotificationsConfigration').items.select('Id,ID,Modified,Created,Title,Author/Id,Author/Title,Editor/Id,Editor/Title,Recipients/Id,Recipients/Title,ConfigType,ConfigrationJSON,Subject,PortfolioType/Id,PortfolioType/Title').expand('Author,Editor,Recipients ,PortfolioType').get().then((result: any) => {
        result?.map((data: any) => {
          data.DisplayModifiedDate = moment(data.Modified).format("DD/MM/YYYY");
          if (data.DisplayModifiedDate == "Invalid date" || "") {
            data.DisplayModifiedDate = data.DisplayModifiedDate.replaceAll("Invalid date", "");
          }
          data.DisplayCreatedDate = moment(data.Created).format("DD/MM/YYYY");
          if (data.DisplayCreatedDate == "Invalid date" || "") {
            data.DisplayCreatedDate = data.DisplayCreatedDate.replaceAll("Invalid date", "");
          }
          data.showUsers = data?.Recipients?.map((elem: any) => elem.Title).join(",")
        })
        setAllNotificationConfigrations(result)
      })

    }
    return permission;
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
        placeholder: "Configration Name",
        header: "",
        id: "Title",
        size: 115,
      },
      {
        accessorKey: "showUsers",
        placeholder: "Recipients Users/Groups",
        header: "",
        id: "showUsers",
        size: 115,
      },

      {
        accessorKey: "DisplayModifiedDate",
        placeholder: "Modified",
        header: "",
        id: "Modified",
        size: 115,
        filterFn: (row: any, columnId: any, filterValue: any) => row?.original?.DisplayModifiedDate?.includes(filterValue),
      },
      {
        accessorKey: "DisplayCreatedDate",
        placeholder: "Created",
        header: "",
        id: "Created",
        size: 115,
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
      <button type="button" className="btn btn-primary" title="Click to Sync all selected items" onClick={() => setIsPopupOpen(true)}>Add Configration</button>
    </div>
  )
  return (
    <div className="section container">
      <header className="page-header text-center">
        <h1 className="page-title">Task-Notification-Management</h1>
      </header>
      <div className="TableContentSection">
        <div className='Alltable mt-2 mb-2'>
          <div className='col-md-12 p-0 '>
            <GlobalCommanTable AllListId={AllListId} fixedWidthTable={true} columns={columns} multiSelect={true} customHeaderButtonAvailable={true} customTableHeaderButtons={customTableHeaderButtons} data={AllNotificationConfigrations} showHeader={true} callBackData={callBackData} />
          </div>
        </div>
      </div>
      {isPopupOpen && <NotificationsAddPopup context={props?.props?.context} SelectedEditItem={selectedEditItem} AllListId={AllListId} callBack={PopupCallBack} />}
      
      
      {loaderActive && <PageLoader />}
    </div>
  )
}
