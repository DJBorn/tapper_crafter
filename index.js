const storage = window.localStorage;

const shopRates = {
    "wood": 1,
}

const employmentRates = {
    "woodFarmers": 20,
    "woodMerchants": 20
}

function addItem(item, value) {
    storage.setItem(item, +storage.getItem(item) + value);
}

function getItem(item) {
    return +storage.getItem(item);
}

function farmItem(item) {
    addItem(item, 1);
    refresh();
}

function sellItem(item, quantity) {
    if(getItem(item) < quantity)
        quantity = getItem(item);
    let rate = shopRates[item];
    exchangeItemQuantities(item, "gold", quantity, rate);
    refresh();
}

function exchangeItemQuantities(tradeInItem, tradeOutItem, quantity, rate) {
    let tradeInQuantity = getItem(tradeInItem);

    if(tradeInQuantity < quantity*rate)
        return;
    
    addItem(tradeInItem, -quantity*rate);
    addItem(tradeOutItem, quantity);
    refresh();
}

function hireWorker(worker) {
    if(getItem("gold") < employmentRates[worker])
        return;
    let workers = JSON.parse(storage.getItem("workers"));
    if(!workers[worker])
        workers[worker] = 0;
    workers[worker]++;
    addItem("gold", -employmentRates[worker]);
    storage.setItem("workers", JSON.stringify(workers));
    refresh();
}

function hireMerchant(merchant) {
    if(getItem("gold") < employmentRates[merchant])
        return;
    let merchants = JSON.parse(storage.getItem("merchants"));
    if(!merchants[merchant])
        merchants[merchant] = 0;
    merchants[merchant]++;
    addItem("gold", employmentRates[merchant] * -1);
    storage.setItem("merchants", JSON.stringify(merchants));
    refresh();
}

function attack(boss, damage, weapon) {
    if(getItem(weapon) <= 0)
        return;
    addItem(weapon, -damage);
    addItem(boss, -damage);
    refresh();
}

function refresh() {
    if(storage.getItem("wood") === null)
        clearData();
    if(storage.getItem("slimeHP") === null)
        storage.setItem("slimeHP", 100);
    if(storage.getItem("woodSwords") === null)
        storage.setItem("woodSwords", 0);
    document.getElementById("wood").innerHTML = storage.getItem("wood");
    document.getElementById("gold").innerHTML = storage.getItem("gold");
    document.getElementById("slimeHP").innerHTML = storage.getItem("slimeHP");
    document.getElementById("woodSwords").innerHTML = storage.getItem("woodSwords");
    document.getElementById("woodFarmers").innerHTML = JSON.parse(storage.getItem("workers")).woodFarmers;
    document.getElementById("woodMerchants").innerHTML = JSON.parse(storage.getItem("merchants")).woodMerchants;
}

function clearData() {
    storage.clear();
    let workers = {
        woodFarmers: 0
    };
    let merchants = {
        woodMerchants: 0
    };
    storage.setItem("wood", 0);
    storage.setItem("gold", 0);
    storage.setItem("slimeHP", 100);
    storage.setItem("workers", JSON.stringify(workers));
    storage.setItem("merchants", JSON.stringify(merchants));
    refresh();
}

function initEmployees() {
    let workers = JSON.parse(storage.getItem("workers"));
    let merchants = JSON.parse(storage.getItem("merchants"));
    let workType = {
        "woodFarmers": "wood",
        "woodMerchants": "wood"
    }
    for(let worker in workers) {
        setInterval(function() {
            let workerCount = JSON.parse(storage.getItem("workers"))[worker];
            addItem(workType[worker], workerCount);
            refresh();
        }, 2000);
    }

    for(let merchant in merchants) {
        setInterval(function() {
            let merchantCount = JSON.parse(storage.getItem("merchants"))[merchant];
            sellItem(workType[merchant], merchantCount);
            refresh();
        }, 2000);
    }
}

refresh();
initEmployees();