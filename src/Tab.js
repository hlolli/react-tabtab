// @flow
import * as React from "react";
import styled from "styled-components";
import CloseButton from "./CloseButton";

const TabStyle = styled.li`
  display: ${(props) => (props.vertical ? "block" : "inline-block")};
  ${(props) =>
    props.vertical
      ? `
      background-color: white;
      color: black;
      padding: 10px 10px;
      z-index: 100000;
    `
      : (props) =>
          props.closable
            ? "padding: 10px 10px 10px 15px;"
            : "padding: 10px 15px;"}

  user-select: none;
  &:hover {
    cursor: pointer;
    color: black;
  }
`;

const TabText = styled.span`
  vertical-align: middle;
`;

type Props = {
  CustomTabStyle: () => void,
  handleTabChange: (event: any) => void,
  handleEdit: (event: any) => void,
  index: number,
  active: boolean,
  closable: boolean,
  vertical: boolean,
  children: React.Element<any>,
};

export default function Tab(props: Props) {
  const { CustomTabStyle, active, closable, vertical, index } = props;
  const TabComponent = CustomTabStyle || TabStyle;
  const clickTab = React.useCallback(() => {
    const { handleTabChange, index } = props;
    handleTabChange(index);
  }, [props.handleTabChange, props.index]);
  const clickDelete = React.useCallback(
    (event) => {
      event.stopPropagation(); // prevent trigger clickTab event.
      const { handleEdit, index } = props;
      handleEdit({ type: "delete", index });
    },
    [props.handleEdit, props.index]
  );
  return (
    <TabComponent
      onClick={clickTab}
      active={active}
      vertical={vertical}
      closable={closable}
      role="tab"
      id={`react-tabtab-tab-${index}`}
      aria-controls={`react-tabtab-panel-${index}`}
      aria-selected={active}
    >
      <TabText>{props.children}</TabText>
      {closable ? <CloseButton handleDelete={clickDelete} /> : null}
    </TabComponent>
  );
}

Tab.displayName = "Tab";

export { TabStyle };
