import * as React from 'react'
import { Web } from "sp-pnp-js";
import "bootstrap/dist/css/bootstrap.min.css";
import { arraysEqual, Modal, Panel, PanelType } from 'office-ui-fabric-react';

const TopNavigation = (dynamicData: any) => {
    const [root, setRoot] = React.useState([])
    const [EditPopup, setEditPopup] = React.useState(false);
    const [AddPopup, setAddPopup] = React.useState(false);
    const [changeroot, setChangeroot] = React.useState(false);
    const [postData, setPostData] = React.useState({ Title: '', Url: '', Description: '', TaskTime: '',Id:'' ,ParentId:''})
    const [popupData, setPopupData] = React.useState([]);
    const [value, setValue] = React.useState("")
    const [child, setChild] = React.useState("")
    const [subchild, setSubChild] = React.useState("")
    const [isVisible, setisVisible] = React.useState(false);
    const[owner,setOwner] = React.useState(false)


    React.useEffect(() => {
        loadTopNavigation();
    }, [])
    const handleChange = (type: any, event: any) => {
        if (type == 'Parent') {
            setValue(event.target.value);
        }
        if (type == 'child') {
            setChild(event.target.value);
        }
        if (type == 'subchild') {
            setSubChild(event.target.value);
        }


    };
    const loadTopNavigation = async () => {
        var TaskTypeItems: any = []
        var Nodes: any = []
        let web = new Web(dynamicData.dynamicData.siteUrl);
        TaskTypeItems = await web.lists
            .getById('7ee58156-c976-46b6-9b08-b700bf8e724b')
            .items
            .select('ID', 'Id', 'Title', 'href', 'ParentID', 'Order0', 'SortOrder', 'ownersonly', 'IsVisible', 'Modified', 'Created')
            .top(4999)
            .get()
        console.log(TaskTypeItems)
        TaskTypeItems?.forEach((item: any) => {
            if (item.ParentID == 0) {
                item.Id = item.ID;
                getChilds(item, TaskTypeItems);
                Nodes.push(item);
            }
        })
        console.log(Nodes)
        setRoot(Nodes)
    }
    const getChilds = (item: any, items: any) => {
        item.childs = [];
        items?.forEach((childItem: any) => {
            if (childItem.ParentID != undefined && parseInt(childItem.ParentID) == item.ID) {
                item.childs.push(childItem);
                getChilds(childItem, items);
            }
        })
    }
    const editPopup = (item: any) => {
        var Data: any = []
        Data.push(item)
        setPopupData(Data)
        setEditPopup(true)
    }
    const ClosePopup = () => {
        setEditPopup(false)
        setPostData(undefined)
    }
    const AddNewItem = (item: any) => {
        var Data: any = []
        Data.push(item)
        setPopupData(Data)
        setAddPopup(true)
    }
    const CloseAddPopup = () => {
        setAddPopup(false)
        setPostData(undefined)
    }
    const ChangeParentItem=()=>{
     if(value != undefined && value != ''){
        root?.forEach((item:any)=>{
            if(item.Title == value){
                postData.Title = value;
                postData.Id =item.Id;
                postData.ParentId=item.ParentId;
            }
        })
        setChangeroot(false)
     }
    }
    const onRenderCustomHeaderMain = () => {
        return (
            <div className="d-flex full-width pb-1" >
                <div style={{ marginRight: "auto", fontSize: "20px", fontWeight: "600", marginLeft: '20px' }}>
                    <span>
                        {`Update TopNavigation`}
                    </span>
                </div>
            </div>
        );
    };
    const UpdateData = async (item: any) => {
        let web = new Web(dynamicData.dynamicData.siteUrl);
        await web.lists.getById("7ee58156-c976-46b6-9b08-b700bf8e724b").items.getById(item.Id).update({
            Title: postData?.Title != undefined && postData?.Title != '' ? postData?.Title : item?.Title,
            ParentID: postData?.ParentId != undefined && postData?.ParentId != ''?postData?.ParentId:item?.ParentID,
            href: {
                "__metadata": { type: "SP.FieldUrlValue" },
                Description: postData.Url != undefined && postData.Url != '' ? postData.Url : item?.href.Url,
                Url: postData.Url != undefined && postData.Url != '' ? postData.Url : item?.href.Url,
            },
            IsVisible: isVisible,
            ownersonly:owner
        }).then(i => {
            console.log(i);
            ClosePopup();
            loadTopNavigation();
        })



    }
    const deleteDataFunction = async (item: any) => {
        let web = new Web(dynamicData.dynamicData.siteUrl);
        await web.lists.getById('7ee58156-c976-46b6-9b08-b700bf8e724b').items.getById(item.Id).delete()
            .then(i => {
                console.log(i);
                loadTopNavigation();
            });

    }

    const Additem = async () => {
        let web = new Web(dynamicData.dynamicData.siteUrl);
        await web.lists.getById('7ee58156-c976-46b6-9b08-b700bf8e724b').items.add({
            Title: postData.Title,
            ParentID: postData.Id != undefined && postData.Id != ''?postData.Id:popupData[0]?.ID,
            href: {
                "__metadata": { type: "SP.FieldUrlValue" },
                Description: postData.Url != undefined && postData.Url != '' ? postData.Url : popupData[0]?.href.Url,
                Url: postData.Url != undefined && postData.Url != '' ? postData.Url : popupData[0]?.href.Url,
            },
            IsVisible: isVisible,
            ownersonly:owner
        }).then((res: any) => {
            console.log(res);
            CloseAddPopup();
            loadTopNavigation();
        })
    }
    const changeParent = () => {
        setChangeroot(true)
    }
    const ClosechangePopup = () => {
        setChangeroot(false)
    }
    return (
        <>
            <h2>Top Navigation</h2>
            <div className='container' id='TopNavRound'>
                <ul className="top-navigate">
                    {root.map((item) => {
                        return (
                            <>
                                <li className='parent '>
                                    <span> <a href="">{item.Title}</a></span>
                                    <span className='float-end'>
                                        <span className='svg__iconbox svg__icon--editBox' onClick={() => editPopup(item)}></span>
                                        <span className='svg__iconbox svg__icon--Switcher'></span>
                                        <span className='svg__iconbox svg__icon--trash' onClick={() => deleteDataFunction(item)}></span>
                                    </span>
                                    <ul className='sub-menu'>
                                        <li onClick={() => AddNewItem(item)}><span className='svg__iconbox svg__icon--Plus'></span> Add New </li>
                                        {item.childs?.map((child: any) => {
                                            return (
                                                <>
                                                    <li className="pre">
                                                        <span><a>{child.Title}</a></span>
                                                        <span className='float-end'>
                                                            <span className='svg__iconbox svg__icon--editBox' onClick={() => editPopup(child)}></span>
                                                            <span className='svg__iconbox svg__icon--Switcher'></span>
                                                            <span className='svg__iconbox svg__icon--trash' onClick={() => deleteDataFunction(child)}></span>
                                                        </span>
                                                        <ul className='sub-menu'>
                                                            <li onClick={() => AddNewItem(child)}><span className='svg__iconbox svg__icon--Plus'></span> Add New </li>
                                                            {child.childs?.map((subchild: any) => {
                                                                return (
                                                                    <>
                                                                        <li className="pre">
                                                                            <span><a>{subchild.Title}</a></span>
                                                                            <span className='float-end'>
                                                                                <span className='svg__iconbox svg__icon--editBox' onClick={() => editPopup(subchild)}></span>
                                                                                <span className='svg__iconbox svg__icon--Switcher'></span>
                                                                                <span className='svg__iconbox svg__icon--trash' onClick={() => deleteDataFunction(subchild)}></span>
                                                                            </span>
                                                                        </li>
                                                                    </>
                                                                )
                                                            })}

                                                        </ul>
                                                    </li>
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
            <Panel
                onRenderHeader={onRenderCustomHeaderMain}
                headerText="Edit Category"
                type={PanelType.custom}
                customWidth="850px"
                isOpen={EditPopup}
                onDismiss={ClosePopup}
                isBlocking={false}
            >
                <div className="modal-body border  p-3  ">
                    <div className='row mt-2'>
                        <div className='col-sm-2'>
                            <div className='form-group'>
                                <label><b>Parent</b></label>
                            </div>
                        </div>
                        <div className='col-sm-5'>
                            <div className='form-group'>
                                <label>{postData?.Title != undefined && postData?.Title != ""?postData?.Title:"Root" }</label>
                            </div>
                        </div>
                        <div className='col-sm-5'>
                            <div className='form-group'>
                                <label>Change Parent</label>
                                <span className='svg__iconbox svg__icon--editBox' onClick={() => changeParent()}></span>
                            </div>
                        </div>

                    </div>
                    <div className='row mt-2'>
                        <div className='col-sm-2'>
                            <div className='form-group'>
                                <label><b>Visibility</b></label>
                            </div>
                        </div>
                        <div className='col-sm-5'>
                            <span className="col-sm-2 padL-0 ">
                                <label>
                                    <input type="radio" className="mx-1" name='radio' onChange={(e) => setisVisible(true)}/>Visible (All)
                                </label>
                            </span>
                            <span className="col-sm-2" >
                                <label>
                                    <input type="radio" className="mx-1" name='radio' onChange={(e) => setisVisible(false)}/>No Show
                                </label>
                            </span>
                        </div>
                        <div className='col-sm-5'>
                            <div className='form-group'>
                                <label>
                                    <input type="Checkbox" className="me-1" onChange={()=>setOwner(true)}/>Facilitators Only
                                </label>

                            </div>
                        </div>


                    </div>
                    <div className='row mt-2'>
                        <div className='col-sm-2'>
                            <div className='form-group'>
                                <label><b>Title</b></label>
                            </div>
                        </div>
                        <div className='col-sm-10'>
                            <input type="text" className='form-control' defaultValue={popupData[0]?.Title} onChange={(e) => setPostData({ ...postData, Title: e.target.value })} />
                        </div>
                    </div>
                    <div className='row mt-2'>
                        <div className='col-sm-2'>
                            <div className='form-group'>
                                <label><b>Url</b></label>
                            </div>
                        </div>
                        <div className='col-sm-10'>
                            <input type="text" className='form-control' defaultValue={popupData[0]?.href?.Url} onChange={(e) => setPostData({ ...postData, Url: e.target.value })} />
                        </div>
                    </div>
                </div>
                <div className="footer mt-2">
                    <div className='row'>
                        <div className="col-sm-6 ">
                            <div className="text-left">
                                Created
                                <span>12/12/2022</span>
                                by <span
                                    className="siteColor">Santosh</span>
                            </div>
                            <div className="text-left">
                                Last modified
                                <span>12/04/2023</span>
                                by <span
                                    className="siteColor">Santosh</span>
                            </div>
                        </div>
                        <div className="col-sm-6 text-end">
                            <a target="_blank"
                                ng-if="AdditionalTaskTime.siteListName === 'SP.Data.TasksTimesheet2ListItem'"
                                href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/Lists/TaskTimeSheetListNew/EditForm.aspx?ID=112`}>
                                Open out-of-the-box
                                form
                            </a>
                            <button type="button" className="btn btn-primary ms-2"
                                onClick={() => UpdateData(popupData[0])} >
                                Save
                            </button>
                        </div>
                    </div>

                </div>
            </Panel>
            <Panel
                onRenderHeader={onRenderCustomHeaderMain}
                headerText="Edit Category"
                type={PanelType.custom}
                customWidth="850px"
                isOpen={AddPopup}
                onDismiss={CloseAddPopup}
                isBlocking={false}
            >
                <div className="modal-body border  p-3  ">
                    <div className='row mt-2'>
                        <div className='col-sm-2'>
                            <div className='form-group'>
                                <label><b>Parent</b></label>
                            </div>
                        </div>
                        <div className='col-sm-5'>
                            <div className='form-group'>
                                <label>Root</label>
                            </div>
                        </div>
                        <div className='col-sm-5'>
                            <div className='form-group'>
                                <label>Change Parent</label>
                            </div>
                        </div>

                    </div>
                    <div className='row mt-2'>
                        <div className='col-sm-2'>
                            <div className='form-group'>
                                <label><b>Visibility</b></label>
                            </div>
                        </div>
                        <div className='col-sm-5'>
                            <span className="col-sm-2 padL-0 ">
                                <label>
                                    <input type="radio" className="me-1" />Visible (All)
                                </label>
                            </span>
                            <span className="col-sm-2" >
                                <label>
                                    <input type="radio" className="me-1" />No Show
                                </label>
                            </span>
                        </div>
                        <div className='col-sm-5'>
                            <div className='form-group'>
                                <label>
                                    <input type="Checkbox" className="me-1" />Facilitators Only
                                </label>

                            </div>
                        </div>


                    </div>
                    <div className='row mt-2'>
                        <div className='col-sm-2'>
                            <div className='form-group'>
                                <label><b>Title</b></label>
                            </div>
                        </div>
                        <div className='col-sm-10'>
                            <input type="text" className='form-control' onChange={(e) => setPostData({ ...postData, Title: e.target.value })} />
                        </div>
                    </div>
                    <div className='row mt-2'>
                        <div className='col-sm-2'>
                            <div className='form-group'>
                                <label><b>Url</b></label>
                            </div>
                        </div>
                        <div className='col-sm-10'>
                            <input type="text" className='form-control' onChange={(e) => setPostData({ ...postData, Url: e.target.value })} />
                        </div>
                    </div>
                </div>
                <div className="footer mt-2">
                    <div className='row'>
                        <div className="col-sm-6 ">
                            <div className="text-left">
                                Created
                                <span>12/12/2022</span>
                                by <span
                                    className="siteColor">Santosh</span>
                            </div>
                            <div className="text-left">
                                Last modified
                                <span>12/04/2023</span>
                                by <span
                                    className="siteColor">Santosh</span>
                            </div>
                        </div>
                        <div className="col-sm-6 text-end">
                            <a target="_blank"
                                ng-if="AdditionalTaskTime.siteListName === 'SP.Data.TasksTimesheet2ListItem'"
                                href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/Lists/TaskTimeSheetListNew/EditForm.aspx?ID=112`}>
                                Open out-of-the-box
                                form
                            </a>
                            <button type="button" className="btn btn-primary ms-2"
                                onClick={() => Additem()} >
                                Save
                            </button>
                        </div>
                    </div>

                </div>
            </Panel>
            <Panel
                onRenderHeader={onRenderCustomHeaderMain}
                headerText="Edit Category"
                type={PanelType.custom}
                customWidth="850px"
                isOpen={changeroot}
                onDismiss={ClosechangePopup}
                isBlocking={false}
            >
                <div className="modal-body border  p-3  ">
                    <div className='row mt-2'>
                        <div className='col-sm-2'>
                            <label><b>Top Level</b></label>
                        </div>
                        <div className='col-sm-10'>
                            <select value={value} onChange={(e) => handleChange('Parent', e)}>
                                {
                                    root?.map((item: any) => {
                                        return (
                                            <>
                                                <option value={item.Title}>{item.Title}</option>
                                            </>
                                        )
                                    })
                                }


                            </select>
                        </div>


                    </div>
                    <div className='row mt-2'>
                        <div className='col-sm-2'>
                            <label><b>Second Level</b></label>
                        </div>
                        <div className='col-sm-10'>
                            <select value={child} onChange={(e) => handleChange('child', e)}>
                                {
                                    root?.map((item: any) => {
                                        return (
                                            <>
                                                {item.childs?.map((child: any) => {
                                                    return (
                                                        <option value={child.Title}>{child.Title}</option>
                                                    )
                                                })}
                                            </>
                                        )
                                    })
                                }

                            </select>
                        </div>


                    </div>
                    <div className='row mt-2'>
                    <div className='col-sm-2'>
                            <label><b>Third Level</b></label>
                        </div>
                        <div className='col-sm-10'>
                            <select value={subchild} onChange={(e) => handleChange('subchild', e)}>
                                {
                                    root?.map((item: any) => {
                                        return (
                                            <>
                                                {item.childs?.map((child: any) => {
                                                    return (
                                                    <>
                                                        {child.childs?.map((subchild:any) => {
                                                            return(
                                                                <>
                                                                <option value={child.Title}>{child.Title}</option>
                                                                </>
                                                            )
                                                        })}
                                                      </>
                                                    )
                                                })}
                                            </>
                                        )
                                    })
                                }

                            </select>
                        </div>
                    </div>

                </div>
                <div className="footer mt-2">
                    <div className='row'>
                        <div className="col-sm-6 ">
                            <div className="text-left">
                                Created
                                <span>12/12/2022</span>
                                by <span
                                    className="siteColor">Santosh</span>
                            </div>
                            <div className="text-left">
                                Last modified
                                <span>12/04/2023</span>
                                by <span
                                    className="siteColor">Santosh</span>
                            </div>
                        </div>
                        <div className="col-sm-6 text-end">
                            <a target="_blank"
                                ng-if="AdditionalTaskTime.siteListName === 'SP.Data.TasksTimesheet2ListItem'"
                                href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/Lists/TaskTimeSheetListNew/EditForm.aspx?ID=112`}>
                                Open out-of-the-box
                                form
                            </a>
                            <button type="button" className="btn btn-primary ms-2"
                                onClick={() => ChangeParentItem()} >
                                Save
                            </button>
                        </div>
                    </div>

                </div>
            </Panel>
        </>
    )
}
export default TopNavigation