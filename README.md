## Architecture

-Modular Structure: The application is structured into modules, including MembershipModule, InvoiceModule, and AddOnModule, each encapsulating related functionality. This promotes separation of concerns and maintainability.

-Database Integration: The application uses TypeORM for database integration, which provides a robust ORM for managing database entities and relationships.

## Cron Job for Billing

-Scheduling: The @nestjs/schedule module is used to schedule a cron job that runs daily to check for upcoming membership dues and generate invoices.

-The cron job in BillingService runs daily to check for upcoming membership dues:
For new members, it combines the annual membership fee with the first month's add-on service charges.
For existing members, it checks if the current date falls within the month for which the add-on service applies and sends email reminders accordingly.

-Error Handling: The cron job includes try-catch blocks to handle potential errors gracefully.

## Email Notifications
-Email Service: The EmailService is responsible for sending emails using the Mailtrap provider API. This service is used to send reminders for upcoming dues.


##  Assumptions

1. Data Format

Membership types are either annual or monthly, the membership table includes the adds-on and invoice as an added column for easy fetching of data in the same query, it avoids the need to perform additional database queries.
The isFirstMonth flag indicates whether the membership is in its first month.
Add-on services have a monthlyAmount and a dueDate. 

2. Invoice Table
Invoices data are created and saved into the invoice table when the cron job runs.


3. External Integrations

Database: A PostgreSQL database is used to store membership, add-on, and invoice data.

Email Service: Mailtrap is used as the email service provider for sending email notifications. The Mailtrap API credentials are stored in environment variables.

Environment Variables
The application uses environment variables for sensitive configurations like database connection details and Mailtrap API credentials. These variables are defined in a .env file:


## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support


## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
