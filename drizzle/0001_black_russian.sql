ALTER TABLE "messages" ADD COLUMN "vec" tsvector GENERATED ALWAYS AS (setweight(to_tsvector('config_2_gram_cjk', coalesce(content, '')), 'A')) STORED;

CREATE index vec_gin ON messages USING gin(vec);