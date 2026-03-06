-- Migration 001: Create samiti schema and samitis table with LTREE hierarchy

-- Create schema
CREATE SCHEMA IF NOT EXISTS samiti;

-- Enable LTREE extension
CREATE EXTENSION IF NOT EXISTS ltree;

-- Create samitis table
CREATE TABLE samiti.samitis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    parent_id UUID REFERENCES samiti.samitis(id),
    path LTREE NOT NULL,

    -- Leadership (username references validated via auth-service API)
    sabhapati_username VARCHAR(50),
    leadership_status VARCHAR(20) DEFAULT 'ACTIVE',
    vacant_since TIMESTAMP WITH TIME ZONE,

    -- Mandate stored as JSONB
    mandate JSONB,

    -- Metadata (username references validated via auth-service API)
    created_by_username VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Constraints
    CONSTRAINT chk_leadership_status CHECK (leadership_status IN ('ACTIVE', 'VACANT'))
);

-- Indexes for performance
CREATE INDEX idx_samitis_root ON samiti.samitis(id) WHERE parent_id IS NULL;
CREATE INDEX idx_samitis_parent ON samiti.samitis(parent_id);
CREATE INDEX idx_samitis_sabhapati_username ON samiti.samitis(sabhapati_username);
CREATE INDEX idx_samitis_path_gist ON samiti.samitis USING GIST (path);
CREATE UNIQUE INDEX idx_samitis_path_unique ON samiti.samitis (path);
CREATE UNIQUE INDEX idx_samitis_parent_name_unique ON samiti.samitis (parent_id, name) WHERE parent_id IS NOT NULL;

-- Path computation function
-- This function automatically computes the ltree path based on parent and name
CREATE OR REPLACE FUNCTION samiti.compute_samiti_path()
RETURNS TRIGGER AS $$
DECLARE
    parent_path LTREE;
    clean_name TEXT;
BEGIN
    -- Normalize name: lowercase, replace non-alphanumeric with underscore
    clean_name := lower(regexp_replace(NEW.name, '[^a-zA-Z0-9_]', '_', 'g'));
    
    IF NEW.parent_id IS NULL THEN
        -- Root samiti: path is just the clean name
        NEW.path := clean_name::LTREE;
    ELSE
        -- Child samiti: path is parent_path.clean_name
        SELECT path INTO parent_path FROM samiti.samitis WHERE id = NEW.parent_id;
        IF parent_path IS NULL THEN
            RAISE EXCEPTION 'Parent Samiti path not found for id %', NEW.parent_id;
        END IF;
        NEW.path := parent_path || clean_name::LTREE;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-compute path on insert/update
CREATE TRIGGER trg_compute_samiti_path
    BEFORE INSERT OR UPDATE OF name, parent_id ON samiti.samitis
    FOR EACH ROW EXECUTE FUNCTION samiti.compute_samiti_path();

-- Comments for documentation
COMMENT ON TABLE samiti.samitis IS 'Samiti governance hierarchy with LTREE path support';
COMMENT ON COLUMN samiti.samitis.path IS 'LTREE path for hierarchical queries (auto-computed by trigger)';
COMMENT ON COLUMN samiti.samitis.sabhapati_username IS 'Current Sabhapati (leader) of the Samiti';
COMMENT ON COLUMN samiti.samitis.leadership_status IS 'Leadership status: ACTIVE (has Sabhapati) or VACANT (awaiting replacement)';
COMMENT ON COLUMN samiti.samitis.vacant_since IS 'Timestamp when leadership became vacant (null when ACTIVE)';
COMMENT ON COLUMN samiti.samitis.mandate IS 'Mission/purpose statement stored as JSONB';

