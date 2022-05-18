(() => {
    "use strict";
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(2 == webP.height);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = true === support ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    window.addEventListener("load", (function() {
        if (document.querySelector("body")) setTimeout((function() {
            document.querySelector("body").classList.add("_loaded");
        }), 200);
    }));
    if (sessionStorage.getItem("preloader")) {
        if (document.querySelector(".preloader")) document.querySelector(".preloader").classList.add("_hide");
        document.querySelector(".wrapper").classList.add("_visible");
    }
    if (sessionStorage.getItem("money")) {
        if (document.querySelector(".check")) document.querySelector(".check").textContent = sessionStorage.getItem("money");
    } else {
        sessionStorage.setItem("money", 15);
        if (document.querySelector(".check")) document.querySelector(".check").textContent = sessionStorage.getItem("money");
    }
    if (document.querySelector(".game")) if (+sessionStorage.getItem("money") >= 1) {
        document.querySelector(".block-bet__coins").textContent = 1;
        sessionStorage.setItem("current-bet", 1);
    } else {
        document.querySelector(".block-bet__coins").textContent = 0;
        sessionStorage.setItem("current-bet", 0);
    }
    if (!sessionStorage.getItem("current-card")) sessionStorage.setItem("current-card", 2);
    const preloader = document.querySelector(".preloader");
    const wrapper = document.querySelector(".wrapper");
    function delete_money(count, block) {
        let money = +sessionStorage.getItem("money");
        sessionStorage.setItem("money", money - count);
        setTimeout((() => {
            document.querySelectorAll(block).forEach((el => el.classList.add("_delete-money")));
            document.querySelectorAll(block).forEach((el => el.textContent = sessionStorage.getItem("money")));
        }), 500);
        setTimeout((() => {
            document.querySelectorAll(block).forEach((el => el.classList.remove("_delete-money")));
        }), 1500);
    }
    function no_money(block) {
        document.querySelectorAll(block).forEach((el => el.classList.add("_no-money")));
        setTimeout((() => {
            document.querySelectorAll(block).forEach((el => el.classList.remove("_no-money")));
        }), 1e3);
    }
    function get_random(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }
    let anim_items = document.querySelectorAll(".icon-anim img");
    function get_random_animate() {
        let number = get_random(0, 3);
        let arr = [ "jump", "scale", "rotate" ];
        let random_item = get_random(0, anim_items.length);
        anim_items.forEach((el => {
            if (el.classList.contains("_anim-icon-jump")) el.classList.remove("_anim-icon-jump"); else if (el.classList.contains("_anim-icon-scale")) el.classList.remove("_anim-icon-scale"); else if (el.classList.contains("_anim-icon-rotate")) el.classList.remove("_anim-icon-rotate");
        }));
        setTimeout((() => {
            anim_items[random_item].classList.add(`_anim-icon-${arr[number]}`);
        }), 100);
    }
    if (document.querySelector(".icon-anim img")) setInterval((() => {
        get_random_animate();
    }), 1e4);
    if (document.querySelector(".main") && document.querySelector(".preloader").classList.contains("_hide")) document.querySelector(".main").classList.add("_active");
    const config_shop = {
        price_card_1: 7,
        price_card_3: 12
    };
    if (document.querySelector(".shop")) {
        let number = 2;
        if (sessionStorage.getItem("current-card")) number = sessionStorage.getItem("current-card");
        create_pin(number);
        if (sessionStorage.getItem("card-1")) delete_inner_button(1);
        if (sessionStorage.getItem("card-3")) delete_inner_button(3);
    }
    function choice_card(number, item) {
        if (sessionStorage.getItem(`card-${number}`)) {
            sessionStorage.setItem("current-card", number);
            create_pin(number);
        } else if (+sessionStorage.getItem("money") >= item) {
            sessionStorage.setItem(`card-${number}`, true);
            setTimeout((() => {
                delete_inner_button(number);
            }), 500);
            delete_money(item, ".check");
        } else if (+sessionStorage.getItem("money") < item) no_money(".check");
    }
    function delete_inner_button(number) {
        document.querySelector(`.cards__button_${number}`).remove();
        let item = document.createElement("div");
        item.classList.add("cards__button");
        item.classList.add("button");
        let text = document.createElement("p");
        text.classList.add("text");
        text.textContent = "select";
        item.append(text);
        document.querySelector(`.cards__item_${number}`).append(item);
    }
    function create_pin(number) {
        if (document.querySelector(".cards__pin")) document.querySelector(".cards__pin").remove();
        let item = document.createElement("div");
        item.classList.add("cards__pin");
        let image = document.createElement("img");
        image.setAttribute("src", `img/icons/check-mark.png`);
        image.setAttribute("alt", "Icon");
        item.append(image);
        document.querySelector(`.cards__image_${number}`).append(item);
    }
    const config_game = {
        program: 1,
        card_current_arr: [],
        card_numbers: [],
        card_suits: [],
        count_collision: 0,
        arr_collision: []
    };
    let script_images = document.querySelectorAll(".cards-game__image");
    if (document.querySelector(".game")) {
        write_card_tail();
        write_button_text();
    }
    function write_button_text() {
        document.querySelector(".cards-game__icon").remove();
        document.querySelector(".cards-game__text").remove();
        let state = config_game.program;
        let item_icon = document.createElement("div");
        item_icon.classList.add("cards-game__icon");
        let icon = document.createElement("img");
        icon.setAttribute("src", "img/icons/deal-icon.svg");
        if (2 == state) icon.setAttribute("src", "img/icons/draw-icon.svg"); else if (3 == state) icon.setAttribute("src", "img/icons/collect-icon.svg");
        item_icon.append(icon);
        let text = document.createElement("div");
        text.classList.add("cards-game__text");
        text.textContent = "deal";
        document.querySelector(".cards-game__button").dataset.target = 1;
        if (2 == state) {
            text.textContent = "draw";
            document.querySelector(".cards-game__button").dataset.target = 2;
        } else if (3 == state) {
            text.textContent = "collect";
            document.querySelector(".cards-game__button").dataset.target = 3;
        }
        document.querySelector(".cards-game__inner").append(item_icon, text);
    }
    function write_card_tail() {
        let head = +sessionStorage.getItem("current-card");
        let image_1 = document.createElement("img");
        image_1.setAttribute("src", `img/cards/card-bg-${head}.png`);
        image_1.setAttribute("alt", `Icon`);
        image_1.classList.add("head");
        let image_2 = document.createElement("img");
        image_2.setAttribute("src", `img/cards/card-bg-${head}.png`);
        image_2.setAttribute("alt", `Icon`);
        image_2.classList.add("head");
        let image_3 = document.createElement("img");
        image_3.setAttribute("src", `img/cards/card-bg-${head}.png`);
        image_3.setAttribute("alt", `Icon`);
        image_3.classList.add("head");
        let image_4 = document.createElement("img");
        image_4.setAttribute("src", `img/cards/card-bg-${head}.png`);
        image_4.setAttribute("alt", `Icon`);
        image_4.classList.add("head");
        let image_5 = document.createElement("img");
        image_5.setAttribute("src", `img/cards/card-bg-${head}.png`);
        image_5.setAttribute("alt", `Icon`);
        image_5.classList.add("head");
        document.querySelectorAll(".cards-game__image").forEach(((el, i) => {
            if (0 == i) el.append(image_1); else if (1 == i) el.append(image_2); else if (2 == i) el.append(image_3); else if (3 == i) el.append(image_4); else if (4 == i) el.append(image_5);
        }));
    }
    function create_write_card(arr, count) {
        let card = arr[count];
        let block = document.createElement("img");
        block.setAttribute("src", `img/cards/${card}.png`);
        block.setAttribute("data-number", card);
        block.setAttribute("alt", "Image");
        block.classList.add("tail");
        return block;
    }
    function create_cards() {
        get_random_number();
        get_random_number();
        get_random_number();
        get_random_number();
        get_random_number();
        let images = document.querySelectorAll(".cards-game__image");
        images[0].append(create_write_card(config_game.card_current_arr, 0));
        images[0].dataset.number = config_game.card_numbers[0];
        images[0].dataset.suit = config_game.card_suits[0];
        images[1].append(create_write_card(config_game.card_current_arr, 1));
        images[1].dataset.number = config_game.card_numbers[1];
        images[1].dataset.suit = config_game.card_suits[1];
        images[2].append(create_write_card(config_game.card_current_arr, 2));
        images[2].dataset.number = config_game.card_numbers[2];
        images[2].dataset.suit = config_game.card_suits[2];
        images[3].append(create_write_card(config_game.card_current_arr, 3));
        images[3].dataset.number = config_game.card_numbers[3];
        images[3].dataset.suit = config_game.card_suits[3];
        images[4].append(create_write_card(config_game.card_current_arr, 4));
        images[4].dataset.number = config_game.card_numbers[4];
        images[4].dataset.suit = config_game.card_suits[4];
    }
    function get_random_number() {
        let arr = [ "a", "a", "a", "a", "b", "b", "b", "b", "c", "c", "c", "c", "d", "d", "d", "d", "j" ];
        let suit_number = get_random(1, 17);
        let card_suit = arr[suit_number];
        let card_number = get_random(2, 14);
        let card = "";
        if ("j" == card_suit) {
            card = "15-j";
            card_number = 15;
            card_suit = "j";
        } else card = `${card_number}-${card_suit}`;
        if (config_game.card_current_arr.includes(card)) return get_random_number();
        config_game.card_numbers.push(card_number);
        config_game.card_suits.push(card_suit);
        config_game.card_current_arr.push(card);
        return card;
    }
    function show_cards() {
        document.querySelectorAll(".cards-game__image").forEach(((el, i) => {
            if (0 == i) setTimeout((() => {
                el.classList.add("_rotate");
            }), 200); else if (1 == i) setTimeout((() => {
                el.classList.add("_rotate");
            }), 400); else if (2 == i) setTimeout((() => {
                el.classList.add("_rotate");
            }), 600); else if (3 == i) setTimeout((() => {
                el.classList.add("_rotate");
            }), 800); else if (4 == i) setTimeout((() => {
                el.classList.add("_rotate");
            }), 1e3);
        }));
    }
    function check_collisions_1() {
        let images = document.querySelectorAll(".cards-game__image");
        if (config_game.card_numbers[0] == config_game.card_numbers[1] || config_game.card_numbers[0] == config_game.card_numbers[2] || config_game.card_numbers[0] == config_game.card_numbers[3] || config_game.card_numbers[0] == config_game.card_numbers[4]) {
            console.log("Первая  карты равны");
            config_game.count_collision += 1;
            config_game.arr_collision.push(config_game.card_numbers[0]);
        }
        if (config_game.card_numbers[1] == config_game.card_numbers[2] || config_game.card_numbers[1] == config_game.card_numbers[3] || config_game.card_numbers[1] == config_game.card_numbers[4]) {
            console.log("2 и  карты равны");
            config_game.count_collision += 1;
            config_game.arr_collision.push(config_game.card_numbers[1]);
        }
        if (config_game.card_numbers[2] == config_game.card_numbers[3] || config_game.card_numbers[2] == config_game.card_numbers[4]) {
            console.log("3 и  карты равны");
            config_game.count_collision += 1;
            config_game.arr_collision.push(config_game.card_numbers[2]);
        }
        if (config_game.card_numbers[3] == config_game.card_numbers[4]) {
            console.log("4 и  карты равны");
            config_game.count_collision += 1;
            config_game.arr_collision.push(config_game.card_numbers[3]);
        }
        images.forEach((el => {
            if (el.dataset.number == config_game.arr_collision[0]) {
                el.append(create_coin());
                el.classList.add("_selected");
            }
        }));
    }
    function create_coin() {
        let coin = document.createElement("div");
        coin.classList.add("cards-game__coin");
        let image = document.createElement("img");
        image.setAttribute("src", `img/icons/coin-3.png`);
        coin.append(image);
        return coin;
    }
    function draw_inner_button() {
        let images_2 = [];
        script_images.forEach((el => {
            if (!el.classList.contains("_selected") && config_game.count_collision > 0) {
                console.log(el);
                images_2.push(el);
            }
        }));
        console.log(images_2);
        if (images_2.length > 0) {
            config_game.program = 2;
            write_button_text();
        }
    }
    function reset_game() {
        config_game.program = 1;
        config_game.card_current_arr = [];
        config_game.card_numbers = [];
        config_game.card_suits = [];
        config_game.count_collision = 0;
        config_game.arr_collision = [];
        document.querySelectorAll(".cards-game__image").forEach((el => el.classList.remove("_rotate")));
    }
    document.addEventListener("click", (e => {
        let targetElement = e.target;
        if (targetElement.closest(".preloader__button")) {
            sessionStorage.setItem("preloader", true);
            preloader.classList.add("_hide");
            wrapper.classList.add("_visible");
            if (document.querySelector(".main") && document.querySelector(".preloader").classList.contains("_hide")) document.querySelector(".main").classList.add("_active");
        }
        if (targetElement.closest(".block-bet__minus")) {
            let current_bet = +sessionStorage.getItem("current-bet");
            if (current_bet >= 1) {
                sessionStorage.setItem("current-bet", current_bet - 1);
                document.querySelector(".block-bet__coins").textContent = sessionStorage.getItem("current-bet");
            }
        }
        if (targetElement.closest(".block-bet__plus")) {
            let current_bet = +sessionStorage.getItem("current-bet");
            let current_bank = +sessionStorage.getItem("money");
            if (current_bank - 1 > current_bet) {
                if (current_bet < 5) {
                    sessionStorage.setItem("current-bet", current_bet + 1);
                    document.querySelector(".block-bet__coins").textContent = sessionStorage.getItem("current-bet");
                }
            } else no_money(".check");
        }
        if (targetElement.closest(".cards__button") && targetElement.closest(".cards__item_1")) choice_card(1, config_shop.price_card_1);
        if (targetElement.closest(".cards__button") && targetElement.closest(".cards__item_2")) {
            sessionStorage.setItem("current-card", 2);
            create_pin(2);
        }
        if (targetElement.closest(".cards__button") && targetElement.closest(".cards__item_3")) choice_card(3, config_shop.price_card_3);
        if (targetElement.closest(".cards-game__button") && 1 == targetElement.closest(".cards-game__button").dataset.target) {
            reset_game();
            create_cards();
            setTimeout((() => {
                show_cards();
            }), 1e3);
            setTimeout((() => {
                check_collisions_1();
                draw_inner_button();
            }), 3e3);
            setTimeout((() => {
                console.log(`config_game.arr_collision (здесь номера, которые совпали) - ${config_game.arr_collision}`);
                console.log(`config_game.card_numbers (здесь все номера выпавших карт) - ${config_game.card_numbers}`);
                console.log(`config_game.card_suits (здесь все масти выпавших карт) - ${config_game.card_suits}`);
                console.log(`config_game.count_collision (количество коллизий) - ${config_game.count_collision}`);
            }), 4e3);
        }
    }));
    window["FLS"] = true;
    isWebp();
})();