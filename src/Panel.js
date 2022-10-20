// @flow
import React from "react";
import styled from "styled-components";

const PanelStyle = styled.div`
  text-align: left;
  padding: 20px 15px;
  ${(props) => (!props.active ? `display: none;` : null)}
  height: 100%;
  width: 100%;
`;

type Props = {
  children: React.Node;
  CustomPanelStyle: () => void;
  active: boolean;
  index: number;
};

export default class PanelComponent extends React.PureComponent<Props> {
  render() {
    const { active, index } = this.props;
    const Panel = this.props.CustomPanelStyle || PanelStyle;
    return (
      <Panel
        role="tabpanel"
        id={`react-tabtab-panel-${index}`}
        aria-labelledby={`react-tabtab-${index}`}
        aria-hidden={false}
        active={active}
      >
        {active ? this.props.children : null}
      </Panel>
    );
  }
}

export { PanelStyle };
