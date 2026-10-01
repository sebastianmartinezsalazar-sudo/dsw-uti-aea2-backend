# Bicycle Shop API

Backend API for a bicycle shop built with TypeScript, Express, Sequelize, and MySQL. This project implements advanced database relationships including 1:N and N:M associations, dynamic filtering, and transactional operations.

## 🚀 Features

- **Complete CRUD** for Bicycles, Brands, Customers, Orders, and Order Items.
- **Database Relationships**:
  - 1:N (Brand → Bicycles)
  - 1:N (Customer → Orders)
  - N:M (Orders ↔ Bicycles through Order Items)
- **Advanced Queries**: Eager loading (`include`), nested joins, and dynamic filtering.
- **Search & Pagination**: RESTful search endpoint with sorting, pagination, and metadata.
- **Transactions**: Atomic order creation with automatic stock decrement and historical price recording.
- **Data Validation**: Robust input validation and proper HTTP status codes.

## 🔗 Recommended Links

- **[Postman Collection Documentation](https://sebastianmartinezsalazar-4517765.postman.co/workspace/fb94b0b1-be51-4adb-8e4c-2272eb320e08/documentation/58320382-3ecd9c68-82bf-4ae0-8c60-36e268b96d1e)**

## 🛠️ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/sebastianmartinezsalazar-sudo/dsw-uti-aea2-backend.git
   cd dsw-uti-aea2-backend