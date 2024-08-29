import * as React from 'react'
import { useEffect, useState, useMemo } from 'react';
import { Web } from "sp-pnp-js";
import './AllOutlookMails.css'
import GlobalCommanTable from '../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable';
import {
 ColumnDef,  // Type of TypeScript , Define Structure of Column , Helping in Type Checking
} from '@tanstack/react-table'
import FullMailModal from './FullMailModal';
import OutlookInfoIconToolTip from '../../../globalComponents/InfoIconsToolTip/OutlookInfoIconTooltip';

const AllOutlookMails = (props: any) => {
    const [data, setData] = useState([]);
    const [mailSender, setMailSender] = useState(undefined)
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
                accessorKey: "",
                placeholder: "",
                hasCheckbox: false,
                hasCustomExpanded: false,
                hasExpanded: false,
                isHeaderNotAvlable: true,
                size: 10,
                id: 'Id',
            },
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
                                {row?.original?.Body && <OutlookInfoIconToolTip Discription={row?.original?.Title} row={row?.original} />}
                                
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
                placeholder: "Created",
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

    const callBackData = React.useCallback((elem: any, ShowingData: any) => {
    }, []);


    return (
        <>
            <div className={`d-flex flex-row justify-content-between ${openFullMailModal.status ? 'container-faded' : null}`}>
                <h1 style={{ color: 'rgb(0,0,102)', fontSize: 30 }}>Outlook Mails</h1>
                {showClearBtn ? <button type="button" className="btn btn-primary align-self-center" style={{ backgroundColor: 'rgb(0,0,102)', height: 30 }} onClick={() => setMailSender(undefined)}>Clear All</button> : null}
            </div>
            <div className={`container ${openFullMailModal.status ? 'container-faded' : null}`}>
                <GlobalCommanTable columns={columns} callBackData={callBackData} showHeader={true} data={data} />
            </div>
            {openFullMailModal.status && <FullMailModal closeFullMailModal={closeFullMailModal} mailData={openFullMailModal.mailData} fullData={data} />}

        </>
    )
}

export default AllOutlookMails
