import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Web } from 'sp-pnp-js';
import { ColumnDef } from '@tanstack/react-table';
import LeavePortal from './LeavePortal';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import GlobalCommanTable from '../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable';
export default function SiteDataBackupTool(selectedProps: any) {
    const [ListData, setListData]: any[] = useState([]);
    const [Popupopen, setPopupopen] = useState(Boolean);
    const LoginUser: any = selectedProps.AllList.userDisplayName
    var AllLeavesApplications: any[] = []
    const GetBackupConfig = async () => {
        try {
            let web = new Web(selectedProps.AllList.SPBackupConfigListUrl);
            AllLeavesApplications = await web.lists.getById(selectedProps.AllList.SPBackupConfigListID).items.getAll();
            if (AllLeavesApplications)
                LoadAllTaskusers();

        } catch (error) {
            console.error(error);
        }
    };
    var AllUsers: any[] = [];
    var AllDepartments: any[] = [];
    const LoadAllTaskusers = async () => {
        try {
            let web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/SP/');
            const TaskUsers: any = await web.lists.getById('b318ba84-e21d-4876-8851-88b94b9dc300').items.getAll();
            if (TaskUsers) {
                TaskUsers.forEach((user: any) => {
                    if (user.ItemType && user.ItemType === "User") {
                        AllUsers.push(user);
                    } else {
                        AllDepartments.push(user);
                    }
                })
            }
            MyLeaves();
            console.log(AllDepartments)
        } catch (error) {
            console.error(error);
        }
    };
    var UserLeaves: any[] = [];
    const MyLeaves = async () => {
        try {
            AllUsers.forEach((user: any) => {
                if (user.Title && user.Title === LoginUser) {
                    AllLeavesApplications.forEach((app: any) => {
                        if (app.Name === LoginUser) {
                            UserLeaves.push(app)
                            console.log(UserLeaves);
                        }
                    })
                }
            })
            setListData(UserLeaves);
        } catch (error) {
            console.error(error);
        }
    };
    const closeLeavesPopup = () => {
        setPopupopen(false)
    };
    const OpenLeavesPopup = () => {
        setPopupopen(true)
    };
    useEffect(() => {
        GetBackupConfig()
    }, [0])
    const columns = useMemo<ColumnDef<any, unknown>[]>(() => [{
        accessorKey: "Title", placeholder: "Title", header: "", size: 30,
        cell: ({ row }) => (
            <>
                <div className='alignCenter'>
                    <span title="Tick" className="svg__iconbox svg__icon--tickRight"></span>
                    {row?.original?.Title != undefined && row?.original?.Title != null && row?.original?.Title != '' ? <a className='ms-2'>{row?.original?.Title}</a> : ""}
                </div>
            </>
        ),
    }],
        [ListData]);
    const callBackData = useCallback((elem: any, getSelectedRowModel: any, ShowingData: any) => {
    }, []);
    return (
        <>
            <div>
                <PrimaryButton type="button" onClick={() => OpenLeavesPopup()}>Add Leaves</PrimaryButton></div>
            {
                ListData &&
                < GlobalCommanTable columns={columns} data={ListData} showHeader={true} callBackData={callBackData} />
            }
            {
                Popupopen ? <LeavePortal OpenLeavesPopup={OpenLeavesPopup} closeLeavesPopup={closeLeavesPopup} /> : ''
            }
        </>
    )
}