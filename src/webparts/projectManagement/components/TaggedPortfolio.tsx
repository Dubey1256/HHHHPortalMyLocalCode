import * as React from 'react';
import "bootstrap/js/dist/tab.js";
import "./ProjectManagement.module.scss"
import "bootstrap/dist/css/bootstrap.min.css";
import '../components/TagTaskToProjectPopup.css';
import { FaAngleDown, FaAngleUp, FaHome } from 'react-icons/fa';
import { Web } from "sp-pnp-js";
import { IoMdArrowDropright, IoMdArrowDropdown } from 'react-icons/io';
import * as Moment from 'moment';
import axios, { AxiosResponse } from 'axios';
import PortfolioTagging from '../../projectmanagementOverviewTool/components/PortfolioTagging';
import ProjectManagementMain from './ProjectManagementMain';
let linkedComponentData: any = [];
let smartComponentData: any = [];
let portfolioType = '';

const TaggedPortfolio = (props: any) => {
  const [item, setItem] = React.useState({});
  const [ShareWebComponent, setShareWebComponent] = React.useState('');
  const [IsPortfolio, setIsPortfolio] = React.useState(false);
  React.useEffect(() => {
    if (props?.item != undefined) {
      setItem(props?.item)

      linkedComponentData = props?.item?.smartService;
      smartComponentData = props?.item?.smartComponent;
    }

  }, []);
  const EditPortfolio = (item: any, type: any) => {
    //   if(type=='Component'){
    //     if (item.Component != undefined) {
    //         item.smartComponent=[];
    //         if (item.smartComponent != undefined) {
    //             item?.Component?.map((com:any)=>{
    //                 item.smartComponent.push({ 'Title': com?.Title, 'Id': com?.Id });
    //             })
    //         }
    //     }
    // }else if(type=='Service'){
    //     if (item.Services != undefined) {
    //         item.smartService=[];
    //         if (item.smartService != undefined) {
    //             item?.Services?.map((com:any)=>{
    //                 item.smartService.push({ 'Title': com?.Title, 'Id': com?.Id });
    //             })
    //         }
    //     }
    // }
    portfolioType = type
    setIsPortfolio(true);
    setShareWebComponent(item);
  }
  const Call = (propsItems: any, type: any) => {
    setIsPortfolio(false);
    if (type === "Service") {
      if (propsItems?.smartService?.length > 0) {
        linkedComponentData = propsItems.smartService;
        TagPotfolioToProject();
      }
    }
    if (type === "Component") {
      if (propsItems?.smartComponent?.length > 0) {
        smartComponentData = propsItems.smartComponent;
        TagPotfolioToProject()
      }
    }

  };
  const TagPotfolioToProject = async () => {
    if (props?.item?.Id != undefined) {


      let selectedComponent: any[] = [];
      if (smartComponentData !== undefined && smartComponentData.length > 0) {
        $.each(smartComponentData, function (index: any, smart: any) {
          selectedComponent.push(smart?.Id);
        })
      }
      let selectedService: any[] = [];
      if (linkedComponentData !== undefined && linkedComponentData.length > 0) {
        $.each(linkedComponentData, function (index: any, smart: any) {
          selectedService.push(smart?.Id);
        })
      }
      let web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/SP');
      await web.lists.getById('ec34b38f-0669-480a-910c-f84e92e58adf').items.getById(props?.item?.Id).update({
        ComponentId: { "results": (selectedComponent !== undefined && selectedComponent?.length > 0) ? selectedComponent : [] },
        ServicesId: { "results": (selectedService !== undefined && selectedService?.length > 0) ? selectedService : [] },
      }).then((res: any) => {
        props?.call();
        console.log(res);
      })
    }
  }
  return (
    <>
      <div className='Dashboardsecrtion'>
        <div className="dashboard-colm">
          <aside className="sidebar">
            <button type="button" ng-click="ShowFullMonth==true?ShowFullMonth=false:ShowFullMonth=true" className="collapse-toggle"></button>
            <section className="sidebar__section sidebar__section--menu">
              <nav className="nav">
                <ul className="nav__list">
                  <li id="DefaultViewSelectId" className="nav__item">
                    <a ng-click="ChangeView('DefaultView','DefaultViewSelectId')" className="nav__link">
                      <span className="nav__icon nav__icon--home"></span>
                      <span className="nav__text">Component</span>
                    </a>
                  </li>
                  <li className="nav__item">
                    <div className="">
                      {
                        props?.taggedComponents?.length > 0 ?
                          <table className="table">
                            <tbody>
                              {
                                props?.taggedComponents?.map((component: any) => {
                                  return (
                                    <tr>
                                      <td>
                                        <span><a data-interception="off" target="blank" href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages//Portfolio-Profile.aspx?taskId=${component?.Id}`}>{component?.Title}</a></span>
                                      </td>
                                    </tr>
                                  )
                                })
                              }
                            </tbody>
                          </table>
                          :
                          <div className="border rounded-2 p-3 text-center">
                            No Tagged Component
                          </div>
                      }
                      <div className="text-end mt-2 bt-2">
                        <a style={{color:'white !important'}} onClick={(e) => EditPortfolio(props?.item, 'Component')}>Tag Components</a>
                      </div>
                    </div>
                  </li>
                </ul>
              </nav>
            </section>
            <section className="sidebar__section sidebar__section--menu">
              <nav className="nav">
                <ul className="nav__list">
                  <li id="DefaultViewSelectId" className="nav__item">
                    <a ng-click="ChangeView('DefaultView','DefaultViewSelectId')" className="nav__link">
                      <span className="nav__icon nav__icon--home"></span>
                      <span className="nav__text">Service</span>
                    </a>
                  </li>
                  <li id="DefaultViewSelectId" className="nav__item">
                    <div className="">
                    {
            props?.taggedServices?.length > 0 ?
              <table className="table">
                <tbody>
                  {
                    props?.taggedServices?.map((service: any) => {
                      return (
                        <tr>
                          <td>
                            <span><a data-interception="off" target="blank" href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages//Portfolio-Profile.aspx?taskId=${service?.Id}`}>{service?.Title}</a></span>
                          </td>
                        </tr>
                      )
                    })
                  }

                </tbody>
              </table>
              :
              <div className="border rounded-2 p-3 text-center">
              No Tagged Service
            </div>
              }
              <div className="text-end mt-2 bt-2">
                <a style={{color:'white !important'}} onClick={(e) => EditPortfolio(props?.item, 'Service')}>Tag Services</a>
              </div>  
                    </div>
                  </li>
                </ul>
              </nav>
            </section>
          </aside>
          <div className="dashboard-content col-sm-12 padR-0">
            <article>
              <ProjectManagementMain pageContext={props?.pageContext} />

            </article>
          </div>
        </div>
      </div>
      {/* <div className="" id="myTabContent">
      <div className="col">
        <div className="card mb-4 rounded-3 shadow-sm">
          <div className="card-header py-2">
            <div className="my-0 fw-normal fs-6">Components</div>
          </div>
          <div className="card-body">
          {
            props?.taggedComponents?.length > 0 ?
              <table className="table">
                <tbody>
                  {
                    props?.taggedComponents?.map((component: any) => {
                      return (
                        <tr>
                          <td>
                            <span><a data-interception="off" target="blank" href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages//Portfolio-Profile.aspx?taskId=${component?.Id}`}>{component?.Title}</a></span>
                          </td>
                        </tr>
                      )
                    })
                  }
                </tbody>
              </table>
              :
              <div className="border rounded-2 p-3 text-center">
                No Tagged Component
              </div>
              }
              <div className="text-end mt-2 bt-2">
                <a onClick={(e) => EditPortfolio(props?.item, 'Component')}>Tag Components</a>
              </div>
          </div>
        </div>
      </div>
      <div className="col">
        <div className="card mb-4 rounded-3 shadow-sm">
          <div className="card-header py-2">
            <div className="my-0 fw-normal fs-6">Services</div>
          </div>
          <div className="card-body">
          {
            props?.taggedServices?.length > 0 ?
              <table className="table">
                <tbody>
                  {
                    props?.taggedServices?.map((service: any) => {
                      return (
                        <tr>
                          <td>
                            <span><a data-interception="off" target="blank" href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages//Portfolio-Profile.aspx?taskId=${service?.Id}`}>{service?.Title}</a></span>
                          </td>
                        </tr>
                      )
                    })
                  }

                </tbody>
              </table>
              :
              <div className="border rounded-2 p-3 text-center">
              No Tagged Service
            </div>
              }
              <div className="text-end mt-2 bt-2">
                <a onClick={(e) => EditPortfolio(props?.item, 'Service')}>Tag Services</a>
              </div>
          </div>
        </div>
      </div>
    



      </div> */}
      {IsPortfolio && <PortfolioTagging props={ShareWebComponent} type={portfolioType} Call={Call}></PortfolioTagging>}



    </>
  )
}
export default TaggedPortfolio;