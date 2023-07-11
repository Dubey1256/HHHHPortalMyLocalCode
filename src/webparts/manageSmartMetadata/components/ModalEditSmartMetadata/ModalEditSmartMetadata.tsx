import * as React from "react";
import IModalEditSmartMetadataProps from "./IModalEditSmartMetadataProps";
import IModalEditSmartMetadataState from "./IModalEditSmartMetadataState";
import { Button, Col, Container, Modal, Row, Tab, Tabs } from "react-bootstrap";
import { Breadcrumb, Checkbox, ChoiceGroup, Dropdown, IBreadcrumbItem, IChoiceGroupOption, IChoiceGroupStyles, IDropdownOption, Label, Link, Panel, PanelType, Stack, TextField } from "@fluentui/react";
import { ISmartMetadataItem } from "../ISmartMetadataItem";
import ModalChangeSmartMetadataParent from "../ModalChangeSmartMetadataParent/ModalChangeSmartMetadataParent";
import TableTasks from "../TableTasks/TableTasks";
import ITask from "../TableTasks/ITask";

const stackTokens = { childrenGap: 10 };

const choiceGroupStyles: IChoiceGroupStyles = {
    label: {
      display: "inline"
    },
    flexContainer: {
      columnGap: "1em",
      display: "inline-flex",
      flexDirection: "row",
      flexWrap: "wrap"
    }
};

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

const optionsItemRank: IDropdownOption[] = [
    { key: '', text: 'Select Item Rank' },
    { key: 8, text: '(8) Top Highlights' },
    { key: 7, text: '(7) Featured Item' },
    { key: 6, text: '(6) Key Item' },
    { key: 5, text: '(5) Relevant Item' },
    { key: 4, text: '(4) Background Item' },
    { key: 1, text: '(1) Archive' },
    { key: 0, text: '(0) No Show' }
];

const optionsImage: IChoiceGroupOption[] = [
    { key: 'Cover Image', text: 'Cover Image' },
    { key: 'Teaser Image', text: 'Teaser Image' }
];

const optionsFolder: IChoiceGroupOption[] = [
    { key: "Covers", text: "COVERS" },
    { key: "Logos", text: "LOGOS" },
    { key: "Tiles", text: "TILES" },
    { key: "Page-Images", text: "IMAGES" }
];

class ModalEditSmartMetadata extends React.Component<IModalEditSmartMetadataProps, IModalEditSmartMetadataState> {

    private itemsHierarchy: IBreadcrumbItem[];

    constructor(props:IModalEditSmartMetadataProps, state: IModalEditSmartMetadataState) {

        super(props);

        this.state = {
            selTabKey: "BasicInformation",
            itemId: props.sMetadataItem.ID,
            title: props.sMetadataItem.Title,
            longTitle: props.sMetadataItem.LongTitle,
            altTitle: props.sMetadataItem.AlternativeTitle,
            sortOrder: props.sMetadataItem.SortOrder,
            status: props.sMetadataItem.Status || "",
            itemRank: props.sMetadataItem.ItemRank || "",
            helpDescription: props.sMetadataItem.Description1,
            isVisible: props.sMetadataItem.IsVisible,
            selectable: props.sMetadataItem.Selectable,
            smartSuggestions: props.sMetadataItem.SmartSuggestions,
            itemCover: props.sMetadataItem.Item_x005F_x0020_Cover || {Url:"",Description:""},
            parent: props.sMetadataItem.Parent,
            parentItemId: null,
            selTabKeyUploadImage: "Upload",
            showChangeParent: false,
            uploadedImage: {
                fileName: "",
                fileURL: ""
            },
            selImageFolder: "Covers"
        };

        this.itemsHierarchy = props.sMetadataItemParents.map(parentItem=>{
            return {key: parentItem.Title, text: parentItem.Title}
        }).concat({key: props.sMetadataItem.Title, text: props.sMetadataItem.Title});

        this._onTabSelected = this._onTabSelected.bind(this);
        this.onTitleChange = this.onTitleChange.bind(this);
        this.onLongTitleChange = this.onLongTitleChange.bind(this);
        this.onVisibleChange = this.onVisibleChange.bind(this);
        this.onSelectaleChange = this.onSelectaleChange.bind(this);
        this.onSmartSuggestionsChange = this.onSmartSuggestionsChange.bind(this);
        this.onAltTitleChange = this.onAltTitleChange.bind(this);
        this.onSortOrderChange = this.onSortOrderChange.bind(this);
        this.onStatusChange = this.onStatusChange.bind(this);
        this.onItemRankChange = this.onItemRankChange.bind(this);
        this.onHelpDescriptionChange = this.onHelpDescriptionChange.bind(this);

        this._onTabUploadImageSelected = this._onTabUploadImageSelected.bind(this);

        this.onSaveSmartMetadata = this.onSaveSmartMetadata.bind(this);

        this.onShowChangeParent = this.onShowChangeParent.bind(this);
        this.onHideChangeParent = this.onHideChangeParent.bind(this);
        this.onSaveChangeParent = this.onSaveChangeParent.bind(this);

        this.onImageAdded = this.onImageAdded.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
        this.onImageFolderChanged = this.onImageFolderChanged.bind(this);

    }

