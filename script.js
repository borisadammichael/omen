let coinCount = 0;
let energy = 500;
const boostCost = 10000;
const taskReward = 50000;
const refReward = 20000;
let boostActive = false;
let web3;

// Инициализация Web3
window.addEventListener('load', async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.enable();
        } catch (error) {
            console.error("User denied account access...");
        }
    } else if (window.web3) {
        web3 = new Web3(web3.currentProvider);
    } else {
        console.error("Non-Ethereum browser detected. You should consider trying MetaMask!");
    }
    updateUI();
});

function updateUI() {
    document.getElementById('coin-count').innerText = coinCount.toLocaleString();
    document.getElementById('energy').style.width = `${(energy / 500) * 100}%`;
    document.getElementById('energy-text').innerText = `⚡️${energy}/500`;
}

function incrementCount(event) {
    if (energy > 0) {
        let increment = boostActive ? 2 : 1;
        coinCount += increment;
        energy = Math.max(0, energy - 1);
        showFloatingText(event.clientX, event.clientY, `+${increment}`);
        updateUI();
    }
}

function showFloatingText(x, y, text) {
    const floatingText = document.createElement('div');
    floatingText.className = 'floating-text';
    floatingText.style.left = `${x}px`;
    floatingText.style.top = `${y}px`;
    floatingText.innerText = text;
    document.body.appendChild(floatingText);

    setTimeout(() => {
        document.body.removeChild(floatingText);
    }, 1000);
}

function buyBoost() {
    if (coinCount >= boostCost) {
        coinCount -= boostCost;
        boostActive = true;
        setTimeout(() => {
            boostActive = false;
        }, 60000); // Boost lasts for 60 seconds
    } else {
        alert("Недостаточно монет для буста.");
    }
    updateUI();
}

function openTask() {
    if (coinCount >= taskReward) {
        coinCount -= taskReward;
        alert("Выполните задание: Подпишитесь на наш Telegram канал.");
    } else {
        alert("Недостаточно монет для выполнения задания.");
    }
    updateUI();
}

function openRef() {
    const refLink = `https://t.me/your_bot?start=${new Date().getTime()}`;
    alert(`Ваша реферальная ссылка: ${refLink}`);
    coinCount += refReward;
    updateUI();
}

async function withdraw() {
    const accounts = await web3.eth.getAccounts();
    const amount = web3.utils.toWei(coinCount.toString(), 'ether');
    try {
        await web3.eth.sendTransaction({
            from: accounts[0],
            to: 'YOUR_WALLET_ADDRESS',
            value: amount
        });
        coinCount = 0;
        alert("Монеты успешно выведены!");
    } catch (error) {
        console.error("Ошибка при выводе монет: ", error);
    }
    updateUI();
}

document.addEventListener('DOMContentLoaded', (event) => {
    updateUI();
});

// Обработка множественных касаний
document.querySelector('.coin img').addEventListener('touchstart', (event) => {
    event.preventDefault();
    for (let i = 0; i < event.touches.length; i++) {
        incrementCount(event.touches[i]);
    }
});


// Восстановление энергии каждые 7.2 секунды (500 энергии в час)
setInterval(() => {
    energy = Math.min(500, energy + 1);
    updateUI();
}, 7200);

// script.js

function handleClick(event) {
    const coin = document.querySelector('.coin');
    const coinImg = coin.querySelector('img');

    // Получаем координаты клика относительно центра монеты
    const boundingRect = coin.getBoundingClientRect();
    const clickX = event.clientX - boundingRect.left - boundingRect.width / 2;
    const clickY = event.clientY - boundingRect.top - boundingRect.height / 2;

    // Вычисляем угол наклона (в радианах)
    const angle = Math.atan2(clickY, clickX);

    // Преобразуем радианы в градусы и добавляем 20% к углу
    const degrees = angle * (180 / Math.PI) + 20;

    // Применяем трансформацию к изображению
    coinImg.style.transform = `translate(-50%, -50%) rotate(${degrees}deg)`;

    // Добавляем задержку перед возвращением в исходное положение
    setTimeout(() => {
        coinImg.style.transform = 'translate(-50%, -50%) rotate(0deg)';
    }, 100);
}

// Добавляем обработчик клика на изображение монеты
const coin = document.querySelector('.coin');
coin.addEventListener('click', handleClick);
