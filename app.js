'use strict';

const FALLBACK_EVENTS = [
  {
    id: 1,
    title: 'Diyandi Festival 2026: Kasadya sa Diyandi Street Dancing Competition',
    category: 'Festival',
    month: 'OCTOBER',
    schedule: 'Oct 15, 2026 · 7:30 AM',
    date: '2026-10-15',
    time: '7:30 AM',
    duration: '5 hours',
    location: 'Quezon Avenue to Anahaw Amphitheater, Buhanginan Hills',
    venue: 'Anahaw Amphitheater, Buhanginan Hills',
    address: 'Buhanginan Hills, Pala-o, Iligan City',
    route: 'City Streets Parade Route to Amphitheater',
    price: 0.00,
    spotsLeft: 2500,
    totalSlots: 2500,
    image: 'images/kasadya_sa_diyandi.jpg',
    galleryMain: 'images/diyandi_festival_panoramic_header.png',
    galleryThumb: 'images/kasadya_sa_diyandi.jpg',
    guideName: 'Iligan City Tourism Office',
    guideRole: 'Official Festival Committee',
    description: 'The premier street dancing festival honoring Saint Michael the Archangel, the patron saint of Iligan City. Features vibrant Maranao, Higaonon, and Christian cultural contingents showcasing harmonious unity through traditional and contemporary choreography.',
    inclusion: 'Free grandstand admission, community festival hydration stations, and official souvenir guide map.',
    statusLabel: 'Open Admission',
    statusClass: 'status',
    is_featured: 1
  },
  {
    id: 2,
    title: 'Maria Cristina Falls Eco-Trail & Community Tree Planting Caravan',
    category: 'Eco-Tourism',
    month: 'OCTOBER',
    schedule: 'Oct 18, 2026 · 8:00 AM',
    date: '2026-10-18',
    time: '8:00 AM',
    duration: '4 hours',
    location: 'NPC Nature Park & Watershed Reserve',
    venue: 'NPC Nature Park',
    address: 'Brgy. Maria Cristina, Iligan City',
    route: '3.5 km guided nature walk',
    price: 50.00,
    spotsLeft: 74,
    totalSlots: 100,
    image: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Maria_Cristina_Falls.jpg',
    galleryMain: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Maria_Cristina_Falls.jpg',
    galleryThumb: 'images/anahaw_amphitheater.jpg',
    guideName: 'Iligan Eco-Tourism Society',
    guideRole: 'Certified Environmental Guides',
    description: 'Experience the thunderous beauty of the majestic Maria Cristina Falls, the primary power generator of Mindanao. Join community volunteers in planting native hardwood seedlings along the scenic Agus River watershed.',
    inclusion: 'Guided eco-trail walk, 2 native tree saplings for planting, commemorative eco-steward certificate, light morning snack.',
    statusLabel: '74 spots left',
    statusClass: 'status2',
    is_featured: 0
  },
  {
    id: 3,
    title: 'LGU Tubod Free Community Health Mission & Wellness Clinic',
    category: 'LGU Public Service',
    month: 'OCTOBER',
    schedule: 'Oct 22, 2026 · 8:30 AM',
    date: '2026-10-22',
    time: '8:30 AM',
    duration: '6 hours',
    location: 'Barangay Tubod Multi-Purpose Gymnasium',
    venue: 'Tubod Multi-Purpose Gymnasium',
    address: 'Brgy. Tubod, Iligan City',
    route: 'Community wellness station',
    price: 0.00,
    spotsLeft: 192,
    totalSlots: 250,
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
    galleryMain: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
    galleryThumb: 'images/anahaw_amphitheater.jpg',
    guideName: 'City Health Office (CHO) Iligan',
    guideRole: 'Public Health Officers',
    description: 'Free healthcare outreach organized by the City Health Office for all families. Services include general medical consultations, blood pressure and glucose screenings, pediatric checkups, free essential medicines, and dental health kits.',
    inclusion: 'Free medical consultations, essential vitamins and medicine pack, dental hygiene kit.',
    statusLabel: 'Free admission',
    statusClass: 'status',
    is_featured: 0
  },
  {
    id: 4,
    title: 'Timoga Cold Springs Youth Swimming Cup & Water Polo Exhibition',
    category: 'Sports',
    month: 'OCTOBER',
    schedule: 'Oct 25, 2026 · 9:00 AM',
    date: '2026-10-25',
    time: '9:00 AM',
    duration: '5 hours',
    location: 'Timoga Spring Resort Complex',
    venue: 'Timoga Spring Resort Complex',
    address: 'Brgy. Buru-un, Iligan City',
    route: 'Natural spring swimming pools',
    price: 75.00,
    spotsLeft: 112,
    totalSlots: 150,
    image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80',
    galleryMain: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80',
    galleryThumb: 'images/anahaw_amphitheater.jpg',
    guideName: 'Iligan Aquatic Sports Club',
    guideRole: 'Tournament Directors',
    description: 'Competitive youth swimming tournament and exciting water polo exhibition hosted in the crystal-clear, mineral-rich flowing cold spring waters of Timoga.',
    inclusion: 'Resort pool admission, spectator seating pass, official tournament program.',
    statusLabel: '112 spots left',
    statusClass: 'status',
    is_featured: 0
  },
  {
    id: 5,
    title: 'Pala-o Kulintang Rhythms & Traditional Weaving Workshop',
    category: 'Arts & Culture',
    month: 'NOVEMBER',
    schedule: 'Nov 02, 2026 · 2:00 PM',
    date: '2026-11-02',
    time: '2:00 PM',
    duration: '3 hours',
    location: 'MSU-IIT Cultural Center Amphitheater',
    venue: 'MSU-IIT Cultural Center',
    address: 'Pala-o, Iligan City',
    route: 'Cultural center workshop hall',
    price: 50.00,
    spotsLeft: 38,
    totalSlots: 60,
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    galleryMain: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    galleryThumb: 'images/anahaw_amphitheater.jpg',
    guideName: 'Iligan Arts & Culture Guild',
    guideRole: 'Master Cultural Artisans',
    description: 'A hands-on cultural immersion into the traditional arts of Lanao. Learn the fundamental rhythms of the kulintang, agung, and debakan percussion instruments, followed by live demonstration and weaving tutorial with indigenous master artisans.',
    inclusion: 'Access to traditional instruments, raw weaving materials, artisan guidance handbook.',
    statusLabel: '38 spots left',
    statusClass: 'status2',
    is_featured: 0
  },
  {
    id: 6,
    title: 'Tinago Falls Twilight Photography & Astrostargazing Basecamp',
    category: 'Eco-Tourism',
    month: 'NOVEMBER',
    schedule: 'Nov 08, 2026 · 5:00 PM',
    date: '2026-11-08',
    time: '5:00 PM',
    duration: '5 hours',
    location: 'Ditucalan Eco-Tourism Reception Hall',
    venue: 'Ditucalan Eco-Tourism Reception Hall',
    address: 'Brgy. Ditucalan, Iligan City',
    route: 'Ravine overlook and basecamp',
    price: 180.00,
    spotsLeft: 21,
    totalSlots: 40,
    image: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Tinago_Falls.jpg',
    galleryMain: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Tinago_Falls.jpg',
    galleryThumb: 'images/anahaw_amphitheater.jpg',
    guideName: 'Ditucalan Ecotourism Guides Association',
    guideRole: 'Wilderness Photography Guides',
    description: 'Capture the enchanting ravines of Tinago Falls as twilight descends. Includes nighttime long-exposure photography instruction, safety guides, hot ginger brew (salabat), and stargazing session along the Ditucalan valley clearing.',
    inclusion: 'Eco-park entrance, licensed wilderness guide, hot salabat, night photography tripod zones.',
    statusLabel: '21 spots left',
    statusClass: 'status2',
    is_featured: 0
  },
  {
    id: 7,
    title: 'Paseo de Santiago Sunset Acoustic Jam & Food Bazaar',
    category: 'Eco-Tourism',
    month: 'NOVEMBER',
    schedule: 'Nov 15, 2026 · 5:30 PM',
    date: '2026-11-15',
    time: '5:30 PM',
    duration: '4 hours',
    location: 'Kiwalan Bay Shoreline, Paseo de Santiago',
    venue: 'Paseo de Santiago Seaside Park',
    address: 'Brgy. Santiago, Iligan City',
    route: 'Seaside promenade',
    price: 0.00,
    spotsLeft: 80,
    totalSlots: 80,
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
    galleryMain: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
    galleryThumb: 'images/anahaw_amphitheater.jpg',
    guideName: 'Santiago Tourism Community Association',
    guideRole: 'Promenade Coordinators',
    description: 'Unwind by the breezy coastline of Kiwalan Bay. Enjoy acoustic serenades, local street delicacies, fresh seafood barbecue stalls, and sunset viewing at the famous Paseo de Santiago landmark.',
    inclusion: 'Free park admission, acoustic live stage seating, sunset viewing deck access.',
    statusLabel: 'Free admission',
    statusClass: 'status',
    is_featured: 0
  },
  {
    id: 8,
    title: 'Mimbalot Falls Rock Climbing & Zipline Eco-Challenge',
    category: 'Sports',
    month: 'NOVEMBER',
    schedule: 'Nov 20, 2026 · 8:00 AM',
    date: '2026-11-20',
    time: '8:00 AM',
    duration: '4 hours',
    location: 'Iligan Paradise Resort & Mimbalot Falls',
    venue: 'Mimbalot Falls Adventure Grounds',
    address: 'Brgy. Buru-un, Iligan City',
    route: 'Waterfall eco-challenge course',
    price: 150.00,
    spotsLeft: 52,
    totalSlots: 80,
    image: 'https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?auto=format&fit=crop&w=800&q=80',
    galleryMain: 'https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?auto=format&fit=crop&w=800&q=80',
    galleryThumb: 'images/anahaw_amphitheater.jpg',
    guideName: 'Mindanao Outdoor Adventure Society',
    guideRole: 'Safety Instructors',
    description: 'An adrenaline-filled outdoor adventure at Mimbalot Falls. Certified outdoor instructors guide participants through scenic boulder ascents, ziplining across canopy trees, and nature conservation briefings.',
    inclusion: 'Full safety harness and helmet gear, certified climbing instructor, zipline pass, hydration pack.',
    statusLabel: '52 spots left',
    statusClass: 'status',
    is_featured: 0
  },
  {
    id: 9,
    title: 'Pagkanaug sa Patron Señor San Miguel (Diyandi Opening Rites)',
    category: 'Festival',
    month: 'OCTOBER',
    schedule: 'Oct 10, 2026 · 7:30 AM',
    date: '2026-10-10',
    time: '7:30 AM',
    duration: '3 hours',
    location: 'St. Michael the Archangel Cathedral, Quezon Avenue',
    venue: 'St. Michael Cathedral',
    address: 'Quezon Avenue, Poblacion, Iligan City',
    route: 'Cathedral grounds and ceremonial avenue',
    price: 0.00,
    spotsLeft: 1140,
    totalSlots: 1200,
    image: 'images/pagkanaug_san_miguel.png',
    galleryMain: 'images/pagkanaug_san_miguel.png',
    galleryThumb: 'images/anahaw_amphitheater.jpg',
    guideName: 'St. Michael Cathedral Parish & Iligan Diocese',
    guideRole: 'Parish Liturgical Committee',
    description: 'The historic, sacred ceremonial descent of Iligan City patron saint, Saint Michael the Archangel, from his cathedral altar niche to the official festival carriage. Marks the spiritual opening rites of the Diyandi Festival with solemn prayers and civic blessings.',
    inclusion: 'Free cathedral seating, commemorative devotional prayer card, community blessing pass.',
    statusLabel: 'Free admission',
    statusClass: 'status',
    is_featured: 1
  },
  {
    id: 10,
    title: 'Harana Sessions Live: Sugal! Homecoming Acoustic Night',
    category: 'Arts & Culture',
    month: 'OCTOBER',
    schedule: 'Oct 24, 2026 · 6:30 PM',
    date: '2026-10-24',
    time: '6:30 PM',
    duration: '3 hours',
    location: 'Anahaw Amphitheater, Buhanginan Hills',
    venue: 'Anahaw Amphitheater',
    address: 'Pala-o, Iligan City',
    route: 'Open-air theater',
    price: 150.00,
    spotsLeft: 382,
    totalSlots: 450,
    image: 'images/harana_sessions.jpg',
    galleryMain: 'images/harana_sessions.jpg',
    galleryThumb: 'images/harana_fb.png',
    guideName: 'Seshies Productions & Iligan Music Guild',
    guideRole: 'Concert Producers',
    description: 'Homegrown Iliganon sensation Harana Sessions returns to the city stage! An intimate indie-pop and acoustic live concert featuring their fan favorites Sugal!, Insomnia, and Dilag celebrating homegrown Northern Mindanao talents.',
    inclusion: 'Reserved theater seating, complimentary hot brewed highland coffee or cold calamansi juice.',
    statusLabel: 'Selling fast',
    statusClass: 'status2',
    is_featured: 0
  },
  {
    id: 11,
    title: 'SouthNova St. Live: \'Di Alam Indie Rock Concert & Tour',
    category: 'Arts & Culture',
    month: 'OCTOBER',
    schedule: 'Oct 28, 2026 · 7:00 PM',
    date: '2026-10-28',
    time: '7:00 PM',
    duration: '3.5 hours',
    location: 'Paseo de Santiago Seaside Amphitheater',
    venue: 'Paseo de Santiago Amphitheater',
    address: 'Brgy. Santiago, Iligan City',
    route: 'Seaside concert stage',
    price: 100.00,
    spotsLeft: 289,
    totalSlots: 350,
    image: 'images/southnova_st.jpg',
    galleryMain: 'images/southnova_st.jpg',
    galleryThumb: 'images/southnova_fb.png',
    guideName: 'SouthNova Collective & Viva Iligan',
    guideRole: 'Music Producers',
    description: 'Experience an electrifying evening of original indie rock with Iligan City very own SouthNova St.! Performing their chart-topping streaming single \'Di Alam alongside energetic tracks by guest local supporting acts.',
    inclusion: 'Concert admission pass, commemorative band sticker pack, seaside food court voucher.',
    statusLabel: '289 spots left',
    statusClass: 'status',
    is_featured: 0
  },
  {
    id: 12,
    title: 'Miss Iligan 2026: Grand Coronation Night',
    category: 'Arts & Culture',
    month: 'OCTOBER',
    schedule: 'Oct 17, 2026 · 7:00 PM',
    date: '2026-10-17',
    time: '7:00 PM',
    duration: '4 hours',
    location: 'MSU-IIT Gymnasium, Tibanga, Iligan City',
    venue: 'MSU-IIT Gymnasium',
    address: 'Tibanga, Iligan City',
    route: 'Indoor arena',
    price: 50.00,
    spotsLeft: 710,
    totalSlots: 850,
    image: 'images/miss_iligan_2026.jpg',
    galleryMain: 'images/miss_iligan_2026.jpg',
    galleryThumb: 'images/anahaw_amphitheater.jpg',
    guideName: 'City Government of Iligan & Viva Iligan',
    guideRole: 'Pageant Executive Committee',
    description: 'The grandest beauty pageant in the City of Majestic Waterfalls! Witness the crowning of Miss Iligan 2026 featuring special celebrity guest performances, national beauty queen judges, and glamorous evening gown showcases.',
    inclusion: 'General admission seating pass with official coronation souvenir program and ballot.',
    statusLabel: '710 spots left',
    statusClass: 'status',
    is_featured: 0
  },
  {
    id: 13,
    title: 'Diyandi Festival Opening Salvo: The Itchyworms Live at Anahaw',
    category: 'Festival',
    month: 'OCTOBER',
    schedule: 'Oct 09, 2026 · 4:00 PM',
    date: '2026-10-09',
    time: '4:00 PM',
    duration: '4 hours',
    location: 'Anahaw Amphitheater, Buhanginan Hills',
    venue: 'Anahaw Amphitheater, Buhanginan Hills',
    address: 'Buhanginan Hills, Pala-o, Iligan City',
    route: 'Open-air amphitheater grounds',
    price: 0.00,
    spotsLeft: 1800,
    totalSlots: 1800,
    image: 'images/itchyworms_opening_salvo.jpg',
    galleryMain: 'images/itchyworms_opening_salvo.jpg',
    galleryThumb: 'images/anahaw_amphitheater.jpg',
    guideName: 'City Government of Iligan & Viva Iligan',
    guideRole: 'Cultural Program Organizers',
    description: 'The grand Opening Salvo of the Diyandi Festival under the banner One Culture. One Heritage. One Celebration. Kick off the month-long festivities with an electrifying live concert headlined by legendary OPM rock band The Itchyworms!',
    inclusion: 'Free general admission, standing and seating grandstand access, live festival fireworks display.',
    statusLabel: 'Registration open',
    statusClass: 'status',
    is_featured: 1
  },
  {
    id: 14,
    title: '33rd Silent Drill Competition 2026 (Diyandi Festival)',
    category: 'Festival',
    month: 'OCTOBER',
    schedule: 'Oct 14, 2026 · 7:00 AM',
    date: '2026-10-14',
    time: '7:00 AM',
    duration: '4 hours',
    location: 'City Public Plaza to Anahaw Amphitheater, Poblacion',
    venue: 'City Public Plaza',
    address: 'Poblacion, Iligan City',
    route: 'Grand military parade route',
    price: 0.00,
    spotsLeft: 830,
    totalSlots: 900,
    image: 'images/civic_military_parade.jpg',
    galleryMain: 'images/civic_military_parade.jpg',
    galleryThumb: 'images/anahaw_amphitheater.jpg',
    guideName: 'Iligan City Tourism & Cultural Office',
    guideRole: 'Civic Parade Committee',
    description: 'The annual Diyandi Civic-Military Parade and Silent Drill Competition! Bringing together uniformed services, ROTC & CAT cadet corps, and marching drum ensembles in a grand display of youth discipline and community solidarity.',
    inclusion: 'Free public grandstand viewing pass, parade route map, hydration stations.',
    statusLabel: 'Free admission',
    statusClass: 'status',
    is_featured: 1
  },
  {
    id: 15,
    title: 'Rico Blanco Live in Iligan City: Diyandi Festival Concert',
    category: 'Arts & Culture',
    month: 'OCTOBER',
    schedule: 'Oct 30, 2026 · 6:00 PM',
    date: '2026-10-30',
    time: '6:00 PM',
    duration: '3.5 hours',
    location: 'Anahaw Amphitheater, Buhanginan Hills',
    venue: 'Anahaw Amphitheater, Buhanginan Hills',
    address: 'Buhanginan Hills, Pala-o, Iligan City',
    route: 'Central concert arena',
    price: 0.00,
    spotsLeft: 2280,
    totalSlots: 2500,
    image: 'images/rico_blanco_iligan.jpg',
    galleryMain: 'images/rico_blanco_iligan.jpg',
    galleryThumb: 'images/anahaw_amphitheater.jpg',
    guideName: 'City Government of Iligan & Viva Iligan',
    guideRole: 'Event Coordinators',
    description: 'An unforgettable evening of iconic Philippine alternative rock with Rico Blanco performing classic hits and contemporary anthems under the stars at Buhanginan Hills.',
    inclusion: 'Free admission pass with digital QR verification, first-come first-served seating.',
    statusLabel: 'Passes Available',
    statusClass: 'status',
    is_featured: 1
  },
  {
    id: 16,
    title: 'Diyandi Paramotor Show 2026',
    category: 'Sports',
    month: 'OCTOBER',
    schedule: 'Oct 11, 2026 · 7:00 AM',
    date: '2026-10-11',
    time: '7:00 AM',
    duration: '3 hours',
    location: 'Iligan City Sports Complex Grounds & City Plaza',
    venue: 'Iligan City Sports Complex',
    address: 'Poblacion, Iligan City',
    route: 'Aviation flight corridor',
    price: 0.00,
    spotsLeft: 560,
    totalSlots: 600,
    image: 'images/diyandi_paramotor_show.jpg',
    galleryMain: 'images/diyandi_paramotor_show.jpg',
    galleryThumb: 'images/anahaw_amphitheater.jpg',
    guideName: 'City Government of Iligan & Mindanao Aviation Club',
    guideRole: 'Flight Directors',
    description: 'The exhilarating Diyandi Paramotor Show 2026! Watch skilled motorized paragliders soar across the morning skies above the city grounds and Buhanginan Hills, performing synchronized formation passes.',
    inclusion: 'Spectator grandstand pass, flight schedule booklet, pilot meet-and-greet access.',
    statusLabel: 'Free admission',
    statusClass: 'status',
    is_featured: 0
  },
  {
    id: 17,
    title: 'Diyandi Festival 2026: Tri-People Cultural Gala & Heritage Exhibition',
    category: 'Festival',
    month: 'OCTOBER',
    schedule: 'Oct 19, 2026 · 3:00 PM',
    date: '2026-10-19',
    time: '3:00 PM',
    duration: '4 hours',
    location: 'Anahaw Amphitheater, Buhanginan Hills',
    venue: 'Anahaw Amphitheater',
    address: 'Pala-o, Iligan City',
    route: 'Heritage amphitheater pavilion',
    price: 0.00,
    spotsLeft: 1100,
    totalSlots: 1200,
    image: 'images/diyandi_one_culture_badge.jpg',
    galleryMain: 'images/diyandi_one_culture_badge.jpg',
    galleryThumb: 'images/anahaw_amphitheater.jpg',
    guideName: 'Iligan City Tourism & Cultural Office',
    guideRole: 'Cultural Heritage Curators',
    description: 'Celebrating the harmonious unity of Iligan City Tri-People—the Christian settlers, Higaonon indigenous peoples, and Maranao Muslim communities—featuring live traditional kulintang and agung music, native craft demonstrations, and cultural dance rituals.',
    inclusion: 'Free grandstand admission, traditional woven bookmark souvenir, cultural showcase guidebook.',
    statusLabel: 'Free admission',
    statusClass: 'status',
    is_featured: 1
  },
  {
    id: 18,
    title: 'Hindang Falls & Lush Cave Adventure Guided Trek',
    category: 'Eco-Tourism',
    month: 'OCTOBER',
    schedule: 'Oct 21, 2026 · 7:00 AM',
    date: '2026-10-21',
    time: '7:00 AM',
    duration: '5 hours',
    location: 'Hindang Cave Eco-Sanctuary',
    venue: 'Hindang Eco-Park',
    address: 'Brgy. Hindang, Iligan City',
    route: '4.2 km mountain and cave trail',
    price: 160.00,
    spotsLeft: 45,
    totalSlots: 60,
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80',
    galleryMain: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80',
    galleryThumb: 'images/anahaw_amphitheater.jpg',
    guideName: 'Hindang Eco-Rangers Cooperative',
    guideRole: 'Licensed Cave Guides',
    description: 'Venture into the limestone chambers of Hindang Caves, followed by an invigorating swim beneath the pristine cascades of Hindang Falls nestled inside lush tropical rainforests.',
    inclusion: 'Spelunking headlamp gear, cave conservation entry permit, licensed mountain guide, safety briefing.',
    statusLabel: '45 spots left',
    statusClass: 'status',
    is_featured: 0
  },
  {
    id: 19,
    title: 'Citywide Coastal Clean-up & Mangrove Planting Day',
    category: 'LGU Public Service',
    month: 'OCTOBER',
    schedule: 'Oct 26, 2026 · 6:30 AM',
    date: '2026-10-26',
    time: '6:30 AM',
    duration: '4 hours',
    location: 'Bayug Island & Mandulog River Delta',
    venue: 'Bayug Island Mangrove Reserve',
    address: 'Brgy. Hinaplanon, Iligan City',
    route: 'River delta estuary',
    price: 0.00,
    spotsLeft: 350,
    totalSlots: 400,
    image: 'images/alderhaven/beach_clean.jpg',
    galleryMain: 'images/alderhaven/beach_clean.jpg',
    galleryThumb: 'images/anahaw_amphitheater.jpg',
    guideName: 'City Environment & Natural Resources Office (CENRO)',
    guideRole: 'Environmental Coordinators',
    description: 'Unite with civic volunteers, student organizations, and barangay councils in restoring our shorelines and planting 1,000 propagules of native mangroves along the Mandulog estuary.',
    inclusion: 'Planting gloves, waste collection sacks, native mangrove propagules, volunteer certificate.',
    statusLabel: 'Volunteer passes open',
    statusClass: 'status',
    is_featured: 0
  },
  {
    id: 20,
    title: 'Iligan Bay Dragon Boat Autumn Regatta',
    category: 'Sports',
    month: 'OCTOBER',
    schedule: 'Oct 29, 2026 · 8:00 AM',
    date: '2026-10-29',
    time: '8:00 AM',
    duration: '6 hours',
    location: 'Iligan City Coastal Baywalk & Boulevard',
    venue: 'Iligan Coastal Baywalk',
    address: 'Poblacion Coastal Road, Iligan City',
    route: '500-meter open bay racecourse',
    price: 80.00,
    spotsLeft: 140,
    totalSlots: 200,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    galleryMain: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    galleryThumb: 'images/anahaw_amphitheater.jpg',
    guideName: 'Iligan Paddlers Club & Philippine Dragon Boat Federation',
    guideRole: 'Regatta Race Committee',
    description: 'Feel the thunderous drumbeats as collegiate and master dragon boat crews from across Mindanao battle through the choppy waters of Iligan Bay in this exciting autumn championship.',
    inclusion: 'Bleacher seating pass at Baywalk finish line, event commentary headset, official regatta lanyard.',
    statusLabel: '140 spots left',
    statusClass: 'status',
    is_featured: 0
  },
  {
    id: 21,
    title: 'Iligan Highland Coffee & Cacao Farming Heritage Tour',
    category: 'Guided tours',
    month: 'NOVEMBER',
    schedule: 'Nov 04, 2026 · 8:00 AM',
    date: '2026-11-04',
    time: '8:00 AM',
    duration: '4.5 hours',
    location: 'Highland Agritourism Farm, Rogongon',
    venue: 'Rogongon Highland Farm',
    address: 'Brgy. Rogongon, Iligan City',
    route: 'Mountain plantation pathways',
    price: 140.00,
    spotsLeft: 30,
    totalSlots: 45,
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    galleryMain: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    galleryThumb: 'images/anahaw_amphitheater.jpg',
    guideName: 'Iligan Highland Farmers Guild',
    guideRole: 'Master Roasters & Agronomists',
    description: 'Journey to the breezy highland slopes of Rogongon. Walk through sustainable coffee and criollo cacao groves, learn artisanal bean roasting, and taste freshly brewed highland Robusta and pure tablea.',
    inclusion: 'Farm van transport from city center, guided plantation walk, coffee cupping tasting flight, sample coffee beans.',
    statusLabel: '30 spots left',
    statusClass: 'status2',
    is_featured: 0
  },
  {
    id: 22,
    title: 'Senior San Miguel Fluvial Procession & Marine Flotilla',
    category: 'Festival',
    month: 'OCTOBER',
    schedule: 'Oct 27, 2026 · 6:00 AM',
    date: '2026-10-27',
    time: '6:00 AM',
    duration: '3.5 hours',
    location: 'Iligan City Pier to Kiwalan Bay Shoreline',
    venue: 'Iligan City Pier',
    address: 'Port Area, Iligan City',
    route: 'Coastal sea procession route',
    price: 0.00,
    spotsLeft: 600,
    totalSlots: 600,
    image: 'images/alderhaven/boats_harbour.jpg',
    galleryMain: 'images/alderhaven/boats_harbour.jpg',
    galleryThumb: 'images/anahaw_amphitheater.jpg',
    guideName: 'Iligan Fisherfolk Federation & Coast Guard Auxiliary',
    guideRole: 'Marine Flotilla Marshal',
    description: 'A colorful spiritual maritime pageant where dozens of decorated bancas and fishing boats escort the image of Saint Michael the Archangel along the picturesque coastal waters of Iligan Bay.',
    inclusion: 'Free pier viewing pass, safety life vest for boarding participants, blessed festival ribbon.',
    statusLabel: 'Free admission',
    statusClass: 'status',
    is_featured: 1
  },
  {
    id: 23,
    title: 'Ditucalan River Tubing & Hydroelectric Heritage Trek',
    category: 'Eco-Tourism',
    month: 'NOVEMBER',
    schedule: 'Nov 11, 2026 · 9:00 AM',
    date: '2026-11-11',
    time: '9:00 AM',
    duration: '4 hours',
    location: 'Ditucalan River Rapids & Old Plant Kiosk',
    venue: 'Ditucalan Outdoor Park',
    address: 'Brgy. Ditucalan, Iligan City',
    route: '3 km natural river course',
    price: 190.00,
    spotsLeft: 28,
    totalSlots: 50,
    image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=800&q=80',
    galleryMain: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=800&q=80',
    galleryThumb: 'images/anahaw_amphitheater.jpg',
    guideName: 'Ditucalan River Guides Cooperative',
    guideRole: 'Whitewater Safety Instructors',
    description: 'Experience exhilarating natural whitewater tubing down the clean, spring-fed Ditucalan river rapids, complemented by a short walk through the historic heritage channels of Northern Mindanao earliest hydroelectric installations.',
    inclusion: 'Heavy-duty river tube, safety helmet and PFD life jacket, certified river guide, light snack.',
    statusLabel: '28 spots left',
    statusClass: 'status2',
    is_featured: 0
  },
  {
    id: 24,
    title: 'Youth Digital Literacy & Cybersecurity Workshop',
    category: 'LGU Public Service',
    month: 'NOVEMBER',
    schedule: 'Nov 14, 2026 · 9:30 AM',
    date: '2026-11-14',
    time: '9:30 AM',
    duration: '4 hours',
    location: 'Iligan City Public Library & Tech4ED Hub',
    venue: 'City Public Library Tech Hub',
    address: 'Buhanginan Hills, Pala-o, Iligan City',
    route: 'Computer laboratory classroom',
    price: 0.00,
    spotsLeft: 75,
    totalSlots: 80,
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
    galleryMain: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
    galleryThumb: 'images/anahaw_amphitheater.jpg',
    guideName: 'DICT Region X & City Information Office',
    guideRole: 'Technology Educators',
    description: 'Hands-on practical training for senior high and college students on digital safety, safe social media habits, scam detection, and foundational digital career skills hosted at the city modernized tech laboratory.',
    inclusion: 'Full workstation access, digital workshop handbook, official DICT certificate of participation.',
    statusLabel: 'Free admission',
    statusClass: 'status',
    is_featured: 0
  },
  {
    id: 25,
    title: 'Dodiongan Falls Archery & Wilderness Survival Camp',
    category: 'Sports',
    month: 'NOVEMBER',
    schedule: 'Nov 18, 2026 · 8:30 AM',
    date: '2026-11-18',
    time: '8:30 AM',
    duration: '5 hours',
    location: 'Dodiongan Falls Nature Clearing',
    venue: 'Dodiongan Falls Basecamp',
    address: 'Brgy. Bonbonon, Iligan City',
    route: 'Forest trail and archery range',
    price: 110.00,
    spotsLeft: 34,
    totalSlots: 50,
    image: 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&w=800&q=80',
    galleryMain: 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&w=800&q=80',
    galleryThumb: 'images/anahaw_amphitheater.jpg',
    guideName: 'Iligan Bowhunters & Outdoor Guild',
    guideRole: 'Certified Archery Instructors',
    description: 'Learn the focused discipline of traditional recurve archery against the backdrop of the unique 20-meter twin-fluted limestone wall of Dodiongan Falls. Includes wilderness shelter building and water purification demos.',
    inclusion: 'Target bow and arrow equipment rental, safety briefing, survival guide manual, basecamp pass.',
    statusLabel: '34 spots left',
    statusClass: 'status',
    is_featured: 0
  },
  {
    id: 26,
    title: 'Pala-o Artisan Pottery & Ceramic Crafting Intensive',
    category: 'Arts & Culture',
    month: 'NOVEMBER',
    schedule: 'Nov 21, 2026 · 1:30 PM',
    date: '2026-11-21',
    time: '1:30 PM',
    duration: '3 hours',
    location: 'Iligan Ceramic & Craft Center, Pala-o',
    venue: 'Ceramic & Craft Center',
    address: 'Brgy. Pala-o, Iligan City',
    route: 'Artisan studio workshop',
    price: 85.00,
    spotsLeft: 22,
    totalSlots: 35,
    image: 'images/alderhaven/pottery_studio.jpg',
    galleryMain: 'images/alderhaven/pottery_studio.jpg',
    galleryThumb: 'images/anahaw_amphitheater.jpg',
    guideName: 'Mindanao Craft & Guild Collective',
    guideRole: 'Master Ceramic Artists',
    description: 'Discover the tactile art of pottery wheel throwing and hand-sculpting with locally sourced clay. Create your own functional mug or decorative planter under the patient tutelage of resident ceramicists.',
    inclusion: '2 kg sculpting clay, pottery wheel access, firing and glazing of 1 completed piece, apron.',
    statusLabel: '22 spots left',
    statusClass: 'status2',
    is_featured: 0
  },
  {
    id: 27,
    title: 'Iligan Heritage Trail: Historic Plazas & Ancestral Landmarks',
    category: 'Guided tours',
    month: 'NOVEMBER',
    schedule: 'Nov 24, 2026 · 8:30 AM',
    date: '2026-11-24',
    time: '8:30 AM',
    duration: '3 hours',
    location: 'Public Plaza Heritage Kiosk',
    venue: 'City Public Plaza',
    address: 'Poblacion, Iligan City',
    route: '2.5 km historical walking circuit',
    price: 60.00,
    spotsLeft: 26,
    totalSlots: 40,
    image: 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=800&q=80',
    galleryMain: 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=800&q=80',
    galleryThumb: 'images/anahaw_amphitheater.jpg',
    guideName: 'Iligan Historical Society',
    guideRole: 'City Heritage Historians',
    description: 'Step back through time on a walking tour connecting the historic City Public Plaza, century-old residences, ancestral monuments, and the storied St. Michael Cathedral, uncovering hidden tales of local resilience.',
    inclusion: 'Historical society route monograph, wireless audio tour receiver, traditional iced refreshment.',
    statusLabel: '26 spots left',
    statusClass: 'status',
    is_featured: 0
  },
  {
    id: 28,
    title: 'Mt. Agad-Agad Sunrise Peak Hike & Trail Run',
    category: 'Sports',
    month: 'NOVEMBER',
    schedule: 'Nov 27, 2026 · 5:00 AM',
    date: '2026-11-27',
    time: '5:00 AM',
    duration: '4 hours',
    location: 'Pugaan Trailhead to Mt. Agad-Agad Summit',
    venue: 'Mt. Agad-Agad Peak',
    address: 'Brgy. Pugaan, Iligan City',
    route: '3.8 km summit trail (490m elevation)',
    price: 50.00,
    spotsLeft: 60,
    totalSlots: 90,
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    galleryMain: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    galleryThumb: 'images/anahaw_amphitheater.jpg',
    guideName: 'Agad-Agad Mountaineering Guild',
    guideRole: 'Trail Masters',
    description: 'Ascend the prominent green peak overlooking Iligan City and Iligan Bay. Greet the golden sunrise from the summit deck, take panoramic photos, and enjoy native puto maya and hot sikwate.',
    inclusion: 'Trail permit, community guide fee, hot sikwate and puto maya breakfast at the summit resthouse.',
    statusLabel: '60 spots left',
    statusClass: 'status',
    is_featured: 0
  },
  {
    id: 29,
    title: 'Lanao Folk Choral Festival & Sacred Music Night',
    category: 'Arts & Culture',
    month: 'NOVEMBER',
    schedule: 'Nov 29, 2026 · 6:00 PM',
    date: '2026-11-29',
    time: '6:00 PM',
    duration: '3 hours',
    location: 'St. Michael Cathedral Sanctuary',
    venue: 'St. Michael Cathedral',
    address: 'Quezon Avenue, Iligan City',
    route: 'Cathedral sanctuary nave',
    price: 0.00,
    spotsLeft: 420,
    totalSlots: 450,
    image: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=800&q=80',
    galleryMain: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=800&q=80',
    galleryThumb: 'images/anahaw_amphitheater.jpg',
    guideName: 'Iligan Choral Arts Federation',
    guideRole: 'Choir Directors',
    description: 'An uplifting acoustic evening of choral harmonies featuring university and parish choirs performing traditional Mindanao folk melodies, Maranao chants, and classical sacred hymns in the reverberant cathedral acoustic nave.',
    inclusion: 'Free entry pass, program booklet with song translations, front-section guest seating.',
    statusLabel: 'Free admission',
    statusClass: 'status',
    is_featured: 0
  },
  {
    id: 30,
    title: 'Barangay Buru-un Organic Farmers Market & Seed Exchange',
    category: 'LGU Public Service',
    month: 'DECEMBER',
    schedule: 'Dec 02, 2026 · 7:30 AM',
    date: '2026-12-02',
    time: '7:30 AM',
    duration: '5 hours',
    location: 'Buru-un Barangay Covered Plaza',
    venue: 'Buru-un Covered Plaza',
    address: 'Brgy. Buru-un, Iligan City',
    route: 'Open plaza marketplace',
    price: 0.00,
    spotsLeft: 200,
    totalSlots: 200,
    image: 'images/alderhaven/market_square.jpg',
    galleryMain: 'images/alderhaven/market_square.jpg',
    galleryThumb: 'images/anahaw_amphitheater.jpg',
    guideName: 'City Agriculture Office (CAO) Iligan',
    guideRole: 'Agricultural Extension Officers',
    description: 'Support local farming families offering farm-fresh organic produce, highland root crops, fresh honey, and heirloom seeds. Features free composting tutorials and home garden starter seedling giveaways.',
    inclusion: 'Free market access, 2 packets of heirloom vegetable seeds, organic gardening starter pamphlet.',
    statusLabel: 'Free admission',
    statusClass: 'status',
    is_featured: 0
  },
  {
    id: 31,
    title: 'Pampam Falls Canyoneering & Forest Ecology Exploration',
    category: 'Eco-Tourism',
    month: 'DECEMBER',
    schedule: 'Dec 06, 2026 · 8:00 AM',
    date: '2026-12-06',
    time: '8:00 AM',
    duration: '4.5 hours',
    location: 'Dalipuga Watershed Park',
    venue: 'Pampam Falls Eco-Grounds',
    address: 'Brgy. Dalipuga, Iligan City',
    route: 'Canyon stream trek',
    price: 175.00,
    spotsLeft: 18,
    totalSlots: 30,
    image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=800&q=80',
    galleryMain: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=800&q=80',
    galleryThumb: 'images/anahaw_amphitheater.jpg',
    guideName: 'Dalipuga Eco-Explorers Cooperative',
    guideRole: 'Canyoneering Guides',
    description: 'Trek through serene lush river gorges and shallow canyon streams leading to the secluded turquoise pool of Pampam Falls. Includes flora identification and freshwater ecosystem preservation talk.',
    inclusion: 'River canyon safety helmet, eco-tourism admission permit, certified local trail guides, energy bar pack.',
    statusLabel: '18 spots left',
    statusClass: 'status2',
    is_featured: 0
  },
  {
    id: 32,
    title: 'Iligan Year-End Youth Athletics & Track Invitational',
    category: 'Sports',
    month: 'DECEMBER',
    schedule: 'Dec 10, 2026 · 8:00 AM',
    date: '2026-12-10',
    time: '8:00 AM',
    duration: '6 hours',
    location: 'Iligan City Sports Complex Stadium',
    venue: 'City Sports Complex Stadium',
    address: 'Poblacion, Iligan City',
    route: 'Olympic 400m synthetic track',
    price: 40.00,
    spotsLeft: 310,
    totalSlots: 400,
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80',
    galleryMain: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80',
    galleryThumb: 'images/anahaw_amphitheater.jpg',
    guideName: 'Iligan Track & Field Federation',
    guideRole: 'Athletic Meet Officials',
    description: 'Witness the future stars of Mindanao athletics sprint, hurdle, and relay at the city track stadium. High-energy youth competition fostering sportsmanship, fitness, and community camaraderie.',
    inclusion: 'Grandstand spectator seat, meet schedule schedule, cheer flag, mineral water voucher.',
    statusLabel: '310 spots left',
    statusClass: 'status',
    is_featured: 0
  }
];

