import * as React from 'react';
import pnp, { Web } from 'sp-pnp-js';
import { FaRegTrashAlt } from "react-icons/fa";
import { Modal, Panel, PanelType } from 'office-ui-fabric-react';
import ImagesC from '../webparts/EditPopupFiles/Image';
import Picker from './EditTaskPopup/SmartMetaDataPicker';
import HtmlEditorCard from './HtmlEditor/HtmlEditor';
import moment from 'moment';
import Tooltip from './Tooltip';
import { Col, Row, Table } from 'react-bootstrap';
// import { CustomToolTip } from '../../../globalComponents/customToolTip';

const itemRanks: any[] = [
    { rankTitle: 'Select Item Rank', rank: '' },
    { rankTitle: '(8) Top Highlights', rank: 8 },
    { rankTitle: '(7) Featured Item', rank: 7 },
    { rankTitle: '(6) Key Item', rank: 6 },
    { rankTitle: '(5) Relevant Item', rank: 5 },
    { rankTitle: '(4) Background Item', rank: 4 },
    { rankTitle: '(2) to be verified', rank: 2 },
    { rankTitle: '(1) Archive', rank: 1 },
    { rankTitle: '(0) No Show', rank: 0 }
]
var AutoCompleteItemsArray: any = [];
var tempShareWebTypeData: any = [];
var userSendAttentionEmails: any = [];
var EditDataBackup: any;
var tempCategoryData: any = "";
var taggingtype: any = '';
const EditEventCardPopup = (props: any) => {
    // const myContextData2: any = React.useContext<any>(myContextValue)
    const baseUrl = props?.allListId?.siteUrl;
    const [imagetab, setImagetab] = React.useState(false);
    const [updateData, setUpdateData]: any = React.useState({});
    const [isVisible, setisVisible] = React.useState("Published");
    const [limitshowActivity, setlimitshowActivity] = React.useState(false);
    const [EditData, setEditData] = React.useState<any>({});
    const [ShareWebTypeData, setShareWebTypeData] = React.useState([]);
    const [IsComponentPicker, setIsComponentPicker] = React.useState(false);
    const [SearchedActivityData, setSearchedActivityData] = React.useState([]);
    const [SearchedTopicData, setSearchedTopicData] = React.useState([]);
    const [SearchedPagesData, setSearchedPagesData] = React.useState([]);
    const [ActivitySearchKey, setActivitySearchKey] = React.useState("");
    const [TopicSearchKey, setTopicSearchKey] = React.useState("");
    const [PagesSearchKey, setPagesSearchKey] = React.useState("");
    const [ShareWebTypeTopicData, setShareWebTypeTopicData] = React.useState([]);
    const [ShareWebTypePagesData, setShareWebTypePagesData] = React.useState([]);
    const [IsSendAttentionMsgStatus, setIsSendAttentionMsgStatus] = React.useState(false);
    const [SendCategoryName, setSendCategoryName] = React.useState("");
    const [CategoriesData, setActivityData] = React.useState("");
    const [imageData, setImageData] = React.useState([]);
    const [generatedHTML, setGeneratedHTML] = React.useState('');
    const [valuechecked, setValuechecked] = React.useState(false);
    const [ShowConfirmation, setShowConfirmation]: any = React.useState(false);
    const [pageUrl, setPageUrl] = React.useState({ Description: '', Url: '' });
    var TaskApproverBackupArray: any = [];
    let callBack = props?.callBack;
    React.useEffect(() => {
        if (props?.usedFor == "SharewebNews" && props?.usedFor != undefined) {
            getNewsData()

        }  if (props?.usedFor == "SharewebEvent" && props?.usedFor != undefined) {
            getEventData()

        }
       


    }, []);
    const getEventData= ()=>{
        let webs = new Web(props?.allListId?.siteUrl);
        webs.lists.getById(props?.allListId[props?.usedFor]).items.getById(props?.EditEventData?.Id)
            .select("Id", "Title","BannerUrl","EventDate","Category","Overbook","Location","EndDate","EventDescription","Event_x002d_Type","ParticipantsPicker/Id","ParticipantsPicker/Title","SmartContact/Id",  "SmartActivitiesId" ,"SmartTopics/Title", "SmartTopics/Id", "SmartPages/Title", " SmartPages/Id",  "Description", "Created", "Author/Id", "Author/Title", "Modified", "Editor/Id", "Editor/Title").expand("Author", "ParticipantsPicker","SmartContact", "SmartTopics", "SmartPages", "Editor")
            .get().then((data: any) => {
              
                data.ItemDescription = data?.Body
                if (data?.PageUrl != undefined && data?.PageUrl?.Url != undefined && data?.PageUrl?.Url != '') {
                    setValuechecked(true);
                    setPageUrl(prevState => ({
                        ...prevState,
                        Description: data?.PageUrl?.Description,
                        Url: data?.PageUrl?.Url
                    }));
                }
                setisVisible(data?.IsVisible)
                setShareWebTypeData(data?.SmartActivities)
                setShareWebTypeTopicData(data?.SmartTopics)
                setShareWebTypePagesData(data?.SmartPages)
                
                setUpdateData(data);
            }).catch((error: unknown) => {
                console.error(error);
            });

    }


    const getNewsData = () => {
        let webs = new Web(props?.allListId?.siteUrl);
        webs.lists.getById(props?.allListId[props?.usedFor]).items.getById(props?.EditEventData?.Id)
            .select("Id", "Title","Expires","SmartContact/ Id", "SmartActivitiesId", "SmartTopics/Title", "SmartTopics/Id", "SmartPages/Title", " SmartPages/Id", "ItemRank",  "Body", "SortOrder", "PublishingDate", "Created", "Author/Id", "Author/Title", "Modified", "Editor/Id", "Editor/Title").expand("Author","SmartContact", "SmartTopics", "SmartPages", "Editor")
            .get().then((data: any) => {
              
                data.ItemDescription = data?.Body
                if (data?.PageUrl != undefined && data?.PageUrl?.Url != undefined && data?.PageUrl?.Url != '') {
                    setValuechecked(true);
                    setPageUrl(prevState => ({
                        ...prevState,
                        Description: data?.PageUrl?.Description,
                        Url: data?.PageUrl?.Url
                    }));
                }
                setisVisible(data?.IsVisible)
                setShareWebTypeData(data?.SmartActivities)
                setShareWebTypeTopicData(data?.SmartTopics)
                setShareWebTypePagesData(data?.SmartPages)
             
                setUpdateData(data);
            }).catch((error: unknown) => {
                console.error(error);
            });
    };
 
    const onRenderCustomHeaderEventCard = () => {
        return (
            <>
                {props?.usedFor == "SharewebNews" ?
                    <h3>Edit News Metadata - {updateData?.Title} <span className="ml-auto"><Tooltip ComponentId={props?.usedFor == "SharewebNews" ? "" : ""} /></span>
                    </h3>

                    :
                    props?.usedFor === 'ImageSlider' ? <h3>Edit Image Slider Item - {updateData?.Title} <span className="ml-auto"><Tooltip /></span></h3> : <h3>Event Metadata - {updateData?.Title} <span className="ml-auto"><Tooltip ComponentId={props?.usedFor == "SharewebNews" ? "" : ""} /></span></h3>}

            </>
        );
    };

    //***************image information call back Function***********************************/
 
  

    // *****************End image call back function**********************************

    const HtmlEditorCallBack = (items: any) => {
        console.log(items);
        var ItemDescription = ""
        if (items == '<p></p>\n') {
            ItemDescription = ""
        } else {
            ItemDescription = items
        }
        setUpdateData({ ...updateData, ItemDescription: ItemDescription })
    }

  

    //*********************** Tagging Item ********************************//    
  


    const smartCategoryPopup = React.useCallback(() => {
        setIsComponentPicker(false);
    }, []);
    // const autoSuggestionsForActivity = (e: any) => {
    //     let searchedKey: any = e.target.value;
    //     setActivitySearchKey(e.target.value);
    //     let tempArray: any = [];
    //     if (searchedKey?.length > 0) {
    //         AutoCompleteItemsArray?.map((itemData: any) => {
    //             if (
    //                 itemData.Newlabel.toLowerCase().includes(searchedKey.toLowerCase())
    //             ) {
    //                 tempArray.push(itemData);
    //             }
    //         });
    //         setSearchedActivityData(tempArray);
    //     } else {
    //         setSearchedActivityData([]);
    //     }
    // };
    // const autoSuggestionsForTopic = (e: any) => {
    //     let searchedKey: any = e.target.value;
    //     setTopicSearchKey(e.target.value);
    //     let tempArray: any = [];
    //     if (searchedKey?.length > 0) {
    //         AutoCompleteItemsArray?.map((itemData: any) => {
    //             if (
    //                 itemData.Newlabel.toLowerCase().includes(searchedKey.toLowerCase())
    //             ) {
    //                 tempArray.push(itemData);
    //             }
    //         });
    //         setSearchedTopicData(tempArray);
    //     } else {
    //         setSearchedTopicData([]);
    //     }
    // };
    // const autoSuggestionsForPages = (e: any) => {
    //     let searchedKey: any = e.target.value;
    //     setPagesSearchKey(e.target.value);
    //     let tempArray: any = [];
    //     if (searchedKey?.length > 0) {
    //         AutoCompleteItemsArray?.map((itemData: any) => {
    //             if (
    //                 itemData.Newlabel.toLowerCase().includes(searchedKey.toLowerCase())
    //             ) {
    //                 tempArray.push(itemData);
    //             }
    //         });
    //         setSearchedPagesData(tempArray);
    //     } else {
    //         setSearchedPagesData([]);
    //     }
    // };
    const setSelectedActivityData = (selectCategoryData: any, usedFor: any) => {
        setIsComponentPicker(false);
        let uniqueIds: any = {};
        if (usedFor == "For-Panel") {
            let TempArrya: any = [];
            selectCategoryData?.map((selectedData: any) => {
                TempArrya.push(selectedData);
            })
            tempShareWebTypeData = TempArrya;
        } else {
            selectCategoryData.forEach((existingData: any) => {
                tempShareWebTypeData.push(existingData);
            });
        }
        const result: any = tempShareWebTypeData.filter((item: any) => {
            if (!uniqueIds[item.Id]) {
                uniqueIds[item.Id] = true;
                return true;
            }
            return false;
        });
        tempShareWebTypeData = result;
        let updatedItem = {
            ...EditDataBackup,
            TaskCategories: tempShareWebTypeData,
        };
        setEditData(updatedItem);
        EditDataBackup = updatedItem;
        if (usedFor === "For-Panel" || usedFor === "For-Auto-Search") {
            setShareWebTypeData(result);
            if (usedFor === "For-Auto-Search") {
                setSearchedActivityData([]);
                setActivitySearchKey("");
            }
        }
    };
    const handleDescriptionChange = (event: any) => {
        setPageUrl({ ...pageUrl, Description: event.target.value });
    };

    const handleUrlChange = (event: any) => {
        setPageUrl({ ...pageUrl, Url: event.target.value });
    };
    const setSelectedTopicData = (selectCategoryData: any, usedFor: any) => {
        setIsComponentPicker(false);
        let uniqueIds: any = {};
        if (usedFor == "For-Panel") {
            let TempArrya: any = [];
            selectCategoryData?.map((selectedData: any) => {
                TempArrya.push(selectedData);
            })
            tempShareWebTypeData = TempArrya;
        } else {
            selectCategoryData.forEach((existingData: any) => {
                tempShareWebTypeData.push(existingData);
            });
        }
        const result: any = tempShareWebTypeData.filter((item: any) => {
            if (!uniqueIds[item.Id]) {
                uniqueIds[item.Id] = true;
                return true;
            }
            return false;
        });
        tempShareWebTypeData = result;
        let updatedItem = {
            ...EditDataBackup,
            TaskCategories: tempShareWebTypeData,
        };
        setEditData(updatedItem);
        EditDataBackup = updatedItem;
        if (usedFor === "For-Panel" || usedFor === "For-Auto-Search") {
            setShareWebTypeTopicData(result);
            if (usedFor === "For-Auto-Search") {
                setSearchedTopicData([]);
                setActivitySearchKey("");
            }
        }
    };
    const setSelectedPagesData = (selectCategoryData: any, usedFor: any) => {
        setIsComponentPicker(false);
        let uniqueIds: any = {};
        if (usedFor == "For-Panel") {
            let TempArrya: any = [];
            selectCategoryData?.map((selectedData: any) => {
                TempArrya.push(selectedData);
            })
            tempShareWebTypeData = TempArrya;
        } else {
            selectCategoryData.forEach((existingData: any) => {
                tempShareWebTypeData.push(existingData);
            });
        }
        const result: any = tempShareWebTypeData.filter((item: any) => {
            if (!uniqueIds[item.Id]) {
                uniqueIds[item.Id] = true;
                return true;
            }
            return false;
        });
        tempShareWebTypeData = result;
        let updatedItem = {
            ...EditDataBackup,
            TaskCategories: tempShareWebTypeData,
        };
        setEditData(updatedItem);
        EditDataBackup = updatedItem;
        if (usedFor === "For-Panel" || usedFor === "For-Auto-Search") {
            setShareWebTypePagesData(result);
            if (usedFor === "For-Auto-Search") {
                setSearchedActivityData([]);
                setActivitySearchKey("");
            }
        }
    };
    const removeCategoryItem = (TypeCategory: any, TypeId: any) => {
        let tempString: any;
        let tempArray2: any = [];
        tempShareWebTypeData = [];
        if (TypeCategory === 'Activities') {
            ShareWebTypeData?.map((dataType: any) => {
                if (dataType.Id != TypeId) {
                    tempArray2.push(dataType);
                    tempShareWebTypeData.push(dataType);
                }
            });
        }
        else if (TypeCategory === 'Topics') {
            ShareWebTypeTopicData?.map((dataType: any) => {
                if (dataType.Id != TypeId) {
                    tempArray2.push(dataType);
                    tempShareWebTypeData.push(dataType);
                }
            });
        }
        else if (TypeCategory === 'Pages') {
            ShareWebTypePagesData?.map((dataType: any) => {
                if (dataType.Id != TypeId) {
                    tempArray2.push(dataType);
                    tempShareWebTypeData.push(dataType);
                }
            });
        }
        if (tempArray2 != undefined && tempArray2.length > 0) {
            tempArray2.map((itemData: any) => {
                tempString =
                    tempString != undefined
                        ? tempString + ";" + itemData.Title
                        : itemData.Title;
            });
        }
        if (TypeCategory === 'Activities') {
            setShareWebTypeData(tempArray2);
        }
        else if (TypeCategory === 'Topics') {
            setShareWebTypeTopicData(tempArray2);
        }
        else if (TypeCategory === 'Pages') {
            setShareWebTypePagesData(tempArray2);
        }
    };

    //*******************Delete function***************************  */
    const deleteData = async () => {
        console.log("In Delete:");
        try {
            if (confirm("Are you sure, you want to delete this?")) {
                let web = new Web(props?.allListId?.siteUrl);
                await web.lists.getById(props?.usedFor == "SharewebNews" ? props?.allListId?.NewsListId : props?.allListId?.EventListId).items.getById(updateData.Id).recycle().then((e) => {
                    console.log("Your information has been deleted");
                    callBack();

                });

                callBack();
            }
        } catch (error) {
            console.log("Error:", error.message);
        }
    }

    //****************End Delete Function****************** */
    const setSmartActivityIds = (smartActivity: any) => {
        var smartActivityIds: any = [];
        if (smartActivity != undefined && smartActivity.length > 0) {
            smartActivity.map((Activity: any) => {
                if (Activity.Id != undefined) {
                    smartActivityIds.push(Activity.Id);
                }
            })

        }
        return smartActivityIds;
    }
    // const setSmartTopicIds = (smartActivity: any) => {
    //     var smartActivityIds: any = [];
    //     if (smartActivity != undefined && smartActivity.length > 0) {
    //         smartActivity.map((Activity: any) => {
    //             if (Activity.Id != undefined) {
    //                 smartActivityIds.push(Activity.Id);
    //             }
    //         })

    //     }
    //     return smartActivityIds;
    // }
    // const setSmartPagesIds = (smartActivity: any) => {
    //     var smartActivityIds: any = [];
    //     if (smartActivity != undefined && smartActivity.length > 0) {
    //         smartActivity.map((Activity: any) => {
    //             if (Activity.Id != undefined) {
    //                 smartActivityIds.push(Activity.Id);
    //             }
    //         })

    //     }
    //     return smartActivityIds;
    // }

    const sendMail = () => {
        console.log(props);
        var title;
        if (props?.EditEventData?.Title != undefined) {
            title = props?.EditEventData?.Title;
        }
        else {
            title = '';
        }
        var link = "mailto: " +
            "?cc= " +
            "&subject=" + escape(title)
            + "&body=" + generatedHTML;
        window.location.href = link;
    }
    //*****************Save for Joint,GMBH Data Update***************************************** */
    const UpdateDetails = async () => {

        try {
            let postData: any;
            let smartactivityIds = setSmartActivityIds(ShareWebTypeData);
            // let smartTopicIds = setSmartTopicIds(ShareWebTypeTopicData);
            // let smartPagesIds = setSmartPagesIds(ShareWebTypePagesData);
            if (props?.usedFor == undefined) {
                postData = {
                    Title: (updateData?.Title),
                    AlternateLanguageTitle: (updateData?.AlternateLanguageTitle),
                    ItemRank: updateData?.ItemRank != null ? String(updateData?.ItemRank) : null,
                    // EventType: (updateData?.EventType),
                    Description: updateData?.ItemDescription,
                    AlternateLanguageDescription: (updateData?.AlternateLanguageDescription),
                    EventDate: updateData?.EventDate != undefined ? new Date(updateData?.EventDate).toISOString() : null,
                    EndDate: updateData?.EndDate != undefined ? new Date(updateData?.EndDate).toISOString() : null,
                    IsVisible: isVisible,
                    SmartActivitiesId: { "results": smartactivityIds },
                    // SmartTopicsId: { "results": smartTopicIds },
                    // SmartPagesId: { "results": smartPagesIds },
                    // WorkAddress: (updateData?.WorkAddress),
                    // Description:updateData?.Description,
                    // About:updateData?.About,                   
                    ItemCover: {
                        "__metadata": { type: "SP.FieldUrlValue" },
                        Description: updateData?.Item_x002d_Image != undefined ? updateData?.Item_x002d_Image?.Url : (updateData?.Item_x002d_Image != undefined ? updateData?.Item_x002d_Image?.Url : ""),
                        Url: updateData?.Item_x002d_Image != undefined ? updateData?.Item_x002d_Image?.Url : (updateData?.Item_x002d_Image != undefined ? updateData?.Item_x002d_Image?.Url : "")
                    },
                }
                if (props?.EditEventData?.siteUrl === 'team') {
                    postData.EventType1 = updateData?.EventType
                }
                else {
                    postData.EventType0 = updateData?.EventType
                }
            }
            else if (props?.usedFor === "ImageSlider") {
                postData = {
                    Title: (updateData?.Title),
                    ItemDescription: updateData?.ItemDescription,
                    ItemCover: {
                        "__metadata": { type: "SP.FieldUrlValue" },
                        Description: updateData?.ItemCover != undefined ? updateData?.ItemCover?.Url : (updateData?.ItemCover != undefined ? updateData?.ItemCover?.Url : ""),
                        Url: updateData?.ItemCover != undefined ? updateData?.ItemCover?.Url : (updateData?.ItemCover != undefined ? updateData?.ItemCover?.Url : "")
                    }
                }
            }
            else {
                postData = {
                    Title: (updateData?.Title),
                    AlternateLanguageDescription: (updateData?.AlternateLanguageDescription),
                    AlternateLanguageTitle: (updateData?.AlternateLanguageTitle),
                    ItemRank: updateData?.ItemRank != null ? String(updateData?.ItemRank) : null,
                    Body: updateData?.ItemDescription,
                    PublishingDate: updateData?.PublishingDate != undefined && updateData?.PublishingDate != 'Invalid date' ? new Date(updateData?.PublishingDate).toISOString() : null,
                    NewsType: updateData?.NewsType,
                    SmartActivitiesId: { "results": smartactivityIds },
                    // SmartTopicsId: { "results": smartTopicIds },
                    // SmartPagesId: { "results": smartPagesIds },
                    IsVisible: isVisible,
                    ItemCover: {
                        "__metadata": { type: "SP.FieldUrlValue" },
                        Description: updateData?.Item_x002d_Image != undefined ? updateData?.Item_x002d_Image?.Url : (updateData?.Item_x002d_Image != undefined ? updateData?.Item_x002d_Image?.Url : ""),
                        Url: updateData?.Item_x002d_Image != undefined ? updateData?.Item_x002d_Image?.Url : (updateData?.Item_x002d_Image != undefined ? updateData?.Item_x002d_Image?.Url : "")
                    },
                    PageUrl: {
                        "__metadata": { type: "SP.FieldUrlValue" },
                        Description: pageUrl?.Description != undefined && pageUrl?.Description != '' ? pageUrl?.Description : null,
                        Url: pageUrl?.Url != undefined && pageUrl?.Url != '' ? pageUrl?.Url : null,
                    },
                }
            }

            if (updateData?.Id != undefined && props?.usedFor !== "ImageSlider") {
                let web = new Web(props?.allListId?.siteUrl);
                await web.lists.getById(props?.usedFor == "SharewebNews" ? props?.allListId?.NewsListId : props?.allListId?.EventListId).items.getById(updateData?.Id).update(postData).then((e) => {
                    console.log("Your information has been updated successfully");
                    setShowConfirmation(true)



                });
            }
            else if (props?.usedFor === "ImageSlider") {
                let web = new Web(props?.allListId?.siteUrl);
                await web.lists.getById(props?.allListId?.ImageSliderListId).items.getById(updateData?.Id).update(postData).then((e) => {
                    console.log("Your information has been updated successfully");
                    setShowConfirmation(true)

                });
            }
        } catch (error) {
            console.log("Error:", error.message);
        }




    }

 


    const CustomFooter = () => {
        return (

            <footer>
                <div className='col text-start'>
                    <div><span className='pe-2'>Created</span><span className='pe-2'> {updateData?.Created ? moment(updateData?.Created).format("DD/MM/YYYY HH:MM") : ''}&nbsp;By</span><span><a>{updateData?.Author ? updateData?.Author?.Title : ''}</a></span></div>
                    <div><span className='pe-2'>Last modified</span><span className='pe-2'> {updateData?.Modified ? moment(updateData?.Modified).format("DD/MM/YYYY HH:MM") : ''}&nbsp;By</span><span><a>{updateData?.Editor ? updateData?.Editor.Title : ''}</a></span></div>
                    <div className='alignCenter'>
                        <FaRegTrashAlt />
                        <a onClick={() => deleteData()}> Delete this item</a></div>
                </div>

                <div className='col text-end'>
                    <span onClick={() => sendMail()} className="alignIcon  svg__iconbox svg__icon--mail"></span>
                    <a target="_blank" onClick={() => sendMail()}>Share this {props?.usedFor == "SharewebNews" ? <span>News</span> : <span>Event</span>}</a> |
                    <a href={`${props?.allListId?.siteUrl}/Lists/${props?.usedFor != undefined ? props?.usedFor === "ImageSlider" ? "ImageSlider" : "Announcements" : "Events"}/EditForm.aspx?ID=${updateData?.Id}`} data-interception="off"
                        target="_blank">Open out-of-the-box form</a>

                    <button className='btn btn-primary ms-1 mx-2'
                        onClick={() => UpdateDetails()}
                    >
                        Save
                    </button>
                    <button className='btn btn-default' onClick={() => callBack()}>
                        Cancel
                    </button>
                </div>
            </footer>

        )
    }

    const SelectCategoryCallBack = React.useCallback(
        (selectCategoryDataCallBack: any) => {
            if (taggingtype === 'Activities')
                setSelectedActivityData(selectCategoryDataCallBack, "For-Panel");
            else if (taggingtype === 'Topics')
                setSelectedTopicData(selectCategoryDataCallBack, "For-Panel");
            else if (taggingtype === 'Smart Pages')
                setSelectedPagesData(selectCategoryDataCallBack, "For-Panel");
        }, []
    );
    const cancelConfirmationPopup = () => {
        setShowConfirmation(false)
        callBack();
    }
    const ProceedConfirmation = () => {
        window.open(
            `https://grueneweltweit.sharepoint.com/sites/GrueneWeltweit/Washington/Public/SitePages/SyncTool.aspx`, "_blank"
        )
    }
    const EditComponentPicker = (arr: any, type: any) => {
        setIsComponentPicker(true);
        taggingtype = type;
        if (taggingtype === 'Activities')
            tempCategoryData = ShareWebTypeData
        else if (taggingtype === 'Topics')
            tempCategoryData = ShareWebTypeTopicData
        else if (taggingtype === 'Smart Pages')
            tempCategoryData = ShareWebTypePagesData
    }

    const showFieldInfo = () => {
        setValuechecked(!valuechecked);
    }
    return (
        <>
            <Panel onRenderHeader={onRenderCustomHeaderEventCard}
                isOpen={true}
                type={PanelType.custom}
                customWidth="1280px"
                onDismiss={callBack}
                isBlocking={false}
                onRenderFooter={CustomFooter}
                isFooterAtBottom={true}
            >
                <div>
                    <ul className="fixed-Header nav nav-tabs m-0" id="myTab" role="tablist">
                        <button className={`nav-link ${imagetab == false ? "active" : ""}`}
                            id="BASIC-INFORMATION"
                            data-bs-toggle="tab"
                            data-bs-target="#BASICINFORMATION"
                            type="button"
                            role="tab"
                            onClick={() => setImagetab(false)}
                            aria-controls="BASICINFORMATION"
                            aria-selected="true">BASIC INFORMATION</button>
                        
                    </ul>


                    <div className="border-top-0 clearfix p-3 tab-content " id="myTabContent">
                        <div className={`tab-pane show  ${imagetab == false ? "active" : ""}`} id="BASICINFORMATION" role="tabpanel" aria-labelledby="BASICINFORMATION">
                            <div className='general-section'>
                                <div className="col">
                                    <div className="user-form-5 row">
                                        <div className="col">
                                            <div className='input-group'>
                                                <label className='w-100 form-label'>Title </label>
                                                <input type="text" className="form-control" defaultValue={updateData ? updateData?.Title : null} onChange={(e) => setUpdateData({ ...updateData, Title: e.target.value })} aria-label="Title" placeholder='Title' />
                                            </div>
                                        </div>
                                        {props?.usedFor !== 'ImageSlider' && <div className="col">
                                            <div className='input-group'>
                                                <label className="w-100 form-label">English Title</label>
                                                <input type="text" className="form-control" defaultValue={updateData?.AlternateLanguageTitle ? updateData?.AlternateLanguageTitle : ""}
                                                    onChange={(e) => setUpdateData({ ...updateData, AlternateLanguageTitle: e.target.value })} aria-label="English Title" />
                                            </div>
                                            </div>}
                                        {props?.usedFor !== 'ImageSlider' && <div className="col">
                                            <div className='input-group'>
                                                <label className='form-label alignCenter full-width gap-1'>
                                                    Item Rank
                                               {/* <CustomToolTip Description={'Select Importance and where it should show: <br>8 = Top highlight (Shows under highlight item list); <br>7 = featured (shows on featured item list on homepage); <br>6 = key item (shows on right list on homepage and as key item on featured profile pages; <br>5 = relevant (shows on profile pages); <br>4 = background item (....); <br>2 = to be verified (...); <br>1 = Archive (...); <br>0 = no show (does not show in any list but in search results).'} /> */}
                                                </label>
                                                <select className={`${updateData?.ItemRank === null && itemRanks[0]?.rank === '' ? 'colLight form-select' : 'form-select'}`} value={updateData?.ItemRank} onChange={(e) => setUpdateData({ ...updateData, ItemRank: e.target.value })}>

                                                    {itemRanks?.length > 0 && itemRanks?.map((itemRank: any, index: any) => {
                                                        return (
                                                            <option value={itemRank?.rank}>{itemRank?.rankTitle}</option>
                                                        )
                                                    })}

                                                </select>
                                            </div>
                                        </div>}


                                    </div>
                                    {props?.usedFor !== 'ImageSlider' && <div className="col mt-12">
                                        {props?.usedFor == "SharewebNews" ?
                                            <div className="user-form-6 row">
                                                <div className="col pad0">
                                                    <div className='input-group'>
                                                        <label className="w-100 form-label">Publishing Date</label>
                                                        <input className="form-control" type="date" value={updateData?.PublishingDate != undefined ? moment(updateData?.PublishingDate).format('YYYY-MM-DD') : null} onChange={(e) => setUpdateData({ ...updateData, PublishingDate: moment(e.target.value).format('YYYY-MM-DD') })} />
                                                    </div>
                                                </div>
                                                <div className="col">
                                                <div className='input-group'>
                                                <label className='form-label alignCenter full-width gap-1'>News Type
                                                {/* <CustomToolTip Description={'Define the news type and under which section the news item will be listed.'} /> */}
                                                </label>
                                                        <select className={`${updateData?.NewsType === null ? 'colLight form-select' : 'form-select'}`} value={updateData?.NewsType} onChange={(e) => setUpdateData({ ...updateData, NewsType: e.target.value })}>
                                                            <option className='defaultSelectValue' value={"select"}> Select</option>
                                                            <option value={"Analyse"}> Analyse</option>
                                                            <option value={"Antrag"}>Antrag</option>
                                                            <option value={"Artikel"}> Artikel</option>
                                                            <option value={"Offener Brief"}>Offener Brief</option>
                                                            <option value={"OV Events"}> OV Events</option>
                                                            <option value={"Positionspapier"}>Positionspapier</option>
                                                            <option value={"Pressemitteilung"}> Pressemitteilung</option>
                                                            <option value={"Publikation"}>Publikation</option>
                                                            <option value={"Sofa-Talk"}> Sofa-Talk</option>
                                                        </select>
                                                   </div>
                                                </div>
                                            </div>
                                            : <div className="user-form-6 row">
                                                <div className="col pad0">
                                                    <div className='input-group'>
                                                        <label className="w-100 form-label">Start Date</label>
                                                        <input className="form-control" type="date" value={updateData?.EventDate != undefined ? moment(updateData?.EventDate).format('YYYY-MM-DD') : null} onChange={(e) => setUpdateData({ ...updateData, EventDate: moment(e.target.value).format('YYYY-MM-DD') })} />
                                                    </div></div>

                                                <div className="col pad0">
                                                    <div className='input-group'>
                                                        <label className="w-100 form-label">End Date</label>
                                                        <input className="form-control" type='date' value={updateData?.EndDate != undefined ? moment(updateData?.EndDate).format('YYYY-MM-DD') : null} onChange={(e) => setUpdateData({ ...updateData, EndDate: moment(e.target.value).format('YYYY-MM-DD') })} />
                                                    </div></div>
                                                <div className="col">
                                                    <div className='input-group'>
                                                    <label className='form-label alignCenter full-width gap-1'>Event Type
                                                            {/* <CustomToolTip Description={'Define the event type and under which section the event item will be listed.'} /> */}
                                                            </label>
                                                        <select className={`${updateData?.EventType === null ? 'colLight form-select' : 'form-select'}`} value={updateData?.EventType} onChange={(e) => setUpdateData({ ...updateData, EventType: e.target.value })}>
                                                            <option value={""}> Select</option>
                                                            <option value={"Event"}>Event</option>
                                                            <option value={"Training"}>Training</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>}
                                    </div>}
                               

                              

                                </div>
                                {props?.usedFor !== 'ImageSlider' && <div className="col mt-12">
                                        <details>
                                            {props?.usedFor == "SharewebNews" && props?.usedFor != undefined ? <summary><span>News Tags</span></summary> : <summary><span>Event Tags</span></summary>}
                                            <div className="expand-AccordionContent clearfix">
                                                <div className='row'>
                                                    <div className="col pad0">
                                                        <div className='input-group'>
                                                        <div className="col pad0">
                                                                <div className='form-label alignCenter full-width gap-1'>
                                                                    <label className="form-label">Main Activity</label>
                                                                    {/* <CustomToolTip Description={'Tag the available Activities'} /> */}
                                                                </div>

                                                            {ShareWebTypeData?.length > 1 ? <>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    id="txtCategories"
                                                                    placeholder="Main Activity"
                                                                    value={ActivitySearchKey}
                                                                    //onChange={(e) => autoSuggestionsForActivity(e)}
                                                                />
                                                                {SearchedActivityData?.length > 0 ? (
                                                                    <div className="SmartTableOnTaskPopup">
                                                                        <ul className="autosuggest-list maXh-200 scrollbar list-group">
                                                                            {SearchedActivityData.map((item: any) => {
                                                                                return (
                                                                                    <li
                                                                                        className="list-group-item rounded-0 p-1 list-group-item-action"
                                                                                        key={item.id}
                                                                                        onClick={() =>
                                                                                            setSelectedActivityData([item], "For-Auto-Search")
                                                                                        }
                                                                                    >
                                                                                        <a>{item.Newlabel}</a>
                                                                                    </li>
                                                                                );
                                                                            })}
                                                                        </ul>
                                                                    </div>
                                                                ) : null}
                                                                {ShareWebTypeData?.map(
                                                                    (type: any, index: number) => {
                                                                        return (
                                                                            <div className="block w-100">
                                                                                <a style={{ color: "#fff !important" }} className="textDotted">
                                                                                    {type.Title}
                                                                                </a>
                                                                                <span onClick={() => removeCategoryItem('Activities', type.Id)} className="bg-light ml-auto svg__icon--cross svg__iconbox"></span>
                                                                            </div>
                                                                        );
                                                                    }
                                                                )}</> :
                                                                <>
                                                                    {ShareWebTypeData?.length == 1 ?

                                                                        <div className="full-width">
                                                                            {ShareWebTypeData?.map((ActivityItem: any) => {
                                                                                return (
                                                                                    <div className="full-width replaceInput alignCenter">
                                                                                        <a
                                                                                            title={ActivityItem.Title}
                                                                                            target="_blank"
                                                                                            data-interception="off"
                                                                                            className="textDotted"
                                                                                        >
                                                                                            {ActivityItem.Title}
                                                                                        </a>
                                                                                    </div>
                                                                                );
                                                                            })}
                                                                        </div>
                                                                        :
                                                                        <>
                                                                            <input
                                                                                type="text"
                                                                                className="form-control"
                                                                                id="txtCategories"
                                                                                placeholder="Main Activity"
                                                                                value={ActivitySearchKey}
                                                                                //onChange={(e) => autoSuggestionsForActivity(e)}
                                                                            />
                                                                            {SearchedActivityData?.length > 0 ? (
                                                                                <div className="SmartTableOnTaskPopup">
                                                                                    <ul className="autosuggest-list maXh-200 scrollbar list-group">
                                                                                        {SearchedActivityData.map((item: any) => {
                                                                                            return (
                                                                                                <li
                                                                                                    className="list-group-item p-1 rounded-0 list-group-item-action"
                                                                                                    key={item.id}
                                                                                                    onClick={() =>
                                                                                                        setSelectedActivityData(
                                                                                                            [item],
                                                                                                            "For-Auto-Search"
                                                                                                        )
                                                                                                    }
                                                                                                >
                                                                                                    <a>{item.Newlabel}</a>
                                                                                                </li>
                                                                                            );
                                                                                        })}
                                                                                    </ul>
                                                                                </div>
                                                                            ) : null}
                                                                        </>
                                                                    }

                                                                </>
                                                            }
                                                            <span className="input-group-text" title="Smart Category Popup" onClick={(e) => EditComponentPicker(EditData, "Activities")}>
                                                                <span className="svg__iconbox svg__icon--editBox"></span>
                                                            </span>
                                                        </div>
                                                        </div>
                                                    </div>
                                                    <div className="col pad0">
                                                        <div className='input-group'>
                                                        <div className="col pad0">
                                                                <div className='form-label alignCenter full-width gap-1'>
                                                                    <label className="form-label">Main Topic</label>
                                                                    {/* <CustomToolTip Description={'Tag the available Topics'} /> */}
                                                                </div>
                                                            {ShareWebTypeTopicData?.length > 1 ? <>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    id="txtCategories"
                                                                    placeholder="Main Topic"
                                                                    value={TopicSearchKey}
                                                                   // onChange={(e) => autoSuggestionsForTopic(e)}
                                                                />
                                                                {SearchedTopicData?.length > 0 ? (
                                                                    <div className="SmartTableOnTaskPopup">
                                                                        <ul className="autosuggest-list maXh-200 scrollbar list-group">
                                                                            {SearchedTopicData.map((item: any) => {
                                                                                return (
                                                                                    <li className="list-group-item rounded-0 p-1 list-group-item-action" key={item.id} onClick={() => setSelectedTopicData([item], "For-Auto-Search")}>
                                                                                        <a>{item.Newlabel}</a>
                                                                                    </li>
                                                                                );
                                                                            })}
                                                                        </ul>
                                                                    </div>
                                                                ) : null}
                                                                {ShareWebTypeTopicData?.map(
                                                                    (type: any, index: number) => {
                                                                        return (
                                                                            <div className="block w-100">
                                                                                <a style={{ color: "#fff !important" }} className="textDotted">
                                                                                    {type.Title}
                                                                                </a>
                                                                                <span onClick={() => removeCategoryItem('Topics', type.Id)} className="bg-light ml-auto svg__icon--cross svg__iconbox"></span>
                                                                            </div>
                                                                        );
                                                                    }
                                                                )}</> :
                                                                <>
                                                                    {ShareWebTypeTopicData?.length == 1 ?

                                                                        <div className="full-width">
                                                                            {ShareWebTypeTopicData?.map((CategoryItem: any) => {
                                                                                return (
                                                                                    <div className="full-width replaceInput alignCenter">
                                                                                        <a
                                                                                            title={CategoryItem.Title}
                                                                                            target="_blank"
                                                                                            data-interception="off"
                                                                                            className="textDotted"
                                                                                        >
                                                                                            {CategoryItem.Title}
                                                                                        </a>
                                                                                    </div>
                                                                                );
                                                                            })}
                                                                        </div>
                                                                        :
                                                                        <>
                                                                            <input
                                                                                type="text"
                                                                                className="form-control"
                                                                                id="txtCategories"
                                                                                placeholder="Main Topic"
                                                                                value={TopicSearchKey}
                                                                               // onChange={(e) => autoSuggestionsForTopic(e)}
                                                                            />
                                                                            {SearchedTopicData?.length > 0 ? (
                                                                                <div className="SmartTableOnTaskPopup">
                                                                                    <ul className="autosuggest-list maXh-200 scrollbar list-group">
                                                                                        {SearchedTopicData.map((item: any) => {
                                                                                            return (
                                                                                                <li
                                                                                                    className="list-group-item p-1 rounded-0 list-group-item-action"
                                                                                                    key={item.id}
                                                                                                    onClick={() =>
                                                                                                        setSelectedTopicData(
                                                                                                            [item],
                                                                                                            "For-Auto-Search"
                                                                                                        )
                                                                                                    }
                                                                                                >
                                                                                                    <a>{item.Newlabel}</a>
                                                                                                </li>
                                                                                            );
                                                                                        })}
                                                                                    </ul>
                                                                                </div>
                                                                            ) : null}
                                                                        </>
                                                                    }

                                                                </>
                                                            }
                                                            <span className="input-group-text" title="Smart Category Popup" onClick={(e) => EditComponentPicker(EditData, "Topics")}>
                                                                <span className="svg__iconbox svg__icon--editBox"></span>
                                                            </span>
                                                        </div>  </div>
                                                    </div>
                                                    <div className="col pad0">
                                                        <div className='input-group'>
                                                        <div className="col pad0">
                                                        <div className='form-label alignCenter full-width gap-1'>
                                                                            <label className="form-label">Smart Pages</label>
                                                                        
                                                                            </div>
                                                            {ShareWebTypePagesData?.length > 1 ? <>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    id="txtCategories"
                                                                    placeholder="Smart Pages"
                                                                    value={PagesSearchKey}
                                                                    //onChange={(e) => autoSuggestionsForPages(e)}
                                                                />
                                                                {SearchedPagesData?.length > 0 ? (
                                                                    <div className="SmartTableOnTaskPopup">
                                                                        <ul className="autosuggest-list maXh-200 scrollbar list-group">
                                                                            {SearchedPagesData.map((item: any) => {
                                                                                return (
                                                                                    <li
                                                                                        className="list-group-item rounded-0 p-1 list-group-item-action"
                                                                                        key={item.id}
                                                                                        onClick={() =>
                                                                                            setSelectedPagesData([item], "For-Auto-Search")
                                                                                        }
                                                                                    >
                                                                                        <a>{item.Newlabel}</a>
                                                                                    </li>
                                                                                );
                                                                            })}
                                                                        </ul>
                                                                    </div>
                                                                ) : null}
                                                                {ShareWebTypePagesData?.map(
                                                                    (type: any, index: number) => {
                                                                        return (
                                                                            <div className="block w-100">
                                                                                <a style={{ color: "#fff !important" }} className="textDotted">
                                                                                    {type.Title}
                                                                                </a>
                                                                                <span onClick={() => removeCategoryItem('Pages', type.Id)} className="bg-light ml-auto svg__icon--cross svg__iconbox"></span>
                                                                            </div>
                                                                        );
                                                                    }
                                                                )}</> :
                                                                <>
                                                                    {ShareWebTypePagesData?.length == 1 ?

                                                                        <div className="full-width">
                                                                            {ShareWebTypePagesData?.map((CategoryItem: any) => {
                                                                                return (
                                                                                    <div className="full-width replaceInput alignCenter">
                                                                                        <a
                                                                                            title={CategoryItem.Title}
                                                                                            target="_blank"
                                                                                            data-interception="off"
                                                                                            className="textDotted"
                                                                                        >
                                                                                            {CategoryItem.Title}
                                                                                        </a>
                                                                                    </div>
                                                                                );
                                                                            })}
                                                                        </div>
                                                                        :
                                                                        <>
                                                                            <input
                                                                                type="text"
                                                                                className="form-control"
                                                                                id="txtCategories"
                                                                                placeholder="Smart Pages"
                                                                                value={PagesSearchKey}
                                                                               // onChange={(e) => autoSuggestionsForPages(e)}
                                                                            />
                                                                            {SearchedActivityData?.length > 0 ? (
                                                                                <div className="SmartTableOnTaskPopup">
                                                                                    <ul className="autosuggest-list maXh-200 scrollbar list-group">
                                                                                        {SearchedActivityData.map((item: any) => {
                                                                                            return (
                                                                                                <li
                                                                                                    className="list-group-item p-1 rounded-0 list-group-item-action"
                                                                                                    key={item.id}
                                                                                                    onClick={() =>
                                                                                                        setSelectedPagesData(
                                                                                                            [item],
                                                                                                            "For-Auto-Search"
                                                                                                        )
                                                                                                    }
                                                                                                >
                                                                                                    <a>{item.Newlabel}</a>
                                                                                                </li>
                                                                                            );
                                                                                        })}
                                                                                    </ul>
                                                                                </div>
                                                                            ) : null}
                                                                        </>
                                                                    }

                                                                </>
                                                            }
                                                            <span className="input-group-text" title="Smart Category Popup" onClick={(e) => EditComponentPicker(EditData, "Smart Pages")}>
                                                                <span className="svg__iconbox svg__icon--editBox"></span>
                                                            </span>
                                                        </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </details>
                                    </div>}
                               
                                <div className="col my-2">
                                    <div className="col" >
                                        <div className='input-group'>
                                            <label className="full-width form-label">Description</label>
                                            {updateData?.Id != undefined ? <HtmlEditorCard editorValue={updateData?.ItemDescription != null ? updateData?.ItemDescription : ""} HtmlEditorStateChange={HtmlEditorCallBack} /> : null}
                                        </div>
                                    </div>
                                </div>
                               </div>
                        </div>
                    </div>
                </div>
              
            </Panel>
            {IsComponentPicker && (
                <Picker
                    props={EditData}
                    selectedCategoryData={tempCategoryData}
                    siteUrls={props?.allListId?.siteUrl}
                    AllListId={props?.allListId}
                    CallBack={SelectCategoryCallBack}
                    closePopupCallBack={smartCategoryPopup}
                    usedFor={taggingtype}
                />
            )}
        </>
    )
}
export default EditEventCardPopup
