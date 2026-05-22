import type { ThemePack } from '../types/oracle';

export const THEME_PACKS: ThemePack[] = [
  {
    id: 'classic',
    label: 'Classic',
    answers: [
      { id: 'classic-affirmative-01', category: 'affirmative', text: 'It is certain' },
      { id: 'classic-affirmative-02', category: 'affirmative', text: 'It is decidedly so' },
      { id: 'classic-affirmative-03', category: 'affirmative', text: 'Without a doubt' },
      { id: 'classic-affirmative-04', category: 'affirmative', text: 'Yes definitely' },
      { id: 'classic-affirmative-05', category: 'affirmative', text: 'You may rely on it' },
      { id: 'classic-affirmative-06', category: 'affirmative', text: 'As I see it, yes' },
      { id: 'classic-affirmative-07', category: 'affirmative', text: 'Most likely' },
      { id: 'classic-affirmative-08', category: 'affirmative', text: 'Outlook good' },
      { id: 'classic-affirmative-09', category: 'affirmative', text: 'Yes' },
      { id: 'classic-affirmative-10', category: 'affirmative', text: 'Signs point to yes' },
      { id: 'classic-neutral-01', category: 'neutral', text: 'Reply hazy, try again' },
      { id: 'classic-neutral-02', category: 'neutral', text: 'Ask again later' },
      { id: 'classic-neutral-03', category: 'neutral', text: 'Better not tell you now' },
      { id: 'classic-neutral-04', category: 'neutral', text: 'Cannot predict now' },
      { id: 'classic-neutral-05', category: 'neutral', text: 'Concentrate and ask again' },
      { id: 'classic-negative-01', category: 'negative', text: "Don't count on it" },
      { id: 'classic-negative-02', category: 'negative', text: 'My reply is no' },
      { id: 'classic-negative-03', category: 'negative', text: 'My sources say no' },
      { id: 'classic-negative-04', category: 'negative', text: 'Outlook not so good' },
      { id: 'classic-negative-05', category: 'negative', text: 'Very doubtful' },
    ],
  },
  {
    id: 'career',
    label: 'Career Coach',
    answers: [
      { id: 'career-affirmative-01', category: 'affirmative', text: 'Strong yes — ship it' },
      { id: 'career-affirmative-02', category: 'affirmative', text: 'The data says go' },
      { id: 'career-affirmative-03', category: 'affirmative', text: 'Your instincts are right' },
      { id: 'career-affirmative-04', category: 'affirmative', text: 'Green light from the universe' },
      { id: 'career-affirmative-05', category: 'affirmative', text: 'Worth the calendar invite' },
      { id: 'career-affirmative-06', category: 'affirmative', text: 'Approved in the parallel timeline' },
      { id: 'career-affirmative-07', category: 'affirmative', text: 'Likely a win' },
      { id: 'career-affirmative-08', category: 'affirmative', text: 'Momentum is on your side' },
      { id: 'career-affirmative-09', category: 'affirmative', text: 'Yes — document it' },
      { id: 'career-affirmative-10', category: 'affirmative', text: 'Signs point to promotion energy' },
      { id: 'career-neutral-01', category: 'neutral', text: 'Check back after coffee' },
      { id: 'career-neutral-02', category: 'neutral', text: 'Need more context — ask again' },
      { id: 'career-neutral-03', category: 'neutral', text: 'HR would like a word (unclear)' },
      { id: 'career-neutral-04', category: 'neutral', text: 'Outlook foggy — gather input' },
      { id: 'career-neutral-05', category: 'neutral', text: 'Focus the question, then retry' },
      { id: 'career-negative-01', category: 'negative', text: "Don't send that email" },
      { id: 'career-negative-02', category: 'negative', text: 'Hard no — protect your boundaries' },
      { id: 'career-negative-03', category: 'negative', text: 'My sources say skip it' },
      { id: 'career-negative-04', category: 'negative', text: 'Outlook: rocky quarter' },
      { id: 'career-negative-05', category: 'negative', text: 'Very doubtful — sleep on it' },
    ],
  },
  {
    id: 'party',
    label: 'Party Mode',
    answers: [
      { id: 'party-affirmative-01', category: 'affirmative', text: 'YASSS absolutely' },
      { id: 'party-affirmative-02', category: 'affirmative', text: 'The vibe says YES' },
      { id: 'party-affirmative-03', category: 'affirmative', text: '100% main character energy' },
      { id: 'party-affirmative-04', category: 'affirmative', text: 'Bet — go for it' },
      { id: 'party-affirmative-05', category: 'affirmative', text: 'Confetti says yes' },
      { id: 'party-affirmative-06', category: 'affirmative', text: 'DJ approved' },
      { id: 'party-affirmative-07', category: 'affirmative', text: 'Probably yes (with glitter)' },
      { id: 'party-affirmative-08', category: 'affirmative', text: 'Outlook: lit' },
      { id: 'party-affirmative-09', category: 'affirmative', text: 'Yes bestie' },
      { id: 'party-affirmative-10', category: 'affirmative', text: 'Signs point to afterparty' },
      { id: 'party-neutral-01', category: 'neutral', text: 'Reply hazy — hydrate first' },
      { id: 'party-neutral-02', category: 'neutral', text: 'Ask again after one dance' },
      { id: 'party-neutral-03', category: 'neutral', text: 'Better not tell you mid-karaoke' },
      { id: 'party-neutral-04', category: 'neutral', text: 'Cannot predict — bass drop incoming' },
      { id: 'party-neutral-05', category: 'neutral', text: 'Concentrate and ask with snacks' },
      { id: 'party-negative-01', category: 'negative', text: "Don't do it — cringe risk" },
      { id: 'party-negative-02', category: 'negative', text: 'Nah fam' },
      { id: 'party-negative-03', category: 'negative', text: 'My sources say leave early' },
      { id: 'party-negative-04', category: 'negative', text: 'Outlook: awkward' },
      { id: 'party-negative-05', category: 'negative', text: 'Very doubtful — text your ex? NO' },
    ],
  },
];

export const EASTER_EGGS: { id: string; text: string }[] = [
  { id: 'egg-01', text: 'The ball is buffering reality' },
  { id: 'egg-02', text: 'Error 8: fate overflow' },
  { id: 'egg-03', text: 'Ask your manager (just kidding)' },
  { id: 'egg-04', text: 'The die is on lunch break' },
  { id: 'egg-05', text: 'You already knew the answer' },
  { id: 'egg-first-visit', text: 'Welcome, seeker of dubious wisdom' },
];

export const THEME_STORAGE_KEY = 'magik_theme';

export function getPackById(id: ThemePack['id']): ThemePack {
  const pack = THEME_PACKS.find((p) => p.id === id);
  if (!pack) return THEME_PACKS[0];
  return pack;
}

export function loadStoredThemeId(): ThemePack['id'] {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'classic' || stored === 'career' || stored === 'party') {
      return stored;
    }
  } catch {
    /* localStorage unavailable */
  }
  return 'classic';
}

export function saveThemeId(id: ThemePack['id']): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, id);
  } catch {
    /* localStorage unavailable */
  }
}
