import * as React from 'react';
import styles from './FroalaEditorTestEnv.module.scss';
import { IFroalaEditorTestEnvProps } from './IFroalaEditorTestEnvProps';
import MainComponent from './mainComponent';

export default class FroalaEditorTestEnv extends React.Component<IFroalaEditorTestEnvProps, {}> {
  public render(): React.ReactElement<IFroalaEditorTestEnvProps> {
    const {
      hasTeamsContext,
    } = this.props;

    return (
      <section className={`${styles.froalaEditorTestEnv} ${hasTeamsContext ? styles.teams : ''}`}>
        <MainComponent></MainComponent>
      </section>
    );
  }
}
