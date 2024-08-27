import * as React from 'react'
import { useEffect, useState, useMemo } from 'react';
import { Web } from "sp-pnp-js";
import './AllOutlookMails.css'
import { SlArrowDown, SlArrowUp } from "react-icons/sl";

import {
    Table, //mange overall State and behaviour
    Column, // containes all the information and method , related to specific column , how to render cells , header and footer
    // createColumnHelper,
    flexRender,  // render Data For UI
    getCoreRowModel,  // initial Data excess and Basic row 
    useReactTable, // This is hook provided by tanstack . it hendles Everthing
    ColumnDef,  // Type of TypeScript , Define Structure of Column , Helping in Type Checking
    getExpandedRowModel, // Use Row Expanded
    getFilteredRowModel, // Use Row Filter
    getSortedRowModel // Use Row Sort
} from '@tanstack/react-table'
import FullMailModal from './FullMailModal';
import InfoIconTooltip from './InfoIconTooltip';


function Filter({
    column,
    table,
    placeholder,
}: {
    column: Column<any, any>;
    table: Table<any>;
    placeholder: any;
}) {
    const columnFilterValue = column.getFilterValue();
    return (
        <input
            style={{ width: "100%", paddingRight: "10px" }}
            className="m-1 on-search-cross"
            title={placeholder?.placeholder}
            type="search"
            value={(columnFilterValue ?? "") as string}
            onChange={(e) => column.setFilterValue(e.target.value)}
            placeholder={`${placeholder.placeholder}`}
        />
    );
}





