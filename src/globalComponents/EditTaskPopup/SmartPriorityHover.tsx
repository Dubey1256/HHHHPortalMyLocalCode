import * as React from "react";
const SmartPriorityHover = (props: any) => {
    const checkImmedidate=props?.editValue?.TaskCategories?.some((cat: any) => cat.Title === 'Immediate');
    const projectPriority=props?.editValue?.Project?.PriorityRank!=null?props?.editValue?.Project?.PriorityRank:0;
    const taskPriorityValue=props?.editValue?.PriorityRank!=null?props?.editValue?.PriorityRank:0;
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
            <div style={{color:'#008600'}}>TaskPriority = { taskPriorityValue}</div>
            <div style={{color:'#ca4200'}}>ProjectPriority = {projectPriority}</div>
            {checkImmedidate==true?<div style={{color:'#b00000'}}>Immediate = 2</div>:''}
            <div>
                <span className="siteColor">SmartPriority = </span>
                (
                <span style={{color:'#008600'}}>{taskPriorityValue}</span>
                  <span> {' '}+ {' '}</span>
                  <span style={{color:'#ca4200'}}>{projectPriority}</span>
                  {' '}*{' '}4){' '}/{' '} 5
                  {checkImmedidate==true? <><span>{' '}  * {' '} </span> <span style={{color:'#b00000'}}> 2</span></> :''}   
                  <span>=</span>
                  <span className="siteColor boldClable">{' '} {props?.editValue?.SmartPriority}</span>    
                  </div>

        </>
    );



}
export default SmartPriorityHover;