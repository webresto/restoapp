# OpenAI Data Agent для WebResto

AI-агент для работы с данными WebResto через естественный язык с использованием OpenAI.

## Описание

OpenAiDataAgentService предоставляет возможность взаимодействия с моделями данных WebResto (заказы, блюда, пользователи и т.д.) через запросы на естественном языке. Агент использует OpenAI GPT модели и имеет безопасный доступ к данным через DataAccessor с проверкой прав.

## Установка

### 1. Установите зависимости

```bash
npm install @openai/agents
```

Или если используете пакет из local_modules/core:
```bash
cd local_modules/core && npm install
```

### 2. Настройте переменные окружения

```bash
# .env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_AGENT_MODEL=gpt-4o-mini  # опционально, по умолчанию gpt-4o-mini
AI_ENABLED=true  # опционально, для включения/отключения
```

### 3. Инициализируйте агента в вашем проекте

Добавьте в `config/bootstrap.js`:

```javascript
module.exports.bootstrap = async function(done) {
  // Wait for Sails to be ready
  sails.on('ready', async () => {
    // Initialize AI Agent
    const { initializeAiAgent } = require('../lib/ai/initialize');
    await initializeAiAgent();
  });

  return done();
};
```

Или создайте кастомный hook `api/hooks/ai-agent.js`:

```javascript
module.exports = function (sails) {
  return {
    initialize: async function(done) {
      sails.after('hook:orm:loaded', async () => {
        try {
          const { initializeAiAgent } = require('../../lib/ai/initialize');
          await initializeAiAgent();
          sails.log.info('AI Agent initialized');
        } catch (error) {
          sails.log.error('AI Agent error:', error);
        }
      });
      return done();
    }
  };
};
```

## Использование

### Базовый пример контроллера

Создайте `api/controllers/AiAssistantController.js`:

```javascript
const { getAiAgent, isAiAgentReady } = require('../../lib/ai/initialize');

module.exports = {

  // POST /api/ai/chat
  chat: async function(req, res) {
    try {
      if (!isAiAgentReady()) {
        return res.status(503).json({
          error: 'AI assistant is not available'
        });
      }

      const { message, history } = req.allParams();
      const agent = getAiAgent();

      const response = await agent.generateReply(
        message,
        history || [],
        req.user
      );

      return res.json({
        success: true,
        response,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      sails.log.error('AI chat error:', error);
      return res.serverError(error);
    }
  },

  // GET /api/ai/status
  status: async function(req, res) {
    return res.json({
      enabled: isAiAgentReady()
    });
  }

};
```

### Настройка маршрутов

Добавьте в `config/routes.js`:

```javascript
module.exports.routes = {
  'POST /api/ai/chat': 'AiAssistantController.chat',
  'GET /api/ai/status': 'AiAssistantController.status',
};
```

### Настройка политик

Добавьте в `config/policies.js`:

```javascript
module.exports.policies = {
  AiAssistantController: {
    'chat': ['isAuthenticated'],
    'status': true  // Public
  }
};
```

## Примеры запросов

### Запросы по заказам

```
"Покажи все неоплаченные заказы"
"Сколько заказов было сделано за последний месяц?"
"Какой средний чек заказа?"
"Покажи последние 5 заказов"
```

### Запросы по блюдам

```
"Какие блюда есть в меню?"
"Покажи самые дорогие блюда"
"Сколько блюд в категории 'Пицца'?"
```

### Запросы по пользователям

```
"Сколько зарегистрировано пользователей?"
"Покажи пользователей, которые делали заказы"
```

## DataAccessor - Безопасный доступ

Агент автоматически использует `DataAccessor` для всех запросов к данным, что обеспечивает:

- **Проверку прав доступа** на уровне моделей
- **Фильтрацию данных** по пользователю
- **Исключение чувствительных полей**

### Прямое использование DataAccessor

