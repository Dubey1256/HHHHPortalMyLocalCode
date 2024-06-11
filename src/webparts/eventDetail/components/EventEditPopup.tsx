import moment from 'moment';
import { Panel, PanelType } from 'office-ui-fabric-react';
import * as React from 'react';
import { Web } from 'sp-pnp-js';
import Tooltip from '../../../globalComponents/Tooltip';
import HtmlEditorCard from '../../../globalComponents/HtmlEditor/HtmlEditor';
import { Col, Row, Tabs, Tab } from 'react-bootstrap';
import { FaRegTrashAlt } from 'react-icons/fa';
import Picker from './EventSmartMetadataPicker';
import ImageInformation from '../../EditPopupFiles/ImageInformation';

var AutoCompleteActivitiesItemsArray: any = [];
var AutoCompleteTopicsItemsArray: any = [];
var AutoCompletePagesItemsArray: any = [];
var tempShareWebTypeData: any = [];
var EditDataBackup: any;
var taggingtype: any = '';
var tempCategoryData: any = "";

const Editpopup = (props: any) => {   
    const ItemId = props?.EditEventData?.Id;
    const [EventItem, setEventItem]: any = React.useState([]);    
    const [IsComponentPicker, setIsComponentPicker] = React.useState(false);
    const [ShareWebTypeData, setShareWebTypeData] = React.useState([]);
    const [SearchedActivityData, setSearchedActivityData] = React.useState([]);
    const [isOpenImageTab, setisOpenImageTab] = React.useState(false);
    const [SearchedTopicData, setSearchedTopicData] = React.useState([]);
    const [SearchedPagesData, setSearchedPagesData] = React.useState([]);
    const [ActivitySearchKey, setActivitySearchKey] = React.useState("");
    const [TopicSearchKey, setTopicSearchKey] = React.useState("");
    const [PagesSearchKey, setPagesSearchKey] = React.useState("");
    const [ShareWebTypeTopicData, setShareWebTypeTopicData] = React.useState([]);
    const [ShareWebTypePagesData, setShareWebTypePagesData] = React.useState([]);
    const [EditData, setEditData] = React.useState<any>({});
    const [allActivitesData, setAllActivitesData] = React.useState([])
    const [allTopicsData, setAllTopicsData] = React.useState([])
    const [allPagesData, setAllPagesData] = React.useState([])
    const callBack = props.callBack;
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
    React.useEffect(() => {
        loadAllsiteEvents() 
        SmartMetaDataListInformations()
    }, [ItemId])
    
    const loadAllsiteEvents = async() => {
        let eventitem: any = [];
        try {
            let webs = new Web(props.Context.pageContext.web.absoluteUrl);
            var columns = "Id, Title,SmartActivities/Title, SmartActivities/Id, SmartTopics/Title, SmartTopics/Id, SmartPages/Title, SmartPages/Id, ItemRank, EventDate, Item_x0020_Cover, EndDate, Event_x002d_Type, Description, Created, Author/Id, Author/Title, Modified, Editor/Id, Editor/Title";
            await webs.lists.getById('860a08d5-9711-4d8e-bd26-93fe09362bd4').items.getById(props?.EditEventData?.Id)
                .select(columns)
                .expand("Author", "Editor", "SmartActivities", "SmartTopics", "SmartPages").get().then((data: any) => {
                    data.Item_x002d_Image = data?.Item_x0020_Cover;
                    data.ItemDescription = data?.Description;
                    setShareWebTypeData(data?.SmartActivities)
                    setShareWebTypeTopicData(data?.SmartTopics)
                    setShareWebTypePagesData(data?.SmartPages)
                    // createHTML(data);
                    setEventItem(data)
                })
                .catch((err) => {
                    console.log(err)
                })
        } catch (error) {
            console.log("An error occurred while fetching data.");
        }

    }

    // ******************* Load SmartMetadata Item ********************** */
    var getSmartMetadataItemsByTaxType = function (metadataItems: any, taxType: any) {
        var Items: any = [];
        metadataItems.map((taxItem: any) => {
            if (taxItem.TaxType === taxType) Items.push(taxItem);
        });
        Items.sort((a: any, b: any) => {
            return a.SortOrder - b.SortOrder;
        });
        return Items;
    };
    var loadSmartTaxonomyPortfolioPopup = (AllTaxonomyItems: any, SmartTaxonomy: any) => {
        var TaxonomyItems: any = [];
        var uniqueNames: any = [];
        $.each(AllTaxonomyItems, function (index: any, item: any) {
            if (item.ParentID == 0 && SmartTaxonomy == item.TaxType) {
                TaxonomyItems.push(item);
                getChilds(item, AllTaxonomyItems);
                if (item.childs != undefined && item.childs.length > 0) {
                    TaxonomyItems.push(item);
                }
                uniqueNames = TaxonomyItems.filter((val: any, id: any, array: any) => {
                    return array?.indexOf(val) == id;
                });
            }
        });
        return uniqueNames;
    };
    const getChilds = (item: any, items: any) => {
        item.childs = [];
        $.each(items, function (index: any, childItem: any) {
            if (
                childItem.ParentID != undefined &&
                parseInt(childItem.ParentID) == item.ID
            ) {
                childItem.isChild = true;
                item.childs.push(childItem);
                getChilds(childItem, items);
            }
        });
    };
    const SmartMetaDataListInformations = async () => {
        let AllSmartDataListData: any = [];

        let AllActivitiesData: any = [];
        let AllTopicsData: any = [];
        let AllSmartPagesData: any = [];       ;
        let CategoriesGroupByData: any = [];
        let tempArray: any = [];
        let TempTimeSheetCategoryArray: any = [];
        try {
            let web = new Web(props.Context.pageContext.web.absoluteUrl);
            AllSmartDataListData = await web.lists
                .getById('136503cd-706e-4466-941f-eb2dcb39db7f')
                .items.select(
                    "Id,Title,listId,siteUrl,siteName,Item_x005F_x0020_Cover,ParentID,Configurations,EncodedAbsUrl,IsVisible,Created,Modified,Description1,SortOrder,Selectable,TaxType,Created,Modified,Author/Name,Author/Title,Editor/Name,Editor/Title,IsSendAttentionEmail/Id,IsSendAttentionEmail/Title,IsSendAttentionEmail/EMail"
                )
                .expand("Author,Editor,IsSendAttentionEmail")
                .getAll();
                           
            AllActivitiesData = getSmartMetadataItemsByTaxType(
                AllSmartDataListData,
                "Activities"
            );
            AllTopicsData = getSmartMetadataItemsByTaxType(
                AllSmartDataListData,
                "Topics"
            );
            AllSmartPagesData = getSmartMetadataItemsByTaxType(
                AllSmartDataListData,
                "SmartPages"
            );
            // ########## this is for All Categories related validations ################
            if (AllActivitiesData?.length > 0) {
                CategoriesGroupByData = loadSmartTaxonomyPortfolioPopup(
                    AllActivitiesData,
                    "Activities"
                );
                if (CategoriesGroupByData?.length > 0) {
                    CategoriesGroupByData?.map((item: any) => {
                        if (item.Title != undefined) {
                            item["Newlabel"] = item.Title;
                            AutoCompleteActivitiesItemsArray.push(item);
                            if (
                                item.childs != null &&
                                item.childs != undefined &&
                                item.childs.length > 0
                            ) {
                                item.childs.map((childitem: any) => {
                                    if (childitem.Title != undefined) {
                                        childitem["Newlabel"] =
                                            item["Newlabel"] + " > " + childitem.Title;
                                        AutoCompleteActivitiesItemsArray.push(childitem);
                                    }
                                    if (childitem.childs.length > 0) {
                                        childitem.childs.map((subchilditem: any) => {
                                            if (subchilditem.Title != undefined) {
                                                subchilditem["Newlabel"] =
                                                    childitem["Newlabel"] + " > " + subchilditem.Title;
                                                AutoCompleteActivitiesItemsArray.push(subchilditem);
                                            }
                                        });
                                    }
                                });
                            }
                        }
                    });
                }
                if (AutoCompleteActivitiesItemsArray?.length > 0) {
                    AutoCompleteActivitiesItemsArray = AutoCompleteActivitiesItemsArray.reduce(function (previous: any,current: any) {
                        var alredyExists =
                            previous.filter(function (item: any) {
                                return item.Title === current.Title;
                            }).length > 0;
                        if (!alredyExists) {
                            previous.push(current);
                        }
                        return previous;
                    },[]);
                }

                // ############## this is used for flittering time sheet category data from smartMetaData list ##########               
                setAllActivitesData(AutoCompleteActivitiesItemsArray);                             
            }
            if (AllTopicsData?.length > 0) {
                CategoriesGroupByData = loadSmartTaxonomyPortfolioPopup(
                    AllTopicsData,
                    "Topics"
                );
                if (CategoriesGroupByData?.length > 0) {
                    CategoriesGroupByData?.map((item: any) => {
                        if (item.Title != undefined) {
                            item["Newlabel"] = item.Title;
                            AutoCompleteTopicsItemsArray.push(item);
                            if (
                                item.childs != null &&
                                item.childs != undefined &&
                                item.childs.length > 0
                            ) {
                                item.childs.map((childitem: any) => {
                                    if (childitem.Title != undefined) {
                                        childitem["Newlabel"] =
                                            item["Newlabel"] + " > " + childitem.Title;
                                        AutoCompleteTopicsItemsArray.push(childitem);
                                    }
                                    if (childitem.childs.length > 0) {
                                        childitem.childs.map((subchilditem: any) => {
                                            if (subchilditem.Title != undefined) {
                                                subchilditem["Newlabel"] =
                                                    childitem["Newlabel"] + " > " + subchilditem.Title;
                                                AutoCompleteTopicsItemsArray.push(subchilditem);
                                            }
                                        });
                                    }
                                });
                            }
                        }
                    });
                }
                if (AutoCompleteTopicsItemsArray?.length > 0) {
                    AutoCompleteTopicsItemsArray = AutoCompleteTopicsItemsArray.reduce(function (previous: any, current: any) {
                        var alredyExists =
                            previous.filter(function (item: any) {
                                return item.Title === current.Title;
                            }).length > 0;
                        if (!alredyExists) {
                            previous.push(current);
                        }
                        return previous;
                    }, []);
                }

                // ############## this is used for flittering time sheet category data from smartMetaData list ##########               
                setAllTopicsData(AutoCompleteTopicsItemsArray);
            }
            if (AllSmartPagesData?.length > 0) {
                CategoriesGroupByData = loadSmartTaxonomyPortfolioPopup(
                    AllSmartPagesData,
                    "SmartPages"
                );
                if (CategoriesGroupByData?.length > 0) {
                    CategoriesGroupByData?.map((item: any) => {
                        if (item.Title != undefined) {
                            item["Newlabel"] = item.Title;
                            AutoCompletePagesItemsArray.push(item);
                            if (
                                item.childs != null &&
                                item.childs != undefined &&
                                item.childs.length > 0
                            ) {
                                item.childs.map((childitem: any) => {
                                    if (childitem.Title != undefined) {
                                        childitem["Newlabel"] =
                                            item["Newlabel"] + " > " + childitem.Title;
                                        AutoCompletePagesItemsArray.push(childitem);
                                    }
                                    if (childitem.childs.length > 0) {
                                        childitem.childs.map((subchilditem: any) => {
                                            if (subchilditem.Title != undefined) {
                                                subchilditem["Newlabel"] =
                                                    childitem["Newlabel"] + " > " + subchilditem.Title;
                                                AutoCompletePagesItemsArray.push(subchilditem);
                                            }
                                        });
                                    }
                                });
                            }
                        }
                    });
                }
                if (AutoCompletePagesItemsArray?.length > 0) {
                    AutoCompletePagesItemsArray = AutoCompletePagesItemsArray.reduce(function (previous: any, current: any) {
                        var alredyExists = previous.filter(function (item: any) {
                                return item.Title === current.Title;
                            }).length > 0;
                        if (!alredyExists) {
                            previous.push(current);
                        }
                        return previous;
                    }, []);
                }

                // ############## this is used for flittering time sheet category data from smartMetaData list ##########               
                setAllPagesData(AutoCompletePagesItemsArray);
            }
        } catch (error) {
            console.log("Error : ", error.message);
        }
    };
    //*******************Delete function***************************  */
    const deleteData = async () => {
        console.log("In Delete:");
        try {
            if (confirm("Are you sure, you want to delete this?")) {
                let web = new Web(props.Context.pageContext.web.absoluteUrl);
                await web.lists.getById('860a08d5-9711-4d8e-bd26-93fe09362bd4').items.getById(EventItem.Id).recycle().then((e) => {
                    console.log("Your information has been deleted");
                    callBack();

                });

                callBack();
            }
        } catch (error) {
            console.log("Error:", error.message);
        }
    }
    //*******************Delete function end*********************** */

    // **************************** Tagging/Untagging functionalities ***************************** */
        const autoSuggestionsForActivity = (e: any) => {
            let searchedKey: any = e.target.value;
            setActivitySearchKey(e.target.value);
            let tempArray: any = [];
            if (searchedKey?.length > 0) {
                AutoCompleteActivitiesItemsArray?.map((itemData: any) => {
                    if (
                        itemData.Newlabel.toLowerCase().includes(searchedKey.toLowerCase())
                    ) {
                        tempArray.push(itemData);
                    }
                });
                setSearchedActivityData(tempArray);
            } else {
                setSearchedActivityData([]);
            }
        };
        const autoSuggestionsForTopic = (e: any) => {
            let searchedKey: any = e.target.value;
            setTopicSearchKey(e.target.value);
            let tempArray: any = [];
            if (searchedKey?.length > 0) {
                AutoCompleteTopicsItemsArray?.map((itemData: any) => {
                    if (
                        itemData.Newlabel.toLowerCase().includes(searchedKey.toLowerCase())
                    ) {
                        tempArray.push(itemData);
                    }
                });
                setSearchedTopicData(tempArray);
            } else {
                setSearchedTopicData([]);
            }
        };
        const autoSuggestionsForPages = (e: any) => {
            let searchedKey: any = e.target.value;
            setPagesSearchKey(e.target.value);
            let tempArray: any = [];
            if (searchedKey?.length > 0) {
                AutoCompletePagesItemsArray?.map((itemData: any) => {
                    if (
                        itemData.Newlabel.toLowerCase().includes(searchedKey.toLowerCase())
                    ) {
                        tempArray.push(itemData);
                    }
                });
                setSearchedPagesData(tempArray);
            } else {
                setSearchedPagesData([]);
            }
        };
        const SelectCategoryCallBack = React.useCallback(
            (selectCategoryDataCallBack: any) => {
                if (taggingtype === 'Activities')
                    setSelectedActivityData(selectCategoryDataCallBack, "For-Panel");
                else if (taggingtype === 'Topics')
                    setSelectedTopicData(selectCategoryDataCallBack, "For-Panel");
                else if (taggingtype === 'Smart Pages')
                    setSelectedPagesData(selectCategoryDataCallBack, "For-Panel");
        }, []);
        const smartCategoryPopup = React.useCallback(() => {
            setIsComponentPicker(false);
        }, []);
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
    // **************************** Tagging/Untagging functionalities End***************************** */

    // ****************** get Activities,Topics,Pages Ids *********************************** */
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
        const setSmartTopicIds = (smartActivity: any) => {
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
        const setSmartPagesIds = (smartActivity: any) => {
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
    // ****************** End *********************************** */

    //*****************Save for Joint,GMBH Data Update***************************************** */
        const UpdateDetails = async () => {

            try {
                let postData: any;
                let smartactivityIds = setSmartActivityIds(ShareWebTypeData);
                let smartTopicIds = setSmartTopicIds(ShareWebTypeTopicData);
                let smartPagesIds = setSmartPagesIds(ShareWebTypePagesData);
                postData = {
                    Title: (EventItem?.Title),
                    ItemRank: EventItem?.ItemRank != null ? String(EventItem?.ItemRank) : null,
                    Event_x002d_Type: (EventItem?.Event_x002d_Type),
                    Description: EventItem?.ItemDescription,
                    AlternateLanguageDescription: (EventItem?.AlternateLanguageDescription),
                    EventDate: EventItem?.EventDate != undefined ? new Date(EventItem?.EventDate).toISOString() : null,
                    EndDate: EventItem?.EndDate != undefined ? new Date(EventItem?.EndDate).toISOString() : null,
                    SmartActivitiesId: { "results": smartactivityIds },
                    SmartTopicsId: { "results": smartTopicIds },
                    SmartPagesId: { "results": smartPagesIds },                               
                    // Item_x0020_Cover: {
                    //     "__metadata": { type: "SP.FieldUrlValue" },
                    //     Description: EventItem?.Item_x002d_Image != undefined ? EventItem?.Item_x002d_Image?.Url : (EventItem?.Item_x002d_Image != undefined ? EventItem?.Item_x002d_Image?.Url : ""),
                    //     Url: EventItem?.Item_x002d_Image != undefined ? EventItem?.Item_x002d_Image?.Url : (EventItem?.Item_x002d_Image != undefined ? EventItem?.Item_x002d_Image?.Url : "")
                    // },
                }

                if (EventItem?.Id != undefined) {
                    let web = new Web(props.Context.pageContext.web.absoluteUrl);
                    await web.lists.getById('860a08d5-9711-4d8e-bd26-93fe09362bd4').items.getById(EventItem?.Id).update(postData).then((e) => {
                        console.log("Your information has been updated successfully");
                        callBack()
                    });
                }

            } catch (error) {
                console.log("Error:", error.message);
            }

        }
    //*****************save function End *************** */
    const onRenderCustomHeaderEventCard = () => {
        return (
            <>
                <div className='subheading alignCenter'>Event Metadata - {EventItem?.Title}</div>
                <Tooltip />
            </>
        );
    };
    const imageta = (e: any) => {
        if (e) {
            setisOpenImageTab(true)
        }
    }
    const HtmlEditorCallBack = (items: any) => {
        console.log(items);
        var ItemDescription = ""
        if (items == '<p></p>\n') {
            ItemDescription = ""
        } else {
            ItemDescription = items
        }
        setEventItem({ ...EventItem, ItemDescription: ItemDescription })
    }
    const imageTabCallBack = React.useCallback((data: any) => {
        console.log(EventItem);
        console.log(data)
        if (data != undefined) {
            setEventItem(data);
        }
    }, [])
    const CustomFooter = () => {
        return (
            <footer className='bg-f4 fixed-bottom'>
                <div className='align-items-center d-flex justify-content-between px-4 py-2'>
                    <div>                       
                        <div> Created <span className='font-weight-normal siteColor'>{EventItem?.Created !== null ? moment(EventItem?.Created).format("DD/MM/YYYY HH:mm") : ""}&nbsp;</span> By <span className='font-weight-normal siteColor'>{EventItem?.Author?.Title}</span></div>
                        <div> Last modified <span className='font-weight-normal siteColor'>{EventItem?.Modified !== null ? moment(EventItem?.Modified).format("DD/MM/YYYY HH:mm") : ""}&nbsp;</span> By <span>{EventItem?.Editor?.Title}</span></div>
                        <div onClick={() => deleteData()} className="hreflink"><span style={{ marginLeft: '-4px' }} className="alignIcon hreflink svg__icon--trash svg__iconbox"></span>Delete this item</div>                       
                    </div>

                    <div className="footer-right">
                        <span className='pe-2'><a target="_blank" data-interception="off" href={`${props?.Context?._pageContext?._web?.absoluteUrl}/Events/Forms/EditForm.aspx?ID=${EventItem?.Id != null ? EventItem?.Id : null}`}>Open out-of-the-box form</a></span>
                        <button type='button' className='btn btn-primary mx-2' onClick={UpdateDetails}>
                            Save
                        </button>
                        <button type='button' className='btn btn-default' onClick={() => callBack()}>
                            Cancel
                        </button>
                    </div>
                </div>
            </footer>
        )
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
                <Tabs
                    defaultActiveKey="BASICINFORMATION"
                    transition={false}
                    id="noanim-tab-example"
                    className="rounded-0"
                    onSelect={imageta}
                >
                    <Tab eventKey="BASICINFORMATION" title="BASIC INFORMATION" className='p-0'>

                        <div className='border border-top-0 p-2'>                            
                            <div className='d-flex'>
                                <div className="input-group"><label className=" full-width ">Title </label>
                                    <input type="text" className="form-control" value={EventItem?.Title} onChange={(e) => setEventItem({ ...EventItem, Title: e.target.value })} />
                                </div>

                                <div className="input-group mx-4"><label className="full-width ">Location </label>
                                    <input type="text" className="form-control" value={EventItem?.Location} onChange={(e) => setEventItem({ ...EventItem, Location: e.target.value })} />
                                </div>
                                <div className="input-group">
                                    <label className="full-width">Item Rank</label>
                                    <select className={`${EventItem?.ItemRank === null && itemRanks[0]?.rank === '' ? 'colLight form-select' : 'form-select'}`} value={EventItem?.ItemRank} onChange={(e) => setEventItem({ ...EventItem, ItemRank: e.target.value })}>
                                        {itemRanks?.length > 0 && itemRanks?.map((itemRank: any, index: any) => {
                                            return (
                                                <option value={itemRank?.rank}>{itemRank?.rankTitle}</option>
                                            )
                                        })}
                                    </select>
                                </div>                                  
                            </div>
                            <div className='d-flex'>
                                <div className="input-group">
                                    <label className="full-width">Start date</label>
                                    {/* Format the date before setting it in the state */}
                                    <input type="date" className="form-control" value={EventItem?.EventDate != undefined ? moment(EventItem?.EventDate).format('YYYY-MM-DD') : null} onChange={(e) => setEventItem({ ...EventItem, EventDate: moment(e.target.value).format('YYYY-MM-DD') })} />
                                </div>

                                <div className="input-group mx-4 ms-5">
                                    <label className="full-width">End date</label>                                   
                                    <input type="date" className="form-control" value={EventItem?.EndDate != undefined ? moment(EventItem?.EndDate).format('YYYY-MM-DD') : null} onChange={(e) => setEventItem({ ...EventItem, EndDate: moment(e.target.value).format('YYYY-MM-DD') })} />
                                </div>  
                                <div className="input-group mx-4">
                                    <label className="full-width">Event Type</label>
                                    <select className={`${EventItem?.Event_x002d_Type === null ? 'colLight form-select' : 'form-select'}`} value={EventItem?.Event_x002d_Type} onChange={(e) => setEventItem({ ...EventItem, Event_x002d_Type: e.target.value })}>
                                        <option value={""}> Select</option>
                                        <option value={"Event"}>Event</option>
                                        <option value={"Training"}>Training</option>
                                    </select>
                                </div>
                                                          
                            </div>                            
                            <div className="mt-2">
                                <details>
                                    <summary><span>Event Tags</span></summary>
                                    <div className="expand-AccordionContent clearfix">
                                        <div className='col-sm-12 d-flex'>
                                            <div className="col-sm-4 me-3">
                                                <div className='input-group ms-1'>
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
                                                                onChange={(e) => autoSuggestionsForActivity(e)}
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
                                                                            onChange={(e) => autoSuggestionsForActivity(e)}
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
                                                        <span className="input-group-text" title="Smart Activities Popup" onClick={(e) => EditComponentPicker(EditData, "Activities")}>
                                                            <span className="svg__iconbox svg__icon--editBox"></span>
                                                        </span>                                                   
                                                </div>
                                            </div>
                                            <div className="col-sm-4 me-3">
                                                <div className='input-group ms-1'>
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
                                                            onChange={(e) => autoSuggestionsForTopic(e)}
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
                                                                        onChange={(e) => autoSuggestionsForTopic(e)}
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
                                                    <span className="input-group-text" title="Smart Topics Popup" onClick={(e) => EditComponentPicker(EditData, "Topics")}>
                                                        <span className="svg__iconbox svg__icon--editBox"></span>
                                                    </span>                                                    
                                                </div>
                                            </div>
                                            <div className="col-sm-4 me-3">
                                                <div className='input-group'>
                                                    <div className='form-label alignCenter full-width gap-1'>
                                                        <label className="form-label">Smart Pages</label>
                                                        {/* <CustomToolTip Description={'Tag the available Smart Pages'} /> */}
                                                    </div>
                                                    {ShareWebTypePagesData?.length > 1 ? <>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="txtCategories"
                                                            placeholder="Smart Pages"
                                                            value={PagesSearchKey}
                                                            onChange={(e) => autoSuggestionsForPages(e)}
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
                                                                        onChange={(e) => autoSuggestionsForPages(e)}
                                                                    />
                                                                    {SearchedPagesData?.length > 0 ? (
                                                                        <div className="SmartTableOnTaskPopup">
                                                                            <ul className="autosuggest-list maXh-200 scrollbar list-group">
                                                                                {SearchedPagesData.map((item: any) => {
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
                                                    <span className="input-group-text" title="Smart Pages Popup" onClick={(e) => EditComponentPicker(EditData, "Smart Pages")}>
                                                        <span className="svg__iconbox svg__icon--editBox"></span>
                                                    </span>
                                                </div>                                                
                                            </div>                                             
                                        </div>
                                    </div>
                                </details>
                            </div>

                            {EventItem != undefined && <div className='mt-3'> <label className="full-width form-label">Original Language Description</label> {EventItem?.Id != undefined && <HtmlEditorCard editorValue={EventItem?.Description != undefined ? EventItem?.Description : ""} HtmlEditorStateChange={HtmlEditorCallBack}> </HtmlEditorCard>}</div>}
                        </div>
                    </Tab>                   
                    <Tab eventKey="IMAGEINFORMATION" title="IMAGE INFORMATION" className='p-0'  >
                        <div className='border border-top-0 p-2'>
                            {isOpenImageTab && <ImageInformation EventItem={EventItem} setData={setEventItem} Context={props?.Context} callBack={imageTabCallBack} />}
                        </div>
                    </Tab>
                </Tabs>
               
            </Panel>
            {IsComponentPicker && (
                <Picker
                    props={EditData}
                    selectedCategoryData={tempCategoryData}
                    siteUrls={props.Context.pageContext.web.absoluteUrl}                    
                    CallBack={SelectCategoryCallBack}
                    closePopupCallBack={smartCategoryPopup}
                    usedFor={taggingtype}
                />
            )}
        </>
    )
}
export default Editpopup;