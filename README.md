# Iligan Community Event Portal

A vanilla HTML, CSS, and JavaScript event portal with PHP sessions and a MySQL-compatible database. Sign in or create an account before opening any portal page, including Home. Direct page links and data requests also require a valid server session. Signing out returns to the required sign-in screen.

Run Apache and MySQL in XAMPP, then open `http://localhost/hci%20websystem/`.

## Installation

For a new database, import `schema.sql` using phpMyAdmin. It includes the tables, sample Iligan events, barangays, search tags, and demonstration accounts. For an existing database, use the focused update files described in `database/README.md` instead of importing the sample data again.

The default connection is `127.0.0.1`, database `iligan_events_db`, user `root`, and an empty password. Optional server environment variables are `ILIGAN_DB_HOST`, `ILIGAN_DB_NAME`, `ILIGAN_DB_USER`, and `ILIGAN_DB_PASSWORD`.

## Role views

- Citizens: `#/citizen` dashboard and `#/bookings` passes and history.
- Coordinators: `#/dashboard` owned events and attendee management.
- Administrators: `#/admin` citywide events, homepage settings, barangays, tags, and support inquiries.
- Everyone: discovery, about, contact, and `#/guide` help topics.

The test password is `password123`. The existing citizen email remains `amina.alonto@gmail.com` with the display name Mohammad Saumay. Coordinator email: `tourism@iligancity.gov.ph`. Admin email: `admin@iligancity.gov.ph`. Coordinator registration uses the classroom authorization key `ILIGAN-COORD-2026`.

Contact messages are saved to the database and reviewed in the admin Support Inbox. Booking passes contain a real locally generated QR code encoding the booking reference. Paid listings reserve places; the portal does not process online payments or automatically send email.

## Checks

With MySQL running, execute:

```sh
/Applications/XAMPP/xamppfiles/bin/php tests/check-api.php
node --check app.js
/Applications/XAMPP/xamppfiles/bin/php -l api.php
```

The integration suite creates a uniquely named disposable database, runs 39 checks, and removes that database afterward. It does not select the live portal database. The MySQL user running these checks needs permission to create and remove the disposable database.

## Documentation

The `documentation` folder contains the editable Word guide, matching print-ready PDF, component reference, and screenshots. Both group members contributed code and documentation. Review the guide together before presenting and print the complete PDF including the supplied rubric. Font and QR licenses are included with their local assets.
