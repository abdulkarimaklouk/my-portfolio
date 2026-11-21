# Abdulkarim Aklouk — Portfolio

Personal website for **Abdulkarim Aklouk**, a Computer Engineering student and Full-Stack Web Developer based in Cairo, Egypt.

The portfolio showcases my development skills, selected projects, and experience in frontend and backend web development.

The website is built using static HTML, CSS, and JavaScript. Open `index.html` locally, or use VS Code Live Server (port 5501).

**Contact**

- Email: [abdulkarim.aklouk@gmail.com](https://mail.google.com/mail/?view=cm&fs=1&to=abdulkarim.aklouk@gmail.com)
- Phone: 01158250466
- GitHub: [abdulkarimaklouk](https://github.com/abdulkarimaklouk)

---

## Featured Projects

The following projects are showcased in the portfolio. Each project includes its overview, key features, technologies, source code, live demo, and backend deployment status.

---

### 1. Restaurant Meal Management System

**Project Overview**  
A full-stack restaurant management application for managing meals, ingredients, inventory, stock levels, and orders.

**Purpose**  
Provide restaurants with a structured system to manage meal data, inventory, and orders instead of relying on manual tracking.

**Key Features**

- Relational database design using MySQL.
- RESTful APIs for meals, ingredients, inventory, and orders.
- CRUD operations and backend business logic.
- Inventory and stock management.
- Frontend interfaces for stores, meals, ingredients, inventory, orders, and sales.

**Technologies Used**

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express.js, REST APIs
- Database: MySQL

**My Role**  
I designed the relational database, implemented the REST APIs and backend business logic, and developed the frontend pages.

**Live Demo**  
[stores.html](https://abdulkarimaklouk.github.io/restaurant-management-frontend/stores.html)

**Source Code**

- Frontend: [restaurant-management-frontend](https://github.com/abdulkarimaklouk/restaurant-management-frontend)
- Backend: [restaurant-management-backend](https://github.com/abdulkarimaklouk/restaurant-management-backend)

**Backend Status:** The backend is not currently hosted on a server. The available live demo showcases the frontend interface. Backend-dependent data and functionality are not available in the live demo.

---

### 2. Social Media Application

**Project Overview**  
A full-stack social media application featuring authentication, posts, comments, likes, and user profiles.

**Purpose**  
Provide a complete social interaction experience through a REST API and a browser-based frontend.

**Key Features**

- User registration and login.
- JWT-based authentication and authorization.
- RESTful APIs for posts, comments, likes, and profiles.
- MongoDB data models and CRUD operations.
- Frontend interfaces for authentication and application workflows.

**Technologies Used**

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express.js, REST APIs
- Database: MongoDB
- Authentication: JSON Web Tokens (JWT)

**My Role**  
I implemented the backend API, authentication and authorization, database models, and frontend application screens.

**Live Demo**  
[login.html](https://abdulkarimaklouk.github.io/social-media-frontend/login.html)

**Source Code**

- Frontend: [social-media-frontend](https://github.com/abdulkarimaklouk/social-media-frontend)
- Backend: [social-media-backend](https://github.com/abdulkarimaklouk/social-media-backend)

**Backend Status:** The backend is not currently hosted on a server. The available live demo showcases the frontend interface. Backend-dependent features and data will not function in the live demo.

---

### 3. Product CRUD

**Project Overview**  
A JavaScript-based product management application implementing complete Create, Read, Update, and Delete operations.

**Purpose**  
Demonstrate a complete client-side CRUD workflow for managing product records, including search and price calculations.

**Key Features**

- Create, read, update, and delete product records.
- Search by title or category.
- Manage product prices, taxes, advertising costs, discounts, and totals.
- Store product data using browser Local Storage.

**Technologies Used**

- Frontend: HTML, CSS, JavaScript
- Backend: None
- Storage: Browser Local Storage

**My Role**  
I implemented the complete frontend interface, CRUD operations, search functionality, and product price calculations.

**Live Demo**  
[index.html](https://abdulkarimaklouk.github.io/crud-product-frontend/index.html)

**Source Code**  
[crud-product-frontend](https://github.com/abdulkarimaklouk/crud-product-frontend)

**Backend Status:** This project has no backend. The live demo is the complete client-side application.

---

### 4. Aklouk Template

**Project Overview**  
A multi-section HTML and CSS landing page template featuring Articles, Gallery, Features, Team, Services, Pricing, Events, and Contact sections.

**Purpose**  
Provide a reusable frontend layout for personal websites and business landing pages.

**Key Features**

- Articles, gallery, features, and testimonials.
- Team and services sections.
- Skills and how-it-works sections.
- Events and pricing plans.
- Statistics and discount request sections.
- Footer with contact details.

**Technologies Used**

- Frontend: HTML, CSS
- Backend: None
- Database: None

**My Role**  
I designed and structured the template pages and implemented the frontend styles.

**Live Demo**  
[index.html](https://abdulkarimaklouk.github.io/template-alaklouk/index.html)

**Source Code**  
[template-alaklouk](https://github.com/abdulkarimaklouk/template-alaklouk)

**Backend Status:** This project has no backend. The live demo is the complete static page.

---

### 5. Food Template

**Project Overview**  
A single-page restaurant landing page featuring Home, About, Offers, Menu, Daytime Schedule, Gallery, and Contact sections.

**Purpose**  
Present a restaurant's story, menu, special offers, operating hours, and contact information through a single-page website.

**Key Features**

- Hero and restaurant introduction sections.
- Special offers and menu with prices.
- Daytime schedule.
- Food gallery.
- Contact section with address and working hours.

**Technologies Used**

- Frontend: HTML5, CSS3, JavaScript
- Backend: None
- Database: None

**My Role**  
I developed the page layout, structured the content sections, and implemented the frontend design.

**Live Demo**  
[index.html](https://abdulkarimaklouk.github.io/food-lover/index.html)

**Source Code**  
[food-lover](https://github.com/abdulkarimaklouk/food-lover)

**Backend Status:** This project has no backend. The live demo is the complete static page.

---

## Portfolio Site Structure

```text
index.html
sitemap.xml
README.md
assets/
├── css/
│   └── styles.css
├── js/
│   ├── hero-background.js
│   ├── main.js
│   └── mixitup.min.js
├── img/
│   ├── profile.png
│   └── social-preview.png
└── pdf/
    └── cv.pdf
docs/
├── PROJECT_OVERVIEW.md
├── REQUIREMENTS.md
└── design/
    ├── design-system.md
    ├── section-blueprints.md
    └── references/
```

**Features & Implementation**

- **Static Architecture:** Built with semantic HTML5, modern CSS3, and vanilla ES6+ JavaScript (zero-build, 100% GitHub Pages compatible).
- **Typography:** `Plus Jakarta Sans` for clean structural display and `IBM Plex Mono` for technical metadata.
- **3D Fluid Hero:** Lightweight Three.js `0.160.0` WebGL canvas (`hero-waves-canvas`) featuring procedural obsidian-to-emerald wave ribbons, screen-space anti-aliasing, and dynamic theme synchronization.
- **Dark / Light Themes:** Accessible theme switching persisted in `localStorage` with a synchronous pre-paint guard to eliminate FOUC.
- **Accessibility & Motion:** Semantic inline SVGs, WCAG 2.1 Level AA contrast ratios, accessible dialog modals with background `inert` isolation and focus trapping, screen-reader live regions, and `prefers-reduced-motion` support.
- **Scroll Reveals:** Built using native browser `IntersectionObserver` (zero external CDN animation libraries).
- **Project Filtering:** Client-side project filtering with MixItUp and accessible status announcements.
- **CV & Contact:** Downloadable PDF CV and client-side contact workflow with Gmail compose generation and accessible email copy.

**Running Locally**

1. Clone or download the repository.
2. Open the project folder in VS Code.
3. Open `index.html` directly in your browser, or use the Live Server extension.
4. Live Server runs on port `5501`.

---

## About

This portfolio represents my work as a Computer Engineering student and Full-Stack Web Developer, highlighting my experience building web applications, designing databases, developing REST APIs, and implementing frontend interfaces.

I continuously work on improving my software engineering skills and building practical, maintainable applications.
