

const logout = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1] ?? req?.cookies?.jwt

    try {
        res.cookie('jwt', '', { maxAge: 1, httpOnly: true });
        return res.status(200).json({ message: 'user deconeted' })
    } catch (error) {
        console.log(error)
        const message = `Something went worng`
        const errorResponse = APIResponse.error({}, message)
        return res.status(500).json(errorResponse.toJSON())
    }
}

module.exports = logout