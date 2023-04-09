import { defineStore } from "pinia";

export const useStore = defineStore("store", {
  state: () => ({
    isLoggedIn: false,
    currentToken: "",
    currentUserData: {},
    showMessage: false,
    message: "",
    messageSuccess: null
  }),

  actions: {
    signIn(token, userdata) {
      this.isLoggedIn = true
      this.currentToken = token;
      this.currentUserData = userdata;
    },

    signOut() {
      this.isLoggedIn = false
      this.currentToken = ""
      this.currentUserData = {}
      localStorage.removeItem('currentToken')
      localStorage.removeItem('currentUserData')
    },

    updateUser(newUserData) {
      this.currentUserData.name = newUserData.name
      this.currentUserData.lastname = newUserData.lastname
      this.currentUserData.username = newUserData.username
    },

    /* Message, info for UI/UX */
    displayMessage(message, success) {
      this.message = message;
      this.messageSuccess = success
      this.showMessage = true;
      setTimeout(() => {
        this.showMessage = false;
        this.message = ""
        this.messageSuccess = null
      }, 2000);
    },

    checkLocalStorage(){
      if(localStorage.currentToken && localStorage.currentUserData){
        this.isLoggedIn = true
        //token
        this.currentToken = localStorage.currentToken
        //userData
        const userData = JSON.parse(localStorage.currentUserData)
        this.currentUserData = userData
      }
    }
  }
});
