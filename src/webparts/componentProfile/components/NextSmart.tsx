import { Button, Modal } from 'office-ui-fabric-react';
import * as React from 'react';




export default function Smartinfo() {
    const [SmartmodalIsOpen, setSmartModalIsOpen] = React.useState(false);
    const setModalSmartIsOpenToTrue = () => {
        setSmartModalIsOpen(true)
    }
    const setModalSmartIsOpenToFalse = () => {
        setSmartModalIsOpen(false)
    }
    let  heading = "";
    let addNotes = "";
    if (window.location.href.toLowerCase().indexOf("contract-profile.aspx") > -1) {
       heading = 'SmartNotes-Contract';
       addNotes = '+ Add SmartNotes';
    }
    else {
        heading = 'SmartInformation';
        addNotes = '+ Add SmartInformation';
    }
    const [data, setTaskData] = React.useState([]);
    React.useEffect(() => {
        // var url = "https://hhhhteams.sharepoint.com/sites/HHHH/SP/_api/web/currentuser";
        var url = `https://hhhhteams.sharepoint.com/sites/HHHH/SP/_api/lists/getbyid('091889bd-5339-4d11-960e-a8ff38df414b')/items?$select=ID,Title,SmartInformationId&$filter=Id eq 321`;
        // var url = `https://hhhhteams.sharepoint.com/sites/HHHH/SP/_api/lists/getbyid('EC34B38F-0669-480A-910C-F84E92E58ADF')/items?$select=ItemRank,Item_x0020_Type,Portfolio_x0020_Type,Site,FolderID,PortfolioLevel,PortfolioStructureID,ValueAdded,Idea,TaskListName,TaskListId,WorkspaceType,CompletedDate,ClientActivityJson,ClientSite,Item_x002d_Image,Sitestagging,SiteCompositionSettings,TechnicalExplanations,Deliverables,ComponentPortfolio/Id,ComponentPortfolio/Title,ServicePortfolio/Id,ServicePortfolio/Title,Package,Short_x0020_Description_x0020_On,Short_x0020_Description_x0020__x,Short_x0020_description_x0020__x0,Admin_x0020_Notes,AdminStatus,Background,Help_x0020_Information,BasicImageInfo,Item_x0020_Type,AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,Component/Id,Component/Title,Component/ItemType,Component/ItemType,Categories,FeedBack,component_x0020_link,FileLeafRef,Title,Id,Comments,StartDate,DueDate,Status,Body,Company,Mileage,PercentComplete,FeedBack,Attachments,Priority,Created,Modified,PermissionGroup/Id,PermissionGroup/Title,Team_x0020_Members/Id,Team_x0020_Members/Title,Services/Id,Services/Title,Services/ItemType,Parent/Id,Parent/Title,Parent/ItemType,SharewebCategories/Id,SharewebCategories/Title,ClientCategory/Id,ClientCategory/Title&$expand=ClientCategory,ComponentPortfolio,ServicePortfolio,Parent,AssignedTo,Services,Team_x0020_Members,Component,PermissionGroup,SharewebCategories&$filter=Id eq ${ID}&$top=4999`;
        var response: any = [];  // this variable is used for storing list items
        function GetListItems() {
            $.ajax({
                url: url,
                method: "GET", 
                headers: {
                    "Accept": "application/json; odata=verbose"
                }, 
                success: function (data) {
                    response = response.concat(data.d);
                    if (data.d.__next) {
                        url = data.d.__next;
                        GetListItems();
                    } else setTaskData(response);
                    console.log(response);
                },
                error: function (error) {
                    console.log(error);
                    // error handler code goes here
                }
            });
        }
        GetListItems();
    },
        []);


    return(
        <>
       

            <Button type='button' onClick={setModalSmartIsOpenToTrue}>Open Button</Button>
            <Modal
             isOpen={SmartmodalIsOpen}
             onDismiss={setModalSmartIsOpenToFalse}
             isBlocking={true}
             isModeless={true}
            >

        {/* Start Modal */}
        <div className="modal-content" ng-cloak>
    <div className="modal-header">
        <h3 ng-if="type=='add'" className="modal-title">
            Add SmartInformation
            <span ng-if="type=='add'" className="pull-right">
                {/* <page-settings-info webpartid="'sharewebAddSmartInfoPopup'"></page-settings-info> */}
            </span>
        </h3>

        <h3 ng-if="type=='edit'" className="modal-title">
            Edit SmartInformation - 
            {/* {{Item.Title}} */}
            <span ng-if="type=='edit'" className="pull-right">
                {/* <page-settings-info webpartid="'sharewebEditSmartInfoPopup'"></page-settings-info> */}
            </span>
        </h3>

        <button type="button" className="close" ng-click="CancelPopup()" onClick={setModalSmartIsOpenToFalse} style={{minWidth: "10px"}}>
            &times;
        </button>
    </div>
    <div className="modal-body bg-f5f5 clearfix">
        <div className="form-group clearfix">
            <form name="NewsNewForm" noValidate role="form">
                <div className="col-sm-8 form-group">
                    <label className="full_width">Title<span className="required">*</span></label>
                    <input id="Title" className="form-control" type="text" placeholder="Title"
                           ng-model="Item.Title" autoComplete="off"/>
                </div>

                <div className="col-sm-4 form-group mt-19">
                    <label className="full_width">InfoType</label>

                    <select className="full-width searchbox_height" name="txtInfoType" id="txtInfoType" ng-model="selectedSmartInfoName">
                        <option value="{{item.Title}}" ng-repeat="item in SmartInformation">
                            {/* {{item.Title}} */}
                            Itme Title
                            </option>
                    </select>
                </div>

                <div className="col-sm-8 form-group">
                    <form name="createlinktodocumentForm" noValidate role="form">
                        <label className="full_width">Url</label>
                        <input id="linkTitle" className="form-control" type="text" name="linkDocUrl" placeholder="Url" ng-pattern="/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/"
                               ng-model="Item.URL.Url"/>
                        <span className="required" ng-show="createlinktodocumentForm.linkDocUrl.$error.pattern">
                            Not
                            a valid url!
                        </span>
                    </form>
                </div>
                <div className="col-sm-4 form-group mt-19">
                    <label className="full_width">Acronym</label>
                    <input type="text" ng-required="true" autoComplete="off" title="Acronym"
                           placeholder="Acronym" className="form-control" id="txtAcronym" ng-model="Item.Acronym" />
                </div>
                <div className="col-sm-12 form-group" ng-if="type=='add'">
                    <div className="forFullScreenButton" id="discription"></div>
                    <div className="clearfix"></div>
                </div>
                <div className="col-sm-12 form-group" ng-if="type=='edit'">
                    <div className="forFullScreenButton" id="discriptionEdit"></div>
                    <div className="clearfix"></div>
                </div>

            </form>
            <div className="clearfix"></div>
        </div>

        {/* <!-- SmartInfo Table--> */}
        <div className="Alltable"ng-show="type=='add'">
            <div className="tbl-headings">
                <span className="leftsec">
                    <span>
                        <label>
                            {/* <!-- Showing {{filtered.length}} Of {{AllItems.length}} {{Item.Title}} items--> */}
                            {/* Showing {{AllSmartInfromation.length}} Of {{AllItems.length}} SmartInformation items */}
                            Showing Of SmartInformation items
                        </label>
                    </span>
                    <span className="g-search">
                        <input type="text" id="searchinput" className="searchbox_height full_width"  placeholder="search all"
                               ng-model="globalSearch"/>
                               {/* id="globalSearch" */}
                        <span ng-show="globalSearch.length>0" className="g-searchclear"
                              ng-click="clearControl('searchinput')">X</span>
                        <span className="gsearch-btn" ng-click="GlobalSearchAllItems()"><i className="fa fa-search"></i></span>
                    </span>
                </span>
            </div>

            <div id="Projectes">
                <div id="Projects" className="col-sm-12 pad0 smart">
                    <div id="printtable-wrapper" className="section-event">
                        <div className="container-new" id="table-wrapper1" ng-show="SmartItemId!=4539&&SmartItemId!=5527">
                            <table id="Projects" className="table table-hover" cellSpacing="0" width="100%">
                                <thead>
                                    <tr>
                                        <th style={{width: "1%"}}>
                                        </th>
                                        <th style={{width: "39%"}}>
                                            <div className="displayLabel" style={{width: "35%"}}>
                                                <label>Title</label>
                                            </div>
                                            <div className="headcontainer smart-relative" style={{width: "38%"}}>
                                                <input type="text" id="searchItem" className="searchbox_height full_width"
                                                       placeholder="Title" ng-model="searchTitle" />
                                                <span ng-show="searchTitle.length>0" className="searchclear"
                                                      ng-click="clearControl('searchTitle')">X</span>
                                                <span className="sorticon">
                                                    <span>
                                                        <i className="fa fa-angle-up hreflink {{orderBy=='Newtitle'&&!reverse?'footerUsercolor':''}}"
                                                           ng-click="sortBy('Newtitle', false)"></i>
                                                    </span>
                                                    <span>
                                                        <i className="fa fa-angle-down hreflink {{orderBy=='Newtitle'&&reverse?'footerUsercolor':''}}"
                                                           ng-click="sortBy('Newtitle', true)"></i>
                                                    </span>
                                                </span>
                                            </div>
                                        </th>
                                        <th style={{width: "59%"}}>
                                            <div className="displayLabel" style={{width: "58%"}}>
                                                <label>Description</label>
                                            </div>
                                            <div className="headcontainer smart-relative" style={{width: "58%"}}>
                                                <input type="text" id="searchDescription" className="searchbox_height full_width"
                                                       placeholder="Description" ng-model="searchDescription" />
                                                <span ng-show="searchDescription.length>0" className="searchclear"
                                                      ng-click="clearControl('searchDescription')">X</span>
                                                <span className="sorticon">
                                                    <span>
                                                        <i className="fa fa-angle-up hreflink {{orderBy=='FileLeafRef'&&!reverse?'siteColor':''}}" ng-click="sortBy('FileLeafRef', false)"></i>
                                                    </span>
                                                    <span>
                                                        <i className="fa fa-angle-down hreflink {{orderBy=='FileLeafRef'&&reverse?'siteColor':''}}" ng-click="sortBy('FileLeafRef', true)"></i>
                                                    </span>
                                                </span>
                                            </div>
                                        </th>
                                        <th style={{width: "1%"}}>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr ng-repeat="item in AllSmartInfromation = (AllSmartInfromation |orderBy:orderBy:reverse | filter:{Newtitle:searchTitle,Description:searchDescription}) track by $index">
                                        <td>
                                            <input type="checkbox"
                                                   ng-model="item.Checkbox" ng-click="selectitem(item,item.Checkbox)"
                                                   className="mt--5 no-padding"/>
                                        </td>
                                        <td>
                                            <span ng-show="item.Acronym!=undefined && item.Acronym!=''">
                                                {/* ({{item.Acronym}}) */}
                                                </span>
                                        </td>
                                        <td ng-model="searchDescription"><span ng-bind-html="item.Description | trustedHTML"></span></td>
                                        <td><a ng-if="isOwner==true" title="Edit" ng-click="editSmartInfoItem(item,'edit')"><img src="/_layouts/images/edititem.gif"/></a></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
               
            </div>

            
        
        </div>
        {/* <!-- End of Table--> */}

    

    <div className="modal-footer">
        <div ng-if="type=='edit'" className="col-sm-6 pad0 text-left">
            {/* <item-info></item-info> */}
        </div>
        <div className="col-sm-6 pad0 pull-right">
            <span ng-if="type=='edit'">
                <a target="_blank" ng-href="{{baseUrl}}/Lists/SmartInformation/EditForm.aspx?ID={{Item.ID}}">
                    Open
                    out-of-the-box form
                </a>
            </span>
            <button type="button" className="btn btn-primary" ng-click="saveuploaddocument()">+ Add Items</button>
            {/* <!--<button type="button" className="btn btn-primary" ng-disabled="Item.Title==undefined || Item.Title==''" ng-click="saveSharewebItem()">Save</button>--> */}
            <button type="button" className="btn btn-primary"  ng-click="saveSharewebItem()">Save</button>
            <button type="button" className="btn btn-default" onClick={setModalSmartIsOpenToFalse} ng-click="CancelPopup()">Cancel</button>
        </div>
    </div>
  
</div>
</div>
        {/* End Modal */}



     
   </Modal> 
   
    </>
    )

}