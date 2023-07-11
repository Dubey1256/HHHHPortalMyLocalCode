import * as React from "react";

import IModalAddSmartMetadataProps from "./IModalAddSmartMetadataProps";
import IModalAddSmartMetadataState from "./IModalAddSmartMetadataState";
import { Button, Container, Modal, Row } from "react-bootstrap";
import { Panel, PanelType, TextField } from "@fluentui/react";
import { FaPlus } from "react-icons/fa";
import { ISmartMetadataItem } from "../ISmartMetadataItem";

class ModalAddSmartMetadata extends React.Component<IModalAddSmartMetadataProps, IModalAddSmartMetadataState> {

    
    constructor(props: IModalAddSmartMetadataProps, state: IModalAddSmartMetadataState) {
        super(props);
        this.state = {
            createSMItem: { Title: "", Description: "" },
            createSMChildItems: [
                { Title: "", Description: "", Key: 0}
            ]
        };
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.onAddMoreChildItem = this.onAddMoreChildItem.bind(this);
        this.onCreateSmartMetadata = this.onCreateSmartMetadata.bind(this);
        
    }

    componentDidMount(): void {
        
    }

    private handleTitleChange(newTitleValue: string, key?: number) {
        if(key!=null) {
            const _createSMChildItems = [...this.state.createSMChildItems].map(_createChildItem => {
                if(_createChildItem.Key == key) {
                    _createChildItem.Title = newTitleValue
                }
                return _createChildItem;
            });
            this.setState({
                createSMChildItems: _createSMChildItems
            }); 
        }
        else {
            const _createSMItem = {...this.state.createSMItem};
            _createSMItem.Title = newTitleValue;
            this.setState({
                createSMItem: _createSMItem
            });
        }
    }

    private handleDescriptionChange(newDescriptionValue: string, key?: number) {
        if(key!=null) {
            const _createSMChildItems = [...this.state.createSMChildItems].map(_createChildItem => {
                if(_createChildItem.Key == key) {
                    _createChildItem.Description = newDescriptionValue
                }
                return _createChildItem;
            });
            this.setState({
                createSMChildItems: _createSMChildItems
            }); 
        }
        else {
            const _createSMItem = {...this.state.createSMItem};
            _createSMItem.Description = newDescriptionValue;
            this.setState({
                createSMItem: _createSMItem
            });
        }
    }

    private onAddMoreChildItem() {
        const _currentCreateSMChildItems = [...this.state.createSMChildItems];
        const lastChildItemKey: number = _currentCreateSMChildItems[_currentCreateSMChildItems.length-1].Key;
        const _createSMChildItems = [
            ..._currentCreateSMChildItems,
            {
                Title: "",
                Description: "",
                Key: lastChildItemKey+1
            }
        ];
        this.setState({
            createSMChildItems: _createSMChildItems
        });
    }

    private onCreateSmartMetadata(showEditPopup: boolean, parentItemId: number) {
        if(parentItemId) {
            this.props.createSmartMetadata(this.state.createSMChildItems, parentItemId, showEditPopup);
        }
        else {
            this.props.createSmartMetadata(this.state.createSMItem, parentItemId, showEditPopup);
        }
    }

    render() {
        let modalTitle: string = "Create Smart Metadata";
        const parentItem: ISmartMetadataItem = this.props.parentItem;
        let parentItemId: number = undefined;
        if(parentItem) {
            parentItemId = parentItem.ID;
            modalTitle = `${parentItem.Title} - Create Child Item`;
        }
        const elemCreateSmartMetadata: JSX.Element = (
            <Container fluid>
                <Row>
                    <TextField label="Title" placeholder="Enter Component Title..." onChange={(ev,newVal)=>this.handleTitleChange(newVal)} />
                </Row>
                <Row>
                    <TextField label="Description" multiline rows={3} onChange={(ev,newVal)=>this.handleDescriptionChange(newVal)} />
                </Row>
            </Container> 
        );
        const elemCreateSmartMetadataChild: JSX.Element = (
            <Container fluid>
                {
                    this.state.createSMChildItems.map( createChildItem =>
                        <React.Fragment key={`createChildItem${createChildItem.Key}`}>
                            <Row>
                                <TextField label="Title" placeholder="Enter Child Item Component Title..." onChange={(ev,newVal)=>this.handleTitleChange(newVal, createChildItem.Key)} />
                            </Row>
                            <Row>
                                <TextField label="Description" multiline rows={3} onChange={(ev,newVal)=>this.handleDescriptionChange(newVal, createChildItem.Key)} />
                            </Row>
                        </React.Fragment>
                    )
                }
            </Container>
        );
        const elemFooter: JSX.Element = (
            <div style={{textAlign:"right"}}>
                {
                    parentItem && 
                    <Button variant="primary" onClick={this.onAddMoreChildItem} style={{marginLeft:"5px",height:"34px"}}>
                        <FaPlus size={18} />
                        Add More Child Items
                    </Button>
                }
                <Button 
                    variant="primary" 
                    disabled={!(parentItem==null || this.state.createSMChildItems.length==1)} 
                    onClick={()=>this.onCreateSmartMetadata(true, parentItemId)}
                    style={{marginLeft:"5px",height:"34px"}}
                >
                    Create & Open Popup
                </Button>
                <Button 
                    variant="primary"
                    onClick={()=>this.onCreateSmartMetadata(false, parentItemId)}
                    style={{marginLeft:"5px",height:"34px"}}
                >
                    Create
                </Button>
            </div>
        );

        const elemModalAddSmartMetadata: JSX.Element = (
            <Modal show={this.props.showAddSmartMetadata} onHide={()=>this.props.hideModalAddSmartMetadata()} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                {
                    parentItem ? elemCreateSmartMetadataChild : elemCreateSmartMetadata
                }
                </Modal.Body>
                <Modal.Footer>
                {
                    elemFooter
                }
                </Modal.Footer>
            </Modal>
        );
        
        return elemModalAddSmartMetadata;

        const elemPanelAddSmartMetadata: JSX.Element = (
            <Panel 
                headerText={modalTitle}
                isOpen={this.props.showAddSmartMetadata}
                type={PanelType.medium}
                onDismiss={this.props.hideModalAddSmartMetadata}
                closeButtonAriaLabel="Close"
                onRenderFooterContent={()=>elemFooter}
            >
            {
                parentItem ? elemCreateSmartMetadataChild : elemCreateSmartMetadata
            }
            </Panel>
        );
        return elemPanelAddSmartMetadata;
        
    }
    
}

export default ModalAddSmartMetadata;