import * as React from 'react';
import pnp, { Web } from "sp-pnp-js";
import "bootstrap/dist/css/bootstrap.min.css";
import {
    Column,
    Table,
    ExpandedState,
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getExpandedRowModel,
    ColumnDef,
    flexRender,
    getSortedRowModel,
    SortingState,
} from "@tanstack/react-table";
import { FaPrint, FaFileExcel, FaPaintBrush, FaEdit, FaSearch, FaSort, FaSortDown, FaSortUp, FaInfoCircle, FaChevronRight, FaChevronDown } from 'react-icons/fa';
import GlobalCommanTable from '../../../globalComponents/GlobalCommanTable';
import InlineEditingcolumns from '../../projectmanagementOverviewTool/components/inlineEditingcolumns';

const Table = (props:any) => {
    let count: any = 0;
   let AllListId:any = [];
    let allData: any = [];
    let userlists: any = [];
    let QueryId:any;
    let dataLength: any = [];
    const [newData, setNewData]: any = React.useState([]);

    const columns = React.useMemo<ColumnDef<any, unknown>[]>(
      () => [
          {
        accessorFn: (row) => row?.idType,
        cell: ({ row }) => (
            <div>
              <span><img style={{width:"25px", height:'25px', borderRadius:'20px'}}  src={row?.original?.siteIcon} /></span>
               <span>{row?.original?.idType}</span>
            </div>
        ),
        id: 'newCreated',
        placeholder: "Created Date",
        header: "",
        size: 10,
    },
      {
          accessorKey: "Title",
          placeholder: "Task Title",
          header: "",
          size: 7,
      },
      {
          accessorKey: "Categories",
          placeholder: "Categories",
          header: "",
          size: 9,
      },
          {
              accessorKey: "percentage",
              placeholder: "%",
              header: "",
              size: 7,
          },
          {
              accessorKey: "newDueDate",
              placeholder: "Due Date",
              header: "",
              size: 7,
             
          },
          {
            accessorFn: (row) => row?.newModified,
            cell: ({ row }) => (
                <div>
                   <span>{row?.original?.newModified}</span>
                <span><img style={{width:"25px", height:'25px', borderRadius:'20px'}}  src={row?.original?.editorImg} /></span>
                </div>
            ),
            id: 'newCreated',
            placeholder: "Created Date",
            header: "",
            size: 10,
        },
          {
            accessorFn: (row) => row?.newCreated,
            cell: ({ row }) => (
                <div>
                   <span>{row?.original?.newCreated}</span>
                <span><img style={{width:"25px", height:'25px', borderRadius:'20px'}}  src={row?.original?.authorImg} /></span>
                </div>
            ),
            id: 'newCreated',
            placeholder: "Created Date",
            header: "",
            size: 10,
        },
        {
          accessorKey: "TeamMembersSearch",
          placeholder: "Team Members",
          header: "",
          size: 7,
          Cell: ({ row }: any) => (
            <span>
              
              <InlineEditingcolumns
                AllListId={AllListId}
                callBack={getTaskUserData}
                columnName="Team"
                item={row?.original}
              
              />
            </span>
          ),
        },
      ],
      [newData]
  );



    const getTaskUserData = async () => {
      const web = new Web(props.Items.siteUrl);
      await web.lists
        .getById(props.Items.TaskUsertListID)
        .items.select(
          "AssingedToUser/Title",
          "AssingedToUser/Id",
          "Item_x0020_Cover",
          "Title"
        )
        .expand("AssingedToUser")
        .getAll()
        .then((data) => {
          userlists = data;
          getQueryVariable();
          smartMetaData();
        })
        .catch((err) => {
          console.log(err);
        });
    };
    const smartMetaData = async () => {
      const web = new Web(props.Items.siteUrl);
      await web.lists
        .getById(props.Items.SmartMetadataListID)
        .items.select("Configurations", "ID", "Title", "TaxType", "listId")
        .filter("TaxType eq 'Sites'")
        .getAll()
        .then((data) => {
          data.map((item: any) => {
            if (item.Title != "Education" && item.Configurations != null) {
              let a: any = JSON.parse(item.Configurations);
              a?.map((newitem: any) => {
                if (
                  newitem.siteName != "Education" &&
                  newitem.siteUrl ===
                    "https://hhhhteams.sharepoint.com/sites/HHHH/SP"
                ) {
                  dataLength.push(newitem.siteUrl);
                 
                  getAllData(newitem);
                  // b.push(newitem);
                }
              });
            }
          });
        })
        .catch((err) => {
          console.log(err);
        });
    };
    const getQueryVariable =  () => {
      const params = new URLSearchParams(window.location.search);
      let query = params.get("CreatedBy");
      QueryId = query;
      console.log(query); //"app=article&act=news_content&aid=160990"
    };
    const getAllData = async (items:any) => {
      const web = new Web(items.siteUrl);
      await web.lists
        .getById(items.listId)
        .items.select(
          "Title",
          "PercentComplete",
          "SharewebTaskType/Title",
          "SharewebTaskType/Id",
          "Categories",
          "Priority_x0020_Rank",
          "DueDate",
          "Created",
          "Modified",
          "Team_x0020_Members/Id",
          "Team_x0020_Members/Title",
          "ID",
          "Responsible_x0020_Team/Id",
          "Responsible_x0020_Team/Title",
          "Editor/Title",
          "Editor/Id",
          "Author/Title",
          "Author/Id"
        )
        .expand(
          "Team_x0020_Members",
          "Author",
          "SharewebTaskType",
          "Editor",
          "Responsible_x0020_Team"
        )
        .filter(`Author/Id eq ${QueryId} and PercentComplete le 99`)
        .getAll()
        .then((data: any) => {
          data.map((dataItem: any) => {
            userlists.map((userItem: any) => {
              dataItem.percentage = dataItem.PercentComplete * 100 + "%";
              // dataItem.siteTitle = listDetails.Title;
              // dataItem.siteImg = listDetails.ImageUrl;
  
              if (
                (dataItem.SharewebTaskType == undefined
                  ? null
                  : dataItem.SharewebTaskType.Title) === "Activities"
              ) {
                dataItem.idType = "A" + dataItem.Id;
              } else if (
                (dataItem.SharewebTaskType == undefined
                  ? null
                  : dataItem.SharewebTaskType.Title) === "MileStone"
              ) {
                dataItem.idType = "M" + dataItem.Id;
              } else if (
                (dataItem.SharewebTaskType == undefined
                  ? null
                  : dataItem.SharewebTaskType.Title) === "Project"
              ) {
                dataItem.idType = "P" + dataItem.Id;
              } else if (
                (dataItem.SharewebTaskType == undefined
                  ? null
                  : dataItem.SharewebTaskType.Title) === "Step"
              ) {
                dataItem.idType = "S" + dataItem.Id;
              } else if (
                (dataItem.SharewebTaskType == undefined
                  ? null
                  : dataItem.SharewebTaskType.Title) === "Task"
              ) {
                dataItem.idType = "T" + dataItem.Id;
              } else if (
                (dataItem.SharewebTaskType == undefined
                  ? null
                  : dataItem.SharewebTaskType.Title) === "Workstream"
              ) {
                dataItem.idType = "W" + dataItem.Id;
              } else {
                dataItem.idType = "T" + dataItem.Id;
              }
  
              let date = new Date(dataItem.Created);
              let day = "" + date.getDate();
              let month = "" + (date.getMonth() + 1);
              let year = date.getFullYear();
              if (month.length < 2) month = "0" + month;
              if (day.length < 2) day = "0" + day;
              let completeDate = [day, month, year].join("/");
              dataItem["newCreated"] = completeDate;
  
              let date1 = new Date(dataItem.Modified);
              let day1 = "" + date1.getDate();
              let month1 = "" + (date1.getMonth() + 1);
              let year1 = date1.getFullYear();
              if (month1.length < 2) month1 = "0" + month1;
              if (day1.length < 2) day1 = "0" + day1;
              let completeDate1 = [day1, month1, year1].join("/");
              dataItem["newModified"] = completeDate1;
  
              let date2 = new Date(dataItem.DueDate);
              let day2 = "" + date2.getDate();
              let month2 = "" + (date2.getMonth() + 1);
              let year2 = date2.getFullYear();
              if (month2.length < 2) month2 = "0" + month2;
              if (day2.length < 2) day2 = "0" + day2;
              let completeDate2 = [day2, month2, year2].join("/");
              dataItem["newDueDate"] = completeDate2;
  
              if (
                userItem.AssingedToUser != undefined &&
                userItem.AssingedToUser.Id == dataItem.Author.Id
              ) {
                dataItem.AuthorImg = userItem?.Item_x0020_Cover?.Url;
              }
              if (
                userItem.AssingedToUser != undefined &&
                userItem.AssingedToUser.Id == dataItem.Editor.Id
              ) {
                dataItem.EditorImg = userItem?.Item_x0020_Cover?.Url;
              }
            });
            
              allData.push({
                idType: dataItem.idType,
                Title: dataItem.Title,
                Categories: dataItem.Categories,
                percentage: dataItem.percentage,
                newDueDate: dataItem.newDueDate,
                newModified: dataItem.newModified,
                newCreated: dataItem.newCreated,
                editorImg: dataItem.EditorImg,
                authorImg:dataItem.AuthorImg,
                siteIcone : items.ImageUrl,
              });
           
          });
          count++;
  
          if (count == dataLength.length) {
            setNewData(allData);
          }
        })
        .catch((err: any) => {
          console.log("then catch error", err);
        });
    };
   
const callBack=()=>{
    console.log('calbacks');
}

    React.useEffect(() => {
      getTaskUserData();
      AllListId = {
        MasterTaskListID: props?.props?.MasterTaskListID,
        TaskUsertListID: props?.props?.TaskUsertListID,
        SmartMetadataListID: props?.props?.SmartMetadataListID,
        //SiteTaskListID:this.props?.props?.SiteTaskListID,
        TaskTimeSheetListID: props?.props?.TaskTimeSheetListID,
        DocumentsListID: props?.props?.DocumentsListID,
        SmartInformationListID: props?.props?.SmartInformationListID,
        siteUrl: props?.props?.siteUrl,
        AdminConfigrationListID: props?.props?.AdminConfigrationListID,
        isShowTimeEntry: props?.props?.isShowTimeEntry,
        isShowSiteCompostion: props?.props?.isShowSiteCompostion
      }
    }, []);
  return (
    <div>Table
        <span>
            <GlobalCommanTable data={newData} columns={columns} callBackData={callBack} />
        </span>
    </div>
  )
}

export default Table