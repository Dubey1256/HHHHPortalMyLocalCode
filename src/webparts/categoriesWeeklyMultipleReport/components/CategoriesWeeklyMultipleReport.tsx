import * as React from 'react';
import styles from './CategoriesWeeklyMultipleReport.module.scss';
import { ICategoriesWeeklyMultipleReportProps } from './ICategoriesWeeklyMultipleReportProps';
import { escape } from '@microsoft/sp-lodash-subset';
import '../../cssFolder/foundation.scss';
import '../../cssFolder/foundationmin.scss';
import './SPfoudationSupport.scss';
import { Web } from "sp-pnp-js";
import CheckboxTree from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import { SPComponentLoader } from '@microsoft/sp-loader';

export interface ICategoriesWeeklyMultipleReportState {  
  Result : any;  
  taskUsers : any;
  checked: any,
  expanded: any,
  filterItems : any
  ImageSelectedUsers : any
}

export default class CategoriesWeeklyMultipleReport extends React.Component<ICategoriesWeeklyMultipleReportProps, ICategoriesWeeklyMultipleReportState> {
  public constructor(props:ICategoriesWeeklyMultipleReportProps,state:ICategoriesWeeklyMultipleReportState){
    super(props);    

    this.state ={
      Result:{}, 
      taskUsers : [],
      checked: [],
      expanded: [],   
      filterItems : [],
      ImageSelectedUsers : []  
    }    
    //this.GetResult();   
    this.GetTaskUsers();
    this.LoadAllMetaDataFilter();
  }

  private GetResult(){

  }

  private async GetTaskUsers(){
    let web = new Web(this.props.Context.pageContext.web.absoluteUrl);
    let taskUsers = []; 
    let results = [];   
    results = await web.lists
    .getByTitle('Task Users')
    .items
    .select('Id','IsShowReportPage','UserGroupId','Suffix','SmartTime','Title','Email','SortOrder','Role','Company','ParentID1','TaskStatusNotification','Status','Item_x0020_Cover','AssingedToUserId','isDeleted','AssingedToUser/Title','AssingedToUser/Id','AssingedToUser/EMail','ItemType')
    //.filter("ItemType eq 'User'")
    .expand('AssingedToUser')
    .orderBy('SortOrder', true)
    .orderBy("Title", true)
    .get();    
    
    for (let index = 0; index < results.length; index++) {
      let element = results[index];
      if (element.UserGroupId == undefined) {
        this.getChilds(element, results);
        taskUsers.push(element);    
      }
    }
    console.log(taskUsers);
    this.setState({
      taskUsers : taskUsers
    })
  }

  private getChilds(item:any, items:any){
    item.childs = [];
    for (let index = 0; index < items.length; index++) {
      let childItem = items[index];
      if (childItem.UserGroupId != undefined && parseInt(childItem.UserGroupId) == item.ID) {
        childItem.IsSelected = false
        //if (this.props.Context.pageContext.user. == childItem.AssingedToUserId)
            //childItem.IsSelected = true
        item.childs.push(childItem);
        this.getChilds(childItem, items);
    }      
    }  
            
  }



  private async LoadAllMetaDataFilter(){
    let web = new Web(this.props.Context.pageContext.web.absoluteUrl);
    let AllMetaData = []; 
    let results = [];   
    results = await web.lists
    .getByTitle('SmartMetadata')
    .items
    .select("Id","Title","IsVisible","ParentID","SmartSuggestions","TaxType","Description1","Item_x005F_x0020_Cover","listId","siteName","siteUrl","SortOrder","SmartFilters","Selectable","Parent/Id","Parent/Title")
    .filter("TaxType eq 'Client Category'")
    .expand('Parent')
    .orderBy('SortOrder', true)
    .orderBy("Title", true)
    .get(); 

    this.loadSmartFilters(results);
  }

