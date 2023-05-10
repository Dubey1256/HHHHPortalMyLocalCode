import * as React from 'react';
import { IContactdatabaseProps } from './IContactdatabaseProps';
;
import ContactMainPage from './MainContact';

export default class Contactdatabase extends React.Component<IContactdatabaseProps, {}> {
  public render(): React.ReactElement<IContactdatabaseProps> {
    

    return (
      <ContactMainPage/>
    );
  }
}
