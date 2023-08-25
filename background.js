// Napoleon Script Injection

let savedUsername = '';
let savedBalance = '';
let currentBets = [];

chrome.storage.local.get("username", function (data) {
    if (data.username) {
        savedUsername = data.username;
    }
});

chrome.storage.local.get("balance", function (data) {
    if (data.balance) {
        savedBalance = data.balance;
    }
});

chrome.storage.local.get("bets", function (data) {
    if (data.bets) {
        currentBets = JSON.parse(data.bets);
    }

    currentBets = sortBetsByDateAndTime(currentBets);

    savedBalance = parseFloat(savedBalance);
    for (let i = 0; i < currentBets.length; i++) {
        savedBalance -= currentBets[i].stake;
        if (savedBalance < 0) {
            alert('Higher your balance');
            return;
        }
        savedBalance += (currentBets[i].odds * currentBets[i].stake)
    }
});

function sortBetsByDateAndTime(bets) {
    console.log('called')
    for (let i = 0; i < bets.length - 1; i++) {
        for (let j = i + 1; j < bets.length; j++) {
            const betA = bets[i];
            const betB = bets[j];

            const dateA = new Date(betA.date.replace('Mei', 'May') + ' ' + betA.time).getTime();
            const dateB = new Date(betB.date.replace('Mei', 'May') + ' ' + betB.time).getTime();

            if (dateB > dateA) {
                bets[i] = betB;
                bets[j] = betA;
            }
        }
    }

    return bets;
}


let firstIntv = setInterval(() => {
    const balanceHolder = document.querySelector('.sc-jqUVSM');
    const userNameHolder = document.querySelector('.kXsHtm');

    if (balanceHolder && userNameHolder) {
        balanceHolder.innerText = savedBalance.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

        const nameSpan = userNameHolder.querySelector('span');
        const nameText = nameSpan.textContent.trim();
        const newInnerHTML = nameSpan.outerHTML + savedUsername;
        const oldInnerHTML = nameSpan.outerHTML + nameText + /[^<>]+/.source;
        const regex = new RegExp(oldInnerHTML, 'g');
        userNameHolder.innerHTML = userNameHolder.innerHTML.replace(regex, newInnerHTML);
    }
}, 0.1);

let secondIntv = setInterval(() => {
    const betsHolder = document.querySelector('.KambiBC-my-bets-summary__coupons-list');
    if (betsHolder) {
        betsHolder.innerHTML = '';
        if (currentBets.length > 0) {
            for (let i = 0; i < currentBets.length; i++) {
                betsHolder.innerHTML += `<div class="npl-bet" data-id="${i}"><div><div class="KambiBC-react-collapsable-container KambiBC-react-collapsable-container--collapsed KambiBC-harmonized-my-bets-summary__collapsible-container"><header class="KambiBC-react-collapsable-container__header KambiBC-harmonized-my-bets-summary__collapsible-header" data-touch-feedback="true"><span class="KambiBC-react-collapsable-container__header__title" data-title-suffix=""><div class="KambiBC-harmonized-my-bets-summary__item KambiBC-my-bets-summary__item KambiBC-harmonized-my-bets-summary__item--won KambiBC-my-bets-summary__coupon"><div class="KambiBC-my-bets-summary__coupon-top"><div class="KambiBC-my-bets-summary__coupon-top-left"><div class="KambiBC-my-bets-summary__field"><span class="KambiBC-my-bets-summary__value KambiBC-my-bets-summary__title">Single<div class="KambiBC-my-bets-summary__field"> @ <span class="KambiBC-my-bets-summary__value">${currentBets[i].odds}</span></div><span class="KambiBC-my-bets-summary__coupon-status KambiBC-my-bets-summary__coupon-status--won">Gewonnen</span></span></div></div><div class="KambiBC-my-bets-summary__coupon-top-right"><span class="KambiBC-my-bets-summary__coupon-date KambiBC-my-bets-summary__dotted">${currentBets[i].date} • ${currentBets[i].time}</span><div class="KambiBC-my-bets-summary__coupon-ref"><span class="KambiBC-my-bets-summary__label">Coupon-id: </span><span class="KambiBC-my-bets-summary__value">${currentBets[i].id}</span></div></div></div><div class="KambiBC-my-bets-summary__coupon-bottom"><div class="KambiBC-my-bets-summary__coupon-bottom-left"><div class="KambiBC-my-bets-summary-coupon__event-list"><div><span class="KambiBC-my-bets-summary-coupon__event-list-name"><span>${currentBets[i].title}</span></span><span class="KambiBC-my-bets-summary-coupon__event-list-name"><span class="KambiBC-my-bets-summary-coupon__outcome-name">${currentBets[i].teams}</span></span></div></div><div class="KambiBC-my-bets-summary__odds-bog"></div></div><div class="KambiBC-my-bets-summary__coupon-bottom-right"><div class="KambiBC-my-bets-summary__stake-and-payout"><div class="KambiBC-my-bets-summary__field"><span class="KambiBC-my-bets-summary__label">Inzet: </span><span class="KambiBC-my-bets-summary__value KambiBC-my-bets-summary__stake-value">€${parseFloat(currentBets[i].stake).toFixed(2)}</span></div><div class="KambiBC-my-bets-summary__field"><span class="KambiBC-my-bets-summary__label">Uitbetaling: </span><span class="KambiBC-my-bets-summary__value KambiBC-my-bets-summary-payout__value">€${((currentBets[i].odds * currentBets[i].stake) * 100 / 100).toFixed(2)}</span></div></div></div></div></div></span></header><div class="KambiBC-react-collapsable-container__content KambiBC-react-collapsable-container__content--collapsed"></div></div>`
            }

            betsHolder.addEventListener('click', function (e) {
                const selectedElement = e.target.closest('.npl-bet');
                if (selectedElement) {
                    toggleWindow(selectedElement);
                }
            });
        }

        setTimeout(() => {
            clearInterval(secondIntv);
        }, 1000);
    }
}, 0.01);

