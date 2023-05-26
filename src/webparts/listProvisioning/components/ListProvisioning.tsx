import * as React from 'react';
import styles from './ListProvisioning.module.scss';
import { IListProvisioningProps } from './IListProvisioningProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { getSP } from "../pnpjsConfig";
import { SPFI, spfi } from "@pnp/sp";
import "bootstrap/dist/css/bootstrap.min.css";
import { IItemAddResult } from '@pnp/sp/items';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/views";

import { IContentType, IContentTypeAddResult } from "@pnp/sp/content-types";
import { FieldTypes, FieldUserSelectionMode } from '@pnp/sp/fields/types';
import { createBatch } from '@pnp/sp/batching';

export interface IListProvisioningState { 
  ListName : string;
  msgInfo : string;
  isStart : boolean;
  itemID : number;
}

export default class ListProvisioning extends React.Component<IListProvisioningProps, IListProvisioningState> {
  private _sp: SPFI;

  constructor(props: IListProvisioningProps, state:IListProvisioningState) {
    super(props);
    // set initial state
    this.state = {
      ListName: "",
      msgInfo: "",
      isStart : false,
      itemID : 0
    };
    this._sp = getSP();
    
  }

  public batchSave = async () => { 

    // in one part of your application you setup a list instance
    const list = this._sp.web.lists.getByTitle("ListProvisioning");

    const [batchedListBehavior, execute] = createBatch(list);
    // this list is now batching all its requests
    list.using(batchedListBehavior);
    // these will all occur within a single batch
    list.items.add({ Title: `1` , Status: "Completed"});
    list.items.add({ Title: `2` , Status: "Completed"});
    list.items.add({ Title: `3` });
    list.items.add({ Title: `4` , Status: "InProgress"});

    list.items.getById(10).update({
      Title: "11", Status: "InProgress"
    });

    list.items.getById(11).update({
      Title: "12", Status: "InProgress"
    });

    list.items.getById(12).update({
      Title: "12", Status: "InProgress"
    });

    list.items.getById(13).update({
      Title: "13", Status: "InProgress"
    });

    await execute();

  }

  public SubmitClick = async () => {    
    
    if(this.state.ListName != '' )
    {
      this.setState({isStart : true, msgInfo : ""});      
       // add an item to the list      
       const iar: IItemAddResult = await this._sp.web.lists.getById(this.props.ProvisioningListID).items.add({
        Title: this.state.ListName
      });
     
      console.log(iar);
      
      if (iar.item.length > 0){
      
        this.setState({itemID:iar.data.ID});
        this.SetMsgInfo('Request data submitted successfully. <br/>');
        console.log("Request data submitted successfully.");
        console.log("Start List Creation.");
        this.SetMsgInfo('Start List Creation. <br/>');
        const updateProperties = {
          ContentTypes : ["0x010800A0C077AECAA23246BC1B4EFFB151E0EB"]
      };
      
        // ensure that a list exists. If it doesn't it will be created with the provided title (the rest of the settings will be default):
        const listEnsureResult = await this._sp.web.lists.ensure(this.state.ListName, "New Task List", 171, true);

        // check if the list was created, or if it already existed:
        if (listEnsureResult.created) {
          this.SetMsgInfo(this.state.ListName + " List was created. Adding Content Task Team Content Type <br/>");
          console.log(this.state.ListName + " List was created. Adding Content Task Team Content Type");
          const listCT : IContentTypeAddResult = await listEnsureResult.list.contentTypes.addAvailableContentType("0x010800A0C077AECAA23246BC1B4EFFB151E0EB");
          this.SetMsgInfo("Content Type Added<br/>");
          
          await this.RemoveTaskContentType();    
          this.SetMsgInfo("Adding List Columns<br/>");      
          await this.AddColumnsInBatch();
          this.SetMsgInfo("Adding List Entry in SmartMetadata List<br/>");  
          await this.AddListEntryInSMD();
          this.SetMsgInfo("All the configuration done."); 

          const iarUpdate = await this._sp.web.lists.getById(this.props.ProvisioningListID).items.getById(this.state.itemID).update({
            Status: 'Completed'
          });     
          
        } else {
          console.log(this.state.ListName + " List already existed!");
          this.SetMsgInfo(this.state.ListName + " List already existed!");
          //Remove Task CT
          //await this.RemoveTaskContentType()         

          //Add New Columns in List
          //await this.AddColumns();
          //await this.AddColumnsInBatch();

          //Add Columns in Default View        
          //await this.AddColumnsInDefaultView();

          //Remove task Content Type          
          //await this.RemoveColumnInCT();
        
        }

        this.setState({isStart : false, ListName:"", itemID : 0});
      }
    }   
    
  } 

