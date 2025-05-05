export const saveLocalStorage = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
  };
