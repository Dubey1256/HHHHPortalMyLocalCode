import React, { useEffect, useState } from 'react'
import { Web } from 'sp-pnp-js';
import GlobalCommanTable from "./GlobalCommanTable";
import { ColumnDef } from '@tanstack/react-table';
import moment from 'moment';
import { Panel, PanelType } from "office-ui-fabric-react";
import Tooltip from '../../../globalComponents/Tooltip';
import VersionHistory from '../../../globalComponents/VersionHistroy/VersionHistory';
let ParentTopNavigation: any = []
var ParentData: any = [];
var childData: any = [];
export default function SiteStructureTool(Props: any) {
    //#region Required Varibale on Page load BY PB
    const PageContext: any = Props.Selectedprops;
    const [root, setRoot] = React.useState([]);
    const [SiteStructure, setSiteStructure] = useState([]);
    const [EditPopup, setEditPopup] = useState(false);
    const [AddPopup, setAddPopup] = React.useState(false);
    const [isVisible, setisVisible] = React.useState(false);
    const [owner, setOwner] = React.useState(false);
    const [changeroot, setChangeroot] = React.useState(false);
    const [value, setValue] = React.useState("");
    const [child, setChild] = React.useState("");
    const [subchild, setSubChild] = React.useState("");
    const [, setVersionHistoryPopup] = React.useState(false);
    const [postData, setPostData] = React.useState<any>({
        Title: "",
        Url: "",
        Description: "",
        TaskTime: "",
        Id: "",
        ParentId: "",
    });
    const [popupData, setPopupData] = React.useState<any>([]);
    //#endregion
    const handleChange = (type: any, event: any) => {
        if (type == "Parent") {
            ParentData = [];
            setValue(event.target.value);
            root?.forEach((ba: any) => {
                if (ba.Title == event.target.value) {
                    ParentData.push(ba);
                }
            });
        }
        if (type == "child") {
            childData = [];
            setChild(event.target.value);
            ParentData?.forEach((ba: any) => {
                ba?.childs.forEach((baa: any) => {
                    if (baa.Title == event.target.value) {
                        childData.push(baa);
                    }
                });
            });
        }
        2;
        if (type == "subchild") {
            setSubChild(event.target.value);
        }
    };
    //#region code to load All Documents By PB
    const LoadTopNavigation = () => {
        let web = new Web(PageContext?.SPSitesListUrl)
        web.lists.getById(PageContext?.TopNavigationListID).items.select('ID', 'Id', 'Title', 'href', 'ParentID', 'Order0', 'SortOrder', 'ownersonly', 'IsVisible', 'Modified', 'Created', 'Author/Id', 'Author/Title', 'Editor/Id', 'Editor/Title')
            .expand('Editor,Author')
            .orderBy('Title')
            .top(4999)
            .get()
            .then((response: any) => {
                var TabsFilter: any = []
                try {
                    response.forEach((Doc: any) => {
                        Doc.CreatedDate = moment(Doc?.Created).format('DD/MM/YYYY');
                        Doc.ModifiedDate = moment(Doc?.Modified).format('DD/MM/YYYY')
                    });
                    if (ParentTopNavigation.length > 0)
                        ParentTopNavigation = [];
                    response?.filter((comp: any) => {
                        if (comp?.ParentID === 0) {
                            comp['flag'] = true;
                            ParentTopNavigation.push(comp)
                        }
                    });
                    ParentTopNavigation.filter((item: any) => {
                        GroupByItems(item, response);
                    })
                    ParentTopNavigation.filter((item: any) => {
                        TabsFilter.push(item);
                    });
                    setRoot(ParentTopNavigation);
                } catch (e) {
                    console.log(e)
                }
                setSiteStructure(TabsFilter);

            }).catch((error: any) => {
                console.error(error);
            });
    }
    const isItemExists = (arr: any, Id: any) => {
        var isExists = false;
        arr.forEach((item: any) => { if (item.Id == Id) { isExists = true; return false; } });
        return isExists;
    }
    const GroupByItems = function (item: any, AllMetaItems: any) {
        AllMetaItems.filter((child: any) => {
            child['flag'] = true;
            if (child?.ParentID === item?.Id) {
                if (item['subRows'] === undefined)
                    item['subRows'] = []
                if (!isItemExists(item['subRows'], child.Id)) {
                    item['subRows'].push(child)
                }
                GroupByItems(child, AllMetaItems);
            }
        });
    }
    const onRenderCustomHeaderAdd = () => {
        return (
            <>
                <div className="subheading siteColor">Add TopNavigation</div>
                <Tooltip ComponentId="1810" />
            </>
        );
    };
    const onRenderCustomHeaderUpdate = () => {
        return (
            <>
                <div className="subheading siteColor">Update TopNavigation</div>
                <Tooltip ComponentId="1810" />
            </>
        );
    };
    const onRenderCustomHeaderSelect = () => {
        return (
            <>
                <div className="subheading siteColor">Select Parent</div>
                <Tooltip ComponentId="1810" />
            </>
        );
    };
    const editPopup = (item: any) => {
        var Data: any = [];
        item.CreatedDate = moment(item.Created).format("DD/MM/YYYY");
        item.ModifiedDate = moment(item.Modified).format("DD/MM/YYYY");
        setisVisible(item.IsVisible);
        Data.push(item);
        setPopupData(Data);
        setEditPopup(true);
    };
    const CloseAddPopup = () => {
        ParentData = [];
        childData = [];
        setAddPopup(false);
        setPostData(undefined);
    };
    const ClosePopup = () => {
        setEditPopup(false);
        setPostData(undefined);
    };
    // const AddNewItem = (item: any) => {
    //     var Data: any = [];
    //     Data.push(item);
    //     setPopupData(Data);
    //     setAddPopup(true);
    // };
    const Additem = async () => {
        if (popupData[0] == "New") {
            popupData[0] = { ID: 0 };
        }
        let web = new Web(PageContext?.SPSitesListUrl);
        await web.lists
            .getById(PageContext?.TopNavigationListID)
            .items.add({
                Title: postData.Title,
                ParentID:
                    postData.Id != undefined && postData.Id != ""
                        ? postData.Id
                        : popupData[0]?.ID,
                href: {
                    __metadata: { type: "SP.FieldUrlValue" },
                    Description:
                        postData.Url != undefined && postData.Url != ""
                            ? postData.Url
                            : popupData[0]?.href != undefined && popupData[0]?.href != null ? popupData[0]?.href.Url : '',
                    Url:
                        postData.Url != undefined && postData.Url != ""
                            ? postData.Url
                            : popupData[0]?.href != undefined && popupData[0]?.href != null ? popupData[0]?.href.Url : '',
                },
                IsVisible: isVisible,
                ownersonly: owner,
            })
            .then((res: any) => {
                console.log(res);
                CloseAddPopup();
                LoadTopNavigation();
            });
    };
    const deleteDataFunction = async (item: any) => {
        var deleteConfirmation = confirm("Are you sure, you want to delete this?");

        if (deleteConfirmation) {
            let web = new Web(PageContext?.SPSitesListUrl);
            await web.lists
                .getById(PageContext?.TopNavigationListID)
                .items.getById(item.Id)
                .delete()
                .then((i) => {
                    console.log(i);
                    LoadTopNavigation();
                });
        }
    };
    const changeParent = () => {
        setChangeroot(true);
    };
    const ClosechangePopup = () => {
        setChangeroot(false);
    };
    const UpdateData = async (item: any) => {
        let web = new Web(PageContext?.SPSitesListUrl);
        await web.lists
            .getById(PageContext?.TopNavigationListID)
            .items.getById(item.Id)
            .update({
                Title:
                    postData?.Title != undefined && postData?.Title != ""
                        ? postData?.Title
                        : item?.Title,
                ParentID:
                    postData?.ParentId != undefined && postData?.ParentId != ""
                        ? postData?.ParentId
                        : item?.ParentID,
                href: {
                    __metadata: { type: "SP.FieldUrlValue" },
                    Description:
                        postData != undefined && postData?.Url != ""
                            ? postData?.Url
                            : item?.href != null
                                ? item?.href.Url
                                : "",
                    Url:
                        postData != undefined && postData.Url != ""
                            ? postData?.Url
                            : item?.href != null
                                ? item?.href.Url
                                : "",
                },
                IsVisible: isVisible,
                ownersonly: owner,
            })
            .then((i) => {
                console.log(i);
                ClosePopup();
                LoadTopNavigation();
            });
    };
    const UpdateParentLevelData = () => {
        if (childData != undefined && childData.length > 0) {
            setPostData({ ...postData, ParentId: childData[0]?.Id });
        } else {
            if (ParentData != undefined && ParentData.length > 0) {
                setPostData({ ...postData, ParentId: ParentData[0]?.Id });
            }
        }

        ClosechangePopup();
    };
    //#endregion
    useEffect(() => {
        LoadTopNavigation()
    }, []);
    //#region code to apply react/10stack global table BY PB
    const columns = React.useMemo<ColumnDef<any, unknown>[]>(() => [
        {
            accessorKey: "",
            placeholder: "",
            hasCheckbox: true,
            hasCustomExpanded: true,
            hasExpanded: true,
            size: 10,
            id: 'Id',
        },
        {
            accessorKey: "Title", placeholder: "Title", header: "", id: "Title",
            cell: ({ row }) => (
                <div className='alignCenter columnFixedTitle'>
                    {row?.original?.Title != undefined &&
                        row?.original?.Title != null &&
                        row?.original?.Title != '' ? (
                        <a target="_blank" href={row?.original?.href?.Url}>
                            {row?.original?.Title}
                        </a>
                    ) : null}
                </div>
            ),
        },
        {
            accessorKey: "SortOrder", placeholder: "SortOrder", header: "", size: 120, id: "SortOrder", isColumnDefultSortingAsc: true,
            cell: ({ row }) => (
                <div className='alignCenter columnFixedTitle'>
                    {row?.original?.SortOrder != undefined &&
                        row?.original?.SortOrder != null &&
                        row?.original?.SortOrder != '' ? (
                        <a>
                            {row?.original?.SortOrder}
                        </a>
                    ) : null}
                </div>
            ),
        },
        {
            accessorKey: "Created", placeholder: "Created Date", header: "", size: 120, id: "Created",
            cell: ({ row }) => (
                <>
                    {row?.original?.CreatedDate}
                </>
            ),
        },
        {
            accessorKey: "Modified", placeholder: "Modified Date", header: "", size: 172, id: "Modified",
            cell: ({ row }) => (
                <>
                    {row?.original?.ModifiedDate}
                </>
            ),
        },
        {
            cell: ({ row }) => (
                <div className='alignCenter'>
                    <a title="Edit"><span onClick={() => editPopup(row.original)} title="Edit Task" className="svg__iconbox svg__icon--edit hreflink me-1"></span></a>
                    <a title="Delete"><span onClick={() => deleteDataFunction(row.original)} title="Remove Task" className="svg__iconbox svg__icon--cross dark hreflink"></span></a>
                </div>
            ),
            accessorKey: '',
            canSort: false,
            placeholder: '',
            header: '',
            id: 'row.original',
            size: 50,
        },
    ],
        [SiteStructure]);
    const callBackData = React.useCallback((elem: any, getSelectedRowModel: any, ShowingData: any) => { }, []);
    //#endregion
    return (
        <>
            <section className='ContentSection'>
                <div className='alignCenter'>
                    <h2 className="heading">Site-Structure Management
                    </h2>
                    {/* <a className='ml-auto fw-semibold' data-interception="off"
                        target="_blank">Old Site-Structure Management</a> */}
                </div>
            </section >
            {/* <button
                type="button"
                className="btn btn-primary ms-2"
                onClick={() => AddNewItem("New")}
            >
                Add Item
            </button> */}
            {
                SiteStructure && <div>
                    <div className="TableSection">
                        <div className='Alltable mt-2'>
                            <div className='col-md-12 p-0 smart'>
                                <GlobalCommanTable columns={columns} data={SiteStructure} showHeader={true} callBackData={callBackData} />
                            </div>
                        </div>
                    </div>
                </div>
            }
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
                    <div className="row mt-2">
                        <div className="col-sm-2">
                            <div className="form-group">
                                <label>
                                    <b>Parent</b>
                                </label>
                            </div>
                        </div>
                        <div className="col-sm-5">
                            <div className="form-group">
                                <label>
                                    {popupData[0]?.Title != undefined && popupData[0]?.Title != ""
                                        ? popupData[0]?.Title
                                        : "Root"}
                                </label>
                            </div>
                        </div>
                        <div className="col-sm-5">
                            <div className="form-group">
                                <label>Change Parent</label>
                                <span
                                    className="alignIcon ms-1 svg__iconbox svg__icon--editBox"
                                    onClick={() => changeParent()}
                                ></span>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-2">
                        <div className="col-sm-2">
                            <div className="form-group">
                                <label>
                                    <b>Visibility</b>
                                </label>
                            </div>
                        </div>
                        <div className="col-sm-5">
                            <span className="col-sm-2">
                                <label className="rediobutton">
                                    <span className="SpfxCheckRadio">
                                        <input
                                            type="radio"
                                            className="radio"
                                            name="radio"
                                            checked={isVisible}
                                            onChange={(e) => setisVisible(true)}
                                        />
                                        Visible (All)
                                    </span>
                                </label>
                            </span>
                            <span className="col-sm-2">
                                <label className="rediobutton">
                                    <span className="SpfxCheckRadio">
                                        <input
                                            type="radio"
                                            className="radio"
                                            name="radio"
                                            checked={isVisible == false ? true : false}
                                            onChange={(e) => setisVisible(true)}
                                        />
                                        No Show{" "}
                                    </span>
                                </label>
                            </span>
                        </div>
                        <div className="col-sm-5">
                            <div className="form-group">
                                <label>
                                    <input
                                        type="Checkbox"
                                        className="form-check-input me-1"
                                        onChange={() => setOwner(true)}
                                    />
                                    Facilitators Only
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-2">
                        <div className="col-sm-2">
                            <div className="form-group">
                                <label>
                                    <b>Title</b>
                                </label>
                            </div>
                        </div>
                        <div className="col-sm-10">
                            <input
                                type="text"
                                className="form-control"
                                defaultValue={popupData[0]?.Title}
                                onChange={(e) =>
                                    setPostData({ ...postData, Title: e.target.value })
                                }
                            />
                        </div>
                    </div>
                    <div className="row mt-2">
                        <div className="col-sm-2">
                            <div className="form-group">
                                <label>
                                    <b>Url</b>
                                </label>
                            </div>
                        </div>
                        <div className="col-sm-10">
                            <input
                                type="text"
                                className="form-control"
                                defaultValue={popupData[0]?.href?.Url}
                                onChange={(e) =>
                                    setPostData({ ...postData, Url: e.target.value })
                                }
                            />
                        </div>
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
                        <div className="col">
                            <div className="text-left">
                                Created
                                <> {popupData[0]?.CreatedDate} </>
                                by{" "}
                                <span className="siteColor">
                                    {" "}
                                    {popupData[0]?.Author?.Title}{" "}
                                </span>
                            </div>
                            <div className="text-left">
                                Last modified
                                <span>{popupData[0]?.ModifiedDate}</span>
                                by{" "}
                                <span className="siteColor">
                                    {" "}
                                    {popupData[0]?.Editor?.Title}{" "}
                                </span>
                            </div>
                            <div className="text-left">
                                Delete this item
                                <span
                                    className="alignIcon  svg__iconbox svg__icon--trash"
                                    onClick={() => deleteDataFunction(popupData[0])}
                                ></span>
                            </div>
                            <div className="text-left" onClick={() => setVersionHistoryPopup(false)}>
                                {popupData[0]?.Id && <VersionHistory
                                    taskId={popupData[0]?.Id}
                                    siteUrls={PageContext?.SPSitesListUrl}
                                    listId={PageContext?.TopNavigationListID}
                                />}
                            </div>


                        </div>
                        <div className="col  text-end">
                            <a
                                data-interception="off"
                                target="_blank"
                                href={`${PageContext?.SPSitesListUrl}/Lists/TopNavigation/AllItems.aspx`}
                            >
                                Open out-of-the-box form
                            </a>
                            <button
                                type="button"
                                className="btn btn-primary ms-2"
                                onClick={() => UpdateData(popupData[0])}
                            >
                                Save
                            </button>
                            <button
                                type="button"
                                className="btn btn-default ms-2"
                                onClick={() => ClosePopup()}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </footer>
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
                    <div className="row mt-2">
                        <div className="col-sm-2">
                            <div className="form-group">
                                <label>
                                    <b>Parent</b>
                                </label>
                            </div>
                        </div>
                        <div className="col-sm-5">
                            <div className="form-group">
                                <label>Root</label>
                            </div>
                        </div>
                        <div className="col-sm-5">
                            <div className="form-group">
                                <label>Change Parent</label>
                                <span
                                    className="alignIcon ms-1 svg__iconbox svg__icon--editBox"
                                    onClick={() => changeParent()}
                                ></span>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-2">
                        <div className="col-sm-2">
                            <div className="form-group">
                                <label>
                                    <b>Visibility</b>
                                </label>
                            </div>
                        </div>
                        <div className="col-sm-5">
                            <span className="col-sm-2 padL-0 ">
                                <label className="rediobutton">
                                    <span className="SpfxCheckRadio">
                                        <input
                                            type="radio"
                                            className="radio"
                                            name="radio"
                                            onChange={(e) => setisVisible(true)}
                                        />
                                        Visible (All)
                                    </span>
                                </label>
                            </span>
                            <span className="col-sm-2">
                                <label className="rediobutton">
                                    <span className="SpfxCheckRadio">
                                        <input
                                            type="radio"
                                            className="radio"
                                            name="radio"
                                            onChange={(e) => setisVisible(false)}
                                        />
                                        No Show
                                    </span>
                                </label>
                            </span>
                        </div>
                        <div className="col-sm-5">
                            <div className="form-group">
                                <label>
                                    <input type="Checkbox" className="form-check-input me-1" />
                                    Facilitators Only
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-2">
                        <div className="col-sm-2">
                            <div className="form-group">
                                <label>
                                    <b>Title</b>
                                </label>
                            </div>
                        </div>
                        <div className="col-sm-10">
                            <input
                                type="text"
                                className="form-control"
                                onChange={(e) =>
                                    setPostData({ ...postData, Title: e.target.value })
                                }
                            />
                        </div>
                    </div>
                    <div className="row mt-2">
                        <div className="col-sm-2">
                            <div className="form-group">
                                <label>
                                    <b>Url</b>
                                </label>
                            </div>
                        </div>
                        <div className="col-sm-10">
                            <input
                                type="text"
                                className="form-control"
                                onChange={(e) =>
                                    setPostData({ ...postData, Url: e.target.value })
                                }
                            />
                        </div>
                    </div>
                </div>
                <div className="modal-footer mt-3">
                    <div className="row w-100">
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
                        <div className="text-end pe-0">
                            {/* <a target="_blank"
                                ng-if="AdditionalTaskTime.siteListName === 'SP.Data.TasksTimesheet2ListItem'"
                                href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/Lists/TaskTimeSheetListNew/EditForm.aspx?ID=112`}>
                                Open out-of-the-box
                                form
                            </a> */}
                            <button
                                type="button"
                                className="btn btn-primary ms-2"
                                onClick={() => Additem()}
                            >
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
                    <div className="row mt-2">
                        <div className="col-sm-2">
                            <label>
                                <b>Top Level</b>
                            </label>
                        </div>
                        <div className="col-sm-10">
                            <select
                                className="full-width"
                                value={value == "" ? "Select Item" : value}
                                onChange={(e) => handleChange("Parent", e)}
                            >
                                <option value={""}>Root</option>
                                {root?.map((item: any) => {
                                    return (
                                        <>
                                            <option value={item.Title}>{item.Title}</option>
                                        </>
                                    );
                                })}
                            </select>
                        </div>
                    </div>
                    <div className="row mt-2">
                        <div className="col-sm-2">
                            <label>
                                <b>Second Level</b>
                            </label>
                        </div>
                        <div className="col-sm-10">
                            <select
                                className="full-width"
                                value={child == "" ? "Select Item" : child}
                                onChange={(e) => handleChange("child", e)}
                            >
                                <option value={""}>Select</option>
                                {ParentData?.map((item: any) => {
                                    return (
                                        <>
                                            {item.childs?.map((child: any) => {
                                                return (
                                                    <option value={child.Title}>{child.Title}</option>
                                                );
                                            })}
                                        </>
                                    );
                                })}
                            </select>
                        </div>
                    </div>
                    <div className="row mt-2">
                        <div className="col-sm-2">
                            <label>
                                <b>Third Level</b>
                            </label>
                        </div>
                        <div className="col-sm-10">
                            <select
                                className="full-width"
                                value={subchild}
                                onChange={(e) => handleChange("subchild", e)}
                            >
                                <option value={""}>Select</option>

                                {childData?.map((child: any) => {
                                    return (
                                        <>
                                            {child.childs?.map((subchild: any) => {
                                                return (
                                                    <>
                                                        <option value={subchild.Title}>
                                                            {subchild.Title}
                                                        </option>
                                                    </>
                                                );
                                            })}
                                        </>
                                    );
                                })}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="modal-footer mt-3">
                    <div className="row w-100">
                        <div className="text-end pe-0">
                            <button
                                type="button"
                                className="btn btn-primary ms-2"
                                onClick={() => UpdateParentLevelData()}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </Panel>
        </>
    )
}


