import * as React from 'react';
import { Upload, Button, Icon, message } from 'antd';
import { isImage, getBase64, noop } from '../../util/util';

export type UploadDataType = 'formData' | 'json';

export interface ImageUploadProps {
  text?: string;
  disabled?: boolean;
  loading?: boolean;
  onChange?: (result, base64, file) => void;
  action?: string;
  uploadImgFieldName?: string;
  uploadParams?: any;
  onUploadSuccess?: (result, file) => void;
  onUploadError?: (err, file) => void;
  multiple?: boolean;
  onBeforeUploadChange?: (file, fileList) => void;
  onProgress?: (progress, file) => void;
  checkSuccess?: (r) => boolean;
  dataType?: UploadDataType;
  uploadImgHeaders?: (defaultUploadHeaders) => any;
}

interface MyState {
  loading: boolean;
}

export default class ImageUpload extends React.Component<ImageUploadProps, Partial<MyState>> {
  static defaultProps = {
    disabled: false,
    text: '上传图片',
    multiple: false,
    onProgress: noop,
    onUploadError: noop,
    onUploadSuccess: noop,
    onBeforeUploadChange: noop,
    onChange: noop,
    checkSuccess: (r) => {
      return r.status === 0;
    },
    dataType: 'json',
    uploadImgHeaders: (u) => u,
  };

  static getDerivedStateFromProps(nextProps: ImageUploadProps, prevState) {
    if (nextProps.loading !== prevState.loading) {
      return {
        loading: nextProps.loading,
      };
    }
    return null;
  }

  xhr: XMLHttpRequest;

  constructor(props) {
    super(props);

    this.state = {
      loading: this.props.loading || false,
    };

    this.xhr = null;
  }

  uploadCompleted = (r, file) => {
    this.xhr = null;
    this.setState({
      loading: false,
    });
    message.success(`${file.name} 上传成功`, 1);
    this.props.onUploadSuccess(r, file);
  }

  uploadFailed = (err, file) => {
    this.xhr = null;
    this.setState({
      loading: false,
    });
    message.error(`${file.name} 上传失败`, 1);
    this.props.onUploadError(err, file);
  }

  handleBeforeUpload = (file, fileList) => {
    const isImg = isImage(file.type);
    if (!isImg) {
      message.error(`${file.name}不是图片（只能上传jpg和png图片）!`);
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 10;
    if (!isLt2M) {
      message.error(`${file.name} 大小不能超过10m!`);
      return false;
    }

    if (this.props.onBeforeUploadChange) {
      this.props.onBeforeUploadChange(file, fileList);
    }

    getBase64(file, (result, base64) => {
      if (this.props.onChange) {
        this.props.onChange(result, base64, file);
      }

      if (this.props.action) {
        this.setState({
          loading: true,
        });
        let body = null;
        if (this.props.dataType === 'json') {
          body = {
            ...this.props.uploadParams,
            [this.props.uploadImgFieldName]: base64,
          };
          body = JSON.stringify(body);
        }
        if (this.props.dataType === 'formData') {
          body = new FormData();
          Object.keys(this.props.uploadParams).forEach(key => {
            const val = encodeURIComponent(this.props.uploadParams[key]);
            body.append(key, val);
          });
          body.append(this.props.uploadImgFieldName, file);
        }

        let xhr = this.xhr;
        xhr = new XMLHttpRequest();
        xhr.open('post', this.props.action, true);
        const defaultUploadImgHeaders = {
          ['Content-Type']: 'application/json',
          Accept: 'application/json',
        };
        const uploadImgHeaders = this.props.uploadImgHeaders(defaultUploadImgHeaders);
        Object.keys(uploadImgHeaders).forEach(key => {
          xhr.setRequestHeader(key, uploadImgHeaders[key]);
        });
        const uploadCompleted = (e) => {
          try {
            const r = JSON.parse(e.target.responseText);
            if (!this.props.checkSuccess(r)) {
              return this.uploadFailed(new Error(), file);
            }
            this.uploadCompleted(r, file);
          } catch (err) {
            this.uploadFailed(err, file);
          }
        };
        const uploadFailed = err => {
          this.uploadFailed(err, file);
        };
        xhr.onload = uploadCompleted;
        xhr.onerror = uploadFailed;
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            this.props.onProgress(Math.round(e.loaded / e.total), file);
          }
        };
        xhr.send(body);
      }
    });

    return false;
  }

  abortUpload = () => {
    if (this.xhr !== null) {
      this.xhr.abort();
    }
  }

  render() {
    return (
      <Upload
        action=""
        beforeUpload={this.handleBeforeUpload}
        showUploadList={false}
        multiple={this.props.multiple}
      >
        <Button
          loading={this.state.loading}
          disabled={this.props.disabled}
          type="ghost"
        >
          <Icon type="upload" />{this.props.text}
        </Button>
      </Upload>
    );
  }
}
