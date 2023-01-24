import * as React from 'react';
import Popup from 'reactjs-popup';
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Panel, PanelType } from 'office-ui-fabric-react';


const CreateMeetingPopup = (Item: any) => {
    const [modalopen, setmodalopen] = React.useState(true)


    const ModalIsOpenToFalse = () => {
        // setmodalopen(false)
        let callBack = Item.Call
        callBack();
        setmodalopen(false)
    }


    return (
        <>
            <Panel
                headerText='CreateTask '
                type={PanelType.medium}
                isOpen={modalopen}
                onDismiss={ModalIsOpenToFalse}
                isBlocking={false}
                >

                <div className='modal-body'>
                    <div className="row panel-padding tab-content mb-10 bdrbox">
                        <div className="row mt-10 padL-0 PadR0">

                            <div className="col-sm-7 padL-0">
                                <div className="col-sm-12 padL-0 mb-10">
                                    <label className="full_width">Task Name</label>
                                    <input className="form-control" type="text" ng-required="true" placeholder="Enter Task Name"
                                        />
                                </div>

                            </div>
                            <div className="col-sm-3">
                                <label className="full_width">Component</label>
                                <div ng-show="data.SelectedComponent.length==0" className="col-sm-11 mb-10 padL-0">
                                    <input type="text" className="form-control ui-autocomplete-input" id="txtSharewebComponentcrt"
                                        autoComplete="off" /><span role="status" aria-live="polite"
                                            className="ui-helper-hidden-accessible"></span>
                                </div>
                                {/* <div className=" col-sm-11 block" ng-mouseover="HoverIn(item);"
                                    ng-mouseleave="ComponentTitle.STRING='';" title="{{ComponentTitle.STRING}}"
                                    ng-repeat="item in data.SelectedComponent track by $index">
                                    <a className="hreflink" target="_blank"
                                        ng-href="{{CurrentSiteUrl}}/SitePages/Portfolio-Profile.aspx?taskId={{item.Id}}">{Item.Title}</a>
                                    <a className="hreflink" ng-click="removeSmartComponent(item.Id,data.SelectedComponent)">
                                        <img ng-src="/_layouts/images/delete.gif" />
                                    </a>
                                </div> */}
                                <div className="col-sm-1 no-padding">

                                    <img src="https://www.shareweb.ch/_layouts/15/images/EMMCopyTerm.png"
                                        ng-click="openSmartTaxonomyPopup('Components', Item.SharewebComponent, data);" />
                                </div>

                            </div>
                            <div className="col-sm-2 PadR0">
                                <label htmlFor="Site" className="full_width">Site</label>
                                <select id="Site" className="form-control" ng-required="true" ng-model="data.Site">
                                    <option value="DE">DE</option>
                                    <option value="Education">Education</option>
                                    <option value="EI">EI</option>
                                    <option value="EPS">EPS</option>
                                    <option value="Gruene">Gruene</option>
                                    <option value="Health">Health</option>
                                    <option value="HHHH">HHHH</option>
                                    <option value="ALAKDigital">DA</option>
                                    <option value="KathaBeck">KathaBeck</option>
                                    <option value="Shareweb">Shareweb</option>
                                    <option value="SmallProjects">Small Projects</option>
                                    <option value="OffshoreTasks">Offshore Tasks</option>
                                </select>
                            </div>

                            <div className="row padL-0 mb-10 PadR0">
                                <label className="full_width">Url</label>
                                <input className="form-control" type="text" ng-required="true" placeholder="Url"
                                    ng-model="data.URL" />
                            </div>
                            <div className="row commentForAdmin padL-0 PadR0" style={{ width: "100%" }} ng-cloak>
                                <label>Description</label>
                                <div className="col-sm-12"></div>
                                <div className="col-sm-12 padding-0 Createmeetingdes">
                                    <textarea rows={4}></textarea>
                                </div>
                                <div className="clearfix"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <footer>
                    <button type="button" className='btn btn-primary'>Submit</button>
                </footer>
            </Panel>
        </>
    )
}
export default CreateMeetingPopup;