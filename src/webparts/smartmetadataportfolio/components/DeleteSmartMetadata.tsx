import { Panel, PanelType } from 'office-ui-fabric-react';
import * as React from 'react';
import { Web } from 'sp-pnp-js';
import Tooltip from '../../../globalComponents/Tooltip';
import { useEffect } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import GlobalCommanTable from '../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable';
import PageLoader from '../../../globalComponents/pageLoader';
import * as globalCommon from '../../../globalComponents/globalCommon'
import moment from 'moment';
export default function DeleteSmartMetadataOpenPopup(props: any) {
    let DeleteItemCallBack: any = props.DeleteItemCallBack
    let smartMetadataItem: any = props.modalInstance;
    let AllMetadataChilds: any = props?.modalInstance?.subRows;
    let SitesConfig: any[] = [];
    let allSitesTask: any = [];
    let allCalls: any[] = [];
    const [loaded, setloaded]: any = React.useState(false);
    const [AllSitesTask, setAllSitesTask]: any = React.useState([]);
    const closeDeleteSmartMetaPopup = () => {
        props.CloseDeleteSmartMetaPopup();
    }
    const getSmartMetadataItemsByTaxType = (metadataItems: any, taxType: string) => {
        let Items: any[] = [];
        metadataItems.forEach((taxItem: any) => {
            if (taxItem.TaxType == taxType)
                Items.push(taxItem);
        });
        return Items;
    }
    useEffect(() => {
        loadtaggedTasks();
    }, [props?.modalInstance?.TaxType === "Categories"])
    const loadtaggedTasks = async () => {
        const TaggedTasks: any = []
        setloaded(true);
        SitesConfig = await globalCommon?.loadAllSiteTasks(props?.AllList, undefined);
        SitesConfig.filter((item: any) => {
            if (item.Categories !== null && item.Categories !== undefined) {
                if (props?.modalInstance?.TaxType === "Categories" && item?.Categories === props?.modalInstance?.Title) {
                    item.Modified = (item.Modified !== "" || item.Modified !== undefined) ? moment(item.Modified).format("DD/MM/YYYY") : '';
                    item.Created = (item.Created !== "" || item.Created !== undefined) ? moment(item.Created).format("DD/MM/YYYY") : '';
                    item.DueDate = (item.DueDate !== "" || item.Created !== undefined) ? moment(item.DueDate).format("DD/MM/YYYY") : '';
                    TaggedTasks.push(item)
                }
            }
        })
        if (TaggedTasks.length === 0 || TaggedTasks.length > 1) {
            setloaded(false)
            setAllSitesTask(TaggedTasks);
        }

    }
    const deleteSmartMetadata = async (item: any) => {
        var flag = confirm(`Are you sure, you want to delete this id?`)
        if (flag === true) {
            let web = new Web(props?.AllList?.SPSitesListUrl);
            web.lists.getById(props?.AllList?.SmartMetadataListID).items.getById(item.Id).recycle().then((response: any) => {
                console.log("delete successful")
                if (response) {
                    DeleteItemCallBack(props.AllMetadata, '', smartMetadataItem.TaxType, '');
                    closeDeleteSmartMetaPopup();
                }
            }).catch((error: any) => {
                console.error(error);
            });
        }
    }
    const onRenderDeleteSmartMetadata = () => {
        return (
            <>
                <div className='subheading siteColor'>
                    Delete SmartMetadata - {smartMetadataItem.Title}
                </div>
                <Tooltip ComponentId={'1630'} />
            </>
        );
    };
    const columns = React.useMemo<ColumnDef<unknown, unknown>[]>(() =>
        [{ accessorKey: "TaskID", placeholder: "Site", header: "", size: 10, },
        {
            cell: ({ row }: any) => (
                <a target='_blank' href={`https://hhhhteams.sharepoint.com/sites/HHHH/sp/SitePages/Task-Profile.aspx?taskId=${row?.original.Id}&Site=${row?.original.Title}`}>{row.original.Title}</a>

            ),
            accessorKey: 'Title',
            canSort: false,
            placeholder: 'Title',
            header: '',
            id: 'row.original',
            size: 10,
        },
        { accessorKey: "PercentComplete", placeholder: "Percent Complete", header: "", size: 10, },
        { accessorKey: "Created", placeholder: "Created", header: "", size: 10, },
        { accessorKey: "Modified", placeholder: "Modified", header: "", size: 10, },
        { accessorKey: "DueDate", placeholder: "DueDate", header: "", size: 10, },
        ], [AllSitesTask]);
    return (
        <>
            <div>
                <Panel
                    title="popup-title"
                    isOpen={true}
                    onDismiss={closeDeleteSmartMetaPopup}
                    type={PanelType.custom}
                    isBlocking={false}
                    onRenderHeader={onRenderDeleteSmartMetadata}
                    customWidth="750px"
                >
                    <div className="modal-body bg-f5f5 bdrbox clearfix">
                        <div className="col-sm-12">
                            {AllMetadataChilds ? (
                                <div className="col-sm-12 padL-0">
                                    <h3 className="f-15 mt-5">Item tagged with {smartMetadataItem.Title}</h3>
                                </div>
                            ) : ''}
                            <div>
                                {AllMetadataChilds && (
                                    <div className="col-md-12 mb-10">
                                        <div className="panel panel-default">
                                            <div className="panel-heading backgrnd_clrwhite">
                                                <h3 className="panel-title">
                                                    <span> All Tagged Childs</span>
                                                </h3>
                                            </div>
                                            <div className="panel-body">
                                                <div className="form-group">
                                                    <div id="table-wrapper">
                                                        <div id="table-scroll">
                                                            <table className="table">
                                                                <tbody>
                                                                    {AllMetadataChilds.map((item: any) => (
                                                                        <tr>
                                                                            <td className="pad8">
                                                                                <span style={{ cursor: 'pointer' }}>{item.Title}</span>
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div>
                                {AllSitesTask && (
                                    <div className="col-md-12 mb-10">
                                        <div className="panel panel-default">
                                            <div className="panel-heading backgrnd_clrwhite">
                                                <h3 className="panel-title">
                                                    <span> All Tagged Tasks</span>
                                                </h3>
                                            </div>
                                            <div className="panel-body">
                                                <div className="form-group">
                                                    {AllSitesTask &&
                                                        <GlobalCommanTable columns={columns} data={AllSitesTask} showHeader={true} callBackData={props.DeleteItemCallBack} />
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className='applyLeavePopup'>
                        <div className="modal-footer border-0 px-0">
                            <button className='btnCol btn btn-primary mx-2 mt-0' onClick={() => deleteSmartMetadata(smartMetadataItem)}> Delete </button>
                            <button className='btn btn-default m-0' onClick={() => closeDeleteSmartMetaPopup()}> Cancel</button>
                        </div>
                    </div>
                    {
                        loaded ? <PageLoader /> : ''
                    }
                </Panel>
            </div>
        </>
    );
}