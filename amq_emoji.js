// ==UserScript==
// @name         AMQ Emoji Auto-Replace
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically replaces emoji shortcodes like :mute: with actual emojis in your answers
// @author       Deplex_
// @match        https://*.animemusicquiz.com/*
// @grant        none
// @require      https://github.com/joske2865/AMQ-Scripts/raw/master/common/amqScriptInfo.js
// ==/UserScript==

"use strict";

// Wait for the game to load
if (typeof Listener === "undefined") return;

// Comprehensive emoji map
const emojiMap = {
    // Smileys & Emotion
    "smile": "😊", "grin": "😁", "joy": "😂", "rofl": "🤣", "smiley": "😃",
    "sweat_smile": "😅", "laughing": "😆", "wink": "😉", "blush": "😊",
    "yum": "😋", "heart_eyes": "😍", "kissing_heart": "😘", "relaxed": "☺️",
    "smirk": "😏", "unamused": "😒", "disappointed": "😞", "pensive": "😔",
    "worried": "😟", "confused": "😕", "frown": "☹️", "persevere": "😣",
    "confounded": "😖", "tired_face": "😫", "weary": "😩", "sob": "😭",
    "cry": "😢", "triumph": "😤", "angry": "😠", "rage": "😡",
    "neutral_face": "😐", "expressionless": "😑", "thinking": "🤔",
    "shushing_face": "🤫", "yawning_face": "🥱", "astonished": "😲",
    "flushed": "😳", "pleading_face": "🥺", "fearful": "😨", "cold_sweat": "😰",
    "scream": "😱", "dizzy_face": "😵", "stuck_out_tongue": "😛",
    "stuck_out_tongue_winking_eye": "😜", "drooling_face": "🤤", "sleeping": "😴",
    "mask": "😷", "face_with_thermometer": "🤒", "nauseated_face": "🤢",
    "vomiting_face": "🤮", "sneezing_face": "🤧", "hot_face": "🥵",
    "cold_face": "🥶", "woozy_face": "🥴", "exploding_head": "🤯",
    "cowboy": "🤠", "partying_face": "🥳", "sunglasses": "😎", "nerd_face": "🤓",

    // Gestures & Body Parts
    "thumbsup": "👍", "thumbsdown": "👎", "ok_hand": "👌", "punch": "👊",
    "fist": "✊", "v": "✌️", "wave": "👋", "raised_hand": "✋",
    "raised_hands": "🙌", "pray": "🙏", "clap": "👏", "muscle": "💪",
    "handshake": "🤝", "point_up": "☝️", "point_down": "👇", "point_left": "👈",
    "point_right": "👉", "middle_finger": "🖕", "writing_hand": "✍️", "selfie": "🤳",

    // Hearts & Love
    "heart": "❤️", "orange_heart": "🧡", "yellow_heart": "💛", "green_heart": "💚",
    "blue_heart": "💙", "purple_heart": "💜", "brown_heart": "🤎", "black_heart": "🖤",
    "white_heart": "🤍", "broken_heart": "💔", "heart_on_fire": "❤️‍🔥",
    "two_hearts": "💕", "sparkling_heart": "💖", "heartpulse": "💗",
    "heartbeat": "💓", "revolving_hearts": "💞", "cupid": "💘", "gift_heart": "💝",
    "kiss": "💋", "love_letter": "💌",

    // Symbols
    "fire": "🔥", "star": "⭐", "sparkles": "✨", "zap": "⚡", "boom": "💥",
    "dizzy": "💫", "sweat_drops": "💦", "dash": "💨", "100": "💯", "sos": "🆘",
    "check": "✅", "x": "❌", "no_entry": "⛔", "warning": "⚠️", "question": "❓",
    "exclamation": "❗", "bangbang": "‼️", "interrobang": "⁉️", "arrow_up": "⬆️",
    "arrow_down": "⬇️", "arrow_left": "⬅️", "arrow_right": "➡️", "tm": "™️",
    "copyright": "©️", "registered": "®️", "free": "🆓", "new": "🆕", "cool": "🆒",
    "ok": "🆗", "up": "🆙", "vs": "🆚", "zzz": "💤", "anger": "💢",
    "white_check_mark": "✅", "negative_squared_cross_mark": "❎", "cyclone": "🌀",
    "peace_symbol": "☮️", "radioactive": "☢️", "biohazard": "☣️", "trident": "🔱",
    "ocean": "🌊",

    // Music & Sound
    "musical_note": "🎵", "notes": "🎶", "microphone": "🎤", "headphones": "🎧",
    "speaker": "🔊", "loud_sound": "🔊", "sound": "🔉", "mute": "🔇",
    "bell": "🔔", "no_bell": "🔕",

    // Animals & Nature
    "dog": "🐶", "cat": "🐱", "mouse": "🐭", "hamster": "🐹", "rabbit": "🐰",
    "fox": "🦊", "bear": "🐻", "panda": "🐼", "koala": "🐨", "tiger": "🐯",
    "lion": "🦁", "cow": "🐮", "pig": "🐷", "pig_nose": "🐽", "frog": "🐸",
    "monkey": "🐵", "see_no_evil": "🙈", "hear_no_evil": "🙉", "speak_no_evil": "🙊",
    "chicken": "🐔", "penguin": "🐧", "bird": "🐦", "baby_chick": "🐤",
    "duck": "🦆", "eagle": "🦅", "owl": "🦉", "bat": "🦇", "wolf": "🐺",
    "horse": "🐴", "unicorn": "🦄", "zebra": "🦓", "deer": "🦌", "camel": "🐪",
    "llama": "🦙", "giraffe": "🦒", "elephant": "🐘", "rhinoceros": "🦏",
    "hippopotamus": "🦛", "snake": "🐍", "dragon": "🐉", "turtle": "🐢",
    "snail": "🐌", "bug": "🐛", "ant": "🐜", "bee": "🐝", "honeybee": "🐝",
    "ladybug": "🐞", "spider": "🕷️", "spider_web": "🕸️", "scorpion": "🦂",
    "fish": "🐟", "tropical_fish": "🐠", "blowfish": "🐡", "shark": "🦈",
    "octopus": "🐙", "shell": "🐚", "crab": "🦀", "lobster": "🦞", "shrimp": "🦐",
    "squid": "🦑", "whale": "🐳", "dolphin": "🐬", "blossom": "🌼",
    "cherry_blossom": "🌸", "bouquet": "💐", "rose": "🌹", "sunflower": "🌻",
    "tulip": "🌷", "seedling": "🌱", "evergreen_tree": "🌲", "palm_tree": "🌴",
    "cactus": "🌵", "four_leaf_clover": "🍀", "maple_leaf": "🍁", "mushroom": "🍄",

    // Food & Drink
    "pizza": "🍕", "burger": "🍔", "fries": "🍟", "hotdog": "🌭", "taco": "🌮",
    "burrito": "🌯", "egg": "🥚", "bacon": "🥓", "pancakes": "🥞", "cheese": "🧀",
    "sushi": "🍣", "ramen": "🍜", "spaghetti": "🍝", "rice": "🍚", "curry": "🍛",
    "bread": "🍞", "croissant": "🥐", "pretzel": "🥨", "bagel": "🥯", "salad": "🥗",
    "popcorn": "🍿", "cake": "🍰", "birthday": "🎂", "cupcake": "🧁", "pie": "🥧",
    "cookie": "🍪", "chocolate": "🍫", "candy": "🍬", "lollipop": "🍭",
    "ice_cream": "🍨", "doughnut": "🍩", "apple": "🍎", "banana": "🍌",
    "watermelon": "🍉", "grapes": "🍇", "strawberry": "🍓", "peach": "🍑",
    "pineapple": "🍍", "tomato": "🍅", "eggplant": "🍆", "avocado": "🥑",
    "broccoli": "🥦", "corn": "🌽", "carrot": "🥕", "potato": "🥔",
    "coffee": "☕", "tea": "🍵", "beer": "🍺", "wine": "🍷", "cocktail": "🍹",
    "champagne": "🍾", "milk": "🥛",

    // Activities & Sports
    "soccer": "⚽", "basketball": "🏀", "football": "🏈", "baseball": "⚾",
    "tennis": "🎾", "volleyball": "🏐", "8ball": "🎱", "bowling": "🎳",
    "golf": "⛳", "dart": "🎯", "trophy": "🏆", "medal": "🏅",
    "first_place": "🥇", "second_place": "🥈", "third_place": "🥉",

    // Travel & Places
    "car": "🚗", "taxi": "🚕", "bus": "🚌", "train": "🚆", "airplane": "✈️",
    "rocket": "🚀", "ship": "🚢", "bike": "🚲", "house": "🏠", "office": "🏢",
    "hospital": "🏥", "school": "🏫", "hotel": "🏨", "rainbow": "🌈",
    "umbrella": "☂️", "snowflake": "❄️", "sunny": "☀️", "cloud": "☁️",
    "moon": "🌙",

    // Objects
    "phone": "📱", "computer": "💻", "keyboard": "⌨️", "tv": "📺",
    "camera": "📷", "video_camera": "📹", "book": "📖", "pencil": "✏️",
    "pen": "🖊️", "mag": "🔍", "lock": "🔒", "unlock": "🔓", "key": "🔑",
    "hammer": "🔨", "wrench": "🔧", "knife": "🔪", "gun": "🔫", "bomb": "💣",
    "pill": "💊", "money": "💰", "dollar": "💵", "gem": "💎", "crown": "👑",
    "ring": "💍", "gift": "🎁", "balloon": "🎈", "tada": "🎉", "confetti": "🎊",

    // Flags
    "flag_us": "🇺🇸", "flag_gb": "🇬🇧", "flag_jp": "🇯🇵", "flag_kr": "🇰🇷",
    "flag_cn": "🇨🇳", "flag_fr": "🇫🇷", "flag_de": "🇩🇪", "flag_it": "🇮🇹",
    "flag_es": "🇪🇸", "flag_br": "🇧🇷", "flag_ca": "🇨🇦", "flag_au": "🇦🇺",
};

