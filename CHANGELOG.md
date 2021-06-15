# Change log
В этом документе описываются все изменения по версиям, проекта Urrobot
**Версия 1.4.2 является последней версией на Vue 2.6** до финальных тестов версия 1.4.2 будет использоваться на основном сервере, версия же 2.0.0 уже с полноценной функцией Server-Side Rendering (SSR) и новой версией Vue пока что будет находить только на тестовых серверах.

- (Public) - Обозначает версию пользовательского интерфейса
- (Admin panel) - Обозначает версию админ панели
- (Editor) - Обозначает версию конструктора документов
- *Активная версия пишется в подвале сайдбара* 
- (Testing) - Обозначает нахождение версии только на тестовом сервере

## [2.0.5b] (Public) | [1.3.2] (Admin panel) Testing
Обновление bug-fix и корректировка стилей, так же добавлена функция изменения порядка столбцов csv в админ панель 

## Добавлено
- Добавлена адаптивность на широкоформатные мониторы до 4к
- Функция изменения положения столбцов csv документе (Админ)

## Изменено
- Вкладка *настройки* перемещена в *панель управления*
- Исправлена прокрутка в модуле уведомлений
- Исправлено появление прокрутки по оси `x` в модуле `настройки` 

## [2.0.4 - 2.0.5a] (Public) Testing
По цепочно связанные версии, добавления функцинала тем (день\ночь), завершение работы с разделом *Отчеты*, доабвление e2e тестов на модуль авторизации

## Добавлено
- Функционал смены тем 
- Добавлен скрипт отслеживание дата атрибута html 
- Обработка scss перменным для использование в синтаксисе css и наоборот 
- Изменение функций затемнения и осветления в scss (*Будет замена на обработчик переменных css для работы с этими функциями*)
- Добавлены финальные ряды в раздел Отчеты
- Добавлена функция Drag n Drop в раздел Отчеты
- Добавлена в шапку кнопка быстрой смены темы

## Исправлено
- Баг с не затемненым фоном при открытие модалки
- Баг DnD с перетаскиванием только рядов в разделе отчеты
- Баг отслеживание режима активной темы 

## [2.0.3] (Public) Testing
Доравботка 2/3 модуля *Отчеты*, исправление ошибок в логике и дизайне модуля.
Так же давбавлены заглушки новых модулей

## Добалено
- 4 ряда согласно макету (модуль Отчеты)
- Добавлена библиотека `k-progress` для создание прогресс баров
- Добавлено две вкладки в разделе обмен данными (Выгрузка и Интеграция) - Импорт переименован в Загрузка 
- Добавлена кнопка создание организаций в разделе *Организации*

## Исправлено
- Цветовая гамма графиков в разделе Отчеты

## [2.0.2] (Public) Testing
Добавление нового модуля *Отчеты* и исправление багов

## Добавлено
- Создана страница Рабочий стол (Отчеты)
- Добавлена библиотека управления и создания графиков `apex chart`
- Загружены первые два ряда графиков согласно макету

## Изменено
- Структура регистрации пользователя по новой апи (*только для новой апи*)
- Миксин запроса данных изменен для новой апи 

## [2.0.1] (Public) Testing
Обновление bug-fix, в последующих обновлениях вплоть до версии `2.1.0X` будут исправления как решений со стороны бэка, так и исправление ошибок в визуальной и скриптовой работе фронтовой части
## Исправлено
- Отображение уведомлений об ошибках (серверная часть например: *не верный пароль*, *Данного документа нет* и тд)
- При отсутсвии должников не отображалась модальное окно загрузки новых должников с инструкцией
- Вход в приложение (на вход нужно было нажать дважды)
- Ошибка с обращением к хранилищу внутри роутера и наоборот

## Изменено
- Модуль импорт переименован в **Загрузка**
- В разделе организации переноситься отношения кнопку *Сохранить изменения* на все окна (некоторые окна еще в работе)

## Добавлено 
- Синхранизатор роутера и Vuex 

## [2.0.0] (Public) Testing
Полный переход на `SSR` и добавление express для удобства долнейшего лучшения приложения, а так же подготовка к созданию `PWA` режима и переход на новую версию `Vue`

## Добавлено
1. Сервераная часть
- Создание и настройка express для установки серверного рендеринга
- Добавление функции игнорирование IP хоста (hot-fix что бы приложение видело доменное имя)
- Создание точки входа сервера и клиента
- Отслеживание и обработка отдачи данных пользователю (pre-fetching)
- Создание манифестов для обработки скриптов и файлов приложения сервером
- Установка и настройка SSR для работы с клиентской частью
2. Клиентская часть
- Обращение к Приложению, хранилищу и роутеру изменено (create функции)
- Добавлен обработчик no-ssr для точго что бы проверять что должно грузиться со стороны сервера, а что только для клиента
- Добавление функции проверки загрузки компонентов
- Синхронизирование роутера как часть глобального хранилища
- Переподключение гидрации*
- Изменение обращения в store со стороны роутера
- Добавление функции проверки ssr компиляции компонента по типу `Nuxt`

