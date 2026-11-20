---
title: Weather dashboard & trend forecasting
slug: weather-dashboard-forecasting
summary: A full-stack Next.js weather app with historical lookups and CRUD history, plus a forecasting study comparing SARIMAX, XGBoost, and KNN.
industry: AI engineering technical assessment
category: Full-stack
year: 2026
role: Full-stack & ML engineer
problem: The assessment offered a choice between a front-end track and a back-end track for a weather product. I chose to do both, plus a data-science study forecasting global weather trends.
solution: A Next.js 15 + TypeScript app that accepts city names, ZIP codes, or GPS coordinates (with reverse geocoding). It routes between live forecast and historical endpoints, rebuilds 5-day historical windows with parallel requests, and persists search history in SQLite through Prisma, with delete and CSV/JSON export. A companion notebook cleans and de-outliers a global weather dataset and compares SARIMAX, XGBoost, and KNN forecasts using RMSE and MAE.
stack: [Next.js, TypeScript, Tailwind CSS, Prisma, SQLite, OpenWeather One Call 3.0, Python, pandas, statsmodels, XGBoost, scikit-learn]
outcome: Both tracks shipped end to end. A custom local-date utility fixed the common UTC "one day behind" bug, and the forecasting notebook benchmarks statistical models against machine-learning models on the same data.
featured: true
order: 4
links:
  repo: https://github.com/siri-dhillon/weather_app
confidential: false
resumeBullets:
  - "Shipped a Next.js 15 + TypeScript weather app (city/ZIP/GPS search, parallel historical lookups, Prisma/SQLite history with CSV/JSON export), and compared SARIMAX, XGBoost, and KNN forecasts by RMSE and MAE."
---