function toggleWindow(element) {
    const i = element.getAttribute('data-id');

    if (element.classList.contains('collapsed')) {
        element.innerHTML = `<div class="KambiBC-react-collapsable-container KambiBC-react-collapsable-container--collapsed KambiBC-harmonized-my-bets-summary__collapsible-container"><header class="KambiBC-react-collapsable-container__header KambiBC-harmonized-my-bets-summary__collapsible-header" data-touch-feedback="true"><span class="KambiBC-react-collapsable-container__header__title" data-title-suffix=""><div class="KambiBC-harmonized-my-bets-summary__item KambiBC-my-bets-summary__item KambiBC-harmonized-my-bets-summary__item--won KambiBC-my-bets-summary__coupon"><div class="KambiBC-my-bets-summary__coupon-top"><div class="KambiBC-my-bets-summary__coupon-top-left"><div class="KambiBC-my-bets-summary__field"><span class="KambiBC-my-bets-summary__value KambiBC-my-bets-summary__title">Single<div class="KambiBC-my-bets-summary__field"> @ <span class="KambiBC-my-bets-summary__value">${currentBets[i].odds}</span></div><span class="KambiBC-my-bets-summary__coupon-status KambiBC-my-bets-summary__coupon-status--won">Gewonnen</span></span></div></div><div class="KambiBC-my-bets-summary__coupon-top-right"><span class="KambiBC-my-bets-summary__coupon-date KambiBC-my-bets-summary__dotted">${currentBets[i].date} • ${currentBets[i].time}</span><div class="KambiBC-my-bets-summary__coupon-ref"><span class="KambiBC-my-bets-summary__label">Coupon-id: </span><span class="KambiBC-my-bets-summary__value">${currentBets[i].id}</span></div></div></div><div class="KambiBC-my-bets-summary__coupon-bottom"><div class="KambiBC-my-bets-summary__coupon-bottom-left"><div class="KambiBC-my-bets-summary-coupon__event-list"><div><span class="KambiBC-my-bets-summary-coupon__event-list-name"><span>${currentBets[i].title}</span></span><span class="KambiBC-my-bets-summary-coupon__event-list-name"><span class="KambiBC-my-bets-summary-coupon__outcome-name">${currentBets[i].teams}</span></span></div></div><div class="KambiBC-my-bets-summary__odds-bog"></div></div><div class="KambiBC-my-bets-summary__coupon-bottom-right"><div class="KambiBC-my-bets-summary__stake-and-payout"><div class="KambiBC-my-bets-summary__field"><span class="KambiBC-my-bets-summary__label">Inzet: </span><span class="KambiBC-my-bets-summary__value KambiBC-my-bets-summary__stake-value">€${parseFloat(currentBets[i].stake).toFixed(2)}</span></div><div class="KambiBC-my-bets-summary__field"><span class="KambiBC-my-bets-summary__label">Uitbetaling: </span><span class="KambiBC-my-bets-summary__value KambiBC-my-bets-summary-payout__value">€${((currentBets[i].odds * currentBets[i].stake) * 100 / 100).toFixed(2)}</span></div></div></div></div></div></span></header><div class="KambiBC-react-collapsable-container__content KambiBC-react-collapsable-container__content--collapsed"></div></div>`;
    } else {
        element.innerHTML = `<div class="KambiBC-react-collapsable-container KambiBC-harmonized-my-bets-summary__collapsible-container"><header class="KambiBC-react-collapsable-container__header KambiBC-harmonized-my-bets-summary__collapsible-header" data-touch-feedback="true"><span class="KambiBC-react-collapsable-container__header__title" data-title-suffix=""><div class="KambiBC-harmonized-my-bets-summary__item KambiBC-my-bets-summary__item KambiBC-my-bets-summary__coupon"><div class="KambiBC-my-bets-summary__coupon-top"><div class="KambiBC-my-bets-summary__coupon-top-left"><div class="KambiBC-my-bets-summary__field"><span class="KambiBC-my-bets-summary__value KambiBC-my-bets-summary__title">Single<div class="KambiBC-my-bets-summary__field"> @ <span class="KambiBC-my-bets-summary__value">${currentBets[i].odds}</span></div><span class="KambiBC-my-bets-summary__coupon-status KambiBC-my-bets-summary__coupon-status--won">Gewonnen</span></span></div></div><div class="KambiBC-my-bets-summary__coupon-top-right"><span class="KambiBC-my-bets-summary__coupon-date KambiBC-my-bets-summary__dotted">${currentBets[i].date} • ${currentBets[i].time}</span><div class="KambiBC-my-bets-summary__coupon-ref"><span class="KambiBC-my-bets-summary__label">Coupon-id: </span><span class="KambiBC-my-bets-summary__value">${currentBets[i].id}</span></div></div></div><div class="KambiBC-my-bets-summary__coupon-bottom"><div class="KambiBC-my-bets-summary__coupon-bottom-left"><div class="KambiBC-my-bets-summary-coupon__event-list"><div><span class="KambiBC-my-bets-summary-coupon__event-list-name"><span>${currentBets[i].title}</span></span><span class="KambiBC-my-bets-summary-coupon__event-list-name"><span class="KambiBC-my-bets-summary-coupon__outcome-name">${currentBets[i].teams}</span></span></div></div><div class="KambiBC-my-bets-summary__odds-bog"></div></div><div class="KambiBC-my-bets-summary__coupon-bottom-right"><div class="KambiBC-my-bets-summary__stake-and-payout"><div class="KambiBC-my-bets-summary__field"><span class="KambiBC-my-bets-summary__label">Inzet: </span><span class="KambiBC-my-bets-summary__value KambiBC-my-bets-summary__stake-value">€${parseFloat(currentBets[i].stake).toFixed(2)}</span></div><div class="KambiBC-my-bets-summary__field"><span class="KambiBC-my-bets-summary__label">Uitbetaling: </span><span class="KambiBC-my-bets-summary__value KambiBC-my-bets-summary-payout__value">€${((currentBets[i].stake * currentBets[i].odds) * 100 / 100).toFixed(2)}</span></div></div></div></div></div></span></header><div class="KambiBC-react-collapsable-container__content"><div class="KambiBC-bethistory-detail KambiBC-bethistory-detail--harmonized KambiBC-bethistory-detail--mod"><div class="KambiBC-bethistory-coupon_detail_items_systems"><span class="KambiBC-bethistory-coupon_detail_items KambiBC-bethistoryq-coupon_detail_items-full-width" style='width:100% !important'><ol class="KambiBC-outcome-items KambiBC-outcome-items--history KambiBC-outcome-items--system-combinations-expanded"><li class="KambiBC-outcome-item KambiBC-outcome-item--harmonized KambiBC-outcome-item--history"><div class="KambiBC-outcome-item__status-indicator KambiBC-outcome-item__status-indicator--won"><div class="KambiBC-outcome-item__status-indicator-counter KambiBC-harmonized-outcome-item-counter">1</div></div><article class="KambiBC-outcome-item__info-list KambiBC-outcome-item__info-list--won"><header class="KambiBC-outcome-item__name KambiBC-bethistory-label-item">${currentBets[i].title}  @  <span class="KambiBC-odds">${currentBets[i].odds}</span></header><div class="KambiBC-outcome-item__event-group KambiBC-bethistory-label-item"><sup class="KambiBC-outcome-item__name__live">Live</sup><span>${currentBets[i].teams}</span></div><div class="KambiBC-outcome-item__event-group KambiBC-bethistory-label-item"><time datetime="1682759011667">${currentBets[i].date.toLowerCase() + ' ' + currentBets[i].time.substring(0, 5)}</time></div><div class="KambiBC-outcome-item__event-group KambiBC-bethistory-label-item">Voetbal /${currentBets[i].path}</div><div class="KambiBC-outcome-item__result KambiBC-bethistory-label-item"><span class="KambiBC-outcome-item__result__label">Uitslag: </span>${currentBets[i].outcome}</div></article></li></ol></span></div><div class="KambiBC-react-collapsable-container KambiBC-react-collapsable-container--collapsed KambiBC-transaction-history KambiBC-transaction-history--harmonized KambiBC-transaction-history__content"><div class="KambiBC-react-collapsable-container__content KambiBC-react-collapsable-container__content--collapsed"></div><header class="KambiBC-react-collapsable-container__header KambiBC-transaction-history__toggle" data-touch-feedback="true"><span class="KambiBC-react-collapsable-container__header__title KambiBC-transaction-history__toggle__closed-text">Transactiegeschiedenis tonen</span></header></div></div></div></div>`
    }

    element.classList.toggle('collapsed');
}


