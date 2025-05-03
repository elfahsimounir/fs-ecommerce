# Free eCommerce Template for Next.js - Empoverse

The **Empoverse** project is a modern, feature-rich eCommerce platform built with **Next.js**. It is designed to provide a seamless shopping experience for users while offering powerful tools for administrators to manage products, orders, banners, categories, and more. This project is a comprehensive solution for launching and managing an online store.

This project is developed in collaboration with **Next-Merce**, leveraging their expertise in building scalable and efficient eCommerce solutions.

---

## 🚀 Features

### User-Facing Features
- **Dynamic Product Listings**: Browse products by categories, brands, hashtags, and price ranges.
- **Product Details**: View detailed product information, including images, reviews, and specifications.
- **Search and Filters**: Advanced filtering and search capabilities for finding products quickly.
- **Wishlist**: Save favorite products for later.
- **Cart and Checkout**: Add products to the cart and proceed to checkout with ease.
- **Responsive Design**: Fully responsive UI for a seamless experience across devices.

### Admin Features
- **Product Management**: Add, update, and delete products with support for images, categories, and hashtags.
- **Order Management**: View and manage customer orders, including shipping details.
- **Banner Management**: Create and update promotional banners linked to products.
- **Category and Brand Management**: Organize products into categories and brands.
- **User Management**: Manage user accounts with roles (admin/user).
- **Analytics Dashboard**: View key metrics like active products, new products, and order counts.

---

## 🛠️ Technologies Used

### Frontend
- **Next.js**: React-based framework for server-side rendering and static site generation.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Lucide Icons**: Icon library for modern and customizable icons.
- **Recharts**: Library for creating interactive charts and graphs.

### Backend
- **Prisma**: ORM for database management and queries.
- **SQLite**: Lightweight database for development and testing.
- **NextAuth.js**: Authentication library for managing user sessions.
- **DeepSeek API**: AI-powered search and recommendation engine.

### State Management
- **Redux Toolkit**: For managing global state across the application.

### Other Tools
- **Formidable**: For handling file uploads.
- **Zod**: Schema validation for form data.
- **Sonner**: Notification system for user feedback.

---

## 📂 Project Structure

- **`/src/app`**: Contains all Next.js pages and API routes.
  - **`/api`**: Backend API endpoints for products, orders, banners, and more.
  - **`/pages`**: Frontend pages for user and admin interfaces.
- **`/src/components`**: Reusable UI components like modals, tables, and carousels.
- **`/prisma`**: Database schema and migrations.
- **`/public`**: Static assets like images and uploaded files.
- **`/redux`**: Redux slices for managing application state.

---

## 🌟 Key Highlights

1. **AI-Powered Search**: Leverages DeepSeek API for voice commands and intelligent product recommendations.
2. **Dynamic Filtering**: Users can filter products by categories, brands, hashtags, and price ranges.
3. **Admin Dashboard**: Simplifies the management of products, orders, and other entities.
4. **Customizable UI**: Built with Tailwind CSS for easy theming and customization.
5. **Scalable Architecture**: Designed to handle future enhancements and integrations.

---

## 📖 How to Use

### Prerequisites
- Node.js (v16 or higher)
- SQLite (or another database for production)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/empoverse.git
   cd empoverse
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Copy `.env.example` to `.env` and configure the required variables.

4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

---

## 📈 Future Enhancements

- **Payment Gateway Integration**: Add support for online payments.
- **Multi-Language Support**: Enable localization for a global audience.
- **Advanced Analytics**: Provide more detailed insights for admins.
- **Mobile App**: Develop a mobile app for iOS and Android.

---

## 🤝 Contributing

We welcome contributions! Please fork the repository and submit a pull request with your changes.

---

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.