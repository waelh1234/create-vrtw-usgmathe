# create-vrtw-usgmathe

Create a new project using the **vite-react-ts-tailwind-minimal** template.

## 🚀 Prerequisites

- Node.js >= 18
- Git (optional, for initializing a git repository)
- Recommended: **pnpm**, but the CLI works with npm or yarn as well. The script will detect your package manager automatically.

---

## 🚀 Usage

### Recommended

```bash
pnpm create vrtw-usgmathe@latest my-app
````

### Alternative

```bash
npx create-vrtw-usgmathe my-app
```

or

```bash
npm create vrtw-usgmathe my-app
```

### CLI Flags

* `--no-install` → Skip automatic dependency installation
* `--no-git` or `--git=false` → Skip git initialization

The CLI will detect whether you ran it with **npm**, **pnpm**, or **yarn** and use the same package manager for installing dependencies and shadcn UI.

---

## ✨ Features

* Vite
* React 18
* TypeScript 5
* TailwindCSS
* Prettier + Tailwind sorting
* Minimal and clean project structure
* Optional **shadcn UI** integration

---

## ✅ What This CLI Does

* Clones the template from GitHub
* Installs dependencies (optional)
* Initializes git (optional)
* Offers to install **shadcn UI** (optional)
* Prepares everything for development

---

## 🛠 Next Steps

After creating your project:

```bash
# 1. Enter your project folder
cd my-app

# 2. Install dependencies (if you skipped automatic install)
pnpm install

# 3. Run development server
pnpm run dev
```

If you chose to install **shadcn UI** during setup, it will already be initialized.
Otherwise, you can manually add it anytime:

```bash
pnpm dlx shadcn@latest init
```

> The CLI will replace your `package manager` with npm, pnpm, or yarn automatically based on how you ran it.

---

## 📦 Template Repository

[https://github.com/usgmathe/vite-react-ts-tailwind-minimal](https://github.com/usgmathe/vite-react-ts-tailwind-minimal)

---

## 📝 License

MIT
