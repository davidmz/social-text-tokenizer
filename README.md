# social-text-tokenizer

Пакет для разбора текстов постов и комментариев. Он предназначен для текстов сайта freefeed.net, но может быть адаптирован и для на других сервисов.

## TL;DR

Как быстро начать парсить тексты:

```JavaScript
import {
  combine, withText,
  hashTags, emails, mentions, links, arrows
} from 'social-text-tokenizer';

// Находит в тексте hashTags, emails, mentions, links, arrows,
// объединяет результаты и заполняет промежутки токенами типа Text.
const parse = withText(combine(hashTags, emails, mentions, links, arrows));

const tokens = parse(text);
```

## Подробности

### Токены и токенизаторы

Пакет экспортирует функции-токенизаторы. Токенизатор принимает текст и возвращает массив найденных в нём токенов — элементов, под поиск которых заточен данный токенизатор.

```TypeScript
interface Tokenizer {
  (text: string): Token[];
}
```

Токены представляют собой найденные в тексте объекты и являются наследниками класса Token:

```TypeScript
class Token {
  type: string;   // тип токена (совпадает с именем класса)
  offset: number; // позиция начала в строке
  text: string;   // текст токена без изменений
  …
}
```

Пакет экспортирует следующие токены (классы) и соответствующие токенизаторы:

- Text — простой текст, используется для заполнения интервалов между значимыми токенами
- HashTag (и токенизатор _hashTags_) — хэштег
- Email (и токенизатор _emails_) — адрес e-mail
- Mention (и токенизатор _mentions_) — @-упоминание логина пользователя
- Link (и токенизатор _links_) — URL в тексте
- Arrows (и токенизатор _arrows_) — ссылки на комментарии вида ^^ или ↑↑

Каждый токенизатор возвращает токены своего типа.

### Объединение результатов

Функция _combine_ принимает токенизаторы-аргументы и возвращает токенизатор, который объединяет результаты аргументов:

```JavaScript
// Простые токенизаторы
const emailTokens = emails(text);
const linkTokens = links(text);

// Комбинированный токенизатор
const emailAndLinkTokens = combine(emails, links)(text);
```

Комбинированный токенизатор выдаёт только непересекающиеся токены. При конфликте токенов из разных источников выбирается токен, который начинается раньше или имеет большую длину.

### Добавление текстовых токенов

Функция _withText_ принимает токенизатор и возвращает новый токенизатор, который заполняет интервалы токенами типа Text.

```JavaScript
const tokens = hashTags("abc #def ghi");
// Result: [HashTag{offset: 4, text: "#def"}]

const tokensWithText = withText(hashTags)("abc #def ghi");
// Result: [
//  Text{offset: 0, text: "abc "},
//  HashTag{offset: 4, text: "#def"},
//  Text{offset: 8, text: " ghi"},
// ]
```

Текстовые токены имеет смысл добавлять на последнем этапе, после комбинирования токенизаторов.
