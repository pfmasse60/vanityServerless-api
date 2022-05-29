export default {
    _200(body: string) {
        return {
            statusCode: 200,
            body: JSON.stringify(body)
        }
    },
    _400(body: string) {
        return {
            statusCode: 400,
            body: JSON.stringify(body)
        }
    }
}
