import React from 'react'
import GlobalCommanTable, { IndeterminateCheckbox } from "../../globalComponents/GroupByReactTableComponents/GlobalCommanTable";
import { sp } from 'sp-pnp-js'
import { ColumnDef } from '@tanstack/react-table';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
let backupFiles: any = [];
let headerOptions: any = {
    openTab: false,
    teamsIcon: false,
    exportToExcel: false,
    exportPDF: false,
}
let siteName: any = '';
const ConnectExistingDoc = (props: any) => {
    React.useEffect(() => {
    }, [])


    const [ExistingFiles, setExistingFiles]: any = React.useState([]);
    const [DocsToTag, setDocsToTag]: any = React.useState([]);   
    async function fetchFilesFromFolder(): Promise<any[]> {
        try {
            let alreadyTaggedFiles: any = [];
            let selectQuery = 'Id,SharewebId,Title,Url,FileSystemObjectType,ItemRank,Author/Id,Author/Title,Editor/Id,Editor/Title,FileDirRef,FileLeafRef,File_x0020_Type,Year,EncodedAbsUrl,Created,Modified&$expand=Author,Editor'
            const params = new URLSearchParams(window.location.search);
            siteName = params.get("Site");
            if (siteName?.length > 0) {
                selectQuery = `Id,SharewebId,Title,Url,FileSystemObjectType,ItemRank,Author/Id,Author/Title,${siteName}/Id,${siteName}/Title,Editor/Id,Editor/Title,FileDirRef,FileLeafRef,File_x0020_Type,Year,EncodedAbsUrl,Created,Modified&$expand=Author,Editor,${siteName}`
            }
            // const files = await folder.files.get();
            const files = await sp.web.lists.getByTitle('Documents').items.select(selectQuery).getAll();
            let newFilesArr: any = [];
            files?.map((file: any) => {
                if (file?.Title != undefined && file?.File_x0020_Type != undefined) {
                    file.docType = file?.File_x0020_Type;
                    newFilesArr.push(file)
                }
                if (file[siteName] != undefined && file[siteName].length > 0 && file[siteName].some((task: any) => task.Id == props?.item?.Id)) {
                    alreadyTaggedFiles.push(file);
                }
            })
            backupFiles = newFilesArr;
            setExistingFiles(newFilesArr)
            setDocsToTag(alreadyTaggedFiles);

            return files
        } catch (error) {
            console.log('An error occurred while fetching files:', error);
            return [];
        }
    }
    const searchCurrentFolder = (value: any) => {
        if (value?.length > 0) {
            setExistingFiles((prevFile: any) => {
                return backupFiles.filter((file: any) => {
                    return file?.Title?.toLowerCase()?.includes(value?.toLowerCase());
                });
            });
        } else {
            setExistingFiles(backupFiles);
        }
    }
    const tagSelectedDoc = (file: any) => {
        let resultArray: any = [];
        if (file[siteName] != undefined && file[siteName].length > 0) {
            file[siteName].map((task: any) => {
                if (task?.Id != undefined) {
                    resultArray.push(task.Id)
                }
            })
        }
        if (!DocsToTag?.some((doc: any) => file.Id == doc.Id) && !resultArray.some((taskID: any) => taskID == props?.item?.Id)) {
            resultArray.push(props?.item?.Id)
            let siteColName = `${siteName}Id`
            // Update the document file here
            sp.web.lists.getByTitle('Documents').items.getById(file.Id)
                .update({ [siteColName]: { "results": resultArray } }).then((updatedFile: any) => {
                    file[siteName].push({ Id: props?.item?.Id, Title: props?.item?.Title });
                    setDocsToTag([...DocsToTag, ...[file]])
                    alert(`The file '${file?.Title}' has been successfully tagged to the task '${props?.item?.TaskId}'.`);
                })


        } else if (DocsToTag?.some((doc: any) => file.Id == doc.Id) && resultArray.some((taskID: any) => taskID == props?.item?.Id)) {
            resultArray = resultArray.filter((taskID: any) => taskID != props?.item?.Id)
            let siteColName = `${siteName}Id`
            // Update the document file here
            sp.web.lists.getByTitle('Documents').items.getById(file.Id)
                .update({ [siteColName]: { "results": resultArray } }).then((updatedFile: any) => {
                    file[siteName] = file[siteName].filter((task: any) => task.Id != props?.item?.Id);
                    setDocsToTag((prevFile: any) => {
                        return prevFile.filter((item: any) => {
                            return item.Id != file.Id
                        });
                    });
                    alert(`The file '${file?.Title}' has been successfully untagged from the task '${props?.item?.TaskId}'.`);
                })


        }

    }
    return (
        <div className="panel panel-default">
            <div className="panel-heading">
                <h3 className="panel-title">
                    2. Connect Existing Documents
                </h3>
            </div>
            <div className="panel-body h309">
                <input id="searchinputCED" type="search" onChange={(e) => { searchCurrentFolder(e.target.value) }} placeholder="Search..." className="form-control " />
                <div className="Alltable mt-10 mx-height">
                    <div className="container-new b-none h212">
                        {/* <GlobalCommanTable headerOptions={headerOptions} paginatedTable={true} columns={columns} data={ExistingFiles} callBackData={callBackData} showHeader={true} /> */}
                        {ExistingFiles?.length > 0 ?
                            <div className='smart SearchTableCategoryComponent'>
                                <table className='table '>
                                    <tr>
                                        <th>&nbsp;</th>
                                        <th>Type</th>
                                        <th>Title</th>
                                        <th>Item Rank</th>
                                    </tr>
                                    {ExistingFiles?.map((file: any) => {
                                        return (
                                            <tr>
                                                <td><input type="checkbox" checked={DocsToTag?.some((doc: any) => file.Id == doc.Id)} onClick={() => { tagSelectedDoc(file) }} /></td>
                                                <td><span className={`svg__iconbox svg__icon--${file?.docType}`} title={file?.File_x0020_Type}></span></td>
                                                <td><a href={file?.EncodedAbsUrl} target="_blank" data-interception="off" className='hreflink'>{file?.Title}</a></td>
                                                <td>{file?.ItemRank}</td>
                                            </tr>
                                        )
                                    })}
                                </table>
                            </div>
                            :
                            <div className="current_commnet ">
                                No Documents Available
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ConnectExistingDoc
