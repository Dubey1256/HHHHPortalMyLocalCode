import { CommandBar, ICommandBarItemProps, Dialog, DialogType, DialogFooter, Icon, Checkbox } from "@fluentui/react";
import { PrimaryButton } from "office-ui-fabric-react";
import * as React from "react";
import { Col, Container, Row } from "react-bootstrap";
import spservices from "../../../spservices/spservices";
import GlobalConstants from "../../../common/GlobalConstants";

interface IListSmartMetadataProps {
    tabKey: string;
    groupedSmartMetadataItems: any[];
    spService: spservices;
}

interface ISMItem {
    ComponentName: string;
    ComponentDesc: string;
    ComponentKey: number;
}

interface IListSmartMetadataState {
    iconNameCarot: string;
    collExpParentId: number[];
    collSelSMId: number[];
    addSMDialogTitle: string;
    hideAddSMDialog: boolean;
    addSMItems: ISMItem[];
    disableAddCommand: boolean;
}

const iconNameExpand: string = "CaretSolidRight";
const iconNameCollapse: string = "CaretSolid";

class ListSmartMetadata extends React.Component<IListSmartMetadataProps, IListSmartMetadataState> {
    /**
     *
     */
    private commandBarItems: ICommandBarItemProps[] = null;
    constructor(props:IListSmartMetadataProps) {
        super(props);
        
        this.state = {
            iconNameCarot: iconNameExpand,
            collExpParentId: [],
            collSelSMId: [],
            addSMDialogTitle: "Create Smart Metadata",
            hideAddSMDialog: true,
            addSMItems: [
                {
                    ComponentKey: 1,
                    ComponentName: "",
                    ComponentDesc: ""
                }
            ],
            disableAddCommand: false
        };

        this.onAddCommandClick = this.onAddCommandClick.bind(this);
        this._onDismissAddSMDialog = this._onDismissAddSMDialog.bind(this);
        this.onAddMoreChildItems = this.onAddMoreChildItems.bind(this);
        this.onRemovSMItems = this.onRemovSMItems.bind(this);
        this.onAddSMItem = this.onAddSMItem.bind(this);
        this.onAddSMChildItem = this.onAddSMChildItem.bind(this);
        
        this.commandBarItems = [
            {
                key: "add",
                text: "Add",
                iconProps: { iconName: "Add" },
                onClick: ()=>{this.onAddCommandClick()},
                disabled: this.state.disableAddCommand
            }
        ];
    }

    componentDidMount(): void {
        this.formatSmartMetadataItems();
    }

    componentDidUpdate(prevProps: Readonly<IListSmartMetadataProps>, prevState: Readonly<IListSmartMetadataState>, snapshot?: any): void {
        if(prevProps.tabKey != this.props.tabKey) {
            this.formatSmartMetadataItems();
        }
    }
    
    private onAddCommandClick() {
        this.setState({
            hideAddSMDialog: false
        });
    }

    private async onAddSMItem() {
        if(this.state.collSelSMId.length>0) {
            this.onAddSMChildItem();
        }
        else {

        }
        const smItem = {
            Title: this.state.addSMItems[0].ComponentName,
            Description1: this.state.addSMItems[0].ComponentDesc,
            TaxType: this.props.tabKey
        }
        console.log(smItem);
        

        let resAddSMItem = await this.props.spService.createListItem(GlobalConstants.SMARTMETADATA_LIST_ID, smItem);

        console.log(resAddSMItem);

        this.setState({
            hideAddSMDialog: true
        })

    }

    private onAddSMChildItem() {
        const _childItems = [...this.state.addSMItems];
        console.log(this.state.addSMItems);
        const parentId: number = this.state.collSelSMId[0];
        _childItems.forEach(async _childItem => {

            let childItem = {
                TaxType: this.props.tabKey,
                ParentId:parentId,
                Title: _childItem.ComponentName,
                Description1: _childItem.ComponentDesc,
                ParentID: parentId
            };

            console.log(childItem);
            let resAddChildItem = await this.props.spService.createListItem(GlobalConstants.SMARTMETADATA_LIST_ID, childItem);

            console.log(resAddChildItem);

        });
        this.setState({
            hideAddSMDialog: true
        })
    }

