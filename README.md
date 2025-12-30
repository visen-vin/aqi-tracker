# 🌍 Antigravity AQI Tracker

> **Breathe Smarter.** A next-generation, real-time Air Quality Index (AQI) monitoring application built for precision, aesthetics, and speed.

![Project Status](https://img.shields.io/badge/Status-Active_Development-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Redux](https://img.shields.io/badge/Redux_Toolkit-Query-764ABC?style=for-the-badge&logo=redux)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)

## 📖 Overview

The **Antigravity AQI Tracker** is a high-performance web dashboard designed to provide users with accurate, real-time air quality data for their location and major cities worldwide. Built with a "Weightless Elegance" design philosophy, it combines deep atmospheric data with a stunning, glassmorphic UI.

Unlike standard weather apps, this tracker focuses specifically on detailed pollutant breakdowns (PM2.5, PM10, NO2, SO2, O3, CO) and provides health-centric insights using both **US EPA** and **Indian CPCB** standards (configurable).

## ✨ Key Features

### 🟢 Live Dashboard
- **Real-time AQI Gauge**: A visually immersive gauge that dynamically changes color and theme based on pollution levels.
- **Auto-Geolocation**: Instantly detects your current location to show hyper-local air quality data.
- **Comprehensive Pollutants**: Detailed tracking of PM2.5, PM10, Nitrogen Dioxide, Sulfur Dioxide, Carbon Monoxide, and Ozone.
- **Weather Integration**: Seamlessly integrated live weather context (Temperature, Humidity, Wind Speed) powered by Open-Meteo.

### 📈 Data Visualization
- **Interactive Trend Charts**: Visualise AQI history over the last 24 hours to spot pollution patterns.
- **Glassmorphic UI**: A premium, dark-mode-first interface using backdrop blurs and smooth Framer Motion animations.

### 🌐 Global Monitoring (In Development)
- **City Comparisons**: Compare your air quality against major metro cities like Delhi, Mumbai, and New York.
- **Global Rankings**: (Coming Soon) A dynamic leaderboard of the world's most polluted cities.
- **Interactive Map**: (Coming Soon) A 3D globe view of air quality hotspots.

## 🛠️ Technology Stack

This project is engineered for performance and scalability:

*   **Frontend Core**: React 19 (Vite)
*   **State Management**: Redux Toolkit & RTK Query (Caching, Polling, Optimistic Updates)
*   **Styling**: Tailwind CSS & Vanilla CSS Variables
*   **Animations**: Framer Motion
*   **Data Visualization**: Recharts
*   **Icons**: Lucide React
*   **APIs**:
    *   **Open-Meteo**: For high-precision Air Quality & Weather data.
    *   **BigDataCloud**: For reverse geocoding (Coordinates to City Name).

## 🚀 Getting Started

Follow these steps to run the project locally:

### Prerequisites
*   Node.js (v18 or higher)
*   npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/visen-vin/aqi-tracker.git
    cd aqi-tracker
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

4.  **Open in Browser**
    Navigate to `http://localhost:5173` to view the app.

## 📂 Project Structure

```bash
src/
├── components/         # Reusable UI components
│   ├── common/         # Header, Footer, Loaders
│   ├── dashboard/      # Dashboard-specific widgets (Gauge, Charts)
│   └── layout/         # Layout wrappers (Atmosphere background)
├── config/             # App-wide configuration
├── screens/            # Main Page Views (Dashboard, Rankings, Map)
├── store/              # Redux State Management
│   ├── api/            # RTK Query API definitions
│   └── slices/         # Redux Slices
├── utils/              # Helper functions (AQI Calculation logic)
└── App.jsx             # Main Application Entry
```

## 🔮 Roadmap

- [x] **Core Dashboard**: Live Data, Pollutants, Trends.
- [x] **Comparing Cities**: Basic static comparison.
- [ ] **Global Rankings**: Integration with dynamic ranking APIs.
- [ ] **Heatmap**: Visual map overlay for pollution intensity.
- [ ] **PWA Support**: Installable mobile web app experience.
- [ ] **Notifications**: Alerts when AQI breaches safe limits.

## 📚 Resources & Acknowledgements

This project was made possible by these incredible open-source tools and data providers:

### 📡 APIs & Data
*   **[Open-Meteo](https://open-meteo.com/)**: The core engine powering our Air Quality and Weather data. An amazing free, open-source API.
*   **[BigDataCloud](https://www.bigdatacloud.com/)**: Used for high-precision client-side reverse geocoding to detect city names from coordinates.

### 🎨 Design & Icons
*   **[Lucide React](https://lucide.dev/)**: Beautiful, consistent, and lightweight icon pack.
*   **[Tailwind CSS](https://tailwindcss.com/)**: The utility-first CSS framework that enables our rapid, custom UI development.
*   **[Framer Motion](https://www.framer.com/motion/)**: For the buttery smooth animations and "weightless" feel.
*   **[Recharts](https://recharts.org/)**: Composable charting library used for the trend visualization.

### ⚛️ Core Libraries
*   **[React 19](https://react.dev/)**: The latest version of the web's most popular library.
*   **[Redux Toolkit](https://redux-toolkit.js.org/)**: For efficient state management and RTK Query data fetching.
*   **[Vite](https://vitejs.dev/)**: Next-generation frontend tooling.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
