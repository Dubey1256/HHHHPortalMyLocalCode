import { Panel, PrimaryButton } from 'office-ui-fabric-react';
import * as React from 'react';
import { useState } from 'react';
import { Web } from 'sp-pnp-js';
import SmartMetadataEditPopup from './SmartMetadataEditPopup';

export default function CreateMetadataItem(props: any) {
    let SelectedItem: any = props.SelectedItem;
    let Taxtype: any = props.TabSelected
    let SmartMetadataListID = props.AllList.SPSmartMetadataListID;
    let addItemCallBack: any = props.addItemCallBack
    const [addedMetadataItem, setAddedMetadataItem]: any = useState({});
    const [SmartMetadataEditPopupOpen, setSmartMetadataEditPopupOpen] = useState(false);
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
                        "Description1": smartDescription,
                        "Title": smartMetaDataTitle,
                        "ParentId": SelectedItem[0].Id,
                        "ParentID": SelectedItem[0].Id,
                    });
                    setAddedMetadataItem(addedItem?.data);
                } catch (error) {
                    console.error(error);
                } finally {
                    closeCreateSmartMetadataPopup();
                    addItemCallBack(array, false, SelectedItem[0]?.TaxType);
                }
            } else {
                try {
                    const web = new Web(props?.AllList?.SPSitesListUrl);
                    const addedItem = await web.lists.getById(SmartMetadataListID).items.add({
                        "TaxType": Taxtype,
                        "Description1": smartDescription,
                        "Title": smartMetaDataTitle,
                        "ParentID": 0
                    });
                    setAddedMetadataItem(addedItem?.data);
                } catch (error) {
                    console.error(error);
                } finally {
                    closeCreateSmartMetadataPopup();
                    addItemCallBack(array, false, SelectedItem[0]?.TaxType);
                }
            }
            closeCreateSmartMetadataPopup();
            setSmartMetadataEditPopupOpen(true);
        } else {
            if (SelectedItem.length > 0) {
                try {
                    const web = new Web(props?.AllList?.SPSitesListUrl);
                    await web.lists.getById(SmartMetadataListID).items.add({
                        "TaxType": SelectedItem[0].TaxType,
                        "Description1": smartDescription,
                        "Title": smartMetaDataTitle,
                        "ParentId": SelectedItem[0].Id,
                        "ParentID": SelectedItem[0].Id,
                    });

                } catch (error) {
                    console.error(error);
                } finally {
                    closeCreateSmartMetadataPopup();
                    addItemCallBack(array, false, SelectedItem[0]?.TaxType);
                }
            } else {
                try {
                    const web = new Web(props?.AllList?.SPSitesListUrl);
                    await web.lists.getById(SmartMetadataListID).items.add({
                        "TaxType": Taxtype,
                        "Description1": smartDescription,
                        "Title": smartMetaDataTitle,
                        "ParentID": 0
                    });
                } catch (error) {
                    console.error(error);
                } finally {
                    closeCreateSmartMetadataPopup();
                    addItemCallBack(array, false, SelectedItem[0]?.TaxType);
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
            addItemCallBack(array, false, SelectedItem[0]?.TaxType);
            console.error(error);
        } finally {
            closeCreateSmartMetadataPopup();
            addItemCallBack(array, false, SelectedItem[0]?.TaxType);
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
        setIsCreatePopupOpen(false);
    }
    return (
        <>
            <div>
                <button type="button" title="Add" onClick={OpenCreateSmartMetadataPopup} className="btnCol btn btn-primary">+ Add</button>
            </div>
            {
                IsCreatePopupOpen === true ? <section>
                    <Panel headerText="Create SmartMetaData" isOpen={IsCreatePopupOpen} onDismiss={closeCreateSmartMetadataPopup} isBlocking={false} closeButtonAriaLabel="Close">
                        {props.ParentItem.Id == undefined && (
                            <div className="col-sm-12 padL-0">
                                <div className="row">
                                    <div className="row">
                                        <label className="full_width">Title</label>
                                        <input className="form-control full_width" type="text" value={smartMetaDataTitle} onChange={(e) => setSmartMetaDataTitle(e.target.value)} placeholder="Enter Component Title..." required />
                                        <span className="searchclear" style={{ top: '47px' }} onClick={clearControl}>
                                            X
                                        </span>
                                    </div>
                                    <div className="col-sm-1"></div>
                                </div>
                                {showDes && (
                                    <div className="row">
                                        <label className="full_width">Description</label>
                                        <div className="row">
                                            <textarea
                                                value={smartDescription}
                                                onChange={(e) => setSmartDescription(e.target.value)}
                                            ></textarea>
                                        </div>
                                        <div className="row">
                                            <a style={{ cursor: 'pointer' }} title="Delete" data-toggle="modal" onClick={removeFeedbackColumn}>
                                                <img className="" src="/_layouts/images/delete.gif" alt="Delete" />
                                            </a>
                                        </div>
                                        <div className="clearfix"></div>
                                    </div>
                                )}
                            </div>)}
                        {props.ParentItem.Id !== undefined && (
                            <div className="modal-body">
                                <div className="col-sm-12 tab-content bdrbox">
                                    <div className="row">
                                        {childItemTitle.map((item: { Title: string | number | readonly string[]; Child: any[]; Id: any; }, index: React.Key) => (
                                            <div className="row" key={index}>
                                                <label className="row">Title</label>
                                                <div className="row">
                                                    <input
                                                        className="form-control full_width mb-10"
                                                        type="text"
                                                        value={item.Title}
                                                        onChange={(e) => handleTitleChange(index, e.target.value)}
                                                        placeholder="Enter Child Item Title"
                                                        required
                                                    />
                                                    <div className="row">
                                                        {isOwner && childItemTitle.length > 1 && index !== 0 && (
                                                            <a
                                                                style={{ cursor: 'pointer' }}
                                                                title="Delete"
                                                                data-toggle="modal"
                                                                onClick={() => removeFeedbackColumnn(childItemTitle, index, '')}
                                                            >
                                                                <img className="" src="/_layouts/images/delete.gif" alt="Delete" />
                                                            </a>
                                                        )}
                                                    </div>
                                                    <div className="clearfix"></div>
                                                </div>
                                                <div className="row">
                                                    <div className="row" key={index}>
                                                        {item.Child.map((items: { Description: string | number | readonly string[]; }, childIndex: React.Key) => (
                                                            <div className="row" key={childIndex}>
                                                                <label className="row" style={{ paddingRight: '1px', paddingLeft: '26px' }}>
                                                                    Description
                                                                </label>
                                                                <div className="row">
                                                                    <textarea
                                                                        rows={4}
                                                                        value={items.Description}
                                                                        onChange={(e) => handleDescriptionChange(index, childIndex, e.target.value)}
                                                                    ></textarea>
                                                                </div>
                                                                <div className="row">
                                                                    {isOwner && (
                                                                        <a
                                                                            style={{ cursor: 'pointer' }}
                                                                            title="Delete"
                                                                            data-toggle="modal"
                                                                            onClick={() => removeFeedbackColumnn(childItemTitle, item.Id, 'Description')}
                                                                        >
                                                                            <img className="" src="/_layouts/images/delete.gif" alt="Delete" />
                                                                        </a>
                                                                    )}
                                                                </div>
                                                                <div className="clearfix"></div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <div className="clearfix"></div>
                                    </div>
                                </div>
                            </div>)}
                        {props.ParentItem.Id == undefined && (
                            <div>
                                <PrimaryButton onClick={() => AddSmartMetadataItem('createAndOpenPopup')} text="Create & Open Popup" />
                                <PrimaryButton onClick={() => AddSmartMetadataItem('CreatePopup')} text="Create" />
                            </div>
                        )}
                        {props.ParentItem.Id != undefined && (
                            <div>
                                <a className="hreflink pull-left" onClick={addNewTextField}>
                                    <img className="icon-sites-img" src="/_layouts/images/delete.gif" alt="Add New" />
                                    + Add more child items
                                </a>
                                {childItemTitle.length > 0 && (
                                    <>
                                        {childItemTitle.length == 1 && (<PrimaryButton onClick={() => createChildItems('CreatePopup')} disabled={childItemTitle[0].Title === ''}>
                                            Create & Open Popup
                                        </PrimaryButton>
                                        )}
                                        <PrimaryButton onClick={() => createChildItems('Create')} disabled={childItemTitle[0].Title === ''}>
                                            Create
                                        </PrimaryButton>
                                    </>
                                )}
                            </div>)}
                    </Panel>
                </section> : ''
            }
            {SmartMetadataEditPopupOpen ? <SmartMetadataEditPopup AllList={props.AllList} smartMetaDataTitle={smartMetaDataTitle} smartDescription={smartDescription} CloseEditSmartMetaPopup={() => setSmartMetadataEditPopupOpen(false)} EditItemCallBack={props.addItemCallBack} AllMetadata={props.ParentItem} modalInstance={addedMetadataItem} /> : ''}
        </>
    )
}
