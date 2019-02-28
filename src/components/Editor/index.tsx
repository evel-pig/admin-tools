import React, { Component } from 'react';
import { Input } from 'antd';
import E from './wangEditor';
import { createGetClassName, noop } from '../../util/util';
import './index.less';
const TextArea = Input.TextArea;

const getClassName = createGetClassName('editor');

interface WangEditorProps {
  editorConfig?: any;
  value?: any;
  onChange?: any;
}

interface WangEditorState {
  htmlVisible: boolean;
  value: string;
}

const EDITOR_DEFAULTVALUE = '<p><br></p>';

function getFullHtml({ body, title = '', isMobile = true }) {
  return `<!DOCTYPE html><html><head><title>${title}</title>` +
    // tslint:disable-next-line:max-line-length
    (isMobile ? `<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">` : '')
    + `<meta charset="UTF-8"></head><body>${body}</body></html>`;
}

function getHtmlBody(html) {
  let body = '';
  let r = html.match(/<body>(.*)(?=<\/body>)/);
  if (r) {
    body = r[1];
  }

  return body;
}

class Editor extends Component<WangEditorProps, WangEditorState> {
  static defaultProps = {
    onChange: noop,
    editorConfig: {},
  };

  static getFullHtml = getFullHtml;
  static getHtmlBody = getHtmlBody;

  editor: any;

  constructor(props) {
    super(props);
    this.state = {
      htmlVisible: false,
      value: props.value,
    };
  }

  componentDidMount() {
    this.initEditor();
  }

  toggle = () => {
    const nextVisble = !this.state.htmlVisible;
    if (nextVisble) {
      // 切换到富文本模式，设置html内容;
      this.setState({ htmlVisible: nextVisble, value: this.editor.txt.html() });
    } else {
      // 切换到textArea模式，设置textArea内容;
      this.editor.txt.html(this.state.value);
      this.setState({ htmlVisible: nextVisble });
    }
  }

  shouldComponentUpdate(nextProps: WangEditorProps, nextState) {
    if (nextProps.value !== this.props.value) {
      return true;
    }
    if (this.state.htmlVisible || nextState.htmlVisible) {
      return true;
    }

    return false;
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    if (this.props.value !== this.state.value) {
      return this.props.value || null;
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (snapshot) {
      this.editor.txt.html(snapshot);
      this.setState({
        value: snapshot,
      });
    }
  }

  handleEditorChange = v => {
    if (v === EDITOR_DEFAULTVALUE) {
      v = undefined;
    }
    this.changeValue(v);
  }

  handleTextAreaChange = e => {
    const v = e.target.value;
    this.changeValue(v);
  }

  changeValue = v => {
    this.setState({
      value: v,
    });
    this.props.onChange(v);
  }

  initEditor = () => {
    this.editor = new E(this.refs.editorElem1, this.refs.editorElem2);
    this.editor.customConfig = {
      zIndex: 100,
      showLinkImg: false,
      uploadImgMaxLength: 1,
      uploadImgHeaders: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      toggle: this.toggle,
      pasteTextHandle: content => {
        console.log('pasteTextHandle', content);
        return content.replace(/\n/g, '</p><p>');
      },
      ...this.props.editorConfig,
      onchange: this.handleEditorChange,
    };
    this.editor.create();
    this.editor.txt.html(this.state.value);
  }

  render() {
    return (
      <React.Fragment>
        <div ref="editorElem1" className={getClassName('toolbar')} />
        <div
          ref="editorElem2"
          className={getClassName('body')}
          style={{ display: this.state.htmlVisible ? 'none' : 'block' }}
        />
        <TextArea
          style={{ display: this.state.htmlVisible ? 'block' : 'none', height: 300, borderRadius: 0 }}
          value={this.state.value}
          onChange={this.handleTextAreaChange}
        />
      </React.Fragment>
    );
  }
}

export default Editor;
