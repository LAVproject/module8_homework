// Галерея
const gallery = document.querySelector('#gallery-img');
// Селект выбора животных
const selectAnimals = document.querySelector('#gallery-select_animals');
// Лоадер
const loader = document.querySelector('#gallery-loader');

// Подписка на событие Клик по кнопке Загрузить фото
document.querySelector('#gallery-button_load-img').addEventListener('click', (event) => {
    // Отменяем поведение браузера по умолчанию, которое происходит при обработке события
    event.preventDefault();

    // Скроем галерею
    gallery.classList.add('none')
    // Очистим галерею
    gallery.innerHTML = '';
    // Включим лоадер перед отправкой запроса
    loader.classList.remove('none');

    // Url загрузки изображений в зависимости от выбранного типа животных (API)
    let apiUrl

    // Проверка выбранного типа животных
    switch (selectAnimals.value) {
        // Собачки
        case 'dogs':
            apiUrl = 'https://dog.ceo/api/breeds/image/random/12';
            break
        // Кошечки
        case 'cats':
            apiUrl = 'https://api.thecatapi.com/v1/images/search?limit=10'
            break
    }

    // Отправка запроса на загрузку url изображений
    fetch(apiUrl)
        // Обработка ответа
        .then(response => {
            // Обработка ошибок
            if (!response.ok) {
                throw new Error(`Ошибка: ${response.status}`);
            }
            // Парсим ответ сервера в объект JS
            return response.json();
        })

        // Обработка полученного объекта данных
        .then(data => {
            // Функция получает массив url фотографий собачек из dog.ceo
            function getUrlDogs(data) {
                try {
                    // Данные получены
                    if (data.message) {
                        return data.message
                    }
                }
                catch (error) {
                    console.log('Ошибка при выполнении функции getUrlDogs(data): ', error)
                }
            }
            // Функция получает массив url фотографий кошечек из api.thecatapi.com
            function getUrlCats(data) {
                try {
                    // Временный массив, куда сложим полученные url фотографий кошек
                    const arrUrlCats = []

                    // Данные получены
                    if (data) {
                        // Переберем массив объектов
                        data.forEach(obj => {
                            // Проверка на наличие url
                            if (obj.url) {
                                // Добавляем url во временный массив
                                arrUrlCats.push(obj.url)
                            }
                        })
                        // Возвращаем полученный массив
                        return arrUrlCats
                    }
                }
                catch (error) {
                    console.log('Ошибка при выполнении функции getUrlCats(data): ', error)
                }
            }

            // Получаем url изображений
            const imagesUrl = selectAnimals.value === 'dogs' ? getUrlDogs(data) : getUrlCats(data);

            // Количество полученных url изображений
            let numberImagesUrl = imagesUrl.length
            // Счетчик загруженных изображений
            let counterLoadedImg = 0

            // Добавляем url изображений в галерею
            imagesUrl.forEach(imageUrl => {
                // Создаем элемент галереи
                const galleryItem = document.createElement('div');
                // Добавляем стили
                galleryItem.classList.add('gallery-img__item');

                // Создаем элемент изображения
                const image = new Image();
                image.src = imageUrl;
                image.alt = 'Фотография животного';
                // Отследим загрузку изображений
                image.onload = function () {
                    // Добавляем в счетчик загруженное изображение
                    counterLoadedImg = counterLoadedImg + 1

                    // Выводим в консоль прогресс загрузки изображений
                    console.log(`Изображений загружено: ${counterLoadedImg} из ${numberImagesUrl}`)

                    // Все изображения загружены
                    if (counterLoadedImg === numberImagesUrl) {
                        // Скрываем лоадер после завершения загрузки
                        loader.classList.add('none');
                        // Показываем галерею
                        gallery.classList.remove('none')
                        // Выводим в консоль статус результата
                        console.log('Все изображения в галерею загружены!')
                    }
                }
                // Добавим элемент изображения в элемент галереи
                galleryItem.appendChild(image);
                // Добавим элемент галереи в галерею
                gallery.appendChild(galleryItem);
            });
        })

        // Обработаем возможные ошибки загрузки изображений
        .catch(error => {
            console.error('Ошибка загрузки изображений:', error);
        })

        // Обрабатываем завершение получение ссылок на изображения
        .finally(() => {
            console.log('Ссылки на изображения для галереи получены!')
        });
})

