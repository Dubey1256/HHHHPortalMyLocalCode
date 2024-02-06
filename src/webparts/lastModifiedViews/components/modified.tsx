import Loader from "react-loader"
import PageLoader from '../../../globalComponents/pageLoader';
import moment from 'moment';
import { ColumnDef } from '@tanstack/react-table'
import React, { useEffect, useRef, useState } from 'react'
import { Web } from "sp-pnp-js"
import GlobalCommanTable from '../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable'
import * as globalCommon from "../../../globalComponents/globalCommon";
import ShowTaskTeamMembers from '../../../globalComponents/ShowTaskTeamMembers'
import EditTaskPopup from '../../../globalComponents/EditTaskPopup/EditTaskPopup';
import EditComponent from '../../EditPopupFiles/EditComponent'
import EditDocumentpanel from '../../taskprofile/components/EditDocunentPanel';
import ReactPopperTooltipSingleLevel from "../../../globalComponents/Hierarchy-Popper-tooltipSilgleLevel/Hierarchy-Popper-tooltipSingleLevel";
import TimeEntryPopup from "../../../globalComponents/TimeEntry/TimeEntryComponent";
import EditInstitutionPopup from '../../contactSearch/components/contact-search/popup-components/EditInstitutionPopup';
import { myContextValue } from '../../../globalComponents/globalCommon'
import EditPage from '../../../globalComponents/EditPanelPage/EditPage'
let allSite: any = {
  GMBHSite: false,
  HrSite: false,
  MainSite: true,
}
let masterTaskData: any;
let ActualSites: any = []
export const Modified = (props: any) => {
  let columns: any = [];
  let portfolioColor: any = '#000066';
  var baseUrl: any = props?.props.context?._pageContext?.web?.absoluteUrl;
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
  const [editLists, setEditLists] = useState<any>();
  const [editContactLists, setEditContactLists] = useState<any>();
  const [Portfoliotyped, setPortfoliotyped] = useState<any>();
  const [loader, setLoader] = useState<any>(false);
  const [componentChecked, setComponentChecked] = useState<any>(false);
  const [serviceChecked, setServiceChecked] = useState<any>(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [currentTimeEntry, setCurrentTimeEntry] = useState<any>([]);
  const [istimeEntryOpen, setIsTimeEntryOpen] = useState(false);
  const [editInstitutionPopUp, setEditInstitutionPopUp] = useState(false);
  const [editWebPagePopUp, setEditWebPagePopUp] = useState(false)
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
    getPortfolioData()
  }, []);


  const getAllUsers = async () => {


    Users = await globalCommon.loadTaskUsers();
    setAllUsers(Users)
    if (baseUrl.toLowerCase().includes("gmbh")) {
      setGmbhSite(true)
      allSite = {
        GMBHSite: true,
        MainSite: false,
      }
    }
    const editListsAll = {
      TaskUsertListID: props?.props?.TaskUsertListID,
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
      context: props?.props?.context,
      TaskUserListId: props?.props?.TaskUsertListID,


    }
    setEditLists(editListsAll)

    const contactList = {
      Context: props?.props.context,
      HHHHContactListId: props?.props?.HHHHContactListId,
      HHHHInstitutionListId: props?.props?.HHHHInstitutionListId,
      MAIN_SMARTMETADATA_LISTID: props?.props?.MAIN_SMARTMETADATA_LISTID,
      MAIN_HR_LISTID: props?.props?.MAIN_HR_LISTID,
      ContractListID: props?.props?.ContractListID,
      GMBH_CONTACT_SEARCH_LISTID: props?.props?.GMBH_CONTACT_SEARCH_LISTID,
      HR_EMPLOYEE_DETAILS_LIST_ID: props?.props?.HR_EMPLOYEE_DETAILS_LIST_ID,
      siteUrl: baseUrl,
      jointSiteUrl: "https://hhhhteams.sharepoint.com/sites/HHHH"
    }
    setEditContactLists(contactList)
  }
  const getSites = async function () {
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
    getMasterTaskList();
  }
  const getMasterTaskList = () => {
    var web = new Web(baseUrl);
    try {
      web.lists.getById(props?.props?.MasterTaskListID).items.select("Id,Title,PortfolioStructureID,ComponentCategory/Id,ComponentCategory/Title,PortfolioType/Id,PortfolioType/Title").expand('PortfolioType,ComponentCategory').getAll().then((masterValue: any) => {
        if (masterValue.length > 0) {
          masterTaskData = masterValue;
          getCurrentData(ActualSites[0])
        }
      });
    } catch (error) {
      console.error(error)
    }
  }
  const getPortfolioData = async () => {
    let web = new Web(baseUrl);
    let PortFolioType = [];
    PortFolioType = await web.lists
      .getById(props?.props?.PortFolioTypeID)
      .items.select(
        "Id",
        "Title",
        "Color",
        "IdRange"
      )
      .get();
    setPortfoliotyped(PortFolioType)
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
          }, 600);
        }

      }
    }
    // 
    if (allSite.noRepeat != true) {
      var data: any = [];
      try {
        data = await web.lists.getById(allSite.ListId).items.select(allSite.Columns).orderBy('Modified', false).top(200).get();
      }
      catch (error) {
        console.error(error)
      }
      if (allSite.TabName == 'DOCUMENTS' || allSite.TabName == 'FOLDERS' || allSite.TabName == 'COMPONENTS' || allSite.TabName == 'SERVICES' || allSite.TabName == 'TEAM-PORTFOLIO' || allSite.TabName == "WEB PAGES") {
        data?.map((item: any) => {
          item.siteType = allSite.TabName
          if (allSite.TabName == 'COMPONENTS' || allSite.TabName == 'SERVICES' || allSite.TabName == 'TEAM-PORTFOLIO') {
            item.siteType = "Master Tasks";
            item.MasterType=allSite.TabName
          }
          item.listId = allSite.ListId;
          item.siteUrl = baseUrl;
          item.coloumns = allSite.Columns
          item.GmBHSiteCheck = item.siteUrl.includes("/GmBH");
          if (allSite.TabName == 'SERVICES') {
            item.fontColorTask = '#228b22'
          } else {
            item.fontColorTask = '#000066'
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
          if (item.Author != undefined) {
            (Users != undefined ? Users : allUsers).map((Users: any) => {
              if (item.Author.Id == Users?.AssingedToUser?.Id) {
                item.authorImage = Users.Item_x0020_Cover?.Url;
                item.authorSuffix = Users.Suffix;
                item.authorName = Users?.AssingedToUser?.Title;
                item.authorId = Users?.AssingedToUser?.Id;

              }
            })
            if (item?.authorImage == undefined && item.authorSuffix == undefined) {
              item.authorDefaultName = item.Author?.Title;
              item.authorDefaultImage = "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg";
            }
          }
          if (item.Editor != undefined) {
            (Users != undefined ? Users : allUsers).map((Users: any) => {
              if (item.Editor.Id == Users?.AssingedToUser?.Id) {
                item.editorImage = Users.Item_x0020_Cover?.Url;
                item.editorSuffix = Users.Suffix;
                item.editorName = Users?.AssingedToUser?.Title;
                item.editorId = Users?.AssingedToUser?.Id;
              }
              if (item?.editorImage == undefined && item.editorSuffix == undefined) {
                item.editorDefaultName = item.Editor.Title;
                item.editorDefaultImage = "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg";
              }

            })
          }
        })
        if (allSite.TabName == 'DOCUMENTS') {
          data = data.filter((item: any) => { return (item.Title != null) })
        }
      }

      else {
        data?.map((item: any) => {
          item.fontColorTask = '#000066';
          masterTaskData.map((masterTaskValue: any) => {
            if (item?.Portfolio?.Id == masterTaskValue?.Id) {
              if (masterTaskValue?.PortfolioType?.Title == 'Service') {
                item.fontColorTask = '#228b22'
              }
            }
          })
          item.siteType = allSite?.TabName
          item.listId = allSite.ListId;
          item.siteUrl = baseUrl;
          item.GmBHSiteCheck = item.siteUrl.includes("/GmBH");
          item.siteUrlOld = item.siteUrl.replace('/SP', '')
          item.siteImage = allSite?.SiteIcon;
          item.SiteIcon = item.siteUrlOld + item.siteImage
          item.AllusersName = [];
          if (item.GmBHSiteCheck == true) {
            item.SiteIcon = item.siteUrl + "/SiteCollectionImages/ICONS/Foundation/Icon_GmBH.png";
          }
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
          if (item.EventDate != undefined) {
            item.eventDate = moment(item?.EventDate).format('DD/MM/YYYY')
          }
          if (item.PercentComplete != undefined) {
            item.PercentComplete = parseInt((item.PercentComplete * 100).toFixed(0));
            item.PercentCompleteShow = item.PercentComplete + '%';
          }
          if (item.Author != undefined) {
            (Users != undefined ? Users : allUsers).map((Users: any) => {
              if (item.Author.Id == Users?.AssingedToUser?.Id) {
                item.authorImage = Users.Item_x0020_Cover?.Url;
                item.authorSuffix = Users.Suffix;
                item.authorName = Users?.AssingedToUser?.Title;
                item.authorId = Users?.AssingedToUser?.Id;

              }
            })
            if (item?.authorImage == undefined && item.authorSuffix == undefined) {
              item.authorDefaultName = item.Author?.Title;
              item.authorDefaultImage = "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg";
            }
          }
          if (item.Editor != undefined) {
            (Users != undefined ? Users : allUsers).map((Users: any) => {
              if (item.Editor.Id == Users?.AssingedToUser?.Id) {
                item.editorImage = Users.Item_x0020_Cover?.Url;
                item.editorSuffix = Users.Suffix;
                item.editorName = Users?.AssingedToUser?.Title;
                item.editorId = Users?.AssingedToUser?.Id;
              }
              if (item?.editorImage == undefined && item.editorSuffix == undefined) {
                item.editorDefaultName = item.Editor.Title;
                item.editorDefaultImage = "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg";
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
          if (item.AssignedTo?.length > 0) {
            item.AssignedTo?.map((workingMember: any) => {
              (Users != undefined ? Users : allUsers).map((users: any) => {
                if (workingMember?.Id == users.AssingedToUserId) {
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
        if (allSite.TabName == "EVENTS") {
          data = data.filter((item: any) => { return (item.Title != null) })
        }
        if (allSite.TabName == 'SMART PAGES') {
          data = data.filter((item: any) => { return (item.TaxType == "Smart Pages") })
        }
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
            setLoader(true);
            setIsButtonDisabled(true)
          }, 300)

        }
      }
      else {
        var currentvalue: any = [];
        duplicate.map((dupData: any) => {
          dupData.map((items: any) => {
            if (items.siteType == allSite.TabName ||items.MasterType==allSite.TabName) {
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
          if (type == 'ALL' && item.siteType != 'DOCUMENTS' && item.siteType != 'FOLDERS' && item.siteType != 'COMPONENTS' && item.siteType != 'SERVICES') {
            masterTaskData.map((masterTaskValue: any) => {
              if (item?.Portfolio?.Id == masterTaskValue?.Id) {
                if (masterTaskValue?.PortfolioType?.Title == 'Component') {
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
            masterTaskData.map((masterTaskValue: any) => {
              if (item?.Portfolio?.Id == masterTaskValue?.Id) {
                if (masterTaskValue?.PortfolioType?.Title == 'Component') {
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
        masterTaskData.map((masterTaskValue: any) => {
          if (item?.Portfolio?.Id == masterTaskValue.Id) {
            if (masterTaskValue.PortfolioType?.Title == 'Component') {
              storeComponent.push(item)
            }
          }
        })
      })
    }
    else if (event.target.checked == false && serviceChecked == true) {
      duplicate.map((dupdata: any) => {
        dupdata.map((item: any) => {
          if (type == 'ALL' && item.siteType != 'DOCUMENTS' && item.siteType != 'FOLDERS' && item.siteType != 'COMPONENTS' && item.siteType != 'SERVICES') {
            masterTaskData.map((masterTaskValue: any) => {
              if (item?.Portfolio?.Id == masterTaskValue?.Id) {
                if (masterTaskValue.PortfolioType?.Title == 'Service') {
                  item.fontColorTask = '#228b22'
                  storeComponent.push(item)
                }
              }
            })
          }
          else if (item.siteType == type) {
            masterTaskData.map((masterTaskValue: any) => {
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
    else if (event.target.checked == false) {
      duplicate.map((dupdata: any) => {
        dupdata.map((data: any) => {
          if (type == 'ALL' && data.siteType != 'DOCUMENTS' && data.siteType != 'FOLDERS' && data.siteType != 'COMPONENTS' && data.siteType != 'SERVICES') {
            storeComponent.push(data)
          }
          else if (data.siteType == type) {
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
          if (type == 'ALL' && item.siteType != 'DOCUMENTS' && item.siteType != 'FOLDERS' && item.siteType != 'COMPONENTS' && item.siteType != 'SERVICES') {
            masterTaskData.map((masterTaskValue: any) => {
              if (item?.Portfolio?.Id == masterTaskValue?.Id) {
                if (masterTaskValue?.PortfolioType?.Title == 'Component') {
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
            masterTaskData.map((masterTaskValue: any) => {
              if (item?.Portfolio?.Id == masterTaskValue.Id) {
                if (masterTaskValue.PortfolioType?.Title == 'Component') {
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
        masterTaskData.map((masterTaskValue: any) => {
          if (item?.Portfolio?.Id == masterTaskValue.Id) {
            if (masterTaskValue?.PortfolioType?.Title == 'Service') {
              item.fontColorTask = '#228b22'
              storeServices.push(item)
            }
          }
        })
      })
    }
    else if (event.target.checked == false && componentChecked == true) {
      duplicate.map((dupdata: any) => {
        dupdata.map((item: any) => {
          if (type == 'ALL' && item.siteType != 'DOCUMENTS' && item.siteType != 'FOLDERS' && item.siteType != 'COMPONENTS' && item.siteType != 'SERVICES') {
            masterTaskData.map((masterTaskValue: any) => {
              if (item?.Portfolio?.Id == masterTaskValue.Id) {
                if (masterTaskValue?.PortfolioType?.Title == 'Component') {
                  storeServices.push(item)
                }
              }
            })
          }
          else if (item.siteType == type) {
            masterTaskData.map((masterTaskValue: any) => {
              if (item?.Portfolio?.Id == masterTaskValue.Id) {
                if (masterTaskValue?.PortfolioType?.Title == 'Component') {
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
          if (type == 'ALL' && data.siteType != 'DOCUMENTS' && data.siteType != 'FOLDERS' && data.siteType != 'COMPONENTS' && data.siteType != 'SERVICES') {
            storeServices.push(data)
          }
          if (data.siteType == type) {
            storeServices.push(data)
          }
        })

      })
    }
    setallSiteData(storeServices)
  }

  const deleteData = (dlData: any) => {
    var flag = confirm(`Are you sure, you want to delete?`)
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
  const editComponentPopUp = async (editComponentValue: any) => {
    setEditValue(editComponentValue);
    setEditComponentPopUps(true)
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
  const CloseConatactPopup = () => {
    setEditInstitutionPopUp(false)
  }
  const closeEditComponent = (item: any) => {
    setEditComponentPopUps(false)
    // Portfolio_x0020_Type
    if (item?.PortfolioType?.Title == "Component") {
      sites.map((siteValue: any) => {
        if (siteValue.TabName == 'COMPONENTS') {
          siteValue.noRepeat = false;
          siteValue.editFunction = true;
          getCurrentData(siteValue)
        }
      })
    }
    else if (item?.PortfolioType?.Title == "Service") {
      sites.map((siteValue: any) => {
        if (siteValue.TabName == 'SERVICES') {
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
        if (siteValue.TabName == 'DOCUMENTS') {
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
      if (siteValue.TabName == 'WEB PAGES') {
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
          accessorKey: "FileLeafRef", placeholder: "Title", header: "",
          cell: ({ row }) =>
            <>
              {row.original.File_x0020_Type != undefined ? <>{type == 'FOLDERS' ? <a data-interception="off" target='_blank' href={row.original.FileDirRef}><span className={`alignIcon me-1 svg__iconbox svg__icon--${row.original.File_x0020_Type}`}></span></a> : <span className={`alignIcon me-1 svg__iconbox svg__icon--${row.original.File_x0020_Type}`}></span>}</> : undefined}
              <a data-interception="off" target='_blank' href={row.original.EncodedAbsUrl}>{row.original.FileLeafRef}</a>
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
          id: 'Created',
          resetColumnFilters: false,
          resetSorting: false,
          placeholder: "Created",
          header: "",
          size: 125,
        },
        {
          id: 'editWebPage', size: 25,
          cell: ({ row }) =>
            <>
              {type == 'WEB PAGES' ?
                <>
                  <EditPage context={editLists} Title={row.original.FileLeafRef} changeHeader={changes} updatedWebpages={updatedWebpages} /> </>
                : undefined}
            </>

        }
        , {
          id: 'deleteWebpage', size: 25,
          cell: ({ row }) =>
            <>
              {type == 'WEB PAGES' ?
                <>
                  <a onClick={() => deleteData(row.original)}><span className="alignIcon svg__iconbox hreflink mini svg__icon--trash"></span></a>
                </>
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
          accessorKey: "FileLeafRef", placeholder: "Title", header: "", id: "FileLeafRef",
          cell: ({ row }) =>
            <>
              {row.original.File_x0020_Type != undefined ? <>{type == 'FOLDERS' ? <a data-interception="off" target='_blank' href={row.original.FileDirRef}><span className={`alignIcon me-1 svg__iconbox svg__icon--${row.original.File_x0020_Type}`}></span></a> : <span className={`alignIcon me-1 svg__iconbox svg__icon--${row.original.File_x0020_Type}`}></span>}</> : undefined}
              <a data-interception="off" target='_blank' href={row.original.EncodedAbsUrl}>{row.original.FileLeafRef}</a>
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
          size: 125,
        },
        {
          id: 'updateDoc', size: 25,
          cell: ({ row }) =>
            <>
              {type == 'DOCUMENTS' || type == 'WEB PAGES' ?
                <>
                  <a onClick={() => editDocOpen(row.original)}><span className="alignIcon svg__iconbox svg__icon--edit"></span></a>
                </>
                : undefined}
            </>

        }
        , {
          id: 'deleteDoc', size: 25,
          cell: ({ row }) =>
            <>
              {type == 'DOCUMENTS' || type == 'WEB PAGES' ?
                <>
                  <a onClick={() => deleteData(row.original)}><span className="alignIcon svg__iconbox hreflink mini svg__icon--trash"></span></a>
                </>
                : undefined}
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
            <a data-interception="off" target='_blank' href={`${baseUrl}/SitePages/Task-Profile.aspx?taskId=${row.original.Id}&Site=${row.original.siteType}`}>
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
          size: 125,
        }, {
          cell: (info: any) => (
            <>
              <a className="alignCenter" onClick={() => EditDataTimeEntryData(info?.row?.original)} data-bs-toggle="tooltip" data-bs-placement="auto" title="Click To Edit Timesheet">
                <span className="svg__iconbox svg__icon--clock dark" data-bs-toggle="tooltip" data-bs-placement="bottom"></span>
              </a></>
          ),
          id: 'AllEntry',
          accessorKey: "",
          canSort: false,
          resetSorting: false,
          resetColumnFilters: false,
          placeholder: "",
          size: 25
        }, {
          id: 'updateSmartPages',
          cell: ({ row }) =>

            <>
              <a onClick={() => editPopUp(row.original)}><span className="alignIcon svg__iconbox svg__icon--edit"></span></a>
            </>,

        }
        , {
          id: 'delteSmartPages',
          cell: ({ row }) =>
            <>
              <a onClick={() => deleteData(row.original)}><span className="alignIcon svg__iconbox hreflink mini svg__icon--trash"></span></a>
            </>

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
          size: 125,
        }, {
          cell: (info: any) => (
            <>
              <a className="alignCenter" onClick={() => EditDataTimeEntryData(info?.row?.original)} data-bs-toggle="tooltip" data-bs-placement="auto" title="Click To Edit Timesheet">
                <span className="svg__iconbox svg__icon--clock dark" data-bs-toggle="tooltip" data-bs-placement="bottom"></span>
              </a></>
          ),
          id: 'AllEntry',
          accessorKey: "",
          canSort: false,
          resetSorting: false,
          resetColumnFilters: false,
          placeholder: "",
          size: 25
        }, {
          id: 'updateSmartMetaData', size: 25,
          cell: ({ row }) =>

            <>
              <a onClick={() => editPopUp(row.original)}><span className="alignIcon svg__iconbox svg__icon--edit"></span></a>
            </>,

        }
        , {
          id: 'delteSmartMetaData', size: 25,
          cell: ({ row }) =>
            <>
              <a onClick={() => deleteData(row.original)}><span className="alignIcon svg__iconbox hreflink mini svg__icon--trash"></span></a>
            </>

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
          size: 125,
        },
        {

          id: 'updateContact',
          cell: ({ row }) =>
            <>
              <a onClick={() => editContactOpen(row.original)}><span className="alignIcon svg__iconbox svg__icon--edit"></span></a>
            </>

        },
        {
          id: 'deleteContact',
          cell: ({ row }) =>
            <>
              <a onClick={() => deleteData(row.original)}><span className="alignIcon svg__iconbox hreflink mini svg__icon--trash"></span></a>
            </>

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
          size: 125,
        },
        {

          id: 'updateEvents',
          cell: ({ row }) =>
            <>
              <a onClick={() => editComponentPopUp(row.original)}><span className="alignIcon svg__iconbox svg__icon--edit"></span></a>
            </>

        },
        {
          id: 'deleteEvents',
          cell: ({ row }) =>
            <>
              <a onClick={() => deleteData(row.original)}><span className="alignIcon svg__iconbox hreflink mini svg__icon--trash"></span></a>
            </>

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
          size: 125,
        },
        {

          id: 'updateNews',
          cell: ({ row }) =>
            <>
              <a onClick={() => editComponentPopUp(row.original)}><span className="alignIcon svg__iconbox svg__icon--edit"></span></a>
            </>

        },
        {
          id: 'deleteNews',
          cell: ({ row }) =>
            <>
              <a onClick={() => deleteData(row.original)}><span className="alignIcon svg__iconbox hreflink mini svg__icon--trash"></span></a>
            </>

        }
      ], [allSiteData])
  }
  else if (type == 'COMPONENTS' || type == 'SERVICES' || type == 'TEAM-PORTFOLIO') {
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
            <>
              <img className='workmember ms-1' src={`${baseUrl}${row.original.photoComponent}`} alt="" />
              <span style={row?.original?.fontColorTask != undefined ? { color: `${row?.original?.fontColorTask}` } : { color: '#0000BC' }}>{row.original.PortfolioStructureID}</span>
            </>
        },
        {
          accessorKey: "Title", placeholder: "Component Name", header: "", id: "Title",
          cell: ({ row }) =>
            <span>  <a data-interception="off" style={row?.original?.fontColorTask != undefined ? { color: `${row?.original?.fontColorTask}` } : { color: '#0000BC' }} target='_blank' href={`${baseUrl}/SitePages/Portfolio-Profile.aspx?taskId=${row.original.Id}`}>
              {row.original.Title}
            </a></span>

        },
        {
          accessorKey: 'DueDate',
          cell: ({ row }) =>
            <>
              <span style={row?.original?.fontColorTask != undefined ? { color: `${row?.original?.fontColorTask}` } : { color: '#0000BC' }}>
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
              <span style={row?.original?.fontColorTask != undefined ? { color: `${row?.original?.fontColorTask}` } : { color: '#0000BC' }}>
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
              <span style={row?.original?.fontColorTask != undefined ? { color: `${row?.original?.fontColorTask}` } : { color: '#0000BC' }}>
                {row.original.createdNew}
              </span>
              <a data-interception="off" target='_blank' href={`${baseUrl}/SitePages/TaskDashboard.aspx?UserId=${row.original.authorId}&Name=${row.original.authorName}`}>
                {row.original.authorImage != undefined ?
                  <img title={row.original.authorName} className='workmember ms-1' src={`${row.original.authorImage}`} alt="" />
                  : row.original.authorSuffix != undefined ? <span title={row.original.authorName} className="workmember ms-1 bg-fxdark" >{row.original.authorSuffix}</span>
                    : <img title={row.original.authorDefaultName} className='workmember ms-1' src={`${row.original.authorDefaultImage}`} alt="" />}
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
          accessorFn: (row) => row?.TaskID,
          cell: ({ row, getValue }) => (
            <>
              {row.original.GmBHSiteCheck == false ? <img className='workmember me-1' src={`${row.original.SiteIcon}`}></img> : undefined}
              <ReactPopperTooltipSingleLevel ShareWebId={getValue()} row={row?.original} AllListId={editLists} singleLevel={true} masterTaskData={masterTaskData} AllSitesTaskData={allSiteData} />
            </>
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
            <a style={row?.original?.fontColorTask != undefined ? { color: `${row?.original?.fontColorTask}` } : { color: '#0000BC' }} data-interception="off" target='_blank' href={`${baseUrl}/SitePages/Task-Profile.aspx?taskId=${row.original.Id}&Site=${row.original.siteType}`}>
              {row.original.Title}
            </a>
          ),
          id: "Title",
          placeholder: "Title", header: "",
        },
        {
          accessorKey: 'PortfolioTitle', placeholder: 'Component', header: '', id: 'PortfolioTitle',
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
          size: 125,
        }, {
          cell: (info: any) => (
            <>
              <a className="alignCenter" onClick={() => EditDataTimeEntryData(info?.row?.original)} data-bs-toggle="tooltip" data-bs-placement="auto" title="Click To Edit Timesheet">
                <span className="svg__iconbox svg__icon--clock dark" data-bs-toggle="tooltip" data-bs-placement="bottom"></span>
              </a></>
          ),
          id: 'AllEntry',
          accessorKey: "",
          canSort: false,
          resetSorting: false,
          resetColumnFilters: false,
          placeholder: "",
          size: 25
        }, {
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
          <span>Last Modified Views</span></h2>
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

                <button disabled={!isButtonDisabled} onClick={() => { getCurrentData(siteValue); }} className={`nav-link ${siteValue.TabName == sites[0].TabName ? 'active' : ''}`} id={`nav-${siteValue.TabName}-tab`} data-bs-toggle="tab" data-bs-target={`#nav-${siteValue.TabName}`} type="button" role="tab" aria-controls="nav-home" aria-selected="true">{siteValue.DisplaySiteName}</button>
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
                      <GlobalCommanTable columns={columns} ref={childRef} data={allSiteData} showHeader={true} callBackData={callBackData} multiSelect={true} hideTeamIcon={gmbhSite} TaskUsers={allUsers} portfolioColor={portfolioColor} AllListId={editLists} />
                    </div>
                  </div>
                </div>
              </div>
              {/* <div className="clearfix"></div> */}
            </div>
          }
        </div>
      </div>
      {!loader && <PageLoader />}
      {editTaskPopUpOpen ? <EditTaskPopup Items={editValue} context={context} AllListId={editLists} pageName={"TaskFooterTable"} Call={(Type: any) => { editTaskCallBack(Type) }} /> : ''}
      {editComponentPopUps ? <EditComponent item={editValue} SelectD={editLists} Calls={closeEditComponent} portfolioTypeData={Portfoliotyped} /> : ''}
      {editDocPopUpOpen ? <EditDocumentpanel callbackeditpopup={callbackeditpopup} AllListId={editLists} Item={editValue} editData={editValue} Keydoc={true} Context={context} /> : ''}
      {/* {editWebPagePopUp?<EditPage context={editLists} Item={editValue} changes={changes}  updatedWebpages={updatedWebpages} />: ''} */}
      <myContextValue.Provider value={{ ...myContextValue, allSite: allSite, allListId: editContactLists, loggedInUserName: props.props?.userDisplayName }}>
        {editInstitutionPopUp ? <EditInstitutionPopup props={editValue} callBack={CloseConatactPopup} /> : null}
      </myContextValue.Provider>
      {istimeEntryOpen && (<TimeEntryPopup props={currentTimeEntry} CallBackTimeEntry={TimeEntryCallBack} Context={editLists.Context}></TimeEntryPopup>)}
    </>
  )
}
