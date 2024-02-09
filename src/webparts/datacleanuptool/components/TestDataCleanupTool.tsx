import React, { useState, useEffect } from 'react';
import { Web } from 'sp-pnp-js';
import GlobalCommanTable from '../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable';
import { ColumnDef } from '@tanstack/react-table';
import moment, * as Moment from "moment";
import PageLoader from '../../../globalComponents/pageLoader';
let AllDataItems: any = []
let AllDataCleanUpdata: any = [];
let AllDataCleanUpItems: any = [];
let SelectedData: any = [];
let AllUsers: any = [];
let renderData: any = [];
function DataCleancupTool(SelectedProp: any) {
    const refreshData = () => setData(() => renderData);
    const [siteConfig, setsiteConfigData] = React.useState([])
    const [data, setData] = React.useState([])
    const [count, setCount] = React.useState(0)
    const [ItemChecked, setItemChecked] = useState<any>(false);
    const [loaded, setLoaded] = React.useState(true);
    let TodayDate = new Date().setHours(0, 0, 0, 0)
   
    interface Item {

        Title: string;
        Items: any[];
        [key: string]: any;
    }
    const loadAllList = async () => {
        try {
            let web = new Web(SelectedProp.SelectedProp.siteUrl);
            const LoadBackups = await web.lists.getById(SelectedProp.SelectedProp.BackupConfigurationsListID).items.getAll();
            if (LoadBackups?.length > 0 && LoadBackups !== undefined) {
                LoadBackups.forEach((element: any) => {
                    if (element.Columns != undefined && element.Backup == true && element.Title != "TaskTimeSheetListNew" && element.Title != "HHHH" && element.Title != "TasksTimesheet2" && element.Title != "TaskTimesheet") {                        
                        element.MainUrl = SelectedProp.SelectedProp.siteUrl;                 
                        siteConfig.push(element);
                    }


                });
                console.log(siteConfig);
                LoadTaskUser()
                loadAllSitesItems();
            }
        } catch (error) {
            console.error(error);
        }
    };
    var showProgressBar = () => {
        setLoaded(false);
      };
    
      var showProgressHide = () => {
        setLoaded(true);
      };
    const LoadTaskUser = () => {    
        let web = new Web(SelectedProp.SelectedProp.siteUrl + '/')
        web.lists.getById(SelectedProp.SelectedProp.TaskUserListID).items.select('Id,Suffix,Title,SortOrder,Item_x0020_Cover,AssingedToUserId,AssingedToUser/Title,AssingedToUser/Id,AssingedToUser/EMail,ItemType').expand('AssingedToUser').getAll().then((response: any) => {
            AllUsers = response;
        }).catch((error: any) => {
            console.error(error);
        });
    }
   
    const loadAllSitesItems = async () => {
        var count = 0;
        await Promise.all(siteConfig.map(async (item: Item) => {
            try {
                let web = new Web('https://hhhhteams.sharepoint.com' + item.SiteUrl);

                const items = await web.lists.getById(item.List_x0020_Id).items.select(item.Query).getAll();
                items?.map((ListItem: any) => {
                    ListItem.ListName=item.Title;
                    ListItem.ListId=item.List_x0020_Id;
                })               
                console.log(items);
                count++
                AllDataItems = AllDataItems.concat(items);

               
            } catch (error) {
                console.log(item.List_x0020_Name);
                console.error(error);
            }
        }));
        if (count === siteConfig.length)
            console.log(AllDataItems)

        AllDataItems?.map((Item: any) => {          
            Item.CreatedDate = moment(Item?.Created).format('DD/MM/YYYY');
            Item.ModifiedDate = moment(Item?.Modified).format('DD/MM/YYYY HH:mm')
            if (Item?.Created != null && Item?.Created != undefined)
             Item.serverCreatedDate = new Date(Item?.Created).setHours(0, 0, 0, 0)
             if (Item?.Title != null && Item?.Title != undefined)
              Item.Title=Item.Title.toLowerCase();
             if (Item.Title?.includes("test") || (Item.serverCreatedDate!=undefined && Item.serverCreatedDate == TodayDate)) {
            if (Item.Title?.indexOf("test") > -1) {
                AllDataCleanUpdata.push(Item)
            }
        }
        })
       
        AllDataCleanUpItems = AllDataCleanUpdata.concat();

        AllDataCleanUpItems?.map((ItemUser: any) => { 
            ItemUser.AllModifiedImages = [];
            ItemUser.AllCreatedImages = [];
            let CreatedUserObj: any = {};
            let ModifiedUserObj: any = {};
            AllUsers?.map((User: any) => { 
            if (User.AssingedToUser != undefined && User.AssingedToUser.Id != undefined && ItemUser.Author.Id == User.AssingedToUser.Id && User.Item_x0020_Cover != undefined) {
                CreatedUserObj['UserImage'] = User.Item_x0020_Cover.Url;
                CreatedUserObj['Suffix'] = User.Suffix;
                CreatedUserObj['Title'] = User.Title;
                CreatedUserObj['UserId'] = User.AssingedToUserId;
            }
            if (User.AssingedToUser != undefined && User.AssingedToUser.Id != undefined && ItemUser.Editor.Id == User.AssingedToUser.Id && User.Item_x0020_Cover != undefined) {
                ModifiedUserObj['UserImage'] = User.Item_x0020_Cover.Url;
                ModifiedUserObj['Suffix'] = User.Suffix;
                ModifiedUserObj['Title'] = User.Title;
                ModifiedUserObj['UserId'] = User.AssingedToUserId;
            }
        })
        ItemUser.AllCreatedImages.push(CreatedUserObj);
        ItemUser.AllModifiedImages.push(ModifiedUserObj)
        })
        setData(AllDataCleanUpItems)
        showProgressHide();
        console.log(AllDataCleanUpItems);   

    }
    const deleteData = (dlData: any) => {

        var flag: any = confirm('Do you want to delete this item')      
        if (flag) {
            let web = new Web(SelectedProp.SelectedProp.siteUrl+ '/')
            web.lists.getById(dlData.ListId).items.getById(dlData.Id).recycle().then(() => {
                alert("delete successfully")
                AllDataCleanUpItems?.map((val:any,index:any)=>{
                    if(val.Id == dlData.Id){
                        AllDataCleanUpItems.splice(index,1)
                        renderData = [];
                        renderData = renderData.concat(AllDataCleanUpItems)
                        refreshData();
                        
                    }
                })
                
                
            }).catch((error: any) => {
                console.error(error);
            });
        }
      
   }
   const MoveItems = (Selected: any) => {
    var flag = confirm("Are you sure, Do not show this item further on this page?");
    if(flag)
     SaveItem(Selected);
   
        
}
const SaveItem = async (SelectedItem: any) => {

    if (SelectedItem != undefined && SelectedItem!= '') {
        var postdata={
          DoNotAllow:true,
        }
        let web = new Web(SelectedProp.SelectedProp.siteUrl);
        await web.lists.getById(SelectedItem.ListId).items.getById(SelectedItem?.Id).update(postdata)
            .then(async (res: any) => {
                alert("These items will not show further on this page... ")
                AllDataCleanUpItems?.map((val:any,index:any)=>{
                    if(val.Id == SelectedItem.Id && val.DoNotAllow==true){
                        AllDataCleanUpItems.splice(index,1)
                        renderData = [];
                        renderData = renderData.concat(AllDataCleanUpItems)
                        refreshData();
                        
                    }
                })
         
            }).catch((err: any) => {
                console.log(err);
            })
    }
}
   const RemovedItems = () => {
    var flag: any = confirm('Do you want to delete these selected items')
    showProgressBar();
    var count = 0;
    if (flag) {
     var RomovedSelectedItems = SelectedData
     RomovedSelectedItems.map(async (item:any,index:any)=>{
        let web = new Web(SelectedProp.SelectedProp.siteUrl+ '/')
           await web.lists.getById(item.ListId).items.getById(item.Id).recycle().then(() => {
            count++
            AllDataCleanUpItems?.map((Rval:any,index:any)=>{
                    if(Rval.Id == item.Id){
                        AllDataCleanUpItems.splice(index,1)   
                        renderData = [];
                        renderData = renderData.concat(AllDataCleanUpItems)
                        refreshData(); 
                        if(RomovedSelectedItems.length == count){
                            alert("Selected Items Deleted Successfully.... ") 
                            showProgressHide(); 
                        }
                                                           
                    }
                })   
            
            }).catch((error: any) => {
                console.error(error);
            });
     })
   
    }
                       
  }
  const customTableHeaderButtons = (
    <button type="button" title="Remove Items" className="btnCol btn btn-primary" onClick={RemovedItems}>Remove Items</button>
    //<button type="button" className={`btn btn-${workingTodayFiltered ? 'primary' : 'grey'}`} onClick={() => { switchFlatViewData(ProjectTableData, !workingTodayFiltered) }}> Working-Today </button>
  )
    //#region code to apply react/10stack
    const columns = React.useMemo<ColumnDef<any, unknown>[]>(() => [
        {
            accessorKey: "",
            placeholder: "",
            hasCheckbox: true,
            hasCustomExpanded: false,
            hasExpanded: false,
            size: 10,
            id: 'Id',
        },
        {
            accessorKey: "Title", placeholder: "Title", header: "", id: "Title",
            cell: ({ row }) => (
                <div className='alignCenter '>
                    {row?.original?.Title != undefined && row?.original?.Title != null && row?.original?.Title != '' ? <a className='ms-2'>{row?.original?.Title}</a> : ""}
                </div>
            ),
        },
        {
            accessorKey: "ListName", placeholder: "List Name", header: "", id: "ListName",
            cell: ({ row }) => (
                <div className='alignCenter '>
                    {row?.original?.ListName != undefined && row?.original?.ListName != null && row?.original?.ListName != '' ? <a className='ms-2'>{row?.original?.ListName}</a> : ""}
                </div>
          ),
        },
        {
            accessorKey: "Created", placeholder: "Created Date", header: "", size: 120, id: "Created", isColumnDefultSortingDesc: true,
            cell: ({ row }) => (
                <>
                    {row?.original?.CreatedDate}
                    {row?.original?.AllCreatedImages.map((item: any) => (
                        <a className='ms-1' target="_blank" data-interception="off" href={`${SelectedProp.SelectedProp.siteUrl}/SitePages/TaskDashboard.aspx?UserId=${item.UserId}&Name=${item.Title}`}>
                            {item?.UserImage != undefined && item?.UserImage != '' ? <img title={item?.Title} className="workmember" src={item?.UserImage}></img> : <img title={item?.Title} className="workmember" src={`${SelectedProp.SelectedProp.siteUrl}/SiteCollectionImages/ICONS/32/icon_user.jpg`}></img>}
                        </a>
                    ))}
                </>
            ),
        },
        {
            accessorKey: "Modified", placeholder: "Modified Date", header: "", size: 172, id: "Modified",
            cell: ({ row }) => (
                <>
                    {row?.original?.ModifiedDate}
                    {row?.original?.AllModifiedImages.map((item: any) => (
                        <a className='ms-1' target="_blank" data-interception="off" href={`${SelectedProp.SelectedProp.siteUrl}/SitePages/TaskDashboard.aspx?UserId=${item.UserId}&Name=${item.Title}`}>
                            {item?.UserImage != undefined && item?.UserImage != '' ? <img title={item?.Title} className="workmember" src={item?.UserImage}></img> : <img title={item?.Title} className="workmember" src={`${SelectedProp.SelectedProp.siteUrl}/SiteCollectionImages/ICONS/32/icon_user.jpg`}></img>}
                        </a>
                    ))}
                </>
            ),
        },
        {
            cell: ({ row }) => (
                <div className='alignCenter'>
                    <a onClick={() => MoveItems(row.original)} title="Edit"><span title="Not show this item again" className="svg__iconbox svg__icon--cross dark  hreflink me-1"></span></a>
                    <a onClick={() => deleteData(row.original)}><span className="alignIcon svg__iconbox hreflink mini svg__icon--trash"></span></a>
                </div>
            ),
            accessorKey: '',
            canSort: false,
            placeholder: '',
            header: '',
            id: 'row.original',
            size: 50,
        },
    ],
        [data]);
    const callBackData = React.useCallback((elem: any, getSelectedRowModel: any, ShowingData: any) => {
     
        if (elem != undefined) {
            SelectedData = elem.map((val:any)=>{
                return  val.original
            })
           
        
        } else {
                   
            SelectedData = [];
        }       
        console.log(SelectedData);
    }, []);
    //#endregion
    useEffect(() => {
        showProgressBar()
        loadAllList()
    }, [])
    return (
        <>
            <div className="col-sm-12 clearfix">
                <h2 className="d-flex justify-content-between align-items-center siteColor  serviceColor_Active">
                    <div>Data Cleanup Tool
                    </div>         
                </h2>
            </div>
            {data && <div>
                <div className="TableContentSection">
                    <div className='Alltable mt-2 mb-2'>
                        <div className='col-md-12 p-0 '>
                            <GlobalCommanTable columns={columns} multiSelect={true} data={data} showHeader={true} callBackData={callBackData} expandIcon={true} hideTeamIcon={true} hideOpenNewTableIcon={true} customHeaderButtonAvailable={true}
                            customTableHeaderButtons={customTableHeaderButtons}/>
                            
                        </div>
                    </div>
                </div>
            </div>}
            {!loaded ?<PageLoader/>:""}
        </>
    )
}
export default DataCleancupTool;