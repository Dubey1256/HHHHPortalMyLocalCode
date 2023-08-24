import * as React from 'react';
import { ISmartMetaSearchProps } from './ISmartMetaSearchProps';
import SmartSearchTable from './SmartMetaSearchTable'
import SmartFilterSearchGlobal from './SmartSearchfilter';
export default class SmartMetaSearch extends React.Component<ISmartMetaSearchProps, {}> {
  public render(): React.ReactElement<ISmartMetaSearchProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      ContextValue,
      userDisplayName,
      SmartMetadataListId,
      TaskUsertListID,  
      TaskTimeSheetListID   
    } = this.props;

    return (    
      <>
         <div>
          <SmartFilterSearchGlobal selectedArray={this.props}/>
          {/* <SmartSearchTable />*/}
         </div>
      </>
    )
  }
}
