export const config = {
api: {
bodyParser: false
}
}

export default async function handler(req, res) {

if (req.method !== "POST") {
return res.status(405).end()
}

try {

const response =
await fetch(
"https://convert-api-production.up.railway.app/upload",
{
method: "POST",

headers: {
authorization: "DANZZ"
},

body: req
}
)

const data =
await response.text()

res.status(200).send(data)

} catch (e) {

res.status(500).json({
status: false,
error: e.message
})

}

}
