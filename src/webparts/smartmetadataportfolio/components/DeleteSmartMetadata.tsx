import { Panel, PanelType } from 'office-ui-fabric-react';
import * as React from 'react';
import { Web } from 'sp-pnp-js';
import Tooltip from '../../../globalComponents/Tooltip';
import { useEffect } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import GlobalCommanTable from '../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable';
import PageLoader from '../../../globalComponents/pageLoader';
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
    const LoadAllMetaData = async () => {
        try {
            SitesConfig = [];
            const web = new Web(props?.AllList?.SPSitesListUrl);
            const query = `(TaxType eq 'Categories') or (TaxType eq 'Sites')`
            const select = `Id,Title,TaxType,listId`;
            const AllMetaData = await web.lists.getById(props.AllList.SmartMetadataListID).items.select(select).filter(query).getAll()
            SitesConfig = getSmartMetadataItemsByTaxType(AllMetaData, 'Sites');
            for (var i = 0; i < SitesConfig.length; i++) {
                if (SitesConfig[i].listId == undefined || SitesConfig[i].Title == 'Master Tasks') {
                    SitesConfig.splice(i, 1);
                    i--;
                }
            }
            loadAllSitesTask(props?.modalInstance);
        } catch (error: any) {
            console.error(error);
        };
    }
    const loadAllSitesTask = async (Item: any) => {
        try {
            allCalls = [];
            allCalls = SitesConfig.map((site) => {
                let web = new Web(props.AllList.SPSitesListUrl);
                return web.lists.getById(site.listId).items.select(`Id,Title,SharewebTaskLevel1No,SharewebTaskLevel2No,SharewebTaskType/Id,SharewebTaskType/Title,Component/Id,Services/Id,Events/Id,PercentComplete,ComponentId,ServicesId,EventsId,Priority_x0020_Rank,DueDate,Created,TaskID,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title,ParentTask/Id,ParentTask/Title,SharewebCategories/Id,SharewebCategories/Title,AssignedTo/Id,AssignedTo/Title,Team_x0020_Members/Id,Team_x0020_Members/Title,Responsible_x0020_Team/Id,Responsible_x0020_Team/Title`).expand('AssignedTo', 'Author', 'Editor', 'Component', 'Services', 'Events', 'Team_x0020_Members', 'ParentTask', 'SharewebCategories', 'Responsible_x0020_Team', 'SharewebTaskType')
                    .getAll();
            });
            setloaded(true);
            const success = await Promise.all(allCalls);
            allSitesTask = [];
            success.forEach((val) => {
                val.forEach((item: any) => {
                    if (item?.SharewebCategories.length > 0) {
                        item.SharewebCategories.forEach((cate: any) => {
                            if (cate.Id === Item.Id) {
                                item.Created = item.Created !== null ? moment(item?.Created).format("DD/MM/YYYY") : '';
                                item.DueDate = item.DueDate !== null ? moment(item?.DueDate).format("DD/MM/YYYY") : '';
                                item.Modified = item.Modified !== null ? moment(item?.Modified).format("DD/MM/YYYY") : '';
                                if (item.ComponentId.length > 0) {
                                    item['Portfoliotype'] = 'Component';
                                } else if (item.ServicesId.length > 0) {
                                    item['Portfoliotype'] = 'Service';
                                } else if (item.EventsId.length > 0) {
                                    item['Portfoliotype'] = 'Event';
                                }
                                if (item.PercentComplete != undefined) {
                                    item.PercentComplete = parseInt((item.PercentComplete * 100).toFixed(0));
                                } else if (item.PercentComplete != undefined)
                                    item.PercentComplete = parseInt((item.PercentComplete * 100).toFixed(0));
                                else
                                    item.PercentComplete = 0;
                                if (item.ComponentId.length > 0) {
                                    item.Portfoliotype = 'Component';
                                } else if (item.ServicesId.length > 0) {
                                    item.Portfoliotype = 'Service';
                                } else if (item.EventsId.length > 0) {
                                    item.Portfoliotype = 'Event';
                                }
                                if (item.siteType != undefined && item.siteType == 'Offshore Tasks') {
                                    item.Companytype = 'Offshoretask';
                                } else {
                                    item.Companytype = 'Alltask';
                                }
                                if (item.Companytype == 'Alltask') {
                                    allSitesTask.push(item);
                                }
                            }
                        })
                    } else {
                        if (item.SharewebCategories[0]?.Id === Item.Id) {
                            item.Created = item.Created !== null ? moment(item?.Created).format("DD/MM/YYYY") : '';
                            item.DueDate = item.DueDate !== null ? moment(item?.DueDate).format("DD/MM/YYYY") : '';
                            item.Modified = item.Modified !== null ? moment(item?.Modified).format("DD/MM/YYYY") : '';
                            if (item.ComponentId.length > 0) {
                                item['Portfoliotype'] = 'Component';
                            } else if (item.ServicesId.length > 0) {
                                item['Portfoliotype'] = 'Service';
                            } else if (item.EventsId.length > 0) {
                                item['Portfoliotype'] = 'Event';
                            }
                            if (item.PercentComplete != undefined) {
                                item.PercentComplete = parseInt((item.PercentComplete * 100).toFixed(0));
                            } else if (item.PercentComplete != undefined)
                                item.PercentComplete = parseInt((item.PercentComplete * 100).toFixed(0));
                            else
                                item.PercentComplete = 0;
                            if (item.ComponentId.length > 0) {
                                item.Portfoliotype = 'Component';
                            } else if (item.ServicesId.length > 0) {
                                item.Portfoliotype = 'Service';
                            } else if (item.EventsId.length > 0) {
                                item.Portfoliotype = 'Event';
                            }
                            if (item.siteType != undefined && item.siteType == 'Offshore Tasks') {
                                item.Companytype = 'Offshoretask';
                            } else {
                                item.Companytype = 'Alltask';
                            }
                            if (item.Companytype == 'Alltask') {
                                allSitesTask.push(item);
                            }
                        }
                    }
                });
            })
            setAllSitesTask(allSitesTask);
            if (allSitesTask.length === 0 || allSitesTask.length > 0)
                setloaded(false)
        }
        catch (error) {
            console.error(error);
            // Handle errors
        }
    }
    const deleteSmartMetadata = async (item: any) => {
        var flag = confirm(`Are you sure, you want to delete this id?`)
        if (flag === true) {
            let web = new Web(props.AllList.SPSitesListUrl);
            web.lists.getById(props.AllList.SmartMetadataListID).items.getById(item.Id).recycle().then((response: any) => {
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
    useEffect(() => {
        LoadAllMetaData();
    }, []);
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
                            {/* <button className='btnCol btn btn-primary mx-2 mt-0' onClick={() => deleteTypeSmartmetadta(smartMetadataItem)}> Archive and Delete </button> */}
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