// window.alert("Прежде чем начать играть убедитесь, что у вас включена английская раскладка");

// en.keys == name-of-attrs
const en = {
  "exit-question": "Are you sure you want to exit?",
  "exit-yes": "Yes",
  "exit-no": "No",
  "main-local-2p-entre": "Local",
  "main-sets-entre": "Settings",
  "lang-sets-header": "Select language",
  "sets-lang-entre": "Language settings",
  "sets-input-entre": "Input setting",
  "sets-input-header": "Input settings",
  "sets-P1-header": "P1 input",
  "sets-P2-header": "P2 input",
  "sets-up": "Up",
  "sets-down": "Down",
  "sets-left": "Left",
  "sets-right": "Right",
  "sets-front-punch": "Front punch (1)",
  "sets-back-punch": "Back punch (2)",
  "sets-front-kick": "Front kick (3)",
  "sets-back-kick": "Back kick (4)",
  "sets-amplifier": "Amplifier/Interact",
  "sets-throw": "Throw",
  "sets-stance-change": "Stance change",
  "sets-block": "Block",
  "sets-save": "Save",
  "sets-reset": "Reset",
};
// ru.keys == name-of-attrs
const ru = {
  "exit-question": "Вы уверены, что хотите выйти?",
  "exit-yes": "Да",
  "exit-no": "Нет",
  "main-local-2p-entre": "Локальный",
  "main-sets-entre": "Настройки",
  "lang-sets-header": "Выберите язык",
  "sets-lang-entre": "Настройки языка",
  "sets-input-entre": "Настройки управления",
  "sets-input-header": "Настройки управления",
  "sets-P1-header": "Ввод игрока 1",
  "sets-P2-header": "Ввод игрока 2",
  "sets-up": "Вверх",
  "sets-down": "Вниз",
  "sets-left": "Влево",
  "sets-right": "Вправо",
  "sets-front-punch": "Легкий удар рукой",
  "sets-back-punch": "Тяжёлый удар рукой",
  "sets-front-kick": "Легкий удар ногой",
  "sets-back-kick": "Тяжёлый удар ногой",
  "sets-amplifier": "Усилить/Взаимодействовать",
  "sets-throw": "Бросок",
  "sets-stance-change": "Сменить стойку",
  "sets-block": "Блок",
  "sets-save": "Сохранить",
  "sets-reset": "По умолчанию",
};

// Окна
const mainSreen = document.querySelector(".main-window");
const selectCharsScreen = document.querySelector(".select-chars-window");
const inputSetsScreen = document.querySelector(".input-sets-window");
const exitScreen = document.querySelector(".exit");
const settingsScreen = document.querySelector(".settings-window");
const langSetsScreen = document.querySelector(".lang-sets-window");

// Массив окон
const screens_list = [
  mainSreen,
  selectCharsScreen,
  settingsScreen,
  exitScreen,
  inputSetsScreen,
  langSetsScreen,
];

// Пункты
const main_option_array = mainSreen.querySelectorAll(".nav-item"); // 1
const chars_array = selectCharsScreen.querySelectorAll(".nav-item"); // 2
const input_sets_array = inputSetsScreen.querySelectorAll(".profile .nav-item"); // 3
const yn_array = exitScreen.querySelectorAll(".nav-item"); // 4
const sets_array = settingsScreen.querySelectorAll(".nav-item"); // 5
const lang_sets_array = langSetsScreen.querySelectorAll(".nav-item"); // 6

// Язык
const data_i18n_elements = document.querySelectorAll("[data-i18n]");
const lang_status = langSetsScreen.querySelectorAll(
  ".lang-change-wrapper .lang-status"
);
const profiles__textContent_EN = [
  "Profile 1",
  "Profile 2",
  "Profile 3",
  "Profile 4",
];
const profiles__textContent_RU = [
  "Профиль 1",
  "Профиль 2",
  "Профиль 3",
  "Профиль 4",
];

