-- Migration 010: Add project_type column to leads table
-- Run in Supabase SQL Editor

ALTER TABLE leads ADD COLUMN IF NOT EXISTS project_type text;
