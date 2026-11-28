document$.subscribe(() => {

    /* ======================================================
       Ссылка на исходный Markdown
       ====================================================== */

    const sourceLinks = document.querySelectorAll(
        '.md-content__button[href*="github.com"], ' +
        '.md-content__button[href*="raw.githubusercontent.com"]'
    );

    sourceLinks.forEach((sourceLink) => {

        const url = new URL(sourceLink.href);
        const parts = url.pathname.split("/").filter(Boolean);

        let repo = "";
        let branch = "";
        let file = "";

        /* GitHub */
        if (url.hostname === "github.com") {

            const marker = parts.findIndex(
                part => part === "blob" || part === "raw"
            );

            if (marker !== -1 && marker >= 2) {
                repo = parts.slice(0, 2).join("/");
                branch = parts[marker + 1];
                file = parts.slice(marker + 2).join("/");
            }
        }

        /* Raw GitHub */
        if (url.hostname === "raw.githubusercontent.com") {

            repo = parts.slice(0, 2).join("/");
            branch = parts[2];
            file = parts.slice(3).join("/");
        }

        if (!repo || !branch || !file) {
            return;
        }

        /* Получаем корень сайта */
        const logo = document.querySelector(
            ".md-header__button.md-logo"
        );

        const siteRoot = logo
            ? logo.href
            : window.location.origin + "/engineering-docs/";

        /* Создаём ссылку на просмотрщик */
        const viewerUrl = new URL(
            "source-view.html",
            siteRoot
        );

        viewerUrl.searchParams.set("repo", repo);
        viewerUrl.searchParams.set("branch", branch);
        viewerUrl.searchParams.set("file", file);

        /* Язык интерфейса */
        const lang = document.documentElement.lang
            .toLowerCase()
            .startsWith("en")
            ? "en"
            : "ru";

        viewerUrl.searchParams.set("lang", lang);

        /* Тема оформления — определяем по реальному цвету фона */
        const bodyBg = window.getComputedStyle(
            document.body
        ).backgroundColor;

        const match = bodyBg.match(/\d+/g);

        let theme = "light";

        if (match && match.length >= 3) {
            const r = parseInt(match[0]);
            const g = parseInt(match[1]);
            const b = parseInt(match[2]);
            const brightness =
                (r * 299 + g * 587 + b * 114) / 1000;

            theme = brightness < 128 ? "dark" : "light";
        }

        viewerUrl.searchParams.set("theme", theme);

        /* Ссылка на текущую страницу документации */
        viewerUrl.searchParams.set(
            "back",
            window.location.href
        );

        /* Меняем ссылку */
        sourceLink.href = viewerUrl.toString();

        /* Открываем в новой вкладке */
        sourceLink.target = "_blank";
        sourceLink.rel = "noopener noreferrer";
    });


    /* ======================================================
       Ссылка на GitHub-репозиторий
       ====================================================== */

    const repoLink = document.querySelector(
        ".md-header__source a"
    );

    if (repoLink) {
        repoLink.target = "_blank";
        repoLink.rel = "noopener noreferrer";
    }


    /* ======================================================
       Режим чтения
       ====================================================== */

    const zenButton = document.querySelector(
        '[aria-label="Toggle Zen Mode"], ' +
        '[title="Toggle Zen Mode"], ' +
        '[aria-label="Toggle zen mode"], ' +
        '[title="Toggle zen mode"]'
    );

    if (zenButton) {

        /* Перевод подсказки */
        const lang = document.documentElement.lang
            .toLowerCase()
            .startsWith("en");

        const label = lang
            ? "Toggle reading mode"
            : "Режим чтения";

        zenButton.setAttribute("title", label);
        zenButton.setAttribute("aria-label", label);

        /* Не добавляем обработчик повторно */
        if (!zenButton.dataset.readingModeHandler) {

            zenButton.dataset.readingModeHandler = "true";

            zenButton.addEventListener("click", () => {

                document.body.classList.toggle(
                    "reading-mode"
                );

            });
        }
    }

});