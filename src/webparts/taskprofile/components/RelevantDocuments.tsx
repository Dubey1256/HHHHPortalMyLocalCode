import * as React from 'react';
import Tooltip from '../../../globalComponents/Tooltip';
import { Web } from "sp-pnp-js";
import moment from 'moment';
import { useState, useEffect } from 'react';
const RelevantDocuments = (props: any) => {
    const [documentData, setDocumentData] = useState([]);
    const [FileName, setFileName] = useState(props.folderName);
    const [Fileurl, setFileurl] = useState("");
    console.log(props.folderName);

    useEffect(() => {
        loadAllSitesDocuments();
    }, [])
    const loadAllSitesDocuments = async () => {
        const web = new Web(props.siteUrl);
        var filter = (`${props.siteName}/Id eq ${props.ID}`);
        console.log(filter);
        await web.lists.getByTitle("Documents").items.select("Id,Title,Priority_x0020_Rank,Year,File_x0020_Type,FileLeafRef,FileDirRef,ItemRank,ItemType,Url,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title,EncodedAbsUrl")
            .expand("Author,Editor").filter(`${props.siteName}/Id eq ${props.ID}`).top(4999)
            .get()
            .then((Data: any[]) => {
              
                Data.map((item: any, index: any) => {
                    item.siteType = 'sp'
                    item.Author = item.Author.Title;
                    item.Editor = item.Editor.Title;
                    item.ModifiedDate = moment(item.ModifiedDate).format("'DD/MM/YYYY HH:mm'");
                    
                })
                console.log("document data", Data);
                setDocumentData(Data);
                setFileurl(Data[0].FileDirRef)
            })
            .catch((err) => {
                console.log(err.message);
            });

    }
    return (
        <div>
            {documentData.length>0 && <div className='mb-3 card commentsection'>
                <div className='card-header'>
                    <div className="card-title h5 d-flex justify-content-between align-items-center  mb-0">Relevant Documents<span><Tooltip /></span></div>
                </div>
                {documentData.map((item: any, index: any) => {
                    return (
                        <div className='card-body p-1'>
                            <ul  className='d-flex list-none'>
                                <li>
                                   <a className='px-2' href={item.FileDirRef} target="_blank" data-interception="off" > <img src="/_layouts/15/images/folder.gif" /></a>
                                </li>
                                <li>
                                  <a className='px-2' href={item.EncodedAbsUrl}>  <img src="/_layouts/15/images/icdocx.png" /></a>
                                </li>
                                <li>
                                   <a className='px-2' href={`${item.EncodedAbsUrl}?web=1`}target="_blank" data-interception="off"> <span>{item.Title}</span></a>
                                </li>

                            </ul>
                        </div>
                    )
                })}
               
            </div>
             }
            {documentData.length>0 &&<div className='mb-3 card commentsection'>
                <div className='card-header'>
                    <div className="card-title h5 d-flex justify-content-between align-items-center  mb-0">Main Folder<span><Tooltip /></span></div>
                </div>
                <div className='card-body p-1'>
                <ul className='list-none'>
                                <li>
                                   <a  href={Fileurl} target="_blank" data-interception="off" > <img src="/_layouts/15/images/folder.gif" /> <span className='ms-1'>{props.folderName}</span></a>
                                </li>
                                </ul>
                    </div>
                </div>
              }
        </div>
    )
}
export default RelevantDocuments;