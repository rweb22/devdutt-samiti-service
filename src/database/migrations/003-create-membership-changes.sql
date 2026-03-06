-- Migration 003: Create membership_changes table (audit trail)

CREATE TABLE samiti.membership_changes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) NOT NULL,
    samiti_id UUID NOT NULL REFERENCES samiti.samitis(id) ON DELETE CASCADE,
    from_role VARCHAR(20),
    to_role VARCHAR(20),
    action VARCHAR(20) NOT NULL,
    changed_by_username VARCHAR(50) NOT NULL,
    justification TEXT,
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Constraints
    CONSTRAINT chk_from_role CHECK (from_role IN ('OBSERVER', 'SADASYA', 'SABHAPATI')),
    CONSTRAINT chk_to_role CHECK (to_role IN ('OBSERVER', 'SADASYA', 'SABHAPATI')),
    CONSTRAINT chk_action CHECK (action IN ('APPOINTED', 'PROMOTED', 'REMOVED'))
);

-- Indexes
CREATE INDEX idx_membership_changes_username ON samiti.membership_changes(username);
CREATE INDEX idx_membership_changes_samiti_id ON samiti.membership_changes(samiti_id);
CREATE INDEX idx_membership_changes_changed_at ON samiti.membership_changes(changed_at DESC);

-- Comments
COMMENT ON TABLE samiti.membership_changes IS 'Audit trail for all membership changes';
COMMENT ON COLUMN samiti.membership_changes.action IS 'Type of change: APPOINTED, PROMOTED, or REMOVED';

