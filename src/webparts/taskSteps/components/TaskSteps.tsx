import * as React from 'react';
import styles from './TaskSteps.module.scss';
import { ITaskStepsProps } from './ITaskStepsProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { Web } from "sp-pnp-js";
import { ThemeSettingName } from 'office-ui-fabric-react';



export interface ITaskStepsState {  
  Result : any;
  listName : string;
  itemID : number;
  maxChildCount: number;
}

export default class TaskSteps extends React.Component<ITaskStepsProps, ITaskStepsState> {

  private totalCount = 0;
  private needtorun = 0;
  public constructor(props:ITaskStepsProps,state:ITaskStepsState){
    super(props);
    const params = new URLSearchParams(window.location.search);    
    console.log(params.get('taskId'));
    console.log(params.get('Site'));

    this.state ={
      Result:{},
      listName: params.get('Site'),
      itemID : Number(params.get('taskId')),
      maxChildCount : 0      
    }

    this.GetResult();
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
    console.log('12345');
   
    let taskDetails = [];    
    taskDetails = await web.lists
      .getByTitle(this.state.listName)
      .items
      .filter("SharewebTaskLevel1No eq '"+ taskInfo['SharewebTaskLevel1No'] +"'")
      .select("ID","Title","Shareweb_x0020_ID","SharewebTaskType/Title","Component/Title","ParentTask/Title","SharewebTaskLevel1No","SharewebTaskLevel2No")
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
        SharewebTaskLevel2No : i.SharewebTaskLevel2No
    })});  

    let arrayDictionary:any = {};

    //set parent element
    for (let index = 0; index < tempTask.length; index++) {
      const element = tempTask[index];
      if (tempTask[index].ParentTask == null){
        arrayDictionary = tempTask[index];
        arrayDictionary["children"] = [];
        break;
      }      
    }
   
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

    //console.log(arrayDictionary);
    let maxChildCount:any = 0;
    if(arrayDictionary != undefined){       
       for (let i = 0; i < arrayDictionary["children"].length; i++) {
        const element = arrayDictionary["children"][i];
        if(element.children != undefined)
        {
          maxChildCount = (element.children.length > maxChildCount) ? element.children.length : maxChildCount
        }
       }
    }
    
   
    this.setState({
      Result : arrayDictionary,
      maxChildCount : maxChildCount
    }, () => {
      console.log(this.state.Result);
      console.log("max child count" + this.state.maxChildCount);
    }
    );     
  }

  private getParentTask(){
    
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
            <table className={styles.tabletaskSteps}>
              <tr>
                <td>
                  <b>{this.state.Result.Title}</b>
                </td>
                {this.state.Result.children != undefined && 
                  this.state.Result.children.length >0 &&
                  this.state.Result.children.map( (children:any,i:any)=> {                    
                    if (children.SharewebTaskType.Title == "Task"){
                      this.totalCount = i+1
                      return <td>
                            {children.Title}
                          </td>
                      }
                                
                    
                })}
                {(this.state.maxChildCount - this.totalCount) > 0 && [...Array(this.state.maxChildCount - this.totalCount)].map((i:any) =>{
                     return <td>
                           </td>
               
                }) 
                }                
                
              </tr>
              {this.state.Result.children != undefined && 
                  this.state.Result.children.length >0 &&
                  this.state.Result.children.map( (children:any,i:any)=> { 
                    if (children.SharewebTaskType.Title != "Task"){
                      return <tr>
                              <td>
                                <b>{children.Title}</b>
                              </td>
                            {children.children != undefined &&
                            children.children.length > 0 &&
                            children.children.map((child:any,j:any)=>{
                              this.totalCount = j+1
                              return <td>
                                {child.Title}
                              </td>
                            })}

                            {(this.state.maxChildCount - this.totalCount) > 0 && [...Array(this.state.maxChildCount - this.totalCount)].map((i:any) =>{
                              return <td>
                              </td>
               
                            })}

                          </tr>
                    }  
                  })}
            </table>
          </div>
        }
      </div>
    );
  }
}
