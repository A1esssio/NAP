class MissionUrls {
    constructor() {
        // После сборки и раздачи через бэкенд — относительный путь
        // В dev-режиме (vite) — абсолютный localhost:3000
        this.baseUrl = '/api';
    }

    getMissions() {
        return `${this.baseUrl}/missions`;
    }

    getMissionById(id) {
        return `${this.baseUrl}/missions/${id}`;
    }

    createMission() {
        return `${this.baseUrl}/missions`;
    }

    removeMissionById(id) {
        return `${this.baseUrl}/missions/${id}`;
    }

    updateMissionById(id) {
        return `${this.baseUrl}/missions/${id}`;
    }
}

export const stockUrls = new MissionUrls();
