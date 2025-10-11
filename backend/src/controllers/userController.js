import { db } from "../config/firebase.js";

const collection = db.collection("users");

export const createUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    // ✅ Validate inputs
    if (!name || !email || !role) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // ✅ Create new user document
    const newUser = {
      name,
      email,
      role,
      createdAt: new Date().toISOString(),
    };

    const docRef = await collection.add(newUser);

    return res.status(201).json({
      id: docRef.id,
      message: "User created successfully",
    });
  } catch (error) {
    console.error("🔥 Firestore error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ READ
export const getUsers = async (req, res) => {
  try {
    const snapshot = await collection.get();
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ UPDATE
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!id) return res.status(400).json({ error: "Missing user ID" });

    await collection.doc(id).update(updates);
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ DELETE
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "Missing user ID" });

    await collection.doc(id).delete();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};