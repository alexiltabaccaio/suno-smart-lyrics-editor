# 🎵 Suno Smart Lyrics Editor: A UX Proposal for Intelligent Songwriting

<img src="https://github.com/user-attachments/assets/6ed50d0f-c6c4-4d0e-bce8-a86bfe9160f2" alt="Suno Smart Lyrics Editor Interface Preview" width="400">

👉 **[Try the Live Demo Here](https://suno-smart-lyrics-editor.vercel.app/)**

**As a frequent Suno creator, I wanted to solve the frustration of failed generations caused by simple formatting mistakes. This project is a proof of concept for a smarter, more intuitive lyrics editor.**

It demonstrates how an intelligent UI can reduce friction for creators, minimize syntax errors, and accelerate the "Idea to Song" workflow. 

---

## ✨ Key Features

- ✨ **Semantic Syntax Highlighting:** Instantly separates `[Structure]`, `[Instruments]`, and `(Vocals)`. You get immediate visual feedback even before closing the bracket.
- ⚡ **Smart Toolbar:** A dynamic floating toolbar that follows your cursor line-by-line. Cycle through tags without typing.
- 🧠 **Context-Aware Suggestions:** Automatically predicts the most likely next section (e.g., suggests `[Chorus]` after a `[Verse]`).
- 🚀 **Zero-latency:** Native text-engine sync. No lag, no flicker—just a professional-grade writing experience.

---

## 💡 The Problem it Solves
Currently, interacting with a standard text area leads to:
1. **Wasted Credits**: Users often forget brackets or misspell tags (e.g., `[Chorus` vs `[Chorus]`), leading to generations that ignore the prompt.
2. **Workflow Friction**: Manually typing structural tags breaks the creative flow.
3. **Lack of Visual Hierarchy**: It's difficult to distinguish between lyrics, structure, and instrument cues at a glance.

---

## 🛠 Under the Hood

While the focus is on the UX, this is a fully functional, highly optimized React prototype:
- **Tech Stack**: React 18, TypeScript, Tailwind CSS, Vite.
- **Custom Text Engine**: Uses a transparent `<textarea>` layered over a custom `<TagBackdrop>` to provide rich text highlighting without the heavy overhead of libraries like Draft.js or ProseMirror.
- **Regex Parsing**: Real-time semantic parsing using word boundaries to accurately identify and style tags on the fly.
- **Synchronous Cursor Tracking**: Custom hooks (`useTextareaLineTracker`) bypass standard React render cycles for critical selection updates, ensuring the floating toolbar perfectly tracks the native cursor with zero latency.

---

## 🚀 Vision
The goal of this prototype is to show that the editor shouldn't just be a place to *store* text—it should be a partner in the *creative process*. Natively integrating something like this would make the workflow smoother for power users and significantly lower the barrier to entry for beginners.

---

## 📄 Getting Started (Local Development)
1. **Install dependencies**: `npm install`
2. **Run development server**: `npm run dev`

---

## 🏷️ Tags
`react` • `tailwind-css` • `suno-ai` • `lyrics-editor` • `ux-design` • `typescript` • `songwriting`

---

## 📄 License
Distributed under the MIT License. See LICENSE for more information.

---

*Prototype developed by [Alex Giustizieri](https://www.linkedin.com/in/alexgiustizieri/)*
