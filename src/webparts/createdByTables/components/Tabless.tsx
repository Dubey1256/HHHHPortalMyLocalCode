import * as React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import { Button, Table, Row, Col, Pagination, PaginationLink, PaginationItem, Input } from "reactstrap";
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaAngleLeft, FaAngleRight, FaCaretDown, FaCaretRight, FaSort, FaSortDown, FaSortUp, FaFilter, FaPaintBrush } from "react-icons/fa";
import {
    useTable,
    useSortBy,
    useFilters,
    useGlobalFilter,
    useExpanded,
    usePagination,
    HeaderGroup,

} from 'react-table';
// import styles from './CreatedByTables.module.scss';
import './Style.css';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { Filter, DefaultColumnFilter } from './filters';
import { Web } from "sp-pnp-js";
// import * as Moment from 'moment';
import moment from 'moment';
import ShowTaskTeamMembers from '../../../globalComponents/ShowTaskTeamMembers';
import ExpandTable from '../../../globalComponents/ExpandTable/Expandtable';
import EditTaskPopup from '../../../globalComponents/EditTaskPopup/EditTaskPopup';
import { RiFileExcel2Fill } from 'react-icons/ri';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import GlobalCommanTable from '../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable';

const Tabless = (props: any) => {
    let count: any = 0;
    let AllListId: any = {
      MasterTaskListID: props?.Items?.MasterTaskListID,
      TaskUsertListID: props?.Items?.TaskUsertListID,
      SmartMetadataListID: props?.Items?.SmartMetadataListID,
      //SiteTaskListID:this.props?.props?.SiteTaskListID,
      TaskTimeSheetListID: props?.Items?.TaskTimeSheetListID,
      DocumentsListID: props?.Items?.DocumentsListID,
      SmartInformationListID: props?.Items?.SmartInformationListID,
      siteUrl: props?.Items?.siteUrl,
      AdminConfigrationListID: props?.Items?.AdminConfigrationListID,
      isShowTimeEntry: props?.Items?.isShowTimeEntry,
      isShowSiteCompostion: props?.Items?.isShowSiteCompostion,
    };
    let allData: any = [];
    let userlists: any = [];
    let QueryId: any;
    let dataLength: any = [];
    let priorAndPercen: any = [];
    const [priorPercenChecked, setPriorPercenChecked]: any = React.useState([]);
    const [checkPercentage, setPercentagess]: any = React.useState([]);
    const [checkPriority,setPriorityss]: any = React.useState([]) ;
    let filteringColumn: any = {idType:true,due: true,  modify: true,  created: true,  priority: true,  percentage: true,  catogries: true,teamMembers:true};
    let excelSelct:any = [{item:'Task ID',value:'siteType'}, {item:'Category Item',value:'Categories'},{item:'Priority',value:'priority'}, {item:"Modified",value:'newModified'},{item:"Usertitle",value:'Editorss'},{item:"Title",value:'Title'},{item:"Percent Complete",value:'percentage'},{item:"Due Date",value:"newDueDate"},{item:"Created",value:'newCreated'}, {item:"URL",value:'Urlss'}]
    // let [clearFiltering, setClearFiltering]: any = {due: "",modify: "",created: "",priority: "",percentage: "",catogries: ""};
    const [result, setResult]: any = React.useState(false);
    const [editPopup, setEditPopup]: any = React.useState(false);
    const [queryId, setQueryId]: any = React.useState([]);
    const [data, setData]: any = React.useState([]);
    const [selectExcelData, setSelectExcelData]: any = React.useState([]);
    const [taskUser, setTaskUser]: any = React.useState([]);
    const [catogries, setCatogries]: any = React.useState([]);
    const [filterCatogries, setFilterCatogries]: any = React.useState([]);
    const [allLists, setAllLists]: any = React.useState([]);
    const [checkComSer, setCheckComSer]: any = React.useState({component: "",services: "",});
    const [tablecontiner, settablecontiner]: any = React.useState("hundred");
    const [checkPercentages, setCheckPercentage]: any = React.useState([]);
    const [checkTeamMembers, setCheckTeamMembers]: any = React.useState([]);
    const [checkPrioritys, setCheckPriority]: any = React.useState([]);
    const [checkedValues, setCheckedValues]:any = React.useState([]);
    const [copyData, setCopyData]: any = React.useState([]);
    const [copyData1, setCopyData1]: any = React.useState([]);
    const [date, setDate]: any = React.useState({due: null, modify: null, created: null});
    const [priorAndPerc, setPriorAndPerc]:any = React.useState({priority:true,percentage:true})
    const [selectAllChecks, setSelectAllChecks]: any = React.useState({idType:false, priority: false,  percentage: false,  catogries: false,teamMembers:false});
    const [radio, setRadio]: any = React.useState({due: true, modify: true, created: true, priority: true, percentage: true});
    const fileType ="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    

    const columns = React.useMemo(
        () => [
            {
              accessorFn: (row:any) => row?.idType,
              cell: ({ row, getValue }:any) => (
                <div>
                <span><img style={{ width: "25px", height: '25px', borderRadius: '20px' }} src={row?.original?.siteIcon} /></span>
                <span className={row.original.Services.length >= 1 && 'text-success'}>{row?.original?.idType}</span>
            </div>
              ),
              id: "idType",
              placeholder: "Task ID",
              header: "",
              resetColumnFilters: false,
              size: 70,
             },
            {

              accessorFn: (row:any) => row?.Title,
              cell: ({ row, getValue }:any) => (
                <div>
                {/* <a className={row.original.Services.length >= 1 && 'text-success'} style={{textDecoration:'none',cursor:'pointer'}} target="_blank" href={`${props.Items.siteUrl}/SitePages/Task-Profile.aspx?taskId=${row.original.Id}&Site=${row.original.site}`}>{row?.original?.Title}</a> */}
                <a
                className={row.original.Services.length >= 1 && 'text-success'} style={{textDecoration:'none',cursor:'pointer'}}
href={`${props.Items.siteUrl}/SitePages/Task-Profile.aspx?taskId=${row.original.Id}&Site=${row.original.site}`}
rel='noopener noreferrer'
onClick={(e:any) => {
  e.preventDefault();
  openInNewTab(e.target.href);
}}
>
{row?.original?.Title}
</a>
            </div>
              ),
              id: "Title",
              placeholder: "Task Title",
              header: "",
              resetColumnFilters: false,
              size: 140,

            },
            {

              accessorFn: (row:any) => row?.Categories,
              cell: ({ row, getValue }:any) => (
                <div>
                <span className={row.original.Services.length >= 1 && 'text-success'}>{row?.original?.Categories}</span>
            </div>
              ),
              id: "Categories",
              placeholder: "Categories",
              header: "",
              resetColumnFilters: false,
              size: 80,
            },
            {

         
              accessorFn: (row:any) => row?.percentage,
              cell: ({ row, getValue }:any) => (
                <div>
                <span className={row.original.Services.length >= 1 && 'text-success'}>{row?.original?.percentage}</span>
            </div>
              ),
              id: "percentage",
              placeholder: "%",
              header: "",
              resetColumnFilters: false,
              size: 50,
            },
            {
              accessorFn: (row:any) => row?.Priority,
              cell: ({ row, getValue }:any) => (
                <div>
                        <span className={row.original.Services.length >= 1 && 'text-success'}>{row?.original?.priority}</span>
                    </div>
              ),
              id: "Priority",
              placeholder: "Priority",
              header: "",
              resetColumnFilters: false,
              size: 50,
            },
            {

              accessorFn: (row:any) => row?.dueDate,
              cell: ({ row, getValue }:any) => (
                <div>
                <div className={row.original.Services.length >= 1 && 'text-success'}>{row?.original?.newDueDate}</div>
            </div>
              ),
              id: "dueDate",
              placeholder: "Due Date",
              header: "",
              resetColumnFilters: false,
              size: 75,

            },

            {

              accessorFn: (row:any) => row?.modified,
              cell: ({ row, getValue }:any) => (
                <div>
                <a style={{textDecoration:'none',cursor:'pointer'}} className={row.original.Services.length >= 1 && 'text-success'} target='_blank' href={`${props.Items.siteUrl}/SitePages/TaskDashboard.aspx?UserId=${row?.original?.Editor?.Id}&Name=${row?.original?.Editor?.Title}`}>
                {row?.original?.newModified}
                <span><img style={{ width: "25px", height: '25px', borderRadius: '20px' }} src={row?.original?.editorImg} /></span>
                </a>
            </div>
              ),
              id: "modified",
              placeholder: "Modified",
              header: "",
              resetColumnFilters: false,
              size: 110,
            },
            {

              accessorFn: (row:any) => row?.created,
              cell: ({ row, getValue }:any) => (
                <div>
                <a style={{textDecoration:'none',cursor:'pointer'}} className={row.original.Services.length >= 1 && 'text-success'} target='_blank' href={`${props.Items.siteUrl}/SitePages/TaskDashboard.aspx?UserId=${row?.original?.Author?.Id}&Name=${row?.original?.Author?.Title}`}>
                {row?.original?.newCreated}
                <span><img style={{ width: "25px", height: '25px', borderRadius: '20px' }} src={row?.original?.authorImg} /></span>
                </a>
            </div>
              ),
              id: "created",
              placeholder: "Created",
              header: "",
              resetColumnFilters: false,
              size: 110,
            },
            {
              accessorFn: (row:any) => row?.TeamMembersSearch,
              cell: ({ row, getValue }:any) => (
                <span>
                        <ShowTaskTeamMembers props={row?.original} TaskUsers={taskUser} />
                      </span>
              ),
              id: "TeamMembersSearch",
              placeholder: "Team Members",
              header: "",
              resetColumnFilters: false,
              size: 75,
            },
            {
              accessorFn: (row:any) => row?.TeamMembersSearch,
              cell: ({ row, getValue }:any) => (
                <span>
                <span title="Edit Task" className="svg__iconbox svg__icon--edit hreflink ms-1" onClick={()=>editPopFunc(row.original)} ></span>
                <span title="Delete Task" className="svg__iconbox svg__icon--trash hreflink"  onClick={()=>deleteItemFunction(row.original)} ></span>
            </span>
              ),
              id: "ID",
              resetColumnFilters: false,
              size: 60,
            },
        ],
        [data]
    );


    const deleteItemFunction = async (item: any) => {
      let confirmation = confirm("Are you sure you want to delete this task ?");
      if (confirmation) {
        try {
          if (item.listId != undefined) {
            let web = new Web(props.Items.siteUrl);
            await web.lists
              .getById(item.listId)
              .items.getById(item.ID)
              .recycle();
          }
          getTaskUserData();
          console.log("Your post has been deleted successfully");
        } catch (error) {
          console.log("Error:", error.message);
        }
      }
    };


     const editPopFunc=(item:any)=>{
      setEditPopup(true);
      setResult(item)
      }

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        canPreviousPage,
        canNextPage,
        gotoPage,
         pageCount,
         previousPage,
         nextPage,
        setPageSize,
        filter,
        setGlobalFilter,
        state,
        state: { pageIndex, pageSize },
    }: any = useTable(
        {
            columns,
            data,
            defaultColumn: { Filter: DefaultColumnFilter },
            initialState: { pageIndex: 0, pageSize: 10,sortBy: [
              {
                  id: 'created',
                  desc: true
              }
          ] },
        },
        useFilters,
        useGlobalFilter,
        useSortBy,
        useExpanded,
        usePagination,
        
    );



   const {globalFilter} = state;

   const onChangeInSelect = (event: any) => {
    setPageSize(Number(event.target.value));
      };

    const getSelectedSite = (e: any, column: any) => {
      const { value, checked } = e.target;
      console.log(value, checked);
      switch (column) {
        case "idType":
          if (checked) {
            setCheckedValues([...checkedValues, value]);
          } else {
            setSelectAllChecks({...selectAllChecks,idType:false})
            setCheckedValues(checkedValues.filter((val:any) => val !== value));
          }
          break;
        case "Categories":
          if (checked) {
            setFilterCatogries([...filterCatogries, value]);
          } else {
            setSelectAllChecks({...selectAllChecks,catogries:false})
            setFilterCatogries(
              filterCatogries.filter((val: any) => val !== value)
            );
          }
          break;
        case "percentage":
          if (checked) {
            setCheckPercentage([...checkPercentages, value]);
          } else {
            setSelectAllChecks({...selectAllChecks,percentage:false})
            setCheckPercentage(
              checkPercentages.filter((val: any) => val !== value)
            );
          }
          break;
        case "priority":
          if (checked) {
            setCheckPriority([...checkPrioritys, value]);
          } else {
            setSelectAllChecks({...selectAllChecks,priority:false})
            setCheckPriority(
              checkPrioritys.filter((val: any) => val !== value)
            );
          }

          break;
          case "TeamMembersSearch":
          if (checked) {
            setCheckTeamMembers([...checkTeamMembers, value]);
          } else {
            setSelectAllChecks({...selectAllChecks,teamMembers:false})
            setCheckTeamMembers(
              checkTeamMembers.filter((val: any) => val !== value)
            );
          }
          break;
      }
    };

    const expndpopup = (e: any) => {
      settablecontiner(e);
    };

    // const listFilter = () => {
    //   setCopyData1(copyData);
    //   QueryId = queryId;
    //   userlists = taskUser;
    //   allLists?.map((alllists: any) => {
    //     checkedValues?.map((checkedlists: any) => {
    //       if (alllists?.Title == checkedlists) {
    //         let a: any = JSON.parse(alllists?.Configurations);
    //         a?.map((newitem: any) => {
    //           dataLength.push(newitem);

    //           getAllData(newitem);
    //         });
    //       }
    //     });
    //   });
    // };

      
    const listFilters1=()=>{
        let newData=copyData;


        if (checkedValues.length >= 1 && filteringColumn.idType) {
          let localArray: any = [];
          newData?.map((alldataitem: any) => {
            checkedValues?.map((item: any) => {
              if (alldataitem.site == item) {
                localArray.push(alldataitem);
              }
            });
          });
          newData = localArray;
        }
        

            if (filterCatogries.length >= 1 && filteringColumn.catogries) {
              let localArray: any = [];
              newData?.map((alldataitem: any) => {
                filterCatogries?.map((item: any) => {
                  if (alldataitem.Categories == item) {
                    localArray.push(alldataitem);
                  }
                });
              });
              newData = localArray;
            }
           
            if (checkPercentages.length >= 1 && filteringColumn.percentage) {
              let localArray: any = [];
              newData?.map((alldataitem: any) => {
                let percent = parseInt(alldataitem.percentage);
                checkPercentages?.map((item: any) => {
                    if (radio.percentage == "==" || radio.percentage == true) {
                      if (percent == item) {
                        localArray.push(alldataitem);
                      }
                    } else if (radio.percentage == ">") {
                      if (percent > item) {
                        localArray.push(alldataitem);
                      }
                    } else if (radio.percentage == "<") {
                      if (percent < item) {
                        localArray.push(alldataitem);
                      }
                    } else {
                      if (percent != item) {
                        localArray.push(alldataitem);
                      }
                    }
                  });
              });
              newData = localArray;
            }else{
              if(priorAndPerc.percentage !== true){
                let localArray: any = [];
                newData?.map((alldataitem: any) => {
                  let percent = parseInt(alldataitem.percentage);
                      if (radio.percentage == "==" || radio.percentage == true) {
                        if (percent == parseInt(priorAndPerc.percentage)) {
                          localArray.push(alldataitem);
                        }
                      } else if (radio.percentage == ">") {
                        if (percent > parseInt(priorAndPerc.percentage)) {
                          localArray.push(alldataitem);
                        }
                      } else if (radio.percentage == "<") {
                        if (percent < parseInt(priorAndPerc.percentage)) {
                          localArray.push(alldataitem);
                        }
                      } else {
                        if (percent != parseInt(priorAndPerc.percentage)) {
                          localArray.push(alldataitem);
                        }
                      }
                });
                newData = localArray;
              }
            }



            if (checkPrioritys.length >= 1 && filteringColumn.priority) {
              let localArray: any = [];
              newData?.map((alldataitem: any) => {
                checkPrioritys?.map((item: any) => {
                  if (radio.priority == "==" || radio.priority == true) {
                    if (alldataitem.priority == item) {
                      localArray.push(alldataitem);
                    }
                  } else if (radio.priority == ">") {
                    if (alldataitem.priority > item) {
                      localArray.push(alldataitem);
                    }
                  } else if (radio.priority == "<") {
                    if (alldataitem.priority < item) {
                      localArray.push(alldataitem);
                    }
                  } else {
                    if (alldataitem.priority != item) {
                      localArray.push(alldataitem);
                    }
                  }
                });
              });
              newData = localArray;
            }else{
              if(priorAndPerc.priority !== true){
                let localArray: any = [];
                newData?.map((alldataitem: any) => {
                    if (radio.priority == "==" || radio.priority == true) {
                      if (alldataitem.priority == parseInt(priorAndPerc.priority) ) {
                        localArray.push(alldataitem);
                      }
                    } else if (radio.priority == ">") {
                      if (alldataitem.priority > parseInt(priorAndPerc.priority)) {
                        localArray.push(alldataitem);
                      }
                    } else if (radio.priority == "<") {
                      if (alldataitem.priority < parseInt(priorAndPerc.priority)) {
                        localArray.push(alldataitem);
                      }
                    } else {
                      if (alldataitem.priority != parseInt(priorAndPerc.priority)) {
                        localArray.push(alldataitem);
                      }
                    }
                
                });
                newData = localArray;
              }
            }



            if (checkTeamMembers.length >= 1 && filteringColumn.teamMembers) {
              let localArray: any = [];
              newData?.map((alldataitem: any) => {
                checkTeamMembers?.map((item: any) => {
                  alldataitem.Team_x0020_Members?.forEach((element:any) => {
                    if(element.Title == item){
                      localArray.push(alldataitem);
                    }
                  });
                  alldataitem.Responsible_x0020_Team?.forEach((element:any) => {
                    if(element.Title == item){
                      localArray.push(alldataitem);
                    }
                  });
                });
              });
              newData = localArray;
            }

            if(date.due != null && filteringColumn.due){
                let localArray:any=[];
                newData?.map((alldataitem:any)=>{
                    let dueDate = moment(alldataitem.dueDate).format('MM/DD/YYYY');
                    let filterDate = moment(date.due).format('MM/DD/YYYY');
                    if(radio.due == "==" || radio.due == true){
                        if(new Date(dueDate).getTime() == new Date(filterDate).getTime()){
                            localArray.push(alldataitem)
                         }
                    }else if(radio.due == ">"){
                        if(new Date(dueDate).getTime() > new Date(filterDate).getTime()){
                            localArray.push(alldataitem)
                         }
                    }else if(radio.due == "<"){
                        if(new Date(dueDate).getTime() < new Date(filterDate).getTime()){
                            localArray.push(alldataitem)
                         }
                    }else{
                        if(new Date(dueDate).getTime() != new Date(filterDate).getTime()){
                            localArray.push(alldataitem)
                         }
                    }
                     
                })
                newData=localArray;
            } 
            
            if(date.created != null && filteringColumn.created){
                let localArray:any=[];
                newData?.map((alldataitem:any)=>{
                    let created = moment(alldataitem.created).format('MM/DD/YYYY');
                    let filterDate = moment(date.created).format('MM/DD/YYYY');
                    if(radio.created == "==" || radio.created == true){
                        if(new Date(created).getTime() == new Date(filterDate).getTime()){
                            localArray.push(alldataitem)
                         }
                    }else if(radio.created == ">"){
                        if(new Date(created).getTime() > new Date(filterDate).getTime()){
                            localArray.push(alldataitem)
                         }
                    }else if(radio.created == "<"){
                        if(new Date(created).getTime() < new Date(filterDate).getTime()){
                            localArray.push(alldataitem)
                         }
                    }else{
                        if(new Date(created).getTime() != new Date(filterDate).getTime()){
                            localArray.push(alldataitem)
                         }
                    }
                     
                })
                newData=localArray;
            }
            if(date.modify != null && filteringColumn.modify){
                let localArray:any=[];
                newData?.map((alldataitem:any)=>{
                    let modify = moment(alldataitem.modified).format('MM/DD/YYYY');
                    let filterDate = moment(date.modify).format('MM/DD/YYYY');
                    if(radio.modify == "==" || radio.modify == true){
                        if(new Date(modify).getTime() == new Date(filterDate).getTime()){
                            localArray.push(alldataitem)
                         }
                    }else if(radio.modify == ">"){
                        if(new Date(modify).getTime() > new Date(filterDate).getTime()){
                            localArray.push(alldataitem)
                         }
                    }else if(radio.modify == "<"){
                        if(new Date(modify).getTime() < new Date(filterDate).getTime()){
                            localArray.push(alldataitem)
                         }
                    }else{
                        if(new Date(modify).getTime() != new Date(filterDate).getTime()){
                            localArray.push(alldataitem)
                         }
                    }
                     
                })
                newData=localArray;
            }
       setData(newData);
    }


    const clearAllFilters=()=>{
      setFilterCatogries([]);
      setCheckPercentage([]);
      setCheckPriority([]);
      setCheckTeamMembers([]);
      setCheckedValues([]);
      setDate({ ...date, due: null , modify: null, created: null});
      setRadio({ ...radio, percentage: true,priority: true,due: true , created: true,modify: true});
      setSelectAllChecks({...selectAllChecks,idType:false,percentage: false,priority: false,catogries:false,teamMembers:false})
      getTaskUserData();
    }

    const clearFilter = async (column: any) => {
      switch (column) {
        case "idType":
          setCheckedValues([]);
          filteringColumn = { ...filteringColumn, idType: false };
          setSelectAllChecks({...selectAllChecks,idType:false})
          listFilters1();
          break;
        case "Categories":
          filteringColumn = { ...filteringColumn, catogries: false };
          setSelectAllChecks({...selectAllChecks,catogries:false})
          setFilterCatogries([]);
          listFilters1();
          break;

        case "percentage":
          filteringColumn = { ...filteringColumn, percentage: false };
           setSelectAllChecks({...selectAllChecks,percentage:false})
          setRadio({ ...radio, percentage: true });
          setCheckPercentage([]);
          listFilters1();
          break;

        case "priority":
          filteringColumn = { ...filteringColumn, priority: false };
          setSelectAllChecks({...selectAllChecks,priority:false})
          setRadio({ ...radio, priority: true });
          setCheckPriority([]);
          listFilters1();
          break;

        case "newDueDate":
          filteringColumn = { ...filteringColumn, due: false };
          setDate({ ...date, due: null });
          setRadio({ ...radio, due: true });
          listFilters1();
          break;

        case "newModified":
          filteringColumn = { ...filteringColumn, modify: false };
          setDate({ ...date, modify: null });
          setRadio({ ...radio, modify: true });
          listFilters1();
          break;

        case "newCreated":
          filteringColumn = { ...filteringColumn, created: false };
          setDate({ ...date, created: null });
          setRadio({ ...radio, created: true });
          listFilters1();
          break;
          case "TeamMembersSearch":
          filteringColumn = { ...filteringColumn, teamMembers: false };
          setSelectAllChecks({...selectAllChecks,teamMembers:false})
          setCheckTeamMembers([]);
          listFilters1();
          break;

        default:
          getTaskUserData();
      }
    };


    const selectAll=(e:any)=>{
      let {checked, value} = e.target;
      
      switch (value) {
        case "idType":
          if(checked){
            setSelectAllChecks({...selectAllChecks,idType:e.target.checked})
            let arrayTeam:any=[];
            allLists?.map((item:any)=>{
              arrayTeam.push(item.Title);
              
            })
            setCheckedValues(arrayTeam);
          }else{
            setSelectAllChecks({...selectAllChecks,idType:e.target.checked})
            setCheckedValues([]);
          }
          break;
        case "Categories":
          if(checked){
            setSelectAllChecks({...selectAllChecks,catogries:e.target.checked})
            let arrayTeam:any=[];
            catogries?.map((item:any)=>{
              arrayTeam.push(item);
              
            })
            setFilterCatogries(arrayTeam);
          }else{
            setSelectAllChecks({...selectAllChecks,catogries:e.target.checked})
            setFilterCatogries([]);
          }
          break;

        case "percentage":
          if(checked){
            setSelectAllChecks({...selectAllChecks,percentage:e.target.checked})
            let arrayTeam:any=[];
            checkPercentage?.map((item:any)=>{
              arrayTeam.push(item);
              
            })
            setCheckPercentage(arrayTeam);
          }else{
            setSelectAllChecks({...selectAllChecks,percentage:e.target.checked})
            setCheckPercentage([]);   
          }
          break;

        case "priority":
          if(checked){
            setSelectAllChecks({...selectAllChecks,priority:e.target.checked})
            let arrayTeam:any=[];
            checkPriority?.map((item:any)=>{
              arrayTeam.push(item);
              
            })
            setCheckPriority(arrayTeam);
          }else{
            setSelectAllChecks({...selectAllChecks,priority:e.target.checked})
            setCheckPriority([]);
          }
          break;
          case "TeamMembersSearch":
            if(checked){
              setSelectAllChecks({...selectAllChecks,teamMembers:e.target.checked})
              let arrayTeam:any=[];
              taskUser?.map((item:any)=>{
                arrayTeam.push(item.Title);
                
              })
              setCheckTeamMembers(arrayTeam);
            }else{
              setSelectAllChecks({...selectAllChecks,teamMembers:e.target.checked})
              setCheckTeamMembers([]);
            }
          break;
      }
     

    }


  


    const getTaskUserData = async () => {
      const web = new Web(props.Items.siteUrl);
      await web.lists
        .getById(props.Items.TaskUsertListID)
        .items.select(
          "AssingedToUser/Title",
          "AssingedToUser/Id",
          "Item_x0020_Cover",
          "Title",
          "Id",
          "Email",
          "Suffix",
          "UserGroup/Id"
        )
        .expand("AssingedToUser", "UserGroup")
        .getAll()
        .then((data) => {
          userlists = data;
          setTaskUser(data);
          setPercentagess([0, 5, 10, 70, 80, 90, 93, 96, 99, 100]);
          setPriorityss([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
          getQueryVariable();
          smartMetaData();
        })
        .catch((err) => {
          console.log(err);
        });
    };
 
    const smartMetaData = async () => {
      let categories: any = [];
      let sites: any = [];
      const web = new Web(props.Items.siteUrl);
      await web.lists
        .getById(props.Items.SmartMetadataListID)
        .items.select("Configurations", "ID", "Title", "TaxType", "listId")
        .filter("TaxType eq 'Sites' or TaxType eq 'Categories'")
        .getAll()
        .then((data) => {
          data?.map((item: any) => {
            if (item.TaxType == "Sites") {
              sites.push(item);
              if (item.Title != "DRR" && item.Title != "Master Tasks" && item.Title != "SDC Sites" && item.Configurations != null)
               {
                let a: any = JSON.parse(item.Configurations);
                a?.map((newitem: any) => {
                  dataLength.push(newitem);

                  getAllData(newitem);
                  // b.push(newitem);
                });
              }
            }
            if (item.TaxType == "Categories") {
              categories.push(item.Title);
            }
          });
          setCatogries(categories);
          setAllLists(sites);
        })
        .catch((err) => {
          console.log(err);
        });
    }; 

    function CallBack() {
       setEditPopup(false);
       getTaskUserData();
    }
    

    const getQueryVariable = () => {
      const params = new URLSearchParams(window.location.search);
      let query = params.get("CreatedBy");
      QueryId = query;
      setQueryId(query);
      console.log(query); //"app=article&act=news_content&aid=160990"
    };

    const getAllData = async (items: any) => {
        const web = new Web(items.siteUrl);
        await web.lists
            .getById(items.listId)
            .items.select("Title","PercentComplete","SharewebTaskType/Title","SharewebTaskType/Id","Categories","Priority_x0020_Rank","DueDate","Created","Modified","Component/Title","Component/Id","Services/Title","Services/Id","Team_x0020_Members/Id","Team_x0020_Members/Title","ID","Responsible_x0020_Team/Id","Responsible_x0020_Team/Title","Editor/Title","Editor/Id","Author/Title","Author/Id","AssignedTo/Id","AssignedTo/Title")
            .expand("Team_x0020_Members","Author","SharewebTaskType","Editor","Responsible_x0020_Team","AssignedTo","Component","Services")
            .filter(`(substringof('${QueryId}', Author/Title)) and PercentComplete le 0.96`).top(5000)
            .getAll()
            .then((data: any) => {
                data?.map((dataItem: any) => {
                    userlists?.map((userItem: any) => {
                        dataItem.percentage = dataItem.PercentComplete * 100 + "%";
            
                        if ((dataItem.SharewebTaskType == undefined  ? null  : dataItem.SharewebTaskType.Title) === "Activities") {
                          dataItem.idType = "A" + dataItem.Id;
                        } else if ((dataItem.SharewebTaskType == undefined  ? null  : dataItem.SharewebTaskType.Title) === "MileStone") {
                          dataItem.idType = "M" + dataItem.Id;
                        } else if ((dataItem.SharewebTaskType == undefined  ? null  : dataItem.SharewebTaskType.Title) === "Project") {
                          dataItem.idType = "P" + dataItem.Id;
                        } else if ((dataItem.SharewebTaskType == undefined  ? null  : dataItem.SharewebTaskType.Title) === "Step") {
                          dataItem.idType = "S" + dataItem.Id;
                        } else if ((dataItem.SharewebTaskType == undefined  ? null  : dataItem.SharewebTaskType.Title) === "Task") {
                          dataItem.idType = "T" + dataItem.Id;
                        } else if ((dataItem.SharewebTaskType == undefined  ? null  : dataItem.SharewebTaskType.Title) === "Workstream") {
                          dataItem.idType = "W" + dataItem.Id;
                        } else {
                          dataItem.idType = "T" + dataItem.Id;
                        }

                          dataItem["newCreated"] = dataItem.Created != null ? moment(dataItem.Created).format('DD/MM/YYYY') : "";
                          dataItem["newModified"] = dataItem.Modified != null ? moment(dataItem.Modified).format('DD/MM/YYYY') : "";
                          dataItem["newDueDate"] = dataItem.DueDate != null ? moment(dataItem.DueDate).format('DD/MM/YYYY') : "";

                        if ( userItem.AssingedToUser != undefined && userItem.AssingedToUser.Id == dataItem.Author.Id) {
                            dataItem.AuthorImg = userItem?.Item_x0020_Cover?.Url;
                         }
                        if (userItem.AssingedToUser != undefined &&userItem.AssingedToUser.Id == dataItem.Editor.Id
                        ) {
                            dataItem.EditorImg = userItem?.Item_x0020_Cover?.Url;
                        }
                    });

                    allData.push({
                        idType: dataItem.idType,
                        Title: dataItem.Title,
                        Categories: dataItem.Categories,
                        percentage: dataItem.percentage,
                        newDueDate: dataItem.newDueDate,
                        newModified: dataItem.newModified,
                        newCreated: dataItem.newCreated,
                        editorImg: dataItem.EditorImg,
                        authorImg: dataItem.AuthorImg,
                        siteIcon:   items.Title=="Migration" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_migration.png" : items.ImageUrl,
                        siteUrl: items.siteUrl,
                        Id: dataItem.Id,
                        ID: dataItem.Id,
                        priority:dataItem.Priority_x0020_Rank,
                        Author: dataItem.Author,
                        Editor: dataItem.Editor,
                        Editorss:dataItem.Editor.Title,
                        Team_x0020_Members: dataItem.Team_x0020_Members,
                        Responsible_x0020_Team: dataItem.Responsible_x0020_Team,
                        AssignedTo: dataItem.AssignedTo,
                        created: dataItem.Created,
                        modified: dataItem.Modified,
                        dueDate: dataItem.DueDate,
                        Component:dataItem.Component,
                        Services:dataItem.Services,
                        listId:items.listId,
                        site:items.siteName,
                        siteType:items.siteName,
                        Urlss:`${items.siteUrl}/SitePages/Task-Profile.aspx?taskId=${dataItem.Id}&Site=${items.siteName}`
                    });

                });
                count++;

                if (count == dataLength.length) {
                    setData(allData);
                    setCopyData(allData);
                    
                }
            })
            .catch((err: any) => {
                console.log("then catch error", err);
            });
    };


    const filterCom = (e: any) => {
      let data1:any=copyData;

      priorAndPercen = priorPercenChecked;
      let { checked, value } = e.target;
      if (checked) {
        priorAndPercen.push(value);
      } else {
        priorAndPercen = priorAndPercen.filter((val: any) => val !== value)
      }

      if (checked) {
        setPriorPercenChecked([...priorPercenChecked, value]);
      } else {
        setPriorPercenChecked(
          priorPercenChecked.filter((val: any) => val !== value)
        );
      }


      if(priorAndPercen.includes('Component') && priorAndPercen.includes('Services')){
        let array: any = [];
        data1?.map((item: any) => {
          if (item.Component.length >= 1 || item.Services.length >= 1) {
            array.push(item);
          }
        });
        setData(array);
      }else if(priorAndPercen.includes('Component')){
        let array: any = [];
          data1?.map((item: any) => {
            if (item.Component.length >= 1) {
              array.push(item);
            }
          });
          setData(array);
      }else if(priorAndPercen.includes('Services')){
        let array: any = [];
          data1?.map((item: any) => {  
            
            if (item.Services.length >= 1) {
              array.push(item);
            }
          });
          setData(array);
      }else{
        setData(data1);
      }


        };


  const excelAllChecked=()=>{
let array:any=[];
    excelSelct.map((item:any)=>{
      array.push(item.value);
    })
    setSelectExcelData(array);
  }

const downloadExcel = (csvData: any, fileName: any) => {
   let newData:any=[];
   csvData.map((items:any)=>{
    let objData:any;
    selectExcelData.map((item:any)=>{
      Object.keys(items).map((itemss:any)=>{
        if(itemss==item){
          objData={...objData,[item]:items[itemss]}
        }
      })
    })
    newData.push(objData);
   })

  const ws = XLSX.utils.json_to_sheet(newData);
  const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], { type: fileType });
  FileSaver.saveAs(data, fileName + fileExtension);
};

