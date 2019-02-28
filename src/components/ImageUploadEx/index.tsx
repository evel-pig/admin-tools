import React from 'react';
import ImageUpload, { UploadDataType } from '../ImageUpload';
import ReactDragListView from 'react-drag-listview';
import Viewer from 'react-viewer';
import 'react-viewer/dist/index.css';
import { Spin, Progress } from 'antd';
import CloseIcon from '../CloseIcon';
import { createGetClassName, noop } from '../../util/util';
import './ImageUploadEx.less';
import classnames from 'classnames';

const getClassName = createGetClassName('image-upload-ex');

export interface ImageUploadExProps {
  desc?: string;
  imageClassName?: string;
  maxImageCount?: number;
  disabled?: boolean;
  multiple?: boolean;
  value?: ImageItem[];
  onChange?: (v) => void;
  uploadParams?: any;
  action: string;
  className?: string;
  uploadImgFieldName?: string;
  dataType?: UploadDataType;
  checkSuccess?: (r) => boolean;
  getResult?: (r) => any;
  uploadImgHeaders?: (defaultUploadHeaders) => any;
}

export interface ImageItem {
  src: string;
  loading?: boolean;
  name?: string;
  progress?: number;
}

interface MyState {
  images: ImageItem[];
  viewerVisible: boolean;
  viewerIndex: number;
}

class ImageUploadEx extends React.Component<ImageUploadExProps, Partial<MyState>> {
  static defaultProps = {
    images: [],
    disabled: false,
    uploadParams: {},
    className: '',
    onChange: noop,
    uploadImgFieldName: 'object',
    getResult: r => r.url,
  };

  imageUpload: any;

  constructor(props) {
    super(props);

    this.state = {
      viewerVisible: false,
      viewerIndex: 0,
      images: this.props.value || [],
    };
  }

  componentDidUpdate(prevProps: ImageUploadExProps, prevState) {
    if (this.props.value !== prevProps.value) {
      this.setState({
        images: this.props.value,
      });
    }
  }

  handleUploadSuccess = (r, file) => {
    const newImages = this.state.images.map(item => {
      if (item.name === file.name) {
        return {
          ...this.props.getResult(r),
          loading: false,
        };
      }
      return item;
    });
    this.setState({
      images: newImages,
    });
    this.props.onChange(newImages);
  }

  handleUploadError = (r, file) => {
    this.setState({
      images: this.state.images.filter(item => {
        if (item.name === file.name) {
          return false;
        }
        return true;
      }),
    });
  }

  handleImageClose = (i, e: Event) => {
    e.stopPropagation();
    e.preventDefault();
    const newImages = this.state.images.filter((item, index) => index !== i);
    this.setState({
      images: newImages,
    });
    this.props.onChange(newImages);
  }

  handleDragEnd = (fromIndex, toIndex) => {
    const imageList = this.state.images;
    const targetImage = imageList.splice(fromIndex, 1)[0];
    imageList.splice(toIndex, 0, targetImage);
    this.setState({
      images: imageList,
    });
  }

  openViewer = (index) => {
    this.setState({
      viewerIndex: index,
      viewerVisible: true,
    });
  }

  getViewerImages = () => {
    return this.state.images.map(item => {
      return {
        src: item.src || '',
        alt: item.name || '',
      };
    });
  }

  handleBeforeUploadChange = (file, fileList) => {
    this.setState({
      images: this.state.images.concat(fileList.map(item => {return {
        src: '',
        loading: true,
        name: item.name,
      }; })),
    });
  }

  handleUploadProgress = (p, file) => {
    this.setState({
      images: this.state.images.map(item => {
        if (item.name === file.name) {
          return {
            ...item,
            progress: p,
          };
        }
        return item;
      }),
    });
  }

  render() {
    const imageList = this.state.images || [];

    const uploadeEnable = this.props.maxImageCount === undefined ? true : imageList.length < this.props.maxImageCount;

    return (
      <div className={classnames(getClassName(), this.props.className)}>
        <div className={getClassName('wrapper')}>
          <div className={getClassName('desc')} style={{ whiteSpace: 'nowrap' }}>{this.props.desc}</div>
          <ImageUpload
            text="上传图片"
            disabled={!uploadeEnable || this.props.disabled}
            multiple={this.props.multiple}
            action={this.props.action}
            uploadParams={this.props.uploadParams}
            uploadImgFieldName={this.props.uploadImgFieldName}
            onUploadSuccess={this.handleUploadSuccess}
            onUploadError={this.handleUploadError}
            onBeforeUploadChange={this.handleBeforeUploadChange}
            onProgress={this.handleUploadProgress}
            ref={node => this.imageUpload = node}
            dataType={this.props.dataType}
            checkSuccess={this.props.checkSuccess}
            uploadImgHeaders={this.props.uploadImgHeaders}
          />
        </div>
        <ReactDragListView.DragColumn
          onDragEnd={this.handleDragEnd}
          nodeSelector={`div.${getClassName('image-item')}`}
          handleSelector={`div.${getClassName('image-item')}`}
        >
          <div className={getClassName('image-list')}>
            {imageList.map((item, i) => {
              const loading = typeof item.loading === 'undefined' ? false : item.loading;
              return (
                <div key={i} className={getClassName('image-item')} onClick={() => { this.openViewer(i); }}>
                  <Spin
                    spinning={loading}
                  >
                    <img
                      src={item.src}
                      className={`${this.props.imageClassName}`}
                    />
                  </Spin>
                  {!this.props.disabled  &&
                  <CloseIcon
                    className={getClassName('close')}
                    onClose={(e) => {
                      if (loading) {
                        this.imageUpload.abortUpload();
                      }
                      this.handleImageClose(i, e);
                    }}
                  />}
                  {loading && (
                    <Progress
                      showInfo={false}
                      percent={item.progress * 100}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </ReactDragListView.DragColumn>
        <Viewer
          visible={this.state.viewerVisible}
          onClose={() => { this.setState({ viewerVisible: false }); }}
          images={this.getViewerImages()}
          activeIndex={this.state.viewerIndex}
        />
      </div>
    );
  }
}

export default ImageUploadEx;
