import { Panel, PanelType } from 'office-ui-fabric-react'
import React, { useState } from 'react'
import { Web } from "sp-pnp-js";
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import * as Moment from 'moment';
import Button from 'react-bootstrap/Button';
import * as globalCommon from "../../../globalComponents/globalCommon";


import {
    makeStyles,
    shorthands,

    Caption1,
    Text,
    tokens,
    Subtitle1,
} from "@fluentui/react-components";
import { MoreHorizontal20Regular } from "@fluentui/react-icons";
import { Card, CardHeader, CardPreview } from "@fluentui/react-components";
import moment from 'moment';
import { SpaTwoTone } from '@material-ui/icons';
import AddTaskConfigPopup from './AddTaskConfigPopup';
import EditTaskConfigPopup from './EditTaskConfigPopup';
import Tooltip from '../../../globalComponents/Tooltip';
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
           if(props?.SelectedEditItem?.ConfigType=="Report"){
            setConfigTitle(props?.SelectedEditItem?.Title)
            setEmailSubjectReport(props?.SelectedEditItem?.Subject)
        setSelectedPersonsAndGroups(props?.SelectedEditItem?.Recipients)
        let DefaultSelectedUseremail:any=[]
        if(props?.SelectedEditItem?.Recipients?.length>0){
            props?.SelectedEditItem?.Recipients?.map((data:any)=>{
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
            {props?.SelectedEditItem?.Id != undefined ? `Edit Permission - ${props?.SelectedEditItem?.Title}` : 'Add Configuration'}
            </div>
            <Tooltip ComponentId={'6755'} />
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
        if (selectedConfigType == "Report") {
            if (pageInfo?.WebFullUrl) {

                selectedPersonsAndGroups?.map((user: any) => {
                    let foundPerson = users?.find((person: any) => (person?.LoginName == user?.id)||(person?.Title==user?.Title));
                    if (foundPerson?.Id != undefined) {
                        peopleAndGroupId?.push(foundPerson?.Id)
                    }
                })
                postData = {
                    Title: ConfigTitle,
                    RecipientsId: { 'results': peopleAndGroupId },
                    Subject: EmailSubjectReport,
                    ConfigType: selectedConfigType
                }
            }
        } else {

            postData = {
                Title: "TaskNotificationConfig" + SelectedPortfolio?.Title,
                ConfigType: selectedConfigType,
                PortfolioTypeId: SelectedPortfolio?.Id,
                ConfigrationJSON: allTaskStatusToConfigure?.length > 0 ? JSON?.stringify(allTaskStatusToConfigure) : []
            }


        }
        if (props?.SelectedEditItem?.Id == undefined) {

            let web = new Web(pageInfo.WebFullUrl);
            await web.lists.getByTitle('NotificationsConfigration').items.add(postData).then((data: any) => {
                closePopup('add')
            }).catch((error: any) => {
                console.error('Error While adding ', error);
                alert(error?.data?.responseBody["odata.error"].message?.value)
            })
        }

        if (props?.SelectedEditItem?.Id != undefined) {
            if (selectedConfigType == "Report") {
                updateData = {
                    Title: ConfigTitle,
                    RecipientsId: { 'results': peopleAndGroupId },
                    Subject: EmailSubjectReport,
                }
            } else {
                updateData = { ConfigrationJSON: allTaskStatusToConfigure?.length > 0 ? JSON?.stringify(allTaskStatusToConfigure) : [] }
            }
            let web = new Web(pageInfo.WebFullUrl);
            await web.lists.getByTitle('NotificationsConfigration').items.getById(props?.SelectedEditItem?.Id).update(updateData).then((data: any) => {
                closePopup('update')
            }).catch((error: any) => {
                console.error('Error While adding ', error);
                alert(error?.data?.responseBody["odata.error"].message?.value)
            })
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

                            </> :
                            <>

                                {selectedConfigType == "TaskNotifications" && <span className='SpfxCheckRadio'>
                                    <input type="radio"
                                        checked={selectedConfigType == 'TaskNotifications'} onClick={() => setselectedConfigType('TaskNotifications')}
                                        className="radio" />Task Notifications
                                </span>}

                                {selectedConfigType == "Report" && <span className='SpfxCheckRadio'>
                                    <input type="radio"
                                        checked={selectedConfigType == 'Report'} onClick={() => setselectedConfigType('Report')}
                                        className="radio" /> Email Report
                                </span>}


                            </>



                        }

                    </span>
                    {selectedConfigType == 'Report' ?
                        <div>
                            
                            <div className="mb-2 input-group">
                               
                            <label className='form-label full-width'>Report Title</label>
                                    <input type='text' className='from-control w-75' placeholder='Enter Report Title' value={ConfigTitle} onChange={(e) => { setConfigTitle(e.target.value) }} />
                                    

                            </div>
                            <div className="mb-2 input-group">
                            <label className='form-label full-width'>Report subject</label>
                                    <input type='text' className='from-control w-75' placeholder='Enter Report subject' value={EmailSubjectReport} onChange={(e) => { setEmailSubjectReport(e.target.value) }} />

                               
                            </div>
                            <div className='peoplePickerPermission mb-2' style={{ zIndex: '999999999999' }}>
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
                                <select
                                    className="form-select"
                                    onChange={(e) => { showTaskStatus(e?.target?.value) }}
                                >
                                    {PortFolioType.map(function (portfolioData: any, i: any) {
                                        return (
                                            <option
                                                key={i}

                                                value={portfolioData.Title}
                                            >
                                                {portfolioData.Title}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>

                            <div className='row mt-4'>
                                <div className='col-sm-3'>
                                    {TaskStatus?.map((StatusData: any) => {
                                        return (
                                            <>

                                                <div><a onClick={() => setPercentageComplete(StatusData?.value)}> {StatusData?.status}</a></div>
                                            </>
                                        )

                                    })}
                                </div>

                                {percentageComplete != undefined && percentageComplete != null && <div className='col-sm-9'>
                                    {allTaskStatusToConfigure?.length > 0 ? allTaskStatusToConfigure?.map((config: any, index: any) => {
                                        return (
                                            <>
                                                {config?.percentComplete == percentageComplete &&
                                                 <section>
                                                    <Card>

                                                        <div className='alignCenter'>
                                                            {config?.NotificationType == "Email" ? <span className='svg__iconbox svg__icon--mail hreflink'></span> :
                                                                <span className='svg__iconbox svg__icon--team hreflink'></span>}
                                                            <span className='ms-2'>{config?.Notifier[0]?.text}</span>
                                                            <span className='svg__iconbox svg__icon--edit hreflink ml-auto' onClick={() => EditTaskNotificationPopup(config, index)}></span>
                                                        </div>
                                                        <div className='alignCenter'>
                                                            <label className='form-label'>Task Status:</label>
                                                            <span className='ms-2'>
                                                                {`${config?.percentComplete} %`}
                                                            </span>
                                                        </div>

                                                        <div>
                                                            <label className='form-label'>Avoid ItSelf:</label>
                                                            <span className='SpfxCheckRadio ms-2'>
                                                                <input type="checkbox" className='form-check-input' checked={config?.avoidItself == "true"} />
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <label className='form-label'>Category:</label>
                                                            <span className='ms-2'>{config?.Category} </span>
                                                        </div>
                                                        <div>
                                                            <label className='form-label'>Exception Category:</label>
                                                            <span className='ms-2'>{config?.ExceptionCategory[0]} </span>
                                                        </div>
                                                    </Card>
                                                </section> 
                                                
                                                }
                                            </>
                                        )

                                    }) :

                                        <>
                                            "No Configuration Available"

                                        </>}
                                    <span className='ms-3 mt-2'>
                                        <button type="button" className='me-1 btn btn-primary'
                                            onClick={() => setOpenAddConfigPopup(true)}
                                        >Add Config </button>
                                    </span >
                                </div>}

                            </div>

                        </div>

                    }
                </div>
                <footer className='alignCenter'>
                    <div className="col text-end">
                        <Button type="button" variant="primary" className='me-1' onClick={() => addFunction()}>{props?.SelectedEditItem?.Id!=undefined?"Save":"Create"}</Button>
                        <Button type="button" className="btn btn-default" variant="secondary" onClick={() => closePopup()}>Cancel</Button>
                    </div>
                </footer>

            </Panel>
            {openAddConfigPopup && <AddTaskConfigPopup TaskconfigCallback={TaskconfigCallback} percentageComplete={percentageComplete} AllListId={props?.AllListId} setAllTaskStatusToConfigure={setAllTaskStatusToConfigure} allTaskStatusToConfigure={allTaskStatusToConfigure} ></AddTaskConfigPopup>}
            {openEditConfigPopup && <AddTaskConfigPopup TaskconfigCallback={TaskconfigCallback} editTaskconfigData={editTaskconfigData} percentageComplete={percentageComplete} AllListId={props?.AllListId} setAllTaskStatusToConfigure={setAllTaskStatusToConfigure} allTaskStatusToConfigure={allTaskStatusToConfigure} />}
        </>
    )
}
