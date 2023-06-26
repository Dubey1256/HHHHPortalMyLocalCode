import * as React from 'react';
import { Web } from "sp-pnp-js";
import Table from 'react-bootstrap/Table';
import '../components/Style.css'
import * as XLSX from 'xlsx';
let AccountDetails: any = []
let RequestDetails: any = []
let mergedData: any[] = [];
const DisplayDetails = () => {
    const [requestResultsData, setRequestResultsData] = React.useState([]);
    const [accountDetails, setAccountDetails] = React.useState([]);

    const GetAccountDetails = async () => {
        let web = new Web('https://smalsusinfolabs.sharepoint.com/sites/Portal/SPFxDemo');
        AccountDetails = await web.lists
            .getByTitle('AccountDemo')
            .items
            .select("Id,Title,Account_x0020_Number")
            .getAll();
        await GetRequestDemoDetails();
        const tableContainer = document.getElementById('Account');

        // Create the table element
        const table = document.createElement('table');
        table.classList.add('merged-data-table');

        // Create the table header row
        const headerRow = document.createElement('tr');

        // Extract headers from the merged data objects
        const headers: any = [];
        AccountDetails.forEach((rowData:any) => {
            Object.keys(rowData).forEach((header) => {
                if (!headers.includes(header)&&header!="ID") {
                    headers.push(header);
                }
            });
        });

        headers.forEach((headerText: any) => {
            const headerCell = document.createElement('th');
            headerCell.textContent = headerText;
            headerRow.appendChild(headerCell);
        });

        table.appendChild(headerRow);

        // Create the table body rows
        AccountDetails.forEach((rowData:any) => {
            const row = document.createElement('tr');

            headers.forEach((header: any) => {
                const cell = document.createElement('td');
                cell.textContent = rowData[header] || '';
                row.appendChild(cell);
            });

            table.appendChild(row);
        });

        // Append the table to the table container
        tableContainer.appendChild(table);

        setAccountDetails(AccountDetails);
    }
    const GetRequestDemoDetails = async () => {
        let web = new Web('https://smalsusinfolabs.sharepoint.com/sites/Portal/SPFxDemo');
        RequestDetails = await web.lists
            .getByTitle('RequestDemo')
            .items
            .select("Id,Title,ResquestStatus,RequestComment,AccountNumber/Id,AccountNumber/Title,AccountNumber/Account_x0020_Number")
            .expand('AccountNumber')
            .getAll();
        RequestDetails?.map((request: any) => {
            request.AccountNo = request.AccountNumber?.map((elem: any) => elem.Account_x0020_Number).join(",")
        })
        const tableContainer = document.getElementById('Request');

        // Create the table element
        const table = document.createElement('table');
        table.classList.add('merged-data-table');

        // Create the table header row
        const headerRow = document.createElement('tr');

        // Extract headers from the merged data objects
        const headers: any = [];
        RequestDetails.forEach((rowData:any) => {
            Object.keys(rowData).forEach((header) => {
                if (!headers.includes(header)&&header!="AccountNumber"&&header!="ID") {
                    headers.push(header);
                }
            });
        });

        headers.forEach((headerText: any) => {
            const headerCell = document.createElement('th');
            headerCell.textContent = headerText;
            headerRow.appendChild(headerCell);
        });

        table.appendChild(headerRow);

        // Create the table body rows
        RequestDetails.forEach((rowData:any) => {
            const row = document.createElement('tr');

            headers.forEach((header: any) => {
                const cell = document.createElement('td');
                cell.textContent = rowData[header] || '';
                row.appendChild(cell);
            });

            table.appendChild(row);
        });

        // Append the table to the table container
        tableContainer.appendChild(table);
        mergeData();
        setRequestResultsData(RequestDetails);
    }
    const mergeData = () => {
        mergedData = [];

        AccountDetails.forEach((account: any) => {
            const mergedItem: any = {
                ID: account.ID,
                AccountNumber: account.Account_x0020_Number,
                AccountName: account.Title,
            };

            const matchingRequests = RequestDetails.filter((request: any) => request.AccountNo.includes(account.Account_x0020_Number));

            matchingRequests.forEach((request: any, index: any) => {
                mergedItem[`ResquestStatus ${index + 1}`] = request.ResquestStatus;
                mergedItem[`RequestComment ${index + 1}`] = request.RequestComment;
            });

            mergedData.push(mergedItem);
        });
        // const arr = Object.keys(mergedData[0]);
        // console.log(arr);
        // // Display the merged data
        console.table(mergedData);
        const tableContainer = document.getElementById('table1');

        // Create the table element
        const table = document.createElement('table');
        table.classList.add('merged-data-table');

        // Create the table header row
        const headerRow = document.createElement('tr');

        // Extract headers from the merged data objects
        const headers: any = [];
        mergedData.forEach((rowData) => {
            Object.keys(rowData).forEach((header) => {
                if (!headers.includes(header)) {
                    headers.push(header);
                }
            });
        });

        headers.forEach((headerText: any) => {
            const headerCell = document.createElement('th');
            headerCell.textContent = headerText;
            headerRow.appendChild(headerCell);
        });

        table.appendChild(headerRow);

        // Create the table body rows
        mergedData.forEach((rowData) => {
            const row = document.createElement('tr');

            headers.forEach((header: any) => {
                const cell = document.createElement('td');
                cell.textContent = rowData[header] || '';
                row.appendChild(cell);
            });

            table.appendChild(row);
        });

        // Append the table to the table container
        tableContainer.appendChild(table);
    }

    React.useEffect(() => {
        GetAccountDetails();

        mergeData();
    }, [])
    console.log('requestResultsData accountDetails', requestResultsData, accountDetails)


    function exportToExcel(tableData: any[], fileName: string) {
        const worksheet = XLSX.utils.json_to_sheet(tableData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet 1');
        XLSX.writeFile(workbook, fileName + '.xlsx');
    }


    return (
        <>
            <span onClick={() => exportToExcel(mergedData, 'table_export')}>Export To Excel</span >
            <div id='Account'>

            </div>
            <div id='Request'>

            </div>
            <div id='table1'>

            </div>
        </>
    )
}; export default DisplayDetails;