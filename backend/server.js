// backend/server.js
import express from "express";
import fetch from "node-fetch"; // npm install node-fetch
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

// Tu Access Token de MercadoPago
const ACCESS_TOKEN = "APP_USR-4764885452133102-081816-bb46459ec6ef036c74440404a6096a1d-308809491";

// Endpoint para crear preferencia de pago
app.post("/create-preference", async (req, res) => {
    const { email, uid } = req.body;

    // Generar HWID de 16 dígitos
    const hwid = Array.from({length:16}, () => Math.floor(Math.random()*10)).join("");

    try {
        // Crear preferencia de MercadoPago
        const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${ACCESS_TOKEN}`
            },
            body: JSON.stringify({
                items: [{
                    title: "H-Boost Ultra",
                    quantity: 1,
                    currency_id: "ARS",
                    unit_price: 10 // Cambiar precio
                }],
                back_urls: {
                    success: `http://localhost:5500/success.html?uid=${uid}&hwid=${hwid}`,
                    failure: `http://localhost:5500/failure.html`,
                    pending: `http://localhost:5500/pending.html`
                },
                auto_return: "approved"
            })
        });

        const data = await response.json();
        res.json({ preferenceId: data.id, hwid });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al crear preferencia" });
    }
});

app.listen(5081, () => console.log("Servidor MP corriendo en http://localhost:5081"));
