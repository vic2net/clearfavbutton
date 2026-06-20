(function () {
    /*
     * @AndreyURL54 для https://t.me/lampa_plugins_uncensored/120480
     * Плагин добавляет боковое меню в настройках Lampa.
     * Ничего не удаляет при подключении.
     */

    'use strict';

    var pluginId = 'clear_history_favorite_menu';

    if (window[pluginId]) return;
    window[pluginId] = true;

    function notify(text) {
        if (Lampa.Noty) Lampa.Noty.show(text);
    }

    function clearFavorite() {
        var fav = Lampa.Storage.get('favorite', {});

        Object.keys(fav).forEach(function (key) {
            if (Array.isArray(fav[key])) fav[key] = [];
            else if (fav[key] && typeof fav[key] == 'object') fav[key] = {};
            else delete fav[key];
        });

        Lampa.Storage.set('favorite', fav);
    }

    function clearHistory() {
        var history = Lampa.Storage.get('history', {});

        if (Array.isArray(history)) {
            history = [];
        } else if (history && typeof history == 'object') {
            Object.keys(history).forEach(function (key) {
                if (Array.isArray(history[key])) history[key] = [];
                else if (history[key] && typeof history[key] == 'object') history[key] = {};
                else delete history[key];
            });
        } else {
            history = {};
        }

        Lampa.Storage.set('history', history);
    }

    function clearAll() {
        clearHistory();
        clearFavorite();
        notify('История и избранное очищены');
    }

    function createSettings() {
        if (!Lampa.SettingsApi) return;

        Lampa.SettingsApi.addComponent({
            component: pluginId,
            name: 'Очистка истории',
            icon: '<svg height="260" viewBox="0 0 244 260" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M40 78h164v156c0 14-12 26-26 26H66c-14 0-26-12-26-26V78zm38-48h88l12 22h52v26H14V52h52l12-22zm18 82v102h20V112H96zm48 0v102h20V112h-20z" fill="white"/></svg>'
        });

        Lampa.SettingsApi.addParam({
            component: pluginId,
            param: {
                name: pluginId + '_clear',
                type: 'button',
                default: false
            },
            field: {
                name: 'Очистить историю и избранное'
            },
            onChange: clearAll
        });

        Lampa.SettingsApi.addParam({
            component: pluginId,
            param: {
                name: pluginId + '_no',
                type: 'button',
                default: false
            },
            field: {
                name: 'Нет'
            },
            onChange: function () {
                notify('Отменено');
            }
        });
    }

    function start() {
        createSettings();
    }

    if (window.appready) start();
    else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type == 'ready') start();
        });
    }
})();