    private _onTabSelected(key: string) {
        this.setState({
            selTabKey: key
        });
    }

    private onTitleChange(ev: React.FormEvent<HTMLInputElement>, newTitle: string) {
        this.setState({
            title: newTitle
        });
    }

    private onLongTitleChange(ev: React.FormEvent<HTMLInputElement>, newTitle: string) {
        this.setState({
            longTitle: newTitle
        });
    }

    private onVisibleChange(ev?: React.FormEvent<HTMLElement | HTMLInputElement>, isVisibleChecked?: boolean) {
        this.setState({
            isVisible: isVisibleChecked
        });
    }

    private onSelectaleChange(ev?: React.FormEvent<HTMLElement | HTMLInputElement>, isSelectableChecked?: boolean) {
        this.setState({
            selectable: isSelectableChecked
        });
    }

    private onSmartSuggestionsChange(ev?: React.FormEvent<HTMLElement | HTMLInputElement>, isSmartSuggestionsChecked?: boolean) {
        this.setState({
            smartSuggestions: isSmartSuggestionsChecked
        });
    }

    private onAltTitleChange(ev: React.FormEvent<HTMLInputElement>, newAltTitle: string) {
        this.setState({
            altTitle: newAltTitle
        });
    }

    private onSortOrderChange(ev: React.FormEvent<HTMLInputElement>, newSortOrder: string) {
        this.setState({
            sortOrder: newSortOrder
        });
    }

    private onStatusChange(ev: React.FormEvent<HTMLDivElement>, itemStatus: IDropdownOption) {
        this.setState({
            status: itemStatus.key
        });
    }

    private onItemRankChange(ev: React.FormEvent<HTMLDivElement>, itemItemRank: IDropdownOption) {
        this.setState({
            itemRank: itemItemRank.key
        });
    }

    private onHelpDescriptionChange(ev: React.FormEvent<HTMLTextAreaElement>, newHelpDesc: string) {
        this.setState({
            helpDescription: newHelpDesc
        });
    }

    private _onTabUploadImageSelected(key: string) {
        this.setState({
            selTabKeyUploadImage: key
        });
    }

    private onSaveSmartMetadata() {
        const sMetadataItemUpdate: ISmartMetadataItem = {
            Title: this.state.title,
            AlternativeTitle: this.state.altTitle,
            LongTitle: this.state.longTitle,            
            SortOrder: this.state.sortOrder,
            Description1: this.state.helpDescription,
            IsVisible: this.state.isVisible,
            Selectable: this.state.selectable,
            SmartSuggestions: this.state.smartSuggestions,
            ItemRank: this.state.itemRank || null,
            Status: this.state.status,
            ParentId: this.state.parentItemId || (this.state.parent ? this.state.parent.Id : null),
            ParentID: this.state.parentItemId || (this.state.parent ? this.state.parent.Id : 0),
            Item_x005F_x0020_Cover: this.state.itemCover
        };
        this.props.updateSmartMetadata(sMetadataItemUpdate, this.state.itemId);
    }

    private onShowChangeParent() {
        this.setState({
            showChangeParent: true
        });
    }

    private onHideChangeParent() {
        this.setState({
            showChangeParent: false
        });
    }

