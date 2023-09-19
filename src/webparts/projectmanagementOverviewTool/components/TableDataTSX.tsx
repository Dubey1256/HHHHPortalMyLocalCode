
import * as React from 'react';
import { Web } from "sp-pnp-js";
import * as Moment from 'moment';
import { Button, Table, Row, Col, Pagination, PaginationLink, PaginationItem, Input } from "reactstrap";
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaAngleLeft, FaAngleRight, FaCaretDown, FaCaretRight, FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import {
    useTable,
    useSortBy,
    useFilters,
    useExpanded,
    usePagination,
    HeaderGroup,
} from 'react-table';
import { Filter, DefaultColumnFilter, SelectColumnFilter } from './filters';
import { values } from 'office-ui-fabric-react';
import ProjectOverview from './ProjectOverView';
import EditProjectPopup from './EditProjectPopup';
import ShowTaskTeamMembers from '../../../globalComponents/ShowTaskTeamMembers';
var AllTaskUsers: any = []
const TableDataTSX = (props: any) => {
    const [SharewebComponent, setSharewebComponent] = React.useState('');
    const [data, setData] = React.useState([]);
    const [IsComponent, setIsComponent] = React.useState(false);
    const Call = React.useCallback((item1) => {
        setIsComponent(false);
    }, []);
    const EditComponentPopup = (item: any) => {
        item['siteUrl'] = 'https://hhhhteams.sharepoint.com/sites/HHHH/SP';
        item['listName'] = 'Master Tasks';
        // <ComponentPortPolioPopup ></ComponentPortPolioPopup>
        setIsComponent(true);
        setSharewebComponent(item);
        // <ComponentPortPolioPopup props={item}></ComponentPortPolioPopup>
    }
    React.useEffect(() => {
        setData(props?.data)
    }, [props?.data])
    const columns = React.useMemo(
         () =>
         props?.columns,
         [props?.columns]
         // [
        //     {
        //         Header: 'Title',
        //         accessor: 'Title',
        //         Cell: ({ row }: any) => (
        //             <span>
        //                 <a style={{ textDecoration: "none", color: "#000066" }} href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Project-Management.aspx?ProjectId=${row?.Id}`} data-interception="off" target="_blank">{row.values.Title}</a>
        //             </span>
        //         )
        //     },
        //     {
        //         Header: 'Percent Complete',
        //         accessor: 'PercentComplete',
        //     },
        //     {
        //         Header: 'Priority',
        //         accessor: 'Priority',
        //     },
        //     {
        //         Header: 'Due Date',
        //         accessor: 'DisplayDueDate',
        //     },
        //     {
        //         id: 'Id', // 'id' is required
        //         isSorted:false,
        //         Cell: ({ row }: any) => (
        //             <span>
        //               <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif"  onClick={(e) => EditComponentPopup(row?.original)}></img>
        //             </span>
        //         ),
        //     },
        // ]
        
       
    );



    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        visibleColumns,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize },
    }: any = useTable(
        {
            columns,
            data,
            defaultColumn: { Filter: DefaultColumnFilter },
            initialState: { pageIndex: 0, pageSize: 10 }
        },
        useFilters,
        useSortBy,
        useExpanded,
        usePagination
    );
    const generateSortingIndicator = (column: any) => {
        return column.isSorted ? (column.isSortedDesc ? <FaSortDown  /> : <FaSortUp  />) : (column.showSortIcon?<FaSort/> :'');
    };

    const onChangeInSelect = (event: any) => {
        setPageSize(Number(event.target.value));
    };
    const callback=()=>{
        
    }

    const onChangeInInput = (event: any) => {
        const page = event.target.value ? Number(event.target.value) - 1 : 0;
        gotoPage(page);
    };


    return (
        <>
            <div>
            <Table className="SortingTable" bordered hover {...getTableProps()}>
                    <thead>
                        {headerGroups.map((headerGroup: any) => (
                            <tr  {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column: any) => (
                                    <th  {...column.getHeaderProps()}>
                                        <span class="Table-SortingIcon" style={{marginTop:'-6px'}} {...column.getSortByToggleProps()} >
                                            {column.render('Header')}
                                            {generateSortingIndicator(column)}
                                        </span>
                                        <Filter column={column}  />
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>

                    <tbody {...getTableBodyProps()}>
                        {page.map((row: any) => {
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
        </>
    )
}
export default TableDataTSX;