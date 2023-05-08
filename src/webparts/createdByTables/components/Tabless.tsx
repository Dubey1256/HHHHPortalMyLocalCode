import * as React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import { Button, Table, Row, Col, Pagination, PaginationLink, PaginationItem, Input } from "reactstrap";
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaAngleLeft, FaAngleRight, FaCaretDown, FaCaretRight, FaSort, FaSortDown, FaSortUp, FaFilter } from "react-icons/fa";
import {
    useTable,
    useSortBy,
    useFilters,
    useExpanded,
    usePagination,
    HeaderGroup,

} from 'react-table';
// import styles from './CreatedByTables.module.scss';
import './Style.css';
import { Filter, DefaultColumnFilter } from './filters';
import { Web } from "sp-pnp-js";
// import * as Moment from 'moment';
import moment from 'moment';
import ShowTaskTeamMembers from '../../../globalComponents/ShowTaskTeamMembers';

const Tabless = (props: any) => {
    let count: any = 0;
    let AllListId: any = [];
    let allData: any = [];
    let userlists: any = [];
    let QueryId: any=36;
    let dataLength: any = [];
    const [queryId, setQueryId]: any = React.useState([]);
    const [data, setData]: any = React.useState([]);
    const [taskUser, setTaskUser]: any = React.useState([]);
    const [catogries, setCatogries]: any = React.useState([]);
    const [allLists, setAllLists]: any = React.useState([]);
    const [checkPercentage, setCheckPercentage] : any = React.useState([0,5,10,70,80,90,93,96,99,100]);
    const [checkPriority, setCheckPriority] : any = React.useState([1,2,3,4,5,6,7,8,9,10])
    const [checkedValues, setCheckedValues] = React.useState([]);
    var filterString:any = `Author/Id eq ${QueryId} and PercentComplete le 0.96 and Priority_x0020_Rank eq 4 and Categories eq 'Content'`;
    

    const columns = React.useMemo(
        () => [
            {
                internalHeader: 'Task ID',
                accessor: 'idType',
                showSortIcon: true,
                style: { width: '90px' },
                Cell: ({ row }: any) => (
                    <div>
                        <span><img style={{ width: "25px", height: '25px', borderRadius: '20px' }} src={row?.original?.siteIcon} /></span>
                        <span>{row?.original?.idType}</span>
                    </div>
                )
            },
            {
                internalHeader: 'Task Title',
                accessor: 'Title',
                showSortIcon: true,
            },
            {
                internalHeader: 'Categories',
                accessor: 'Categories',
                showSortIcon: true,
            },
            {
                internalHeader: '%',
                showSortIcon: true,
                accessor: 'percentage',
                style: { width: '50px' },
            },
            {
                internalHeader: 'Priority',
                showSortIcon: true,
                accessor: 'priority',
                style: { width: '50px' },
            },
            {
                internalHeader: 'Due Date',
                accessor: 'newDueDate',
                showSortIcon: true,
                style: { width: '130px' },
                Cell: ({ row }: any) => (
                    <div>
                        <div>{row?.original?.newDueDate}</div>
                        {/* {new Date() < new Date(row?.original?.dueDate) ? <div style={{height:'12px', width:'12px', borderRadius:'50%', backgroundColor:'green'}}></div> :(new Date() > new Date(row?.original?.dueDate) ? <div style={{height:'12px', width:'12px', borderRadius:'50%', backgroundColor:'red'}}></div> : <div style={{height:'12px', width:'12px', borderRadius:'50%', backgroundColor:'yellow'}}></div>) }
                     */}
                    </div>
                )
            },

            {
                internalHeader: 'Modified',
                accessor: 'newModified',
                showSortIcon: true,
                style: { width: '130px' },
                Cell: ({ row }: any) => (
                    <div>
                        <span>{row?.original?.newModified}</span>
                        <span><img style={{ width: "25px", height: '25px', borderRadius: '20px' }} src={row?.original?.editorImg} /></span>
                    </div>
                )
            },
            {
                internalHeader: 'Created',
                accessor: 'newCreated',
                showSortIcon: true,
                style: { width: '130px' },
                Cell: ({ row }: any) => (
                    <div>
                        <span>{row?.original?.newCreated}</span>
                        <span><img style={{ width: "25px", height: '25px', borderRadius: '20px' }} src={row?.original?.authorImg} /></span>
                    </div>
                )
            },
            {
                internalHeader: 'Team Members',
                accessor: 'TeamMembersSearch',
                showSortIcon: true,
                style: { width: '150px' },
                Cell: ({ row }: any) => (
                    <span>
                        <ShowTaskTeamMembers props={row?.original} TaskUsers={taskUser} />

                    </span>
                )
            },
            {
                internalHeader: '',
                accessor: 'ID',
                style: { width: '80px' },
                Cell: ({ row }: any) => (
                    <span>
                        <span title="Edit Task" className="svg__iconbox svg__icon--edit hreflink ms-3" ></span>
                        <span title="Edit Task" className="svg__iconbox svg__icon--trash hreflink" ></span>
                    </span>
                )
            },
        ],
        [data]
    );




    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        gotoPage,
        setPageSize,
        state: { pageIndex, pageSize },
    }: any = useTable(
        {
            columns,
            data,
            defaultColumn: { Filter: DefaultColumnFilter },
            initialState: { pageIndex: 0, pageSize: 150000 },
        },
        useFilters,
        useSortBy,
        useExpanded,
        usePagination
    );


    const getSelectedSite = (e: any,column:any) => {
       const {value, checked}=e.target;
        console.log(value, checked);
       if(checked && column == 'idType'){
           setCheckedValues([...checkedValues,value])
       }
       else{
        setCheckedValues(checkedValues.filter((val) => val !== value));
       }

      if(checked && column== 'Categories'){
        setCatogries([...checkedValues,value])
      } else{
        setCatogries(checkedValues.filter((val) => val !== value));
       }


       if(checked && column== 'percentage'){
        setCheckPercentage([...checkedValues,value])
      } else{
        setCheckPercentage(checkedValues.filter((val) => val !== value));
       }

       if(checked && column== 'percentage'){
        setCheckPercentage([...checkedValues,value])
      } else{
        setCheckPercentage(checkedValues.filter((val) => val !== value));
       }

       if(checked && column== 'priority'){
        setCheckPriority([...checkedValues,value])
      } else{
        setCheckPriority(checkedValues.filter((val) => val !== value));
       }
      
       console.log("checkedValues" ,checkedValues);
    }


    const listFilter=()=>{
        QueryId=queryId;
        userlists=taskUser;
        allLists?.map((alllists:any)=>{
            checkedValues.map((checkedlists:any)=>{
                if(alllists.Title==checkedlists){
                    let a: any = JSON.parse(alllists.Configurations);
                    a?.map((newitem: any) => {
    
                        dataLength.push(newitem);
    
                        getAllData(newitem);
                     } )
                    }
            })
        })
    }


    const clearFilter=()=>{
        setCheckedValues(['1']);
        getTaskUserData();
    }

    const generateSortingIndicator = (column: any) => {
        return column.isSorted ? (column.isSortedDesc ? <FaSortDown /> : <FaSortUp />) : (column.showSortIcon ? <FaSort /> : '');
    };

  


    const getTaskUserData = async () => {
        const web = new Web(props.Items.siteUrl);
        await web.lists
            .getById(props.Items.TaskUsertListID)
            .items.select(
                "AssingedToUser/Title",
                "AssingedToUser/Id",
                "Item_x0020_Cover",
                "Title",
                'Id',
                'Email',
                'Suffix',
                'UserGroup/Id'
            )
            .expand("AssingedToUser", 'UserGroup')
            .getAll()
            .then((data) => {
                userlists = data;
                setTaskUser(data);
                getQueryVariable();
                smartMetaData();
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const smartMetaData = async () => {
        let categories:any=[];
        let sites:any=[];
        const web = new Web(props.Items.siteUrl);
        await web.lists
            .getById(props.Items.SmartMetadataListID)
            .items.select("Configurations", "ID", "Title", "TaxType", "listId")
            .filter("TaxType eq 'Sites' or TaxType eq 'Categories'")
            .getAll()
            .then((data) => {
                data.map((item: any) => {
                    if(item.TaxType == 'Sites'){
                        sites.push(item);
                    if (item.Title != 'DRR' && item.Title != "Master Tasks" && item.Title != "SDC Sites" && item.Configurations != null) {
                        let a: any = JSON.parse(item.Configurations);
                        a?.map((newitem: any) => {

                            dataLength.push(newitem);

                            getAllData(newitem);
                            // b.push(newitem);

                        });
                    }}
                    if(item.TaxType=='Categories'){
                        categories.push(item.Title)
                    }
                });
                setCatogries(categories);
                setAllLists(sites);
                   
            })
            .catch((err) => {
                console.log(err);
            });
    };
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
            .items.select(
                "Title",
                "PercentComplete",
                "SharewebTaskType/Title",
                "SharewebTaskType/Id",
                "Categories",
                "Priority_x0020_Rank",
                "DueDate",
                "Created",
                "Modified",
                "Team_x0020_Members/Id",
                "Team_x0020_Members/Title",
                "ID",
                "Responsible_x0020_Team/Id",
                "Responsible_x0020_Team/Title",
                "Editor/Title",
                "Editor/Id",
                "Author/Title",
                "Author/Id",
                "AssignedTo/Id",
                "AssignedTo/Title",
            )
            .expand(

                "Team_x0020_Members",
                "Author",
                "SharewebTaskType",
                "Editor",
                "Responsible_x0020_Team",
                "AssignedTo"
            )
            .filter(filterString)
            .getAll()
            .then((data: any) => {
                data.map((dataItem: any) => {
                    userlists.map((userItem: any) => {
                        dataItem.percentage = dataItem.PercentComplete * 100 + "%";
                        // dataItem.siteTitle = listDetails.Title;
                        // dataItem.siteImg = listDetails.ImageUrl;

                        if (
                            (dataItem.SharewebTaskType == undefined
                                ? null
                                : dataItem.SharewebTaskType.Title) === "Activities"
                        ) {
                            dataItem.idType = "A" + dataItem.Id;
                        } else if (
                            (dataItem.SharewebTaskType == undefined
                                ? null
                                : dataItem.SharewebTaskType.Title) === "MileStone"
                        ) {
                            dataItem.idType = "M" + dataItem.Id;
                        } else if (
                            (dataItem.SharewebTaskType == undefined
                                ? null
                                : dataItem.SharewebTaskType.Title) === "Project"
                        ) {
                            dataItem.idType = "P" + dataItem.Id;
                        } else if (
                            (dataItem.SharewebTaskType == undefined
                                ? null
                                : dataItem.SharewebTaskType.Title) === "Step"
                        ) {
                            dataItem.idType = "S" + dataItem.Id;
                        } else if (
                            (dataItem.SharewebTaskType == undefined
                                ? null
                                : dataItem.SharewebTaskType.Title) === "Task"
                        ) {
                            dataItem.idType = "T" + dataItem.Id;
                        } else if (
                            (dataItem.SharewebTaskType == undefined
                                ? null
                                : dataItem.SharewebTaskType.Title) === "Workstream"
                        ) {
                            dataItem.idType = "W" + dataItem.Id;
                        } else {
                            dataItem.idType = "T" + dataItem.Id;
                        }

                        dataItem["newCreated"] = dataItem.Created != null ? moment(dataItem.Created).format('DD/MM/YYYY') : "";

                        dataItem["newModified"] = dataItem.Modified != null ? moment(dataItem.Modified).format('DD/MM/YYYY') : "";

                        dataItem["newDueDate"] = dataItem.DueDate != null ? moment(dataItem.DueDate).format('DD/MM/YYYY') : "";

                        if (
                            userItem.AssingedToUser != undefined &&
                            userItem.AssingedToUser.Id == dataItem.Author.Id
                        ) {
                            dataItem.AuthorImg = userItem?.Item_x0020_Cover?.Url;
                        }
                        if (
                            userItem.AssingedToUser != undefined &&
                            userItem.AssingedToUser.Id == dataItem.Editor.Id
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
                        siteIcon: items.ImageUrl,
                        siteUrl: items.siteUrl,
                        Id: dataItem.Id,
                        priority:dataItem.Priority_x0020_Rank,
                        Author: dataItem.Author,
                        Team_x0020_Members: dataItem.Team_x0020_Members,
                        Responsible_x0020_Team: dataItem.Responsible_x0020_Team,
                        AssignedTo: dataItem.AssignedTo,
                        created: dataItem.Created,
                        modified: dataItem.Modified,
                        dueDate: dataItem.DueDate,
                    });

                });
                count++;

                if (count == dataLength.length) {
                    setData(allData);
                }
            })
            .catch((err: any) => {
                console.log("then catch error", err);
            });
    };



    React.useEffect(() => {
        getTaskUserData();
        AllListId = {
            MasterTaskListID: props?.props?.MasterTaskListID,
            TaskUsertListID: props?.props?.TaskUsertListID,
            SmartMetadataListID: props?.props?.SmartMetadataListID,
            //SiteTaskListID:this.props?.props?.SiteTaskListID,
            TaskTimeSheetListID: props?.props?.TaskTimeSheetListID,
            DocumentsListID: props?.props?.DocumentsListID,
            SmartInformationListID: props?.props?.SmartInformationListID,
            siteUrl: props?.props?.siteUrl,
            AdminConfigrationListID: props?.props?.AdminConfigrationListID,
            isShowTimeEntry: props?.props?.isShowTimeEntry,
            isShowSiteCompostion: props?.props?.isShowSiteCompostion
        }
    }, []);
    return (
        <div>Tabless
            <Table className="SortingTable" bordered hover {...getTableProps()}>
                <thead className="fixed-Header">
                    {headerGroups.map((headerGroup: any) => (
                        <tr  {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column: any) => (
                                <th  {...column.getHeaderProps()} style={column?.style}>

                                    <span class="Table-SortingIcon" style={{ marginTop: '-6px' }} {...column.getSortByToggleProps()} >
                                        {column.render('Header')}
                                        {generateSortingIndicator(column)}

                                    </span>
                                    <Filter column={column} />
                                   { console.log(column)}
                                    {    
                                        column?.id !=='Title' && column.id !== 'ID' ?
                                        <div className="dropdown">
                                        <button className="btn" type={'button'} data-bs-toggle="dropdown" aria-expanded="false">
                                            <FaFilter />
                                        </button>

                                       {column?.id == "idType" && 
                                       <div className="dropdown-menu p-2 ">
                                        <li><span><input type='checkbox'  value={'Select all'} /> <label>Select All</label> </span></li>
                                       <ul style={{width:'200px', height:'250px', overflow:'auto', listStyle:'none', paddingLeft:'10px'}}>
                                            {allLists.map((item: any) => <li><span><input type='checkbox' onChange={(e: any) => getSelectedSite(e,column?.id)} value={item.Title} /> <label>{item.Title}</label> </span></li>)}
                                                 </ul>
                                                 <li><a className="dropdown-item p-2 bg-primary" href="#" onClick={listFilter}>Filter</a> <a className="dropdown-item p-2 bg-light" href="#" onClick={clearFilter}>Clear</a></li>
                                  </div> }


                                        {column?.id == 'percentage' && 
                                        <div className="dropdown-menu p-2 ">
                                        <li><span><input type='checkbox'  value={'Select all'} /> <label>Select All</label> </span></li>
                                       <ul style={{width:'200px', height:'250px', overflow:'auto', listStyle:'none', paddingLeft:'10px'}}>
                                        {checkPercentage.map((item: any) => <li><span><input type='checkbox' onChange={(e: any) => getSelectedSite(e,column?.id)} value={item} /> <label>{item}</label> </span></li>)}
                                          </ul>
                                          <li><a className="dropdown-item p-2 bg-primary" href="#" onClick={listFilter}>Filter</a> <a className="dropdown-item p-2 bg-light" href="#" onClick={clearFilter}>Clear</a></li>
                                          </div>}


                                            {column?.id == 'Categories' && 
                                           <div className="dropdown-menu p-2 ">
                                        <li><span><input type='checkbox'  value={'Select all'} /> <label>Select All</label> </span></li>
                                       <ul style={{width:'200px', height:'250px', overflow:'auto', listStyle:'none', paddingLeft:'10px'}}>
                                        {catogries.map((item: any) => <li><span><input type='checkbox' onChange={(e: any) => getSelectedSite(e,column?.id)} value={item} /> <label>{item}</label> </span></li>)}                                        
                                            </ul> 
                                            <li><a className="dropdown-item p-2 bg-primary" href="#" onClick={listFilter}>Filter</a> <a className="dropdown-item p-2 bg-light" href="#" onClick={clearFilter}>Clear</a></li>
                                            </div>}


                                            {column?.id == 'priority' && 
                                           <div className="dropdown-menu p-2 ">
                                           <li><span><input type='checkbox'  value={'Select all'} /> <label>Select All</label> </span></li>
                                          <ul style={{width:'200px', height:'250px', overflow:'auto', listStyle:'none', paddingLeft:'10px'}}>
                                        {checkPriority.map((item: any) => <li><span><input type='checkbox' onChange={(e: any) => getSelectedSite(e,column?.id)} value={item} /> <label>{item}</label> </span></li>)}                                        
                                            </ul>
                                            <li><a className="dropdown-item p-2 bg-primary" href="#" onClick={listFilter}>Filter</a> <a className="dropdown-item p-2 bg-light" href="#" onClick={clearFilter}>Clear</a></li>
                                            </div>}


                                            {column?.id == 'newDueDate' && 
                                           <div className="dropdown-menu p-2 ">
                                            <div>
                                            <li>
                                                <span><input type='radio' name='newDueDate' value={'equal'} /> <label>{'='}</label> </span>
                                                <span><input type='radio' name='newDueDate' value={'le'} /> <label>{'>'}</label></span>
                                                <span><input type='radio' name='newDueDate' value={'ge'} /> <label>{'<'}</label> </span>
                                                <span><input type='radio' name='newDueDate' value={'ne'} /> <label>{'!='}</label> </span>
                                            </li>
                                            </div>
                                            <input type='date'/>
                                            <li><a className="dropdown-item p-2 bg-primary" href="#" onClick={listFilter}>Filter</a> <a className="dropdown-item p-2 bg-light" href="#" onClick={clearFilter}>Clear</a></li>
                                           </div>}


                                            {column?.id == 'newModified' && 
                                            <div className="dropdown-menu p-2 ">
                                                 <div>
                                            <li>
                                                <span><input type='radio' name='newModified' value={'equal'} /> <label>{'='}</label> </span>
                                                <span><input type='radio' name='newModified' value={'le'} /> <label>{'>'}</label></span>
                                                <span><input type='radio' name='newModified' value={'ge'} /> <label>{'<'}</label> </span>
                                                <span><input type='radio' name='newModified' value={'ne'} /> <label>{'!='}</label> </span>
                                            </li>
                                            </div>
                                            <input type='date'/>
                                            <li><a className="dropdown-item p-2 bg-primary" href="#" onClick={listFilter}>Filter</a> <a className="dropdown-item p-2 bg-light" href="#" onClick={clearFilter}>Clear</a></li>
                                           </div>}

                                            {column?.id == 'newCreated' && 
                                       <div className="dropdown-menu p-2 ">
                                         <div>
                                            <li>
                                                <span><input type='radio' name='newCreated' value={'equal'} /> <label>{'='}</label> </span>
                                                <span><input type='radio' name='newCreated' value={'le'} /> <label>{'>'}</label></span>
                                                <span><input type='radio' name='newCreated' value={'ge'} /> <label>{'<'}</label> </span>
                                                <span><input type='radio' name='newCreated' value={'ne'} /> <label>{'!='}</label> </span>
                                            </li>
                                            </div>
                                            <input type='date'/>
                                            <li><a className="dropdown-item p-2 bg-primary" href="#" onClick={listFilter}>Filter</a> <a className="dropdown-item p-2 bg-light" href="#" onClick={clearFilter}>Clear</a></li>
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
                                {row.cells.map((cell: { getCellProps: () => JSX.IntrinsicAttributes & React.ClassAttributes<HTMLTableDataCellElement> & React.TdHTMLAttributes<HTMLTableDataCellElement>; render: (arg0: string) => boolean | React.ReactChild | React.ReactFragment | React.ReactPortal; }) => {
                                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                })}
                            </tr>
                        )

                    })}
                </tbody>
            </Table>
        </div>
    )
}

export default Tabless

function setTaskUser(data: any[]) {
    throw new Error('Function not implemented.');
}
