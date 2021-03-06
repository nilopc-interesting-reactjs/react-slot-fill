import React from 'react';
import { Slot, Fill } from '../../lib'
import './Workspace.css';

import SplitPane from 'react-split-pane';

const style = {
  container: {
    background: '#FFFFFF',
    opacity: 0.85,
    display: 'flex',
    flexGrow: 1
  },

  AppBar: {
    width: '61px',
    background: '#F9F9F9',
    borderRight: 'solid 1px #C2C2C2'
  },

  Panel: {
    background: '#FFFFFF',
    padding: '28px',
    overflow: 'hidden',
    height: '100%'
  },

  SplitPaneContainer: {
    position: 'relative',
    flexGrow: 1
  }
}

class Workspace extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showPanel: false, size: 500 };
    this.handleOnMount = this.handleOnMount.bind(this);
    this.handleOnUnmount = this.handleOnUnmount.bind(this);
    this.handleSplitChange = this.handleSplitChange.bind(this);
  }

  handleOnMount() {
    this.setState({ showPanel: true });
  }

  handleOnUnmount() {
    this.setState({ showPanel: false });
  }

  handleSplitChange(size) {
    this.setState({ size });
  }

  render() {
    const canvas = <Slot name="Workspace.Canvas" />;

    let content;

    if (this.state.showPanel) {
      content = (
        <div style={style.SplitPaneContainer}>
          <SplitPane split="vertical" minSize={300} defaultSize={425}>
            <div style={style.Panel}>
              <Slot name="Workspace.Panel"
                fillChildProps={{ onMount: this.handleOnMount, onUnmount: this.handleOnUnmount }}>
                {items => items[items.length - 1]}
              </Slot>
            </div>
            {canvas}
          </SplitPane>
        </div>
      )
    } else {
      content = (
        <div style={{ width: '100%' }}>
          <Slot name="Workspace.Panel" style={style.Panel}
            fillChildProps={{ onMount: this.handleOnMount, onUnmount: this.handleOnUnmount }}>
            {items => items[items.length - 1]}
          </Slot>
          {canvas}
        </div>
      );
    }

    return (
      <div style={style.container}>
        <div style={style.AppBar}>
          <Slot name="Workspace.AppBar" />
        </div>
        {content}
      </div>
    );
  }
}

Workspace.AppBar = (props) =>
  <Fill name="Workspace.AppBar">
    <div style={props.style}>{props.children}</div>
  </Fill>

class Panel extends React.Component {
  componentDidMount() {
    this.props.onMount();
  }

  componentWillUnmount() {
    this.props.onUnmount();
  }

  render() {
    const title = this.props.title
      ? <h3>{this.props.title}</h3>
      : null;

    return [
      title,
      this.props.children
    ];
  }
}

Workspace.Panel = (props) => {
  return (
    <Fill name="Workspace.Panel">
      <Panel {...props} />
    </Fill>
  );
}

Workspace.Canvas = (props) => {
  return (
    <Fill name="Workspace.Canvas">
      <div style={{ width: '100%', height: '100%'}}>{props.children}</div>
    </Fill>
  )
}

export default Workspace;

