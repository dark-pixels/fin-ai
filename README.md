# Financial Health Advisor

A React-based application that helps users analyze their financial health by inputting income, expenses, loans, and savings. The app calculates a financial score, risk level, and provides personalized suggestions and a 6-month roadmap.

## Features

- **Multi-step Financial Assessment Form**: Easy-to-use form to input financial data.
- **Instant Financial Score**: Real-time calculation of financial health score (0-100).
- **Risk Assessment**: Categorizes financial health into Excellent, Moderate, or High Risk.
- **Interactive Dashboard**: Visualizes data with charts using Recharts.
- **AI-Powered Suggestions**: Provides actionable advice based on financial ratios.
- **6-Month Roadmap**: Generates a step-by-step plan to improve financial stability.
- **Dark/Light Mode**: Fully responsive design with theme support.

## Tech Stack

- **React (Vite)**
- **Tailwind CSS** (v4)
- **Framer Motion** (Animations)
- **Recharts** (Data Visualization)
- **Lucide React** (Icons)
- **React Router DOM** (Routing)

## Getting Started

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
4.  Open the app in your browser (usually `http://localhost:5173`).

## Project Structure

- `src/components`: Reusable UI components (Layout).
- `src/pages`: Main application pages (Landing, FinancialForm, Dashboard).
- `src/utils`: Utility functions (financial calculations).
- `src/hooks`: Custom hooks (if any).

## License

MIT
