import * as React from 'react';
import { Modal, Select } from 'antd';

const Option = Select.Option;

export interface TurnOperatorProps {
  visible: boolean;
  operators: any[];
  onCancel: () => void;
  onOk: (operatorId: any) => void;
  loading?: boolean;
}

export interface MyState {
  selectedOperatorId: any;
  visible: boolean;
}

export default class TurnOperator extends React.Component<TurnOperatorProps, Partial<MyState>> {
  static getDerivedStateFromProps(nextProps: TurnOperatorProps, prevState: MyState) {
    if (nextProps.visible && !prevState.visible) {
      return {
        selectedOperatorId: null,
        visible: nextProps.visible,
      };
    }

    return {
      visible: nextProps.visible,
    };
  }

  constructor(props: TurnOperatorProps) {
    super(props);
    this.state = {
      selectedOperatorId: null,
      visible: props.visible,
    };
  }

  render() {
    return (
      <Modal
        visible={this.props.visible}
        title="转单"
        onCancel={this.props.onCancel}
        onOk={() => {
          this.props.onOk(this.state.selectedOperatorId);
        }}
        confirmLoading={this.props.loading}
      >
        <Select
          value={this.state.selectedOperatorId}
          onSelect={v => {this.setState({ selectedOperatorId: v }); }}
          style={{
            width: '100%',
          }}
        >
          {this.props.operators.map(item => {
            return (
              <Option
                key={item.id.toString()}
                value={item.id}
              >
                {item.name}
              </Option>
            );
          })}
        </Select>
      </Modal>
    );
  }
}