    private onSaveChangeParent(parentItemId: number) {
        this.setState({
            parentItemId: parentItemId
        });
        this.onHideChangeParent();
    }

    public onRemoveCategories(selTaskItems: ITask[]) {
        this.props.removeTaskCategories(selTaskItems);
    }

    render() {

        const elemBasicInfo: JSX.Element = (
            <Container fluid className="Metadatapopup">
                <Row>
                    <Col sm="10" md="10" lg="10" className="ps-0" > 
                        <Breadcrumb className="Metabreadcrumb" items={this.itemsHierarchy} />
                    </Col>
                    <Col sm="2" md="2" lg="2" className="mt-20  text-end">
                        <Link onClick={this.onShowChangeParent}>Change Parent</Link>
                    </Col>
                </Row>
                <Row>
                    <Col className="ps-0">
                        <TextField label="Title" value={this.state.title} onChange={this.onTitleChange} />
                    </Col>
                    <Col>
                        <TextField label="Long Title" value={this.state.longTitle} onChange={this.onLongTitleChange} />
                    </Col>
                    <Col>
                        <Stack tokens={stackTokens}>
                            <Checkbox label="Visible" checked={this.state.isVisible} onChange={this.onVisibleChange} />
                            <Checkbox label="Selectable" checked={this.state.selectable} onChange={this.onSelectaleChange} />
                            <Checkbox label="Smart Suggestions" checked={this.state.smartSuggestions} onChange={this.onSmartSuggestionsChange} />
                        </Stack>
                    </Col>
                </Row>
                <Row>
                    <Col className="ps-0">
                        <TextField label="Alternative Title (Second Language)" value={this.state.altTitle} onChange={this.onAltTitleChange} />
                    </Col>
                    <Col>
                        <TextField label="Sort Order" value={this.state.sortOrder} onChange={this.onSortOrderChange} />
                    </Col>
                    <Col>
                        <Dropdown label="Status" options={optionsStatus} calloutProps={{ doNotLayer: true }} defaultSelectedKey={this.state.status} selectedKey={this.state.status} onChange={this.onStatusChange} />
                    </Col>
                    <Col>
                        <Dropdown label="Item Rank" options={optionsItemRank} calloutProps={{ doNotLayer: true }} defaultSelectedKey={this.state.itemRank} selectedKey={this.state.itemRank} onChange={this.onItemRankChange} />
                    </Col>
                </Row>
                <Row>
                    <Col sm="6" md="6" lg="6" className="ps-0" >
                        <TextField label="Help Description" multiline rows={3} value={this.state.helpDescription} onChange={this.onHelpDescriptionChange} />
                    </Col>                    
                </Row>
            </Container>
        );

        const elemChooseImageFromExisting: JSX.Element = (
            <Container fluid>

            </Container>
        );

        const elemTasks: JSX.Element = (
            <Container fluid>
                <TableTasks Tasks={this.props.sMetadataItemTasks} RemoveCategories={this.onRemoveCategories} />
            </Container>
        );

        const elemUplaoadImage: JSX.Element = (
            <Container fluid>
                <Row>
                    <Label>Upload from Computer:</Label>
                </Row>
                <Row>
                    <input 
                        type="file"
                        accept="image/*" 
                        onChange={this.onImageAdded}                         
                    />
                </Row>
                <Row className="mt-3">
                    <Button variant="primary" style={{width:"125px"}} onClick={this.uploadImage} disabled={this.state.uploadedImage.fileName==""}>Upload</Button>
                </Row>
            </Container>
        );

        const elemImageInfo: JSX.Element = (
            <Container fluid>
                <Row>
                    <Col sm="2" md="2" lg="2">

                    </Col>
                    <Col sm="10" md="10" lg="10">
                        <ChoiceGroup options={optionsImage} styles={choiceGroupStyles} />
                        <br />
                        <TextField label="" placeholder="Search" value={this.state.itemCover.Url} />
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col sm="2" md="2" lg="2">
                        <ChoiceGroup options={optionsFolder} selectedKey={this.state.selImageFolder} defaultSelectedKey={this.state.selImageFolder} onChange={this.onImageFolderChanged}  />
                    </Col>
                    <Col sm="10" md="10" lg="10" className="mb-3">
                        <Tabs activeKey={this.state.selTabKeyUploadImage} onSelect={this._onTabUploadImageSelected}>
                            <Tab title="CHOOSE FROM EXISTING" eventKey="ChooseFromExisting" className="mb-3">{elemChooseImageFromExisting}</Tab>
                            <Tab title="UPLOAD" eventKey="Upload" className="mb-3">{elemUplaoadImage}</Tab>
                        </Tabs>
                    </Col>
                </Row>
            </Container>
        );

        const elemTabsEditSmartMetadata: JSX.Element = (
            <Container fluid>
                <Row>
                    <Col className="matadatatab">
                        <Tabs activeKey={this.state.selTabKey} onSelect={this._onTabSelected} className="mt-3">
                            <Tab title="BASIC INFORMATION" eventKey="BasicInformation">{elemBasicInfo}</Tab>
                            <Tab title="IMAGE INFORMATION" eventKey="ImageInformation">{elemImageInfo}</Tab>
                            <Tab title="TASKS" eventKey="Tasks">{elemTasks}</Tab>
                        </Tabs>
                    </Col>
                </Row>
            </Container>
            
        );

        const elemFooter: JSX.Element = (
            <div style={{textAlign:"right"}}>
                <Button variant="primary" onClick={this.onSaveSmartMetadata} style={{marginLeft:"5px",height:"34px"}}>Save</Button>
                <Button className="btn-default" variant="secondary" onClick={()=>this.props.hideModalEditSmartMetadata()} style={{marginLeft:"5px",height:"34px"}}>Cancel</Button>
            </div>
        );

        let elemModalEditSmartMetadata: JSX.Element = (
            <Modal show={this.props.showEditSmartMetadata} size="lg" centered onHide={()=>this.props.hideModalEditSmartMetadata()}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {`Update Smart Metadata Item - ${this.state.title}`}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                {
                    elemTabsEditSmartMetadata
                }
                </Modal.Body>
                <Modal.Footer>
                {
                    elemFooter
                }   
                </Modal.Footer>
            </Modal>        
        );

        const elemPanelEditSmartMetadata: JSX.Element = (
            <Panel
                headerText={`Update Smart Metadata Item - ${this.state.title}`}
                isOpen={this.props.showEditSmartMetadata}
                type={PanelType.large}
                onDismiss={this.props.hideModalEditSmartMetadata}
                closeButtonAriaLabel="Close"
                onRenderFooterContent={()=>elemFooter}
            >
            {
                elemTabsEditSmartMetadata
            }
            </Panel>
        );

        const elemChangeParent = this.state.showChangeParent && (
            <ModalChangeSmartMetadataParent 
                showModalChangeParent={this.state.showChangeParent}
                sMetadataItem={this.props.sMetadataItem}
                rootLevelSMetadataItems={this.props.sMetadataRootLevelItems}
                hideModalChangeParent={this.onHideChangeParent} 
                saveModalChangeParent={this.onSaveChangeParent}                
            />
        )

        return <div>
            {elemModalEditSmartMetadata}
            {elemChangeParent}
        </div>;

        return <div>
            {elemPanelEditSmartMetadata}
            {elemChangeParent}
        </div>;

    }

    private onImageAdded(ev: React.ChangeEvent<HTMLInputElement>) {

        if (!ev.target.files || ev.target.files.length<1) {
            return;
        }

        let files = ev.target.files;

        const file = files[0];

        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = ()=>{
            let uploadedImage = {
                fileURL: reader.result as string,
                fileName: file.name
            }
            this.setState({
                uploadedImage: uploadedImage
            }) 
        }

    }

    private async uploadImage() {
        let resImageUrl: string = await this.props.uploadImage(this.state.selImageFolder, this.state.uploadedImage);
        this.setState({
            itemCover: {
                Url: resImageUrl,
                Description: resImageUrl
            }
        })        
    }

    private async onImageFolderChanged(ev:any, optImageFolder: IChoiceGroupOption) {
        const selImageFolder: string = optImageFolder.key;
        this.setState({
            selImageFolder: selImageFolder
        })
    }
}

export default ModalEditSmartMetadata;