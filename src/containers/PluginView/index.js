/**
 * Created by isaac on 16/7/18.
 */
/**
 * Created by isaac on 16/5/6.
 */
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {push} from 'react-router-redux';
import {listPlugins, deletePlugin} from './api';
import {getPageCount} from 'utils/func';

import {TableView} from 'components';
import {Button, Header, Segment} from 'stardust';
import columnCreator from './columns';
import Dropzone from 'react-dropzone';
import superagent from 'superagent';

const style = {
  cursor: 'pointer',
  width: '100%',
  textAlign: 'center',
  height: '100%',
  lineHeight: '600px',
  fontSize: '18px'
};

const promptStyle = {
  lineHeight: '28px',
  display: 'inline-block'
};

@connect(
  () => ({}),
  {
    push,
  })
export default
class PluginView extends Component {
  static propTypes = {
    push: PropTypes.func.isRequired
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      data: [],
      columns: columnCreator(this._handleEdit, this._handleDelete),
      currentPage: 0,
      total: 0,
      pageSize: TableView.defaultPageSize
    };
  }

  componentWillMount() {
    this.gotoPage(this.state.currentPage);
  }

  gotoPage = (index) => {
    const {pageSize} = this.state;
    listPlugins({skip: index * pageSize, limit: pageSize})
      .then((response) => {
        const {data} = response;
        const total = data.length;
        this.setState({
          data,
          currentPage: index,
          total: getPageCount(total, pageSize)
        });
      });
  };
  _handleAddEvent = () => {
    this.setState({isUploadOpen: true});
  };

  _handleEdit = (model) => {
    this.setState({selected: model, isUploadOpen: true});
  };

  _handleDelete = (model) => {
    deletePlugin({id: model._id}).then(() => {
      console.log('ok');
    });
  };
  _closeUpload = () => {
    this.setState({isUploadOpen: false});
  };

  _onDrop = (files) => {
    const req = superagent.post('/plugin/upload');
    files.forEach((file) => {
      req.attach('file', file);
    });
    req.end((error, response) => {
      if (!error) {
        console.log(response);
      } else {
        console.error('Upload failed!!!');
      }
    });
  };

  _onDropzoneClick = () => {
    this.refs.dropzone.open();
  };
  _renderUpload = () => {
    return (<div>
      <Segment className="basic" >
        <Header.H3 floated="right" >
          <Button className="primary" onClick={this._closeUpload} >Cancel</Button>
        </Header.H3>
      </Segment>
      <div style={{width: '100%', height: '600px', padding: '40px'}} >
        <Dropzone ref="dropzone" onDrop={this._onDrop} onClick={this._onDropzoneClick} accept="application/zip"
                  style={{width: '100%', height: '100%', border: '1px dashed', backgroundColor: '#F0F0F0F0'}} >
          <div style={style} ><span style={promptStyle} >Drag Or Choose File(.zip)</span></div>
        </Dropzone>
      </div>
    </div>);
  };
  _renderNormal = () => {
    const {data, columns, currentPage, pageSize, total} = this.state;

    const elements = [];
    elements.push(<Segment className="basic" key={1} >
      <Header.H3 floated="right" >
        <Button className="primary" onClick={this._handleAddEvent} >Upload</Button>
      </Header.H3>
    </Segment>);
    elements.push(<div style={{height: 'calc(100% - 40px)', width: '100%', padding: '40px'}} key={2} >
      <TableView columns={columns} rows={data} currentPage={currentPage} pageSize={pageSize}
                 pageCount={total} />
    </div>);
    return elements;
  };

  render() {
    const {isUploadOpen} = this.state;
    return (<div style={{height: '100%'}} >
      {isUploadOpen && this._renderUpload()}
      {!isUploadOpen && this._renderNormal()}
    </div>);
  }
}
