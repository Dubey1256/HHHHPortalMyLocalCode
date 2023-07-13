import * as React from "react";
import IModalCompareSmartMetadataProps from "./IModalCompareSmartMetadataProps";
import IModalCompareSmartMetadataState from "./IModalCompareSmartMetadataState";
import { Button, Col, Container, Modal, Row } from "react-bootstrap";
import * as Icon from 'react-bootstrap-icons';
import { TbArrowsExchange} from "react-icons/tb";
import { LuUndo2} from "react-icons/lu";
import { Checkbox, Dropdown, IDropdownOption, Label, Text, TextField } from "@fluentui/react";
import { ISmartMetadataItem } from "../ISmartMetadataItem";

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

class ModalCompareSmartMetadata extends React.Component<IModalCompareSmartMetadataProps, IModalCompareSmartMetadataState> {

    private itemOne: ISmartMetadataItem = null;
    private itemTwo: ISmartMetadataItem = null;

    constructor(props: IModalCompareSmartMetadataProps, state: IModalCompareSmartMetadataState) {
        super(props);

        this.itemOne = this.props.sMetadataItemOne;
        this.itemTwo = this.props.sMetadataItemTwo;

        const itemOne = this.itemOne;
        const itemTwo = this.itemTwo;

        this.state = {
            itemOneTitle: itemOne.Title,
            itemTwoTitle: itemTwo.Title,
            itemOneTaxType: itemOne.TaxType,
            itemTwoTaxType: itemTwo.TaxType,
            itemOneSortOrder: itemOne.SortOrder,
            itemTwoSortOrder: itemTwo.SortOrder,
            itemOneSmartSuggestions: itemOne.SmartSuggestions,
            itemTwoSmartSuggestions: itemTwo.SmartSuggestions,
            itemOneIsVisible: itemOne.IsVisible,
            itemTwoIsVisible: itemTwo.IsVisible,
            itemOneStatus: itemOne.Status || "",
            itemTwoStatus: itemTwo.Status || "",
            itemOneHelpDescription: itemOne.Description1,
            itemTwoHelpDescription: itemTwo.Description1,
            itemOneImage: itemOne.Item_x005F_x0020_Cover,
            itemTwoImage: itemTwo.Item_x005F_x0020_Cover,
            itemOneChildItems: itemOne.subRows,
            itemTwoChildItems: itemTwo.subRows,
            itemOneChildItemsSelected: [],
            itemTwoChildItemsSelected: [],
            itemOneTasks: this.props.sMetadataItemOneTasks,
            itemTwoTasks: this.props.sMetadataItemTwoTasks,
            itemOneTasksSelected: [],
            itemTwoTasksSelected: []
        };

        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleTaxTypeChange = this.handleTaxTypeChange.bind(this);
        this.handleSortOrderChange = this.handleSortOrderChange.bind(this);
        this.handleSmartSuggestionsCheck = this.handleSmartSuggestionsCheck.bind(this);
        this.handleIsVisibleCheck = this.handleIsVisibleCheck.bind(this);
        this.handleStatusChange = this.handleStatusChange.bind(this);
        this.handleHelpDescriptionChange = this.handleHelpDescriptionChange.bind(this);

        this.handleSwitchTitle = this.handleSwitchTitle.bind(this);
        this.handleSwitchTaxType = this.handleSwitchTaxType.bind(this);
        this.handleSwitchSortOrder = this.handleSwitchSortOrder.bind(this);
        this.handleSwitchSmartSuggestions = this.handleSwitchSmartSuggestions.bind(this);
        this.handleSwitchIsVisible = this.handleSwitchIsVisible.bind(this);
        this.handleSwitchStatus = this.handleSwitchStatus.bind(this);
        this.handleSwitchHelpDescription = this.handleSwitchHelpDescription.bind(this);
        this.handleSwitchChildItems = this.handleSwitchChildItems.bind(this);
        this.handleSwitchTasks = this.handleSwitchTasks.bind(this);
        this.handleSwitchItems = this.handleSwitchItems.bind(this);

        this.handleUndoTitle = this.handleUndoTitle.bind(this);
        this.handleUndoTaxType = this.handleUndoTaxType.bind(this);
        this.handleUndoSortOrder = this.handleUndoSortOrder.bind(this);
        this.handleUndoSmartSuggestions = this.handleUndoSmartSuggestions.bind(this);
        this.handleUndoIsVisible = this.handleUndoIsVisible.bind(this);
        this.handleUndoStatus = this.handleUndoStatus.bind(this);
        this.handleUndoHelpDescription = this.handleUndoHelpDescription.bind(this);
        this.handleUndoChildItems = this.handleUndoChildItems.bind(this);
        this.handleUndoTasks = this.handleUndoTasks.bind(this);
        this.handleUndoItems = this.handleUndoItems.bind(this);

        this.handleItemOneChildCheck = this.handleItemOneChildCheck.bind(this);
        this.handleItemTwoChildCheck = this.handleItemTwoChildCheck.bind(this);
        this.handleItemOneTasksCheck = this.handleItemOneTasksCheck.bind(this);
        this.handleItemTwoTasksCheck = this.handleItemTwoTasksCheck.bind(this);

        this.handleUpdateSmartMetadataClick = this.handleUpdateSmartMetadataClick.bind(this);

    }

