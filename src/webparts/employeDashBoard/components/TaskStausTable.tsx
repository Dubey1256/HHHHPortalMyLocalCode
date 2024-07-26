import React, { useEffect, useState } from "react";
import { myContextValue } from "../../../globalComponents/globalCommon";
import * as globalCommon from '../../../globalComponents/globalCommon';
import ComingBirthday from "./comingBirthday";
import MyNotes from "./MyNotes";
import EditTaskPopup from "../../../globalComponents/EditTaskPopup/EditTaskPopup";
import { spfi, SPFx as spSPFx } from "@pnp/sp";
import 'bootstrap/dist/css/bootstrap.min.css';
import InfoIconsToolTip from "../../../globalComponents/InfoIconsToolTip/InfoIconsToolTip";
import GlobalCommanTable from "../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable";
import ReactPopperTooltipSingleLevel from "../../../globalComponents/Hierarchy-Popper-tooltipSilgleLevel/Hierarchy-Popper-tooltipSingleLevel";
import EmailComponenet from "../../taskprofile/components/emailComponent";
import { Web } from "sp-pnp-js";
import ShowClintCatogory from "../../../globalComponents/ShowClintCatogory";
import ShowTaskTeamMembers from '../../../globalComponents/ShowTaskTeamMembers';
import ReactPopperTooltip from "../../../globalComponents/Hierarchy-Popper-tooltip";
import AddConfiguration from "../../../globalComponents/AddConfiguration";
import { GrNext, GrPrevious } from "react-icons/gr";
import * as Moment from "moment";
import Slider from "react-slick";
import HighlightableCell from "../../../globalComponents/highlight";
import { MdOutlineGppGood, MdGppBad } from "react-icons/Md";
import { Panel } from '@fluentui/react';
import EditProjectPopup from "../../../globalComponents/EditProjectPopup";
import AddEditWebpartTemplate from "../../../globalComponents/AddEditWebpartTemplate";
import TimeEntryPopup from "../../../globalComponents/TimeEntry/TimeEntryComponent";
import EditInstituton from "../../EditPopupFiles/EditComponent";
let Count = 0;
let DashboardConfig: any = [];
let DashboardConfigCopy: any = [];
let AllapprovalTask: any = [];
let flagApproval: boolean = false;
let approveItem: any;
let emailStatus: any = "";
let IsShowConfigBtn = false;
let dragItem: any;
let DragDropType: any = '';
let isUpdateTask: any = true;
let portfolioColor: any = '';
let StatusOptions = [{ value: 0, taskStatusComment: "Not Started" }, { value: 1, taskStatusComment: "For Approval" }, { value: 2, taskStatusComment: "Follow Up" }, { value: 3, taskStatusComment: "Approved" },
{ value: 4, taskStatusComment: "Checking" }, { value: 5, taskStatusComment: "Acknowledged" }, { value: 8, taskStatusComment: "Priority Check" }, { value: 9, taskStatusComment: "Ready To Go" },
{ value: 10, taskStatusComment: "working on it" }, { value: 70, taskStatusComment: "Re-Open" }, { value: 75, taskStatusComment: "Deployment Pending" }, { value: 80, taskStatusComment: "In QA Review" },
{ value: 90, taskStatusComment: "Task completed" }, { value: 100, taskStatusComment: "Closed" },]
const TaskStatusTbl = (Tile: any) => {
  const childRef = React.useRef<any>();
  const ContextData: any = React.useContext(myContextValue);
  const [IsShowAllUser, setIsShowAllUser] = useState(true);
  const [state, rerender] = React.useReducer(() => ({}), {});
  const AllTaskUser: any = ContextData?.AlltaskData?.AllTaskUser;
  const AllMasterTasks: any = ContextData?.AllMasterTasks;
  const [editPopup, setEditPopup]: any = useState(false);
  const [EditProjectPopup, setEditProjectPopup]: any = useState(false);
  const [EditCompPopup, setEditCompPopup]: any = useState(false);
  const [result, setResult]: any = useState<any>(false);
  const [CompResult, setCompResult]: any = useState(false);
  const [ActiveTile, setActiveTile] = useState(Tile?.activeTile);
  const [dateRange, setDateRange] = useState<any>([]);
  const [isRejectItem, setisRejectItem] = useState<any>(undefined);
  const [RefSelectedItem, setRefSelectedItem] = useState<any>([]);
  const [bulkUpdateDataCallBack, setBulkUpdateDataCallBack] = useState<any>([]);
  const [bulkUpdateDataTableId, setBulkUpdateDataTableId] = useState('')
  const [IsTimeEntry, setIsTimeEntry] = useState(false);
  const [TimeComponent, setTimeComponent] = useState(undefined);
  const [portfolioTyped, setPortfolioTypeData] = React.useState([]);
  const [SelectedUserId, setSelectedUserId] = React.useState<any>();
  const dashBoardbulkUpdateCallBack = React.useCallback(async (configTableId: any, data: any) => {
    setBulkUpdateDataCallBack(data);
    setBulkUpdateDataTableId(configTableId);
  }, []);
  useEffect(() => {
    if (bulkUpdateDataCallBack?.length > 0 && bulkUpdateDataTableId) {
      DashboardConfig?.map((elem: any, index: any) => {
        if ("DashboardID" + ContextData?.DashboardId + "WebpartId" + elem?.Id + "Dashboard" === bulkUpdateDataTableId) {
          elem.Tasks = bulkUpdateDataCallBack;
        }
      })
      DashboardConfigCopy = JSON.parse(JSON.stringify(DashboardConfig));
      setActiveTile(Tile?.activeTile)
      rerender();
    }
  }, [bulkUpdateDataCallBack, bulkUpdateDataTableId]);
  useEffect(() => {
    setSelectedUserId(ContextData?.currentUserId)
  }, [ContextData?.currentUserId]);
  if (Tile?.smartFavTableConfig != undefined && Tile?.smartFavTableConfig?.length > 0 && childRef?.current != undefined) {
    childRef?.current?.setSmartFabBasedColumnsSetting(Tile?.smartFavTableConfig)
  }
  const settings = {
    dots: false, infinite: true, speed: 500, slidesToShow: 6, slidesToScroll: 1, nextArrow: <SamplePrevNextArrow type="next" />, prevArrow: <SamplePrevNextArrow type="prev" />,
    beforeChange: handleBeforeChange,
  };
  const [currentSlide, setCurrentSlide] = useState(0);
  function handleBeforeChange(current: any, next: any) {
    setCurrentSlide(next);
  }
  function SamplePrevNextArrow(props: any) {
    const { type, className, style, onClick } = props;
    // Decide whether to display the arrow based on the current slide
    const shouldDisplay = (type === 'next' && currentSlide < dateRange?.length - 1) || (type === 'prev' && currentSlide > 0);
    return shouldDisplay ? (
      <div className={className} style={{ ...style, display: "block" }} onClick={onClick}>
        {type === 'next' ? <GrNext /> : <GrPrevious />}
      </div>) : null;
  }
  if (ContextData != undefined && ContextData?.DashboardConfig != undefined && ContextData?.DashboardConfig?.length > 0) {
    AllapprovalTask = ContextData.DashboardConfig.filter((item: any) => item.Id == 6)[0];
    if (AllapprovalTask != undefined && AllapprovalTask.length > 0)
      AllapprovalTask = AllapprovalTask[0].Tasks;
    else
      AllapprovalTask = []
  }
  let [approvalTask, setapprovalTask]: any = useState([]);
  const [sendMail, setsendMail]: any = useState(false);
  const [IsManageConfigPopup, setIsManageConfigPopup] = useState(false);
  const [SelectedItem, setSelectedItem]: any = useState({});
  if (ContextData != undefined && ContextData != '') {
    ContextData.ShowHideSettingIcon = (Value: any) => {
      IsShowConfigBtn = Value;
    };
  }
  let AllListId: any = {
    TaskUserListID: ContextData?.propsValue?.TaskUserListID,
    SmartMetadataListID: ContextData?.propsValue?.SmartMetadataListID,
    MasterTaskListID: ContextData?.propsValue?.MasterTaskListID,
    siteUrl: ContextData?.siteUrl,
    TaskTimeSheetListID: ContextData?.propsValue?.TaskTimeSheetListID,
    isShowTimeEntry: true,
    isShowSiteCompostion: true,
    Context: ContextData?.propsValue?.Context
  };
  if (AllapprovalTask && AllapprovalTask.length > 0 && flagApproval != true) {
    flagApproval = true
    setapprovalTask(AllapprovalTask)
  }
  useEffect(() => {
    Count += 1
    if (ContextData?.DashboardConfig != undefined && ContextData?.DashboardConfig?.length > 0) {
      DashboardConfig = ContextData?.DashboardConfig;
      DashboardConfigCopy = [...DashboardConfig]
    }
    if (ContextData?.DataRange != undefined && ContextData?.DataRange?.length > 0) {
      setDateRange(ContextData?.DataRange)
    }
  }, [ContextData?.DashboardConfig]);
  const ShowWorkingTask = (config: any, User: any, Time: any, ShowHideTable: any) => {
    DashboardConfig.forEach((configuration: any) => {
      if (configuration?.WebpartTitle == config?.WebpartTitle && configuration?.Tasks != undefined && configuration?.Tasks?.length > 0) {
        configuration?.Tasks.forEach((user: any) => {
          if (user?.AssingedToUserId != undefined && User?.AssingedToUserId != undefined && user?.AssingedToUserId == User?.AssingedToUserId) {
            user.IsShowTask = ShowHideTable;
          }
          if (user?.dates != undefined && user?.dates?.length > 0) {
            user?.dates.forEach((Date: any) => {
              if (Time != undefined && Date?.ServerDate?.getTime() == Time?.ServerDate?.getTime() && user?.AssingedToUserId != undefined && User?.AssingedToUserId != undefined && user?.AssingedToUserId == User?.AssingedToUserId) {
                Date.IsShowTask = !Date.IsShowTask
              }
            })
          }
        })
      }
    })
    setActiveTile((prevString: any) => Tile?.activeTile);
    rerender();
  }
  const ShowUnAssignedTask = (config: any, User: any, Time: any, ShowHideTable: any) => {
    DashboardConfig.forEach((configuration: any) => {
      if (configuration?.WebpartTitle == config?.WebpartTitle && configuration?.Tasks != undefined && configuration?.Tasks?.length > 0) {
        configuration?.Tasks.forEach((user: any) => {
          if (user?.AssingedToUserId != undefined && User?.AssingedToUserId != undefined && user?.AssingedToUserId == User?.AssingedToUserId) {
            user.IsActiveUser = ShowHideTable
            // user.IsShowTask = !user.IsShowTask
          }
          if (user?.dates != undefined && user?.dates?.length > 0) {
            user?.dates.forEach((Date: any) => {
              if (Date?.DisplayDate == 'Un-Assigned' && user?.AssingedToUserId != undefined && User?.AssingedToUserId != undefined && user?.AssingedToUserId == User?.AssingedToUserId) {
                Date.IsShowTask = ShowHideTable
              }
            })
          }
        })
      }
    })
    setActiveTile((prevString: any) => Tile?.activeTile);
    rerender();
  }
  const handleDragStart = (e: any, sourceUser: any, DragType: any) => {
    isUpdateTask = true;
    e.dataTransfer.setData("sourceUser", JSON.stringify(sourceUser));
    DragDropType = DragType;
    if (sourceUser?.TileName == 'WorkingToday')
      isUpdateTask = false;
  };
  const startDrag = (e: any, Item: any, ItemId: any, draggedItem: any) => {
    dragItem = draggedItem;
    e.dataTransfer.setData("DataId", JSON.stringify(Item))
    console.log('Drag successfuly');
  }
  const onDropUser = (e: any, User: any, config: any, WorkingDate: any) => {
    if (WorkingDate == 'Un-Assigned') {

    }
    else {
      let sourceUser = globalCommon.parseJSON(e.dataTransfer.getData("sourceUser"))
      let UpdatedItem: any = [];
      let count: any = 0;
      if (RefSelectedItem != undefined && RefSelectedItem?.length > 0) {
        RefSelectedItem?.map((DraggedItem: any) => {
          UpdatedItem.push(DraggedItem?.original)
        })
      }
      else {
        UpdatedItem.push(globalCommon.parseJSON(e.dataTransfer.getData("DataId")))
      }
      if (UpdatedItem != undefined && UpdatedItem?.length > 0) {
        UpdatedItem?.map((item: any) => {
          let Item = item;
          let AssignedToIds = [];
          if (Item?.AssignedTo == undefined)
            Item.AssignedTo = [];
          if (Item?.AssignedTo != undefined && Item?.AssignedTo?.length > 0) {
            Item?.AssignedTo?.map((assignMember: any) => {
              AssignedToIds.push(assignMember.Id);
            });
          }
          AssignedToIds.push(User?.AssingedToUserId);
          Item?.AssignedTo.push({ "Id": User?.AssingedToUserId, "Title": User?.Title })
          if (WorkingDate != undefined && WorkingDate != '') {
            if (WorkingDate == "Today") {
              let today: any = new Date();
              today.setDate(today.getDate());
              today.setHours(0, 0, 0, 0);
              WorkingDate = Moment(today).format("DD/MM/YYYY");

            }
            else if (WorkingDate == "Tomorrow") {
              let today: any = new Date();
              today.setDate(today.getDate() + 1);
              today.setHours(0, 0, 0, 0);
              WorkingDate = Moment(today).format("DD/MM/YYYY");
            }
            Item.PrevWorkingAction = JSON.parse(JSON.stringify(Item?.WorkingAction))
            if (Item?.WorkingAction == undefined || Item?.WorkingAction == '') {
              Item.WorkingAction = [];
              let Object: any = { 'Title': "WorkingDetails", "InformationData": [{ 'WorkingDate': WorkingDate, 'WorkingMember': [{ 'Id': User?.AssingedToUserId, 'Title': User?.Title }] }] }
              Item.WorkingAction.push(Object);
            }
            else if (Item?.WorkingAction != undefined && Item?.WorkingAction?.length > 0) {
              let IsAddNew: boolean = true;
              let IsWorkingDetailsExist = false;
              Item?.WorkingAction?.map((workingMember: any) => {
                if (workingMember?.InformationData != undefined && workingMember?.Title != undefined && workingMember?.Title == 'WorkingDetails') {
                  IsWorkingDetailsExist = true;
                  workingMember?.InformationData?.map((workingDetails: any) => {
                    if (workingDetails?.WorkingDate == WorkingDate) {
                      IsAddNew = false;
                      if (workingDetails?.WorkingMember == undefined)
                        workingDetails.WorkingMember = []
                      if (!IsUserIdExist(workingDetails?.WorkingMember, User))
                        workingDetails?.WorkingMember.push({ 'Id': User?.AssingedToUserId, 'Title': User?.Title })
                    }
                  })
                }
              })
              if (IsAddNew == true) {
                if (IsWorkingDetailsExist == false) {
                  Item?.WorkingAction.push({ 'Title': "WorkingDetails", 'InformationData': [] })
                }
                Item?.WorkingAction?.map((workingMember: any) => {
                  if (workingMember?.Title != undefined && workingMember?.Title == 'WorkingDetails') {
                    if (workingMember?.InformationData == undefined)
                      workingMember.InformationData = [];
                    workingMember.InformationData.push({ 'WorkingDate': WorkingDate, 'WorkingMember': [{ 'Id': User?.AssingedToUserId, 'Title': User?.Title }] })

                  }
                })
              }
            }
          }
          Item.percentage = 10 + '%';
          StatusOptions?.map((item: any) => {
            if (10 == item.value) {
              Item.Status = item?.taskStatusComment
            }
          });
          if (Item != undefined && Item != '') {
            let web = new Web(ContextData?.propsValue?.siteUrl);
            let PostData: any = {
              AssignedToId: { results: AssignedToIds != undefined && AssignedToIds.length > 0 ? AssignedToIds : [], },
              PercentComplete: 10 / 100,
              Status: Item?.Status,
              WorkingAction: Item?.WorkingAction?.length > 0 ? JSON.stringify(Item?.WorkingAction) : '',
              IsTodaysTask: true,
            }
            web.lists.getById(Item.listId).items.getById(Item?.Id).update(PostData).then((res: any) => {
              count++;
              console.log('Drop successfuly');
              DashboardConfig?.forEach((item: any) => {
                if (item?.WebpartTitle != undefined && dragItem?.WebpartTitle != undefined && item?.WebpartTitle == dragItem?.WebpartTitle) {
                  item?.Tasks.map((task: any) => {
                    if (task?.Id == Item.Id) {
                      task.AssignedTo = Item?.AssignedTo;
                      task.TeamMembers = Item?.TeamMembers;
                    }
                    if (task?.dates != undefined && task?.dates?.length > 0) {
                      task?.dates.map((Time: any) => {
                        if (Time?.Tasks != undefined && Time?.Tasks?.length > 0) {
                          Time?.Tasks.map((updatedItem: any) => {
                            if (updatedItem?.Id == Item.Id) {
                              updatedItem.WorkingAction = [...Item?.WorkingAction];;
                              if (updatedItem?.WorkingAction != undefined && updatedItem?.WorkingAction != '' && updatedItem?.WorkingAction?.length > 0) {
                                updatedItem.WorkingDate = ''
                                updatedItem?.WorkingAction?.map((workingMember: any) => {
                                  if (workingMember?.InformationData != undefined && workingMember?.Title != undefined && workingMember?.Title == 'WorkingDetails' && workingMember?.InformationData?.length > 0) {
                                    workingMember?.InformationData?.map((workingDetails: any) => {
                                      if (workingDetails?.WorkingMember != undefined && workingDetails?.WorkingMember?.length > 0) {
                                        workingDetails?.WorkingMember?.forEach((workingUser: any) => {
                                          if (User.AssingedToUserId != undefined && workingUser?.Id === User.AssingedToUserId) {
                                            updatedItem.WorkingDate += workingDetails?.WorkingDate + ' | '
                                          }
                                        })
                                      }
                                    })
                                  }
                                })
                              }
                              // updatedItem.WorkingDate = updatedItem?.WorkingDate?.replace(/;+$/, '');
                            }
                          })
                          if (DragDropType == 'Un-Assigned' && Time?.Tasks != undefined && Time?.Tasks?.length > 0) {
                            Time.Tasks = Time?.Tasks.filter((task: any) => task?.Id != Item.Id);
                            if (Time?.Tasks) {
                              Time.TotalEstimatedTime = 0;
                              Time?.Tasks.map((Item: any) => {
                                Time.TotalEstimatedTime += Item?.EstimatedTime;
                              })
                              Time.TotalTask = Time?.Tasks?.length;
                            } else {
                              Time.TotalTask = 0;
                              Time.TotalEstimatedTime = 0;
                            }
                          }
                        }
                      })
                    }
                    if (task?.AssingedToUserId != undefined && task?.Tasks != undefined && task?.Tasks?.length > 0) {
                      task?.Tasks.map((updatedItem: any) => {
                        if (updatedItem?.Id == Item.Id) {
                          updatedItem.WorkingAction = [...Item?.WorkingAction];
                          if (updatedItem?.WorkingAction != undefined && updatedItem?.WorkingAction != '' && updatedItem?.WorkingAction?.length > 0 && task?.AssingedToUserId == User?.AssingedToUserId) {
                            updatedItem.WorkingDate = ''
                            updatedItem?.WorkingAction?.map((workingMember: any) => {
                              if (workingMember?.InformationData != undefined && workingMember?.Title != undefined && workingMember?.Title == 'WorkingDetails' && workingMember?.InformationData?.length > 0) {
                                workingMember?.InformationData?.map((workingDetails: any) => {
                                  if (workingDetails?.WorkingMember != undefined && workingDetails?.WorkingMember?.length > 0) {
                                    workingDetails?.WorkingMember?.forEach((workingUser: any) => {
                                      if (User.AssingedToUserId != undefined && workingUser?.Id === User?.AssingedToUserId) {
                                        updatedItem.WorkingDate += workingDetails?.WorkingDate + ' | '
                                      }
                                    })
                                  }
                                })
                              }
                            })
                          }
                          //updatedItem.WorkingDate = updatedItem?.WorkingDate?.replace(/;+$/, '');
                        }
                      })
                    }
                  });
                  if (item?.Tasks != undefined) {
                    item.Tasks = item?.Tasks.filter((task: any) => task?.Id != Item.Id);
                  }
                }
                if (item?.WebpartTitle != undefined && config?.WebpartTitle != undefined && item?.WebpartTitle == config?.WebpartTitle) {
                  if (item?.Tasks != undefined) {
                    item?.Tasks.map((user: any) => {
                      if (user?.AssingedToUserId == User?.AssingedToUserId) {
                        if (Item?.WorkingAction != undefined && Item?.WorkingAction != '' && Item?.WorkingAction?.length > 0) {
                          Item.WorkingDate = '';
                          Item?.WorkingAction?.map((workingMember: any) => {
                            if (workingMember?.InformationData != undefined && workingMember?.Title != undefined && workingMember?.Title == 'WorkingDetails' && workingMember?.InformationData?.length > 0) {
                              workingMember?.InformationData?.map((workingDetails: any) => {
                                if (workingDetails?.WorkingMember != undefined && workingDetails?.WorkingMember?.length > 0) {
                                  let WorkingDate: any = Moment(workingDetails?.WorkingDate, 'DD/MM/YYYY');
                                  WorkingDate?._d.setHours(0, 0, 0, 0)
                                  workingDetails?.WorkingMember?.map((assignMember: any) => {
                                    if (User.AssingedToUserId != undefined && assignMember?.Id === User.AssingedToUserId) {
                                      Item.WorkingDate += workingDetails?.WorkingDate + ' | '
                                    }
                                    user?.dates.map((Time: any) => {
                                      if (Time?.ServerDate?.getTime() == WorkingDate?._d.getTime() && user?.AssingedToUserId == assignMember?.Id && !isTaskItemExists(Time?.Tasks, Item)) {
                                        Time?.Tasks.push(Item);
                                        Time.TotalTask = Time?.Tasks?.length;
                                        Time.TotalEstimatedTime += Item?.EstimatedTime;
                                      }
                                    })
                                    if (User?.AssingedToUserId != undefined && assignMember?.Id === User.AssingedToUserId && !isTaskItemExists(User.Tasks, Item)) {
                                      if (User?.Tasks == undefined)
                                        User.Tasks = [];
                                      User.Tasks.push(Item)
                                      User.TotalTask += 1;
                                      User.TotalEstimatedTime += Item?.EstimatedTime;
                                    }
                                  })
                                }
                              })
                            }
                          })
                        }
                      }
                      // if (user?.AssingedToUserId == sourceUser?.AssingedToUserId) {
                      //   if (Item?.PrevWorkingAction != undefined && Item?.PrevWorkingAction != '' && Item?.PrevWorkingAction?.length > 0) {
                      //     Item?.PrevWorkingAction?.map((workingDetails: any) => {
                      //       if (workingDetails?.WorkingMember != undefined && workingDetails?.WorkingMember?.length > 0) {
                      //         let WorkingDate: any = Moment(workingDetails?.WorkingDate, 'DD/MM/YYYY');
                      //         WorkingDate?._d.setHours(0, 0, 0, 0)
                      //         user?.dates.map((Time: any) => {
                      //           if (Time?.ServerDate.getTime() == WorkingDate?._d.getTime()) {
                      //             Time.Tasks = Time?.Tasks.filter((Task: any) => Task?.Id != Item.Id);
                      //             Time.TotalTask = Time?.Tasks?.length;
                      //             Time.TotalEstimatedTime -= Item?.EstimatedTime;
                      //           }
                      //         })
                      //       }
                      //     })
                      //   }
                      // }
                    });
                  }
                }
              });
              DashboardConfigCopy = JSON.parse(JSON.stringify(DashboardConfig));
              DashboardConfigCopy?.map((Config: any) => {
                if (Config?.Tasks != undefined && Config?.Tasks?.length > 0) {
                  Config?.Tasks?.map((Date: any) => {
                    if (Date?.dates != undefined && Date?.dates?.length > 0) {
                      Date?.dates?.map((Time: any) => {
                        if (Time?.ServerDate != undefined && Time?.ServerDate != '') {
                          Time.ServerDate = Moment(Time?.ServerDate)
                          Time.ServerDate = Time.ServerDate?._d;
                          Time.ServerDate.setHours(0, 0, 0, 0)
                        }
                      })
                    }
                  });
                }
              });
              if (count == UpdatedItem?.length) {
                try {
                  if (childRef?.current != undefined)
                    childRef?.current?.setRowSelection({});
                  setRefSelectedItem([])
                  setActiveTile(Tile?.activeTile)
                  rerender();
                } catch (e) {
                  console.log(e)
                }
              }

            }).catch((err: any) => {
              console.log(err);
            })
          }
        })
      }
    }
  }
  const onDropTable = (e: any, Type: any, config: any) => {
    if (isUpdateTask == true) {
      let sourceUser = globalCommon.parseJSON(e.dataTransfer.getData("sourceUser"))
      let Status: any = 0;
      let count = 0;
      if (Type != undefined) {
        Status = Type
      }
      // let Item = globalCommon.parseJSON(e.dataTransfer.getData("DataId"))
      let UpdatedItem: any = []
      if (RefSelectedItem != undefined && RefSelectedItem?.length > 0) {
        RefSelectedItem?.map((DraggedItem: any) => {
          UpdatedItem.push(DraggedItem?.original)
        })
      }
      else {
        UpdatedItem.push(globalCommon.parseJSON(e.dataTransfer.getData("DataId")))
      }
      if (UpdatedItem != undefined && UpdatedItem?.length > 0) {
        UpdatedItem?.map((item: any) => {
          let Item = item;
          Status = Status == undefined || Status == '' ? Item?.PercentComplete : Status
          Item.percentage = Status != undefined && Status != '' ? Status : Item?.PercentComplete;
          StatusOptions?.map((item: any) => {
            if (Status == item.value) {
              Item.Status = item?.taskStatusComment
            }
          });
          Item.PrevWorkingAction = JSON.parse(JSON.stringify(Item?.WorkingAction))
          if (Item != undefined && Item != '') {
            let PostData: any = {};
            let web = new Web(ContextData?.propsValue?.siteUrl);
            if (config?.onDropAction != undefined && config?.onDropAction?.length) {
              config?.onDropAction.map((dropAction: any) => {
                if (dropAction?.SelectedValue) {
                  if (dropAction?.SelectedField != undefined && dropAction?.SelectedField != '' && dropAction?.SelectedField == 'Status') {
                    Status = dropAction?.SelectedValue != undefined ? dropAction?.SelectedValue : Status
                    Item.percentage = Status != undefined && Status != '' ? Status : dropAction?.SelectedValue;
                    Item.PercentComplete = dropAction?.SelectedValue;
                    StatusOptions?.map((item: any) => {
                      if (Status == item.value) {
                        Item.Status = item?.taskStatusComment
                      }
                    });
                    PostData.PercentComplete = Status / 100;
                    PostData.Status = Item.Status;
                  }
                  else if (dropAction?.SelectedField != undefined && dropAction?.SelectedField != '' && dropAction?.SelectedField == 'DueDate') {
                    Item.DisplayDueDate = dropAction?.SelectedValue;
                    let SplitDate: any = dropAction?.SelectedValue.split('/')
                    let serverDate: any = Moment(SplitDate[1] + '/' + SplitDate[0] + '/' + SplitDate[2])
                    serverDate._d.setHours(0, 0, 0, 0);
                    PostData.DueDate = serverDate._d;
                    Item.DueDate = serverDate._d;
                  }
                  else if (dropAction?.SelectedField != undefined && dropAction?.SelectedField != '' && dropAction?.SelectedField == 'Priority') {
                    let priority = '';
                    if (dropAction?.SelectedValue >= 8 && dropAction?.SelectedValue <= 10) {
                      priority = '(1) High';
                    }
                    if (dropAction?.SelectedValue >= 4 && dropAction?.SelectedValue <= 7) {
                      priority = '(2) Normal';
                    }
                    if (dropAction?.SelectedValue >= 1 && dropAction?.SelectedValue <= 3) {
                      priority = '(3) Low';
                    }
                    PostData.Priority = priority
                    Item.Priority = dropAction?.SelectedValue;
                    PostData.PriorityRank = dropAction?.SelectedValue;
                    Item.PriorityRank = dropAction?.SelectedValue;
                  }
                  else if (dropAction?.SelectedField != undefined && dropAction?.SelectedField != '' && dropAction?.SelectedField == 'WorkingMember') {
                    let AssignedToIds: any = [];
                    if (Item?.AssignedTo == undefined)
                      Item.AssignedTo = [];
                    Item?.AssignedTo.map((assign: any) => {
                      AssignedToIds.push(assign?.Id)
                    })
                    if (dropAction?.SelectedValue != undefined && dropAction?.SelectedValue?.length) {
                      dropAction?.SelectedValue.map((dropActions: any) => {
                        AssignedToIds.push(dropActions?.AssingedToUserId)
                        if (Item?.AssignedTo) {
                          Item?.AssignedTo?.push({ 'Id': dropActions?.AssingedToUserId, "Title": dropActions?.Title })
                        }
                        else {
                          Item.AssignedTo = []
                          Item?.AssignedTo?.push({ 'Id': dropActions?.AssingedToUserId, "Title": dropActions?.Title })
                        }
                      });
                    }
                    PostData.AssignedToId = { results: AssignedToIds }
                  }
                  else if (dropAction?.SelectedField != undefined && dropAction?.SelectedField != '' && dropAction?.SelectedField == 'TeamMember') {
                    let TeamMembersIds: any = [];
                    if (Item?.TeamMembers == undefined)
                      Item.TeamMembers = [];
                    Item?.TeamMembers.map((assign: any) => {
                      TeamMembersIds.push(assign?.Id)
                    })
                    if (dropAction?.SelectedValue != undefined && dropAction?.SelectedValue?.length) {
                      dropAction?.SelectedValue.map((dropActions: any) => {
                        TeamMembersIds.push(dropActions?.AssingedToUserId)
                        if (Item?.TeamMembers) {
                          Item?.TeamMembers?.push({ 'Id': dropActions?.AssingedToUserId, "Title": dropActions?.Title })
                        }
                        else {
                          Item.TeamMembers = []
                          Item?.TeamMembers?.push({ 'Id': dropActions?.AssingedToUserId, "Title": dropActions?.Title })
                        }
                      });
                    }
                    PostData.TeamMembersId = { results: TeamMembersIds }
                  }
                  else if (dropAction?.SelectedField != undefined && dropAction?.SelectedField != '' && dropAction?.SelectedField == 'TeamLeader') {
                    let ResponsibleTeamIds: any = [];
                    if (Item?.ResponsibleTeam == undefined)
                      Item.ResponsibleTeam = [];
                    Item?.ResponsibleTeam.map((assign: any) => {
                      ResponsibleTeamIds.push(assign?.Id)
                    })
                    if (dropAction?.SelectedValue != undefined && dropAction?.SelectedValue?.length) {
                      dropAction?.SelectedValue.map((dropActions: any) => {
                        ResponsibleTeamIds.push(dropActions?.AssingedToUserId)
                        if (Item?.ResponsibleTeam) {
                          Item?.ResponsibleTeam?.push({ 'Id': dropActions?.AssingedToUserId, "Title": dropActions?.Title })
                        }
                        else {
                          Item.ResponsibleTeam = []
                          Item?.ResponsibleTeam?.push({ 'Id': dropActions?.AssingedToUserId, "Title": dropActions?.Title })
                        }
                      });
                    }
                    PostData.ResponsibleTeamId = { results: ResponsibleTeamIds }
                  }
                  else if (dropAction?.SelectedField != undefined && dropAction?.SelectedField != '' && dropAction?.SelectedField == 'WorkingDate') {
                    let AssignedUser: any = config?.onDropAction?.filter((Category: any) => Category?.SelectedField == 'WorkingMember')[0]
                    if (Item?.WorkingAction != undefined && Item?.WorkingAction?.length > 0) {
                      let IsAddNew: boolean = true;
                      let IsWorkingDetailsExist = false;
                      Item?.WorkingAction?.map((workingMember: any) => {
                        if (workingMember?.InformationData != undefined && workingMember?.Title != undefined && workingMember?.Title == 'WorkingDetails') {
                          IsWorkingDetailsExist = true;
                          workingMember?.InformationData?.map((workingDetails: any) => {
                            if (workingDetails?.WorkingDate == dropAction?.SelectedValue) {
                              IsAddNew = false;
                              if (workingDetails?.WorkingMember == undefined)
                                workingDetails.WorkingMember = []
                              if (AssignedUser?.SelectedValue) {
                                AssignedUser?.SelectedValue?.map((User: any) => {
                                  if (!IsUserIdExist(workingDetails?.WorkingMember, User))
                                    workingDetails?.WorkingMember.push({ 'Id': User?.AssingedToUserId, 'Title': User?.Title })
                                })
                              }
                            }
                          })
                        }
                      })
                      if (IsAddNew == true) {
                        if (IsWorkingDetailsExist == false) {
                          Item?.WorkingAction.push({ 'Title': "WorkingDetails", 'InformationData': [] })
                        }
                        Item?.WorkingAction?.map((workingMember: any) => {
                          if (workingMember?.Title != undefined && workingMember?.Title == 'WorkingDetails') {
                            if (workingMember?.InformationData == undefined)
                              workingMember.InformationData = [];
                            workingMember.InformationData.push({ 'WorkingDate': dropAction?.SelectedValue, 'WorkingMember': [] })
                            workingMember?.InformationData?.map((workingDetails: any) => {
                              if (workingDetails?.WorkingDate == dropAction?.SelectedValue) {
                                if (workingDetails?.WorkingMember == undefined)
                                  workingDetails.WorkingMember = []
                                if (AssignedUser?.SelectedValue) {
                                  AssignedUser?.SelectedValue?.map((User: any) => {
                                    if (!IsUserIdExist(workingDetails?.WorkingMember, User))
                                      workingDetails?.WorkingMember.push({ 'Id': User?.AssingedToUserId, 'Title': User?.Title })
                                  })
                                }
                              }
                            })
                          }
                        })
                      }
                    }
                    else {
                      if (Item?.WorkingAction == undefined || Item?.WorkingAction?.length == 0) {
                        Item.WorkingAction = [];
                        Item?.WorkingAction.push({ 'Title': "WorkingDetails", 'InformationData': [{ 'WorkingDate': dropAction?.SelectedValue, 'WorkingMember': [] }] })
                        Item?.WorkingAction?.map((workingMember: any) => {
                          if (workingMember?.Title != undefined && workingMember?.Title == 'WorkingDetails') {
                            workingMember?.InformationData?.map((workingDetails: any) => {
                              if (workingDetails?.WorkingDate == dropAction?.SelectedValue) {
                                if (workingDetails?.WorkingMember == undefined)
                                  workingDetails.WorkingMember = []
                                if (AssignedUser?.SelectedValue) {
                                  AssignedUser?.SelectedValue?.map((User: any) => {
                                    if (!IsUserIdExist(workingDetails?.WorkingMember, User))
                                      workingDetails?.WorkingMember.push({ 'Id': User?.AssingedToUserId, 'Title': User?.Title })
                                  })
                                }
                              }
                            })
                          }
                        })
                      }
                    }
                    PostData.WorkingAction = JSON.stringify(Item?.WorkingAction);
                  }
                  else if (dropAction?.SelectedField != undefined && dropAction?.SelectedField != '' && dropAction?.SelectedField == 'Categories') {
                    let CategoriesIds: any = [];
                    let TaskCategoriesTite = '';
                    Item?.TaskCategories.map((cate: any) => {
                      CategoriesIds.push(cate?.Id)
                      TaskCategoriesTite += TaskCategoriesTite + ';' + cate?.Title
                    })
                    if (dropAction?.SelectedValue != undefined && dropAction?.SelectedValue?.length) {
                      dropAction?.SelectedValue.map((dropActions: any) => {
                        CategoriesIds.push(dropActions?.Id)
                        TaskCategoriesTite += TaskCategoriesTite + ';' + dropActions?.Title
                        if (Item?.TaskCategories) {
                          Item?.TaskCategories?.push(dropActions)
                        }
                        else {
                          Item.TaskCategories = []
                          Item?.TaskCategories?.push(dropActions)
                        }
                      });
                    }
                    Item.TaskTypeValue = TaskCategoriesTite;
                    PostData.TaskCategoriesId = { results: CategoriesIds }
                    PostData.Categories = TaskCategoriesTite;
                  }
                }
              })
            }
            else {
              if (config?.TileName == 'WorkingToday') {
                let today: any = new Date();
                today.setDate(today.getDate());
                today.setHours(0, 0, 0, 0);
                let WorkingDate: any = Moment(today).format("DD/MM/YYYY");
                Item.WorkingDate = WorkingDate
                if (Item?.WorkingAction != undefined && Item?.WorkingAction?.length > 0) {
                  let IsAddNew: boolean = true;
                  let IsWorkingDetailsExist = false;
                  Item?.WorkingAction?.map((workingMember: any) => {
                    if (workingMember?.InformationData != undefined && workingMember?.Title != undefined && workingMember?.Title == 'WorkingDetails') {
                      IsWorkingDetailsExist = true;
                      workingMember?.InformationData?.map((workingDetails: any) => {
                        if (workingDetails?.WorkingDate == WorkingDate) {
                          IsAddNew = false;
                          if (workingDetails?.WorkingMember == undefined)
                            workingDetails.WorkingMember = []
                          if (!IsUserIdExist(workingDetails?.WorkingMember, ContextData?.currentUserData))
                            workingDetails?.WorkingMember.push({ 'Id': ContextData?.currentUserData?.AssingedToUserId, 'Title': ContextData?.currentUserData?.Title })
                        }
                      })
                    }
                  })
                  if (IsAddNew == true) {
                    if (IsWorkingDetailsExist == false) {
                      Item?.WorkingAction.push({ 'Title': "WorkingDetails", 'InformationData': [] })
                    }
                    Item?.WorkingAction?.map((workingMember: any) => {
                      if (workingMember?.Title != undefined && workingMember?.Title == 'WorkingDetails') {
                        if (workingMember?.InformationData == undefined)
                          workingMember.InformationData = [];
                        workingMember.InformationData.push({ 'WorkingDate': WorkingDate, 'WorkingMember': [{ 'Id': ContextData?.currentUserData?.AssingedToUserId, 'Title': ContextData?.currentUserData?.Title }] })

                      }
                    })
                  }
                }
                Item.PrevWorkingAction = JSON.parse(JSON.stringify(Item?.WorkingAction))
              }
              else {
                if (Item?.WorkingAction != undefined && Item?.WorkingAction?.length > 0)
                  Item.WorkingAction = Item?.WorkingAction.filter((Category: any) => Category?.Title !== 'WorkingDetails')
              }
              PostData = {
                PercentComplete: Status / 100,
                Status: Item?.Status,
                WorkingAction: Item?.WorkingAction?.length > 0 ? JSON.stringify(Item?.WorkingAction) : '',
                AssignedToId: { results: config?.TileName == 'WorkingToday' ? [ContextData?.currentUserData?.AssingedToUserId] : [], },
                IsTodaysTask: false,
              }
              if (DragDropType == "Un-Assigned")
                PostData.ResponsibleTeamId = { results: [ContextData?.currentUserData?.AssingedToUserId] }
            }

            web.lists.getById(Item.listId).items.getById(Item?.Id).update(PostData).then((res: any) => {
              console.log('Drop successfuly');
              count++;
              if (config?.onDropAction != undefined && config?.onDropAction?.length) {
                if (count == UpdatedItem?.length) {
                  alert('Task update successfully please refresh page to reflect changes')
                }
              }
              else {
                DashboardConfig?.forEach((item: any) => {
                  if (item?.WebpartTitle != undefined && dragItem?.WebpartTitle != undefined && item?.WebpartTitle == dragItem?.WebpartTitle) {
                    if (item?.Tasks != undefined) {
                      item?.Tasks.map((user: any) => {
                        // if (user?.AssingedToUserId == sourceUser?.AssingedToUserId) {
                        if (config?.TileName != 'WorkingToday')
                          Item.WorkingDate = '';
                        if (Item.PrevWorkingAction != undefined && Item.PrevWorkingAction != '' && Item.PrevWorkingAction?.length > 0) {
                          Item.PrevWorkingAction?.map((workingMember: any) => {
                            if (workingMember?.InformationData != undefined && workingMember?.Title != undefined && workingMember?.Title == 'WorkingDetails' && workingMember?.InformationData?.length > 0) {
                              workingMember?.InformationData?.map((workingDetails: any) => {
                                if (workingDetails?.WorkingMember != undefined && workingDetails?.WorkingMember?.length > 0) {
                                  let WorkingDate: any = Moment(workingDetails?.WorkingDate, 'DD/MM/YYYY');
                                  WorkingDate?._d.setHours(0, 0, 0, 0)
                                  if (user?.dates != undefined && user?.dates?.length > 0) {
                                    user?.dates.map((Time: any) => {
                                      if (Time?.ServerDate?.getTime() == WorkingDate?._d.getTime()) {
                                        Time.Tasks = Time?.Tasks.filter((Task: any) => Task?.Id != Item.Id);
                                        Time.TotalTask = Time?.Tasks?.length;
                                        Time.TotalEstimatedTime -= Item?.EstimatedTime;
                                        user.Tasks = Time?.Tasks
                                        user.TotalTask = Time?.TotalTask
                                        user.TotalEstimatedTime -= Time?.TotalEstimatedTime
                                      }
                                    })
                                  }
                                }
                              })
                            }
                          })
                        }
                        //}
                      });
                      if ((sourceUser?.AssingedToUserId == undefined || sourceUser?.AssingedToUserId == '') && config?.TileName != 'WorkingToday') {
                        item.Tasks = item?.Tasks.filter((Task: any) => Task?.Id != Item.Id);
                      }
                      if (DragDropType == "Un-Assigned" && item?.Tasks[0] != undefined && item?.Tasks[0]?.dates?.length > 0 && item?.Tasks[0]?.dates[0]?.Tasks != undefined && item?.Tasks[0]?.dates[0]?.Tasks?.length > 0) {
                        item.Tasks[0].dates[0].Tasks = item?.Tasks[0]?.dates[0]?.Tasks?.filter((Task: any) => Task?.Id != Item.Id);
                      }
                    }
                  }
                  if (item?.WebpartTitle != undefined && config?.WebpartTitle != undefined && item?.WebpartTitle == config?.WebpartTitle && !isTaskItemExists(item?.Tasks, Item)) {
                    item?.Tasks.push(Item)
                  }
                });
                DashboardConfigCopy = JSON.parse(JSON.stringify(DashboardConfig));
                DashboardConfigCopy?.map((Config: any) => {
                  if (Config?.Tasks != undefined && Config?.Tasks?.length > 0) {
                    Config?.Tasks?.map((Date: any) => {
                      if (Date?.dates != undefined && Date?.dates?.length > 0) {
                        Date?.dates?.map((Time: any) => {
                          if (Time?.ServerDate != undefined && Time?.ServerDate != '') {
                            Time.ServerDate = Moment(Time?.ServerDate)
                            Time.ServerDate = Time.ServerDate?._d;
                            Time.ServerDate.setHours(0, 0, 0, 0)
                          }
                        })
                      }
                    });
                  }
                });
                if (count == UpdatedItem?.length) {
                  try {
                    if (childRef?.current != undefined)
                      childRef?.current?.setRowSelection({});
                    setRefSelectedItem([])
                  } catch (e) {
                    console.log(e)
                  }
                }
                setActiveTile(Tile?.activeTile)
                rerender();
              }
            }).catch((err: any) => {
              console.log(err);
            })
          }
        })
      }
    }
    else {
      alert('You cannot drag today tasks')
    }
  }
  const isTaskItemExists = (array: any, items: any) => {
    let isExists = false;
    for (let index = 0; index < array.length; index++) {
      let item = array[index];
      if (item.Id == items.Id && items?.siteType != undefined && items?.siteType != '' && item?.siteType != undefined && item?.siteType != '' && item?.siteType.toLowerCase() == items?.siteType.toLowerCase()) {
        isExists = true;
        break;
      }
    }
    return isExists;
  }
  const IsUserIdExist = (array: any, User: any) => {
    let isExists = false;
    for (let index = 0; index < array.length; index++) {
      let item = array[index];
      if (User?.AssingedToUserId != undefined && item != undefined && item?.Id != undefined && User?.AssingedToUserId == item?.Id) {
        isExists = true;
        break;
      }
    }
    return isExists;
  }
  const openRejectPopup = (RejectedItem: any) => {
    RejectedItem.PreviousComment = ''
    if (RejectedItem?.RejectedDetails == undefined) {
      RejectedItem.RejectedDetails = { "RejectedComment": "", "AuthorName": ContextData?.currentUserData?.Title, "AuthorId": ContextData?.currentUserData?.AssingedToUserId, "AuthorImage": ContextData?.currentUserData?.ItemCover != undefined ? ContextData?.currentUserData?.ItemCover?.Url : "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg" }
    }
    else {
      RejectedItem.PreviousComment = RejectedItem.RejectedDetails?.RejectedComment;
    }
    setisRejectItem(RejectedItem)
  }
  const updateRejectedComment = (e: any) => {
    console.log(e.target.value)
    let RejectedItem: any = { ...isRejectItem }
    RejectedItem.RejectedDetails.RejectedComment = e.target.value
    setisRejectItem(RejectedItem)
  }
  const CallBackTimeEntry = (Count: any, UpdateStatus: any) => {
    setisRejectItem(undefined)
    if (Count == RefSelectedItem?.length) {
      const arrayOfIDs = RefSelectedItem?.map((item: any) => item?.original?.UpdatedId);
      DashboardConfig?.map((Config: any) => {
        if (Config?.DataSource == 'TimeSheet') {
          Config.Tasks = Config.Tasks.filter((item: any) => !arrayOfIDs.includes(item.UpdatedId));
        }
      })
      childRef?.current?.setRowSelection({});
      console.log('Updated Succesfully')
      alert("All Time Entry " + UpdateStatus + " Successfully.")
      DashboardConfigCopy = JSON.parse(JSON.stringify(DashboardConfig));
      DashboardConfigCopy?.map((Config: any) => {
        if (Config?.Tasks != undefined && Config?.Tasks?.length > 0) {
          Config?.Tasks?.map((Date: any) => {
            if (Date?.dates != undefined && Date?.dates?.length > 0) {
              Date?.dates?.map((Time: any) => {
                if (Time?.ServerDate != undefined && Time?.ServerDate != '') {
                  Time.ServerDate = Moment(Time?.ServerDate)
                  Time.ServerDate = Time.ServerDate?._d;
                  Time.ServerDate.setHours(0, 0, 0, 0)
                }
              })
            }
          });
        }
      });
      setActiveTile(Tile?.activeTile)
      rerender();
    }
  }
  const SaveApprovalRejectPopup = async (Type: any, Item: any, UpdateStatus: any) => {
    if (Type != 'ApprovedAll') {
      let RejectedItem: any;
      if (Item != undefined && Item != '')
        RejectedItem = { ...Item }
      else
        RejectedItem = { ...isRejectItem }
      RejectedItem.Status = Type;
      if (ContextData?.AllTimeEntry != undefined && ContextData?.AllTimeEntry?.length > 0 && RejectedItem != undefined) {
        let UpdatedItem = ContextData?.AllTimeEntry.filter((item: any) => item.Id != undefined && item.Id == RejectedItem?.UpdatedId)[0]
        if (UpdatedItem?.AdditionalTimeEntry != undefined && UpdatedItem?.AdditionalTimeEntry?.length > 0) {
          UpdatedItem?.AdditionalTimeEntry.forEach((TimeEntry: any) => {
            if (TimeEntry?.ID != undefined && RejectedItem?.ID != undefined && TimeEntry?.ID == RejectedItem?.ID) {
              TimeEntry.Status = RejectedItem.Status
              if (RejectedItem?.RejectedDetails != undefined && RejectedItem.RejectedDetails?.RejectedComment != undefined && RejectedItem.RejectedDetails?.RejectedComment != '')
                TimeEntry.RejectedDetails = RejectedItem?.RejectedDetails
            }
            delete TimeEntry?.TaskDates;
            delete TimeEntry?.sortTaskDate;
            delete TimeEntry?.PreviousComment;
            delete TimeEntry?.UpdatedId;
            delete TimeEntry?.SiteIcon;
            delete TimeEntry?.TaskID;
            delete TimeEntry?.Site;
            delete TimeEntry?.TaskItem;
          })
          //setisRejectItem(undefined)
          let web = new Web(UpdatedItem?.siteUrl);
          await web.lists.getById(UpdatedItem?.listId).items.getById(UpdatedItem.Id).update({ AdditionalTimeEntry: JSON.stringify(UpdatedItem?.AdditionalTimeEntry), })
            .then(async (res: any) => {
              setisRejectItem(undefined);
              alert("Time Entry " + Type + " Successfully.")
              DashboardConfig?.map((Config: any) => {
                if (Config?.DataSource == 'TimeSheet' && Config.Tasks != undefined && Config.Tasks?.length > 0) {
                  Config.Tasks?.forEach((Time: any, index: any) => {
                    if (Time?.ID == RejectedItem?.ID && (Time?.UpdatedId == undefined || Time?.UpdatedId == RejectedItem?.UpdatedId)) {
                      Config.Tasks?.splice(index, 1)
                    }
                  });
                }
              })
              DashboardConfigCopy = JSON.parse(JSON.stringify(DashboardConfig));
              DashboardConfigCopy?.map((Config: any) => {
                if (Config?.Tasks != undefined && Config?.Tasks?.length > 0) {
                  Config?.Tasks?.map((Date: any) => {
                    if (Date?.dates != undefined && Date?.dates?.length > 0) {
                      Date?.dates?.map((Time: any) => {
                        if (Time?.ServerDate != undefined && Time?.ServerDate != '') {
                          Time.ServerDate = Moment(Time?.ServerDate)
                          Time.ServerDate = Time.ServerDate?._d;
                          Time.ServerDate.setHours(0, 0, 0, 0)
                        }
                      })
                    }
                  });
                }
              });
              console.log('Updated Succesfully')
              setisRejectItem(undefined)
              setActiveTile(Tile?.activeTile)
              rerender();
              if (Type == "Rejected") {
                let sendUserEmail: any = [];
                let FilterItem = AllTaskUser?.filter((User: any) => User?.AssingedToUserId == RejectedItem?.AuthorId)[0];
                sendUserEmail.push(FilterItem?.AssingedToUser?.EMail)
                let TeamMsg = ` <p>Hi ${RejectedItem?.AuthorName},</p>
                </br>
                <p>Your timesheet on the task: <a href=${UpdatedItem?.siteUrl}/SitePages/Task-Profile.aspx?taskId=${UpdatedItem['Task' + UpdatedItem?.TaskListType].Id}&Site=${UpdatedItem?.TaskListType}>T${UpdatedItem['Task' + UpdatedItem?.TaskListType].Id}-${UpdatedItem['Task' + UpdatedItem?.TaskListType].Title}</a> has been rejected by your lead. Please have a look and take the necessary action.</p>
                <p>Reason for rejection:</p>
                <p>${RejectedItem?.RejectedDetails?.RejectedComment}</p>
                </br>
                <p>Thanks,</p>`
                await globalCommon.SendTeamMessage(sendUserEmail, TeamMsg, ContextData?.propsValue?.Context, ContextData?.propsValue);
              }

            }).catch((err: any) => {
              console.log(err);
            })
        }
      }
    }
    else if (Type == 'ApprovedAll') {
      let Count = 0;
      if (ContextData?.AllTimeEntry != undefined && ContextData?.AllTimeEntry?.length > 0) {
        ContextData?.AllTimeEntry.forEach((Item: any) => {
          if (RefSelectedItem != undefined && RefSelectedItem?.length > 0) {
            RefSelectedItem?.forEach((SelectedItem: any) => {
              if (SelectedItem?.original?.UpdatedId == Item.Id) {
                Item.IsUpdateJSONEntry = true;
              }
            })
          }
          //Update TimeEntry-----------------------
          if (Item?.IsUpdateJSONEntry == true) {
            if (Item?.AdditionalTimeEntry != undefined && Item?.AdditionalTimeEntry?.length > 0) {
              Item?.AdditionalTimeEntry.forEach((TimeEntry: any) => {
                RefSelectedItem?.forEach((SelectedItem: any) => {
                  if (SelectedItem?.original?.Id == TimeEntry.Id) {
                    TimeEntry.Status = UpdateStatus;
                    delete TimeEntry?.TaskDates;
                    delete TimeEntry?.sortTaskDate;
                    delete TimeEntry?.PreviousComment;
                    delete TimeEntry?.UpdatedId;
                    delete TimeEntry?.SiteIcon;
                    delete TimeEntry?.TaskID;
                    delete TimeEntry?.Site;
                    delete TimeEntry?.TaskItem;
                  }
                })
              })
            }
            let web = new Web(Item?.siteUrl);
            web.lists.getById(Item?.listId).items.getById(Item.Id).update({ AdditionalTimeEntry: JSON.stringify(Item?.AdditionalTimeEntry), })
              .then((res: any) => {
                Count++;
                CallBackTimeEntry(Count, UpdateStatus);
              }).catch((err: any) => {
                Count++;
                CallBackTimeEntry(Count, UpdateStatus);
                console.log(err);
              })
          }
          //End Here-------------------------------------
        })
      }
    }
  }
  const CancelRejectPopup = () => {
    let RejectedItem: any = { ...isRejectItem }
    if (RejectedItem.PreviousComment != undefined && RejectedItem.RejectedDetails != undefined)
      RejectedItem.RejectedDetails.RejectedComment = RejectedItem.PreviousComment;
    childRef?.current?.setRowSelection({});
    rerender();
    setisRejectItem(RejectedItem)
    setisRejectItem(undefined)
  }
  const LoadTimeSheet = () => {
    ContextData?.callbackFunction()
  }
  const EditDataTimeEntryData = (e: any, item: any) => {
    setIsTimeEntry(true)
    setTimeComponent(item)
  };
  const TimeEntryCallBack = () => {
    setIsTimeEntry(false)
    setTimeComponent(undefined)
  }
  const generateDynamicColumns = (item: any, index: any) => {
    if (item?.DataSource != 'TimeSheet') {
      return [{
        accessorKey: "",
        placeholder: "",
        hasCheckbox: true,
        hasCustomExpanded: item?.GroupByView,
        hasExpanded: item?.GroupByView,
        size: 10,
        id: "Id"
      },
      {
        accessorFn: (row: any) => row?.portfolioItemsSearch,
        cell: ({ row, getValue }: any) => (
          <div className="alignCenter">
            {row?.original?.SiteIcon != undefined ? (
              <div className="alignCenter" >
                <img title={row?.original?.TaskType?.Title} className={row?.original?.Item_x0020_Type == "SubComponent" ? "ml-12 workmember ml20 me-1" : row?.original?.Item_x0020_Type == "Feature" ? "ml-24 workmember ml20 me-1" : row?.original?.TaskType?.Title == "Activities" ? "ml-36 workmember ml20 me-1" :
                  row?.original?.TaskType?.Title == "Workstream" ? "ml-48 workmember ml20 me-1" : row?.original?.TaskType?.Title == "Task" || row?.original?.Item_x0020_Type === "Task" && row?.original?.TaskType == undefined ? "ml-60 workmember ml20 me-1" : "workmember me-1"
                }
                  src={row?.original?.SiteIcon}>
                </img>
              </div>
            ) : (
              <>
                {row?.original?.Title != "Others" ? (
                  <div title={row?.original?.Item_x0020_Type} style={{ backgroundColor: `${row?.original?.PortfolioType?.Color}` }} className={row?.original?.Item_x0020_Type == "SubComponent" ? "ml-12 Dyicons" : row?.original?.Item_x0020_Type == "Feature" ? "ml-24 Dyicons" : row?.original?.TaskType?.Title == "Activities" ? "ml-36 Dyicons" :
                    row?.original?.TaskType?.Title == "Workstream" ? "ml-48 Dyicons" : row?.original?.TaskType?.Title == "Task" ? "ml-60 Dyicons" : "Dyicons"
                  }>
                    {row?.original?.SiteIconTitle}
                  </div>
                ) : (
                  ""
                )}
              </>
            )}
          </div>
        ),
        id: "portfolioItemsSearch",
        placeholder: "Type",
        header: "",
        resetColumnFilters: false,
        size: 95,
        isColumnVisible: true
      },
      {
        accessorKey: "TaskID",
        placeholder: "ID",
        id: 'TaskID',
        size: 110,
        isColumnVisible: true,
        cell: ({ row, getValue }: any) => (
          <span className="d-flex" draggable={true} onDragOver={(e) => e.preventDefault()} onDragStart={(e) => startDrag(e, row?.original, row?.original?.Id, item)}>
            <ReactPopperTooltipSingleLevel CMSToolId={row?.original?.TaskID} row={row?.original} singleLevel={true} masterTaskData={AllMasterTasks} AllSitesTaskData={item?.Tasks} AllListId={ContextData?.propsValue?.Context} />
          </span>
        ),
      },
      {
        accessorFn: (row: any) => row?.Title,
        cell: ({ row, getValue }: any) => (
          <div draggable={true} onDragOver={(e) => e.preventDefault()} onDragStart={(e) => startDrag(e, row?.original, row?.original?.Id, item)}>
            {row?.original?.siteType != "Master Tasks" && row?.original?.Title !== "Others" && (<a className="hreflink" target='_blank' style={{ textDecoration: 'none', cursor: 'pointer' }} href={`${ContextData.siteUrl}/SitePages/Task-Profile.aspx?taskId=${row.original.Id}&Site=${row.original.site}`}
              rel='noopener noreferrer' data-interception="off" > {row?.original?.Title}
            </a>
            )}
            {row?.original?.siteType == "Master Tasks" && row?.original?.Title !== "Others" && (
              <a className="text-content hreflink" title={row?.original?.Title} data-interception="off" target="_blank" style={row?.original?.fontColorTask != undefined ? { color: `${row?.original?.fontColorTask}` } : { color: `${row?.original?.PortfolioType?.Color}` }}
                href={ContextData?.siteUrl + "/SitePages/Portfolio-Profile.aspx?taskId=" + row?.original?.Id} > {row?.original?.Title}
              </a>
            )}
            {row?.original?.descriptionsSearch != null && row?.original?.descriptionsSearch != "" && (
              <span className="alignIcon mt--5"> <InfoIconsToolTip Discription={row?.original?.descriptionsSearch} row={row?.original} /></span>
            )}
          </div>
        ),
        id: "Title",
        placeholder: "Title",
        resetColumnFilters: false,
        header: "",
        size: 350,
        isColumnVisible: true
      },
      {
        accessorFn: (row: any) => row?.SmartPriority,
        cell: ({ row }: any) => (
          <div className="text-center boldClable" draggable={true} onDragOver={(e) => e.preventDefault()} onDragStart={(e) => startDrag(e, row?.original, row?.original?.Id, item)} title={row?.original?.showFormulaOnHover}>{row?.original?.SmartPriority != 0 ? row?.original?.SmartPriority : null}</div>
        ),
        filterFn: (row: any, columnName: any, filterValue: any) => {
          if (row?.original?.SmartPriority?.includes(filterValue)) {
            return true
          }
          else {
            return false
          }
        },
        id: "SmartPriority",
        placeholder: "SmartPriority",
        resetColumnFilters: false,
        resetSorting: false,
        isColumnDefultSortingDesc: item?.configurationData != undefined && item?.configurationData[0] != undefined && item?.configurationData[0]?.showPageSizeSetting != undefined && item?.configurationData[0]?.showPageSizeSetting?.selectedTopValue === undefined ? true : false,
        header: "",
        size: 45,
        isColumnVisible: true,
        fixedColumnWidth: true
      },
      {
        accessorFn: (row: any) => row?.PriorityRank,
        cell: ({ row }: any) => (
          <div className="text-center" draggable={true} onDragOver={(e) => e.preventDefault()} onDragStart={(e) => startDrag(e, row?.original, row?.original?.Id, item)}>{row?.original?.PriorityRank}</div>
        ),
        filterFn: (row: any, columnName: any, filterValue: any) => {
          if (row?.original?.PriorityRank == filterValue) {
            return true
          } else {
            return false
          }
        },
        id: "PriorityRank",
        placeholder: "Priority Rank",
        resetColumnFilters: false,
        header: "",
        size: 42,
        isColumnVisible: false,
        fixedColumnWidth: true
      },
      {
        accessorFn: (row: any) => row?.projectStructerId + "." + row?.ProjectTitle,
        cell: ({ row, getValue }: any) => (
          <div draggable={true} onDragOver={(e) => e.preventDefault()} onDragStart={(e) => startDrag(e, row?.original, row?.original?.Id, item)} >
            {row?.original?.ProjectTitle != (null || undefined) &&
              <span><a style={row?.original?.fontColorTask != undefined ? { color: `${row?.original?.fontColorTask}` } : { color: `${row?.original?.PortfolioType?.Color}` }} data-interception="off" target="_blank" className="hreflink serviceColor_Active" href={`${ContextData?.propsValue?.siteUrl}/SitePages/Project-Management-Profile.aspx?ProjectId=${row?.original?.ProjectId}`} >
                <ReactPopperTooltip CMSToolId={row?.original?.projectStructerId} projectToolShow={true} row={row} AllListId={ContextData?.propsValue} /></a></span>
            }
          </div>
        ),
        id: 'ProjectTitle',
        placeholder: "Project",
        resetColumnFilters: false,
        header: "",
        size: 70,
        isColumnVisible: false
      },
      {
        accessorFn: (row: any) => row?.PercentComplete,
        cell: ({ row }: any) => (
          <div className="text-center" draggable={true} onDragOver={(e) => e.preventDefault()} onDragStart={(e) => startDrag(e, row?.original, row?.original?.Id, item)}>{row?.original?.PercentComplete}</div>
        ),
        id: "PercentComplete",
        placeholder: "Status",
        resetColumnFilters: false,
        header: "",
        size: 55,
        isColumnVisible: true,
        fixedColumnWidth: true

      },
      {
        accessorFn: (row: any) => row?.TaskTypeValue,
        cell: ({ row, column, getValue }: any) => (
          <div draggable={true} onDragOver={(e) => e.preventDefault()} onDragStart={(e) => startDrag(e, row?.original, row?.original?.Id, item)} >
            <span className="columnFixedTaskCate"><span title={row?.original?.TaskTypeValue} className="text-content">{row?.original?.TaskTypeValue}</span></span>
          </div>
        ),
        placeholder: "Task Type",
        header: "",
        resetColumnFilters: false,
        size: 130,
        id: "TaskTypeValue",
        isColumnVisible: false
      },
      {
        accessorFn: (row: any) => row?.ClientCategorySearch,
        cell: ({ row }: any) => (
          <div draggable={true} onDragOver={(e) => e.preventDefault()} onDragStart={(e) => startDrag(e, row?.original, row?.original?.Id, item)}>
            <ShowClintCatogory clintData={row?.original} AllMetadata={ContextData?.AllMetadata} />
          </div>
        ),
        id: "ClientCategorySearch",
        placeholder: "Client Category",
        header: "",
        resetColumnFilters: false,
        size: 95,
        isColumnVisible: false
      },
      {
        accessorFn: (row: any) => row?.AllTeamName,
        cell: ({ row }: any) => (
          <div className="alignCenter" draggable={true} onDragOver={(e) => e.preventDefault()} onDragStart={(e) => startDrag(e, row?.original, row?.original?.Id, item)}>
            <ShowTaskTeamMembers key={row?.original?.Id} props={row?.original} TaskUsers={ContextData?.AllTaskUser} Context={ContextData?.propsValue} />
          </div>
        ),
        id: "AllTeamName",
        placeholder: "Team",
        resetColumnFilters: false,
        header: "",
        size: 100,
        isColumnVisible: false
      },
      {
        accessorFn: (row: any) => row?.ItemRank,
        cell: ({ row }: any) => (
          <div draggable={true} onDragOver={(e) => e.preventDefault()} onDragStart={(e) => startDrag(e, row?.original, row?.original?.Id, item)} className="text-center">{row?.original?.ItemRank}</div>
        ),
        id: "ItemRank",
        placeholder: "Item Rank",
        resetColumnFilters: false,
        header: "",
        size: 42,
        isColumnVisible: false,
        fixedColumnWidth: true
      },
      {
        accessorKey: "timeSheetsDescriptionSearch",
        placeholder: "timeSheetsDescriptionSearch",
        header: "",
        resetColumnFilters: false,
        id: "timeSheetsDescriptionSearch",
        isColumnVisible: false
      },
      {
        accessorFn: (row: any) => row?.EstimatedTime,
        cell: ({ row }: any) => (
          <div className='alignCenter'>
            <span style={{ display: "flex", alignItems: "center", maxWidth: "84px" }}>
              <span className="hreflink" style={{ flexGrow: "1", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={row?.original?.EstimatedTime}>
                {row?.original?.EstimatedTime}
              </span>
            </span>
            <span className="alignIcon mt--5">{row?.original?.EstimatedTime != "" && row?.original?.EstimatedTimeDescr != undefined && row?.original?.EstimatedTimeDescr != '' && <InfoIconsToolTip row={row?.original} SingleColumnData={"EstimatedTimeDescr"} />}</span>
          </div>
        ),
        id: "TotalEstimatedTime",
        placeholder: "Estimated Task Time",
        header: "",
        resetColumnFilters: false,
        size: 80,
        isColumnVisible: item?.DataSource == 'Tasks' ? true : false,
        fixedColumnWidth: true
      },
      {
        accessorFn: (row: any) => row?.WorkingDate,
        cell: ({ row }: any) => (
          <div className='alignCenter'>
            <span style={{ display: "flex", alignItems: "center", maxWidth: "84px" }}>
              <span className="hreflink" style={{ flexGrow: "1", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={row?.original?.WorkingDate}>
                {row?.original?.WorkingDate}
              </span>
            </span>
            <span className="alignIcon mt--5">{row?.original?.WorkingDate != undefined && row?.original?.WorkingDate != "" && <InfoIconsToolTip row={row?.original} SingleColumnData={"WorkingDate"} />}</span>
          </div>
        ),
        id: "WorkingDate",
        placeholder: "Working Date",
        header: "",
        resetColumnFilters: false,
        size: 80,
        isColumnVisible: item?.DataSource == 'Tasks' ? true : false,
        fixedColumnWidth: true
      },
      {
        accessorFn: (row: any) => row?.Created,
        cell: ({ row, column }: any) => (
          <div className="alignCenter" draggable={true} onDragOver={(e) => e.preventDefault()} onDragStart={(e) => startDrag(e, row?.original, row?.original?.Id, item)}>
            {row?.original?.Created == null ? ("") : (
              <>
                <div className='ms-1'  >{row?.original?.DisplayCreateDate} </div>
                {row?.original?.Author != undefined &&
                  <>
                    <a href={`${ContextData?.siteUrl}/SitePages/TaskDashboard.aspx?UserId=${row?.original?.Author?.Id}&Name=${row?.original?.Author?.Title}`} target="_blank" data-interception="off">
                      <img title={row?.original?.Author?.Title} className="workmember ms-1" src={row?.original?.Author?.autherImage} />
                    </a>
                  </>
                }
              </>
            )}
          </div>
        ),
        id: 'Created',
        resetColumnFilters: false,
        resetSorting: false,
        placeholder: "Created",
        filterFn: (row: any, columnName: any, filterValue: any) => {
          if (row?.original?.Author?.Title?.toLowerCase()?.includes(filterValue?.toLowerCase()) || row?.original?.DisplayCreateDate?.includes(filterValue)) {
            return true
          } else {
            return false
          }
        },
        header: "",
        size: 100,
        isColumnVisible: true,
        fixedColumnWidth: true,
        isColumnDefultSortingDesc: item?.configurationData != undefined && item?.configurationData[0] != undefined && item?.configurationData[0]?.showPageSizeSetting != undefined && item?.configurationData[0]?.showPageSizeSetting?.selectedTopValue === "Created" ? true : false
      },
      {
        accessorFn: (row: any) => row?.DueDate,
        cell: ({ row, column, getValue }: any) => (
          <div draggable={true} onDragOver={(e) => e.preventDefault()} onDragStart={(e) => startDrag(e, row?.original, row?.original?.Id, item)} className='ms-1'>{row?.original?.DisplayDueDate}</div>
        ),
        filterFn: (row: any, columnName: any, filterValue: any) => {
          if (row?.original?.DisplayDueDate?.includes(filterValue)) {
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
        size: 91,
        isColumnVisible: false,
        fixedColumnWidth: true,
        isColumnDefultSortingDesc: item?.configurationData != undefined && item?.configurationData[0] != undefined && item?.configurationData[0]?.showPageSizeSetting != undefined && item?.configurationData[0]?.showPageSizeSetting?.selectedTopValue === "DueDate" ? true : false
      },
      {
        accessorFn: (row: any) => row?.Modified,
        cell: ({ row, column }: any) => (
          <div className="alignCenter" draggable={true} onDragOver={(e) => e.preventDefault()} onDragStart={(e) => startDrag(e, row?.original, row?.original?.Id, item)}>
            {row?.original?.Modified == null ? ("") : (
              <>
                <div style={{ width: "75px" }} className="me-1">{row?.original?.DisplayModifiedDate}</div>
                {row?.original?.Editor != undefined &&
                  <>
                    <a href={`${ContextData?.siteUrl}/SitePages/TaskDashboard.aspx?UserId=${row?.original?.Editor?.Id}&Name=${row?.original?.Editor?.Title}`}
                      target="_blank" data-interception="off">
                      <img title={row?.original?.Editor?.Title} className="workmember ms-1" src={row?.original?.Editor?.autherImage} />
                    </a>
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
        isColumnVisible: item?.configurationData != undefined && item?.configurationData[0] != undefined && item?.configurationData[0]?.showPageSizeSetting != undefined && item?.configurationData[0]?.showPageSizeSetting?.selectedTopValue === "Modified" ? true : false,
        filterFn: (row: any, columnName: any, filterValue: any) => {
          if (row?.original?.Editor?.Title?.toLowerCase()?.includes(filterValue?.toLowerCase()) || row?.original?.DisplayModifiedDate?.includes(filterValue)) {
            return true
          } else {
            return false
          }
        },
        header: "",
        size: 100,
        fixedColumnWidth: true,
        isColumnDefultSortingDesc: item?.configurationData != undefined && item?.configurationData[0] != undefined && item?.configurationData[0]?.showPageSizeSetting != undefined && item?.configurationData[0]?.showPageSizeSetting?.selectedTopValue === "Modified" ? true : false
      },
      {
        accessorFn: (row: any) => row?.TotalTaskTime,
        cell: ({ row, column }: any) => (
          <>
            <a
              className="alignCenter" onClick={(e) => EditDataTimeEntryData(e, row?.original)} data-bs-toggle="tooltip" data-bs-placement="auto" title="Click To Add/Edit Timesheet"   >
              <span className="svg__iconbox svg__icon--clock dark" data-bs-toggle="tooltip" data-bs-placement="bottom"  ></span>
            </a>
          </>
        ),
        id: "TotalTaskTime",
        accessorKey: "TotalTaskTime",
        canSort: false,
        resetSorting: false,
        resetColumnFilters: false,
        isColumnVisible: item?.DataSource == 'Tasks' ? true : false,
        fixedColumnWidth: true,
        placeholder: "Smart Time",
        size: 40,
      },
      // {
      //   accessorKey: "TotalTaskTime",
      //   id: "TotalTaskTime",
      //   placeholder: "Smart Time",
      //   header: "",
      //   resetColumnFilters: false,
      //   size: 49,
      //   isColumnVisible: item?.DataSource == 'Tasks' ? true : false,
      //   fixedColumnWidth: true
      // },
      {
        cell: ({ row, getValue }: any) => (
          <>
            <span title="Edit Item" className="alignIcon svg__iconbox svg__icon--edit hreflink ms-1" onClick={() => editPopFunc(row.original)} ></span>
          </>
        ),
        id: 'EditTaskPopup',
        canSort: false,
        placeholder: "",
        header: "",
        resetColumnFilters: false,
        resetSorting: false,
        size: 45,
        isColumnVisible: true,
        fixedColumnWidth: true
      },]
    }
    else if (item?.DataSource == 'TimeSheet') {
      return [
        {
          accessorKey: "",
          placeholder: "",
          hasCheckbox: true,
          hasCustomExpanded: false,
          hasExpanded: false,
          size: 20,
          margin: 0,
          id: "Id"
        },
        {
          accessorFn: (row: any) => row?.Site,
          cell: ({ row, getValue }: any) => (
            <>
              <span>
                <img className="circularImage rounded-circle" src={row?.original?.SiteIcon}
                />
              </span>
            </>
          ),
          id: "Site",
          placeholder: "Site",
          header: "",
          resetSorting: false,
          resetColumnFilters: false,
          size: 30,
          isColumnVisible: true,
          fixedColumnWidth: true
        },
        {
          accessorKey: "TaskID",
          placeholder: "ID",
          id: 'TaskID',
          size: 60,
          isColumnVisible: true,
          cell: ({ row, getValue }: any) => (
            <span className="d-flex">
              <ReactPopperTooltipSingleLevel CMSToolId={row?.original?.TaskID} row={row?.original?.TaskItem} singleLevel={true} masterTaskData={AllMasterTasks} AllSitesTaskData={item?.Tasks} AllListId={ContextData?.propsValue?.Context} />
            </span>
          ),
        },
        {
          accessorFn: (row: any) => row?.Title,
          id: "Title",
          placeholder: "AuthorName",
          header: "",
          size: 155,
          isColumnVisible: true,
          cell: ({ row }: any) => (
            <>
              <span>
                <div className="d-flex">
                  <>
                    <span>
                      {row?.original?.AuthorImage != "" && row?.original.AuthorImage != null ? (
                        <img
                          className="AssignUserPhoto1 bdrbox m-0 wid29" title={row?.original.Title} data-toggle="popover" data-trigger="hover" src={row?.original.AuthorImage}  ></img>
                      ) : (
                        <>  {" "}  <img className="AssignUserPhoto1 bdrbox m-0 wid29" title={row?.original.Title} data-toggle="popover" data-trigger="hover"
                          src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg" ></img>
                        </>
                      )}
                      <span className="mx-1">{row?.original?.Title}</span>
                    </span>
                  </>
                </div>
              </span>
            </>
          )
        },
        {
          accessorFn: (row: any) => row?.sortTaskDate,
          cell: ({ row, column }: any) => (
            <div className="alignCenter">
              {row?.original?.TaskDate == null ? ("") : (
                <>
                  <HighlightableCell value={row?.original?.TaskDates} searchTerm={column.getFilterValue() != undefined ? column.getFilterValue() : null} />
                </>
              )}
            </div>
          ),
          id: 'Created',
          resetColumnFilters: false,
          resetSorting: false,
          placeholder: "Created",
          filterFn: (row: any, columnName: any, filterValue: any) => {
            if (row?.original?.TaskDates?.toLowerCase()?.includes(filterValue)) {
              return true
            } else {
              return false
            }
          },
          header: "",
          size: 121,
          isColumnVisible: true,
          fixedColumnWidth: true
        },
        {
          accessorKey: "TaskTime",
          placeholder: "TaskTime",
          header: "",
          id: 'TaskTime',
          size: 40,
          isColumnVisible: true,
          fixedColumnWidth: true
        },
        {
          accessorKey: "timeSheetsDescriptionSearch",
          placeholder: "Timesheet Description",
          header: "",
          id: "timeSheetsDescriptionSearch",
          isColumnVisible: true,
          size: 425,
          columnHide: false,
        },
        {
          id: "ff",
          accessorKey: "",
          size: 50,
          canSort: false,
          placeholder: "",
          isColumnVisible: true,
          fixedColumnWidth: true,
          cell: ({ row, index }: any) => (
            <div className="alignCenter gap-1 pull-right approvelicon position-relative" >
              {item?.Status != "My TimSheet" ? <>
                <span title="Approve" onClick={() => SaveApprovalRejectPopup('Approved', row?.original, undefined)} ><MdOutlineGppGood style={{ color: "#008f47", fontSize: "22px" }} /> </span>
                <span title="Reject" data-toggle="tooltip" data-placement="bottom" id={`Reply-${row?.index}`} onClick={() => openRejectPopup(row?.original)}><MdGppBad style={{ color: "#dc3545", fontSize: "22px" }} /></span>
              </>
                :
                <>
                  <span title="Send For Approval" className="svg__iconbox svg__icon--forApproval hreflink" onClick={() => SaveApprovalRejectPopup('For Approval', row?.original, 'For Approval')}></span>
                </>}

            </div>
          )
        },]
    }
  }
  if (Tile.activeTile != undefined && DashboardConfigCopy != undefined && DashboardConfigCopy?.length > 0)
    DashboardConfig = DashboardConfigCopy.filter((config: any) => config?.TileName == '' || config?.TileName == Tile.activeTile);
  const updatedDashboardConfig = DashboardConfig?.map((item: any, index: any) => {
    let columnss: any = [];
    columnss = generateDynamicColumns(item, index);
    return { ...item, column: columnss };
  });
  DashboardConfig = updatedDashboardConfig;
  const editPopFunc = (item: any) => {
    if (item?.siteType != 'Master Tasks') {
      setEditPopup(true);
      setResult(item)
    }
    else {
      if (item?.Item_x0020_Type == "Component" || item?.Item_x0020_Type == "SubComponent" || item?.Item_x0020_Type == "Feature") {
        item['siteUrl'] = `${AllListId?.siteUrl}`;
        item['listName'] = `${AllListId?.MasterTaskListID}`;
        setEditCompPopup(true);
        setCompResult(item)
      }
      else {
        item['siteUrl'] = `${AllListId?.siteUrl}`;
        item['listName'] = 'Master Tasks';
        setEditProjectPopup(true);
        setCompResult(item)
      }

    }
  }
  function CallBack() {
    setEditProjectPopup(false);
    setEditPopup(false);
    setEditCompPopup(false);
  }
  const callBackData = React.useCallback((elem: any, ShowingData: any) => {
    if (elem != undefined) {
      setRefSelectedItem(elem)
      approveItem = elem;
    }
    else {
      setRefSelectedItem(elem)
      approveItem = undefined
    }
  }, []);
  const sendEmail = () => {
    approveItem.PercentComplete = 3
    approveItem.listName = approveItem.site;
    approveItem.FeedBack = approveItem?.FeedBack != null ? JSON.parse(approveItem?.FeedBack) : null;
    setsendMail(true)
    emailStatus = "Approved"
  }
  const approvalcallback = () => {
    setsendMail(false)
    emailStatus = ""
    const data: any = AllapprovalTask.filter((i: any) => { return i.Id != approveItem.Id })
    setapprovalTask(data);
  }
  const sendAllWorkingTodayTasks = async (sharingTasks: any, config: any) => {
    let today = new Date();
    const yesterdays = new Date(today.setDate(today.getDate() - 1))
    const yesterday = Moment(yesterdays).format("DD/MM/YYYY")
    let body: any = '';
    let text = '';
    let to: any = [];
    let body1: any = [];
    let userApprover = '';
    let tasksCopy = config?.Tasks;
    ContextData.currentUserData.UserManagerMail = [];
    ContextData.currentUserData.UserManagerName = ''
    ContextData?.currentUserData?.Approver?.map((Approver: any, index: any) => {
      if (index == 0) {
        ContextData.currentUserData.UserManagerName = Approver?.Title;
      } else {
        ContextData.currentUserData.UserManagerName += ' ,' + Approver?.Title
      }
      let Mail = Approver?.Name?.split('|')[2]
      ContextData?.currentUserData.UserManagerMail.push(Mail)
    })

    to = ContextData?.currentUserData?.UserManagerMail;
    userApprover = ContextData?.currentUserData?.UserManagerName;
    tasksCopy.sort((a: any, b: any) => {
      return b.PriorityRank - a.PriorityRank;
    });
    let confirmation: any;
    if (ContextData?.currentUserData?.Approver != undefined && ContextData?.currentUserData?.Approver[0]?.Title != undefined)
      confirmation = confirm('Your' + ' ' + config?.WebpartTitle + ' ' + 'will be automatically shared with your approver' + ' ' + '(' + ContextData?.currentUserData?.Approver[0]?.Title + ')' + '.' + '\n' + 'Do you want to continue?')
    else
      confirmation = confirm('Your' + ' ' + config?.WebpartTitle + ' ' + 'will be automatically shared with you only because you don' + 't have any approver, so no email will be sent to the approver' + '.' + '\n' + 'Do you want to continue?')
    if (confirmation) {
      let totalTime = 0;
      var subject = ContextData?.currentUserData?.Title + ' - ' + config?.WebpartTitle;
      let Currentdate = new Date(); // Use your JavaScript Date object here
      let CurrentformattedDate = Moment(Currentdate).format('YYYY-MM-DD');
      let UserTotalTime = 0
      tasksCopy = tasksCopy?.sort((a: any, b: any) => {
        return b?.SmartPriority - a?.SmartPriority;
      });
      tasksCopy?.map((item: any) => {
        // totalTime += item?.EstimatedTime
        let teamUsers: any = [];
        item?.TeamMembers?.map((item1: any) => {
          teamUsers.push(item1?.Title)
        });
        if (item.DueDate != undefined) {
          item.TaskDueDatenew = Moment(item.DueDate).format("DD/MM/YYYY");
        }
        if (item.TaskDueDatenew == undefined || item.TaskDueDatenew == '')
          item.TaskDueDatenew = '';
        if (item.Categories == undefined || item.Categories == '')
          item.Categories = '';

        item.EstimatedTimeEntry = 0;
        item.EstimatedTimeEntryDesc = '';
        if (ContextData?.todaysDrafTimeEntry?.length > 0) {
          ContextData?.todaysDrafTimeEntry?.map((value: any) => {
            let entryDetails: any = [];
            try {
              entryDetails = JSON.parse(value.AdditionalTimeEntry)

            } catch (e) {

            }
            if (entryDetails?.length > 0 && value[`Task${item?.siteType}`] != undefined && value[`Task${item?.siteType}`].Id == item?.Id) {
              entryDetails?.map((timeEntry: any) => {
                let parts = timeEntry?.TaskDate?.split('/');
                let timeEntryDate: any = new Date(parts[2], parts[1] - 1, parts[0]);
                if (timeEntryDate?.setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0) && timeEntry?.AuthorId == ContextData?.currentUserData?.AssingedToUserId) {
                  item.EstimatedTimeEntryDesc += ' ' + timeEntry?.Description
                  item.EstimatedTimeEntry += parseFloat(timeEntry?.TaskTime)
                  totalTime += Number(timeEntry?.TaskTime)
                  UserTotalTime += Number(timeEntry?.TaskTime)
                }
              })


            }
          })
        }

        if (item?.EstimatedTimeEntry > 0) {
          text =
            `<tr>
                  <td height="10" align="left" valign="middle" style="border-left: 0px; border-top: 0px; padding: 5px 0px; padding-left:5px">${item?.siteType} </td>
                  <td height="10" align="left" valign="middle" style="border-left: 0px; border-top: 0px; padding: 5px 0px; padding-left:5px"> ${item.TaskID} </td>
                  <td height="10" align="left" valign="middle" style="border-left: 0px; border-top: 0px; padding: 5px 0px; padding-left:5px"><p style="margin:0px; color:#333;"><a style="text-decoration: none;" href =${item?.siteUrl}/SitePages/Task-Profile.aspx?taskId=${item?.Id}&Site=${item?.siteType}> ${item?.Title} </a></p></td>
                  <td height="10" align="left" valign="middle" style="border-left: 0px; border-top: 0px; padding: 5px 0px; padding-left:5px"> ${item.Categories} </td>
                  <td height="10" align="left" valign="middle" style="border-left: 0px; border-top: 0px; padding: 5px 0px; padding-left:5px"> ${item?.PercentComplete} </td>
                  <td height="10" align="left" valign="middle" style="border-left: 0px; border-top: 0px; padding: 5px 0px; padding-left:5px"> ${item.SmartPriority != undefined ? item.SmartPriority : ''} </td>
                  <td height="10" align="left" valign="middle" style="border-left: 0px; border-top: 0px; padding: 5px 0px; padding-left:5px">${item?.EstimatedTimeEntry} </td>
                  <td height="10" align="left" valign="middle" style="border-left: 0px; border-top: 0px; padding: 5px 0px; padding-left:5px; border-right:0px"> ${item.EstimatedTimeEntryDesc} </td>
                  </tr>`
          body1.push(text);
        }
      });
      if (body1?.length > 0) {
        body =
          '<h2>'
          + ContextData?.currentUserData?.Title + ' - ' + config?.WebpartTitle
          + '</h2>'
          + ` <table cellpadding="0" cellspacing="0" align="left" width="100%" border="1" style=" border-color: #444;margin-bottom:10px">
                    <thead>
                    <tr>
                    <th width="40" height="12" align="center" valign="middle" bgcolor="#eeeeee" style="padding:10px 5px;border-top: 0px;border-left: 0px;">Site</th>
                    <th width="60" height="12" align="center" valign="middle" bgcolor="#eeeeee" style="padding:10px 5px;border-top: 0px;border-left: 0px;x">Task ID</th>
                    <th width="400" height="12" align="center" valign="middle" bgcolor="#eeeeee" style="padding:10px 5px;border-top: 0px;border-left: 0px;">Title</th>
                    <th width="80" height="12" align="center" valign="middle" bgcolor="#eeeeee" style="padding:10px 5px;border-top: 0px;border-left: 0px;">Category</th>
                    <th width="40" height="12" align="center" valign="middle" bgcolor="#eeeeee" style="padding:10px 5px;border-top: 0px;border-left: 0px;">% </th>
                    <th width="40" height="12" align="center" valign="middle" bgcolor="#eeeeee" style="padding:10px 5px;border-top: 0px;border-left: 0px;">Smart Priority</th>
                    <th width="70" height="12" align="center" valign="middle" bgcolor="#eeeeee" style="padding:10px 5px;border-top: 0px;border-left: 0px" >Time</th>
                    <th height="12" align="center" valign="middle" bgcolor="#eeeeee" style="padding:10px 5px;border-top: 0px;border-left: 0px; border-right:0px" >Timesheet Description (Draft)</th>
                    </tr>
                    </thead>
                    <tbody>
                    ${body1}
                    </tbody>
                    </table>`
          + '<p>' + 'For the complete Dashboard of ' + ContextData?.currentUserData?.Title + ' click the following link:' + '<a href =' + `${AllListId?.siteUrl}/SitePages/Dashboard.aspx` + '><span style="font-size:13px; font-weight:600">' + `${AllListId?.siteUrl}/SitePages/Dashboard.aspx` + '</span>' + '</a>' + '</p>'
        subject = `[${config?.WebpartTitle} - ${ContextData?.currentUserData?.Title}] ${CurrentformattedDate}: ${tasksCopy?.length} Tasks; ${totalTime}hrs scheduled`

      }
      body = body.replaceAll('>,<', '><').replaceAll(',', '')
    }
    if (body1.length > 0 && body1 != undefined) {
      if (ContextData?.currentUserData?.Email != undefined) {
        to.push(ContextData?.currentUserData?.Email)
      }
      SendEmailFinal(to, subject, body);
    } else {
      // alert("No entries available");
    }
  }
  const SendEmailFinal = async (to: any, subject: any, body: any) => {
    let sp = spfi().using(spSPFx(ContextData?.propsValue?.Context));
    sp.utility.sendEmail({
      Body: body,
      Subject: subject,
      To: to,
      AdditionalHeaders: {
        "content-type": "text/html",
        'Reply-To': 'Piyoosh@smalsus.com'
      },
    }).then(() => {
      console.log("Email Sent!");
      alert("Your Tasks shared successfully")
    }).catch((err) => {
      console.log(err.message);
    });
  }
  const OpenConfigPopup = (Config: any) => {
    setIsManageConfigPopup(true);
    setSelectedItem(Config)
  }
  const CloseConfigPopup = () => {
    setIsManageConfigPopup(false);
    setSelectedItem('')
  }
  const customTableHeaderButtons = (config: any) => {
    return (
      <span className="alignCenter CustomHeaderIcon">
        {IsShowConfigBtn && config?.IsEditWebpart != false && <span className="svg__iconbox svg__icon--setting hreflink" title="Manage Configuration" onClick={(e) => OpenConfigPopup(config)}></span>}
        {config?.WebpartTitle != 'Draft Tasks' && config?.WebpartTitle != 'Waiting for Approval' && <a className="empCol hreflink"
          target="_blank" data-interception="off" title="Create New Task" href={`${ContextData?.siteUrl}/SitePages/CreateTask.aspx`}>
          <span className="hreflink alignIcon svg__iconbox svg__icon--CNTask empBg"></span>
        </a>}
        {config?.WebpartTitle == 'Draft Tasks' && <a className="empCol hreflink me-3">Approve</a>}
        {config?.WebpartTitle == 'Waiting for Approval' && <span className="empCol me-3 hreflink" onClick={sendEmail}>Approve</span>}
        {(ContextData?.DashboardId == 1 || ContextData?.DashboardId == 27 || ContextData?.DashboardId == undefined || ContextData?.DashboardId == '') && <span title={`Share ${config?.WebpartTitle}`} onClick={() => sendAllWorkingTodayTasks(config?.Tasks, config)} className="hreflink svg__iconbox svg__icon--TShare empBg"></span>}
      </span>
    )
  }
  const customTimeSheetTableHeaderButtons = (config: any) => {
    return (
      <span className="alignCenter">
        {IsShowConfigBtn && <span className="svg__iconbox svg__icon--setting hreflink me-1" title="Manage Configuration" onClick={(e) => OpenConfigPopup(config)}></span>}
        {RefSelectedItem?.length > 0 && config?.Status != "My TimSheet" ? <span className="empCol me-1 hreflink" title="Approve All" onClick={() => SaveApprovalRejectPopup('ApprovedAll', undefined, 'Approved')}>Approve All</span>
          : RefSelectedItem?.length > 0 && config?.Status == "My TimSheet" ? <span className="empCol me-1 hreflink" title="Send All for Approval" onClick={() => SaveApprovalRejectPopup('ApprovedAll', undefined, 'For Approval')}>Send All</span> : ''}

        {/* <span className="me-1 hreflink" style={{ color: "#646464" }}>Approve All</span>} */}
      </span>
    )
  }
  const customWorkingTableHeaderButtons = (config: any, user: any, Time: any, ShowType: any) => {
    return (
      <span className="alignCenter">
        <span className="empCol me-1 hreflink" onClick={() => ShowType == 'DateTask' ? ShowWorkingTask(config, user, undefined, false) : ShowUnAssignedTask(config, user, undefined, false)}>Hide</span>
      </span>
    )
  }
  const ShowHideAllUser = (Config: any, index: any, IshowAllUser: any) => {
    DashboardConfig.forEach((configuration: any, ItemIndex: any) => {
      if (ItemIndex == index) {
        configuration.Tasks = IshowAllUser == true ? Config?.AllUserTask : Config?.BackupTask
      }
    })
    DashboardConfigCopy = JSON.parse(JSON.stringify(DashboardConfig));
    DashboardConfigCopy?.map((Config: any) => {
      if (Config?.Tasks != undefined && Config?.Tasks?.length > 0) {
        Config?.Tasks?.map((Date: any) => {
          if (Date?.dates != undefined && Date?.dates?.length > 0) {
            Date?.dates?.map((Time: any) => {
              if (Time?.ServerDate != undefined && Time?.ServerDate != '') {
                Time.ServerDate = Moment(Time?.ServerDate)
                Time.ServerDate = Time.ServerDate?._d;
                Time.ServerDate.setHours(0, 0, 0, 0)
              }
            })
          }
        });
      }
    });
    setIsShowAllUser(!IshowAllUser);
    setActiveTile((prevString: any) => Tile?.activeTile);
    rerender();
  }
  const SelectUserImage = (ev: any, item: any) => {
    setSelectedUserId(item?.AssingedToUserId)
    ContextData?.callbackFunction('OtherUserSelected', item?.AssingedToUserId)
  }
  const generateDashboard = () => {
    const rows: any = [];
    let currentRow: any = [];
    DashboardConfig.forEach((config: any, index: any) => {
      let smartFavTableConfig: any = [];
      if (config?.configurationData != undefined && config?.configurationData?.length > 0 && config?.configurationData[0]?.smartFabBasedColumnsSetting != undefined && config?.configurationData[0]?.smartFabBasedColumnsSetting != '' && Object.keys(config?.configurationData[0]?.smartFabBasedColumnsSetting).length !== 0) {
        config.configurationData[0].smartFabBasedColumnsSetting.tableId = "DashboardID" + ContextData?.DashboardId + "WebpartId" + config?.Id + "Dashboard"
        smartFavTableConfig.push(config?.configurationData[0]?.smartFabBasedColumnsSetting)
      }
      if (Tile.activeTile === config?.TileName || config?.TileName === "") {
        if (config?.DataSource != undefined && config?.DataSource != '') {
          const box = (
            <div className={`col-${12 / config.highestColumn} px-1 mb-2 `} key={index}>

              {config?.ShowWebpart == true && config?.GroupByView != undefined && <section>
                {(config?.DataSource == 'Tasks' || config?.DataSource == 'Project') && <div className="workingSec empAllSec clearfix">
                  <div className="alignCenter mb-2 justify-content-between">
                  </div>
                  <div className="Alltable" draggable={true} onDragStart={(e) => handleDragStart(e, config, '')} onDragOver={(e) => e.preventDefault()} onDrop={(e) => onDropTable(e, config?.Status, config)} >
                    {config?.Tasks != undefined && (
                      <GlobalCommanTable wrapperHeight="300px" showHeader={true}
                        showingDataCoustom={`${config?.WebpartTitle} ${config?.ShowTitleInHeader == true ? ' - ' + ContextData?.CurrentUserInfo?.Title : ''} (${config?.Tasks?.length})`}
                        customHeaderButtonAvailable={true} customTableHeaderButtons={customTableHeaderButtons(config)} bulkEditIcon={true} updatedSmartFilterFlatView={true} dashBoardbulkUpdateCallBack={dashBoardbulkUpdateCallBack} DashboardContextData={setBulkUpdateDataCallBack} smartFavTableConfig={smartFavTableConfig} tableId={"DashboardID" + ContextData?.DashboardId + "WebpartId" + config?.Id + "Dashboard"} multiSelect={true} ref={childRef} AllListId={ContextData?.propsValue} columnSettingIcon={true} TaskUsers={AllTaskUser} portfolioColor={'#000066'} columns={config.column} data={config?.Tasks} callBackData={callBackData}
                        pageSize={config?.configurationData != undefined && config?.configurationData[0] != undefined ? config?.configurationData[0]?.showPageSizeSetting?.tablePageSize : ''} showPagination={config?.configurationData != undefined && config?.configurationData[0] != undefined ? config?.configurationData[0]?.showPageSizeSetting?.showPagination : ''} />
                    )}
                    {config?.WebpartTitle == 'Waiting for Approval' && <span>
                      {sendMail && emailStatus != "" && approveItem && <EmailComponenet approvalcallback={approvalcallback} Context={AllListId} emailStatus={"Approved"} items={approveItem} />}
                    </span>}
                  </div>
                </div>}
                {config?.DataSource == 'TaskUsers' &&
                  <>
                    {config?.selectFilterType != 'GroupByUser' &&
                      <>
                        <div className="alignCenter mb-2 justify-content-between">
                          <span className="fw-bold">
                            {`${config?.WebpartTitle}`}  {config?.Tasks != undefined && `(${config?.Tasks?.length})`}
                          </span>
                          <span className="fw-bold">
                            {IsShowAllUser && <span className="empCol me-1 hreflink" onClick={() => ShowHideAllUser(config, index, true)}>Show All User</span>}
                            {!IsShowAllUser && <span className="empCol me-1 hreflink" onClick={() => ShowHideAllUser(config, index, false)}>Hide All User</span>}
                          </span>
                        </div>
                        {config?.selectFilterType != 'custom' && <div className="dashbord-teamBox">
                          {config?.Tasks != null && config?.Tasks?.length > 0 && config.Tasks.map((user: any, index: number) => {
                            return <div ui-on-drop="onDropRemoveTeam($event,$data,taskUsers)" className="top-assign ng-scope">
                              {user.childs.length > 0 &&
                                <div className="team ng-scope">
                                  <label className="BdrBtm">
                                    {user.Title}
                                  </label>
                                  <div className='d-flex'>
                                    {user.childs.map((item: any, i: number) => {
                                      return <div className="marginR41 ng-scope">
                                        {item.Item_x0020_Cover != undefined && item.AssingedToUser != undefined &&
                                          <span>
                                            <img draggable={false} onDragOver={(e) => e.preventDefault()} onDrop={(e) => onDropUser(e, item, config, undefined)} className="large_teamsimg" src={item.Item_x0020_Cover.Url} title={item.AssingedToUser.Title} />
                                          </span>
                                        }
                                      </div>
                                    })}
                                  </div>
                                </div>
                              }
                            </div>
                          })
                          }
                        </div>}
                        {config?.selectFilterType == 'custom' &&
                          <>
                            <div className={`mb-2 px-1  my-2 row`}>
                              <div className="userdtl col-1">
                                <div><h6 className="fw-bold">Team</h6></div>
                                {config?.Tasks != null && config?.Tasks?.length > 0 && config.Tasks.map((user: any, index: number) => (
                                  <>
                                    <div className="top-assign mb-3">
                                      {user.Item_x0020_Cover != undefined && user.AssingedToUser != undefined &&
                                        <span onClick={() => ShowWorkingTask(config, user, undefined, true)}>
                                          <img className={user.IsShowTask == true || user?.IsActiveUser == true ? 'large_teamsimgCustom activeimg' : 'large_teamsimgCustom'} src={user.Item_x0020_Cover.Url} title={user.AssingedToUser.Title} />
                                        </span>
                                      }
                                    </div>
                                    <br />
                                  </>
                                ))}
                              </div>
                              <div className="gap-4 userdtlpannel col-11  px-0">
                                <dl className="user-box">
                                  {dateRange?.length > 0 && <div>
                                    <Slider className='DashBoardslider teammemberdtl' {...settings}>
                                      {dateRange.map((date: any, index: any) => (
                                        <div className="usericonsdtl" key={index}>
                                          <p className="mb-0">{date?.DisplayDate}</p>
                                          {config?.Tasks != null && config?.Tasks?.length > 0 && config.Tasks.map((user: any, index: number) => (
                                            user?.dates != null && user?.dates?.length > 0 && user?.dates.map((time: any, index: number) => (
                                              date?.ServerDate?.getTime() == time?.ServerDate?.getTime() && <>
                                                {/* activeblock */}
                                                <dt onDragOver={(e) => e.preventDefault()} onDrop={(e) => onDropUser(e, user, config, time?.DisplayDate)} className={time.IsShowTask == true && time?.DisplayDate == 'Un-Assigned' ? 'px-2 shadow-sm text-center' : 'px-2 shadow-sm text-center'} onClick={() => time?.DisplayDate != 'Un-Assigned' ? ShowWorkingTask(config, user, time, true) : ShowUnAssignedTask(config, user, time, true)}>
                                                  {time?.TotalTask != undefined && time?.TotalTask != '' && <><span title="Total Task">{time?.TotalTask}</span>
                                                    {time?.DisplayDate != 'Un-Assigned' ? <> | <span title="Total Estimation Time">{time?.TotalEstimatedTime?.toFixed(2)}</span></> : ''}
                                                  </>
                                                  }
                                                  {time?.TotalTask == undefined || time?.TotalTask == '' && <span>N/A</span>}
                                                </dt>
                                              </>
                                            ))
                                          ))}
                                        </div>
                                      ))}
                                    </Slider>
                                  </div>}
                                </dl>
                              </div>
                            </div>
                            <div className={`col-12 px-1 mb-2 py-4`}>
                              <>
                                {config?.Tasks != null && config?.Tasks?.length > 0 && config.Tasks.map((user: any, index: number) => (
                                  user.IsShowTask == true && (
                                    <>
                                      <h3 className="f-15">{user?.Title} Working Today Tasks</h3>
                                      <div key={index} className="Alltable mb-2" onDragStart={(e) => handleDragStart(e, user, '')} draggable={false}>
                                        <GlobalCommanTable bulkEditIcon={true} updatedSmartFilterFlatView={true} customHeaderButtonAvailable={true} customTableHeaderButtons={customWorkingTableHeaderButtons(config, user, undefined, 'DateTask')} dashBoardbulkUpdateCallBack={dashBoardbulkUpdateCallBack} DashboardContextData={setBulkUpdateDataCallBack} smartFavTableConfig={smartFavTableConfig} wrapperHeight="300px" columnSettingIcon={true} multiSelect={true} tableId={"DashboardID" + ContextData?.DashboardId + "WebpartId" + config?.Id + "Dashboard"} ref={childRef} smartTimeTotalFunction={LoadTimeSheet} SmartTimeIconShow={true} AllListId={AllListId} showHeader={true} TaskUsers={AllTaskUser} portfolioColor={'#000066'} columns={config.column} data={user?.Tasks}
                                          callBackData={callBackData} pageSize={config?.configurationData != undefined && config?.configurationData[0] != undefined ? config?.configurationData[0]?.showPageSizeSetting?.tablePageSize : ''} showPagination={config?.configurationData != undefined && config?.configurationData[0] != undefined ? config?.configurationData[0]?.showPageSizeSetting?.showPagination : ''} />
                                      </div>
                                    </>
                                  )
                                ))}
                                {config?.Tasks != null && config?.Tasks?.length > 0 && config.Tasks.map((user: any, index: number) => (
                                  user?.dates != null && user?.dates?.length > 0 && user?.dates.map((Date: any, index: number) => (
                                    Date.IsShowTask == true && (
                                      <>
                                        {/* onDragStart={(e) => handleDragStart(e, user,'')} draggable={false} */}
                                        {/* {Date?.DisplayDate} */}
                                        {/* onDragOver={(e) => e.preventDefault()} */}
                                        {Date?.DisplayDate == 'Un-Assigned' &&
                                          <><h3 className="f-15">{user?.Title} Un-Assigned Tasks</h3>
                                            <div onDragStart={(e) => handleDragStart(e, user, 'Un-Assigned')} draggable={true} onDragOver={(e) => e.preventDefault()} onDrop={(e) => onDropUser(e, user, config, Date?.DisplayDate)} key={index} className="Alltable mb-2">
                                              <GlobalCommanTable bulkEditIcon={true} updatedSmartFilterFlatView={true} customHeaderButtonAvailable={true} customTableHeaderButtons={customWorkingTableHeaderButtons(config, user, undefined, 'Un-AssignedTask')} dashBoardbulkUpdateCallBack={dashBoardbulkUpdateCallBack} DashboardContextData={setBulkUpdateDataCallBack} smartFavTableConfig={smartFavTableConfig} wrapperHeight="300px" columnSettingIcon={true} multiSelect={true} tableId={"DashboardID" + ContextData?.DashboardId + "WebpartId" + config?.Id + "Dashboard"} ref={childRef} smartTimeTotalFunction={LoadTimeSheet} SmartTimeIconShow={true} AllListId={AllListId} showHeader={true} TaskUsers={AllTaskUser} portfolioColor={'#000066'} columns={config.column} data={Date?.Tasks}
                                                callBackData={callBackData} pageSize={config?.configurationData != undefined && config?.configurationData[0] != undefined ? config?.configurationData[0]?.showPageSizeSetting?.tablePageSize : ''} showPagination={config?.configurationData != undefined && config?.configurationData[0] != undefined ? config?.configurationData[0]?.showPageSizeSetting?.showPagination : ''} />
                                            </div></>
                                        }
                                      </>
                                    )
                                  ))
                                ))}
                              </>
                            </div>
                          </>
                        }
                      </>
                    }
                    {config?.selectFilterType == 'GroupByUser' &&
                      <section className="bg-light border col mb-3 smartFilter">
                        <details open className="p-0 m-0">
                          <summary>
                            <span className="fw-semibold f-15 fw-semibold">{config?.WebpartTitle}</span>
                          </summary>
                          <hr style={{ width: "98%", marginLeft: "30px" }}></hr>
                          <div style={{ display: "block" }}>
                            <div className="taskTeamBox ps-30 my-2">
                              {config?.Tasks != undefined && config?.Tasks?.length > 0 &&
                                config?.Tasks?.map((users: any, i: number) => {
                                  return (
                                    users?.childs?.length > 0 && (
                                      <div className="top-assign">
                                        <div className="team ">
                                          <label className="BdrBtm">
                                            {users.childs.length > 0 && (
                                              <> {users.Title} </>
                                            )}
                                          </label>
                                          <div className="d-flex">
                                            {users.childs.length > 0 &&
                                              users.childs.map((item: any, i: number) => {
                                                return (
                                                  item.AssingedToUser != undefined && (
                                                    <div className="alignCenter">
                                                      {item.Item_x0020_Cover != undefined && item.AssingedToUser != undefined ? (
                                                        <span>
                                                          <img id={"UserImg" + item.Id} className={item?.AssingedToUserId == SelectedUserId ? "activeimg seclected-Image ProirityAssignedUserPhoto" : "ProirityAssignedUserPhoto"}
                                                            onClick={(e) => SelectUserImage(e, item)} title={item.AssingedToUser.Title} src={item?.Item_x0020_Cover?.Url
                                                            }
                                                          />
                                                        </span>)
                                                        :
                                                        (<span id={"UserImg" + item.Id} className={item?.AssingedToUserId == SelectedUserId ? "activeimg newDynamicUserIcon" : "newDynamicUserIcon"} title={item.Title} onClick={(e) => SelectUserImage(e, item)} >
                                                          {item?.Suffix}
                                                        </span>
                                                        )}
                                                    </div>
                                                  )
                                                );
                                              }
                                              )}
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  );
                                })}
                            </div>
                          </div>
                        </details>

                      </section>

                    }
                  </>
                }
                {config?.DataSource == 'TimeSheet' &&
                  <>
                    <div className="alignCenter empAllSec mt-2 justify-content-between">
                      <span className="fw-bold">
                        {/* {config?.Status == "My TimSheet" && */}
                        {/* <>{`${config?.WebpartTitle}`}  {config?.Tasks != undefined && `(${config?.Tasks?.length})`}</> */}
                        {/* } */}
                      </span>
                      {/* <span className="alignCenter">
                        <span className="empCol me-1 mt-2 hreflink"><br /></span>
                      </span> */}
                    </div>
                    <div className="Alltable" >
                      {config?.Tasks != undefined && config?.Tasks?.length > 0 && (
                        <GlobalCommanTable showingDataCoustom={`${config?.WebpartTitle} (${config?.Tasks?.length})`} smartFavTableConfig={smartFavTableConfig} wrapperHeight="300px" customHeaderButtonAvailable={true} customTableHeaderButtons={customTimeSheetTableHeaderButtons(config)} ShowTimeSheetsDescriptionSearch={true} columnSettingIcon={true} hideTeamIcon={true} hideOpenNewTableIcon={true} multiSelect={true} tableId={"DashboardID" + ContextData?.DashboardId + "WebpartId" + config?.Id + "Dashboard"} ref={childRef} AllListId={ContextData?.propsValue} showHeader={true} TaskUsers={AllTaskUser} portfolioColor={'#000066'} columns={config.column} data={config?.Tasks} callBackData={callBackData}
                          pageSize={config?.configurationData != undefined && config?.configurationData[0] != undefined ? config?.configurationData[0]?.showPageSizeSetting?.tablePageSize : ''} showPagination={config?.configurationData != undefined && config?.configurationData[0] != undefined ? config?.configurationData[0]?.showPageSizeSetting?.showPagination : ''} />
                      )}
                      {config?.Tasks != undefined && config?.Tasks?.length == 0 && (
                        <GlobalCommanTable showingDataCoustom={`${config?.WebpartTitle} (${config?.Tasks?.length})`} smartFavTableConfig={smartFavTableConfig} wrapperHeight="300px" customHeaderButtonAvailable={true} customTableHeaderButtons={customTimeSheetTableHeaderButtons(config)} ShowTimeSheetsDescriptionSearch={true} columnSettingIcon={true} hideTeamIcon={true} hideOpenNewTableIcon={true} multiSelect={true} tableId={"DashboardID" + ContextData?.DashboardId + "WebpartId" + config?.Id + "Dashboard"} ref={childRef} AllListId={ContextData?.propsValue} showHeader={true} TaskUsers={AllTaskUser} portfolioColor={'#000066'} columns={config.column} data={config?.Tasks} callBackData={callBackData}
                          pageSize={config?.configurationData != undefined && config?.configurationData[0] != undefined ? config?.configurationData[0]?.showPageSizeSetting?.tablePageSize : ''} showPagination={config?.configurationData != undefined && config?.configurationData[0] != undefined ? config?.configurationData[0]?.showPageSizeSetting?.showPagination : ''} />
                      )}
                    </div>
                  </>}
              </section>}
              {
                config.IsMyNotes == true && config?.ShowWebpart == true && config?.GroupByView == undefined &&
                <div className="empAllSec notesSec shadow-sm clearfix">
                  <MyNotes config={config} IsShowConfigBtn={IsShowConfigBtn} />
                </div>
              }
              {
                config.IsUpcomingBday == true && config?.ShowWebpart == true && config?.GroupByView == undefined &&
                <div className="empAllSec birthSec shadow-sm clearfix">
                  <ComingBirthday config={config} IsShowConfigBtn={IsShowConfigBtn} />
                </div>
              }
            </div >
          );
          currentRow.push(box);
          if (currentRow.length === config.highestColumn || index === DashboardConfig.length - 1) {
            const row = (
              <div className="row m-0 empMainSec" key={`row_${index}`}>
                {currentRow}
              </div>
            );
            rows.push(row);
            currentRow = [];
          }
        }
      }
    });
    return rows;
  };
  const onRenderCustomHeadereditcomment = () => {
    return (
      <>
        <div className='subheading' >
          Rejected Comment
        </div>
      </>
    );
  };
  return (
    <>
      <div>
        {ActiveTile != undefined && generateDashboard()}
        <span>
          {editPopup && <EditTaskPopup Items={result} context={ContextData?.propsValue?.Context} AllListId={AllListId} Call={() => { CallBack() }} />}
        </span>
        <span>
          {EditProjectPopup && <EditProjectPopup props={CompResult} AllListId={AllListId} Call={() => { CallBack() }} />}
        </span>
        <span>
          {EditCompPopup && (
            <EditInstituton item={CompResult} SelectD={AllListId} Calls={CallBack} portfolioTypeData={portfolioTyped} portfolioColor={portfolioColor}  ></EditInstituton>
          )}
        </span>
        <span>
          {IsManageConfigPopup && <AddEditWebpartTemplate props={ContextData?.propsValue} DashboardPage={true} DashboardConfigBackUp={ContextData?.DashboardConfigBackUp} SingleWebpart={true} EditItem={SelectedItem} IsOpenPopup={SelectedItem} CloseConfigPopup={CloseConfigPopup} />}
        </span>
        <span>
          {IsTimeEntry && (
            <TimeEntryPopup props={TimeComponent} CallBackTimeEntry={TimeEntryCallBack} Context={ContextData?.propsValue?.Context}  ></TimeEntryPopup>
          )}
        </span>
      </div>
      {
        isRejectItem != undefined && isRejectItem != '' ? (
          <Panel onRenderHeader={onRenderCustomHeadereditcomment}
            isOpen={isRejectItem}
            onDismiss={CancelRejectPopup}
            isBlocking={false}>
            <div className="modal-body">
              <textarea className="form-control" style={{ height: '140px' }} onChange={(e) => updateRejectedComment(e)}  ></textarea>
            </div>
            <footer className='modal-footer mt-2'>
              <button className='btn btn-primary me-2 mb-2' onClick={() => SaveApprovalRejectPopup('Rejected', undefined, undefined)} disabled={isRejectItem?.RejectedDetails == undefined || isRejectItem?.RejectedDetails.RejectedComment == '' || isRejectItem?.RejectedDetails.RejectedComment == undefined} >Save</button>
              <button className='btn btn-default mb-2' onClick={CancelRejectPopup}  >Cancel</button>
            </footer>
          </Panel>
        ) : null
      }
    </>
  );
};
export default TaskStatusTbl;