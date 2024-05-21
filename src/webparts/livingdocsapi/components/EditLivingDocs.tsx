import * as React from "react";
import { useState, useCallback, useEffect } from 'react';
import { Web } from 'sp-pnp-js';
import moment from 'moment';
import { Panel, PanelType } from 'office-ui-fabric-react';
let backuplivingDocsData: any = []
const Editlivingdocspop = (props: any) => {
    const [state, rerender] = React.useReducer(() => ({}), {});
    const webs = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/LivingDocs');
    const [livingDocsData, setlivingDocsData]: any = useState({});
    const [allContactData, setallContactData] = useState([]);
    const [listIsVisible, setListIsVisible] = useState(false);
    const [searchedNameData, setSearchedDataName] = useState([])
    const [SelecteditlivingDocs, setSelecteditlivingDocs] = useState(true)
    const [searchKey, setSearchKey] = useState({
        Title: '',
        FirstName: '',
    });
    useEffect(() => {
        getlivingDocsdata()
        getAllContact()
    }, [])
    let itemId = props?.props?.Id

    const searchedName = async (e: any) => {
        setListIsVisible(true);
        let res: any = {}
        let Key: any = e.target.value;
        res.FullName = Key;
        let subString = Key.split(" ");
        setSearchKey({ ...searchKey, Title: subString[0] + " " + subString[1] })
        setSearchKey({ ...searchKey, FirstName: subString })
        const data: any = {
            nodes: allContactData.filter((items: any) =>
                items.FullName?.toLowerCase().includes(Key.toLowerCase())
            ),
        };
        setSearchedDataName(data.nodes);
        setlivingDocsData({ ...livingDocsData, Responsible: res })
        if (Key.length == 0) {
            setSearchedDataName(allContactData);
            setListIsVisible(false);
        }
    }
    const getlivingDocsdata = async () => {
        let data;
        const select = "Id,Title,Description,Responsible/Id,Responsible/Title,Responsible/FullName,Item_x0020_Cover,Created,Modified,Author/Name,Author/Title,Editor/Name,Editor/Title";
        const query = `Id eq ${itemId}`;
        try {
            data = await webs.lists.getById("59D8FE3B-3910-4586-8762-A9EBAB68B8AA").items.select(select).expand('Author', 'Editor', 'Responsible').filter(query).get();
            // Create a deep copy of processedData for backupprofilePagedata
            data.forEach((i: any) => {
                if (i?.Created != null && i?.Created != undefined) {
                    i.Created = moment(i?.Created, "DD-MM-YYYY").format("DD/MM/YYYY");
                }
                if (i?.Modified != null && i?.Modified != undefined) {
                    i.Modified = moment(i?.Modified, "DD-MM-YYYY").format("DD/MM/YYYY");
                }
            })

            const processedData = data.map((item: any) => ({ ...item, Description: item.Description.replace(/<[^>]+>/g, '') }));

            backuplivingDocsData = JSON.parse(JSON.stringify(processedData));
            // Update setprofilePagedata with the original processedData
            setlivingDocsData(processedData[0]);
        } catch (error) {
            console.error(error);
            return; // Handle errors gracefully (optional)
        }
    };
    const getAllContact = async () => {
        try {
            let data = await webs.lists.getById("45d6a95e-22ad-45d4-b1eb-b0abea83575d").items.select("WorkCity,Id,SmartActivitiesId,SmartCategories/Id,SmartCategories/Title,WorkCountry,ItemType,Email,FullName,ItemCover,Attachments,Categories,Company,JobTitle,FirstName,Title,Suffix,WebPage,IM,WorkPhone,CellPhone,HomePhone,WorkZip,Office,Comments,Created,Modified,Author/Name,Author/Title,Editor/Name,Editor/Title").expand("Author,Editor,SmartCategories").orderBy("Created desc").getAll();
            data.map((item: any) => {
                item.Selected = false
                item.LastName = item.Title
                item.Title = item.FirstName + ' ' + item.LastName
            })
            setallContactData(data)
        } catch (error: any) {
            console.error(error);
        };
    };
    const UpdatelivingDocs = async function (Item: any) {
        let flag = false
        try {
            let postData = {
                Title: livingDocsData?.Title,
                Description: livingDocsData?.Description,
                ResponsibleId: livingDocsData?.Responsible.Id,
                Item_x0020_Cover: {
                    "__metadata": { type: "SP.FieldUrlValue" },
                    Description: Item?.Item_x0020_Cover != undefined ? Item?.Item_x0020_Cover?.Url : (Item?.Item_x0020_Cover != undefined ? Item?.Item_x0020_Cover?.Url : ""),
                    Url: Item?.Item_x0020_Cover != undefined ? Item?.Item_x0020_Cover?.Url : (Item?.Item_x0020_Cover != undefined ? Item?.Item_x0020_Cover?.Url : "")
                },
            };
            let updatedData = await webs.lists.getById("59D8FE3B-3910-4586-8762-A9EBAB68B8AA").items.getById(Item.Id).update(postData)
            setSelecteditlivingDocs(false)
            props.EditCallBackItem()
        } catch (error) {
            console.error('Error updating contact details:', error);
        }
    };
    const closelivingDocsPopup = () => {
        setSelecteditlivingDocs(false)
        props.closeEditLivingDocs()
    }
    const SetResponsibledata = (item: any) => {
        setlivingDocsData({ ...livingDocsData, Responsible: item })
        setListIsVisible(false);
        rerender()
    }

    const onRenderCustomHeadersmartinfo = () => {
        return (
            <>
                <div className="subheading">
                    Edit LivingDocs Popup
                </div>
                {/* <Tooltip ComponentId='696' /> */}
            </>
        );
    };
    const onRenderCustomFootersmartinfo = () => {
        return (
            <footer className='bg-f4 fixed-bottom'>
                <div className="align-items-center d-flex justify-content-between px-4 py-2">
                    <div>
                        <div>Created <span>{livingDocsData?.Created}</span> by
                            <span className="primary-color"> {livingDocsData?.Author?.Title}</span>
                        </div>
                        <div>Last modified <span> {livingDocsData?.Modified}</span> by
                            <span className="primary-color"> {livingDocsData?.Editor?.Title}</span>
                        </div>
                        <div></div>
                    </div>
                    <div>
                        <a href={`https://hhhhteams.sharepoint.com/sites/HHHH/livingdocs/Lists/LivingDocs/EditForm.aspx?ID=${livingDocsData.Id}`} target="_blank" data-interception="off">Open out-of-the-box form</a>
                        <button className="btn btn-primary ms-1 mx-2" onClick={() => UpdatelivingDocs(livingDocsData)}>Save</button>
                        <button onClick={() => closelivingDocsPopup()} className="btn btn-default">Cancel</button>
                    </div>
                </div>
            </footer>
        )
    }

    return (
        <>
            <Panel
                onRenderHeader={onRenderCustomHeadersmartinfo}
                isOpen={SelecteditlivingDocs}
                type={PanelType.custom}
                customWidth="1200px"
                isBlocking={false}
                isFooterAtBottom={true}
                onRenderFooter={onRenderCustomFootersmartinfo}
                onDismiss={() => closelivingDocsPopup()}
            >
                <div className="modal-body">

                    <div className="col-sm-12">
                        <div className="row form-group">
                            <div className="col-sm-6 mb-3">
                                <div className='input-group'>
                                    <label htmlFor="Title" className='full-width form-label boldClable '>Title</label>
                                    <input type="text" id="Title" className="form-control" defaultValue={livingDocsData.Title} onChange={(e) => setlivingDocsData({ ...livingDocsData, Title: e.target.value })} />
                                </div></div>
                            <div className="col-sm-6 mb-3">
                                <div className='input-group'>
                                    <label htmlFor="Responsible" className='full-width form-label boldClable '>Responsible</label>
                                    <input type='text' placeholder="Enter Contacts Name" value={livingDocsData?.Responsible?.FullName || ''} onChange={(e) => searchedName(e)} className="form-control" />
                                    {listIsVisible ? <div className="col-12 mt-1 rounded-0">
                                        <ul className="list-group">
                                            {searchedNameData?.map((item: any) => {
                                                return (
                                                    <li className="list-group-item" onClick={() => SetResponsibledata(item)}><a>{item.FullName}</a></li>
                                                )
                                            })}
                                        </ul>
                                    </div>
                                        : null}
                                </div></div>
                            <div className="col-sm-12 mb-3">
                                <div className='input-group'>
                                    <label htmlFor="Title" className='full-width form-label boldClable '>Image Url</label>
                                    <input
                                        type="text"
                                        id="Title"
                                        className="form-control"
                                        defaultValue={livingDocsData?.Item_x0020_Cover?.Url}
                                        onInput={(e) => {
                                            const target = e.target as HTMLInputElement;
                                            setlivingDocsData({
                                                ...livingDocsData,
                                                Item_x0020_Cover: {
                                                    ...livingDocsData.Item_x0020_Cover,
                                                    Url: target.value !== "" ? target.value : "" // Check if value is empty, assign blank if true
                                                }
                                            });
                                        }}
                                    />
                                </div></div>
                            <div className="col-sm-12">
                                <label className='full-width form-label boldClable '>Page Teaser</label>
                                <textarea className='w-100'
                                    defaultValue={livingDocsData.Description}
                                    onChange={(e) => setlivingDocsData({ ...livingDocsData, Description: e.target.value })}
                                    rows={15}
                                    cols={50}
                                    placeholder="Enter text here..."
                                />
                            </div>
                        </div>
                    </div>

                </div>

            </Panel>
        </>
    )
}
export default Editlivingdocspop;