    private formatSmartMetadataItems() {

        let _groupedItems = this.props.groupedSmartMetadataItems;
        console.log(_groupedItems);     
        
    }  

    private _onDismissAddSMDialog() {
        this.setState({
            hideAddSMDialog: true,
            collSelSMId: [],
            addSMItems: [
                {
                    ComponentKey: 1,
                    ComponentName: "",
                    ComponentDesc: ""
                }
            ]
        });
    }
        
    private onCarotIconClick(parentId: number) {
        let _collExpParentId: number[] = [...this.state.collExpParentId];
        if(_collExpParentId.indexOf(parentId)>-1) {
            _collExpParentId = _collExpParentId.filter(pId => pId!=parentId);
        }
        else {
            _collExpParentId = [..._collExpParentId, parentId];
        }
        this.setState({
            collExpParentId: _collExpParentId
        });
    }

    private getCarotIconName(parentId: number) {
        return this.state.collExpParentId.indexOf(parentId)>-1 ? iconNameCollapse : iconNameExpand;
    }

    private onSMItemChecked(smItemId: number, smItemChecked: boolean) {
        const curCollSMId = [...this.state.collSelSMId];
        let newCollSMId = [];

        if(smItemChecked) {
            newCollSMId = [...curCollSMId, smItemId];
        }
        else {
            newCollSMId = curCollSMId.filter(_smItemId=>_smItemId!=smItemId)
        }

        this.setState({
            collSelSMId: newCollSMId
        })
    }

    private onAddMoreChildItems() {
        const currentSMList = [...this.state.addSMItems];
        const lastCompKey = currentSMList[currentSMList.length-1].ComponentKey;
        const newSMList: ISMItem[] =  [
            ...currentSMList,
            {
                ComponentKey: lastCompKey + 1,
                ComponentName: "",
                ComponentDesc: ""
            }
        ]; 

        this.setState({
            addSMItems: newSMList
        });
    }

    private onRemovSMItems(_ComponentKey: number) {
        const currentSMList = [...this.state.addSMItems];
        const newSMList = currentSMList.filter(smItem => smItem.ComponentKey != _ComponentKey);

        this.setState({
            addSMItems: newSMList
        })
    }

    private handleComponentNameChange(_ev: React.ChangeEvent<HTMLInputElement>, _ComponentKey: number) {
        
        let newCompName = _ev.target.value;

        console.log(newCompName);

        let _currentSMItems = [...this.state.addSMItems];
        let _newSMItems = _currentSMItems.map((_curSMItem: ISMItem)=>{
            if(_curSMItem.ComponentKey==_ComponentKey) {
                _curSMItem.ComponentName = newCompName;
            }
            return _curSMItem;
        });
        console.log(_newSMItems);

        this.setState({
            addSMItems: _newSMItems
        });

    }

    private handleComponentDescriptionChange(_ev: React.ChangeEvent<HTMLTextAreaElement>, _ComponentKey: number) {
        let newCompDesc = _ev.target.value;

        console.log(newCompDesc);

        let _currentSMItems = [...this.state.addSMItems];
        let _newSMItems = _currentSMItems.map((_curSMItem: ISMItem)=>{
            if(_curSMItem.ComponentKey==_ComponentKey) {
                _curSMItem.ComponentDesc = newCompDesc;
            }
            return _curSMItem;
        });
        console.log(_newSMItems);

        this.setState({
            addSMItems: _newSMItems
        });
    }

