CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS user_bets CASCADE;
DROP TABLE IF EXISTS bets_options CASCADE;
DROP TABLE IF EXISTS bets CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS users CASCADE;

DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS transaction_type CASCADE;
DROP TYPE IF EXISTS audit_action CASCADE;

CREATE TYPE user_role AS ENUM ('user', 'admin');
CREATE TYPE transaction_type AS ENUM (
    'DEPOSIT',
    'WITHDRAWAL',
    'BET',
    'WIN',
    'BONUS',
    'REFUND'
);
CREATE TYPE audit_action AS ENUM (
    'USER_REGISTER', 
    'BET_PLACED', 
    'BET_RESULT', 
    'BALANCE_UPDATED', 
    'ADMIN_ACTION',
    'GAME_RESULT' 
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    balance DECIMAL(10, 2) DEFAULT 0.00 CHECK (balance >= 0),
    role user_role DEFAULT 'user',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    refresh_token_hash VARCHAR(255) NOT NULL,
    device_info TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    revoked BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
    type transaction_type NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE bets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ends_at TIMESTAMP NOT NULL,
    label VARCHAR(255) NOT NULL
);

CREATE TABLE bets_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bet_id UUID NOT NULL,
    label VARCHAR(255) NOT NULL,
    odd DECIMAL(10, 2) NOT NULL DEFAULT 2.00 CHECK (odd >= 1.01),
    FOREIGN KEY (bet_id) REFERENCES bets(id) ON DELETE CASCADE
);

CREATE TABLE user_bets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    bet_option_id UUID NOT NULL,
    amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
    odd DECIMAL(10, 2) NOT NULL CHECK (odd >= 1.01),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (bet_option_id) REFERENCES bets_options(id) ON DELETE CASCADE
);

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    action audit_action NOT NULL,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_user_bets_user_id ON user_bets(user_id);
CREATE INDEX idx_bets_options_bet_id ON bets_options(bet_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_modtime
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_user_bets_modtime
    BEFORE UPDATE ON user_bets
    FOR EACH ROW
    EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_bets_modtime
    BEFORE UPDATE ON bets
    FOR EACH ROW
    EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_sessions_modtime
    BEFORE UPDATE ON sessions
    FOR EACH ROW
    EXECUTE PROCEDURE update_modified_column();

----- base bets
INSERT INTO bets (id, label, ends_at)
VALUES
    (gen_random_uuid(), '¿Sale GTA 6 antes de que vuelva Cristo?', NOW() + INTERVAL '365 days'),
    (gen_random_uuid(), '¿Half-Life 3 existe o fue un efecto Mandela?', NOW() + INTERVAL '730 days'),
    (gen_random_uuid(), '¿George R.R. Martin termina los libros antes del colapso mundial?', NOW() + INTERVAL '500 days'),
    (gen_random_uuid(), '¿Stardew Valley recibe otra update antes de que tengas pareja?', NOW() + INTERVAL '120 days'),
    (gen_random_uuid(), '¿El Imperio Galáctico gestionaría mejor los impuestos que España?', NOW() + INTERVAL '90 days'),
    (gen_random_uuid(), '¿Anakin se habría calmado con una Estrella Galicia fría?', NOW() + INTERVAL '45 days'),
    (gen_random_uuid(), '¿Putin ragequittea antes que Riot arregle el cliente del LoL?', NOW() + INTERVAL '180 days'),
    (gen_random_uuid(), '¿Europa sobrevive otro invierno a base de mantas y fe?', NOW() + INTERVAL '150 days'),
    (gen_random_uuid(), '¿Steam vuelve a caerse en plenas rebajas?', NOW() + INTERVAL '20 days'),
    (gen_random_uuid(), '¿Discord aguanta un viernes sin explotar?', NOW() + INTERVAL '15 days'),
    (gen_random_uuid(), '¿EA saca un juego sin microtransacciones?', NOW() + INTERVAL '999 days'),
    (gen_random_uuid(), '¿La tercera guerra mundial empieza por un meme?', NOW() + INTERVAL '365 days'),
    (gen_random_uuid(), '¿El precio de la cerveza baja alguna vez?', NOW() + INTERVAL '600 days'),
    (gen_random_uuid(), '¿Valve sabe contar hasta 3?', NOW() + INTERVAL '1000 days'),
    (gen_random_uuid(), '¿Nintendo demanda a otro fan project esta semana?', NOW() + INTERVAL '7 days'),
    (gen_random_uuid(), '¿Chewbacca aprobaría la piña en la pizza?', NOW() + INTERVAL '60 days'),
    (gen_random_uuid(), '¿Un admin rompe producción un viernes a las 19:58?', NOW() + INTERVAL '14 days'),
    (gen_random_uuid(), '¿Francia monta otra revolución por subir 2€ el pan?', NOW() + INTERVAL '200 days'),
    (gen_random_uuid(), '¿ConcernedApe duerme alguna vez?', NOW() + INTERVAL '300 days'),
    (gen_random_uuid(), '¿El próximo Papa será streamer de Twitch?', NOW() + INTERVAL '900 days');

INSERT INTO bets_options (bet_id, label, odd)
SELECT id, 'Sí, claramente', ROUND((1 + random() * 2)::numeric, 2)
FROM bets;

INSERT INTO bets_options (bet_id, label, odd)
SELECT id, 'No, ni de coña', ROUND((1 + random() * 3)::numeric, 2)
FROM bets;

INSERT INTO bets_options (bet_id, label, odd)
SELECT id, 'Depende del lore', ROUND((2 + random() * 4)::numeric, 2)
FROM bets;
