(function () {
    /*
     * @AndreyURL54 для https://t.me/lampa_plugins_uncensored/120480
     * Ручная очистка истории через кнопку в настройках Lampa.
     * Избранное не трогает.
     */

    'use strict';

    var pluginId = 'manual_clear_history_button';

    if (window[pluginId]) return;
    window[pluginId] = true;

    function emptyLikeCurrent(value) {
        if (Array.isArray(value)) return [];

        if (value && typeof value == 'object') {
            Object.keys(value).forEach(function (key) {
                if (Array.isArray(value[key])) value[key] = [];
                else if (value[key] && typeof value[key] == 'object') value[key] = {};
                else delete value[key];
            });

            return value;
        }

        return [];
    }

    function clearHistory() {
        var history = Lampa.Storage.get('history', []);

        Lampa.Storage.set('history', emptyLikeCurrent(history));

        if (Lampa.Noty) Lampa.Noty.show('История очищена');
    }

    function askClearHistory() {
        if (Lampa.Modal) {
            Lampa.Modal.open({
                title: 'Очистить историю',
                html: $('<div class="about">Удалить всю историю на этом устройстве?</div>'),
                size: 'small',
                buttons: [
                    {
                        name: 'Отмена',
                        onSelect: function () {
                            Lampa.Modal.close();
                        }
                    },
                    {
                        name: 'Очистить',
                        onSelect: function () {
                            clearHistory();
                            Lampa.Modal.close();
                        }
                    }
                ]
            });
        } else if (window.confirm('Удалить всю историю на этом устройстве?')) {
            clearHistory();
        }
    }

    function addSettingsButton() {
        Lampa.SettingsApi.addParam({
            component: 'account',
            param: {
                type: 'button',
                component: pluginId,
                name: 'Очистить историю',
                description: 'Удаляет историю просмотров. Избранное не изменяется.'
            },
            onChange: askClearHistory
        });
    }

    function start() {
        if (!Lampa.SettingsApi) return;

        addSettingsButton();
    }

    if (window.appready) start();
    else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type == 'ready') start();
        });
    }
})();
