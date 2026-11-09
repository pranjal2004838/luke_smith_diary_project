# MASTER LOVABLE SPECIFICATION & PRODUCTION PROMPT

Create a world-class, ultra-polished, fully responsive, and completely functional personal brand and e-commerce web application for **Luke Smith** — acclaimed Author, Keynote & TEDx Speaker, and Creator of Question-Card sets & conversation tools.

The application must be completely turnkey: every button, modal, cart system, filter, interactive card-draw simulation, email capture flow, and speaking enquiry form must be 100% interactive and functional with rich micro-animations, zero dead clicks, and zero broken UI states.

---

### 🎨 DESIGN SYSTEM & ART DIRECTION
* **Aesthetic**: Premium, editorial, British literary & high-impact keynote speaker. Think *MasterClass* meets *Penguin Classics* and *Monocle*.
* **Color Palette**:
  - `brand-navy-950`: `#0b0f19` (Deep obsidian navy)
  - `brand-navy-900`: `#111827` (Rich midnight navy - primary surface)
  - `brand-navy-800`: `#1e293b` (Card & modal background)
  - `brand-gold-500`: `#f59e0b` (Warm luminous gold - primary accent & CTAs)
  - `brand-gold-600`: `#d97706` (Deep amber gold - hover states)
  - `brand-parchment`: `#fbfaf8` (Warm off-white for light contrast cards)
  - `brand-muted`: `#94a3b8` (Refined slate gray for secondary typography)
* **Typography**:
  - Display/Headings: `Playfair Display` or `Cormorant Garamond` (editorial, high-trust serif)
  - Body & UI: `Plus Jakarta Sans` or `Inter` (crisp, modern, readable sans-serif)
* **Shadows & Accents**: Subtle gold glow halos (`box-shadow: 0 0 25px rgba(245, 158, 11, 0.15)`), glassmorphism cards (`backdrop-blur-md bg-white/5 border border-white/10`), rounded corners (`rounded-2xl`).

---

### 🏛️ ARCHITECTURE & SECTIONS

#### 1. Sticky Navigation Bar
* **Branding**: "LUKE SMITH" with refined subtitle "Author & Speaker" and an elegant gold quill/spark icon.
* **Navigation Links**:
  - Books
  - Question Cards (Shop)
  - Interactive Card Demo
  - Downloads & Guides
  - Speaking & Videos
  - About Luke
* **Cart Indicator**: Floating badge showing real-time item count with a slide-out drawer on click.
* **Header CTA Button**: High-contrast gold button "Book a Talk" linking smoothly to the enquiry form.
* **Mobile Drawer**: Animated hamburger slide-over menu with full navigation, social icons, and quick-call button.

---

#### 2. Editorial Hero Section
* **Badge**: Pill badge with pulsing gold dot: "✨ TEDx Speaker • Author of 12+ Books • 50,000+ Readers".
* **Main Headline**: "Challenge Your Assumptions. Spark Deeper Conversations. Grow With Purpose."
* **Sub-headline**: "Luke Smith builds tools, writes books, and delivers transformative keynotes that help leaders, teams, and individuals break through communication barriers and master intentional dialogue."
* **Dual Action CTAs**:
  - Primary CTA: "Explore Question Cards & Books" (smooth scroll to Shop with hover arrow slide).
  - Secondary CTA: "Book Luke for Keynotes" (opens the Speaking Enquiry section).
* **Prestige Metrics Grid (Animated Stat Counters)**:
  - `12+` Books Published Worldwide
  - `200+` Keynote Talks Delivered
  - `50k+` Community & Readers
  - `4.9 ★` Average Reader & Event Rating

---

#### 3. Interactive Question-Card Sets & E-Commerce Shop
* **Category Filter Pills**: "All Decks", "Leadership & Teams", "Self-Reflection", "Couples & Relationships".
* **6 Fully Realized Products**:
  1. *Deep Reflection Cards* — 52 questions to spark self-discovery and introspective clarity (£12.99).
  2. *Team Connection Deck* — 40 prompts to build radical trust and psychological safety in the workplace (£12.99).
  3. *Leadership Challenge Cards* — 48 provocative questions for executives and emerging leaders (£14.99).
  4. *Couples' Intimacy & Dialogue Deck* — 44 questions designed to deepen closeness and open-hearted talk (£12.99).
  5. *Family Dinner Conversations* — 50 engaging prompts for cross-generational connection (£11.99).
  6. *The Daily Purpose Prompt Deck* — 60 morning mindfulness and clarity questions (£13.99).
* **Card UI Elements**:
  - Vibrant gradient spine covers with realistic soft shadow.
  - Card count pill badge (e.g., "52 Cards | Gold-Foil Finish").
  - Star ratings (`5.0 ★ (120+ reviews)`).
  - **"Try a Sample Card" button**: Launches the Interactive Card Draw modal.
  - **"Add to Basket" button**: Animates and updates the cart badge.
* **Interactive Feature — "Draw a Question Card" Modal**:
  - Visitors can click any deck to draw an actual random question card.
  - Realistic 3D card-flip animation revealing questions such as:
    *"What is a belief you held five years ago that you have completely changed your mind about?"*
    *"What conversation are you avoiding right now that could change everything?"*
  - Includes a "Draw Another" button and a direct "Buy This Deck" checkout trigger.
