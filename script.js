const Keyboard = {
    elements: {
        main: null,
        keysContainer: null,
        keys: []
    },

    properties: {
        value: '',
        capsLock: false,
        shift: false,
        cursor: {
            start: 0,
            end: 0
        },
        language: 'ru',
        volume: true,
        speech: false
    },

    eventHandlers: {
        oninput: null,
        onclose: null
    },

    init() {
        this.elements.main = document.createElement('div');
        this.elements.keysContainer = document.createElement('div');
        this.elements.main.classList.add('keyboard', 'keyboard--hidden');
        this.elements.keysContainer.classList.add('keyboard__keys');
        this.elements.keysContainer.appendChild(this._createKeys());
        this.elements.main.appendChild(this.elements.keysContainer);
        document.body.appendChild(this.elements.main);

        document.querySelectorAll('.use-keyboard-input').forEach(elem=>{
            elem.addEventListener('focus', ()=>{
                this.open(this.properties.value, currentValue=>{
                    elem.value = currentValue;
                })
            })
        })
    },
    
    _createKeys() {

        const fragment = document.createDocumentFragment();
        const keysLayoutEn = [
            "`","1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
            "q", "w", "e", "r", "t", "y", "u", "i", "o", "p","[","]","\\",
            "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "enter",
            "shift", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/","done",
            "en","space","arrow_left","arrow_right", "volume", "speech"
          ];

        const keysLayoutEnShift = [
            "~", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "backspace",
            "q", "w", "e", "r", "t", "y", "u", "i", "o", "p","{","}","|",
            "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", ":", '"', "enter",
            "shift", "z", "x", "c", "v", "b", "n", "m", "<", ">", "?","done",
            "en","space","arrow_left","arrow_right", "volume", "speech"
          ];
          
        const keysLayoutRu = [
            "ё", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
            "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з","х","ъ","\\",
            "caps", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "enter",
            "shift", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", ".","done",
            "ru","space","arrow_left","arrow_right", "volume", "speech"
          ];
          
        const keysLayoutRuShift = [
            "ё", "!", '"', "№", ";", "%", ":", "?", "*", "(", ")", "backspace",
            "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з","х","ъ","/",
            "caps", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "enter",
            "shift", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", ",","done",
            "ru","space","arrow_left","arrow_right", "volume", "speech"
          ];
        const createIcon = (icon) => {
            return `<i class='material-icons'>${icon}</i>`;
        }

        let keysLayout = this.properties.language==='en' ? [keysLayoutEn, keysLayoutEnShift] : [keysLayoutRu, keysLayoutRuShift];
        keysLayout = this.properties.shift ? keysLayout[1] : keysLayout[0];
        keysLayout.forEach(key=>{
            const textarea = document.querySelector('textarea');
            const keyElem = document.createElement('button');
            keyElem.classList.add('keyboard__key');
            keyElem.setAttribute('type', 'button');

            let lineBreak;
            if (this.properties.language==='en') {
                if (this.properties.shift) {
                    lineBreak = ["backspace", "|", "enter", "done"].indexOf(key) !== -1;
                } else {
                    lineBreak = ["backspace", "\\", "enter", "done"].indexOf(key) !== -1;
                }
            } else {
                if (this.properties.shift) {
                    lineBreak = ["backspace", "/", "enter", "done"].indexOf(key) !== -1;
                } else {    
                    lineBreak = ["backspace", "\\", "enter", "done"].indexOf(key) !== -1;
                }
            }

            switch(key) {
                case 'backspace': 
                    keyElem.classList.add('keyboard__key--wide');
                    keyElem.innerHTML = createIcon('backspace');
                    keyElem.addEventListener('click', () => {
                        this._createMusic(keyElem.children[0].innerHTML)
                        const startVal = this.properties.value.slice(0, this.properties.cursor.start);
                        const endVal = this.properties.value.slice(this.properties.cursor.start);                      
                        this.properties.value = startVal.substring(0, this.properties.cursor.start-1) + endVal;
                        if (this.properties.cursor.start > 0 && this.properties.cursor.end > 0) {
                            this.properties.cursor.start--;
                            this.properties.cursor.end--;
                        }
                        textarea.focus()
                        this._triggerHandler('oninput'); 
                        textarea.selectionStart = this.properties.cursor.start;
                        textarea.selectionEnd = this.properties.cursor.start;
                });
                break;

                case 'caps':
                    keyElem.classList.add('keyboard__key--wide', 'keyboard__key--activatable');
                    this.properties.capsLock ? keyElem.classList.add('keyboard__key--active') : null;
                    keyElem.innerHTML = createIcon('keyboard_capslock');
                    keyElem.addEventListener('click', () => {
                        this._createMusic(keyElem.children[0].innerHTML);
                        this.properties.capsLock = !this.properties.capsLock;
                        textarea.focus();
                        _checkCapsShift();
                        this._triggerHandler('oninput');
                    }) 
                break;

                case 'enter':
                    keyElem.classList.add('keyboard__key--wide');
                    keyElem.innerHTML = createIcon('keyboard_return');
                    keyElem.addEventListener('click', () => {
                        this._createMusic(keyElem.children[0].innerHTML);
                        const startVal = this.properties.value.slice(0, this.properties.cursor.start);
                        const endVal = this.properties.value.slice(this.properties.cursor.start);                      
                        this.properties.value = startVal + '\n' + endVal;
                        textarea.focus();
                        this._triggerHandler('oninput');
                        this.properties.cursor.start++;
                        this.properties.cursor.end++;
                        textarea.selectionStart = this.properties.cursor.start;
                        textarea.selectionEnd = this.properties.cursor.start;
                    })
                break;

                case 'space':
                    keyElem.classList.add('keyboard__key--extra-wide');
                    keyElem.innerHTML = createIcon('space_bar');
                    keyElem.addEventListener('click', () => {
                        this._createMusic(keyElem.children[0].innerHTML);
                        const startVal = this.properties.value.slice(0, this.properties.cursor.start);
                        const endVal = this.properties.value.slice(this.properties.cursor.start);
                        this.properties.value = startVal + ' ' + endVal;
                        this._triggerHandler('oninput');
                        textarea.focus();
                        this.properties.cursor.start++;
                        textarea.selectionStart = this.properties.cursor.start;
                        textarea.selectionEnd = this.properties.cursor.start;
                    })
                break;

                case 'done':
                    keyElem.classList.add('keyboard__key--wide', 'keyboard__key--dark');
                    keyElem.innerHTML = createIcon('check_circle');
                    keyElem.addEventListener('click', () => {
                        this.close();
                        this._triggerHandler('onclose');
                    })
                break;

                case 'shift':
                    keyElem.classList.add('keyboard__key--wide', 'keyboard__key--activatable');
                    this.properties.shift ? keyElem.classList.add('keyboard__key--active') : null;
                    keyElem.innerHTML = createIcon('north');
                    keyElem.addEventListener('click', ()=>{
                        this._createMusic(keyElem.children[0].innerHTML);
                        this.properties.shift = !this.properties.shift;
                        textarea.focus();
                        _checkCapsShift();
                        this._triggerHandler('oninput');
                    }) 
                break;

                case 'arrow_left':
                    keyElem.classList.add('keyboard__key--light');
                    keyElem.innerHTML = createIcon('west');
                    keyElem.addEventListener('click', ()=> {
                        this._createMusic(keyElem.innerHTML);
                        if (this.properties.cursor.start!==0 && this.properties.cursor.end!==0) {
                            this.properties.cursor.start--;
                            this.properties.cursor.end--;
                        }
                        textarea.focus()
                        textarea.selectionStart = this.properties.cursor.start;
                        textarea.selectionEnd = this.properties.cursor.start;
                        this._triggerHandler('oninput');
                    })

                break;

                case 'arrow_right':
                    keyElem.classList.add('keyboard__key--light');
                    keyElem.innerHTML = createIcon('east');
                    keyElem.addEventListener('click', () => {
                        this._createMusic(keyElem.innerHTML);
                        if (this.properties.cursor.start !== this.properties.value.length && this.properties.cursor.end !== this.properties.value.length) {
                            this.properties.cursor.start++;
                            this.properties.cursor.end++;
                        }
                        textarea.focus()
                        textarea.selectionStart = this.properties.cursor.start;
                        textarea.selectionEnd = this.properties.cursor.start;
                        this._triggerHandler('oninput')
                    })
                break;
                
                case 'en':
                    keyElem.classList.add('keyboard__key--light');
                    keyElem.innerHTML = key.toLowerCase();
                    keyElem.addEventListener('click', ()=> {
                        this._createMusic(keyElem.innerHTML);
                        this.properties.language = 'ru';
                        textarea.focus();
                        document.querySelectorAll('.keyboard__key').forEach(key => {
                            key.remove();
                        })
                        document.querySelectorAll('br').forEach(key => {
                            key.remove();
                        })
                        this.elements.keysContainer.appendChild(this._createKeys());
                    })
                break;

                case 'ru':
                    keyElem.classList.add('keyboard__key--light');
                    keyElem.innerHTML = key.toLowerCase();
                    keyElem.addEventListener('click', () => {
                        this._createMusic(keyElem.innerHTML)
                        this.properties.language = 'en';
                        textarea.focus();
                        document.querySelectorAll('.keyboard__key').forEach(key => {
                            key.remove();
                        });
                        document.querySelectorAll('br').forEach(key => {
                            key.remove();
                        });
                        this.elements.keysContainer.appendChild(this._createKeys());
                    })
                break;

                case 'volume':
                    keyElem.classList.add('keyboard__key--light');
                    this.properties.volume ? keyElem.innerHTML = createIcon('volume_up') : keyElem.innerHTML = createIcon('volume_off');
                    keyElem.addEventListener('click', () => {
                        this._createMusic(keyElem.children[0].innerHTML);
                        this.properties.volume = !this.properties.volume;
                        this.properties.volume ? keyElem.innerHTML = createIcon('volume_up') : keyElem.innerHTML = createIcon('volume_off');
                    })
                break;

                case 'speech':
                    keyElem.classList.add('keyboard__key--light');
                    this.properties.speech ? keyElem.innerHTML = createIcon('mic') : keyElem.innerHTML = createIcon('mic_off');
                    keyElem.addEventListener('click', () => {
                        this._createMusic(keyElem.children[0].innerHTML);
                        this.properties.speech = !this.properties.speech;

                       document.querySelector('textarea').innerHTML = this.properties.value;
                        window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                        const recognition = new SpeechRecognition();
                        recognition.interimResults = true;
                        recognition.lang = this.properties.language==='ru' ? 'ru' : 'en';
                      
                        recognition.addEventListener('result', e => {
                          const transcript = Array.from(e.results)
                            .map(result => result[0])
                            .map(result => result.transcript)
                            .join('');
                      
                            if (e.results[0].isFinal) {
                                this.properties.value += transcript;
                                this.properties.cursor.start +=transcript.length;
                                this.properties.cursor.end +=transcript.length;
                              }
                              
                        });
                        this.properties.speech ? recognition.start() : null;
                        recognition.addEventListener('end', () => {
                            this.properties.speech ? recognition.start() : recognition.stop();
                            document.querySelector('textarea').selectionStart = this.properties.cursor.start;
                            document.querySelector('textarea').focus();
                            this._triggerHandler();
                            document.querySelector('textarea').value = this.properties.value;
                        });   
                        this.properties.speech ? keyElem.innerHTML = createIcon('mic') : keyElem.innerHTML = createIcon('mic_off');
                        this.properties.speech ? keyElem.classList.add('keyboard__key--activatable--red') : keyElem.classList.remove('keyboard__key--activatable--red')
                    })

                break;

                default:
                    keyElem.innerHTML = (this.properties.capsLock || this.properties.shift) ? key.toUpperCase() : key.toLowerCase();
                    keyElem.addEventListener('click', () => {
                        this._createMusic(keyElem.innerHTML)

                            this.properties.cursor.start = textarea.selectionStart;
                            this.properties.cursor.end = textarea.selectionStart;

                            const startVal = this.properties.value.slice(0, this.properties.cursor.start);
                            const endVal = this.properties.value.slice(this.properties.cursor.start);

                            this.properties.value = startVal + (((this.properties.capsLock && !this.properties.shift) || (this.properties.shift && !this.properties.capsLock))? key.toUpperCase() : key.toLowerCase()) + endVal
                            this.properties.cursor.start++;

                            textarea.focus();
                            this._triggerHandler('oninput');

                            textarea.selectionStart = this.properties.cursor.start;
                            textarea.selectionEnd = this.properties.cursor.start;
                    })
                break;
            }

            fragment.appendChild(keyElem);
            if (lineBreak) fragment.appendChild(document.createElement('br'));
        })
        return fragment;
    },
    
    _triggerHandler(handleEvent) {
        if(typeof this.eventHandlers[handleEvent]==='function') {
            this.eventHandlers[handleEvent](this.properties.value);
        }
    },

    _toggleCaps() {
        this.properties.capsLock = !this.properties.capsLock;
        const elems = document.querySelectorAll('.keyboard__key');
        for (let key of elems) {
            if (key.childElementCount===0) {
                key.innerHTML = this.properties.capsLock ? key.outerText.toUpperCase() : key.outerText.toLowerCase();
            }
        }
    },

    _createMusic(text) {
        if (!this.properties.volume) return;
        let audio = new Audio();
        switch (text) {
            case 'backspace':
                audio.src = `sounds/2f-0.wav`;
            break;
            case 'keyboard_capslock':
                audio.src =  `sounds/6a-0.wav`;
            break;
            case 'keyboard_return':
                audio.src = `sounds/01-0.wav`;
            break;
            case 'north':
                audio.src = `sounds/0a-1.wav`;   
            break;
            default: 
                audio.src = this.properties.language==='ru' ? `sounds/1c-1.wav` : `sounds/17-0.wav`;
            break;
        }
        
        audio.play();

    },

    open(initialState, oninput, onclose) {
        this.properties.value = initialState || '';
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.remove('keyboard--hidden');
    },

    close() {
        this.properties.value = '';
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.add('keyboard--hidden');
    }
}

