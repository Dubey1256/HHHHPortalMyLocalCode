import * as React from 'react';
 
const EditDB = () => {
    return (
        <div>
            <div className="popup-section">
                <div className="popup-container">
                    <div className='edit-db-popup-navbar d-flex justify-content-between'>
                        <h2 className="popup-section-heading">Edit Page</h2>
                        <div className='nav-buttons d-flex'>
                            <button>Drop</button>
                            <button>Close</button>
                        </div>
                    </div>
                    <div className='navbar-header-section d-flex justify-content-between'>
                        <div className='d-inline'><label className='text-start'>Name</label><input type='text' /><span>.aspx</span></div>
                        <div className='d-inline'><label  className='text-start'>Title</label><input type='text' /></div>
                       <div className='d-inline'> <label  className='text-start'>Item-Rank</label><select>
                            <option>Select -01</option>
                            <option>Select -02</option>
                            <option>Select -03</option>
                            <option>Select -04</option>
                            <option>Select -05</option>
                        </select></div>


                    </div>

                </div>
            </div>
        </div>
    )
}
export default EditDB;