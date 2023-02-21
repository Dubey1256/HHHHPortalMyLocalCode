import * as React from "react";
import { Container, Row, Tab, Tabs } from "react-bootstrap";

import { IManageSmartMetadataAppProps } from "./IManageSmartMetadataAppProps";
import { IManageSmartMetadataAppState } from "./IManageSmartMetadataAppState";

import GlobalConstants from "../../../common/GlobalConstants";
import spservices from "../../../spservices/spservices";
import ListSmartMetadata from "./ListSmartMetadata";

class ManageSmartMetadataApp extends React.Component<IManageSmartMetadataAppProps, IManageSmartMetadataAppState> {
    /**
     *
     */
    private spservice: spservices = null;
    constructor(props: IManageSmartMetadataAppProps) {
        super(props);
        this.spservice = new spservices();
        
        this.state = {
            tabs: [],
            selTabKey: "",
            sMetadataItems: [],
            groupedSMetadataItems: []
        };

        this._onTabSelected = this._onTabSelected.bind(this);
    }

    componentDidMount(): void {
        this.loadConfigurations();
    }

    private async loadConfigurations() {
        let _tabs = await this.getTabs();
        const _sMetadataItems = await this.getSmartMetadata();
        _tabs = _tabs.map(tab=>({
            ...tab,
            ...{ Items: _sMetadataItems.filter(sMetadataItem=>sMetadataItem.TaxType==tab.Title) }
        }));
        const selTabName: string = "Client Category";

        this.setState({
            selTabKey: selTabName,
            tabs: _tabs,
            sMetadataItems: _sMetadataItems
        }, ()=>this._onTabSelected(selTabName));
        
    }

    private async getTabs() {

        let tabItems: any[] = [];

        const QueryTabs = {
            Select: "ID,Title,OrderBy,WebpartId,DisplayColumns,Columns,QueryType,FilterItems",
            Expand: "",
            Filter: "WebpartId eq 'AllManageSmartMetadataPortfolioTabs'",
            Top: 4999,
            OrderBy: ""
        };

        const resTabs = await this.spservice.getListItems(GlobalConstants.SITE_CONFIGURATIONS_LISTID,QueryTabs.Select,QueryTabs.Expand,QueryTabs.Filter,QueryTabs.OrderBy,QueryTabs.Top);
        
        if(resTabs.length>0) {
            const jsonDisplayColumns = resTabs[0].DisplayColumns;
            tabItems = JSON.parse(jsonDisplayColumns);
        }
        
        return tabItems;
    }

    private async getSmartMetadata() {
        let sMetadataGroupedItems: any[] = [];

        const QuerySmartMetadata = {
            Select: "*,Author/Title,Editor/Title,Parent/Id,Parent/Title",
            Expand: "Parent,Author,Editor",
            Filter: "isDeleted ne 1",
            OrderBy: "SortOrder",
            Top: 4999           
        };

        const resSmartMetaItems = await this.spservice.getListItems(GlobalConstants.SMARTMETADATA_LIST_ID, QuerySmartMetadata.Select, QuerySmartMetadata.Expand, QuerySmartMetadata.Filter, QuerySmartMetadata.OrderBy, QuerySmartMetadata.Top);
        if(resSmartMetaItems.length>0) {
            const parentMetadataItems = resSmartMetaItems.filter((sMetadata:any)=>sMetadata.Parent==null);
            
            parentMetadataItems.forEach((parentMetadataItem:any) => {
                let _parentItem = {...parentMetadataItem, ...this.getChildItems(parentMetadataItem.Id, resSmartMetaItems)}
                sMetadataGroupedItems.push(_parentItem);
            });            
        }
        return sMetadataGroupedItems;
    }

    private getChildItems(parentId: number, sMetadataItems: any[]) {
        let _childItems = {
            ChildItems: [] as any[]
        };

        let childItems = sMetadataItems.filter(sMetadataItem=>sMetadataItem.Parent && sMetadataItem.Parent.Id==parentId);
        
        childItems.forEach(childItem=>{
            _childItems.ChildItems.push({...childItem, ...this.getChildItems(childItem.Id, sMetadataItems)});
        });

        return _childItems;
    }

    private _onTabSelected(key: string) {
        const selTab = [...this.state.tabs].filter(tab=>tab.Title==key)[0];
        this.setState({
            selTabKey: key,
            groupedSMetadataItems: selTab.Items
        });
    }

    render() {

        const elemListSmartMetadata: JSX.Element = (this.state.groupedSMetadataItems.length>0 && 
            <ListSmartMetadata 
                tabKey={this.state.selTabKey} 
                groupedSmartMetadataItems={this.state.groupedSMetadataItems}
                spService = {this.spservice} 
            />);

        const elemTabs: JSX.Element = (<Tabs activeKey={this.state.selTabKey} onSelect={this._onTabSelected}>
            { 
                this.state.tabs.map(tab => <Tab title={tab.Title} eventKey={tab.Title}></Tab>)
            }
        </Tabs>);

        return (<Container>
            <Row>{elemTabs}</Row>
            <Row>{elemListSmartMetadata}</Row>
        </Container>);
    }

}

export default ManageSmartMetadataApp;