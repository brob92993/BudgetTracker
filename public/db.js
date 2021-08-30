let db;

const request = indexedDB.open("budget", 1);

request.onupgradeneeded = function (event) {
const db = event.target.result;
db.createObjectStore("pending", {autoIncrement: true});
};

request.onsuccess = function (event) {
    db = event.target.result;
    if(navigator.online) {
        checkDatabase();
    }
};

request.onerror = function (event) {
    console.log("Error! " + event.target.errorCode);
};

function saveRecord(record) {
    // create a transaction on the pending db with readwrite access
    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.objectStore("pending");

    // add record to your store
    store.add(record);
}

function checkDatabase() {
    // open a transaction on your pending db
    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.objectStore("pending");
    // get all records from store
    const getAll = store.getAll();

    getAll.onsuccess = function () {
        if (getAll.result.length > 0) {
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                }
            })
            .then(response => response.json())
            .then(() => {
    // if successful, open a transaction on your pending db
                const transaction = db.transaction(["pending"], "readwrite");
                const store = transaction.objectStore("pending");
    // clear all items
                store.clear();
                });
        }
    };
}

// listen for app coming back online
window.addEventListener("online", checkDatabase);