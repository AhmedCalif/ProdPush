# ProdPush

A modern task management application built with Bun, React, and Hono that helps you organize and track your project tasks with features like filtering, status updates, and date-based organization.

## Project Description

ProdPush is a web application that combines the speed of Bun runtime with React frontend and Hono backend to deliver:
- Cross-project task viewing and management
- Status-based task filtering (Todo, In Progress, Completed)
- Date-based filtering with a weekly calendar view
- Task editing and deletion capabilities
- Due date tracking and assignment management

### Key Features
- Date-based task filtering with a 7-day calendar view
- Status-based filtering system
- Task status management with visual indicators
- Modern, responsive UI using shadcn/ui components
- Task editing and deletion capabilities

### Important Note
Some actions require a page refresh to see updated content

## Setup Instructions

1. **Prerequisites**
   ```bash
   Bun >= 1.0.x
2. Clone the repo
   ```
   git clone https://github.com/AhmedCalif/ProdPush.git
   ```
3. Install Dependencies
   ```
   bun install
   ```

4. Run the server
   ```
   bun run index.ts

   ```

Enviornment Variables Documentation

```
    DATABASE_URL=your_database_url_here
    DATABASE_AUTH_TOKEN=your_database_auth_token_here
    VITE_KINDE_DOMAIN=your_kinde_domain_here
    VITE_KINDE_CLIENT_ID=your_kinde_client_id_here
    VITE_KINDE_CLIENT_SECRET=your_kinde_client_secret_here
    VITE_KINDE_REDIRECT_URI=your kinde_redirect_URI
    VITE_KINDE_LOGOUT_URI=your_kinde_logout_URI
    VITE_API_URL=your_api_url
```
