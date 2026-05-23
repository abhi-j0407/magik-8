import { Component, type ErrorInfo, type ReactNode } from 'react';
import { MagikBall } from './MagikBall';

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
};

export class OracleErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    if (import.meta.env.DEV) {
      console.error('[OracleErrorBoundary]', error, info.componentStack);
    }
  }

  render() {
    if (this.state.hasError) {
      return <MagikBall renderingLocked />;
    }
    return this.props.children;
  }
}
