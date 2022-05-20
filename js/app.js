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
    function add_money(count, block, delay, delay_off) {
        setTimeout((() => {
            document.querySelectorAll(block).forEach((el => el.textContent = +sessionStorage.getItem("money") + count));
            document.querySelectorAll(block).forEach((el => el.classList.add("_anim-add-money")));
            sessionStorage.setItem("money", +sessionStorage.getItem("money") + count);
        }), delay);
        setTimeout((() => {
            document.querySelectorAll(block).forEach((el => el.classList.remove("_anim-add-money")));
        }), delay_off);
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
        document.querySelector(".shop__body").classList.add("_active");
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
        arr_collision: [],
        count_win: 0,
        max_bet: 0
    };
    let script_images = document.querySelectorAll(".cards-game__image");
    let table_rows = document.querySelectorAll(".table__row");
    if (document.querySelector(".game")) {
        write_card_tail();
        write_button_text();
        document.querySelector(".game__body").classList.add("_active");
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
    function create_cards() {
        for (let i = 0; i < 5; i++) get_random_number(1);
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
    function create_write_card(arr, count) {
        let card = arr[count];
        let block = document.createElement("img");
        if (document.documentElement.classList.contains("webp")) block.setAttribute("src", `img/cards/${card}.webp`); else block.setAttribute("src", `img/cards/${card}.png`);
        block.setAttribute("data-number", card);
        block.setAttribute("alt", "Image");
        block.classList.add("tail");
        return block;
    }
    function create_change_cards() {
        config_game.arr_collision = [];
        setTimeout((() => {
            document.querySelectorAll(".cards-game__image img").forEach((el => {
                if (!el.closest("._selected") && el.classList.contains("tail")) el.remove();
            }));
        }), 500);
        script_images.forEach(((el, i) => {
            if (!el.classList.contains("_selected")) {
                el.classList.remove("_rotate");
                el.classList.add("_unrotate");
                get_random_number(2, i);
                setTimeout((() => {
                    script_images[i].append(create_write_card(config_game.card_current_arr, i));
                    el.classList.remove("_unrotate");
                    el.dataset.number = config_game.card_numbers[i];
                    el.dataset.suit = config_game.card_suits[i];
                    setTimeout((() => {
                        el.classList.add("_rotate");
                    }), 200);
                }), 500);
            }
        }));
    }
    function get_random_number(mode, index) {
        let arr = [ "a", "a", "a", "a", "b", "b", "b", "b", "c", "c", "c", "c", "d", "d", "d", "d", "j" ];
        let suit_number = get_random(0, 17);
        let card_suit = arr[suit_number];
        let card_number = get_random(2, 15);
        let card = "";
        if ("j" == card_suit) {
            card = "15-j";
            card_number = 15;
            card_suit = "j";
        } else card = `${card_number}-${card_suit}`;
        if (config_game.card_current_arr.includes(card)) return get_random_number(mode, index);
        if (1 == mode) {
            config_game.card_numbers.push(card_number);
            config_game.card_suits.push(card_suit);
            config_game.card_current_arr.push(card);
        } else if (2 == mode) {
            config_game.card_numbers[index] = card_number;
            config_game.card_suits[index] = card_suit;
            config_game.card_current_arr[index] = card;
        }
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
    function check_collisions() {
        let arr_sort = config_game.card_numbers.map((function(el) {
            return this.splice(this.indexOf(Math.min(...this)), 1)[0];
        }), config_game.card_numbers.slice());
        if (config_game.card_suits[0] == config_game.card_suits[1] && config_game.card_suits[1] == config_game.card_suits[2] && config_game.card_suits[2] == config_game.card_suits[3] && config_game.card_suits[3] == config_game.card_suits[4]) if ((10 == config_game.card_numbers[0] || 11 == config_game.card_numbers[0] || 12 == config_game.card_numbers[0] || 13 == config_game.card_numbers[0] || 14 == config_game.card_numbers[0]) && (10 == config_game.card_numbers[1] || 11 == config_game.card_numbers[1] || 12 == config_game.card_numbers[1] || 13 == config_game.card_numbers[1] || 14 == config_game.card_numbers[1]) && (10 == config_game.card_numbers[2] || 11 == config_game.card_numbers[2] || 12 == config_game.card_numbers[2] || 13 == config_game.card_numbers[2] || 14 == config_game.card_numbers[2]) && (10 == config_game.card_numbers[3] || 11 == config_game.card_numbers[3] || 12 == config_game.card_numbers[3] || 13 == config_game.card_numbers[3] || 14 == config_game.card_numbers[3]) && (10 == config_game.card_numbers[4] || 11 == config_game.card_numbers[4] || 12 == config_game.card_numbers[4] || 13 == config_game.card_numbers[4] || 14 == config_game.card_numbers[4])) {
            config_game.count_win = 750 * +sessionStorage.getItem("current-bet");
            document.querySelector(".footer-game__count-win").textContent = config_game.count_win;
            setTimeout((() => {
                document.querySelector(".footer-game__win-box-inner").classList.add("_active");
            }), 1e3);
            config_game.max_bet = 1;
            config_game.count_collision = 1;
            script_images.forEach((el => {
                el.append(create_coin());
                el.classList.add("_selected");
            }));
            table_rows.forEach((el => {
                if (11 == el.dataset.prize) el.classList.add("_active");
            }));
            return false;
        }
        if (config_game.card_numbers[0] == config_game.card_numbers[1] && config_game.card_numbers[1] == config_game.card_numbers[2] && config_game.card_numbers[2] == config_game.card_numbers[3] || config_game.card_numbers[0] == config_game.card_numbers[2] && config_game.card_numbers[2] == config_game.card_numbers[3] && config_game.card_numbers[3] == config_game.card_numbers[4] || config_game.card_numbers[1] == config_game.card_numbers[2] && config_game.card_numbers[2] == config_game.card_numbers[3] && config_game.card_numbers[3] == config_game.card_numbers[4] || config_game.card_numbers[0] == config_game.card_numbers[1] && config_game.card_numbers[1] == config_game.card_numbers[3] && config_game.card_numbers[3] == config_game.card_numbers[4] || config_game.card_numbers[0] == config_game.card_numbers[1] && config_game.card_numbers[1] == config_game.card_numbers[2] && config_game.card_numbers[2] == config_game.card_numbers[4]) if (15 == config_game.card_numbers[0] || 15 == config_game.card_numbers[1] || 15 == config_game.card_numbers[2] || 15 == config_game.card_numbers[3] || 15 == config_game.card_numbers[4]) {
            config_game.count_win = 200 * +sessionStorage.getItem("current-bet");
            document.querySelector(".footer-game__count-win").textContent = config_game.count_win;
            setTimeout((() => {
                document.querySelector(".footer-game__win-box-inner").classList.add("_active");
            }), 1e3);
            config_game.max_bet = 1;
            config_game.count_collision = 1;
            script_images.forEach((el => {
                el.append(create_coin());
                el.classList.add("_selected");
            }));
            table_rows.forEach((el => {
                if (10 == el.dataset.prize) el.classList.add("_active");
            }));
            return false;
        }
        if (config_game.card_suits[0] == config_game.card_suits[1] && config_game.card_suits[1] == config_game.card_suits[2] && config_game.card_suits[2] == config_game.card_suits[3] || config_game.card_suits[0] == config_game.card_suits[2] && config_game.card_suits[2] == config_game.card_suits[3] && config_game.card_suits[3] == config_game.card_suits[4] || config_game.card_suits[1] == config_game.card_suits[2] && config_game.card_suits[2] == config_game.card_suits[3] && config_game.card_suits[3] == config_game.card_suits[4] || config_game.card_suits[0] == config_game.card_suits[1] && config_game.card_suits[1] == config_game.card_suits[3] && config_game.card_suits[3] == config_game.card_suits[4] || config_game.card_suits[0] == config_game.card_suits[1] && config_game.card_suits[1] == config_game.card_suits[2] && config_game.card_suits[2] == config_game.card_suits[4]) if ((11 == config_game.card_numbers[0] || 12 == config_game.card_numbers[0] || 13 == config_game.card_numbers[0] || 14 == config_game.card_numbers[0] || 15 == config_game.card_numbers[0]) && (11 == config_game.card_numbers[1] || 12 == config_game.card_numbers[1] || 13 == config_game.card_numbers[1] || 14 == config_game.card_numbers[1] || 15 == config_game.card_numbers[1]) && (11 == config_game.card_numbers[2] || 12 == config_game.card_numbers[2] || 13 == config_game.card_numbers[2] || 14 == config_game.card_numbers[2] || 15 == config_game.card_numbers[2]) && (11 == config_game.card_numbers[3] || 12 == config_game.card_numbers[3] || 13 == config_game.card_numbers[3] || 14 == config_game.card_numbers[3] || 15 == config_game.card_numbers[3]) && (11 == config_game.card_numbers[4] || 12 == config_game.card_numbers[4] || 13 == config_game.card_numbers[4] || 14 == config_game.card_numbers[4] || 15 == config_game.card_numbers[4])) {
            config_game.count_win = 100 * +sessionStorage.getItem("current-bet");
            document.querySelector(".footer-game__count-win").textContent = config_game.count_win;
            setTimeout((() => {
                document.querySelector(".footer-game__win-box-inner").classList.add("_active");
            }), 1e3);
            config_game.max_bet = 1;
            config_game.count_collision = 1;
            script_images.forEach((el => {
                el.append(create_coin());
                el.classList.add("_selected");
            }));
            table_rows.forEach((el => {
                if (9 == el.dataset.prize) el.classList.add("_active");
            }));
            return false;
        }
        if (arr_sort[0] == arr_sort[1] - 1 && arr_sort[0] == arr_sort[2] - 2 && arr_sort[0] == arr_sort[3] - 3 && arr_sort[0] == arr_sort[4] - 4) if (config_game.card_suits[0] == config_game.card_suits[1] && config_game.card_suits[1] == config_game.card_suits[2] && config_game.card_suits[2] == config_game.card_suits[3] && config_game.card_suits[3] == config_game.card_suits[4]) {
            config_game.count_win = 50 * +sessionStorage.getItem("current-bet");
            document.querySelector(".footer-game__count-win").textContent = config_game.count_win;
            setTimeout((() => {
                document.querySelector(".footer-game__win-box-inner").classList.add("_active");
            }), 1e3);
            config_game.max_bet = 1;
            config_game.count_collision = 1;
            script_images.forEach((el => {
                el.append(create_coin());
                el.classList.add("_selected");
            }));
            table_rows.forEach((el => {
                if (8 == el.dataset.prize) el.classList.add("_active");
            }));
            return false;
        }
        if (config_game.card_numbers[0] == config_game.card_numbers[1] && config_game.card_numbers[1] == config_game.card_numbers[2] && config_game.card_numbers[2] == config_game.card_numbers[3] || config_game.card_numbers[0] == config_game.card_numbers[2] && config_game.card_numbers[2] == config_game.card_numbers[3] && config_game.card_numbers[3] == config_game.card_numbers[4] || config_game.card_numbers[1] == config_game.card_numbers[2] && config_game.card_numbers[2] == config_game.card_numbers[3] && config_game.card_numbers[3] == config_game.card_numbers[4] || config_game.card_numbers[0] == config_game.card_numbers[1] && config_game.card_numbers[1] == config_game.card_numbers[3] && config_game.card_numbers[3] == config_game.card_numbers[4] || config_game.card_numbers[0] == config_game.card_numbers[1] && config_game.card_numbers[1] == config_game.card_numbers[2] && config_game.card_numbers[2] == config_game.card_numbers[4]) {
            config_game.count_win = 17 * +sessionStorage.getItem("current-bet");
            document.querySelector(".footer-game__count-win").textContent = config_game.count_win;
            setTimeout((() => {
                document.querySelector(".footer-game__win-box-inner").classList.add("_active");
            }), 1e3);
            table_rows.forEach((el => {
                if (7 == el.dataset.prize) el.classList.add("_active");
            }));
            config_game.count_collision = 1;
            if (config_game.card_numbers[0] == config_game.card_numbers[1]) config_game.arr_collision.push(config_game.card_numbers[0]); else if (config_game.card_numbers[1] == config_game.card_numbers[2]) config_game.arr_collision.push(config_game.card_numbers[1]);
            script_images.forEach((el => {
                if (el.dataset.number == config_game.arr_collision[0]) {
                    el.append(create_coin());
                    el.classList.add("_selected");
                }
            }));
            return false;
        }
        if (config_game.card_numbers[0] == config_game.card_numbers[1] && config_game.card_numbers[1] == config_game.card_numbers[2] || config_game.card_numbers[0] == config_game.card_numbers[1] && config_game.card_numbers[1] == config_game.card_numbers[3] || config_game.card_numbers[0] == config_game.card_numbers[1] && config_game.card_numbers[1] == config_game.card_numbers[4] || config_game.card_numbers[0] == config_game.card_numbers[2] && config_game.card_numbers[2] == config_game.card_numbers[3] || config_game.card_numbers[0] == config_game.card_numbers[2] && config_game.card_numbers[2] == config_game.card_numbers[4] || config_game.card_numbers[0] == config_game.card_numbers[3] && config_game.card_numbers[3] == config_game.card_numbers[4] || config_game.card_numbers[1] == config_game.card_numbers[2] && config_game.card_numbers[2] == config_game.card_numbers[3] || config_game.card_numbers[1] == config_game.card_numbers[2] && config_game.card_numbers[2] == config_game.card_numbers[4] || config_game.card_numbers[1] == config_game.card_numbers[3] && config_game.card_numbers[3] == config_game.card_numbers[4] || config_game.card_numbers[2] == config_game.card_numbers[3] && config_game.card_numbers[3] == config_game.card_numbers[4]) if (arr_sort[0] == arr_sort[1] && arr_sort[1] == arr_sort[2] && arr_sort[3] == arr_sort[4] || arr_sort[2] == arr_sort[3] && arr_sort[3] == arr_sort[4] && arr_sort[0] == arr_sort[1]) {
            config_game.arr_collision.push(arr_sort[2]);
            script_images.forEach((el => {
                el.append(create_coin());
                el.classList.add("_selected");
            }));
            config_game.count_win = 7 * +sessionStorage.getItem("current-bet");
            document.querySelector(".footer-game__count-win").textContent = config_game.count_win;
            setTimeout((() => {
                document.querySelector(".footer-game__win-box-inner").classList.add("_active");
            }), 1e3);
            table_rows.forEach((el => {
                if (6 == el.dataset.prize) el.classList.add("_active");
            }));
            config_game.max_bet = 1;
            config_game.count_collision = 1;
            return false;
        }
        if (config_game.card_suits[0] == config_game.card_suits[1] && config_game.card_suits[1] == config_game.card_suits[2] && config_game.card_suits[2] == config_game.card_suits[3] && config_game.card_suits[3] == config_game.card_suits[4]) {
            config_game.count_win = 5 * +sessionStorage.getItem("current-bet");
            document.querySelector(".footer-game__count-win").textContent = config_game.count_win;
            setTimeout((() => {
                document.querySelector(".footer-game__win-box-inner").classList.add("_active");
            }), 1e3);
            config_game.max_bet = 1;
            config_game.count_collision = 1;
            script_images.forEach((el => {
                el.append(create_coin());
                el.classList.add("_selected");
            }));
            table_rows.forEach((el => {
                if (5 == el.dataset.prize) el.classList.add("_active");
            }));
            return false;
        }
        if (arr_sort[0] == arr_sort[1] - 1 && arr_sort[0] == arr_sort[2] - 2 && arr_sort[0] == arr_sort[3] - 3 && arr_sort[0] == arr_sort[4] - 4) {
            config_game.count_win = 4 * +sessionStorage.getItem("current-bet");
            document.querySelector(".footer-game__count-win").textContent = config_game.count_win;
            setTimeout((() => {
                document.querySelector(".footer-game__win-box-inner").classList.add("_active");
            }), 1e3);
            config_game.max_bet = 1;
            config_game.count_collision = 1;
            script_images.forEach((el => {
                el.append(create_coin());
                el.classList.add("_selected");
            }));
            table_rows.forEach((el => {
                if (4 == el.dataset.prize) el.classList.add("_active");
            }));
            return false;
        }
        if (config_game.card_numbers[0] == config_game.card_numbers[1] && config_game.card_numbers[1] == config_game.card_numbers[2] || config_game.card_numbers[0] == config_game.card_numbers[1] && config_game.card_numbers[1] == config_game.card_numbers[3] || config_game.card_numbers[0] == config_game.card_numbers[1] && config_game.card_numbers[1] == config_game.card_numbers[4] || config_game.card_numbers[0] == config_game.card_numbers[2] && config_game.card_numbers[2] == config_game.card_numbers[3] || config_game.card_numbers[0] == config_game.card_numbers[2] && config_game.card_numbers[2] == config_game.card_numbers[4] || config_game.card_numbers[0] == config_game.card_numbers[3] && config_game.card_numbers[3] == config_game.card_numbers[4] || config_game.card_numbers[1] == config_game.card_numbers[2] && config_game.card_numbers[2] == config_game.card_numbers[3] || config_game.card_numbers[1] == config_game.card_numbers[2] && config_game.card_numbers[2] == config_game.card_numbers[4] || config_game.card_numbers[1] == config_game.card_numbers[3] && config_game.card_numbers[3] == config_game.card_numbers[4] || config_game.card_numbers[2] == config_game.card_numbers[3] && config_game.card_numbers[3] == config_game.card_numbers[4]) if (arr_sort[0] == arr_sort[1] && arr_sort[1] == arr_sort[2] || arr_sort[2] == arr_sort[3] && arr_sort[3] == arr_sort[4] || arr_sort[1] == arr_sort[2] && arr_sort[2] == arr_sort[3]) {
            config_game.arr_collision.push(arr_sort[2]);
            script_images.forEach((el => {
                if (el.dataset.number == config_game.arr_collision[0]) {
                    el.append(create_coin());
                    el.classList.add("_selected");
                }
            }));
            config_game.count_win = 3 * +sessionStorage.getItem("current-bet");
            document.querySelector(".footer-game__count-win").textContent = config_game.count_win;
            setTimeout((() => {
                document.querySelector(".footer-game__win-box-inner").classList.add("_active");
            }), 1e3);
            table_rows.forEach((el => {
                if (3 == el.dataset.prize) el.classList.add("_active");
            }));
            config_game.count_collision = 1;
            return false;
        }
        if (arr_sort[0] == arr_sort[1] && arr_sort[2] == arr_sort[3] || arr_sort[1] == arr_sort[2] && arr_sort[3] == arr_sort[4] || arr_sort[0] == arr_sort[1] && arr_sort[3] == arr_sort[4]) {
            config_game.arr_collision.push(arr_sort[1]);
            config_game.arr_collision.push(arr_sort[3]);
            script_images.forEach((el => {
                if (el.dataset.number == config_game.arr_collision[0] || el.dataset.number == config_game.arr_collision[1]) {
                    el.append(create_coin());
                    el.classList.add("_selected");
                }
            }));
            config_game.count_win = 2 * +sessionStorage.getItem("current-bet");
            document.querySelector(".footer-game__count-win").textContent = config_game.count_win;
            setTimeout((() => {
                document.querySelector(".footer-game__win-box-inner").classList.add("_active");
            }), 1e3);
            table_rows.forEach((el => {
                if (2 == el.dataset.prize) el.classList.add("_active");
            }));
            config_game.count_collision = 1;
            return false;
        }
        if (arr_sort[0] == arr_sort[1]) config_game.arr_collision.push(arr_sort[0]); else if (arr_sort[1] == arr_sort[2]) config_game.arr_collision.push(arr_sort[1]); else if (arr_sort[2] == arr_sort[3]) config_game.arr_collision.push(arr_sort[2]); else if (arr_sort[3] == arr_sort[4]) config_game.arr_collision.push(arr_sort[3]);
        if (config_game.arr_collision.length > 0) {
            script_images.forEach((el => {
                if (el.dataset.number == config_game.arr_collision[0]) {
                    el.append(create_coin());
                    el.classList.add("_selected");
                }
            }));
            config_game.count_win = 1 * +sessionStorage.getItem("current-bet");
            document.querySelector(".footer-game__count-win").textContent = config_game.count_win;
            setTimeout((() => {
                document.querySelector(".footer-game__win-box-inner").classList.add("_active");
            }), 1e3);
            table_rows.forEach((el => {
                if (1 == el.dataset.prize) el.classList.add("_active");
            }));
            config_game.count_collision = 1;
            return false;
        }
    }
    function find_cards_without_collision() {
        script_images.forEach((el => {
            if (!el.classList.contains("_selected")) el.classList.add("_not-active");
        }));
    }
    function create_coin() {
        let coin = document.createElement("div");
        coin.classList.add("cards-game__coin");
        setTimeout((() => {
            coin.classList.add("_active");
        }), 500);
        let image = document.createElement("img");
        image.setAttribute("src", `img/icons/coin-3.png`);
        coin.append(image);
        return coin;
    }
    function draw_inner_draw_button() {
        config_game.program = 2;
        write_button_text();
    }
    function draw_inner_collect_button() {
        let images_2 = [];
        script_images.forEach((el => {
            if (!el.classList.contains("_selected") && config_game.count_collision > 0) images_2.push(el);
        }));
        if (images_2.length > 0 || 1 == config_game.max_bet) config_game.program = 3; else config_game.program = 1;
        write_button_text();
    }
    function reset_game() {
        document.querySelectorAll(".cards-game__image img").forEach((el => {
            if (el.classList.contains("tail")) el.remove();
        }));
        document.querySelector(".block-bet").classList.remove("_hold");
        config_game.program = 1;
        config_game.card_current_arr = [];
        config_game.card_numbers = [];
        config_game.card_suits = [];
        config_game.count_collision = 0;
        config_game.arr_collision = [];
        config_game.arr_index = [];
        config_game.max_bet = 0;
        document.querySelectorAll(".cards-game__image").forEach((el => el.classList.remove("_rotate")));
        document.querySelectorAll(".cards-game__image").forEach((el => {
            el.removeAttribute("data-number");
            el.removeAttribute("data-suit");
            if (el.classList.contains("_not-active")) el.classList.remove("_not-active");
            if (el.classList.contains("_selected")) el.classList.remove("_selected");
        }));
        write_button_text();
        if (document.querySelector(".footer-game__win-box-inner").classList.contains("_active")) document.querySelector(".footer-game__win-box-inner").classList.remove("_active");
        if (document.querySelector(".cards-game__coin")) document.querySelectorAll(".cards-game__coin").forEach((el => el.remove()));
        if (document.querySelector(".table__row")) table_rows.forEach((el => {
            if (el.classList.contains("_active")) el.classList.remove("_active");
        }));
    }
    function check_bet() {
        if (+sessionStorage.getItem("current-bet") > +sessionStorage.getItem("money")) {
            sessionStorage.setItem("current-bet", 1);
            document.querySelector(".block-bet__coins").textContent = sessionStorage.getItem("current-bet");
        }
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
            if (current_bet > 1) {
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
        if (targetElement.closest(".cards-game__button") && 1 == targetElement.closest(".cards-game__button").dataset.target) if (+sessionStorage.getItem("money") >= +sessionStorage.getItem("current-bet")) {
            document.querySelector(".cards-game__button").classList.add("_hide");
            delete_money(+sessionStorage.getItem("current-bet"), ".check");
            reset_game();
            create_cards();
            document.querySelector(".block-bet").classList.add("_hold");
            setTimeout((() => {
                show_cards();
            }), 1e3);
            setTimeout((() => {
                check_collisions();
                if (0 == config_game.max_bet) draw_inner_draw_button(); else draw_inner_collect_button();
                document.querySelector(".cards-game__button").classList.remove("_hide");
            }), 3e3);
        } else no_money(".check");
        if (targetElement.closest(".cards-game__button") && 2 == targetElement.closest(".cards-game__button").dataset.target) {
            document.querySelector(".cards-game__button").classList.add("_hide");
            setTimeout((() => {
                create_change_cards();
                if (document.querySelector(".cards-game__coin")) document.querySelectorAll(".cards-game__coin").forEach((el => el.remove()));
                if (document.querySelector(".table__row")) table_rows.forEach((el => {
                    if (el.classList.contains("_active")) el.classList.remove("_active");
                }));
            }), 1e3);
            setTimeout((() => {
                check_collisions();
                draw_inner_collect_button();
                find_cards_without_collision();
                check_bet();
                document.querySelector(".cards-game__button").classList.remove("_hide");
            }), 3e3);
        }
        if (targetElement.closest(".cards-game__button") && 3 == targetElement.closest(".cards-game__button").dataset.target) {
            document.querySelector(".cards-game__button").classList.add("_hide");
            add_money(config_game.count_win, ".check", 1e3, 2e3);
            setTimeout((() => {
                reset_game();
            }), 500);
            setTimeout((() => {
                document.querySelector(".cards-game__button").classList.remove("_hide");
            }), 1e3);
        }
    }));
    window["FLS"] = true;
    isWebp();
})();