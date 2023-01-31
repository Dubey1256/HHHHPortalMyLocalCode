import * as React from "react";
import * as $ from 'jquery';
//import '../../webparts/taskDashboard/components/foundation.scss';
import { arraysEqual, Modal, Panel, PanelType } from 'office-ui-fabric-react';
import "bootstrap/dist/css/bootstrap.min.css";
import { FiInfo } from 'react-icons/fi';
//import '../../webparts/taskDashboard/components/TaskDashboard.scss';
const Picker = (item: any) => {
    const [PopupSmartTaxanomy, setPopupSmartTaxanomy] = React.useState(false);
    const [AllCategories, setAllCategories] = React.useState([]);
    const [select, setSelect] = React.useState([]);

    const openPopupSmartTaxanomy = () => {
        setPopupSmartTaxanomy(true)

    }
    React.useEffect(() => {
        loadGmBHTaskUsers();
    }, [])
    const closePopupSmartTaxanomy = () => {
        //Example(item);
        setPopupSmartTaxanomy(false)

    }
    const saveCategories = () => {
        item.props.categories = [];
        item.props.smartCategories = [];
        var title: any = {}
        title.Title = select;
        item.props.smartCategories.push(title);
        item.props.categories = select;
        Example(item, 'Category');
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
    var isItemExists = (items: any, columnName: any) => {
        var flag = false;
        $.each(items, function (index: any, item: any) {
            if (item.Id == columnName)
                flag = true;
        });
        return flag;
    }
    const selectPickerData = (item: any) => {
        setSelect(item)
        //Example(item);

    }
    function Example(callBack: any, type: any) {
        item.Call(callBack.props, type);
    }
    const setModalIsOpenToFalse = () => {
        setPopupSmartTaxanomy(false)
    }
    return (
        <>
            <Panel
                headerText={`Select Categories`}
                type={PanelType.large}
                isOpen={PopupSmartTaxanomy}
                onDismiss={closePopupSmartTaxanomy}
                isBlocking={false}
            >
                <div>
                    <div className="modal-body">
                        {/* <div className="col-sm-12 ActivityBox" ng-show="SmartTaxonomyName==newsmarttaxnomy">
                            <span ng-show="item.Title!=undefined &&MainItem.CompositionSiteType=='EI'&&item.SiteType!=undefined &&item.SiteType=='EI'" className="block clear-assessment mr-4"
                            >
                                {select}<a className="hreflink"
                                    ng-click="removeSmartArray(item.Id)"> <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/_layouts/images/delete.gif" /></a>
                            </span>

                        </div> */}
                        <section>
                            <div className="row">
                                <div className="d-flex text-muted pt-3">
                                    <svg className="bd-placeholder-img flex-shrink-0 me-2 rounded" width="32" height="32" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 32x32" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#007bff"></rect><text x="50%" y="50%" fill="#007bff" dy=".3em">32x32</text></svg>
                                    <div className="pb-3 mb-0 small">
                                        <p className="mb-1">
                                            New items are added under the currently selected item. <span><a className="hreflink" ng-click="gotomanagetaxonomy();"> Add New Item </a></span>
                                        </p>
                                        <p className="mb-1">Make a request or send feedback to the Term Set manager. <span><a className="hreflink" ng-click="sendFeedback();">  Send Feedback </a></span></p>
                                        <div className="block col p-1">  {select}</div>
                                    </div>

                                </div>

                            </div>
                        </section>

                        <section className="clearfix bg-f5f5" >
                            <div className="col-sm-12">


                                <ul className="categories-menu">
                                    {AllCategories.map(function (item: any) {
                                        return (
                                            <>

                                                <li onClick={() => selectPickerData(item.Title)}>

                                                    {item.Item_x005F_x0020_Cover != null &&
                                                        <a className="hreflink"  >
                                                            <img className="flag_icon" src={item.Item_x005F_x0020_Cover.Url} />
                                                            {item.Title}
                                                        </a>
                                                    }

                                                    <ul ng-if="item.childs.length>0" className="sub-menu">
                                                        {item.childs.map(function (child1: any) {
                                                            return (
                                                                <>
                                                                    <li onClick={() => selectPickerData(child1.Title)}>

                                                                        {child1.Item_x005F_x0020_Cover != null &&
                                                                            <a className="hreflink" ng-click="selectnewItem(child1);" >
                                                                                <img ng-if="child1.Item_x005F_x0020_Cover!=undefined" className="flag_icon" src={child1.Item_x005F_x0020_Cover.Url} /> {child1.Title} <span>
                                                                                    <a href="#" className="infoicons" data-bs-toggle="tooltip" title="Some tooltip text!"><FiInfo /> </a>


                                                                                    <div className="tooltip bs-tooltip-top" role="tooltip">
                                                                                        <div className="tooltip-arrow"></div>
                                                                                        <div className="tooltip-inner" ng-bind-html="child1.Description1 | trustedHTML">
                                                                                            {child1.Description1}
                                                                                        </div>
                                                                                    </div>
                                                                                </span>
                                                                            </a>
                                                                        }


                                                                    </li>
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


                        </section>




                    </div>
                    <footer className="mt-2 text-end">
                        Manage Smart Taxonomy  <button type="button" className="btn btn-primary px-2" onClick={saveCategories}>
                            OK
                        </button>
                    </footer>
                </div>
            </Panel>
        </>
    )
}
export default Picker;