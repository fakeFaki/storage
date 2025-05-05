export const saveIndexedDB = (user) => {
  const request = indexedDB.open("authDB", 1);
  request.onupgradeneeded = () => {
    const db = request.result;
    db.createObjectStore("user", { keyPath: "id" });
  };
  request.onsuccess = () => {
    const db = request.result;
    const tx = db.transaction("user", "readwrite");
    tx.objectStore("user").put(user);
  };
};
