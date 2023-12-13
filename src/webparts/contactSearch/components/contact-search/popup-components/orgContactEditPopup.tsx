import * as React from "react";
import { useState, useEffect } from "react";
import { Web } from 'sp-pnp-js';
import { VscClearAll } from 'react-icons/Vsc';
import Tooltip from "../../../../../globalComponents/Tooltip";
import { Panel, PanelType } from 'office-ui-fabric-react';
import { myContextValue } from '../../../../../globalComponents/globalCommon'
import { ColumnDef } from '@tanstack/react-table';
import GlobalCommanTable from "../../../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable";

const orgContactEditPopup = (props: any) => {
    const myContextData2: any = React.useContext<any>(myContextValue)
    const [institutionData, setInstitutionData] = useState([]);
    // const [searchedData, setSearchedData] = useState([]);
    // const [searchKeys, setSearchKeys] = useState({
    //     FullName: '', City: '', Country: ''
    // })
    const [updateData,setUpdateData]:any=React.useState(props?.updateData)

   
    useEffect(() => {
        if(props?.updateData!=undefined){
            setUpdateData(props?.updateData) 
        }
        if(myContextData2?.allSite?.MainSite){
            InstitutionDetails();
        }else{
            setInstitutionData(myContextData2?.InstitutionAllData);
            // setSearchedData(myContextData2?.InstitutionAllData);   
        }
        
    }, [])
    const InstitutionDetails = async () => {
        try {
            let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH");
            await web.lists.getById('9f13fd36-456a-42bc-a5e0-cd954d97fc5f')
                .items
                .select("Id,FirstName,ItemType,FullName,WorkCity,WorkCountry")
                .orderBy("Created", true)
                .get().then((data: any) => {
                    let instData = data.filter((instItem: any) => instItem.ItemType == "Institution")
                    setInstitutionData(instData);
                    // setSearchedData(instData);
                });

        } catch (error) {
            console.log("Error user response:", error.message);
        }
    }
    // const searchFunction = (e: any, item: any) => {
    //     let Key: any = e.target.value.toLowerCase();
    //     if (item == 'FullName') {
    //         setSearchKeys({ ...searchKeys, FullName: Key });
    //         const data: any = {
    //             nodes: institutionData?.filter((items: any) =>
    //                 items.FullName?.toLowerCase().includes(Key)
    //             ),
    //         };
    //         setSearchedData(data.nodes);
    //         if (Key.length == 0) {
    //             setSearchedData(institutionData);
    //         }
    //     }
    //     if (item == 'City') {
    //         setSearchKeys({ ...searchKeys, City: Key });
    //         const data: any = {
    //             nodes: institutionData?.filter((items: any) =>
    //                 items.WorkCity?.toLowerCase().includes(Key)
    //             ),
    //         };
    //         setSearchedData(data.nodes);
    //         if (Key.length == 0) {
    //             setSearchedData(institutionData);
    //         }
    //     }
    //     if (item == 'Country') {
    //         setSearchKeys({ ...searchKeys, Country: Key });
    //         const data: any = {
    //             nodes: institutionData?.filter((items: any) =>
    //                 items.WorkCountry?.toLowerCase().includes(Key)
    //             ),
    //         };
    //         setSearchedData(data.nodes);
    //         if (Key.length == 0) {
    //             setSearchedData(institutionData);
    //         }
    //     }
    // }
    // const selectOrgStatus = (item: any, index: any) => {
    //     let backupdata=JSON.parse(JSON.stringify(updateData));

    //    backupdata={
    //   ...backupdata,...{
    //     Institution: item,
           
    //    }
    // }
    //    setUpdateData(backupdata);
    // }
    // const ClearFilter = () => {
    //     setSearchedData(institutionData);
    //     setSearchKeys({
    //         FullName: '', City: '', Country: ''
    //     })
    // }
    const saveChange = () => {
     
        props.callBack(updateData);
    }
    const onRenderCustomHeadersmartinfo = () => {
        return (
            <>
                <div className='subheading alignCenter'>
                    Select Organization
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
            accessorFn: (row: any) => row?.FullName,
            cell: ({ row }: any) => (
                <a target='_blank'
                    // href={`${allListId?.siteUrl}/SitePages/Contact-Profile.aspx?contactId=${row?.original.Id}`}
                >{row.original.FullName}</a>

            ),

            canSort: false,
            placeholder: 'Name',
            header: '',
            id: 'FullName',
            size: 150,
        },
        { accessorKey: "WorkCity", placeholder: "WorkCity", header: "", size: 100, },
       
        { accessorKey: "WorkCountry", placeholder: "WorkCountry", header: "", size: 100, },
       
        
    ],
    [institutionData]);
    const callBackData=React.useCallback((data:any)=>{
            console.log(data)
            if(data!=undefined){
                let backupdata=JSON.parse(JSON.stringify(updateData));

                backupdata={
               ...backupdata,...{
                 Institution: data,
                    
                }
             }
                setUpdateData(backupdata);
            }
           
    },[])
    
    return (
        <>
            <Panel
                onRenderHeader={onRenderCustomHeadersmartinfo}
                isOpen={true}
                type={PanelType.custom}
                customWidth="1280px"
                isBlocking={false}
                onDismiss={() => props?.callBack()}
            >

                <div>
                   
                    <div className='Alltable'>
                    <GlobalCommanTable columns={columns} data={institutionData} showHeader={false}callBackData={callBackData}/>
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
export default orgContactEditPopup;