  private loadSmartFilters(items:any){
    let filterGroups = [];
    let filterItems = [];

    for (let index = 0; index < items.length; index++) {
      let filterItem = items[index];
      if (filterItem.SmartFilters != undefined && filterItem.SmartFilters.indexOf('Dashboard') > -1) {
        let item:any = {};
        item.ID =  filterItem.Id;        
        item.Title = filterItem.Title;
        item.value = filterItem.Id;
        item.label = filterItem.Title;
        item.Group = filterItem.TaxType;
        item.TaxType = filterItem.TaxType;
        //item.Selected = true;
        if (filterItem.ParentID == 0) {
            if (!this.IsExistsData(filterItems, item))
                filterItems.push(item);
            this.getChildsOfFilter(item, items);
            if (item.children != undefined && item.children.length > 0) {
              for (let j = 0; j < item.children.length; j++) {
                let obj = item.children[j];
                if (obj.Title == 'Other')
                    obj.ParentTitle = item.Title;                
              }               
            }            
            if (filterGroups.length == 0 || filterGroups.indexOf(filterItem.TaxType) == -1) {
                filterGroups.push(filterItem.TaxType);
            }
        }
      }      
    }

    console.log(filterGroups);
    console.log(filterItems);
    this.setState({
      filterItems : filterItems
    })
  }

  private IsExistsData (array:any, Id:any) {
    var isExists = false;
    for (let index = 0; index < array.length; index++) {
      let item = array[index];
      if (item.Id == Id) {
        isExists = true;
        return false;
      }      
    }    
    return isExists;
  }

  private getChildsOfFilter(item:any, items:any) {
    item.children = [];
    for (let index = 0; index < items.length; index++) {
      let childItem = items[index];
        childItem.value = items[index].Id;
        childItem.label = items[index].Title;
      if (childItem.ParentID != undefined && parseInt(childItem.ParentID) == item.ID) {
        item.children.push(childItem);
        this.getChildsOfFilter(childItem, items);
      }
    }
  }

  private SelectAllGroupMember (ev:any) {
    //$scope.SelectGroupName = ''
    let select = ev.currentTarget.checked;
    let ImageSelectedUsers = this.state.ImageSelectedUsers;
    if (select == true) {
        this.state.taskUsers.forEach((item:any) => {
            if (item.childs != undefined && item.childs.length > 0) {
                item.SelectedGroup = select;
                item.childs.forEach((child:any) => {
                    child.IsSelected = true;
                    try {
                      document.getElementById('UserImg' + child.Id).classList.add('seclected-Image');
                      if (child.Id != undefined && !this.isItemExists(ImageSelectedUsers, child.Id))
                        ImageSelectedUsers.push(child)
                    } catch (error) {
                      
                    }
                    
                })
            }
        })
    }
    else if (select == false) {
        this.state.taskUsers.forEach((item:any) => {
            if (item.childs != undefined && item.childs.length > 0) {
                item.SelectedGroup = select;
                item.childs.forEach((child:any) => {
                    child.IsSelected = false;
                    try {
                      document.getElementById('UserImg' + child.Id).classList.remove('seclected-Image');                   
                      for (let k = 0; k < ImageSelectedUsers.length; k++) {
                      let el = ImageSelectedUsers[k];
                      if (el.Id == child.Id)
                            ImageSelectedUsers.splice(k, 1);                
                    }
                      
                    } catch (error) {
                      
                    }
                    
                })
            }
        })
    }

    this.setState({
      ImageSelectedUsers
    },()=>console.log(this.state.ImageSelectedUsers));   
    
}

