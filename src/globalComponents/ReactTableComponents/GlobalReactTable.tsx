import React from 'react'
import { Table, Row, Col, Pagination, PaginationLink, PaginationItem, Input, } from "reactstrap";
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaAngleLeft, FaAngleRight, FaCaretDown, FaCaretRight, FaSort, FaSortDown, FaSortUp, } from "react-icons/fa";
import { useTable, useSortBy, useFilters, useExpanded, usePagination, HeaderGroup, } from "react-table";
import { Filter, DefaultColumnFilter, } from "./filters";
import PageLoader from '../pageLoader';

export class GlobalReactTable  {

  render() {
    return (
      <div>GlobalReactTable</div>
    )
  }
}

export default GlobalReactTable