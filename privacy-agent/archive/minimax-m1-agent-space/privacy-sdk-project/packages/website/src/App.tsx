import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import DocsPage from './pages/DocsPage';
import GuidesPage from './pages/GuidesPage';
import APIPage from './pages/APIPage';
import './App.css';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="privacy-sdk-theme">
      <Router>
        <div className="min-h-screen bg-background font-sans antialiased">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/docs" element={<DocsPage />} />
              <Route path="/guides" element={<GuidesPage />} />
              <Route path="/api" element={<APIPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
