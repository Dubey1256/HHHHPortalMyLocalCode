import React from 'react'
import { sp } from 'sp-pnp-js'
let backupFiles: any = [];
const DefaultFolderContent = (props: any) => {
    React.useEffect(() => {
        fetchFilesByPath(props?.folderPath);
    }, [])

    const [currentFolderFiles, setCurrentFolderFiles]: any = React.useState([]);
    const fetchFilesByPath = async (folderPath: any) => {
        fetchFilesFromFolder(folderPath)
            .then((files) => {
                files?.map((file: any) => {
                    file.docType = getFileType(file?.Name)
                })
                backupFiles = files;
                setCurrentFolderFiles(files)
            })
            .catch((error) => {
                console.log('An error occurred:', error);
            });

    }

    function getFileType(fileName: any) {
        const regex = /(?:\.([^.]+))?$/;
        const match = regex.exec(fileName);
        if (match === null) {
            return null;
        }
        return match[1];
    }
    async function fetchFilesFromFolder(folderPath: string): Promise<any[]> {
        try {
            const folder = sp.web.getFolderByServerRelativeUrl(folderPath);
            const files = await folder.files.get();

            return files;
        } catch (error) {
            console.log('An error occurred while fetching files:', error);
            return [];
        }
    }
    const searchCurrentFolder = (value: any) => {
        if (value?.length > 0) {
            setCurrentFolderFiles((prevFile: any) => {
                return backupFiles.filter((file: any) => {
                    return file?.Title?.toLowerCase()?.includes(value?.toLowerCase());
                });
            });
        } else {
            setCurrentFolderFiles(backupFiles);
        }

    }

    return (
        <div className="">
            <details>
                <summary>1. Default Folder Content </summary>
                <div className='AccordionContent mx-height'>
                    <div className="col-sm-12 panel-body">
                        <input id="searchinput" type="search" onChange={(e) => { searchCurrentFolder(e.target.value) }} placeholder="Search..." className="form-control" />
                        <span className="searchclear-project ng-hide" style={{ right: '12px', top: '10px' }}>X</span>
                        <div className="Alltable mt-10">
                            <div className="col-sm-12 pad0 ">
                                {currentFolderFiles?.length > 0 ?
                                    <div className='smart'>
                                        <table className='table'>
                                            <tr>
                                                <th>DocType</th>
                                                <th>Title</th>
                                            </tr>
                                            {currentFolderFiles?.map((file: any) => {
                                                return (
                                                    <tr>
                                                        <td><span className={`svg__iconbox svg__icon--${file?.docType}`} title={file?.docType}></span></td>
                                                        <td><a href={file?.docType == 'pdf' ? file?.ServerRelativeUrl : file?.LinkingUri} target="_blank" data-interception="off" className='hreflink'>{file?.Title}</a></td>
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
            </details>
        </div>
    )
}
export default DefaultFolderContent