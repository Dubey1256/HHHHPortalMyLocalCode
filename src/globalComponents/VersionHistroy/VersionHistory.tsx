import * as React from 'react'
import { Panel, PanelType } from 'office-ui-fabric-react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Web } from "sp-pnp-js";
import Tooltip from '../Tooltip';
import * as moment from 'moment';
import { isEmpty } from 'lodash';
import InfoIconsToolTip from '../InfoIconsToolTip/InfoIconsToolTip';
import { SlArrowDown, SlArrowRight } from 'react-icons/sl';
import * as globalCommon from "../globalCommon";

var keys: any = [];
// var showComposition:boolean = true;
var taskUsers: any = [];
var AllTaskUser: any = [];
var currentUserBackupArray: any = [];
var AllClientCategoriesData: any = [];

export default function VersionHistory(props: any) {
    const siteTypeUrl = props.siteUrls;
    const listId = props?.listId
    const ItemId = props?.taskId;
    var sitetype = window?.location?.search !== '' ? window?.location?.search?.split("&Site=")[1] || "Master Tasks" : 'Task Users';
    try {
        if (window?.location?.search?.split("&Site=")[1]?.indexOf("&OR") > -1) {
            sitetype = window?.location?.search?.split("&Site=")[1]?.split("&OR")[0];
        } 
    }
    catch (e) {
        console.log(e);
    }
    const RequiredListIds: any = props?.RequiredListIds;
    let tempEstimatedArrayData: any;
    const [show, setShow] = React.useState(false);
    const [data, setData]: any = React.useState([]);
    const [SCVersionHistoryData, setSCVersionHistoryData]: any = React.useState([]);
    const [ShowEstimatedTimeDescription, setShowEstimatedTimeDescription] = React.useState(false);
    const [AllCommentModal, setAllCommentModal] = React.useState(false);
    const [AllComment, setAllComment] = React.useState([]);
    const [showComposition, setshowComposition] = React.useState(true)
    const [currentUserData, setCurrentUserData] = React.useState([]);
    const [IsUserFromHHHHTeam, setIsUserFromHHHHTeam] = React.useState(false);
    const usedFor: any = props?.usedFor;
    const Context = props?.context;
    

    const handleClose = () => setShow(false);
    const handleShow = () => {
        setShow(true)
        setTimeout(() => {
            $('.ms-Panel-scrollableContent').addClass('versionScrollableContent')
        }, 100);
    };
    React.useEffect(() => {
        GetItemsVersionHistory();
        loadTaskUsers();
        LoadAllClientCategories();
    }, [show]);

    //------------------------this use used for getting Version History for Selected Item from backend--------------------------------
    const GetItemsVersionHistory = async () => {
        var versionData: any = []
        try {
            let web = new Web(siteTypeUrl);
            web.lists.getById(listId).items.getById(ItemId).versions.get().then(versions => {
                console.log('Version History:', versions);
                versions.map((ItemVersion: any) => {
                    ItemVersion.CompletedDate != null ? ItemVersion.CompletedDate = moment(ItemVersion?.CompletedDate).format("DD/MM/YYYY") : '';
                    ItemVersion.StartDate != null ? ItemVersion.StartDate = moment(ItemVersion?.StartDate).format("DD/MM/YYYY") : '';
                    ItemVersion.DueDate != null ? ItemVersion.DueDate = moment(ItemVersion?.DueDate).format("DD/MM/YYYY") : '';
                })
                versionData = versions;

                const result = findDifferentColumnValues(versionData)

                const employeesWithoutLastName = result.map(employee => {
                    employee.childs = []
                    const { VersionId, IsCurrentVersion, MetaInfo, Parent_x005f_x003a_x005f_ID, ClientTime,FeatureType_x005f_x003a_x005f_Title, SmartInformation_x005f_x003a_x005f_ID,PreviouslyAssignedTo,Portfolio_x005f_x003a_x005f_ID, Project_x005f_x003a_x005f_ID, VersionLabel, UniqueId, ParentUniqueId, ScopeId, SMLastModifiedDate, GUID, FileRef, FileDirRef, OData__x005f_Moderation, WorkflowVersion, OData__x005f_IsCurrentVersion, OData__x005f_UIVersion, OData__x005f_UIVersionString, odata, ...rest } = employee;
                    return rest;
                });
                console.log(employeesWithoutLastName)
                // setSCVersionHistoryData
                let TempSCDataItems: any = [];
                employeesWithoutLastName?.forEach((val: any) => {
                    if (val?.Sitestagging?.length > 5) {
                        TempSCDataItems.push(val);
                    }
                    try{
                        if (val.FeedBack !== undefined && val.FeedBack !== null && val.FeedBack !== '[]') {
                            val.FeedBackDescription = JSON.parse(val?.FeedBack)[0].FeedBackDescriptions
                            if (val.FeedBackDescription !== undefined) {
                                val?.FeedBackDescription?.map((feedback: any) => {
                                    if (feedback.Title != '')
                                        feedback.Title = $.parseHTML(feedback?.Title)[0].textContent;
                                })
                            }
                        }
                    }
                    catch(e){
                        console.log(e);
                    }                   
                    if (val?.BasicImageInfo != undefined) {
                        try {
                            val.BasicImageInfoArray = JSON.parse(val?.BasicImageInfo)
                        } catch (e) {

                        }
                    }
                    if (val?.OffshoreImageUrl != undefined) {
                        try {
                            val.OffshoreImageUrlArray = JSON.parse(val?.OffshoreImageUrl)
                        } catch (e) {

                        }
                    }
                    if (val.EstimatedTimeDescription !== undefined && val.EstimatedTimeDescription !== null && val.EstimatedTimeDescription !== '[]') {
                        try{
                            tempEstimatedArrayData = JSON.parse(val?.EstimatedTimeDescription);
                            let TotalEstimatedTimecopy: any = 0;
                            if (tempEstimatedArrayData?.length > 0) {
                                tempEstimatedArrayData?.map((TimeDetails: any) => {
                                    TotalEstimatedTimecopy = TotalEstimatedTimecopy + Number(TimeDetails.EstimatedTime);
                                })
                            }
                            val.EstimatedTimeDescriptionArray = tempEstimatedArrayData
                            val.TotalEstimatedTime = TotalEstimatedTimecopy
                        }
                        catch(e){

                        }                        
                    }
                    if (val.Comments !== undefined && val.Comments !== null && val.Comments !== '[]') {
                        try{
                            val.CommentsDescription = JSON.parse(val?.Comments)
                        }
                        catch(e){

                        }                           
                    }                                        
                    val.No = val.owshiddenversion;
                    val.ModifiedDate = moment(val?.Modified).format("DD/MM/YYYY h:mmA");
                    val.ModifiedBy = val?.Editor?.LookupValue;
                    val.childs.push(val)
                })

                employeesWithoutLastName?.forEach((val: any) => {
                    val.childs?.forEach((ele: any) => {
                        const { VersionId, IsCurrentVersion, MetaInfo, Parent_x005f_x003a_x005f_ID,ClientTime,FeatureType_x005f_x003a_x005f_Title,SmartInformation_x005f_x003a_x005f_ID ,PreviouslyAssignedTo, Portfolio_x005f_x003a_x005f_ID, VersionLabel, Project_x005f_x003a_x005f_ID, UniqueId, ParentUniqueId, ScopeId, SMLastModifiedDate, GUID, FileRef, FileDirRef, OData__x005f_Moderation, WorkflowVersion, OData__x005f_IsCurrentVersion, OData__x005f_UIVersion, OData__x005f_UIVersionString, odata, Editor, ...rest } = ele;
                        return rest;
                    })
                })
                try{
                    employeesWithoutLastName.map((itm:any)=>{
                        if(itm.childs != undefined){
                            itm.childs.map((childitem:any)=>{
                                taskUsers.map((user:any)=>{
                                    if(childitem.Editor.LookupId === user.AssingedToUserId){
                                        childitem.ItemImage = user.Item_x0020_Cover.Url;
                                        childitem.UserId = user.AssingedToUserId;
                                    }
                                })
                            })
                        }
                    })
                }
                catch(e){}             
                setSCVersionHistoryData(TempSCDataItems)
                setData(employeesWithoutLastName);

            }).catch(error => {
                console.error('Error fetching version history:', error);
            });
        } catch (error) {
            console.error('Error fetching version history:', error);
        }
    }

    // this is used for getting all tagged CC from Smart Meta Data List 

    const LoadAllClientCategories = async () => {
        let TempCCData: any = [];
        let AllCCFromCall: any = [];
        try {
            let web = new Web(siteTypeUrl);
            AllCCFromCall = await web.lists
                .getById(RequiredListIds?.SmartMetadataListID)
                .items.select(
                    "Id,Title,listId,siteUrl,siteName,Item_x005F_x0020_Cover,ParentID,Configurations,EncodedAbsUrl,IsVisible,Created,Modified,Description1,SortOrder,Selectable,TaxType,Created,Modified,Author/Name,Author/Title,Editor/Name,Editor/Title,IsSendAttentionEmail/Id,IsSendAttentionEmail/Title,IsSendAttentionEmail/EMail"
                )
                .expand("Author,Editor,IsSendAttentionEmail")
                .getAll();

            if (AllCCFromCall?.length > 0) {
                AllCCFromCall?.map((AllCCItems: any) => {
                    if (AllCCItems.TaxType == "Client Category") {
                        if (AllCCItems.Title == "e+i") {
                            AllCCItems.Title = "EI"
                        }
                        if (AllCCItems.Title == "PSE") {
                            AllCCItems.Title = "EPS"
                        }
                        TempCCData.push(AllCCItems);
                    }
                })
                AllClientCategoriesData = TempCCData;
            }

        } catch (error) {
            console.log("Error", error.message);
        }
    }


    // this ise used for getting all users details form backend side also used for getting the current used details

    const loadTaskUsers = async () => {
        var AllTaskUsers: any = [];
        let currentUserId = Context?.pageContext._legacyPageContext.userId;
        try {
            taskUsers = await globalCommon.loadAllTaskUsers(RequiredListIds);
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
        } catch (error) {
            console.log("Error", error.message)
        }
    };

    // this is used for open comment popup function 
    const openCommentPopup = (CommentedData: any) => {
        setAllComment(CommentedData)
        setAllCommentModal(true);
    }
    const closeAllCommentModal = () => {
        setAllCommentModal(false);
    }

    const findDifferentColumnValues = (data: any) => {
        const differingValues = [];
        for (let i = 0; i < data.length; i++) {
            if (i !== data.length - 1) {
                const currentObj = data[i];
                const nextObj = data[i + 1];
                const differingPairs: any = {};
                // differingPairs['TaskID'] = currentObj.ID;
                differingPairs['TaskTitle'] = currentObj.Title;
                differingPairs['version'] = currentObj.VersionId;
                differingPairs['Modified'] = currentObj.Modified;
                differingPairs['ID'] = currentObj.ID;
                let editor = currentObj.Editor;
                let ID = currentObj.ID;

                for (let key in currentObj) {
                    let newKey;
                    let status;
                    // Apply key transformations
                    switch (key) {
                        case 'Team_x005f_x0020_x005f_Members':
                            newKey = 'TeamMembers';
                            break;
                        case 'Reference_x005f_x0020_x005f_Item_x005f_x0020_x005f_Json':
                            newKey = 'Reference Item Json';
                            break;
                        case 'component_x005f_x0020_x005f_link':
                            newKey = 'ComponentLink';
                            break;
                        case 'Responsible_x005f_x0020_x005f_Team':
                            newKey = 'ResponsibleTeam';
                            break;
                        case 'SharewebCategories':
                            newKey = 'TaskCategories';
                            break;
                        case 'Portfolio_x005f_x0020_x005f_Type':
                            newKey = 'PortfolioType';
                            break;
                        case 'Created_x005f_x0020_x005f_Date':
                            newKey = 'Created';
                            break;
                        case 'SmartInformation_x005f_x003a_x005f_Title':
                            newKey = 'SmartInformation';
                            break;                       
                        case 'Shareweb_x005f_x0020_x005f_ID':
                            newKey = 'TaskID';
                            break;
                        case 'Priority_x005f_x0020_x005f_Rank':
                            newKey = 'PriorityRank';
                            break;   
                        case 'Item_x005f_x0020_x005f_Type':
                            newKey = 'ItemType';
                            break;
                        case 'PortfolioType_x005f_x003a_x005f_Color':
                            newKey = 'PortfolioTypeColor';
                            break; 
                        case 'PortfolioType_x005f_x003a_x005f_IdRange':
                            newKey = 'PortfolioTypeIdRange';
                            break;  
                        case 'Item_x005f_x002d_x005f_Image':
                            newKey = 'ItemImage';
                            break; 
                        case 'Item_x005f_x0020_x005f_Cover':
                            newKey = 'ItemCover';
                            break; 
                        case 'FeatureType_x005f_x003a_x005f_ID':
                            newKey = 'FeatureTypeID';
                            break;  
                        case 'Client_x005f_x003a_x005f_Category':
                            newKey = 'ClientCategory';
                            break;  
                        case 'Item_x005f_x005F_x005f_x0020_x005f_Cover':
                            newKey = 'ItemCover';
                            break;                       
                        default:
                            newKey = key; // If no transformation needed, keep the same key
                            break;
                    }     
                    if (currentObj.hasOwnProperty(key) && (!nextObj.hasOwnProperty(key) || !isEqual(currentObj[key], nextObj[key]))) {                       
                        if (key === 'PercentComplete') {
                            newKey = '%Complete';                        
                        } else if (key === 'Status' && (currentObj['PercentComplete'] !== undefined && currentObj['PercentComplete'] !== 'NaN' && currentObj['PercentComplete'] !== null)) {
                            if(currentObj['Status'] !== undefined && currentObj['Status'] !== '' && currentObj['Status'] !== null){
                                newKey = 'Status';
                                const status = (currentObj['PercentComplete'] * 100) + '% ' + currentObj['Status'];
                                differingPairs[newKey] = status;
                            }
                            else{
                                newKey = 'Status';
                                const status = (currentObj['PercentComplete'] * 100) + '% ';
                                differingPairs[newKey] = status;
                            }
                        }else if(key === 'Body'){
                            newKey = 'Body';
                            try {
                                const Bodyvalue = currentObj.Body.replace(/<[^>]*>/g, '');
                                differingPairs[newKey] = Bodyvalue;
                            }
                            catch (e) {
                                console.log(e);
                            }                                                        
                        }                         
                        else if(key === 'Short_x005f_x0020_x005f_Description_x005f_x0020_x005f_On'){
                            newKey = 'ShortDescriptionOnline';
                            try {
                                const shortvalue = currentObj.Short_x005f_x0020_x005f_Description_x005f_x0020_x005f_On.replace(/<[^>]*>/g, '');
                                differingPairs[newKey] = shortvalue;
                            }
                            catch (e) {
                                console.log(e);
                            }     
                            
                        }
                        else if(key === 'TechnicalExplanations'){
                            newKey = 'TechnicalExplanations';                 
                            try {
                                const shortvalue = $.parseHTML(currentObj.TechnicalExplanations)[0].textContent;
                                differingPairs[newKey] = shortvalue;
                            }   
                            catch (e) {
                                console.log(e);
                            }
                            
                        }    
                        else if(key === 'Deliverables'){
                            newKey = 'Deliverables';             
                            try {
                                const Deliverablesvalue = $.parseHTML(currentObj.Deliverables)[0].textContent;
                                differingPairs[newKey] = Deliverablesvalue;
                            }
                            catch (e) {
                                console.log(e);
                            }
                            
                        } 
                        else if (key === 'CategoriesItemsJson' && currentObj.CategoriesItemsJson != undefined && currentObj.CategoriesItemsJson != '[]') {
                            const newKey = 'CategoriesItems';
                            let Deliverablesvalue = '';
                            try {
                                if (currentObj?.CategoriesItemsJson != undefined && currentObj?.CategoriesItemsJson != null && currentObj?.CategoriesItemsJson != '[]')
                                  var parsedItems = JSON.parse(currentObj?.CategoriesItemsJson);
                                if (parsedItems.length >= 2) {
                                    parsedItems.forEach((item: any) => {
                                        Deliverablesvalue += ';' + item.Title;
                                    });
                                } else if (parsedItems.length === 1) {
                                    Deliverablesvalue = parsedItems[0].Title + ';';
                                }
                            }
                            catch (e) {
                                console.log(e);
                            }
                            
                            differingPairs[newKey] = Deliverablesvalue;
                        }    
                        else {
                            differingPairs[newKey] = currentObj[key];
                        }
                        
                    }                         
                }
                
                // Check for properties in n+1 but not in n           
                for (const key in nextObj) {
                    if (nextObj.hasOwnProperty(key) && !currentObj.hasOwnProperty(key)) {
                        differingPairs[key] = currentObj[key];                       
                    }
                }
                differingPairs['Editor'] = editor;
                differingPairs['TaskID'] = ID;
                if (Object.keys(differingPairs).length > 0) {                                        
                    differingValues.push(differingPairs);
                }
            }
            else {
                const currentObj = data[i];
                const prevObj = data[i - 1];
                const differingPairs: any = {};
                //differingPairs['TaskID'] = currentObj.ID;
                differingPairs['TaskTitle'] = currentObj.Title;
                differingPairs['version'] = currentObj.VersionId;
                differingPairs['ID'] = currentObj.ID;
                differingPairs['owshiddenversion'] = currentObj.owshiddenversion;
                let editor = currentObj.Editor;
                let ID = currentObj.ID;

                for (const key in currentObj) {   
                    let newKey;
                    switch (key) {
                        case 'Team_x005f_x0020_x005f_Members':
                            newKey = 'TeamMembers';
                            break;
                        case 'Reference_x005f_x0020_x005f_Item_x005f_x0020_x005f_Json':
                            newKey = 'Reference Item Json';
                            break;
                        case 'component_x005f_x0020_x005f_link':
                            newKey = 'ComponentLink';
                            break;
                        case 'Responsible_x005f_x0020_x005f_Team':
                            newKey = 'ResponsibleTeam';
                            break;
                        case 'SharewebCategories':
                            newKey = 'TaskCategories';
                            break;
                        case 'Portfolio_x005f_x0020_x005f_Type':
                            newKey = 'PortfolioType';
                            break;
                        case 'Item_x005f_x0020_x005f_Type':
                            newKey = 'ItemType';
                            break;  
                        case 'PortfolioType_x005f_x003a_x005f_Color':
                            newKey = 'PortfolioTypeColor';
                            break; 
                        case 'PortfolioType_x005f_x003a_x005f_IdRange':
                            newKey = 'PortfolioTypeIdRange';
                            break; 
                        case 'Item_x005f_x002d_x005f_Image':
                            newKey = 'ItemImage';
                            break; 
                        case 'Item_x005f_x0020_x005f_Cover':
                            newKey = 'ItemCover';
                            break; 
                        case 'FeatureType_x005f_x003a_x005f_ID':
                            newKey = 'FeatureTypeID';
                            break;  
                        case 'Client_x005f_x003a_x005f_Category':
                            newKey = 'ClientCategory';
                            break; 
                        case "Item_x005f_x005F_x005f_x0020_x005f_Cover":
                            newKey = "ItemCover";
                            break;
                        default:
                            newKey = key; // If no transformation needed, keep the same key
                            break;
                    }                                                               
                    if ((currentObj[key] !== undefined && currentObj[key] !== null && currentObj[key] !== '' && currentObj.hasOwnProperty(key)) && (key !== 'Checkmark' && key !== 'odata.type' && key !== 'ItemChildCount' && key !== 'SMTotalFileStreamSize' && key !== 'ContentVersion' && key !== 'FolderChildCount' && key !== 'NoExecute' && key !== 'FSObjType' && key !== 'FileLeafRef' && key !== 'Order' && key !== 'Created_x005f_x0020_x005f_Date' && key !== 'Last_x005f_x0020_x005f_Modified')) {
                        if (!isEmpty(currentObj[key]) && key != 'Project_x005f_x003a_x005f_ID' && key != 'SyncClientId' && key != 'SMTotalSize' && key != 'SMTotalFileCount') {
                            // if (key === 'PercentComplete')
                            //     newKey = '%Complete';
                            // differingPairs[newKey] = currentObj[key];
                            // differingPairs['Editor'] = currentObj.Editor;
                            if (key === 'PercentComplete') {
                                newKey = '%Complete';
                            } else if (key === 'Status' && (currentObj['PercentComplete'] !== undefined && currentObj['PercentComplete'] !== 'NaN' && currentObj['PercentComplete'] !== null)) {
                                if(currentObj['Status'] !== undefined && currentObj['Status'] !== '' && currentObj['Status'] !== null){
                                    newKey = 'Status';
                                    const status = (currentObj['PercentComplete'] * 100) + '% ' + currentObj['Status'];
                                    differingPairs[newKey] = status;
                                }
                                else{
                                    newKey = 'Status';
                                    const status = (currentObj['PercentComplete'] * 100) + '% ';
                                    differingPairs[newKey] = status;
                                }
                                
                            }else if(key === 'Body'){
                                newKey = 'Body';
                                try {
                                    const Bodyvalue = currentObj.Body.replace(/<[^>]*>/g, '');
                                    differingPairs[newKey] = Bodyvalue;
                                }
                                catch (e) {
                                    console.log(e);
                                }
                                
                            }                           
                            else if(key === 'Short_x005f_x0020_x005f_Description_x005f_x0020_x005f_On'){
                                newKey = 'ShortDescriptionOnline';
                                try {
                                    const shortvalue = currentObj.Short_x005f_x0020_x005f_Description_x005f_x0020_x005f_On.replace(/<[^>]*>/g, '');
                                    differingPairs[newKey] = shortvalue;
                                }
                                catch (e) {
                                    console.log(e);
                                }
                               
                            }
                            else if(key === 'TechnicalExplanations'){
                                newKey = 'TechnicalExplanations';   
                                try {
                                    const shortvalue = $.parseHTML(currentObj.TechnicalExplanations)[0].textContent;
                                    differingPairs[newKey] = shortvalue;
                                }
                                catch (e) {
                                    console.log(e);
                                }
                                
                            }
                            else if(key === 'Deliverables'){
                                newKey = 'Deliverables';                            
                                try {
                                    const Deliverablesvalue = $.parseHTML(currentObj.Deliverables)[0].textContent;
                                    differingPairs[newKey] = Deliverablesvalue;
                                }
                                catch (e) {
                                    console.log(e);
                                }
                            }    
                            else if (key === 'CategoriesItemsJson' && currentObj.CategoriesItemsJson != undefined && currentObj.CategoriesItemsJson != '[]') {
                                const newKey = 'CategoriesItems';
                                let Deliverablesvalue = '';                                
                                try {
                                    if (currentObj?.CategoriesItemsJson != undefined && currentObj?.CategoriesItemsJson != null && currentObj?.CategoriesItemsJson != '[]')
                                        var parsedItems = JSON.parse(currentObj?.CategoriesItemsJson);
                                    if (parsedItems.length >= 2) {
                                        parsedItems.forEach((item: any) => {
                                            Deliverablesvalue += ';' + item.Title;
                                        });
                                    } else if (parsedItems.length === 1) {
                                        Deliverablesvalue = parsedItems[0].Title + ';';
                                    }
                                }
                                catch (e) {
                                    console.log(e);
                                }
                                differingPairs[newKey] = Deliverablesvalue;
                            }   
                            else if (key === 'DraftCategory') {
                                newKey = 'DraftCategory';                                                       
                                const Deliverablesvalue: any = JSON.parse(currentObj.DraftCategory)[0];                            
                                differingPairs[newKey] = Deliverablesvalue;
                            }   
                            else {
                                differingPairs[newKey] = currentObj[key];
                            }
                        }                        
                    }
                    differingPairs['Editor'] = editor;
                    differingPairs['TaskID'] = ID;
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


    const onRenderCustomHeader = () => {
        return (
            <>
                <div className='subheading mb-0'>
                    Version History
                </div>  
                <Tooltip ComponentId='1950' />
            </>
        );
    };
    const onRenderCustomCommentHeader = () => {
        return (
            <>
                <div className='subheading mb-0'>
                    All Comments
                </div>               
            </>
        );
    };
    const renderArray = (arr: any[],key:any) => {
        return arr.map((item, index) => (
            <div key={index}>{typeof item === 'object' ? item.LookupValue : item} </div>
        ));
    };
    const renderSiteComposition = (itm: any) => {
        var SitesTaggingArray: any = [];
        let TaggedCCArray: any = [];
        console.log("All Site Composition Update data", itm)
        if (itm?.ClientCategory?.length > 0) {
            AllClientCategoriesData?.map((AllCCItem: any) => {
                itm?.ClientCategory?.map((TaggedCC: any) => {
                    if (TaggedCC.LookupId == AllCCItem.Id) {
                        TaggedCCArray.push(AllCCItem);
                    }
                })
            })
        }

        if (itm?.Sitestagging != undefined && itm?.Sitestagging != false) {
            try {
                SitesTaggingArray = JSON.parse(itm?.Sitestagging)
                SitesTaggingArray?.map((AllSCItem: any) => {
                    TaggedCCArray?.map((CCItem: any) => {
                        if (CCItem.siteName == AllSCItem.Title) {
                            if (AllSCItem?.ClientCategory?.length > 0) {
                                AllSCItem?.ClientCategory.push(CCItem);
                            } else {
                                AllSCItem.ClientCategory = [CCItem];
                            }
                        }
                    })
                })
            } catch (e) {
                console.log("Error", e.message);
            }
        }

        return (
            <>
                {(SitesTaggingArray != undefined && SitesTaggingArray != null && SitesTaggingArray.length > 0) && <dl className={usedFor == "Site-Composition" ? "Sitecomposition" : "Sitecomposition"}>
                    <div className='dropdown'>
                        <div className="spxdropdown-menu" style={{ display: showComposition ? 'block' : 'none' }}>
                            <ul>
                                {SitesTaggingArray?.map((site: any, indx: any) => {
                                    return <li className="Sitelist">
                                        <span>
                                            <img style={{ width: "22px" }} title={site?.Title} src={site?.SiteImages} />
                                        </span>
                                        {site?.ClienTimeDescription != undefined &&
                                            <span>
                                                {Number(site?.ClienTimeDescription).toFixed(2)}%
                                            </span>
                                        }

                                        <span className="d-inline">
                                            {site.ClientCategory != undefined && site.ClientCategory.length > 0 ? site.ClientCategory?.map((ClientCategory: any, Index: any) => {
                                                return (
                                                    <div className={Index == site.ClientCategory?.length - 1 ? "mb-0" : "mb-0 border-bottom"}>{ClientCategory.Title}</div>
                                                )
                                            }) : null}
                                        </span>

                                    </li>
                                })}
                            </ul>
                        </div>
                    </div>
                </dl>}
            </>
        )
    }
    const showBackgroundComments = (itm: any) => {
        var OffshoreCommentsArray: any = [];
        if (itm?.OffshoreComments != undefined) {
            try {
                OffshoreCommentsArray = JSON.parse(itm?.OffshoreComments)
            } catch (e) {

            }
        }
        return (
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
    const showApproverHistory = (itm: any) => {
        var ApproverHistoryData: any;
        if (itm?.ApproverHistory != undefined && itm?.ApproverHistory != null && itm?.ApproverHistory != '[]')
            ApproverHistoryData = JSON.parse(itm?.ApproverHistory)
        return (
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
                                                Prev-Approver | <img title={HistoryData.ApproverName} className="workmember ms-1" src={HistoryData?.ApproverImage?.length > 0 ? HistoryData?.ApproverImage : ""} />
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

    const showSiteCompositionSettings = (itm: any) => {
        var SiteSettingType: any = '';
        if (itm?.SiteCompositionSettings != undefined) {
            try {
                JSON.parse(itm?.SiteCompositionSettings).map((SiteSettingItems: any) => {
                    if (SiteSettingItems.Deluxe)
                        SiteSettingType = 'Deluxe';
                    else if (SiteSettingItems.Manual)
                        SiteSettingType = 'Manual';
                    else if (SiteSettingItems.Proportional)
                        SiteSettingType = 'Proportional';
                    else if (SiteSettingItems.Protected)
                        SiteSettingType = 'Protected';
                    else if (SiteSettingItems.Standard)
                        SiteSettingType = 'Standard';
                })
            } catch (e) {

            }
        }

        return (
            <>
                {SiteSettingType != undefined && SiteSettingType != '' && <div>{SiteSettingType}</div>}
            </>
        )
    }

    const renderObject = (obj: any,key:any) => {
        if (obj != null && obj != undefined) {
            if (obj?.Url != undefined && obj?.Url != null) {
                return <a href={obj?.Url} target='_blank' data-interception="off"> {obj?.Url} </a>
            }
            return (
            <div>
                {key === 'Project' ? <a href={`${siteTypeUrl}/SitePages/Project-Management.aspx?ProjectId=${obj.LookupId}`} target='_blank' data-interception="off">{obj.LookupValue}</a>:
                key === 'Portfolio' ? <a href={`${siteTypeUrl}/SitePages/Portfolio-Profile.aspx?taskId=${obj.LookupId}`} target='_blank' data-interception="off">{obj.LookupValue}</a> :
                obj?.LookupValue}
            </div>)
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
                type={PanelType.custom}
                customWidth={usedFor == "Site-Composition" ? "900px" : "1200px"}
            >

                <table className="table VersionHistoryTable mt-2">
                    <thead>
                        <tr>
                            <th style={{ width: "50px" }} scope="col">No</th>
                            {/* <th style={{ width: "210px" }} scope="col">Modified</th> */}
                            <th scope="col">Info</th>
                            <th style={{ width: "220px" }} scope="col">Modified by</th>
                        </tr>
                    </thead>
                    {usedFor === "Site-Composition" ?
                        <tbody>
                            {SCVersionHistoryData?.map((SCItem: any, Index: any) => {
                                return (
                                    <tr>
                                        <td>
                                            {SCVersionHistoryData?.length - Index}
                                        </td>
                                        <td>
                                            <span className="siteColor"><a href={`${siteTypeUrl}/Lists/HHHH/DispForm.aspx?ID=${SCItem.ID}&VersionNo=${SCItem.version}`}>{SCItem?.ModifiedDate}</a></span>
                                        </td>
                                        <td>
                                            <div className='Info-VH-Col'>
                                                {renderSiteComposition(SCItem)}
                                            </div>
                                        </td>
                                        <td>
                                            <span className="siteColor">{SCItem?.ModifiedBy}</span>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                        :
                        <tbody>
                            {data?.map((itm: any) => {
                                return (
                                    <>
                                        <tr>
                                            <td>
                                                {itm?.No}
                                            </td>
                                            {/* <td>
                                                <span className="siteColor"><a href={`${siteTypeUrl}/Lists/${sitetype}/DispForm.aspx?ID=${itm.ID}&VersionNo=${itm.version}`} target='_blank' data-interception="off">{itm?.ModifiedDate}</a></span>
                                            </td> */}
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
                                                                                key != 'Modified' && key != 'ItemImage' && key != 'UserId' && key != 'TaskID' && key != 'ModifiedDate' && key != 'BasicImageInfoArray' && key != 'OffshoreImageUrlArray' && key != 'No' && key != 'CommentsDescription' && key != 'Created' && key != 'ModifiedBy' && key !== 'version' && key !== 'TaskTitle' && key !== 'FeedBackDescription' && key !== 'ID' && key !== 'EstimatedTimeDescriptionArray' && key !== 'TotalEstimatedTime') &&
                                                                                <li key={index}>
                                                                                    <span className='vh-textLabel'>{key}</span>
                                                                                    <span className='vh-textData'>{Array.isArray(item[key])
                                                                                        ? renderArray(item[key],key)
                                                                                        : typeof item[key] === 'object'
                                                                                            ? renderObject(item[key],key)
                                                                                            : key === 'FeedBack'
                                                                                                ? <div className='feedbackItm-text'>
                                                                                                    {(item?.FeedBackDescription != undefined && item?.FeedBackDescription != '' && item?.FeedBackDescription?.length > 0) ? <span className='d-flex'><p className='text-ellips mb-0'>{`${item?.FeedBackDescription[0]?.Title}`}</p> <InfoIconsToolTip Discription='' row={item} versionHistory={true} /></span> : ''}
                                                                                                </div> : key === '%Complete' ? (item['%Complete']) * 100 : key === 'BasicImageInfo'
                                                                                                    ? <div className='BasicimagesInfo_groupImages'>
                                                                                                        {item?.BasicImageInfoArray != undefined && item?.BasicImageInfoArray.map((image: any, indx: any) => {
                                                                                                            return (
                                                                                                                <>
                                                                                                                    <span className='BasicimagesInfo_group'>
                                                                                                                        <a href={image.ImageUrl} target='_blank' data-interception="off"><img src={image.ImageUrl} alt="" /></a>
                                                                                                                        {image.ImageUrl !== undefined ? <span className='BasicimagesInfo_group-imgIndex'>{indx + 1}</span> : ''}
                                                                                                                    </span>
                                                                                                                </>
                                                                                                            )
                                                                                                        })}
                                                                                                    </div> : typeof (item[key]) === 'boolean' ? String(item[key]) : key === 'EstimatedTimeDescription'
                                                                                                        ? <dl className="Sitecomposition my-2 w-50">
                                                                                                            <div className='dropdown' key={index} >
                                                                                                                <a className="sitebutton bg-fxdark d-flex">

                                                                                                                    <div className="d-flex justify-content-between full-width">
                                                                                                                        <p className="pb-0 mb-0 ">Estimated Task Time Details</p>
                                                                                                                    </div>
                                                                                                                </a>
                                                                                                                <div className="spxdropdown-menu">
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
                                                                                                            ? <>{item?.CommentsDescription != undefined && <div className='feedbackItm-text'>

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
                                                                                                                        <span className='text-end w-25'><a className="hreflink" onClick={() => openCommentPopup(item?.CommentsDescription)}>See More</a></span>
                                                                                                                    </span>

                                                                                                                </div>
                                                                                                            </div>}</> : key === 'OffshoreImageUrl' ? <div className='BasicimagesInfo_groupImages'>
                                                                                                                {item?.OffshoreImageUrlArray != undefined && item?.OffshoreImageUrlArray.map((image: any, indx: any) => {
                                                                                                                    return (
                                                                                                                        <>
                                                                                                                            <span className='BasicimagesInfo_group'>
                                                                                                                                <a href={image.Url} target='_blank' data-interception="off"><img src={image.Url} alt="" /></a>
                                                                                                                                {image.Url !== undefined ? <span className='BasicimagesInfo_group-imgIndex'>{indx + 1}</span> : ''}
                                                                                                                            </span>
                                                                                                                        </>
                                                                                                                    )
                                                                                                                })}
                                                                                                            </div> : key === 'Sitestagging' ? renderSiteComposition(item) : key === 'OffshoreComments' ? showBackgroundComments(item) : key === 'SiteCompositionSettings' ? showSiteCompositionSettings(item) : key === 'ApproverHistory' ? showApproverHistory(item) : item[key]}
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
                                                <div className="alignCenter">
                                                    <a href={`${siteTypeUrl}/Lists/${sitetype}/DispForm.aspx?ID=${itm.ID}&VersionNo=${itm.version}`} target='_blank' data-interception="off">{itm?.ModifiedDate}</a>
                                                    <a href={`${siteTypeUrl}/SitePages/TaskDashboard.aspx?UserId=${itm.UserId}`} target='_blank' data-interception='off'>{itm?.ItemImage ? <img className='workmember hreflink ms-1' src={itm?.ItemImage} title={itm?.ModifiedBy} /> : <span title={itm?.ModifiedBy ? itm?.ModifiedBy : "Default user icons"} className="alignIcon svg__iconbox svg__icon--defaultUser "></span> }</a>
                                                </div>
                                            </td>
                                        </tr>
                                    </>
                                )

                            })}

                        </tbody>
                    }
                </table >

            </Panel>
            <Panel
                onRenderHeader={onRenderCustomCommentHeader}
                type={PanelType.custom}
                customWidth="500px"
                onDismiss={closeAllCommentModal}
                isOpen={AllCommentModal}
                isBlocking={false}
            >
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
                                        <div className="commentMedia">
                                            {cmtData?.ReplyMessages != null && cmtData?.ReplyMessages != undefined && cmtData?.ReplyMessages?.length > 0 &&
                                                <div>
                                                <ul className="list-unstyled subcomment">
                                                    {cmtData?.ReplyMessages != null && cmtData?.ReplyMessages?.length > 0 && cmtData?.ReplyMessages?.map((ReplyMsg: any, j: any) => {
                                                    return <li className="media  p-1 my-1">
                                                        <div className="media-bodyy">
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <span className="comment-date ng-binding">
                                                            <span className="round  pe-1">
                                                                <img className="align-self-start " title={ReplyMsg?.AuthorName}
                                                                src={ReplyMsg?.AuthorImage != undefined && ReplyMsg?.AuthorImage != '' ?
                                                                    ReplyMsg?.AuthorImage :
                                                                    "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg"}
                                                                />
                                                            </span>
                                                            {ReplyMsg?.Created}</span>                                                           
                                                        </div>
                                                        <div className="media-text">                                                            
                                                            {ReplyMsg?.Description}
                                                        </div>
                                                        </div>
                                                    </li>
                                                    })}
                                                </ul>
                                                </div>
                                            }
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
