// @flow
import * as React from "react";
import styled from "styled-components";
import invariant from "invariant";
import { LeftIcon, RightIcon, BulletIcon } from "./IconSvg";
import { isNumber } from "./utils/isType";
import TabModal from "./TabModal";

const buttonWidth = 35;

const getPadding = ({ showModalButton, showArrowButton }) => {
  let paddingLeft = 0;
  let paddingRight = 0;
  if (showModalButton) {
    paddingLeft += buttonWidth;
  }
  if (showArrowButton) {
    paddingLeft += buttonWidth;
    paddingRight += buttonWidth;
    if (showModalButton) {
      paddingLeft += 2;
    }
  }
  if (paddingLeft > 0) {
    paddingLeft += 3;
  }
  if (paddingRight > 0) {
    paddingRight += 3;
  }
  return `0 ${paddingRight}px 0 ${paddingLeft}px`;
};

const unifyScrollMax = (width: number) => {
  return parseFloat((width / 3) * 2);
};

const TabListStyle = styled.div`
  background-color: white;
  text-align: left;
  position: relative;
  white-space: nowrap;
  overflow: hidden;
  width: auto;
  padding: ${(props) => getPadding(props)};
`;

const ListInner = styled.div`
  overflow: hidden;
`;

const ListScroll = styled.ul`
  padding-left: 0;
  position: relative;
  margin: 0;
  list-style: none;
  display: inline-block;
  transition: transform 0.3s cubic-bezier(0.42, 0, 0.58, 1);
`;

const ActionButtonStyle = styled.div`
  height: 100%;
  width ${buttonWidth}px;
  text-align: center;
  border: 1px solid #d9d9d9;
  border-bottom: 0;
  border-radius: 4px 4px 0 0;
  background: #f9f9f9;
  > svg {
    padding-top: 11px;
  }
`;

const makeScrollButton = (ActionButton) => styled(ActionButton)`
  display: inline-block;
  filter: none;
  position: absolute;
  ${(props) =>
    props.left
      ? props.showModalButton
        ? `left: ${buttonWidth + 2}px`
        : `left: 0`
      : "right: 0"};
  &:hover {
    cursor: pointer;
  }
  ${(props) => (props.customStyle ? props.customStyle(props) : "")}
`;

const makeFoldButton = (ActionButton) => styled(ActionButton)`
  display: inline-block;
  filter: none;
  position: absolute;
  left: 0;
  &:hover {
    cursor: pointer;
  }
  ${(props) => (props.customStyle ? props.customStyle(props) : "")}
`;

type Props = {
  customStyle: {
    TabList: () => void,
    Tab: () => void,
    ActionButton: () => void,
  },
  activeIndex: number,
  showArrowButton: "auto" | boolean,
  showModalButton: number | boolean,
  handleTabChange: (event: any) => void,
  handleTabSequence: (event: any) => void,
  handleEdit: (event: any) => void,
  ExtraButton: React.Element<*>,
  children: React.ChildrenArray<*>,
};

type State = {
  modalIsOpen: boolean,
  showArrowButton: boolean,
  showModalButton: boolean | number,
};

const ActionButton = ActionButtonStyle;
const ScrollButton = makeScrollButton(ActionButton);
const FoldButton = makeFoldButton(ActionButton);

