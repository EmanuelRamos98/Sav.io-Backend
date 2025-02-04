export const statusController = (req, res) => {
    res.json({
        status: 200,
        ok: true,
        message: 'pong',
    })
}