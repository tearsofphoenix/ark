/**
 * Created by isaac on 16/6/27.
 */
import React, {Component, PropTypes} from 'react';
import dot from 'dot-component';
import Pagination from './Pagination.js';
import Search from './Search.js';
import Empty from './Empty.js';
import {getPageCount} from 'utils/func';
import {Scrollbars} from 'react-custom-scrollbars';
export const defaultPageSize = 12;

function valueGetter(columnInfo, rowItem, rowIndex, currentPage, pageSize) {
  let result = null;
  const {field, display} = columnInfo;
  const start = (currentPage && pageSize) ? currentPage * pageSize : 0;
  const realIndex = rowIndex + start + 1;
  if (typeof display === 'function') {
    result = display(rowItem, rowIndex, realIndex);
  } else if (field === '$index') {
    result = realIndex;
  } else {
    result = dot.get(rowItem, field);
  }
  return result;
}

export default
class TableView extends Component {
  static propTypes = {
    columns: PropTypes.array.isRequired,
    rows: PropTypes.array.isRequired,
    rowClass: PropTypes.func,
    // pagination
    gotoPage: PropTypes.func,
    currentPage: PropTypes.number,
    pageSize: PropTypes.number,
    pageMargin: PropTypes.string,
    pageAlign: PropTypes.string,
    pageCount: PropTypes.number,
    // search
    enableSearch: PropTypes.bool,
    clientMode: PropTypes.bool,
    searchCallback: PropTypes.func,
    searchResetCallback: PropTypes.func,
    placeholder: PropTypes.string,
  };

  constructor(props, context) {
    super(props, context);
    const {columns, currentPage = 0, clientMode, pageSize = defaultPageSize} = props;
    const originData = props.rows;
    const rows = clientMode ? originData.slice(currentPage * pageSize, (currentPage + 1) * pageSize) : originData;
    const pageCount = clientMode ? getPageCount(originData.length, pageSize) : props.pageCount;
    this.state = {
      originData,
      rows,
      columns,
      currentPage,
      pageCount,
      currentSortColumnIndex: -1,
      sortAscending: true
    };
  }

  componentWillReceiveProps(newProp) {
    const {columns, clientMode, pageSize = defaultPageSize} = newProp;
    let {currentPage} = newProp;
    if (typeof currentPage === 'undefined' || currentPage === null) {
      currentPage = this.state.currentPage;
    }
    const originData = newProp.rows;
    const pageCount = clientMode ? getPageCount(originData.length, pageSize) : newProp.pageCount;
    const rows = clientMode ? originData.slice(currentPage * pageSize, (currentPage + 1) * pageSize) : originData;
    this.setState({rows, columns, currentPage, pageCount, originData});
  }

  _handleSortEvent = (column, columnIndex, sortFunction) => {
    const {currentSortColumnIndex} = this.state;
    let {sortAscending, rows} = this.state;
    rows = rows.slice(0);
    if (currentSortColumnIndex === columnIndex) {
      sortAscending = !sortAscending;
    } else {
      sortAscending = true;
    }
    if (sortFunction) {
      rows.sort(sortFunction);
    } else {
      rows.sort((obj1, obj2) => valueGetter(column, obj1) > valueGetter(column, obj2));
    }
    if (!sortAscending) {
      rows = rows.reverse();
    }
    this.setState({currentSortColumnIndex: columnIndex, sortAscending, rows});
  };
  _getSortIcon = (columnIndex, currentSortColumnIndex, ascending) => {
    let icon = null;
    if (columnIndex === currentSortColumnIndex) {
      icon = <i className={`sort alphabet ${ascending ? 'ascending' : 'descending'} icon`} />;
    }
    return icon;
  };
  _renderHeader = (columns) => {
    const {currentSortColumnIndex, sortAscending} = this.state;
    return columns.map((item, idx) => {
      const {name, sort} = item;
      let result = null;
      if (typeof sort === 'boolean') {
        result = (<th key={idx} onClick={this._handleSortEvent.bind(null, item, idx, null)} >
                      {name}{this._getSortIcon(idx, currentSortColumnIndex, sortAscending)}
        </th>);
      } else if (typeof sort === 'function') {
        result = (<th key={idx} onClick={this._handleSortEvent.bind(null, item, idx, sort)} >
                      {name}{this._getSortIcon(idx, currentSortColumnIndex, sortAscending)}
        </th>);
      } else if (typeof sort === 'string') {
        const sortor = (obj1, obj2) => dot.get(obj1, sort) > dot.get(obj2, sort);
        result = (<th key={idx} onClick={this._handleSortEvent.bind(null, item, idx, sortor)} >
                      {name}{this._getSortIcon(idx, currentSortColumnIndex, sortAscending)}
        </th>);
      } else {
        result = <th key={idx} >{name}</th>;
      }
      return result;
    });
  };
  _renderRow = (rows, columns) => {
    const {rowClass} = this.props;
    const {pageSize = defaultPageSize, currentPage} = this.state;
    return rows.map((rowItem, rowIndex) => {
      let rowClassName = null;
      if (typeof rowClass === 'function') {
        rowClassName = rowClass(rowItem, rowIndex);
      }
      const rowElements = columns.map((column, idx) => {
        let style = {...column.style};
        if (!column.style) {
          // set default cell style
          style = {paddingTop: '5px', paddingBottom: '5px'};
        }
        return (<td key={idx} style={style} >{valueGetter(column, rowItem, rowIndex, currentPage, pageSize)}</td>);
      });
      return (<tr className={rowClassName} key={rowIndex} >{rowElements}</tr>);
    });
  };
  _clientModeGotoPage = (index) => {
    const {originData, pageSize = defaultPageSize} = this.state;
    const rows = originData.slice(index * pageSize, (index + 1) * pageSize);
    this.setState({currentPage: index, rows});
  };

  render() {
    const {rows, columns, currentPage, pageCount} = this.state;
    const {enableSearch, clientMode, searchCallback, searchResetCallback, placeholder, pageMargin, pageAlign} = this.props;
    const gotoPage = clientMode ? this._clientModeGotoPage : this.props.gotoPage;
    const searchProps = {searchCallback, searchResetCallback, placeholder};
    let search = null;
    let height = '100%';
    if (enableSearch) {
      search = (<Search {...searchProps} />);
      height = 'calc(100% - 60px)';
      if (pageCount > 1) {
        height = 'calc(100% - 126px)';
      }
    } else {
      if (pageCount > 1) {
        height = 'calc(100% - 96px)';
      }
    }
    const responsiveTableStyle = {
      width: '100%',
      height
    };
    const pageStyle = {
      marginTop: pageMargin || 0,
      textAlign: pageAlign || 'center'
    };
    const pageProps = {currentPage, gotoPage, pageCount, style: pageStyle};
    return (
      <div style={{height: '100%', position: 'relative'}} >{search}
        <Empty rowsCount={rows.length} />
        <div style={responsiveTableStyle} >
          <Scrollbars>
            <table className="ui celled table" >
              <thead>
              <tr>{this._renderHeader(columns)}</tr>
              </thead>
              <tbody>{this._renderRow(rows, columns)}</tbody>
            </table>
          </Scrollbars>
        </div>
        <Pagination {...pageProps} />
      </div>
    );
  }
}

TableView.defaultPageSize = defaultPageSize;