  public async SetMsgInfo(msg:string){
    let msgInfo = this.state.msgInfo;
    msgInfo += msg;
    this.setState({msgInfo});
    console.log(msgInfo);
  }


  private async AddColumns() {
    const self_list = await this._sp.web.lists.getByTitle(this.state.ListName)();
    
    const smd_list = await this._sp.web.lists.getByTitle("SmartMetadata")();
    const mt_list = await this._sp.web.lists.getByTitle("Master Tasks")();    
    const tt_list = await this._sp.web.lists.getByTitle("Task Types")();
    const si_list = await this._sp.web.lists.getByTitle("SmartInformation")();
    

   

    await this._sp.web.lists.getByTitle(this.state.ListName).fields.addUser("Approver", { SelectionMode: FieldUserSelectionMode.PeopleOnly });    
    await this._sp.web.lists.getByTitle(this.state.ListName).fields.addMultilineText("Comments", { NumberOfLines: 6, RichText: false, AppendOnly: false, });
    await this._sp.web.lists.getByTitle(this.state.ListName).fields.addNumber("EstimatedTime");
    await this._sp.web.lists.getByTitle(this.state.ListName).fields.addText("Re_ocurringValue");
    
    const fieldSchema = `<Field ID="{03b09ff4-d99d-45ed-841d-3855f77a2483}" Type='Boolean' Name='waitForResponse' StaticName='waitForResponse' DisplayName='waitForResponse'><Default>0</Default></Field>`
    await this._sp.web.lists.getByTitle(this.state.ListName).fields.createFieldAsXml(fieldSchema);
   
    // Lookup Field
    await this._sp.web.lists.getByTitle(this.state.ListName).fields.addLookup("ClientCategory",{ LookupListId: smd_list.Id, LookupFieldName: "Title" });
    await this._sp.web.lists.getByTitle(this.state.ListName).fields.addLookup("SharewebTaskType",{ LookupListId: tt_list.Id, LookupFieldName: "Title" });
    
    //Multi Lookup Field
    const SharewebCategories_field = await this._sp.web.lists.getByTitle(this.state.ListName).fields.addLookup("SharewebCategories",{ LookupListId: smd_list.Id, LookupFieldName: "Title" });
    await SharewebCategories_field.field.update({ AllowMultipleValues: true }, "SP.FieldLookup");

    const SharewebComponent_field = await this._sp.web.lists.getByTitle(this.state.ListName).fields.addLookup("SharewebComponent",{ LookupListId: smd_list.Id, LookupFieldName: "Title" });
    await SharewebComponent_field.field.update({ AllowMultipleValues: true }, "SP.FieldLookup");

    const Component_field = await this._sp.web.lists.getByTitle(this.state.ListName).fields.addLookup("Component",{ LookupListId: mt_list.Id, LookupFieldName: "Task Name"});
    await Component_field.field.update({ AllowMultipleValues: true }, "SP.FieldLookup");

    const Event_field = await this._sp.web.lists.getByTitle(this.state.ListName).fields.addLookup("Events",{ LookupListId: mt_list.Id, LookupFieldName: "Task Name"});
    await Event_field.field.update({ AllowMultipleValues: true }, "SP.FieldLookup");
    
    const RelevantPortfolio_field = await this._sp.web.lists.getByTitle(this.state.ListName).fields.addLookup("RelevantPortfolio",{ LookupListId: mt_list.Id, LookupFieldName: "Task Name"});
    await RelevantPortfolio_field.field.update({ AllowMultipleValues: true }, "SP.FieldLookup");

    const Services_field = await this._sp.web.lists.getByTitle(this.state.ListName).fields.addLookup("Services",{ LookupListId: mt_list.Id, LookupFieldName: "Task Name"});
    await Services_field.field.update({ AllowMultipleValues: true }, "SP.FieldLookup");

    const LinkServiceTask_field = await this._sp.web.lists.getByTitle(this.state.ListName).fields.addLookup("LinkServiceTask",{ LookupListId: self_list.Id, LookupFieldName: "Task Name"});
    await LinkServiceTask_field.field.update({ AllowMultipleValues: true }, "SP.FieldLookup");

    const ParentTask_field = await this._sp.web.lists.getByTitle(this.state.ListName).fields.addLookup("ParentTask",{ LookupListId: self_list.Id, LookupFieldName: "Task Name"});
    await ParentTask_field.field.update({ AllowMultipleValues: true }, "SP.FieldLookup");
    
    const RelevantTasks_field = await this._sp.web.lists.getByTitle(this.state.ListName).fields.addLookup("RelevantTasks",{ LookupListId: self_list.Id, LookupFieldName: "Task Name"});
    await RelevantTasks_field.field.update({ AllowMultipleValues: true }, "SP.FieldLookup");


    // create a lookup field and its dependent field
    const Project_field = await this._sp.web.lists.getByTitle(this.state.ListName).fields.addLookup("Project", { LookupListId: mt_list.Id, LookupFieldName: "Task Name" });
    await this._sp.web.lists.getByTitle(this.state.ListName).fields.addDependentLookupField("Project:ID", Project_field.data.Id as string, "ID");

    const SmartInformation_field = await this._sp.web.lists.getByTitle(this.state.ListName).fields.addLookup("SmartInformation", { LookupListId: si_list.Id, LookupFieldName: "Title" });
    await SmartInformation_field.field.update({ AllowMultipleValues: true }, "SP.FieldLookup");

    await this._sp.web.lists.getByTitle(this.state.ListName).fields.addDependentLookupField("SmartInformation:ID", SmartInformation_field.data.Id as string, "ID");
    await this._sp.web.lists.getByTitle(this.state.ListName).fields.addDependentLookupField("SmartInformation:Title", SmartInformation_field.data.Id as string, "Title");

  }

