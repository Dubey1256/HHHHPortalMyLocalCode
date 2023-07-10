import * as React from "react";
import IModalRestructureSmartMetadataProps from "./IModalRestructureSmartMetadataProps";
import IModalRestructureSmartMetadataState from "./IModalRestructureSmartMetadataState";
import { Button, Container, Modal, Row } from "react-bootstrap";
import { ISmartMetadataItem } from "../ISmartMetadataItem";
import { Checkbox } from "@fluentui/react";

class ModalRestructureSmartMetadata extends React.Component<IModalRestructureSmartMetadataProps, IModalRestructureSmartMetadataState> {

    constructor(props: IModalRestructureSmartMetadataProps, state: IModalRestructureSmartMetadataState) {
        super(props);
        this.state = {
            selectedSMetadataItems: this.props.selSMetadataItems
        }
        this.sMetadataItemCheck = this.sMetadataItemCheck.bind(this);
        this.onSaveRestructure = this.onSaveRestructure.bind(this);
    }

    private sMetadataItemCheck(isChecked: boolean, sMetadataItem: ISmartMetadataItem) {
        const itemId: number = sMetadataItem.ID;
        let selectedItems = [...this.state.selectedSMetadataItems];
        if(isChecked) {
            selectedItems = selectedItems.concat(sMetadataItem);
        }
        else {
            selectedItems = selectedItems.filter(item=>item.ID!=itemId);
        }
        this.setState({
            selectedSMetadataItems: selectedItems
        });
    }

    private onSaveRestructure() {
        const parentItemId: number = this.props.restructureItem.ID;
        this.props.restructureAndUpdateSmartMetadata(parentItemId, this.state.selectedSMetadataItems);
    }

    render() {

        const restructureItem: ISmartMetadataItem = this.props.restructureItem;

        const elemModalRestructureSmartMetadata: JSX.Element = (
            <Modal show={this.props.showRestructureSmartMetadata} onHide={()=>this.props.hideModalRestructureSmartMetadata()} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{`${restructureItem.Title} - Restructuring Tool`}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container fluid>
                        <Row>{`All below selected items will be added as Categories inside ${restructureItem.Title}`}</Row>
                        <Row>
                            {
                                this.props.selSMetadataItems.length
                            }
                            {
                                this.props.selSMetadataItems.map(selSMetadatItem=><Checkbox label={selSMetadatItem.Title} checked={this.state.selectedSMetadataItems.map(selectedSMetadataItem=>selectedSMetadataItem.ID).indexOf(selSMetadatItem.ID)>-1} onChange={(ev,isChecked)=>this.sMetadataItemCheck(isChecked,selSMetadatItem)} />)
                            }
                        </Row>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={this.onSaveRestructure}>Save</Button>
                    <Button onClick={this.props.hideModalRestructureSmartMetadata}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        );

        return elemModalRestructureSmartMetadata;
    }

}

export default ModalRestructureSmartMetadata;