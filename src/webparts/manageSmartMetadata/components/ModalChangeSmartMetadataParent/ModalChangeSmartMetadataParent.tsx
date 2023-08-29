import * as React from "react";
import IModalChangeSmartMetadataParentProps from "./IModalChangeSmartMetadataParentProps";
import IModalChangeSmartMetadataParentState from "./IModalChangeSmartMetadataParentState";
import { Button, Col, Container, Modal, Row } from "react-bootstrap";
import { Dropdown, IDropdownOption, Panel, PanelType } from "@fluentui/react";

class ModalChangeSmartMetadataParent extends React.Component<IModalChangeSmartMetadataParentProps, IModalChangeSmartMetadataParentState> {
    
    private optionsTopLevelItems: IDropdownOption[] = [
        { key: "", text: "Root" }
    ];
    private optionsSecondLevelItems: IDropdownOption[] = [
        { key: "", text: "Select" }
    ];
    
    constructor(props: IModalChangeSmartMetadataParentProps) {

        super(props);

        this.optionsTopLevelItems = [...this.optionsTopLevelItems, ...props.rootLevelSMetadataItems.map(rootLevelItem=>({key: rootLevelItem.ID, text: rootLevelItem.Title}))];

        this.state = {
            selRootLevelOptionKey: "",
            selSecondLevelOptionKey: ""
        };

        this.onTopLevelOptionChange = this.onTopLevelOptionChange.bind(this);
        this.onSecondLevelOptionChange = this.onSecondLevelOptionChange.bind(this);

    }

    private onTopLevelOptionChange(_ev: any,topLevelSelOption: IDropdownOption) {
        this.setState({
            selRootLevelOptionKey: topLevelSelOption.key,
            selParentId: topLevelSelOption.key as number
        });
        this.optionsSecondLevelItems = [
            { key: "", text: "Select" },
            ...this.props.rootLevelSMetadataItems.filter(rootLevelItem=>rootLevelItem.ID==topLevelSelOption.key)[0].subRows.map(secondLevelItem=>({key: secondLevelItem.ID, text: secondLevelItem.Title}))
        ];
    }

    private onSecondLevelOptionChange(_ev: any, secondLevelSelectedOption: IDropdownOption) {
        this.setState({
            selSecondLevelOptionKey: secondLevelSelectedOption.key,
            selParentId: secondLevelSelectedOption.key as number
        });
    }
    
    render() {
        const elemChangeParent: JSX.Element = (
            <Container fluid className="mb-3">
                <Row>
                    <Col>
                        <Dropdown label="Top Level" options={this.optionsTopLevelItems} selectedKey={this.state.selRootLevelOptionKey} onChange={this.onTopLevelOptionChange} calloutProps={{doNotLayer: true}} />
                    </Col>
                    <Col>
                        <Dropdown label="Second Level" options={this.optionsSecondLevelItems} selectedKey={this.state.selSecondLevelOptionKey} onChange={this.onSecondLevelOptionChange} calloutProps={{doNotLayer: true}} />
                    </Col>
                </Row>
            </Container>
        );
        const elemFooter: JSX.Element = (
            <div style={{textAlign:"right"}}>
                   <Button variant="btn btn-default" onClick={this.props.hideModalChangeParent}  >Cancel</Button>
                <Button variant="btn primary ms-1" onClick={()=>this.props.saveModalChangeParent(this.state.selParentId)} disabled={isNaN(this.state.selParentId)}  >Save</Button>
             
            </div>
        );
        
        const elemModalChangeParent: JSX.Element = (
            <Modal show={this.props.showModalChangeParent} onHide={this.props.hideModalChangeParent} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Select Parent</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                {
                    elemChangeParent
                }
                </Modal.Body>
                <Modal.Footer>
                {
                    elemFooter
                } 
                </Modal.Footer>
            </Modal>
            
        );
        return elemModalChangeParent;

        const elemPanelChangeParent: JSX.Element = (
            <Panel
                headerText="Select Parent"
                isOpen={this.props.showModalChangeParent}
                type={PanelType.large}
                onDismiss={this.props.hideModalChangeParent}
                onRenderFooterContent={()=>elemFooter}
            >
            {
                elemChangeParent
            }
            </Panel>
        );
        return elemPanelChangeParent;
    }
}

export default ModalChangeSmartMetadataParent;