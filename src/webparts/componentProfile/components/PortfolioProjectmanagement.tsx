import React, { useState, memo, useEffect, useRef, useCallback, useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import ReactPopperTooltipSingleLevel from '../../../globalComponents/Hierarchy-Popper-tooltipSilgleLevel/Hierarchy-Popper-tooltipSingleLevel';
import GlobalCommanTable from '../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable';
import EditProjectPopup from '../../../globalComponents/EditProjectPopup';
import InlineEditingcolumns from '../../../globalComponents/inlineEditingcolumns';
import * as globalCommon from "../../../globalComponents/globalCommon";
import InfoIconsToolTip from '../../../globalComponents/InfoIconsToolTip/InfoIconsToolTip';
import { Web } from 'sp-pnp-js';
import moment from 'moment';
import SmartPriorityHover from '../../../globalComponents/EditTaskPopup/SmartPriorityHover';
import ShowTaskTeamMembers from '../../../globalComponents/ShowTaskTeamMembers';
import HighlightableCell from '../../../globalComponents/GroupByReactTableComponents/highlight';

const PortfolioProjectManagement = memo((Props: any) => {
    const { AllListId, MyAllData, ContextValue, AllTaskUsers, portfolioTypeDataItem, AllMasterTask } = Props;
    const [ProjectData, setProjectData] = useState([]);
    const [IsComponent, setIsComponent] = useState(false);
    const [CMSToolComponent, setCMSToolComponent] = useState('');
    const [isAddStructureOpen, setIsAddStructureOpen] = useState(false);
    const childRef = useRef<any>();

    useEffect(() => {
        if (Props) {
            getMasterTaskListTasks();
        }
    }, [Props]);

    const EditComponentPopup = useCallback((item: any) => {
        item['siteUrl'] = `${ContextValue?.siteUrl}`;
        item['siteUrl'] = `${AllListId?.siteUrl}`;
        item['listName'] = 'Master Tasks';
        setIsComponent(true);
        setCMSToolComponent(item);
    }, [AllListId, ContextValue]);

    const Call = useCallback(() => {
        getMasterTaskListTasks();
        setIsComponent(false);
        showProgressHide();
    }, []);

    const showProgressBar = () => {
        $('#SpfxProgressbar').show();
    };

    const showProgressHide = () => {
        $('#SpfxProgressbar').hide();
    };

    const findUserByName = useCallback((name: any) => {
        const user = AllTaskUsers.filter(
            (user: any) => user?.AssingedToUser?.Id === name
        );
        return user[0]?.Item_x0020_Cover?.Url || '';
    }, [AllTaskUsers]);

    const getMasterTaskListTasks = async () => {
        let web = new Web(AllListId?.siteUrl);
        let ProjectDetails = await web.lists
            .getById(AllListId?.MasterTaskListID)
            .items.select(
                "Item_x0020_Type", "Title", "PortfolioStructureID", "Id",
                "PercentComplete", "Portfolios/Id", "Portfolios/Title",
                "PriorityRank", "TeamMembers/Title", "TeamMembers/Name",
                "TeamMembers/Id", "AssignedTo/Title", "AssignedTo/Name",
                "AssignedTo/Id", "DueDate", "Priority","Body","Background","Deliverables","Idea"
            )
            .expand("Portfolios", "TeamMembers", "AssignedTo")
            .filter(`(Item_x0020_Type eq 'Project' or Item_x0020_Type eq 'Sprint') and Portfolios/Id eq ${MyAllData?.Id}`)
            .top(4000)
            .get();

        ProjectDetails = ProjectDetails.map((items: any) => {
            items.descriptionsSearch = '';
            items.ShowTeamsIcon = false;
            items.PercentComplete = (items.PercentComplete * 100).toFixed(0);
            items.siteUrl = AllListId?.siteUrl;
            items.listId = AllListId?.MasterTaskListID;
            items.AssignedUser = [];
            items.siteType = "Project";
            items.createdImg = findUserByName(items?.Author?.Id);
            items.TeamMembersSearch = '';
            if (items.AssignedTo) {
                items.AssignedTo.forEach((taskUser: any) => {
                    AllTaskUsers.forEach((user: any) => {
                        if (user.AssingedToUserId == taskUser.Id && user?.Title) {
                            items.TeamMembersSearch += ` ${user?.Title}`;
                        }
                    });
                });
            }
            items.TaskTypeValue = items?.TaskCategories?.map((val: any) => val.Title).join(",") || '';
            items.Categories = items.TaskTypeValue;
            items.subRows = ProjectDetails.filter((child: any) => child?.Item_x0020_Type === "Sprint" && child?.Parent?.Id === items?.Id);
            items.descriptionsSearch = globalCommon.portfolioSearchData(items);
            items.commentsSearch = items?.Comments?.replace(/(<([^>]+)>)/gi, "").replace(/\n/g, '') || '';
            items['TaskID'] = items?.PortfolioStructureID;
            items.DisplayDueDate = items.DueDate ? moment(items.DueDate).format('DD/MM/YYYY') : "";
            items.DisplayCreateDate = items.Created ? moment(items.Created).format("DD/MM/YYYY") : "";
            return items;
        });
        setProjectData(ProjectDetails);
    };

    const CallBack = useCallback((item: any, type: string) => {
        if (type === 'Save') {
            getMasterTaskListTasks();
        }
    }, []);

    const columns = useMemo<ColumnDef<any, any>[]>(
        () => [
            {
                accessorKey: "TaskID",
                placeholder: "PX ID",
                id: "TaskID",
                size: 100,
                cell: ({ row }) => <span className="d-flex">
                <ReactPopperTooltipSingleLevel CMSToolId={row?.original?.TaskID} AllListId={AllListId} row={row?.original} singleLevel={true} masterTaskData={AllMasterTask} AllSitesTaskData={[]} />

              </span>,
            },
            {
                accessorFn: (row) => row?.Title,
                cell: ({ row }) => (
                    <>
                        <a className='hreflink'
                            href={`${AllListId?.siteUrl}/SitePages/PX-Profile.aspx?ProjectId=${row?.original?.Id}`}
                            data-interception="off"
                            target="_blank"
                        >
                            {row?.original?.Title}
                        </a>
                        {row?.original?.descriptionsSearch?.length > 0 &&
                            <span className='alignIcon mt--5'>
                                <InfoIconsToolTip Discription={row?.original?.descriptionsSearch} row={row?.original} />
                            </span>
                        }
                    </>
                ),
                id: "Title",
                placeholder: "PX Title",
            },
            {
                accessorFn: (row) => row?.PriorityRank,
                cell: ({ row }) => <span>{row?.original?.PriorityRank}</span>,
                id: "PriorityRank",
                placeholder: "PX Priority",
                filterFn: (row, columnId, filterValue) => (
                    row?.original?.PriorityRank?.toString().charAt(0) === filterValue.toString().charAt(0) &&
                    row?.original?.PriorityRank.toString().includes(filterValue)
                ),
            },
            {
                accessorFn: (row) => row?.DueDate,
                cell: ({ row, column, getValue }) => (
                    <HighlightableCell value={row?.original?.DisplayDueDate} searchTerm={column.getFilterValue() != undefined ? column.getFilterValue() : childRef?.current?.globalFilter} />
                ),
                filterFn: (row: any, columnName: any, filterValue: any) => {
                    if (row?.original?.DisplayDueDate?.includes(filterValue)) {
                        return true
                    } else {
                        return false
                    }
                },
                id: 'DueDate',
                resetColumnFilters: false,
                resetSorting: false,
                placeholder: "PX DueDate",
                header: "",
                size: 91,
                isColumnVisible: true,
                fixedColumnWidth:true
            },
            {
                accessorFn: (row) => row?.TeamMembersSearch,
                cell: ({ row }) => <span><ShowTaskTeamMembers key={row?.original?.Id} props={row?.original} TaskUsers={AllTaskUsers} Context={ContextValue} /></span>,
                id: "TeamMembersSearch",
                placeholder: "PX Lead",
            },
            {
                cell: ({ row, getValue }) => (
                    <>
                        <span className="svg__iconbox hreflink svg__icon--edit"
                                        onClick={(e) => EditComponentPopup(row?.original)}
                                    ></span>
                      
                        {/* {getValue()} */}
                    </>
                ),
                id: "editIcon",
                canSort: false,
                placeholder: "",
                header: "",
                size: 30,
                isColumnVisible: true
            }
            
        ],
        [ProjectData]
    );

    const callBackData = useCallback((checkData) => {
        if (checkData) {
            console.log(childRef.current.table.getSelectedRowModel().flatRows);
        }
    }, []);

    return (
        <>
            {ProjectData.length > 0 ? (
                <GlobalCommanTable
                    AllListId={AllListId}
                    wrapperHeight="300px"
                    columns={columns}
                    data={ProjectData}
                    callBackData={callBackData}
                    pageName={"ProjectOverview"}
                    TaskUsers={AllTaskUsers}
                    showHeader={true}
                    hideOpenNewTableIcon={true}
                    hideTeamIcon={true}
                />
            ) : "No Project Tagged"}
            {IsComponent && (
                <EditProjectPopup
                    props={CMSToolComponent}
                    AllListId={AllListId}
                    Call={Call}
                    showProgressBar={showProgressBar}
                />
            )}
        </>
    );
});

export default PortfolioProjectManagement;
