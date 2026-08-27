/**
 * The message schema.
 *
 * Every other locale is typed as `typeof en`, so a missing or misspelled key is
 * a compile error rather than a raw key rendered on screen.
 */
const en = {
  common: {
    close: 'Close',
    cancel: 'Cancel',
    save: 'Save',
    saving: 'Saving…',
    saved: 'Saved',
    skip: 'Skip',
    back: 'Back',
    next: 'Next',
    done: 'Done',
    tryAgain: 'Try again',
    loading: 'Loading…',
    delete: 'Delete',
    deletePermanently: 'Delete permanently',
    export: 'Export',
    edit: 'Edit',
    archive: 'Archive',
    restore: 'Restore',
    moveUp: 'Move {name} up',
    moveDown: 'Move {name} down',
    openItem: 'Open {name}',
  },

  nav: {
    main: 'Main',
    today: 'Today',
    week: 'Week',
    year: 'Year',
    profile: 'Profile',
  },

  topbar: {
    settings: 'Settings',
    premium: 'Premium',
  },

  premium: {
    title: 'Hibi Premium',
    subtitle: 'A few things that need a server behind them. Not available yet.',
    reminders: 'Reminders that arrive at the right hour',
    recaps: 'Yearly recaps you can actually read',
    insights: 'Insights across all of your habits',
    soon: 'Coming soon',
  },

  kind: {
    build: {
      label: 'Build',
      group: 'Habits to build',
      streak: 'day streak',
      hint: 'Something you want to do more often. Every day you do it counts.',
    },
    quit: {
      label: 'Quit',
      group: 'Things to quit',
      streak: 'clean days',
      hint: 'Something you want to do less. Days you stay clean are the streak.',
    },
    scale: {
      label: 'Scale',
      group: 'How you feel',
      streak: 'avg this week',
      hint: 'A daily journal entry rated 1 to 5, so a month gets a shape.',
    },
  },

  level: {
    1: 'Rough',
    2: 'Low',
    3: 'OK',
    4: 'Good',
    5: 'Great',
  },

  today: {
    loadingHabits: 'Loading habits…',
    emptyTitle: 'Nothing tracked yet',
    emptyDescription: 'Pick one to start with — you can rename or remove it later.',
    thisDay: 'This day',
    addNote: 'Add a note',
    howWasIt: 'How was it?',
    todayLabel: 'today',
    suggestionCode: 'Write code',
    suggestionScroll: 'Late-night scrolling',
    suggestionFeel: 'How I feel',
  },

  week: {
    previous: 'Previous week',
    next: 'Next week',
    notesThisWeek: 'Notes this week',
    noData: 'No data for this week.',
    review: '{completed} of {planned} days · {percent}%',
    strongest: 'strongest {name}',
  },

  year: {
    previous: 'Previous year',
    next: 'Next year',
    thatDay: 'That day',
    hasNote: 'has a note — tap to read',
    less: 'Less',
    more: 'More',
  },

  habit: {
    new: 'New habit',
    newSubtitle: 'Name it, pick how it should be tracked, and you are done.',
    edit: 'Edit habit',
    name: 'Name',
    namePlaceholder: 'Write code',
    mode: 'Mode',
    modeLocked: 'Tracking mode cannot be changed — it would reinterpret your history.',
    weeklyTarget: 'Weekly target',
    weeklyTargetHint: 'Days per week you are aiming for. Four you keep beats seven you drop.',
    create: 'Create habit',
    saveChanges: 'Save changes',
    archiveHabit: 'Archive habit',
    archiveSection: 'Archive',
    deleteTitle: 'Delete habit',
    deleteWithCount: 'Delete {name} and its {count} entries?',
    deleteWithOne: 'Delete {name} and its single entry?',
    deleteWithNone: 'Delete {name}? It has no entries yet.',
    deleteUnknown: 'Delete {name} and its history?',
    deleteWarning: 'This cannot be undone.',
    loadingHabit: 'Loading habit…',
    missing: 'This habit no longer exists.',
    notes: 'Notes',
    activity: 'Activity',
    since: 'Tracking since {date}',
    noNotesTitle: 'Nothing written down yet',
    noNotes: 'No notes yet. Add one when you check this habit off.',
  },

  entry: {
    markedDay: '{name} is marked for this day. Edit the note, or remove the mark.',
    removeMark: 'Remove mark',
    removeEntry: 'Remove entry',
    notePrompt: 'Anything to remember about {name} today?',
    optional: 'Optional',
    saveNote: 'Save note',
    standOut: 'Why does this day stand out?',
    feelToday: 'Why does today feel like this?',
    checkInTitle: "How's your {name} today?",
    checkInHint: 'Pick a level, then write a line about why.',
    completed: '{done} of {total} completed',
    levelLabel: '{value} — {label}',
  },

  note: {
    label: 'Note',
    placeholder: 'What happened today?',
  },

  streak: {
    startToday: 'Start today',
    toYourBest: '{count} to your best',
    dontBreak: "Don't break it",
  },

  stats: {
    avgThisWeek: 'avg this week',
    avgLastWeek: 'avg last week',
    daysTracked: 'days tracked',
    bestRun: 'best run',
    last30: 'last 30 days',
    noData: 'No data yet',
    avgSummary: 'avg {value} this week',
    streakSummary: '{count} {label}',
  },

  profile: {
    title: 'Profile',
    signOut: 'Sign out',
    notSignedIn: 'not signed in',
    trackingSince: 'Tracking since {date}',
    activeHabits: 'active habits',
    archived: 'archived',
    account: 'Account',
    yourHabits: 'Your habits',
    displayName: 'Display name',
    displayNamePlaceholder: 'Your name',
    displayNameHint: 'Shown only to you, for now.',
  },

  settings: {
    title: 'Settings',
    appearance: 'Appearance',
    theme: 'Theme',
    themeSystem: 'System',
    themeLight: 'Light',
    themeDark: 'Dark',
    calendar: 'Calendar',
    weekStart: 'Week starts on',
    monday: 'Monday',
    sunday: 'Sunday',
    language: 'Language',
    languageSystem: 'System',
    languageHint: 'Dates and numbers follow the language you pick.',
    help: 'Help',
    guide: 'App guide',
    guideHint: 'Ninety seconds on why habits work, and how Hibi tracks them.',
    replayGuide: 'Replay',
    data: 'Your data',
    export: 'Export everything as JSON',
    exportHint: 'One JSON file with every habit, entry and note.',
    deleteData: 'Delete my data',
    deleteDataTitle: 'Delete your data',
    deleteDataBody:
      'This removes every habit, entry and note. Your account stays, so you can start over. It cannot be undone.',
    typeEmail: 'Type your email to confirm',
  },

  auth: {
    welcomeBack: 'Welcome back',
    pickUp: 'Pick up where you left off.',
    startTracking: 'Start tracking',
    startTrackingHint: 'Build, quit, and notice how you feel.',
    google: 'Continue with Google',
    or: 'or',
    email: 'Email',
    emailPlaceholder: "you{'@'}example.com",
    password: 'Password',
    confirmPassword: 'Confirm password',
    passwordHint: 'At least 8 characters',
    rememberMe: 'Keep me signed in on this device',
    signIn: 'Sign in',
    signingIn: 'Signing in...',
    noAccount: 'No account yet?',
    createOne: 'Create one',
    createAccount: 'Create account',
    creatingAccount: 'Creating account...',
    alreadyHave: 'Already have an account?',
    checkInbox: 'Check your inbox — we sent a confirmation link to {email}.',
  },

  authError: {
    invalid_credentials: 'Email or password is incorrect.',
    email_not_confirmed: 'Please confirm your email address, then sign in.',
    user_already_exists: 'An account with this email already exists.',
    email_exists: 'An account with this email already exists.',
    weak_password: 'Please choose a stronger password.',
    over_request_rate_limit: 'Too many attempts. Please wait a moment and try again.',
    over_email_send_rate_limit: 'Too many attempts. Please wait a moment and try again.',
    signup_disabled: 'New sign-ups are currently disabled.',
    user_banned: 'This account has been suspended.',
    generic: 'Something went wrong. Please try again.',
  },

  validation: {
    nameRequired: 'Name is required.',
    nameMax: 'Name must be 40 characters or fewer.',
    emailInvalid: 'Enter a valid email address.',
    passwordMin: 'Password must be at least 8 characters.',
    passwordsMismatch: 'Passwords do not match!',
  },

  offline: "You're offline — changes won't be saved.",

  tip: {
    dismiss: 'Dismiss tip',
    one: 'Missing one day rarely breaks a habit. Missing two starts to.',
    two: 'Habits stick faster when they follow something you already do every day.',
    three: 'Writing down why you slipped is what turns a streak into a story.',
    four: 'Small targets beat ambitious ones: four days a week you keep beats seven you drop.',
    five: 'Rating how you feel takes five seconds and gives next month a shape.',
    six: 'Quitting is a streak too — every clean day counts as progress.',
  },

  notFound: {
    title: 'Nothing here',
    description: 'That page does not exist, or it moved.',
    action: 'Back to today',
  },

  onboarding: {
    skip: 'Skip',
    next: 'Next',
    start: 'Start with one',
    progress: '{current} / {total}',
    discover: 'Take the tour',
    discoverHint: 'Ninety seconds — why this works, and what the colours mean.',

    coverTitle: 'ひび means days',
    coverBody:
      'Not goals, not systems, not productivity. Days — one after another, each one a small square you either fill or you do not. Give this ninety seconds and it will show you why that turns out to be enough.',

    habitualValue: '43%',
    habitualLabel: 'of daily behaviour, on autopilot',
    habitualTitle: 'You already run on habits',
    habitualBody:
      'A diary study of ordinary life found that roughly 43% of what people did was performed almost every day, in the same place, without deciding to. You never chose whether to live by habit. You only choose which ones.',
    habitualSource: 'Wood, Quinn & Kashy (2002), Journal of Personality and Social Psychology',

    sixtysixValue: '66',
    sixtysixLabel: 'days to automatic, median',
    sixtysixRange: 'though it ran from 18 to 254',
    sixtysixTitle: 'Twenty-one days is a myth',
    sixtysixBody:
      'Researchers at University College London followed people forming one new habit and measured when it stopped taking effort. The median was 66 days, and the spread was enormous. If yours feels slow, you are not failing — you are inside the range.',
    sixtysixSource:
      'Lally, van Jaarsveld, Potts & Wardle (2010), European Journal of Social Psychology',

    missTitle: 'One missed day costs almost nothing',
    missBody:
      'The same study checked what happened when someone skipped: a single missed opportunity had no measurable effect on how the habit formed. What ends a streak is rarely the gap. It is deciding the gap means something. Hibi draws it as one pale square in a wall of colour — exactly as important as it is.',
    missSource:
      'Lally et al. (2010) — a single missed opportunity did not materially affect habit formation',

    compoundUp: '37.8×',
    compoundDown: '0.03×',
    compoundTitle: 'The boring day is the whole point',
    compoundBody:
      'Get one percent better every day for a year and you end up thirty-seven times better. Slip one percent a day and you end up near zero. Nothing dramatic happens on any single day — which is exactly why a tracker beats motivation.',
    compoundNote: 'Arithmetic, not a study: 1.01³⁶⁵ ≈ 37.8 and 0.99³⁶⁵ ≈ 0.03.',

    modesTitle: 'Three ways to mark a day',
    modesBody:
      'Every habit is one of three modes, and the mode decides what a filled square means. The colour follows it everywhere in the app, so you can read a whole screen without reading a word. Tap one.',

    cueTrigger: 'After my coffee',
    cueAction: 'Read 20 pages',
    cueTitle: 'Name the moment, not the goal',
    cueBody:
      'Across 94 studies, people who decided in advance exactly when and where they would act were substantially more likely to follow through — one of the most dependable effects in behavioural science. So call it “Read after coffee”, not “Read more”. Let the cue do the remembering.',
    cueSource:
      'Gollwitzer & Sheeran (2006), Advances in Experimental Social Psychology — 94 studies, a medium-to-large effect',

    recordNoteDate: '12 March',
    recordNoteBody:
      'Skipped the gym and wrote instead. Turns out I do not hate mornings, I hate rushing them.',
    recordTitle: 'The tracking is the intervention',
    recordBody:
      'A meta-analysis of 138 studies found that monitoring progress toward a goal makes reaching it more likely — and the effect was larger when the progress was physically recorded. Marking the day is not admin you do after the work. It is part of the work.',
    recordSource: 'Harkin et al. (2016), Psychological Bulletin — 138 studies',

    yearTitle: 'Then one day you scroll back',
    yearBody:
      'Every square you fill is one pixel of a picture you cannot see yet. A month in, it looks like noise. A year in, it looks like evidence — and the days you left a note on are the ones you will actually stop at.',

    startTitle: 'Start with one',
    startBody:
      'Not five. One, small enough that a bad day cannot stop it. The second habit is far easier to add once the first has a line worth protecting.',
  },
}

export default en
