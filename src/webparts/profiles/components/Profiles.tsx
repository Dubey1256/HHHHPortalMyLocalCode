import * as React from 'react';
import type { IProfilesProps } from './IProfilesProps';
import GrueneProfiles from './ProfilePages'

export default class Profiles extends React.Component<IProfilesProps, {}> {
  public render(): React.ReactElement<IProfilesProps> {
    return (
      <div>
        <GrueneProfiles AllList={this.props} />
      </div>
    );
  }
}