    private handleTitleChange(newTitle: string, item: string) {
       if(item=="itemOne") {
        this.setState({
            itemOneTitle: newTitle
        });
       }
       else if(item=="itemTwo") {
        this.setState({
            itemTwoTitle: newTitle
        });
       }
    }

    private handleTaxTypeChange(newTaxType: string, item: string) {
        if(item=="itemOne") {
            this.setState({
                itemOneTaxType: newTaxType
            });
           }
           else if(item=="itemTwo") {
            this.setState({
                itemTwoTaxType: newTaxType
            });
        }
    }

    private handleSortOrderChange(newSortOrder: string, item: string) {
        if(item=="itemOne") {
            this.setState({
                itemOneSortOrder: newSortOrder
            });
        }
        else if(item=="itemTwo") {
            this.setState({
                itemTwoSortOrder: newSortOrder
            });
        }
    }

    private handleSmartSuggestionsCheck(smartSuggestionsChecked: boolean, item: string) {
        if(item=="itemOne") {
            this.setState({
                itemOneSmartSuggestions: smartSuggestionsChecked
            });
        }
        else if(item=="itemTwo") {
            this.setState({
                itemTwoSmartSuggestions: smartSuggestionsChecked
            });
        }
    }

    private handleIsVisibleCheck(isVisibleChecked: boolean, item: string) {
        if(item=="itemOne") {
            this.setState({
                itemOneIsVisible: isVisibleChecked
            });
        }
        else if(item=="itemTwo") {
            this.setState({
                itemTwoIsVisible: isVisibleChecked
            });
        }
    }

    private handleStatusChange(itemStatus: IDropdownOption, item: string) {
        if(item=="itemOne") {
            this.setState({
                itemOneStatus: itemStatus.key
            });
        }
        else if(item=="itemTwo") {
            this.setState({
                itemTwoStatus: itemStatus.key
            });
        }
    }

    private handleHelpDescriptionChange(newHelpDescription: string, item: string) {
        if(item=="itemOne") {
            this.setState({
                itemOneHelpDescription: newHelpDescription
            });
        }
        else if(item=="itemTwo") {
            this.setState({
                itemTwoHelpDescription: newHelpDescription
            });
        }
    }

    private handleSwitchTitle(switchDirection: string) {
        let title: string;
        if(switchDirection == "oneToTwo") {
            title = this.state.itemOneTitle;
            this.setState({
                itemTwoTitle: title
            });
        }
        else if(switchDirection == "twoToOne") {
            title = this.state.itemTwoTitle;
            this.setState({
                itemOneTitle: title
            });
        }
    }

