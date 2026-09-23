# Abdulkarim Aklouk — Portfolio

Personal website for **Abdulkarim Aklouk**, a Computer Engineering student and Full-Stack Web Developer in Cairo.

The site is static HTML, CSS, and JavaScript. Open `index.html` locally, or use VS Code Live Server (port 5501).

**Contact**

- Email: [abdulkarim.aklouk@gmail.com](https://mail.google.com/mail/?view=cm&fs=1&to=abdulkarim.aklouk@gmail.com)
- Phone: 01158250466
- GitHub: [abdulkarimaklouk](https://github.com/abdulkarimaklouk)

---

## Featured projects

The following projects are listed on the portfolio. Each entry states whether a backend is hosted.

---

### 1. Restaurant Meal Management System

**Project Overview**  
A full-stack restaurant system for managing meals, ingredients, inventory, and orders.

**Purpose**  
Give a restaurant a structured way to keep meal data, stock, and orders in one place instead of tracking them by hand.

**Key Features**

- Relational MySQL design with structured entity relationships
- REST APIs for meals, ingredients, inventory, and orders
- CRUD operations and backend business logic
- Frontend pages for stores, meals, ingredients, inventory, orders, and sales

**Technologies Used**

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express.js, REST APIs
- Database: MySQL

**My Role**  
I designed the database, implemented the REST API, and built the frontend pages.

**Live Demo**  
[stores.html](https://abdulkarimaklouk.github.io/restaurant-management-frontend/stores.html)

**Source Code**

- Frontend: [restaurant-management-frontend](https://github.com/abdulkarimaklouk/restaurant-management-frontend)
- Backend: [restaurant-management-backend](https://github.com/abdulkarimaklouk/restaurant-management-backend)

**Backend Status:** The backend is not currently hosted on a server. The available live demo showcases the frontend interface. Backend-dependent data and functionality are not available in the live demo.

---

### 2. Social Media Application

**Project Overview**  
A full-stack social application with authentication, posts, comments, likes, and user profiles.

**Purpose**  
Provide a complete social workflow — sign in, manage a profile, and interact with posts — through a REST API and a browser client.

**Key Features**

- JWT-based authentication and authorization
- REST APIs for posts, comments, likes, and profiles
- MongoDB data models and CRUD operations
- Login and main application pages on the frontend

**Technologies Used**

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express.js, REST APIs, JWT
- Database: MongoDB

**My Role**  
I implemented the API, authentication, data models, and the frontend screens.

**Live Demo**  
[login.html](https://abdulkarimaklouk.github.io/social-media-frontend/login.html)

**Source Code**

- Frontend: [social-media-frontend](https://github.com/abdulkarimaklouk/social-media-frontend)
- Backend: [social-media-backend](https://github.com/abdulkarimaklouk/social-media-backend)

**Backend Status:** The backend is not currently hosted on a server. The available live demo showcases the frontend interface. Backend-dependent features and data will not function in the live demo.

---

### 3. Product CRUD

**Project Overview**  
A JavaScript product manager with complete Create, Read, Update, and Delete flows.

**Purpose**  
Practice and demonstrate a full CRUD interface for product records, including search and price totals.

**Key Features**

- Create, read, update, and delete product records
- Search by title or category
- Price, taxes, ads, discount, and total fields

**Technologies Used**

- Frontend: HTML, CSS, JavaScript
- Backend: none
- Database: browser storage on the client

**My Role**  
I implemented the full interface and CRUD logic.

**Live Demo**  
[index.html](https://abdulkarimaklouk.github.io/crud-product-frontend/index.html)

**Source Code**  
[crud-product-frontend](https://github.com/abdulkarimaklouk/crud-product-frontend)

**Backend Status:** This project has no backend. The live demo is the complete client-side application.

---

### 4. Aklouk Template

**Project Overview**  
A multi-section HTML and CSS landing template (Articles, Gallery, Features, Team, Services, Pricing, Events, and contact blocks).

**Purpose**  
A reusable front-end layout for a personal or company landing page.

**Key Features**

- Articles, gallery, features, testimonials, and team sections
- Services, skills, how-it-works, events, and pricing plans
- Stats, discount request, and footer contact details

**Technologies Used**

- Frontend: HTML, CSS
- Backend: none
- Database: none

**My Role**  
I built and structured the template pages and styles.

**Live Demo**  
[index.html](https://abdulkarimaklouk.github.io/template-alaklouk/index.html)

**Source Code**  
[template-alaklouk](https://github.com/abdulkarimaklouk/template-alaklouk)

**Backend Status:** This project has no backend. The live demo is the full static page.

---

### 5. Food Template

**Project Overview**  
A single-page restaurant landing page with home, about, offers, menu, daytime schedule, gallery, and contact.

**Purpose**  
Present a restaurant’s story, menu, hours, and contact details in one static page.

**Key Features**

- Hero, about, special offers, and menu with prices
- Daytime schedule and food gallery
- Contact block with address and working hours

**Technologies Used**

- Frontend: HTML5, CSS3, JavaScript
- Backend: none
- Database: none

**My Role**  
I built the page layout, sections, and front-end structure.

**Live Demo**  
[index.html](https://abdulkarimaklouk.github.io/food-lover/index.html)

**Source Code**  
[food-lover](https://github.com/abdulkarimaklouk/food-lover)

**Backend Status:** This project has no backend. The live demo is the full static page.

---

## Portfolio site structure

```text
index.html
README.md
assets/
  css/styles.css
  js/main.js
  js/mixitup.min.js
  img/
  pdf/cv.pdf
  favicons/
```

Theme (dark/light) is stored in `localStorage`. Project cards are filtered with Mixitup. Scroll animations use ScrollReveal from a CDN.
