// import { AgGridReact } from "ag-grid-react";
// import "ag-grid-enterprise";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
// import { useMemo, useState } from "react";
// import * as React from "react";

// const DataGridPremiumDemo = () => {
//   const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
//   const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
//   const [rowData, setRowData] = useState([]);
//   const [columnDefs]: any = useState([
//     { field: "country", rowGroup: true, hide: true },
//     { field: "year" },
//     { field: "athlete" },
//     { field: "sport" },
//     { field: "gold" },
//     { field: "silver" },
//     { field: "bronze" },
//   ]);
//   const defaultColDef: any = useMemo(() => {
//     return {
//       flex: 1,
//       minWidth: 100,
//       sortable: true,
//       resizable: true,
//     };
//   }, []);
//   const autoGroupColumnDef: any = useMemo(() => {
//     return {
//       minWidth: 200,
//     };
//   }, []);

//   const onGridReady = React.useCallback(() => {
//     fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
//       .then((resp) => resp.json())
//       .then((data) => setRowData(data));
//   }, []);

//   return (
//     <div style={containerStyle}>
//       <div style={gridStyle} className="ag-theme-alpine">
//         <AgGridReact
//           rowData={rowData}
//           columnDefs={columnDefs}
//           defaultColDef={defaultColDef}
//           autoGroupColumnDef={autoGroupColumnDef}
//           animateRows={true}
//           onGridReady={onGridReady}
//         />
//       </div>
//     </div>
//   );      
// };
// export default DataGridPremiumDemo;