* **Complete Slide-Out Cart Drawer**:
  - Displays selected items, deck images, quantity adjusters (`+` / `-`), and delete button.
  - Order subtotal calculation, tax breakdown, and simulated free shipping progress bar ("Add £10 more for free UK shipping!").
  - Prominent "Proceed to Checkout" button that triggers a polished order confirmation simulation modal with order ID and confirmation summary.

---

#### 4. Published Books Showcase (Amazon Integration)
* **Section Heading**: "Books That Challenge and Transform"
* **6 Books Featured**:
  1. *The Art of Deep Questions: How to Ask What Truly Matters* (Tag: "Bestseller")
  2. *Reflect & Rise: Daily Frameworks for Mental Clarity* (Tag: "Editor's Choice")
  3. *The Mindful Leader: Steering Teams with Emotional Agility* (Tag: "Trending")
  4. *Conversations That Count: The Guide to High-Stakes Dialogue*
  5. *Grow Through It: Turning Crisis into Lifelong Resilience*
  6. *Quiet Strength: The Introvert's Blueprint for Influence*
* **Book Card Features**:
  - Realistic book mockup format with embossed look.
  - Synopsis blurb, reader testimonials, and page count.
  - "Buy on Amazon UK" button (opens in new tab) + "Buy on Amazon US" toggle.
  - "Read Sample Chapter (PDF)" download trigger.

---

#### 5. Digital Downloads Hub (Lead Capture & Paid Workbooks)
* **Tabbed Interface**: "Free Toolkits & Guides" vs "Comprehensive Masterclass Workbooks"
* **Free Gated Toolkits**:
  - *The 10-Question Leadership Audit (PDF)*
  - *Daily Evening Reflection Journal Template (Notion & PDF)*
  - *Difficult Conversations Playbook (PDF)*
* **Lead Capture Flow**:
  - Clicking "Free Download" triggers a sleek modal asking for First Name, Work Email, and Primary Goal.
  - Real-time email format validation.
  - On submit: Instant confetti animation, direct download link trigger, and confirmation message: "Your guide is on its way to your inbox!"
* **Paid Digital Workbooks**:
  - *30-Day Guided Question Protocol (£9.99)*
  - *The Complete Executive Facilitator's Workbook (£19.99)*
  - Instant Add to Basket / Stripe checkout flow.

---

#### 6. Keynote Talks, Workshops & Video Showcase
* **Speaking Headline**: "Keynotes That Leave Audiences Rethinking Everything"
* **Talk Topics Grid**:
  - *Topic 1: The Courage to Ask: Transforming Corporate Culture Through Dialogue*
  - *Topic 2: Psychological Safety in Remote & Hybrid Teams*
  - *Topic 3: Purpose-Driven Leadership in an Uncertain World*
* **Video Media Section**:
  - Responsive 2-column video player layout with custom play buttons and thumbnail previews.
  - Video 1: "TEDx Keynote: Why The Best Leaders Ask The Worst Questions" (Video overlay modal with simulated playback).
  - Video 2: "Keynote at Global Leadership Forum: The Conversation Architecture".
* **Audience Credibility Row**: Logos of past clients, universities, and conferences (e.g., FTSE 100 summits, leadership retreats, corporate seminars).

---

#### 7. Speaking & Keynote Booking Enquiry System
* **Header**: "Invite Luke to Speak at Your Next Event"
* **Interactive Booking Form**:
  - Full Name & Job Title
  - Organization / Company Name
  - Work Email Address (validated)
  - Event Date (date picker with past-date prevention)
  - Event Location (City, Country or "Virtual / Online")
  - Event Format: Keynote (45-60 min), Half-Day Workshop, Multi-Day Retreat, Fireside Chat
  - Expected Audience Size: `<50`, `50-200`, `200-500`, `500+`
  - Approximate Budget Range Dropdown
  - Message & Goals for the Talk (with live character counter)
* **Validation & UX**:
  - Inline error states for empty or invalid fields.
  - Submission state with loading spinner & disabled submit button.
  - Success confirmation card: "Thank you! Luke's speaking management team will review your inquiry and respond within 24 business hours."

---

#### 8. Testimonials & Social Proof Carousel
* **3 Categories**: Event Organizers, Readers, Workshop Attendees.
* Carousel with auto-play, manual pause, previous/next controls, and pagination dots.
* Cards include: Headshot avatar, full quote, speaker/organizer name, title, and organization.

---

#### 9. Newsletter & Footer
* **"The Sunday Spark" Newsletter Signup**:
  - "Join 25,000+ readers receiving one profound question and one leadership reflection every Sunday morning."
  - Email input + "Subscribe Free" button with celebratory toast alert.
* **Footer Columns**:
  - Column 1: Luke Smith bio, brand mission, and copyright notice.
  - Column 2: Navigation Links (Books, Cards, Speaking, Free Downloads).
  - Column 3: Legal & Privacy (Privacy Policy, Terms of Service, Cookie Policy).
  - Column 4: Social handles (LinkedIn, X / Twitter, YouTube, Instagram) with hover glow effects.

---

### ⚡ TECHNICAL REQUIREMENTS
* **Framework**: React with TypeScript + Tailwind CSS.
* **Icons**: `lucide-react` for clean, consistent iconography throughout.
* **State Management**: React `useState` and `useEffect` for Cart Drawer, Card Flip Simulator, Filter Tabs, Email Capture Modal, and Form Submissions.
* **Animation & Polish**: Tailwind transitions, hover micro-interactions, smooth scrolling behavior, and active focus rings for accessibility.
