import { ColumnDef } from '@tanstack/react-table';
import { Panel, PanelType } from 'office-ui-fabric-react';
import * as React from 'react';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Web } from 'sp-pnp-js';
import GlobalCommanTable from './GlobalCommanTableSmartmetadata';
import Tooltip from '../../../globalComponents/Tooltip';
import ImageTabComponenet from './ImageTabComponent'
import VersionHistory from '../../../globalComponents/VersionHistroy/VersionHistory';
import PageLoader from '../../../globalComponents/pageLoader';
import moment from 'moment';
let modaltype: any;
let SitesConfig: any[] = []
let allSitesTask: any[] = []
let Selecteditems: any[] = [];
let allCalls: any[] = []
var childItems: any = [];
var ChangedTopCategories: any = [];
let CurrentSiteUrl: any;
export default function SmartMetadataEditPopup(props: any) {
    const [activeTab, setActiveTab] = useState('BasicInfo');
    const [AllSitesTask, setAllSitesTask]: any = useState([]);
    const [dropdownArray, setDropdownArray]: any = useState([]);
    const [loaded, setloaded]: any = useState(false);
    // const [dropdownArraySmartfilter, setDropdownArraySmartfilter]: any = useState([]);
    const [, setVersionHistoryPopup] = React.useState(false);
    const [openChangeParentPopup, setOpenChangeParentPopup] = useState(false);
    const [selectedOptionTop, setSelectedOptionTop] = useState('');
    const [selectedOptionSecond, setSelectedOptionSecond] = useState('');
    const [selectedChangedCategories, setSelectedChangedCategories] = useState('');
    const [metadatPopupBreadcrum, setMetadatPopupBreadcrum]: any = useState([]);
    const [SmartTaxonomyItem, setSmartTaxonomyItem]: any = useState({
        Id: 0,
        Title: '',
        LongTitle: '',
        IsVisible: false,
        Selectable: false,
        SmartSuggestions: false,
        AlternativeTitle: '',
        SortOrder: '',
        Status: '',
        // SmartFilters: '',
        ItemRank: '',
        Description1: '',
        ParentID: "",
        TaxType: "",
        siteName: "",
    });
    let CategoryTitle: any;
    let SecondLevel: any;
    let Levels: any;
    let ThirdLevel: any;
    let FourthLevel: any;
    let TaxType: any;
    let selectedImageUrl: any;
    let Items: any
    let folderUrl: any
    let SelectItemImagetype: any = 'ItemImage';
    useEffect(() => {
    }, []);
    const CloseEditSmartMetaPopup = () => {
        props.CloseEditSmartMetaPopup();
    }
    const handleTabChange = (tab: any) => {
        setActiveTab(tab);
    };
    const loaddropdown = async () => {
        try {
            const web = new Web(props?.AllList?.SPSitesListUrl);
            const fieldsData = await web.lists.getById(props.AllList.SPSmartMetadataListID).fields.filter("EntityPropertyName eq 'Status'").select('Choices').get();
            if (fieldsData && fieldsData[0].Choices) {
                setDropdownArray(fieldsData[0].Choices);
                console.log('DropdownArray', dropdownArray);
            } else {
                console.error('No Choices found');
            }
        } catch (error) {
            console.error('Error loading dropdown:', error);
        }
    };
    // const loadSmartfilters = async () => {
    //     try {
    //         const web = new Web(props?.AllList?.SPSitesListUrl);
    //         const fieldsData = await web.lists.getById(props.AllList.SPSmartMetadataListID).fields.filter("EntityPropertyName eq 'SmartFilters'").select('Choices').get();
    //         if (fieldsData && fieldsData[0].Choices) {
    //             setDropdownArraySmartfilter(fieldsData[0].Choices);
    //             console.log('DropdownArray', dropdownArraySmartfilter);
    //         } else {
    //             console.error('No Choices found');
    //         }
    //     } catch (error) {
    //         console.error('Error loading dropdown:', error);
    //     }
    // };
    const getChilds = (item: any, items: any) => {
        item.childs = [];
        items.forEach((childItem: any) => {
            if (childItem.Parent != undefined && childItem.Parent.Id != undefined && childItem.Parent.Id == item.Id) {
                item.childs.push(childItem);
                getChilds(childItem, items);
            }
        });
    }
    const getSmartMetadataItemsByTaxType = (metadataItems: any, taxType: string) => {
        let Items: any[] = [];
        metadataItems.forEach((taxItem: any) => {
            if (taxItem.TaxType == taxType)
                Items.push(taxItem);
        });
        return Items;
    }
    const deleteDataFunction = async (item: any) => {
        var deleteConfirmation = confirm("Are you sure, you want to delete this?");
        if (deleteConfirmation) {
            let web = new Web(props?.AllList?.SPSitesListUrl);
            await web.lists
                .getById(props?.AllList?.SPSmartMetadataListID)
                .items.getById(item.Id)
                .delete()
                .then((i) => {
                    console.log(i);
                    // LoadTopNavigation();
                });
        }
    };
    const LoadAllMetaData = async () => {
        try {
            SitesConfig = [];
            const web = new Web(props?.AllList?.SPSitesListUrl);
            const query = `(TaxType eq 'Categories') or (TaxType eq 'Sites')`
            const select = `Id,Title,TaxType,listId`;
            const AllMetaData = await web.lists.getById(props.AllList.SPSmartMetadataListID).items.select(select).filter(query).getAll()
            SitesConfig = getSmartMetadataItemsByTaxType(AllMetaData, 'Sites');
            for (var i = 0; i < SitesConfig.length; i++) {
                if (SitesConfig[i].listId == undefined || SitesConfig[i].Title == 'Master Tasks') {
                    SitesConfig.splice(i, 1);
                    i--;
                }
            }
            loadAllSitesTask();
        } catch (error: any) {
            console.error(error);
        };
    }
    const loadAllSitesTask = async () => {
        try {
            //const filters = CategoryTitle ? `SharewebCategories/Id eq '${CategoryTitle}'` : '';
            allCalls = [];
            allCalls = SitesConfig.map((site) => {
                let web = new Web(props.AllList.SPSitesListUrl);
                return web.lists.getById(site.listId).items.select(`Id,Title,SharewebTaskLevel1No,SharewebTaskLevel2No,SharewebTaskType/Id,SharewebTaskType/Title,Component/Id,Services/Id,Events/Id,PercentComplete,ComponentId,ServicesId,EventsId,Priority_x0020_Rank,DueDate,Created,TaskID,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title,ParentTask/Id,ParentTask/Title,SharewebCategories/Id,SharewebCategories/Title,AssignedTo/Id,AssignedTo/Title,Team_x0020_Members/Id,Team_x0020_Members/Title,Responsible_x0020_Team/Id,Responsible_x0020_Team/Title`).expand('AssignedTo', 'Author', 'Editor', 'Component', 'Services', 'Events', 'Team_x0020_Members', 'ParentTask', 'SharewebCategories', 'Responsible_x0020_Team', 'SharewebTaskType')
                    .getAll();
            });
            setloaded(true);
            const success = await Promise.all(allCalls);
            allSitesTask = [];
            success.forEach((val) => {
                val.forEach((item: any) => {
                    if (item?.SharewebCategories.length > 0) {
                        item.SharewebCategories.forEach((cate: any) => {
                            if (cate.Id === CategoryTitle) {
                                item.Created = item.Created !== null ? moment(item?.Created).format("DD/MM/YYYY") : '';
                                item.DueDate = item.DueDate !== null ? moment(item?.DueDate).format("DD/MM/YYYY") : '';
                                item.Modified = item.Modified !== null ? moment(item?.Modified).format("DD/MM/YYYY") : '';
                                if (item.ComponentId.length > 0) {
                                    item['Portfoliotype'] = 'Component';
                                } else if (item.ServicesId.length > 0) {
                                    item['Portfoliotype'] = 'Service';
                                } else if (item.EventsId.length > 0) {
                                    item['Portfoliotype'] = 'Event';
                                }
                                if (item.PercentComplete != undefined) {
                                    item.PercentComplete = parseInt((item.PercentComplete * 100).toFixed(0));
                                } else if (item.PercentComplete != undefined)
                                    item.PercentComplete = parseInt((item.PercentComplete * 100).toFixed(0));
                                else
                                    item.PercentComplete = 0;
                                if (item.ComponentId.length > 0) {
                                    item.Portfoliotype = 'Component';
                                } else if (item.ServicesId.length > 0) {
                                    item.Portfoliotype = 'Service';
                                } else if (item.EventsId.length > 0) {
                                    item.Portfoliotype = 'Event';
                                }
                                if (item.siteType != undefined && item.siteType == 'Offshore Tasks') {
                                    item.Companytype = 'Offshoretask';
                                } else {
                                    item.Companytype = 'Alltask';
                                }
                                if (item.Companytype == 'Alltask') {
                                    allSitesTask.push(item);
                                }
                            }
                        })
                    } else {
                        if (item.SharewebCategories[0]?.Id === CategoryTitle) {
                            item.Created = item.Created !== null ? moment(item?.Created).format("DD/MM/YYYY") : '';
                            item.DueDate = item.DueDate !== null ? moment(item?.DueDate).format("DD/MM/YYYY") : '';
                            item.Modified = item.Modified !== null ? moment(item?.Modified).format("DD/MM/YYYY") : '';
                            if (item.ComponentId.length > 0) {
                                item['Portfoliotype'] = 'Component';
                            } else if (item.ServicesId.length > 0) {
                                item['Portfoliotype'] = 'Service';
                            } else if (item.EventsId.length > 0) {
                                item['Portfoliotype'] = 'Event';
                            }
                            if (item.PercentComplete != undefined) {
                                item.PercentComplete = parseInt((item.PercentComplete * 100).toFixed(0));
                            } else if (item.PercentComplete != undefined)
                                item.PercentComplete = parseInt((item.PercentComplete * 100).toFixed(0));
                            else
                                item.PercentComplete = 0;
                            if (item.ComponentId.length > 0) {
                                item.Portfoliotype = 'Component';
                            } else if (item.ServicesId.length > 0) {
                                item.Portfoliotype = 'Service';
                            } else if (item.EventsId.length > 0) {
                                item.Portfoliotype = 'Event';
                            }
                            if (item.siteType != undefined && item.siteType == 'Offshore Tasks') {
                                item.Companytype = 'Offshoretask';
                            } else {
                                item.Companytype = 'Alltask';
                            }
                            if (item.Companytype == 'Alltask') {
                                allSitesTask.push(item);
                            }
                        }
                    }
                });
            })
            setAllSitesTask(allSitesTask);
            setloaded(false);
        }
        catch (error) {
            console.error(error);
            // Handle errors
        }
    }
    const openParent = (Value: any) => {
        setOpenChangeParentPopup(true)
    }
    const showingBreadcrumb = (metadata: any) => {
        const findBreadcrumb = (itemId: any) => {
            const item = props?.MetadataItems.find((top: any) => top.Id === itemId);
            if (item) {
                breadcrumb.unshift(item);
                if (item.ParentID) {
                    findBreadcrumb(item.ParentID);
                }
            }
        };
        const breadcrumb: any = [];
        const manageSmartmetadataItem: any = props?.MetadataItems.find(
            (top: any) => top.Id === metadata.Id
        );
        if (manageSmartmetadataItem) {
            findBreadcrumb(manageSmartmetadataItem.Id);
        }
        setMetadatPopupBreadcrum(breadcrumb);
    };
    const closeParentPopup = () => {
        childItems = [];
        ChangedTopCategories = [];
        setOpenChangeParentPopup(false)
    }
    const changeParentMetadata = () => {
        if (selectedChangedCategories) {
            props?.ParentMetaDataItems?.filter((meta: any) => {
                if (meta?.Title === selectedChangedCategories) {
                    SmartTaxonomyItem.ParentID = meta?.Id
                    if (selectedOptionSecond && meta?.subRows.length > 0) {
                        meta.subRows.filter((row: any) => {
                            row?.Title === selectedOptionSecond ? SmartTaxonomyItem.ParentID = row?.Id : null;
                        })
                    }
                }
            })
        }
        if (selectedOptionTop) {
            props?.ParentMetaDataItems?.filter((meta: any) => {
                if (meta?.Title === selectedOptionTop) {
                    SmartTaxonomyItem.ParentID = meta?.Id
                    if (selectedOptionSecond && meta?.subRows.length > 0) {
                        meta.subRows.filter((row: any) => {
                            row?.Title === selectedOptionSecond ? SmartTaxonomyItem.ParentID = row?.Id : null;
                        })
                    }
                }
            })
        }
        closeParentPopup();
    }
    const handleChangeCategories = (ChangeCategoryItem: any) => {
        setSelectedChangedCategories(ChangeCategoryItem.target.value);
        if (ChangeCategoryItem.target.value) {
            ChangedTopCategories = props?.MetadataItems?.filter((meta: any) => meta?.Title === ChangeCategoryItem.target.value)
                .map((meta: any) => meta?.subRows);
        }
        console.log(ChangedTopCategories);
    }
    const handleTopOptionChange = (TopItem: any) => {
        setSelectedOptionTop(TopItem.target.value);
        if (TopItem.target.value) {
            childItems = props?.AllMetadata?.filter((meta: any) => meta?.Title === TopItem.target.value)
                .map((meta: any) => meta?.subRows);
        }
    };
    const handleSecondOptionChange = (SecondItem: any) => {
        setSelectedOptionSecond(SecondItem.target.value);
    };

    useEffect(() => {
        loaddropdown();
        //loadSmartfilters();
        const getDataOfSmartMetaData = async () => {
            try {
                const web = new Web(props?.AllList?.SPSitesListUrl);
                const query = `TaxType eq '${props.modalInstance.TaxType}'`
                const select = `*,Author/Title,Editor/Title,Parent/Id,Parent/Title`;
                const items = await web.lists.getById(props.AllList.SPSmartMetadataListID).items.select(select).expand("Author,Editor,Parent").filter(query).getAll();
                const SmartMetDataAllItems: any[] = [];
                items.forEach((item: any) => {
                    if (item.Parent == undefined) {
                        SmartMetDataAllItems.push(item);
                        getChilds(item, items);
                    }
                    if (props.modalInstance != undefined && props.modalInstance.Id == item.Id) {
                        Items = item;
                        Items.ItemRank = Items.ItemRank != null ? Items.ItemRank.toString() : "";
                    }
                });
                SmartMetDataAllItems.forEach((val) => {
                    if (props.modalInstance != undefined && val.Id == props.modalInstance.ParentId) {
                        parent = val;
                    }
                    if (val.childs != undefined && val.childs.length > 0) {
                        val.childs.forEach((value: any) => {
                            if (props.modalInstance != undefined && value.Id == props.modalInstance.ParentId) {
                                parent = value;
                            }
                            if (value.childs != undefined && value.childs.length > 0) {
                                value.childs.forEach((child: any) => {
                                    if (props.modalInstance != undefined && child.Id == props.modalInstance.ParentId) {
                                        parent = child;
                                    }
                                });
                            }
                        });
                    }
                });
                if (Items != undefined) {
                    openpopup(Items.TaxType, Items, props.modalInstance.parent, props.modalInstance.firstParent, props.modalInstance.lastparent, props.modalInstance.Levels);
                } else {
                    openpopup(props.modalInstance.taxType, props.modalInstance.Items, props.modalInstance.parent, props.modalInstance.firstParent, props.modalInstance.lastparent, props.modalInstance.Levels);
                }
            } catch (error) {
                console.error("Error getting Smart Metadata data:", error);
            }
        };
        getDataOfSmartMetaData();
    }, []);
    const openpopup = (taxType: string, item: any, parent: any, firstParent: any, lastparent: any, Levels: any) => {
        if (taxType == 'Categories') {
            if (item != undefined && item.Id != undefined) {
                CategoryTitle = item.Id;
                LoadAllMetaData();
            }
        }
        SecondLevel = parent;
        Levels = Levels;
        ThirdLevel = firstParent;
        FourthLevel = lastparent;
        TaxType = taxType;
        if (item != undefined) {
            modaltype = 'Update';
            if (item.Item_x005F_x0020_Cover != undefined && item.Item_x005F_x0020_Cover.Url != undefined)
                selectedImageUrl = item.Item_x005F_x0020_Cover.Url;
            setSmartTaxonomyItem(item)
        }
        else {
            let obj: { TaxType: any; ParentID: any } = { TaxType: "", ParentID: null };
            obj.TaxType = taxType;
            obj.ParentID = parent != undefined ? parent.Id : 0;
            modaltype = 'Add';
        }
        showingBreadcrumb(item);
    }
    const Removecategories = async () => {
        CurrentSiteUrl;
        if (Selecteditems.length > 0) {
            Selecteditems.forEach((smart: any) => {
                SitesConfig.forEach(async (selecteditem: any) => {
                    let selctitemid: any
                    let ListId: any
                    let Category: any[] = []
                    if (smart.siteType == selecteditem.Title) {
                        ListId = selecteditem.listId;
                        selctitemid = smart.Id;
                        if (smart.siteType == selecteditem.Title) {
                            let postData = {
                                SharewebCategoriesId: { "results": Category },
                            };
                            const web = new Web(props?.AllList?.SPSitesListUrl);
                            await web.lists.getById(ListId).items.getById(smart.Id).update(postData);
                            AllSitesTask.forEach((taskitem: any, index: any) => {
                                if (taskitem.Id == selctitemid) {
                                    AllSitesTask.splice(index, 1);
                                }
                            })
                        }
                    }

                })
            })
        }

        alert("Remove Categories Successfully");
        Selecteditems = [];
    };
    const UpdateItem = async () => {
        try {
            if (SmartTaxonomyItem.TaxType == "Client Category") {
                if (Levels == "SecondLevel") {
                    if (SecondLevel.Title == "e+i") {
                        setSmartTaxonomyItem({ ...SmartTaxonomyItem, siteName: "EI" });
                    } else if (SecondLevel.Title == "DA E+E") {
                        setSmartTaxonomyItem({ ...SmartTaxonomyItem, siteName: "ALAKDigital" });
                    } else if (SecondLevel.Title == "PSE") {
                        setSmartTaxonomyItem({ ...SmartTaxonomyItem, siteName: "EPS" });
                    } else if (SecondLevel.Title == "Other" || SecondLevel.Title == "Old") {
                        setSmartTaxonomyItem({ ...SmartTaxonomyItem, siteName: "" });
                    } else {
                        setSmartTaxonomyItem({ ...SmartTaxonomyItem, siteName: SecondLevel.Title });
                    }
                } else if (Levels == "ThirdLevel") {
                    if (ThirdLevel.Title == "e+i") {
                        setSmartTaxonomyItem({ ...SmartTaxonomyItem, siteName: "EI" });
                    } else if (ThirdLevel.Title == "DA E+E") {
                        setSmartTaxonomyItem({ ...SmartTaxonomyItem, siteName: "ALAKDigital" });
                    } else if (ThirdLevel.Title == "PSE") {
                        setSmartTaxonomyItem({ ...SmartTaxonomyItem, siteName: "EPS" });
                    } else if (ThirdLevel.Title == "Other" || ThirdLevel.Title == "Old") {
                        setSmartTaxonomyItem({ ...SmartTaxonomyItem, siteName: "" });
                    } else {
                        setSmartTaxonomyItem({ ...SmartTaxonomyItem, siteName: ThirdLevel.Title });
                    }
                } else if (Levels == "FourthLevel") {
                    if (FourthLevel.Title == "e+i") {
                        setSmartTaxonomyItem({ ...SmartTaxonomyItem, siteName: "EI" });
                    } else if (FourthLevel.Title == "DA E+E") {
                        setSmartTaxonomyItem({ ...SmartTaxonomyItem, siteName: "ALAKDigital" });
                    } else if (FourthLevel.Title == "PSE") {
                        setSmartTaxonomyItem({ ...SmartTaxonomyItem, siteName: "EPS" });
                    } else if (FourthLevel.Title == "Other" || FourthLevel.Title == "Old") {
                        setSmartTaxonomyItem({ ...SmartTaxonomyItem, siteName: "" });
                    } else {
                        setSmartTaxonomyItem({ ...SmartTaxonomyItem, siteName: FourthLevel.Title });
                    }
                }
            } else {
                setSmartTaxonomyItem({ ...SmartTaxonomyItem, siteName: "" });
            }
            const item = {
                Title: SmartTaxonomyItem.Title,
                AlternativeTitle: SmartTaxonomyItem.AlternativeTitle,
                LongTitle: SmartTaxonomyItem.LongTitle,
                ParentID: SmartTaxonomyItem.ParentID,
                ParentId: SmartTaxonomyItem.ParentID,
                SortOrder: SmartTaxonomyItem.SortOrder,
                Description1: SmartTaxonomyItem.Description1,
                TaxType: SmartTaxonomyItem.TaxType,
                IsVisible: SmartTaxonomyItem.IsVisible,
                SmartSuggestions: SmartTaxonomyItem.SmartSuggestions,
                Selectable: SmartTaxonomyItem.Selectable,
                ItemRank: SmartTaxonomyItem.ItemRank !== "" ? SmartTaxonomyItem.ItemRank : null,
                Status: SmartTaxonomyItem.Status,
                //SmartFilters: SmartTaxonomyItem.SmartFilters,
                siteName: SmartTaxonomyItem.siteName,

                Item_x005F_x0020_Cover: {
                    Description: selectedImageUrl,
                    Url: selectedImageUrl,
                },
            };
            if (SelectItemImagetype == "ItemImage") {
                item.Item_x005F_x0020_Cover = {
                    Description: selectedImageUrl,
                    Url: selectedImageUrl,
                };
            }
            if (modaltype == "Add") {
                const web = new Web(props?.AllList?.SPSitesListUrl);
                await web.lists.getById(props.AllList.SPSmartMetadataListID).items.add(item);
                props.EditItemCallBack('', '', SmartTaxonomyItem?.TaxType, '')
                CloseEditSmartMetaPopup()
            }

            if (modaltype == "Update") {
                const web = new Web(props?.AllList?.SPSitesListUrl);
                await web.lists.getById(props.AllList.SPSmartMetadataListID).items.getById(SmartTaxonomyItem.Id).update(item);
                props.EditItemCallBack('', '', SmartTaxonomyItem?.TaxType, '')
                CloseEditSmartMetaPopup()
            }

            // Handle other actions or state updates as needed
        } catch (error) {
            console.log("error")
            CloseEditSmartMetaPopup()
        }
    };
    const columns = useMemo<ColumnDef<unknown, unknown>[]>(() =>
        [{ accessorKey: "TaskID", placeholder: "Site", header: "", size: 10, },
        {
            cell: ({ row }: any) => (
                <a target='_blank' href={`https://hhhhteams.sharepoint.com/sites/HHHH/sp/SitePages/Task-Profile.aspx?taskId=${row?.original.Id}&Site=${row?.original.Title}`}>{row.original.Title}</a>

            ),
            accessorKey: 'Title',
            canSort: false,
            placeholder: 'Title',
            header: '',
            id: 'row.original',
            size: 10,
        },
        { accessorKey: "PercentComplete", placeholder: "Percent Complete", header: "", size: 10, },
        { accessorKey: "Created", placeholder: "Created", header: "", size: 10, },
        { accessorKey: "Modified", placeholder: "Modified", header: "", size: 10, },
        { accessorKey: "DueDate", placeholder: "DueDate", header: "", size: 10, },
        ], [AllSitesTask]);
    const callBackData = useCallback((elem: any, getSelectedRowModel: any) => {
        console.log(getSelectedRowModel)
        if (elem != undefined && elem.Id != undefined) {
            Selecteditems.push(elem)
        }
        console.log(elem)
    }, []);
    const onRenderCustomHeaderMetadata = () => {
        return (
            <>
                <div className='ps-4 siteColor subheading'>
                    Update SmartMetadata Item
                </div>
                <Tooltip ComponentId={'1630'} />
            </>
        );
    };
    const onRenderMetadataChangeParent = () => {
        return (
            <>
                <div className='ps-4 siteColor subheading'>
                    Select Parent
                </div>
                <Tooltip ComponentId={'1630'} />
            </>
        );
    };
    return (
        <>
            <div>
                {openChangeParentPopup && (
                    <section>
                        <Panel
                            onRenderHeader={onRenderMetadataChangeParent}
                            isOpen={true}
                            onDismiss={closeParentPopup}
                            isBlocking={false}
                            type={PanelType.medium}
                            closeButtonAriaLabel="Close"
                        >
                            <div className="modal-body">
                                <div className="col-sm-12 tab-content bdrbox pad10">
                                    {props?.TabSelected === "Categories" && <div className="form-group">
                                        <div className="col-xs-3">
                                            Change Categories:<b className="span-error">*</b>
                                        </div>
                                        <div className="col-xs-9">
                                            <select
                                                className="form-control"
                                                value={selectedChangedCategories}
                                                onChange={handleChangeCategories}
                                            >
                                                <option value="">Root</option>
                                                {props?.ParentMetaDataItems?.map((item: any) => (
                                                    <option key={item.Id} value={item.Title}>
                                                        {item.Title}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="clearfix"></div>
                                    </div>
                                    }
                                    {props?.TabSelected !== 'Categories' && <div className="form-group">
                                        <div className="col-xs-3">Top Level:</div>
                                        <div className="col-xs-9">
                                            <select
                                                className="form-control"
                                                value={selectedOptionTop}
                                                onChange={handleTopOptionChange}
                                            >
                                                <option value="">Root</option>
                                                {props?.AllMetadata?.map((item: any) => (
                                                    <option key={item.Id} value={item.Title}>
                                                        {item.Title}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="clearfix"></div>
                                    </div>}
                                    <div className="form-group">
                                        <div className="col-xs-3">
                                            Second Level:<b className="span-error">*</b>
                                        </div>
                                        <div className="col-xs-9">
                                            <select
                                                className="form-control"
                                                value={selectedOptionSecond}
                                                onChange={handleSecondOptionChange}
                                            >
                                                <option value="">Select</option>
                                                {props?.TabSelected === 'Categories' ?
                                                    ChangedTopCategories[0]?.map((item: any) => (
                                                        <option key={item.Id} value={item.Title}>
                                                            {item.Title}
                                                        </option>
                                                    )) :
                                                    childItems[0]?.map((item: any) => (
                                                        <option key={item.Id} value={item.Title}>
                                                            {item.Title}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>
                                        <div className="clearfix"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-2 text-end">
                                <button className="btn btn-primary" onClick={changeParentMetadata}>
                                    Save
                                </button>
                                <button className="btn btn-default ms-1" onClick={closeParentPopup}>
                                    Cancel
                                </button>
                            </div>
                        </Panel>
                    </section>
                )}
            </div>
            <div>
                <Panel
                    onRenderHeader={onRenderCustomHeaderMetadata}
                    isOpen={true}
                    onDismiss={props.CloseEditSmartMetaPopup}
                    isBlocking={false}
                    type={PanelType.large}
                    closeButtonAriaLabel="Close">
                    <ul className="nav nav-tabs" id="myTab" role="tablist">
                        <li className="nav-item" role="presentation">
                            <button onClick={() => handleTabChange('BasicInfo')} className="nav-link active" id="BasicInfo-tab" data-bs-toggle="tab" data-bs-target="#BasicInfo" type="button" role="tab" aria-controls="BasicInfo" aria-selected="true">BASIC INFORMATION</button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button onClick={() => handleTabChange('ImageInfo')} className="nav-link" id="ImageInfo-tab" data-bs-toggle="tab" data-bs-target="#ImageInfo" type="button" role="tab" aria-controls="ImageInfo" aria-selected="false">IMAGE INFORMATION</button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button onClick={() => handleTabChange('TaskInfo')} className="nav-link" id="TaskInfo-tab" data-bs-toggle="tab" data-bs-target="#TaskInfo" type="button" role="tab" aria-controls="TaskInfo" aria-selected="false">TASKS</button>
                        </li>
                    </ul>
                    <div className="tab-content" id="myTabContent">
                        <div className={activeTab == 'BasicInfo' ? 'tab-pane fade show active' : 'tab-pane fade show active tab-pane fade'} id="BasicInfo" role="tabpanel" aria-labelledby="BasicInfo-tab">   {activeTab == 'BasicInfo' && (
                            <div className="modal-body">
                                <form name="NewForm" noValidate role="form">
                                    <div className="" style={{ background: '#f5f5f5 !important' }}>
                                        <div id="parentdiv" className="row" style={{ marginBottom: '4px' }}>
                                            <div className="col-xs-9">
                                                <ul className=" m-0 p-0 spfxbreadcrumb">
                                                    {metadatPopupBreadcrum.map((item: any) => {
                                                        return (<li>
                                                            <a className='breadcrumbs__element'>{item.Title}</a>
                                                        </li>)
                                                    })}
                                                </ul>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='col-md-8'>
                                                <div className="row">
                                                    <div className="col">
                                                        <div className=' input-group'>
                                                            <label className='full-width'>Title<b className="span-error">*</b></label>
                                                            <input className="form-control" type="text" required id="txtTitle" value={SmartTaxonomyItem.Title} onChange={(e) => setSmartTaxonomyItem({ ...SmartTaxonomyItem, Title: e.target.value })} />
                                                        </div>
                                                    </div>
                                                    <div className="col">
                                                        <div className=' input-group'>
                                                            <label className='full-width'>Long Title</label>
                                                            <input className="form-control" type="text" value={SmartTaxonomyItem.LongTitle} onChange={(e) => setSmartTaxonomyItem({ ...SmartTaxonomyItem, LongTitle: e.target.value })} />
                                                        </div>
                                                    </div>


                                                </div>

                                                <div className="row mt-2">
                                                    <div className="col">
                                                        <div className=' input-group'>
                                                            <label className="full_width">Alternative Title</label>
                                                            <input className="form-control" type="text" value={SmartTaxonomyItem.AlternativeTitle} onChange={(e) => setSmartTaxonomyItem({ ...SmartTaxonomyItem, AlternativeTitle: e.target.value })} />
                                                        </div>
                                                    </div>
                                                    <div className="col">
                                                        <div className=' input-group'>
                                                            <label className="full_width">Sort Order<b className="span-error"></b></label>
                                                            <input className="form-control" type="text" value={SmartTaxonomyItem.SortOrder} onChange={(e) => setSmartTaxonomyItem({ ...SmartTaxonomyItem, SortOrder: e.target.value })} />
                                                        </div>
                                                    </div>
                                                    <div className="col">
                                                        <div className=' input-group'>
                                                            <label className='full-width'>Status</label>
                                                            <select className="form-control no-padding" value={SmartTaxonomyItem.Status} onChange={(e) => setSmartTaxonomyItem({ ...SmartTaxonomyItem, Status: e.target.value })}>
                                                                {dropdownArray.map((item: any, index: any) => (
                                                                    <option key={index} value={item}>
                                                                        {item}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div>
                                                    {/* <div className="col">
                                                        <div className=' input-group'>
                                                            <label className='full-width'>SmartFilters</label>
                                                            <select className="form-control no-padding" value={SmartTaxonomyItem.SmartFilters} onChange={(e) => setSmartTaxonomyItem({ ...SmartTaxonomyItem, SmartFilters: e.target.value })}>
                                                                {dropdownArraySmartfilter.map((item: any, index: any) => (
                                                                    <option key={index} value={item}>
                                                                        {item}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div> */}
                                                    <div className="col">
                                                        <div className=' input-group'>
                                                            <label className='full-width'>Item Rank</label>
                                                            <select className="form-control" id="ItemRankType" value={SmartTaxonomyItem.ItemRank} onChange={(e) => setSmartTaxonomyItem({ ...SmartTaxonomyItem, ItemRank: e.target.value })}>
                                                                <option value="">Select Item Rank</option>
                                                                <option value="8">(8) Top Highlights</option>
                                                                <option value="7">(7) Featured Item</option>
                                                                <option value="6">(6) Key Item</option>
                                                                <option value="5">(5) Relevant Item</option>
                                                                <option value="4">(4) Background Item</option>
                                                                <option value="1">(1) Archive</option>
                                                                <option value="0">(0) No Show</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-2 mt-md-3">

                                                <input className='form-check-input' type="checkbox" checked={SmartTaxonomyItem.IsVisible} onChange={(e) => setSmartTaxonomyItem({ ...SmartTaxonomyItem, IsVisible: e.target.checked })} />
                                                <label className='ms-1'>IsVisible</label><br />
                                                <input className='form-check-input' type="checkbox" checked={SmartTaxonomyItem.Selectable} onChange={(e) => setSmartTaxonomyItem({ ...SmartTaxonomyItem, Selectable: e.target.checked })} />
                                                <label className='ms-1'>Selectable</label><br />
                                                <input className='form-check-input' type="checkbox" checked={SmartTaxonomyItem.SmartSuggestions} onChange={(e) => setSmartTaxonomyItem({ ...SmartTaxonomyItem, SmartSuggestions: e.target.checked })} />
                                                <label className='ms-1'>Smart Suggestions</label>

                                            </div>
                                            <div className="col-md-2  text-end ">
                                                {/* <a style={{ float: 'right' }} href="javascript:void(0);" onClick={() => openparent(SecondLevel)}> */}
                                                <a href="javascript:void(0);">
                                                    Change Parent
                                                    <span onClick={() => openParent(SmartTaxonomyItem)} className="alignIcon  svg__iconbox svg__icon--edit"></span>
                                                </a>
                                            </div>
                                        </div>
                                        {TaxType == 'Topics' || TaxType == 'Countries' ? (
                                            <div className="form-group" style={{ marginTop: '-7px' }}>
                                                <div className="col-sm-12">
                                                    <label className="col-sm-4 no-padding">TargetDocumentFolder<b className="span-error">*</b></label>
                                                    <a style={{ float: 'left' }} href="javascript:void(0)" title="Click for Associated Folder">
                                                        Select folder
                                                    </a>
                                                    <div className="col-sm-6 no-padding">{folderUrl}</div>
                                                    <input id="newFolder" style={{ display: 'none' }} ng-required="false" ng-model="folderTitle" className="form-control" type="text" placeholder="Or type new folder name to create sub folder" />
                                                    <a ng-if="folderUrl != undefined" href="javascript:void(0)" title="Click for Associated Folder">
                                                        Change
                                                    </a>
                                                </div>
                                                <div className="clearfix"></div>
                                            </div>
                                        ) : null}
                                        <div className="row mt-2">
                                            <div className="form-group col-md-10">
                                                <label className="full_width">Help Description<b className="span-error">*</b></label>
                                                <textarea
                                                    className="full_width"
                                                    rows={4}
                                                    id="txtComments"
                                                    value={SmartTaxonomyItem.Description1}
                                                    onChange={(e) => setSmartTaxonomyItem({ ...SmartTaxonomyItem, Description1: e.target.value })}
                                                ></textarea>

                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        )}
                        </div>
                        <div className={activeTab == 'ImageInfo' ? 'tab-pane fade show active' : 'tab-pane fade show active tab-pane fade'} id="ImageInfo" role="tabpanel" aria-labelledby="ImageInfo">   {activeTab == 'ImageInfo' && (
                            <div className="modal-body" style={{ overflowY: 'auto' }}>
                                <ImageTabComponenet EditSmartMetaData={props?.MetadataItems} AllListId={props?.AllList} Context={props?.AllList?.Context} callBack={callBackData} />
                            </div>
                        )}
                        </div>
                        <div className={activeTab == 'TaskInfo' ? 'tab-pane fade show active' : 'tab-pane fade show active tab-pane fade'} id="TaskInfo" role="tabpanel" aria-labelledby="BasicInfo-tab">   {activeTab == 'TaskInfo' && (
                            <div className="modal-body" style={{ overflowY: 'auto' }}>
                                {
                                    AllSitesTask &&
                                    <GlobalCommanTable columns={columns} data={AllSitesTask} showHeader={true} callBackData={callBackData} />
                                }
                                {AllSitesTask.length > 0 && (
                                    <button
                                        disabled={Selecteditems.length === 0}
                                        type="button"
                                        className="pull-right btn btn-primary mb-5 mt-10"
                                        onClick={Removecategories}
                                    >
                                        Remove Categories
                                    </button>
                                )}
                            </div>
                        )}
                        </div>
                    </div>
                    <footer
                        className="bg-f4"
                        style={{
                            position: "absolute",
                            width: "100%",
                            bottom: "0px",
                            zIndex: "9",
                            left: "0px",
                        }}
                    >
                        <div className="align-items-center d-flex justify-content-between me-3 px-4 py-2">
                            <div>
                                <div className="">
                                    Created{" "}
                                    <span className="font-weight-normal siteColor">
                                        {" "}
                                        {SmartTaxonomyItem.Created
                                            ? moment(SmartTaxonomyItem.Created).format("DD/MM/YYYY")
                                            : ""}{" "}
                                    </span>{" "}
                                    By{" "}
                                    <span className="font-weight-normal siteColor">
                                        {SmartTaxonomyItem.Author?.Title ? SmartTaxonomyItem.Author?.Title : ""}
                                    </span>
                                </div>
                                <div>
                                    Last modified{" "}
                                    <span className="font-weight-normal siteColor">
                                        {" "}
                                        {SmartTaxonomyItem.Modified
                                            ? moment(SmartTaxonomyItem.Modified).format("DD/MM/YYYY")
                                            : ""}
                                    </span>{" "}
                                    By{" "}
                                    <span className="font-weight-normal siteColor">
                                        {SmartTaxonomyItem.Editor?.Title ? SmartTaxonomyItem.Editor.Title : ""}
                                    </span>
                                </div>
                                <div>
                                    <a className="hreflink siteColor">
                                        <span className="alignIcon svg__iconbox hreflink mini svg__icon--trash"></span>
                                        <span
                                            onClick={() => deleteDataFunction(SmartTaxonomyItem)}
                                        >
                                            Delete This Item
                                        </span>
                                    </a>

                                    |
                                    <span>
                                        <div className="text-left" onClick={() => setVersionHistoryPopup(false)}>
                                            {SmartTaxonomyItem?.Id && <VersionHistory
                                                taskId={SmartTaxonomyItem?.Id}
                                                RequiredListIds={props?.AllList}
                                                siteUrls={props?.AllList?.SPSitesListUrl}
                                                listId={props?.AllList?.SPSmartMetadataListID}
                                            />}
                                        </div>
                                    </span>
                                </div>
                            </div>
                            <div className="footer-right">
                                <a
                                    data-interception="off"
                                    target="_blank"
                                    href={`${props?.AllList?.SPSitesListUrl}/Lists/SmartMetadata/AllItems.aspx`}
                                >
                                    Open out-of-the-box form
                                </a>
                                <button
                                    type="button"
                                    className="btn btn-primary ms-2"
                                    onClick={() => UpdateItem()}
                                >
                                    Save
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-default ms-2"
                                    onClick={() => CloseEditSmartMetaPopup()}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </footer>
                    {
                        loaded ? <PageLoader /> : ''
                    }
                </Panel>
            </div >
        </>
    );
}