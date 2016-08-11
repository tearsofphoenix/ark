/**
 * Created by Grey on 16/6/13.
 */
import React, {Component, PropTypes} from 'react';
import cx from 'classnames';

const currentItemStyle = {
  background: '#00D0BD',
  color: '#ffffff'
};
const HALFCOUNT = 6;

export default class Pagination extends Component {
  static propTypes = {
    gotoPage: PropTypes.func,
    currentPage: PropTypes.number,
    pageCount: PropTypes.number,
    style: PropTypes.object,
  };

  _gotoPage = (event) => {
    event.preventDefault();
    const idx = parseInt(event.target.textContent, 10);
    this.props.gotoPage(idx - 1);
  };

  _renderPagination = (count) => {
    const result = [];
    const {currentPage} = this.props;
    if (count <= HALFCOUNT * 2) {
      for (let idx = 0; idx < count; ++idx) {
        const current = currentPage === idx;
        const style = current ? currentItemStyle : {};
        result.push(<li className={cx('item', {current})} style={style} key={idx}
                       onClick={this._gotoPage} ><a href="#">{idx + 1}</a></li>);
      }
    } else {
      // too many pages
      let idx = 0;
      if (currentPage > HALFCOUNT) {
        result.push(<li key={idx} onClick={this._gotoPage} ><a href="#">{idx + 1}</a></li>);
        idx = 1;
        result.push(<li key={idx} onClick={this._gotoPage} ><a href="#">{idx + 1}</a></li>);
        idx = 2;
        result.push(<li className={'ellipsis'} key={idx} ></li>);
        for (idx = currentPage - HALFCOUNT / 2; idx < currentPage; ++idx) {
          result.push(<li key={idx} onClick={this._gotoPage} ><a href="#">{idx + 1}</a></li>);
        }
      } else {
        for (idx = 0; idx < currentPage; ++idx) {
          result.push(<li key={idx} onClick={this._gotoPage} ><a href="#">{idx + 1}</a></li>);
        }
      }
      // end render left side

      idx = currentPage;
      result.push(<li className="current" key={idx} onClick={this._gotoPage} ><a href="#">{idx + 1}</a></li>);

      // start render right side
      if (currentPage < count - HALFCOUNT) {
        for (idx = currentPage + 1; idx < currentPage + 1 + HALFCOUNT / 2; ++idx) {
          result.push(<li className={'item'} key={idx} onClick={this._gotoPage} ><a href="#">{idx + 1}</a></li>);
        }
        idx = currentPage + 1 + HALFCOUNT;
        result.push(<li className={'ellipsis'} key={idx} ></li>);
        idx = count - 1;
        result.push(<li key={idx} onClick={this._gotoPage} ><a href="#">{idx + 1}</a></li>);
      } else {
        for (idx = currentPage + 1; idx < count; ++idx) {
          result.push(<li key={idx} onClick={this._gotoPage} ><a href="#">{idx + 1}</a></li>);
        }
      }
    }
    return result;
  };
  _gotoPreviousPage = () => {
    const {currentPage, gotoPage} = this.props;
    if (currentPage > 0) {
      gotoPage(currentPage - 1);
    }
  };
  _gotoNextPage = () => {
    const {currentPage, pageCount, gotoPage} = this.props;
    if (currentPage < pageCount - 1) {
      gotoPage(currentPage + 1);
    }
  };

  render() {
    const {currentPage, pageCount, style} = this.props;
    const isCurrentPageLastPage = currentPage === pageCount - 1;
    const isCurrentPageFirstPage = currentPage === 0;
    if (pageCount > 1) {
      return (<div style={style || {}} >
        <ul className="pagination text-center">
          <li className="pagination-previous">
            <a className={cx('', {disabled: isCurrentPageFirstPage})} onClick={this._gotoPreviousPage} >
              <i className="left chevron icon" />
              上一页
            </a>
          </li>
          {this._renderPagination(pageCount)}
          <li className="pagination-next">
            <a className={cx('', {disabled: isCurrentPageLastPage})} onClick={this._gotoNextPage} >
              下一页
              <i className="right chevron icon" />
            </a>
          </li>
        </ul>
      </div>);
    } else {
      return false;
    }
  }
}

