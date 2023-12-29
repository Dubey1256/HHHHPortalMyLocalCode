/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Panel, PanelType } from 'office-ui-fabric-react';
import * as React from 'react';
import Moment from "moment";
import Tooltip from '../../../globalComponents/Tooltip';
import { Web } from 'sp-pnp-js';
import {ColumnDef, Row} from "@tanstack/react-table";
import GlobalCommanTable from '../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable';
import { useEffect, useState } from 'react';
import HtmlEditorCard from '../../helloSpfx/components/FloraCommentBox';


const LandingPage = (props: any) => { 
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
    const HRweb = new Web(props?.props.Context.pageContext.web.absoluteUrl);
    useEffect(() => {
        getListData();
    }, []);   
    const getListData = () => {
        HRweb.lists.getById(props?.props.InterviewFeedbackFormListId).items.select('Id', 'Title', 'PositionTitle', 'PositionDescription', 'JobSkills', 'Created', 'Modified', 'Author/Id', 'Author/Title', 'Editor/Id', 'Editor/Title')
            .expand('Author', 'Editor').getAll().then((response: any) => { 
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
        const confirmDelete = window.confirm("Are you sure you want to delete this item?");
        if (confirmDelete) {
            HRweb.lists.getById(props?.props.InterviewFeedbackFormListId)
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
    }
    const AddEditPositionClose = () => {
        props.AddEditPositionCLose();
    }
    const callBackData = React.useCallback((elem: any, getSelectedRowModel: any, ShowingData: any) => {
        console.log(elem)
    }, []);
    const stripHtmlTags = (html: string) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    };
    const columns = React.useMemo<ColumnDef<any, unknown>[]>(
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
                cell: ({ row, getValue }) => (
                    <a
                        className="text-content hreflink"
                        title={row?.original?.Title}
                        data-interception="off"
                        target="_blank"
                        href={`${props?.props.Context.pageContext.web.absoluteUrl}/SitePages/RecruitmentTool.aspx?PositionId=${row?.original?.Id}`}
                    >
                        {row?.original?.Title}
                    </a>
                ),
                id: "Title",
                placeholder: "Title",
                resetColumnFilters: false,
                header: "",
                size: 157
            },

            {
                accessorFn: (row) => row?.ImpSkills,
                cell: ({ row }) => (
                    <>
                        {row?.original?.ImpSkills !== (null || undefined) ?
                            row?.original?.ImpSkills?.map((items: any, index: number) => (
                                // eslint-disable-next-line react/jsx-key
                                <React.Fragment key={index}>
                                    <span className='width-90'>{items?.SkillTitle}</span>
                                    {index < row.original.ImpSkills.length - 1 && <span>,</span>}
                                </React.Fragment>
                            ))
                            : ""}
                    </>
                ),
                id: 'ProjectTitle',
                placeholder: "Skills",
                resetColumnFilters: false,
                header: "",
                size: 500,
            },
            {
                accessorFn: (row) => row?.PositionDescription,
                cell: ({ row, getValue }) => (
                    <div className="columnFixedTitle">
                        <div className="text-content" title={stripHtmlTags(row.original.PositionDescription)} dangerouslySetInnerHTML={{ __html: row.original.PositionDescription ? stripHtmlTags(row.original.PositionDescription) : '' }} />
                    </div>

                ),
                id: "PositionDescription",
                placeholder: "PositionDescription",
                resetColumnFilters: false,
                header: "",
                size: 500
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
    const handleTitleChange = (e: any) => {
        setpositionTitle(e.target.value);
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
            await HRweb.lists.getById(props?.props.InterviewFeedbackFormListId).items.add({
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
            await HRweb.lists.getById(props?.props.InterviewFeedbackFormListId).items.getById(updatePositionId).update(postData);
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
            await HRweb.lists.getById(props?.props.InterviewFeedbackFormListId).items.getById(edittableItem.Id).update(postData);
        } catch (error) {
            console.error(error);
        } finally {
            setskillsOnlyAr([]);
            setisEditPopup(false);
            getListData();
        }

    };
    const onRenderCustomHeaderMain2 = () => {
        return (
            <>
                <div className='subheading'>
                    Add New Position
                </div>
                <Tooltip ComponentId='7927' />
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
    const onRenderCustomHeaderMain6 = () => {
        return (
            <>
                <div className='subheading'>
                    Edit Position - {edittableItem ? edittableItem.Title : ''}
                </div>
                <Tooltip ComponentId='7929' />
            </>
        );
    };
    const HtmlEditorCallBackAdd = React.useCallback((EditorData: any) => {
        if (EditorData.length > 8) {
            setjobDescription(EditorData);
        }
    }, [])
    const HtmlEditorCallBackEdit = React.useCallback((EditorDataEdit: any) => {
        if (EditorDataEdit.length > 8) {
            setEdittableItem({ ...edittableItem, PositionDescription: EditorDataEdit });
        }
    }, [edittableItem]);

    return (
        <>
            <h2 className='heading'>Recruitment-LandingPage</h2>
            <div className="container">
                <div className="mb-5 clearfix">
                    <div className="text-right">
                        <button
                            type="button"
                            className="btnCol btn btn-primary text-end float-end mb-1"
                            onClick={addMorePosition}
                        >
                            Add More Positions
                        </button>
                    </div>
                    {portfiloData && (
                        <div className="Alltable">
                            <GlobalCommanTable columns={columns} fixedWidth={true} data={portfiloData} showHeader={true} callBackData={callBackData} />
                        </div>
                    )}
                </div>
            </div>
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
                        <HtmlEditorCard
                            editorValue={jobDescription !== undefined && jobDescription !== null ? jobDescription : ''}
                            HtmlEditorStateChange={HtmlEditorCallBackAdd}
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
                            {edittableItem && (
                                <HtmlEditorCard
                                    editorValue={edittableItem.PositionDescription || ''}
                                    HtmlEditorStateChange={HtmlEditorCallBackEdit}
                                />
                            )}
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
                                    onClick={addSkillsOnlyEdit} className='svg__iconbox svg__icon--Plus'></span>
                            </div>
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
                    <footer className="bg-f4 fixed-bottom position-absolute px-4 py-2">
                        <div className="align-items-center d-flex justify-content-between me-3">
                            <div>
                                <div className="">
                                    Created{" "}
                                    <span className="font-weight-normal siteColor">
                                        {" "}
                                        {edittableItem?.Created
                                            ? Moment(edittableItem?.Created).format("DD/MM/YYYY")
                                            : ""}{" "}
                                    </span>{" "}
                                    By{" "}
                                    <span className="font-weight-normal siteColor">
                                        {edittableItem?.Author?.Title ? edittableItem?.Author?.Title : ""}
                                    </span>
                                </div>
                                <div>
                                    Last modified{" "}
                                    <span className="font-weight-normal siteColor">
                                        {" "}
                                        {edittableItem?.Modified
                                            ? Moment(edittableItem?.Modified).format("DD/MM/YYYY")
                                            : ""}
                                    </span>{" "}
                                    By{" "}
                                    <span className="font-weight-normal siteColor">
                                        {edittableItem?.Editor?.Title ? edittableItem?.Editor.Title : ""}
                                    </span>
                                </div>
                                <div>
                                    <a className="hreflink siteColor">
                                        <span className="alignIcon svg__iconbox hreflink mini svg__icon--trash"></span>
                                        <span
                                            onClick={() => delPosition(edittableItem?.ID)}
                                        >
                                            Delete This Item
                                        </span>
                                    </a>
                                </div>
                            </div>
                            <div className="float-end text-end">
                                <button onClick={updatePosition} type='button' className='btn btn-primary'>Save</button>
                                <button onClick={editPositionClose} type='button' className='btn btn-default ms-1'>Cancel</button>
                            </div>
                        </div>
                    </footer>
                    </div>
            </Panel>
        </>
    );
};
export default LandingPage;


