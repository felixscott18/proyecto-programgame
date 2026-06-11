import { Request, Response } from 'express';
import { Bug } from '../models/Bug';
import { isDbConnected } from '../db';

// Seeding standard initial bugs in-memory for testing immediately in the sandbox dev environment
const localBugs: any[] = [
  {
    _id: 'bug_seed_1',
    title: 'Ciclo infinito en depurador de memoria',
    description: 'El bucle while no actualiza el puntero de lectura de datos, lo que ocasiona un bloqueo de memoria.',
    codeSnippet: 'while (hasBufferData) {\n  let chunk = getChunk();\n  // Falta avanzar o desactivar hasBufferData si buffer está vacío\n}',
    severity: 'high',
    status: 'open',
    createdBy: 'sistema',
    creatorName: 'RETRO_BOT',
    createdAt: new Date(Date.now() - 3600000 * 2), // 2 hours ago
  },
  {
    _id: 'bug_seed_2',
    title: 'Error de desbordamiento de índice en array de puntajes',
    description: 'Se intenta consultar arr[arr.length] en lugar de arr[arr.length - 1], lanzando un error indefinido.',
    codeSnippet: 'const lastScore = scoreHistory[scoreHistory.length];\nconsole.log(lastScore.points);',
    severity: 'medium',
    status: 'in-progress',
    createdBy: 'sistema',
    creatorName: 'COMPILADOR_8BIT',
    createdAt: new Date(Date.now() - 3600000), // 1 hour ago
  }
];

export async function createBug(req: any, res: Response) {
  try {
    const { title, description, codeSnippet, severity } = req.body;
    const userId = req.user.id;
    const username = req.user.username;

    if (!title || !description || !codeSnippet) {
      return res.status(400).json({ error: 'Faltan campos obligatorios para registrar el bug.' });
    }

    const dbActive = isDbConnected();

    if (dbActive) {
      const newBug = new Bug({
        title,
        description,
        codeSnippet,
        severity: severity || 'medium',
        status: 'open',
        createdBy: userId,
        creatorName: username,
      });

      await newBug.save();
      return res.status(201).json({
        message: 'Bug registrado correctamente en MongoDB.',
        bug: newBug,
        dbMode: 'mongodb',
      });
    } else {
      const mockId = 'bug_' + Math.random().toString(36).substr(2, 9);
      const newBug = {
        _id: mockId,
        title,
        description,
        codeSnippet,
        severity: severity || 'medium',
        status: 'open',
        createdBy: userId,
        creatorName: username,
        createdAt: new Date(),
      };

      localBugs.push(newBug);
      return res.status(201).json({
        message: 'Bug registrado correctamente (Modo Simulación).',
        bug: newBug,
        dbMode: 'simulation',
      });
    }
  } catch (err: any) {
    console.error('Error in createBug:', err);
    return res.status(500).json({ error: 'Error al registrar el bug.' });
  }
}

export async function getAllBugs(req: Request, res: Response) {
  try {
    const dbActive = isDbConnected();

    if (dbActive) {
      // Find all bugs, sort by date descending
      const bugs = await Bug.find().sort({ createdAt: -1 });
      return res.status(200).json({
        bugs,
        dbMode: 'mongodb',
      });
    } else {
      // Return local fallback bugs, sorted by date descending code
      const sortedBugs = [...localBugs].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      return res.status(200).json({
        bugs: sortedBugs,
        dbMode: 'simulation',
      });
    }
  } catch (err: any) {
    console.error('Error in getAllBugs:', err);
    return res.status(500).json({ error: 'Error al recibir el listado de bugs.' });
  }
}

export async function updateBug(req: any, res: Response) {
  try {
    const { id } = req.params;
    const { title, description, codeSnippet, severity, status } = req.body;
    const userId = req.user.id;

    const dbActive = isDbConnected();

    if (dbActive) {
      const bug = await (Bug as any).findById(id);
      if (!bug) {
        return res.status(404).json({ error: 'El bug solicitado no existe.' });
      }

      // Check authorization (allow modifications to original author, or let users update statuses as community)
      if (bug.createdBy !== userId && status === undefined) {
        return res.status(403).json({ error: 'No tienes permisos para editar este bug de otro programador.' });
      }

      if (title !== undefined) bug.title = title;
      if (description !== undefined) bug.description = description;
      if (codeSnippet !== undefined) bug.codeSnippet = codeSnippet;
      if (severity !== undefined) bug.severity = severity;
      if (status !== undefined) bug.status = status;

      await bug.save();
      return res.status(200).json({
        message: 'Registro de Bug actualizado con éxito en MongoDB.',
        bug,
        dbMode: 'mongodb',
      });
    } else {
      const bug = localBugs.find(b => b._id === id);
      if (!bug) {
        return res.status(404).json({ error: 'El bug solicitado no existe en simulación.' });
      }

      if (bug.createdBy !== userId && status === undefined) {
        return res.status(403).json({ error: 'No tienes permisos para editar este bug de otro programador.' });
      }

      if (title !== undefined) bug.title = title;
      if (description !== undefined) bug.description = description;
      if (codeSnippet !== undefined) bug.codeSnippet = codeSnippet;
      if (severity !== undefined) bug.severity = severity;
      if (status !== undefined) bug.status = status;

      return res.status(200).json({
        message: 'Registro de Bug actualizado (Modo Simulación).',
        bug,
        dbMode: 'simulation',
      });
    }
  } catch (err: any) {
    console.error('Error in updateBug:', err);
    return res.status(500).json({ error: 'Error al actualizar el bug.' });
  }
}

export async function deleteBug(req: any, res: Response) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const dbActive = isDbConnected();

    if (dbActive) {
      const bug = await (Bug as any).findById(id);
      if (!bug) {
        return res.status(404).json({ error: 'El bug solicitado no existe.' });
      }

      // Allow creator to delete it
      if (bug.createdBy !== userId) {
        return res.status(403).json({ error: 'No puedes borrar registros creados por otros programadores.' });
      }

      await (Bug as any).findByIdAndDelete(id);
      return res.status(200).json({
        message: 'Registro de Bug eliminado con éxito de MongoDB.',
        id,
        dbMode: 'mongodb',
      });
    } else {
      const index = localBugs.findIndex(b => b._id === id);
      if (index === -1) {
        return res.status(404).json({ error: 'El bug solicitado no existe en simulación.' });
      }

      const bug = localBugs[index];
      if (bug.createdBy !== userId) {
        return res.status(403).json({ error: 'No puedes borrar registros creados por otros programadores.' });
      }

      localBugs.splice(index, 1);
      return res.status(200).json({
        message: 'Registro de Bug eliminado con éxito (Modo Simulación).',
        id,
        dbMode: 'simulation',
      });
    }
  } catch (err: any) {
    console.error('Error in deleteBug:', err);
    return res.status(500).json({ error: 'Error al eliminar el bug.' });
  }
}
