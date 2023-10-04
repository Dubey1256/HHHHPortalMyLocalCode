import React, { useEffect, useState } from 'react'
import { Web } from "sp-pnp-js";
import GlobalCommanTable from "../../../globalComponents/GlobalCommanTable";
import { ColumnDef } from "@tanstack/react-table"
export default function ParentportfolioPage(props: any) {
    const [listData, setListData] = useState([])
    const getComponentItem = () => {
        let web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/SP/');
        web.lists.getById(props.props.MasterTaskListID).items.select("Id","PortfolioStructureID", "Title", "ClientCategory/Id", "ClientCategory/Title", "HelpStatus", "DueDate", "Item_x0020_Type", "Parent/Id", "Parent/Title").expand("Parent,ClientCategory").filter("(Item_x0020_Type eq 'SubComponent' or Item_x0020_Type eq 'Feature') and Parent/Id eq null").top(4999).getAll().then((response: any) => {
            response.map((item: any) => {
                if (item.ClientCategory != undefined && item.ClientCategory.length > 0) {
                    item.ClientCategoryTitle = item.ClientCategory[0].Title;
                }
            })
            setListData(response);
        }).catch((error: any) => {
            console.error(error);
        });
    }
    const columns = React.useMemo<ColumnDef<any, unknown>[]>(() =>
        [
            {
             accessorKey: "",
             placeholder: "",
             hasExpanded: false,
             id:"row.original",
             size:5,
         },
            {
                cell: (({row}) =>(
                    <a target='blank' href=''>{row.original.Item_x0020_Type === "SubComponent" ?<div className="alignCenter"><div title="SubComponent" className="Dyicons" style={{backgroundColor: "rgb(0, 0, 102)"}}>S</div></div> : <div className="alignCenter"><div title="feature" className="Dyicons" style={{backgroundColor: "rgb(0, 0, 102)"}}>F</div></div>}
                    </a>
                )),
                accessorKey: "",
                placeholder: "",
                 id:"Item_x0020_Type",
                 header: "",
                 size: 30,
            },
            { 
                accessorKey: "Id",
                 placeholder: "Id",
                 id:"Id",
                  header: "",
                   size: 50,
            },
            {
                cell: (({ row }) => (
                    <a data-interception="off" target='_blank' href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP//SitePages/Portfolio-Profile.aspx?taskId=${row.original.Id}`}>
                        {row.original.Title}
                    </a>
                )),
                accessorKey: "Title",
                placeholder: "Title",
                id: "Title",
                header: "",
                size: 90,
            },
            {
                accessorKey: "Item_x0020_Type",
                placeholder: "Item_x0020_Type",
                id:"Item_x0020_Type",
                header: "",
                size: 90,
            },
            {
                accessorKey: "ClientCategoryTitle",
                placeholder: "ClientCategory",
                id:"ClientCategoryTitle",
                header: "",
                size: 70,
            },
            {
                accessorKey: "HelpStatus",
                placeholder: "Status",
                id: "HelpStatus",
                header: "",
                size: 50,
            },
            {
                accessorKey: "DueDate",
                placeholder: "Due Date",
                id: "DueDate",
                header: "",
                size: 70,
            },
        ], [listData]);
    useEffect(() => {
        getComponentItem();
    }, []);
    const callBackData = React.useCallback((elem: any, getSelectedRowModel: any, ShowingData: any) => {
    }, []);
    return (
        <div>ParentportfolioPage
            {listData && <div>
                <GlobalCommanTable columns={columns} data={listData} showHeader={true} callBackData={callBackData} />
            </div>}
        </div>
    )
}
