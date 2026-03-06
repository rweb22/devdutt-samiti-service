-- Migration 005: Create NCM (No Confidence Motion) tables

-- NCM Motions table
CREATE TABLE samiti.ncm_motions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    samiti_id UUID NOT NULL REFERENCES samiti.samitis(id) ON DELETE CASCADE,
    target_sabhapati_username VARCHAR(50) NOT NULL,
    initiated_by_username VARCHAR(50) NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(30) DEFAULT 'COLLECTING_SIGNATURES',
    signature_threshold INT NOT NULL,
    signatures_count INT DEFAULT 0,
    voting_started_at TIMESTAMP WITH TIME ZONE,
    voting_ended_at TIMESTAMP WITH TIME ZONE,
    votes_for INT DEFAULT 0,
    votes_against INT DEFAULT 0,
    votes_abstain INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Constraints
    CONSTRAINT chk_ncm_status CHECK (status IN ('COLLECTING_SIGNATURES', 'VOTING', 'PASSED', 'FAILED')),
    CONSTRAINT chk_signature_threshold CHECK (signature_threshold > 0),
    CONSTRAINT chk_signatures_count CHECK (signatures_count >= 0),
    CONSTRAINT chk_votes_for CHECK (votes_for >= 0),
    CONSTRAINT chk_votes_against CHECK (votes_against >= 0),
    CONSTRAINT chk_votes_abstain CHECK (votes_abstain >= 0)
);

-- NCM Signatures table
CREATE TABLE samiti.ncm_signatures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ncm_motion_id UUID NOT NULL REFERENCES samiti.ncm_motions(id) ON DELETE CASCADE,
    username VARCHAR(50) NOT NULL,
    signed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Unique constraint: one signature per user per motion
    CONSTRAINT uq_ncm_signature UNIQUE (ncm_motion_id, username)
);

-- NCM Votes table
CREATE TABLE samiti.ncm_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ncm_motion_id UUID NOT NULL REFERENCES samiti.ncm_motions(id) ON DELETE CASCADE,
    username VARCHAR(50) NOT NULL,
    vote_type VARCHAR(20) NOT NULL,
    voted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Constraints
    CONSTRAINT chk_vote_type CHECK (vote_type IN ('FOR', 'AGAINST', 'ABSTAIN')),
    -- Unique constraint: one vote per user per motion
    CONSTRAINT uq_ncm_vote UNIQUE (ncm_motion_id, username)
);

-- Indexes
CREATE INDEX idx_ncm_motions_samiti_id ON samiti.ncm_motions(samiti_id);
CREATE INDEX idx_ncm_motions_status ON samiti.ncm_motions(status);
CREATE INDEX idx_ncm_motions_target ON samiti.ncm_motions(target_sabhapati_username);
CREATE INDEX idx_ncm_signatures_motion_id ON samiti.ncm_signatures(ncm_motion_id);
CREATE INDEX idx_ncm_signatures_username ON samiti.ncm_signatures(username);
CREATE INDEX idx_ncm_votes_motion_id ON samiti.ncm_votes(ncm_motion_id);
CREATE INDEX idx_ncm_votes_username ON samiti.ncm_votes(username);

-- Comments
COMMENT ON TABLE samiti.ncm_motions IS 'No Confidence Motions against Sabhapatis';
COMMENT ON TABLE samiti.ncm_signatures IS 'Signatures collected for NCM motions';
COMMENT ON TABLE samiti.ncm_votes IS 'Votes cast on NCM motions';
COMMENT ON COLUMN samiti.ncm_motions.signature_threshold IS 'Number of signatures required to move to voting phase';
COMMENT ON COLUMN samiti.ncm_motions.status IS 'Motion status: COLLECTING_SIGNATURES, VOTING, PASSED, or FAILED';

