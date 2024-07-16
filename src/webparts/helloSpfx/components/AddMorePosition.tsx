import * as React from 'react'
import { Panel, PrimaryButton, TextField, Dropdown, PanelType, IconButton } from 'office-ui-fabric-react';
import Tooltip from '../../../globalComponents/Tooltip';
import { HtmlEditorCard } from './FloraCommentBox';
import { Item, sp, Web } from 'sp-pnp-js';

const AddMorePosition = (props: any) => {
    const [positionTitle, setpositionTitle] = React.useState('');
    const [jobDescription, setjobDescription] = React.useState('');
    const [skill, setSkill] = React.useState('');
    const [skills, setSkills]: any = React.useState([]);
    const [portfiloData, setportfiloData]: any = React.useState([]);
    const [isSaveDisabled, setIsSaveDisabled] = React.useState(true)
    const HRweb = new Web(props?.siteUrl);

    const handleTitleChange = (e: any) => {
        const titleValue = e?.target?.value
        setpositionTitle(e.target.value);
        setIsSaveDisabled(titleValue.trim() === '')
    };

    const handleSkillChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setSkill(event.target.value);
    };

    const addSkill = () => {
        if (skill && skill.trim() !== '') {
            setSkills([...skills, skill]);
            setSkill('');
        }
    };

    const removeSkill = (index: number) => {
        const updatedSkills = [...skills];
        updatedSkills.splice(index, 1);
        setSkills(updatedSkills);
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

    const updateChoiceField = async () => {
        const newSkillsCopy = []
    
        try {
            const listItem = await HRweb.lists.getById(props?.skillsList).items.add({
                Title: positionTitle,
                PositionDescription: jobDescription,
            });
    
            // Get the ID of the newly added item
            const newItemId = listItem.data.Id;

            if (skills && skills.length > 0) {
                let isFirstIteration = true;
                for (const skill of skills) {
                    if (skill && skill !== '') {
                        const obj = {
                            SkillTitle: skill,
                            current: 0,
                            max: 10,
                            Comment: '',
                            PositionDescription: jobDescription,
                            itemParentId: newItemId
                        };
                        newSkillsCopy.push(obj);
                        if (isFirstIteration) {
                            const obj3 = {"SkillTitle":"Salary Expectations","current":0,"max":10,"Comment":"","PositionDescription":jobDescription, "itemParentId": newItemId}
                            const obj4 = {"SkillTitle":"Availability","current":0,"max":10,"Comment":"","PositionDescription":jobDescription, "itemParentId": newItemId}
                            newSkillsCopy.push(obj3);
                            newSkillsCopy.push(obj4);
                            isFirstIteration = false;
                        }   
                    }
                }
            }
            else if(skills.length == 0) {
            const obj9 = {"SkillTitle":"Salary Expectations","current":0,"max":10,"Comment":"","PositionDescription":jobDescription}
            const obj0 = {"SkillTitle":"Availability","current":0,"max":10,"Comment":"","PositionDescription":jobDescription}
            newSkillsCopy.push(obj9)
            newSkillsCopy.push(obj0) 
            }
            await HRweb.lists.getById(props?.skillsList).items.getById(newItemId).update({
                JobSkills: JSON.stringify(newSkillsCopy)
            });
    
            alert("Position added successfully")
            props?.callbackAdd()
            props?.closePopup()
        } catch (error) {
            console.error(error);
            props?.closePopup()
        }
    };

    const onRenderCustomHeaderMain = () => {
        return (
            <>
                <div className='subheading'>
                    Add New Position
                </div>
                <Tooltip ComponentId='7927' />
            </>
        );
    };

    const HtmlEditorCallBackAdd = React.useCallback((EditorData: any) => {
        if (EditorData.length > 8) {
            setjobDescription(EditorData);
        }
    }, [])

    return(
        <Panel
                onRenderHeader={onRenderCustomHeaderMain}
                isOpen={props?.openPopup}
                onDismiss={() => {props?.closePopup()}}
                isBlocking={false}
                type={PanelType.medium}
                closeButtonAriaLabel="Close"
            >
                <div className="modal-body">
                    <div className="input-group">
                        <div className="full-width">Position Title <span className="text-danger">*</span></div>
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
                        <button disabled={isSaveDisabled} onClick={updateChoiceField} type='button' className='btn btn-primary'>Save</button>
                        <button onClick={() => {props?.closePopup()}} type='button' className='btn btn-default ms-1'>Cancel</button>
                    </div>
                </footer>
            </Panel>
    )
}

export default AddMorePosition;
