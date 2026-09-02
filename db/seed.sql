-- Seed data — idempotent. Only inserts when the table is empty.

-- Products -----------------------------------------------------------------
insert into products (name, category, price, description, image, featured, in_stock, created_at)
select * from (values
  ('Signature Wardrobe Audit', 'Wardrobe Consulting', 850,
   'A full assessment of your existing wardrobe with a tailored edit, gap analysis, and a season-ready styling plan built around your lifestyle.',
   'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&q=80&auto=format&fit=crop', true, true, now() - interval '9 days'),
  ('Bespoke Evening Piece', 'Clothing Design', 2400,
   'Custom-designed occasion wear developed from concept sketches to final fitting, cut to your measurements and personal aesthetic.',
   'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=900&q=80&auto=format&fit=crop', true, true, now() - interval '7 days'),
  ('Executive Image Package', 'Style Package', 1600,
   'Image and style consulting for leaders and public-facing professionals: colour analysis, silhouette guidance, and a curated shopping list.',
   'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&q=80&auto=format&fit=crop', true, true, now() - interval '5 days'),
  ('Capsule Collection Concept', 'Clothing Design', 3200,
   'A cohesive 12-piece capsule wardrobe designed and specified for production, including fabric direction and a full tech pack.',
   'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=900&q=80&auto=format&fit=crop', false, true, now() - interval '3 days'),
  ('Engineering Project Review', 'Engineering Advisory', 1950,
   'Independent technical review of an engineering project scope, feasibility, and execution plan with a written advisory report.',
   'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=900&q=80&auto=format&fit=crop', false, true, now() - interval '2 days'),
  ('Seasonal Styling Retainer', 'Style Package', 4500,
   'Ongoing quarterly styling support: seasonal refreshes, event dressing, and priority access to your consultant throughout the year.',
   'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=900&q=80&auto=format&fit=crop', false, true, now() - interval '1 day')
) as v
where not exists (select 1 from products);

-- Leads ------------------------------------------------------------------
insert into leads (name, email, phone, service, message, status, created_at)
select * from (values
  ('Eleanor Whitfield', 'eleanor.w@example.com', '+1 202 555 0148', 'Wardrobe & Fashion Consulting',
   'I''m stepping into a more public leadership role and want my wardrobe to reflect that. Looking for a full audit and ongoing support.',
   'scheduled', now() - interval '6 days'),
  ('Raymond Osei', 'r.osei@example.com', '+44 20 7946 0321', 'Engineering Consulting',
   'We need an independent advisory review on a mid-size civil project before we commit to the execution phase.',
   'contacted', now() - interval '4 days'),
  ('Priya Anand', 'priya.anand@example.com', '+1 415 555 0199', 'Clothing Design',
   'Interested in a bespoke capsule collection for a personal brand launch next quarter.',
   'new', now() - interval '2 days'),
  ('Marcus Bell', 'marcus.bell@example.com', '+1 312 555 0170', 'General Enquiry',
   'Wanted to understand how your retainer engagements are structured.',
   'new', now() - interval '1 day')
) as v
where not exists (select 1 from leads);
