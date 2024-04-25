import React, { useState, useRef } from "react";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  Controls,
  useEdgesState,
  useNodesState
} from "reactflow";
import "./styles.css";
import { toJpeg } from 'html-to-image';
import 'reactflow/dist/style.css';
import { Panel, PanelType } from 'office-ui-fabric-react'
import Button from 'react-bootstrap/Button';
import * as globalCommon from "../../../globalComponents/globalCommon";
import { myContextValue } from "../../../globalComponents/globalCommon";

import EditInstitution from "../../EditPopupFiles/EditComponent";
import EditProjectPopup from "../../../globalComponents/EditProjectPopup";
import CustomNode from "./customNode";
let id = 0;
const getId = () => `dndnode_${id++}`;
let AllListId: any = {
  // siteUrl: 'https://hhhhteams.sharepoint.com/sites/HHHH/SP',
  // MasterTaskListID: 'ec34b38f-0669-480a-910c-f84e92e58adf',
  // TaskUsertListID: 'b318ba84-e21d-4876-8851-88b94b9dc300',
  // SmartMetadataListID: '01a34938-8c7e-4ea6-a003-cee649e8c67a',
  // SmartInformationListID: 'edf0a6fb-f80e-4772-ab1e-666af03f7ccd',
  // DocumentsListID: 'd0f88b8f-d96d-4e12-b612-2706ba40fb08',
  // TaskTimeSheetListID: '464fb776-e4b3-404c-8261-7d3c50ff343f',
  // AdminConfigrationListID: 'e968902a-3021-4af2-a30a-174ea95cf8fa',
  // PortFolioTypeID: 'c21ab0e4-4984-4ef7-81b5-805efaa3752e',
  // TimeEntry: false,
  // SiteCompostion: false,
}
export default function FlowCreationCanvas(props: any) {
  const initialNodes: any = [
    { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
  ];
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const nodeTypes = {
    customNode: CustomNode,
  };
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [IsComponent, setIsComponent] = React.useState(false);
  const [IsProjectPopup, setIsProjectPopup] = React.useState(false);
  const [CMSToolComponent, setCMSToolComponent]: any = React.useState({});
  const Callbackfrompopup = () => {
    setCMSToolComponent({})
    setIsComponent(false)
    setIsProjectPopup(false)
  }
  const EditComponentPopup = (event: any, item: any) => {
    event.stopPropagation();
    setCMSToolComponent(item)
    if (item?.ItemCat == "Portfolio") {
      setIsComponent(true)
    }
    if (item?.ItemCat == "Project") {
      setIsProjectPopup(true)
    }
  }
  // const [elements, setElements] = useState(initialNodes);
  const onConnect = React.useCallback((params: any) => setEdges((eds: any) => addEdge(params, eds)), [setEdges]);
  const onLoad = (_reactFlowInstance: any) =>
    setReactFlowInstance(_reactFlowInstance);
  const onDragOver = (event: any) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };
  React.useEffect(() => {
    let isShowTimeEntry: any = false
    let isShowSiteCompostion: any = false
    try {
      isShowTimeEntry = props?.props?.TimeEntry != "" ? JSON.parse(props?.props?.TimeEntry) : "";
      isShowSiteCompostion = props?.props?.SiteCompostion != "" ? JSON.parse(props?.props?.SiteCompostion) : ""
    } catch (error: any) {
      console.log(error)
    }
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
      isShowTimeEntry: isShowTimeEntry,
      isShowSiteCompostion: isShowSiteCompostion,
      PortFolioTypeID: props?.props?.PortFolioTypeID,
      Context: props?.props?.Context,
      SmartHelpListID: props?.props?.SmartHelpListID,
      TaskTypeID: props?.props?.TaskTypeID
    }
    loadComponentDetails()
  }, []);
  const loadComponentDetails = async (compId?: any) => {

    try {
      const params = new URLSearchParams(window.location.search)
      let itemId = params.get('ItemId')
      let itemType = params.get('ItemType');
      let foundComp: any = {};
      const result = await globalCommon.GetServiceAndComponentAllData(AllListId)
      if (itemType == 'Portfolio' && result?.AllData?.length > 0 && itemId != undefined) {
        foundComp = result?.AllData?.find((portfolio: any) => portfolio?.Id == itemId);
      } else if (itemType == 'Project' && result?.FlatProjectData?.length > 0 && itemId != undefined) {
        foundComp = result?.FlatProjectData?.find((portfolio: any) => portfolio?.Id == itemId);
      }
      if (foundComp?.Id != undefined) {
        if (itemType == 'Portfolio' && result?.AllData?.length > 0 && itemId != undefined) {
          const groupedResult = globalCommon?.componentGrouping(foundComp, result?.AllData);
          console.log(groupedResult?.comp)
          const flowRes = generateNodesAndEdges(groupedResult?.comp);
          setNodes(flowRes?.nodes)
          setEdges(flowRes?.edges)
        } else if (itemType == 'Project' && result?.FlatProjectData?.length > 0 && itemId != undefined) {
          const groupedResult = globalCommon?.componentGrouping(foundComp, result?.FlatProjectData);
          console.log(groupedResult?.comp)
          const flowRes = generateNodesAndEdges(groupedResult?.comp);
          setNodes(flowRes?.nodes)
          setEdges(flowRes?.edges)
        }

      }

    } catch (e) {

    }
  }
  function generateNodesAndEdges(data: any) {
    let nodes: any = [];
    let edges: any = [];
    let minimumSpacing = 30
    const levelColors = ['#e7e6e6', '#f1f1f1', '#C0C0C0', '#D3D3D3', '#E0E0E0']; // Define colors for each level

    // Function to calculate the width and total width of a subtree
    // function calculateSubTreeWidths(subRows: any) {
    //   if (!subRows || subRows.length === 0) return { maxWidth: 0, totalWidth: 1, centerX: 0 };

    //   const widths = subRows.map((row: any) => {
    //     const childWidths = calculateSubTreeWidths(row.subRows);
    //     return Math.max(childWidths.maxWidth, 1) + 30; // Consider node width + 30
    //   });

    //   const maxWidth = Math.max(...widths);
    //   const totalWidth = widths.reduce((sum: any, width: any) => sum + width, 0);
    //   const centerX = totalWidth / 2;

    //   return { maxWidth, totalWidth, centerX };
    // }

    // Recursive function to process subRows
    function processSubRows(subRows: any, parentId: any, parentY: any, level: any, parentCenterX?: number, individualWidth?: any) {
      // Handle undefined parentX and individualWidth
      parentCenterX = parentCenterX || 0; // Default to 0 if not provided
      // Default to 0 if not provided

      let accumulatedWidth = 0; // Track cumulative width of processed siblings
      let subRowsY = parentY;
      let childLevel = individualWidth;
      // if (subRows?.length > 0) {
      //   let startingToBe = individualWidth * subRows?.length;
      //   startingToBe = startingToBe / 2
      //   childLevel = startingToBe;
      // }

      subRows.forEach((row: any, index: any) => {
        const nodeId = `${parentId}-${row.Id}`;
        let type = 'customNode';

        let handles: any = {}
        handles.top = true
        if (!row.subRows || row?.subRows?.length === 0) {
          handles.bottom = false
        } else {
          handles.bottom = true
        }

        // Calculate x position based on parent center, accumulated width, and spacing
        let x = 0;
        // Update accumulated width after positioning
        accumulatedWidth += minimumSpacing;
        let y = 0
        if (level % 2 == 0) {
          y = subRowsY += 100
          x = parentCenterX
        } else {
          y = parentY + 100;
          x = childLevel;
          childLevel += 170
        }
        parentY + 100; // Adjust the vertical spacing here
        const backgroundColor = levelColors[level % levelColors?.length]; // Assign color based on level
        nodes.push({
          id: nodeId,
          type,
          handles,
          data: {
            AllListId,
            handles,
            item: row,
          },
          position: { x, y }, // Remove duplicate position property
          style: { backgroundColor: backgroundColor },
        });

        if (parentId) {
          edges.push({
            id: `edge-${parentId}-${row?.Id}`,
            source: parentId,
            target: nodeId,
          });
        }

        if (row?.subRows && row?.subRows?.length > 0) {
          // Pass calculated values for sub-levels
          processSubRows(row.subRows, nodeId, y, level + 1, x, individualWidth); // Maintain hierarchy
        }
      });
    }

    const desiredCenterX = window.innerWidth / 2; // Adjust as needed
    // const initialSubTreeWidths = calculateSubTreeWidths(data?.subRows);
    const x = desiredCenterX;  // Centered at x = 0
    const parentY = 0; // Starting y position

    nodes.push({
      id: `${data?.Id}`,
      type: 'customNode',

      data: {
        AllListId,
        handles: {
          bottom: true,
        },
        item: data,
      },
      position: { x: x, y: parentY }, // Set x to calculated center
      style: { backgroundColor: levelColors[0] },
    });
    if (data?.subRows && data?.subRows?.length > 0) {
      let startPoint: any = data?.subRows?.length * 140
      startPoint = startPoint / 2
      startPoint = x - startPoint;
      // Pass initial values for first level processing
      processSubRows(data?.subRows, `${data?.Id}`, parentY, 1, x, startPoint); // Assuming equal width for root children
    }
    return { nodes: nodes, edges: edges };
  }

  const onDrop = (event: any) => {
    event.preventDefault();
    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    const type = event.dataTransfer.getData("application/reactflow");
    const position = {
      x: reactFlowBounds.x,
      y: reactFlowBounds.y
    };
    const newNode = {
      id: getId(),
      type,
      position,
      data: { label: `${type} node` }
    };
    setNodes((es: any) => es.concat(newNode));
  };
  const onDragStart = (event: any, nodeType: any) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };
  const exportAsJpg = () => {
    const flowContainer = document.getElementById('flow-container'); // Assuming 'flow-container' is the id of the div containing your React Flow diagram
    toJpeg(flowContainer)
      .then(function (dataUrl: any) {
        const link = document.createElement('a');
        link.download = 'flow-diagram.jpg';
        link.href = dataUrl;
        link.click();
      });
  };


  const onRenderCustomHeader = (
  ) => {
    return (
      <div className=" full-width pb-1" >
        {/* {props?.items != undefined && props?.items?.length == 1 &&
                    <div>
                        <ul className="spfxbreadcrumb mb-2 ms-2 p-0">
                            <li><a>Project Management</a></li>
                            <li>
                                {" "}
                                <a target='_blank' data-interception="off" href={`${props?.AllListId?.siteUrl}/SitePages/Project-Management.aspx?ProjectId=${props?.items[0]?.Id}`}>{props?.items[0]?.Title}</a>{" "}
                            </li>
                        </ul>
                    </div>
                } */}
        <div className="subheading">
          <span className="siteColor">
            Work flow
          </span>
        </div>
      </div>
    );
  };
  const closePopup = () => {
    props?.CallBack("Close")
  }

  return (
    <myContextValue.Provider value={{ ...myContextValue, AllListId: AllListId, EditComponentPopup: EditComponentPopup }}> <>
      <div className="dndflow" >
        <ReactFlowProvider>
          <div
            className="reactflow-wrapper"
            style={{ height: "600px", width: "600px" }}
            ref={reactFlowWrapper}
          >
            <ReactFlow id={'flow-container'}
              nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect}
              onLoad={onLoad} nodeTypes={nodeTypes}
              onDrop={onDrop}
              onDragOver={onDragOver}
            >
              <Controls />
            </ReactFlow>
          </div>




          {/* <aside>
            <div className="description">
              You can drag these nodes to the pane on the right.
            </div>
            <div
              className="dndnode input"
              onDragStart={(event) => onDragStart(event, "input")}
              draggable
            >
              Input Node
            </div>
            <div
              className="dndnode"
              onDragStart={(event) => onDragStart(event, "default")}
              draggable
            >
              Default Node
            </div>
            <div
              className="dndnode output"
              onDragStart={(event) => onDragStart(event, "output")}
              draggable
            >
              Output Node
            </div>
            <button onClick={exportAsJpg}>Export as JPG</button>

          </aside> */}

        </ReactFlowProvider>
      </div>
      {IsComponent && (
        <EditInstitution
          item={CMSToolComponent}
          Calls={Callbackfrompopup}
          SelectD={AllListId}
        >
          {" "}
        </EditInstitution>
      )}
      {IsProjectPopup && <EditProjectPopup props={CMSToolComponent} AllListId={AllListId} Call={Callbackfrompopup} > </EditProjectPopup>}
    </>  </myContextValue.Provider>
  );
}
export { myContextValue }
