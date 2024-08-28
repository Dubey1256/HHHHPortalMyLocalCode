import * as React from "react";
import { useState, useEffect } from "react";
import { Web } from 'sp-pnp-js';
import { VscClearAll } from 'react-icons/Vsc';
import Tooltip from "../../../globalComponents/Tooltip";
import { Panel, PanelType } from 'office-ui-fabric-react';
import { ColumnDef } from '@tanstack/react-table';
import GlobalCommanTable from '../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable';

const SelectInstitutionPopup = (props: any) => {
    const [institutionData, setInstitutionData] = useState([]);
    const [updateData, setUpdateData]: any = React.useState(props?.updateData)
    let MainSmartwebs = new Web(props?.allListId?.MainsiteUrl);
    let Mainwebs = new Web(props?.allListId?.baseUrl);
    let subsite = props?.allListId?.baseUrl.split('/')[5].toLowerCase()
    useEffect(() => {
        if (props?.updateData != undefined) {
            setUpdateData(props?.updateData)
        }
        InstitutionDetails();
    }, [])
    const InstitutionDetails = async () => {

        try {
            await Mainwebs.lists.getById(props?.allListId?.TeamInstitutionlistIds)
                .items
                .select("Id,Title,FirstName,FullName,WorkCity,WorkCountry")
                .orderBy("Created", true)
                .get().then((data: any) => {
                    let instData = data
                    setInstitutionData(instData);
                });

        } catch (error) {
            console.log("Error user response:", error.message);
        }
    }

    const saveChange = () => {

        props.callBack(updateData);
    }
    const onRenderCustomHeadersmartinfo = () => {
        return (
            <>
                <div className='subheading alignCenter'>
                    Select Institution
                </div>
                <Tooltip ComponentId='1626' />
            </>
        );
    };

    const columns = React.useMemo<ColumnDef<unknown, unknown>[]>(() =>
        [
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
                accessorFn: (row: any) => row?.Title,
                cell: ({ row }: any) => (
                    <a target='_blank'
                    >{row.original.Title}</a>

                ),

                canSort: false,
                placeholder: 'Title',
                header: '',
                id: 'Title',
                size: 150,
            },
            { accessorKey: "WorkCity", placeholder: "WorkCity", header: "", size: 100, },

            { accessorKey: "WorkCountry", placeholder: "WorkCountry", header: "", size: 100, },


        ],
        [institutionData]);
    const callBackData = React.useCallback((data: any) => {
        console.log(data)
        if (data != undefined) {
            let backupdata = JSON.parse(JSON.stringify(updateData));

            backupdata = {
                ...backupdata, ...{
                    Institution: data,

                }
            }
            setUpdateData(backupdata);
        }

    }, [])

    return (
        <>
            <Panel
                onRenderHeader={onRenderCustomHeadersmartinfo}
                isOpen={true}
                type={PanelType.custom}
                customWidth="900px"
                isBlocking={false}
                onDismiss={() => props?.callBack()}
            >

                <div>

                    <div className='Alltable'>
                        <GlobalCommanTable columns={columns} data={institutionData.length > 0 ? institutionData : []} showHeader={false} callBackData={callBackData} />
                    </div >


                    <footer className='pull-right'>
                        <button className='btn btn-primary mx-2'
                            onClick={saveChange}>
                            Save
                        </button>
                        <button className='btn btn-default' onClick={() => props.callBack()}>
                            Cancel
                        </button>
                    </footer>
                </div>

            </Panel>
        </>
    )
}
export default SelectInstitutionPopup;