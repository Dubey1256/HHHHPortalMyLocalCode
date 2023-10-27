import * as React from 'react';
import { Web } from 'sp-pnp-js';
import CommentCard from '../../../globalComponents/Comments/CommentCard';
import AncTool from '../../../globalComponents/AncTool/AncTool';
import { BiInfoCircle } from 'react-icons/bi';
import { ImReply } from 'react-icons/im';
import {
    mergeStyleSets,
    FocusTrapCallout,
    FocusZone,
    FocusZoneTabbableElements,
    FontWeights,
    Stack,
    Text,
    Panel,
  } from '@fluentui/react';
import moment from 'moment';
import SmartInformation from '../../taskprofile/components/SmartInformation';
import RelevantDocuments from '../../taskprofile/components/RelevantDocuments';
import MeetingPopupComponent from '../../../globalComponents/MeetingPopup/MeetingPopup';
import TagTaskToProjectPopup from '../../projectManagement/components/TagTaskToProjectPopup';
import MettingTable from './MeetingFooterTable';
import { map } from 'jquery';
var count=0;
var isShowTimeEntry: any;
var isShowSiteCompostion: any;
var AllListId: any;
var taskUsers: any;
var currentUser: any;
var buttonId:any;
var resultDatabackup:any;
var dataLength: any = [];
var meetinDatabackup:any
let allData: any = [];
const mycontextValue:any = React.createContext<any>({ AllListId: {}, context: {},  currentUser: {}, taskUsers: [] });
const MeetingProfile = (props: any) => {
 
  const [commenttoPost, setCommenttoPost] = React.useState("")
  const [updateComment, setUpdateComment] = React.useState(false);
  const [resultData, setResultData] = React.useState<any>({})
  const [timesheetListConfig,setTimesheetListConfig]=React.useState<any>()
  const [AllSite, setAllSite] = React.useState<any>([]);
  const relevantDocRef = React.useRef<any>();
  const smartInfoRef = React.useRef<any>();
    const [meetingId, setmeetingId] = React.useState(null)
    const [display, setDisplay] = React.useState('none');
    const [openModelImg, setOpenModelImg] = React.useState<any>({ isModalOpen: false, imageInfo: {ImageName:"",ImageUrl:""}, showPopup: 'none' })
    const [showMeetingPopup,setshowMeetingPopup]=React.useState(false);
    const [feedbackpopup, setfeedbackpopup] = React.useState(
        { showcomment: 'none',
         showhideCommentBoxIndex: null,
         showcomment_subtext: 'none',
         subchildcomment: null, 
        subchildParentIndex: null }
        )
   const[editpopupData,setEditPopupData]=React.useState({isEditModalOpen:false,isModalOpen:false,imageInfo:{},isCalloutVisible:false,replyTextComment:"",currentDataIndex:null,showPopup:'none',CommenttoUpdate:"",isEditReplyModalOpen:false,
   updateCommentText:{
    'comment': '',
    'indexOfUpdateElement': null,
    'indexOfSubtext': null,
    'isSubtextComment':null,
    "data": null,
    "parentIndexOpeneditModal": null
   },
   updateReplyCommentText:{
    'comment': '',
    'indexOfUpdateElement': null,
    'indexOfSubtext': null,
    'isSubtextComment': "",
    'replyIndex': null,
    "data": null,
    "parentIndexOpeneditModal": null
   }})

    React.useEffect(() => {
        GetTaskUsers().then((data) => {
            console.log(data)
            currentUser = GetUserObject(props?.props?.userDisplayName);
            smartMetaData().then((data:any)=>{
              if(data!=undefined){
                getQueryVariable()
              }
              
            })
           
        }).catch((error: any) => {
            console.log(error)
        });



    }, [])
    const smartMetaData = async () => {
return new Promise<void>((resolve, reject) => {
  let sites = [];
  
  const web = new Web(props.props?.siteUrl);
        web.lists
      .getById(props?.props?.SmartMetadataListID,)
      .items.select("Configurations", "ID", "Title", "TaxType", "listId")
      .filter("TaxType eq 'Sites'or TaxType eq 'timesheetListConfigrations'")
      .getAll().then(async (data:any)=>{
      var  AllsiteData:any = [];

      var timesheetListConfig = data.filter((data3: any) => {
        if (data3?.TaxType == 'timesheetListConfigrations') {
            return data3;
        }
    });
    setTimesheetListConfig(timesheetListConfig)
        data?.map((item: any) => {
          if (item.TaxType == "Sites") {
            if (item.Title != "DRR" && item.Title != "Master Tasks" && item.Title != "SDC Sites" && item.Configurations != null)
             {
              AllsiteData.push(item)
              let a: any = JSON.parse(item.Configurations);
             a?.map((newitem: any) => {
                dataLength.push(newitem);
                getAllData(newitem).then((data:any)=>{
                  resolve(data)
                });
              });
             
            }
          }
        });
      
   
        setAllSite(AllsiteData)
      })
       
      
    
    .catch((error:any)=>{
        console.log(error)
      })
})
     
      
    
    };
    const getAllData = async (site: any) => {
      return new Promise<void>((resolve, reject) => {
        const web = new Web(site?.siteUrl);
        web.lists
            .getById(site?.listId)
            .items.select("Title","PercentComplete","Categories", "workingThisWeek",'TaskID' ,"IsTodaysTask","Priority","Priority_x0020_Rank","DueDate","Created","Modified","Team_x0020_Members/Id","Team_x0020_Members/Title","ID","Responsible_x0020_Team/Id","Responsible_x0020_Team/Title","Editor/Title","Editor/Id","Author/Title","Author/Id","AssignedTo/Id","AssignedTo/Title")
            .expand("Team_x0020_Members","Author","Editor","Responsible_x0020_Team","AssignedTo")
            .top(5000)
            .getAll()
            .then((data: any) => {
                   count++;
                   data.map((items:any)=>{
                    items.siteType=site?.Title
                   })
                   allData= allData.concat(data)
                   if (count == dataLength.length) {
                    resolve(allData)
                   }
                 
               })
            
            .catch((err: any) => {
                console.log("then catch error", err);
            });
      })
     
  };
  
    //  ============current user details=========
    const GetUserObject = (username: any) => {
        //username = username.Title != undefined ? username.Title : username;
        let userDeatails: any = [];
        if (username != undefined) {
            let senderObject = taskUsers.filter(function (user: any, i: any) {
                if (user?.AssingedToUser != undefined) {
                    return user?.AssingedToUser['Title'] == username
                }
            });
            if (senderObject?.length > 0) {
                userDeatails.push({
                    'Id': senderObject[0]?.AssingedToUser.Id,
                    'Name': senderObject[0]?.Email,
                    'Suffix': senderObject[0]?.Suffix,
                    'Title': senderObject[0]?.Title,
                    'userImage': senderObject[0]?.Item_x0020_Cover != null ? senderObject[0]?.Item_x0020_Cover.Url : ""
                })
            } if (senderObject.length == 0) {
                userDeatails.push({
                    'Title': username,
                    'userImage': "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg"
                })

            }
            return userDeatails;
        }

    }
    const GetTaskUsers = async () => {
        return new Promise<void>((resolve, reject) => {

            let web = new Web(props?.props?.siteUrl);

            web.lists
                // .getByTitle("Task Users")
                .getById(props?.props.TaskUsertListID)
                .items
                .select('Id', 'Email', 'Suffix', 'Title', 'Item_x0020_Cover', 'Company', 'AssingedToUser/Title', 'AssingedToUser/Id',)
                .filter("ItemType eq 'User'")
                .expand('AssingedToUser')
                .get().then((taskusermember: any) => {
                    taskUsers = taskusermember;
                    resolve(taskusermember)
                }).catch((error: any) => {
                    reject(error)
                });
            //   taskUsersMember?.map((item: any, index: any) => {
            //   if (this.props?.Context?.pageContext?._legacyPageContext?.userId === (item?.AssingedToUser?.Id) && item?.Company == "Smalsus") {
            //     this.backGroundComment = true;
            //   }
            // })

        })


        // console.log(this.taskUsers);

    }
    const getQueryVariable = () => {
        const params = new URLSearchParams(window.location.search);
        let query = params?.get("meetingId");
        console.log(query)
        setmeetingId(query)
        AllListId = {
            MasterTaskListID: props?.props?.MasterTaskListID,
            TaskUsertListID: props?.props?.TaskUsertListID,
            SmartMetadataListID: props?.props?.SmartMetadataListID,
            meetingId: query,
            listId: props?.props?.MasterTaskListID,
            TaskTimeSheetListID: props?.props?.TaskTimeSheetListID,
            DocumentsListID: props?.props?.DocumentsListID,
            SmartInformationListID: props?.props?.SmartInformationListID,
            siteUrl: props?.props?.siteUrl,
            TaskTypeID: props?.props?.TaskTypeID,
            isShowTimeEntry: isShowTimeEntry,
            isShowSiteCompostion: isShowSiteCompostion
        }
        GetResult();

    }
    const GetResult = async () => {
        if (AllListId?.MasterTaskListID != undefined) {

            let web = new Web(props?.props?.siteUrl);
            await web.lists

                .getById(AllListId?.MasterTaskListID)

                .items.getById(AllListId?.meetingId)

                .select("Id", "Title", "DueDate", "AssignedTo/Id","Attachments","Sitestagging", "FeedBack", "PortfolioStructureID","AssignedTo/Title", "ResponsibleTeam/Title", "ResponsibleTeam/Id", 'AttachmentFiles', "ShortDescriptionVerified", "BasicImageInfo", 'Author/Id', 'Author/Title', "Editor/Title", "Editor/Id", "OffshoreComments", "OffshoreImageUrl", "TeamMembers/Id", "TeamMembers/Title")

             

                .expand("AssignedTo", 'ResponsibleTeam', "AttachmentFiles", "Author", "Editor", "TeamMembers").get()
            
                .then(async (taskDetails: any) => {
                    console.log(taskDetails)
                    
    if (taskDetails["AssignedTo"] != undefined) {
        taskDetails["AssignedTo"]?.map((item: any, index: any) => {
          if (taskDetails?.TeamMembers != undefined) {
            for (let i = 0; i < taskDetails?.TeamMembers?.length; i++) {
              if (item.Id == taskDetails?.TeamMembers[i]?.Id) {
                taskDetails?.TeamMembers?.splice(i, true);
                i--;
              }
            }
          }
  
          item.workingMember = "activeimg";
  
        });
      }
    let siteTaggJson:any=  taskDetails.Sitestagging!=undefined?JSON.parse(taskDetails.Sitestagging):null
  let  siteTagg2 :any=[]
  // allData.map((item:any)=>{
  //     siteTagg2= siteTagg2.concat(siteTaggJson.filter((data:any)=>data.Id==item.Id && data.siteType==item.siteType))
  // })

      var array2: any = taskDetails["AssignedTo"] != undefined ? taskDetails["AssignedTo"] : []
      if (taskDetails["TeamMembers"] != undefined) {
        taskDetails.array = array2.concat(taskDetails["TeamMembers"]?.filter((item: any) => array2?.Id != item?.Id))
  
      }
    
                 
                    let data = {
                        Id: taskDetails.Id,
                        Title: taskDetails?.Title,
                        MeetingId:taskDetails?.PortfolioStructureID,
                        listName:"Master Tasks",
                        Sitestagging:siteTagg2!=undefined &&siteTagg2.length>0?siteTagg2:null,
                        DueDate: taskDetails["DueDate"],
                        Created: taskDetails["Created"],
                        Creation: taskDetails["Created"],
                        Modified: taskDetails["Modified"],
                        ModifiedBy: taskDetails["Editor"],
                        Author: GetUserObject(taskDetails["Author"]?.Title),
                        listId:props?.props?.MasterTaskListID,
                        BasicImageInfo:GetAllImages(JSON.parse(taskDetails["BasicImageInfo"]), taskDetails["AttachmentFiles"], taskDetails["Attachments"]),
                        // GetAllImages(JSON.parse(taskDetails["BasicImageInfo"]), taskDetails["AttachmentFiles"], taskDetails["Attachments"])
                        FeedBack: JSON.parse(taskDetails["FeedBack"]),
                        // TaskType: taskDetails["TaskType"] != null ? taskDetails["TaskType"]?.Title : '',
                        TeamLeader: taskDetails["ResponsibleTeam"] != null ? GetUserObjectFromCollection(taskDetails["ResponsibleTeam"]) : null,
                        TeamMembers: taskDetails.array != null ? GetUserObjectFromCollection(taskDetails.array) : null,
                        AssignedTo: taskDetails["AssignedTo"] != null ? GetUserObjectFromCollection(taskDetails["AssignedTo"]) : null,
                    }
                    resultDatabackup=data;
                    setResultData(data);
                })
        }
    }
    //=========basic image info function============
    const  sortAlphaNumericAscending = (a: any, b: any) => a.FileName.localeCompare(b.FileName, 'en', { numeric: true });
    const  GetAllImages=(BasicImageInfo: any, AttachmentFiles: any, Attachments: any)=> {
        let ImagesInfo: any = [];
    
        if (Attachments) {
    
          AttachmentFiles?.map((items: any) => {
            var regex = items?.FileName?.substring(0, 20);
            items.newFileName = regex;
          })
          AttachmentFiles?.sort(sortAlphaNumericAscending)
    
          AttachmentFiles?.forEach(function (Attach: any) {
            let attachdata: any = [];
            if (BasicImageInfo != null || BasicImageInfo != undefined) {
              attachdata = BasicImageInfo?.filter(function (ingInfo: any, i: any) {
                return ingInfo.ImageName == Attach?.FileName
              });
            }
            if (attachdata.length > 0) {
              BasicImageInfo?.forEach(function (item: any) {
                if (item?.ImageUrl != undefined && item?.ImageUrl != "") {
                  item.ImageUrl = item?.ImageUrl?.replace(
                    "https://www.hochhuth-consulting.de",
                    "https://hhhhteams.sharepoint.com/sites/HHHH"
                  );
                }
                // if(item.ImageUrl!=undefined && item.ImageUrl.toLowerCase().indexOf('https://www.hochhuth-consulting.de/') > -1) {
                //   var imgurl = item.AuthorImage.split('https://www.hochhuth-consulting.de/')[1];
                //     item.ImageUrl = 'https://hhhhteams.sharepoint.com/sites/HHHH/' + imgurl;
                // }
                if (item?.ImageName == Attach?.FileName) {
                  ImagesInfo.push({
                    ImageName: Attach?.FileName,
                    ImageUrl: Attach?.ServerRelativeUrl,
                    UploadeDate: item?.UploadeDate,
                    UserImage: item?.UserImage,
                    UserName: item?.UserName,
                    Description: item?.Description
                  })
                }
              })
            }
            if (attachdata?.length == 0) {
              ImagesInfo.push({
                ImageName: Attach?.FileName,
                ImageUrl: Attach?.ServerRelativeUrl,
                UploadeDate: '',
                UserImage: null,
                UserName: null
              })
            }
    
    
          });
    
          ImagesInfo = ImagesInfo;
    
        }
        return ImagesInfo;
      }
    const GetUserObjectFromCollection = (UsersValues: any) => {
        let userDeatails = [];
        for (let index = 0; index < UsersValues?.length; index++) {
            let senderObject = taskUsers?.filter(function (user: any, i: any) {
                if (user?.AssingedToUser != undefined) {
                    return user?.AssingedToUser["Id"] == UsersValues[index]?.Id
                }
            });
            if (senderObject.length > 0) {
                userDeatails.push({
                    'Id': senderObject[0]?.AssingedToUser.Id,
                    'Name': senderObject[0]?.Email,
                    'Suffix': senderObject[0]?.Suffix,
                    'Title': senderObject[0]?.Title,
                    'userImage': senderObject[0]?.Item_x0020_Cover?.Url,
                    'activeimg2': UsersValues[index]?.workingMember ? UsersValues[index]?.workingMember : "",
                })
            }

        }
        return userDeatails;
    }
    //==========team member pophover function
    const handleSuffixHover = () => {
        setDisplay('block')
    }
    const handleuffixLeave = () => {
        setDisplay('none')
    }


    //========== image display in popup function============ 
    const OpenModal = (e: any, item: any) => {
        if (item.Url != undefined) {
            item.ImageUrl = item?.Url;
        }
        e.preventDefault();

        setOpenModelImg({
            ...openModelImg,
            isModalOpen: true,
            imageInfo: item,
            showPopup: 'block'
        });
    }
    const CloseModal = (e: any) => {
        e.preventDefault();
        setOpenModelImg({
            ...openModelImg,
            isModalOpen: false,
            imageInfo: {
                ImageName:"",
                ImageUrl:""},
            showPopup: 'none'
        });
    }

    //================================ taskfeedbackcard===============
    const showhideCommentBox = (index: any) => {
        if (feedbackpopup.showcomment == 'none') {
            setfeedbackpopup({
                ...feedbackpopup,
                showcomment: 'block',
                showhideCommentBoxIndex: index,
                showcomment_subtext: 'none',
                subchildcomment: null,
            });
        }
        else {
            setfeedbackpopup({
                ...feedbackpopup,
                showcomment: 'block',
                showhideCommentBoxIndex: index,
                showcomment_subtext: 'none',
                subchildcomment: null,
            });
        }
    }
    const handleInputChange = (e: any) => {
        setCommenttoPost(e.target.value);
    }
    const SubtextPostButtonClick = async (j: any, parentIndex: any) => {
        let txtComment = commenttoPost;
        if (txtComment != '') {
            let temp: any = {
                AuthorImage: currentUser != null && currentUser.length > 0 ? currentUser[0]['userImage'] : "",
                AuthorName: currentUser != null && currentUser.length > 0 ? currentUser[0]['Title'] : "",
                // Created: new Date().toLocaleString('default', { day:'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
                Created: moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
                Title: txtComment,
                // isApprovalComment:this.state.ApprovalCommentcheckbox,
                // isShowLight:this.props?.feedback?.Subtext[j].isShowLight!=undefined?this.props?.feedback?.Subtext[j].isShowLight:""
            };

            //Add object in feedback

            if (resultData["FeedBack"][0]?.FeedBackDescriptions[parentIndex]["Subtext"][j].Comments != undefined) {
                resultData["FeedBack"][0]?.FeedBackDescriptions[parentIndex]["Subtext"][j].Comments.unshift(temp);
            }
            else {
                resultData["FeedBack"][0].FeedBackDescriptions[parentIndex]["Subtext"][j]['Comments'] = [temp];
            }
            (document.getElementById('txtCommentSubtext') as HTMLTextAreaElement).value = '';
            setfeedbackpopup({
                ...feedbackpopup,
                showcomment_subtext: 'none'
            });
            await onPost();
            // sunchildcomment=null
            setfeedbackpopup({
                ...feedbackpopup,
                showcomment: 'none',
                showhideCommentBoxIndex: null,
                showcomment_subtext: 'none',
                subchildcomment: null, 
               subchildParentIndex: null

            })
        } else {
            alert('Please input some text.')
        }


    }
    const onPost = async () => {
       let web = new Web(props?.props?.siteUrl);
        const i = await web.lists
            .getById(AllListId?.MasterTaskListID)
            // .getById(this.props.SiteTaskListID)
            .items
            .getById(resultData?.Id)
            .update({
                FeedBack: JSON.stringify(resultData?.FeedBack)
            })
            .then(() =>{
              GetResult();
            })

            // setUpdateComment((prev)=>true);

    }

    const PostButtonClick = (fbData: any, i: any) => {

        let txtComment = commenttoPost;
        if (txtComment != '') {
            //  var date= moment(new Date()).format('dd MMM yyyy HH:mm')
            var temp: any = {
                AuthorImage: currentUser != null && currentUser?.length > 0 ? currentUser[0]['userImage'] : "",
                AuthorName: currentUser != null && currentUser.length > 0 ? currentUser[0]['Title'] : "",
                // Created: new Date().toLocaleString('default',{ month: 'short',day:'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
                Created: moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
                Title: txtComment,
                // isApprovalComment:this.state.ApprovalCommentcheckbox,
                // isShowLight:this.props?.feedback?.isShowLight?this.props?.feedback?.isShowLight:""
            };
            if (fbData["Comments"] != undefined) {
                fbData["Comments"].unshift(temp);
            }
            else {
                fbData["Comments"] = [temp];
            }
            (document.getElementById('txtComment') as HTMLTextAreaElement).value = '';
            setfeedbackpopup({
                ...feedbackpopup,
                showcomment: 'none',

            });
            setCommenttoPost("")
            onPost();
            setfeedbackpopup({
                ...feedbackpopup,
                showhideCommentBoxIndex: null
            })

        }
        else {
            alert('Please input some text.')
        }
    }
    const showhideCommentBoxOfSubText=(j: any, parentIndex: any)=> {
        // sunchildcomment = j;
    
        if (feedbackpopup?.showcomment_subtext == 'none') {
            setfeedbackpopup({...feedbackpopup,
            showcomment_subtext: 'block',
            subchildcomment: j,
            subchildParentIndex: parentIndex,
            showcomment: 'none',
            showhideCommentBoxIndex: null
    
          });
        }
        else {
            setfeedbackpopup({...feedbackpopup,
            showcomment_subtext: 'block',
            subchildcomment: j,
            subchildParentIndex: parentIndex,
            showcomment: 'none',
            showhideCommentBoxIndex: null
    
          });
        }
      }

      // =========delete comment function=========
      const clearComment=(isSubtextComment: any, indexOfDeleteElement: any, indexOfSubtext: any, parentindex: any)=> {
        if (confirm("Are you sure, you want to delete this?")) {
          if (isSubtextComment) {
            resultData["FeedBack"][0]?.FeedBackDescriptions[parentindex]["Subtext"][indexOfSubtext]?.Comments?.splice(indexOfDeleteElement, 1)
          } else {
            resultData["FeedBack"][0]?.FeedBackDescriptions[parentindex]["Comments"]?.splice(indexOfDeleteElement, 1);
          }
          onPost();
        }
    
      }

      //============openedit popup=======
      const openEditModal=(comment: any, indexOfUpdateElement: any, indexOfSubtext: any, isSubtextComment: any, parentIndex: any)=> {
        setEditPopupData({...editpopupData,
          isEditModalOpen: true,
          CommenttoUpdate: comment?.Title,
          updateCommentText: {
            'comment': comment?.Title,
            'indexOfUpdateElement': indexOfUpdateElement,
            'indexOfSubtext': indexOfSubtext,
            'isSubtextComment': isSubtextComment,
            "data": comment,
            "parentIndexOpeneditModal": parentIndex
          }
        })
      }
    
      const  onRenderCustomHeadereditcomment = () => {
        return (
          <>
    
            <div className='ps-4 siteColor subheading' >
              Update Comment
            </div>
          
          </>
        );
      };
      const  Closecommentpopup=()=>{
        setEditPopupData({...editpopupData,
          isModalOpen: false,
          isEditModalOpen:false,
          isEditReplyModalOpen: false,
          imageInfo: {},
    
          showPopup: 'none'
        });
      }

      //====update comment function======
      const updateCommentfunction=()=> {
        let txtComment =editpopupData?.CommenttoUpdate
    
        if (txtComment != '') {
          let temp: any = {
            AuthorImage: currentUser != null && currentUser.length > 0 ? currentUser[0]['userImage'] : "",
            AuthorName: currentUser != null && currentUser.length > 0 ? currentUser[0]['Title'] : "",
            Created: moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
            Title: txtComment
          };
    
          if (editpopupData?.isEditReplyModalOpen) {
            var EditReplyData = editpopupData?.updateReplyCommentText;
            if (EditReplyData?.isSubtextComment) {
              let feedback = resultData["FeedBack"][0]?.FeedBackDescriptions[EditReplyData?.parentIndexOpeneditModal].Subtext[EditReplyData?.indexOfSubtext].Comments[EditReplyData?.indexOfUpdateElement].ReplyMessages[EditReplyData?.replyIndex];
              feedback.Title = editpopupData?.CommenttoUpdate;
            } else {
              let feedback = resultData["FeedBack"][0]?.FeedBackDescriptions[EditReplyData?.parentIndexOpeneditModal].Comments[EditReplyData?.indexOfUpdateElement].ReplyMessages[EditReplyData?.replyIndex];
              feedback.Title = editpopupData?.CommenttoUpdate;
            }
          } else {
            if (editpopupData.updateCommentText?.data?.isApprovalComment) {
              temp.isApprovalComment = editpopupData?.updateCommentText?.data?.isApprovalComment;
              temp.isShowLight = editpopupData?.updateCommentText?.data?.isShowLight
              temp.ApproverData = editpopupData?.updateCommentText?.data?.ApproverData;
            }
            if (editpopupData?.updateCommentText?.isSubtextComment) {
              // this.props.feedback.Subtext[this.state.updateCommentText['indexOfSubtext']]['Comments'][this.state.updateCommentText['indexOfUpdateElement']] = temp;
            resultData["FeedBack"][0].FeedBackDescriptions[editpopupData?.updateCommentText?.parentIndexOpeneditModal].Subtext[editpopupData.updateCommentText['indexOfSubtext']]['Comments'][editpopupData?.updateCommentText['indexOfUpdateElement']].Title = temp.Title
    
            }
            else {
              // this.props.feedback["Comments"][this.state.updateCommentText['indexOfUpdateElement']] = temp;
              resultData["FeedBack"][0].FeedBackDescriptions[editpopupData?.updateCommentText?.parentIndexOpeneditModal]["Comments"][editpopupData?.updateCommentText['indexOfUpdateElement']].Title = temp.Title
            }
          }
        onPost();
        }
        setEditPopupData({...editpopupData,
          isEditModalOpen: false,
          updateCommentText: { 'comment': '',
          'indexOfUpdateElement': null,
          'indexOfSubtext': null,
          'isSubtextComment':null,
          "data": null,
          "parentIndexOpeneditModal": null},
          CommenttoUpdate: '',
          isEditReplyModalOpen: false,
          currentDataIndex: 0,
          replyTextComment: '',
          updateReplyCommentText: { 'comment': '',
          'indexOfUpdateElement': null,
          'indexOfSubtext': null,
          'isSubtextComment': "",
          'replyIndex': null,
          "data": null,
          "parentIndexOpeneditModal": null}
        });
      }
 //==========anc callback=========
 const  AncCallback = (type: any) => {
    switch (type) {
      case 'anc': {
        relevantDocRef?.current?.loadAllSitesDocuments()
        break
      }
      case 'smartInfo': {
        smartInfoRef?.current?.GetResult();
        break
      }
      default: {
        relevantDocRef?.current?.loadAllSitesDocuments()
        smartInfoRef?.current?.GetResult();
        break
      }
    }
  }
  //=========reply section=============
  const openReplycommentPopup = (i: any, k: any) => {
    setEditPopupData({...editpopupData,
      currentDataIndex: i + "" + k,
      isCalloutVisible: true
    })
  }
  const openReplySubcommentPopup = (i: any, j: any, k: any) => {
    setEditPopupData({...editpopupData,
      currentDataIndex: +i + '' + j + k,
      isCalloutVisible: true
    })
  }
  const SaveReplyMessageFunction = () => {
    let txt: any = editpopupData.replyTextComment;
    console.log(editpopupData.currentDataIndex)
    let txtComment: any = editpopupData.replyTextComment;
    if (txtComment != '') {
      //  var date= moment(new Date()).format('dd MMM yyyy HH:mm')
      var temp: any =
      {
        AuthorImage: currentUser != null && currentUser?.length > 0 ? currentUser[0]['userImage'] : "",
        AuthorName: currentUser != null && currentUser.length > 0 ?currentUser[0]['Title'] : "",
        Created: moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
        Title: txtComment,

      };
      let index: any = editpopupData.currentDataIndex.split('');

      if (index.length == 2) {
        let parentIndex = parseInt(index[0])
        let commentIndex = parseInt(index[1])
        let feedback = resultData["FeedBack"][0]?.FeedBackDescriptions[parentIndex].Comments[commentIndex];

        if (feedback.ReplyMessages == undefined) {
          feedback.ReplyMessages = []
          feedback.ReplyMessages.push(temp)
        } else {
          feedback.ReplyMessages.push(temp)
        }

      }
      if (index.length == 3) {
        let parentIndex = parseInt(index[0])
        let subcomentIndex = parseInt(index[1])
        let commentIndex = parseInt(index[2])
        let feedback = resultData["FeedBack"][0]?.FeedBackDescriptions[parentIndex].Subtext[subcomentIndex].Comments[commentIndex];

        if (feedback.ReplyMessages == undefined) {
          feedback.ReplyMessages = []
          feedback.ReplyMessages.push(temp)
        } else {
          feedback.ReplyMessages.push(temp)
        }

      }
      console.log(temp)
      onPost();

      setEditPopupData({...editpopupData,
        isCalloutVisible: false,
        replyTextComment: "",
        currentDataIndex: 0
      })


    } else {
      alert('Please input some text.')
    }

  }
    // =========clearReplycomment===========
    const  clearReplycomment=(isSubtextComment: any, indexOfDeleteElement: any, indexOfSubtext: any, parentindex: any, replyIndex: any) =>{
        if (confirm("Are you sure, you want to delete this?")) {
          if (isSubtextComment) {
           resultData["FeedBack"][0]?.FeedBackDescriptions[parentindex]["Subtext"][indexOfSubtext]?.Comments[indexOfDeleteElement]?.ReplyMessages?.splice(replyIndex, 1)
          } else {
            resultData["FeedBack"][0]?.FeedBackDescriptions[parentindex]["Comments"][indexOfDeleteElement]?.ReplyMessages?.splice(replyIndex, 1);
          }
          onPost();
        }
    
      }
      const  EditReplyComment=(comment: any, indexOfUpdateElement: any, indexOfSubtext: any, isSubtextComment: any, parentIndex: any, replyIndex: any) =>{
        setEditPopupData({...editpopupData,
          isEditReplyModalOpen: true,
          CommenttoUpdate: comment?.Title,
          // replyTextComment:comment?.Title,
          updateReplyCommentText: {
            'comment': comment?.Title,
            'indexOfUpdateElement': indexOfUpdateElement,
            'indexOfSubtext': indexOfSubtext,
            'isSubtextComment': isSubtextComment,
            'replyIndex': replyIndex,
            "data": comment,
            "parentIndexOpeneditModal": parentIndex
          }
        })
      }

      //=============== tag task disscon with meeting----------
      const tagAndCreateCallBack = React.useCallback(async (tagTask:any) => {
        console.log(tagTask)
        if(tagTask!=undefined){
          let meetingTagTask:any=[]
        
          if(resultDatabackup?.Sitestagging?.length>0){
            resultDatabackup?.Sitestagging?.map((data:any)=>{
              meetingTagTask.push(data)
            })
            
          }
            meetingTagTask=meetingTagTask.concat(tagTask);
          
          
          let web = new Web(props?.props?.siteUrl);
          const i = await web.lists
              .getById(AllListId?.MasterTaskListID)
       
              .items
              .getById(resultDatabackup.Id)
              .update({
                Sitestagging: JSON.stringify(meetingTagTask.length>0?meetingTagTask:null)
              });
  
              GetResult();
        }
       
   
      }, []);
      const closeMeetingPopupFunction = () => {

        GetResult();
    
        setshowMeetingPopup(false);
    
      }
    return (
        <>
          <mycontextValue.Provider value={{ ...mycontextValue, AllListId: AllListId, Context: props?.props?.Context,  currentUser: currentUser, taskUsers: taskUsers }}>
            <div>
              {console.log("resultData",resultData)}
                <section className='row'>
                    <h2 className="heading d-flex ps-0 justify-content-between align-items-center">
                        <span>
                            {/* {resultData["SiteIcon"] != "" && <img className="imgWid29 pe-1 " title={resultData?.siteType} src={resultData["SiteIcon"]} />}
                            {resultData["SiteIcon"] === "" && <img className="imgWid29 pe-1 " src="" />} */}
                            <span className='popover__wrapper ms-1' data-bs-toggle="tooltip" data-bs-placement="auto">
                                <span >
                                    {resultData['Title']}</span>
                                {/* <span className="f-13 popover__content" >
                                    {resultData['Title']}
                                </span> */}
                            </span>
                            <a className="hreflink" title='Edit'
                              onClick={() => setshowMeetingPopup(true)}
                            > <span className='svg__iconbox svg__icon--edit'></span></a>

                        </span>
                     {resultData.Id!=null&& <span>< TagTaskToProjectPopup   projectItem={resultData}
                                  className="ms-2"
                                  meetingPages={true}
                                  projectId={resultData.ID}
                                  AllListId={AllListId}
                                  callBack={tagAndCreateCallBack}
                                  projectTitle={resultData.Title}/> </span>}
                    </h2>
                </section>
            
            </div>
                                
            <div className='row'>
                <section className='col-9 ps-0'>
                    <div className='team_member row'>
                        <div className='col-6'>
                        <dl>
                    <dt className='bg-Fa'>Meeting Date</dt>
                    <dd className='bg-Ff'>{resultData["DueDate"] != null && resultData["DueDate"] != undefined ? moment(resultData["DueDate"]).format("DD/MM/YYYY") : ''}</dd>
                  </dl>
                          
                        </div>
                        <div className='col-6'>
                            <dl>
                                <dt className='bg-Fa'>Team Members</dt>
                                <dd className='bg-Ff'>
                                    <div className="d-flex align-items-center">
                                        {resultData["TeamLeader"] != null && resultData["TeamLeader"].length > 0 && resultData["TeamLeader"]?.map((rcData: any, i: any) => {
                                            return <div className="user_Member_img"><a href={`${resultData["siteUrl"]}/SitePages/TaskDashboard.aspx?UserId=${rcData?.Id}&Name=${rcData?.Title}`} target="_blank" data-interception="off" title={rcData?.Title}>
                                                {rcData.userImage != null && <img className="workmember" src={rcData?.userImage}></img>}
                                                {rcData.userImage == null && <span className="workmember bg-fxdark" >{rcData?.Suffix}</span>}
                                            </a>
                                            </div>
                                        })}
                                        {resultData["TeamLeader"] != null && resultData["TeamLeader"].length > 0 &&
                                            <div></div>
                                        }

                                        {resultData["TeamMembers"] != null && resultData["TeamMembers"].length > 0 &&
                                            <div className="img  "><a href={`${resultData["siteUrl"]}/SitePages/TaskDashboard.aspx?UserId=${resultData["TeamMembers"][0]?.Id}&Name=${resultData["TeamMembers"][0]?.Title}`} target="_blank" data-interception="off" title={resultData["TeamMembers"][0]?.Title}>
                                                {resultData["TeamMembers"][0].userImage != null && <img className={`workmember ${resultData["TeamMembers"][0].activeimg2}`} src={resultData["TeamMembers"][0]?.userImage}></img>}
                                                {resultData["TeamMembers"][0].userImage == null && <span className={`workmember ${resultData["TeamMembers"][0].activeimg2}bg-fxdark border bg-e9 p-1 `} >{resultData["TeamMembers"][0]?.Suffix}</span>}
                                            </a>
                                            </div>
                                        }

                                        {resultData["TeamMembers"] != null && resultData["TeamMembers"].length == 2 && <div className="img mx-2"><a href={`${resultData["siteUrl"]}/SitePages/TaskDashboard.aspx?UserId=${resultData["TeamMembers"][1]?.Id}&Name=${resultData["TeamMembers"][1]?.Title}`} target="_blank" data-interception="off" title={resultData["TeamMembers"][1]?.Title}>
                                            {resultData["TeamMembers"][1]?.userImage != null && <img className={`workmember ${resultData["TeamMembers"][1]?.activeimg2}`} src={resultData["TeamMembers"][1]?.userImage}></img>}
                                            {resultData["TeamMembers"][1]?.userImage == null && <span className={`workmember ${resultData["TeamMembers"][1]?.activeimg2}bg-fxdark border bg-e9 p-1`} >{resultData["TeamMembers"][1]?.Suffix}</span>}
                                        </a>
                                        </div>
                                        }
                                        {resultData["TeamMembers"] != null && resultData["TeamMembers"].length > 2 &&
                                            <div className="position-relative user_Member_img_suffix2"
                                                onMouseOver={(e) => handleSuffixHover()}
                                                onMouseLeave={(e) => handleuffixLeave()}
                                            >
                                                +
                                                {resultData["TeamMembers"].length - 1}
                                                <span className="tooltiptext"
                                                    style={{ display: display, padding: '10px' }}
                                                >
                                                    <div>
                                                        {resultData["TeamMembers"].slice(1)?.map((rcData: any, i: any) => {

                                                            return <div className=" mb-1 team_Members_Item" style={{ padding: '2px' }}>
                                                                <a href={`${resultData["siteUrl"]}/SitePages/TaskDashboard.aspx?UserId=${rcData?.Id}&Name=${rcData?.Title}`} target="_blank" data-interception="off">

                                                                    {rcData?.userImage != null && <img className={`workmember ${rcData?.activeimg2}`} src={rcData?.userImage}></img>}
                                                                    {rcData?.userImage == null && <span className={`workmember ${rcData?.activeimg2}bg-fxdark border bg-e9 p-1`}>{rcData?.Suffix}</span>}

                                                                    <span className='mx-2'>{rcData?.Title}</span>
                                                                </a>
                                                            </div>

                                                        })
                                                        }

                                                    </div>
                                                </span>
                                            </div>
                                        }

                                    </div>

                                </dd>
                            </dl>
                        </div>
                    </div>
                    <div className="col mt-2">
                        <div className="Taskaddcomment row">
                            {resultData?.BasicImageInfo != null && resultData?.BasicImageInfo.length > 0 ?
                                <div className="bg-white col-sm-4 mt-4 pe-0">
                                {resultData?.BasicImageInfo != null || resultData?.BasicImageInfo != '' ? resultData?.BasicImageInfo?.map((imgData: any, i: any) => {
                                    return (
                                    <div className="taskimage border mb-3 mt-2">


                                        <a className='images' target="_blank" data-interception="off" href={imgData?.ImageUrl}>
                                            <img alt={imgData?.ImageName} src={imgData?.ImageUrl}
                                                onMouseOver={(e) => OpenModal(e, imgData)}
                                                onMouseOut={(e) => CloseModal(e)}
                                            >

                                            </img>
                                        </a>


                                        <div className="Footerimg d-flex align-items-center bg-fxdark justify-content-between p-1 ">
                                            <div className='usericons'>
                                                <span>
                                                    <span >{imgData?.UploadeDate}</span>
                                                    <span className='round px-1'>
                                                        {imgData?.UserImage != null &&
                                                            <img className='align-self-start' title={imgData?.UserName} src={imgData?.UserImage} />
                                                        }
                                                    </span>
                                                    {imgData?.Description != undefined && imgData?.Description != "" && <span title={imgData?.Description} className="mx-1" >
                                                        <BiInfoCircle />
                                                    </span>}

                                                </span>
                                            </div>
                                            <div className="expandicon">

                                                <span >
                                                    {imgData?.ImageName?.length > 15 ? imgData?.ImageName.substring(0, 15) + '...' : imgData?.ImageName}
                                                </span>
                                                <span>|</span>
                                                <a className='images' title="Expand Image" target="_blank" data-interception="off" href={imgData?.ImageUrl}><span className='mx-2'><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M212.686 315.314L120 408l32.922 31.029c15.12 15.12 4.412 40.971-16.97 40.971h-112C10.697 480 0 469.255 0 456V344c0-21.382 25.803-32.09 40.922-16.971L72 360l92.686-92.686c6.248-6.248 16.379-6.248 22.627 0l25.373 25.373c6.249 6.248 6.249 16.378 0 22.627zm22.628-118.628L328 104l-32.922-31.029C279.958 57.851 290.666 32 312.048 32h112C437.303 32 448 42.745 448 56v112c0 21.382-25.803 32.09-40.922 16.971L376 152l-92.686 92.686c-6.248 6.248-16.379 6.248-22.627 0l-25.373-25.373c-6.249-6.248-6.249-16.378 0-22.627z"></path></svg></span></a>
                                            </div>

                                        </div>

                                    </div>
                                )}):null}
                            </div>
                                :null
                            }
                            {/*feedback comment section code */}
                            <div className={resultData?.BasicImageInfo != null && resultData?.BasicImageInfo?.length > 0 ? "col-sm-8 pe-0 mt-2" : "col-sm-12 pe-0 mt-2"}>
                                {/* {resultData["TaskType"] != null && (resultData["TaskType"] == '' ||
                                    resultData["TaskType"] == 'Task' || resultData["TaskType"] == "Workstream" || resultData["TaskType"] == "Activities") && resultData["FeedBack"] != undefined && resultData["FeedBack"].length > 0 && resultData["FeedBack"][0].FeedBackDescriptions != undefined && */}
                                    {resultData!=undefined &&resultData?.FeedBack?.length>0 && resultData?.FeedBack[0]?.FeedBackDescriptions?.length > 0 &&
                                    resultData?.FeedBack[0]?.FeedBackDescriptions[0]?.Title != '' &&
                                    <div className={"Addcomment " + "manage_gap"}>
                                        {resultData["FeedBack"][0]?.FeedBackDescriptions?.map((fbData: any, i: any) => {
                                            let userdisplay: any = [];
                                            userdisplay.push({ Title: props?.props?.userDisplayName })


                                            if (fbData != null && fbData != undefined && fbData?.Title != "") {

                                                try {
                                                    if (fbData?.Title != undefined) {
                                                        fbData.Title = fbData?.Title?.replace(/\n/g, '<br/>');

                                                    }
                                                } catch (e) {
                                                }
                                                return (
                                                    <>
                                                        <div>

                                                            <div className="col mb-2">
                                                                <div className='d-flex justify-content-end'>

                                                                    <div className='pb-1'>
                                                                        <span className="d-block">
                                                                            <a style={{ cursor: 'pointer' }}
                                                                                onClick={(e) => showhideCommentBox(i)}
                                                                            >Add Comment</a>
                                                                        </span>
                                                                    </div>
                                                                </div>


                                                                <div className="d-flex p-0 FeedBack-comment ">
                                                                    <div className="border p-1 me-1">
                                                                        <span>{i + 1}.</span>
                                                                        <ul className='list-none'>
                                                                            <li>
                                                                                {fbData['Completed'] != null && fbData['Completed'] &&

                                                                                    <span ><img className="wid10" style={{ width: '10px' }} src='https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/siteIcons/Completed.png'></img></span>
                                                                                }
                                                                            </li>
                                                                            <li>
                                                                                {fbData['HighImportance'] != null && fbData['HighImportance'] &&
                                                                                    <span ><img className="wid10" style={{ width: '10px' }} src='https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/siteIcons/highPriorty.png'></img></span>
                                                                                }
                                                                            </li>
                                                                            <li>
                                                                                {fbData['LowImportance'] != null && fbData['LowImportance'] &&
                                                                                    <span ><img className="wid10" style={{ width: '10px' }} src='https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/siteIcons/lowPriority.png'></img></span>
                                                                                }
                                                                            </li>
                                                                            <li>
                                                                                {fbData['Phone'] != null && fbData['Phone'] &&
                                                                                    <span ><img className="wid10" style={{ width: '10px' }} src='https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/siteIcons/Phone.png'></img></span>
                                                                                }
                                                                            </li>
                                                                        </ul>
                                                                    </div>

                                                                    <div className="border p-2 full-width text-break"
                                                                        title={fbData.ApproverData != undefined && fbData?.ApproverData.length > 0 ? fbData.ApproverData[fbData.ApproverData.length - 1].isShowLight : ""}>

                                                                        <span dangerouslySetInnerHTML={{ __html: fbData?.Title?.replace(/\n/g, "<br />") }}></span>
                                                                        <div className="col">
                                                                            {fbData['Comments'] != null && fbData['Comments']?.length > 0 && fbData['Comments']?.map((fbComment: any, k: any) => {
                                                                                return <div className={fbComment.isShowLight != undefined && fbComment.isApprovalComment ? `col add_cmnt my-1 ${fbComment.isShowLight}` : "col add_cmnt my-1"}>
                                                                                    <div className="">
                                                                                        <div className="d-flex p-0">
                                                                                            <div className="col-1 p-0">
                                                                                                <img className="workmember" src={fbComment?.AuthorImage != undefined && fbComment?.AuthorImage != '' ?
                                                                                                    fbComment.AuthorImage : "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg"} />
                                                                                            </div>
                                                                                            <div className="col-11 pe-0" >
                                                                                                <div className='d-flex justify-content-between align-items-center'>
                                                                                                    {fbComment?.AuthorName} - {fbComment?.Created}
                                                                                                    <span className='d-flex'>
                                                                                                        <a className="ps-1" title="Comment Reply" >
                                                                                                            <div data-toggle="tooltip"
                                                                                                                 id={buttonId + "-" + i + k}
                                                                                                                  onClick={() => openReplycommentPopup(i, k)}
                                                                                                                data-placement="bottom"
                                                                                                            >
                                                                                                                <ImReply />
                                                                                                            </div>
                                                                                                        </a>
                                                                                                        <a title='Edit'
                                                                                                        onClick={() => openEditModal(fbComment, k, 0, false, i)}
                                                                                                        >
                                                                                                            <span className='svg__iconbox svg__icon--edit'></span>
                                                                                                        </a>
                                                                                                        <a title='Delete'
                                                                                                        onClick={() => clearComment(false, k, 0, i)}
                                                                                                        >
                                                                                                            <span className='svg__iconbox svg__icon--trash'></span></a>
                                                                                                    </span>
                                                                                                </div>
                                                                                                <div><span dangerouslySetInnerHTML={{ __html: fbComment?.Title.replace(/\n/g, "<br />") }}></span></div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-12 ps-3 pe-0">
                                                                                            {fbComment?.ReplyMessages != undefined && fbComment?.ReplyMessages.length > 0 && fbComment?.ReplyMessages?.map((replymessage: any, index: any) => {
                                                                                                return (
                                                                                                    <div className="d-flex border ms-3 p-2  mb-1">
                                                                                                        <div className="col-1 p-0 mx-1">
                                                                                                            <img className="workmember" src={replymessage?.AuthorImage != undefined && replymessage?.AuthorImage != '' ?
                                                                                                                replymessage.AuthorImage : "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg"} />
                                                                                                        </div>
                                                                                                        <div className="col-11 pe-0" >
                                                                                                            <div className='d-flex justify-content-between align-items-center'>
                                                                                                                {replymessage?.AuthorName} - {replymessage?.Created}
                                                                                                                <span className='d-flex'>
                                                                                                                    <a title='Edit'
                                                                                                                      onClick={() => EditReplyComment(replymessage, k, 0, false, i, index)}

                                                                                                                    >
                                                                                                                        <span className='svg__iconbox svg__icon--edit'></span>
                                                                                                                    </a>
                                                                                                                    <a title='Delete'
                                                                                                                      onClick={() => clearReplycomment(false, k, 0, i, index)}

                                                                                                                    >
                                                                                                                        <span className='svg__iconbox svg__icon--trash'></span></a>
                                                                                                                </span>
                                                                                                            </div>
                                                                                                            <div><span dangerouslySetInnerHTML={{ __html: replymessage?.Title.replace(/\n/g, "<br />") }}></span></div>
                                                                                                        </div>
                                                                                                    </div>

                                                                                                )
                                                                                            })}
                                                                                        </div>
                                                                                    </div>


                                                                                </div>


                                                                            })}
                                                                        </div>

                                                                    </div>
                                                                </div>
                                                                {feedbackpopup.showhideCommentBoxIndex == i && <div className="align-items-center d-flex"style={{ display: feedbackpopup.showcomment }}>
                                                                   
                                                                        <textarea id="txtComment" onChange={(e) => handleInputChange(e)} className="form-control full-width"></textarea>
                                                                        <button type="button" className="btn-primary btn ms-2" onClick={() => PostButtonClick(fbData, i)}>Post</button>
                                                                    

                                                                </div>}

                                                            </div>

                                                            {fbData['Subtext'] != null && fbData['Subtext'].length > 0 && fbData['Subtext']?.map((fbSubData: any, j: any) => {
                                                                return <div className="col-sm-12 p-0 mb-2" style={{ width: '100%' }}>
                                                                    <div className='d-flex justify-content-end'>

                                                                        <div>
                                                                            <span className="d-block text-end">
                                                                                <a style={{ cursor: 'pointer' }}
                                                                                onClick={(e) =>showhideCommentBoxOfSubText(j, i)}
                                                                                >Add Comment</a>
                                                                            </span>
                                                                        </div>
                                                                    </div>

                                                                    <div className="d-flex pe-0 FeedBack-comment">
                                                                        <div className="border p-1 me-1">
                                                                            <span >{i + 1}.{j + 1}</span>
                                                                            <ul className="list-none">
                                                                                <li>
                                                                                    {fbSubData?.Completed != null && fbSubData?.Completed &&
                                                                                        <span ><img className="wid10" style={{ width: '10px' }} src='https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/siteIcons/Completed.png'></img></span>
                                                                                    }
                                                                                </li>
                                                                                <li>
                                                                                    {fbSubData?.HighImportance != null && fbSubData?.HighImportance &&
                                                                                        <span ><img className="wid10" style={{ width: '10px' }} src='https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/siteIcons/highPriorty.png'></img></span>
                                                                                    }
                                                                                </li>
                                                                                <li>
                                                                                    {fbSubData?.LowImportance != null && fbSubData?.LowImportance &&
                                                                                        <span><img className="wid10" style={{ width: '10px' }} src='https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/siteIcons/lowPriority.png'></img></span>
                                                                                    }
                                                                                </li>
                                                                                <li>
                                                                                    {fbSubData?.Phone != null && fbSubData?.Phone &&
                                                                                        <span ><img className="wid10" style={{ width: '10px' }} src='https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/siteIcons/Phone.png'></img></span>
                                                                                    }
                                                                                </li>
                                                                            </ul>
                                                                        </div>

                                                                        <div className="border p-2 full-width text-break"
                                                                            title={fbSubData?.ApproverData != undefined && fbSubData?.ApproverData?.length > 0 ? fbSubData?.ApproverData[fbSubData?.ApproverData.length - 1]?.isShowLight : ""}>
                                                                            <span ><span dangerouslySetInnerHTML={{ __html: fbSubData?.Title?.replace(/\n/g, "<br />") }}></span></span>
                                                                            <div className="feedbackcomment col-sm-12 PadR0 mt-10">
                                                                                {fbSubData?.Comments != null && fbSubData.Comments.length > 0 && fbSubData?.Comments?.map((fbComment: any, k: any) => {
                                                                                    return <div className={fbComment?.isShowLight != undefined && fbComment.isApprovalComment ? `col-sm-12  mb-2 add_cmnt my-1 ${fbComment?.isShowLight}` : "col-sm-12  mb-2 add_cmnt my-1 "}>
                                                                                        <div className="">
                                                                                            <div className="d-flex p-0">
                                                                                                <div className="col-sm-1 padL-0 wid35">
                                                                                                    <img className="workmember" src={fbComment?.AuthorImage != undefined && fbComment?.AuthorImage != '' ?
                                                                                                        fbComment.AuthorImage : "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg"} />
                                                                                                </div>
                                                                                                <div className="col-sm-11 pad0" key={k}>
                                                                                                    <div className="d-flex justify-content-between align-items-center">
                                                                                                        {fbComment?.AuthorName} - {fbComment?.Created}
                                                                                                        <span className='d-flex'>
                                                                                                            <a className="ps-1" title="Comment Reply" >
                                                                                                                <div data-toggle="tooltip"
                                                                                                                      id={buttonId + "-" + i + j + k}
                                                                                                                    onClick={() => openReplySubcommentPopup(i, j, k)}
                                                                                                                    data-placement="bottom"
                                                                                                                >
                                                                                                                    <ImReply />
                                                                                                                </div>
                                                                                                            </a>
                                                                                                            <a title="Edit"
                                                                                                              onClick={() => openEditModal(fbComment, k, j, true, i)}
                                                                                                            >

                                                                                                                <span className='svg__iconbox svg__icon--edit'></span>
                                                                                                            </a>
                                                                                                            <a title='Delete'
                                                                                                              onClick={() => clearComment(true, k, j, i)}
                                                                                                            ><span className='svg__iconbox svg__icon--trash'></span></a>
                                                                                                        </span>
                                                                                                    </div>
                                                                                                    <div ><span dangerouslySetInnerHTML={{ __html: fbComment?.Title.replace(/\n/g, "<br />") }}></span></div>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-12 ps-3 pe-0">
                                                                                                {fbComment?.ReplyMessages != undefined && fbComment?.ReplyMessages.length > 0 && fbComment?.ReplyMessages?.map((replymessage: any, ReplyIndex: any) => {
                                                                                                    return (
                                                                                                        <div className="d-flex border ms-3 p-2  mb-1">
                                                                                                            <div className="col-1 p-0 mx-1">
                                                                                                                <img className="workmember" src={replymessage?.AuthorImage != undefined && replymessage?.AuthorImage != '' ?
                                                                                                                    replymessage.AuthorImage : "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg"} />
                                                                                                            </div>
                                                                                                            <div className="col-11 pe-0" >
                                                                                                                <div className='d-flex justify-content-between align-items-center'>
                                                                                                                    {replymessage?.AuthorName} - {replymessage?.Created}
                                                                                                                    <span className='d-flex'>
                                                                                                                        <a title='Edit'

                                                                                                                        onClick={() => EditReplyComment(replymessage, k, 0, true, i, ReplyIndex)}

                                                                                                                        >
                                                                                                                            <span className='svg__iconbox svg__icon--edit'></span>
                                                                                                                        </a>
                                                                                                                        <a title='Delete'
                                                                                                                        onClick={() => clearReplycomment(true, k, j, i, ReplyIndex)}

                                                                                                                        >
                                                                                                                            <span className='svg__iconbox svg__icon--trash'></span></a>
                                                                                                                    </span>
                                                                                                                </div>
                                                                                                                <div><span dangerouslySetInnerHTML={{ __html: replymessage?.Title.replace(/\n/g, "<br />") }}></span></div>
                                                                                                            </div>
                                                                                                        </div>

                                                                                                    )
                                                                                                })}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                })}
                                                                            </div>
                                                                        </div>
                                                                       
                                                                    </div>

                                                                    {feedbackpopup?.subchildcomment == j && feedbackpopup?.subchildParentIndex == i &&<div className="align-items-center d-flex"
                                                                        style={{ display: feedbackpopup.showcomment_subtext }} > 
                                                                       
                                                                         <textarea id="txtCommentSubtext" onChange={(e) => handleInputChange(e)} className="form-control full-width" ></textarea>
                                                                                <button type="button" className="btn-primary btn ms-2" onClick={() => SubtextPostButtonClick(j, i)}>Post</button>
                                                                            </div>}
                                                                </div>
                                                            })}
                                                            <div className='imghover' style={{ display: openModelImg?.showPopup }}>
          <div className="popup">
            <div className="parentDiv">
              <span style={{ color: 'white' }}>{openModelImg?.imageInfo["ImageName"]}</span>
              <img style={{ maxWidth: '100%' }} src={openModelImg?.imageInfo["ImageUrl"]}></img>
            </div>
          </div>
        </div>

                                                            <Panel
                                      onRenderHeader={onRenderCustomHeadereditcomment}
                                      isOpen={editpopupData?.isEditModalOpen ? editpopupData?.isEditModalOpen : editpopupData?.isEditReplyModalOpen}
                                      onDismiss={Closecommentpopup}
                                      isBlocking={editpopupData?.isEditModalOpen ? !editpopupData?.isEditModalOpen : !editpopupData?.isEditReplyModalOpen}>
                                      <div className="modal-body">
                                        <div className='col'><textarea id="txtUpdateComment" rows={6} className="full-width" onChange={(e) => setEditPopupData({...editpopupData,CommenttoUpdate:e.target.value})}  >{editpopupData?.CommenttoUpdate}</textarea></div>
                                      </div>
                                      <footer className='modal-footer'>
                                        <button className='btn btn-default ms-1' onClick={Closecommentpopup}>Cancel</button>
                                        <button className="btn btn-primary ms-1" onClick={(e) => updateCommentfunction()}>Save</button>

                                      </footer>


                                    </Panel>


                                                        </div>


                                                    </>
                                                )
                                            }
                                        })}
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                   
                </section>
                <section className='col-3' >
                    <div>
                        <div>
                            {AllListId != null && <CommentCard siteUrl={props?.props?.siteUrl}listName={"Master Tasks"} AllListId={AllListId} Context={props?.props.Context} itemID={AllListId.meetingId}></CommentCard>}

                            {AllListId != null &&<AncTool 
                    item={resultData}
                     callBack={AncCallback} 
                     AllListId={AllListId} Context={props?.props?.Context} />}

                        </div>
                        <div>
                        {AllListId != null&& <SmartInformation
                         ref={smartInfoRef}
                  Id={resultData.Id}
                AllListId={AllListId} 
                Context={props?.props?.Context} 
                taskTitle={resultData?.Title} 
                listName={resultData?.listName}
                 />}</div>
                        <div> 
                {AllListId && <RelevantDocuments ref={relevantDocRef}
                  siteUrl={props?.props.siteUrl}
                   DocumentsListID={props?.props?.DocumentsListID}
                    ID={resultData?.itemId} 
                    siteName={resultData?.listName} 
                    folderName={resultData?.Title} 
                    ></RelevantDocuments>}
                    </div>

                    </div>
                </section>
            </div>
            <div>
            <section>
            <div className='row'>
                    <section className='col-sm-12 ps-0 Alltable'>
                    {resultData?.Sitestagging?.length>0&&<MettingTable data={resultData.Sitestagging}AllListId={AllListId}/>}
                    </section></div>
                     
          
          <div className='row'>
            {/* {this.state.Result?.Portfolio_x0020_Type!=undefined &&<TaskWebparts props={this.state.Result}/>} */}
            {resultData != undefined &&
              <div className="ItemInfo mb-20" style={{ paddingTop: '15px' }}>

                <div>Created <span >{(moment(resultData['Creation']).format('DD MMM YYYY HH:mm '))}</span> by <span className="siteColor">{resultData['Author'] != null &&resultData['Author'].length > 0 && resultData['Author'][0].Title}</span>
                </div>
                <div>Last modified <span >{(moment(resultData['Modified']).format('DD MMM YYYY HH:mm '))}</span> by <span className="siteColor">{resultData['ModifiedBy'] != null && resultData['ModifiedBy'].Title}</span>
                  {/* <div>Last modified <span >{this.ConvertLocalTOServerDate(this.state.Result['Modified'], 'DD MMM YYYY hh:mm')}</span> by <span className="siteColor">{this.state.Result['ModifiedBy'] != null && this.state.Result['ModifiedBy'].Title}</span> */}
                  {/* <span>{this.state.itemID ? <VersionHistoryPopup taskId={this.state.itemID} listId={this.state.Result.listId} siteUrls={this.state.Result.siteUrl} isOpen={this.state.isopenversionHistory} /> : ''}</span> */}
                </div>
              </div>
            }
          </div>
             </section> 
            </div>
            {editpopupData.isCalloutVisible ? (

<FocusTrapCallout
  className='p-2 replyTooltip'
  role="alertdialog"
  // className={this.styles.callout}
  gapSpace={0}
  target={`#${buttonId}-${editpopupData.currentDataIndex}`}
  onDismiss={() => setEditPopupData({...editpopupData,
    isCalloutVisible: false
  })}
  setInitialFocus
>
  <Text block variant="xLarge" className='subheading m-0 f-15' >
    Comment Reply
  </Text>
  <Text block variant="small">
    <div className="d-flex my-2">
      <textarea className="form-control" value={editpopupData.replyTextComment}
     onChange={(e) => setEditPopupData({...editpopupData,
     replyTextComment: e.target.value })}
      ></textarea>
    </div>

  </Text>
  <FocusZone handleTabKey={FocusZoneTabbableElements.all} isCircularNavigation>
    <Stack
      className='modal-footer'
      gap={8} horizontal>

      <button className='btn btn-default'
        onClick={() => setEditPopupData({...editpopupData,
            isCalloutVisible: false
          })}
      >Cancel</button>
      <button className='btn btn-primary'
        onClick={()=>SaveReplyMessageFunction()}
      >Save</button>
    </Stack>
  </FocusZone>
</FocusTrapCallout>

) : null
}
{

   showMeetingPopup ? <MeetingPopupComponent Items={resultData} isShow={showMeetingPopup} listName={"Master Tasks"} closePopup={closeMeetingPopupFunction} /> : null




}
</mycontextValue.Provider>
        </>
    )
}
export default MeetingProfile;
export { mycontextValue }