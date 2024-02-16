import * as React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import Tooltip from '../../../globalComponents/Tooltip';
import { Web, sp } from 'sp-pnp-js';
import GlobalCommanTable from '../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable';
import { ColumnDef } from '@tanstack/react-table';
import EditPopup from './EditPopup';
import AddPopup from './AddPopup';
import './Recruitment.css'
import { Dropdown, IDropdownOption, Modal, Panel, PanelType, PrimaryButton } from 'office-ui-fabric-react';
import AddEditPostion from './AddEditPostion';
import { myContextValue } from '../../../globalComponents/globalCommon';
let allListId: any = {};
let allSite: any = {
    GMBHSite: false,
    HrSite: false,
    MainSite: true,
}
const HRweb = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/HR');
let updatedStatusData: any[] = [];
// eslint-disable-next-line prefer-const
let statusKeyID: number;
interface StatusItem {
    Id: number;
    Title: string;
    selectItem: boolean;
    showTextInput: boolean;
    siteName: string;
}
interface RowData {
    Id: any;
    CandidateName: string;
    Position: any;
    IsFavorite: boolean;
}
let overallRatings: any
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default function GetData(props: any) {
    const [listData, setListData]: any = useState([]);
    const [activeTab, setactiveTab] = useState('All Candidates');
    const [NewCandidates, setNewCandidates] = useState([]);
    const [inProcessCand, setinProcessCand] = useState([]);
    const [ArchiveCandidates, setArchiveCandidates] = useState([]);
    const [AllStatus, setAllStatus] = useState([]);
    const params = new URLSearchParams(window.location.search);
    let JobPositionId = params.get('PositionId');
    const [AllAvlStatusdata, setAllAvlStatusdata] = useState<StatusItem[]>([]);
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
    const [isAddEditPositionOpen, setIsAddEditPositionOpen] = useState(false);
    const [selectedItem, setSelectedItem]: any = useState(null);
    const [isopenModalPopup, setopenModalPopup] = useState(false);
    const [isChangeStatusPopup, setisChangeStatusPopup] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [isStatButtonDisabled, setisStatButtonDisabled] = useState(true);
    const [newStatus, setNewStatus] = useState('')
    const [isAddStatusButtonDisabld, setIsAddStatusButonDisabled] = useState(true)

    const EditPopupOpen = (item: any) => {
        setSelectedItem(item);
        setIsEditPopupOpen(true);
    };
    const EditPopupClose = () => {
        setIsEditPopupOpen(false);
    };
    const AddPopupOpen = () => {
        setIsAddPopupOpen(true);
    };
    const AddPopupClose = () => {
        setIsAddPopupOpen(false);
    };
    const AddEditPositionOpen = () => {
        setIsAddEditPositionOpen(true);
    };
    const AddEditPositionCLose = () => {
        setIsAddEditPositionOpen(false);
    };
    const openModal = () => {
        setopenModalPopup(true)
    }
    const CloseCreateStatus = () => {
        setopenModalPopup(false)
        setNewStatus('')
        setIsAddStatusButonDisabled(true)
    }
    const openChangeStatus = () => {
        setisChangeStatusPopup(true)
    }
    const closeChangeStatus = () => {
        setSelectedStatus('');
        setisChangeStatusPopup(false)
    }
    const handleNewStatus = (e: any) => {
        const statusValue = e.target.value
        setNewStatus(statusValue)
        setIsAddStatusButonDisabled(statusValue.trim() === '')
    }

    const inlineEditStatus = (inl: any) => {
        setSelectedItem([inl])
        setisChangeStatusPopup(true)
        setSelectedStatus(inl?.Status0)
    }
    const AddnewStatusTitle = () => {
        const newStatusObj = {
            "Id": AllAvlStatusdata.length,
            "Title": newStatus,
            "selectItem": false,
            "showTextInput": false,
            "siteName": "Status0"
        };
        // Create a copy of the existing AllAvlStatusdata array and add the new object
        updatedStatusData = [...AllAvlStatusdata, newStatusObj];
        // Update the state with the new array
        setAllAvlStatusdata(updatedStatusData);
        setNewStatus('')
        setIsAddStatusButonDisabled(true)
        console.log(updatedStatusData); // This will show the updated array with the new object
    };
    const AddnewStatus = async (values: any, isDEL: boolean) => {
        if (isDEL) {
            const confirmDeletion = window.confirm('Are you sure you want to delete this Status?')
            if(confirmDeletion) {
                const updatedStatusDatas = AllAvlStatusdata.filter(item => item.Id !== values.Id);
                setAllAvlStatusdata(updatedStatusDatas);
            }    
        }
        const postData = {
            "Configurations": JSON.stringify(AllAvlStatusdata)
        }
        try {
            await HRweb.lists.getById('2e5ed76d-63ae-4f4a-887a-6d56f0b925c3').items.getById(statusKeyID).update(postData);
        } catch (error) {
            if (!isDEL) {
                setopenModalPopup(false)
            }
            setopenModalPopup(false)
            console.error(error);
        } finally {
            if (!isDEL) {
                setopenModalPopup(false)
                setIsAddStatusButonDisabled(true)
            }
        }
    };

    const columns = React.useMemo<ColumnDef<any, unknown>[]>(() =>
        [{
            accessorKey: "",
            placeholder: "",
            hasCheckbox: true,
            hasCustomExpanded: false,
            hasExpanded: false,
            size: 5,
            id: 'Id',
        }, {
            accessorKey: "Title",
            placeholder: "Title",
            header: "",
            id: 'Title',
            cell: ({ row, getValue }) => (
                <><a
                    className="text-content hreflink"
                    title={row?.original?.CandidateName}
                    data-interception="off"
                    target="_blank"
                    href={`https://hhhhteams.sharepoint.com/sites/HHHH/HR/SitePages/Candidate-Profile.aspx?CandidateId=${row?.original?.Id}`}
                >
                    {row.original.CandidateName}
                    {row.original.IsFavorite && (
                        <span className="orange-star">⭐</span>
                    )}
                </a>


                </>
            ),
        },
        { accessorKey: "Email", placeholder: "Email", header: "", id: 'Email' },
        { accessorKey: "OverallRatings", placeholder: "Overall Rating", header: "", id: 'OverallRatings'},
        { accessorKey: "Status0", placeholder: "Status", header: "", id: 'Status0', 
            cell: ({row}) => (
                <div className='alignCenter'>
                {row?.original?.Status0}
                <span className="svg__iconbox svg__icon--editBox" title='Edit Status' onClick={() => inlineEditStatus(row?.original)}></span>   
                </div>
            )
        }, {
            cell: ({ row }) => (
                <div className='alignCenter'>
                    <span onClick={() => EditPopupOpen(row.original)} title="Edit" className="svg__iconbox hreflink svg__icon--edit"></span>
                </div>
            ),
            accessorKey: '',
            canSort: false,
            placeholder: '',
            header: '',
            id: 'row.original',
            size: 10,
        },
        {
            cell: ({ row }) => (
                <div className='alignCenter'>
                    <span onClick={() => delItem(row.original)} className="ml-auto hreflink svg__iconbox svg__icon--trash" title="Delete" ></span>
                </div>
            ),
            accessorKey: '',
            canSort: false,
            placeholder: '',
            header: '',
            id: 'row.original',
            size: 10,
        }, {
            cell: ({ row }) => (

                <a className='alignCenter' href={`mailto:?subject=Have%20a%20look%20at%20'${(row.original as RowData).CandidateName}'%20for%20the%20Position%20of%20'${(row.original as RowData).Position}'`}>
                    <span className="svg__iconbox svg__icon--mail" title="Send Email"></span>
                </a>
            ),
            accessorKey: '', // You might want to specify the correct accessorKey
            canSort: false,
            placeholder: '',
            header: '',
            id: 'row.original',
            size: 10,
        }
        ],
        [listData]);
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const callBackData = React.useCallback((elem: any, getSelectedRowModel: any, ShowingData: any) => {
        if (elem?.length > 0) {
            const newArray = elem.map((item: { original: any; }) => item.original);
            setSelectedItem(newArray)
            if (selectedItem !== '') {
                setisStatButtonDisabled(false)
            }
            console.log(newArray);
        }
        else {
            setisStatButtonDisabled(true)
        }
    }, []);

    const getListData = () => {
        const web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/HR/');
        let query = web.lists
            .getById(props?.props?.InterviewFeedbackFormListId)
            .items.select('Id', 'Title', 'Remarks', 'Motivation','Created','Modified','AuthorId','Author/Title','Editor/Id','Editor/Title' ,'SelectedPlatforms', 'Result', 'CandidateStaffID', 'ActiveInterv', 'Status0', 'IsFavorite', 'CandidateName', 'SkillRatings', 'Positions/Id', 'Positions/Title', 'Platform', 'IsFavorite', 'PhoneNumber', 'Email', 'Experience', 'Current_x0020_Company', 'Date', 'CurrentCTC', 'ExpectedCTC', 'NoticePeriod', 'CurrentLocation', 'DateOfJoining', 'HRNAME')
            .expand('Positions','Editor','Author')
            .top(5000);
        if (JobPositionId !== undefined && JobPositionId !== null) {
            query = query.filter("Positions/Id eq " + JobPositionId + "")
        }
        query
        query.get().then((response: any) => {
            const itemsWithPosition = response.map((item: any) => {
                let skills = JSON.parse(item?.SkillRatings)
                let currentRatings = skills ? skills.reduce((sum: any, skill: any) => sum + (skill%2 != 0 ? Math.floor(skill?.current/2): skill?.current/2 || 0), 0) : 0;
                let maxRatings = skills ? skills.reduce((sum: any, skill: any) => sum + (skill?.max/2 || 0), 0) : 0;
                overallRatings = currentRatings != 0 || maxRatings != 0 ?  parseFloat(((currentRatings / maxRatings) * 5).toFixed(2)) : 0;
                return {
                    ...item,
                    Position: item.Positions ? item.Positions.Title : null,
                    Title: item.CandidateName,
                    OverallRatings: overallRatings
                };
            });
            const categorizedItems = itemsWithPosition.reduce((accumulator: { newCandidates: any[]; inProcessCand: any[]; archiveCandidates: any[]; }, currentItem: {
                Positions: any; Status0: any; CandidateName: any; OverallRatings: any
            }) => {
                const itemWithPosition = {
                    ...currentItem,
                    Position: currentItem.Positions ? currentItem.Positions.Title : null,
                    Title: currentItem.CandidateName,
                    OverallRatings: currentItem.OverallRatings
                };

                switch (currentItem.Status0) {
                    case undefined:
                    case '':
                    case 'New Candidate':
                        accumulator.newCandidates.push(itemWithPosition);
                        break;
                    case 'Under Consideration':
                    case 'Interview':
                    case 'Negotiation':
                        accumulator.inProcessCand.push(itemWithPosition);
                        break;
                    case 'Hired':
                    case 'Rejected':
                        accumulator.archiveCandidates.push(itemWithPosition);
                        break;
                    default:
                        break;
                }
                return accumulator;
            }, { newCandidates: [], inProcessCand: [], archiveCandidates: [] });

            setListData(itemsWithPosition);
            setNewCandidates(categorizedItems.newCandidates);
            setinProcessCand(categorizedItems.inProcessCand);
            setArchiveCandidates(categorizedItems.archiveCandidates);
        })
            .catch((error: unknown) => {
                console.error(error);
            });
    };

    const loadAdminConfigurations = () => {
        const web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/HR/')
        web.lists
            .getById("2e5ed76d-63ae-4f4a-887a-6d56f0b925c3")
            .items.select("Id,Title,Value,Key,Description,Configurations")
            .filter(`Key eq 'RecruitmentStatus'`)
            .getAll().then((data: any) => {
                if (data.length > 0) {
                    statusKeyID = data[0].Id
                    data.forEach((status: { Configurations: any; }) => {
                        // AllAvlStatusdata = JSON.parse(status.Configurations);
                        setAllAvlStatusdata(JSON.parse(status.Configurations))
                    });
                    // itm.ImpSkills = JSON.parse(itm.JobSkills);
                    setAllStatus(data)

                }
            }).catch((error: any) => {
                console.log(error)
            })
    }
    const delItem = (itm: any) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this item?");
        if (confirmDelete) {
            const web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/HR/');
            web.lists
                .getById(props?.props?.InterviewFeedbackFormListId)
                .items.getById(itm.Id)
                .recycle()
                .then(() => {
                    const index = listData.findIndex((item: { Id: any; }) => item.Id === itm.Id);
                    if (index !== -1) {

                        listData.splice(index, 1);
                        setListData([...listData]); // Update state with the new listData
                        console.log(`Item with ID ${itm.Id} removed from listData.`);
                    } else {
                        console.warn(`Item with ID ${itm.Id} not found in listData.`);
                    }
                })
                .catch((error: any) => {
                    console.error(error);
                });
        } else {

            console.log("Deletion canceled.");
        }
    };
    const handleTabChange = (tab: string) => {
        setactiveTab(tab)
    }
    // const getchoicecolumns = () => {
    //     const web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/HR/')
    //     web.lists.getById("2e5ed76d-63ae-4f4a-887a-6d56f0b925c3").items.getAll().then((response: any) => {
    //         setAllStatus(response);
    //     }).catch((error: unknown) => {
    //         console.error(error);
    //     });
    // };
    useEffect(() => {
        if (props?.props.Context.pageContext.web.absoluteUrl.toLowerCase().includes("hr")) {
            allSite = {
                HrSite: true,
                MainSite: false
            }
        }
        allListId = {
            Context: props?.props.Context,
            HHHHContactListId: props?.props?.HHHHContactListId,
            HHHHInstitutionListId: props?.props?.HHHHInstitutionListId,
            MAIN_SMARTMETADATA_LISTID: props?.props?.MAIN_SMARTMETADATA_LISTID,
            MAIN_HR_LISTID: props?.props?.MAIN_HR_LISTID,
            GMBH_CONTACT_SEARCH_LISTID: props?.props?.GMBH_CONTACT_SEARCH_LISTID,
            HR_EMPLOYEE_DETAILS_LIST_ID: props?.props?.HR_EMPLOYEE_DETAILS_LIST_ID,
            siteUrl: props?.props.Context.pageContext.web.absoluteUrl,
            jointSiteUrl: "https://hhhhteams.sharepoint.com/sites/HHHH",
            ContractListID: props?.props?.ContractListID
        }
        getListData();
        loadAdminConfigurations();
    }, []);
    const handleStatusAction = (event: React.FormEvent<HTMLDivElement>, item?: IDropdownOption): void => {
        if (item) {
            setSelectedStatus(item.key as string);
        } else {
            setSelectedStatus('');
        }
    };
    const updateStatusItems = async () => {
        try {
            const list = sp.web.lists.getById(props?.props?.InterviewFeedbackFormListId);

            for (const selectedItems of selectedItem) {
                await list.items.getById(selectedItems.Id).update({
                    Status0: selectedStatus,
                });

                for (let i = 0; i < listData.length; i++) {
                    if (listData[i].Id === selectedItems.Id) {
                        listData[i].Status0 = selectedStatus;
                        break;
                    }
                }
                setListData(listData)
            }

            alert("Status updated successfully");
        } catch (error) {
            console.error(error);
            // Handle errors here
        } finally {
            setisChangeStatusPopup(false);
        }
    };
    const onRenderCustomHeaderMain3 = () => {
        return (
            <>
                <div className='subheading'>
                    Add / Edit Status
                </div>
                <Tooltip ComponentId='7930' />
            </>
        );
    };
    const onRenderCustomHeaderMain4 = () => {
        return (
            <>
                <div className='subheading'>
                    Change Status
                </div>
                <Tooltip ComponentId='6025' />
            </>
        );
    };
    const callbackEdit = () => {
        getListData();
    };
    const callbackAdd = () => {
        getListData();
    };
    
    
    return (
        <myContextValue.Provider value={{ ...myContextValue, allSite: allSite, allListId: allListId, loggedInUserName: props.props?.userDisplayName, }}>
            <div>
                <div className='alignCenter'>
                <h2 className='heading'>Recruiting-Tool</h2>
                <a target='_blank' className='hreflink ml-auto f-14 fw-semibold' data-interception="off" href={'https://hhhhteams.sharepoint.com/sites/HHHH/HR/SitePages/Recruiting-Tool.aspx'}>Old Recruting Tool</a>
                </div>
                
                <ul className="nav nav-tabs" id="myTab" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button onClick={() => handleTabChange('All Candidates')} className={`nav-link ${activeTab === 'All Candidates'
                            ? 'active' : ''}`} data-bs-target="#AllCandidates" id="home-tab" type="button" role="tab" aria-controls="home" aria-selected="true">All Candidates({listData.length})</button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button onClick={() => handleTabChange('New Candidates')} className={`nav-link ${activeTab === 'New Candidates' ?
                            'active' : ''}`} data-bs-target="#NewCandidates" id="profile-tab" type="button" role="tab" aria-controls="profile" aria-selected="false">New Candidates({NewCandidates.length})</button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button onClick={() => handleTabChange('In Process')} className={`nav-link ${activeTab === 'In Process' ?
                            'active' : ''}`} data-bs-target="#inProcessCand" id="profile-tab" type="button" role="tab" aria-controls="profile" aria-selected="false">In Process({inProcessCand.length})</button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button onClick={() => handleTabChange('Archive')} className={`nav-link ${activeTab === 'Archive' ?
                            'active' : ''}`} data-bs-target="#ArchiveCandidates" id="profile-tab" type="button" role="tab" aria-controls="profile" aria-selected="false">Archive({ArchiveCandidates.length})</button>
                    </li>
                    <div className='ml-auto'>
                        <span className='text-right me-1'><button type='button' className='btnCol btn btn-primary' onClick={() => AddPopupOpen()}>Add Candidate</button></span>
                        <span className='text-right me-1'><button type='button' className='btnCol btn btn-primary' onClick={() => AddEditPositionOpen()}>Add/Edit Positions</button></span>
                        <span className='text-right me-1'><button type='button' className='btnCol btn btn-primary' disabled={isStatButtonDisabled} onClick={() => openChangeStatus()}>Change Status</button></span>
                        <span className='text-right'><button type='button' className='btnCol btn btn-primary' onClick={() => openModal()}>Add/Remove Status</button></span>
                    </div>
                </ul>
                <div className="tab-content border border-top-0 clearfix " id="nav-tabContent">
                    <div className={`tab-pane fade px-1 ${activeTab === 'All Candidates' ? 'show active' : ''}`} id="AllCandidates"
                        role="tabpanel" aria-labelledby="home-tab">
                        {listData && <div className='Alltable'><GlobalCommanTable columns={columns} data={listData} multiSelect={true} showHeader={true} callBackData={callBackData} /></div>}
                    </div>
                    <div className={`tab-pane fade px-1 ${activeTab === 'New Candidates' ? 'show active' : ''}`} id="NewCandidates"
                        role="tabpanel" aria-labelledby="profile-tab">
                        {NewCandidates && <div className='Alltable'><GlobalCommanTable columns={columns} data={NewCandidates} multiSelect={true} showHeader={true} callBackData={callBackData} /></div>}
                    </div>
                    <div className={`tab-pane fade px-1 ${activeTab === 'In Process' ? 'show active' : ''}`} id="inProcessCand"
                        role="tabpanel" aria-labelledby="profile-tab">
                        {inProcessCand && <div className='Alltable'><GlobalCommanTable columns={columns} data={inProcessCand} multiSelect={true} showHeader={true} callBackData={callBackData} /></div>}
                    </div>
                    <div className={`tab-pane fade px-1 ${activeTab === 'Archive' ? 'show active' : ''}`} id="ArchiveCandidates"
                        role="tabpanel" aria-labelledby="profile-tab">
                        {ArchiveCandidates && <div className='Alltable'><GlobalCommanTable columns={columns} data={ArchiveCandidates} multiSelect={true} showHeader={true} callBackData={callBackData} /></div>}
                    </div>
                </div>
                {isEditPopupOpen ? <EditPopup siteUrl={props?.props?.siteUrl} EditPopupClose={EditPopupClose} callbackEdit={callbackEdit} item={selectedItem} ListID={props?.props?.InterviewFeedbackFormListId} skillsList={props?.props?.SkillsPortfolioListID} statusData={AllAvlStatusdata}/> : ''}
                {isAddPopupOpen ? <AddPopup context={props?.props?.Context} AddPopupClose={AddPopupClose} callbackAdd={callbackAdd} ListID={props?.props?.InterviewFeedbackFormListId} siteUrl={props?.props?.siteUrl} skillsList={props?.props?.SkillsPortfolioListID}/> : ''}
                {isAddEditPositionOpen ? <AddEditPostion AddEditPositionCLose={AddEditPositionCLose} props={props?.props}/> : ''}
            </div>

            {/* ********************* this is Add/Edit Status Task panel ****************** */}
            <Panel
                onRenderHeader={onRenderCustomHeaderMain3}
                isOpen={isopenModalPopup}
                onDismiss={CloseCreateStatus}
                type={PanelType.custom}
                customWidth="700px"
                isBlocking={true}
            >
                <div className="modal-body mb-5">
                    <div className="col-md-12 select-sites-section">
                        {/* <div className="card-header">
                                    <h6>Sites</h6>
                                </div> */}
                        <div className="card-body">
                            <div className="col-sm-12 pad0 inline-fieldbtn input-group">
                                <input className="form-control" placeholder="Add Status" value={newStatus} onChange={(e) => handleNewStatus(e)} type="text" />
                                {/* <button type="button" onClick={AddnewStatusTitle} className="btn btn-primary btn-sm ml-15 pull-right">
                                            Add
                                        </button> */}
                                <button disabled={isAddStatusButtonDisabld} onClick={AddnewStatusTitle} type='button' className='btn btn-primary btn-sm ml-15 pull-right'>Add</button>
                            </div>
                            <div className="col-sm-12 pad0">
                                <ul className="full-width mt-10 p0 status-lists">
                                    {AllAvlStatusdata.map((item, index) => (
                                        <li key={index} className="full-width mb-10 valign-middle">
                                            {item.Title}
                                            <span onClick={() => AddnewStatus(item, true)} className="ml-auto svg__iconbox svg__icon--trash">Trash Icon</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>
                <footer className="bg-f4 fixed-bottom px-4 py-2">
                    <div className="float-end text-end">
                        <button onClick={() => AddnewStatus('item', false)} type='button' className='btn btn-primary'>Save</button>
                        <button onClick={CloseCreateStatus} type='button' className='btn btn-default ms-1'>Cancel</button>
                    </div>
                </footer>
            </Panel>
            <Panel
                onRenderHeader={onRenderCustomHeaderMain4}
                isOpen={isChangeStatusPopup}
                onDismiss={closeChangeStatus}
                type={PanelType.custom}
                customWidth="500px"
                isBlocking={true}
            >
                <div className='modal-body'>
                    <div className="col-sm-12 p-0">
                        <Dropdown
                            id="secAction"
                            selectedKey={selectedStatus}
                            onChange={handleStatusAction}
                            placeholder="Select Status"
                            options={[
                                ...AllAvlStatusdata.map((itm) => ({ key: itm.Title, text: itm.Title })),
                            ]}
                            styles={{ dropdown: { width: '100%' } }}
                        />
                    </div>
                </div>
                <footer className="py-3 clearfix">
                    <div className="float-end text-end">
                        <button onClick={updateStatusItems} type='button' className='btn btn-primary'>Save</button>
                        <button onClick={closeChangeStatus} type='button' className='btn btn-default ms-1'>Cancel</button>
                    </div>
                </footer>
            </Panel>
        </myContextValue.Provider>

    )
}