const loadInterval = setInterval(() => {
    if (document.querySelector("#loadingScreen.hidden")) {
        clearInterval(loadInterval);
        setup();
    }
}, 500);

function setup() {
    console.log("AMQ Emoji Auto-Replace loaded!");

    // Wait for quiz to be ready and hook into answer input
    let checkInterval = setInterval(() => {
        if (typeof quiz !== "undefined" && quiz.answerInput) {
            clearInterval(checkInterval);
            hookAnswerInput();
        }
    }, 500);
}

function hookAnswerInput() {
    console.log("Hooking into answer input...");

    // Get the input field
    const input = quiz.answerInput.typingInput.$input;

    // Listen for input changes
    input.on('input', function() {
        const cursorPos = this.selectionStart;
        const originalValue = $(this).val();
        const convertedValue = convertEmojis(originalValue);

        if (convertedValue !== originalValue) {
            $(this).val(convertedValue);
            // Adjust cursor position (emojis are shorter than :name:)
            const diff = originalValue.length - convertedValue.length;
            this.setSelectionRange(cursorPos - diff, cursorPos - diff);
        }
    });

    console.log("Answer input hooked successfully!");
}

function convertEmojis(text) {
    // Replace all :emoji_name: patterns with actual emojis
    return text.replace(/:([a-z0-9_]+):/gi, (match, emojiName) => {
        const lowerName = emojiName.toLowerCase();
        return emojiMap[lowerName] || match;
    });
}
