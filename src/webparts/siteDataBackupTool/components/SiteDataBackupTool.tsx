import React, { useState, useEffect, useCallback } from 'react';
import { sp, Web } from 'sp-pnp-js';
import "@pnp/sp/lists";
import "@pnp/sp/items";
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';
export default function SiteDataBackupTool(selectedProps: any) {
    const [ListData, setListData] = useState<Item[]>([]);
    const [successMessage, setSuccessMessage] = useState(false);
    const [selectedFile, setselectedFile]: any = useState([]);
    let Domain=selectedProps?.SPBackupConfigListUrl?.toLowerCase();
    let labelSiteName='';
    if(Domain?.indexOf("sp") > -1){
        labelSiteName='SP Site';
    }
    if(Domain?.indexOf("gmbh") > -1){
        labelSiteName='GMBH Site';
    }
    let DomainUrl=Domain?.split('/sites/')[0];
    var listData: any[] = [];
    interface Item {
        SiteUrl: string;
        List_x0020_Id: string;
        Site_x0020_Name: string;

        Title: string;
        Items: any[];
        [key: string]: any;
    }
    async function readFileAsArrayBuffer(file: any) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function (event: any) {
                resolve(event.target.result);
            };
            reader.onerror = function (event: any) {
                reject(event.error);
            };
            reader.readAsArrayBuffer(file);
        });
    }
    const handleFileChange = (event: any) => {
        const file = event.target.files[0];
        setselectedFile(file)
    };
    const uploadDocument = async () => {
        if (selectedFile !== undefined) {
            var libraryName = "Documents";
            var folderName = "DataBackup";
            let library =''
            if(Domain?.indexOf("sp") > -1)
                {
                     library = `/sites/HHHH/SP/${libraryName}/${folderName}`;
                }
          
            if(Domain?.indexOf("gmbh") > -1)
                {
                    library = `/sites/HHHH/Gmbh/${libraryName}/${folderName}`;
                }
             
            const fileName = selectedFile?.name;
            try {
                const fileContent: any = await readFileAsArrayBuffer(selectedFile);
                const response = await sp.web.getFolderByServerRelativeUrl(library).files.add(fileName, fileContent, true);
                console.log(response);
                setSuccessMessage(true);
            } catch (error) {
                console.error(error);
            }
        }
    };
    const isItemExists = (array: Item[], key: string, value: string) => {
        for (let i = 0; i < array.length; i++) {
            if (array[i][key] === value) {
                return i;
            }
        }
        return -1; // Return -1 if the item is not found (similar to findIndex)
    };


    var lookupColums: any[]
    const DataBackup = async (Values: any) => {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.toLocaleString('default', { month: 'long' });
        const dayOfWeek = now.toLocaleString('default', { weekday: 'long' });
        const todaydays = Values === 'Daily' ? dayOfWeek : `${month}-${year}`;
        const sheetName = 'HHHH' + "-DataBackup-" + todaydays + ".xlsx";
        const workbook = XLSX.utils.book_new();
        ListData.forEach(site => {
            if (site.Items.length > 0) {
                const ExcelData = [...site.Items];
                if (site.Query) {
                    try {
                        lookupColums = [...site.Query?.split('&$expand=')[1].split(',')]
                        ExcelData.forEach((colum1: any, index: number) => {
                            lookupColums.forEach((colum2: string) => {
                                if (colum1[colum2]) {
                                    var ColumnValue = colum2;
                                    colum1[colum2] = (colum1[ColumnValue])[0]?.Title === undefined ? (colum1[ColumnValue])?.Title : (colum1[ColumnValue])[0]?.Title;
                                }
                            })
                        })
                    } catch (e) {
                        console.log(e)
                    }
                }
                const worksheet: any = XLSX.utils.aoa_to_sheet([]);
                XLSX.utils.sheet_add_json(worksheet, ExcelData, {
                    skipHeader: false,
                    origin: "A1",
                });
                const maxLength = 32767;
                const sheetRange = XLSX.utils.decode_range(worksheet["!ref"]);
                for (let R = sheetRange.s.r; R <= sheetRange.e.r; ++R) {
                    for (let C = sheetRange.s.c; C <= sheetRange.e.c; ++C) {
                        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
                        const cell = worksheet[cellAddress];
                        if (cell && cell.t === "s" && cell.v.length > maxLength) {
                            const chunks = [];
                            let text = cell.v;
                            while (text.length > maxLength) {
                                chunks.push(text.slice(0, maxLength));
                                text = text.slice(maxLength);
                            }
                            chunks.push(text);
                            cell.v = chunks.shift();
                            chunks.forEach((chunk) => {
                                const newCellAddress = XLSX.utils.encode_cell({
                                    r: R + chunks.length,
                                    c: C,
                                });
                                worksheet[newCellAddress] = { t: "s", v: chunk };
                            });
                        }
                    }
                }
                XLSX.utils.book_append_sheet(workbook, worksheet, site.Title);
            }
        });
        const excelBuffer: any = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "buffer",
        });
        const excelData: any = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        if (typeof FileSaver === "function") {
            FileSaver(excelData, sheetName);
        } else {
            const downloadLink = document.createElement("a");
            downloadLink.href = URL.createObjectURL(excelData);
            downloadLink.download = sheetName; // Replace with your desired file name
            downloadLink.click();
        }
    }
    const QueryBasedOnLookup: any = [];
    const GetBackupConfig = async () => {
        try {
            let web = new Web(selectedProps?.SPBackupConfigListUrl);
            const LoadBackups = await web.lists.getById(selectedProps?.SPBackupConfigListID).items.getAll();
            if (LoadBackups !== undefined) {
                LoadBackups.forEach((element: any) => {
                    if (element.Backup === true && element.Columns !== '') {
                        QueryBasedOnLookup.push({
                            ...element,
                        });
                    }
                });
                LoadQueryBasedOnLookup();
            }
        } catch (error) {
            console.error(error);
        }
    };
    const LoadQueryBasedOnLookup = async () => {
        var count = 0;
        await Promise.all(QueryBasedOnLookup.map(async (item: Item) => {
           
            try {
                let web = new Web(DomainUrl + item.SiteUrl);
                const items = await web.lists.getById(item.List_x0020_Id).items.select(item.Query).getAll();
                console.log(items);
                const index = isItemExists(listData, 'Site', item.Site_x0020_Name);
                if (index === -1) {
                    listData.push({ pageName: 'BackupConfig', SiteUrl: item.SiteUrl, List_x0020_Id: item.List_x0020_Id, Site_x0020_Name: item.Site_x0020_Name, Title: item.List_x0020_Name, Query: item.Query, Items: items });
                    count++
                }

            } catch (error) {
                console.log(item.List_x0020_Name);
                console.error(error);
            }
        }));
        if (count === QueryBasedOnLookup.length)
            setListData(listData);
    }
    useEffect(() => {
        GetBackupConfig()
    }, [0])
    const callBackData = useCallback((elem: any, getSelectedRowModel: any, ShowingData: any) => {
    }, []);
    return (
        <div className='px-3 border'>
            <label className='form-label full-width fw-bold'>{labelSiteName}</label>                                 
            <div>
                {ListData.map((item: any) => {
                    return (<>
                        <div className='alignCenter pb-1'>
                            <span className='svg__iconbox svg__icon--tickRight mini me-1'></span>

                            {item.Title} ({item.Items.length})
                        </div></>)
                })}

            </div >

            {
                <div className='my-2 alignCenter'>
                    <span className='alignCenter'>
                        <input type="file" className='p-1' onChange={handleFileChange} />
                        <button className='btnCol btn btn-primary ms-3' onClick={() => uploadDocument()}>Upload Document</button>
                    </span>
                    <span className='ml-auto'>
                        <button type="button" className='btnCol btn btn-primary me-1' onClick={() => DataBackup('Daily')}>Daily Backup</button>
                        <button type="button" className='btnCol btn btn-primary ms-1' onClick={() => DataBackup('Monthly')}>Monthly Backup</button>
                    </span>
                    {successMessage && <p>File Uploaded Successfully</p>}
                </div >
            }
        </div>
    )
}