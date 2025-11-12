## cargar el archivo en memoria y usarlo como contexto


Si estás usando la API de OpenAI (por ejemplo gpt-4-turbo), puedes leer el archivo .ts y pasarlo como parte del prompt.

Ejemplo en Node.js (TypeScript)

import OpenAI from "openai";
import fs from "fs";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Leer el archivo .ts
const fileContent = fs.readFileSync("src/data.ts", "utf8");

// Pregunta del usuario
const userQuestion = "¿Qué hace la función getUserData?";

const response = await openai.chat.completions.create({
  model: "gpt-4-turbo",
  messages: [
    {
      role: "system",
      content: "Eres un asistente experto en este código TypeScript. Usa el contenido del archivo para responder.",
    },
    {
      role: "user",
      content: `Archivo TypeScript:\n${fileContent}\n\nPregunta: ${userQuestion}`,
    },
  ],
});

console.log(response.choices[0].message.content);


---


## Ejemplo sencillo (usando un archivo .ts con datos del negocio)
export const businessInfo = {
  name: "Café Verde",
  description: "Cafetería vegana en San José que ofrece café orgánico y postres sin gluten.",
  hours: "Lunes a sábado, de 8am a 6pm",
  address: "Avenida Central, San José, Costa Rica",
  products: [
    { name: "Capuchino vegano", price: "₡2500" },
    { name: "Brownie sin gluten", price: "₡1800" },
    { name: "Smoothie tropical", price: "₡2200" },
  ],
  contact: "WhatsApp: +506 8888 8888",
};

import express from "express";
import OpenAI from "openai";
import { businessInfo } from "./data/business.js";

const app = express();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(express.json());

app.post("/chat", async (req, res) => {
  const userQuestion = req.body.question;

  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [
      {
        role: "system",
        content:
          "Eres un asistente del negocio. Responde solo con la información del negocio. Si no sabes algo, di que no tienes esa información.",
      },
      {
        role: "user",
        content: `
          Información del negocio:
          ${JSON.stringify(businessInfo, null, 2)}
          
          Pregunta del usuario: ${userQuestion}
        `,
      },
    ],
  });

  res.json({ answer: response.choices[0].message.content });
});

app.listen(3000, () => console.log("Chatbot corriendo en http://localhost:3000"));


## En el frontend (React, por ejemplo)

import { useState } from "react";

export default function Chat() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  async function handleSend() {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
    const data = await res.json();
    setAnswer(data.answer);
  }

  return (
    <div>
      <h1>Chatbot de Café Verde</h1>
      <textarea
        placeholder="Escribe tu pregunta..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <button onClick={handleSend}>Enviar</button>
      <p><strong>Respuesta:</strong> {answer}</p>
    </div>
  );
}


## Cómo “alimentar” el chatbot

Tu chatbot puede nutrirse de:

Archivos .ts o .json (información estática).

Una base de datos (para información dinámica).

Archivos subidos a OpenAI (usando File Search).

Notas o documentos internos (usando embeddings o RAG).

## Controlar lo que responde

En el system prompt puedes decirle cosas como:

“Responde solo con datos oficiales del negocio.”

“Nunca inventes precios ni horarios.”

“Usa tono amable, profesional y conciso.”

Así el chatbot será más coherente y confiable para clientes reales.

--- 
¿Cómo puedo alimentarlo con info de una bbdd de firestore?

[Cliente React]  →  [Backend Serverless (Netlify | Vercel)]  →  [Firestore]  
                                             ↓
                                          [OpenAI]
## Ejemplo práctico

Supongamos que tienes una colección businessInfo con un documento general, que guarda la información del negocio (nombre, horarios, productos, etc.).

businessInfo
  └── general
      ├── name: "Café Verde"
      ├── description: "Cafetería vegana..."
      ├── hours: "Lunes a sábado, 8am a 6pm"
      ├── products: [
      │    { name: "Capuchino vegano", price: 2500 },
      │    { name: "Brownie sin gluten", price: 1800 }
      │  ]
      └── contact: "WhatsApp +506 8888 8888"


## Backend con Express + OpenAI + Firebase Admin SDK
import express from "express";
import OpenAI from "openai";
import admin from "firebase-admin";

const app = express();
app.use(express.json());

// Inicializa Firebase Admin
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});
const db = admin.firestore();

// Inicializa OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/chat", async (req, res) => {
  const { question } = req.body;

  try {
    // Obtiene info del negocio desde Firestore
    const doc = await db.collection("businessInfo").doc("general").get();
    const businessData = doc.data();

    if (!businessData) {
      return res.status(404).json({ error: "No se encontró información del negocio." });
    }

    // Genera la respuesta con OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: `
            Eres el asistente virtual del negocio "${businessData.name}".
            Responde con amabilidad y precisión, solo usando la información del negocio.
            Si el usuario pregunta algo que no esté en la información, di "No tengo esa información disponible".
          `,
        },
        {
          role: "user",
          content: `
            Información del negocio:
            ${JSON.stringify(businessData, null, 2)}
            
            Pregunta: ${question}
          `,
        },
      ],
    });

    res.json({ answer: completion.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.listen(3000, () => console.log("Servidor corriendo en http://localhost:3000"));


## En el frontend (React, por ejemplo)

Solo envías la pregunta al endpoint /chat:
import { useState } from "react";

export default function Chatbot() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  async function sendQuestion() {
    const res = await fetch("http://localhost:3000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
    const data = await res.json();
    setAnswer(data.answer);
  }

  return (
    <div className="chat">
      <h2>Asistente de Café Verde</h2>
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Pregúntame algo..."
      />
      <button onClick={sendQuestion}>Enviar</button>
      <div className="respuesta">{answer}</div>
    </div>
  );
}

## Recomendaciones

Nunca expongas tu API key de OpenAI al frontend.

Si usas Firebase Functions, puedes integrar todo ahí mismo sin Express.

Puedes guardar el historial del chat en Firestore si quieres persistencia por usuario.