const AllOutlookMails = (props: any) => {
    const [data, setData] = useState([]);
    const [mailSender, setMailSender] = useState(undefined)
    const [sorting, setSorting] = useState<any>([]);
    const [rowSelection, setRowSelection] = useState<any>([]);
    const [globalFilter, setGlobalFilter] = useState<string>('');
    const [showClearBtn, setShowClearBtn] = useState(false);
    const [openFullMailModal, setOpenFullMailModal] = useState({
        status: false,
        mailData: "",
    });

    //---------------------------Start function for Hit GET Request to fetch Document List Data List-------------------------------
    const fetchOutlooksMailsData = async (mailsSender: any) => {

        try {
            const web = new Web(props?.AllData?.siteUrl);
            await web.lists.getById(props?.AllData?.DocumentListId).items.select('Id', 'Title', 'Body', 'creationTime', 'Created', 'recipients', 'senderEmail', 'File_x0020_Type').getAll().then((data: any) => {
                let filterMsgDocData = data.filter((item: any) => item.File_x0020_Type === 'msg')

                const updatedData = filterMsgDocData.map((mailsDocs: any) => ({
                    ...mailsDocs,
                    Body: mailsDocs?.Body != null ? mailsDocs?.Body : '',
                    creationTime: mailsDocs?.creationTime != null ? mailsDocs?.creationTime?.split('T')[0] : mailsDocs?.Created?.split('T')[0],
                    recipients: mailsDocs?.recipients != null ? JSON?.parse(mailsDocs?.recipients)[0]?.name : "",
                    senderEmail: mailsDocs?.senderEmail != null ? mailsDocs?.senderEmail : ""
                }));
                if (mailsSender !== undefined) {
                    const confirmationData = confirm(`Want to Show ${mailsSender} Mails`);
                    setShowClearBtn(true);
                    if (confirmationData) {
                        let filterUserMsgDocData = updatedData.filter((item: any) => item.senderEmail === mailsSender)
                        setData(filterUserMsgDocData);
                    } else {
                        setShowClearBtn(false);
                        setData(updatedData);
                        setMailSender(undefined);
                    }
                } else {
                    setData(updatedData);
                    setShowClearBtn(false);
                }
            }).catch((error) => {
                console.log('Error From GQ:', error)
            });
        } catch (error) {
            console.log('Error From TCB:', error)
        }
    }
    //---------------------------Stop function for Hit GET Request to fetch Document List Data List-------------------------------

    const renderFullMailModal = (mailData: any) => setOpenFullMailModal({
        status: true,
        mailData: mailData,
    });




    const closeFullMailModal = () => setOpenFullMailModal({
        status: false,
        mailData: '',
    });

    //---------------------------------------- Hit on Page Relode or on Changes of Main List ---------------------------------
    useEffect(() => {
        fetchOutlooksMailsData(mailSender);
    }, [mailSender])


    // ------------------------------------ Open All TanStack Table Columns Define ------------------------------------------
    const columns: any = useMemo<ColumnDef<any, unknown>[]>(
        () => [
            {
                accessorKey: "Title",
                id: "Title",
                cell: ({ row }) => {
                    return (
                        <div onClick={() => renderFullMailModal(row?.original?.Id)}>
                            <tr style={{ cursor: 'pointer' }}>{row?.original?.Title}</tr>
                        </div>
                    )
                },
                header: "",
                placeholder: "Title",
            },
            {
                accessorKey: "Body",
                id: "Body",
                cell: ({ row }) => {
                    return (
                        <>
                            {row?.original?.Body != "" ? <div className="d-flex justify-content-center align-items-center">
                                <tr>{row?.original?.Body.length > 20 ? row?.original?.Body.substring(0, 20) + '...' : row?.original?.Body}</tr>
                                <InfoIconTooltip FullData={row?.original} />
                            </div> : ''}
                        </>




                    )
                },
                header: "",
                placeholder: "Body",
                // footer: (props) => props.column.id,
            },
            {
                accessorKey: "creationTime",
                id: "creationTime",
                cell: (info) => info.getValue(),
                header: "",
                placeholder: "Creation Time",
                // footer: (props) => props.column.id,
            },
            {
                accessorKey: "recipients",
                id: "recipients",
                header: "",
                placeholder: "Recipients",
                // footer: (props) => props.column.id,
            },
            {
                accessorKey: "senderEmail",
                id: "senderEmail",
                cell: ({ row }) => {
                    return (
                        <div onClick={() => setMailSender(row?.original?.senderEmail)}>
                            <tr style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>{row?.original?.senderEmail}</tr>
                        </div>

                    )
                },
                header: "",
                placeholder: "Sender Email",
                // footer: (props) => props.column.id,
            },
            // masterTaskColumn.accessor("PortfolioStructureID", {
            //   header: 'Portfolio Structure ID'
            // }),
        ], [data])
    //  ------------------------------------ Close All TanStack Table Columns Define ------------------------------------------

    const table = useReactTable({
        data,
        columns,
        state: {
            // expanded,
            rowSelection,
            globalFilter,
            sorting,
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        onRowSelectionChange: setRowSelection,
        getSubRows: (row: any) => row.subRows,
        // onExpandedChange: setExpanded,
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        filterFromLeafRows: true
    });


    return (
        <>
            <div className={`d-flex flex-row justify-content-between ${openFullMailModal.status ? 'container-faded' : null}`}>
                <h1 style={{ color: 'rgb(0,0,102)', fontSize: 30 }}>Outlook Mails</h1>
                {showClearBtn ? <button type="button" className="btn btn-primary align-self-center" style={{ backgroundColor: 'rgb(0,0,102)', height: 30 }} onClick={() => setMailSender(undefined)}>Clear All</button> : null}
            </div>
            <div className={`container ${openFullMailModal.status ? 'container-faded' : null}`}>
                <table className="table">
                    {/* start Table Head Part  */}
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <th
                                            key={header.id}
                                            colSpan={header.colSpan}
                                        >
                                            {header.isPlaceholder ? null : (
                                                <div style={{ display: "flex" }}>
                                                    {flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                                    {header.column.getCanFilter() ? (
                                                        <div className=''>
                                                            <Filter
                                                                column={header.column}
                                                                table={table}
                                                                placeholder={header.column.columnDef}
                                                            />
                                                        </div>
                                                    ) : null}
                                                    {header.column?.getCanSort() ? <div
                                                        {...{
                                                            className: header.column.getCanSort()
                                                                ? "select-none defultSortingIcons"
                                                                : "",
                                                            onClick: header.column.getToggleSortingHandler(),
                                                        }}
                                                    >
                                                        {header.column.getIsSorted()
                                                            ? {
                                                                asc: <div className='upArrow'><SlArrowDown style={{ color: 'blue' }} />
                                                                </div>, desc:
                                                                    <div className='downArrow'>
                                                                        <SlArrowUp style={{ color: 'blue' }} /></div>
                                                            }[
                                                            header.column.getIsSorted() as string
                                                            ] ?? null
                                                            : <><div className='downArrow'>
                                                                <SlArrowUp style={{ color: "#818181" }} /></div>
                                                                <div className='upArrow'><SlArrowDown style={{ color: "#818181" }} /></div></>}
                                                    </div> : ""}
                                                </div>
                                            )}
                                        </th>
                                    );
                                })}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {
                            table?.getRowModel().rows?.map(rowData => (
                                <tr key={rowData?.id} className={`depth-${rowData.depth}`}>
                                    {
                                        rowData?.getVisibleCells().map(cellData => (
                                            <th style={{ fontWeight: 'initial' }} key={cellData?.id} className='text-dark'>
                                                {flexRender(cellData?.column?.columnDef?.cell, cellData?.getContext())}
                                            </th>
                                        ))
                                    }
                                </tr>
                            ))
                        }
                    </tbody>
                    {/* start Table Body Part  */}
                </table>
                {openFullMailModal.status && <FullMailModal closeFullMailModal={closeFullMailModal} mailData={openFullMailModal.mailData} fullData={table.getRowModel().rows} />}
            </div>
        </>
    )
}

export default AllOutlookMails
