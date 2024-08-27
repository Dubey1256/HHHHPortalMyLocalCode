import * as React from "react";
import * as Moment from "moment";
import { IUserTimeEntryProps } from "./IUserTimeEntryProps";
import { Web, sp } from "sp-pnp-js";
import CheckboxTree from "react-checkbox-tree";
import "react-checkbox-tree/lib/react-checkbox-tree.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import { ColumnDef } from "@tanstack/react-table";
import { SlArrowRight, SlArrowDown } from "react-icons/sl";
import { BsBarChartLine } from "react-icons/bs";
import { Col, Row } from "react-bootstrap";
import FileSaver from "file-saver";
import * as XLSX from "xlsx";
import GlobalCommanTable from "../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable";
import ReactPopperTooltipSingleLevel from "../../../globalComponents/Hierarchy-Popper-tooltipSilgleLevel/Hierarchy-Popper-tooltipSingleLevel";
import InfoIconsToolTip from "../../../globalComponents/InfoIconsToolTip/InfoIconsToolTip";
import EditTaskPopup from "../../../globalComponents/EditTaskPopup/EditTaskPopup";
import * as globalCommon from "../../../globalComponents/globalCommon";
import PreSetDatePikerPannel from "../../../globalComponents/SmartFilterGolobalBomponents/PreSetDatePiker";
import TimeEntryPopup from "../../../globalComponents/TimeEntry/TimeEntryComponent";
import ShowClintCatogory from "../../../globalComponents/ShowClintCatogory";
import PageLoader from "../../../globalComponents/pageLoader";
import CentralizedSiteComposition from "../../../globalComponents/SiteCompositionComponents/CentralizedSiteComposition";
import ShareTimeSheet from "../../../globalComponents/ShareTimeSheet";
//import EmployeePieChart from '../../employeDashBoard/components/EmployeePieChart';
import GraphData from "./GraphicData";
import ReactPopperTooltip from "../../../globalComponents/Hierarchy-Popper-tooltip";
var AllListId: any;
var siteConfig: any[] = [];
var AllPortfolios: any[] = [];
var AllSitesAllTasks: any[] = [];
var AllTimeSheetResult: any[] = [];
var AllTaskUser: any = [];
let totalTimedata: any = [];
let QueryStringId: any = "";
let filterItems: any = [];
let filteredData: any = [];
let filterGroups: any = [];
let filterSites: any = [];
let QueryStringDate: any = "";
let TimeSheetResult: any[] = [];
let validSites: any = [];
//let seletedAllSites:any=[]
let DateType: any = "This Week";
let DevloperTime: any = 0.00;
let ManagementTime: any = 0.00;
let QATime: any = 0.00;
let QAMembers: any = 0;
let DesignMembers: any = 0;
let DesignTime: any = 0;
let TotleTaskTime: any = 0;
let DevelopmentMembers: any = 0;
let managementMembers: any = 0;
let TotalQAMember: any = 0;
let TotalDesignMember: any = 0;
let TotalDevelopmentMember: any = 0;
let QAleaveHours: any = 0;
let DevelopmentleaveHours: any = 0;
let managementleaveHours: any = 0;
let DesignMemberleaveHours: any = 0;
let startDate: any = ''
let DevCount: any = 0;
let ManagementCount: any = 0;
let Trainee: any = 0;
let DesignCount: any = 0;
let QACount: any = 0;
let TranineesNum: any = 0;
let TotlaTime: any = 0;
let TotalleaveHours: any = 0;
let defaultSelectSite: any = false;
export interface IUserTimeEntryState {
  Result: any;
  taskUsers: any;
  checked: any;
  IsOpenTimeSheetPopup: any;
  expanded: any;
  DateType: any;
  IsShareTimeEntry: boolean;
  checkedSites: any;
  expandedSites: any;
  filterItems: any;
  filterSites: any;
  ImageSelectedUsers: any;
  startdate: Date;
  enddate: Date;
  SitesConfig: any;
  AllTimeEntry: any;
  SelectGroupName: string;
  checkedAll: boolean;
  checkedAllSites: boolean;
  checkedParentNode: any;
  resultSummary: any;
  ShowingAllData: any;
  loaded: any;
  expandIcons: boolean;
  columns: ColumnDef<any, unknown>[];
  IsMasterTask: any;
  IsTask: any;
  IsPresetPopup: any;
  PresetEndDate: any;
  PresetStartDate: any;
  PreSetItem: any;
  isStartDatePickerOne: boolean;
  isEndDatePickerOne: boolean;
  IsCheckedComponent: boolean;
  IsCheckedService: boolean;
  selectedRadio: any;
  IsTimeEntry: boolean;
  showShareTimesheet: boolean;
  disableProperty: boolean;
  TimeComponent: any;
  AllMetadata: any;
  isDirectPopup: boolean;
  TimeSheetLists: any;
  seletedAllSites: any
}
var user: any = "";
let portfolioColor: any = "#000066";
export default class UserTimeEntry extends React.Component<
  IUserTimeEntryProps,
  IUserTimeEntryState
