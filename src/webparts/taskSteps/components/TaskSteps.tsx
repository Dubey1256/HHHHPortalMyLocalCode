import * as React from 'react';
import styles from './TaskSteps.module.scss';
import { ITaskStepsProps } from './ITaskStepsProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { Web } from "sp-pnp-js";
import { ThemeSettingName } from 'office-ui-fabric-react';
import { Modal } from 'office-ui-fabric-react';

export interface ITaskStepsState {  
  Result : any;
  listName : string;
  itemID : number;
  maxChildCount: number;
  rows: any;
  planData: any;
  isModalOpen: boolean;
  inputTaskTitle: string;
  AllTask : any;
  ParentTaskOnModal : any;
  suggestions : any;
  selectedText : string;
  selectedID : number;
  cellNo: number;
}

export default class TaskSteps extends React.Component<ITaskStepsProps, ITaskStepsState> {
  
  public constructor(props:ITaskStepsProps,state:ITaskStepsState){
    super(props);
    const params = new URLSearchParams(window.location.search);    
    console.log(params.get('taskId'));
    console.log(params.get('Site'));

    this.state ={
      Result:{},
      listName: params.get('Site'),
      itemID : Number(params.get('taskId')),
      maxChildCount : 0,
      rows: [],   
      planData:[],
      isModalOpen: false,
      inputTaskTitle:'' ,
      AllTask : [],
      ParentTaskOnModal : [],
      suggestions: [],
      selectedText : '',
      selectedID : 0, 
      cellNo : 0
    }
    this.GetResult();
    this.GetAllTask();
  }

 
  private async GetResult() {   
    let web = new Web(this.props.Context.pageContext.web.absoluteUrl);
    let taskInfo = [];    
    taskInfo = await web.lists
      .getByTitle(this.state.listName)
      .items
      .getById(this.state.itemID)
      .select("ID","Title","SharewebTaskLevel1No")
      .get();
      
    console.log("SharewebTaskLevel1No - " +taskInfo['SharewebTaskLevel1No']);
    console.log('test again 2');
   
    let taskDetails = [];    
    taskDetails = await web.lists
      .getByTitle(this.state.listName)
      .items
      .filter("SharewebTaskLevel1No eq '"+ taskInfo['SharewebTaskLevel1No'] +"'")
      .select("ID","Title","DueDate","PercentComplete","Shareweb_x0020_ID","SharewebTaskType/Title","Component/Title","ParentTask/Id","ParentTask/Title","SharewebTaskLevel1No","SharewebTaskLevel2No","StepNo")
      .expand("SharewebTaskType","Component","ParentTask")
      .get();

    let tempTask = taskDetails.map((i:any)=>{
      return({      
        ID: i.ID,
        Title: i.Title,
        SharewebID : i.Shareweb_x0020_ID,      
        SharewebTaskType : i.SharewebTaskType,
        ParentTask: i.ParentTask != undefined ? i.ParentTask : null,
        Component:  i.Component,
        SharewebTaskLevel1No : i.SharewebTaskLevel1No,
        SharewebTaskLevel2No : i.SharewebTaskLevel2No,
        StepNo : i.StepNo != null ? i.StepNo : 1,
        PercentComplete : i.PercentComplete * 100,
        DueDate : i.DueDate != null ? (new Date(i.DueDate)).toLocaleDateString() : '',
    })});   

    let arrayDictionary:any = {};
    let maxStepNo = 1;
    
    //set parent element
    for (let index = 0; index < tempTask.length; index++) {
      const element = tempTask[index];

      if (tempTask[index].ParentTask == null){
        arrayDictionary = tempTask[index];       
        arrayDictionary["children"] = [];
        //break;
      }
      //set max count value
      maxStepNo = (maxStepNo > tempTask[index].StepNo) ? maxStepNo : tempTask[index].StepNo;
    }   

    console.log('max step count - '+ maxStepNo);
   
    //get All the child of 2nd level
    for (let index = 0; index < tempTask.length; index++) {
      const element = tempTask[index];    
      if (tempTask[index].ParentTask != null){
        if (arrayDictionary.Title == tempTask[index].ParentTask.Title){          
          let temp = tempTask[index];
          temp["children"] = [];    
          arrayDictionary["children"].push(tempTask[index]);          
        } 
      }     
    }
    //console.log(arrayDictionary);
    
    //get all the child of 3rd level
    for (let i = 0; i < arrayDictionary["children"].length; i++){
      let childelement = arrayDictionary["children"][i]
      for (let j = 0; j < tempTask.length; j++){
        if(tempTask[j].ParentTask != null){
          if(childelement.Title == tempTask[j].ParentTask.Title){
            arrayDictionary["children"][i]["children"].push(tempTask[j])
          }
        }        
      }
    }

    console.log(arrayDictionary);
    let maxChildCount:any = 0;
    if(arrayDictionary != undefined){       
       for (let i = 0; i < arrayDictionary["children"].length; i++) {
        const element = arrayDictionary["children"][i];
        if(element.children != undefined)
        {
          maxChildCount = (element.children.length > maxChildCount) ? element.children.length : maxChildCount
        }
       }

       let childOfMainParent = arrayDictionary["children"].filter(function (item:any, i:any){       
            return item.SharewebTaskType.Title == "Task"
        })

        maxChildCount = (maxChildCount > childOfMainParent.length) ? maxChildCount : childOfMainParent.length; 
        maxChildCount = (maxChildCount > maxStepNo) ? maxChildCount : maxStepNo;
        
    }
    
    console.log("max child count - "+maxChildCount);
    let plannedData = [];
    let plandt:any = {}

    //set 1 row 1 column
    plandt = {
      ID : arrayDictionary.ID,
      TaskTitle : arrayDictionary.Title,
      SharewebTaskLevel1No : arrayDictionary.SharewebTaskLevel1No,
      child:[]
    }
    plannedData.push(plandt);
    
    //set child Task of main element
    for (let i = 0; i < arrayDictionary["children"].length; i++){
      const children = arrayDictionary["children"][i];
      if (children.SharewebTaskType.Title == "Task")
      {
        let child = {
          ID : children.ID,
          SubTitle : children.Title,
          ParentTask : children.ParentTask,
          StepNo : children.StepNo,
          PercentComplete : children.PercentComplete,
          DueDate : children.DueDate
        }
        plannedData[0].child.push(child);
      }
      else{
        let plandt = {
          ID : children.ID,
          TaskTitle : children.Title,
          SharewebTaskLevel1No : children.SharewebTaskLevel1No,
          child:[] as any[]
        }
        plannedData.push(plandt);
      }
    }

    //set child Task of workstream element
    for (let index = 0; index < plannedData.length; index++) {
      const element = plannedData[index];
      if(index != 0){
        for (let i = 0; i < arrayDictionary["children"].length; i++){
          const childs = arrayDictionary["children"][i];         
            for (let j = 0; j < childs["children"].length; j++) {
              const element = childs["children"][j];
              if(plannedData[index].TaskTitle == element.ParentTask.Title){
                let child = {
                  ID : element.ID,
                  SubTitle : element.Title,
                  ParentTask : element.ParentTask,
                  StepNo : element.StepNo,
                  PercentComplete : element.PercentComplete,
                  DueDate : element.DueDate
                }
                plannedData[index].child.push(child);
              }        
            }         
          }
      }      
    }

    //add blank element if child count is less than max count
    
    for (let index = 0; index < plannedData.length; index++) {
      if (maxChildCount > plannedData[index].child.length){      
        let itemToRun = maxChildCount - plannedData[index].child.length;
        //Get All Step no
        let AllStepNo = [];
        for (let k = 0; k < plannedData[index].child.length; k++) {
          AllStepNo.push(plannedData[index].child[k].StepNo)          
        }       
        let runloop = 0;
        for (let l = maxChildCount; l >= 1; l--) {          
          if(AllStepNo.indexOf(l)<0){
              plannedData[index].child.push({StepNo : l});
              runloop += 1;
              if (runloop == itemToRun)
                break;
          }
        }                
      }
    }

    //sort child element based on step no
    for (let index = 0; index < plannedData.length; index++) {
      //const element = plannedData[index].child;
      plannedData[index].child.sort(function(a:any, b:any) {
        let keyA = a.StepNo,
          keyB = b.StepNo;
        // Compare the 2 values
        if (keyA > keyB) return 1;
        if (keyA < keyB) return -1;
        return 0;
      });
    }
   
    console.log(plannedData);

    this.setState({
      Result : plannedData,
      maxChildCount : maxChildCount
    }, () => {
      console.log(this.state.Result);
      console.log("max child count" + this.state.maxChildCount);
      
    }
    );     
  }

