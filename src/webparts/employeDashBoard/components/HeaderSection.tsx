import React, { useEffect, useState } from 'react'
import { myContextValue } from '../../../globalComponents/globalCommon'
import WorldClock from './WorldClock';
import TaskStatusTbl from './TaskStausTable';
import EmployeePieChart from './EmployeePieChart';
import { Web } from 'sp-pnp-js';
import { Panel, PanelType } from 'office-ui-fabric-react';
import { GrNext, GrPrevious } from "react-icons/gr";
import Slider from "react-slick";
let DashboardConfig: any = [];
const Header = () => {
  const params = new URLSearchParams(window.location.search);
  let DashboardId: any = params.get('DashBoardId');
  const ContextData: any = React.useContext(myContextValue)
  let userName: any = ContextData?.currentUserData;
  let DashboardTitle = ContextData?.DashboardTitle
  const currentTime: any = ContextData?.currentTime;
  let annouceMents: any = ContextData?.annouceMents;
  const [activeTile, setActiveTile] = useState(ContextData?.ActiveTile);
  const [IsOpenTimeSheetPopup, setIsOpenTimeSheetPopup] = useState(false);
  const [IsAnnouncement, setIsAnnouncement] = React.useState(false);
  const [newAnnouncement, setNewAnnouncement] = React.useState('');
  const [, rerender] = React.useReducer(() => ({}), {});
  const [IsShowConfigBtn, setIsShowConfigBtn] = React.useState(false);
  let UserGroup: any = ContextData?.AllTaskUser?.filter((x: any) => x.AssingedToUser?.Id === ContextData?.propsValue?.Context._pageContext._legacyPageContext.userId)
  if (ContextData?.DashboardConfig != undefined && ContextData?.DashboardConfig?.length > 0) {
    DashboardConfig = JSON.parse(JSON.stringify(ContextData?.DashboardConfig));
    DashboardConfig.sort((a: any, b: any) => a.Id - b.Id);
  }
  let numSlides = ContextData?.DashboardConfig?.filter((e: { TileName: string; }) => e.TileName != undefined && e.TileName != '');
  let settings = {
    dots: false, infinite: false, speed: 700,
    slidesToShow: Math.min(numSlides?.length, numSlides?.length > 8 ? 8 : numSlides?.length),
    slidesToScroll: 1,
    arrows: numSlides && numSlides?.length > 8 ? true : false,
    nextArrow: <SamplePrevNextArrow type="next" />,
    prevArrow: <SamplePrevNextArrow type="prev" />,
    beforeChange: handleBeforeChange,
  };
  const [currentSlide, setCurrentSlide] = React.useState(0);
  function handleBeforeChange(current: any, next: any) {
    setCurrentSlide(next);
  }
  function SamplePrevNextArrow(props: any) {
    const { type, className, style, onClick } = props;
    // Decide whether to display the arrow based on the current slide
    const shouldDisplay = (type === 'next' && currentSlide + 8 <= numSlides?.length - 1) || (type === 'prev' && currentSlide + 8 > 8);
    return shouldDisplay ? (
      <div className={className} style={{ ...style, display: "block" }} onClick={onClick}>
        {type === 'next' ? <GrNext /> : <GrPrevious />}
      </div>) : null;
  }
  const handleTileClick = (tileName: any) => {
    if (tileName == 'TimeSheet')
      setIsOpenTimeSheetPopup(true)
    else
      setActiveTile(tileName);
  };
  const openAnnouncementPopup = (event: any) => {
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
        annouceMents.map((itm: any, index: any) => {
          if (deleteitem.Id === itm.Id) {
            itm.isShow = false;
            annouceMents.splice(index, 1)
          }
        })
        rerender();
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
    setIsOpenTimeSheetPopup(false)
  }
  useEffect(() => {
    handleTileClick(ContextData?.ActiveTile)
  }, [ContextData?.ActiveTile]);

  return (
    <div>
      <section className="NameTopSec">
        <div className='row'><div><h6 className="pull-right">
          <span className="mt--5" title='Manage Config'>
            {IsShowConfigBtn == false && <a className="empCol hreflink" onClick={(e) => { setIsShowConfigBtn(true); ContextData.ShowHideSettingIcon(true); }} >Manage Configuration</a>}
            {IsShowConfigBtn == true && <a className="empCol hreflink" onClick={(e) => { setIsShowConfigBtn(false); ContextData.ShowHideSettingIcon(false); }}>Cancel</a>}
            <span> | </span>
            {DashboardId != undefined && DashboardId != '' ? <a data-interception="off" target="_blank" className="empCol hreflink" href={ContextData?.propsValue?.Context?._pageContext?._web?.absoluteUrl + "/SitePages/DashboardLandingPage.aspx?DashBoardId=" + DashboardId} >Manage Dashboard</a>
              : <a data-interception="off" target="_blank" className="empCol hreflink" href={ContextData?.propsValue?.Context?._pageContext?._web?.absoluteUrl + "/SitePages/DashboardLandingPage.aspx"} >Manage Dashboard</a>}

          </span> <span> | </span>
          <b><a data-interception="off" target="_blank" href={`${ContextData?.propsValue?.Context?.pageContext?._web.absoluteUrl}/SitePages/Dashboard-Old.aspx`}>Old Dashboard</a></b></h6></div></div>
        {/* <div className="d-flex shadow-sm p-3 mb-3 bg-white">
          <div className="col fw-bold f-18 alignCenter">
             Welcome, 
            <span className="ms-1 empCol">
               {userName?.Title} 
              {DashboardTitle}
            </span>
          </div>
        </div> */}
      </section >
      {/* {UserGroup != undefined && (UserGroup[0]?.UserGroup?.Title === 'Senior Developer Team' || UserGroup[0]?.UserGroup?.Title === 'Smalsus Lead Team') ?
        <div className='mb-5'><a className="pull-right empCol hreflink" onClick={(e) => openAnnouncementPopup(e)}> Add Announcement </a>
        </div>
        : ''} */}
      {annouceMents.length > 0 && (<section className='annocumentSec'>
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
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>)}
      <section className="tabSec">
        <div className="row">
          <div className='col-10'>
            {DashboardId === '4' ? (
              <Slider className="DashBoardslider" {...settings}>
                {DashboardConfig.map((items: any, index: any) => (
                  items?.TileName && (
                    <div
                      key={items.TileName} className={`col alignCenter me-1 mb-3 hreflink p-3 ${activeTile === items.TileName ? 'empBg shadow-sm active empBg' : 'bg-white shadow-sm'}`}
                      onClick={() => handleTileClick(items.TileName)} >
                      {items.SiteIcon ? (
                        <img width={35} height={35} title={items.TileName} src={items.SiteIcon} alt={items.TileName} />
                      ) : (
                        <span className="iconSec" title={items.TileName}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="#057BD0" className="bi bi-calendar4-event" viewBox="0 0 16 16">
                            <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM2 2a1 1 0 0 0-1 1v1h14V3a1 1 0 0 0-1-1H2zm13 3H1v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V5z" />
                            <path d="M11 7.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z" />
                          </svg>
                        </span>
                      )}
                      <span className="ms-2">
                        <div>{items.WebpartTitle}</div>
                        <div className="f-18 fw-semibold">{items?.Tasks?.length}</div>
                      </span>
                    </div>
                  )
                ))}
              </Slider>
            ) : (
              <>
                <div className='row ps-2'>
                  {DashboardConfig.map((items: any, index: any) => (
                    items?.TileName && (

                      <div key={items.TileName} className={`col alignCenter me-1 mb-3 hreflink p-3 ${activeTile === items.TileName ? 'empBg shadow-sm active empBg' : 'bg-white shadow-sm'}`}
                        onClick={() => handleTileClick(items.TileName)}  >
                        {items.SiteIcon ? (<img className="imgWid29 pe-1" title={items?.TileName} src={items.SiteIcon} alt={items.TileName} />)
                          :
                          (
                            <span className="iconSec" title={items.TileName}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="#057BD0" className="bi bi-calendar4-event" viewBox="0 0 16 16">
                                <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM2 2a1 1 0 0 0-1 1v1h14V3a1 1 0 0 0-1-1H2zm13 3H1v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V5z" />
                                <path d="M11 7.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z" />
                              </svg>
                            </span>
                          )}
                        <span className="ms-2">
                          <div>{items.WebpartTitle}</div>
                          <div className="f-18 fw-semibold">{items?.Tasks?.length}</div>
                        </span>
                      </div>

                    )
                  ))}
                </div>
              </>
            )}
          </div>

          <div className={`col-1 alignCenter hreflink mb-3  ${activeTile === 'TimeSheet' ? 'empBg shadow-sm active empBg' : 'bg-white shadow-sm'}`} onClick={() => handleTileClick('TimeSheet')}   >
            <span className="iconSec">
              <span title="TimeSheet" style={{ width: '24px', height: '24px' }} className="svg__iconbox svg__icon--draftOther"></span>
            </span>
            <span className="ms-2">
              <div>TimeSheet</div>
            </span>
          </div>
          <div className="col-1 alignCenter  hreflink bg-white mb-3 shadow-sm ">
            <span className="me-2 mt--5" title="Notification">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#333333" className="bi bi-bell" viewBox="0 0 16 16">
                <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z" />
              </svg>
            </span>
            <WorldClock />
            <img className="rounded-circle" title={userName?.Title} width={30} height={30} src={userName?.Item_x0020_Cover?.Url} alt={userName?.Title} />
          </div>
        </div>
        {DashboardConfig?.length > 0 && <div><TaskStatusTbl activeTile={activeTile} /></div>}
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
    </div >
  );
}
export default Header