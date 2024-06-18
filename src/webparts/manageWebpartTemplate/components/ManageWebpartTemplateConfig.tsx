import React, { useEffect, useState } from "react";
import { Web } from 'sp-pnp-js';
import * as globalCommon from '../../../globalComponents/globalCommon';
import { ColumnDef } from "@tanstack/react-table";
import GlobalCommanTable from "../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable";
import AddEditWebpartTemplate from "../../../globalComponents/AddEditWebpartTemplate";
const ManageWebpartTemplateConfig = (props: any) => {
    const [WebpartConfig, setWebpartConfig] = useState<any>([]);
    const [IsOpenPopup, setIsOpenPopup] = React.useState<any>(false);
    const [EditItem, setEditItem] = React.useState<any>(undefined);
    try {
        $("#spPageCanvasContent").removeClass();
        $("#spPageCanvasContent").addClass("hundred");
        $("#workbenchPageContent").removeClass();
        $("#workbenchPageContent").addClass("hundred");
    } catch (e) {
        console.log(e);
    }
    let AllListId: any = {
        TaskUserListID: props?.AdminConfigurationListId,
        siteUrl: props?.props?.Context?._pageContext?._web?.absoluteUrl,
        Context: props?.props?.Context
    };
    const formatId = (id: number): string => {
        const paddedId = '00' + id;
        return paddedId.slice(-3);
    }
    const LoadAdminConfiguration = async () => {
        let templateDataArray: any = [];
        const web = new Web(props?.props?.Context?._pageContext?._web?.absoluteUrl);
        await web.lists.getById(props?.props?.AdminConfigurationListId).items.select("Title", "Id", "Value", "Key", "Configurations").filter("Key eq 'WebpartTemplate'").getAll().then((data: any) => {
            data?.forEach((config: any) => {
                if (config?.Configurations != undefined && config?.Configurations != '') {
                    let configurations = globalCommon.parseJSON(config?.Configurations);
                    if (configurations != undefined && configurations != '') {
                        if (configurations?.WebpartId == undefined || configurations?.Webpart_Id == '') {
                            configurations.WebpartId = 'WP-' + formatId(configurations?.Id)
                        }
                        configurations.UpdatedId = config.Id
                        templateDataArray.push(configurations);
                    }
                }
            });
            setWebpartConfig(templateDataArray)
        }).catch((err: any) => {
            console.log(err);
        })
    }
    const CloseConfigPopup = (IsLoad: any, Type: any) => {
        setEditItem(undefined)
        setIsOpenPopup(false);
        if (IsLoad === true)
            LoadAdminConfiguration()

    }
    const EditTemplate = (item: any) => {
        setEditItem(item)
        setIsOpenPopup(true);
    }
    const OpenAddTemplatePopup = () => {
        setIsOpenPopup(true);
    }
    const DeleteTemplate = async (Item: any) => {
        let Confirmation = confirm("Do you really want to delete this template?");
        if (Confirmation) {
            let web = new Web(props?.props?.Context?._pageContext?._web?.absoluteUrl);
            await web.lists.getById(props?.props?.AdminConfigurationListId).items.getById(Item?.UpdatedId).recycle();
            LoadAdminConfiguration();
        }
    }
    const callBackData = React.useCallback((checkData: any) => {
    }, []);

    const columns: any = React.useMemo<ColumnDef<any, unknown>[]>(
        () => [
            {
                accessorKey: "",
                placeholder: "",
                hasCheckbox: false,
                hasCustomExpanded: false,
                hasExpanded: false,
                size: 1,
                id: 'Id',
            },
            {
                accessorFn: (row: any) => row?.WebpartId,
                cell: ({ row }: any) => (
                    <div className="alignCenter">
                        {row?.original?.WebpartId}
                    </div>
                ),
                id: "WebpartId",
                placeholder: "Webpart_Id",
                resetColumnFilters: false,
                header: "",
                size: 40,
                isColumnVisible: true,
            },
            {
                accessorFn: (row: any) => row?.WebpartTitle,
                cell: ({ row }: any) => (
                    <div className="alignCenter">
                        {row?.original?.WebpartTitle}
                    </div>
                ),
                id: "WebpartTitle",
                placeholder: "Webpart Title",
                resetColumnFilters: false,
                header: "",
                size: 270,
                isColumnVisible: true,
            },
            {
                accessorFn: (row: any) => row?.DataSource,
                cell: ({ row }: any) => (
                    <div className="alignCenter">
                        <span className="alignIcon  mt--5 ">{row?.original?.DataSource}</span>
                    </div>
                ),
                id: "DataSource",
                placeholder: "Data Source",
                resetColumnFilters: false,
                header: "",
                size: 80,
                isColumnVisible: true,
            },
            {
                accessorFn: (row: any) => row?.selectFilterType,
                cell: ({ row }: any) => (
                    <div className="alignCenter">
                        <span className="alignIcon  mt--5 ">
                            {row?.original?.selectFilterType}
                            {/* <span className=" svg__iconbox svg__icon--info dark"></span> */}
                        </span>
                    </div>
                ),
                id: "Filter",
                placeholder: "Filter",
                resetColumnFilters: false,
                header: "",
                size: 80,
                isColumnVisible: true,
            },
            {
                cell: ({ row }) => (
                    <>
                        <div className='text-end'>
                            <a data-bs-toggle="tooltip" data-bs-placement="auto" title={'Edit ' + `${row?.original?.WebpartTitle}`}  >
                                {" "}
                                <span className="svg__iconbox svg__icon--edit" onClick={(e) => EditTemplate(row?.original)} ></span>
                            </a>
                        </div>
                    </>
                ),
                id: "row?.original.Id",
                canSort: false,
                placeholder: "",
                header: "",
                size: 10,
                isColumnVisible: true,
            },
            {
                cell: ({ row }) => (
                    <>
                        <div className='text-end'>
                            <a data-bs-toggle="tooltip" data-bs-placement="auto" title={'Delete ' + `${row?.original?.WebpartTitle}`}  >
                                {" "}
                                <span className="hreflink ml-auto svg__icon--cross svg__iconbox" onClick={(e) => DeleteTemplate(row?.original)} ></span>
                            </a>
                        </div>
                    </>
                ),
                id: "row?.original.Id",
                canSort: false,
                placeholder: "",
                header: "",
                size: 10,
                isColumnVisible: true,
            },
        ],
        [WebpartConfig]
    );
    const customTableHeaderButtons = (
        <div>
            <button type="button" title="Add" onClick={OpenAddTemplatePopup} className="btnCol btn btn-primary">Add New Webpart</button>
        </div>
    )

    useEffect(() => {
        LoadAdminConfiguration()
    }, []);
    return (
        <>
            <h3 className="heading mb-3">Manage Webpart Template
            </h3>
            <div className='TableSection'>
                <div className="Alltable">
                    <GlobalCommanTable columnSettingIcon={true} tableId="ManageWebpartTemplateID" AllListId={AllListId} customTableHeaderButtons={customTableHeaderButtons} customHeaderButtonAvailable={true} hideOpenNewTableIcon={true} hideTeamIcon={true} showHeader={true} portfolioColor={'#000066'} columns={columns} data={WebpartConfig} callBackData={callBackData} />
                </div>
            </div>
            {IsOpenPopup && <AddEditWebpartTemplate props={props?.props} SingleWebpart={true} EditItem={EditItem} IsOpenPopup={IsOpenPopup} CloseConfigPopup={CloseConfigPopup} />}
        </>
    );
};
export default ManageWebpartTemplateConfig;