const FALLBACK_BOOKINGS = [
  {
    id: 1,
    booking_reference: 'ILG-2026-8F42',
    event_id: 1,
    event_title: 'Diyandi Festival 2026: Kasadya sa Diyandi Street Dancing Competition',
    category: 'Festival',
    event_date: '2026-10-15',
    event_time: '7:30 AM',
    venue_name: 'Quezon Avenue to Anahaw Amphitheater, Buhanginan Hills',
    attendee_name: 'Juan dela Cruz',
    attendee_email: 'juan.delacruz@yahoo.com',
    attendee_phone: '09189876543',
    tickets_count: 2,
    formatted_price: 'FREE',
    status: 'confirmed'
  },
  {
    id: 2,
    booking_reference: 'ILG-2026-3C91',
    event_id: 13,
    event_title: 'Diyandi Festival Opening Salvo: The Itchyworms Live at Anahaw',
    category: 'Festival',
    event_date: '2026-10-09',
    event_time: '4:00 PM',
    venue_name: 'Anahaw Amphitheater, Buhanginan Hills',
    attendee_name: 'Juan dela Cruz',
    attendee_email: 'juan.delacruz@yahoo.com',
    attendee_phone: '09189876543',
    tickets_count: 3,
    formatted_price: 'FREE',
    status: 'confirmed'
  }
];

