import * as React from 'react'
import * as $ from 'jquery';
// import pnp,{Web} from "sp-pnp-js";
import pnp from "sp-pnp-js";
import '@pnp/sp/webs';
import '@pnp/sp/site-users';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './pm.css';
import { Panel } from "office-ui-fabric-react";
import { Table } from "react-bootstrap";
import { IPermissionManagementProps } from './IPermissionManagementProps';
import Permission_management from './Permission_management';
// import Select from "react-select";
// import {ReactSnackBar} from "react-js-snackbar";
// import ReactSnackBar from "react-js-snackbar";

var Sitegroup: any = [];
export default class PermissionManagement extends React.Component<IPermissionManagementProps, {}> {
  public render(): React.ReactElement<IPermissionManagementProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName,
      context
    } = this.props;

    return (
<Permission_management props={this.props}/>
    );
  }
}
