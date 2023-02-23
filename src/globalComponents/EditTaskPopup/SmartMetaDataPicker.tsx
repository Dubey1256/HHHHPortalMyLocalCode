import * as React from "react";
import * as $ from 'jquery';
import { Panel, PanelType } from 'office-ui-fabric-react';
import "bootstrap/dist/css/bootstrap.min.css";
import { ImPriceTags } from 'react-icons/im';
import Tooltip from '../Tooltip';


var NewArray: any = []
var AutoCompleteItems: any = [];
var AutoCompleteItemsArray: any = [];
const Picker = (item: any) => {
    const usedFor = item.usedFor;

    const [PopupSmartTaxanomy, setPopupSmartTaxanomy] = React.useState(true);
    const [AllCategories, setAllCategories] = React.useState([]);
    const [select, setSelect] = React.useState([]);
    const [update, set] = React.useState([]);
    const [value, setValue] = React.useState("");
    const [selectedCategory, setSelectedCategory] = React.useState([]);
    const [searchedData, setSearchedData] = React.useState([])

    const openPopupSmartTaxanomy = () => {
        setPopupSmartTaxanomy(true)

    }
    React.useEffect(() => {
        loadGmBHTaskUsers();

    }, [])
    const closePopupSmartTaxanomy = () => {
        setPopupSmartTaxanomy(false)
        NewArray = []
        setSelect([])
        item.closePopupCallBack();

    }
    const saveCategories = () => {
        if (usedFor == "Task-Popup") {
            item.CallBack(selectedCategory);
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
        var url = ("https://hhhhteams.sharepoint.com/sites/HHHH/sp/_api/web/lists/getbyid('01a34938-8c7e-4ea6-a003-cee649e8c67a')/items?$select=Id,Title,IsVisible,ParentID,SmartSuggestions,TaxType,Description1,Item_x005F_x0020_Cover,listId,siteName,siteUrl,SortOrder,SmartFilters,Selectable,IsSendAttentionEmail/Id,IsSendAttentionEmail/Title,IsSendAttentionEmail/EMail&$expand=IsSendAttentionEmail&$orderby=SortOrder&$top=4999&$filter=TaxType eq '" + SmartTaxonomyName + "'")
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
        if (usedFor == "Task-Popup") {
            setSelectedCategory([item])
        } else {
            NewArray.push(item)
            //setSelect(NewArray)
            showSelectedData(NewArray);
        }
        setValue('');
        setSearchedData([]);
    }
    const showSelectedData = (itemss: any) => {
        if (usedFor == "Task-Popup") {

        } else {
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

    }
    function Example(callBack: any, type: any) {
        NewArray = []
        setSelect([])
        item.Call(callBack.props, type);
    }
    const setModalIsOpenToFalse = () => {
        setPopupSmartTaxanomy(false)
    }
    const deleteSelectedCat = (val: any) => {
        if (usedFor == "Task-Popup") {
            setSelectedCategory([])
        } else {
            select.map((valuee: any, index) => {
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
    }
    // Autosuggestion

    const onChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setValue(event.target.value);
        let searchedKey: any = event.target.value;
        let tempArray: any = [];
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
            <footer>
                <button type="button" className="btn btn-primary float-end me-5" onClick={saveCategories}>
                    OK
                </button>
            </footer>
        )
    }

    const customHeader = () => {
        return (
            <div className="d-flex full-width pb-1" >
                <div style={{ marginRight: "auto", fontSize: "20px", fontWeight: "600", marginLeft: '20px' }}>
                    <span>
                        Select Category
                    </span>
                </div>
                <Tooltip ComponentId="1626" />
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
                isBlocking={false}
                onRenderFooter={customFooter}
            >
                <div id="SmartTaxonomyPopup">
                    <div className="modal-body">
                        {/* <table className="ms-dialogHeaderDescription">
                            <tbody>
                                <tr id="addNewTermDescription" className="">
                                    <td>New items are added under the currently selected item.</td>
                                    <td className="TaggingLinkWidth">
                                        <a className="hreflink" ng-click="gotomanagetaxonomy();">
                                            Add New Item
                                        </a>
                                    </td>
                                </tr>
                                <tr id="SendFeedbackTr">
                                    <td>Make a request or send feedback to the Term Set manager.</td>
                                    <td className="TaggingLinkWidth">
                                        <a ng-click="sendFeedback();">
                                            Send Feedback
                                        </a>
                                    </td>
                                    <td className="TaggingLinkWidth">
                                        {select}
                                    </td>
                                </tr>
                            </tbody>
                        </table> */}
                        <section>
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
                                        <button type="button" className="btn btn-primary" onClick={saveCategories}>
                                            OK
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <div className="mb-3">
                            <div className="mb-2 col-sm-12 p-0">
                                <div>
                                    <input type="text" className="form-control  searchbox_height" value={value} onChange={onChange} placeholder="Search here" />
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
                                    {/* <ul className="list-group"> 
                                        {AutoCompleteItemsArray.filter((item: any) => {
                                            const searchTerm = value.toLowerCase();
                                            var fullName = item.Title != null ? item.Newlabel.toLowerCase() : "";
                                            return (
                                                searchTerm &&
                                                fullName.startsWith(searchTerm) &&
                                                fullName !== searchTerm
                                            );
                                        })
                                            .slice(0, 10)
                                            .map((item: any) => (
                                                <li className="list-group-item rounded-0 list-group-item-action" key={item.Title} onClick={() => selectPickerData(item)} >
                                                    <a>{item.Newlabel}</a>
                                                </li>
                                            ))}
                                    </ul> */}
                                </div>
                            </div>
                            <div className="col-sm-12 ActivityBox">
                                {usedFor == "Task-Popup" ? <div>
                                    {selectedCategory.map((val: any) => {
                                        return (
                                            <>
                                                <span>
                                                    <a className="hreflink block p-1 px-2 mx-1" ng-click="removeSmartArray(item.Id)"> {val.Title}
                                                        <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/_layouts/images/delete.gif" className="ms-2" onClick={() => deleteSelectedCat(val)} /></a>
                                                </span>
                                            </>
                                        )
                                    })}
                                </div> : <div>
                                    {select.map((val: any) => {
                                        return (
                                            <>
                                                <span>
                                                    <a className="hreflink block p-1 px-2 mx-1" ng-click="removeSmartArray(item.Id)"> {val.Title}
                                                        <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/_layouts/images/delete.gif" className="ms-2" onClick={() => deleteSelectedCat(val)} /></a>
                                                </span>
                                            </>
                                        )
                                    })}
                                </div>}

                            </div>
                            {/* <div className="col-sm-12 ActivityBox">
                                    <span>
                                        <a className="hreflink block" ng-click="removeSmartArray(item.Id)"> {select}
                                        <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/_layouts/images/delete.gif" onClick={()=>deleteSelectedCat()}/></a>
                                    </span>
                                </div> */}

                            {/* <div className="col-sm-12 ActivityBox" ng-show="SmartTaxonomyName==newsmarttaxnomy">
                                <span>
                                    <a className="hreflink" ng-click="removeSmartArray(item.Id)"> {select}
                                    <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/_layouts/images/delete.gif"/></a>
                                </span>
                            </div> */}
                        </div>
                        <div className='col-sm-12 categScroll'>

                            <ul className="categories-menu p-0">
                                {AllCategories.map(function (item: any) {
                                    return (
                                        <>
                                            <li>

                                                {item.Item_x005F_x0020_Cover != null &&
                                                    <p onClick={() => selectPickerData(item)}  className='mb-0 hreflink' >
                                                        <a>
                                                            <img className="flag_icon"
                                                                style={{ height: "12px", width: "18px" }} src={item.Item_x005F_x0020_Cover.Url} />
                                                            {item.Title}
                                                        </a>
                                                    </p>

                                                }
                                                <ul ng-if="item.childs.length>0" className="sub-menu clr mar0">
                                                    {item.childs?.map(function (child1: any) {
                                                        return (
                                                            <>
                                                                {child1.Item_x005F_x0020_Cover != null ?
                                                                    <li>
                                                                        <p  onClick={() => selectPickerData(child1)} className='mb-0 hreflink'>
                                                                            <a>
                                                                                <img ng-if="child1.Item_x005F_x0020_Cover!=undefined" className="flag_icon"
                                                                                    style={{ height: "12px", width: "18px;" }}
                                                                                    src={child1.Item_x005F_x0020_Cover.Url} /> {child1.Title}
                                                                                <div className='popover__wrapper ms-1' data-bs-toggle="tooltip" data-bs-placement="auto">
                                                                                    <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/infoIcon.png" />
                                                                                    <div className="popover__content">
                                                                                        <span ng-bind-html="child1.Description1 | trustedHTML">{child1.Description1}</span>
                                                                                    </div>
                                                                                </div>
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
                        </div>
                    </div>
                </div>
            </Panel>
        </>
    )
}
export default Picker;