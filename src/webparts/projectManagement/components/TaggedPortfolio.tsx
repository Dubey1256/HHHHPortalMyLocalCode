import * as React from 'react';
import "bootstrap/js/dist/tab.js";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaAngleDown, FaAngleUp, FaHome } from 'react-icons/fa';
import { Web } from "sp-pnp-js";
import { IoMdArrowDropright, IoMdArrowDropdown } from 'react-icons/io';
import * as Moment from 'moment';
import axios, { AxiosResponse } from 'axios';
import PortfolioTagging from '../../projectmanagementOverviewTool/components/PortfolioTagging';
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

      {/* <ul className="nav nav-tabs" id="myTab" role="tablist">
        <li className="nav-item" role="presentation">
          <button className="nav-link active" id="Components-tab" data-bs-toggle="tab" data-bs-target="#Components" type="button" role="tab" aria-controls="Components" aria-selected="true">Components</button>
        </li>
        <li className="nav-item" role="presentation">
          <button className="nav-link" id="Services-tab" data-bs-toggle="tab" data-bs-target="#Services" type="button" role="tab" aria-controls="Services" aria-selected="false">Services</button>
        </li>

      </ul> */}
      <div className="" id="myTabContent">
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
        {/* <div className="tab-pane fade show active" id="Components" role="tabpanel" aria-labelledby="Components-tab">
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
              : ''}
          <div className="text-end mt-2 bt-2">
            <button type="button" className="btn btn-primary " onClick={(e) => EditPortfolio(props?.item, 'Component')}>Tag Components</button>

          </div>
        </div>


        <div className="tab-pane fade" id="Services" role="tabpanel" aria-labelledby="Services-tab">

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
              : ''}
          <div className="text-end mt-2 bt-2">
            <button type="button" className="btn btn-primary " onClick={(e) => EditPortfolio(props?.item, 'Service')}>Tag Services</button>
          </div>
        </div> */}



      </div>
      {IsPortfolio && <PortfolioTagging props={ShareWebComponent} type={portfolioType} Call={Call}></PortfolioTagging>}



    </>
  )
}
export default TaggedPortfolio;