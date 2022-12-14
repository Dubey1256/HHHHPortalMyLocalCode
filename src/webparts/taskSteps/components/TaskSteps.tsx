import * as React from 'react';
import styles from './TaskSteps.module.scss';
import { ITaskStepsProps } from './ITaskStepsProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { Web } from "sp-pnp-js";

export interface ITaskStepsState {  
  Result : any;
  listName : string;
  itemID : number;
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
      itemID : Number(params.get('taskId'))      
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
        ParentTask: i.ParentTask != undefined ? i.ParentTask : {Title : ''},
        Component:  i.Component,
        SharewebTaskLevel1No : i.SharewebTaskLevel1No,
        SharewebTaskLevel2No : i.SharewebTaskLevel2No
    })});  

    const array = [
      { id: 919, parentid: 456, name: "Terriers" },
      { id: 456, parentid: 123, name: "Dogs" },
      { id: 214, parentid: 456, name: "Labradors" },
      { id: 810, parentid: 456, name: "Pugs" },
      { id: 123, parentid: 0, name: "Mammals" },
    ];
    
    let tree:any = [], arrayDictionary:any = {};    
    // First map the nodes of the array to an object/dictionary where the key is their id
    tempTask.forEach((cat:any) => {
      arrayDictionary[cat.ID] = cat;
      arrayDictionary[cat.ID]["children"] = [];
    });   
    
    // for each entry in the dictionary
    for (var entry in arrayDictionary) {
      // get all the data for this entry in the dictionary
      const mappedElem = arrayDictionary[entry];

      // if the element has a parent, add it
      if (
        mappedElem.ParentTask && // the dictionary has a parent
        arrayDictionary[mappedElem["ParentTask"].Title] // and that parent exists
        ) {

        arrayDictionary[mappedElem["ID"]]["children"].push(mappedElem);
      }
      // else is at the root level (parentid = null or 0)
      else {
        tree.push(mappedElem);
      }
    }
    
    console.log(tree);


    
    console.log(tempTask);   

    this.setState({
      Result : tempTask
    });
    
    
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
      <section className={`${styles.taskSteps} ${hasTeamsContext ? styles.teams : ''}`}>
        <div className={styles.welcome}>
          <img alt="" src={isDarkTheme ? require('../assets/welcome-dark.png') : require('../assets/welcome-light.png')} className={styles.welcomeImage} />
          <h2>Well done, {escape(userDisplayName)}!</h2>
          <div>{environmentMessage}</div>
          <div>Web part property value: <strong>{escape(description)}</strong></div>
        </div>
        <div>
          <h3>Welcome to SharePoint Framework!</h3>
          <p>
            The SharePoint Framework (SPFx) is a extensibility model for Microsoft Viva, Microsoft Teams and SharePoint. It's the easiest way to extend Microsoft 365 with automatic Single Sign On, automatic hosting and industry standard tooling.
          </p>
          <h4>Learn more about SPFx development:</h4>
          <ul className={styles.links}>
            <li><a href="https://aka.ms/spfx" target="_blank">SharePoint Framework Overview</a></li>
            <li><a href="https://aka.ms/spfx-yeoman-graph" target="_blank">Use Microsoft Graph in your solution</a></li>
            <li><a href="https://aka.ms/spfx-yeoman-teams" target="_blank">Build for Microsoft Teams using SharePoint Framework</a></li>
            <li><a href="https://aka.ms/spfx-yeoman-viva" target="_blank">Build for Microsoft Viva Connections using SharePoint Framework</a></li>
            <li><a href="https://aka.ms/spfx-yeoman-store" target="_blank">Publish SharePoint Framework applications to the marketplace</a></li>
            <li><a href="https://aka.ms/spfx-yeoman-api" target="_blank">SharePoint Framework API reference</a></li>
            <li><a href="https://aka.ms/m365pnp" target="_blank">Microsoft 365 Developer Community</a></li>
          </ul>
        </div>
      </section>
    );
  }
}
