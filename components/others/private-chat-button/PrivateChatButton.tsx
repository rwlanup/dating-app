import { IconButton, Tooltip, Typography } from '@mui/material';
import type { FC } from 'react';
import VisibilityOffTwoToneIcon from '@mui/icons-material/VisibilityOffTwoTone';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

interface PrivateChatButtonProps {
  friendId: string;
}
export const PrivateChatButton: FC<PrivateChatButtonProps> = ({ friendId }) => {
  const { data: session } = useSession();

  return (
    <Tooltip
      title={
        <Typography
          color="inherit"
          fontSize="inherit"
          fontWeight="inherit"
        >
          Private mode
          <br />
          Your messages won&apos;t be recorded
        </Typography>
      }
    >
      <Link
        passHref
        href={{ query: { senderId: session?.user.id }, pathname: `/profile/private/${friendId}` }}
      >
        <IconButton
          size="large"
          disabled={!session}
        >
          <VisibilityOffTwoToneIcon />
        </IconButton>
      </Link>
    </Tooltip>
  );
};
