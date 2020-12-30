const Keyboard = {
    elements: {
        main: null,
        keyContainers: null,
        key: []
    },

    eventHandlers: {
        oninput: null,
        onclose: null
    },

    properties: {
        value: "",
        capsLock: false
    },

    init() {
        // create main elemnt
        this.elements.main = document.createElement("div");
        this.elements.keyContainers = document.createElement("div");

        this.elements.main.classList.add("keyboard", "keyboard__hidden");
        this.elements.keyContainers.classList.add("keyboard__keys");
        this.elements.keyContainers.appendChild(this._createKeys());

        this.elements.keys = this.elements.keyContainers.querySelectorAll(".keyboard__key");
        this.elements.main.appendChild(this.elements.keyContainers);
        document.body.appendChild(this.elements.main);

        document.querySelectorAll(".use-keyboard-input").forEach(element => {
            element.addEventListener("focus",() => {
                this.open(element.value, currentValue => {
                    element.value = currentValue;
                });
            });
        });

    },

    _createKeys() {
        const fragment = document.createDocumentFragment();
        const keyLayout = [
            "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
            "q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
            "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "enter",
            "done", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?",
            "space"

        ];

        const createIconHTML = (iconName) => {
            return `<i class="material-icons">${iconName}</i>`;
        };

        keyLayout.forEach(key => {
            const keyElement = document.createElement("button");
            const insertLineBreak = ["backspace", "p", "enter", "?"].indexOf(key) !== -1;

            keyElement.setAttribute("type", "button");
            keyElement.classList.add("keyboard__key");

            switch (key) {
                case "backspace":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("backspace");
                    keyElement.addEventListener("click", () => {
                        this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
                        this._trigerEvent("oninput");
                    });
                    break;
                case "caps":
                    keyElement.classList.add("keyboard__key--wide", "keyboard__key--light");
                    keyElement.innerHTML = createIconHTML("keyboard_capslock");
                    keyElement.addEventListener("click", () => {
                        this._toggleCapslock();
                        keyElement.classList.toggle("keyboard__key--active", this.properties.capsLock);
                        this._trigerEvent("oninput");
                    });
                    break;
                case "enter":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("keyboard_return");
                    keyElement.addEventListener("click", () => {
                        this.properties.value += "\n";
                        this._trigerEvent("oninput");
                    });
                    break;
                case "space":
                    keyElement.classList.add("keyboard__key--wide","keyboard__key--extra-wide");
                    keyElement.innerHTML = createIconHTML("space_bar");
                    keyElement.addEventListener("click", () => {
                        this.properties.value += " ";
                        this._trigerEvent("oninput");
                    });
                    break;
                case "done":
                    keyElement.classList.add("keyboard__key--wide", "keyboard__key--dark");
                    keyElement.innerHTML = createIconHTML("check_circle");
                    keyElement.addEventListener("click", () => {
                        this.close();
                        this._trigerEvent("onclose");
                    });
                    break;
                default:
                    keyElement.textContent = key.toLowerCase();
                    keyElement.addEventListener("click", () => {
                        this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
                        this._trigerEvent("oninput");
                    });
                    break;

            }
            fragment.appendChild(keyElement);

            if(insertLineBreak){
                fragment.appendChild(document.createElement("br"));
            }
        });

        return fragment;


    },

    _trigerEvent(handlerName) {
        if (typeof this.eventHandlers[handlerName] == "function") {
            this.eventHandlers[handlerName](this.properties.value);
        }
    
    },

    _toggleCapslock() {
        this.properties.capsLock = !this.properties.capsLock;
        for(const key of this.elements.keys){
            if(key.childElementCount == 0){
                key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
            }
        }
    },

    open(initialValue, oninput, onclose) {
        this.properties.value = initialValue || "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.remove("keyboard__hidden");
    },

    close() {
        this.properties.value = "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.add("keyboard__hidden");
    }
};

window.addEventListener("DOMContentLoaded", function () {
    Keyboard.init();
    
});