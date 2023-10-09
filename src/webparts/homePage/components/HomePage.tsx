import * as React from 'react';
// import styles from './HomePage.module.scss';
import { IHomePageProps } from './IHomePageProps';
import LatestItems from './LatestItem';
// import { escape } from '@microsoft/sp-lodash-subset';

export default class HomePage extends React.Component<IHomePageProps, {}> {
  public render(): React.ReactElement<IHomePageProps> {
   
      const AnnouncementsListId= this.props;
   

    return (
      <section>
      <div className='heading'> Welcome to HHHH </div>       
      <LatestItems props={AnnouncementsListId}/>                         
    </section>
    
    );
  }
}
