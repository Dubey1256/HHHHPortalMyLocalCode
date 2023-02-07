import * as React from "react";

import { DataGrid } from "@mui/x-data-grid";
import { Web } from "sp-pnp-js";

const Table = () => {
  const [data, setData]: any = React.useState([
    { ID: 1, Title: "", BIC: "", dateOfBirth: "" },
  ]);
  const columns: any = [
    { field: "ID", headerName: "ID", width: 70 },
    { field: "Title", headerName: "Title", width: 170  },
    { field: "BIC", headerName: "BIC", width: 170  },
    { field: "churchTax", headerName: "church Tax", width: 100  },
    { field: "contributionGroupHi", headerName: "HI Contribution", width: 170  },
  ];

  const fetchAPIData = async () => {
    const web1 = new Web("https://hhhhteams.sharepoint.com/sites/HHHH");
    await web1.lists
      .getById("6DD8038B-40D2-4412-B28D-1C86528C7842")
      .items.select("ID", "Title", "BIC", "churchTax","contributionGroupHi")
      .get()
      .then((msg: any) => {
        
        setData(msg);
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  React.useEffect(() => {
    fetchAPIData();
  }, []);

  return (
    <section style={{height:'100vh', width:"100%"}}>
      {console.log(data)}
      <DataGrid rows={data} columns={columns}  pageSize={10}
        rowsPerPageOptions={[10]}
        checkboxSelection getRowId={(row) => row.ID} />
    </section>
  );
};
export default Table;