// Ввод
const P1_navigation = inputSetsScreen.querySelectorAll(
  ".P1-input .profile .nav-item"
);
const P2_navigation = inputSetsScreen.querySelectorAll(
  ".P2-input .profile .nav-item"
);
const P1_new_keys = inputSetsScreen.querySelectorAll(".P1-input .key-value"); // Временное хранилище для новых клавиш P1 (элементы span)
const P2_new_keys = inputSetsScreen.querySelectorAll(".P2-input .key-value"); // Временное хранилище для новых клавиш P2 (элементы span)

const default_keys = [
  "w",
  "s",
  "a",
  "d",
  "j",
  "i",
  "k",
  "l",
  "o",
  "u",
  "p",
  ";",
];
const invalid_keys = [
  "Enter",
  "Escape",
  "Tab",
  "Shift",
  "Control",
  "Alt",
  "Meta",
  "CapsLock",
  "Backspace",
  "Delete",
  "ScrollLock",
  "End",
  "Insert",
  "Home",
  "PageUp",
  "PageDown",
  "Pause",
  "NumLock",
  "ContextMenu",
  "F1",
  "F2",
  "F3",
  "F4",
  "F5",
  "F6",
  "F7",
  "F8",
  "F9",
  "F10",
  "F11",
  "F12",
];

// Переменные:
// 1) для хранения текущего обработчика клавиш
// 2) для перемещения между опциями
// 3) для хранения выбранного индекса (персонажа)
// 4) для хранения выбранного языка
// 5) для хранения языка текущего профиля
// 6) для хранения текущего профиля
var currentKeyDownHandler = null,
  currentIndex = 0,
  selectedIndex = null,
  lang = "en",
  changeKeyValue = false,
  currentProfile_lang = localStorage.getItem("currentProfile_lang")
    ? JSON.parse(localStorage.getItem("currentProfile_lang"))
    : profiles__textContent_EN,
  P1_currentProfileIndex = localStorage.getItem("P1_currentProfileIndex")
    ? Number(localStorage.getItem("P1_currentProfileIndex"))
    : 0,
  P2_currentProfileIndex = localStorage.getItem("P2_currentProfileIndex")
    ? Number(localStorage.getItem("P2_currentProfileIndex"))
    : 0;

if (!localStorage.getItem("language")) {
  localStorage.setItem("language", lang);
}

// Обновляем язык интерфейса
changeLang();

// Начало при входе в игру
// goTo(mainSreen);

