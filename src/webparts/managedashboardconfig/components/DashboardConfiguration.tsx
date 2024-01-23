import * as React from 'react';
import { Web } from 'sp-pnp-js';
import * as globalCommon from '../../../globalComponents/globalCommon';
import GlobalCommanTable from '../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable';
import { ColumnDef } from '@tanstack/react-table';
import AddConfiguration from '../../../globalComponents/AddConfiguration';
const DashboardConfiguration = (props: any) => {
    const params = new URLSearchParams(window.location.search);
    let DashboardId: any = params.get('DashBoardId');
    const [WebpartConfig, setWebpartConfig] = React.useState<any>([]);
    const [IsOpenPopup, setIsOpenPopup] = React.useState<any>(false);
    const [EditItem, setEditItem] = React.useState<any>(undefined);

    const LoadAdminConfiguration = async () => {
        const web = new Web(props?.props?.Context?._pageContext?._web?.absoluteUrl);
        await web.lists.getById(props?.props?.AdminConfigurationListId).items.select("Title", "Id", "Value", "Key", "Configurations").filter("Key eq 'DashBoardConfigurationId'").getAll().then((data: any) => {
            if (data != undefined && data?.length > 0) {
                if (DashboardId != undefined && DashboardId != '')
                    data = data?.filter((config: any) => config?.Value == DashboardId);
                data?.forEach((config: any) => {
                    if (config?.Configurations != undefined && config?.Configurations != '')
                        config.Configurations = globalCommon.parseJSON(config?.Configurations)
                })
                setWebpartConfig(data)
            }
        }).catch((err: any) => {
            console.log(err);
        })
    }
    React.useEffect(() => {
        LoadAdminConfiguration()
    }, []);
    const EditConfig = (item: any) => {
        setEditItem(item)
        setIsOpenPopup(true);
    }
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
                accessorFn: (row) => row?.Title,
                cell: ({ row }) => (
                    <div className="alignCenter">
                        <a className="text-content hreflink" title={row?.original?.Title} data-interception="off" target="_blank"
                            href={props?.props?.Context?._pageContext?._web?.absoluteUrl + "/SitePages/Dashboard.aspx?DashBoardId=" + row?.original?.Value}>
                            {row?.original?.Title}
                        </a>
                    </div>
                ),
                id: "Title",
                placeholder: "Title",
                resetColumnFilters: false,
                header: "",
                size: 50,
            },
            {
                accessorFn: (row) => row?.Value,
                cell: ({ row }) => (
                    <div className="alignCenter">
                        <a className="text-content hreflink" title={row?.original?.Value} data-interception="off" target="_blank"
                            href={props?.props?.Context?._pageContext?._web?.absoluteUrl + "/SitePages/Dashboard.aspx?DashBoardId=" + row?.original?.Value}>
                            {row?.original?.Value}
                        </a>
                    </div>
                ),
                id: "Value",
                placeholder: "Dashboard_Id",
                resetColumnFilters: false,
                header: "",
                size: 40,
            },
            {
                cell: ({ row }) => (
                    <>
                        <a className="alignCenter" data-bs-toggle="tooltip" data-bs-placement="auto" title={'Edit ' + `${row.original.Title}`}  >
                            {" "}
                            <span className="svg__iconbox svg__icon--edit" onClick={(e) => EditConfig(row?.original)} ></span>
                        </a>
                    </>
                ),
                id: "row?.original.Id",
                canSort: false,
                placeholder: "",
                header: "",
                size: 30,
            },
        ],
        [WebpartConfig]
    );
    const callBackData = React.useCallback((checkData: any) => {
    }, []);
    const AddNewConfig = () => {
        setIsOpenPopup(true);
    }
    const CloseConfigPopup = (IsLoad: any) => {
        setEditItem(undefined)
        setIsOpenPopup(false);
        if (IsLoad === true)
            LoadAdminConfiguration()

    }
    return (
        <>
            <h3 className="heading">Dashboard Landing Page
            </h3>
            <div ><a className="pull-right empCol hreflink" onClick={(e) => AddNewConfig()}> Add New Dashboard </a>
            </div>
            <div className="Alltable maXh-300" style={{ height: "300px" }}>
                {WebpartConfig?.length > 0 && (
                    <GlobalCommanTable wrapperHeight="87%" showHeader={true} portfolioColor={'#000066'} columns={columns} data={WebpartConfig} callBackData={callBackData} />
                )}
            </div>
            {IsOpenPopup && <AddConfiguration props={props?.props} EditItem={EditItem} IsOpenPopup={IsOpenPopup} CloseConfigPopup={CloseConfigPopup} />}
        </>
    );
};
export default DashboardConfiguration;