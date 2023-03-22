import * as React from "react";
import { arraysEqual, Modal, Panel, PanelType } from 'office-ui-fabric-react';
import pnp, { Web, SearchQuery, SearchResults } from "sp-pnp-js";
import Tooltip from "./Tooltip";
var AllMetaData:any=[]
var TaxonomyItems:any=[]
var NewArray: any = []
var AutoCompleteItemsArray: any = [];
const ClientCategoryPupup=(props:any)=>{
    const [PopupSmartTaxanomy, setPopupSmartTaxanomy] = React.useState(true);
    const [AllCategories, setAllCategories] = React.useState([]);
    const [searchedData, setSearchedData] = React.useState([])
    const [selectedCategory, setSelectedCategory] = React.useState([]);
    const [value, setValue] = React.useState("");
    const [select,setSelect] = React.useState([])
    console.log(props)
    React.useEffect(()=>{
        GetCategoryData();
    },[])
    const closePopupSmartTaxanomy = () => {
        setPopupSmartTaxanomy(false)
       // NewArray = []
       // setSelect([])
       // item.closePopupCallBack();

    }
    const GetCategoryData=async ()=>{
        const web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/SP');

        const res = await web.lists.getById('01a34938-8c7e-4ea6-a003-cee649e8c67a').items
            .select("Id,Title,TaxType,ParentID").top(4999)
            .filter("TaxType eq 'Client Category'")
            .get();
        console.log(res)
 
        TaxonomyItems = loadSmartTaxonomyPortfolioPopup(res)
        console.log(TaxonomyItems)
        setAllCategories(TaxonomyItems)
    }
    var loadSmartTaxonomyPortfolioPopup = (AllTaxonomyItems: any) => {
        var TaxonomyItems: any = [];
        var uniqueNames: any = [];
        $.each(AllTaxonomyItems, function (index: any, item: any) {
            if (item.ParentID == 0 && 'Client Category' == item.TaxType) {
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
    const customFooter = () => {
        return (
            <footer>
                <button type="button" className="btn btn-primary float-end me-5" onClick={()=>saveCategories()}>
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
    
    const selectPickerData = (item: any) => {
            NewArray.push(item)
            showSelectedData(NewArray);
        setValue('');
        setSearchedData([]);
    }
    const showSelectedData = (itemss: any) => {
            var categoriesItem: any = []
            var Array: any = []
            itemss.forEach(function (val: any) {
                if (val.Title != undefined) {
                    categoriesItem.push(val);

                }
            })
             Array = categoriesItem.filter((val: any, id: any, array: any) => {
                return array.indexOf(val) == id;
            })

            setSelect(Array)
        

    }
    const deleteSelectedCat = (val: any) => {
       
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
    function Example(callBack: any, type: any) {
        NewArray = []
        setSelect([])
        closePopupSmartTaxanomy()
        props.Call(callBack.props, type);
    }
    const saveCategories = () => {
      
        props.props.Clientcategories = [];
        props.props.smartClientCategories = [];
            var title: any = {}
            // title.Title = select;
            props.props.smartClientCategories.push(title);
            props.props.Clientcategories = NewArray;
            Example(props, 'ClientCategory');
        }

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
    return(
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
                                </div>
                            </div>
                            <div className="col-sm-12 ActivityBox">
                                 <div>
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
                                </div>
                            </div>
                         {/* <div className="col-sm-12 ActivityBox">
                                    <span>
                                        <a className="hreflink block" ng-click="removeSmartArray(item.Id)"> {select}
                                        <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/_layouts/images/delete.gif" onClick={() => deleteSelectedCat(val)}/></a>
                                    </span>
                                </div> 

                             <div className="col-sm-12 ActivityBox" ng-show="SmartTaxonomyName==newsmarttaxnomy">
                                <span>
                                    <a className="hreflink" ng-click="removeSmartArray(item.Id)"> {select}
                                    <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/_layouts/images/delete.gif"/></a>
                                </span>
                            </div> 
                        </div> */}
                        <div className='col-sm-12 categScroll'>
                            <ul className="categories-menu p-0">
                                {AllCategories.map(function (item: any) {
                                    return (
                                        <>
                                            <li>
                                               
                                                    <p onClick={() => selectPickerData(item)} className='mb-0 hreflink' >
                                                        <a>
                                                           
                                                            {item.Title}
                                                        </a>
                                                    </p>
                                                
                                                <ul ng-if="item.childs.length>0" className="sub-menu clr mar0">
                                                    {item.childs?.map(function (child1: any) {
                                                        return (
                                                            <>
                                                                {child1.Title != null ?
                                                                    <li>
                                                                        <p onClick={() => selectPickerData(child1)} className='mb-0 hreflink'>
                                                                            <a>
                                                                                {child1.Title}
                                                        

                                                                            </a>
                                                                        </p>

                                                                        <ul className="sub-menu clr mar0">
                                                                            {
                                                                                child1.childs?.map((subChilds: any) => {
                                                                                    return (
                                                                                        <li>
                                                                                            <p onClick={() => selectPickerData(subChilds)} className='mb-0 hreflink'>
                                                                                                <a>
                                                                                                   
                                                                                                    {subChilds.Title}
                                                                

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
                </div>
                </div>
            </Panel>
        </>
    )
}
export default ClientCategoryPupup