window.addEventListener('DOMContentLoaded', ()=>{
    Keyboard.init();
});

const textarea = document.querySelector('textarea');

textarea.addEventListener('input', ()=>{
    Keyboard.properties.value = textarea.value;
    Keyboard.properties.cursor.start = textarea.selectionStart;
    Keyboard.properties.cursor.end = textarea.selectionStart;
});

textarea.addEventListener('click', ()=>{
    textarea.focus();
    Keyboard.properties.cursor.start = textarea.selectionStart;
    Keyboard.properties.cursor.end = textarea.selectionEnd;
});

const _checkCapsShift = () => {
    if ((Keyboard.properties.capsLock && Keyboard.properties.shift) || (!Keyboard.properties.capsLock && !Keyboard.properties.shift)) {
        document.querySelectorAll('.keyboard__key').forEach(key=>key.remove());
        document.querySelectorAll('br').forEach(key=>key.remove());
        Keyboard.elements.keysContainer.appendChild(Keyboard._createKeys());
        document.querySelectorAll('.keyboard__key').forEach(key=>key.childElementCount===0 ? key.innerText = key.innerText.toLowerCase() : null);
    }

    if ((Keyboard.properties.capsLock && !Keyboard.properties.shift)|| (Keyboard.properties.shift && !Keyboard.properties.capsLock)) {
        document.querySelectorAll('.keyboard__key').forEach(key=>key.remove());
        document.querySelectorAll('br').forEach(key=>key.remove());
        Keyboard.elements.keysContainer.appendChild(Keyboard._createKeys());
        document.querySelectorAll('.keyboard__key').forEach(key=>key.childElementCount===0 ? key.innerText = key.innerText.toUpperCase() : null);
    }
}

