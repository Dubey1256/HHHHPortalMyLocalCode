import * as React from 'react';
import styles from './HhhhSmartMetadataPortfolio.module.scss';
import type { IHhhhSmartMetadataPortfolioProps } from './IHhhhSmartMetadataPortfolioProps';
import { escape } from '@microsoft/sp-lodash-subset';
import ManageSmartMetadata from './ManageSmartMetadata';
import { myContextValue } from '../../../globalComponents/globalCommon';
export default class HhhhSmartMetadataPortfolio extends React.Component<IHhhhSmartMetadataPortfolioProps, {}> {
  public render(): React.ReactElement<IHhhhSmartMetadataPortfolioProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName
    } = this.props;

    return (
      <myContextValue.Provider value={{ ...myContextValue.defaultValue, OpenModal: null, RestructureTopIcon: true }}>
      <div>
        <ManageSmartMetadata AllList={this.props} />
      </div>
    </myContextValue.Provider>
    );
  }
}
