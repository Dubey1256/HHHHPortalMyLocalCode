import React, { useEffect, useState } from 'react'
import { Web } from 'sp-pnp-js';
import GlobalCommanTable from "./GlobalCommanTable";
import { ColumnDef } from '@tanstack/react-table';
import moment from 'moment';
let ParentTopNavigation: any = []
export default function SiteStructureTool(Props: any) {
    //#region Required Varibale on Page load BY PB
    const PageContext = Props.Selectedprops;
    const [SiteStructure, setSiteStructure] = useState([]);
    //#endregion
    //#region code to load All Documents By PB
    const LoadTopNavigation = () => {
        let web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH')
        web.lists.getById(PageContext.TopNavigationListID).items.select('ID', 'Id', 'Title', 'href', 'ParentID', 'Order0', 'SortOrder', 'ownersonly', 'IsVisible', 'Modified', 'Created', 'Author/Id', 'Author/Title', 'Editor/Id', 'Editor/Title')
            .expand('Editor,Author')
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
                        <a target="_blank" href={row?.original?.href}>
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
                    <a title="Edit"><span title="Edit Task" className="svg__iconbox svg__icon--edit hreflink me-1"></span></a>
                    <a title="Delete"><span title="Remove Task" className="svg__iconbox svg__icon--cross dark hreflink"></span></a>
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
                <div className='row'>
                    <div className='col-sm-3 text-primary'>
                        <h3 className="heading">SiteStructureManagement
                        </h3>
                    </div>
                </div>
            </section>
            {SiteStructure && <div>
                <div className="TableSection">
                    <div className='Alltable mt-2'>
                        <div className='col-md-12 p-0 smart'>
                            <GlobalCommanTable columns={columns} data={SiteStructure} showHeader={true} callBackData={callBackData} />
                        </div>
                    </div>
                </div>
            </div>}
        </>
    )
}


