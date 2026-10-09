# المفكرة AI

نموذج ويب تفاعلي عربي RTL لتطبيق ملاحظات ومهام، مبني باستخدام React وTypeScript وVite وLucide.

## الروابط

- المستودع: https://github.com/abnkango/mofakkira-ai
- المعاينة العامة عبر GitHub Pages: https://abnkango.github.io/mofakkira-ai/

## التشغيل محليًا

```bash
pnpm install
pnpm dev
```

ثم افتح العنوان الذي يظهره Vite، غالبًا `http://localhost:3000`.

## البناء

```bash
pnpm build
```

التطبيق نموذج UX/UI فقط، ببيانات تجريبية وردود مساعد محاكاة، دون backend أو طلبات شبكة. الحالة تُحفظ محليًا في `localStorage`.
