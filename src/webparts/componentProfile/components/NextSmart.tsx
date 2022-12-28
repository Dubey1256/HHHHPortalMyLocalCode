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

      {/* Edit Modal */}
      <div className="modal-header">
      <h3  className="modal-title">
            Edit SmartInformation - 
            {/* {{Item.Title}} */}
            <span  className="pull-right">
                {/* <page-settings-info webpartid="'sharewebEditSmartInfoPopup'"></page-settings-info> */}
            </span>
        </h3>


        <button type="button" className="close" onClick={setModalSmartIsOpenToFalse} style={{minWidth: "10px"}}>
            &times;
        </button>
         </div>

            {/*END Edit Modal */}

        {/* Start Modal */}
        <div className="modal-content" >
    <div className="modal-header">
        <h3  className="modal-title">
            Add SmartInformation
            <span  className="pull-right">
                {/* <page-settings-info webpartid="'sharewebAddSmartInfoPopup'"></page-settings-info> */}
            </span>
        </h3>

     

        <button type="button" className="close"  onClick={setModalSmartIsOpenToFalse} style={{minWidth: "10px"}}>
            &times;
        </button>
    </div>
    <div className="modal-body bg-f5f5 clearfix">
        <div className="form-group clearfix">
            <form name="NewsNewForm" noValidate role="form">
                <div className="col-sm-8 form-group">
                    <label className="full_width">Title<span className="required">*</span></label>
                    <input id="Title" className="form-control" type="text" placeholder="Title"
                            autoComplete="off"/>
                </div>

                <div className="col-sm-4 form-group mt-19">
                    <label className="full_width">InfoType</label>

                    <select className="full-width searchbox_height" name="txtInfoType" id="txtInfoType" >
                        <option value="{{item.Title}}" >
                            {/* {{item.Title}} */}
                            Itme Title
                            </option>
                    </select>
                </div>

                <div className="col-sm-8 form-group">
                    <form name="createlinktodocumentForm" noValidate role="form">
                        <label className="full_width">Url</label>
                        <input id="linkTitle" className="form-control" type="text" name="linkDocUrl" placeholder="Url" 
                              />
                        <span className="required" >
                            Not
                            a valid url!
                        </span>
                    </form>
                </div>
                <div className="col-sm-4 form-group mt-19">
                    <label className="full_width">Acronym</label>
                    <input type="text"  autoComplete="off" title="Acronym"
                           placeholder="Acronym" className="form-control" id="txtAcronym"  />
                </div>
                <div className="col-sm-12 form-group" >
                    <div className="forFullScreenButton" id="discription"></div>
                    <div className="clearfix"></div>
                </div>
                <div className="col-sm-12 form-group" >
                    <div className="forFullScreenButton" id="discriptionEdit"></div>
                    <div className="clearfix"></div>
                </div>

            </form>
            <div className="clearfix"></div>
        </div>

        {/* <!-- SmartInfo Table--> */}
        <div className="Alltable">
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
                              />
                               {/* id="globalSearch" */}
                        <span  className="g-searchclear"
                             >X</span>
                        <span className="gsearch-btn" ><i className="fa fa-search"></i></span>
                    </span>
                </span>
            </div>

            <div id="Projectes">
                <div id="Projects" className="col-sm-12 pad0 smart">
                    <div id="printtable-wrapper" className="section-event">
                        <div className="container-new" id="table-wrapper1" >
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
                                                       placeholder="Title"  />
                                                <span  className="searchclear"
                                                     >X</span>
                                                <span className="sorticon">
                                                    <span>
                                                        <i className="fa fa-angle-up hreflink {{orderBy=='Newtitle'&&!reverse?'footerUsercolor':''}}"
                                                         ></i>
                                                    </span>
                                                    <span>
                                                        <i className="fa fa-angle-down hreflink {{orderBy=='Newtitle'&&reverse?'footerUsercolor':''}}"
                                                          ></i>
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
                                                       placeholder="Description"  />
                                                <span  className="searchclear"
                                                     >X</span>
                                                <span className="sorticon">
                                                    <span>
                                                        <i className="fa fa-angle-up hreflink {{orderBy=='FileLeafRef'&&!reverse?'siteColor':''}}"></i>
                                                    </span>
                                                    <span>
                                                        <i className="fa fa-angle-down hreflink {{orderBy=='FileLeafRef'&&reverse?'siteColor':''}}"></i>
                                                    </span>
                                                </span>
                                            </div>
                                        </th>
                                        <th style={{width: "1%"}}>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr >
                                        <td>
                                            <input type="checkbox"
                                                    
                                                   className="mt--5 no-padding"/>
                                        </td>
                                        <td>
                                            <span >
                                                {/* ({{item.Acronym}}) */}
                                                </span>
                                        </td>
                                        <td ><span ></span></td>
                                        <td><a  title="Edit" ><img src="/_layouts/images/edititem.gif"/></a></td>
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
        <div  className="col-sm-6 pad0 text-left">
            {/* <item-info></item-info> */}
        </div>
        <div className="col-sm-6 pad0 pull-right">
            <span >
                <a target="_blank" >
                    Open
                    out-of-the-box form
                </a>
            </span>
            <button type="button" className="btn btn-primary" >+ Add Items</button>
         
            <button type="button" className="btn btn-primary" >Save</button>
            <button type="button" className="btn btn-default" onClick={setModalSmartIsOpenToFalse}>Cancel</button>
        </div>
    </div>
  
</div>
</div>
        {/* End Modal */}



     
   </Modal> 
   
    </>
    )
    

}