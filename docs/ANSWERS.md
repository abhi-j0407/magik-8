---
id: answers
version: 1.0.0
status: active
---

# ANSWERS — Theme Packs & Copy

**Implementer:** generate `src/data/answers.ts` from this file. Do not invent alternate copy in code.

## Schema

Each pack: **20 answers** = 10 `affirmative` + 5 `neutral` + 5 `negative`.

```ts
export const THEME_PACKS: ThemePack[] = [ /* classic, career, party */ ];
export const EASTER_EGGS: { id: string; text: string }[];
```

IDs: `{pack}-{category}-{index}` e.g. `classic-affirmative-01`.

---

## Pack: `classic` — Classic

| id | category | text |
|----|----------|------|
| classic-affirmative-01 | affirmative | It is certain |
| classic-affirmative-02 | affirmative | It is decidedly so |
| classic-affirmative-03 | affirmative | Without a doubt |
| classic-affirmative-04 | affirmative | Yes definitely |
| classic-affirmative-05 | affirmative | You may rely on it |
| classic-affirmative-06 | affirmative | As I see it, yes |
| classic-affirmative-07 | affirmative | Most likely |
| classic-affirmative-08 | affirmative | Outlook good |
| classic-affirmative-09 | affirmative | Yes |
| classic-affirmative-10 | affirmative | Signs point to yes |
| classic-neutral-01 | neutral | Reply hazy, try again |
| classic-neutral-02 | neutral | Ask again later |
| classic-neutral-03 | neutral | Better not tell you now |
| classic-neutral-04 | neutral | Cannot predict now |
| classic-neutral-05 | neutral | Concentrate and ask again |
| classic-negative-01 | negative | Don't count on it |
| classic-negative-02 | negative | My reply is no |
| classic-negative-03 | negative | My sources say no |
| classic-negative-04 | negative | Outlook not so good |
| classic-negative-05 | negative | Very doubtful |

---

## Pack: `career` — Career Coach

| id | category | text |
|----|----------|------|
| career-affirmative-01 | affirmative | Strong yes — ship it |
| career-affirmative-02 | affirmative | The data says go |
| career-affirmative-03 | affirmative | Your instincts are right |
| career-affirmative-04 | affirmative | Green light from the universe |
| career-affirmative-05 | affirmative | Worth the calendar invite |
| career-affirmative-06 | affirmative | Approved in the parallel timeline |
| career-affirmative-07 | affirmative | Likely a win |
| career-affirmative-08 | affirmative | Momentum is on your side |
| career-affirmative-09 | affirmative | Yes — document it |
| career-affirmative-10 | affirmative | Signs point to promotion energy |
| career-neutral-01 | neutral | Check back after coffee |
| career-neutral-02 | neutral | Need more context — ask again |
| career-neutral-03 | neutral | HR would like a word (unclear) |
| career-neutral-04 | neutral | Outlook foggy — gather input |
| career-neutral-05 | neutral | Focus the question, then retry |
| career-negative-01 | negative | Don't send that email |
| career-negative-02 | negative | Hard no — protect your boundaries |
| career-negative-03 | negative | My sources say skip it |
| career-negative-04 | negative | Outlook: rocky quarter |
| career-negative-05 | negative | Very doubtful — sleep on it |

---

## Pack: `party` — Party Mode

| id | category | text |
|----|----------|------|
| party-affirmative-01 | affirmative | YASSS absolutely |
| party-affirmative-02 | affirmative | The vibe says YES |
| party-affirmative-03 | affirmative | 100% main character energy |
| party-affirmative-04 | affirmative | Bet — go for it |
| party-affirmative-05 | affirmative | Confetti says yes |
| party-affirmative-06 | affirmative | DJ approved |
| party-affirmative-07 | affirmative | Probably yes (with glitter) |
| party-affirmative-08 | affirmative | Outlook: lit |
| party-affirmative-09 | affirmative | Yes bestie |
| party-affirmative-10 | affirmative | Signs point to afterparty |
| party-neutral-01 | neutral | Reply hazy — hydrate first |
| party-neutral-02 | neutral | Ask again after one dance |
| party-neutral-03 | neutral | Better not tell you mid-karaoke |
| party-neutral-04 | neutral | Cannot predict — bass drop incoming |
| party-neutral-05 | neutral | Concentrate and ask with snacks |
| party-negative-01 | negative | Don't do it — cringe risk |
| party-negative-02 | negative | Nah fam |
| party-negative-03 | negative | My sources say leave early |
| party-negative-04 | negative | Outlook: awkward |
| party-negative-05 | negative | Very doubtful — text your ex? NO |

---

## Easter eggs (REQ-045)

Separate from pack RNG. On trigger, show `easterEggText` **instead of** or **overlay** normal answer (implement: replace text + accent color `--magik-accent`).

| id | text |
|----|------|
| egg-01 | The ball is buffering reality |
| egg-02 | Error 8: fate overflow |
| egg-03 | Ask your manager (just kidding) |
| egg-04 | The die is on lunch break |
| egg-05 | You already knew the answer |
| egg-first-visit | Welcome, seeker of dubious wisdom |

**Trigger rules:**

1. `egg-first-visit` once per device (`localStorage.magik_first_visit !== '1'`).
2. Otherwise 1/40 chance on each successful reveal (`easterEgg.ts`).

---

## Neutral answer UX (REQ-015)

When category === `neutral`, after reveal show subtle hint: *"The oracle is unclear — shake again."* (does not block next shake).

---

## Legal note

Copy for `classic` pack mirrors **public-domain folklore** phrasing of a widely known toy; product branding is **Magik 8**, not Mattel. Do not use Mattel logos or "Magic 8 Ball" trademark in UI strings.
