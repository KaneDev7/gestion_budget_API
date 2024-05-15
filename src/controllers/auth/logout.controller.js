

const logout = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1] ?? req?.cookies?.jwt

    res.cookie('jwt', '', { maxAge: 1, httpOnly: true });
    return res.status(200).json({message : 'user deconeted'})
}

module.exports = logout