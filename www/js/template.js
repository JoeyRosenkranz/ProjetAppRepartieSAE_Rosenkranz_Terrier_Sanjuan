// template.js
// Centralise la gestion des templates Handlebars

export function renderTemplate(templateId, data, targetId) {
    const tplSrc = document.getElementById(templateId).innerHTML;
    const tpl = Handlebars.compile(tplSrc);
    document.getElementById(targetId).innerHTML = tpl(data);
}

