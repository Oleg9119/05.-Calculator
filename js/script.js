window.addEventListener("DOMContentLoaded", function () {

    "use strict";

    //Tabs-------------------------------------------------------------------->
    let tabs = document.querySelectorAll(".info-header-tab"),
        tabsContainer = document.querySelector(".info-header"),
        tabsContents = document.querySelectorAll(".info-tabcontent");

    function hideTabsContents(a) {
        for (let i = a; i < tabsContents.length; i++) {
            tabsContents[i].classList.remove('show');
            tabsContents[i].classList.add('hide');
        }
    }
    hideTabsContents(1);

    function showTabContent(b) {
        if (tabsContents[b].classList.contains('hide')) {
            tabsContents[b].classList.remove('hide');
            tabsContents[b].classList.add('show');
        }
    }

    tabsContainer.addEventListener('click', function (event) {
        let target = event.target;
        if (target && target.classList.contains("info-header-tab")) {
            for (let i = 0; i < tabs.length; i++) {
                if (target == tabs[i]) {
                    hideTabsContents(0);
                    showTabContent(i);
                    break;
                }
            }
        }
    });
    //<-----------------------------------------------------------------------




    //Timer-------------------------------------------------------------------->
    let deadline = '2020-06-16';

    //Функция определяющая остаток времени, которая возвращает часы, минуты и секунды
    function getTimeRemaining(endtime) {
        let t = Date.parse(endtime) - Date.parse(new Date()), //количество милисекунд = дата дедлайна минус текущая дата
            seconds = Math.floor((t / 1000) % 60),
            minutes = Math.floor((t / 1000 / 60) % 60),
            hours = Math.floor((t / (1000 * 60 * 60)));
        // hours = Math.floor((t/1000/60/60) % 24), //если нужны дни в таймере
        // days = Math.floor((t/(1000*60*60*24)))  

        return {
            'total': t,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }
    //Функция превращающая статическую верстку в динамическую
    function setClock(id, endtime) {
        let timer = document.getElementById(id),
            hours = timer.querySelector('.hours'),
            minutes = timer.querySelector('.minutes'),
            seconds = timer.querySelector('.seconds'),
            timeInterval = setInterval(updateClock, 1000);

        function updateClock() {
            let t = getTimeRemaining(endtime);

            function addZero(num) {
                if (num <= 9) {
                    return '0' + num;
                } else return num;
            }

            hours.textContent = addZero(t.hours);
            minutes.textContent = addZero(t.minutes);
            seconds.textContent = addZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
                hours.textContent = '00';
                minutes.textContent = '00';
                seconds.textContent = '00';
            }
        }
    }
    setClock('timer', deadline);
//<-------------------------------------------------------------------------/


//Modal window-------------------------------------------------------------------->
    let more = document.querySelector('.more'),
        overlay = document.querySelector('.overlay'),
        close = document.querySelector('.popup-close');

    more.addEventListener('click', function() {
        overlay.style.display = 'block';
        this.classList.add('more-splash');
        document.body.style.overflow = 'hidden';
    });

    close.addEventListener('click', function() {
        overlay.style.display = 'none';
        more.classList.remove('more-splash');
        document.body.style.overflow = '';
    });
//<-------------------------------------------------------------------------/


//Form-------------------------------------------------------------------->
    let message = {
        loading: 'Загрузка...',
        success: 'Спасибо! Скоро мы с Вами свяжемся',
        failure: 'Что-то пошло не так...'
    };

    let form = document.querySelector('.main-form'),
        inputs = form.getElementsByTagName('input'),
        statusMessage = document.createElement('div');

    statusMessage.classList.add('status');

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        form.appendChild(statusMessage);

        let request = new XMLHttpRequest();
        request.open('POST', 'server.php');
        request.setRequestHeader('Content-type', 'application/json; charset=utf-8');

        //Получаем все данные, которые ввел пользователь (в виде ключ/значение)
        let formData = new FormData(form);
        
        //Создаем новый объект, в который помещаем все данные от пользователя
        let obj = {};

        //Помещаем все данные объекта formData в объект obj
        formData.forEach(function(value, key) {
            obj[key] = value;
        });

        //Превращаем его в JSON-формат. Получаем переменную, в которой лежат все наши данные с формы
        let json = JSON.stringify(obj);

        //Отправляем запрос на сервер
        request.send(json);

        request.addEventListener('readystatechange', function() {
            if (request.readyState < 4) {
                statusMessage.innerHTML = message.loading;
            } else if (request.readyState === 4 && request.status == 200) {
                statusMessage.innerHTML = message.success;
            } else {
                statusMessage.innerHTML = message.failure;
            }
        });

        for (let i = 0; i < inputs.length; i++) {
            inputs[i].value = '';
        }
    });
