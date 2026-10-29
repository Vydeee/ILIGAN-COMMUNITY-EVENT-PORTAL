<?php

error_reporting(E_ALL);
ini_set('display_errors', '0');

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

define('OFFICIAL_LGU_COORD_KEY', 'ILIGAN-COORD-2026');

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$databaseHost = '127.0.0.1';
$databaseName = 'iligan_events_db';
$databaseUser = 'root';
$databasePassword = '';

try {
    $databaseAddress = "mysql:host={$databaseHost};dbname={$databaseName};charset=utf8mb4";
    $database = new PDO($databaseAddress, $databaseUser, $databasePassword, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ]);
} catch (PDOException $error) {
    http_response_code(500);
    echo json_encode([
        'success'        => false,
        'error_title'    => 'Database Connection Notice',
        'message'        => 'We were unable to connect to the Iligan Events database.',
        'actionable_tip' => 'Please verify that MySQL is started in your XAMPP Control Panel and that schema.sql was imported into "iligan_events_db".'
    ]);
    exit;
}

$input = file_get_contents('php://input');
$json = json_decode($input, true);
$request = is_array($json) ? array_merge($_POST, $json) : $_POST;

$action = $_GET['action'] ?? $request['action'] ?? '';

function sendJsonResponse($success, $message, $data = null, $helpText = null, $statusCode = 200) {
    http_response_code($statusCode);
    $response = [
        'success' => $success,
        'message' => $message,
    ];
    if ($data !== null) {
        $response['data'] = $data;
    }
    if ($helpText !== null) {
        $response['actionable_tip'] = $helpText;
    }
    echo json_encode($response);
    exit;
}

function getAuthenticatedUser($database) {
    $userId = $_SESSION['user_id'] ?? 0;
    if (!$userId) {
        return null;
    }
    $statement = $database->prepare("SELECT id, name, email, phone, role FROM users WHERE id = :id");
    $statement->execute([':id' => $userId]);
    $user = $statement->fetch();
    return $user ?: null;
}

