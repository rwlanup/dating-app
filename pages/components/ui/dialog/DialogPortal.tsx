import { FC, PropsWithChildren, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export const DialogPortal: FC<PropsWithChildren> = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // This is required cause in SSR, we won't have document or context to window
  if (mounted) {
    const dialogRoot = document.getElementById('dialog-root');
    return dialogRoot ? createPortal(children, dialogRoot) : null;
  }

  // Default ssr rendered content
  return <div className="hidden">{children}</div>;
};
