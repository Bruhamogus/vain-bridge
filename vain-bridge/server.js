const express = require('express');
const Web3 = require('web3');

const app = express();
const port = process.env.PORT || 3000; // Verwende den Port aus der Umgebung oder 3000 als Standard

app.use(express.json());

// RPC URLs
const BASE_RPC_URL = "https://base-rpc.mainnet.polygon.technology"; // Base Mainnet RPC URL
const ETH_RPC_URL = "https://mainnet.infura.io/v3/d0fc4794dd3f467d9b8f86a6504bf9ad"; // Infura Ethereum Mainnet RPC URL

// Verbinde dich mit den Netzwerken
const web3Base = new Web3(new Web3.providers.HttpProvider(BASE_RPC_URL));
const web3Eth = new Web3(new Web3.providers.HttpProvider(ETH_RPC_URL));

// USDC und PAXG Contract-Adressen
const USDC_BASE_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"; // USDC auf Base
const PAXG_ETH_ADDRESS = "0x45804880De22913dAFE09f4980848ECE6EcbAf78"; // PAXG auf Ethereum

// Route zum Erstellen der Bridge-Quote
app.post('/create-bridge-quote', async (req, res) => {
    const { amount } = req.body;

    if (!amount || isNaN(amount)) {
        return res.status(400).json({ error: 'Ungültiger Betrag' });
    }

    // Berechne den Betrag für die Transaktion
    const amountInWei = web3Base.utils.toWei(amount.toString(), 'ether'); // Umrechnung in Wei für den Transfer

    // Cross-Chain Payload für LayerZero
    const payload = {
        fromChain: 8453, // Base Chain ID
        toChain: 1, // Ethereum Mainnet Chain ID
        fromTokenAddress: USDC_BASE_ADDRESS,
        toTokenAddress: PAXG_ETH_ADDRESS,
        amount: amountInWei,
    };

    // Sende die Quote als Antwort
    res.json(payload);
});

// Server starten
app.listen(port, () => {
    console.log(`Server läuft unter http://localhost:${port}`);
});
