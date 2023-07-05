import React from 'react';
import { Web } from "sp-pnp-js";
import CheckboxTree from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import { SPComponentLoader } from '@microsoft/sp-loader';

export interface ISmartSearchFilterProps {
    parentCallback:(dt:any)=>void;
}
  
export interface ISmartSearchFilterState {  
    taskUsers : any;
    smartmetaDetails : any;
    filterGroups : any;
    filterInfo : string;
    checked: any;
    expanded: any;
    checkedObj: any;
}

export class SmartSearchFilterCard extends React.Component<ISmartSearchFilterProps, ISmartSearchFilterState> {
    constructor(props:ISmartSearchFilterProps){
        super(props);
        this.state ={
            taskUsers : [],
            smartmetaDetails : [],
            filterGroups : [],
            checked: [],
            checkedObj : [],
            expanded: [],
            filterInfo : ''
        }
        this.loadData();
        
    }

    private async loadData(){
       await this.getTaskUsers();
       await this.GetSmartmetadata();
       this.GetfilterGroups()

    }
    private filterGroups : any = [];
    GetfilterGroups = () => {
        this.filterGroups = [];
        this.filterGroups.push({
            Title : 'Portfolio',
            values : [],
            checked : [],
            checkedObj : [],
            expanded : []
        })

        this.filterGroups.push({
            Title : 'Sites',
            values : [],
            checked : [],
            checkedObj : [],
            expanded : []
        })

        this.filterGroups.push({
            Title : 'Type',
            values : [],
            checked : [],
            checkedObj : [],
            expanded : []
        })
        this.filterGroups.push({
            Title : 'TeamMember',
            values : [],
            checked : [],
            checkedObj : [],
            expanded : []
        })
        this.filterGroups.push({
            Title : 'Priority',
            values : [],
            checked : [],
            checkedObj : [],
            expanded : []
        })
        
  
        let smartmetaDetails = this.state.smartmetaDetails;
        let SitesData: any = [];
        let PriorityData:any = [];
        let self = this;
        smartmetaDetails.forEach((element:any) => {
            element.label = element.Title;
            element.value = element.Id;
            if (element.TaxType == 'Task Types'){
                self.filterGroups[0].values.push(element);
                self.filterGroups[0].checked.push(element.Id)
            }
            if (element.TaxType == 'Sites' || element.TaxType == 'Sites Old'){
                SitesData.push(element);
            }
            if (element.TaxType == 'Type'){
                self.filterGroups[2].values.push(element);
                self.filterGroups[2].checked.push(element.Id)
            }
            if (element.TaxType == "Priority"){
                PriorityData.push(element);
                //self.filterGroups[4].values.push(element);
            }
        });

        
        console.log('Sites data');
        console.log(SitesData);
        SitesData.forEach((element :any)=>{
            if (element.Title != 'Master Tasks' &&  (element.ParentID == 0 || (element.Parent != undefined && element.Parent.Id == undefined))) {
                element.value = element.Id;
                element.label = element.Title;
                self.getChildsBasedOn(element, SitesData);
                self.filterGroups[1].values.push(element);
                if (element.Title != 'Shareweb Old')
                    self.filterGroups[1].expanded.push(element.Id);
            }
        })

        PriorityData.forEach((element:any) =>{
            if (element.ParentID == 0 || (element.Parent != undefined && element.Parent.Id == undefined)) {
                element.value = element.Id;
                element.label = element.Title;
                self.getChildsBasedOn(element, PriorityData);
                self.filterGroups[4].values.push(element);                
            }
        })

        this.state.taskUsers.forEach((element:any) => {
            self.filterGroups[3].values.push(element);
        });

        self.filterGroups.forEach((element:any, index:any) => {
            element.checkedObj = self.GetCheckedObject(element.values, element.checked)
        });
       
        console.log(self.filterGroups);
        this.setState({
            filterGroups:self.filterGroups},()=>{
                this.getFilterInfo();
            }
        )
    }

