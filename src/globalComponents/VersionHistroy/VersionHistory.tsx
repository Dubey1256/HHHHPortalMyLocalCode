import * as React from 'react'
import { Panel, PanelType } from 'office-ui-fabric-react';
import { sp } from 'sp-pnp-js';
import "bootstrap/dist/css/bootstrap.min.css";  
import Tooltip from '../Tooltip';
import * as moment from 'moment';
import InfoIconsToolTip from '../InfoIconsToolTip/InfoIconsToolTip';
import { SlArrowDown, SlArrowRight } from 'react-icons/sl';
var keys: any = [];
// var showComposition:boolean = true;
var taskUsers: any = [];
var AllTaskUser: any = [];
var currentUserBackupArray: any = [];
export default function VersionHistory(props: any) {
    const [propdata, setpropData] = React.useState(props);
    const [show, setShow] = React.useState(false);
    const [data, setData]: any = React.useState([]);  
    const [ShowEstimatedTimeDescription,setShowEstimatedTimeDescription] = React.useState(false);
    const [AllCommentModal,setAllCommentModal] = React.useState(false);
    const [AllComment,setAllComment] = React.useState([]);
    const [showComposition,setshowComposition] = React.useState(true)
    const [currentUserData, setCurrentUserData] = React.useState([]);
    const [IsUserFromHHHHTeam, setIsUserFromHHHHTeam] = React.useState(false);
    const Conetxt = props?.context;
    
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
        var siteTypeUrl = props.siteUrls;
        let listId = props.listId
        var itemId = props.taskId;
        let tempEstimatedArrayData: any;        
        sp.web.lists.getById(props?.listId).items.getById(props?.taskId).versions.get().then(versions => {
            console.log('Version History:', versions);
            versions.map((vitm:any)=>{
                vitm.CompletedDate != null ? vitm.CompletedDate = moment(vitm?.CompletedDate).format("DD/MM/YYYY"):'';
                vitm.StartDate != null ? vitm.StartDate = moment(vitm?.StartDate).format("DD/MM/YYYY"):'';
                vitm.DueDate != null ? vitm.DueDate = moment(vitm?.DueDate).format("DD/MM/YYYY"):'';
            })
            versionData = versions;

            const result = findDifferentColumnValues(versionData)

            const employeesWithoutLastName = result.map(employee => {                                                 
                employee.childs = []
                const  { VersionId,IsCurrentVersion,ClientTime,PreviouslyAssignedTo,Portfolio_x005f_x0020_x005f_Type,Project_x005f_x003a_x005f_ID, VersionLabel,UniqueId,ParentUniqueId,ScopeId,SMLastModifiedDate,GUID,FileRef,FileDirRef,OData__x005f_Moderation,WorkflowVersion, OData__x005f_IsCurrentVersion, OData__x005f_UIVersion, OData__x005f_UIVersionString, odata, ...rest } = employee;
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
                if(val?.OffshoreImageUrl!=undefined){
                    try{
                        val.OffshoreImageUrlArray = JSON.parse(val?.OffshoreImageUrl)
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
                    const  { VersionId,IsCurrentVersion,ClientTime,PreviouslyAssignedTo,Portfolio_x005f_x0020_x005f_Type,VersionLabel,Project_x005f_x003a_x005f_ID,UniqueId,ParentUniqueId,ScopeId,SMLastModifiedDate,GUID,FileRef,FileDirRef,OData__x005f_Moderation,WorkflowVersion, OData__x005f_IsCurrentVersion, OData__x005f_UIVersion, OData__x005f_UIVersionString, odata,Editor, ...rest } = ele;
                    return rest;
                })
            })

            setData(employeesWithoutLastName);

        }).catch(error => {
            console.error('Error fetching version history:', error);
        });
    }
    const loadTaskUsers = async () => {
        var AllTaskUsers: any = [];
        let currentUserId = Conetxt?.pageContext._legacyPageContext.userId;
        const web = sp.web;
        taskUsers = await web.lists
            .getById('b318ba84-e21d-4876-8851-88b94b9dc300')
            .items.select(
                "Id,UserGroupId,TimeCategory,CategoriesItemsJson,IsActive,Suffix,Title,Email,SortOrder,Role,IsShowTeamLeader,Company,ParentID1,Status,Item_x0020_Cover,AssingedToUserId,isDeleted,AssingedToUser/Title,AssingedToUser/Id,AssingedToUser/EMail,ItemType,Approver/Id,Approver/Title,Approver/Name"
            )
            .filter("IsActive eq 1")
            .expand("AssingedToUser,Approver")
            .orderBy("SortOrder", true)
            .orderBy("Title", true)
            .getAll();
        // getAllEmployeeData();
        taskUsers?.map((user: any, index: any) => {
            var ApproverUserItem = "";
            var UserApproverMail: any = [];
            if (user.Title != undefined && user.IsShowTeamLeader === true) {
                if (user.Approver != undefined) {
                    $.each(user.Approver.results, function (ApproverUser: any, index) {
                        ApproverUserItem +=
                            ApproverUser.Title +
                            (index === user.Approver.results?.length - 1 ? "" : ",");
                        UserApproverMail.push(ApproverUser.Name.split("|")[2]);
                    });
                    user["UserManagerName"] = ApproverUserItem;
                    user["UserManagerMail"] = UserApproverMail;
                }
                AllTaskUsers.push(user);
            }
            AllTaskUser = taskUsers;
            if (user.AssingedToUserId == currentUserId) {
                let temp: any = [];
                temp.push(user);
                setCurrentUserData(temp);
                currentUserBackupArray.push(user);
                if (user.UserGroupId == 7) {
                    setIsUserFromHHHHTeam(true);
                }
            }
        });
        // if (AllMetaData != undefined && AllMetaData?.length > 0) {
        //     GetSelectedTaskDetails();
        // }
      };
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
                        if(currentObj[key]?.length>0 && key != 'Project_x005f_x003a_x005f_ID'){
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
        GetItemsVersionHistory();
        loadTaskUsers();
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
    const showhideComposition = ()=>{
        if (showComposition) {          
            setshowComposition(false)        
        } else {         
            setshowComposition(true)
        }    
    }    
    const rendersiteComposition = (itm:any) =>{
        var SitestaggingArray:any = [];
        if(itm?.Sitestagging!=undefined){
            try{
                SitestaggingArray = JSON.parse(itm?.Sitestagging)
            }catch(e){

            }
        }  

        return(
            <>
                {(SitestaggingArray != undefined && SitestaggingArray != null) && <dl className="Sitecomposition w-50">                                                                                         
                    <div className='dropdown'>
                        <a className="sitebutton bg-fxdark d-flex">
                        <span className="arrowicons" onClick={() => showhideComposition()}>{showComposition ? <SlArrowDown /> : <SlArrowRight />}</span>
                        <div className="d-flex justify-content-between full-width">
                            <p className="pb-0 mb-0">Site Composition</p>                            
                        </div>
                        </a>
                        <div className="spxdropdown-menu" style={{ display: showComposition ? 'block' : 'none' }}>
                        <ul>                                   
                            {SitestaggingArray.map((site:any,indx:any)=>{
                            return <li className="Sitelist">
                                <span>
                                    <img style={{ width: "22px" }} title={site?.Title} src={site?.SiteImages} />
                                </span>
                                {site?.ClienTimeDescription != undefined &&
                                <span>
                                    {Number(site?.ClienTimeDescription).toFixed(2)}%
                                </span>
                                }
                                {site?.ClientCategory != undefined && site?.ClientCategory.length > 0 ? site?.ClientCategory?.map((clientcat: any) => {
                                return (
                                    <span>{clientcat.Title}</span>
                                )
                                }) : null}
                            </li>
                            })}
                        </ul>
                        </div>
                    </div>                                                                                         
                </dl>}           
            </>
        )
    }
    const showbackgroundcomment = (itm:any) =>{
        var OffshoreCommentsArray :any = [];
        if(itm?.OffshoreComments!=undefined){
            try{
                OffshoreCommentsArray = JSON.parse(itm?.OffshoreComments)
            }catch(e){

            }
        }  
        return(
            <>
               {IsUserFromHHHHTeam ? null : <>{OffshoreCommentsArray != undefined && OffshoreCommentsArray.length > 0 && OffshoreCommentsArray.map((item: any, index: any) => {
                    return <div>
                    <span className='round px-1'>
                        {item.AuthorImage != null &&
                        <img className='align-self-start' title={item?.AuthorName} src={item?.AuthorImage} />
                        }
                    </span>
                    <span className="pe-1">{item.AuthorName}</span>
                    <span className="pe-1" >{moment(item?.Created).format("DD/MM/YY")}</span>
                    <div style={{ paddingLeft: "30px" }} className=" mb-4 text-break"><span dangerouslySetInnerHTML={{ __html: item?.Body }}></span>
                    </div>
                    </div>
                })}</>}
            </>
        )
    }
    const showApproverHistory = (itm:any) =>{
        var ApproverHistoryData :any;
        if(itm?.ApproverHistory != undefined && itm?.ApproverHistory != null && itm?.ApproverHistory != '[]')
         ApproverHistoryData = JSON.parse(itm?.ApproverHistory)
        return(
            <>
                <div className="Approval-History-section w-50">
                    {ApproverHistoryData != undefined && ApproverHistoryData?.length > 1 ? (
                        <div className="border ps-1">
                            {ApproverHistoryData.map((HistoryData: any, index: any) => {
                                if (index < ApproverHistoryData.length - 1) {
                                    return (
                                        <div
                                            className={
                                                index + 1 == ApproverHistoryData?.length - 1
                                                    ? "alignCenter full-width"
                                                    : "alignCenter border-bottom full-width"
                                            }>
                                            <div className="alignCenter">
                                                Prev-Approver | <img title={HistoryData.ApproverName} className="workmember ms-1" src={HistoryData?.ApproverImage?.length > 0 ? HistoryData?.ApproverImage : ""}/>
                                            </div>
                                            <div>
                                                <span className='ps-1'>
                                                    {HistoryData.ApprovedDate}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                }
                            })}
                        </div>
                    ) : null}
                </div>
            </>
        )
    }
      
    const showSiteCompositionSettings = (itm:any)=>{       
        var compositionvalue:any = '';      
        if(itm?.SiteCompositionSettings != undefined)  {
            try{
                JSON.parse(itm?.SiteCompositionSettings).map((compoitem:any)=>{
                    if(compoitem.Deluxe)
                     compositionvalue = 'Deluxe';
                    else if(compoitem.Manual)
                     compositionvalue = 'Manual';
                    else if(compoitem.Proportional)
                     compositionvalue = 'Proportional';
                    else if(compoitem.Protected)
                     compositionvalue = 'Protected';
                    else if(compoitem.Standard)
                     compositionvalue = 'Standard';
                })   
            }catch(e){

            }
        } 
                               
        return(
            <>
               {compositionvalue != undefined && compositionvalue != '' && <div>{compositionvalue}</div>}
            </>
        )
    }

    const renderObject = (obj: any, visited: Set<object> = new Set()) => {
        if(obj != null && obj != undefined){
            //const entries = Object?.entries(obj);
            if(obj?.Url != undefined && obj?.Url != null){
                return <a href={obj?.Url} target='_blank' data-interception="off"> {obj?.Url} </a>
            }
            return  <div>{obj?.LookupValue}</div>
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
                                                                        key != 'Modified' && key != 'ModifiedDate' && key != 'BasicImageInfoArray' && key != 'OffshoreImageUrlArray' && key != 'No' && key != 'CommentsDescription' && key != 'Created'  && key != 'ModifiedBy' && key !== 'version' && key !== 'TaskTitle' && key !== 'TaskID' && key !== 'FeedBackDescription' && key !== 'ID' && key !=='EstimatedTimeDescriptionArray' &&  key !=='TotalEstimatedTime') &&
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
                                                                                            {item?.BasicImageInfoArray != undefined && item?.BasicImageInfoArray.map((image:any,indx:any)=>{
                                                                                                return(
                                                                                                    <>                                                                                                            
                                                                                                        <span className='BasicimagesInfo_group'>
                                                                                                            <a href={image.ImageUrl} target='_blank' data-interception="off"><img src={image.ImageUrl} alt="" /></a>
                                                                                                            {image.ImageUrl !== undefined ? <span className='BasicimagesInfo_group-imgIndex'>{indx+1}</span> : ''}
                                                                                                        </span>
                                                                                                    </>
                                                                                                )
                                                                                            })}
                                                                                            </div>: typeof(item[key]) === 'boolean' ? String(item[key]): key === 'EstimatedTimeDescription'
                                                                                        ?<dl className="Sitecomposition my-2 w-50">
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
                                                                                        </div>}</> : key === 'OffshoreImageUrl'? <div className='BasicimagesInfo_groupImages'>
                                                                                            {item?.OffshoreImageUrlArray != undefined && item?.OffshoreImageUrlArray.map((image:any,indx:any)=>{
                                                                                                return(
                                                                                                    <>                                                                                                            
                                                                                                        <span className='BasicimagesInfo_group'>
                                                                                                            <a href={image.Url} target='_blank' data-interception="off"><img src={image.Url} alt="" /></a>
                                                                                                            {image.Url !== undefined ? <span className='BasicimagesInfo_group-imgIndex'>{indx+1}</span> : ''}
                                                                                                        </span>
                                                                                                    </>
                                                                                                )
                                                                                            })}
                                                                                            </div> : key === 'Sitestagging'? rendersiteComposition(item) : key === 'OffshoreComments' ? showbackgroundcomment(item) : key === 'SiteCompositionSettings' ? showSiteCompositionSettings(item) : key === 'ApproverHistory' ? showApproverHistory(item): item[key]}	
                                                                                </span>

                                                                            </li>}
                                                                    </>)
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
