import * as React from "react";
import * as $ from "jquery";
import * as Moment from "moment";
import { Panel, PanelType } from "office-ui-fabric-react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Web, sp } from "sp-pnp-js";
import PageLoader from "./pageLoader";
let defaultPortfolioType = ''
let PortfoliotypeData: any = '';
let PortfolioColor: any = ''
let CurrentUserId: any = ''
let CurrentUserData: any = ''
let query: any = '';
let isDisable = false
let isDisableSub = false
let subCount = 0;
const CreateAllStructureComponent = (props: any) => {
    if (props?.PropsValue?.Context) {
        CurrentUserId = props?.PropsValue?.Context.pageContext?._legacyPageContext.userId;
    }
    const [OpenAddStructurePopup, setOpenAddStructurePopup] = React.useState(true)
    const [count, setCount] = React.useState(0)
    const [loaded, setLoaded] = React.useState(true);
    const [components, setComponents] = React.useState<any>([{ id: 1, value: '', isCheckedSub: false, isCheckedFea: false, SubComponent: [{ id: 1, isCheckedSub: false, value: '', Feature: [{ id: 1, isChecked: false, value: '' }] }] }]);
    const [Subcomponents, setSubComponents] = React.useState([{ id: 1, value: '' }]);
    const [Feature, setFeature] = React.useState([{ id: 1, value: '' }]);

    query = window.location.search;
    const urlParams = new URLSearchParams(query);
    const portfolioType = urlParams.get('PortfolioType');
    if (portfolioType !== undefined && portfolioType != null && portfolioType != '') {
        defaultPortfolioType = portfolioType;
    }
    else {
        defaultPortfolioType = 'Component';
    }
    React.useEffect(() => {
        if (props.SelectedItem != undefined) {
            if (props.SelectedItem.PortfolioType?.Title == 'Component') {
                components?.forEach((item: any) => {
                    item.value = props.SelectedItem?.Title
                    item.id = props.SelectedItem?.Id
                })
                setCount(count + 1)

            }
            if (props.SelectedItem.PortfolioType?.Title == 'SubComponent') {
                isDisableSub = true;
                defaultPortfolioType = ''
                setCount(count + 1)

            }
        }
    }, [])

    const handleAddComponent = () => {
        const newComponent = { id: components.length + 1, value: '' };
        setComponents([...components, newComponent]);
    };

    const handleAddSubComponent = (componentIndex: number, subComIndex: any, FeaIndex: any, Type: any) => {
        if (Type == 'Component') {
            const newComponent = { id: components.length + 1, value: '', isCheckedSub: false, isCheckedFea: false, SubComponent: [{ id: 1, isCheckedSub: false, value: '', Feature: [{ id: 1, value: '' }] }] }
            //components.push(newComponent)
            setComponents([...components, newComponent]);
        }
        if (Type == 'SubComponent') {
            components[componentIndex].SubComponent.push({ id: subComIndex + 2, isCheckedSub: true, value: '', Feature: [{ id: 1, value: '' }] })
            setComponents(components);
            setCount(count + 1)
        }
        if (Type == 'Feature') {
            components[componentIndex].SubComponent[subComIndex].Feature.push({ id: FeaIndex + 2, isChecked: true, value: '' })
            setComponents(components);
            setCount(count + 1)
        }

    };

    //   const handleAddFeature = (componentIndex: number, subComponentIndex?: number) => {
    //     const newFeature = { id: Feature.length + 1, value: '' };
    //     const updatedComponents = [...components];

    //     if (subComponentIndex !== undefined) {
    //       updatedComponents[componentIndex].SubComponent[subComponentIndex].features.push(newFeature);
    //     } else {
    //       updatedComponents[componentIndex].features.push(newFeature);
    //     }

    //     setComponents(updatedComponents);
    //     setFeature([...Feature, newFeature]);
    //   };

    const handleInputChange = (index: any, Subindex: any, Feaindex: any, event: any, type: any) => {
        if (type == 'component') {
            const newComponents = [...components];
            newComponents[index].value = event.target.value;
            setComponents(newComponents);
        }
        if (type == 'subcomponent') {
            const newSubComponents = [...components];
            newSubComponents[index].SubComponent[Subindex].value = event.target.value;
            setComponents(newSubComponents);
        }
        if (type == 'feature') {
            const Features = [...components];
            Features[index].SubComponent[Subindex].Feature[Feaindex].value = event.target.value;
            setComponents(Features);
        }
    };

    const handleDelete = (index: number, subIndex: any, FeaIndex: any, type: string) => {
        if (type === 'component') {
            const newComponents = [...components];
            newComponents.splice(index, 1);
            setComponents(newComponents);
        }
        if (type === 'subcomponent') {
            const newSubComponents = [...components];
            //newSubComponents[index].SubComponent.splice(subIndex, 1)
            newSubComponents[index].SubComponent.splice(subIndex, 1)
            if (newSubComponents[index].SubComponent.length <= 1) {
                newSubComponents[index].isCheckedSub = false;
            }
            // newSubComponents[index].isCheckedSub = false;
            setSubComponents(newSubComponents);
        }
        if (type === 'feature') {
            const newFeatures = [...components];
            newFeatures[index].SubComponent[subIndex].Feature.splice(FeaIndex, 1);
            newFeatures[index].isCheckedFea = false;
            setFeature(newFeatures);
        }
    };



    const handleSave = async () => {
        setLoaded(false)
        props?.taskUser.map((val: any) => {
            if (val.AssingedToUser?.Id == CurrentUserId) {
                CurrentUserData = val
            }
        })
        try {
            const hierarchyData = [];
            let count = 0
            // Save components
            for (const component of components) {
                if (props.SelectedItem != undefined) {
                    let array: any = []
                    CheckPortfolioType(props.SelectedItem.PortfolioType)
                    array.push(props.SelectedItem)
                    var PortfolioStructureId = array
                }
                else {
                    var PortfolioStructureId = await getPortfolioStructureId('Component', 'data')
                }

                var level: any = ''
                var PortfolioStr = ''
                if (PortfolioStructureId.length == 0) {
                    level = 1
                    PortfolioStr = 'C' + level
                }
                else {
                    level = PortfolioStructureId[0]?.PortfolioLevel + 1
                    PortfolioStr = 'C' + level
                }
                const componentItem = {
                    Item_x0020_Type: 'Component',
                    Title: component?.value,
                    PortfolioTypeId: PortfoliotypeData != '' ? PortfoliotypeData?.Id : 1,
                    PortfolioLevel: level,
                    PortfolioStructureID: PortfolioStr
                };


                if (props.SelectedItem != undefined) {
                    var createdComponent = props.SelectedItem
                }
                else {
                    var createdComponent = await createListItem('Master Tasks', componentItem);
                }

                // Save subcomponents
                const subcomponents = [];
                for (const subcomponent of component?.SubComponent) {
                    let Sublevel: any = ''
                    let SubPortfolioStr = ''
                    // if (props.SelectedItem?.PortfolioType != undefined) {
                    //     let array: any = []
                    //     CheckPortfolioType(props.SelectedItem.PortfolioType)
                    //     array.push(props.SelectedItem)
                    //     var PortfolioStructureId = array
                    // }


                    var PortfolioStructureIdSub = await getPortfolioStructureId('SubComponent', createdComponent)
                    console.log(PortfolioStructureIdSub)
                    if (PortfolioStructureIdSub.length == 0) {
                        Sublevel = 1
                        SubPortfolioStr = createdComponent?.PortfolioStructureID + '-' + 'S' + Sublevel
                    }
                    else {
                        const parts = PortfolioStructureIdSub[0]?.PortfolioStructureID.split('-');
                        const prefix = parts[0];
                        const currentValue = parseInt(parts[1].substring(1)); // Extract the numeric part and parse it to an integer
                        const newValue = currentValue + 1;
                        SubPortfolioStr = `${prefix}-S${newValue}`;
                        Sublevel = PortfolioStructureIdSub[0]?.PortfolioLevel + 1

                    }

                    // if (PortfolioStructureIdSub?.length == 0 || PortfolioStructureIdSub == undefined) {
                    //     if(PortfolioStructureId != undefined && PortfolioStructureId.length > 0 && PortfolioStructureId[0].subRows != undefined){
                    //         Sublevel ++
                    //         subCount ++
                    //         if(subCount > 1){
                    //             Sublevel = subCount
                    //         }
                    //         else{
                    //             PortfolioStructureId[0]?.subRows?.forEach((val:any)=>{
                    //                 if(val.Item_x0020_Type == 'SubComponent'){
                    //                     Sublevel++
                    //                 }
                    //             })
                    //         }

                    //     }
                    //     else{
                    //         Sublevel = 1
                    //     }

                    //     SubPortfolioStr = createdComponent?.PortfolioStructureID + '-' + 'S' + Sublevel
                    // }
                    // else {
                    //     Sublevel = PortfolioStructureIdSub[0].PortfolioLevel + 1
                    //     SubPortfolioStr = createdComponent?.PortfolioStructureID + '-' + 'S' + Sublevel
                    // }

                    let subcomponentItem: any = {
                        Item_x0020_Type: 'SubComponent',
                        Title: subcomponent.value,
                        ParentId: createdComponent?.Id, // Use the ID of the created component as ParentId
                        PortfolioLevel: Sublevel,
                        PortfolioStructureID: SubPortfolioStr,
                        PortfolioTypeId: PortfoliotypeData != '' ? PortfoliotypeData?.Id : 1,
                    };

                    // Create subcomponent item in SharePoint list

                    const createdSubcomponent = await createListItem('Master Tasks', subcomponentItem);
                    // Save features
                    var features: any = [];
                    for (const feature of subcomponent?.Feature) {
                        let FeaPortfolioStr = ''
                        let fealevel: any = ''
                        const mydaya = createdSubcomponent == undefined || createdSubcomponent.length == 0 ? createdComponent : createdSubcomponent
                        const PortfolioStructureIdFea = await getPortfolioStructureId('Feature', mydaya)
                        if (PortfolioStructureIdFea.length == 0 || PortfolioStructureIdFea == undefined) {
                            fealevel = 1
                            if (createdSubcomponent == undefined || createdSubcomponent.length == 0) {
                                FeaPortfolioStr = createdComponent.PortfolioStructureID + '-' + 'F' + fealevel
                            }
                            else {
                                FeaPortfolioStr = createdSubcomponent?.PortfolioStructureID + '-' + 'F' + fealevel
                            }

                        }
                        else {
                            fealevel = PortfolioStructureIdFea[0].PortfolioLevel + 1
                            if (props.SelectedItem != undefined) {
                                FeaPortfolioStr = props.SelectedItem?.PortfolioStructureID + '-' + 'F' + fealevel
                            }
                            else {
                                if (PortfolioStructureIdFea[0]?.Item_x0020_Type == 'SubComponent') {
                                    FeaPortfolioStr = PortfolioStructureIdFea[0]?.PortfolioStructureID + '-' + 'F' + fealevel
                                }
                                else {
                                    FeaPortfolioStr = createdSubcomponent?.PortfolioStructureID + '-' + 'F' + fealevel
                                }

                            }

                        }
                        count++
                        const featureItem: any = {
                            Item_x0020_Type: 'Feature',
                            Title: feature.value,
                            ParentId: createdSubcomponent == undefined ? createdComponent.Id : createdSubcomponent.Id, // Use the ID of the created subcomponent as ParentId
                            PortfolioLevel: fealevel,
                            PortfolioStructureID: FeaPortfolioStr,
                            PortfolioTypeId: PortfoliotypeData != '' ? PortfoliotypeData?.Id : 1,
                        };

                        // Create feature item in SharePoint list

                        const featuredata = await createListItem('Master Tasks', featureItem);


                        // Add feature to the features array
                        if (featureItem.Title != "") {
                            features.push({
                                Id: featuredata?.Id,
                                ID: featuredata?.Id,
                                Title: featureItem?.Title,
                                siteType: "Master Tasks",
                                SiteIconTitle: featuredata?.Item_x0020_Type?.charAt(0),
                                TaskID: featuredata?.PortfolioStructureID,
                                Created: Moment(featureItem?.Created).format("DD/MM/YYYY"),
                                DisplayCreateDate: Moment(featureItem?.Created).format("DD/MM/YYYY"),
                                Author: { "Id": featureItem?.AuthorId, 'Title': CurrentUserData?.Title, 'autherImage': CurrentUserData?.Item_x0020_Cover?.Url },
                                PortfolioType: PortfoliotypeData,
                                PortfolioStructureID: featuredata?.PortfolioStructureID,
                                Item_x0020_Type: 'Feature'
                            });
                        }

                    }

                    // Add subcomponent with features to the subcomponents array
                    if (createdSubcomponent != undefined) {
                        subcomponents.push({
                            Id: createdSubcomponent != undefined ? createdSubcomponent?.Id : createdComponent?.Id,
                            ID: createdSubcomponent != undefined ? createdSubcomponent?.Id : createdComponent?.Id,
                            Title: createdSubcomponent != undefined ? createdSubcomponent?.Title : createdComponent?.Title,
                            features,
                            siteType: "Master Tasks",
                            SiteIconTitle: createdSubcomponent?.Item_x0020_Type?.charAt(0),
                            TaskID: createdSubcomponent?.PortfolioStructureID,
                            Created: Moment(createdSubcomponent?.Created).format("DD/MM/YYYY"),
                            DisplayCreateDate: Moment(createdSubcomponent?.Created).format("DD/MM/YYYY"),
                            Author: { "Id": createdSubcomponent?.AuthorId, 'Title': CurrentUserData?.Title, 'autherImage': CurrentUserData?.Item_x0020_Cover?.Url },
                            PortfolioType: PortfoliotypeData,
                            PortfolioStructureID: createdSubcomponent?.PortfolioStructureID,
                            Item_x0020_Type: 'SubComponent'
                        });
                    }

                }

                // Add component with subcomponents to the hierarchyData array
                hierarchyData.push({
                    Id: createdComponent?.Id,
                    ID: createdComponent?.Id,
                    Title: createdComponent?.Title,
                    subcomponents,
                    siteType: "Master Tasks",
                    SiteIconTitle: createdComponent?.Item_x0020_Type?.charAt(0),
                    TaskID: createdComponent?.PortfolioStructureID,
                    PortfolioStructureID: createdComponent?.PortfolioStructureID,
                    Created: Moment(createdComponent?.Created).format("DD/MM/YYYY"),
                    DisplayCreateDate: Moment(createdComponent?.Created).format("DD/MM/YYYY"),
                    Author: { "Id": createdComponent?.AuthorId, 'Title': CurrentUserData?.Title, 'autherImage': CurrentUserData?.Item_x0020_Cover?.Url },
                    PortfolioType: PortfoliotypeData,
                    Item_x0020_Type: 'Component'
                });
            }
            hierarchyData?.forEach((val: any) => {
                if (props.SelectedItem != undefined) {
                    val.SelectedItem = props.SelectedItem.Id
                }
                if (val.subcomponents != undefined && val.subcomponents.length > 0) {
                    val.subRows = val?.subcomponents
                    val.subcomponents.forEach((b: any) => {
                        b.subRows = b?.features
                        b?.features.forEach((fea: any) => {
                        })
                    })
                }
                else {
                    val.subRows = features
                }


            })

            props.Close(hierarchyData)
            defaultPortfolioType = ''
            setLoaded(true);
            alert('Hierarchy saved successfully!');
        } catch (error) {
            console.error('Error saving hierarchy:', error);
            alert('Error saving hierarchy. Please check the console for details.');
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
        var filter = ''
        if (type == 'Component') {
            filter = "Item_x0020_Type eq 'Component'"
        }
        else {
            filter = "Parent/Id eq '" + item?.Id + "' and Item_x0020_Type eq '" + type + "'"
            //filter = "Parent/Id eq '" + item.Id
        }

        let web = new Web(props?.PropsValue?.siteUrl);
        let results = await web.lists
            .getByTitle('Master Tasks')
            .items
            .select("Id", "Title", "PortfolioLevel", 'Item_x0020_Type', "PortfolioStructureID", "Parent/Id", "PortfolioType/Id", "PortfolioType/Title")
            .expand("Parent,PortfolioType")
            .filter(filter)
            .orderBy("PortfolioLevel", false)
            .top(1)
            .get()
        console.log(results)
            ;
        return results
    }

    const handleFeatureChange = (index: any, subIndex: any, component: any, Subcomponent: any) => {
        if (index == 0) {
            if (component.isCheckedSub == true) {
                Subcomponent.isCheckedFea = true;
            } else {
                component.SubComponent[subIndex].isCheckedFea = true;
            }

            setCount(count + 1)
        }
        else {
            if (component.isCheckedSub == true) {
                Subcomponent.isCheckedFea = true;
                component.isCheckedSub = true;

            }
            else {
                component.isCheckedFea = true;
            }

            setCount(count + 1)
        }
    }
    const handleSubComponentChange = (index: any, component: any) => {
        if (index == 0) {
            component.SubComponent.push({ id: component.SubComponent.length + 1, isCheckedSub: true, value: '', Feature: [{ id: 1, value: '' }] })
            component.isCheckedSub = true;
            setCount(count + 1)
        }
        else {
            component.SubComponent.push({ id: component.SubComponent.length + 1, isCheckedSub: true, value: '', Feature: [{ id: 1, value: '' }] })
            component.isCheckedSub = true;
            setCount(count + 1)
        }
    }
    const CheckPortfolioType = (item: any) => {
        PortfoliotypeData = item;
        PortfolioColor = item?.Color;
        defaultPortfolioType = item?.Title
        setCount(count + 1)
    }
    return (
        <>
            {/* <Panel
        onRenderHeader={onRenderCustomHeaderMain1}
        type={PanelType.medium}
        isOpen={OpenAddStructurePopup}
        isBlocking={false}
        onDismiss={AddStructureCallBackCall}
      > */}
            <div className={defaultPortfolioType == 'Events' ? 'eventpannelorange' : ((defaultPortfolioType == 'Service' || defaultPortfolioType == 'Service Portfolio') ? 'serviepannelgreena' : 'component Portfolio clearfix')}>
                <div className='modal-body '>

                    {props?.SelectedItem == undefined && <>
                        <label><b>Select Portfolio type</b></label>
                        <div className="d-flex">
                            {props?.portfolioTypeData.map((item: any) => {
                                return (
                                    <div className="mx-2 mb-2 mt-2">
                                        <label className='label--radio'><input className='radio' defaultChecked={defaultPortfolioType.toLowerCase() === item.Title.toLowerCase()} name='PortfolioType' type='radio' onClick={() => CheckPortfolioType(item)} ></input>{item.Title}</label>
                                    </div>)
                            })}
                        </div> </>}

                    <div>
                        {/* {components?.map((component: any, index: any) => (
                            <div key={component.id} className="mb-5">
                                <label className="form-label full-width" htmlFor={`exampleFormControlInput${component.id}`}>{isDisable == false && <><span>{index + 1} - </span>  <span>Component</span></>}
                                    <span className={isDisable?'':"pull-right"}>
                                        <label className='SpfxCheckRadio'>
                                            <input
                                                type="radio"
                                                name={`SubComponent-${index}`}
                                                onChange={() => handleSubComponentChange(index, component)}
                                                checked={component.isCheckedSub}
                                                className="radio"
                                            />
                                            SubComponent
                                        </label>
                                        <label className='SpfxCheckRadio me-0'>
                                            <input
                                                type="radio"
                                                name={`Feature-${index}`}
                                                onChange={() => handleFeatureChange(index, 0, component, 0)}
                                                checked={component.isCheckedFea}
                                                className="radio"
                                            />
                                            Feature
                                        </label>
                                    </span>
                                </label>
                                {isDisable == false &&
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            disabled={isDisable}
                                            className="form-control"
                                            id={`exampleFormControlInput${component.id}`}
                                            placeholder=""
                                            value={component.value}
                                            onChange={(event) => handleInputChange(index, 0, 0, event, 'component')}
                                        />
                                        {index === components.length - 1 && (
                                            <>
                                                <div className="input-group-append alignCenter">
                                                    <span onClick={() => handleAddSubComponent(index, 0, 0, 'Component')} title="Add" className="svg__iconbox svg__icon--Plus mx-1 hreflink"></span>

                                                    {components.length > 1 && (
                                                        <span onClick={() => handleDelete(index, 0, 0, 'component')} title="Delete" className="svg__iconbox svg__icon--trash hreflink"></span>
                                                    )}
                                                </div>
                                            </>

                                        )}
                                    </div>}


                                <div className="mt-2 ps-4">
                                    {component?.SubComponent?.map((Subcomponent: any, indexSub: any) => (
                                        <div key={Subcomponent.id} className="form-group">
                                            {(Subcomponent.isCheckedSub) &&
                                                <div>

                                                    <label className="form-label full-width" htmlFor={`exampleFormControlInput${Subcomponent.id}`}><span>{indexSub + 1} - </span> SubComponent
                                                        <span className="pull-right">
                                                            <label className='SpfxCheckRadio me-0'>
                                                                <input type="radio" name="Feature" checked={Subcomponent.isCheckedFea} onChange={() => handleFeatureChange(index, indexSub, component, Subcomponent)} className="radio" />Feature
                                                            </label></span>
                                                    </label>
                                                    <div className="input-group">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id={`exampleFormControlInput${Subcomponent.id}`}
                                                            placeholder=""
                                                            value={Subcomponent.value}
                                                            onChange={(event) => handleInputChange(index, indexSub, 0, event, 'subcomponent')}
                                                        />
                                                        {indexSub === component.SubComponent.length - 1 && (
                                                            <div className="input-group-append alignCenter">
                                                                <span onClick={() => handleAddSubComponent(index, indexSub, 0, 'SubComponent')} title="Add" className="svg__iconbox mx-1 svg__icon--Plus hreflink"></span>

                                                                {component.SubComponent.length > 1 && (
                                                                    <span onClick={() => handleDelete(index, indexSub, 0, 'subcomponent')} title="Delete" className="svg__iconbox svg__icon--trash hreflink"></span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>

                                                </div>
                                            }
                                            {(Subcomponent.isCheckedFea || component.isCheckedFea || isDisableSub == true) &&
                                                <div className="mt-2 ps-4">
                                                    {Subcomponent?.Feature?.map((Features: any, indexFea: any) => (
                                                        <div key={Features.id} className="form-group">
                                                            <span>{indexFea + 1} - </span>
                                                            <label htmlFor={`exampleFormControlInput${Features.id}`}>Feature</label>
                                                            <div className="input-group">
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    id={`exampleFormControlInput${Features.id}`}
                                                                    placeholder=""
                                                                    value={Features.value}
                                                                    onChange={(event) => handleInputChange(index, indexSub, indexFea, event, 'feature')}
                                                                />
                                                                {indexFea === Feature.length - 1 && (
                                                                    <div className="input-group-append alignCenter">
                                                                        <span onClick={() => handleAddSubComponent(index, indexSub, indexFea, 'Feature')} title="Add" className="svg__iconbox mx-1 svg__icon--Plus hreflink"></span>

                                                                        {Feature.length > 1 && (
                                                                            <span onClick={() => handleDelete(index, indexSub, indexFea, 'feature')} title="Delete" className="svg__iconbox svg__icon--trash hreflink"></span>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>}

                                        </div>
                                    ))}
                                </div>


                            </div>
                        ))} */}
                        {components?.map((component: any, index: any) => (

                            <div key={component.id} className="mb-5">
                                {(props.SelectedItem == undefined)
                                    &&
                                    <div>

                                        <label className="form-label full-width" htmlFor={`exampleFormControlInput${component.id}`}>
                                            {isDisable == false &&
                                                <>
                                                    <span>{index + 1} - </span>
                                                    <span>Component</span>

                                                </>
                                            }

                                            <span className={isDisable ? '' : "pull-right"}>
                                                <label className='SpfxCheckRadio'>
                                                    <input
                                                        type="radio"
                                                        name={`SubComponent-${index}`}
                                                        onChange={() => handleSubComponentChange(index, component)}
                                                        checked={component.isCheckedSub}
                                                        className="radio"
                                                    />
                                                    SubComponent
                                                </label>
                                                <label className='SpfxCheckRadio me-0'>
                                                    <input
                                                        type="radio"
                                                        name={`Feature-${index}`}
                                                        onChange={() => handleFeatureChange(index, 0, component, 0)}
                                                        checked={component.isCheckedFea}
                                                        className="radio"
                                                    />
                                                    Feature
                                                </label>
                                            </span>
                                        </label>

                                        {isDisable == false &&
                                            <div className="input-group">
                                                <input
                                                    type="text"
                                                    disabled={isDisable}
                                                    className="form-control"
                                                    id={`exampleFormControlInput${component.id}`}
                                                    placeholder=""
                                                    value={component.value}
                                                    onChange={(event) => handleInputChange(index, 0, 0, event, 'component')}
                                                />
                                                {index === components.length - 1 && (
                                                    <>
                                                        <div className="input-group-append alignCenter">
                                                            <span onClick={() => handleAddSubComponent(index, 0, 0, 'Component')} title="Add" className="svg__iconbox svg__icon--Plus mx-1 hreflink"></span>
                                                            {components.length > 1 && (
                                                                <span onClick={() => handleDelete(index, 0, 0, 'component')} title="Delete" className="svg__iconbox svg__icon--trash hreflink"></span>
                                                            )}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        }
                                    </div>}

                                <div className="mt-2 ps-4">
                                    {component?.SubComponent?.map((Subcomponent: any, indexSub: any) => (
                                        <div key={Subcomponent.id} className="form-group">
                                            {(Subcomponent.isCheckedSub || (props?.SelectedItem?.Item_x0020_Type != 'SubComponent' && props?.SelectedItem != undefined)) &&
                                                <div>
                                                    <label className="form-label full-width" htmlFor={`exampleFormControlInput${Subcomponent.id}`}>
                                                        <span>{indexSub + 1} - </span> SubComponent
                                                        <span className="pull-right">
                                                            <label className='SpfxCheckRadio me-0'>
                                                                <input
                                                                    type="radio"
                                                                    name={`Feature${indexSub}`} // Ensure unique name for each radio group
                                                                    checked={Subcomponent.isCheckedFea}
                                                                    onChange={() => handleFeatureChange(index, indexSub, component, Subcomponent)}
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
                                                            onChange={(event) => handleInputChange(index, indexSub, 0, event, 'subcomponent')}
                                                        />
                                                        {/* {component.SubComponent.length == 1 && <span onClick={() => handleDelete(index, indexSub, 0, 'subcomponent')} title="Delete" className="svg__iconbox svg__icon--trash hreflink"></span>} */}
                                                        {indexSub === component.SubComponent.length - 1 && (
                                                            <div className="input-group-append alignCenter">
                                                                <span onClick={() => handleAddSubComponent(index, indexSub, 0, 'SubComponent')} title="Add" className="svg__iconbox mx-1 svg__icon--Plus hreflink"></span>
                                                                {component.SubComponent.length > 1 && (
                                                                    <span onClick={() => handleDelete(index, indexSub, 0, 'subcomponent')} title="Delete" className="svg__iconbox svg__icon--trash hreflink"></span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            }
                                            {(Subcomponent.isCheckedFea || component.isCheckedFea || isDisableSub == true || props?.SelectedItem?.Item_x0020_Type == 'SubComponent') &&
                                                <div className="mt-2 ps-4">
                                                    {Subcomponent?.Feature?.map((Features: any, indexFea: any) => (
                                                        <div key={Features.id} className="form-group">
                                                            <span>{indexFea + 1} - </span>
                                                            <label htmlFor={`exampleFormControlInput${Features.id}`}>Feature</label>
                                                            <div className="input-group">
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    id={`exampleFormControlInput${Features.id}`}
                                                                    placeholder=""
                                                                    value={Features.value}
                                                                    onChange={(event) => handleInputChange(index, indexSub, indexFea, event, 'feature')}
                                                                />
                                                                {Subcomponent.Feature.length == 1 && (component.isCheckedFea === true || Subcomponent.isCheckedFea === true) && <span onClick={() => handleDelete(index, indexSub, indexFea, 'feature')} title="Delete" className="svg__iconbox svg__icon--trash hreflink"></span>}
                                                                {indexFea === Subcomponent.Feature.length - 1 && (
                                                                    <div className="input-group-append alignCenter">
                                                                        <span onClick={() => handleAddSubComponent(index, indexSub, indexFea, 'Feature')} title="Add" className="svg__iconbox mx-1 svg__icon--Plus hreflink"></span>
                                                                        {Subcomponent.Feature.length > 1 && (
                                                                            <span onClick={() => handleDelete(index, indexSub, indexFea, 'feature')} title="Delete" className="svg__iconbox svg__icon--trash hreflink"></span>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}


                    </div>

                    <footer className="modal-footer mt-2">
                        {components[0].value != '' || props.SelectedItem != undefined ? <button className="btn btn-primary" onClick={handleSave}>
                            Save
                        </button> : <button className="btn btn-primary" disabled={true} onClick={handleSave}>
                            Save
                        </button>}
                    </footer>

                </div>
            </div>
            {!loaded && <PageLoader />}

            {/* </Panel> */}
        </>
    )
}
export default CreateAllStructureComponent;