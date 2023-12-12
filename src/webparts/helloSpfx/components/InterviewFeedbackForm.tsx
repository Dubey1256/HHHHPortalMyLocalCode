/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';

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
    CandidateName: string;
    Position: any;
}
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default function GetData(props: any) {
    const [listData, setListData]: any = useState([]);
    const [activeTab, setactiveTab] = useState('All Candidates');
    const [NewCandidates, setNewCandidates] = useState([]);
    const [inProcessCand, setinProcessCand] = useState([]);
    const [ArchiveCandidates, setArchiveCandidates] = useState([]);
    const [AllStatus, setAllStatus] = useState([]);
    const [AllAvlStatusdata, setAllAvlStatusdata] = useState<StatusItem[]>([]);
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
    const [isAddEditPositionOpen, setIsAddEditPositionOpen] = useState(false);
    const [selectedItem, setSelectedItem]: any = useState(null);
    const [isopenModalPopup, setopenModalPopup] = useState(false);
    const [isChangeStatusPopup, setisChangeStatusPopup] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [isStatButtonDisabled, setisStatButtonDisabled] = useState(true);

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
    }
    const openChangeStatus = () => {
        setisChangeStatusPopup(true)
    }
    const closeChangeStatus = () => {
        setSelectedStatus('');
        setisChangeStatusPopup(false)
    }
    const AddnewStatusTitle = () => {
        const inputElement = document.getElementById("myInputStatus") as HTMLInputElement;
        const newStatusObj = {
            "Id": AllAvlStatusdata.length,
            "Title": inputElement.value,
            "selectItem": false,
            "showTextInput": false,
            "siteName": "Status0"
        };
        // Create a copy of the existing AllAvlStatusdata array and add the new object
        updatedStatusData = [...AllAvlStatusdata, newStatusObj];
        // Update the state with the new array
        setAllAvlStatusdata(updatedStatusData);
        console.log(updatedStatusData); // This will show the updated array with the new object
    };
    const AddnewStatus = async (values: any, isDEL: boolean) => {
        if (isDEL) {
            const updatedStatusDatas = AllAvlStatusdata.filter(item => item.Id !== values.Id);
            setAllAvlStatusdata(updatedStatusDatas);
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
            }
        }
    };
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const DeleteItem = async (values: any, isDEL: boolean) => {

    };
    const columns = React.useMemo<ColumnDef<unknown, unknown>[]>(() =>
        [{
            accessorKey: "",
            placeholder: "",
            hasCheckbox: true,
            hasCustomExpanded: false,
            hasExpanded: false,
            size: 5,
            id: 'Id',
        }, { accessorKey: "CandidateName", placeholder: "Title", header: "" },
        { accessorKey: "Email", placeholder: "Email", header: "" },
        { accessorKey: "Position", placeholder: "Positions", header: "" },
        { accessorKey: "Status0", placeholder: "Status", header: "" }, {
            cell: ({ row }) => (
                <>
                    <a onClick={() => EditPopupOpen(row.original)} title="Edit" className="svg__iconbox svg__icon--edit"></a>
                </>
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
                <>
                    <a onClick={() => delItem(row.original)} className="ml-auto svg__iconbox svg__icon--trash" title="Delete" />
                </>
            ),
            accessorKey: '',
            canSort: false,
            placeholder: '',
            header: '',
            id: 'row.original',
            size: 10,
        }, {
            cell: ({ row }) => (
                <a href={`mailto:?subject=Have%20a%20look%20at%20'${(row.original as RowData).CandidateName}'%20for%20the%20Position%20of%20'${(row.original as RowData).Position}'`}
                    className="svg__iconbox svg__icon--mail" title="Send Email">
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
        if (elem.length > 0) {
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
        web.lists
            .getById(props?.props?.InterviewFeedbackFormListId)
            .items.getAll()
            .then((response: any) => {
                const categorizedItems = response.reduce((accumulator: { newCandidates: any[]; inProcessCand: any[]; archiveCandidates: any[]; }, currentItem: { Status0: any; }) => {
                    switch (currentItem.Status0) {
                        case undefined:
                        case '':
                        case 'New Candidate':
                            accumulator.newCandidates.push(currentItem);
                            break;
                        case 'Under Consideration':
                        case 'Interview':
                        case 'Negotiation':
                            accumulator.inProcessCand.push(currentItem);
                            break;
                        case 'Hired':
                        case 'Rejected':
                            accumulator.archiveCandidates.push(currentItem);
                            break;
                        default:
                            break;
                    }
                    return accumulator;
                }, { newCandidates: [], inProcessCand: [], archiveCandidates: [] });

                setListData(response);
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
        const web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/HR/')
        web.lists
            .getById(props?.props?.InterviewFeedbackFormListId)
            .items.getById(itm.Id).recycle().then(() => {
                for (var i = 0; i < listData.length; i++) {
                    if (listData[i].id === itm.Id) {
                        itm.Id = i;
                        break;
                    }
                }
                if (itm.Id !== -1) {
                    listData.splice(itm.Id, 1);
                    setListData(listData)
                    console.log(`Item with ID ${itm.Id} removed from listData.`);
                } else {
                    console.warn(`Item with ID ${itm.Id} not found in listData.`);
                }
            }).catch((error: any) => {
                console.log(error)
            })
    }
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
            jointSiteUrl: "https://hhhhteams.sharepoint.com/sites/HHHH"
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

    return (
         <myContextValue.Provider value={{ ...myContextValue, allSite:allSite,allListId:allListId ,loggedInUserName:props.props?.userDisplayName,}}>
            <div className="container">
                <h2>Recruiting-Tool</h2>
                <ul className="nav nav-tabs" id="myTab" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button onClick={() => handleTabChange('All Candidates')} className={`nav-link ${activeTab === 'All Candidates'
                            ? 'active' : ''}`} data-bs-target="#AllCandidates" id="home-tab" type="button" role="tab" aria-controls="home" aria-selected="true">All Candidates</button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button onClick={() => handleTabChange('New Candidates')} className={`nav-link ${activeTab === 'New Candidates' ?
                            'active' : ''}`} data-bs-target="#NewCandidates" id="profile-tab" type="button" role="tab" aria-controls="profile" aria-selected="false">New Candidates</button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button onClick={() => handleTabChange('In Process')} className={`nav-link ${activeTab === 'In Process' ?
                            'active' : ''}`} data-bs-target="#inProcessCand" id="profile-tab" type="button" role="tab" aria-controls="profile" aria-selected="false">In Process</button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button onClick={() => handleTabChange('Archive')} className={`nav-link ${activeTab === 'Archive' ?
                            'active' : ''}`} data-bs-target="#ArchiveCandidates" id="profile-tab" type="button" role="tab" aria-controls="profile" aria-selected="false">Archive</button>
                    </li>
                    <div className='ml-auto'>
                        <span className='text-right mr-10'><PrimaryButton className='me-1' text="Add Candidate" onClick={() => AddPopupOpen()} /></span>
                        <span className='text-right mr-10'><PrimaryButton className='me-1' text="Add/Edit Positions" onClick={() => AddEditPositionOpen()} /></span>
                        <span className='text-right mr-10'><PrimaryButton className='me-1' text="Change Status" disabled={isStatButtonDisabled} onClick={() => openChangeStatus()} /></span>
                        <span className='text-right'><PrimaryButton text="Add/Remove Status" onClick={() => openModal()} /></span>
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
                {isEditPopupOpen ? <EditPopup EditPopupClose={EditPopupClose} item={selectedItem} ListID={props?.props?.InterviewFeedbackFormListId} /> : ''}
                {isAddPopupOpen ? <AddPopup AddPopupClose={AddPopupClose} ListID={props?.props?.InterviewFeedbackFormListId} /> : ''}
                {isAddEditPositionOpen ? <AddEditPostion AddEditPositionCLose={AddEditPositionCLose} /> : ''}
            </div>

            {/* ********************* this is Add/Edit Status Task panel ****************** */}
            <Panel
                headerText={"Add/Edit Status"}
                isOpen={isopenModalPopup}
                onDismiss={CloseCreateStatus}
                type={PanelType.custom}
                customWidth="700px"
                isBlocking={true}
            >
                <div className="modal-body">
                    <div className="col-md-12 p-3 select-sites-section">
                        {/* <div className="card-header">
                                    <h6>Sites</h6>
                                </div> */}
                        <div className="card-body">
                            <div className="col-sm-12 pad0 inline-fieldbtn">
                                <input className="form-control" placeholder="Add Status" id="myInputStatus" type="text" />
                                {/* <button type="button" onClick={AddnewStatusTitle} className="btn btn-primary btn-sm ml-15 pull-right">
                                            Add
                                        </button> */}
                                <PrimaryButton onClick={AddnewStatusTitle} className="btn-sm ml-15 pull-right" text=" Add" />
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
                        <PrimaryButton onClick={() => AddnewStatus('item', false)} text="Save" />
                        <PrimaryButton onClick={CloseCreateStatus} className='ms-1' text="Cancel" />
                    </div>
                </footer>
            </Panel>
            <Panel
                headerText={"Change Status"}
                isOpen={isChangeStatusPopup}
                onDismiss={closeChangeStatus}
                type={PanelType.custom}
                customWidth="500px"
                isBlocking={true}
            >
                <div className="col-sm-12 pad0">
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
                <footer className="bg-f4 fixed-bottom px-4 py-2">
                    <div className="float-end text-end">
                        <PrimaryButton onClick={updateStatusItems} text="Save" />
                        <PrimaryButton onClick={closeChangeStatus} className='ms-1' text="Cancel" />
                    </div>
                </footer>
            </Panel>
            </myContextValue.Provider>
      
    )
}