    render() {

        const elemCommandBar = <CommandBar items={this.commandBarItems} />;

        const elemAddSMList = (
            <Container>
                <Row>
                    <Col>Title</Col>
                    <Col>Description</Col>
                    {
                        this.state.collSelSMId.length>0 && <Col></Col>
                    }
                </Row>
                {
                    this.state.addSMItems.map(smItem => 
                        <Row>
                            <Col sm="5" md="5" lg="5">
                                <input type="text" name="ComponentName" id={`compName${smItem.ComponentKey}`} onChange={(ev)=>this.handleComponentNameChange(ev, smItem.ComponentKey)} />
                            </Col>
                            <Col sm="5" md="5" lg="5">
                                <textarea rows={2} cols={30} name="ComponentDesc" id={`compDesc${smItem.ComponentKey}`} onChange={(ev)=>this.handleComponentDescriptionChange(ev, smItem.ComponentKey)}></textarea>
                            </Col>
                            {
                                (this.state.collSelSMId.length>0) && (smItem.ComponentKey != 1) &&
                                <Col sm="2" md="2" lg="2">
                                    <Icon iconName="Delete" onClick={()=>this.onRemovSMItems(smItem.ComponentKey)}/>
                                </Col>
                            }
                        </Row>
                    )
                }
            </Container>
        );

        const elemAddSMDialog = (
            <Dialog
                hidden={this.state.hideAddSMDialog}
                minWidth={600}
                dialogContentProps = {{
                    type: DialogType.normal,
                    title: this.state.addSMDialogTitle,
                    showCloseButton: true,
                    closeButtonAriaLabel: "Close",
                    onDismiss: this._onDismissAddSMDialog
                }}
            >
                {
                    elemAddSMList
                }
                <DialogFooter>
                    {
                        this.state.collSelSMId.length>0 &&
                        <PrimaryButton onClick={this.onAddMoreChildItems}>Add More Child Items</PrimaryButton>
                    }                    
                    <PrimaryButton onClick={this.onAddSMItem}>Create & Open Popup</PrimaryButton>
                    <PrimaryButton onClick={this.onAddSMItem}>Create</PrimaryButton>
                </DialogFooter>
            </Dialog>
        );

        const elemListSmartMetadata: JSX.Element = (
            <Container>
                {
                    this.props.groupedSmartMetadataItems.map( (gSMItem: any) =>
                        <React.Fragment>
                        <Row style={{"backgroundColor":"#ddd"}}>
                            <Col>
                                {   
                                    gSMItem.ChildItems.length>0 && 
                                    <Icon 
                                        iconName={this.getCarotIconName(gSMItem.Id)} 
                                        onClick={()=>this.onCarotIconClick(gSMItem.Id)} 
                                    />
                                }
                            </Col>
                            <Col>
                                <Checkbox onChange={(ev,checked)=>this.onSMItemChecked(gSMItem.Id, checked)} checked={this.state.collSelSMId.indexOf(gSMItem.Id)>-1} />
                            </Col>
                            <Col>{gSMItem.Title}</Col>
                            <Col>{gSMItem.SmartFilters && gSMItem.SmartFilters.join("; ")}</Col>
                            <Col>{gSMItem.Status}</Col>
                            <Col>{gSMItem.SortOrder}</Col>
                            <Col><Icon iconName="Edit" /></Col>
                            <Col><Icon iconName="Delete" /></Col>
                        </Row>
                        {
                            this.state.collExpParentId.indexOf(gSMItem.Id)>-1 &&
                            gSMItem.ChildItems.map( (gsmFirstChildItem: any) => 
                                <React.Fragment>
                                    <Row style={{"backgroundColor":"#e7e3e3","border":"1px solid #f2f2f2"}}>
                                        <Col>
                                            {
                                                gsmFirstChildItem.ChildItems.length>0 && 
                                                <Icon iconName={this.getCarotIconName(gsmFirstChildItem.Id)} onClick={()=>this.onCarotIconClick(gsmFirstChildItem.Id)} />
                                            }
                                        </Col>
                                        <Col>
                                            <Checkbox onChange={(ev,checked)=>this.onSMItemChecked(gsmFirstChildItem.Id, checked)} checked={this.state.collSelSMId.indexOf(gsmFirstChildItem.Id)>-1} />
                                        </Col>
                                        <Col>{gsmFirstChildItem.Title}</Col>
                                        <Col>{gsmFirstChildItem.SmartFilters && gsmFirstChildItem.SmartFilters.join("; ")}</Col>
                                        <Col>{gsmFirstChildItem.Status}</Col>
                                        <Col>{gsmFirstChildItem.SortOrder}</Col>
                                        <Col><Icon iconName="Edit" /></Col>
                                        <Col><Icon iconName="Delete" /></Col>
                                    </Row>
                                    {
                                       this.state.collExpParentId.indexOf(gsmFirstChildItem.Id)>-1 && 
                                       gsmFirstChildItem.ChildItems.map( (gsmSecondChildItem: any) =>
                                        <React.Fragment>
                                            <Row style={{backgroundColor:"#f7f5f5",border:"1px solid #f2f2f2"}}>
                                                <Col>
                                                    {
                                                        gsmSecondChildItem.ChildItems.length>0 && 
                                                        <Icon 
                                                            iconName={this.getCarotIconName(gsmSecondChildItem.Id)} 
                                                            onClick={()=>this.onCarotIconClick(gsmSecondChildItem.Id)} 
                                                        />
                                                    }
                                                </Col>
                                                <Col>
                                                    <Checkbox onChange={(ev,checked)=>this.onSMItemChecked(gsmSecondChildItem.Id, checked)}  checked={this.state.collSelSMId.indexOf(gsmSecondChildItem.Id)>-1} />
                                                </Col>
                                                <Col>{gsmSecondChildItem.Title}</Col>
                                                <Col>{gsmSecondChildItem.SmartFilters && gsmSecondChildItem.SmartFilters.join("; ")}</Col>
                                                <Col>{gsmSecondChildItem.Status}</Col>
                                                <Col>{gsmSecondChildItem.SortOrder}</Col>
                                                <Col><Icon iconName="Edit" /></Col>
                                                <Col><Icon iconName="Delete" /></Col>
                                            </Row>
                                            {
                                                this.state.collExpParentId.indexOf(gsmSecondChildItem.Id)>-1 && 
                                                gsmSecondChildItem.ChildItems.map((gsmThirdChildItem: any) => 
                                                    <Row style={{backgroundColor:"##fff",border:"1px solid #f2f2f2"}}>
                                                        <Col>
                                                            {
                                                                gsmThirdChildItem.ChildItems.length>0 && 
                                                                <Icon 
                                                                    iconName={this.getCarotIconName(gsmThirdChildItem.Id)} 
                                                                    onClick={()=>this.onCarotIconClick(gsmThirdChildItem.Id)} 
                                                                />
                                                            }
                                                        </Col>
                                                        <Col>
                                                            <Checkbox onChange={(ev,checked)=>this.onSMItemChecked(gsmThirdChildItem.Id, checked)} checked={this.state.collSelSMId.indexOf(gsmThirdChildItem.Id)>-1} />
                                                        </Col>
                                                        <Col>{gsmThirdChildItem.Title}</Col>
                                                        <Col>{gsmThirdChildItem.SmartFilters && gsmThirdChildItem.SmartFilters.join("; ")}</Col>
                                                        <Col>{gsmThirdChildItem.Status}</Col>
                                                        <Col>{gsmThirdChildItem.SortOrder}</Col>
                                                        <Col><Icon iconName="Edit" /></Col>
                                                        <Col><Icon iconName="Delete" /></Col>
                                                    </Row>
                                                )
                                            }
                                        </React.Fragment>
                                       )
                                    }
                                </React.Fragment>
                            )
                        }
                        </React.Fragment>
                    )
                }
            </Container>
        );

        return (
            <Container>
                <Row>{elemCommandBar}</Row>
                <Row>{elemListSmartMetadata}</Row>
                {elemAddSMDialog}
            </Container>
        );
    }
}

export default ListSmartMetadata;