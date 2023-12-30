import React from 'react';
import { Slot, Slottable } from './Slot';

export default { title: 'Utilities/Slot' };

const SlotWithoutSlottable = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<'div'>
>((props, forwardedRef) => <Slot {...props} className="test" ref={forwardedRef} />);

const SlotWithSlottable = ({ children, ...props }: any) => (
  <Slot>
    <Slottable>{children}</Slottable>
    <span className="text-blue-400">world</span>
  </Slot>
);

const SlotWithFalseInternalChild = ({ children, ...props }: any) => (
  <Slot {...props}>{false && children}</Slot>
);

const SlotWithNullInternalChild = ({ children, ...props }: any) => (
  <Slot {...props}>{false ? children : null}</Slot>
);

class ErrorBoundary extends React.Component<any, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div className="bg-red-400 text-white p-10">Error</div>;
    }

    return this.props.children;
  }
}

const SlotWithPreventableEvent = (props: any) => (
  // works without doing {children} because we pass children in props, and consume.
  <Slot
    {...props}
    onClick={(event) => {
      props.onClick?.(event);
      if (!event.defaultPrevented) {
        console.log(event.target);
      }
    }}
  />
);

const SlotWithoutPreventableEvent = (props: any) => (
  <Slot
    {...props}
    onClick={(event) => {
      props.onClick?.(event);
      console.log(event.target);
    }}
  />
);

const Button = React.forwardRef<
  React.ElementRef<'button'>,
  React.ComponentProps<'button'> & {
    asChild?: boolean;
    iconLeft?: React.ReactNode;
    iconRight?: React.ReactNode;
  }
>(({ children, asChild = false, iconLeft, iconRight, ...props }, forwardedRef) => {
  const Component = asChild ? Slot : 'button';
  return (
    <Component
      {...props}
      ref={forwardedRef}
      style={props.style}
      className="inline-flex items-center gap-5 border-2 border-black p-2 bg-white text-sm rounded-sm"
    >
      {iconLeft}
      <Slottable>{children}</Slottable>
      {iconRight}
    </Component>
  );
});

const MockIcon = React.forwardRef<React.ElementRef<'span'>, React.ComponentProps<'span'>>(
  ({ color = 'tomato', ...props }, forwardedRef) => (
    <span
      {...props}
      ref={forwardedRef}
      className="inline-block w-10 h-10"
      style={{
        backgroundColor: color,
        ...props.style,
      }}
    />
  )
);

const MockTag = React.forwardRef(({ onDelete, children, ...props }: any, forwardedRef) => {
  return (
    <div {...props} ref={forwardedRef}>
      {children}{' '}
      {onDelete ? (
        <button className="border-2" onClick={onDelete}>
          delete
        </button>
      ) : null}
    </div>
  );
});

export const WithoutSlottable = () => (
  <SlotWithoutSlottable>
    <b data-slot-element>hello</b>
  </SlotWithoutSlottable>
);

export const WithSlottable = () => (
  <SlotWithSlottable>
    <b data-slot-element>hello</b>
  </SlotWithSlottable>
);

export const WithComposedEvents = () => (
  <>
    <h2>Should Log Both</h2>
    <SlotWithPreventableEvent>
      <button onClick={() => console.log('button click')}>Slot event not prevented</button>
    </SlotWithPreventableEvent>
    <h2>Should Log only "button click"</h2>
    <SlotWithPreventableEvent>
      <button
        onClick={(event) => {
          console.log('button click');
          event.preventDefault();
        }}
      >
        Slot event not prevented
      </button>
    </SlotWithPreventableEvent>
    <h2>Should Log Both</h2>
    <SlotWithoutPreventableEvent>
      <button onClick={() => console.log('button click')}>Slot event not prevented</button>
    </SlotWithoutPreventableEvent>
    <h1>Should Log Both</h1>
    <SlotWithoutPreventableEvent>
      <button
        onClick={(event) => {
          console.log('button click');
          event.preventDefault();
        }}
      >
        Slot event not prevented
      </button>
    </SlotWithoutPreventableEvent>
  </>
);

export const ButtonAsLink = () => (
  <>
    <h2>Button with left/right icons</h2>
    <Button iconLeft={<MockIcon />} iconRight={<MockIcon color={'royalBlue'} />} ref={console.log}>
      Button <em>text</em>
    </Button>

    <h2>Button with left/right icons as link (asChild)</h2>
    <Button
      asChild
      iconLeft={<MockIcon />}
      iconRight={<MockIcon color="royalBlue" />}
      ref={console.log}
    >
      <a href="https://consissamsy.com">
        Button <em>text</em>
      </a>
    </Button>
  </>
);

