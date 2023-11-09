import Loader from "react-loader"
import moment from 'moment';
import { ColumnDef } from '@tanstack/react-table'
import React, { useEffect, useRef, useState } from 'react'
import { Web } from "sp-pnp-js"
import GlobalCommanTable from '../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable';
import * as globalCommon from "../../../globalComponents/globalCommon";
import ShowTaskTeamMembers from '../../../globalComponents/ShowTaskTeamMembers'
import EditTaskPopup from '../../../globalComponents/EditTaskPopup/EditTaskPopup';
import EditComponent from '../../EditPopupFiles/EditComponent'
import DocumentPopup from '../../documentSearch/components/DocumentPopup';
export const Modified = (props: any) => {
  let columns: any = [];
  let portfolioColor: any = '#000066';
  var baseUrl: any = props?.props.context?._pageContext?.web?.absoluteUrl;
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
  const [loader, setLoader] = useState<any>(false);
  const [storeMasterData, setStoreMasterData] = useState<any>([]);
  const [componentChecked, setComponentChecked] = useState<any>(false);
  const [serviceChecked, setServiceChecked] = useState<any>(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const childRef = React.useRef<any>();
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
      sites.editFunction = false;
      sites.allEditFunction = false;
    })
    setSites(ActualSites)
    getCurrentData(ActualSites[0]);
    getMasterTaskList();
  }
  const getMasterTaskList = async () => {
    var web = new Web(baseUrl);
    try {
      var masterTaskData = await web.lists.getById(props?.props?.MasterTaskListID).items.select("Id,Title,PortfolioStructureID,ComponentCategory/Id,ComponentCategory/Title,PortfolioType/Id,PortfolioType/Title").expand('PortfolioType,ComponentCategory').getAll();
    } catch (error) {
      console.error(error)
    }
    setStoreMasterData(masterTaskData)
  }
  const getCurrentData = async (allSite: any) => {
    childRef?.current?.setRowSelection({});
    setLoader(false);
    let web = new Web(baseUrl);
    setType(allSite.TabName);
    setIsButtonDisabled(false)
    setComponentChecked(false)
    setServiceChecked(false)
    // to show all sites task data
    if (allSite.TabName == 'ALL') {
      allSite.allEditFunction = true;
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
          }, 400);
        }

      }
    }
    // 
    if (allSite.noRepeat != true) {
      var selectQuerry: string = allSite.TabName == 'DOCUMENTS' ? 'Id,Title,FileLeafRef,Item_x0020_Cover,File_x0020_Type,Modified,Created,EncodedAbsUrl,Author/Id,Author/Title,Editor/Id,Editor/Title&$filter=FSObjType eq 0'
        : allSite.TabName == 'FOLDERS' ? 'Id,Title,FileLeafRef,File_x0020_Type,Modified,Created,EncodedAbsUrl,Author/Id,Author/Title,Editor/Id,Editor/Title&$filter=FSObjType eq 1'
          : allSite.TabName == 'COMPONENTS' ? "Id,Title,PercentComplete,ItemType,DueDate,Created,Modified,TeamMembers/Id,ResponsibleTeam/Id,ResponsibleTeam/Title,Author/Id,Author/Title,AssignedTo/Id,AssignedTo/Title,Editor/Id,Priority,PriorityRank,PortfolioStructureID,ComponentCategory/Id,ComponentCategory/Title,PortfolioType/Id,PortfolioType/Title&$filter=PortfolioType/Title eq 'Component'"
            : allSite.TabName == 'SERVICES' ? "Id,Title,PercentComplete,ItemType,DueDate,Created,Modified,TeamMembers/Id,ResponsibleTeam/Id,ResponsibleTeam/Title,Author/Id,Author/Title,AssignedTo/Id,AssignedTo/Title,Editor/Id,Priority,PriorityRank,PortfolioStructureID,Services/Title,Services/Id,ComponentCategory/Id,ComponentCategory/Title,PortfolioType/Id,PortfolioType/Title&$filter=PortfolioType/Title eq 'Service'"
              : 'Id,Title,PercentComplete,DueDate,Created,Modified,TeamMembers/Id,ResponsibleTeam/Id,ResponsibleTeam/Title,TaskType/Id,TaskType/Title,Author/Id,Author/Title,AssignedTo/Id,AssignedTo/Title,Editor/Id,Priority,PriorityRank,Portfolio/Id,Portfolio/Title,ParentTask/Title,ParentTask/Id,TaskID';
      var expandQuerey: string = allSite.TabName == 'DOCUMENTS' ? 'Author,Editor'
        : allSite.TabName == 'FOLDERS' ? 'Author,Editor'
          : allSite.TabName == 'COMPONENTS' ? 'PortfolioType,TeamMembers,ResponsibleTeam,Author,AssignedTo,Editor,ComponentCategory'
            : allSite.TabName == 'SERVICES' ? 'PortfolioType,TeamMembers,ResponsibleTeam,Author,AssignedTo,Editor,ComponentCategory,Services' :
              'TeamMembers,ResponsibleTeam,TaskType,Author,AssignedTo,Editor,Portfolio,ParentTask';
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
          if (allSite.TabName == 'SERVICES') {
            item.fontColorTask = '#228b22'
          }else{
            item.fontColorTask ='#000066'
          }
          
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
            item.dueDateNew = moment(item?.DueDate).format('DD/MM/YYYY')
          }
          if (item.Modified != undefined) {
            item.modifiedNew = moment(item?.Modified).format('DD/MM/YYYY');
          }
          if (item.Created != undefined) {
            item.createdNew = moment(item?.Created).format('DD/MM/YYYY')
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
              }
            })
          }
        })
      }
      else {
        data?.map((item: any) => {
          item.siteType = allSite?.TabName
          item.listId = allSite.ListId;
          item.fontColorTask ='#000066'
          item.siteUrl = baseUrl;
          item.siteUrlOld = item.siteUrl.replace('/SP', '')
          item.siteImage = allSite?.SiteIcon;
          item.SiteIcon = item.siteUrlOld + item.siteImage
          item.AllusersName = [];
          item.TaskID = globalCommon.GetTaskId(item);
          if (item.Modified != undefined) {
            item.modifiedNew = moment(item?.Modified).format('DD/MM/YYYY HH:mm');
          }
          if (item.Created != undefined) {
            item.createdNew = moment(item?.Created).format('DD/MM/YYYY')
          }
          if (item.DueDate != undefined) {
            item.dueDateNew = moment(item?.DueDate).format('DD/MM/YYYY')
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

              }
            })
          }
          if (item.Editor != undefined) {
            (Users != undefined ? Users : allUsers).map((Users: any) => {
              if (item.Editor.Id == Users?.AssingedToUser?.Id) {
                item.editorImage = Users.Item_x0020_Cover?.Url;
                item.editorName = Users?.AssingedToUser?.Title;
                item.editorId = Users?.AssingedToUser?.Id;

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
            setLoader(true);
            setIsButtonDisabled(true)
          }, 400);

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
    // This else block is used for do not call Api again,which has been loaded.
    else {
      var duplicateValue: any = [];
      if (allSite.TabName == 'ALL') {
        duplicate.map((dupData: any) => {
          dupData.map((items: any) => {
            if (items.siteType != 'DOCUMENTS' && items.siteType != 'FOLDERS' && items.siteType != 'COMPONENTS' && items.siteType != 'SERVICES') {
              items.fontColorTask = '#000066'
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
            setLoader(true);
            setIsButtonDisabled(true)
          }, 300)

        }
      }
      else {
        var currentvalue: any = [];
        duplicate.map((dupData: any) => {
          dupData.map((items: any) => {
            if (items.siteType == allSite.TabName) {
              items.fontColorTask = '#000066'
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
  const componentCheckboxChange = (event: any) => {
    setComponentChecked(event.target.checked);
    var storeComponent: any = [];
    if (event.target.checked && serviceChecked == true) {
      duplicate.map((dupdata: any) => {
        dupdata.map((item: any) => {
          if (type=='ALL'&& item.siteType!='DOCUMENTS' && item.siteType != 'FOLDERS' && item.siteType != 'COMPONENTS' && item.siteType != 'SERVICES') {
            storeMasterData.map((masterTaskValue: any) => {
              if (item?.Portfolio?.Id == masterTaskValue?.Id) {
                if (masterTaskValue?.PortfolioType?.Title == 'Component') {
                  item.fontColorTask = '#000066'
                  storeComponent.push(item)
                }
                if (masterTaskValue?.PortfolioType?.Title == 'Service') {
                  item.fontColorTask = '#228b22'
                  storeComponent.push(item)
                }
                
              }
            })
          }
          if (item.siteType == type) {
            storeMasterData.map((masterTaskValue: any) => {
              if (item?.Portfolio?.Id == masterTaskValue?.Id) {
                if (masterTaskValue?.PortfolioType?.Title == 'Component') {
                  item.fontColorTask = '#000066'
                  storeComponent.push(item)
                }
                if (masterTaskValue?.PortfolioType?.Title == 'Service') {
                  item.fontColorTask = '#228b22'
                  storeComponent.push(item)
                }
                
              }
            })
          }
        })

      })
    }
    else if (event.target.checked) {
      allSiteData.map((item: any) => {
        storeMasterData.map((masterTaskValue: any) => {
          if (item?.Portfolio?.Id == masterTaskValue.Id) {
            if (masterTaskValue.PortfolioType?.Title == 'Component') {
              storeComponent.push(item)
            }
          }
        })
      })
    }
    else if(event.target.checked==false && serviceChecked == true){
      duplicate.map((dupdata: any) => {
        dupdata.map((item: any) => {
          if (type=='ALL'&& item.siteType!='DOCUMENTS' && item.siteType != 'FOLDERS' && item.siteType != 'COMPONENTS' && item.siteType != 'SERVICES') {
            storeMasterData.map((masterTaskValue: any) => {
              if (item?.Portfolio?.Id == masterTaskValue?.Id) {
                if (masterTaskValue.PortfolioType?.Title == 'Service') {
                  item.fontColorTask = '#228b22'
                  storeComponent.push(item)
                }             
              }
            })
          }
         else if (item.siteType == type) {
            storeMasterData.map((masterTaskValue: any) => {
              if (item?.Portfolio?.Id == masterTaskValue?.Id) {
                if (masterTaskValue.PortfolioType?.Title == 'Service') {
                  item.fontColorTask = '#228b22'
                  storeComponent.push(item)
                }             
              }
            })
          }
        })

      })
    }
    else if(event.target.checked==false){
      duplicate.map((dupdata: any) => {
        dupdata.map((data: any) => {
          if(type=='ALL'&& data.siteType!='DOCUMENTS' && data.siteType != 'FOLDERS' && data.siteType != 'COMPONENTS' && data.siteType != 'SERVICES'){
            data.fontColorTask = '#000066'
            storeComponent.push(data)
          }
          else if (data.siteType == type) {
            data.fontColorTask = '#000066'
            storeComponent.push(data)
          }
        })

      })
    }
    setallSiteData(storeComponent)
  }

  const serviceCheckboxChange = (event: any) => {
    var storeServices: any = [];
    setServiceChecked(event.target.checked)
    if (event.target.checked && componentChecked == true) {
      duplicate.map((dupdata: any) => {
        dupdata.map((item: any) => {
          if (type=='ALL'&& item.siteType!='DOCUMENTS' && item.siteType != 'FOLDERS' && item.siteType != 'COMPONENTS' && item.siteType != 'SERVICES') {
            storeMasterData.map((masterTaskValue: any) => {
              if (item?.Portfolio?.Id == masterTaskValue?.Id) {
                if (masterTaskValue?.PortfolioType?.Title == 'Component') {
                  item.fontColorTask = '#000066'
                  storeServices.push(item)
                }
                if (masterTaskValue?.PortfolioType?.Title == 'Service') {
                  item.fontColorTask = '#228b22'
                  storeServices.push(item)
                }
                
              }
            })
          }
          else if (item.siteType == type) {
            storeMasterData.map((masterTaskValue: any) => {
              if (item?.Portfolio?.Id == masterTaskValue.Id) {
                if (masterTaskValue.PortfolioType?.Title == 'Component') {
                  item.fontColorTask = '#000066'
                  storeServices.push(item)
                }
                if (masterTaskValue.PortfolioType?.Title == 'Service') {
                  item.fontColorTask = '#228b22'
                  storeServices.push(item)
                }
                
              }
            })
          }
        })

      })
    }

   else if (event.target.checked) {
      allSiteData.map((item: any) => {
        storeMasterData.map((masterTaskValue: any) => {
          if (item?.Portfolio?.Id == masterTaskValue.Id) {
            if (masterTaskValue?.PortfolioType?.Title == 'Service') {
              item.fontColorTask = '#228b22'
              storeServices.push(item)
            }
          }
        })
      })
    }
    else if(event.target.checked==false && componentChecked == true){
      duplicate.map((dupdata: any) => {
        dupdata.map((item: any) => {
          if (type=='ALL'&& item.siteType!='DOCUMENTS' && item.siteType != 'FOLDERS' && item.siteType != 'COMPONENTS' && item.siteType != 'SERVICES') {
            storeMasterData.map((masterTaskValue: any) => {
              if (item?.Portfolio?.Id == masterTaskValue.Id) {
                if (masterTaskValue?.PortfolioType?.Title == 'Component') {
                  item.fontColorTask = '#000066'
                  storeServices.push(item)
                }             
              }
            })
          }
         else if (item.siteType == type) {
            storeMasterData.map((masterTaskValue: any) => {
              if (item?.Portfolio?.Id == masterTaskValue.Id) {
                if (masterTaskValue?.PortfolioType?.Title == 'Component') {
                  item.fontColorTask = '#000066'
                  storeServices.push(item)
                }             
              }
            })
          }
        })

      })
    }
    else {
      duplicate.map((dupdata: any) => {
        dupdata.map((data: any) => {
          if(type=='ALL'&& data.siteType!='DOCUMENTS' && data.siteType != 'FOLDERS' && data.siteType != 'COMPONENTS' && data.siteType != 'SERVICES'){
            data.fontColorTask = '#000066'
            storeServices.push(data)
          }
          if (data.siteType == type) {
            data.fontColorTask = '#000066'
            storeServices.push(data)
          }
        })

      })
    }
    setallSiteData(storeServices)
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
    setEditValue(editDoc);
    seteditDocPopUpOpen(true);
  }
  const editTaskCallBack = (data: any) => {
    setEditTaskPopUpOpen(false);
    var dummyValueSite: any = [];
    var updateData: any = data.data;

    if (updateData != undefined) {
      sites.map((siteValue: any) => {
        if (siteValue.TabName == updateData.siteType) {
          siteValue.noRepeat = false;
          siteValue.editFunction = true;
          dummyValueSite = siteValue;
        }
        if (siteValue.TabName == "ALL" && siteValue.allEditFunction == true) {
          dummyValueSite.allEditFunction = true

        }
      })
      getCurrentData(dummyValueSite);
    }
  }

  const closeEditComponent = (item: any) => {
    setEditComponentPopUps(false)
    var updateDataComponent: any = item;
    var dummyValueComponent: any = [];
    var CurretUpdateValue: any = [];
    allSiteData.map((data: any,) => {
      if (data.Id == updateDataComponent.Id) {
        if (data.Title != updateDataComponent.Title) {
          data.Title = updateDataComponent.Title
        }
        if (data.PercentComplete != updateDataComponent.PercentComplete) {
          data.PercentComplete = updateDataComponent.PercentComplete
        }
        if (item.Modified != undefined) {
          data.Modified = item.Modified;
          data.modifiedNew = moment(data?.Modified).format('DD/MM/YYYY');

        }
        if (item?.Editor?.Id != data?.Editor?.Id) {
          allUsers.map((Users: any) => {
            if (item?.Editor?.Id == Users?.AssingedToUser?.Id) {
              data.editorImage = Users.Item_x0020_Cover?.Url;
              data.editorName = Users?.AssingedToUser?.Title;
              data.editorId = Users?.AssingedToUser?.Id;

            }
          })

        }
        if (data.DueDate != updateDataComponent.DueDate) {
          data.DueDate = updateDataComponent?.DueDate;
          data.dueDateNew = moment(data?.DueDate).format('DD/MM/YYYY');
        }
        if (data.PriorityRank != updateDataComponent.PriorityRank) {
          data.PriorityRank = updateDataComponent.PriorityRank
        }
        CurretUpdateValue = data;
      }
    })
    if (updateDataComponent != 'Close') {
      dummyValueComponent = allSiteData.filter((data: any) => { return (updateDataComponent.Id != data.Id) })
      dummyValueComponent.unshift(CurretUpdateValue);
    }

    if (updateDataComponent != 'Close') {
      setallSiteData([...dummyValueComponent])
    }
  };
  const closeDocEditPopUp = () => {
    seteditDocPopUpOpen(false);
    sites.map((siteValue: any) => {
      if (siteValue.TabName == 'DOCUMENTS') {
        siteValue.noRepeat = false;
        siteValue.editFunction = true;
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
          size: 55,
          id: 'Id',
        },
        {
          accessorKey: "FileLeafRef", placeholder: "Title", header: "",
          cell: ({ row }) =>
            <>
              {row.original.File_x0020_Type != undefined ? <span className={`alignIcon me-1 svg__iconbox svg__icon--${row.original.File_x0020_Type}`}></span> : undefined}

              <a data-interception="off" target='_blank' href={row.original.EncodedAbsUrl}>{row.original.FileLeafRef}</a>
            </>
        },
        {
          accessorKey: 'Modified', cell: ({ row }) =>
            <>
              {row.original.modifiedNew}
              <a target='_blank' href={`${baseUrl}/SitePages/TaskDashboard.aspx?UserId=${row.original.editorId}&Name=${row.original.editorName}`}>
                {row.original.editorImage != undefined ?
                  <img title={row.original.editorName} className='workmember ms-1' src={`${row.original.editorImage}`} alt="" /> : undefined}
              </a>
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
                  <img title={row.original.authorName} className='workmember ms-1' src={`${row.original.authorImage}`} alt="" /> : undefined}
              </a>
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
          size: 125,
        },
        {
          id: 'updateDoc',
          cell: ({ row }) =>
            <>
              {type == 'DOCUMENTS' ?
                <>
                  <a onClick={() => editDocOpen(row.original)}><span className="alignIcon svg__iconbox svg__icon--edit"></span></a>
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
          size: 5,
          id: 'Id',
        }, {
          accessorKey: 'PortfolioStructureID', placeholder: 'Component Name', header: "",
          cell: ({ row }) =>
            <>
              <img className='workmember ms-1' src={`${baseUrl}${row.original.photoComponent}`} alt="" />
              <span style={row?.original?.fontColorTask != undefined ? { color: `${row?.original?.fontColorTask}` } : { color: '#0000BC'}}>{row.original.PortfolioStructureID}</span>      
            </>
        },
        {
          accessorKey: "Title", placeholder: "Title", header: "",
          cell: ({ row }) =>
            <span>  <a data-interception="off" style={row?.original?.fontColorTask != undefined ? { color: `${row?.original?.fontColorTask}` } : { color: '#0000BC'}} target='_blank' href={`${baseUrl}/SitePages/Portfolio-Profile.aspx?taskId=${row.original.Id}`}>
              {row.original.Title}
            </a></span>

        },
        {
          accessorKey: 'DueDate',
          cell: ({ row }) =>
            <>
            <span style={row?.original?.fontColorTask != undefined ? { color: `${row?.original?.fontColorTask}` } : { color: '#0000BC'}}>
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
          id: 'DueDate',
          resetColumnFilters: false,
          resetSorting: false,
          placeholder: "DueDate",
          header: "",
          size:90,
        },
        {
          accessorKey: 'PercentCompleteShow', placeholder: '%', header: ''

        },
        {
          accessorKey: 'PriorityRank', placeholder: 'PriorityRank', header: ''
        },
        {
          accessorKey: 'Modified'
          , cell: ({ row }) =>
            <>
            <span style={row?.original?.fontColorTask != undefined ? { color: `${row?.original?.fontColorTask}` } : { color: '#0000BC'}}>
            {row.original.modifiedNew}
              </span>
              <a data-interception="off" target='_blank' href={`${baseUrl}/SitePages/TaskDashboard.aspx?UserId=${row.original.editorId}&Name=${row.original.editorName}`}>
                {row.original.editorImage != undefined ?
                  <img title={row.original.editorName} className='workmember ms-1' src={`${row.original.editorImage}`} alt="" /> : undefined}
              </a>
            </>
          , filterFn: (row: any, columnName: any, filterValue: any) => {
            if (row?.original?.editorName?.toLowerCase()?.includes(filterValue?.toLowerCase()) || row?.original?.modifiedNew?.includes(filterValue)) {
              return true
            } else {
              return false
            }
          },
          id: 'Modified',
          resetColumnFilters: false,
          resetSorting: false,
          placeholder: "Modified",
          header: "",
          size: 145,

        }
        , {
          accessorKey: "Created",
          cell: ({ row }) =>
            <>
            <span style={row?.original?.fontColorTask != undefined ? { color: `${row?.original?.fontColorTask}` } : { color: '#0000BC'}}>
            {row.original.createdNew}
              </span>
              <a data-interception="off" target='_blank' href={`${baseUrl}/SitePages/TaskDashboard.aspx?UserId=${row.original.authorId}&Name=${row.original.authorName}`}>
                {row.original.authorImage != undefined ?
                  <img title={row.original.authorName} className='workmember ms-1' src={`${row.original.authorImage}`} alt="" /> : undefined}
              </a>
            </>
          , filterFn: (row: any, columnName: any, filterValue: any) => {
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
          size: 125,
        }, {

          id: 'updateComponent',
          cell: ({ row }) =>
            <>
              <a onClick={() => editComponentPopUp(row.original)}><span className="alignIcon svg__iconbox svg__icon--edit"></span></a>
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
          size: 5,
          id: 'Id',
        }, {
          accessorKey: 'TaskID', placeholder: " TaskID", header: "", size: 90,
          cell: ({ row }) =>
            <>
              {<img className='workmember me-1' src={`${row.original.SiteIcon}`}></img>}
              {row.original.TaskID}
            </>
        },
        {
          accessorKey: "Title", placeholder: "Title", header: "",
          cell: ({ row }) =>
          <a style={row?.original?.fontColorTask != undefined ? { color: `${row?.original?.fontColorTask}` } : { color: '#0000BC' }}  data-interception="off" target='_blank' href={`${baseUrl}/SitePages/Task-Profile.aspx?taskId=${row.original.Id}&Site=${row.original.siteType}`}>
          {row.original.Title}
        </a>
        },
        {
          accessorKey: 'PortfolioTitle', placeholder: 'Component', header: '',
          cell: ({ row }) =>
          <a style={row?.original?.fontColorTask != undefined ? { color: `${row?.original?.fontColorTask}` } : { color: '#0000BC' }} data-interception="off" target='_blank' href={`${baseUrl}/SitePages/Portfolio-Profile.aspx?taskId=${row.original.PortfolioID}`}>
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
          accessorKey: 'PercentCompleteShow', placeholder: '%', header: ''

        },
        {
          accessorKey: 'PriorityRank', placeholder: 'PriorityRank', header: '' 
        },
        {
          accessorKey: "teamUserName", placeholder: "Team Member", header: "", size: 125,
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
                  <img title={row.original.editorName} className='workmember ms-1' src={`${row.original.editorImage}`} alt="" /> : undefined}
              </a>
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
                  <img title={row.original.authorName} className='workmember ms-1' src={`${row.original.authorImage}`} alt="" /> : undefined}
              </a>
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
          size: 125,
        }
        , {
          id: 'updateTask',
          cell: ({ row }) =>

            <>
              <a onClick={() => editPopUp(row.original)}><span className="alignIcon svg__iconbox svg__icon--edit"></span></a>
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
    <div className="p-0  d-flex justify-content-between align-items-center " style={{ verticalAlign: "top" }}>
      <h2 className="heading ">
      <span>Last Modified</span></h2>
      <div className="d-flex float-end">
        <div className="me-1" >
        <input className="form-check-input me-2"
            type="checkbox"
            checked={componentChecked}
            onChange={componentCheckboxChange}
          />
        <label> COMPONENTS </label>
       
       
        </div>
       
       <div className="">
       <input className="form-check-input me-1"
            type="checkbox"
            checked={serviceChecked}
            onChange={serviceCheckboxChange}
          />
       <label>  
          SERVICES </label>
        
     
       </div>
      </div>
      </div>
  
      
      <nav className="lastmodify">
        <div className="nav nav-tabs" id="nav-tab" role="tablist">
          {
            sites && sites.map((siteValue: any) =>
              <>
                <button disabled={!isButtonDisabled} onClick={() => { getCurrentData(siteValue); }} className={`nav-link ${siteValue.TabName == sites[0].TabName ? 'active' : ''}`} id={`nav-${siteValue.TabName}-tab`} data-bs-toggle="tab" data-bs-target={`#nav-${siteValue.TabName}`} type="button" role="tab" aria-controls="nav-home" aria-selected="true">{siteValue.TabName.toUpperCase()}</button>
              </>
            )
          }
          {/* <button style={{ position: 'relative', left: '180px', }} onClick={() => multipleDeleteFunction(multipleDelete)}><span className="alignIcon svg__iconbox hreflink mini svg__icon--trash"></span></button> */}
        </div>
      </nav>


      <div className="tab-content lastmodifylist px-2 clearfix" id="nav-tabContent">
        <div className="tab-pane fade show active" id={`nav-${type}`} role="tabpanel" aria-labelledby={`nav-${type}-tab`}>
          {allSiteData &&
          <div className="TableSection">
            <div className="container p-0">
            <div className="Alltable mt-2">
              <div className="col-md-12 p-0 smart">
                <div className="wrapper">
            <GlobalCommanTable columns={columns} ref={childRef} data={allSiteData} showHeader={true} callBackData={callBackData} multiSelect={true} TaskUsers={allUsers} portfolioColor={portfolioColor} AllListId={editTasksLists} />
          </div>
          </div>
          </div>
            </div>
            {/* <div className="clearfix"></div> */}
          </div>
          }
        </div>
      </div>
      <Loader loaded={loader} lines={13} length={20} width={10} radius={30} corners={1} rotate={0} direction={1} color="#000066" speed={2} trail={60} shadow={false} hwaccel={false} className="spinner" zIndex={2e9} top="28%" left="50%" scale={1.0} loadedClassName="loadedContent" />

      {editTaskPopUpOpen ? <EditTaskPopup Items={editValue} context={context} AllListId={editTasksLists} pageName={"TaskFooterTable"} Call={(Type: any) => { editTaskCallBack(Type) }} /> : ''}
      {editComponentPopUps ? <EditComponent item={editValue} SelectD={editComponentLists} Calls={closeEditComponent} portfolioTypeData={Portfoliotyped} /> : ''}
      {editDocPopUpOpen ? <DocumentPopup closeEditPopup={closeDocEditPopUp} pagecontext={editDocLists} Item={editValue} editData={editValue} /> : ''}
    </>
  )
}
