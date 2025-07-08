export const ADDITIONNAL_STEPS_OPTIONS = [
  {
    value: "clean",
    label: "Clean up default template",
    hint: "recommended",
  },
  {
    value: "tailwindcss",
    label: "Install Tailwind CSS",
  },
] as const;

export const FRAMEWORK_OPTIONS = [
  { value: "vue", label: "Vue.js" },
  { value: "nuxt", label: "Nuxt" },
]