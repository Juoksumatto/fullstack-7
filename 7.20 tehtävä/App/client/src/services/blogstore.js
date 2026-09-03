import { create } from 'zustand'

const useBlogStore = create((set) => ({
  blogs: [],
  setBlogs: (blogs) => set({ blogs }),
  addBlog: (blog) => set((state) => ({ blogs: state.blogs.concat(blog) })),
}))

export default useBlogStore
