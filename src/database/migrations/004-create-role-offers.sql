-- Migration 004: Create samiti_role_offers table

CREATE TABLE samiti.samiti_role_offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    offered_to_username VARCHAR(50) NOT NULL,
    platform_role VARCHAR(50) NOT NULL,
    samiti_id UUID REFERENCES samiti.samitis(id) ON DELETE CASCADE,
    offered_by_username VARCHAR(50) NOT NULL,
    justification TEXT,
    status VARCHAR(20) DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    responded_at TIMESTAMP WITH TIME ZONE,

    -- Constraints
    CONSTRAINT chk_status CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED', 'EXPIRED'))
);

-- Indexes
CREATE INDEX idx_role_offers_offered_to ON samiti.samiti_role_offers(offered_to_username);
CREATE INDEX idx_role_offers_samiti_id ON samiti.samiti_role_offers(samiti_id);
CREATE INDEX idx_role_offers_status ON samiti.samiti_role_offers(status);
CREATE INDEX idx_role_offers_pending ON samiti.samiti_role_offers(offered_to_username, status) WHERE status = 'PENDING';

-- Comments
COMMENT ON TABLE samiti.samiti_role_offers IS 'Role offers for Samiti positions';
COMMENT ON COLUMN samiti.samiti_role_offers.platform_role IS 'Role being offered (e.g., SABHAPATI, SADASYA)';
COMMENT ON COLUMN samiti.samiti_role_offers.status IS 'Offer status: PENDING, ACCEPTED, REJECTED, or EXPIRED';