```javascript
const { createDataAccessor } = require('@webresto/core/lib/ai');

// Создание accessor с ограничениями
const accessor = createDataAccessor(sails, 'order', user, {
  action: 'read',
  excludeFields: ['internalNotes', 'customerData'],
});

const orders = await accessor.find({
  paid: true,
  limit: 10
});
```

### Пользовательские проверки прав

```javascript
const checkPermission = (user, modelName, action) => {
  if (user.role === 'admin') return true;
  if (user.role === 'manager' && ['order', 'dish'].includes(modelName)) return true;
  return false;
};

const accessor = createDataAccessor(sails, 'order', user, {
  action: 'read',
  checkPermission
});
```

### Фильтрация по пользователю

```javascript
const filterCriteria = (user, modelName, criteria) => {
  // Обычные пользователи видят только свои заказы
  if (modelName === 'order' && !user.isAdmin) {
    return { ...criteria, user: user.id };
  }
  return criteria;
};
```

## Безопасность

### 1. API ключи

Храните OpenAI API ключи в переменных окружения:

```bash
# .env
OPENAI_API_KEY=sk-...
```

**НИКОГДА** не коммитьте ключи в репозиторий!

### 2. Ограничение моделей

Настройте список доступных моделей в `lib/ai/initialize.ts`:

```javascript
const aiAgent = new OpenAiDataAgentService(sails, {
  enabledModels: [
    'order',
    'dish',
    'group',
    // Не включайте чувствительные модели
  ]
});
```

### 3. Аутентификация

Всегда требуйте аутентификацию для AI endpoints:

```javascript
// config/policies.js
module.exports.policies = {
  AiAssistantController: {
    '*': ['isAuthenticated']
  }
};
```

### 4. Rate Limiting

Настройте ограничение запросов:

```javascript
// config/ratelimit.js
module.exports.ratelimit = {
  'POST /api/ai/chat': {
    max: 10,
    window: 60000 // 10 запросов в минуту
  }
};
```

### 5. Логирование

Логируйте все запросы к AI:

```javascript
sails.log.info('AI chat request', {
  user: req.user.id,
  message: req.param('message'),
  timestamp: new Date()
});
```

## События

Агент эмитит событие `core:ai-ready` когда готов к работе:

```javascript
const getEmitter = require('@webresto/core/libs/getEmitter');

const emitter = getEmitter();
emitter.on('core:ai-ready', async () => {
  sails.log.info('AI Agent is ready!');
  // Ваша логика здесь
});
```

## Структура файлов

```
lib/ai/
├── OpenAiDataAgentService.ts  # Основной класс агента
├── DataAccessor.ts            # Безопасный доступ к данным
├── initialize.ts              # Инициализация агента
├── bootstrap-example.ts       # Примеры использования
├── index.ts                   # Экспорт модуля
└── README.md                  # Документация
```

## Доступные модели

По умолчанию агент имеет доступ к:

- **order** - Заказы клиентов
- **dish** - Блюда меню
- **group** - Категории блюд
- **user** - Пользователи
- **promotion** - Промо-акции
- **place** - Точки заведения

## Ограничения

- Максимум 50 записей за один запрос
- Максимум 6 итераций агента за запрос
- Требуется OpenAI API ключ
- Поддерживаются только модели Waterline ORM

## Troubleshooting

### "AI assistant is not available"

Проверьте:
1. Установлена ли переменная `OPENAI_API_KEY`
2. Вызвана ли функция `initializeAiAgent()`
3. Нет ли ошибок в логах при инициализации

### "Model X is not available"

Модель не входит в список `enabledModels`. Добавьте её в конфигурацию.

### Ошибки подключения к OpenAI

Проверьте:
- Валидность API ключа
- Доступность OpenAI API
- Наличие средств на аккаунте

## Дополнительные примеры

Полные примеры использования смотрите в файле [bootstrap-example.ts](./bootstrap-example.ts)

## Лицензия

GNU GPL v3.0

## Поддержка

Для вопросов и багов создавайте issues в репозитории проекта.
