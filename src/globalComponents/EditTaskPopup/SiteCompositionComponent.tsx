import * as React from "react";
import { useState, useEffect } from 'react';
import { Panel, PanelType } from 'office-ui-fabric-react';
import { ImPriceTags } from 'react-icons/im';
import Tooltip from "../Tooltip";

let AutoCompleteItemsArray: any = [];
const SiteCompositionComponent = (Props: any) => {
    const SiteData = Props.SiteTypes;
    const ClientTime = Props.ClientTime;
    const siteUrls = Props.siteUrls;
    const TotalTime = Props.SmartTotalTimeData;
    const callBack = Props.callBack;
    const currentListName = Props.currentListName;
    const ServicesTaskCheck = Props.isServiceTask
    const [SiteTypes, setSiteTypes] = useState([]);
    const [selectedSiteCount, setSelectedSiteCount] = useState(Props.ClientTime.length);
    const [ProportionalStatus, setProportionalStatus] = useState(true);
    const [ClientTimeData, setClientTimeData] = useState([]);
    const [ClientCategoryPopupStatus, setClientCategoryPopupStatus] = useState(false);
    const [AllClientCategoryData, setAllClientCategoryData] = useState([]);
    const [SelectedSiteClientCategoryData, setSelectedSiteClientCategoryData] = useState([]);
    const SiteCompositionSettings = JSON.parse(Props.SiteCompositionSettings);
    useEffect(() => {
        setSiteTypes(SiteData);
        let tempData: any = [];
        let tempData2: any = [];
        setClientTimeData(ClientTime);
        loadAllCategoryData();
        if (SiteData != undefined && SiteData.length > 0) {
            SiteData.map((SiteItem: any) => {
                if (SiteItem.Title !== "Health" && SiteItem.Title !== "Offshore Tasks" && SiteItem.Title !== "Gender" && SiteItem.Title !== "Small Projects") {
                    tempData.push(SiteItem);
                }
            })
            if (tempData != undefined && tempData.length > 0) {
                tempData?.map((data: any) => {
                    ClientTime?.map((ClientItem: any) => {
                        if (ClientItem.SiteName == data.Title || (ClientItem.SiteName ==
                            "DA E+E" && data.Title == "ALAKDigital")) {
                            data.BtnStatus = true
                        }
                    })
                    tempData2.push(data);
                })
            }
            setSiteTypes(tempData2);
        }
    }, [])



    const selectSiteCompositionFunction = (e: any, Index: any) => {
        let TempArray: any = [];
        if (SiteTypes != undefined && SiteTypes.length > 0) {
            SiteTypes.map((DataItem: any, DataIndex: any) => {
                if (DataIndex == Index) {
                    if (DataItem.BtnStatus) {
                        DataItem.BtnStatus = false
                        setSelectedSiteCount(selectedSiteCount - 1);
                        let TempArray: any = [];
                        if (ClientTimeData != undefined && ClientTimeData.length > 0) {
                            ClientTimeData.map((Data: any) => {
                                if (Data.SiteName != DataItem.Title) {
                                    TempArray.push(Data)
                                }
                            })
                        }
                        let tempDataForRemove: any = [];
                        TempArray?.map((dataItem: any) => {
                            dataItem.ClienTimeDescription = (100 / (selectedSiteCount - 1)).toFixed(1);
                            tempDataForRemove.push(dataItem);
                        })
                        setClientTimeData(tempDataForRemove);
                        callBack(tempDataForRemove);
                    } else {
                        DataItem.BtnStatus = true
                        setSelectedSiteCount(selectedSiteCount + 1);
                        const object = {
                            SiteName: DataItem.Title,
                            ClienTimeDescription: (100 / (selectedSiteCount + 1)).toFixed(1),
                            localSiteComposition: true,
                            siteIcons: DataItem.Item_x005F_x0020_Cover
                        }
                        ClientTime.push(object);
                        let tempData: any = [];
                        ClientTime?.map((TimeData: any) => {
                            TimeData.ClienTimeDescription = (100 / (selectedSiteCount + 1)).toFixed(1);
                            tempData.push(TimeData);
                        })
                        setClientTimeData(tempData);
                        callBack(tempData);
                    }
                }
                TempArray.push(DataItem)
            })
        }
        setSiteTypes(TempArray);
    }

    const ChangeSiteCompositionSettings = (Type: any) => {
        if (Type == "Proportional") {
            const object = { ...SiteCompositionSettings[0], Proportional: true, Manual: false, Portfolio: false }
            SiteCompositionSettings[0] = object;
            setProportionalStatus(true);
        }
        if (Type == "Manual") {
            const object = { ...SiteCompositionSettings[0], Proportional: false, Manual: true, Portfolio: false }
            SiteCompositionSettings[0] = object;
            setProportionalStatus(false);
        }
        if (Type == "Portfolio") {
            const object = { ...SiteCompositionSettings[0], Proportional: false, Manual: false, Portfolio: true }
            SiteCompositionSettings[0] = object;
            setProportionalStatus(true);
        }

    }

    //    ************** this is for Client Category Popup Functions **************

    // ********** this is for Client Category Related all function and callBack function for Picker Component Popup ********
    var SmartTaxonomyName = "Client Category";
    var AutoCompleteItems: any = [];
    const loadAllCategoryData = function () {
        var AllTaskUsers = []
        var AllMetaData: any = []
        var TaxonomyItems: any = []
        var url = ("https://hhhhteams.sharepoint.com/sites/HHHH/sp/_api/web/lists/getbyid('01a34938-8c7e-4ea6-a003-cee649e8c67a')/items?$select=Id,Title,IsVisible,ParentID,SmartSuggestions,TaxType,Description1,Item_x005F_x0020_Cover,listId,siteName,siteUrl,SortOrder,SmartFilters,Selectable,IsSendAttentionEmail/Id,IsSendAttentionEmail/Title,IsSendAttentionEmail/EMail&$expand=IsSendAttentionEmail&$orderby=SortOrder&$top=4999&$filter=TaxType eq '" + SmartTaxonomyName + "'")
        $.ajax({
            url: url,
            method: "GET",
            headers: {
                "Accept": "application/json; odata=verbose"
            },
            success: function (data) {
                AllTaskUsers = data.d.results;
                $.each(AllTaskUsers, function (index: any, item: any) {
                    if (item.Title.toLowerCase() == 'pse' && item.TaxType == 'Client Category') {
                        item.newTitle = 'EPS';
                    }
                    else if (item.Title.toLowerCase() == 'e+i' && item.TaxType == 'Client Category') {
                        item.newTitle = 'EI';
                    }
                    else if (item.Title.toLowerCase() == 'education' && item.TaxType == 'Client Category') {
                        item.newTitle = 'Education';
                    }
                    else {
                        item.newTitle = item.Title;
                    }
                    AllMetaData.push(item);

                })
                // TaxonomyItems = loadSmartTaxonomyPortfolioPopup(AllMetaData);
                // console.log("All meta data in Function ============================ ", AllMetaData)
                setAllClientCategoryData(AllMetaData)
            },
            error: function (error: any) {
                console.log('Error:', error)
            }
        })
    };
    // var loadSmartTaxonomyPortfolioPopup = (AllTaxonomyItems: any) => {
    //     var TaxonomyItems: any = [];
    //     var uniqueNames: any = [];
    //     $.each(AllTaxonomyItems, function (index: any, item: any) {
    //         if (item.ParentID == 0 && SmartTaxonomyName == item.TaxType) {
    //             TaxonomyItems.push(item);
    //             getChilds(item, AllTaxonomyItems);
    //             if (item.childs != undefined && item.childs.length > 0) {
    //                 TaxonomyItems.push(item)
    //             }
    //             uniqueNames = TaxonomyItems.filter((val: any, id: any, array: any) => {
    //                 return array.indexOf(val) == id;
    //             });

    //         }
    //     });
    //     return uniqueNames;
    // }
    // const getChilds = (item: any, items: any) => {
    //     item.childs = [];
    //     $.each(items, function (index: any, childItem: any) {
    //         if (childItem.ParentID != undefined && parseInt(childItem.ParentID) == item.ID) {
    //             childItem.isChild = true;
    //             item.childs.push(childItem);
    //             getChilds(childItem, items);
    //         }
    //     });
    // }

    // if (AllClientCategoryData?.length > 0) {
    //     AllClientCategoryData?.map((item: any) => {
    //         if (item.newTitle != undefined) {
    //             item['Newlabel'] = item.newTitle;
    //             AutoCompleteItems.push(item)
    //             if (item.childs != null && item.childs != undefined && item.childs.length > 0) {
    //                 item.childs.map((childitem: any) => {
    //                     if (childitem.newTitle != undefined) {
    //                         childitem['Newlabel'] = item['Newlabel'] + ' > ' + childitem.Title;
    //                         AutoCompleteItems.push(childitem)
    //                     }
    //                     if (childitem.childs.length > 0) {
    //                         childitem.childs.map((subchilditem: any) => {
    //                             if (subchilditem.newTitle != undefined) {
    //                                 subchilditem['Newlabel'] = childitem['Newlabel'] + ' > ' + subchilditem.Title;
    //                                 AutoCompleteItems.push(subchilditem)
    //                             }
    //                         })
    //                     }
    //                 })
    //             }
    //         }
    //     })
    // }

    AutoCompleteItemsArray = AutoCompleteItems.reduce(function (previous: any, current: any) {
        var alredyExists = previous.filter(function (item: any) {
            return item.Title === current.Title
        }).length > 0
        if (!alredyExists) {
            previous.push(current)
        }
        return previous
    }, [])

    const openClientCategoryModel = (SiteParentId: any) => {
        let ParentArray: any = [];
        if (AllClientCategoryData != undefined && AllClientCategoryData.length > 0) {
            AllClientCategoryData?.map((ArrayData: any) => {
                if (ArrayData.ParentId == SiteParentId) {
                    ArrayData.Child = [];
                    ParentArray.push(ArrayData)
                }
            })
        }
        if (ParentArray != undefined && ParentArray.length > 0) {
            ParentArray.map((parentArray: any) => {
                AllClientCategoryData.map((AllData: any) => {
                    if (parentArray.Id == AllData.ParentId) {
                        parentArray.Child.push(AllData);
                    }
                })
            })
        }
        setSelectedSiteClientCategoryData(ParentArray);
        setClientCategoryPopupStatus(true);
    }
    const closeClientCategoryPopup = () => {
        setClientCategoryPopupStatus(false)
    }
    const onRenderCustomClientCategoryHeader = () => {
        return (
            <div className={ServicesTaskCheck ? "d-flex full-width pb-1 serviepannelgreena" : "d-flex full-width pb-1"} >
                <div style={{ marginRight: "auto", fontSize: "20px", fontWeight: "600", marginLeft: '20px' }}>
                    <span>
                        Select Client Category
                    </span>
                </div>
                <Tooltip ComponentId="1626" />
            </div>
        )
    }



    return (
        <div className={ServicesTaskCheck ? "serviepannelgreena" : ""}>
            {console.log("All Category Data in Div ======", AllClientCategoryData)}
            <div className="row">
                <a target="_blank " className="text-end siteColor" href="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/TaskUser-Management.aspx">
                    Task User Management
                </a>
            </div>

            <div className="col-sm-12 ps-3">
                <input
                    type="radio"
                    id="Proportional"
                    defaultChecked={SiteCompositionSettings ? SiteCompositionSettings[0].Proportional : false}
                    onChange={() => ChangeSiteCompositionSettings("Proportional")}
                    name="SiteCompositions"
                    value={SiteCompositionSettings ? SiteCompositionSettings[0].Proportional : false}
                    title="add Proportional Time"
                    className="mx-1"
                />
                <label>Proportional</label>
                <input
                    type="radio"
                    id="Manual"
                    name="SiteCompositions"
                    defaultChecked={SiteCompositionSettings ? SiteCompositionSettings[0].Manual : false}
                    title="add manual Time"
                    className="mx-1"
                    value={SiteCompositionSettings ? SiteCompositionSettings[0].Manual : false}
                    onChange={() => ChangeSiteCompositionSettings("Manual")}
                />
                <label>Manual</label>
                <input
                    type="radio"
                    id="Portfolio"
                    name="SiteCompositions"
                    defaultChecked={SiteCompositionSettings ? SiteCompositionSettings[0].Portfolio : false}
                    title="Portfolio"
                    ng-model="EqualType"
                    value={SiteCompositionSettings ? SiteCompositionSettings[0].Portfolio : false}
                    onChange={() => ChangeSiteCompositionSettings("Portfolio")}
                    className="mx-1" />
                <label>
                    Portfolio
                </label>
                <img className="mt-0 siteColor mx-1" title="Click here to edit tagged portfolio site composition." ng-click="OpenPortfolioPopup()" ng-src="/sites/HHHH/SiteCollectionImages/ICONS/32/icon_inline.png" src="/sites/HHHH/SiteCollectionImages/ICONS/32/icon_inline.png" />
                <span className="pull-right">
                    <input type="checkbox" ng-model="checkCompositionType" ng-click="inheritSiteComposition(checkCompositionType)" className="form-check-input mb-0 ms-2 mt-1 mx-1 rounded-0" />
                    <label>
                        Overridden
                    </label>
                </span>
            </div>

            <div className="my-2 ps-3">
                <table className="table table-bordered mb-1">
                    {SiteTypes != undefined && SiteTypes.length > 0 ?
                        <tbody>
                            {SiteTypes?.map((siteData: any, index: any) => {
                                if (siteData.Title !== "Health" && siteData.Title !== "Offshore Tasks" && siteData.Title !== "Gender" && siteData.Title !== "Small Projects") {
                                    return (
                                        <tr>
                                            <th scope="row" className="m-0 p-1 align-middle" style={{ width: "3%" }}>
                                                <input
                                                    className="form-check-input rounded-0" type="checkbox"
                                                    defaultChecked={siteData.BtnStatus}
                                                    value={siteData.BtnStatus}
                                                    onChange={(e) => selectSiteCompositionFunction(e, index)}
                                                />
                                            </th>
                                            <td className="m-0 p-0 align-middle" style={{ width: "30%" }}>
                                                <img src={siteData.Item_x005F_x0020_Cover ? siteData.Item_x005F_x0020_Cover.Url : ""} style={{ width: '25px' }} className="mx-2" />
                                                {siteData.Title}
                                            </td>
                                            <td className="m-0 p-1" style={{ width: "12%" }}>
                                                <input type="number" min="1" style={ProportionalStatus && siteData.BtnStatus ? { cursor: "not-allowed" } : {}} defaultValue={siteData.BtnStatus ? (100 / selectedSiteCount).toFixed(2) : ""} value={siteData.BtnStatus ? (100 / selectedSiteCount).toFixed(2) : ""} className="form-control p-1" ng-change="TimeChange(site)" ng-disabled="site.flag ==false || EqualType=='Portfolio' || EqualType=='Proportional'" readOnly={ProportionalStatus}
                                                />
                                            </td>
                                            <td className="m-0 p-1 align-middle" style={{ width: "3%" }}>
                                                <span ng-show="site.flag ==true" className="ng-binding ng-hide">{siteData.BtnStatus ? "%" : ''}</span>
                                            </td>
                                            <td className="m-0 p-1 align-middle" style={{ width: "12%" }}>
                                                <span ng-show="site.flag ==true" className="ng-binding ng-hide">{siteData.BtnStatus && TotalTime ? (TotalTime / selectedSiteCount).toFixed(2) + " h" : siteData.BtnStatus ? "0 h" : null}</span>
                                            </td>
                                            <td className="m-0 p-1 align-middle" style={{ width: "36%" }}>

                                                {siteData.Title == "EI" && (currentListName.toLowerCase() == "ei" || currentListName.toLowerCase() == "shareweb") ?
                                                    <div className="input-group">
                                                        <input type="text" style={siteData.BtnStatus ? {} : { cursor: "not-allowed" }} className="border-secondary form-control" placeholder="Client Category" readOnly={siteData.BtnStatus ? false : true} />
                                                        {siteData.BtnStatus ?
                                                            <a className="border border-secondary"
                                                                onClick={() => openClientCategoryModel(340)}
                                                            >
                                                                <img src={require('../../Assets/ICON/edit_page.svg')} width="25" />
                                                            </a>
                                                            : null}
                                                    </div>
                                                    : null}
                                                {siteData.Title == "EPS" && (currentListName.toLowerCase() == "eps" || currentListName.toLowerCase() == "shareweb") ?
                                                    <div className="input-group">
                                                        <input type="text" style={siteData.BtnStatus ? {} : { cursor: "not-allowed" }} className="border-secondary form-control" placeholder="Client Category" readOnly={siteData.BtnStatus ? false : true} />
                                                        {siteData.BtnStatus ?
                                                            <a className="border border-secondary"
                                                                onClick={() => openClientCategoryModel(341)}
                                                            >
                                                                <img src={require('../../Assets/ICON/edit_page.svg')} width="25" />
                                                            </a>

                                                            : null}
                                                    </div>
                                                    : null}
                                                {siteData.Title == "Education" && (currentListName.toLowerCase() == "education" || currentListName.toLowerCase() == "shareweb") ?
                                                    <div className="input-group">
                                                        <input type="text" style={siteData.BtnStatus ? {} : { cursor: "not-allowed" }} className="border-secondary form-control" placeholder="Client Category" readOnly={siteData.BtnStatus ? false : true} />
                                                        {siteData.BtnStatus ?
                                                            <a className="border border-secondary"
                                                                onClick={() => openClientCategoryModel(344)}
                                                            >
                                                                <img src={require('../../Assets/ICON/edit_page.svg')} width="25" />
                                                            </a>

                                                            : null}
                                                    </div>
                                                    : null}
                                                {siteData.Title == "Migration" && (currentListName.toLowerCase() == "migration" || currentListName.toLowerCase() == "shareweb") ?
                                                    <div className="input-group">
                                                        <input type="text" style={siteData.BtnStatus ? {} : { cursor: "not-allowed" }} className="border-secondary form-control" placeholder="Client Category" readOnly={siteData.BtnStatus ? false : true} />
                                                        {siteData.BtnStatus ?
                                                            <a className="border border-secondary"
                                                                onClick={() => openClientCategoryModel(569)}
                                                            >
                                                                <img src={require('../../Assets/ICON/edit_page.svg')} width="25" />
                                                            </a>

                                                            : null}
                                                    </div>
                                                    : null}

                                            </td>
                                        </tr>
                                    )
                                }
                            })}
                        </tbody>
                        : null}
                </table>
                <div className="bg-secondary d-flex justify-content-end p-1 shadow-lg">
                    <div className="bg-body col-sm-2 p-1">
                        <div className="">100%</div>
                    </div>
                    <div className="bg-body col-sm-2 p-1 mx-2">
                        <div className="">{TotalTime ? TotalTime : 0}</div>
                    </div>
                </div>
            </div>
            {/* ********************* this Client Category panel ****************** */}
            <Panel
                onRenderHeader={onRenderCustomClientCategoryHeader}
                isOpen={ClientCategoryPopupStatus}
                onDismiss={closeClientCategoryPopup}
                isBlocking={ClientCategoryPopupStatus}
                type={PanelType.medium}
            >
                <div className={ServicesTaskCheck ? "serviepannelgreena" : ""} >
                    <div className="">
                        <div className="row">
                            <div className="d-flex text-muted pt-3 showCateg">
                                <ImPriceTags />
                                <div className="pb-3 mb-0">
                                    <div id="addNewTermDescription">
                                        <p className="mb-1"> New items are added under the currently selected item.
                                            <span><a className="hreflink" target="_blank" data-interception="off" href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/SmartMetadata.aspx`} > Add New Item </a></span>
                                        </p>
                                    </div>
                                    <div id="SendFeedbackTr">
                                        <p className="mb-1">Make a request or send feedback to the Term Set manager.
                                            <span><a className="hreflink" ng-click="sendFeedback();"> Send Feedback </a></span>
                                        </p>
                                    </div>
                                    {/* <div className="block col p-1"> {select}</div> */}
                                </div>
                                <div className="d-end">
                                    <button type="button" className="btn btn-primary">
                                        OK
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className='col-sm-12 categScroll' style={{ height: "auto" }}>
                            {/* <input className="form-control my-2" type='text' placeholder="Search Name Here!" value={ApproverSearchKey} onChange={(e) => autoSuggestionsForApprover(e, "OnPanel")} />
                            {ApproverSearchedDataForPopup?.length > 0 ? (
                                <div className="SearchTableCategoryComponent">
                                    <ul className="list-group">
                                        {ApproverSearchedDataForPopup.map((item: any) => {
                                            return (
                                                <li className="list-group-item rounded-0 list-group-item-action" key={item.id} onClick={() => SelectApproverFromAutoSuggestion(item)} >
                                                    <a>{item.NewLabel}</a>
                                                </li>
                                            )
                                        }
                                        )}
                                    </ul>
                                </div>) : null} */}

                            {/* <div className="border full-width my-2 p-2">
                                {ApproverData?.map((val: any) => {
                                    return (
                                        <>
                                            <span>
                                                <a className="hreflink block p-1 px-2 mx-1" ng-click="removeSmartArray(item.Id)"> {val.Title}
                                                    <svg onClick={() => setApproverData([])} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M31.2312 14.9798C27.3953 18.8187 24.1662 21.9596 24.0553 21.9596C23.9445 21.9596 20.7598 18.8632 16.9783 15.0787C13.1967 11.2942 9.96283 8.19785 9.79199 8.19785C9.40405 8.19785 8.20673 9.41088 8.20673 9.80398C8.20673 9.96394 11.3017 13.1902 15.0844 16.9734C18.8672 20.7567 21.9621 23.9419 21.9621 24.0516C21.9621 24.1612 18.8207 27.3951 14.9812 31.2374L8 38.2237L8.90447 39.1119L9.80893 40L16.8822 32.9255L23.9556 25.851L30.9838 32.8802C34.8495 36.7464 38.1055 39.9096 38.2198 39.9096C38.4742 39.9096 39.9039 38.4689 39.9039 38.2126C39.9039 38.1111 36.7428 34.8607 32.8791 30.9897L25.8543 23.9512L32.9271 16.8731L40 9.79501L39.1029 8.8975L38.2056 8L31.2312 14.9798Z" fill="#fff" /></svg>
                                                </a>
                                            </span>
                                        </>
                                    )
                                })}
                            </div> */}
                            {console.log("Selected Site All data ================", SelectedSiteClientCategoryData)}
                            {SelectedSiteClientCategoryData != undefined && SelectedSiteClientCategoryData.length > 0 ?
                                <ul className="categories-menu p-0">
                                    {SelectedSiteClientCategoryData.map(function (item: any) {
                                        return (
                                            <>
                                                <li>
                                                    <p className='mb-0 hreflink' >
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
                                                    <ul ng-if="item.childs.length>0" className="sub-menu clr mar0">
                                                        {item.Child?.map(function (child1: any) {
                                                            return (
                                                                <>
                                                                    {child1.Title != null ?
                                                                        <li>
                                                                            <p className='mb-0 hreflink'>
                                                                                <a>
                                                                                    {child1.Item_x0020_Cover ? <img className="flag_icon"
                                                                                        style={{ height: "20px", borderRadius: "10px", border: "1px solid #000069" }}
                                                                                        src={child1.Item_x0020_Cover ? child1.Item_x0020_Cover.Url : ''} /> :
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
                                                                        </li> : null
                                                                    }
                                                                </>
                                                            )
                                                        })}
                                                    </ul>
                                                </li>
                                            </>
                                        )
                                    })}
                                </ul>
                                : null}

                        </div>
                    </div>
                    <footer className="float-end mt-1">
                        <button type="button" className="btn btn-primary px-3 mx-1" >
                            Save
                        </button>
                        <button type="button" className="btn btn-default px-3" >
                            Cancel
                        </button>
                    </footer>
                </div>
            </Panel>
        </div>
    )
}
export default SiteCompositionComponent;