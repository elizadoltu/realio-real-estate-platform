# 🏡 Realio - Real Estate Platform

Realio is a smart real estate management system that allows you to manage property listings, handle client inquiries, and predict property market trends using machine learning. This README covers the frontend part of the application, built with Angular and styled with Tailwind CSS.

## 🌐 Live Demo

* The frontend is live and accessible at: [Realio Live App](https://realio-five.vercel.app/)
* Backend repository: [Link to backend Repository](https://github.com/edwardedi/RealEstateManagement)
* Backend and database are deployed on **`Railway`**.

## 🚀 Features

* **`Responsive UI`**: Built with Angular and Angular Material to ensure a sleek and user-friendly design.
* **`Property Management`**: List, view, and manage property details with ease.
* **`Client Inquiries`**: Streamlined management of client queries.
* **`Market Insights`**: Machine learning module provides property trend predictions.
* **`Animations`**: Smooth animations using GSAP for a modern look.
* **`Authentication`**: JWT-secured login and authorization.
* **`Clean Design`**: Styled with Tailwind CSS for a minimal and responsive interface.

## 🛠️ Tech Stack

### Frontend

* **`Framework`**: Angular
* **`UI/UX`**: Angular Material, Tailwind CSS
* **`Animations`**: GSAP
* **`Deployment`**: Vercel

### Backend

* **`Clean Architecture`** with CQRS
* **`MediatR`** for handling commands and queries
* **`PostgreSQL`** as the database
* **`JWT`** for secure authentication
* **`Machine learning`** insights via ML.NET

## 🗂️ Project Structure

The frontend follows a modular and scalable structure:

```bash
src/
├── app/
│   ├── components/      # Reusable UI components
│   ├── services/        # API calls and business logic
│   ├── models/          # TypeScript models for data
|   └── auth.guard       # Guards routes by checking for authentication tokens and platform type
├── styles.css           # Tailwind global styles
├── assets/              # Static files like images and icons
├── environments/        # Environment configurations (dev/production)
├── fonts/               # Static files for custom fonts
└── main.ts              # Application entry point
```

## 🧑‍💻 Getting Started

Follow these steps to run the project locally:

### 1. Prerequisites 

* **`Node.js`** (v14 or higher)
* **`Angular CLI`** (v15 or higher): Install it using ``` npm install -g @angular/cli ```

### 2. Clone the Repository

```bash
git clone https://github.com/your-username/realio-frontend.git
cd realio-frontend
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the project
```bash
ng serve
```

The application will run locally on ``` http://localhost:4200/ ```

## ✅ Testing

Run unit tests ising Angular's testing suite:
```bash
ng test --no-watch --code-coverage
```

* **`Code Coverage`**: Achieved 80% coverage for all frontend components

## 🔗 Deployment

* **`Frontend`**: Deployed on Vercel at (https://realio-five.vercel.app)[https://realio-five.vercel.app]
* **`Backend`**: Deployed on Railway.

## 💻 Contributing

Contributions are welcome!
1. Fork the repository
2. Create a new branch
3. Submit a pull request

## 📜 License 

This project is under MIT License and developed within the **`UAIC Faculty`** and is for educational purpose.

## 📧 Contact

For any questions or suggestions, feel free to reach out:

[Eliza - Teodora Doltu] | Email: elizadoltuofficial@gmail.com


## ***🚀 "Realio: Smart, simple, and predictive real estate management." 🏡✨***
