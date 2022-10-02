import { PresenceMember, PresenceSubscriptionData } from '../types/pusher';
import { createStore } from './createStore';
interface OnlineUsersState {
  count: number;
  myID?: string;
  members: Set<string>;
}

let onlineUsersState: OnlineUsersState = {
  count: 0,
  myID: undefined,
  members: new Set(),
};

export const onlineUsersStore = createStore(onlineUsersState);

export const addMember = (member: PresenceMember): void => {
  onlineUsersStore.setState((prevState) => ({
    ...prevState,
    count: prevState.count++,
    members: prevState.members.add(member.id),
  }));
};

export const resetFromSubscription = (subscription: PresenceSubscriptionData): void => {
  onlineUsersStore.setState({
    count: subscription.count,
    myID: subscription.myID,
    members: new Set(Object.keys(subscription.members)),
  });
};

export const removeMember = (member: PresenceMember): void => {
  onlineUsersStore.setState((prevState) => {
    prevState.members.delete(member.id);
    return {
      ...prevState,
      count: prevState.count--,
    };
  });
};
