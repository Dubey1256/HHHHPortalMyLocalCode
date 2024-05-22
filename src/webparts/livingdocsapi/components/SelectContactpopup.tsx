import * as React from "react";
import { useState, useCallback, useEffect, useMemo } from 'react';
import { Web } from 'sp-pnp-js';
import moment from 'moment';
import { Panel, PanelType } from 'office-ui-fabric-react';
import HtmlEditorCard from "../../../globalComponents/HtmlEditor/HtmlEditor";
import GlobalCommanTable from "../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable";
import { ColumnDef } from "@tanstack/react-table";
let selectedContact:any=[]
const SelectContactpopup = (props: any) => {
    const [Selectcontact, setSelectcontact] = useState(true)
    const allContactData = props?.allContactData
    const closeSelectContactPopup = ()=>{
        setSelectcontact(false)
        props.closeSelectContactpopup()
    }
    const columns = React.useMemo<ColumnDef<any, unknown>[]>(
        () => [
            {
                accessorKey: "",
                placeholder: "",
                hasCheckbox: true,
                hasCustomExpanded: false,
                hasExpanded: false,
                isHeaderNotAvlable: true,
                size: 25,
                id: 'Id',
            },
            {
                cell: ({ row }: any) => (
                    <>
                        <img className='workmember ' src={`${row?.original?.ItemCover != null && row?.original?.ItemCover?.Url != null ? row?.original?.ItemCover?.Url : `https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg`}`} />
                    </>
                ),
                accessorFn: '',
                canSort: false,
                placeholder: '',
                header: '',
                id: 'row.original',
                size: 25,
            },
            {
                accessorKey: "Title",
                placeholder: "Title",
                header: "",
                id: "Title",
                cell: ({ row }: any) => (
                    <>
                        <a target='_blank' data-interception="off"
                            href={`/Sitepages/Contact-Profile.aspx?contactId=${row?.original.Id}`}
                        >{row.original.Title}</a>
                    </>
                ),
            },
            {
                accessorKey: "Company", placeholder: "Institution", header: "", id: "Company",
                cell: ({ row }: any) => (
                    <>
                        <a>{row?.original?.Company}</a>
                    </>
                ),
            },
            {
                accessorKey: "Email", placeholder: "Email", header: "", id: "Email", size: 55,
                cell: ({ row }: any) => (
                    <>
                        <a>{row?.original?.Email}</a>
                    </>
                ),
            },

            {
                accessorKey: "WorkCity", placeholder: "City", header: "", id: "WorkCity",
                cell: ({ row }: any) => (
                    <>
                        <a>{row?.original?.WorkCity}</a>
                    </>
                ),
            },

            {
                accessorKey: "WorkCountry", placeholder: "Country", header: "", id: "WorkCountry",
                cell: ({ row }: any) => (
                    <>
                        <a>{row?.original?.WorkCountry}</a>
                    </>
                ),
            }
        ],
        [allContactData]
    );
    const SaveSelectContactPopup = ()=>{
        setSelectcontact(false)
        props.selectCallback(selectedContact)
    }
    const callBackData = React.useCallback((elem: any, getSelectedRowModel: any, ShowingData: any) => {
        selectedContact = elem;
        console.log(elem)
    }, []);
    const onRenderCustomHeadersmartinfo = () => {
        return (
            <>
                <div className="subheading">
                    Select Contact
                </div>
                {/* <Tooltip ComponentId='696' /> */}
            </>
        );
    };
    const onRenderCustomFootersmartinfo = () => {
        return (
            <footer className='bg-f4 fixed-bottom'>
                <div className="px-4 py-2">
                    <div className="text-end">
                        <button className="btn btn-primary ms-1 mx-2" onClick={() => SaveSelectContactPopup()}>Save</button>
                        <button onClick={() => closeSelectContactPopup()} className="btn btn-default">Cancel</button>
                    </div>
                </div>
            </footer>
        )
    }
    return (
        <>
            <Panel
                onRenderHeader={onRenderCustomHeadersmartinfo}
                isOpen={Selectcontact}
                type={PanelType.custom}
                customWidth="800px"
                isBlocking={false}
                isFooterAtBottom={true}
                onRenderFooter={onRenderCustomFootersmartinfo}
                onDismiss={() => closeSelectContactPopup()}
            >
                <div className="container">                 
                    <div className="tab-pane show active" id="Contacts" role="tabpanel" aria-labelledby="Contacts">
                        <div>
                            <div className="TableContentSection">
                                <div className='Alltable mt-2 mb-2'>
                                    <div className='col-md-12 p-0 '>
                                        <GlobalCommanTable fixedWidthTable={true}  callBackData={callBackData} columns={columns} customHeaderButtonAvailable={true}  data={allContactData} hideTeamIcon={true} hideOpenNewTableIcon={true} showHeader={true} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </Panel>
        </>
    )
}
export default SelectContactpopup;