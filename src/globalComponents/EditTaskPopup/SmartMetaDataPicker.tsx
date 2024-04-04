import * as React from "react";
import * as $ from 'jquery';
import { Panel, PanelType } from 'office-ui-fabric-react';
import "bootstrap/dist/css/bootstrap.min.css";
import { ImPriceTags } from 'react-icons/im';
import Tooltip from '../Tooltip';
import { SlArrowRight } from "react-icons/sl";
import { BsSearch } from 'react-icons/bs';


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
    const [isHovered, setIsHovered] = React.useState(false)
    const [FirstHoveredItemId, setFirstHoveredItemId] = React.useState(null)
    const [SecondHoveredItemId, setSecondHoveredItemId] = React.useState(null)
    const [ThirdHoveredItemId, setThirdHoveredItemId] = React.useState(null)
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
        }
        else if (usedFor == "Task-Profile") {
            item.Call(select, "Category-Task-Footertable")
            NewArray = []
            SelectedCategoryBackupArray = [];
            setSelect([])
        }  else {
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
        if (usedFor == "Task-Popup" || usedFor == "Task-Footertable" || usedFor == "Task-Profile") {
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
            setValue('');
            setSearchedData([]);
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
        SelectedCategoryBackupArray = [...select]
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
                    if (itemData.Newlabel.toLowerCase().includes(searchedKey.toLowerCase()) || itemData.Description1?.toLowerCase().includes(searchedKey.toLowerCase())) {
                        tempArray.push(itemData);
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

    const customHeader = () => {
        return (
            <>
                <div className="subheading">
                    Select Category
                </div>
                <Tooltip ComponentId="1741" />
            </>
        )
    }
    const HoverFirstLevel = (itemId: any) => {
        setFirstHoveredItemId(itemId);
    };
    const HoverOutFirstLevel = (event: any) => {
        setFirstHoveredItemId(null);
    };
    const HoverSecondLevel = (itemId: any) => {
        setSecondHoveredItemId(itemId);
    };
    const HoverOutSecondLevel = (event: any) => {
        setSecondHoveredItemId(null);
    };
    const HoverThirdLevel = (itemId: any) => {
        setThirdHoveredItemId(itemId);
    };
    const HoverOutThirdLevel = (event: any) => {
        setThirdHoveredItemId(null);
    };
    return (
        <>
            <Panel
                onRenderHeader={customHeader}
                isOpen={PopupSmartTaxanomy}
                type={PanelType.custom}
                customWidth="850px"
                onDismiss={closePopupSmartTaxanomy}
                isBlocking={false}

            >
                <div id="SmartTaxonomyPopup" className={(item?.props?.Portfolio_x0020_Type != undefined && item?.props?.Portfolio_x0020_Type == "Service") ? "serviepannelgreena" : ""}>
                    <div className={isServiceTask ? "modal-body serviepannelgreena" : "modal-body"}>

                        <div className="mb-2">
                            <div className="mb-2 col-sm-5 p-0" style={{width:"42.5%"}}>
                                <div className="position-relative">
                                    <input type="checkbox" defaultChecked={isSearchWithDesciptions} onChange={() => setIsSearchWithDesciptions(isSearchWithDesciptions ? false : true)} className="form-check-input me-1 rounded-0" style={{ width: "15px", height: "15px" }} /> <label>Include description (info-icons) in search</label>
                                    <input type="text" className="form-control  searchbox_height mt-20 mb-3" value={value} onChange={onChange} placeholder="Search Category" />
                                    <span style={{ position: 'absolute', top: '44px', right: '10px' }}><BsSearch /></span>
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
                            {select?.length > 0 ?
                                <div className="full-width">
                                    {select.map((val: any) => {
                                        return (
                                            <span className="block me-1">
                                                <span>{val.Title}</span>
                                                <span className="bg-light hreflink ms-2 svg__icon--cross svg__iconbox" onClick={() => deleteSelectedCat(val)}></span>
                                            </span>
                                        )
                                    })}
                                </div> : null}
                        </div>
                        <div className='col-sm-12 mt-16'>
                            <ul className="categories-menu p-0">
                                {AllCategories.map(function (item: any) {
                                    return (
                                        <>
                                            <li onMouseEnter={() => HoverFirstLevel(item.Id)} onMouseLeave={HoverOutFirstLevel} key={item.Id}>
                                                {item.Item_x005F_x0020_Cover != null &&
                                                    <div onClick={() => selectPickerData(item)} className='alignCenter hreflink justify-content-between'>
                                                        <a className={`${FirstHoveredItemId == item?.Id ? 'boldOnHover flag_icon alignCenter' : 'flag_icon alignCenter'}`}>
                                                            <img className="flag_icon" style={{ height: "12px", width: "18px" }} src={item.Item_x005F_x0020_Cover.Url} />
                                                            {item.Title}
                                                        </a>
                                                        {item?.childs?.length > 0 && <SlArrowRight />}
                                                    </div>
                                                }
                                                <ul className="sub-menu clr mar0">
                                                    {item.childs?.map(function (child1: any) {
                                                        return (
                                                            <>
                                                                {child1.Title != null ?
                                                                    <li onMouseEnter={() => HoverSecondLevel(child1.Id)} onMouseLeave={HoverOutSecondLevel}>
                                                                        <div onClick={() => selectPickerData(child1)} className='alignCenter hreflink justify-content-between'>
                                                                                <a className={`${SecondHoveredItemId == child1?.Id ? 'boldOnHover alignCenter' : 'alignCenter'}`}>
                                                                                    {child1.Item_x005F_x0020_Cover ? 
                                                                                    <img className="flag_icon" style={{ height: "12px", width: "18px;" }}
                                                                                        src={child1.Item_x005F_x0020_Cover.Url} /> :
                                                                                        <span className="me-4"></span>}
                                                                                    {child1.Title}
                                                                                    {child1.Description1 ? 
                                                                                    <div className='popover__wrapper ms-1' data-bs-toggle="tooltip" data-bs-placement="auto">
                                                                                        <span className="svg__iconbox svg__icon--info"></span>
                                                                                        <div className="popover__content">
                                                                                            <span>{child1.Description1}</span>
                                                                                        </div>
                                                                                    </div> : null} 
                                                                                </a>{child1?.childs?.length > 0 && <SlArrowRight />}
                                                                        </div>

                                                                        <ul className="sub-menu clr mar0">
                                                                            {
                                                                                child1.childs?.map((subChilds: any) => {
                                                                                    return (
                                                                                        <li onMouseEnter={() => HoverThirdLevel(subChilds.Id)} onMouseLeave={HoverOutThirdLevel}>
                                                                                            <a onClick={() => selectPickerData(subChilds)} className={`${ThirdHoveredItemId == subChilds?.Id ? 'boldOnHover alignCenter' : 'alignCenter'}`}>
                                                                                                {subChilds.Item_x005F_x0020_Cover ? <img className="flag_icon"
                                                                                                    style={{ height: "12px", width: "18px;" }} src={subChilds.Item_x005F_x0020_Cover.Url} /> :
                                                                                                    <span className="me-4"></span>}
                                                                                                {subChilds.Title}
                                                                                                {subChilds.Description1 ? <div className='popover__wrapper ms-1' data-bs-toggle="tooltip" data-bs-placement="auto">
                                                                                                    <span className="alignIcon   svg__iconbox svg__icon--info"></span>
                                                                                                    <div className="popover__content">
                                                                                                        <span ng-bind-html="child1.Description1 | trustedHTML">{subChilds.Description1}</span>
                                                                                                    </div>
                                                                                                </div> : null}
                                                                                            </a>
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
                    <footer className={isServiceTask ? "serviepannelgreena fixed-bottom bg-f4 p-3" : "fixed-bottom bg-f4 p-3"}>
                        <div className="alignCenter justify-content-between">
                            <div className="">
                                <div id="addNewTermDescription">
                                    <p className="mb-1"> New items are added under the currently selected item.
                                        <span><a className="hreflink" target="_blank" data-interception="off" href={`${siteUrls}/SitePages/ManageSmartMetaData.aspx`} > Add New Item </a></span>
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
                                    <a className="siteColor mx-1" target="_blank" data-interception="off" href={`${siteUrls}/SitePages/ManageSmartMetaData.aspx`} >Manage Smart Taxonomy</a>
                                </span>
                                <button type="button" className="btn btn-primary px-3 mx-1" onClick={saveCategories} >
                                    Save
                                </button>
                                <button type="button" className="btn btn-default mx-1" onClick={closePopupSmartTaxanomy} >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </footer>
                </div>
            </Panel >
        </>
    )
}
export default Picker;