    getTaskUsers = async () => {
        let web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/SP');
        let taskUsers = [];
        let results = await web.lists
            .getByTitle('Task Users')
            .items
            .select('Id','Role','Email', 'Suffix', 'Title', 'Item_x0020_Cover', 'AssingedToUser/Title', 'AssingedToUser/Id','UserGroupId')
            .filter('IsActive eq 1')
            .expand('AssingedToUser')
            .get();
        console.log('Task Users');
        console.log(results);

        for (let index = 0; index < results.length; index++) {
            let element = results[index];
            element.value = element.Id;
            element.label = element.Title;
            if (element.UserGroupId == undefined) {
              this.getChilds(element, results);
              taskUsers.push(element);    
            }
          }
        console.log(taskUsers);
        this.setState({taskUsers});
    }

    getChilds = (item:any, items:any)=>{
        item.children = [];
        for (let index = 0; index < items.length; index++) {
          let childItem = items[index];
          if (childItem.UserGroupId != undefined && parseInt(childItem.UserGroupId) == item.ID) {
            //childItem.IsSelected = false
            childItem.value = childItem.Id;
            childItem.label = childItem.Title;
            item.children.push(childItem);
            this.getChilds(childItem, items);
            }      
        }
        if (item.children.length == 0){
            delete item.children;
        }    
    }

    getChildsBasedOn = (item: any, items: any) => {
        item.children = [];
        for (let index = 0; index < items.length; index++) {
            let childItem = items[index];
            if (childItem.Parent != undefined && childItem.Parent.Id != undefined && parseInt(childItem.Parent.Id) == item.ID) {
                childItem.value = childItem.Id;
                childItem.label = childItem.Title;
                item.children.push(childItem);
                this.getChildsBasedOn(childItem, items);
            }
        }
        if (item.children.length == 0){
            delete item.children;
        }

        if (item.TaxType == 'Sites' || item.TaxType == 'Sites Old')
        {
            if (item.Title == "Shareweb Old" || item.Title == "DRR" || item.Title == "Small Projects" || item.Title == "Offshore Tasks" || item.Title == "Health") {
           
            }
            else {
                this.filterGroups[1].checked.push(item.Id);
            }
        }
        
    }

    GetSmartmetadata = async () => {
        let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
        let smartmetaDetails: any = [];
        smartmetaDetails = await web.lists
            .getById('01a34938-8c7e-4ea6-a003-cee649e8c67a')
            .items
            .select('Id', 'Title', 'IsVisible', 'ParentID', 'SmartSuggestions', 'TaxType', 'Description1', 'Item_x005F_x0020_Cover', 'listId', 'siteName', 'siteUrl', 'SortOrder', 'SmartFilters', 'Selectable', 'Parent/Id', 'Parent/Title')
            .top(4999)
            .expand('Parent')
            .get();
        
        console.log('smartmetaDetails'); 
        console.log(smartmetaDetails); 
        this.setState({smartmetaDetails});

    }

    getFilterInfo = ()=>{
        let filterGroups = this.state.filterGroups;
        let filterInfo = '';
        let tempFilterInfo:any = []
        filterGroups.forEach((element:any) => {
            if(element.checked.length > 0)
                tempFilterInfo.push(element.Title +' : ('+ element.checked.length + ')')
        });
        filterInfo = tempFilterInfo.join('| ');
        this.setState({filterInfo});
    }    
    
    private isItemExists = function (arr:any, Id:any) {
        var isExists = false;
        arr.forEach(function (item:any) {
            if (item.Id == Id) {
                isExists = true;
                return false;
            }
        });
        return isExists;
    }

    UpdateClick = () =>{
        this.props.parentCallback(this.state.filterGroups);
    }

    private onCheck(checked:any, index:any) {
        let filterGroups = this.state.filterGroups;
        filterGroups[index].checked =  checked;
        filterGroups[index].checkedObj = this.GetCheckedObject(filterGroups[index].values, checked)
        this.setState({filterGroups},()=>{
            console.log(filterGroups);
            this.getFilterInfo();
        });        
    }

