import { create } from 'zustand'
import { useStore } from './userStore';

export const chatStore = create((set) => ({
    chatId: null,
    user: null,
    isCurrentUserBlocked: false,
    isReceiverBlocked: false,
    changeChat: (chatId, user) => {
        console.log("good mornig");
        const currentUser = useStore.getState().currentUser;
        //checking if curr user is blocked
        if (user.blocked.includes(currentUser.id)) {
            return set({
                chatId,
                user: null,
                isCurrentUserBlocked: true,
                isReceiverBlocked: false,
            });
        }

        //checking if receiver is blocked
      else if (currentUser.blocked.includes(user.id)) {
            return set({
                chatId,
                user,//current user can see receiver 
                isCurrentUserBlocked: false,
                isReceiverBlocked: true,
            });
        }
        else{
            return set({
                chatId,
                user,//current user can see receiver 
                isCurrentUserBlocked: false,
                isReceiverBlocked: false,
            });
        }
       
      
    },
    changeBlock: () => {
        set(state => ({ ...state, isReceiverBlocked: !state.isReceiverBlocked }));
    }


}))