export default function TabListComponent(props: Props) {
  const listContainer = React.useRef();
  const rightArrowNode = React.useRef();
  const leftArrowNode = React.useRef();
  const listScroll = React.useRef();
  const foldNode = React.useRef();
  const [tabRefs, setTabRefs] = React.useState([]);
  const [scrollPosition, setScrollPosition] = React.useState(0);
  const [isMounted, setIsMounted] = React.useState(false);
  const [modalIsOpen, setModalIsOpen] = React.useState(false);
  const [showArrowButton, setShowArrowButton] = React.useState(false);
  const [showModalButton, setShowModalButton] = React.useState(false);

  const {
    customStyle,
    activeIndex,
    handleEdit,
    handleTabChange,
    handleTabSequence,
    ExtraButton,
    showArrowButton: propsShowArrowButton,
    showModalButton: propsShowModalButton,
  } = props;

  const numChildren = props.children.length;

  const isShowModalButton = React.useCallback(() => {
    setShowModalButton(
      isNumber(propsShowModalButton)
        ? numChildren >= propsShowModalButton
        : propsShowModalButton
    );
  }, [numChildren, propsShowModalButton]);

  React.useEffect(() => {
    isShowModalButton();
  }, [propsShowModalButton]);

  const isShowArrowButton = React.useCallback(() => {
    let newShowArrowButton = propsShowArrowButton;
    if (propsShowArrowButton === "auto") {
      let tabWidth = 0;
      const containerWidth = listContainer.current.offsetWidth;
      newShowArrowButton = false;
      for (let index = 0; index < tabRefs.length; index++) {
        const tab = tabRefs[index];
        if (tab && tab.current) {
          tabWidth += tab.current.offsetWidth;
          if (tabWidth >= containerWidth) {
            newShowArrowButton = true;
            break;
          }
        }
      }
    }
    // $FlowFixMe: flow will show 'auto' is not bool, but with this logic, showArrowButton will never be 'auto'
    setShowArrowButton(newShowArrowButton);
  }, [propsShowArrowButton, setShowArrowButton, listContainer, tabRefs]);

  React.useEffect(() => {
    isShowArrowButton();
  }, [propsShowArrowButton]);

  React.useEffect(() => {
    // add or remove refs
    setTabRefs((elRefs) =>
      Array(numChildren)
        .fill()
        .map((_, i) => elRefs[i] || React.createRef())
    );
  }, [numChildren]);

  const scrollToIndex = React.useCallback(
    (index: number, rectSide: "left" | "right") => {
      if (tabRefs.length - 1 < index) {
        // this may be annoying on initializaiton
        return;
      }
      const tabOffset = tabRefs[index].getBoundingClientRect();
      const containerOffset = listContainer.getBoundingClientRect();
      // Cancel scrolling if the tab is visible
      if (
        tabOffset.right < containerOffset.right &&
        tabOffset.left > containerOffset.left
      ) {
        return;
      }

      const leftMove = tabOffset[rectSide] - containerOffset[rectSide];
      let nextScrollPosition = scrollPosition + leftMove;
      if (nextScrollPosition < 0) {
        nextScrollPosition = 0;
      }
      if (listScroll.current) {
        listScroll.current.style.transform = `translate3d(-${scrollPosition}px, 0, 0)`;
      }

      setScrollPosition(nextScrollPosition);
    },
    [listContainer, scrollPosition, setScrollPosition]
  );

  const toggleModal = React.useCallback(
    (open: boolean) => {
      if (!open) {
        scrollToIndex(activeIndex, "right");
      }
      setModalIsOpen(open);
    },
    [scrollToIndex, setModalIsOpen, activeIndex]
  );

  const handleScroll = React.useCallback(
    (direction: "right" | "left") => {
      let leftMove = 0;
      if (!listContainer.current || tabRefs.length < 1 || !listScroll.current) {
        return;
      }
      const containerOffset = listContainer.current.getBoundingClientRect();
      const containerWidth = listContainer.current.offsetWidth;
      const tabFirstOffset = tabRefs[0].getBoundingClientRect();
      const tabLastOffset = tabRefs[tabRefs.length - 1].getBoundingClientRect();

      if (direction === "right") {
        leftMove = tabLastOffset.right - containerOffset.right;
        if (leftMove > containerWidth) {
          leftMove = unifyScrollMax(containerWidth);
        }
      } else if (direction === "left") {
        leftMove = tabFirstOffset.left - containerOffset.left;
        if (-leftMove > containerWidth) {
          leftMove = -unifyScrollMax(containerWidth);
        }
      }
      let newScrollPosition = scrollPosition + leftMove;
      // this.scrollPosition += leftMove;
      if (newScrollPosition < 0) {
        newScrollPosition = 0;
      }

      listScroll.current.style.transform = `translate3d(-${newScrollPosition}px, 0, 0)`;
      setScrollPosition(newScrollPosition);
    },
    [listScroll, scrollPosition, setScrollPosition, listContainer, tabRefs]
  );

  React.useEffect(() => {
    if (!isMounted) {
      if (activeIndex > 0) {
        scrollToIndex(activeIndex, "left");
      }
      setIsMounted(true);
      isShowArrowButton();
      isShowModalButton();
    }
  }, [activeIndex, isMounted, setIsMounted]);

  invariant(
    props.children,
    "React-tabtab Error: You MUST pass at least one tab"
  );

  return (
    <div>
      {ExtraButton ? ExtraButton : null}
      <TabListStyle
        hasExtraButton={!!ExtraButton}
        showModalButton={showModalButton}
        showArrowButton={showArrowButton}
      >
        {showModalButton ? (
          <FoldButton
            ref={foldNode}
            customStyle={customStyle.ActionButton || false}
            onClick={() => toggleModal(true)}
            showArrowButton={showArrowButton}
          >
            <BulletIcon />
          </FoldButton>
        ) : null}
        {showArrowButton && (
          <div>
            <ScrollButton
              left
              onClick={() => {
                handleScroll("left");
              }}
              ref={leftArrowNode}
              showModalButton={showModalButton}
              customStyle={customStyle.ActionButton || false}
            >
              <LeftIcon />
            </ScrollButton>
            <ScrollButton
              onClick={() => {
                handleScroll("right");
              }}
              ref={rightArrowNode}
              customStyle={customStyle.ActionButton || false}
            >
              <RightIcon />
            </ScrollButton>
          </div>
        )}
        <ListInner ref={listContainer}>
          <ListScroll ref={listScroll} role="tablist">
            {React.Children.map(props.children, (child, index) =>
              React.cloneElement(child, {
                key: index,
                active: index === activeIndex,
                index,
                tabIndex: index,
                ref: tabRefs[index],
                CustomTabStyle: customStyle.Tab,
                handleTabChange,
                handleEdit,
              })
            )}
          </ListScroll>
        </ListInner>
      </TabListStyle>
      {modalIsOpen ? (
        <TabModal
          closeModal={() => toggleModal(false)}
          handleTabSequence={handleTabSequence}
          handleTabChange={handleTabChange}
          activeIndex={activeIndex}
        >
          {React.Children.map(props.children, (child, index) =>
            React.cloneElement(child, {
              key: index,
              active: index === activeIndex,
              index,
              tabIndex: index,
              ref: tabRefs[index],
              vertical: true,
              CustomTabStyle: customStyle.Tab,
              handleTabChange,
              handleEdit,
            })
          )}
        </TabModal>
      ) : null}
    </div>
  );
}

TabListComponent.displayName = "TabList";

export { TabListStyle, ActionButtonStyle };
