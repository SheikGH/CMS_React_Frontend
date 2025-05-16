# CMS
Customer Management System has been created by React as Frontend Application

Site Url: http://localhost:3000


✅ React CMS Setup and Run Guide
🔹 1. Clone the Project from GitHub
Open a terminal and run:
git clone https://github.com/SheikGH/CMS_React_Frontend.git
Example:
git clone https://github.com/SheikGH/CMS_React_Frontend.git
🔹 2. Navigate to the Project Folder
cd CMS_React_Frontend
🔹 3. Create and Configure .env File
In the root of the project (inside CMS_React_Frontend /), create a file named .env if it doesn’t already exist.
Add the following line to .env:
REACT_APP_API_URL=https://localhost:7067/api
This will make sure your React app communicates with the correct backend API.
________________________________________
🔹 4. Install Node.js (if not already installed)
Make sure you have Node.js (v14+ or v16+) and npm installed.
To check:
node -v
npm -v
To install: https://nodejs.org/
________________________________________
🔹 5. Install Project Dependencies
npm install
This will install all required packages listed in package.json.
________________________________________
🔹 6. Start the React Development Server
npm start
This will start your React app at:
http://localhost:3000
________________________________________
🔹 7. Make Sure Backend Is Running
Ensure your .NET Core API project is running at:
https://localhost:7067/swagger/index.html
If you're using Visual Studio:
•	Set the API project as Startup Project
•	Press F5 or click Start Debugging
________________________________________
🔹 8. Common Pages and Actions
Page	Path	Description
Register Page	/register	Add new customer (registers user)
Login Page	/login	Login with JWT token, saved in localStorage
Customer List Page	/customers	View, Edit, Delete customer records
Logout	-	Clears token, redirects to Login page
________________________________________
🛠️ Troubleshooting Tips
•	If you get CORS errors, make sure your .NET backend has CORS enabled:
services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyHeader()
                   .AllowAnyMethod();
        });
});

app.UseCors("AllowAll");

API End points:
Login => Get: https://localhost:7067/api/Auth/login
Register => Post: https://localhost:7067/api/Auth/register

Customers:
Get all customers => Get:https://localhost:7067/api/Customers
Get a customer => GetByID:https://localhost:7067/api/Customers/2
Add a customer => PUT:https://localhost:7067/api/Customers/7
Delete a customer => Delete: https://localhost:7067/api/Customers/7

•	If .env changes are not reflected, restart the server after editing the .env file.

