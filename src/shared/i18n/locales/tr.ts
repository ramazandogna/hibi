import type en from './en'

const tr: typeof en = {
  common: {
    close: 'Kapat',
    cancel: 'Vazgeç',
    save: 'Kaydet',
    saving: 'Kaydediliyor…',
    saved: 'Kaydedildi',
    skip: 'Geç',
    back: 'Geri',
    next: 'İleri',
    done: 'Tamam',
    tryAgain: 'Tekrar dene',
    loading: 'Yükleniyor…',
    delete: 'Sil',
    deletePermanently: 'Kalıcı olarak sil',
    edit: 'Düzenle',
    archive: 'Arşivle',
    restore: 'Geri al',
    moveUp: '{name} yukarı taşı',
    moveDown: '{name} aşağı taşı',
    openItem: '{name} aç',
  },

  nav: {
    main: 'Ana menü',
    today: 'Bugün',
    week: 'Hafta',
    year: 'Yıl',
    profile: 'Profil',
  },

  topbar: {
    settings: 'Ayarlar',
    premium: 'Premium',
  },

  premium: {
    title: 'Hibi Premium',
    subtitle: 'Arkasında sunucu isteyen birkaç özellik. Henüz hazır değil.',
    reminders: 'Doğru saatte gelen hatırlatmalar',
    recaps: 'Gerçekten okunabilen yıllık özetler',
    insights: 'Tüm alışkanlıklarını kapsayan analizler',
    soon: 'Yakında',
  },

  kind: {
    build: {
      label: 'Kazan',
      group: 'Kazanılacak alışkanlıklar',
      streak: 'günlük seri',
      hint: 'Daha sık yapmak istediğin şeyler. İşaretlediğin her gün sayılır.',
    },
    quit: {
      label: 'Bırak',
      group: 'Bırakılacaklar',
      streak: 'temiz gün',
      hint: 'Daha az yapmak istediğin şeyler. Temiz kaldığın günler seriyi büyütür.',
    },
    scale: {
      label: 'Ölçek',
      group: 'Nasıl hissediyorsun',
      streak: 'bu haftaki ort.',
      hint: '1–5 arası puanladığın günlük not. Bir ay böylece bir şekil kazanır.',
    },
  },

  level: {
    1: 'Kötü',
    2: 'Düşük',
    3: 'İdare eder',
    4: 'İyi',
    5: 'Harika',
  },

  today: {
    loadingHabits: 'Alışkanlıklar yükleniyor…',
    emptyTitle: 'Henüz bir kayıt yok',
    emptyDescription: 'Başlamak için birini seç — sonra adını değiştirebilir ya da silebilirsin.',
    thisDay: 'Bu gün',
    addNote: 'Not ekle',
    howWasIt: 'Nasıldı?',
    todayLabel: 'bugün',
    suggestionCode: 'Kod yaz',
    suggestionScroll: 'Gece geç saatte telefon',
    suggestionFeel: 'Nasıl hissediyorum',
  },

  week: {
    previous: 'Önceki hafta',
    next: 'Sonraki hafta',
    notesThisWeek: 'Bu haftanın notları',
    noData: 'Bu hafta için veri yok.',
    review: '{planned} günün {completed} tanesi · %{percent}',
    strongest: 'en güçlüsü {name}',
  },

  year: {
    previous: 'Önceki yıl',
    next: 'Sonraki yıl',
    thatDay: 'O gün',
    hasNote: 'notu var — okumak için dokun',
    less: 'Az',
    more: 'Çok',
  },

  habit: {
    new: 'Yeni alışkanlık',
    newSubtitle: 'Bir ad ver, nasıl takip edileceğini seç, bu kadar.',
    edit: 'Alışkanlığı düzenle',
    name: 'Ad',
    namePlaceholder: 'Kod yaz',
    mode: 'Mod',
    modeLocked: 'Takip modu değiştirilemez — geçmişinin anlamını baştan yazardı.',
    weeklyTarget: 'Haftalık hedef',
    weeklyTargetHint: 'Haftada kaç gün hedefliyorsun. Tutabildiğin dört gün, bıraktığın yediden iyidir.',
    create: 'Alışkanlık oluştur',
    saveChanges: 'Değişiklikleri kaydet',
    archiveHabit: 'Alışkanlığı arşivle',
    archiveSection: 'Arşiv',
    deleteTitle: 'Alışkanlığı sil',
    deleteWithCount: '{name} ve ona ait {count} kayıt silinsin mi?',
    deleteWithOne: '{name} ve ona ait tek kayıt silinsin mi?',
    deleteWithNone: '{name} silinsin mi? Henüz hiç kaydı yok.',
    deleteUnknown: '{name} ve tüm geçmişi silinsin mi?',
    deleteWarning: 'Bu işlem geri alınamaz.',
    loadingHabit: 'Alışkanlık yükleniyor…',
    missing: 'Bu alışkanlık artık mevcut değil.',
    notes: 'Notlar',
    noNotes: 'Henüz not yok. Bu alışkanlığı işaretlerken bir not bırakabilirsin.',
  },

  entry: {
    markedDay: '{name} bu gün için işaretli. Notu düzenleyebilir ya da işareti kaldırabilirsin.',
    removeMark: 'İşareti kaldır',
    removeEntry: 'Kaydı kaldır',
    notePrompt: 'Bugün {name} hakkında hatırlanacak bir şey var mı?',
    optional: 'İsteğe bağlı',
    saveNote: 'Notu kaydet',
    standOut: 'Bu günü farklı kılan neydi?',
    feelToday: 'Bugün neden böyle hissettiriyor?',
    checkInTitle: 'Bugün {name} nasıl?',
    checkInHint: 'Bir seviye seç, sonra nedenini bir cümleyle yaz.',
    completed: '{total} görevin {done} tanesi tamam',
    levelLabel: '{value} — {label}',
  },

  note: {
    label: 'Not',
    placeholder: 'Bugün ne oldu?',
  },

  streak: {
    startToday: 'Bugün başla',
    toYourBest: 'Rekoruna {count} kaldı',
    dontBreak: 'Sakın bozma',
  },

  stats: {
    avgThisWeek: 'bu haftaki ort.',
    avgLastWeek: 'geçen haftaki ort.',
    daysTracked: 'takip edilen gün',
    bestRun: 'en uzun seri',
    last30: 'son 30 gün',
    noData: 'Henüz veri yok',
    avgSummary: 'bu hafta ort. {value}',
    streakSummary: '{count} {label}',
  },

  profile: {
    title: 'Profil',
    signOut: 'Çıkış yap',
    notSignedIn: 'giriş yapılmadı',
    trackingSince: '{date} tarihinden beri takipte',
    activeHabits: 'aktif alışkanlık',
    archived: 'arşivlenmiş',
    account: 'Hesap',
    yourHabits: 'Alışkanlıkların',
    displayName: 'Görünen ad',
    displayNamePlaceholder: 'Adın',
    displayNameHint: 'Şimdilik yalnızca sana görünüyor.',
  },

  settings: {
    title: 'Ayarlar',
    appearance: 'Görünüm',
    theme: 'Tema',
    themeSystem: 'Sistem',
    themeLight: 'Açık',
    themeDark: 'Koyu',
    calendar: 'Takvim',
    weekStart: 'Hafta başlangıcı',
    monday: 'Pazartesi',
    sunday: 'Pazar',
    language: 'Dil',
    languageSystem: 'Sistem',
    languageHint: 'Tarihler ve sayılar seçtiğin dile göre biçimlenir.',
    help: 'Yardım',
    guide: 'Uygulama rehberi',
    guideHint: 'Tüm ekranların tanıtımını yeniden izle.',
    replayGuide: 'Tekrar izle',
    data: 'Verilerin',
    export: 'Her şeyi JSON olarak dışa aktar',
    exportHint: 'Tüm alışkanlık, kayıt ve notları içeren tek bir JSON dosyası.',
    deleteData: 'Verilerimi sil',
    deleteDataTitle: 'Verilerini sil',
    deleteDataBody:
      'Bu işlem tüm alışkanlıkları, kayıtları ve notları siler. Hesabın kalır, sıfırdan başlayabilirsin. Geri alınamaz.',
    typeEmail: 'Onaylamak için e-postanı yaz',
  },

  auth: {
    welcomeBack: 'Tekrar hoş geldin',
    pickUp: 'Kaldığın yerden devam et.',
    startTracking: 'Takibe başla',
    startTrackingHint: 'Kazan, bırak ve nasıl hissettiğini fark et.',
    google: 'Google ile devam et',
    or: 'veya',
    email: 'E-posta',
    emailPlaceholder: 'sen@ornek.com',
    password: 'Parola',
    confirmPassword: 'Parolayı doğrula',
    passwordHint: 'En az 8 karakter',
    rememberMe: 'Bu cihazda oturumum açık kalsın',
    signIn: 'Giriş yap',
    signingIn: 'Giriş yapılıyor...',
    noAccount: 'Hesabın yok mu?',
    createOne: 'Hemen oluştur',
    createAccount: 'Hesap oluştur',
    creatingAccount: 'Hesap oluşturuluyor...',
    alreadyHave: 'Zaten hesabın var mı?',
    checkInbox: 'Gelen kutunu kontrol et — {email} adresine bir onay bağlantısı gönderdik.',
  },

  authError: {
    invalid_credentials: 'E-posta veya parola hatalı.',
    email_not_confirmed: 'Lütfen önce e-posta adresini onayla, sonra giriş yap.',
    user_already_exists: 'Bu e-posta ile bir hesap zaten var.',
    email_exists: 'Bu e-posta ile bir hesap zaten var.',
    weak_password: 'Lütfen daha güçlü bir parola seç.',
    over_request_rate_limit: 'Çok fazla deneme. Biraz bekleyip tekrar dene.',
    over_email_send_rate_limit: 'Çok fazla deneme. Biraz bekleyip tekrar dene.',
    signup_disabled: 'Yeni kayıtlar şu anda kapalı.',
    user_banned: 'Bu hesap askıya alınmış.',
    generic: 'Bir şeyler ters gitti. Lütfen tekrar dene.',
  },

  validation: {
    nameRequired: 'Ad zorunlu.',
    nameMax: 'Ad en fazla 40 karakter olabilir.',
    emailInvalid: 'Geçerli bir e-posta adresi gir.',
    passwordMin: 'Parola en az 8 karakter olmalı.',
    passwordsMismatch: 'Parolalar eşleşmiyor!',
  },

  offline: 'Çevrimdışısın — değişiklikler kaydedilmeyecek.',

  tip: {
    dismiss: 'İpucunu kapat',
    one: 'Bir günü kaçırmak alışkanlığı nadiren bozar. İki gün bozmaya başlar.',
    two: 'Alışkanlıklar, zaten her gün yaptığın bir şeyin arkasına eklendiğinde daha hızlı yerleşir.',
    three: 'Neden aksattığını yazmak, bir seriyi hikâyeye çeviren şeydir.',
    four: 'Küçük hedefler iddialı olanları yener: tutabildiğin dört gün, bıraktığın yediden iyidir.',
    five: 'Nasıl hissettiğini puanlamak beş saniye sürer ve gelecek aya bir şekil verir.',
    six: 'Bırakmak da bir seridir — her temiz gün ilerlemedir.',
  },

  notFound: {
    title: 'Burada bir şey yok',
    description: 'Bu sayfa mevcut değil ya da taşınmış.',
    action: "Bugün'e dön",
  },

  onboarding: {
    skip: 'Geç',
    next: 'İleri',
    start: 'Takibe başla',
    progress: 'Adım {current} / {total}',
    welcomeTitle: "Hibi'ye hoş geldin",
    welcomeBody:
      'Hibi sessiz bir günlük takip uygulaması. Tek dokunuş bir günü işaretler, tek satır nedenini kaydeder ve bir yıllık dokunuş sonunda gerçekten okunabilir bir şeye dönüşür. İşte bir dakikada tüm uygulama.',
    kindsTitle: 'Üç takip yolu',
    kindsBody:
      'Her alışkanlık üç moddan biridir ve mod, bir günün ne anlama geldiğini belirler. Renk uygulamanın her yerinde aynıdır, böylece etiketlere bakmadan bir ekranı okuyabilirsin.',
    buildTitle: 'Yeşil — kazanılacak alışkanlıklar',
    buildBody:
      'Daha çok yapmak istediklerin: okumak, yürümek, kod yazmak. Bir günü işaretlemek kareyi doldurur, arka arkaya günler seri oluşturur. Yedi günün tamamını dayatmak yerine haftalık bir hedef belirlersin; çünkü tutabildiğin dört gün, bıraktığın yediden iyidir.',
    quitTitle: 'Kırmızı — bırakılacaklar',
    quitBody:
      'Daha az yapmak istediklerin: sigara, gece geç saatte telefon, şeker. Burada işaretli bir gün temiz gün sayılır ve seri, ne kadar süredir temiz kaldığındır. Bir kez kaçırmak sayacı sıfırlar, ilerlemeyi değil.',
    scaleTitle: 'Mavi — nasıl hissediyorsun',
    scaleBody:
      '1 ile 5 arasında puanladığın günlük bir günce. Evet/hayır yerine bir seviye seçer ve nedenini bir satırla yazarsın. Her karenin tonu puanı takip eder, böylece zor bir ay ile iyi bir ay ilk bakışta ayrılır.',
    createTitle: 'Alışkanlık oluşturmak',
    createBody:
      'Menü çubuğunun üstündeki buton formu her ekrandan açar. Bir ad ver, modu seç ve yeşil alışkanlıklar için haftada kaç gün hedeflediğini belirle. Mod sonradan kilitlenir — değiştirmek, kaydettiğin her günün anlamını baştan yazardı.',
    todayTitle: 'Bugün ekranı',
    todayBody:
      'Her satır son beş günü ve bugün için büyük bir butonu gösterir. Bugünü işaretlemek için butona, kaçırdığın bir günü düzeltmek için küçük karelerden birine dokun. Mavi alışkanlıklar bunun yerine bir seçici açar ve Hibi, günü puanlayana kadar sormaya devam eder.',
    notesTitle: 'Asıl mesele notlar',
    notesBody:
      'Bir günü her işaretlediğinde Hibi sana not sorar. Ayrıca geri kalan her şey için günde bir not vardır. Gelecek yılı okumaya değer kılan şey bunlardır: seri ne olduğunu, not ise nedenini anlatır.',
    detailTitle: 'Bir alışkanlığın içi',
    detailBody:
      'Herhangi bir alışkanlık satırına dokunarak aç. Güncel serini, en uzun serini, son otuz günü yüzde olarak ve o alışkanlık için yazdığın tüm notları tek listede görürsün.',
    weekTitle: 'Hafta ekranı',
    weekBody:
      'Yedi sütun, alışkanlık başına bir satır, moda göre gruplanmış. Her grup planlanan günlerin kaçını tamamladığını ve haftayı hangi alışkanlığın taşıdığını gösterir. Bir gün başlığına dokunarak o günü tümüyle aç.',
    yearTitle: 'Yıl ekranı',
    yearBody:
      'Tüm yıl için gün başına bir kare. Not içeren günlerde, dokunup yazdığını okuyabileceğin bir işaret bulunur. Bir yıllık küçük dokunuşu bir şeye dönüştüren ekran budur.',
    settingsTitle: 'Kendine göre ayarla',
    settingsBody:
      'Ayarlar; temayı, haftanın Pazartesi mi Pazar mı başladığını ve dili barındırır. Verilerin sana ait: istediğin an her şeyi JSON olarak dışa aktar ya da hepsini silip hesabı koru.',
    doneTitle: 'Hepsi bu kadar',
    doneBody:
      'Bu rehberi istediğin zaman Ayarlar’dan tekrar izleyebilirsin. Tek bir alışkanlıkla başla — ilkinin serisi oluştuktan sonra ikincisini eklemek çok daha kolay.',
  },
}

export default tr
