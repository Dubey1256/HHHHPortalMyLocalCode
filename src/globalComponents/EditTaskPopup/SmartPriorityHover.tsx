import * as React from "react";
const SmartPriorityHover = (props: any) => {
    const checkImmedidate=props?.editValue?.TaskCategories?.some((cat: any) => cat.Title === 'Immediate');
    return (
        <>
            <div className="boldClable siteColor mb-2">
                <span style={{color:''}} >SmartPriority = ( </span>
                <span style={{color:'#008600'}}>TaskPriority  </span>
                <span>{' '} + {' '}</span>
                <span style={{color:'#ca4200'}}>ProjectPriority</span>
                <span>{' '}  *  {' '} 4) / 5
                {checkImmedidate==true?
                <><span >{' '}*{' '} </span><span style={{color:'#b00000'}}> Immediate</span></>
                :''}                   
                     </span>
            </div>
            <div style={{color:'#008600'}}>TaskPriority = { props?.editValue?.PriorityRank}</div>
            <div style={{color:'#ca4200'}}>ProjectPriority = {props?.editValue?.Project?.PriorityRank}</div>
            {checkImmedidate==true?<div style={{color:'#b00000'}}>Immediate = 2</div>:''}
            <div>
                <span className="siteColor">SmartPriority = </span>
                (
                <span style={{color:'#008600'}}>{props?.editValue?.PriorityRank}</span>
                  <span> {' '}+ {' '}</span>
                  <span style={{color:'#ca4200'}}>{props?.editValue?.Project?.PriorityRank}</span>
                  {' '}*{' '}4){' '}/{' '} 5
                  {checkImmedidate==true? <><span>{' '}  * {' '} </span> <span style={{color:'#b00000'}}> 2</span></> :''}   
                  <span>=</span>
                  <span className="siteColor boldClable">{' '} {props?.editValue?.SmartPriority}</span>    
                  </div>

        </>
    );



}
export default SmartPriorityHover;