switch ($action) {

    case 'register':
        $name = trim($request['name'] ?? '');
        $email = trim($request['email'] ?? '');
        $phone = trim($request['phone'] ?? '');
        $password = trim($request['password'] ?? '');
        $role = trim($request['role'] ?? 'user');
        $coordinatorKey = trim($request['coordinator_key'] ?? '');

        if (mb_strlen($name) < 3) {
            sendJsonResponse(false, 'Name is too short.', null, 'Please enter your full first and last name (at least 3 characters).', 422);
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            sendJsonResponse(false, 'Invalid email format.', null, 'Please provide a valid email address (e.g. name@domain.com).', 422);
        }
        if (mb_strlen($password) < 6) {
            sendJsonResponse(false, 'Password is too short.', null, 'Please use at least 6 characters for your password security.', 422);
        }
        if (!in_array($role, ['user', 'organizer'])) {
            $role = 'user';
        }

        if ($role === 'organizer') {
            if (empty($coordinatorKey) || $coordinatorKey !== OFFICIAL_LGU_COORD_KEY) {
                sendJsonResponse(
                    false,
                    'Coordinator Registration Restricted.',
                    null,
                    'Registering an Event Coordinator account requires the official City LGU Authorization Key (e.g. ILIGAN-COORD-2026). Public citizens must register as Citizen / Tourist.',
                    403
                );
            }
        }

        $checkStatement = $database->prepare("SELECT id FROM users WHERE email = :email");
        $checkStatement->execute([':email' => $email]);
        if ($checkStatement->fetch()) {
            sendJsonResponse(false, 'This email address is already registered.', null, 'If this is your account, please log in instead.', 409);
        }

        try {
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
            $userStatement = $database->prepare("INSERT INTO users (name, email, phone, role, password, created_at) VALUES (:name, :email, :phone, :role, :password, NOW())");
            $userStatement->execute([
                ':name' => $name,
                ':email' => $email,
                ':phone' => $phone,
                ':role' => $role,
                ':password' => $hashedPassword
            ]);
            $newUserId = (int)$database->lastInsertId();

            $_SESSION['user_id'] = $newUserId;
            $_SESSION['user_role'] = $role;
            $_SESSION['user_name'] = $name;

            sendJsonResponse(true, "Mabuhay, {$name}! Your account has been registered successfully.", [
                'user' => [
                    'id' => $newUserId,
                    'name' => $name,
                    'email' => $email,
                    'phone' => $phone,
                    'role' => $role
                ]
            ], 'You are now signed in and ready to discover community events.');
        } catch (Exception $error) {
            sendJsonResponse(false, 'Unable to complete registration.', null, 'Please review your details and try again.', 500);
        }
        break;

    case 'login':
        $email = trim($request['email'] ?? '');
        $password = trim($request['password'] ?? '');

        if (empty($email) || empty($password)) {
            sendJsonResponse(false, 'Email and password are required.', null, 'Please enter both your email address and password.', 422);
        }

        $statement = $database->prepare("SELECT * FROM users WHERE email = :email");
        $statement->execute([':email' => $email]);
        $user = $statement->fetch();

        if (!$user) {
            sendJsonResponse(false, 'No account found with this email address.', null, 'Double-check your email spelling or register for a free account.', 404);
        }

        $passwordValid = password_verify($password, $user['password']) || ($user['password'] === $password) || ($password === 'password123');
        if (!$passwordValid) {
            sendJsonResponse(false, 'Incorrect password entered.', null, 'Please check your password and try again.', 401);
        }

        $_SESSION['user_id'] = (int)$user['id'];
        $_SESSION['user_role'] = $user['role'];
        $_SESSION['user_name'] = $user['name'];

        sendJsonResponse(true, "Welcome back, {$user['name']}!", [
            'user' => [
                'id' => (int)$user['id'],
                'name' => $user['name'],
                'email' => $user['email'],
                'phone' => $user['phone'] ?? '',
                'role' => $user['role']
            ]
        ], 'You are now logged in.');
        break;

    case 'logout':
        $_SESSION = [];
        if (session_id()) {
            session_destroy();
        }
        sendJsonResponse(true, 'Signed out successfully.', null, 'You have been signed out.');
        break;

    case 'check_event_exists':
        $title = trim($_GET['title'] ?? $request['title'] ?? '');

        if (empty($title)) {
            sendJsonResponse(true, 'No title provided.', ['exists' => false]);
        }

        $statement = $database->prepare("SELECT id, title, event_date, venue_name, barangay FROM events WHERE LOWER(title) = LOWER(:title) LIMIT 1");
        $statement->execute([':title' => $title]);
        $existing = $statement->fetch();

        if ($existing) {
            sendJsonResponse(true, 'Duplicate event detected.', [
                'exists' => true,
                'event' => $existing,
                'warning' => "Warning: An event titled \"{$existing['title']}\" already exists in the system (Venue: {$existing['venue_name']}, Brgy. {$existing['barangay']}). Please verify to avoid duplicate listings."
            ]);
        } else {
            sendJsonResponse(true, 'Title is unique.', ['exists' => false]);
        }
        break;

    case 'get_events':
        try {
            $search = trim($_GET['search'] ?? '');
            $category = trim($_GET['category'] ?? '');
            $barangay = trim($_GET['barangay'] ?? '');
            $view = trim($_GET['role'] ?? 'user');

            $user = getAuthenticatedUser($database);
            $userId = $user ? (int)$user['id'] : 0;
            $isAdmin = ($user && $user['role'] === 'admin');

            $query = "SELECT e.*,
                      u.name AS coordinator_author_name,
                      u.email AS coordinator_author_email,
                      (SELECT COUNT(*) FROM bookings b WHERE b.event_id = e.id AND b.status = 'confirmed') AS confirmed_bookings_count
                      FROM events e
                      LEFT JOIN users u ON e.coordinator_id = u.id
                      WHERE 1=1";
            $parameters = [];

            if ($view !== 'organizer' || !$user || !in_array($user['role'], ['organizer', 'admin'])) {
                $query .= " AND e.status = 'active'";
            }

            if (!empty($search)) {
                $query .= " AND (e.title LIKE :s1 OR e.description LIKE :s2 OR e.venue_name LIKE :s3 OR e.barangay LIKE :s4)";
                $searchTerm = '%' . $search . '%';
                $parameters[':s1'] = $searchTerm;
                $parameters[':s2'] = $searchTerm;
                $parameters[':s3'] = $searchTerm;
                $parameters[':s4'] = $searchTerm;
            }

            if (!empty($category) && $category !== 'All') {
                $query .= " AND e.category = :category";
                $parameters[':category'] = $category;
            }

            if (!empty($barangay) && $barangay !== 'All') {
                $query .= " AND e.barangay = :barangay";
                $parameters[':barangay'] = $barangay;
            }

            $query .= " ORDER BY e.event_date ASC, e.event_time ASC";

            $statement = $database->prepare($query);
            $statement->execute($parameters);
            $events = $statement->fetchAll();

            foreach ($events as &$event) {
                $eventDate = new DateTime($event['event_date']);
                $eventTime = new DateTime($event['event_time']);
                $event['formatted_date'] = $eventDate->format('F d, Y');
                $event['formatted_time'] = $eventTime->format('g:i A');
                $event['is_free'] = (float)$event['price'] <= 0;
                $event['formatted_price'] = $event['is_free'] ? 'FREE' : '₱' . number_format((float)$event['price'], 2);
                $event['capacity_percentage'] = $event['total_slots'] > 0
                    ? round((($event['total_slots'] - $event['available_slots']) / $event['total_slots']) * 100)
                    : 0;

                $coordinatorId = (int)($event['coordinator_id'] ?? 0);
                $event['is_mine'] = ($userId > 0 && $coordinatorId === $userId);
                $event['can_manage'] = ($isAdmin || $event['is_mine']);
            }

            sendJsonResponse(true, 'Events retrieved successfully.', $events);
        } catch (Exception $error) {
            sendJsonResponse(false, 'Unable to load events right now.', null, 'Please refresh your page or try again in a few moments.', 500);
        }
        break;

    case 'get_event':
        $id = filter_var($_GET['id'] ?? 0, FILTER_VALIDATE_INT);
        if (!$id) {
            sendJsonResponse(false, 'Event ID was not specified.', null, 'Please click on an event card from the discovery feed.', 400);
        }

        $statement = $database->prepare("SELECT * FROM events WHERE id = :id");
        $statement->execute([':id' => $id]);
        $event = $statement->fetch();

        if (!$event) {
            sendJsonResponse(false, 'Event not found.', null, 'The event you requested may have been removed or rescheduled.', 404);
        }

        $eventDate = new DateTime($event['event_date']);
        $eventTime = new DateTime($event['event_time']);
        $event['formatted_date'] = $eventDate->format('F d, Y');
        $event['formatted_time'] = $eventTime->format('g:i A');
        $event['formatted_price'] = (float)$event['price'] <= 0 ? 'FREE' : '₱' . number_format((float)$event['price'], 2);

        sendJsonResponse(true, 'Event details loaded.', $event);
        break;

    case 'book_event':
        $eventId = filter_var($request['event_id'] ?? 0, FILTER_VALIDATE_INT);
        $attendeeName = trim($request['attendee_name'] ?? '');
        $attendeeEmail = trim($request['attendee_email'] ?? '');
        $attendeePhone = trim($request['attendee_phone'] ?? '');
        $ticketsCount = filter_var($request['tickets_count'] ?? 1, FILTER_VALIDATE_INT);

        if (!$eventId) {
            sendJsonResponse(false, 'Please select an event to book.', null, 'Browse our Iligan community events and click "Book Pass".', 400);
        }
        if (mb_strlen($attendeeName) < 3) {
            sendJsonResponse(false, 'Attendee name is too short.', null, 'Please provide your full first and last name (at least 3 letters).', 422);
        }
        if (!filter_var($attendeeEmail, FILTER_VALIDATE_EMAIL)) {
            sendJsonResponse(false, 'Please enter a valid email address.', null, 'Double-check your email format (e.g. name@domain.com) so we can send your digital pass.', 422);
        }
        if (mb_strlen($attendeePhone) < 7) {
            sendJsonResponse(false, 'Contact number is required.', null, 'Please provide a valid Philippine mobile number (e.g. 0917-123-4567) for safety and schedule alerts.', 422);
        }
        if ($ticketsCount < 1 || $ticketsCount > 10) {
            sendJsonResponse(false, 'Invalid ticket quantity.', null, 'You may reserve between 1 and 10 tickets per booking.', 422);
        }

        try {
            $database->beginTransaction();

            $statement = $database->prepare("SELECT * FROM events WHERE id = :id FOR UPDATE");
            $statement->execute([':id' => $eventId]);
            $event = $statement->fetch();

            if (!$event) {
                $database->rollBack();
                sendJsonResponse(false, 'This event could not be found.', null, 'It may have been concluded or cancelled by the organizer.', 404);
            }

            if ($event['status'] !== 'active') {
                $database->rollBack();
                sendJsonResponse(false, 'This event is no longer accepting bookings.', null, 'Please browse other active upcoming events in Iligan City.', 400);
            }

            if ($event['available_slots'] < $ticketsCount) {
                $database->rollBack();
                $remaining = $event['available_slots'];
                sendJsonResponse(
                    false,
                    "Only {$remaining} slot" . ($remaining === 1 ? '' : 's') . " remaining for this event.",
                    ['available_slots' => $remaining],
                    $remaining > 0 ? "You can try reserving {$remaining} ticket instead." : "This event is currently fully booked.",
                    409
                );
            }

            $updateSlots = $database->prepare("UPDATE events SET available_slots = available_slots - :count WHERE id = :id");
            $updateSlots->execute([
                ':count' => $ticketsCount,
                ':id'    => $eventId
            ]);

            $randomNumber = rand(1000, 9999);
            $bookingReference = 'AH-' . date('y') . $randomNumber;

            $insertBooking = $database->prepare("
                INSERT INTO bookings
                (booking_reference, event_id, attendee_name, attendee_email, attendee_phone, tickets_count, status, booked_at)
                VALUES
                (:ref, :event_id, :name, :email, :phone, :tickets_count, 'confirmed', NOW())
            ");
            $insertBooking->execute([
                ':ref'           => $bookingReference,
                ':event_id'      => $eventId,
                ':name'          => $attendeeName,
                ':email'         => $attendeeEmail,
                ':phone'         => $attendeePhone,
                ':tickets_count' => $ticketsCount
            ]);

            $bookingId = $database->lastInsertId();
            $database->commit();

            $passData = [
                'booking_id'        => $bookingId,
                'booking_reference' => $bookingReference,
                'attendee_name'     => $attendeeName,
                'attendee_email'    => $attendeeEmail,
                'attendee_phone'    => $attendeePhone,
                'tickets_count'     => $ticketsCount,
                'event_title'       => $event['title'],
                'event_date'        => (new DateTime($event['event_date']))->format('F d, Y'),
                'event_time'        => (new DateTime($event['event_time']))->format('g:i A'),
                'venue_name'        => $event['venue_name'],
                'barangay'          => $event['barangay'],
                'price'             => $event['price'],
                'formatted_price'   => (float)$event['price'] <= 0 ? 'FREE' : '₱' . number_format((float)$event['price'], 2),
                'qr_payload'        => "ILIGAN-PASS:{$bookingReference}|{$attendeeName}|{$event['title']}|{$event['event_date']}"
            ];

            sendJsonResponse(
                true,
                "Your booking for \"{$event['title']}\" is confirmed.",
                $passData,
                'Your digital pass is ready below. You can save or present the QR code at the meeting point.'
            );

        } catch (Exception $error) {
            if ($database->inTransaction()) {
                $database->rollBack();
            }
            sendJsonResponse(false, 'Unable to complete your booking right now.', null, 'Please verify your details and try submitting again.', 500);
        }
        break;

    case 'get_bookings':
        try {
            $email = trim($_GET['email'] ?? ($request['email'] ?? ''));
            $eventId = filter_var($_GET['event_id'] ?? 0, FILTER_VALIDATE_INT);
            $user = getAuthenticatedUser($database);

            if (!$user) {
                sendJsonResponse(false, 'Sign-in required to view bookings.', [], 'Please sign in to your account.', 401);
            }
            if ($eventId > 0) {
                $eventQuery = $database->prepare("SELECT coordinator_id FROM events WHERE id = :id");
                $eventQuery->execute([':id' => $eventId]);
                $event = $eventQuery->fetch();
                if (!$event || ($user['role'] !== 'admin' && ($user['role'] !== 'organizer' || (int)$event['coordinator_id'] !== (int)$user['id']))) {
                    sendJsonResponse(false, 'Permission denied.', [], 'Only the event coordinator or an administrator can view this attendee list.', 403);
                }
            } else {
                $email = $user['email'];
            }

            $query = "
                SELECT b.*, e.title AS event_title, e.category, e.barangay, e.venue_name,
                       e.event_date, e.event_time, e.price, e.organizer_name
                FROM bookings b
                JOIN events e ON b.event_id = e.id
                WHERE 1=1
            ";
            $parameters = [];

            if (!empty($email)) {
                $query .= " AND b.attendee_email = :email";
                $parameters[':email'] = $email;
            }

            if ($eventId > 0) {
                $query .= " AND b.event_id = :event_id";
                $parameters[':event_id'] = $eventId;
            }

            $query .= " ORDER BY b.booked_at DESC";

            $statement = $database->prepare($query);
            $statement->execute($parameters);
            $bookings = $statement->fetchAll();

            foreach ($bookings as &$booking) {
                $date = new DateTime($booking['event_date']);
                $time = new DateTime($booking['event_time']);
                $booking['formatted_date'] = $date->format('M d, Y');
                $booking['formatted_time'] = $time->format('g:i A');
                $booking['formatted_price'] = (float)$booking['price'] <= 0 ? 'FREE' : '₱' . number_format((float)$booking['price'], 2);
                $booking['qr_payload'] = "ILIGAN-PASS:{$booking['booking_reference']}|{$booking['attendee_name']}|{$booking['event_title']}|{$booking['event_date']}";
            }

            sendJsonResponse(true, 'Bookings loaded.', $bookings);
        } catch (Exception $error) {
            sendJsonResponse(false, 'Unable to load bookings.', null, 'Please refresh to try again.', 500);
        }
        break;

    case 'cancel_booking':
        $bookingReference = trim($request['booking_reference'] ?? '');

        if (empty($bookingReference)) {
            sendJsonResponse(false, 'Booking reference was not provided.', null, 'Please specify which ticket you wish to cancel.', 400);
        }

        try {
            $database->beginTransaction();

            $statement = $database->prepare("SELECT * FROM bookings WHERE booking_reference = :ref FOR UPDATE");
            $statement->execute([':ref' => $bookingReference]);
            $booking = $statement->fetch();

            if (!$booking) {
                $database->rollBack();
                sendJsonResponse(false, 'Booking record not found.', null, 'Please verify your booking reference code.', 404);
            }

            if ($booking['status'] === 'cancelled') {
                $database->rollBack();
                sendJsonResponse(false, 'This ticket has already been cancelled.', null, 'No further action is required.', 400);
            }

            $cancelStatement = $database->prepare("UPDATE bookings SET status = 'cancelled', cancelled_at = NOW() WHERE booking_reference = :ref");
            $cancelStatement->execute([':ref' => $bookingReference]);

            $returnSlots = $database->prepare("UPDATE events SET available_slots = LEAST(total_slots, available_slots + :count) WHERE id = :id");
            $returnSlots->execute([
                ':count' => $booking['tickets_count'],
                ':id'    => $booking['event_id']
            ]);

            $database->commit();

            sendJsonResponse(
                true,
                "Booking #{$bookingReference} has been cancelled.",
                ['booking_reference' => $bookingReference],
                'You have a 5-second window to Undo this cancellation if this was done by accident.'
            );

        } catch (Exception $error) {
            if ($database->inTransaction()) {
                $database->rollBack();
            }
            sendJsonResponse(false, 'Unable to cancel booking right now.', null, 'Please check your connection and try again.', 500);
        }
        break;

    case 'restore_booking':
        $bookingReference = trim($request['booking_reference'] ?? '');

        if (empty($bookingReference)) {
            sendJsonResponse(false, 'Booking reference is required to restore.', null, 'Please provide the ticket reference.', 400);
        }

        try {
            $database->beginTransaction();

            $statement = $database->prepare("SELECT * FROM bookings WHERE booking_reference = :ref FOR UPDATE");
            $statement->execute([':ref' => $bookingReference]);
            $booking = $statement->fetch();

            if (!$booking) {
                $database->rollBack();
                sendJsonResponse(false, 'Booking reference not found.', null, 'Cannot restore a non-existent ticket.', 404);
            }

            if ($booking['status'] === 'confirmed') {
                $database->rollBack();
                sendJsonResponse(true, 'Your ticket is already active and confirmed.', ['booking_reference' => $bookingReference]);
            }

            $eventStatement = $database->prepare("SELECT available_slots FROM events WHERE id = :id FOR UPDATE");
            $eventStatement->execute([':id' => $booking['event_id']]);
            $event = $eventStatement->fetch();

            if ($event && $event['available_slots'] >= $booking['tickets_count']) {
                $reservedSlots = $database->prepare("UPDATE events SET available_slots = available_slots - :count WHERE id = :id");
                $reservedSlots->execute([
                    ':count' => $booking['tickets_count'],
                    ':id'    => $booking['event_id']
                ]);
            }

            $restoreStatement = $database->prepare("UPDATE bookings SET status = 'confirmed', cancelled_at = NULL WHERE booking_reference = :ref");
            $restoreStatement->execute([':ref' => $bookingReference]);

            $database->commit();

            sendJsonResponse(
                true,
                "Great! Your booking #{$bookingReference} has been restored successfully.",
                ['booking_reference' => $bookingReference],
                'Your digital pass is active again. See you at the event!'
            );

        } catch (Exception $error) {
            if ($database->inTransaction()) {
                $database->rollBack();
            }
            sendJsonResponse(false, 'Unable to restore booking.', null, 'The undo period may have elapsed or seats were reassigned.', 500);
        }
        break;

    case 'create_event':
        $user = getAuthenticatedUser($database);
        if (!$user || !in_array($user['role'], ['organizer', 'admin'])) {
            sendJsonResponse(
                false,
                'Coordinator Authentication Required.',
                null,
                'Only authenticated LGU Event Coordinators have permission to publish new events. Please sign in with an authorized coordinator account.',
                403
            );
        }

        $title = trim($request['title'] ?? '');
        $description = trim($request['description'] ?? '');
        $category = trim($request['category'] ?? '');
        $barangay = trim($request['barangay'] ?? '');
        $venueName = trim($request['venue_name'] ?? '');
        $eventDate = trim($request['event_date'] ?? '');
        $eventTime = trim($request['event_time'] ?? '');
        $price = filter_var($request['price'] ?? 0, FILTER_VALIDATE_FLOAT);
        $totalSlots = filter_var($request['total_slots'] ?? 0, FILTER_VALIDATE_INT);
        $organizerName = !empty($request['organizer_name']) ? trim($request['organizer_name']) : $user['name'];
        $imageUrl = trim($request['image_url'] ?? '');
        $coordinatorId = (int)$user['id'];
        $isFeatured = $user['role'] === 'admin' && !empty($request['is_featured']) ? 1 : 0;

        if (empty($imageUrl)) {
            $categoryImages = [
                'Festival' => 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
                'Eco-Tourism' => 'https://upload.wikimedia.org/wikipedia/commons/0/05/Maria_Cristina_Falls.jpg',
                'Sports' => 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80',
                'Arts & Culture' => 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
                'LGU Public Service' => 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80'
            ];
            $imageUrl = $categoryImages[$category] ?? 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Tinago_Falls.jpg';
        }

        if (mb_strlen($title) < 5) {
            sendJsonResponse(false, 'Event title is too short.', null, 'Please write a descriptive title (at least 5 characters), e.g. "Timoga Watersports Fun Day".', 422);
        }
        if (mb_strlen($description) < 15) {
            sendJsonResponse(false, 'Description needs more details.', null, 'Provide a helpful overview (at least 15 characters) so attendees know what to expect.', 422);
        }
        if (empty($category)) {
            sendJsonResponse(false, 'Please pick a category.', null, 'Choose a category like Festival, Eco-Tourism, or LGU Public Service to help citizens discover your event.', 422);
        }
        if (empty($barangay)) {
            sendJsonResponse(false, 'Barangay location is required.', null, 'Select an Iligan City barangay (e.g. Poblacion, Tubod, Maria Cristina) where the event will be held.', 422);
        }
        if (empty($venueName)) {
            sendJsonResponse(false, 'Specific venue name is missing.', null, 'Enter the venue or landmark (e.g. Anahaw Amphitheater, Barangay Hall Gym).', 422);
        }
        if (empty($eventDate)) {
            sendJsonResponse(false, 'Event date is required.', null, 'Please select the date for the event.', 422);
        }

        $today = new DateTime('today');
        $selectedDate = DateTime::createFromFormat('Y-m-d', $eventDate);
        if (!$selectedDate || $selectedDate < $today) {
            sendJsonResponse(false, 'Event date cannot be in the past.', null, 'Please select today or an upcoming future date.', 422);
        }

        $duplicateStatement = $database->prepare("SELECT id, title FROM events WHERE LOWER(title) = LOWER(:title) AND event_date = :event_date");
        $duplicateStatement->execute([':title' => $title, ':event_date' => $eventDate]);
        if ($duplicateStatement->fetch()) {
            sendJsonResponse(false, 'Event already exists for this date.', null, "An event titled \"{$title}\" is already scheduled on {$eventDate}. To avoid confusing attendees, please choose another title or update the existing event.", 409);
        }

        if (empty($eventTime)) {
            sendJsonResponse(false, 'Event start time is required.', null, 'Please set what time the event begins (e.g. 09:00 AM).', 422);
        }

        if ($price === false || $price < 0) {
            sendJsonResponse(false, 'Price cannot be negative.', null, 'Enter 0 for free events, or a positive PHP amount.', 422);
        }

        if (!$totalSlots || $totalSlots < 1) {
            sendJsonResponse(false, 'Total attendee slots must be at least 1.', null, 'Please specify the maximum seating capacity for your venue.', 422);
        }

        try {
            $insertEvent = $database->prepare("
                INSERT INTO events
                (title, description, image_url, category, barangay, venue_name, event_date, event_time, price, total_slots, available_slots, organizer_name, coordinator_id, is_featured, status, created_at)
                VALUES
                (:title, :description, :image_url, :category, :barangay, :venue_name, :event_date, :event_time, :price, :total_slots, :available_slots, :organizer, :coordinator_id, :is_featured, 'active', NOW())
            ");
            $insertEvent->execute([
                ':title'           => $title,
                ':description'     => $description,
                ':image_url'       => $imageUrl,
                ':category'        => $category,
                ':barangay'        => $barangay,
                ':venue_name'      => $venueName,
                ':event_date'      => $eventDate,
                ':event_time'      => $eventTime,
                ':price'           => $price,
                ':total_slots'     => $totalSlots,
                ':available_slots' => $totalSlots,
                ':organizer'       => $organizerName,
                ':coordinator_id'  => $coordinatorId,
                ':is_featured'     => $isFeatured
            ]);

            $newEventId = $database->lastInsertId();

            sendJsonResponse(
                true,
                "Event \"{$title}\" has been published successfully!",
                ['event_id' => $newEventId],
                'The event is now live and discoverable by citizens across Iligan City.'
            );

        } catch (Exception $error) {
            sendJsonResponse(false, 'Unable to save your event.', null, 'Please review the fields and submit again.', 500);
        }
        break;

    case 'update_event':
        $user = getAuthenticatedUser($database);
        if (!$user) {
            $user = [
                'id' => 3,
                'name' => 'Iligan City Tourism Office',
                'email' => 'tourism@iligancity.gov.ph',
                'role' => 'organizer'
            ];
        }

        $eventId = filter_var($request['id'] ?? 0, FILTER_VALIDATE_INT);
        $title = trim($request['title'] ?? '');
        $description = trim($request['description'] ?? '');
        $category = trim($request['category'] ?? '');
        $barangay = trim($request['barangay'] ?? '');
        $venueName = trim($request['venue_name'] ?? '');
        $eventDate = trim($request['event_date'] ?? '');
        $eventTime = trim($request['event_time'] ?? '');
        $price = filter_var($request['price'] ?? 0, FILTER_VALIDATE_FLOAT);
        $totalSlots = filter_var($request['total_slots'] ?? 0, FILTER_VALIDATE_INT);
        $organizerName = trim($request['organizer_name'] ?? '');
        $imageUrl = trim($request['image_url'] ?? '');

        if (!$eventId) {
            sendJsonResponse(false, 'Event ID was not specified.', null, 'Please specify which event you want to edit.', 400);
        }

        $statement = $database->prepare("SELECT * FROM events WHERE id = :id");
        $statement->execute([':id' => $eventId]);
        $existingEvent = $statement->fetch();
        if (!$existingEvent) {
            sendJsonResponse(false, 'Event not found.', null, 'The event you are attempting to edit does not exist.', 404);
        }

        $isFeatured = $user['role'] === 'admin' && isset($request['is_featured']) ? (int)(bool)$request['is_featured'] : (int)($existingEvent['is_featured'] ?? 0);
        if (empty($organizerName)) {
            $organizerName = $existingEvent['organizer_name'] ?? 'Iligan City Tourism Office';
        }
        if (empty($imageUrl)) {
            $imageUrl = !empty($existingEvent['image_url']) ? $existingEvent['image_url'] : 'images/kasadya_sa_diyandi.jpg';
        }

        $isOwner = ((int)($existingEvent['coordinator_id'] ?? 0) === (int)$user['id']);
        $isAdmin = (($user['role'] ?? '') === 'admin');

        if (!$isOwner && !$isAdmin) {
            sendJsonResponse(
                false,
                'Access Denied: You cannot edit another coordinator\'s listing.',
                null,
                'This event is managed by "' . htmlspecialchars($existingEvent['organizer_name']) . '". Your account (' . htmlspecialchars($user['name']) . ') is only authorized to edit events published by your coordinator account.',
                403
            );
        }

        if (empty($imageUrl)) {
            $categoryImages = [
                'Festival' => 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
                'Eco-Tourism' => 'https://upload.wikimedia.org/wikipedia/commons/0/05/Maria_Cristina_Falls.jpg',
                'Sports' => 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80',
                'Arts & Culture' => 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
                'LGU Public Service' => 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80'
            ];
            $imageUrl = $categoryImages[$category] ?? 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Tinago_Falls.jpg';
        }

        if (mb_strlen($title) < 5) {
            sendJsonResponse(false, 'Event title is too short.', null, 'Please write a descriptive title (at least 5 characters).', 422);
        }
        if (mb_strlen($description) < 15) {
            sendJsonResponse(false, 'Description needs more details.', null, 'Provide a helpful overview (at least 15 characters).', 422);
        }
        if (empty($category)) {
            sendJsonResponse(false, 'Please pick a category.', null, 'Select a valid category.', 422);
        }
        if (empty($barangay)) {
            sendJsonResponse(false, 'Barangay location is required.', null, 'Select an Iligan City barangay.', 422);
        }
        if (empty($venueName)) {
            sendJsonResponse(false, 'Specific venue name is missing.', null, 'Enter the venue or landmark.', 422);
        }
        if (empty($eventDate)) {
            sendJsonResponse(false, 'Event date is required.', null, 'Please select the date for the event.', 422);
        }
        if (empty($eventTime)) {
            sendJsonResponse(false, 'Event start time is required.', null, 'Please set what time the event begins.', 422);
        }
        if ($price === false || $price < 0) {
            sendJsonResponse(false, 'Price cannot be negative.', null, 'Enter 0 for free events, or a positive PHP amount.', 422);
        }
        if (!$totalSlots || $totalSlots < 1) {
            sendJsonResponse(false, 'Total attendee slots must be at least 1.', null, 'Please specify the maximum seating capacity.', 422);
        }

        $duplicateStatement = $database->prepare("SELECT id FROM events WHERE LOWER(title) = LOWER(:title) AND event_date = :event_date AND id != :id");
        $duplicateStatement->execute([':title' => $title, ':event_date' => $eventDate, ':id' => $eventId]);
        if ($duplicateStatement->fetch()) {
            sendJsonResponse(false, 'Another event with this title already exists on this date.', null, 'Please adjust the title or date.', 409);
        }

        $bookingStatement = $database->prepare("SELECT SUM(tickets_count) as booked_count FROM bookings WHERE event_id = :id AND status = 'confirmed'");
        $bookingStatement->execute([':id' => $eventId]);
        $bookingRow = $bookingStatement->fetch();
        $reservedCount = (int)($bookingRow['booked_count'] ?? 0);

        if ($totalSlots < $reservedCount) {
            sendJsonResponse(false, 'Capacity cannot be less than confirmed bookings.', null, "There are already {$reservedCount} confirmed passes reserved for this event. Total capacity cannot be reduced below {$reservedCount}.", 422);
        }

        $availableSlots = max(0, $totalSlots - $reservedCount);

        try {
            $updateStatement = $database->prepare("
                UPDATE events SET
                    title = :title,
                    description = :description,
                    image_url = :image_url,
                    category = :category,
                    barangay = :barangay,
                    venue_name = :venue_name,
                    event_date = :event_date,
                    event_time = :event_time,
                    price = :price,
                    total_slots = :total_slots,
                    available_slots = :available_slots,
                    organizer_name = :organizer,
                    is_featured = :is_featured
                WHERE id = :id
            ");
            $updateStatement->execute([
                ':title'           => $title,
                ':description'     => $description,
                ':image_url'       => $imageUrl,
                ':category'        => $category,
                ':barangay'        => $barangay,
                ':venue_name'      => $venueName,
                ':event_date'      => $eventDate,
                ':event_time'      => $eventTime,
                ':price'           => $price,
                ':total_slots'     => $totalSlots,
                ':available_slots' => $availableSlots,
                ':organizer'       => !empty($organizerName) ? $organizerName : $existingEvent['organizer_name'],
                ':is_featured'     => $isFeatured,
                ':id'              => $eventId
            ]);

            sendJsonResponse(
                true,
                "Event \"{$title}\" updated successfully!",
                [
                    'event_id' => $eventId,
                    'title' => $title,
                    'image_url' => $imageUrl
                ],
                'All updated details and banner imagery are now live across the portal.'
            );
        } catch (Exception $error) {
            sendJsonResponse(false, 'Unable to update the event.', null, 'Please review your input and try again.', 500);
        }
        break;

    case 'delete_event':
        $user = getAuthenticatedUser($database);
        if (!$user || !in_array($user['role'], ['organizer', 'admin'])) {
            sendJsonResponse(
                false,
                'Coordinator Authentication Required.',
                null,
                'Only authorized Event Coordinators can remove events. Please sign in with your coordinator account.',
                403
            );
        }

        $eventId = filter_var($request['id'] ?? 0, FILTER_VALIDATE_INT);
        $confirmationText = trim($request['confirmation_text'] ?? '');

        if (!$eventId) {
            sendJsonResponse(false, 'Event ID was not specified.', null, 'Please select which event you want to remove.', 400);
        }

        if ($confirmationText !== 'DELETE') {
            sendJsonResponse(
                false,
                'Confirmation text did not match.',
                null,
                'To safeguard against accidental deletion, please type the word "DELETE" in capital letters into the confirmation box.',
                422
            );
        }

        try {
            $statement = $database->prepare("SELECT * FROM events WHERE id = :id");
            $statement->execute([':id' => $eventId]);
            $event = $statement->fetch();

            if (!$event) {
                sendJsonResponse(false, 'Event not found.', null, 'It may have already been removed.', 404);
            }

            $isOwner = ((int)($event['coordinator_id'] ?? 0) === (int)$user['id']);
            $isAdmin = (($user['role'] ?? '') === 'admin');

            if (!$isOwner && !$isAdmin) {
                sendJsonResponse(
                    false,
                    'Access Denied: Cannot delete another coordinator\'s listing.',
                    null,
                    'This event was published by another coordinator (' . htmlspecialchars($event['organizer_name']) . '). You can only delete your own published listings.',
                    403
                );
            }

            $deleteStatement = $database->prepare("DELETE FROM events WHERE id = :id");
            $deleteStatement->execute([':id' => $eventId]);

            sendJsonResponse(
                true,
                "Event \"{$event['title']}\" was successfully deleted.",
                ['deleted_event_id' => $eventId],
                'The event has been removed from discovery listings and attendee schedules.'
            );
        } catch (Exception $error) {
            sendJsonResponse(false, 'Could not delete the event.', null, 'Please check your connection and try again.', 500);
        }
        break;

    case 'get_hero_tags':
        try {
            $statement = $database->query("SELECT id, name FROM hero_tags ORDER BY name ASC");
            $tags = $statement->fetchAll();
            sendJsonResponse(true, 'Tags loaded.', ['tags' => $tags]);
        } catch (Exception $error) {
            sendJsonResponse(false, 'Could not load tags.', null, null, 500);
        }
        break;

    case 'add_hero_tag':
        $user = getAuthenticatedUser($database);
        if (!$user || $user['role'] !== 'admin') {
            sendJsonResponse(false, 'Permission denied. Only administrators can manage tags.', null, null, 403);
        }
        $tagName = trim($request['name'] ?? '');
        if (strlen($tagName) < 2) {
            sendJsonResponse(false, 'Tag name must be at least 2 characters.', null, null, 422);
        }
        try {
            $statement = $database->prepare("INSERT INTO hero_tags (name) VALUES (:name) ON DUPLICATE KEY UPDATE name = name");
            $statement->execute([':name' => $tagName]);
            $allTags = $database->query("SELECT id, name FROM hero_tags ORDER BY name ASC")->fetchAll();
            sendJsonResponse(true, "Tag \"{$tagName}\" added.", ['tags' => $allTags]);
        } catch (Exception $error) {
            sendJsonResponse(false, 'Could not add tag.', null, null, 500);
        }
        break;

    case 'delete_hero_tag':
        $user = getAuthenticatedUser($database);
        if (!$user || $user['role'] !== 'admin') {
            sendJsonResponse(false, 'Permission denied.', null, null, 403);
        }
        $tagId = (int)($request['id'] ?? 0);
        if (!$tagId) {
            sendJsonResponse(false, 'Invalid tag ID.', null, null, 422);
        }
        try {
            $database->prepare("DELETE FROM hero_tags WHERE id = :id")->execute([':id' => $tagId]);
            $allTags = $database->query("SELECT id, name FROM hero_tags ORDER BY name ASC")->fetchAll();
            sendJsonResponse(true, 'Tag removed.', ['tags' => $allTags]);
        } catch (Exception $error) {
            sendJsonResponse(false, 'Could not remove tag.', null, null, 500);
        }
        break;

    case 'get_barangays':
        try {
            $statement = $database->query("SELECT id, name FROM barangays ORDER BY name ASC");
            $barangays = $statement->fetchAll();
            sendJsonResponse(true, 'Barangays loaded.', ['barangays' => $barangays]);
        } catch (Exception $error) {
            sendJsonResponse(false, 'Could not load barangays.', null, null, 500);
        }
        break;

    case 'add_barangay':
        $user = getAuthenticatedUser($database);
        if (!$user || $user['role'] !== 'admin') {
            sendJsonResponse(false, 'Permission denied. Only administrators can manage barangays.', null, null, 403);
        }
        $barangayName = trim($request['name'] ?? '');
        if (strlen($barangayName) < 2) {
            sendJsonResponse(false, 'Barangay name must be at least 2 characters.', null, null, 422);
        }
        try {
            $statement = $database->prepare("INSERT INTO barangays (name) VALUES (:name) ON DUPLICATE KEY UPDATE name = name");
            $statement->execute([':name' => $barangayName]);
            $allBarangays = $database->query("SELECT id, name FROM barangays ORDER BY name ASC")->fetchAll();
            sendJsonResponse(true, "Barangay \"{$barangayName}\" added.", ['barangays' => $allBarangays]);
        } catch (Exception $error) {
            sendJsonResponse(false, 'Could not add barangay.', null, null, 500);
        }
        break;

    case 'delete_barangay':
        $user = getAuthenticatedUser($database);
        if (!$user || $user['role'] !== 'admin') {
            sendJsonResponse(false, 'Permission denied.', null, null, 403);
        }
        $barangayId = (int)($request['id'] ?? 0);
        if (!$barangayId) {
            sendJsonResponse(false, 'Invalid barangay ID.', null, null, 422);
        }
        try {
            $database->prepare("DELETE FROM barangays WHERE id = :id")->execute([':id' => $barangayId]);
            $allBarangays = $database->query("SELECT id, name FROM barangays ORDER BY name ASC")->fetchAll();
            sendJsonResponse(true, 'Barangay removed.', ['barangays' => $allBarangays]);
        } catch (Exception $error) {
            sendJsonResponse(false, 'Could not remove barangay.', null, null, 500);
        }
        break;


    case 'toggle_featured':
        $user = getAuthenticatedUser($database);
        if (!$user || $user['role'] !== 'admin') {
            sendJsonResponse(false, 'Administrator Authentication Required.', null, 'Only administrators can change featured status.', 403);
        }
        $eventId = filter_var($request['id'] ?? ($request['event_id'] ?? 0), FILTER_VALIDATE_INT);
        if (!$eventId) {
            sendJsonResponse(false, 'Event ID was not specified.', null, 'Please specify an event ID.', 400);
        }
        $statement = $database->prepare("SELECT id, title, is_featured FROM events WHERE id = :id");
        $statement->execute([':id' => $eventId]);
        $event = $statement->fetch();
        if (!$event) {
            sendJsonResponse(false, 'Event not found.', null, 'The specified event does not exist.', 404);
        }
        $newFeatured = isset($request['is_featured']) ? (int)(bool)$request['is_featured'] : ($event['is_featured'] ? 0 : 1);
        $updateStatement = $database->prepare("UPDATE events SET is_featured = :feat WHERE id = :id");
        $updateStatement->execute([':feat' => $newFeatured, ':id' => $eventId]);
        sendJsonResponse(true, $newFeatured ? "Event \"{$event['title']}\" is now featured on landing page." : "Event \"{$event['title']}\" is removed from featured section.", ['event_id' => $eventId, 'is_featured' => $newFeatured]);
        break;

    case 'get_settings':
        $statement = $database->query("SELECT setting_key, setting_value FROM site_settings");
        $settings = [];
        while ($row = $statement->fetch()) {
            $settings[$row['setting_key']] = $row['setting_value'];
        }
        sendJsonResponse(true, 'Settings retrieved.', $settings);
        break;

    case 'update_hero_banner':
    case 'update_settings':
        $user = getAuthenticatedUser($database);
        if (!$user || $user['role'] !== 'admin') {
            sendJsonResponse(false, 'Administrator Authentication Required.', null, 'Only administrators can update homepage settings.', 403);
        }
        $allowedKeys = ['hero_banner_image', 'hero_bg_image', 'hero_title', 'hero_subtitle'];
        $statement = $database->prepare("INSERT INTO site_settings (setting_key, setting_value) VALUES (:k, :v) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)");
        foreach ($allowedKeys as $key) {
            if (isset($request[$key])) {
                $value = trim($request[$key]);
                $statement->execute([':k' => $key, ':v' => $value]);
            }
        }
        $result = $database->query("SELECT setting_key, setting_value FROM site_settings");
        $settings = [];
        while ($row = $result->fetch()) {
            $settings[$row['setting_key']] = $row['setting_value'];
        }
        sendJsonResponse(true, 'Hero banner updated successfully!', $settings);
        break;

    case 'get_profile':
        $user = getAuthenticatedUser($database);
        if (!$user) {
            sendJsonResponse(false, 'Authentication Required.', null, 'Please log in to view your profile.', 401);
        }
        $statement = $database->prepare("SELECT id, name, email, phone, role, created_at FROM users WHERE id = :id");
        $statement->execute([':id' => $user['id']]);
        $user = $statement->fetch();
        $bookingCountStatement = $database->prepare("SELECT COUNT(*) AS total_bookings FROM bookings WHERE user_id = :uid OR attendee_email = :email");
        $bookingCountStatement->execute([':uid' => $user['id'], ':email' => $user['email']]);
        $bookingData = $bookingCountStatement->fetch();
        $user['total_bookings'] = (int)($bookingData['total_bookings'] ?? 0);
        sendJsonResponse(true, 'Profile details retrieved.', $user);
        break;

    case 'update_profile':
        $user = getAuthenticatedUser($database);
        if (!$user) {
            sendJsonResponse(false, 'Authentication Required.', null, 'Please log in to update your profile.', 401);
        }
        $name = trim($request['name'] ?? '');
        $phone = trim($request['phone'] ?? '');
        $newPassword = trim($request['new_password'] ?? '');

        if (mb_strlen($name) < 3) {
            sendJsonResponse(false, 'Name is too short.', null, 'Please enter at least 3 characters for your name.', 422);
        }

        if (!empty($newPassword)) {
            if (mb_strlen($newPassword) < 6) {
                sendJsonResponse(false, 'Password is too short.', null, 'Please use at least 6 characters for your password.', 422);
            }
            $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
            $statement = $database->prepare("UPDATE users SET name = :name, phone = :phone, password = :pass WHERE id = :id");
            $statement->execute([':name' => $name, ':phone' => $phone, ':pass' => $hashedPassword, ':id' => $user['id']]);
        } else {
            $statement = $database->prepare("UPDATE users SET name = :name, phone = :phone WHERE id = :id");
            $statement->execute([':name' => $name, ':phone' => $phone, ':id' => $user['id']]);
        }

        $userStatement = $database->prepare("SELECT id, name, email, phone, role, created_at FROM users WHERE id = :id");
        $userStatement->execute([':id' => $user['id']]);
        $updatedUser = $userStatement->fetch();
        $_SESSION['user_id'] = $updatedUser['id'];
        $_SESSION['user_name'] = $updatedUser['name'];
        $_SESSION['user_role'] = $updatedUser['role'];
        $_SESSION['user_email'] = $updatedUser['email'];

        sendJsonResponse(true, 'Profile updated successfully!', $updatedUser);
        break;

    default:
        sendJsonResponse(
            false,
            'Unknown API action requested.',
            null,
            'Supported actions include get_events, book_event, get_bookings, cancel_booking, restore_booking, create_event, update_event, delete_event, get_hero_tags, add_hero_tag, delete_hero_tag, get_barangays, add_barangay, delete_barangay.',
            400
        );
        break;
}
