// @flow
import React from "react";
import { SortableElement } from "react-sortable-hoc";
import Tab from "./Tab.js";

const DragTabElement = SortableElement(
  React.forwardRef(({ children, ...props }, ref) => {
    return (
      <Tab index={props.tabIndex} {...props} ref={ref}>
        {children}
      </Tab>
    );
  }),
  { withRef: true }
);

function DragTab({ children, closeElement, ...props }) {
  const dragTabRef = React.useRef();
  return (
    <DragTabElement ref={dragTabRef} closeElement={closeElement} {...props}>
      {children}
    </DragTabElement>
  );
}

DragTab.displayName = "DragTab";

export default DragTab;
