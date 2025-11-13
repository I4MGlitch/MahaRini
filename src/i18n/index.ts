import { createI18n } from 'vue-i18n'

const messages = {
  id: {
    noNotifications: 'Tidak ada notifikasi',
    clearAll: 'Hapus Semua',
    // … other keys
  },
  en: {
    noNotifications: 'No notifications',
    clearAll: 'Clear All',
    // … other keys
  }
}

export const i18n = createI18n({
  legacy: false,
  locale: 'id',            // default Bahasa Indonesia
  fallbackLocale: 'en',
  messages,
  globalInjection: true    // so you can use `$t()` without importing in every component
})