  private async AddColumnsInDefaultView() {
    const viewResult = await this._sp.web.lists.getByTitle(this.state.ListName).views.getByTitle("All Tasks").update({
      RowLimit: 30,
    });

    await Promise.all([
      viewResult.view.fields.add("Comments"),
      viewResult.view.fields.add("EstimatedTime"),
      viewResult.view.fields.add("Events"),
      viewResult.view.fields.add("Item_x002d_Image"),
      viewResult.view.fields.add("LinkServiceTask"),
      viewResult.view.fields.add("ParentTask"),
      viewResult.view.fields.add("RelevantPortfolio"),
      viewResult.view.fields.add("RelevantTasks"),
      viewResult.view.fields.add("Services"),
      viewResult.view.fields.add("SharewebCategories"),
      viewResult.view.fields.add("SharewebComponent"),
      viewResult.view.fields.add("SmartInformation"),
      viewResult.view.fields.add("Component"),
      viewResult.view.fields.add("waitForResponse")      
    ]);
  }

  private async RemoveTaskContentType() {
    const cts = await this._sp.web.lists.getByTitle(this.state.ListName).contentTypes.select('StringId,Name')();
    console.log(cts);

    //Remove task Content Type
    cts.forEach(async (ct) => {
      if (ct.Name === 'Task') {
        await this._sp.web.lists.getByTitle(this.state.ListName).contentTypes.getById(ct.StringId).delete();
      }
    });
  }