const excelSelectFunc=(e:any)=>{
  let {checked, value} :any = e.target;
  if (checked) {
    setSelectExcelData([...selectExcelData, value]);
  } else {
    setSelectExcelData(
      selectExcelData.filter((val: any) => val !== value)
    );
  }
}

    React.useEffect(() => {
        getTaskUserData();
       }, []);
   
       const openInNewTab = (url:any) => {
        const newWindow = window.open();
        newWindow.opener = null;
        newWindow.location.href = url;
      };
    
      const callBackData = React.useCallback((elem: any, ShowingData: any) => {


      }, []);
    return (
      
        <div className='createdBy'>
           
             <div className='row'>
              <div className='col'><h3 className="siteColor">Created By - {queryId}</h3></div>
              <div className='col d-flex justify-content-end align-items-end'>
                {/* <a target='_blank'  href={`${props.Items.siteUrl}/SitePages/Tasks%20View.aspx?CreatedBy=${queryId}`} className="siteColor list-unstyled fw-bold">Old Task View</a> */}
                <a
        href={`${props.Items.siteUrl}/SitePages/Tasks%20View.aspx?CreatedBy=${queryId}`}
        rel='noopener noreferrer'
        onClick={(e:any) => {
          e.preventDefault();
          openInNewTab(e.target.href);
        }}
        className="siteColor list-unstyled fw-bold"
      >
        Old Task View
      </a>
                </div>
             </div>
           
            <div  className='Alltable mt-2 ' id={tablecontiner}>
        <div className='justify-content-between tbl-headings'>
            <span className='leftsec'> <span className='me-1'>Showing {data.length} of {copyData1.length >= 1 ? copyData1.length : copyData.length} Tasks </span><span> <input value={globalFilter || ''} onChange={(e:any)=>setGlobalFilter(e.target.value)} placeholder='Search in all tasks' /></span> </span> 
            <span className='toolbox'>
            <input className='me-1' type="checkbox" value={'Component'} onChange={(e:any)=>filterCom(e)} /> <label className='me-2'>Component</label>
                        <input className='me-1' type="checkbox" value={'Services'} onChange={(e:any)=>filterCom(e)} /> <label className='me-2'>Services</label>
                        <a onClick={clearAllFilters} className='brush'>
                            <FaPaintBrush/>
                        </a>
                   
                        {/* <a  className="excal" data-toggle="modal" data-target="#exampleModal">
                            <RiFileExcel2Fill/>  </a> */}
                           <span>
                           <a onClick={excelAllChecked} className="excal" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                            <RiFileExcel2Fill/>
</a>


<div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="staticBackdropLabel">Export To Excel</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
      {excelSelct.map((item:any)=>
        <ul className='exportlist'>
          <li> <input value={item.value} type='checkbox' checked={selectExcelData.includes(item.value)} onChange={(e:any)=>excelSelectFunc(e)} /><label>{item.item}</label></li>
        </ul>
       
     )}
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-primary"  data-bs-dismiss="modal" onClick={()=>downloadExcel(data,'Task-View')}>Create</button>
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>
                           </span>
            
                        <a className='expand'>
                        <ExpandTable prop={expndpopup} prop1={tablecontiner} />
                        </a>
            </span>
        </div>
            
          
{/*        
            <Table className="SortingTable filtertable" bordered hover {...getTableProps()}>
                <thead className="fixed-Header">
                    {headerGroups?.map((headerGroup: any) => (
                        <tr  {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers?.map((column: any) => (
                                <th {...column.getHeaderProps()} style={column?.style}>                                                  
                                    <Filter column={column} />

                                    {    
                                        column?.id !=='Title' && column.id !== 'ID' ?
                                        <div className="dropdown filtericons">
                                        <span data-bs-toggle="dropdown" aria-expanded="false">
                                            <FaFilter />
                                        </span>

                                       {column?.id == "idType" && 
                                       <div className="dropdown-menu p-2 ">
                                        <li><span><input type='checkbox' checked={selectAllChecks.idType} onChange={(e:any)=>selectAll(e)}   value={'idType'} /> <label>Select All</label> </span></li>
                                       <ul className='dropitem'>
                                            {allLists?.map((item: any) => <li><span><input type='checkbox' checked={checkedValues.includes(item.Title)} onChange={(e: any) => getSelectedSite(e,column?.id)} value={item.Title} /> <label>{item.Title}</label> </span></li>)}
                                                 </ul>
                                                 <li className='d-flex justify-content-end'><a className="btn btn-primary" href="#" onClick={listFilters1}>Filter</a> <a className="btn btn-default ms-1" href="#" onClick={()=>clearFilter(column?.id)}>Clear</a></li>
                                  </div> }


                                        {column?.id == 'percentage' && 
                                        <div className="dropdown-menu p-2 ">
                                        <li><span><input type='checkbox' checked={selectAllChecks.percentage} onChange={(e:any)=>selectAll(e)}  value={'percentage'} /> <label>Select All</label> </span></li>
                                       <ul className='dropitem'>
                                        {checkPercentage?.map((item: any) => <li><span><input type='checkbox' checked={checkPercentages.some((x:any)=>x==item)}  onChange={(e: any) => getSelectedSite(e,column?.id)} value={item} /> <label> {item}</label></span> </li>)}
                                          </ul>
                                          <div className='filterbox'>
                                            <li>
                                                <span><input type='radio' name='percentage' checked={radio.percentage=='=='} value={'=='} onChange={(e:any)=>setRadio({...radio, percentage:e.target.value})} /> <label>{'='}</label> </span>
                                                <span><input type='radio' name='percentage' checked={radio.percentage=='>'} value={'>'} onChange={(e:any)=>setRadio({...radio, percentage:e.target.value})}/> <label>{'>'}</label></span>
                                                <span><input type='radio' name='percentage' checked={radio.percentage=='<'} value={'<'} onChange={(e:any)=>setRadio({...radio, percentage:e.target.value})}/> <label>{'<'}</label> </span>
                                                <span><input type='radio' name='percentage' checked={radio.percentage=='!='} value={'!='} onChange={(e:any)=>setRadio({...radio, percentage:e.target.value})}/> <label>{'!='}</label> </span>
                                            </li>
                                            <span><input type='number' value={priorAndPerc.percentage}  onChange={(e:any)=>setPriorAndPerc({...priorAndPerc,percentage:e.target.value})}  /></span>
                                            </div>
                                          <li className='d-flex justify-content-end'><a className="btn btn-primary" href="#" onClick={listFilters1}>Filter</a> <a className="btn  btn-default ms-1" href="#" onClick={()=>clearFilter(column?.id)}>Clear</a></li>
                                          </div>}


                                            {column?.id == 'Categories' && 
                                           <div className="dropdown-menu p-2 ">
                                        <li><span><input type='checkbox' checked={selectAllChecks.catogries} onChange={(e:any)=>selectAll(e)}  value={'Categories'} /> <label>Select All</label> </span></li>
                                       <ul className='dropitem'>
                                        {catogries?.map((item: any,index:any) => <li><span><input type='checkbox' checked={filterCatogries.includes(item)} onChange={(e: any) => getSelectedSite(e,column?.id)} value={item} /> <label>{item}</label> </span></li>)}                                        
                                            </ul> 
                                            <li className='d-flex justify-content-end'><a className="btn btn-primary" href="#" onClick={listFilters1}>Filter</a> <a className="btn btn-default ms-1" href="#" onClick={()=>clearFilter(column?.id)}>Clear</a></li>
                                            </div>}


                                            {column?.id == 'priority' && 
                                           <div className="dropdown-menu p-2 ">
                                           <li><span><input type='checkbox' checked={selectAllChecks.priority} onChange={(e:any)=>selectAll(e)}  value={'priority'} /> <label>Select All</label> </span></li>
                                          <ul className='dropitem'>
                                        {checkPriority?.map((item: any) => <li><span><input type='checkbox' checked={checkPrioritys.some((x:any)=>x==item)} onChange={(e: any) => getSelectedSite(e,column?.id)} value={item} /> <label>{item}</label> </span></li>)}                                        
                                            </ul>
                                            <div className='filterbox'>
                                            <li>
                                                <span><input type='radio' name='priority' value={'=='} checked={radio.priority=='=='} onChange={(e:any)=>setRadio({...radio, priority:e.target.value})}  /> <label>{'='}</label> </span>
                                                <span><input type='radio' name='priority' value={'>'} checked={radio.priority=='>'} onChange={(e:any)=>setRadio({...radio, priority:e.target.value})} /> <label>{'>'}</label></span>
                                                <span><input type='radio' name='priority' value={'<'} checked={radio.priority=='<'} onChange={(e:any)=>setRadio({...radio, priority:e.target.value})} /> <label>{'<'}</label> </span>
                                                <span><input type='radio' name='priority' value={'!='} checked={radio.priority=='!='} onChange={(e:any)=>setRadio({...radio, priority:e.target.value})} /> <label>{'!='}</label> </span>
                                            </li>
                                            <span><input type='number' value={priorAndPerc.priority}  onChange={(e:any)=>setPriorAndPerc({...priorAndPerc,priority:e.target.value})}  /></span>
                                            </div>
                                            <li className='d-flex justify-content-end'><a className="btn btn-primary" href="#" onClick={listFilters1}>Filter</a> <a className="btn btn-default ms-1" href="#" onClick={()=>clearFilter(column?.id)}>Clear</a></li>
                                            </div>}


                                            {column?.id == 'dueDate' && 
                                           <div className="dropdown-menu p-2 ">
                                            <div className='filterbox'>
                                            <li>
                                                <span><input type='radio' name='newDueDate' value={'=='} checked={radio.due=='=='}  onChange={(e:any)=>setRadio({...radio, due:e.target.value})} /> <label>{'='}</label> </span>
                                                <span><input type='radio' name='newDueDate' value={'>'}  checked={radio.due=='>'} onChange={(e:any)=>setRadio({...radio, due:e.target.value})} /> <label>{'>'}</label></span>
                                                <span><input type='radio' name='newDueDate' value={'<'}  checked={radio.due=='<'} onChange={(e:any)=>setRadio({...radio, due:e.target.value})} /> <label>{'<'}</label> </span>
                                                <span><input type='radio' name='newDueDate' value={'!='} checked={radio.due=='!='}  onChange={(e:any)=>setRadio({...radio, due:e.target.value})} /> <label>{'!='}</label> </span>
                                            </li>
                                            <input type='date' value={date.due !== null ? date.due : ''} onChange={(e:any)=>setDate({...date, due:e.target.value})} />
                                            </div>
                                           
                                            <li className='d-flex justify-content-end'><a className="btn btn-primary" href="#" onClick={listFilters1}>Filter</a> <a className="btn btn-default ms-1" href="#" onClick={()=>clearFilter(column?.id)}>Clear</a></li>
                                           </div>}


                                            {column?.id == 'modified' && 
                                            <div className="dropdown-menu p-2 ">
                                                 <div className='filterbox'>
                                            <li>
                                                <span><input type='radio' name='newModified' value={'=='}  checked={radio.modify=='=='} onChange={(e:any)=>setRadio({...radio, modify:e.target.value})} /> <label>{'='}</label> </span>
                                                <span><input type='radio' name='newModified' value={'>'}  checked={radio.modify=='>'} onChange={(e:any)=>setRadio({...radio, modify:e.target.value})}  /> <label>{'>'}</label></span>
                                                <span><input type='radio' name='newModified' value={'<'}  checked={radio.modify=='<'} onChange={(e:any)=>setRadio({...radio, modify:e.target.value})} /> <label>{'<'}</label> </span>
                                                <span><input type='radio' name='newModified' value={'!='} checked={radio.modify=='!='} onChange={(e:any)=>setRadio({...radio, modify:e.target.value})}  /> <label>{'!='}</label> </span>
                                            </li>
                                            <input type='date' value={date.modify !== null ? date.modify : '' } onChange={(e:any)=>setDate({...date, modify:e.target.value})} />
                                            </div>
                                           
                                            <li className='d-flex justify-content-end'><a className="btn btn-primary" href="#" onClick={listFilters1}>Filter</a> <a className="btn  btn-default ms-1" href="#" onClick={()=>clearFilter(column?.id)}>Clear</a></li>
                                           </div>}
                                           
                                            {column?.id == 'created' && 
                                       <div className="dropdown-menu p-2 ">
                                         <div className='filterbox'>
                                            <li>
                                                <span><input type='radio' name='newCreated' checked={radio.created=='=='} value={'=='} onChange={(e:any)=>setRadio({...radio, created:e.target.value})}  /> <label>{'='}</label> </span>
                                                <span><input type='radio' name='newCreated'  checked={radio.created=='>'} value={'>'} onChange={(e:any)=>setRadio({...radio, created:e.target.value})} /> <label>{'>'}</label></span>
                                                <span><input type='radio' name='newCreated' checked={radio.created=='<'} value={'<'} onChange={(e:any)=>setRadio({...radio, created:e.target.value})} /> <label>{'<'}</label> </span>
                                                <span><input type='radio' name='newCreated' checked={radio.created=='!='} value={'!='} onChange={(e:any)=>setRadio({...radio, created:e.target.value})} /> <label>{'!='}</label> </span>
                                            </li>
                                            <input type='date' value={date.created !== null ? date.created : ''} onChange={(e:any)=>setDate({...date, created:e.target.value})}  />
                                            </div>
                                           
                                            <li className='d-flex justify-content-end'><a className="btn btn-primary" href="#" onClick={listFilters1}>Filter</a> <a className="btn  btn-default ms-1" href="#" onClick={()=>clearFilter(column?.id)}>Clear</a></li>
                                           </div>}

                                           {column?.id == 'TeamMembersSearch' && 
                                           <div className="dropdown-menu p-2 ">
                                        <li><span><input type='checkbox' checked={selectAllChecks.teamMembers} onChange={(e:any)=>selectAll(e)}  value={'TeamMembersSearch'} /> <label>Select All</label> </span></li>
                                       <ul className='dropitem'>
                                        {taskUser?.map((item: any) => <li><span><input type='checkbox' checked={checkTeamMembers.includes(item.Title)} onChange={(e: any) => getSelectedSite(e,column?.id)} value={item.Title} /> <label>{item.Title}</label> </span></li>)}                                        
                                            </ul> 
                                            <li className='d-flex justify-content-end'><a className="btn btn-primary" href="#" onClick={listFilters1}>Filter</a> <a className="btn  btn-default ms-1" href="#" onClick={()=>clearFilter(column?.id)}>Clear</a></li>
                                            </div>}
                                          
                                    </div> : ''
                                    }
                                   
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>

                <tbody {...getTableBodyProps()}>
                    {page?.map((row: any) => {
                        prepareRow(row)
                        return (
                            <tr {...row.getRowProps()}  >
                                {row.cells?.map((cell: { getCellProps: () => JSX.IntrinsicAttributes & React.ClassAttributes<HTMLTableDataCellElement> & React.TdHTMLAttributes<HTMLTableDataCellElement>; render: (arg0: string) => boolean | React.ReactChild | React.ReactFragment | React.ReactPortal; }) => {
                                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                })}
                            </tr>
                        )

                    })}
                </tbody>
            </Table> */}
             <GlobalCommanTable  columns={columns} data={data} callBackData={callBackData}/>
            <nav>
                    <Pagination>
                        <PaginationItem>
                            <PaginationLink onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                                <span aria-hidden={true}>
                                    {/* <i
                                    aria-hidden={true}
                                    className="tim-icons icon-double-left"
                                /> */}
                                    <FaAngleDoubleLeft aria-hidden={true} />
                                </span>
                            </PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink onClick={() => previousPage()} disabled={!canPreviousPage}>
                                <span aria-hidden={true}>
                                    <FaAngleLeft aria-hidden={true} />
                                </span>
                            </PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink>
                                {pageIndex + 1}

                            </PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink onClick={() => nextPage()} disabled={!canNextPage}>
                                <span aria-hidden={true}>
                                    <FaAngleRight
                                        aria-hidden={true}

                                    />
                                </span>
                            </PaginationLink>
                        </PaginationItem>

                        <PaginationItem>
                            <PaginationLink onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                                <span aria-hidden={true}>
                                    {/* <i
                                    aria-hidden={true}
                                    className="tim-icons icon-double-right"
                                /> */}
                                    <FaAngleDoubleRight aria-hidden={true} />
                                </span>
                            </PaginationLink>
                            {' '}
                        </PaginationItem>
                        <Col md={2}>
                            <Input
                                type='select'
                                value={pageSize}
                                onChange={onChangeInSelect}
                            >

                                {[10, 20, 30, 40, 50].map((pageSize) => (
                                    <option key={pageSize} value={pageSize}>
                                        Show {pageSize}
                                    </option>
                                ))}
                            </Input>
                        </Col>
                    </Pagination>
                </nav>
                </div>
            <span>
            {editPopup && <EditTaskPopup  Items={result} context={props.Items.Context} AllListId={AllListId} Call={() => {CallBack() }} /> }       
          
            </span>
        </div>
    )
}

export default Tabless;

