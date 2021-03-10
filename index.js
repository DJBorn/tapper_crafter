const storage = window.localStorage;

const shopRates = {
    "wood": 1,
}

const employmentRates = {
    "woodFarmers": 1
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

function sellItem(item) {
    if(getItem(item) <= 0)
        return;
    let rate = shopRates[item];
    addItem(item, -1);
    addItem("gold", rate);
    refresh();
}

function hire(worker) {
    if(getItem("gold") < employmentRates[worker])
        return;
    let workers = JSON.parse(storage.getItem("workers"));
    if(!workers[worker])
        workers[worker] = 0;
    workers[worker]++;
    addItem("gold", employmentRates[worker] * -1);
    storage.setItem("workers", JSON.stringify(workers));
    refresh();
}

function refresh() {
    document.getElementById("wood").innerHTML = storage.getItem("wood");
    document.getElementById("gold").innerHTML = storage.getItem("gold");
    document.getElementById("woodFarmers").innerHTML = JSON.parse(storage.getItem("workers")).woodFarmers;
}

function clearData() {
    storage.clear();
    let workers = {
        woodFarmers: 0
    };
    storage.setItem("wood", 0);
    storage.setItem("gold", 0);
    storage.setItem("workers", JSON.stringify(workers));
    refresh();
}

function initWorkers() {
    let workers = JSON.parse(storage.getItem("workers"));
    let workType = {
        "woodFarmers": "wood"
    }
    for(let worker in workers) {
        setInterval(function() {
            let workerCount = JSON.parse(storage.getItem("workers"))[worker];
            addItem(workType[worker], workerCount);
            refresh();
        }, 2000);
    }
}

refresh();
initWorkers();