// moved as it is
export const Chromatic = () => (
  <>
    <h1>Without Slottable</h1>
    <h2>
      One consumer child - <span aria-hidden>✅</span>
    </h2>
    <ErrorBoundary>
      <SlotWithoutSlottable>
        <b data-slot-element>hello</b>
      </SlotWithoutSlottable>
    </ErrorBoundary>

    <h2>
      Multiple consumer child - <span aria-hidden>🔴</span>
    </h2>
    <ErrorBoundary>
      <SlotWithoutSlottable>
        <b data-slot-element>hello</b>
        <b data-slot-element>hello</b>
      </SlotWithoutSlottable>
    </ErrorBoundary>

    <h2>
      Null consumer child - <span aria-hidden>✅</span>
    </h2>
    <ErrorBoundary>
      <SlotWithoutSlottable>{null}</SlotWithoutSlottable>
    </ErrorBoundary>

    <h2>
      Empty consumer child - <span aria-hidden>✅</span>
    </h2>
    <ErrorBoundary>
      <SlotWithoutSlottable></SlotWithoutSlottable>
    </ErrorBoundary>

    <h2>
      False consumer child - <span aria-hidden>✅</span>
    </h2>
    <ErrorBoundary>
      <SlotWithoutSlottable>{false}</SlotWithoutSlottable>
    </ErrorBoundary>

    <h2>
      False internal child - <span aria-hidden>✅</span>
    </h2>
    <ErrorBoundary>
      <SlotWithFalseInternalChild>
        <b data-slot-element>hello</b>
      </SlotWithFalseInternalChild>
    </ErrorBoundary>

    <h2>
      Null internal child - <span aria-hidden>✅</span>
    </h2>
    <ErrorBoundary>
      <SlotWithNullInternalChild>
        <b data-slot-element>hello</b>
      </SlotWithNullInternalChild>
    </ErrorBoundary>

    <h2>
      String consumer child - <span aria-hidden>✅</span>
    </h2>
    <ErrorBoundary>
      <SlotWithoutSlottable>test</SlotWithoutSlottable>
    </ErrorBoundary>

    <h2>
      Number consumer child - <span aria-hidden>✅</span>
    </h2>
    <ErrorBoundary>
      <SlotWithoutSlottable>{1}</SlotWithoutSlottable>
    </ErrorBoundary>

    <h1>With Slottable</h1>

    <h2>
      One consumer child - <span aria-hidden>✅</span>
    </h2>
    <ErrorBoundary>
      <SlotWithSlottable>
        <b data-slot-element>hello</b>
      </SlotWithSlottable>
    </ErrorBoundary>

    <h2>
      Multiple consumer child - <span aria-hidden>🔴</span>
    </h2>
    <ErrorBoundary>
      <SlotWithSlottable>
        <b data-slot-element>hello</b>
        <b data-slot-element>hello</b>
      </SlotWithSlottable>
    </ErrorBoundary>

    <h2>
      Null consumer child - <span aria-hidden>✅</span>
    </h2>
    <ErrorBoundary>
      <SlotWithSlottable>{null}</SlotWithSlottable>
    </ErrorBoundary>

    <h2>
      String consumer child - <span aria-hidden>✅</span>
    </h2>
    <ErrorBoundary>
      <SlotWithSlottable>test</SlotWithSlottable>
    </ErrorBoundary>

    <h2>
      Number consumer child - <span aria-hidden>✅</span>
    </h2>
    <ErrorBoundary>
      <SlotWithSlottable>{1}</SlotWithSlottable>
    </ErrorBoundary>

    <h2>
      Empty consumer child - <span aria-hidden>✅</span>
    </h2>
    <ErrorBoundary>
      <SlotWithSlottable></SlotWithSlottable>
    </ErrorBoundary>

    <h2>
      False consumer child - <span aria-hidden>✅</span>
    </h2>
    <ErrorBoundary>
      <SlotWithSlottable>{false}</SlotWithSlottable>
    </ErrorBoundary>

    <h2>Button with left/right icons</h2>
    <Button iconLeft={<MockIcon color="tomato" />} iconRight={<MockIcon color="royalblue" />}>
      Button <em>text</em>
    </Button>

    <h2>Button with left/right icons as link (asChild)</h2>
    <Button
      asChild
      iconLeft={<MockIcon color="tomato" />}
      iconRight={<MockIcon color="royalblue" />}
    >
      <a href="https://radix-ui.com">
        Button <em>text</em>
      </a>
    </Button>

    <h1>With callback-dependent rendering</h1>
    <h2>Component not passing callback</h2>
    <p>Should NOT have delete button next to component</p>
    <Slot>
      <MockTag>Component</MockTag>
    </Slot>
    <h2>Component passing `undefined` callback</h2>
    <p>Should NOT have delete button next to component</p>
    <Slot>
      <MockTag onDelete={undefined}>Component</MockTag>
    </Slot>
    <h2>Component passing callback</h2>
    <p>Should have delete button next to component</p>
    <Slot>
      <MockTag onDelete={() => alert('Delete')}>Component</MockTag>
    </Slot>
  </>
);
Chromatic.parameters = { chromatic: { disable: false } };
