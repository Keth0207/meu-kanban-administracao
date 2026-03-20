const { Client } = require("@notionhq/client");

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const databaseId = process.env.NOTION_DATABASE_ID;

export default async function handler(req, res) {
    // Configura Headers para evitar erros de CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        if (req.method === 'GET') {
            const response = await notion.databases.query({ database_id: databaseId });
            return res.status(200).json(response.results);
        } 
        
        if (req.method === 'POST') {
            const { tarefa, status, projeto, admin, usuario, data } = req.body;
            const response = await notion.pages.create({
                parent: { database_id: databaseId },
                properties: {
                    Tarefa: { title: [{ text: { content: tarefa } }] },
                    Status: { select: { name: status } },
                    Projeto: { rich_text: [{ text: { content: projeto } }] },
                    Admin: { checkbox: admin || false },
                    Usuario: { rich_text: [{ text: { content: usuario } }] },
                    Data: data ? { date: { start: data } } : undefined
                }
            });
            return res.status(200).json(response);
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
