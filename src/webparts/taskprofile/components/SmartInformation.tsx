import * as React from 'react';
import Tooltip from '../../../globalComponents/Tooltip';
// import { Web } from "sp-pnp-js";
// import moment from 'moment';
// import { useState, useEffect } from 'react';
const SmartInformation = () => {
    // const [documentData, setDocumentData] = useState([]);
    // const [FileName, setFileName] = useState(props.folderName);
    // const [Fileurl, setFileurl] = useState("");
    // console.log(props.folderName);

    // useEffect(() => {
    //     loadAllSitesDocuments();
    // }, [])
    // const loadAllSitesDocuments = async () => {
    //     const web = new Web(props.siteUrl);
    //     var filter = (`${props.siteName}/Id eq ${props.ID}`);
    //     console.log(filter);
    //     await web.lists.getById("d0f88b8f-d96d-4e12-b612-2706ba40fb08").items.select("Id,Title,Priority_x0020_Rank,Year,File_x0020_Type,FileLeafRef,FileDirRef,ItemRank,ItemType,Url,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title,EncodedAbsUrl")
    //         .expand("Author,Editor").filter(`${props.siteName}/Id eq ${props.ID}`).top(4999)
    //         .get()
    //         .then((Data: any[]) => {
              
    //             Data.map((item: any, index: any) => {
    //                 item.siteType = 'sp'
    //                 item.Author = item.Author.Title;
    //                 item.Editor = item.Editor.Title;
    //                 item.ModifiedDate = moment(item.ModifiedDate).format("'DD/MM/YYYY HH:mm'");
                    
    //             })
    //             console.log("document data", Data);
    //             setDocumentData(Data);
    //             setFileurl(Data[0].FileDirRef)
    //         })
    //         .catch((err) => {
    //             console.log(err.message);
    //         });

    // }
    return (
        <div>
           <div className='mb-3 card commentsection'>
                <div className='card-header'>
                    <div className="card-title h5 d-flex justify-content-between align-items-center  mb-0">SmartInformation<span><Tooltip /></span></div>
                </div>
                <div className='card-body p-1'>
                           <a><span>+ Add SmartInformation</span></a> 
                        </div>
               
               
            </div>
           
        </div>
        
    )
}
export default SmartInformation;