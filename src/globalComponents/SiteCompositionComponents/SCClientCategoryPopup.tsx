import * as React from "react";
import { useState, useEffect } from 'react';
import { Panel, PanelType } from 'office-ui-fabric-react';
import Tooltip from '../Tooltip';
import { Web } from "sp-pnp-js";

let AllClientCategoriesGlobalArray: any = []
let AllClientCategoriesForAutoSuggestion: any = []

const ClientCategoryPopup = (Props: any) => {
    const ContextValue = Props?.ContextValue;
    const siteUrls: string = ContextValue?.siteUrl;
    const SelectedClientCategories: any = Props?.SelectedCC;
    const SmartMetaDataListId: string = ContextValue?.SmartMetadataListID;
    const SelectedSiteName: string = Props?.CurrentSiteName;
    const ClosePopupCallback = Props?.ClosePopupCallback;

    // These are the states, used for the handling the Client Category Functionalities

    const [AllClientCategories, setAllClientCategories] = useState([]);
    const [ClientCategoryPopupStatus, setClientCategoryPopupStatus] = useState(true);
    const [SearchWithDescriptionStatus, setSearchWithDescriptionStatus] = useState(true);
    const [SearchedClientCategoryData, setSearchedClientCategoryData] = useState([]);
    let [SelectedCCData, setSelectedCCData] = useState(SelectedClientCategories ? SelectedClientCategories : [])
    const [searchedKey, setSearchedKey] = useState('');
    const [SelectedSiteClientCategoryData, setSelectedSiteClientCategoryData] = useState<any>([])

    useEffect(() => {
        GetAllClientCategories();
    }, [AllClientCategories])


    // This is used for Getting the all client categories from backend 

    const GetAllClientCategories = async () => {
        let AllClientCategoriesFlatData: any = [];
        const web = new Web(siteUrls);
        try {
            AllClientCategoriesFlatData = await web.lists
                .getById(SmartMetaDataListId)
                .items
                .select("Id,Title,listId,siteUrl,siteName,Item_x005F_x0020_Cover,ParentID,Configurations,EncodedAbsUrl,IsVisible,Created,Modified,Description1,SortOrder,Selectable,TaxType,Created,Modified,Author/Name,Author/Title,Editor/Name,Editor/Title,IsSendAttentionEmail/Id,IsSendAttentionEmail/Title,IsSendAttentionEmail/EMail")
                .expand('Author,Editor,IsSendAttentionEmail')
                .getAll();
            if (AllClientCategoriesFlatData?.length > 0) {
                let TempArray: any = [];
                AllClientCategoriesFlatData?.map((AllCCItem: any) => {
                    if (AllCCItem.TaxType == "Client Category") {
                        if (AllCCItem.Title == "e+i") {
                            AllCCItem.Title = "EI"
                        }
                        if (AllCCItem.Title == "PSE") {
                            AllCCItem.Title = "EPS"
                        }
                        TempArray.push(AllCCItem);
                    }
                })
                if (TempArray?.length > 0) {
                    buildClientCategoryAllDataArray(TempArray);
                }
            }
        } catch (error) {
            console.log("Error:", error.message);
        }
    }

    const buildClientCategoryAllDataArray = (dataItem: any) => {
        const finalArray: any = buildClientCategoryAllDataArrayRecursive(dataItem);
        let FinalArrayForAutoSuggestions: any = [];
        if (finalArray?.length > 0) {
            let TempCCItems: any = [];
            finalArray?.map((CCItems: any) => {
                if (CCItems.Title == SelectedSiteName) {
                    if (CCItems.Child?.length > 0) {
                        TempCCItems = CCItems.Child;
                    }
                }
            })
            if (TempCCItems?.length > 0) {
                setSelectedSiteClientCategoryData(TempCCItems);
                FinalArrayForAutoSuggestions = buildDataStructureForAutoSuggestions(TempCCItems);
            }
        }
        AllClientCategoriesForAutoSuggestion = FinalArrayForAutoSuggestions;
    };

    const buildClientCategoryAllDataArrayRecursive = (dataItem: any, parentId: number = 0) => {
        const result: any = [];
        dataItem.forEach((item: any) => {
            if (item.ParentID === parentId) {
                const newItem = { ...item, Child: [] };
                newItem.siteName = item.siteName;
                newItem.Child = buildClientCategoryAllDataArrayRecursive(dataItem, item.Id);
                result.push(newItem);
            }
        });
        return result;
    };

    const buildDataStructureForAutoSuggestions = (dataItem: any) => {
        const finalData: any = [];
        const processItemRecursively = (item: any, prefix: any) => {
            item.newLabel = prefix + ">" + item.Title;
            finalData.push(item);
            if (item.Child && item.Child.length > 0) {
                item.Child.forEach((child: any) => {
                    processItemRecursively(child, item.newLabel);
                });
            }
        };
        (dataItem || []).forEach((ccItemData: any) => {
            processItemRecursively(ccItemData, SelectedSiteName);
        });
        return finalData;
    };

    // This used for Removing Tagged Client Category 

    const RemoveTaggedClientCategory = (RemoveId: any) => {
        let TempArray: any = []
        SelectedCCData?.map((CCItem: any) => {
            if (CCItem.Id !== RemoveId) {
                TempArray.push(CCItem)
            }
        })
        setSelectedCCData([...TempArray])
    }

    // This is used for save selected client category 
    const saveSelectedClientCategoryData = () => {
        Props.saveClientCategory(SelectedCCData, SelectedSiteName);
        closeClientCategoryPopup("Save");
    }

    // This is used for Close client category Popup
    const closeClientCategoryPopup = (Type: any) => {
        setClientCategoryPopupStatus(false);
        ClosePopupCallback(Type);
    }

    // This is used for GLobal Search for client category Popup
    const filterDataRecursively = (data: any[], searchedKey: string, tempArray: any[]) => {
        data.forEach((item) => {
            if (
                item.newLabel?.toLowerCase().includes(searchedKey.toLowerCase()) ||
                item.Description1?.toLowerCase().includes(searchedKey.toLowerCase())
            ) {
                tempArray.push(item);
            }

            if (item.Child && item.Child.length > 0) {
                filterDataRecursively(item.Child, searchedKey, tempArray);
            }
        });
    };

    const AutoSuggestionForClientCategory = (e: any) => {
        const searchedKey: string = e.target.value;
        const tempArray: any = [];
        setSearchedKey(searchedKey);
        if (searchedKey.length > 0) {
            if (SearchWithDescriptionStatus) {
                if (AllClientCategoriesForAutoSuggestion?.length > 0) {
                    filterDataRecursively(AllClientCategoriesForAutoSuggestion, searchedKey, tempArray);
                    const SearchedData: any = tempArray.filter((val: any, id: any, array: any) => {
                        return array.indexOf(val) == id;
                    });
                    setSearchedClientCategoryData(SearchedData);
                }
            }
        } else {
            setSearchedClientCategoryData([]);
        }
    };

    const SelectClientCategoryFromAutoSuggestion = (selectedCategory: any, Type: any) => {
        setSearchedKey('');
        setSearchedClientCategoryData([]);
        SelectedClientCategoryFromDataList(selectedCategory, Type);
    }

    const SelectedClientCategoryFromDataList = (SelectedCC: any, Type: any) => {
        const newArray = addObjectToArrayIfNotExistsById(SelectedCCData, SelectedCC);
        setSelectedCCData([...newArray]);
    }

    function addObjectToArrayIfNotExistsById(jsonArray: any, newObject: any) {
        const newObjectId = newObject.Id;
        const exists = jsonArray.some((item: any) => item.Id === newObjectId);
        if (!exists) {
            jsonArray.push(newObject);
        }
        return jsonArray;
    }

    //    ************* this is Custom Header and Footer For Client Category Popup *****************

    const onRenderCustomClientCategoryHeader = () => {
        return (
            <div className="d-flex full-width pb-1">
                <div className="subheading">
                    <span>
                        {`Select ${SelectedSiteName} - Client Category`}
                    </span>
                </div>
                <Tooltip ComponentId="1626" />

            </div>
        )
    }

    const onRenderClientCategoryFooter = () => {
        return (
            <footer className="bg-f4 p-3" style={{ position: "absolute", width: "100%", bottom: "0" }}>
                <div className="alignCenter justify-content-between">
                    <div>
                        <div id="addNewTermDescription">
                            <p className="mb-1"> New items are added under the currently selected item.
                                <span><a className="hreflink" target="_blank" data-interception="off" href={`${siteUrls}/SitePages/SmartMetadata.aspx`} > Add New Item </a></span>
                            </p>
                        </div>
                        <div id="SendFeedbackTr">
                            <p className="mb-1">Make a request or send feedback to the Term Set manager.
                                <span><a className="hreflink" onClick={() => alert("We are working on it. This feature will be live soon..")}> Send Feedback </a></span>
                            </p>
                        </div>
                    </div>
                    <div>
                        <span>
                            <a className="siteColor mx-1" target="_blank" data-interception="off" href={`${siteUrls}/SitePages/SmartMetadata.aspx`} >
                                Manage Smart Taxonomy
                            </a>
                        </span>
                        <button type="button" className="btn btn-primary px-3 mx-1" onClick={() => saveSelectedClientCategoryData()} >
                            Save
                        </button>
                        <button type="button" className="btn btn-default me-1 px-3" onClick={closeClientCategoryPopup} >
                            Cancel
                        </button>
                    </div>

                </div>
            </footer>
        )
    }

    return (
        <section>
            {/* ********************* this Client Category Popup panel ****************** */}
            <Panel
                onRenderHeader={onRenderCustomClientCategoryHeader}
                isOpen={ClientCategoryPopupStatus}
                onDismiss={closeClientCategoryPopup}
                isBlocking={false}
                type={PanelType.custom}
                customWidth="900px"
                onRenderFooter={onRenderClientCategoryFooter} 
            >
                <div className="">
                    <div className='col-sm-12'>
                        <input type="checkbox" className="form-check-input me-1 rounded-0" defaultChecked={SearchWithDescriptionStatus} onChange={() => setSearchWithDescriptionStatus(SearchWithDescriptionStatus ? false : true)} /> <label>Include description (info-icons) in search</label>
                        <input className="form-control my-2" type='text' placeholder={`Search ${SelectedSiteName} Client Category`} value={searchedKey} onChange={(e) => AutoSuggestionForClientCategory(e)} />
                        {SearchedClientCategoryData?.length > 0 ? (
                            <div className="SearchTableCategoryComponent">
                                <ul className="list-group">
                                    {SearchedClientCategoryData.map((item: any) => {
                                        return (
                                            <li className="list-group-item rounded-0 list-group-item-action" key={item.id} onClick={() => SelectClientCategoryFromAutoSuggestion(item, "Popup")} >
                                                <a>{item.newLabel}</a>
                                            </li>
                                        )
                                    }
                                    )}
                                </ul>
                            </div>) : null}

                        <div className="border full-width ActivityBox">
                            {SelectedCCData?.length > 0 ? SelectedCCData?.map((SelectedCCItem: any) => {
                                return (
                                    <span className="block me-1">
                                        <span>{SelectedCCItem.Title}</span>
                                        <span
                                            onClick={() => RemoveTaggedClientCategory(SelectedCCItem.Id)}
                                            className="bg-light hreflink svg__icon--cross svg__iconbox ms-2">

                                        </span>
                                    </span>
                                )
                            })
                                : null}

                        </div>
                        {SelectedSiteClientCategoryData != undefined && SelectedSiteClientCategoryData.length > 0 ?
                            <ul className="categories-menu p-0">
                                {SelectedSiteClientCategoryData.map((item: any) => {
                                    if (item.Title !== "Blank") {
                                        return (
                                            <>
                                                <li>
                                                    <p
                                                        className='mb-0 hreflink'
                                                        onClick={() => SelectedClientCategoryFromDataList(item, "Popup")}
                                                    >
                                                        <a>
                                                            {item.Title}
                                                            {item.Description1 ? <div className='popover__wrapper ms-1' data-bs-toggle="tooltip" data-bs-placement="auto">
                                                                <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/infoIcon.png" />
                                                                <div className="popover__content">
                                                                    <span>{item.Description1}</span>
                                                                </div>
                                                            </div> : null}
                                                        </a>
                                                    </p>
                                                    <ul className="sub-menu clr">
                                                        {item.Child?.map(function (child1: any) {
                                                            return (
                                                                <>
                                                                    {child1.Title != null ?
                                                                        <li>
                                                                            <p
                                                                                className='mb-0 hreflink'
                                                                                onClick={() => SelectedClientCategoryFromDataList(child1, "Popup")}
                                                                            >
                                                                                <a>
                                                                                    {child1.Item_x0020_Cover ?
                                                                                        <img className="flag_icon"
                                                                                            style={{ height: "20px", borderRadius: "10px", border: "1px solid #000069" }}
                                                                                            src={child1.Item_x0020_Cover ? child1.Item_x0020_Cover.Url : ''}
                                                                                        /> :
                                                                                        null}
                                                                                    {child1.Title}
                                                                                    {child1.Description1 ? <div className='popover__wrapper ms-1' data-bs-toggle="tooltip" data-bs-placement="auto">
                                                                                        <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/infoIcon.png" />
                                                                                        <div className="popover__content">
                                                                                            <span>{child1.Description1}</span>
                                                                                        </div>
                                                                                    </div> : null}
                                                                                </a>
                                                                            </p>
                                                                            <ul className="sub-menu clr ps-2">
                                                                                {child1.Child?.map(function (child2: any) {
                                                                                    return (
                                                                                        <>
                                                                                            {child2.Title != null ?
                                                                                                <li>
                                                                                                    <p
                                                                                                        className='mb-0 hreflink'
                                                                                                        onClick={() => SelectedClientCategoryFromDataList(child1, "Popup")}
                                                                                                    >
                                                                                                        <a>
                                                                                                            {child2.Item_x0020_Cover ?
                                                                                                                <img className="flag_icon"
                                                                                                                    style={{ height: "20px", borderRadius: "10px", border: "1px solid #000069" }}
                                                                                                                    src={child2.Item_x0020_Cover ? child2.Item_x0020_Cover.Url : ''}
                                                                                                                /> :
                                                                                                                null}
                                                                                                            {child2.Title}
                                                                                                            {child2.Description1 ? <div className='popover__wrapper ms-1' data-bs-toggle="tooltip" data-bs-placement="auto">
                                                                                                                <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/infoIcon.png" />
                                                                                                                <div className="popover__content">
                                                                                                                    <span>{child2.Description1}</span>
                                                                                                                </div>
                                                                                                            </div> : null}
                                                                                                        </a>
                                                                                                    </p>
                                                                                                </li> : null
                                                                                            }
                                                                                        </>
                                                                                    )
                                                                                })}
                                                                            </ul>
                                                                        </li> : null
                                                                    }
                                                                </>
                                                            )
                                                        })}
                                                    </ul>
                                                </li>
                                            </>
                                        )
                                    }

                                })}
                            </ul>
                            : null}
                    </div>
                </div>
            </Panel>
        </section>
    )
}
export default ClientCategoryPopup;