textarea.addEventListener('keydown',(e)=>{
    const buttons = document.querySelectorAll('.keyboard__key');
    buttons.forEach(elem => {
        if (e.key === elem.innerHTML) elem.classList.add('keyboard__key--button--active');
    });
    if(e.key==='CapsLock') {
        Keyboard.properties.capsLock = !Keyboard.properties.capsLock;
        _checkCapsShift();
        document.querySelectorAll('.keyboard__key').forEach(elem=>{
            if (elem.childElementCount!==0) {
               elem.children[0].innerHTML==='keyboard_capslock' ? elem.classList.add('keyboard__key--button--active') : null;
            }
        })

    }
    if (e.key === 'Backspace') {
        buttons.forEach(elem => {
            if (elem.childElementCount !== 0) {
                elem.children[0].innerHTML==='backspace' ? elem.classList.add('keyboard__key--button--active') : null;
            }
        })
    }
    if (e.key === 'Enter') {
        buttons.forEach(elem => {
            if (elem.childElementCount !== 0) {
                elem.children[0].innerHTML === 'keyboard_return' ? elem.classList.add('keyboard__key--button--active') : null;
            }
        });
    }
    if (e.key === 'Shift') {
        Keyboard.properties.shift = !Keyboard.properties.shift;
        _checkCapsShift();
        document.querySelectorAll('.keyboard__key').forEach(elem=>{
            if(elem.childElementCount!==0) {
                elem.children[0].innerHTML==='north' ? elem.classList.add('keyboard__key--button--active', 'keyboard__key--active') : null;
            }
        })
    }
    if (e.key === ' ') {
        buttons.forEach(elem => {
            if(elem.childElementCount !== 0) {
                elem.children[0].innerHTML === 'space_bar' ? elem.classList.add('keyboard__key--button--active') : null;
            }
        });
    }
})

