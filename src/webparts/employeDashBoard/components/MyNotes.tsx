import * as React from 'react';
import { useEffect, useState } from 'react';
const MyNotes=()=>{

    return(
        <>
       <div className='bg-white col-7 ps-0 pt-3'>
        <div className='alignCenter justify-content-between'>
            <span className='fw-bold'>My Notes(4)</span>
          <span>
            <button>Add Note</button>
          </span>
       </div>
       <div className='alignCenter justify-content-between'>
        <div><h5>Shivdaat sir 1 weeding anniversary</h5></div>
        <div>
        <span className="svg__iconbox svg__icon--share"></span>
        <span className="svg__iconbox svg__icon--editBox"></span>
        <span className="svg__iconbox svg__icon--trash"></span>
        </div>
        
       </div>
       <div>
            content 
        </div>
       </div>
        </>
    )
}
export default MyNotes;