//<-------------------------------------------------------------------------/



//Slider-------------------------------------------------------------------->
    let slideIndex = 1,
        slides = document.querySelectorAll('.slider-item'),
        prev = document.querySelector('.prev'),
        next = document.querySelector('.next'),
        dotsWrap = document.querySelector('.slider-dots'),
        dots = document.querySelectorAll('.dot');

    showSlides(slideIndex);  //Показываем самый первый слайд

    function showSlides(n) {
        //Если закончились слайды (возвращаемся к самому первому слайду)
        if (n > slides.length) {
            slideIndex = 1;
        }
        //Если закончились слайды (возвращаемся к самому последнему слайду)
        if (n < 1) {
            slideIndex = slides.length;
        }

        slides.forEach((item) => item.style.display = 'none'); //Скрываем все слайды
        //Это одно и то же
        // for (let i = 0; i < slides.length; i++) {
        //     slides[i].style.display = 'none';
        // }
        dots.forEach((item) => item.classList.remove('dot-active')); //Скрываем все точки
        slides[slideIndex - 1].style.display = 'block';
        dots[slideIndex - 1].classList.add('dot-active');
    }

    function plusSlides(n) {
        showSlides(slideIndex += n);
    }

    function currentSlide(n) {
        showSlides(slideIndex = n);
    }

    prev.addEventListener('click', function() {
        plusSlides(-1);
    });

    next.addEventListener('click', function() {
        plusSlides(1);
    });

    dotsWrap.addEventListener('click', function(event) {
        for (let i = 0; i < dots.length + 1; i++) {
            if (event.target.classList.contains('dot') && event.target == dots[i-1]) {
                currentSlide(i);
            }
        }
    });
//<-------------------------------------------------------------------------/


//Calculator-------------------------------------------------------------------->
    let persons = document.querySelectorAll('.counter-block-input')[0],
        restDays = document.querySelectorAll('.counter-block-input')[1],
        place = document.getElementById('select'),
        totalValue = document.getElementById('total'),
        personsSum = 0,
        daysSum = 0,
        total = 0;

        totalValue.innerHTML = 0;        

        persons.addEventListener('change', function() {
            personsSum = +this.value;
            total = (daysSum + personsSum) * 4000; //Рандомная формула расчета

            if(restDays.value == '' || persons.value == '') {
                totalValue.innerHTML = 0;
            } else {
                totalValue.innerHTML = total;
            }
        });

        restDays.addEventListener('change', function() {
            daysSum = +this.value;
            total = (daysSum + personsSum) * 4000; //Рандомная формула расчета

            if (restDays.value == '' || persons.value == '') {
                totalValue.innerHTML = 0;
            } else {
                totalValue.innerHTML = total;
            }
        });

        place.addEventListener('change', function() {
            if (restDays.value == '' || persons.value == '') {
                totalValue.innerHTML = 0;
            } else {
                let a = total;
                totalValue.innerHTML = a * this.options[this.selectedIndex].value;
            }
        });
//<-------------------------------------------------------------------------/

});



