

const logout = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1] ?? req?.cookies?.jwt

    try {
        res.cookie('jwt', '', { maxAge: 1, httpOnly: true });
        return res.status(200).json({ message: 'user deconeted' })
    } catch (error) {
        console.log(error)
        const errorMessage = `Something went wrong: ${error.message}` // Capture de l'erreur
        const errorResponse = APIResponse.error({}, errorMessage)
        return res.status(500).json(errorResponse.toJSON())
    }
}

module.exports = logout