import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { isDbConnected } from '../db';

const JWT_SECRET = process.env.JWT_SECRET || 'retro_coder_jwt_ultra_secret_12345';

// In-memory fallback dataset for smooth live previews
const localUsers: any[] = [];

export async function registerUser(req: Request, res: Response) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Faltan campos obligatorios para el registro.' });
    }

    const emailLow = email.toLowerCase().trim();
    const usernameTrim = username.trim();

    const dbActive = isDbConnected();

    if (dbActive) {
      // Mongoose path
      const existingEmail = await (User as any).findOne({ email: emailLow });
      if (existingEmail) {
        return res.status(400).json({ error: 'El correo electrónico ya está registrado.' });
      }

      const existingUser = await (User as any).findOne({ username: usernameTrim });
      if (existingUser) {
        return res.status(400).json({ error: 'El nombre de usuario ya está en uso.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new (User as any)({
        username: usernameTrim,
        email: emailLow,
        password: hashedPassword,
      });

      await newUser.save();
      const token = jwt.sign({ id: newUser._id, username: newUser.username }, JWT_SECRET, { expiresIn: '7d' });

      return res.status(201).json({
        message: 'Usuario registrado exitosamente en MongoDB.',
        token,
        username: newUser.username,
        email: newUser.email,
        highestScore: newUser.highestScore,
        dbMode: 'mongodb',
      });
    } else {
      // In-Memory Fallback Path
      const existingEmail = localUsers.find(u => u.email === emailLow);
      if (existingEmail) {
        return res.status(400).json({ error: 'El correo electrónico ya está registrado.' });
      }

      const existingUser = localUsers.find(u => u.username === usernameTrim);
      if (existingUser) {
        return res.status(400).json({ error: 'El nombre de usuario ya está en uso.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const mockId = 'mock_usr_' + Math.random().toString(36).substr(2, 9);
      const newUser = {
        _id: mockId,
        username: usernameTrim,
        email: emailLow,
        password: hashedPassword,
        highestScore: 0,
        createdAt: new Date(),
      };

      localUsers.push(newUser);
      const token = jwt.sign({ id: mockId, username: usernameTrim }, JWT_SECRET, { expiresIn: '7d' });

      return res.status(201).json({
        message: 'Usuario registrado exitosamente (Modo Simulación).',
        token,
        username: newUser.username,
        email: newUser.email,
        highestScore: newUser.highestScore,
        dbMode: 'simulation',
      });
    }
  } catch (err: any) {
    console.error('Error in registerUser:', err);
    return res.status(500).json({ error: 'Error del servidor durante el registro.' });
  }
}

export async function loginUser(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Faltan credenciales.' });
    }

    const emailLow = email.toLowerCase().trim();
    const dbActive = isDbConnected();

    if (dbActive) {
      // Mongoose path
      const user = await (User as any).findOne({ email: emailLow });
      if (!user) {
        return res.status(401).json({ error: 'Credenciales inválidas (usuario no encontrado).' });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Credenciales inválidas (contraseña incorrecta).' });
      }

      const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });

      return res.status(200).json({
        message: 'Inicio de sesión exitoso.',
        token,
        username: user.username,
        email: user.email,
        highestScore: user.highestScore,
        dbMode: 'mongodb',
      });
    } else {
      // In-Memory Fallback Path
      const user = localUsers.find(u => u.email === emailLow);
      if (!user) {
        return res.status(401).json({ error: 'Credenciales inválidas (usuario no encontrado).' });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Credenciales inválidas.' });
      }

      const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });

      return res.status(200).json({
        message: 'Inicio de sesión exitoso (Modo Simulación).',
        token,
        username: user.username,
        email: user.email,
        highestScore: user.highestScore,
        dbMode: 'simulation',
      });
    }
  } catch (err: any) {
    console.error('Error in loginUser:', err);
    return res.status(500).json({ error: 'Error del servidor durante el inicio de sesión.' });
  }
}

export async function getProfile(req: any, res: Response) {
  try {
    const userId = req.user.id;
    const dbActive = isDbConnected();

    if (dbActive) {
      const user = await (User as any).findById(userId).select('-password');
      if (!user) {
        return res.status(404).json({ error: 'Perfil de usuario no encontrado.' });
      }
      return res.status(200).json({
        username: user.username,
        email: user.email,
        highestScore: user.highestScore,
        dbMode: 'mongodb',
      });
    } else {
      const user = localUsers.find(u => u._id === userId);
      if (!user) {
        return res.status(404).json({ error: 'Perfil de usuario no encontrado en simulación.' });
      }
      return res.status(200).json({
        username: user.username,
        email: user.email,
        highestScore: user.highestScore,
        dbMode: 'simulation',
      });
    }
  } catch (err: any) {
    console.error('Error in getProfile:', err);
    return res.status(500).json({ error: 'Error al obtener el perfil.' });
  }
}

export async function updateHighScore(req: any, res: Response) {
  try {
    const userId = req.user.id;
    const { score } = req.body;

    if (typeof score !== 'number') {
      return res.status(400).json({ error: 'El puntaje debe ser un número válido.' });
    }

    const dbActive = isDbConnected();

    if (dbActive) {
      const user = await (User as any).findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado.' });
      }

      if (score > user.highestScore) {
        user.highestScore = score;
        await user.save();
      }

      return res.status(200).json({
        message: 'Puntaje máximo actualizado en MongoDB.',
        highestScore: user.highestScore,
        dbMode: 'mongodb',
      });
    } else {
      const user = localUsers.find(u => u._id === userId);
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado.' });
      }

      if (score > user.highestScore) {
        user.highestScore = score;
      }

      return res.status(200).json({
        message: 'Puntaje máximo actualizado (Modo Simulación).',
        highestScore: user.highestScore,
        dbMode: 'simulation',
      });
    }
  } catch (err: any) {
    console.error('Error in updateHighScore:', err);
    return res.status(500).json({ error: 'Error del servidor al actualizar puntaje.' });
  }
}
