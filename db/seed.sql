-- Zezze Athletics — starter content
-- Edit freely; this just gets the site launch-ready with real copy.

INSERT INTO services (slug, name, short_desc, long_desc, duration_min, price_cents, price_label, sort_order) VALUES
('sports-performance', 'Sports Performance Training', 'Speed, power, and explosiveness for competitive athletes.',
 'Built for athletes who want to move faster, jump higher, and hold up over a full season. Sessions blend speed mechanics, power development, and sport-specific conditioning, programmed around your competition calendar.',
 60, NULL, 'From $65 / session', 1),

('strength-conditioning', 'Strength & Conditioning', 'Build a stronger, more resilient base year-round.',
 'Foundational strength work for athletes and everyday clients alike. We program progressive lifting, conditioning, and mobility work so you get stronger without breaking down.',
 60, NULL, 'From $60 / session', 2),

('injury-prevention', 'Injury Prevention & Recovery', 'Move well, stay on the field, and train through old limitations.',
 'A movement-first approach for clients returning from injury or looking to stay ahead of one. We assess how you move, correct the gaps, and build a plan that keeps you training consistently.',
 45, NULL, 'From $55 / session', 3),

('one-on-one', '1-on-1 Personal Training', 'Fully individualized coaching, every session.',
 'One coach, one athlete, one plan. Every session is built around your goals, your schedule, and where you are today — no generic programming.',
 60, NULL, 'From $70 / session', 4),

('free-consult', 'Free Movement Consult', 'Not sure where to start? Come in and find out.',
 'A no-cost, no-pressure walkthrough of the space, a quick movement assessment, and a conversation about your goals. This is how most new clients start.',
 30, 0, 'Free', 5)
ON CONFLICT (slug) DO NOTHING;

-- Default hours: Mon–Fri 6am–8pm, Sat 8am–1pm (edit to match actual coaching hours)
INSERT INTO availability_rules (day_of_week, start_time, end_time) VALUES
(1, '06:00', '20:00'),
(2, '06:00', '20:00'),
(3, '06:00', '20:00'),
(4, '06:00', '20:00'),
(5, '06:00', '20:00'),
(6, '08:00', '13:00')
ON CONFLICT DO NOTHING;

INSERT INTO products (slug, name, description, price_cents, image_path, sizes, sort_order) VALUES
('zezze-tee', 'Zezze Athletics Tee', 'Heavyweight cotton training tee with the Zezze Athletics wordmark.', 2800, '/images/merch/tee.jpg', 'S,M,L,XL,XXL', 1),
('zezze-hoodie', 'Zezze Athletics Hoodie', 'Midweight fleece hoodie for the walk to and from the gym.', 5200, '/images/merch/hoodie.jpg', 'S,M,L,XL,XXL', 2),
('zezze-hat', 'Zezze Athletics Hat', 'Structured six-panel cap, adjustable strap.', 2400, '/images/merch/hat.jpg', NULL, 3),
('zezze-bottle', 'Zezze Athletics Bottle', '32oz stainless steel training bottle.', 2200, '/images/merch/bottle.jpg', NULL, 4)
ON CONFLICT (slug) DO NOTHING;