class IliganEventsApp {
  constructor() {
    this.events = [...FALLBACK_EVENTS];
    this.bookings = this.loadLocalBookings();
    this.currentUser = this.loadStoredUser();
    this.selectedEvent = this.events[0];
    this.tickets = { adult: 1, child: 0 };
    this.activeCategory = 'All';
    this.searchQuery = '';
    this.dateFilter = '';
    this.sortMode = 'soonest';
    this.currentPage = 1;
    this.pageSize = 8;
    this.dashboardStatusFilter = 'all';
    this.dashboardSearch = '';
    this.dashboardEventFilter = '';
    this.latestBooking = this.bookings[0] || null;
    this.pendingDeleteEvent = null;
    this.pendingCancelBooking = null;
    this.heroCarouselIndex = 0;
    this.heroCarouselTimer = null;
    this.theme = 'light';
    try {
      this.theme = localStorage.getItem('iligan_theme') || 'light';
    } catch (e) {}

    this.init();
  }

  loadStoredUser() {
    try {
      const u = localStorage.getItem('iligan_current_user') || sessionStorage.getItem('iligan_current_user');
      if (u) return JSON.parse(u);
    } catch (e) {}
    return null;
  }

  saveStoredUser(user) {
    this.currentUser = user;
    try {
      if (user) {
        localStorage.setItem('iligan_current_user', JSON.stringify(user));
        sessionStorage.setItem('iligan_current_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('iligan_current_user');
        sessionStorage.removeItem('iligan_current_user');
      }
    } catch (e) {}
  }

  loadLocalBookings() {
    try {
      const s = localStorage.getItem('iligan_bookings');
      if (s) {
        const parsed = JSON.parse(s);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [...FALLBACK_BOOKINGS];
  }

  saveLocalBookings() {
    try {
      localStorage.setItem('iligan_bookings', JSON.stringify(this.bookings));
    } catch (e) {}
  }

  async init() {
    this.applyTheme(this.theme);
    this.updateNavAuthState();
    this.initHeroCarousel();
    this.renderEventsGrid();
    this.renderDashboard();
    await this.syncWithBackend();
    if (this.currentUser) {
      await this.syncBookingsWithBackend();
    }

    const hash = window.location.hash;
    if (hash === '#login') {
      this.openLoginModal('login');
    } else if (hash === '#register') {
      this.openLoginModal('register');
    } else if (hash === '#dashboard') {
      this.switchView('dashboard');
    } else if (hash === '#dash-events') {
      this.switchView('dashboard');
      this.setDashboardTab('events');
    } else if (hash === '#dark') {
      this.applyTheme('dark');
    } else if (hash === '#bookings') {
      this.handleMyBookingsClick();
    } else if (hash === '#details') {
      this.openEventDetails(1);
    } else if (hash === '#checkout') {
      this.openCheckoutForEvent(1);
    } else if (hash === '#destructive') {
      this.promptDeleteEvent(1, 'Diyandi Festival Opening & Street Parade');
    } else if (hash === '#allevents') {
      this.showAllEventsNav();
    } else if (hash === '#whatson') {
      this.showWhatsOnNav();
    } else if (hash === '#demo-coord') {
      this.demoLogin('coordinator');
    } else if (hash === '#confirmed') {
      const evt = this.events[0] || FALLBACK_EVENTS[0];
      const bookingRef = 'ILG-2026-7842';
      const firstName = 'Juan';
      const lastName = 'dela Cruz';
      const cMsg = document.getElementById('cnf-email-msg');
      if (cMsg) cMsg.textContent = 'We have sent your digital passes and verification details to juan.delacruz@yahoo.com.';
      const cImg = document.getElementById('cnf-event-img');
      if (cImg) cImg.src = evt.image;
      const cTitle = document.getElementById('cnf-event-title');
      if (cTitle) cTitle.textContent = evt.title;
      const cDate = document.getElementById('cnf-event-date');
      if (cDate) cDate.textContent = evt.date;
      const cTime = document.getElementById('cnf-event-time');
      if (cTime) cTime.textContent = (evt.time || '7:30 AM') + ' · Gates open 30 mins early';
      const cVenue = document.getElementById('cnf-event-venue');
      if (cVenue) cVenue.textContent = evt.venue;
      const cRef = document.getElementById('cnf-reference');
      if (cRef) cRef.textContent = bookingRef;
      const cPaid = document.getElementById('cnf-total-paid');
      if (cPaid) cPaid.textContent = 'FREE';
      const qrContainer = document.getElementById('cnf-qr-code-box');
      if (qrContainer) {
        qrContainer.innerHTML = '';
        if (typeof QRCode !== 'undefined') {
          new QRCode(qrContainer, {
            text: 'ILIGAN-PASS:' + bookingRef + '|' + firstName + ' ' + lastName,
            width: 140,
            height: 140,
            colorDark: '#1E3A8A',
            colorLight: '#FFFFFF',
            correctLevel: QRCode.CorrectLevel.H
          });
        }
      }
      this.switchView('confirmed');
    } else if (hash === '#addevent-warn') {
      this.openAddEventModal();
      const titleInput = document.getElementById('add-evt-title');
      if (titleInput) {
        titleInput.value = this.events[0]?.title || 'Diyandi Festival Opening & Street Parade';
        this.checkDuplicateEventTitle(titleInput.value);
      }
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.ald-modal-overlay.open');
        modals.forEach(m => m.classList.remove('open'));
      }
    });
  }

  initHeroCarousel() {
    const slides = document.querySelectorAll('.hero-carousel-slide');
    if (!slides || slides.length === 0) return;

    const dotsContainer = document.getElementById('hero-carousel-dots');
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      slides.forEach((_, idx) => {
        const dot = document.createElement('div');
        dot.className = `hero-carousel-dot${idx === 0 ? ' active' : ''}`;
        dot.onclick = () => this.goToHeroSlide(idx);
        dotsContainer.appendChild(dot);
      });
    }

    if (this.heroCarouselTimer) {
      clearInterval(this.heroCarouselTimer);
    }

    this.heroCarouselTimer = setInterval(() => {
      this.nextHeroSlide();
    }, 2000);
  }

