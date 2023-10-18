import React, { useEffect, useState } from 'react'
import { Web } from "sp-pnp-js";
import GlobalCommanTable from "../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable";
import EditComponent from "../../../webparts/EditPopupFiles/EditComponent";
import ShowClintCatogory from '../../../globalComponents/ShowClintCatogory';
import { ColumnDef } from "@tanstack/react-table"
export default function ParentportfolioPage(props: any) {
    const [listData, setListData] = useState([]);
    const [editValue, setEditValue] = useState<any>([]);
    const [editPopUpOpen, setEditPopUpOpen] = useState(false);
    const [listIds, setlistIds] = React.useState<any>([]);
    const [Portfoliotyped, setPortfoliotyped] = useState([]);
    var storeAllMetaData: any
    var baseUrl = props?.props?.context?.pageContext?.web?.absoluteUrl;
    const getComponentItem = () => {
        const sitesId = {
            TaskUsertListID: props?.props?.TaskUsertListID,
            SmartMetadataListID: props?.props?.SmartMetadataListID,
            MasterTaskListID: props?.props.MasterTaskListID,
            DocumentsListID: props?.props?.DocumentsListID,
            TaskTypeID: props?.props?.TaskTypeID,
            SmartHelptListID: props?.props?.SmartHelptListID,
            PortFolioTypeID: props?.props?.PortFolioTypeID,
            SiteCompostion: props?.props?.isShowSiteCompostion,
            siteUrl: baseUrl,
            Context: props?.props?.context
        }
        setlistIds(sitesId)
        const LoadAllMetaDataAndTasks = () => {
            let web = new Web(baseUrl);
            web.lists.getById(props?.props?.SmartMetadataListID).items.getAll().then((response: any) => {
                storeAllMetaData = response;
            })
        }
        LoadAllMetaDataAndTasks();
        let web = new Web(baseUrl);
        web.lists.getById(props?.props?.MasterTaskListID).items.select("Id", "Title", "ClientCategory/Id", "ClientCategory/Title", "HelpStatus", "DueDate", "Item_x0020_Type", "PortfolioType/Id", "PortfolioType/Title", "Parent/Id", "Parent/Title").expand("Parent,ClientCategory,PortfolioType").top(4999).getAll().then((response: any) => {
            response = response?.filter((itemFilter: any) => { return (itemFilter?.Item_x0020_Type == 'SubComponent' || itemFilter?.Item_x0020_Type == 'Feature') })
            var data: any = []
            response.map((item: any) => {
                if (item?.Parent == null) {
                    if (item?.ClientCategory != undefined && item?.ClientCategory?.length > 0) {
                        item.ClientCategoryTitle = item.ClientCategory[0].Title;
                    }
                    data?.push(item)
                }
            })
            setListData(data);

        }).catch((error: any) => {
            console.error(error);
        });
    }
    const closeEditComponent = (item: any) => {
        setEditPopUpOpen(false)
        getComponentItem();
    }
    const editComponentPopUp = (editComponentValue: any) => {
        setEditPopUpOpen(true)
        setPortfoliotyped(editComponentValue?.PortfolioType?.Title)
        setEditValue(editComponentValue);
    }
    const columns = React.useMemo<ColumnDef<any, unknown>[]>(() =>
        [
            {
                accessorKey: "",
                placeholder: "",
                hasExpanded: false,
                id: "row.original",
                resetColumnFilters: false,
                resetSorting: false,
                size: 5,
            },
            {
                cell: (({ row }) => (
                    <a target='blank' href=''>{row?.original?.Item_x0020_Type === "SubComponent" ? <div className="alignCenter"><div title="SubComponent" className="Dyicons" style={{ backgroundColor: "rgb(0, 0, 102)" }}>S</div></div> : <div className="alignCenter"><div title="feature" className="Dyicons" style={{ backgroundColor: "rgb(0, 0, 102)" }}>F</div></div>}
                    </a>
                )),
                accessorKey: "",
                placeholder: "",
                id: "Item_x0020_Type",
                header: "",
                size: 30,
            },
            {
                accessorFn: (row) => row?.Id,
                placeholder: "Id",
                id: "Id",
                resetColumnFilters: false,
                resetSorting: false,
                header: "",
                size: 50,
            },
            {
                cell: (({ row }) => (
                    <a data-interception="off" target='_blank' href={`${baseUrl}/SitePages/Portfolio-Profile.aspx?taskId=${row?.original?.Id}`}>
                        {row?.original?.Title}
                    </a>
                )),
                accessorFn: (row) => row?.Title,
                placeholder: "Title",
                id: "Title",
                resetColumnFilters: false,
                resetSorting: false,
                header: "",
                // size: 150,
            },
            {
                accessorFn: (row) => row?.Item_x0020_Type,
                placeholder: "Item Type",
                id: "Item_x0020_Type",
                resetColumnFilters: false,
                resetSorting: false,
                header: "",
                size: 90,
            },
            {
                cell: (({ row }) => (
                    <ShowClintCatogory clintData={row?.original} AllMetadata={storeAllMetaData} />
                )),
                accessorFn: (row) => row?.ClientCategoryTitle,
                placeholder: "ClientCategory",
                id: "ClientCategoryTitle",
                resetColumnFilters: false,
                resetSorting: false,
                header: "",
                size: 70,

            },
            {
                accessorFn: (row) => row?.HelpStatus,
                placeholder: "Status",
                id: "HelpStatus",
                resetColumnFilters: false,
                resetSorting: false,
                header: "",
                size: 50,
            },
            {
                accessorFn: (row) => row?.DueDate,
                placeholder: "Due Date",
                id: "DueDate",
                resetColumnFilters: false,
                resetSorting: false,
                header: "",
                size: 70,
            },
            {
                accessorKey: '',
                canShort: false,
                placeholder: '',
                header: '',
                id: 'row.original',
                size: 30,
                cell: ({ row, getValue }) => (
                    <div className='text-end'>
                        <a onClick={() => editComponentPopUp(row?.original)}><span title="Edit Task" className='alignIcon svg__iconbox svg__icon--edit hreflink'></span></a>
                        {getValue}
                    </div>
                ),
            },
        ], [listData]);
    useEffect(() => {

        getComponentItem();
    }, []);
    const callBackData = React?.useCallback((elem: any, getSelectedRowModel: any, ShowingData: any) => {
    }, []);

    return (
        <section className='TableSection'>
            <div className='Alltable mt-2'>
                <div className='smart'>
                    <div className='wrapper'>
                        <div className="col-sm-12 clearfix mb-2">
                            <h2 className="d-flex justify-content-between align-items-center siteColor serviceColor_Active">
                                <div style={{ color: 'rgb(0, 0, 102)' }}>UnTag Parent Portfolio</div>
                            </h2>
                        </div>
                        {listData && <div>
                            <GlobalCommanTable columns={columns} data={listData} showHeader={true} callBackData={callBackData} />
                            {editPopUpOpen ? <EditComponent item={editValue} SelectD={listIds} Calls={closeEditComponent} portfolioTypeData={Portfoliotyped} /> : ''}
                        </div>}
                    </div>
                </div>
            </div>
        </section>
    )
}
