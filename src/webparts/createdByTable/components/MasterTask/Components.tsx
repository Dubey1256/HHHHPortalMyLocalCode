import * as React from "react";
import { Web } from "sp-pnp-js";
import { DataGrid } from "@mui/x-data-grid";

const Components = () => {
  const [masterData, setMasterData]: any = React.useState([]);
  const column: any = [
    { field: "ID", headerName: "ID" },
    { field: "Parent", headerName: "ParentTitle" },
  ];
  
  const MasterTask = async () => {
    const web1 = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
    await web1.lists
      .getById("EC34B38F-0669-480A-910C-F84E92E58ADF")
      .items.select(
        "Parent/Id",
        "Parent/Title",
        "Title",
        "Item_x0020_Type",
        "ID"
      )
      .expand("Parent")
      .getAll()
      .then((msg: any) => {
        const a: any = [];
        msg.map((item: any) => {
          if (item.Item_x0020_Type == "SubComponent") {
            a.push(item);
          }
        });
        setMasterData(a);
       
        console.log("parent name or title will be  sma e ", a);
        console.log(msg);
      })
      .catch((err: any) => {
        console.log(err);
      });
  };
  React.useEffect(() => {
    MasterTask();
  }, []);
  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <DataGrid
        rows={masterData}
        columns={column}
        getRowId={(takeId) => takeId.ID} 
       
        />
        
    </div>
  );
};
export default Components;
