import { Panel, Dropdown, PanelType, IDropdownOption } from 'office-ui-fabric-react';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Web } from 'sp-pnp-js';
import Tooltip from '../../../globalComponents/Tooltip';
import EditPopup from './EditPopup';
import AddMorePosition from './AddMorePosition';

interface StatusItem {
    Id: number;
    Title: string;
    selectItem: boolean;
    showTextInput: boolean;
    siteName: string;
}

const AddPopup = (props: any) => {
    const [name, setName] = useState('');
    const [isSaveDisabled, setIsSaveDisabled] = useState(true);
    const [email, setEmail] = useState('');
    const [isAddPosititionOpen, setisAddPositionOpen] = React.useState(false);
    const [positionChoices, setPositionChoices] = useState([])
    const [selectedPosition, setSelectedPosition] = useState(props?.selectedPositionId);
    const [emailValidation, setEmailValidation] = useState({ isValid: true, errorMessage: '' });
    const [AllAvlStatusdata, setAllAvlStatusdata] = useState<StatusItem[]>([]);
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const [newCandidate, setNewCandidate] = useState({})

    useEffect(() => {
        loadAdminConfigurations();
        getchoicecolumns();
    }, [])

    const EditPopupClose = () => {
        setIsEditPopupOpen(false);
    };

    const openAddPositionPopup = () => {
        setisAddPositionOpen(true)
    }

    const callbackEdit = () => {
        onClose();
        props.callbackAdd();
    };

    const onClose = () => {
        props.AddPopupClose();
    }

    const AddMorePositionClose = () => {
        setisAddPositionOpen(false)
    };

    let allListID = {
        InterviewFeedbackFormListId: props?.ListID,
        SkillsPortfolioListID: props?.skillsList,
        siteUrl: props?.siteUrl
    }

    const loadAdminConfigurations = () => {
        const web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/HR/')
        web.lists
            .getById("2e5ed76d-63ae-4f4a-887a-6d56f0b925c3")
            .items.select("Id,Title,Value,Key,Description,Configurations")
            .filter(`Key eq 'RecruitmentStatus'`)
            .getAll().then((data: any) => {
                if (data.length > 0) {
                    data.forEach((status: { Configurations: any; }) => {
                        setAllAvlStatusdata(JSON.parse(status.Configurations))
                    });

                }
            }).catch((error: any) => {
                console.log(error)
            })
    }

    const getchoicecolumns = async () => {
        const select = `Id,Title,PositionTitle,PositionDescription,JobSkills`;
        await HRweb.lists.getById(allListID?.SkillsPortfolioListID).items.select(select).get()
            .then(response => {
                setPositionChoices(response)
            })
            .catch((error: unknown) => {
                console.error(error);
            });
    }


    const HRweb = new Web(allListID?.siteUrl)
    
    const addCandidate = async () => {
        try {
            const addData = {
                CandidateName: name,
                Email: email,
                PositionsId: selectedPosition
            }

            await HRweb.lists.getById(props?.ListID).items.add(addData).then(async (candidateItem: any) => {
                setNewCandidate(candidateItem?.data)
                props.callbackAdd()
                setIsEditPopupOpen(true)
            })
               
        } catch (error) {
            console.error(error);
        }
    };

    const handlePosition = (event: React.FormEvent<HTMLDivElement>, item?: IDropdownOption): void => {
        if (item) {
            setSelectedPosition(item.key as string);
        } else {
            setSelectedPosition('');
        }
    };

    const handleNameChange = (e: any) => {
        const nameValue = e.target.value;
        setName(nameValue);
        setIsSaveDisabled(nameValue.trim() === '');
    };
    const handleEmailChange = (e: any) => {
        const emailValue = e.target.value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValidEmail = emailValue === '' || emailRegex.test(emailValue);

        setEmailValidation({
            isValid: isValidEmail,
            errorMessage: isValidEmail ? '' : 'Enter a valid email address',
        });

        setEmail(emailValue);
    };

    const onRenderCustomHeaderMains = () => {
        return (
            <>
                <div className='subheading'>
                    Add Candidate
                </div>
                <Tooltip ComponentId='4430' />
            </>
        );
    };

    return (
        <>
        <Panel
            onRenderHeader={onRenderCustomHeaderMains}
            isOpen={true}
            onDismiss={onClose}
            isBlocking={false}
            //type={PanelType.large}
            closeButtonAriaLabel="Close"
            type={PanelType.custom}
            customWidth={"950px"}
        >
            <div className='modal-body mb-5'>
                <div className="row">
                    <div className="col-sm-3 mb-2">
                        <div className='input-group'>
                            <label className="form-label full-width">Candidate Name <span className="text-danger">*</span></label>
                            <input
                                className="form-control"
                                value={name}
                                onChange={handleNameChange}
                                type="text"
                                placeholder="Enter Candidate Name"
                            />
                        </div>
                    </div>
                    <div className="col-sm-3 mb-2">
                        <div className='input-group'>
                            <label className="form-label full-width">Email</label>
                            <input
                                className={`form-control ${emailValidation.isValid ? '' : 'is-invalid'}`}
                                value={email}
                                onChange={handleEmailChange}
                                type="email"
                                placeholder="Enter Email"
                            />
                            {!emailValidation.isValid && (
                                <div className="invalid-feedback">{emailValidation.errorMessage}</div>
                            )}
                        </div>
                    </div>
                    <div className="col-sm-3 mb-2">
                        <div className='input-group'>
                            <label className="form-label full-width">Position 
                                <span onClick={openAddPositionPopup} className="svg__iconbox hreflink svg__icon--Plus mini ml-60 f-14 fw-bold"></span><span className='hreflink ml-9 f-14 fw-bold' onClick={openAddPositionPopup}>Add More</span>
                            </label>
                            
                            <Dropdown
                                id="status" className='w-100 '
                                placeholder='Select Position'
                                options={positionChoices.map((itm) => ({ key: itm.Id, text: itm.Title }))}
                                defaultSelectedKey={selectedPosition}
                                onChange={handlePosition}
                                styles={{ dropdown: { width: '100%' } }}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <footer className="bg-f4 fixed-bottom px-4 py-2">
                <div className="float-end text-end">
                    <button disabled={isSaveDisabled} onClick={addCandidate} type='button' className='btn btn-primary'>Save</button>
                    <button onClick={onClose} type='button' className='btn btn-default ms-1'>Cancel</button>
                </div>
            </footer>

        </Panel>
        {isEditPopupOpen ? <EditPopup siteUrl={props?.siteUrl} EditPopupClose={EditPopupClose} callbackEdit={callbackEdit} ListID={props?.ListID} skillsList={props?.skillsList} item={newCandidate} statusData={AllAvlStatusdata}/> : ''}
        {isAddPosititionOpen && <AddMorePosition siteUrl={allListID?.siteUrl} skillsList={allListID?.SkillsPortfolioListID} openPopup={isAddPosititionOpen} closePopup={AddMorePositionClose} callbackAdd={getchoicecolumns()}/>}
        </>
    );
};
export default AddPopup;
