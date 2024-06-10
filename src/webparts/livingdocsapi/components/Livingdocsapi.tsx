import * as React from 'react';
import { ILivingdocsapiProps } from './ILivingdocsapiProps';
import ArticleComponent from './Getartical';
import GrueneSmartPages from './HHHHProfilePage';
import TestSmartPages from './TestProfilePage';
import TestBackupSmartPages from './TestBackup';

export default class Livingdocsapi extends React.Component<ILivingdocsapiProps, {}> {
  public render(): React.ReactElement<ILivingdocsapiProps> {

    return (
      <>
      < ArticleComponent/>
      {/* < TestSmartPages/> */}
      {/* < TestBackupSmartPages/> */}
    </>
    );
  }
}
