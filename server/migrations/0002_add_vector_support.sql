-- Enable the pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create contract_clauses table with vector support
CREATE TABLE IF NOT EXISTS contract_clauses (
    id SERIAL PRIMARY KEY,
    contract_id INTEGER REFERENCES contracts(id),
    clause_text TEXT NOT NULL,
    section_heading TEXT,
    embedding vector(1536),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for vector similarity search
CREATE INDEX IF NOT EXISTS contract_clauses_embedding_idx 
ON contract_clauses 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Create function to match contract clauses
CREATE OR REPLACE FUNCTION match_contract_clauses(
    query_embedding vector(1536),
    match_threshold float,
    match_count int
)
RETURNS TABLE (
    id INTEGER,
    contract_id INTEGER,
    clause_text TEXT,
    section_heading TEXT,
    similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        contract_clauses.id,
        contract_clauses.contract_id,
        contract_clauses.clause_text,
        contract_clauses.section_heading,
        1 - (contract_clauses.embedding <=> query_embedding) as similarity
    FROM contract_clauses
    WHERE 1 - (contract_clauses.embedding <=> query_embedding) > match_threshold
    ORDER BY contract_clauses.embedding <=> query_embedding
    LIMIT match_count;
END;
$$; 