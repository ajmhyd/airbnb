import { createStore, action } from 'easy-peasy';

export default createStore({
  modals: {
    showLoginModal: false,
    showRegistrationModal: false,
    setShowLoginModal: action(state => {
      state.showLoginModal = true;
      state.showRegistrationModal = false;
    }),
    setShowRegistrationModal: action(state => {
      state.showLoginModal = false;
      state.showRegistrationModal = true;
    }),
    setHideModal: action(state => {
      state.showLoginModal = false;
      state.showRegistrationModal = false;
    }),
  },
});