  private async GetAllTask(){
    let web = new Web(this.props.Context.pageContext.web.absoluteUrl);
    let taskInfo = [];    
    taskInfo = await web.lists
      .getByTitle(this.state.listName)     
      .items
      .filter("SharewebTaskType/Title eq 'Task'")
      .select("ID","Title","SharewebTaskType/Title","ParentTask/Title")
      .expand("SharewebTaskType","ParentTask")
      .getAll(4000);

    console.log('All Item Count - '+taskInfo.length);
    this.setState({
      AllTask : taskInfo
    })
  }

  private AddColumn(){
    let plannedDT = this.state.Result;
    plannedDT.forEach((element:any) => {
      element.child.push({StepNo : this.state.maxChildCount + 1});
    });

    this.setState({
      Result : plannedDT,
      maxChildCount : this.state.maxChildCount + 1
    })
  }

  private openModal(item:any, stepNo:number){
    console.log(item);
   
    this.setState({
      isModalOpen : true,
      ParentTaskOnModal : item,
      cellNo : stepNo + 1
    }, ()=> console.log('Cell no - '+ this.state.cellNo))
    
  }

  //close the model
  private CloseModal(e:any) {
    e.preventDefault();
    this.setState({ 
      isModalOpen:false,
      ParentTaskOnModal : [],
      cellNo : 0
    });
  }

