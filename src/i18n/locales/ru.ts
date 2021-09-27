import { DictType } from '@/hooks/useDicts';
import { EmployeeRole } from '@/hooks/useEmployees';
import { DataTypeKey } from '@/hooks/useExchange';
import { ImportFileTemplate } from '@/store/modules/layout';
import { ExchangeImportMode, ExchangeImportPeriod } from '@/hooks/useExchangeImport';
import { ProductionType } from '@/hooks/useConstructor';

export default {
  sign: {
    title: `Добро пожаловать
на платформу по автоматизации взыскания задолженностей`,
    tabs: {
      in: 'Вход',
      up: 'Регистрация',
    },
    links: {
      agreement: 'Пользовательское соглашение',
      policy: 'Политика конфиденциальности',
    },
    in: {
      title: 'Войдите в ЮРРОБОТ',
      login: {
        placeholder: 'Введите почту или номер телефона',
      },
      password: {
        placeholder: 'Введите пароль',
      },
      agreement: {
        text: 'соглашаюсь на обработку персональных данных\n и принимаю {policy}',
        policy: 'политику конфеденциальности',
      },
      forgot: 'Забыли пароль?',
      demo: 'Демо Вход',
      submit: 'Войти',
    },
    up: {
      title: 'Вы с нами впервые?',
      subTitle: 'Присоединяйтесь!',
      inn: {
        placeholder: 'Введите ИНН',
      },
      login: {
        placeholder: 'Введите почту или номер телефона',
      },
      agreement: {
        text: 'соглашаюсь на обработку персональных данных\n и принимаю {policy}',
        policy: 'политику конфеденциальности',
      },
      demo: 'Демо Вход',
      submit: 'Регистрация',
    },
    confirm: {
      title: 'Подтверждение',
      subTitle: {
        text: 'Мы отправили вам код подтверждения на\n {data}',
        email: 'почту {email}',
        phone: 'номер {phone}',
      },
      wrong: {
        email: 'Неверный email?',
        phone: 'Неверный номер?',
      },
      resend: 'Отправить повторно',
      submit: 'Отправить',
      back: 'Назад',
    },
    password: {
      title: 'Установите пароль',
      password: {
        placeholder: 'Введите пароль',
      },
      passwordConfirmation: {
        placeholder: 'Повторите пароль',
      },
      submit: 'Готово',
    },
    forgot: {
      title: 'Забыли пароль?',
      subTitle: 'Введите адрес электронной почты или\n телефона, который вы использовали\n при регистрации, и мы отправим вам инструкции по восстановлению пароля.',
      login: {
        placeholder: 'Введите почту или номер телефона',
      },
      submit: 'Отправить',
    },
  },
  other: {
    sec: 'сек.',
    na: 'Н/Д',
    year: '{year} год',
    cancel: 'Отмена',
    confirm: 'Подтвердить',
    yes: 'Да',
    no: 'Нет',
    ok: 'Ок',
    currencyPerItem: '{amount} руб/шт',
    dateFromTo: 'с {from} по {to}',
    dateFromNow: 'с {from} по настоящее время',
    edit: 'Редактировать',
  },
  header: {
    stat: {
      decisions: 'Вынесено решение',
      inCourt: 'Подано в суд',
      inProgress: 'В работе',
      new: 'Новый',
      rejected: 'Отозвано',
    },
    user: {
      changeTheme: 'Изменение темы',
      changePassword: 'Сменить пароль',
      signOut: 'Выход',
    },
  },
  sidebar: {
    copyright: '© Юрробот {years}',
    version: 'Версия: {version}',
    menu: {
      organizations: 'Организации',
      debtors: 'Работа с\n должниками',
      exchange: 'Обмен\n данными',
      panel: 'Панель\n управления',
    },
  },
  companies: {
    title: 'Организации',
    table: {
      column: {
        name_full: 'Полное наименование',
        name_short: 'Сокращенное\n наименование',
        inn: 'ИНН',
        legal_address: 'Юридический адрес',
      },
      filter: {
        placeholder: 'Введите текст',
      },
      action: {
        add: 'Добавить организацию',
        setDefault: {
          label: 'Установить по умолчанию',
          title: 'Смена организации по умолчанию',
          message: 'Вы уверены, что хотите установить организацию\n "{name}"\n по умолчанию?',
        },
        remove: {
          title: 'Удаление организации',
          message: 'Вы уверены, что хотите удалить организацию "{name}"?',
        },
      },
    },
    add: {
      title: 'ИНН организации',
      cancel: 'Отменить',
      submit: 'Подтвердить',
      inn: {
        placeholder: 'Введите ИНН новой компании',
        checking: {
          title: 'Проверка ИНН',
          message: 'Проверка существования ИНН',
        },
        valid: {
          title: 'ИНН верный!',
          message: 'Данный ИНН может быть использован',
        },
        invalid: {
          title: 'ИНН не обнаружен',
          message: 'Введите верный ИНН',
        },
      },
    },
  },
  company: {
    edit: 'Режим редактирования',
    common: {
      title: 'Общая информация',
      name: {
        title: 'Название',
        name_full: {
          label: 'Полное наименование',
        },
        name_short: {
          label: 'Сокращенное наименование',
        },
      },
      activity: {
        title: 'Деятельность',
        type: {
          label: 'Тип организации',
        },
        okopf: {
          label: 'ОКОПФ',
        },
        taxation_system: {
          label: 'Система налогообложения',
        },
        type_peni_calculation: {
          label: 'Тип расчета пени',
        },
      },
      contacts: {
        title: 'Контакты',
        phone: {
          label: 'Телефон',
        },
        fax: {
          label: 'Факс',
        },
        site: {
          label: 'Сайт',
        },
        email: {
          label: 'E-mail приемной',
        },
        email_buh: {
          label: 'E-mail бухгалтерии',
        },
      },
      direction: {
        title: 'Дирекция',
        director: {
          label: 'Генеральный директор',
        },
        representative_power_attorney: {
          label: 'Представитель по доверенности',
        },
      },
      addresses: {
        title: 'Дирекция',
        legal_address: {
          label: 'Юридический адрес',
        },
        physical_address: {
          label: 'Фактический адрес',
        },
        postal_address_zip_code: {
          label: 'Почтовый адрес',
        },
      },
      requisites: {
        title: 'Реквизиты',
        inn: {
          label: 'ИНН',
        },
        kpp: {
          label: 'КПП',
        },
        ogrn: {
          label: 'ОГРН',
        },
        ras_schet: {
          label: 'Расчетный счет',
        },
        bic: {
          label: 'БИК',
        },
        full_name_bank: {
          label: 'Полное наименование банка',
        },
        kor_schet: {
          label: 'Корреспондентский счет',
        },
      },
      asLegalAddress: 'Как юр. адрес',
      cancel: 'Отменить',
      submit: 'Сохранить',
    },
    employees: {
      title: 'Сотрудники',
      column: {
        first_name: 'ФИО',
        position: 'Должность',
        user_phone: 'Телефон',
        email: 'Email',
      },
      action: {
        remove: 'Вы действительно хотите удалить этого сотрудника?',
        add: 'Добавить сотрудника',
      },
      remove: {
        error: 'Ошибка удаления сотрудника',
      },
    },
    documents: {
      title: 'Документы',
      signer: {
        signer: 'Подписант',
        signer_name: 'ФИО представителя',
      },
      reset: 'Отмена',
      submit: 'Сохранить',
      noSignerFile: 'Загрузите доверенность',
    },
  },
  employee: {
    add: {
      title: 'Добавить сотрудника',
      first_name: {
        label: 'Имя',
        placeholder: 'Имя',
      },
      last_name: {
        label: 'Фамилия',
        placeholder: 'Фамилия',
      },
      user_phone: {
        label: 'Моб. телефон',
        placeholder: 'Моб. телефон',
      },
      email: {
        label: 'Email',
        placeholder: 'Email',
      },
      position: {
        label: 'Должность',
        placeholder: 'Должность',
      },
      linked_companies: {
        label: 'Предоставить доступ следующим компаниям',
        placeholder: 'Предоставить доступ следующим компаниям',
      },
      employee_role: {
        label: 'Выберите роль сотрудника',
        placeholder: 'Выберите роль сотрудника',
      },
      submit: 'Сохранить',
    },
  },
  activeTable: {
    select: 'Выбрать все',
    action: {
      filters: 'Фильтры',
      display: 'Настройки отображения',
      actions: 'Быстрые клавиши',
      resetFilters: 'Сбросить фильтр',
      selectAll: 'Выбрать всё',
      deselectAll: 'Снять выделение',
    },
    filters: {
      reset: 'Сбросить',
      submit: 'Поиск',
    },
    summaries: {
      selected: 'Выбрано {selected} из {total}',
      shown: 'Показано {shown} из {total} (с {from} по {to})',
    },
    total: 'Итого:',
  },
  documentField: {
    name: 'Название',
  },
  dict: {
    [DictType.companyTaxationSystems]: {
      usn: 'Упрощённая система налогообложения',
      osn: 'Общая система налогообложения',
    },
    [DictType.companyPeniCalculationTypes]: {
      155: '155 ЖК РФ',
      394: '394 ГК РФ',
    },
    [DictType.employeeRoles]: {
      [EmployeeRole.employee]: 'Сотрудник',
      [EmployeeRole.owner]: 'Владелец',
      [EmployeeRole.guest]: 'Гость',
      [EmployeeRole.manager]: 'Менеджер',
      [EmployeeRole.admin]: 'Админ',
    },
  },
  exchange: {
    region: 'Регион',
    company: 'Компания',
    dataType: {
      [DataTypeKey.instruction]: 'Инструкция',
      [DataTypeKey.pretrial]: 'Досудебное производство',
      [DataTypeKey.judicial]: 'Судебное производство',
      [DataTypeKey.executive]: 'Исполнительное производство',
      [DataTypeKey.paymentOrder]: 'Платёжное поручение',
      [DataTypeKey.judgment]: 'Судебное решение',
      [DataTypeKey.housebook]: 'Выписка из домовой книги',
    },
    import: {
      title: 'Загрузка данных',
      instructions: {
        title: 'Инструкция работы с файлом\n выгрузки должников',
        sign: {
          label: 'Конфигурация криптоотпечатка',
          field: {
            crypto_pro_thumbprint: 'Отпечаток подписи',
            crypto_pro_proxy_url: 'IP:port до stunnel',
          },
          toast: {
            success: 'Конфигурация отпечатка сохранена',
          },
        },
        template: {
          label: 'Шаблоны',
          body: `Для того, чтобы использовать шаблоны, нажмите на нужный формат файла шаблона (csv, xls. xlsx) и скачайте его. Файл шаблона нужно заполнять строго как в примере. Все положения столбцов должны быть как в шаблоне, даже если они не используются.

В свою очередь в файле идет разбивка по домам, в виде блоков последовательных строк. Начинается блок названием улицы и дома (Ленина ул. д.2) и номеров квартир, далее идет название следующей улицы и следующие номера квартир и так далее...`,
        },
        file: {
          label: 'Собственный файл',
          body: 'Чтобы выполнить загрузку Вашего файла, напишите нам на почту: {email} или оставьте заявку в чате, и мы сделаем шаблон для Вас и все последующие выгрузки будете осуществлять используя Ваш файл.',
        },
        integration: {
          label: 'Интеграция по API',
          body: `Если у Вас в организации используется программа 1С или другой программный комплекс учета начислений, напишите нам на почту: {email} или оставьте заявку в чате и мы сделаем безопасную интеграцию с нашей платформой, что позволит все данные получать в онлайн режиме.

            Для того чтобы выгрузить файлы (исключение п.3) Вам нужно выбрать год и разложить файлы по нужным месяцам, после этого нажать импортировать. Ожидаем...`,
        },
      },
      form: {
        commonTitle: 'Загрузить',
        title: {
          [DataTypeKey.pretrial]: '@:exchange.import.form.commonTitle файл досудебного производства',
          [DataTypeKey.judicial]: '@:exchange.import.form.commonTitle файл судебного производства',
          [DataTypeKey.executive]: '@:exchange.import.form.commonTitle файл исполнительного производства',
          [DataTypeKey.paymentOrder]: '@:exchange.import.form.commonTitle платёжное поручение',
          [DataTypeKey.judgment]: '@:exchange.import.form.commonTitle судебное решение',
          [DataTypeKey.housebook]: '@:exchange.import.form.commonTitle выписку из домовой книги',
        },
        side: {
          description: 'Скачайте на компьютер файл шаблона, сгенерированного программой Excel. Заполните его значениями',
          tableTemplate: 'Табличные шаблоны',
          linearTemplate: 'Линейные шаблоны',
        },
        upload: 'Загрузить файлы',
        integration: 'Интеграция по API',
        mode: {
          [ExchangeImportMode.table]: 'Табличный',
          [ExchangeImportMode.linear]: 'Линейный',
        },
        period: {
          [ExchangeImportPeriod.all]: 'Загрузить всё',
          [ExchangeImportPeriod.monthly]: 'Загрузить по месяцам',
        },
        dropZone: 'Просто перетащите файлы сюда',
        submit: 'Загрузить',
        toast: {
          submit: {
            message: 'Работа с документами',
            progresses: {
              uploading: 'Загрузка {current} из {max}',
              checking: 'Обработка {current} из {max}',
            },
          },
        },
        noRegion: 'Необходимо выбрать регион',
      },
    },
    export: {
      title: 'Выгрузка данных',
    },
    integration: {
      title: 'Интеграция API',
    },
  },
  panel: {
    index: {
      title: 'Общие данные',
      common: {
        title: 'Общие данные клиента',
        field: {
          contract: 'Номер и дата договора',
          name: 'Название организации',
          address: 'Адрес',
          fio: 'ФИО',
          email: 'Email',
          emailBuh: 'Email бухгалтерии',
          registrationDate: 'Дата регистрации',
          timezone: 'Часовой пояс',
        },
      },
      balance: {
        title: 'Баланс',
        date: 'на {date}',
        hint: 'Расчетная сумма расходов\n на текущий месяц',
        paidUp: 'Пополнить баланс',
      },
      contracts: {
        title: 'Договоры',
        agreement: 'Договор-оферта\n на оказание услуг',
      },
      requisites: {
        title: 'Данные и реквизиты в договоре',
        subTitle: 'Общие данные клиента',
        field: {
          ogrn_data_reg: 'Дата договора',
          name_full: 'Полное наименование',
          name_short: 'Сокращенное наименование',
          inn: 'ИНН',
          kpp: 'КПП',
          ogrn: 'ОГРН',
          legal_address: 'Юридический адрес',
          physical_address: 'Физический адрес',
          postal_address_zip_code: 'Почтовый адрес с индексом',
          bic: 'БИК',
          full_name_bank: 'Наименование банка',
          kor_schet: 'Корреспондентский счет',
          ras_schet: 'Расчетный счет',
          email_buh: 'E-mail бухгалтера',
        },
        submit: 'Сохранить',
      },
    },
    tariffs: {
      title: 'Тарифы и услуги',
      content: {
        title: 'Подключенные услуги',
      },
      tariffs: {
        title: 'Стоимость услуг',
      },
    },
    constructor: {
      title: 'Конструктор\n документов',
      tab: {
        settings: 'Главная',
        templates: 'Шаблоны',
        createTemplate: 'Создать шаблон',
        editTemplate: 'Редактировать шаблон',
      },
      settings: {
        title: 'Конструктор документов',
        defaultDocument: 'Выберите документ по умолчанию',
        selectTemplate: 'Выберите шаблон',
        magistrateCourt: 'Выберите документ для участка мирового судьи',
        regionalCourt: 'Выберите документ для участка районного суда',
        court: {
          court: 'Наименование суда',
          decision: 'Судебное решение',
          shareholder: 'Судебное решение (дольщики)',
        },
      },
      templates: {
        title: 'Выберите готовый документ для редактирования',
        listTitle: 'Список шаблонов',
        column: {
          id: '№',
          name: 'Имя',
          description: 'Тип шаблона',
        },
        action: {
          remove: {
            message: 'Вы действительно хотите удалить шаблон?',
          },
        },
      },
      createTemplate: {
        title: 'Создать шаблон',
      },
      editTemplate: {
        title: 'Редактировать шаблон',
      },
      template: {
        module: {
          label: 'Тип модуля документа',
          placeholder: 'Выберите модуль документа',
        },
        type: {
          label: 'Вид документа',
          placeholder: 'Выберите вид документа',
        },
        name: {
          label: 'Название',
          placeholder: 'Введите название',
        },
        copy: 'Копия {name}',
        addType: {
          title: 'Добавить тип документа',
          name: {
            label: 'Наименование типа документа',
            hint: 'Использовать латиницу без пробелов',
          },
          description: 'Описание типа документа',
        },
        createSubmit: 'Создать шаблон',
        updateSubmit: 'Сохранить шаблон',
      },
    },
    password: {
      title: 'Сменить пароль',
      oldPassword: 'Текущий пароль',
      password: 'Новый пароль',
      confirmation: 'Повторите пароль',
      cancel: 'Отмена',
      submit: 'Сохранить',

      passwordDontMatch: 'Пароли не совпадают',
    },
  },
  file: {
    [ImportFileTemplate.csv]: 'CSV\n файл',
    [ImportFileTemplate.xls]: 'XLS\n файл',
    [ImportFileTemplate.xlsx]: 'XLSX\n файл',
  },
  socket: {
    retry: 'Ошибка подключения, пробуем ещё раз',
  },
  pureLabel: '{label}',
  pure: '{message}',
  productionType: {
    [ProductionType.pretrial]: 'Досудебное производство',
    [ProductionType.judicial]: 'Судебное производство',
    [ProductionType.executive]: 'Исполнительное производство',
  },
  debtors: {
    column: {
      personal_account: '№ ЛС',
      phone_number: 'Телефон',
      full_name: 'ФИО',
      address: 'Адрес',
      case_number: '№ дела',
      serial_number: '№ ИП',
      end_date: 'Дата окончания ИП',
      bailiff_full_name: 'ФИО пристава',
      accrual: 'Начислено',
      paid_up: 'Оплачено',
      debt: 'Задолженность',
      penalty: 'Пени',
      total_debt: 'Общая задолженность',
      debt_entrepreneur: 'Задолженность по ИП',
      fee: 'Пошлина',
    },
    action: {
      print: 'Подача документов',
      setOfCharges: 'Свод начислений по ЛС',
      fee: 'Бланк пошлины',
      egrn: 'Выписка ЕГРН',
      sms: 'Отправка SMS',
      voice: 'Голосовое уведомление',
      email: 'Отправить увеомление на почту',
      status: 'Изменить статус выбранных должников',
      settings: 'Настройки автоматизации',
    },
    filters: {
      full_name: 'ФИО',
      address: 'Адрес',
      phone_number: 'Номер телефона',
      personal_account: '№ ЛС',
      debtor_debt_min: 'Сумма долга от',
      debtor_debt_max: 'Сумма долга до',
      case_number: '№ дела',
      serial_number: '№ ИП',
      status_name: 'Статус',
      has_sms: 'SMS-уведомление',
      has_voice: 'Голосовое уведомление',
      magistrate_court_id: 'Выбор мирового суда',
      regional_court_id: 'Выбор районного суда',
      substatus_name: {
        placeholder: 'Статус выписки ЕГРН',
        statement_ordered: 'Заказана',
        '!statement_ordered': 'Не заказана',
      },
      has_writ_of_execution: 'Наличие ИП',
      bailiff_id: 'По участкам ФССП',
      fee_status: {
        placeholder: 'Статус оплаты пошлины',
        fees_paid: 'Оплачена',
        '!fees_paid': 'Не оплачена',
        fees_await_paid: 'Ожидает оплату',
      },
    },
    [DataTypeKey.pretrial]: {
      tab: 'Досудебное\n производство',
    },
    [DataTypeKey.judicial]: {
      tab: 'Судебное\n производство',
    },
    [DataTypeKey.executive]: {
      tab: 'Исполнительное\n производство',
    },
  },
  tableDisplaySettings: {
    title: 'Настройка отображения',
    limit: {
      label: 'Записей на странице',
      hint: 'Введите число от 1 до 500',
    },
    columns: {
      order: 'Порядок и отбражение колонок',
      hidden: 'Скрытые/Фиксированные колонки',
    },
    reset: 'Сбросить',
    submit: 'Применить',
  },
  actionsSelector: {
    title: 'Быстрые клавиши',
    submit: 'Применить',
  },
  debtorStatus: {
    notSelected: 'Выберите должников для смены статуса',
    title: 'Статус работы с должником',
    addSubEntry: 'Добавить подстатус',
    subEntryValue: 'Подстатус',
    subEntryComment: 'Комментарий',
    submit: 'Применить',
    selectEntry: 'Выберите статус',
  },
  print: {
    notSelected: 'Выберите должников для печати',
    title: 'Работа с печатной формой',
    documents: {
      title: 'Список документов в приложении',
      label: 'Настройка печати',
    },
    period: {
      title: 'Период расчета',
      whole: 'За весь период',
      from: 'С',
      to: 'По',
      moratorium: 'Мораторий расчета пени',
    },
    services: 'Выбор услуги',
    signAndSubmit: 'Подписать и отправить\n по ЭЦП',
    submit: 'Формирование и печать',
    toast: {
      success: 'Документ готов!',
      failure: 'Ошибка формирования документов',
      message: 'Формирование данных, ожидайте...',
      progress: '{current} из {max}',
    },
    dialog: {
      title: 'Работа с документами',
    },
  },
  fileDialog: {
    preview: 'Открыть и посмотреть',
    download: 'Скачать',
    copy: 'Скопировать ссылку',
    copied: 'Ссылка скопирована',
  },
  setOfCharges: {
    notSelected: 'Выберите должников для формирования свода начислений',
    title: 'Работа с печатной формой',
    dialog: {
      title: 'Работа с документами',
    },
    submit: 'Просмотр и печать',
    toast: {
      success: 'Документ готов!',
      failure: 'Ошибка формирования документов',
      message: 'Формирование свода начислений...',
    },
  },
  dutyForm: {
    notSelected: 'Выберите должников для формирования реестра для оплаты пошлины',
    title: 'Работа с печатной формой',
    dialog: {
      title: 'Работа с документами',
    },
    submit: 'Просмотр и печать',
    toast: {
      success: 'Документ готов!',
      failure: 'Ошибка формирования документов',
      message: 'Формирование реестра свода начислений...',
    },
  },
  pretrial: {
    sms: {
      sent: 'Отправлено',
      notSent: 'Не отправлено',
    },
    voice: {
      sent: 'Отправлено',
      notSent: 'Не отправлено',
    },
  },
  egrn: {
    notSelected: 'Выберите должников для формирования выписки из ЕГРН',
    title: 'Получение выписок из ЕГРН',
    disclaimer: 'Обращаем Ваше внимание, что произойдет списание с Вашего лицевого счета суммы за услугу по получению выписки ЕГРН с официального сайта Росреестра, согласно тарифному плану.',
    field: {
      data: 'Выписка из ЕГРН',
      rights: 'Выписка из ЕГРН о переходе прав',
    },
    force: 'Перезаказать',
    attention: {
      title: 'Важно!',
      text: `Мы не гарантируем корректную работа сайта Росреестра. Время
получения выписки по регламенту Росреестра занимает до 5 дней.`,
    },
    submit: 'Отправить запрос',
    toast: {
      message: 'Заказ выписки из ЕГРН',
      progress: '{current} из {max}',
      success: 'Запрос на выписку из ЕГРН успешно сформирован',
      failure: 'Ошибка формирования запроса выписки',
    },
  },
  debtor: {
    title: 'Данные должника {name}',
    common: {
      tab: 'Общая информация',
      main: {
        tab: 'Главная',
        field: {
          full_name: 'ФИО',
          address: 'Адрес',
          registration_address: 'Адрес регистрации',
          email: 'Email',
          phone_number: 'Телефон',
        },
        submit: 'Сохранить',
        cancel: 'Отмена',
      },
      tenants: {
        tab: 'Список жильцов',
        column: {
          full_name: 'ФИО',
          birth_date: 'Дата рождения',
          birth_place: 'Место рождения',
          citizenship: 'Граж-во',
          num_of_passport: 'Серия и № паспорта',
          inn: 'ИНН',
          date_of_passport_issue: 'Дата выдачи',
          passport_issued_by: 'Кем выдан паспорт',
          registration: 'Регистрация',
          registration_date: 'Дата рег-ции',
          relationships: 'Род. отношения',
        },
        registration: {
          permanent: 'Постоянная',
          temporary: 'Временная',
        },
        passport: {
          valid: 'Паспорт подтверждён',
          invalid: 'Паспорт не подтверждён',
          checking: 'Паспорт на проверке',
        },
        actions: {
          add: 'Добавить',
          submit: 'Сохранить',
          reset: 'Отменить',
          update: 'Обновить данные',
        },
        toast: {
          message: 'Обновление данных',
          success: 'Данные успешно обновлены',
          failure: 'Ошибка обновления данных',
        },
      },
      owners: {
        tab: 'Собственники',
        column: {
          owner_name: 'Собственник',
          birth_date: 'Дата рождения',
          birth_place: 'Место рождения',
          num_of_passport: 'Серия и № паспорта',
          date_of_passport_issue: 'Дата выдачи',
          passport_issued_by: 'Кем выдан',
          inn: 'ИНН',
          registered_ownership_type: 'Вид зарегестрированного права',
          fraction_in_ownership: 'Доля в праве',
          ownership_registration_date: 'Дата рег-ции права',
          ownership_registration_number: '№ рег-ции права',
        },
        characteristic: {
          title: 'Сведения о характеристиках объекта недвижимости',
          cadastral_number: 'Кадастровый номер',
          request_date: 'Дата запроса',
          last_request_date: 'Дата последнего запроса',
        },
        movement: {
          title: 'Сведения о переходе прав объекта недвижимости',
          date_from: 'Период владения',
        },
        cadastral: {
          title: 'По данному адресу не найден кадастровый номер.',
          titleFull: 'По данному адресу не найден кадастровый номер.\n Выберите подходящий кадастровый номер из списка',
          action: {
            selectDefault: 'Выбрать по умолчанию',
            expandAll: 'Раскрыть все',
            collapseAll: 'Скрыть все',
          },
          land_category: 'Вид',
          object_name: 'Наименование',
          cad_cost: 'Кадастровая стоимость ',
          area: 'Площадь',
          submit: 'Сохранить',
        },
      },
    },
    documents: {
      tab: 'Документооборот',
      common: {
        tab: 'Общий',
      },
      housebook: {
        tab: 'Выписка из домовой книги',
      },
      'egrn-data': {
        tab: 'Выписка из ЕГРН',
      },
      'egrn-rights': {
        tab: 'Выписка ЕГРН о переходе прав',
      },
      fee: {
        tab: 'ПП об оплате госпошлины',
      },
      judgments: {
        tab: 'Судебное решение',
      },
      sms: {
        tab: 'SMS',
      },
      voice: {
        tab: 'Голосовое оповещение',
      },
      fns: {
        tab: 'ФНС',
      },
      banks: {
        tab: 'Банки',
      },
      executions: {
        tab: 'Исполнительный лист',
      },
      'my-documents': {
        tab: 'Мои документы',
      },
      column: {
        id: '№',
        file: 'Документ',
        document_formation_date: 'Дата формирования документа',
        status: 'Статус',
        created_at: 'Дата формирования',
        phone_number: 'Телефон',
        name: 'Имя оператора',
        send_at: 'Отправлено',
        status_at: 'Статус изменён в',
        service_cost: 'Стоимость',
        message: 'Сообщение',
        payload: 'Переданные данные',
        status_tracking: 'Статус',
        history: '№ заказа выписки',
        amount: 'Сумма оплаты',
        case_id: 'Идентификатор дела',
        case_number: '№ дела',
        considerated_at: 'Дата рассмотрения',
        effected_at: 'Дата вступления в силу',
        judge_full_name: 'ФИО судьи',
        statuses: 'История статусов',
        request_id: '№ запроса',
        document_title: 'Наименование',
        request_date: 'Дата запроса',
        response_date: 'Дата ответа',
        tax_inspector_full_name: 'ФИО инспектора',
        status_current: 'Статус',
        status_history: 'История статусов',
        bank_name: 'Название банка',
        initiation_date: 'Дата возбуждения ИП',
        completion_termination_date: 'Дата окончания ИП',
        termination_ground: 'Основания прекращения',
        bailiff_full_name: 'ФИО судебного пристава',
        bailiff_email: 'Контакты пристава',
      },
      actions: {
        housebook: {
          upload: 'Загрузить документы',
        },
        'my-documents': {
          upload: 'Загрузить документы',
        },
        remove: 'Вы действительно хотите удалить этот документ?',
        listen: 'Голосовое уведомление',
      },
    },
    finance: {
      tab: 'Финансовые данные',
      accruals: {
        tab: 'Начислено',
      },
      debts: {
        tab: 'Общая сумма задолженности',
      },
      'paid-ups': {
        tab: 'Оплачено',
      },
      penalties: {
        tab: 'Пеня',
      },
      column: {
        accruals: {
          date: 'Дата',
        },
        'paid-ups': {
          date: 'Месяц оплаты',
        },
        debts: {
          start_date: 'Начало просрочки',
          end_date: 'Конец просрочки',
          value: 'Задолженность',
        },
        penalties: {
          start_date: 'Начало просрочки',
          value: 'Пеня',
        },
      },
      summaries: {
        accruals: 'Начислено',
        'paid-ups': 'Оплачено',
        debt: 'Общая задолженность',
        penalty: 'Пеня',
      },
    },
    courts: {
      tab: 'Справочник суда и судебных дел',
      magistrate: {
        tab: 'Участок мирового судьи',
      },
      regional: {
        tab: 'Участок районного суда',
      },
      column: {
        index: '№',
        id: 'Идентификатор дела',
        case_number: 'Номер дела',
        receipt_date: 'Дата поступления',
        case_consideration_date: 'Дата рассмотрения',
        effective_decision_date: 'Дата встулпения решения в силу',
        judge_full_name: 'ФИО судьи',
        payment_status: 'Статус оплаты',
        status_history: 'История статусов',
      },
      title: 'Карточка судебных дел',
      actions: {
        requisites: 'Реквизиты участка суда',
      },
      requisites: {
        name: 'Наименование',
        address: 'Адрес',
        magistrate: 'ФИО судьи',
        phone_number_secretary: 'Секретарь судьи, телефон',
        phone_number_assistant: 'Помощник мирового судьи, телефон',
        phone_number_head_of_dep: 'Начальник управления, телефон',
        email: 'Электронная почта',
        payment_recipient_name: 'Получатель платежа',
        bic: 'БИК',
        payment_recipient_account: 'Счет получателя платежа',
        inn: 'ИНН',
        kpp: 'КПП',
        oktmo: 'ОКТМО',
        payment_recipient_bank: 'Банк получателя платежа',
        kbk: 'КБК',
      },
    },
    notifications: {
      tab: 'Карточка уведомлений',
      sms: {
        tab: 'SMS',
      },
      voice: {
        tab: 'Голосовые уведомления',
      },
      title: 'Карточка уведомлений',
      column: {
        id: '№',
        status: 'Статус',
        created_at: 'Создано',
        phone_number: 'Телефон',
        name: 'Имя оператора',
        send_at: 'Отправлено',
        status_at: 'Статус изменён в',
        service_cost: 'Стоимость',
        message: 'Сообщение',
        payload: 'Переданные данные',
      },
      actions: {
        listen: 'Голосовое уведомление',
      },
    },
    executions: {
      tab: 'Справочник ИП',
      fnsRequisites: {
        code: 'Код ИФНС',
        name: 'Наименование',
        address: 'Адрес',
        inn: 'ИНН',
        kpp: 'КПП',
        payee: 'Получатель платежа',
        bank: 'Банк',
        bik: 'БИК',
        rs: 'р/с',
        ks: 'к/с',
        reg_code: 'Регистрирующий орган',
        phone: 'Номер телефона',
        description: 'Дополнительная информация',
      },
      fsspRequisites: {
        name: 'Наименование',
        address: 'Адрес',
      },
      filters: {
        debt_nature: 'Источник',
      },
      column: {
        index: '№',
        production_number: '№ ИП',
        doctype: 'Вид документа',
        docnum: '№ дела',
        docdate: 'Дата дела',
        court: 'Судебный участок',
        production_date: 'Дата вбуждения ИП',
        end_date: 'Дата прекращения ИП',
        end_reason1: 'Основания прекращения ИП',
        amount: 'Сумма',
        bailiff: 'ФИО пристава',
      },
      actions: {
        add: 'Добавить ИП',
        fsspRequisites: 'Реквизиты участка ФССП',
        fnsRequisites: 'Реквизиты ФНС по адресу',
      },
      debtNatures: {
        communal: 'Коммунальные услуги',
        credit: 'Кредиты',
        tax: 'Налоги',
        other: 'Штрафы и пр.',
      },
      title: 'Карточка истории ИП в ФССП',
      add: {
        serial_number: 'Номер ИП',
        case_number: 'Номер судебного решения',
      },
    },
  },
  notification: {
    notSelected: 'Выберите должников для уведомления',
    sms: 'Отправить SMS-уведомление?',
    voice: 'Отправить голосовое уведомление?',
    email: 'Отправить Email-уведомление?',
    confirm: 'Отправить',
    toast: {
      progress: 'Прогресс: {current} из {max}',
      sentProgress: 'Отправлено: {current} из {max}',
      message: 'Отправка уведомлений',
      success: 'Уведомление успешно отправлено',
      failure: 'Ошибка отправки уведомления',
    },
  },
  listen: {
    noFile: 'Нет файла',
    duration: '{duration} сек.',
  },
  debtorIcon: {
    sms: 'СМС {status}',
    voice: 'Голосовое оповещение {status}',
  },
  captcha: {
    error: 'Ошибка проверки на робота',
  },
  globalLoader: {
    html: 'Загрузка html-кода страницы',
    express: 'Ожидание формирования ответа от сервера express',
    data: 'Получение данных от сервера',
    objects: 'Формирование объектов',
    interpolation: 'Вывод данных',
    state: 'Обновление глобального хранилища',
    loaded: `Добро пожаловать
на платформу по автоматизации взыскания задолженностей`,
  },
};
