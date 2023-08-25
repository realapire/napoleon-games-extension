// Extension Modal Window

const DOM = { 
    txtUsername: document.querySelector('#txtUsername'),
    btnUsername: document.querySelector('#btnUsername'),
    txtBalance: document.querySelector('#txtBalance'),
    btnBalance: document.querySelector('#btnBalance'),
    txtBetTitle: document.querySelector('#txtBetTitle'),
    txtBetTeams: document.querySelector('#txtBetTeams'),
    txtBetTime: document.querySelector('#txtBetTime'),
    txtBetStake: document.querySelector('#txtBetStake'),
    txtBetOdds: document.querySelector('#txtBetOdds'),
    chkBoxLoss: document.querySelector('#chkBoxLoss')
};

let savedUsername = '';
let savedBalance = '';
let currentBets = [];

chrome.storage.local.get("username", function(data) {
    savedUsername = data.username;
    DOM.txtUsername.value = savedUsername;
});

chrome.storage.local.get("balance", function(data) {
    savedBalance = data.balance;
    DOM.txtBalance.value = savedBalance;
});

chrome.storage.local.get("bets", function(data) {
    if(data.bets) {
        currentBets = JSON.parse(data.bets);
        document.querySelector('#debug').innerHTML = 'Current bets: ' + currentBets;
    }
});

DOM.btnUsername.addEventListener('click', function() {
    if (DOM.txtUsername.value.length > 2) {
        chrome.storage.local.set({ username: DOM.txtUsername.value });
        alert('Username set to' + DOM.txtUsername.value);
    }
});

DOM.btnBalance.addEventListener('click', function() {
    if (DOM.txtBalance.value.length > 0) {
        chrome.storage.local.set({ balance: DOM.txtBalance.value });
        alert('Balance set to ' + DOM.txtBalance.value);
    }
});

function generateRandomNumber() {
    const min = 14783774;
    const max = 999999999;
    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    const formattedNum = '57' + randomNum.toString().padStart(8, '0');
    return formattedNum;
}


document.querySelector('#btnMakeBet').addEventListener('click', function() {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentDate = new Date();
    const formattedDate = currentDate.getDate() + ' ' + months[currentDate.getMonth()] + ' ' + currentDate.getFullYear();
    console.log(formattedDate);

    newBet = { 
        id: generateRandomNumber(), 
        title: DOM.txtBetTitle.value, 
        desc: DOM.txtBetTeams.value,
        date: formattedDate,
        time: DOM.txtBetTime.value,
        odds: DOM.txtBetOdds.value,
        stake: DOM.txtBetStake.value,
        loss: DOM.chkBoxLoss.value
    }

    currentBets.push(newBet);
    chrome.storage.local.set({ bets: JSON.stringify(currentBets) });
    document.querySelector('#debug').innerHTML = 'Current bets: ' + currentBets;
});

document.querySelector('#btnShowBets').addEventListener('click', function() {
    const queryParams = encodeURIComponent(JSON.stringify(currentBets));
    const url = chrome.runtime.getURL(`bets.html?data=${queryParams}`);
    chrome.tabs.create({ url });    
});

  


