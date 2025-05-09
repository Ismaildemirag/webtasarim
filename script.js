{
    function toggleMenu() {
        document.getElementById("sideMenu").classList.toggle("active");
    }

    function toggleDropdown(el) {
        el.classList.toggle("open");
    }
}

let champions = {};
let championNames = [];
let randomChampion = "";
let hintCounter = 0;

async function fetchChampions() {
    try {
        const response = await fetch("https://ddragon.leagueoflegends.com/cdn/15.9.1/data/tr_TR/champion.json");
        const data = await response.json();
        champions = data.data;
        championNames = Object.keys(champions);
        selectRandomChampion();
    } catch (error) {
        console.error("Şampiyon verileri alınamadı:", error);
    }
}

function selectRandomChampion() {
    const randomIndex = Math.floor(Math.random() * championNames.length);
    randomChampion = championNames[randomIndex];
    hintCounter = 0;
    document.getElementById("result").textContent = "";
    document.getElementById("championDisplay").innerHTML = "";
    document.getElementById("guessInput").value = "";
    document.getElementById("restartBtn").style.display = "none";
    console.log("Seçilen şampiyon:", randomChampion);
}

function getHint() {
    const name = randomChampion.toLowerCase();
    switch (hintCounter) {
        case 1:
            return `İpucu: Şampiyon ${name.length} harfli.`;
        case 2:
            return `İpucu: İlk harfi "${name.charAt(0).toUpperCase()}".`;
        case 3:
            return `İpucu: Son harfi "${name.charAt(name.length - 1).toUpperCase()}".`;
        case 4:
            // iframe'i görünür yap, sayfayı yükle
            const frame = document.getElementById("championFrame");
            frame.src = "oyunip.html";
            frame.style.display = "block";
            return 'İpucu: Bu sayfadan yardım alabilirsin 👇';
        default:
            return "İpucu: Son Sansın!!";
    }
}

function checkGuess() {
    const userGuess = document.getElementById("guessInput").value.trim();
    const result = document.getElementById("result");
    const display = document.getElementById("championDisplay");
    const restartBtn = document.getElementById("restartBtn");

    if (!userGuess) {
        result.textContent = "⚠️ Lütfen bir tahmin girin.";
        result.style.color = "yellow";
        return;
    }

    if (userGuess.toLowerCase() === randomChampion.toLowerCase()) {
        result.textContent = "🎉 Doğru! Şampiyon: " + champions[randomChampion].name;
        result.style.color = "lime";

        const imgUrl = `https://ddragon.leagueoflegends.com/cdn/15.9.1/img/champion/${champions[randomChampion].image.full}`;
        display.innerHTML = `<img src="${imgUrl}" alt="${champions[randomChampion].name}" style="width: 120px;"><p>${champions[randomChampion].title}</p>`;

        restartBtn.style.display = "inline-block";
    } else {
        hintCounter++;
        const hint = getHint();
        result.textContent = `❌ Yanlış tahmin. ${hint}`;
        result.style.color = "orange";
        display.innerHTML = "";

        // Maksimum 5 ipucundan sonra oyun sonlanabilir (isteğe bağlı)
        if (hintCounter >= 5) {
            result.textContent = `😞 Üzgünüm, doğru cevap: ${champions[randomChampion].name}`;
            restartBtn.style.display = "inline-block";
        }
    }
}

function restartGame() {
    selectRandomChampion();
    const frame = document.getElementById("championFrame");
    frame.src = "";
    frame.style.display = "none";
}

window.onload = fetchChampions;

{
    const championList = document.getElementById("championList");
    const sortSelect = document.getElementById("sort");
    let champion = [];

    async function fetchChampions() {
        try {
            const response = await fetch("https://ddragon.leagueoflegends.com/cdn/15.9.1/data/tr_TR/champion.json");
            const data = await response.json();
            champion = Object.values(data.data);
            displayChampions(champion);
        } catch (error) {
            console.error("Şampiyon verileri alınamadı:", error);
        }
    }

    function displayChampions(championArray) {
        championList.innerHTML = "";
        championArray.forEach(champ => {
            const card = document.createElement("div");
            card.className = "champion-card";
            const img = document.createElement("img");
            img.src = `https://ddragon.leagueoflegends.com/cdn/15.9.1/img/champion/${champ.image.full}`;
            img.alt = champ.name;
            const name = document.createElement("p");
            name.textContent = champ.name;
            card.appendChild(img);
            card.appendChild(name);
            championList.appendChild(card);
        });
    }

    sortSelect.addEventListener("change", () => {
        let sortedChampions = [...champion];
        if (sortSelect.value === "alphabetical") {
            sortedChampions.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortSelect.value === "length") {
            sortedChampions.sort((a, b) => a.name.length - b.name.length);
        }
        displayChampions(sortedChampions);
    });

    window.onload = fetchChampions;
}



