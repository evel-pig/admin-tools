import * as React from 'react';
import BasicComponent from '../../../components/BasicComponent';
import { connect } from '../../../util/inject';
import { MenuState } from '../../../commonModels/menu';
import Exception from '../../../components/Exception';
import { history } from '../../../util/util';

export interface Exception404Props {
  data: MenuState;
}

export class Exception404 extends BasicComponent<Exception404Props, any> {
  handleClick = () => {
    history.push({
      pathname: this.props.data.activePath,
    });
  }

  render() {
    return (
      <Exception
        type="404"
        onClick={this.handleClick}
      />
    );
  }
}

export default connect({
  data: require('../../../commonModels/menu'),
})(Exception404);
