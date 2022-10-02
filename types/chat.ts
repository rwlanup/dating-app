import { Chats } from '@prisma/client';
import { PaginatedResult } from './server';

export type PaginatedChat = PaginatedResult<Chats>;
