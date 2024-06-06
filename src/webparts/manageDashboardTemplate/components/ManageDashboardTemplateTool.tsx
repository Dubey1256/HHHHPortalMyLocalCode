import * as React from 'react';
import { useEffect } from 'react';
import { Dropdown, Panel, PanelType } from 'office-ui-fabric-react';
import { sp, Web } from "sp-pnp-js";
import GlobalCommanTable from '../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable';
import { ColumnDef } from '@tanstack/react-table';
import moment from 'moment';
import * as globalCommon from '../../../globalComponents/globalCommon';


let PrevSelectedSmartFav: any = '';
var AllSitesData: any = [];
let AutoCompleteItemsArray: any = [];
let PercentComplete: any = [];  
let Actions: any = [];
let PriorityRank: any = [];
let tempArray: any = [];

const ManageDashboardTemplateTable = (props: any) => {
    const [WebpartConfig, setWebpartConfig] = React.useState<any>([]);
    const [IsOpenPopup, setIsOpenPopup] = React.useState<any>(false);
    const [EditItem, setEditItem] = React.useState<any>(undefined);
    const [PopupSmartFav, setPopupSmartFav] = React.useState(false);
    const [selectedSmartFav, setselectedSmartFav] = React.useState<any>(undefined);

    const [SearchedCategoryData, setSearchedCategoryData] = React.useState<any>([]);
    const [SearchedSmartFavData, setSearchedSmartFavData] = React.useState<any>([]);
    const [TaskCategoriesData, setTaskCategoriesData] = React.useState<any>([]);

    const [SmartFav, setSmartFav] = React.useState<any>([]);
    let AllListId: any = {
        TaskUserListID: props?.AdminConfigurationListID,
        siteUrl: props?.props?.Context?._pageContext?._web?.absoluteUrl,
        Context: props?.props?.Context

    };
    const LoadAdminConfiguration = async () => {
        //  let templateArray: any=[];
        let templateDataArray: any = [];
        const web = new Web(props?.props?.Context?._pageContext?._web?.absoluteUrl);
        await web.lists.getById(props?.props?.AdminConfigurationListID).items.select("Title", "Id", "Value", "Key", "Configurations").filter("Key eq 'DashboardTemplate'").getAll().then((data: any) => {
            if (data != undefined && data?.length > 0) {
                // if (DashboardId != undefined && DashboardId != '')
                //     data = data?.filter((config: any) => config?.Value == DashboardId);
                data?.forEach((config: any) => {
                    if (config?.Configurations != undefined && config?.Configurations != '') {
                        let configurations = globalCommon.parseJSON(config?.Configurations);
                        if (configurations != undefined && configurations.length>0) {
                            configurations?.forEach((val: any) => {
                                templateDataArray.push(val);
                            });
                        }
                    }
                });
                setWebpartConfig(templateDataArray);
                SmartMetaDataListInformations();
            }
        }).catch((err: any) => {
            console.log(err);
        })
    };

    var getSmartMetadataItemsByTaxType = function (metadataItems: any, taxType: any) {
        var Items: any = [];
        metadataItems.map((taxItem: any) => {
            if (taxItem.TaxType === taxType) Items.push(taxItem);
        });
        Items.sort((a: any, b: any) => {
            return a.SortOrder - b.SortOrder;
        });
        return Items;
    };
    var loadSmartTaxonomyPortfolioPopup = (AllTaxonomyItems: any, SmartTaxonomy: any) => {
        var TaxonomyItems: any = [];
        var uniqueNames: any = [];
        $.each(AllTaxonomyItems, function (index: any, item: any) {
            if (item.ParentID == 0 && SmartTaxonomy == item.TaxType) {
                TaxonomyItems.push(item);
                getChildsCate(item, AllTaxonomyItems);
                if (item.childs != undefined && item.childs.length > 0) {
                    TaxonomyItems.push(item);
                }
                uniqueNames = TaxonomyItems.filter((val: any, id: any, array: any) => {
                    return array?.indexOf(val) == id;
                });
            }
        });
        return uniqueNames;
    };
    const getChildsCate = (item: any, items: any) => {
        item.childs = [];
        $.each(items, function (index: any, childItem: any) {
            if (
                childItem.ParentID != undefined &&
                parseInt(childItem.ParentID) == item.ID
            ) {
                childItem.isChild = true;
                item.childs.push(childItem);
                getChildsCate(childItem, items);
            }
        });
    };
    const SmartMetaDataListInformations = async () => {
        let AllSmartDataListData: any = [];
        let AllCategoriesData: any = [];
        let CategoriesGroupByData: any = [];
      
        try {
            let web = new Web(props?.props?.Context?._pageContext?._web?.absoluteUrl);
            AllSmartDataListData = await web.lists.getById(props?.props?.SmartMetadataListID)
                .items.select("Id,Title,listId,siteUrl,siteName,Item_x005F_x0020_Cover,ParentID,Configurations,EncodedAbsUrl,IsVisible,Created,Modified,Description1,SortOrder,Selectable,TaxType,Created,Modified,Author/Name,Author/Title,Editor/Name,Editor/Title,IsSendAttentionEmail/Id,IsSendAttentionEmail/Title,IsSendAttentionEmail/EMail").expand("Author,Editor,IsSendAttentionEmail").getAll();
            AllCategoriesData = getSmartMetadataItemsByTaxType(AllSmartDataListData, "Categories");
            AllSitesData = getSmartMetadataItemsByTaxType(AllSmartDataListData, "Sites");
            PriorityRank = getSmartMetadataItemsByTaxType(AllSmartDataListData, "Priority Rank");
            PriorityRank = PriorityRank.toReversed()
            PercentComplete = getSmartMetadataItemsByTaxType(AllSmartDataListData, "Percent Complete");
            PercentComplete = PercentComplete.filter((percentComplete: any) => percentComplete?.ParentId != undefined && percentComplete?.ParentId != '');
            PercentComplete = PercentComplete.sort((a: any, b: any) => { return a.SortOrder - b.SortOrder; });
            Actions = getSmartMetadataItemsByTaxType(AllSmartDataListData, "Actions");
            Actions = Actions.sort((a: any, b: any) => { return a.SortOrder - b.SortOrder; });
          
            AllSmartDataListData?.map((SmartItemData: any, index: any) => {
                SmartItemData.newTitle = SmartItemData.Title;
            })
            AllSitesData?.map((site: any) => {
                if (site.Title !== undefined && site.Title !== "Foundation" && site.Title !== "Master Tasks" && site.Title !== "DRR" && site.Title !== "SDC Sites" && site.Title !== "SP Online") {
                    site.BtnStatus = false;
                    site.value = site?.Title;
                    site.status = site?.Title;
                    site.isSelected = false;
                    tempArray.push(site);
                }
            });
            PriorityRank?.map((priorityrank: any) => {
                priorityrank.value = parseInt(priorityrank?.Title)
                priorityrank.status = priorityrank?.Title
            });
          
            PercentComplete?.map((percentComplete: any) => {
                percentComplete.value = parseFloat(percentComplete?.Title?.split('%')[0])
                percentComplete.status = percentComplete?.Title
            });

            Actions?.map((action: any) => {
                action.value = action?.Title
                action.status = action?.Title
            });
                

            if (AllCategoriesData?.length > 0) {
                CategoriesGroupByData = loadSmartTaxonomyPortfolioPopup(AllCategoriesData, "Categories");
                if (CategoriesGroupByData?.length > 0) {
                    CategoriesGroupByData?.map((item: any) => {
                        if (item.newTitle != undefined) {
                            item["Newlabel"] = item.newTitle;
                            AutoCompleteItemsArray.push(item);
                            if (
                                item.childs != null &&
                                item.childs != undefined &&
                                item.childs.length > 0
                            ) {
                                item.childs.map((childitem: any) => {
                                    if (childitem.newTitle != undefined) {
                                        childitem["Newlabel"] =
                                            item["Newlabel"] + " > " + childitem.Title;
                                        AutoCompleteItemsArray.push(childitem);
                                    }
                                    if (childitem.childs.length > 0) {
                                        childitem.childs.map((subchilditem: any) => {
                                            if (subchilditem.newTitle != undefined) {
                                                subchilditem["Newlabel"] =
                                                    childitem["Newlabel"] + " > " + subchilditem.Title;
                                                AutoCompleteItemsArray.push(subchilditem);
                                            }
                                        });
                                    }
                                });
                            }
                        }
                    });
                }
                if (AutoCompleteItemsArray?.length > 0) {
                    AutoCompleteItemsArray = AutoCompleteItemsArray.reduce(function (previous: any, current: any) {
                        var alredyExists =
                            previous.filter(function (item: any) { return item.Title === current.Title; }).length > 0;
                        if (!alredyExists) {
                            previous.push(current);
                        }
                        return previous;
                    },
                        []);
                }
            }
        } catch (error) {
            console.log("Error : ", error.message);
        }
    };



    React.useEffect(() => {
        LoadAdminConfiguration();
    
    }, []);
  
    const callBackData = React.useCallback((checkData: any) => {
    }, []);

    const columns: any = React.useMemo<ColumnDef<any, unknown>[]>(
        () => [
            {
                accessorKey: "",
                placeholder: "",
                hasCheckbox: false,
                hasCustomExpanded: false,
                hasExpanded: false,
                size: 1,
                id: 'Id',
            },

            {
                accessorFn: (row) => row?.WebpartTitle,
                cell: ({ row }) => (
                    <div className="alignCenter">
                        {row?.original?.WebpartTitle}
                    </div>
                ),
                id: "Title",
                placeholder: "Title",
                resetColumnFilters: false,
                header: "",
                size: 300,
                isColumnVisible: true,
            },
            {
                accessorFn: (row) => row?.WebpartTitle,
                cell: ({ row }) => (
                    <div className="alignCenter">
                       <span className="alignIcon  mt--5 "><span  onClick={() => openSmartFav(row?.original?.WebpartTitle, row?.original)}  className=" svg__iconbox svg__icon--info dark"></span></span>
                    </div>
                ),
                id: "Custom Filter",
                placeholder: "Custom Filter",
                resetColumnFilters: false,
                header: "",
                size: 80,
                isColumnVisible: true,
            },
        ],
        [WebpartConfig]
    );

    const customHeader = () => {
        return (
            <>
                <div className="subheading">
                    Select Filter
                </div>
            </>
        )
    };
    const openSmartFav = (items: any, val:any) => {
        // setselectedSmartFav(SelectedDashboard?.items?.selectedSmartFav)

         PrevSelectedSmartFav = { ...selectedSmartFav };
         if(items==='Status')
         setSmartFav(PercentComplete);
         if(items==='Actions')
            setSmartFav(Actions);
         if(items==='Priority')
            setSmartFav(PriorityRank);
         if(items==='Sites')
            setSmartFav(tempArray);
         if(items==='Categories')
            setSmartFav(AutoCompleteItemsArray);
        setPopupSmartFav(true)
    }
    const saveSelectSmartFav = () => {
        // const updatedItems = [...NewItem];
        // updatedItems[SelectedDashboard?.index] = { ...SelectedDashboard?.items, selectedSmartFav: selectedSmartFav, smartFevId: selectedSmartFav?.UpdatedId, Status: '', selectUserFilterType: '' };
        // setNewItem(updatedItems);
        setPopupSmartFav(false)
    }
    const cancelSelectSmartFav = () => {
         setselectedSmartFav(PrevSelectedSmartFav)
        // const updatedItems = [...NewItem];
        // updatedItems[SelectedDashboard?.index] = { ...SelectedDashboard?.items, selectedSmartFav: PrevSelectedSmartFav, smartFevId: PrevSelectedSmartFav?.UpdatedId, Status: '', selectUserFilterType: '' };
        // setNewItem(updatedItems);
        setPopupSmartFav(false)
       // SelectedDashboard = undefined
    }
    const deleteSelectedSmartFav = () => {
        setselectedSmartFav(undefined)
      //  const updatedItems = [...NewItem];
      //  updatedItems[SelectedDashboard?.index] = { ...SelectedDashboard?.items, selectedSmartFav: {}, smartFevId: '', Status: '', selectUserFilterType: '' };
    }
    const selectPickerData = (item: any) => {
         setselectedSmartFav(item)
        // const updatedItems = [...NewItem];
        // updatedItems[SelectedDashboard?.index] = { ...SelectedDashboard?.items, selectedSmartFav: SelectedDashboard, smartFevId: SelectedDashboard?.UpdatedId, Status: '', selectUserFilterType: '' };
        // setNewItem(updatedItems);
    }

    return (
        <>
            <h3 className="heading">Manage Dashboard Template
            </h3>
            {/* <div ><a className="pull-right empCol hreflink" onClick={(e) => AddNewConfig()}> Add New Dashboard </a>
            </div> */}
            <div className='TableSection'>
                <div className="Alltable">
                    {WebpartConfig?.length > 0 && (
                        <GlobalCommanTable columnSettingIcon={true} tableId="DashboardConfigID" AllListId={AllListId} hideOpenNewTableIcon={true} hideTeamIcon={true} showHeader={true} portfolioColor={'#000066'} columns={columns} data={WebpartConfig} callBackData={callBackData} />
                    )}
                </div>
                {/* {IsOpenPopup && <AddConfiguration props={props?.props} EditItem={EditItem} IsOpenPopup={IsOpenPopup} CloseConfigPopup={CloseConfigPopup} />} */}
            </div>

            <Panel
                onRenderHeader={customHeader}
                isOpen={PopupSmartFav} type={PanelType.custom} customWidth="800px" onDismiss={cancelSelectSmartFav} isBlocking={false}  >
                <div id="SmartFavoritePopup">
                    <div className={"modal-body"}>
                        <div className="mb-2">
                            {selectedSmartFav != undefined && selectedSmartFav?.Title != undefined ?
                                <div className="full-width">
                                    <span className="block me-1">
                                        <span>{selectedSmartFav?.Title}</span>
                                        <span className="bg-light hreflink ms-2 svg__icon--cross svg__iconbox" onClick={() => deleteSelectedSmartFav()}></span>
                                    </span>
                                </div> : null}
                        </div>
                        <div className='col-sm-12 mt-16'>
                            <ul className="categories-menu p-0 maXh-300 overflow-auto p-0">
                                {SmartFav.map(function (item: any) {
                                    return (
                                        <>
                                            <li key={item.Id}>
                                                <div onClick={() => selectPickerData(item)} className='alignCenter hreflink justify-content-between'>
                                                    <span >
                                                        {item.Title}
                                                    </span>
                                                </div>
                                            </li>
                                        </>
                                    )
                                })}
                            </ul>
                        </div>
                    </div>
                    <footer className={"fixed-bottom bg-f4 p-3"}>
                        <div className="alignCenter justify-content-between">
                            <div className="">
                            </div>
                            <div className="pull-right">
                                <button type="button" className="btn btn-primary px-3 mx-1" onClick={saveSelectSmartFav} >
                                    Save
                                </button>
                                <button type="button" className="btn btn-default mx-1" onClick={cancelSelectSmartFav} >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </footer>
                </div>
            </Panel >
        </>
    );
}
export default ManageDashboardTemplateTable;