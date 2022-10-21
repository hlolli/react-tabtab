// @flow
import React from "react";
import styled from "styled-components";
import CloseButton from "./CloseButton.js";

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
  CustomTabStyle: () => void;
  handleTabChange: (event: any) => void;
  handleEdit: (event: any) => void;
  index: number;
  active: boolean;
  closable: boolean;
  vertical: boolean;
  children: React.Element<any>;
};

export const Tab = React.forwardRef((props: Props, ref) => {
  const { CustomTabStyle, active, closable, vertical, index } = props;
  const TabComponent = CustomTabStyle || TabStyle;
  const clickTab = React.useCallback(
    (event) => {
      const { handleTabChange, index } = props;
      handleTabChange(index);
    },
    [props.handleTabChange, props.index]
  );

  // const clickDelete = React.useCallback(
  //   (event) => {
  //     event.preventDefault();
  //     const { handleEdit, index } = props;
  //     handleEdit({ type: "delete", index });
  //     event.stopPropagation(); // prevent trigger clickTab event.
  //   },
  //   [props.handleEdit, props.index]
  // );

  return (
    <TabComponent
      className="tab"
      active={active}
      vertical={vertical}
      closable={closable}
      role="tab"
      id={`react-tabtab-tab-${index}`}
      aria-controls={`react-tabtab-panel-${index}`}
      aria-selected={active}
      onClick={clickTab}
    >
      <TabText ref={ref}>{props.children}</TabText>
      {props.closeElement && props.closeElement}
    </TabComponent>
  );
});

Tab.displayName = "Tab";

export { TabStyle };

export default Tab;
