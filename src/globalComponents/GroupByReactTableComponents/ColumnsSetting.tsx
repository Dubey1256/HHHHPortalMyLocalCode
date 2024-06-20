import * as React from "react";
import { Panel, PanelType } from 'office-ui-fabric-react';
import GlobalTooltip from "../../globalComponents/Tooltip";
import { Tooltip } from "@fluentui/react-components";
import "react-popper-tooltip/dist/styles.css";
import { Web } from "sp-pnp-js";
import CoustomInfoIcon from "./CoustomInfoIcon";
import { myContextValue } from '../globalCommon';
import { SlArrowDown, SlArrowUp } from "react-icons/sl";
import ColumnSettingSortingPannel from "./columnSettingSortingPannel";
const ColumnsSetting = (props: any) => {
    let MyContextdata: any = React.useContext(myContextValue);
    const [columnSettingVisibility, setColumnSettingVisibility] = React.useState<any>({});
    const [showHeader, setShowHeader] = React.useState<any>(props?.showHeader);
    const [columanSize, setcolumnsSize] = React.useState<any>([]);
    const [propColumns, setPropColumns] = React.useState([])
    const [columnSorting, setColumnSorting] = React.useState<any>({});
    const [columnOrderValue, setColumnOrderValue] = React.useState([]);
    const [draggedIndex, setDraggedIndex] = React.useState(null);
    const [editMode, setEditMode] = React.useState(false);
    const [tableHeightValue, setTableHeightValue] = React.useState(props?.tableHeight);
    const [heightOption, setHeightOption] = React.useState(props?.wrapperHeight ? "fixed" : "flexible");
    const [tablePageSize, setTablePageSize] = React.useState(props?.tableSettingPageSize);
    const [showProgress, setShowProgress] = React.useState(props?.showProgres);
    const [colunOredrAsc, setcolunOredrAsc] = React.useState("")
    const rerender = React.useReducer(() => ({}), {})[1]
    const [selectedSortingPanelIsOpen, setSelectedSortingPanelIsOpen] = React.useState(false);
    const [selectedSortingPanelValue, setSelectedSortingPanelValue] = React.useState<any>({});
    let columnIndexPostion = 0;
    let tableId = props?.tableId
    React.useEffect(() => {
        try {
            if (props?.settingConfrigrationData?.length > 0 && props?.settingConfrigrationData[0]?.tableId === tableId) {
                const eventSetting = props?.settingConfrigrationData[0]
                if (eventSetting?.columanSize?.length > 0) {
                    setcolumnsSize(eventSetting?.columanSize);
                }
                if (eventSetting?.colunOredrAsc) {
                    setcolunOredrAsc(eventSetting?.colunOredrAsc)
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
    const handleChangeDateAndDataCallBack = async () => {
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
                tableHeightValue: heightOption === "fixed" ? tableHeightValue : "",
                showProgress: showProgress,
                colunOredrAsc: colunOredrAsc,
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
            let updatePromises: Promise<any>[] = [];
            try {
                if (tableId && props?.settingConfrigrationData?.length > 0 && props?.settingConfrigrationData[0]?.tableId === tableId) {
                    const web = new Web(props?.ContextValue.siteUrl);
                    const updatePromise = web.lists.getByTitle("AdminConfigurations").items.getById(props?.settingConfrigrationData[0]?.ConfrigId).update({
                        Configurations: dataString,
                        Key: tableId,
                        Title: tableId,
                    });
                    await updatePromise;
                    updatePromises.push(updatePromise);
                } else if (tableId != undefined && tableId != "") {
                    const web = new Web(props?.ContextValue.siteUrl);
                    const addPromise = web.lists.getByTitle("AdminConfigurations").items.add({
                        Configurations: dataString,
                        Key: tableId,
                        Title: tableId,
                    });
                    await addPromise;
                    updatePromises.push(addPromise);
                }
            } catch (error) {
                console.log(error);
            }
            let columnsVisibllityDataAll: any = {
                columnSettingVisibility: columnSettingVisibility,
                showHeader: showHeader,
                columanSize: columanSize,
                columnSorting: columnSorting,
                tableId: props?.tableId,
                columnOrderValue: columnOrderValue,
                tableHeightValue: heightOption === "fixed" ? tableHeightValue : "",
                showProgress: showProgress,
                colunOredrAsc: colunOredrAsc,
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
                // tableHeightValue: tableHeightValue,
                tableHeightValue: heightOption === "fixed" ? tableHeightValue : "",
                showProgress: showProgress,
                colunOredrAsc: colunOredrAsc,
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
                    <span style={{ color: `${props?.portfolioColor}` }} className="siteColor">Global SmartTable Settings</span>
                </div>
                <GlobalTooltip ComponentId={7464} />
            </>
        );
    };
    const handleCheckboxChange = (event: any) => {
        setShowHeader(event.target.checked);
    };
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
        }
    };
    const handleChangeWidth = (event: any, value: any) => {
        let width = { size: event.target.value, id: value.id }
        handleSave(width, value);
    };
    const handleSortClick = (columnId: string, currentSorting: any) => {
        let newSorting: any;
        setColumnSorting({})
        if (currentSorting?.asc === true) {
            newSorting = { id: columnId, asc: true, desc: false, };
        } else if (currentSorting?.desc === true) {
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
    const sortByAsc = (type: any) => {
        let array = [...columnOrderValue];
        let placeholdersToSort = array?.map((item: any, index: any) => ({ item, index }))?.filter((entry: any) => entry.item.placeholder !== "");
        placeholdersToSort?.sort((a: any, b: any) => a.index - b.index);
        const result = array?.map((item: any) => {
            if (item.placeholder === "") {
                return item;
            }
            return placeholdersToSort.pop().item;
        });
        if (colunOredrAsc === "" || colunOredrAsc === "desc") {
            setcolunOredrAsc("asc");
        } else {
            setcolunOredrAsc("desc");
        }
        setColumnOrderValue(result);
    };
    const handleClearLocalStorage = async () => {
        let confirmDelete = confirm("Restore the Column Settings to their Default Value ?");
        if (confirmDelete) {
            if (props?.settingConfrigrationData[0]?.ConfrigId != undefined && props?.settingConfrigrationData[0]) {
                const web = new Web(props?.ContextValue.siteUrl);
                await web.lists
                    .getByTitle("AdminConfigurations")
                    .items.getById(props?.settingConfrigrationData[0]?.ConfrigId)
                    .recycle()
                    .then((i: any) => {
                        console.log(i, "deleted Favorites");
                        location.reload();
                    });
            } else {
                alert("Column settings have already been restored.");
            }
        }
    };
    const editSortingMode = (value: any) => {
        setSelectedSortingPanelValue(value)
        setSelectedSortingPanelIsOpen(true);
    }
    return (
        <Panel className="overflow-x-visible"
            type={PanelType.custom}
            customWidth="1300px"
            isOpen={props?.isOpen}
            onDismiss={handleClosePopup}
            onRenderHeader={onRenderCustomHeader}
            isBlocking={false}
        >
            <div className="modal-body p-0 mb-3 clearfix">
                <div className=" mb-3 tableSettingTable">
                    <table className="w-100">
                        <thead>
                            <tr>
                                <th className="f-16 border-0" style={{ width: "20%" }}>Table Header</th>
                                <th className="f-16 border-0" style={{ width: "20%" }}></th>
                                <th className="f-16 border-0" style={{ width: "40%" }}>Table Height</th>
                                <th className="f-16 border-0" style={{ width: "20%" }}>Table Size</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><div className="alignCenter"><label><input className="form-check-input cursor-pointer me-1" type="checkbox" checked={showHeader} onChange={handleCheckboxChange} name="showHeader" />Show Header</label><CoustomInfoIcon Discription="If the item is unchecked the Table Header (the CSF AWT, search field, buttons, icons) won’t be visible" /></div></td>
                                <td>
                                    <div className="alignCenter hreflink siteColor" onClick={handleClearLocalStorage}><span>Restore default table</span>
                                        {/* <CoustomInfoIcon Discription="Pressing on “Restore default table” will remove all changes and set the table to the default view." /> */}
                                        <Tooltip withArrow content="Pressing on “Restore default table” will remove all changes and set the table to the default view." relationship="label" positioning="below">
                                            <div className='alignCenter hover-text'>
                                                <span className="svg__iconbox svg__icon--info"></span>
                                            </div>
                                        </Tooltip>
                                    </div>
                                </td>
                                <td>
                                    <div className="SpfxCheckRadio alignCenter">
                                        <input type="radio" className="radio" id="flexible" value="flexible" checked={heightOption === 'flexible'} onChange={() => setHeightOption('flexible')} />
                                        <label htmlFor="flexible" className="me-3">Flexible</label>
                                        <input type="radio" className="radio" id="fixed" value="fixed" checked={heightOption === 'fixed'} onChange={() => setHeightOption('fixed')} />
                                        <label htmlFor="fixed">Fixed</label>
                                        {heightOption === 'fixed' && (
                                            <input style={{ width: "20%", height: "27px" }} type="text" className="ms-1" value={tableHeightValue} onChange={(e) => setTableHeightValue(e.target.value)} />
                                        )}
                                    </div>

                                </td>
                                <td><div className="d-flex"><input style={{ width: "36%", height: "27px" }} type="number" className="ms-1" value={tablePageSize} onChange={(e) => setTablePageSize(e.target.value)} />
                                    {/* <CoustomInfoIcon Discription="These features enable you to adjust the page size, determining the amount of data you wish to display." /> */}
                                    <Tooltip withArrow content="These features enable you to adjust the Table Size, determining the amount of data you wish to display." relationship="label" positioning="below">
                                        <div className='alignCenter hover-text'>
                                            <span className="svg__iconbox svg__icon--info"></span>
                                        </div>
                                    </Tooltip>
                                </div></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="boldClable f-18"> Column Settings</div>
                <div className="tableSettingTable">
                    <table className="w-100">
                        <thead>
                            <tr>
                                <th className="border-0" style={{ width: "28%" }}> <div className="alignCenter"><span className="f-16">Columns</span>
                                    {/* <CoustomInfoIcon Discription="Default settings are stored in centralized database the changes done here will be only for current user on this table it will not impact anyone else. For centralized changes suggestions contact admin." /> */}
                                    <Tooltip withArrow content="Default settings are stored in centralized database the changes done here will be only for current user on this table it will not impact anyone else. For centralized changes suggestions contact admin." relationship="label" positioning="below">
                                        <div className='alignCenter hover-text'>
                                            <span className="svg__iconbox svg__icon--info"></span>
                                        </div>
                                    </Tooltip>
                                </div></th>
                                <th className="f-16 border-0" style={{ width: "21%" }}><div className="alignCenter"><span className="f-16">Column Width</span>
                                    {/* <CoustomInfoIcon Discription="Enter the column width of the particular item. Note: the width of some items can’t be changed (those items has grey background)." /> */}
                                    <Tooltip withArrow content="Enter the column width of the particular item. Note: the width of some items can’t be changed (those items has grey background)." relationship="label" positioning="below">
                                        <div className='alignCenter hover-text'>
                                            <span className="svg__iconbox svg__icon--info"></span>
                                        </div>
                                    </Tooltip>
                                </div></th>
                                <th className="f-16 border-0" style={{ width: "30%" }}>
                                    <div className="alignCenter position-relative">
                                        <div className="alignCenter"><span className="f-16">Column Ordering</span>
                                            {/* <CoustomInfoIcon Discription="To change the column order drag and drop the items." /> */}
                                            <Tooltip withArrow content="To change the column order drag and drop the items." relationship="label" positioning="below">
                                                <div className='alignCenter hover-text'>
                                                    <span className="svg__iconbox svg__icon--info"></span>
                                                </div>
                                            </Tooltip>
                                        </div>
                                        <div className="sorticon ms-2" style={{ top: '-6px' }}>
                                            <div className="up hreflink" style={{ display: 'grid', textAlign: 'center', padding: "2px" }} onClick={() => sortByAsc("desc")}>
                                                <SlArrowUp style={colunOredrAsc === "desc" ? { color: "var(--SiteBlue)", height: "16px", width: "16px" } : { color: "gray", height: "16px", width: "16px" }} />
                                            </div>
                                            <div className="down hreflink" style={{ display: 'grid', textAlign: 'center', padding: "2px" }} onClick={() => sortByAsc("asc")}>
                                                <SlArrowDown style={colunOredrAsc === "asc" ? { color: "var(--SiteBlue)", height: "16px", width: "16px" } : { color: "gray", height: "16px", width: "16px" }} />
                                            </div>
                                        </div>
                                    </div>
                                </th>
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
                                                                {(column?.placeholder != undefined && column?.placeholder != '' && column.id != "descriptionsSearch" && column.id != "commentsSearch" && column.id != "timeSheetsDescriptionSearch" && column.id != "showProgress") || (column.id === "timeSheetsDescriptionSearch" && column?.columnHide === false) ? <div className={column.id === "Type" || column.id === "Attention" || column.id === "Admin" || column.id === "Actions" ? "alignCenter mx-3" : "alignCenter"}>
                                                                    <input className="form-check-input cursor-pointer mt-0 me-1" id={column.id} type='checkbox' disabled={column?.id === "Title" || column?.id === "TaskID" || column?.id === "portfolioItemsSearch" ? true : false} checked={column?.isColumnVisible}
                                                                        onChange={(e: any) => coustomColumnsSetting(column, event)} name={column.id}
                                                                    />{column?.placeholder}
                                                                    {selectedSortingPanelIsOpen === false ? <a className="pancil-icons mx-1 mt-1" onClick={(e) => editSortingMode(column)}><span className="svg__iconbox svg__icon--editBox"></span></a> : <a className="pancil-icons mx-1 mt-1"><span className="svg__iconbox svg__icon--editBox" style={{ backgroundColor: "gray" }}></span></a>}
                                                                    {column?.showProgressBar && <><input name="showProgress" className="form-check-input cursor-pointer me-1 mx-2" id="showProgress" type='checkbox' checked={showProgress} onChange={(e: any) => coustomColumnsSetting(column = { id: "showProgress" }, event)} /><span>Show Progress Bar</span></>}
                                                                </div> : ""}
                                                            </td>
                                                            <td style={{ width: "30%" }}>
                                                                {(column?.placeholder != undefined && column?.placeholder != '' && column.id != "descriptionsSearch" && column.id != "commentsSearch" && column.id != "timeSheetsDescriptionSearch" && column.id != "showProgress") || (column.id === "timeSheetsDescriptionSearch" && column?.columnHide === false) ? <div className="alignCenter">
                                                                    <input className="columnSettingWidth text-center ms-1" disabled={(column?.fixedColumnWidth === undefined || column?.fixedColumnWidth === false) ? false : true} style={(column?.fixedColumnWidth === undefined || column?.fixedColumnWidth === false) ? { width: "80px", padding: "1px", border: "1px solid #ccc", height: "27px" } : { width: "80px", padding: "1px", border: "1px solid #ccc", height: "27px", background: "#ddd" }} value={column?.size} type="number" placeholder={`${column?.placeholder}`} title={column?.placeholder} onChange={(e: any) => handleChangeWidth(e, column)} />
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
            </div>
            <footer className="modal-footer pe-0">
                <button type="button" className="btn btn-primary mx-1" style={{ backgroundColor: `${props?.portfolioColor}` }} onClick={handleChangeDateAndDataCallBack}>
                    Apply
                </button>
                <button type="button" className="btn btn-default" style={{ backgroundColor: `${props?.portfolioColor}`, borderColor: `${props?.portfolioColor}` }} onClick={handleClosePopup}>
                    Cancel
                </button>
            </footer>
            {selectedSortingPanelIsOpen && <ColumnSettingSortingPannel isOpen={selectedSortingPanelIsOpen} columnSorting={columnSorting} column={selectedSortingPanelValue} placeholder={selectedSortingPanelValue?.placeholder} handleSortClick={handleSortClick} setSelectedSortingPanelIsOpen={setSelectedSortingPanelIsOpen} />}
        </Panel>
    );
};
export default ColumnsSetting;