  private SelectUserImage(ev:any,item:any,Parent:any){
    console.log(`The option ${ev.currentTarget.title}.`);
    console.log(item);
    console.log(Parent);
    let ImageSelectedUsers = this.state.ImageSelectedUsers;
    if (ev.currentTarget.className.indexOf('seclected-Image')>-1){ 
      ev.currentTarget.classList.remove('seclected-Image');
      item.IsSelected = false;
      //uncheck the group checkbox if any one child is unchecked
      if (ev.currentTarget.closest('.ng-binding').children[0].checked){
        ev.currentTarget.closest('.ng-binding').children[0].checked = false
      }
      //remove element from array
      for (let index = 0; index < ImageSelectedUsers.length; index++) {
        let sel = ImageSelectedUsers[index];
        if (sel.Id != undefined && item.Id != undefined && sel.Id == item.Id) {          
          item.IsSelected = false;
          ImageSelectedUsers.splice(index, true);
          break;
        }        
      }
    }      
    else{
      ev.currentTarget.classList.add('seclected-Image'); //add element
      item.IsSelected = true;
      ImageSelectedUsers.push(item);      
    }

    //need to check uncheck the group       
    this.state.taskUsers.forEach((user:any) => {
      if (Parent.Id == user.Id && user.childs != undefined && user.childs.length > 0) {
        let IsNeedToCheckParent = true;
        let IsNeedToUncheckParent = true;          
          user.childs.forEach((child:any) => {
              if (child.IsSelected == true) {
                IsNeedToCheckParent = true
              }
              if (child.IsSelected == false) {
                  IsNeedToCheckParent = false
              }
          })
          if (IsNeedToUncheckParent == true)
            ev.currentTarget.closest('.ng-binding').children[0].checked  = false;
          if (IsNeedToCheckParent == true)
            ev.currentTarget.closest('.ng-binding').children[0].checked  = true;
      }
    })  

    this.setState({
      ImageSelectedUsers
    },()=>console.log(this.state.ImageSelectedUsers));   
  }

  private SelectedGroup(ev:any, user:any){
    console.log(ev.currentTarget.checked)
    let ImageSelectedUsers = this.state.ImageSelectedUsers;
    let selected = ev.currentTarget.checked;
    if(selected){
      for (let index = 0; index < this.state.taskUsers.length; index++) {
        let item =  this.state.taskUsers[index];
        if (item.Title == user.Title && item.childs != undefined && item.childs.length > 0) {
          item.SelectedGroup = selected;
          item.childs.forEach((child:any) => {
              child.IsSelected = true;
              document.getElementById('UserImg' + child.Id).classList.add('seclected-Image');
              if (child.Id != undefined && !this.isItemExists(this.state.ImageSelectedUsers, child.Id))
                  ImageSelectedUsers.push(child)
          })
        }        
      }
    }else{
      for (let index = 0; index < this.state.taskUsers.length; index++) {
        let item = this.state.taskUsers[index];
        if (item.Title == user.Title && item.childs != undefined && item.childs.length > 0) {
          item.SelectedGroup = selected;          
          item.childs.forEach((child:any) => {
              child.IsSelected = false;
              document.getElementById('UserImg' + child.Id).classList.remove('seclected-Image');
              for (let k = 0; k < ImageSelectedUsers.length; k++) {
                let el = ImageSelectedUsers[k];
                if (el.Id == child.Id)
                      ImageSelectedUsers.splice(k, 1);                
              }
          })
        }        
      }     
    }

    this.setState({
      ImageSelectedUsers : ImageSelectedUsers
    }, ()=> console.log(this.state.ImageSelectedUsers))

  }

  private isItemExists(array:any, items:any) {
    var isExists = false;
    for (let index = 0; index < array.length; index++) {
      let item = array[index];
      if (item.TaskItemID == items.TaskItemID) {
        if ((item.Effort != undefined && items.Effort != undefined) && (item.Effort == items.Effort)) {
            isExists = true;
            return false;
        }
      }      
    }   
    return isExists;
}

