// @flow
import React from "react";

type Props = {
  defaultIndex?: number;
  activeIndex?: number;
  showModalButton?: number | boolean;
  showArrowButton?: "auto" | boolean;
  ExtraButton?: React.Node;
  onTabChange?: (event: any) => void;
  onTabSequenceChange?: (event: any) => void;
  onTabEdit?: (event: any) => void;
  customStyle?: {
    TabList?: () => void;
    Tab?: () => void;
    Panel?: () => void;
    ActionButton?: () => void;
  };
  children: React.Element<*>;
};

type State = {
  activeIndex: number;
};

export default function Tabs(props: Props) {
  const getActiveIndex = React.useCallback(() => {
    const { defaultIndex, activeIndex } = props;
    if (activeIndex) return activeIndex;
    if (defaultIndex) return defaultIndex;
    return 0;
  }, [props]);

  const [activeIndex, setActiveIndex] = React.useState(getActiveIndex());

  const handleTabChange = React.useCallback(
    (index: number) => {
      if (props.activeIndex !== 0 && !props.activeIndex) {
        setActiveIndex(index);
      }
      if (props.onTabChange) {
        props.onTabChange(index);
      }
    },
    [props.activeIndex, props.onTabChange, setActiveIndex]
  );

  const handleTabSequence = React.useCallback(
    ({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }) => {
      const { onTabSequenceChange } = props;
      if (onTabSequenceChange) {
        onTabSequenceChange({ oldIndex, newIndex });
      }
    },
    [props.onTabSequenceChange]
  );

  const handleEdit = React.useCallback(
    ({ type, index }: { type: string; index: number }) => {
      const { onTabEdit } = props;
      if (onTabEdit) {
        onTabEdit({ type, index });
      }
    },
    [props.onTabEdit]
  );

  React.useEffect(() => {
    if (props.activeIndex !== activeIndex) {
      setActiveIndex(props.activeIndex);
    }
  }, [props.activeIndex, activeIndex]);

  const { children, ...extraProps } = props;

  const nextProps = {
    handleTabChange,
    handleTabSequence,
    handleEdit,
    activeIndex,
    ...extraProps,
  };

  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, nextProps);
      })}
    </div>
  );
}
