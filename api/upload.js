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

const chunks = []

for await (const chunk of req) {
chunks.push(chunk)
}

const body =
Buffer.concat(chunks)

const response =
await fetch(
"https://convert-api-production.up.railway.app/upload",
{
method: "POST",

headers: {
authorization: "DANZZ",
"content-type":
req.headers["content-type"]
},

body
}
)

const data =
await response.text()

res.status(response.status)
.send(data)

} catch (e) {

res.status(500).json({
status: false,
error: e.message
})

}

}
