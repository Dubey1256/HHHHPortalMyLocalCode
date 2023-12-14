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
    // const headerTextEdit = `Edit Position - ${edittableItem ? edittableItem.Title : ''}`;
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
                header: "", size: 155,
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
                                        <span className='ml-auto wid30 svg__iconbox svg__icon--cross light' />
                                    </div>
                                )
                            })
                            : ""}
                        <span id="plusskill">
                            <span className='svg__iconbox svg__icon--Plus' onClick={() => AddSkill(row)} title="Add Skill"></span>
                        </span>
                    </>
                ),
                id: 'ProjectTitle',
                placeholder: "Skills",
                resetColumnFilters: false,
                header: "",
                size: 400,
            },
            { accessorKey: "PositionDescription", placeholder: "Position Description", header: "", },
            {
                cell: ({ row }) => (
                    <div className='alignCenter'>
                        <span title="Edit" onClick={() => editPosition(row.original)} className="ml-auto hreflink svg__iconbox svg__icon--edit"></span>
                    </div>
                ),
                accessorKey: '',
                canSort: false,
                placeholder: '',
                header: '',
                id: 'row.original',
                size: 1,
            },
            {
                cell: ({ row }) => (
                    <div className='alignCenter'>
                        <span onClick={() => delPosition(row.original)} className="ml-auto svg__iconbox svg__icon--trash hreflink" title="Delete"></span>
                    </div>
                ),
                accessorKey: '',
                canSort: false,
                placeholder: '',
                header: '',
                id: 'row.original',
                size: 1,
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
    const onRenderCustomHeaderMain1 = () => {
        return (
            <>
                <div className='subheading'>
                    Add/Edit Positions
                </div>

            </>
        );
    };
    const onRenderCustomHeaderMain2 = () => {
        return (
            <>
                <div className='subheading'>
                    Add New Position
                </div>

            </>
        );
    };
    const onRenderCustomHeaderMain5 = () => {
        return (
            <>
                <div className='subheading'>
                    Add New Skills
                </div>

            </>
        );
    };
    const onRenderCustomHeaderMain6 = () => {
        return (
            <>
                <div className='subheading'>
                Edit Position {edittableItem ? edittableItem.Title : ''}
                </div>

            </>
        );
    };

    return (
        <>
            <Panel
                onRenderHeader={onRenderCustomHeaderMain1}
                isOpen={true}
                onDismiss={AddEditPositionClose}
                isBlocking={false}
                type={PanelType.large}
                closeButtonAriaLabel="Close"
            >
                <div className="modal-body mb-5 clearfix">
                    <div className='text-right'>
                        <button type='button' className="btnCol btn btn-primary text-end float-end mb-1" onClick={() => addMorePosition()} >Add More Positions</button>
                    </div>
                    {/* <div className='tbl-button'>
                        <span><PrimaryButton text="Add Team Member" style={{ zIndex: '9999' }} onClick={() => AddPopupOpen()} /></span>
                    </div>
                    <div className='tbl-button'>
                        <span><PrimaryButton text="Add/Edit Positions" style={{ zIndex: '9999' }} onClick={() => AddPopupOpen()} /></span>
                    </div> */}
                    {portfiloData && <div className='Alltable'><GlobalCommanTable columns={columns} data={portfiloData} showHeader={true} callBackData={callBackData} /></div>}
                </div>
                <footer className="bg-f4 fixed-bottom px-4 py-2">
                    <div className="float-end text-end">
                        <button onClick={AddEditPositionClose} type='button' className='btn btn-primary'>Ok</button>
                    </div>
                </footer>
            </Panel>
            <Panel
                onRenderHeader={onRenderCustomHeaderMain2}
                isOpen={isAddPositionPopup}
                onDismiss={AddMorePositionClose}
                isBlocking={false}
                type={PanelType.medium}
                closeButtonAriaLabel="Close"
            >
                <div className="modal-body">
                    <div className="input-group">
                        <div className="full-width">Position Title</div>
                        <input className="form-control" value={positionTitle}
                            onChange={handleTitleChange} type="text" placeholder="New Position Title" />
                    </div>
                    <div className="input-group my-3">
                        <div className="full-width">Job Description</div>
                        <textarea
                            className="form-control"
                            value={jobDescription}
                            onChange={handleDescriptionChange}
                            rows={3} // Set the number of rows as needed
                        />
                    </div>
                    <div className="input-group mb-3">
                        <label className="full_width">Skills Required</label>
                            <input
                                className="form-control"
                                placeholder="Skill"
                                type="text"
                                value={skill}
                                onChange={handleSkillChange}
                            />
                            <div className='col-12 mt-1'>
                            <span
                                id="plusskill"
                                style={{ display: skill === undefined || skill === '' ? 'none' : 'inline-block' }}
                                className="svg__iconbox hreflink svg__icon--Plus"
                                onClick={addSkill}
                            >
                            </span></div>
                        <div className="col-md-12 pad0">
                            {skills.length > 0 &&
                                skills.map((item: any, index: number) => (
                                    <span key={index} onClick={() => removeSkill(index)} className="block me-1">
                                        {item}
                                        <span className="mx-auto ms-2 svg__iconbox svg__icon--cross light" />
                                    </span>
                                ))}
                        </div>
                    </div>
                </div>

                <footer className="py-2 clearfix">
                    <div className="float-end text-end">
                        <button onClick={updateChoiceField} type='button' className='btn btn-primary'>Save</button>
                        <button onClick={AddMorePositionClose} type='button' className='btn btn-default ms-1'>Cancel</button>
                    </div>
                </footer>
            </Panel>
            <Panel
                onRenderHeader={onRenderCustomHeaderMain5}
                isOpen={isaddOnlySkill}
                onDismiss={addOnlySkillClose}
                isBlocking={false}
                type={PanelType.medium}
                closeButtonAriaLabel="Close"
            >
                <div className="modal-body">
                    <div className="input-group">
                        <label className="full_width form-label">Skills Required</label>
                            <input
                                className="form-control"
                                placeholder="Skill"
                                type="text"
                                value={SkillOn}
                                onChange={handleSkillChangeOnly}
                            />
                            <div className='ms-1 mt-1'>
                                <span
                                    id="plusskill"
                                    style={{ display: SkillOn === undefined || SkillOn === '' ? 'none' : 'inline-block' }}
                                    className="svg__iconbox svg__icon--Plus hreflink"
                                    onClick={addSkillsOnly}>
                                </span>
                            </div>
                        <div className="col-md-12 pad0">
                            {skillsOnly.length > 0 &&
                                skillsOnly.map((item: any, index: number) => (
                                    <div key={index} onClick={() => removeSmartSkillEdit(item)} className="block me-1">
                                        <a className='wid90 '>{item}</a>
                                        <span className="bg-light hreflink ms-2 ml-auto svg__icon--cross svg__iconbox" />
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
                <footer className="py-2 clearfix">
                    <div className="float-end text-end">
                        <button onClick={updateSkillField} type='button' className='btn btn-primary'>Save</button>
                        <button onClick={AddEditPositionClose} type='button' className='btn btn-default ms-1'>Cancel</button>
                    </div>
                </footer>

            </Panel>
            <Panel
                // headerText={headerTextEdit}
                onRenderHeader={onRenderCustomHeaderMain6}
                isOpen={isEditPopup}
                onDismiss={editPositionClose}
                isBlocking={false}
                type={PanelType.medium}
                closeButtonAriaLabel="Close"
            >
                <div className="panel panel-default">
                    <div className="modal-body">
                        <div className="input-group">
                            <div className="full-width">Position Title</div>
                            <input className="form-control" value={edittableItem ? edittableItem.Title : ''} onChange={(e) => setEdittableItem({ ...edittableItem, Title: e.target.value })}
                                type="text" placeholder="New Position Title" />
                        </div>
                        <div className="input-group my-3">
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
                                <input
                                    className="form-control"
                                    placeholder="Add Skill"
                                    type="text"
                                    value={SkillOnEdit}
                                    onChange={handleSkillChangeEdit}
                                />
                                <div id="plusskill" className='mt-1 ms-1'>
                                    <span 
                                    // value={SkillOnEdit}
                                    // iconProps={{ iconName: 'Add' }}
                                    onClick={addSkillsOnlyEdit} className='svg__iconbox svg__icon--Plus'></span>
                                </div>
                                {/* <IconButton
                                    id="plusskill"
                                    className="input-addon-tag-icon"
                                    value={SkillOnEdit}
                                    iconProps={{ iconName: 'Add' }}
                                    onClick={addSkillsOnlyEdit}
                                /> */}
                            {/* Display the list of skills */}
                            <div className="col-md-12 pad0">
                                {edittableItem?.ImpSkills.map.length > 0 &&
                                    edittableItem?.ImpSkills.map((skillI: any, index: any) => (
                                        <span key={index} onClick={() => removeSmartSkillEditPop(skillI)} className="block me-1">
                                            {skillI.SkillTitle}
                                            <span className="mx-auto ms-2 svg__iconbox svg__icon--cross light" />
                                        </span>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>

                <footer className="py-2 clearfix">
                    <div className="float-end text-end">
                        <button onClick={updatePosition} type='button' className='btn btn-primary'>Save</button>
                        <button onClick={editPositionClose} type='button' className='btn btn-default ms-1'>Cancel</button>
                    </div>
                </footer>
            </Panel>
        </>
    );
};
export default AddEditPostion;


