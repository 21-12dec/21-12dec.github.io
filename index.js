const $NAV = document.querySelector('.nav');
const $FIGURE = document.querySelector('.figure');

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

function calculatePercentageFilled(date1, date2) {
    const now = new Date();

    if (now < date1) {
        return 0;
    } else if (now >= date2) {
        return 100;
    } else {
        const elapsedTime = now - date1;
        const totalTime = date2 - date1;

        return (elapsedTime / totalTime) * 100;
    }
}

$NAV.querySelectorAll('.nav__item[data-dt]').forEach(element => {
    element.addEventListener('click', function (event) {
        event.preventDefault();

        $NAV.querySelectorAll('.nav__item[data-dt].--active').forEach(element => element.classList.remove('--active'));

        this.classList.add('--active');

        $FIGURE.innerHTML = '';

        let counter = 0;

        MAP.forEach(r => {
            r.split('').forEach(c => {
                const $FRAGMENT = $FIGURE.appendChild(document.createElement('div'));
                $FRAGMENT.dataset.counter = (counter + 1);
                $FRAGMENT.classList.add('figure__fragment');

                if (c === '0') {
                    $FRAGMENT.classList.add('--hidden');
                } else {
                    const dt = new Date(this.dataset.dt);

                    const dt_1 = new Date(dt);
                    dt_1.setDate(dt.getDate() + (364 - counter));
                    dt_1.setHours(0);
                    dt_1.setMinutes(0);
                    dt_1.setSeconds(0);
                    dt_1.setMilliseconds(0);

                    console.log(dt_1);

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
});

$NAV.querySelectorAll('.nav__item[data-dt]')[0].click();