    private handleSwitchTaxType(switchDirection: string) {
        let taxType: string;
        if(switchDirection == "oneToTwo") {
            taxType = this.state.itemOneTaxType;
            this.setState({
                itemTwoTaxType: taxType
            });
        }
        else if(switchDirection == "twoToOne") {
            taxType = this.state.itemTwoTaxType;
            this.setState({
                itemOneTaxType: taxType
            });
        }
    }

    private handleSwitchSortOrder(switchDirection: string) {
        let sortOrder: string;
        if(switchDirection == "oneToTwo") {
            sortOrder = this.state.itemOneSortOrder;
            this.setState({
                itemTwoSortOrder: sortOrder
            });
        }
        else if(switchDirection == "twoToOne") {
            sortOrder = this.state.itemTwoSortOrder;
            this.setState({
                itemOneSortOrder: sortOrder
            });
        }
    }

    private handleSwitchSmartSuggestions(switchDirection: string) {
        let smartSuggestions: boolean;
        if(switchDirection == "oneToTwo") {
            smartSuggestions = this.state.itemOneSmartSuggestions;
            this.setState({
                itemTwoSmartSuggestions: smartSuggestions
            });
        }
        else if(switchDirection == "twoToOne") {
            smartSuggestions = this.state.itemTwoSmartSuggestions;
            this.setState({
                itemOneSmartSuggestions: smartSuggestions
            });
        }
    }

    private handleSwitchIsVisible(switchDirection: string) {
        let isVisile: boolean;
        if(switchDirection == "oneToTwo") {
            isVisile = this.state.itemOneIsVisible;
            this.setState({
                itemTwoIsVisible: isVisile
            });
        }
        else if(switchDirection == "twoToOne") {
            isVisile = this.state.itemTwoIsVisible;
            this.setState({
                itemOneIsVisible: isVisile
            });
        }
    }

    private handleSwitchStatus(switchDirection: string) {
        let status: string | number;
        if(switchDirection == "oneToTwo") {
            status = this.state.itemOneStatus;
            this.setState({
                itemTwoStatus: status
            });
        }
        else if(switchDirection == "twoToOne") {
            status = this.state.itemTwoStatus;
            this.setState({
                itemOneStatus: status
            });
        }
    }

    private handleSwitchHelpDescription(switchDirection: string) {
        let helpDescription: string;
        if(switchDirection == "oneToTwo") {
            helpDescription = this.state.itemOneHelpDescription;
            this.setState({
                itemTwoHelpDescription: helpDescription
            });
        }
        else if(switchDirection == "twoToOne") {
            helpDescription = this.state.itemTwoHelpDescription;
            this.setState({
                itemOneHelpDescription: helpDescription
            });
        }
    }

    private handleSwitchChildItems(switchDirection: string) {
        let selectedChildItemsId: number[] = [];
        let itemOneChildItems: ISmartMetadataItem[] = [...this.state.itemOneChildItems];
        let itemTwoChildItems: ISmartMetadataItem[] = [...this.state.itemTwoChildItems];
        if(switchDirection=="oneToTwo") {
            selectedChildItemsId = this.state.itemOneChildItemsSelected.map(i=>i.ID);
            itemOneChildItems = itemOneChildItems.filter(item=>selectedChildItemsId.indexOf(item.ID)==-1);
            itemTwoChildItems = [...this.state.itemTwoChildItems, ...this.state.itemOneChildItemsSelected];
        }
        else if(switchDirection=="twoToOne") {
            selectedChildItemsId = this.state.itemTwoChildItemsSelected.map(i=>i.ID);
            itemTwoChildItems = itemTwoChildItems.filter(item=>selectedChildItemsId.indexOf(item.ID)==-1);
            itemOneChildItems = [...this.state.itemOneChildItems, ...this.state.itemTwoChildItemsSelected];
        }
        this.setState({
            itemOneChildItems: itemOneChildItems,
            itemTwoChildItems: itemTwoChildItems
        });
    }

