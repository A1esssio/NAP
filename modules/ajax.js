class Ajax {
    /**
     * GET запрос
     * @param {string} url - Адрес запроса
     * @returns {Promise<{data: any, status: number}>}
     */
    async get(url) {
        try {
            const response = await fetch(url);
            const data = await response.json();
            return { data, status: response.status };
        } catch (e) {
            console.error('Ошибка GET запроса:', e);
            return { data: null, status: 0 };
        }
    }

    /**
     * POST запрос
     * @param {string} url - Адрес запроса
     * @param {object} body - Данные для отправки
     * @returns {Promise<{data: any, status: number}>}
     */
    async post(url, body) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            const data = await response.json();
            return { data, status: response.status };
        } catch (e) {
            console.error('Ошибка POST запроса:', e);
            return { data: null, status: 0 };
        }
    }

    /**
     * PATCH запрос
     * @param {string} url - Адрес запроса
     * @param {object} body - Данные для обновления
     * @returns {Promise<{data: any, status: number}>}
     */
    async patch(url, body) {
        try {
            const response = await fetch(url, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            const data = await response.json();
            return { data, status: response.status };
        } catch (e) {
            console.error('Ошибка PATCH запроса:', e);
            return { data: null, status: 0 };
        }
    }

    /**
     * DELETE запрос
     * @param {string} url - Адрес запроса
     * @returns {Promise<{data: any, status: number}>}
     */
    async delete(url) {
        try {
            const response = await fetch(url, { method: 'DELETE' });
            // DELETE может вернуть 204 без тела
            const data = response.status !== 204 ? await response.json() : null;
            return { data, status: response.status };
        } catch (e) {
            console.error('Ошибка DELETE запроса:', e);
            return { data: null, status: 0 };
        }
    }
}

export const ajax = new Ajax();
