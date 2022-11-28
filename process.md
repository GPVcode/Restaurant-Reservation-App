What I did:

First set up server and app js files.

After setting up initial server functions to get server running, I installed Knex and initialized knexfile to communicate with database using postgreSQL in DBeaver. I created a connection file inside of my db folder that will host all database relatied filed. 

Other important folders to have will be errors, reservations, seat and tables.

errors:

reservations:

seat:

tables:

Set up database in postgresql with the following schema:

Create Table Function for two tables
Table name: reservations
    - primary key "reservation_id" that increments
    - string column first name
    - string last name
    - string mobile number
    - string people
    - date reservation date
    - time reservation time
    - table timestamps
Drop Table reservations

Table name: table
    - primary key "table_id" that increments
    - string table name
    - string capacity
    - integer reservation id unsigned
    - foreign key "reservation_id" that references "reservation_id" inside reservations table
    - table timestamps
Drop Table tables

AlterTable function for reservations table
Table name: reservations
    -string called status that defaults To column "booked" -- not nullable and has index function
Drop Column status

Run migrations to get the tables set up in database. Then I ran the seed data provided by the project. Now we have some data inside our database to use for experimentation.

Now I must implement a link to and from my database by building a restful api and using CRUD methods.

Reservations Service:
    functions include list, listByDate, create, read, update, finish, search, and modify. (the difference between updates and modifies is that updates is for updating the status of the reservation, whereas modify if a function for user to modify their existing reservation.)

build API functions to use in client side. 
For example, I will use list reservations and list tables in my dashboard.