    private handleSwitchTasks(switchDirection: string) {
        let selectedTasks: any[] = [];
        let itemOneTasks: any[] = [...this.state.itemOneTasks];
        let itemTwoTasks: any[] = [...this.state.itemTwoTasks];
        if(switchDirection=="oneToTwo") {
            selectedTasks = this.state.itemOneTasksSelected.map(i=>i.ID);
            itemOneTasks = itemOneTasks.filter(item=>selectedTasks.indexOf(item.ID)==-1);
            itemTwoTasks = [...this.state.itemTwoTasks, ...this.state.itemOneTasksSelected];
        }
        else if(switchDirection=="twoToOne") {
            selectedTasks = this.state.itemTwoTasksSelected.map(i=>i.ID);
            itemTwoTasks = itemTwoTasks.filter(item=>selectedTasks.indexOf(item.ID)==-1);
            itemOneTasks = [...this.state.itemOneTasks, ...this.state.itemTwoTasksSelected];
        }
        this.setState({
            itemOneTasks: itemOneTasks,
            itemTwoTasks: itemTwoTasks
        });
    }

    private handleSwitchItems() {
        this.setState({
            itemOneTitle: this.state.itemTwoTitle,
            itemOneTaxType: this.state.itemTwoTaxType,
            itemOneSortOrder: this.state.itemTwoSortOrder,
            itemOneSmartSuggestions: this.state.itemTwoSmartSuggestions,
            itemOneIsVisible: this.state.itemTwoIsVisible,
            itemOneStatus: this.state.itemTwoStatus,
            itemOneHelpDescription: this.state.itemTwoHelpDescription,
            itemTwoTitle: this.state.itemOneTitle,
            itemTwoTaxType: this.state.itemOneTaxType,
            itemTwoSortOrder: this.state.itemOneSortOrder,
            itemTwoSmartSuggestions: this.state.itemOneSmartSuggestions,
            itemTwoIsVisible: this.state.itemOneIsVisible,
            itemTwoStatus: this.state.itemOneStatus,
            itemTwoHelpDescription: this.state.itemOneHelpDescription
        });
    }

    private handleUndoTitle() {
        this.setState({
            itemOneTitle: this.itemOne.Title,
            itemTwoTitle: this.itemTwo.Title
        });
    }

    private handleUndoTaxType() {
        this.setState({
            itemOneTaxType: this.itemOne.TaxType,
            itemTwoTaxType: this.itemTwo.TaxType
        });
    }

    private handleUndoSortOrder() {
        this.setState({
            itemOneSortOrder: this.itemOne.SortOrder,
            itemTwoSortOrder: this.itemTwo.SortOrder
        });
    }

    private handleUndoSmartSuggestions() {
        this.setState({
            itemOneSmartSuggestions: this.itemOne.SmartSuggestions,
            itemTwoSmartSuggestions: this.itemTwo.SmartSuggestions
        });
    }

    private handleUndoIsVisible() {
        this.setState({
            itemOneIsVisible: this.itemOne.IsVisible,
            itemTwoIsVisible: this.itemTwo.IsVisible
        });
    }

    private handleUndoStatus() {
        this.setState({
            itemOneStatus: this.itemOne.Status || "",
            itemTwoStatus: this.itemTwo.Status || ""
        });
    }

    private handleUndoHelpDescription() {
        this.setState({
            itemOneHelpDescription: this.itemOne.Description1,
            itemTwoHelpDescription: this.itemTwo.Description1
        });
    }

    private handleUndoChildItems() {
        this.setState({
            itemOneChildItems: this.itemOne.subRows,
            itemTwoChildItems: this.itemTwo.subRows
        });
    }

    private handleUndoTasks() {
        this.setState({
            itemOneTasks: this.props.sMetadataItemOneTasks,
            itemTwoTasks: this.props.sMetadataItemTwoTasks
        });
    }

