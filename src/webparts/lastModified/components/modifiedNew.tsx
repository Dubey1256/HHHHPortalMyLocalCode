import * as $ from "jquery";
import PageLoader from '../../../globalComponents/pageLoader';
import * as globalCommon from "../../../globalComponents/globalCommon";
import moment from 'moment';
import { ColumnDef } from '@tanstack/react-table'
import React, { useEffect, useRef, useState } from 'react'
import { Web } from "sp-pnp-js"
import GlobalCommanTable from '../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable'
import ShowTaskTeamMembers from '../../../globalComponents/ShowTaskTeamMembers'
import EditTaskPopup from '../../../globalComponents/EditTaskPopup/EditTaskPopup';
import EditComponent from '../../EditPopupFiles/EditComponent'
import EditDocumentpanel from '../../taskprofile/components/EditDocunentPanel';
import ReactPopperTooltipSingleLevel from "../../../globalComponents/Hierarchy-Popper-tooltipSilgleLevel/Hierarchy-Popper-tooltipSingleLevel";
import TimeEntryPopup from "../../../globalComponents/TimeEntry/TimeEntryComponent";
import EditInstitutionPopup from '../../contactSearch/components/contact-search/popup-components/EditInstitutionPopup';
import { myContextValue } from '../../../globalComponents/globalCommon'
import EditPage from '../../../globalComponents/EditPanelPage/EditPage'
import InfoIconsToolTip from "../../../globalComponents/InfoIconsToolTip/InfoIconsToolTip";
let masterTaskData: any;
let ActualSites: any = []
let baseUrl: any
let editLists:any
export const Modified = (props: any) => {
  let columns: any = [];
  const [gmbhSite, setGmbhSite] = useState(false);
  const [sites, setSites] = useState<any>([])
  const [allSiteData, setallSiteData] = useState<any>([])
  const [allUsers, setAllUsers] = useState<any>([]);
  const [type, setType] = useState<any>('');
  const [duplicate, setDuplicate] = useState<any>([]);
  const [multipleDelete, setMultipleDelete] = useState<any>([]);
  const [editTaskPopUpOpen, setEditTaskPopUpOpen] = useState(false);
  const [editComponentPopUps, setEditComponentPopUps] = useState(false);
  const [editDocPopUpOpen, seteditDocPopUpOpen] = useState(false);
  const [editValue, setEditValue] = useState<any>([]);
  const [editContactLists, setEditContactLists] = useState<any>();
  const [Portfoliotyped, setPortfoliotyped] = useState<any>();
  const [loader, setLoader] = useState<any>(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [currentTimeEntry, setCurrentTimeEntry] = useState<any>([]);
  const [istimeEntryOpen, setIsTimeEntryOpen] = useState(false);
  const [editInstitutionPopUp, setEditInstitutionPopUp] = useState(false);
  const [editWebPagePopUp, setEditWebPagePopUp] = useState(false)
  const [SitesConfig, setSitesConfig] = React.useState([]);
  const [isEditEvent, setIsEditEvent] = useState<any>(false)
  const childRef = React.useRef<any>();
  let context = props?.props?.context
  let allDataFinal: any = [];
  let allSitesDummy: any = [];
  let siteNumber: number = 0;
  let Users: any;
  let currentAll: any = []
  useEffect(() => {
    storeEditList()
    getSites();
  }, []);

  const storeEditList = () => {
    const editListsAll = {
      TaskUsertListID: props?.props?.TaskUsertListID,
      TaskUserListID: props?.props?.TaskUsertListID,
      SmartMetadataListID: props?.props?.SmartMetadataListID,
      MasterTaskListID: props?.props.MasterTaskListID,
      TaskTimeSheetListID: props?.props?.TaskTimeSheetListID,
      DocumentsListID: props?.props?.DocumentsListID,
      SmartInformation: props?.props?.SmartInformation,
      TaskTypeID: props?.props?.TaskTypeID,
      TimeEntry: props?.props?.TimeEntry,
      SiteCompostion: props?.props?.SiteCompostion,
      SitePagesList: props?.props?.SitePagesList,
      siteUrl: baseUrl,
      Context: props?.props?.context,
      SmartHelptListID: props?.props?.SmartHelptListID,
      PortFolioTypeID: props?.props?.PortFolioTypeID,
      baseUrl: baseUrl,
      NewsListId:props?.props?.NewsListId,
      EventListId:props?.props?.EventListId,
      context: props?.props?.context,
      TaskUserListId: props?.props?.TaskUsertListID,
      isShowTimeEntry: props?.props?.TimeEntry,

    }
    editLists=editListsAll
  }
  const getSites = async function () {
    baseUrl = props?.props.context?._pageContext?.web?.absoluteUrl;
    var web: any = new Web(baseUrl);
    try {
      var siteData = await web.lists.getById(props.props.ListConfigurationListId).items.select("Id,Key,Configuration,Value&$filter=Key eq 'LastModifiedItems'").getAll();
    } catch (error) {
      console.error(error)
    }
    ActualSites = JSON.parse(siteData[0].Configuration);
    ActualSites.map((sites: any) => {
      sites.noRepeat = false;
      sites.AllTask = false;
      sites.editFunction = false;
      sites.allEditFunction = false;
    })
    setSites(ActualSites)
    getCurrentData(ActualSites[0])
  }
  const getCurrentData = async (allSite: any) => {
    childRef?.current?.setRowSelection({});
    setLoader(false);
    baseUrl = allSite.SiteUrl;
    editLists.siteUrl = baseUrl;
    editLists.baseUrl=baseUrl
    let web = new Web(baseUrl);
    setType(allSite.TabName);
    setIsButtonDisabled(false)
    // to show all sites task data
    // if (allSite.TabName == 'ALL') {
    //   allSite.allEditFunction = true;
    //   if (allSite.noRepeat != true) {
    //     sites.map((allData: any) => {
    //       if (allData.TabName != 'DOCUMENTS' && allData.TabName != 'FOLDERS' && allData.TabName != 'COMPONENTS' && allData.TabName != 'SERVICES' && allData.TabName != 'ALL') {
    //         allSitesDummy.push(allData)
    //       }
    //     })
    //     allSitesDummy.map((check: any) => {
    //       check.AllTask = true;
    //       getCurrentData(check);
    //     })
    //     allSite.noRepeat = true;
    //     allSite.firstRepeat = true;
    //     allSite.allNorepeat = true;
    //   } else {
    //     allSite.allNorepeat = false;
    //     allSite.firstRepeat = false;
    //   }
    // }
    if (allSite.AllTask != true) {
      setType(allSite.TabName);
      if (allSite.TabName != "ALL") {
        sites.map((Sites: any) => {
          if (Sites.TabName == "ALL") {
            Sites.allEditFunction = false;
          }
        })
        if (allSite.editFunction != true) {
          setTimeout(() => {
            sites.map((item: any) => {
              if (allSite.TabName == item?.TabName) {

                document.getElementById(`nav-${item?.TabName}`)?.classList.add('show');
                document.getElementById(`nav-${item?.TabName}`)?.classList.add('active');
                document.getElementById(`nav-${item.TabName}-tab`)?.classList.add('active');
              }
            })
            setLoader(true);
            setIsButtonDisabled(true)
          }, 600);
        }

      }
    }
    // 
    if (allSite.noRepeat != true) {
      var data: any = [];
      if(allSite?.NumerousSite==true){
        loadSiteConfiguration(allSite,web).then((response:any)=>{
        getInformationList(response,baseUrl,allSite) 
        })
        
      }else{
        try {
          data = await web.lists.getById(allSite.ListId).items.select(allSite.Columns).orderBy('Modified', false).getAll();
          data?.map((items0:any)=>{
            items0.listId = allSite?.ListId;
          })
        }
        catch (error) {
          console.error(error)
        }
        arangeData(data,allSite)
      } 
    }
    // This else block is used for do not call Api again,which has been loaded.
    else {
      var duplicateValue: any = [];
      if (allSite.TabName == 'ALL') {
        duplicate.map((dupData: any) => {
          dupData.map((items: any) => {
            if (items.siteType != 'DOCUMENTS' && items.siteType != 'FOLDERS' && items.siteType != 'COMPONENTS' && items.siteType != 'SERVICES' && items.siteType != "Master Tasks") {
              duplicateValue.push(items)
            }
          })
        })

        if (allSite.allNorepeat != true || allSite.firstRepeat == true) {
          setallSiteData(duplicateValue)

          setTimeout(() => {
            document.getElementById(`nav-ALL`)?.classList.add('show');
            document.getElementById(`nav-ALL`)?.classList.add('active');
            document.getElementById(`nav-ALL-tab`)?.classList.add('active');
            setLoader(true);
            setIsButtonDisabled(true)
          }, 300)

        }
      }
      else {
        var currentvalue: any = [];
        duplicate.map((dupData: any) => {
          dupData.map((items: any) => {
            if (items.siteType == allSite.TabName || items.MasterType == allSite.TabName) {
              duplicateValue.push(items)
              currentvalue.push(items)
            }
          })
        })
        if (allSite.AllTask != true) {
          setallSiteData(duplicateValue)
        } else {
          siteNumber++;
          allDataFinal.push([...currentvalue])
          allSite.AllTask = false;
        }
      }
    }

  }
  const loadSiteConfiguration = async (allsite:any,web:any) => { 
    let configvalue: any = [];
    configvalue=await web.lists.getById(allsite?.ListId).items.select("Columns").filter( `WebpartId eq '${allsite?.FilterType}'`).getAll()
     configvalue = JSON.parse(configvalue[0].Columns);                       
          return configvalue
}

  const arangeData=(data:any,allSite:any)=>{
    data?.map((item: any) => {
      if(allSite?.TabName == 'DOCUMENTS'&& item?.Title==undefined|| allSite.TabName=="WEB PAGES"){
        item.Title=item?.FileLeafRef
      }
      item.SiteIcon="https://grueneweltweit.sharepoint.com/sites/GrueneWeltweit/Site%20Collection%20Images/ICONS/logo-gruene.png"
      item.TaskID = globalCommon.GetTaskId(item);
      item.siteType = allSite.TabName;
      item.siteUrl = baseUrl
      if (item.DueDate != undefined) {
        item.dueDateNew = moment(item?.DueDate).format('DD/MM/YYYY')
      }
      if (item.Modified != undefined) {
        item.modifiedNew = moment(item?.Modified).format('DD/MM/YYYY');
      }
      if (item.Created != undefined) {
        item.createdNew = moment(item?.Created).format('DD/MM/YYYY')
      }
      if (item.File_x0020_Type != undefined) {
        if (item.File_x0020_Type == "doc") {
          item.File_x0020_Type = 'docx'
        }
        if (item.File_x0020_Type == 'jfif') {
          item.File_x0020_Type = 'jpg'
        }
      }
      if (allSite.TabName == 'FOLDERS') {
        item.File_x0020_Type = 'folder';
      }
      if (item.Portfolio != undefined) {
        item.PortfolioTitle = item.Portfolio?.Title;
        item.PortfolioID = item.Portfolio?.Id
      }
      if (item.Author != undefined) {
        item.authorName = item?.Author?.Title;
        item.authorDefaultImage = 'https://grueneweltweit.sharepoint.com/sites/GrueneWeltweit/washington/public/PublishingImages/Icons/icon_user.jpg';
      }
      if (item.Editor != undefined) {
        item.editorName = item?.Editor?.Title;
        item.editorDefaultImage = 'https://grueneweltweit.sharepoint.com/sites/GrueneWeltweit/washington/public/PublishingImages/Icons/icon_user.jpg';
      }
      if (item.PercentComplete != undefined) {
        item.PercentComplete = parseInt((item.PercentComplete * 100).toFixed(0));
        item.PercentCompleteShow = item.PercentComplete + '%';
      }
   
    if (allSite.TabName == "EVENTS") {
      data = data.filter((item: any) => { return (item.Title != null) })
    }
    if (allSite.TabName == 'SMART PAGES') {
      data = data.filter((item: any) => { return (item.ProfileType == "Smart Pages"|| item.ProfileType=="Event"|| item.ProfileType=='Topic') })
    }

    })
    data=data?.filter((filterValue:any)=>{return (filterValue?.ItemType!="Sprint" && filterValue?.ItemType!="Project")})
    if (allSite.AllTask == true) {
      allDataFinal.push([...data])
      siteNumber++;
      currentAll.push(data)
      if (allSitesDummy.length == siteNumber) {
        setDuplicate([...duplicate, ...currentAll]);
        var showAllData: any = [];
        allDataFinal.map((sitesData: any) => {
          showAllData.push(...sitesData)
        })
        setallSiteData(showAllData)
        setTimeout(() => {
          document.getElementById(`nav-ALL`)?.classList.add('show');
          document.getElementById(`nav-ALL`)?.classList.add('active');
          document.getElementById(`nav-ALL-tab`)?.classList.add('active');
          setLoader(true);
          setIsButtonDisabled(true)
        }, 700);

      }
      allSite.AllTask = false;
    }
    else {
      if (allSite.editFunction == true) {
        var tempArray: any = [];
        var AllSiteTempArray: any = [];
        duplicate.map((allDup: any) => {
          var oneSiteData: any = [];
          allDup.map((updatedData: any) => {
            if (updatedData.siteType != allSite.TabName) {
              oneSiteData.push(updatedData)
            }
          })
          if (oneSiteData != undefined && oneSiteData.length > 0) {
            tempArray.push(oneSiteData)
          }
        })
        tempArray.unshift([...data])
        tempArray.map((itemALL: any) => {
          AllSiteTempArray.push(...itemALL)
        })
        setDuplicate([...tempArray])
        if (allSite.allEditFunction == true) {
          sites.map((Sites: any) => {
            if (Sites.TabName == "ALL") {
              Sites.allEditFunction = true;
            }
          })
          allSite.allEditFunction = true
          setallSiteData(AllSiteTempArray)
          setLoader(true);
        } else {
          setallSiteData(data)
          setLoader(true);
          setIsButtonDisabled(true)
        }
        allSite.editFunction = false;
      } else {
        setDuplicate([...duplicate, data])
        setallSiteData(data)
      }
    }
    allSite.noRepeat = true;
  }
  const getInformationList=(SitesConfig:any,baseUrl:any,allSite:any)=>{
    let allEvents:any=[]
    let count=0;
    let columnUse:any=''
    SitesConfig?.map((config: any) => {
      const web = new Web(baseUrl + config?.siteUrl);
      if(config?.EventlistId!=undefined){
        columnUse='ID,Title,Description,SmartActivities/Title,SmartActivities/Id,SmartTopics/Title, SmartTopics/Id, SmartPages/Title, SmartPages/Id, FileLeafRef, IsVisible,Created, Modified,Author/Id, Author/Title,Editor/Title,Editor/Id,EventDate,EndDate,Location&$expand=Author,Editor,SmartActivities,SmartTopics,SmartPages'
      } else{
        columnUse='Id,Title,Modified,Created,ItemRank,Author/Title,Author/Id,Editor/Title,Editor/Id&$expand=Author,Editor'
      }
   web.lists.getById(config?.EventlistId!=undefined?config?.EventlistId:config.listId).items.select(columnUse).getAll().then((results:any)=>{
    count++;
    results.map((item:any)=>{
      
      item.siteUse=config?.siteUrl?.split('/')[1];;
      item.LinkSite=config?.siteUrl
      item.numerousSite=true;
      item.listId=config.EventlistId!=undefined?config.EventlistId:config.listId
      item.EventlistId = config.EventlistId;
      allEvents.push(item)
    })
    if(SitesConfig.length==count){
      arangeData(allEvents,allSite)   
    }
  })
   });
    return allEvents
}
  const deleteItemById = async (url: any, listId: any, item: any, itemId: any) => {
    const web = new Web(url);
    let result;
    try {
      result = (await web.lists.getById(listId).items.getById(itemId).delete());
    }
    catch (error) {
      return Promise.reject(error);
    }
    return result;
  }


  const deleteData = (dlData: any) => {
    var flag = confirm(`Are you sure, you want to delete?`)
    var URL=baseUrl;
    if (flag == true) {
      if(dlData.numerousSite==true){
        URL=baseUrl+dlData.LinkSite
      }
      deleteItemById(URL, dlData.listId, dlData, dlData.Id).then(() => {
        duplicate.map((dupDelte: any) => {
          dupDelte.map((dupItem: any, index: any) => {
            if (dupItem.Id == dlData.Id) {
              dupDelte.splice(index, 1);
            }
          })
        })
        allSiteData.map((currentData: any, index: any) => {
          if (dlData.Id == currentData.Id) {
            allSiteData.splice(index, 1);
          }
        })
        setallSiteData([...allSiteData]);
      }).catch((error) => {
        console.error(error)
      })


      console.log(dlData.Id)
    }
  }
  const multipleDeleteFunction = (checkBoxValue: any) => {
    checkBoxValue.map((value: any) => {
      value.map((item: any) => {
        deleteData(item.original);
      })
    })
    childRef?.current?.setRowSelection({});
  }
  const editPopUp = (edit: any) => {
    setEditTaskPopUpOpen(true)
    setEditValue(edit);
  }
  const editComponentPopUp = async (editComponentValue: any) => {
    setEditValue(editComponentValue);
    setEditComponentPopUps(true)
  }
  const editEvents = (editEvent: any) => {
    // editLists.siteUrl=baseUrl+ '/'+ editEvent?.siteUse
    setEditValue(editEvent);
    setIsEditEvent(true)
  }
  const editDocOpen = (editDoc: any) => {
    setEditValue(editDoc);
    seteditDocPopUpOpen(true);
  }
  const editWebOpen = (editOpen: any) => {
    setEditValue(editOpen);
    setEditWebPagePopUp(true);

  }
  const editContactOpen = (editConatact: any) => {
    setEditValue(editConatact);
    setEditInstitutionPopUp(true)
  }
  const editTaskCallBack = (data: any) => {
    setEditTaskPopUpOpen(false);
    var updateData: any = data?.data;
    if(updateData!=undefined){
      sites.map((siteValue: any) => {
        if (siteValue.TabName == type) {
          siteValue.noRepeat = false;
          siteValue.editFunction = true;
          getCurrentData(siteValue)
        }
      })
    }
    
    // var dummyValueSite: any = [];
    // var updateData: any = data.data;

    // if (updateData != undefined) {
    //   sites.map((siteValue: any) => {
    //     if (siteValue.TabName == updateData.siteType) {
    //       siteValue.noRepeat = false;
    //       siteValue.editFunction = true;
    //       dummyValueSite = siteValue;
    //     }
    //     if (siteValue.TabName == "ALL" && siteValue.allEditFunction == true) {
    //       dummyValueSite.allEditFunction = true
    //     }
    //   })
    //   getCurrentData(dummyValueSite);
    // }
  }
  const CloseConatactPopup = () => {
    setEditInstitutionPopUp(false)
  }
  const EditCallBackItem=(updateData: any)=>{
    if(updateData !== undefined && updateData !== null){
      sites.map((siteValue: any) => {
        if(siteValue.TabName==type){
          siteValue.noRepeat = false;
          siteValue.editFunction = true;
          getCurrentData(siteValue)
        }
      })
    }
    setEditInstitutionPopUp(false)
  }
  const closeEditComponent = (item: any) => {
    setEditComponentPopUps(false)
    // Portfolio_x0020_Type
    if (item?.PortfolioType?.Title !=undefined) {
      sites.map((siteValue: any) => {
        if (siteValue.TabName == type) {
          siteValue.noRepeat = false;
          siteValue.editFunction = true;
          getCurrentData(siteValue)
        }
      })
    }
  };
  const callbackeditpopup = (item: any) => {
    if (item != undefined) {
      seteditDocPopUpOpen(false);
      sites.map((siteValue: any) => {
        if (siteValue.TabName == type) {
          siteValue.noRepeat = false;
          siteValue.editFunction = true;
          getCurrentData(siteValue)
        }
      })
    } else {
      seteditDocPopUpOpen(false);
    }
  }
  const EditDataTimeEntryData = (item: any) => {
    setIsTimeEntryOpen(true);
    setCurrentTimeEntry(item);
  }
  const TimeEntryCallBack = () => {
    setIsTimeEntryOpen(false);
  }
  const changes = () => {

  }
  const updatedWebpages = () => {
    sites.map((siteValue: any) => {
        if (siteValue.TabName == type) {
        siteValue.noRepeat = false;
        siteValue.editFunction = true;
        getCurrentData(siteValue)
      }
    })
  }
 const CallbackEvent=React.useCallback((elem: any, getSelectedRowModel: any, ShowingData: any) => {
  setIsEditEvent(false)
 },[])

  const callBackData = React.useCallback((elem: any, getSelectedRowModel: any, ShowingData: any) => {

    if (elem) {
      setMultipleDelete([elem]);
    } else {
      setMultipleDelete([]);
    }
  }, []);
  if (type == 'FOLDERS' || type == 'WEB PAGES') {
    columns = React.useMemo<ColumnDef<any, unknown>[]>(() =>
      [
        {
          accessorKey: "",
          placeholder: "",
          hasCheckbox: true,
          size: 55,
          id: 'Id',
        },
        {
          accessorKey: "Title", placeholder: "Title", header: "",
          cell: ({ row }) =>
            <div className="alignCenter">
              {row.original.File_x0020_Type != undefined ? <>{type == 'FOLDERS' ? <a  className="alignCenter" data-interception="off" target='_blank' href={row.original.FileDirRef}><span className={`me-1 svg__iconbox svg__icon--${row.original.File_x0020_Type}`}></span></a> : <span className={`svg__iconbox svg__icon--${row.original.File_x0020_Type}`}></span>}</> : undefined}
              <a data-interception="off" target='_blank' href={row.original.EncodedAbsUrl}>{row.original.FileLeafRef}</a>
            </div>
        },
        {
          accessorKey: 'Modified', cell: ({ row }) =>
            <>
              {row.original.modifiedNew}
              <img title={row.original.editorName} className='workmember ms-1 mt--2' src={`${row?.original?.editorDefaultImage}`} alt="" />
            </>,
          filterFn: (row: any, columnName: any, filterValue: any) => {
            if (row?.original?.editorName?.toLowerCase()?.includes(filterValue?.toLowerCase()) || row?.original?.modifiedNew?.includes(filterValue)) {
              return true
            } else {
              return false
            }
          },
          id: 'Modified',
          resetColumnFilters: false,
          isColumnDefultSortingDesc: true,
          resetSorting: false,
          placeholder: "Modified",
          header: "",
          size: 145,
        }
        , {

          accessorKey: "Created",
          cell: ({ row }) =>
            <>
              {row.original.createdNew}
              <img title={row.original.authorName} className='workmember ms-1 mt--2' src={`${row.original.authorDefaultImage}`} alt="" />
            </>,
          filterFn: (row: any, columnName: any, filterValue: any) => {
            if (row?.original?.authorName?.toLowerCase()?.includes(filterValue?.toLowerCase()) || row?.original?.createdNew?.includes(filterValue)) {
              return true
            } else {
              return false
            }
          },
          id: 'Created',
          resetColumnFilters: false,
          resetSorting: false,
          placeholder: "Created",
          header: "",
          size: 145,
        },
        {
          id: 'editWebPage', size: 25,
          cell: ({ row }) =>
            <>
              {type == 'WEB PAGES' ?
                
                    <div className="alignCenter">
                  <EditPage context={editLists} Title={row.original.FileLeafRef} changeHeader={changes} updatedWebpages={updatedWebpages} /> 
                  </div>
                
                : undefined}
            </>

        }
        , {
          id: 'deleteWebpage', size: 25,
          cell: ({ row }) =>
            <>
              {type == 'WEB PAGES' ?
                <div className="alignCenter">
                 <span onClick={() => deleteData(row.original)} title="Delete" className="svg__iconbox svg__icon--trash"></span>
                 </div>
              
                : undefined}
            </>

        }
      ], [allSiteData])

  }

  else if (type == 'DOCUMENTS') {
    columns = React.useMemo<ColumnDef<any, unknown>[]>(() =>
      [
        {
          accessorKey: "",
          placeholder: "",
          hasCheckbox: true,
          size: 55,
          id: 'Id',
        },
        {
          accessorKey: "Title", placeholder: "Title", header: "", id: "Title",
          cell: ({ row }) =>
            <div className="alignCenter">
              {row.original.File_x0020_Type != undefined ? <>{type == 'FOLDERS' ? <a data-interception="off" target='_blank' href={row.original.FileDirRef}><span className={`svg__iconbox svg__icon--${row.original.File_x0020_Type}`}></span></a> : <span className={`svg__iconbox svg__icon--${row.original.File_x0020_Type}`}></span>}</> : undefined}
              <a data-interception="off" target='_blank' href={row.original.EncodedAbsUrl}>{row.original.FileLeafRef}</a>
            </div>
        },
        {
          accessorKey: 'Modified', cell: ({ row }) =>
            <>
              {row.original.modifiedNew}
              <img title={row.original.editorName} className='workmember ms-1 mt--2' src={`${row.original.editorDefaultImage}`} alt="" />
            </>,
          filterFn: (row: any, columnName: any, filterValue: any) => {
            if (row?.original?.editorName?.toLowerCase()?.includes(filterValue?.toLowerCase()) || row?.original?.modifiedNew?.includes(filterValue)) {
              return true
            } else {
              return false
            }
          },
          id: 'modifiedNew',
          resetColumnFilters: false,
          isColumnDefultSortingDesc: true,
          resetSorting: false,
          placeholder: "Modified",
          header: "",
          size: 145,
        }
        , {
          accessorKey: "Created",
          cell: ({ row }) =>
            <>
              {row.original.createdNew}
              <img title={row.original.authorName} className='workmember ms-1 mt--2' src={`${row.original.authorDefaultImage}`} alt="" />
            </>,
          filterFn: (row: any, columnName: any, filterValue: any) => {
            if (row?.original?.authorName?.toLowerCase()?.includes(filterValue?.toLowerCase()) || row?.original?.createdNew?.includes(filterValue)) {
              return true
            } else {
              return false
            }
          },
          id: 'createdNew',
          resetColumnFilters: false,
          resetSorting: false,
          placeholder: "Created",
          header: "",
          size: 145,
        },
        {
          id: 'updateDoc', size: 25,
          cell: ({ row }) =>
            <>
              {type == 'DOCUMENTS' || type == 'WEB PAGES' ?
              <div className="alignCenter">
         <span onClick={() => editDocOpen(row.original)} title="Edit" className="svg__iconbox svg__icon--edit"></span>
         </div> : undefined}
            </>

        }
        , {
          id: 'deleteDoc', size: 25,
          cell: ({ row }) =>
            <>
              {type == 'DOCUMENTS' || type == 'WEB PAGES' ?
               <div className="alignCenter">
              <span onClick={() => deleteData(row.original)} title="Delete" className="svg__iconbox svg__icon--trash"></span>
              </div> : undefined}
            </>

        }
      ], [allSiteData])
  }
  else if (type == 'SMART PAGES') {
    columns = React.useMemo<ColumnDef<any, unknown>[]>(() =>
      [
        {
          accessorKey: "",
          placeholder: "",
          hasCheckbox: true,
          size: 5,
          id: 'Id',
        },
        {
          accessorKey: "ProfileType", placeholder: "Profile Type", header: "", id: "ProfileType",
          cell: ({ row }) =>
            <span>{row.original.ProfileType}</span>
        },
        {
          accessorKey: "Title", placeholder: "Title", header: "", id: "Title",
          cell: ({ row }) =>
            
            <a data-interception="off" target='_blank' href={`${baseUrl}/SitePages/${row.original.ProfileType == "Smart Pages"?'Pages':'Profiles'}.aspx?SmartId=${row.original.Id}&Item=${row.original.Title}`}>
              {row.original.Title}  
            </a>
        },
        {
          accessorFn: (row: any) => row?.Modified,
          cell: ({ row }) =>
            <>
              {row.original.modifiedNew}
              <a data-interception="off" target='_blank' href={`${baseUrl}/SitePages/TaskDashboard.aspx?UserId=${row.original.editorId}&Name=${row.original.editorName}`}>
                {row.original.editorImage != undefined ?
                  <img title={row.original.editorName} className='workmember ms-1 mt--2' src={`${row.original.editorImage}`} alt="" />
                  : row.original.editorSuffix != undefined ? <span title={row.original.editorName} className="workmember ms-1 bg-fxdark mt--2" >{row.original.editorSuffix}</span>
                    : <img title={row.original.editorDefaultName} className='workmember ms-1 mt--2' src={`${row.original.editorDefaultImage}`} alt="" />}
              </a>
            </>,
          filterFn: (row: any, columnName: any, filterValue: any) => {
            if (row?.original?.editorName?.toLowerCase()?.includes(filterValue?.toLowerCase()) || row?.original?.modifiedNew?.includes(filterValue)) {
              return true
            } else {
              return false
            }
          },
          id: 'modifiedNew',
          resetColumnFilters: false,
          isColumnDefultSortingDesc: true,
          resetSorting: false,
          placeholder: "Modified",
          header: "",
          size: 145,
        }

        , {
          accessorKey: "Created",
          cell: ({ row }) =>
            <>
              {row.original.createdNew}
              <a data-interception="off" target='_blank' href={`${baseUrl}/SitePages/TaskDashboard.aspx?UserId=${row.original.authorId}&Name=${row.original.authorName}`}>
                {row.original.authorImage != undefined ?
                  <img title={row.original.authorName} className='workmember ms-1 mt--2' src={`${row.original.authorImage}`} alt="" />
                  : row.original.authorSuffix != undefined ? <span title={row.original.authorName} className="workmember ms-1 bg-fxdark mt--2" >{row.original.authorSuffix}</span>
                    : <img title={row.original.authorDefaultName} className='workmember ms-1 mt--2' src={`${row.original.authorDefaultImage}`} alt="" />}
              </a>
            </>,
          filterFn: (row: any, columnName: any, filterValue: any) => {
            if (row?.original?.authorName?.toLowerCase()?.includes(filterValue?.toLowerCase()) || row?.original?.createdNew?.includes(filterValue)) {
              return true
            } else {
              return false
            }
          },
          id: 'createdNew',
          resetColumnFilters: false,
          resetSorting: false,
          placeholder: "Created",
          header: "",
          size: 145,
        }        // , {
        //   id: 'updateSmartPages',
        //   cell: ({ row }) =>

        //     <>
        //       <div className="mt--2" onClick={() => editPopUp(row.original)}><span className="alignIcon svg__iconbox svg__icon--edit"></span></div>
        //     </>,

        // }
        , {
          id: 'delteSmartPages',
          cell: ({ row }) =>
            <div className="alignCenter">
            <span onClick={() => deleteData(row.original)} title="Delete" className="svg__iconbox svg__icon--trash"></span>
            </div>
        }

      ], [allSiteData])
  }
  else if (type == 'SMART METADATA') {
    columns = React.useMemo<ColumnDef<any, unknown>[]>(() =>
      [
        {
          accessorKey: "",
          placeholder: "",
          hasCheckbox: true,
          size: 5,
          id: 'Id',
        },

        {
          accessorKey: "Title", placeholder: "Title", header: "", id: "Title",
          cell: ({ row }) =>
            <span>{row.original.Title}</span>
        },
        {
          accessorFn: (row: any) => row?.Modified,
          cell: ({ row }) =>
            <>
              {row.original.modifiedNew}
              <a data-interception="off" target='_blank' href={`${baseUrl}/SitePages/TaskDashboard.aspx?UserId=${row.original.editorId}&Name=${row.original.editorName}`}>
                {row.original.editorImage != undefined ?
                  <img title={row.original.editorName} className='workmember ms-1' src={`${row.original.editorImage}`} alt="" />
                  : row.original.editorSuffix != undefined ? <span title={row.original.editorName} className="workmember ms-1 bg-fxdark" >{row.original.editorSuffix}</span>
                    : <img title={row.original.editorDefaultName} className='workmember ms-1' src={`${row.original.editorDefaultImage}`} alt="" />}
              </a>
            </>,
          filterFn: (row: any, columnName: any, filterValue: any) => {
            if (row?.original?.editorName?.toLowerCase()?.includes(filterValue?.toLowerCase()) || row?.original?.modifiedNew?.includes(filterValue)) {
              return true
            } else {
              return false
            }
          },
          id: "modifiedNew",
          resetColumnFilters: false,
          isColumnDefultSortingDesc: true,
          resetSorting: false,
          placeholder: "Modified",
          header: "",
          size: 145,
        }
        , {
          accessorKey: "Created",
          cell: ({ row }) =>
            <>
              {row.original.createdNew}
              <a data-interception="off" target='_blank' href={`${baseUrl}/SitePages/TaskDashboard.aspx?UserId=${row.original.authorId}&Name=${row.original.authorName}`}>
                {row.original.authorImage != undefined ?
                  <img title={row.original.authorName} className='workmember ms-1 mt--2' src={`${row.original.authorImage}`} alt="" />
                  : row.original.authorSuffix != undefined ? <span title={row.original.authorName} className="workmember ms-1 bg-fxdark mt--2" >{row.original.authorSuffix}</span>
                    : <img title={row.original.authorDefaultName} className='workmember ms-1 mt--2' src={`${row.original.authorDefaultImage}`} alt="" />}
              </a>
            </>,
          filterFn: (row: any, columnName: any, filterValue: any) => {
            if (row?.original?.authorName?.toLowerCase()?.includes(filterValue?.toLowerCase()) || row?.original?.createdNew?.includes(filterValue)) {
              return true
            } else {
              return false
            }
          },
          id: 'createdNew',
          resetColumnFilters: false,
          resetSorting: false,
          placeholder: "Created",
          header: "",
          size: 145,
        }
        // , 
        // {
        //   id: 'updateSmartMetaData', size: 25,
        //   cell: ({ row }) =>

        //     <>
        //       <div className="mt--2" onClick={() => editPopUp(row.original)}><span className="alignIcon svg__iconbox svg__icon--edit"></span></div>
        //     </>,

        // }
        , {
          id: 'delteSmartMetaData', size: 25,
          cell: ({ row }) =>
            <div className="alignCenter">
              <span onClick={() => deleteData(row.original)} title="Delete" className="svg__iconbox svg__icon--trash"></span>
            </div>

        }

      ], [allSiteData])
  }
  else if (type == 'CONTACTS') {
    columns = React.useMemo<ColumnDef<any, unknown>[]>(() =>
      [
        {
          accessorKey: "",
          placeholder: "",
          hasCheckbox: true,
          size: 55,
          id: 'Id',
        },
        {
          accessorKey: "FirstName", placeholder: "FirstName", header: "", id: "FirstName",
          cell: ({ row }) =>
            <>
              <span>{row.original.FirstName}</span>
            </>
        },
        {
          accessorKey: "Title", placeholder: "LastName", header: "", id: "Title",
          cell: ({ row }) =>
            <>
              <span>{row.original.Title}</span>
            </>
        },
        {
          accessorKey: "FullName", placeholder: "FullName", header: "", id: "FullName",
          cell: ({ row }) =>
            <>
              <a data-interception="off" target='_blank' href={`${baseUrl}/SitePages/Contact-Profile.aspx?contactId=${row.original.Id}`}>
                {row.original.FullName}
              </a>
            </>
        },
        {
          accessorKey: 'Modified', cell: ({ row }) =>
            <>
              {row.original.modifiedNew}
              <img title={row.original.editorName} className='workmember ms-1 mt--2' src={`${row.original.editorDefaultImage}`} alt="" />
            </>,
          filterFn: (row: any, columnName: any, filterValue: any) => {
            if (row?.original?.editorName?.toLowerCase()?.includes(filterValue?.toLowerCase()) || row?.original?.modifiedNew?.includes(filterValue)) {
              return true
            } else {
              return false
            }
          },
          id: 'modifiedNew',
          resetColumnFilters: false,
          isColumnDefultSortingDesc: true,
          resetSorting: false,
          placeholder: "Modified",
          header: "",
          size: 145,
        }
        , {
          accessorKey: "Created",
          cell: ({ row }) =>
            <>
              {row.original.createdNew}
              <img title={row.original.editorName} className='workmember ms-1 mt--2' src={`${row.original.authorDefaultImage}`} alt="" />
            </>,
          filterFn: (row: any, columnName: any, filterValue: any) => {
            if (row?.original?.authorName?.toLowerCase()?.includes(filterValue?.toLowerCase()) || row?.original?.createdNew?.includes(filterValue)) {
              return true
            } else {
              return false
            }
          },
          id: 'createdNew',
          resetColumnFilters: false,
          resetSorting: false,
          placeholder: "Created",
          header: "",
          size: 145,
        },
        // {

        //   id: 'updateContact',
        //   cell: ({ row }) =>
        //     <>
        //       <div className="mt--2" onClick={() => editContactOpen(row.original)}><span className="alignIcon svg__iconbox svg__icon--edit"></span></div>
        //     </>

        // },
        {
          id: 'deleteContact',
          cell: ({ row }) =>
            <div className="alignCenter">
              <span onClick={() => deleteData(row.original)} title="Delete" className="svg__iconbox svg__icon--trash"></span>
            </div>

        }
      ], [allSiteData])
  }
  else if (type == "EVENTS") {
    columns = React.useMemo<ColumnDef<any, unknown>[]>(() =>
      [
        {
          accessorKey: "",
          placeholder: "",
          hasCheckbox: true,
          size: 55,
          id: 'Id',
        },
        {
          accessorKey: "Title", placeholder: "Title", header: "", id: "Title",
          cell: ({ row }) =>
            <>
              <a data-interception="off" target='_blank' href={`${baseUrl}/SitePages/EventDetail.aspx?ItemID=${row.original.Id}&Site=${row.original.siteUse}`}>
                {row.original.Title}
              </a>
            </>
        },
        {
          accessorKey: "ItemRank", placeholder: "ItemRank", header: "", id: "ItemRank",
          cell: ({ row }) =>
            <>
              <a data-interception="off" target='_blank' href={`${baseUrl}/SitePages/Event-detail.aspx?ItemID=${row.original.Id}`}>
                {row.original.ItemRank}
              </a>
            </>
        },
        {
          accessorKey: "eventDate", placeholder: "Event Date", header: "", id: "eventDate",
          cell: ({ row }) =>
            <>
              <a target='_blank' href={`${baseUrl}/SitePages/Contact-Profile.aspx?contactId=${row.original.SmartContactId}`}>
                {row.original.eventDate}
              </a>
            </>
        },
        {
          accessorKey: 'Modified', cell: ({ row }) =>
            <>
              {row.original.modifiedNew}
              <img title={row.original.editorName} className='workmember ms-1 mt--2' src={`${row.original.editorDefaultImage}`} alt="" />
            </>,
          filterFn: (row: any, columnName: any, filterValue: any) => {
            if (row?.original?.editorName?.toLowerCase()?.includes(filterValue?.toLowerCase()) || row?.original?.modifiedNew?.includes(filterValue)) {
              return true
            } else {
              return false
            }
          },
          id: 'modifiedNew',
          resetColumnFilters: false,
          isColumnDefultSortingDesc: true,
          resetSorting: false,
          placeholder: "Modified",
          header: "",
          size: 145,
        }
        , {
          accessorKey: "Created",
          cell: ({ row }) =>
            <>
              {row.original.createdNew}
              <img title={row.original.editorName} className='workmember ms-1 mt--2' src={`${row.original.authorDefaultImage}`} alt="" />
            </>,
          filterFn: (row: any, columnName: any, filterValue: any) => {
            if (row?.original?.authorName?.toLowerCase()?.includes(filterValue?.toLowerCase()) || row?.original?.createdNew?.includes(filterValue)) {
              return true
            } else {
              return false
            }
          },
          id: 'createdNew',
          resetColumnFilters: false,
          resetSorting: false,
          placeholder: "Created",
          header: "",
          size: 145,
        },
        // {

        //   id: 'updateEvents',
        //   cell: ({ row }) =>
        //     <>
        //       <div className="mt--2" onClick={() => editEvents(row.original)}><span className="alignIcon svg__iconbox svg__icon--edit"></span></div>
        //     </>

        // },
        {
          id: 'deleteEvents',
          cell: ({ row }) =>
            <div className="alignCenter">
             <span onClick={() => deleteData(row.original)} title="Delete" className="svg__iconbox svg__icon--trash"></span>
            </div>

        }
      ], [allSiteData])
  }
  else if (type == "NEWS") {
    columns = React.useMemo<ColumnDef<any, unknown>[]>(() =>
      [
        {
          accessorKey: "",
          placeholder: "",
          hasCheckbox: true,
          size: 55,
          id: 'Id',
        },
        {
          accessorKey: "Title", placeholder: "Title", header: "", id: "Title",
          cell: ({ row }) =>
            <>
              <a data-interception="off" target='_blank' href={`${baseUrl}/SitePages/Event-detail.aspx?ItemID=${row.original.Id}&Site=GmbH`}>
                {row.original.Title}
              </a>
            </>
        },
        {
          accessorKey: "ItemRank", placeholder: "ItemRank", header: "", id: "ItemRank",
          cell: ({ row }) =>
            <>
              <a data-interception="off" target='_blank' href={`${baseUrl}/SitePages/Event-detail.aspx?ItemID=${row.original.Id}&Site=GmbH`}>
                {row.original.ItemRank}
              </a>
            </>
        },
        {
          accessorKey: 'Modified', cell: ({ row }) =>
            <>
              {row.original.modifiedNew}
              <a target='_blank' href={`${baseUrl}/SitePages/TaskDashboard.aspx?UserId=${row.original.editorId}&Name=${row.original.editorName}`}>
                {row.original.editorImage != undefined ?
                  <img title={row.original.editorName} className='workmember ms-1' src={`${row.original.editorImage}`} alt="" />
                  : row.original.editorSuffix != undefined ? <span title={row.original.editorName} className="workmember ms-1 bg-fxdark" >{row.original.editorSuffix}</span>
                    : <img title={row.original.editorDefaultName} className='workmember ms-1' src={`${row.original.editorDefaultImage}`} alt="" />}
              </a>
            </>,
          filterFn: (row: any, columnName: any, filterValue: any) => {
            if (row?.original?.editorName?.toLowerCase()?.includes(filterValue?.toLowerCase()) || row?.original?.modifiedNew?.includes(filterValue)) {
              return true
            } else {
              return false
            }
          },
          id: 'modifiedNew',
          resetColumnFilters: false,
          isColumnDefultSortingDesc: true,
          resetSorting: false,
          placeholder: "Modified",
          header: "",
          size: 145,
        }
        , {
          accessorKey: "Created",
          cell: ({ row }) =>
            <>
              {row.original.createdNew}
              <a data-interception="off" target='_blank' href={`${baseUrl}/SitePages/TaskDashboard.aspx?UserId=${row.original.authorId}&Name=${row.original.authorName}`}>
                {row.original.authorImage != undefined ?
                  <img title={row.original.authorName} className='workmember ms-1 mt--2' src={`${row.original.authorImage}`} alt="" />
                  : row.original.authorSuffix != undefined ? <span title={row.original.authorName} className="workmember ms-1 bg-fxdark mt--2" >{row.original.authorSuffix}</span>
                    : <img title={row.original.authorDefaultName} className='workmember ms-1 mt--2' src={`${row.original.authorDefaultImage}`} alt="" />}
              </a>
            </>,
          filterFn: (row: any, columnName: any, filterValue: any) => {
            if (row?.original?.authorName?.toLowerCase()?.includes(filterValue?.toLowerCase()) || row?.original?.createdNew?.includes(filterValue)) {
              return true
            } else {
              return false
            }
          },
          id: 'createdNew',
          resetColumnFilters: false,
          resetSorting: false,
          placeholder: "Created",
          header: "",
          size: 145,
        },
        // {

        //   id: 'updateNews',
        //   cell: ({ row }) =>
        //     <>
        //       <div className="mt--2" onClick={() => editEvents(row.original)}><span className="alignIcon svg__iconbox svg__icon--edit"></span></div>
        //     </>

        // },
        {
          id: 'deleteNews',
          cell: ({ row }) =>
            <div className="alignCenter">
            <span onClick={() => deleteData(row.original)} title="Delete" className="svg__iconbox svg__icon--trash"></span>
        </div>
        }
      ], [allSiteData])
  }
  else if (type == 'COMPONENTS' || type == 'SERVICES' || type == 'PORTFOLIO') {
    columns = React.useMemo<ColumnDef<any, unknown>[]>(() =>

      [
        {
          accessorKey: "",
          placeholder: "",
          hasCheckbox: true,
          size: 5,
          id: 'Id',
        }, {
          accessorKey: 'PortfolioStructureID', placeholder: 'ID', header: "", id: 'PortfolioStructureID',
          cell: ({ row }) =>
            <div className="alignCenter">
              <span className='Dyicons mx-1 '>{row?.original?.ItemType?.toUpperCase()?.charAt(0)}
                                </span>
              <span style={row?.original?.fontColorTask != undefined ? { color: `${row?.original?.fontColorTask}` } : { color: '' }}>{row.original.PortfolioStructureID}</span>
              </div>
        },
        {
          accessorKey: "Title", placeholder: "Component Name", header: "", id: "Title",
          cell: ({ row }) =>
            <div>  <a data-interception="off" style={row?.original?.fontColorTask != undefined ? { color: `${row?.original?.fontColorTask}` } : { color: '' }} target='_blank' href={`${baseUrl}/SitePages/Portfolio-Profile.aspx?taskId=${row.original.Id}`}>
              {row.original.Title}
            </a></div>

        },
        {
          accessorKey: 'DueDate',
          cell: ({ row }) =>
            <>
              <span style={row?.original?.fontColorTask != undefined ? { color: `${row?.original?.fontColorTask}` } : { color: '' }}>
                {row.original.dueDateNew}
              </span>
            </>
          , filterFn: (row: any, columnName: any, filterValue: any) => {
            if (row?.original?.dueDateNew?.includes(filterValue)) {
              return true
            } else {
              return false
            }
          },
          id: 'dueDateNew',
          resetColumnFilters: false,
          resetSorting: false,
          placeholder: "DueDate",
          header: "",
          size: 90,
        },
        {
          accessorKey: 'PercentCompleteShow', placeholder: '%', header: '', id: 'PercentCompleteShow',

        },
        {
          accessorKey: 'PriorityRank', placeholder: 'Priority', header: '', id: 'PriorityRank',
        },
        {
          accessorKey: 'Modified'
          , cell: ({ row }) =>
            <>
              <span style={row?.original?.fontColorTask != undefined ? { color: `${row?.original?.fontColorTask}` } : { color: '' }}>
                {row.original.modifiedNew}
              </span>
              <a data-interception="off" target='_blank' href={`${baseUrl}/SitePages/TaskDashboard.aspx?UserId=${row.original.editorId}&Name=${row.original.editorName}`}>
                {row.original.editorImage != undefined ?
                  <img title={row.original.editorName} className='workmember ms-1' src={`${row.original.editorImage}`} alt="" />
                  : row.original.editorSuffix != undefined ? <span title={row.original.editorName} className="workmember ms-1 bg-fxdark" >{row.original.editorSuffix}</span>
                    : <img title={row.original.editorDefaultName} className='workmember ms-1' src={`${row.original.editorDefaultImage}`} alt="" />}
              </a>
            </>
          , filterFn: (row: any, columnName: any, filterValue: any) => {
            if (row?.original?.editorName?.toLowerCase()?.includes(filterValue?.toLowerCase()) || row?.original?.modifiedNew?.includes(filterValue)) {
              return true
            } else {
              return false
            }
          },
          id: 'modifiedNew',
          resetColumnFilters: false,
          isColumnDefultSortingDesc: true,
          resetSorting: false,
          placeholder: "Modified",
          header: "",
          size: 145,

        }
        , {
          accessorKey: "Created",
          cell: ({ row }) =>
            <>
              <span style={row?.original?.fontColorTask != undefined ? { color: `${row?.original?.fontColorTask}` } : { color: '' }}>
                {row.original.createdNew}
              </span>
              <a data-interception="off" target='_blank' href={`${baseUrl}/SitePages/TaskDashboard.aspx?UserId=${row.original.authorId}&Name=${row.original.authorName}`}>
                {row.original.authorImage != undefined ?
                  <img title={row.original.authorName} className='workmember ms-1 mt--2' src={`${row.original.authorImage}`} alt="" />
                  : row.original.authorSuffix != undefined ? <span title={row.original.authorName} className="workmember ms-1 mt--2 bg-fxdark" >{row.original.authorSuffix}</span>
                    : <img title={row.original.authorDefaultName} className='workmember ms-1 mt--2' src={`${row.original.authorDefaultImage}`} alt="" />}
              </a>
            </>
          , filterFn: (row: any, columnName: any, filterValue: any) => {
            if (row?.original?.authorName?.toLowerCase()?.includes(filterValue?.toLowerCase()) || row?.original?.createdNew?.includes(filterValue)) {
              return true
            } else {
              return false
            }
          },
          id: 'createdNew',
          resetColumnFilters: false,
          resetSorting: false,
          placeholder: "Created",
          header: "",
          size: 145,
        }, {

          id: 'updateComponent',
          cell: ({ row }) =>
          
            <div className="alignCenter">
             <span onClick={() => editComponentPopUp(row.original)} title="Edit" className="svg__iconbox svg__icon--edit"></span>
              </div>

        },
        {
          id: 'deleteComponent',
          cell: ({ row }) =>
            <div className="alignCenter">
            <span onClick={() => deleteData(row.original)} title="Delete" className="svg__iconbox svg__icon--trash"></span>
        </div>
        },
      ], [allSiteData])
  }
  else {
    columns = React.useMemo<ColumnDef<any, unknown>[]>(() =>
      [
        {
          accessorKey: "",
          placeholder: "",
          hasCheckbox: true,
          size: 5,
          id: 'Id',
        }, {
          accessorFn: (row) => row?.TaskID,
          cell: ({ row, getValue }) => (
               <div className="alignCenter">
               <img className='me-1 workmember' src={`${row?.original?.SiteIcon}`}></img> 
              <ReactPopperTooltipSingleLevel CMSToolId={getValue()} row={row?.original} AllListId={editLists} singleLevel={true} masterTaskData={masterTaskData} AllSitesTaskData={allSiteData} />
              </div>
          ),
          id: "TaskID",
          placeholder: "ID",
          header: "",
          resetColumnFilters: false,
          size: 90,
        },
        {
          accessorKey: "Title",
          cell: ({ row }) => (
            <div className="alignCenter">
              <span className={row.original.Title != undefined ? "hover-text hreflink m-0  sxsvc" : "hover-text hreflink m-0  cssc"}>
                <>{row.original.Title != undefined ? <a className="manageText" style={row?.original?.fontColorTask != undefined ? { color: `${row?.original?.fontColorTask}` } : { color: '' }} data-interception="off" target='_blank' href={`${baseUrl}/SitePages/Task-Profile.aspx?taskId=${row.original.Id}&Site=${row.original.siteType}`}>
                  {row.original.Title}
                </a> : ''}</>
                <span className="tooltip-text pop-right">
                  {row.original.Title != undefined ?

                    row.original.Title : ""}
                </span>
              </span>

              {row?.original?.descriptionsSearch?.length > 0 && <span className='alignIcon  mt--5 '><InfoIconsToolTip Discription={row?.original?.descriptionsSearch} row={row?.original} /></span>}
            </div>
          ),
          id: "Title",
          placeholder: "Title", header: "",
        },
        {
          accessorKey: 'PortfolioTitle', placeholder: 'Component', header: '', id: 'PortfolioTitle',
          cell: ({ row }) =>
            <a style={row?.original?.fontColorTask != undefined ? { color: `${row?.original?.fontColorTask}` } : { color: '' }} data-interception="off" target='_blank' href={`${baseUrl}/SitePages/Portfolio-Profile.aspx?taskId=${row.original.PortfolioID}`}>
              {row.original.PortfolioTitle}
            </a>
        },
        {
          accessorFn: (row: any) => row?.DueDate,
          cell: ({ row }) =>
            <>
              {row.original.dueDateNew}
            </>
          , filterFn: (row: any, columnName: any, filterValue: any) => {
            if (row?.original?.dueDateNew?.includes(filterValue)) {
              return true
            } else {
              return false
            }
          },
          id: 'DueDate',
          resetColumnFilters: false,
          resetSorting: false,
          placeholder: "DueDate",
          header: "",
          size: 90,
        },
        {
          accessorKey: 'PercentCompleteShow', placeholder: '%', header: '', id: 'PercentCompleteShow'

        },
        {
          accessorKey: 'PriorityRank', placeholder: 'Priority', header: '', id: 'PriorityRank'
        },
        {
          accessorKey: "teamUserName", placeholder: "Team Member", header: "", size: 100, id: "teamUserName",
          cell: ({ row }) =>
            <>
              <ShowTaskTeamMembers props={row.original} TaskUsers={allUsers} />
            </>
        }
        ,
        {
          accessorFn: (row: any) => row?.Modified,
          cell: ({ row }) =>
            <>
              {row.original.modifiedNew}
              <a data-interception="off" target='_blank' href={`${baseUrl}/SitePages/TaskDashboard.aspx?UserId=${row.original.editorId}&Name=${row.original.editorName}`}>
                {row.original.editorImage != undefined ?
                  <img title={row.original.editorName} className='workmember ms-1 mt--2' src={`${row.original.editorImage}`} alt="" />
                  : row.original.editorSuffix != undefined ? <span title={row.original.editorName} className="workmember mt--2 ms-1 bg-fxdark" >{row.original.editorSuffix}</span>
                    : <img title={row.original.editorDefaultName} className='workmember ms-1 mt--2' src={`${row.original.editorDefaultImage}`} alt="" />}
              </a>
            </>,
          filterFn: (row: any, columnName: any, filterValue: any) => {
            if (row?.original?.editorName?.toLowerCase()?.includes(filterValue?.toLowerCase()) || row?.original?.modifiedNew?.includes(filterValue)) {
              return true
            } else {
              return false
            }
          },
          id: 'modifiedNew',
          resetColumnFilters: false,
          isColumnDefultSortingDesc: true,
          resetSorting: false,
          placeholder: "Modified",
          header: "",
          size: 145,
        }

        , {
          accessorKey: "Created",
          cell: ({ row }) =>
            <>
              {row.original.createdNew}
              <a data-interception="off" target='_blank' href={`${baseUrl}/SitePages/TaskDashboard.aspx?UserId=${row.original.authorId}&Name=${row.original.authorName}`}>
                {row.original.authorImage != undefined ?
                  <img title={row.original.authorName} className='workmember ms-1' src={`${row.original.authorImage}`} alt="" />
                  : row.original.authorSuffix != undefined ? <span title={row.original.authorName} className="workmember ms-1 bg-fxdark" >{row.original.authorSuffix}</span>
                    : <img title={row.original.authorDefaultName} className='workmember ms-1' src={`${row.original.authorDefaultImage}`} alt="" />}
              </a>
            </>,
          filterFn: (row: any, columnName: any, filterValue: any) => {
            if (row?.original?.authorName?.toLowerCase()?.includes(filterValue?.toLowerCase()) || row?.original?.createdNew?.includes(filterValue)) {
              return true
            } else {
              return false
            }
          },
          id: 'createdNew',
          resetColumnFilters: false,
          resetSorting: false,
          placeholder: "Created",
          header: "",
          size: 145,
        }, {
          id: 'updateTask',
          cell: ({ row }) =>
            <div className="alignCenter">
              <span onClick={() => editPopUp(row.original)} title="Edit" className="svg__iconbox svg__icon--edit"></span>
           </div>
          

        }
        , {
          id: 'delteTask',
          cell: ({ row }) =>
            <div className="alignCenter">
            <span onClick={() => deleteData(row.original)} title="Delete" className="svg__iconbox svg__icon--trash"></span>
            </div>
        }

      ], [allSiteData])
  }
  return (
    <>
    <div className="section container">
    <header className="page-header text-center"><h1 className="page-title">Last Modified Views</h1></header>
      {/* <nav className="lastmodify"> */}
        <ul className="nav nav-tabs" id="nav-tab" role="tablist">
          {
            sites && sites.map((siteValue: any) =>
               <>
                <button disabled={!isButtonDisabled} onClick={() => { getCurrentData(siteValue); }} className={`nav-link ${siteValue.TabName == sites[0].TabName ? 'active' : ''}`} id={`nav-${siteValue.TabName}-tab`} data-bs-toggle="tab" data-bs-target={`#nav-${siteValue.TabName}`} type="button" role="tab" aria-controls="nav-home" aria-selected="true">{siteValue.DisplaySiteName}</button>
              </>
            )
          }
          {/* <button style={{ position: 'relative', left: '180px', }} onClick={() => multipleDeleteFunction(multipleDelete)}><span className="alignIcon svg__iconbox hreflink mini svg__icon--trash"></span></button> */}
        </ul>
      {/* </nav> */}


      <div className="tab-content lastmodifylist px-2 clearfix" id="nav-tabContent">
        <div className="tab-pane fade show active" id={`nav-${type}`} role="tabpanel" aria-labelledby={`nav-${type}-tab`}>
          {allSiteData &&
            <div className="TableSection">
                <div className="Alltable mt-2">
                  <div className="col-md-12 p-0 smart">
                    <div className="wrapper">
                      <GlobalCommanTable hideOpenNewTableIcon={true} hideTeamIcon={true} columns={columns} ref={childRef} data={allSiteData} showHeader={true} callBackData={callBackData} multiSelect={true}  TaskUsers={allUsers}  AllListId={editLists} />
                    </div>
                  </div>
                </div>
              
              {/* <div className="clearfix"></div> */}
            </div>
          }
        </div>
      </div>
      </div>
      {!loader && <PageLoader />}
      {editTaskPopUpOpen ? <EditTaskPopup Items={editValue} context={context} AllListId={editLists} pageName={"TaskFooterTable"} Call={(Type: any) => { editTaskCallBack(Type) }} /> : ''}
      {editComponentPopUps ? <EditComponent item={editValue} SelectD={editLists} Calls={closeEditComponent} portfolioTypeData={Portfoliotyped} /> : ''}
      {editDocPopUpOpen ? <EditDocumentpanel callbackeditpopup={callbackeditpopup} AllListId={editLists} Item={editValue} editData={editValue} Keydoc={true} Context={context} /> : ''}
      {/* {editWebPagePopUp?<EditPage context={editLists} Item={editValue} changes={changes}  updatedWebpages={updatedWebpages} />: ''} */}
        {/* {editInstitutionPopUp ? 
        <EditContactPopup allListId={editLists} props={editValue} callBack={CloseConatactPopup} EditCallBackItem={EditCallBackItem}  /> 
        : null} */}
    
      {istimeEntryOpen && (<TimeEntryPopup props={currentTimeEntry} CallBackTimeEntry={TimeEntryCallBack} Context={editLists.Context}></TimeEntryPopup>)}
      {/* {isEditEvent?
      <EditEventCardPopup EditEventData={editValue} allListId={editLists} callBack={CallbackEvent} ></EditEventCardPopup>
      :''} */}
    </>
  )
  // fixedWidth={true}
}