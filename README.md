# Flash Social Grid

A modern social grid application built with React, TypeScript, and Tailwind CSS. This project allows users to create, view, and interact with a dynamic grid of social content.

## Project Structure

flash-social-grid
├── public/ # Static assets
├── src/ # Source code
│ ├── components/ # Reusable components
│ ├── hooks/ # Custom React hooks
│ ├── integrations/ # Third-party integrations
│ ├── lib/ # Utility functions
│ ├── pages/ # Page components
│ ├── App.tsx # Main application component
│ ├── main.tsx # Entry point
│ └── index.css # Global styles
├── supabase/ # Supabase configuration
├── .env # Environment variables
├── .gitignore # Git ignore rules
├── package.json # Project dependencies
├── README.md # Project documentation
└── vite.config.ts # Vite configuration

## Features

- **Responsive Design**: Built with Tailwind CSS for a fully responsive layout.
- **Dynamic Content**: Easily manage and display social content in a grid format.
- **Supabase Integration**: Backed by Supabase for real-time data management.
- **Custom UI Components**: Utilizes `shadcn/ui` for pre-built, customizable components.
- **React Router**: Seamless navigation between pages with React Router.

## Technologies Used

- **Frontend**: React, TypeScript, Tailwind CSS
- **State Management**: React Query
- **Form Handling**: React Hook Form
- **Routing**: React Router
- **UI Components**: Radix UI, `shadcn/ui`
- **Backend**: Supabase
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/flash-social-grid.git
   ```
2. Navigate to the project directory:
   ```bash
   cd flash-social-grid
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### Running the Project

1. Start the development server:
   ```bash
   npm run dev
   ```
2. Open your browser and navigate to `http://localhost:5173`.

### Building for Production

To build the project for production, run:
```bash
npm run build
```

The production-ready files will be generated in the `dist` directory.

## Project Structure

## Contributing

Contributions are welcome! If you'd like to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes.
4. Push your branch and open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework.
- [Supabase](https://supabase.com/) for the backend services.
- [Radix UI](https://www.radix-ui.com/) for accessible UI primitives.
- [React](https://reactjs.org/) for the frontend library.