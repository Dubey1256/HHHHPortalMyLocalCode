import * as React from "react";
import * as $ from 'jquery';
import '../../webparts/taskDashboard/components/foundation.scss';
import { arraysEqual, Modal } from 'office-ui-fabric-react';
import "bootstrap/dist/css/bootstrap.min.css";
import '../../webparts/taskDashboard/components/TaskDashboard.scss';
const Picker=(item:any)=>{
    const [PopupSmartTaxanomy, setPopupSmartTaxanomy] = React.useState(false);
    const [AllCategories, setAllCategories] = React.useState([]);
    const [select, setSelect] = React.useState([]);

    const openPopupSmartTaxanomy = () => {
        setPopupSmartTaxanomy(true)

    }
    React.useEffect(()=>{
        loadGmBHTaskUsers();
    },[])
    const closePopupSmartTaxanomy = () => {
        //Example(item);
        setPopupSmartTaxanomy(false)

    }
    const saveCategories=()=>{
        item.props.categories = [];
        item.props.categories = select;
        Example(item);

    }
    var SmartTaxonomyName = "Categories";
    const loadGmBHTaskUsers = function () {
        var AllTaskusers = []
        var AllMetaData: any = []
        var TaxonomyItems:any=[]
        var url = ("https://hhhhteams.sharepoint.com/sites/HHHH/sp/_api/web/lists/getbyid('01a34938-8c7e-4ea6-a003-cee649e8c67a')/items?$select=Id,Title,IsVisible,ParentID,SmartSuggestions,TaxType,Description1,Item_x005F_x0020_Cover,listId,siteName,siteUrl,SortOrder,SmartFilters,Selectable,IsSendAttentionEmail/Id,IsSendAttentionEmail/Title,IsSendAttentionEmail/EMail&$expand=IsSendAttentionEmail&$orderby=SortOrder&$top=4999&$filter=TaxType eq '" + SmartTaxonomyName + "'")
        $.ajax({

            url: url,

            method: "GET",

            headers: {

                "Accept": "application/json; odata=verbose"

            },
            success: function (data) {
                AllTaskusers = data.d.results;
                $.each(AllTaskusers, function (index:any,item:any) {
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
    var loadSmartTaxonomyPortfolioPopup =(AllTaxonomyItems:any)=> {
        var TaxonomyItems:any = [];
        var uniqueNames:any = [];
        $.each(AllTaxonomyItems, function (index:any,item:any) {
            if (item.ParentID == 0 && SmartTaxonomyName == item.TaxType) {
                TaxonomyItems.push(item);
                getChilds(item, AllTaxonomyItems);
                if (item.childs != undefined && item.childs.length > 0) {
                    TaxonomyItems.push(item)
                }
                 uniqueNames = TaxonomyItems.filter((val:any, id:any, array:any) => {
                    return array.indexOf(val) == id;  
                 });
              
            } 
        });
        return uniqueNames;
    }
    loadGmBHTaskUsers();
    const getChilds =(item:any, items:any)=> {
        item.childs = [];
        $.each(items, function (index:any,childItem:any) {
            if (childItem.ParentID != undefined && parseInt(childItem.ParentID) == item.ID) {
                childItem.isChild = true;
                item.childs.push(childItem);
                getChilds(childItem, items);
            }
        });
    }
    var isItemExists =(items:any, columnName:any)=> {
        var flag = false;
        $.each(items, function (index:any,item:any) {
            if (item.Id == columnName)
                flag = true;
        });
        return flag;
    }
    const selectPickerData=(item:any)=>{
    setSelect(item)
    //Example(item);
    
    }
    function Example(callBack: any) {

        item.Call(callBack.props);

    }
    const setModalIsOpenToFalse = () => {
      
        setPopupSmartTaxanomy(false)
    }
    return(
        <>
        
    {/* <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none" onClick={()=>openPopupSmartTaxanomy()}> 
     <path fill-rule="evenodd" clip-rule="evenodd" d="M33.5163 8.21948C33.058 8.34241 32.4072 8.6071 32.0702 8.80767C31.7334 9.00808 26.7046 13.9214 20.8952 19.7259L10.3328 30.2796L9.12891 35.1C8.46677 37.7511 7.95988 39.9549 8.0025 39.9975C8.04497 40.0399 10.2575 39.5397 12.919 38.8857L17.7581 37.6967L28.08 27.4328C33.7569 21.7875 38.6276 16.861 38.9036 16.4849C40.072 14.8925 40.3332 12.7695 39.5586 11.1613C38.8124 9.61207 37.6316 8.62457 36.0303 8.21052C34.9371 7.92775 34.5992 7.92896 33.5163 8.21948ZM35.7021 10.1369C36.5226 10.3802 37.6953 11.5403 37.9134 12.3245C38.2719 13.6133 38.0201 14.521 36.9929 15.6428C36.569 16.1059 36.1442 16.4849 36.0489 16.4849C35.8228 16.4849 31.5338 12.2111 31.5338 11.9858C31.5338 11.706 32.8689 10.5601 33.5598 10.2469C34.3066 9.90852 34.8392 9.88117 35.7021 10.1369ZM32.3317 15.8379L34.5795 18.0779L26.1004 26.543L17.6213 35.008L17.1757 34.0815C16.5838 32.8503 15.1532 31.437 13.9056 30.8508L12.9503 30.4019L21.3663 21.9999C25.9951 17.3788 29.8501 13.5979 29.9332 13.5979C30.0162 13.5979 31.0956 14.6059 32.3317 15.8379ZM12.9633 32.6026C13.8443 32.9996 14.8681 33.9926 15.3354 34.9033C15.9683 36.1368 16.0094 36.0999 13.2656 36.7607C11.9248 37.0836 10.786 37.3059 10.7347 37.2547C10.6535 37.1739 11.6822 32.7077 11.8524 32.4013C11.9525 32.221 12.227 32.2709 12.9633 32.6026Z" fill="#333333" />
    </svg> */}
                                                                                      
        <Modal
                isOpen={PopupSmartTaxanomy}
                onDismiss={closePopupSmartTaxanomy}
                isBlocking={false}

            >

                <div id="SmartTaxonomyPopup">
                    <div className="modal-dailog modal-lg">
                        <div className="panel panel-default" ng-cloak>
                            <div className="modal-header">
                                <h3 className="modal-title">
                                Select Categories 
                                </h3>
                                <button type="button" style={{ minWidth: "10px" }} className="close" data-dismiss="modal"
                                    onClick={closePopupSmartTaxanomy}>
                                    &times;
                                </button>
                            </div>
                            <div className="modal-body clearfix bg-f5f5">
                            <div className="col-sm-12 ActivityBox" ng-show="SmartTaxonomyName==newsmarttaxnomy">
                    <span ng-show="item.Title!=undefined &&MainItem.CompositionSiteType=='EI'&&item.SiteType!=undefined &&item.SiteType=='EI'" className="block clear-assessment mr-4"
                         >
                        {select}<a className="hreflink"
                                         ng-click="removeSmartArray(item.Id)"> <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/_layouts/images/delete.gif"/></a>
                    </span>
                    
                </div>
                            <table className="ms-dialogHeaderDescription">
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
                                    </table>
                                    <div className="col-sm-12 padL-0 PadR0 divPanelBody">
                    <nav id="nav_pop-up">
                        <ul id="main-menu" style={{display:"grid"}}>
                            {AllCategories.map(function(item:any){
                                return(
                              <>
                             
                            <li>
                               
                             {item.Item_x005F_x0020_Cover != null &&
                               <a className="hreflink" ng-click="selectnewItem(item);" onClick={()=>selectPickerData(item.Title)}>
                                    <img className="flag_icon"
                                         style={{height: "12px", width:"18px"}} src={item.Item_x005F_x0020_Cover.Url}/>
                                    {item.Title}
                                    </a>
                            }   
                             

                              
                                <ul ng-if="item.childs.length>0" className="sub-menu clr mar0">
                                {item.childs.map(function(child1:any){
                                return(
                              <>
                                    <li>
                                      
                                            {child1.Item_x005F_x0020_Cover != null &&
                                              <a className="hreflink" ng-click="selectnewItem(child1);"onClick={()=>selectPickerData(child1.Title)}>
                                            <img ng-if="child1.Item_x005F_x0020_Cover!=undefined" className="flag_icon"
                                                 style={{height: "12px", width:"18px;"}}
                                                 src={child1.Item_x005F_x0020_Cover.Url}/> {child1.Title} <span ng-show="child1.Description1 != null" className="project-tool top-assign">
                                                <img ng-src="{{baseUrl}}/SiteCollectionImages/ICONS/24/infoIcon.png" />
                                                <span className="tooltipte">
                                                    <span className="tooltiptext">
                                                        <div className="tooltip_Desc">
                                                            <span ng-bind-html="child1.Description1 | trustedHTML">{child1.Description1}</span>
                                                        </div>
                                                    </span>
                                                </span>
                                            </span>
                                            </a>
                                }
                                        
                                        {/* <ul ng-if="child1.childs.length>0" className="sub-menu clr2 mar0 padL-0">
                                            <li ng-repeat="child2 in child1.childs|orderBy:'Title'">
                                                <a className="hreflink" ng-click="selectnewItem(child2);">
                                                    <img ng-if="child2.Item_x005F_x0020_Cover!=undefined"
                                                         class="flag_icon" style="height: 12px; width:18px;"
                                                         ng-src="{{child2.Item_x005F_x0020_Cover.Url}}"> {{child2.Title}}
                                                    <span ng-show="child2.Description1 != null"
                                                          className="project-tool top-assign">
                                                        <img ng-src="{{baseUrl}}/SiteCollectionImages/ICONS/24/infoIcon.png" />
                                                        <span className="tooltipte">
                                                            <span className="tooltiptext">
                                                                <div className="tooltip_Desc">
                                                                    <span ng-bind-html="child2.Description1  | trustedHTML"></span>
                                                                </div>
                                                            </span>
                                                        </span>
                                                    </span>
                                                </a>
                                                <ul ng-if="child2.childs.length>0" className="sub-menu clr2 mar0 padL-0">
                                                    <li ng-repeat="child3 in child2.childs|orderBy:'Title'">
                                                        <a className="hreflink" ng-click="selectnewItem(child3);">
                                                            <img ng-if="child3.Item_x005F_x0020_Cover!=undefined"
                                                                 class="flag_icon" style="height: 12px; width:18px;"
                                                                 ng-src="{{child3.Item_x005F_x0020_Cover.Url}}"> {{child3.Title}}
                                                            <span ng-show="child3.Description1 != null"
                                                                  className="project-tool top-assign">
                                                                <img ng-src="{{baseUrl}}/SiteCollectionImages/ICONS/24/infoIcon.png" />
                                                                <span className="tooltipte">
                                                                    <span className="tooltiptext">
                                                                        <div className="tooltip_Desc">
                                                                            <span ng-bind-html="child3.Description1  | trustedHTML"></span>
                                                                        </div>
                                                                    </span>
                                                                </span>
                                                            </span>
                                                        </a>
                                                    </li>
                                                </ul>
                                            </li>
                                        </ul> */}
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
                    </nav>
                </div>

                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" onClick={saveCategories}>
                                    OK
                                </button>

                            </div>




                        </div>
                    </div>
                </div>
            </Modal>
        </>
    )
}
export default Picker;