  goToHeroSlide(idx) {
    const slides = document.querySelectorAll('.hero-carousel-slide');
    if (!slides || slides.length === 0) return;

    slides.forEach(s => s.classList.remove('active'));
    const dots = document.querySelectorAll('.hero-carousel-dot');
    dots.forEach(d => d.classList.remove('active'));

    this.heroCarouselIndex = (idx + slides.length) % slides.length;
    const currentSlide = slides[this.heroCarouselIndex];
    if (currentSlide) {
      currentSlide.classList.add('active');
      const locText = currentSlide.getAttribute('data-location');
      const locEl = document.getElementById('hero-carousel-location-text');
      if (locEl && locText) {
        locEl.textContent = locText;
      }
    }

    if (dots[this.heroCarouselIndex]) {
      dots[this.heroCarouselIndex].classList.add('active');
    }
  }

  nextHeroSlide() {
    const slides = document.querySelectorAll('.hero-carousel-slide');
    if (!slides || slides.length === 0) return;
    this.goToHeroSlide(this.heroCarouselIndex + 1);
  }

  prevHeroSlide() {
    const slides = document.querySelectorAll('.hero-carousel-slide');
    if (!slides || slides.length === 0) return;
    this.goToHeroSlide(this.heroCarouselIndex - 1);
  }

  async syncWithBackend() {
    try {
      const res = await fetch('api.php?action=get_events');
      const json = await res.json();
      if (json && json.success && Array.isArray(json.data) && json.data.length > 0) {
        const mapped = json.data.map(dbEvt => ({
          id: Number(dbEvt.id),
          title: dbEvt.title,
          category: dbEvt.category || 'Festival',
          month: this.formatMonth(dbEvt.event_date),
          schedule: `${dbEvt.formatted_date || dbEvt.event_date} · ${dbEvt.formatted_time || dbEvt.event_time}`,
          date: dbEvt.event_date,
          time: dbEvt.formatted_time || dbEvt.event_time || '8:00 AM',
          duration: '3 hours',
          location: `${dbEvt.venue_name || 'Iligan City'}, Brgy. ${dbEvt.barangay || 'Poblacion'}`,
          venue: dbEvt.venue_name || 'Anahaw Amphitheater, Buhanginan Hills',
          address: `${dbEvt.venue_name}, Iligan City`,
          route: `Brgy. ${dbEvt.barangay || 'Pala-o'}`,
          price: parseFloat(dbEvt.price) || 0,
          spotsLeft: typeof dbEvt.available_slots === 'number' ? dbEvt.available_slots : 100,
          totalSlots: typeof dbEvt.total_slots === 'number' ? dbEvt.total_slots : 100,
          image: dbEvt.image_url || 'images/kasadya_sa_diyandi.jpg',
          galleryMain: dbEvt.image_url || 'images/diyandi_festival_panoramic_header.png',
          galleryThumb: dbEvt.image_url || 'images/kasadya_sa_diyandi.jpg',
          guideName: dbEvt.organizer_name || 'Iligan City Tourism Office',
          guideRole: 'Community Event Coordinator',
          description: dbEvt.description || 'Community gathering and celebration in Iligan City.',
          inclusion: 'Official festival pass with QR code verification.',
          statusLabel: (parseFloat(dbEvt.price) === 0 ? 'Free admission' : (dbEvt.available_slots > 0 ? `${dbEvt.available_slots} places left` : 'Fully booked')),
          statusClass: dbEvt.available_slots < 20 ? 'status2' : 'status',
          is_featured: Number(dbEvt.is_featured) || 0
        }));

        this.events = mapped;
        this.renderEventsGrid();
        this.renderDashboard();
      }
    } catch (e) {}
  }

  async syncBookingsWithBackend() {
    try {
      const uid = this.currentUser ? this.currentUser.id : '';
      const url = uid ? `api.php?action=get_bookings&user_id=${encodeURIComponent(uid)}` : 'api.php?action=get_bookings';
      const res = await fetch(url);
      const json = await res.json();
      if (json && json.success && Array.isArray(json.data)) {
        if (json.data.length > 0) {
          this.bookings = json.data.map(b => ({
            id: Number(b.id),
            reference: b.booking_reference,
            guestName: b.attendee_name,
            guestEmail: b.attendee_email,
            guestPhone: b.attendee_phone,
            eventTitle: b.event_title,
            eventCategory: `${b.category || 'Community'} · ${b.formatted_time || b.event_time || ''}`,
            eventDate: b.formatted_date || b.event_date,
            ticketsCount: Number(b.tickets_count) || 1,
            totalFormatted: b.formatted_price || (parseFloat(b.price) === 0 ? 'Free' : `₱${b.price}`),
            totalNum: parseFloat(b.price) || 0,
            status: b.status || 'confirmed',
            attendees: [`${b.attendee_name} · Pass Holder`]
          }));
          this.saveLocalBookings();
        }
        this.updateBookingsBadge();
        this.renderDashboard();
      }
    } catch (e) {}
  }

  formatMonth(dateStr) {
    if (!dateStr) return 'OCTOBER';
    const m = new Date(dateStr).toLocaleString('en-US', { month: 'long' });
    return m ? m.toUpperCase() : 'OCTOBER';
  }

  updateNavAuthState() {
    const isAuth = !!this.currentUser;
    const isCoordOrAdmin = isAuth && (this.currentUser.role === 'organizer' || this.currentUser.role === 'admin');

    document.querySelectorAll('.nav-login-btn').forEach(el => {
      el.style.display = isAuth ? 'none' : 'inline-flex';
    });
    document.querySelectorAll('.nav-register-btn').forEach(el => {
      el.style.display = isAuth ? 'none' : 'inline-flex';
    });

    document.querySelectorAll('.nav-user-badge').forEach(el => {
      el.style.display = isAuth ? 'inline-flex' : 'none';
      if (isAuth && this.currentUser) {
        const fullRole = isCoordOrAdmin ? 'Coordinator' : 'Citizen';
        el.title = `${this.currentUser.name} (${fullRole})`;
      }
    });
    document.querySelectorAll('.nav-user-name-role').forEach(el => {
      if (isAuth && this.currentUser) {
        const roleLabel = isCoordOrAdmin ? 'Coord' : 'Citizen';
        let shortName = this.currentUser.name || 'User';
        if (shortName.includes('Tourism Office')) {
          shortName = 'Tourism Office';
        } else if (shortName.includes('Public Affairs')) {
          shortName = 'Public Affairs';
        } else if (shortName.length > 16) {
          shortName = shortName.split(' ')[0];
        }
        el.textContent = `${shortName} (${roleLabel})`;
      }
    });

    document.querySelectorAll('.nav-dash-btn').forEach(el => {
      el.style.display = isCoordOrAdmin ? 'inline-flex' : 'none';
    });

    document.querySelectorAll('.nav-logout-btn').forEach(el => {
      el.style.display = isAuth ? 'inline-flex' : 'none';
    });

    this.updateBookingsBadge();
  }

  updateBookingsBadge() {
    const count = this.bookings.filter(b => b.status !== 'cancelled').length;
    document.querySelectorAll('.nav-bookings-count').forEach(el => {
      el.textContent = count > 0 ? `(${count})` : '';
    });
  }

  handleMyBookingsClick() {
    if (!this.currentUser) {
      this.showToast({
        title: 'Sign In Required',
        message: 'Please sign in with your citizen account to view and manage your booked passes.',
        type: 'info'
      });
      this.openLoginModal('login');
      return;
    }
    this.openMyBookingsModal();
  }

  openLoginModal(tab = 'login') {
    this.switchLoginTab(tab);
    this.openModal('modal-login');
  }

  switchLoginTab(tab) {
    const tabLogin = document.getElementById('tab-btn-auth-login');
    const tabReg = document.getElementById('tab-btn-auth-register');
    const formLogin = document.getElementById('form-auth-login');
    const formReg = document.getElementById('form-auth-register');

    if (tab === 'register') {
      if (tabLogin) tabLogin.classList.remove('active');
      if (tabReg) tabReg.classList.add('active');
      if (formLogin) formLogin.style.display = 'none';
      if (formReg) formReg.style.display = 'block';
    } else {
      if (tabLogin) tabLogin.classList.add('active');
      if (tabReg) tabReg.classList.remove('active');
      if (formLogin) formLogin.style.display = 'block';
      if (formReg) formReg.style.display = 'none';
    }
  }

  toggleCoordinatorKeyField(roleVal) {
    const keyGroup = document.getElementById('reg-coord-key-group');
    if (keyGroup) {
      keyGroup.style.display = (roleVal === 'organizer') ? 'block' : 'none';
    }
  }

  async demoLogin(role) {
    let email = 'juan.delacruz@yahoo.com';
    let password = 'password123';

    if (role === 'amina') {
      email = 'amina.alonto@gmail.com';
    } else if (role === 'coordinator') {
      email = 'tourism@iligancity.gov.ph';
    } else if (role === 'admin') {
      email = 'affairs@iligancity.gov.ph';
    }

    await this.executeLogin(email, password);
  }

  async submitLogin(e) {
    if (e) e.preventDefault();
    const email = document.getElementById('login-email')?.value.trim();
    const password = document.getElementById('login-password')?.value;

    if (!email || !password) {
      this.showToast({ title: 'Missing Information', message: 'Please enter both your email and password.', type: 'error' });
      return;
    }

    await this.executeLogin(email, password);
  }

  async executeLogin(email, password) {
    try {
      const res = await fetch('api.php?action=login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (data && data.success && data.data && data.data.user) {
        this.saveStoredUser(data.data.user);
        this.updateNavAuthState();
        this.closeModal('modal-login');
        await this.syncBookingsWithBackend();
        const role = data.data.user.role;
        const isCoord = (role === 'organizer' || role === 'admin' || role === 'coordinator');
        this.showToast({
          title: 'Welcome back!',
          message: `Logged in as ${data.data.user.name} (${isCoord ? 'Coordinator' : 'Citizen'}).`,
          type: 'success'
        });
        if (isCoord) {
          this.switchView('dashboard');
        }
      } else {
        this.showToast({
          title: 'Sign In Failed',
          message: data?.message || 'Invalid email or password entered.',
          type: 'error'
        });
      }
    } catch (err) {
      const matched = {
        name: email.includes('tourism') ? 'Iligan City Tourism Office' : (email.includes('affairs') ? 'City Public Affairs Office' : (email.includes('amina') ? 'Amina Alonto' : 'Juan dela Cruz')),
        email: email,
        role: email.includes('tourism') || email.includes('affairs') ? 'organizer' : 'user',
        id: email.includes('tourism') ? 3 : (email.includes('affairs') ? 1 : 2)
      };
      this.saveStoredUser(matched);
      this.updateNavAuthState();
      this.closeModal('modal-login');
      const isCoord = (matched.role === 'organizer' || matched.role === 'admin' || matched.role === 'coordinator');
      this.showToast({ title: 'Welcome!', message: `Signed in as ${matched.name}.`, type: 'success' });
      if (isCoord) {
        this.switchView('dashboard');
      }
    }
  }

