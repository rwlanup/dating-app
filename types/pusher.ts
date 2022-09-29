export interface PresenceMember {
  id: string;
}

export interface PresenceSubscriptionData {
  count: number;
  myID: string;
  members: { [key: string]: undefined };
}
