# News Genie

News Genie is a web application designed to serve as an article source archive, allowing users to find and retrieve news articles related to specific topics. The application is divided into a backend, using Firebase for database management and developed with Flask in Python, and a frontend built using React, with deployment handled through Vercel.

## Project Structure

The project is organized into two main directories:

- `backend/`: Contains the Flask application with Python scripts for fetching and storing news sources.
- `frontend/`: Houses the React application, designed to provide a user-friendly interface for interacting with the archive.

### Backend

The backend is structured as follows:

- `app.py`: Entry point for the Flask application.
- `database.py`: Manages Firebase database interactions.
- `news_analyzer.py`: Contains logic for categorizing and organizing news sources.
- `news_fetcher.py`: Responsible for fetching news from various sources and storing them in the archive.
- `requirements.txt`: Lists all Python dependencies for production.
- `requirements-dev.txt`: Lists all Python dependencies for development.

### Frontend

The frontend structure includes:

- `src/`: Contains all the source files for the React application.
  - `components/`: React components like `NewsCard.tsx` and `NewsFeed.tsx`.
  - `services/`: Services like `api.ts` that handle API calls to the backend.
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
2. Backend prod is directly linked to MrrFrooty's port 10000 status, so if the Backend is down it is most likely because MrrFrooty has shut down his 10000 port.

## Deployment

- The frontend is deployed using Vercel. To deploy your frontend, push the changes to your GitHub repository and connect it with Vercel.
- The backend is deployed through Render. If you want to run the server locally, we use Flask.

## Demo Video
[[![Watch the video](https://img.youtube.com/vi/V9jR_agnCzI/maxresdefault.jpg)](https://www.youtube.com/watch?v=V9jR_agnCzI)](https://github.com/user-attachments/assets/acdf7a18-2f73-4a86-a97c-4c5cba048942
)

## Contributing

Contributions to News Genie are welcome! Please feel free to submit pull requests or open issues to discuss proposed changes or enhancements.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
