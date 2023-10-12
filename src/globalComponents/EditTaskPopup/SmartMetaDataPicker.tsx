import * as React from "react";
import * as $ from 'jquery';
import { Panel, PanelType } from 'office-ui-fabric-react';
import "bootstrap/dist/css/bootstrap.min.css";
import { ImPriceTags } from 'react-icons/im';
import Tooltip from '../Tooltip';


var NewArray: any = []
var AutoCompleteItems: any = [];
var AutoCompleteItemsArray: any = [];
var SelectedCategoryBackupArray: any = [];
const Picker = (item: any) => {
    const usedFor = item.usedFor;
    const isServiceTask: any = item?.isServiceTask != undefined ? item.isServiceTask : item?.props?.Services?.length > 0 ? true : false;
    const AllListIdData: any = item?.AllListId;
    const siteUrls: any = item?.AllListId?.siteUrl;
    const selectedCategoryData: any = item.selectedCategoryData;
    const [PopupSmartTaxanomy, setPopupSmartTaxanomy] = React.useState(true);
    const [AllCategories, setAllCategories] = React.useState([]);
    const [select, setSelect] = React.useState([]);
    const [update, set] = React.useState([]);
    const [value, setValue] = React.useState("");
    const [selectedCategory, setSelectedCategory] = React.useState([]);
    const [searchedData, setSearchedData] = React.useState([]);
    const [isSearchWithDesciptions, setIsSearchWithDesciptions] = React.useState(true);
    const openPopupSmartTaxanomy = () => {
        setPopupSmartTaxanomy(true)
    }
    React.useEffect(() => {
        loadGmBHTaskUsers();
        if (selectedCategoryData != undefined && selectedCategoryData.length > 0) {
            setSelect(selectedCategoryData)
            selectedCategoryData?.map((selectedData: any) => {
                SelectedCategoryBackupArray.push(selectedData)
            })
        }
    }, [])
    const closePopupSmartTaxanomy = () => {
        setPopupSmartTaxanomy(false)
        if (usedFor == "Task-Footertable") {
            item?.Call(selectedCategoryData, "Category-Task-Footertable")
            NewArray = []
            SelectedCategoryBackupArray = [];
            setSelect([])
        } else {
            NewArray = []
            setSelect([])
            item?.Call()
            item?.closePopupCallBack();
            SelectedCategoryBackupArray = [];
        }

    }
    const saveCategories = () => {
        if (usedFor == "Task-Popup") {
            item.CallBack(SelectedCategoryBackupArray);
            NewArray = []
            SelectedCategoryBackupArray = [];
            setSelect([])
        }
        else if (usedFor == "Task-Footertable") {
            item?.Call(select, "Category-Task-Footertable")
            NewArray = []
            SelectedCategoryBackupArray = [];
            setSelect([])
        } else {
            item.props.categories = [];
            item.props.smartCategories = [];
            var title: any = {}
            // title.Title = select;
            item.props.smartCategories.push(title);
            item.props.categories = NewArray;
            Example(item, 'Category');
        }

    }
    var SmartTaxonomyName = "Categories";
    const loadGmBHTaskUsers = function () {
        var AllTaskusers = []
        var AllMetaData: any = []
        var TaxonomyItems: any = []
        var url = (`${siteUrls}/_api/web/lists/getbyid('${AllListIdData.SmartMetadataListID}')/items?$select=Id,Title,IsVisible,ParentID,SmartSuggestions,TaxType,Description1,Item_x005F_x0020_Cover,listId,siteName,siteUrl,SortOrder,SmartFilters,Selectable,IsSendAttentionEmail/Id,IsSendAttentionEmail/Title,IsSendAttentionEmail/EMail&$expand=IsSendAttentionEmail&$orderby=SortOrder&$top=4999&$filter=TaxType eq '` + SmartTaxonomyName + "'")
        $.ajax({
            url: url,
            method: "GET",
            headers: {
                "Accept": "application/json; odata=verbose"
            },
            success: function (data) {
                AllTaskusers = data.d.results;
                $.each(AllTaskusers, function (index: any, item: any) {
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
                TaxonomyItems = loadSmartTaxonomyPortfolioPopup(AllMetaData);
                setAllCategories(TaxonomyItems)
                setPopupSmartTaxanomy(true)
            },
            error: function (error) {
            }
        })
    };
    var loadSmartTaxonomyPortfolioPopup = (AllTaxonomyItems: any) => {
        var TaxonomyItems: any = [];
        var uniqueNames: any = [];
        $.each(AllTaxonomyItems, function (index: any, item: any) {
            if (item.ParentID == 0 && SmartTaxonomyName == item.TaxType) {
                TaxonomyItems.push(item);
                getChilds(item, AllTaxonomyItems);
                if (item.childs != undefined && item.childs.length > 0) {
                    TaxonomyItems.push(item)
                }
                uniqueNames = TaxonomyItems.filter((val: any, id: any, array: any) => {
                    return array.indexOf(val) == id;
                });
            }
        });
        return uniqueNames;
    }

    const getChilds = (item: any, items: any) => {
        item.childs = [];
        $.each(items, function (index: any, childItem: any) {
            if (childItem.ParentID != undefined && parseInt(childItem.ParentID) == item.ID) {
                childItem.isChild = true;
                item.childs.push(childItem);
                getChilds(childItem, items);
            }
        });
    }

    const selectPickerData = (item: any) => {
        if (usedFor == "Task-Popup" || usedFor == "Task-Footertable") {
            let tempArray: any = [];
            let checkDataExistCount = 0;
            if (SelectedCategoryBackupArray != undefined && SelectedCategoryBackupArray.length > 0) {
                SelectedCategoryBackupArray.map((CheckData: any) => {
                    if (CheckData.Title == item.Title) {
                        checkDataExistCount++;
                    }
                })
            }
            if (checkDataExistCount == 0) {
                tempArray.push(item);
            }
            SelectedCategoryBackupArray = select
            if (tempArray != undefined && tempArray.length > 0) {
                SelectedCategoryBackupArray = SelectedCategoryBackupArray.concat(tempArray)
            } else {
                SelectedCategoryBackupArray = SelectedCategoryBackupArray
            }
            // setSelect(SelectedCategoryBackupArray => ([...SelectedCategoryBackupArray]));
            setSelect(SelectedCategoryBackupArray);
        } else {
            NewArray.push(item)
            showSelectedData(NewArray);
            setValue('');
            setSearchedData([]);
        }
    }
    const showSelectedData = (itemss: any) => {
        var categoriesItem: any = []
        itemss.forEach(function (val: any) {
            if (val.Title != undefined) {
                categoriesItem.push(val);
            }
        })
        const uniqueNames = categoriesItem.filter((val: any, id: any, array: any) => {
            return array.indexOf(val) == id;
        })
        setSelect(uniqueNames)
    }
    function Example(callBack: any, type: any) {
        NewArray = []
        setSelect([])
        item?.Call(callBack.props, type);
    }
    const setModalIsOpenToFalse = () => {
        setPopupSmartTaxanomy(false)
    }
    const deleteSelectedCat = (val: any) => {
        select.map((valuee: any, index: any) => {
            if (val.Id == valuee.Id) {
                select.splice(index, 1)
            }
        })
        NewArray.map((valuee: any, index: any) => {
            if (val.Id == valuee.Id) {
                NewArray.splice(index, 1)
            }
        })
        setSelect(select => ([...select]));
    }
    // Autosuggestion

    const onChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setValue(event.target.value);
        let searchedKey: any = event.target.value;
        let tempArray: any = [];
        if (!isSearchWithDesciptions) {
            if (searchedKey?.length > 0) {
                AutoCompleteItemsArray.map((itemData: any) => {
                    if (itemData.Newlabel.toLowerCase().includes(searchedKey.toLowerCase())) {
                        tempArray.push(itemData);
                    }
                })
                setSearchedData(tempArray)
            } else {
                setSearchedData([]);
            }
        }
        else {
            if (searchedKey?.length > 0) {
                AutoCompleteItemsArray.map((itemData: any) => {
                    if (itemData.Description1 != null) {
                        if (itemData.Newlabel.toLowerCase().includes(searchedKey.toLowerCase()) || itemData.Description1.toLowerCase().includes(searchedKey.toLowerCase())) {
                            tempArray.push(itemData);
                        }
                    }
                })
                setSearchedData(tempArray)
            } else {
                setSearchedData([]);
            }
        }
    };
    if (AllCategories.length > 0) {
        AllCategories.map((item: any) => {
            if (item.newTitle != undefined) {
                item['Newlabel'] = item.newTitle;
                AutoCompleteItems.push(item)
                if (item.childs != null && item.childs != undefined && item.childs.length > 0) {
                    item.childs.map((childitem: any) => {
                        if (childitem.newTitle != undefined) {
                            childitem['Newlabel'] = item['Newlabel'] + ' > ' + childitem.Title;
                            AutoCompleteItems.push(childitem)
                        }
                        if (childitem.childs.length > 0) {
                            childitem.childs.map((subchilditem: any) => {
                                if (subchilditem.newTitle != undefined) {
                                    subchilditem['Newlabel'] = childitem['Newlabel'] + ' > ' + subchilditem.Title;
                                    AutoCompleteItems.push(subchilditem)
                                }
                            })
                        }
                    })
                }
            }
        })
    }

    AutoCompleteItemsArray = AutoCompleteItems.reduce(function (previous: any, current: any) {
        var alredyExists = previous.filter(function (item: any) {
            return item.Title === current.Title
        }).length > 0
        if (!alredyExists) {
            previous.push(current)
        }
        return previous
    }, [])

    const customFooter = () => {
        return (
            <footer className={isServiceTask || item?.props?.Portfolio_x0020_Type == "Service" ? "serviepannelgreena" : ""}>
                <span>
                    <a className="siteColor mx-1" target="_blank" data-interception="off" href={`{}/SitePages/SmartMetadata.aspx`} >Manage Smart Taxonomy</a>
                </span>
                <button type="button" className="btn btn-primary px-3 mx-1" onClick={saveCategories} >
                    Save
                </button>
            </footer>

        )
    }

    const customHeader = () => {
        return (
            <div className={isServiceTask || item?.props?.Portfolio_x0020_Type == "Service" ? "d-flex full-width pb-1 serviepannelgreena" : "d-flex full-width pb-1"} >
                <div style={{ marginRight: "auto", fontSize: "20px", fontWeight: "600", marginLeft: '20px' }}>
                    <h2 className="heading">Select Category</h2>
                </div>
                <Tooltip ComponentId="1741" />
            </div>
        )
    }


    return (
        <>
            <Panel
                onRenderHeader={customHeader}
                isOpen={PopupSmartTaxanomy}
                type={PanelType.custom}
                customWidth="850px"
                onDismiss={closePopupSmartTaxanomy}
                isBlocking={PopupSmartTaxanomy}
            // onRenderFooter={customFooter}
            >
                <div id="SmartTaxonomyPopup" className={(item?.props?.Portfolio_x0020_Type != undefined && item?.props?.Portfolio_x0020_Type == "Service") ? "serviepannelgreena" : ""}>
                    <div className={isServiceTask ? "modal-body serviepannelgreena" : "modal-body"}>


                        <div className="mb-3">
                            <div className="mb-2 col-sm-12 p-0">
                                <div>
                                    <input type="checkbox" defaultChecked={isSearchWithDesciptions} onChange={() => setIsSearchWithDesciptions(isSearchWithDesciptions ? false : true)} className="form-check-input me-1 rounded-0" /> <label>Include description (info-icons) in search</label>
                                    <input type="text" className="form-control  searchbox_height" value={value} onChange={onChange} placeholder="Search Category" />
                                    {searchedData?.length > 0 ? (
                                        <div className="SearchTableCategoryComponent">
                                            <ul className="list-group">
                                                {searchedData.map((item: any) => {
                                                    return (
                                                        <li className="list-group-item rounded-0 list-group-item-action" key={item.id} onClick={() => selectPickerData(item)} >
                                                            <a>{item.Newlabel}</a>
                                                        </li>
                                                    )
                                                }
                                                )}
                                            </ul>
                                        </div>) : null}
                                </div>
                            </div>
                            <div className="border full-width my-2 p-2 pb-1 ActivityBox">
                                {select.map((val: any) => {
                                    return (
                                        <span className="bg-69 p-1 ps-2 me-1"> {val.Title}
                                            <a className="hreflink" onClick={() => deleteSelectedCat(val)}>
                                                <span className="bg-light svg__icon--cross svg__iconbox"></span>
                                            </a>
                                        </span>
                                    )
                                })}

                            </div>

                        </div>
                        <div className='col-sm-12 categScroll'>
                            <ul className="categories-menu p-0">
                                {AllCategories.map(function (item: any) {
                                    return (
                                        <>
                                            <li>
                                                {item.Item_x005F_x0020_Cover != null &&
                                                    <p onClick={() => selectPickerData(item)} className='mb-0 hreflink' >
                                                        <a>
                                                            <img className="flag_icon"
                                                                style={{ height: "12px", width: "18px" }} src={item.Item_x005F_x0020_Cover.Url} />
                                                            {item.Title}
                                                        </a>
                                                    </p>
                                                }
                                                <ul className="sub-menu clr mar0">
                                                    {item.childs?.map(function (child1: any) {
                                                        return (
                                                            <>
                                                                {child1.Title != null ?
                                                                    <li>
                                                                        <p onClick={() => selectPickerData(child1)} className='mb-0 hreflink'>
                                                                            <a>
                                                                                {child1.Item_x005F_x0020_Cover ? <img className="flag_icon"
                                                                                    style={{ height: "12px", width: "18px;" }}
                                                                                    src={child1.Item_x005F_x0020_Cover.Url} /> :
                                                                                    null}
                                                                                {child1.Title}
                                                                                {child1.Description1 ? <div className='popover__wrapper ms-1' data-bs-toggle="tooltip" data-bs-placement="auto">
                                                                                    <span className="svg__iconbox svg__icon--info"></span>
                                                                                    <div className="popover__content">
                                                                                        <span>{child1.Description1}</span>
                                                                                    </div>
                                                                                </div> : null}

                                                                            </a>
                                                                        </p>

                                                                        <ul className="sub-menu clr mar0">
                                                                            {
                                                                                child1.childs?.map((subChilds: any) => {
                                                                                    return (
                                                                                        <li>
                                                                                            <p onClick={() => selectPickerData(subChilds)} className='mb-0 hreflink'>
                                                                                                <a>
                                                                                                    {subChilds.Item_x005F_x0020_Cover ? <img className="flag_icon"
                                                                                                        style={{ height: "12px", width: "18px;" }}
                                                                                                        src={subChilds.Item_x005F_x0020_Cover.Url} /> :
                                                                                                        null}
                                                                                                    {subChilds.Title}
                                                                                                    {subChilds.Description1 ? <div className='popover__wrapper ms-1' data-bs-toggle="tooltip" data-bs-placement="auto">
                                                                                                        <span className="svg__iconbox svg__icon--info"></span>
                                                                                                        <div className="popover__content">
                                                                                                            <span ng-bind-html="child1.Description1 | trustedHTML">{subChilds.Description1}</span>
                                                                                                        </div>
                                                                                                    </div> : null}

                                                                                                </a>
                                                                                            </p>
                                                                                        </li>
                                                                                    )
                                                                                })
                                                                            }
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
                                })}
                            </ul>
                        </div>
                    </div>
                    <footer className={isServiceTask ? "serviepannelgreena fixed-bottom bg-f4 p-2" : "fixed-bottom bg-f4 p-2"}>
                        <div className="alignCenter justify-content-between me-3">
                            <div className="mb-0 pull-left">
                                <div id="addNewTermDescription">
                                    <p className="mb-1"> New items are added under the currently selected item.
                                        <span><a className="hreflink" target="_blank" data-interception="off" href={`${siteUrls}/SitePages/SmartMetadata.aspx`} > Add New Item </a></span>
                                    </p>
                                </div>
                                <div id="SendFeedbackTr">
                                    <p className="mb-1">Make a request or send feedback to the Term Set manager.
                                        <span><a className="hreflink"> Send Feedback </a></span>
                                    </p>
                                </div>
                            </div>
                            <div className="pull-right">
                                <span>
                                    <a className="siteColor mx-1" target="_blank" data-interception="off" href={`${siteUrls}/SitePages/SmartMetadata.aspx`} >Manage Smart Taxonomy</a>
                                </span>
                                <button type="button" className="btn btn-primary px-3 mx-1" onClick={saveCategories} >
                                    Save
                                </button>
                            </div>
                        </div>
                    </footer>
                </div>
            </Panel>
        </>
    )
}
export default Picker;