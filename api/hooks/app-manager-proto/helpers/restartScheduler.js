let scheduledFor = null;
let restartTimer = null;
let restarting = false;

function getNextMidnight() {
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    return midnight;
}

function restartProcess(delay = 1000) {
    if (restartTimer) {
        clearTimeout(restartTimer);
        restartTimer = null;
    }
    restarting = true;
    setTimeout(() => {
        console.log('MM: restart: the process exits');
        process.exit(0);
    }, delay);
}

function scheduleRestart() {
    if (scheduledFor) {
        return getState();
    }

    const midnight = getNextMidnight();
    scheduledFor = midnight.toISOString();
    restartTimer = setTimeout(() => restartProcess(0), midnight.getTime() - Date.now());
    restartTimer.unref?.();
    return getState();
}

function getState() {
    return {
        scheduled: Boolean(scheduledFor),
        scheduledFor,
        restarting
    };
}

module.exports = {
    getState,
    scheduleRestart,
    restartNow: () => restartProcess(1000)
};
