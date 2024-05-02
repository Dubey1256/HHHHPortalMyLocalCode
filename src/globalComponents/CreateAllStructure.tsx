import * as React from "react";
import * as $ from "jquery";
import * as Moment from "moment";
import { Panel, PanelType } from "office-ui-fabric-react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Web, sp } from "sp-pnp-js";
import PageLoader from "./pageLoader";
let defaultPortfolioType = "";
let PortfoliotypeData: any = "";
let PortfolioColor: any = "";
let CurrentUserId: any = "";
let CurrentUserData: any = "";
let query: any = "";
let isDisable = false;
let isDisableSub = false;
let subCount = 0;
const CreateAllStructureComponent = (props: any) => {
  CurrentUserId =
    props?.PropsValue?.Context.pageContext?._legacyPageContext.userId;
  const [OpenAddStructurePopup, setOpenAddStructurePopup] =
    React.useState(true);
  const [count, setCount] = React.useState(0);
  const [loaded, setLoaded] = React.useState(true);
  const [components, setComponents] = React.useState<any>([
    {
      id: 1,
      value: "",
      isCheckedSub: false,
      isCheckedCompFea: false,
      Feature: [],
      SubComponent: [{ id: 1, value: "", Feature: [{ id: 1, value: "" }] }],
    },
  ]);
  const [Subcomponents, setSubComponents] = React.useState([
    { id: 1, value: "" },
  ]);
  const [Feature, setFeature] = React.useState([{ id: 1, value: "" }]);

  query = window.location.search;
  const urlParams = new URLSearchParams(query);
  const portfolioType = urlParams.get("PortfolioType");
  if (
    portfolioType !== undefined &&
    portfolioType != null &&
    portfolioType != ""
  ) {
    defaultPortfolioType = portfolioType;
  } else {
    defaultPortfolioType = "Component";
  }
  React.useEffect(() => {
    if (props.SelectedItem != undefined) {
      if (props.SelectedItem.PortfolioType?.Title == "Component") {
        components?.forEach((item: any) => {
          item.value = props.SelectedItem?.Title;
          item.id = props.SelectedItem?.Id;
        });
        setCount(count + 1);
      }
      if (props.SelectedItem.PortfolioType?.Title == "SubComponent") {
        isDisableSub = true;
        defaultPortfolioType = "";
        setCount(count + 1);
      }
    }
  }, []);

  const handleAddComponent = () => {
    const newComponent = { id: components.length + 1, value: "" };
    setComponents([...components, newComponent]);
  };

  const handleAddSubComponent = (
    componentIndex: any,
    subComIndex: any,
    FeaIndex: any,
    Type: any
  ) => {
    if (Type === "Component") {
      let newComponent = {};
      if (
        props?.SelectedItem?.Item_x0020_Type != "SubComponent" &&
        props?.SelectedItem != undefined
      ) {
        newComponent = {
          id: componentIndex + 2,
          value: "",
          isCheckedSub: false,
          isCheckedCompFea: false,
          Feature: [] as any,
          SubComponent: [
            {
              id: components[componentIndex].SubComponent.length + 1,
              value: "",
            },
          ] as any,
        };
      } else {
        newComponent = {
          id: componentIndex + 2,
          value: "",
          isCheckedSub: false,
          isCheckedCompFea: false,
          Feature: [] as any,
          SubComponent: [] as any,
        };
      }

      setComponents([...components, newComponent]);
    } else if (Type === "SubComponent") {
      const newSubComponent = {
        id: components[componentIndex].SubComponent.length + 1,
        isCheckedSub: true,
        isCheckedSubFea: false,
        value: "",
        Feature: [] as any,
      };
      const updatedComponents = [...components];
      updatedComponents[componentIndex].SubComponent.push(newSubComponent);
      setComponents(updatedComponents);
    } else if (Type === "Feature" || Type === "ComponentFeature") {
      const newFeature = { id: FeaIndex + 2, value: "" };
      const updatedComponents = [...components];
      if (subComIndex !== 0 || Type === "Feature") {
        updatedComponents[componentIndex].SubComponent[
          subComIndex
        ].Feature.push(newFeature);
      } else {
        updatedComponents[componentIndex].Feature.push(newFeature);
      }
      setComponents(updatedComponents);
    }
  };

  const handleInputChange = (
    index: any,
    Subindex: any,
    Feaindex: any,
    event: any,
    type: any
  ) => {
    if (type == "component") {
      const newComponents = [...components];
      newComponents[index].value = event.target.value;
      setComponents(newComponents);
    }
    if (type == "subcomponent") {
      const newSubComponents = [...components];
      newSubComponents[index].SubComponent[Subindex].value = event.target.value;
      setComponents(newSubComponents);
    }
    if (type === "feature" || type === "ComponentFeature") {
      const Features = [...components];
      if (Subindex !== 0 || type === "feature") {
        Features[index].SubComponent[Subindex].Feature[Feaindex].value =
          event.target.value;
      } else {
        Features[index].Feature[Feaindex].value = event.target.value;
      }
      setComponents(Features);
    }
  };

  const handleDelete = (
    index: any,
    subIndex: any,
    FeaIndex: any,
    type: any
  ) => {
    const updatedComponents = [...components];
    if (type === "component") {
      updatedComponents.splice(index, 1);
    } else if (type === "subcomponent") {
      updatedComponents[index].SubComponent.splice(subIndex, 1);
      if (updatedComponents[index].SubComponent.length < 1) {
        updatedComponents[index].isCheckedSub = false;
      }
    } else if (type === "feature" || type === "ComponentFeature") {
      if (subIndex !== 0 || type === "feature") {
        updatedComponents[index].SubComponent[subIndex].Feature.splice(
          FeaIndex,
          1
        );
        if (
          updatedComponents[index].SubComponent[subIndex].Feature.length < 1
        ) {
          updatedComponents[index].SubComponent[subIndex].isCheckedSubFea =
            false;
        }
      } else {
        updatedComponents[index].Feature.splice(FeaIndex, 1);
        if (updatedComponents[index].Feature.length < 1) {
          updatedComponents[index].isCheckedCompFea = false;
        }
      }
    }
    setComponents(updatedComponents);
  };

  const handleSave = async () => {
    setLoaded(false);
    props?.taskUser.map((val: any) => {
      if (val.AssingedToUser?.Id == CurrentUserId) {
        CurrentUserData = val;
      }
    });
    try {
      const hierarchyData = [];
      let count = 0;
      // Save components
      for (const component of components) {
        if (props.SelectedItem != undefined) {
          let array: any = [];
          CheckPortfolioType(props.SelectedItem.PortfolioType);
          array.push(props.SelectedItem);
          var PortfolioStructureId = array;
        } else {
          var PortfolioStructureId = await getPortfolioStructureId(
            "Component",
            "data"
          );
        }

        let level = PortfolioStructureId[0]?.PortfolioLevel + 1;
        let PortfolioStr = "C" + level;
        const componentItem = {
          Item_x0020_Type: "Component",
          Title: component?.value,
          PortfolioTypeId: PortfoliotypeData != "" ? PortfoliotypeData?.Id : 1,
          PortfolioLevel: level,
          PortfolioStructureID: PortfolioStr,
        };

        if (props.SelectedItem != undefined) {
          var createdComponent = props.SelectedItem;
        } else {
          var createdComponent = await createListItem(
            "Master Tasks",
            componentItem
          );
        }

        //save features of Component
        var compFeatures: any = [];
        for (const feature of component?.Feature) {
          let FeaPortfolioStr = "";
          let fealevel: any = "";

          const PortfolioStructureIdFea = await getPortfolioStructureId(
            "Feature",
            createdComponent
          );
          if (
            PortfolioStructureIdFea.length == 0 ||
            PortfolioStructureIdFea == undefined
          ) {
            fealevel = 1;

            FeaPortfolioStr =
              createdComponent.PortfolioStructureID + "-" + "F" + fealevel;
          } else {
            const parts =
              PortfolioStructureIdFea[0]?.PortfolioStructureID.split("-");
            const prefix = parts[0];
            const currentValue = parseInt(parts[1].substring(1));
            const newValue = currentValue + 1;
            FeaPortfolioStr = `${prefix}-S${newValue}`;
            fealevel = PortfolioStructureIdSub[0]?.PortfolioLevel + 1;
          }
          // else {
          //     fealevel = PortfolioStructureIdFea[0].PortfolioLevel + 1
          //     if(props.SelectedItem != undefined){
          //         FeaPortfolioStr = props.SelectedItem?.PortfolioStructureID + '-' + 'F' + fealevel
          //     }
          //     else{
          //         if(PortfolioStructureIdFea[0]?.Item_x0020_Type == 'SubComponent'){
          //             FeaPortfolioStr = PortfolioStructureIdFea[0]?.PortfolioStructureID + '-' + 'F' + fealevel
          //         }
          //         else{
          //             FeaPortfolioStr = createdSubcomponent?.PortfolioStructureID + '-' + 'F' + fealevel
          //         }

          //     }

          // }
          count++;
          const ComponentfeatureItem: any = {
            Item_x0020_Type: "Feature",
            Title: feature.value,
            ParentId: createdComponent?.Id, // Use the ID of the created subcomponent as ParentId
            PortfolioLevel: fealevel,
            PortfolioStructureID: FeaPortfolioStr,
            PortfolioTypeId:
              PortfoliotypeData != "" ? PortfoliotypeData?.Id : 1,
          };

          // Create feature item in SharePoint list

          const featuredata = await createListItem(
            "Master Tasks",
            ComponentfeatureItem
          );

          const mydata =
            createdComponent == undefined || createdComponent.length == 0
              ? createdComponent
              : "";
          // Add feature to the features array
          if (ComponentfeatureItem.Title != "") {
            compFeatures.push({
              Id: featuredata?.Id,
              ID: featuredata?.Id,
              Title: ComponentfeatureItem?.Title,
              siteType: "Master Tasks",
              SiteIconTitle: featuredata?.Item_x0020_Type?.charAt(0),
              TaskID: featuredata?.PortfolioStructureID,
              Created: Moment(ComponentfeatureItem?.Created).format(
                "DD/MM/YYYY"
              ),
              DisplayCreateDate: Moment(ComponentfeatureItem?.Created).format(
                "DD/MM/YYYY"
              ),
              Author: {
                Id: featuredata?.AuthorId,
                Title: CurrentUserData?.Title,
                autherImage: CurrentUserData?.Item_x0020_Cover?.Url,
              },
              PortfolioType: PortfoliotypeData,
              PortfolioStructureID: featuredata?.PortfolioStructureID,
              Item_x0020_Type: "Feature",
            });
          }
        }

        // Save subcomponents
        const subcomponents = [];
        for (const subcomponent of component?.SubComponent) {
          let Sublevel: any = "";
          let SubPortfolioStr = "";
          // if (props.SelectedItem?.PortfolioType != undefined) {
          //     let array: any = []
          //     CheckPortfolioType(props.SelectedItem.PortfolioType)
          //     array.push(props.SelectedItem)
          //     var PortfolioStructureId = array
          // }

          var PortfolioStructureIdSub = await getPortfolioStructureId(
            "SubComponent",
            createdComponent
          );
          console.log(PortfolioStructureIdSub);
          if (PortfolioStructureIdSub.length == 0) {
            Sublevel = 1;
            SubPortfolioStr =
              createdComponent?.PortfolioStructureID + "-" + "S" + Sublevel;
          } else {
            const parts =
              PortfolioStructureIdSub[0]?.PortfolioStructureID.split("-");
            const prefix = parts[0];
            const currentValue = parseInt(parts[1].substring(1)); // Extract the numeric part and parse it to an integer
            const newValue = currentValue + 1;
            SubPortfolioStr = `${prefix}-S${newValue}`;
            Sublevel = PortfolioStructureIdSub[0]?.PortfolioLevel + 1;
          }

          let subcomponentItem: any = {
            Item_x0020_Type: "SubComponent",
            Title: subcomponent.value,
            ParentId: createdComponent?.Id, // Use the ID of the created component as ParentId
            PortfolioLevel: Sublevel,
            PortfolioStructureID: SubPortfolioStr,
            PortfolioTypeId:
              PortfoliotypeData != "" ? PortfoliotypeData?.Id : 1,
          };

          // Create subcomponent item in SharePoint list

          const createdSubcomponent = await createListItem(
            "Master Tasks",
            subcomponentItem
          );

          // Save features of Subcomponent
          var subCompFeatures: any = [];
          for (const feature of subcomponent?.Feature) {
            let FeaPortfolioStr = "";
            let fealevel: any = "";
            const mydaya =
              createdSubcomponent == undefined ||
              createdSubcomponent.length == 0
                ? createdComponent
                : createdSubcomponent;
            const PortfolioStructureIdFea = await getPortfolioStructureId(
              "Feature",
              mydaya
            );
            if (
              PortfolioStructureIdFea.length == 0 ||
              PortfolioStructureIdFea == undefined
            ) {
              fealevel = 1;
              if (
                createdSubcomponent == undefined ||
                createdSubcomponent.length == 0
              ) {
                FeaPortfolioStr =
                  createdComponent.PortfolioStructureID + "-" + "F" + fealevel;
              } else {
                FeaPortfolioStr =
                  createdSubcomponent?.PortfolioStructureID +
                  "-" +
                  "F" +
                  fealevel;
              }
            } else {
              fealevel = PortfolioStructureIdFea[0].PortfolioLevel + 1;
              if (props.SelectedItem != undefined) {
                FeaPortfolioStr =
                  props.SelectedItem?.PortfolioStructureID +
                  "-" +
                  "F" +
                  fealevel;
              } else {
                if (
                  PortfolioStructureIdFea[0]?.Item_x0020_Type == "SubComponent"
                ) {
                  FeaPortfolioStr =
                    PortfolioStructureIdFea[0]?.PortfolioStructureID +
                    "-" +
                    "F" +
                    fealevel;
                } else {
                  FeaPortfolioStr =
                    createdSubcomponent?.PortfolioStructureID +
                    "-" +
                    "F" +
                    fealevel;
                }
              }
            }
            count++;
            const featureItem: any = {
              Item_x0020_Type: "Feature",
              Title: feature.value,
              ParentId:
                createdSubcomponent == undefined
                  ? createdComponent.Id
                  : createdSubcomponent.Id, // Use the ID of the created subcomponent as ParentId
              PortfolioLevel: fealevel,
              PortfolioStructureID: FeaPortfolioStr,
              PortfolioTypeId:
                PortfoliotypeData != "" ? PortfoliotypeData?.Id : 1,
            };

            // Create feature item in SharePoint list

            const featuredata = await createListItem(
              "Master Tasks",
              featureItem
            );

            // Add feature to the features array
            if (featureItem.Title != "") {
              subCompFeatures.push({
                Id: featuredata?.Id,
                ID: featuredata?.Id,
                Title: featureItem?.Title,
                siteType: "Master Tasks",
                SiteIconTitle: featuredata?.Item_x0020_Type?.charAt(0),
                TaskID: featuredata?.PortfolioStructureID,
                Created: Moment(featureItem?.Created).format("DD/MM/YYYY"),
                DisplayCreateDate: Moment(featureItem?.Created).format(
                  "DD/MM/YYYY"
                ),
                Author: {
                  Id: featureItem?.AuthorId,
                  Title: CurrentUserData?.Title,
                  autherImage: CurrentUserData?.Item_x0020_Cover?.Url,
                },
                PortfolioType: PortfoliotypeData,
                PortfolioStructureID: featuredata?.PortfolioStructureID,
                Item_x0020_Type: "Feature",
              });
            }
          }

          // Add subcomponent with features to the subcomponents array
          if (createdSubcomponent != undefined) {
            subcomponents.push({
              Id:
                createdSubcomponent != undefined
                  ? createdSubcomponent?.Id
                  : createdComponent?.Id,
              ID:
                createdSubcomponent != undefined
                  ? createdSubcomponent?.Id
                  : createdComponent?.Id,
              Title:
                createdSubcomponent != undefined
                  ? createdSubcomponent?.Title
                  : createdComponent?.Title,
              subCompFeatures,
              siteType: "Master Tasks",
              SiteIconTitle: createdSubcomponent?.Item_x0020_Type?.charAt(0),
              TaskID: createdSubcomponent?.PortfolioStructureID,
              Created: Moment(createdSubcomponent?.Created).format(
                "DD/MM/YYYY"
              ),
              DisplayCreateDate: Moment(createdSubcomponent?.Created).format(
                "DD/MM/YYYY"
              ),
              Author: {
                Id: createdSubcomponent?.AuthorId,
                Title: CurrentUserData?.Title,
                autherImage: CurrentUserData?.Item_x0020_Cover?.Url,
              },
              PortfolioType: PortfoliotypeData,
              PortfolioStructureID: createdSubcomponent?.PortfolioStructureID,
              Item_x0020_Type: "SubComponent",
            });
          }
        }

        // Add component with subcomponents to the hierarchyData array
        hierarchyData.push({
          Id: createdComponent?.Id,
          ID: createdComponent?.Id,
          Title: createdComponent?.Title,
          subcomponents,
          compFeatures,
          siteType: "Master Tasks",
          SiteIconTitle: createdComponent?.Item_x0020_Type?.charAt(0),
          TaskID: createdComponent?.PortfolioStructureID,
          PortfolioStructureID: createdComponent?.PortfolioStructureID,
          Created: Moment(createdComponent?.Created).format("DD/MM/YYYY"),
          DisplayCreateDate: Moment(createdComponent?.Created).format(
            "DD/MM/YYYY"
          ),
          Author: {
            Id: createdComponent?.AuthorId,
            Title: CurrentUserData?.Title,
            autherImage: CurrentUserData?.Item_x0020_Cover?.Url,
          },
          PortfolioType: PortfoliotypeData,
          Item_x0020_Type: "Component",
        });
      }
      hierarchyData?.forEach((val: any) => {
        if (props.SelectedItem != undefined) {
          val.SelectedItem = props.SelectedItem.Id;
        }
        if (val.subcomponents != undefined && val.subcomponents.length > 0) {
          val.subRows = val?.subcomponents;
          val.subcomponents.forEach((b: any) => {
            b.subRows = b?.features;
            // b?.features.forEach((fea: any) => {
            // })
          });
        }
        else {
          if (props.SelectedItem != undefined) {
            //val.subRows = val.subRows === undefined ? [] : val?.subRows
            val.subRows=subCompFeatures;
          }
        }
        if (val.compFeatures != undefined && val.compFeatures.length > 0) {
          val.subRows = val?.compFeatures;
        }
      });
      // hierarchyData?.forEach((val: any) => {

      //     if (props.SelectedItem !== undefined) {
      //         val.SelectedItem = props.SelectedItem.Id;
      //     }

      //     val.subRows = [];

      //     if (val.subcomponents && val.subcomponents.length > 0) {
      //         val.subcomponents.forEach((subComp: any) => {

      //             if (subComp.subCompFeatures && subComp.subCompFeatures.length > 0) {
      //                 subComp.subRows = subComp.subCompFeatures;
      //             }
      //         });

      //         val.subRows = val.subRows.concat(val.subcomponents);
      //     }

      //     if (val.compFeatures && val.compFeatures.length > 0) {

      //         val.subRows = val.subRows.concat(val.compFeatures);
      //     }
      // });
      props.Close(hierarchyData);
      defaultPortfolioType = "";
      setLoaded(true);
      alert("Hierarchy saved successfully!");
    } catch (error) {
      console.error("Error saving hierarchy:", error);
      alert("Error saving hierarchy. Please check the console for details.");
    }
  };

  const createListItem = async (listName: string, item: any) => {
    if (item.Title != "") {
      try {
        let web = new Web(props?.PropsValue?.siteUrl);
        const result = await web.lists.getByTitle(listName).items.add(item);
        return result.data;
      } catch (error) {
        throw new Error(`Failed to create item in the list. Error: ${error}`);
      }
    }
  };

  const getPortfolioStructureId = async (type: any, item: any) => {
    var filter = "";
    if (type == "Component") {
      filter = "Item_x0020_Type eq 'Component'";
    } else {
      filter =
        "Parent/Id eq '" + item?.Id + "' and Item_x0020_Type eq '" + type + "'";
      //filter = "Parent/Id eq '" + item.Id
    }

    let web = new Web(props?.PropsValue?.siteUrl);
    let results = await web.lists
      .getByTitle("Master Tasks")
      .items.select(
        "Id",
        "Title",
        "PortfolioLevel",
        "Item_x0020_Type",
        "PortfolioStructureID",
        "Parent/Id",
        "PortfolioType/Id",
        "PortfolioType/Title"
      )
      .expand("Parent,PortfolioType")
      .filter(filter)
      .orderBy("PortfolioLevel", false)
      .top(1)
      .get();
    console.log(results);
    return results;
  };

  const handleFeatureChange = (
    index: any,
    subIndex: any,
    component: any,
    Subcomponent: any,
    isFeatureForSubComp: any
  ) => {
    // if(Subcomponent!==0 && isFeatureForSubComp===true )
    //     {
    //         Subcomponent.Feature.pop();
    //     }
    //     if(component.isCheckedSub===false && isFeatureForSubComp===false){
    //         component.Feature.pop()
    //     }

    if (index === 0) {
      if (
        component.isCheckedSub == true ||
        props?.SelectedItem?.PortfolioType?.Title == "Component"
      ) {
        if (
          Subcomponent.Feature.length == 0 ||
          Subcomponent.Feature == undefined
        ) {
          Subcomponent.Feature.push({ id: 1, value: "" });
          Subcomponent.isCheckedSubFea = true;
        } else {
          Subcomponent.isCheckedSubFea = true;
        }
      } else {
        if (component.Feature.length === 0) {
          component.Feature.push({ id: 1, value: "" });
          component.isCheckedCompFea = true;
        } else {
          component.isCheckedCompFea = true;
        }
      }

      setCount(count + 1);
    } else {
      if (component.isCheckedSub == true && isFeatureForSubComp) {
        if (Subcomponent.Feature.length === 0) {
          Subcomponent.Feature.push({ id: 1, value: "" });
          Subcomponent.isCheckedSubFea = true;
        } else {
          Subcomponent.isCheckedSubFea = true;
        }
      } else {
        component.Feature.push({ id: 1, value: "" });
        component.isCheckedCompFea = true;
      }

      setCount(count + 1);
    }
  };
  const handleSubComponentChange = (index: any, component: any) => {
    // component.SubComponent.pop();
    if (index == 0) {
      if (component.SubComponent.length === 0) {
        component.isCheckedSub = true;
        component.SubComponent.push({
          id: 1,
          isCheckedSub: true,
          value: "",
          Feature: [{ id: 1, value: "" }],
        });
      } else {
        component.isCheckedSub = true;
      }
      setCount(count + 1);
    } else {
      component.SubComponent.push({
        id: component.SubComponent.length + 1,
        isCheckedSub: true,
        value: "",
        Feature: [{ id: 1, value: "" }],
      });
      component.isCheckedSub = true;
      setCount(count + 1);
    }
  };
  // const handleSubComponentChange = (componentIndex: number) => {

  //     const updatedComponents = components.map((component:any, index:any) => {
  //         if (index === componentIndex) {

  //             const updatedComponent = { ...component };
  //             const newSubComponentId = updatedComponent.SubComponent.length + 1;
  //             const newSubComponent = {
  //                 id: newSubComponentId,
  //                 isCheckedSub: true,
  //                 value: '',
  //                 Feature: [{ id: 1, value: '' }]
  //             };
  //             updatedComponent.SubComponent = [...updatedComponent.SubComponent, newSubComponent];
  //             updatedComponent.isCheckedSub = true;
  //             return updatedComponent;
  //         }
  //         return component;
  //     });

  //     setComponents(updatedComponents);
  //     setCount(prevCount => prevCount + 1);
  // };
  const CheckPortfolioType = (item: any) => {
    PortfoliotypeData = item;
    PortfolioColor = item?.Color;
    defaultPortfolioType = item?.Title;
    setCount(count + 1);
  };
  return (
    <>
      <div
        className={
          defaultPortfolioType == "Events"
            ? "eventpannelorange"
            : defaultPortfolioType == "Service" ||
              defaultPortfolioType == "Service Portfolio"
            ? "serviepannelgreena"
            : "component Portfolio clearfix"
        }
      >
        <div className="modal-body ">
          {props?.SelectedItem == undefined && (
            <>
              <label>
                <b>Select Portfolio type</b>
              </label>
              <div className="d-flex">
                {props?.portfolioTypeData.map((item: any) => {
                  return (
                    <div className="mb-2 mt-2">
                      <label className="SpfxCheckRadio">
                        <input
                          className="radio"
                          defaultChecked={
                            defaultPortfolioType.toLowerCase() ===
                            item.Title.toLowerCase()
                          }
                          name="PortfolioType"
                          type="radio"
                          onClick={() => CheckPortfolioType(item)}
                        ></input>
                        {item.Title}
                      </label>
                    </div>
                  );
                })}
              </div>{" "}
            </>
          )}

          <div>
            {components?.map((component: any, index: number) => (
              <div key={component.id} className="mb-5">
                {props.SelectedItem == undefined && (
                  <div>
                    <label
                      className="form-label full-width"
                      htmlFor={`exampleFormControlInput${component.id}`}
                    >
                      {isDisable == false && (
                        <>
                          <span>{index + 1} - </span>
                          <span>Component</span>
                        </>
                      )}

                      <span className={isDisable ? "" : "pull-right"}>
                        <label className="SpfxCheckRadio">
                          <input
                            type="radio"
                            name={`SubComponent-${index}`}
                            onChange={() =>
                              handleSubComponentChange(index, component)
                            }
                            checked={component.isCheckedSub}
                            className="radio"
                          />
                          SubComponent
                        </label>
                        <label className="SpfxCheckRadio me-0">
                          <input
                            type="radio"
                            name={`Feature-${index}`}
                            onChange={() =>
                              handleFeatureChange(index, 0, component, 0, false)
                            }
                            checked={component.isCheckedCompFea}
                            className="radio"
                          />
                          Feature
                        </label>
                      </span>
                    </label>

                    {isDisable == false && (
                      <div className="input-group">
                        <input
                          type="text"
                          disabled={isDisable}
                          className="form-control"
                          id={`exampleFormControlInput${component.id}`}
                          placeholder=""
                          value={component.value}
                          onChange={(event) =>
                            handleInputChange(index, 0, 0, event, "component")
                          }
                        />
                        {index === components.length - 1 && (
                          <>
                            <div className="input-group-append alignCenter">
                              <span
                                onClick={() =>
                                  handleAddSubComponent(
                                    index,
                                    0,
                                    0,
                                    "Component"
                                  )
                                }
                                title="Add"
                                className="svg__iconbox svg__icon--Plus mx-1 hreflink"
                              ></span>
                              {components.length > 1 && (
                                <span
                                  onClick={() =>
                                    handleDelete(index, 0, 0, "component")
                                  }
                                  title="Delete"
                                  className="svg__iconbox svg__icon--trash hreflink"
                                ></span>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}
                <div className="mt-2 ps-4">
                  {component?.SubComponent?.map(
                    (Subcomponent: any, indexSub: number) => (
                      <div key={Subcomponent.id} className="form-group">
                        {(Subcomponent.isCheckedSub ||
                          component.isCheckedSub ||
                          (props?.SelectedItem?.Item_x0020_Type !=
                            "SubComponent" &&
                            props?.SelectedItem != undefined)) && (
                          <div>
                            <label
                              className="form-label full-width"
                              htmlFor={`exampleFormControlInput${Subcomponent.id}`}
                            >
                              <span>{indexSub + 1} - </span> SubComponent
                              <span className="pull-right">
                                <label className="SpfxCheckRadio me-0">
                                  <input
                                    type="radio"
                                    name={`Feature${indexSub}`} // Ensure unique name for each radio group
                                    checked={Subcomponent.isCheckedSubFea}
                                    onChange={() =>
                                      handleFeatureChange(
                                        index,
                                        indexSub,
                                        component,
                                        Subcomponent,
                                        true
                                      )
                                    }
                                    className="radio"
                                  />
                                  Feature
                                </label>
                              </span>
                            </label>
                            <div className="input-group">
                              <input
                                type="text"
                                className="form-control"
                                id={`exampleFormControlInput${Subcomponent.id}`}
                                placeholder=""
                                value={Subcomponent.value}
                                onChange={(event) =>
                                  handleInputChange(
                                    index,
                                    indexSub,
                                    0,
                                    event,
                                    "subcomponent"
                                  )
                                }
                              />
                              {component.SubComponent.length == 1 &&
                                component.isCheckedSub === true && (
                                  <span
                                    onClick={() =>
                                      handleDelete(
                                        index,
                                        indexSub,
                                        0,
                                        "subcomponent"
                                      )
                                    }
                                    title="Delete"
                                    className="svg__iconbox svg__icon--trash hreflink"
                                  ></span>
                                )}
                              {indexSub ===
                                component.SubComponent.length - 1 && (
                                <div className="input-group-append alignCenter">
                                  <span
                                    onClick={() =>
                                      handleAddSubComponent(
                                        index,
                                        indexSub,
                                        0,
                                        "SubComponent"
                                      )
                                    }
                                    title="Add"
                                    className="svg__iconbox mx-1 svg__icon--Plus hreflink"
                                  ></span>
                                  {component.SubComponent.length > 1 && (
                                    <span
                                      onClick={() =>
                                        handleDelete(
                                          index,
                                          indexSub,
                                          0,
                                          "subcomponent"
                                        )
                                      }
                                      title="Delete"
                                      className="svg__iconbox svg__icon--trash hreflink"
                                    ></span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {(Subcomponent.isCheckedSubFea ||
                          isDisableSub == true ||
                          props?.SelectedItem?.Item_x0020_Type ==
                            "SubComponent") && (
                          <div className="mt-2 ps-4">
                            {Subcomponent?.Feature?.map(
                              (Features: any, indexFea: any) => (
                                <div key={Features.id} className="form-group">
                                  <span>{indexFea + 1} - </span>
                                  <label
                                    htmlFor={`exampleFormControlInput${Features.id}`}
                                  >
                                    Feature
                                  </label>
                                  <div className="input-group">
                                    <input
                                      type="text"
                                      className="form-control"
                                      id={`exampleFormControlInput${Features.id}`}
                                      placeholder=""
                                      value={Features.value}
                                      onChange={(event) =>
                                        handleInputChange(
                                          index,
                                          indexSub,
                                          indexFea,
                                          event,
                                          "feature"
                                        )
                                      }
                                    />
                                    {Subcomponent.Feature.length == 1 &&
                                      (component.isCheckedCompFea === true ||
                                        Subcomponent.isCheckedSubFea ===
                                          true) && (
                                        <span
                                          onClick={() =>
                                            handleDelete(
                                              index,
                                              indexSub,
                                              indexFea,
                                              "feature"
                                            )
                                          }
                                          title="Delete"
                                          className="svg__iconbox svg__icon--trash hreflink"
                                        ></span>
                                      )}
                                    {indexFea ===
                                      Subcomponent.Feature.length - 1 && (
                                      <div className="input-group-append alignCenter">
                                        <span
                                          onClick={() =>
                                            handleAddSubComponent(
                                              index,
                                              indexSub,
                                              indexFea,
                                              "Feature"
                                            )
                                          }
                                          title="Add"
                                          className="svg__iconbox mx-1 svg__icon--Plus hreflink"
                                        ></span>
                                        {Subcomponent.Feature.length > 1 && (
                                          <span
                                            onClick={() =>
                                              handleDelete(
                                                index,
                                                indexSub,
                                                indexFea,
                                                "feature"
                                              )
                                            }
                                            title="Delete"
                                            className="svg__iconbox svg__icon--trash hreflink"
                                          ></span>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>
                {(component.isCheckedCompFea ||
                  isDisableSub == true ||
                  props?.SelectedItem?.Item_x0020_Type == "SubComponent") && (
                  <div className="mt-2 ps-4">
                    {component?.Feature?.map(
                      (feature: any, featureIndex: number) => (
                        <div key={feature.id} className="form-group">
                          <span>{featureIndex + 1} - </span>
                          <label htmlFor={`componentFeatureInput${feature.id}`}>
                            Feature
                          </label>
                          <div className="input-group">
                            <input
                              type="text"
                              className="form-control"
                              id={`componentFeatureInput${feature.id}`}
                              placeholder=""
                              value={feature.value}
                              onChange={(event) =>
                                handleInputChange(
                                  index,
                                  0,
                                  featureIndex,
                                  event,
                                  "ComponentFeature"
                                )
                              }
                            />
                            {component.Feature.length === 1 &&
                              component.isCheckedCompFea === true && (
                                <span
                                  onClick={() =>
                                    handleDelete(
                                      index,
                                      0,
                                      featureIndex,
                                      "ComponentFeature"
                                    )
                                  }
                                  title="Delete"
                                  className="svg__iconbox svg__icon--trash hreflink"
                                ></span>
                              )}
                            {featureIndex === component.Feature.length - 1 && (
                              <div className="input-group-append alignCenter">
                                <span
                                  onClick={() =>
                                    handleAddSubComponent(
                                      index,
                                      0,
                                      featureIndex,
                                      "ComponentFeature"
                                    )
                                  }
                                  title="Add"
                                  className="svg__iconbox mx-1 svg__icon--Plus hreflink"
                                ></span>
                                {component.Feature.length > 1 && (
                                  <span
                                    onClick={() =>
                                      handleDelete(
                                        index,
                                        0,
                                        featureIndex,
                                        "ComponentFeature"
                                      )
                                    }
                                    title="Delete"
                                    className="svg__iconbox svg__icon--trash hreflink"
                                  ></span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <footer className="modal-footer mt-2">
            {components[0].value != "" || props.SelectedItem != undefined ? (
              <button className="btn btn-primary" onClick={handleSave}>
                Save
              </button>
            ) : (
              <button
                className="btn btn-primary"
                disabled={true}
                onClick={handleSave}
              >
                Save
              </button>
            )}
          </footer>
        </div>
      </div>
      {!loaded && <PageLoader />}

      {/* </Panel> */}
    </>
  );
};
export default CreateAllStructureComponent;
