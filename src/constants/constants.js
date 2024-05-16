
const SALT_ROUNDS = 10
const INVALID_TOKEN_TIME = 6 * 30 * 24 * 60 * 60 * 1000 // 6 months
const TOEKN_ID = 'token_id'
const PAGE_LIMIT = 5

module.exports = {
    SALT_ROUNDS,
    INVALID_TOKEN_TIME,
    TOEKN_ID, 
    PAGE_LIMIT
}