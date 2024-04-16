import { Panel, PanelType } from 'office-ui-fabric-react';
import * as React from 'react';
import { useState } from 'react';
import { Web } from 'sp-pnp-js';
import SmartMetadataEditPopup from './SmartMetadataEditPopup';
import Tooltip from '../../../globalComponents/Tooltip';
export default function CreateMetadataItem(props: any) {
    let SelectedItem: any = props.SelectedItem;
    let Taxtype: any = props.TabSelected;
    let SmartMetadataListID = props.AllList.SmartMetadataListID;
    let addItemCallBack: any = props.addItemCallBack
    const [addedMetadataItem, setAddedMetadataItem]: any = useState({});
    const [EditMetadataPopup, setEditMetadataPopup] = useState(false);
    const [smartMetaDataTitle, setSmartMetaDataTitle]: any = useState('');
    const [smartDescription, setSmartDescription] = useState('');
    const [countFor, setCountFor] = useState(0);
    const [childItemTitle, setChildItemTitle]: any = useState([{ Title: '', Child: [{ Description: '' }], Id: 0 },]);
    const [IsCreatePopupOpen, setIsCreatePopupOpen] = useState(false);
    const [showDes, setShowDes] = useState(true);
    const isOwner = true;
    const clearControl = () => {
        setChildItemTitle(undefined);
    };
    const removeFeedbackColumn = () => {
        if (showDes) {
            setShowDes(false);
        }
    }
    const addNewTextField = () => {
        const newCountFor = countFor + 1;
        const newChildItem = { Title: '', Child: [{ Description: '' }], Id: newCountFor };
        setCountFor(newCountFor);
        setChildItemTitle([...childItemTitle, newChildItem]);
    };
    const AddSmartMetadataItem = async (buttonType: any) => {
        let array: any = [...props.ParentItem]
        if (buttonType === 'createAndOpenPopup') {
            if (SelectedItem.length > 0) {
                try {
                    const web = new Web(props?.AllList?.SPSitesListUrl);
                    const addedItem = await web.lists.getById(SmartMetadataListID).items.add({
                        "TaxType": SelectedItem[0].TaxType,
                        "Description": smartDescription,
                        "Title": smartMetaDataTitle,
                        "ParentId": SelectedItem[0].Id,
                        "ParentID": SelectedItem[0].Id,
                    });
                    setAddedMetadataItem(addedItem?.data);
                    setIsCreatePopupOpen(false);
                    setEditMetadataPopup(true);
                } catch (error) {
                    console.error(error);
                } 
            } else {
                if (props?.categoriesTabName?.Id !== undefined && props?.categoriesTabName?.Id !== '') {
                    try {
                        const web = new Web(props?.AllList?.SPSitesListUrl);
                        const addedItem = await web.lists.getById(SmartMetadataListID).items.add({
                            "TaxType": Taxtype,
                            "Description": smartDescription,
                            "Title": smartMetaDataTitle,
                            "ParentId": props?.categoriesTabName?.Id,
                            "ParentID": props?.categoriesTabName?.Id
                        });
                        setAddedMetadataItem(addedItem?.data);
                        setIsCreatePopupOpen(false);
                        setEditMetadataPopup(true);
                    } catch (error) {
                        console.error(error);
                    }
                } else {
                    try {
                        const web = new Web(props?.AllList?.SPSitesListUrl);
                        const addedItem = await web.lists.getById(SmartMetadataListID).items.add({
                            "TaxType": Taxtype,
                            "Description": smartDescription,
                            "Title": smartMetaDataTitle,
                            "ParentID": 0
                        });
                        setAddedMetadataItem(addedItem?.data);
                        setIsCreatePopupOpen(false);
                        setEditMetadataPopup(true);
                    } catch (error) {
                        console.error(error);
                    }
                }
            }
        } else {
            if (SelectedItem.length > 0) {
                try {
                    const web = new Web(props?.AllList?.SPSitesListUrl);
                    const addedItem = await web.lists.getById(SmartMetadataListID).items.add({
                        "TaxType": SelectedItem[0].TaxType,
                        "Description": smartDescription,
                        "Title": smartMetaDataTitle,
                        "ParentId": SelectedItem[0].Id,
                        "ParentID": SelectedItem[0].Id,
                    });
                    setAddedMetadataItem(addedItem?.data);
                    closeCreateSmartMetadataPopup();
                    addItemCallBack(array, false, SelectedItem[0]?.TaxType, undefined, '');
                } catch (error) {
                    console.error(error);
                }
            } else {
                if (props.categoriesTabName !== undefined && props?.categoriesTabName !== '') {
                    try {
                        const web = new Web(props?.AllList?.SPSitesListUrl);
                        const addedItem = await web.lists.getById(SmartMetadataListID).items.add({
                            "TaxType": Taxtype,
                            "Description": smartDescription,
                            "Title": smartMetaDataTitle,
                            "ParentId": props?.categoriesTabName?.Id,
                            "ParentID": props?.categoriesTabName?.Id
                        });
                        setAddedMetadataItem(addedItem?.data);
                        closeCreateSmartMetadataPopup();
                        addItemCallBack(array, false, props?.categoriesTabName?.TaxType, '');
                    } catch (error) {
                        console.error(error);
                    } finally {

                    }
                } else {
                    try {
                        const web = new Web(props?.AllList?.SPSitesListUrl);
                        const addedItem = await web.lists.getById(SmartMetadataListID).items.add({
                            "TaxType": Taxtype,
                            "Description": smartDescription,
                            "Title": smartMetaDataTitle,
                            "ParentID": 0
                        });
                        setAddedMetadataItem(addedItem?.data);
                        closeCreateSmartMetadataPopup();
                        addItemCallBack(array, false, props?.TabSelected, '');
                    } catch (error) {
                        console.error(error);
                    }
                }
            }
        }
    };
    const createChildItems = async (Type: any) => {
        let array: any = [...props.ParentItem]
        try {
            for (const item of childItemTitle) {
                const web = new Web(props?.AllList?.SPSitesListUrl);
                await web.lists.getById(SmartMetadataListID).items.add({
                    TaxType: props.ParentItem.TaxType,
                    ParentId: props.ParentItem.Id,
                    Title: item.Title,
                    ParentID: props.ParentItem.Id,
                });
                closeCreateSmartMetadataPopup();
                $('input[name=ProfileTypes]').prop('checked', false);
            }
        } catch (error) {
            closeCreateSmartMetadataPopup();
            addItemCallBack(array, false, SelectedItem[0]?.TaxType, '');
            console.error(error);
        } finally {
            closeCreateSmartMetadataPopup();
            addItemCallBack(array, false, SelectedItem[0]?.TaxType, '');
        }
    }
    const handleTitleChange = (index: any, updatedTitle: string) => {
        childItemTitle((prevState: any) =>
            prevState.map((item: any, idx: any) => (idx === index ? { ...item, Title: updatedTitle } : item))
        );
    };

    const handleDescriptionChange = (parentIndex: any, childIndex: any, updatedDescription: string) => {
        childItemTitle((prevState: any) =>
            prevState.map((item: any, idx: any) =>
                idx === parentIndex
                    ? {
                        ...item,
                        Child: item.Child.map((child: any, childIdx: any) =>
                            childIdx === childIndex ? { ...child, Description: updatedDescription } : child
                        ),
                    }
                    : item
            )
        );
    };
    const removeFeedbackColumnn = (items: any[], index: any, type: string) => {
        if (type === 'Description') {
            const updatedchildItemTitle = [...childItemTitle];
            updatedchildItemTitle.forEach((item, index1) => {
                if (item.Id === index) {
                    item.Child.splice(0, 1);
                }
            });
            setChildItemTitle(updatedchildItemTitle);
        } else {
            items.splice(index, 1);
            setChildItemTitle([...items]);
        }
    };
    const OpenCreateSmartMetadataPopup = () => {
        setIsCreatePopupOpen(true);
        setShowDes(true);
        setChildItemTitle([{ Title: '', Child: [{ Description: '' }], Id: 0 },])
    };
    const closeCreateSmartMetadataPopup = () => {
        setSmartDescription('');
        setSmartMetaDataTitle('');
        setIsCreatePopupOpen(false);
        props?.closeCreateSmartMetadataPopup();
        props?.childRefdata?.current?.setRowSelection({});
    }
    const onRenderCreateSmartMetadata = () => {
        return (
            <>
                <div className='subheading siteColor'>
                    Create SmartMetadata
                </div>
                <Tooltip ComponentId={'1630'} />
            </>
        );
    };
    React.useEffect(() => {
        OpenCreateSmartMetadataPopup();
    }, [props?.AddButton])
    return (
        <>
            {/* <div>
                <button type="button" title="Add" onClick={OpenCreateSmartMetadataPopup} className="btnCol btn btn-primary">Add +</button>
            </div> */}
            {
                IsCreatePopupOpen === true ? <section>
                    <Panel type={PanelType.custom} onRenderHeader={onRenderCreateSmartMetadata} customWidth="500px" isOpen={IsCreatePopupOpen} onDismiss={closeCreateSmartMetadataPopup} isBlocking={false} closeButtonAriaLabel="Close">
                        {props.ParentItem.Id == undefined && (
                            <div className="modal-body">
                                <div className="col-sm-12 padL-0">
                                    <div className="input-group my-2">
                                        <label className="full_width form-label">Title</label>
                                        <input className="form-control w-100" type="text" value={smartMetaDataTitle} onChange={(e) => setSmartMetaDataTitle(e.target.value)} placeholder="Enter Title..." required />
                                        <span className="searchclear" style={{ top: '17px', right: '10px' }} onClick={clearControl}>
                                            x
                                        </span>
                                    </div>
                                    {showDes && (
                                        <div className="d-flex mb-3">
                                            <div className="input-group">
                                                <label className="full_width form-label">Description</label>
                                                <textarea className='w-100'
                                                    value={smartDescription}
                                                    onChange={(e) => setSmartDescription(e.target.value)}
                                                ></textarea>
                                            </div>
                                            <div className='mt-4'>
                                                <a style={{ cursor: 'pointer' }} title="Delete" data-toggle="modal" onClick={removeFeedbackColumn}>
                                                    {/* <img className="" src="/_layouts/images/delete.gif" alt="Delete" /> */}
                                                    <span className='svg__iconbox svg__icon--trash dark hreflink'></span>
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </div></div>)}
                        {props.ParentItem.Id !== undefined && (
                            <div className="modal-body">
                                <div className="col-sm-12">
                                    {childItemTitle.map((item: { Title: string | number | readonly string[]; Child: any[]; Id: any; }, index: React.Key) => (
                                        <div key={index}>
                                            <div className='input-group my-2'>
                                                <label className="form-label full-width">Title</label>
                                                <input className="form-control w-100"
                                                    type="text"
                                                    value={item.Title}
                                                    onChange={(e) => handleTitleChange(index, e.target.value)}
                                                    placeholder="Enter Child Item Title"
                                                    required
                                                />
                                                {isOwner && childItemTitle.length > 1 && index !== 0 && (
                                                    <a className='countSec'
                                                        style={{ cursor: 'pointer' }}
                                                        title="Delete"
                                                        data-toggle="modal"
                                                        onClick={() => removeFeedbackColumnn(childItemTitle, index, '')}
                                                    >
                                                        {/* <img className="" src="/_layouts/images/delete.gif" alt="Delete" /> */}
                                                        <span className='svg__iconbox svg__icon--cross dark hreflink'></span>
                                                    </a>
                                                )}
                                            </div>
                                            <div key={index}>
                                                {item.Child.map((items: { Description: string | number | readonly string[]; }, childIndex: React.Key) => (
                                                    <div className="d-flex mb-3" key={childIndex}>
                                                        <div className="input-group">
                                                            <label className="full_width form-label">
                                                                Description
                                                            </label>
                                                            <textarea className='w-100'
                                                                rows={4}
                                                                value={items.Description}
                                                                onChange={(e) => handleDescriptionChange(index, childIndex, e.target.value)}
                                                            ></textarea>
                                                        </div>
                                                        <div className='mt-4'>
                                                            {isOwner && (
                                                                <a title="Delete"
                                                                    data-toggle="modal"
                                                                    onClick={() => removeFeedbackColumnn(childItemTitle, item.Id, 'Description')}
                                                                >
                                                                    {/* <img className="" src="/_layouts/images/delete.gif" alt="Delete" /> */}
                                                                    <span className='svg__iconbox svg__icon--trash dark hreflink'></span>
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                    <div className="clearfix"></div>
                                </div>
                            </div>)}
                        <footer className='pull-right'>
                            {props.ParentItem.Id == undefined && (
                                <div>
                                    <button onClick={() => AddSmartMetadataItem('createAndOpenPopup')} className='btnCol btn btn-primary mx-1'>Create & Open Popup</button>
                                    <button onClick={() => AddSmartMetadataItem('CreatePopup')} className='btnCol btn btn-primary'>Create</button>
                                </div>
                            )}
                            {props.ParentItem.Id != undefined && (
                                <div>
                                    <a className="hreflink pull-left" onClick={addNewTextField}>
                                        {/* <img className="icon-sites-img" src="/_layouts/images/delete.gif" alt="Add New" /> */}
                                        + Add more child items
                                    </a>
                                    {childItemTitle.length > 0 && (
                                        <>
                                            {childItemTitle.length == 1 && (
                                                <button onClick={() => createChildItems('CreatePopup')} className='btn btn-primary mx-1' disabled={childItemTitle[0].Title === ''}>
                                                    Create & Open Popup
                                                </button>
                                            )}
                                            <button onClick={() => createChildItems('Create')} className='btn btn-primary' disabled={childItemTitle[0].Title === ''}>
                                                Create
                                            </button>
                                        </>
                                    )}
                                </div>)}
                        </footer>
                    </Panel>
                </section> : ''
            }
            {EditMetadataPopup === true ? <SmartMetadataEditPopup AllList={props.AllList} smartMetaDataTitle={smartMetaDataTitle} smartDescription={smartDescription} CloseEditSmartMetaPopup={() => setEditMetadataPopup(false)} EditItemCallBack={props.addItemCallBack} AllMetadata={props.ParentItem} modalInstance={addedMetadataItem} /> : ''}
        </>
    )
}