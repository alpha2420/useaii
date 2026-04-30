console.log("Simulating tests on Next.js endpoints...");
// Using native fetch since it's Next.js 16
fetch("http://localhost:3000/api/settings/get", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ownerId: "69cabe61a4e168e957b7a651" })
})
.then(r => r.json())
.then(data => console.log("Settings endpoint works:", !!data))
.catch(e => console.error(e));
