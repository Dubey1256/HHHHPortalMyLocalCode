import * as React from 'react'
import { Panel, PrimaryButton, TextField, Dropdown, PanelType, IconButton } from 'office-ui-fabric-react';
import Tooltip from '../../../globalComponents/Tooltip';
import { HtmlEditorCard } from './FloraCommentBox';
import { Item, sp, Web } from 'sp-pnp-js';
import moment from 'moment';
let editTableItem: any

const EditPosition = (props: any) => {
    const [SkillOnEdit, setSkillOnEdit] = React.useState('');
    const [portfiloData, setportfiloData]: any = React.useState([]);
    const [edittableItem, setEdittableItem]: any = React.useState(null)
    const [skillsOnlyAr, setskillsOnlyAr]: any = React.useState([]);

    React.useEffect(() => {
        if (edittableItem == null && (props?.edittableItem != null && props?.edittableItem != undefined)) {
            setEdittableItem(props?.edittableItem)
        }
    }, [])

    const HRweb = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/HR');
    

    const handleSkillChangeEdit = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setSkillOnEdit(event.target.value);
    };

    const HtmlEditorCallBackEdit = React.useCallback((EditorDataEdit: any) => {
        if (EditorDataEdit.length > 8) {
            setEdittableItem({ ...edittableItem, PositionDescription: EditorDataEdit });
        }
    }, [edittableItem]);

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

    const getListData = () => {
        HRweb.lists
            .getById(props?.skillsList)
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

    const delPosition = (itm: any) => {
        const isConfirmed = window.confirm(`Are you sure you want to delete the position titled "${itm.Title}"?`);
        if (isConfirmed) {
            HRweb.lists
                .getById(props?.skillsList)
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

    const updatePosition = async () => {
        const postData = {
            "JobSkills": JSON.stringify(edittableItem.ImpSkills),
            "Title": edittableItem.Title,
            "PositionDescription": edittableItem.PositionDescription,
        }
        try {
            await HRweb.lists.getById(props?.skillsList).items.getById(edittableItem.Id).update(postData);
        } catch (error) {
            console.error(error);
        } finally {
            setskillsOnlyAr([]);
            props?.closePopup()
            getListData();
        }

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
return (
    <>
     <Panel
                onRenderHeader={onRenderCustomHeaderMain6}
                isOpen={props?.openPopup}
                onDismiss={() => {props?.closePopup()}}
                isBlocking={props?.openPopup}
                type={PanelType.medium}
                closeButtonAriaLabel="Close"
            >
                <div className="modal- mb-5">
                    <div className="input-group">
                        <div className="full-width">Position Title</div>
                        <input className="form-control" value={edittableItem ? edittableItem?.Title : ''} onChange={(e) => setEdittableItem({ ...edittableItem, Title: e.target.value })}
                            type="text" placeholder="New Position Title" />
                    </div>
                    <div className="input-group my-3">
                        <div className="full-width">Job Description</div>
                        {edittableItem && (
                            <HtmlEditorCard
                                editorValue={edittableItem?.PositionDescription || ''}
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
                            {edittableItem?.ImpSkills?.map.length > 0 &&
                                edittableItem?.ImpSkills?.map((skillI: any, index: any) => (
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
                                        ? moment(edittableItem?.Created).format("DD/MM/YYYY")
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
                                        ? moment(edittableItem?.Modified).format("DD/MM/YYYY")
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
                            <button onClick={() => {props?.closePopup()}} type='button' className='btn btn-default ms-1'>Cancel</button>
                        </div>
                    </div>
                </footer>
            </Panel>
    </>
)
}

export default EditPosition