import { ColumnDef } from '@tanstack/react-table';
import { Panel, PanelType, PrimaryButton } from 'office-ui-fabric-react';
import * as React from 'react';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Web, sp } from 'sp-pnp-js';
import GlobalCommanTable from '../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable';
import moment from 'moment';
import Tooltip from "../../../globalComponents/Tooltip";
let modaltype: any;
let ItemRankArray = [
    { rankTitle: 'Select Item Rank', rank: null },
    { rankTitle: '(8) Top Highlights', rank: 8 },
    { rankTitle: '(7) Featured Item', rank: 7 },
    { rankTitle: '(6) Key Item', rank: 6 },
    { rankTitle: '(5) Relevant Item', rank: 5 },
    { rankTitle: '(4) Background Item', rank: 4 },
    { rankTitle: '(2) to be verified', rank: 2 },
    { rankTitle: '(1) Archive', rank: 1 },
    { rankTitle: '(0) No Show', rank: 0 }
]
let PriorityArray = [
    { priorityTitle: 'Select Priority', priority: null },
    { priorityTitle: '(8) High', priority: 8 },
    { priorityTitle: '(4) Normal', priority: 4 },
    { priorityTitle: '(1) Low', priority: 1 }
]
let AllSelectedTask: any[] = []
var updatedTableData:any[] = []
export default function BulkeditTask(props: any) {
    const [isModalOpen, IsModalPopupOpen] = useState(false);
    const [TaskStatusPopup, setTaskStatusPopup] = React.useState(false);
    const [tableData, setTableData] = useState(props.SelectedTask);
    const [Priority, setPriority] = React.useState('');
    const [Duedate, setDuedate] = React.useState('');
    const [Itemrank, setItemrank] = React.useState('');
    const [Status, setStatus] = React.useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    let [StatusOptions, setStatusOptions] = useState([
        { value: 0, status: "0% Not Started", taskStatusComment: "Not Started" },
        { value: 1, status: "1% For Approval", taskStatusComment: "For Approval" },
        { value: 2, status: "2% Follow Up", taskStatusComment: "Follow Up" },
        { value: 3, status: "3% Approved", taskStatusComment: "Approved" },
        { value: 5, status: "5% Acknowledged", taskStatusComment: "Acknowledged" },
        { value: 10, status: "10% working on it", taskStatusComment: "working on it" }
    ]);
    const [isTableVisible, setTableVisibility] = useState(true);
    const toggleTable = () => {
        setTableVisibility(!isTableVisible);
    };

    AllSelectedTask = props.SelectedTask
    useEffect(() => {
        updatedTableData = AllSelectedTask.map((i) => ({
            ...i,
            NewPriority: Priority,
            NewDueDate: Duedate,
            NewStatus: Status,
            NewItemRank: Itemrank,
            NewBulkUpdate: true
        }));

        setTableData(updatedTableData);
        AllSelectedTask = updatedTableData;
    }, [AllSelectedTask, Priority, Duedate, Status, Itemrank]);
    const openBulkItemUpdatePopup = () => {
        IsModalPopupOpen(true);
        setTableVisibility(true);
        setModalIsOpen(true);

    };
    const CloseBulkItemUpdatePopup = () => {
        IsModalPopupOpen(false);
    };
    const columns = useMemo<ColumnDef<unknown, unknown>[]>(() =>
        [{
            accessorKey: "",
            placeholder: "",
            size: 5,
            id: 'Id',
        },
            {
                cell: ({ row }: any) => (
                    <>
                        <img className="icon-sites-img ml20 me-1" src={`${row.original.SiteIcon != null && row.original.SiteIcon != null ? row.original.SiteIcon : ''}`} />
                    </>
                ),
                accessorKey: '',
                placeholder: 'Site',
                header: '',
                id: 'icons',
                size: 10,
            },
            { accessorKey: "TaskID", placeholder: "Id", header: "", size: 10, },
            {
                cell: ({ row }: any) => (
                    <a target='_blank' href={`https://hhhhteams.sharepoint.com/sites/HHHH/sp/SitePages/Task-Profile.aspx?taskId=${row?.original.Id}&Site=${row?.original.Title}`}>{row.original.Title}</a>

                ),
                accessorKey: 'Title',
                canSort: false,
                placeholder: 'Task Title',
                header: '',
                id: 'row.original',
                size: 10,
            },
            { accessorKey: "Priority", placeholder: "OldPriority", header: "", size: 10, },
            { accessorKey: "NewPriority", placeholder: "NewPriority", header: "", size: 10, },
            { accessorKey: "ItemRank", placeholder: "OldItemRank", header: "", size: 10, },
            { accessorKey: "NewItemRank", placeholder: "NewItemRank", header: "", size: 10, },
            { accessorKey: "Status", placeholder: "OldStatus", header: "", size: 10, },
            { accessorKey: "NewStatus", placeholder: "NewStatus", header: "", size: 10, },
            { accessorKey: "DueDate", placeholder: "OldDueDate", header: "", size: 10, },
            { accessorKey: "NewDueDate", placeholder: "NewDueDate", header: "", size: 10, },
        ], [AllSelectedTask]);
    const PercentCompleted = (StatusData: any) => {
        setTaskStatusPopup(false);
        setStatus(StatusData)
    }
    const closeTaskStatusUpdatePopup = () => {
        setTaskStatusPopup(false)
    }
    const openTaskStatusUpdatePopup = (itemData: any) => {
        setTaskStatusPopup(true);
    }
    const UpdateBulkTask = async (typeFunction: any) => {
        let TaskShuoldBeUpdate = true;
        if (TaskShuoldBeUpdate) {
            var siteUrls: any;
            AllSelectedTask.forEach(async (item: any) => {
                if (item != undefined && item.siteUrl != undefined && item.siteUrl.length < 20) {
                    if (item.siteType != undefined) {
                        siteUrls = `https://hhhhteams.sharepoint.com/sites/${item.siteType}${item.siteUrl}`
                    } else {
                        siteUrls = "https://hhhhteams.sharepoint.com/sites/HHHH/SP/";
                    }
                } else {
                    siteUrls = "https://hhhhteams.sharepoint.com/sites/HHHH/SP/"
                }
                try {
                    let postData = {
                        Priority: Priority,
                        ItemRank: Itemrank ? Itemrank : item.ItemRank,
                        Status: Status ? Status : (item.Status ? item.Status : null),
                        DueDate: Duedate && Duedate != "" ? moment(Duedate).format("MM-DD-YYYY") : (item.DueDate ? moment(item.DueDate).format("MM-DD-YYYY") : null),
                    }
                    let web = new Web(siteUrls);
                    await web.lists.getById(item.listId).items.getById(item.Id).update(postData).then(async (res: any) => {
                        // callBackData('',res);
                        CloseBulkItemUpdatePopup()
                        props.Call(updatedTableData)
                      
                    })
                } catch (error) {
                    console.log("Error:", error.messages)
                }
            })

        }
    }
    const onRenderCustomHeaderMain = () => {
        return (
            <div className='d-flex full-width pb-1'>
                <div className='subheading'>
                    <span className="siteColor">
                    Bulk Item Update
                    </span>
                </div>
                <Tooltip ComponentId="528" />
            </div>
        );
    };
    const onRenderCustomHeaderUpdatePopup = () => {
        return (
            <div className='d-flex full-width pb-1'>
                <div className='subheading'>
                    <span className="siteColor">
                    Update Task Status
                    </span>
                </div>
                <Tooltip ComponentId="528" />
            </div>
        );
    };
    const callBackData = useCallback((elem: any, getSelectedRowModel: any) => {
        console.log(getSelectedRowModel)
    }, []);
    return (
        <>
        <div>
            <button
            className="btn btn-primary position-relative"
            style={{ zIndex: '9999',left: '584px',top: '33px',padding:' 4px 12px !important'}}
            onClick={openBulkItemUpdatePopup} disabled={AllSelectedTask.length === 0}> 
            Bulk Item Update</button>
        </div>
        
            <Panel
                type={PanelType.large}
                isOpen={isModalOpen}
                onDismiss={CloseBulkItemUpdatePopup}
                onRenderHeader={onRenderCustomHeaderMain}
                isBlocking={isModalOpen}
                closeButtonAriaLabel="Close">
                <div className="modal-body">
                    <div>
                        <div className='alignCenter'>
                            <span onClick={toggleTable}>
                                {isTableVisible && (
                                        <span className="alignIcon  svg__iconbox svg__icon--arrowDown"></span>
                                )}
                                {!isTableVisible && (
                                        <span className="alignIcon  svg__iconbox svg__icon--arrowRight"></span>
                                )}
                                
                            </span>
                            <span className='f-16 fw-bold'>
                                Selected Tasks To be Updated
                            </span>
                        </div>
                   
                            {isTableVisible && (
                            <div className='Alltable'>
                                {AllSelectedTask && (
                                    <GlobalCommanTable  columns={columns} data={tableData} showHeader={true} callBackData={callBackData} />
                                )}
                            </div>
                        )}                              
                    </div>
                    <div className='clearfix'></div>
                    <div className='border mt-2 p-2'>

                    <div className="row mb-2">
                        <div className="col">
                            <div className='input-group '>
                            <label className="form-label full-width">Priority</label>
                            <select
                                className="form-select"
                                value={Priority}
                                onChange={(e) => setPriority(e.target.value)}
                            >
                                {PriorityArray.map(function (h: any, i: any) {
                                    return (
                                        <option key={i} value={h.priority}>
                                            {h.priorityTitle}
                                        </option>
                                    );
                                })}
                            </select>
                            </div>
                        </div>
                        <div className="col">
                        <div className='input-group'>
                            <label className="form-label full-width">Due Date</label>
                            <input
                                type="date"
                                className="form-control"
                                placeholder="Enter Due Date"
                                value={Duedate}
                                onChange={(e) => setDuedate(e.target.value)}
                            />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                        <div className='input-group'>
                            <label className="form-label full-width">Item Rank</label>
                            <select
                                className="form-select"
                                value={Itemrank}
                                onChange={(e) => setItemrank(e.target.value)}
                            >
                                {ItemRankArray.map(function (h: any, i: any) {
                                    return (
                                        <option key={i} value={h.rank}>
                                            {h.rankTitle}
                                        </option>
                                    );
                                })}
                            </select>
                            </div>
                        </div>
                        <div className="col">
                            <div className='input-group'>
                            <div className='input-group'>
                                <label className="form-label full-width">Status</label>
                                <input
                                    type="text"
                                    maxLength={3}
                                    placeholder="% Complete"
                                    className="form-control"
                                    defaultValue={Status}
                                />
                                </div>
                                <span
                                    className="input-group-text"
                                    title="Status Popup"
                                    onClick={openTaskStatusUpdatePopup}
                                >
                                    <span title="Edit Task" className="svg__iconbox svg__icon--editBox"></span>
                                </span>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
                <div className='modal-footer mt-2'>
                    <button onClick={UpdateBulkTask} type='button' className='btnCol btn btn-primary me-2'>Update</button>
                    <button onClick={CloseBulkItemUpdatePopup} type='button' className='btnCol btn btn-default px-3'>Cancel</button>
                </div>
            </Panel>
            <Panel
                type={PanelType.large}
                isOpen={TaskStatusPopup}
                onDismiss={closeTaskStatusUpdatePopup}
                onRenderHeader={onRenderCustomHeaderUpdatePopup}
                isBlocking={TaskStatusPopup}
                closeButtonAriaLabel="Close">
            
                <div>
                    <div className="modal-body">
                        <div className="TaskStatus">
                            <div><div>
                                {StatusOptions?.map((item: any, index: any) => {
                                    return (
                                        <li key={index}>
                                            <div className="form-check ">
                                                <label className="SpfxCheckRadio">
                                                    <input
                                                        className="radio"
                                                        onClick={(e) => PercentCompleted(item.taskStatusComment)} // Wrap in an arrow function
                                                        type="radio"
                                                        value={item.taskStatusComment}
                                                    />
                                                    {item.status} </label>
                                            </div>
                                        </li>
                                    )
                                })}
                            </div>
                            </div>
                        </div>
                    </div>

                </div>
            </Panel>
        </>
    );
}


