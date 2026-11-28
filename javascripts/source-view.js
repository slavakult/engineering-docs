/* ==========================================================
   Markdown Source Viewer
   ========================================================== */

(() => {

    /* ======================================================
       Параметры URL
       ====================================================== */

    const params = new URLSearchParams(window.location.search);

    const repo = params.get("repo");
    const branch = params.get("branch");
    const file = params.get("file");

    const backUrl = params.get("back");

    /* Жёсткая проверка: только "dark" или "light" */
    const theme = params.get("theme") === "dark"
        ? "dark"
        : "light";


    /* ======================================================
       Переводы
       ====================================================== */

    const lang = params.get("lang") || "ru";

    const translations = {

        ru: {
            title: "Исходный код Markdown",
            back: "← Вернуться к документации",
            github: "Открыть файл на GitHub ↗",
            copy: "Копировать Markdown",
            copied: "Скопировано!",
            copyError: "Не удалось скопировать",
            loading: "Загрузка исходного кода...",
            error: "Не удалось загрузить исходный файл",
            invalid: "Не удалось определить исходный файл",
            footer: "Исходный код документации"
        },

        en: {
            title: "Markdown Source",
            back: "← Back to documentation",
            github: "Open file on GitHub ↗",
            copy: "Copy Markdown",
            copied: "Copied!",
            copyError: "Copy failed",
            loading: "Loading source code...",
            error: "Unable to load source file",
            invalid: "Could not identify source file",
            footer: "Documentation source"
        }

    };


    const t = lang.toLowerCase().startsWith("en")
        ? translations.en
        : translations.ru;


    /* ======================================================
       Элементы страницы
       ====================================================== */

    const backLink = document.getElementById("back-link");
    const githubLink = document.getElementById("github-link");

    const title = document.getElementById("title");
    const pageTitle = document.getElementById("page-title");

    const filePath = document.getElementById("file-path");
    const status = document.getElementById("status");

    const code = document.getElementById("code");
    const copyButton = document.getElementById("copy-button");

    const footer = document.getElementById("footer");

    const themeToggle = document.getElementById("theme-toggle");
    const themeIcon = document.getElementById("theme-icon");


    /* ======================================================
       Язык и тема
       ====================================================== */

    document.documentElement.lang = lang;

    document.documentElement.setAttribute(
        "data-theme",
        theme
    );


    /* ======================================================
       Перевод интерфейса
       ====================================================== */

    document.title = t.title;

    title.textContent = t.title;
    pageTitle.textContent = t.title;

    backLink.textContent = t.back;
    githubLink.textContent = t.github;

    copyButton.textContent = t.copy;

    status.textContent = t.loading;
    footer.textContent = t.footer;


    /* ======================================================
       Ссылка возврата
       ====================================================== */

    const documentationUrl = backUrl
        || new URL("./", window.location.href).toString();

    backLink.href = documentationUrl;


    backLink.addEventListener("click", (event) => {

        event.preventDefault();

        window.close();

        setTimeout(() => {

            if (!window.closed) {
                window.location.replace(documentationUrl);
            }

        }, 150);

    });


    /* ======================================================
       Переключение темы внутри просмотрщика
       ====================================================== */

    function getCurrentTheme() {
        return document.documentElement.getAttribute("data-theme")
            || "light";
    }

    function updateThemeIcon() {
        const current = getCurrentTheme();

        themeIcon.textContent = current === "dark"
            ? "☀️"
            : "🌙";

        themeToggle.title = current === "dark"
            ? "Светлая тема"
            : "Тёмная тема";
    }

    themeToggle.addEventListener("click", () => {

        const current = getCurrentTheme();
        const next = current === "dark" ? "light" : "dark";

        document.documentElement.setAttribute(
            "data-theme",
            next
        );

        localStorage.setItem("source-view-theme", next);

        updateThemeIcon();

    });

    updateThemeIcon();


    /* ======================================================
       Проверка параметров
       ====================================================== */

    if (!repo || !branch || !file) {

        status.textContent = t.invalid;
        status.classList.add("error");

        copyButton.disabled = true;

        return;
    }


    /* ======================================================
       Ссылка на GitHub
       ====================================================== */

    const githubUrl =
        `https://github.com/${repo}/blob/${branch}/${file}`;

    githubLink.href = githubUrl;


    /* ======================================================
       Отображение пути
       ====================================================== */

    filePath.textContent = `${repo}/${file}`;


    /* ======================================================
       Переменная для хранения исходного Markdown
       ====================================================== */

    let sourceText = "";


    /* ======================================================
       Отображение кода с номерами строк
       ====================================================== */

    function renderSource(text) {

        sourceText = text;

        code.innerHTML = "";

        const lines = text.split("\n");

        lines.forEach((line, index) => {

            const lineElement = document.createElement("span");
            lineElement.className = "line";

            const numberElement = document.createElement("span");
            numberElement.className = "line-number";
            numberElement.textContent = index + 1;

            const contentElement = document.createElement("span");
            contentElement.className = "line-content";

            contentElement.textContent = line;

            lineElement.appendChild(numberElement);
            lineElement.appendChild(contentElement);

            code.appendChild(lineElement);

        });

    }


    /* ======================================================
       Загрузка исходника с GitHub
       ====================================================== */

    async function loadSource() {

        const rawUrl =
            `https://raw.githubusercontent.com/${repo}/${branch}/${file}`;

        try {

            const response = await fetch(rawUrl);

            if (!response.ok) {
                throw new Error("Raw GitHub request failed");
            }

            const text = await response.text();

            renderSource(text);

            status.textContent = "";
            status.className = "";

            return;

        } catch (rawError) {

            console.warn(
                "Raw GitHub failed. Trying GitHub API.",
                rawError
            );

        }


        try {

            const apiUrl =
                `https://api.github.com/repos/${repo}` +
                `/contents/${file}?ref=${branch}`;

            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error("GitHub API request failed");
            }

            const data = await response.json();

            if (!data.content) {
                throw new Error("Source content is missing");
            }

            const base64 = data.content.replace(/\s/g, "");
            const binary = atob(base64);

            const bytes = Uint8Array.from(
                binary,
                character => character.charCodeAt(0)
            );

            const text = new TextDecoder("utf-8").decode(bytes);

            renderSource(text);

            status.textContent = "";
            status.className = "";

        } catch (error) {

            console.error(error);

            status.textContent = t.error;
            status.className = "error";

            code.textContent = "";
            copyButton.disabled = true;

        }

    }


    /* ======================================================
       Копирование Markdown
       ====================================================== */

    copyButton.addEventListener("click", async () => {

        if (!sourceText) {
            return;
        }

        try {

            await navigator.clipboard.writeText(sourceText);

            copyButton.textContent = t.copied;
            status.textContent = t.copied;
            status.className = "success";

            setTimeout(() => {

                copyButton.textContent = t.copy;
                status.textContent = "";
                status.className = "";

            }, 2000);

        } catch (error) {

            console.error(error);

            copyButton.textContent = t.copyError;
            status.textContent = t.copyError;
            status.className = "error";

            setTimeout(() => {

                copyButton.textContent = t.copy;
                status.textContent = "";
                status.className = "";

            }, 2000);

        }

    });


    /* ======================================================
       Запуск
       ====================================================== */

    loadSource();

})();