import * as React from 'react';
// import styles from './SmartMetaSearch.module.scss';
import { ISmartMetaSearchProps } from './ISmartMetaSearchProps';
// import SmartSearchTable from './SmartMetaSearchTable'
// import { escape } from '@microsoft/sp-lodash-subset';
import TaskMangementTable from '../../../globalComponents/SmartSearchfilter/SmartSearchfilter';
export default class SmartMetaSearch extends React.Component<ISmartMetaSearchProps, {}> {
  public render(): React.ReactElement<ISmartMetaSearchProps> {
    const {
      description,
      SmartMetadataListID,
      PortFolioTypeID,
      siteUrl     
    } = this.props;

    return (    
      <>
         <div>
          <TaskMangementTable selectedArray={this.props}/>
          {/* <SmartSearchTable />*/}
         </div>
      </>
    )
  }
}