    private handleUndoItems() {
        const itemOne: ISmartMetadataItem = this.itemOne;
        const itemTwo: ISmartMetadataItem = this.itemTwo;
         this.setState({
            itemOneTitle: itemOne.Title,
            itemOneTaxType: itemOne.TaxType,
            itemOneSortOrder: itemOne.SortOrder,
            itemOneSmartSuggestions: itemOne.SmartSuggestions,
            itemOneIsVisible: itemOne.IsVisible,
            itemOneStatus: itemOne.Status || "",
            itemOneHelpDescription: itemOne.Description1,
            itemTwoTitle: itemTwo.Title,
            itemTwoTaxType: itemTwo.TaxType,
            itemTwoSortOrder: itemTwo.SortOrder,
            itemTwoSmartSuggestions: itemTwo.SmartSuggestions,
            itemTwoIsVisible: itemTwo.IsVisible,
            itemTwoStatus: itemTwo.Status || "",
            itemTwoHelpDescription: itemTwo.Description1
        });
    }

    private handleUpdateSmartMetadataClick(updateType: string) {       
        const updateSMetadataItemOne: ISmartMetadataItem = {
            Title: this.state.itemOneTitle,
            TaxType: this.state.itemOneTaxType,
            SortOrder: this.state.itemOneSortOrder,
            SmartSuggestions: this.state.itemOneSmartSuggestions,
            IsVisible: this.state.itemOneIsVisible,
            Status: this.state.itemOneStatus,
            Description1: this.state.itemOneHelpDescription
        };
        const updateSMetadataItemTwo: ISmartMetadataItem = {
            Title: this.state.itemTwoTitle,
            TaxType: this.state.itemTwoTaxType,
            SortOrder: this.state.itemTwoSortOrder,
            SmartSuggestions: this.state.itemTwoSmartSuggestions,
            IsVisible: this.state.itemTwoIsVisible,
            Status: this.state.itemTwoStatus,
            Description1: this.state.itemTwoHelpDescription
        };
        this.props.compareAndUpdateSmartMetadata(updateType, this.itemOne.ID, this.itemTwo.ID, updateSMetadataItemOne, updateSMetadataItemTwo, this.state.itemOneChildItems, this.state.itemTwoChildItems, this.state.itemOneTasks, this.state.itemTwoTasks);
    }
    
    private handleItemOneChildCheck(isChecked: boolean, childItem: ISmartMetadataItem) {
        let itemOneChildren: ISmartMetadataItem[] = [];
        if(isChecked) {
            itemOneChildren = [...this.state.itemOneChildItemsSelected].concat(childItem);       
        }
        else {
            itemOneChildren = [...this.state.itemOneChildItemsSelected].filter(i=>i.ID!=childItem.ID);
        }
        this.setState({
            itemOneChildItemsSelected: itemOneChildren
        });
    }

    private handleItemTwoChildCheck(isChecked: boolean, childItem: ISmartMetadataItem) {
        let itemTwoChildren: ISmartMetadataItem[] = [];
        if(isChecked) {
            itemTwoChildren = [...this.state.itemTwoChildItemsSelected].concat(childItem);       
        }
        else {
            itemTwoChildren = [...this.state.itemTwoChildItemsSelected].filter(i=>i.ID!=childItem.ID);
        }
        this.setState({
            itemTwoChildItemsSelected: itemTwoChildren
        });
    }

    private handleItemOneTasksCheck(isChecked: boolean, taskItem: any) {
        let itemOneTasks: any[] = [];
        if(isChecked) {
            itemOneTasks = [...this.state.itemOneTasksSelected].concat(taskItem);       
        }
        else {
            itemOneTasks = [...this.state.itemOneTasksSelected].filter(i=>i.ID!=taskItem.ID);
        }
        this.setState({
            itemOneTasksSelected: itemOneTasks
        });
    }

    private handleItemTwoTasksCheck(isChecked: boolean, taskItem: any) {
        let itemTwoTasks: any[] = [];
        if(isChecked) {
            itemTwoTasks = [...this.state.itemOneTasksSelected].concat(taskItem);       
        }
        else {
            itemTwoTasks = [...this.state.itemTwoTasksSelected].filter(i=>i.ID!=taskItem.ID);
        }
        this.setState({
            itemTwoTasksSelected: itemTwoTasks
        });
    }

