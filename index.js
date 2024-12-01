const D = [
    '2024-11-25',
    '2024-12-04',
    '2024-12-06',
];

const C = [
    'NONE',
    'WINTER',
    'VALENTINE_DAY',
];

const MAP = [
    '00001110000000001110000',
    '00011111000000011111000',
    '00111111100000111111100',
    '00111111110001111111100',
    '01111111111011111111110',
    '11111111111111111111111',
    '11111111111111111111111',
    '11111111111111111111111',
    '11111111111111111111111',
    '11111111111111111111111',
    '11111111111111111111111',
    '11111111111111111111111',
    '11111111111111111111111',
    '01111111111111111111110',
    '00111111111111111111100',
    '00011111111111111111000',
    '00001111111111111110000',
    '00000111111111111100000',
    '00000011111111111000000',
    '00000001111111110000000',
    '00000000111111100000000',
    '00000000001110000000000',
];

let SETTINGS = {
    'DATE': D[0],
    'CONFETTI': C[0],
    'VERSION': '0.1',
};

const $figure = document.querySelector('.figure');
const $percent = document.querySelector('.percent');

const $selectD = document.querySelector('[id="f-date"]');
const $selectC = document.querySelector('[id="f-confetti"]');

$selectD.innerHTML = '';
$selectC.innerHTML = '';

D.forEach(value => {
    const option = document.createElement('option');

    option.value = value;
    option.innerText = value;

    $selectD.appendChild(option);
});

C.forEach(value => {
    const option = document.createElement('option');

    option.value = value;
    option.innerText = value;

    $selectC.appendChild(option);
});

$selectD.addEventListener('change', function (event) {
    const v = event.target.value;
    const e = new CustomEvent('settings:change', {detail: {...SETTINGS, DATE: v}});

    if (!D.includes(v)) {
        return;
    }

    document.dispatchEvent(e);
    document.dispatchEvent(new CustomEvent('run'));
});

$selectC.addEventListener('change', function (event) {
    const v = event.target.value;
    const e = new CustomEvent('settings:change', {detail: {...SETTINGS, CONFETTI: v}});

    if (!C.includes(v)) {
        return;
    }

    document.dispatchEvent(e);
    document.dispatchEvent(new CustomEvent('run'));
});

document.addEventListener('settings:change', function (event) {
    localStorage.setItem('settings', JSON.stringify(event.detail));
});

document.addEventListener('run', function (event) {
    let s = undefined;

    try {
        s = JSON.parse(localStorage.getItem('settings'));
    } catch (e) {
        s = SETTINGS;
    }

    try {
        if (!D.includes(s.DATE)) throw new Error();
    } catch (e) {
        s = SETTINGS;
    }

    try {
        if (!C.includes(s.CONFETTI)) throw new Error();
    } catch (e) {
        s = SETTINGS;
    }

    SETTINGS = s;

    const dt = new Date(SETTINGS.DATE);

    const dtEnd = new Date(dt);
    dtEnd.setDate(dtEnd.getDate() + 365);

    const dtStr = `${dt.getDate()}.${dt.getMonth() + 1}.${dt.getFullYear()}`;
    const dtEndStr = `${dtEnd.getDate()}.${dtEnd.getMonth() + 1}.${dtEnd.getFullYear()}`;

    document.querySelector('.range').innerText = `${dtStr} / ${dtEndStr}`;

    $selectD.value = SETTINGS.DATE;
    $selectC.value = SETTINGS.CONFETTI;

    $figure.innerHTML = '';

    let counter = 0;

    MAP.forEach(r => {
        r.split('').forEach(c => {
            const $FRAGMENT = $figure.appendChild(document.createElement('div'));
            $FRAGMENT.dataset.counter = (counter + 1);
            $FRAGMENT.classList.add('figure__fragment');

            if (c === '0') {
                $FRAGMENT.classList.add('--hidden');
            } else {
                const dt_1 = new Date(dt);
                dt_1.setDate(dt.getDate() + (364 - counter));
                dt_1.setHours(0);
                dt_1.setMinutes(0);
                dt_1.setSeconds(0);
                dt_1.setMilliseconds(0);

                const dt_2 = new Date(dt);
                dt_2.setDate(dt.getDate() + (364 - counter));
                dt_2.setHours(23);
                dt_2.setMinutes(59);
                dt_2.setSeconds(59);
                dt_2.setMilliseconds(59);

                const percent = calculatePercentageFilled(dt_1, dt_2);

                if (percent > 0) {
                    $FRAGMENT.classList.add('--progress');
                    $FRAGMENT.style.setProperty('--progress', `${percent}%`);

                    if (percent >= 80) {
                        $FRAGMENT.classList.add('--active');
                    }
                }

                counter++;
            }
        });
    });
});

document.dispatchEvent(new CustomEvent('run'));

function calculatePercentageFilled(date1, date2) {
    const now = new Date();

    if (now < date1) {
        return 0;
    } else if (now >= date2) {
        return 100;
    } else {
        const elapsedTime = now - date1;
        const totalTime = date2 - date1;

        return Math.min(Math.max((elapsedTime / totalTime) * 100, 0), 100);
    }
}

(function percent() {
    const dt = new Date(SETTINGS.DATE);

    const dtEnd = new Date(dt);
    dtEnd.setDate(dtEnd.getDate() + 365);

    $percent.innerText = `${calculatePercentageFilled(dt, dtEnd).toFixed(7)}%`;

    requestAnimationFrame(percent);
})();


(function frame() {
    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    if (SETTINGS.CONFETTI === 'WINTER') {
        confetti({
            particleCount: 1,
            startVelocity: 0,
            origin: {
                x: Math.random(),
                y: Math.random(),
            },
            colors: ["#f8fafc"],
            shapes: ["circle"],
            gravity: randomInRange(0.4, 0.6),
            scalar: randomInRange(0.4, 1),
            drift: randomInRange(-0.4, 0.4),
        });
    } else if (SETTINGS.CONFETTI === 'VALENTINE_DAY') {
        confetti({
            particleCount: 1,
            startVelocity: 0,
            origin: {
                x: Math.random(),
                y: Math.random(),
            },
            colors: ["FFC0CB", "FF69B4", "FF1493", "C71585"],
            shapes: ["heart"],
            gravity: randomInRange(0.4, 0.6),
            scalar: randomInRange(0.4, 2),
            drift: randomInRange(-0.4, 0.4),
        });
    }
    requestAnimationFrame(frame);
})();
