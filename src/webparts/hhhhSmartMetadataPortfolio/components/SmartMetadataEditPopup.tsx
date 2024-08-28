import { ColumnDef } from '@tanstack/react-table';
import { Panel, PanelType } from 'office-ui-fabric-react';
import * as React from 'react';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Web } from 'sp-pnp-js';
import GlobalCommanTable from '../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable';
import Tooltip from '../../../globalComponents/Tooltip';
import VersionHistory from '../../../globalComponents/VersionHistroy/VersionHistory';
import PageLoader from '../../../globalComponents/pageLoader';
import moment from 'moment';
import * as globalCommon from '../../../globalComponents/globalCommon'
import ImagetabFunction from '../../EditPopupFiles/ImageInformation';
import HtmlEditor from '../../../globalComponents/HtmlEditor/HtmlEditor';
import RichTextEditorComponent from '../../../globalComponents/RichTextEditor';
let modaltype: any;
let SitesConfig: any[] = []
let allSitesTask: any[] = []
let Selecteditems: any[] = [];
let allCalls: any[] = []
var childItems: any = [];
let selectfilterarray: any = [];
var ChangedTopCategories: any = [];
let CurrentSiteUrl: any;
export default function SmartMetadataEditPopup(props: any) {
    if (props?.AllList?.SPSitesListUrl === undefined || props?.AllList?.SPSitesListUrl === '')
        props.AllList.SPSitesListUrl = props?.AllList?.SitesListUrl;
    const [state, rerender] = React.useReducer(() => ({}), {});
    const [activeTab, setActiveTab] = useState('');
    const [AllSitesTask, setAllSitesTask]: any = useState([]);
    const [dropdownArray, setDropdownArray]: any = useState([]);
    const [loaded, setloaded]: any = useState(false);
    const [, setVersionHistoryPopup] = React.useState(false);
    const [IsComponentPicker, setIsComponentPicker] = React.useState(false);
    const [openChangeParentPopup, setOpenChangeParentPopup] = useState(false);
    const [selectedOptionTop, setSelectedOptionTop] = useState('');
    const [FilterTypeData, setFilterTypeData] = React.useState([]);
    const [Smartdatapopup, setSmartdatapopup] = React.useState(false);
    const [selectedOptionSecond, setSelectedOptionSecond] = useState('');
    const [autoSearchFilterType, setAutoSearchFilterType] = React.useState([]);
    const [searchFilterType, setsearchFilterType] = React.useState([]);
    const [selectedChangedCategories, setSelectedChangedCategories] = useState('');
    const [metadatPopupBreadcrum, setMetadatPopupBreadcrum]: any = useState([]);
    const [opensmartmetapopup, setopensmartmetapopup] = useState(false);
    const [smartFilterArray, setSmartFilterArray]: any = useState([]);
    const [IsLoaderActive, setIsLoaderActive] = useState(false);
    const [TaggedsmartFilterArray, setTaggedsmartFilterArray]: any = useState([]);
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
        ItemRank: '',
        Description1: '',
        ParentID: "",
        TaxType: "",
        siteName: "",
        PageContent: "",
        ShortDescription: "",
        HelpDescription: "",
        Visibility: "Draft",
        SubTitle: '',
        PageTitle: '',
        ProfileType: '',
        href: '',
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
    if (props?.modalInstance?.Item_x0020_Cover !== undefined && props?.modalInstance?.Item_x0020_Cover !== '')
        props.modalInstance.Item_x002d_Image = props?.modalInstance?.Item_x0020_Cover;
    useEffect(() => {
        if (props?.siteName === 'GmbH') {
            setActiveTab('WebPageInfo')
        } else {
            setActiveTab('BasicInfo')
        }
    }, [props?.siteName]);
    const CloseEditSmartMetaPopup = () => {
        props.CloseEditSmartMetaPopup();
    }
    const handleTabChange = (tab: any) => {
        if (tab === "TaskInfo") {
            loadtaggedTasks();
        }
        setActiveTab(tab);
    };
    const loaddropdown = async () => {
        try {
            const web = new Web(props?.AllList?.SPSitesListUrl);
            const fieldsData = await web.lists.getById(props.AllList.SmartMetadataListID).fields.filter("EntityPropertyName eq 'Status'").select('Choices').get();
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
        var deleteConfirmation = confirm("Are you sure, you want to delete this item?");
        if (deleteConfirmation) {
            let web = new Web(props?.AllList?.SPSitesListUrl);
            await web.lists
                .getById(props?.AllList?.SmartMetadataListID)
                .items.getById(item.Id)
                .delete()
                .then((i) => {
                    console.log(i);
                    // LoadTopNavigation();
                });
        }
    };
    const formatDate = (date: any) => {
        return (date && date !== "") ? moment(date).format("DD/MM/YYYY") : '';
    };
    const loadtaggedTasks = async () => {
        const TaggedTasks: any = []
        setloaded(true);
        SitesConfig = await globalCommon?.loadAllSiteTasks(props?.AllList, undefined);
        SitesConfig.filter((item: any) => {
            if (item.Categories !== null && item.Categories !== undefined) {
                if (props?.modalInstance?.TaxType === "Categories" && item?.Categories === props?.modalInstance?.Title) {
                    item.Modified = formatDate(item.Modified);
                    item.Created = formatDate(item.Created);
                    item.DueDate = formatDate(item.DueDate);
                    TaggedTasks.push(item)
                }

            }
        })
        if (TaggedTasks.length === 0 || TaggedTasks.length > 1) {
            setloaded(false)
            setAllSitesTask(TaggedTasks);
        }
    }
    const openParent = (Value: any) => {
        setOpenChangeParentPopup(true)
    }

    const showingBreadcrumb = (metadata: any) => {
        const findBreadcrumb = (itemId: any) => {
            const item = props?.MetadataItems?.find((top: any) => top.Id === itemId);
            if (item) {
                breadcrumb.unshift(item);
                if (item.ParentID) {
                    findBreadcrumb(item.ParentID);
                }
            }
        };
        const breadcrumb: any = [];
        const manageSmartmetadataItem: any = props?.MetadataItems?.find(
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
    const opensmartmetadatapopup = (item: any) => {
        setSmartdatapopup(true);
        setopensmartmetapopup(true);
        setSmartFilterArray(item);
        setTaggedsmartFilterArray(FilterTypeData);
    };
    const customHeader = () => (
        <>
            <div className="subheading">Select SmartFilters</div>
            <Tooltip ComponentId="1741" />
        </>
    );
    const customFooter = () => (
        <>
            <footer className="bg-f4 p-3 text-end">
                <button type="button" className="btn btn-primary px-3 mx-1" onClick={saveselectedData} >
                    Save
                </button>
                <button type="button" className="btn btn-default" onClick={closePopupSmartPopup} >
                    Cancel
                </button>
            </footer>
        </>
    );
    useEffect(() => {
        loaddropdown();
        //loadSmartfilters();
        const getDataOfSmartMetaData = async () => {
            try {
                const web = new Web(props?.AllList?.SPSitesListUrl);
                const query = `TaxType eq '${props.modalInstance.TaxType}'`
                const select = `*,Author/Title,Editor/Title,Parent/Id,Parent/Title`;
                const items = await web.lists.getById(props?.AllList?.SmartMetadataListID).items.select(select).expand("Author,Editor,Parent").filter(query).getAll();
                const smart_filters_Data = await web.lists.getById(props?.AllList?.SmartMetadataListID).fields.filter("EntityPropertyName eq 'SmartFilters'").select('Choices').get();
                setSmartFilterArray(smart_filters_Data[0].Choices);
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
            }
        }
        SecondLevel = parent;
        Levels = Levels;
        ThirdLevel = firstParent;
        FourthLevel = lastparent;
        TaxType = taxType;
        if (item != undefined) {
            modaltype = 'Update';
            if (item?.Item_x005F_x0020_Cover != undefined && item?.Item_x005F_x0020_Cover?.Url != undefined)
                selectedImageUrl = item.Item_x005F_x0020_Cover.Url;
            item.PageTitle = item.Title
            if (item.TaxType === 'Topics')
                item.ProfileType = 'Topic'
            if (item.TaxType === 'Countries')
                item.ProfileType = 'Countries'
            if (item.TaxType === 'Activities' && item.ProfileType !== 'Event')
                item.ProfileType = 'Activities'
            if (item.TaxType === 'Smart Pages')
                item.ProfileType = 'Smart Pages'
            if (item.TaxType === 'Smart Pages') {
                item.href = `${props?.AllList?.SPSitesListUrl}/SitePages/Pages.aspx?SmartID=${item.Id}&Item=${item.Title}`
            }
            if (item.TaxType === 'Countries') {
                item.href = `${props?.AllList?.SPSitesListUrl}/SitePages/Pages.aspx?SmartID=${item.Id}&Item=${item.Title}`
            }
            if (item.TaxType === 'Topics') {
                item.href = `${props?.AllList?.SPSitesListUrl}/SitePages/Profiles.aspx?SmartID=${item.Id}&Item=${item.Title}`
            }
            if (item.ProfileType === 'Event') {
                item.href = `${props?.AllList?.SPSitesListUrl}/SitePages/Profiles.aspx?SmartID=${item.Id}&Item=${item.Title}`
            }
            if (item?.PageContent !== '' && item?.PageContent !== undefined && item?.PageContent !== null) {
                item.PageContent = item?.PageContent?.replaceAll("&#58;", ":");
            }
            if (props?.smartDescription !== '' && props?.smartDescription !== undefined && props?.smartDescription !== null) {
                item['Description'] = props?.smartDescription;
            }
            item.smartFilterSearch = '';
            if (item?.SmartFilters != null && item?.SmartFilters?.length > 0) {
                setFilterTypeData(item?.SmartFilters);
                item.smartFilterSearch = item?.SmartFilters?.map((elem: any) => elem).join(" ")
            }
            if (item.Description !== undefined && item.Description !== '') {
                item.Description = item?.Description?.replace(/<\/?[^>]+(>|$)/g, '');
            }
            if (item.Item_x0020_Cover !== undefined && item.Item_x0020_Cover !== '')
                item.Item_x002d_Image = item.Item_x0020_Cover;
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
                                TaskCategoriesId: { "results": Category },
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
    const processImageSrc = async (htmlString: any) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');
        const imgTags = doc.querySelectorAll('img');
        let promises: any = [];
        let date = new Date();
        let TimeStamp = date.getTime();
        let Count: any = 0;
        imgTags.forEach(img => {
            let src = img.getAttribute('src');
            if (src?.length > 800) {
                setIsLoaderActive(true);
                Count++;
                let DataObject = {
                    data_url: src,
                    file: "Image/jpg",
                    fileName: `Cover_Image_${Count}_${TimeStamp + ""}_${SmartTaxonomyItem?.Id}_${SmartTaxonomyItem?.Title}.jpg`
                }
                promises.push(uploadImageFolder(DataObject).then(GetImageUrl => {
                    img.setAttribute('src', GetImageUrl);
                    console.log("src", GetImageUrl);
                    setIsLoaderActive(false);
                }));
            }
        });

        await Promise.all(promises);
        return doc.documentElement.outerHTML;
    }
    const uploadImageFolder = async (Data: any) => {
        var src = Data.data_url?.split(",")[1];
        let FinalPreparedArray = ''
        var byteArray = new Uint8Array(atob(src)?.split("")?.map(function (c) {
            return c.charCodeAt(0);
        }));
        const data = byteArray
        var fileData = '';
        for (var i = 0; i < byteArray.byteLength; i++) {
            fileData += String.fromCharCode(byteArray[i]);
        }
        const web = new Web(props?.AllList?.SPSitesListUrl);
        const folder = web.getFolderByServerRelativeUrl(`PublishingImages/Page-Images`);

        try {
            const item = await folder.files.add(Data.fileName, data);
            let imageURL = `${props?.AllList?.Context?._pageContext?._web?.absoluteUrl.split(props?.AllList?.Context?.pageContext?._web?.serverRelativeUrl)[0]}${item?.data?.ServerRelativeUrl}`;
            FinalPreparedArray = imageURL;
            return FinalPreparedArray;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
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
            const getTheUpdatedContent: any = await processImageSrc(SmartTaxonomyItem.PageContent);
            const item = {
                Title: SmartTaxonomyItem.Title,
                AlternativeTitle: SmartTaxonomyItem.AlternativeTitle !== null ? SmartTaxonomyItem.AlternativeTitle : SmartTaxonomyItem.Title,
                LongTitle: SmartTaxonomyItem.LongTitle !== null ? SmartTaxonomyItem.LongTitle : '',
                ParentID: SmartTaxonomyItem.ParentID,
                ParentId: SmartTaxonomyItem.ParentID,
                SortOrder: SmartTaxonomyItem.SortOrder,
                PageContent: getTheUpdatedContent?.includes('null') ? '' : getTheUpdatedContent,
                Description: SmartTaxonomyItem.Description !== null ? SmartTaxonomyItem.Description : '',
                TaxType: SmartTaxonomyItem.TaxType,
                ItemRank: SmartTaxonomyItem.ItemRank !== "" ? SmartTaxonomyItem.ItemRank : null,
                Status: SmartTaxonomyItem.Status != null ? SmartTaxonomyItem.Status : '',
                // siteName: SmartTaxonomyItem.siteName,
                SubTitle: SmartTaxonomyItem.SubTitle,
                // PageTitle: SmartTaxonomyItem.PageTitle,
                ProfileType: SmartTaxonomyItem.ProfileType,
                ShortDescription: SmartTaxonomyItem.ShortDescription !== null ? SmartTaxonomyItem.ShortDescription : '',
                HelpDescription: SmartTaxonomyItem.Description !== null ? SmartTaxonomyItem.Description : '',
                SmartFilters: { "results": SmartTaxonomyItem.SmartFilters },
                //SmartCountriesId: { "results": smart_Countries },
                //SmartActivitiesId: { "results": smart_Activity },
                //SmartTopicsId: { "results": smart_Topics },
                href: {
                    "__metadata": { type: "SP.FieldUrlValue" },
                    Description: SmartTaxonomyItem?.href?.Description != undefined ? SmartTaxonomyItem?.href?.Description : null,
                    Url: SmartTaxonomyItem?.href?.Url != undefined ? SmartTaxonomyItem?.href?.Url : null,
                },
                Item_x0020_Cover: {
                    "__metadata": { type: "SP.FieldUrlValue" },
                    Description: SmartTaxonomyItem?.Item_x0020_Cover?.Description != undefined ? SmartTaxonomyItem?.Item_x0020_Cover.Description : null,
                    Url: SmartTaxonomyItem?.Item_x0020_Cover?.Url != undefined ? SmartTaxonomyItem?.Item_x0020_Cover?.Url : null
                },
            };
            if (modaltype == "Add") {
                const web = new Web(props?.AllList?.SPSitesListUrl);
                await web.lists.getById(props.AllList.SmartMetadataListID).items.add(item);
                props.EditItemCallBack('', '', SmartTaxonomyItem?.TaxType, '')
                CloseEditSmartMetaPopup()
            }

            if (modaltype == "Update") {
                const web = new Web(props?.AllList?.SPSitesListUrl);
                await web.lists.getById(props.AllList.SmartMetadataListID).items.getById(SmartTaxonomyItem.Id).update(item);
                if (props?.EditItemCallBack !== undefined)
                    props?.EditItemCallBack('', '', SmartTaxonomyItem?.TaxType, '');
                if (props?.callBackProfilePagesItem !== undefined)
                    props?.callBackProfilePagesItem(SmartTaxonomyItem?.TaxType);
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
                <a target='_blank' href={`https://hhhhteams.sharepoint.com/sites/HHHH/sp/SitePages/Task-Profile.aspx?taskId=${row?.original.Id}&Site=${row?.original.siteType}`}>{row.original.Title}</a>

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
    const HtmlEditorCallBack = (items: any, usedFor: any) => {
        console.log(items);
        if (usedFor === "PageContent") {
            var PageContent = ""
            if (items == '<p></p>\n') {
                PageContent = ""
            } else {
                PageContent = items
            }
            setSmartTaxonomyItem({ ...SmartTaxonomyItem, PageContent: PageContent })
        }
    }

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
    const autoSuggestionsForSmartFilters = (e: any) => {
        let searchedKey: any = e.target.value;
        let tempArray: any = [];
        if (searchedKey?.length > 0) {
            smartFilterArray?.map((itemData: any) => {
                if (itemData?.toLowerCase().includes(searchedKey.toLowerCase())) {
                    tempArray.push(itemData);
                }
            });
            setsearchFilterType(tempArray);
        } else {
            setsearchFilterType([]);
        }
    };
    const handleSuggestionFilters = (suggestion: any) => {
        smartFilterArray?.map((items: any) => {
            if (items === suggestion) {
                SmartmetadatafilterTYpe([items]);
            }
        });
        setsearchFilterType([]);
    };
    const SmartmetadatafilterTYpe = React.useCallback((data: any) => {
        if (data === "Close") {
            setSmartdatapopup(false);
        } else {
            setSmartdatapopup(false);
            setFilterTypeData(data);
        }
    }, []);
    const deleteFilterItem = (Item: any) => {
        const updatedSelectedItems = FilterTypeData.filter(
            (valuee: any) => Item !== valuee
        );
        selectfilterarray = selectfilterarray.filter((type: any) => { Item !== type });
        setFilterTypeData(updatedSelectedItems);
        setTaggedsmartFilterArray(updatedSelectedItems);
    };
    const isItemExists = (arr: any, Title: any) => {
        var isExists = false;
        arr.forEach((item: any) => { if (item == Title) { isExists = true; return false; } });
        return isExists;
    }
    const handleItemClick = (item: any) => {
        selectfilterarray = TaggedsmartFilterArray?.length > 0 ? TaggedsmartFilterArray : selectfilterarray;
        if (!isItemExists(selectfilterarray, item)){
            selectfilterarray.push(item);
        }
        setTaggedsmartFilterArray(selectfilterarray);
        rerender();
    };
    const deleteSelectedFeature = (val: any) => {
        selectfilterarray = selectfilterarray !== undefined && selectfilterarray?.length > 0 ? selectfilterarray : FilterTypeData;
        selectfilterarray = selectfilterarray?.filter((valuee: any) => val !== valuee);
        setTaggedsmartFilterArray(selectfilterarray);
    };
    const closePopupSmartPopup = () => {
        if (FilterTypeData.length === 0 && TaggedsmartFilterArray?.length !== 0) {
            setTaggedsmartFilterArray([]);
            selectfilterarray=[];
        }
        rerender();
        setopensmartmetapopup(false);
    }
    const saveselectedData = () => {
        if(selectfilterarray?.length > 0){
            selectfilterarray?.forEach((new_item:any)=>{
                if(new_item?.indexOf(SmartTaxonomyItem?.SmartFilters) > -1){
                    SmartTaxonomyItem?.SmartFilters.push(new_item);
                }
            })
        }
        setFilterTypeData(selectfilterarray);
        setopensmartmetapopup(false);
    }
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
                        {props?.siteName !== 'GmbH' &&
                            <li className="nav-item" role="presentation">
                                <button onClick={() => handleTabChange('BasicInfo')} className="nav-link active" id="BasicInfo-tab" data-bs-toggle="tab" data-bs-target="#BasicInfo" type="button" role="tab" aria-controls="BasicInfo" aria-selected="true">BASIC INFORMATION</button>
                            </li>
                        }
                        {props?.siteName === 'GmbH' &&
                            <li className="nav-item" role="presentation">
                                <button onClick={() => handleTabChange('WebPageInfo')} className="nav-link active" id="WebPageInfo-tab" data-bs-toggle="tab" data-bs-target="#WebPageInfo" type="button" role="tab" aria-controls="WebPageInfo" aria-selected="true">WEBPAGE INFORMATION</button>
                            </li>
                        }
                        {props?.siteName === 'GmbH' &&
                            <li className="nav-item" role="presentation">
                                <button onClick={() => handleTabChange('MetadataInfo')} className="nav-link" id="MetadataInfo-tab" data-bs-toggle="tab" data-bs-target="#MetadataInfo" type="button" role="tab" aria-controls="MetadataInfo" aria-selected="false">METADATA INFORMATION</button>
                            </li>
                        }
                        {
                            <li className="nav-item" role="presentation">
                                <button onClick={() => handleTabChange('ImageInfo')} className="nav-link" id="ImageInfo-tab" data-bs-toggle="tab" data-bs-target="#ImageInfo" type="button" role="tab" aria-controls="ImageInfo" aria-selected="false">IMAGE INFORMATION</button>
                            </li>
                        }
                        {props?.siteName !== 'GmbH' &&
                            <li className="nav-item" role="presentation">
                                <button onClick={() => handleTabChange('TaskInfo')} className="nav-link" id="TaskInfo-tab" data-bs-toggle="tab" data-bs-target="#TaskInfo" type="button" role="tab" aria-controls="TaskInfo" aria-selected="false">TASKS</button>
                            </li>
                        }
                    </ul>
                    <div className="tab-content" id="myTabContent">
                        <div className={activeTab === 'BasicInfo' ? 'tab-pane fade show active' : 'tab-pane fade show active tab-pane fade'} id="BasicInfo" role="tabpanel" aria-labelledby="BasicInfo-tab">   {activeTab === 'BasicInfo' && (
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
                                                    <div className="col">
                                                        {props?.siteName !== 'Hub' && props?.siteName !== 'Management'}<div className=' input-group'>
                                                            <label className="full_width">SmartFilters </label>
                                                            {(FilterTypeData?.length == 0 ||
                                                                FilterTypeData[0] == undefined) && (
                                                                    <>
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            onChange={(e) =>
                                                                                autoSuggestionsForSmartFilters(e)
                                                                            }
                                                                        />
                                                                        <span className="input-group-text" title="Status Popup">
                                                                            <span title="SmartFilters" onClick={(e) => opensmartmetadatapopup(smartFilterArray)} className="svg__iconbox svg__icon--editBox"
                                                                            ></span>
                                                                        </span>
                                                                    </>
                                                                )}

                                                            {FilterTypeData &&
                                                                FilterTypeData?.length == 1 &&
                                                                FilterTypeData?.map((item: any) => {
                                                                    return (
                                                                        <>
                                                                            {item != undefined && (
                                                                                <div className="full-width replaceInput alignCenter">
                                                                                    {item?.length <= 17 ? <a style={{ color: "#fff !important" }}>
                                                                                        {item}
                                                                                    </a> :
                                                                                    <a style={{ color: "#fff !important" }}>
                                                                                        {item?.slice(0, 17) + '....'}
                                                                                    </a>}
                                                                                    <span className="input-group-text" placeholder="SmartFilters">
                                                                                        <span
                                                                                            title="SmartFilters"
                                                                                            onClick={(e) =>
                                                                                                opensmartmetadatapopup(smartFilterArray)
                                                                                            }
                                                                                            className="svg__iconbox svg__icon--editBox"
                                                                                        ></span>
                                                                                    </span>
                                                                                </div>
                                                                            )}
                                                                        </>
                                                                    );
                                                                })}
                                                            {searchFilterType?.length > 0 && (
                                                                <div className="SmartTableOnTaskPopup">
                                                                    <ul className="autosuggest-list maXh-200 scrollbar list-group">
                                                                        {searchFilterType.map(
                                                                            (suggestion: any, index: any) => (
                                                                                <li
                                                                                    className="hreflink list-group-item rounded-0 p-1 list-group-item-action"
                                                                                    key={index}
                                                                                    onClick={() =>
                                                                                        handleSuggestionFilters(suggestion)
                                                                                    }
                                                                                >
                                                                                    {suggestion}
                                                                                </li>
                                                                            )
                                                                        )}
                                                                    </ul>
                                                                </div>
                                                            )}
                                                            {FilterTypeData &&
                                                                FilterTypeData?.length > 1 ?
                                                                <>
                                                                    <input type="text" className="form-control" onChange={(e) => autoSuggestionsForSmartFilters(e)} />
                                                                    <span className="input-group-text" title="Status Popup">
                                                                        <span title="SmartFilters" onClick={(e) => opensmartmetadatapopup(smartFilterArray)} className="svg__iconbox svg__icon--editBox"
                                                                        ></span>
                                                                    </span>
                                                                    {FilterTypeData?.map((item: any) => {
                                                                        return (
                                                                            <>
                                                                                {item != undefined && (
                                                                                    <div className="block d-flex full-width justify-content-between mt-1">
                                                                                        <a style={{ color: "#fff !important" }}>
                                                                                            {item}
                                                                                        </a>
                                                                                        <span
                                                                                            className="bg-light svg__iconbox svg__icon--cross"
                                                                                            onClick={() =>
                                                                                                deleteFilterItem(item)
                                                                                            }
                                                                                        ></span>
                                                                                    </div>
                                                                                )}
                                                                            </>
                                                                        );
                                                                    })}
                                                                </>
                                                                : null}
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
                                                    value={SmartTaxonomyItem.Description}
                                                    onChange={(e) => setSmartTaxonomyItem({ ...SmartTaxonomyItem, Description: e.target.value })}
                                                ></textarea>

                                            </div>
                                        </div>
                                        <div className="row mt-2">
                                            <div className="form-group col-md-12 mt-2 introduction-editor">
                                                <label className="full_width">Page Content<b className="span-error">*</b></label>
                                                {SmartTaxonomyItem?.Title !== '' ?
                                                    <RichTextEditorComponent
                                                        EditorValue={SmartTaxonomyItem?.PageContent !== null || undefined ? SmartTaxonomyItem?.PageContent : ""}
                                                        HtmlEditorStateChange={(Data: any) => HtmlEditorCallBack(Data, "PageContent")}>
                                                    </RichTextEditorComponent> : ""}
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        )}
                        </div>
                        <div className={activeTab === 'WebPageInfo' ? 'tab-pane fade show active' : 'tab-pane fade show active tab-pane fade'} id="WebPageInfo" role="tabpanel" aria-labelledby="WebPageInfo-tab">   {activeTab === 'WebPageInfo' && (
                            <div className="modal-body">
                                <form name="NewForm" noValidate role="form">
                                    <div className="" style={{ background: '#f5f5f5 !important' }}>
                                        <div className='row'>
                                            <div className='col-md-12'>
                                                <div className="row">
                                                    <div className="col">
                                                        <div className='input-group'>
                                                            <label className='full-width'>Page Title<b className="span-error">*</b></label>
                                                            <input className="form-control" type="text" required id="txtTitle" value={SmartTaxonomyItem?.Title} onChange={(e) => setSmartTaxonomyItem({ ...SmartTaxonomyItem, Title: e.target.value })} />
                                                        </div>
                                                    </div>
                                                    <div className="col">
                                                        <div className=' input-group'>
                                                            <label className='full-width'>ProfileType</label>
                                                            {SmartTaxonomyItem?.ProfileType}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row mt-2">
                                                    <div className="col">
                                                        <div className=' input-group'>
                                                            <label className="full_width">Link</label>
                                                            {SmartTaxonomyItem?.href}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row mt-2">
                                            <div className="col-md-10">
                                                <div className='mt-3'>
                                                    <HtmlEditor editorValue={SmartTaxonomyItem?.PageContent !== null || undefined ? SmartTaxonomyItem?.PageContent : ""}
                                                        HtmlEditorStateChange={(Data: any) => HtmlEditorCallBack(Data, "PageContent")} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        )}
                        </div>
                        <div className={activeTab === 'MetadataInfo' ? 'tab-pane fade show active' : 'tab-pane fade show active tab-pane fade'} id="MetadataInfo" role="tabpanel" aria-labelledby="MetadataInfo-tab">   {activeTab === 'MetadataInfo' && (
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
                                                    value={SmartTaxonomyItem.Description}
                                                    onChange={(e) => setSmartTaxonomyItem({ ...SmartTaxonomyItem, Description: e.target.value })}
                                                ></textarea>

                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        )}
                        </div>
                        <div className={activeTab === 'ImageInfo' ? 'tab-pane fade show active' : 'tab-pane fade show active tab-pane fade'} id="ImageInfo" role="tabpanel" aria-labelledby="ImageInfo-tab">   {activeTab === 'ImageInfo' && (
                            <div className="modal-body">
                                <ImagetabFunction EditdocumentsData={props?.modalInstance}
                                    setData={setSmartTaxonomyItem}
                                    Context={props?.AllList?.Context}
                                    callBack={callBackData}
                                />
                            </div>
                        )}
                        </div>
                        <div className={activeTab === 'TaskInfo' ? 'tab-pane fade show active' : 'tab-pane fade show active tab-pane fade'} id="TaskInfo" role="tabpanel" aria-labelledby="TaskInfo-tab">   {activeTab === 'TaskInfo' && (
                            <div className="modal-body">
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
                                            {SmartTaxonomyItem?.Id && <VersionHistory listName='SmartMetadata'
                                                taskId={SmartTaxonomyItem?.Id}
                                                RequiredListIds={props?.AllList}
                                                siteUrls={props?.AllList?.SPSitesListUrl}
                                                listId={props?.AllList?.SmartMetadataListID}
                                                siteName = {props?.siteName}
                                            />}
                                        </div>
                                    </span>
                                </div>
                            </div>
                            <div className="footer-right">
                                <a
                                    data-interception="off"
                                    target="_blank"
                                    href={`${props?.AllList?.SPSitesListUrl}/Lists/SmartMetadata/EditForm.aspx?ID=${SmartTaxonomyItem.Id}`}
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
                        activeTab === "TaskInfo" && loaded ? <PageLoader /> : ''
                    }
                </Panel>
            </div>
            <Panel
                onRenderHeader={customHeader}
                isOpen={opensmartmetapopup}
                type={PanelType.custom}
                customWidth="375px"
                onDismiss={closePopupSmartPopup}
                isBlocking={false}
                onRenderFooter={customFooter}
            >
                <div className='modal-body'>
                    {TaggedsmartFilterArray?.length > 0 ? (
                        <div className="full-width">
                            {TaggedsmartFilterArray?.map((val: any, index: any) => (
                                <>
                                    {val != undefined && val != '' && val != undefined &&
                                        <span className="block me-1">
                                            <span>{val}</span>
                                            <span className="bg-light hreflink ms-2 svg__icon--cross svg__iconbox" onClick={() => deleteSelectedFeature(val)}>
                                            </span>
                                        </span>
                                    }
                                </>
                            ))}
                        </div>
                    ) : null}
                    <div className='mt-3'>
                        <ul className='categories-menu p-0  w-100'>
                            {smartFilterArray.map((item: any, index: any) => (
                                <li key={index} onClick={() => handleItemClick(item)}>
                                    <a target="_blank" >{item}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

            </Panel>
        </>
    );
}