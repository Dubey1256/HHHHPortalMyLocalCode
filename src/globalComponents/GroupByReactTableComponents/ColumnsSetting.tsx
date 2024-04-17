import * as React from "react";
import { Panel, PanelType } from 'office-ui-fabric-react';
import Tooltip from "../../globalComponents/Tooltip";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import { usePopperTooltip } from "react-popper-tooltip";
import "react-popper-tooltip/dist/styles.css";
import ColumnSettingSortingToolTip from "./ColumnSettingSortingToolTip";
import { Web } from "sp-pnp-js";
import CoustomInfoIcon from "./CoustomInfoIcon";
import { myContextValue } from '../globalCommon';
// let propColumns: any = [];
const ColumnsSetting = (props: any) => {
    let MyContextdata: any = React.useContext(myContextValue);
    const [columnSettingVisibility, setColumnSettingVisibility] = React.useState<any>({});
    const [showHeader, setShowHeader] = React.useState<any>(props?.showHeader);
    const [editing, setEditing] = React.useState<any>({});
    const [widthCol, setWidthCol] = React.useState<any>({});
    const [columanSize, setcolumnsSize] = React.useState<any>([]);
    const [propColumns, setPropColumns] = React.useState([])
    const [columnSorting, setColumnSorting] = React.useState<any>({});
    const [columnOrderValue, setColumnOrderValue] = React.useState([]);
    const [draggedIndex, setDraggedIndex] = React.useState(null);
    const [editMode, setEditMode] = React.useState(false);
    const [tableHeightValue, setTableHeightValue] = React.useState(props?.tableHeight);
    const [tablePageSize, setTablePageSize] = React.useState(props?.tableSettingPageSize);
    const [showProgress, setShowProgress] = React.useState(props?.showProgres);
    const rerender = React.useReducer(() => ({}), {})[1]
    // const [showTilesView, setShowTilesView] = React.useState<any>(false);
    let columnIndexPostion = 0;
    let tableId = props?.tableId
    React.useEffect(() => {
        try {
            // if (localStorage.getItem(tableId) && Object.keys(JSON.parse(localStorage.getItem(tableId)))?.length > 0) {
            if (props?.settingConfrigrationData?.length > 0 && props?.settingConfrigrationData[0]?.tableId === tableId) {
                // const eventSetting = JSON.parse(localStorage.getItem(tableId));
                const eventSetting = props?.settingConfrigrationData[0]
                if (eventSetting?.columanSize?.length > 0) {
                    setcolumnsSize(eventSetting?.columanSize)
                }
            }
            props?.headerGroup?.map((elem: any) => {
                elem?.headers?.map((elem1: any) => {
                    props?.columns?.map((colSize: any) => {
                        if (elem1?.column?.columnDef?.id === colSize.id) {
                            colSize.size = elem1?.column?.columnDef?.size;
                        }

                    })
                })
            })
            if (props?.sorting?.length > 0) {
                props?.sorting?.map((sort: any) => {
                    if (sort.desc === false) {
                        let findSort = { id: sort.id, asc: true, desc: false };
                        setColumnSorting((prevSorting: any) => ({ ...prevSorting, [sort.id]: findSort, }));
                    } else if (sort.desc === true) {
                        let findSort = { id: sort.id, asc: false, desc: true };
                        setColumnSorting((prevSorting: any) => ({ ...prevSorting, [sort.id]: findSort, }));
                    }
                })
            }
            if (props?.columnOrder?.length > 0) {
                let colOrder: any = [];
                props?.columnOrder?.map((col: any) => {
                    props?.columns?.map((val: any) => {
                        if (val.id === col) {
                            let value = { id: col, placeholder: val.placeholder };
                            colOrder.push(value);
                        }
                    })
                })
                setColumnOrderValue(colOrder);
            }
            try {
                if (props?.columns?.length > 0 && props?.columns != undefined) {
                    let preSetColumnSettingVisibility: any = {};
                    props.columns = props?.columns.map((updatedSortDec: any) => {
                        try {
                            if (props?.columnVisibilityData) {
                                preSetColumnSettingVisibility = props?.columnVisibilityData;
                                if (Object.keys(preSetColumnSettingVisibility)?.length) {
                                    const columnId = updatedSortDec.id;
                                    if (preSetColumnSettingVisibility[columnId] !== undefined) {
                                        updatedSortDec.isColumnVisible = preSetColumnSettingVisibility[columnId];
                                    }
                                }
                            }
                            return updatedSortDec;
                        } catch (error) {
                            console.log(error);
                        }
                    });
                }
                const sortedColumns = JSON.parse(JSON.stringify(props?.columns)).sort((a: any, b: any) => {
                    const indexA = props?.columnOrder?.indexOf(a.id);
                    const indexB = props?.columnOrder?.indexOf(b.id);

                    return indexA - indexB;
                });
                setPropColumns(sortedColumns);
            } catch (error) {
                console.log(error)
            }
        } catch (error) {
            console.log("backup Json parse error backGround Loade All Task Data")
        }
    }, [])
    const handleClosePopup = () => {
        props?.columnSettingCallBack('close');
    };
    const handleChangeDateAndDataCallBack = () => {
        if (props?.smartFabBasedColumnsSettingToggle != true) {
            const updatedData = { ...props?.columnVisibilityData };
            for (let key in columnSettingVisibility) {
                if (columnSettingVisibility.hasOwnProperty(key)) {
                    if (props?.columnVisibilityData.hasOwnProperty(key)) {
                        updatedData[key] = columnSettingVisibility[key];
                    } else {
                        updatedData[key] = columnSettingVisibility[key];
                    }
                }
            }
            try {
                if (columnSettingVisibility?.showProgress === true) {
                    updatedData.PercentComplete = false
                    updatedData.showProgress = true
                } else if (columnSettingVisibility?.PercentComplete === true) {
                    updatedData.PercentComplete = true
                    updatedData.showProgress = false
                }
            } catch (error) {

            }
            let preSetColumnSettingVisibility: any = {
                columnSettingVisibility: updatedData,
                showHeader: showHeader,
                columanSize: columanSize,
                columnSorting: columnSorting,
                tableId: props?.tableId,
                columnOrderValue: columnOrderValue,
                tableHeightValue: tableHeightValue,
                showProgress: showProgress,
                // showTilesView: showTilesView

            }
            if (tablePageSize > 0) {
                preSetColumnSettingVisibility.showPageSizeSetting = {
                    tablePageSize: parseInt(tablePageSize),
                    showPagination: true,
                };
            }
            else {
                preSetColumnSettingVisibility.showPageSizeSetting = {
                    tablePageSize: 0,
                    showPagination: false,
                };
            }
            const dataString = JSON.stringify(preSetColumnSettingVisibility);
            try {
                const updatePromises: Promise<any>[] = [];
                if (tableId && props?.settingConfrigrationData?.length > 0 && props?.settingConfrigrationData[0]?.tableId === tableId) {
                    const web = new Web(props?.ContextValue.siteUrl);
                    const updatePromise = web.lists.getByTitle("AdminConfigurations").items.getById(props?.settingConfrigrationData[0]?.ConfrigId).update({
                        Configurations: dataString,
                        Key: tableId,
                        Title: tableId,
                    });
                    updatePromises.push(updatePromise);
                } else if (tableId != undefined && tableId != "") {
                    const web = new Web(props?.ContextValue.siteUrl);
                    const updatePromise = web.lists.getByTitle("AdminConfigurations").items.add({
                        Configurations: dataString,
                        Key: tableId,
                        Title: tableId,
                    });
                    updatePromises.push(updatePromise);
                }
            } catch (error) {
                console.log(error)
            }
            // localStorage.setItem(tableId, dataString);
            let columnsVisibllityDataAll: any = {
                columnSettingVisibility: columnSettingVisibility,
                showHeader: showHeader,
                columanSize: columanSize,
                columnSorting: columnSorting,
                tableId: props?.tableId,
                columnOrderValue: columnOrderValue,
                tableHeightValue: tableHeightValue,
                showProgress: showProgress,
                // showTilesView: showTilesView
            }
            if (tablePageSize > 0) {
                columnsVisibllityDataAll.showPageSizeSetting = {
                    tablePageSize: parseInt(tablePageSize),
                    showPagination: true,
                };
            } else {
                columnsVisibllityDataAll.showPageSizeSetting = {
                    tablePageSize: 0,
                    showPagination: false,
                };
            }
            if (props?.columns?.length > 0 && props?.columns != undefined && (Object.keys(columnsVisibllityDataAll?.columnSorting)?.length > 0 || columnsVisibllityDataAll?.columanSize?.length > 0)) {
                let sortingDescData: any = [];
                props.columns = props?.columns?.map((col: any) => {
                    let updatedSortDec = { ...col }
                    let idMatch = updatedSortDec.id;
                    if (columnsVisibllityDataAll?.columnSorting[idMatch]?.id === updatedSortDec.id) {
                        if (columnsVisibllityDataAll?.columnSorting[idMatch]?.desc === true) {
                            let obj = { 'id': updatedSortDec.id, desc: true }
                            sortingDescData.push(obj);
                        }
                        if (columnsVisibllityDataAll?.columnSorting[idMatch]?.asc === true) {
                            let obj = { 'id': updatedSortDec.id, desc: false }
                            sortingDescData.push(obj);
                        }
                    }
                    columnsVisibllityDataAll?.columanSize?.map((elem: any) => {
                        if (elem?.id === updatedSortDec.id) {
                            let sizeValue = { ...elem }
                            updatedSortDec.size = parseInt(sizeValue?.size);
                        }
                    })
                    if (sortingDescData.length > 0) {
                        props?.setSorting(sortingDescData);
                    } else {
                        props?.setSorting([]);
                    }
                    return col;
                });
                // props?.columnSettingCallBack(columnsVisibllityDataAll)
            };

            try {
                if (columnSettingVisibility?.showProgress === true) {
                    columnsVisibllityDataAll.columnSettingVisibility.PercentComplete = false
                    columnsVisibllityDataAll.columnSettingVisibility.showProgress = true
                } else if (columnSettingVisibility?.PercentComplete === true) {
                    columnsVisibllityDataAll.columnSettingVisibility.PercentComplete = true
                    columnsVisibllityDataAll.columnSettingVisibility.showProgress = false
                }
            } catch (error) {

            }

            props?.columnSettingCallBack(columnsVisibllityDataAll);

        } else if (props?.smartFabBasedColumnsSettingToggle === true) {
            const updatedData = { ...props?.columnVisibilityData };
            for (let key in columnSettingVisibility) {
                if (columnSettingVisibility.hasOwnProperty(key)) {
                    if (props?.columnVisibilityData.hasOwnProperty(key)) {
                        updatedData[key] = columnSettingVisibility[key];
                    } else {
                        updatedData[key] = columnSettingVisibility[key];
                    }
                }
            }
            let preSetColumnSettingVisibility: any = {
                columnSettingVisibility: updatedData,
                showHeader: showHeader,
                columanSize: columanSize,
                columnSorting: columnSorting,
                tableId: props?.tableId,
                columnOrderValue: columnOrderValue,
                tableHeightValue: tableHeightValue,
                showProgress: showProgress,
                // showTilesView: showTilesView

            }
            if (tablePageSize > 0) {
                preSetColumnSettingVisibility.showPageSizeSetting = {
                    tablePageSize: parseInt(tablePageSize),
                    showPagination: true,
                };
            }
            else {
                preSetColumnSettingVisibility.showPageSizeSetting = {
                    tablePageSize: 0,
                    showPagination: false,
                };
            }
            MyContextdata.allContextValueData.smartFabBasedColumnsSetting = preSetColumnSettingVisibility;
            props?.columnSettingCallBack('close');
            props?.setSmartFabBasedColumnsSettingToggle(false);
        }
    };

    const coustomColumnsSetting = (item: any, event: any) => {
        const { name, checked } = event.target;
        if (name != "toggleAll") {
            setColumnSettingVisibility((prevCheckboxes: any) => ({
                ...prevCheckboxes,
                [name]: checked
            }));
            propColumns?.forEach((element: any) => {
                if (element.id === item.id) {
                    return element.isColumnVisible = checked;
                }
            });
            if (item.id === "showProgress") {
                setShowProgress(checked);
                propColumns?.forEach((elem: any) => {
                    if (item.id === "showProgress" && elem.id === "PercentComplete" && checked === true) {
                        return elem.isColumnVisible = false;
                    }
                });
            }
            if (item.id === "PercentComplete") {
                setShowProgress(false);
                propColumns?.forEach((elem: any) => {
                    if (item.id === "PercentComplete" && elem.id === "showProgress" && checked === true) {
                        return elem.isColumnVisible = false;
                    }
                });
            }
        } else {
            propColumns?.forEach((element: any) => {
                if ((element.id != "Title" && element.id != "portfolioItemsSearch" && element.id != "TaskID" && element.id != "descriptionsSearch" && element.id != "commentsSearch" && element.id != "timeSheetsDescriptionSearch" && element.id != "showProgress") || (element.id === "timeSheetsDescriptionSearch" && element.columnHide === false)) {
                    element.isColumnVisible = checked
                    setColumnSettingVisibility((prevCheckboxes: any) => ({
                        ...prevCheckboxes,
                        [element.id]: checked
                    }));
                }
            });
        }
    }

    const onRenderCustomHeader = () => {
        return (
            <>
                <div className="alignCenter subheading">
                    <span style={{ color: `${props?.portfolioColor}` }} className="siteColor">Table Settings</span>
                </div>
                <Tooltip ComponentId={7464} />
            </>
        );
    };

    const handleCheckboxChange = (event: any) => {
        setShowHeader(event.target.checked);
    };
    // const handleToggleViewTailView = () => {
    //     setShowTilesView(!showTilesView);
    // };

    const handleSave = async (widthCol: any, event: any) => {
        if (Object?.keys(widthCol)?.length > 0 && event.id === widthCol.id) {
            let width = { size: widthCol.size, id: event.id };
            const isDuplicate = columanSize?.some((item: any) => item.id === event.id);
            if (isDuplicate) {
                event.size = parseInt(widthCol.size)
                setcolumnsSize((prevColumnSize: any) =>
                    prevColumnSize.map((item: any) =>
                        item.id === event.id ? { ...item, size: widthCol.size } : item
                    )
                );
            } else {
                event.size = parseInt(widthCol.size)
                setcolumnsSize((prevColumnSize: any) => [...prevColumnSize, width]);
            }
            // setEditing({});
            // setWidthCol({});
        }
    };
    const handleChangeWidth = (event: any, value: any) => {
        let width = { size: event.target.value, id: value.id }
        // setWidthCol(width);
        handleSave(width, value);
    };
    // const handleCancel = (columnId: any) => {
    //     setEditing((prevEditingColumns: any) => ({
    //         ...prevEditingColumns,
    //         [columnId]: false
    //     }));
    //     setWidthCol({});
    // };
    // const handleEdit = (columnId: any) => {
    //     setEditing((prevEditingColumns: any) => ({
    //         ...prevEditingColumns,
    //         [columnId]: true
    //     }));
    // };

    const handleSortClick = (columnId: string, currentSorting: any) => {
        let newSorting: any;
        setColumnSorting({})
        // if (!currentSorting || currentSorting.id !== columnId) {
        //     newSorting = { id: columnId, asc: true, desc: false, };
        // } else if (currentSorting.asc) {
        //     newSorting = { id: columnId, asc: false, desc: true, };
        // } else { newSorting = null; }
        if (currentSorting.asc === true) {
            newSorting = { id: columnId, asc: true, desc: false, };
        } else if (currentSorting.desc === true) {
            newSorting = { id: columnId, asc: false, desc: true, };
        } else if (currentSorting === null) {
            { newSorting = null; }
        }
        setColumnSorting((prevSorting: any) => ({ ...prevSorting, [columnId]: newSorting, }));
    };


    const handleDragStart = (index: any) => {
        setDraggedIndex(index);
    };
    const handleDragOver = (index: any) => {
        if (draggedIndex !== null && draggedIndex !== index) {
            const newColumns = [...columnOrderValue];
            const [draggedColumn] = newColumns.splice(draggedIndex, 1);
            newColumns.splice(index, 0, draggedColumn);
            setColumnOrderValue(newColumns);
            setDraggedIndex(index);

            // let sortedColumn: any = [];
            // columnOrderValue?.forEach((orderItem: any) => {
            //     for (let i = 0; i < propColumns?.length; i++) {
            //         if (propColumns[i].id === orderItem.id) {
            //             sortedColumn.push({ ...propColumns[i] });
            //             break;
            //         }
            //     }
            // });
            // setPropColumns(sortedColumn);
            // rerender();
        }
    };

    React.useEffect(() => {
        let sortedColumn: any = [];
        if (columnOrderValue?.length > 0) {
            columnOrderValue?.forEach((orderItem: any) => {
                for (let i = 0; i < propColumns?.length; i++) {
                    if (propColumns[i].id === orderItem.id) {
                        sortedColumn.push({ ...propColumns[i] });
                        break;
                    }
                }
            });
            setPropColumns(sortedColumn);
            rerender();
        }
    }, [columnOrderValue])

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };
    const handleEditClick = () => {
        setEditMode(true);
    };
    const handleSaveClick = () => {
        setEditMode(false);
    };
    const handleCancelClick = () => {
        setEditMode(false);
    };
    const handleClearLocalStorage = async () => {
        let confirmDelete = confirm("Are you sure, you want to delete this?");
        if (confirmDelete) {
            const web = new Web(props?.ContextValue.siteUrl);
            await web.lists
                .getByTitle("AdminConfigurations")
                .items.getById(props?.settingConfrigrationData[0]?.ConfrigId)
                .recycle()
                .then((i: any) => {
                    console.log(i, "deleted Favorites");
                });
        }
        location.reload();
    };
    return (
        <Panel className="overflow-x-visible"
            type={PanelType.custom}
            customWidth="1300px"
            isOpen={props?.isOpen}
            onDismiss={handleClosePopup}
            onRenderHeader={onRenderCustomHeader}
            isBlocking={false}
        >
            <div className="modal-body p-0 mt-2 mb-3 clearfix">
                {/* <div className="px-1 siteColor" style={{ fontWeight: 300, fontSize: "21px", display: 'contents' }}>Table Columns Settings</div> */}
                {/* <div className="px-1 border-b border-black">
                            <label>
                                <input type='checkbox' checked={propColumns.every((e: any) => e.isColumnVisible === true)}
                                    onChange={() => coustomColumnsSetting(propColumns, event)} name="toggleAll"
                                />{' '}
                                Select All
                            </label>
                        </div> */}
                <div className="tableSettingTable">
                    <table className="w-100">
                        <thead>
                            <tr>
                                <th className="f-16 border-0" style={{ width: "28%" }}> <div className="alignCenter"><span>Columns</span> <span className="mt-1"><CoustomInfoIcon Discription="Default settings are stored in centralized database the changes done here will be only for current user on this table it will not impact anyone else. For centralized changes suggestions contact admin." /></span></div></th>
                                <th className="f-16 border-0" style={{ width: "21%" }}>Column Width</th>
                                {/* <th className="f-16 border-0" style={{ width: "21%" }}>Column Sorting</th> */}
                                <th className="f-16 border-0" style={{ width: "30%" }}>Column Ordering</th>
                            </tr>
                        </thead>
                        <tbody className="border-0">
                            <tr>
                                <td className="w-75 p-0 border-0" colSpan={2}>
                                    <table className="w-100">
                                        <tbody className="border-0">
                                            {propColumns?.map((column: any) => {
                                                return (
                                                    <>
                                                        {(column?.placeholder != undefined && column?.placeholder != '' && column.id != "descriptionsSearch" && column.id != "commentsSearch" && column.id != "timeSheetsDescriptionSearch" && column.id != "showProgress") || (column.id === "timeSheetsDescriptionSearch" && column?.columnHide === false) ? <tr key={column?.id} style={columnSorting[column?.id]?.asc === true || columnSorting[column.id]?.desc === true ? { background: "#ddd" } : {}}>
                                                            <td style={{ width: "40%" }}>
                                                                {(column?.placeholder != undefined && column?.placeholder != '' && column.id != "descriptionsSearch" && column.id != "commentsSearch" && column.id != "timeSheetsDescriptionSearch" && column.id != "showProgress") || (column.id === "timeSheetsDescriptionSearch" && column?.columnHide === false) ? <div className="alignCenter">
                                                                    <input className="form-check-input cursor-pointer me-1" id={column.id} type='checkbox' disabled={column?.id === "Title" || column?.id === "TaskID" || column?.id === "portfolioItemsSearch" ? true : false} checked={column?.isColumnVisible}
                                                                        onChange={(e: any) => coustomColumnsSetting(column, event)} name={column.id}
                                                                    />
                                                                    <ColumnSettingSortingToolTip columnSorting={columnSorting} column={column} placeholder={column?.placeholder} handleSortClick={handleSortClick} />

                                                                    {column?.showProgressBar && <><input name="showProgress" className="form-check-input cursor-pointer me-1 mx-2" id="showProgress" type='checkbox' checked={showProgress} onChange={(e: any) => coustomColumnsSetting(column = { id: "showProgress" }, event)} /><span>Show Progress Bar</span></>}

                                                                </div> : ""}
                                                            </td>
                                                            <td style={{ width: "30%" }}>
                                                                {(column?.placeholder != undefined && column?.placeholder != '' && column.id != "descriptionsSearch" && column.id != "commentsSearch" && column.id != "timeSheetsDescriptionSearch" && column.id != "showProgress") || (column.id === "timeSheetsDescriptionSearch" && column?.columnHide === false) ? <div className="alignCenter">
                                                                    {/* <div title={column?.placeholder} className="columnSettingWidth" style={(column?.fixedColumnWidth === undefined || column?.fixedColumnWidth === false) ? { width: "80px", padding: "1px", border: "1px solid #ccc", height: "27px" } : { width: "80px", padding: "1px", border: "1px solid #ccc", height: "27px", background: "gray", color: "white" }}>
                                                                    </div> */}
                                                                    <input className="columnSettingWidth ms-1" disabled={(column?.fixedColumnWidth === undefined || column?.fixedColumnWidth === false) ? false : true} style={(column?.fixedColumnWidth === undefined || column?.fixedColumnWidth === false) ? { width: "80px", padding: "1px", border: "1px solid #ccc", height: "27px" } : { width: "80px", padding: "1px", border: "1px solid #ccc", height: "27px", background: "#ddd" }} value={column?.size} type="number" placeholder={`${column?.placeholder}`} title={column?.placeholder} onChange={(e: any) => handleChangeWidth(e, column)} />

                                                                    {/* {!editing[column?.id] && ((column?.fixedColumnWidth === undefined || column?.fixedColumnWidth === false) ? (<div className="pencil-icons" onClick={() => handleEdit(column.id)}> <span className="svg__iconbox svg__icon--editBox"></span></div>) : (!editing[column?.id] && (<div className="pencil-icons"> <span style={{ background: "gray" }} className="svg__iconbox svg__icon--editBox"></span></div>)))} */}
                                                                    {/* {editing[column?.id] && (
                                                                        <div className="alignCenter">
                                                                            <input style={{ width: "36%", height: "27px" }} value={widthCol?.size} type="number" className="ms-1" placeholder={`${column?.placeholder}`} title={column?.placeholder} onChange={(e: any) => handleChangeWidth(e, column)} />
                                                                            <span onClick={() => handleSave(column)} className="svg__iconbox svg__icon--Save"></span>
                                                                            <span onClick={() => handleCancel(column.id)} className="svg__iconbox svg__icon--cross"></span>
                                                                        </div>
                                                                    )} */}
                                                                </div> : ""}
                                                            </td>
                                                        </tr> : ""}
                                                    </>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </td>
                                <td className="w-25 p-0 border-0">
                                    <table className="w-100">
                                        <tbody className="border-0">
                                            {columnOrderValue?.map((column1: any, index: any) => (
                                                <>
                                                    {(column1?.placeholder != undefined && column1?.placeholder !== '' && column1.id != "descriptionsSearch" && column1.id != "commentsSearch" && column1.id != "timeSheetsDescriptionSearch" && column1.id != "showProgress") || (column1.id === "timeSheetsDescriptionSearch" && propColumns?.some((elem: any) => elem.id === column1.id && elem?.columnHide === false)) ? (
                                                        <tr
                                                            key={index}
                                                            className={`px-1 ${index === draggedIndex ? "dragged" : ""}`}
                                                            draggable
                                                            onDragStart={() => handleDragStart(index)}
                                                            onDragOver={() => handleDragOver(index)}
                                                            onDragEnd={handleDragEnd}
                                                            style={columnSorting[column1.id]?.asc === true || columnSorting[column1.id]?.desc === true ? { cursor: "grab", background: "#ddd" } : { cursor: "grab" }}
                                                        >
                                                            {/* <td style={{ width: "80%" }}>{column1?.placeholder}</td> */}
                                                            <td style={{ width: "20%" }}>{++columnIndexPostion}</td>
                                                        </tr>
                                                    ) : ""}
                                                </>
                                            ))}
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="my-2 col-sm-12 row">
                    <div className="col-sm-3">
                        <div style={{ fontWeight: 300, fontSize: "21px", display: 'contents' }}><span className="siteColor">Table Header</span></div>
                        <div>
                            <label><input className="form-check-input cursor-pointer me-1" type="checkbox" checked={showHeader} onChange={handleCheckboxChange} name="showHeader" />Show Header</label>
                        </div>
                    </div>

                    <div className="col-sm-3">
                        <div className="alignCenter"><div style={{ fontWeight: 300, fontSize: "21px", display: 'contents' }} className="siteColor">Clear Preset Value</div>  <CoustomInfoIcon Discription="Restore the Column Settings to their Default Value." /></div>
                        <div>
                            <button className="width30" type="button" onClick={handleClearLocalStorage}>
                                Clear
                            </button>
                        </div>
                    </div>

                    <div className="col-sm-3">
                        <div style={{ fontWeight: 300, fontSize: "21px", display: 'contents' }} className="siteColor">Table Height</div>
                        {editMode ? (
                            <div className="alignCenter">
                                <div title="Table Height" className="columnSettingWidth" style={{ width: "80px", padding: "1px", border: "1px solid #ccc", height: "27px" }}>{tableHeightValue}</div>
                                <div className="alignCenter">
                                    <input style={{ width: "20%", height: "27px" }} type="text" className="ms-1" onChange={(e) => setTableHeightValue(e.target.value)} />
                                    <span className="svg__iconbox svg__icon--Save" onClick={handleSaveClick}></span>
                                    <span className="svg__iconbox svg__icon--cross" onClick={handleCancelClick}></span>
                                </div>
                            </div>
                        ) : (
                            <div className=" d-flex">
                                <div title="Table Height" className="columnSettingWidth" style={{ width: "80px", padding: "1px", border: "1px solid #ccc", height: "27px" }}>{tableHeightValue}</div>
                                <div className="pancil-icons">
                                    <span className="svg__iconbox svg__icon--editBox" onClick={handleEditClick}></span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="col-sm-2">
                        <div style={{ fontWeight: 300, fontSize: "21px", display: 'contents' }} className="siteColor">Page Size</div>
                        <div className=" d-flex">
                            <input style={{ width: "36%", height: "27px" }} type="number" className="ms-1" value={tablePageSize} onChange={(e) => setTablePageSize(e.target.value)} />
                        </div>
                    </div>

                    {/* <div className="col-sm-2">
                        <div style={{ fontWeight: 300, fontSize: "21px", display: 'contents' }}><span className="siteColor">Views</span></div>
                        <div>
                            <label><input className="form-check-input cursor-pointer me-1" type="checkbox" checked={showTilesView} onChange={handleToggleViewTailView} name="showTilesView" />Tile View</label>
                        </div>
                    </div> */}

                </div>
            </div>
            <footer>
                <button type="button" className="btn btn-default pull-right" style={{ backgroundColor: `${props?.portfolioColor}`, borderColor: `${props?.portfolioColor}` }} onClick={handleClosePopup}>
                    Cancel
                </button>
                <button type="button" className="btn btn-primary mx-1 pull-right" style={{ backgroundColor: `${props?.portfolioColor}` }} onClick={handleChangeDateAndDataCallBack}>
                    Apply
                </button>
            </footer>
        </Panel>
    );
};
export default ColumnsSetting;