## Удалено
- Мусорные функции и более не нужные обработчики
- Постепенно исключается использование фильтров. Во `Vue 3` они полностью упразднены так что их использование как и `emit` что в скоре будет заменен на библиотеку `mit` пока что используется гибридно, **оба раздела будут переработаны**.
- Удаление пошаговой отрисовки контента
- Удаление некоторых функций обработчиков во `Vuex`

## [1.4.2] (Public) | [0.6.2] (Editor) | [1.3.1] (Admin panel) - 2021-01-08 (pre-release)
Исправление багов, добавление новых функций в раздел *Организации* и добавление новой переменной в конструктор документов 

## Добавлено
- Редактирование предсавителей по доверенности
- Валидатор редактирования и создания нового подписанта
- Добавлена переменная (*Задолженость возникшая при расчете пени*)

## Исправлено
- Обработка свода начислений на печать
- Обработка id приложений (Admin panel)
- Vuex компонент печати документов
- Обработка функции `getStatusDischarge` (бесконечная загрузка)

## Удалено
- Вариант шаблона Свода начилений  

## [1.4.1] - 2021-01-06 (Public)
Исправление ошибок в логике работы таблицы должников и обработки расчета пени и импортирования данных

## Добавлено
- Во время импортирования данных возможность редактирования блока импорта будет не доступна
- Добавлена функция обработки параметра `disabled` в компоненте *SelectGray*
- HTML шаблон для документа пени (для *бэка*)

## Исправлено
- Сброс сортировки при выборе должника (исправлено)
- Вывод индикатора загрузки (обмен данных)

## Удалено
- Очишены функции обработчики сортировки от лого и не нужных переменных
- Удалены функции дубликаты в файлах

## [1.4.0] - 2020-12-30 (Public)
Обновление трансфер для перехода на новую версию Vue 3 

## Изменено
- Изменены функции (app, store, route)
- Изменены классы формирования шаблонов на стороне фронта (для Vue3) 
- Изменеы функции обращения к глобальным event'ам 
- Фильтры более не поддерживаются во Vue 3, и были заменены на computed 
- Обновлена функция подгрузки должников 

## Исправлено
- Дублирование данных должников при подгрузки скролом
- Бесконечная прокрутка
- Убран запрос вызова полного прелоадера при подгрузке должников

## [1.3.0] - 2020-12-27 (Public)
Big update rendering, optimize and boost page speed and project function 
## Added
- New npm package ssr for cli
- Add webpack (add webpack.config and server.config)
- SSR function for main.js
- add entry-client (entry point Client SSR)
- add entry-server (entry point Server SSR)
- add server.js SSR

## [1.2.1] (Public) | [0.6.1] (Editor) - 2020-12-25
Fix setOfCharges template and statementJudical function for request this data
## Added 
- Callback function for setOfCharges
- Server Side Rendering on Vue + Express
- Edit table width (Editor)
- New fix request for template edit mod (utf-8 force paste) + template list style 

## [1.2] - 2020-12-24 (Public)
Big scroll loading update for optimized update and loading debtors data

## Added
- New function listiner length debtor array (on page Real-time)
- Add function on-load debtors per scroll down on table footer
- listiner for user max debtor on page
- Transfer setOfCharges template generation on back
- Add id -9 for setOfCharges

## Disabled/Remove
- Disabled buttons "формирование приложения" on user debtors table and user debtors interface
- Remove old setOfCharges template and linked function

## [1.1.9] (Public) | [0.5.5 => 0.6] (Editor) 2020-12-22
Preparing for the installation of ssr and removing unnecessary functions and adding blanks for batch loading of debtors

Combined update of the component editor.
Added new variables and optimized template loading

## Added
- ssr main.js wrapper (*for v1.2.1* and *for 1.3.0*)
- new variables in Editor (setOfCharges) (0.5.5)
- Add table generation Editor (setOfCharges) (0.6)
- scroll spy for debtors table
- optimized setOfCharges front template

## Deleted 
- useless import in main.js 

## Fixed
- Fixed undefined 'Name' in search-input component for set template value

## [1.3] - 2020-12-21 (Admin panel)
add setOfcharges templates selector

## Added
- Select for setOfCharges
- Axios request + validation for search-input
- Transfer root request userl list to local component

## Deleted
- root request admin user list 

## [1.1.8] - 2020-12-21 (Public)
Removing unused functions and classes + new client base (caching)

## Added
- New client side base

## Deleted/Remove
- Unuset components, function and classes (MainTable.vue, HotButtonsSettings.vue, idb.js, ManageHotButtons.vue, OldCalculationPeni, clientsData)
- Remove useless import

## [1.1.7a] - 2020-12-21 (Public)

Bugfix update + lazy loading for App included components

### Added
- CHANGELOG.md
- setofcharges.html (temporarily) // Шаблон для свода начислений
- Deleted umpty object & array from debtors item (Back)
- Added checking for presence in the debtor object (Accrued, AllFileDebt, AllFileDebtFromEgrn, AllFileDebtPassportOffice, AllFileDebtPaymentOrderStateDuty, AllFileDebtTransferRights, Paid)

### Changed
- 1 Main.js
   - 1.1 lazy loading for included components

### Deleted 
    - from Main.js
        // Vue.prototype.$http = Axios
        // const token = localStorage.getItem('token')
        // // eslint-disable-next-line dot-notation
        // if (token) Vue.prototype.$http.defaults.headers.common['Authorization'] = token