import React, {
  Children,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  cloneElement,
  forwardRef,
  isValidElement,
} from 'react';
import { composeRefs } from '@consissamsy/ui-react-compose-refs';

import { mergeProps } from './slot.helpers';

interface SlotProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

interface SlotCloneProps {
  children: ReactNode;
}

const Slottable = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

// `is` is user guard => https://stackoverflow.com/a/45748366
const isSlottable = (child: ReactNode): child is ReactElement => {
  return isValidElement(child) && child.type === Slottable;
};

const SlotClone = forwardRef<any, SlotCloneProps>((props, forwardedRef) => {
  const { children, ...slotProps } = props;

  if (isValidElement(children)) {
    const childRef = (children as any).ref;
    return cloneElement(children, {
      ...mergeProps(slotProps, children.props),
      // @ts-ignore
      ref: forwardedRef ? composeRefs(forwardedRef, childRef) : childRef, // need to check why ref does not exist
    });
  }

  // Children.only asserts that children represents only one child elemeent.
  return Children.count(children) > 1 ? Children.only(null) : null;
});

SlotClone.displayName = 'SlotClone';

const Slot = forwardRef<HTMLElement, SlotProps>((props, forwardedRef) => {
  const { children, ...slotProps } = props;
  const childrenArray = Children.toArray(children);
  const slottable = childrenArray.find(isSlottable);

  if (slottable) {
    const newElement = slottable.props.children as ReactNode;
    const isValid = isValidElement(newElement);

    const newChildren = childrenArray.map((child) => {
      if (child === slottable) {
        if (Children.count(newElement) > 1) return Children.only(null);
        return isValid ? (newElement.props.children as ReactNode) : null;
      } else {
        return child;
      }
    });

    return (
      <SlotClone {...slotProps} ref={forwardedRef}>
        {isValid ? cloneElement(newElement, undefined, newChildren) : null}
      </SlotClone>
    );
  }

  return (
    <SlotClone {...slotProps} ref={forwardedRef}>
      {children}
    </SlotClone>
  );
});

Slot.displayName = 'Slot';

export { Slot, Slottable, Slot as Root };
export type { SlotProps };
