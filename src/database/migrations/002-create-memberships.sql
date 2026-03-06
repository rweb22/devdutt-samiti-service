-- Migration 002: Create memberships table

CREATE TABLE samiti.memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) NOT NULL,
    samiti_id UUID NOT NULL REFERENCES samiti.samitis(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,

    -- Constraints
    CONSTRAINT chk_role CHECK (role IN ('OBSERVER', 'SADASYA', 'SABHAPATI'))
);

-- Indexes
CREATE INDEX idx_memberships_username ON samiti.memberships(username);
CREATE INDEX idx_memberships_samiti_id ON samiti.memberships(samiti_id);
CREATE INDEX idx_memberships_active ON samiti.memberships(username, samiti_id) WHERE ended_at IS NULL;
CREATE UNIQUE INDEX idx_memberships_active_unique ON samiti.memberships(username, samiti_id) WHERE ended_at IS NULL;

-- Comments
COMMENT ON TABLE samiti.memberships IS 'User memberships in Samitis with roles';
COMMENT ON COLUMN samiti.memberships.ended_at IS 'When membership ended (null if active)';

