/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Panel, PrimaryButton, TextField, Dropdown, PanelType, IconButton } from 'office-ui-fabric-react';
import * as React from 'react';
import { Item, sp, Web } from 'sp-pnp-js';
import {
    Column,
    Table,
    ExpandedState,
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getExpandedRowModel,
    ColumnDef,
    flexRender,
    getSortedRowModel,
    SortingState, ColumnFiltersState, Row,
} from "@tanstack/react-table";
import GlobalCommanTable from '../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable';
import { useEffect, useState } from 'react';
let portfiloData: any[] = [];
const HRweb = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/HR');


const AddEditPostion = (props: any) => {
    useEffect(() => {
        getListData();
    }, []);
    interface EdittableItem {
        [x: string]: any;
        Id: number;
        Title: string;
        PositionDescription: string;
        ImpSkills: ImpSkills[];
        // Other properties of EdittableItem
    }
    interface ImpSkills {
        SkillTitle: string;
        // other properties if any
    }
    const [positionTitle, setpositionTitle] = useState('');
    const [jobDescription, setjobDescription] = useState('');
    const [isAddPositionPopup, setisAddPositionPopup] = useState(false);
    const [isaddOnlySkill, setisaddOnlySkill] = useState(false);
    const [isEditPopup, setisEditPopup] = useState(false);
    const [skill, setSkill] = useState('');
    const [SkillOn, setSkillOn] = useState('');
    const [SkillOnEdit, setSkillOnEdit] = useState('');
    const [skills, setSkills]: any = useState([]);
    const [portfiloData, setportfiloData]: any = useState([]);
    const [skillsOnly, setskillsOnly]: any = useState([]);
    const [skillsOnlyAr, setskillsOnlyAr]: any = useState([]);
    const [SkillToUpdate, setSkillToUpdate]: any = useState([]);
    const [updatePositionId, setupdatePositionId]: any = useState();
    const [edittableItem, setEdittableItem]: any = useState(null)
    const headerTextEdit = `Edit Position - ${edittableItem ? edittableItem.Title : ''}`;
    const AddEditPositionClose = () => {
        props.AddEditPositionCLose();
    }
    const callBackData = React.useCallback((elem: any, getSelectedRowModel: any, ShowingData: any) => {
        console.log(elem)
    }, []);
    const getListData = () => {
        HRweb.lists.getById('e79dfd6d-18aa-40e2-8d6e-930a37fe54e4').items.getAll().then((response: any) => {
            const updatedData = response.map((itm: { JobSkills: string | undefined; ImpSkills?: { itemParentId: any; }[]; Id: any; }) => {
                if (itm.JobSkills !== undefined && itm.JobSkills !== '') {
                    const impSkills = JSON.parse(itm.JobSkills).map((skill: { itemParentId: any; }) => ({
                        ...skill,
                        itemParentId: itm.Id,
                    }));
                    return {
                        ...itm,
                        ImpSkills: impSkills,
                    };
                }
                return itm;
            });
            setportfiloData(updatedData);
        }).catch((error: unknown) => {
            console.error(error);
        });
    };
    const delPosition = (itm: any) => {
        HRweb.lists
            .getById('E79DFD6D-18AA-40E2-8D6E-930A37FE54E4')
            .items.getById(itm.Id).recycle().then(() => {
                let indexToRemove = -1;
                for (let i = 0; i < portfiloData.length; i++) {
                    if (portfiloData[i].Id === itm.Id) {
                        indexToRemove = i;
                        break;
                    }
                }

                if (indexToRemove !== -1) {
                    portfiloData.splice(indexToRemove, 1);
                    console.log("Item with specified Id removed from the array");
                } else {
                    console.log("Item with specified Id not found in the array");
                }
            }).catch((error: any) => {
                console.log(error)
            })
    }
    const columns = React.useMemo<ColumnDef<any, unknown>[]>(
        () => [
            {
                accessorKey: "Title",
                placeholder: "Title",
                header: "", size: 30,
            },
            {
                accessorFn: (row) => row?.ImpSkills,
                cell: ({ row }) => (
                    <>
                        {row?.original?.ImpSkills !== (null || undefined) ?
                            row?.original?.ImpSkills?.map((items: any) => {
                                return (
                                    // eslint-disable-next-line react/jsx-key
                                    <div className='block w-100'>
                                        <span className='width-90'>{items?.SkillTitle}</span>
                                        <span className='ml-auto svg__iconbox svg__icon--cross light' />
                                    </div>
                                )
                            })
                            : ""}
                        <span id="plusskill">
                            <a onClick={() => AddSkill(row)} title="Add Skill"><i className="fa fa-plus" /></a>
                        </span>
                    </>
                ),
                id: 'ProjectTitle',
                placeholder: "Skills",
                resetColumnFilters: false,
                header: "",
                size: 50,
            },
            { accessorKey: "PositionDescription", placeholder: "PositionDescription", header: "", size: 90, }, {
                cell: ({ row }) => (
                    <>
                        <a title="Edit" onClick={() => editPosition(row.original)}><svg xmlns="http://www.w3.org/2000/svg" width="30" height="25" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 21.9323V35.8647H13.3613H19.7226V34.7589V33.6532H14.3458H8.96915L9.0264 25.0837L9.08387 16.5142H24H38.9161L38.983 17.5647L39.0499 18.6151H40.025H41V13.3076V8H24H7V21.9323ZM38.9789 12.2586L39.0418 14.4164L24.0627 14.3596L9.08387 14.3027L9.0196 12.4415C8.98428 11.4178 9.006 10.4468 9.06808 10.2838C9.1613 10.0392 11.7819 9.99719 24.0485 10.0441L38.9161 10.1009L38.9789 12.2586ZM36.5162 21.1565C35.8618 21.3916 34.1728 22.9571 29.569 27.5964L23.4863 33.7259L22.7413 36.8408C22.3316 38.554 22.0056 39.9751 22.017 39.9988C22.0287 40.0225 23.4172 39.6938 25.1029 39.2686L28.1677 38.4952L34.1678 32.4806C41.2825 25.3484 41.5773 24.8948 40.5639 22.6435C40.2384 21.9204 39.9151 21.5944 39.1978 21.2662C38.0876 20.7583 37.6719 20.7414 36.5162 21.1565ZM38.5261 23.3145C39.2381 24.2422 39.2362 24.2447 32.9848 30.562C27.3783 36.2276 26.8521 36.6999 25.9031 36.9189C25.3394 37.0489 24.8467 37.1239 24.8085 37.0852C24.7702 37.0467 24.8511 36.5821 24.9884 36.0529C25.2067 35.2105 25.9797 34.3405 31.1979 29.0644C35.9869 24.2225 37.2718 23.0381 37.7362 23.0381C38.0541 23.0381 38.4094 23.1626 38.5261 23.3145Z" fill="#333333" /></svg></a>
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
                        <a onClick={() => delPosition(row.original)} className="ml-auto svg__iconbox svg__icon--trash" title="Delete" />
                    </>
                ),
                accessorKey: '',
                canSort: false,
                placeholder: '',
                header: '',
                id: 'row.original',
                size: 10,
            }
        ],
        [portfiloData]
    );
    // eslint-disable-next-line @typescript-eslint/no-empty-function

    const addMorePosition = () => {
        setisAddPositionPopup(true)
    };
    const AddMorePositionClose = () => {
        setisAddPositionPopup(false)
    };
    const editPosition = (item: any) => {
        setEdittableItem(item)
        setisEditPopup(true)
    };
    const editPositionClose = () => {
        setisEditPopup(false)
    };
    const handleTitleChange = (e: any) => {
        setpositionTitle(e.target.value);
    };
    const handleDescriptionChange = (e: any) => {
        setjobDescription(e.target.value);
    };
    const handleSkillChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {

        setSkill(event.target.value);
    };
    const handleSkillChangeOnly = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setSkillOn(event.target.value);
    };
    const handleSkillChangeEdit = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setSkillOnEdit(event.target.value);
    };

    const addSkill = () => {
        if (skill && skill.trim() !== '') {
            setSkills([...skills, skill]);
            setSkill('');
        }
    };
    const addSkillsOnly = () => {
        if (SkillOn && SkillOn.trim() !== '') {
            setskillsOnly([...skillsOnly, SkillOn]);
            setSkillOn('');
        }
    };
    const addSkillsOnlyEdit = () => {
        if (SkillOnEdit) {
            const obj = {
                SkillTitle: SkillOnEdit,
                current: 0,
                max: 10,
                Comment: '',
                PositionDescription: '',
            };
            edittableItem.ImpSkills.push(obj);
        }
        setSkillOnEdit('');
        setEdittableItem(edittableItem);
    };

    const removeSkill = (index: number) => {
        const updatedSkills = [...skills];
        updatedSkills.splice(index, 1);
        setSkills(updatedSkills);
    };
    const removeSmartSkillEdit = (skill: any) => {
        setskillsOnly((prevSkillsOnly: any[]) => prevSkillsOnly.filter(item => item !== skill));
    };
    const removeSmartSkillEditPop = (skilledit: { SkillTitle: any }) => {
        setEdittableItem((prevEdittableItem: { ImpSkills: any[]; }) => {
            const updatedImpSkills = prevEdittableItem.ImpSkills.filter(
                (item: { SkillTitle: any }) => item.SkillTitle !== skilledit.SkillTitle
            );

            // Create a new object for immutability, updating only the ImpSkills property
            const updatedEdittableItem = {
                ...prevEdittableItem,
                ImpSkills: updatedImpSkills,
            };

            return updatedEdittableItem;
        });
    };

    const AddSkill = (itm: Row<any>) => {
        setisaddOnlySkill(true)
        setSkillToUpdate(itm.original.ImpSkills)
        setupdatePositionId(itm.original.ID)
    };
    const addOnlySkillClose = () => {
        setisaddOnlySkill(false)
    };


    const updateChoiceField = async () => {
        const skillsCopy = [];
        if (skills && skills.length > 0) {
            for (const skill of skills) {
                if (skill && skill !== '') {
                    const obj = {
                        SkillTitle: skill,
                        current: 0,
                        max: 10,
                        Comment: '',
                        PositionDescription: jobDescription,
                    };

                    skillsCopy.push(obj);
                }
            }
        }
        try {
            await HRweb.lists.getById('E79DFD6D-18AA-40E2-8D6E-930A37FE54E4').items.add({
                Title: positionTitle,
                PositionDescription: jobDescription,
                JobSkills: JSON.stringify(skillsCopy),
            });
            alert("Position added successfully")
            setisAddPositionPopup(false);
            getListData();
        } catch (error) {
            console.error(error);
            setisAddPositionPopup(false)
        }
    };
    const updateSkillField = async () => {
        if (skillsOnly && skillsOnly.length > 0) {
            skillsOnly.forEach((itm: string) => {
                if (itm && itm !== '') {
                    const obj = {
                        SkillTitle: itm,
                        current: 0,
                        max: 10,
                        Comment: '',
                        PositionDescription: '',
                    };

                    SkillToUpdate.push(obj);
                }
            });

        }
        const postData = {
            "JobSkills": JSON.stringify(SkillToUpdate)
        }
        try {
            await HRweb.lists.getById('E79DFD6D-18AA-40E2-8D6E-930A37FE54E4').items.getById(updatePositionId).update(postData);
        } catch (error) {
            console.error(error);
        } finally {
            setskillsOnly([]);
            setisaddOnlySkill(false);
        }

    };
    const updatePosition = async () => {
        const postData = {
            "JobSkills": JSON.stringify(edittableItem.ImpSkills),
            "Title": edittableItem.Title,
            "PositionDescription": edittableItem.PositionDescription,
        }
        try {
            await HRweb.lists.getById('E79DFD6D-18AA-40E2-8D6E-930A37FE54E4').items.getById(edittableItem.Id).update(postData);
        } catch (error) {
            console.error(error);
        } finally {
            setskillsOnlyAr([]);
            setisEditPopup(false);
            getListData();
        }

    };

    return (
        <>
            <Panel
                headerText={"Add/Edit Positions"}
                isOpen={true}
                onDismiss={AddEditPositionClose}
                isBlocking={false}
                type={PanelType.large}
                closeButtonAriaLabel="Close"
            >
                <div className="panel panel-default">
                    <div className="panel-body">
                        <div className='text-right'>
                            <PrimaryButton className='text-end float-end mb-1' text="Add More Positions" onClick={() => addMorePosition()} />
                        </div>
                        {/* <div className='tbl-button'>
                            <span><PrimaryButton text="Add Team Member" style={{ zIndex: '9999' }} onClick={() => AddPopupOpen()} /></span>
                        </div>
                        <div className='tbl-button'>
                            <span><PrimaryButton text="Add/Edit Positions" style={{ zIndex: '9999' }} onClick={() => AddPopupOpen()} /></span>
                        </div> */}
                        {portfiloData && <div className='Alltable'><GlobalCommanTable columns={columns} data={portfiloData} showHeader={true} callBackData={callBackData} /></div>}
                    </div>
                </div>
                <footer className="bg-f4 fixed-bottom px-4 py-2">
                    <div className="float-end text-end">
                        <PrimaryButton onClick={AddEditPositionClose} text="Ok" />
                    </div>
                </footer>
            </Panel>
            <Panel
                headerText={"Add New Position"}
                isOpen={isAddPositionPopup}
                onDismiss={AddMorePositionClose}
                isBlocking={false}
                type={PanelType.medium}
                closeButtonAriaLabel="Close"
            >
                <div className="panel panel-default">
                    <div className="panel-body">
                        <div className="input-group">
                            <div className="full-width">Position Title</div>
                            <input className="form-control" value={positionTitle}
                                onChange={handleTitleChange} type="text" placeholder="New Position Title" />
                        </div>
                        <div className="input-group">
                            <div className="full-width">Job Description</div>
                            <textarea
                                className="form-control"
                                value={jobDescription}
                                onChange={handleDescriptionChange}
                                rows={3} // Set the number of rows as needed
                            />
                        </div>
                        <div className="input-group">
                            <label className="full_width">Skills Required</label>
                            <div className="col-sm-12 pad0">
                                <input
                                    className="form-control"
                                    placeholder="Skill"
                                    type="text"
                                    value={skill}
                                    onChange={handleSkillChange}
                                />
                                <span
                                    id="plusskill"
                                    style={{ display: skill === undefined || skill === '' ? 'none' : 'inline-block' }}
                                    className="input-addon-tag-icon"
                                    onClick={addSkill}
                                >
                                    <i className="fa fa-plus" />
                                </span>
                            </div>
                            <div className="col-md-12 pad0">
                                {skills.length > 0 &&
                                    skills.map((item: any, index: number) => (
                                        <span key={index} onClick={() => removeSkill(index)} className="block">
                                            {item}
                                            <span className="mx-auto svg__iconbox svg__icon--cross light" />
                                        </span>
                                    ))}
                            </div>
                        </div>
                    </div>

                    <footer className="bg-f4 fixed-bottom px-4 py-2">
                        <div className="float-end text-end">
                            <PrimaryButton onClick={updateChoiceField} text="Save" />
                            <PrimaryButton onClick={AddMorePositionClose} className='ms-1' text="Cancel" />
                        </div>
                    </footer>
                </div>
            </Panel>
            <Panel
                headerText={"Add New Skills"}
                isOpen={isaddOnlySkill}
                onDismiss={addOnlySkillClose}
                isBlocking={false}
                type={PanelType.large}
                closeButtonAriaLabel="Close"
            >
                <div className="panel panel-default">
                    <div className="panel-body">
                        <div className="container">
                            <div className="input-group">
                                <label className="full_width">Skills Required</label>
                                <div className="col-sm-12 pad0">
                                    <input
                                        className="form-control"
                                        placeholder="Skill"
                                        type="text"
                                        value={SkillOn}
                                        onChange={handleSkillChangeOnly}
                                    />
                                    <span
                                        id="plusskill"
                                        style={{ display: SkillOn === undefined || SkillOn === '' ? 'none' : 'inline-block' }}
                                        className="input-addon-tag-icon"
                                        onClick={addSkillsOnly}
                                    >
                                        <i className="fa fa-plus" />
                                    </span>
                                </div>
                                <div className="col-md-12 pad0">
                                    {skillsOnly.length > 0 &&
                                        skillsOnly.map((item: any, index: number) => (
                                            <span key={index} onClick={() => removeSmartSkillEdit(item)} className="block">
                                                {item}
                                                <span className="mx-auto svg__iconbox svg__icon--cross light" />
                                            </span>
                                        ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <footer className="bg-f4 fixed-bottom px-4 py-2">
                    <div className="float-end text-end">
                        <PrimaryButton onClick={updateSkillField} text="Save" />
                        <PrimaryButton onClick={AddEditPositionClose} className='ms-1' text="Cancel" />
                    </div>
                </footer>

            </Panel>
            <Panel
                headerText={headerTextEdit}
                isOpen={isEditPopup}
                onDismiss={editPositionClose}
                isBlocking={false}
                type={PanelType.medium}
                closeButtonAriaLabel="Close"
            >
                <div className="panel panel-default">
                    <div className="panel-body">
                        <div className="input-group">
                            <div className="full-width">Position Title</div>
                            <input className="form-control" value={edittableItem ? edittableItem.Title : ''} onChange={(e) => setEdittableItem({ ...edittableItem, Title: e.target.value })}
                                type="text" placeholder="New Position Title" />
                        </div>
                        <div className="input-group">
                            <div className="full-width">Job Description</div>
                            <textarea
                                className="form-control"
                                value={edittableItem ? edittableItem.PositionDescription : ''}
                                onChange={(e) => setEdittableItem({ ...edittableItem, PositionDescription: e.target.value })}
                                rows={3} // Set the number of rows as needed
                            />
                        </div>
                        <div className="input-group">
                            <label className="full_width">Skills Required</label>
                            <div className="col-sm-12 pad0">
                                <input
                                    className="form-control"
                                    placeholder="Add Skill"
                                    type="text"
                                    value={SkillOnEdit}
                                    onChange={handleSkillChangeEdit}
                                />
                                <IconButton
                                    id="plusskill"
                                    className="input-addon-tag-icon"
                                    value={SkillOnEdit}
                                    iconProps={{ iconName: 'Add' }}
                                    onClick={addSkillsOnlyEdit}
                                />
                            </div>
                            {/* Display the list of skills */}
                            <div className="col-md-12 pad0">
                                {edittableItem?.ImpSkills.map.length > 0 &&
                                    edittableItem?.ImpSkills.map((skillI: any, index: any) => (
                                        <span key={index} onClick={() => removeSmartSkillEditPop(skillI)} className="block">
                                            {skillI.SkillTitle}
                                            <span className="mx-auto svg__iconbox svg__icon--cross light" />
                                        </span>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>

                <footer className="bg-f4 fixed-bottom px-4 py-2">
                    <div className="float-end text-end">
                        <PrimaryButton onClick={updatePosition} text="Save" />
                        <PrimaryButton onClick={editPositionClose} className='ms-1' text="Cancel" />
                    </div>
                </footer>
            </Panel>
        </>
    );
};
export default AddEditPostion;