  private handleTitle(e:any){
    const value = e.target.value;
    let suggestions = [];
    if(value.length > 0){   
        suggestions = this.state.AllTask.filter(function (item:any, i:any){
            if(item["Title"] != null){
                return item["Title"].toLowerCase().indexOf(value.toLowerCase().trim()) > -1
            }            
            
        });
        console.log(suggestions);
    }
    this.setState({ suggestions, selectedText: value })
  }

  private suggestionSelected(item:any){
    console.log(item);
    this.setState({
        selectedText : item.Title,
        selectedID : item.ID,  
        suggestions : []
    })
  }

  private async AttachTask(){
    if(this.state.selectedText != "" ){
      let web = new Web(this.props.Context.pageContext.web.absoluteUrl);
      if (this.state.selectedID != 0){
        const i = await web.lists.getByTitle(this.state.listName)
              .items
              .getById(this.state.selectedID).update({
                ParentTaskId: this.state.ParentTaskOnModal.ID,
                SharewebTaskLevel1No : this.state.ParentTaskOnModal.SharewebTaskLevel1No,
                StepNo : this.state.cellNo
              });
      }
      else{
      const i = await web.lists.getByTitle(this.state.listName)
              .items
              .add({
                Title: this.state.selectedText,
                ParentTaskId: this.state.ParentTaskOnModal.ID,
                SharewebTaskLevel1No : this.state.ParentTaskOnModal.SharewebTaskLevel1No,
                StepNo : this.state.cellNo,
                SharewebTaskTypeId : 2
              });
      }      

      this.setState({
        selectedText : "",
        isModalOpen:false,
        selectedID:0,
        ParentTaskOnModal : [],
        cellNo : 0
      }, ()=> {
        this.GetResult();
        this.GetAllTask();
      })
    }
    else{
      alert('Please select any task to attach.')
    }    
  }


  public render(): React.ReactElement<ITaskStepsProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName
    } = this.props;

    return (
      <div>
        {this.state.Result != null &&
          <div>
            <div className='col-sm-12 pad0'>
              <span className="pull-right">
                <img src={require('../assets/plus.png')} onClick={()=> this.AddColumn() } style={{marginRight:'5px'}} />
              </span>
            </div>
            <div className='col-sm-12 pad0'>
              <table className={styles.tabletaskSteps}>
                {this.state.Result.length > 0 &&
                 this.state.Result.map( (row:any,i:any)=> { 
                  return <tr>
                    <td>
                    <b>{row.TaskTitle}</b>
                    </td>
                    {
                      row.child != null &&
                      row.child.length > 0 &&
                      row.child.map( (col:any,i:number)=> { 
                        return <td>
                         {(col.ID != null) ? 
                           <div><div>{col.SubTitle + " ("+col.PercentComplete+"%)"}</div><div>{col.DueDate != null && (col.DueDate)}</div></div>   :
                            <span className="pull-right" style={{cursor:'pointer' }}>
                              {/*<a className='hreflink' onClick={()=>this.openModal(row, i)}>Add task</a> */}
                              <img src={require('../assets/plus-math.png')} onClick={()=> this.openModal(row, i) } />
                            </span>
                          }
                        </td>
                      })
                    }
                  </tr>
                 })}                
              </table> 
            </div>            
          </div>
        }
        <Modal isOpen={this.state.isModalOpen} isBlocking={false}>
          <div className='modal-dialog modal-help'>
            <div className='modal-content'>
              <div className='modal-header'>
                  <h3 className='modal-title'>Attach the Task</h3>
                  <button type="button" className='close' style={{minWidth: "10px"}} onClick={(e) =>this.CloseModal(e) }>x</button>
              </div>
              <div className='modal-body'>
              <div className={styles.AutoCompleteText}>
                <input type="text" className="form-control" value={this.state.selectedText}
                    placeholder="Task Name" onChange={(e)=>this.handleTitle(e)}/>
                <ul>    
                {this.state.suggestions.length > 0 && this.state.suggestions != undefined && this.state.suggestions.length > 0 &&
                 this.state.suggestions.map( (item:any,i:any)=> { 
                    return <li onClick={()=>this.suggestionSelected(item)}>{item.Title}</li>
                 })
                }
                </ul>
            </div>                   
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={() =>this.AttachTask() } >Save</button>
                <button type="button" className="btn btn-default" onClick={(e) =>this.CloseModal(e) }>Cancel</button>
              </div>
            </div>
          </div>          
          </Modal>
      </div>
    );
  }
}