  public render(): React.ReactElement<ICategoriesWeeklyMultipleReportProps> {

    SPComponentLoader.loadCss("https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css");

    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName
    } = this.props;
    console.log('Checked === ', this.state.checked);
    return (
      <div>
        <div className="col-sm-12 padL-0">
          <h1 className="blue-clr">Timesheet</h1>
        </div>

        <div className="col-sm-12 togglebox  tab-content bdrbox">
          <div className="col-sm-12 pull-left mt-10 report-taskuser">
            <span className="pull-right">
              <input type="checkbox" className="mt-10 mr-5 ng-pristine ng-untouched ng-valid ng-empty" onClick={(e)=>this.SelectAllGroupMember(e)} />
              <label>Select All </label>
            </span>
            <span className="plus-icon hreflink pl-10 pull-left ng-scope" >
                <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/24/list-icon.png" />
            </span>
            <a className="hreflink pull-left mr-5">Task User : </a>
            <span className="ng-binding">                
            </span>           
            <span className="ng-binding ng-hide">               
            </span>
          </div>

          <div className="col-sm-12 mb-10 padL-0 BdrBoxBlue" style={{display:"inline"}}>
            <div className="taskTeamBox pl-10">
                <div className="taskTeamBox mt-10">
                  {this.state.taskUsers != null && this.state.taskUsers.length > 0 && this.state.taskUsers.map((user:any,i:number)=> {
                    return <div className="top-assign ng-scope" ng-repeat="user in taskUsers">
                            <fieldset className="team ng-scope">
                            <legend className="ng-binding">
                                <input className="no-padding mr-4 mb-5 ng-pristine ng-untouched ng-valid ng-empty" type="checkbox" ng-model="user.SelectedGroup" onClick={(e)=>this.SelectedGroup(e,user)}/>
                                {user.Title}
                                {user.childs.length > 0 && user.childs.map((item:any,i:number)=> {
                                  return <div className="marginR41 ng-scope">
                                          {item.Item_x0020_Cover!=undefined && item.AssingedToUser !=undefined &&
                                            <span className="ng-scope">                                              
                                            <img id={"UserImg" + item.Id} className="AssignUserPhoto mr-5" onClick={(e)=>this.SelectUserImage(e,item,user)} style={{borderRadius:"0px", marginRight:'5px'}} ui-draggable="true" on-drop-success="dropSuccessHandler($event, $index, user.childs)" 
                                              title={item.AssingedToUser.Title}  
                                              src={item.Item_x0020_Cover.Url}/>
                                          </span>
                                          }
                                          
                                        </div>
                                })}
                            </legend>
                    </fieldset>
                    </div>
                  })
                  
                  }
                    
                  
                </div>
              </div>
          </div>

          <div className="col-sm-12 padL-0 PadR0 mt0 mb-20">
            <div className="col-sm-1 padL-0">
               <label ng-required="true" className="full_width ng-binding" ng-bind-html="GetColumnDetails('StartDate') | trustedHTML">Start Date</label>
               <input type="text" ng-disabled="isStartDateEnabled" id="StartDateDatePicker" placeholder="DD/MM/YYYY" ng-change="Itemchange()" className="form-control ng-pristine ng-valid ng-touched ng-not-empty" ng-model="StartDatePicker"/>
            </div>
            <div className="col-sm-1 padL-0">
               <label ng-required="true" className="full_width ng-binding" ng-bind-html="GetColumnDetails('EndDate') | trustedHTML" >End Date</label>
               <input type="text" ng-disabled="isStartDateEnabled" id="SpecificEndDateDatePicker" placeholder="DD/MM/YYYY" ng-change="Itemchange()" className="form-control ng-pristine ng-valid ng-touched ng-not-empty" ng-model="StartEndPicker"/>
            </div>
            <div className="col-sm-10">
               <div className="col-sm-12 text-right" style={{borderBottom: '1px solid #ccc;padding-bottom: 5px'}}>                 
               </div>
               <div className="col-sm-12 Weekly-TimeReportDays">
                  <span>
                  <input type="radio" name="dateSelection" id="selectedCustom" value="Custom" ng-checked="unSelectToday=='Custom'" ng-click="selectDate('Custom')" ng-model="unSelectCustom" className="ng-valid ng-not-empty ng-dirty ng-valid-parse ng-touched"/>
                  <label>Custom</label>
                  </span>
                  <span>
                  <input type="radio" name="dateSelection" id="selectedToday" value="Today" ng-click="selectDate('today')" ng-model="unSelectToday" className="ng-valid ng-not-empty ng-dirty ng-valid-parse ng-touched"/>
                  <label>Today</label>
                  </span>
                  <span>
                  <input type="radio" name="dateSelection" id="selectedYesterday" value="Yesterday" ng-click="selectDate('yesterday')" ng-model="unSelectYesterday" className="ng-valid ng-not-empty ng-dirty ng-valid-parse ng-touched"/>
                  <label> Yesterday </label>
                  </span>
                  <span>
                  <input type="radio" name="dateSelection" id="selectedAll" value="ThisWeek" ng-click="selectDate('ThisWeek')" ng-model="unThisWeek" className="ng-valid ng-not-empty ng-dirty ng-valid-parse ng-touched"/>
                  <label> This Week</label>
                  </span>
                  <span>
                  <input type="radio" name="dateSelection" id="selectedAll" value="LastWeek" ng-click="selectDate('LastWeek')" ng-model="unLastWeek" className="ng-valid ng-not-empty ng-dirty ng-valid-parse ng-touched"/>
                  <label> Last Week</label>
                  </span>
                  <span>
                  <input type="radio" name="dateSelection" id="selectedAll" value="EntrieMonth" ng-click="selectDate('EntrieMonth')" ng-model="unEntrieMonth" className="ng-valid ng-not-empty ng-dirty ng-valid-parse ng-touched"/>
                  <label>This Month</label>
                  </span>
                  <span>
                  <input type="radio" name="dateSelection" id="selectedAll" value="LastMonth" ng-click="selectDate('LastMonth')" ng-model="unLastMonth" className="ng-valid ng-not-empty ng-dirty ng-valid-parse ng-touched"/>
                  <label>Last Month</label>
                  </span>
                  <span>
                  <input type="radio" name="dateSelection" value="Last3Month" ng-click="selectDate('Last3Month')" ng-model="unLast3Month" className="ng-pristine ng-untouched ng-valid ng-not-empty"/>
                  <label>Last 3 Months</label>
                  </span>
                  <span>
                  <input type="radio" name="dateSelection" value="EntrieYear" ng-click="selectDate('EntrieYear')" ng-model="unEntrieYear" className="ng-pristine ng-untouched ng-valid ng-empty"/>
                  <label>This Year</label>
                  </span>
                  <span>
                  <input type="radio" name="dateSelection" value="LastYear" ng-click="selectDate('LastYear')" ng-model="unLastYear" className="ng-pristine ng-untouched ng-valid ng-empty"/>
                  <label>Last Year</label>
                  </span>
                  <span>
                  <input type="radio" name="dateSelection" value="AllTime" ng-click="selectDate('AllTime')" ng-model="unAllTime" className="ng-pristine ng-untouched ng-valid ng-empty"/>
                  <label>All Time</label>
                  </span>
                  <span>
                  <input type="radio" name="dateSelection" value="Presettime" ng-click="selectDate('Presettime')" ng-model="unAllTime" className="ng-pristine ng-untouched ng-valid ng-empty"/>
                  <label>Pre-set I</label>
                  <img className="hreflink wid11 mr-5" title="open" ng-click="OpenPresetDatePopup('Presettime')" src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_inline.png"/>
                  </span>
                  <span>
                  <input type="radio" id="Presettime1" name="dateSelection" value="Presettime1" ng-click="selectDate('Presettime1')" ng-model="unAllTime1" className="ng-pristine ng-untouched ng-valid ng-empty"/>
                  <label>Pre-set II</label>
                  <img className="hreflink wid11 mr-5" title="open" ng-click="OpenPresetDatePopup('Presettime1')" src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_inline.png"/>
                  </span>
               </div>
            </div>
            <div className="clearfix"></div>
          </div>

          <div id="showFilterBox" className="col-sm-12 tab-content mb-10 bdrbox pad10">
            <div className="togglebox">
              <span>
                <label className="toggler full_width" ng-click="filtershowHide()">
                  <span className="pull-left">
                      <img className="hreflink wid22" title="Filter" style={{width:'22px'}} src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/Filter-12-WF.png"/>
                      SmartSearch – Filters
                  </span>

                  <span className="ml20">
                  </span>

                  <span className="pull-right">
                    <span className="hreflink ng-scope" ng-if="!smartfilter2.expanded">
                      <img className="hreflink wid10" style={{width:'10px'}} src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/sub_icon.png"/>
                    </span>
                  </span>
                </label>

                <div className="togglecontent" style={{display:"block"}}>
                  <div className="container p0 mt-10 smartSearch-Filter-Section">
                  <CheckboxTree
                      nodes={this.state.filterItems}
                      checked={this.state.checked}
                      expanded={this.state.expanded}
                      onCheck={checked => this.setState({ checked })}
                      onExpand={expanded => this.setState({ expanded })}
                      nativeCheckboxes={true}
                      showNodeIcon={false}
                      
                  />
                  </div>
                </div>

              </span>
            </div>
          </div>
        
        
        </div>

      </div>
    );
  }
}
