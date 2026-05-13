// includes.js – lädt gemeinsame Bestandteile (Header, Footer, Cookie-Banner, Back-to-Top)
// Sucht nach <div data-include="..."> Tags und ersetzt sie durch den Inhalt der Partial-Datei.
// Cache-Buster verhindert dass Browser veraltete Partials zeigen.
(async function() {
    const partials = [
        { selector: '[data-include="cookie-banner"]', file: '/partials/cookie-banner.html' },
        { selector: '[data-include="header"]',       file: '/partials/header.html' },
        { selector: '[data-include="footer"]',       file: '/partials/footer.html' },
        { selector: '[data-include="back-to-top"]',  file: '/partials/back-to-top.html' }
    ];

    // Cache-Buster: Datei wird jedes Mal frisch geladen, kein veralteter Inhalt
    const cacheBuster = '?v=' + Date.now();

    for (const partial of partials) {
        const elements = document.querySelectorAll(partial.selector);
        if (elements.length === 0) continue;

        try {
            const response = await fetch(partial.file + cacheBuster, { cache: 'no-store' });
            if (!response.ok) {
                console.error('Partial konnte nicht geladen werden:', partial.file, response.status);
                continue;
            }
            const html = await response.text();
            elements.forEach(el => {
                el.outerHTML = html;
            });
        } catch (err) {
            console.error('Fehler beim Laden von:', partial.file, err);
        }
    }

    // Event dispatchen, damit script.js weiß: jetzt sind alle Elemente da
    document.dispatchEvent(new Event('partialsLoaded'));
})();
