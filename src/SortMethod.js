// @flow
import React from "react";

export const useSort = ({
  activeIndex,
  handleTabChange,
  handleTabSequence,
}) => {
  const onSortEnd = React.useCallback(
    ({ oldIndex, newIndex }) => {
      if (oldIndex === newIndex) {
        if (activeIndex !== oldIndex) {
          handleTabChange(oldIndex);
        }
      } else {
        handleTabSequence({ oldIndex, newIndex });
      }
    },
    [activeIndex, handleTabChange, handleTabSequence]
  );

  return { onSortEnd };
};

// export default class SortMethod extends React.PureComponent<Props> {
//   constructor(props: Props) {
//     super(props);
//     this.onSortEnd = this.onSortEnd.bind(this);
//   }

//   onSortEnd({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }) {
//     const { activeIndex, handleTabChange, handleTabSequence } = this.props;
//     if (oldIndex === newIndex) {
//       if (activeIndex !== oldIndex) {
//         handleTabChange(oldIndex);
//       }
//     } else {
//       handleTabSequence({ oldIndex, newIndex });
//     }
//   }
// }
