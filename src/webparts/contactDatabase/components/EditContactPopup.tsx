import * as React from 'react';
import { useEffect, useState, useCallback } from 'react';
import { Web } from 'sp-pnp-js';
import { Panel, PanelType, DefaultButton } from 'office-ui-fabric-react';
import CountryContactEditPopup from './CountryContactEditPopup';
//import ImagesC from '../../gruneEventSite/components/EventImageInformation';
import ImagesC from "../../EditPopupFiles/ImageInformation";
import Smarttaxonomypopup from './Smarttaxonomypopup';
import Smartmetadatapickerin from '../../../globalComponents/Smartmetadatapickerindependent/SmartmetadatapickerSingleORMulti'
import Tooltip from '../../../globalComponents/Tooltip';
import moment from 'moment';
let AutoCompleteItemsArray: any = [];
let tempSmartCategoriesData: any = []
var tempCategoryData: any = "";
const EditContactPopup = (props: any) => {
    const [SelecteditContact, setSelecteditContact] = useState(true)
    let webs = new Web(props?.allListId?.baseUrl);
    const [contactDetails, setContactDetails]: any = React.useState({});
    const [currentCountry, setCurrentCountry]: any = useState([])
    const [categorySearchKey, setCategorySearchKey] = useState("");
    const [AllCategoryData, setAllCategoryData] = useState([]);
    const [SmartCategoriesData, setSmartCategoriesData] = useState([]);
    const [SearchedCategoryData, setSearchedCategoryData] = useState([]);
    const [imagetab, setImagetab] = React.useState(false);
    const [ActivityData, setActivityData] = useState([]);
    const [status, setStatus] = useState({
        orgPopup: false,
        taxanomypopup: false,
        CountryPopup: false
    });
    useEffect(() => {
        loadSmartTaxonomyItems()
    }, [])
    let itemId = props?.props?.Id
    const handleChange = (e: any) => {
        const { id, value } = e.target;
        setContactDetails({
            ...contactDetails,
            [id]: value
        });
    };
    const closeContactPopup = () => {
        setSelecteditContact(false)
        if (props.page != undefined && props.page != undefined && props.page != "ContactProfile" && props.page != "CreateNewContact" && props.page != "CreateContact") {
            props.closeEditContactPopup()
        }
        if (props.page != undefined && props.page != undefined && props.page == "CreateNewContact" || props.page == "CreateContact") {
            props.closeEditpoup(props.page)
        } if (props.page == "ContactProfile") {
            props.EditCallBackItemProfile("close")
        } else {
            props.closeEditContactPopup()
        }
    }
    const openSmartTaxonomyActivity = (item: any) => {
        setStatus({
            ...status, orgPopup: false,
            taxanomypopup: true,
            CountryPopup: false
        })
    }
    const openSmartTaxonomyCategories = (item: any) => {
        setStatus({
            ...status, orgPopup: false,
            taxanomypopup: false,
            CountryPopup: true
        })
    }
    const getContactDetails = async () => {
        try {
            //props?.allListId?.TeamContactSearchlistIds
            const select = "WorkCity,WorkFax ,WorkAddress,Id,WorkCountry,Email,FullName,WorkFax,ItemCover,SmartActivities/Id,SmartActivities/Title,SmartCategories/Id,SmartCategories/Title,Attachments,Categories,Company,JobTitle,FirstName,Title,Suffix,WebPage,IM,ol_Department,WorkPhone,CellPhone,HomePhone,WorkZip,Office,Comments,Created,Modified,Author/Name,Author/Title,Editor/Name,Editor/Title";
            const query = `Id eq ${itemId}`;
            const data = await webs.lists.getById(props?.allListId?.TeamContactSearchlistIds).items.select(select).expand('Author', 'Editor', 'SmartActivities', 'SmartCategories').filter(query).get();
            data.map((Item: any) => {
                if (Item?.Created != null && Item?.Created != undefined) {
                    Item.Created = moment(Item?.Created, "DD-MM-YYYY").format("DD/MM/YYYY");
                }
                if (Item?.Modified != null && Item?.Modified != undefined) {
                    Item.Modified = moment(Item?.Modified, "DD-MM-YYYY").format("DD/MM/YYYY");
                }
                if (Item.ItemCover != null && Item.ItemCover != undefined) {
                    Item.Item_x002d_Image = Item?.ItemCover

                }
            })
            const contact = data[0];
            if (contact.SmartCategories) {
                setSmartCategoriesData(contact.SmartCategories)
            }
            setContactDetails(contact);

        } catch (error) {
            console.error('Error fetching contact details:', error);
        }
    }
    const loadSmartTaxonomyPortfolioPopup = (AllTaxonomyItems: any, SmartTaxonomy: any) => {
        let TaxonomyItems: any = [];
        let uniqueNames: any = [];
        AllTaxonomyItems.map((item: any, index: any) => {
            if (item.ParentID == 0 && SmartTaxonomy == item.TaxType) {
                TaxonomyItems.push(item);
                getChilds(item, AllTaxonomyItems);
                if (item.childs != undefined && item.childs.length > 0) {
                    TaxonomyItems.push(item);
                }
                uniqueNames = TaxonomyItems.filter((val: any, id: any, array: any) => {
                    return array.indexOf(val) == id;
                });
            }
        });
        return uniqueNames;
    };
    const getChilds = (item: any, items: any) => {
        item.childs = [];
        items.map((childItem: any, index: any) => {
            if (
                childItem.ParentID != undefined &&
                parseInt(childItem.ParentID) == item.ID
            ) {
                childItem.isChild = true;
                item.childs.push(childItem);
                getChilds(childItem, items);
            }
        });
    };
    const loadSmartTaxonomyItems = async () => {
        let allActivity: any = []
        let AllCategoriesData: any = []
        let CategoriesGroupByData: any = [];
        try {
            const data = await webs.lists.getById(props?.allListId?.TeamSmartMetadatalistIds).items
                //const data = await webs.lists.getById("6020CAD5-BBE7-4626-A717-7FAAEDC99BA6").items
                .select('Id,Title,TaxType', 'ParentID').top(4999).get();

            data.map((taxItem: any) => {
                taxItem.newTitle = taxItem.Title;
                if (taxItem.TaxType === 'Activities') {
                    allActivity.push(taxItem)
                }
                if (taxItem.TaxType === 'Contact Categories') {
                    AllCategoriesData.push(taxItem)
                }
            })
            if (AllCategoriesData?.length > 0) {
                CategoriesGroupByData = loadSmartTaxonomyPortfolioPopup(
                    AllCategoriesData,
                    "Contact Categories"
                );
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

                setAllCategoryData(AutoCompleteItemsArray);
            }
            setActivityData(allActivity)
            getContactDetails();
        } catch (error) {
            console.error('Error loading smart taxonomy items:', error);
            alert('Error: ' + error.message);
        }
    };
    const CloseSmarttaxonomypopup = useCallback((data: any) => {
        setStatus({ ...status, taxanomypopup: false, CountryPopup: false })
        if (data != undefined) {
            setContactDetails(data);
            setSmartCategoriesData(data?.SmartCategories);
        }
    }, []);
    const setSmarttaxanomyIds = (Item: any) => {
        let Ids: any = []
        Item.map((i: any) => {
            Ids.push(i.Id)
        })
        return Ids;
    }
    const UpdateContact = function (Item: any) {
        let flag = false
        try {
            if (contactDetails?.Item_x002d_Image != undefined && contactDetails?.Item_x002d_Image?.Url != undefined) {
                contactDetails.ItemCover = contactDetails?.Item_x002d_Image
            }
            let smartActivityIds = setSmarttaxanomyIds(contactDetails.SmartActivities);
            let smartCategoriesIds = setSmarttaxanomyIds(contactDetails.SmartCategories);
            let postData = {
                Company: contactDetails?.Company,
                JobTitle: contactDetails?.JobTitle,
                Email: contactDetails?.Email,
                WorkCity: contactDetails?.WorkCity,
                WorkCountry: contactDetails?.WorkCountry,
                FirstName: contactDetails?.FirstName,
                Title: contactDetails?.Title,
                FullName: contactDetails?.FirstName + ' ' + contactDetails?.Title,
                Suffix: contactDetails?.Suffix,
                WebPage: contactDetails?.WebPage,
                IM: contactDetails?.IM,
                ol_Department: contactDetails?.ol_Department,
                WorkPhone: contactDetails?.WorkPhone,
                Categories: contactDetails?.Categories,
                CellPhone: contactDetails?.CellPhone,
                HomePhone: contactDetails?.HomePhone,
                WorkZip: contactDetails?.WorkZip,
                Office: contactDetails?.Office,
                Comments: contactDetails?.Comments,
                WorkAddress: contactDetails?.WorkAddress,
                WorkFax: contactDetails?.WorkFax,
                SmartActivitiesId: { results: smartActivityIds != undefined && smartActivityIds.length > 0 ? smartActivityIds : [], },
                SmartCategoriesId: { results: smartCategoriesIds != undefined && smartCategoriesIds.length > 0 ? smartCategoriesIds : [], },
                ItemCover: {
                    "__metadata": { type: "SP.FieldUrlValue" },
                    Description: contactDetails?.ItemCover != undefined ? contactDetails?.ItemCover?.Url : (contactDetails?.ItemCover != undefined ? contactDetails?.ItemCover?.Url : ""),
                    Url: contactDetails?.ItemCover != undefined ? contactDetails?.ItemCover?.Url : (contactDetails?.ItemCover != undefined ? contactDetails?.ItemCover?.Url : "")
                },
            };
            let updatedData = webs.lists.getById(props?.allListId?.TeamContactSearchlistIds).items.getById(Item.Id).update(postData)
            if (props.page != undefined && props.page != undefined && props.page == "ContactProfile") {
                props.EditCallBackItemProfile(contactDetails);
            }
            else if (props.page != undefined && props.page != undefined && props.page == "CreateNewContact" || props.page == "CreateContact") {
                flag = true
                props.closeEditpoup(props.page, "Update", contactDetails)
            } else {
                flag = true
                props.EditCallBackItem(contactDetails)
            }
            if (!flag)
                closeContactPopup()
        } catch (error) {
            console.error('Error updating contact details:', error);
        }
    };
    function imageta() {
        setImagetab(true);
    }
    const imageTabCallBack = React.useCallback((data: any) => {
        console.log(contactDetails);
        console.log(data);
    }, []);

    const removeItem = async () => {
        console.log("In Delete:");
        try {
            if (confirm("Are you sure, you want to delete this?")) {
                await webs.lists.getById(props?.allListId?.TeamContactSearchlistIds).items.getById(itemId).recycle().then((e) => {
                    console.log("Your information has been deleted");
                    closeContactPopup()
                    props.EditCallBackItem()
                });
                closeContactPopup()
                props.EditCallBackItem()
            }
        } catch (error) {
            console.log("Error:", error.message);
        }
    }
    const autoSuggestionsForCategory = (e: any) => {
        let searchedKey: any = e.target.value;
        setCategorySearchKey(e.target.value);
        let tempArray: any = [];
        if (searchedKey?.length > 0) {
            AutoCompleteItemsArray?.map((itemData: any) => {
                if (
                    itemData.Newlabel.toLowerCase().includes(searchedKey.toLowerCase())
                ) {
                    tempArray.push(itemData);
                }
            });
            setSearchedCategoryData(tempArray);
        } else {
            setSearchedCategoryData([]);
        }
    };
    const setSelectedCategoryData = (selectCategoryData: any, usedFor: any) => {
        selectCategoryData.forEach((i: any) => {
            tempSmartCategoriesData.push(i);
        });
        setSearchedCategoryData([])
        contactDetails.SmartCategories = tempSmartCategoriesData
        setSmartCategoriesData(tempSmartCategoriesData)
    }
    const removeCategoryItem = (TypeCategory: any, TypeId: any) => {
        let tempString: any;
        let tempArray2: any = [];
        tempSmartCategoriesData = [];
        SmartCategoriesData?.map((dataType: any) => {
            if (dataType.Id != TypeId) {
                tempArray2.push(dataType);
                tempSmartCategoriesData.push(dataType);
            }
        });
        tempCategoryData = tempString;
        setSmartCategoriesData(tempArray2);
    };
    const removeSelectTaxanomy = (item: any, taxType: any) => {
        if (taxType == 'Activities' && contactDetails.SmartActivities != undefined && contactDetails.SmartActivities != null && contactDetails.SmartActivities.length > 0) {
            contactDetails.SmartActivities.map((i: any, index: any) => {
                if (i?.Id == item?.Id) {
                    contactDetails.SmartActivities.splice(index, 1)
                }
            })
        }
        if (taxType == 'Contact Categories' && contactDetails.SmartCategories != undefined && contactDetails.SmartCategories != null && contactDetails.SmartCategories.length > 0) {
            contactDetails.SmartCategories.map((i: any, index: any) => {
                if (i.Id == item.Id) {
                    contactDetails.SmartCategories.splice(index, 1)
                }
            })
        }
        setContactDetails(contactDetails);
    }
    const CustomFooter = () => {
        return (
            <footer className='alignCenter'>
                <div className="col text-start">
                    <div>Created <span>{contactDetails?.Created}</span> by
                        <span className="primary-color"> {contactDetails?.Author?.Title}</span>
                    </div>
                    <div>Last modified <span> {contactDetails?.Modified}</span>
                        by
                        <span className="primary-color"> {contactDetails?.Editor?.Title}</span>
                    </div>
                    <div><a onClick={() => removeItem()} className="hreflink siteColor"><span className="alignIcon svg__iconbox hreflink mini svg__icon--trash"></span><span>Delete This Item</span></a></div>
                </div>
                <div className="col text-end">
                    <a href={`${props?.allListId?.baseUrl}/Sitepages/Contact-Profile.aspx?contactId=${contactDetails.Id}`} target="_blank">Go To Profile Page</a> | <a href={`${props?.allListId?.baseUrl}/Lists/Contacts/?ID=${contactDetails.Id}`} target="_blank">Open out-of-the-box form</a>
                    <button className='btn btn-primary mx-2' onClick={() => UpdateContact(props.props)}>Save</button>
                    <button className='btn btn-default' onClick={() => closeContactPopup()}>Cancel</button>
                </div>
            </footer>
        )
    }

    const onRenderCustomHeaderContactPopup = () => {
        return (
            <>
                <div className='subheading'>
                    Edit Contact - {contactDetails.FirstName + ' ' + contactDetails.Title}
                </div>
                <Tooltip ComponentId='3433' />
            </>
        );
    }
    return (
        <>
            <Panel
                onRenderHeader={onRenderCustomHeaderContactPopup}
                isOpen={SelecteditContact}
                isBlocking={!SelecteditContact}
                onDismiss={() => closeContactPopup()}
                closeButtonAriaLabel="Close"
                type={PanelType.large}
                onRenderFooterContent={CustomFooter}
                isFooterAtBottom={true}
            >
                <>
                    <div>
                        <form name="ItemForm" noValidate role="form">
                            <div id="tabs" className="exTab3 mt-10">
                                <ul className="fixed-Header nav nav-tabs" id="myTab" role="tablist">
                                    <button className={`nav-link ${imagetab == false ? "active" : ""}`}
                                        id="BASIC-INFORMATION"
                                        data-bs-toggle="tab"
                                        data-bs-target="#BASICINFORMATION"
                                        type="button"
                                        role="tab"
                                        onClick={() => setImagetab(false)}
                                        aria-controls="BASICINFORMATION"
                                        aria-selected="true">BASIC INFORMATION</button>
                                    <button className={`nav-link ${imagetab == true ? "active" : ""}`}
                                        id="IMAGE-INFORMATION"
                                        data-bs-toggle="tab"
                                        data-bs-target="#IMAGEINFORMATION"
                                        type="button"
                                        role="tab"
                                        aria-controls="IMAGEINFORMATION"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            imageta()
                                        }}
                                        aria-selected="true">IMAGE INFORMATION
                                    </button>
                                </ul>

                                <div className="border border-top-0 clearfix p-3 tab-content " id="myTabContent">
                                    <div className={`tab-pane show  ${imagetab == false ? "active" : ""}`} id="BASICINFORMATION" role="tabpanel" aria-labelledby="BASICINFORMATION">
                                        <table className="full-width table table-hover">
                                            <tr>
                                                <td>
                                                    <div className="col-sm-12">
                                                        <div className="row form-group">
                                                            <div className="col-sm-4 ps-0">
                                                                <div className='input-group'>
                                                                    <label htmlFor="FirstName" className='full-width form-label'>First Name</label>
                                                                    <input type="text" id="FirstName" className="form-control" defaultValue={contactDetails.FirstName} onChange={(e) => setContactDetails({ ...contactDetails, FirstName: e.target.value })} />
                                                                </div></div>
                                                            <div className="col-sm-4">
                                                                <div className='input-group'>
                                                                    <label htmlFor="Title" className='full-width form-label'>Last Name</label>
                                                                    <input type="text" id="Title" className="form-control" defaultValue={contactDetails.Title} onChange={(e) => setContactDetails({ ...contactDetails, Title: e.target.value })} />
                                                                </div></div>
                                                            <div className="col-sm-4 pe-0">
                                                                <div className='input-group'>
                                                                    <label htmlFor="WorkCity" className='full-width form-label'>WorkCity</label>
                                                                    <input type="text" id="WorkCity" className="form-control" defaultValue={contactDetails.WorkCity} onChange={(e) => setContactDetails({ ...contactDetails, WorkCity: e.target.value })} />
                                                                </div></div>
                                                        </div>
                                                        <div className="row form-group mt-2">
                                                            <div className="col-sm-4 ps-0">
                                                                <div className='input-group'>
                                                                    <label htmlFor="Email" className='full-width form-label'>Email</label>
                                                                    <input type="text" id="Email" className="form-control" defaultValue={contactDetails.Email} onChange={(e) => setContactDetails({ ...contactDetails, Email: e.target.value })} />
                                                                </div>
                                                            </div>
                                                            <div className="col-sm-4">
                                                                <div className='input-group'>
                                                                    <label htmlFor="WebPage" className='full-width form-label'>WebPage</label>
                                                                    <input className="form-control" type="text" defaultValue={contactDetails?.WebPage ? contactDetails?.WebPage.Url : ""} onChange={(e) => setContactDetails({ ...contactDetails, WebPage: { ...contactDetails.WebPage, Url: e.target.value } })} />
                                                                </div>
                                                            </div>
                                                            <div className="col-sm-4 pe-0">
                                                                <div className='input-group'>
                                                                    <label htmlFor="IM" className='full-width form-label'>Skype</label>
                                                                    <input type="text" id="IM" className="form-control" defaultValue={contactDetails.IM} onChange={(e) => setContactDetails({ ...contactDetails, IM: e.target.value })} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row form-group mt-2">
                                                            <div className="col-sm-4 ps-0">
                                                                <div className='input-group'>
                                                                    <label htmlFor="Company" className='full-width form-label'>Institution</label>
                                                                    <input type="text" id="Company" className="form-control" defaultValue={contactDetails.Company} onChange={(e) => setContactDetails({ ...contactDetails, Company: e.target.value })} />
                                                                </div></div>
                                                            <div className="col-sm-4">
                                                                <div className='input-group'>
                                                                    <label htmlFor="JobTitle" className='full-width form-label'>Job Title</label>
                                                                    <input type="text" id="JobTitle" className="form-control" defaultValue={contactDetails.JobTitle} onChange={(e) => setContactDetails({ ...contactDetails, JobTitle: e.target.value })} />
                                                                </div></div>
                                                            <div className="col-sm-4 pe-0">
                                                                <div className='input-group'>
                                                                    <label htmlFor="ol_Department" className='full-width form-label'>Division</label>
                                                                    <input type="text" id="ol_Department" className="form-control" defaultValue={contactDetails.ol_Department} onChange={(e) => setContactDetails({ ...contactDetails, ol_Department: e.target.value })} />
                                                                </div></div>
                                                        </div>
                                                        <div className="row form-group mt-2">
                                                            <div className="col-sm-4 ps-0">
                                                                <div className='input-group'>
                                                                    <label htmlFor="WorkPhone" className='full-width form-label'>Business Phone</label>
                                                                    <input type="text" id="WorkPhone" className="form-control" defaultValue={contactDetails.WorkPhone} onChange={(e) => setContactDetails({ ...contactDetails, WorkPhone: e.target.value })} />
                                                                </div></div>
                                                            <div className="col-sm-4">
                                                                <div className='input-group'>
                                                                    <label htmlFor="CellPhone" className='full-width form-label'>Mobile Number</label>
                                                                    <input type="text" id="CellPhone" className="form-control" defaultValue={contactDetails.CellPhone} onChange={(e) => setContactDetails({ ...contactDetails, CellPhone: e.target.value })} />
                                                                </div></div>
                                                            <div className="col-sm-4 pe-0">
                                                                <div className='input-group'>
                                                                    <label htmlFor="HomePhone" className='full-width form-label'>Home Phone</label>
                                                                    <input type="text" id="HomePhone" className="form-control" defaultValue={contactDetails.HomePhone} onChange={(e) => setContactDetails({ ...contactDetails, HomePhone: e.target.value })} />
                                                                </div></div>
                                                        </div>
                                                        <div className="row form-group mt-2">
                                                            <div className="col-sm-4 ps-0">
                                                                <div className='input-group'>
                                                                    <label htmlFor="WorkZip" className='full-width form-label'>ZIP Code</label>
                                                                    <input type="text" id="WorkZip" className="form-control" defaultValue={contactDetails.WorkZip} onChange={(e) => setContactDetails({ ...contactDetails, WorkZip: e.target.value })} />
                                                                </div></div>
                                                            <div className="col-sm-4">
                                                                <div className='input-group'>
                                                                    <label htmlFor="Office" className='full-width form-label'>Office</label>
                                                                    <input type="text" id="Office" className="form-control" defaultValue={contactDetails.Office} onChange={(e) => setContactDetails({ ...contactDetails, Office: e.target.value })} />
                                                                </div></div>
                                                            <div className="col-sm-4 pe-0">
                                                                <div className='input-group'>
                                                                    <label htmlFor="WorkCountry" className='full-width form-label'>Country</label>
                                                                    <input type="text" id="WorkCountry" className="form-control" defaultValue={contactDetails.WorkCountry} onChange={(e) => setContactDetails({ ...contactDetails, WorkCountry: e.target.value })} />
                                                                </div></div>
                                                        </div>
                                                        <div className="row form-group mt-2">
                                                            <div className="col-sm-4 ps-0">
                                                                <div className='input-group'>
                                                                    <label htmlFor="WorkFax" className='full-width form-label'>Fax</label>
                                                                    <input type="text" id="WorkFax" className="form-control" defaultValue={contactDetails.WorkFax} onChange={(e) => setContactDetails({ ...contactDetails, WorkFax: e.target.value })} />
                                                                </div></div>
                                                            <div className="col-sm-4">
                                                                <div className='input-group'>
                                                                    <label htmlFor="WorkAddress" className='full-width form-label'>Address</label>
                                                                    <input type="text" id="WorkAddress" className="form-control" defaultValue={contactDetails.WorkAddress} onChange={(e) => setContactDetails({ ...contactDetails, WorkAddress: e.target.value })} />
                                                                </div></div>
                                                        </div>
                                                    </div>
                                                    <div className="clearfix"></div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div className="col-sm-12 mt-2">
                                                        <div className="row form-group">
                                                            <div className="col-sm-6 ps-0">
                                                                <div className="col-sm-12 ps-0">
                                                                    <label className='full-width form-label'>Comments</label>
                                                                    <textarea className='w-100'
                                                                        defaultValue={contactDetails.Comments}
                                                                        onChange={(e) => setContactDetails({ ...contactDetails, Comments: e.target.value })}
                                                                        rows={4}
                                                                        cols={50}
                                                                        placeholder="Enter text here..."
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-sm-6 pe-0">
                                                                {/* <div className="col-sm-12">
                                                                    <div className='input-group'>
                                                                        <label className='full-width form-label'>Activities</label>
                                                                        {contactDetails?.SmartActivities?.length > 0 ?
                                                                            contactDetails?.SmartActivities?.map((item: any) => {
                                                                                return (
                                                                                    <>
                                                                                        <div className="full-width replaceInput alignCenter">
                                                                                            <a>{item.Title}</a>
                                                                                            <span className='dark ms-1 hreflink svg__icon--cross svg__iconbox' onClick={() => removeSelectTaxanomy(item, 'Country')}>
                                                                                            </span>
                                                                                        </div>
                                                                                    </>
                                                                                )
                                                                            })
                                                                            : null}

                                                                        <span className="input-group-text" title="Smart Category Popup">
                                                                            <span onClick={() => openSmartTaxonomyActivity(contactDetails?.SmartActivities)} className="svg__iconbox svg__icon--editBox"></span>
                                                                        </span></div>
                                                                </div> */}
                                                                {/* <div className='col-sm-12 mt-2'>
                                                                    <div className="input-group">
                                                                        <label className='full-width form-label'>
                                                                            Categories
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            id="txtCategories"
                                                                            placeholder="Search Category Here"
                                                                            value={categorySearchKey}
                                                                            onChange={(e) => autoSuggestionsForCategory(e)}
                                                                        />
                                                                        <span className="input-group-text" title="Smart Category Popup">
                                                                            <span onClick={() => openSmartTaxonomyCategories(contactDetails?.SmartCategories)} className="svg__iconbox svg__icon--editBox"></span>
                                                                        </span>
                                                                        {SearchedCategoryData?.length > 0 ? (
                                                                            <div className="SmartTableOnTaskPopup w-100">
                                                                                <ul className="list-group">
                                                                                    {SearchedCategoryData.map((item: any) => {
                                                                                        return (
                                                                                            <li
                                                                                                className="hreflink list-group-item p-1 rounded-0 list-group-item-action"
                                                                                                key={item.id}
                                                                                                onClick={() =>
                                                                                                    setSelectedCategoryData(
                                                                                                        [item],
                                                                                                        "For-Auto-Search"
                                                                                                    )
                                                                                                }
                                                                                            >
                                                                                                <a>{item.Newlabel}</a>
                                                                                            </li>
                                                                                        );
                                                                                    })}
                                                                                </ul>
                                                                            </div>
                                                                        ) : null}
                                                                    </div>

                                                                    {SmartCategoriesData?.map(
                                                                        (type: any, index: number) => {
                                                                            return (
                                                                                <div className="block alignCenter">
                                                                                    <a style={{ color: "#fff !important" }} className="textDotted">
                                                                                        {type.Title}
                                                                                    </a>
                                                                                    <span onClick={() => removeCategoryItem(
                                                                                        type.Title,
                                                                                        type.Id)} className="bg-light hreflink ml-auto svg__icon--cross svg__iconbox"></span>
                                                                                </div>
                                                                            );
                                                                        }
                                                                    )}
                                                                </div> */}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                            {/* <tr>
                                                <td>
                                                    <div className="col-sm-12 mt-2">
                                                        <div className="row form-group">
                                                            <div className="col-sm-4 ps-0">
                                                                <div className='input-group'>
                                                                    <label htmlFor="OVMitgliedBeginn" className='full-width form-label'>OV Mitglied Beginn</label>
                                                                    <input type="text" id="OVMitgliedBeginn" className="form-control" defaultValue={contactDetails.OVMitgliedBeginn} onChange={(e) => setContactDetails({ ...contactDetails, OVMitgliedBeginn: e.target.value })} />
                                                                </div></div>
                                                            <div className="col-sm-4">
                                                                <div className='input-group'>
                                                                    <label htmlFor="AnsprechpartnerimOV" className='full-width form-label'>Ansprechpartner im OV</label>
                                                                    <input type="text" id="AnsprechpartnerimOV" className="form-control" defaultValue={contactDetails.AnsprechpartnerimOV} onChange={(e) => setContactDetails({ ...contactDetails, AnsprechpartnerimOV: e.target.value })} />
                                                                </div></div>
                                                            <div className="col-sm-4 pe-0">
                                                                <div className='input-group'>
                                                                    <label htmlFor="VerbindungzuOV" className='full-width form-label'>Verbindung zu OV</label>
                                                                    <input type="text" id="VerbindungzuOV" className="form-control" defaultValue={contactDetails.VerbindungzuOV} onChange={(e) => setContactDetails({ ...contactDetails, VerbindungzuOV: e.target.value })} />
                                                                </div></div>
                                                        </div>
                                                        <div className="row form-group mt-2">
                                                            <div className="col-sm-4 ps-0">
                                                                <div className='input-group'>
                                                                    <label htmlFor="Mitgliederverband" className='full-width form-label'>Mitgliederverband</label>
                                                                    <input type="text" id="Mitgliederverband" className="form-control" defaultValue={contactDetails.Mitgliederverband} onChange={(e) => setContactDetails({ ...contactDetails, Mitgliederverband: e.target.value })} />
                                                                </div></div>
                                                            <div className="col-sm-4">
                                                                <div className='input-group'>
                                                                    <label htmlFor="Listeseit" className='full-width form-label'>Liste seit</label>
                                                                    <input type="text" id="Listeseit" className="form-control" defaultValue={contactDetails.Listeseit} onChange={(e) => setContactDetails({ ...contactDetails, Listeseit: e.target.value })} />
                                                                </div></div>
                                                            <div className="col-sm-4 pe-0">
                                                                <div className='input-group'>
                                                                    <label htmlFor="ListeEnde" className='full-width form-label'>Liste Ende</label>
                                                                    <input type="text" id="ListeEnde" className="form-control" defaultValue={contactDetails.ListeEnde} onChange={(e) => setContactDetails({ ...contactDetails, ListeEnde: e.target.value })} />
                                                                </div></div>
                                                        </div>
                                                        <div className="clearfix"></div>
                                                    </div>
                                                </td>
                                            </tr> */}
                                        </table>
                                    </div>
                                    <div className={`tab-pane show  ${imagetab == true ? "active" : ""}`} id="IMAGEINFORMATION" role="tabpanel" aria-labelledby="IMAGEINFORMATION">
                                        <div className="row col-sm-12">

                                            {imagetab && (
                                                <ImagesC
                                                    EditdocumentsData={contactDetails}
                                                    setData={setContactDetails}
                                                    Context={props?.Context}
                                                    callBack={imageTabCallBack}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </>

            </Panel>
            {/* {status.taxanomypopup ? <Smarttaxonomypopup popupName="Activities" selectedCountry={currentCountry} callBack={CloseSmarttaxonomypopup} data={ActivityData} updateData={contactDetails} /> : null} */}
            {status.CountryPopup ? <Smartmetadatapickerin popupName="Contact Countries" AllListId={props?.allListId} usedfor={"Multi"} TaxType={"Countries"} selectedCountry={currentCountry} callBack={CloseSmarttaxonomypopup} updateData={contactDetails} /> : null}
        </>

    );
}
export default EditContactPopup;