// Функция для сброса клавиш по умолчанию, ничего не сохраняет в localStorage а лишь показывает изменения
function reset_keys(keys) {
  for (let i = 0; i < keys.length; i++) {
    keys[i].textContent = default_keys[i];
  }
}
// Функция для смены профиля
function handleChangeProfile(to_side, array, playerProfileIndex) {
  if (to_side == "a" || to_side == "ArrowLeft") {
    playerProfileIndex -= 1; // to left
  } else if (to_side == "d" || to_side == "ArrowRight") {
    playerProfileIndex += 1; // to right
  }
  if (playerProfileIndex <= -1) {
    // from start to the end of array
    playerProfileIndex = currentProfile_lang.length - 1;
  } else if (playerProfileIndex >= currentProfile_lang.length) {
    // from end to the start of array
    playerProfileIndex = 0;
  }

  // show current profile
  array[0].textContent = currentProfile_lang[playerProfileIndex];

  // gives keys only from saved profile and shows them
  if (array == P1_navigation) {
    P1_currentProfileIndex = playerProfileIndex;
    const saved_profile = localStorage.getItem(
      `P1_profile${playerProfileIndex + 1}`
    )
      ? JSON.parse(localStorage.getItem(`P1_profile${playerProfileIndex + 1}`))
      : default_keys;
    // update profile keys
    P1_new_keys.forEach((el, i) => {
      el.textContent = saved_profile[i];
    });
  } else if (array == P2_navigation) {
    P2_currentProfileIndex = playerProfileIndex;
    const saved_profile = localStorage.getItem(
      `P2_profile${playerProfileIndex + 1}`
    )
      ? JSON.parse(localStorage.getItem(`P2_profile${playerProfileIndex + 1}`))
      : default_keys;
    // update profile keys
    P2_new_keys.forEach((el, i) => {
      el.textContent = saved_profile[i];
    });
  }
}
// Функция для смены языка
function changeLang() {
  switch (localStorage.getItem("language")) {
    case "en":
      // Присваиваем все соответствующие слова выбранного языка (английский) ко всем элементам массива "data_i18n_elements"
      data_i18n_elements.forEach((i) => {
        i.textContent = en[i.getAttribute("data-i18n")];
      });
      // Очищаем значение элементов "lang_status". *Значение обозначает выбранный язык
      lang_status.forEach((i) => {
        i.classList.remove("selected-lang");
        i.textContent = "";
      });
      // Записываем в localStorage английский язык профиля
      localStorage.setItem(
        "currentProfile_lang",
        JSON.stringify(profiles__textContent_EN)
      );
      // Обновляем текущий язык профиля на всякий случай
      currentProfile_lang = profiles__textContent_EN;
      // Обозначаем выбранный язык
      lang_status[0].textContent = "✓";
      break;
    case "ru":
      data_i18n_elements.forEach((i) => {
        i.textContent = ru[i.getAttribute("data-i18n")];
      });
      lang_status.forEach((i) => {
        i.classList.remove("selected-lang");
        i.textContent = "";
      });
      localStorage.setItem(
        "currentProfile_lang",
        JSON.stringify(profiles__textContent_RU)
      );
      currentProfile_lang = profiles__textContent_RU;
      lang_status[1].textContent = "✓";
      break;
    default:
      break;
  }
  // Тут мы просто обновляем состояние
  handleChangeProfile(null, P1_navigation, P1_currentProfileIndex);
  handleChangeProfile(null, P2_navigation, P2_currentProfileIndex);
}
// Функция для удаления текущего обработчика клавиш
function removeCurrentKeyDownHandler() {
  if (currentKeyDownHandler) {
    window.removeEventListener("keydown", currentKeyDownHandler);
    currentKeyDownHandler = null;
  }
}
// Функция для инициализации навигации при входе в новое окно
function onScreenSwitch_entrance(array, i, className, keyDownListener) {
  array[i].classList.add(className);
  window.addEventListener("keydown", keyDownListener);
  currentKeyDownHandler = keyDownListener;
}
// Функции для движения между опциями (передвижение осуществляется по эелементами массива), аргумент для инициализации класса типа *select
function handleMoveInOptions(array, className, to_side) {
  // *updated version - universal for any direction (left, right, up, down) 😁 (⭐solution!)
  array[currentIndex].classList.remove(className); // first remove class from previous option
  if (
    to_side == "a" ||
    to_side == "w" ||
    to_side == "ArrowLeft" ||
    to_side == "ArrowUp"
  )
    currentIndex -= 1; // to left & up
  else if (
    to_side == "d" ||
    to_side == "s" ||
    to_side == "ArrowRight" ||
    to_side == "ArrowDown"
  )
    currentIndex += 1; // to right & down
  if (currentIndex <= -1)
    currentIndex = array.length - 1; // from start to end of array
  else if (currentIndex >= array.length) currentIndex = 0; // from end to start of array
  array[currentIndex].classList.add(className); // last add a class to new option
}

