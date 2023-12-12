import React, { useState } from 'react'
// import TaskStatusTbl from './TaskStatusTbl';
import { myContextValue } from '../../../globalComponents/globalCommon'
import WorldClock from './WorldClock';
import TaskStatusTbl from './TaskStausTable';
import EmployeePieChart from './EmployeePieChart';
import { Web } from 'sp-pnp-js';
import { Panel, PanelType } from 'office-ui-fabric-react';
const Header = () => {
  const ContextData: any = React.useContext(myContextValue)
  let userName: any = ContextData?.currentUserData;
  const currentTime: any = ContextData?.currentTime;
  const todaysTask: any = ContextData?.AlltaskData.TodaysTask;
  const bottleneckTask: any = ContextData?.AlltaskData.BottleneckTask;
  const immediateTask: any = ContextData?.AlltaskData.ImmediateTask;
  const thisWeekTask: any = ContextData?.AlltaskData.ThisWeekTask;
  const draftArray: any = ContextData?.AlltaskData?.DraftCatogary;
  const assignedTask: any = ContextData?.AlltaskData?.AssignedTask;
  let annouceMents: any = ContextData?.annouceMents;
  const [activeTile, setActiveTile] = useState('workingToday');
  const [IsOpenTimeSheetPopup, setIsOpenTimeSheetPopup] = useState(false);
  const [IsAnnouncement, setIsAnnouncement] = React.useState(false);
  const [newAnnouncement, setNewAnnouncement] = React.useState('');
  const [, rerender] = React.useReducer(() => ({}), {});
  let UserGroup: any = ContextData?.AllTaskUser?.filter((x: any) => x.AssingedToUser?.Id === ContextData?.propsValue?.Context._pageContext._legacyPageContext.userId)
  const handleTileClick = (tileName: any) => {

    if (tileName == 'TimeSheet') {
      setIsOpenTimeSheetPopup(true)
    }
    else {
      setActiveTile(tileName);
    }
    // Set the active tile when a tile is clicked
  };
  const openAnnouncementPopup = (event: any) => {
    console.log(event.target);
    setIsAnnouncement(true);
  }
  const deleteAnnouncement = (deleteitem: any) => {
    const web = new Web(ContextData?.propsValue?.siteUrl);
    web.lists.getById(ContextData?.propsValue?.Announcements).items.getById(deleteitem.Id).update({
      Title: deleteitem.Title,
      Body: deleteitem.Body,
      isShow: false
    })
      .then((updatedItem: any) => {
        console.log(updatedItem)
        annouceMents.map((itm: any, index: any) => {
          if (deleteitem.Id === itm.Id) {
            itm.isShow = false;
            annouceMents.splice(index, 1)
          }

        })

        rerender();
        // GetResult();
      }).catch((err: any) => {
        console.log(err)
      })
  };

  const closeAnnouncementpopup = () => {
    setIsAnnouncement(false)
  }
  const onRenderCustomHeaderAnnouncement = () => {
    return (
      <>
        <div className='siteColor subheading'>
          Add New Announcement
        </div>
      </>
    );
  };
  const handleInputChange = (e: any) => {
    const value = e.target.value;
    setNewAnnouncement(value);
  };
  const saveAnnounceMents = () => {
    const web = new Web(ContextData?.propsValue?.siteUrl);
    web.lists.getById(ContextData?.propsValue?.Announcements).items.add(
      {
        Title: newAnnouncement,
        isShow: true
      })
      .then((result: any) => {
        console.log('Announcement added successfully:', result);
        annouceMents.push(result.data);
        closeAnnouncementpopup();
        setNewAnnouncement('');
        rerender();
      })
      .catch((error) => {
        console.error('Error adding announcement:', error);
      });
  }
  const CallBack = () => {
    //  setActiveTile('workingToday');
    setIsOpenTimeSheetPopup(false)

  }
  return (
    <div>
      <section className="NameTopSec">
        <div className="d-flex shadow-sm p-3 mb-3 bg-white">
          <div className="col fw-bold f-18 alignCenter">
            Welcome,
            <span className="ms-1 empCol">
              {userName?.Title}
            </span>
          </div>
          <div className="col alignCenter justify-content-end">
            <span className="me-2 mt--5" title='Notification'>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="#333333"
                className="bi bi-bell"
                viewBox="0 0 16 16">
                <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z" />
              </svg>
            </span>
            <WorldClock />
            <img className="rounded-circle" title={userName?.Title} width={"30px"} height={"30px"} src={userName?.Item_x0020_Cover?.Url} />
          </div>
        </div>
      </section>
      {UserGroup != undefined && (UserGroup[0]?.UserGroup?.Title === 'Senior Developer Team' || UserGroup[0]?.UserGroup?.Title === 'Smalsus Lead Team') ? <div className='mb-5'><a className="pull-right empCol hreflink" onClick={(e) => openAnnouncementPopup(e)}> Add Announcement </a></div> : ''}
      {annouceMents.length && (<section className='annocumentSec'>
        <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-indicators">
            {annouceMents?.map((items: any, index: number) => {
              return (<button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to={`${index}`} className={`${index == 0 ? 'active' : ''}`} key={index} aria-current={`${index == 0 && true}`} aria-label={`Slide ${index}`}></button>)
            })}
          </div>
          <div className="carousel-inner">
            {annouceMents?.map((items: any, index: any) => {
              return (
                <div className={`carousel-item ${index == 0 ? 'active' : ''}`} data-bs-interval="2000" key={index}>
                  <div className="alignCenter px-2 pb-4 pt-2 mb-3 empBg">
                    <span title='Announcement' className="svg__iconbox svg__icon--annocument light me-2 wid30"></span>
                    {items.Title}{UserGroup != undefined && (UserGroup[0]?.UserGroup?.Title === 'Senior Developer Team' || UserGroup[0]?.UserGroup?.Title === 'Smalsus Lead Team') ? <span title='delete' className="ml-auto svg__iconbox svg__icon--cross light wid30" onClick={() => deleteAnnouncement(items)}></span> : ''}
                  </div></div>
              )
            }
            )}
          </div>
        </div>
      </section>)}
      <section className="tabSec">
        <div className="d-flex justify-content-center">
          <div
            className={`${activeTile === 'workingToday' ? 'col alignCenter me-3 mb-3 hreflink  p-3 empBg shadow-sm active empBg' : 'col alignCenter me-3 p-3 bg-white mb-3 hreflink shadow-sm'}`}
            onClick={() => handleTileClick('workingToday')}>
            <span className="iconSec" title='Working Today Task'>
              {/* <span className="svg__iconbox svg__icon--calendarOne"></span> */}
              <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="#057BD0" className="bi bi-calendar4-event" viewBox="0 0 16 16" >
                <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM2 2a1 1 0 0 0-1 1v1h14V3a1 1 0 0 0-1-1H2zm13 3H1v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V5z" />
                <path d="M11 7.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z" />
              </svg>
            </span>
            <span className="ms-2 tabText">
              <div>Working Today Tasks </div>
              <div className="align-items-center d-flex f-18 justify-content-between tabResultText workToday">
                <div className='alignCenter'>
                  <span title='Todays Task'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#057BD0" className="bi bi-check2-circle" viewBox="0 0 16 16">
                      <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0z" />
                      <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l7-7z" />
                    </svg>
                  </span>
                  <span className='fw-semibold ms-1'>{todaysTask?.length}</span></div>
                <div className="mx-2">|</div>
                <div className='alignCenter'>
                  <span title='Todays Time'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#057BD0" className="bi bi-clock" viewBox="0 0 16 16">
                      <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z" />
                      <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z" />
                    </svg></span>
                  <span className='fw-semibold ms-1'>{currentTime}</span></div>
              </div>
            </span>
          </div>
          <div
            className={`${activeTile === 'workingThisWeek' ? 'col alignCenter me-3 mb-3 hreflink  p-3 empBg shadow-sm active empBg' : 'col alignCenter me-3 p-3 bg-white hreflink  mb-3 shadow-sm'}`}
            onClick={() => handleTileClick('workingThisWeek')}
          >
            <span className="iconSec">
              <span title='Working This Week' className="svg__iconbox svg__icon--calendar"></span>
            </span>
            <span className='ms-2'>
              <div>Working This Week</div>
              <div className="f-18 fw-semibold">{thisWeekTask?.length}</div>
            </span>
          </div>
          <div
            className={`${activeTile === 'assignedTask' ? 'col alignCenter me-3 mb-3 hreflink  p-3 empBg shadow-sm active empBg' : 'col alignCenter me-3 p-3 bg-white hreflink  mb-3 shadow-sm'}`}
            onClick={() => handleTileClick('assignedTask')}
          >
            <span className="iconSec">
              <span title='Assigned Task' className="svg__iconbox svg__icon--calendar"></span>
            </span>
            <span className='ms-2'>
              <div>Assigned Task</div>
              <div className="f-18 fw-semibold">{assignedTask?.length}</div>
            </span>
          </div>
          {/* <div
            className={`${activeTile === 'bottleneck' ? 'col alignCenter me-3 hreflink  mb-3 p-3 empBg shadow-sm active empBg' : 'col alignCenter me-3 p-3 bg-white hreflink  mb-3 shadow-sm'}`}
            onClick={() => handleTileClick('bottleneck')}
          >
            <span className="iconSec">
              <span title='Bottleneck Task' className=" svg__iconbox svg__icon--bottleneck"></span>
            </span>
            <span className='ms-2'>
              <div>Bottleneck Tasks </div>
              <div className="f-18 fw-semibold">
                {bottleneckTask?.length}
              </div>
            </span>
          </div>
          <div
            className={`${activeTile === 'immediate' ? 'col alignCenter me-3 hreflink mb-3 p-3 empBg shadow-sm active empBg' : 'col alignCenter me-3 p-3 bg-white hreflink mb-3 shadow-sm'}`}
            onClick={() => handleTileClick('immediate')}>
            <span className="iconSec">
              <span title='Immediate Task' className=" svg__iconbox svg__icon--alert"></span>
            </span>
            <span className='ms-2'>
              <div>Immediate Tasks</div>
              <div className="f-18 fw-semibold">{immediateTask?.length}</div>
            </span>
          </div> */}
          <div
            className={`${activeTile === 'draft' ? 'col alignCenter hreflink  mb-3 p-3 empBg shadow-sm active empBg' : 'col alignCenter p-3 hreflink  bg-white mb-3 shadow-sm'}`}
            onClick={() => handleTileClick('draft')}>
            <span className="iconSec">
              <span title='Draft Task' style={{ width: '24px', height: '24px' }} className=" svg__iconbox svg__icon--draftOther"></span>
            </span>
            <span className='ms-2'>
              <div>Draft Tasks</div>
              <div className="f-18 fw-semibold">{draftArray?.length}</div>
            </span>
          </div>
          <div
            className={`${activeTile === 'TimeSheet' ? 'col alignCenter hreflink  mb-3 p-3 empBg shadow-sm active empBg' : 'col alignCenter p-3 hreflink  bg-white mb-3 shadow-sm'}`}
            onClick={() => handleTileClick('TimeSheet')}>
            <span className="iconSec">
              <span title='TimeSheet' style={{ width: '24px', height: '24px' }} className=" svg__iconbox svg__icon--draftOther"></span>
            </span>
            <span className='ms-2'>
              <div>TimeSheet</div>
              {/* <div className="f-18 fw-semibold">{draftArray?.length}</div> */}
            </span>
          </div>
        </div>
        {activeTile === 'workingToday' && <div><TaskStatusTbl activeTile={activeTile} /></div>}
        {activeTile === 'workingThisWeek' && <div><TaskStatusTbl activeTile={activeTile} /></div>}
        {activeTile === 'assignedTask' && <div><TaskStatusTbl activeTile={activeTile} /></div>}
        {activeTile === 'bottleneck' && <div><TaskStatusTbl activeTile={activeTile} /></div>}
        {activeTile === 'immediate' && <div><TaskStatusTbl activeTile={activeTile} /></div>}
        {activeTile === 'draft' && <div><TaskStatusTbl activeTile={activeTile} /></div>}
        {/* {activeTile === 'TimeSheet' && <div><TaskStatusTbl activeTile={activeTile} /></div>} */}
      </section>
      <span>
        {IsOpenTimeSheetPopup == true && <EmployeePieChart IsOpenTimeSheetPopup={IsOpenTimeSheetPopup} Call={() => { CallBack() }} />}
      </span>
      <Panel onRenderHeader={onRenderCustomHeaderAnnouncement}
        isOpen={IsAnnouncement}
        onDismiss={closeAnnouncementpopup}
        type={PanelType.medium}>
        <div className='modal-body'>
          <div className='input-group'>
            <label className='form-label full-width'>Title</label>
            <textarea className="form-control" defaultValue={newAnnouncement} onChange={handleInputChange} />
          </div>
        </div>
        <div className='modal-footer mt-2'>
          <button className="btn btn-primary ms-1" onClick={saveAnnounceMents}>Save</button>
          <button className='btn btn-default ms-1' onClick={closeAnnouncementpopup}>Cancel</button>
        </div>
      </Panel>
    </div>
  );
}

export default Header