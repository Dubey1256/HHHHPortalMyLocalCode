import * as React from "react";
import { useEffect, useState} from 'react'
import { Web } from "sp-pnp-js";
import GlobalCommanTable from "../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable";
import {
    ColumnDef,
  } from "@tanstack/react-table";
import { data } from "jquery";

const AllMasterTaskLoad =(props:any) => {
    const [allMasterData, setAllMasterData] = useState<any>([]);
    const [allComponentData, setAllComponentData] = useState<any>([]);
    const [allSubComponentData, setAllSubComponentData] = useState<any>([]);
    const [allFeatureData, setAllFeatureData] = useState<any>([]);
    const [allData, setAllData] = useState<any>([]);
    let headerOptions: any = {
      openTab: true,
      teamsIcon: true
    }

    const getAllMasterTaskData =async()=>{
    let web = new Web(props?.props?.siteUrl);
    let componentDetails:any = []
    componentDetails = await web.lists
        .getById(props?.props?.MasterTaskListID)
        .items
        .select("ID", "Id", "Title", "PortfolioLevel", "PortfolioStructureID","ItemRank", "Portfolio_x0020_Type",
            "DueDate","Item_x0020_Type","ItemType","Short_x0020_Description_x0020_On", "PriorityRank", "Priority",
            "PercentComplete", "AssignedToId","Created", "Modified", "Parent/Id", "Parent/Title","Parent/ItemType","PortfoliosId", "Portfolios/Id", "Portfolios/Title","PortfolioType/Id","PortfolioType/Title"    
        )
        .expand("Parent","Portfolios","PortfolioType")    
        .getAll();

        
        const undefinedAllData= componentDetails.filter((item:any) => item.PortfolioStructureID === null ||(item.PortfolioStructureID && item.PortfolioStructureID.includes("undefined")))
        setAllMasterData(undefinedAllData)

        const ComponentChildData = undefinedAllData?.filter((item:any)=>item.Portfolio_x0020_Type === "Component" && (item.Item_x0020_Type && item.Item_x0020_Type.includes("Component")) || (item.Item_x0020_Type && item.Item_x0020_Type.includes("Component Category")) || (item.Item_x0020_Type && item.Item_x0020_Type.includes("SubComponent")) || (item.Item_x0020_Type && item.Item_x0020_Type.includes("Feature")))
        setAllComponentData(ComponentChildData)
        
        const SubcomponentChildData = undefinedAllData.filter((itemss:any)=>itemss.Portfolio_x0020_Type == "SubComponent" && ((itemss.Item_x0020_Type && itemss.Item_x0020_Type.includes("SubComponent" )) || (itemss.Item_x0020_Type && itemss.Item_x0020_Type.includes("Feature" ))))
        setAllSubComponentData(SubcomponentChildData)

        const featureData = undefinedAllData.filter((itemm:any)=>itemm.Portfolio_x0020_Type == "Feature" && (itemm.Item_x0020_Type && itemm.Item_x0020_Type.includes("Feature" )))
        setAllFeatureData(featureData)

       let totalData = ComponentChildData.concat(SubcomponentChildData);
       console.log("totalDataAllComponent shown is",totalData);

       let totalDataas = totalData.concat(featureData);
       console.log(" shown is",totalDataas);

       let totalll = totalDataas 
      console.log("Total data shown is",totalll);
      setAllData(totalll)
        
    }
    console.log("data show",allMasterData);

    const column = React.useMemo<ColumnDef<any, unknown>[]>(
        () => [
          {
            accessorKey: "",
            placeholder: "",
            hasCustomExpanded: true,
            hasExpanded: false,
            hasCheckbox: true,
            isHeaderNotAvlable:true,
            size: 10,
            id: 'Id',  
          },
          {
            accessorFn: (row) => row?.PortfolioStructureID,
            cell: ({ row }) => (
              <>
               {row?.original?.PortfolioStructureID}
              </>
            ),
            placeholder: "PortfolioID",
            header: "",
            resetColumnFilters: false,
            size: 120,
            id: "PortfolioStructureID",
          },
          {
            accessorFn: (row) => row?.ItemType,
            cell: ({ row }) => (
              <>
               {row?.original?.ItemType}
              </>
            ),
            placeholder: "ItemType",
            header: "",
            resetColumnFilters: false,
            size: 120,
            id: "Item_x0020_Type",
          },
          {
            accessorFn: (row) => row?.Title,
            cell: ({ row, column, getValue }) => (
              <>
               <span>
               <a
               className="hreflink"
               href={ props?.props?.siteUrl +
                "/SitePages/Portfolio-Profile.aspx?taskId=" +
                row?.original?.ID}
               data-interception="off"
               target="_blank"
             >
               {row?.original?.Title}
             </a>
             </span> 
              </>
            ),
            id: "Title",
            placeholder: "Title",
            resetColumnFilters: false,
            resetSorting: false,
            header: "",
          },
          {
            accessorFn: (row) => row?.Parent?.Title,
            placeholder: "Parent Title",
            header: "",
            id:"ParentTitle",
            resetColumnFilters: false,
            resetSorting: false,
            size: 125,
            cell: ({ row, getValue }) => (              
                <>
               <span>
                {(row?.original?.Parent?.Title) &&
              <a
               className="hreflink"
               href={ props?.props?.siteUrl +
                "/SitePages/Portfolio-Profile.aspx?taskId=" +
                row?.original?.ID}
               data-interception="off"
               target="_blank"
             >
               {row?.original?.Parent?.Title}
             </a>
              }
             </span>
            </>             
            ),
          },
          {
            accessorFn: (row) => row?.Parent?.ItemType,
            placeholder: "Parent ItemType",
            header: "",
            id:"ParentItemType",
            resetColumnFilters: false,
            resetSorting: false,
            size: 125,
            cell: ({ row, getValue }) => (
                <>{row?.original?.Parent?.ItemType}</>             
            ),
          },
          
        ],
        [data]
      );
      
      const callBackData = React.useCallback((elem: any, ShowingData: any) => {

      }, []);

    useEffect(() => {
      getAllMasterTaskData()      
    }, [])


  return (
    <>
     <div className='border full-width' >
      <GlobalCommanTable bulkEditIcon={true} 
       columns={column} data={allData} callBackData={callBackData} exportToExcel={true} showHeader={true}  fixedWidth={true}  />
      
      </div>
    </>
  );

}
export default AllMasterTaskLoad;
