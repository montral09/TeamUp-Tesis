import React from 'react';
import { Redirect } from 'react-router-dom';

class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }
  
    componentDidCatch(error, info) {
      // Display fallback UI
      this.setState({ hasError: true });
    }
  
    render() {
      if (this.state.hasError) return <Redirect to='/error' />

      return this.props.children;
    }
  }

  export default ErrorBoundary;