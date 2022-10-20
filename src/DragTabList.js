// @flow
import React from "react";
import { useSort } from "./SortMethod.js";
import { SortableContainer } from "react-sortable-hoc";
import TabList from "./TabList.js";

const DragTabContainer = SortableContainer(({ children, ...props }) => {
  return <TabList {...props}>{children}</TabList>;
});

export default function DragTabList(props_) {
  const { children, ...props } = props_;

  const { onSortEnd } = useSort({
    activeIndex: props.activeIndex,
    handleTabChange: props.handleTabChange,
    handleTabSequence: props.handleTabSequence,
  });

  return (
    <DragTabContainer
      onSortEnd={onSortEnd}
      axis="x"
      lockAxis="x"
      pressDelay={10}
      {...props}
    >
      {children}
    </DragTabContainer>
  );
}

DragTabList.displayName = "DragTabList";