  private async AddColumnsInBatch() {
    const self_list = await this._sp.web.lists.getByTitle(this.state.ListName)();
    const smd_list = this.props.SmartMetadataListID;
    const mt_list = this.props.MasterTaskListID;
    const tt_list = this.props.TaskTypesListID;
    const si_list = this.props.SmartInfoListID;

    // Create Schema for fields
    const Approver_field = `<Field Type="UserMulti" DisplayName="Approver" List="UserInfo" ShowField="ImnName" UserSelectionMode="PeopleOnly" UserSelectionScope="0" Mult="TRUE" Sortable="FALSE" ID="{fefcf3b5-74ed-4db9-9b3e-aa93a0ac6a02}" StaticName="Approver" Name="Approver"/>`;
    const Comments_field = `<Field Type="Note" DisplayName="Comments" NumLines="6" RichText="FALSE" Sortable="FALSE" ID="{1a925e15-b8d2-42dc-a5ca-6eefcf63eb3c}" StaticName="Comments" Name="Comments"/>`;
    const EstimatedTime_field = `<Field Type="Number" DisplayName="EstimatedTime" ID="{9f90cc20-f003-4c10-9338-21133c08bf77}" StaticName="EstimatedTime" Name="EstimatedTime" />`;
    const Item_x002d_Image_field = `<Field Type="URL" DisplayName="Item_x002d_Image" Format="Hyperlink" ID="{d6fa6ab2-9da9-48ce-98ef-6a8bac36cdf2}" StaticName="Item_x002d_Image" Name="Item_x002d_Image" />`;
    const Re_ocurringValue_field = `<Field Type="Text" DisplayName="Re_ocurringValue" MaxLength="255" ID="{13488955-9de2-41fe-8210-7d9b6c98fb7d}" StaticName="Re_ocurringValue" Name="Re_ocurringValue" />`;
           
    const waitForResponse_field = `<Field ID="{03b09ff4-d99d-45ed-841d-3855f77a2483}" Type='Boolean' Name='waitForResponse' StaticName='waitForResponse' DisplayName='waitForResponse'><Default>0</Default></Field>`;    
    const Events_field = `<Field Type="LookupMulti" DisplayName="Events" List="`+ mt_list +`" ShowField="Title" Mult="TRUE" Sortable="FALSE" ID="{cce9d969-47b9-4098-ba3f-b664b81b6757}" StaticName="Events" Name="Events" />`;
		const LinkServiceTask_field = `<Field Type="LookupMulti" DisplayName="LinkServiceTask" List="`+self_list.Id+`" ShowField="Title" Mult="TRUE" Sortable="FALSE" ID="{a5840609-3844-49a6-9a80-5f6088cc1c30}" StaticName="LinkServiceTask" Name="LinkServiceTask" />`;
		const ParentTask_field = `<Field Type="Lookup" DisplayName="ParentTask" List="`+self_list.Id +`" ShowField="Title" ID="{273f501d-1404-4ba5-968f-2d9b3146aa15}" StaticName="ParentTask" Name="ParentTask"/>`;
		const RelevantPortfolio_field = `<Field Type="LookupMulti" DisplayName="RelevantPortfolio" List="`+ mt_list +`" ShowField="Title" Mult="TRUE" Sortable="FALSE" ID="{77ea234f-3f58-4266-8335-1c8ccf28f95a}" StaticName="RelevantPortfolio" Name="RelevantPortfolio" />`;
		const RelevantTasks_field = `<Field Type="LookupMulti" DisplayName="RelevantTasks" List="`+self_list.Id +`" ShowField="Title" Mult="TRUE" Sortable="FALSE" ID="{78248a1f-f5b9-4005-b1df-573ccc5967c4}" StaticName="RelevantTasks" Name="RelevantTasks" />`;
		const Services_field = `<Field Type="LookupMulti" DisplayName="Services" List="`+ mt_list+`" ShowField="Title" Mult="TRUE" Sortable="FALSE" ID="{1114de60-1ed6-466c-a6c9-d759f879294f}" StaticName="Services" Name="Services" />`;
		const SharewebCategories_field = `<Field Type="LookupMulti" DisplayName="SharewebCategories" List="`+smd_list +`" ShowField="Title" Mult="TRUE" Sortable="FALSE" ID="{213c1919-a68c-49e6-b0a3-aebb7b9f530a}" StaticName="SharewebCategories" Name="SharewebCategories"  />`;
		const SharewebComponent_field = `<Field Type="LookupMulti" DisplayName="SharewebComponent" List="`+smd_list+`" ShowField="Title" Mult="TRUE" Sortable="FALSE" ID="{3b7b6fde-8e78-4c42-a7d6-4b22cd69de98}" StaticName="SharewebComponent" Name="SharewebComponent" />`;
		const SmartInformation_field = `<Field Type="LookupMulti" DisplayName="SmartInformation" List="`+si_list+`" ShowField="Title" Mult="TRUE" Sortable="FALSE" ID="{c19f5dad-068e-44fd-abd4-ad0824774ed0}" StaticName="SmartInformation" Name="SmartInformation" />`;
		const Component_field = `<Field Type="LookupMulti" DisplayName="Component" List="`+ mt_list +`" ShowField="Title" Mult="TRUE" Sortable="FALSE" ID="{fffed37d-2826-4761-8c79-0907f5cc7fa3}" StaticName="Component" Name="Component" />`;
		const ClientCategory_field = `<Field Type="LookupMulti" DisplayName="ClientCategory" List="`+smd_list+`" ShowField="Title" Mult="TRUE" Sortable="FALSE" ID="{32fb279f-82b1-4460-a919-a5c38b9e50a2}" StaticName="ClientCategory" Name="ClientCategory"  />`;
		const Project_field = `<Field Type="Lookup" DisplayName="Project" List="`+ mt_list +`" ShowField="Title" ID="{d5e4a8b8-b1f9-42bb-b343-9c962b959221}" StaticName="Project" Name="Project" />`;
		const SharewebTaskType_field = `<Field Type="Lookup" DisplayName="SharewebTaskType" List="`+tt_list +`" ShowField="Title" ID="{b05cae50-a64b-4627-96da-68aaca56fe32}" StaticName="SharewebTaskType" Name="SharewebTaskType"/>`;
		const SI_Title_field = `<Field Type="LookupMulti" DisplayName="SmartInformation:Title" List="`+si_list +`" ShowField="Title" FieldRef="c19f5dad-068e-44fd-abd4-ad0824774ed0" ReadOnly="TRUE" Mult="TRUE" Sortable="FALSE" ID="{a7eef8ec-0503-4a18-9932-38027c0df676}" StaticName="SmartInformation_x003a_Title" Name="SmartInformation_x003a_Title" />`;
		const SI_ID_field = `<Field Type="LookupMulti" DisplayName="SmartInformation:ID" List="`+si_list +`" ShowField="ID" FieldRef="c19f5dad-068e-44fd-abd4-ad0824774ed0" ReadOnly="TRUE" Mult="TRUE" Sortable="FALSE" ID="{29aa3483-7b94-4bf1-a724-74b2471f2798}" StaticName="SmartInformation_x003a_ID" Name="SmartInformation_x003a_ID" />`;
    const Project_ID_field = `<Field Type="Lookup" DisplayName="Project:ID" List="`+ mt_list+`" ShowField="ID" FieldRef="d5e4a8b8-b1f9-42bb-b343-9c962b959221" ReadOnly="TRUE" ID="{5d751254-755a-428a-a564-45833a75b35e}" StaticName="Project_x003a_ID" Name="Project_x003a_ID" />`;
    
    const list = this._sp.web.lists.getByTitle(this.state.ListName);
    const [batchedListBehavior, execute] = createBatch(list);
    // this list is now batching all its requests
    list.using(batchedListBehavior);
    // these will all occur within a single batch    
    list.fields.createFieldAsXml(Approver_field); 
    list.fields.createFieldAsXml(Comments_field); 
    list.fields.createFieldAsXml(EstimatedTime_field); 
    list.fields.createFieldAsXml(Item_x002d_Image_field); 
    list.fields.createFieldAsXml(Re_ocurringValue_field); 
    list.fields.createFieldAsXml(waitForResponse_field); 
    list.fields.createFieldAsXml(Events_field);
    list.fields.createFieldAsXml(LinkServiceTask_field);
    list.fields.createFieldAsXml(ParentTask_field);
    list.fields.createFieldAsXml(RelevantPortfolio_field);
    list.fields.createFieldAsXml(RelevantTasks_field);
    list.fields.createFieldAsXml(Services_field);
    list.fields.createFieldAsXml(SharewebCategories_field);
    list.fields.createFieldAsXml(SharewebComponent_field);
    list.fields.createFieldAsXml(SmartInformation_field); 
    list.fields.createFieldAsXml(Component_field);
    list.fields.createFieldAsXml(ClientCategory_field);
    list.fields.createFieldAsXml(Project_field);
    list.fields.createFieldAsXml(SharewebTaskType_field);
    list.fields.createFieldAsXml(SI_Title_field);
    list.fields.createFieldAsXml(SI_ID_field);
    list.fields.createFieldAsXml(Project_ID_field);    
    await execute();
    
  }

