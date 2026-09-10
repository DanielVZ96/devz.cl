(() => {
    "use strict";

    const WORDS = {
        "able": "éibol",
        "ai": "éi ai",
        "also": "ólso",
        "around": "aráund",
        "because": "bikós",
        "become": "bikám",
        "boredom": "bórdom",
        "business": "bísnes",
        "can": "kan",
        "can't": "kant",
        "change": "chéinch",
        "changes": "chéinyis",
        "centre": "sénter",
        "centres": "sénters",
        "children": "chíldren",
        "code": "kóud",
        "come": "kam",
        "company": "kámpani",
        "computer": "kompiúter",
        "could": "kud",
        "different": "díferent",
        "even": "íven",
        "english": "ínglish",
        "engineer": "enyinír",
        "engineers": "enyinírs",
        "every": "évri",
        "example": "egzámpl",
        "experiment": "ekspériment",
        "explain": "ekspléin",
        "fibre": "fáiber",
        "fibres": "fáibers",
        "get": "get",
        "hello": "jelóu",
        "history": "jístori",
        "isn't": "ísent",
        "ogres": "ougers",
        "job": "yob",
        "language": "lángüich",
        "languages": "lángüichis",
        "litre": "líter",
        "litres": "líters",
        "little": "lítl",
        "lustre": "láster",
        "lustres": "lásters",
        "meagre": "míger",
        "metre": "míter",
        "metres": "míters",
        "method": "mé{TH}od",
        "new": "niu",
        "neither": "náider",
        "of": "ov",
        "orthographic": "or{TH}ográfik",
        "people": "pípol",
        "philosophy": "filósofi",
        "problem": "práblem",
        "pronounceable": "pronáunsabol",
        "pronunciation": "pronansiéishon",
        "question": "kuéschon",
        "quick": "kuik",
        "read": "rid",
        "really": "ríali",
        "school": "skul",
        "speaker": "spíker",
        "strange": "stréinch",
        "system": "sístem",
        "the": "de",
        "theatre": "thíater",
        "theatres": "thíaters",
        "thermalization": "{TH}ermalizéishon",
        "those": "dóuz",
        "together": "tugéder",
        "translation": "transléishon",
        "without": "uidáut",
        "would": "wud",
        "written": "ríten",
        "you're": "ior"
    };

    const PHONEMES = {
        AA: "a", AE: "a", AH: "a", AO: "o", AW: "au", AY: "ai",
        B: "b", CH: "ch", D: "d", DH: "d", EH: "e", ER: "er",
        EY: "ei", F: "f", G: "g", HH: "j", IH: "i", IY: "i",
        JH: "y", K: "k", L: "l", M: "m", N: "n", NG: "ng",
        OW: "ou", OY: "oi", P: "p", R: "r", S: "s", SH: "sh",
        T: "t", TH: "th", UH: "u", UW: "u", V: "v", W: "u",
        Y: "i", Z: "s", ZH: "sh"
    };
    const VOWELS = new Set([
        "AA", "AE", "AH", "AO", "AW", "AY", "EH", "ER",
        "EY", "IH", "IY", "OW", "OY", "UH", "UW"
    ]);
    const MAPPINGS_KEY = "english-spanish-spelling-personal-phonemes-v2";
    const VOICE_KEY = "english-spanish-spelling-voice-v1";
    const EXCEPTIONS_KEY = "english-spanish-spelling-exceptions-v1";

    const dictionaryPromise = loadDictionary();

    async function loadDictionary() {
        if (!("DecompressionStream" in window)) return new Map();

        try {
            const response = await fetch("/data/cmudict-en-us.txt.gz");
            if (!response.ok || !response.body) throw new Error(`HTTP ${response.status}`);
            const stream = response.body.pipeThrough(new DecompressionStream("gzip"));
            const dictionaryText = await new Response(stream).text();
            const dictionary = new Map();

            for (const line of dictionaryText.split("\n")) {
                if (!line) continue;
                const separator = line.indexOf("\t");
                if (separator === -1) continue;
                dictionary.set(line.slice(0, separator), line.slice(separator + 1));
            }

            return dictionary;
        } catch (error) {
            console.warn("Could not load the pronunciation dictionary.", error);
            return new Map();
        }
    }

    function readStoredObject(key) {
        try {
            const value = JSON.parse(localStorage.getItem(key));
            return value && typeof value === "object" ? value : {};
        } catch {
            return {};
        }
    }

    function readStoredValue(key, fallback = "") {
        try {
            return localStorage.getItem(key) ?? fallback;
        } catch {
            return fallback;
        }
    }

    function storeValue(key, value) {
        try {
            if (value === "") localStorage.removeItem(key);
            else localStorage.setItem(key, value);
        } catch {
            // Controls remain usable when storage is unavailable.
        }
    }

    function applyAlphabet(value) {
        return value.replaceAll("{DH}", "d").replaceAll("{TH}", "th");
    }

    function keepCase(sourceWord, result) {
        if (sourceWord.length > 1 && sourceWord === sourceWord.toUpperCase() && /[A-Z]/.test(sourceWord)) {
            return result.toUpperCase();
        }
        if (/^[A-Z]/.test(sourceWord)) return result.charAt(0).toUpperCase() + result.slice(1);
        return result;
    }

    function accentVowel(chunk) {
        const accents = { a: "á", e: "é", i: "í", o: "ó", u: "ú" };
        const preferred = chunk.search(/[aeo]/);
        const index = preferred === -1 ? chunk.search(/[iu]/) : preferred;
        if (index === -1) return chunk;
        return chunk.slice(0, index) + accents[chunk[index]] + chunk.slice(index + 1);
    }

    function normalizeSpelling(value) {
        return value
            .replace(/ngk/g, "nk")
            .replace(/k(?=[aáoóuú])/g, "c")
            .replace(/k(?=[eéií])/g, "qu")
            .replace(/g(?=[eéií])/g, "gu")
            .replace(/iuu/g, "iu");
    }

    function respellPronunciation(pronunciation, mode, customMappings) {
        const parts = [];
        const vowelPartIndexes = [];
        let primaryStress = -1;

        for (const token of pronunciation.split(" ")) {
            const match = token.match(/^([A-Z]+)([012]?)$/);
            if (!match) return null;

            const [, phoneme, stress] = match;
            const mappingKey = phoneme === "ER" ? (stress === "0" ? "ER0" : "ER1") : phoneme;
            let text;
            if (mode === "personal" && typeof customMappings[mappingKey] === "string") {
                text = customMappings[mappingKey];
            } else if (mappingKey === "ER0") {
                text = "er";
            } else {
                text = PHONEMES[phoneme];
            }
            if (typeof text !== "string") return null;

            const partIndex = parts.push(text) - 1;
            if (VOWELS.has(phoneme)) {
                const syllableIndex = vowelPartIndexes.push(partIndex) - 1;
                if (stress === "1") primaryStress = syllableIndex;
            }
        }

        let result = normalizeSpelling(parts.join(""));
        if (primaryStress !== -1 && vowelPartIndexes.length > 1) {
            const defaultStress = /[aeiouns]$/.test(result)
                ? vowelPartIndexes.length - 2
                : vowelPartIndexes.length - 1;
            if (primaryStress !== defaultStress) {
                const stressedPart = vowelPartIndexes[primaryStress];
                parts[stressedPart] = accentVowel(parts[stressedPart]);
                result = normalizeSpelling(parts.join(""));
            }
        }
        return result;
    }

    function fallback(word) {
        const value = word.toLowerCase()
            .replace(/^kn/, "n").replace(/^wr/, "r").replace(/^wh/, "u")
            .replace(/igh/g, "ai").replace(/eigh/g, "ei")
            .replace(/tion/g, "shon").replace(/sion/g, "shon").replace(/cian/g, "shan")
            .replace(/ture$/g, "cher").replace(/ph/g, "f").replace(/qu/g, "ku")
            .replace(/ck/g, "k").replace(/tch/g, "ch").replace(/dge/g, "y")
            .replace(/th(?=e\b)/g, "{DH}").replace(/([aeiou])th(?=[aeiou])/g, "$1{DH}")
            .replace(/th/g, "{TH}").replace(/sh/g, "§").replace(/ch/g, "¢")
            .replace(/ng/g, "ŋ").replace(/ee/g, "i").replace(/ea/g, "i")
            .replace(/oo/g, "u").replace(/ai/g, "ei").replace(/ay/g, "ei")
            .replace(/oa/g, "ou").replace(/ou/g, "au").replace(/ow/g, "au")
            .replace(/a([^aeiou])e$/g, "ei$1").replace(/i([^aeiou])e$/g, "ai$1")
            .replace(/o([^aeiou])e$/g, "ou$1").replace(/u([^aeiou])e$/g, "iu$1")
            .replace(/e$/g, "").replace(/c(?=[eiy])/g, "s").replace(/c/g, "k")
            .replace(/g(?=[eiy])/g, "y").replace(/j/g, "y").replace(/x/g, "ks")
            .replace(/h/g, "j").replace(/^w/g, "u").replace(/y$/g, "i")
            .replace(/z/g, "s").replace(/([bcdfgjklmnpqrstvwxyz])\1+/g, "$1")
            .replaceAll("§", "sh").replaceAll("¢", "ch").replaceAll("ŋ", "ng");
        return applyAlphabet(value || word.toLowerCase());
    }

    function populateVoices(select) {
        if (!("speechSynthesis" in window)) return;
        const voices = speechSynthesis.getVoices()
            .filter(voice => /^(?:es|en)(?:-|_)/i.test(voice.lang))
            .sort((left, right) => Number(!left.lang.startsWith("es")) - Number(!right.lang.startsWith("es"))
                || left.lang.localeCompare(right.lang)
                || left.name.localeCompare(right.name));
        const savedVoice = readStoredValue(VOICE_KEY);
        const automatic = new Option("Automatic Spanish voice", "");
        const options = voices.map(voice => new Option(`${voice.name} (${voice.lang})`, voice.voiceURI));
        select.replaceChildren(automatic, ...options);
        select.disabled = voices.length === 0;
        select.value = voices.some(voice => voice.voiceURI === savedVoice) ? savedVoice : "";
    }

    function speak(text, voiceURI) {
        if (!("speechSynthesis" in window) || !text.trim()) return;
        speechSynthesis.cancel();
        const voices = speechSynthesis.getVoices();
        const voice = voices.find(item => item.voiceURI === voiceURI)
            || voices.find(item => item.lang === "es-CL")
            || voices.find(item => item.lang.startsWith("es"))
            || voices.find(item => item.lang.startsWith("en"))
            || null;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = voice;
        utterance.lang = voice?.lang || "es-CL";
        utterance.rate = 0.88;
        speechSynthesis.speak(utterance);
    }

    async function initialize(widget) {
        const source = widget.querySelector("[data-source]");
        const output = widget.querySelector("[data-output]");
        const status = widget.querySelector("[data-status]");
        const inspector = widget.querySelector("[data-inspector]");
        const voiceSelect = widget.querySelector("[data-voice]");
        const exceptions = widget.querySelector("[data-hand-tuned]");
        const standardButton = widget.querySelector('[data-mode="standard"]');
        const personalButton = widget.querySelector('[data-mode="personal"]');
        const sourceListen = widget.querySelector("[data-listen-source]");
        const outputListen = widget.querySelector("[data-listen-output]");
        const clearButton = widget.querySelector("[data-clear]");
        const copyButton = widget.querySelector("[data-copy]");
        const resetButton = widget.querySelector("[data-reset-mappings]");
        const mappingInputs = [...widget.querySelectorAll("[data-mapping]")];
        const customMappings = readStoredObject(MAPPINGS_KEY);
        let dictionary = new Map();
        let mode = "standard";
        let plainOutput = "";

        exceptions.checked = readStoredValue(EXCEPTIONS_KEY, "true") !== "false";

        function saveMappings() {
            storeValue(MAPPINGS_KEY, Object.keys(customMappings).length ? JSON.stringify(customMappings) : "");
        }

        function setMode(nextMode) {
            mode = nextMode;
            standardButton.setAttribute("aria-pressed", String(mode === "standard"));
            personalButton.setAttribute("aria-pressed", String(mode === "personal"));
            exceptions.disabled = mode === "personal";
            render();
        }

        function convertWord(sourceWord) {
            const key = sourceWord.toLowerCase().replace(/’/g, "'");
            const pronunciation = dictionary.get(key);
            const handTuned = WORDS[key];
            let result;
            let method;

            if (mode === "personal" && pronunciation) {
                result = respellPronunciation(pronunciation, mode, customMappings) || fallback(key);
                method = "your personal phoneme map";
            } else if (exceptions.checked && handTuned) {
                result = applyAlphabet(handTuned);
                method = "a hand-tuned exception";
            } else if (pronunciation) {
                result = respellPronunciation(pronunciation, mode, customMappings) || fallback(key);
                method = "CMUdict phonemes";
            } else {
                result = fallback(key);
                method = "fallback spelling rules";
            }

            return {
                original: sourceWord,
                result: keepCase(sourceWord, result),
                method,
                pronunciation: method.includes("phoneme") ? pronunciation : ""
            };
        }

        function render() {
            const text = source.value;
            const wordPattern = /[A-Za-z]+(?:['’][A-Za-z]+)*/g;
            const fragment = document.createDocumentFragment();
            const convertedWords = [];
            let lastIndex = 0;
            let match;

            while ((match = wordPattern.exec(text)) !== null) {
                fragment.append(document.createTextNode(text.slice(lastIndex, match.index)));
                const converted = convertWord(match[0]);
                convertedWords.push(converted);
                const wordButton = document.createElement("button");
                wordButton.type = "button";
                wordButton.className = "english-spelling__word";
                wordButton.textContent = converted.result;
                wordButton.dataset.original = converted.original;
                wordButton.dataset.method = converted.method;
                wordButton.dataset.pronunciation = converted.pronunciation || "";
                wordButton.setAttribute("aria-label", `${converted.original} becomes ${converted.result}`);
                fragment.append(wordButton);
                lastIndex = wordPattern.lastIndex;
            }

            fragment.append(document.createTextNode(text.slice(lastIndex)));
            plainOutput = text.replace(wordPattern, word => convertWord(word).result);
            output.replaceChildren(fragment);
            const count = convertedWords.length;
            const known = convertedWords.filter(word => word.method !== "fallback spelling rules").length;
            const coverage = count ? Math.round((known / count) * 100) : 0;
            status.textContent = count
                ? `${count} ${count === 1 ? "word" : "words"} · ${coverage}% pronunciation-backed`
                : "0 words";
            const disabled = text.trim().length === 0;
            clearButton.disabled = disabled;
            copyButton.disabled = disabled;
            sourceListen.disabled = disabled || !("speechSynthesis" in window);
            outputListen.disabled = disabled || !("speechSynthesis" in window);
        }

        mappingInputs.forEach(input => {
            const row = input.closest("tr");
            const phoneme = row.dataset.phoneme;
            const defaultValue = row.cells[3].textContent.trim();
            input.value = customMappings[phoneme] ?? defaultValue;
            input.dataset.defaultValue = defaultValue;
            input.addEventListener("input", () => {
                const value = input.value.trim();
                if (value && value !== defaultValue) customMappings[phoneme] = value;
                else delete customMappings[phoneme];
                resetButton.disabled = Object.keys(customMappings).length === 0;
                saveMappings();
                setMode("personal");
            });
            input.addEventListener("blur", () => {
                input.value = input.value.trim() || defaultValue;
            });
        });
        resetButton.disabled = Object.keys(customMappings).length === 0;

        source.addEventListener("input", render);
        standardButton.addEventListener("click", () => setMode("standard"));
        personalButton.addEventListener("click", () => setMode("personal"));
        exceptions.addEventListener("change", () => {
            storeValue(EXCEPTIONS_KEY, String(exceptions.checked));
            render();
        });
        voiceSelect.addEventListener("change", () => storeValue(VOICE_KEY, voiceSelect.value));
        sourceListen.addEventListener("click", () => speak(source.value, voiceSelect.value));
        outputListen.addEventListener("click", () => speak(plainOutput, voiceSelect.value));
        clearButton.addEventListener("click", () => {
            source.value = "";
            inspector.textContent = "Select an underlined word to inspect how it was produced.";
            render();
            source.focus();
        });
        copyButton.addEventListener("click", async () => {
            try {
                await navigator.clipboard.writeText(plainOutput);
                const label = copyButton.textContent;
                copyButton.textContent = "Copied";
                window.setTimeout(() => { copyButton.textContent = label; }, 1200);
            } catch {
                const selection = window.getSelection();
                const range = document.createRange();
                range.selectNodeContents(output);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        });
        resetButton.addEventListener("click", () => {
            for (const phoneme of Object.keys(customMappings)) delete customMappings[phoneme];
            mappingInputs.forEach(input => { input.value = input.dataset.defaultValue; });
            saveMappings();
            resetButton.disabled = true;
            render();
        });
        output.addEventListener("click", event => {
            const word = event.target.closest(".english-spelling__word");
            if (!word) return;
            const pronunciation = word.dataset.pronunciation
                ? ` ${word.dataset.pronunciation}`
                : "";
            inspector.textContent = `${word.dataset.original} becomes ${word.textContent} using ${word.dataset.method}.${pronunciation}`;
        });

        populateVoices(voiceSelect);
        if ("speechSynthesis" in window) {
            speechSynthesis.addEventListener("voiceschanged", () => populateVoices(voiceSelect));
        }
        render();
        dictionary = await dictionaryPromise;
        render();
    }

    document.querySelectorAll("[data-english-spelling]").forEach(initialize);
})();