// Основная логика управления с помощью клавиатуры (⚠️ Наверное нужно улучшить switch-case, тут их как-то слишком много. Первая идея: думаю нужно изменить код передвижения, точнее сделать всего один "window.addEventListaner("keydown", (e) => {})")
function goTo(activeScreen) {
  removeCurrentKeyDownHandler();
  currentIndex = 0;

  // Цикл для управления display: none || flex; (автоматизировано переходы между интерфейсов)
  for (let i = 0; i < screens_list.length; i++) {
    if (activeScreen == screens_list[i]) {
      screens_list[i].style.display = "flex";
      screens_list[i].style.opacity = "1";
      // console.log(`✅ ${screens_list[i].className}`);
      continue;
    }
    screens_list[i].style.opacity = "0";
    screens_list[i].style.display = "none";
    // console.log(`❌ ${screens_list[i].className}`);
  }

  switch (activeScreen) {
    case mainSreen:
      onScreenSwitch_entrance(
        main_option_array,
        currentIndex,
        "current-option-select",
        mainScreenKeydownHandler
      );
      function mainScreenKeydownHandler(e) {
        switch (e.key) {
          case "s":
          case "w":
          case "ArrowDown":
          case "ArrowUp":
            handleMoveInOptions(
              main_option_array,
              "current-option-select",
              e.key
            );
            break;
          case "Enter":
            main_option_array[currentIndex].classList.remove(
              "current-option-select"
            );
            if (currentIndex == 0) {
              goTo(selectCharsScreen);
            } else if (currentIndex == 1) {
              goTo(settingsScreen);
            }
            break;
          case "Escape":
            main_option_array[currentIndex].classList.remove(
              "current-option-select"
            );
            goTo(exitScreen);
            break;
          default:
            break;
        }
      }
      break;
    case selectCharsScreen:
      onScreenSwitch_entrance(
        chars_array,
        currentIndex,
        "char-select",
        selectCharsScreenKeydownHandler
      );
      function selectCharsScreenKeydownHandler(e) {
        switch (e.key) {
          case "d":
          case "a":
          case "ArrowRight":
          case "ArrowLeft":
            if (!selectCharsScreen.classList.contains("ready")) {
              handleMoveInOptions(chars_array, "char-select", e.key);
            }
            break;
          case "Escape":
            if (selectCharsScreen.classList.contains("ready")) {
              chars_array[selectedIndex].classList.remove("char-selected");
              chars_array[currentIndex].classList.add("char-select");
              selectCharsScreen.classList.remove("ready");
            } else {
              chars_array[currentIndex].classList.remove("char-select");
              chars_array[currentIndex].classList.remove("char-selected");
              selectCharsScreen.classList.remove("ready");
              goTo(mainSreen);
            }
            break;
          case "Enter":
            if (!selectCharsScreen.classList.contains("ready")) {
              chars_array[currentIndex].classList.remove("char-select");
              chars_array[currentIndex].classList.add("char-selected");
              selectedIndex = currentIndex;
              selectCharsScreen.classList.add("ready");
            }
            break;
          default:
            break;
        }
      }
      break;
    case settingsScreen:
      onScreenSwitch_entrance(
        sets_array,
        currentIndex,
        "current-option-select",
        setsScreenKeydownHandler
      );
      function setsScreenKeydownHandler(e) {
        switch (e.key) {
          case "s":
          case "w":
          case "ArrowDown":
          case "ArrowUp":
            handleMoveInOptions(sets_array, "current-option-select", e.key);
            break;
          case "Enter":
            sets_array[currentIndex].classList.remove("current-option-select");
            if (sets_array[currentIndex] == sets_array[0]) {
              // Тут мы просто обновляем состояние
              handleChangeProfile(
                null,
                P1_navigation,
                localStorage.getItem("P1_currentProfileIndex")
                  ? Number(localStorage.getItem("P1_currentProfileIndex"))
                  : P1_currentProfileIndex
              );
              handleChangeProfile(
                null,
                P2_navigation,
                localStorage.getItem("P2_currentProfileIndex")
                  ? Number(localStorage.getItem("P2_currentProfileIndex"))
                  : P2_currentProfileIndex
              );
              goTo(inputSetsScreen);
            } else if (sets_array[currentIndex] == sets_array[1]) {
              goTo(langSetsScreen);
            }
            break;
          case "Escape":
            sets_array[currentIndex].classList.remove("current-option-select");
            goTo(mainSreen);
            break;
          default:
            break;
        }
      }
      break;
    case inputSetsScreen:
      onScreenSwitch_entrance(
        input_sets_array,
        currentIndex,
        "current-option-select",
        inputSetsKeydownHandler
      );
      function inputSetsKeydownHandler(e) {
        if (changeKeyValue) {
          if (invalid_keys.includes(`${e.key}`)) {
            window.alert(
              `"${e.key}" is invalid key! Please, select another key`
            );
          } else {
            // Инициализация новой клавиши
            P1_new_keys.forEach((i) => {
              // Проверяем сначала есть ли в массиве уже такая клавиша
              if (i.textContent == e.key) {
                // Перемещаем перезаписанную клавишу в место найденной
                P1_new_keys[Array.from(P1_new_keys).indexOf(i)].textContent =
                  P1_new_keys[currentIndex - 1].textContent; // "-1" потому что, массив P1_new_keys имеет меньше на один элемент чем P1_navigation, ❗зависима от P1_navigation, нужно чтобы "currentIndex" всегда началось с 0 для P1_new_keys
              }
            });
            // Присваиваем новую клавишу
            P1_new_keys[currentIndex - 1].textContent = e.key;
          }
          changeKeyValue = false;
          P1_new_keys[currentIndex - 1].classList.remove(
            "blue-gradient-animation"
          );
        }
        switch (e.key) {
          case "Escape":
            input_sets_array[currentIndex].classList.remove(
              "current-option-select"
            );
            goTo(settingsScreen);
            break;
          case "w":
          case "s":
            handleMoveInOptions(P1_navigation, "current-option-select", e.key);
            break;
          case "a":
          case "d":
            if (P1_navigation[currentIndex] == P1_navigation[0]) {
              handleChangeProfile(e.key, P1_navigation, P1_currentProfileIndex);
            }
            break;
          case "Enter":
            // Save
            if (P1_navigation[currentIndex] == P1_navigation[13]) {
              // Сохраняем профиль
              localStorage.setItem(
                "P1_currentProfileIndex",
                `${P1_currentProfileIndex}`
              );
              // Сохраняем клавиши
              localStorage.setItem(
                `P1_profile${P1_currentProfileIndex + 1}`,
                JSON.stringify(
                  Array.from(P1_new_keys).map((el) => el.textContent)
                )
              );
              P1_navigation[currentIndex].classList.remove(
                "current-option-select"
              );
              // После сохранения вернёмся обратно в окно "Настройки"
              goTo(settingsScreen);
            } else if (P1_navigation[currentIndex] == P1_navigation[14]) {
              // Reset
              reset_keys(P1_new_keys);
            }
            // Логика инициализации новой клавиши
            else if (P1_navigation[currentIndex] != P1_navigation[0]) {
              P1_new_keys[currentIndex - 1].classList.add(
                "blue-gradient-animation"
              );
              changeKeyValue = true;
            }
            break;
          default:
            break;
        }
      }
      break;
    case langSetsScreen:
      onScreenSwitch_entrance(
        lang_sets_array,
        currentIndex,
        "current-option-select",
        langSetsKeydownHandler
      );
      function langSetsKeydownHandler(e) {
        switch (e.key) {
          case "w":
          case "s":
          case "ArrowUp":
          case "ArrowDown":
            handleMoveInOptions(
              lang_sets_array,
              "current-option-select",
              e.key
            );
            break;
          case "Escape":
            lang_sets_array[currentIndex].classList.remove(
              "current-option-select"
            );
            goTo(settingsScreen);
            break;
          case "Enter":
            lang_status.forEach((i) => {
              i.classList.remove("selected-lang");
              i.textContent = "";
            });
            lang = lang_status[currentIndex].getAttribute("data-lang");
            localStorage.setItem("language", lang);
            changeLang();
            lang_sets_array[currentIndex].classList.remove(
              "current-option-select"
            );
            goTo(settingsScreen);
            break;
          default:
            break;
        }
      }
      break;
    case exitScreen:
      onScreenSwitch_entrance(
        yn_array,
        currentIndex,
        "current-option-select",
        ynKeydownHandler
      );
      function ynKeydownHandler(e) {
        switch (e.key) {
          case "a":
          case "d":
          case "ArrowRight":
          case "ArrowLeft":
            handleMoveInOptions(yn_array, "current-option-select", e.key);
            break;
          case "Enter":
            if (yn_array[currentIndex] == yn_array[0]) {
              yn_array[currentIndex].classList.remove("current-option-select");
              goTo(mainSreen);
            } else if (yn_array[currentIndex] == yn_array[1]) {
              window.close();
            }
            break;
          case "Escape":
            yn_array[currentIndex].classList.remove("current-option-select");
            goTo(mainSreen);
          default:
            break;
        }
      }
      break;
    default:
      break;
  }
}
