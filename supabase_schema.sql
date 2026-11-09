-- ========================================================
-- Luke Smith Website & Shop: Supabase Database Schema
-- ========================================================

-- 1. Books Table (Amazon Books Showcase)
CREATE TABLE IF NOT EXISTS public.books (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    blurb TEXT NOT NULL,
    cover_url TEXT,
    amazon_url TEXT NOT NULL,
    rating NUMERIC(2, 1) DEFAULT 5.0,
    tag TEXT, -- 'Bestseller', 'Top Pick', 'Fan Favourite'
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Question-Cards Shop Table
CREATE TABLE IF NOT EXISTS public.question_cards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(6, 2) NOT NULL DEFAULT 12.99,
    card_count TEXT DEFAULT '52 cards',
    badge TEXT,
    image_url TEXT,
    gradient_colors TEXT,
    stripe_price_id TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Digital Downloads Table (Free & Paid)
CREATE TABLE IF NOT EXISTS public.digital_downloads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('free', 'paid')),
    format TEXT DEFAULT 'PDF',
    price NUMERIC(6, 2) DEFAULT 0.00,
    file_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Email Leads Table (Free Downloads)
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    resource_downloaded TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Private Talks Booking Enquiries Table
CREATE TABLE IF NOT EXISTS public.talk_enquiries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    organisation TEXT,
    event_date DATE,
    location TEXT,
    audience_size TEXT,
    topic TEXT,
    message TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'booked', 'archived')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================
-- Seed Initial Sample Data
-- ========================================================