  async submitRegister(e) {
    if (e) e.preventDefault();
    const name = document.getElementById('reg-name')?.value.trim();
    const email = document.getElementById('reg-email')?.value.trim();
    const phone = document.getElementById('reg-phone')?.value.trim();
    const password = document.getElementById('reg-password')?.value;
    const role = document.getElementById('reg-role')?.value || 'user';
    const coordKey = document.getElementById('reg-coord-key')?.value.trim();

    if (!name || !email || !password) {
      this.showToast({ title: 'Incomplete Details', message: 'Name, email, and password are required.', type: 'error' });
      return;
    }

    try {
      const res = await fetch('api.php?action=register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          password,
          role,
          coordinator_key: coordKey
        })
      });
      const data = await res.json();

      if (data && data.success && data.data && data.data.user) {
        this.saveStoredUser(data.data.user);
        this.updateNavAuthState();
        this.closeModal('modal-login');
        const isCoord = (data.data.user.role === 'organizer' || data.data.user.role === 'admin' || data.data.user.role === 'coordinator');
        this.showToast({
          title: 'Account Registered!',
          message: `Mabuhay, ${name}! Your account is ready.`,
          type: 'success'
        });
        if (isCoord) {
          this.switchView('dashboard');
        }
      } else {
        this.showToast({
          title: 'Registration Unsuccessful',
          message: data?.message || 'Could not complete registration. Check your details.',
          type: 'error'
        });
      }
    } catch (err) {
      const isCoord = (role === 'organizer' || role === 'admin' || role === 'coordinator');
      const newUser = { id: Date.now(), name, email, phone, role };
      this.saveStoredUser(newUser);
      this.updateNavAuthState();
      this.closeModal('modal-login');
      this.showToast({ title: 'Welcome!', message: `Account created for ${name}.`, type: 'success' });
      if (isCoord) {
        this.switchView('dashboard');
      }
    }
  }

  handleLogout() {
    this.promptLogout();
  }

  logout() {
    this.promptLogout();
  }

  promptLogout() {
    const user = this.currentUser;
    const descEl = document.getElementById('logout-modal-desc-text');
    if (descEl) {
      if (user) {
        const roleName = (user.role === 'admin') ? 'Administrator' : ((user.role === 'organizer' || user.role === 'coordinator') ? 'Event Coordinator' : 'Citizen Attendee');
        const displayName = user.name || user.email || 'User';
        descEl.innerHTML = `Are you sure you want to log out of <strong>${displayName}</strong> (${roleName})? You will need to sign in again to book passes, manage registered events, or access coordinator tools.`;
      } else {
        descEl.innerHTML = `Are you sure you want to log out? You will need to sign in again to book passes, manage registered events, or access coordinator tools.`;
      }
    }
    this.openModal('modal-confirm-logout');
  }

  async confirmLogout() {
    this.closeModal('modal-confirm-logout');
    try {
      await fetch('api.php?action=logout', { method: 'POST' });
    } catch (e) {}

    this.saveStoredUser(null);
    this.updateNavAuthState();
    this.switchView('discover');
    this.showToast({
      title: 'Signed Out',
      message: 'You have been signed out. Explore events freely!',
      type: 'info'
    });
  }

  openProfileModal() {
    if (!this.currentUser) return;
    const nameInput = document.getElementById('prof-name-input');
    const emailEl = document.getElementById('prof-email-display');
    const phoneInput = document.getElementById('prof-phone-input');
    const roleEl = document.getElementById('prof-role-display');
    const bookingsCountEl = document.getElementById('prof-bookings-count');

    if (nameInput) nameInput.value = this.currentUser.name || '';
    if (emailEl) emailEl.textContent = this.currentUser.email || '';
    if (phoneInput) phoneInput.value = this.currentUser.phone || '';
    if (roleEl) roleEl.textContent = this.currentUser.role === 'organizer' ? 'Event Coordinator (Official)' : 'Citizen Attendee';

    const activeCount = this.bookings.filter(b => b.status !== 'cancelled').length;
    if (bookingsCountEl) bookingsCountEl.textContent = activeCount;

    this.openModal('modal-profile');
  }

  async submitUpdateProfile(e) {
    if (e) e.preventDefault();
    if (!this.currentUser) return;

    const name = document.getElementById('prof-name-input')?.value.trim();
    const phone = document.getElementById('prof-phone-input')?.value.trim();

    if (!name) {
      this.showToast({ title: 'Name Required', message: 'Please enter your full name.', type: 'error' });
      return;
    }

    try {
      const res = await fetch('api.php?action=update_profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone })
      });
      const data = await res.json();
      if (data && data.success) {
        this.currentUser.name = name;
        this.currentUser.phone = phone;
        this.saveStoredUser(this.currentUser);
        this.updateNavAuthState();
        this.closeModal('modal-profile');
        this.showToast({ title: 'Profile Updated', message: 'Your personal information has been saved.', type: 'success' });
        return;
      }
    } catch (err) {}

    this.currentUser.name = name;
    this.currentUser.phone = phone;
    this.saveStoredUser(this.currentUser);
    this.updateNavAuthState();
    this.closeModal('modal-profile');
    this.showToast({ title: 'Profile Updated', message: 'Your personal information has been saved.', type: 'success' });
  }

  switchView(viewName) {
    const views = {
      discover: document.getElementById('view-discover'),
      details: document.getElementById('view-details'),
      checkout: document.getElementById('view-checkout'),
      confirmed: document.getElementById('view-confirmed'),
      dashboard: document.getElementById('view-dashboard')
    };

    Object.keys(views).forEach(key => {
      const el = views[key];
      if (el) {
        if (key === viewName) {
          el.classList.add('active-view');
        } else {
          el.classList.remove('active-view');
        }
      }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (viewName === 'dashboard') {
      this.renderDashboard();
    } else if (viewName === 'discover') {
      this.renderEventsGrid();
    }
  }

  filterCategory(cat) {
    if (!document.getElementById('view-discover')?.classList.contains('active-view')) {
      this.switchView('discover');
    }
    this.activeCategory = cat;
    document.querySelectorAll('.categories .category-filter, .categories .category-filter2').forEach(pill => {
      const pcat = pill.getAttribute('data-cat');
      if (pcat === cat) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });
    this.currentPage = 1;
    this.renderEventsGrid();
    if (cat === 'All') {
      setTimeout(() => {
        this.scrollToUpcoming();
      }, 50);
    }
  }

  showWhatsOnNav() {
    this.switchView('discover');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  showAllEventsNav() {
    this.switchView('discover');
    this.activeCategory = 'All';
    this.searchQuery = '';
    this.dateFilter = 'all';
    const sInput = document.getElementById('alderhaven-search-input');
    if (sInput) sInput.value = '';
    const dSelect = document.getElementById('alderhaven-date-select');
    if (dSelect) dSelect.value = 'all';
    document.querySelectorAll('.categories .category-filter, .categories .category-filter2').forEach(pill => {
      const pcat = pill.getAttribute('data-cat');
      if (pcat === 'All') {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });
    this.currentPage = 1;
    this.renderEventsGrid();
    setTimeout(() => {
      this.scrollToUpcoming();
    }, 60);
  }

  handleSearch(query) {
    this.searchQuery = query.trim().toLowerCase();
    this.currentPage = 1;
    this.renderEventsGrid();
  }

  handleDateSelect(val) {
    this.dateFilter = val;
    this.currentPage = 1;
    this.renderEventsGrid();
  }

  handleSort(val) {
    this.sortMode = val;
    this.currentPage = 1;
    this.renderEventsGrid();
  }

  applySearchFilter() {
    const sInput = document.getElementById('alderhaven-search-input');
    const dSelect = document.getElementById('alderhaven-date-select');
    if (sInput) this.searchQuery = sInput.value.trim().toLowerCase();
    if (dSelect) this.dateFilter = dSelect.value;
    this.currentPage = 1;
    this.renderEventsGrid();
    this.scrollToUpcoming();
  }

  scrollToUpcoming() {
    const sec = document.getElementById('upcoming-events-section');
    if (sec) sec.scrollIntoView({ behavior: 'smooth' });
  }

  getFilteredEvents() {
    return this.events.filter(evt => {
      if (this.activeCategory !== 'All') {
        if (this.activeCategory === 'Free events') {
          if (evt.price > 0) return false;
        } else {
          const matchCat = evt.category.toLowerCase().includes(this.activeCategory.toLowerCase()) ||
                           this.activeCategory.toLowerCase().includes(evt.category.toLowerCase());
          if (!matchCat) return false;
        }
      }

      if (this.searchQuery) {
        const str = `${evt.title} ${evt.category} ${evt.location} ${evt.venue} ${evt.description}`.toLowerCase();
        if (!str.includes(this.searchQuery)) return false;
      }

      if (this.dateFilter) {
        if (this.dateFilter === 'weekend') {
          const d = new Date(evt.date);
          const day = d.getDay();
          if (day !== 0 && day !== 6) return false;
        } else if (this.dateFilter.startsWith('2026-')) {
          if (!evt.date.startsWith(this.dateFilter)) return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (this.sortMode === 'price-low') return a.price - b.price;
      if (this.sortMode === 'price-high') return b.price - a.price;
      if (this.sortMode === 'alpha') return a.title.localeCompare(b.title);
      return new Date(a.date) - new Date(b.date);
    });
  }

  renderEventsGrid() {
    const container = document.getElementById('discover-events-container');
    if (!container) return;

    const filtered = this.getFilteredEvents();
    const countBadge = document.getElementById('events-count-badge');
    const paginationWrap = document.getElementById('discover-events-pagination');
    const summaryEl = document.getElementById('events-pagination-summary');

    if (filtered.length === 0) {
      if (countBadge) {
        countBadge.textContent = '0 upcoming events · Something for every kind of day in Iligan';
      }
      if (paginationWrap) {
        paginationWrap.style.display = 'none';
      }
      container.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 48px; text-align: center; background: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 12px;">
          <div style="font-size: 20px; font-weight: 700; color: #1E3A8A; margin-bottom: 8px;">No events match your criteria</div>
          <div style="color: #4B5563; font-size: 15px; margin-bottom: 20px;">Try clearing your search query or choosing another category.</div>
          <button type="button" class="ald-btn-primary" onclick="window.filterCategory('All')">View All Community Events</button>
        </div>
      `;
      return;
    }

    if (paginationWrap) {
      paginationWrap.style.display = 'flex';
    }

    const totalEvents = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalEvents / this.pageSize));
    if (this.currentPage > totalPages) {
      this.currentPage = totalPages;
    }
    if (this.currentPage < 1) {
      this.currentPage = 1;
    }

    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, totalEvents);
    const pageEvents = filtered.slice(startIndex, endIndex);

    if (countBadge) {
      countBadge.textContent = `Showing ${startIndex + 1}–${endIndex} of ${totalEvents} upcoming events · Something for every kind of day in Iligan`;
    }

    if (summaryEl) {
      summaryEl.textContent = `Showing ${startIndex + 1}–${endIndex} of ${totalEvents} events (Page ${this.currentPage} of ${totalPages})`;
    }

    container.innerHTML = '';

    pageEvents.forEach(evt => {
      const card = document.createElement('div');
      card.className = 'event-card';
      card.style.cursor = 'pointer';
      card.onclick = () => this.openEventDetails(evt.id);

      const priceDisplay = evt.price === 0 ? 'FREE' : `₱${evt.price.toFixed(2)}`;
      const priceUnit = evt.price === 0 ? 'admission' : '/ person';

      card.innerHTML = `
        <div class="event-photograph" style="background-image: url('${evt.image}');">
          <div class="date-marker">
            <div class="month">${evt.month}</div>
          </div>
        </div>
        <div class="event-information">
          <div class="event-info-main">
            <div class="category">${evt.category.toUpperCase()}</div>
            <div class="title2">${evt.title}</div>
            <div class="date">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1E3A8A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              <div class="schedule">${evt.schedule}</div>
            </div>
            <div class="location2">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#D97706" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:text-bottom;margin-right:4px;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              <span>${evt.venue}</span>
            </div>
          </div>
          <div class="event-info-footer">
            <div class="booking-information">
              <div class="price">
                <div class="amount">${priceDisplay}</div>
                <div class="unit">${priceUnit}</div>
              </div>
              <div class="status">
                <div class="label5">${evt.statusLabel}</div>
              </div>
            </div>
            <div class="card-actions-row" onclick="event.stopPropagation();">
              <button type="button" class="btn-card-details" onclick="window.openEventDetails(${evt.id})">View Details</button>
              <button type="button" class="btn-card-book" onclick="window.openCheckoutForEvent(${evt.id})">Book Pass</button>
            </div>
          </div>
        </div>
      `;

      container.appendChild(card);
    });

    this.renderPaginationControls(totalEvents, totalPages, startIndex, endIndex);
  }

  renderPaginationControls(totalEvents, totalPages, startIndex, endIndex) {
    const bottomControls = document.getElementById('events-pagination-controls');
    const topControls = document.getElementById('events-top-pagination-controls');

    if (totalEvents === 0) {
      if (bottomControls) bottomControls.innerHTML = '';
      if (topControls) topControls.innerHTML = '';
      return;
    }

    let html = '';
    const isFirstPage = this.currentPage <= 1;
    const isLastPage = this.currentPage >= totalPages;

    html += `<button type="button" class="pagination-nav-btn" ${isFirstPage ? 'disabled style="opacity:0.4;cursor:not-allowed;"' : `onclick="window.setEventsPage(${this.currentPage - 1})"`}>‹ Prev</button>`;

    for (let p = 1; p <= totalPages; p++) {
      const activeClass = p === this.currentPage ? ' active' : '';
      html += `<button type="button" class="pagination-page-btn${activeClass}" onclick="window.setEventsPage(${p})">${p}</button>`;
    }

    html += `<button type="button" class="pagination-nav-btn" ${isLastPage ? 'disabled style="opacity:0.4;cursor:not-allowed;"' : `onclick="window.setEventsPage(${this.currentPage + 1})"`}>Next ›</button>`;

    if (bottomControls) bottomControls.innerHTML = html;
    if (topControls) topControls.innerHTML = html;
  }

  setEventsPage(pageNum) {
    const filtered = this.getFilteredEvents();
    const totalPages = Math.max(1, Math.ceil(filtered.length / this.pageSize));
    let page = Number(pageNum);
    if (isNaN(page)) page = 1;
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    this.currentPage = page;
    this.renderEventsGrid();
    this.scrollToUpcoming();
  }

  openEventDetails(id) {
    const found = this.events.find(e => e.id === Number(id));
    if (!found) return;

    this.selectedEvent = found;

    const bCat = document.getElementById('details-breadcrumb-cat');
    if (bCat) bCat.textContent = found.category;
    const bTitle = document.getElementById('details-breadcrumb-title');
    if (bTitle) bTitle.textContent = found.title;

    const eCat = document.getElementById('details-event-cat');
    if (eCat) eCat.textContent = `${found.category.toUpperCase()} · COMMUNITY EVENT`;
    const eTitle = document.getElementById('details-event-title');
    if (eTitle) eTitle.textContent = found.title;

    const gMain = document.getElementById('details-gallery-main');
    if (gMain) gMain.src = found.galleryMain || found.image;
    const gThumb = document.getElementById('details-gallery-thumb');
    if (gThumb) gThumb.src = found.galleryThumb || found.image;

    let formattedDate = found.date || '';
    try {
      const parts = (found.date || '').split('-');
      if (parts.length === 3) {
        const dObj = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        if (!isNaN(dObj.getTime())) {
          formattedDate = dObj.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        }
      }
    } catch (e) {}

    const dDate = document.getElementById('details-schedule-date');
    if (dDate) dDate.textContent = formattedDate;
    const qDate = document.getElementById('details-quick-date');
    if (qDate) qDate.textContent = formattedDate;

    let timeStr = found.time || '';
    if (timeStr && /^\d{1,2}:\d{2}$/.test(timeStr)) {
      const [h, m] = timeStr.split(':');
      let hour = parseInt(h);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      hour = hour % 12 || 12;
      timeStr = `${hour}:${m} ${ampm}`;
    }

    const dTime = document.getElementById('details-schedule-time');
    if (dTime) dTime.textContent = timeStr;
    const qTime = document.getElementById('details-quick-time');
    if (qTime) qTime.textContent = timeStr;

    const dVenue = document.getElementById('details-venue-name');
    if (dVenue) dVenue.textContent = found.venue;
    const qVenue = document.getElementById('details-quick-venue');
    if (qVenue) qVenue.textContent = found.venue;
    const fVenue = document.getElementById('details-venue-full-name');
    if (fVenue) fVenue.textContent = found.venue;

    const dRoute = document.getElementById('details-route-desc');
    if (dRoute) dRoute.textContent = found.route || found.location;
    const fRoute = document.getElementById('details-route-full-desc');
    if (fRoute) fRoute.textContent = found.location || `${found.venue}, Iligan City`;

    const gName = document.getElementById('details-guide-name');
    if (gName) gName.textContent = found.organizer || found.guideName || 'Iligan City Tourism Office';
    const gRole = document.getElementById('details-guide-role');
    if (gRole) gRole.textContent = found.guideRole || 'Official Event Coordinator';

    const eDesc = document.getElementById('details-full-description');
    if (eDesc) eDesc.textContent = found.description;
    const eInc = document.getElementById('details-inclusion-copy');
    if (eInc) eInc.textContent = found.inclusion || 'Official festival pass with QR code verification and reserved area access.';

    const rPrice = document.getElementById('details-rate-price');
    if (rPrice) rPrice.textContent = found.price === 0 ? 'FREE' : `₱${found.price.toFixed(2)}`;
    const rUnit = document.getElementById('details-rate-unit');
    if (rUnit) rUnit.textContent = found.price === 0 ? 'admission' : '/ person';

    const rLeft = document.getElementById('details-spots-left-badge');
    if (rLeft) rLeft.textContent = found.statusLabel || (found.spotsLeft > 0 ? `${found.spotsLeft} places left` : 'Open Registration');

    this.switchView('details');
  }

  openCheckoutForEvent(id) {
    const found = this.events.find(e => e.id === Number(id));
    if (found) {
      this.selectedEvent = found;
    }
    this.openCheckout();
  }

  openCheckout() {
    const evt = this.selectedEvent;
    if (!evt) return;

    this.tickets = { adult: 1, child: 0 };

    const cImg = document.getElementById('chk-summary-img');
    if (cImg) cImg.src = evt.image;
    const cTitle = document.getElementById('chk-summary-title');
    if (cTitle) cTitle.textContent = evt.title;
    const cCat = document.getElementById('chk-summary-cat');
    if (cCat) cCat.textContent = evt.category;
    const cDate = document.getElementById('chk-summary-date');
    if (cDate) cDate.textContent = evt.date;
    const cTime = document.getElementById('chk-summary-time');
    if (cTime) cTime.textContent = evt.time;
    const cVenue = document.getElementById('chk-summary-venue');
    if (cVenue) cVenue.textContent = evt.venue;

    if (this.currentUser) {
      const parts = (this.currentUser.name || '').split(' ');
      const fn = document.getElementById('chk-first-name');
      const ln = document.getElementById('chk-last-name');
      const em = document.getElementById('chk-email');
      const ph = document.getElementById('chk-phone');

      if (fn) fn.value = parts[0] || '';
      if (ln) ln.value = parts.slice(1).join(' ') || '';
      if (em) em.value = this.currentUser.email || '';
      if (ph) ph.value = this.currentUser.phone || '';
    }

    this.updateCheckoutTotals();
    this.switchView('checkout');
  }

  stepTicket(type, delta) {
    if (type === 'adult') {
      this.tickets.adult = Math.max(1, Math.min(10, this.tickets.adult + delta));
    } else if (type === 'child') {
      this.tickets.child = Math.max(0, Math.min(10, this.tickets.child + delta));
    }
    this.updateCheckoutTotals();
  }

  updateCheckoutTotals() {
    const evt = this.selectedEvent;
    if (!evt) return;

    const adultCountEl = document.getElementById('chk-adult-count');
    if (adultCountEl) adultCountEl.textContent = this.tickets.adult;
    const childCountEl = document.getElementById('chk-child-count');
    if (childCountEl) childCountEl.textContent = this.tickets.child;

    const adultPrice = evt.price;
    const childPrice = Math.round(adultPrice * 0.5);

    const adultTotal = this.tickets.adult * adultPrice;
    const childTotal = this.tickets.child * childPrice;
    const grandTotal = adultTotal + childTotal;

    const aTotEl = document.getElementById('chk-adult-total');
    if (aTotEl) aTotEl.textContent = adultPrice === 0 ? 'FREE' : `₱${adultTotal.toFixed(2)}`;
    const cTotEl = document.getElementById('chk-child-total');
    if (cTotEl) cTotEl.textContent = childPrice === 0 ? 'FREE' : `₱${childTotal.toFixed(2)}`;

    const grandEl = document.getElementById('chk-grand-total');
    if (grandEl) grandEl.textContent = grandTotal === 0 ? 'FREE' : `₱${grandTotal.toFixed(2)}`;
    const grandSummaryEl = document.getElementById('chk-summary-total');
    if (grandSummaryEl) grandSummaryEl.textContent = grandTotal === 0 ? 'FREE' : `₱${grandTotal.toFixed(2)}`;

    const countSummaryEl = document.getElementById('chk-summary-ticket-count');
    if (countSummaryEl) {
      const totCount = this.tickets.adult + this.tickets.child;
      countSummaryEl.textContent = `${totCount} ticket${totCount > 1 ? 's' : ''}`;
    }
  }

  async submitBooking() {
    const firstName = document.getElementById('chk-first-name')?.value.trim();
    const lastName = document.getElementById('chk-last-name')?.value.trim();
    const email = document.getElementById('chk-email')?.value.trim();
    const phone = document.getElementById('chk-phone')?.value.trim();

    if (!firstName || !lastName || !email) {
      this.showToast({
        title: 'Information Required',
        message: 'Please complete your first name, last name, and email address before proceeding.',
        type: 'error'
      });
      return;
    }

    const evt = this.selectedEvent;
    const totTickets = this.tickets.adult + this.tickets.child;
    const grandTotal = (this.tickets.adult * evt.price) + (this.tickets.child * Math.round(evt.price * 0.5));
    const formattedTotal = grandTotal === 0 ? 'FREE' : `₱${grandTotal.toFixed(2)}`;

    const randHex = Math.floor(1000 + Math.random() * 9000).toString(16).toUpperCase();
    const bookingRef = `ILG-2026-${randHex}`;

    const newBooking = {
      id: Date.now(),
      booking_reference: bookingRef,
      reference: bookingRef,
      guestName: `${firstName} ${lastName}`,
      guestEmail: email,
      guestPhone: phone,
      eventTitle: evt.title,
      eventCategory: evt.category,
      eventDate: evt.date,
      ticketsCount: totTickets,
      totalFormatted: formattedTotal,
      totalNum: grandTotal,
      status: 'confirmed',
      venue: evt.venue,
      attendees: [`${firstName} ${lastName} · Lead Attendee`]
    };

    try {
      await fetch('api.php?action=book_event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_id: evt.id,
          attendee_name: `${firstName} ${lastName}`,
          attendee_email: email,
          attendee_phone: phone,
          tickets_count: totTickets,
          user_id: this.currentUser ? this.currentUser.id : null
        })
      });
    } catch (e) {}

    this.bookings.unshift(newBooking);
    this.saveLocalBookings();
    this.latestBooking = newBooking;
    this.updateBookingsBadge();

    const cMsg = document.getElementById('cnf-email-msg');
    if (cMsg) cMsg.textContent = `We have sent your digital passes and verification details to ${email}. Keep your pass ready for gate entry on the day.`;
    const cImg = document.getElementById('cnf-event-img');
    if (cImg) cImg.src = evt.image;
    const cTitle = document.getElementById('cnf-event-title');
    if (cTitle) cTitle.textContent = evt.title;
    const cDate = document.getElementById('cnf-event-date');
    if (cDate) cDate.textContent = evt.date;
    const cTime = document.getElementById('cnf-event-time');
    if (cTime) cTime.textContent = `${evt.time} · Gates open 30 mins early`;
    const cVenue = document.getElementById('cnf-event-venue');
    if (cVenue) cVenue.textContent = evt.venue;
    const cRef = document.getElementById('cnf-reference');
    if (cRef) cRef.textContent = bookingRef;
    const cPaid = document.getElementById('cnf-total-paid');
    if (cPaid) cPaid.textContent = formattedTotal;

    const qrContainer = document.getElementById('cnf-qr-code-box');
    if (qrContainer) {
      qrContainer.innerHTML = '';
      if (typeof QRCode !== 'undefined') {
        new QRCode(qrContainer, {
          text: `ILIGAN-PASS:${bookingRef}|${firstName} ${lastName}|${evt.title}|${evt.date}`,
          width: 140,
          height: 140,
          colorDark: '#1E3A8A',
          colorLight: '#FFFFFF',
          correctLevel: QRCode.CorrectLevel.H
        });
      }
    }

    const cList = document.getElementById('cnf-attendees-list');
    if (cList) {
      cList.innerHTML = `<div class="label3">${totTickets} Attendee Pass${totTickets > 1 ? 'es' : ''}</div>`;
      for (let i = 1; i <= totTickets; i++) {
        const d = document.createElement('div');
        d.className = 'attendee';
        d.textContent = i === 1 ? `${firstName} ${lastName} (Lead Pass Holder)` : `Pass Holder #${i}`;
        cList.appendChild(d);
      }
    }

    this.showConfetti();
    this.showToast({
      title: 'Pass Reserved Successfully!',
      message: `Booking reference ${bookingRef} generated.`,
      type: 'success'
    });

    this.switchView('confirmed');
  }

  openMyBookingsModal() {
    const list = document.getElementById('my-bookings-list');
    if (!list) return;

    list.innerHTML = '';

    if (this.bookings.length === 0) {
      list.innerHTML = `
        <div style="padding:36px;text-align:center;color:#4B5563;background:#F9FAFB;border:1px solid #E5E7EB;border-radius:10px;">
          <div style="font-size:18px;font-weight:700;color:#1E3A8A;margin-bottom:6px;">No passes booked yet</div>
          <p style="font-size:14px;margin-bottom:16px;">Explore community events and festivals across Iligan City to reserve your first pass.</p>
          <button type="button" class="ald-btn-primary" onclick="window.closeModal('modal-my-bookings'); window.switchView('discover');">Browse Events</button>
        </div>
      `;
      this.openModal('modal-my-bookings');
      return;
    }

    this.bookings.forEach(b => {
      const card = document.createElement('div');
      card.style.cssText = 'background:#FFFFFF;border:1px solid #E5E7EB;border-radius:10px;padding:18px;display:flex;flex-direction:column;gap:10px;';

      const isCancelled = b.status === 'cancelled';
      const statusPill = isCancelled
        ? '<span style="background:#FEE2E2;color:#DC2626;padding:4px 10px;border-radius:6px;font-size:12px;font-weight:700;">CANCELLED</span>'
        : '<span style="background:#DCFCE7;color:#16A34A;padding:4px 10px;border-radius:6px;font-size:12px;font-weight:700;">CONFIRMED PASS</span>';

      card.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px;">
          <div>
            <div style="font-size:16px;font-weight:700;color:#1E3A8A;">${b.eventTitle}</div>
            <div style="font-size:13px;color:#4B5563;margin-top:2px;">${b.eventDate} · Ref: <strong style="color:#D97706;">${b.booking_reference || b.reference}</strong></div>
          </div>
          <div>${statusPill}</div>
        </div>
        <div style="font-size:14px;color:#1F2937;">
          Holder: <strong>${b.guestName || b.attendee_name}</strong> · Tickets: <strong>${b.ticketsCount || b.tickets_count}</strong> · Total: <strong>${b.totalFormatted || b.formatted_price}</strong>
        </div>
        <div style="display:flex;gap:10px;margin-top:6px;">
          <button type="button" class="ald-btn-primary" style="height:38px;padding:0 16px;font-size:13px;" onclick="window.openBookingPass('${b.booking_reference || b.reference}')">View Digital Pass</button>
          ${!isCancelled ? `<button type="button" class="btn-danger-confirm" style="height:38px;padding:0 16px;font-size:13px;background:transparent;color:#DC2626;border:1px solid #DC2626;" onclick="window.promptCancelBooking(${b.id}, '${b.booking_reference || b.reference}', '${b.eventTitle.replace(/'/g, "\\'")}')">Cancel Pass</button>` : ''}
        </div>
      `;
      list.appendChild(card);
    });

    this.openModal('modal-my-bookings');
  }

  openBookingPass(ref) {
    const booking = this.bookings.find(b => (b.booking_reference === ref || b.reference === ref));
    if (!booking) return;

    const refEl = document.getElementById('pass-modal-ref');
    if (refEl) refEl.textContent = ref;
    const titleEl = document.getElementById('pass-modal-title');
    if (titleEl) titleEl.textContent = booking.eventTitle;
    const holderEl = document.getElementById('pass-modal-holder');
    if (holderEl) holderEl.textContent = booking.guestName || booking.attendee_name;
    const dateEl = document.getElementById('pass-modal-date');
    if (dateEl) dateEl.textContent = booking.eventDate;
    const countEl = document.getElementById('pass-modal-count');
    if (countEl) countEl.textContent = `${booking.ticketsCount || booking.tickets_count} General Admission`;

    const qrBox = document.getElementById('pass-modal-qr-box');
    if (qrBox) {
      qrBox.innerHTML = '';
      if (typeof QRCode !== 'undefined') {
        new QRCode(qrBox, {
          text: `ILIGAN-PASS:${ref}|${booking.guestName || booking.attendee_name}|${booking.eventTitle}`,
          width: 150,
          height: 150,
          colorDark: '#1E3A8A',
          colorLight: '#FFFFFF',
          correctLevel: QRCode.CorrectLevel.H
        });
      }
    }

    this.openModal('modal-pass-details');
  }

  promptCancelBooking(id, ref, eventTitle) {
    this.pendingCancelBooking = { id, ref, eventTitle };

    const titleEl = document.getElementById('destructive-modal-title');
    if (titleEl) titleEl.textContent = 'Confirm Pass Cancellation';

    const descEl = document.getElementById('destructive-modal-desc');
    if (descEl) {
      descEl.innerHTML = `Are you sure you want to cancel your pass for <strong>${eventTitle}</strong> (Reference: <strong>${ref}</strong>)? Your reserved slots will be released back to the community.`;
    }

    const inputWrap = document.getElementById('destructive-input-container');
    if (inputWrap) inputWrap.style.display = 'none';

    const confirmBtn = document.getElementById('destructive-confirm-btn');
    if (confirmBtn) {
      confirmBtn.textContent = 'Confirm Cancellation';
      confirmBtn.onclick = () => this.confirmCancelBooking();
    }

    this.openModal('modal-confirm-destructive');
  }

  async confirmCancelBooking() {
    if (!this.pendingCancelBooking) return;
    const { id } = this.pendingCancelBooking;

    try {
      await fetch('api.php?action=cancel_booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking_id: id })
      });
    } catch (e) {}

    const found = this.bookings.find(b => b.id === id);
    if (found) found.status = 'cancelled';
    this.saveLocalBookings();

    this.closeModal('modal-confirm-destructive');
    this.openMyBookingsModal();
    this.showToast({
      title: 'Pass Cancelled',
      message: 'Your booking has been cancelled and spot released.',
      type: 'info'
    });
  }

  promptDeleteEvent(id, title) {
    this.pendingDeleteEvent = { id, title };

    const titleEl = document.getElementById('destructive-modal-title');
    if (titleEl) titleEl.textContent = 'Confirm Event Deletion (Destructive Action)';

    const descEl = document.getElementById('destructive-modal-desc');
    if (descEl) {
      descEl.innerHTML = `Are you sure you want to permanently delete <strong>${title}</strong>? This action will remove the event listing and cancel all active citizen bookings. To safeguard against accidental deletion, type <strong>DELETE</strong> below:`;
    }

    const inputWrap = document.getElementById('destructive-input-container');
    if (inputWrap) inputWrap.style.display = 'block';

    const inputField = document.getElementById('confirm-destructive-input');
    if (inputField) {
      inputField.value = '';
      inputField.placeholder = 'Type DELETE here';
    }

    const confirmBtn = document.getElementById('destructive-confirm-btn');
    if (confirmBtn) {
      confirmBtn.textContent = 'Permanently Delete Event';
      confirmBtn.onclick = () => this.confirmDeleteEvent();
    }

    this.openModal('modal-confirm-destructive');
  }

  async confirmDeleteEvent() {
    if (!this.pendingDeleteEvent) return;
    const { id, title } = this.pendingDeleteEvent;

    const inputField = document.getElementById('confirm-destructive-input');
    if (!inputField || inputField.value.trim() !== 'DELETE') {
      this.showToast({
        title: 'Action Unconfirmed',
        message: 'Please type the word DELETE in capital letters to confirm deletion.',
        type: 'error'
      });
      return;
    }

    try {
      const res = await fetch('api.php?action=delete_event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, confirmation_text: 'DELETE' })
      });
      const data = await res.json();
      if (!data.success) {
        this.showToast({ title: 'Deletion Error', message: data.message, type: 'error' });
        return;
      }
    } catch (e) {}

    this.events = this.events.filter(evt => evt.id !== Number(id));
    this.closeModal('modal-confirm-destructive');
    this.renderEventsGrid();
    this.renderDashboard();

    this.showToast({
      title: 'Event Deleted',
      message: `"${title}" has been permanently removed from the system.`,
      type: 'success'
    });
  }

  checkDuplicateEventTitle(title) {
    const warningBox = document.getElementById('add-evt-feedback-warning');
    if (!warningBox) return;

    const q = title.trim().toLowerCase();
    if (q.length < 3) {
      warningBox.style.display = 'none';
      return;
    }

    const duplicate = this.events.find(e => e.title.toLowerCase() === q);
    if (duplicate) {
      warningBox.style.display = 'block';
      warningBox.innerHTML = `⚠️ <strong>Feedback Warning:</strong> An event titled "${duplicate.title}" already exists in the system (Venue: ${duplicate.venue}). Please verify your date and title to avoid duplicate listings.`;
    } else {
      warningBox.style.display = 'none';
    }
  }

  openAddEventModal() {
    const warningBox = document.getElementById('add-evt-feedback-warning');
    if (warningBox) warningBox.style.display = 'none';
    this.openModal('modal-add-event');
  }

  async submitAddEvent(e) {
    if (e) e.preventDefault();

    const title = document.getElementById('add-evt-title')?.value.trim();
    const cat = document.getElementById('add-evt-cat')?.value || 'Festival';
    const venue = document.getElementById('add-evt-venue')?.value.trim();
    const barangay = document.getElementById('add-evt-brgy')?.value || 'Pala-o';
    const date = document.getElementById('add-evt-date')?.value;
    const time = document.getElementById('add-evt-time')?.value || '08:00';
    const price = parseFloat(document.getElementById('add-evt-price')?.value) || 0;
    const slots = parseInt(document.getElementById('add-evt-slots')?.value) || 200;
    const imgUrl = document.getElementById('add-evt-image')?.value.trim();
    const desc = document.getElementById('add-evt-desc')?.value.trim();

    if (!title || !venue || !date) {
      this.showToast({ title: 'Missing Fields', message: 'Please provide event title, venue, and date.', type: 'error' });
      return;
    }

    const exactDuplicate = this.events.find(e => e.title.toLowerCase() === title.toLowerCase() && e.date === date);
    if (exactDuplicate) {
      this.showToast({
        title: 'Duplicate Event Detected',
        message: `An event titled "${title}" already exists on ${date}. Please modify the title or choose another date.`,
        type: 'error'
      });
      return;
    }

    const newEvt = {
      id: Date.now(),
      title,
      category: cat,
      month: this.formatMonth(date),
      schedule: `${date} · ${time}`,
      date,
      time,
      duration: '3 hours',
      location: `${venue}, Brgy. ${barangay}`,
      venue,
      address: `${venue}, Iligan City`,
      route: `Brgy. ${barangay}`,
      price,
      spotsLeft: slots,
      totalSlots: slots,
      image: imgUrl || 'images/kasadya_sa_diyandi.jpg',
      galleryMain: imgUrl || 'images/kasadya_sa_diyandi.jpg',
      galleryThumb: 'images/anahaw_amphitheater.jpg',
      guideName: this.currentUser ? this.currentUser.name : 'Iligan City Tourism Office',
      guideRole: 'Event Coordinator',
      description: desc || 'Official community gathering and event in Iligan City.',
      inclusion: 'Official festival pass with QR code verification.',
      statusLabel: price === 0 ? 'Free admission' : `${slots} places left`,
      statusClass: 'status',
      is_featured: 0
    };

    try {
      await fetch('api.php?action=create_event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category: cat,
          venue_name: venue,
          barangay,
          event_date: date,
          event_time: time,
          price,
          total_slots: slots,
          image_url: imgUrl,
          description: desc
        })
      });
    } catch (err) {}

    this.events.unshift(newEvt);
    this.closeModal('modal-add-event');
    this.renderEventsGrid();
    this.renderDashboard();

    this.showToast({
      title: 'Event Published!',
      message: `"${title}" is now visible to all citizens and visitors.`,
      type: 'success'
    });
  }

  openEditEventModal(id = null) {
    const targetId = id !== null ? Number(id) : (this.selectedEvent ? Number(this.selectedEvent.id) : null);
    if (!targetId) return;

    const evt = this.events.find(e => e.id === targetId);
    if (!evt) return;

    this.selectedEvent = evt;

    const idInput = document.getElementById('edit-evt-id');
    if (idInput) idInput.value = evt.id;

    const titleInput = document.getElementById('edit-evt-title');
    if (titleInput) titleInput.value = evt.title || '';

    const catSelect = document.getElementById('edit-evt-cat');
    if (catSelect) {
      let matched = false;
      for (let opt of catSelect.options) {
        if (opt.value.toLowerCase() === (evt.category || '').toLowerCase()) {
          opt.selected = true;
          matched = true;
          break;
        }
      }
      if (!matched && evt.category) {
        const newOpt = new Option(evt.category, evt.category, true, true);
        catSelect.add(newOpt);
      }
    }

    const brgySelect = document.getElementById('edit-evt-brgy');
    if (brgySelect) {
      let foundBrgy = evt.route ? evt.route.replace('Brgy. ', '').trim() : '';
      if (!foundBrgy && evt.location) {
        const m = evt.location.match(/Brgy\.\s*([^,]+)/i);
        if (m) foundBrgy = m[1].trim();
      }
      let matched = false;
      for (let opt of brgySelect.options) {
        if (opt.value.toLowerCase() === foundBrgy.toLowerCase()) {
          opt.selected = true;
          matched = true;
          break;
        }
      }
      if (!matched && foundBrgy) {
        const newOpt = new Option(foundBrgy, foundBrgy, true, true);
        brgySelect.add(newOpt);
      }
    }

    const venueInput = document.getElementById('edit-evt-venue');
    if (venueInput) venueInput.value = evt.venue || '';

    const imgInput = document.getElementById('edit-evt-image');
    if (imgInput) imgInput.value = evt.galleryMain || evt.image || '';

    const previewImg = document.getElementById('edit-evt-photo-preview');
    if (previewImg) previewImg.src = evt.galleryMain || evt.image || 'images/kasadya_sa_diyandi.jpg';

    let formattedDate = evt.date || '';
    if (formattedDate && !/^\d{4}-\d{2}-\d{2}$/.test(formattedDate)) {
      const parsed = new Date(formattedDate);
      if (!isNaN(parsed.getTime())) {
        formattedDate = parsed.toISOString().slice(0, 10);
      }
    }
    const dateInput = document.getElementById('edit-evt-date');
    if (dateInput) dateInput.value = formattedDate;

    let timeVal = evt.time || '08:00';
    if (/AM|PM/i.test(timeVal)) {
      const parts = timeVal.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (parts) {
        let h = parseInt(parts[1]);
        const m = parts[2];
        const ampm = parts[3].toUpperCase();
        if (ampm === 'PM' && h < 12) h += 12;
        if (ampm === 'AM' && h === 12) h = 0;
        timeVal = `${String(h).padStart(2, '0')}:${m}`;
      }
    }
    const timeInput = document.getElementById('edit-evt-time');
    if (timeInput) timeInput.value = timeVal;

    const priceInput = document.getElementById('edit-evt-price');
    if (priceInput) priceInput.value = evt.price !== undefined ? evt.price : 0;

    const slotsInput = document.getElementById('edit-evt-slots');
    if (slotsInput) slotsInput.value = evt.totalSlots || evt.spotsLeft || 200;

    const descInput = document.getElementById('edit-evt-desc');
    if (descInput) descInput.value = evt.description || '';

    const warningBox = document.getElementById('edit-evt-feedback-warning');
    if (warningBox) warningBox.style.display = 'none';

    this.openModal('modal-edit-event');
  }

  previewEditEventPhoto(url) {
    const previewImg = document.getElementById('edit-evt-photo-preview');
    if (previewImg && url.trim()) {
      previewImg.src = url.trim();
    }
  }

  async submitEditEvent(e) {
    if (e) e.preventDefault();

    const id = Number(document.getElementById('edit-evt-id')?.value);
    if (!id) return;

    const evt = this.events.find(ev => ev.id === id);
    if (!evt) return;

    const title = document.getElementById('edit-evt-title')?.value.trim();
    const cat = document.getElementById('edit-evt-cat')?.value || 'Festival';
    const venue = document.getElementById('edit-evt-venue')?.value.trim();
    const barangay = document.getElementById('edit-evt-brgy')?.value || 'Pala-o';
    const date = document.getElementById('edit-evt-date')?.value;
    const time = document.getElementById('edit-evt-time')?.value || '08:00';
    const price = parseFloat(document.getElementById('edit-evt-price')?.value) || 0;
    const slots = parseInt(document.getElementById('edit-evt-slots')?.value) || 200;
    const imgUrl = document.getElementById('edit-evt-image')?.value.trim() || evt.image;
    const desc = document.getElementById('edit-evt-desc')?.value.trim();

    if (!title || !venue || !date) {
      this.showToast({ title: 'Missing Fields', message: 'Please provide event title, venue, and date.', type: 'error' });
      return;
    }

    try {
      const resp = await fetch('api.php?action=update_event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          title,
          category: cat,
          venue_name: venue,
          barangay,
          event_date: date,
          event_time: time,
          price,
          total_slots: slots,
          image_url: imgUrl,
          description: desc,
          user_id: this.currentUser ? this.currentUser.id : 3
        })
      });
      const res = await resp.json();
      if (!res.success) {
        const warningBox = document.getElementById('edit-evt-feedback-warning');
        if (warningBox) {
          warningBox.style.display = 'block';
          warningBox.innerHTML = `⚠️ <strong>${res.message || 'Cannot update event'}:</strong> ${res.actionable_tip || ''}`;
        }
        this.showToast({ title: 'Update Error', message: res.message || 'Could not update event.', type: 'error' });
        return;
      }
    } catch (err) {
      console.warn('API update failed, updating client-side cache:', err);
    }

    evt.title = title;
    evt.category = cat;
    evt.month = this.formatMonth(date);
    evt.schedule = `${date} · ${time}`;
    evt.date = date;
    evt.time = time;
    evt.venue = venue;
    evt.location = `${venue}, Brgy. ${barangay}`;
    evt.address = `${venue}, Iligan City`;
    evt.route = `Brgy. ${barangay}`;
    evt.price = price;
    evt.totalSlots = slots;
    evt.spotsLeft = Math.max(0, slots - (evt.bookedAttendees || 0));
    evt.image = imgUrl;
    evt.galleryMain = imgUrl;
    evt.description = desc;
    evt.statusLabel = price === 0 ? 'Free admission' : `${evt.spotsLeft} places left`;

    this.closeModal('modal-edit-event');

    if (this.currentView === 'details' && this.selectedEvent && this.selectedEvent.id === id) {
      this.openEventDetails(id);
    }

    this.renderEventsGrid();
    this.renderDashboard();

    this.showToast({
      title: 'Event Updated!',
      message: `"${title}" has been successfully updated.`,
      type: 'success'
    });
  }

  async toggleFeaturedEvent(id) {
    const evt = this.events.find(e => e.id === Number(id));
    if (!evt) return;

    try {
      await fetch('api.php?action=toggle_featured', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
    } catch (e) {}

    evt.is_featured = evt.is_featured ? 0 : 1;
    this.renderEventsGrid();
    this.renderDashboard();

    this.showToast({
      title: 'Featured Status Updated',
      message: `"${evt.title}" is now ${evt.is_featured ? 'featured on the discovery showcase' : 'unfeatured'}.`,
      type: 'success'
    });
  }

  openHeroBannerModal() {
    this.openModal('modal-hero-banner');
  }

  async submitHeroBannerUpdate(e) {
    if (e) e.preventDefault();
    const bannerUrl = document.getElementById('hero-banner-url-input')?.value.trim();
    const heroTitle = document.getElementById('hero-title-input')?.value.trim();
    const heroSubtitle = document.getElementById('hero-subtitle-input')?.value.trim();

    if (bannerUrl) {
      const activeSlide = document.querySelector('.hero-carousel-slide.active') || document.querySelector('.hero-carousel-slide');
      if (activeSlide) {
        activeSlide.style.backgroundImage = `url('${bannerUrl}')`;
      }
    }

    if (heroTitle) {
      const hTitle = document.getElementById('hero-headline-text');
      if (hTitle) hTitle.innerHTML = heroTitle.replace(/\n/g, '<br/>');
    }

    if (heroSubtitle) {
      const hSub = document.getElementById('hero-subtitle-text');
      if (hSub) hSub.textContent = heroSubtitle;
    }

    try {
      await fetch('api.php?action=update_hero_banner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hero_banner_image: bannerUrl,
          hero_title: heroTitle,
          hero_subtitle: heroSubtitle
        })
      });
    } catch (err) {}

    this.closeModal('modal-hero-banner');
    this.showToast({
      title: 'Hero Banner Updated',
      message: 'New hero presentation applied successfully.',
      type: 'success'
    });
  }

  setDashboardTab(tab) {
    const bView = document.getElementById('dash-tab-bookings-view');
    const eView = document.getElementById('dash-tab-events-view');
    const bNav = document.getElementById('dash-nav-bookings-btn');
    const eNav = document.getElementById('dash-nav-events-btn');

    document.querySelectorAll('.dash-sidebar-nav-item').forEach(el => el.classList.remove('active'));

    if (tab === 'events') {
      if (bView) bView.style.display = 'none';
      if (eView) eView.style.display = 'block';
      if (eNav) eNav.classList.add('active');
      this.renderDashboardEventsTable();
    } else {
      if (bView) bView.style.display = 'block';
      if (eView) eView.style.display = 'none';
      if (bNav) bNav.classList.add('active');
      this.renderDashboardTable();
    }
  }

  toggleTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    try {
      localStorage.setItem('iligan_theme', this.theme);
    } catch (e) {}
    this.applyTheme(this.theme);
    this.showToast({
      title: this.theme === 'dark' ? 'Dark Mode Enabled' : 'Light Mode Enabled',
      message: this.theme === 'dark' ? 'Switched to night theme.' : 'Switched to daytime theme.',
      type: 'info'
    });
  }

  applyTheme(theme) {
    this.theme = theme;
    const isDark = (theme === 'dark');
    document.body.classList.toggle('dark-theme', isDark);
    document.documentElement.classList.toggle('dark-theme', isDark);

    document.querySelectorAll('.theme-toggle-label').forEach(label => {
      label.textContent = isDark ? 'Light' : 'Dark';
    });
  }

  filterDashboardStatus(status) {
    this.dashboardStatusFilter = status;
    document.querySelectorAll('.status-tabs .status-tab, .status-tabs .status-tab2').forEach(t => {
      const s = t.getAttribute('data-status');
      if (s === status) {
        t.classList.add('active');
      } else {
        t.classList.remove('active');
      }
    });
    this.renderDashboardTable();
  }

  handleDashboardSearch(val) {
    this.dashboardSearch = val.trim().toLowerCase();
    this.renderDashboardTable();
  }

  handleDashboardEventFilter(val) {
    this.dashboardEventFilter = val.trim().toLowerCase();
    this.renderDashboardTable();
  }

  renderDashboard() {
    const totalBookings = this.bookings.length;
    const totalAttendees = this.bookings.reduce((sum, b) => sum + (b.ticketsCount || b.tickets_count || 1), 0);
    const totalRevenue = this.bookings.reduce((sum, b) => sum + (b.status !== 'cancelled' ? (b.totalNum || 0) : 0), 0);
    const pendingCount = this.bookings.filter(b => b.status === 'pending').length;

    const bEl = document.getElementById('dash-metric-bookings');
    if (bEl) bEl.textContent = totalBookings;
    const aEl = document.getElementById('dash-metric-attendees');
    if (aEl) aEl.textContent = totalAttendees;
    const rEl = document.getElementById('dash-metric-revenue');
    if (rEl) rEl.textContent = `₱${totalRevenue.toLocaleString()}`;
    const pEl = document.getElementById('dash-metric-pending');
    if (pEl) pEl.textContent = pendingCount;

    const tAll = document.getElementById('dash-tab-all-lbl');
    if (tAll) tAll.textContent = `All bookings ${totalBookings}`;
    const tConf = document.getElementById('dash-tab-conf-lbl');
    if (tConf) tConf.textContent = `Confirmed ${this.bookings.filter(b => b.status === 'confirmed').length}`;
    const tPend = document.getElementById('dash-tab-pend-lbl');
    if (tPend) tPend.textContent = `Pending ${pendingCount}`;
    const tCanc = document.getElementById('dash-tab-canc-lbl');
    if (tCanc) tCanc.textContent = `Cancelled ${this.bookings.filter(b => b.status === 'cancelled').length}`;

    this.renderDashboardTable();
    this.renderDashboardEventsTable();
  }

  renderDashboardTable() {
    const container = document.getElementById('dash-bookings-table-rows');
    if (!container) return;

    const filtered = this.bookings.filter(b => {
      if (this.dashboardStatusFilter !== 'all' && b.status !== this.dashboardStatusFilter) return false;
      if (this.dashboardSearch) {
        const name = (b.guestName || b.attendee_name || '').toLowerCase();
        const email = (b.guestEmail || b.attendee_email || '').toLowerCase();
        const ref = (b.reference || b.booking_reference || '').toLowerCase();
        if (!name.includes(this.dashboardSearch) && !email.includes(this.dashboardSearch) && !ref.includes(this.dashboardSearch)) return false;
      }
      if (this.dashboardEventFilter) {
        if (!(b.eventTitle || '').toLowerCase().includes(this.dashboardEventFilter)) return false;
      }
      return true;
    });

    container.innerHTML = '';

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="padding:32px;text-align:center;color:#4B5563;font-size:14px;background:#FFFFFF;border:1px solid #E5E7EB;">
          No bookings match the filter criteria.
        </div>
      `;
      return;
    }

    filtered.forEach((b, idx) => {
      const rowDiv = document.createElement('div');
      rowDiv.className = idx === 0 ? 'booking-record' : 'booking-record2';

      let statusPillClass = 'status2';
      let statusLabel = 'Confirmed';
      if (b.status === 'pending') {
        statusPillClass = 'status';
        statusLabel = 'Pending';
      } else if (b.status === 'cancelled') {
        statusPillClass = 'status3';
        statusLabel = 'Cancelled';
      }

      rowDiv.innerHTML = `
        <div class="guest-details">
          <div class="name">${b.guestName || b.attendee_name}</div>
          <div class="contact">${b.guestEmail || b.attendee_email} · ${b.guestPhone || b.attendee_phone || 'N/A'}</div>
        </div>
        <div class="event-details">
          <div class="title">${b.eventTitle || b.event_title || 'Community Event'}</div>
          <div class="category">${b.eventCategory || b.category || 'Community'} · ${b.eventDate || b.event_date || ''}</div>
        </div>
        <div class="tickets">
          <div class="quantity">${b.ticketsCount || b.tickets_count} tickets</div>
          <div class="amount">${b.totalFormatted || b.formatted_price}</div>
        </div>
        <div class="status">
          <div class="${statusPillClass}">
            <div class="label4">${statusLabel}</div>
          </div>
        </div>
        <div class="reference">
          <div class="reference-code">${b.reference || b.booking_reference}</div>
        </div>
        <div class="actions">
          <div class="view-action" onclick="window.openBookingPass('${b.reference || b.booking_reference}')" style="cursor:pointer;">
            <div class="label5">View Pass</div>
          </div>
        </div>
      `;
      container.appendChild(rowDiv);
    });
  }

  renderDashboardEventsTable() {
    const container = document.getElementById('dash-events-table-rows');
    if (!container) return;

    container.innerHTML = '';

    this.events.forEach((evt, idx) => {
      const row = document.createElement('div');
      row.style.cssText = 'display:grid;grid-template-columns:2fr 1fr 1fr 1fr 1fr 2fr;align-items:center;padding:16px 24px;border-bottom:1px solid #E5E7EB;background:#FFFFFF;font-size:14px;gap:12px;';

      const featBtnText = evt.is_featured ? '⭐ Featured' : '☆ Feature';
      const featBtnColor = evt.is_featured ? '#D97706' : '#4B5563';

      row.innerHTML = `
        <div>
          <div style="font-weight:700;color:#1E3A8A;">${evt.title}</div>
          <div style="font-size:12px;color:#6B7280;">${evt.venue}</div>
        </div>
        <div><span style="background:#EFF6FF;color:#1E3A8A;padding:4px 8px;border-radius:4px;font-size:12px;font-weight:600;">${evt.category}</span></div>
        <div style="color:#1F2937;">${evt.date}</div>
        <div style="font-weight:600;">${evt.spotsLeft} / ${evt.totalSlots}</div>
        <div>
          <button type="button" style="background:none;border:1px solid ${featBtnColor};color:${featBtnColor};padding:4px 8px;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;" onclick="window.toggleFeaturedEvent(${evt.id})">${featBtnText}</button>
        </div>
        <div style="display:flex;gap:8px;justify-content:flex-end;">
          <button type="button" class="btn-card-details" style="height:34px;padding:0 12px;font-size:12px;" onclick="window.openEventDetails(${evt.id})">View</button>
          <button type="button" style="height:34px;padding:0 12px;font-size:12px;background:#EFF6FF;color:#1E3A8A;border:1px solid #93C5FD;border-radius:6px;font-weight:600;cursor:pointer;" onclick="window.openEditEventModal(${evt.id})">Edit</button>
          <button type="button" class="btn-danger-confirm" style="height:34px;padding:0 12px;font-size:12px;" onclick="window.promptDeleteEvent(${evt.id}, '${evt.title.replace(/'/g, "\\'")}')">Delete</button>
        </div>
      `;
      container.appendChild(row);
    });
  }

  exportBookingsCSV() {
    const headers = ['Reference', 'Guest Name', 'Email', 'Phone', 'Event', 'Date', 'Tickets', 'Total', 'Status'];
    const rows = this.bookings.map(b => [
      `"${b.reference || b.booking_reference}"`,
      `"${b.guestName || b.attendee_name}"`,
      `"${b.guestEmail || b.attendee_email}"`,
      `"${b.guestPhone || b.attendee_phone || ''}"`,
      `"${b.eventTitle}"`,
      `"${b.eventDate}"`,
      b.ticketsCount || b.tickets_count,
      `"${b.totalFormatted || b.formatted_price}"`,
      `"${b.status}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `Iligan_Portal_Bookings_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.showToast({ title: 'Export Complete', message: 'Bookings spreadsheet downloaded.', type: 'success' });
  }

  openHelpModal() {
    this.openModal('modal-help-team');
  }

  submitVisitorQuestion(e) {
    if (e) e.preventDefault();
    this.closeModal('modal-help-team');
    this.showToast({
      title: 'Message Received',
      message: 'Thank you! The Iligan City Community Desk will get back to you shortly.',
      type: 'success'
    });
  }

  shareEvent() {
    if (navigator.share && this.selectedEvent) {
      navigator.share({
        title: this.selectedEvent.title,
        text: `Join ${this.selectedEvent.title} in Iligan City!`,
        url: window.location.href
      }).catch(() => {});
    } else {
      this.showToast({ title: 'Link Copied', message: 'Event link copied to your clipboard.', type: 'success' });
    }
  }

  printPass() {
    window.print();
  }

  openModal(modalId) {
    const el = document.getElementById(modalId);
    if (el) el.classList.add('open');
  }

  closeModal(modalId) {
    const el = document.getElementById(modalId);
    if (el) el.classList.remove('open');
  }

  showToast({ title, message, type = 'info', duration = 3500 }) {
    let container = document.getElementById('ald-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'ald-toast-container';
      container.className = 'ald-toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `ald-toast ${type}`;
    toast.innerHTML = `
      <div style="flex:1;">
        <div style="font-weight:700;margin-bottom:2px;">${title}</div>
        <div style="font-size:13px;opacity:0.95;">${message}</div>
      </div>
      <span style="cursor:pointer;font-size:16px;margin-left:8px;font-weight:bold;" onclick="this.parentElement.remove()">&times;</span>
    `;
    container.appendChild(toast);
    setTimeout(() => { if (toast.parentNode) toast.parentNode.removeChild(toast); }, duration);
  }

  showConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const colors = ['#1E3A8A', '#D97706', '#16A34A', '#2563EB', '#F59E0B', '#DC2626'];
    const dots = [];
    for (let i = 0; i < 70; i++) {
      dots.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 200,
        y: canvas.height / 3 + (Math.random() - 0.5) * 50,
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 1) * 14,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        spin: (Math.random() - 0.5) * 10
      });
    }
    const start = Date.now();
    function draw() {
      const elapsed = Date.now() - start;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dots.forEach(d => {
        d.x += d.vx; d.y += d.vy; d.vy += 0.35; d.vx *= 0.98;
        d.rotation += d.spin;
        ctx.save();
        ctx.translate(d.x, d.y);
        ctx.rotate((d.rotation * Math.PI) / 180);
        ctx.fillStyle = d.color;
        ctx.fillRect(-d.size / 2, -d.size / 2, d.size, d.size * 0.6);
        ctx.restore();
      });
      if (elapsed < 2400) {
        requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    draw();
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.Portal = new IliganEventsApp();

  window.switchView = (v) => window.Portal.switchView(v);
  window.filterCategory = (c) => window.Portal.filterCategory(c);
  window.showWhatsOnNav = () => window.Portal.showWhatsOnNav();
  window.showAllEventsNav = () => window.Portal.showAllEventsNav();
  window.handleSearch = (q) => window.Portal.handleSearch(q);
  window.handleDateSelect = (d) => window.Portal.handleDateSelect(d);
  window.handleSort = (s) => window.Portal.handleSort(s);
  window.applySearchFilter = () => window.Portal.applySearchFilter();
  window.setEventsPage = (p) => window.Portal.setEventsPage(p);
  window.scrollToUpcoming = () => window.Portal.scrollToUpcoming();
  window.openEventDetails = (id) => window.Portal.openEventDetails(id);
  window.openCheckout = () => window.Portal.openCheckout();
  window.openCheckoutForEvent = (id) => window.Portal.openCheckoutForEvent(id);
  window.stepTicket = (type, d) => window.Portal.stepTicket(type, d);
  window.submitBooking = () => window.Portal.submitBooking();
  window.openMyBookingsModal = () => window.Portal.openMyBookingsModal();
  window.handleMyBookingsClick = () => window.Portal.handleMyBookingsClick();
  window.openBookingPass = (ref) => window.Portal.openBookingPass(ref);
  window.printPass = () => window.Portal.printPass();
  window.promptCancelBooking = (id, ref, title) => window.Portal.promptCancelBooking(id, ref, title);
  window.confirmCancelBooking = () => window.Portal.confirmCancelBooking();
  window.promptDeleteEvent = (id, title) => window.Portal.promptDeleteEvent(id, title);
  window.confirmDeleteEvent = () => window.Portal.confirmDeleteEvent();
  window.openLoginModal = (tab) => window.Portal.openLoginModal(tab);
  window.switchLoginTab = (tab) => window.Portal.switchLoginTab(tab);
  window.demoLogin = (role) => window.Portal.demoLogin(role);
  window.submitLogin = (e) => window.Portal.submitLogin(e);
  window.submitRegister = (e) => window.Portal.submitRegister(e);
  window.toggleCoordinatorKeyField = (r) => window.Portal.toggleCoordinatorKeyField(r);
  window.handleLogout = () => window.Portal.handleLogout();
  window.logout = () => window.Portal.handleLogout();
  window.promptLogout = () => window.Portal.promptLogout();
  window.confirmLogout = () => window.Portal.confirmLogout();
  window.openProfileModal = () => window.Portal.openProfileModal();
  window.submitUpdateProfile = (e) => window.Portal.submitUpdateProfile(e);
  window.openAddEventModal = () => window.Portal.openAddEventModal();
  window.checkDuplicateEventTitle = (t) => window.Portal.checkDuplicateEventTitle(t);
  window.submitAddEvent = (e) => window.Portal.submitAddEvent(e);
  window.openEditEventModal = (id) => window.Portal.openEditEventModal(id);
  window.previewEditEventPhoto = (url) => window.Portal.previewEditEventPhoto(url);
  window.submitEditEvent = (e) => window.Portal.submitEditEvent(e);
  window.toggleFeaturedEvent = (id) => window.Portal.toggleFeaturedEvent(id);
  window.openHeroBannerModal = () => window.Portal.openHeroBannerModal();
  window.submitHeroBannerUpdate = (e) => window.Portal.submitHeroBannerUpdate(e);
  window.setDashboardTab = (t) => window.Portal.setDashboardTab(t);
  window.filterDashboardStatus = (s) => window.Portal.filterDashboardStatus(s);
  window.handleDashboardSearch = (q) => window.Portal.handleDashboardSearch(q);
  window.handleDashboardEventFilter = (e) => window.Portal.handleDashboardEventFilter(e);
  window.exportBookingsCSV = () => window.Portal.exportBookingsCSV();
  window.openHelpModal = () => window.Portal.openHelpModal();
  window.submitVisitorQuestion = (e) => window.Portal.submitVisitorQuestion(e);
  window.shareEvent = () => window.Portal.shareEvent();
  window.openModal = (id) => window.Portal.openModal(id);
  window.closeModal = (id) => window.Portal.closeModal(id);
  window.showToast = (opts) => window.Portal.showToast(opts);
  window.nextHeroSlide = () => window.Portal.nextHeroSlide();
  window.prevHeroSlide = () => window.Portal.prevHeroSlide();
  window.goToHeroSlide = (idx) => window.Portal.goToHeroSlide(idx);
  window.toggleTheme = () => window.Portal.toggleTheme();
});
