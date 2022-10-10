import type pusherJs from 'pusher-js';
import { createContext } from 'react';

export const PusherContext = createContext<pusherJs | null>(null);
