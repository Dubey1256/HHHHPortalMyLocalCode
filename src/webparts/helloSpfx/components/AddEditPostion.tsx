import { Panel, PrimaryButton, TextField, Dropdown, PanelType, IconButton } from 'office-ui-fabric-react';
import * as React from 'react';
import Moment from "moment";
import Tooltip from '../../../globalComponents/Tooltip';
import { Item, sp, Web } from 'sp-pnp-js';
//import ReactHtmlParser from 'react-html-parser';
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
import { HtmlEditorCard } from './FloraCommentBox';
import AddMorePosition from './AddMorePosition';
import EditPosition from './EditPosition';
let portfiloData: any[] = [];


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
    const [jobDescription, setjobDescription] = useState('');
    const [isAddPositionPopup, setisAddPositionPopup] = useState(false);
    const [isaddOnlySkill, setisaddOnlySkill] = useState(false);
    const [isEditPopup, setisEditPopup] = useState(false);
    const [SkillOn, setSkillOn] = useState('');
    const [portfiloData, setportfiloData]: any = useState([]);
    const [skillsOnly, setskillsOnly]: any = useState([]);
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

    let allListID = {
        SkillsPortfolioListID: props?.props?.SkillsPortfolioListID,
        siteUrl: props?.props?.siteUrl
    }

    const HRweb = new Web(allListID?.siteUrl);
    const getListData = () => {
        HRweb.lists
            .getById(allListID?.SkillsPortfolioListID)
            .items
            .select('Id', 'Title', 'PositionTitle', 'PositionDescription', 'JobSkills', 'Created', 'Modified', 'Author/Id', 'Author/Title', 'Editor/Id', 'Editor/Title')
            .expand('Author', 'Editor')
            .getAll()
            .then((response: any) => {
                const updatedData = response.map((itm: { JobSkills: string | undefined; ImpSkills?: { itemParentId: any; }[]; Id: any; Created: any; Modified: any; Author: { Id: any; Title: any; }; Editor: { Id: any; Title: any; }; }) => {
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
            })
            .catch((error: unknown) => {
                console.error(error);
            });
    };

    const stripHtmlTags = (html: string) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    };
    const delPosition = (itm: any) => {
        const isConfirmed = window.confirm(`Are you sure you want to delete the position titled "${itm.Title}"?`);
        if (isConfirmed) {
            HRweb.lists
                .getById(allListID?.SkillsPortfolioListID)
                .items.getById(itm.Id)
                .recycle()
                .then(() => {
                    const filteredItems = portfiloData.filter((data: { Id: any; }) => data.Id !== itm.Id);
                    setportfiloData(filteredItems)
                })
                .catch((error: any) => {
                    console.log(error);
                });
        }
    };

    const columns = React.useMemo<ColumnDef<any, unknown>[]>(
        () => [
            {
                accessorKey: "Title",
                placeholder: "Title",
                header: "",
                size: 155,
            },
            {
                accessorFn: (row) => row?.ImpSkills,
                cell: ({ row }) => (
                    <>
                        {row?.original?.ImpSkills !== (null || undefined) ?
                            row?.original?.ImpSkills?.map((items: any) => (
                                <div className='block w-100' key={items?.SkillTitle}>
                                    <span className='width-90'>{items?.SkillTitle}</span>
                                    <span className='ml-auto wid30 svg__iconbox svg__icon--cross light' />
                                </div>
                            ))
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
            {
                accessorKey: "PositionDescription",
                placeholder: "Position Description",
                header: "",
                // Custom cell rendering to remove HTML tags
                cell: ({ row }) => (
                    <div dangerouslySetInnerHTML={{ __html: row.original.PositionDescription ? stripHtmlTags(row.original.PositionDescription) : '' }} />
                ),
            },
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
    
    const handleSkillChangeOnly = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setSkillOn(event.target.value);
    };
    
    const addSkillsOnly = () => {
        if (SkillOn && SkillOn.trim() !== '') {
            setskillsOnly([...skillsOnly, SkillOn]);
            setSkillOn('');
        }
    };
    
    const removeSmartSkillEdit = (skill: any) => {
        setskillsOnly((prevSkillsOnly: any[]) => prevSkillsOnly.filter(item => item !== skill));
    };
    
    const AddSkill = (itm: Row<any>) => {
        setisaddOnlySkill(true)
        setSkillToUpdate(itm.original.ImpSkills)
        setupdatePositionId(itm.original.ID)
    };
    const addOnlySkillClose = () => {
        setisaddOnlySkill(false)
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
            await HRweb.lists.getById(allListID?.SkillsPortfolioListID).items.getById(updatePositionId).update(postData);
        } catch (error) {
            console.error(error);
        } finally {
            setskillsOnly([]);
            setisaddOnlySkill(false);
        }

    };
    
    const onRenderCustomHeaderMain1 = () => {
        return (
            <>
                <div className='subheading'>
                    Add/Edit Positions
                </div>
                <Tooltip ComponentId='5642' />
            </>
        );
    };
    
    const onRenderCustomHeaderMain5 = () => {
        return (
            <>
                <div className='subheading'>
                    Add New Skills
                </div>
                <Tooltip ComponentId='7928' />
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
            {isAddPositionPopup && <AddMorePosition siteUrl={allListID?.siteUrl} skillsList={allListID?.SkillsPortfolioListID} openPopup={isAddPositionPopup} closePopup={AddMorePositionClose}/>}
            {isEditPopup && <EditPosition siteUrl={allListID?.siteUrl} skillsList={allListID?.SkillsPortfolioListID} edittableItem={edittableItem} openPopup={isEditPopup} closePopup={editPositionClose}/>}
        </>
    );
};
export default AddEditPostion;


