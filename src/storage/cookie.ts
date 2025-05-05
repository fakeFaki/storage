export const saveCookie = (user) => {
  const expiryDate = new Date();
  expiryDate.setSeconds(expiryDate.getSeconds() + 18000); // زمان انقضا 3 دقیقه

  // ذخیره توکن و user به صورت JSON در کوکی‌ها
  const userWithToken = JSON.stringify(user);
  document.cookie = `user=${userWithToken}; expires=${expiryDate.toUTCString()}; path=/; samesite=strict`;
};
