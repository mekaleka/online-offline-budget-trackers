let db;

const request = indexedDB.open("budget", 1);

request.onupgradeneeded = function(event) {
    // create object store called "pending" and set autoIncrement to true
   const db = event.target.result;
   db.createObjectStore("pending", { autoIncrement: true });
 };

 request.onerror = function(event) {
    console.log("Woops! " + event.target.errorCode);
  };

  function saveRecord(record) {
    // create a transaction on the pending db with readwrite access
    const transaction = db.transaction(["pending"], "readwrite");
  
    // access your pending object store
    const store = transaction.objectStore("pending");
  
    // add record to your store with add method.
    store.add(record);
  }


window.addEventListener("online", checkDatabase);