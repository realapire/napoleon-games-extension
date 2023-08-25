const queryParams = new URLSearchParams(window.location.search);
const currentBets = JSON.parse(decodeURIComponent(queryParams.get('data'))) || [];
const betsHolder = document.querySelector('#KambiBC-container');

loadBets();

function loadBets() {
  betsHolder.innerHTML = '';
  for (let i = 0; i < currentBets.length; i++) {
    betsHolder.innerHTML += `<div class="npl-bet" data-id="${i}"><div class="KambiBC-react-collapsable-container KambiBC-react-collapsable-container--collapsed KambiBC-harmonized-my-bets-summary__collapsible-container"><header class="KambiBC-react-collapsable-container__header KambiBC-harmonized-my-bets-summary__collapsible-header" data-touch-feedback="true"><span class="KambiBC-react-collapsable-container__header__title" data-title-suffix=""><div class="KambiBC-harmonized-my-bets-summary__item KambiBC-my-bets-summary__item KambiBC-harmonized-my-bets-summary__item--won KambiBC-my-bets-summary__coupon"><div class="KambiBC-my-bets-summary__coupon-top"><div class="KambiBC-my-bets-summary__coupon-top-left"><div class="KambiBC-my-bets-summary__field"><span class="KambiBC-my-bets-summary__value KambiBC-my-bets-summary__title">Single<div class="KambiBC-my-bets-summary__field"> @ <span class="KambiBC-my-bets-summary__value">${currentBets[i].odds}</span></div><span class="KambiBC-my-bets-summary__coupon-status KambiBC-my-bets-summary__coupon-status--won">Gewonnen</span></span></div></div><div class="KambiBC-my-bets-summary__coupon-top-right"><span class="KambiBC-my-bets-summary__coupon-date KambiBC-my-bets-summary__dotted">${currentBets[i].date} • ${currentBets[i].time}</span><div class="KambiBC-my-bets-summary__coupon-ref"><span class="KambiBC-my-bets-summary__label">Coupon-id: </span><span class="KambiBC-my-bets-summary__value">${currentBets[i].id}</span></div></div></div><div class="KambiBC-my-bets-summary__coupon-bottom"><div class="KambiBC-my-bets-summary__coupon-bottom-left"><div class="KambiBC-my-bets-summary-coupon__event-list"><div><span class="KambiBC-my-bets-summary-coupon__event-list-name"><span>${currentBets[i].title}</span></span><span class="KambiBC-my-bets-summary-coupon__event-list-name"><span class="KambiBC-my-bets-summary-coupon__outcome-name">${currentBets[i].teams}</span></span></div></div><div class="KambiBC-my-bets-summary__odds-bog"></div></div><div class="KambiBC-my-bets-summary__coupon-bottom-right"><div class="KambiBC-my-bets-summary__stake-and-payout"><div class="KambiBC-my-bets-summary__field"><span class="KambiBC-my-bets-summary__label">Inzet: </span><span class="KambiBC-my-bets-summary__value KambiBC-my-bets-summary__stake-value">€${parseFloat(currentBets[i].stake).toFixed(2)}</span></div><div class="KambiBC-my-bets-summary__field"><span class="KambiBC-my-bets-summary__label">Uitbetaling: </span><span class="KambiBC-my-bets-summary__value KambiBC-my-bets-summary-payout__value">€${((currentBets[i].odds * currentBets[i].stake) * 100 / 100).toFixed(2)}</span></div></div></div></div></div></span></header><div class="KambiBC-react-collapsable-container__content KambiBC-react-collapsable-container__content--collapsed"></div></div></div>`;
  }
}

document.querySelector('#btnReset').addEventListener('click', resetSavedBets);

function readFile() {
  const input = document.getElementById("file-input");
  const file = input.files[0];
  if (file.name.split('.').pop() !== 'betsandbox') {
    alert('Only betsandbox config files');
    return;
  }
  const reader = new FileReader();
  reader.onload = function () {
    const content = reader.result.split('\n')
      .filter(line => !line.trim().startsWith('//'))
      .join('\n');
    setBets(JSON.parse(content));
    document.getElementById("file-content").innerHTML = JSON.stringify(content, null, 2);
  };
  reader.readAsText(file);
}

function setBets(importedBets) {
  if (importedBets.length < 1) return;

  chrome.storage.local.set({ bets: JSON.stringify([]) })
  betsHolder.innerHTML = '';
  for (let i = 0; i < importedBets.length; i++) {
    if (!importedBets[i].id) {
      console.log('ok');
      importedBets[i].id = generateRandomNumber();
    }

    if (!importedBets[i].date) {
      importedBets[i].date = getDate();
    }

    currentBets.push(importedBets[i]);
  }

  chrome.storage.local.set({ bets: JSON.stringify(currentBets) });

  alert('File succesfully added');
}

document.querySelector('#openFile').addEventListener('click', readFile);

function resetSavedBets() {
  chrome.storage.local.set({ bets: JSON.stringify([]) })
  betsHolder.innerHTML = '';
  alert('Bets succesfully removed');
}

function getDate() {
  const months = ["Jan", "Feb", "Mrt", "Apr", "Mei", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"];
  const currentDate = new Date();
  return currentDate.getDate() + ' ' + months[currentDate.getMonth()] + ' ' + currentDate.getFullYear();
}

function generateRandomNumber() {
  const min = 14783774;
  const max = 999999999;
  const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
  const formattedNum = '57' + randomNum.toString().padStart(8, '0');
  for (let i = 0; i < currentBets.length; i++) {
    if (currentBets[i].id == formattedNum) {
      return generateRandomNumber();
    }
  }
  return formattedNum;
}