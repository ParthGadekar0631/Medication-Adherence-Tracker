import { db } from "../config/firebase.js";

const collection = db.collection("logs");

export const createLog = async (req, res) => {
  try {
    const { action, userId } = req.body;
    const docRef = await collection.add({
      action,
      userId,
      timestamp: new Date(),
    });
    res.status(201).json({ id: docRef.id, message: "Log recorded" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getLogs = async (req, res) => {
  try {
    const snapshot = await collection.get();
    const logs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
