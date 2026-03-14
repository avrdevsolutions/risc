-- Migration: Add missing evaluare fields
-- Issue 6: Architecture Improvements & Final Missing Fields

ALTER TABLE evaluari ADD COLUMN tip_evaluare TEXT;
ALTER TABLE evaluari ADD COLUMN obiective_evaluare TEXT;
ALTER TABLE evaluari ADD COLUMN metode_instrumente TEXT;
