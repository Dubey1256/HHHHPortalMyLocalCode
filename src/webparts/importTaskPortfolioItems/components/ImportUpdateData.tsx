import { Panel, PanelType } from 'office-ui-fabric-react';
import React from 'react';
import { useEffect, useState, useCallback } from 'react';
import { CamlQuery, Web } from 'sp-pnp-js';
import * as XLSX from 'xlsx';
import * as globalCommon from "../../../globalComponents/globalCommon";
import * as Moment from "moment";
import { ColumnDef } from '@tanstack/react-table';
import { data } from 'jquery';
import GlobalCommanTable from '../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable';
import PageLoader from '../../../globalComponents/pageLoader';
let BriefwahlBatches: any = [];
let allListId: any = {};
let CopyAllExceldata: any = []
const ImportExcel = (props: any) => {
    const [selectedFile, setselectedFile] = useState<File | null>(null);
    const [showpopup, setShowPopup] = React.useState(false);
    const [AllExceldata, setAllExceldata] = React.useState([]);
    const [loaded, setLoaded] = React.useState(false);
    useEffect(() => {
        allListId = {
            Context: props?.props.Context,
            MasterTaskListID: props?.props?.MasterTaskListID,
            TaskListID: props?.props?.TaskListID,
            siteUrl: props?.props.Context.pageContext.web.absoluteUrl,
            jointSiteUrl: props?.props.Context.pageContext._site.absoluteUrl
        }
    }, [])

    const handleFileChange = (event: any) => {
        const file = event?.target?.files[0];
        setselectedFile(file)
    };

    const ImportExcel = () => {
        showProgressBar()
        let bindExcelData: any[] = [];
        CopyAllExceldata = []
        setAllExceldata([])
        if (selectedFile) {
            const regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xlsx|.xls)$/;
            if (regex.test(selectedFile.name)) {
                let isXlsx = false;
                if (selectedFile.name.indexOf('.xlsx') > 0) {
                    isXlsx = true;
                }
                const reader = new FileReader();
                reader.onload = (e) => {
                    const data = e.target?.result;
                    if (data) {
                        // Read workbook data
                        const workbook = XLSX.read(data, { type: isXlsx ? 'array' : 'binary' });
                        // Process each sheet in the workbook
                        const sheetNameList = workbook.SheetNames;
                        sheetNameList.forEach((sheetName) => {
                            let excelJson: any;
                            // Convert sheet data to JSON
                            excelJson = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
                            // Add the sheet data to bindExcelData
                            bindExcelData.push(excelJson);
                        });
                        // Log the first sheet's data for debugging
                        console.log(bindExcelData[0]);
                        CopyAllExceldata = bindExcelData[0]
                        setAllExceldata(bindExcelData[0])
                        // Call UploadData with the processed data
                        //UploadData(bindExcelData[0]);
                        showProgressHide()
                    }
                };
                // Read the file based on its type
                if (isXlsx) {
                    reader.readAsArrayBuffer(selectedFile);
                } else {
                    reader.readAsBinaryString(selectedFile);
                }
            } else {
                alert('Please upload a valid Excel file!');
            }
        } else {
            alert('No file selected!');
        }
    };
    const column: any = React.useMemo<ColumnDef<any, unknown>[]>(
        () => [
            {
                accessorFn: (row) => row?.Title,
                id: 'Title',
                header: '',
                placeholder: "Title",
                size: 110,

            },
            {
                id: 'Priority',
                header: '',
                accessorFn: (row) => row?.Priority,
                placeholder: "Priority",
                size: 160,

            },
            {
                id: 'ItemType',
                header: '',
                accessorFn: (row) => row?.ItemType,
                placeholder: "Item Type",
                size: 160,

            },
            {
                id: 'PercentComplete',
                header: '',
                accessorFn: (row) => row?.PercentComplete,
                placeholder: "PercentComplete",
                size: 160,

            },
            {
                id: 'Status',
                header: '',
                accessorFn: (row) => row?.Status,
                placeholder: "Status",
                size: 50,
            },
            {
                id: 'ItemRank',
                header: '',
                accessorKey: 'ItemRank',
                placeholder: "ItemRank",
                size: 90,

            },
            {
                id: 'PriorityRank',
                header: '',
                accessorKey: 'PriorityRank',
                placeholder: "PriorityRank",
                size: 90,

            },
            // {
            //     id: 'StartDate',
            //     header: '',
            //     accessorKey: 'StartDate',
            //     placeholder: "StartDate",
            //     size: 90,

            // },
            // {
            //     id: 'DueDate',
            //     header: '',
            //     accessorKey: 'DueDate',
            //     placeholder: "DueDate",
            //     size: 90,

            // },
            // {
            //     id: 'CompletedDate',
            //     header: '',
            //     accessorKey: 'CompletedDate',
            //     placeholder: "CompletedDate",
            //     size: 90,

            // }
        ],
        [AllExceldata]
    );
    const callBackData = React.useCallback((elem: any, ShowingData: any) => {

    }, []);

    const cancelPopup = () => {
        setShowPopup(false);
    }

    var showProgressBar = () => {
        setLoaded(true)
        $(' #SpfxProgressbar').show();
    }

    var showProgressHide = () => {
        setLoaded(false)
        $(' #SpfxProgressbar').hide();
    }

    const UploadData = async (items: any) => {
        showProgressBar()
        let count = 0;
        let web = new Web(allListId?.siteUrl);
        items.forEach(async (parItems: any, index: any) => {
            let SmartPriority = globalCommon.calculateSmartPriority(parItems)
            let postData: any = {
                Title: parItems.Title ? parItems.Title : '',
                Priority: parItems.Priority,
                Item_x0020_Type: parItems.ItemType,
                PercentComplete: parItems.PercentComplete != "" ? Number(parItems.PercentComplete) / 100
                    : parItems.PercentComplete
                        ? parItems.PercentComplete / 100
                        : 0,
                Status: parItems.Status ? parItems.Status : null,
                ItemRank: parItems.ItemRank,
                PriorityRank: parItems.PriorityRank,
                StartDate: parItems.StartDate ? Moment(parItems.StartDate).format("MM-DD-YYYY") : null,
                DueDate: parItems.DueDate ? Moment(parItems.DueDate).format("MM-DD-YYYY") : null,
                CompletedDate: parItems.CompletedDate ? Moment(parItems.CompletedDate).format("MM-DD-YYYY") : null,
            }
            let postDataTask: any = {
                Title: parItems.Title ? parItems.Title : '',
                Priority: parItems.Priority,
                TaskTypeId: parItems.ItemType == 'Activities' ? 1 : parItems.ItemType == 'Workstream' ? 2 : parItems.ItemType == 'Task' ? 3 : null,
                PercentComplete: parItems.PercentComplete != "" ? Number(parItems.PercentComplete) / 100
                    : parItems.PercentComplete
                        ? parItems.PercentComplete / 100
                        : 0,
                Status: parItems.Status ? parItems.Status : null,
                ItemRank: parItems.ItemRank,
                PriorityRank: parItems.PriorityRank,
                StartDate: parItems.StartDate ? Moment(parItems.StartDate).format("MM-DD-YYYY") : null,
                DueDate: parItems.DueDate ? Moment(parItems.DueDate).format("MM-DD-YYYY") : null,
                CompletedDate: parItems.CompletedDate ? Moment(parItems.CompletedDate).format("MM-DD-YYYY") : null,
            }
            // postData = {
            //     ...postData,
            //     SmartPriority: SmartPriority,
            //     TaskTypeId: parItems.ItemType == 'Activities'?1:parItems.ItemType == 'Workstream'?2:parItems.ItemType == 'Task'?3:null
            // }
            try {
                if (parItems.ItemType && parItems.ItemType == 'Component' || parItems.ItemType == 'SubComponent' || parItems.ItemType == 'Feature') {
                    await web.lists.getById(allListId?.MasterTaskListID).items.add(postData);
                    console.log('Data Updated');
                    count++;
                    if (items.length === count) {
                        console.log('Data Inserted Successfully' + items.Title);
                        alert('Data Inserted Successfully')
                        setAllExceldata([])
                        showProgressHide()
                    }
                } else if (parItems.ItemType && parItems.ItemType == 'Activities' || parItems.ItemType == 'Workstream' || parItems.ItemType == 'Task') {
                    await web.lists.getById(allListId?.TaskListID).items.add(postDataTask);
                    console.log('Data Updated');
                    count++;
                    if (items.length === count) {
                        console.log('Data Inserted Successfully' + items.Title);
                        alert('Data Inserted Successfully')
                        setAllExceldata([])
                        showProgressHide()
                    }
                } else {
                    count++;
                }
            } catch (error) {
                CopyAllExceldata.splice(index, 1)
                count++;
                console.error('Error updating data:', error);
                showProgressHide()
            }
        })
    };
    const onRenderCustomHeaderContactPopup = () => {
        return (
            <>
                <div className='subheading'>
                    Import Task/Component
                </div>
            </>
        );
    }
    const customTableHeaderButtons = (
        <button className='btn btn-primary' onClick={() => UploadData(CopyAllExceldata)}>Sync All Component/Task</button>
    )
    return (
        <><div className="container">
            {/* <div id="SpfxProgressbar" style={{ display: "none" }}>
                <img id="sharewebprogressbar-image" src={`${allListId?.jointSiteUrl}/sp/SiteCollectionImages/ICONS/32/loading_apple.gif`} alt="Loading..." />
            </div> */}
            <header className="page-header">
                <h3 className="page-title heading">Import Tasks/Components</h3>
            </header>
            <div className='my-2 alignCenter'>
                <span className='alignCenter'>
                    <input type="file" className='p-1' onChange={handleFileChange} />
                    <button className='btnCol btn btn-primary ms-3' onClick={() => ImportExcel()}>Upload Document</button>
                </span>
            </div>
            <div className='Alltable'>
                <GlobalCommanTable columns={column} data={AllExceldata} callBackData={callBackData} setLoaded={setLoaded} showHeader={true} customHeaderButtonAvailable={true} customTableHeaderButtons={customTableHeaderButtons} />
                {loaded && <PageLoader />}
            </div>
            {/* <Panel onRenderHeader={onRenderCustomHeaderContactPopup}
                isOpen={showpopup}
                onDismiss={cancelPopup}
                isBlocking={false}
                type={PanelType.medium}>
                <div className='input-group'>
                    {BriefwahlBatches.map((batchItems: any) => {
                        return (
                            <>
                                <div>
                                    <button onClick={() => UploadData(batchItems)}>{batchItems.Title}</button>
                                </div>
                            </>
                        )
                    })}
                </div>
            </Panel> */}
        </div>
        </>
    )

}
export default ImportExcel;
