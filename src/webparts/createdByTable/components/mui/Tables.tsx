import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Web } from "sp-pnp-js";
import "./Table.css";



const Tables = () => {
  
  const [eiLeast, setEiLeast]: any = React.useState([]);
  let userlists : any ;
  
  const columns = [
    { field: "idType", headerName: "Task ID", width: 90, editable: true,
    renderCell: (params: any) => {
      return (
        <div>
          {/* {params.row.AuthorImgUrl.Url === undefined ? (
            <img
              style={{ height: "30%", width: "30%", borderRadius: "50%" }}
              src="https://dummyimage.com/600x400/000/fff"
              alt=""
            />
          ) : (
            <img
              style={{ height: "30%", width: "30%", borderRadius: "50%" }}
              src={params.row.AuthorImgUrl.Url}
              alt=""
            />
          )} */}  
          <img
            style={{ height: "30px", width: "30px", borderRadius: "50%" }}
            src={params.row.siteImg}
            alt=""
            title={params.row.siteTitle}
          />

                {params.row.idType}
        </div>
      );
    },
  },
    { field: "Title", headerName: "Task Title", width: 240, editable: true },
    {
      field: "Categories",
      headerName: "Categories",
      width: 220,
      editable: true,
    },
    { field: "percentage", headerName: "%", width: 60, editable: true },
    {
      field: "Priority_x0020_Rank",
      headerName: "Priority",
      width: 70,
      editable: true,
    },

    { field: "newDueDate", headerName: "Due Date", width: 170, editable: true },
    {
      field: "Modified",
      headerName: "Modified Date",
      width: 170,
      editable: true,
      renderCell: (params: any) => {
        return (
          <div>
            {/* {params.row.EditorImgUrl.Url === undefined ? (
              <img
                style={{ height: "30%", width: "30%", borderRadius: "50%" }}
                src="https://dummyimage.com/600x400/000/fff"
                alt=""
              />
            ) : (
              <img
                style={{ height: "30%", width: "30%", borderRadius: "50%" }}
                src={params.row.EditorImgUrl.url}
                alt=""
              />
            )} */} {params.row.newModified}
            <img
              style={{ height: "30px", width: "30px", borderRadius: "50%" }}
              src={params.row?.EditorImg?.Item_x0020_Cover?.Url}
              alt=""
              title={params.row?.EditorImg?.Title}
            />

           
          </div>
        );
      },
    },
    {
      field: "Created",
      headerName: "Create Date",
      width: 170,
      renderCell: (params: any) => {
        return (
          <div>
            {/* {params.row.AuthorImgUrl.Url === undefined ? (
              <img
                style={{ height: "30%", width: "30%", borderRadius: "50%" }}
                src="https://dummyimage.com/600x400/000/fff"
                alt=""
              />
            ) : (
              <img
                style={{ height: "30%", width: "30%", borderRadius: "50%" }}
                src={params.row.AuthorImgUrl.Url}
                alt=""
              />
            )} */}  {params.row.newCreated}
            <img
              style={{ height: "30px", width: "30px", borderRadius: "50%" }}
              src={params.row?.AuthorImg?.Item_x0020_Cover?.Url}
              alt=""
              title={params.row?.AuthorImg?.Title}
            />

          
          </div>
        );
      },
      editable: true,
    },
  ];

  let dataEps:any;
  const getEPSData=async()=>{
    const web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
    await web.lists
      .getById("EC6F0AE9-4D2C-4943-9E79-067EC77AA613")
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
      ).filter("Author/Id eq 32 and PercentComplete lt .99")
      .getAll().then((data:any)=>{
        data.map((item:any)=>{
        item.siteImg='https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_ei.png';
        item.siteTitle='EI'
        })
        dataEps=data;
        console.log("EPSEPSEPSEPSEPSEPS" , dataEps);
        getGenderData();
        
      }).catch((err:any)=>{
           console.log(err);
      })

  }


  let dataGender:any;
  const getGenderData=async()=>{
    const web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
    await web.lists
      .getById("F8FD0ADA-0F3C-40B7-9914-674F63F72ABA")
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
      ).filter("Author/Id eq 32 and PercentComplete lt .99")
      .getAll().then((data:any)=>{
        data.map((item:any)=>{
        item.siteImg="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_gender.png";
        item.siteTitle='Gender'
        })
        dataGender=data;
        console.log("dataGendergender", dataGender);
        getQAData();
        
      }).catch((err:any)=>{
           console.log(err);
      })

  }

  
  let dataQA:any;
  const getQAData=async()=>{
    const web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
    await web.lists
      .getById("61B71DBD-7463-4B6C-AF10-6609A23AE650")
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
      ).filter("Author/Id eq 32 and PercentComplete lt .99")
      .getAll().then((data:any)=>{
        data.map((item:any)=>{
        item.siteImg="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_qa.png";
        item.siteTitle='QA'
        })
        dataQA=data;
        console.log("dataQAQAQAQA", dataQA);
        getEIData();
        
      }).catch((err:any)=>{
           console.log(err);
      })

  }

  const getEIData = async () => {
    const web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
    await web.lists
      .getById("E0E1FC6E-0E3E-47F5-8D4B-2FBCDC3A5BB7")
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
      ).filter("Author/Id eq 32 and PercentComplete lt .99")
      .getAll()
      .then((data) => {
        data.map((item:any)=>{
          item.siteImg='https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_eps.png';
          item.siteTitle='EPS'
          })
        console.log("data EIEEIEIEIEI data", data);
        data.push(...dataEps,...dataGender,...dataQA);

        data.map((item: any) => {
          userlists.map((element: any) => {

            item.percentage= (item.PercentComplete*100) + '%'

            if((item.SharewebTaskType==undefined? null:   item.SharewebTaskType.Title)==='Activities'){
              item.idType='A'+item.Id;
            }
            else if((item.SharewebTaskType==undefined? null:   item.SharewebTaskType.Title)==='MileStone'){
              item.idType='M'+item.Id;
            }
            else if ((item.SharewebTaskType==undefined? null:   item.SharewebTaskType.Title)==='Project'){
              item.idType='P'+item.Id;
            }
            else if((item.SharewebTaskType==undefined? null:   item.SharewebTaskType.Title)==='Step'){
              item.idType='S'+item.Id;
            }
            else if((item.SharewebTaskType==undefined? null:   item.SharewebTaskType.Title)==='Task'){
              item.idType='T'+item.Id;
            }
            else if((item.SharewebTaskType==undefined? null:   item.SharewebTaskType.Title)==='Workstream'){
              item.idType='W'+item.Id;
            }
            else{
              item.idType='T'+item.Id;
            }
           

            let date = new Date(item.Created);
            let day = "" + date.getDate();
            let month = "" + (date.getMonth() + 1);
            let year = date.getFullYear();
            if (month.length < 2) month = "0" + month;
            if (day.length < 2) day = "0" + day;
            let completeDate = [day, month, year].join("/");
            item["newCreated"] = completeDate;

            

            let date1 = new Date(item.Modified);
            let day1 = "" + date1.getDate();
            let month1 = "" + (date1.getMonth() + 1);
            let year1 = date1.getFullYear();
            if (month1.length < 2) month1 = "0" + month1;
            if (day1.length < 2) day1 = "0" + day1;
            let completeDate1 = [day1, month1, year1].join("/");
            item["newModified"] = completeDate1;

          
              let date2 = new Date(item.DueDate);
              let day2 = "" + date2.getDate();
              let month2 = "" + (date2.getMonth() + 1);
              let year2 = date2.getFullYear();
              if (month2.length < 2) month2 = "0" + month2;
              if (day2.length < 2) day2 = "0" + day2;
              let completeDate2 = [day2, month2, year2].join("/");
              item["newDueDate"] = completeDate2;
          
              
            

          

            if (
              element.AssingedToUser != undefined &&
              element.AssingedToUser.Id == item.Author.Id
            ) {
              item.AuthorImg = element;
            }
            if (
              element.AssingedToUser != undefined &&
              element.AssingedToUser.Id == item.Editor.Id
            ) {
              item.EditorImg = element;
            }
          });
        });
        console.log("datadatadatadatadatadatadatadata", data);

        setEiLeast(data);
      
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getTaskUserData = async () => {
    const web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
    await web.lists
      .getById("B318BA84-E21D-4876-8851-88B94B9DC300")
      .items.select(
        "AssingedToUser/Title",
        "AssingedToUser/Id",
        "Item_x0020_Cover",
        "Title"
      )
      .expand("AssingedToUser")
      .getAll()
      .then((data) => {
       userlists=data;
        getEPSData();
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //   const matchList = () => {
  // let tasks=eiLeast;

  // setEiLeast(tasks)
  //   };

 
  React.useEffect(() => {
    getTaskUserData();
  }, []);

  return (
    <div className="" style={{ height: "100%", width: "100%" }}>
      <Box sx={{ height: 600, width: 1 }}>
        <DataGrid
          autoHeight
          rows={eiLeast}
          disableColumnSelector
          disableDensitySelector
          columns={columns}
          getRowId={(takeId) => takeId.ID}
          components={{ Toolbar: GridToolbar }}
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
        />
      </Box>
    </div>
  );
};
export default Tables;