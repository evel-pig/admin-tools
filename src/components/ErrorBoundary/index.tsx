import * as React from 'react';
import Error from '../Error';

export interface ErrorBoundaryProps {
}

export interface MyState {
  hasError: boolean;
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, Partial<MyState>> {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  componentDidCatch(error, info) {
    console.error(error, info);
    if (!this.state.hasError) {
      this.setState({
        hasError: true,
      });
    }
  }

  render() {
    const production = process.env.NODE_ENV === 'production';
    if (this.state.hasError && production) {
      return <Error />;
    }

    return this.props.children;
  }
}
