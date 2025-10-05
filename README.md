# Cosmotrix Frontend

This is the frontend for Cosmotrix, a web application built with [Next.js](https://nextjs.org/), [TypeScript](https://www.typescriptlang.org/), and [Tailwind CSS](https://tailwindcss.com/).

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- pnpm
  ```sh
  npm install -g pnpm
  ```

### Installation

1.  Clone the repo
    ```sh
    git clone https://github.com/cosmotrixx/cosmotrix-fe.git
    ```
2.  Install NPM packages
    ```sh
    pnpm install
    ```
3.  Create a `.env.local` file in the root of the project and add the following environment variables:
    ```
    NEXT_PUBLIC_API_URL=http://localhost:8000
    ```

### Running the Development Server

First, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Available Scripts

In the project directory, you can run:

-   `pnpm dev`: Runs the app in the development mode.
-   `pnpm build`: Builds the app for production to the `.next` folder.
-   `pnpm start`: Starts the production server.
-   `pnpm lint`: Lints the project files.

## Pages

The application consists of the following pages:

-   `/`: The landing page of the application.
-   `/story`: The page where the story of the game is presented.
-   `/characters`: The page where the characters of the game are presented.
-   `/game`: The page where the game is played.
-   `/about`: The page that contains information about the project.

## Technologies Used

-   [Next.js](https://nextjs.org/) - React framework for production
-   [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
-   [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
-   [Shadcn/ui](https://ui.shadcn.com/) - Re-usable components built using Radix UI and Tailwind CSS.
-   [Vercel](https://vercel.com/) - Deployment platform

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
