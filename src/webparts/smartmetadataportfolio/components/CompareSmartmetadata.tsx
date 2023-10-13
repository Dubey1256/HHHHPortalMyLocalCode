
import * as React from 'react';
import { Col, Container, Row } from "react-bootstrap";
import { LiaArrowLeftSolid, LiaArrowRightSolid } from "react-icons/lia";
import { TbArrowsExchange } from "react-icons/tb";
import { LuUndo2 } from "react-icons/lu";
import { Panel, PanelType } from 'office-ui-fabric-react';
import { Checkbox, Dropdown, IDropdownOption, Label, Text, TextField } from "@fluentui/react";
export default function CompareSmartMetaData(Props: any) {
    var compareMetadataItemOne: any = Props?.compareSeletected[0];
    var compareMetadataItemTwo: any = Props?.compareSeletected[1];
    const [isShowCompare, setIsShowCompare]: any = React.useState(false);
    var [state, setState]: any = React.useState({});
    const closeComparepopup = () => {
        setIsShowCompare(false);
    }
    const openComparePopup = () => {
        if (Props?.compareSeletected.length === 2) {
            setState({
                itemOneTitle: compareMetadataItemOne?.Title,
                itemTwoTitle: compareMetadataItemTwo?.Title,
                itemOneTaxType: compareMetadataItemOne?.TaxType,
                itemTwoTaxType: compareMetadataItemTwo?.TaxType,
                itemOneSortOrder: compareMetadataItemOne?.SortOrder,
                itemTwoSortOrder: compareMetadataItemTwo?.SortOrder,
                itemOneSmartSuggestions: compareMetadataItemOne?.SmartSuggestions,
                itemTwoSmartSuggestions: compareMetadataItemTwo?.SmartSuggestions,
                itemOneIsVisible: compareMetadataItemOne?.IsVisible,
                itemTwoIsVisible: compareMetadataItemTwo?.IsVisible,
                itemOneStatus: compareMetadataItemOne?.Status || "",
                itemTwoStatus: compareMetadataItemTwo?.Status || "",
                itemOneHelpDescription: compareMetadataItemOne?.Description1,
                itemTwoHelpDescription: compareMetadataItemTwo?.Description1,
                itemOneImage: compareMetadataItemOne?.Item_x005F_x0020_Cover,
                itemTwoImage: compareMetadataItemTwo?.Item_x005F_x0020_Cover,
                itemOneChildItems: compareMetadataItemOne?.subRows,
                itemTwoChildItems: compareMetadataItemTwo?.subRows,
                itemOneChildItemsSelected: [],
                itemTwoChildItemsSelected: [],
                itemOneTasks: Props?.sMetadataItemOneTasks,
                itemTwoTasks: Props?.sMetadataItemTwoTasks,
                itemOneTasksSelected: [],
                itemTwoTasksSelected: []
            });
            setIsShowCompare(true)
        }
    }
    const optionsStatus: IDropdownOption[] = [
        { key: '', text: 'Select Status' },
        { key: 'Not Started', text: 'Not Started' },
        { key: 'Draft', text: 'Draft' },
        { key: 'Reviewed', text: 'Reviewed' },
        { key: 'Scheduled', text: 'Scheduled' },
        { key: 'Published', text: 'Published' },
        { key: 'Final', text: 'Final' },
        { key: 'Expired', text: 'Expired' }
    ];
    const onRenderCustomHeaderDocuments = () => {
        return (
            <>
                <div className='subheading siteColor'>
                    Compare SmartMetadata
                </div>
            </>
        );
    };
    //..........................................................................Change button functions for SmartMetadata Compare Popup...................................................................
    const handleTitleChange = (newTitle: any, item: string) => {
        if (item == "compareMetadataItemOne") {
            setState((prevState: any) => ({
                ...prevState,
                itemOneTitle: newTitle
            }));
        }
        else if (item == "compareMetadataItemTwo") {
            setState((prevState: any) => ({
                ...prevState,
                itemTwoTitle: newTitle
            }));
        }
    }
    const handleTaxTypeChange = (newTaxType: any, item: string) => {
        if (item == "compareMetadataItemOne") {
            setState((prevState: any) => ({
                ...prevState,
                itemOneTaxType: newTaxType
            }));
        }
        else if (item == "compareMetadataItemTwo") {
            setState((prevState: any) => ({
                ...prevState,
                itemTwoTaxType: newTaxType
            }));
        }
    }
    const handleSortOrderChange = (newSortOrder: any, item: string) => {
        if (item == "compareMetadataItemOne") {
            setState((prevState: any) => ({
                ...prevState,
                itemOneSortOrder: newSortOrder
            }));
        }
        else if (item == "compareMetadataItemTwo") {
            setState((prevState: any) => ({
                ...prevState,
                itemTwoSortOrder: newSortOrder
            }));
        }
    }
    const handleSmartSuggestionsCheck = (smartSuggestionsChecked: any, item: string) => {
        if (item == "compareMetadataItemOne") {
            setState((prevState: any) => ({
                ...prevState,
                itemOneSmartSuggestions: smartSuggestionsChecked
            }));
        }
        else if (item == "compareMetadataItemTwo") {
            setState((prevState: any) => ({
                ...prevState,
                itemTwoSmartSuggestions: smartSuggestionsChecked
            }));
        }
    }
    const handleIsVisibleCheck = (isVisibleChecked: any, item: string) => {
        if (item == "compareMetadataItemOne") {
            setState((prevState: any) => ({
                ...prevState,
                itemOneIsVisible: isVisibleChecked
            }));
        }
        else if (item == "compareMetadataItemTwo") {
            setState((prevState: any) => ({
                ...prevState,
                itemTwoIsVisible: isVisibleChecked
            }));
        }
    }
    const handleStatusChange = (itemStatus: any, item: string) => {
        if (item == "compareMetadataItemOne") {
            setState((prevState: any) => ({
                ...prevState,
                itemOneStatus: itemStatus.key
            }));
        }
        else if (item == "compareMetadataItemTwo") {
            setState((prevState: any) => ({
                ...prevState,
                itemTwoStatus: itemStatus.key
            }));
        }
    }
    const handleHelpDescriptionChange = (newHelpDescription: any, item: string) => {
        if (item == "compareMetadataItemOne") {
            setState((prevState: any) => ({
                ...prevState,
                itemOneHelpDescription: newHelpDescription
            }));
        }
        else if (item == "compareMetadataItemTwo") {
            setState((prevState: any) => ({
                ...prevState,
                itemTwoHelpDescription: newHelpDescription
            }));
        }
    }
    //...........................................................................Switch Button functions for SmartMetadata Compare Popup.......................................................................
    const handleSwitchTitle = (switchDirection: string) => {
        let title: string;
        if (switchDirection == "oneToTwo") {
            title = state.itemOneTitle;
            setState((prevState: any) => ({
                ...prevState,
                itemTwoTitle: title
            }));
        }
        else if (switchDirection == "twoToOne") {
            title = state.itemTwoTitle;
            setState((prevState: any) => ({
                ...prevState,
                itemOneTitle: title
            }));
        }
    }
    const handleSwitchTaxType = (switchDirection: string) => {
        let taxType: string;
        if (switchDirection == "oneToTwo") {
            taxType = state.itemOneTaxType;
            setState((prevState: any) => ({
                ...prevState,
                itemTwoTaxType: taxType
            }));
        }
        else if (switchDirection == "twoToOne") {
            taxType = state.itemTwoTaxType;
            setState((prevState: any) => ({
                ...prevState,
                itemOneTaxType: taxType
            }));
        }
    }
    const handleSwitchSortOrder = (switchDirection: string) => {
        let sortOrder: string;
        if (switchDirection == "oneToTwo") {
            sortOrder = state.itemOneSortOrder;
            setState((prevState: any) => ({
                ...prevState,
                itemTwoSortOrder: sortOrder
            }));
        }
        else if (switchDirection == "twoToOne") {
            sortOrder = state.itemTwoSortOrder;
            setState((prevState: any) => ({
                ...prevState,
                itemOneSortOrder: sortOrder
            }));
        }
    }
    const handleSwitchSmartSuggestions = (switchDirection: string) => {
        let smartSuggestions: boolean;
        if (switchDirection == "oneToTwo") {
            smartSuggestions = state.itemOneSmartSuggestions;
            setState((prevState: any) => ({
                ...prevState,
                itemTwoSmartSuggestions: smartSuggestions
            }));
        }
        else if (switchDirection == "twoToOne") {
            smartSuggestions = state.itemTwoSmartSuggestions;
            setState((prevState: any) => ({
                ...prevState,
                itemOneSmartSuggestions: smartSuggestions
            }));
        }
    }
    const handleSwitchIsVisible = (switchDirection: string) => {
        let isVisile: boolean;
        if (switchDirection == "oneToTwo") {
            isVisile = state.itemOneIsVisible;
            setState((prevState: any) => ({
                ...prevState,
                itemTwoIsVisible: isVisile
            }));
        }
        else if (switchDirection == "twoToOne") {
            isVisile = state.itemTwoIsVisible;
            setState((prevState: any) => ({
                ...prevState,
                itemOneIsVisible: isVisile
            }));
        }
    }
    const handleSwitchStatus = (switchDirection: string) => {
        let status: string | number;
        if (switchDirection == "oneToTwo") {
            status = state.itemOneStatus;
            setState((prevState: any) => ({
                ...prevState,
                itemTwoStatus: status
            }));
        }
        else if (switchDirection == "twoToOne") {
            status = state.itemTwoStatus;
            setState((prevState: any) => ({
                ...prevState,
                itemOneStatus: status
            }));
        }
    }
    const handleSwitchHelpDescription = (switchDirection: string) => {
        let helpDescription: string;
        if (switchDirection == "oneToTwo") {
            helpDescription = state.itemOneHelpDescription;
            setState((prevState: any) => ({
                ...prevState,
                itemTwoHelpDescription: helpDescription
            }));
        }
        else if (switchDirection == "twoToOne") {
            helpDescription = state.itemTwoHelpDescription;
            setState((prevState: any) => ({
                ...prevState,
                itemOneHelpDescription: helpDescription
            }));
        }
    }
    const handleSwitchChildItems = (switchDirection: string) => {
        let selectedChildItemsId: number[] = [];
        let itemOneChildItems: any = [...state.itemOneChildItems];
        let itemTwoChildItems: any = [...state.itemTwoChildItems];
        if (switchDirection == "oneToTwo") {
            selectedChildItemsId = state.itemOneChildItemsSelected.map((i: any) => { i.ID });
            itemOneChildItems = itemOneChildItems.filter((item: { ID: number; }) => selectedChildItemsId.indexOf(item.ID) == -1);
            itemTwoChildItems = [...state.itemTwoChildItems, ...state.itemOneChildItemsSelected];
        }
        else if (switchDirection == "twoToOne") {
            selectedChildItemsId = state.itemTwoChildItemsSelected.map((i: { ID: any; }) => i.ID);
            itemTwoChildItems = itemTwoChildItems.filter((item: { ID: number; }) => selectedChildItemsId.indexOf(item.ID) == -1);
            itemOneChildItems = [...state.itemOneChildItems, ...state.itemTwoChildItemsSelected];
        }
        setState((prevState: any) => ({
            ...prevState,
            itemOneChildItems: itemOneChildItems,
            itemTwoChildItems: itemTwoChildItems
        }));
    }
    const handleSwitchTasks = (switchDirection: string) => {
        let selectedTasks: any[] = [];
        let itemOneTasks: any[] = [...state.itemOneTasks];
        let itemTwoTasks: any[] = [...state.itemTwoTasks];
        if (switchDirection == "oneToTwo") {
            selectedTasks = state.itemOneTasksSelected.map((i: { ID: any; }) => i.ID);
            itemOneTasks = itemOneTasks.filter(item => selectedTasks.indexOf(item.ID) == -1);
            itemTwoTasks = [...state.itemTwoTasks, ...state.itemOneTasksSelected];
        }
        else if (switchDirection == "twoToOne") {
            selectedTasks = state.itemTwoTasksSelected.map((i: { ID: any; }) => i.ID);
            itemTwoTasks = itemTwoTasks.filter(item => selectedTasks.indexOf(item.ID) == -1);
            itemOneTasks = [...state.itemOneTasks, ...state.itemTwoTasksSelected];
        }
        setState((prevState: any) => ({
            ...prevState,
            itemOneTasks: itemOneTasks,
            itemTwoTasks: itemTwoTasks
        }));
    }
    const handleSwitchItems = () => {
        setState({
            itemOneTitle: state.itemTwoTitle,
            itemOneTaxType: state.itemTwoTaxType,
            itemOneSortOrder: state.itemTwoSortOrder,
            itemOneSmartSuggestions: state.itemTwoSmartSuggestions,
            itemOneIsVisible: state.itemTwoIsVisible,
            itemOneStatus: state.itemTwoStatus,
            itemOneHelpDescription: state.itemTwoHelpDescription,
            itemTwoTitle: state.itemOneTitle,
            itemTwoTaxType: state.itemOneTaxType,
            itemTwoSortOrder: state.itemOneSortOrder,
            itemTwoSmartSuggestions: state.itemOneSmartSuggestions,
            itemTwoIsVisible: state.itemOneIsVisible,
            itemTwoStatus: state.itemOneStatus,
            itemTwoHelpDescription: state.itemOneHelpDescription
        });
    }
    //.............................................................................Undo button funcations for SmartMetadata Compare Popup....................................................................
    const handleUndoTitle = () => {
        setState((prevState: any) => ({
            ...prevState,
            itemOneTitle: compareMetadataItemOne.Title,
            itemTwoTitle: compareMetadataItemTwo.Title
        }));
    }
    const handleUndoTaxType = () => {
        setState((prevState: any) => ({
            ...prevState,
            itemOneTaxType: compareMetadataItemOne.TaxType,
            itemTwoTaxType: compareMetadataItemTwo.TaxType
        }));
    }
    const handleUndoSortOrder = () => {
        setState((prevState: any) => ({
            ...prevState,
            itemOneSortOrder: compareMetadataItemOne.SortOrder,
            itemTwoSortOrder: compareMetadataItemTwo.SortOrder
        }));
    }
    const handleUndoSmartSuggestions = () => {
        setState((prevState: any) => ({
            ...prevState,
            itemOneSmartSuggestions: compareMetadataItemOne.SmartSuggestions,
            itemTwoSmartSuggestions: compareMetadataItemTwo.SmartSuggestions
        }));
    }
    const handleUndoIsVisible = () => {
        setState((prevState: any) => ({
            ...prevState,
            itemOneIsVisible: compareMetadataItemOne.IsVisible,
            itemTwoIsVisible: compareMetadataItemTwo.IsVisible
        }));
    }
    const handleUndoStatus = () => {
        setState((prevState: any) => ({
            ...prevState,
            itemOneStatus: compareMetadataItemOne.Status || "",
            itemTwoStatus: compareMetadataItemTwo.Status || ""
        }));
    }
    const handleUndoHelpDescription = () => {
        setState((prevState: any) => ({
            ...prevState,
            itemOneHelpDescription: compareMetadataItemOne.Description1,
            itemTwoHelpDescription: compareMetadataItemTwo.Description1
        }));
    }
    const handleUndoChildItems = () => {
        setState((prevState: any) => ({
            ...prevState,
            itemOneChildItems: compareMetadataItemOne.subRows,
            itemTwoChildItems: compareMetadataItemTwo.subRows
        }));
    }
    const handleUndoTasks = () => {
        setState((prevState: any) => ({
            ...prevState,
            itemOneTasks: Props.sMetadataItemOneTasks,
            itemTwoTasks: Props.sMetadataItemTwoTasks
        }));
    }
    const handleUndoItems = () => {
        setState({
            itemOneTitle: compareMetadataItemOne.Title,
            itemOneTaxType: compareMetadataItemOne.TaxType,
            itemOneSortOrder: compareMetadataItemOne.SortOrder,
            itemOneSmartSuggestions: compareMetadataItemOne.SmartSuggestions,
            itemOneIsVisible: compareMetadataItemOne.IsVisible,
            itemOneStatus: compareMetadataItemOne.Status || "",
            itemOneHelpDescription: compareMetadataItemOne.Description1,
            itemTwoTitle: compareMetadataItemTwo.Title,
            itemTwoTaxType: compareMetadataItemTwo.TaxType,
            itemTwoSortOrder: compareMetadataItemTwo.SortOrder,
            itemTwoSmartSuggestions: compareMetadataItemTwo.SmartSuggestions,
            itemTwoIsVisible: compareMetadataItemTwo.IsVisible,
            itemTwoStatus: compareMetadataItemTwo.Status || "",
            itemTwoHelpDescription: compareMetadataItemTwo.Description1
        });
    }
    //..................................................................Child && Tasks button funcations for Compare SmartMetadata items.............................................................
    const handleItemOneChildCheck = (isChecked: any, childItem: any) => {
        let itemOneChildren: any = [];
        if (isChecked) {
            itemOneChildren = [...state.itemOneChildItemsSelected].concat(childItem);
        }
        else {
            itemOneChildren = [...state.itemOneChildItemsSelected].filter(i => i.ID != childItem.ID);
        }
        setState({
            itemOneChildItemsSelected: itemOneChildren
        });
    }

    const handleItemTwoChildCheck = (isChecked: any, childItem: any) => {
        let itemTwoChildren: any = [];
        if (isChecked) {
            itemTwoChildren = [...state.itemTwoChildItemsSelected].concat(childItem);
        }
        else {
            itemTwoChildren = [...state.itemTwoChildItemsSelected].filter(i => i.ID != childItem.ID);
        }
        setState({
            itemTwoChildItemsSelected: itemTwoChildren
        });
    }

    const handleItemOneTasksCheck = (isChecked: any, taskItem: any) => {
        let itemOneTasks: any[] = [];
        if (isChecked) {
            itemOneTasks = [...state.itemOneTasksSelected].concat(taskItem);
        }
        else {
            itemOneTasks = [...state.itemOneTasksSelected].filter(i => i.ID != taskItem.ID);
        }
        setState({
            itemOneTasksSelected: itemOneTasks
        });
    }

    const handleItemTwoTasksCheck = (isChecked: any, taskItem: any) => {
        let itemTwoTasks: any[] = [];
        if (isChecked) {
            itemTwoTasks = [...state.itemOneTasksSelected].concat(taskItem);
        }
        else {
            itemTwoTasks = [...state.itemTwoTasksSelected].filter(i => i.ID != taskItem.ID);
        }
        setState({
            itemTwoTasksSelected: itemTwoTasks
        });
    }
    //.................................................................Update button funcations for  SmartMetadata Compare SmartMetadata items..................................................
    const handleUpdateSmartMetadataClick = (item: any) => {

    }
    return (
        <>
            <div>
                <button type="button" title="Compare" onClick={openComparePopup} className='btnCol btn btn-primary'>Compare</button>
            </div>
            {isShowCompare && (<div>
                <Panel
                    title="popup-title"
                    isOpen={true}
                    onDismiss={closeComparepopup}
                    type={PanelType.custom}
                    isBlocking={false}
                    onRenderHeader={onRenderCustomHeaderDocuments}
                    customWidth="750px"
                >
                    <Container fluid className="CompareSmartpopup">
                        <Row className="Metadatapannel ">
                            <Col sm="5" md="5" lg="5">
                                <Label>{state.itemOneTitle}</Label>
                            </Col>
                            <Col sm="1" md="1" lg="1" className="text-center"><TbArrowsExchange size="48" onClick={handleSwitchItems} /></Col>
                            <Col sm="5" md="5" lg="5">
                                <Label>{state.itemTwoTitle}</Label>
                            </Col>
                            <Col sm="1" md="1" lg="1">
                                <LuUndo2 size="25" onClick={handleUndoItems} />
                            </Col>
                        </Row>
                        <Row className="Metadatapannel ">
                            <Col sm="5" md="5" lg="5">
                                <TextField label="Title" value={state.itemOneTitle} onChange={(ev, newVal) => handleTitleChange(newVal, compareMetadataItemOne)} />
                            </Col>
                            <Col sm="1" md="1" lg="1" >
                                <div className="text-center">
                                    <div><LiaArrowLeftSolid size="24" onClick={() => handleSwitchTitle("twoToOne")} /></div>
                                    <div><LiaArrowRightSolid size="24" onClick={() => handleSwitchTitle("oneToTwo")} /></div>
                                </div>
                            </Col>
                            <Col sm="5" md="5" lg="5">
                                <TextField label="Title" value={state.itemTwoTitle} onChange={(ev, newVal) => handleTitleChange(newVal, compareMetadataItemTwo)} />
                            </Col>
                            <Col sm="1" md="1" lg="1">
                                <LuUndo2 size="25" onClick={handleUndoTitle} />
                            </Col>
                        </Row>
                        <Row className="Metadatapannel ">
                            <Col sm="5" md="5" lg="5">
                                <TextField label="Tax Type" value={state.itemOneTaxType} onChange={(ev, newVal) => handleTaxTypeChange(newVal, compareMetadataItemOne)} />
                            </Col>
                            <Col sm="1" md="1" lg="1">
                                <div className="text-center">
                                    <div><LiaArrowLeftSolid size="24" onClick={() => handleSwitchTaxType("twoToOne")} /></div>
                                    <div><LiaArrowRightSolid size="24" onClick={() => handleSwitchTaxType("oneToTwo")} /></div>
                                </div>
                            </Col>
                            <Col sm="5" md="5" lg="5">
                                <TextField label="Tax Type" value={state.itemTwoTaxType} onChange={(ev, newVal) => handleTaxTypeChange(newVal, compareMetadataItemTwo)} />
                            </Col>
                            <Col sm="1" md="1" lg="1">
                                <LuUndo2 size="25" onClick={handleUndoTaxType} />
                            </Col>
                        </Row>
                        <Row className="Metadatapannel ">
                            <Col sm="5" md="5" lg="5">
                                <TextField label="Sort Order" value={state.itemOneSortOrder} onChange={(ev, newVal) => handleSortOrderChange(newVal, compareMetadataItemOne)} />
                            </Col>
                            <Col sm="1" md="1" lg="1">
                                <div className="text-center">
                                    <div><LiaArrowLeftSolid size="24" onClick={() => handleSwitchSortOrder("twoToOne")} /></div>
                                    <div><LiaArrowRightSolid size="24" onClick={() => handleSwitchSortOrder("oneToTwo")} /></div>
                                </div>
                            </Col>
                            <Col sm="5" md="5" lg="5">
                                <TextField label="Sort Order" value={state.itemTwoSortOrder} onChange={(ev, newVal) => handleSortOrderChange(newVal, compareMetadataItemTwo)} />
                            </Col>
                            <Col sm="1" md="1" lg="1">
                                <LuUndo2 size="25" onClick={handleUndoSortOrder} />
                            </Col>
                        </Row>
                        <Row className="Metadatapannel">
                            <Col sm="5" md="5" lg="5">
                                <Checkbox label="Smart Suggestions" checked={state.itemOneSmartSuggestions} onChange={(ev, checked) => handleSmartSuggestionsCheck(checked, compareMetadataItemOne)} />
                            </Col>
                            <Col sm="1" md="1" lg="1">
                                <div className="text-center">
                                    <div><LiaArrowLeftSolid size="24" onClick={() => handleSwitchSmartSuggestions("twoToOne")} /></div>
                                    <div><LiaArrowRightSolid size="24" onClick={() => handleSwitchSmartSuggestions("oneToTwo")} /></div>
                                </div>
                            </Col>
                            <Col sm="5" md="5" lg="5">
                                <Checkbox label="Smart Suggestions" checked={state.itemTwoSmartSuggestions} onChange={(ev, checked) => handleSmartSuggestionsCheck(checked, compareMetadataItemTwo)} />
                            </Col>
                            <Col sm="1" md="1" lg="1">
                                <LuUndo2 size="25" onClick={handleUndoSmartSuggestions} />
                            </Col>
                        </Row>
                        <Row className="Metadatapannel">
                            <Col sm="5" md="5" lg="5">
                                <Checkbox label="Is Visible" checked={state.itemOneIsVisible} onChange={(ev, checked) => handleIsVisibleCheck(checked, compareMetadataItemOne)} />
                            </Col>
                            <Col sm="1" md="1" lg="1">
                                <div className="text-center">
                                    <div><LiaArrowLeftSolid size="24" onClick={() => handleSwitchIsVisible("twoToOne")} /></div>
                                    <div><LiaArrowRightSolid size="24" onClick={() => handleSwitchIsVisible("oneToTwo")} /></div>
                                </div>
                            </Col>
                            <Col sm="5" md="5" lg="5">
                                <Checkbox label="Is Visible" checked={state.itemTwoIsVisible} onChange={(ev, checked) => handleIsVisibleCheck(checked, compareMetadataItemTwo)} />
                            </Col>
                            <Col sm="1" md="1" lg="1">
                                <LuUndo2 size="25" onClick={handleUndoIsVisible} />
                            </Col>
                        </Row>
                        <Row className="Metadatapannel">
                            <Col sm="5" md="5" lg="5">
                                <Dropdown label="Status" calloutProps={{ doNotLayer: true }} options={optionsStatus} selectedKey={state.itemOneStatus} onChange={(ev, option) => handleStatusChange(option, compareMetadataItemOne)} />
                            </Col>
                            <Col sm="1" md="1" lg="1">
                                <div className="text-center">
                                    <div><LiaArrowLeftSolid size="24" onClick={() => handleSwitchStatus("twoToOne")} /></div>
                                    <div><LiaArrowRightSolid size="24" onClick={() => handleSwitchStatus("oneToTwo")} /></div>
                                </div>
                            </Col>
                            <Col sm="5" md="5" lg="5">
                                <Dropdown label="Status" calloutProps={{ doNotLayer: true }} options={optionsStatus} selectedKey={state.itemTwoStatus} onChange={(ev, option) => handleStatusChange(option, compareMetadataItemTwo)} />
                            </Col>
                            <Col sm="1" md="1" lg="1">
                                <LuUndo2 size="25" onClick={handleUndoStatus} />
                            </Col>
                        </Row>
                        <Row className="Metadatapannel">
                            <Col sm="5" md="5" lg="5">
                                <TextField label="Help Description" multiline rows={3} value={state.itemOneHelpDescription} onChange={(ev, newVal) => handleHelpDescriptionChange(newVal, compareMetadataItemOne)} />
                            </Col>
                            <Col sm="1" md="1" lg="1">
                                <div className="text-center">
                                    <div><LiaArrowLeftSolid size="24" onClick={() => handleSwitchHelpDescription("twoToOne")} /></div>
                                    <div><LiaArrowRightSolid size="24" onClick={() => handleSwitchHelpDescription("oneToTwo")} /></div>
                                </div>
                            </Col>
                            <Col sm="5" md="5" lg="5">
                                <TextField label="Help Description" multiline rows={3} value={state.itemTwoHelpDescription} onChange={(ev, newVal) => handleHelpDescriptionChange(newVal, compareMetadataItemTwo)} />
                            </Col>
                            <Col sm="1" md="1" lg="1">
                                <LuUndo2 size="25" onClick={handleUndoHelpDescription} />
                            </Col>
                        </Row>
                        <Row className="Metadatapannel">
                            <Col sm="5" md="5" lg="5">
                                <Text>Tasks</Text>
                                {
                                    state.itemOneTasks?.map((taskItem: { Title: string | undefined; ID: any; }) => <Checkbox label={taskItem.Title} checked={state.itemOneTasksSelected?.map((i: { ID: any; }) => i.ID).indexOf(taskItem.ID) > -1} onChange={(ev, isChecked) => handleItemOneTasksCheck(isChecked, taskItem)} />)
                                }
                            </Col>
                            <Col sm="1" md="1" lg="1">
                                <div className="text-center">
                                    <div><LiaArrowLeftSolid size="24" onClick={() => handleSwitchTasks("twoToOne")} /></div>
                                    <div><LiaArrowRightSolid size="24" onClick={() => handleSwitchTasks("oneToTwo")} /></div>
                                </div>
                            </Col>
                            <Col sm="5" md="5" lg="5">
                                <Text>Tasks</Text>
                                {
                                    state.itemTwoTasks?.map((taskItem: { Title: string | undefined; ID: any; }) => <Checkbox label={taskItem.Title} checked={state.itemTwoTasksSelected?.map((i: { ID: any; }) => i.ID).indexOf(taskItem.ID) > -1} onChange={(ev, isChecked) => handleItemTwoTasksCheck(isChecked, taskItem)} />)
                                }
                            </Col>
                            <Col sm="1" md="1" lg="1">
                                <LuUndo2 size="25" onClick={() => handleUndoTasks()} />
                            </Col>
                        </Row>
                        <Row className="Metadatapannel">
                            <Col sm="5" md="5" lg="5">
                                <Text>Childs</Text>
                                {
                                    state.itemOneChildItems?.map((childItem: { Title: string | undefined; ID: any; }) => <Checkbox label={childItem.Title} checked={state.itemOneChildItemsSelected.map((i: { ID: any; }) => i.ID).indexOf(childItem.ID) > -1} onChange={(ev, isChecked) => handleItemOneChildCheck(isChecked, childItem)} />)
                                }
                            </Col>
                            <Col sm="1" md="1" lg="1">
                                <div className="text-center">
                                    <div><LiaArrowLeftSolid size="24" onClick={() => handleSwitchChildItems("twoToOne")} /></div>
                                    <div><LiaArrowRightSolid size="24" onClick={() => handleSwitchChildItems("oneToTwo")} /></div>
                                </div>
                            </Col>
                            <Col sm="5" md="5" lg="5">
                                <Text>Childs</Text>
                                {
                                    state.itemTwoChildItems?.map((childItem: { Title: string | undefined; ID: any; }) => <Checkbox label={childItem.Title} checked={state.itemTwoChildItemsSelected.map((i: { ID: any; }) => i.ID).indexOf(childItem.ID) > -1} onChange={(ev, isChecked) => handleItemTwoChildCheck(isChecked, childItem)} />)
                                }
                            </Col>
                            <Col sm="1" md="1" lg="1">
                                <LuUndo2 size="25" onClick={() => handleUndoChildItems()} />
                            </Col>
                        </Row>
                    </Container>
                    <div className='text-end'>
                        <button className=' btnCol btn btn-primary' onClick={() => handleUpdateSmartMetadataClick("UpdateAndKeepOne")}>Update & Keep 1</button>
                        <button className='btnCol btn btn-primary mx-2' onClick={() => handleUpdateSmartMetadataClick("UpdateAndKeepTwo")}>Update & Keep 2</button>
                        <button className='btnCol btn btn-primary' onClick={() => handleUpdateSmartMetadataClick("UpdateAndKeepBoth")}>Update & Keep both</button>
                    </div>
                </Panel>
            </div>)}
        </>
    );
}