  private async AddListEntryInSMD(){
    const self_list = await this._sp.web.lists.getByTitle(this.state.ListName)();
    const smd_list = this.props.SmartMetadataListID;    
    const taskTimeSheet_list = this.props.TaskTimeSheetListID;
    let obj = {
          Title : this.state.ListName,
          listId : self_list.Id,
          siteName : this.state.ListName,
          siteUrl : this.props.pageContext.web.absoluteUrl,
          TaxType :  "Sites",
          DomainUrl : this.props.pageContext.web.absoluteUrl,
          MetadataName : self_list.ListItemEntityTypeFullName,
          TimesheetListName : "TaskTimesheet",
          TimesheetListId : taskTimeSheet_list,
          TimesheetListmetadata : "SP.Data.TaskTimesheetListItem",
          ImageUrl : "https://hhhhteams.sharepoint.com/sites/HHHH/KSL/SiteCollectionImages/ICONS/Foundation/SH_icon.png"                        
      };    
      
      const iar = await this._sp.web.lists.getById(smd_list).items.add({
        Title: this.state.ListName,
        Description : "test",
        SortOrder : "4",
        SmartFilters : ["Dashboard, Portfolio, Advanced Search"],
        TaxType : "Sites",
        IsVisible : true,
        Selectable : true,
        listId : self_list.Id,
        siteName : this.state.ListName,
        siteUrl : {Description : this.props.pageContext.web.absoluteUrl,Url : this.props.pageContext.web.absoluteUrl},
        Configurations : "["+JSON.stringify(obj)+"]"
      });

     //console.log(JSON.stringify(obj));
  }

