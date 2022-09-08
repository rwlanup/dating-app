import Link, { LinkProps } from 'next/link';
import React, { ElementType, PropsWithChildren, Ref, useMemo } from 'react';
import { mergeClasses } from '../../../../string';
import styles from './Button.module.css';

type ButtonProps<Tag extends keyof JSX.IntrinsicElements> = {
  hierarchy?: 'primary' | 'secondary' | 'tertiary';
  variant?: 'fill' | 'outlined';
  size?: 'sm' | 'md';
  tag?: Tag;
  href?: LinkProps['href'];
  LinkProps?: Omit<LinkProps, 'href'>;
  btnRef?: Ref<JSX.IntrinsicElements[Tag]>;
  withoutNextLink?: boolean;
  isActive?: boolean;
} & Omit<JSX.IntrinsicElements[Tag], 'href' | 'ref'>;

export const Button = <Tag extends keyof JSX.IntrinsicElements = 'button'>({
  hierarchy = 'primary',
  variant = 'fill',
  size = 'md',
  tag,
  children,
  href,
  LinkProps,
  btnRef,
  withoutNextLink,
  className,
  isActive,
  ...btnProps
}: PropsWithChildren<ButtonProps<Tag>>) => {
  // Tag name for component
  const Component = (tag ? tag : href ? 'a' : 'button') as ElementType;

  const classes = useMemo(() => {
    return mergeClasses(
      styles.btn,
      className,
      isActive && styles.active,
      styles[size],
      styles[variant],
      styles[hierarchy]
    );
  }, [className, isActive, size, variant, hierarchy]);

  const renderComponent = (): React.ReactElement => {
    return (
      <Component
        {...btnProps}
        href={withoutNextLink && href}
        ref={btnRef}
        className={classes}
      >
        {children}
      </Component>
    );
  };

  // Render next link component in case href attribute is provided
  if (href && !withoutNextLink) {
    return (
      <Link
        passHref
        {...LinkProps}
        href={href}
      >
        {renderComponent()}
      </Link>
    );
  }

  return renderComponent();
};
