class MissionUrls {
    constructor() {
        this.baseUrl = 'http://localhost:3000';
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
