-- ============================================================
-- SAMPLE DATA FOR TESTING
-- Run this after the migration to add sample books
-- ============================================================

-- Insert sample books
INSERT INTO books (title, description, price, author, slug, is_published, published_at) VALUES
(
  'The Art of Programming',
  'A comprehensive guide to modern programming practices, design patterns, and software architecture. Perfect for developers looking to level up their skills.',
  2999,
  'John Smith',
  'the-art-of-programming',
  true,
  NOW()
),
(
  'Design Systems Handbook',
  'Learn how to create, maintain, and scale design systems for your organization. Includes real-world case studies and practical examples.',
  2499,
  'Sarah Johnson',
  'design-systems-handbook',
  true,
  NOW()
),
(
  'React Mastery',
  'Master React from basics to advanced patterns. Covers hooks, context, performance optimization, and testing strategies.',
  3499,
  'Michael Chen',
  'react-mastery',
  true,
  NOW()
),
(
  'The Startup Journey',
  'From idea to IPO: A founders guide to building successful technology companies. Lessons learned from 50+ startup founders.',
  1999,
  'Emily Davis',
  'the-startup-journey',
  true,
  NOW()
);

-- Get the book IDs and insert chapters
DO $$
DECLARE
  book1_id UUID;
  book2_id UUID;
  book3_id UUID;
  book4_id UUID;
BEGIN
  -- Get book IDs
  SELECT id INTO book1_id FROM books WHERE slug = 'the-art-of-programming';
  SELECT id INTO book2_id FROM books WHERE slug = 'design-systems-handbook';
  SELECT id INTO book3_id FROM books WHERE slug = 'react-mastery';
  SELECT id INTO book4_id FROM books WHERE slug = 'the-startup-journey';

  -- Insert chapters for Book 1: The Art of Programming
  INSERT INTO chapters (book_id, title, content, order_number) VALUES
  (book1_id, 'Introduction to Programming', '<p>Welcome to the world of programming. This chapter introduces fundamental concepts...</p>', 1),
  (book1_id, 'Variables and Data Types', '<p>Understanding how data is stored and manipulated is crucial for every programmer...</p>', 2),
  (book1_id, 'Control Flow', '<p>Learn about if statements, loops, and how to control the execution of your programs...</p>', 3),
  (book1_id, 'Functions and Modules', '<p>Organize your code effectively using functions and modules for better maintainability...</p>', 4),
  (book1_id, 'Object-Oriented Programming', '<p>Master the principles of OOP: encapsulation, inheritance, and polymorphism...</p>', 5);

  -- Insert chapters for Book 2: Design Systems Handbook
  INSERT INTO chapters (book_id, title, content, order_number) VALUES
  (book2_id, 'What is a Design System?', '<p>A design system is a collection of reusable components, guided by clear standards...</p>', 1),
  (book2_id, 'Building Your Component Library', '<p>Learn how to create modular, reusable components that scale with your organization...</p>', 2),
  (book2_id, 'Documentation Best Practices', '<p>Good documentation is crucial for adoption. Learn how to write clear, helpful docs...</p>', 3),
  (book2_id, 'Governance and Maintenance', '<p>Keep your design system healthy with proper governance processes and contribution guidelines...</p>', 4);

  -- Insert chapters for Book 3: React Mastery
  INSERT INTO chapters (book_id, title, content, order_number) VALUES
  (book3_id, 'React Fundamentals', '<p>Understanding components, JSX, and the virtual DOM...</p>', 1),
  (book3_id, 'Hooks Deep Dive', '<p>Master useState, useEffect, and custom hooks for state management...</p>', 2),
  (book3_id, 'Context API', '<p>Learn when and how to use Context for global state...</p>', 3),
  (book3_id, 'Performance Optimization', '<p>Techniques for optimizing React applications: memoization, code splitting...</p>', 4),
  (book3_id, 'Testing React Apps', '<p>Write effective tests using Jest, React Testing Library, and Cypress...</p>', 5),
  (book3_id, 'Advanced Patterns', '<p>Compound components, render props, and other advanced React patterns...</p>', 6);

  -- Insert chapters for Book 4: The Startup Journey
  INSERT INTO chapters (book_id, title, content, order_number) VALUES
  (book4_id, 'Finding Your Idea', '<p>How to identify problems worth solving and validate your ideas...</p>', 1),
  (book4_id, 'Building the MVP', '<p>Learn to build minimum viable products that help you learn quickly...</p>', 2),
  (book4_id, 'Finding Product-Market Fit', '<p>Techniques for measuring and achieving product-market fit...</p>', 3),
  (book4_id, 'Scaling Your Team', '<p>Hiring, culture, and organizational structure for growing startups...</p>', 4),
  (book4_id, 'Fundraising 101', '<p>Understanding VC funding, term sheets, and investor relations...</p>', 5);

END $$;
