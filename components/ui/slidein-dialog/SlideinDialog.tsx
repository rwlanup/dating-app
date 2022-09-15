import { Dialog, DialogProps, Slide } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { FC, forwardRef, PropsWithChildren, ReactElement, Ref } from 'react';

const SlideinTransition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement<any, any>;
  },
  ref: Ref<unknown>
) {
  return (
    <Slide
      direction="up"
      ref={ref}
      {...props}
    />
  );
});

export const SlideinDialog: FC<PropsWithChildren<DialogProps>> = (dialogProps) => {
  return (
    <Dialog
      {...dialogProps}
      TransitionComponent={SlideinTransition}
    />
  );
};
