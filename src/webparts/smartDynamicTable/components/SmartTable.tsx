import { ColumnDef } from '@tanstack/react-table';
import moment from 'moment';
import * as React from 'react';
import { Web } from 'sp-pnp-js';
import HighlightableCell from '../../../globalComponents/GroupByReactTableComponents/highlight';
import GlobalCommanTable from '../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable';
import PageLoader from '../../../globalComponents/pageLoader';
import { IoIosCreate } from 'react-icons/io';
import ListCreatePopup from './ListCreatePopup';

let ContextValue: any = {}
let QureyPrepare = "";
let expandPrepare = "";
export const ColumnsConfig = (props: any) => {
    const [tableConfrigration, setTableConfrigration] = React.useState<any>([]);
    const [selectedOption, setSelectedOption] = React.useState<any>({});
    const getColumnsConfrigration = async () => {
        let web = new Web(props?.SelectedProp?.siteUrl);
        let configrationData = [];
        configrationData = await web.lists
            .getById(props?.SelectedProp?.TableConfrigrationListId)
            .items.select("Id", "Title", "DatabaseListId", "ColumnConfig", "DynamicConfiguration", "ListId").get();
        setTableConfrigration(configrationData);
    };
    React.useEffect(() => {
        getColumnsConfrigration();
    }, []);
    const handleSelectChange = (event: any) => {
        props?.setLoaded(false);
        const selectedId = parseInt(event.target.value, 10);
        const selectedValue = tableConfrigration?.find((option: any) => option.Id === selectedId);
        setSelectedOption(selectedValue);
        let configData = tableConfrigration?.filter((elem: any) => elem.Id === selectedId);
        findConfig(configData);
    };
    const findConfig = (config: any) => {
        if (config?.length > 0) {
            let DynamicConfiguration: any = [];
            config?.map((elem: any) => {
                try {
                    let jsonStringWithoutQuotes = elem?.DatabaseListId?.replace(/'/g, '');
                    let cleanedJsonString = jsonStringWithoutQuotes?.replace(/\\n/g, '\n');
                    ContextValue = JSON.parse(cleanedJsonString);
                } catch (error) {
                    console.log(error)
                }
                if (elem?.DynamicConfiguration != null && elem?.DynamicConfiguration != "") {
                    try {
                        let jsonStringWithoutQuotes = elem?.DynamicConfiguration.replace(/'/g, '');
                        let cleanedJsonString = jsonStringWithoutQuotes.replace(/\\n/g, '\n');
                        DynamicConfiguration = JSON.parse(cleanedJsonString);
                        elem.DynamicConfigurationValue = DynamicConfiguration
                    } catch (error) {
                        console.log(error)
                    }
                }
            });
            DynamicConfiguration?.forEach((elem: any) => {
                QureyPrepare += (elem.type === "SingleLineText" || elem.type === "Number") ? elem.internalName : (elem.lookupFields !== undefined) ? elem.lookupFields.map((lookup: any) => elem.internalName + "/" + lookup).join(",") : elem.internalName;
                QureyPrepare += ",";
                expandPrepare += (elem.lookupFields !== undefined) ? elem.internalName + "," : "";
            });
            QureyPrepare = QureyPrepare.replace(/,\s*$/, "");
            expandPrepare = expandPrepare.replace(/,\s*$/, "");
            ContextValue = { ...ContextValue, Context: props?.SelectedProp?.Context, siteUrl: props?.SelectedProp?.siteUrl };
            props?.setColumnConfigrationData(config);
            props?.prepareDynamicData(config, DynamicConfiguration);
        }
    }
    return (
        <>
            <div className='tbl-headings justify-content-between fixed-Header top-0' style={{ background: '#e9e9e9' }}>
                <span className='leftsec'>
                </span>
                <span className="toolbox">
                    <div>
                        <div>
                            <label htmlFor="dropdown">Select Database List</label>
                            <select id="dropdown" onChange={(e: any) => handleSelectChange(e)} value={selectedOption.Id}>
                                <option>Select Data Base List</option>
                                {tableConfrigration.map((option: any) => (
                                    <option key={option.Id} value={option.Id}>{option.Title}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div><IoIosCreate onClick={() => props?.setCreateListPopup(true)} /></div>
                </span>
            </div >
        </>
    )
}
const SmartTable = (SelectedProp: any) => {
    const allContext: any = SelectedProp?.SelectedProp;
    const [columnConfigrationData, setColumnConfigrationData] = React.useState([]);
    const [createListPopup, setCreateListPopup] = React.useState<any>(false);
    const [prepareColumns, setPrepareColumns] = React.useState([]);
    const [loaded, setLoaded] = React.useState(true);
    const [data, setData] = React.useState([])
    const [dynamicColumnsValue, setDynamicColumnsValue] = React.useState([])

    const prepareDynamicData = async (config: any, DynamicConfiguration: any) => {
        let AllPrepareData: any = [];
        try {
            let web = new Web(ContextValue?.siteUrl);
            AllPrepareData = await web.lists.getById(config[0]?.ListId).items.select(QureyPrepare).expand(expandPrepare).getAll();
            AllPrepareData?.forEach((result: any) => {
                DynamicConfiguration?.forEach((element: any) => {
                    const isLookup = element?.type === "Lookup";
                    const hasLookupFields = element?.lookupFields != undefined && element?.lookupFields?.length > 0;
                    if (hasLookupFields && isLookup) {
                        const displayKey = "Display" + element.internalName;
                        result[displayKey] = element.multiLookup ? result[element.internalName]?.map((val: any) => val.Title).join(",") : result[element.internalName]?.Title;
                    }
                    if (element?.type === "date") {
                        const displayKey = "Display" + element.internalName;
                        const dateValue = moment(result[element.internalName]);
                        result[displayKey] = dateValue.isValid() ? dateValue.format("DD/MM/YYYY") : "";
                    }
                });
            });
            makeDynamicColumns(AllPrepareData, config)
            console.log(AllPrepareData);
            setLoaded(true);
        } catch (error) {
            console.log("Error:", error)
        }
    }

    const makeDynamicColumns = (AllPrepareData: any, config: any) => {
        let DynamicConfigurationValue = config[0]?.DynamicConfigurationValue?.sort((elem1: any, elem2: any) => elem1.sortOrder - elem2.sortOrder);
        const dynamicColumnsPrepareValue: any = DynamicConfigurationValue?.map((column: any) => {
            if (column.type != "Lookup") {
                let columnName = column?.internalName;
                return {
                    accessorFn: (row: any) => row?.[columnName],
                    cell: ({ row, getValue }: any) => (
                        <>
                            <span title={row?.original?.[columnName]} className="text-content">{row?.original?.[columnName]}</span>
                        </>
                    ),
                    id: column.id,
                    placeholder: column.placeholder,
                    isColumnDefultSortingAsc: column.isColumnDefultSortingAsc,
                    size: column.size,
                    header: "",
                    resetColumnFilters: false,
                    isColumnVisible: true
                };
            } else if (column.type === "Lookup") {
                let colDisplay = "Display" + `${column?.internalName}`
                return {
                    accessorFn: (row: any) => row?.[colDisplay],
                    cell: ({ row, getValue }: any) => (
                        <>
                            <span className="columnFixedTaskCate"><span title={row?.original?.[colDisplay]} className="text-content">{row?.original?.[colDisplay]}</span></span>
                        </>
                    ),
                    id: column.id,
                    placeholder: column.placeholder,
                    isColumnDefultSortingAsc: column.isColumnDefultSortingAsc,
                    size: column.size,
                    header: "",
                    resetColumnFilters: false,
                    isColumnVisible: true
                };
            } else if (column.type === "date") {
                let columnName = column?.internalName;
                let colDisplay = "Display" + `${column?.internalName}`
                return {
                    accessorFn: (row: any) => row?.[columnName],
                    cell: ({ row }: any) => (
                        <span className='alignCetnter'>{row?.original?.[colDisplay]}</span>
                    ),
                    filterFn: (row: any, columnName: any, filterValue: any) => {
                        if (row?.original?.[colDisplay]?.includes(filterValue)) {
                            return true
                        } else {
                            return false
                        }
                    },
                    id: column.id,
                    placeholder: column.placeholder,
                    isColumnDefultSortingAsc: column.isColumnDefultSortingAsc,
                    size: column.size,
                    header: "",
                    resetColumnFilters: false,
                    isColumnVisible: true
                };
            }

        });
        setDynamicColumnsValue(dynamicColumnsPrepareValue)
        setData(AllPrepareData);
    }
    const columns: any = React.useMemo<ColumnDef<any, unknown>[]>(
        () => [
            {
                accessorKey: "",
                placeholder: "",
                hasCheckbox: true,
                hasCustomExpanded: false,
                hasExpanded: false,
                isHeaderNotAvlable: true,
                size: 55,
                id: 'Id',
            },
            ...dynamicColumnsValue,
        ],
        [data]
    );
    const callBackData = React.useCallback((checkData: any) => {

    }, []);
    const createListCallBack = React.useCallback((eventSetting: any) => {
        if (eventSetting != 'close') {
            setCreateListPopup(false);
        } else {
            setCreateListPopup(false);
        }
    }, []);
    return (
        <div>
            <div className='tbl-headings justify-content-between fixed-Header top-0' style={{ background: '#e9e9e9' }}>
                <div >
                    <ColumnsConfig SelectedProp={allContext} setColumnConfigrationData={setColumnConfigrationData} prepareDynamicData={prepareDynamicData} setLoaded={setLoaded} setCreateListPopup={setCreateListPopup} />
                </div>
            </div >
            <div>
                <section className="Tabl1eContentSection row taskprofilepagegreen">
                    <div className="container-fluid p-0">
                        <section className="TableSection">
                            <div className="container p-0">
                                <div className="Alltable mt-2 ">
                                    <div className="col-sm-12 p-0 smart">
                                        <div>
                                            <div>
                                               {dynamicColumnsValue?.length>0 && <GlobalCommanTable columnSettingIcon={true} tableId="DynamicSmartTablePrepare" setData={setData} AllListId={ContextValue} columns={columns} data={data} callBackData={callBackData} showHeader={true} fixedWidth={true} />}
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </section>
            </div>
            {createListPopup === true && <ListCreatePopup isOpen={createListPopup} createListCallBack={createListCallBack} AllListId={allContext} />}
            {!loaded && <PageLoader />}
        </div>
    )
}
export default SmartTable;