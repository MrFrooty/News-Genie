# News Genie

News-Genie is a web application designed to fetch and analyze news articles, providing users with insightful and up-to-date news information. The application is split into a backend using Firebase as our choice of database, developed with Flask in Python, and a frontend built using React, with deployment managed through Vercel.

## Project Structure

The project is organized into two main directories:

- `backend/`: Contains the Flask application with Python scripts for fetching and analyzing news.
- `frontend/`: Houses the React application, designed to provide a user-friendly interface for interacting with the news content.

### Backend

The backend is structured as follows:

- `app.py`: Entry point for the Flask application.
- `database.py`: Manages Firebase database interactions.
- `news_analyzer.py`: Contains logic for analyzing news data.
- `news_fetcher.py`: Responsible for fetching news from various sources.
- `requirements.txt`: Lists all Python dependencies for production.
- `requirements-dev.txt`: Lists all Python dependencies for development.

### Frontend

The frontend structure includes:

- `src/`: Contains all the source files for the React application.
  - `components/`: React components like `NewsCard.tsx` and `NewsFeed.tsx`.
  - `services/`: Services like `api.ts` which handle API calls to the backend.
  - `app.tsx`: The main React component that ties the application together.
  - `globals.css`: Global CSS styles.

## Getting Started

### Prerequisites

- Python 3.x
- Node.js 12.x or higher

### Setup

#### Backend

1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment and activate it:
   ```bash
   python -m venv myenv
   source myenv/bin/activate
   ```
3. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   pip install -r requirements-dev.txt (if you are in Dev mode)
   ```
4. Start the server using:
   ```bash
   python app.py
   ```

5. Be sure to make sure that your .env matches the .env.template. Default port will be set to 10000 for Render hosting.

#### Frontend

1. Navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install NPM packages:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   pnpm dev
   ```
OR 

1. Visit https://news-genie.vercel.app/ for the production build. 

## Deployment

- The frontend is deployed using Vercel. To deploy your frontend, push the changes to your GitHub repository and connect it with Vercel.
- The backend is deployed through Render. If you want to run the server locally, we use Flask.

## Contributing

Contributions to News Genie are welcome! Please feel free to submit pull requests or open issues to discuss proposed changes or enhancements.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