INSERT INTO public.books (title, blurb, cover_url, amazon_url, rating, tag, display_order)
VALUES
('Offline', 'A powerful novel of escape, identity, and the price of disconnection in a hyper-connected world.', 'https://m.media-amazon.com/images/I/71jEl0twYcL._AC_UY400_.jpg', 'https://www.amazon.co.uk/dp/B0HBW8CBGG', 5.0, 'Bestseller', 1),
('Behind the Mirror', 'A deep psychological exploration of what we hide from the world — and what we hide from ourselves.', 'https://m.media-amazon.com/images/I/71kDQeo6LjL._AC_UY400_.jpg', 'https://www.amazon.co.uk/dp/B0HCKV8RWG', 5.0, 'New Release', 2),
('Behind the Feed', 'Uncovering the unspoken reality, pressures, and truth behind the curated digital lives we display.', 'https://m.media-amazon.com/images/I/71SrbTCw2gL._AC_UY400_.jpg', 'https://www.amazon.co.uk/dp/B0HBPJZRBN', 5.0, 'Popular', 3),
('The Weight We Carry', 'Understanding unseen emotional burdens, personal trauma, and discovering the path to resilience.', 'https://m.media-amazon.com/images/I/71+Ab3ozAxL._AC_UY400_.jpg', 'https://www.amazon.co.uk/dp/B0HC276GG7', 5.0, 'Top Pick', 4),
('Every Breath', 'A gripping exploration of life-altering choices, vulnerability, and the moments that define survival.', 'https://m.media-amazon.com/images/I/71AbgKu4KzL._AC_UY400_.jpg', 'https://www.amazon.co.uk/dp/B0HCL5XHFQ', 5.0, NULL, 5),
('By Association', 'Your circle can cost you everything. A piercing examination of influence, loyalty, and social circles.', 'https://m.media-amazon.com/images/I/71EaloKorTL._AC_UY400_.jpg', 'https://www.amazon.co.uk/dp/B0HC6PZ2W5', 5.0, 'Fan Favourite', 6),
('The Last Ride', 'An emotional, fast-paced journey confronting past mistakes, second chances, and redemption.', 'https://m.media-amazon.com/images/I/81ZrzXaMTTL._AC_UY400_.jpg', 'https://www.amazon.co.uk/dp/B0HB9VFMC5', 5.0, NULL, 7),
('Carrying', 'An honest look at what we inherit, what burdens we shoulder, and how we choose what to let go.', 'https://m.media-amazon.com/images/I/71WJXKCV19L._AC_UY400_.jpg', 'https://www.amazon.co.uk/dp/B0GYQ6W419', 5.0, NULL, 8),
('Shared', 'Examining the deep bonds of shared human struggle, community empathy, and shared journeys.', 'https://m.media-amazon.com/images/I/7190F09KyyL._AC_UY400_.jpg', 'https://www.amazon.co.uk/dp/B0HBN4V47M', 5.0, NULL, 9),
('Lines We Cross', 'One choice, one life changed forever. How single decisions ripple across families and futures.', 'https://m.media-amazon.com/images/I/71uFAWCEUyL._AC_UY400_.jpg', 'https://www.amazon.co.uk/dp/B0HBXDP7TP', 5.0, NULL, 10),
('One More Balloon', 'A moving narrative touching on memory, celebration, grief, and the beauty of human fragility.', 'https://m.media-amazon.com/images/I/71OtiyossFL._AC_UY400_.jpg', 'https://www.amazon.co.uk/dp/B0HC41S7BZ', 5.0, NULL, 11),
('LaToya''s Heart', 'A story of unconditional love, resilience, and finding unshakeable strength in moments of heartbreak.', 'https://m.media-amazon.com/images/I/61YS-Uip2QL._AC_UY400_.jpg', 'https://www.amazon.co.uk/dp/B0H9YPCT28', 5.0, NULL, 12),
('Bridges Between Us', 'Bridging societal and personal divides through genuine listening, understanding, and curiosity.', 'https://m.media-amazon.com/images/I/61-jRjDYVkL._AC_UY400_.jpg', 'https://www.amazon.co.uk/dp/B0HBMPV3MC', 5.0, NULL, 13),
('Joyride', 'Rethinking danger, excitement, and consequences through the perspective of youth and growth.', 'https://m.media-amazon.com/images/I/71-XL4XfglL._AC_UY400_.jpg', 'https://www.amazon.co.uk/dp/B0HCKWMLXP', 5.0, NULL, 14),
('Signs in Silence', 'Listening to what is left unsaid. Understanding warning signs, emotional cries, and silent screams.', 'https://m.media-amazon.com/images/I/716e6Kz6vxL._AC_UY400_.jpg', 'https://www.amazon.co.uk/dp/B0H6NJGVHX', 5.0, 'Must Read', 15),
('Manifesting Money To Live Your Best Life', 'Mindset shifts and practical habits to break financial scarcity and cultivate lasting abundance.', 'https://m.media-amazon.com/images/I/81sq-OuVWUL._AC_UY400_.jpg', 'https://www.amazon.co.uk/dp/B0B2V267TK', 5.0, NULL, 16);

INSERT INTO public.question_cards (name, description, price, card_count, gradient_colors)
VALUES
('Deep Reflection Cards', '52 beautifully designed cards with thought-provoking questions to spark self-discovery and meaningful conversations.', 12.99, '52 cards', 'from-purple-600 to-indigo-700'),
('Team Connection Deck', 'Build psychological safety and trust in your team with conversation-starting questions designed for the workplace.', 12.99, '40 cards', 'from-teal-500 to-emerald-700'),
('Leadership Challenge Cards', 'Powerful prompts for leaders who want to challenge their assumptions and grow through intentional reflection.', 12.99, '48 cards', 'from-orange-500 to-red-600'),
('Couples'' Connection Cards', 'Deepen intimacy and understanding in relationships with gentle, open-ended questions that invite honest sharing.', 12.99, '44 cards', 'from-rose-500 to-pink-700'),
('Family Conversations Deck', 'From dinner table chats to road-trip games — 50 prompts that bring families closer through genuine dialogue.', 12.99, '50 cards', 'from-amber-500 to-yellow-600'),
('Personal Growth Cards', 'A daily practice tool for those committed to continuous self-improvement and living with greater intention.', 12.99, '60 cards', 'from-sky-500 to-blue-700');