> {
  openPanel: any;
  closePanel: any;
  sheetsItems: any[];
  showShareTimesheet: any;
  disableProperty: any;
  public constructor(props: IUserTimeEntryProps, state: IUserTimeEntryState) {
    super(props);
    this.state = {
      Result: {},
      taskUsers: [],
      DateType: "",
      IsOpenTimeSheetPopup: false,
      IsShareTimeEntry: false,
      showShareTimesheet: false,
      disableProperty: true,
      checked: [],
      expanded: [],
      seletedAllSites: [],
      checkedSites: [],
      expandedSites: [],
      filterItems: [],
      filterSites: [],
      ImageSelectedUsers: [],
      startdate: new Date(),
      enddate: new Date(),
      SitesConfig: [],
      AllTimeEntry: [],
      SelectGroupName: "",
      checkedAll: false,
      expandIcons: false,
      checkedAllSites: false,
      checkedParentNode: [],
      resultSummary: { totalTime: 0, totalDays: 0 },
      ShowingAllData: [],
      loaded: true,
      columns: [],
      IsTask: "",
      IsMasterTask: "",
      IsPresetPopup: false,
      PresetEndDate: new Date(),
      PresetStartDate: new Date(),
      PreSetItem: {},
      isStartDatePickerOne: true,
      isEndDatePickerOne: false,
      IsCheckedComponent: true,
      IsCheckedService: true,
      selectedRadio: "ThisWeek",
      IsTimeEntry: false,
      TimeComponent: {},
      AllMetadata: [],
      isDirectPopup: false,
      TimeSheetLists: [],
    };
    this.OpenPresetDatePopup = this.OpenPresetDatePopup.bind(this);
    this.SelectedPortfolioItem = this.SelectedPortfolioItem.bind(this);
    this.EditDataTimeEntryData = this.EditDataTimeEntryData.bind(this);
    this.TimeEntryCallBack = this.TimeEntryCallBack.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.GetResult();
  }
  async componentDidMount() {
    //this.GetTimeEntry();
    window.addEventListener("keydown", this.handleKeyDown);
    await this._fetchSubsitesWithPermissions();
    if (this.props.Context.pageContext.web.absoluteUrl !== 'https://hhhhteams.sharepoint.com/sites/HHHH' || this.props.Context.pageContext.web.absoluteUrl !== 'https://smalsusinfolabs.sharepoint.com/sites/HHHHQA') {
      try {

        const apiUrl = `${this.props.Context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('SmartMetadata')/items?$filter=TaxType eq 'DynamicUserTimeEntry'`;
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json;odata=nometadata',
          },
        });

        if (response.ok) {
          const data = await response.json();
          let JSONData = JSON.parse(data.value[0]?.Configurations);
          JSONData?.forEach((val: any) => {
            val.isSelected = true;
            filteredData.push(val);
          });
          this.setState({ seletedAllSites: JSONData });
          await this.LoadPortfolio();
          await this.GetTaskUsers('checked');
          if (user != undefined && user?.Id != undefined && user?.Id != "") {
            await this.DefaultValues();
          }
          await this.LoadAllMetaDataFilter('loading');
        } else {
          console.error(`Error fetching data from: ${response.statusText}`);
        }
      } catch (error) {
        console.error(`Error fetching data from: ${error.message}`);
      }
    }
    else {
      let startdt = new Date();
      let enddt = new Date();
      let diff, lastday;
      diff = startdt.getDate() - startdt.getDay() + (startdt.getDay() === 0 ? -6 : 1);
      startdt.setDate(diff);
      lastday = enddt.getDate() - (enddt.getDay() - 1) + 6;
      enddt.setDate(lastday);
      startdt.setHours(0, 0, 0, 0);
      enddt.setHours(0, 0, 0, 0);

      this.setState({
        startdate: startdt,
        enddate: enddt,
      })
    }

  }


  private async _fetchSubsitesWithPermissions(): Promise<void> {
    let AllSites: any = []
    let AllSubSites: any = []
    let web = new Web(this.props.Context._pageContext._site.absoluteUrl);
    const batchItems = await web.lists.getByTitle('SmartMetadata')
      .items
      .select('Title,Configurations')
      .top(4999).get();
    console.log(batchItems)
    batchItems?.forEach(async (val: any) => {
      if (val?.Title === 'RootDashboardConfig') {
        // Push parsed configuration to AllSites array
        AllSites.push(JSON.parse(val.Configurations));
        // Assign AllSubSites from AllSites (assuming AllSites[0] contains the array of subsites)
        AllSubSites = AllSites[0];
      }
    });

    // Logging AllSubSites outside forEach (may not log as expected due to async forEach)
    console.log(AllSubSites);

    // Check if AllSubSites is defined and has elements
    if (AllSubSites !== undefined && AllSubSites.length > 0) {
      // Use regular forEach instead of async forEach for synchronous operations
      const promises = AllSubSites.map(async (subsite: any) => {
        await this.GetSitesMetaData(subsite);
      });


      await Promise.all(promises);
      validSites?.forEach((subsite: any) => {
        subsite.siteurl = subsite.siteUrl
        subsite.Title = subsite.siteName
        if (this.props.Context.pageContext.web.absoluteUrl.toLowerCase() === subsite.siteurl.toLowerCase()) {
          subsite.isSelected = true;
        }
        validSites.push(subsite);
      });
      const titleMap: any = {};

      // Filter out duplicate titles in the original validSites array
      validSites = validSites.filter((site: any) => {
        // Check if title exists in titleMap
        if (!titleMap[site.Title]) {
          // If title does not exist, add it to titleMap and return true to keep this element
          titleMap[site.Title] = true;
          return true;
        }
        // If title exists in titleMap, return false to filter out this element
        return false;
      });
      this.setState({
        loaded: false,
      });
    }
    if (this.props.Context.pageContext.web.absoluteUrl === 'https://hhhhteams.sharepoint.com/sites/HHHH' || this.props.Context.pageContext.web.absoluteUrl === 'https://smalsusinfolabs.sharepoint.com/sites/HHHHQA') {
      if (user !== undefined && user?.Id !== undefined && user?.Id !== "") {
        await this.DefaultValues(); // Await inside async function
        await this.LoadAllMetaDataFilter('loading'); // Uncomment if needed
      }
      this.setState({
        loaded: false,
      });
    }
  }
  private GetSitesMetaData = async (config: any) => {
    if (config?.TaskUserListID != undefined) {
      try {
        let web = new Web(config?.siteUrl);
        let smartmeta = [];
        let TaxonomyItems = [];
        let siteConfig: any = [];
        smartmeta = await web.lists
          .getById(config?.TaskUserListID)
          .items
          .top(5000)
          .get();
        if (smartmeta.length > 0) {
          validSites.push(config)
          //validSites = [...validSites, ...smartmeta]
        } else {
          console.log('Task User List Id not present')
        }
        //AllMetadata = smartmeta;

      } catch (error) {
        console.log(error)

      }
    } else {
      alert('Task User List Id not present')
    }
  };
  // private loadMultisiteMetadata=async(site:any)=>{
  //   if (this.props.Context.pageContext.web.absoluteUrl !== 'https://hhhhteams.sharepoint.com/sites/HHHH') {
  //     try {
  //       // Construct the API URL for the SmartMetaData list
  //       const apiUrl = `${site?.siteurl}/_api/web/lists/getbytitle('SmartMetadata')/items?$filter=TaxType eq 'DynamicUserTimeEntry'`;

  //       // Make the API call
  //       const response = await fetch(apiUrl, {
  //         method: 'GET',
  //         headers: {
  //           'Accept': 'application/json;odata=nometadata',
  //         },
  //       });

  //       if (response.ok) {
  //         const data = await response.json();
  //         // Add the filtered data to the array
  //         let JSONData = JSON.parse(data.value[0]?.Configurations);
  //         JSONData?.forEach((val: any) => {
  //           val.isSelected=true;
  //           filteredData.push(val);
  //           this.LoadAllTimeSheetaData()
  //         });
  //       } else {
  //         console.error(`Error fetching data from: ${response.statusText}`);
  //       }
  //     } catch (error) {
  //       console.error(`Error fetching data from: ${error.message}`);
  //     }
  //   }
  // }
  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleKeyDown);
  }
  handleKeyDown(event: any) {
    let selectedDate: any = undefined;
    if (event.target.dataset.inputType == "StartDate")
      selectedDate = this.state.startdate;
    else if (event.target.dataset.inputType == "EndDate")
      selectedDate = this.state.enddate;
    let newDate = selectedDate;
    switch (event.key) {
      case "ArrowLeft":
        newDate.setDate(selectedDate.getDate() - 1);
        break;
      case "ArrowRight":
        newDate.setDate(selectedDate.getDate() + 1);
        break;
      case "ArrowUp":
        newDate.setDate(selectedDate.getDate() - 7);
        break;
      case "ArrowDown":
        newDate.setDate(selectedDate.getDate() + 7);
        break;
      case "PageUp":
        newDate.setMonth(selectedDate.getMonth() + 1);
        break;
      case "PageDown":
        newDate.setMonth(selectedDate.getMonth() - 1);
        break;
      case "Home":
        let startdt = new Date();
        let diff: number;
        diff =
          startdt.getDate() -
          startdt.getDay() +
          (startdt.getDay() === 0 ? -6 : 1);
        startdt = new Date(startdt.setDate(diff));
        newDate = startdt;
        break;
      case "End":
        let enddt = new Date();
        let lastday: number;
        lastday = enddt.getDate() - (enddt.getDay() - 1) + 6;
        enddt = new Date(enddt.setDate(lastday));
        newDate = enddt;
        break;
      case "/":
        const PickerPopup: any = document.getElementsByClassName(
          "react-datepicker__tab-loop"
        );
        for (let i = 0; i < PickerPopup.length; i++) {
          PickerPopup[i].style.display = "block";
        }
        break;
      case "Enter":
        const elements: any = document.getElementsByClassName(
          "react-datepicker__tab-loop"
        );
        for (let i = 0; i < elements.length; i++) {
          elements[i].style.display = "none";
        }
        break;
      default:
        return;
    }
    if (event.target.dataset.inputType == "StartDate") {
      this.setState({
        startdate: newDate,
      });
    } else if (event.target.dataset.inputType == "EndDate") {
      this.setState({
        enddate: newDate,
      });
    }

  }
  private BackupAllTimeEntry: any = [];
  private AllTimeEntry: any = [];
  private TotalTimeEntry: any;
  private TotalDays: any;
  private StartWeekday: any;
  private endweekday: any;
  private async GetResult() {
    var params = new URLSearchParams(window.location.search);
    user = { Id: params.get("userId") };
    QueryStringId = params.get("userId");
    if (user == undefined || user?.Id == undefined || user?.Id == "") {
      user = { Id: params.get("UserId") };
      QueryStringDate = params.get("Date")
      QueryStringId = params.get("UserId");
    }
    // if (user.Date != undefined || user.Date != null) {
    //   this.setState({
    //     startdate: user.Date,
    //   });
    //   this.setState({
    //     enddate: user.Date,
    //   });
    // }
    if (user == undefined || user?.Id == undefined || user?.Id == "") {
      let web = new Web(this.props.Context.pageContext.web.absoluteUrl);
      user = await web.currentUser.get();
    }
    // if (user.Date != undefined || user.Date != null) {
    //   await this.DefaultValues();
    // }

    AllListId = this.props;
    AllListId.isShowTimeEntry = this.props.TimeEntry;
    AllListId.isShowSiteCompostion = this.props.SiteCompostion;
  }



  //-------------------------------Load Time Details Table data ------------------------------------------------------
  private getEndingDate(startDateOf: any): Date {
    const endingDate = new Date();
    let formattedDate = endingDate;

    if (startDateOf === 'This Week') {
      endingDate.setDate(endingDate.getDate() + (6 - endingDate.getDay()));
      formattedDate = endingDate;
    } else if (startDateOf === 'Today') {
      formattedDate = endingDate;
    } else if (startDateOf === 'Yesterday') {
      endingDate.setDate(endingDate.getDate() - 1);
      formattedDate = endingDate;
    } else if (startDateOf === 'This Month') {
      endingDate.setMonth(endingDate.getMonth() + 1, 0);
      formattedDate = endingDate;
    } else if (startDateOf === 'Last Month') {
      const lastMonth = new Date(endingDate.getFullYear(), endingDate.getMonth() - 1);
      endingDate.setDate(0);
      formattedDate = endingDate;
    } else if (startDateOf === 'Last Week') {
      const lastWeek = new Date(endingDate.getFullYear(), endingDate.getMonth(), endingDate.getDate() - 7);
      endingDate.setDate(lastWeek.getDate() - lastWeek.getDay() + 7);
      formattedDate = endingDate;
    }

    return formattedDate;
  }

  private GetleaveUser = async () => {
    var myData: any = []
    let finalData: any = []
    var leaveData: any = []
    var leaveUser: any = []
    let todayLeaveUsers: any = []
    const promises = filteredData?.map(async (items: any) => {
      let web = new Web(items.siteUrl);
      myData = await web.lists
        .getById(items?.LeaveCalendarListId)
        .items
        .select("RecurrenceData,Duration,Author/Title,Editor/Title,Category,HalfDay,Description,ID,EndDate,EventDate,Location,Title,fAllDayEvent,EventType,UID,fRecurrence,Event_x002d_Type,Employee/Id")
        .top(499)
        .expand("Author,Editor,Employee")
        .getAll()
      console.log(myData);
      return myData;
    });

    const allResults = await Promise.all(promises);
    await Promise.all(allResults);
    allResults[0]?.forEach((val: any) => {
      val.EndDate = new Date(val?.EndDate);
      val?.EndDate.setHours(val?.EndDate.getHours() - 9);
      var itemDate = Moment(val.EventDate)
      val.endDate = Moment(val?.EndDate).format("DD/MM/YYYY")
      var eventDate = Moment(val.EventDate).format("DD/MM/YYYY")
      const date = val.EndDate
      var NewEndDate = val.endDate.split("/")
      var NewEventDate = eventDate.split("/")
      val.End = NewEndDate[2] + NewEndDate[1] + NewEndDate[0]
      val.start = NewEventDate[2] + NewEventDate[1] + NewEventDate[0]
      leaveData.push(val)

    })
    console.log(leaveData)
    leaveData?.forEach((val: any) => {
      if (val?.fAllDayEvent == true) {
        val.totaltime = 8
      }
      else {
        val.totaltime = 8
      }
      if (val?.HalfDay == true) {
        val.totaltime = 4
      }
      var users: any = {}
      AllTaskUser?.forEach((item: any) => {
        if (item?.AssingedToUserId != null && val?.Employee?.Id == item?.AssingedToUserId && item.UserGroup?.Title != 'Ex Staff') {
          users['userName'] = item.Title
          users['ComponentName'] = ''
          users['Department'] = item.TimeCategory
          users['Effort'] = val.totaltime !== undefined && val.totaltime <= 4 ? val.totaltime : 8
          users['Description'] = 'Leave'
          users['ClientCategoryy'] = 'Leave'
          users['siteType'] = ''
          users['Status'] = ''
          users['EndDate'] = val.End
          users['Start'] = val.start
          users['totaltime'] = val.totaltime
          todayLeaveUsers.push(users)
        }
      })
    })
    finalData = todayLeaveUsers.filter((val: any, TaskId: any, array: any) => {
      return array.indexOf(val) == TaskId;
    })
    console.log(finalData)
    return finalData
  }
  private ShareTimeSheetMultiUser = async (AllTimeEntry: any, TaskUser: any, Context: any, DateType: any, selectedUser: any) => {
    var LeaveUserData = await this.GetleaveUser()
    console.log(LeaveUserData)
    //-------------------------leave User Data---------------------------------------------------------------------------------------
    //-----------------------End--------------------------------------------------------------------------------------------------------------
    if (DateType == 'Yesterday' || DateType == 'Today') {
      startDate = this.getStartingDate(DateType);
    }
    startDate = this.getStartingDate(DateType);
    startDate = Moment(startDate).format('DD/MM/YYYY')
    let endDate: any = this.getEndingDate(DateType);
    endDate = Moment(endDate).format('DD/MM/YYYY')
    var selectedDate = startDate.split("/")
    var select = selectedDate[2] + selectedDate[1] + selectedDate[0]

    const currentLoginUserId = Context.pageContext?._legacyPageContext.userId;
    selectedUser?.forEach((items: any) => {
      if (items?.UserGroup?.Title == 'Developers Team' || items?.UserGroup?.Title == 'Portfolio Lead Team' || items?.UserGroup?.Title == 'Trainees') {
        DevCount++
      }
      if (items?.UserGroup?.Title == 'Junior Task Management' || items?.Title == 'Prashant Kumar') {
        ManagementCount++
      }
      if ((items?.TimeCategory == 'Design' && items.Company == 'Smalsus') || items?.UserGroup?.Title == 'Design Team') {
        DesignCount++
      }
      if ((items?.TimeCategory == 'QA' && items.Company == 'Smalsus') && items?.UserGroup?.Title != 'Ex-Staff') {
        QACount++
      }

    })
    AllTimeEntry?.forEach((item: any) => {
      TaskUser?.map((val: any) => {
        if (item?.AuthorId == val?.AssingedToUserId) {
          if (val?.UserGroup?.Title == 'Developers Team' || val?.UserGroup?.Title == 'Portfolio Lead Team' || val?.UserGroup?.Title == 'Smalsus Lead Team' || val?.UserGroup?.Title == 'External Staff' || val?.UserGroup?.Title == 'Trainees') {
            item.Department = 'Developer';
            item.userName = val?.Title
          }
          if (val?.UserGroup?.Title == 'Junior Task Management' || val?.Title == 'Prashant Kumar') {
            item.Department = 'Management'
            item.userName = val?.Title
          }


          if (val?.UserGroup?.Title == 'Design Team') {
            item.Department = 'Design';
            item.userName = val?.Title
          }


          if (val?.UserGroup?.Title == 'QA Team') {
            item.Department = 'QA';
            item.userName = val?.Title
          }
        }
      })

    })
    if (AllTimeEntry != undefined) {
      // AllTimeEntry?.forEach((time: any) => {
      //   if (time?.Department == 'Developer') {
      //     DevloperTime = DevloperTime + parseFloat(time.Effort)
      //   }
      //   if (time?.Department == 'Management') {
      //     ManagementTime = ManagementTime + parseFloat(time.Effort)
      //   }

      //   if (time?.Department == 'Design') {
      //     DesignTime = DesignTime + parseFloat(time.Effort)
      //   }
      //   if (time?.Department == 'QA') {
      //     QATime = QATime + parseFloat(time.Effort)
      //   }

      // })
      for (let index = 0; index < AllTimeEntry.length; index++) {

        if (AllTimeEntry[index]?.Department == 'Developer') {
          DevloperTime += AllTimeEntry[index].Effort
        }
        if (AllTimeEntry[index]?.Department == 'Management') {
          ManagementTime += AllTimeEntry[index].Effort
        }

        if (AllTimeEntry[index]?.Department == 'Design') {
          DesignTime += AllTimeEntry[index].Effort
        }
        if (AllTimeEntry[index]?.Department == 'QA') {
          QATime += AllTimeEntry[index].Effort
        }


      }
      TotleTaskTime = QATime + DevloperTime + DesignTime + ManagementTime;
    }
    LeaveUserData?.forEach((items: any) => {
      if (select >= items.Start && select <= items.EndDate) {
        items.TaskDate = startDate
        if (items?.Department == 'Development') {
          DevelopmentMembers++
          DevelopmentleaveHours += items.totaltime
        }
        if (items?.Department == 'Management') {
          managementMembers++
          managementleaveHours += items.totaltime
        }

        if (items?.Department == 'Design') {
          DesignMembers++
          DesignMemberleaveHours += items.totaltime
        }

        if (items?.Department == 'QA') {
          QAMembers++
          QAleaveHours += items.totaltime
        }


        AllTimeEntry.push(items)
      }
    })
    var body1: any = []
    var body2: any = []
    var To: any = []
    var MyDate: any = ''
    var ApprovalId: any = []
    TotlaTime = QATime + DevloperTime + DesignTime
    TotalleaveHours = DesignMemberleaveHours + DevelopmentleaveHours + QAleaveHours;
    TaskUser?.forEach((items: any) => {
      if (currentLoginUserId == items.AssingedToUserId) {
        items.Approver?.forEach((val: any) => {
          ApprovalId.push(val)
        })

      }

    })
    ApprovalId?.forEach((va: any) => {
      TaskUser?.forEach((ba: any) => {
        if (ba.AssingedToUserId == va.Id) {
          To.push(ba?.Email)
        }
      })

    })
    //     var text = '<tr>' +
    //         '<td width="7%" style="border: 1px solid #aeabab;padding: 4px">' + item?.TaskDate + '</td>'
    //         + '<td width="7%" style="border: 1px solid #aeabab;padding: 4px">' + item.siteType + '</td>'
    //         + '<td width="10%" style="border: 1px solid #aeabab;padding: 4px">' + item?.ComponentName + '</td>'
    //         + '<td style="border: 1px solid #aeabab;padding: 4px">' + `<a href='https://hhhhteams.sharepoint.com/sites/HHHH/sp/SitePages/Task-Profile.aspx?taskId=${item.Id}&Site=${item.siteType}'>` + '<span style="font-size:11px; font-weight:600">' + item.TaskTitle + '</span>' + '</a >' + '</td>'
    //         + '<td align="left" style="border: 1px solid #aeabab;padding: 4px">' + item?.Description + '</td>'
    //         + '<td style="border: 1px solid #aeabab;padding: 4px">' + item?.PriorityRank + '</td>'
    //         + '<td style="border: 1px solid #aeabab;padding: 4px">' + item?.Effort + '</td>'
    //         + '<td style="border: 1px solid #aeabab;padding: 4px">' + item?.PercentComplete + '%' + '</td>'
    //         + '<td width="7%" style="border: 1px solid #aeabab;padding: 4px">' + item?.Status + '</td>'
    //         + '<td width="10%" style="border: 1px solid #aeabab;padding: 4px">' + item?.userName + '</td>'
    //         + '<td style="border: 1px solid #aeabab;padding: 4px">' + item?.Department + '</td>'
    //         + '<td style="border: 1px solid #aeabab;padding: 4px">' + item?.ClientCategorySearch + '</td>'
    //         + '</tr>'
    //     body1.push(text);
    // })
    // var text2 =
    //     '<tr>'
    //     + '<td style="border: 1px solid #aeabab;padding: 5px;width: 50%;" bgcolor="#f5f5f5">' + '<strong>' + 'Team' + '</strong>' + '</td>'
    //     + '<td style="border: 1px solid #aeabab;padding: 4px">' + '<strong>' + 'Total Employees' + '</strong>' + '</td>'
    //     + '<td style="border: 1px solid #aeabab;padding: 4px">' + '<strong>' + 'Employees on leave' + '</strong>' + '</td>'
    //     + '<td style="border: 1px solid #aeabab;padding: 4px">' + '<strong>' + 'Hours' + '</strong>' + '</td>'
    //     + '<td style="border: 1px solid #aeabab;padding: 4px">' + '<strong>' + 'Leave Hours' + '</strong>' + '</td>'
    //     + '</tr>'
    //     + '<tr>'
    //     + '<td style="border: 1px solid #aeabab;padding: 5px;width: 50%;" bgcolor="#f5f5f5">' + 'Management' + '</td>'
    //     + '<td style="border: 1px solid #aeabab;padding: 4px">' + ManagementCount + '</td>'
    //     + '<td style="border: 1px solid #aeabab;padding: 4px">' + managementMembers + '</td>'
    //     + '<td style="border: 1px solid #aeabab;padding: 4px">' + ManagementTime.toFixed(2) + '</td>'
    //     + '<td style="border: 1px solid #aeabab;padding: 4px">' + managementleaveHours + '</td>'
    //     + '</tr>'
    //     + '<tr>'
    //     + '<td style="border: 1px solid #aeabab;padding: 5px;width: 50%;" bgcolor="#f5f5f5">' + 'Technical Team' + '</td>'
    //     + '<td style="border: 1px solid #aeabab;padding: 4px">' + DevCount + '</td>'
    //     + '<td style="border: 1px solid #aeabab;padding: 4px">' + DevelopmentMembers + '</td>'
    //     + '<td style="border: 1px solid #aeabab;padding: 4px">' + DevloperTime.toFixed(2) + '</td>'
    //     + '<td style="border: 1px solid #aeabab;padding: 4px">' + DevelopmentleaveHours + '</td>'
    //     + '</tr>'
    //     + '<tr>'
    //     + '<tr>'
    //     + '<td style="border: 1px solid #aeabab;padding: 5px;width: 50%;" bgcolor="#f5f5f5">' + 'Design' + '</td>'
    //     + '<td style="border: 1px solid #aeabab;padding: 4px">' + DesignCount + '</td>'
    //     + '<td style="border: 1px solid #aeabab;padding: 4px">' + DesignMembers + '</td>'
    //     + '<td style="border: 1px solid #aeabab;padding: 4px">' + DesignTime.toFixed(2) + '</td>'
    //     + '<td style="border: 1px solid #aeabab;padding: 4px">' + DesignMemberleaveHours + '</td>'
    //     + '</tr>'
    //     + '<tr>'
    //     + '<td style="border: 1px solid #aeabab;padding: 5px;width: 50%;" bgcolor="#f5f5f5">' + 'QA' + '</td>'
    //     + '<td style="border: 1px solid #aeabab;padding: 4px">' + QACount + '</td>'
    //     + '<td style="border: 1px solid #aeabab;padding: 4px">' + QAMembers + '</td>'
    //     + '<td style="border: 1px solid #aeabab;padding: 4px">' + QATime.toFixed(2) + '</td>'
    //     + '<td style="border: 1px solid #aeabab;padding: 4px">' + QAleaveHours + '</td>'
    //     + '</tr>'
    //     + '<tr>'
    //     + '<td style="border: 1px solid #aeabab;padding: 5px;width: 50%;" bgcolor="#f5f5f5">' + '<strong>' + 'Total' + '</strong>' + '</td>'
    //     + '<td style="border: 1px solid #aeabab;padding: 4px">' + '<strong>' + (DesignCount + DevCount + QACount).toFixed(2) + '</strong>' + '</td>'
    //     + '<td style="border: 1px solid #aeabab;padding: 4px">' + '<strong>' + (DesignMembers + DevelopmentMembers + QAMembers).toFixed(2) + '</strong>' + '</td>'
    //     + '<td style="border: 1px solid #aeabab;padding: 4px">' + '<strong>' + TotlaTime.toFixed(2) + '</strong>' + '</td>'
    //     + '<td style="border: 1px solid #aeabab;padding: 4px">' + '<strong>' + TotalleaveHours + '</strong>' + '</td>'
    //     + '</tr>';
    // body2.push(text2);



    // var bodyA =
    //     '<table cellspacing="0" cellpadding="1" width="30%" style="margin: 0 auto;border-collapse: collapse;">'
    //     + '<tbody align="center">' +
    //     body2 +
    //     '</tbody>' +
    //     '</table>'
    // var pageurl = "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/UserTimeEntry.aspx";

    // if (DateType == 'Yesterday' || DateType == 'Today') {
    //     var ReportDatetime = startDate;
    // }
    // else {
    //     var ReportDatetime: any = `${startDate} - ${endDate}`
    // }

    // var body: any =
    //     '<p style="text-align: center;margin-bottom: 1px;">' + 'TimeSheet of  date' + '&nbsp;' + '<strong>' + ReportDatetime + '</strong>' + '</p>' +
    //     '<p style="text-align: center;margin: 0 auto;">' + '<a  href=' + pageurl + ' >' + 'Online version of timesheet' + '</a >' + '</p>' +
    //     '<br>'

    //     + '</br>' +
    //     bodyA +
    //     '<br>' + '</br>'
    //     + '<table cellspacing="0" cellpadding="1" width="100%" style="border-collapse: collapse;">' +
    //     '<thead>' +
    //     '<tr style="font-size: 11px;">' +
    //     '<th  style="border: 1px solid #aeabab;padding: 5px;" width = "7%" bgcolor="#f5f5f5">' + 'Date' + '</th>'
    //     + '<th style="border: 1px solid #aeabab;padding: 5px;" width = "7%" bgcolor="#f5f5f5">' + 'Sites' + '</th>'
    //     + '<th style="border: 1px solid #aeabab;padding: 5px;" width = "8%" bgcolor="#f5f5f5">' + 'Component' + '</th>'
    //     + '<th style="border: 1px solid #aeabab;padding: 5px;" bgcolor="#f5f5f5">' + 'Task' + '</th>'
    //     + '<th style="border: 1px solid #aeabab;padding: 5px;" bgcolor="#f5f5f5">' + 'FullDescription' + '</th>'
    //     + '<th style="border: 1px solid #aeabab;padding: 5px;" bgcolor="#f5f5f5">' + 'Priority' + '</th>'
    //     + '<th style="border: 1px solid #aeabab;padding: 5px;" bgcolor="#f5f5f5">' + 'Time' + '</th>'
    //     + '<th style="border: 1px solid #aeabab;padding: 5px;" bgcolor="#f5f5f5">' + 'Complete' + '</th>'
    //     + '<th style="border: 1px solid #aeabab;padding: 5px;" width = "7%" bgcolor="#f5f5f5">' + 'Status' + '</th>'
    //     + '<th style="border: 1px solid #aeabab;padding: 5px;" width = "8%" bgcolor="#f5f5f5">' + 'TimeEntryUser' + '</th>'
    //     + '<th style="border: 1px solid #aeabab;padding: 5px;" bgcolor="#f5f5f5">' + 'Designation' + '</th>'
    //     + '<th style="border: 1px solid #aeabab;padding: 5px;" bgcolor="#f5f5f5">' + 'ClientCategory' + '</th>'
    //     + '</thead>' +
    //     '<tbody align="center">' +
    //     '<tr>' +
    //     body1 +
    //     '</tr>' +
    //     '</tbody>' +
    //     '</table>' +
    //     '<p>' + '<strong>' + 'Thank You' + '</strong>' + '</p>'
    // var cc: any = []
    // var ReplyTo: any = ""
    // var from: any = undefined
    // var subject = 'TimeSheet :' + ' ' + ReportDatetime;
    // body = body.replaceAll(',', '');
    // sendEmailToUser(from, To, body, subject, ReplyTo, cc, Context);
    // alert('Email sent sucessfully');

  }
  //-----------------------------------------------End------------------------------------------------------------------

  private LoadAllSiteAllTasks = async () => {
    let AllSiteTasks: any = [];
    let web: any = ''
    let arraycount = 0;
    try {
      if (siteConfig?.length > 0) {
        siteConfig?.map(async (config: any) => {
          config
          web = new Web(config?.siteUrl?.Url);
          if (config.Title != "SDC Sites") {
            let smartmeta = [];
            await web.lists
              .getById(config.listId)
              .items.select(
                "ID",
                "Title",
                "ClientCategory/Id",
                "ClientCategory/Title",
                "Project/Id",
                "Project/Title",
                "Project/PriorityRank",
                "Project/PortfolioStructureID",
                "ClientCategory",
                "Comments",
                "DueDate",
                "ClientActivityJson",
                "EstimatedTime",
                "ParentTask/Id",
                "ParentTask/Title",
                "ParentTask/TaskID",
                "TaskID",
                "workingThisWeek",
                "IsTodaysTask",
                "AssignedTo/Id",
                "TaskLevel",
                "TaskLevel",
                "OffshoreComments",
                "AssignedTo/Title",
                "OffshoreImageUrl",
                "TaskCategories/Id",
                "TaskCategories/Title",
                "Status",
                "StartDate",
                "CompletedDate",
                "TeamMembers/Title",
                "TeamMembers/Id",
                "ItemRank",
                "PercentComplete",
                "Priority",
                "Body",
                "PriorityRank",
                "Created",
                "Author/Title",
                "Author/Id",
                "BasicImageInfo",
                "ComponentLink",
                "FeedBack",
                "ResponsibleTeam/Title",
                "ResponsibleTeam/Id",
                "TaskType/Title",
                "Portfolio/Id",
                "Portfolio/Title",
                "Modified"
              )
              .expand(
                "TeamMembers",
                "ParentTask",
                "ClientCategory",
                "AssignedTo",
                "Project",
                "TaskCategories",
                "Author",
                "ResponsibleTeam",
                "TaskType",
                "Portfolio"
              )
              .getAll()
              .then((data: any) => {
                smartmeta = data;
                smartmeta.map((task: any) => {
                  task.AllTeamMember = [];
                  task.HierarchyData = [];
                  task.siteType = config.Title;
                  task.descriptionsSearch = "";
                  task.listId = config.listId;
                  task.siteUrl = config.siteUrl.Url;
                  task.projectId = task?.Project?.Id;
                  task.PercentComplete = (task.PercentComplete * 100).toFixed(
                    0
                  );
                  task.SmartPriority =
                    globalCommon.calculateSmartPriority(task);
                  if (task?.ClientCategory?.length > 0) {
                    task.ClientCategorySearch = task?.ClientCategory?.map(
                      (elem: any) => elem.Title
                    ).join(" ");
                  } else {
                    task.ClientCategorySearch = "";
                  }
                  task.DisplayDueDate =
                    task.DueDate != null
                      ? Moment(task.DueDate).format("DD/MM/YYYY")
                      : "";
                  task.portfolio = {};
                  if (task?.Portfolio?.Id != undefined) {
                    task.portfolio = task?.Portfolio;
                    task.Status = task?.Status;
                    task.PortfolioTitle = task?.Portfolio?.Title;
                  }
                  const title = task?.Project?.Title || '';
                  const formattedDueDate = Moment(task?.DueDate, 'DD/MM/YYYY').format('YYYY-MM');
                  task.joinedData = [];
                  if (task?.projectStructerId && title || formattedDueDate) {
                    task.joinedData.push(`Project ${task?.projectStructerId} - ${title}  ${formattedDueDate == "Invalid date" ? '' : formattedDueDate}`)
                  }
                  task["SiteIcon"] = config?.Item_x005F_x0020_Cover?.Url;
                  task.TeamMembersSearch = "";
                  task.TaskID = globalCommon.GetTaskId(task);
                  AllSiteTasks.push(task);
                });
                arraycount++;
              });
            let currentCount = siteConfig?.length;
            if (arraycount === currentCount) {
              AllSitesAllTasks = AllSiteTasks;

              let completionCounter = 0; // Counter to track completion

              totalTimedata?.map((data: any) => {
                data.taskDetails = this.checkTimeEntrySite(data);

                completionCounter++;

                // Check if all items have been processed
                if (completionCounter === totalTimedata.length) {
                  // If all items are processed, execute setState

                  this.setState({ disableProperty: false });
                  // if (QueryStringDate != undefined || QueryStringDate != undefined) {
                  //   this.updatefilter(true);
                  // }
                }
              });
            }
          } else {
            arraycount++;
          }
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  private checkTimeEntrySite = (timeEntry: any) => {
    let result: any = "";
    result = AllSitesAllTasks?.filter((task: any) => {
      let site = "";
      if (task?.siteType == "Offshore Tasks") {
        site = "OffshoreTasks";
      } else {
        site = task?.siteType;
      }
      if (
        timeEntry[`Task${site}`] != undefined &&
        task?.Id == timeEntry[`Task${site}`]?.Id
      ) {
        return task;
      }
    });
    return result;
  };
  private checkBoxColor = (className: any) => {
    try {
      if (className != undefined) {
        setTimeout(() => {
          const inputElement = document.getElementsByClassName(className);
          if (inputElement) {
            for (let j = 0; j < inputElement.length; j++) {
              const checkboxContainer = inputElement[j];
              const childElements =
                checkboxContainer.getElementsByTagName("input");
              const childElements2 =
                checkboxContainer.getElementsByClassName("rct-title");
              for (let i = 0; i < childElements.length; i++) {
                const checkbox = childElements[i];
                const lable: any = childElements2[i];
                if (lable?.style) {
                  lable.style.color = portfolioColor;
                }
                checkbox.classList.add("form-check-input", "cursor-pointer");
                if (
                  lable?.innerHTML === "DE" ||
                  lable?.innerHTML === "QA" ||
                  lable?.innerHTML === "Health" ||
                  lable?.innerHTML === "DA E+E" ||
                  lable?.innerHTML === "Kathabeck" ||
                  lable?.innerHTML === "Gruene" ||
                  lable?.innerHTML === "HHHH" ||
                  lable?.innerHTML === "Other"
                ) {
                  checkbox.classList.add("smartFilterAlignMarginQD");
                }
              }
            }
          }
          const BtnElement = document.getElementsByClassName(
            "rct-collapse rct-collapse-btn"
          );
          if (BtnElement) {
            for (let j = 0; j < BtnElement.length; j++) {
              BtnElement[j]?.classList.add("mt--5");
            }
          }
        }, 1000);
      } else {
        setTimeout(() => {
          const inputElementSubchild = document.getElementsByClassName(
            "rct-node rct-node-parent rct-node-collapsed"
          );
          if (inputElementSubchild) {
            for (let j = 0; j < inputElementSubchild.length; j++) {
              const checkboxContainer = inputElementSubchild[j];
              const childElements =
                checkboxContainer.getElementsByTagName("input");
              const childElements2 =
                checkboxContainer.getElementsByClassName("rct-title");
              for (let i = 0; i < childElements.length; i++) {
                const checkbox = childElements[i];
                const lable: any = childElements2[i];
                if (lable?.style) lable.style.color = portfolioColor;
                checkbox.classList.add("form-check-input", "cursor-pointer");
              }
            }
          }

          const inputElementleaf = document.getElementsByClassName(
            "rct-node rct-node-leaf"
          );
          if (inputElementleaf) {
            for (let j = 0; j < inputElementleaf.length; j++) {
              const checkboxContainer = inputElementleaf[j];
              const childElements =
                checkboxContainer.getElementsByTagName("input");
              const childElements2 =
                checkboxContainer.getElementsByClassName("rct-title");
              for (let i = 0; i < childElements.length; i++) {
                const checkbox = childElements[i];
                const lable: any = childElements2[i];
                if (lable?.style) {
                  lable.style.color = portfolioColor;
                }
                checkbox.classList.add("form-check-input", "cursor-pointer");
              }
            }
          }
          const AllCheckBox = document.querySelectorAll('[type="checkbox"]');
          if (AllCheckBox) {
            for (let j = 0; j < AllCheckBox.length; j++) {
              AllCheckBox[j]?.classList.add(
                "form-check-input",
                "cursor-pointer"
              );
            }
          }
          const BtnElement = document.getElementsByClassName(
            "rct-collapse rct-collapse-btn"
          );
          if (BtnElement) {
            for (let j = 0; j < BtnElement.length; j++) {
              BtnElement[j]?.classList.add("mt--5");
            }
          }
        }, 30);
      }
    } catch (e: any) {
      console.log(e);
    }
  };
  private async DefaultValues() {
    let ImageSelectedUsers = this.state.ImageSelectedUsers;
    if (user?.Id != null) {
      for (let i = 0; i < this.state.taskUsers.length; i++) {
        let item = this.state.taskUsers[i];
        for (let j = 0; j < item.childs.length; j++) {
          let it = item.childs[j];
          if (it.AssingedToUserId != null && it.AssingedToUserId == user?.Id) {
            item.activeUser = true;
            ImageSelectedUsers.push(it);
            //this.setState({ ImageSelectedUsers: ImageSelectedUsers });
            document
              .getElementById("UserImg" + it.Id)
              .classList.add("seclected-Image");
            break;
          }
        }
      }
    }
  }
  private async LoadPortfolio() {

    filteredData?.map(async (items: any) => {
      let web = new Web(items?.siteUrl);
      AllPortfolios = await web.lists
        .getById(items?.MasterTaskListID)
        .items.select(
          "ID",
          "Title",
          "DueDate",
          "Status",
          "Sitestagging",
          "ItemRank",
          "Item_x0020_Type",
          "PortfolioStructureID",
          "SiteCompositionSettings",
          "PortfolioType/Title",
          "PortfolioType/Id",
          "PortfolioType/Color",
          "Parent/Id",
          "Author/Id",
          "Author/Title",
          "Parent/Title",
          "TaskCategories/Id",
          "TaskCategories/Title",
          "AssignedTo/Id",
          "AssignedTo/Title",
          "TeamMembers/Id",
          "TeamMembers/Title",
          "ClientCategory/Id",
          "ClientCategory/Title"
        )
        .expand(
          "TeamMembers",
          "Author",
          "ClientCategory",
          "Parent",
          "TaskCategories",
          "AssignedTo",
          "ClientCategory",
          "PortfolioType"
        )
        .top(4999)
        .filter(
          "(Item_x0020_Type eq 'Component') or (Item_x0020_Type eq 'SubComponent') or (Item_x0020_Type eq 'Feature')"
        )
        .get();
    })
    await Promise.all(AllPortfolios);

    if (AllPortfolios != undefined && AllPortfolios?.length > 0) {
      AllPortfolios?.map((item: any) => {
        item.listId = this.props?.MasterTaskListID;
      });
    }
  }
  private async GetTaskUsers(Type: any) {
    let web: any = ''
    if (filteredData == undefined && filteredData.length == 0) {
      web = new Web(this.props.Context.pageContext.web.absoluteUrl);
    }
    let taskUsers = [];
    let results: any = [];
    // filteredData?.forEach(async (items:any)=>{
    //   web = new Web(items.siteUrl)
    //   results = await web.lists
    //   .getById(items?.TaskUserListID)
    //   .items.select(
    //     "Id",
    //     "IsShowReportPage",
    //     "UserGroupId",
    //     "UserGroup/Id",
    //     "UserGroup/Title",
    //     "Suffix",
    //     "SmartTime",
    //     "Title",
    //     "Email",
    //     "SortOrder",
    //     "Role",
    //     "Company",
    //     "ParentID1",
    //     "TaskStatusNotification",
    //     "Status",
    //     "Item_x0020_Cover",
    //     "AssingedToUserId",
    //     "isDeleted",
    //     "TimeCategory",
    //     "AssingedToUser/Title",
    //     "AssingedToUser/Id",
    //     "AssingedToUser/EMail",
    //     "ItemType",
    //     "Approver/Id",
    //     "Approver/Title",
    //     "Approver/Name"
    //   )
    //   .expand("AssingedToUser,UserGroup,Approver")
    //   .orderBy("SortOrder", true)
    //   .orderBy("Title", true)
    //   .get();
    // AllTaskUser = [...AllTaskUser, ...results];
    // })

    const promises = filteredData?.map(async (items: any) => {
      web = new Web(items.siteUrl);
      results = await web.lists
        .getById(items?.TaskUserListID)
        .items.select(
          "Id",
          "IsShowReportPage",
          "UserGroupId",
          "UserGroup/Id",
          "UserGroup/Title",
          "Suffix",
          "SmartTime",
          "Title",
          "Email",
          "SortOrder",
          "Role",
          "Company",
          "ParentID1",
          "TaskStatusNotification",
          "Status",
          "Item_x0020_Cover",
          "AssingedToUserId",
          "isDeleted",
          "TimeCategory",
          "AssingedToUser/Title",
          "AssingedToUser/Id",
          "AssingedToUser/EMail",
          "ItemType",
          "Approver/Id",
          "Approver/Title",
          "Approver/Name"
        )
        .expand("AssingedToUser,UserGroup,Approver")
        .orderBy("SortOrder", true)
        .orderBy("Title", true)
        .get();
      if (Type == 'checked') {
        AllTaskUser = [...AllTaskUser, ...results];

      }
      else {
        AllTaskUser = results;
      }

      return AllTaskUser;
    });

    // Now use Promise.all to wait for all promises to resolve
    await Promise.all(promises);

    // Code after the loop will execute only after all promises are resolved
    console.log("All tasks loaded:", AllTaskUser);
    const uniqueTaskUser = AllTaskUser.reduce((acc: any, item: any) => {
      if (!acc.some((i: any) => i.Title === item.Title)) {
        acc.push(item);
      }
      return acc;
    }, []);


    for (let index = 0; index < uniqueTaskUser.length; index++) {
      let element = uniqueTaskUser[index];
      if (element.UserGroupId == undefined) {
        this.getChilds(element, uniqueTaskUser);
        taskUsers.push(element);
      }
    }

    // this.GetTimeEntry();


    this.setState({
      taskUsers: taskUsers,
    });
    // if(Type != 'checked'){
    // if (user != undefined && user?.Id != undefined && user?.Id != "") {
    //   await this.DefaultValues();
    // }
    // }
  }
  private GetTimeEntry() {
    this.StartWeekday = new Date().getFullYear().toString() + "/01/01";
    this.endweekday = Moment(new Date()).format("YYYY/MM/DD");
  }
  private getChilds(item: any, items: any) {
    item.childs = [];
    for (let index = 0; index < items.length; index++) {
      let childItem = items[index];
      if (
        childItem.UserGroupId != undefined &&
        parseInt(childItem.UserGroupId) == item.ID
      ) {
        childItem.IsSelected = false;
        item.childs.push(childItem);
        this.getChilds(childItem, items);
      }
    }
  }
  private async LoadAllMetaDataFilter(type: any) {
    let web = new Web(this.props.Context.pageContext.web.absoluteUrl);
    let ccResults: any = [];
    let sitesResult: any = [];
    let results: any = [];
    let className: any = "custom-checkbox-tree";
    // const fetchPromises = filteredData?.forEach(async (items:any)=>{
    //   web = new Web(items.siteUrl);
    //   results = await web.lists
    //   .getById(items?.SmartMetadataListID)
    //   .items.select(
    //     "Id",
    //     "Title",
    //     "IsVisible",
    //     "ParentID",
    //     "Color_x0020_Tag",
    //     "Configurations",
    //     "SmartSuggestions",
    //     "TaxType",
    //     "Description1",
    //     "Item_x005F_x0020_Cover",
    //     "listId",
    //     "siteName",
    //     "siteUrl",
    //     "SortOrder",
    //     "SmartFilters",
    //     "Selectable",
    //     "Parent/Id",
    //     "Parent/Title"
    //   )
    //   .expand("Parent")
    //   .orderBy("SortOrder", true)
    //   .orderBy("Title", true)
    //   .top(4999)
    //   .get();
    // })

    const fetchPromises = filteredData?.map(async (items: any) => {
      const web = new Web(items.siteUrl);
      const results = await web.lists
        .getById(items?.SmartMetadataListID)
        .items.select(
          "Id",
          "Title",
          "IsVisible",
          "ParentID",
          "Color_x0020_Tag",
          "Configurations",
          "SmartSuggestions",
          "TaxType",
          "Description1",
          "Item_x005F_x0020_Cover",
          "listId",
          "siteName",
          "siteUrl",
          "SortOrder",
          "SmartFilters",
          "Selectable",
          "Parent/Id",
          "Parent/Title"
        )
        .expand("Parent")
        .orderBy("SortOrder", true)
        .orderBy("Title", true)
        .top(4999)
        .getAll();
      return results;
    });

    const allResults = await Promise.all(fetchPromises);

    await Promise.all(allResults);
    this.checkBoxColor(className);
    allResults[0]?.forEach(function (obj: any, index: any) {
      if (obj.TaxType == "Client Category") {
        ccResults.push(obj);
      } else if (obj.TaxType == "Sites") {
        sitesResult.push(obj);
      } else if (
        obj.TaxType == "timesheetListConfigrations" &&
        obj.Configurations != undefined &&
        obj.Configurations != ""
      ) {
        let JSONData = globalCommon.parseJSON(obj.Configurations);
        TimeSheetResult = [...TimeSheetResult, ...JSONData]
        //TimeSheetResult = globalCommon.parseJSON(obj.Configurations);
      }
    });
    if (sitesResult.length > 0) {
      sitesResult?.map((site: any) => {
        if (site?.Title != "SP Online" && site?.Title != "SDC Sites") {
          site.ParentID = site?.ParentId
        }
        if (site?.Title != "Master Tasks" && site?.Title != "SDC Sites" && site?.IsVisible == true) {
          siteConfig.push(site);
        }
      });

    }

    if (type !== 'checked' || this.props.Context.pageContext.web.absoluteUrl == '') {
      let startdt = new Date();
      let enddt = new Date();
      let diff, lastday;
      diff = startdt.getDate() - startdt.getDay() + (startdt.getDay() === 0 ? -6 : 1);
      startdt.setDate(diff);
      lastday = enddt.getDate() - (enddt.getDay() - 1) + 6;
      enddt.setDate(lastday);
      startdt.setHours(0, 0, 0, 0);
      enddt.setHours(0, 0, 0, 0);

      this.setState({
        startdate: startdt,
        enddate: enddt,
        SitesConfig: sitesResult,
        AllMetadata: results,
        TimeSheetLists: TimeSheetResult,
        loaded: false
      }, () => {
        this.loadSmartFilters(ccResults, sitesResult);
      });
    }
    else {
      this.setState(
        {
          SitesConfig: sitesResult,
          AllMetadata: results,
          TimeSheetLists: TimeSheetResult,
          loaded: false,
        },
        () => this.loadSmartFilters(ccResults, sitesResult)
      );
    }



    if (QueryStringId != undefined && QueryStringId != "") {
      await this.LoadAllTimeSheetaData();
    }
  }
  private loadSmartFilters(items: any, siteItems: any) {
    for (let index = 0; index < items.length; index++) {
      let filterItem = items[index];
      if (
        filterItem.SmartFilters != undefined &&
        filterItem.SmartFilters.indexOf("Dashboard") > -1
      ) {
        let item: any = {};
        item.ID = filterItem.Id;
        item.Title = filterItem.Title;
        item.value = filterItem.Id;
        item.label = filterItem.Title;
        item.Group = filterItem.TaxType;
        item.TaxType = filterItem.TaxType;
        if (filterItem.ParentID == 0) {
          if (!this.IsExistsData(filterItems, item)) filterItems.push(item);
          this.getChildsOfFilter(item, items);
          if (item.children != undefined && item.children.length > 0) {
            for (let j = 0; j < item.children.length; j++) {
              let obj = item.children[j];
              if (obj.Title == "Blank") obj.ParentTitle = item.Title;
            }
          }
          if (
            filterGroups.length == 0 ||
            filterGroups.indexOf(filterItem.TaxType) == -1
          ) {
            filterGroups.push(filterItem.TaxType);
          }
        }
      }
    }
    for (let index = 0; index < siteItems.length; index++) {
      let filterItem = siteItems[index];
      if (
        filterItem.SmartFilters != undefined &&
        filterItem.SmartFilters.indexOf("Dashboard") > -1
      ) {
        let item: any = {};
        item.ID = filterItem.Id;
        item.Title = filterItem.Title;
        item.value = filterItem.Id;
        item.label = filterItem.Title;
        item.Group = filterItem.TaxType;
        item.TaxType = filterItem.TaxType;
        if (filterItem.ParentID == 0) {
          if (!this.IsExistsData(filterSites, item)) filterSites.push(item);
          this.getChildsOfFilter(item, siteItems);
          if (item.children != undefined && item.children.length > 0) {
            for (let j = 0; j < item.children.length; j++) {
              let obj = item.children[j];
              if (obj.Title == "Blank") obj.ParentTitle = item.Title;
            }
          }
        }
      }
    }
    //filterItems = [...filterItems,...filterItems]
    filterItems = filterItems.filter((type: any) => type.Title != "Other");
    filterItems.forEach((filterItem: any) => {
      filterItem.ParentTitle = filterItem.Title;
      if (filterItem.ParentTitle == "DA E+E")
        filterItem.ParentTitle = "ALAKDigital";
      if (filterItem.children != undefined && filterItem.children.length > 0) {
        filterItem.children.forEach((child: any) => {
          child.ParentTitle = filterItem.Title;
          if (child.ParentTitle == "DA E+E") child.ParentTitle = "ALAKDigital";
          if (child.children != undefined && child.children.length > 0) {
            child.children.forEach((subchild: any) => {
              subchild.ParentTitle = filterItem.Title;
              if (subchild.ParentTitle == "DA E+E")
                subchild.ParentTitle = "ALAKDigital";
            });
          }
        });
      }
    });
    const filterSitesss = filterSites.map((item: any) => ({
      ID: item.ID,
      value: item.value,
      label: item.label,
      Title: item.label,
      TaxType: item?.TaxType,
      Group: item?.Group,
      IsVisible: item.IsVisible,
      children: item.children ? item.children.map((child: any) => ({
        ID: child.ID,
        value: child.value,
        label: child.label,
        IsVisible: child.IsVisible,
        Title: child.label,
        TaxType: child.TaxType,
        Group: child.Group,
      })) : []
    }));
    const filterItemss = filterItems.map((item: any) => ({
      ID: item.ID,
      value: item.value,
      label: item.label,
      Title: item.label,
      TaxType: item?.TaxType,
      Group: item?.Group,
      IsVisible: item.IsVisible,
      children: item.children ? item.children.map((child: any) => ({
        ID: child.ID,
        value: child.value,
        label: child.label,
        IsVisible: child.IsVisible,
        Title: child.label,
        TaxType: child.TaxType,
        Group: child.Group,
      })) : []
    }));
    filterItems = this.removeDuplicates(filterItemss);
    filterSites = this.removeDuplicates(filterSitesss);
    this.setState({ filterItems, filterSites });
  }
  private SelectAllCategories(ev: any) {
    let filterItem = this.state.filterItems;
    let checked: any = [];
    let select = ev.currentTarget.checked;
    if (select) {
      if (filterItem != undefined && filterItem.length > 0) {
        filterItem.forEach((child: any) => {
          child.isExpand = false;
          checked.push(child.ID);
          if (child.children != undefined && child.children.length > 0) {
            child.children.forEach((subchild: any) => {
              checked.push(subchild.Id);
              if (
                subchild.children != undefined &&
                subchild.children.length > 0
              ) {
                subchild.children.forEach((subchild2: any) => {
                  checked.push(subchild2.Id);
                  if (
                    subchild2.children != undefined &&
                    subchild2.children.length > 0
                  ) {
                    subchild2.children.forEach((subchild3: any) => {
                      checked.push(subchild3.Id);
                    });
                  }
                });
              }
            });
          }
        });
      }
    } else {
    }
    this.setState({ checked, checkedAll: select });
  }
  private SelectAllSits(ev: any) {
    let filterItem = this.state.filterSites;
    let checked: any = [];
    let select = ev.currentTarget.checked;
    if (select) {
      if (filterItem != undefined && filterItem.length > 0) {
        filterItem.forEach((child: any) => {
          checked.push(child.ID);
          if (child.children != undefined && child.children.length > 0) {
            child.children.forEach((subchild: any) => {
              checked.push(subchild.Id);
              if (
                subchild.children != undefined &&
                subchild.children.length > 0
              ) {
                subchild.children.forEach((subchild2: any) => {
                  checked.push(subchild2.Id);
                  if (
                    subchild2.children != undefined &&
                    subchild2.children.length > 0
                  ) {
                    subchild2.children.forEach((subchild3: any) => {
                      checked.push(subchild3.Id);
                    });
                  }
                });
              }
            });
          }
        });
      }
    } else {
    }
    this.setState({ checkedSites: checked, checkedAllSites: select });
  }
  private IsExistsData(array: any, Id: any) {
    let isExists = false;
    for (let index = 0; index < array.length; index++) {
      let item = array[index];
      if (item.Id == Id) {
        isExists = true;
        return false;
      }
    }
    return isExists;
  }
  private getChildsOfFilter(item: any, items: any) {
    item.children = [];
    for (let index = 0; index < items.length; index++) {
      let childItem = items[index];
      childItem.value = items[index].Id;
      childItem.label = items[index].Title;
      if (
        childItem.ParentID != undefined &&
        parseInt(childItem.ParentID) == item.ID
      ) {
        item.children.push(childItem);
        this.getChildsOfFilter(childItem, items);
      }
    }
    if (item.children == undefined || item.children.length === 0)
      delete item.children;
  }
  private SelectAllGroupMember(ev: any) {
    let SelectGroupName = "";
    let select = ev.currentTarget.checked;
    let ImageSelectedUsers = this.state.ImageSelectedUsers;
    if (select == true) {
      this.state.taskUsers.forEach((item: any) => {
        if (item.childs != undefined && item.childs.length > 0) {
          item.SelectedGroup = select;
          for (let index = 0; index < item.childs.length; index++) {
            let child = item.childs[index];
            child.IsSelected = true;
            try {
              document
                .getElementById("UserImg" + child.Id)
                .classList.add("seclected-Image");
              if (
                child.Id != undefined &&
                !this.isItemExists(ImageSelectedUsers, child.Id)
              )
                ImageSelectedUsers.push(child);
            } catch (error) { }
          }
        }
      });
    } else if (select == false) {
      this.state.taskUsers.forEach((item: any) => {
        if (item.childs != undefined && item.childs.length > 0) {
          item.SelectedGroup = select;
          item.childs.forEach((child: any) => {
            child.IsSelected = false;
            try {
              document
                .getElementById("UserImg" + child.Id)
                .classList.remove("seclected-Image");
              for (let k = 0; k < ImageSelectedUsers.length; k++) {
                let el = ImageSelectedUsers[k];
                if (el.Id == child.Id) ImageSelectedUsers.splice(k, 1);
              }
            } catch (error) { }
          });
        }
      });
    }
    this.state.taskUsers.forEach((item: any) => {
      if (item.SelectedGroup == true)
        SelectGroupName = SelectGroupName + item.Title + " ,";
    });
    SelectGroupName = SelectGroupName.replace(/.$/, "");
    this.setState({ ImageSelectedUsers, SelectGroupName });
  }
  private SelectUserImage(ev: any, item: any) {
    let SelectGroupName = "";
    let ImageSelectedUsers = this.state.ImageSelectedUsers;
    const collection = document.getElementsByClassName("AssignUserPhoto mr-5");
    for (let i = 0; i < collection.length; i++) {
      collection[i]?.classList.remove("seclected-Image");
    }
    if (ev.currentTarget.className.indexOf("seclected-Image") > -1) {
      ev.currentTarget.classList.remove("seclected-Image");
      document
        .getElementById("UserImg" + item.Id)
        .classList.remove("activeimg");
      item.IsSelected = false;
      for (let index = 0; index < ImageSelectedUsers.length; index++) {
        let sel = ImageSelectedUsers[index];
        if (sel.Id != undefined && item.Id != undefined && sel.Id == item.Id) {
          item.IsSelected = false;
          ImageSelectedUsers.splice(index, true);
          break;
        }
      }
    } else {
      ev.currentTarget.classList.add("seclected-Image"); //add element
      document.getElementById("UserImg" + item.Id).classList.add("activeimg");
      item.IsSelected = true;
      if (ImageSelectedUsers == undefined) ImageSelectedUsers = [];
      ImageSelectedUsers.push(item);
    }
    this.state.taskUsers.forEach((item: any) => {
      if (item.SelectedGroup == true)
        SelectGroupName = SelectGroupName + item.Title + " ,";
    });
    SelectGroupName = SelectGroupName.replace(/.$/, "");
    this.setState({
      ImageSelectedUsers,
      SelectGroupName,
    });
  }
  private SelectedGroup(ev: any, user: any) {
    let SelectGroupName = "";
    let ImageSelectedUsers = this.state.ImageSelectedUsers;
    let selected = ev.currentTarget.checked;
    if (selected) {
      for (let index = 0; index < this.state.taskUsers.length; index++) {
        let item = this.state.taskUsers[index];
        if (
          item.Title == user.Title &&
          item.childs != undefined &&
          item.childs.length > 0
        ) {
          item.SelectedGroup = selected;
          for (let j = 0; j < item.childs.length; j++) {
            let child = item.childs[j];
            child.IsSelected = true;
            document
              .getElementById("UserImg" + child.Id)
              .classList.add("seclected-Image");
            if (
              child.Id != undefined &&
              !this.isItemExists(this.state.ImageSelectedUsers, child.Id)
            )
              ImageSelectedUsers.push(child);
          }
        }
      }
    } else {
      for (let index = 0; index < this.state.taskUsers.length; index++) {
        let item = this.state.taskUsers[index];
        if (
          item.Title == user.Title &&
          item.childs != undefined &&
          item.childs.length > 0
        ) {
          item.SelectedGroup = selected;
          item.childs.forEach((child: any) => {
            child.IsSelected = false;
            document
              .getElementById("UserImg" + child.Id)
              .classList.remove("seclected-Image");
            for (let k = 0; k < ImageSelectedUsers.length; k++) {
              let el = ImageSelectedUsers[k];
              if (el.Id == child.Id) ImageSelectedUsers.splice(k, 1);
            }
          });
        }
      }
    }
    this.state.taskUsers.forEach((item: any) => {
      if (item.SelectedGroup == true)
        SelectGroupName = SelectGroupName + item.Title + " ,";
    });
    SelectGroupName = SelectGroupName.replace(/.$/, "");
    this.setState({ ImageSelectedUsers, SelectGroupName });
  }
  private isItemExists(array: any, items: any) {
    let isExists = false;
    for (let index = 0; index < array.length; index++) {
      let item = array[index];
      if (item.TaskItemID == items.TaskItemID) {
        if (
          item.Effort != undefined &&
          items.Effort != undefined &&
          item.Effort == items.Effort
        ) {
          isExists = true;
          return false;
        }
      }
    }
    return isExists;
  }
  private isTaskItemExists(array: any, items: any) {
    let isExists = false;
    for (let index = 0; index < array.length; index++) {
      let item = array[index];
      if (
        item.TaskItemID == items.TaskItemID &&
        item?.siteType.toLowerCase() == items?.siteType.toLowerCase()
      ) {
        isExists = true;
        break;
      }
    }
    return isExists;
  }
  private ChangeRadiobtn() {
    let RadioType = "";
    let startdt = new Date(),
      enddt = new Date(),
      tempdt = new Date();
    let diff: number, lastday: number;
    startdt.setHours(0, 0, 0, 0);
    enddt.setHours(0, 0, 0, 0);
    this.state.startdate.setHours(0, 0, 0, 0);
    this.state.enddate.setHours(0, 0, 0, 0);
    if (
      this.state.startdate.getTime() == startdt.getTime() &&
      this.state.enddate.getTime() == enddt.getTime()
    ) {
      RadioType = "today";
    }
    startdt.setDate(startdt.getDate() - 1);
    enddt.setDate(enddt.getDate() - 1);
    if (
      this.state.startdate.getTime() == startdt.getTime() &&
      this.state.enddate.getTime() == enddt.getTime()
    ) {
      RadioType = "yesterday";
    }
    diff =
      startdt.getDate() - startdt.getDay() + (startdt.getDay() === 0 ? -6 : 1);
    startdt = new Date(startdt.setDate(diff));
    lastday = enddt.getDate() - (enddt.getDay() - 1) + 6;
    enddt = new Date(enddt.setDate(lastday));
    if (
      this.state.startdate.getTime() == startdt.getTime() &&
      this.state.enddate.getTime() == enddt.getTime()
    ) {
      RadioType = "ThisWeek";
    }
    tempdt = new Date();
    tempdt = new Date(
      tempdt.getFullYear(),
      tempdt.getMonth(),
      tempdt.getDate() - 7
    );
    diff =
      tempdt.getDate() - tempdt.getDay() + (tempdt.getDay() === 0 ? -6 : 1);
    startdt = new Date(tempdt.setDate(diff));
    lastday = tempdt.getDate() - (tempdt.getDay() - 1) + 6;
    enddt = new Date(tempdt.setDate(lastday));
    if (
      this.state.startdate.getTime() == startdt.getTime() &&
      this.state.enddate.getTime() == enddt.getTime()
    ) {
      RadioType = "LastWeek";
    }
    startdt = new Date(startdt.getFullYear(), startdt.getMonth(), 1);
    enddt = new Date(enddt.getFullYear(), enddt.getMonth() + 1, 0);
    if (
      this.state.startdate.getTime() == startdt.getTime() &&
      this.state.enddate.getTime() == enddt.getTime()
    ) {
      RadioType = "EntrieMonth";
    }
    startdt = new Date(startdt.getFullYear(), startdt.getMonth() - 1);
    enddt = new Date(enddt.getFullYear(), enddt.getMonth(), 0);
    if (
      this.state.startdate.getTime() == startdt.getTime() &&
      this.state.enddate.getTime() == enddt.getTime()
    ) {
      RadioType = "LastMonth";
    }
    startdt = new Date();
    startdt.setMonth(startdt.getMonth() - 3);
    startdt.setDate(1);
    enddt = new Date(enddt.getFullYear(), enddt.getMonth(), 0);
    console.log("Start Date:", startdt.toLocaleDateString());
    console.log("End Date:", enddt.toLocaleDateString());
    if (
      this.state.startdate.getTime() == startdt.getTime() &&
      this.state.enddate.getTime() == enddt.getTime()
    ) {
      RadioType = "Last3Month";
    }
    startdt = new Date(new Date().getFullYear(), 0, 1);
    enddt = new Date(new Date().getFullYear(), 11, 31);
    if (
      this.state.startdate.getTime() == startdt.getTime() &&
      this.state.enddate.getTime() == enddt.getTime()
    ) {
      RadioType = "EntrieYear";
    }
    startdt = new Date(new Date().getFullYear() - 1, 0, 1);
    enddt = new Date(new Date().getFullYear() - 1, 11, 31);
    if (
      this.state.startdate.getTime() == startdt.getTime() &&
      this.state.enddate.getTime() == enddt.getTime()
    ) {
      RadioType = "LastYear";
    }
    startdt = new Date("2017/01/01");
    enddt = new Date();
    if (
      this.state.startdate.getTime() == startdt.getTime() &&
      this.state.enddate.getTime() == enddt.getTime()
    ) {
      RadioType = "AllTime";
    }
    startdt = new Date(this.state?.PresetStartDate);
    enddt = new Date(this.state?.PresetEndDate);
    if (RadioType == "") {
      DateType = "Custom";
    }
    if (
      this.state.startdate.getTime() == startdt.getTime() &&
      this.state.enddate.getTime() == enddt.getTime()
    ) {
      RadioType = "Presettime";
    }
    this.setState({
      selectedRadio: RadioType,
    });
  }
  private setStartDate(dt: any) {
    this.setState({
      startdate: dt,
    });
    setTimeout(() => {
      this.ChangeRadiobtn();
    }, 700);
    this.ChangeRadiobtn();
  }
  private setEndDate(dt: any) {
    this.setState({
      enddate: dt,
    });
    setTimeout(() => {
      this.ChangeRadiobtn();
    }, 700);
  }
  private async OpenPresetDatePopup() {
    this.setState({
      IsPresetPopup: true,
    });
  }
  private selectDate(type: string) {
    let startdt = new Date(),
      enddt = new Date(),
      tempdt = new Date();
    let diff: number, lastday: number;
    switch (type) {
      case "Custom":
        DateType = "Custom";
        this.setState({ showShareTimesheet: true });
        this.setState({ showShareTimesheet: false });
        break;

      case "today":
        DateType = "Today";
        this.setState({ showShareTimesheet: true });
        break;

      case "yesterday":
        DateType = "Yesterday";
        this.setState({ showShareTimesheet: true });
        startdt.setDate(startdt.getDate() - 1);
        enddt.setDate(enddt.getDate() - 1);
        break;

      case "ThisWeek":
        DateType = "This Week";
        this.setState({ showShareTimesheet: true });
        diff =
          startdt.getDate() -
          startdt.getDay() +
          (startdt.getDay() === 0 ? -6 : 1);
        startdt = new Date(startdt.setDate(diff));
        lastday = enddt.getDate() - (enddt.getDay() - 1) + 6;
        enddt = new Date(enddt.setDate(lastday));
        break;

      case "LastWeek":
        DateType = "Last Week";
        this.setState({ showShareTimesheet: true });
        tempdt = new Date();
        tempdt = new Date(
          tempdt.getFullYear(),
          tempdt.getMonth(),
          tempdt.getDate() - 7
        );

        diff =
          tempdt.getDate() - tempdt.getDay() + (tempdt.getDay() === 0 ? -6 : 1);
        startdt = new Date(tempdt.setDate(diff));

        lastday = tempdt.getDate() - (tempdt.getDay() - 1) + 6;
        enddt = new Date(tempdt.setDate(lastday));
        break;

      case "EntrieMonth":
        DateType = "This Month";
        this.setState({ showShareTimesheet: true });
        startdt = new Date(startdt.getFullYear(), startdt.getMonth(), 1);
        enddt = new Date(enddt.getFullYear(), enddt.getMonth() + 1, 0);
        break;

      case "LastMonth":
        DateType = "Last Month";
        this.setState({ showShareTimesheet: true });
        startdt = new Date(startdt.getFullYear(), startdt.getMonth() - 1);
        enddt = new Date(enddt.getFullYear(), enddt.getMonth(), 0);
        break;

      case "Last3Month":
        DateType = "Last 3 Month";
        this.setState({ showShareTimesheet: true });
        startdt = new Date();
        startdt.setMonth(startdt.getMonth() - 3);
        startdt.setDate(1);
        enddt = new Date(enddt.getFullYear(), enddt.getMonth(), 0);
        console.log("Start Date:", startdt.toLocaleDateString());
        console.log("End Date:", enddt.toLocaleDateString());
        break;

      case "EntrieYear":
        DateType = "This Year";
        this.setState({ showShareTimesheet: true });
        startdt = new Date(new Date().getFullYear(), 0, 1);
        enddt = new Date(new Date().getFullYear(), 11, 31);
        break;

      case "LastYear":
        DateType = "Last Year";
        this.setState({ showShareTimesheet: true });
        startdt = new Date(new Date().getFullYear() - 1, 0, 1);
        enddt = new Date(new Date().getFullYear() - 1, 11, 31);
        break;

      case "AllTime":
        DateType = "AllTime";
        this.setState({ showShareTimesheet: true });
        startdt = new Date("2017/01/01");
        enddt = new Date();
        break;

      case "Presettime":
        startdt = new Date(this.state?.PresetStartDate);
        enddt = new Date(this.state?.PresetEndDate);
        break;
    }
    startdt.setHours(0, 0, 0, 0);
    enddt.setHours(0, 0, 0, 0);
    //let StartDate: any
    //StartDate = Moment(startdt).format("YYYY/MM/DD");
    //let EndDate: any
    // EndDate = Moment(enddt).format("YYYY/MM/DD");
    this.setState({
      selectedRadio: type,
      startdate: startdt,
      enddate: enddt,
    });
  }
  private updatefilter(IsLoader: any) {
    TotlaTime = 0.00
    TotalleaveHours = 0.00;
    ManagementTime = 0.00;
    QATime = 0.00;
    QAMembers = 0;
    DesignMembers = 0;
    DesignTime = 0;
    TotleTaskTime = 0;
    DevelopmentMembers = 0;
    managementMembers = 0;
    TotalQAMember = 0;
    TotalDesignMember = 0;
    TotalDevelopmentMember = 0;
    DevloperTime = 0.00;
    QAleaveHours = 0;
    DevelopmentleaveHours = 0;
    managementleaveHours = 0;
    DesignMemberleaveHours = 0;
    startDate = ''
    DevCount = 0;
    ManagementCount = 0;
    Trainee = 0;
    DesignCount = 0;
    QACount = 0;
    TranineesNum = 0;
    this.setState({ disableProperty: true });
    if (
      this.state.ImageSelectedUsers == undefined ||
      this.state.ImageSelectedUsers.length == 0
    ) {
      alert("Please Select User");
      this.setState({
        loaded: false,
      });
      return false;
    } else {
      if (IsLoader == true) {
        this.setState({
          loaded: true,
        });
      }
      this.generateTimeEntry();
    }
  }
  private getStartingDate(startDateOf: any) {
    const startingDate = new Date();
    let formattedDate = startingDate;
    if (startDateOf == "This Week") {
      startingDate.setDate(startingDate.getDate() - startingDate.getDay());
      formattedDate = startingDate;
    } else if (startDateOf == "Today") {
      formattedDate = startingDate;
    } else if (startDateOf == "Yesterday") {
      startingDate.setDate(startingDate.getDate() - 1);
      formattedDate = startingDate;
    } else if (startDateOf == "This Month") {
      startingDate.setDate(1);
      formattedDate = startingDate;
    } else if (startDateOf == "Last Month") {
      const lastMonth = new Date(
        startingDate.getFullYear(),
        startingDate.getMonth() - 1
      );
      const startingDateOfLastMonth = new Date(
        lastMonth.getFullYear(),
        lastMonth.getMonth(),
        1
      );
      var change = Moment(startingDateOfLastMonth).add(42, "days").format();
      var b = new Date(change);
      formattedDate = b;
    } else if (startDateOf == "Last Week") {
      const lastWeek = new Date(
        startingDate.getFullYear(),
        startingDate.getMonth(),
        startingDate.getDate() - 7
      );
      const startingDateOfLastWeek = new Date(
        lastWeek.getFullYear(),
        lastWeek.getMonth(),
        lastWeek.getDate() - lastWeek.getDay() + 1
      );
      formattedDate = startingDateOfLastWeek;
    }

    return formattedDate;
  }

  private async LoadAllTimeSheetaData() {
    // const uniqueTimeSheetLists = this.state.TimeSheetLists.filter((value:any, index:any, self:any) =>
    //   index === self.findIndex((t:any) => (
    //     t.siteType === value.siteType
    //   ))
    // );
    let AllTimeEntry: any = [];
    let arraycount = 0;
    this.setState({
      loaded: true,
    });
    if (
      DateType == "Today" ||
      DateType == "Yesterday" ||
      DateType == "This Week" ||
      DateType == "Last Week"
    ) {
      this.setState({ showShareTimesheet: true });
      let startDatess = this.getStartingDate(DateType).toISOString();
      const date = new Date(startDatess);
      date.setDate(date.getDate() - 2);
      let startDate = date.toISOString();

      try {
        if (
          this.state.TimeSheetLists != undefined &&
          this.state.TimeSheetLists.length > 0
        ) {
          this.state.TimeSheetLists?.map(async (site: any) => {
            let web = new Web(site?.siteUrl);
            let TimeEntry = [];
            await web.lists
              .getById(site?.listId)
              .items.select(site?.query)
              .filter(
                `(Modified ge '${startDate}') and (TimesheetTitle/Id ne null)`
              )
              .getAll()
              .then((data: any) => {
                TimeEntry = data;
                console.log(data);
                TimeEntry.map((entry: any) => {
                  AllTimeEntry.push(entry);
                });
                arraycount++;
              });
            let currentCount = this.state.TimeSheetLists?.length;
            if (arraycount === currentCount) {
              AllTimeSheetResult = AllTimeEntry;
              this.LoadAllSiteAllTasks();
              this.updatefilter(true);
            }
          });
        }

        // else{
        //   if (this?.state?.TimeSheetLists != undefined && this?.state?.TimeSheetLists.length > 0) {
        //     this?.state?.TimeSheetLists.map(async (site: any) => {
        //       let web = new Web(site?.siteUrl);
        //       let TimeEntry = []
        //       await web.lists.getById(site?.listId).items.select(site?.query).getAll()
        //       .then((data: any) => {
        //         TimeEntry = data
        //         console.log(data);
        //         TimeEntry.map((entry: any) => {
        //           AllTimeEntry.push(entry)
        //         });
        //         arraycount++;
        //       })
        //       let currentCount = this?.state?.TimeSheetLists?.length;
        //       if (arraycount === currentCount) {
        //         AllTimeSheetResult = AllTimeEntry;
        //         this.LoadAllSiteAllTasks()
        //         this.updatefilter(true);

        //       }
        //     })
        //   }
        // }
      } catch (e) {
        console.log(e);
      }
      // this.updatefilter(true);
    } else {
      this.reRender();
      this.forceUpdate();
      AllTimeSheetResult = [];
      if (
        this?.state?.TimeSheetLists != undefined &&
        this?.state?.TimeSheetLists.length > 0
      ) {
        this?.state?.TimeSheetLists.map(async (site: any) => {
          let web = new Web(site?.siteUrl);
          let TimeEntry = [];
          await web.lists
            .getById(site?.listId)
            .items.select(site?.query)
            .getAll()
            .then((data: any) => {
              TimeEntry = data;
              console.log(data);
              TimeEntry.map((entry: any) => {
                AllTimeEntry.push(entry);
              });
              arraycount++;
            });
          let currentCount = this?.state?.TimeSheetLists?.length;
          if (arraycount === currentCount) {
            AllTimeSheetResult = AllTimeEntry;
            this.updatefilter(true);
            this.LoadAllSiteAllTasks();
          }
        });
      }
    }
  }
  private reRender = () => {
    this.setState({
      loaded: true,
    });
    return <>{this.state.loaded && <PageLoader />}</>;
  };
  private CallBack = () => {
    //setIsOpenTimeSheetPopup(false)
    this.setState({
      IsOpenTimeSheetPopup: false,
    });
  };
  private showGraph = (tileName: any) => {
    if (this.state.AllTimeEntry.length > 0) {
      if (DateType == "Custom") {
        let start = Moment(this.state.startdate).format("DD/MM/YYYY");
        let end = Moment(this.state.enddate).format("DD/MM/YYYY");
        DateType = `${start} - ${end}`;
      }
      this.setState({
        IsOpenTimeSheetPopup: true,
      });
    }
    else {
      alert('Please click update filter button')
    }

  };
  private async generateTimeEntry() {
    let FilterTimeEntry: any[] = [];
    let ImageSelectedUsers = this.state.ImageSelectedUsers;
    if (AllTimeSheetResult != undefined && AllTimeSheetResult?.length > 0)
      FilterTimeEntry = AllTimeSheetResult.filter((item) =>
        ImageSelectedUsers.find(
          (items: any) => item.AuthorId == items.AssingedToUserId
        )
      );
    totalTimedata = FilterTimeEntry;
    this.LoadTimeSheetData(FilterTimeEntry);
  }
  private findUserByName = (name: any) => {
    const user = AllTaskUser.filter(
      (user: any) => user?.AssingedToUser?.Id === name
    );
    let Image: any;
    if (user[0]?.Item_x0020_Cover != undefined) {
      Image = user[0].Item_x0020_Cover.Url;
    } else {
      Image = "/sites/HHHH/PublishingImages/Portraits/icon_user.jpg";
    }
    return user ? Image : null;
  };
  private LoadTimeSheetData(AllTimeSheetResult: any) {
    // if (user != undefined && user?.Id != undefined && user?.Id != "") {
    //    this.DefaultValues();
    // }
    let AllTimeSpentDetails: any = [];
    let getAllTimeEntry = [];
    let getSites = siteConfig;
    let countered = 0;
    AllTimeSheetResult.forEach(function (timeTab: any) {
      let ColumnName = ''
      for (let i = 0; i < getSites.length; i++) {
        let config = getSites[i];
        if (config.Title != undefined && config.Title.toLowerCase() == "offshore tasks") {
          config.Title = "Offshore Tasks";
          ColumnName = "Task" + config.Title.replace(" ", "");
        }
        ColumnName = "Task" + config.Title.replace(" ", "");

        if (
          timeTab[ColumnName] != undefined &&
          timeTab[ColumnName].Title != undefined
        ) {
          timeTab.selectedSiteType = config.Title;
          timeTab.siteType = config.Title;
          timeTab.newSiteUrl = config?.siteUrl?.Url;
          timeTab.SiteUrl = timeTab.newSiteUrl;
          timeTab.SiteIcon = config?.Item_x005F_x0020_Cover?.Url;
          timeTab.listId = config?.listId;
          timeTab.Site = config.Title;
          timeTab.ImageUrl = config.ImageUrl;
          timeTab.TaskItemID = timeTab[ColumnName].Id;
          timeTab.DisplayTaskId = timeTab[ColumnName].DisplayTaskId;
          timeTab.TaskType = timeTab[ColumnName]?.TaskType;
          timeTab.ParentTask = timeTab[ColumnName]?.ParentTask;
          timeTab.TaskTitle = timeTab[ColumnName].Title;
          timeTab.TaskCreated = timeTab[ColumnName].Created;
          timeTab.NewTimeEntryDate = timeTab[ColumnName].TaskDate;
          timeTab.uniqueTimeEntryID = countered;
          AllTimeSpentDetails.push(timeTab);
        }
      }
      countered++;
    });
    const ids = AllTimeSpentDetails.map(
      (o: { uniqueTimeEntryID: any }) => o.uniqueTimeEntryID
    );
    AllTimeSpentDetails = AllTimeSpentDetails.filter(
      ({ uniqueTimeEntryID }: any, index: number) =>
        !ids.includes(uniqueTimeEntryID, index + 1)
    );

    for (let i = 0; i < AllTimeSpentDetails?.length; i++) {
      let time = AllTimeSpentDetails[i];
      time.MileageJson = 0;
      let totletimeparent = 0;
      if (time.AdditionalTimeEntry != undefined) {
        let Additionaltimeentry = JSON.parse(time?.AdditionalTimeEntry);
        if (
          Additionaltimeentry != undefined &&
          Additionaltimeentry.length > 0
        ) {
          let TimeTaskId = 0;
          let sortArray = Additionaltimeentry;
          this.DynamicSortitems(sortArray, "ID", "Number", "Descending");
          TimeTaskId = sortArray[0].ID;
          TimeTaskId = TimeTaskId + 1;
          sortArray.forEach(function (first: { ID: any }, index: any) {
            let count = 0;
            Additionaltimeentry.forEach(function (
              second: { ID: number; TimeEntryId: number },
              TimeEntryIndex: any
            ) {
              if (second.ID != 0 && second.ID == undefined) {
                second.TimeEntryId = TimeTaskId + i + TimeEntryIndex;
                TimeTaskId = TimeTaskId + 1;
              } else if (second.ID != undefined && first.ID == second.ID) {
                if (count != 0) {
                  second.TimeEntryId = TimeTaskId + i + TimeEntryIndex;
                  TimeTaskId = TimeTaskId + 1;
                }
                second.TimeEntryId = second.ID + i + TimeEntryIndex;
                count++;
              }
            });
          });
        }
        for (let index = 0; index < Additionaltimeentry.length; index++) {
          let addtime = Additionaltimeentry[index];
          if (addtime.TaskDate != undefined) {
            let TaskDateConvert = addtime.TaskDate.split("/");
            let TaskDate = new Date(
              TaskDateConvert[2] +
              "/" +
              TaskDateConvert[1] +
              "/" +
              TaskDateConvert[0]
            );
            if (
              this.state?.ImageSelectedUsers != undefined &&
              this.state?.ImageSelectedUsers?.length > 0
            ) {
              for (
                let userIndex = 0;
                userIndex < this.state.ImageSelectedUsers?.length;
                userIndex++
              ) {
                let StartDate = this.state.startdate;
                let enddate = this.state.enddate;
                if (
                  Additionaltimeentry[index]?.AuthorId != undefined &&
                  TaskDate >= StartDate &&
                  TaskDate <= enddate &&
                  Additionaltimeentry[index]?.AuthorId ==
                  this.state?.ImageSelectedUsers[userIndex]?.AssingedToUserId
                ) {
                  let hours = addtime.TaskTime;
                  let minutes = hours * 60;
                  addtime.TaskItemID = time.TaskItemID;
                  addtime.DisplayTaskId = time.DisplayTaskId;
                  addtime.TaskType = time?.TaskType;
                  addtime.ParentTask = time?.ParentTask;
                  addtime.SiteUrl = time.SiteUrl;
                  totletimeparent = minutes;
                  addtime.MileageJson = totletimeparent;
                  addtime.getUserName = "";
                  addtime.Effort = parseInt(addtime.MileageJson) / 60;
                  addtime.Effort = addtime.Effort.toFixed(2);
                  addtime.DispEffort = addtime.Effort;
                  addtime.Effort = parseFloat(addtime.Effort);
                  addtime.TimeEntryDate = addtime.TaskDate;
                  addtime.TimeStatus = addtime?.Status
                  addtime.NewTimeEntryDate = TaskDate;
                  let datesplite = addtime.TaskDate.split("/");
                  addtime.TimeEntrykDateNew = new Date(
                    parseInt(datesplite[2], 10),
                    parseInt(datesplite[1], 10) - 1,
                    parseInt(datesplite[0], 10)
                  );
                  const maxTitleLength: number = 70;
                  if (
                    addtime["Description"] != undefined &&
                    addtime["Description"].length > maxTitleLength
                  )
                    addtime.truncatedTitle =
                      addtime["Description"].substring(0, maxTitleLength - 3) +
                      "...";
                  addtime.TaskTitle = time.TaskTitle;
                  addtime.ID = time.ID;
                  addtime.Title = time.Title;
                  addtime.Status = time.Status;
                  addtime.selectedSiteType = time.selectedSiteType;
                  addtime.siteType = time.siteType;
                  addtime.Site = time?.siteType;
                  addtime.SiteIcon = time?.SiteIcon;
                  addtime.ImageUrl = time.ImageUrl;
                  if (time.TaskCreated != undefined)
                    addtime.TaskCreatednew = this.ConvertLocalTOServerDate(
                      time.TaskCreated,
                      "DD/MM/YYYY"
                    );
                  if (addtime.AuthorId)
                    addtime.autherImage = this.findUserByName(addtime.AuthorId);
                  addtime.Author = {};
                  addtime.Author.Id = addtime.AuthorId;
                  addtime.Author.autherImage = addtime.autherImage;
                  addtime.Author.Title = addtime.AuthorName;
                  getAllTimeEntry.push(addtime);
                }
              }
            }
          }
        }
      }
    }
    getAllTimeEntry?.forEach(function (item: any, index: any) {
      item.TimeEntryId = index;
    });
    AllTimeSheetResult = [];
    this.getJSONTimeEntry(getAllTimeEntry);
    if (getAllTimeEntry == undefined || getAllTimeEntry?.length == 0) {
      this.setState({
        AllTimeEntry: getAllTimeEntry,
      });
    }
  }
  private getJSONTimeEntry(getAllTimeEntry: any) {
    let filterItemTimeTab = [];
    let copysitesConfi = siteConfig
    copysitesConfi.forEach(function (confi: any) {
      confi.CopyTitle = confi.Title;
      if (
        confi.Title != undefined &&
        confi.Title.toLowerCase() == "offshore tasks"
      )
        confi.Title = confi.Title.replace(" ", " ");
      confi["Sitee" + confi.Title] = "filter=";
    });
    copysitesConfi.forEach(function (confi: any) {
      getAllTimeEntry.forEach(function (tab: any) {
        if (tab.siteType == confi.Title)
          if (
            confi["Sitee" + confi.Title].indexOf(
              "(Id eq " + tab.TaskItemID + ")"
            ) < 0
          )
            confi["Sitee" + confi.Title] += "(Id eq " + tab.TaskItemID + ") or";
      });
    });
    for (let index = 0; index < copysitesConfi.length; index++) {
      let confi = copysitesConfi[index];
      if (confi["Sitee" + confi.Title].length > 7) {
        let objgre = {
          ListName: confi.CopyTitle,
          siteUrl: confi.siteUrl?.Url,
          ListId: confi.listId,
          Query: this.SpiltQueryString(
            confi["Sitee" + confi.Title].slice(
              0,
              confi["Sitee" + confi.Title].length - 2
            )
          ),
        };
        filterItemTimeTab.push(objgre);
      }
    }
    this.GetAllSiteTaskData(filterItemTimeTab, getAllTimeEntry);

  }

  private SpiltQueryString(selectedquery: any) {
    let queryfrist = "";
    let Querystringsplit = selectedquery.split("or");
    let countIn = 0;
    let querystringSplit1 = [];
    Querystringsplit.forEach(function (value: any) {
      countIn++;
      if (countIn <= 22) {
        queryfrist += value + "or";
      }
      if (countIn == 22) {
        querystringSplit1.push(queryfrist.slice(0, queryfrist.length - 2));
        queryfrist = "filter=";
        countIn = 0;
      }
    });
    if (queryfrist.length > 7 && countIn > 0)
      querystringSplit1.push(queryfrist.slice(0, queryfrist.length - 2));
    return querystringSplit1;
  }
  private ConvertLocalTOServerDate(LocalDateTime: any, dtformat: any) {
    if (dtformat == undefined || dtformat == "") dtformat = "DD/MM/YYYY";
    if (LocalDateTime != "") {
      let serverDateTime: string;
      let mDateTime = Moment(LocalDateTime);
      serverDateTime = mDateTime.format(dtformat);
      return serverDateTime;
    }
    return "";
  }
  private Call = (Type: any) => {
    this.updatefilter(false);
    this.setState({
      IsTask: "",
      IsMasterTask: "",
      isDirectPopup: false,
    });
    if (Type == "Master Task") this.LoadPortfolio();
  };
  private async GetAllSiteTaskData(
    filterItemTimeTab: any,
    getAllTimeEntry: any
  ) {
    let callcount = 0;
    let AllSiteTasks: any = [];
    let AllTimeEntryItem: any = [];
    let web = new Web(this.props.Context.pageContext.web.absoluteUrl);
    if (filterItemTimeTab.length > 0) {
      for (let index = 0; index < filterItemTimeTab.length; index++) {
        let itemtype = filterItemTimeTab[index];
        if (itemtype.ListName == "OffshoreTasks") {
          itemtype.ListName = "Offshore Tasks";
        }
        for (let j = 0; j < itemtype.Query.length; j++) {
          web = new Web(itemtype?.siteUrl)
          let queryType = itemtype.Query[j];
          let results = await web?.lists
            .getByTitle(itemtype.ListName)
            .items.select(
              "ParentTask/Title",
              "ParentTask/Id",
              "ItemRank",
              "Portfolio/Id",
              "Portfolio/Title",
              "SiteCompositionSettings",
              "TaskLevel",
              "TaskLevel",
              "TimeSpent",
              "BasicImageInfo",
              "OffshoreComments",
              "OffshoreImageUrl",
              "CompletedDate",
              "TaskID",
              "ResponsibleTeam/Id",
              "ResponsibleTeam/Title",
              "ClientCategory/Id",
              "ClientCategory/Title",
              "ClientCategory/ParentID",
              "TaskCategories/Id",
              "TaskCategories/Title",
              "ParentTask/TaskID",
              "Project/Id",
              "Project/Title",
              "Project/PortfolioStructureID",
              "Project/PriorityRank",
              "TaskType/Id",
              "TaskType/Title",
              "TaskType/Level",
              "TaskType/Prefix",
              "PriorityRank",
              "Reference_x0020_Item_x0020_Json",
              "TeamMembers/Title",
              "TeamMembers/Name",
              "Component/Id",
              "Component/Title",
              "Component/ItemType",
              "TeamMembers/Id",
              "Item_x002d_Image",
              "ComponentLink",
              "IsTodaysTask",
              "AssignedTo/Title",
              "AssignedTo/Name",
              "AssignedTo/Id",
              "AttachmentFiles/FileName",
              "FileLeafRef",
              "FeedBack",
              "Title",
              "Id",
              "PercentComplete",
              "Company",
              "StartDate",
              "DueDate",
              "Comments",
              "Categories",
              "Status",
              "WebpartId",
              "Body",
              "Mileage",
              "PercentComplete",
              "Attachments",
              "Priority",
              "Created",
              "Modified",
              "Author/Id",
              "Author/Title",
              "Editor/Id",
              "Editor/Title"
            )
            .filter(queryType.replace("filter=", "").trim())
            .expand(
              "ParentTask",
              "TaskType",
              'Project',
              "AssignedTo",
              "Component",
              "AttachmentFiles",
              "Author",
              "Editor",
              "TeamMembers",
              "ResponsibleTeam",
              "ClientCategory",
              "TaskCategories",
              "Portfolio"
            )
            .orderBy("Id", false)
            .getAll(4999);
          callcount++;
          let self = this;
          results.forEach(function (Item) {
            Item.siteName = itemtype.ListName;
            Item.DisplayTaskId = globalCommon.GetTaskId(Item);
            Item.listId = itemtype.ListId;
            // Item.ClientTime = JSON.parse(Item.ClientTime);
            Item.PercentComplete =
              Item.PercentComplete <= 1
                ? Item.PercentComplete * 100
                : Item.PercentComplete;
            if (Item.PercentComplete != undefined) {
              Item.PercentComplete = parseInt(Item.PercentComplete.toFixed(0));
            }
            Item.NewCompletedDate = Item.CompletedDate;
            Item.NewCreated = Item.Created;
            Item.projectStructerId = Item?.Project?.PortfolioStructureID
            Item.ProjectId = Item?.Project?.Id
            Item.SmartPriority =
              globalCommon.calculateSmartPriority(Item);
            if (Item.Created != undefined)
              Item.FiltercreatedDate = self.ConvertLocalTOServerDate(
                Item.Created,
                "DD/MM/YYYY"
              );
            if (Item.CompletedDate != undefined)
              Item.FilterCompletedDate = self.ConvertLocalTOServerDate(
                Item.CompletedDate,
                "DD/MM/YYYY"
              );
            const title = Item?.Project?.Title || '';
            const formattedDueDate = Moment(Item?.DueDate, 'DD/MM/YYYY').format('YYYY-MM');
            Item.joinedData = [];
            if (Item?.projectStructerId && title || formattedDueDate) {
              Item.joinedData.push(`Project ${Item?.projectStructerId} - ${title}  ${formattedDueDate == "Invalid date" ? '' : formattedDueDate}`)
            }
            Item.descriptionsSearch = "";
            if (Item?.FeedBack != undefined) {
              let DiscriptionSearchData: any = "";
              let feedbackdata: any = JSON.parse(Item?.FeedBack);
              DiscriptionSearchData =
                feedbackdata[0]?.FeedBackDescriptions?.map((child: any) => {
                  const childText = child?.Title?.replace(
                    /(<([^>]+)>)/gi,
                    ""
                  )?.replace(/\n/g, "");
                  const subtextText = (child?.Subtext || [])
                    ?.map((elem: any) =>
                      elem.Title?.replace(/(<([^>]+)>)/gi, "")?.replace(
                        /\n/g,
                        ""
                      )
                    )
                    .join("");
                  return childText + subtextText;
                }).join("");
              Item.descriptionsSearch = DiscriptionSearchData;
            }
            AllSiteTasks.push(Item);
          });
        }
      }


      let filterItems = this.state.filterItems;
      getAllTimeEntry.forEach(function (filterItem: any) {
        filterItem.ClientCategorySearch = "";
        filterItem.clientCategory = "";
        filterItem.clientCategoryIds = "";
        AllSiteTasks.forEach(function (copygetval: any) {
          var getItem: any = JSON.stringify(copygetval);
          getItem = globalCommon.parseJSON(getItem);
          if (
            filterItem.TaskItemID == getItem.Id &&
            filterItem.selectedSiteType == getItem.siteName
          ) {
            if (
              filterItem.siteType != undefined &&
              filterItem.siteType == "ALAK_Digital"
            ) {
              filterItem.siteType = "ALAKDigital";
            }
            getItem["siteType"] = filterItem.siteType;
            filterItem.CategoryParentId = 0;
            let cate = "";
            let cateId = "";
            filterItem.ClientCategory = getItem?.ClientCategory;
            if (
              getItem?.ClientCategory != undefined &&
              getItem?.ClientCategory?.length > 0
            ) {
              getItem?.ClientCategory.forEach(function (category: any) {
                if (category != undefined && category?.Title != undefined)
                  cate += category?.Title + "; ";
                if (category != undefined && category?.Id != undefined)
                  cateId += category?.Id + "; ";
              });
            }
            if (getItem?.ClientCategory?.length > 0) {
              filterItem.ClientCategorySearch = getItem?.ClientCategory?.map(
                (elem: any) => elem.Title
              ).join(" ");
            } else {
              filterItem.ClientCategorySearch = "";
            }
            filterItem.clientCategory = cate;
            filterItem.clientCategoryIds = cateId;
            let clientTimeArr: any = [];
            // if (getItem.ClientTime != undefined && getItem.ClientTime != '' && getItem.ClientTime?.length > 0) {
            //   getItem.ClientTime.forEach(function (val: { [x: string]: number; ClienTimeDescription: number; }) {
            //     val['releventTime'] = (filterItem.Effort / 100) * val.ClienTimeDescription;;
            //     if (val.ClienTimeDescription != undefined && val.ClienTimeDescription != 100) {
            //       clientTimeArr.push(val);
            //     }
            //   })
            // }
            //filterItem.clientTimeInfo = clientTimeArr;
            filterItem.flag = true;
            filterItem.DisplayTaskId = getItem?.DisplayTaskId;
            filterItem.joinedData = getItem?.joinedData;
            filterItem.SmartPriority = getItem?.SmartPriority;
            filterItem.projectStructerId = getItem?.projectStructerId;
            filterItem.ProjectTitle = getItem?.Project?.Title;
            filterItem.ProjectId = getItem?.Project?.Id;
            filterItem.PortfolioType = getItem?.PortfolioType;
            filterItem.Body = getItem?.Body;
            filterItem.ProjectID = getItem?.ProjectId;
            filterItem.descriptionsSearch = getItem?.descriptionsSearch;
            filterItem.FeedBack = getItem?.FeedBack;
            filterItem.TaskType = getItem?.TaskType;
            filterItem.ParentTask = getItem?.ParentTask;
            filterItem.PercentComplete = getItem.PercentComplete;
            filterItem.ItemRank = getItem.ItemRank;
            filterItem.PriorityRank = getItem?.PriorityRank;
            filterItem.TaskID = filterItem.DisplayTaskId;
            filterItem.Portfolio = getItem?.Portfolio;
            filterItem.Title = getItem?.Title;
            filterItem.Status = getItem?.Status;

            filterItem.ID = getItem?.Id;
            filterItem.Id = getItem?.Id;
            filterItem.Created = getItem.Created;
            filterItem.listId = getItem.listId;
            filterItem.PortfolioTypeTitle = "Component";
            filterItem.fontColorTask = "#0000BC";
            if (getItem.Portfolio != undefined) {
              if (AllPortfolios != undefined && AllPortfolios?.length > 0) {
                let result = AllPortfolios.filter(
                  (type: any) =>
                    type.Id != undefined &&
                    getItem.Portfolio != undefined &&
                    getItem.Portfolio?.Id != undefined &&
                    getItem.Portfolio?.Id == type.Id
                )[0];
                if (result != undefined && result != "") {
                  filterItem.PortfolioTypeTitle = result?.PortfolioType?.Title;
                  filterItem.fontColorTask = result?.PortfolioType?.Color;
                }
              }
              filterItem.ComponentName = getItem.Portfolio?.Title;
              filterItem.ComponentIDs = getItem.Portfolio?.Id;
              filterItem.PortfolioItem = getItem?.Portfolio;
            }
          }
        });
      });
      getAllTimeEntry.forEach(function (
        item: { [x: string]: any },
        index: number
      ) {
        item["uniqueTimeId"] = index + 1;
      });
      AllTimeEntryItem = getAllTimeEntry;
      let CopyAllTimeEntry = [...AllTimeEntryItem];
      this.BackupAllTimeEntry = CopyAllTimeEntry;

      this.ShareTimeSheetMultiUser(AllTimeEntryItem,
        AllTaskUser,
        this?.props?.Context,
        DateType,
        this.state.ImageSelectedUsers)
      this.TotalTimeEntry = 0;
      for (let index = 0; index < AllTimeEntryItem.length; index++) {
        this.TotalTimeEntry += AllTimeEntryItem[index].Effort;
      }
      this.TotalTimeEntry = this.TotalTimeEntry.toFixed(2);
      this.TotalDays = this.TotalTimeEntry / 8;
      this.TotalDays = this.TotalDays.toFixed(2);
      this.setState(
        {
          filterItems: filterItems,
        },
        () => {
          this.getFilterTask(AllTimeEntryItem);
        }
      );

    }
    else {
      this.TotalTimeEntry = 0;
      for (let index = 0; index < AllTimeEntryItem.length; index++) {
        let timeitem = AllTimeEntryItem[index];
        this.TotalTimeEntry += timeitem.Effort;
      }
      this.TotalTimeEntry = this.TotalTimeEntry.toFixed(2);
      this.TotalDays = this.TotalTimeEntry / 8;
      this.TotalDays = this.TotalDays.toFixed(2);
      let resultSummary = {};
      resultSummary = {
        totalTime: this.TotalTimeEntry,
        totalDays: this.TotalDays,
        totalEntries: AllTimeEntryItem.length,
      };
      this.setState({
        loaded: false,
        resultSummary,
      });
      this.setState(
        {
          filterItems: filterItems,
        },
        () => {
          this.getFilterTask(AllTimeEntryItem);
        }
      );
    }


  }
  private getFilterTask(filterTask: any) {
    let selectedFilters: any = [];
    let filterItems = this.state.filterItems;
    let filterCheckedItem = this.state.checked;
    let filterCheckedSites = this.state.checkedSites;
    let filterSites = this.state.filterSites;
    if (filterCheckedSites != undefined && filterCheckedItem?.length > 0) {
      for (let index = 0; index < filterCheckedItem?.length; index++) {
        let id = filterCheckedItem[index];
        filterItems.forEach(function (filterItem: any) {
          if (filterItem.value == id) selectedFilters.push(filterItem);
          if (
            filterItem?.children != undefined &&
            filterItem?.children.length > 0
          ) {
            filterItem?.children.forEach(function (child: any) {
              if (child.value == id) selectedFilters.push(child);
              if (child.children != undefined && child.children.length > 0) {
                child.children.forEach(function (subchild: any) {
                  if (subchild.value == id) selectedFilters.push(subchild);
                });
              }
            });
          }
        });
      }
    }
    //Get Selected filters of sites
    if (filterCheckedSites != undefined && filterCheckedSites?.length > 0) {
      for (let index = 0; index < filterCheckedSites?.length; index++) {
        let id = filterCheckedSites[index];
        filterSites?.forEach(function (filterItem: any) {
          if (filterItem.value == id) selectedFilters.push(filterItem);
          if (
            filterItem.children != undefined &&
            filterItem.children.length > 0
          ) {
            filterItem?.children.forEach(function (child: any) {
              if (child.value == id) selectedFilters.push(child);
              if (child.children != undefined && child.children.length > 0) {
                child.children.forEach(function (subchild: any) {
                  if (subchild.value == id) selectedFilters.push(subchild);
                });
              }
            });
          }
        });
      }
    }
    let SitesItems = [];
    let isSitesSelected = false;
    let CategoryItems = [];
    let isCategorySelected = false;
    let count = 1;
    if (selectedFilters.length > 0) {
      let isSitesSelected = false;
      for (let index = 0; index < filterTask.length; index++) {
        let item = filterTask[index];
        for (let i = 0; i < selectedFilters.length; i++) {
          switch (selectedFilters[i].TaxType) {
            case "Client Category":
              if (
                item.clientCategoryIds != undefined &&
                item.clientCategoryIds != ""
              ) {
                let Category = item.clientCategoryIds.split(";");
                let title =
                  selectedFilters[i].ParentTitle == "PSE"
                    ? "EPS"
                    : selectedFilters[i].ParentTitle == "e+i"
                      ? "EI"
                      : selectedFilters[i].ParentTitle;
                for (let j = 0; j < Category.length; j++) {
                  let type = Category[j];
                  if (
                    type == selectedFilters[i].Id &&
                    !this.issmartExistsIds(CategoryItems, item)
                  ) {
                    if (
                      item.clientTimeInfo != undefined &&
                      item.clientTimeInfo.length > 0
                    ) {
                      for (let k = 0; k < item.clientTimeInfo.length; k++) {
                        let obj = item.clientTimeInfo[k];
                        if (
                          obj.SiteName == title &&
                          obj.releventTime != undefined
                        ) {
                          item.Effort = obj.releventTime;
                          item.DispEffort = obj.releventTime.toFixed(2);
                        }
                      }
                    }
                    item["uniqueTimeId"] = count;
                    CategoryItems.push(item);
                    count++;
                  } else if (
                    type == selectedFilters[i].Id &&
                    this.issmartExistsIds(CategoryItems, item)
                  ) {
                    if (
                      item.clientTimeInfo != undefined &&
                      item.clientTimeInfo.length > 0
                    ) {
                      for (let k = 0; k < item.clientTimeInfo.length; k++) {
                        let obj = item.clientTimeInfo[k];
                        if (
                          obj.SiteName == title &&
                          obj.releventTime != undefined
                        ) {
                          item.Effort = obj.releventTime;
                          item.DispEffort = obj.releventTime.toFixed(2);
                        }
                      }
                    }
                    item["uniqueTimeId"] = count;
                    CategoryItems.push(item);
                    count++;
                  }
                }
              }
              if (item.clientCategoryIds == "") {
                let title =
                  selectedFilters[i].ParentTitle == "PSE"
                    ? "EPS"
                    : selectedFilters[i].ParentTitle == "e+i"
                      ? "EI"
                      : selectedFilters[i].ParentTitle;
                if (selectedFilters[i].Title == "Other") {
                  if (
                    selectedFilters[i]?.ParentTitle == "Other" &&
                    (item.ClientCategory == undefined ||
                      item.ClientCategory.length == 0) &&
                    !this.issmartExistsIds(CategoryItems, item)
                  ) {
                    if (
                      item.clientTimeInfo != undefined &&
                      item.clientTimeInfo.length > 0
                    ) {
                      for (let k = 0; k < item.clientTimeInfo.length; k++) {
                        let obj = item.clientTimeInfo[k];
                        if (
                          obj.SiteName == title &&
                          obj.releventTime != undefined
                        ) {
                          item.Effort = obj.releventTime;
                          item.DispEffort = obj.releventTime.toFixed(2);
                        }
                      }
                    }
                    item["uniqueTimeId"] = count;
                    CategoryItems.push(item);
                    count++;
                  }
                }
                if (selectedFilters[i].Title != "Other") {
                  if (
                    item.siteType != undefined &&
                    item.siteType == title &&
                    (item.ClientCategory == undefined ||
                      item.ClientCategory.length == 0) &&
                    !this.issmartExistsIds(CategoryItems, item)
                  ) {
                    if (
                      item.clientTimeInfo != undefined &&
                      item.clientTimeInfo.length > 0
                    ) {
                      for (let k = 0; k < item.clientTimeInfo.length; k++) {
                        let obj = item.clientTimeInfo[k];
                        if (
                          obj.SiteName == title &&
                          obj.releventTime != undefined
                        ) {
                          item.Effort = obj.releventTime;
                          item.DispEffort = obj.releventTime.toFixed(2);
                        }
                      }
                    }
                    item["uniqueTimeId"] = count;
                    CategoryItems.push(item);
                    count++;
                  }
                }
              }
              isCategorySelected = true;
              const ids: any = CategoryItems.map((o) => o.uniqueTimeId);
              CategoryItems = CategoryItems.filter(
                ({ uniqueTimeId }, index) =>
                  !ids.includes(uniqueTimeId, index + 1)
              );
              break;
            case "Sites":
              if (
                item.selectedSiteType != undefined &&
                item.selectedSiteType != "" &&
                item.selectedSiteType
                  .toLowerCase()
                  .indexOf(selectedFilters[i].Title.toLowerCase()) > -1 &&
                !this.issmartExistsIds(SitesItems, item)
              ) {
                SitesItems.push(item);
              }
              isSitesSelected = true;
              break;
          }
        }
      }
      let commonItems: any = [];
      let isOtherselected = false;
      if (isCategorySelected) {
        isOtherselected = true;
        if (commonItems.length > 0) {
          commonItems = this.getAllowCommonItems(commonItems, CategoryItems);
          if (commonItems.length == 0) {
            CategoryItems = null;
          }
        } else commonItems = CategoryItems;
      }
      if (isSitesSelected) {
        isOtherselected = true;
        if (commonItems.length > 0) {
          commonItems = this.getAllowCommonItems(commonItems, SitesItems);
          if (commonItems.length == 0) {
            CategoryItems = null;
            SitesItems = null;
          }
        } else commonItems = SitesItems;
      }
      let commonItemsbackup = commonItems;
      this.DynamicSortitems(
        commonItemsbackup,
        "TimeEntrykDateNew",
        "DateTime",
        "Descending"
      );
      this.AllTimeEntry = commonItemsbackup;
      this.TotalTimeEntry = 0;
      for (let index = 0; index < this.AllTimeEntry.length; index++) {
        let timeitem = this.AllTimeEntry[index];
        this.TotalTimeEntry += timeitem.Effort;
      }
      this.TotalTimeEntry = this.TotalTimeEntry.toFixed(2);
      this.TotalDays = this.TotalTimeEntry / 8;
      this.TotalDays = this.TotalDays.toFixed(2);
      let resultSummary = {};
      let TotalValue = 0,
        SmartHoursTotal = 0,
        AdjustedTime = 0,
        RoundAdjustedTime = 0,
        totalEntries = 0;
      if (this.AllTimeEntry.length > 0) {
        for (let index = 0; index < this.AllTimeEntry.length; index++) {
          let element = this.AllTimeEntry[index];
          TotalValue += parseFloat(element.TotalValue);
          SmartHoursTotal += parseFloat(element.SmartHoursTotal);
          AdjustedTime += parseFloat(element.AdjustedTime);
          RoundAdjustedTime += parseFloat(element.RoundAdjustedTime);
        }
      }
      resultSummary = {
        totalTime: this.TotalTimeEntry,
        totalDays: this.TotalDays,
        totalEntries: this.AllTimeEntry.length,
      };
      this.setState(
        {
          AllTimeEntry: this.AllTimeEntry,
          resultSummary,
          loaded: false
        },
        () => this.createTableColumns()
      );
    } else {

      this.AllTimeEntry = filterTask;
      this.TotalTimeEntry = 0;
      for (let index = 0; index < this.AllTimeEntry.length; index++) {
        let timeitem = this.AllTimeEntry[index];
        this.TotalTimeEntry += timeitem.Effort;
      }
      this.TotalTimeEntry = this.TotalTimeEntry.toFixed(2);
      this.TotalDays = this.TotalTimeEntry / 8;
      this.TotalDays = this.TotalDays.toFixed(2);
      let resultSummary = {};
      let TotalValue = 0,
        SmartHoursTotal = 0,
        AdjustedTime = 0,
        RoundAdjustedTime = 0,
        totalEntries = 0;
      if (this.AllTimeEntry.length > 0) {
        const seen = new Set();

        this.AllTimeEntry = this.AllTimeEntry.filter((entry: any) => {
          const key = `${entry.Id}-${entry.Effort}-${entry.TimeEntryDate}-${entry?.AuthorId}`;
          if (seen.has(key)) {
            return false;
          } else {
            seen.add(key);
            return true;
          }
        });
        for (let index = 0; index < this.AllTimeEntry.length; index++) {
          let element = this.AllTimeEntry[index];
          TotalValue += parseFloat(element.TotalValue);
          SmartHoursTotal += parseFloat(element.SmartHoursTotal);
          AdjustedTime += parseFloat(element.AdjustedTime);
          RoundAdjustedTime += parseFloat(element.RoundAdjustedTime);
        }
      }
      resultSummary = {
        totalTime: this.TotalTimeEntry,
        totalDays: this.TotalDays,
        totalEntries: this.AllTimeEntry.length,
      };
      this.setState(
        {
          AllTimeEntry: this.AllTimeEntry,
          resultSummary,
          loaded: false
        },
        () => this.createTableColumns()
      );
    }
    // this.setState(
    //   {
    //     loaded: false,
    //   },
    //   () => this.createTableColumns()
    // );
  }
  private issmartExistsIds(
    array: any[],
    Ids: { TaskItemID: any; ID: any; TimeEntryId: any }
  ) {
    var isExists = false;
    array.forEach(function (item: {
      TaskItemID: any;
      ID: any;
      TimeEntryId: any;
    }) {
      if (item.TaskItemID == Ids.TaskItemID) {
        if (item.ID == Ids.ID && item.TimeEntryId == Ids.TimeEntryId) {
          isExists = true;
        }
      }
    });
    return isExists;
  }
  private isExistsclient(array: string | any[], Id: any) {
    var isExists = false;
    if (array != "" && array.indexOf(Id) > -1) {
      isExists = true;
    }
    return isExists;
  }
  private getAllowCommonItems(arr1: any, arr2: any) {
    let commonItems: any = [];
    arr1.forEach(function (item1: any) {
      arr2.forEach(function (item2: any) {
        if (item1.ID === item2.ID) {
          commonItems.push(item2);
          return false;
        }
      });
    });
    return commonItems;
  }
  private DynamicSortitems(items: any, column: any, type: any, order: any) {
    if (order == "Ascending") {
      if (type == "DateTime") {
        items.sort(function (a: any, b: any) {
          let aDate = new Date(a[column]);
          let bDate = new Date(b[column]);
          return aDate > bDate ? 1 : aDate < bDate ? -1 : 0;
        });
      }
      if (type == "Number") {
        items.sort(function (a: any, b: any) {
          return a[column] - b[column];
        });
      } else
        items.sort(function (a: any, b: any) {
          let aID = a[column];
          let bID = b[column];
          return aID == bID ? 0 : aID > bID ? 1 : -1;
        });
    }
    if (order == "Descending") {
      if (type == "DateTime") {
        items.sort(function (a: any, b: any) {
          let aDate = new Date(a[column]);
          let bDate = new Date(b[column]);
          return aDate > bDate ? -1 : aDate < bDate ? 1 : 0;
        });
      }
      if (type == "Number") {
        items.sort(function (a: any, b: any) {
          return b[column] - a[column];
        });
      } else
        items.sort(function (a: any, b: any) {
          let aID = a[column];
          let bID = b[column];
          return aID == bID ? 0 : aID < bID ? 1 : -1;
        });
    }
  }
  private isItemExistsItems(arr: any, title: any, titname: any) {
    let isExists = false;
    arr.forEach(function (item: any) {
      if (item[titname] == title) {
        isExists = true;
        return false;
      }
    });
    return isExists;
  }
  private ClearFilters() {
    this.AllTimeEntry = this.BackupAllTimeEntry;
    this.TotalTimeEntry = 0;
    for (let index = 0; index < this.AllTimeEntry.length; index++) {
      let timeitem = this.AllTimeEntry[index];
      timeitem.Effort = parseFloat(timeitem.TaskTime);
      this.TotalTimeEntry += timeitem.Effort;
    }
    this.TotalTimeEntry = this.TotalTimeEntry.toFixed(2);
    this.TotalDays = this.TotalTimeEntry / 8;
    this.TotalDays = this.TotalDays.toFixed(2);
    let resultSummary = {};
    let TotalValue = 0,
      SmartHoursTotal = 0,
      AdjustedTime = 0,
      RoundAdjustedTime = 0,
      totalEntries = 0;
    if (this.AllTimeEntry.length > 0) {
      for (let index = 0; index < this.AllTimeEntry.length; index++) {
        let element = this.AllTimeEntry[index];
        TotalValue += parseFloat(element.TotalValue);
        SmartHoursTotal += parseFloat(element.SmartHoursTotal);
        AdjustedTime += parseFloat(element.AdjustedTime);
        RoundAdjustedTime += parseFloat(element.RoundAdjustedTime);
      }
    }
    resultSummary = {
      totalTime: this.TotalTimeEntry,
      totalDays: this.TotalDays,
      totalEntries: this.AllTimeEntry.length,
    };
    this.setState(
      {
        AllTimeEntry: this.AllTimeEntry,
        resultSummary,
      },
      () => this.createTableColumns()
    );
    this.setState(
      {
        AllTimeEntry: this.BackupAllTimeEntry,
        checked: [],
        checkedSites: [],
      },
      () => this.createTableColumns()
    );
  }
  private ShowDraftTime = () => {
    if (this.state.AllTimeEntry?.length > 0) {
      alert('Please click on Update filter')
    }
    else {
      let MyData: any = []
      this.state.AllTimeEntry?.forEach((items: any) => {
        if (items.TimeStatus == 'Draft') {
          MyData.push(items)
        }

      })
      this.setState({
        AllTimeEntry: MyData
      })
    }

  }
  // private SelectedSites=(Sites:any,e:any)=>{
  //   if (e.target.checked == true) {
  //     seletedAllSites.push(Sites)
  //   } else {
  //     const filteredArray: any = [];
  //     seletedAllSites?.forEach((user: any,index:any) => {
  //       if (user?.Title == Sites.Title) {
  //         seletedAllSites.splice(1,index)
  //       }
  //     });
  //     // Update state with the filtered array
  //     this.setState({ ImageSelectedUsers: filteredArray });
  //   }
  //   console.log(Sites)
  // }
  private SelectSites = (Site: any, e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    let MyData: any = []
    const { seletedAllSites } = this.state;

    if (isChecked) {
      validSites?.forEach((items: any) => {
        if (Site?.Title == items?.Title) {
          items.isSelected = true;
        }
      })
      // Add the site to the selected sites array
      MyData.push(Site)
      this.setState({ seletedAllSites: [...seletedAllSites, Site] });
      MyData?.forEach(async (subsite: any) => {
        try {
          filteredData = []
          // Construct the API URL for the SmartMetaData list
          const apiUrl = `${subsite.siteurl}/_api/web/lists/getbytitle('SmartMetadata')/items?$filter=TaxType eq 'DynamicUserTimeEntry'`;

          // Make the API call
          const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
              'Accept': 'application/json;odata=nometadata',
            },
          });

          if (response.ok) {
            const data = await response.json();
            // Add the filtered data to the array
            let JSONData = JSON.parse(data.value[0]?.Configurations)
            JSONData?.forEach((val: any) => {
              filteredData.push(val)
              this.GetTaskUsers('checked');
              this.LoadAllMetaDataFilter('checked');
            })
            //filteredData.push(...JSONData);
          } else {
            console.error(`Error fetching data from ${subsite.Title}: ${response.statusText}`);
          }
        } catch (error) {
          console.error(`Error fetching data from ${subsite.Title}: ${error.message}`);
        }
      });
    } else {
      // Remove the site from the selected sites array
      const filteredArray = seletedAllSites.filter((selectedSite: any) => selectedSite.Title !== Site.Title);
      MyData = filteredArray;
      validSites?.forEach((items: any) => {
        if (Site?.Title == items?.Title) {
          items.isSelected = false;
        }
      })
      filteredData?.forEach((val: any, index: any) => {
        if (val.siteUrl == Site.siteurl) {
          filteredData.splice(index, 1)
        }
      })
      const filteredTimeSheetLists = this.state.TimeSheetLists.filter((val: any) => (val.siteType.toLowerCase() !== Site.Title.toLowerCase()));
      this.setState({ TimeSheetLists: filteredTimeSheetLists });
      this.setState({ seletedAllSites: filteredArray });

      this.GetTaskUsers('unchecked');
    }

    // Make API calls for each subsite


    // Now filteredData contains the combined filtered items from all subsites
    console.log(filteredData);
  };

  private removeDuplicates(arr: any) {
    const uniqueItems = new Map();

    // Filter out duplicates based on ID
    const filteredArr = arr.filter((item: any) => {
      if (!uniqueItems.has(item.ID)) {
        uniqueItems.set(item.ID, true);
        return true;
      }
      return false;
    });

    return filteredArr;
  }
  private getAllSubChildenCount(item: any) {
    let count = 1;
    if (item?.children != undefined && item?.children.length > 0) {
      count += item.children.length;
      item?.children.forEach((subchild: any) => {
        if (subchild.children != undefined && subchild.children.length > 0) {
          count += subchild.children.length;
          subchild?.children.forEach((subchild2: any) => {
            if (
              subchild2.children != undefined &&
              subchild2.children.length > 0
            ) {
              count += subchild2.children.length;
              subchild2.children.forEach((subchild3: any) => { });
            }
          });
        }
      });
    }
    return count;
  }
  private customTableHeaderButtons = (
    <>
      <span>
        <button type='button' className="btnCol btn btn-primary me-1" onClick={() => this.ShowDraftTime()}>Show Draft Timesheet</button>
      </span>
      <a className="barChart" title="Open Bar Graph" onClick={this.showGraph}>
        <BsBarChartLine />
      </a>

    </>
  );
  private onCheck(checked: any) {
    debugger;
    this.setState({ checked }, () => {
      //Set/unset the selected checkbox parent name
      let filterItems = this.state.filterItems;
      let checkedIds = this.state.checked;
      let checkedParentNode: any = [];
      if (filterItems.length > 0) {
        filterItems.forEach((filterItem: any) => {
          let checked = false;
          checkedIds.forEach((element: any) => {
            if (filterItem.ID == element) checked = true;
          });
          if (checked) checkedParentNode.push(filterItem);
        });
      }
      this.setState({
        checkedParentNode,
        checkedAll:
          filterItems.length == checkedParentNode.length ? true : false,
      });
    });
  }
  private EditDataTimeEntryData = (e: any, item: any) => {
    item.Id = item?.TaskItemID;
    item.ID = item?.TaskItemID;
    item.Title = item?.TaskTitle;
    item.siteUrl = item?.SiteUrl;
    this.setState({
      IsTimeEntry: true,
    });
    this.setState({
      TimeComponent: item,
    });
  };
  private TimeEntryCallBack() {
    this.setState({
      IsTimeEntry: false,
    });
  }
  private EditComponentPopup = (item: any) => {
    let PortfolioItem = AllPortfolios.filter((type) => type?.Id == item?.Id)[0];
    PortfolioItem["siteUrl"] =
      this.props?.Context?.pageContext?.web?.absoluteUrl;
    PortfolioItem["listName"] = "Master Tasks";
    this.setState({
      IsMasterTask: PortfolioItem,
      isDirectPopup: true,
    });
  };
  private EditPopup = (item: any) => {
    item.Id = item?.TaskItemID;
    item.ID = item?.TaskItemID;
    item.siteurl = item?.SiteUrl;
    this.setState({
      IsTask: item,
    });
  };
  private createTableColumns() {
    let dt = [
      {
        accessorKey: "",
        placeholder: "",
        hasCheckbox: true,
        hasCustomExpanded: false,
        hasExpanded: false,
        isHeaderNotAvlable: true,
        size: 25,
        id: "Id",
      },
      {
        accessorFn: (info: any) => info?.Site,
        cell: (info: any) => (
          <span>
            <img
              className="circularImage rounded-circle"
              src={info?.row?.original?.SiteIcon}
            />
          </span>
        ),
        id: "Site",
        placeholder: "Site",
        header: "",
        resetSorting: false,
        resetColumnFilters: false,
        size: 60,
      },
      {
        accessorKey: "DisplayTaskId",
        placeholder: "Task",
        id: "DisplayTaskId",
        header: "",
        size: 105,
        cell: (info: any) => (
          <>
            <span className="d-flex">
              <ReactPopperTooltipSingleLevel
                AllListId={AllListId}
                CMSToolId={info?.row?.original?.DisplayTaskId}
                row={info?.row?.original}
                singleLevel={true}
                masterTaskData={AllPortfolios}
                AllSitesTaskData={AllSitesAllTasks}
              />
            </span>
          </>
        ),
      },
      {
        accessorKey: "ProjectID",
        id: "ProjectID",
        placeholder: "ProjectID",
        header: "",
        size: 60,
      },
      {
        accessorKey: "TaskTitle",
        id: "TaskTitle",
        header: "",
        placeholder: "Task Title",
        cell: (info: any) => (
          <span>
            <a
              data-interception="off"
              className="hreflink serviceColor_Active"
              target="_blank"
              style={
                info?.row?.original?.fontColorTask != undefined
                  ? { color: `${info?.row?.original?.fontColorTask}` }
                  : { color: `${info?.row?.original?.PortfolioType?.Color}` }
              }
              href={
                info?.row?.original?.SiteUrl +
                "/SitePages/Task-Profile.aspx?taskId=" +
                info.row.original.TaskItemID +
                "&Site=" +
                info.row.original.siteType
              }
            >
              {info.row.original.TaskTitle}
            </a>
            {info?.row?.original?.descriptionsSearch !== null &&
              info?.row?.original?.descriptionsSearch != undefined ? (
              <span className="alignIcon">
                {" "}
                <InfoIconsToolTip
                  Discription={info?.row?.original?.descriptionsSearch}
                  row={info?.row?.original}
                />{" "}
              </span>
            ) : (
              ""
            )}
          </span>
        ),
        size: 300,
      },
      {
        accessorFn: (info: any) => info?.ClientCategorySearch,
        cell: (info: any) => (
          <>
            <ShowClintCatogory
              clintData={info?.row?.original}
              AllMetadata={this.state?.AllMetadata}
            />
          </>
        ),
        id: "ClientCategorySearch",
        placeholder: "Client Category",
        header: "",
        resetColumnFilters: false,
        size: 105,
      },
      {
        accessorKey: "PercentComplete",
        id: "PercentComplete",
        placeholder: "%",
        header: "",
        size: 50,
      },
      {
        accessorKey: "ComponentName",
        id: "ComponentName",
        header: "",
        placeholder: "Component",
        cell: (info: any) => (
          <>
            <a
              data-interception="off"
              className="hreflink serviceColor_Active"
              target="_blank"
              style={
                info?.row?.original?.fontColorTask != undefined
                  ? { color: `${info?.row?.original?.fontColorTask}` }
                  : { color: `${info?.row?.original?.PortfolioType?.Color}` }
              }
              href={
                this.props.Context.pageContext.web.absoluteUrl +
                "/SitePages/Portfolio-Profile.aspx?taskId=" +
                info.row?.original?.ComponentIDs
              }
            >
              {info.row?.original?.ComponentName}
            </a>
            <span
              className="svg__iconbox svg__icon--edit alignIcon hreflink"
              onClick={(e) =>
                this.EditComponentPopup(info.row?.original?.PortfolioItem)
              }
            ></span>
          </>
        ),
        size: 200,
      },
      {
        accessorKey: "Description",
        cell: (info: any) => (
          <>
            <span
              className="popover__wrapper ms-1"
              data-bs-toggle="tooltip"
              data-bs-placement="auto"
            >
              <span>
                {info?.row?.original.truncatedTitle?.length > 0
                  ? info?.row?.original?.truncatedTitle
                  : info?.row?.original?.Description}
              </span>
              {info?.row?.original.truncatedTitle?.length > 0 && (
                <span className="f-13 popover__content">
                  {info?.row?.original?.Description}
                </span>
              )}
            </span>
          </>
        ),
        id: "Description",
        placeholder: "Time Description",
        header: "",
      },
      {
        accessorFn: (info: any) => info?.projectStructerId + "." + info?.ProjectTitle,
        cell: (info: any) => (
          <>
            {info?.row?.original?.ProjectTitle != (null || undefined) &&
              <span ><a style={info?.row?.original?.fontColorTask != undefined ? { color: `${info?.row?.original?.fontColorTask}` } : { color: `${info?.row?.original?.PortfolioType?.Color}` }} data-interception="off" target="_blank" className="hreflink serviceColor_Active" href={`${this.props.Context.pageContext.web.absoluteUrl}/SitePages/PX-Profile.aspx?ProjectId=${info?.row?.original?.ProjectId}`} >
                <ReactPopperTooltip CMSToolId={info?.row?.original?.projectStructerId} projectToolShow={true} row={info?.row} AllListId={AllListId} /></a></span>
            }
          </>
        ),
        id: 'ProjectTitle',
        placeholder: "Project",
        resetColumnFilters: false,
        header: "",
        size: 80,
        isColumnVisible: true
      },
      {
        accessorKey: "PriorityRank",
        id: "PriorityRank",
        placeholder: "TaskPriority",
        header: "",
        size: 60,
      },
      {
        accessorKey: "SmartPriority",
        id: "SmartPriority",
        placeholder: "SmartPriority",
        header: "",
        size: 60,
      },

      {
        accessorFn: (info: any) => info?.TaskDate,
        cell: (info: any) => (
          <div className="alignCenter">
            {info?.row?.original?.NewTimeEntryDate == null ? (
              ""
            ) : (
              <>
                <span>{info?.row?.original?.TimeEntryDate}</span>
                {info?.row?.original?.Author != undefined && (
                  <>
                    <a
                      href={`${this.props.Context.pageContext.web.absoluteUrl}/SitePages/TaskDashboard.aspx?UserId=${info?.row?.original?.Author?.Id}&Name=${info?.row?.original?.Author?.Title}`}
                      target="_blank"
                      data-interception="off"
                    >
                      <img
                        title={info?.row?.original?.Author?.Title}
                        className="workmember ms-1"
                        src={info?.row?.original?.Author?.autherImage}
                      />
                    </a>
                  </>
                )}
              </>
            )}
          </div>
        ),
        filterFn: (info: any, columnName: any, filterValue: any) => {
          if (
            info?.original?.Author?.Title?.toLowerCase()?.includes(
              filterValue?.toLowerCase()
            ) ||
            info?.original?.TimeEntryDate?.includes(filterValue)
          ) {
            return true;
          } else {
            return false;
          }
        },
        id: "TaskDate",
        resetColumnFilters: false,
        resetSorting: false,
        placeholder: "Time Entry",
        isColumnDefultSortingDesc: true,
        header: "",
        size: 104,
      },
      {
        accessorKey: "DispEffort",
        id: "DispEffort",
        placeholder: "Time",
        header: "",
        size: 60,
      },
      {
        cell: (info: any) => (
          <>
            <a
              className="alignCenter"
              onClick={(e) =>
                this.EditDataTimeEntryData(e, info?.row?.original)
              }
              data-bs-toggle="tooltip"
              data-bs-placement="auto"
              title="Click To Edit Timesheet"
            >
              <span
                className="svg__iconbox svg__icon--clock dark"
                data-bs-toggle="tooltip"
                data-bs-placement="bottom"
              ></span>
            </a>
          </>
        ),
        id: "AllEntry",
        accessorKey: "",
        canSort: false,
        resetSorting: false,
        resetColumnFilters: false,
        placeholder: "",
        size: 40,
      },
      {
        cell: (info: any) => (
          <span
            title="Edit Task"
            onClick={() => this.EditPopup(info?.row?.original)}
            className="alignIcon  svg__iconbox svg__icon--edit hreflink"
          ></span>
        ),
        id: "Actions",
        accessorKey: "",
        canSort: false,
        resetSorting: false,
        resetColumnFilters: false,
        placeholder: "",
        size: 40,
      },
    ];
    this.setState({
      columns: dt,
    });
  }
  private ExampleCustomInputStrat = React.forwardRef(
    ({ value, onClick }: any, ref: any) => (
      <div style={{ position: "relative" }} onClick={onClick} ref={ref}>
        <input
          type="text"
          id="datepicker"
          data-input-type="StartDate"
          className="form-control date-picker ps-2"
          placeholder="DD/MM/YYYY"
          value={value}
        />
        <span
          style={{
            position: "absolute",
            top: "20px",
            right: "7px",
            transform: "translateY(-50%)",
            cursor: "pointer",
          }}
        >
          <span className="svg__iconbox svg__icon--calendar"></span>
        </span>
      </div>
    )
  );
  private ExampleCustomInputEnd = React.forwardRef(
    ({ value, onClick }: any, ref: any) => (
      <div style={{ position: "relative" }} onClick={onClick} ref={ref}>
        <input
          type="text"
          id="datepicker"
          data-input-type="EndDate"
          className="form-control date-picker ps-2"
          placeholder="DD/MM/YYYY"
          value={value}
        />
        <span
          style={{
            position: "absolute",
            top: "20px",
            right: "7px",
            transform: "translateY(-50%)",
            cursor: "pointer",
          }}
        >
          <span className="svg__iconbox svg__icon--calendar"></span>
        </span>
      </div>
    )
  );
  private SelectedPortfolioItem(data: any, Type: any) {
    if (Type == "Component") {
      this.setState({
        IsCheckedComponent: data?.target?.checked,
      });
    } else {
      this.setState({
        IsCheckedService: data?.target?.checked,
      });
    }
    setTimeout(() => {
      if (this.state?.IsCheckedComponent == true) {
        if (
          this.BackupAllTimeEntry != undefined &&
          this.BackupAllTimeEntry?.length > 0
        ) {
          let result = this.BackupAllTimeEntry.filter(
            (type: any) =>
              type.PortfolioTypeTitle != undefined &&
              Type != undefined &&
              type.PortfolioTypeTitle.toLowerCase() == "component"
          );
          this.setState({
            AllTimeEntry: result,
          });
        }
      }
      if (this.state?.IsCheckedService == true) {
        if (
          this.BackupAllTimeEntry != undefined &&
          this.BackupAllTimeEntry?.length > 0
        ) {
          let result = this.BackupAllTimeEntry.filter(
            (type: any) =>
              type.PortfolioTypeTitle != undefined &&
              Type != undefined &&
              type.PortfolioTypeTitle.toLowerCase() == "service"
          );
          this.setState({
            AllTimeEntry: result,
          });
        }
      }
      if (
        this.state?.IsCheckedComponent == true &&
        this.state?.IsCheckedService == true
      ) {
        this.setState({
          AllTimeEntry: this.BackupAllTimeEntry,
        });
      }
      this.AllTimeEntry = this.state?.AllTimeEntry;
      this.TotalTimeEntry = 0;
      for (let index = 0; index < this.AllTimeEntry.length; index++) {
        let timeitem = this.AllTimeEntry[index];
        this.TotalTimeEntry += timeitem.Effort;
      }
      this.TotalTimeEntry = this.TotalTimeEntry.toFixed(2);
      this.TotalDays = this.TotalTimeEntry / 8;
      this.TotalDays = this.TotalDays.toFixed(2);
      let resultSummary = {};
      let TotalValue = 0,
        SmartHoursTotal = 0,
        AdjustedTime = 0,
        RoundAdjustedTime = 0,
        totalEntries = 0;
      if (this.AllTimeEntry.length > 0) {
        for (let index = 0; index < this.AllTimeEntry.length; index++) {
          let element = this.AllTimeEntry[index];
          TotalValue += parseFloat(element.TotalValue);
          SmartHoursTotal += parseFloat(element.SmartHoursTotal);
          AdjustedTime += parseFloat(element.AdjustedTime);
          RoundAdjustedTime += parseFloat(element.RoundAdjustedTime);
        }
      }
      resultSummary = {
        totalTime: this.TotalTimeEntry,
        totalDays: this.TotalDays,
        totalEntries: this.AllTimeEntry.length,
      };
      this.setState(
        {
          AllTimeEntry: this.AllTimeEntry,
          resultSummary,
        },
        () => this.createTableColumns()
      );
    }, 700);
  }
  private PreSetPikerCallBack = (preSetStartDate: any, preSetEndDate: any) => {
    if (preSetStartDate != undefined) {
      this.setState({
        PresetStartDate: preSetStartDate,
        selectedRadio: "Presettime",
        startdate: preSetStartDate,
      });
    }
    if (preSetEndDate != undefined) {
      this.setState({
        PresetEndDate: preSetEndDate,
        selectedRadio: "Presettime",
        enddate: preSetEndDate,
      });
    }
    this.setState({
      IsPresetPopup: false,
    });
  };
  private ExpandClientCategory = (expanded: any) => {
    this.checkBoxColor(undefined);
    this.setState({ expanded });
  };
  private ExpandSite = (expandedSites: any) => {
    this.checkBoxColor(undefined);
    this.setState({ expandedSites });
  };
  private getclientitemValue = function (client: any, item: any) {
    this.state?.AllMetadata?.forEach((smart: any) => {
      if (smart.Id == client.ParentID) {
        if (smart.ParentID != undefined && smart.ParentID != 0) {
          this.state?.AllMetadata?.forEach((child: any) => {
            if (child.Id == smart.ParentID) {
              if (!this.isExistsclient(item.Client, child.Title))
                item.Client += child.Title + "; ";
              item.CategoryLevel2 += smart.Title + "; ";
              item.CategoryLevel3 += client.Title + "; ";
            }
          });
        } else {
          if (!this.isExistsclient(item.Client, smart.Title))
            item.Client += smart.Title + "; ";
          if (!this.isExistsclient(item.CategoryLevel2, client.Title))
            item.CategoryLevel2 += client.Title + "; ";
        }
      }
    });
  };
  private exportToExcel = () => {
    this.sheetsItems = [];
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    var AllItems = this.state.AllTimeEntry;
    AllItems.forEach((item: any) => {
      var contentItemNew: any = {};
      contentItemNew["TaskTitle"] = item.TaskTitle;
      contentItemNew["TimeEntryDate"] = item.TimeEntryDate;
      contentItemNew["DispEffort"] = item.DispEffort;
      contentItemNew["Client"] = "";
      contentItemNew["CategoryLevel2"] = "";
      contentItemNew["CategoryLevel3"] = "";
      item["Client"] = "";
      item["CategoryLevel2"] = "";
      item["CategoryLevel3"] = "";
      if (item.ClientCategory != undefined && item.ClientCategory.length > 0) {
        item?.ClientCategory.forEach((client: any, index: any) => {
          if (client.ParentID != undefined && client.ParentID != 0) {
            this.getclientitemValue(client, item);
            contentItemNew.CategoryLevel2 = item.CategoryLevel2;
            contentItemNew.CategoryLevel3 = item.CategoryLevel3;
          } else {
            if (client.ParentID != undefined && client.ParentID == 0)
              item.Client += client.Title + "; ";
            contentItemNew.Client += client.Title + "; ";
          }
        });
      }
      contentItemNew["Client"] = item.Client;
      contentItemNew["CategoryLevel2"] = item.CategoryLevel2;
      contentItemNew["CategoryLevel3"] = item.CategoryLevel3;
      contentItemNew["Component Name"] = item.ComponentName;
      this?.sheetsItems.push(contentItemNew);
    });
    if (this?.sheetsItems?.length > 0) {
      var fileName = "Time Entry";
      const ws = XLSX.utils.json_to_sheet(this.sheetsItems);
      const fileExtension = ".xlsx";
      const fileType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      XLSX.utils.sheet_add_aoa(
        ws,
        [
          [
            "TaskTitle",
            "TimeEntryDate",
            "Effort",
            "Client",
            "CategoryLevel2",
            "CategoryLevel3",
            "Component Name",
          ],
        ],
        { origin: "A1" }
      );
      const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], { type: fileType });
      FileSaver.saveAs(data, fileName + fileExtension);
    }
  };
  callBackData = (elem: any, ShowingData: any) => {
    this.setState({
      ShowingAllData: ShowingData,
    });
  };

  private SelectedAllTeam = (e: any) => {
    let currentuserId =
      this.props.Context.pageContext?._legacyPageContext.userId;
    if (e.target.checked == true) {
      AllTaskUser?.forEach((val: any) => {
        let user: any = [];
        if (
          (val?.UserGroup?.Title == "Developers Team" ||
            val?.UserGroup?.Title == "Smalsus Lead Team" ||
            val?.UserGroup?.Title == "Junior Task Management" ||
            val?.UserGroup?.Title == "Portfolio Lead Team" ||
            val?.UserGroup?.Title == "Design Team" ||
            val?.UserGroup?.Title == "QA Team" ||
            val?.UserGroup?.Title == "Trainees") &&
          val?.AssingedToUserId != currentuserId
        ) {
          // Check if the item already exists in ImageSelectedUsers
          const existingUser = this.state.ImageSelectedUsers.find(
            (user: any) => user.AssingedToUserId === val.AssingedToUserId
          );
          if (!existingUser) {
            // If not exists, then push
            this.setState((prevState) => ({
              ImageSelectedUsers: [...prevState.ImageSelectedUsers, val],
            }));
          }
        }
      });
    } else {
      const filteredArray: any = [];
      this.state.ImageSelectedUsers.forEach((user: any) => {
        if (user?.AssingedToUserId == currentuserId) {
          filteredArray.push(user);
        }
      });
      // Update state with the filtered array
      this.setState({ ImageSelectedUsers: filteredArray });
    }

    this.setState({ showShareTimesheet: true });
  };

  private shareTaskInEmail = () => {
    if (DateType == "Custom") {
      let start = Moment(this.state.startdate).format("DD/MM/YYYY");
      let end = Moment(this.state.enddate).format("DD/MM/YYYY");
      DateType = `${start} - ${end}`;
    }
    if (totalTimedata.length == 0) {
      alert("Data is not available in table");
    } else {
      this.setState({ IsShareTimeEntry: true });
      if (this.state.ImageSelectedUsers.length == 1) {
        globalCommon.ShareTimeSheet(
          this.state.resultSummary.totalTime,
          totalTimedata,
          AllTaskUser,
          this?.props?.Context,
          DateType
        );
      } else {

        let TimeSheetDetails: any = {}
        TimeSheetDetails['ManagementCount'] = ManagementCount,
          TimeSheetDetails['managementMembers'] = managementMembers,
          TimeSheetDetails['ManagementTime'] = ManagementTime,
          TimeSheetDetails['managementleaveHours'] = managementleaveHours,
          TimeSheetDetails['DevCount'] = DevCount,
          TimeSheetDetails['DevelopmentMembers'] = DevelopmentMembers,
          TimeSheetDetails['DevloperTime'] = DevloperTime,
          TimeSheetDetails['DevelopmentleaveHours'] = DevelopmentleaveHours,
          TimeSheetDetails['DesignCount'] = DesignCount,
          TimeSheetDetails['DesignMembers'] = DesignMembers,
          TimeSheetDetails['DesignTime'] = DesignTime,
          TimeSheetDetails['DesignMemberleaveHours'] = DesignMemberleaveHours,
          TimeSheetDetails['QACount'] = QACount,
          TimeSheetDetails['QAMembers'] = QAMembers,
          TimeSheetDetails['QATime'] = QATime,
          TimeSheetDetails['QAleaveHours'] = QAleaveHours,
          TimeSheetDetails['TotleTaskTime'] = TotleTaskTime,
          TimeSheetDetails['TotalleaveHours'] = TotalleaveHours
          globalCommon.ShareTimeSheetMultiUser(
          this.state.AllTimeEntry,
          AllTaskUser,
          this?.props?.Context,
          DateType,
          this.state.ImageSelectedUsers,
          TimeSheetDetails
        );
      }
    }
  };
  private clearDateFiltersWorkingAction = () => {
    this.setState({
      selectedRadio: '',
      startdate: null,
      enddate: null,
    });
  };
  public render(): React.ReactElement<IUserTimeEntryProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName,
    } = this.props;
    return (
      <div id="TimeSheet-Section">
        {this.state.loaded && <PageLoader />}
        <div>
          <div className="p-0" style={{ verticalAlign: "top" }}>
            <h2 className="heading d-flex justify-content-between align-items-center">
              <span>
                {" "}
                <a>All Timesheets</a>{" "}
              </span>
              <span className="text-end fs-6">
                {/* <a
                  target="_blank"
                  data-interception="off"
                  href={`${this.props.Context.pageContext.web.absoluteUrl}/SitePages/UserTimeEntry-Old.aspx`}
                >
                  Old UserTimeEntry
                </a> */}
              </span>
            </h2>
          </div>
          <Col className="smartFilter bg-light border mb-3 ">
            <details className="p-0 m-0 allfilter" open>
              <summary className="justify-content-start valign-middle">
                <a className="fw-semibold hreflink mr-5 pe-2 pull-left ">
                  All Filters -{" "}
                  <span className="me-1 fw-normal">Task User :</span>{" "}
                </a>
                {this.state.ImageSelectedUsers != null &&
                  this.state.ImageSelectedUsers.length > 0 &&
                  this.state.ImageSelectedUsers.map((user: any, i: number) => {
                    return user?.Item_x0020_Cover != undefined &&
                      user.Item_x0020_Cover?.Url != undefined ? (
                      <span>
                        {" "}
                        <img
                          className="ProirityAssignedUserPhoto mr-5"
                          title={user?.AssingedToUser?.Title}
                          src={user?.Item_x0020_Cover?.Url}
                        />{" "}
                      </span>
                    ) : (
                      <span
                        className="suffix_Usericon showSuffixIcon m-1"
                        title={user?.Title}
                      >
                        {user?.Suffix}
                      </span>
                    );
                  })}
                <label className="ms-3">
                  {" "}
                  <input
                    type="checkbox"
                    className="form-check-input me-1"
                    onClick={(e) => this.SelectedAllTeam(e)}
                  />{" "}
                  Select All
                </label>
                <label className="d-flex ml-60">
                  <a className="fw-semibold mx-3">Select Sites</a>
                  <div className="d-flex gap-2">

                    {validSites.map((val: any, index: number) => (
                      <div key={index}>

                        <input
                          checked={val?.isSelected}
                          type="checkbox"
                          className="form-check-input me-1"
                          onChange={(e) => this.SelectSites(val, e)}
                        />
                        {val?.Title}
                      </div>
                    ))}

                  </div>


                </label>
              </summary>
              <Col className="allfilter">
                <Col className="subfilters">
                  <details open className="p-0 m-0">
                    <span className="pull-right" style={{ display: "none" }}>
                      <input
                        type="checkbox"
                        className=""
                        onClick={(e) => this.SelectAllGroupMember(e)}
                      />
                      <label>Select All </label>
                    </span>
                    <summary>
                      <span className="fw-semibold f-15 fw-semibold">
                        Team members
                      </span>
                    </summary>
                    <hr style={{ width: "98%", marginLeft: "30px" }}></hr>
                    <div style={{ display: "block" }}>
                      <div className="taskTeamBox ps-30 my-2">
                        {this.state.taskUsers != null &&
                          this.state.taskUsers.length > 0 &&
                          this.state.taskUsers.map((users: any, i: number) => {
                            return (
                              users?.childs?.length > 0 && (
                                <div className="top-assign">
                                  <div className="team ">
                                    <label className="BdrBtm">
                                      <input
                                        style={{ display: "none" }}
                                        className=""
                                        type="checkbox"
                                        onClick={(e) =>
                                          this.SelectedGroup(e, users)
                                        }
                                      />
                                      {users.childs.length > 0 && (
                                        <> {users.Title} </>
                                      )}
                                    </label>
                                    <div className="d-flex">
                                      {users.childs.length > 0 &&
                                        users.childs.map(
                                          (item: any, i: number) => {
                                            return (
                                              item.AssingedToUser !=
                                              undefined && (
                                                <div className="alignCenter">
                                                  {item.Item_x0020_Cover !=
                                                    undefined &&
                                                    item.AssingedToUser !=
                                                    undefined ? (
                                                    <span>
                                                      <img
                                                        id={"UserImg" + item.Id}
                                                        className={
                                                          item?.AssingedToUserId ==
                                                            user?.Id
                                                            ? "activeimg seclected-Image ProirityAssignedUserPhoto"
                                                            : "ProirityAssignedUserPhoto"
                                                        }
                                                        onClick={(e) =>
                                                          this.SelectUserImage(
                                                            e,
                                                            item
                                                          )
                                                        }
                                                        ui-draggable="true"
                                                        on-drop-success="dropSuccessHandler($event, $index, user.childs)"
                                                        title={
                                                          item.AssingedToUser
                                                            .Title
                                                        }
                                                        src={
                                                          item.Item_x0020_Cover
                                                            .Url
                                                        }
                                                      />
                                                    </span>
                                                  ) : (
                                                    <span
                                                      id={"UserImg" + item.Id}
                                                      className={
                                                        item?.AssingedToUserId ==
                                                          user?.Id
                                                          ? "activeimg newDynamicUserIcon"
                                                          : "newDynamicUserIcon"
                                                      }
                                                      title={item.Title}
                                                      onClick={(e) =>
                                                        this.SelectUserImage(
                                                          e,
                                                          item
                                                        )
                                                      }
                                                      ui-draggable="true"
                                                      on-drop-success="dropSuccessHandler($event, $index, user.childs)"
                                                    >
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
                  <details className="m-0" open>
                    <summary>
                      <span className="fw-semibold f-15 fw-semibold">
                        {" "}
                        Date
                      </span>{" "}
                    </summary>
                    <hr style={{ width: "98%", marginLeft: "30px" }}></hr>
                    <Row className="ps-30 my-2">
                      <div className="ps-2">
                        <div className="col TimeReportDays">
                          <span className="SpfxCheckRadio">
                            <input
                              type="radio"
                              className="radio"
                              name="dateSelection"
                              id="rdCustom"
                              value="Custom"
                              checked={
                                this.state.selectedRadio === "Custom" ||
                                (this.state.startdate !== null &&
                                  this.state.enddate !== null &&
                                  !this.state.selectedRadio)
                              }
                              onClick={() => this.selectDate("Custom")}
                            />
                            <label>Custom</label>
                          </span>
                          <span className="SpfxCheckRadio">
                            <input
                              type="radio"
                              name="dateSelection"
                              value="today"
                              id="rdToday"
                              checked={this.state.selectedRadio === "today"}
                              onClick={() => this.selectDate("today")}
                              className="radio"
                            />
                            <label>Today</label>
                          </span>
                          <span className="SpfxCheckRadio">
                            <input
                              type="radio"
                              name="dateSelection"
                              value="yesterday"
                              id="rdYesterday"
                              checked={this.state.selectedRadio === "yesterday"}
                              onClick={() => this.selectDate("yesterday")}
                              className="radio"
                            />
                            <label> Yesterday </label>
                          </span>
                          <span className="SpfxCheckRadio">
                            <input
                              type="radio"
                              name="dateSelection"
                              defaultChecked={true}
                              id="rdThisWeek"
                              value="ThisWeek"
                              checked={this.state.selectedRadio === "ThisWeek"}
                              onClick={() => this.selectDate("ThisWeek")}
                              className="radio"
                            />
                            <label> This Week</label>
                          </span>
                          <span className="SpfxCheckRadio">
                            <input
                              type="radio"
                              name="dateSelection"
                              value="LastWeek"
                              id="rdLastWeek"
                              checked={this.state.selectedRadio === "LastWeek"}
                              onClick={() => this.selectDate("LastWeek")}
                              className="radio"
                            />
                            <label> Last Week</label>
                          </span>
                          <span className="SpfxCheckRadio">
                            <input
                              type="radio"
                              name="dateSelection"
                              id="rdThisMonth"
                              value="EntrieMonth"
                              checked={
                                this.state.selectedRadio === "EntrieMonth"
                              }
                              onClick={() => this.selectDate("EntrieMonth")}
                              className="radio"
                            />
                            <label>This Month</label>
                          </span>
                          <span className="SpfxCheckRadio">
                            <input
                              type="radio"
                              name="dateSelection"
                              id="rdLastMonth"
                              value="LastMonth"
                              checked={this.state.selectedRadio === "LastMonth"}
                              onClick={() => this.selectDate("LastMonth")}
                              className="radio"
                            />
                            <label>Last Month</label>
                          </span>
                          <span className="SpfxCheckRadio">
                            <input
                              type="radio"
                              name="dateSelection"
                              value="Last3Month"
                              checked={
                                this.state.selectedRadio === "Last3Month"
                              }
                              onClick={() => this.selectDate("Last3Month")}
                              className="radio"
                            />
                            <label>Last 3 Months</label>
                          </span>
                          <span className="SpfxCheckRadio">
                            <input
                              type="radio"
                              name="dateSelection"
                              value="EntrieYear"
                              checked={
                                this.state.selectedRadio === "EntrieYear"
                              }
                              onClick={() => this.selectDate("EntrieYear")}
                              className="radio"
                            />
                            <label>This Year</label>
                          </span>
                          <span className="SpfxCheckRadio">
                            <input
                              type="radio"
                              name="dateSelection"
                              value="LastYear"
                              checked={this.state.selectedRadio === "LastYear"}
                              onClick={() => this.selectDate("LastYear")}
                              className="radio"
                            />
                            <label>Last Year</label>
                          </span>
                          <span className="SpfxCheckRadio">
                            <input
                              type="radio"
                              name="dateSelection"
                              value="AllTime"
                              checked={this.state.selectedRadio === "AllTime"}
                              onClick={() => this.selectDate("AllTime")}
                              className="radio"
                            />
                            <label>All Time</label>
                          </span>
                          <span className="SpfxCheckRadio">
                            <input
                              type="radio"
                              name="dateSelection"
                              value="Presettime"
                              checked={
                                this.state.selectedRadio === "Presettime"
                              }
                              onClick={() => this.selectDate("Presettime")}
                              className="radio"
                            />
                            <label>Pre-set</label>
                            <span
                              className="svg__iconbox svg__icon--editBox alignIcon hreflink"
                              onClick={() => this.OpenPresetDatePopup()}
                            ></span>
                          </span>
                        </div>
                      </div>
                    </Row>
                    <Row className="ps-30 mb-2">
                      <div className="col-1" style={{ width: "180px" }}>
                        <div className="input-group">
                          <label className="full-width">Start Date</label>
                          <span>
                            <DatePicker
                              selected={this.state.startdate}
                              data-input-type="First"
                              onChange={(date: any) => this.setStartDate(date)}
                              dateFormat="dd/MM/yyyy" // Format as DD/MM/YYYY
                              className="form-control date-picker p-1"
                              popperPlacement="bottom-start"
                              customInput={<this.ExampleCustomInputStrat />}
                            />
                          </span>
                        </div>
                      </div>
                      <div className="col-1" style={{ width: "180px" }}>
                        <div className="input-group">
                          <label className="full-width">End Date</label>
                          <span>
                            <DatePicker
                              selected={this.state.enddate}
                              onChange={(date: any) => this.setEndDate(date)}
                              dateFormat="dd/MM/yyyy" // Format as DD/MM/YYYY
                              className="form-control date-picker p-1"
                              popperPlacement="bottom-start"
                              customInput={<this.ExampleCustomInputEnd />}
                            />
                          </span>
                        </div>
                      </div>
                      <div className="col-1"><label className="hreflink pt-4" title="Clear Date Filters" onClick={this.clearDateFiltersWorkingAction}><strong style={{ color: `${portfolioColor}` }} >Clear</strong></label></div>
                      <div className="col">
                        <div className="mt-1">
                          <label className="full_width">Portfolio Item</label>
                          <label>
                            {" "}
                            <input
                              type="checkbox"
                              checked={this.state?.IsCheckedComponent}
                              className="form-check-input"
                              onClick={(e) =>
                                this.SelectedPortfolioItem(e, "Component")
                              }
                            />{" "}
                            Component
                          </label>
                          <label>
                            <input
                              type="checkbox"
                              checked={this.state?.IsCheckedService}
                              className="form-check-input ml-12"
                              onClick={(e) =>
                                this.SelectedPortfolioItem(e, "Service")
                              }
                            />{" "}
                            Service
                          </label>
                        </div>
                      </div>
                    </Row>
                  </details>
                  <div id="showFilterBox" className="col m-0 p-0 ">
                    <div className="togglebox">
                      <details open>
                        <summary>
                          <span className="fw-semibold f-15 fw-semibold">
                            {" "}
                            SmartSearch – Filters
                          </span>
                          <span className="f-14 ps-2">
                            {this.state.checkedAll &&
                              this.state.filterItems != null &&
                              this.state.filterItems.length > 0 &&
                              this.state.filterItems.map((obj: any) => {
                                return (
                                  <span>
                                    {" "}
                                    {obj.Title}
                                    <span>
                                      {" "}
                                      : ({this.getAllSubChildenCount(obj)}){" "}
                                    </span>
                                  </span>
                                );
                              })}
                            {this.state.checkedAllSites &&
                              this.state.filterSites != null &&
                              this.state.filterSites.length > 0 &&
                              this.state.filterSites?.map((obj: any) => {
                                return (
                                  <span>
                                    {" "}
                                    {obj.Title}
                                    <span>
                                      {" "}
                                      : ({this.getAllSubChildenCount(obj)}){" "}
                                    </span>
                                  </span>
                                );
                              })}
                            {this.state.checkedParentNode != null &&
                              !this.state.checkedAll &&
                              this.state.checkedParentNode.length > 0 &&
                              this.state.checkedParentNode.map((obj: any) => {
                                return (
                                  <span>
                                    {" "}
                                    {obj.Title}
                                    <span>
                                      {" "}
                                      : ({this.getAllSubChildenCount(obj)}){" "}
                                    </span>
                                  </span>
                                );
                              })}
                          </span>
                        </summary>
                        <hr style={{ width: "98%", marginLeft: "30px" }}></hr>
                        <div
                          className="togglecontent my-2"
                          style={{ display: "block", paddingLeft: "24px" }}
                        >
                          <div className="smartSearch-Filter-Section">
                            <table width="100%" className="indicator_search">
                              <tbody>
                                <tr>
                                  <td valign="top">
                                    <div className="row">
                                      <div className="col-md-4">
                                        <div className="col-md-10">
                                          <label className="border-bottom full-width pb-1">
                                            <input
                                              id="chkAllCategory"
                                              defaultChecked={
                                                this.state.checkedAll
                                              }
                                              onClick={(e) =>
                                                this.SelectAllCategories(e)
                                              }
                                              type="checkbox"
                                              className="form-check-input me-1"
                                            />
                                            Client Category
                                          </label>
                                          <div className="custom-checkbox-tree">
                                            <CheckboxTree
                                              nodes={this.state.filterItems}
                                              checked={this.state.checked}
                                              expanded={this.state.expanded}
                                              onCheck={(checked) =>
                                                this.setState({ checked })
                                              }
                                              onExpand={(expanded) =>
                                                this.ExpandClientCategory(
                                                  expanded
                                                )
                                              }
                                              nativeCheckboxes={true}
                                              showNodeIcon={false}
                                              checkModel={"all"}
                                              icons={{
                                                expandOpen: <SlArrowDown />,
                                                expandClose: <SlArrowRight />,
                                                parentClose: null,
                                                parentOpen: null,
                                                leaf: null,
                                              }}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-4">
                                        <div className="col-md-10">
                                          <label className="border-bottom full-width pb-1">
                                            <input
                                              type="checkbox"
                                              id="chkAllSites"
                                              defaultChecked={
                                                this.state.checkedAllSites
                                              }
                                              onClick={(e) =>
                                                this.SelectAllSits(e)
                                              }
                                              className="form-check-input me-1"
                                            />
                                            Sites
                                          </label>
                                          <div className="custom-checkbox-tree">
                                            <CheckboxTree
                                              nodes={this.state.filterSites}
                                              checked={this.state.checkedSites}
                                              expanded={
                                                this.state.expandedSites
                                              }
                                              onCheck={(checkedSites) =>
                                                this.setState({ checkedSites })
                                              }
                                              onExpand={(expandedSites) =>
                                                this.ExpandSite(expandedSites)
                                              }
                                              nativeCheckboxes={true}
                                              showNodeIcon={false}
                                              checkModel={"all"}
                                              icons={{
                                                expandOpen: <SlArrowDown />,
                                                expandClose: <SlArrowRight />,
                                                parentClose: null,
                                                parentOpen: null,
                                                leaf: null,
                                              }}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-4">
                                        <table className="table Alltable">
                                          <thead>
                                            <tr>
                                              <td><b>Team</b></td>
                                              <td><b>Total Employees</b></td>
                                              <td><b>Employees on leave</b></td>
                                              <td><b>Hours</b></td>
                                              <td><b>Leave Hours</b></td>

                                            </tr>
                                          </thead>
                                          <tbody>
                                            <tr>
                                              <td><b>Management</b></td>
                                              <td>{ManagementCount}</td>
                                              <td>{managementMembers}</td>
                                              <td>{ManagementTime.toFixed(2)}</td>
                                              <td>{managementleaveHours}</td>
                                            </tr>
                                            <tr>
                                              <td><b>Technical Team</b></td>
                                              <td>{DevCount}</td>
                                              <td>{DevelopmentMembers}</td>
                                              <td>{DevloperTime.toFixed(2)}</td>
                                              <td>{DevelopmentleaveHours}</td>
                                            </tr>
                                            <tr>
                                              <td><b>Design</b></td>
                                              <td>{DesignCount}</td>
                                              <td>{DesignMembers}</td>
                                              <td>{DesignTime.toFixed(2)}</td>
                                              <td>{DesignMemberleaveHours}</td>
                                            </tr>
                                            <tr>
                                              <td><b>QA</b></td>
                                              <td>{QACount}</td>
                                              <td>{QAMembers}</td>
                                              <td>{QATime.toFixed(2)}</td>
                                              <td>{QAleaveHours}</td>
                                            </tr>
                                            <tr>
                                              <td><b>Total</b></td>
                                              <td>{(DesignCount + DevCount + QACount + ManagementCount).toFixed(2)}</td>
                                              <td>{(DesignMembers + DevelopmentMembers + QAMembers).toFixed(2)}</td>
                                              <td>{TotleTaskTime.toFixed(2)}</td>
                                              <td>{TotalleaveHours}</td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </details>
                    </div>
                  </div>
                  {/* {this.state.IsShareTimeEntry && <ShareTimeSheet  close={this.closeTimesheetCom} AllTaskTimeEntries={totalTimedata} taskUser={AllTaskUser} Context={this?.props?.Context} props={this?.props} type={DateType}/>} */}
                  <div className="col text-end mb-2">
                    <button
                      type="button"
                      className="btnCol btn btn-primary me-1"
                      onClick={(e) => this.LoadAllTimeSheetaData()}
                    >
                      Update Filters
                    </button>
                    <button
                      type="button"
                      className="btn btn-default me-1"
                      onClick={() => this.ClearFilters()}
                    >
                      Clear Filters
                    </button>
                  </div>
                </Col>
              </Col>
            </details>

            <span
              className={
                this.state.disableProperty
                  ? "Disabled-Link align-autoplay d-flex float-end my-1 text-black-50"
                  : "align-autoplay d-flex float-end my-1"
              }
              onClick={() => this.shareTaskInEmail()}
            >
              <span className="svg__iconbox svg__icon--mail ms-1"></span>Share{" "}
              {DateType}'s Time Entry
            </span>

          </Col>
          <div className="col">
            <section className="TableContentSection">
              <div className="Alltable p-0">
                <span>
                  {/* {this.state.IsOpenTimeSheetPopup == true && <EmployeePieChart  selectedUser={this.state.ImageSelectedUsers} IsOpenTimeSheetPopup={this.state.IsOpenTimeSheetPopup} Call={() => { this.CallBack() }} selected/>} */}
                  {this.state.IsOpenTimeSheetPopup == true && (
                    <GraphData
                      data={this.state.AllTimeEntry}
                      IsOpenTimeSheetPopup={this.state.IsOpenTimeSheetPopup}
                      DateType={DateType}
                      Call={() => {
                        this.CallBack();
                      }}
                      selected
                    />
                  )}
                </span>

                <div className="wrapper">
                  <GlobalCommanTable
                    expandIcon={true}
                    customHeaderButtonAvailable={true}
                    customTableHeaderButtons={this.customTableHeaderButtons}
                    hideTeamIcon={true}
                    showCatIcon={true}
                    exportToExcelCategoryReport={this.exportToExcel}
                    showHeader={true}
                    showDateTime={
                      " | Time: " +
                      this.state.resultSummary.totalTime +
                      " | Days: (" +
                      this.state.resultSummary.totalDays +
                      ")"
                    }
                    columns={this.state.columns}
                    data={this.state.AllTimeEntry}
                    callBackData={this.callBackData}
                    TaskUsers={AllTaskUser}
                    AllListId={this?.props}
                    portfolioColor={portfolioColor}
                  />
                </div>
              </div>
            </section>
          </div>
        </div>
        {this.state.IsTask && (
          <EditTaskPopup
            Items={this.state.IsTask}
            Call={() => {
              this.Call(undefined);
            }}
            AllListId={AllListId}
            context={this?.props?.Context}
          ></EditTaskPopup>
        )}
        {this.state?.IsMasterTask && (
          <CentralizedSiteComposition
            ItemDetails={this.state?.IsMasterTask}
            RequiredListIds={AllListId}
            closePopupCallBack={() => {
              this.Call("Master Task");
            }}
            usedFor={"CSF"}
          />
        )}
        {this.state.IsPresetPopup && (
          <PreSetDatePikerPannel
            isOpen={this.state.IsPresetPopup}
            PreSetPikerCallBack={this.PreSetPikerCallBack}
            portfolioColor={portfolioColor}
          ></PreSetDatePikerPannel>
        )}
        {this.state.IsTimeEntry && (
          <TimeEntryPopup
            props={this.state.TimeComponent}
            CallBackTimeEntry={this.TimeEntryCallBack}
            Context={this?.props?.Context}
          ></TimeEntryPopup>
        )}
        <div className="clearfix"></div>
      </div>
    );
  }
}