    private onExpanded(expanded:any, index:any) {
        let filterGroups = this.state.filterGroups;
        filterGroups[index].expanded =  expanded;
        this.setState({filterGroups},()=>{
            console.log(filterGroups)
        });        
    }

    private GetCheckedObject(arr:any, checked:any){
        //let filterGroups = this.state.filterGroups;
        let checkObj:any = [];
        checked.forEach((value:any) => {
            arr.forEach((element:any) => {
                if (value == element.Id){
                    checkObj.push({
                        Id : element.Id,
                        Title : element.Title
                    })
                }
                if (element.children != undefined && element.children.length > 0){
                    element.children.forEach((chElement:any) => {
                        if (value == chElement.Id){
                            checkObj.push({
                                Id : chElement.Id,
                                Title : chElement.Title
                            })
                        }
                    });
                }                
            });
        });
        return checkObj;
    }

    

    public render(): React.ReactElement<ISmartSearchFilterProps> {
        SPComponentLoader.loadCss("https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css");
    
        return (
        <>
        <section className="ContentSection">
            <div className="container">
                <div className="col-sm-12 tab-content bdrbox pad10">
                    <div className="togglebox">
                        <span>
                        <label className="toggler full_width mb-10 active">
                            <span className="pull-left">
                                <img title="Filter" className="hreflink wid22" ng-show="pagesType=='Service-Portfolio'" 
                                    src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Filter-12-WF.png" />
                                SmartSearch – Filters
                            </span>
                            <span className="ml20">
                                <span className="ng-binding ng-scope">{this.state.filterInfo}</span>
                            </span>
                            <span className="pull-right" ng-click="filtershowHide()">
                                <img className="icon-sites-img  wid22 ml5" ng-show="pagesType=='Service-Portfolio'" title="Share SmartFilters selection" ng-click="GenerateUrl()" src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Icon_Share_Green.png" />
                            </span>
                            <span className="pull-right">
                                <span className="hreflink ng-scope" ng-if="smartfilter2.expanded">
                                    <img title="Tap to Collapse" ng-show="pagesType=='Service-Portfolio'" className="hreflink wid10" src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/sub_icon.png" />
                                </span>
                            </span>
                        </label>
                        <div className="togglecontent" style={{display:"block"}}>
                            <div className="col-sm-12 pad0">
                            <table width="100%" className="indicator_search">
                                    <tbody>
                                        <tr>
                                        {this.state.filterGroups != null && this.state.filterGroups.length > 0 &&
                                            this.state.filterGroups.map((Group:any, index:any)=>{
                                               return <td>
                                                        <fieldset>
                                                            <legend ng-if="item!='teamSites'" className="ng-scope">
                                                                <span className="ng-binding">{Group.Title}</span>
                                                            </legend>                                               
                                                        </fieldset>                                                    
                                                    <CheckboxTree
                                                      nodes={Group.values}
                                                      checked={Group.checked}
                                                      expanded={Group.expanded}
                                                      onCheck={checked =>this.onCheck(checked,index)}
                                                      onExpand={expanded =>this.onExpanded(expanded,index)}
                                                      nativeCheckboxes={true}
                                                      showNodeIcon={false}
                                                      checkModel={'all'}
                                                  />
                                                </td>

                                            })

        }
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="col-md-12 pad0">

                                <div className="full_width">
                                    <button type="button" className="btn btn-grey ml5 pull-right " title="Clear All" ng-click="ClearFilters('SearchComponent')">
                                        Clear Filter
                                    </button>
                                    <button type="button" className="btn pull-right  btn-primary" title="Smart Filter" onClick={this.UpdateClick}>
                                        Update Filter
                                    </button>
                                </div>

                            </div>
                        </div>
                        </span>
                    </div>
                </div>
            </div>
        </section>
        </>
        );
    }
}

export default SmartSearchFilterCard;