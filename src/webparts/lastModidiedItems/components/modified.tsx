import Loader from "react-loader"
import moment from 'moment';
import { ColumnDef } from '@tanstack/react-table'
import React, { useEffect, useState } from 'react'
import { Web } from "sp-pnp-js"
import GlobalCommanTable from '../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable';
import * as globalCommon from "../../../globalComponents/globalCommon";
import ShowTaskTeamMembers from '../../../globalComponents/ShowTaskTeamMembers'
import EditTaskPopup from '../../../globalComponents/EditTaskPopup/EditTaskPopup';
import EditComponent from '../../EditPopupFiles/EditComponent'
import DocumentPopup from '../../documentSearch/components/DocumentPopup';
export const Modified = (props: any) => {
  let columns: any = [];
  var baseUrl: any = props?.props?.context?._pageContext?.web?.absoluteUrl;
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
  const [editTasksLists, setEditTasksLists] = useState<any>();
  const [editComponentLists, setEditComponentLists] = useState<any>();
  const [Portfoliotyped, setPortfoliotyped] = useState<any>();
  const [editDocLists, setEditDocLists] = useState<any>();
  const [loader,setLoader]=useState<any>(false);
  let context = props?.props?.context
  let allDataFinal: any = [];
  let allSitesDummy: any = [];
  let siteNumber: number = 0;
  let Users: any;
  let currentAll: any = []
  useEffect(() => {
    getAllUsers()
    getSites();
  }, []);

  const getAllUsers = async () => {

    Users = await globalCommon.loadTaskUsers();

    setAllUsers(Users)
    const editListsTasks = {
      TaskUsertListID: props?.props?.TaskUsertListID,
      SmartMetadataListID: props?.props?.SmartMetadataListID,
      MasterTaskListID: props?.props.MasterTaskListID,
      TaskTimeSheetListID: props?.props?.TaskTimeSheetListID,
      DocumentsListID: props?.props?.DocumentsListID,
      SmartInformation: props?.props?.SmartInformation,
      TaskTypeID: props?.props?.TaskTypeID,
      TimeEntry: props?.props?.TimeEntry,
      SiteCompostion: props?.props.SiteCompostion,
      siteUrl: baseUrl,
      Context: props?.props?.context
    }
    setEditTasksLists(editListsTasks)

    const editListsComponents = {
      TaskUsertListID: props?.props?.TaskUsertListID,
      SmartMetadataListID: props?.props?.SmartMetadataListID,
      MasterTaskListID: props?.props.MasterTaskListID,
      DocumentsListID: props?.props?.DocumentsListID,
      TaskTypeID: props?.props?.TaskTypeID,
      SmartHelptListID: props?.props?.SmartHelptListID,
      PortFolioTypeID: props?.props?.PortFolioTypeID,
      SiteCompostion: props?.props.SiteCompostion,
      siteUrl: baseUrl,
      Context: props?.props?.context
    }
    setEditComponentLists(editListsComponents)
    const editDocLists = {
      DocumentListId: props?.props?.DocumentsListID,
      context: props?.props?.context,
      TaskUserListId: props?.props?.TaskUsertListID,
      MasterTaskListId: props?.props.MasterTaskListID
    }
    setEditDocLists(editDocLists)
  }
  const getSites = async function () {
    var web: any = new Web(baseUrl);
    var ActualSites: any = []
    try {
      var siteData = await web.lists.getById(props.props.ListConfigurationListId).items.select("Id,Key,Configuration,Value&$filter=Key eq 'LastModifiedItems'").getAll();
    } catch (error) {
      console.error(error)
    }
    ActualSites = JSON.parse(siteData[0].Configuration);
    ActualSites.map((sites: any) => {
      sites.noRepeat = false;
      sites.AllTask = false;


    })
    setSites(ActualSites)

    getCurrentData(ActualSites[0]);
  }
  const childRef = React.useRef<any>();
  const getCurrentData = async (allSite: any) => {
    childRef?.current?.setRowSelection({});
    setLoader(false);
    let web = new Web(baseUrl);
    setType(allSite.TabName);
    // to show all sites task data
    if (allSite.TabName == 'ALL') {
      if (allSite.noRepeat != true) {
        sites.map((allData: any) => {
          if (allData.TabName != 'DOCUMENTS' && allData.TabName != 'FOLDERS' && allData.TabName != 'COMPONENTS' && allData.TabName != 'SERVICES' && allData.TabName != 'ALL') {
            allSitesDummy.push(allData)
          }
        })
        allSitesDummy.map((check: any) => {
          check.AllTask = true;
          getCurrentData(check);
        })
        allSite.noRepeat = true;
        allSite.allNorepeat = true;
      } else {
        allSite.allNorepeat = false;
      }
    }
    if (allSite.AllTask != true) {
      setType(allSite.TabName);
      if (allSite.TabName != "ALL") {
        setTimeout(() => {
          sites.map((item: any) => {
            if (allSite.TabName == item?.TabName) {
              document.getElementById(`nav-${item?.TabName}`)?.classList.add('show');
              document.getElementById(`nav-${item?.TabName}`)?.classList.add('active');
              document.getElementById(`nav-${item.TabName}-tab`)?.classList.add('active');
            }
          })

        }, 400);
        
      }
    }
    // 
    if (allSite.noRepeat != true) {
      var selectQuerry: string = allSite.TabName == 'DOCUMENTS' ? 'Id,Title,FileLeafRef,File_x0020_Type,Modified,Created,EncodedAbsUrl,Author/Id,Author/Title,Editor/Id,Editor/Title&$filter=FSObjType eq 0'
        : allSite.TabName == 'FOLDERS' ? 'Id,Title,FileLeafRef,File_x0020_Type,Modified,Created,EncodedAbsUrl,Author/Id,Author/Title,Editor/Id,Editor/Title&$filter=FSObjType eq 1'
          : allSite.TabName == 'COMPONENTS' ? "Id,Title,PercentComplete,ItemType,DueDate,Created,Modified,TeamMembers/Id,ResponsibleTeam/Id,ResponsibleTeam/Title,Author/Id,Author/Title,AssignedTo/Id,AssignedTo/Title,Editor/Id,Priority,PriorityRank,PortfolioStructureID,ComponentCategory/Id,ComponentCategory/Title,PortfolioType/Id,PortfolioType/Title&$filter=PortfolioType/Title eq 'Component'"
            : allSite.TabName == 'SERVICES' ? "Id,Title,PercentComplete,ItemType,DueDate,Created,Modified,TeamMembers/Id,ResponsibleTeam/Id,ResponsibleTeam/Title,Author/Id,Author/Title,AssignedTo/Id,AssignedTo/Title,Editor/Id,Priority,PriorityRank,PortfolioStructureID,Services/Title,Services/Id,ComponentCategory/Id,ComponentCategory/Title,PortfolioType/Id,PortfolioType/Title&$filter=PortfolioType/Title eq 'Service'"
              : 'Id,Title,PercentComplete,DueDate,Created,Modified,TeamMembers/Id,ResponsibleTeam/Id,ResponsibleTeam/Title,TaskType/Id,TaskType/Title,Author/Id,Author/Title,AssignedTo/Id,AssignedTo/Title,Editor/Id,Priority,PriorityRank,Portfolio/Id,Portfolio/Title';
      var expandQuerey: string = allSite.TabName == 'DOCUMENTS' ? 'Author,Editor'
        : allSite.TabName == 'FOLDERS' ? 'Author,Editor'
          : allSite.TabName == 'COMPONENTS' ? 'PortfolioType,TeamMembers,ResponsibleTeam,Author,AssignedTo,Editor,ComponentCategory'
            : allSite.TabName == 'SERVICES' ? 'PortfolioType,TeamMembers,ResponsibleTeam,Author,AssignedTo,Editor,ComponentCategory,Services' :
              'TeamMembers,ResponsibleTeam,TaskType,Author,AssignedTo,Editor,Portfolio';
      var data: any = [];
      try {
        data = await web.lists.getById(allSite.ListId).items.select(selectQuerry).expand(expandQuerey).orderBy('Modified', false).top(200).get();
      }
      catch (error) {
        console.error(error)
      }
      if (allSite.TabName == 'DOCUMENTS' || allSite.TabName == 'FOLDERS' || allSite.TabName == 'COMPONENTS' || allSite.TabName == 'SERVICES') {
        data?.map((item: any) => {
          item.siteType = allSite?.TabName;
          item.listId = allSite.ListId;

          if (item.ItemType != undefined) {
            if (item.ItemType == 'Component') {
              item.photoComponent = allSite.SiteIcon1
            }
            if (item.ItemType == 'SubComponent') {
              item.photoComponent = allSite.SiteIcon2
            }
            if (item.ItemType == 'Feature') {
              item.photoComponent = allSite.SiteIcon3
            }
          }
          if (item.DueDate != undefined) {
            item.DueDate = moment(item?.DueDate).format('DD/MM/YYYY')
          }
          if (item.Modified != undefined) {
            item.Modified = moment(item?.Modified).format('DD/MM/YYYY');
          }
          if (item.Created != undefined) {
            item.Created = moment(item?.Created).format('DD/MM/YYYY')
          }
          if (allSite.TabName == 'FOLDERS') {
            item.File_x0020_Type = 'folder';
          }
          if (item.Author != undefined) {
            allUsers.map((Users: any) => {
              if (item.Author.Id == Users?.AssingedToUser?.Id) {
                item.authorImage = Users.Item_x0020_Cover?.Url;
                item.authorName = Users?.AssingedToUser?.Title;
                item.authorId = Users?.AssingedToUser?.Id
                item.authorDateSearch = item.Created + item.authorName;
              }
            })
          }
          if (item.Editor != undefined) {
            allUsers.map((Users: any) => {
              if (item.Editor.Id == Users?.AssingedToUser?.Id) {
                item.editorImage = Users.Item_x0020_Cover?.Url;
                item.editorName = Users?.AssingedToUser?.Title;
                item.editorId = Users?.AssingedToUser?.Id;
                item.editorDateSearch = item.Modified + item.editorName;
              }
            })
          }
        })
      }
      else {

        data?.map((item: any) => {
          item.siteType = allSite?.TabName
          item.listId = allSite.ListId;
          item.siteUrl = baseUrl;
          item.siteUrlOld = item.siteUrl.replace('/SP', '')
          item.siteImage = allSite?.SiteIcon;
          item.SiteIcon = item.siteUrlOld + item.siteImage
          item.AllusersName = [];
          item.TaskID = globalCommon.getTaskId(item);
          if (item.Modified != undefined) {
            item.Modified = moment(item?.Modified).format('DD/MM/YYYY HH:mm');
          }
          if (item.Created != undefined) {
            item.Created = moment(item?.Created).format('DD/MM/YYYY')
          }
          if (item.DueDate != undefined) {
            item.DueDate = moment(item?.DueDate).format('DD/MM/YYYY')
          }
          if (item.PercentComplete != undefined) {
            item.PercentComplete = parseInt((item.PercentComplete * 100).toFixed(0));
            item.PercentCompleteShow = item.PercentComplete + '%';
          }
          if (item.Author != undefined) {
            (Users != undefined ? Users : allUsers).map((Users: any) => {
              if (item.Author.Id == Users?.AssingedToUser?.Id) {
                item.authorImage = Users.Item_x0020_Cover?.Url;
                item.authorName = Users?.AssingedToUser?.Title;
                item.authorId = Users?.AssingedToUser?.Id;
                item.authorDateSearch = item.Created + item.authorName;
              }
            })
          }
          if (item.Editor != undefined) {
            (Users != undefined ? Users : allUsers).map((Users: any) => {
              if (item.Editor.Id == Users?.AssingedToUser?.Id) {
                item.editorImage = Users.Item_x0020_Cover?.Url;
                item.editorName = Users?.AssingedToUser?.Title;
                item.editorId = Users?.AssingedToUser?.Id;
                item.editorDateSearch = item.Modified + item.editorName;
              }
            })
          }
          if (item.Portfolio != undefined) {
            item.PortfolioTitle = item.Portfolio?.Title;
            item.PortfolioID = item.Portfolio?.Id
          }
          if (item.TeamMembers?.length > 0) {
            item?.TeamMembers?.map((teams: any) => {
              (Users != undefined ? Users : allUsers).map((users: any) => {
                if (teams?.Id == users.AssingedToUserId) {
                  item.AllusersName.push(users)
                }
              })
            })

          }
          if (item.ResponsibleTeam?.length > 0) {
            item.ResponsibleTeam?.map((teamLeader: any) => {
              (Users != undefined ? Users : allUsers).map((users: any) => {
                if (teamLeader?.Id == users.AssingedToUserId) {
                  item.AllusersName.push(users)
                }
              })
            })

          }
          if (item?.AllusersName?.length > 0) {
            item['teamUserName'] = '';
            item.AllusersName.forEach((items: any) => {
              item['teamUserName'] += items.Title + ' ';
            })
          }

        })
      }
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

          }, 400);
          setLoader(true);
        }
        allSite.AllTask = false;
      }
      else {
        setDuplicate([...duplicate, data])
        setallSiteData(data)
        setLoader(true);
      }
      allSite.noRepeat = true;
      
    }
    // This else block is used for do not call Api again,which has been loaded.
    else {
      var duplicateValue: any = [];
      if (allSite.TabName == 'ALL') {
        duplicate.map((dupData: any) => {
          dupData.map((items: any) => {
            if (items.siteType != 'DOCUMENTS' && items.siteType != 'FOLDERS' && items.siteType != 'COMPONENTS' && items.siteType != 'SERVICES') {
              duplicateValue.push(items)
            }
          })
        })
        if (allSite.allNorepeat != true) {
          setallSiteData(duplicateValue)
          setTimeout(() => {
            document.getElementById(`nav-ALL`)?.classList.add('show');
            document.getElementById(`nav-ALL`)?.classList.add('active');
            document.getElementById(`nav-ALL-tab`)?.classList.add('active');
          }, 300)
          setLoader(true);
        }
      }
      else {
        var currentvalue: any = [];
        duplicate.map((dupData: any) => {
          dupData.map((items: any) => {
            if (items.siteType == allSite.TabName) {
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
    if (allSite.AllTask != true &&  allSite.TabName!="ALL") {
    setLoader(true);
    }
  }

  const deleteData = (dlData: any) => {
    var flag = confirm(`Are you sure, you want to delete this id?`)
    if (flag == true) {
      globalCommon.deleteItemById(baseUrl, dlData.listId, dlData, dlData.Id).then(() => {
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
  const editComponentPopUp = (editComponentValue: any) => {
    setEditComponentPopUps(true)
    setPortfoliotyped(editComponentValue.PortfolioType.Title)
    setEditValue(editComponentValue);
  }
  const editDocOpen = (editDoc: any) => {
    setEditValue(editDoc.Id);
    seteditDocPopUpOpen(true);
  }
  const editTaskCallBack = (data: any) => {
    setEditTaskPopUpOpen(false);
    var updateData: any = data.data;
    updateData.DueDate = moment(updateData.DueDate).format('DD/MM/YYYY');
    allSiteData.map((data: any) => {
      if (data.Id == updateData.Id) {
        if (data.Title != updateData.Title) {
          data.Title = updateData.Title
        }
        if (data.PercentComplete != updateData.PercentComplete) {
          data.PercentComplete = updateData.PercentComplete
        }
        if (data.PriorityRank != updateData.PriorityRank) {
          data.PriorityRank = updateData.PriorityRank
        }
        if (data.DueDate != updateData.DueDate) {
          data.DueDate = updateData.DueDate
        }
        if (data?.Portfolio?.Id != updateData.Portfolio?.Id) {
          data.Portfolio.Id = updateData.Portfolio?.Id
          data.Portfolio.Tittle = updateData.Portfolio?.Title;
          data.PortfolioTitle = data.Portfolio.Tittle
          data.PortfolioID = data.Portfolio.Id
        }

        if (data.ResponsibleTeam != undefined) {
          data.ResponsibleTeam.map((dataResponsibleTeam: any) => {
            updateData.ResponsibleTeam.map((responsibleUpdate: any) => {
              if (responsibleUpdate.Id != dataResponsibleTeam.Id) {
                dataResponsibleTeam.Id = responsibleUpdate.Id
                dataResponsibleTeam.Title = responsibleUpdate.Title
              }
            })
          })
        }
        if (updateData.TeamMembers != undefined && data.TeamMembers != undefined) {
          data.TeamMembers = updateData.TeamMembers;
        }
        if (updateData.TeamMembers == undefined) {
          data.TeamMembers = undefined;
        }
        if (updateData.TeamMembers != undefined) {
          if (data.TeamMembers == undefined) {
            data.TeamMembers = updateData.TeamMembers
          }
        }
        if (data.TeamMembers != undefined) {
          data.TeamMembers.map((searUserName: any) => {
            data.teamUserName = searUserName.Title;
          })

        }
        if (updateData.ResponsibleTeam != undefined && data.ResponsibleTeam != undefined) {
          data.TeamMembers = updateData.TeamMembers;
        }

        if (updateData.ResponsibleTeam == undefined) {
          data.ResponsibleTeam = undefined;
        }
        if (updateData.ResponsibleTeam != undefined) {
          if (data.ResponsibleTeam == undefined) {
            data.ResponsibleTeam = updateData.ResponsibleTeam
          }
        }
        if (data.ResponsibleTeam != undefined) {
          data.ResponsibleTeam.map((searUserName: any) => {
            data.teamUserName = searUserName.Title;
          })

        }

      }
    })
    setallSiteData([...allSiteData])
  }

  const closeEditComponent = (item: any) => {
    setEditComponentPopUps(false)
    var updateData: any = item;

    allSiteData.map((data: any) => {
      if (data.Id == updateData.Id) {
        if (data.Title != updateData.Title) {
          data.Title = updateData.Title
        }
        if (data.PercentComplete != updateData.PercentComplete) {
          data.PercentComplete = updateData.PercentComplete
        }
        if (updateData.DueDate != undefined) {
          updateData.DueDate = moment(updateData.DueDate).format('DD/MM/YYYY');
          if (updateData.DueDate != data.DueDate) {
            data.DueDate = updateData.DueDate;
          }
        }
        if (data.PriorityRank != updateData.PriorityRank) {
          data.PriorityRank = updateData.PriorityRank
        }
      }
    })
    setallSiteData([...allSiteData])
  };
  const closeDocEditPopUp = () => {
    seteditDocPopUpOpen(false);
    sites.map((siteValue: any) => {
      if (siteValue.TabName == 'DOCUMENTS') {
        siteValue.noRepeat = false;
        getCurrentData(siteValue)
      }
    })
  }
  const callBackData = React.useCallback((elem: any, getSelectedRowModel: any, ShowingData: any) => {

    if (elem) {
      setMultipleDelete([elem]);
    } else {
      setMultipleDelete([]);
    }
  }, []);

  if (type == 'DOCUMENTS' || type == 'FOLDERS') {
    columns = React.useMemo<ColumnDef<any, unknown>[]>(() =>
      [
        {
          accessorKey: "",
          placeholder: "",
          hasCheckbox: true,
          hasCustomExpanded: true,
          hasExpanded: true,
          size: 55,
          id: 'Id',
        },
        {
          accessorKey: "FileLeafRef", placeholder: "Title", header: "",
          cell: ({ row }) =>
            <>
              {row.original.File_x0020_Type != undefined ? <span className={`alignIcon  svg__iconbox svg__icon--${row.original.File_x0020_Type}`}></span> : undefined}

              <a target='_blank' href={row.original.EncodedAbsUrl}>{row.original.FileLeafRef}</a>
            </>
        },
        {
          accessorKey: 'editorDateSearch', placeholder: 'Modified', header: ''
          , cell: ({ row }) =>
            <>
              {row.original.Modified}
              <a target='_blank' href={`${baseUrl}/SitePages/TaskDashboard.aspx?UserId=${row.original.editorId}&Name=${row.original.editorName}`}>
                {row.original.editorImage != undefined ?
                  <img title={row.original.editorName} className='workmember me-1' src={`${row.original.editorImage}`} alt="" /> : undefined}
              </a>
            </>

        }
        , {
          accessorKey: "authorDateSearch", placeholder: "Created Date", header: "",
          cell: ({ row }) =>
            <>
              {row.original.Created}
              <a target='_blank' href={`${baseUrl}/SitePages/TaskDashboard.aspx?UserId=${row.original.authorId}&Name=${row.original.authorName}`}>
                {row.original.authorImage != undefined ?
                  <img title={row.original.authorName} className='workmember me-1' src={`${row.original.authorImage}`} alt="" /> : undefined}
              </a>
            </>
        },
        {
          id: 'updateDoc',
          cell: ({ row }) =>
            <>
              {type == 'DOCUMENTS' ?
                <>
                  <a onClick={() => editDocOpen(row.original)}><span className="svg__iconbox svg__icon--edit"></span></a>
                </>
                : undefined}
            </>

        }
        , {
          id: 'deleteDoc',
          cell: ({ row }) =>
            <>
              {type == 'DOCUMENTS' ?
                <>
                  <a onClick={() => deleteData(row.original)}><span className="alignIcon svg__iconbox hreflink mini svg__icon--trash"></span></a>
                </>
                : undefined}
            </>

        }
      ], [allSiteData])
  }
  else if (type == 'COMPONENTS' || type == 'SERVICES') {
    columns = React.useMemo<ColumnDef<any, unknown>[]>(() =>

      [
        {
          accessorKey: "",
          placeholder: "",
          hasCheckbox: true,
          hasCustomExpanded: true,
          hasExpanded: true,
          size: 5,
          id: 'Id',
        }, {
          accessorKey: 'PortfolioStructureID', placeholder: 'Component Name', header: "",
          cell: ({ row }) =>
            <>
              <img className='workmember me-1' src={`${baseUrl}${row.original.photoComponent}`} alt="" />
              {row.original.PortfolioStructureID}
            </>
        },
        {
          accessorKey: "Title", placeholder: "Title", header: "",
          cell: ({ row }) =>
            <a target='_blank' href={`${baseUrl}/SitePages/Portfolio-Profile.aspx?taskId=${row.original.Id}`}>
              {row.original.Title}
            </a>
        },
        {
          accessorKey: 'DueDate', placeholder: 'DueDate', header: ''

        }
        ,
        {
          accessorKey: 'PercentCompleteShow', placeholder: '%', header: ''

        },
        {
          accessorKey: 'PriorityRank', placeholder: 'PriorityRank', header: ''
        },
        {
          accessorKey: 'editorDateSearch', placeholder: 'Modified', header: ''
          , cell: ({ row }) =>
            <>
              {row.original.Modified}
              <a target='_blank' href={`${baseUrl}/SitePages/TaskDashboard.aspx?UserId=${row.original.editorId}&Name=${row.original.editorName}`}>
                {row.original.editorImage != undefined ?
                  <img title={row.original.editorName} className='workmember me-1' src={`${row.original.editorImage}`} alt="" /> : undefined}
              </a>
            </>

        }
        , {
          accessorKey: "authorDateSearch", placeholder: "Created Date", header: "",
          cell: ({ row }) =>
            <>
              {row.original.Created}
              <a target='_blank' href={`${baseUrl}/SitePages/TaskDashboard.aspx?UserId=${row.original.authorId}&Name=${row.original.authorName}`}>
                {row.original.authorImage != undefined ?
                  <img title={row.original.authorName} className='workmember me-1' src={`${row.original.authorImage}`} alt="" /> : undefined}
              </a>
            </>
        }, {

          id: 'updateComponent',
          cell: ({ row }) =>
            <>
              <a onClick={() => editComponentPopUp(row.original)}><span className="svg__iconbox svg__icon--edit"></span></a>
            </>

        },
        {
          id: 'deleteComponent',
          cell: ({ row }) =>
            <>
              <a onClick={() => deleteData(row.original)}><span className="alignIcon svg__iconbox hreflink mini svg__icon--trash"></span></a>
            </>

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
          hasCustomExpanded: true,
          hasExpanded: true,
          size: 5,
          id: 'Id',
        }, {
          accessorKey: 'TaskID', placeholder: " TaskID", header: "",
          cell: ({ row }) =>
            <>
              {<img className='workmember me-1' src={`${row.original.SiteIcon}`}></img>}
              {row.original.TaskID}
            </>
        },
        {
          accessorKey: "Title", placeholder: "Title", header: "",
          cell: ({ row }) =>
            <a target='_blank' href={`${baseUrl}/SitePages/Task-Profile.aspx?taskId=${row.original.Id}&Site=${row.original.siteType}`}>
              {row.original.Title}
            </a>
        },
        {
          accessorKey: 'PortfolioTitle', placeholder: 'Component', header: '',
          cell: ({ row }) =>
            <a target='_blank' href={`${baseUrl}/SitePages/Portfolio-Profile.aspx?taskId=${row.original.PortfolioID}`}>
              {row.original.PortfolioTitle}
            </a>

        },
        {
          accessorKey: 'DueDate', placeholder: 'DueDate', header: ''

        }
        ,
        {
          accessorKey: 'PercentCompleteShow', placeholder: '%', header: ''

        },
        {
          accessorKey: 'PriorityRank', placeholder: 'PriorityRank', header: ''
        },
        {
          accessorKey: "teamUserName", placeholder: "Team Member", header: "",
          cell: ({ row }) =>
            <>
              <ShowTaskTeamMembers props={row.original} TaskUsers={allUsers} />
            </>
        }
        ,
        {
          accessorKey: 'editorDateSearch', placeholder: 'Modified', header: ''
          , cell: ({ row }) =>
            <>
              {row.original.Modified}
              <a target='_blank' href={`${baseUrl}/SitePages/TaskDashboard.aspx?UserId=${row.original.editorId}&Name=${row.original.editorName}`}>
                {row.original.editorImage != undefined ?
                  <img title={row.original.editorName} className='workmember me-1' src={`${row.original.editorImage}`} alt="" /> : undefined}
              </a>
            </>

        }
        , {
          accessorKey: "authorDateSearch", placeholder: "Created Date", header: "",
          cell: ({ row }) =>
            <>
              {row.original.Created}
              <a target='_blank' href={`${baseUrl}/SitePages/TaskDashboard.aspx?UserId=${row.original.authorId}&Name=${row.original.authorName}`}>
                {row.original.authorImage != undefined ?
                  <img title={row.original.authorName} className='workmember me-1' src={`${row.original.authorImage}`} alt="" /> : undefined}
              </a>
            </>
        }
        , {
          id: 'updateTask',
          cell: ({ row }) =>

            <>
              <a onClick={() => editPopUp(row.original)}><span className="svg__iconbox svg__icon--edit"></span></a>
            </>,

        }
        , {
          id: 'delteTask',
          cell: ({ row }) =>
            <>
              <a onClick={() => deleteData(row.original)}><span className="alignIcon svg__iconbox hreflink mini svg__icon--trash"></span></a>
            </>

        }

      ], [allSiteData])
  }

  return (
    <>
      <nav className="lastmodify">
        <div className="nav nav-tabs" id="nav-tab" role="tablist">
          {

            sites && sites.map((siteValue: any) =>
              <>
                <button onClick={() => { getCurrentData(siteValue); }} className={`nav-link ${siteValue.TabName == 'HHHH' ? 'active' : ''}`} id={`nav-${siteValue.TabName}-tab`} data-bs-toggle="tab" data-bs-target={`#nav-${siteValue.TabName}`} type="button" role="tab" aria-controls="nav-home" aria-selected="true">{siteValue.TabName}</button>
              </>
            )
          }
          <button style={{ position: 'relative', left: '180px', }} onClick={() => multipleDeleteFunction(multipleDelete)}><span className="alignIcon svg__iconbox hreflink mini svg__icon--trash"></span></button>
        </div>
      </nav>
      <Loader loaded={loader} lines={13} length={20} width={10} radius={30} corners={1} rotate={0} direction={1} color="#000066" speed={2} trail={60} shadow={false} hwaccel={false} className="spinner" zIndex={2e9} top="28%" left="50%" scale={1.0} loadedClassName="loadedContent" />
      <div className="tab-content lastmodifylist" id="nav-tabContent">
        <div className="tab-pane fade show active" id={`nav-${type}`} role="tabpanel" aria-labelledby={`nav-${type}-tab`}>
          {allSiteData && <div>
            <GlobalCommanTable columns={columns} ref={childRef} data={allSiteData} showHeader={true} callBackData={callBackData} multiSelect={true} />
          </div>}
        </div>

      </div>


      {editTaskPopUpOpen ? <EditTaskPopup Items={editValue} context={context} AllListId={editTasksLists} pageName={"TaskFooterTable"} Call={(Type: any) => { editTaskCallBack(Type) }} /> : ''}
      {editComponentPopUps ? <EditComponent item={editValue} SelectD={editComponentLists} Calls={closeEditComponent} portfolioTypeData={Portfoliotyped} /> : ''}
      {editDocPopUpOpen ? <DocumentPopup closeEditPopup={closeDocEditPopUp} pagecontext={editDocLists} Id={editValue} /> : ''}
    </>
  )
}
