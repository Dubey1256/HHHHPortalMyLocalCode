import * as React from "react";
import { useEffect, useState } from 'react'
import { Web } from "sp-pnp-js";
import GlobalCommanTable from "../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable";
import {
  ColumnDef,
} from "@tanstack/react-table";
import { data } from "jquery";
import EditInstituton from "../../EditPopupFiles/EditComponent";

var ContextValue: any = {};

const AllMasterTaskLoad = (props: any) => {
  ContextValue = props?.props;
  const [allMasterData, setAllMasterData] = useState<any>([]);
  const [allComponentData, setAllComponentData] = useState<any>([]);
  const [allSubComponentData, setAllSubComponentData] = useState<any>([]);
  const [allFeatureData, setAllFeatureData] = useState<any>([]);
  const [allData, setAllData] = useState<any>([]);
  const [editPopUpOpen, setEditPopUpOpen] = useState(false);
  const [Portfoliotyped, setPortfoliotyped] = useState([]);
  const [listIds, setlistIds] = React.useState<any>([]);
  const [portfolioTypeDataItem, setPortFolioTypeIcon] = React.useState([]);
  const [portfolioTypeConfrigration, setPortfolioTypeConfrigration] = React.useState<any>([{ Title: 'Component', Suffix: 'C', Level: 1 }, { Title: 'SubComponent', Suffix: 'S', Level: 2 }, { Title: 'Feature', Suffix: 'F', Level: 3 }]);
  const [SharewebComponent, setSharewebComponent] = React.useState("");
  const [IsComponent, setIsComponent] = React.useState(false);

  let allCSFdata: any = [];
  let allCSFcount: any = [];

  // let headerOptions: any = {
  //   openTab: true,
  //   teamsIcon: true
  // }
  useEffect(() => {
    const sitesId = {
      MasterTaskListID: props?.props?.MasterTaskListID,
      TaskTypeID: props?.props?.TaskTypeID,
      siteUrl: props?.props?.siteUrl,
      TaskUsertListID: props?.props?.TaskUsertListID,
      SmartMetadataListID: props?.props?.SmartMetadataListID,
      DocumentsListID: props?.props?.DocumentsListID,
      SmartHelptListID: props?.props?.SmartHelptListID,
      PortFolioTypeID: props?.props?.PortFolioTypeID,
      SiteCompostion: props?.props?.isShowSiteCompostion,
    }
    setlistIds(sitesId)
    getAllMasterTaskData()
    findPortFolioIconsAndPortfolio()
  }, [])


  const getAllMasterTaskData = async () => {

    let web = new Web(props?.props?.siteUrl);
    let componentDetails: any = []
    componentDetails = await web.lists
      .getById(props?.props?.MasterTaskListID)
      .items
      .select("ID", "Id", "Title", "PortfolioLevel", "PortfolioStructureID", "ItemRank", "Portfolio_x0020_Type",
        "DueDate", "Item_x0020_Type", "ItemType", "Short_x0020_Description_x0020_On", "PriorityRank", "Priority",
        "PercentComplete", "AssignedToId", "Created", "Modified", "Parent/Id", "Parent/Title", "Parent/ItemType", "PortfoliosId", "Portfolios/Id", "Portfolios/Title", "PortfolioType/Id", "PortfolioType/Title","PortfolioType/Color"
      )
      .expand("Parent", "Portfolios", "PortfolioType")
      .getAll();

    const undefinedAllData = componentDetails.filter((item: any) => item.PortfolioStructureID === null || (item.PortfolioStructureID && item.PortfolioStructureID.includes("undefined")))
    setAllMasterData(undefinedAllData)

    const ComponentChildData = undefinedAllData?.filter((item: any) => item.Portfolio_x0020_Type === "Component" && (item.Item_x0020_Type && item.Item_x0020_Type.includes("Component")) || (item.Item_x0020_Type && item.Item_x0020_Type.includes("Component Category")) || (item.Item_x0020_Type && item.Item_x0020_Type.includes("SubComponent")) || (item.Item_x0020_Type && item.Item_x0020_Type.includes("Feature")))
    setAllComponentData(ComponentChildData)

    const SubcomponentChildData = undefinedAllData.filter((itemss: any) => itemss.Portfolio_x0020_Type == "SubComponent" && ((itemss.Item_x0020_Type && itemss.Item_x0020_Type.includes("SubComponent")) || (itemss.Item_x0020_Type && itemss.Item_x0020_Type.includes("Feature"))))
    setAllSubComponentData(SubcomponentChildData)

    const featureData = undefinedAllData.filter((itemm: any) => itemm.Portfolio_x0020_Type == "Feature" && (itemm.Item_x0020_Type && itemm.Item_x0020_Type.includes("Feature")))
    setAllFeatureData(featureData)

    let totalData = ComponentChildData.concat(SubcomponentChildData);
    console.log("totalDataAllComponent shown is", totalData);

    let totalDataas = totalData.concat(featureData);
    console.log(" shown is", totalDataas);

    let totalll = totalDataas
    console.log("Total data shown is", totalll);
    setAllData(totalll)

    totalll.forEach((result: any) => {
      allCSFdata?.map((type: any) => {
        if ((result?.Item_x0020_Type === type.Title) && ((result.PortfolioType == undefined) || (result.PortfolioType != undefined))) {
          type[type.Title + 'number'] += 1;
          type[type.Title + 'filterNumber'] += 1;
          allCSFcount.push(type)
        }
      })
    })
    const portfolioLabelCountBackup: any = JSON.parse(JSON.stringify(allCSFdata));
    setPortFolioTypeIcon(portfolioLabelCountBackup);
  }
  console.log("data show", allMasterData);

  const editComponentPopUp = (item: any) => {
    setIsComponent(true);
    setPortfoliotyped(item?.PortfolioType?.Title)
    setSharewebComponent(item);
  };
  const EditComponentCallback = (item: any) => {
    setIsComponent(false);
  };

  const column = React.useMemo<ColumnDef<any, unknown>[]>(
    () => [
      {
        accessorKey: "",
        placeholder: "",
        hasCheckbox: true,
        size: 10,
        id: "row.original",
        // hasCustomExpanded: true,
        // hasExpanded: false,
        // isHeaderNotAvlable:isHeaderNotAvlable,
        // id: 'Id',
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
                href={props?.props?.siteUrl +
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
        id: "ParentTitle",
        resetColumnFilters: false,
        resetSorting: false,
        size: 125,
        cell: ({ row, getValue }) => (
          <>
            <span>
              {(row?.original?.Parent?.Title) &&
                <a
                  className="hreflink"
                  href={props?.props?.siteUrl +
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
        id: "ParentItemType",
        resetColumnFilters: false,
        resetSorting: false,
        size: 125,
        cell: ({ row, getValue }) => (
          <>{row?.original?.Parent?.ItemType}</>
        ),
      },
      {
        accessorKey: '',
        canShort: false,
        placeholder: '',
        header: '',
        id: 'row.original',
        // id: 'Id',
        size: 30,
        cell: ({ row, getValue }) => (
          <div className='text-end'>
            <a onClick={() => editComponentPopUp(row?.original)}><span title="Edit Task" className='alignIcon svg__iconbox svg__icon--edit hreflink'></span></a>
            {getValue}
          </div>
        ),
      },

    ],
    [data]
  );

  const callBackData = React.useCallback((elem: any, ShowingData: any) => {

  }, []);

  const findPortFolioIconsAndPortfolio = async () => {
    try {
      let newarray: any = [];
      const ItemTypeColumn = "Item Type";
      console.log("Fetching portfolio icons...");
      const field = await new Web(props?.props?.siteUrl)
        .lists.getById(props?.props?.MasterTaskListID)
        .fields.getByTitle(ItemTypeColumn)
        .get();
      console.log("Data fetched successfully:", field?.Choices);

      if (field?.Choices?.length > 0 && field?.Choices != undefined) {
        field?.Choices?.forEach((obj: any) => {
          if (obj != undefined) {
            let Item: any = {};
            Item.Title = obj;
            Item[obj + 'number'] = 0;
            Item[obj + 'filterNumber'] = 0;
            Item[obj + 'numberCopy'] = 0;
            newarray.push(Item);
          }
        })
        if (newarray.length > 0) {
          newarray = newarray.filter((findShowPort: any) => {
            let match = portfolioTypeConfrigration.find((config: any) => findShowPort.Title === config.Title);
            if (match) {
              findShowPort.Level = match?.Level;
              findShowPort.Suffix = match?.Suffix;
              return true
            }
            return false
          });
        }
        console.log("Portfolio icons retrieved:", newarray);
        // setPortFolioTypeIcon(newarray);
        allCSFdata = newarray
      }
    } catch (error) {
      console.error("Error fetching portfolio icons:", error);
    }
  };

  return (
    <section className='TableSection'>
      <div className='Alltable mt-2'>
        <div className='smart'>
          <div className='wrapper'>
            <div className="col-sm-12 clearfix mb-2">
              <h2 className="d-flex justify-content-between align-items-center siteColor serviceColor_Active">
                <div style={{ color: 'rgb(0, 0, 102)' }}>Portfolio Tag Wrong Parent</div>
              </h2>
            </div>
            {allData ? <div><GlobalCommanTable
              columns={column} data={allData} callBackData={callBackData} AllListId={ContextValue} exportToExcel={true} showHeader={true} showingAllPortFolioCount={true} fixedWidth={true} pageName={"ProjectOverviewGrouped"} portfolioTypeData={portfolioTypeDataItem} />
              {IsComponent && (
              <EditInstituton
                item={SharewebComponent}
                Calls={EditComponentCallback}
                SelectD={listIds}
                // portfolioTypeData={Portfoliotyped}
              >
                {" "}
              </EditInstituton>
            )}
            </div> : ""}
          </div>
        </div>
      </div>
    </section>
  );

}
export default AllMasterTaskLoad;
