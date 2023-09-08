import * as React from 'react'
import { Web } from "sp-pnp-js";
import "bootstrap/dist/css/bootstrap.min.css";
import { arraysEqual, Modal, Panel, PanelType } from 'office-ui-fabric-react';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import Tooltip from '../../../globalComponents/Tooltip'
import GlobalCommanTable from '../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable';
import {
    ColumnDef,
} from "@tanstack/react-table";
import * as Moment from "moment";
const TopNavigation = (dynamicData: any) => {
    var ListId = dynamicData.dynamicData.TopNavigationListID
    const [root, setRoot] = React.useState([])
    const [EditPopup, setEditPopup] = React.useState(false);
    const [sortedArray, setSortedArray] = React.useState([]);
    const [data, setData] = React.useState([]);
    const [AddPopup, setAddPopup] = React.useState(false);
    const [sorting, setSorting] = React.useState(false);
    const [changeroot, setChangeroot] = React.useState(false);
    const [postData, setPostData] = React.useState<any>({ Title: '', Url: '', Description: '', TaskTime: '', Id: '', ParentId: '' })
    const [popupData, setPopupData] = React.useState<any>([]);
    const [sortOrder, setSortOrder] = React.useState<any>()
    const [sortId,setSortId] = React.useState()
    const [value, setValue] = React.useState("")
    const [child, setChild] = React.useState("")
    const [subchild, setSubChild] = React.useState("")
    const [isVisible, setisVisible] = React.useState(false);
    const [owner, setOwner] = React.useState(false)


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
            .getById(ListId)
            .items
            .select('ID', 'Id', 'Title', 'href', 'ParentID', 'Order0', 'SortOrder', 'ownersonly', 'IsVisible', 'Modified', 'Created','Author/Id','Author/Title','Editor/Id','Editor/Title')
            .expand('Editor,Author')
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
        item.CreatedDate = Moment(item.Craeted).format('DD/MM/YYYY')
        item.ModifiedDate = Moment(item.Modified).format('DD/MM/YYYY')
        setisVisible(item.IsVisible)
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
    const ChangeParentItem = () => {
        if (value != undefined && value != '') {
            root?.forEach((item: any) => {
                if (item.Title == value) {
                    postData.Title = value;
                    postData.Id = item.Id;
                    postData.ParentId = item.ParentId;
                }
            })
            setChangeroot(false)
        }
    }
    const onRenderCustomHeaderUpdate = () => {
        return (
      <>
       <div className='subheading' style={{ marginRight: "auto", fontSize: "20px", fontWeight: "600" }}>
                  Update TopNavigation
                  </div>
                  <Tooltip ComponentId='1810' />
                  </>
              );

            
    };
    const onRenderCustomHeaderAdd = () => {
        return (
      <>
       <div className='subheading' style={{ marginRight: "auto", fontSize: "20px", fontWeight: "600" }}>
                 Add TopNavigation
                  </div>
                  <Tooltip ComponentId='1810' />
                  </>
              );

            
    };
    const onRenderCustomHeaderSortOrder = () => {
        return (
      <>
       <div className='subheading' style={{ marginRight: "auto", fontSize: "20px", fontWeight: "600" }}>
                 Update SortOrder
                  </div>
                  <Tooltip ComponentId='1810' />
                  </>
              );

            
    };
    const onRenderCustomHeaderSelect = () => {
        return (
      <>
       <div className='subheading' style={{ marginRight: "auto", fontSize: "20px", fontWeight: "600" }}>
                Select Parent
                  </div>
                  <Tooltip ComponentId='1810' />
                  </>
              );

            
    };
    const UpdateData = async (item: any) => {
        let web = new Web(dynamicData.dynamicData.siteUrl);
        await web.lists.getById(ListId).items.getById(item.Id).update({
            Title: postData?.Title != undefined && postData?.Title != '' ? postData?.Title : item?.Title,
            ParentID: postData?.ParentId != undefined && postData?.ParentId != '' ? postData?.ParentId : item?.ParentID,
            href: {
                "__metadata": { type: "SP.FieldUrlValue" },
                Description: postData != undefined && postData?.Url != '' ? postData?.Url : item?.href.Url,
                Url: postData != undefined && postData.Url != '' ? postData?.Url : item?.href.Url,
            },
            IsVisible: isVisible,
            ownersonly: owner
        }).then(i => {
            console.log(i);
            ClosePopup();
            loadTopNavigation();
        })



    }
    const deleteDataFunction = async (item: any) => {
        var deleteConfirmation = confirm("Are you sure, you want to delete this?")
       
        if (deleteConfirmation){
            let web = new Web(dynamicData.dynamicData.siteUrl);
            await web.lists.getById(ListId).items.getById(item.Id).delete()
                .then(i => {
                    console.log(i);
                    loadTopNavigation();
                });
        }
    

    }

    const Additem = async () => {
        if(popupData[0] == 'New'){
            popupData[0] = {"ID": 0};
        }
        let web = new Web(dynamicData.dynamicData.siteUrl);
        await web.lists.getById(ListId).items.add({
            Title: postData.Title,
            ParentID: postData.Id != undefined && postData.Id != '' ? postData.Id : popupData[0]?.ID,
            href: {
                "__metadata": { type: "SP.FieldUrlValue" },
                Description: postData.Url != undefined && postData.Url != '' ? postData.Url : popupData[0]?.href.Url,
                Url: postData.Url != undefined && postData.Url != '' ? postData.Url : popupData[0]?.href.Url,
            },
            IsVisible: isVisible,
            ownersonly: owner
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
    const sortItem = (item:any) => {
        var neeArray:any=[]
        item?.forEach((val:any)=>{
            val.SortOrder = val?.SortOrder?.toString()
        })
        neeArray =  item.sort(customSort);
        setSortedArray(neeArray)
        setData(neeArray)
        setSorting(true)
    }
    function customSort(a:any, b:any) {
      
        if (a.SortOrder === undefined || a.SortOrder === null) return -1;
        if (b.SortOrder === undefined || b.SortOrder === null) return 1;
      
       
        return a.SortOrder - b.SortOrder;
      }

    
    const ClosesortItem = () => {
        setSorting(false)
    }
    const sortBy = (type:any) => {

        const copy = root
        if(type == 'Title'){
            copy.sort((a:any, b:any) => (a.Title > b.Title) ? 1 : -1);
        }
        if(type == 'SortOrder'){
            copy.sort((a:any, b:any) => (a.SortOrder > b.SortOrder) ? 1 : -1);
        }
        setRoot(copy)
        setRoot((copy)=>[...copy])

    }
    const sortByDng = (type:any) => {

        const copy = root
        if(type == 'Title'){
            copy.sort((a:any, b:any) => (a.Title > b.Title) ? -1 : 1);
        }
        if(type == 'SortOrder'){
            copy.sort((a:any, b:any) => (a.SortOrder > b.SortOrder) ? -1 : 1);
        }
        setRoot(copy)
        setRoot((copy)=>[...copy])

    }
const updateSortOrder=async ()=>{
    console.log(sortId)
    console.log(sortOrder)
    let web = new Web(dynamicData.dynamicData.siteUrl);

    await web.lists.getById(ListId).items.getById(sortId).update({


        SortOrder:sortOrder,

    }).then((res: any) => {

        console.log(res);
        ClosesortItem();


    })
}
const column = React.useMemo<ColumnDef<any, unknown>[]>(
    () => [
       
       
        {
            header: '',
            accessorKey: 'Title',
            placeholder: "Title",
            size: 160,

        },
        {
            header: '',
            accessorKey: 'SortOrder',
            placeholder: "SortOrder",
            size: 100,

        }

    ],
    [data]
);
const callBackData = React.useCallback((elem: any, ShowingData: any) => {


}, []);
    return (
        <>
             <div className='row'>
                <div className='col-sm-3 text-primary'>
                    <h3 className="heading">Update TopNavigation
                    </h3>
                </div>
                <div className='col-sm-9 text-primary'>
                    <h6 className='pull-right'><b><a  data-interception="off"
                    target="_blank" href="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/UpdateTopNavigation.aspx">Old Update TopNavigation</a></b>
                    </h6>
                </div>
            </div>
            <div className='container mt-2' id='TopNavRound'>
                <ul className="top-navigate mt-4">
                <li  className='parent' onClick={() => AddNewItem('New')}><span className='svg__iconbox svg__icon--Plus'></span> Add New </li>
                    {root.map((item) => {
                        return (
                            <>
                                <li className='parent '>
                                    <span> <a href={item.href?.Url}>{item.Title}</a></span>
                                    <span className='float-end'>
                                        <span className='svg__iconbox svg__icon--editBox' onClick={() => editPopup(item)}></span>
                                        <span className='svg__iconbox svg__icon--Switcher' onClick={() => sortItem(root)}></span>
                                        <span className='svg__iconbox svg__icon--trash' onClick={() => deleteDataFunction(item)}></span>
                                    </span>
                                    <ul className='sub-menu'>
                                        <li onClick={() => AddNewItem(item)}><span className='svg__iconbox svg__icon--Plus'></span> Add New </li>
                                        {item.childs?.map((child: any) => {
                                            return (
                                                <>
                                                    <li className="pre">
                                                        <span><a href={child.href?.Url}>{child.Title}</a></span>
                                                        <span className='float-end'>
                                                            <span className='svg__iconbox svg__icon--editBox' onClick={() => editPopup(child)}></span>
                                                            <span className='svg__iconbox svg__icon--Switcher' onClick={() => sortItem(item.childs)}></span>
                                                            <span className='svg__iconbox svg__icon--trash' onClick={() => deleteDataFunction(child)}></span>
                                                        </span>
                                                        <ul className='sub-menu'>
                                                            <li onClick={() => AddNewItem(child)}><span className='svg__iconbox svg__icon--Plus'></span> Add New </li>
                                                            {child.childs?.map((subchild: any) => {
                                                                return (
                                                                    <>
                                                                        <li className="pre">
                                                                            <span><a href={subchild.href?.Url}>{subchild.Title}</a></span>
                                                                            <span className='float-end'>
                                                                                <span className='svg__iconbox svg__icon--editBox' onClick={() => editPopup(subchild)}></span>
                                                                                <span className='svg__iconbox svg__icon--Switcher' onClick={() => sortItem(child.childs)}></span>
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
                onRenderHeader={onRenderCustomHeaderUpdate}
                headerText="Edit Category"
                type={PanelType.custom}
                customWidth="850px"
                isOpen={EditPopup}
                onDismiss={ClosePopup}
                isBlocking={false}
            >
                <div className="modal-body">
                    <div className='row mt-2'>
                        <div className='col-sm-2'>
                            <div className='form-group'>
                                <label><b>Parent</b></label>
                            </div>
                        </div>
                        <div className='col-sm-5'>
                            <div className='form-group'>
                                <label>{postData?.Title != undefined && postData?.Title != "" ? postData?.Title : "Root"}</label>
                            </div>
                        </div>
                        <div className='col-sm-5'>
                            <div className='form-group'>
                                <label>Change Parent</label>
                                <span className='alignIcon ms-1 svg__iconbox svg__icon--editBox' onClick={() => changeParent()}></span>
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
                            <span className="col-sm-2">
                                <label className='rediobutton'>
                                    <span className='SpfxCheckRadio'>
                                    <input type="radio" className="radio" name='radio' checked={isVisible} onChange={(e) => setisVisible(true)} />Visible (All)</span>
                                </label>
                            </span>
                            <span className="col-sm-2">
                                <label className='rediobutton'>
                                <span className='SpfxCheckRadio'>
                                    <input type="radio" className="radio" name='radio' onChange={(e) => setisVisible(false)} />No Show </span>
                                </label>
                            </span>
                        </div>
                        <div className='col-sm-5'>
                            <div className='form-group'>
                                <label>
                                    <input type="Checkbox" className="form-check-input me-1" onChange={() => setOwner(true)} />Facilitators Only
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
                <div className="modal-footer mt-3">
                    <div className='row w-100'>
                        <div className="col-sm-6 pe-0">
                            <div className="text-left">
                                Created
                                <span> {popupData[0]?.CreatedDate} </span>
                                by <span
                                    className="siteColor"> {popupData[0]?.Author?.Title} </span>
                            </div>
                            <div className="text-left">
                                Last modified
                                <span>{popupData[0]?.ModifiedDate}</span>
                                by <span
                                    className="siteColor"> {popupData[0]?.Editor?.Title} </span>
                            </div>
                        </div>
                        <div className="col-sm-6 text-end p-0">
                            <a data-interception="off" target="_blank"
                                href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/Lists/TopNavigation/EditForm.aspx?ID=${popupData[0]?.Id}`}>
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
                onRenderHeader={onRenderCustomHeaderAdd}
                headerText="Edit Category"
                type={PanelType.custom}
                customWidth="850px"
                isOpen={AddPopup}
                onDismiss={CloseAddPopup}
                isBlocking={false}
            >
                <div className="modal-body">
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
                                <span className='alignIcon ms-1 svg__iconbox svg__icon--editBox' onClick={() => changeParent()}></span>
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
                            <label className='rediobutton'>
                                    <span className='SpfxCheckRadio'>
                                    <input type="radio" className="radio" name='radio' onChange={(e) => setisVisible(true)} />Visible (All)
                                    </span>
                                </label>
                            </span>
                            <span className="col-sm-2" >
                            <label className='rediobutton'>
                                    <span className='SpfxCheckRadio'>
                                    <input type="radio" className="radio" name='radio' onChange={(e) => setisVisible(false)} />No Show
                                    </span>
                                </label>
                            </span>
                        </div>
                        <div className='col-sm-5'>
                            <div className='form-group'>
                                <label>
                                    <input type="Checkbox" className="form-check-input me-1" />Facilitators Only
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
                <div className="modal-footer mt-3">
                    <div className='row w-100'>
                        {/* <div className="col-sm-6 ps-0">
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
                        </div> */}
                        <div className="text-end">
                            {/* <a target="_blank"
                                ng-if="AdditionalTaskTime.siteListName === 'SP.Data.TasksTimesheet2ListItem'"
                                href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/Lists/TaskTimeSheetListNew/EditForm.aspx?ID=112`}>
                                Open out-of-the-box
                                form
                            </a> */}
                            <button type="button" className="btn btn-primary ms-2"
                                onClick={() => Additem()} >
                                Save
                            </button>
                        </div>
                    </div>

                </div>
            </Panel>
            <Panel
                onRenderHeader={onRenderCustomHeaderSelect}
                headerText="Edit Category"
                type={PanelType.custom}
                customWidth="850px"
                isOpen={changeroot}
                onDismiss={ClosechangePopup}
                isBlocking={false}
            >
                <div className="modal-body border p-2" style={{ padding: "10px" }}>
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
                                                            {child.childs?.map((subchild: any) => {
                                                                return (
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
                <div className="modal-footer mt-3">
                    <div className='row w-100'>
                       
                        <div className="text-end">
                            <button type="button" className="btn btn-primary ms-2"
                                onClick={() => UpdateData(popupData[0])} >
                                Save
                            </button>
                        </div>
                    </div>

                </div>
            </Panel>
            <Panel
                onRenderHeader={onRenderCustomHeaderSortOrder}
                headerText="Edit Category"
                type={PanelType.custom}
                customWidth="600px"
                isOpen={sorting}
                onDismiss={ClosesortItem}
                isBlocking={false}
            >
                
                    <div className='Alltable'>
                        <GlobalCommanTable columns={column} data={data} callBackData={callBackData} showHeader={false} expandIcon={false}/> 
                    </div>

                
                    <div className="mt-3">
                    <footer className='d-flex justify-content-between w-100'>
                        <div className="mt-2">
                            <a data-interception="off" target="_blank"
                                href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/Lists/TopNavigation/EditForm.aspx?ID=${popupData[0]?.Id}`}>
                                Open out-of-the-box
                                form
                            </a>
                         </div>
                         <div className='mt-2'>
                            <button type="button" className="btn btn-primary ms-2"
                                onClick={() =>ClosesortItem()}>
                                Save
                            </button>
                            <button type="button" className="btn btn-default ms-2" 
                                onClick={() => ClosesortItem()} >
                                Cancel
                            </button>
                        </div>
                    </footer>

                </div>
        </Panel>
        </>
    )
}
export default TopNavigation