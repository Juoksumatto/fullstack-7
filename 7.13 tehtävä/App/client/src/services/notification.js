import { create } from 'zustand'

const useNotificationStore = create((set) => ({
  message: null,

  setNotification: (message, seconds) => {
    set({ message })

    setTimeout(() => {
      set({ message: null })
    }, seconds * 1000)
  },
}))

export default useNotificationStore