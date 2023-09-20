import { Panel, PanelType } from 'office-ui-fabric-react'
import React, { useState } from 'react'
import { Web } from "sp-pnp-js";
import * as Moment from 'moment';
import Button from 'react-bootstrap/Button';
const AddMeeting = (props: any) => {
    const [title, settitle] = React.useState('')
    const [lgShow, setLgShow] = useState(false);
    const [editDate, setEditDate]: any = React.useState(undefined);
    const [selectDateName, setSelectDateName]: any = React.useState(undefined);
    const OpenCreateTaskPopup = () => {
        setLgShow(true)
    }
    const addFunction = async () => {
        if (title?.length > 0) {
            let web = new Web(props?.AllListId?.siteUrl);
            await web.lists.getById(props?.AllListId?.MasterTaskListID).items
                .select("Id,Title,PortfolioLevel,PortfolioStructureID").filter("Item_x0020_Type eq 'Meeting'")
                .top(1).orderBy('PortfolioLevel', false)
                .get().then(async (res: any) => {
                    let portfolioLevel = 1;
                    if (res?.length > 0) {
                        portfolioLevel = res[0].PortfolioLevel + 1
                    }

                    await web.lists.getById(props?.AllListId?.MasterTaskListID).items.add({
                        Title: `${title}`,
                        Item_x0020_Type: "Meeting",
                        PortfolioLevel: portfolioLevel,
                        DueDate: editDate,
                        PortfolioStructureID: `M${portfolioLevel}`,
                    }).then((res: any) => {
                        closePopup()
                        props?.CallBack()

                    })

                })

        } else {
            alert("Please Enter Meeting Title")
        }

    }
    const closePopup = () => {
        settitle('')
        setEditDate(null)
        setSelectDateName('')
        setLgShow(false)

    }
    const duedatechange = (item: any) => {
        let dates = new Date();
        setSelectDateName(item)
        if (item === 'Today') {
            setEditDate(dates)
        }
        if (item === 'Tommorow') {
            setEditDate(dates.setDate(dates.getDate() + 1))
        }
        if (item === 'This Week') {
            setEditDate(new Date(dates.setDate(dates.getDate() - dates.getDay() + 7)))
        }
        if (item === 'Next Week') {
            let nextweek = new Date(dates.setDate(dates.getDate() - (dates.getDay() - 1) + 6));
            setEditDate(nextweek.setDate(nextweek.getDate() - (nextweek.getDay() - 1) + 6))
        }
        if (item === 'This Month') {
            let lastDay = new Date(dates.getFullYear(), dates.getMonth() + 1, 0);;
            setEditDate(lastDay)
        }
    }
        const onRenderCustomHeader = () => {
            return (
                <div className="d-flex full-width pb-1" >
                    <div className="subheading">
                        <span className="siteColor">
                            {`Create Meeting`}
                        </span>
                    </div>
                </div>
            );
        };


        return (
            <>
                <button type="button" className='btn btn-primary mb-2 btnCol' onClick={() => OpenCreateTaskPopup()}>Create Meeting</button>

                <Panel
                    onRenderHeader={onRenderCustomHeader}
                    type={PanelType.medium}
                    isOpen={lgShow}
                    onDismiss={() => closePopup()}
                    isBlocking={false}>

                    <div className='Create-Projectpoup border mb-2 mt-2 p-2'>
                        <span >
                            <div>
                                <span>
                                    <input type='text' className='form-control' placeholder='Meeting Title' value={title} onChange={(e) => { settitle(e.target.value) }} />
                                </span>
                            </div>
                        </span>
                        <div className="mt-3 mb-3 d-flex flex-column">
                            <label htmlFor=""> Meeting Date</label>
                            <input className="form-check-input p-3 w-100"
                                type='date'
                                value={editDate != null ? Moment(new Date(editDate)).format('YYYY-MM-DD') : ''}
                                onChange={(e: any) => setEditDate(e.target.value)} />

                            <div className='d-flex flex-column mt-2 mb-2'>
                                <span className='SpfxCheckRadio'>
                                    <input className='radio' type="radio" value="Male" name="date" checked={selectDateName == 'Today'} onClick={() => duedatechange('Today')} /> Today</span>
                                <span className='SpfxCheckRadio'>
                                    <input className='radio' type="radio" value="Female" name="date" checked={selectDateName == 'Tommorow'} onClick={() => duedatechange('Tommorow')} /> Tommorow
                                </span>
                                <span className='SpfxCheckRadio'>
                                    <input className='radio' type="radio" value="Other" name="date" checked={selectDateName == 'This Week'} onClick={() => duedatechange('This Week')} /> This Week
                                </span>
                                <span className='SpfxCheckRadio'>
                                    <input className='radio' type="radio" value="Female" name="date" checked={selectDateName == 'Next Week'} onClick={() => duedatechange('Next Week')} /> Next Week
                                </span>
                                <span className='SpfxCheckRadio'>
                                    <input className='radio' type="radio" value="Female" name="date" checked={selectDateName == 'This Month'} onClick={() => duedatechange('This Month')} /> This Month
                                </span>

                            </div>
                        </div>
                    </div>
                    <footer className='text-end'>
                        <Button type="button" variant="primary" className='me-1' onClick={() => addFunction()}>Create</Button>
                        <Button type="button" className="btn btn-default" variant="secondary" onClick={() => closePopup()}>Cancel</Button>

                    </footer>
                </Panel>
            </>
        )
    }

    export default AddMeeting