  private async RemoveColumnInCT() {
    const cts1 = await this._sp.web.lists.getByTitle(this.state.ListName).contentTypes.select('StringId,Name')();
    console.log(cts1);
    cts1.forEach(async (ct) => {
      if (ct.Name === 'Teams Tasks') {
        const d = await this._sp.web.lists.getByTitle(this.state.ListName).contentTypes.getById(ct.StringId).fields();
        console.log(d);
        d.forEach(async (ct) => {
          if (ct.Title === 'Approver') {
            const result = await this._sp.web.fields.getById(ct.Id).delete();
            //const a =   await this._sp.web.lists.getByTitle(this.state.ListName).contentTypes.getById(ct.StringId).fields.getById("Temp Field").delete();
          }
        });

      }
    });
  }

  public render(): React.ReactElement<IListProvisioningProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName
    } = this.props;

    return (
      <section className={`${styles.listProvisioning} ${hasTeamsContext ? styles.teams : ''}`}>
        <div className="row">
        <div className="d-flex p-2">
          <label className="col-sm-3 col-form-label">Enter the Task list name</label>
          <div className="col-sm-9">
            <input className="form-control" id="txtListName" value={this.state.ListName} 
            onChange={(e)=>{this.setState({ ListName : e.target.value})  }}/>
          </div>          
        </div>
      </div>  

      {!this.state.isStart && 
      <div className="row">
        <div className="d-flex p-0">
          <div className="bg-Fa p-2">
          <button type="submit" className="btn btn-primary" onClick={()=>this.SubmitClick()}>Submit</button>
          </div>          
        </div>
      </div>  
    }

      <div className="row" style={{display:'none'}}>
        <div className="d-flex p-0">
          <div className="bg-Fa p-2">
          <button type="submit" className="btn btn-primary" onClick={()=>this.batchSave()}>BatchSave</button>
          </div>          
        </div>
      </div> 

      {this.state.isStart && 
        <div className="row">
        <div id="SpfxProgressbar" style={{display:'flex', justifyContent:'center'}}>
            <img id="sharewebprogressbar-image" style={{width:'32px',height:'32px'}} src={require('../assets/loading_apple.gif')} alt="Loading..." />
        </div>
      </div>
      }     

      <div className="row">
        <div dangerouslySetInnerHTML={{ __html: this.state.msgInfo }} />
      </div>


      
      </section>
    );
  }
}
