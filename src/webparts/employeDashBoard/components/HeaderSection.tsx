import React, { useContext, useEffect, useReducer, useState } from 'react'
import { myContextValue } from '../../../globalComponents/globalCommon'
import WorldClock from './WorldClock';
import TaskStatusTbl from './TaskStausTable';
import EmployeePieChart from './EmployeePieChart';
import { Panel, PanelType } from 'office-ui-fabric-react';
import { GrNext, GrPrevious } from "react-icons/gr";
import Slider from "react-slick";
import EditConfiguration from '../../../globalComponents/EditConfiguration';
let smartFavTableConfig: any = [];
let DashboardConfig: any = [];
let Count: any = 0
const Header = () => {
  const params = new URLSearchParams(window.location.search);
  let DashboardId: any = params.get('DashBoardId');
  if (DashboardId == undefined || DashboardId == '')
    DashboardId = params.get('dashBoardId');
  const ContextData: any = useContext(myContextValue)
  let userName: any = ContextData?.currentUserData;
  const [activeTile, setActiveTile] = useState(undefined);
  const [IsOpenTimeSheetPopup, setIsOpenTimeSheetPopup] = useState(false);
  const [IsPortfolioLeads, setIsPortfolioLeads] = useState(false);
  const [, rerender] = useReducer(() => ({}), {});
  const [IsShowConfigBtn, setIsShowConfigBtn] = useState(false);
  const [AllPortfolioLeads, setAllPortfolioLeads] = useState([]);
  const [IsRestoreDefault, setIsRestoreDefault] = useState(false);
  const [SelectedLead, setSelectedLead] = useState(undefined);
  const [IsOpenEditDashboardPopup, setIsOpenEditDashboardPopup] = React.useState<any>(false);
  const [EditItem, setEditItem] = React.useState<any>(undefined);
  if (ContextData?.DashboardConfig != undefined && ContextData?.DashboardConfig?.length > 0) {
    DashboardConfig = JSON.parse(JSON.stringify(ContextData?.DashboardConfig));
    DashboardConfig.sort((a: any, b: any) => a.Id - b.Id);
  }
  useEffect(() => {
    if (ContextData?.AllTaskUser != undefined && ContextData?.AllTaskUser?.length > 0) {
      let AllUsers = ContextData?.AllTaskUser?.filter((user: any) => user?.UserGroup != undefined && user?.UserGroup?.Id != undefined && user?.UserGroup?.Id != '' && user?.UserGroup?.Id == 9);
      let SelectedUser = ContextData?.AllTaskUser?.filter((user: any) => user?.AssingedToUserId != undefined && user?.AssingedToUserId != undefined && user?.AssingedToUserId != '' && user?.AssingedToUserId == ContextData?.currentUserData?.AssingedToUserId)[0];
      if (Count == 0) {
        setAllPortfolioLeads(AllUsers)
        setSelectedLead(SelectedUser)
      }
      Count++;
    }
    setActiveTile(ContextData?.ActiveTile)
  }, [ContextData?.currentUserData?.AssingedToUserId && ContextData?.ActiveTile]);

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
  const handleTileClick = (tileName: any, config: any) => {
    if (tileName == 'TimeSheet') {
      setIsOpenTimeSheetPopup(true)
    }
    else {
      smartFavTableConfig = [];
      if (config != undefined && config?.configurationData != undefined && config?.configurationData?.length > 0 && config?.configurationData[0]?.smartFabBasedColumnsSetting != undefined && config?.configurationData[0]?.smartFabBasedColumnsSetting != '') {
        config.configurationData[0].smartFabBasedColumnsSetting.tableId = "DashboardID" + ContextData?.DashboardId + "WebpartId" + config?.Id + "Dashboard"
        smartFavTableConfig.push(config?.configurationData[0]?.smartFabBasedColumnsSetting)
      }
      setActiveTile(tileName);
    }
  };
  const openPortfolioLeadsPopup = () => {
    let SelectedUser = ContextData?.AllTaskUser?.filter((user: any) => user?.AssingedToUserId != undefined && user?.AssingedToUserId != undefined && user?.AssingedToUserId != '' && user?.AssingedToUserId == ContextData?.currentUserData?.AssingedToUserId)[0];
    setSelectedLead(SelectedUser)
    setIsPortfolioLeads(true)
  }
  const ClosePortfolioLeadPopup = () => {
    localStorage.setItem('CurrentUserId', ContextData?.currentUserData?.AssingedToUserId);
    setIsPortfolioLeads(false)
    setSelectedLead(undefined)
  }
  const savePortfolioLeads = () => {
    if ((SelectedLead?.AssingedToUserId == undefined || SelectedLead?.AssingedToUserId == '') && IsRestoreDefault == false) {
      alert('Please select any portfolio Lead')
    }
    else {
      if (!IsRestoreDefault) {
        localStorage.setItem('CurrentUserId', SelectedLead?.AssingedToUserId);
      }
      else if (IsRestoreDefault) {
        localStorage.setItem('CurrentUserId', '');
      }
      setIsPortfolioLeads(false)
      location.reload();
    }
  }
  const onRenderCustomHeaderPortfolioLeads = () => {
    return (
      <>
        <div className='siteColor subheading'>
          Portfolio Leads
        </div>
        <a className="hreflink mt-2 px-3" data-interception="off" target="_blank" href={ContextData?.propsValue?.Context?._pageContext?._web?.absoluteUrl + "/SitePages/TaskUser-Management.aspx"}>Task User Management</a>
      </>
    );
  };
  const CallBack = () => {
    setIsOpenTimeSheetPopup(false)
  }
  const SelectedUser = (User: any) => {
    setIsRestoreDefault(false);
    if (User.IsSelcetdUser == undefined)
      User.IsSelcetdUser = false;
    if (SelectedLead?.AssingedToUserId != undefined && User?.AssingedToUserId != undefined && SelectedLead?.AssingedToUserId == User?.AssingedToUserId) {
      setSelectedLead(undefined)
    }
    else {
      setSelectedLead(User)
    }
    rerender();
  }
  const RestoreDefault = () => {
    setIsRestoreDefault(true);
    setSelectedLead(undefined)
  }
  const EditDashboard = () => {
    setEditItem(ContextData?.CurrentConfigItem)
    setIsOpenEditDashboardPopup(true);
  }
  const CloseEditConfiguration = (IsLoad: any) => {
    setEditItem(undefined)
    setIsOpenEditDashboardPopup(false);

  }
  useEffect(() => {
    handleTileClick(ContextData?.ActiveTile, undefined)
  }, [ContextData?.ActiveTile]);

  return (
    <div>
      <section className="tabSec">
        <div className="row"><h4 className="heading">{ContextData?.DashboardTitle}</h4></div>
        <div className="row">
          <div className='col-8'>
            {DashboardId === '4' ? (
              <Slider className="DashBoardslider" {...settings}>
                {DashboardConfig.map((items: any, index: any) => (
                  items?.TileName && (
                    <div
                      key={items.TileName} className={`col alignCenter me-1 mb-3 hreflink p-3 ${activeTile === items.TileName ? 'empBg shadow-sm active empBg' : 'bg-white shadow-sm'}`}
                      onClick={() => handleTileClick(items.TileName, items)} >
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
                        onClick={() => handleTileClick(items.TileName, items)}  >
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
                {DashboardId == '27' && <div className="row pt-4">
                  {ContextData?.CurrentUserInfo != undefined && ContextData?.CurrentUserInfo?.Title != undefined && <h5 className="d-inline-block p-0 px-3"> {`${ContextData?.CurrentUserInfo?.Title} (${ContextData?.CurrentUserInfo?.UserGroup?.Title}) - WorkingTasks (${ContextData?.CurrentUserWorkingToday?.length}), Projects (${ContextData?.CurrentUserProjectData?.length})`}</h5>}
                </div>
                }
              </>
            )}
          </div>
          <div className="col-1 alignCenter hreflink mb-3  bg-white shadow-sm">
            {(DashboardId != undefined && DashboardId != '' && DashboardId != 1) && <> <span className="iconSec">
              <span title="Manage Configuration" className="svg__iconbox svg__icon--setting hreflink" style={{ width: '28px', height: '28px' }}></span>
            </span>
              <span className="ms-2">
                <div>
                  {IsShowConfigBtn == false && <a className="empCol hreflink" onClick={(e) => { setIsShowConfigBtn(true); ContextData.ShowHideSettingIcon(true); }} >Manage <br />Configuration</a>}
                  {IsShowConfigBtn == true && <a className="empCol hreflink" onClick={(e) => { setIsShowConfigBtn(false); ContextData.ShowHideSettingIcon(false); }}>Cancel</a>}
                </div>
              </span></>}

          </div>
          <div className="col-1 alignCenter hreflink mb-3  bg-white shadow-sm" onClick={() => EditDashboard()}  >
            <span className="iconSec">
              <span title="Manage Dashboard" className="svg__iconbox svg__icon--setting hreflink" style={{ width: '28px', height: '28px' }}></span>
            </span>
            <span className="ms-2">
              <div>
                <span className="empCol hreflink"  >Manage Dashboard</span>
                {/* {DashboardId != undefined && DashboardId != '' ?
                  <a data-interception="off" target="_blank" className="empCol hreflink" href={ContextData?.propsValue?.Context?._pageContext?._web?.absoluteUrl + "/SitePages/DashboardLandingPage.aspx?DashBoardId=" + DashboardId} >Manage Dashboard</a>
                  : <a data-interception="off" target="_blank" className="empCol hreflink" href={ContextData?.propsValue?.Context?._pageContext?._web?.absoluteUrl + "/SitePages/DashboardLandingPage.aspx"} >Manage<br /> Dashboard</a>
                } */}
              </div>
            </span>
          </div>
          <div className={`col-1 alignCenter hreflink mb-3  ${activeTile === 'TimeSheet' ? 'empBg shadow-sm active empBg' : 'bg-white shadow-sm'}`} onClick={() => handleTileClick('TimeSheet', undefined)}   >
            <span className="iconSec">
              <span title="TimeSheet" style={{ width: '24px', height: '24px' }} className="svg__iconbox svg__icon--draftOther"></span>
            </span>
            <span className="ms-2">
              <a href="#" className="empCol hreflink">TimeSheet</a>
            </span>
          </div>
          <div className="col-1 alignCenter  hreflink bg-white mb-3 shadow-sm ">
            <span className="me-2 mt--5" title="Notification">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#333333" className="bi bi-bell" viewBox="0 0 16 16">
                <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z" />
              </svg>
            </span>
            {activeTile != undefined && <WorldClock />}
            <img className="rounded-circle" title={userName?.Title} width={30} height={30} src={userName?.Item_x0020_Cover?.Url} alt={userName?.Title} />
            {DashboardId == '5' && <span title='Open leads popup' className="svg__iconbox svg__icon--editBox" onClick={(e) => openPortfolioLeadsPopup()} ></span>}
          </div>
        </div>
        {DashboardConfig?.length > 0 && activeTile != undefined  && <div><TaskStatusTbl activeTile={activeTile} smartFavTableConfig={smartFavTableConfig} /></div>}
      </section>
      <span>
        {IsOpenTimeSheetPopup == true && <EmployeePieChart IsOpenTimeSheetPopup={IsOpenTimeSheetPopup} Call={() => { CallBack() }} />}
      </span>
      <Panel onRenderHeader={onRenderCustomHeaderPortfolioLeads}
        isOpen={IsPortfolioLeads}
        onDismiss={ClosePortfolioLeadPopup}
        type={PanelType.medium}>
        <div className='modal-body'>
          <div className='row'>
            <div className='col-9'>
              <div className='input-group'>
                {AllPortfolioLeads?.length && AllPortfolioLeads?.map((user: any, index: number) => (
                  <>
                    <div className="top-assign mb-3">
                      {user.Item_x0020_Cover != undefined && user.AssingedToUser != undefined &&
                        <span onClick={() => SelectedUser(user)}>
                          <img className={SelectedLead?.AssingedToUserId == user?.AssingedToUserId == true ? 'large_teamsimgCustom me-2 activeimg' : 'large_teamsimgCustom me-2'} src={user.Item_x0020_Cover.Url} title={user.AssingedToUser.Title} />
                        </span>
                      }
                    </div>
                  </>
                ))}
              </div>
            </div>
            <div className='col-3 pull-right'>
              <a className='hreflink' onClick={(e) => { RestoreDefault() }} >+Restore Default</a>
            </div>

          </div>

        </div>
        <div className='modal-footer mt-2'>
          <button className="btn btn-primary ms-1" onClick={savePortfolioLeads}>Save</button>
          <button className='btn btn-default ms-1' onClick={ClosePortfolioLeadPopup}>Cancel</button>
        </div>
      </Panel>
      {IsOpenEditDashboardPopup && <EditConfiguration props={ContextData?.propsValue} IsDashboardPage={true} EditItem={EditItem} IsOpenPopup={IsOpenEditDashboardPopup} CloseConfigPopup={CloseEditConfiguration} />}
    </div >
  );
}
export default Header