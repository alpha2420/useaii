This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## 🚀 Production Deployment (Hostinger VPS)

This application is hosted on a dedicated Ubuntu VPS. All updates are seamlessly pushed to the server via an automated Expect script.

To deploy your new updates after committing to GitHub:

1. Commit and push your changes to GitHub normally:
   ```bash
   git add .
   git commit -m "your message"
   git push origin main
   ```
2. Run the automated VPS deployment script locally:
   ```bash
   ./scratch/update_server.exp
   ```

*(Note: The deployment script `update_server.exp` is securely checked into version control. Any other test or output files in the `scratch/` directory are ignored.)*
