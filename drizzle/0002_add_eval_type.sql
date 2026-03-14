-- Migration: Add eval_type column for multi-type evaluation support
-- Issue: Route Restructure + Home Page

ALTER TABLE evaluari ADD COLUMN eval_type TEXT NOT NULL DEFAULT 'securitate_fizica';
