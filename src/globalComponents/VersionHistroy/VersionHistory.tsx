import * as React from 'react'
import { Panel, PanelType } from 'office-ui-fabric-react';
import { Web, sp } from 'sp-pnp-js';
import "bootstrap/dist/css/bootstrap.min.css";  
import Tooltip from '../Tooltip';
import * as moment from 'moment';
import InfoIconsToolTip from '../InfoIconsToolTip/InfoIconsToolTip';
import { SlArrowDown, SlArrowRight } from 'react-icons/sl';
var keys: any = []
export default function VersionHistory(props: any) {
    const [propdata, setpropData] = React.useState(props);
    const [show, setShow] = React.useState(false);
    const [data, setData]: any = React.useState([]);  
    const [ShowEstimatedTimeDescription,setShowEstimatedTimeDescription] = React.useState(false);
    const [AllCommentModal,setAllCommentModal] = React.useState(false);
    const [AllComment,setAllComment] = React.useState([]);
   
    const handleClose = () => setShow(false);
    const handleShow = () => {       
        setShow(true)
        setTimeout(() => {
            $('.ms-Panel-scrollableContent').addClass('versionScrollableContent')
        }, 100);
    };
    //------------------------jquery call--------------------------------
    const GetItemsVersionHistory = async () => {
        var versionData: any = []
        let webs = new Web(props.siteUrls);
        var siteTypeUrl = props.siteUrls;
        let listId = props.listId
        var itemId = props.taskId;
        let tempEstimatedArrayData: any;        
        webs.lists.getById(props?.listId).items.getById(props?.taskId).versions.get().then(versions => {
            console.log('Version History:', versions);
            versionData = versions;

            const result = findDifferentColumnValues(versionData)

            const employeesWithoutLastName = result.map(employee => {                                                 
                employee.childs = []
                const  { VersionId,IsCurrentVersion, VersionLabel,UniqueId,ParentUniqueId,ScopeId,SMLastModifiedDate,GUID,FileRef,FileDirRef,OData__x005f_Moderation,WorkflowVersion, OData__x005f_IsCurrentVersion, OData__x005f_UIVersion, OData__x005f_UIVersionString, odata, ...rest } = employee;
                return rest;
            });
            console.log(employeesWithoutLastName)
            employeesWithoutLastName?.forEach((val: any) => { 
                if(val.FeedBack !== undefined && val.FeedBack !== null &&  val.FeedBack !== '[]'){
                    val.FeedBackDescription = JSON.parse(val?.FeedBack)[0].FeedBackDescriptions    
                    if(val.FeedBackDescription !== undefined){
                        val?.FeedBackDescription?.map((feedback:any)=>{
                            if(feedback.Title != '')
                             feedback.Title = $.parseHTML(feedback?.Title)[0].textContent;
                        }) 
                    }                  
                }          
                if(val?.BasicImageInfo!=undefined){
                    try{
                        val.BasicImageInfoArray = JSON.parse(val?.BasicImageInfo)
                    }catch(e){

                    }
                }                         
                if(val.EstimatedTimeDescription !== undefined && val.EstimatedTimeDescription !== null && val.EstimatedTimeDescription !== '[]'){
                    tempEstimatedArrayData = JSON.parse(val?.EstimatedTimeDescription) ;
                    let TotalEstimatedTimecopy:any = 0;                                             
                    if (tempEstimatedArrayData?.length > 0) {
                        tempEstimatedArrayData?.map((TimeDetails: any) => {
                            TotalEstimatedTimecopy = TotalEstimatedTimecopy + Number(TimeDetails.EstimatedTime);
                        })
                    }
                    val.EstimatedTimeDescriptionArray=tempEstimatedArrayData
                    val.TotalEstimatedTime=TotalEstimatedTimecopy            
                }  
                if(val.Comments !== undefined && val.Comments !== null && val.Comments !== '[]'){
                    val.CommentsDescription = JSON.parse(val?.Comments)         
                }  

                val.No = val.owshiddenversion;
                val.ModifiedDate = moment(val?.Modified).format("DD/MM/YYYY h:mmA");
                val.ModifiedBy = val?.Editor?.LookupValue;                
                val.childs.push(val)
            })

            employeesWithoutLastName?.forEach((val:any)=>{                
                val.childs?.forEach((ele:any)=>{
                    const  { VersionId,IsCurrentVersion,VersionLabel,UniqueId,ParentUniqueId,ScopeId,SMLastModifiedDate,GUID,FileRef,FileDirRef,OData__x005f_Moderation,WorkflowVersion, OData__x005f_IsCurrentVersion, OData__x005f_UIVersion, OData__x005f_UIVersionString, odata,Editor, ...rest } = ele;
                    return rest;
                })
            })

            setData(employeesWithoutLastName);

        }).catch(error => {
            console.error('Error fetching version history:', error);
        });

    }
    const openCommentPopup =(comntitem:any)=>{
        setAllComment(comntitem)
        setAllCommentModal(true);
    }
    const closeAllCommentModal = ()=>{
        setAllCommentModal(false);
    }
    const showhideEstimatedTime=()=> {
        if (ShowEstimatedTimeDescription) {          
            setShowEstimatedTimeDescription(false)         
        } else {
            setShowEstimatedTimeDescription(true) 
        }
    }
    const findDifferentColumnValues = (data: any) => {
        const differingValues = [];        

        for (let i = 0; i < data.length; i++) {
            if(i !== data.length-1){
                const currentObj = data[i];            
                const nextObj = data[i + 1];
                const differingPairs: any = {};
                differingPairs['TaskID']= currentObj.ID;
                differingPairs['TaskTitle']= currentObj.Title;
                for (const key in currentObj) {
                    differingPairs['version'] = currentObj.VersionId;
                    differingPairs['ID']= currentObj.ID;                              
                    if (currentObj.hasOwnProperty(key)&&(!nextObj.hasOwnProperty(key) || !isEqual(currentObj[key], nextObj[key]))) {
                        differingPairs[key] = currentObj[key];
                        differingPairs['Editor'] = currentObj.Editor;
                    }
                }
    
                // Check for properties in n+1 but not in n           
                    for (const key in nextObj) {
                        if (nextObj.hasOwnProperty(key) && !currentObj.hasOwnProperty(key)) {
                            differingPairs[key] = currentObj[key];
                            differingPairs['Editor'] = currentObj.Editor;
                        }
                    }                     
    
                if (Object.keys(differingPairs).length > 0) {
                    differingValues.push(differingPairs);
                }
            }
            else{
                const currentObj = data[i];
                const prevObj = data[i-1];                
                const differingPairs: any = {};
                differingPairs['TaskID']= currentObj.ID;
                differingPairs['TaskTitle']= currentObj.Title;
                for (const key in currentObj) {
                    differingPairs['version'] = currentObj.VersionId;
                    differingPairs['ID']= currentObj.ID;
                    differingPairs['owshiddenversion']= currentObj.owshiddenversion; 
                    if(currentObj.PercentComplete != undefined && currentObj.PercentComplete != null && currentObj.PercentComplete !== 'NaN')
                     differingPairs['PercentComplete']= currentObj.PercentComplete;                                              
                    if ((currentObj[key] !== undefined && currentObj[key] !== null && currentObj[key] !== '' && currentObj.hasOwnProperty(key)) && (key !== 'Checkmark' && key !== 'odata.type'  && key !== 'ItemChildCount' && key !== 'SMTotalFileStreamSize'  && key !== 'ContentVersion' && key !== 'FolderChildCount'  && key !== 'NoExecute'  && key !== 'FSObjType'  && key !== 'FileLeafRef' && key !== 'Order' && key !== 'Created_x005f_x0020_x005f_Date' && key !== 'Last_x005f_x0020_x005f_Modified')) {
                        if(currentObj[key]?.length>0){
                            differingPairs[key] = currentObj[key];
                            differingPairs['Editor'] = currentObj.Editor;
                        }                        
                    }
                }              
                if (Object.keys(differingPairs).length > 0) {
                    differingValues.push(differingPairs);
                }
            }
         
        }

        return differingValues;
    }    
    // Function to compare arrays and objects recursively based on their IDs
    function isEqual(obj1: any, obj2: any) {
        if (obj1 === obj2) return true;

        if (obj1 instanceof Date && obj2 instanceof Date) {
            return obj1.getTime() === obj2.getTime();
        }

        if (Array.isArray(obj1) && Array.isArray(obj2)) {
            if (obj1.length !== obj2.length) return false;

            for (let i = 0; i < obj1.length; i++) {
                if (!isEqual(obj1[i], obj2[i])) {
                    return false;
                }
            }
            return true;
        }

        if (typeof obj1 !== typeof obj2 || typeof obj1 !== 'object' || !obj1 || !obj2) {
            return false;
        }

        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);

        if (keys1.length !== keys2.length) return false;

        for (const key of keys1) {
            if (!obj2.hasOwnProperty(key)
                || !isEqual(obj1[key], obj2[key])) {
                return false;
            }
        }

        return true;
    }
    //---------------------------------------------------------------------
    React.useEffect(() => {
        GetItemsVersionHistory()
    }, [show]);

    const onRenderCustomHeader = () => {
      return (
        <>
          <div className='subheading mb-0'>
            Version History
          </div>
          <Tooltip />
        </>
      );
    };
    const onRenderCustomCommentHeader = () => {
        return (
          <>
            <div className='subheading mb-0'>
              All Comments
            </div>
            <Tooltip />
          </>
        );
      };
    const renderArray = (arr: any[]) => {
        return arr.map((item, index) => (
          <div key={index}>{typeof item === 'object' ? item?.LookupValue : item}</div>
        ));
    };   
      
      // Helper function to render objects
    //   const renderObject = (obj: object) => {
    //     return Object.entries(obj).map(([key, value]:any, index:any) => (
    //       <div key={index}>
    //         <strong>{key}:</strong>{' '}
    //         {typeof value === 'object' ? renderObject(value) : value}
    //       </div>
    //     ));
    //   };

    const renderObject = (obj: any, visited: Set<object> = new Set()) => {
        if(obj != null && obj != undefined){
            //const entries = Object?.entries(obj);

            return  <div>{obj.LookupValue}</div>
            // entries.map(([key, value]: [string, any], index: number) => {
            //     const isCircular = visited.has(value);
            
            //     visited.add(value?.LookupValue);
            
            //     return (
            //       <div key={index}>
            //         <strong>{key}:</strong>{' '}
            //         {isCircular ? '(Circular Reference)' : typeof value === 'object' ? renderObject(value, visited) : value}
            //       </div>
            //     );
            //   });
        }
    
      
      };
    return (
        <>
            <span className='siteColor mx-1' onClick={handleShow}>
                Version History
            </span>
            <Panel
                onRenderHeader={onRenderCustomHeader}
                isOpen={show}
                onDismiss={handleClose}
                isBlocking={false}
                type={PanelType.large}>
                
                <table className="table VersionHistoryTable mt-2">
                        <thead>
                            <tr>
                                <th style={{width:"80px"}} scope="col">No</th>
                                <th style={{width:"170px"}} scope="col">Modified</th>
                                <th  scope="col">Info</th>
                                <th style={{width:"170px"}} scope="col">Modified by</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.map((itm: any) => {
                                return (
                                    <>
                                        <tr>
                                            <td>
                                                {itm?.No}
                                            </td>
                                            <td>
                                            <span className="siteColor"><a href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/Lists/HHHH/DispForm.aspx?ID=${itm.ID}&VersionNo=${itm.version}`}>{itm?.ModifiedDate}</a></span>
                                            </td>
                                            <td>                                                                      
                                                <div className='Info-VH-Col'>
                                                    {itm?.childs.map((item: any, index: any) => {
                                                        { keys = Object.keys(itm?.childs[0]) }
                                                        return (

                                                            <ul className='p-0 mb-0'>
                                                                {keys.map((key: any, index: any) => {
                                                                    return (
                                                                        <>
                                                                        {(key != 'odata.editLink' && key != 'odata.id' && key != 'owshiddenversion' && key != 'Editor' && key != 'childs' && 
                                                                        key != 'Modified' && key != 'ModifiedDate' && key != 'No' && key != 'CommentsDescription' && key != 'Created'  && key != 'ModifiedBy' && key !== 'version' && key !== 'TaskTitle' && key !== 'TaskID' && key !== 'FeedBackDescription' && key !== 'ID' && key !=='EstimatedTimeDescriptionArray' &&  key !=='TotalEstimatedTime') &&
                                                                                <li key={index}>
                                                                                    <span className='vh-textLabel'>{key}</span>
                                                                                    <span className='vh-textData'>{Array.isArray(item[key])
                                                                                        ? renderArray(item[key])
                                                                                        : typeof item[key] === 'object'
                                                                                            ? renderObject(item[key])
                                                                                            : key === 'FeedBack' 
                                                                                            ? <div className='feedbackItm-text'>
                                                                                                {(item?.FeedBackDescription != undefined && item?.FeedBackDescription != '' && item?.FeedBackDescription?.length > 0) ? <span className='d-flex'><p className='text-ellips mb-0'>{`${item?.FeedBackDescription[0]?.Title}`}</p> <InfoIconsToolTip Discription='' row={item} versionHistory={true} /></span> :''}                                                                                          
                                                                                            </div> : key === 'PercentComplete' ? (item?.PercentComplete)*100 : key === 'BasicImageInfo' 
                                                                                            ? <div className='BasicimagesInfo_groupImages'>
                                                                                                {item?.BasicImageInfoArray != undefined && item?.BasicImageInfoArray?.map((image:any,indx:any)=>{
                                                                                                    return(
                                                                                                        <>                                                                                                            
                                                                                                            <span className='BasicimagesInfo_group'>
                                                                                                                <a target='_blank' href={image.ImageUrl}><img src={image.ImageUrl} alt="" /></a>
                                                                                                                {image.ImageUrl !== undefined ? <span className='BasicimagesInfo_group-imgIndex'>{indx+1}</span> : ''}
                                                                                                            </span>
                                                                                                        </>
                                                                                                    )
                                                                                                })}
                                                                                              </div>: typeof(item[key]) === 'boolean' ? String(item[key]): key === 'EstimatedTimeDescription'
                                                                                            ?<dl className="Sitecomposition my-2">
                                                                                                  <div className='dropdown' key={index} >
                                                                                                    <a className="sitebutton bg-fxdark d-flex">
                                                                                                      <span className="arrowicons"  onClick={() => showhideEstimatedTime()}>{ShowEstimatedTimeDescription ? <SlArrowDown /> : <SlArrowRight />}</span>
                                                                                                      <div className="d-flex justify-content-between full-width">
                                                                                                        <p className="pb-0 mb-0 ">Estimated Task Time Details</p>
                                                                                                      </div>
                                                                                                    </a>
                                                                                                    <div className="spxdropdown-menu" style={{ display: ShowEstimatedTimeDescription ? 'block' : 'none' }}>
                                                                                                      <div className="col-12" style={{ fontSize: "14px" }}>
                                                                                                        {item?.EstimatedTimeDescriptionArray != null && item?.EstimatedTimeDescriptionArray?.length > 0 ?
                                                                                                          <div>
                                                                                                            {item?.EstimatedTimeDescriptionArray?.map((EstimatedTimeData: any, Index: any) => {
                                                                                                              return (
                                                                                                                <div className={item?.EstimatedTimeDescriptionArray?.length == Index + 1 ? "align-content-center alignCenter justify-content-between p-1 px-2" : "align-content-center justify-content-between border-bottom alignCenter p-1 px-2"}>
                                                                                                                  <div className='alignCenter'>
                                                                                                                    <span className='me-2'>{EstimatedTimeData?.Team != undefined ? EstimatedTimeData?.Team : EstimatedTimeData?.Category != undefined ? EstimatedTimeData?.Category : null}</span> |
                                                                                                                    <span className='mx-2'>{EstimatedTimeData?.EstimatedTime ? (EstimatedTimeData?.EstimatedTime > 1 ? EstimatedTimeData?.EstimatedTime + " hours" : EstimatedTimeData?.EstimatedTime + " hour") : "0 hour"}</span>
                                                                                                                    <img className="ProirityAssignedUserPhoto m-0 mx-2" title={EstimatedTimeData?.UserName} src={EstimatedTimeData?.UserImage != undefined && EstimatedTimeData?.UserImage?.length > 0 ? EstimatedTimeData?.UserImage : ''} />
                                                                                                                  </div>
                                                                                                                  {EstimatedTimeData?.EstimatedTimeDescription?.length > 0 && <div className='alignCenter hover-text'>
                                                                                                                    <span className="svg__iconbox svg__icon--info"></span>
                                                                                                                    <span className='tooltip-text pop-right'>{EstimatedTimeData?.EstimatedTimeDescription} </span>
                                                                                                                  </div>}
                                                                                                                </div>
                                                                                                              )
                                                                                                            })}
                                                                                                          </div>
                                                                                                          : null
                                                                                                        }
                                                                                                      </div>
                                                                                                    </div>
                                                                                                    <div className="boldClable border border-top-0 ps-2 py-1">
                                                                                                      <span>Total Estimated Time : </span><span className="mx-1">{item?.TotalEstimatedTime > 1 ? item?.TotalEstimatedTime + " hours" : item?.TotalEstimatedTime + " hour"} </span>
                                                                                                    </div>
                                                                                                  </div>
                                                                                                </dl>                                                                                              
                                                                                            : key === 'Comments'
                                                                                            ?<>{item?.CommentsDescription != undefined && <div className='feedbackItm-text'>
                                                                                            
                                                                                                <div>
                                                                                                    <span className='comment-date'>
                                                                                                        <span className='round  pe-1'> <img className='align-self-start me-1' title={item?.CommentsDescription[0]?.AuthorName}
                                                                                                        src={item?.CommentsDescription[0]?.AuthorImage != undefined && item?.CommentsDescription[0]?.AuthorImage != '' ?
                                                                                                         item?.CommentsDescription[0].AuthorImage :
                                                                                                            "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg"}
                                                                                                        />
                                                                                                        {item?.CommentsDescription[0]?.Created}

                                                                                                        </span>
                                                                                                    </span>                                
                                                                                                </div>

                                                                                                <div className="media-text">
                                                                                                    <label className='userid m-0'>  {item?.CommentsDescription[0]?.Header != '' && <b>{item?.CommentsDescription[0]?.Header}</b>}</label>
                                                                                                    <span className='d-flex' id="pageContent">
                                                                                                        <span className='text-ellips' dangerouslySetInnerHTML={{ __html: item?.CommentsDescription[0]?.Description }}></span>
                                                                                                        <span className='text-end w-25'><a className="hreflink" onClick={()=>openCommentPopup(item?.CommentsDescription)}>See More</a></span>
                                                                                                    </span>
                                                                                                   
                                                                                                </div>                                                                                                                                                                                                                                                                          
                                                                                            </div>}</> : item[key]}
                                                                                    </span>

                                                                                </li>}
                                                                     </> )
                                                                    })}
                                                            </ul>
                                                        )
                                                    })}
                                                </div>

                                            </td>
                                            <td>
                                            <span className="siteColor">{itm?.ModifiedBy}</span>
                                            </td>
                                        </tr>
                                    </>
                                )
                            })}

                        </tbody>
                </table >

            </Panel>
            <Panel

                onRenderHeader={onRenderCustomCommentHeader}
                type={PanelType.custom}
                customWidth="500px"
                onDismiss={closeAllCommentModal}
                isOpen={AllCommentModal}
                isBlocking={false}>

                <div id='ShowAllCommentsId'>

                    <div className='modal-body mt-2'>
                    <div className="col-sm-12 " id="ShowAllComments">
                        <div className="col-sm-12">                        
                        {AllComment.map((cmtData: any, i: any) => {
                            return <div className="p-1 mb-2">
                            <div>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <span className='comment-date'>
                                        <span className='round  pe-1'> <img className='align-self-start me-1' title={cmtData?.AuthorName}
                                        src={cmtData?.AuthorImage != undefined && cmtData?.AuthorImage != '' ?
                                            cmtData.AuthorImage :
                                            "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg"}
                                        />
                                        {cmtData?.Created}

                                        </span>
                                    </span>                                
                                </div>

                                <div className="media-text">
                                    <h6 className='userid m-0 fs-6'>   {cmtData?.Header != '' && <b>{cmtData?.Header}</b>}</h6>
                                    <p className='m-0' id="pageContent"> <span dangerouslySetInnerHTML={{ __html: cmtData?.Description }}></span></p>
                                </div>
                            </div>
                            </div>
                        })}

                        </div>

                    </div>
                    </div>
                    <footer className='text-end'>
                    <button type="button" className="btn btn-default" onClick={closeAllCommentModal}>Cancel</button>
                    </footer>

                </div>

            </Panel>

        </>
    );
}
