// IndexedDB related  (add this script file reference  to add-pizza.html)

// variable will store the db object when connected
let db;
// request variable as the event listener, will connect to the IndexedDB db 'pizza_hunt', to version 1
const request = indexedDB.open('pizza_hunt', 1);

// ------ event listeners

// event emits if db ver changes (nonexistant to version 1, v1 to v2, etc.)
request.onupgradeneeded = function (event) {
    // ref to the db
    const db = event.target.result;
    // creates object store (or table) named `new_pizza`, set to  auto-increment on primary key
    db.createObjectStore('new_pizza', { autoIncrement: true });
};

// if successful 
request.onsuccess = function (event) {
    // when db is created with its obj store (from onupgradedneeded event above)
    // or established a connection, save ref to database in global var
    db = event.target.result;

    // check if app is online, 
    //if yes, run uploadPizza() to send all local database data to the API
    if (navigator.onLine) {

        uploadPizza();
    }
};

request.onerror = function (event) {
    // log error here
    console.log(event.target.errorCode);
};

// ------ functions, when offline

// function executed when submitting new pizza with no persistent internet 
function saveRecord(record) {
    // open a new transaction within db with read and write perms 
    const transaction = db.transaction(['new_pizza'], 'readwrite');

    // accesses the object store for new_pizza
    const pizzaObjectStore = transaction.objectStore('new_pizza');

    // adds a record to the store with an add method
    pizzaObjectStore.add(record);
}

function uploadPizza() {
    // open a transaction on your db
    const transaction = db.transaction(['new_pizza'], 'readwrite');

    // access your object store
    const pizzaObjectStore = transaction.objectStore('new_pizza');

    // get all records from store and set to a variable
    const getAll = pizzaObjectStore.getAll();

    // upon a successful .getAll() execution, run this function
    getAll.onsuccess = function () {
        // if there was data in indexedDb's store, let's send it to the api server
        if (getAll.result.length > 0) {
            fetch('/api/pizzas', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(serverResponse => {
                    if (serverResponse.message) {
                        throw new Error(serverResponse);
                    }
                    // open one more transaction
                    const transaction = db.transaction(['new_pizza'], 'readwrite');
                    // access the new_pizza object store
                    const pizzaObjectStore = transaction.objectStore('new_pizza');
                    // clear all items in your store
                    pizzaObjectStore.clear();

                    alert('All saved pizza has been submitted!');
                })
                .catch(err => {
                    console.log(err);
                });
        }
    };

    // to do add here:
}

// event listener for when app coming back online
window.addEventListener('online', uploadPizza);