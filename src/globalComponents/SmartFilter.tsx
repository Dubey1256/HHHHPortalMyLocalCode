import * as React from "react";
import * as $ from 'jquery';
//import * as Moment from 'moment';
// import '../../cssFolder/foundation.scss'
//import { update } from "@microsoft/sp-lodash-subset";
//import './foundationmin.scss'
//import eventBus from "./EventBus";



const SmartFilter = () => {
    const [filterGroups, setFilterGroups] = React.useState([])
    const [filterItems, setfilterItems] = React.useState([])
    const [Task, setTask] = React.useState([])
    const [showItem, setshowItem] = React.useState(false);
    const [state, setState] = React.useState([]);
  

    


    React.useEffect(() => {
        function loadSmartMetadata() {

            var Response: any = []
            var url = "https://hhhhteams.sharepoint.com/sites/HHHH/SP/_api/web/lists/getbyid('b318ba84-e21d-4876-8851-88b94b9dc300')/items?$top=1000";

            $.ajax({

                url: url,

                method: "GET",

                headers: {

                    "Accept": "application/json; odata=verbose"

                },

                success: function (data) {

                    Response = Response.concat(data.d.results);
                    console.log(Response);

                    if (data.d.__next) {

                        url = data.d.__next;



                    }
                    else setTask(Response);


                },

                error: function (error) {


                }

            });

            var TasksItem: any = [];
            var AllMetaData: any = []
            var TaxonomyItems: any = []
            var siteConfig: any = []
            var metadatItem: any = []
            var filterItems: any = [];
            // var filterGroups: any = [];
            filterGroups.push("Portfolio");
            filterGroups.push("Sites");
            filterGroups.push("Type");
            filterGroups.push("Team Members");
            // setFilterGroups(filterGroups);
            var url = "https://hhhhteams.sharepoint.com/sites/HHHH/SP/_api/web/lists/getbyid('01a34938-8c7e-4ea6-a003-cee649e8c67a')/items?$select=Id,Title,IsVisible,ParentID,SmartSuggestions,TaxType,Description1,Item_x005F_x0020_Cover,listId,siteName,siteUrl,SortOrder,SmartFilters,Selectable,Parent/Id,Parent/Title&$expand=Parent&$orderby=SortOrder&$top=4999";


            $.ajax({

                url: url,

                method: "GET",

                headers: {

                    "Accept": "application/json; odata=verbose"

                },

                success: function (data) {

                    AllMetaData = AllMetaData.concat(data.d.results);
                    $.each(AllMetaData, function (item: any, newtest) {
                        if (newtest.ParentID == 0 && newtest.TaxType == 'Client Category') {
                            TaxonomyItems.push(newtest);

                        }
                        if (newtest.TaxType == 'Sites') {
                            siteConfig.push(newtest)
                        }


                    });
                    $.each(siteConfig, function (index: any, newsite) {
                        /*-- Code for default Load Task Data---*/
                        if (newsite.Title == "DRR" && newsite.Title == "Small Projects" && newsite.Title == "Gruene" && newsite.Title == "Offshore Tasks" && newsite.Title == "Health" && newsite.Title == "Shareweb Old") {
                            newsite.Selected = false;
                        }
                        else {
                            newsite.Selected = true;
                        }
                        if (newsite.Title != "Master Tasks" || newsite.Title != "Foundation")
                            siteConfig.push(newsite);
                    })
                    $.each(AllMetaData, function (newitem: any, item) {
                        if (item.TaxType != 'Status' && item.TaxType != 'Admin Status' && item.TaxType != 'Task Type' && item.TaxType != 'Time' && item.Id != 300 && item.TaxType != 'Portfolio Type' && item.TaxType != 'Task Types') {
                            if (item.TaxType == 'Sites') {
                                item.DataLoad = false;
                                /*-- Code for default Load Task Data---*/
                                if (item.Title == "DRR" || item.Title == "Small Projects" || item.Title == "Offshore Tasks" || item.Title == "Health") {
                                    item.Selected = false;
                                }
                                else {
                                    item.Selected = true;
                                }
                            }
                            else if (item.TaxType == 'Sites Old') {
                                /*-- Code for default Load Task Data---*/
                                item.Selected = true;
                            }
                            metadatItem.push(item);
                            //setFilterGroups(metadatItem)
                        }
                    })
                    $.each(Response, function (index: any, user) {
                        user.TaxType = 'Team Members';
                        user.SmartFilters = {};
                        user.SmartFilters.results = [];
                        user.SmartFilters.results.push('Portfolio');
                        if (user.UserGroupId == undefined)
                            user.ParentID = 0;
                        if (user.UserGroupId != undefined)
                            user.ParentID = user.UserGroupId;
                        metadatItem.push(user);
                    });
                    $.each(metadatItem, function (newi: any, item) {
                        if (item.Title == 'Shareweb Old') {
                            item.TaxType = 'Sites';
                        }
                    })
                    $.each(metadatItem, function (newitem: any, filterItem) {
                        if (filterItem.SmartFilters != undefined && filterItem.SmartFilters.results != undefined && filterItem.SmartFilters.results.indexOf('Portfolio') > -1) {
                            var item: any = [];
                            item.ID = item.Id = filterItem.Id;
                            item.Title = filterItem.Title;
                            item.Group = filterItem.TaxType;
                            item.TaxType = filterItem.TaxType;
                            if (item.Title == "Activities" || item.Title == "Workstream" || item.Title == "Task") {
                                item.Selected = true;
                            }


                            if (filterItem.ParentID == 0 || (filterItem.Parent != undefined && filterItem.Parent.Id == undefined)) {
                                if (item.TaxType == 'Team Members') {
                                    getChildsBasedonId(item, Response);
                                } else {
                                    getChildsBasedOn(item, AllMetaData);
                                }
                                filterItems.push(item);
                                if (filterItem.TaxType != "Type" && filterItem.TaxType != "Sites Old" && (filterGroups.length == 0 || filterGroups.indexOf(filterItem.TaxType) == -1)) {
                                    filterGroups.push(filterItem.TaxType);

                                }

                                setFilterGroups(filterGroups)

                            }

                        }
                    });

                    filterItems.push({ "Group": "Portfolio", "TaxType": "Portfolio", "Title": "Component", "Selected": true, "childs": [] }, { "Group": "Portfolio", "TaxType": "Portfolio", "Title": "SubComponent", "Selected": true, "childs": [] }, { "Group": "Portfolio", "TaxType": "Portfolio", "Title": "Feature", "Selected": true, "childs": [] });
                    $.each(filterItems, function (neww: any, item) {
                        if (item.TaxType == "Sites" && item.Title == 'SDC Sites' || item.Title == 'Tasks') {
                            item.Selected = true;
                        }
                    })
                    setfilterItems(filterItems)

                    function getChildsBasedonId(item: { childs: any[]; Id: any; }, items: any) {
                        item.childs = [];
                        $.each(items, function (child: any, childItem) {
                            if (childItem.UserGroupId != undefined && childItem.UserGroupId == item.Id) {
                                item.childs.push(childItem);
                                getChildsBasedonId(childItem, items);
                            }
                        });
                    }
                    function getChildsBasedOn(item: { childs: any[]; ID: number; }, items: any) {
                        item.childs = [];
                        $.each(AllMetaData, function (news: any, childItem) {
                            if (childItem.Parent != undefined && childItem.Parent.Id != undefined && parseInt(childItem.Parent.Id) == item.ID) {
                                item.childs.push(childItem);
                                getChildsBasedOn(childItem, items);
                            }
                        });
                    }

                },


                error: function (error) {


                }

            });

        }
        loadSmartMetadata();
    }, [])
    const handleOpen2 = (item: any) => {

        item.show = item.show = item.show == true ? false : true;
        setfilterItems(filterItems => ([...filterItems]));
       

    };
    // const handleFormChange = (index:any, event:any) => {
    //     let data = [...state];
    //     data[index] = event.target.value;
    //     setState(data);
    // }

    var selected2:any = [];
     const SingleLookDatatest = (item:any, value:any) => {
        if (item.Selected == true && item.length > 0) {
        selected2.push(item);
        }
        if (item.Selected == true && selected2.length > 0) {
           $.each(selected2, function (newite:any, index:any) {
                if (newite.Id == item.Id) {
                    selected2.splice(index, 1);
                }
            })

        }
        setState(selected2)

    }
   
   
    return (
        <>
  
            <section className="ContentSection">
                <div className="bg-f5f5 bdrbox pad10 clearfix">
                    <div className="togglebox">
                        <label className="toggler full_width mb-10">
                            <span className="pull-left">
                                <img className="hreflink wid22" ng-show="pagesType=='componentportfolio'"
                                    src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Filter-12-WF.png" />
                                SmartSearch –
                            </span>
                            <span className="ml20">
                                <span ng-repeat="obj in ShowSelectdSmartfilter">Sites<span
                                    className="font-normal">(14)</span><span
                                        ng-if="$index != (ShowSelectdSmartfilter.length -1)"> | </span> </span>
                            </span>
                            <span className="pull-right">
                                <img className="icon-sites-img  wid22 ml5" ng-show="pagesType=='componentportfolio'"
                                    title="Share SmartFilters selection" ng-click="GenerateUrl()"
                                    src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Icon_Share_Blue.png" />
                            </span>
                            <span className="pull-right">
                                <span className="hreflink" ng-if="!smartfilter2.expanded">
                                    <img ng-show="pagesType=='componentportfolio'" className="hreflink wid22"
                                        ng-src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Add-New.png" />
                                </span>
                            </span>
                        </label>
                        <div className="togglecontent">
                            <div className="col-sm-12 pad0">
                                <table width="100%" className="indicator_search">
                                    <tr>
                                        {filterGroups.map(function (item) {
                                            return (
                                                <>

                                                    <td valign="top">
                                                        <fieldset>
                                                            <legend>{item != 'teamSites' && <span>{item}</span>}</legend>
                                                            <legend>{item == 'teamSites' && <span>Sites</span>}</legend>
                                                        </fieldset>
                                                        {filterItems.map(function (ItemType,index) {
                                                            return (
                                                                <>
                                                                    <div style={{ display: "block" }}> {ItemType.Group == item &&
                                                                        <>

                                                                            <span className="plus-icon hreflink"onClick={() => handleOpen2(ItemType)}>
                                                                                            {ItemType.childs.length > 0 &&
                                                                                                <a className='hreflink'
                                                                                                    title="Tap to expand the childs">
                                                                                                   {ItemType.showItem ? <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png" />
                                                                                                        : <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png" />}
                                                                                                    
                                                                                                </a>
                                                                                            }        
                                                                            </span>

                                                                            <span className="ml-1">
                                                                                {ItemType.TaxType != 'Status' &&
                                                                                    <span>
                                                                                        <input type="checkbox" className="mr0 icon-input" value={ItemType.Title} onChange={()=>SingleLookDatatest(ItemType,index)} />
                                                                                        {ItemType.Title}

                                                                                    </span>
                                                                                }
                                                                            </span>
                                                                            <span className="ml-2">
                                                                                {ItemType.TaxType == 'Status' &&
                                                                                    <span>
                                                                                        <input type="checkbox" className="mr0 icon-input" value={ItemType.Title} onChange={()=>SingleLookDatatest(ItemType,index)} />
                                                                                        {ItemType.Title}

                                                                                    </span>
                                                                                }
                                                                            </span>
                                                                            <ul id="id_{ItemType.Id}"
                                                                                className="subfilter width-85">
                                                                                <span>
                                                                                    {ItemType.showItem && (
                                                                                        <>
                                                                                            {ItemType.childs.map(function (child1: any) {
                                                                                                return (
                                                                                                    <>
                                                                                                        <div style={{ display: "block" }}>
                                                                                                            {child1.childs.length > 0 && !child1.expanded &&
                                                                                                                <span className="plus-icon hreflink"
                                                                                                                    ng-click="loadMoreFilters(child1);">
                                                                                                                    <img
                                                                                                                        src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png" />
                                                                                                                </span>
                                                                                                            }
                                                                                                            {child1.childs.length > 0 && child1.expanded &&
                                                                                                                <span className="plus-icon hreflink"
                                                                                                                    ng-click="loadMoreFilters(child1);">
                                                                                                                    <img
                                                                                                                        src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png" />
                                                                                                                </span>
                                                                                                            }
                                                                                                            <input type="checkbox" className="icon-input mr0" ng-model="child1.Selected"
                                                                                                                ng-click="FilterColumn(child1)" /> {child1.Title}

                                                                                                            <ul id="id_{{child1.Id}}" style={{ display: "none" }} className="subfilter"
                                                                                                            >
                                                                                                                {child1.childs.map(function (child2: any) {
                                                                                                                    <li>
                                                                                                                        <input type="checkbox"

                                                                                                                            ng-model="child2.Selected"
                                                                                                                            ng-click="FilterColumn(child2)" /> {child2.Title}
                                                                                                                    </li>
                                                                                                                })}
                                                                                                            </ul>
                                                                                                        </div>
                                                                                                    </>
                                                                                                )

                                                                                            })}
                                                                                        </>
                                                                                    )}
                                                                                </span>
                                                                            </ul>

                                                                        </>

                                                                    }
                                                                    </div>
                                                                </>
                                                            )
                                                        })}

                                                    </td>

                                                </>
                                            )
                                        })}


                                    </tr>
                                </table>
                            </div>
                            <div className="pull-right">

                            <button type="button" className="btn btn-primary"
                               title="Smart Filter">
                                Update
                            </button>
                            <button type="button" className="btn btn-grey ml5" title="Clear All"
                            >
                                Clear All
                            </button>
                        </div>

                        </div>
                        
                    </div>
                </div>
            </section>
        </>
    )
}
export default SmartFilter;