export const saveCookie = (user) => {
  document.cookie = `user=${JSON.stringify(user)}; path=/`;
};
