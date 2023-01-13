import * as React from 'react';
import * as $ from 'jquery';
import "bootstrap/dist/css/bootstrap.min.css";
import axios, { AxiosResponse } from 'axios';
import './TaskDashboard.scss';

const Clienttask = () => {
  

  
    
    return (
        <>
           
                <div className="row">
                            <div className="col-sm-12">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">Client Tasks</h5>
                                        <div className='shreweb-btn'>
                                       <a href="https://www.shareweb.ch/site/Joint/team/Pages/Content/Dashboard.aspx"><b>Click here</b></a> to see all SDC tasks
                                       </div>
                                       
                                       
                                    </div>
                                </div>
                            </div>
                           
                        </div>
                
        </>
    )
}
export default Clienttask;