export const saveSession = (user) => {
    sessionStorage.setItem('user', JSON.stringify(user));
  };
  