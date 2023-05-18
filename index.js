let voice_index = 0;
let voices_filtered = []
let min = 1;
let max = 25;
let numb = getRandomInt(min, max);
let alerts = document.getElementById("alerts");
let new_n = document.getElementById("new-numb");
let play = document.getElementById("demo");
let easy = document.getElementById("easy").addEventListener("click", difficulty_selector);
let medium = document.getElementById("medium").addEventListener("click", difficulty_selector);
let hard = document.getElementById("hard").addEventListener("click", difficulty_selector);
let expert = document.getElementById("expert").addEventListener("click", difficulty_selector);
let user_input = document.getElementById("user-input");
let voice_select = document.getElementById("arrayDropdown");
let banned_names = ["Grandma", "Grandpa", "Rocko", "Eddy", "Reed", "Flo", "Sandy", "Shelley"]


play.addEventListener("click", play_voice);
voice_select.addEventListener("change", change_voice);
user_input.addEventListener("input", check)

document.getElementById("refresh").addEventListener("click", function () { new_number(false) });
document.getElementById("giveup").addEventListener("click", give_up);


const allVoicesObtained = new Promise(function (resolve, reject) {
    let voice_list = window.speechSynthesis.getVoices();
    if (voice_list.length !== 0) {
        resolve(voice_list);
    } else {
        window.speechSynthesis.addEventListener("voiceschanged", function () {
            voice_list = window.speechSynthesis.getVoices();
            resolve(voice_list);
        });
    }
});
allVoicesObtained.then(voice_list => (populate_voice_choice(voice_list)));

function populate_voice_choice(voice_list) {
    function check_name(banned_names, current_name) { return banned_names.some(substring => current_name.includes(substring)) }
    voice_list.forEach(function (item, index) { if ((item.lang === 'es-ES' || item.lang === 'es-MX')) { if (!check_name(banned_names, item.name)) { voices_filtered.push(item) } } })
    let options = '';
    voices_filtered.map((op, i) => {
        options += `<option value="${op.name}" id="${i}" style="border-radius: 5px;"">${op.name}</option>`
    })
    voice_select.innerHTML = options;
    for (var i = 0; i < voice_select.options.length; i++) {
        if (voice_select.options[i].value.includes("Google")) {
            voice_select.options[i].selected = true;
            break;
        }
    }
    voice_index = voice_select.options[voice_select.selectedIndex].id
}
function bounce(object) {
    object.classList.remove("anim");
    void object.offsetWidth;
    object.classList.add("anim")
}

function change_voice() {
    voice_index = voice_select.options[voice_select.selectedIndex].id
    play_voice();
}
function check() {

    if (String(user_input.value) != String(numb)) {
        alerts.innerText = "Keep trying";
        alerts.classList.remove("correct");
        alerts.classList.remove("hidden");
    } else {
        alerts.innerText = "Good Job! It was " + String(numb) + ".";
        alerts.classList.add("correct");
        alerts.classList.remove("hidden");
        new_number(true);
    }

}

function give_up() {
    alerts.innerText = `It is ${numb}!`;
    alerts.classList.remove("correct");
    alerts.classList.remove("hidden");
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function new_number(succes) {
    numb = getRandomInt(min, max)
    new_n.innerText = "How about this one:";
    new_n.classList.remove("hidden");
    if (succes === false) {
        alerts.classList.add("hidden");
    }
    user_input.value = "";
    bounce(play);
    play_voice();
}

function play_voice() {
    let msg = new SpeechSynthesisUtterance();
    msg.voice = voices_filtered[voice_index];
    msg.text = String(numb);
    msg.lang = "es-ES";
    speechSynthesis.speak(msg);
}

function difficulty_selector() {
    let matches = document.querySelectorAll("button.selector");
    matches.forEach((btn) => {
        if (this.id === btn.id) {
            btn.classList.add("selected");
        } else {
            btn.classList.remove("selected");
        }
    });
    switch (this.id) {
        case "easy":
            max = 30
            break;
        case "medium":
            max = 100
            break;
        case "hard":
            max = 1000
            break;
        case "expert":
            max = 10000;
            break;
        default:
            max = 30
    }

}