import { Panel, PanelType } from 'office-ui-fabric-react'
import React, { useState } from 'react'
import { Web } from "sp-pnp-js";
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import * as Moment from 'moment';
import Button from 'react-bootstrap/Button';
import * as globalCommon from "../../../globalComponents/globalCommon";
import { Card, CardHeader, CardPreview } from "@fluentui/react-components";
import AddTaskConfigPopup from './AddTaskConfigPopup';
import GlobalTooltip from '../../../globalComponents/Tooltip';
import { Tooltip } from "@fluentui/react-components";
import VersionHistory from '../../../globalComponents/VersionHistroy/VersionHistory'
let users: any = []
let PortFolioType: any = [];
let SelectedPortfolio: any

export const NotificationsAddPopup = (props: any) => {
    const [selectedConfigType, setselectedConfigType] = React.useState('Report')
    const [ConfigTitle, setConfigTitle] = React.useState('')
    const [EmailSubjectReport, setEmailSubjectReport] = React.useState('')
    const [editTaskconfigData, setEditTaskconfigData]: any = React.useState()
    const [allTaskStatusToConfigure, setAllTaskStatusToConfigure]: any = React.useState([]);
    const [selectedPersonsAndGroups, setSelectedPersonsAndGroups] = React.useState([]);
    const [TaskStatus, setTaskStatus]: any = React.useState([])
    const [DefaultSelectedUser, setDefaultSelectedUser] = React.useState([]);
    const [percentageComplete, setPercentageComplete]: any = React.useState()
    const [openAddConfigPopup, setOpenAddConfigPopup] = React.useState(false)
    const [openEditConfigPopup, setOpenEditConfigPopup] = React.useState(false)
    React.useEffect(() => {
        if (props?.SelectedEditItem?.ConfigType != undefined) {
            setselectedConfigType(props?.SelectedEditItem?.ConfigType)
            if (props?.SelectedEditItem?.ConfigType == "Report") {
                setConfigTitle(props?.SelectedEditItem?.Title)
                setEmailSubjectReport(props?.SelectedEditItem?.Subject)
                setSelectedPersonsAndGroups(props?.SelectedEditItem?.Recipients)
                let DefaultSelectedUseremail: any = []
                if (props?.SelectedEditItem?.Recipients?.length > 0) {
                    props?.SelectedEditItem?.Recipients?.map((data: any) => {
                        DefaultSelectedUseremail.push(data?.Email)
                    })
                    setDefaultSelectedUser(DefaultSelectedUseremail)
                }

            }
        }
        Promise.all([loadusersAndGroups(), getPortFolioType()])

    }, [])

    const handlePeopleChange = (people: any) => {
        setSelectedPersonsAndGroups(people)
        // console.log(people)
    }
    const onRenderCustomHeader = () => {
        return (
            <>
                <div className='subheading'>
                    {props?.SelectedEditItem?.Id != undefined ? `Edit Configuration - ${props?.SelectedEditItem?.Title}` : 'Add Configuration'}
                </div>
                <GlobalTooltip ComponentId={'6755'} />
            </>
        );
    };

    const closePopup = (type?: any | undefined) => {
        props.callBack(type);

    }
    const loadusersAndGroups = async () => {
        let pageInfo = await globalCommon.pageContext()
        if (pageInfo?.WebFullUrl) {
            let web = new Web(pageInfo.WebFullUrl);
            await web.siteUsers.get().then((userData) => {
                console.log(userData)
                users = userData
            }).catch((error: any) => {
                console.log(error)
            });
        }

    }
    const addFunction = async () => {
        let pageInfo = await globalCommon.pageContext()
        let postData: any;
        let updateData: any;
        let peopleAndGroupId: any = [];
        let applyPost = true;
        selectedPersonsAndGroups?.map((user: any) => {
            let foundPerson = users?.find((person: any) => (person?.LoginName == user?.id) || (person?.Title == user?.Title));
            if (foundPerson?.Id != undefined) {
                peopleAndGroupId?.push(foundPerson?.Id)
            }
        })
        if (props?.SelectedEditItem?.Id == undefined) {
            if (selectedConfigType == "Report") {
                if (pageInfo?.WebFullUrl) {
                    if (peopleAndGroupId.length > 0 && ConfigTitle != '' && ConfigTitle != null) {
                        postData = {
                            Title: ConfigTitle,
                            RecipientsId: { 'results': peopleAndGroupId },
                            Subject: EmailSubjectReport,
                            ConfigType: selectedConfigType
                        }
                    } else {
                        applyPost = false;
                        alert("Please fill the Report Recipient and Report Title")
                    }

                }
            }
            else {
                if (SelectedPortfolio?.Title != '' && SelectedPortfolio?.Title != null) {
                    postData = {
                        Title: "TaskNotificationConfig" + "" + SelectedPortfolio?.Title,
                        ConfigType: selectedConfigType,
                        PortfolioTypeId: SelectedPortfolio?.Id,
                        ConfigrationJSON: allTaskStatusToConfigure?.length > 0 ? JSON?.stringify(allTaskStatusToConfigure) : []
                    }
                }
                else {
                    applyPost = false;
                    alert("Please Select Portfolio Type")
                }
            }



            if (applyPost) {

                let web = new Web(pageInfo.WebFullUrl);
                await web.lists.getByTitle('NotificationsConfigration').items.add(postData).then((data: any) => {
                    closePopup('add')
                }).catch((error: any) => {
                    console.error('Error While adding ', error);
                    alert(error?.data?.responseBody["odata.error"].message?.value)
                })
            }
        }


        if (props?.SelectedEditItem?.Id != undefined) {
            if (selectedConfigType == "Report") {
                if (peopleAndGroupId.length > 0 && ConfigTitle != '' && ConfigTitle != null) {
                    updateData = {
                        Title: ConfigTitle,
                        RecipientsId: { 'results': peopleAndGroupId },
                        Subject: EmailSubjectReport,

                    }
                } else {
                    applyPost = false;
                    alert("Please fill the Report Recipient and Report Title")
                }

            } else {
                updateData = { ConfigrationJSON: allTaskStatusToConfigure?.length > 0 ? JSON?.stringify(allTaskStatusToConfigure) : [] }
            }
            if (applyPost) {
                let web = new Web(pageInfo.WebFullUrl);
                await web.lists.getByTitle('NotificationsConfigration').items.getById(props?.SelectedEditItem?.Id).update(updateData).then((data: any) => {
                    closePopup('update')
                }).catch((error: any) => {
                    console.error('Error While adding ', error);
                    alert(error?.data?.responseBody["odata.error"].message?.value)
                })
            }
        }

    }

    const getPortFolioType = async () => {
        let web = new Web(props?.AllListId?.siteUrl);

        PortFolioType = await web.lists.getById(props?.AllListId?.PortFolioTypeID).items.select("Id", "Title", "Color", "IdRange", "StatusOptions").get();
        let result = await web.lists.getByTitle('NotificationsConfigration').items.select('Id,ID,Modified,Created,Title,Author/Id,Author/Title,Editor/Id,Editor/Title,PortfolioType/Id,PortfolioType/Title,Recipients/Id,Recipients/Title,ConfigType,ConfigrationJSON,Subject').expand('Author,Editor,Recipients,PortfolioType').get()

        if (props?.SelectedEditItem?.Id != undefined) {
            PortFolioType = PortFolioType?.filter((portfolio: any) => portfolio?.Id == props?.SelectedEditItem?.PortfolioType?.Id);


        } else {
            PortFolioType = PortFolioType?.filter((portfolio: any) => !result?.some((config: any) => config?.PortfolioType?.Id == portfolio?.Id));
        }
        if (PortFolioType?.length > 0) {
            showTaskStatus(PortFolioType[0]?.Title)
        }
    };
    //===================  show the task status accroding to portfiloType Title  ======================


    const showTaskStatus = (selectedTitle: any) => {
        let taskStatus: any
        // setPortfolioTitle(e.target.value)
        SelectedPortfolio = PortFolioType?.find((data: any) => data?.Title == selectedTitle)
        if (SelectedPortfolio != undefined)
            taskStatus = JSON.parse(SelectedPortfolio?.StatusOptions)
        setTaskStatus(taskStatus)
        if (props?.SelectedEditItem?.ConfigrationJSON != undefined) {
            setAllTaskStatusToConfigure(JSON?.parse(props?.SelectedEditItem?.ConfigrationJSON))
        }
    }
    React.useCallback(() => {

    }, [])
    const TaskconfigCallback = React.useCallback(() => {
        setOpenAddConfigPopup(false);
        setOpenEditConfigPopup(false)
    }, [])
    const EditTaskNotificationPopup = (selectedData: any, index: any) => {
        selectedData.index = index
        setEditTaskconfigData(selectedData)
        setOpenEditConfigPopup(true)
    }
    const DeleteTaskNotificationPopup = (selectedData: any, index: any) => {
        const copyallTaskStatusToConfigure = allTaskStatusToConfigure?.filter((item: any, indx: any) => {
            return index !== indx;
        });

        setAllTaskStatusToConfigure(copyallTaskStatusToConfigure)
        // selectedData.index = index
        // setEditTaskconfigData(selectedData)
        // setOpenEditConfigPopup(true)
    }
    const deleteDocumentsData = async (DeletItemId: any) => {
        console.log(DeletItemId);
        const web = new Web(props?.AllListId?.siteUrl);
        var text: any = "Are you sure want to Delete ?";
        if (confirm(text) == true) {
            await web.lists.getByTitle("NotificationsConfigration")
                .items.getById(DeletItemId).recycle()
                .then((res: any) => {
                    console.log(res);

                    closePopup('update')

                })
                .catch((err) => {
                    console.log(err.message);
                });
        }

    };
    return (
        <>
            <Panel
                onRenderHeader={onRenderCustomHeader}
                // type={PanelType.medium}
                type={PanelType.custom}
                customWidth="800px"
                isOpen={true}
                onDismiss={() => closePopup()}
                isBlocking={false}>

                <div>
                    <span className="col-sm-3 rediobutton ">

                        {props?.SelectedEditItem?.Id == undefined ?
                            <>
                                <span className='SpfxCheckRadio'>
                                    <input type="radio"
                                        checked={selectedConfigType == 'Report'} onClick={() => setselectedConfigType('Report')}
                                        className="radio" /> Email Report
                                </span>
                                <span className='SpfxCheckRadio'>
                                    <input type="radio"
                                        checked={selectedConfigType == 'TaskNotifications'} onClick={() => setselectedConfigType('TaskNotifications')}
                                        className="radio" />Task Notifications
                                </span>

                            </> : ""
                            // <>

                            //     {selectedConfigType == "TaskNotifications" && <span className='SpfxCheckRadio'>
                            //         <input type="radio"
                            //             checked={selectedConfigType == 'TaskNotifications'} onClick={() => setselectedConfigType('TaskNotifications')}
                            //             className="radio" />Task Notifications
                            //     </span>}

                            //     {selectedConfigType == "Report" && <span className='SpfxCheckRadio'>
                            //         <input type="radio"
                            //             checked={selectedConfigType == 'Report'} onClick={() => setselectedConfigType('Report')}
                            //             className="radio" /> Email Report
                            //     </span>}


                            // </>



                        }

                    </span>
                    {selectedConfigType == 'Report' ?
                        <div>

                            <div className="mb-2 input-group">

                                <label className='form-label full-width'>Report Title</label>
                                <input type='text' className='from-control w-75' placeholder='Enter Report Title' value={ConfigTitle} disabled={props?.SelectedEditItem?.Id != undefined ? true : false} onChange={(e) => { setConfigTitle(e.target.value) }} />


                            </div>
                            <div className="mb-2 input-group">
                                <label className='form-label full-width'>Report subject</label>
                                <input type='text' className='from-control w-75' placeholder='Enter Report subject' value={EmailSubjectReport} onChange={(e) => { setEmailSubjectReport(e.target.value) }} />


                            </div>
                            <div className='peoplePickerPermission mb-2 w-75' style={{ zIndex: '999999999999' }}>
                                <PeoplePicker
                                    context={props?.AllListId?.Context}
                                    principalTypes={[PrincipalType.User, PrincipalType.SharePointGroup, PrincipalType.SecurityGroup, PrincipalType.DistributionList]}
                                    personSelectionLimit={10}
                                    titleText="Report Recipients"
                                    resolveDelay={1000}
                                    onChange={handlePeopleChange}
                                    showtooltip={true}
                                    required={true}
                                    defaultSelectedUsers={DefaultSelectedUser}
                                ></PeoplePicker>
                            </div>

                        </div> :

                        <div>
                            <div className="input-group">
                                <label className="form-label full-width">
                                    Select Portfolio Type
                                </label>
                                <select className="form-select" onChange={(e) => { showTaskStatus(e?.target?.value) }}>
                                    {PortFolioType.map(function (portfolioData: any, i: any) {
                                        return (
                                            <option key={i} value={portfolioData.Title} >
                                                {portfolioData.Title}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>

                            <div className='row mt-4'>
                                <div className='col-sm-3 '>
                                    {TaskStatus?.map((StatusData: any) => {
                                        return (
                                            <>
                                                <div onClick={() => setPercentageComplete(StatusData?.value)} className={`${percentageComplete == StatusData?.value ? 'alignCenter border p-1 activeCategory' : 'alignCenter border p-1 hoverCategory'}`}>
                                                    <a> {StatusData?.status}</a>
                                                    <Tooltip withArrow content={'Add Configuration'} relationship="label" positioning="below">
                                                        <div className='alignCenter ml-auto hover-text'>
                                                            <span className="hreflink ml-auto svg__icon--Plus wid30 svg__iconbox"></span>
                                                        </div>
                                                    </Tooltip>
                                                </div>
                                            </>
                                        )

                                    })}
                                </div>

                                {percentageComplete != undefined && percentageComplete != null && <div className='col-sm-9'>
                                    {allTaskStatusToConfigure?.length > 0 ? allTaskStatusToConfigure?.map((config: any, index: any) => {
                                        return (
                                            <>
                                                {config?.percentComplete == percentageComplete &&
                                                    <section className='mb-2'>
                                                        <Card>

                                                            <div className='alignCenter'>
                                                                {config?.NotificationType == "Email" ? <span className='svg__iconbox svg__icon--mail hreflink'></span> :
                                                                    <span className='svg__iconbox svg__icon--team hreflink'></span>}
                                                                <span className='ms-2'>{config?.Notifier[0]?.text}</span>
                                                                <span className='svg__iconbox svg__icon--edit ml-auto' data-toggle="tooltip"
                                                                    data-placement="bottom"
                                                                    title="Edit" onClick={() => EditTaskNotificationPopup(config, index)}></span>
                                                                <span className='svg__iconbox svg__icon--trash' data-toggle="tooltip"
                                                                    data-placement="bottom"
                                                                    title="delete" onClick={() => DeleteTaskNotificationPopup(config, index)}></span>
                                                            </div>
                                                            <div className='alignCenter'>
                                                                <label className='form-label'>Task Status :</label>
                                                                <span className='ms-2'>
                                                                    {`${config?.percentComplete} %`}
                                                                </span>
                                                            </div>

                                                            {config?.NotificationType == "Email" && <div className='alignCenter'>
                                                                <label className='form-label'>Subject :</label>
                                                                <span className='ms-2'>
                                                                    {config?.subject}
                                                                </span>
                                                            </div>}

                                                            {(config?.NotificationType == "Team" || config?.NotificationType == "Email") && <div className='alignCenter'>
                                                                <label className='form-label'>Notify Content :</label>
                                                                <span className='ms-2'>
                                                                    {config?.notifyContent}
                                                                </span>
                                                            </div>}

                                                            <div>
                                                                <label className='form-label'>Avoid Itself :</label>
                                                                <span className='SpfxCheckRadio ms-2'>
                                                                    <input type="checkbox" className='form-check-input' checked={config?.avoidItself == "true"} />
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <label className='form-label'>Category :</label>
                                                                <span className='ms-2'>
                                                                    {Array.isArray(config?.Category) ?
                                                                        config.Category.map((item: any) => (typeof item === 'object' ? item.Title : item)).join(', ') :
                                                                        config.Category}</span>
                                                            </div>
                                                            <div>
                                                                <label className='form-label'>Exception Category :</label>
                                                                <span className='ms-2'>{config?.ExceptionCategory[0]} </span>
                                                            </div>
                                                        </Card>
                                                    </section>

                                                }
                                            </>
                                        )

                                    }) :

                                        <div className='border p-2 text-center'>
                                            "No Configuration Available"
                                        </div>}
                                    <div className='ms-3 mt-2 text-end'>
                                        <button type="button" className='btnCol btn btn-primary '
                                            onClick={() => setOpenAddConfigPopup(true)}
                                        >Add Config </button>
                                    </div>
                                </div>}

                            </div>

                        </div>

                    }
                </div>
                <footer className='text-end mt-2'>
                    <div className='col-sm-12 row m-0'>


                        <div className="col-sm-6 ps-0 text-lg-start">
                            {props?.SelectedEditItem?.Id != undefined && <div>
                                {console.log("footerdiv")}
                                <div><span className='pe-2'>Created</span><span className='pe-2'>{props?.SelectedEditItem?.Created !== null ? props?.SelectedEditItem?.Created : ""}&nbsp;By</span><span><a>{props?.SelectedEditItem?.Author?.Title}</a></span></div>
                                <div><span className='pe-2'>Last modified</span><span className='pe-2'>{props?.SelectedEditItem?.Modified !== null ? props?.SelectedEditItem?.Modified : ""}&nbsp;By</span><span><a>{props?.SelectedEditItem?.Editor?.Title}</a></span></div>
                                <div>
                                    <a onClick={() => deleteDocumentsData(props?.SelectedEditItem?.Id)} className="hreflink me-1"><span style={{ marginLeft: '-4px' }} className="alignIcon hreflink svg__icon--trash svg__iconbox"></span>Delete this item
                                    </a>
                                     |
                                    <span>
                                        <VersionHistory
                                            taskId={props?.SelectedEditItem.Id}
                                            listId={props?.AllListId?.NotificationsConfigrationListID}
                                            siteUrls={props?.AllListId?.siteUrl}
                                            RequiredListIds={props?.AllListId}
                                        />
                                    </span>
                                </div>
                            </div>}
                        </div>

                        <div className='col-sm-6 mt-2 p-0'>
                            {props?.SelectedEditItem?.Id != undefined && <span className='pe-2'><a target="_blank" data-interception="off" href={`${props?.AllListId?.siteUrl}/Lists/NotificationsConfigration/EditForm.aspx?ID=${props?.SelectedEditItem?.Id != null ? props?.SelectedEditItem?.Id : null}`}>Open out-of-the-box form</a></span>}

                            <Button type="button" variant="primary" className='me-1' onClick={() => addFunction()}>{props?.SelectedEditItem?.Id != undefined ? "Save" : "Create"}</Button>
                            <Button type="button" className="btn btn-default" variant="secondary" onClick={() => closePopup()}>Cancel</Button>
                        </div>
                    </div>
                </footer>


            </Panel>
            {openAddConfigPopup && <AddTaskConfigPopup TaskconfigCallback={TaskconfigCallback} percentageComplete={percentageComplete} AllListId={props?.AllListId} setAllTaskStatusToConfigure={setAllTaskStatusToConfigure} allTaskStatusToConfigure={allTaskStatusToConfigure} ></AddTaskConfigPopup>}
            {openEditConfigPopup && <AddTaskConfigPopup TaskconfigCallback={TaskconfigCallback} editTaskconfigData={editTaskconfigData} percentageComplete={percentageComplete} AllListId={props?.AllListId} setAllTaskStatusToConfigure={setAllTaskStatusToConfigure} allTaskStatusToConfigure={allTaskStatusToConfigure} />}

        </>
    )
}