    render() {

        const elemCompareItems = (
            <Container fluid className="CompareSmartpopup">
                <Row className="Metadatapannel ">
                    <Col sm="5" md="5" lg="5">
                        <Label>{this.state.itemOneTitle}</Label>
                    </Col>                    
                    <Col sm="1" md="1" lg="1" className="text-center"><TbArrowsExchange size="48" onClick={this.handleSwitchItems} /></Col>
                    <Col sm="5" md="5" lg="5">
                        <Label>{this.state.itemTwoTitle}</Label>
                    </Col>
                    <Col sm="1" md="1" lg="1">
                        <LuUndo2 size="25" onClick={this.handleUndoItems} />
                    </Col>
                </Row>
                <Row className="Metadatapannel ">
                    <Col sm="5" md="5" lg="5">
                        <TextField label="Title" value={this.state.itemOneTitle} onChange={(ev,newVal)=>this.handleTitleChange(newVal,"itemOne")} />
                    </Col>                    
                    <Col sm="1" md="1" lg="1" >
                        <div className="text-center">
                            <div><Icon.ArrowLeft size="24" onClick={()=>this.handleSwitchTitle("twoToOne")} /></div>
                            <div><Icon.ArrowRight size="24" onClick={()=>this.handleSwitchTitle("oneToTwo")} /></div>
                        </div>
                    </Col>
                    <Col sm="5" md="5" lg="5">
                        <TextField label="Title" value={this.state.itemTwoTitle} onChange={(ev,newVal)=>this.handleTitleChange(newVal,"itemTwo")} />
                    </Col>
                    <Col sm="1" md="1" lg="1">
                        <LuUndo2 size="25" onClick={this.handleUndoTitle} />                        
                    </Col>
                </Row>
                <Row className="Metadatapannel ">
                    <Col sm="5" md="5" lg="5">
                        <TextField label="Tax Type" value={this.state.itemOneTaxType} onChange={(ev,newVal)=>this.handleTaxTypeChange(newVal,"itemOne")} />
                    </Col>                    
                    <Col sm="1" md="1" lg="1">
                        <div className="text-center">
                            <div><Icon.ArrowLeft size="24" onClick={()=>this.handleSwitchTaxType("twoToOne")} /></div>
                            <div><Icon.ArrowRight size="24" onClick={()=>this.handleSwitchTaxType("oneToTwo")} /></div>
                        </div>
                    </Col>
                    <Col sm="5" md="5" lg="5">
                        <TextField label="Tax Type" value={this.state.itemTwoTaxType} onChange={(ev,newVal)=>this.handleTaxTypeChange(newVal,"itemTwo")} />
                    </Col>
                    <Col sm="1" md="1" lg="1">
                        <LuUndo2 size="25" onClick={this.handleUndoTaxType} />
                    </Col>
                </Row>
                <Row className="Metadatapannel ">
                    <Col sm="5" md="5" lg="5">
                        <TextField label="Sort Order" value={this.state.itemOneSortOrder} onChange={(ev,newVal)=>this.handleSortOrderChange(newVal,"itemOne")} />
                    </Col>                    
                    <Col sm="1" md="1" lg="1">
                        <div className="text-center">
                            <div><Icon.ArrowLeft size="24" onClick={()=>this.handleSwitchSortOrder("twoToOne")} /></div>
                            <div><Icon.ArrowRight size="24" onClick={()=>this.handleSwitchSortOrder("oneToTwo")} /></div>
                        </div>
                    </Col>
                    <Col sm="5" md="5" lg="5">
                        <TextField label="Sort Order" value={this.state.itemTwoSortOrder} onChange={(ev,newVal)=>this.handleSortOrderChange(newVal,"itemTwo")} />
                    </Col>
                    <Col sm="1" md="1" lg="1">
                        <LuUndo2 size="25" onClick={this.handleUndoSortOrder} />
                    </Col>
                </Row>
                <Row className="Metadatapannel">
                    <Col sm="5" md="5" lg="5">
                        <Checkbox label="Smart Suggestions" checked={this.state.itemOneSmartSuggestions} onChange={(ev,checked)=>this.handleSmartSuggestionsCheck(checked,"itemOne")} />
                    </Col>                    
                    <Col sm="1" md="1" lg="1">
                        <div className="text-center">
                            <div><Icon.ArrowLeft size="24" onClick={()=>this.handleSwitchSmartSuggestions("twoToOne")} /></div>
                            <div><Icon.ArrowRight size="24" onClick={()=>this.handleSwitchSmartSuggestions("oneToTwo")} /></div>
                        </div>
                    </Col>
                    <Col sm="5" md="5" lg="5">
                        <Checkbox label="Smart Suggestions" checked={this.state.itemTwoSmartSuggestions} onChange={(ev,checked)=>this.handleSmartSuggestionsCheck(checked,"itemTwo")} />
                    </Col>
                    <Col sm="1" md="1" lg="1">
                        <LuUndo2 size="25" onClick={this.handleUndoSmartSuggestions} />
                    </Col>
                </Row>
                <Row className="Metadatapannel">
                    <Col sm="5" md="5" lg="5">
                        <Checkbox label="Is Visible" checked={this.state.itemOneIsVisible} onChange={(ev,checked)=>this.handleIsVisibleCheck(checked,"itemOne")} />
                    </Col>                    
                    <Col sm="1" md="1" lg="1">
                        <div className="text-center">
                            <div><Icon.ArrowLeft size="24" onClick={()=>this.handleSwitchIsVisible("twoToOne")} /></div>
                            <div><Icon.ArrowRight size="24" onClick={()=>this.handleSwitchIsVisible("oneToTwo")} /></div>
                        </div>
                    </Col>
                    <Col sm="5" md="5" lg="5">
                        <Checkbox label="Is Visible" checked={this.state.itemTwoIsVisible} onChange={(ev,checked)=>this.handleIsVisibleCheck(checked,"itemTwo")} />
                    </Col>
                    <Col sm="1" md="1" lg="1">
                        <LuUndo2 size="25" onClick={this.handleUndoIsVisible} />
                    </Col>
                </Row>
                <Row className="Metadatapannel">
                    <Col sm="5" md="5" lg="5">
                        <Dropdown label="Status" calloutProps={{doNotLayer:true}} options={optionsStatus} selectedKey={this.state.itemOneStatus} onChange={(ev,option)=>this.handleStatusChange(option,"itemOne")} />
                    </Col>                    
                    <Col sm="1" md="1" lg="1">
                        <div className="text-center">
                            <div><Icon.ArrowLeft size="24" onClick={()=>this.handleSwitchStatus("twoToOne")} /></div>
                            <div><Icon.ArrowRight size="24" onClick={()=>this.handleSwitchStatus("oneToTwo")} /></div>
                        </div>
                    </Col>
                    <Col sm="5" md="5" lg="5">
                        <Dropdown label="Status" calloutProps={{doNotLayer:true}} options={optionsStatus} selectedKey={this.state.itemTwoStatus} onChange={(ev,option)=>this.handleStatusChange(option,"itemTwo")} />
                    </Col>
                    <Col sm="1" md="1" lg="1">
                        <LuUndo2 size="25" onClick={this.handleUndoStatus} />
                    </Col>
                </Row>
                <Row className="Metadatapannel">
                    <Col sm="5" md="5" lg="5">
                        <TextField label="Help Description" multiline rows={3} value={this.state.itemOneHelpDescription} onChange={(ev,newVal)=>this.handleHelpDescriptionChange(newVal,"itemOne")} />
                    </Col>                    
                    <Col sm="1" md="1" lg="1">
                        <div className="text-center">
                            <div><Icon.ArrowLeft size="24" onClick={()=>this.handleSwitchHelpDescription("twoToOne")} /></div>
                            <div><Icon.ArrowRight size="24" onClick={()=>this.handleSwitchHelpDescription("oneToTwo")} /></div>
                        </div>
                    </Col>
                    <Col sm="5" md="5" lg="5">
                        <TextField label="Help Description" multiline rows={3} value={this.state.itemTwoHelpDescription} onChange={(ev,newVal)=>this.handleHelpDescriptionChange(newVal,"itemTwo")} />
                    </Col>
                    <Col sm="1" md="1" lg="1">
                        <LuUndo2 size="25" onClick={this.handleUndoHelpDescription} />
                    </Col> 
                </Row>                
                <Row className="Metadatapannel">
                    <Col sm="5" md="5" lg="5">
                        <Text>Tasks</Text>
                        {
                            this.state.itemOneTasks.map(taskItem=><Checkbox label={taskItem.Title} checked={this.state.itemOneTasksSelected.map(i=>i.ID).indexOf(taskItem.ID)>-1} onChange={(ev,isChecked)=>this.handleItemOneTasksCheck(isChecked,taskItem)} />)
                        }
                    </Col>
                    <Col sm="1" md="1" lg="1">
                        <div className="text-center">
                            <div><Icon.ArrowLeft size="24" onClick={()=>this.handleSwitchTasks("twoToOne")} /></div>
                            <div><Icon.ArrowRight size="24" onClick={()=>this.handleSwitchTasks("oneToTwo")} /></div>
                        </div>
                    </Col>
                    <Col sm="5" md="5" lg="5">
                        <Text>Tasks</Text>
                        {
                            this.state.itemTwoTasks.map(taskItem=><Checkbox label={taskItem.Title} checked={this.state.itemTwoTasksSelected.map(i=>i.ID).indexOf(taskItem.ID)>-1} onChange={(ev,isChecked)=>this.handleItemTwoTasksCheck(isChecked,taskItem)} />)
                        }
                    </Col>
                    <Col sm="1" md="1" lg="1">
                        <LuUndo2 size="25" onClick={()=>this.handleUndoTasks()} />
                    </Col>
                </Row>
                <Row className="Metadatapannel">
                    <Col sm="5" md="5" lg="5">
                        <Text>Childs</Text>
                        {
                            this.state.itemOneChildItems.map(childItem=><Checkbox label={childItem.Title} checked={this.state.itemOneChildItemsSelected.map(i=>i.ID).indexOf(childItem.ID)>-1} onChange={(ev,isChecked)=>this.handleItemOneChildCheck(isChecked,childItem)} />)
                        }
                    </Col>
                    <Col sm="1" md="1" lg="1">
                        <div className="text-center">
                            <div><Icon.ArrowLeft size="24" onClick={()=>this.handleSwitchChildItems("twoToOne")} /></div>
                            <div><Icon.ArrowRight size="24" onClick={()=>this.handleSwitchChildItems("oneToTwo")} /></div>
                        </div>
                    </Col>
                    <Col sm="5" md="5" lg="5">
                        <Text>Childs</Text>
                        {
                            this.state.itemTwoChildItems.map(childItem=><Checkbox label={childItem.Title} checked={this.state.itemTwoChildItemsSelected.map(i=>i.ID).indexOf(childItem.ID)>-1} onChange={(ev,isChecked)=>this.handleItemTwoChildCheck(isChecked,childItem)} />)
                        }
                    </Col>
                    <Col sm="1" md="1" lg="1">
                        <LuUndo2 size="25" onClick={()=>this.handleUndoChildItems()} />
                    </Col>
                </Row>
            </Container>
        );

        const elemModalCompareSmartMetadata = (
            <Modal show={this.props.showCompareSmartMetadata} size="lg" onHide={()=>this.props.hideModalCompareSmartMetadata()}>
                <Modal.Header closeButton>
                    <Modal.Title>Compare Smart Metadata</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                {
                    elemCompareItems
                }
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={()=>this.handleUpdateSmartMetadataClick("UpdateAndKeepOne")}>Update & Keep 1</Button>
                    <Button variant="primary" onClick={()=>this.handleUpdateSmartMetadataClick("UpdateAndKeepTwo")}>Update & Keep 2</Button>
                    <Button variant="primary" onClick={()=>this.handleUpdateSmartMetadataClick("UpdateAndKeepBoth")}>Update & Keep both</Button>
                </Modal.Footer>
            </Modal>
        );

        return elemModalCompareSmartMetadata;

    }

}

export default ModalCompareSmartMetadata;