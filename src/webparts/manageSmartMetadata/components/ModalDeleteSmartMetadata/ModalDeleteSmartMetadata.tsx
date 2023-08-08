import * as React from "react";
import IModalDeleteSmartMetadataProps from "./IModalDeleteSmartMetadataProps";
import IModalDeleteSmartMetadataState from "./IModalDeleteSmartMetadataState";
import { Button, Col, Container, Modal, Row } from "react-bootstrap";
import * as Icon from 'react-bootstrap-icons';
import { ISmartMetadataItem } from "../ISmartMetadataItem";

class ModalDeleteSmartMetadata extends React.Component<IModalDeleteSmartMetadataProps, IModalDeleteSmartMetadataState> {

    constructor(props: IModalDeleteSmartMetadataProps) {

        super(props);

        this.onDeleteSmartMetadata = this.onDeleteSmartMetadata.bind(this);
        this.onDeleteArchiveSmartMetadata = this.onDeleteArchiveSmartMetadata.bind(this);

    }

    private onDeleteSmartMetadata() {
        const deleteSMetadataItem: ISmartMetadataItem = this.props.deleteSMetaDataItem;
        this.props.deleteSmartMetadata(deleteSMetadataItem);
    }

    private onDeleteArchiveSmartMetadata() {
        const deleteSMetadataItem: ISmartMetadataItem = this.props.deleteSMetaDataItem;
        this.props.deleteAndArchiveSmartMetadata(deleteSMetadataItem);
    }

    render() {

        const deleteSMetadataItem: ISmartMetadataItem = this.props.deleteSMetaDataItem;

        const elemModalDeleteSmartMetadata = (
            <Modal show={this.props.showDeleteSmartMetadata} onHide={this.props.hideModalDeleteSmartMetadata} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{`Delete Smart Metadata - ${deleteSMetadataItem.Title}`}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container fluid>
                        <Row>
                            <Col>
                                <div>{`Item tagged with ${deleteSMetadataItem.Title}`}</div>
                            </Col>
                        </Row>
                        {
                            deleteSMetadataItem.subRows.length>0 &&
                            (
                                <Row>
                                    <Container fluid>
                                        <Row>
                                            <Col>
                                                <div>All Tagged Childs</div>
                                            </Col>
                                        </Row>
                                        {
                                            deleteSMetadataItem.subRows.map((subRowItem: ISmartMetadataItem)=>(
                                                <Row>
                                                    <Col sm="10" md="10" lg="10">{subRowItem.Title}</Col>
                                                    <Col sm="1" md="1" lg="1">
                                                        <div><Icon.PencilFill color="#000066" size={18} className="align-center" title="Update" onClick={()=>this.props.showModalEditSmartMetadata(subRowItem,[...this.props.deleteSMetaDataParentItems,deleteSMetadataItem])} /></div>
                                                    </Col>
                                                    <Col sm="1" md="1" lg="1">
                                                        <div><Icon.TrashFill color="#000066" size={18} className="align-center" title="Delete" onClick={()=>this.props.showModalDeleteSmartMetadata(subRowItem, [])} /></div>
                                                    </Col>
                                                </Row>
                                            ))
                                        }
                                    </Container>
                                </Row>
                            )
                        }
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={this.onDeleteArchiveSmartMetadata}>Archive and Delete</Button>
                    <Button variant="primary" onClick={this.onDeleteSmartMetadata}>Delete</Button>
                    <Button variant="secondary" onClick={this.props.hideModalDeleteSmartMetadata}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        );

        return elemModalDeleteSmartMetadata;

    }
}

export default ModalDeleteSmartMetadata;