textarea.addEventListener('keyup',(e) => {
    const buttons = document.querySelectorAll('.keyboard__key');
    buttons.forEach(elem => {
        if (e.key === elem.innerHTML) elem.classList.remove('keyboard__key--button--active');
    })
    if (e.key === 'Backspace') {
        buttons.forEach(elem => {
            if(elem.childElementCount !== 0) {
                elem.children[0].innerHTML === 'backspace' ? elem.classList.remove('keyboard__key--button--active') : null;
            }
        });
    }
    if (e.key === 'Shift') {
        Keyboard.properties.shift = !Keyboard.properties.shift;
        buttons.forEach(elem => {
            if(elem.childElementCount !== 0) {
                elem.children[0].innerHTML === 'north' ? elem.classList.remove('keyboard__key--button--active', 'keyboard__key--active') : null;
            }
        })
        _checkCapsShift();
    }
    if (e.key === 'CapsLock') {
        buttons.forEach(elem => {
            if (elem.childElementCount !== 0) {
                elem.children[0].innerHTML === 'keyboard_capslock' ? elem.classList.remove('keyboard__key--button--active') : null;
            }
        });
        _checkCapsShift();
    }
    if (e.key === ' ') {
        buttons.forEach(elem=>{
            if (elem.childElementCount !== 0) {
                elem.children[0].innerHTML === 'space_bar' ? elem.classList.remove('keyboard__key--button--active') : null;
            }
        });
    }
    if (e.key === 'Enter') {
        buttons.forEach(elem => {
            if (elem.childElementCount !== 0) {
                elem.children[0].innerHTML === 'keyboard_return' ? elem.classList.remove('keyboard__key--button--active') : null;
            }
        });
    }
});
