import Link, { LinkProps } from 'next/link';
import type { AnchorHTMLAttributes, FC, PropsWithChildren } from 'react';
import { mergeClasses } from '../../../../util/string';
import styles from './TextLink.module.css';

interface TextLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  underline?: 'hover' | 'always';
  LinkProps?: Omit<LinkProps, 'href'>;
  href: LinkProps['href'];
}

export const TextLink: FC<PropsWithChildren<TextLinkProps>> = ({
  underline = 'hover',
  children,
  LinkProps,
  href,
  ...otherProps
}) => {
  return (
    <Link
      {...LinkProps}
      href={href}
    >
      <a
        {...otherProps}
        className={mergeClasses(otherProps.className, styles.link, styles[`underline-${underline}`])}
      >
        {children}
      </a>
    </Link>
  );
};
